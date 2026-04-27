"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { StepProps } from "./page";

const MIN_ANCHOR = 100;

export function StepWhy({ state, setState, onNext, onBack }: StepProps) {
  const [localText, setLocalText] = useState(state.anchorText);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local -> parent with debounce
  const syncToParent = useCallback((text: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState({ ...state, anchorText: text });
    }, 300);
  }, [state, setState]);

  // Also sync on unmount (step change)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Sync immediately on unmount via ref
    };
  }, []);

  function handleChange(text: string) {
    setLocalText(text);
    syncToParent(text);
  }

  // Sync on blur immediately
  function handleBlur() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setState({ ...state, anchorText: localText });
  }

  const len = localText.length;
  const pct = Math.min(100, (len / MIN_ANCHOR) * 100);
  const met = len >= MIN_ANCHOR;

  return (
    <div>
      <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" style={{ boxShadow: "0 0 0 4px rgba(196,98,45,0.12)", animation: "pulse 2s ease-in-out infinite" }} />
        THE CONTRACT · YOUR ANCHOR
      </span>

      <h1 className="font-[var(--font-display)] text-[72px] leading-[0.96] tracking-[-0.02em] mt-[22px]">
        Write the reason this <em className="italic text-ember">contract</em>
        <br />exists.
      </h1>

      <p className="font-[var(--font-display)] italic text-[21px] leading-[1.45] text-ink-2 mt-[22px] max-w-[640px]">
        Not a goal. Not a resolution. The honest reason you are here. This gets read back to you on the days you want to stop, and once more on Day 91 when the contract closes.
      </p>

      {/* The Why card */}
      <div className="mt-10 bg-ink text-bone rounded-[14px] p-12 relative overflow-hidden shadow-[0_30px_60px_-30px_rgba(20,15,10,0.4)]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,162,107,0.08), transparent 70%)" }} />

        <span className="relative z-[1] inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ember" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          YOUR ANCHOR · WRITTEN ONCE
        </span>

        <h2 className="relative z-[1] font-[var(--font-display)] text-[56px] leading-none tracking-[-0.018em] mt-[18px] mb-3.5 text-bone">
          The reason.
        </h2>

        <p className="relative z-[1] text-[14.5px] leading-[1.55] text-ink-4 max-w-[620px] mb-8">
          Speak plainly. Avoid ambitions. State the shape of the life you are trying to build, or the version of yourself you are trying to leave behind.
        </p>

        {/* Textarea */}
        <div
          className="relative z-[1] bg-bone rounded-[10px] p-7 border-2 border-transparent transition-all duration-300 focus-within:border-ember focus-within:shadow-[0_0_0_6px_rgba(196,98,45,0.12)]"
        >
          <textarea
            value={localText}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Because last year I watched myself become someone I do not respect, and I refuse to spend another ninety days proving that pattern can hold..."
            className="w-full border-none bg-transparent outline-none resize-none font-[var(--font-display)] italic text-[26px] leading-[1.4] text-ink min-h-[140px] placeholder:text-ink-4"
          />

          <div className="flex justify-between items-center mt-5 pt-[18px] border-t border-hair-2">
            <div className={`flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] ${met ? "text-moss" : "text-ink-3"}`}>
              <div className="w-[180px] h-1 bg-hair-2 rounded-full overflow-hidden relative">
                <span
                  className="absolute inset-0 rounded-full transition-all duration-400"
                  style={{
                    width: `${pct}%`,
                    background: met ? "#3d5341" : "#c4622d",
                  }}
                />
              </div>
              <span>
                <span className={`font-semibold ${met ? "text-moss" : "text-ink"}`}>{len}</span> / {MIN_ANCHOR} chars · minimum
              </span>
            </div>
            <span className="font-[var(--font-tactical)] text-[9.5px] tracking-[0.16em] uppercase text-ink-3">
              WRITTEN ONCE · CANNOT BE EDITED · THIS IS THE ANCHOR
            </span>
          </div>
        </div>
      </div>

      {/* Foot note */}
      <div className="mt-6 p-[18px_22px] bg-bone border border-hair rounded-[8px] border-l-[3px] border-l-ember text-[13px] leading-[1.55] text-ink-2">
        Your anchor is stored with the contract. It appears on Today when you fall behind, and on Day 91 when the contract closes. Lazy reasons survive the form, but rarely survive themselves.
      </div>

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-[18px] py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-all"
        >
          ← Step 01 · Welcome
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          NEXT: STEP 03 · TARGETS
        </span>
        <button
          onClick={() => { setState({ ...state, anchorText: localText }); onNext(); }}
          disabled={!met}
          className="inline-flex items-center gap-2.5 px-[22px] py-[13px] bg-ember text-white border border-ember rounded-[8px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_16px_rgba(196,98,45,0.3)] hover:bg-ember-d hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lock anchor & continue <span>→</span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(196,98,45,0.15); }
          50% { box-shadow: 0 0 0 8px rgba(196,98,45,0.04); }
        }
      `}</style>
    </div>
  );
}
