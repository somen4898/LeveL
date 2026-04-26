// Brand mark — LEVEL wordmark + multiple icon-mark explorations.
// The wordmark itself stays consistent; the GLYPH gets several variants
// the user can pick from. Each variant must read as "growth/steps" without
// feeling generic-bar-chart.

// ─────────────────────────────────────────────────────────────
// Glyph variants
// ─────────────────────────────────────────────────────────────

// V1 — original 4 ascending bars (kept for reference)
function GlyphBars({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2"  y="22" width="6" height="8"  rx="1" fill={color} />
      <rect x="10" y="17" width="6" height="13" rx="1" fill={color} />
      <rect x="18" y="11" width="6" height="19" rx="1" fill={color} />
      <rect x="26" y="4"  width="4" height="26" rx="1" fill={color} />
    </svg>
  );
}

// V2 — Isometric staircase. 3 steps drawn in 30°/30° axonometric.
// Reads as a real object (architectural), not a chart.
function GlyphIsoStairs({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Each step: top face (light), front face (mid), side face (dark) */}
      {/* step 1 (lowest, front-most) */}
      <path d="M3 22 L11 26 L11 29 L3 25 Z" fill={color} opacity="0.55" />
      <path d="M11 26 L19 22 L19 25 L11 29 Z" fill={color} opacity="0.85" />
      <path d="M3 22 L11 18 L19 22 L11 26 Z" fill={color} />
      {/* step 2 (middle) */}
      <path d="M11 17 L19 21 L19 24 L11 20 Z" fill={color} opacity="0.55" />
      <path d="M19 21 L27 17 L27 20 L19 24 Z" fill={color} opacity="0.85" />
      <path d="M11 17 L19 13 L27 17 L19 21 Z" fill={color} />
      {/* step 3 (top) */}
      <path d="M19 12 L27 16 L27 19 L19 15 Z" fill={color} opacity="0.55" />
      <path d="M27 16 L29 15 L29 18 L27 19 Z" fill={color} opacity="0.85" />
      <path d="M19 12 L27 8 L29 9 L19 13 Z" fill={color} />
    </svg>
  );
}

// V3 — Stair-step monogram "L". The letter L formed by a staircase.
// Small recursive/fractal feel. The "L" hint connects to the wordmark.
function GlyphStairL({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Vertical stack of stair-step blocks forming an L */}
      <path d="M6 4 L13 4 L13 11 L20 11 L20 18 L27 18 L27 25 L28 25 L28 28 L6 28 Z"
            fill={color} />
    </svg>
  );
}

// V4 — Notched chevron. Single ascending arrow drawn as a stepped path.
// Reads decisively as "up/level up" — angular but not blunt.
function GlyphChevronStep({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M5 24 L5 20 L11 20 L11 16 L17 16 L17 12 L23 12 L23 8 L29 8 L29 12 L26 12 L26 16 L20 16 L20 20 L14 20 L14 24 Z"
            fill={color} />
      {/* bottom rail */}
      <rect x="3" y="26" width="26" height="2" rx="1" fill={color} opacity="0.4" />
    </svg>
  );
}

// V5 — Square-step monogram. Three offset squares climbing diagonally,
// each smaller than the last (forced perspective). Negative space is part
// of the composition.
function GlyphOffsetSquares({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3"  y="20" width="9" height="9" rx="1.5" fill={color} opacity="0.4" />
      <rect x="10" y="13" width="9" height="9" rx="1.5" fill={color} opacity="0.7" />
      <rect x="17" y="6"  width="9" height="9" rx="1.5" fill={color} />
    </svg>
  );
}

// Default glyph used by the wordmark lockup. Switch this to swap the brand.
const BRAND_GLYPH = 'squares'; // 'iso-stairs' | 'stair-l' | 'chevron' | 'squares' | 'bars'

function StepsMark({ size = 22, color = 'currentColor', variant = BRAND_GLYPH }) {
  const Map = { 'bars': GlyphBars, 'iso-stairs': GlyphIsoStairs, 'stair-l': GlyphStairL, 'chevron': GlyphChevronStep, 'squares': GlyphOffsetSquares };
  const G = Map[variant] || GlyphIsoStairs;
  return <G size={size} color={color} />;
}

// Wordmark — "LEVEL" all caps, tight tracking, bold sans.
function LevelMark({ size = 18, color = 'currentColor', withGlyph = true, gap = 9, variant }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap, color, lineHeight: 1 }}>
      {withGlyph && <StepsMark size={Math.round(size * 1.1)} color={color} variant={variant} />}
      <span style={{
        fontFamily: "'Inter',system-ui,sans-serif",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.005em',
        textTransform: 'uppercase',
        color,
      }}>LEVEL</span>
    </span>
  );
}

// App-tile / icon-only mark with rounded-square container.
function LevelIcon({ size = 56, color = '#fafafa', bg = '#1a1714', variant }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, background: bg,
      borderRadius: Math.max(8, size * 0.22),
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.04), 0 1px 2px rgba(0,0,0,.06)',
    }}>
      <StepsMark size={Math.round(size * 0.62)} color={color} variant={variant} />
    </span>
  );
}

Object.assign(window, { StepsMark, LevelMark, LevelIcon, GlyphBars, GlyphIsoStairs, GlyphStairL, GlyphChevronStep, GlyphOffsetSquares });
