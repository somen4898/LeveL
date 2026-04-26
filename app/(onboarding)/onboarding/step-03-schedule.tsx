import type { OnboardingState } from "./page";

interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const DAYS = [
  { n: 0, label: "Sun" },
  { n: 1, label: "Mon" },
  { n: 2, label: "Tue" },
  { n: 3, label: "Wed" },
  { n: 4, label: "Thu" },
  { n: 5, label: "Fri" },
  { n: 6, label: "Sat" },
];

function DayPicker({
  selected,
  onChange,
  label,
}: {
  selected: number[];
  onChange: (days: number[]) => void;
  label: string;
}) {
  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
        {label}
      </span>
      <div className="flex gap-2 mt-2">
        {DAYS.map(({ n, label: dayLabel }) => {
          const active = selected.includes(n);
          return (
            <button
              key={n}
              onClick={() =>
                onChange(
                  active
                    ? selected.filter((d) => d !== n)
                    : [...selected, n].sort()
                )
              }
              className={`w-[52px] h-[40px] rounded-[6px] text-[11px] font-[var(--font-tactical)] tracking-[0.04em] uppercase border transition-all cursor-pointer ${
                active
                  ? "bg-ink text-bone border-ink"
                  : "bg-card text-ink-2 border-hair hover:border-ink-3"
              }`}
            >
              {dayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepSchedule({ state, setState, onNext, onBack }: StepProps) {
  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
        The Contract · Schedule
      </span>
      <h1 className="font-[var(--font-display)] text-[48px] leading-[1.02] tracking-[-0.018em] mt-3.5 italic">
        Which days for which Cores.
      </h1>
      <p className="text-[14.5px] leading-[1.5] text-ink-2 mt-5 max-w-[580px]">
        Fuel is daily, no exceptions. Body and Craft have flexible schedules.
        Pick the days that match your life. Once signed, the schedule locks.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div className="bg-card border border-hair rounded-[10px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-[var(--font-display)] text-[26px] italic text-ember">I</span>
            <span className="text-[16px] font-semibold">Body</span>
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.1em] uppercase ml-auto">
              {state.bodyDays.length}× / WEEK
            </span>
          </div>
          <DayPicker
            selected={state.bodyDays}
            onChange={(days) => setState({ ...state, bodyDays: days })}
            label="Body days"
          />
        </div>

        <div className="bg-card border border-hair rounded-[10px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-[var(--font-display)] text-[26px] italic text-ember">II</span>
            <span className="text-[16px] font-semibold">Fuel</span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase bg-ink text-bone border border-ink font-medium">
              DAILY
            </span>
          </div>
          <p className="text-[13px] text-ink-3">
            Fuel is every day. No schedule picker needed.
          </p>
        </div>

        <div className="bg-card border border-hair rounded-[10px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-[var(--font-display)] text-[26px] italic text-ember">III</span>
            <span className="text-[16px] font-semibold">Craft</span>
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.1em] uppercase ml-auto">
              {state.craftDays.length}× / WEEK
            </span>
          </div>
          <DayPicker
            selected={state.craftDays}
            onChange={(days) => setState({ ...state, craftDays: days })}
            label="Craft days"
          />
        </div>
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
          Next · Review Cores →
        </button>
      </div>
    </div>
  );
}
