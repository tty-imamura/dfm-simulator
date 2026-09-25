// 第280便c(原仮定者の裁定〔第70報〕「近点移動の差分を精査する — geoPN=3 として進め、必要に応じてサンプルを追加する」・
// 統括の読み R65): **geoPN=3 の契約(lawVersion:"vMinusU"・pn・pnVelocity・velocityMeaning)の検算器**。
//
// ■ 何を測るか(**予想を書かない —— 走らせた値だけを JSON に置く**)
//   (a) 点源 1 個相当の**一様な u=V**(mutual:0)で、固定源(pinned の太陽)の水星: geoPN=3・pn:"reference-1PN"・
//       pnVelocity:"v" の近点移動が kF0・geoPN=2(☄️ mercuryReal そのもの)と同じか(純粋な座標の変更は近点を変えない)。
//       同じ入力で pnVelocity:"xdot" も並べる(**事後採用しない** —— 両方を載せる)。
//   (b) 同じ入力で pn:"off" → 1PN なし対照(geoPN=2・λ_PN=0)と一致するか。
//   (c) velocityMeaning:"xdot" の変換 v=ẋ−u(0) の往復(ẋ=v+u(v) を組み直して宣言と比べる)。
//   (d) 旧 E6′(kFrame>0)・トイ・メッシュのチャネルとの二重計上が拒否されること。
//   (e) 保存 → 読込の往復で lawVersion・pn・pnVelocity・velocityMeaning が保たれること(presetSig・検証器の冪等・
//       アプリのセーブ項目 → loadSave)。
//   (f) 内蔵の診断コピー 2 本(🔁 mercuryGeoToy3・🌒 charonGeoToy3)の 1 bit 再現性と、器の複製関数との同一性。
//   (g) `dfmComplexMomentsOf` の NaN・false・空文字・null の 0 受理の修正(基点 html と並べる)。
//   (h) `S._core` の本文が基点と 1 文字も違わないこと(dispatch は `_core` の外)。
//
// ■ 測定演算子と窓(**正式と同じ —— 変えない**)
//   近点は正式の判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(`__w249run` —— ṙ の −→+ 交差の近点方位を
//   近点番号に回帰した °/周)を**ソースから文字列のまま取り出して**評価する(写しを持たない)。窓は正本
//   `tests/out/calaudit-w249.json` の `presets[].run`(水星 dt=0.016 で 2850199 步・dt/2 で 5700398 步 / ❄️ 20694498 步・
//   41388996 步 —— どちらも 60 公転上限)。**同じ抽出器・同じ窓で ☄️ 自身を測り直して正本と突き合わせる**のが最初の行。
//   走行は正式の判定器と同じ Chromium(playwright)で行う(同じ V8 で ☄️ 自身の正本値をビットで再現できるかが最初の検査)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright W280_BASE=beta/_w280_base.html node tests/exp-w280c-geo3.mjs [--quick] [--part mercury|charon|checks] [--no-half]
//   --quick   … 窓を 1/20 にした**器の動作確認**(正本に書かない —— scratchpad へ)
//   --part    … 一部だけ走らせて scratchpad に置く(正本は全部を 1 走行で作る)
// 出力: tests/out/geo3-w280c.json(正本・来歴 w272e-1)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { provenanceMeta, sha256Text } from './lib-w272e-provenance.mjs';
import { GEO3_HARNESS_VERSION, uniformBackground, makeGeo3Copy, extractCalauditPageHelpers, summarizeRun } from './lib-w280c-geo3.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const BASE = process.env.W280_BASE || null;          // 基点 html(g・h の対照 —— 無ければその 2 項は基点側が null)
const argv = process.argv.slice(2);
const QUICK = argv.includes('--quick');
const NO_HALF = argv.includes('--no-half');
const PART = (() => { const i = argv.indexOf('--part'); return i >= 0 ? argv[i + 1] : null; })();
const SP = process.env.W280_SP || '/tmp/claude-0/-home-user/4f96698f-a34b-5320-97a4-57808def6ae4/scratchpad';
const OUT = (QUICK || PART) ? path.join(SP, 'geo3-w280c' + (QUICK ? '.quick' : '') + (PART ? '.' + PART : '') + '.json')
  : path.join(ROOT, 'tests', 'out', 'geo3-w280c.json');
const t0 = Date.now();
const log = (s) => console.error('[w280c] ' + s);

/* ── Chromium(正式の判定器と同じ)── */
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const openPage = async (rel) => {
  const pg = await browser.newPage();
  pg.on('pageerror', (e) => pageErrors.push(rel + ': ' + String(e)));
  await pg.goto('file://' + (path.isAbsolute(rel) ? rel : path.join(ROOT, rel)), { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
  return pg;
};
const pg = await openPage(TARGET);
if (!(await pg.evaluate(() => typeof HP.geo3InitVelocity === 'function'))) { console.error('対象に第280便c の契約が無い: ' + TARGET); process.exit(2); }
const CAL_SRC = fs.readFileSync(path.join(ROOT, 'tests', 'exp-w249b-calaudit.mjs'), 'utf8');
const HELPERS = extractCalauditPageHelpers(CAL_SRC);
await pg.evaluate('(function(PERI_WINDOW){' + HELPERS + '})(20)');
// 器が持つ複製(内蔵に無い id)を build できるように __w249build を**包む**(内蔵 id は正式の関数そのまま)
await pg.evaluate(() => { const orig = window.__w249build; window.__w280reg = {};
  window.__w249build = (id, kf0) => { const p = window.__w280reg[id]; if (!p) return orig(id, kf0);
    const q = JSON.parse(JSON.stringify(p)); const post = q.__postShiftX; delete q.__postShiftX;
    const v = HP.validatePreset(q);
    if (!v.ok) throw new Error('器の複製が受理されない ' + id + ': ' + (v.errors || []).join(' | '));
    HP.sim.build(v.preset);
    // 丸めの対照だけ: 検証器は座標を値域へ丸めるので、build の**後**に全天体を x へ一様にずらす(相対配置は 1 bit も変えない)
    if (post) for (let i = 0; i < HP.sim.n; i++) HP.sim.x[i] += post;
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame }; }; });
const reg = (p) => pg.evaluate((q) => { window.__w280reg[q.id] = q; }, p);
const run = (id, dt, maxSteps) => pg.evaluate(({ id, dt, maxSteps }) => {
  const r = window.__w249run(id, dt, maxSteps, [{ ci: 0, oi: 1, label: 'b1' }], 60, 6.674, false);
  const S = HP.sim;
  r.diag = { geoPN: S.params.geoPN, hasGeo3: S.hasGeo3 === true, hasGeo3PN: S.hasGeo3PN === true, hasGeoToy: S.hasGeoToy === true,
    meshVelN: S.meshVelN || 0, meshVelUMax: S.meshVelUMax || 0, meshVelKickMax: S.meshVelKickMax || 0, meshVelBad: S.meshVelBad || 0,
    meshVelUndef: S.meshVelUndef || 0, geo3PnN: S.geo3PnN || 0, geo3PnKickMax: S.geo3PnKickMax || 0, geo3PnDL: S.geo3PnDL || 0,
    geo3PinCarry: S.geo3PinCarry || 0, meshVelDeny: S.meshVelDeny || null,
    geo3Init: S.geo3Init ? { meaning: S.geo3Init.meaning, converted: S.geo3Init.converted, roundTripRel: S.geo3Init.roundTripRel,
      minPivot: S.geo3Init.minPivot, stop: S.geo3Init.stop || null } : null };
  return r;
}, { id, dt, maxSteps });
const presetOf = (id) => pg.evaluate((i) => { const p = HP.allPresets().find((q) => q.id === i); return p ? JSON.parse(JSON.stringify(p)) : null; }, id);

/* ── 正本の窓 ── */
const CAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'), 'utf8'));
const calRow = (id, kf0) => CAL.presets.find((p) => p.id === id && !!p.kf0Diagnostic === !!kf0);
const windowOf = (id) => { const p = calRow(id, false); return { dt: p.run.dt, steps: p.run.steps, dtHalf: p.run.dtHalf ? p.run.dtHalf.dt : null,
  stepsHalf: p.run.dtHalf ? p.run.dtHalf.steps : null }; };
const precOf = (id, kf0) => { const p = calRow(id, kf0); if (!p) return null; const q = p.quantities.find((z) => z.kind === 'precession');
  return q ? { meas: q.meas, detectorA: q.detail ? q.detail.detectorA : null } : null; };
const periodOf = (id, kf0) => { const p = calRow(id, kf0); if (!p) return null; const q = p.quantities.find((z) => z.kind === 'period');
  return q ? { meas: q.meas, periASec: q.detail ? q.detail.periASec : null, rev: q.detail ? q.detail.revSec : null } : null; };
const out = { cases: {}, tables: {}, checks: {} };
const levels = (w) => {
  const s = QUICK ? 20 : 1;
  const L2 = [{ tag: 'dt', dt: w.dt, steps: Math.round(w.steps / s) }];
  if (!NO_HALF && w.dtHalf) L2.push({ tag: 'dt/2', dt: w.dtHalf, steps: Math.round(w.stepsHalf / s) });
  return L2;
};
const merc = await presetOf('mercuryReal');
const pc = await presetOf('plutoCharonReal');

/* ── (a)(b) 水星: 一様な u=V の座標変更 ── */
const V_MERC = [2.3, 0];   // 診断値(2.3 単位 = 230 km/s —— 観測の転写ではない)
if (!PART || PART === 'mercury') {
  const W = windowOf('mercuryReal');
  const toSec = 1e4;
  const noPN = Object.assign(JSON.parse(JSON.stringify(merc)), { id: 'mercuryRealNoPN_w280c', sampleClass: 'principle' });
  noPN.physics = Object.assign({}, noPN.physics, { lambdaPN: 0 });
  delete noPN.claims;
  await reg(noPN);
  // **丸めの対照**(1PN なし・geoPN=2): build の後に両天体を x に +52000 単位(u=V の走行で dt 段の終わりに座標が届く値の半分)ずらした複製 ——
  //   相対軌道は同じで、座標の絶対値だけが大きい。u=V の行の差がこの対照と同じ桁かを並べる(原因の分離ではない)
  const noPNX = Object.assign(JSON.parse(JSON.stringify(noPN)), { id: 'mercuryRealNoPNShift_w280c' });
  noPNX.__postShiftX = 52000;   // build の後にずらす(検証器の値域の丸めを避ける —— 相対配置はそのまま)
  await reg(noPNX);
  const mk = (id, V, pn, pnVelocity) => makeGeo3Copy(merc, { id, pn, pnVelocity, velocityMeaning: 'v', background: uniformBackground(V) });
  const M = [
    { key: 'M0', label: '☄️ mercuryReal そのもの(geoPN=2・kF0・λ_PN=1)', id: 'mercuryReal' },
    { key: 'M0n', label: '1PN なし対照(geoPN=2・kF0・λ_PN=0)', id: noPN.id },
    { key: 'M0nX', label: '丸めの対照: 同 λ_PN=0 で両天体を x に +52000 単位ずらした複製', id: noPNX.id },
    { key: 'M1', label: 'geoPN=3・vMinusU・u=0・pn:reference-1PN(v)', p: mk('m1_w280c', [0, 0], 'reference-1PN', 'v') },
    { key: 'M1x', label: 'geoPN=3・vMinusU・u=0・pn:reference-1PN(xdot)', p: mk('m1x_w280c', [0, 0], 'reference-1PN', 'xdot') },
    { key: 'M2', label: 'geoPN=3・vMinusU・u=V・pn:reference-1PN(v)', p: mk('m2_w280c', V_MERC, 'reference-1PN', 'v') },
    { key: 'M3', label: 'geoPN=3・vMinusU・u=V・pn:reference-1PN(xdot)', p: mk('m3_w280c', V_MERC, 'reference-1PN', 'xdot') },
    { key: 'M4', label: 'geoPN=3・vMinusU・u=V・pn:off', p: mk('m4_w280c', V_MERC, 'off') },
    // **点源 1 個そのもの**: x=−5000 単位(検証器の座標の値域の端 = 5×10¹¹ m)に速度 V で動く明示天体(質量 10⁻⁶ = mEff の床)を 1 個置き、
    //   field:"explicit"・mutual:0 の外部の場にする(u=A/W=v_S が一様)。**この天体の重力は ☄️ にも当たる** —— しかも M2e では
    //   太陽と水星が u=v_S で運ばれるので、第 3 天体は太陽から 5000 単位の**同じ位置に留まる**(太陽は pinned で第 3 天体に
    //   引かれないので、水星だけが一定の外力を受ける)。比べる相手は、同じ位置に第 3 天体を **pinned で止めた** geoPN=2 の複製 M0s。
    //   M0e(第 3 天体を速度 V で動かした geoPN=2 —— 太陽へ落ちて通り過ぎる)は**配置が違う**ので参考に並べる
    { key: 'M0e', label: '参考: ☄️ に同じ第 3 天体(速度 V・自由)を置いた geoPN=2 の複製(配置が M2e と違う)', p: (() => { const b = JSON.parse(JSON.stringify(merc));
        b.id = 'm0e_w280c'; b.sampleClass = 'principle'; delete b.claims;
        b.bodies = b.bodies.concat([{ type: 'single', m: 1e-6, radius: 0.01, x: -5000, y: 0, vx: V_MERC[0], vy: V_MERC[1], spin: 0, pinned: false }]);
        return b; })() },
    { key: 'M0s', label: '☄️ に同じ第 3 天体を同じ位置に pinned で止めた geoPN=2 の複製(M2e の対照)', p: (() => { const b = JSON.parse(JSON.stringify(merc));
        b.id = 'm0s_w280c'; b.sampleClass = 'principle'; delete b.claims;
        b.bodies = b.bodies.concat([{ type: 'single', m: 1e-6, radius: 0.01, x: -5000, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }]);
        return b; })() },
    { key: 'M2e', label: 'geoPN=3・vMinusU・明示の点源 1 個(速度 V・field:"explicit"・mutual:0)・pn:reference-1PN(v)',
      p: (() => { const b = JSON.parse(JSON.stringify(merc));
        b.bodies = b.bodies.concat([{ type: 'single', m: 1e-6, radius: 0.01, x: -5000, y: 0, vx: V_MERC[0], vy: V_MERC[1], spin: 0, pinned: false }]);
        return makeGeo3Copy(b, { id: 'm2e_w280c', pn: 'reference-1PN', pnVelocity: 'v', velocityMeaning: 'v', field: 'explicit', external: ['body:2'], mutual: 0 }); })() },
  ];
  const rows = {};
  for (const c of M) {
    if (c.p) await reg(c.p);
    const id = c.p ? c.p.id : c.id;
    rows[c.key] = { label: c.label, id, runs: {} };
    for (const lv of levels(W)) {
      const tw = Date.now();
      const r = await run(id, lv.dt, lv.steps);
      r.dt = lv.dt;
      rows[c.key].runs[lv.tag] = Object.assign(summarizeRun(r, toSec), { diag: r.diag, wallSec: (Date.now() - tw) / 1000 });
      log(`水星 ${c.key} [${lv.tag}] slope=${rows[c.key].runs[lv.tag].slopeDegPerOrbitA} nPeri=${rows[c.key].runs[lv.tag].nPeriA} ${((Date.now() - tw) / 1000).toFixed(1)}s`);
    }
  }
  const d = (a, b, tag) => { const x = rows[a].runs[tag], y = rows[b].runs[tag];
    return (x && y && Number.isFinite(x.slopeDegPerOrbitA) && Number.isFinite(y.slopeDegPerOrbitA)) ? x.slopeDegPerOrbitA - y.slopeDegPerOrbitA : null; };
  const tags = levels(W).map((z) => z.tag);
  const off = precOf('mercuryReal', false) || {};
  out.cases.mercury = { base: 'mercuryReal', window: W, V: V_MERC, unitsNote: '1 単位 = 10⁸ m / 10⁴ s(V=2.3 単位 = 230 km/s・診断値)',
    official: { precession: off, period: periodOf('mercuryReal', false) }, rows };
  out.tables.mercury = tags.map((tag) => ({ tag,
    officialReproducedBit: (tag === 'dt' && !QUICK) ? (rows.M0.runs[tag].slopeDegPerOrbitA === off.detectorA) : null,
    pn1PNContribution: d('M0', 'M0n', tag),
    a_M1_minus_M0: d('M1', 'M0', tag), a_M2_minus_M0: d('M2', 'M0', tag), a_M3_minus_M0: d('M3', 'M0', tag),
    a_M1x_minus_M1: d('M1x', 'M1', tag), a_M2e_minus_M0s: d('M2e', 'M0s', tag), thirdBodyStatic_M0s_minus_M0: d('M0s', 'M0', tag), thirdBodyFree_M0e_minus_M0: d('M0e', 'M0', tag),
    stepWidthM0: (tags.length > 1 && rows.M0.runs['dt'] && rows.M0.runs['dt/2']) ? rows.M0.runs['dt/2'].slopeDegPerOrbitA - rows.M0.runs['dt'].slopeDegPerOrbitA : null,
    b_M4_minus_M0n: d('M4', 'M0n', tag), roundoffControl_M0nX_minus_M0n: d('M0nX', 'M0n', tag) }));
}

/* ── (a′)(b′) ❄️ 冥王星–カロン: 太陽の背景(第279便c の comoving の値)・velocityMeaning:"xdot" ── */
const BG2 = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bgbudget2-w279c.json'), 'utf8'));
const charonBg = (() => { const e = BG2.engine.find((z) => z.id === 'plutoCharonReal'); const b = JSON.parse(JSON.stringify(e.background));
  b.note = '第279便c の器(bgbudget2-w279c)と同じ値: 太陽の点質量を t=0・対の重心で評価(comoving)'; delete b.frame; return b; })();
if (!PART || PART === 'charon') {
  const W = windowOf('plutoCharonReal');
  const toSec = 100;
  const kf0 = Object.assign(JSON.parse(JSON.stringify(pc)), { id: 'plutoCharonKF0_w280c', sampleClass: 'principle' });
  kf0.physics = Object.assign({}, kf0.physics, { kFrame: 0 }); delete kf0.claims;
  const kf0n = Object.assign(JSON.parse(JSON.stringify(kf0)), { id: 'plutoCharonKF0noPN_w280c' });
  kf0n.physics = Object.assign({}, kf0n.physics, { lambdaPN: 0 });
  // **丸めの対照**(1PN なし・geoPN=2): 両天体に一様な速度 u(背景の u=A₀/W₀)を足したガリレイ変換の複製 —— 相対軌道は同じで
  //   座標の絶対値だけが u·t で育つ(vMinusU の移送と同じ育ち方)。C3−C0n がこの対照と同じ桁かを並べる(原因の分離ではない)
  const kf0nV = Object.assign(JSON.parse(JSON.stringify(kf0n)), { id: 'plutoCharonKF0noPNBoost_w280c' });
  const uB = [charonBg.A0[0] / charonBg.W0, charonBg.A0[1] / charonBg.W0];
  kf0nV.bodies = kf0nV.bodies.map((b) => Object.assign({}, b, { vx: b.vx + uB[0], vy: b.vy + uB[1] }));
  await reg(kf0nV);
  const mk = (id, pn, pnVelocity) => makeGeo3Copy(pc, { id, pn, pnVelocity, velocityMeaning: 'xdot', background: charonBg });
  const C = [
    { key: 'C0', label: '❄️ の kF0 診断コピー(geoPN=2・λ_PN=1 —— 正式の kf0 行と同じ構成)', p: kf0 },
    { key: 'C0n', label: '同 λ_PN=0(1PN なし対照)', p: kf0n },
    { key: 'C0nV', label: '丸めの対照: 同 λ_PN=0 に一様な速度 u を足したガリレイ変換の複製', p: kf0nV },
    { key: 'C1', label: 'geoPN=3・vMinusU・太陽の背景・mutual:0・v0:xdot・pn:reference-1PN(xdot)', p: mk('c1_w280c', 'reference-1PN', 'xdot') },
    { key: 'C2', label: 'geoPN=3・vMinusU・太陽の背景・mutual:0・v0:xdot・pn:reference-1PN(v)', p: mk('c2_w280c', 'reference-1PN', 'v') },
    { key: 'C3', label: 'geoPN=3・vMinusU・太陽の背景・mutual:0・v0:xdot・pn:off', p: mk('c3_w280c', 'off') },
  ];
  const rows = {};
  for (const c of C) {
    await reg(c.p);
    rows[c.key] = { label: c.label, id: c.p.id, runs: {} };
    for (const lv of levels(W)) {
      const tw = Date.now();
      const r = await run(c.p.id, lv.dt, lv.steps);
      r.dt = lv.dt;
      rows[c.key].runs[lv.tag] = Object.assign(summarizeRun(r, toSec), { diag: r.diag, wallSec: (Date.now() - tw) / 1000 });
      log(`カロン ${c.key} [${lv.tag}] rev2=${rows[c.key].runs[lv.tag].rev2S} peri20=${rows[c.key].runs[lv.tag].periMeanA20S} ${((Date.now() - tw) / 1000).toFixed(1)}s`);
    }
  }
  const tags = levels(W).map((z) => z.tag);
  const dd = (a, b, tag, k) => { const x = rows[a].runs[tag], y = rows[b].runs[tag]; return (x && y && Number.isFinite(x[k]) && Number.isFinite(y[k])) ? x[k] - y[k] : null; };
  // ❄️ の kF0 の値は正本の**既定行**の周期量「公転周期(kFrame=0 対照・同方向1周)」(kf0 診断行ではない)
  const offP = (() => { const p = calRow('plutoCharonReal', false); const q = p && p.quantities.find((z) => z.kind === 'period' && /kFrame=0/.test(z.name));
    return q ? { name: q.name, meas: q.meas, rev: q.detail ? q.detail.revSec : null } : {}; })();
  out.cases.charon = { base: 'plutoCharonReal', window: W, background: charonBg, uBackgroundMS: charonBg.A0[1] / charonBg.W0 * 1e4,
    unitsNote: '1 単位 = 10⁶ m / 10² s(速度 1 単位 = 10⁴ m/s)', officialKf0: { period: offP }, rows };
  out.tables.charon = tags.map((tag) => ({ tag,
    officialKf0ReproducedBit: (tag === 'dt' && !QUICK) ? (rows.C0.runs[tag].rev2S === offP.meas) : null,
    rev2: { pn1PN: dd('C0', 'C0n', tag, 'rev2S'), C1_minus_C0: dd('C1', 'C0', tag, 'rev2S'), C2_minus_C0: dd('C2', 'C0', tag, 'rev2S'),
      C3_minus_C0n: dd('C3', 'C0n', tag, 'rev2S'), roundoffControl_C0nV_minus_C0n: dd('C0nV', 'C0n', tag, 'rev2S') },
    peri20: { pn1PN: dd('C0', 'C0n', tag, 'periMeanA20S'), C1_minus_C0: dd('C1', 'C0', tag, 'periMeanA20S'),
      C2_minus_C0: dd('C2', 'C0', tag, 'periMeanA20S'), C3_minus_C0n: dd('C3', 'C0n', tag, 'periMeanA20S'),
      roundoffControl_C0nV_minus_C0n: dd('C0nV', 'C0n', tag, 'periMeanA20S') } }));
}

/* ── (c)〜(h) 契約の検査(短い) ── */
if (!PART || PART === 'checks') {
  const good = makeGeo3Copy(merc, { id: 'd_ok', pn: 'reference-1PN', pnVelocity: 'v', velocityMeaning: 'v', background: uniformBackground(V_MERC) });
  const pc3 = JSON.parse(JSON.stringify(pc));
  pc3.bodies = pc3.bodies.concat([{ type: 'single', m: 1e-6, radius: 0.01, x: -5000, y: 3000, vx: 0.3, vy: -0.2, spin: 0, pinned: false }]);
  const convCases = {
    bgMutual0: makeGeo3Copy(pc, { id: 'cconv_bg', pn: 'off', velocityMeaning: 'xdot', background: charonBg }),
    bgMeaningV: makeGeo3Copy(pc, { id: 'cconv_bgv', pn: 'off', velocityMeaning: 'v', background: charonBg }),
    bgMutual1: makeGeo3Copy(pc, { id: 'cconv_bg1', pn: 'off', velocityMeaning: 'xdot', background: charonBg, mutual: 1 }),
    explicitMutual0: makeGeo3Copy(pc3, { id: 'cconv_ex0', pn: 'off', velocityMeaning: 'xdot', field: 'explicit', external: ['body:2'], mutual: 0 }),
    explicitMutual1: makeGeo3Copy(pc3, { id: 'cconv_ex1', pn: 'off', velocityMeaning: 'xdot', field: 'explicit', external: ['body:2'], mutual: 1 }),
  };
  const harnessCopies = {
    mercuryGeoToy3: makeGeo3Copy(merc, { id: 'mercuryGeoToy3', pn: 'reference-1PN', pnVelocity: 'v', velocityMeaning: 'v', background: uniformBackground(V_MERC) }),
    charonGeoToy3: makeGeo3Copy(pc, { id: 'charonGeoToy3', pn: 'reference-1PN', pnVelocity: 'v', velocityMeaning: 'xdot', background: charonBg }),
  };
  out.checks = await pg.evaluate(({ good, convCases, harnessCopies, uBg }) => {
    const C = {};
    // (c) velocityMeaning の変換の往復
    const conv = (p) => { const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      if (!v.ok) return { accepted: false, errors: v.errors };
      HP.sim.build(v.preset); const S = HP.sim;
      const init = S.geo3Init ? { meaning: S.geo3Init.meaning, converted: S.geo3Init.converted, n: S.geo3Init.n,
        minPivot: S.geo3Init.minPivot, roundTripRel: S.geo3Init.roundTripRel, undef: S.geo3Init.undef, stop: S.geo3Init.stop || null } : null;
      const nb = p.bodies.length;
      return { accepted: true, hasGeo3: S.hasGeo3 === true, deny: S.meshVelDeny || null, init,
        vMinusXdot: Array.from({ length: nb }, (_, k) => [S.vx[k] - p.bodies[k].vx, S.vy[k] - p.bodies[k].vy]) }; };
    const cv = {};
    for (const [k, p] of Object.entries(convCases)) cv[k] = conv(p);
    cv.bgMeaningV.sameAsDeclared = cv.bgMeaningV.vMinusXdot.every((z) => z[0] === 0 && z[1] === 0);
    cv.uBackgroundUnits = uBg;
    C.c_velocityMeaning = cv;
    // (d) 二重計上の拒否(検証器)と実行時の門
    const V = (p) => { const v = HP.validatePreset(JSON.parse(JSON.stringify(p))); return v.ok ? true : (v.errors || []).join(' | ').slice(0, 160); };
    const mod = (f) => { const p = JSON.parse(JSON.stringify(good)); f(p); return p; };
    const D = {
      ok: V(good),
      kFrame1: V(mod((p) => { p.physics.kFrame = 1; })),
      kFrameDefault: V(mod((p) => { delete p.physics.kFrame; })),
      toyAllowDrag: V(mod((p) => { p.physics.spaceMesh.toyAllowDrag = true; })),
      toyGain: V(mod((p) => { p.physics.spaceMesh.toyGain = 0.5; })),
      inertiaCoordinate: V(mod((p) => { p.physics.spaceMesh.inertia = 'coordinate'; })),
      gravityChannel: V(mod((p) => { p.physics.spaceMesh.gravity = true; })),
      weave: V(mod((p) => { p.physics.spaceMesh.weave = 'pairPN'; })),
      meshV2: V(mod((p) => { p.physics.spaceMesh.law = 'mesh-v2'; })),
      noMeshVelocity: V(mod((p) => { delete p.physics.meshVelocity; })),
      geoPN2WithVMinusU: V(mod((p) => { p.physics.geoPN = 2; })),
      toyLawWithMeshVelocity: V(mod((p) => { p.physics.spaceMesh = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar' }; })),
      calibration: V(mod((p) => { p.sampleClass = 'calibration'; })),
      pnRefNoVelocity: V(mod((p) => { delete p.physics.spaceMesh.pnVelocity; })),
      pnOffWithVelocity: V(mod((p) => { p.physics.spaceMesh.pn = 'off'; })),
      noVelocityMeaning: V(mod((p) => { delete p.physics.spaceMesh.velocityMeaning; })),
      pnBad: V(mod((p) => { p.physics.spaceMesh.pn = '1PN'; })),
      pnKeysWithoutVMinusU: V(mod((p) => { p.physics.spaceMesh.lawVersion = 'scalar'; delete p.physics.meshVelocity; })),
    };
    { const v = HP.validatePreset(JSON.parse(JSON.stringify(good))); HP.sim.build(v.preset); const S = HP.sim;
      const before = { hasGeo3: S.hasGeo3, hasGeoToy: S.hasGeoToy };
      S.params.kFrame = 1; S.updateRadii();
      D.runtimeKFrame = { before, after: { hasGeo3: S.hasGeo3, hasGeo3PN: S.hasGeo3PN, hasMeshVelocity: S.hasMeshVelocity, hasGeoToy: S.hasGeoToy,
        geoToyDeny: S.geoToyDeny, meshVelDeny: S.meshVelDeny, hud: HP.geo3HudText(S) } }; }
    C.d_doubleCounting = D;
    // (e) 保存 → 読込の往復
    const E = {};
    { const v1 = HP.validatePreset(JSON.parse(JSON.stringify(good)));
      const v2 = HP.validatePreset(JSON.parse(JSON.stringify(v1.preset)));
      E.idempotent = JSON.stringify(v1.preset.physics.spaceMesh) === JSON.stringify(v2.preset.physics.spaceMesh)
        && JSON.stringify(v1.preset.physics.meshVelocity) === JSON.stringify(v2.preset.physics.meshVelocity);
      E.canonical = { spaceMesh: v1.preset.physics.spaceMesh, meshVelocity: v1.preset.physics.meshVelocity };
      const s0 = presetSig(good);
      E.sigDiffers = { pnOff: presetSig(mod((p) => { p.physics.spaceMesh.pn = 'off'; delete p.physics.spaceMesh.pnVelocity; })) !== s0,
        pnVelocityXdot: presetSig(mod((p) => { p.physics.spaceMesh.pnVelocity = 'xdot'; })) !== s0,
        velocityMeaningXdot: presetSig(mod((p) => { p.physics.spaceMesh.velocityMeaning = 'xdot'; })) !== s0 };
      const vm = HP.validatePreset(JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'mercuryReal'))));
      E.plainHasNoKeys = !(vm.preset.physics.spaceMesh) && vm.preset.physics.meshVelocity === undefined; }
    for (const id of ['mercuryGeoToy3', 'charonGeoToy3']) {
      if (!HP.allPresets().some((q) => q.id === id)) { E['save_' + id] = { missing: true }; continue; }
      HP.loadPreset(id, false);
      let S = HP.sim;
      for (let i = 0; i < 300; i++) S.step(0.016);
      const item = JSON.parse(JSON.stringify({ name: 'w280c', presetId: id, physics: Object.assign({}, S.params) }));
      loadSave(JSON.parse(JSON.stringify(item)));
      S = HP.sim;
      const kept = { spaceMesh: JSON.stringify(item.physics.spaceMesh) === JSON.stringify(S.params.spaceMesh),
        meshVelocity: JSON.stringify(item.physics.meshVelocity) === JSON.stringify(S.params.meshVelocity), hasGeo3: S.hasGeo3 === true };
      for (let i = 0; i < 300; i++) S.step(0.016);
      const A = [Array.from(S.x), Array.from(S.y), Array.from(S.vx), Array.from(S.vy)];
      HP.loadPreset(id, false);
      for (let i = 0; i < 300; i++) HP.sim.step(0.016);
      const B = [Array.from(HP.sim.x), Array.from(HP.sim.y), Array.from(HP.sim.vx), Array.from(HP.sim.vy)];
      E['save_' + id] = Object.assign(kept, { spaceMeshAfter: S.params.spaceMesh,
        stateBitSameAsFreshBuild: A.every((a, k) => a.every((z, i) => Object.is(z, B[k][i]))) });
    }
    C.e_saveLoad = E;
    // (f) 内蔵の診断コピー 2 本
    const F = {};
    for (const id of ['mercuryGeoToy3', 'charonGeoToy3']) {
      const p = HP.allPresets().find((q) => q.id === id);
      if (!p) { F[id] = { missing: true }; continue; }
      const once = () => { HP.loadPreset(id, false); const S = HP.sim; for (let i = 0; i < 2000; i++) S.step(0.016);
        return { st: [Array.from(S.x), Array.from(S.y), Array.from(S.vx), Array.from(S.vy), Array.from(S.spin)], t: S.t,
          hasGeo3: S.hasGeo3, meshVelN: S.meshVelN, pnN: S.geo3PnN, hud: HP.geo3HudText(S), chip: HP.meshChipLabel(p, S) }; };
      const a = once(), b = once();
      const vp = HP.validatePreset(JSON.parse(JSON.stringify(p))), vc = HP.validatePreset(JSON.parse(JSON.stringify(harnessCopies[id])));
      F[id] = { bitSame: a.st.every((arr, k) => arr.every((z, i) => Object.is(z, b.st[k][i]))) && a.t === b.t,
        hasGeo3: a.hasGeo3, meshVelN: a.meshVelN, pnN: a.pnN, hud: a.hud, chip: a.chip,
        physicsSameAsHarnessCopy: vc.ok && JSON.stringify(vp.preset.physics) === JSON.stringify(vc.preset.physics),
        bodiesSameAsHarnessCopy: vc.ok && JSON.stringify(vp.preset.bodies) === JSON.stringify(vc.preset.bodies),
        integratorSame: (p.integrator || 'semi') === (harnessCopies[id].integrator || 'semi'),
        sampleClass: p.sampleClass, geoPN: p.physics.geoPN };
    }
    C.f_builtinCopies = F;
    return C;
  }, { good, convCases, harnessCopies, uBg: charonBg.A0[1] / charonBg.W0 });
  // (g) NaN・false・空文字・null の受理 / (h) S._core の本文(基点 html と並べる)
  const probeFn = () => { const probes = { NaN: NaN, false: false, empty: '', null: null, undefined: undefined, Infinity: Infinity, finite: 0.25 };
    const o = {}; for (const [k, z] of Object.entries(probes)) {
      const b = { m: 1, x: 0, y: 0, vx: z, vy: 0, ax: 0, ay: 0 }; if (z === undefined) delete b.vx;
      const r = HP.dfmComplexMomentsOf([b], 2, 1, 0.01); o[k] = r === null ? 'rejected' : ('accepted A=' + JSON.stringify(r.A)); }
    return { nan: o, core: HP.sim._core.toString() }; };
  const tNow = await pg.evaluate(probeFn);
  out.checks.g_nanAcceptance = { target: tNow.nan };
  out.checks.h_core = { length: tNow.core.length, sha256: sha256Text(tNow.core) };
  if (BASE) {
    const pb = await openPage(BASE);
    const tB = await pb.evaluate(probeFn);
    out.checks.g_nanAcceptance.base = tB.nan;
    Object.assign(out.checks.h_core, { baseLength: tB.core.length, baseSha256: sha256Text(tB.core), identical: tB.core === tNow.core });
    await pb.close();
  }
}
await browser.close();

/* ── 書き出し ── */
const CODE = ['tests/exp-w280c-geo3.mjs', 'tests/lib-w280c-geo3.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/lib-w272e-provenance.mjs'];
const doc = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第280便c', target: TARGET, code: CODE,
    inputs: [TARGET, 'tests/out/calaudit-w249.json', 'tests/out/bgbudget2-w279c.json'] }), {
    harnessVersion: GEO3_HARNESS_VERSION, quick: QUICK, part: PART,
    extractor: 'tests/exp-w249b-calaudit.mjs のページ側ヘルパ(__w249run —— 近点 検出器 A の方位の回帰)をソースから文字列で取り出して評価(写しを持たない)',
    extractorSha256: sha256Text(HELPERS),
    window: '正本 calaudit-w249.json の presets[].run(dt と dt/2 の步数・60 公転上限)' + (QUICK ? ' —— **--quick: 1/20(正式の置換ではない)**' : ''),
    runner: 'Chromium(playwright —— 正式の判定器と同じ)',
    notClaim: ['観測一致を達成した', '較正した', '43″ を再現した', '慣性を導出した', '1PN を DFM から導出した', '新発見', 'v1.45.0 RC を切った'] }),
  cases: out.cases, tables: out.tables, checks: out.checks, pageErrors, elapsedS: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(doc, null, 1));
log(`→ ${OUT}(${doc.elapsedS.toFixed(1)} s)`);
