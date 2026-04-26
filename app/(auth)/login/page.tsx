"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/today");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="w-full max-w-[440px] mx-auto px-8">
        {/* Mark */}
        <div className="flex items-center gap-3 mb-12">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#161311" opacity="0.4" />
            <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#161311" opacity="0.7" />
            <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#161311" />
          </svg>
          <span className="font-[var(--font-ui)] font-[800] text-[22px] tracking-[0.005em] uppercase text-ink">
            LEVEL
          </span>
        </div>

        <p className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 mb-2">
          Sign in
        </p>
        <h1 className="font-[var(--font-display)] text-[42px] leading-[1.02] tracking-[-0.018em] italic mb-2">
          Resume the contract.
        </h1>
        <p className="text-[13px] leading-[1.5] text-ink-2 mb-8">
          Enter the credentials you signed up with. The system remembers where you left off.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-ember-bg border border-ember-l text-[13px] text-ember-d">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-[13px] bg-card border border-hair rounded-[7px] text-ink shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] outline-none focus:border-ink transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-[13px] bg-card border border-hair rounded-[7px] text-ink shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] outline-none focus:border-ink transition-colors"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-[18px] py-[11px] bg-ink text-bone border border-ink rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink-3">
          No account?{" "}
          <a href="/signup" className="text-ember font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
