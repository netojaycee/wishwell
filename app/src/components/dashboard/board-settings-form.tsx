"use client";

import { useState } from "react";
import { updateBoardAction } from "@/app/actions/moderation";
import type { BoardWithRelations } from "@/lib/types";

export function BoardSettingsForm({ board }: { board: BoardWithRelations }) {
  const [title, setTitle] = useState(board.title);
  const [headline, setHeadline] = useState(board.headline ?? "");
  const [visibility, setVisibility] = useState(board.visibility);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await updateBoardAction(board.id, board.slug, { title, headline, visibility });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-black/10 p-4">
      <h2 className="font-heading text-lg">Board settings</h2>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-black/60">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60">Headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as typeof visibility)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <option value="public">Public — indexable, anyone with the link</option>
            <option value="unlisted">Unlisted — link only, not indexed</option>
            <option value="private">Private — owner and invitees only</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
