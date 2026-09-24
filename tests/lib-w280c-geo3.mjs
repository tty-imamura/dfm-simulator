// 第280便c(原仮定者の裁定〔第70報〕「近点移動の差分を精査する — geoPN=3 として進める」・統括の読み R65):
// **geoPN=3 契約の検算器の純関数**(副作用なし・html を書き換えない)。
//
// ■ 何を配るか
//   ・`makeGeo3Copy(base, o)` … 内蔵プリセットの**複製**に geoPN=3 の契約鍵を宣言する
//     (spaceMesh.lawVersion:"vMinusU"・pn・pnVelocity・velocityMeaning と、輸送経路 physics.meshVelocity・
//      背景 physics.backgroundComplex)。**内蔵そのものは 1 bit も書き換えない**(JSON の深い複製)。
//   ・`uniformBackground(V, W0, note)` … 一様な u=V の背景(A=W V・∇A=V⊗∇W・時間微分 0)。**点源 1 個の場は
//     mutual:0 で u が一様**(A=w v_S・W=w)という第279便c の結論を、背景の宣言形で置いたもの。
//   ・`extractCalauditPageHelpers(text)` … 正式の判定器 `tests/exp-w249b-calaudit.mjs` の**ページ側ヘルパ**
//     (`__w249map`/`__w249build`/`__w249osc0`/`__w249run` —— 近点通過〔ṙ の −→+ 交差〕の方位の回帰)を
//     **ソースの文字列のまま**取り出す(写しを持たない —— 同じ抽出器で測るため)。
//   ・`geo3Rows(...)` 等の比較の小関数。
//
// ■ しないこと
//   ・値を作らない(測るのは器 `tests/exp-w280c-geo3.mjs`)。**観測との一致・較正を主張しない**。
export const GEO3_HARNESS_VERSION = 'w280c-geo3-1';

/** 凍結参照系(背景の値をどの系で持つか)—— 診断コピーの既定 */
export const GEO3_FRAME = { origin: 'barycenter', epoch: 't0(第280便c の診断コピー)', rotation: 'none', translation: 'comoving' };

/** 一様な u=V の背景の宣言(W0 は正であれば値そのものは u に効かない —— u=A/W) */
export function uniformBackground(V, W0 = 1, note = '第280便c: 一様な座標変換 u=V の零試験(点源 1 個の mutual:0 の場と同じ形)', frame = GEO3_FRAME) {
  return {
    background: 'declared', note, W0,
    A0: [W0 * V[0], W0 * V[1]], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0],
    sources: [{ id: 'uniform-u', kind: 'field', excludedExplicit: true }],
    frame: Object.assign({}, frame),
  };
}

/**
 * 内蔵の複製に geoPN=3 の契約を宣言する。
 * @param {object} base 内蔵プリセット(読むだけ)
 * @param {object} o {id, pn, pnVelocity, velocityMeaning, background, field, mutual, external, frame, keepMeta}
 */
export function makeGeo3Copy(base, o) {
  const p = JSON.parse(JSON.stringify(base));
  const s = o || {};
  p.id = s.id || (base.id + 'Geo3Probe');
  if (!s.keepMeta) {
    for (const k of ['claims', 'obsCard', 'descStruct', 'en', 'failureFirst', 'parameterAudit', 'abBody', 'abQuick',
      'calibrationForecast', 'massCalibration', 'status', 'brief', 'familyId', 'familyRole', 'evidence']) delete p[k];
  }
  p.sampleClass = 'principle';
  const ph = p.physics = Object.assign({}, p.physics);
  ph.geoPN = 3; ph.kFrame = 0;
  const sm = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'vMinusU', pn: s.pn || 'off' };
  if (sm.pn === 'reference-1PN') sm.pnVelocity = s.pnVelocity;
  sm.velocityMeaning = s.velocityMeaning;
  ph.spaceMesh = sm;
  const frame = Object.assign({}, s.frame || GEO3_FRAME);
  const field = s.field || 'backgroundComplex';
  if (field === 'backgroundComplex') {
    ph.backgroundComplex = Object.assign(JSON.parse(JSON.stringify(s.background)), { frame });
    ph.meshVelocity = { law: 'vMinusU', field, mutual: s.mutual === undefined ? 0 : s.mutual, frame };
  } else {
    delete ph.backgroundComplex;
    ph.meshVelocity = { law: 'vMinusU', field, mutual: s.mutual === undefined ? 0 : s.mutual, frame, external: s.external.slice() };
  }
  return p;
}

/** 較正の器のページ側ヘルパ(`await pg.evaluate((PERI_WINDOW) => { … }, PERI_WINDOW);` の中身)を文字列で取り出す */
export function extractCalauditPageHelpers(text) {
  const head = 'await pg.evaluate((PERI_WINDOW) => {';
  const i0 = text.indexOf(head);
  if (i0 < 0) throw new Error('calaudit のページ側ヘルパの入口が見つからない');
  const tail = '}, PERI_WINDOW);';
  const i1 = text.indexOf(tail, i0);
  if (i1 < 0) throw new Error('calaudit のページ側ヘルパの出口が見つからない');
  const body = text.slice(i0 + head.length, i1);
  for (const name of ['window.__w249map', 'window.__w249build', 'window.__w249osc0', 'window.__w249run'])
    if (body.indexOf(name) < 0) throw new Error('ヘルパ ' + name + ' が取り出した本文に無い');
  return body;
}

/** 近点移動(°/周)の差を 1PN 値に対する比で読む小関数(null は null のまま) */
export function relDiff(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return (a - b);
}

/** 1 走行の要約(__w249run の戻り値 → 表の 1 行) */
export function summarizeRun(r, toSec) {
  const t = r.targets[0];
  return {
    steps: r.steps, dt: r.dt, nan: r.nan, clamp: r.clamp,
    nPeriA: t.A.nPeri, slopeDegPerOrbitA: t.A.slopeDeg, residDegA: t.A.residDeg,
    slopeDegPerOrbitB: t.B.slopeDeg, nPeriB: t.B.nPeri,
    periMeanA20S: (t.A.perMean === null) ? null : t.A.perMean * toSec,
    rev2S: (t.revP && t.revP.length > 1) ? t.revP[1] * toSec : null,
    revN: t.revN, eProxy: t.eProxy,
  };
}
