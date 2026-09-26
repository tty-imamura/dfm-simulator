// 第282便b(原仮定者の裁定(第72報)⑤「現実較正は geoPN=1 で進め、比較に geoPN=2 または 3」・統括の検証項目 R79):
// **geoPN=1 主系列便の純関数**(副作用なし・ファイルを書かない・html を書き換えない)。
//
// ■ geoPN は**アプリのモード番号**である(0=legacy・1=E12 の試験粒子 1PN・2=v−u 統一測地線則と反作用返し・
//   3=座標変換/トイの研究系列)。**標準理論の 2PN・3PN(ポストニュートン展開の次数)ではない**。
//
// ■ 何を配るか
//   ① E12 の試験粒子形(html の `pairCorePN` / 汎用対ループと同じ係数・同じ軟化)の加速度 `e12TestAccel`。
//   ② 自由二体に「固定中心用の試験粒子 1PN を相互に当てて反作用を返さない」(= 現行の geoPN=1)ときの
//      Σm·a(`pairMomentumRateGeo1`)と、重心系の閉形式(`comMomentumRateClosedForm` —— 軟化なし)。
//   ③ 相対加速度の 1PN 係数 (A,B,C,D)(法則ごと)と、Gauss の摂動方程式を 1 周積分した近点移動の係数
//      (`gaussAdvanceBasis` —— 数値積分で A→−1・B→−2・C→+2・D→0 を**導く**)・比 Δϖ/Δϖ_GR(`advanceRatio`)。
//   ④ 反作用返しの**対照コピー**を作る文字列置換(`patchReactionScript` —— 器の中だけ・本体は変えない)。
//   ⑤ 器の中の宇宙(自由二体・束縛二体・固定源)と、主系列の見本 `mercuryGeo1KF0` の principle コピー。
//
// ■ しないこと
//   ・値を測らない(測るのは器 `tests/exp-w282b-geo1.mjs`)。**観測との一致・較正を主張しない**。
//   ・Σm·v の非保存を「一般相対論の保存則に反する」とは言わない —— 相対論的な二体の全運動量は Σm·v ではない
//     (1PN の保存量は速度と位置の補正項を含む)。ここで数えるのは**このアプリの状態変数の Σm·v** である。
import { makeGeo3Copy, uniformBackground } from './lib-w280c-geo3.mjs';

export const GEO1_W282B_VERSION = 'w282b-geo1-1';

/** E12 の係数(html: cA=1+2α・cB=α−½) */
export function e12Coef(alpha = 1.5) { return { cA: 1 + 2 * alpha, cB: alpha - 0.5 }; }

/**
 * E12 の試験粒子形(**源 1 つ**から受け手が受ける 1PN 加速度)。html の `pairCorePN` と同じ式・同じ軟化:
 *   U=G m_j/√(d²+ε²)・∇U=−G m_j (r_i−r_j)/(d²+ε²)^{3/2}
 *   a = (λ/c²)[((α−½)w² − (1+2α)U)∇U − (1+2α)(∇U·w)w]
 * @param {object} o {G, c, lambda, alpha, eps, mj, dx, dy(= r_i − r_j), wx, wy(受け手の速度)}
 */
export function e12TestAccel(o) {
  const { G, c, eps } = o;
  const lambda = o.lambda === undefined ? 1 : o.lambda;
  const { cA, cB } = e12Coef(o.alpha === undefined ? 1.5 : o.alpha);
  const invC2 = lambda / (c * c);
  const d2 = o.dx * o.dx + o.dy * o.dy, invW = 1 / Math.sqrt(d2 + eps * eps);
  const fg = G * invW * invW * invW;
  const U = G * o.mj * invW, gux = -fg * o.mj * o.dx, guy = -fg * o.mj * o.dy;
  const v2 = o.wx * o.wx + o.wy * o.wy, dU = gux * o.wx + guy * o.wy;
  return { ax: invC2 * ((cB * v2 - cA * U) * gux - cA * dU * o.wx), ay: invC2 * ((cB * v2 - cA * U) * guy - cA * dU * o.wy), U };
}

/**
 * 現行の geoPN=1(反作用を返さない相互の試験粒子 1PN)で自由二体が受ける 1PN の Σm·a。
 * 両天体とも 1PN 源(pnSource)・両方 free を前提にする。
 */
export function pairMomentumRateGeo1(o) {
  const b1 = o.b1, b2 = o.b2;
  const base = { G: o.G, c: o.c, lambda: o.lambda, alpha: o.alpha, eps: o.eps };
  const a1 = e12TestAccel(Object.assign({}, base, { mj: b2.m, dx: b1.x - b2.x, dy: b1.y - b2.y, wx: b1.vx, wy: b1.vy }));
  const a2 = e12TestAccel(Object.assign({}, base, { mj: b1.m, dx: b2.x - b1.x, dy: b2.y - b1.y, wx: b2.vx, wy: b2.vy }));
  return { px: b1.m * a1.ax + b2.m * a2.ax, py: b1.m * a1.ay + b2.m * a2.ay, a1, a2 };
}

/**
 * 重心系・軟化なし・α=1.5 の閉形式:
 *   Σm·a₁ₚₙ = G m₁ m₂ (X₂−X₁)/(c² r²) · [(4GM/r − v²) n + 4 ṙ v]
 *   (X_i=m_i/M・n=(r₁−r₂)/r・v=v₁−v₂・ṙ=n·v)。等質量で 0、質量比が 1 から離れるほど大きい。
 */
export function comMomentumRateClosedForm(o) {
  const M = o.m1 + o.m2, X1 = o.m1 / M, X2 = o.m2 / M;
  const r = Math.hypot(o.rx, o.ry), nx = o.rx / r, ny = o.ry / r;
  const v2 = o.vx * o.vx + o.vy * o.vy, rd = nx * o.vx + ny * o.vy;
  const k = o.G * o.m1 * o.m2 * (X2 - X1) / (o.c * o.c * r * r);
  const s = 4 * o.G * M / r - v2;
  return { px: k * (s * nx + 4 * rd * o.vx), py: k * (s * ny + 4 * rd * o.vy) };
}

/**
 * 相対加速度の 1PN 係数:a_rel = −GM n/r² + (GM/(c²r²))[(A GM/r + B v² + D ṙ²) n + C ṙ v]
 *   test … 固定源の試験粒子(GR の Schwarzschild 1PN・調和座標)
 *   eih  … 二体の 1PN(EIH・調和座標)
 *   geo2 … 現行 geoPN=2・kFrame=0(試験粒子形 + ∇U 因子の対反作用 —— 第249便a の同定)
 *   geo1 … 現行 geoPN=1(試験粒子形を相互に当て、反作用を返さない —— 本便の導出)
 * @param {'test'|'eih'|'geo1'|'geo2'} law
 * @param {number} nu 対称質量比 ν=m₁m₂/M²
 */
export function relCoefficients(law, nu) {
  if (law === 'test') return { A: 4, B: -1, C: 4, D: 0 };
  if (law === 'eih') return { A: 4 + 2 * nu, B: -(1 + 3 * nu), C: 4 - 2 * nu, D: 1.5 * nu };
  if (law === 'geo2') return { A: 4, B: -(1 - 2 * nu), C: 4 * (1 - 2 * nu), D: 0 };
  if (law === 'geo1') return { A: 4 * (1 - 2 * nu), B: -(1 - 3 * nu), C: 4 * (1 - 3 * nu), D: 0 };
  throw new Error('未知の法則: ' + law);
}

/**
 * Gauss の摂動方程式 dω/df = (r²/(GM e))[−R cos f + S (1 + r/p) sin f] を Kepler 軌道で 1 周積分し、
 * 基底 4 項(A: GM²/(c²r³) n・B: GM v²/(c²r²) n・C: GM ṙ v/(c²r²)・D: GM ṙ²/(c²r²) n)の近点移動を
 * πGM/(c²p) 単位で返す(中点則・N 分割)。**解析の係数を手で置かず、同じ積分から引く**ための関数。
 */
export function gaussAdvanceBasis(e, N = 200000) {
  const out = { A: 0, B: 0, C: 0, D: 0 };
  const p = 1;   // GM=1・p=1 の単位(結果は πGM/(c²p) 単位で p に依らない)
  for (let k = 0; k < N; k++) {
    const f = (k + 0.5) / N * 2 * Math.PI, cf = Math.cos(f), sf = Math.sin(f);
    const r = p / (1 + e * cf), h = Math.sqrt(p);
    const vr = e * sf / h, vt = h / r, v2 = vr * vr + vt * vt, pre = 1 / (r * r);
    const w = r * r / e;
    const term = (R, S) => w * (-R * cf + S * (1 + r / p) * sf);
    out.A += term(pre / r, 0);
    out.B += term(pre * v2, 0);
    out.C += term(pre * vr * vr, pre * vr * vt);
    out.D += term(pre * vr * vr, 0);
  }
  for (const k of Object.keys(out)) out[k] = out[k] / N * 2 * Math.PI / Math.PI * p;
  return out;
}

/** Δϖ/Δϖ_GR(Δϖ_GR = 6πGM/(c²a(1−e²)))。基底は Gauss 積分の値(既定は解析の −1/−2/+2/0)。 */
export function advanceRatio(law, nu, basis) {
  const b = basis || { A: -1, B: -2, C: 2, D: 0 };
  const q = relCoefficients(law, nu);
  return (b.A * q.A + b.B * q.B + b.C * q.C + b.D * q.D) / 6;
}

/** 1PN の近点移動(rad/周)6πGM/(c²a(1−e²)) */
export function gr1pnAdvanceRad({ GM, c, a, e }) { return 6 * Math.PI * GM / (c * c * a * (1 - e * e)); }

/** Plummer 軟化の近点移動(rad/周)−3πε²/(a²(1−e²)²)(第280便a と同じ一次の式) */
export function softeningAdvanceRad({ eps, a, e }) { const s = 1 - e * e; return -3 * Math.PI * eps * eps / (a * a * s * s); }

// ---------------------------------------------------------------- ④ 反作用返しの対照コピー
/** 置換の対象(html の `pairCorePN` 2 か所 + 汎用対ループ 2 か所 —— 1PN 反作用を自由源へ返す分岐の条件) */
export const REACT_NEEDLE = 'geo2 && !pinned[';
export const REACT_FLAG = '__W282B_REACT__';
export const REACT_EXPECTED = 4;
/**
 * inline script の文字列を受け取り、**反作用返しの条件だけ**を `(geo2||__W282B_REACT__)` にした写しを返す。
 * w の選択(`geo2&&kHasU[i]` —— 空白なし)と ∇u 集積(`g2on`)は変えない。置換数が 4 でなければ投げる。
 * **本体の html は変えない**(器が一時ファイルに書いて読むだけ)。
 */
export function patchReactionScript(script) {
  const s = String(script);
  const parts = s.split(REACT_NEEDLE);
  const count = parts.length - 1;
  if (count !== REACT_EXPECTED) throw new Error(`[w282b] 反作用返しの分岐が ${count} か所(想定 ${REACT_EXPECTED})`);
  return { text: 'var ' + REACT_FLAG + '=true;\n' + parts.join('(geo2||' + REACT_FLAG + ') && !pinned['), count };
}

// ---------------------------------------------------------------- ⑤ 器の中の宇宙
const PHYS0 = { G: 1, cLight: 10, softening: 0.001, softeningFloor: 0.001, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0,
  kappaS: 0, etaRad: 0, lambdaPN: 1, pnAlpha: 1.5, stateCarry: 'double', frameWeight: 'share', timeScale: 1,
  massFloor: 1e-9 };   // 質量の下限床(既定 0.01)を下げる —— 試験粒子 m=1e-6 を力学の mEff でも 1e-6 のまま使うため

/** 器の中の宇宙の骨格(内蔵ではない —— sampleClass:"principle"・較正母集団の外) */
export function probeUniverse(id, physics, bodies, note) {
  return { id, name: id, emoji: '🧪', description: '第282便b 器の中の宇宙(内蔵ではない)— ' + (note || ''),
    sampleClass: 'principle', world: { boundary: 'none', size: 0 }, camera: { scale: 20 },
    physics: Object.assign({}, PHYS0, physics || {}), bodies };
}

/** 自由二体(m=2/1・距離 10・初速 V・自転 0・両体 free・pnSource)—— 検証仮説の宇宙 */
export function freeTwoBody(o) {
  const s = o || {};
  const V = s.V || 0;
  return probeUniverse('w282b_free2', Object.assign({ geoPN: s.geoPN === undefined ? 1 : s.geoPN }, s.physics || {}), [
    { type: 'single', m: 2, x: 0, y: 0, vx: V, vy: 0, spin: 0, pinned: false, pnSource: true },
    { type: 'single', m: 1, x: 10, y: 0, vx: V, vy: 0, spin: 0, pinned: false, pnSource: true }],
  '自由二体 m=2/1・距離 10・G=1・c=10・ε=0.001');
}

/**
 * 束縛二体(重心系・遠点整列)。相対軌道 a・e・重心の速度 V(x 方向)・重心の初期位置 x0。
 * G は GM=1 になるよう 1/M に置く(質量は Float32 で表せる整数比)。半径は明示 0.1(√m の既定半径だと
 * 質量比 99/1 で近点 a(1−e)=7 より大きく、E9 の接触が立つ)。
 */
export function boundBinary(o) {
  const m1 = o.m1, m2 = o.m2, M = m1 + m2, X1 = m1 / M, X2 = m2 / M;
  const G = (o.G === undefined) ? 1 / M : o.G, GM = G * M;
  const a = o.a, e = o.e, r0 = a * (1 + e), vrel = Math.sqrt(GM * (1 - e) / (a * (1 + e)));
  const V = o.V || 0, x0 = o.x0 || 0;
  const pin1 = !!o.pinFirst;
  return probeUniverse(o.id || 'w282b_bin', Object.assign({ G, geoPN: o.geoPN === undefined ? 1 : o.geoPN, lambdaPN: o.lambdaPN === undefined ? 1 : o.lambdaPN },
    o.physics || {}), [
    { type: 'single', m: m1, radius: 0.1, x: x0 - (pin1 ? 0 : X2 * r0), y: 0, vx: pin1 ? 0 : V, vy: pin1 ? 0 : -X2 * vrel, spin: 0, pinned: pin1, pnSource: true },
    { type: 'single', m: m2, radius: 0.1, x: x0 + (pin1 ? r0 : X1 * r0), y: 0, vx: pin1 ? 0 : V, vy: pin1 ? vrel : X1 * vrel, spin: 0, pinned: false, pnSource: true }],
  `束縛二体 m=${m1}/${m2}・a=${a}・e=${e}・V=${V}`);
}

/** 固定源(pinned・m=M)と試験粒子(m=mt)—— 試験粒子 1PN の極限 */
export function fixedSource(o) {
  const s = o || {};
  return probeUniverse('w282b_fixed', Object.assign({ geoPN: s.geoPN === undefined ? 1 : s.geoPN }, s.physics || {}), [
    { type: 'single', m: s.M || 1, radius: 0.1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: s.pinned !== false, pnSource: true },
    { type: 'single', m: s.mt || 1e-6, radius: 0.1, x: s.x || 10, y: s.y || 0, vx: s.vx || 0.1, vy: s.vy || 0.3, spin: 0, pinned: false, pnSource: false }],
  '固定源 + 試験粒子');
}

/**
 * 主系列の見本 `mercuryGeo1KF0`(**principle コピー**・較正母集団の外・内蔵ではない):
 * ☄️ mercuryReal の physics と bodies を**ビット同一で複製**し、`physics.geoPN` だけを 1 にする(f=1・kFrame=0・
 * λ_PN=1・ε・dt は ☄️ と同じ)。説明の 3 節と status を宣言する(内蔵化するときにそのまま使える形)。
 */
export function mercuryGeo1KF0(mercuryReal) {
  const p = JSON.parse(JSON.stringify(mercuryReal));
  for (const k of ['claims', 'obsCard', 'descStruct', 'en', 'failureFirst', 'parameterAudit', 'abBody', 'abQuick',
    'calibrationForecast', 'status', 'brief', 'evidence', 'notClaim', 'fidelity']) delete p[k];
  p.id = 'mercuryGeo1KF0';
  p.name = '水星 — geoPN=1 主系列の見本(kF0・f=1・較正ではない)';
  p.emoji = '🥇';
  p.description = '☄️ の physics と bodies を複製し geoPN だけを 1 にした主系列の見本(第282便b・器の中の principle コピー)';
  p.sampleClass = 'principle';
  p.fidelity = 'toy';
  p.familyId = 'mercury'; p.familyRole = 'variant';
  p.physics = Object.assign({}, p.physics, { geoPN: 1 });
  p.descStruct = {
    summary: '☄️ mercuryReal の physics と bodies をビット同一で複製し、physics.geoPN だけを 1(E12 の試験粒子 1PN)にした**主系列の見本**'
      + '(原仮定者の裁定〔第72報〕⑤「geoPN=1 で進め、比較に geoPN=2 または 3」)。f=1・kFrame=0・λ_PN=1・ε=0.05・dt=0.016 は ☄️ と同じ。'
      + '**較正ではない**(sampleClass:"principle")。geoPN はアプリのモード番号で、標準理論の 2PN/3PN ではない。',
    observe: '近点移動は正式の判定器の抽出器と窓(近点 59 個)で測る。太陽は pinned なので 1PN の反作用の分岐は通らず、'
      + '☄️(geoPN=2)とビット同一になる(器 tests/exp-w282b-geo1.mjs の水星の表)。',
    control: '比較は ☄️(geoPN=2)と 🔁(geoPN=3・vMinusU)。kFrame は動かさない(kF0 の主系列)。',
  };
  p.status = { objective: 'met', calibration: 'out-of-scope', note: '主系列の見本(principle)—— 判定は ☄️ の較正行が持つ' };
  return p;
}

/** 書かない語(PHYSICS〔第282便b〕と正本の本文 —— doNotWrite 欄そのものは除く) */
export const FORBIDDEN_W282B = ['運動量保存違反', '運動量保存則を破', '運動量保存則の破れ', '観測一致を達成', '較正を完了', 'f=1 で合った',
  'kF0 版が成立', '精度を上げれば成立', '新発見', '判定が増えた', 'RC を切った'];

/** 相対差(0 同士は 0・片方だけ 0 は Infinity) */
export function relErr(a, b) {
  if (a === b) return 0;
  const s = Math.max(Math.abs(a), Math.abs(b));
  return s > 0 ? Math.abs(a - b) / s : 0;
}

// ---------------------------------------------------------------- ⑥ 法則の切替(器と QA が同じ関数で宇宙を作る)
/** 法則の名前(g1R は反作用返しのコピーの文脈で走らせる —— 宇宙の宣言は g1 と同じ) */
export const LAWS = {
  g0: { label: 'geoPN=0(1PN なし・legacy)' },
  g1: { label: 'geoPN=1(E12 の試験粒子 1PN を相互に当てる・反作用を返さない)' },
  g2: { label: 'geoPN=2(試験粒子形 + ∇U 因子の対反作用・kFrame=0 では w=v)' },
  g3raw: { label: 'geoPN=3 を宣言なしで書く(検証器が 2 へ丸める)' },
  g3toy: { label: 'geoPN=3 トイ(spaceMesh.lawVersion:"scalar" —— `_core` へは 0 = 1PN なし)' },
  g3vmu: { label: 'geoPN=3・vMinusU・pn:reference-1PN(v)・u=0(外部ステップの 1PN と運動量の対反作用・スピン移譲なし)' },
  g1R: { label: '対照: geoPN=1 に反作用返しの分岐だけを有効にしたコピー(器の中だけ)' },
  newton: { label: 'λ_PN=0(1PN を切った対照 —— geoPN=1 の宇宙で lambdaPN だけ 0)' },
};

/** geoPN=3 の器の中の宣言(第280便c の契約: vMinusU・pn:reference-1PN・pnVelocity:"v"・velocityMeaning:"v"・一様な u=0 の背景) */
export function geo3Variant(base, id) {
  return makeGeo3Copy(base, { id, pn: 'reference-1PN', pnVelocity: 'v', velocityMeaning: 'v',
    background: uniformBackground([0, 0], 1, '第282便b: u=0 の背景(geoPN=3・reference-1PN を同じ入力で比べる)'), keepMeta: false });
}

/** 宇宙の複製に法則を宣言する(内蔵は書き換えない —— JSON の深い複製) */
export function lawVariant(law, base) {
  const p = JSON.parse(JSON.stringify(base));
  const ph = p.physics;
  if (law === 'g0') ph.geoPN = 0;
  else if (law === 'g1' || law === 'g1R') ph.geoPN = 1;
  else if (law === 'g2' || law === 'g3raw') ph.geoPN = law === 'g2' ? 2 : 3;
  else if (law === 'g3toy') { ph.geoPN = 3; ph.spaceMesh = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar' }; }
  else if (law === 'g3vmu') return geo3Variant(Object.assign(p, { physics: Object.assign({}, ph, { geoPN: 1 }) }), p.id + '_g3');
  else if (law === 'newton') { ph.geoPN = 1; ph.lambdaPN = 0; }
  else throw new Error('未知の法則: ' + law);
  p.id = p.id + '_' + law;
  return p;
}

/**
 * QA `behavior.geo1Momentum` が固定する**記録**(門ではない —— 物理の正しさを言わない。値が動いたら気づくため)。
 * 自由二体(`freeTwoBody()`)の 1 歩の Σm·vx(dt 0.001 / 0.0005)。第282便b の器の実測(基点 8b05232)。
 */
export const GEO1_MOMENTUM_RECORD = {
  dts: [0.001, 0.0005],
  px: { g0: [0, 0], g1: [7.999999840000143e-8, 3.9999999200000715e-8], g2: [0, 0], g3raw: [0, 0],
    g3toy: [-9.956709874387677e-7, -4.978354893540471e-7], g3vmu: [0, 0], newton: [0, 0] },
  note: 'g3toy の粒子の Σm·vx はメッシュの帳簿(S.geoToyMeshPx)へ移った分(粒子 + メッシュは 10⁻²¹ 級で 0)',
};

/** 指数表記を本文の形へ(例 7.99999984e−8 → "8.00×10⁻⁸"・負号は "−") */
export function fmtE(x, d = 2) {
  const [m, e] = Number(x).toExponential(d).split('e');
  const ex = String(Number(e));
  const sup = ex.split('').map((ch) => (ch === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch])).join('');
  return (m.startsWith('-') ? '−' + m.slice(1) : m) + '×10' + sup;
}
/** 倍率の本文の形(例 16.2085 → "×16.2") */
export function fmtTimes(x) { return '×' + x.toFixed(1); }
/** 百分率の本文の形(符号つき・小数 1 桁) */
export function fmtPct(x) { const v = x * 100; return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; }

/**
 * PHYSICS〔第282便b〕に**そのまま載っているべき数**(QA `docs.geo1Contract` ⑤ —— 正本の値から同じ書式で作る)。
 * @param {object} J 正本 geo1-w282b.json
 */
export function physicsNumbers(J) {
  const out = [];
  const S = J.A.summary;
  out.push(fmtE(S.g1PxDt), fmtE(S.g1PxDt2));
  const ER = J.E.rows;
  for (const pair of ['1/1', '2/1']) for (const law of ['g1', 'g2']) {
    const r = ER.find((z) => z.pair === pair && z.law === law && z.c === 10 && z.dt === 0.01);
    if (r) out.push(r.ratio.toFixed(4));
  }
  for (const law of ['g1', 'g2']) for (const V of [0.1, 1]) {
    const r = J.C.orbit.find((z) => z.law === law && z.V === V);
    if (r) out.push(V === 1 ? fmtTimes(1 + r.dPnVsV0Rel) : fmtPct(r.dPnVsV0Rel));
  }
  const b1 = J.B.rows.find((z) => z.law === 'g1');
  if (b1) out.push(fmtE(b1.maxDPrel));
  if (J.H && J.H.binary) out.push(fmtE(J.H.binary.maxPosDiff));
  if (J.F) {
    const g1 = J.F.rows.find((z) => z.cond === 'g1' && z.dt === 0.016);
    if (g1) out.push(fmtE(g1.slopeDegA, 7));
  }
  return out;
}
