"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/services/api";

interface AssetInfo {
  exists: boolean;
  url: string | null;
  size_bytes: number | null;
  updated_at: number | null;
}

interface AssetsStatus {
  resume: AssetInfo;
  intro_video: AssetInfo;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString();
}

export default function SiteAssetsPage() {
  const [status, setStatus] = useState<AssetsStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/assets/");
      setStatus(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Resume &amp; Intro Video</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Upload the latest versions — the website automatically uses them everywhere.
      </p>

      {loading ? (
        <p className="text-gray-400 py-16 text-center">Loading…</p>
      ) : (
        <div className="space-y-6">
          <AssetCard
            title="Resume (CV)"
            icon="📄"
            hint="PDF only · max 10 MB · used by the website's Download CV button"
            accept=".pdf"
            endpoint="/api/admin/assets/resume"
            info={status?.resume ?? null}
            onUploaded={load}
          />
          <AssetCard
            title="Intro Video"
            icon="🎬"
            hint="MP4 / WebM / MOV · max 100 MB · plays in the website's intro section"
            accept=".mp4,.webm,.mov"
            endpoint="/api/admin/assets/intro-video"
            info={status?.intro_video ?? null}
            onUploaded={load}
          />
        </div>
      )}
    </div>
  );
}

function AssetCard({
  title,
  icon,
  hint,
  accept,
  endpoint,
  info,
  onUploaded,
}: {
  title: string;
  icon: string;
  hint: string;
  accept: string;
  endpoint: string;
  info: AssetInfo | null;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setProgress(0);
    const form = new FormData();
    form.append("file", file);
    try {
      await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      onUploaded();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(detail || "Upload failed. Please try again.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const publicUrl = info?.url ? `${API_URL}${info.url}` : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{hint}</p>

            {info?.exists ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5 text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Live on website
                </span>
                <span className="text-gray-500">{formatSize(info.size_bytes)}</span>
                <span className="text-gray-400 text-xs">
                  Updated {formatDate(info.updated_at)}
                </span>
                {publicUrl && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Preview ↗
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                Not uploaded yet — website is using its bundled fallback.
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={progress !== null}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {progress !== null
              ? `Uploading ${progress}%`
              : info?.exists
              ? "Replace"
              : "Upload"}
          </button>
        </div>
      </div>

      {progress !== null && (
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
