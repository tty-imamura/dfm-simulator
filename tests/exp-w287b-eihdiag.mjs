// 第287便b(原仮定者の裁定(第77報)⑤「geoPN=2 の EIH 型適用は引きずりの二重計上に注意して慎重に精査」・AN61・AN75・統括の検証項目 R110)
// —— **kF0 写しの診断 1 行の器**(Node/headless —— 対象 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)。
//
// ■ 何を測るか(**診断であって判定ではない** —— 正式判定の語を作らない・較正ではない)
//   制御二体(第285便b の R97 と同じ条件: G=1・M=10・a=10・e=0.3・c=100・ε=0.01・両方 pnSource・自由・重心静止・dt 0.01・8 周・検出器 B)で、
//   近点移動の λ_PN 増分(λ=1 と λ=0 の差)を GR の主次数 6πGM/(c²a(1−e²)) で割った比を、次の 2 つの経路で並べる:
//     (1) **現行の kF0**(geoPN=1・kFrame=0 → `_core` へ 1 + 差分 Δ=EIH−試験粒子形 `dfmPN1EIHKick` —— 反作用は EIH の式に内在)
//     (2) **DFM 経路の kFrame→0⁺ の極限**(geoPN=2・kFrame=κ>0 → `_core` へ 2 —— 試験粒子形 + ∇U 因子の**対反作用**・輸送 3 項は κ で消える)。
//         κ = 10⁻³・10⁻⁶・10⁻⁹ の 3 点で極限へ寄ることを示す(κ=0 は互換入力として kF0 の EIH 側へ入るので、DFM 経路のまま 0 を取れない)。
//   質量比 q = 1(等質量 ν=1/4)と 10⁻⁴(試験粒子の極限)。解析の対照: EIH は ν に依らず 1・「試験粒子形 + 対反作用」は 1−10ν/3
//   (等質量で 1/6 —— **約 6 倍の違い**)。読む正本 tests/out/pn1-w285b.json の (A) の基点の旧 kF0 則(q=1 の ratioBaseB)も並べる(同じ形の再測)。
//
// ■ この診断が言うこと・言わないこと
//   言う: DFM 版(geoPN=2・kFrame>0)の 1PN は kFrame→0 で「古い試験粒子形 + 対反作用」に戻り、kF0 の EIH とは等質量で約 6 倍違う。
//     したがって DFM 版に `dfmPN1EIHKick` を**そのまま足す**と、対反作用と EIH の反作用が重なる(二重計上)—— **足さない**(AN61・AN75)。
//   言わない: 「geoPN=2 に EIH を入れた」「DFM 版の 1PN が正しい/誤り」「λ_PN=1 で既に GR と合った」「観測一致を達成した」「較正を完了した」。
//   **html は 1 bit も変えない**(診断コピーは器の中の宇宙 —— 内蔵ではない・sampleClass:"principle")。
//
// 実行: node tests/exp-w287b-eihdiag.mjs     出力: tests/out/eihdiag-w287b.json(来歴 w272e-1・領域 hash つき)
// 読む正本: tests/out/pn1-w285b.json(第285便b の比の記録 —— 書く段 pn1 の後)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { extractCalauditHelpers } from './lib-w280a-mercury.mjs';
import * as G1 from './lib-w282b-geo1.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)
const REGEN_SCOPE = {"presets":"all","roots":["GEO_CORE_PN","GEO_MODE_VERSION","HP.allPresets","HP.coreState","HP.sim","HP.validatePreset","PN1_EIH_VERSION","dfmPN1Delta","dfmPN1EIHKick","geoCoreDispatch","geoModeOf","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = process.env.W287B_EIH_OUT ? path.resolve(ROOT, process.env.W287B_EIH_OUT) : path.join(ROOT, 'tests', 'out', 'eihdiag-w287b.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
const PN1_JSON = 'tests/out/pn1-w285b.json';
export const HARNESS_VERSION = 'w287b-eihdiag-2';   // 第295便a: 目的の組の逸脱の警告を異常の印に数えない
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const t0 = Date.now();
const log = (...a) => console.error('[w287b-eih]', ((Date.now() - t0) / 1000).toFixed(0) + 's', ...a);
const J = (o) => JSON.stringify(o);
const DEG = 180 / Math.PI;

const H = loadHtmlHeadless(path.join(ROOT, TARGET));
if (!H.HP) throw new Error('HP が無い');
const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
const helperBody = extractCalauditHelpers(calSrc);
const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
H.evalExpr('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')');
H.evalExpr(`(function(){
  const ORIG = window.__w249build;
  window.__w287bVariants = {};
  window.__w249build = (id, kFrame0) => {
    const V = window.__w287bVariants[id];
    if (!V) return ORIG(id, kFrame0);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(V)));
    if (!v.ok) throw new Error('器の中の宇宙が受理されない: ' + id + ' / ' + JSON.stringify(v.errors || ''));
    HP.sim.build(v.preset);
    // 第295便a(原仮定者の裁定(第85報)): 受理器は目的の組からの逸脱(geo2KFrame・kFrameFraction など)も警告として返すが、値は書き換えない情報なので
    //   この器の「警告」(NaN・クランプと並べる異常の印)には数えない —— HP.modeSettingIssues の文と一致するものを除く(無い版ではそのまま)
    const __mi = new Set((typeof HP.modeSettingIssues === 'function' ? HP.modeSettingIssues(Object.assign({}, v.preset.physics || {})) : []).map((m) => m.message));
    return { warnings: (v.warnings || []).filter((w) => !__mi.has(w)), n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame,
      geo: geoModeOf(v.preset.physics) };
  };
})()`);

const runPeri = (p, dt, orbMax) => {
  H.evalExpr(`window.__w287bVariants[${J(p.id)}] = ${J(p)};`);
  const b0 = H.evalExpr(`window.__w249build(${J(p.id)}, false)`);
  const Gv = H.evalExpr('HP.sim.params.G'), c = H.evalExpr('HP.sim.params.cLight');
  const tg = [{ ci: b0.map[0], oi: b0.map[1], label: p.id }];
  const osc0 = H.evalExpr(`window.__w249osc0(${tg[0].ci}, ${tg[0].oi}, ${Gv})`);
  const maxSteps = Math.ceil((orbMax + 1.5) * osc0.P / dt);
  const r = H.evalExpr(`window.__w249run(${J(p.id)}, ${dt}, ${maxSteps}, ${J(tg)}, ${orbMax}, ${Gv}, false)`);
  const t = r.targets[0];
  return { B: t.B.slopeDeg, nB: t.B.nPeri, nan: r.nan, clamp: r.clamp, steps: r.steps, warnings: (b0.warnings || []).length,
    core: b0.geo ? b0.geo.core : null, role: b0.geo ? b0.geo.role : null, pn1: b0.geo ? b0.geo.pn1 : null,
    osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu },
    grDeg: DEG * G1.gr1pnAdvanceRad({ GM: osc0.mu, c, a: osc0.a, e: osc0.e }) };
};

// ---------------------------------------------------------------- 制御二体(第285便b の R97 と同じ条件)
const COND = { G: 1, M: 10, a: 10, e: 0.3, c: 100, eps: 0.01, dt: 0.01, orbits: 8, detector: 'B', sources: 'both pnSource・both free・barycentre at rest' };
const KAPPAS = [1e-3, 1e-6, 1e-9];
const QS = [1, 1e-4];
const mk = (q, lam, geoPN, kFrame, tag) => {
  const m1 = COND.M / (1 + q), m2 = COND.M * q / (1 + q);
  return G1.boundBinary({ id: 'w287b_' + tag + '_q' + String(q).replace('.', 'p') + '_l' + lam, m1, m2, a: COND.a, e: COND.e, G: COND.G, lambdaPN: lam, geoPN,
    // 0<κ<1 は宣言が無いと読み込み時に最寄りの 0/1 へ丸められる(第275便a)—— 診断コピーだけ kFrameApprox:"sample-only" を宣言する
    physics: Object.assign({ cLight: COND.c, softening: COND.eps, softeningFloor: COND.eps, kFrame }, (kFrame > 0 && kFrame < 1) ? { kFrameApprox: 'sample-only' } : {}) });
};
const rows = [];
for (const q of QS) {
  const m1 = COND.M / (1 + q), m2 = COND.M * q / (1 + q), nu = m1 * m2 / (COND.M * COND.M);
  const e1 = runPeri(mk(q, 1, 1, 0, 'eih'), COND.dt, COND.orbits), e0 = runPeri(mk(q, 0, 1, 0, 'eih'), COND.dt, COND.orbits);
  const gr = e0.grDeg;
  const eih = { geoPN: 1, kFrame: 0, core: e1.core, role: e1.role, pn1: e1.pn1, lam1B: e1.B, lam0B: e0.B, inc: e1.B - e0.B, ratio: (e1.B - e0.B) / gr, nB: e1.nB,
    nan: e1.nan || e0.nan, clamp: e1.clamp + e0.clamp };
  const pair = [];
  for (const k of KAPPAS) {
    const d1 = runPeri(mk(q, 1, 2, k, 'dfm' + k), COND.dt, COND.orbits), d0 = runPeri(mk(q, 0, 2, k, 'dfm' + k), COND.dt, COND.orbits);
    pair.push({ geoPN: 2, kFrame: k, core: d1.core, role: d1.role, pn1: d1.pn1, lam1B: d1.B, lam0B: d0.B, inc: d1.B - d0.B, ratio: (d1.B - d0.B) / gr, nB: d1.nB,
      nan: d1.nan || d0.nan, clamp: d1.clamp + d0.clamp, warnings: d1.warnings });
  }
  const lim = pair[pair.length - 1];
  rows.push({ q, nu, grDeg: gr, osc0: e0.osc0, eih, pairOnly: pair,
    analytic: { eih: 1, pairOnly: 1 - 10 * nu / 3 },
    eihOverPairOnly: eih.inc / lim.inc,
    pairLimitSpread: Math.max(...pair.map((z) => z.ratio)) - Math.min(...pair.map((z) => z.ratio)) });
  const z = rows[rows.length - 1];
  log(`q=${q} ν=${nu.toFixed(5)}: EIH ${eih.ratio.toFixed(6)}(core ${eih.core}・${eih.pn1})/ DFM 経路 κ→0⁺ ${pair.map((p) => p.ratio.toFixed(6)).join(' → ')}(core ${lim.core}・解析 1−10ν/3 ${(1 - 10 * nu / 3).toFixed(6)})/ 倍率 ${z.eihOverPairOnly.toFixed(4)}`);
}

// ---------------------------------------------------------------- 第285便b の記録との照合(基点の旧 kF0 則 = 試験粒子形 + 対反作用)
let pn1Ref = null;
try {
  const P = JSON.parse(fs.readFileSync(path.join(ROOT, PN1_JSON), 'utf8'));
  const a1 = ((P.A || {}).rows || []).find((z) => z.q === 1), a4 = ((P.A || {}).rows || []).find((z) => z.q === 1e-4);
  pn1Ref = { file: PN1_JSON, q1: a1 ? { ratioBaseB: a1.ratioBaseB, ratioNowB: a1.ratioNowB } : null, q1e4: a4 ? { ratioBaseB: a4.ratioBaseB, ratioNowB: a4.ratioNowB } : null,
    note: '第285便b の (A): 基点 b92ffa1 の旧 kF0 則(geoPN=1 → core 2 = 試験粒子形 + 対反作用)と現行の EIH。本器の DFM 経路 κ→0⁺ の極限と同じ形' };
} catch (e) { pn1Ref = { file: PN1_JSON, error: String(e).slice(0, 120) }; }
const r1 = rows.find((z) => z.q === 1), r4 = rows.find((z) => z.q === 1e-4);
const lim1 = r1.pairOnly[r1.pairOnly.length - 1];

// ---------------------------------------------------------------- DFM 版へ EIH を足すときの手順(実装しない —— 宣言だけ)
const procedure = {
  status: 'not-implemented', ruling: '原仮定者の裁定(第77報)AN61・AN75',
  refuse: 'geoPN=2 ∧ kFrame>0(DFM 版)に `dfmPN1EIHKick` をそのまま足さない —— 対反作用(`geo2 && !pinned` の ∇U 因子の運動量の反作用)と EIH の式に内在する反作用が重なり、'
    + '輸送 3 項(`geo2 && kFrame>0`)が 1PN の読む速度から引いた u と EIH が仮定する調和座標の速度も混ざる',
  ifEverTried: [
    '対反作用の分岐を**明示に切る**宣言(診断コピーだけ —— 内蔵の本を変えない)',
    '置換差分 a_new = a_old + λ_PN·(a_EIH,1PN − a_old,1PN)(1PN を二重に加えない)',
    '輸送 3 項は引きずりとして残し、a_1PN と a_transport を**別帳簿**にする(同一状態でメッシュ分と PN 分を別々に取り出せる)',
  ],
  acceptance: [
    'u=0 で既存の kF0(EIH)にビットで戻る',
    '試験粒子の極限(q→0)で試験粒子形に戻る',
    '有限質量比(q=1)で相対二体の 1PN(近点移動の比 1)に一致する',
    'λ_PN=0 で PN 分が消える(λ=0 の基線に戻る)',
    '1PN を二重に加えない(置換差分の和が a_EIH,1PN 1 回分)',
    '同一状態でメッシュ分(輸送)と PN 分を別々に取り出せる(帳簿が閉じる)',
  ],
  counterExample: '切らずに足した走行は**二重計上の反例**として残し、較正に使わない',
};

const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第287便b', target: TARGET, inputs: [TARGET, CALAUDIT, PN1_JSON],
    code: ['tests/exp-w287b-eihdiag.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w280a-mercury.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'] }),
  harnessVersion: HARNESS_VERSION, role: 'diagnostic', ruling: '原仮定者の裁定(第77報)⑤・AN61・AN75・統括の検証項目 R110',
  htmlPn1Version: H.evalExpr('PN1_EIH_VERSION'), htmlGeoModeVersion: H.evalExpr('GEO_MODE_VERSION'), coreTable: Array.from(H.evalExpr('GEO_CORE_PN')),
  note: 'geoPN はアプリのモード番号(標準理論の 2PN・3PN ではない)。kF0 の 1PN は PPN(β=1・γ=α−½)の N 体 1PN(α=1.5 で EIH)—— DFM から導出した項ではない。'
    + '本器は**診断**で、正式判定の語を作らない。html・S._core は 1 bit も変えていない(器の中の宇宙の 2 経路を並べただけ)。',
  cond: COND, kappas: KAPPAS, rows,
  line: {
    what: 'kF0 写しの診断 1 行: 制御二体(q=1)で、現行 EIH の近点移動の λ 増分 / DFM 経路 κ→0⁺ の極限(試験粒子形 + 対反作用)の λ 増分',
    eihRatio: r1.eih.ratio, pairOnlyRatio: lim1.ratio, pairOnlyAnalytic: r1.analytic.pairOnly, factor: r1.eihOverPairOnly,
    testLimit: { eihRatio: r4.eih.ratio, pairOnlyRatio: r4.pairOnly[r4.pairOnly.length - 1].ratio, factor: r4.eihOverPairOnly },
    says: '等質量で約 6 倍違う(試験粒子の極限では一致する)—— DFM 版に EIH の差分を足すと対反作用と重なる。**足さない**(手順は procedure)',
  },
  pn1Ref,
  procedure,
  doNotWrite: ['geoPN=2 に EIH を入れた', 'DFM 版の 1PN が GR と合った', 'λ_PN=1 で既に GR と合った', '観測一致を達成した', '較正を完了した', 'kF0 版が成立した', '新発見'],
  headless: { wallSec: H.ms ? H.ms / 1000 : null, errors: (H.errors || []).length },
  elapsedS: (Date.now() - t0) / 1000,
};
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log(`書いた ${path.relative(ROOT, OUT)} —— 等質量の倍率 ${r1.eihOverPairOnly.toFixed(4)}(EIH ${r1.eih.ratio.toFixed(6)} / 対反作用だけ ${lim1.ratio.toFixed(6)}・解析 ${r1.analytic.pairOnly.toFixed(6)})・試験粒子の極限 ${r4.eihOverPairOnly.toFixed(6)}`);
