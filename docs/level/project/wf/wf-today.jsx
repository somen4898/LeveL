// Wireframe — Today / Home + Onboarding screens.
// Uses primitives from wf-primitives.jsx (WfFrame, WfLeftRail, WfTopBar, WfChainRibbon, WfNote, WfPlace).

function WfToday() {
  const [eat, setEat] = React.useState({ cal: true, pro: true });
  const [gym, setGym] = React.useState(false);
  const [code, setCode] = React.useState(false);
  const [opt, setOpt] = React.useState({ sleep: false, water: false });

  const cellState = (i) => {
    if (i < 7) return 'q';
    if (i === 4) return 'm';
    if (i === 7) return 't';
    return 'f';
  };
  const cells = Array.from({ length: 18 }, (_, i) => i === 4 ? 'm' : i < 7 ? 'q' : i === 7 ? 't' : 'f');

  return (
    <WfFrame title="01 · TODAY (HOME)" width={1280} height={820} scrollable>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="today" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <WfTopBar crumb="Today · Mon, May 18 · Day 24 of 90" status="In Progress" />
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
            {/* LEFT — quest log */}
            <div className="wf-stack" style={{ gap: 16, minWidth: 0 }}>
              <div>
                <div className="wf-cap">Day Quest · cores must all complete to qualify</div>
                <div className="wf-h1" style={{ marginTop: 4 }}>Today's Quest Log</div>
              </div>

              {/* Eating */}
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <div className="wf-row" style={{ gap: 10 }}>
                    <span className="wf-tag">CORE</span>
                    <span className="wf-h2">Eating</span>
                  </div>
                  <span className="wf-mini">2/2 subtasks</span>
                </div>
                <hr className="wf-divider" style={{ margin: '10px 0' }} />
                <div className="wf-stack" style={{ gap: 8 }}>
                  <div className="wf-row" onClick={() => setEat(s => ({ ...s, cal: !s.cal }))} style={{ cursor: 'pointer' }}>
                    <span className={'wf-check ' + (eat.cal ? 'on' : '')}>{eat.cal ? '✓' : ''}</span>
                    <span className="wf-body">Hit calorie target</span>
                    <span style={{ flex: 1 }}></span>
                    <span className="wf-mini">2,840 / 2,800 kcal</span>
                  </div>
                  <div className="wf-row" onClick={() => setEat(s => ({ ...s, pro: !s.pro }))} style={{ cursor: 'pointer' }}>
                    <span className={'wf-check ' + (eat.pro ? 'on' : '')}>{eat.pro ? '✓' : ''}</span>
                    <span className="wf-body">Hit protein target</span>
                    <span style={{ flex: 1 }}></span>
                    <span className="wf-mini">152 / 140 g</span>
                  </div>
                </div>
              </div>

              {/* Gym */}
              <div className="wf-box" style={{ padding: 14, position: 'relative' }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <div className="wf-row" style={{ gap: 10 }}>
                    <span className="wf-tag">CORE</span>
                    <span className="wf-h2">Gym</span>
                    <span className="wf-pill">SCHEDULED · MON</span>
                  </div>
                  <span className="wf-mini">0/1 subtask</span>
                </div>
                <hr className="wf-divider" style={{ margin: '10px 0' }} />
                <div className="wf-row" onClick={() => setGym(g => !g)} style={{ cursor: 'pointer' }}>
                  <span className={'wf-check ' + (gym ? 'on' : '')}>{gym ? '✓' : ''}</span>
                  <span className="wf-body">Structured strength workout · ≥45 min</span>
                  <span style={{ flex: 1 }}></span>
                  <button className="wf-btn ghost" style={{ padding: '4px 10px', fontSize: 9 }}>Log session</button>
                </div>
                <WfNote style={{ right: -180, top: 10, width: 160 }}>
                  Auto-completes on rest days (cadence: 4/wk).
                </WfNote>
              </div>

              {/* Coding */}
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <div className="wf-row" style={{ gap: 10 }}>
                    <span className="wf-tag">CORE</span>
                    <span className="wf-h2">Coding</span>
                  </div>
                  <span className="wf-mini">0/1 subtask</span>
                </div>
                <hr className="wf-divider" style={{ margin: '10px 0' }} />
                <div className="wf-row" onClick={() => setCode(c => !c)} style={{ cursor: 'pointer' }}>
                  <span className={'wf-check ' + (code ? 'on' : '')}>{code ? '✓' : ''}</span>
                  <span className="wf-body">1 LeetCode problem OR 1-hr project session</span>
                </div>
              </div>

              {/* Optionals */}
              <div className="wf-box" style={{ padding: 14, position: 'relative' }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <div className="wf-row" style={{ gap: 10 }}>
                    <span className="wf-tag" style={{ borderStyle: 'dashed' }}>OPTIONAL</span>
                    <span className="wf-h2">Side Quests</span>
                  </div>
                  <span className="wf-mini">skip needs 50-char reason</span>
                </div>
                <hr className="wf-divider" style={{ margin: '10px 0' }} />
                <div className="wf-stack" style={{ gap: 8 }}>
                  <div className="wf-row">
                    <span className={'wf-check ' + (opt.sleep ? 'on' : '')} onClick={() => setOpt(s => ({ ...s, sleep: !s.sleep }))}>{opt.sleep ? '✓' : ''}</span>
                    <span className="wf-body">Sleep ≥7 hrs</span>
                    <span style={{ flex: 1 }}></span>
                    <span className="wf-mini">streak: 0 skips</span>
                    <button className="wf-btn ghost" style={{ padding: '4px 10px', fontSize: 9 }}>Skip…</button>
                  </div>
                  <div className="wf-row">
                    <span className={'wf-check ' + (opt.water ? 'on' : '')} onClick={() => setOpt(s => ({ ...s, water: !s.water }))}>{opt.water ? '✓' : ''}</span>
                    <span className="wf-body">Hit water target (3L)</span>
                    <span style={{ flex: 1 }}></span>
                    <span className="wf-mini">2 skips · ⚠ locks at 3</span>
                    <button className="wf-btn ghost" style={{ padding: '4px 10px', fontSize: 9 }}>Skip…</button>
                  </div>
                </div>
                <WfNote style={{ right: -180, top: 30, width: 170 }}>
                  Skip 3 days in a row → mandatory on day 4 (warning shown).
                </WfNote>
              </div>
            </div>

            {/* RIGHT — telemetry */}
            <div className="wf-stack" style={{ gap: 16, minWidth: 0 }}>
              {/* Chain ribbon */}
              <div className="wf-box" style={{ padding: 14 }}>
                <WfChainRibbon cells={cells} label="Cycle 02 of 6 · 8 of 15 qualified · 1 miss used" />
              </div>

              {/* Level card */}
              <div className="wf-box" style={{ padding: 14, position: 'relative' }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">Current Level</span>
                  <span className="wf-mini">parity: ODD → next is TIGHTEN</span>
                </div>
                <div className="wf-row" style={{ gap: 14, marginTop: 8, alignItems: 'baseline' }}>
                  <div className="wf-h1" style={{ fontSize: 36, fontWeight: 700 }}>07</div>
                  <div className="wf-stack">
                    <span className="wf-h3">Level 07</span>
                    <span className="wf-mini">2 of 3 days clean → Level 08</span>
                  </div>
                </div>
                <div className="wf-bar" style={{ marginTop: 10 }}><span style={{ width: '66%' }}></span></div>
                <WfNote style={{ right: -180, top: 10, width: 170 }}>
                  Level-up modal triggers when 3rd qualifying day logged.
                </WfNote>
              </div>

              {/* Next reward */}
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="wf-cap">Next Reward · Day 30 · Big</span>
                  <span className="wf-pill">QUALIFYING</span>
                </div>
                <div className="wf-row" style={{ gap: 12, marginTop: 10 }}>
                  <WfPlace label="REWARD PHOTO" height={80} style={{ width: 80, flexShrink: 0 }} />
                  <div className="wf-stack" style={{ gap: 4, flex: 1 }}>
                    <span className="wf-h3">Mechanical keyboard</span>
                    <span className="wf-mini">$240 · "earned my 9-to-5 focus"</span>
                    <div className="wf-bar" style={{ marginTop: 6 }}><span style={{ width: '53%' }}></span></div>
                    <span className="wf-mini">8/15 chain · day-floor: D30 (in 6d)</span>
                  </div>
                </div>
              </div>

              {/* Day status */}
              <div className="wf-box" style={{ padding: 14 }}>
                <div className="wf-cap">End-of-Day Summary</div>
                <div className="wf-stack" style={{ gap: 6, marginTop: 8 }}>
                  <div className="wf-mini">Cores: <b>2 of 3 done</b></div>
                  <div className="wf-mini">Optionals: <b>0 done · 0 skipped</b></div>
                  <div className="wf-mini">Window misses: <b>1 of 3 used</b></div>
                </div>
                <button className="wf-btn primary" style={{ width: '100%', marginTop: 12 }}>Close Day & Lock Log</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WfFrame>
  );
}

window.WfToday = WfToday;
