# Progression App Wireframe

_Started 2026-04-26 16:23 UTC_

---

## User

Let's start with the wireframe for this. Make sure that you follow all UX/UI patterns that are specifically needed. Go through and research progression apps. See how design can be made more intuitive. We are prioritizing UI and UX. It needs to look good; it needs to feel good. This is going to be a web browser application, a web app. We need to make it extremely UI/UX oriented.
1. Start with wireframe.
2. Then go for low fidelity.
3. Then go for high fidelity.

## Assistant

I'll dig into the PRD and the design system first, then come back with focused questions before sketching anything.

_[tool: list_files]_

_[tool: list_files]_

The design system folder is empty — let me check both projects properly and read the PRD.

_[tool: list_files]_

_[tool: list_files]_

The "Design System" project the user attached is empty. I'll note that and read the PRD.

_[tool: run_script]_

Excellent — I now have a deep understanding of Atlas (the project name in the PRD; the project is titled "LeveL"). This is a meaty product. Before I start sketching wireframes, I need to ask the right questions so we don't waste cycles. Let me also note: the attached "Design System" project is empty, so we'll need to either build a small system as we go or you can attach one.

Let me ask focused questions to direct the work.

_[tool: questions_v2]_

## User

Questions answered:
- design_system_status: Decide for me
- vibe_references: Habitica / RPG-style — explicit game layer
- tone: Playful gamified — XP bars, level-up fanfare, celebration
- screens_priority: Decide for me — all of them
- today_emphasis: Decide for me
- chain_visualization: Decide for me
- reward_vault_layout: Decide for me
- fidelity_in_one_file: Decide for me
- interactivity_wireframe: Decide for me
- novelty_appetite: Decide for me

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: copy_starter_component]_

Good. Let me lay out the plan, then start building.

**Direction I'm taking:**
- **Tone**: RPG/gamified but with restraint — think Habitica × Apple Fitness, not Duolingo. Quest-board language, XP bars, level cards, but typography and spacing stay disciplined. Stoic monk-meets-RPG.
- **Layout**: Persistent left rail (Today / Quests / Vault / Levels / Codex / Settings), main canvas, right side panel for chain/streak telemetry.
- **Web app, desktop-primary**, but the layouts will hold up on tablet.
- **Fidelity progression in ONE file** via the design canvas, three sections stacked: Wireframe → Lo-Fi → Hi-Fi. User can compare and we evolve toward the final.
- **Wireframes**: lightly interactive (checkboxes toggle, modals open), grayscale annotated boxes.
- **Surfaces I'll cover** (all 8 from PRD §5 + Onboarding + Continuation):
  1. Onboarding (configure 6 rewards, targets)
  2. Home / Today
  3. Log + Reasoning Modal
  4. Level-Up Modal
  5. Reward Vault
  6. History (day log + reasoning archive + patterns)
  7. Settings
  8. Day 91 / Continuation handoff

**Visualization decisions** (since you said "decide for me"):
- **Chain viz**: 18-cell quest-track ribbon — pixel-game inspired bar with miss-pips on the side. Pairs with the RPG vibe.
- **Today hero**: a "Today's Quest Log" card with the 3 cores as quest entries; chain ribbon directly above. Composed dashboard but the core checklist gets the most weight.
- **Reward Vault**: timeline/journey laid out as 6 stations, Day 15 → 90, with a treasure-chest metaphor (locked / glowing / claimable / claimed states).
- **Novelty**: mostly proven, with novel moments at level-up (card-draw style choice), chain ribbon (pixel ribbon), and reward vault (journey).

Let me build the wireframe first. I'll structure it as multiple JSX component files imported into the main HTML to keep file sizes manageable.

_[tool: read_file]_

Good — I have what I need on the canvas API. Let me build the wireframe screens. I'll write the wireframe components in dedicated JSX files, kept small and composable.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

## Assistant

## Assistant

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

**Stage 1 — Wireframes shipped.** All 8 surfaces are laid out in a single design canvas (`LeveL Wireframes.html`):

- README artboard with direction & assumptions
- Onboarding · Step 4/6 (reward vault config)
- Today / Home
- Log + Reasoning Modal
- Level-Up Modal (3-card draw)
- Reward Vault (90-day journey rail)
- History / Codex
- Settings (locks vs unlocked)
- Day 91 · Continuation handoff

Lightly interactive — checkboxes toggle, modals are shown in their open states. Annotations call out the trickier rules (3-day skip lock, day-floor on rewards, immutable cores).

**Three direction calls baked in:**
1. **Chain ribbon** — 18-cell pixel-RPG strip for the rolling 15-of-18 window
2. **Reward Vault as a journey** — 6 stations on a rail, treasure-chest states
3. **Level-up as a card draw** — pick 1 of 3, others return to pool

Review it and tell me:
- Anything missing / structurally wrong
- Any screen you want me to fork into 2-3 layout variants before we move on
- Green-light to proceed to **Stage 2 (Lo-Fi)** — same canvas, new section underneath, real type hierarchy & components, still grayscale

## User

we can proceed to low fid lets the apps name be LeveL and

## Assistant

_[tool: snip]_

_[tool: update_todos]_

Got it — moving to lo-fi. Brand is **LeveL** (capital L's bookending lowercase). I'll build it in the same canvas as a new section underneath.

Lo-fi means: real type hierarchy with a chosen typeface, real component shapes (not dashed boxes), still grayscale-only so we can validate composition before color. I'll use a serif/grotesk pairing — **Fraktur or similar display**... actually let me avoid that AI-slop trope. I'll use **Instrument Serif** for display + **Geist Mono** for tactical/data + **Inter** for UI. Keeps the RPG-codex feel without leaning on tropes.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

Got the logo direction — bold sans wordmark "LEVEL" (all caps) plus a minimalist stairs/steps mark for growth. Let me build the brand mark and wire up the lo-fi pass.

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: snip]_

Now let me wire up the lo-fi screens into the same canvas alongside the wireframes, and add a brand strip artboard so you can see the mark.

_[tool: read_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

**Stage 2 — Lo-Fi shipped.** Same canvas, three sections now:

- **Brand · Mark** — wordmark variants (primary lockup, wordmark-only, inverted, app tile)
- **Stage 2 — Lo-Fi** — all 8 surfaces with real type hierarchy (Instrument Serif display + Geist Mono tactical + Inter UI), real components, grayscale only
- **Stage 1 — Wireframes** — preserved underneath for reference

The new **LEVEL** mark — bold sans wordmark + four ascending bars — is integrated everywhere (sidebar, onboarding header, brand strip).

Tell me what to refine before I move to **Stage 3 (Hi-Fi)**:
- Color direction (I'd propose: warm paper #f6f3ec base, ink near-black, a single accent — perhaps a deep amber or chain-green for the "qualifying / claimed" states)
- Any layout I should fork into variants
- Any screen feeling off

Or just green-light and I'll run hi-fi.

## User

make sure ux priniciples are followed to the t i dont like the icon logo or the app tile its minimalistic yes but too basiic

## Assistant

_[tool: snip]_

I'll explore richer mark options that still feel minimalist but with more craft. Let me design 4 alternative directions for the icon/app-tile.

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

**Brand explorations shipped.** Top of the canvas now shows a strip with five glyph directions for LEVEL:

1. **Isometric Stairs** — 3-step staircase in axonometric, reads as a real architectural object
2. **Stair Monogram L** — capital L formed by ascending steps; subtle wordmark connection
3. **Notched Chevron** — stepped-arrow ascent, decisive, "level up"
4. **Offset Squares** — three squares climbing diagonally with depth
5. **Bars (current)** — kept for comparison

Each is shown at glyph-only, in the wordmark lockup, and as the app tile so you can judge fairly. Pick one (or describe a hybrid) and I'll roll it through every surface in **Stage 3 — Hi-Fi**.

## User

Offset Squares
squares
 i like this a lot thankyou. can we go for the hi fi now

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

Now let me build the hi-fi pass. I'll establish a real color system and rebuild every surface with full polish — not just colorize the lo-fi.

**Hi-fi system:**
- **Paper** `#f6f3ec` (warm linen) — base
- **Ink** `#161311` (deep) — text/structure  
- **Ember** `#c4622d` (deep amber) — primary accent, qualifying/claimed states
- **Moss** `#3d5341` — success/progress
- **Bone** `#fbf8f1` — cards
- Display: **Instrument Serif italic**, UI: **Inter**, tactical: **Geist Mono**
- Soft shadows, subtle grain on paper, real depth on cards

_[tool: write_file]_

_[tool: snip]_

_[tool: update_todos]_

Now the hi-fi screens. I'll build them in two files to stay under the line limit.

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

**Stage 3 — Hi-Fi shipped.** New top section in the canvas with all 8 surfaces in full color:

- **Paper** warm linen `#f5f1e8` · **Ink** `#161311` · **Ember** `#c4622d` accent · **Moss** `#3d5341` for success
- **Instrument Serif** italic for display, **Geist Mono** for tactical/numbers, **Inter** for UI
- Offset Squares glyph locked across every surface (sidebar, onboarding, finale)
- Subtle paper grain, soft shadows on cards, real reward badges with layered offset-square artwork

Surfaces:
1. **Onboarding · Archetype** — 4 cards, "The Sprinter" selected with ember tag
2. **Today** — hero quest card (paper / ink split), 18-cell chain, 4 stat cards, side quests + run log
3. **Quest Detail** — SVG route map, qualifying conditions, reward stack, course history
4. **Reward Vault** — featured "Iron Cadence" tier-II badge in ink hero, 12-badge grid, gear inventory
5. **Levels** — ink hero with Lv 07 → 08 ramp, full class ladder I→X with prestige row, XP breakdown
6. **Codex** — 3-column reading view (index / article / meta) with worked-example chain inline
7. **Run Complete** — full-bleed ink finale, italic numerals, all 90 cells visualized, badge rollup
8. **Settings** — archetype lock, quest delivery toggles, threshold sliders, end-run danger zone

Tell me what to refine — copy, color tuning, density, or any specific surface.

## User

so i really like them but this app isnt about running at all so?

## Assistant

<response>

_[tool: snip]_

You're absolutely right — I apologize. I picked up "running" from somewhere and ran with it without checking. What is **LEVEL** actually for? A few quick options so I aim correctly:

- **Habits / discipline** in general (any habit you pick — meditation, writing, reading, gym, sobriety, learning…)
- **A specific domain** (creative practice, study, language learning, deep-work hours, fitness broadly, etc.)
- **Skill mastery** (deliberate practice toward a craft — instrument, drawing, code, chess…)
- **Self-directed personal goals** the user defines themselves

Tell me the actual subject and I'll re-skin everything — quest copy, thresholds, course-history, the codex entry, badges, archetypes — to fit. The structure (run / chain / quests / vault / levels / codex / finale / settings) holds regardless; only the language and metaphors need to shift.

## User



## Assistant

<response>

_[tool: snip]_

<response>

_[tool: snip]_

<response>

Got it — fully understood now. The structure I built (run / chain / quests / vault / levels) is mostly right; what's wrong is the **metaphor and copy**. "Quests" → "Cores", "running" → the actual three-cores commitment, no playful XP-grind language, more contract / training-journal tone.

Let me rebuild the hi-fi screens to match the actual product. I'll keep the same color system (it already reads serious — paper, ink, ember) and the Offset Squares mark, but rewrite every surface around:

- **Three Cores** (Gym / Eating / Coding) as the day's binary contract
- **Reasoning modal** as the soul of the product — the 50-char skip explanation
- **Reward Calendar** at days 15/30/45/60/75/90 with pre-committed items
- **15-of-18 window** as the chain mechanic
- **30 micro-levels** with alternating tighten/unlock effects
- **Day 91 continuation** as the actual finale

Tone shift: contracts, not quests. Training journal, not RPG. I'll keep the visual restraint (paper + ink + a single ember accent) but rewrite the language entirely.

8 surfaces I'll rebuild:
1. **Onboarding · The Contract** — pick three cores + targets + six rewards, sign it
2. **Today** — three Core checkboxes + optionals + reasoning state
3. **Reasoning Modal** — the 50-char skip explainer (the soul)
4. **Reward Calendar** — six rewards on a 90-day rail with chain windows
5. **Levels** — 30-row ladder with alternating tighten/unlock effects
6. **Day Detail / History** — what got logged, what got skipped, why
7. **Day 91 · Continuation** — re-sign or close out
8. **Settings** — what you can change mid-run (very little) vs. what's locked

Building now.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

<response>

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

<response>

_[tool: snip]_

_[tool: done]_

<response>

_[tool: snip]_

_[tool: fork_verifier_agent]_

<response>

**Stage 3 v2 — Hi-Fi rebuilt around the actual product.** Top section in the canvas now reflects LEVEL as a 90-day self-accountability contract:

1. **Onboarding · The Contract** — three Cores (Gym 4×/wk, Eating daily, Coding 5×/wk) with subtasks, ending in a sign-the-contract block
2. **Today** — 1-of-3 Cores complete state, sub-checkboxes, optionals row with skip-pending pattern, 18-day reward window
3. **Skip-Reason Modal** — the soul of the product, with 50-char counter, pattern-history row, and a 3/3 mandatory-return warning
4. **Reward Calendar** — six pre-committed rewards on a 90-day rail (claimed → qualifying → pending → finale), with prices, dates, and 15-of-18 windows
5. **Levels** — Lv 07/30 hero, full 30-row two-column ladder alternating TGHTN/UNLCK, current effect stack
6. **Day Detail** — review of Day 23, all three Cores met, the immutable skip reason as a serif pull-quote
7. **Day 91 · Continuation** — Run 01 archive + three doors (Sign Run 02 / Re-spec Cores / Maintain mode) + close-the-book exit
8. **Settings** — locks vs. editable split, with all 9 contractual locks listed first and danger-zone abandon at the bottom

Tone shift complete: contracts not quests, training-journal not RPG, the reasoning mechanism foregrounded everywhere it appears. Tell me what to refine.

## User

Save this design as a PDF: LeveL Wireframes.html

## Assistant

<response>

_[tool: snip]_

<response>

_[tool: snip]_

_[tool: read_file]_

<response>

_[tool: snip]_

I'll write a print-ready version that bypasses the design canvas (which is pan/zoom + scroll) and lays each surface as its own page.

_[tool: write_file]_

_[tool: show_html]_

<response>

_[tool: snip]_

_[tool: show_html]_

<response>

_[tool: snip]_

_[tool: get_webview_logs]_

<response>

_[tool: snip]_

_[tool: open_for_print]_

<response>

_[tool: snip]_

Print-ready file built — all 8 hi-fi surfaces, one per page, with auto-print on load. If the print dialog didn't pop up, open it here:

[Open LeveL Wireframes-print.html](https://019dca9a-b7e2-7a5f-903d-0601facff3e0.claudeusercontent.com/v1/design/projects/019dca9a-b7e2-7a5f-903d-0601facff3e0/serve/LeveL%20Wireframes-print.html?t=3506f520f83f1363bb5988a503fade8e588a031ff093860128da4002620c2d8a.ad0af443-20d4-4ff1-ae0c-f6addd4a5c3c.dc599ebc-1572-4b0e-ac97-f44de330ee09.1777227532)

## User

rewrite level brandmark with our colours our logo that we have chosen everything make it. a brand kit

## Assistant

<response>

_[tool: snip]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: update_todos]_

Brand kit is open. Five sections — mark, colour, type, components, voice — locked into a v1.0 canon document with the contract stamp at the bottom.

What's next?

## User

great now also make a separate doc for only brandkits main hi fidelity design

## Assistant

Got it — you want a separate hi-fi doc that's *just* the brand kit's main design surface (the lockup hero / cover page), pulled out as its own document. Let me make a clean, focused single-page artifact.

_[tool: write_file]_

_[tool: done]_

Standalone brand cover doc shipped — `LEVEL Brand Cover.html`. Just the hero: dark lockup card on the left, display type + tagline + meta strip on the right, registration crosshairs in all four corners, and a 5-section index footer pointing to the rest of the kit.

## User

LeveL · Stage 3 — Hi-Fi this thing that you made with all the surfaces i want you to make a separate document for the hi fi design of the app itself its alrready made jsut keep it in a diff doc and expand if you want to

## Assistant

On it. Let me find the hi-fi work in the existing canvas and pull it into its own doc.

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

Good — hi-fi screens are 8 surfaces in `hf/`, mounted via the canvas. Let me build a standalone doc that loads just the hi-fi section, with its own simpler shell (no design canvas chrome — just clean stacked artboards with section header, navigation rail, and per-screen labels).

_[tool: read_file]_

Got the structure. Now I'll build a standalone hi-fi doc that reuses the existing JSX components but presents them in a cleaner, magazine-style stack instead of inside a design canvas.

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Standalone hi-fi doc shipped — `LEVEL App Hi-Fi.html`.

- Fixed dark rail on the left with all 8 surfaces, active state syncs to scroll
- Magazine-style stacked artboards with section header + role tag + screen description + 1280×N stamp
- Each screen rendered into a responsive frame that auto-scales to viewport width
- Same hi-fi components from the canvas, no design canvas chrome
- Contract footer at the bottom

Verifier is checking it now in the background. Tell me what to refine.

## User

Verifier agent check completed

## Assistant

Verifier passed — all 8 screens render cleanly. You're good.

