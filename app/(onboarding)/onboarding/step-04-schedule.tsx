"use client";

import type { StepProps } from "./page";

const DAY_COLS = [
  { n: 1, label: "Mon", short: "M" },
  { n: 2, label: "Tue", short: "T" },
  { n: 3, label: "Wed", short: "W" },
  { n: 4, label: "Thu", short: "T" },
  { n: 5, label: "Fri", short: "F" },
  { n: 6, label: "Sat", short: "S" },
  { n: 0, label: "Sun", short: "S" },
];

export function StepSchedule({ state, setState, onNext, onBack }: StepProps) {
  function toggleDay(field: "bodyDays" | "craftDays", day: number) {
    const current = state[field];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort();
    setState({ ...state, [field]: updated });
  }

  return (
    <div>
      <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        THE CONTRACT · SCHEDULE
      </span>

      <h1 className="font-[var(--font-display)] text-[72px] leading-[0.96] tracking-[-0.02em] mt-[22px]">
        Which days. <em className="italic text-ember">No ambiguity.</em>
      </h1>

      <p className="font-[var(--font-display)] italic text-[21px] leading-[1.45] text-ink-2 mt-[22px] max-w-[640px]">
        Fuel fires every day, locked. Body and Craft have flexible cadence: pick the days, then they lock. The week becomes the rhythm.
      </p>

      {/* Week grid */}
      <div className="mt-8 bg-card border border-hair rounded-[12px] p-7">
        {/* Header row */}
        <div className="grid gap-2 items-center" style={{ gridTemplateColumns: "140px repeat(7, 1fr) 80px" }}>
          <span />
          {DAY_COLS.map((d) => (
            <span key={d.label} className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 text-center">
              {d.label}
            </span>
          ))}
          <span />
        </div>

        {/* Divider */}
        <div className="h-px bg-hair mt-3.5 mb-2.5" />

        {/* Body row */}
        <div className="grid gap-2 items-center py-2.5 border-b border-hair-2" style={{ gridTemplateColumns: "140px repeat(7, 1fr) 80px" }}>
          <div className="flex items-center gap-2.5">
            <span className="font-[var(--font-display)] italic text-[24px] text-ember w-6">I</span>
            <span className="font-[var(--font-display)] italic text-[22px] text-ink">Body</span>
          </div>
          {DAY_COLS.map((d) => {
            const on = state.bodyDays.includes(d.n);
            return (
              <button
                key={d.n}
                onClick={() => toggleDay("bodyDays", d.n)}
                className={`h-14 rounded-[8px] font-[var(--font-tactical)] text-[11px] tracking-[0.1em] uppercase border cursor-pointer transition-all ${
                  on
                    ? "bg-ink text-bone border-ink shadow-[inset_0_-3px_0_#c4622d]"
                    : "bg-bone text-ink-3 border-hair hover:border-ink-3 hover:text-ink"
                }`}
              >
                {d.short}
              </button>
            );
          })}
          <div className="text-right pr-1">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.16em] uppercase text-ink-4 block mb-0.5">cadence</span>
            <span className="font-[var(--font-tactical)] text-[14px] font-semibold text-ink">{state.bodyDays.length}× / wk</span>
          </div>
        </div>

        {/* Fuel row */}
        <div className="grid gap-2 items-center py-2.5 border-b border-hair-2" style={{ gridTemplateColumns: "140px repeat(7, 1fr) 80px" }}>
          <div className="flex items-center gap-2.5">
            <span className="font-[var(--font-display)] italic text-[24px] text-ember w-6">II</span>
            <span className="font-[var(--font-display)] italic text-[22px] text-ink">Fuel</span>
          </div>
          {DAY_COLS.map((d) => (
            <button
              key={d.n}
              className="h-14 rounded-[8px] font-[var(--font-tactical)] text-[11px] tracking-[0.1em] uppercase bg-ink text-bone border border-ink cursor-not-allowed opacity-90 relative"
              disabled
            >
              {d.short}
              <span className="absolute top-1.5 right-2 text-[9px] opacity-50">🔒</span>
            </button>
          ))}
          <div className="text-right pr-1">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.16em] uppercase text-ink-4 block mb-0.5">cadence</span>
            <span className="font-[var(--font-tactical)] text-[14px] font-semibold text-ink">Daily</span>
          </div>
        </div>

        {/* Craft row */}
        <div className="grid gap-2 items-center py-2.5" style={{ gridTemplateColumns: "140px repeat(7, 1fr) 80px" }}>
          <div className="flex items-center gap-2.5">
            <span className="font-[var(--font-display)] italic text-[24px] text-ember w-6">III</span>
            <span className="font-[var(--font-display)] italic text-[22px] text-ink">Craft</span>
          </div>
          {DAY_COLS.map((d) => {
            const on = state.craftDays.includes(d.n);
            return (
              <button
                key={d.n}
                onClick={() => toggleDay("craftDays", d.n)}
                className={`h-14 rounded-[8px] font-[var(--font-tactical)] text-[11px] tracking-[0.1em] uppercase border cursor-pointer transition-all ${
                  on
                    ? "bg-ink text-bone border-ink shadow-[inset_0_-3px_0_#c4622d]"
                    : "bg-bone text-ink-3 border-hair hover:border-ink-3 hover:text-ink"
                }`}
              >
                {d.short}
              </button>
            );
          })}
          <div className="text-right pr-1">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.16em] uppercase text-ink-4 block mb-0.5">cadence</span>
            <span className="font-[var(--font-tactical)] text-[14px] font-semibold text-ink">{state.craftDays.length}× / wk</span>
          </div>
        </div>
      </div>

      {/* Reasoning mechanism */}
      <div className="mt-7 bg-card border border-hair rounded-[12px] p-7 grid grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            THE REASONING MECHANISM
          </span>
          <h4 className="font-[var(--font-display)] italic text-[26px] mt-2 mb-3">
            Skip an Optional. Write why.
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-ink-2">
            You can skip an Optional, but you must write a 50-character reason. If you skip the same Optional three days in a row, it becomes mandatory the next day. The system does not punish: it demands honesty.
          </p>
        </div>

        {/* Skip chain visual */}
        <div className="flex items-center gap-1.5 justify-center">
          {[
            { day: "D 01", locked: false },
            { day: "D 02", locked: false },
            { day: "D 03", locked: false },
            { day: "D 04", locked: true },
          ].map((cell, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`w-14 h-14 rounded-[8px] flex flex-col items-center justify-center font-[var(--font-tactical)] ${
                  cell.locked
                    ? "bg-ember border-[1.5px] border-ember text-white"
                    : "bg-bone border-[1.5px] border-ink-3 text-ink-3"
                }`}
              >
                <span className="text-[8px] tracking-[0.1em] opacity-70">{cell.day}</span>
                <span className={`text-[18px] font-bold ${cell.locked ? "text-white text-[14px]" : ""}`}>
                  {cell.locked ? "⌧" : "×"}
                </span>
              </div>
              {i < 3 && <span className="text-ink-4 text-[14px]">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-[18px] py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-all"
        >
          ← Step 03 · Targets
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          NEXT: STEP 05 · SIGN
        </span>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2.5 px-[22px] py-[13px] bg-ember text-white border border-ember rounded-[8px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_16px_rgba(196,98,45,0.3)] hover:bg-ember-d hover:-translate-y-px transition-all"
        >
          Lock schedule & continue <span>→</span>
        </button>
      </div>
    </div>
  );
}
