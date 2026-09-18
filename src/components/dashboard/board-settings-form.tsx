"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBoardAction } from "@/app/actions/moderation";
import { RecipientPhotosField } from "@/components/create/recipient-photos-field";
import { boardSettingsSchema, RECIPIENT_BIO_MAX, type BoardSettingsValues } from "@/lib/validation/board";
import type { BoardWithRelations } from "@/lib/types";

const INPUT =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none aria-[invalid=true]:border-red-400";

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}

export function BoardSettingsForm({ board, mediaEnabled }: { board: BoardWithRelations; mediaEnabled: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BoardSettingsValues>({
    resolver: zodResolver(boardSettingsSchema),
    mode: "onTouched",
    defaultValues: {
      recipientName: board.recipientName,
      title: board.title,
      headline: board.headline ?? "",
      recipientBio: board.recipientBio ?? "",
      recipientPhotos: board.recipientPhotos ?? [],
      visibility: board.visibility,
    },
  });

  const onSubmit = async (values: BoardSettingsValues) => {
    setServerError(null);
    setSaved(false);
    const result = await updateBoardAction(board.id, board.slug, values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    reset(values);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const bioLength = useWatch({ control, name: "recipientBio" })?.length ?? 0;

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
      <h2 className="font-heading text-lg">Board settings</h2>
      <div className="mt-3 space-y-3">
        <label className="block text-xs font-medium text-black/60">
          Who it&apos;s for
          <input {...register("recipientName")} aria-invalid={Boolean(errors.recipientName)} className={INPUT} />
          <FieldError message={errors.recipientName?.message} />
        </label>
        <label className="block text-xs font-medium text-black/60">
          Title
          <input {...register("title")} aria-invalid={Boolean(errors.title)} className={INPUT} />
          <FieldError message={errors.title?.message} />
        </label>
        <label className="block text-xs font-medium text-black/60">
          Headline
          <input {...register("headline")} aria-invalid={Boolean(errors.headline)} className={INPUT} />
          <FieldError message={errors.headline?.message} />
        </label>
        {mediaEnabled ? (
          <div role="group" aria-label="Photos">
            <p className="text-xs font-medium text-black/60">Photos (the first is the main one)</p>
            <div className="mt-1">
              <Controller
                control={control}
                name="recipientPhotos"
                render={({ field, fieldState }) => (
                  <RecipientPhotosField
                    compact
                    value={field.value}
                    onChange={field.onChange}
                    recipientName={board.recipientName}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        ) : null}
        <label className="block text-xs font-medium text-black/60">
          About them
          <textarea
            {...register("recipientBio")}
            rows={4}
            aria-invalid={Boolean(errors.recipientBio)}
            className={`${INPUT} resize-none leading-relaxed`}
          />
          <span className="mt-0.5 block text-right font-normal text-black/35">
            {bioLength}/{RECIPIENT_BIO_MAX}
          </span>
          <FieldError message={errors.recipientBio?.message} />
        </label>
        <label className="block text-xs font-medium text-black/60">
          Visibility
          <select {...register("visibility")} className={INPUT}>
            <option value="public">Public, indexable, anyone with the link</option>
            <option value="unlisted">Unlisted, link only, not indexed</option>
            <option value="private">Private, owner and invitees only</option>
          </select>
        </label>
        {serverError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting || (!isDirty && !saved)}
          className="w-full rounded-full bg-[var(--brand-ink)] px-4 py-2.5 text-sm font-semibold text-white transition-colors enabled:hover:bg-[var(--brand)] disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
        <p className="text-center text-[11px] text-black/40">Removed photos are deleted from storage when you save.</p>
      </div>
    </form>
  );
}
