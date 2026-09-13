// 第259便d(第51報 W4)「条件不一致 8 行の kFrame=0 対照走行」+「💫 の f=1 対照」。
//
// ■ 何を直すのか(第258便d ④ の続き)
//   obsCard の行が「**kFrame=0 対照**」と明記しているのに、割り当てられていた測定値は
//   **kFrame=1 の走行**のものだった行が 8 つある(🟠 木星衛星 4・🌇 金星・🥔 火星衛星の対照差・
//   ❄️ 冥王星/カロン・🌊 海王星)。プリセットの physics は 1 つなので、1 回の走行から 2 つの条件の
//   行へ同じ数値が配られていた。**数値が間違っていたのではなく、行の割り当てが間違っていた。**
//   第258便d はこれを `条`(condition-mismatch)へ隔離しただけで、**対照条件の走行は行っていない**。
//   本器がその走行を行う —— `physics.kFrame` **1 鍵だけ**を 0 にした**診断コピー**である。
//
// ■ 触らないもの(先に宣言する)
//   ・`beta/index.html` は**読むだけ**である。プリセット JSON を 1 bit も書き換えない
//     (⚡🧮🩺🧶❄️💫 を含め、本体の宣言は 1 bit も動かさない)。
//   ・走らせるのは `HP.validatePreset` を通した診断コピーで、変えるのは
//     **kFrame(全例)**と、💫 の f=1 対照でだけ **bodies[].m を宣言 f で割った値**である。
//   ・エンジンに opt-in を足していない。
//
// ■ 自己検証(これが無いと「測れた」と言えない)
//   同じ器で **kFrame=1(= プリセットの宣言どおり)**も走らせ、棚卸し(第258便d)が記録した
//   kFrame=1 の残差を**再現すること**を確認する。再現しなければ、器の側が違っているということである。
//
// ■ 判定の読み方
//   ここで出る残差は **dt=0.016 の 1 段**であって、棚卸しの門(dt 3 段+正の観測次数+3σ+ε_num)の
//   判定ではない。太陽系 19 本は**そもそも σ が門に 1 本も繋がっていない**ので、
//   ここで言えるのは「**行が要求する条件で測り直せたか**」と「その条件での残差はいくつか」だけである。
//   **「条件一致に戻った」は「合った」ではない。**
//
// 実行: node tests/exp-w259d-kf0.mjs [--fast] [--only id1,id2]
// 出力: tests/out/kf0-w259d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'kf0-w259d.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const ONLY = (() => { const i = argv.indexOf('--only'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();
const DT = 0.016;                       // アプリ既定(棚卸しと同じ)
const MAX_STEPS = FAST ? 6e5 : 1.2e7;   // 1 走行の上限步数(窓が埋まらなければ「未測定」と書く)
const BUDGET_MS = Number(process.env.W259D_BUDGET_MS || 120000);   // 1 走行の時間予算

// ---------------------------------------------------------------- 条件不一致 8 行の対象宣言
// 中心・周回体の **body index** は棚卸し(tests/exp-w249b-calaudit.mjs の CFG)と同じ宣言を使う。
// `row` は obsCard の q 欄の**先頭一致**で引く(観測値は obsCard の obs 欄から機械的に読む —
// この器に観測数値を 1 つも書かない)。
const CASES = [
  { id: 'jupiterGalilean', emoji: '🟠', c: 0, nRev: 2,
    row: '恒星公転周期(イオ/エウロパ/ガニメデ/カリスト・kFrame=0 転写)',
    targets: [[1, 'イオ'], [2, 'エウロパ'], [3, 'ガニメデ'], [4, 'カリスト']],
    unit: 'day', kind: 'period', rows: 4 },
  { id: 'venusReal', emoji: '🌇', c: 0, nRev: 2,
    row: '公転周期(kFrame=0 対照)',
    targets: [[1, '金星']], unit: 'day', kind: 'period', rows: 1 },
  { id: 'marsMoonsReal', emoji: '🥔', c: 0, nRev: 2,
    row: 'kFrame=0 対照との周期差',
    targets: [[1, 'フォボス'], [2, 'ダイモス']], unit: 'day', kind: 'periodDiff', rows: 1 },
  { id: 'plutoCharonReal', emoji: '❄️', c: 0, nRev: 2,
    row: '公転周期(kFrame=0 対照・同方向1周)',
    targets: [[1, 'カロン']], unit: 'day', kind: 'period', rows: 1 },
  { id: 'neptuneReal', emoji: '🌊', c: 0, nRev: 2,
    row: '公転周期(kFrame=0 対照)',
    targets: [[1, 'トリトン']], unit: 'day', kind: 'period', rows: 1 },
];
// 💫 の f=1 対照(第259便d ⑧)。**観測質量そのもの**(宣言 f で割り戻した質量)で kFrame=0 を走らせる。
// 「補正質量を維持すると kFrame=0 でも 3.61σ」という言い方が正しいかを、f=1 の走行と並べて確かめる。
const SIRIUS = { id: 'siriusABDFM', emoji: '💫', c: 0, o: 1, nRev: 3,
  obsKey: 'Sirius B|orbital_period', baseline: { id: 'siriusAB', emoji: '🌟' } };

// 観測 σ は CSV(paper/data/solar-observations.csv)が正本。
function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;
    const sg = (cols[8] !== undefined && cols[8].trim() !== '') ? Number(cols[8]) : null;
    m.set(key, { value: Number(cols[2]), unit: cols[3], source: String(cols[4]).slice(0, 90),
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return m;
}
const OBS = loadObs();
// obsCard の文字列から数値列を取り出す(「1.769138 / 3.551181 / 7.154553 / 16.689017 日」→ 4 つ)
function numbersIn(s) {
  const m = String(s || '').match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g);
  return m ? m.map(Number) : [];
}

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

await pg.evaluate(() => {
  // physics の 1〜2 鍵だけを差し替えた診断コピーを組み、同方向 1 周の周期を測る。
  window.__w259d = (id, over, massDiv, ci, targets, dt, maxSteps, nRev, budgetMs) => {
    const p0 = HP.allPresets().find((q) => q.id === id);
    const p = JSON.parse(JSON.stringify(p0));
    for (const k of Object.keys(over || {})) p.physics[k] = over[k];
    if (massDiv && massDiv !== 1) for (const b of p.bodies) if (typeof b.m === 'number') b.m = b.m / massDiv;
    const v = HP.validatePreset(p);
    HP.sim.build(v.preset);
    const S = HP.sim;
    const st = targets.map(([oi]) => ({ oi, ang: 0,
      prev: Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]), rev: [],
      rMin: Infinity, rMax: -Infinity }));
    const held = targets.map(([oi]) => S.m[oi]);
    const t0 = performance.now();
    let k = 0, stopped = 'revolutions';
    for (; k < maxSteps; k++) {
      S.step(dt);
      let done = true;
      for (const z of st) {
        if (z.rev.length >= nRev) continue;
        done = false;
        const dx = S.x[z.oi] - S.x[ci], dy = S.y[z.oi] - S.y[ci];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        if (!z.rev.length) { if (rr < z.rMin) z.rMin = rr; if (rr > z.rMax) z.rMax = rr; }
        let d = th - z.prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const before = z.ang; z.ang += d; z.prev = th;
        const n0 = Math.floor(Math.abs(before) / (2 * Math.PI)), n1 = Math.floor(Math.abs(z.ang) / (2 * Math.PI));
        if (n1 > n0) {
          const tgt = Math.sign(z.ang) * n1 * 2 * Math.PI;
          const fr = (z.ang !== before) ? (tgt - before) / (z.ang - before) : 0;
          z.rev.push((k - 1 + fr) * dt);
        }
      }
      if (done) break;
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 4095) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    return { steps: k, stopped, nan: S.hasNaN(), heldMass: held,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      targets: st.map((z, i) => ({ label: targets[i][1], oi: z.oi,
        revT: z.rev.slice(),
        revP: z.rev.map((t, j) => (j ? t - z.rev[j - 1] : t)),
        eProxy1: (z.rMax + z.rMin > 0 && z.rMax > 0) ? (z.rMax - z.rMin) / (z.rMax + z.rMin) : null })),
      warnings: v.warnings || [] };
  };
  window.__w259decl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { physics: p.physics, scaleExp: p.scaleExp, obsCard: p.obsCard || [],
      massCalibration: p.massCalibration || null,
      bodies: (p.bodies || []).map((b) => ({ m: b.m })) };
  };
});

const out = { meta: {
  wave: '第259便d', target: TARGET, dt: DT, maxSteps: MAX_STEPS, budgetMs: BUDGET_MS,
  touched: '**プリセット JSON は 1 bit も書き換えていない**。走らせるのは `physics.kFrame` の'
    + '1 鍵(💫 の f=1 対照でだけ bodies[].m も宣言 f で割り戻す)を差し替えた診断コピーである。',
  gateNote: '**dt=0.016 の 1 段**なので門の判定ではない。太陽系 19 本は σ が門に 1 本も繋がっていないので、'
    + 'ここで言えるのは「行が要求する条件で測り直せたか」と「その条件での残差」だけである。'
    + '**「条件一致に戻った」は「合った」ではない。**',
  selfCheck: '同じ器で kFrame=1(宣言どおり)も走らせ、棚卸しが記録した kFrame=1 の残差を再現することを確認する。',
}, rows: [], sirius: null, pageErrors: [] };

for (const C of CASES) {
  if (ONLY && !ONLY.includes(C.id)) continue;
  const decl = await pg.evaluate((id) => window.__w259decl(id), C.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const card = decl.obsCard.find((r) => String(r.q).startsWith(C.row.slice(0, 12))) || null;
  // 観測値は obsCard の obs 欄(「同上」なら 1 つ前の行)を読む
  let obsText = card ? String(card.obs) : '';
  if (/^同上/.test(obsText)) {
    const i = decl.obsCard.indexOf(card);
    for (let j = i - 1; j >= 0; j--) { const t = String(decl.obsCard[j].obs);
      if (!/^同上/.test(t) && numbersIn(t).length) { obsText = t; break; } }
  }
  const obsDays = numbersIn(obsText);
  const declaredKF = Number(decl.physics.kFrame);
  const run = async (kFrame) => pg.evaluate(({ id, kFrame, ci, targets, dt, maxSteps, nRev, budgetMs }) =>
    window.__w259d(id, { kFrame }, 1, ci, targets, dt, maxSteps, nRev, budgetMs),
  { id: C.id, kFrame, ci: C.c, targets: C.targets, dt: DT, maxSteps: MAX_STEPS, nRev: C.nRev, budgetMs: BUDGET_MS });
  const r1 = await run(declaredKF);      // 宣言どおり(= 棚卸しが走らせた条件)
  const r0 = await run(0);               // **行が要求している条件**
  // **判定に採るのは 2 周目**である。棚卸し(第258便d)が「同方向 1 周」として記録した値は
  // 2 周目の周回時間で、1 周目は初期位相の取り方が残る(⚡✴️💫 の器も 2 周目を採っている)。
  // 本器は kFrame=1 の 2 周目が棚卸しの記録と一致することで、その一致を確認する(自己検証)。
  const per = (r, i, rev) => { const z = r.targets[i]; return (z.revP.length > rev) ? z.revP[rev] * toSec / 86400 : null; };
  const rows = [];
  if (C.kind === 'period') {
    for (let i = 0; i < C.targets.length; i++) {
      const o = obsDays[i];
      const p1 = per(r1, i, 1), p0 = per(r0, i, 1);           // 2 周目(判定)
      const p1a = per(r1, i, 0), p0a = per(r0, i, 0);          // 1 周目(別欄)
      rows.push({ label: C.targets[i][1], obsDay: o,
        kf1Day: p1, kf1ResidPct: (p1 !== null && o) ? (p1 - o) / o * 100 : null,
        kf0Day: p0, kf0ResidPct: (p0 !== null && o) ? (p0 - o) / o * 100 : null,
        kf1Day1st: p1a, kf0Day1st: p0a,
        kf1Resid1stPct: (p1a !== null && o) ? (p1a - o) / o * 100 : null,
        kf0Resid1stPct: (p0a !== null && o) ? (p0a - o) / o * 100 : null });
    }
  } else {   // 🥔: 「kFrame=0 対照との周期差」は**両対象を同条件で**測って差を出す
    for (let i = 0; i < C.targets.length; i++) {
      const p1 = per(r1, i, 1), p0 = per(r0, i, 1), o = obsDays[i];
      const p1a = per(r1, i, 0), p0a = per(r0, i, 0);
      rows.push({ label: C.targets[i][1], obsDay: Number.isFinite(o) ? o : null,
        kf1Day: p1, kf0Day: p0, kf1Day1st: p1a, kf0Day1st: p0a,
        diffPct: (p1 !== null && p0) ? (p1 - p0) / p0 * 100 : null,
        diff1stPct: (p1a !== null && p0a) ? (p1a - p0a) / p0a * 100 : null,
        kf1ResidPct: (p1 !== null && o) ? (p1 - o) / o * 100 : null,
        kf0ResidPct: (p0 !== null && o) ? (p0 - o) / o * 100 : null });
    }
  }
  out.rows.push({ id: C.id, emoji: C.emoji, row: C.row, kind: C.kind, obsCardRow: card,
    obsText, obsDays, declaredKFrame: declaredKF, toSec,
    run: { kf1: { steps: r1.steps, stopped: r1.stopped, nan: r1.nan, clamp: r1.clamp },
      kf0: { steps: r0.steps, stopped: r0.stopped, nan: r0.nan, clamp: r0.clamp } },
    massUnchanged: r1.heldMass.every((m, i) => m === r0.heldMass[i]),
    rows });
  console.error(`  ${C.emoji} ${C.id}  ${C.row}`);
  for (const z of rows) console.error(`    ${z.label}: 観測 ${z.obsDay === null ? '—' : z.obsDay} 日`
    + ` / kFrame=1 ${z.kf1Day === null ? '—' : z.kf1Day.toFixed(6)}`
    + `(${z.kf1ResidPct === null ? '—' : (z.kf1ResidPct >= 0 ? '+' : '') + z.kf1ResidPct.toFixed(4) + '%'})`
    + ` / **kFrame=0 ${z.kf0Day === null ? '—' : z.kf0Day.toFixed(6)}`
    + `(${z.kf0ResidPct === null ? '—' : (z.kf0ResidPct >= 0 ? '+' : '') + z.kf0ResidPct.toFixed(4) + '%'})**`
    + (z.diffPct !== undefined ? ` / 差 ${z.diffPct === null ? '—' : z.diffPct.toFixed(5) + '%'}` : ''));
}

// ---------------------------------------------------------------- 💫 の f=1 対照(第259便d ⑧)
if (!ONLY || ONLY.includes(SIRIUS.id)) {
  const decl = await pg.evaluate((id) => window.__w259decl(id), SIRIUS.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const obsRow = OBS.get(SIRIUS.obsKey) || null;
  const obs = obsRow ? obsRow.value : null, sigma = obsRow ? obsRow.sigma : null;
  const f = decl.massCalibration ? Number(decl.massCalibration.factor) : 1;
  const runS = async (kFrame, massDiv) => {
    const r = await pg.evaluate(({ id, kFrame, massDiv, ci, targets, dt, maxSteps, nRev, budgetMs }) =>
      window.__w259d(id, { kFrame }, massDiv, ci, targets, dt, maxSteps, nRev, budgetMs),
    { id: SIRIUS.id, kFrame, massDiv, ci: SIRIUS.c, targets: [[SIRIUS.o, 'B']], dt: DT,
      maxSteps: MAX_STEPS, nRev: SIRIUS.nRev, budgetMs: BUDGET_MS });
    const z = r.targets[0];
    const p2 = (z.revP.length >= 2) ? z.revP[1] * toSec : null;
    return { kFrame, massDiv, steps: r.steps, stopped: r.stopped, nan: r.nan, clamp: r.clamp,
      heldMassB: r.heldMass[0], period2Sec: p2,
      residualPct: (p2 !== null && obs) ? (p2 - obs) / Math.abs(obs) * 100 : null,
      nSigma: (p2 !== null && obs !== null && sigma) ? Math.abs(p2 - obs) / sigma : null };
  };
  const kf0f = await runS(0, 1);        // 補正質量 f を維持したまま kFrame=0(= 第258便d の 3.61σ)
  const kf0f1 = await runS(0, f);       // **f=1(観測質量そのもの)+ kFrame=0**
  const kf1f1 = await runS(1, f);       // f=1 + kFrame=1(参考 — 引きずりだけの寄与を分ける)
  out.sirius = { id: SIRIUS.id, emoji: SIRIUS.emoji, declaredFactor: f,
    obs: { key: SIRIUS.obsKey, value: obs, sigma, source: obsRow ? obsRow.source : null,
      sigmaRelPct: (obs && sigma) ? 100 * sigma / Math.abs(obs) : null },
    kFrame0_withF: kf0f, kFrame0_f1: kf0f1, kFrame1_f1: kf1f1,
    note: '**観測質量そのものが失敗したとは書けない**。第258便d が測ったのは「補正質量 f='
      + (f ? f.toPrecision(7) : '—') + ' を維持したまま kFrame=0 にすると 3.61σ」であって、'
      + '観測質量(f=1)で走らせた対照はその時点で存在しなかった。本器はその 1 行を足す。'
      + '**dt=0.016 の 1 段なので門の判定ではない。**' };
  console.error(`  ${SIRIUS.emoji} f 維持・kFrame=0: ${kf0f.nSigma === null ? '—' : kf0f.nSigma.toFixed(2)}σ`
    + ` / **f=1・kFrame=0: ${kf0f1.nSigma === null ? '—' : kf0f1.nSigma.toFixed(2)}σ**`
    + ` / f=1・kFrame=1: ${kf1f1.nSigma === null ? '—' : kf1f1.nSigma.toFixed(2)}σ`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w259d] wrote ' + OUT);
