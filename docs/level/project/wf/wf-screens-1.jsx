// Wireframe screens, batch 1: Today, Log+Reasoning Modal, Level-Up Modal.

// ── 1. TODAY / HOME ──────────────────────────────────────────
function WfTodayScreen() {
  const [checks, setChecks] = React.useState({ cal: true, pro: true, meals: false, gym: false, code: false, sleep: false, water: true });
  const t = (k) => setChecks(s => ({ ...s, [k]: !s[k] }));
  const C = ({k, label, sub}) => (
    <div className="wf-row" style={{ padding: '8px 0', borderBottom: '1px dashed #e0e0e0' }}>
      <span className={"wf-check " + (checks[k] ? 'on' : '')} onClick={() => t(k)}>{checks[k] ? '✓' : ''}</span>
      <div style={{ flex: 1 }}>
        <div className="wf-body" style={{ fontWeight: 500 }}>{label}</div>
        {sub && <div className="wf-mini">{sub}</div>}
      </div>
    </div>
  );
  return (
    <WfFrame title="HOME · TODAY" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="today" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <WfTopBar crumb="Today · Day 24 · Tue Apr 28" status="In Progress" />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>
            {/* MAIN */}
            <div style={{ padding: 22, overflow: 'auto' }}>
              <div className="wf-h1" style={{ marginBottom: 4 }}>Today's Quest Log</div>
              <div className="wf-mini" style={{ marginBottom: 18 }}>3 cores · 2 optional · all-or-nothing on cores</div>

              <WfSection title="◆ Core Quests (required)">
                <div className="wf-solid" style={{ padding: '10px 14px', marginBottom: 10 }}>
                  <div className="wf-row" style={{ marginBottom: 4 }}>
                    <span className="wf-h3">Eating</span>
                    <span className="wf-tag">2 of 3 subtasks</span>
                    <span style={{ marginLeft: 'auto' }} className="wf-mini">2700 kcal · 165g protein · 3 meals</span>
                  </div>
                  <C k="cal" label="Hit calorie target (≥2700 kcal)" sub="Logged: 2820 kcal" />
                  <C k="pro" label="Hit protein target (≥165g)" sub="Logged: 178g" />
                  <C k="meals" label="Eat ≥3 distinct meals" sub="Logged: 2 — unlocked at L6" />
                </div>
                <div className="wf-solid" style={{ padding: '10px 14px', marginBottom: 10 }}>
                  <div className="wf-row" style={{ marginBottom: 4 }}>
                    <span className="wf-h3">Gym</span>
                    <span className="wf-tag">scheduled today</span>
                    <span style={{ marginLeft: 'auto' }} className="wf-mini">≥47 min structured</span>
                  </div>
                  <C k="gym" label="Structured strength workout, ≥47 min" />
                </div>
                <div className="wf-solid" style={{ padding: '10px 14px', marginBottom: 18 }}>
                  <div className="wf-row" style={{ marginBottom: 4 }}>
                    <span className="wf-h3">Coding</span>
                    <span className="wf-tag">scheduled today</span>
                    <span style={{ marginLeft: 'auto' }} className="wf-mini">1× LeetCode (≥Medium) OR 1h project</span>
                  </div>
                  <C k="code" label="Solve ≥1 Medium LeetCode problem" />
                </div>
              </WfSection>

              <WfSection title="○ Optional Quests">
                <div className="wf-box" style={{ padding: '10px 14px', marginBottom: 8 }}>
                  <C k="sleep" label="Sleep ≥7 hours" sub="Logged: 6h 40m — eligible to skip with reason" />
                  <div className="wf-row" style={{ marginTop: 6, gap: 6 }}>
                    <button className="wf-btn ghost" style={{ fontSize: 9, padding: '5px 10px' }}>Skip with reason →</button>
                    <span className="wf-mini" style={{ marginLeft: 'auto' }}>Skip streak: 0 / 3</span>
                  </div>
                </div>
                <div className="wf-box" style={{ padding: '10px 14px' }}>
                  <C k="water" label="Hit water target (≥3.1 L)" sub="Logged: 3.2 L" />
                </div>
              </WfSection>

              <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
                <button className="wf-btn primary">Submit Day</button>
                <button className="wf-btn">Open Log →</button>
                <span className="wf-mini" style={{ marginLeft: 'auto', alignSelf: 'center' }}>Auto-submits at 23:59 local</span>
              </div>
            </div>

            {/* SIDE PANEL */}
            <div style={{ borderLeft: '1px dashed #bbb', padding: 18, overflow: 'auto', background: '#fff' }}>
              <WfSection title="Chain · Cycle 02">
                <WfChainRibbon
                  cells={['q','q','m','q','q','q','q','q','t','f','f','f','f','f','f','f','f','f']}
                  label="8 of 15 qualified · 1 of 3 misses used"
                />
                <div className="wf-mini" style={{ marginTop: 10, lineHeight: 1.5 }}>15 qualifying days within an 18-day window unlocks the next reward. 4th miss → cycle drops 3 days.</div>
              </WfSection>

              <hr className="wf-divider" style={{ margin: '18px 0' }} />

              <WfSection title="Level Track">
                <div className="wf-row" style={{ alignItems: 'baseline', marginBottom: 6 }}>
                  <span className="wf-h1" style={{ fontSize: 28 }}>L7</span>
                  <span className="wf-mini" style={{ marginLeft: 8 }}>2 of 3 days clean → L8</span>
                </div>
                <div className="wf-bar"><span style={{ width: '66%' }}></span></div>
                <div className="wf-mini" style={{ marginTop: 8 }}>Next: <b>UNLOCK</b> (even level) — adds an optional task</div>
              </WfSection>

              <hr className="wf-divider" style={{ margin: '18px 0' }} />

              <WfSection title="Next Reward">
                <div className="wf-solid" style={{ padding: 10 }}>
                  <WfPlace label="Reward Photo" height={88} />
                  <div className="wf-h3" style={{ marginTop: 8 }}>Day 30 · BIG</div>
                  <div className="wf-body" style={{ fontWeight: 600 }}>[Item Name]</div>
                  <div className="wf-mini">$[price] · "[motivation]"</div>
                  <div className="wf-bar" style={{ marginTop: 8 }}><span style={{ width: '53%' }}></span></div>
                  <div className="wf-mini" style={{ marginTop: 4 }}>8/15 qualified · day-floor in 6 days</div>
                </div>
              </WfSection>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 70, left: 320, maxWidth: 200 }}>Subtasks roll up: ALL must check before the core counts. PRD §3.1.1.</WfNote>
      <WfNote style={{ top: 220, right: 18, maxWidth: 180 }}>Side panel is always visible — chain + level + next reward are the three motivational anchors.</WfNote>
      <WfNote style={{ bottom: 80, left: 280 }}>Skip flow opens reasoning modal (next artboard).</WfNote>
    </WfFrame>
  );
}

// ── 2. LOG SCREEN + REASONING MODAL ──────────────────────────
function WfLogScreen() {
  return (
    <WfFrame title="LOG · QUICK ENTRY" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="today" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <WfTopBar crumb="Today · Quick Log" status="In Progress" />
          <div style={{ flex: 1, padding: 22, overflow: 'auto' }}>
            <div className="wf-h1" style={{ marginBottom: 4 }}>Quick Log</div>
            <div className="wf-mini" style={{ marginBottom: 18 }}>Numeric subtasks · tap-to-toggle binary · skip optionals with reason</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Calories', 'kcal', '2820', '≥2700'],
                ['Protein', 'g', '178', '≥165'],
                ['Water', 'L', '3.2', '≥3.1'],
                ['Sleep last night', 'hr', '6.7', '≥7.0'],
                ['Workout duration', 'min', '—', '≥47'],
                ['Meals eaten', 'count', '2', '≥3'],
              ].map(([label, unit, val, target]) => (
                <div key={label} className="wf-solid" style={{ padding: 12 }}>
                  <div className="wf-h3">{label}</div>
                  <div className="wf-row" style={{ marginTop: 8, alignItems: 'baseline' }}>
                    <input className="wf-input" style={{ fontSize: 18, fontWeight: 600, padding: '6px 10px', width: 90 }} defaultValue={val} />
                    <span className="wf-mini">{unit}</span>
                    <span className="wf-mini" style={{ marginLeft: 'auto' }}>target {target}</span>
                  </div>
                  <div className="wf-bar" style={{ marginTop: 8 }}><span style={{ width: '88%' }}></span></div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 22 }}>
              <div className="wf-h2" style={{ marginBottom: 10 }}>Binary tasks</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['LeetCode Medium ✓', 'Workout — not yet', 'Mobility (opt) — skip?'].map(t => (
                  <div key={t} className="wf-pill">{t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* MODAL */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="wf-solid" style={{ width: 480, padding: 22, background: '#fff' }}>
              <div className="wf-cap">Skip Optional · Sleep ≥7 hours</div>
              <div className="wf-h1" style={{ marginTop: 6, marginBottom: 4 }}>Why are you skipping?</div>
              <div className="wf-mini" style={{ marginBottom: 14 }}>50+ characters required. The friction is the mechanism — not the gatekeeper.</div>
              <textarea className="wf-input" style={{ minHeight: 110, fontFamily: 'inherit', resize: 'none' }} defaultValue="Got home at 1am from a flight delay, only managed about 6h 40m"></textarea>
              <div className="wf-row" style={{ marginTop: 8 }}>
                <span className="wf-mini">62 / 50 chars · ✓</span>
                <span style={{ flex: 1 }}></span>
                <span className="wf-mini">Tag:</span>
                {['Sick', 'Tired', 'Busy', 'Other'].map((t, i) => <span key={t} className={"wf-pill " + (i===2?'on':'')}>{t}</span>)}
              </div>
              <hr className="wf-divider" style={{ margin: '14px 0' }} />
              <div className="wf-mini">Skip streak for this task: <b>0 / 3</b>. After 3 skips in a row, the task locks as mandatory on day 4.</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="wf-btn ghost">Cancel</button>
                <button className="wf-btn primary" style={{ marginLeft: 'auto' }}>Confirm skip →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 80, right: 22, maxWidth: 180 }}>Confirm button stays disabled until char-count ≥ 50.</WfNote>
      <WfNote style={{ bottom: 30, left: 200, maxWidth: 220 }}>Modal explains the 3-day rule inline so it's never a surprise.</WfNote>
    </WfFrame>
  );
}

// ── 3. LEVEL-UP MODAL ────────────────────────────────────────
function WfLevelUpScreen() {
  return (
    <WfFrame title="LEVEL-UP · L7 → L8" width={1180} height={820}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WfLeftRail active="today" />
        <div style={{ flex: 1, position: 'relative' }}>
          {/* dimmed background page hint */}
          <div style={{ position: 'absolute', inset: 0, padding: 22, opacity: 0.25 }}>
            <div className="wf-h1">Today's Quest Log</div>
            <div className="wf-place" style={{ height: 200, marginTop: 14 }}>(home content behind modal)</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,0.6)' }}></div>

          <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 760, background: '#fff', border: '1.5px solid #1a1a1a', padding: 28 }}>
            <div className="wf-row">
              <div className="wf-cap">3 consecutive qualifying days</div>
              <span style={{ flex: 1 }}></span>
              <div className="wf-pill on">L8 · UNLOCK</div>
            </div>
            <div className="wf-h1" style={{ fontSize: 32, marginTop: 8 }}>You leveled up.</div>
            <div className="wf-body" style={{ marginTop: 4 }}>Even levels add one optional task. Pick one — others return to the pool.</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 18 }}>
              {[
                { name: 'Mobility · 5 min', desc: 'Daily mobility flow before or after gym. Joint health compounds.', tag: 'NEW OPTIONAL' },
                { name: 'Tech reading · 20 min', desc: 'Read 20 min of technical material. Logs to History as titles.', tag: 'NEW OPTIONAL', selected: true },
                { name: 'Meditation · 5 min', desc: 'Five minutes seated. Counts even if interrupted.', tag: 'NEW OPTIONAL' },
              ].map((c, i) => (
                <div key={i} className={c.selected ? 'wf-solid' : 'wf-box'} style={{ padding: 14, borderWidth: c.selected ? 2 : 1.25, position: 'relative' }}>
                  <div className="wf-cap">Card 0{i+1}</div>
                  <WfPlace label="card art" height={70} style={{ margin: '8px 0' }} />
                  <div className="wf-h3">{c.name}</div>
                  <div className="wf-body" style={{ fontSize: 11, marginTop: 6 }}>{c.desc}</div>
                  <div className="wf-tag" style={{ marginTop: 10 }}>{c.tag}</div>
                  {c.selected && <div className="wf-pill on" style={{ position: 'absolute', top: 10, right: 10 }}>Selected</div>}
                </div>
              ))}
            </div>

            <hr className="wf-divider" style={{ margin: '18px 0' }} />
            <div className="wf-row">
              <span className="wf-mini">Selection is final. Unselected cards return to the pool and may resurface at future level-ups.</span>
              <span style={{ flex: 1 }}></span>
              <button className="wf-btn ghost">Preview daily routine →</button>
              <button className="wf-btn primary">Confirm L8</button>
            </div>
          </div>
        </div>
      </div>

      <WfNote style={{ top: 56, right: 30, maxWidth: 200 }}>Card-draw metaphor — playful but each pick is consequential and irreversible.</WfNote>
      <WfNote style={{ bottom: 80, right: 30, maxWidth: 200 }}>Odd levels would show a TIGHTEN card (e.g. "water +50 ml") instead of UNLOCK.</WfNote>
    </WfFrame>
  );
}

Object.assign(window, { WfTodayScreen, WfLogScreen, WfLevelUpScreen });
