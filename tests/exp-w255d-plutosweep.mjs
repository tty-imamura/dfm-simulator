// 第255便d(第47報 N6d)「❄️ plutoCharonReal の周期超過 +0.246% はどのチャネル/どの分離で動くか」。
//
// 第254便d ⑩ が「χ=W/(D₀+W)≈0.92 の近接連星では引きずりが薄まらない」という**因果説明を撤回**した
// 結果、**超過の起源は未同定**のまま残った(χ が最小の ❄️ で超過が最大・χ 最大の 🌇 で最小 = 向きが逆)。
// 第47報 3 審査 v13 (d) は、χ 因果の代わりに **kFrame 成分別(並進/スピン双極子)と分離の掃引**で
// 起源を切り分けることを求めた(合成系は作らない・D₀ と分離と質量比を同時 fit しない)。
// 本ハーネスは**診断だけ**を行う。**プリセットは 1 bit も変えない**(宣言の差し替えは一時コピー上)。
//
// ■ 3 つの掃引(すべて同じ初期条件・同じ単位・同じ検出器)
//   (i)  チャネル別 A/B —— u_n = Σ_j w_j·(g_T·v_j + ω_j·ẑ×(x−x_j)) の 2 項を片方ずつ落とす。
//        ・**スピン双極子チャネル 0**: 両体の `spin` を 0 にする(ω_j 項が消える。他は不変)。
//        ・**並進チャネルの減衰**: `physics.qTrans` を宣言して g_T=(R/(R+h))^qT を距離で落とす
//          (未宣言は g_T=1 = 既定経路)。qT を上げるほど並進項だけが薄くなる。
//        いずれも**既にある opt-in 宣言**であって、新しい力は 1 つも足していない。
//   (ii) 初期分離 3 段 —— **固定するもの: 2 体の質量・G・離心率 0・初速則(円軌道ケプラー速度を
//        重心系へ配分)**。動かすのは分離 d だけ(×0.5 / ×1 / ×2)。角運動量と周期は d の従属量で、
//        **fit はしない**(D₀・分離・質量比を同時に動かさない — 第47報の指定)。
//   (iii)**共通ブースト(絶対速度依存)** —— 第252便a の `compactForce.velocityFrame:"pair"` が
//        案K で切り分けた「絶対速度か対相対速度か」を、compactForce を**持たない** ❄️ では
//        両体への**共通速度 V の付加**で測る(Grok 気付き 6「重心歩行(D₀ 開放系)」の疑い)。
//        u の分母には D₀(動かない背景持ち分)が入るので、絶対速度が効くなら V で超過が動く。
//        **本体の切替ではない**(velocityFrame は ❄️ には存在しない宣言である — それ自体が記録)。
//
// 判定は出さない。**起源が同定できなければ「未同定」とそのまま書く。**
//
// 実行: node tests/exp-w255d-plutosweep.mjs [--chan] [--sep] [--boost] [--fast]
// 出力: tests/out/plutosweep-w255.json(数値は docs/PHYSICS.md〔第255便d〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'plutosweep-w255.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => only.length ? only.includes(k) : true;

const ID = 'plutoCharonReal';
const DT0 = 0.016;                 // アプリ既定
const TUNIT = 100;                 // scaleExp T=2 → 1 単位 = 10² s
const P_OBS_DAYS = 6.3872;         // 転写(NSSDC Pluto Fact Sheet)
const P_OBS_U = P_OBS_DAYS * 86400 / TUNIT;
const NREV = FAST ? 1 : 3;         // 同方向 1 周を NREV 回まで測る(カードは 1 周目)

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

await pg.evaluate(() => {
  const W = (window.__w255p = {});
  W.clone = (id) => JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
  // 同方向 1 周(相対角の 2π 交差)を nRev 回測る。重心歩行・帳簿も同じ走行から取る。
  W.rev = (pd, dt, nRev, tMax) => {
    const v = HP.validatePreset(pd);
    const S = HP.sim; S.build(v.preset);
    const steps = Math.round(tMax / dt);
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const ep0x = T0.px + S.resPx, ep0y = T0.py + S.resPy;
    const pScale = S.m[0] * Math.hypot(S.vx[0], S.vy[0]) + S.m[1] * Math.hypot(S.vx[1], S.vy[1]);
    const mt = S.m[0] + S.m[1];
    const com = () => [(S.m[0] * S.x[0] + S.m[1] * S.x[1]) / mt, (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / mt];
    const c0 = com();
    let comMax = 0, comEnd = 0;
    let rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0; const rev = [];
    let uMagMax = 0;
    for (let k = 0; k < steps && rev.length < nRev; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      const cc = com(); const cd = Math.hypot(cc[0] - c0[0], cc[1] - c0[1]);
      if (cd > comMax) comMax = cd; comEnd = cd;
      if (S.uPx && S.hasU && S.hasU[0]) {
        const um = Math.hypot(S.uPx[0], S.uPy[0]); if (um > uMagMax) uMagMax = um;
      }
      if (thPrev !== null) {
        let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (rev.length < nRev && Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
          const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
          const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
          rev.push((k - 1 + fr) * dt); nTurn++;
        }
      }
      thPrev = th;
      if (S.hasNaN()) break;
    }
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    const per = []; for (let i = 0; i < rev.length; i++) per.push(i ? rev[i] - rev[i - 1] : rev[0]);
    return { revT: rev, per, rMin, rMax,
      wobblePct: (rMax > 0) ? 100 * (rMax - rMin) / (0.5 * (rMax + rMin)) : null,
      comMax, comEnd, uMagMax,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      pRel: Math.hypot(T1.px + S.resPx - ep0x, T1.py + S.resPy - ep0y) / Math.max(pScale, 1e-9),
      nan: S.hasNaN(), warn: (v.warnings || []).length, warnMsgs: (v.warnings || []).slice(0, 2),
      framePrec: S.framePrec || null, steps };
  };
  // 引きずり重み g_T(並進チャネルの利得)を宣言値から読む診断(力は呼ばない)
  W.chi = (pd) => {
    const b = pd.bodies, ph = pd.physics;
    const d = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
    const s = HP.dfmBinaryChi(b[0].m, b[1].m, d, ph.D0, ph.softening, 0);
    return { d, chiA: s.chiA, chiB: s.chiB, wBA: s.wBA, wAB: s.wAB };
  };
});

const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);

let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第255便d', target: TARGET, node: process.version, at: new Date().toISOString(),
  id: ID, dt: DT0, Tunit: TUNIT, PobsDays: P_OBS_DAYS, PobsUnits: P_OBS_U, nRev: NREV, fast: FAST,
  note: '同方向 1 周(相対角の 2π 交差)。超過% = (P_kF1 − P_kF0)/P_kF0 × 100 と観測比 % を併記。'
    + 'プリセットは 1 bit も変えていない(宣言の差し替えは一時コピー上の診断)。' };

// 1 行を測る共通ルーチン
const runRow = async (tag, patch) => {
  const t0 = Date.now();
  const r = await pg.evaluate(([id, patch, dt, nRev, tMax]) => {
    const pd = window.__w255p.clone(id);
    if (patch.physics) for (const k of Object.keys(patch.physics)) {
      if (patch.physics[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = patch.physics[k];
    }
    if (patch.spinZero) { for (const b of pd.bodies) b.spin = 0; }
    if (patch.sepMul && patch.sepMul !== 1) {
      // **固定するもの**: 2 体の質量・G・e=0・初速則(円軌道ケプラー速度の重心系配分)。
      // 動かすのは分離 d だけ。角運動量と周期は従属量である(fit ではない)。
      const b = pd.bodies, G = pd.physics.G;
      const m0 = b[0].m, m1 = b[1].m, mt = m0 + m1;
      const d0 = Math.abs(b[1].x - b[0].x), d1 = d0 * patch.sepMul;
      const vRel = Math.sqrt(G * mt / d1);
      b[0].x = -(m1 / mt) * d1; b[1].x = (m0 / mt) * d1;
      b[0].y = 0; b[1].y = 0;
      b[0].vx = 0; b[1].vx = 0;
      b[0].vy = -(m1 / mt) * vRel; b[1].vy = (m0 / mt) * vRel;
    }
    if (patch.boost) { for (const b of pd.bodies) { b.vx += patch.boost[0]; b.vy += patch.boost[1]; } }
    const chi = window.__w255p.chi(pd);
    const o = window.__w255p.rev(pd, dt, nRev, tMax);
    o.chi = chi;
    o.decl = { kFrame: pd.physics.kFrame, qTrans: pd.physics.qTrans === undefined ? null : pd.physics.qTrans,
      spin0: pd.bodies[0].spin, spin1: pd.bodies[1].spin, D0: pd.physics.D0,
      x0: pd.bodies[0].x, x1: pd.bodies[1].x, vy0: pd.bodies[0].vy, vy1: pd.bodies[1].vy };
    return o;
  }, [ID, patch, DT0, NREV, (patch.tMaxMul || 1.4) * NREV * P_OBS_U * (patch.sepMul ? Math.pow(patch.sepMul, 1.6) : 1)]);
  const p1 = r.per.length ? r.per[0] : null;
  const row = { tag, patch: JSON.parse(JSON.stringify(patch)), decl: r.decl,
    per1U: p1, per1Days: p1 === null ? null : p1 * TUNIT / 86400,
    perAllDays: r.per.map((z) => z * TUNIT / 86400),
    residObsPct: p1 === null ? null : ((p1 * TUNIT / 86400) / P_OBS_DAYS - 1) * 100,
    wobblePct: r.wobblePct, rMin: r.rMin, rMax: r.rMax,
    comMax: r.comMax, comEnd: r.comEnd, uMagMax: r.uMagMax,
    chiA: r.chi.chiA, chiB: r.chi.chiB, sep: r.chi.d,
    lRel: r.lRel, pRel: r.pRel, nan: r.nan, warn: r.warn, warnMsgs: r.warnMsgs,
    steps: r.steps, wallSec: (Date.now() - t0) / 1000 };
  console.error(`  ${tag}: P1=${fx(row.per1Days, 6)} 日(観測比 ${fx(row.residObsPct, 4)}%)`
    + ` 振れ幅=${fx(row.wobblePct, 4)}% 重心 max=${row.comMax.toExponential(3)}`
    + ` |u|max=${row.uMagMax.toExponential(3)} [${row.wallSec.toFixed(1)}s]`);
  return row;
};

// ============================================================ (i) チャネル別 A/B
if (want('chan')) {
  console.error('[w255d/❄️] (i) チャネル別: kF1 本番 / kF0 対照 / スピン双極子 0 / 並進 g_T の減衰');
  const rows = [];
  rows.push(await runRow('kF1 本番(宣言のまま)', { physics: {} }));
  rows.push(await runRow('kF0 対照(abBody と同じ)', { physics: { kFrame: 0 } }));
  rows.push(await runRow('kF1・スピン双極子 0(両体 spin=0)', { physics: {}, spinZero: true }));
  rows.push(await runRow('kF0・スピン双極子 0', { physics: { kFrame: 0 }, spinZero: true }));
  for (const qT of (FAST ? [4] : [2, 4, 8, 16]))
    rows.push(await runRow(`kF1・並進 g_T 減衰 qTrans=${qT}`, { physics: { qTrans: qT } }));
  // 参考: D₀ を 1 桁ずつ動かす(**同時 fit ではない** — 単独ノブの感度だけを見る)
  for (const d0 of (FAST ? [] : [0.0006, 0.06]))
    rows.push(await runRow(`kF1・D₀=${d0}(単独ノブの感度)`, { physics: { D0: d0 } }));
  out.chan = rows;
}

// ============================================================ (ii) 初期分離 3 段
if (want('sep')) {
  console.error('[w255d/❄️] (ii) 初期分離 3 段(質量・G・e=0・円軌道ケプラー初速則を固定)');
  const rows = [];
  for (const mul of [0.5, 1, 2]) {
    rows.push(await runRow(`分離 ×${mul}・kF1`, { physics: {}, sepMul: mul }));
    rows.push(await runRow(`分離 ×${mul}・kF0`, { physics: { kFrame: 0 }, sepMul: mul }));
  }
  out.sep = rows;
}

// ============================================================ (iii) 共通ブースト(絶対速度依存)
if (want('boost')) {
  console.error('[w255d/❄️] (iii) 共通ブースト(絶対速度依存 — 重心歩行 D₀ 開放系の疑い)');
  // ❄️ に compactForce は無い = velocityFrame 宣言はそもそも存在しない(記録)
  const hasCF = await pg.evaluate((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { compactForce: !!(p.physics && p.physics.compactForce),
      velocityFrame: (p.physics && p.physics.compactForce) ? (p.physics.compactForce.velocityFrame || 'absolute') : null };
  }, ID);
  out.boostMeta = hasCF;
  console.error(`  ❄️ の compactForce 宣言: ${JSON.stringify(hasCF)}`
    + '(= velocityFrame:"pair" はこの系には存在しない宣言。共通ブーストで代替する)');
  const rows = [];
  const vOrb = 0.0223;   // 初期の相対速度スケール(宣言値 |vy1−vy0| ≈ 0.0223)
  for (const f of (FAST ? [0, 1] : [0, 0.1, 1, 10])) {
    rows.push(await runRow(`ブースト V=${f}×v_rel・kF1`, { physics: {}, boost: [f * vOrb, 0] }));
    rows.push(await runRow(`ブースト V=${f}×v_rel・kF0`, { physics: { kFrame: 0 }, boost: [f * vOrb, 0] }));
  }
  out.boost = rows;
}

// ============================================================ (iii-b) 質量比 1 ノブ(前因子の切り分け)
// **同時 fit はしない**。動かすのは伴星質量 m_B だけで、分離 d・G・主星質量 m_A・e=0・
// 円軌道ケプラー初速則は固定する。χ_B=w_AB/(D₀+w_AB) は w_AB=m_A/√(d²+ε²) だけで決まるので
// **m_B を動かしても χ_B は 1 bit 動かない**(動くのは χ_A)—— χ 以外の前因子を見るための 1 ノブ。
if (want('mass')) {
  console.error('[w255d/❄️] (iii-b) 伴星質量 1 ノブ(χ_B は不変・χ_A だけが動く)');
  const rows = [];
  for (const mul of [0.1, 1, 10]) {
    for (const kF of [1, 0]) {
      const r = await pg.evaluate(([id, mul, kF, dt, nRev]) => {
        const W = window.__w255p;
        const pd = W.clone(id);
        if (kF === 0) pd.physics.kFrame = 0;
        const b = pd.bodies, G = pd.physics.G;
        const d = Math.abs(b[1].x - b[0].x);
        b[1].m = b[1].m * mul;
        const m0 = b[0].m, m1 = b[1].m, mt = m0 + m1;
        const vRel = Math.sqrt(G * mt / d);
        b[0].x = -(m1 / mt) * d; b[1].x = (m0 / mt) * d;
        b[0].vy = -(m1 / mt) * vRel; b[1].vy = (m0 / mt) * vRel;
        const Pest = 2 * Math.PI * Math.sqrt(d * d * d / (G * mt));
        const chi = W.chi(pd);
        const o = W.rev(pd, dt, nRev, 1.6 * Pest);
        return { mul, kF, Pest, d, chiA: chi.chiA, chiB: chi.chiB, mRatio: m1 / m0,
          rev1: o.revT[0] || null, wobble: o.wobblePct, comMax: o.comMax };
      }, [ID, mul, kF, DT0, 1]);
      rows.push(r);
    }
  }
  out.mass = rows;
  out.excessMass = [0.1, 1, 10].map((mul) => {
    const a = rows.find((r) => r.mul === mul && r.kF === 1), c = rows.find((r) => r.mul === mul && r.kF === 0);
    const ex2 = (a && c && a.rev1 && c.rev1) ? 100 * (a.rev1 / c.rev1 - 1) : null;
    return { mul, mRatio: a.mRatio, chiA: a.chiA, chiB: a.chiB, excessPct: ex2,
      excessOverChiB: (ex2 !== null) ? ex2 / a.chiB : null, comMaxKf1: a.comMax };
  });
  for (const z of out.excessMass)
    console.error(`  m_B ×${z.mul}(質量比 ${z.mRatio.toExponential(3)}): 超過 ${fx(z.excessPct, 5)}% `
      + `χ_A=${fx(z.chiA, 9)} χ_B=${fx(z.chiB, 9)}(不変) 前因子 超過/χ_B=${fx(z.excessOverChiB, 4)}`);
}

// ============================================================ (iv) 系間の前因子(❄️🌊🌇)
// 第254便d ⑩ が撤回したのは「χ が大きいほど超過が大きい」という**系列の因果**である。
// 本節は同じ検出器で 3 系の超過と χ_B を並べ、**超過/χ_B(前因子)が系間で一定かどうか**だけを見る。
// 新しい系は作らない(既存の 3 プリセットをそのまま build する)。
if (want('cross')) {
  console.error('[w255d] (iv) 系間の前因子: ❄️🌊🌇 の 超過% と χ_B を同じ検出器で並べる');
  const rows = [];
  for (const id of ['plutoCharonReal', 'neptuneReal', 'venusReal']) {
    const r = await pg.evaluate(([id, dt]) => {
      const W = window.__w255p;
      const mk = () => W.clone(id);
      const pd0 = mk();
      const b = pd0.bodies, G = pd0.physics.G;
      const d = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
      const Pest = 2 * Math.PI * Math.sqrt(d * d * d / (G * (b[0].m + b[1].m)));
      const tMax = 1.6 * Pest;
      const chi = W.chi(pd0);
      const a = W.rev(mk(), dt, 1, tMax);
      const p1 = mk(); p1.physics.kFrame = 0;
      const c = W.rev(p1, dt, 1, tMax);
      return { id, emoji: (HP.allPresets().find((q) => q.id === id) || {}).emoji,
        Pest, d, chiA: chi.chiA, chiB: chi.chiB,
        kf1: a.revT[0] || null, kf0: c.revT[0] || null,
        wobbleKf1: a.wobblePct, wobbleKf0: c.wobblePct,
        comKf1: a.comMax, comKf0: c.comMax, steps: a.steps };
    }, [id, DT0]);
    r.excessPct = (r.kf1 && r.kf0) ? 100 * (r.kf1 / r.kf0 - 1) : null;
    r.excessOverChiB = (r.excessPct !== null && r.chiB) ? r.excessPct / r.chiB : null;
    rows.push(r);
    console.error(`  ${r.emoji} ${r.id}: 超過 ${fx(r.excessPct, 5)}% χ_B=${fx(r.chiB, 9)} `
      + `前因子 超過/χ_B=${fx(r.excessOverChiB, 4)} 重心 max kF1/kF0=${r.comKf1.toExponential(2)}/${r.comKf0.toExponential(2)}`);
  }
  out.cross = rows;
}

// ---------------------------------------------------------------- 超過% の表(kF1 − kF0)
const excess = (a, b) => (a && b && a.per1Days && b.per1Days) ? 100 * (a.per1Days / b.per1Days - 1) : null;
out.excess = {};
if (out.chan) {
  const base = out.chan.find((r) => r.tag.startsWith('kF1 本番'));
  const ctl = out.chan.find((r) => r.tag.startsWith('kF0 対照'));
  const s1 = out.chan.find((r) => r.tag.indexOf('スピン双極子 0(両体') >= 0);
  const s0 = out.chan.find((r) => r.tag.indexOf('kF0・スピン双極子 0') >= 0);
  out.excess.base = excess(base, ctl);
  out.excess.spinZero = excess(s1, s0);
  out.excess.qTrans = out.chan.filter((r) => r.tag.indexOf('qTrans') >= 0)
    .map((r) => ({ tag: r.tag, excessPct: excess(r, ctl) }));
  out.excess.D0 = out.chan.filter((r) => r.tag.indexOf('D₀=') >= 0)
    .map((r) => ({ tag: r.tag, excessPct: excess(r, ctl) }));
  console.error(`  超過%(kF1−kF0): 本番 ${fx(out.excess.base, 4)}% / スピン双極子 0 ${fx(out.excess.spinZero, 4)}%`);
  for (const z of out.excess.qTrans) console.error(`    ${z.tag}: 超過 ${fx(z.excessPct, 4)}%`);
  for (const z of out.excess.D0) console.error(`    ${z.tag}: 超過 ${fx(z.excessPct, 4)}%`);
}
if (out.sep) {
  out.excess.sep = [0.5, 1, 2].map((mul) => ({ sepMul: mul,
    excessPct: excess(out.sep.find((r) => r.tag === `分離 ×${mul}・kF1`), out.sep.find((r) => r.tag === `分離 ×${mul}・kF0`)),
    kf1Days: (out.sep.find((r) => r.tag === `分離 ×${mul}・kF1`) || {}).per1Days,
    kf0Days: (out.sep.find((r) => r.tag === `分離 ×${mul}・kF0`) || {}).per1Days,
    chiB: (out.sep.find((r) => r.tag === `分離 ×${mul}・kF1`) || {}).chiB,
    comMaxKf1: (out.sep.find((r) => r.tag === `分離 ×${mul}・kF1`) || {}).comMax }));
  for (const z of out.excess.sep) console.error(`  分離 ×${z.sepMul}: 超過 ${fx(z.excessPct, 4)}% (χ_B=${fx(z.chiB, 9)})`);
}
if (out.boost) {
  const fs2 = FAST ? [0, 1] : [0, 0.1, 1, 10];
  out.excess.boost = fs2.map((f) => ({ f,
    excessPct: excess(out.boost.find((r) => r.tag === `ブースト V=${f}×v_rel・kF1`),
      out.boost.find((r) => r.tag === `ブースト V=${f}×v_rel・kF0`)),
    kf1Days: (out.boost.find((r) => r.tag === `ブースト V=${f}×v_rel・kF1`) || {}).per1Days,
    comMaxKf1: (out.boost.find((r) => r.tag === `ブースト V=${f}×v_rel・kF1`) || {}).comMax }));
  for (const z of out.excess.boost) console.error(`  ブースト ×${z.f}: 超過 ${fx(z.excessPct, 4)}% 重心 max=${z.comMaxKf1 === undefined ? '—' : z.comMaxKf1.toExponential(3)}`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w255d] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w255d] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));
