"use client";

import { useState } from "react";

type ReasonEntry = {
  id: string;
  reason_text: string;
  tag: string | null;
  logged_at: string;
  optionals: { label: string } | null;
};

export function ReasoningArchive({
  reasonsArr,
  tagCounts,
}: {
  reasonsArr: ReasonEntry[];
  tagCounts: Record<string, number>;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? reasonsArr.filter((r) => (r.tag ?? "untagged") === activeTag)
    : reasonsArr;

  return (
    <>
      {/* Tag filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={`font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors ${
            activeTag === null ? "bg-ink text-bone" : "bg-card border border-hair text-ink-2"
          }`}
        >
          All · {reasonsArr.length}
        </button>
        {Object.entries(tagCounts).map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
            className={`font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full font-medium transition-colors ${
              activeTag === tag ? "bg-ink text-bone" : "bg-card border border-hair text-ink-2"
            }`}
          >
            {tag} · {count}
          </button>
        ))}
      </div>

      {/* Reasoning archive header */}
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 block mb-3">
        Reasoning archive
        {activeTag && <span className="text-ember ml-1">· {activeTag}</span>}
      </span>

      {/* Reasoning entries */}
      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-card border border-hair rounded-[10px] p-5 border-l-[3px] border-l-ember"
          >
            <div className="flex items-center gap-2 mb-2">
              {r.optionals && (
                <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                  {r.optionals.label}
                </span>
              )}
              {r.tag && (
                <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ink text-bone rounded font-semibold">
                  {r.tag}
                </span>
              )}
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] ml-auto">
                {new Date(r.logged_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <p className="font-[var(--font-display)] italic text-[17px] leading-[1.45] text-ink">
              &ldquo;{r.reason_text}&rdquo;
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-[13px] text-ink-3 italic">
            {activeTag
              ? `No skip reasons with tag "${activeTag}".`
              : "No skip reasons recorded yet."}
          </p>
        )}
      </div>
    </>
  );
}
