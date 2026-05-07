"use client";

import { useState } from "react";

type Photo = {
  id: string;
  day_index: number;
  photo_date: string;
  public_url: string;
};

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return <p className="text-[13px] text-ink-3 italic">No progress photos uploaded yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setLightbox(p)}
            className="relative aspect-square rounded-[8px] overflow-hidden group cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.public_url}
              alt={`Day ${p.day_index}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <span className="font-[var(--font-tactical)] text-[11px] tracking-[0.1em] uppercase text-bone font-semibold">
                Day {p.day_index}
              </span>
              <span className="block font-[var(--font-tactical)] text-[9px] text-bone/70">
                {new Date(p.photo_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Day ${lightbox.day_index} progress photo`}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.public_url}
              alt={`Day ${lightbox.day_index}`}
              className="max-w-full max-h-[85vh] object-contain rounded-[8px]"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 rounded-[8px] px-3 py-1.5">
              <span className="font-[var(--font-tactical)] text-[13px] tracking-[0.1em] uppercase text-bone font-semibold">
                Day {lightbox.day_index}
              </span>
              <span className="font-[var(--font-tactical)] text-[11px] text-bone/70 ml-2">
                {new Date(lightbox.photo_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
