// Cloudflare R2 (S3-compatible) media storage. Presigned uploads so files go browser
// -> R2 directly, never through our server. No-ops safely until R2 env vars are set,
// see .env.example, so the rest of the app can be built and tested before that exists.
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { env, hasR2 } from "@/lib/env";

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const ALLOWED_MIME: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",
};

function client() {
  if (!hasR2) throw new Error("R2 is not configured");
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// "post" = a contributor's photo/video; "recipient" = a photo of who the board is for,
// set by the creator. Recipient photos are still images only and live under boards/.
export type UploadPurpose = "post" | "recipient";
export type PresignInput = { mimeType: string; sizeBytes: number; purpose?: UploadPurpose };

const RECIPIENT_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function presignUpload({ mimeType, sizeBytes, purpose = "post" }: PresignInput) {
  const mediaType = ALLOWED_MIME[mimeType];
  if (!mediaType || (purpose === "recipient" && !RECIPIENT_MIME.has(mimeType))) {
    return {
      ok: false as const,
      error: purpose === "recipient" ? "Please choose a JPG, PNG or WebP photo." : "Unsupported file type.",
    };
  }

  const cap = mediaType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (sizeBytes > cap) {
    return { ok: false as const, error: `File is too large (max ${Math.round(cap / 1024 / 1024)}MB).` };
  }

  if (!hasR2) {
    return { ok: false as const, error: "Media uploads aren't configured yet." };
  }

  const ext = mimeType.split("/")[1];
  const folder = purpose === "recipient" ? "boards" : "posts";
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${nanoid(16)}.${ext}`;

  const uploadUrl = await getSignedUrl(
    client(),
    new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, ContentType: mimeType, ContentLength: sizeBytes }),
    { expiresIn: 300 }
  );

  const publicUrl = `${env.R2_PUBLIC_URL}/${key}`;

  return { ok: true as const, uploadUrl, publicUrl, mediaType, key };
}

// True only for recipient photos we signed ourselves, so a board can't be pointed at an
// arbitrary third-party image URL.
export function isRecipientPhotoUrl(url: string) {
  return Boolean(env.R2_PUBLIC_URL) && url.startsWith(`${env.R2_PUBLIC_URL}/boards/`);
}

// A contributor's photo/video must be one we signed under posts/, never an arbitrary URL.
export function isPostMediaUrl(url: string) {
  return Boolean(env.R2_PUBLIC_URL) && url.startsWith(`${env.R2_PUBLIC_URL}/posts/`);
}

// GIFs come from the GIPHY picker, served from GIPHY's media CDN over https.
export function isGiphyUrl(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && /^(media\d*|i)\.giphy\.com$/.test(hostname);
  } catch {
    return false;
  }
}

export async function deleteMedia(publicUrl: string) {
  if (!hasR2 || !env.R2_PUBLIC_URL) return;
  if (!publicUrl.startsWith(env.R2_PUBLIC_URL)) return; // not ours (e.g. a Giphy URL)
  const key = publicUrl.slice(env.R2_PUBLIC_URL.length + 1);
  await client().send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
}

// The object key from a stored media URL, read from the path rather than the host, so a
// change of R2_PUBLIC_URL (e.g. a custom media domain) can't make live files look unused.
export function mediaKeyFromUrl(publicUrl: string) {
  try {
    const key = decodeURIComponent(new URL(publicUrl).pathname.slice(1));
    return /^(posts|boards)\//.test(key) ? key : null;
  } catch {
    return null;
  }
}

// Every uploaded object under our prefixes, with its upload time (for the orphan sweep).
export async function listUploadedObjects() {
  const out: { key: string; lastModified: Date }[] = [];
  for (const prefix of ["posts/", "boards/"]) {
    let token: string | undefined;
    do {
      const page = await client().send(
        new ListObjectsV2Command({ Bucket: env.R2_BUCKET, Prefix: prefix, ContinuationToken: token })
      );
      for (const o of page.Contents ?? []) {
        if (o.Key && o.LastModified) out.push({ key: o.Key, lastModified: o.LastModified });
      }
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
  }
  return out;
}

export async function deleteMediaKeys(keys: string[]) {
  for (let i = 0; i < keys.length; i += 1000) {
    await client().send(
      new DeleteObjectsCommand({
        Bucket: env.R2_BUCKET,
        Delete: { Objects: keys.slice(i, i + 1000).map((Key) => ({ Key })), Quiet: true },
      })
    );
  }
}
