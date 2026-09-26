// 第282便c(原仮定者の裁定(第72報)④「較正は引きずりパラメータで行い、天体種別と相対自転で分けて観測値に合わせる。
// 中心密度が高い場合、計算で使う半径は外殻の半径をそのままでは使えない」・統括の読み R80)—— **引きずりプロファイル便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)
//   ① **kF0 は引きずりでは直らない**: ✴️ alphaCenABDFM と ⚡ psrDoubleABDFM を kFrame=0 に置き換えたコピー(器の中だけ)で、
//      引きずり減衰 q(両星の body.dragQ)=2 と 8 を geoPN=1/2 の 4 条件で 128 歩(sim.step(DT))走らせ、位置・速度・自転
//      (殻 spin と独立コアの J)をビットで比べる。physics.q=2/8(body.dragQ を外したコピー)も同じ 4 条件で。
//      対照: kFrame=1 では geoPN=2 で q が効く(差の最大値)。**geoPN=1 では kFrame=1 でも q が効かない・kFrame 1/0 もビット一致**
//      (🌘 earthMoonRealKF1 を足した 3 本)—— 構造の理由(E6′ の門 `kFrame>0 && !geo`・geoPN=2 の輸送の門 `geo2&&kFrame>0`)を
//      html のソースから引用して並べる。
//   ② 純関数 tests/lib-w282c-dragprofile.mjs の単体試験・密度クラスの参照表(R_drag/R・I/(MR²)・ρ_c/ρ̄・2D の ½mR² との比)。
//   ③ 診断表: 較正対象(太陽系 12・恒星連星 2・NS 連星 4・🎻)の現状の {q, kFrame, 自転の代理値, 外殻半径 R, 密度クラス, R_drag,
//      ΔΩ の符号}・NS/BH の「R_drag 用のコア半径」欄(現状は未宣言 —— core.radius は隠れコアの半径として別に並べる)。
//   ④ profileOf を内蔵で唯一 densityClass を宣言した 🌓 earthMoonDiagOne に当てる(地球の R_drag)。
//
// ■ しないこと
//   ・エンジンへ接続しない・既存 140 本の物理を変えない・プリセットを足さない(コピーは器の中だけ)・fit しない。
//   ・「kF0 版が成立した」「引きずりで合った」と書かない —— ① は「q を変えても kF0 の力学は 1 bit も動かない」ことの実測である。
//
// 環境変数: なし(`QA_TARGET` で対象 html を替えられる —— 既定 beta/index.html)。他の正本は読まない。
// 実行: node tests/exp-w282c-dragprofile.mjs(数秒)
// 出力: tests/out/dragprofile-w282c.json(来歴 w272e-1・領域 hash つき)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w282c-dragprofile.mjs';
// 第281便a の規約: **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["alphaCenABDFM","earthMoonDiagOne","earthMoonRealKF1","gas","gw150914DFM","jupiterGalilean","marsMoonsReal","mercuryReal","neptuneReal","plutoCharonReal","psrB1534DFM","psrDoubleABDFM","psrJ1757DFM","psrJ1946DFM","saturnRingReal","saturnRingRealKF1","saturnZonalD68","siriusABDFM","solarInner","uranusReal","venusReal"],"roots":["DT","HP.allPresets","HP.sim","HP.validatePreset","dfmAddMoments","dfmBlendComplexMoments","dfmComplexMomentsOf","dfmGaussLegendre01","dfmLaneEmden","dfmMeshVelocityRHS","dfmSphereKernelMomentsOf","dfmSphereKernelQEff","dfmSphereKernelRadial","dfmSphereOmega","dfmSphereProfile","dfmSphereRho","isNum"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'dragprofile-w282c.json');
export const HARNESS_VERSION = 'w282c-dragprofile-1';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const t0 = Date.now();

const H = loadHtmlHeadless(path.join(ROOT, TARGET));
const HP = H.HP;
const DT = H.evalExpr('DT');
const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const P = L.makePure(html);
const { kf0, control, gates, units, classes, table, nRows, nDensityDeclared, diagProfile, earthR, earthDecl, earth, vRelExample } = L.measureAll(HP, DT, html, P);
const { TABLE_PRESETS, TABLE_EXCLUDED, KF0_PRESETS, Q_PAIR, N_STEPS } = L;
const allKf0Same = kf0.every((r) => r.dragQ.bitSame && r.physicsQ.bitSame);
const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第282便c', target: TARGET, inputs: [TARGET],
    code: ['tests/exp-w282c-dragprofile.mjs', 'tests/lib-w282c-dragprofile.mjs', 'tests/lib-w280b-sphereKernel.mjs',
      'tests/lib-w279c-bgcompose.mjs', 'tests/lib-w278d-readaudit.mjs', 'tests/lib-w275b-meshfield.mjs',
      'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'] }),
  harnessVersion: HARNESS_VERSION, libVersion: L.DRAGPROFILE_VERSION,
  ruling: '第72報 ④: 較正は引きずりパラメータで行い、天体種別と相対自転で分けて観測値に合わせる。中心密度が高い場合、計算で使う半径は外殻の半径をそのままでは使えない',
  note: 'エンジン未接続・既存 140 本の物理は不変・プリセットは足していない・fit していない。R_drag は宣言した近似(表裏核の厳密解ではない)。'
    + '相対自転チャネルは候補式(現象論・未実証)。',
  kf0: { presets: KF0_PRESETS, qPair: Q_PAIR, steps: N_STEPS, dt: DT, rows: kf0, allBitSame: allKf0Same,
    conclusion: allKf0Same ? 'kFrame=0 では q(body.dragQ・physics.q)を 2→8 にしても 128 歩の位置・速度・自転が 1 bit も変わらない(4 条件 × 2 種)'
      : 'kFrame=0 で q が効く条件がある(行を見ること)' },
  control: { rows: control, gates,
    note: '対照: q が効くのは geoPN=2(または 0)で kFrame=1 のときだけ。第283便a から geoPN=1 は kFrame=0 専用で、kFrame=1 の写しは受理器が拒否する(旧 html では E6′ の門〔!geo〕と輸送の門〔geo2〕が閉じて q も kFrame も物質の力学に入らなかった)' },
  units, classes,
  table: { presets: TABLE_PRESETS.map(([id, g]) => ({ id, group: g })), excluded: TABLE_EXCLUDED, nPresets: table.length, nRows, nDensityDeclared,
    syncRelTol: L.SYNC_REL_TOL, rows: table },
  diagOne: { id: 'earthMoonDiagOne', profile: diagProfile, earth: { R: earthR, decl: earthDecl, R_drag: earth.R_drag, ratio: earth.ratio, kI: earth.kI,
    rhoCenterOverMean: earth.rhoCenterOverMean } },
  vRelExample,
  doNotWrite: ['観測一致を達成した', '較正を完了した', 'f=1 で合った', 'kF0 版が成立した', '引きずりで kF0 を合わせた', '引きずり消失を確認した', '新発見'],
  headlessMs: H.ms, headlessErrors: H.errors.length, elapsedS: null,
};
out.elapsedS = (Date.now() - t0) / 1000;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');

const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(2));
console.log('[w282c] ① kF0 不感: ' + kf0.map((r) => `${r.emoji}geo${r.geoPN} dragQ ${r.dragQ.bitSame} / physics.q ${r.physicsQ.bitSame}`).join(' ・ '));
console.log('[w282c]    対照 kF1: ' + control.map((r) => r.rejected ? `${r.emoji}geo${r.geoPN} 受理器が拒否(geoPN=1 は kFrame=0 専用)` : `${r.emoji}geo${r.geoPN} q2/8 ${r.kF1DragQ2vs8.bitSame ? '同一' : '差 pos ' + e(r.kF1DragQ2vs8.maxAbs.pos)} ・ kF0/1 ${r.kFrame0vs1.bitSame ? '同一' : '差 pos ' + e(r.kFrame0vs1.maxAbs.pos)}`).join(' / '));
console.log('[w282c]    門: ' + gates.map((g) => g.key + '×' + g.count).join(' '));
console.log('[w282c] ② 単体試験 ' + units.rows.filter((r) => r.pass).length + '/' + units.rows.length + ' ・ R_drag/R ' + classes.map((c) => c.key + ' ' + c.ratio.toFixed(4)).join(' / '));
console.log(`[w282c] ③ 診断表 ${table.length} 本・${nRows} 行(densityClass 宣言 ${nDensityDeclared})・ 連星: ` + table.filter((t) => t.lock).map((t) => t.emoji + L.LOCK_JA[t.lock]).join(' '));
console.log(`[w282c] ④ 🌓 地球 R_drag=${earth.R_drag}(R=${earthR}・比 ${earth.ratio.toFixed(6)})→ ${path.relative(ROOT, OUT)}(${out.elapsedS.toFixed(1)} s)`);
