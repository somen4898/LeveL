"use client";

interface Props {
  reward: { name: string; tier: string; scheduled_day: number; price_amount: number | null };
  onClose: () => void;
  onClaim: () => void;
}

export function ClaimRewardModal({ reward, onClose, onClaim }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[rgba(22,19,17,0.55)] backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[440px] bg-card rounded-[12px] shadow-[var(--shadow-heavy)] border border-hair p-8 text-center">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          CLAIM REWARD · DAY {reward.scheduled_day}
        </span>
        <h2 className="font-[var(--font-display)] text-[32px] italic leading-[1.1] mt-4">
          {reward.name}
        </h2>
        {reward.price_amount && (
          <p className="font-[var(--font-tactical)] text-[16px] text-ink-2 mt-2 tabular-nums">
            ₹{reward.price_amount.toLocaleString()}
          </p>
        )}
        <p className="text-[13px] text-ink-2 leading-[1.5] mt-4">
          This action is <strong className="text-ink">irreversible</strong>. Once claimed, the reward is recorded permanently.
        </p>
        <div className="flex gap-3 mt-6 justify-center">
          <button
            onClick={onClose}
            className="px-[18px] py-[11px] bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClaim}
            className="px-[18px] py-[11px] bg-ember text-white border border-ember rounded-[7px] text-[13px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-colors"
          >
            Claim →
          </button>
        </div>
      </div>
    </div>
  );
}
