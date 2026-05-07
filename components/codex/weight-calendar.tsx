"use client";

interface WeightEntry {
  day_index: number;
  weight_kg: number;
  notes: string | null;
}

interface Props {
  weights: WeightEntry[];
  totalDays: number;
}

export function WeightCalendar({ weights, totalDays }: Props) {
  const weightMap = new Map(weights.map((w) => [w.day_index, w]));

  // Find min/max for relative coloring
  const values = weights.map((w) => w.weight_kg);
  const minW = values.length > 0 ? Math.min(...values) : 0;
  const maxW = values.length > 0 ? Math.max(...values) : 0;
  const range = maxW - minW || 1;

  // Build rows of 7
  const days = Array.from({ length: Math.min(totalDays, 90) }, (_, i) => i + 1);
  const rows: number[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <div className="border border-hair rounded-[10px] overflow-hidden bg-card">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-hair-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center py-2 font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 border-b border-hair-2 last:border-b-0">
          {row.map((dayNum) => {
            const entry = weightMap.get(dayNum);
            const hasData = !!entry;
            // Relative intensity for coloring
            const intensity = hasData ? (entry.weight_kg - minW) / range : 0;

            return (
              <div
                key={dayNum}
                className={`relative p-2 min-h-[52px] border-r border-hair-2 last:border-r-0 ${
                  hasData ? "bg-bone" : "bg-card"
                }`}
                title={
                  hasData
                    ? `Day ${dayNum}: ${entry.weight_kg.toFixed(1)} kg${entry.notes ? ` — ${entry.notes}` : ""}`
                    : `Day ${dayNum}`
                }
              >
                <span className="font-[var(--font-tactical)] text-[9px] text-ink-4 tabular-nums">
                  {dayNum}
                </span>
                {hasData && (
                  <div className="mt-0.5">
                    <span
                      className="font-[var(--font-tactical)] text-[13px] font-semibold tabular-nums block"
                      style={{
                        color: `color-mix(in srgb, #c4622d ${Math.round(30 + intensity * 70)}%, #161311)`,
                      }}
                    >
                      {entry.weight_kg.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          {/* Pad last row if incomplete */}
          {row.length < 7 &&
            Array.from({ length: 7 - row.length }, (_, i) => (
              <div
                key={`pad-${i}`}
                className="p-2 min-h-[52px] border-r border-hair-2 last:border-r-0 bg-card"
              />
            ))}
        </div>
      ))}

      {/* Summary row */}
      {weights.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-bone border-t border-hair">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.12em] uppercase text-ink-4">
                ENTRIES
              </span>
              <span className="font-[var(--font-tactical)] text-[16px] font-semibold tabular-nums">
                {weights.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.12em] uppercase text-ink-4">
                LATEST
              </span>
              <span className="font-[var(--font-tactical)] text-[16px] font-semibold tabular-nums">
                {weights[weights.length - 1].weight_kg.toFixed(1)} kg
              </span>
            </div>
            {weights.length >= 2 && (
              <div className="flex flex-col">
                <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.12em] uppercase text-ink-4">
                  CHANGE
                </span>
                <span
                  className={`font-[var(--font-tactical)] text-[16px] font-semibold tabular-nums ${
                    weights[weights.length - 1].weight_kg - weights[0].weight_kg > 0
                      ? "text-ember"
                      : weights[weights.length - 1].weight_kg - weights[0].weight_kg < 0
                        ? "text-moss"
                        : "text-ink-3"
                  }`}
                >
                  {weights[weights.length - 1].weight_kg - weights[0].weight_kg > 0 ? "+" : ""}
                  {(weights[weights.length - 1].weight_kg - weights[0].weight_kg).toFixed(1)} kg
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
