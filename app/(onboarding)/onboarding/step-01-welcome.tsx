"use client";

import { useEffect, useRef, useState } from "react";
import type { OnboardingState } from "./page";

interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

export function StepWelcome({ onNext }: StepProps) {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="py-12 relative">
        <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
          <span
            className="w-1.5 h-1.5 rounded-full bg-ember"
            style={{
              boxShadow: "0 0 0 4px rgba(196,98,45,0.12)",
              animation: "pulse 2.4s ease-in-out infinite",
            }}
          />
          THE CONTRACT · WELCOME
        </span>

        <h1 className="font-[var(--font-display)] text-[68px] leading-[1.08] tracking-[-0.022em] mt-[22px] max-w-[1100px]">
          {["Three things you will", <><em key="em" className="italic text-ember relative">not</em> negotiate with</>, "yourself for ninety days."].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-2">
              <span
                className="inline-block"
                style={{
                  transform: "translateY(110%)",
                  animation: `rise 0.8s cubic-bezier(0.2,0.8,0.2,1) ${0.1 + i * 0.15}s forwards`,
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="font-[var(--font-display)] italic text-[22px] leading-[1.45] text-ink-2 mt-7 max-w-[640px]"
          style={{
            opacity: 0,
            animation: "fadeup 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.8s forwards",
          }}
        >
          LeveL is a 90-day self-accountability system. You will choose three
          Cores, non-negotiable daily commitments, and six rewards that unlock as
          you qualify. Once signed, the contract is locked.
        </p>
      </div>

      {/* How the contract works */}
      <section
        id="hiw"
        data-animate
        className="mt-14 rounded-[12px] border border-hair bg-card relative overflow-hidden p-9"
        style={{
          opacity: visible.has("hiw") ? 1 : 0,
          transform: visible.has("hiw") ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.2,0.8,0.2,1), transform 0.8s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        {/* Left ember bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ember" />

        <div className="font-[var(--font-tactical)] text-[11px] tracking-[0.18em] uppercase text-ink-3 mb-6">
          HOW THE CONTRACT WORKS
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[
            ["01", "Three Cores", "Body, Fuel, Craft. Binary daily commitments. Either you did them, or you didn't."],
            ["02", "Six Rewards", "Pre-committed at sign. Earned through qualifying days. No retroactive bargaining."],
            ["03", "Ninety Days", "The contract holds. Levels tighten. Optionals unlock. Day 91 forces a fresh decision."],
          ].map(([num, title, desc], i, arr) => (
            <div key={num} className="relative">
              <span className="font-[var(--font-display)] italic text-[40px] leading-none text-ember">{num}</span>
              <h3 className="text-[15px] font-semibold mt-2 mb-1.5">{title}</h3>
              <p className="text-[13px] leading-[1.55] text-ink-2">{desc}</p>
              {i < arr.length - 1 && (
                <span className="absolute top-[18px] -right-5 font-[var(--font-tactical)] text-[14px] text-hair">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Triptych: The three Cores */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between mb-[18px]">
          <h2 className="font-[var(--font-display)] italic text-[28px]">
            The three <em className="text-ember">Cores.</em>
          </h2>
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
            HOVER TO INSPECT
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* BODY */}
          <div
            id="core-body"
            data-animate
            className="group relative h-[460px] rounded-[14px] border border-hair bg-card overflow-hidden cursor-pointer transition-all duration-500 hover:bg-ink hover:border-ink hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(20,15,10,0.35),0_8px_20px_-6px_rgba(20,15,10,0.18)]"
            style={{
              opacity: visible.has("core-body") ? 1 : 0,
              transform: visible.has("core-body") ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s cubic-bezier(0.2,0.8,0.2,1), background 0.5s, border-color 0.5s, box-shadow 0.6s",
            }}
          >
            {/* Dot texture on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-[2]" style={{ backgroundImage: "radial-gradient(rgba(232,162,107,0.06) 1px, transparent 1px)", backgroundSize: "4px 4px" }} />

            {/* Ambient arcs */}
            <svg className="absolute -top-10 -right-10 w-[200px] h-[200px] opacity-50 group-hover:opacity-90 transition-opacity duration-600 z-[1]" viewBox="0 0 200 200" fill="none">
              <circle cx="160" cy="40" r="40" stroke="#c4622d" strokeWidth="0.8" opacity="0.4"><animate attributeName="r" values="40;55;40" dur="4s" repeatCount="indefinite" /></circle>
              <circle cx="160" cy="40" r="60" stroke="#c4622d" strokeWidth="0.6" opacity="0.25"><animate attributeName="r" values="60;75;60" dur="4s" repeatCount="indefinite" begin="0.5s" /></circle>
              <circle cx="160" cy="40" r="80" stroke="#c4622d" strokeWidth="0.4" opacity="0.15"><animate attributeName="r" values="80;95;80" dur="4s" repeatCount="indefinite" begin="1s" /></circle>
            </svg>

            <span className="absolute top-[22px] left-7 font-[var(--font-display)] italic text-[88px] leading-none text-ember group-hover:text-ember-l transition-all duration-500 group-hover:-translate-y-[3px] z-[3]">I</span>
            <span className="absolute top-7 right-6 font-[var(--font-tactical)] text-[9.5px] tracking-[0.18em] uppercase text-ink-3 group-hover:text-ink-4 transition-colors duration-500 z-[3]">PHYSICAL TRAINING</span>

            {/* Illustration */}
            <div className="absolute top-[110px] left-0 right-0 h-[180px] flex items-center justify-center pointer-events-none">
              <svg className="w-[140px] h-[140px] transition-transform duration-800 group-hover:scale-[1.08]" viewBox="0 0 140 140" fill="none">
                <line x1="20" y1="70" x2="120" y2="70" stroke="#3a342d" strokeWidth="3" strokeLinecap="round" />
                <rect x="32" y="62" width="6" height="16" rx="1.5" fill="#3a342d" />
                <rect x="102" y="62" width="6" height="16" rx="1.5" fill="#3a342d" />
                <rect x="14" y="46" width="14" height="48" rx="3" fill="#c4622d"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="3s" repeatCount="indefinite" /></rect>
                <rect x="6" y="54" width="6" height="32" rx="2" fill="#a04e1f"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="3s" repeatCount="indefinite" begin="0.3s" /></rect>
                <rect x="112" y="46" width="14" height="48" rx="3" fill="#c4622d"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="3s" repeatCount="indefinite" /></rect>
                <rect x="128" y="54" width="6" height="32" rx="2" fill="#a04e1f"><animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="3s" repeatCount="indefinite" begin="0.3s" /></rect>
                <line x1="20" y1="120" x2="120" y2="120" stroke="#9c9489" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
              </svg>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-6 left-7 right-7 z-[3]">
              <h3 className="font-[var(--font-display)] italic text-[38px] leading-none text-ink group-hover:text-bone transition-all duration-500 group-hover:-translate-y-1">Body.</h3>
              <p className="text-[13px] leading-[1.55] text-ink-2 mt-3 max-h-0 opacity-0 overflow-hidden group-hover:max-h-[90px] group-hover:opacity-100 group-hover:text-ink-4 transition-all duration-[550ms]">
                The work you do with your body: lifting, running, climbing, swimming. The modality is yours; the commitment is non-negotiable.
              </p>
              <div className="flex gap-[18px] mt-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Cadence</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">4x / week</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Min</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">45 min</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Logged</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">Sets & reps</span></div>
              </div>
            </div>
            <div className="absolute left-7 right-7 bottom-0 h-[3px] bg-ember scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
          </div>

          {/* FUEL */}
          <div
            id="core-fuel"
            data-animate
            className="group relative h-[460px] rounded-[14px] border border-hair bg-card overflow-hidden cursor-pointer transition-all duration-500 hover:bg-ink hover:border-ink hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(20,15,10,0.35),0_8px_20px_-6px_rgba(20,15,10,0.18)]"
            style={{
              opacity: visible.has("core-fuel") ? 1 : 0,
              transform: visible.has("core-fuel") ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.18s, transform 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.18s, background 0.5s, border-color 0.5s, box-shadow 0.6s",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-[2]" style={{ backgroundImage: "radial-gradient(rgba(232,162,107,0.06) 1px, transparent 1px)", backgroundSize: "4px 4px" }} />
            <svg className="absolute -top-10 -right-10 w-[200px] h-[200px] opacity-50 group-hover:opacity-90 transition-opacity duration-600 z-[1]" viewBox="0 0 200 200" fill="none">
              <circle cx="160" cy="40" r="40" stroke="#c4622d" strokeWidth="0.8" opacity="0.4"><animate attributeName="r" values="40;55;40" dur="3.6s" repeatCount="indefinite" begin="0.4s" /></circle>
              <circle cx="160" cy="40" r="60" stroke="#c4622d" strokeWidth="0.6" opacity="0.25"><animate attributeName="r" values="60;75;60" dur="3.6s" repeatCount="indefinite" begin="0.9s" /></circle>
              <circle cx="160" cy="40" r="80" stroke="#c4622d" strokeWidth="0.4" opacity="0.15"><animate attributeName="r" values="80;95;80" dur="3.6s" repeatCount="indefinite" begin="1.4s" /></circle>
            </svg>

            <span className="absolute top-[22px] left-7 font-[var(--font-display)] italic text-[88px] leading-none text-ember group-hover:text-ember-l transition-all duration-500 group-hover:-translate-y-[3px] z-[3]">II</span>
            <span className="absolute top-7 right-6 font-[var(--font-tactical)] text-[9.5px] tracking-[0.18em] uppercase text-ink-3 group-hover:text-ink-4 transition-colors duration-500 z-[3]">NUTRITION · INTAKE</span>

            <div className="absolute top-[110px] left-0 right-0 h-[180px] flex items-center justify-center pointer-events-none">
              <svg className="w-[140px] h-[140px] transition-transform duration-800 group-hover:scale-[1.08]" viewBox="0 0 140 140" fill="none">
                <ellipse cx="70" cy="115" rx="32" ry="6" fill="#3a342d" opacity="0.3" />
                <rect x="42" y="100" width="56" height="10" rx="2" fill="#3a342d" opacity="0.25" />
                <path d="M70 30 C56 50, 48 64, 48 78 C48 94, 58 104, 70 104 C82 104, 92 94, 92 78 C92 64, 84 50, 70 30 Z" fill="#c4622d" opacity="0.85"><animate attributeName="opacity" values="0.85;0.7;0.85" dur="1.6s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="scale" values="1 1; 1.02 1.04; 1 1" dur="1.6s" repeatCount="indefinite" additive="sum" /></path>
                <path d="M70 50 C62 64, 58 72, 58 82 C58 92, 64 98, 70 98 C76 98, 82 92, 82 82 C82 72, 78 64, 70 50 Z" fill="#e8a26b"><animate attributeName="opacity" values="1;0.85;1" dur="1.2s" repeatCount="indefinite" /></path>
                <ellipse cx="70" cy="84" rx="5" ry="9" fill="#faf5e8"><animate attributeName="ry" values="9;11;9" dur="1.2s" repeatCount="indefinite" /></ellipse>
                <circle cx="92" cy="50" r="1.5" fill="#e8a26b"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" /><animateTransform attributeName="transform" type="translate" values="0 0; 6 -16" dur="2s" repeatCount="indefinite" /></circle>
                <circle cx="50" cy="55" r="1" fill="#e8a26b"><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="0.6s" /><animateTransform attributeName="transform" type="translate" values="0 0; -4 -14" dur="2.4s" repeatCount="indefinite" begin="0.6s" /></circle>
              </svg>
            </div>

            <div className="absolute bottom-6 left-7 right-7 z-[3]">
              <h3 className="font-[var(--font-display)] italic text-[38px] leading-none text-ink group-hover:text-bone transition-all duration-500 group-hover:-translate-y-1">Fuel.</h3>
              <p className="text-[13px] leading-[1.55] text-ink-2 mt-3 max-h-0 opacity-0 overflow-hidden group-hover:max-h-[90px] group-hover:opacity-100 group-hover:text-ink-4 transition-all duration-[550ms]">
                What you put in determines what you get out. Tracked as daily targets, calories and protein, reported honestly at end of day.
              </p>
              <div className="flex gap-[18px] mt-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Cadence</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">Daily</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Targets</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">2 must hit</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Auditor</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">Honesty</span></div>
              </div>
            </div>
            <div className="absolute left-7 right-7 bottom-0 h-[3px] bg-ember scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
          </div>

          {/* CRAFT */}
          <div
            id="core-craft"
            data-animate
            className="group relative h-[460px] rounded-[14px] border border-hair bg-card overflow-hidden cursor-pointer transition-all duration-500 hover:bg-ink hover:border-ink hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(20,15,10,0.35),0_8px_20px_-6px_rgba(20,15,10,0.18)]"
            style={{
              opacity: visible.has("core-craft") ? 1 : 0,
              transform: visible.has("core-craft") ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.36s, transform 0.9s cubic-bezier(0.2,0.8,0.2,1) 0.36s, background 0.5s, border-color 0.5s, box-shadow 0.6s",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none z-[2]" style={{ backgroundImage: "radial-gradient(rgba(232,162,107,0.06) 1px, transparent 1px)", backgroundSize: "4px 4px" }} />
            <svg className="absolute -top-10 -right-10 w-[200px] h-[200px] opacity-50 group-hover:opacity-90 transition-opacity duration-600 z-[1]" viewBox="0 0 200 200" fill="none">
              <circle cx="160" cy="40" r="40" stroke="#c4622d" strokeWidth="0.8" opacity="0.4"><animate attributeName="r" values="40;55;40" dur="4.4s" repeatCount="indefinite" begin="0.8s" /></circle>
              <circle cx="160" cy="40" r="60" stroke="#c4622d" strokeWidth="0.6" opacity="0.25"><animate attributeName="r" values="60;75;60" dur="4.4s" repeatCount="indefinite" begin="1.3s" /></circle>
              <circle cx="160" cy="40" r="80" stroke="#c4622d" strokeWidth="0.4" opacity="0.15"><animate attributeName="r" values="80;95;80" dur="4.4s" repeatCount="indefinite" begin="1.8s" /></circle>
            </svg>

            <span className="absolute top-[22px] left-7 font-[var(--font-display)] italic text-[88px] leading-none text-ember group-hover:text-ember-l transition-all duration-500 group-hover:-translate-y-[3px] z-[3]">III</span>
            <span className="absolute top-7 right-6 font-[var(--font-tactical)] text-[9.5px] tracking-[0.18em] uppercase text-ink-3 group-hover:text-ink-4 transition-colors duration-500 z-[3]">DELIBERATE PRACTICE</span>

            <div className="absolute top-[110px] left-0 right-0 h-[180px] flex items-center justify-center pointer-events-none">
              <svg className="w-[140px] h-[140px] transition-transform duration-800 group-hover:scale-[1.08]" viewBox="0 0 140 140" fill="none">
                <rect x="14" y="28" width="112" height="84" rx="4" fill="#161311" />
                <rect x="14" y="28" width="112" height="14" rx="4" fill="#3a342d" />
                <rect x="14" y="36" width="112" height="6" fill="#3a342d" />
                <circle cx="22" cy="35" r="2" fill="#9c9489" opacity="0.5" />
                <circle cx="30" cy="35" r="2" fill="#9c9489" opacity="0.5" />
                <circle cx="38" cy="35" r="2" fill="#9c9489" opacity="0.5" />
                <rect x="22" y="50" width="8" height="3" rx="1" fill="#9c9489" opacity="0.4" />
                <rect x="34" y="50" width="40" height="3" rx="1" fill="#e8a26b" opacity="0.7" />
                <rect x="22" y="60" width="8" height="3" rx="1" fill="#9c9489" opacity="0.4" />
                <rect x="34" y="60" width="22" height="3" rx="1" fill="#faf5e8" opacity="0.6" />
                <rect x="60" y="60" width="14" height="3" rx="1" fill="#c4622d" opacity="0.7" />
                <rect x="22" y="70" width="8" height="3" rx="1" fill="#9c9489" opacity="0.4" />
                <rect x="34" y="70" width="32" height="3" rx="1" fill="#faf5e8" opacity="0.5" />
                <rect x="22" y="92" width="8" height="3" rx="1" fill="#9c9489" opacity="0.4" />
                <text x="34" y="96" fontFamily="Geist Mono, monospace" fontSize="6" fill="#e8a26b" fontWeight="600">&#9656;</text>
                <rect x="44" y="91" width="14" height="5" fill="#faf5e8" opacity="0.4" />
                <rect x="62" y="91" width="3" height="5" fill="#e8a26b"><animate attributeName="opacity" values="1;1;0;0" dur="1s" repeatCount="indefinite" /></rect>
              </svg>
            </div>

            <div className="absolute bottom-6 left-7 right-7 z-[3]">
              <h3 className="font-[var(--font-display)] italic text-[38px] leading-none text-ink group-hover:text-bone transition-all duration-500 group-hover:-translate-y-1">Craft.</h3>
              <p className="text-[13px] leading-[1.55] text-ink-2 mt-3 max-h-0 opacity-0 overflow-hidden group-hover:max-h-[90px] group-hover:opacity-100 group-hover:text-ink-4 transition-all duration-[550ms]">
                The thing you are building competence in: code, writing, music, design. Focused time, not passive consumption.
              </p>
              <div className="flex gap-[18px] mt-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Cadence</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">5x / week</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Min</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">60 min focus</span></div>
                <div className="flex flex-col gap-[3px]"><span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ink-4">Mode</span><span className="font-[var(--font-tactical)] text-[11.5px] text-bone font-medium">Deliberate</span></div>
              </div>
            </div>
            <div className="absolute left-7 right-7 bottom-0 h-[3px] bg-ember scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* Contract preview */}
      <div
        id="contract"
        data-animate
        className="mt-9 rounded-[12px] bg-ink text-bone grid grid-cols-[auto_1fr_auto] gap-7 items-center p-8 relative overflow-hidden"
        style={{
          opacity: visible.has("contract") ? 1 : 0,
          transform: visible.has("contract") ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.1s, transform 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.1s",
        }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 100% at 30% 0%, rgba(232,162,107,0.06), transparent 70%)" }} />

        {/* Seal */}
        <div className="relative z-[2] w-16 h-16 rounded-full border-[1.5px] border-ember flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#e8a26b" opacity="0.4" />
            <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#e8a26b" opacity="0.7" />
            <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#e8a26b" />
          </svg>
          <div className="absolute -inset-2 rounded-full border border-dashed border-ember opacity-50" style={{ animation: "rotate 30s linear infinite" }} />
        </div>

        <div className="relative z-[2]">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.2em] uppercase text-ink-4">THE CONTRACT · PREVIEW</span>
          <p className="font-[var(--font-display)] italic text-[22px] leading-[1.4] mt-2 max-w-[640px]">
            &ldquo;I will not negotiate these three with myself for the next ninety days.&rdquo;
          </p>
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-4 mt-2 block">
            LOCKED ON SIGN · CANNOT BE CHANGED · CANNOT BE REMOVED · CANNOT BE REDUCED
          </span>
        </div>

        <button
          onClick={onNext}
          className="relative z-[2] inline-flex items-center gap-2.5 px-[22px] py-3.5 bg-ember text-white border border-ember rounded-[8px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_16px_rgba(196,98,45,0.3)] hover:bg-ember-d hover:-translate-y-px hover:shadow-[0_1px_0_#a04e1f,0_8px_24px_rgba(196,98,45,0.4)] transition-all duration-300"
        >
          Begin the contract
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Nav row */}
      <div className="mt-7 flex items-center justify-between">
        <button className="inline-flex items-center gap-2 px-4 py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-colors">
          ← Back
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          NEXT: STEP 02 · DECLARE TARGETS
        </span>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes rise {
          to { transform: translateY(0); }
        }
        @keyframes fadeup {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(196,98,45,0.12); }
          50% { box-shadow: 0 0 0 7px rgba(196,98,45,0.04); }
        }
      `}</style>
    </div>
  );
}
