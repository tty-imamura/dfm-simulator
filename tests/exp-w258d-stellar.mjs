// 第258便d(第50報 W4)「✴️💫 の周期残差の感度」——
//   3 審査 v16 の一致点:「現実較正 40 本のうち**厳密不合格は 2 本**(✴️ α Cen AB DFM 25.95σ・
//   💫 Sirius AB DFM 210.3σ)。否決の場合は**足りない要素を提示する**」(第50報 原仮定者指示)。
//
// ■ 何を測るか(1 つだけ)
//   **観測質量のまま**(プリセットの bodies を 1 bit も変えない)、`kFrame` と `D0pull` だけを
//   動かしたとき、**2 周目の公転周期の残差が σ で何倍になるか**。
//   「足りない要素」を**数**で言うためである —— kFrame をいくつまで下げれば 3σ に入るのか、
//   入らないのか。入るなら、それは「何が足りないか」の答えの一部になる。
//
// ■ 触らないもの(先に宣言する)
//   ・`beta/index.html` は**読むだけ**である(この器はプリセット JSON を 1 bit も書き換えない)。
//   ・走らせるのは **`HP.validatePreset` に通した診断コピー**で、変えるのは
//     `physics.kFrame` と `physics.D0pull` の**2 つの数だけ**である(質量・幾何・その他の physics は不変)。
//   ・**エンジンに opt-in を足していない**。下の「χ ゲート」も**この器の中だけ**の計算である
//     (χ が小さいときに kFrame を 0 に落とす、という外部提案を、器の中で試して数を出す)。
//
// ■ 判定の読み方
//   ここで出る σ は **dt=0.016 の 1 段**の残差であって、棚卸し(tests/exp-w249b-calaudit.mjs)の
//   門が要求する「dt 3 段+正の観測次数」を満たしていない。したがって**門の判定ではない**。
//   比較の基準は、棚卸しが同じ dt で出した ✴️ 25.95σ・💫 210.3σ である(同じ dt・同じ検出器・
//   同じ量なので、**この器の kFrame=1・D0pull 等倍の欄はその値を再現するはずである** — 再現を確認する)。
//
// 実行: node tests/exp-w258d-stellar.mjs [--fast]
// 出力: tests/out/stellar-w258d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'stellar-w258d.json');
const FAST = process.argv.includes('--fast');
const DT = 0.016;                 // アプリ既定(棚卸しと同じ)
const KF = [0, 0.1, 0.5, 1];      // kFrame 4 段
const D0MUL = [0.1, 1, 10];       // D0pull 3 段(既定値に対する倍率)
const CHI_GATE = 1e-3;            // 外部提案の「χ<1e−3 なら kFrame→0」— **器の中だけ**で試す

// 観測は CSV(paper/data/solar-observations.csv)が正本。この器に観測数値は 1 つも書かない。
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
const CASES = [
  { id: 'alphaCenABDFM', emoji: '✴️', obsKey: 'Alpha Centauri B|orbital_period',
    baseline: { emoji: '✨', id: 'alphaCenAB' } },
  { id: 'siriusABDFM', emoji: '💫', obsKey: 'Sirius B|orbital_period',
    baseline: { emoji: '🌟', id: 'siriusAB' } },
];

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ページ側: physics の 2 鍵だけを差し替えた**診断コピー**を組んで、2 周目の周期を測る。
await pg.evaluate(() => {
  window.__w258d = (id, over, dt, maxSteps, nRev) => {
    const p0 = HP.allPresets().find((q) => q.id === id);
    const p = JSON.parse(JSON.stringify(p0));
    for (const k of Object.keys(over || {})) p.physics[k] = over[k];
    const v = HP.validatePreset(p);
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    // 質量が 1 bit も動いていないことを、走行のたびに確認する(この器の前提そのもの)
    const held = [S.m[0], S.m[1]];
    let ang = 0, prev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]);
    const rev = [];
    let rMin = Infinity, rMax = -Infinity, k = 0;
    for (; k < maxSteps && rev.length < nRev; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      if (!rev.length) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      let d = th - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const before = ang; ang += d; prev = th;
      const n0 = Math.floor(Math.abs(before) / (2 * Math.PI)), n1 = Math.floor(Math.abs(ang) / (2 * Math.PI));
      if (n1 > n0) {
        const tgt = Math.sign(ang) * n1 * 2 * Math.PI;
        const fr = (ang !== before) ? (tgt - before) / (ang - before) : 0;
        rev.push((k - 1 + fr) * dt);
      }
      if (S.hasNaN()) break;
    }
    const revP = []; for (let i = 0; i < rev.length; i++) revP.push(i ? rev[i] - rev[i - 1] : rev[0]);
    return { steps: k, revN: rev.length, revP, heldMass: held,
      eProxy1: (rMax + rMin > 0 && rMax > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      nan: S.hasNaN(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      warnings: v.warnings || [] };
  };
  window.__w258decl = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { physics: p.physics, scaleExp: p.scaleExp, massCalibration: p.massCalibration || null,
      bodies: (p.bodies || []).map((b) => ({ m: b.m })) };
  };
});

const out = { meta: {
  wave: '第258便d', target: TARGET, dt: DT, kFrame: KF, d0pullMultipliers: D0MUL, chiGate: CHI_GATE,
  touched: '**プリセット JSON は 1 bit も書き換えていない**。走らせるのは physics.kFrame と '
    + 'physics.D0pull の 2 鍵だけを差し替えた診断コピーである(質量・幾何・他の physics は不変)。'
    + '**エンジンに opt-in は足していない** —— χ ゲートもこの器の中だけの計算である。',
  gateNote: 'ここで出る σ は **dt=0.016 の 1 段**の残差であって、棚卸しの門(dt 3 段+正の観測次数+'
    + '3σ+ε_num)の判定ではない。同じ dt・同じ量なので、kFrame=1・D0pull 等倍の欄は'
    + '棚卸しの値(✴️ 25.95σ・💫 210.3σ)を再現するはずである(再現を確認する)。',
  chiGateNote: 'χ ゲート(χ<1e−3 なら kFrame→0)は**外部提案を器の中で試しただけ**である。'
    + 'エンジンの opt-in ではない。χ は preset の massCalibration.chi 宣言(pull 重み下の局所場分率)を読む。',
}, cases: [], pageErrors: [] };

for (const C of CASES) {
  const decl = await pg.evaluate((id) => window.__w258decl(id), C.id);
  const toSec = Math.pow(10, Number(decl.scaleExp.T));
  const obsRow = OBS.get(C.obsKey) || null;
  const obs = obsRow ? obsRow.value : null, sigma = obsRow ? obsRow.sigma : null;
  const d0base = Number(decl.physics.D0pull);
  const chi = (decl.massCalibration && Array.isArray(decl.massCalibration.chi))
    ? decl.massCalibration.chi.map(Number) : null;
  const chiMax = chi ? Math.max(...chi) : null;
  // 2 周目が取れれば十分なので 3 周で打ち切る(棚卸しは 60 周・ここは感度だけを見る)
  const nRev = 3, maxSteps = FAST ? 4e5 : 3e6;
  const run = async (kFrame, d0mul) => {
    const r = await pg.evaluate(({ id, kFrame, d0pull, dt, maxSteps, nRev }) =>
      window.__w258d(id, { kFrame, D0pull: d0pull }, dt, maxSteps, nRev),
    { id: C.id, kFrame, d0pull: d0base * d0mul, dt: DT, maxSteps, nRev });
    const p2 = (r.revP.length >= 2) ? r.revP[1] * toSec : null;
    const resid = (p2 !== null && obs) ? (p2 - obs) / Math.abs(obs) * 100 : null;
    const nSigma = (p2 !== null && obs !== null && sigma) ? Math.abs(p2 - obs) / sigma : null;
    return { kFrame, d0pullMul: d0mul, d0pull: d0base * d0mul, steps: r.steps, revN: r.revN,
      period2Sec: p2, residualPct: resid, nSigma, within3Sigma: (nSigma !== null) ? nSigma <= 3 : null,
      eProxy1: r.eProxy1, nan: r.nan, clamp: r.clamp,
      heldMassUnchanged: (r.heldMass[0] === Math.fround(decl.bodies[0].m)
        && r.heldMass[1] === Math.fround(decl.bodies[1].m)) };
  };
  const grid = [];
  for (const kf of KF) for (const mul of D0MUL) {
    const r = await run(kf, mul);
    grid.push(r);
    console.error(`  ${C.emoji} ${C.id} kFrame=${kf} D0pull×${mul}`
      + ` → 2周目 ${r.period2Sec === null ? '—' : r.period2Sec.toPrecision(10)} s`
      + ` 残差 ${r.residualPct === null ? '—' : r.residualPct.toFixed(5)}%`
      + ` = ${r.nSigma === null ? '—' : r.nSigma.toFixed(2)}σ ${r.within3Sigma ? '(3σ 内)' : ''}`);
  }
  // ---- kFrame の**しきい値**を挟み撃ちで求める(D0pull は既定倍率のまま)
  // 「いくつまで下げれば 3σ に入るか」を**数**で言うため。入らないなら「入らない」と書く。
  let threshold = null;
  {
    const at = grid.filter((g) => g.d0pullMul === 1).sort((a, b) => a.kFrame - b.kFrame);
    const inside = at.filter((g) => g.within3Sigma === true);
    const outside = at.filter((g) => g.within3Sigma === false);
    if (inside.length && outside.length) {
      let lo = Math.max(...inside.map((g) => g.kFrame));   // 3σ に入る側の上端
      let hi = Math.min(...outside.filter((g) => g.kFrame > lo).map((g) => g.kFrame));
      const probes = [];
      for (let i = 0; i < 10; i++) {
        const mid = 0.5 * (lo + hi);
        const r = await run(mid, 1);
        probes.push({ kFrame: mid, nSigma: r.nSigma, within3Sigma: r.within3Sigma });
        if (r.within3Sigma) lo = mid; else hi = mid;
      }
      threshold = { bracketLo: lo, bracketHi: hi, probes,
        note: `**kFrame ≤ ${lo.toPrecision(4)} なら 3σ の内側・kFrame ≥ ${hi.toPrecision(4)} なら外側**`
          + '(D0pull は既定のまま・観測質量のまま・dt=0.016 の 1 段)。'
          + 'これは**門の判定ではない**(3 段の収束条件を満たしていない)' };
    } else {
      threshold = { bracketLo: null, bracketHi: null, probes: [],
        note: inside.length ? '**掃いた 4 段すべてで 3σ の内側**(しきい値は 4 段の外にある)'
          : '**掃いた 4 段すべてで 3σ の外側** —— kFrame を 0 まで下げても 3σ に入らない' };
    }
  }
  // ---- χ ゲート(外部提案を器の中でだけ試す)
  const gateOn = (chiMax !== null && chiMax < CHI_GATE);
  const gated = await run(gateOn ? 0 : 1, 1);
  out.cases.push({ id: C.id, emoji: C.emoji, baseline: C.baseline,
    obs: { key: C.obsKey, value: obs, sigma, source: obsRow ? obsRow.source : null,
      sigmaRelPct: (obs && sigma) ? 100 * sigma / Math.abs(obs) : null },
    declared: { kFrame: Number(decl.physics.kFrame), D0pull: d0base,
      frameWeight: decl.physics.frameWeight || null, q: Number(decl.physics.q),
      massCalFactor: decl.massCalibration ? decl.massCalibration.factor : null,
      chi, chiMax, toSec },
    grid, threshold,
    chiGate: { proposal: 'χ<' + CHI_GATE + ' なら kFrame→0(外部提案)', chiMax, applied: gateOn,
      effectiveKFrame: gateOn ? 0 : 1, result: gated,
      verdict: (gated.within3Sigma === true) ? '**3σ の内側に入る**' : '**3σ の外側のまま**',
      note: '**器の中だけの計算である** —— エンジンに opt-in を足していない。'
        + 'χ は preset の massCalibration.chi 宣言(pull 重み下の局所場分率)を読んだ値で、'
        + 'この 2 系ではどちらも 10⁻⁴ 級なので、ゲートは kFrame=0 と同じ走行に帰着する。'
        + '**したがってこのゲートは「引きずりを消す」宣言であって、引きずりの改良ではない**' },
  });
}

out.pageErrors = pageErrors;
await browser.close();

// ---- 「足りない要素」の要約(実測から機械的に作る)
out.summary = {
  note: '**足りない要素**を数で言うための欄である。ここに書いてあるのは実測だけで、'
    + '「合った」も「解決した」も含まない。',
  rows: out.cases.map((c) => {
    const base = c.grid.find((g) => g.kFrame === 1 && g.d0pullMul === 1) || null;
    const kf0 = c.grid.find((g) => g.kFrame === 0 && g.d0pullMul === 1) || null;
    const d0hi = c.grid.find((g) => g.kFrame === 1 && g.d0pullMul === 10) || null;
    const d0lo = c.grid.find((g) => g.kFrame === 1 && g.d0pullMul === 0.1) || null;
    return { id: c.id, emoji: c.emoji,
      nSigmaAtDeclared: base ? base.nSigma : null,
      nSigmaAtKFrame0: kf0 ? kf0.nSigma : null,
      nSigmaAtD0x10: d0hi ? d0hi.nSigma : null,
      nSigmaAtD0x01: d0lo ? d0lo.nSigma : null,
      threshold: c.threshold ? { lo: c.threshold.bracketLo, hi: c.threshold.bracketHi } : null,
      chiGateEntersGate: c.chiGate ? (c.chiGate.result.within3Sigma === true) : null };
  }),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w258d] wrote ' + OUT);
for (const s of out.summary.rows) console.error(`  ${s.emoji} 宣言値 ${s.nSigmaAtDeclared === null ? '—' : s.nSigmaAtDeclared.toFixed(2)}σ`
  + ` / kFrame=0 ${s.nSigmaAtKFrame0 === null ? '—' : s.nSigmaAtKFrame0.toFixed(2)}σ`
  + ` / D0pull×10 ${s.nSigmaAtD0x10 === null ? '—' : s.nSigmaAtD0x10.toFixed(2)}σ`
  + ` / D0pull×0.1 ${s.nSigmaAtD0x01 === null ? '—' : s.nSigmaAtD0x01.toFixed(2)}σ`
  + ` / しきい値 ${s.threshold && s.threshold.lo !== null ? s.threshold.lo.toPrecision(4) + '〜' + s.threshold.hi.toPrecision(4) : '(掃いた範囲の外)'}`);
