import type { OnboardingState } from "./page";

interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

export function StepTargets({ state, setState, onNext, onBack }: StepProps) {
  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
        The Contract · Targets
      </span>
      <h1 className="font-[var(--font-display)] text-[48px] leading-[1.02] tracking-[-0.018em] mt-3.5 italic">
        Set your numbers.
      </h1>
      <p className="text-[14.5px] leading-[1.5] text-ink-2 mt-5 max-w-[580px]">
        These targets lock on sign. They can only go up (via levels), never down.
        Use Mifflin-St Jeor or similar to find your maintenance, then add your surplus.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-card border border-hair rounded-[10px] p-6">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
            Daily Calorie Target
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <input
              type="number"
              value={state.calorieTarget}
              onChange={(e) =>
                setState({ ...state, calorieTarget: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 text-[28px] font-[var(--font-tactical)] font-semibold bg-bone border border-hair-2 rounded-[7px] text-ink outline-none focus:border-ink tracking-[-0.02em]"
            />
          </div>
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-2 block">
            KCAL · MAINTENANCE + SURPLUS
          </span>
        </div>

        <div className="bg-card border border-hair rounded-[10px] p-6">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
            Daily Protein Target
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <input
              type="number"
              value={state.proteinTarget}
              onChange={(e) =>
                setState({ ...state, proteinTarget: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 text-[28px] font-[var(--font-tactical)] font-semibold bg-bone border border-hair-2 rounded-[7px] text-ink outline-none focus:border-ink tracking-[-0.02em]"
            />
          </div>
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-2 block">
            GRAMS · 1.6–2.2 G/KG BODYWEIGHT
          </span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-[7px] bg-bone border border-hair-2">
        <p className="text-[12px] text-ink-3 leading-[1.5]">
          LEVEL does not track individual foods. You track however you like — MyFitnessPal, a notebook, mental math.
          At end of day you report: did you hit the number, yes or no. Honesty is the only auditor.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-[18px] py-[11px] bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-[18px] py-[11px] bg-ink text-bone border border-ink rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-black transition-colors"
        >
          Next · Schedule →
        </button>
      </div>
    </div>
  );
}
