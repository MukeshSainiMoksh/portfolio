"""
Simple in-memory rate limiter (per-IP, sliding window).
Single-instance deployments only — for multi-instance use Redis-based limiting.
"""

import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request, status

# ip -> deque of request timestamps, kept per limiter instance
_WINDOWS: dict[str, dict[str, deque]] = defaultdict(dict)


def rate_limit(name: str, max_requests: int, window_seconds: int):
    """
    Dependency factory: allow `max_requests` per `window_seconds` per client IP.

    Usage:
        @router.post("/login", dependencies=[Depends(rate_limit("login", 5, 60))])
    """
    buckets = _WINDOWS[name]

    async def _check(request: Request) -> None:
        # honour reverse-proxy header if present, else direct client
        forwarded = request.headers.get("x-forwarded-for")
        ip = forwarded.split(",")[0].strip() if forwarded else (
            request.client.host if request.client else "unknown"
        )

        now = time.monotonic()
        q = buckets.setdefault(ip, deque())

        # drop timestamps outside the window
        while q and now - q[0] > window_seconds:
            q.popleft()

        if len(q) >= max_requests:
            retry_after = int(window_seconds - (now - q[0])) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(retry_after)},
            )

        q.append(now)

        # opportunistic cleanup so idle IPs don't leak memory
        if len(buckets) > 10_000:
            stale = [k for k, v in buckets.items() if not v or now - v[-1] > window_seconds]
            for k in stale:
                del buckets[k]

    return _check
