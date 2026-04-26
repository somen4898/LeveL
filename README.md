# LeveL

A 90-day personal operating system. Three Cores, fixed reward calendar, 30-level Kaizen ladder, and a reasoning mechanism that anchors the whole system.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (Postgres + Auth + RLS)
- **Fonts**: Instrument Serif (display), Inter (UI), Geist Mono (tactical)
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library + Playwright

## Design References

- `docs/level/project/LEVEL Brand Kit.html` — Brand kit (colors, type, components, voice)
- `docs/level/project/LEVEL App Hi-Fi.html` — All 8 hi-fi screens
- `docs/level/chats/chat1.md` — Design conversation transcript
- `LeveL_TRD_v1.0.docx` — Technical Requirements Document

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase credentials
npm run dev
```

## Build Phases

1. Foundation (Next.js, Supabase, Auth)
2. Domain Logic (pure business rules + tests)
3. Onboarding (5-step contract signing)
4. Today Screen (cores, optionals, chain)
5. Day Close + Levels
6. Reward Vault
7. Quest Log + Codex + Settings
8. Day 91 + Cron + Polish
