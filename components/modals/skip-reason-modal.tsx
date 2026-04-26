"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MIN_REASON_LENGTH } from "@/lib/domain/reasoning";

interface Props {
  optionalId: string;
  optionalLabel: string;
  dailyLogId: string;
  userId: string;
  currentDay: number;
  onClose: () => void;
  onSubmit: () => void;
}

export function SkipReasonModal({
  optionalId,
  optionalLabel,
  dailyLogId,
  userId,
  currentDay,
  onClose,
  onSubmit,
}: Props) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = text.length >= MIN_REASON_LENGTH;

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);

    const supabase = createClient();

    // Insert reasoning entry
    await supabase.from("reasoning_entries").insert({
      daily_log_id: dailyLogId,
      user_id: userId,
      optional_id: optionalId,
      reason_text: text,
      tag: tag as "sick" | "tired" | "busy" | "other" | null,
    });

    // Insert task completion (completed=false for skip)
    await supabase.from("task_completions").insert({
      daily_log_id: dailyLogId,
      user_id: userId,
      task_kind: "optional",
      optional_id: optionalId,
      completed: false,
    });

    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(22,19,17,0.55)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[580px] bg-card rounded-[12px] shadow-[var(--shadow-heavy)] border border-hair p-9">
        <div className="flex items-center">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            Skipping an Optional · Day {currentDay}
          </span>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-[18px] text-ink-3 cursor-pointer hover:text-ink transition-colors"
          >
            ×
          </button>
        </div>

        <h2 className="font-[var(--font-display)] text-[36px] leading-[1.05] tracking-[-0.018em] mt-4">
          <em className="italic">Why</em> are you skipping
          <br />
          {optionalLabel} today?
        </h2>

        <p className="text-[13.5px] leading-[1.5] text-ink-2 mt-3.5">
          You&apos;re free to skip — Optionals don&apos;t fail your day. But the day only
          qualifies if every skip has a reason.{" "}
          <strong className="text-ink">Write something true.</strong> Lazy reasons
          survive the form, but rarely survive themselves.
        </p>

        <div className="mt-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your reason here..."
            className="w-full min-h-[110px] px-4 py-3.5 font-[var(--font-ui)] text-[14px] leading-[1.55] text-ink bg-bone border-[1.5px] border-ink rounded-[8px] resize-y outline-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              MIN 50 CHARS · NO RICH TEXT · NO EDIT AFTER SUBMIT
            </span>
            <span
              className={`font-[var(--font-tactical)] text-[11px] font-semibold ${
                isValid ? "text-moss" : "text-ember"
              }`}
            >
              {text.length} / {MIN_REASON_LENGTH} {isValid ? "✓" : ""}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-4">
          {["sick", "tired", "busy", "other"].map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={`px-3 py-1.5 rounded-[6px] text-[11px] font-[var(--font-tactical)] tracking-[0.1em] uppercase border cursor-pointer transition-all ${
                tag === t
                  ? "bg-ink text-bone border-ink"
                  : "bg-card text-ink-2 border-hair hover:border-ink-3"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="px-[18px] py-[11px] bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors"
          >
            Cancel — I&apos;ll do it
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="px-[18px] py-[11px] bg-ember text-white border border-ember rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-ember-d transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit reason & skip"}
          </button>
        </div>
      </div>
    </div>
  );
}
