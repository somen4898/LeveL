"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  List,
  Gift,
  TrendingUp,
  BookOpen,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/quest-log", label: "Quest Log", icon: List },
  { href: "/reward-vault", label: "Reward Vault", icon: Gift },
  { href: "/levels", label: "Levels", icon: TrendingUp },
  { href: "/codex", label: "Codex", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  displayName?: string;
  level?: number;
  chainProgress?: string;
  day?: number;
}

export function Sidebar({
  displayName = "player_one",
  level = 1,
  chainProgress = "0/15",
  day = 1,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] border-r border-hair-2 bg-card-2 flex flex-col shrink-0 relative z-[1]">
      {/* Logo */}
      <div className="px-5 pt-[22px] pb-[18px] border-b border-hair-2">
        <div className="flex items-center gap-[9px]">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#161311" opacity="0.4" />
            <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#161311" opacity="0.7" />
            <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#161311" />
          </svg>
          <span className="font-[var(--font-ui)] font-[800] text-[18px] tracking-[0.005em] uppercase text-ink">
            LEVEL
          </span>
        </div>
        <div className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-2">
          RUN 01 · DAY {day}/90
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-[11px] px-3 py-2.5 rounded-[7px] mb-[3px] text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-ink text-bone"
                  : "text-ink-2 hover:bg-paper-2"
              }`}
            >
              <Icon size={16} strokeWidth={1.6} />
              {label}
              {isActive && (
                <span className="ml-auto w-1 h-1 rounded-full bg-ember" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-3.5 border-t border-hair-2 flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-ember to-rust flex items-center justify-center text-white font-[var(--font-display)] text-[18px] italic">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] font-semibold truncate">{displayName}</span>
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
            Lv {String(level).padStart(2, "0")} · {chainProgress} chain
          </span>
        </div>
      </div>
    </aside>
  );
}
