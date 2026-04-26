"use client";

import { padTwo } from "@/lib/utils/format";

interface Props {
  newLevel: number;
  effectKind: string;
  description: string;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, effectKind, description, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[rgba(22,19,17,0.65)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-[520px] bg-ink text-bone rounded-[14px] shadow-[var(--shadow-heavy)] p-10 text-center">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
          LEVEL UP
        </span>
        <div className="font-[var(--font-tactical)] text-[120px] font-semibold leading-none tracking-[-0.04em] mt-2 text-ember">
          {padTwo(newLevel)}
        </div>
        <div className="font-[var(--font-display)] text-[28px] italic mt-4 leading-[1.2]">
          {effectKind === "UNLOCK" ? "New optional unlocked." : "Target tightened."}
        </div>
        <p className="font-[var(--font-display)] italic text-[18px] text-ember-l mt-3 leading-[1.4]">
          {description}
        </p>
        <p className="text-[13px] text-ink-4 mt-6 leading-[1.5] max-w-[380px] mx-auto">
          Each level is a small adjustment. The system&apos;s power comes from the accumulated weight of all adjustments, not from any single one.
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 bg-ember text-white border border-ember rounded-[7px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
