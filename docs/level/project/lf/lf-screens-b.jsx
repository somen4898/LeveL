// Lo-fi · Log+Reasoning, Level-Up, Vault, History, Settings, Continuation.

function LfLogReason() {
  const text = "Couldn't fall asleep last night, ended up debugging the chain bug until 2am. Plan to crash early tonight.";
  return (
    <LfFrame title="log · skip optional" sub="REASONING REQUIRED">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="quests" />
        <div style={{ flex: 1, position: 'relative' }}>
          <LfTop crumb="QUEST LOG" sub="Skip · Sleep ≥ 7 hrs" />
          <div style={{ padding: 28, opacity: 0.4, pointerEvents: 'none' }}>
            <div className="lf-card" style={{ padding: 18 }}>
              <span className="lf-eyebrow">Recent skips</span>
              <div className="lf-place" style={{ height: 200, marginTop: 12 }}>BG · log table</div>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,14,.32)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="lf-card" style={{ width: 560, padding: 26, background: lfStyles.card, boxShadow: '0 24px 60px rgba(0,0,0,.18)' }}>
              <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                <span className="lf-eyebrow">Skip optional</span>
                <span className="lf-mini">×</span>
              </div>
              <h2 className="lf-h1" style={{ fontSize: 28, marginTop: 8 }}>Why are you skipping <em style={{ fontStyle: 'italic' }}>Sleep ≥ 7 hrs</em>?</h2>
              <p className="lf-body" style={{ marginTop: 8 }}>Fifty characters or more. The act of typing the reason is the friction that catches lazy skips.</p>

              <div style={{ marginTop: 18 }}>
                <span className="lf-eyebrow">Tag · optional</span>
                <div className="lf-row" style={{ gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {['Sick','Tired','Busy','Other'].map((t,i) => (
                    <span key={t} className={'lf-pill ' + (i === 1 ? 'solid' : '')}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <span className="lf-eyebrow">Reason · 50+ chars</span>
                <div className="lf-input" style={{ height: 102, padding: 12, fontSize: 13, lineHeight: 1.55, marginTop: 8 }}>
                  {text}
                  <span style={{ display: 'inline-block', width: 1.5, height: 16, background: lfStyles.ink, marginLeft: 1, verticalAlign: 'text-bottom', animation: 'none' }}></span>
                </div>
                <div className="lf-row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                  <div className="lf-row" style={{ gap: 8 }}>
                    <div style={{ width: 80, height: 4, background: lfStyles.hair2, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: lfStyles.ink }}></div>
                    </div>
                    <span className="lf-mini lf-num">{text.length} / 50 · valid</span>
                  </div>
                  <span className="lf-mini">consecutive skips: 1 · locks at 3</span>
                </div>
              </div>

              <div className="lf-row" style={{ marginTop: 22, justifyContent: 'flex-end', gap: 8 }}>
                <button className="lf-btn ghost">Cancel</button>
                <button className="lf-btn primary">Confirm skip</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfLevelUp() {
  const opts = [
    { kind: 'tighten', target: 'Eating · Water', text: '+150 ml water target', sub: '3.0 L → 3.15 L', selected: false },
    { kind: 'tighten', target: 'Gym · Duration', text: '+2 min minimum',       sub: '45 → 47 min',    selected: true },
    { kind: 'tighten', target: 'Coding · Tier',  text: 'Require ≥ 1 Medium',   sub: 'any → 1 medium',selected: false },
  ];
  return (
    <LfFrame title="level-up · auto-triggered" sub="LV 07 → 08">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="levels" />
        <div style={{ flex: 1, position: 'relative', background: lfStyles.paper }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,14,.42)' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="lf-card" style={{ width: 760, padding: 32, background: lfStyles.card, boxShadow: '0 30px 80px rgba(0,0,0,.22)', position: 'relative' }}>
              <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                <span className="lf-eyebrow">Level-up · 3 consecutive qualifying days</span>
                <span className="lf-pill">odd · TIGHTEN</span>
              </div>
              <div className="lf-row" style={{ gap: 22, marginTop: 18, alignItems: 'baseline' }}>
                <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 96, lineHeight: 1, fontStyle: 'italic' }}>
                  <span style={{ color: lfStyles.ink4 }}>07</span> → 08
                </div>
                <div className="lf-stack" style={{ flex: 1 }}>
                  <span className="lf-h2">Choose your tightening.</span>
                  <span className="lf-body" style={{ marginTop: 4 }}>One existing subtask gets a small upgrade. The unselected options return to the pool — you may see them again at a later odd level.</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 22 }}>
                {opts.map((o, i) => (
                  <div key={i} className="lf-card" style={{ padding: 18, position: 'relative', background: o.selected ? lfStyles.ink : lfStyles.card, color: o.selected ? lfStyles.fillT : lfStyles.ink, borderColor: o.selected ? lfStyles.ink : lfStyles.hair, cursor: 'pointer' }}>
                    <span className="lf-mini" style={{ color: 'inherit', opacity: 0.65, letterSpacing: '.12em' }}>{o.kind.toUpperCase()} · {o.target}</span>
                    <div className="lf-h2" style={{ marginTop: 8, color: 'inherit' }}>{o.text}</div>
                    <div className="lf-mini" style={{ marginTop: 8, color: 'inherit', opacity: 0.7 }}>{o.sub}</div>
                    <div style={{ marginTop: 18, fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.85 }}>
                      {o.selected ? '◉ selected' : '○ tap to choose'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lf-row" style={{ marginTop: 22, justifyContent: 'space-between' }}>
                <span className="lf-mini">Selection is FINAL for this level. Applies tomorrow.</span>
                <button className="lf-btn primary">Confirm & apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfVault() {
  const stops = [
    { day: 15, tier: 'small', state: 'claimed',    name: 'Steam game',    price: '$30',  why: 'a small "did it" trophy.' },
    { day: 30, tier: 'big',   state: 'qualifying', name: 'Mech keyboard', price: '$240', why: 'earned my 9-to-5 focus.' },
    { day: 45, tier: 'small', state: 'locked',     name: 'New hoodie',    price: '$80',  why: 'comfortable identity shift.' },
    { day: 60, tier: 'big',   state: 'locked',     name: 'Weekend trip',  price: '$420', why: 'a date with future me.' },
    { day: 75, tier: 'small', state: 'locked',     name: 'AirPods Pro',   price: '$249', why: 'gym podcast upgrade.' },
    { day: 90, tier: 'big',   state: 'locked',     name: 'Suit jacket',   price: '$520', why: 'show up as the Day-90 me.' },
  ];
  return (
    <LfFrame title="reward vault" sub="6 STATIONS · ALTERNATING">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="vault" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LfTop crumb="REWARD VAULT" sub="Six stations · alternating small / big" status="Upgrade locked · 2d remain" />
          <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0, overflow: 'auto' }}>
            <div className="lf-card" style={{ padding: 22 }}>
              <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                <span className="lf-eyebrow">90-day journey</span>
                <span className="lf-mini">day 24 · 1 claimed of 6</span>
              </div>
              <div style={{ position: 'relative', marginTop: 22, height: 96 }}>
                <div style={{ position: 'absolute', left: 18, right: 18, top: 38, height: 2, background: lfStyles.hair }}></div>
                <div style={{ position: 'absolute', left: 18, top: 38, height: 2, width: '8%', background: lfStyles.ink }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
                  {stops.map((s,i) => (
                    <div key={s.day} className="lf-stack" style={{ alignItems: 'center', gap: 8 }}>
                      <span className="lf-mini lf-num">DAY {s.day}</span>
                      <div className="lf-square" style={{
                        width: 44, height: 44,
                        background: s.state === 'claimed' ? lfStyles.ink : (s.state === 'qualifying' ? lfStyles.card : lfStyles.paper2),
                        border: `1.5px solid ${s.state === 'locked' ? lfStyles.hair : lfStyles.ink}`,
                        borderStyle: s.state === 'locked' ? 'dashed' : 'solid',
                        color: s.state === 'claimed' ? lfStyles.fillT : lfStyles.ink,
                        boxShadow: s.state === 'qualifying' ? `0 0 0 4px ${lfStyles.paper}, 0 0 0 5px ${lfStyles.ink}` : 'none',
                      }}>
                        {s.state === 'claimed' ? '✓' : s.state === 'qualifying' ? '◉' : (s.tier === 'big' ? 'B' : 's')}
                      </div>
                      <span className="lf-mini">{s.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {stops.map((s) => (
                <div key={s.day} className="lf-card" style={{ padding: 16, opacity: s.state === 'locked' ? 0.78 : 1 }}>
                  <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                    <span className="lf-mini lf-num">DAY {s.day} · {s.tier.toUpperCase()}</span>
                    <span className={'lf-pill ' + (s.state === 'qualifying' ? 'solid' : '')}>{s.state}</span>
                  </div>
                  <div className="lf-place" style={{ height: 90, marginTop: 12 }}>PHOTO</div>
                  <div className="lf-h3" style={{ marginTop: 12 }}>{s.name}</div>
                  <div className="lf-mini lf-num" style={{ marginTop: 2 }}>{s.price}</div>
                  <div className="lf-body" style={{ fontSize: 11.5, marginTop: 8, fontStyle: 'italic', color: lfStyles.ink3 }}>"{s.why}"</div>
                  {s.state === 'qualifying' && (
                    <>
                      <div className="lf-bar" style={{ marginTop: 12 }}><span style={{ width: '53%' }}></span></div>
                      <div className="lf-mini" style={{ marginTop: 4 }}>8/15 · day-floor in 6d</div>
                    </>
                  )}
                  <div className="lf-row" style={{ marginTop: 14, gap: 6 }}>
                    {s.state === 'claimed' && <span className="lf-mini">claimed Day 17 ✓</span>}
                    {s.state === 'qualifying' && <button className="lf-btn ghost sm" style={{ flex: 1 }} disabled>CLAIM (D{s.day})</button>}
                    {s.state === 'locked' && <button className="lf-btn ghost sm" style={{ flex: 1 }}>Upgrade…</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfHistory() {
  const heatmap = Array.from({ length: 90 }, (_, i) => {
    if (i >= 24) return 'f';
    if ([4,11,18].includes(i)) return 'm';
    return 'q';
  });
  return (
    <LfFrame title="codex · history" sub="DAY 1 → DAY 24">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="codex" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LfTop crumb="CODEX" sub="Run 01 archive" status="Recording" />
          <div style={{ flex: 1, padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minHeight: 0, overflow: 'auto' }}>
            <div className="lf-stack" style={{ gap: 14 }}>
              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Compliance heatmap · 90 days</span>
                  <span className="lf-mini lf-num">21 ✓ · 3 ✗ · 66 future</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 1fr)', gap: 4, marginTop: 14 }}>
                  {heatmap.map((c, i) => (
                    <div key={i} className={c === 'q' ? 'lf-cell-q' : c === 'm' ? 'lf-cell-m' : 'lf-cell-f'} style={{ height: 18, borderRadius: 3 }}></div>
                  ))}
                </div>
              </div>

              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Day log</span>
                  <button className="lf-btn ghost sm">Export CSV</button>
                </div>
                <table style={{ width: '100%', marginTop: 14, borderCollapse: 'collapse', fontFamily: "'Geist Mono',monospace", fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${lfStyles.hair}`, textAlign: 'left', color: lfStyles.ink3 }}>
                      <th style={{ padding: '8px 6px', fontWeight: 500 }}>Day</th>
                      <th style={{ fontWeight: 500 }}>Date</th>
                      <th style={{ fontWeight: 500 }}>Status</th>
                      <th style={{ fontWeight: 500 }}>Cores</th>
                      <th style={{ fontWeight: 500 }}>Skips</th>
                      <th style={{ fontWeight: 500 }}>Lvl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [24,'May 18','In Progress','2/3','—','7'],
                      [23,'May 17','Qualified','3/3','0','7'],
                      [22,'May 16','Qualified','3/3','1','7'],
                      [21,'May 15','Qualified','3/3','0','6'],
                      [20,'May 14','Qualified','3/3','0','6'],
                      [19,'May 13','Failed','2/3','—','6'],
                    ].map(r => (
                      <tr key={r[0]} style={{ borderBottom: `1px solid ${lfStyles.hair2}` }}>
                        {r.map((c, i) => <td key={i} style={{ padding: '8px 6px', color: i === 2 && c === 'Failed' ? lfStyles.ink3 : lfStyles.ink2 }}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lf-stack" style={{ gap: 14 }}>
              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Reasoning archive</span>
                  <span className="lf-mini">7 entries</span>
                </div>
                <div className="lf-stack" style={{ gap: 10, marginTop: 14 }}>
                  {[
                    { d: 22, task: 'Water', tag: 'Busy', text: 'Back-to-back meetings, only had coffee at desk all day, lost track of the bottle.' },
                    { d: 19, task: 'Sleep', tag: 'Tired', text: "Couldn't fall asleep, ended up debugging until 2am. Body too wired from gym session." },
                    { d: 14, task: 'Water', tag: 'Busy', text: "Travel day, airport security trashed bottle, didn't buy another at the gate." },
                  ].map((e,i) => (
                    <div key={i} className="lf-card-flat" style={{ padding: 12 }}>
                      <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                        <span className="lf-mini lf-num">D{e.d} · {e.task}</span>
                        <span className="lf-pill">{e.tag}</span>
                      </div>
                      <p className="lf-body" style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic' }}>"{e.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lf-card" style={{ padding: 20 }}>
                <span className="lf-eyebrow">Pattern view · no judgment</span>
                <div className="lf-stack" style={{ gap: 10, marginTop: 14 }}>
                  <div className="lf-row" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${lfStyles.hair2}` }}>
                    <span className="lf-body">Most-skipped optional</span>
                    <span className="lf-h3">Water · 4×</span>
                  </div>
                  <div className="lf-row" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${lfStyles.hair2}` }}>
                    <span className="lf-body">Most-used tag</span>
                    <span className="lf-h3">Busy · 5×</span>
                  </div>
                  <div className="lf-row" style={{ justifyContent: 'space-between', padding: '8px 0' }}>
                    <span className="lf-body">Tag → task correlation</span>
                    <span className="lf-h3">Busy days skip Water 80%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfSettings() {
  const Field = ({ k, v }) => (
    <div className="lf-row" style={{ justifyContent: 'space-between', padding: '8px 0' }}>
      <span className="lf-body">{k}</span>
      <div className="lf-input lf-num" style={{ width: 160, padding: '6px 10px', fontSize: 12 }}>{v}</div>
    </div>
  );
  return (
    <LfFrame title="settings" sub="LOCKS & UNLOCKED">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="settings" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LfTop crumb="SETTINGS" sub="What's locked & what's customizable" />
          <div style={{ flex: 1, padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minHeight: 0, overflow: 'auto' }}>
            <div className="lf-stack" style={{ gap: 14 }}>
              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Daily targets</span>
                  <span className="lf-pill">UNLOCKED</span>
                </div>
                <div className="lf-stack" style={{ marginTop: 14 }}>
                  <Field k="Calorie target" v="2,800 kcal" />
                  <hr className="lf-divider" />
                  <Field k="Protein target" v="140 g" />
                  <hr className="lf-divider" />
                  <Field k="Water target" v="3.0 L" />
                  <hr className="lf-divider" />
                  <Field k="Sleep window" v="7 hrs" />
                  <hr className="lf-divider" />
                  <Field k="Gym minimum" v="45 min" />
                </div>
              </div>

              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Cadence</span>
                  <span className="lf-pill">UNLOCKED</span>
                </div>
                <div className="lf-stack" style={{ gap: 12, marginTop: 14 }}>
                  <div className="lf-row" style={{ gap: 8 }}>
                    <span className="lf-mini" style={{ width: 56 }}>GYM</span>
                    {['M','T','W','T','F','S','S'].map((d,i) => (
                      <span key={i} className={'lf-pill ' + ([0,2,4,5].includes(i) ? 'solid' : '')} style={{ width: 30, justifyContent: 'center', padding: '5px 0' }}>{d}</span>
                    ))}
                  </div>
                  <div className="lf-row" style={{ gap: 8 }}>
                    <span className="lf-mini" style={{ width: 56 }}>CODE</span>
                    {['M','T','W','T','F','S','S'].map((d,i) => (
                      <span key={i} className={'lf-pill ' + (i !== 6 ? 'solid' : '')} style={{ width: 30, justifyContent: 'center', padding: '5px 0' }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lf-stack" style={{ gap: 14 }}>
              <div className="lf-card" style={{ padding: 20, background: lfStyles.paper2 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">The three cores · LOCKED for the run</span>
                  <span className="lf-pill solid">SEALED</span>
                </div>
                <div className="lf-stack" style={{ marginTop: 14 }}>
                  {[
                    ['Eating', 'Daily · cal + protein'],
                    ['Gym',    '4×/wk · ≥45 min strength'],
                    ['Coding', '5×/wk · 1 LC or 1-hr session'],
                  ].map(([c,d]) => (
                    <div key={c} className="lf-row" style={{ justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${lfStyles.hair2}` }}>
                      <div className="lf-stack">
                        <span className="lf-h3">{c}</span>
                        <span className="lf-mini">{d}</span>
                      </div>
                      <div className="lf-row" style={{ gap: 8 }}>
                        <span className="lf-mini">unlocks Day 91</span>
                        <svg className="lf-icon" viewBox="0 0 24 24"><path d="M5 11h14v10H5zM8 11V7a4 4 0 018 0v4" /></svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lf-card" style={{ padding: 20 }}>
                <span className="lf-eyebrow">Designer = Player · escape hatch</span>
                <p className="lf-body" style={{ marginTop: 8 }}>Want to change a locked rule? It's saved for the <b>next</b> run. 24-hour cooling-off enforced. PRD §2.1.</p>
                <button className="lf-btn ghost" style={{ marginTop: 12 }}>Stage rule change for Run 02 →</button>
              </div>

              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Notifications</span>
                  <span className="lf-pill">UNLOCKED</span>
                </div>
                <div className="lf-stack" style={{ marginTop: 14 }}>
                  <Field k="Daily quest reminder" v="9:00 am" />
                  <hr className="lf-divider" />
                  <Field k="End-of-day warning"   v="9:00 pm" />
                  <hr className="lf-divider" />
                  <Field k="Reward unlock"        v="immediate" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfContinuation() {
  return (
    <LfFrame title="day 91 · continuation" sub="ARC COMPLETE">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="today" day={91} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LfTop crumb="DAY 91" sub="Run 01 closes" status="Arc complete" statusKind="solid" />
          <div style={{ flex: 1, padding: 36, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 32, minHeight: 0, overflow: 'auto' }}>
            <div className="lf-stack" style={{ gap: 18 }}>
              <span className="lf-eyebrow">Run 01 · closing</span>
              <h1 className="lf-h1" style={{ fontSize: 56, lineHeight: 1.02 }}>The arc is closed.<br/><em style={{ fontStyle: 'italic', color: lfStyles.ink3 }}>The habit is not.</em></h1>
              <p className="lf-body" style={{ maxWidth: 540 }}>Your level, your active task list, and your reasoning archive carry over. The chain resets. Configure six new rewards — or opt into Continuation Mode, where compliance simply maintains.</p>

              <div className="lf-card" style={{ padding: 22 }}>
                <span className="lf-eyebrow">By the numbers</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginTop: 16 }}>
                  {[['82','qualified days'],['8','missed'],['Lv 26','final level'],['6 / 6','rewards claimed']].map(([n,l]) => (
                    <div key={l} className="lf-stack">
                      <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 36, lineHeight: 1, fontStyle: 'italic' }}>{n}</span>
                      <span className="lf-mini" style={{ marginTop: 6 }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lf-card" style={{ padding: 22 }}>
                <span className="lf-eyebrow">The 90-day ribbon</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 3, marginTop: 14 }}>
                  {Array.from({ length: 90 }, (_, i) => {
                    const miss = [4,11,18,33,47,55,69,82].includes(i);
                    return <div key={i} className={miss ? 'lf-cell-m' : 'lf-cell-q'} style={{ height: 14, borderRadius: 2 }}></div>;
                  })}
                </div>
              </div>
            </div>

            <div className="lf-stack" style={{ gap: 14 }}>
              <span className="lf-eyebrow">Choose your day 91</span>

              <div className="lf-card" style={{ padding: 20, borderColor: lfStyles.ink, borderWidth: 1.5 }}>
                <div className="lf-row" style={{ gap: 10 }}>
                  <span className="lf-pill solid">Recommended</span>
                  <span className="lf-h3">Run 02 · new rewards</span>
                </div>
                <p className="lf-body" style={{ marginTop: 10 }}>Configure 6 new rewards. Chain resets. Level continues from <b>26</b>. Active optionals carry over.</p>
                <button className="lf-btn primary" style={{ marginTop: 14, width: '100%' }}>Begin Run 02 setup →</button>
              </div>
              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ gap: 10 }}>
                  <span className="lf-pill">Maintenance</span>
                  <span className="lf-h3">Continuation Mode</span>
                </div>
                <p className="lf-body" style={{ marginTop: 10 }}>No rewards, no metronome. The cores stay, the chain still runs. Habits compound.</p>
                <button className="lf-btn" style={{ marginTop: 14, width: '100%' }}>Enter Continuation Mode</button>
              </div>
              <div className="lf-card" style={{ padding: 20 }}>
                <div className="lf-row" style={{ gap: 10 }}>
                  <span className="lf-pill ghost">Off-ramp</span>
                  <span className="lf-h3">Pause</span>
                </div>
                <p className="lf-body" style={{ marginTop: 10 }}>Codex stays. Daily quests stop. Resume any time.</p>
                <button className="lf-btn ghost" style={{ marginTop: 14, width: '100%' }}>Pause LeveL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

Object.assign(window, { LfLogReason, LfLevelUp, LfVault, LfHistory, LfSettings, LfContinuation });
