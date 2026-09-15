// Server-side Giphy proxy so the API key never reaches the client.
import { NextResponse } from "next/server";
import { env, hasGiphy } from "@/lib/env";

export async function GET(request: Request) {
  if (!hasGiphy) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const giphyUrl = q
    ? `https://api.giphy.com/v1/gifs/search?api_key=${env.GIPHY_API_KEY}&q=${encodeURIComponent(q)}&limit=18&rating=g`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${env.GIPHY_API_KEY}&limit=18&rating=g`;

  const res = await fetch(giphyUrl);
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "GIF search is unavailable right now." }, { status: 502 });
  }

  const data = await res.json();
  const results = (data.data as unknown[]).map((g) => {
    const gif = g as { id: string; images: { fixed_width: { url: string }; original: { url: string } } };
    return { id: gif.id, previewUrl: gif.images.fixed_width.url, url: gif.images.original.url };
  });

  return NextResponse.json({ ok: true, results });
}
