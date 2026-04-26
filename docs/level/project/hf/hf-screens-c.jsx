// Hi-fi v2 screens 6–8: Day Detail, Day 91 Continuation, Settings.

// ── 6. DAY DETAIL — review of any past day, what got logged ────
function HfDayDetail() {
  return (
    <HfFrame title="day 23 · sun 12 jan" sub="QUALIFIED · 3 / 3 CORES">
      <div style={{ display: 'flex', height: '100%' }}>
        <HfRail active="quests" day={24} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <HfTop crumb="HISTORY · DAY 23 · SUN 12 JAN" sub="Qualified — both windows held" status="Qualified" statusKind="moss" right={
            <div className="hf-row" style={{ gap: 6 }}>
              <button className="hf-btn sm ghost">← Day 22</button>
              <button className="hf-btn sm ghost">Day 24 →</button>
            </div>
          } />
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
              <div>
                <span className="hf-eyebrow">Day 23 · 31 days into Run 01</span>
                <h1 className="hf-h1" style={{ marginTop: 12, fontSize: 56 }}>
                  All three closed.<br/><em style={{ fontStyle: 'italic', color: hf.ink3 }}>One skip with reason.</em>
                </h1>

                {/* Cores */}
                <div style={{ marginTop: 32 }}>
                  <span className="hf-eyebrow">Cores</span>
                  <div className="hf-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
                    {[
                      { n: 'I',   name: 'Gym',    sub: 'Push day · 52 min · 6 sets bench, 5 sets OHP, accessories', met: true },
                      { n: 'II',  name: 'Eating', sub: '3,015 kcal · 158g protein — both targets met', met: true },
                      { n: 'III', name: 'Coding', sub: 'LeetCode 124 · binary tree max path · solved 38 min', met: true },
                    ].map((c, i, arr) => (
                      <div key={i} className="hf-row" style={{ padding: '18px 22px', borderTop: i > 0 ? `1px solid ${hf.hair2}` : 'none', gap: 16 }}>
                        <span className="hf-serif" style={{ fontSize: 28, fontStyle: 'italic', color: hf.ember, width: 34 }}>{c.n}</span>
                        <span className="hf-check on" style={{ flexShrink: 0 }}>✓</span>
                        <div className="hf-stack" style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                          <span className="hf-mini" style={{ marginTop: 3, fontFamily: "'Inter',sans-serif", letterSpacing: 0, fontSize: 12, textTransform: 'none', color: hf.ink3 }}>{c.sub}</span>
                        </div>
                        <span className="hf-tag" style={{ background: hf.moss }}>MET</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optionals */}
                <div style={{ marginTop: 26 }}>
                  <span className="hf-eyebrow">Optionals</span>
                  <div className="hf-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
                    {[
                      { name: 'Sleep ≥ 7 hr', state: 'done',   note: '7h 42m · slept 23:18' },
                      { name: 'Water ≥ 3L',   state: 'done',   note: '3.2L logged' },
                      { name: 'Mobility · 10 min', state: 'done', note: 'Hip series after gym' },
                      { name: 'Tech reading · 20 min', state: 'skip', note: 'Skipped with reason →' },
                    ].map((o, i, arr) => (
                      <div key={i} className="hf-row" style={{ padding: '14px 22px', borderTop: i > 0 ? `1px solid ${hf.hair2}` : 'none', gap: 14 }}>
                        <span className={'hf-check ' + (o.state === 'done' ? 'on' : 'dim')}>{o.state === 'done' ? '✓' : '–'}</span>
                        <span style={{ flex: 1, fontSize: 13.5 }}>{o.name}</span>
                        <span className="hf-mini" style={{ color: hf.ink3 }}>{o.note}</span>
                        {o.state === 'skip' && <span className="hf-tag outline">SKIPPED + REASON</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reason transcript */}
                <div style={{ marginTop: 26 }}>
                  <span className="hf-eyebrow">Reason · tech reading</span>
                  <div className="hf-card" style={{ marginTop: 12, padding: '22px 26px', borderLeft: `3px solid ${hf.ember}` }}>
                    <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 19, lineHeight: 1.45, color: hf.ink, margin: 0 }}>
                      "Got home late from the gym, ate, and went straight to coding because LeetCode 124 was nagging me. Lost the time to read but the trade was honest."
                    </p>
                    <div className="hf-row" style={{ marginTop: 14, gap: 14 }}>
                      <span className="hf-mini">157 CHARS · LOGGED 22:48 · IMMUTABLE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side column */}
              <div className="hf-stack" style={{ gap: 14 }}>
                <div className="hf-card" style={{ padding: '22px 24px' }}>
                  <span className="hf-eyebrow">Day verdict</span>
                  <div className="hf-num" style={{ fontSize: 56, fontWeight: 600, marginTop: 8, letterSpacing: '-.03em', color: hf.moss }}>QUAL</div>
                  <span className="hf-mini">+1 TO REWARD WINDOW · +1 TO LV-UP STREAK</span>
                  <hr className="hf-divider" style={{ margin: '18px 0' }} />
                  <div className="hf-row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
                    <span className="hf-mini">CHAIN AFTER</span>
                    <span className="hf-num" style={{ fontSize: 14, fontWeight: 600 }}>8 days</span>
                  </div>
                  <div className="hf-row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
                    <span className="hf-mini">WINDOW · D30</span>
                    <span className="hf-num" style={{ fontSize: 14, fontWeight: 600 }}>12 / 18</span>
                  </div>
                  <div className="hf-row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
                    <span className="hf-mini">LV STREAK</span>
                    <span className="hf-num" style={{ fontSize: 14, fontWeight: 600 }}>1 / 3</span>
                  </div>
                </div>

                <div className="hf-card-flat" style={{ padding: '22px 24px' }}>
                  <span className="hf-eyebrow">Day in numbers</span>
                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="hf-stack">
                      <span className="hf-mini">CALORIES</span>
                      <span className="hf-num" style={{ fontSize: 22, fontWeight: 600 }}>3,015</span>
                      <span className="hf-mini" style={{ color: hf.moss }}>+65 ABOVE TARGET</span>
                    </div>
                    <div className="hf-stack">
                      <span className="hf-mini">PROTEIN</span>
                      <span className="hf-num" style={{ fontSize: 22, fontWeight: 600 }}>158 g</span>
                      <span className="hf-mini" style={{ color: hf.moss }}>+13 ABOVE TARGET</span>
                    </div>
                    <div className="hf-stack">
                      <span className="hf-mini">GYM TIME</span>
                      <span className="hf-num" style={{ fontSize: 22, fontWeight: 600 }}>52 m</span>
                    </div>
                    <div className="hf-stack">
                      <span className="hf-mini">SLEEP</span>
                      <span className="hf-num" style={{ fontSize: 22, fontWeight: 600 }}>7h 42</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </HfFrame>
  );
}

// ── 7. DAY 91 — CONTINUATION ─────────────────────────────────
function HfContinuation() {
  return (
    <HfFrame title="DAY 91 · CONTINUATION" sub="RUN 01 → RUN 02">
      <div style={{ width: '100%', height: '100%', overflow: 'auto', background: hf.paper }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '52px 56px 64px' }}>

          <div className="hf-row">
            <LevelMark size={20} variant="squares" />
            <div style={{ flex: 1 }}></div>
            <span className="hf-mini">DAY 91 · 15 MAR 2026</span>
          </div>

          <div style={{ marginTop: 56 }}>
            <span className="hf-eyebrow">Day 91 · the day after</span>
            <h1 className="hf-h1" style={{ marginTop: 18, fontSize: 80, lineHeight: 0.98 }}>
              Run 01 closed.<br/><em style={{ fontStyle: 'italic', color: hf.ink3 }}>The system stays open.</em>
            </h1>
            <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 22, lineHeight: 1.45, color: hf.ink2, marginTop: 22, maxWidth: 700 }}>
              Your level holds. Your active task list holds. The chain resets, the windows reset, the rewards reset. Pick again — or close the book here.
            </p>
          </div>

          {/* Run 01 summary */}
          <div className="hf-card-ink" style={{ marginTop: 44, padding: '32px 36px' }}>
            <div className="hf-row" style={{ justifyContent: 'space-between' }}>
              <span className="hf-eyebrow" style={{ color: '#9c9489' }}>RUN 01 · ARCHIVED</span>
              <span className="hf-mini" style={{ color: '#9c9489' }}>21 DEC 2025 → 14 MAR 2026</span>
            </div>
            <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {[
                ['QUALIFYING DAYS','68','OF 90'],
                ['LONGEST WINDOW','17/18','D 35–52'],
                ['REWARDS CLAIMED','5','OF 6'],
                ['LEVEL REACHED','24','OF 30'],
              ].map(([k,v,sub], i) => (
                <div key={i} className="hf-stack">
                  <span className="hf-mini" style={{ color: '#9c9489' }}>{k}</span>
                  <span className="hf-num" style={{ fontSize: 48, fontWeight: 600, color: hf.bone, marginTop: 6, letterSpacing: '-.03em' }}>{v}</span>
                  <span className="hf-mini" style={{ color: '#9c9489' }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <span className="hf-eyebrow">Three doors</span>
          </div>

          {/* Three options */}
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {/* RUN 02 */}
            <div className="hf-card" style={{ padding: '28px 28px', borderColor: hf.ink, boxShadow: hf.shadow }}>
              <span className="hf-tag ember">RECOMMENDED</span>
              <h3 className="hf-h2" style={{ marginTop: 18, fontSize: 28, fontStyle: 'italic' }}>Sign Run 02.</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: hf.ink2, marginTop: 12 }}>
                Same three Cores. Pick six fresh rewards. Keep your level (Lv 24) and active Optionals. Chain resets. New 90.
              </p>
              <hr className="hf-divider" style={{ margin: '18px 0' }} />
              <div className="hf-row" style={{ gap: 10 }}>
                <span className="hf-tag outline">CORES · LOCKED</span>
                <span className="hf-tag outline">LV 24 KEPT</span>
              </div>
              <button className="hf-btn primary" style={{ width: '100%', marginTop: 22, padding: '12px' }}>Begin Run 02 →</button>
            </div>

            {/* Re-spec */}
            <div className="hf-card" style={{ padding: '28px 28px' }}>
              <span className="hf-tag outline">CORE RESET</span>
              <h3 className="hf-h2" style={{ marginTop: 18, fontSize: 28, fontStyle: 'italic' }}>Pick new Cores.</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: hf.ink2, marginTop: 12 }}>
                Replace one or all three Cores. Keep your level. Re-sign the contract. The system is the same — the body of work is new.
              </p>
              <hr className="hf-divider" style={{ margin: '18px 0' }} />
              <div className="hf-row" style={{ gap: 10 }}>
                <span className="hf-tag outline">RE-SIGN</span>
                <span className="hf-tag outline">LV 24 KEPT</span>
              </div>
              <button className="hf-btn" style={{ width: '100%', marginTop: 22, padding: '12px' }}>Re-spec Cores →</button>
            </div>

            {/* Continuation mode */}
            <div className="hf-card" style={{ padding: '28px 28px' }}>
              <span className="hf-tag outline">NON-ARC</span>
              <h3 className="hf-h2" style={{ marginTop: 18, fontSize: 28, fontStyle: 'italic' }}>Maintain mode.</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: hf.ink2, marginTop: 12 }}>
                Keep doing the work without a 90-day arc, rewards, or finale. Cores remain. Chain still tracks. No countdown.
              </p>
              <hr className="hf-divider" style={{ margin: '18px 0' }} />
              <div className="hf-row" style={{ gap: 10 }}>
                <span className="hf-tag outline">NO REWARDS</span>
                <span className="hf-tag outline">NO ARC</span>
              </div>
              <button className="hf-btn ghost" style={{ width: '100%', marginTop: 22, padding: '12px' }}>Enter maintain →</button>
            </div>
          </div>

          {/* Close book */}
          <div className="hf-row" style={{ marginTop: 36, padding: '20px 24px', background: hf.bone, border: `1px dashed ${hf.hair}`, borderRadius: 10, gap: 16 }}>
            <div className="hf-stack" style={{ flex: 1 }}>
              <span className="hf-h3">Close the book.</span>
              <span className="hf-mini" style={{ color: hf.ink3, marginTop: 3, fontFamily: "'Inter',sans-serif", textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>End your relationship with LEVEL. Run 01 is archived; you can re-open any time.</span>
            </div>
            <button className="hf-btn ghost sm">End account</button>
          </div>
        </div>
      </div>
    </HfFrame>
  );
}

// ── 8. SETTINGS — locks vs. mid-run editable ─────────────────
function HfSettings() {
  return (
    <HfFrame title="settings" sub="RUN 01 · DAY 24">
      <div style={{ display: 'flex', height: '100%' }}>
        <HfRail active="settings" day={24} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <HfTop crumb="SETTINGS" sub="What you can change · what is locked" status="66 days left" statusKind={null} />
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>

            {/* Locks notice */}
            <div className="hf-card-ink" style={{ padding: '20px 26px' }}>
              <div className="hf-row" style={{ gap: 16 }}>
                <span className="hf-serif" style={{ fontSize: 32, fontStyle: 'italic', color: hf.emberL }}>§</span>
                <div className="hf-stack" style={{ flex: 1 }}>
                  <span className="hf-eyebrow" style={{ color: '#9c9489' }}>The contract holds</span>
                  <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 18, color: hf.bone, marginTop: 6, lineHeight: 1.4 }}>
                    Cores, targets, and reward picks are locked for the remaining 66 days. This is the friction that makes the system work — not a bug.
                  </p>
                </div>
              </div>
            </div>

            {/* LOCKED · Cores */}
            <span className="hf-eyebrow" style={{ display: 'block', marginTop: 26 }}>LOCKED · cannot change until day 91</span>
            <div className="hf-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
              {[
                ['Core I — Gym',     '4× / week · 45 min minimum'],
                ['Core II — Eating', '≥ 2,950 kcal · ≥ 145g protein'],
                ['Core III — Coding','5× / week · LeetCode or 60-min focus'],
                ['Reward 01 — Day 15', 'Climbing chalk · £28'],
                ['Reward 02 — Day 30', 'Vinyl — Bowie · Low · £42'],
                ['Reward 03 — Day 45', 'Espresso scales · £35'],
                ['Reward 04 — Day 60', 'Mechanical keyboard · £189'],
                ['Reward 05 — Day 75', 'Cookbook — Tartine · £40'],
                ['Reward 06 — Day 90', 'Climbing trip · £280'],
              ].map(([k, v], i, arr) => (
                <div key={i} className="hf-row" style={{ padding: '14px 22px', borderTop: i > 0 ? `1px solid ${hf.hair2}` : 'none', gap: 16 }}>
                  <span style={{ fontSize: 14, color: hf.ink4 }}>🔒</span>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{k}</span>
                  <span className="hf-mini" style={{ color: hf.ink3 }}>{v}</span>
                  <span className="hf-tag outline" style={{ color: hf.ink4, borderColor: hf.hair }}>UNTIL DAY 91</span>
                </div>
              ))}
            </div>

            {/* EDITABLE */}
            <span className="hf-eyebrow" style={{ display: 'block', marginTop: 32 }}>Editable mid-run</span>
            <div className="hf-card" style={{ marginTop: 12, padding: 0, overflow: 'hidden' }}>
              {[
                { k: 'Daily check-in time',  v: '21:00 local',     edit: true },
                { k: 'Skip-reason min length', v: '50 chars',      edit: true },
                { k: 'Push reminders',       v: 'Cores · Optionals · Window-close', toggle: true },
                { k: 'End-of-day digest',    v: 'Email · 22:30',   toggle: true, off: true },
                { k: 'Sound on check-off',   v: 'Off',             toggle: true, off: true },
              ].map((r, i, arr) => (
                <div key={i} className="hf-row" style={{ padding: '14px 22px', borderTop: i > 0 ? `1px solid ${hf.hair2}` : 'none', gap: 16 }}>
                  <div className="hf-stack" style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.k}</span>
                    <span className="hf-mini" style={{ marginTop: 2 }}>{r.v}</span>
                  </div>
                  {r.toggle ? (
                    <div style={{ width: 38, height: 22, borderRadius: 99, background: r.off ? hf.hair : hf.ember, padding: 2, position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: r.off ? 2 : 18, boxShadow: '0 1px 2px rgba(0,0,0,.2)' }}></div>
                    </div>
                  ) : (
                    <button className="hf-btn sm ghost">Edit</button>
                  )}
                </div>
              ))}
            </div>

            {/* Hard exits */}
            <span className="hf-eyebrow" style={{ display: 'block', marginTop: 32, color: hf.rust }}>Hard exits</span>
            <div className="hf-card" style={{ marginTop: 12, padding: '20px 26px', borderColor: '#e8c7b5', background: '#fbf3ed' }}>
              <div className="hf-row" style={{ gap: 16 }}>
                <div className="hf-stack" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: hf.rust }}>Abandon Run 01</span>
                  <p className="hf-mini" style={{ marginTop: 4, color: '#7a4530', fontFamily: "'Inter',sans-serif", textTransform: 'none', letterSpacing: 0, fontSize: 12, lineHeight: 1.5 }}>
                    Run archives at day 24. Unclaimed rewards (Day 30, 45, 60, 75, 90) will not unlock. Your level is preserved.
                  </p>
                </div>
                <button className="hf-btn ghost sm" style={{ borderColor: hf.rust, color: hf.rust }}>Abandon run</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </HfFrame>
  );
}

Object.assign(window, { HfDayDetail, HfContinuation, HfSettings });
