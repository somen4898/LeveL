// Hi-fi v2 screens 3–5: Reasoning Modal, Reward Calendar, Levels.

// ── 3. REASONING MODAL — the soul of the product ──────────────
function HfReasoning() {
  const text = "Calf flared up on the lift this morning, walked home stiff and decided not to add load on top of it tonight";
  const len = text.length;
  return (
    <HfFrame title="reasoning · skip optional" sub="MOBILITY · 10 MIN">
      <div style={{ width: '100%', height: '100%', position: 'relative', background: 'rgba(22,19,17,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* faded today behind */}
        <div style={{ position: 'absolute', inset: 0, padding: '20px 32px', opacity: 0.18, pointerEvents: 'none' }}>
          <div className="hf-card" style={{ padding: 24, marginTop: 60 }}>
            <span className="hf-eyebrow">Today's contract · 1 of 3 complete</span>
            <h2 className="hf-h1" style={{ fontSize: 32, marginTop: 10 }}>Two cores left.</h2>
          </div>
        </div>

        <div style={{ width: 580, background: hf.card, borderRadius: 12, boxShadow: hf.shadowH, border: `1px solid ${hf.hair}`, padding: '36px 40px', position: 'relative', zIndex: 2 }}>
          <div className="hf-row">
            <span className="hf-eyebrow">Skipping an Optional · Day 24</span>
            <div style={{ flex: 1 }}></div>
            <span style={{ fontSize: 18, color: hf.ink3, cursor: 'pointer' }}>×</span>
          </div>

          <h2 className="hf-h1" style={{ marginTop: 18, fontSize: 36, lineHeight: 1.05 }}>
            <em style={{ fontStyle: 'italic' }}>Why</em> are you skipping<br/>Mobility today?
          </h2>

          <p className="hf-body" style={{ marginTop: 14, fontSize: 13.5, color: hf.ink2 }}>
            You're free to skip — Optionals don't fail your day. But the day only qualifies if every skip has a reason. <strong style={{ color: hf.ink }}>Write something true.</strong> Lazy reasons survive the form, but rarely survive themselves.
          </p>

          <div style={{ marginTop: 22, position: 'relative' }}>
            <textarea
              defaultValue={text}
              style={{
                width: '100%', minHeight: 110, padding: '14px 16px',
                fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55,
                color: hf.ink, background: hf.bone,
                border: `1.5px solid ${hf.ink}`, borderRadius: 8, resize: 'vertical',
                outline: 'none', fontWeight: 400,
              }}
            />
            <div className="hf-row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
              <span className="hf-mini">MIN 50 CHARS · NO RICH TEXT · NO EDIT AFTER SUBMIT</span>
              <span className="hf-mono" style={{ fontSize: 11, fontWeight: 600, color: len >= 50 ? hf.moss : hf.ember }}>{len} / 50 ✓</span>
            </div>
          </div>

          {/* skip context */}
          <div style={{ marginTop: 18, padding: '14px 16px', background: hf.paper2, borderRadius: 7 }}>
            <div className="hf-row" style={{ gap: 14 }}>
              <span className="hf-mini">PATTERN · MOBILITY</span>
              <div style={{ flex: 1 }}></div>
              <div className="hf-row" style={{ gap: 4 }}>
                {['skip','done','skip','done','done','done','skip'].map((s, i) => (
                  <span key={i} style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: s === 'done' ? hf.ink : 'transparent',
                    border: s === 'done' ? 'none' : `1px solid ${hf.ink3}`,
                  }}></span>
                ))}
              </div>
              <span className="hf-mono" style={{ fontSize: 11, color: hf.ink2 }}>3 skips / 7 days</span>
            </div>
            <p className="hf-mini" style={{ marginTop: 8, fontFamily: "'Inter',sans-serif", letterSpacing: 0, fontSize: 11.5, textTransform: 'none', color: hf.ink3, lineHeight: 1.5 }}>
              Two more skips and Mobility becomes <strong style={{ color: hf.rust }}>mandatory</strong> on Day 4 of the streak.
            </p>
          </div>

          <div className="hf-row" style={{ marginTop: 24, gap: 10 }}>
            <button className="hf-btn ghost">Cancel — I'll do it</button>
            <div style={{ flex: 1 }}></div>
            <button className="hf-btn primary" style={{ background: hf.ember, borderColor: hf.ember }}>Submit reason &amp; skip</button>
          </div>
        </div>
      </div>
    </HfFrame>
  );
}

// ── 4. REWARD CALENDAR — six pre-committed rewards ────────────
function HfRewardCalendar() {
  const rewards = [
    { day: 15,  size: 'SMALL', name: 'New climbing chalk',     price: '£28',  status: 'claimed', date: '29 DEC' },
    { day: 30,  size: 'BIG',   name: 'Vinyl — Bowie · Low',    price: '£42',  status: 'qualifying', windowFill: 0.86, date: '13 JAN' },
    { day: 45,  size: 'SMALL', name: 'Espresso scales',        price: '£35',  status: 'pending', date: '28 JAN' },
    { day: 60,  size: 'BIG',   name: 'Mechanical keyboard',    price: '£189', status: 'pending', date: '12 FEB' },
    { day: 75,  size: 'SMALL', name: 'Cookbook — Tartine',     price: '£40',  status: 'pending', date: '27 FEB' },
    { day: 90,  size: 'BIG',   name: 'Weekend climbing trip',  price: '£280', status: 'pending', date: '14 MAR', finale: true },
  ];

  return (
    <HfFrame title="reward calendar" sub="06 REWARDS · 01 CLAIMED · 01 QUALIFYING">
      <div style={{ display: 'flex', height: '100%' }}>
        <HfRail active="vault" day={24} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <HfTop crumb="REWARD CALENDAR · RUN 01" sub="Six rewards. Locked at sign. No downgrades." status="Day 24 / 90" statusKind="ember" />
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>

            {/* Timeline */}
            <div className="hf-card-ink" style={{ padding: '28px 36px' }}>
              <span className="hf-eyebrow" style={{ color: '#9c9489' }}>The 90-day rail</span>
              <div style={{ marginTop: 26, position: 'relative', height: 100 }}>
                {/* base rail */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: 50, height: 2, background: '#3a342d' }}></div>
                {/* progress fill */}
                <div style={{ position: 'absolute', left: 0, top: 50, height: 2, width: `${24/90*100}%`, background: hf.ember }}></div>
                {/* now marker */}
                <div style={{ position: 'absolute', left: `${24/90*100}%`, top: 38, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="hf-mono" style={{ fontSize: 9, color: hf.emberL, letterSpacing: '.14em' }}>NOW · D24</span>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: hf.ember, border: `2px solid ${hf.ink}`, marginTop: 4 }}></div>
                </div>
                {/* reward markers */}
                {rewards.map((r, i) => {
                  const pct = (r.day / 90) * 100;
                  const isClaimed = r.status === 'claimed';
                  const isQual = r.status === 'qualifying';
                  return (
                    <div key={i} style={{ position: 'absolute', left: `${pct}%`, top: 44, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
                      <div style={{
                        width: r.size === 'BIG' ? 18 : 12,
                        height: r.size === 'BIG' ? 18 : 12,
                        borderRadius: r.size === 'BIG' ? 4 : 3,
                        background: isClaimed ? hf.ember : isQual ? hf.bone : 'transparent',
                        border: !isClaimed && !isQual ? `1.5px dashed #6b6259` : `1.5px solid ${isQual ? hf.ember : hf.ember}`,
                      }}></div>
                      <span className="hf-mono" style={{ fontSize: 9, color: '#9c9489', marginTop: 8, letterSpacing: '.1em' }}>D{r.day}</span>
                      <span className="hf-mini" style={{ color: isClaimed ? hf.emberL : hf.bone, fontSize: 9, marginTop: 2 }}>{r.size}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward cards */}
            <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {rewards.map((r, i) => (
                <div key={i} className="hf-card" style={{
                  padding: 0, overflow: 'hidden', position: 'relative',
                  borderColor: r.status === 'qualifying' ? hf.ember : hf.hair,
                  boxShadow: r.status === 'qualifying' ? '0 0 0 3px '+hf.emberBg : hf.shadowL,
                }}>
                  {/* image */}
                  <div className="hf-place" style={{ height: 130, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                    REWARD IMAGE · D{r.day}
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <div className="hf-row" style={{ gap: 8 }}>
                      <span className="hf-tag outline">DAY {r.day}</span>
                      <span className="hf-tag outline" style={{ color: hf.ink3, borderColor: hf.hair }}>{r.size}</span>
                      <div style={{ flex: 1 }}></div>
                      {r.status === 'claimed' && <span className="hf-tag" style={{ background: hf.moss }}>CLAIMED</span>}
                      {r.status === 'qualifying' && <span className="hf-tag ember">QUALIFYING</span>}
                      {r.finale && <span className="hf-tag">FINALE</span>}
                    </div>
                    <h3 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 22, lineHeight: 1.15, marginTop: 12, fontStyle: r.size === 'BIG' ? 'italic' : 'normal', color: hf.ink }}>{r.name}</h3>
                    <div className="hf-row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
                      <span className="hf-num" style={{ fontSize: 13, color: hf.ink2 }}>{r.price}</span>
                      <span className="hf-mini">UNLOCKS · {r.date}</span>
                    </div>
                    {r.status === 'qualifying' && (
                      <div style={{ marginTop: 14 }}>
                        <div className="hf-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="hf-mini">WINDOW · 13 / 15 DAYS</span>
                          <span className="hf-mono" style={{ fontSize: 11, color: hf.ember, fontWeight: 600 }}>2 to go</span>
                        </div>
                        <div className="hf-bar"><span style={{ width: '86%' }}></span></div>
                      </div>
                    )}
                    {r.status === 'claimed' && (
                      <p className="hf-mini" style={{ marginTop: 14, fontFamily: "'Inter',sans-serif", textTransform: 'none', letterSpacing: 0, fontSize: 11.5, color: hf.ink3, lineHeight: 1.5 }}>
                        Claimed Dec 29. Window 01 → 15 closed at 16/18 days.
                      </p>
                    )}
                    {r.status === 'pending' && (
                      <p className="hf-mini" style={{ marginTop: 14, fontFamily: "'Inter',sans-serif", textTransform: 'none', letterSpacing: 0, fontSize: 11.5, color: hf.ink3, lineHeight: 1.5 }}>
                        Window opens day {r.day - 17}. Need 15 of 18 qualifying days.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* contract reminder */}
            <div className="hf-card-flat" style={{ marginTop: 22, padding: '18px 24px' }}>
              <div className="hf-row" style={{ gap: 14 }}>
                <span className="hf-serif" style={{ fontSize: 24, fontStyle: 'italic', color: hf.ink3 }}>"</span>
                <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: 'italic', fontSize: 17, color: hf.ink2, lineHeight: 1.4, flex: 1, margin: 0 }}>
                  Rewards were chosen on Day 0 and locked at sign. They cannot be downgraded, swapped, or re-priced before Day 90.
                </p>
                <span className="hf-mini" style={{ alignSelf: 'flex-end' }}>SIGNED · 21 DEC 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HfFrame>
  );
}

// ── 5. LEVELS — 30-row alternating ladder ─────────────────────
function HfLevels() {
  // build 30 levels — odd tightens, even unlocks
  const tightenSamples = [
    'Water target +50ml',
    'Gym minimum +2 minutes',
    'Sleep window narrowed by 15 min',
    'Calorie target +50 kcal',
    'Protein target +5g',
    'Mobility minimum +1 minute',
    'Reading minimum +5 minutes',
    'Cold-shower minimum +15 sec',
    'Journal minimum +50 words',
    'LeetCode minimum +1 problem',
    'Walk target +500 steps',
    'Sleep window narrowed by 15 min',
    'Water target +50ml',
    'Mobility minimum +1 minute',
    'Reading minimum +5 minutes',
  ];
  const unlockSamples = [
    'Mobility · 10 min',
    'Tech reading · 20 min',
    'Cold shower · 60 sec',
    'Journaling · 200 words',
    'Walk · 8,000 steps',
    'Meditation · 5 min',
    'No sugar after 8pm',
    'No phone first 30 min',
    'Stretching · 5 min',
    'One-line gratitude',
    'Sunlight · 10 min before noon',
    'Read non-fiction',
    'Cook from scratch',
    'No social before 11am',
    'Plan tomorrow tonight',
  ];
  const levels = Array.from({ length: 30 }, (_, i) => {
    const n = i + 1;
    const tighten = n % 2 === 1;
    return {
      n,
      kind: tighten ? 'tighten' : 'unlock',
      effect: tighten ? tightenSamples[Math.floor(i/2)] : unlockSamples[Math.floor(i/2)],
      done: n <= 7,
      current: n === 7,
    };
  });

  return (
    <HfFrame title="levels" sub="LV 07 · 30-LEVEL LADDER">
      <div style={{ display: 'flex', height: '100%' }}>
        <HfRail active="levels" day={24} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <HfTop crumb="LEVELS · KAIZEN LADDER" sub="Odd tightens · Even unlocks · 3 qualifying days = 1 level" status="Lv 07 / 30" statusKind="ember" />
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
              {/* Hero */}
              <div className="hf-card-ink" style={{ padding: '32px 36px' }}>
                <span className="hf-eyebrow" style={{ color: '#9c9489' }}>CURRENT LEVEL</span>
                <div className="hf-row" style={{ alignItems: 'baseline', gap: 18, marginTop: 6 }}>
                  <span className="hf-num" style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, color: hf.bone, letterSpacing: '-.04em' }}>07</span>
                  <span className="hf-serif" style={{ fontSize: 22, fontStyle: 'italic', color: hf.emberL }}>of thirty</span>
                </div>
                <hr className="hf-divider" style={{ margin: '20px 0', background: '#3a342d' }} />
                <span className="hf-eyebrow" style={{ color: '#9c9489' }}>EFFECT · LEVEL 07 · TIGHTEN</span>
                <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 22, fontStyle: 'italic', color: hf.bone, marginTop: 10, lineHeight: 1.3 }}>
                  Reading minimum increased from 15 → 20 minutes.
                </p>
                <p className="hf-mini" style={{ color: '#9c9489', fontFamily: "'Inter',sans-serif", letterSpacing: 0, fontSize: 12, textTransform: 'none', marginTop: 10, lineHeight: 1.5 }}>
                  Each level applies a single small change. The system's power comes from accumulation, not from any single moment.
                </p>
                <hr className="hf-divider" style={{ margin: '24px 0', background: '#3a342d' }} />
                <span className="hf-eyebrow" style={{ color: '#9c9489' }}>NEXT — LV 08 · UNLOCK</span>
                <div className="hf-row" style={{ marginTop: 8, gap: 12 }}>
                  <span className="hf-num" style={{ fontSize: 28, fontWeight: 600, color: hf.bone }}>2 / 3</span>
                  <span style={{ color: '#9c9489', fontSize: 13, alignSelf: 'center' }}>qualifying days · 1 to go</span>
                </div>
                <div style={{ height: 6, background: '#3a342d', borderRadius: 99, marginTop: 12 }}>
                  <div style={{ height: '100%', width: '66%', background: hf.ember, borderRadius: 99 }}></div>
                </div>
              </div>

              {/* Effect summary */}
              <div className="hf-card" style={{ padding: '24px 26px' }}>
                <span className="hf-eyebrow">Stack so far · 7 effects active</span>
                <div style={{ marginTop: 14 }}>
                  {[
                    [1, 'tighten', 'Water +50ml · now 3.05L'],
                    [2, 'unlock',  'Mobility · 10 min added'],
                    [3, 'tighten', 'Gym +2 min · now 47 min'],
                    [4, 'unlock',  'Tech reading · 20 min added'],
                    [5, 'tighten', 'Sleep window −15 min · now 23:00'],
                    [6, 'unlock',  'Cold shower · 60 sec added'],
                    [7, 'tighten', 'Reading +5 min · now 20 min'],
                  ].map(([n, kind, e], i, arr) => (
                    <div key={i} className="hf-row" style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${hf.hair2}` : 'none', gap: 14 }}>
                      <span className="hf-serif" style={{ fontSize: 18, fontStyle: 'italic', color: hf.ember, width: 28 }}>{String(n).padStart(2,'0')}</span>
                      <span className={'hf-tag ' + (kind === 'tighten' ? 'outline' : '')} style={kind === 'unlock' ? { background: hf.ember } : {}}>{kind.toUpperCase()}</span>
                      <span style={{ flex: 1, fontSize: 13, color: hf.ink2 }}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ladder */}
            <div style={{ marginTop: 22 }}>
              <span className="hf-eyebrow">Full ladder · 30 levels</span>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, border: `1px solid ${hf.hair}`, borderRadius: 10, overflow: 'hidden', background: hf.card }}>
                {levels.map((l, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={l.n} style={{
                      padding: '12px 18px',
                      borderBottom: i < 28 ? `1px solid ${hf.hair2}` : 'none',
                      borderRight: isLeft ? `1px solid ${hf.hair2}` : 'none',
                      background: l.current ? hf.emberBg : l.done ? hf.bone : 'transparent',
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                      <span className="hf-serif" style={{
                        fontSize: 22, fontStyle: 'italic',
                        color: l.done ? hf.ink : hf.ink4,
                        width: 38,
                      }}>{String(l.n).padStart(2,'0')}</span>
                      <span className={'hf-tag ' + (l.kind === 'tighten' ? 'outline' : '')} style={{
                        background: l.kind === 'unlock' ? (l.done ? hf.ember : hf.hair) : 'transparent',
                        color: l.kind === 'unlock' ? (l.done ? '#fff' : hf.ink3) : (l.done ? hf.ink : hf.ink3),
                        borderColor: l.done ? hf.ink : hf.hair,
                        flexShrink: 0,
                      }}>{l.kind === 'tighten' ? 'TGHTN' : 'UNLCK'}</span>
                      <span style={{ flex: 1, fontSize: 12.5, color: l.done ? hf.ink2 : hf.ink4 }}>{l.effect}</span>
                      {l.current && <span className="hf-tag ember">YOU</span>}
                      {l.done && !l.current && <span className="hf-mini" style={{ color: hf.moss, fontWeight: 600 }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="hf-mini" style={{ marginTop: 18, fontFamily: "'Inter',sans-serif", textTransform: 'none', letterSpacing: 0, fontSize: 12, color: hf.ink3, lineHeight: 1.55 }}>
              A perfectly compliant user reaches Level 30 around Day 90. A realistic user lands around Level 22–25.
            </p>
          </div>
        </div>
      </div>
    </HfFrame>
  );
}

Object.assign(window, { HfReasoning, HfRewardCalendar, HfLevels });
