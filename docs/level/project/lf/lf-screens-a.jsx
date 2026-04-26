// Lo-fi Today + Onboarding screens.

function LfToday() {
  const [eat, setEat] = React.useState({ cal: true, pro: true });
  const [gym, setGym] = React.useState(false);
  const [code, setCode] = React.useState(false);
  const [opt, setOpt] = React.useState({ sleep: false, water: false });

  const cells = Array.from({ length: 18 }, (_, i) => i === 4 ? 'm' : i < 7 ? 'q' : i === 7 ? 't' : 'f');

  const Core = ({ tag, title, subs, schedule, n }) => (
    <div className="lf-card" style={{ padding: 18 }}>
      <div className="lf-row" style={{ justifyContent: 'space-between' }}>
        <div className="lf-row" style={{ gap: 10 }}>
          <span className="lf-tag">{tag}</span>
          <span className="lf-h2">{title}</span>
          {schedule && <span className="lf-pill ghost">{schedule}</span>}
        </div>
        <span className="lf-mini">{n}</span>
      </div>
      <hr className="lf-divider" style={{ margin: '14px 0' }} />
      <div className="lf-stack" style={{ gap: 10 }}>{subs}</div>
    </div>
  );

  const Sub = ({ on, set, label, meta, action }) => (
    <div className="lf-row" style={{ cursor: 'pointer' }} onClick={() => set && set()}>
      <span className={'lf-check ' + (on ? 'on' : '')}>{on ? '✓' : ''}</span>
      <span className="lf-body" style={{ color: lfStyles.ink, fontWeight: on ? 400 : 500, textDecoration: on ? 'line-through' : 'none', textDecorationColor: lfStyles.ink4 }}>{label}</span>
      <span style={{ flex: 1 }}></span>
      {meta && <span className="lf-mini lf-num">{meta}</span>}
      {action}
    </div>
  );

  return (
    <LfFrame title="today" sub="MON · MAY 18">
      <div style={{ display: 'flex', height: '100%' }}>
        <LfRail active="today" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LfTop crumb="DAY 24 OF 90 · CYCLE 02" sub="Today's Quest Log" status="In Progress" />
          <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 22, flex: 1, minHeight: 0, overflow: 'auto' }}>
            <div className="lf-stack" style={{ gap: 14, minWidth: 0 }}>
              <Core tag="CORE" title="Eating" n="2 of 2" subs={
                <>
                  <Sub on={eat.cal} set={() => setEat(s => ({ ...s, cal: !s.cal }))} label="Hit calorie target" meta="2,840 / 2,800 kcal" />
                  <Sub on={eat.pro} set={() => setEat(s => ({ ...s, pro: !s.pro }))} label="Hit protein target" meta="152 / 140 g" />
                </>
              }/>
              <Core tag="CORE" title="Gym" schedule="SCHEDULED · MON" n="0 of 1" subs={
                <Sub on={gym} set={() => setGym(g => !g)} label="Structured strength workout · ≥45 min" action={<button className="lf-btn ghost sm" onClick={(e)=>e.stopPropagation()}>Log session</button>} />
              }/>
              <Core tag="CORE" title="Coding" n="0 of 1" subs={
                <Sub on={code} set={() => setCode(c => !c)} label="1 LeetCode problem OR 1-hr project session" meta="any difficulty" />
              }/>

              <div className="lf-card" style={{ padding: 18 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <div className="lf-row" style={{ gap: 10 }}>
                    <span className="lf-tag outline">SIDE QUEST</span>
                    <span className="lf-h2">Optionals</span>
                  </div>
                  <span className="lf-mini">skip needs 50-char reason</span>
                </div>
                <hr className="lf-divider" style={{ margin: '14px 0' }} />
                <div className="lf-stack" style={{ gap: 10 }}>
                  <Sub on={opt.sleep} set={() => setOpt(s => ({ ...s, sleep: !s.sleep }))} label="Sleep ≥ 7 hrs" meta="0 skips" action={<button className="lf-btn ghost sm" onClick={(e)=>e.stopPropagation()}>Skip…</button>} />
                  <Sub on={opt.water} set={() => setOpt(s => ({ ...s, water: !s.water }))} label="Water target · 3 L" meta="2 skips · locks at 3" action={<button className="lf-btn ghost sm" onClick={(e)=>e.stopPropagation()}>Skip…</button>} />
                </div>
              </div>
            </div>

            <div className="lf-stack" style={{ gap: 14, minWidth: 0 }}>
              <div className="lf-card" style={{ padding: 18 }}>
                <LfChain cells={cells} label="Chain · Cycle 02 of 6" sub="8/15 qualified · 1 miss used" />
              </div>

              <div className="lf-card" style={{ padding: 18 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Current Level</span>
                  <span className="lf-mini">next: TIGHTEN</span>
                </div>
                <div className="lf-row" style={{ gap: 16, marginTop: 12, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 64, lineHeight: 1, fontStyle: 'italic' }}>07</div>
                  <div className="lf-stack">
                    <span className="lf-h3">Level Seven</span>
                    <span className="lf-mini">2 of 3 days clean → Level 08</span>
                  </div>
                </div>
                <div className="lf-bar" style={{ marginTop: 14 }}><span style={{ width: '66%' }}></span></div>
              </div>

              <div className="lf-card" style={{ padding: 18 }}>
                <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="lf-eyebrow">Next Reward · D30 · Big</span>
                  <span className="lf-pill">Qualifying</span>
                </div>
                <div className="lf-row" style={{ gap: 14, marginTop: 12 }}>
                  <div className="lf-place" style={{ width: 80, height: 80, flexShrink: 0 }}>PHOTO</div>
                  <div className="lf-stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                    <span className="lf-h3">Mechanical keyboard</span>
                    <span className="lf-mini">$240 · "earned my 9-to-5 focus"</span>
                    <div className="lf-bar" style={{ marginTop: 8 }}><span style={{ width: '53%' }}></span></div>
                    <span className="lf-mini">8/15 chain · day-floor in 6d</span>
                  </div>
                </div>
              </div>

              <div className="lf-card-flat" style={{ padding: 16 }}>
                <div className="lf-eyebrow">End of Day</div>
                <div className="lf-stack" style={{ gap: 6, marginTop: 10 }}>
                  <div className="lf-row" style={{ justifyContent: 'space-between' }}><span className="lf-mini">Cores</span><span className="lf-mini lf-num">2 of 3 done</span></div>
                  <div className="lf-row" style={{ justifyContent: 'space-between' }}><span className="lf-mini">Optionals</span><span className="lf-mini lf-num">0 done · 0 skipped</span></div>
                  <div className="lf-row" style={{ justifyContent: 'space-between' }}><span className="lf-mini">Window misses</span><span className="lf-mini lf-num">1 of 3 used</span></div>
                </div>
                <button className="lf-btn primary" style={{ width: '100%', marginTop: 14 }}>Close Day & Lock Log</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

function LfOnboarding() {
  const slots = [
    { day: 15, tier: 'small', filled: true,  name: 'Steam game',     price: '$30',  why: 'a small "did it" trophy.' },
    { day: 30, tier: 'big',   filled: true,  name: 'Mech keyboard',  price: '$240', why: 'tools earn me 9-to-5 focus.' },
    { day: 45, tier: 'small', filled: true,  name: 'New hoodie',     price: '$80',  why: 'comfortable identity shift.' },
    { day: 60, tier: 'big',   filled: true,  name: 'Weekend trip',   price: '$420', why: 'a date with future me.' },
    { day: 75, tier: 'small', filled: false },
    { day: 90, tier: 'big',   filled: false },
  ];
  return (
    <LfFrame title="onboarding · step 4 of 6" sub="REWARD VAULT">
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div style={{ padding: '18px 32px', borderBottom: `1px solid ${lfStyles.hair2}`, display: 'flex', alignItems: 'center', gap: 14, background: lfStyles.card }}>
          <LfMark size={22} />
          <div style={{ flex: 1 }}></div>
          <div className="lf-row" style={{ gap: 6 }}>
            {['Player','Pillars','Targets','Rewards','Sequence','Review'].map((s,i) => (
              <span key={s} className={'lf-pill ' + (i < 3 ? 'solid' : i === 3 ? 'solid' : '')} style={{ opacity: i > 3 ? 0.5 : 1 }}>{i+1}. {s}</span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: 36, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32, minHeight: 0, overflow: 'auto' }}>
          <div className="lf-stack" style={{ gap: 16 }}>
            <span className="lf-eyebrow">Step 4 · Reward Vault</span>
            <h1 className="lf-h1">Pre-select all six rewards.</h1>
            <p className="lf-body">Six rewards alternate <b>small / big</b> at days 15, 30, 45, 60, 75, 90. Once locked, you can <b>only upgrade</b> — never downgrade. The system won't start until all six are configured.</p>

            <div className="lf-card-flat" style={{ padding: 16 }}>
              <div className="lf-eyebrow">Rules of the Vault</div>
              <ul style={{ margin: '10px 0 0 18px', padding: 0, fontSize: 12.5, lineHeight: 1.6, color: lfStyles.ink2 }}>
                <li>Item, photo, real-world price required</li>
                <li>One-sentence "why this motivates me" note</li>
                <li>Upgrades blocked for 7 days after any redemption</li>
                <li>Day-floor: cannot redeem before scheduled day</li>
              </ul>
            </div>

            <div className="lf-card" style={{ padding: 16 }}>
              <div className="lf-eyebrow">Reward calendar</div>
              <div style={{ position: 'relative', marginTop: 14, height: 40 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 18, height: 1, background: lfStyles.hair }}></div>
                {[15,30,45,60,75,90].map((d, i) => (
                  <div key={d} style={{ position: 'absolute', left: `${(i/5)*100}%`, top: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div className="lf-square" style={{ background: i % 2 === 1 ? lfStyles.ink : lfStyles.card, color: i % 2 === 1 ? lfStyles.fillT : lfStyles.ink, border: `1.5px solid ${lfStyles.ink}`, width: 26, height: 26, fontSize: 10 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lf-stack" style={{ gap: 14 }}>
            <div className="lf-row" style={{ justifyContent: 'space-between' }}>
              <span className="lf-eyebrow">Slots · 4 of 6 configured</span>
              <span className="lf-mini">drag to reorder · click to edit</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {slots.map((r) => (
                <div key={r.day} className={r.filled ? 'lf-card' : 'lf-place'} style={{ padding: 14, height: 218, display: 'flex', flexDirection: 'column', position: 'relative', background: r.filled ? lfStyles.card : undefined }}>
                  <div className="lf-row" style={{ justifyContent: 'space-between' }}>
                    <span className="lf-mini lf-num">DAY {r.day}</span>
                    <span className={'lf-tag ' + (r.tier === 'big' ? '' : 'outline')}>{r.tier}</span>
                  </div>
                  {r.filled ? (
                    <>
                      <div className="lf-place" style={{ height: 70, marginTop: 10 }}>PHOTO</div>
                      <div className="lf-h3" style={{ marginTop: 10 }}>{r.name}</div>
                      <div className="lf-mini lf-num" style={{ marginTop: 2 }}>{r.price}</div>
                      <div className="lf-body" style={{ fontSize: 11, marginTop: 8, fontStyle: 'italic', color: lfStyles.ink3 }}>"{r.why}"</div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 32, color: lfStyles.ink4 }}>+</div>
                  )}
                </div>
              ))}
            </div>
            <div className="lf-row" style={{ marginTop: 'auto', justifyContent: 'space-between', paddingTop: 8 }}>
              <button className="lf-btn">← Targets</button>
              <span className="lf-mini">2 slots remaining before you can begin</span>
              <button className="lf-btn primary">Sequence →</button>
            </div>
          </div>
        </div>
      </div>
    </LfFrame>
  );
}

Object.assign(window, { LfToday, LfOnboarding });
