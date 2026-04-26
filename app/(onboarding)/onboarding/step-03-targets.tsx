"use client";

import type { StepProps } from "./page";

export function StepTargets({ state, setState, onNext, onBack }: StepProps) {
  return (
    <div>
      <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        THE CONTRACT · DECLARE TARGETS
      </span>

      <h1 className="font-[var(--font-display)] text-[72px] leading-[0.96] tracking-[-0.02em] mt-[22px]">
        Quantify the <em className="italic text-ember">commitment.</em>
      </h1>

      <p className="font-[var(--font-display)] italic text-[21px] leading-[1.45] text-ink-2 mt-[22px] max-w-[640px]">
        Every Core needs a number. The number locks on sign. It can rise through levels, but it cannot fall.
      </p>

      {/* Core I: Body */}
      <div className="mt-3.5 bg-card border border-hair rounded-[12px] overflow-hidden transition-all hover:border-ink-3 hover:shadow-[0_16px_40px_-20px_rgba(20,15,10,0.18)]">
        <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
          <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">I</span>
          <div className="flex flex-col flex-1 gap-1">
            <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">Body</h3>
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">PHYSICAL TRAINING · STRUCTURED LIFT</span>
          </div>
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 bg-ink text-bone rounded-full font-medium">
            {state.bodyDays.length}× / WEEK
          </span>
        </div>
        <div className="px-7 py-[26px] bg-bone">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2.5">
            MINIMUM SESSION LENGTH
          </span>
          <div className="inline-flex items-baseline gap-2 px-[18px] py-2.5 bg-card border border-hair rounded-[8px] transition-all focus-within:border-ember focus-within:shadow-[0_0_0_4px_rgba(196,98,45,0.1)]">
            <input
              type="number"
              value={state.bodyMinutes}
              onChange={(e) => setState({ ...state, bodyMinutes: Number(e.target.value) })}
              className="w-[110px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[32px] font-semibold text-ink tracking-[-0.02em]"
            />
            <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">minutes</span>
          </div>
          <p className="mt-4 text-[12.5px] leading-[1.55] text-ink-3 max-w-[640px]">
            Subtask preview: &ldquo;Complete a structured workout, &ge;{state.bodyMinutes} min, with logged sets.&rdquo; Sessions under the threshold do not count toward the day.
          </p>
        </div>
      </div>

      {/* Core II: Fuel */}
      <div className="mt-3.5 bg-card border border-hair rounded-[12px] overflow-hidden transition-all hover:border-ink-3 hover:shadow-[0_16px_40px_-20px_rgba(20,15,10,0.18)]">
        <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
          <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">II</span>
          <div className="flex flex-col flex-1 gap-1">
            <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">Fuel</h3>
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">NUTRITION · DAILY TARGETS</span>
          </div>
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 bg-ink text-bone rounded-full font-medium">DAILY</span>
        </div>
        <div className="px-7 py-[26px] bg-bone">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2.5">DAILY CALORIES</span>
              <div className="inline-flex items-baseline gap-2 px-[18px] py-2.5 bg-card border border-hair rounded-[8px] transition-all focus-within:border-ember focus-within:shadow-[0_0_0_4px_rgba(196,98,45,0.1)]">
                <input
                  type="number"
                  value={state.calorieTarget}
                  onChange={(e) => setState({ ...state, calorieTarget: Number(e.target.value) })}
                  className="w-[110px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[32px] font-semibold text-ink tracking-[-0.02em]"
                />
                <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">kcal</span>
              </div>
            </div>
            <div>
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2.5">DAILY PROTEIN</span>
              <div className="inline-flex items-baseline gap-2 px-[18px] py-2.5 bg-card border border-hair rounded-[8px] transition-all focus-within:border-ember focus-within:shadow-[0_0_0_4px_rgba(196,98,45,0.1)]">
                <input
                  type="number"
                  value={state.proteinTarget}
                  onChange={(e) => setState({ ...state, proteinTarget: Number(e.target.value) })}
                  className="w-[110px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[32px] font-semibold text-ink tracking-[-0.02em]"
                />
                <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">grams</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[12.5px] leading-[1.55] text-ink-3 max-w-[640px]">
            Use Mifflin-St Jeor or similar. Maintenance + surplus. LeveL does not track foods: you report a single binary at end of day. Honesty is the only auditor.
          </p>
        </div>
      </div>

      {/* Core III: Craft */}
      <div className="mt-3.5 bg-card border border-hair rounded-[12px] overflow-hidden transition-all hover:border-ink-3 hover:shadow-[0_16px_40px_-20px_rgba(20,15,10,0.18)]">
        <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
          <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">III</span>
          <div className="flex flex-col flex-1 gap-1">
            <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">Craft</h3>
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">DELIBERATE PRACTICE · EITHER COUNTS</span>
          </div>
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 bg-ink text-bone rounded-full font-medium">
            {state.craftDays.length}× / WEEK
          </span>
        </div>
        <div className="px-7 py-[26px] bg-bone">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">CHOOSE YOUR MODALITY</span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {state.craftSubtasks.map((sub, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-[18px] py-4 bg-ink text-bone border border-ink rounded-[8px] cursor-pointer transition-all"
              >
                <span className="w-5 h-5 rounded-[5px] bg-ember border-[1.5px] border-ember flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <span className="text-[13.5px] leading-[1.4]">{sub.label}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 bg-transparent text-ink-3 border border-dashed border-hair rounded-[7px] text-[12px] cursor-pointer hover:text-ink hover:border-ink-3 hover:border-solid transition-all">
            + Add custom subtask
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-[18px] py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-all"
        >
          ← Step 02 · The Why
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          NEXT: STEP 04 · SCHEDULE
        </span>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2.5 px-[22px] py-[13px] bg-ember text-white border border-ember rounded-[8px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_16px_rgba(196,98,45,0.3)] hover:bg-ember-d hover:-translate-y-px transition-all"
        >
          Lock targets & continue <span>→</span>
        </button>
      </div>
    </div>
  );
}
