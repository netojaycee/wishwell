"use client";

import { useRef, useState } from "react";

type Media = { url: string; type: "image" | "video" } | null;

export function MediaUploader({
  onChange,
  accent,
}: {
  onChange: (media: Media) => void;
  accent: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<Media>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);

    const signRes = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mimeType: file.type, sizeBytes: file.size }),
    });
    const signed = await signRes.json();

    if (!signed.ok) {
      setError(signed.error ?? "Couldn't start the upload.");
      setProgress(null);
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signed.uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    }).catch(() => setError("Upload failed — try a smaller file or a different format."));

    setProgress(null);
    const media: Media = { url: signed.publicUrl, type: signed.mediaType };
    setPreview(media);
    onChange(media);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border px-4 py-2 text-sm font-medium"
          style={{ borderColor: accent, color: accent }}
        >
          {progress !== null ? `Uploading… ${progress}%` : "Add a photo or video"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          {preview.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- small local preview, not the rendered post
            <img src={preview.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <video src={preview.url} className="h-16 w-16 rounded-lg object-cover" muted />
          )}
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange(null);
            }}
            className="text-sm underline underline-offset-2"
          >
            Remove
          </button>
        </div>
      )}

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
