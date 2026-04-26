interface TopbarProps {
  crumb: string;
  sub?: string;
  status?: string;
  statusKind?: "progress" | "ember" | "moss" | "solid";
  right?: React.ReactNode;
}

export function Topbar({ crumb, sub, status, statusKind = "progress", right }: TopbarProps) {
  const dotColor =
    statusKind === "ember"
      ? "bg-ember"
      : statusKind === "moss"
        ? "bg-moss"
        : statusKind === "solid"
          ? "bg-bone"
          : "bg-ink";

  const pillClass =
    statusKind === "ember"
      ? "bg-ember-bg text-ember-d border-ember-l"
      : statusKind === "moss"
        ? "bg-moss-bg text-moss border-moss-l"
        : statusKind === "solid"
          ? "bg-ink text-bone border-ink"
          : "bg-card text-ink-2 border-hair";

  return (
    <div className="h-16 border-b border-hair-2 flex items-center px-8 gap-3.5 shrink-0 bg-paper relative z-[1]">
      <div className="flex flex-col">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          {crumb}
        </span>
        {sub && (
          <span className="text-[14px] font-semibold tracking-[-0.005em] mt-[3px]">{sub}</span>
        )}
      </div>
      <div className="flex-1" />
      {right}
      {status && (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase border font-medium ${pillClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {status}
        </span>
      )}
    </div>
  );
}
