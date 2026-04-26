interface Props {
  cells: ("q" | "m" | "t" | "f")[];
  label: string;
  sub: string;
}

export function RewardWindowStrip({ cells, label, sub }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          {label}
        </span>
        {sub && (
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
            {sub}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[repeat(18,1fr)] gap-1 mt-3">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`h-7 rounded-[5px] flex items-center justify-center font-[var(--font-tactical)] text-[10px] font-bold ${
              c === "q"
                ? "bg-ember text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_0_#a04e1f]"
                : c === "m"
                  ? "bg-card border-[1.5px] border-ink-3 text-ink-3"
                  : c === "t"
                    ? "bg-card border-2 border-ink shadow-[0_0_0_4px_var(--color-paper),0_0_0_5px_var(--color-ember)]"
                    : "bg-card border border-dashed border-hair"
            }`}
          >
            {c === "q" ? "✓" : c === "m" ? "×" : c === "t" ? <span className="text-[8px]">NOW</span> : ""}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-ember rounded-[3px]" /> qualified
        </span>
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 border-[1.5px] border-ink-3 rounded-[3px]" /> miss
        </span>
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 border-[1.5px] border-dashed border-hair rounded-[3px]" /> future
        </span>
      </div>
    </div>
  );
}
