// Browser-side upload to R2: ask /api/upload/sign for a presigned URL, then PUT the file
// straight to R2 with progress. Shared by the post media uploader and recipient photos.
export type UploadResult =
  | { ok: true; url: string; mediaType: "image" | "video" }
  | { ok: false; error: string };

export async function uploadFile(
  file: File,
  { purpose = "post", onProgress }: { purpose?: "post" | "recipient"; onProgress?: (pct: number) => void } = {}
): Promise<UploadResult> {
  let signed: { ok: boolean; error?: string; uploadUrl?: string; publicUrl?: string; mediaType?: "image" | "video" };
  try {
    const res = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mimeType: file.type, sizeBytes: file.size, purpose }),
    });
    signed = await res.json();
  } catch {
    return { ok: false, error: "We couldn't reach the server. Check your connection and try again." };
  }
  if (!signed.ok || !signed.uploadUrl || !signed.publicUrl || !signed.mediaType) {
    return { ok: false, error: signed.error ?? "Couldn't start the upload." };
  }

  // A failed PUT must never be treated as success: the URL would look fine but nothing
  // would be stored behind it, so the photo would render blank everywhere.
  const uploaded = await new Promise<boolean>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signed.uploadUrl!);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => resolve(xhr.status < 300);
    xhr.onerror = () => resolve(false);
    xhr.send(file);
  });

  if (!uploaded) return { ok: false, error: "Upload failed. Try a smaller file or a different format." };
  return { ok: true, url: signed.publicUrl, mediaType: signed.mediaType };
}

// Phone photos are often 4000px+ and several MB; the board shows them at a few hundred
// pixels with image optimization off (see next.config.ts), so shrink before upload.
// JPEG output keeps them readable by the OG image renderer. Falls back to the original.
export async function shrinkImage(file: File, maxEdge = 1600): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
