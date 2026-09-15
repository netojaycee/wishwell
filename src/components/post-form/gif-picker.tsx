"use client";

import { useEffect, useState } from "react";

type Gif = { id: string; previewUrl: string; url: string };

export function GifPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/gifs/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setGifs(data.results ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs…"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <button type="button" onClick={onClose} className="text-sm text-black/50">
          Close
        </button>
      </div>
      <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">
        {loading ? (
          <p className="col-span-3 py-6 text-center text-sm text-black/40">Loading…</p>
        ) : (
          gifs.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.url)}
              className="overflow-hidden rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Giphy thumbnail, not board content */}
              <img src={g.previewUrl} alt="" className="h-20 w-full object-cover" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
