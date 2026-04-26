// Wireframe — Log + Reasoning Modal, Level-Up Modal, Reward Vault, History, Settings, Continuation

function WfLogReasoning() {
  return (
    <WfFrame title="02 · LOG + REASONING MODAL" width={1280} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="quests" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          <WfTopBar crumb="Quest Log · Skip Sleep ≥7 hrs" />
          {/* Dimmed bg content (hint) */}
          <div style={{ flex: 1, padding: 24, opacity: 0.35, pointerEvents: 'none' }}>
            <div className="wf-h2">Optional · Sleep ≥7 hrs</div>
            <div className="wf-body" style={{ marginTop: 10 }}>You're about to skip this side quest. Reasoning required.</div>
            <div className="wf-place" style={{ height: 200, marginTop: 16 }}>BG · log table</div>
          </div>

          {/* Modal */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="wf-solid" style={{ width: 520, padding: 22, background: '#fff', position: 'relative' }}>
              <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                <span className="wf-cap">Skip optional · Sleep ≥7 hrs</span>
                <span className="wf-mini">×</span>
              </div>
              <h2 className="wf-h1" style={{ fontSize: 18, marginTop: 8 }}>Why are you skipping this today?</h2>
              <p className="wf-body" style={{ marginTop: 4 }}>50+ characters. The act of typing the reason is the friction. End-of-day deadline.</p>

              <div style={{ marginTop: 14 }}>
                <span className="wf-cap">Tag (optional)</span>
                <div className="wf-row" style={{ gap: 6, marginTop: 6 }}>
                  {['Sick','Tired','Busy','Other'].map((t,i) => (
                    <span key={t} className={'wf-pill ' + (i===1?'on':'')}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <span className="wf-cap">Reason</span>
                <div className="wf-input" style={{ height: 96, padding: 10, fontSize: 12, lineHeight: 1.5, background: '#fff' }}>
                  Couldn't fall asleep last night, ended up debugging the chain bug until 2am.<span style={{ background: '#1a1a1a', display: 'inline-block', width: 8, height: 14, marginLeft: 1, verticalAlign: 'text-bottom' }}></span>
                </div>
                <div className="wf-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="wf-mini">73 / 50 chars · valid ✓</span>
                  <span className="wf-mini">consecutive skips: 1 · locks at 3</span>
                </div>
              </div>

              <div className="wf-row" style={{ marginTop: 18, justifyContent: 'flex-end', gap: 8 }}>
                <button className="wf-btn">Cancel</button>
                <button className="wf-btn primary">Confirm Skip</button>
              </div>
              <WfNote style={{ left: -200, top: 90, width: 180 }}>
                Confirm disabled until 50 chars typed. No retroactive reasoning.
              </WfNote>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

function WfLevelUp() {
  const opts = [
    { kind: 'tighten', target: 'Eating', text: '+150ml water target', sub: '3.0 L → 3.15 L' },
    { kind: 'tighten', target: 'Gym',    text: '+2 min minimum',     sub: '45 → 47 min' },
    { kind: 'tighten', target: 'Coding', text: 'Require 1 Medium',   sub: 'any → ≥1 medium problem' },
  ];
  return (
    <WfFrame title="03 · LEVEL-UP MODAL · auto-triggered" width={1280} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="levels" />
        <div style={{ flex: 1, position: 'relative', background: '#fafaf7' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.4)' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="wf-solid" style={{ width: 720, padding: 28, background: '#fff' }}>
              <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                <span className="wf-cap">Level-up · 3 consecutive qualifying days</span>
                <span className="wf-mini">odd level → tighten one subtask</span>
              </div>
              <div className="wf-row" style={{ gap: 16, marginTop: 14, alignItems: 'baseline' }}>
                <div className="wf-h1" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>07 → 08</div>
                <div className="wf-stack">
                  <span className="wf-h2">Choose your tightening</span>
                  <span className="wf-mini">unselected options return to the pool — you may see them at later odd levels.</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 18 }}>
                {opts.map((o, i) => (
                  <div key={i} className="wf-box" style={{ padding: 14, position: 'relative', background: i === 1 ? '#1a1a1a' : '#fff', color: i === 1 ? '#fafaf7' : '#1a1a1a' }}>
                    <span className="wf-cap" style={{ color: 'inherit', opacity: 0.7 }}>{o.kind.toUpperCase()} · {o.target}</span>
                    <div className="wf-h2" style={{ marginTop: 8, color: 'inherit' }}>{o.text}</div>
                    <div className="wf-mini" style={{ marginTop: 6, color: 'inherit', opacity: 0.7 }}>{o.sub}</div>
                    <div style={{ marginTop: 14, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.7 }}>
                      {i === 1 ? '◉ selected' : '○ tap to choose'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="wf-row" style={{ marginTop: 18, justifyContent: 'space-between' }}>
                <span className="wf-mini">Selection is FINAL for this level.</span>
                <button className="wf-btn primary">Confirm & apply tomorrow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

function WfVault() {
  const stops = [
    { day: 15, tier: 'small', state: 'claimed',   name: 'Steam game' },
    { day: 30, tier: 'big',   state: 'qualifying',name: 'Mech keyboard' },
    { day: 45, tier: 'small', state: 'locked',    name: 'New hoodie' },
    { day: 60, tier: 'big',   state: 'locked',    name: 'Weekend trip' },
    { day: 75, tier: 'small', state: 'locked',    name: 'AirPods Pro' },
    { day: 90, tier: 'big',   state: 'locked',    name: 'Suit jacket' },
  ];
  return (
    <WfFrame title="04 · REWARD VAULT" width={1280} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="vault" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <WfTopBar crumb="Reward Vault · 6 stations" status="UPGRADE LOCKED · 2d remain" />
          <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
            {/* Journey rail */}
            <div className="wf-box" style={{ padding: 16 }}>
              <div className="wf-cap">90-day journey · alternating SMALL / BIG</div>
              <div style={{ position: 'relative', marginTop: 18, height: 110 }}>
                <div style={{ position: 'absolute', left: 12, right: 12, top: 30, height: 2, background: '#1a1a1a' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
                  {stops.map((s) => (
                    <div key={s.day} className="wf-stack" style={{ alignItems: 'center', gap: 6 }}>
                      <span className="wf-cap">DAY {s.day}</span>
                      <div className={s.state === 'claimed' ? 'wf-fill' : (s.state === 'qualifying' ? 'wf-solid' : 'wf-box')}
                           style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                        {s.state === 'claimed' ? '✓' : s.state === 'qualifying' ? '◉' : '🔒'}
                      </div>
                      <span className="wf-mini">{s.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, flex: 1, minHeight: 0 }}>
              {stops.map((s) => (
                <div key={s.day} className={s.state==='locked'?'wf-place':'wf-box'} style={{ padding: 14, display: 'flex', flexDirection: 'column' }}>
                  <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                    <span className="wf-cap">DAY {s.day} · {s.tier.toUpperCase()}</span>
                    <span className={'wf-pill ' + (s.state==='qualifying'?'on':'')}>{s.state.toUpperCase()}</span>
                  </div>
                  <WfPlace label="REWARD PHOTO" height={68} style={{ marginTop: 10 }} />
                  <div className="wf-h3" style={{ marginTop: 8 }}>{s.name}</div>
                  <div className="wf-mini">$XX · "why this motivates me"</div>
                  {s.state === 'qualifying' && (
                    <>
                      <div className="wf-bar" style={{ marginTop: 10 }}><span style={{ width: '53%' }}></span></div>
                      <div className="wf-mini" style={{ marginTop: 4 }}>8/15 · day-floor in 6d</div>
                    </>
                  )}
                  <div className="wf-row" style={{ marginTop: 'auto', paddingTop: 10, gap: 6 }}>
                    {s.state === 'claimed' ? <span className="wf-mini">claimed · D17</span>
                     : s.state === 'qualifying' ? <button className="wf-btn ghost" style={{ flex: 1 }} disabled>CLAIM (D30)</button>
                     : <button className="wf-btn ghost" style={{ flex: 1 }}>Upgrade</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

function WfHistory() {
  const days = Array.from({ length: 24 }, (_, i) => {
    if (i === 4 || i === 11 || i === 18) return 'm';
    return 'q';
  });
  return (
    <WfFrame title="05 · HISTORY · day log + reasoning + patterns" width={1280} height={820} scrollable>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="codex" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <WfTopBar crumb="Codex · Run 01 · Day 1 → Day 24" />
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="wf-stack" style={{ gap: 16 }}>
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Compliance heatmap · 90 days</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18,1fr)', gap: 3, marginTop: 10 }}>
                  {Array.from({ length: 90 }, (_, i) => {
                    const isPast = i < 24;
                    const isMiss = [4,11,18].includes(i);
                    return <div key={i} className={isPast ? (isMiss ? 'wf-x wf-box' : 'wf-fill') : 'wf-box'} style={{ height: 18 }}></div>;
                  })}
                </div>
                <div className="wf-mini" style={{ marginTop: 8 }}>21 qualified · 3 missed · 66 to go</div>
              </div>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Day log · click any to expand</div>
                <table style={{ width: '100%', marginTop: 10, fontSize: 11, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px dashed #aaa', textAlign: 'left' }}>
                      <th style={{ padding: '6px 4px' }}>Day</th><th>Date</th><th>Status</th><th>Cores</th><th>Skips</th><th>Lvl</th>
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
                      [18,'May 12','Qualified','3/3','0','6'],
                    ].map(r => (
                      <tr key={r[0]} style={{ borderBottom: '1px dashed #eee' }}>
                        {r.map((c, i) => <td key={i} style={{ padding: '6px 4px' }}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="wf-stack" style={{ gap: 16 }}>
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Reasoning archive · 7 entries</div>
                <div className="wf-stack" style={{ gap: 8, marginTop: 10 }}>
                  {[
                    { d: 22, task: 'Water', tag: 'Busy', text: 'Back-to-back meetings, only had coffee at desk all day, lost track…' },
                    { d: 19, task: 'Sleep', tag: 'Tired', text: 'Couldn\'t fall asleep, ended up debugging until 2am, finally crashed…' },
                    { d: 14, task: 'Water', tag: 'Busy', text: 'Travel day, airport security trashed bottle, didn\'t buy another…' },
                  ].map((e,i) => (
                    <div key={i} className="wf-box" style={{ padding: 10 }}>
                      <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                        <span className="wf-cap">D{e.d} · {e.task}</span>
                        <span className="wf-pill">{e.tag}</span>
                      </div>
                      <p className="wf-body" style={{ marginTop: 6, fontSize: 11 }}>{e.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wf-box" style={{ padding: 14, position: 'relative' }}>
                <div className="wf-cap">Pattern view</div>
                <div className="wf-stack" style={{ gap: 8, marginTop: 10 }}>
                  <div className="wf-row"><span className="wf-body" style={{ flex: 1 }}>Most-skipped optional</span><span className="wf-h3">Water · 4×</span></div>
                  <div className="wf-row"><span className="wf-body" style={{ flex: 1 }}>Most-used tag</span><span className="wf-h3">Busy · 5×</span></div>
                  <div className="wf-row"><span className="wf-body" style={{ flex: 1 }}>Skip 80% of "Busy" days</span><span className="wf-h3">Water</span></div>
                </div>
                <WfNote style={{ right: -180, top: 14, width: 170 }}>
                  No judgment in copy — just observed correlations.
                </WfNote>
              </div>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Body metrics · opt-in</div>
                <WfPlace label="WEIGHT TREND CHART · 24 days" height={90} style={{ marginTop: 10 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

function WfSettings() {
  return (
    <WfFrame title="06 · SETTINGS · what's locked vs customizable" width={1280} height={820} scrollable>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="settings" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <WfTopBar crumb="Settings · Run 01 · Day 24" />
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="wf-stack" style={{ gap: 14 }}>
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">Daily targets · always editable</span>
                  <span className="wf-pill">UNLOCKED</span>
                </div>
                <div className="wf-stack" style={{ gap: 10, marginTop: 12 }}>
                  {[['Calorie target','2,800 kcal'],['Protein target','140 g'],['Water target','3.0 L'],['Sleep window','7 hrs'],['Gym minimum','45 min']].map(([k,v]) => (
                    <div key={k} className="wf-row">
                      <span className="wf-body" style={{ flex: 1 }}>{k}</span>
                      <span className="wf-input" style={{ width: 140 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">Cadence</span>
                  <span className="wf-pill">UNLOCKED</span>
                </div>
                <div className="wf-stack" style={{ gap: 8, marginTop: 12 }}>
                  <div className="wf-row" style={{ gap: 6 }}>
                    <span className="wf-mini" style={{ width: 60 }}>GYM</span>
                    {['M','T','W','T','F','S','S'].map((d,i) => <span key={i} className={'wf-pill ' + ([0,2,4,5].includes(i)?'on':'')}>{d}</span>)}
                  </div>
                  <div className="wf-row" style={{ gap: 6 }}>
                    <span className="wf-mini" style={{ width: 60 }}>CODE</span>
                    {['M','T','W','T','F','S','S'].map((d,i) => <span key={i} className={'wf-pill ' + (i!==6?'on':'')}>{d}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="wf-stack" style={{ gap: 14 }}>
              <div className="wf-box" style={{ padding: 14, position: 'relative' }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">The three cores · LOCKED for the run</span>
                  <span className="wf-pill on">SEALED</span>
                </div>
                <div className="wf-stack" style={{ gap: 8, marginTop: 12 }}>
                  {['Eating','Gym','Coding'].map(c => (
                    <div key={c} className="wf-row">
                      <span className="wf-body" style={{ flex: 1 }}>{c}</span>
                      <span className="wf-mini">unlocks Day 91</span>
                    </div>
                  ))}
                </div>
                <WfNote style={{ left: -180, top: 14, width: 170 }}>
                  Cores are immutable mid-run. Wireframe shows lock affordance + rationale tooltip.
                </WfNote>
              </div>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">Notifications</span>
                  <span className="wf-pill">UNLOCKED</span>
                </div>
                <div className="wf-stack" style={{ gap: 8, marginTop: 12 }}>
                  {[['Daily quest reminder','9:00 am'],['End-of-day warning','9:00 pm'],['Reward unlock','immediate']].map(([k,v]) => (
                    <div key={k} className="wf-row">
                      <span className="wf-body" style={{ flex: 1 }}>{k}</span>
                      <span className="wf-input" style={{ width: 140 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Designer = Player escape hatch</div>
                <p className="wf-body" style={{ marginTop: 8, fontSize: 11 }}>
                  Want to change a locked rule? It's saved for the NEXT run. 24-hour cooling-off enforced.
                </p>
                <button className="wf-btn ghost" style={{ marginTop: 8 }}>Stage rule change for Run 02</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

function WfContinuation() {
  return (
    <WfFrame title="07 · DAY 91 · CONTINUATION HANDOFF" width={1280} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="today" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <WfTopBar crumb="Day 91 · Run 01 complete" status="ARC COMPLETE" />
          <div style={{ flex: 1, padding: 32, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
            <div className="wf-stack" style={{ gap: 14 }}>
              <span className="wf-cap">RUN 01 · CLOSING SUMMARY</span>
              <h1 className="wf-h1" style={{ fontSize: 32 }}>The arc is closed. The habit is not.</h1>
              <p className="wf-body">Your level, your active task list, and your reasoning archive carry over. The chain resets. You configure six new rewards — or opt into Continuation Mode, where compliance simply maintains.</p>

              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">Run 01 numbers</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 10 }}>
                  {[['82','qualified days'],['8','missed'],['Lv 26','final level'],['6/6','rewards claimed']].map(([n,l]) => (
                    <div key={l} className="wf-stack">
                      <span className="wf-h1" style={{ fontSize: 24 }}>{n}</span>
                      <span className="wf-mini">{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <WfPlace label="ARC RIBBON · 90 days as one continuous heatmap" height={70} />
            </div>

            <div className="wf-stack" style={{ gap: 14 }}>
              <span className="wf-cap">CHOOSE YOUR DAY 91</span>
              <div className="wf-box" style={{ padding: 16, position: 'relative' }}>
                <div className="wf-row" style={{ gap: 10 }}>
                  <span className="wf-pill on">RECOMMENDED</span>
                  <span className="wf-h3">Run 02 · new rewards</span>
                </div>
                <p className="wf-body" style={{ marginTop: 8, fontSize: 11 }}>Configure 6 new rewards. Chain resets. Level continues from 26.</p>
                <button className="wf-btn primary" style={{ marginTop: 10, width: '100%' }}>Begin Run 02 setup</button>
              </div>
              <div className="wf-box" style={{ padding: 16 }}>
                <div className="wf-row" style={{ gap: 10 }}>
                  <span className="wf-pill">MAINTENANCE</span>
                  <span className="wf-h3">Continuation Mode</span>
                </div>
                <p className="wf-body" style={{ marginTop: 8, fontSize: 11 }}>No rewards, no metronome. The cores stay, the chain still runs. Habits compound.</p>
                <button className="wf-btn" style={{ marginTop: 10, width: '100%' }}>Enter Continuation Mode</button>
              </div>
              <div className="wf-box" style={{ padding: 16 }}>
                <div className="wf-row" style={{ gap: 10 }}>
                  <span className="wf-pill">OFF-RAMP</span>
                  <span className="wf-h3">Pause</span>
                </div>
                <p className="wf-body" style={{ marginTop: 8, fontSize: 11 }}>Codex stays. Daily quests stop. You can resume Run 02 any time.</p>
                <button className="wf-btn ghost" style={{ marginTop: 10, width: '100%' }}>Pause LeveL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

Object.assign(window, { WfLogReasoning, WfLevelUp, WfVault, WfHistory, WfSettings, WfContinuation });
