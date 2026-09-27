// 第283便a(原仮定者の裁定(2026-09-26 追加)「geoPN の整理」・原仮定者の裁定(第73報)AN23・統括の検証項目 R83):
// **geoPN 共通化便の純関数**(副作用なし・ファイルを書かない・html を書き換えない)。
//
// ■ 裁定の文(原仮定者の裁定(2026-09-26 追加)): 「0=測地線不用 / 1=観測値をそのまま再現する本(1PN の測地線・引きずり無し
//   kFrame=0。このモードの現実較正が物理エンジンの精度の裏付け)/ 2=引きずり有り(kFrame=1・簡易版。支配天体が 1 つなら 1 相当の
//   較正も可)/ 3=空間メッシュ(複素決定力場・連星や多体・アナロジー)。0/1/2 の違いは λ_PN と kFrame の 0/1 だけなので処理を
//   共通化。3 は排他だが spaceMesh フラグを設けて geoPN をプリセットのモード選択にする」「kF0 版=kFrame=0 の本(現状は主に
//   geoPN=2 → 明示的に kFrame=0 の geoPN=1 へ変更)/ DFM 版=geoPN=2 かつ kFrame=1(geoPN=1 の DFM 版は無い)/ geoPN=0・3 は
//   アナロジー専用で現実較正に該当しない」。
// ■ geoPN は**アプリのモード番号**である(標準理論の 2PN・3PN ではない)。
//
// ■ 何を配るか
//   ① 定数(器と QA が同じ集合を使う): kF0 診断コピー 7 本・そのうち geoPN 2→1 へ移した 4 本・geoPN:1 の内蔵
//   ② 状態の指紋(`stateHash` —— Float64 のビット列を FNV-1a で畳む)と 2 つの状態のビット比較(`bitCompare`)
//   ③ 近点移動比の解析(geoPN=1 の旧則 1−11ν/3・反作用を返す則 1−10ν/3 —— 第282便b の `advanceRatio` を読む)
//   ④ QA `behavior.geo1Momentum` の**新しい記録**(第283便a の実測 —— geoPN=1 の Σm·vx は 0)
//   ⑤ PHYSICS〔第283便a〕に載るべき数(正本から同じ書式で作る)
//
// ■ しないこと: 値を測らない(測るのは器 tests/exp-w283a-geomode.mjs)。「観測一致を達成した」「較正を完了した」
//   「kF0 版が成立した」とは書かない —— ここで示すのは「処理の共通化で何が 1 bit も動かず、何が動いたか」だけである。
import { advanceRatio, gaussAdvanceBasis } from './lib-w282b-geo1.mjs';

export const GEOMODE_W283A_VERSION = 'w283a-geomode-1';

/** html の `GEO_MODE_VERSION`(器と QA が照合する) */
export const HTML_GEO_MODE_VERSION = 'w283a-geomode-1';

/** kF0 診断コピー 7 本(較正母集団 37 本の外・sampleClass:"principle") */
export const KF0_DIAG_COPIES = [
  { id: 'earthMoonDiagOne', emoji: '🌓' }, { id: 'mercuryGeoToy3', emoji: '🔁' }, { id: 'charonGeoToy3', emoji: '🌒' },
  { id: 'plutoCharonDiagInput', emoji: '🥶' }, { id: 'plutoCharonSyncZero', emoji: '☃️' },
  { id: 'saturnD68Consistent', emoji: '🧷' }, { id: 'saturnD68ObsOrbit', emoji: '📎' }];

/**
 * 7 本のうち **geoPN 2→1 へ宣言を移した 4 本**(kFrame=0 かつ geoPN=2 だったもの)。
 * 🔁🌒 は geoPN=3(空間メッシュの契約の診断コピー)・☃️ は geoPN=0(1PN を切った零試験)なので**移さない**
 * (移すと 1PN の有無や経路が変わる = 物理が変わる)。
 */
export const KF0_MIGRATED = ['earthMoonDiagOne', 'plutoCharonDiagInput', 'saturnD68Consistent', 'saturnD68ObsOrbit'];

/** geoPN:1 を宣言する内蔵(⭐ は第283便a で kFrame 1→0 —— 受理器の契約) + VERIFY の V18 */
export const GEO1_BUILTINS = ['mercury', 'binary'];

/** 較正母集団(calaudit の 37 本)の kF0 診断コピーの宣言規則(calaudit の `__w249build(id, true)` と同じ) */
export function kf0Copy(preset, rule) {
  const p = JSON.parse(JSON.stringify(preset));
  p.physics = p.physics || {};
  p.physics.kFrame = 0;
  if (rule === 'w283a' && p.physics.geoPN === 2) p.physics.geoPN = 1;   // 第283便a: geoPN=2 → 1(0・3 は書き換えない)
  return p;
}

// ---------------------------------------------------------------- ② 指紋とビット比較
const KEYS = ['x', 'y', 'vx', 'vy', 'spin'];
/** 状態(配列の辞書 {x,y,vx,vy,spin,…})を Float64 のビット列で FNV-1a に畳む(16 進 8 桁) */
export function stateHash(st, keys = KEYS) {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
  for (const k of keys) { const A = st[k] || []; push(A.length); for (let i = 0; i < A.length; i++) push(A[i]); }
  if (st.t !== undefined) push(st.t);
  return a.toString(16).padStart(8, '0');
}
/** 2 つの状態のビット比較(Object.is —— −0 と +0 も区別する)と位置・速度の最大差 */
export function bitCompare(a, b, keys = KEYS) {
  let nDiff = 0, maxPos = 0, maxVel = 0;
  const n = Math.max((a.x || []).length, (b.x || []).length);
  if ((a.x || []).length !== (b.x || []).length) return { bitSame: false, nDiff: n, maxPos: Infinity, maxVel: Infinity, n };
  for (let i = 0; i < n; i++) {
    let d = false;
    for (const k of keys) if (!Object.is(a[k][i], b[k][i])) d = true;
    if (d) nDiff++;
    maxPos = Math.max(maxPos, Math.hypot(a.x[i] - b.x[i], a.y[i] - b.y[i]));
    maxVel = Math.max(maxVel, Math.hypot(a.vx[i] - b.vx[i], a.vy[i] - b.vy[i]));
  }
  const tSame = (a.t === undefined && b.t === undefined) || Object.is(a.t, b.t);
  return { bitSame: nDiff === 0 && tSame, nDiff, maxPos, maxVel, n };
}

// ---------------------------------------------------------------- ③ 近点移動比の解析
/** Δϖ/Δϖ_GR の解析(旧 geoPN=1: 1−11ν/3・反作用を返す則〔新 geoPN=1 = geoPN=2∧kFrame=0〕: 1−10ν/3)。基底は Gauss 積分 */
export function analyticRatios(nu, e = 0.3) {
  const basis = gaussAdvanceBasis(e, 200000);
  return { oldGeo1: advanceRatio('geo1', nu, basis), reaction: advanceRatio('geo2', nu, basis),
    closedOld: 1 - 11 * nu / 3, closedReaction: 1 - 10 * nu / 3 };
}

// ---------------------------------------------------------------- ④ QA behavior.geo1Momentum の新しい記録
/**
 * 自由二体(lib-w282b-geo1 の `freeTwoBody()`)の 1 歩の Σm·vx(dt 0.001 / 0.0005)。**第283便a の器の実測**。
 * geoPN=1 は 1PN の反作用を自由源へ返すので **g1 も 0**(第282便b の記録 `GEO1_MOMENTUM_RECORD` の g1 = 8.00×10⁻⁸ /
 * 4.00×10⁻⁸ は反作用を返さなかった旧則の値 —— 正本 geo1-w282b.json〔履歴〕に残る)。他の法則の値は第282便b と同じ。
 */
export const GEO1_MOMENTUM_RECORD_W283A = {
  dts: [0.001, 0.0005],
  px: { g0: [0, 0], g1: [0, 0], g2: [0, 0], g3raw: [0, 0],
    g3toy: [-9.956709874387677e-7, -4.978354893540471e-7], g3vmu: [0, 0], newton: [0, 0] },
  previousG1: [7.999999840000143e-8, 3.9999999200000715e-8],
  note: '第283便a(AN23): geoPN=1 は 1PN の反作用を自由源へ返す —— g1 は g2・g1R と同じ 0。g3toy の粒子の Σm·vx はメッシュの帳簿へ移った分',
};

/** 書かない語(PHYSICS〔第283便a〕と正本の本文 —— doNotWrite 欄そのものは除く) */
export const FORBIDDEN_W283A = ['観測一致を達成', '較正を完了', 'f=1 で合った', 'kF0 版が成立', '精度を上げれば成立', '新発見',
  '判定が増えた', 'RC を切った', '運動量保存違反'];

/** 指数表記を本文の形へ(例 7.99999984e−8 → "8.00×10⁻⁸"・負号は "−") */
export function fmtE(x, d = 2) {
  if (x === 0) return '0';
  const [m, e] = Number(x).toExponential(d).split('e');
  const ex = String(Number(e));
  const sup = ex.split('').map((ch) => (ch === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch])).join('');
  return (m.startsWith('-') ? '−' + m.slice(1) : m) + '×10' + sup;
}

/**
 * PHYSICS〔第283便a〕に**そのまま載っているべき数**(QA `docs.geoMode` —— 正本の値から同じ書式で作る)。
 * @param {object} J 正本 geomode-w283a.json
 */
export function physicsNumbers(J) {
  const out = [];
  const A = J.derive || {};
  out.push(String(A.n));
  for (const k of ['0', '1', '2', '3']) out.push(`geoPN=${k} ${((A.byMode || {})[k] || 0)} 本`);
  out.push(`互換 ${(A.compatPending || []).length} 本`);
  const B = J.before || {};
  out.push(`${B.bitSame128}/${B.n}`, `${B.sigSame}/${B.n}`);
  const C = J.kf0 || {};
  out.push(`${C.bitSameNow}/${C.n}`);
  const D = J.binary || {};
  if (D.oneStep) out.push(fmtE(D.oneStep.base[0]));
  if (D.preset) out.push(D.preset.base.sep.toFixed(2), D.preset.now.sep.toFixed(2));
  for (const r of (D.ratios || [])) if (r.c === 10) out.push(r.nowRatio.toFixed(4));
  return out;
}

/** 相対差(0 同士は 0) */
export function relErr(a, b) {
  if (a === b) return 0;
  const s = Math.max(Math.abs(a), Math.abs(b));
  return s > 0 ? Math.abs(a - b) / s : 0;
}
