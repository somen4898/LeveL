import type { OnboardingState } from "./page";

interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

export function StepWelcome({ onNext }: StepProps) {
  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
        The Contract · Welcome
      </span>
      <h1 className="font-[var(--font-display)] text-[60px] leading-[0.98] tracking-[-0.018em] mt-3.5">
        Three things you will <em className="italic">not</em>
        <br />
        negotiate with yourself
        <br />
        for ninety days.
      </h1>
      <p className="text-[14.5px] leading-[1.5] text-ink-2 mt-5 max-w-[580px]">
        LEVEL is a 90-day self-accountability system. You will choose three Cores
        — non-negotiable daily commitments — and six rewards that unlock as you
        qualify. Once signed, the contract is locked. No edits, no removals, no
        reductions. This is the friction that makes the system work.
      </p>

      <div
        className="mt-10 p-7 rounded-[10px] border border-hair-2 bg-bone"
      >
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          How it works
        </span>
        <div className="grid grid-cols-3 gap-6 mt-4">
          {[
            ["01", "Three Cores", "Gym, Eating, Coding. Binary. Did you or didn't you."],
            ["02", "Six Rewards", "Pre-committed at sign. Earned through qualifying days."],
            ["03", "Ninety Days", "The contract holds. Levels tighten. Optionals unlock."],
          ].map(([num, title, desc]) => (
            <div key={num}>
              <span className="font-[var(--font-display)] text-[22px] italic text-ember">
                {num}
              </span>
              <h3 className="text-[14px] font-semibold mt-1">{title}</h3>
              <p className="text-[12.5px] text-ink-2 leading-[1.5] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onNext}
          className="px-[18px] py-[11px] bg-ink text-bone border border-ink rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-black transition-colors"
        >
          Begin the contract →
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
          NEXT — STEP 02 · SET TARGETS
        </span>
      </div>
    </div>
  );
}
