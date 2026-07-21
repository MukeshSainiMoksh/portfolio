"use client";

import { useEffect, useState, ChangeEvent } from "react";
import api from "@/services/api";

interface MediaFile {
  id: number;
  filename: string;       // UUID stored filename
  original_name: string;  // display name
  file_url: string;       // /uploads/uuid.jpg
  file_type: string;
  mime_type: string | null;
  file_size: number;
  alt_text: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const res = await api.get("/api/admin/media/files");
      setFiles(res.data);
    } catch {
      setMessage("Failed to load media files.");
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      await api.post("/api/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("File uploaded successfully.");
      load();
    } catch {
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;
    try {
      await api.delete(`/api/admin/media/files/${id}`);
      load();
    } catch {
      setMessage("Delete failed.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Media Library</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-3">Upload File</h2>
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*,.pdf" />
          <span className="btn-primary inline-block">{uploading ? "Uploading..." : "Choose File"}</span>
          <span className="text-sm text-gray-500">Images, PDFs supported (max 10 MB)</span>
        </label>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Uploaded Files ({files.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map(file => (
            <div key={file.id} className="border rounded-lg overflow-hidden">
              {file.file_type === "image" ? (
                <img
                  src={`${API_URL}${file.file_url}`}
                  alt={file.alt_text ?? file.original_name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm capitalize">
                  {file.file_type}
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate">{file.original_name}</p>
                <p className="text-xs text-gray-400">{formatBytes(file.file_size)}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => navigator.clipboard.writeText(`${API_URL}${file.file_url}`)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy URL
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {files.length === 0 && <p className="col-span-4 text-gray-400 text-sm text-center py-8">No files uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}
