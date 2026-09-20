// 第274便e(第64報「DFM 版ブラックホールを設計する」): **設計の純関数**。
//
// ■ この lib がすること / しないこと
//   する: ① 最小の力学コア Φ_c(r)=−G·M/√(r²+r_c²) と其の勾配 g(r)。
//         ② 既存の場の式(E1′ 決定力 W・E8R 光線 n_eff=e^{2κW})の**評価だけ**を純関数化する。
//         ③ 捕獲判定(半径条件・エネルギー条件)と**合体の帳簿**(M/P/J/E の配分と残余の符号検査)。
//         ④ **光の捕捉境界の定義候補** ṙ=u_r(r)+c_eff(r) の根を r で二分探索する。
//   しない: エンジンへの接続(この lib は beta/index.html から 1 度も呼ばれない)・
//         プリセットの追加・既存の値の変更・「ブラックホールを実装した」という主張。
//
// ■ 捕捉境界について(**GR の事象の地平面ではない**)
//   本モデルの光の伝播則は E8R: dr/dt = (c₀/n_eff)·ĉ + u、n_eff = e^{2ψ}、ψ = κ·W。
//   したがって外向き径方向の光の座標速度は ṙ = u_r(r) + c₀·e^{−2κW(r)} である。
//   **c₀·e^{−2κW} は有限の r で 0 にならない**(指数は発散しない — コア半径 r_c>0 なら
//   中心でも exp(−2κM/r_c)·c₀ > 0)。**よって「捕捉境界」は屈折だけからは出ない** ——
//   メッシュの内向き流れ u_r<0 が c_eff を上回る場所が必要である。これはこの伝播則の中の
//   境界であって、GR の事象の地平面との同等性は示していない(導出も比較もしていない)。
//
// ■ 単位
//   すべてシミュレータ単位(プリセットの scaleExp が SI へ換算する)。κ は本モデルの κ=G/c₀²
//   (GR の 8πG/c⁴ とは別の量 — docs/PHYSICS.md §5 の記号の注意)。
//   κ·M は「質量あたりの重力長」で、点質量では r_s ≡ 2κM が Schwarzschild 換算半径そのものになる。

/** この lib の版(形を変えたら上げる。QA `docs.bhDesignSync` がこの文字列を見る)。 */
export const BH_CORE_VERSION = 'w274e-1';

/* ────────────────────────────────────────────────────────────────────────────
 * 1. 共通状態 —— 独立量と従属量を**名前で**分ける
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * DFM 版ブラックホールの共通状態の欄。**この並びが正本**で、
 * docs/BH_DESIGN_v1.45.md §2 の表と QA `docs.bhDesignSync` が突き合わせる。
 */
export const CORE_STATE_KEYS = ['M_rest', 'M_grav', 'R_core', 'X', 'P',
  'J_spin', 'J_mesh', 'E_core', 'E_mesh', 'Q'];

/**
 * 各欄が独立か従属か。**従属は「何から決まるか」を書く**。
 * `f_M`(独立の質量補正)は**減光率からも自転からも自動で決めない** —— 宣言である。
 */
export const CORE_STATE_KIND = {
  M_rest: { kind: 'independent', from: null,
    note: '静止質量。合体で厳密に加算される保存量(この設計の基準量)' },
  M_grav: { kind: 'dependent', from: 'f_M · M_rest',
    note: 'f_M は**宣言された独立の質量補正**。減光率・自転・捕捉境界から自動導出しない' },
  R_core: { kind: 'declared', from: null,
    note: '有限コア半径 r_c。Φ_c の軟化長であり、ε(数値ソフトニング)と**同じ役割の量**だが' +
      '「数値の都合」ではなく**宣言された構造長**として持つ(どちらを採るかは決断事項)' },
  X: { kind: 'independent', from: null, note: '位置(2D/3D のベクトル)' },
  P: { kind: 'independent', from: null, note: '線運動量。合体で厳密に加算される' },
  J_spin: { kind: 'independent', from: null, note: '殻スピンの角運動量(E10′/E6′ の受け先)' },
  J_mesh: { kind: 'independent', from: null,
    note: '空間メッシュが持つ角運動量。**J_spin とは別の口座**で、合体の軌道角運動量の行き先' },
  E_core: { kind: 'independent', from: null, note: 'コア内部エネルギー(結合を含む)' },
  E_mesh: { kind: 'independent', from: null, note: 'メッシュ側のエネルギー口座' },
  Q: { kind: 'independent', from: null,
    note: '放出・散逸の帳簿(放射・リザーバ)。**残余はここへ入れる。後から clamp しない**' },
};

/** 既定値の空コア(欄を落とさないための型)。 */
export function makeCore(o) {
  const s = o || {};
  return {
    M_rest: Number(s.M_rest || 0),
    f_M: s.f_M === undefined ? 1 : Number(s.f_M),
    R_core: Number(s.R_core || 0),
    X: (s.X || [0, 0]).slice(),
    V: (s.V || [0, 0]).slice(),
    J_spin: Number(s.J_spin || 0),
    J_mesh: Number(s.J_mesh || 0),
    E_core: Number(s.E_core || 0),
    E_mesh: Number(s.E_mesh || 0),
    Q: Number(s.Q || 0),
  };
}

/** M_grav = f_M·M_rest(従属量 —— **宣言された f_M から**だけ作る)。 */
export function gravMass(core) { return core.f_M * core.M_rest; }

/* ────────────────────────────────────────────────────────────────────────────
 * 2. 最小の力学コア Φ_c —— 中心で調和・遠方で 1/r
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * 有限コアポテンシャル Φ_c(r) = −G·M/√(r²+r_c²)(Plummer 型)。
 * r≪r_c で Φ ≈ −GM/r_c·(1−r²/2r_c²) = 定数+調和、r≫r_c で −GM/r。
 * **これは E1′(決定力 w=m/√(d²+ε²))と E4 が既に持っている形そのもの**で、
 * 新しい力ではない —— 設計上の意味は「ε を数値ソフトニングではなく**宣言された構造長 r_c**
 * として持つ」ことにある。**重力だけでは「ブラックホール」と呼ぶ根拠にならない**
 * (捕捉境界・減光・逃げにくさは別条件 —— §4)。
 * @param {number} r 中心からの距離
 * @param {{G:number,M:number,rc:number}} p
 */
export function phiCore(r, p) {
  return -p.G * p.M / Math.sqrt(r * r + p.rc * p.rc);
}

/** 径方向加速度 g(r) = dΦ/dr の符号つき値(内向きが負)。= −G·M·r/(r²+r_c²)^{3/2}。 */
export function gCore(r, p) {
  const s2 = r * r + p.rc * p.rc;
  return -p.G * p.M * r / (s2 * Math.sqrt(s2));
}

/** r≪r_c の調和近似の角振動数 ω₀ = √(G M / r_c³)。 */
export function coreHarmonicOmega(p) {
  return Math.sqrt(p.G * p.M / (p.rc * p.rc * p.rc));
}

/* ────────────────────────────────────────────────────────────────────────────
 * 3. 場(E1′ / E8R)の評価 —— 既存の式をそのまま純関数にしただけ
 * ────────────────────────────────────────────────────────────────────────── */

/** E1′ 決定力 W(r) = D₀ + Σ_j m_j/√(d_j²+ε²)。`bodies` は [{m,x,y,rc?}]。 */
export function decisionForce(pt, bodies, D0, rcDefault) {
  let W = Number(D0 || 0);
  for (const b of bodies) {
    const dx = pt[0] - b.x, dy = pt[1] - b.y;
    const rc = b.rc === undefined ? (rcDefault || 0) : b.rc;
    W += b.m / Math.sqrt(dx * dx + dy * dy + rc * rc);
  }
  return W;
}

/** 単一コアの決定力 W(r) = D₀ + M/√(r²+r_c²)。 */
export function decisionForce1(r, p) {
  return (p.D0 || 0) + p.M / Math.sqrt(r * r + p.rc * p.rc);
}

/** ψ = κ·W(E7R/E8R の単一スカラー)。 */
export function psiOf(W, kappa) { return kappa * W; }

/** E8R 屈折率 n_eff = e^{2ψ}。 */
export function nEff(W, kappa) { return Math.exp(2 * kappa * W); }

/**
 * 局所光速 c_eff(r) = c₀/n_eff = c₀·e^{−2κW(r)}。
 * **点質量(r_c→0・D₀=0)では c_eff/c₀ = e^{−r_s/r}(r_s ≡ 2κM)** ——
 * r=r_s でちょうど e^{−1}=0.3678794… であって **0 ではない**。
 */
export function cEff1(r, p) {
  return p.c0 * Math.exp(-2 * p.kappa * decisionForce1(r, p));
}

/** Schwarzschild 換算半径 r_s = 2κM(κ=G/c₀² なので 2GM/c₀² と同じ)。 */
export function rSchwarzschild(p) { return 2 * p.kappa * p.M; }

/**
 * 外向き径方向の光の座標速度 ṙ = u_r(r) + c_eff(r)。
 * @param {number} r
 * @param {object} p {G,M,rc,kappa,c0,D0}
 * @param {(r:number)=>number} uR メッシュの径方向速度(内向きが負)
 */
export function radialLightRate(r, p, uR) {
  return uR(r) + cEff1(r, p);
}

/**
 * **光の捕捉境界の定義候補**: ṙ(r)=0 の根。外向き光でも右辺が 0 になる r。
 * 走査で符号変化を挟んでから二分する(根が無ければ `roots:[]` と**最小値**を返す)。
 * 「ここが事象の地平面である」とは**書かない** —— この伝播則の中の境界である。
 * @returns {{roots:number[], minRate:number, argMinRate:number, scanned:number,
 *            rateAtLo:number, rateAtHi:number}}
 */
export function captureBoundary(p, uR, span) {
  const lo = span && span.lo !== undefined ? span.lo : 1e-6;
  const hi = span && span.hi !== undefined ? span.hi : 1e4;
  const n = span && span.n ? span.n : 20000;
  const f = (r) => radialLightRate(r, p, uR);
  const roots = [];
  let minRate = Infinity, argMin = lo;
  let rPrev = lo, fPrev = f(lo);
  if (fPrev < minRate) { minRate = fPrev; argMin = lo; }
  for (let i = 1; i <= n; i++) {
    // 対数走査(中心近傍の桁を落とさない)
    const r = lo * Math.pow(hi / lo, i / n);
    const fv = f(r);
    if (fv < minRate) { minRate = fv; argMin = r; }
    if ((fPrev <= 0 && fv > 0) || (fPrev >= 0 && fv < 0)) {
      let a = rPrev, b = r, fa = fPrev;
      for (let k = 0; k < 200; k++) {
        const m = 0.5 * (a + b), fm = f(m);
        if (fm === 0) { a = b = m; break; }
        if ((fa < 0) === (fm < 0)) { a = m; fa = fm; } else b = m;
      }
      roots.push(0.5 * (a + b));
    }
    rPrev = r; fPrev = fv;
  }
  return { roots, minRate, argMinRate: argMin, scanned: n,
    rateAtLo: f(lo), rateAtHi: f(hi) };
}

/**
 * 自由落下(無限遠静止)を宣言した内向きメッシュ流 u_r(r) = −√(2GM/√(r²+r_c²))。
 * **この流れはプリセットが走らせているものではない**(🎐 は kFrame=0 で引きずり項が働かない)。
 * 設計候補の入力である。
 */
export function freeFallInflow(p) {
  return (r) => -Math.sqrt(2 * p.G * p.M / Math.sqrt(r * r + p.rc * p.rc));
}

/**
 * 自由落下流での捕捉境界の**閉形式**。s ≡ √(r²+r_c²) と置くと
 *   √(r_s/s) = e^{−r_s/s}  ⇔  x = e^{−2x}(x ≡ r_s/s)  ⇔  2x·e^{2x} = 2
 * なので x = W(2)/2(Lambert W)。**s_cap/r_s = 2/W(2) は M にも c₀ にも依らない**。
 * この関数は W(2) を Newton 法で解いて比を返す(数値定数を書き写さない)。
 */
export function freeFallBoundaryRatio() {
  // w·e^w = 2 を解く
  let w = 0.8;
  for (let i = 0; i < 100; i++) {
    const e = Math.exp(w), f = w * e - 2, df = e * (1 + w);
    const dw = f / df;
    w -= dw;
    if (Math.abs(dw) < 1e-17) break;
  }
  return { lambertW2: w, sOverRs: 2 / w };
}

/**
 * 「逃げにくさ」: r0→r1 の外向き径方向光の座標到達時間 ∫ dr/c_eff と、
 * 場が無いとき((r1−r0)/c₀)に対する**遅れ倍率**。
 * **捕捉境界とは別の条件**である(遅れは有限でも光は出てくる)。
 */
export function escapeDelayFactor(r0, r1, p, n) {
  const N = n || 20000;
  const h = (r1 - r0) / N;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const r = r0 + h * i;
    const w = (i === 0 || i === N) ? 0.5 : 1;
    s += w * (1 / cEff1(r, p));
  }
  const t = s * h;
  return { travelTime: t, freeTime: (r1 - r0) / p.c0, factor: t / ((r1 - r0) / p.c0) };
}

/**
 * 減光(ダークローター ② 自光の掻出)の実効率 lS_eff = min(1, |s|·R/c_surf)。
 * **捕捉境界でも逃げにくさでもない第三の条件**として別に持つ(🕳 rotorSolo の分離実証)。
 */
export function sweepDarkening({ spin, R, cSurf }) {
  if (!(cSurf > 0)) return { lSeff: null, reason: 'c_surf が正でない' };
  return { lSeff: Math.min(1, Math.abs(spin) * R / cSurf), reason: null };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 4. 捕獲判定 —— 半径条件とエネルギー条件は**別**
 * ────────────────────────────────────────────────────────────────────────── */

/** 半径条件: |X_rel| ≤ R_cap。 */
export function captureByRadius(rel, Rcap) {
  const d = Math.hypot(rel.x, rel.y);
  return { captured: d <= Rcap, d, Rcap };
}

/**
 * Plummer 場 Φ_c での相対軌道の**近点**(有効ポテンシャルの折返し)。
 * E = ½v² + Φ_c(r)、L = |r×v| として E = L²/(2r²)+Φ_c(r) を r で二分する。
 * E ≥ 0(非束縛)でも近点は定義できるので、**束縛判定とは別に返す**。
 */
export function pericenterPlummer(rel, p) {
  const r0 = Math.hypot(rel.x, rel.y);
  const v2 = rel.vx * rel.vx + rel.vy * rel.vy;
  const L = Math.abs(rel.x * rel.vy - rel.y * rel.vx);
  const E = 0.5 * v2 + phiCore(r0, p);
  const g = (r) => E - (L * L / (2 * r * r) + phiCore(r, p));   // g>0 なら到達できる
  if (L === 0) return { rPeri: 0, E, L, bound: E < 0, radial: true };
  // 開始点そのものが折返し(g(r0)≈0)のことがあるので、**すぐ内側**で到達可能かを見る。
  // 内側が到達不可なら開始点が近点そのものである。
  if (g(r0 * (1 - 1e-9)) <= 0)
    return { rPeri: r0, E, L, bound: E < 0, radial: false, note: '開始点が近点(内側は到達不可)' };
  let a = 1e-12, b = r0;
  for (let k = 0; k < 300; k++) {
    const m = 0.5 * (a + b);
    if (g(m) > 0) b = m; else a = m;
  }
  return { rPeri: 0.5 * (a + b), E, L, bound: E < 0, radial: false };
}

/**
 * エネルギー条件の捕獲判定: **束縛(E<0)かつ近点 ≤ R_core** のときだけ「捕獲」。
 * (E<0 だけでは連星になるだけで捕獲ではない —— 2 つを分けて返す)
 */
export function captureByEnergy(rel, p, Rcore) {
  const q = pericenterPlummer(rel, p);
  return { captured: q.bound && q.rPeri <= Rcore, bound: q.bound,
    rPeri: q.rPeri, Rcore, E: q.E, L: q.L };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 5. 合体の帳簿 —— 粒子の削除で終わらせない
 * ────────────────────────────────────────────────────────────────────────── */

/** 対の相互ポテンシャルエネルギー U = −G m_a m_b/√(d²+r_c²)(E1′ と同じ軟化)。 */
export function pairPotentialEnergy(a, b, p) {
  const dx = a.X[0] - b.X[0], dy = a.X[1] - b.X[1];
  return -p.G * a.M_rest * b.M_rest / Math.sqrt(dx * dx + dy * dy + p.rc * p.rc);
}

/** 合体前の総量(M/P/L/E)。L は原点まわりの 2D スカラー。 */
export function totalsBefore(a, b, p) {
  const M = a.M_rest + b.M_rest;
  const P = [a.M_rest * a.V[0] + b.M_rest * b.V[0], a.M_rest * a.V[1] + b.M_rest * b.V[1]];
  const Lorb = a.M_rest * (a.X[0] * a.V[1] - a.X[1] * a.V[0])
    + b.M_rest * (b.X[0] * b.V[1] - b.X[1] * b.V[0]);
  const L = Lorb + a.J_spin + b.J_spin + a.J_mesh + b.J_mesh;
  const U = pairPotentialEnergy(a, b, p);
  const K = 0.5 * a.M_rest * (a.V[0] ** 2 + a.V[1] ** 2)
    + 0.5 * b.M_rest * (b.V[0] ** 2 + b.V[1] ** 2);
  const E = K + U + a.E_core + b.E_core + a.E_mesh + b.E_mesh + a.Q + b.Q;
  return { M, P, L, E, K, U, Lorb };
}

/**
 * **合体の帳簿**。粒子を消して終わりにせず、M/P/J/E を残骸(合体核)と流束(Q・E_mesh)へ配分する。
 *
 * 宣言(**導出ではない** —— どれも決断事項):
 *   ・M_rest' = M_a+M_b(厳密加算)/ P' = P_a+P_b(厳密加算)/ X' = 静止質量重心
 *   ・f_M' = 静止質量重み平均(**減光率からも捕捉境界からも決めない**)
 *   ・R_core' = (R_a³+R_b³)^{1/3}(体積加算の宣言)
 *   ・軌道角運動量 L_orb,cm を `spinFraction` で J_spin' と J_mesh' へ分ける(既定 0 = 全部メッシュへ)
 *   ・E_core' = E_core,a+E_core,b + `coreBinding`·U_pair
 *   ・**残余 E_res = E_before − E_after を Q' へ入れる**。E_res<0 なら **ok:false で拒否**し、
 *     呼び出し側が宣言をやり直す(**後から clamp しない**)。
 *
 * @returns {{ok:boolean, reason:string|null, merged:object|null,
 *            residual:number, closure:{dM:number,dP:number,dL:number,dE:number},
 *            before:object, after:object|null}}
 */
export function mergeLedger(a, b, p, opt) {
  const o = opt || {};
  const spinFraction = o.spinFraction === undefined ? 0 : Number(o.spinFraction);
  const coreBinding = o.coreBinding === undefined ? 1 : Number(o.coreBinding);
  const before = totalsBefore(a, b, p);
  const M = before.M;
  const X = [(a.M_rest * a.X[0] + b.M_rest * b.X[0]) / M,
    (a.M_rest * a.X[1] + b.M_rest * b.X[1]) / M];
  const V = [before.P[0] / M, before.P[1] / M];
  // 重心まわりの軌道角運動量(= 全 L から重心運動分と各スピン/メッシュ分を引いたもの)
  const Lcm = (X[0] * before.P[1] - X[1] * before.P[0]);
  const Lorb_cm = before.Lorb - Lcm;
  const merged = makeCore({
    M_rest: M,
    f_M: (a.f_M * a.M_rest + b.f_M * b.M_rest) / M,
    R_core: Math.cbrt(a.R_core ** 3 + b.R_core ** 3),
    X, V,
    J_spin: a.J_spin + b.J_spin + spinFraction * Lorb_cm,
    J_mesh: a.J_mesh + b.J_mesh + (1 - spinFraction) * Lorb_cm,
    E_core: a.E_core + b.E_core + coreBinding * before.U,
    E_mesh: a.E_mesh + b.E_mesh,
    Q: a.Q + b.Q,
  });
  const Kafter = 0.5 * M * (V[0] ** 2 + V[1] ** 2);
  const Eafter0 = Kafter + merged.E_core + merged.E_mesh + merged.Q;
  const residual = before.E - Eafter0;
  if (!(residual >= 0)) {
    return { ok: false,
      reason: `残余エネルギーが負(${residual}) —— 宣言(coreBinding=${coreBinding})を`
        + 'やり直すこと。**clamp しない**',
      merged: null, residual, closure: null, before, after: null };
  }
  merged.Q += residual;   // 残余は放出・散逸の口座へ(消さない)
  const Lafter = M * (X[0] * V[1] - X[1] * V[0]) + merged.J_spin + merged.J_mesh;
  const after = { M: merged.M_rest, P: [M * V[0], M * V[1]], L: Lafter,
    E: Kafter + merged.E_core + merged.E_mesh + merged.Q };
  const closure = {
    dM: after.M - before.M,
    dP: Math.hypot(after.P[0] - before.P[0], after.P[1] - before.P[1]),
    dL: after.L - before.L,
    dE: after.E - before.E,
  };
  return { ok: true, reason: null, merged, residual, closure, before, after };
}

/** 帳簿の閉じの相対残差(分母が 0 の欄は絶対値を返す)。 */
export function ledgerClosure(before, after) {
  const rel = (x, ref) => (Math.abs(ref) > 0 ? Math.abs(x) / Math.abs(ref) : Math.abs(x));
  return {
    M: rel(after.M - before.M, before.M),
    P: rel(Math.hypot(after.P[0] - before.P[0], after.P[1] - before.P[1]),
      Math.hypot(before.P[0], before.P[1])),
    L: rel(after.L - before.L, before.L),
    E: rel(after.E - before.E, before.E),
  };
}

export default {
  BH_CORE_VERSION, CORE_STATE_KEYS, CORE_STATE_KIND, makeCore, gravMass,
  phiCore, gCore, coreHarmonicOmega, decisionForce, decisionForce1, psiOf, nEff,
  cEff1, rSchwarzschild, radialLightRate, captureBoundary, freeFallInflow,
  freeFallBoundaryRatio, escapeDelayFactor, sweepDarkening,
  captureByRadius, pericenterPlummer, captureByEnergy,
  pairPotentialEnergy, totalsBefore, mergeLedger, ledgerClosure,
};
