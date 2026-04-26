// Hi-fi primitives — full color system, polished components.
// Brand: LEVEL · paper warm-linen, ink near-black, ember amber accent.

const hf = {
  paper:   '#f5f1e8',
  paper2:  '#ebe5d4',
  card:    '#fbf8f1',
  card2:   '#fdfbf6',
  ink:     '#161311',
  ink2:    '#3a342d',
  ink3:    '#6b6259',
  ink4:    '#9c9489',
  hair:    '#dcd2bf',
  hair2:   '#ebe2cf',
  ember:   '#c4622d',
  emberD:  '#a04e1f',
  emberL:  '#e8a26b',
  emberBg: '#fbeadb',
  moss:    '#3d5341',
  mossL:   '#7c9377',
  mossBg:  '#e3eadf',
  rust:    '#8a3a1f',
  bone:    '#faf5e8',
  shadow:  '0 1px 2px rgba(35,25,15,.04), 0 8px 24px rgba(35,25,15,.06)',
  shadowL: '0 1px 1px rgba(35,25,15,.03)',
  shadowH: '0 24px 60px rgba(35,25,15,.18), 0 4px 12px rgba(35,25,15,.06)',
};

if (typeof document !== 'undefined' && !document.getElementById('hf-styles')) {
  const s = document.createElement('style');
  s.id = 'hf-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');
    .hf{font-family:'Inter',system-ui,sans-serif;color:${hf.ink};background:${hf.paper};-webkit-font-smoothing:antialiased;font-feature-settings:'ss01','cv11';position:relative}
    .hf *{box-sizing:border-box}
    .hf::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(60,40,20,.04) 1px,transparent 1px);background-size:3px 3px;opacity:.5;z-index:0}
    .hf-serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
    .hf-mono{font-family:'Geist Mono',ui-monospace,Menlo,monospace}
    .hf-eyebrow{font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${hf.ink3}}
    .hf-h1{font-family:'Instrument Serif',Georgia,serif;font-size:42px;line-height:1.02;letter-spacing:-.018em}
    .hf-h2{font-family:'Instrument Serif',Georgia,serif;font-size:26px;line-height:1.1;letter-spacing:-.012em}
    .hf-h3{font-size:13px;font-weight:600;letter-spacing:-.005em}
    .hf-label{font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${hf.ink3}}
    .hf-body{font-size:13px;line-height:1.5;color:${hf.ink2}}
    .hf-mini{font-family:'Geist Mono',monospace;font-size:10px;color:${hf.ink3};letter-spacing:.04em}
    .hf-num{font-family:'Geist Mono',monospace;font-variant-numeric:tabular-nums}
    .hf-card{background:${hf.card};border:1px solid ${hf.hair};border-radius:10px;box-shadow:${hf.shadowL};position:relative}
    .hf-card-flat{background:${hf.bone};border:1px solid ${hf.hair2};border-radius:10px}
    .hf-card-ink{background:${hf.ink};color:${hf.bone};border:1px solid ${hf.ink};border-radius:10px}
    .hf-divider{height:1px;background:${hf.hair2};border:none;margin:0}
    .hf-row{display:flex;align-items:center;gap:10px}
    .hf-stack{display:flex;flex-direction:column}
    .hf-check{width:22px;height:22px;border:1.5px solid ${hf.ink2};background:${hf.card};border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;cursor:pointer;transition:all .14s;color:transparent;font-weight:700}
    .hf-check.on{background:${hf.ember};border-color:${hf.ember};color:#fff;box-shadow:0 0 0 4px ${hf.emberBg}}
    .hf-check.dim{border-color:${hf.ink4};opacity:.6}
    .hf-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;border:1px solid ${hf.hair};background:${hf.card};color:${hf.ink2};font-weight:500}
    .hf-pill.solid{background:${hf.ink};color:${hf.bone};border-color:${hf.ink}}
    .hf-pill.ember{background:${hf.emberBg};color:${hf.emberD};border-color:${hf.emberL}}
    .hf-pill.moss{background:${hf.mossBg};color:${hf.moss};border-color:${hf.mossL}}
    .hf-pill.ghost{border-style:dashed;color:${hf.ink3};background:transparent}
    .hf-tag{display:inline-flex;align-items:center;font-family:'Geist Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:3px 7px;background:${hf.ink};color:${hf.bone};border-radius:4px;font-weight:600}
    .hf-tag.outline{background:transparent;color:${hf.ink};border:1px solid ${hf.ink}}
    .hf-tag.ember{background:${hf.ember};color:#fff}
    .hf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border:1px solid ${hf.ink};background:${hf.card};font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:.005em;cursor:pointer;border-radius:7px;color:${hf.ink};transition:all .15s}
    .hf-btn:hover{background:${hf.paper}}
    .hf-btn.primary{background:${hf.ink};color:${hf.bone};border-color:${hf.ink}}
    .hf-btn.primary:hover{background:#000}
    .hf-btn.ember{background:${hf.ember};color:#fff;border-color:${hf.ember};box-shadow:0 1px 0 ${hf.emberD},0 4px 12px rgba(196,98,45,.25)}
    .hf-btn.ember:hover{background:${hf.emberD}}
    .hf-btn.ghost{border-color:${hf.hair};color:${hf.ink2}}
    .hf-btn.sm{padding:7px 12px;font-size:11.5px;border-radius:6px}
    .hf-input{border:1px solid ${hf.hair};background:${hf.card};padding:10px 14px;font-family:'Inter',sans-serif;font-size:13px;width:100%;border-radius:7px;color:${hf.ink};box-shadow:inset 0 1px 0 rgba(0,0,0,.02)}
    .hf-bar{position:relative;height:6px;background:${hf.hair2};border-radius:99px;overflow:hidden}
    .hf-bar > span{position:absolute;left:0;top:0;bottom:0;background:${hf.ember};border-radius:99px}
    .hf-bar.ink > span{background:${hf.ink}}
    .hf-bar.moss > span{background:${hf.moss}}
    .hf-cell-q{background:${hf.ember};color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 1px 0 ${hf.emberD}}
    .hf-cell-m{background:${hf.card};border:1.5px solid ${hf.ink3};color:${hf.ink3}}
    .hf-cell-t{background:${hf.card};border:2px solid ${hf.ink};box-shadow:0 0 0 4px ${hf.paper},0 0 0 5px ${hf.ember}}
    .hf-cell-f{background:${hf.card};border:1px dashed ${hf.hair}}
    .hf-cell-claimed{background:${hf.ink};color:${hf.bone}}
    .hf-place{background:linear-gradient(135deg,${hf.paper2},${hf.bone});border:1px solid ${hf.hair2};border-radius:8px;display:flex;align-items:center;justify-content:center;color:${hf.ink4};font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;position:relative;overflow:hidden}
    .hf-place::after{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,transparent,transparent 14px,rgba(0,0,0,.025) 14px,rgba(0,0,0,.025) 28px);pointer-events:none}
    .hf-icon{width:16px;height:16px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:1.6}
    .hf-rail-active{background:${hf.ink};color:${hf.bone};box-shadow:0 1px 0 rgba(255,255,255,.04) inset}
  `;
  document.head.appendChild(s);
}

function HfMark({ size = 22, mono }) {
  return <LevelMark size={size} color={mono ? hf.bone : hf.ink} />;
}

function HfFrame({ title, sub, children, scrollable }) {
  return (
    <div className="hf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: hf.paper, overflow: 'hidden', borderRadius: 10 }}>
      <div style={{ height: 36, borderBottom: `1px solid ${hf.hair2}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0, background: hf.card2, position: 'relative', zIndex: 1 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0573d' }}></span>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e2b441' }}></span>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#7ba85f' }}></span>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: hf.ink3, fontFamily: "'Geist Mono',monospace", letterSpacing: '.04em' }}>level.app — {title}</div>
        <span className="hf-mini">{sub}</span>
      </div>
      <div style={{ flex: 1, overflow: scrollable ? 'auto' : 'hidden', position: 'relative', minHeight: 0, zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function HfRail({ active = 'today', day = 24 }) {
  const items = [
    ['today',    'Today',         'M3 12L12 4l9 8M5 10v10h14V10'],
    ['quests',   'Quest Log',     'M4 6h16M4 12h16M4 18h10'],
    ['vault',    'Reward Vault',  'M5 8h14l-1 12H6L5 8zM8 8V5a4 4 0 018 0v3'],
    ['levels',   'Levels',        'M4 20l4-12 4 8 4-14 4 18'],
    ['codex',    'Codex',         'M5 4h14v16H5zM9 4v16M9 9h10M9 14h10'],
    ['settings', 'Settings',      'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 13a7.5 7.5 0 000-2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7.5 7.5 0 00-1.7 1l-2.4-1-2 3.5L4.6 11a7.5 7.5 0 000 2L2.6 14.5l2 3.5 2.4-1a7.5 7.5 0 001.7 1l.4 2.5h4l.4-2.5a7.5 7.5 0 001.7-1l2.4 1 2-3.5z'],
  ];
  return (
    <div style={{ width: 200, borderRight: `1px solid ${hf.hair2}`, background: hf.card2, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative', zIndex: 1 }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${hf.hair2}` }}>
        <LevelMark size={22} color={hf.ink} variant="squares" />
        <div className="hf-mini" style={{ marginTop: 8 }}>RUN 01 · DAY {day}/90</div>
      </div>
      <div style={{ padding: '14px 12px', flex: 1 }}>
        {items.map(([id, label, path]) => (
          <div key={id} className={active === id ? 'hf-rail-active' : ''} style={{
            padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 11, fontSize: 13, fontWeight: 500,
            borderRadius: 7, marginBottom: 3,
            color: active === id ? hf.bone : hf.ink2, cursor: 'pointer'
          }}>
            <svg className="hf-icon" viewBox="0 0 24 24"><path d={path} /></svg>
            {label}
            {active === id && <span style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: 99, background: hf.ember }}></span>}
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${hf.hair2}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,'+hf.ember+','+hf.rust+')', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 18, fontStyle: 'italic' }}>P</div>
        <div className="hf-stack" style={{ minWidth: 0 }}>
          <span className="hf-h3" style={{ fontSize: 12.5 }}>player_one</span>
          <span className="hf-mini">Lv 07 · 8/15 chain</span>
        </div>
      </div>
    </div>
  );
}

function HfTop({ crumb, sub, status, statusKind = 'progress', right }) {
  return (
    <div style={{ height: 64, borderBottom: `1px solid ${hf.hair2}`, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 14, flexShrink: 0, background: hf.paper, position: 'relative', zIndex: 1 }}>
      <div className="hf-stack">
        <span className="hf-eyebrow">{crumb}</span>
        {sub && <span className="hf-h3" style={{ marginTop: 3, fontSize: 14 }}>{sub}</span>}
      </div>
      <div style={{ flex: 1 }}></div>
      {right}
      {status && (
        <span className={'hf-pill ' + (statusKind === 'ember' ? 'ember' : statusKind === 'moss' ? 'moss' : statusKind === 'solid' ? 'solid' : '')}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusKind === 'solid' ? hf.bone : statusKind === 'ember' ? hf.ember : statusKind === 'moss' ? hf.moss : hf.ink, animation: statusKind === 'progress' ? 'pulse 2s infinite' : 'none' }}></span>
          {status}
        </span>
      )}
    </div>
  );
}

function HfChain({ cells, label, sub }) {
  return (
    <div>
      <div className="hf-row" style={{ justifyContent: 'space-between' }}>
        <span className="hf-eyebrow">{label}</span>
        {sub && <span className="hf-mini">{sub}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 4, marginTop: 12 }}>
        {cells.map((c, i) => {
          const cls = c === 'q' ? 'hf-cell-q' : c === 'm' ? 'hf-cell-m' : c === 't' ? 'hf-cell-t' : 'hf-cell-f';
          return (
            <div key={i} className={cls} style={{ height: 28, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono',monospace", fontSize: 10, fontWeight: 700 }}>
              {c === 'q' ? '✓' : c === 'm' ? '×' : c === 't' ? <span style={{ fontSize: 8 }}>NOW</span> : ''}
            </div>
          );
        })}
      </div>
      <div className="hf-row" style={{ gap: 18, marginTop: 12 }}>
        <span className="hf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: hf.ember, borderRadius: 3 }}></span>qualified</span>
        <span className="hf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: `1.5px solid ${hf.ink3}`, borderRadius: 3 }}></span>miss</span>
        <span className="hf-mini" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: `1.5px dashed ${hf.hair}`, borderRadius: 3 }}></span>future</span>
      </div>
    </div>
  );
}

Object.assign(window, { hf, HfMark, HfFrame, HfRail, HfTop, HfChain });
