// Wireframe primitives — grayscale annotation kit.
// Lo-fi feel: dashed boxes, mono captions, no color, hand-drawn cadence.

const wfStyles = {
  font: 'ui-monospace, "SF Mono", "Menlo", monospace',
  ink: '#1a1a1a',
  ink2: '#666',
  ink3: '#aaa',
  paper: '#fafaf7',
  hair: '#d4d4cf',
  accent: '#1a1a1a',
};

// One-time styles
if (typeof document !== 'undefined' && !document.getElementById('wf-styles')) {
  const s = document.createElement('style');
  s.id = 'wf-styles';
  s.textContent = `
    .wf{font-family:${wfStyles.font};color:${wfStyles.ink};background:${wfStyles.paper};-webkit-font-smoothing:antialiased}
    .wf *{box-sizing:border-box}
    .wf-box{border:1.25px dashed #1a1a1a;background:#fff}
    .wf-solid{border:1.25px solid #1a1a1a;background:#fff}
    .wf-fill{background:#1a1a1a;color:#fafaf7;border:1.25px solid #1a1a1a}
    .wf-mute{color:#888}
    .wf-cap{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#666}
    .wf-tag{display:inline-block;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:2px 6px;border:1px dashed #999;color:#666;background:#fff}
    .wf-h1{font-size:22px;font-weight:600;letter-spacing:-.01em}
    .wf-h2{font-size:14px;font-weight:600;letter-spacing:.02em;text-transform:uppercase}
    .wf-h3{font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
    .wf-body{font-size:12px;line-height:1.45;color:#333}
    .wf-mini{font-size:10px;color:#666}
    .wf-row{display:flex;align-items:center;gap:8px}
    .wf-stack{display:flex;flex-direction:column}
    .wf-divider{height:1px;background:#ddd;border:none}
    .wf-dash{border-top:1.25px dashed #999}
    .wf-check{width:18px;height:18px;border:1.25px solid #1a1a1a;background:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;cursor:pointer;user-select:none}
    .wf-check.on{background:#1a1a1a;color:#fff}
    .wf-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid #1a1a1a;font-size:10px;letter-spacing:.06em;text-transform:uppercase;background:#fff}
    .wf-pill.on{background:#1a1a1a;color:#fff}
    .wf-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 14px;border:1.25px solid #1a1a1a;font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:#fff;cursor:pointer;font-family:inherit;color:#1a1a1a}
    .wf-btn.primary{background:#1a1a1a;color:#fff}
    .wf-btn.ghost{border-style:dashed;color:#666}
    .wf-input{border:1.25px solid #1a1a1a;background:#fff;padding:8px 10px;font-family:inherit;font-size:12px;width:100%;color:#1a1a1a}
    .wf-note{position:absolute;background:#fef4a8;color:#4a3a0a;padding:6px 9px;font-size:10px;font-family:${wfStyles.font};line-height:1.35;max-width:200px;border:1px solid #c9a800;box-shadow:2px 2px 0 #c9a800;z-index:5;pointer-events:none}
    .wf-note::before{content:'NOTE';display:block;font-size:8px;letter-spacing:.15em;color:#7a5a00;margin-bottom:2px;font-weight:700}
    .wf-arrow{position:absolute;pointer-events:none;z-index:4}
    .wf-place{display:flex;align-items:center;justify-content:center;color:#999;font-size:10px;letter-spacing:.05em;text-transform:uppercase;background:repeating-linear-gradient(45deg,#fafafa,#fafafa 6px,#f0f0f0 6px,#f0f0f0 12px);border:1.25px dashed #aaa;text-align:center;padding:8px}
    .wf-x{position:relative}
    .wf-x::before,.wf-x::after{content:'';position:absolute;inset:0;background:linear-gradient(to top right,transparent calc(50% - 0.5px),#bbb calc(50% - 0.5px),#bbb calc(50% + 0.5px),transparent calc(50% + 0.5px))}
    .wf-x::after{background:linear-gradient(to bottom right,transparent calc(50% - 0.5px),#bbb calc(50% - 0.5px),#bbb calc(50% + 0.5px),transparent calc(50% + 0.5px))}
    .wf-bar{position:relative;height:6px;background:#fff;border:1px solid #1a1a1a}
    .wf-bar > span{position:absolute;left:0;top:0;bottom:0;background:#1a1a1a}
    .wf-grid-bg{background-image:linear-gradient(to right,#eee 1px,transparent 1px),linear-gradient(to bottom,#eee 1px,transparent 1px);background-size:8px 8px}
  `;
  document.head.appendChild(s);
}

// Annotation note — absolute-positioned post-it.
function WfNote({ children, style }) {
  return <div className="wf-note" style={style}>{children}</div>;
}

// Placeholder block for an image / chart / illustration.
function WfPlace({ label, height = 60, style }) {
  return <div className="wf-place" style={{ height, ...style }}>{label}</div>;
}

// A labeled section (artboard sub-region).
function WfSection({ title, children, style }) {
  return (
    <div style={{ ...style }}>
      {title && <div className="wf-cap" style={{ marginBottom: 6 }}>{title}</div>}
      {children}
    </div>
  );
}

// Frame chrome — gives the artboard a browser-window feel without being a full mockup.
function WfFrame({ title, children, width, height, scrollable }) {
  return (
    <div className="wf" style={{ width, height, display: 'flex', flexDirection: 'column', background: wfStyles.paper, border: '1.25px solid #1a1a1a', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 26, borderBottom: '1.25px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, fontSize: 10, color: '#666', flexShrink: 0, background: '#fff' }}>
        <span style={{ width: 8, height: 8, border: '1px solid #1a1a1a', borderRadius: '50%' }}></span>
        <span style={{ width: 8, height: 8, border: '1px solid #1a1a1a', borderRadius: '50%' }}></span>
        <span style={{ width: 8, height: 8, border: '1px solid #1a1a1a', borderRadius: '50%' }}></span>
        <span style={{ marginLeft: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ marginLeft: 'auto' }} className="wf-mute">level.app</span>
      </div>
      <div style={{ flex: 1, overflow: scrollable ? 'auto' : 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

// Left rail — present in every signed-in screen.
function WfLeftRail({ active = 'today' }) {
  const items = [
    ['today', 'Today'],
    ['quests', 'Quest Log'],
    ['vault', 'Reward Vault'],
    ['levels', 'Levels'],
    ['codex', 'Codex'],
    ['settings', 'Settings'],
  ];
  return (
    <div style={{ width: 160, borderRight: '1.25px solid #1a1a1a', padding: '14px 0', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '0 14px 14px', borderBottom: '1px dashed #ccc', marginBottom: 10 }}>
        <div className="wf-h3">LeveL</div>
        <div className="wf-mini" style={{ marginTop: 2 }}>v0.3 · Run 01</div>
      </div>
      {items.map(([id, label]) => (
        <div key={id} style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', background: active === id ? '#1a1a1a' : 'transparent', color: active === id ? '#fff' : '#333', cursor: 'pointer' }}>
          <span style={{ width: 10, height: 10, border: '1px solid currentColor' }}></span>
          {label}
        </div>
      ))}
      <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px dashed #ccc' }}>
        <div className="wf-mini">USER</div>
        <div className="wf-body" style={{ fontSize: 11 }}>player_one</div>
        <div className="wf-mini" style={{ marginTop: 4 }}>Day 24 of 90</div>
      </div>
    </div>
  );
}

// Top app bar — used inside the content area for context (which screen, day, status).
function WfTopBar({ crumb, status }) {
  return (
    <div style={{ height: 38, borderBottom: '1px dashed #bbb', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12, flexShrink: 0, background: wfStyles.paper }}>
      <div className="wf-cap">{crumb}</div>
      <div style={{ flex: 1 }}></div>
      {status && <div className="wf-pill on">{status}</div>}
    </div>
  );
}

// Chain ribbon — 18-cell rolling-window visualization.
// states: q (qualified), m (miss), t (today), f (future)
function WfChainRibbon({ cells, label = 'Cycle 02 · 8/15 qualified · 1 miss used' }) {
  return (
    <div style={{ }}>
      <div className="wf-cap" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 3 }}>
        {cells.map((c, i) => {
          const base = { height: 18, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' };
          if (c === 'q') return <div key={i} className="wf-fill" style={base}>✓</div>;
          if (c === 'm') return <div key={i} className="wf-x wf-box" style={base}></div>;
          if (c === 't') return <div key={i} className="wf-solid" style={{ ...base, borderWidth: 2, fontWeight: 700 }}>NOW</div>;
          return <div key={i} className="wf-box" style={base}></div>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        <span className="wf-mini">■ qualified</span>
        <span className="wf-mini">⊠ miss</span>
        <span className="wf-mini">□ future</span>
      </div>
    </div>
  );
}

Object.assign(window, { WfNote, WfPlace, WfSection, WfFrame, WfLeftRail, WfTopBar, WfChainRibbon, wfStyles });
