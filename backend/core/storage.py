"""
File storage — one interface, two backends.

Uploads used to be written straight to the local filesystem. That is fine on
a VPS, but on most managed hosts (Render, Railway, Fly without a volume,
anything serverless) the filesystem is ephemeral: every deploy or restart
wipes it, so an uploaded resume or certificate badge silently disappears.

`STORAGE_BACKEND=local` keeps the old behaviour for development.
`STORAGE_BACKEND=s3` writes to any S3-compatible bucket — Cloudflare R2,
Backblaze B2, AWS S3 — so uploads survive redeploys.
"""

from __future__ import annotations

import logging
import posixpath
import re
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from tempfile import SpooledTemporaryFile
from typing import BinaryIO, Optional

from starlette.concurrency import run_in_threadpool

from core.config import settings

logger = logging.getLogger("portfolio.storage")

# Keys are POSIX-ish relative paths: "site/resume.pdf", "8f3c-....jpg".
_SAFE_KEY = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]*$")

# Above this, the spooled upload buffer rolls over to a temp file on disk
# instead of staying in memory.
_SPOOL_MAX = 8 * 1024 * 1024


@dataclass(frozen=True)
class StoredFile:
    size: int
    modified_at: float


class StorageError(RuntimeError):
    pass


def _validate_key(key: str) -> str:
    key = key.strip().lstrip("/")
    if not _SAFE_KEY.match(key) or ".." in key.split("/"):
        raise StorageError(f"Unsafe storage key: {key!r}")
    return key


class Storage(ABC):
    """Backends are addressed by key; callers never build paths or URLs."""

    @abstractmethod
    async def save(self, key: str, data: BinaryIO, content_type: Optional[str]) -> None: ...

    @abstractmethod
    async def delete(self, key: str) -> None: ...

    @abstractmethod
    async def stat(self, key: str) -> Optional[StoredFile]: ...

    @abstractmethod
    def url(self, key: str) -> str:
        """Public URL for a stored object."""

    @property
    def serves_static_locally(self) -> bool:
        """True when the app itself must expose the files over HTTP."""
        return False


class LocalStorage(Storage):
    """Writes under UPLOAD_DIR; FastAPI serves them at /uploads."""

    def __init__(self, base_dir: str, url_prefix: str = "/uploads") -> None:
        self.base = Path(base_dir)
        self.url_prefix = url_prefix.rstrip("/")

    def _path(self, key: str) -> Path:
        path = (self.base / _validate_key(key)).resolve()
        # belt and braces: the resolved path must stay inside the base dir
        if not str(path).startswith(str(self.base.resolve())):
            raise StorageError(f"Key escapes upload dir: {key!r}")
        return path

    async def save(self, key: str, data: BinaryIO, content_type: Optional[str] = None) -> None:
        path = self._path(key)

        def _write() -> None:
            path.parent.mkdir(parents=True, exist_ok=True)
            # write to a sibling temp file, then replace — the public URL never
            # serves a half-written file
            tmp = path.with_name(f".{path.name}.tmp")
            try:
                data.seek(0)
                with open(tmp, "wb") as out:
                    while chunk := data.read(1024 * 1024):
                        out.write(chunk)
                tmp.replace(path)
            except Exception:
                tmp.unlink(missing_ok=True)
                raise

        await run_in_threadpool(_write)

    async def delete(self, key: str) -> None:
        path = self._path(key)
        await run_in_threadpool(lambda: path.unlink(missing_ok=True))

    async def stat(self, key: str) -> Optional[StoredFile]:
        path = self._path(key)

        def _stat() -> Optional[StoredFile]:
            if not path.exists():
                return None
            st = path.stat()
            return StoredFile(size=st.st_size, modified_at=st.st_mtime)

        return await run_in_threadpool(_stat)

    def url(self, key: str) -> str:
        return f"{self.url_prefix}/{_validate_key(key)}"

    @property
    def serves_static_locally(self) -> bool:
        return True


class S3Storage(Storage):
    """Any S3-compatible bucket. Tested against Cloudflare R2.

    boto3 is synchronous, so every call goes through the threadpool rather
    than blocking the event loop.
    """

    def __init__(
        self,
        *,
        bucket: str,
        endpoint_url: str,
        access_key: str,
        secret_key: str,
        public_base_url: str,
        region: str = "auto",
        prefix: str = "",
    ) -> None:
        try:
            import boto3
            from botocore.config import Config
        except ImportError as exc:  # pragma: no cover - import guard
            raise StorageError(
                "STORAGE_BACKEND=s3 requires boto3 — add it to requirements.txt"
            ) from exc

        self.bucket = bucket
        self.prefix = prefix.strip("/")
        self.public_base_url = public_base_url.rstrip("/")
        self._client = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
            # R2 requires SigV4 and rejects the chunked-checksum defaults that
            # newer botocore versions send unless they are turned off.
            # Path-style addressing works on every S3-compatible host we
            # target (R2, B2, Supabase); virtual-host style breaks on
            # Supabase, whose endpoint carries a path segment.
            config=Config(
                signature_version="s3v4",
                retries={"max_attempts": 3},
                s3={"addressing_style": "path"},
            ),
        )

    def _object_key(self, key: str) -> str:
        key = _validate_key(key)
        return posixpath.join(self.prefix, key) if self.prefix else key

    async def save(self, key: str, data: BinaryIO, content_type: Optional[str] = None) -> None:
        object_key = self._object_key(key)
        extra = {"ContentType": content_type} if content_type else {}

        def _put() -> None:
            data.seek(0)
            # R2 has no ACLs — public access is a bucket-level setting.
            self._client.upload_fileobj(data, self.bucket, object_key, ExtraArgs=extra)

        await run_in_threadpool(_put)

    async def delete(self, key: str) -> None:
        object_key = self._object_key(key)
        await run_in_threadpool(
            lambda: self._client.delete_object(Bucket=self.bucket, Key=object_key)
        )

    async def stat(self, key: str) -> Optional[StoredFile]:
        object_key = self._object_key(key)

        def _head() -> Optional[StoredFile]:
            try:
                head = self._client.head_object(Bucket=self.bucket, Key=object_key)
            except Exception:
                return None
            return StoredFile(
                size=head["ContentLength"],
                modified_at=head["LastModified"].timestamp(),
            )

        return await run_in_threadpool(_head)

    def url(self, key: str) -> str:
        object_key = self._object_key(key)
        return f"{self.public_base_url}/{object_key}"


def spooled_copy() -> SpooledTemporaryFile:
    """Buffer for streaming an upload before it is handed to a backend.

    Keeps small files in memory and rolls larger ones to disk, so a 100MB
    video upload does not sit in RAM.
    """
    return SpooledTemporaryFile(max_size=_SPOOL_MAX)


_storage: Optional[Storage] = None


def get_storage() -> Storage:
    global _storage
    if _storage is not None:
        return _storage

    if settings.STORAGE_BACKEND == "s3":
        _storage = S3Storage(
            bucket=settings.S3_BUCKET,
            endpoint_url=settings.S3_ENDPOINT_URL,
            access_key=settings.S3_ACCESS_KEY_ID,
            secret_key=settings.S3_SECRET_ACCESS_KEY,
            public_base_url=settings.S3_PUBLIC_BASE_URL,
            region=settings.S3_REGION,
            prefix=settings.S3_PREFIX,
        )
        logger.info("Storage backend: s3 (bucket=%s)", settings.S3_BUCKET)
    else:
        _storage = LocalStorage(settings.UPLOAD_DIR)
        logger.info("Storage backend: local (%s)", settings.UPLOAD_DIR)

    return _storage
