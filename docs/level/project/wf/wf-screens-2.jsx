// Wireframe screens, batch 2: Reward Vault, History/Codex, Settings.

// ── 4. REWARD VAULT ──────────────────────────────────────────
function WfRewardVaultScreen() {
  const stations = [
    { day: 15, tier: 'small', state: 'claimed' },
    { day: 30, tier: 'big', state: 'claimable' },
    { day: 45, tier: 'small', state: 'qualifying' },
    { day: 60, tier: 'big', state: 'locked' },
    { day: 75, tier: 'small', state: 'locked' },
    { day: 90, tier: 'big', state: 'locked' },
  ];
  return (
    <WfFrame title="REWARD VAULT" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="vault" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <WfTopBar crumb="Reward Vault · 6 stations · 1 claimed" status="1 Claimable" />
          <div style={{ flex: 1, padding: 22, overflow: 'auto' }}>
            <div className="wf-h1" style={{ marginBottom: 4 }}>The Journey</div>
            <div className="wf-mini" style={{ marginBottom: 22 }}>Six rewards, fixed calendar. Day-floors prevent early claims. Upgrade-only — no swap, no downgrade.</div>

            {/* Journey timeline */}
            <div style={{ position: 'relative', padding: '30px 0 10px' }}>
              <div style={{ position: 'absolute', top: 64, left: 12, right: 12, height: 0, borderTop: '1.5px dashed #1a1a1a' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
                {stations.map((s, i) => {
                  const labels = { claimed: 'CLAIMED', claimable: 'CLAIM NOW', qualifying: 'QUALIFYING', locked: 'LOCKED' };
                  return (
                    <div key={i} style={{ position: 'relative' }}>
                      <div className="wf-cap" style={{ textAlign: 'center', marginBottom: 4 }}>Day {s.day} · {s.tier === 'big' ? 'BIG' : 'small'}</div>
                      <div className={s.state === 'claimable' ? 'wf-fill' : 'wf-solid'} style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                        {labels[s.state]}
                      </div>
                      <div className={s.state === 'locked' ? 'wf-box' : 'wf-solid'} style={{ marginTop: 12, padding: 10 }}>
                        <WfPlace label="reward image" height={s.tier === 'big' ? 110 : 80} />
                        <div className="wf-h3" style={{ marginTop: 8 }}>[Item {i+1}]</div>
                        <div className="wf-mini">$[price]</div>
                        <div className="wf-mini" style={{ marginTop: 6, fontStyle: 'italic' }}>"[why this motivates me…]"</div>
                        {s.state === 'claimable' && <button className="wf-btn primary" style={{ width: '100%', marginTop: 10, fontSize: 10 }}>Claim →</button>}
                        {s.state === 'qualifying' && <div className="wf-bar" style={{ marginTop: 10 }}><span style={{ width: '40%' }}></span></div>}
                        {s.state === 'qualifying' && <div className="wf-mini" style={{ marginTop: 4 }}>6/15 qualified</div>}
                        {s.state === 'locked' && <div className="wf-mini" style={{ marginTop: 10, color: '#999' }}>Floor: Day {s.day}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="wf-divider" style={{ margin: '22px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
              <div>
                <div className="wf-h2" style={{ marginBottom: 8 }}>Upgrade window</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  <div className="wf-row">
                    <span className="wf-tag">ELIGIBLE</span>
                    <span className="wf-mini" style={{ marginLeft: 'auto' }}>Last claim: Day 15 (-9 days ago)</span>
                  </div>
                  <div className="wf-body" style={{ marginTop: 8 }}>You may upgrade any unclaimed reward to a more expensive item. Downgrades and swaps are permanently locked.</div>
                  <button className="wf-btn" style={{ marginTop: 10 }}>Upgrade a reward →</button>
                </div>
              </div>
              <div>
                <div className="wf-h2" style={{ marginBottom: 8 }}>Run summary</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  <div className="wf-row" style={{ justifyContent: 'space-between' }}><span className="wf-mini">Claimed</span><span className="wf-h3">1 / 6</span></div>
                  <div className="wf-row" style={{ justifyContent: 'space-between', marginTop: 4 }}><span className="wf-mini">Total reward value</span><span className="wf-h3">$[—]</span></div>
                  <div className="wf-row" style={{ justifyContent: 'space-between', marginTop: 4 }}><span className="wf-mini">Days to next claimable floor</span><span className="wf-h3">6</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 90, right: 30, maxWidth: 190 }}>Big tier stations are visually larger — alternating rhythm reinforces small / big / small / big.</WfNote>
      <WfNote style={{ top: 280, left: 220, maxWidth: 180 }}>Claimable state is the only filled card — eye is drawn there immediately.</WfNote>
    </WfFrame>
  );
}

// ── 5. HISTORY / CODEX ───────────────────────────────────────
function WfHistoryScreen() {
  // Build a 90-day grid (only render 60 here for space)
  const days = Array.from({ length: 60 }, (_, i) => {
    if (i >= 24) return 'f';
    if ([2, 14, 19].includes(i)) return 'm';
    if ([5, 11].includes(i)) return 's';
    return 'q';
  });
  return (
    <WfFrame title="CODEX · HISTORY" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="codex" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <WfTopBar crumb="Codex · 90-day record · Day 24 of 90" />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0, overflow: 'hidden' }}>
            <div style={{ padding: 22, overflow: 'auto', borderRight: '1px dashed #bbb' }}>
              <div className="wf-h1" style={{ marginBottom: 4 }}>Run 01 · The Record</div>
              <div className="wf-mini" style={{ marginBottom: 18 }}>Tabs: Calendar · Reasoning Archive · Level History · Body Metrics</div>

              <div className="wf-row" style={{ gap: 6, marginBottom: 14 }}>
                {['Calendar', 'Reasoning', 'Levels', 'Body'].map((t, i) => <span key={t} className={"wf-pill " + (i===0?'on':'')}>{t}</span>)}
              </div>

              {/* Calendar grid */}
              <div className="wf-cap" style={{ marginBottom: 8 }}>90-day record</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 3 }}>
                {days.map((d, i) => {
                  const base = { aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 };
                  if (d === 'q') return <div key={i} className="wf-fill" style={base}>{i+1}</div>;
                  if (d === 'm') return <div key={i} className="wf-x wf-box" style={base}></div>;
                  if (d === 's') return <div key={i} className="wf-box" style={{ ...base, background: '#fef4a8' }}>{i+1}</div>;
                  return <div key={i} className="wf-box" style={{ ...base, color: '#aaa' }}>{i+1}</div>;
                })}
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                <span className="wf-mini">■ qualified</span>
                <span className="wf-mini">⊠ failed</span>
                <span className="wf-mini">▣ skipped w/ reason</span>
                <span className="wf-mini">□ future</span>
              </div>

              <hr className="wf-divider" style={{ margin: '22px 0' }} />

              <div className="wf-h2" style={{ marginBottom: 10 }}>Selected: Day 14 · Apr 18</div>
              <div className="wf-box" style={{ padding: 12 }}>
                <div className="wf-row"><span className="wf-tag">FAILED</span><span className="wf-mini" style={{ marginLeft: 'auto' }}>Cores: 2 of 3 · Coding incomplete</span></div>
                <div className="wf-body" style={{ marginTop: 10 }}>Eating ✓ · Gym ✓ · Coding ✗</div>
                <div className="wf-mini" style={{ marginTop: 4 }}>No skip reasons logged.</div>
              </div>
            </div>

            <div style={{ padding: 22, overflow: 'auto' }}>
              <div className="wf-h2" style={{ marginBottom: 10 }}>Pattern Insights</div>
              <div className="wf-box" style={{ padding: 12, marginBottom: 12 }}>
                <div className="wf-cap">Most-skipped optional</div>
                <div className="wf-h3" style={{ marginTop: 4 }}>Sleep ≥7 hours</div>
                <div className="wf-mini">5 skips · 3 tagged "Tired", 2 tagged "Busy"</div>
                <WfPlace label="frequency sparkline" height={48} style={{ marginTop: 8 }} />
              </div>
              <div className="wf-box" style={{ padding: 12, marginBottom: 12 }}>
                <div className="wf-cap">Tag frequency</div>
                {['Tired · 4', 'Busy · 3', 'Sick · 1', 'Other · 1'].map(t => (
                  <div key={t} className="wf-row" style={{ marginTop: 6 }}>
                    <span className="wf-body" style={{ fontSize: 11 }}>{t.split('·')[0]}</span>
                    <div className="wf-bar" style={{ flex: 1, marginLeft: 8 }}><span style={{ width: (parseInt(t.split('·')[1])*15)+'%' }}></span></div>
                  </div>
                ))}
              </div>
              <div className="wf-box" style={{ padding: 12, marginBottom: 12 }}>
                <div className="wf-cap">Reasoning archive</div>
                <div className="wf-mini" style={{ marginTop: 4 }}>9 entries · searchable</div>
                <input className="wf-input" style={{ marginTop: 8, fontSize: 11, padding: '6px 8px' }} placeholder="Search reasons…" />
                <div style={{ marginTop: 10 }}>
                  {['Apr 18 · Sleep · Tired', 'Apr 14 · Water · Busy', 'Apr 09 · Mobility · Sick'].map(t => (
                    <div key={t} className="wf-mini" style={{ padding: '4px 0', borderTop: '1px dashed #ddd' }}>{t}</div>
                  ))}
                </div>
              </div>
              <div className="wf-box" style={{ padding: 12 }}>
                <div className="wf-cap">Body metrics</div>
                <WfPlace label="weight chart · 24 days" height={70} style={{ marginTop: 6 }} />
                <div className="wf-mini" style={{ marginTop: 6 }}>+1.4 kg since Day 1 (opt-in)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 110, left: 280, maxWidth: 200 }}>Calendar doubles as the visual chain history — rolling-window math is hidden inside.</WfNote>
      <WfNote style={{ bottom: 100, right: 30, maxWidth: 190 }}>Pattern panel is descriptive, not judgmental — surfaces structure, doesn't scold.</WfNote>
    </WfFrame>
  );
}

// ── 6. SETTINGS ──────────────────────────────────────────────
function WfSettingsScreen() {
  const Field = ({ label, value, sub, locked }) => (
    <div className="wf-box" style={{ padding: 12, marginBottom: 8 }}>
      <div className="wf-row">
        <div className="wf-cap">{label}</div>
        {locked && <span className="wf-tag" style={{ marginLeft: 'auto' }}>LOCKED MID-RUN</span>}
      </div>
      <div className="wf-row" style={{ marginTop: 6 }}>
        <input className="wf-input" defaultValue={value} disabled={locked} style={{ flex: 1, opacity: locked ? 0.55 : 1 }} />
      </div>
      {sub && <div className="wf-mini" style={{ marginTop: 6 }}>{sub}</div>}
    </div>
  );
  return (
    <WfFrame title="SETTINGS" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="settings" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <WfTopBar crumb="Settings · Run 01 · Day 24" />
          <div style={{ flex: 1, padding: 22, overflow: 'auto' }}>
            <div className="wf-h1" style={{ marginBottom: 4 }}>Settings</div>
            <div className="wf-mini" style={{ marginBottom: 22 }}>What you can change now · what's locked until Run 02 · what's permanent.</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
              <div>
                <div className="wf-h2" style={{ marginBottom: 10 }}>◆ Always customizable</div>
                <Field label="Daily calorie target" value="2700 kcal" sub="Recommended: Mifflin-St Jeor + 400" />
                <Field label="Daily protein target" value="165 g" sub="1.6–2.2 g/kg bodyweight" />
                <Field label="Water target" value="3.1 L" sub="Auto-tightens at odd level-ups" />
                <Field label="Sleep window" value="7.0 hr" />
                <div className="wf-h3" style={{ margin: '16px 0 8px' }}>Schedule</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  <div className="wf-cap">Gym days</div>
                  <div className="wf-row" style={{ gap: 4, marginTop: 8 }}>
                    {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className={"wf-pill " + ([0,2,4,5].includes(i)?'on':'')}>{d}</span>)}
                  </div>
                  <div className="wf-cap" style={{ marginTop: 14 }}>Coding days</div>
                  <div className="wf-row" style={{ gap: 4, marginTop: 8 }}>
                    {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className={"wf-pill " + (i!==6?'on':'')}>{d}</span>)}
                  </div>
                </div>
                <div className="wf-h3" style={{ margin: '16px 0 8px' }}>Notifications</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  {['Daily 9pm log reminder', 'Level-up alert', 'Reward day-floor reached', 'Skip-streak nearing 3'].map(t => (
                    <div key={t} className="wf-row" style={{ padding: '4px 0' }}>
                      <span className="wf-check on">✓</span>
                      <span className="wf-body">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="wf-h2" style={{ marginBottom: 10 }}>✗ Never customizable mid-run</div>
                <Field label="The three cores" value="Eating · Gym · Coding" sub="Locked for the entire 90-day arc." locked />
                <Field label="Reward downgrades" value="Disallowed" sub="Upgrades only — and only if no claim in past 7 days." locked />
                <Field label="Reward day-floors" value="15 / 30 / 45 / 60 / 75 / 90" sub="No early claims." locked />
                <Field label="Reasoning minimum" value="50 characters" sub="Cannot be lowered." locked />
                <Field label="Three-day skip rule" value="Locks optional after 3 consecutive skips" sub="Cannot be paused or extended." locked />

                <div className="wf-h2" style={{ margin: '24px 0 10px' }}>◇ At-level-up only</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  <div className="wf-mini">Subtask additions / tightenings change ONLY at level-up. Sequence is predetermined; you choose 1 of 2–3 cards each time.</div>
                  <button className="wf-btn ghost" style={{ marginTop: 10 }}>View upcoming sequence preview →</button>
                </div>

                <div className="wf-h2" style={{ margin: '24px 0 10px' }}>Run controls</div>
                <div className="wf-box" style={{ padding: 12 }}>
                  <div className="wf-mini">Day 91 onward: re-configure 6 rewards or enter Continuation Mode (no rewards, habit maintenance).</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="wf-btn">Export run data</button>
                    <button className="wf-btn ghost">Abandon run…</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 100, right: 22, maxWidth: 200 }}>Locked fields are visible but disabled — the lock IS the feature (PRD §2.1: designer-self vs player-self).</WfNote>
    </WfFrame>
  );
}

Object.assign(window, { WfRewardVaultScreen, WfHistoryScreen, WfSettingsScreen });
