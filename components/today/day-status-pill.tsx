interface Props {
  status: "in_progress" | "qualified" | "failed";
}

export function DayStatusPill({ status }: Props) {
  const styles = {
    in_progress: "bg-card text-ink-2 border-hair",
    qualified: "bg-moss-bg text-moss border-moss-l",
    failed: "bg-ember-bg text-ember-d border-ember-l",
  };

  const labels = {
    in_progress: "IN PROGRESS",
    qualified: "QUALIFIED",
    failed: "FAILED",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase border font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
