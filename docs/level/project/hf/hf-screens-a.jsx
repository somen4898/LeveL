// Hi-fi v2 — LEVEL as a 90-day self-accountability contract.
// Three Cores (Gym/Eating/Coding), reasoning-mechanism soul, reward calendar.
// Tone: training journal × monastic contract. Not a game.

// ── 1. ONBOARDING — "The Contract" ────────────────────────────
function HfOnboarding() {
  return (
    <HfFrame title="onboarding · the contract" sub="STEP 04 / 05 · CORES">
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 56px 56px' }}>
        <div className="hf-row">
          <LevelMark size={20} variant="squares" />
          <div style={{ flex: 1 }}></div>
          <div className="hf-row" style={{ gap: 6 }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: 28, height: 4, borderRadius: 99, background: n <= 4 ? hf.ink : hf.hair2 }}></div>
            ))}
          </div>
          <span className="hf-mini" style={{ marginLeft: 10 }}>04 / 05</span>
        </div>

        <div style={{ marginTop: 48 }}>
          <span className="hf-eyebrow">The Contract · Cores</span>
          <h1 className="hf-h1" style={{ marginTop: 14, fontSize: 60, lineHeight: 0.98 }}>
            Three things you will <em style={{ fontStyle: 'italic' }}>not</em><br/>negotiate with yourself<br/>for ninety days.
          </h1>
          <p className="hf-body" style={{ marginTop: 20, maxWidth: 580, fontSize: 14.5 }}>
            Cores are binary. You either did them, or you didn't. Once signed, they are locked for 90 days — you cannot change targets, cannot remove a core, cannot reduce a schedule. This is the friction that makes the system work.
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          <span className="hf-eyebrow">Your three Cores</span>

          <div style={{ marginTop: 14 }}>
            {/* CORE 1 — GYM */}
            <div className="hf-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="hf-row" style={{ padding: '20px 26px', borderBottom: `1px solid ${hf.hair2}`, gap: 16 }}>
                <span className="hf-serif" style={{ fontSize: 32, fontStyle: 'italic', color: hf.ember, width: 38 }}>I</span>
                <div className="hf-stack" style={{ flex: 1 }}>
                  <span className="hf-h3" style={{ fontSize: 16 }}>Gym</span>
                  <span className="hf-mini" style={{ marginTop: 3 }}>STRUCTURED LIFT · 45 MIN MINIMUM</span>
                </div>
                <span className="hf-pill solid">4× / WEEK</span>
                <span className="hf-mini" style={{ width: 88, textAlign: 'right' }}>MON · TUE · THU · SAT</span>
              </div>
              <div style={{ padding: '14px 26px 18px', background: hf.bone }}>
                <span className="hf-mini">SUBTASK · BINARY</span>
                <div className="hf-row" style={{ marginTop: 6, gap: 12 }}>
                  <span className="hf-check on">✓</span>
                  <span style={{ fontSize: 13.5 }}>Complete a structured workout, ≥45 min, with logged sets.</span>
                </div>
              </div>
            </div>

            {/* CORE 2 — EATING */}
            <div className="hf-card" style={{ padding: 0, overflow: 'hidden', marginTop: 12 }}>
              <div className="hf-row" style={{ padding: '20px 26px', borderBottom: `1px solid ${hf.hair2}`, gap: 16 }}>
                <span className="hf-serif" style={{ fontSize: 32, fontStyle: 'italic', color: hf.ember, width: 38 }}>II</span>
                <div className="hf-stack" style={{ flex: 1 }}>
                  <span className="hf-h3" style={{ fontSize: 16 }}>Eating</span>
                  <span className="hf-mini" style={{ marginTop: 3 }}>BULK · SURPLUS + PROTEIN</span>
                </div>
                <span className="hf-pill solid">DAILY</span>
                <span className="hf-mini" style={{ width: 88, textAlign: 'right' }}>EVERY DAY</span>
              </div>
              <div style={{ padding: '14px 26px 18px', background: hf.bone }}>
                <span className="hf-mini">SUBTASKS · BOTH MUST HIT</span>
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="hf-row" style={{ gap: 12, padding: '10px 14px', background: hf.card, border: `1px solid ${hf.hair2}`, borderRadius: 7 }}>
                    <span className="hf-check on">✓</span>
                    <div className="hf-stack" style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>Calories</span>
                      <span className="hf-mini">≥ 2,950 KCAL · MAINT + 400</span>
                    </div>
                    <button className="hf-btn sm ghost">Edit</button>
                  </div>
                  <div className="hf-row" style={{ gap: 12, padding: '10px 14px', background: hf.card, border: `1px solid ${hf.hair2}`, borderRadius: 7 }}>
                    <span className="hf-check on">✓</span>
                    <div className="hf-stack" style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>Protein</span>
                      <span className="hf-mini">≥ 145 G · 1.8 G / KG</span>
                    </div>
                    <button className="hf-btn sm ghost">Edit</button>
                  </div>
                </div>
                <p className="hf-mini" style={{ marginTop: 10, color: hf.ink3, fontFamily: "'Inter',sans-serif", letterSpacing: 0, fontSize: 11.5, lineHeight: 1.5, textTransform: 'none' }}>
                  Logged as a single binary at end of day. LEVEL doesn't track foods — you do, however you like. Honesty is the only auditor.
                </p>
              </div>
            </div>

            {/* CORE 3 — CODING */}
            <div className="hf-card" style={{ padding: 0, overflow: 'hidden', marginTop: 12 }}>
              <div className="hf-row" style={{ padding: '20px 26px', borderBottom: `1px solid ${hf.hair2}`, gap: 16 }}>
                <span className="hf-serif" style={{ fontSize: 32, fontStyle: 'italic', color: hf.ember, width: 38 }}>III</span>
                <div className="hf-stack" style={{ flex: 1 }}>
                  <span className="hf-h3" style={{ fontSize: 16 }}>Coding</span>
                  <span className="hf-mini" style={{ marginTop: 3 }}>DELIBERATE PRACTICE</span>
                </div>
                <span className="hf-pill solid">5× / WEEK</span>
                <span className="hf-mini" style={{ width: 88, textAlign: 'right' }}>MON–FRI</span>
              </div>
              <div style={{ padding: '14px 26px 18px', background: hf.bone }}>
                <span className="hf-mini">SUBTASK · EITHER COUNTS</span>
                <div className="hf-row" style={{ marginTop: 8, gap: 10 }}>
                  <div className="hf-row" style={{ flex: 1, padding: '10px 14px', background: hf.card, border: `1px solid ${hf.hair2}`, borderRadius: 7, gap: 12 }}>
                    <span className="hf-check on">✓</span>
                    <span style={{ fontSize: 13 }}>One LeetCode problem (any difficulty)</span>
                  </div>
                  <span className="hf-mini" style={{ alignSelf: 'center' }}>OR</span>
                  <div className="hf-row" style={{ flex: 1, padding: '10px 14px', background: hf.card, border: `1px solid ${hf.hair2}`, borderRadius: 7, gap: 12 }}>
                    <span className="hf-check on">✓</span>
                    <span style={{ fontSize: 13 }}>One focused 60-min project session</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign */}
        <div className="hf-card-ink" style={{ marginTop: 32, padding: '28px 32px' }}>
          <div className="hf-row" style={{ gap: 20 }}>
            <div className="hf-stack" style={{ flex: 1 }}>
              <span className="hf-eyebrow" style={{ color: '#9c9489' }}>SIGN THE CONTRACT</span>
              <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 24, color: hf.bone, marginTop: 8 }}>
                "I will not negotiate these three with myself for the next 90 days."
              </span>
              <span className="hf-mini" style={{ color: '#9c9489', marginTop: 10 }}>LOCKED ON SIGN · CANNOT BE CHANGED · CANNOT BE REMOVED</span>
            </div>
            <button className="hf-btn ember" style={{ padding: '14px 22px', fontSize: 14 }}>Sign &amp; begin Day 01 →</button>
          </div>
        </div>

        <div className="hf-row" style={{ marginTop: 18 }}>
          <button className="hf-btn ghost">← Edit cores</button>
          <div style={{ flex: 1 }}></div>
          <span className="hf-mini">NEXT — STEP 05 · CHOOSE SIX REWARDS</span>
        </div>
      </div>
    </HfFrame>
  );
}

// ── 2. TODAY — three cores + optionals + chain ─────────────────
function HfToday() {
  const cores = [
    { n: 'I',  name: 'Gym',    target: 'Structured lift · 45 min', done: true,  scheduled: true,  subs: [['Logged sets · 52 min', true]] },
    { n: 'II', name: 'Eating', target: 'Surplus + protein',        done: false, scheduled: true,  subs: [['Calories ≥ 2,950', true],['Protein ≥ 145g', false]] },
    { n: 'III',name: 'Coding', target: 'LeetCode OR 60-min focus', done: false, scheduled: true,  subs: [['LeetCode problem', false],['Focused 60-min session', false]] },
  ];
  const optionals = [
    { name: 'Sleep ≥ 7 hr',    state: 'done',     streak: 12 },
    { name: 'Water ≥ 3L',      state: 'pending',  streak: 8 },
    { name: 'Mobility · 10 min', state: 'pending', streak: 4 },
    { name: 'Tech reading · 20 min', state: 'skip-pending', streak: 2, mandatoryIn: 1 },
  ];
  // chain: 24 days, mostly q with 2 misses
  const chain = ['q','q','q','m','q','q','q','q','q','m','q','q','q','q','q','q','q','t'];

  return (
    <HfFrame title="today · day 24" sub="RUN 01 · ACTIVE">
      <div style={{ display: 'flex', height: '100%' }}>
        <HfRail active="today" day={24} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <HfTop crumb="TODAY · MONDAY · 13 JAN" sub="Day 24 / 90 — Run 01" status="In progress" statusKind="progress" />
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 48px' }}>

            {/* Hero — today's contract status */}
            <div className="hf-card" style={{ padding: '28px 32px', boxShadow: hf.shadow }}>
              <div className="hf-row" style={{ justifyContent: 'space-between' }}>
                <div className="hf-stack">
                  <span className="hf-eyebrow">Today's contract · 1 of 3 complete</span>
                  <h2 className="hf-h1" style={{ marginTop: 10, fontSize: 38, lineHeight: 1.05 }}>
                    Two cores left. <em style={{ fontStyle: 'italic', color: hf.ink3 }}>The day qualifies when all three close.</em>
                  </h2>
                </div>
                <div className="hf-stack" style={{ alignItems: 'flex-end' }}>
                  <span className="hf-mini">DAY ENDS IN</span>
                  <span className="hf-num" style={{ fontSize: 28, fontWeight: 600, marginTop: 2 }}>09 : 42</span>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {cores.map((c, i) => (
                  <div key={i} style={{
                    padding: '18px 20px', borderRadius: 10,
                    background: c.done ? hf.ink : hf.bone,
                    color: c.done ? hf.bone : hf.ink,
                    border: c.done ? 'none' : `1px solid ${hf.hair2}`,
                    position: 'relative',
                  }}>
                    <div className="hf-row" style={{ gap: 10 }}>
                      <span className="hf-serif" style={{ fontSize: 26, fontStyle: 'italic', color: c.done ? hf.emberL : hf.ember, lineHeight: 1 }}>{c.n}</span>
                      <div className="hf-stack" style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                        <span className="hf-mini" style={{ color: c.done ? '#9c9489' : hf.ink3 }}>{c.target}</span>
                      </div>
                      {c.done && <span className="hf-tag ember">DONE</span>}
                    </div>
                    <hr className="hf-divider" style={{ margin: '14px 0', background: c.done ? '#3a342d' : hf.hair2 }} />
                    {c.subs.map(([s, done], j) => (
                      <div key={j} className="hf-row" style={{ padding: '4px 0', gap: 10 }}>
                        <span className={'hf-check ' + (done ? 'on' : '')} style={{ width: 18, height: 18, fontSize: 10 }}>✓</span>
                        <span style={{ fontSize: 12.5, color: c.done ? hf.bone : done ? hf.ink : hf.ink2, textDecoration: done ? 'none' : 'none' }}>{s}</span>
                      </div>
                    ))}
                    {!c.done && (
                      <button className="hf-btn primary" style={{ width: '100%', marginTop: 14, padding: '8px', fontSize: 12 }}>Mark complete</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optionals + Chain */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 14 }}>
              <div className="hf-card" style={{ padding: '22px 26px' }}>
                <div className="hf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="hf-eyebrow">Optional · today</span>
                  <span className="hf-mini">SKIPS REQUIRE A 50-CHAR REASON</span>
                </div>
                <div style={{ marginTop: 14 }}>
                  {optionals.map((o, i, arr) => (
                    <div key={i} className="hf-row" style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${hf.hair2}` : 'none', gap: 14 }}>
                      <span className={'hf-check ' + (o.state === 'done' ? 'on' : 'dim')}>✓</span>
                      <div className="hf-stack" style={{ flex: 1 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: o.state === 'done' ? hf.ink3 : hf.ink, textDecoration: o.state === 'done' ? 'line-through' : 'none' }}>{o.name}</span>
                        <span className="hf-mini" style={{ marginTop: 2 }}>
                          {o.state === 'done' ? `DONE · ${o.streak}-DAY STREAK` :
                           o.state === 'skip-pending' ? `${o.streak}/3 SKIPS · MANDATORY IN ${o.mandatoryIn} DAY` :
                           `${o.streak}-DAY STREAK · OPEN`}
                        </span>
                      </div>
                      {o.state === 'pending' && <button className="hf-btn sm">Mark done</button>}
                      {o.state === 'pending' && <button className="hf-btn sm ghost">Skip + reason →</button>}
                      {o.state === 'skip-pending' && <span className="hf-pill ember">REASON REQUIRED</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="hf-card" style={{ padding: '22px 26px' }}>
                <HfChain
                  cells={chain}
                  label="Reward window · 06 → 23"
                  sub="13 of 18 days · need 15 to claim"
                />
                <hr className="hf-divider" style={{ margin: '18px 0' }} />
                <div className="hf-row" style={{ gap: 16 }}>
                  <div className="hf-stack">
                    <span className="hf-mini">NEXT REWARD</span>
                    <span className="hf-h3" style={{ fontSize: 14, marginTop: 3 }}>Day 30 · Vinyl LP</span>
                  </div>
                  <div style={{ flex: 1 }}></div>
                  <div className="hf-stack" style={{ alignItems: 'flex-end' }}>
                    <span className="hf-mini">QUALIFIES IN</span>
                    <span className="hf-num" style={{ fontSize: 16, fontWeight: 600 }}>2 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat row */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                ['QUALIFYING DAYS', '15', 'OF 24 · 63%', hf.ember],
                ['CURRENT WINDOW',  '13/15', 'NEED 2 MORE', hf.ink],
                ['LEVEL',           '07', '660 / 1000 TO 08', hf.moss],
                ['DAYS LEFT',       '66', 'RUN ENDS 14 MAR', null],
              ].map(([k, v, sub, c], i) => (
                <div key={i} className="hf-card-flat" style={{ padding: '20px 22px' }}>
                  <span className="hf-mini">{k}</span>
                  <div className="hf-num" style={{ fontSize: 32, fontWeight: 600, marginTop: 6, letterSpacing: '-.02em' }}>{v}</div>
                  <div className="hf-mini" style={{ marginTop: 4, color: hf.ink3 }}>{sub}</div>
                  {c && <div className="hf-bar" style={{ marginTop: 14 }}><span style={{ width: ['62%','86%','66%','27%'][i], background: c }}></span></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HfFrame>
  );
}

Object.assign(window, { HfOnboarding, HfToday });
