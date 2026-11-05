// 第327便b(原仮定者の回答(2026-11-05 —— AN536)・統括の検証項目 R296): **銀河の局所場の 2 つの経路の正本 tests/out/galaxis-w327b.json から PHYSICS〔第327便b〕の表を作る文書の lib**
// (QA docs.galaxis327b が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔照合の残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w327b-galaxisdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fp = (x, d = 3) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
export const CAND_JA = Object.freeze({ direct: '直接(ν_G = Ω_rel ĝ)', halfCurl: '半渦度 ½∇×u', rigid: '剛体の読み (u_φ/R)ĝ', shear: 'シア (∂_R u_φ − u_φ/R)ĝ', k1Mirror: 'K1 の源の幾何 (2n̂n̂ᵀ − I)(u_φ/R)ĝ' });
const REL_JA = { premise: '負(前提そのもの)', always: null, conditional: null };
export function tablesOf(J) {
  const P1 = J.path1, P2 = J.path2, T = {}, Gd = J.grid, R = J.rel, H = J.handoff;
  // 表 1 経路 1(太陽の式)
  {
    const v = P1.variants, row = (k, ja) => `| ${ja} | ${fe(v[k].AE)} | ${fe(v[k].AAlone)} | ${fe(v[k].AOnePort)} | ${lt(v[k].AEVsOnePortRel)} | ${fe(v[k].reactionRel)} | ${tf(v[k].AIndependentOfP)} |`;
    T.path1 = ['| K1 の列 | 族 E の A [rad/s](太陽・金星・木星・イオの系) | 太陽だけの系の A | 口が 1 つの和の式 s/(ĝ·â) | 族 E と和の式の相対の差 | 源の反作用の大きさ(太陽の口の尺度に対して) | p に依らない |',
      '|---|---|---|---|---|---|---|', row('now', '今の K1(R_src = R_d)'), row('J', 'R_src = J(太陽 f 0.07・木星 0.254)')].join('\n');
    T.sun = ['| 太陽の自転 s [rad/s] | ĝ·â_☉ | ĝ と â_☉ の角 [°] | s(ĝ·â_☉) [rad/s] | A/Ω_ref |', '|---|---|---|---|---|',
      `| ${fe(P1.s)} | ${fp(P1.gDotA, 4)} | ${fp(P1.angleDeg)} | ${fe(P1.sAlongG)} | ${fe(P1.AOverOmRef)} |`].join('\n');
  }
  // 表 2 経路 2(場の API の模型 —— 太陽の位置・面上)
  {
    const sp = P2.split.parts, c = sp.find((q) => q.key === 'center'), r = sp.find((q) => q.key === 'residual');
    T.path2 = ['| 量(R_0 = ' + P2.R0Kpc + ' kpc・z = 0) | 全場 | 中心(R < ' + P2.split.rCutKpc + ' kpc + バルジ) | 残余 |', '|---|---|---|---|',
      `| u_φ [m/s] | ${fe(P2.uPhi)} | ${fe(c.uPhi)} | ${fe(r.uPhi)} |`,
      `| u_φ/R [1/s] | ${fe(P2.rigid)} | ${fe(c.cand.rigid.alongG)} | ${fe(r.cand.rigid.alongG)} |`,
      `| ∂_R u_φ [1/s] | ${fe(P2.dRuPhi)} | — | — |`,
      `| 半渦度 (½∇×u)·ĝ [1/s] | ${fe(P2.halfCurlZ)} | ${fe(c.halfCurlZ)} | ${fe(r.halfCurlZ)} |`,
      `| シア ∂_R u_φ − u_φ/R [1/s] | ${fe(P2.shear)} | ${fe(c.cand.shear.alongG)} | ${fe(r.cand.shear.alongG)} |`,
      `| β | ${fe(P2.beta)} | — | — |`,
      `| u_φ/(βR) [1/s] | ${fe(R.OmBeta)} | — | — |`].join('\n');
    T.path2err = ['| 照合 | 値 |', '|---|---|',
      `| 半渦度の 2 経路の差(部分積分と u_φ の 4 次の中心差分 —— 半渦度に対して) | ${lt(Math.abs(P2.routeZ) / Math.abs(P2.halfCurlZ), 1e-9)} |`,
      `| 勾配の u_φ/R と u の u_φ/R | ${lt(P2.uOverRVsGRel)} |`,
      `| 中心 + 残余 = 全場(u_φ・半渦度) | ${lt(P2.split.sumUVsFullRel)}・${lt(P2.split.sumWVsFullRel, 1e-10)} |`,
      `| Z = 1 + β で割る第 2 項の割合 | ${fe(P2.corrShare)} |`,
      `| 打ち切りの縁 R_max の面の項の割合 | ${fe(P2.edgeShare)} |`,
      `| 定常の宣言(∂_t u = 0) | ${tf(P2.stationary)} |`].join('\n');
  }
  // 表 3 面からの高さの感度
  {
    const rows = P2.zSens.map((z) => `| ${fp(z.zKpc, 2)} | ${fe(z.uPhi)} | ${fe(z.halfCurlZ)} | ${fe(z.halfCurlR)} | ${fp(z.halfCurlTiltDeg)} | ${fe(z.cand.shear.alongG)} | ${fe(z.cand.k1Mirror.alongG)} |`);
    T.zsens = ['| z [kpc](+z = ĝ) | u_φ [m/s] | 半渦度の ĝ の成分 | 半渦度の R̂ の成分 | 半渦度の ĝ からの傾き [°] | シア | K1 の源の幾何 |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 4 二つの経路の表(平均しない)
  {
    const rows = J.table.rows.map((q) => `| ${CAND_JA[q.key]} | ${fe(q.path1A)} | ${fe(q.path2AlongG)} | ${q.signAgree ? '同じ' : '逆'} | ${fe(q.needFactor)} | ${fe(q.absRatio)} | ${fe(q.alongSunAxis)} | ${fe(q.zMinusSunAxis)} | ${fe(q.center)} | ${fe(q.residual)} | ${fe(q.scaledUPhiOverC)} |`);
    T.twoPath = ['| 伝達の候補 T_G | 経路 1: A [rad/s] | 経路 2: ν_G·ĝ [rad/s] | 向き | 要る倍率 A/(ν_G·ĝ) | abs の比 | ν_G·â_☉(z = 0) | ν_G·â_☉(z = −0.02 kpc) | 中心の ν_G·ĝ | 残余の ν_G·ĝ | 場の全体を要る倍率にした u_φ/c |',
      '|---|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 5 点のセルの和(格子の注意)
  {
    const ks = ['halfCurl', 'rigid', 'shear', 'k1Mirror'];
    const rows = Gd.rows.map((g) => `| ${g.nr}・${g.np}・${g.nz} | ${fe(g.uRel)} | ` + ks.map((k) => `${fe(g.cand[k].alongG)}(${fe(g.cand[k].rel)})`).join(' | ') + ' |');
    rows.push('| 環の積分(主の経路) | — | ' + ks.map((k) => fe(J.path2.cand[k].alongG)).join(' | ') + ' |');
    rows.push('| 格子の符号の列 | — | ' + ks.map((k) => Gd.signs[k].signs.map(sg).join(' ') + (Gd.signs[k].alternates ? '(交互)' : Gd.signs[k].sameSign ? '(同じ)' : '')).join(' | ') + ' |');
    T.grid = ['| 格子(動径・方位・鉛直) | u_φ の相対の差 | 半渦度(相対の差) | 剛体の読み(相対の差) | シア(相対の差) | K1 の源の幾何(相対の差) |', '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 6 AN536 の符号の表
  {
    const rel = (q) => (q.relKind === 'premise' ? '負(前提そのもの)' : q.relKind === 'always' ? (q.relSign < 0 ? '負(前提の全域)' : '正(前提の全域)')
      : (q.c > 0 ? 'Ω_field > ' + fe(q.threshold) + ' で負・その下で正' : 'Ω_field < ' + fe(q.threshold) + ' で負'));
    const rows = R.table.map((q) => `| ${q.ja} | ${q.axis} | ${fe(q.w)} | ${fp(q.c, 4)} | ${q.apparentSign > 0 ? '順' : q.apparentSign < 0 ? '逆' : '0'} | ${rel(q)} | ${fe(q.relAtDirect)} |`);
    T.sign = ['| 体(Ω_body) | 射影の軸 | 遠方の枠での値 [rad/s] | ĝ·軸 | 見た目(遠方の枠) | 場に対して(Ω_body − Ω_field ĝ —— 前提 Ω_field > Ω_p) | 直接の型の要る Ω_field(' + fe(R.OmegaFieldDirect) + ' rad/s)での場に対する値 |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
    const F = R.fasterThanArm;
    T.omega = ['| 量 | 値 [rad/s] | 腕のパターンの角速度の文献の下限との比 |', '|---|---|---|',
      `| 腕のパターンの角速度 Ω_p(文献の範囲) | ${fe(R.OmegaPattern[0])}〜${fe(R.OmegaPattern[1])} | 1〜${fp(R.OmegaPattern[1] / R.OmegaPattern[0])} |`,
      `| 物質の公転 Ω_mat = V(R_0)/R_0 | ${fe(R.OmMat)} | ${fp(R.OmMat / R.OmegaPattern[0])}(文献の範囲の内: ${tf(F.matterInRange)}) |`,
      `| 今の API の剛体の読み u_φ/R | ${fe(J.path2.rigid)} | ${fe(F.apiRigidOverOpLo)} |`,
      `| 今の API の β で割った読み u_φ/(βR) | ${fe(R.OmBeta)} | ${fe(F.apiBetaOverOpLo)} |`].join('\n');
  }
  // 表 7 A を生むのに要る相対の角速度
  {
    const rows = R.required.map((q) => `| ${CAND_JA[q.key]} | ${fe(q.gain)} | ${fe(q.OmRelReq)} | ${fe(q.overOmMat)} | ${q.consistent ? '両立' : '両立しない(Ω_rel,req > 0)'} | ${q.fieldRange ? fe(q.fieldRange[0]) : '—'} | ${fe(q.fieldPeriodS)} |`);
    T.required = ['| 伝達の候補 | 利得 g_T(単位 Ω_mat あたり) | 要る Ω_rel = A/g_T [rad/s] | Ω_rel/Ω_mat | 前提(Ω_rel < 0)と | 要る Ω_field ≈ Ω_p − Ω_rel [rad/s](枠 = 腕 —— Ω_p の範囲の幅は 4 桁の外) | 場の周期 2π/Ω_field [s] |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 8 引き継ぎの形
  {
    const rows = H.rows.map((q) => `| ${q.ja} | ${q.have ? '有り' : '**無し**'} | ${q.need} |`);
    T.handoff = ['| 成分 | 今の場の API(第321便c の版 2) | 本便の伝達・帳簿で要る所 |', '|---|---|---|'].concat(rows).join('\n');
  }
  return T;
}
