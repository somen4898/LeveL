"use client";

interface Props {
  label: string;
  done: boolean;
  streak: number;
  isLockedIn: boolean;
  hasReason: boolean;
  isLast: boolean;
  onMarkDone: () => void;
  onSkip: () => void;
}

export function OptionalRow({ label, done, streak, isLockedIn, hasReason, isLast, onMarkDone, onSkip }: Props) {
  const skipped = !done && hasReason;

  return (
    <div
      className={`flex items-center gap-3.5 py-3 ${
        !isLast ? "border-b border-hair-2" : ""
      }`}
    >
      <button
        onClick={done ? undefined : onMarkDone}
        className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[12px] font-bold shrink-0 transition-all ${
          done
            ? "bg-ember border-[1.5px] border-ember text-white shadow-[0_0_0_4px_#fbeadb] cursor-default"
            : "border-[1.5px] border-ink-4 opacity-60 cursor-pointer hover:opacity-100"
        }`}
      >
        {done ? "✓" : ""}
      </button>
      <div className="flex flex-col flex-1">
        <span
          className={`text-[13.5px] font-medium ${
            done ? "text-ink-3 line-through" : "text-ink"
          }`}
        >
          {label}
        </span>
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-0.5">
          {done
            ? `DONE · ${streak}-DAY STREAK`
            : skipped
              ? "SKIPPED WITH REASON"
              : isLockedIn
                ? "MANDATORY · 3 CONSECUTIVE SKIPS"
                : streak > 0
                  ? `${streak}/3 SKIPS · ${3 - streak === 1 ? "MANDATORY IN 1 DAY" : `${3 - streak} LEFT`}`
                  : `${streak}-DAY STREAK · OPEN`}
        </span>
      </div>
      {!done && !skipped && !isLockedIn && (
        <>
          <button
            onClick={onMarkDone}
            className="px-3 py-[7px] bg-card text-ink border border-ink rounded-[6px] text-[11.5px] font-medium cursor-pointer hover:bg-paper transition-colors"
          >
            Mark done
          </button>
          <button
            onClick={onSkip}
            className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium cursor-pointer hover:bg-paper transition-colors"
          >
            Skip + reason →
          </button>
        </>
      )}
      {isLockedIn && !done && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase bg-ember-bg text-ember-d border border-ember-l font-medium">
          REASON REQUIRED
        </span>
      )}
    </div>
  );
}
