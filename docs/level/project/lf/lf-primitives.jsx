// Lo-fi primitives — grayscale but with real type hierarchy and component-level fidelity.
// Brand: LeveL · serif display + geist mono tactical + inter UI · paper #f6f3ec, ink #1a1714.

const lfStyles = {
  ink:    '#1a1714',
  ink2:   '#3a342d',
  ink3:   '#6b6259',
  ink4:   '#9c9489',
  hair:   '#cfc6b8',
  hair2:  '#e7dfd1',
  paper:  '#f6f3ec',
  paper2: '#fbf8f1',
  card:   '#ffffff',
  fill:   '#1a1714',
  fillT:  '#fafafa',
  good:   '#2c2c2c', // grayscale stand-in
  warn:   '#555',
};

if (typeof document !== 'undefined' && !document.getElementById('lf-styles')) {
  const s = document.createElement('style');
  s.id = 'lf-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
    .lf{font-family:'Inter',system-ui,sans-serif;color:${lfStyles.ink};background:${lfStyles.paper};-webkit-font-smoothing:antialiased;font-feature-settings:'ss01','cv11'}
    .lf *{box-sizing:border-box}
    .lf-serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-.005em}
    .lf-mono{font-family:'Geist Mono',ui-monospace,Menlo,monospace}
    .lf-eyebrow{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${lfStyles.ink3}}
    .lf-h1{font-family:'Instrument Serif',Georgia,serif;font-size:36px;line-height:1.05;letter-spacing:-.015em;font-weight:400}
    .lf-h2{font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1.1;letter-spacing:-.01em;font-weight:400}
    .lf-h3{font-size:13px;font-weight:600;letter-spacing:-.005em}
    .lf-label{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${lfStyles.ink3}}
    .lf-body{font-size:13px;line-height:1.5;color:${lfStyles.ink2}}
    .lf-mini{font-family:'Geist Mono',monospace;font-size:10px;color:${lfStyles.ink3};letter-spacing:.04em}
    .lf-num{font-family:'Geist Mono',monospace;font-variant-numeric:tabular-nums}
    .lf-card{background:${lfStyles.card};border:1px solid ${lfStyles.hair};border-radius:6px}
    .lf-card-flat{background:${lfStyles.paper2};border:1px solid ${lfStyles.hair2};border-radius:6px}
    .lf-divider{height:1px;background:${lfStyles.hair2};border:none;margin:0}
    .lf-row{display:flex;align-items:center;gap:10px}
    .lf-stack{display:flex;flex-direction:column}
    .lf-check{width:20px;height:20px;border:1.5px solid ${lfStyles.ink};background:${lfStyles.card};border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;cursor:pointer;transition:all .12s;color:transparent}
    .lf-check.on{background:${lfStyles.ink};color:${lfStyles.fillT}}
    .lf-check.dim{border-color:${lfStyles.ink4};background:${lfStyles.paper2}}
    .lf-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;border:1px solid ${lfStyles.hair};background:${lfStyles.card};color:${lfStyles.ink2}}
    .lf-pill.solid{background:${lfStyles.ink};color:${lfStyles.fillT};border-color:${lfStyles.ink}}
    .lf-pill.ghost{border-style:dashed;color:${lfStyles.ink3}}
    .lf-tag{display:inline-flex;align-items:center;font-family:'Geist Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;padding:2px 6px;background:${lfStyles.ink};color:${lfStyles.fillT};border-radius:3px}
    .lf-tag.outline{background:transparent;color:${lfStyles.ink};border:1px solid ${lfStyles.ink}}
    .lf-tag.dim{background:${lfStyles.hair2};color:${lfStyles.ink2}}
    .lf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;border:1px solid ${lfStyles.ink};background:${lfStyles.card};font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:.02em;cursor:pointer;border-radius:5px;color:${lfStyles.ink};transition:all .12s}
    .lf-btn:hover{background:${lfStyles.paper}}
    .lf-btn.primary{background:${lfStyles.ink};color:${lfStyles.fillT}}
    .lf-btn.primary:hover{background:#000}
    .lf-btn.ghost{border-color:${lfStyles.hair};color:${lfStyles.ink2}}
    .lf-btn.sm{padding:6px 10px;font-size:11px}
    .lf-input{border:1px solid ${lfStyles.hair};background:${lfStyles.card};padding:9px 12px;font-family:'Inter',sans-serif;font-size:12px;width:100%;border-radius:5px;color:${lfStyles.ink}}
    .lf-bar{position:relative;height:5px;background:${lfStyles.hair2};border-radius:99px;overflow:hidden}
    .lf-bar > span{position:absolute;left:0;top:0;bottom:0;background:${lfStyles.ink};border-radius:99px;transition:width .3s}
    .lf-cell-q{background:${lfStyles.ink};color:${lfStyles.fillT}}
    .lf-cell-m{background:${lfStyles.card};border:1.5px solid ${lfStyles.ink3};color:${lfStyles.ink3}}
    .lf-cell-t{background:${lfStyles.card};border:2px solid ${lfStyles.ink};box-shadow:0 0 0 3px ${lfStyles.paper2}, 0 0 0 4px ${lfStyles.ink}}
    .lf-cell-f{background:${lfStyles.card};border:1px dashed ${lfStyles.hair}}
    .lf-square{width:34px;height:34px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px;font-weight:500;flex-shrink:0}
    .lf-place{background:${lfStyles.paper2};border:1px solid ${lfStyles.hair2};border-radius:6px;display:flex;align-items:center;justify-content:center;color:${lfStyles.ink4};font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;background-image:repeating-linear-gradient(135deg,transparent,transparent 12px,rgba(0,0,0,.03) 12px,rgba(0,0,0,.03) 24px)}
    .lf-icon{width:14px;height:14px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:1.6}
  `;
  document.head.appendChild(s);
}

// Brand mark — uses global LevelMark from brand/level-mark.jsx.
function LfMark({ size = 18, mono }) {
  const c = mono ? lfStyles.fillT : lfStyles.ink;
  return <LevelMark size={size} color={c} />;
}

// Common chrome — browser-window style frame.
function LfFrame({ title, sub, children, scrollable }) {
  return (
    <div className="lf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: lfStyles.paper, overflow: 'hidden', position: 'relative', borderRadius: 8 }}>
      <div style={{ height: 32, borderBottom: `1px solid ${lfStyles.hair}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, flexShrink: 0, background: lfStyles.card }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e1dccf' }}></span>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e1dccf' }}></span>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e1dccf' }}></span>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: lfStyles.ink3, fontFamily: "'Geist Mono',monospace", letterSpacing: '.04em' }}>level.app — {title}</div>
        <span className="lf-mini">{sub}</span>
      </div>
      <div style={{ flex: 1, overflow: scrollable ? 'auto' : 'hidden', position: 'relative', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

// Left rail — branded sidebar.
function LfRail({ active = 'today', day = 24 }) {
  const items = [
    ['today',    'Today',         'M3 12L12 4l9 8M5 10v10h14V10'],
    ['quests',   'Quest Log',     'M4 5h16M4 12h16M4 19h10'],
    ['vault',    'Reward Vault',  'M5 8h14l-1 12H6L5 8zM8 8V5a4 4 0 018 0v3'],
    ['levels',   'Levels',        'M4 20l4-12 4 8 4-14 4 18'],
    ['codex',    'Codex',         'M5 4h14v16H5zM9 4v16M9 9h10M9 14h10'],
    ['settings', 'Settings',      'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 13a7.5 7.5 0 000-2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7.5 7.5 0 00-1.7 1l-2.4-1-2 3.5L4.6 11a7.5 7.5 0 000 2L2.6 14.5l2 3.5 2.4-1a7.5 7.5 0 001.7 1l.4 2.5h4l.4-2.5a7.5 7.5 0 001.7-1l2.4 1 2-3.5z'],
  ];
  return (
    <div style={{ width: 188, borderRight: `1px solid ${lfStyles.hair}`, padding: 0, background: lfStyles.card, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '20px 18px 18px', borderBottom: `1px solid ${lfStyles.hair2}` }}>
        <LfMark size={26} />
        <div className="lf-mini" style={{ marginTop: 6 }}>RUN 01 · DAY {day}/90</div>
      </div>
      <div style={{ padding: '12px 10px', flex: 1 }}>
        {items.map(([id, label, path]) => (
          <div key={id} style={{
            padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, fontWeight: 500,
            borderRadius: 5, marginBottom: 2,
            background: active === id ? lfStyles.ink : 'transparent',
            color: active === id ? lfStyles.fillT : lfStyles.ink2, cursor: 'pointer'
          }}>
            <svg className="lf-icon" viewBox="0 0 24 24"><path d={path} /></svg>
            {label}
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${lfStyles.hair2}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: lfStyles.hair2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 16 }}>P</div>
        <div className="lf-stack" style={{ minWidth: 0 }}>
          <span className="lf-h3" style={{ fontSize: 12 }}>player_one</span>
          <span className="lf-mini">Lv 07 · 8/15 chain</span>
        </div>
      </div>
    </div>
  );
}

// Top bar
function LfTop({ crumb, sub, status, statusKind = 'progress' }) {
  return (
    <div style={{ height: 56, borderBottom: `1px solid ${lfStyles.hair2}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14, flexShrink: 0, background: lfStyles.paper }}>
      <div className="lf-stack">
        <span className="lf-eyebrow">{crumb}</span>
        {sub && <span className="lf-h3" style={{ marginTop: 2 }}>{sub}</span>}
      </div>
      <div style={{ flex: 1 }}></div>
      {status && (
        <span className={'lf-pill ' + (statusKind === 'solid' ? 'solid' : '')}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusKind === 'solid' ? lfStyles.fillT : lfStyles.ink }}></span>
          {status}
        </span>
      )}
    </div>
  );
}

// Chain ribbon — 18 cells, lo-fi.
function LfChain({ cells, label, sub }) {
  return (
    <div>
      <div className="lf-row" style={{ justifyContent: 'space-between' }}>
        <span className="lf-eyebrow">{label}</span>
        {sub && <span className="lf-mini">{sub}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 4, marginTop: 10 }}>
        {cells.map((c, i) => {
          const cls = c === 'q' ? 'lf-cell-q' : c === 'm' ? 'lf-cell-m' : c === 't' ? 'lf-cell-t' : 'lf-cell-f';
          return (
            <div key={i} className={cls} style={{ height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono',monospace", fontSize: 9, fontWeight: 600 }}>
              {c === 'q' ? '✓' : c === 'm' ? '×' : c === 't' ? <span style={{ fontSize: 8 }}>NOW</span> : ''}
            </div>
          );
        })}
      </div>
      <div className="lf-row" style={{ gap: 16, marginTop: 10 }}>
        <span className="lf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: lfStyles.ink, borderRadius: 2 }}></span>qualified</span>
        <span className="lf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: `1.5px solid ${lfStyles.ink3}`, borderRadius: 2 }}></span>miss</span>
        <span className="lf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: `1px dashed ${lfStyles.hair}`, borderRadius: 2 }}></span>future</span>
      </div>
    </div>
  );
}

Object.assign(window, { lfStyles, LfMark, LfFrame, LfRail, LfTop, LfChain });
