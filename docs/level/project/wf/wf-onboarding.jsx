// Wireframe — Onboarding (one screen showing the multi-step setup spine).

function WfOnboarding() {
  return (
    <WfFrame title="00 · ONBOARDING · STEP 4 of 6" width={1280} height={820}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px dashed #bbb', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="wf-h3">LeveL · First Run Setup</div>
          <div style={{ flex: 1 }}></div>
          {['Player','Pillars','Targets','Rewards','Sequence','Review'].map((s,i)=>(
            <span key={s} className={'wf-pill ' + (i<=3?'on':'')}>{i+1}. {s}</span>
          ))}
        </div>
        <div style={{ flex: 1, padding: 28, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 28, minHeight: 0 }}>
          {/* Left — explanation */}
          <div className="wf-stack" style={{ gap: 14 }}>
            <span className="wf-cap">Step 4 · Reward Vault</span>
            <h1 className="wf-h1">Pre-select all six rewards.</h1>
            <p className="wf-body">Six rewards alternate <b>small / big</b> at days 15, 30, 45, 60, 75, 90. Once locked, you can <b>only upgrade</b> — never downgrade. The system won't start until all six are configured.</p>
            <div className="wf-box" style={{ padding: 12 }}>
              <div className="wf-cap">Rules of the vault</div>
              <ul style={{ margin: '8px 0 0 14px', padding: 0, fontSize: 11, lineHeight: 1.6, color: '#333' }}>
                <li>Item, photo, real-world price required.</li>
                <li>One-sentence "why this motivates me" note.</li>
                <li>Upgrades blocked for 7 days after any redemption.</li>
              </ul>
            </div>
            <WfPlace label="STEP DIAGRAM · 6 chests across 90-day timeline" height={120} />
          </div>

          {/* Right — slot grid */}
          <div className="wf-stack" style={{ gap: 12 }}>
            <div className="wf-row" style={{ justifyContent: 'space-between' }}>
              <span className="wf-cap">Slots · 4 of 6 configured</span>
              <span className="wf-mini">drag to reorder · click to edit</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { day: 15, tier: 'small', filled: true,  name: 'Steam game', price: '$30' },
                { day: 30, tier: 'big',   filled: true,  name: 'Mech keyboard', price: '$240' },
                { day: 45, tier: 'small', filled: true,  name: 'New hoodie', price: '$80' },
                { day: 60, tier: 'big',   filled: true,  name: 'Weekend trip', price: '$420' },
                { day: 75, tier: 'small', filled: false, name: '', price: '' },
                { day: 90, tier: 'big',   filled: false, name: '', price: '' },
              ].map((r) => (
                <div key={r.day} className={r.filled ? 'wf-box' : 'wf-place'} style={{ padding: 10, height: 170, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                    <span className="wf-cap">DAY {r.day}</span>
                    <span className="wf-tag" style={{ background: r.tier === 'big' ? '#1a1a1a' : '#fff', color: r.tier === 'big' ? '#fff' : '#1a1a1a' }}>{r.tier.toUpperCase()}</span>
                  </div>
                  {r.filled ? (
                    <>
                      <WfPlace label="PHOTO" height={56} style={{ marginTop: 8 }} />
                      <div className="wf-h3" style={{ marginTop: 6 }}>{r.name}</div>
                      <div className="wf-mini">{r.price}</div>
                      <div className="wf-mini" style={{ marginTop: 4, fontStyle: 'italic' }}>"why" note · 1 line</div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#888' }}>+ tap to fill</div>
                  )}
                </div>
              ))}
            </div>
            <div className="wf-row" style={{ marginTop: 'auto', justifyContent: 'space-between' }}>
              <button className="wf-btn">← Targets</button>
              <span className="wf-mini">2 slots remaining</span>
              <button className="wf-btn primary">Sequence →</button>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

window.WfOnboarding = WfOnboarding;
