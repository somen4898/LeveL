"use client";

interface Props {
  numeral: string;
  name: string;
  target: string;
  done: boolean;
  subtasks: { id: string; label: string }[];
  completions: { subtask_id: string | null; completed: boolean }[];
  onToggle: (subtaskId: string, completed: boolean) => void;
}

export function CoreCard({ numeral, name, target, done, subtasks, completions, onToggle }: Props) {
  return (
    <div
      className={`rounded-[10px] p-[18px_20px] relative ${
        done
          ? "bg-ink text-bone"
          : "bg-bone border border-hair-2"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`font-[var(--font-display)] text-[26px] italic leading-none ${
            done ? "text-ember-l" : "text-ember"
          }`}
        >
          {numeral}
        </span>
        <div className="flex flex-col flex-1">
          <span className="text-[14px] font-semibold">{name}</span>
          <span
            className={`font-[var(--font-tactical)] text-[10px] tracking-[0.04em] ${
              done ? "text-ink-4" : "text-ink-3"
            }`}
          >
            {target}
          </span>
        </div>
        {done && (
          <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ember text-white rounded font-semibold">
            DONE
          </span>
        )}
      </div>

      <hr
        className={`border-none h-px my-3.5 ${
          done ? "bg-[#3a342d]" : "bg-hair-2"
        }`}
      />

      {subtasks.map((sub) => {
        const isComplete = completions.some(
          (c) => c.subtask_id === sub.id && c.completed
        );
        return (
          <div key={sub.id} className="flex items-center gap-2.5 py-1">
            <button
              onClick={() => onToggle(sub.id, !isComplete)}
              className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                isComplete
                  ? "bg-ember border-[1.5px] border-ember text-white shadow-[0_0_0_4px_#fbeadb]"
                  : `border-[1.5px] ${done ? "border-[#6b6259]" : "border-ink-2"} bg-transparent`
              }`}
            >
              {isComplete ? "✓" : ""}
            </button>
            <span
              className={`text-[12.5px] ${
                done ? "text-bone" : isComplete ? "text-ink" : "text-ink-2"
              }`}
            >
              {sub.label}
            </span>
          </div>
        );
      })}

      {!done && (
        <button
          onClick={() => {
            // Mark all subtasks as complete
            subtasks.forEach((sub) => {
              const isComplete = completions.some(
                (c) => c.subtask_id === sub.id && c.completed
              );
              if (!isComplete) onToggle(sub.id, true);
            });
          }}
          className="w-full mt-3.5 py-2 bg-ink text-bone rounded-[7px] text-[12px] font-medium cursor-pointer hover:bg-black transition-colors"
        >
          Mark complete
        </button>
      )}
    </div>
  );
}
