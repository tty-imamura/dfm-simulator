// 第275便b(原仮定者の裁定〔第65報〕(2)の後段)— **複素決定力場の D₀ 非依存版(純関数・エンジン未接続)**。
//
// ■ 裁定の字義
//   「**D₀ は距離に反比例する決定力の総和なので、距離の二乗に反比例する空間メッシュ=複素決定力場
//     では使わない。**」
//
// ■ いま何が起きているか(統括の読み R29 の実コード)
//   `dfmGeoToyStep`(beta/index.html)は
//     `const D0p = frameWeightIsPull(p) ? ((p.D0pull!==undefined)? p.D0pull : p.D0) : p.D0;`
//   を `dfmField` へ渡し、`dfmLocalMeshField` が **χ = W/(D₀+W)** の分母に使う。
//   W = Σ m_i (r²+ε²)^(−p/2) の単位は **M/L^p** なので、**D₀ と W が同じ単位になるのは p=1 のときだけ**である。
//   内蔵 🪁🎋 は `frameWeight:"share"`(pw=1)なので現状は**整合している** ——
//   すなわち**現行のスカラートイは p=1 の場であって、裁定の言う「距離の二乗に反比例する複素決定力場」ではない**。
//   p=2 へ上げた瞬間、`D0`(M/L)を分母に置く式は**単位が合わなくなる**。
//
// ■ 本 lib が置くもの(**2 案・どちらも D₀ を 1 度も読まない**)
//   新 lawVersion **`"complex-nod0"`**(名前だけ・エンジンの受理値には足していない)の規格化 2 案:
//     (N1) **自己規格化** `norm:"self"`  … χ ≡ 1。u = Σ w_i u_i / W(W>0 が門・背景と混ぜない)
//          = 既存経路の **D₀→0 の極限**である(器が既存関数とビット一致を機械照合する)。
//     (N2) **配置スケール** `norm:"configScale"` … χ = W/(W₀+W)、**W₀ = M_tot/(R_ref²+ε²)**。
//          W₀ は**サンプル自身の源と、宣言した長さ R_ref だけ**から作るので D₀ を読まない。
//          単位は W と厳密に同じ **M/L²** なので、p=2 でも単位が合う。
//   どちらを採るかは**決断事項**である(本 lib は両方を実装して器が比較する)。
//
// ■ 単位系に対する共変性(**この便で測る判定量**)
//   長さの単位を λ 倍に取り替える(x→x/λ・ε→ε/λ)と W → λ^p·W である。
//   ・宣言値 D₀ を**数として据え置く**と χ は変わる(`scaleCovariance` の `legacy` 行)。
//   ・(N1) は χ≡1 で不変・(N2) は W₀ も λ^p 倍になるので χ が**厳密に不変**である。
//   これは「p=2 の場に D₀(M/L)を入れてはならない」を**測れる形**にしたものである。
//
// ■ しないこと
//   ・エンジンの既定経路へ接続しない(`beta/index.html` の力学は 1 bit も変えていない)。
//   ・「複素決定力場を実装した」とは書かない —— 置いたのは**規格化の 2 案と、その診断**である。
// ■ 第276便a(原仮定者の裁定〔第66報〕(1))で足したもの —— **(N3) 宣言した背景** `norm:"background"`
//   裁定は「**『背景決定力 D₀』と別途『背景複素決定力』を用意する**」である。
//   (N1)(N2) は**サンプル自身の源だけ**から規格化を作る案だったが、(N3) は
//   **宣言された背景 (W₀, A₀, ∇W₀, ∇A₀, ∂ₜW₀, ∂ₜA₀) をそのまま持ち込む**:
//     W = W₀ + Σ w_i          … [M/L^p](**重み**)
//     A = A₀ + Σ w_i u_i      … [M/(L^(p−1)·T)](**分子・向きつき**)
//     u = A/W ・ ∇u = (∇A − u⊗∇W)/W ・ ∂ₜu = (∂ₜA − u·∂ₜW)/W ・ χ = (Σ w_i)/W
//   **W₀ と A₀ は別の量である**(反対向きに動く源は A₀ では相殺しても W₀ には正で残る)ので、
//   **同じ数を両方に入れない**。**D₀ は 1 度も読まない**(この lib は D₀ という語を持たない)。
//   **未宣言の背景を静止ゼロで埋めない** —— 成分が欠けていれば **null** を返す
//   (「ゼロと宣言」は W₀=0 かつ全成分 0 を**明示した**ときだけである)。
//   旧経路 χ=W/(D₀+W) は (N3) で W₀=D₀・A₀=D₀·u_bg と置いた特別な場合にあたる
//   (器 `tests/exp-w276a-bgfield.mjs` が `dfmLocalMeshField` との一致を機械照合する)。
export const MESHFIELD_VERSION = 'w276a-meshfield-2';

/** 受理する規格化(**エンジンの DFM_FIELD_LAWS には足していない** —— 本 lib の中だけの名前)。 */
export const NOD0_NORMS = ['self', 'configScale', 'background'];
export const NOD0_LAW_NAME = 'complex-nod0';

/** (N3) の背景が持つ成分と長さ(**欠けていたら null** —— 既定 0 で埋めない)。 */
export const BG_COMPONENTS = { W0: 1, A0: 2, gradW: 2, gradA: 4, dWdt: 1, dAdt: 2 };

/**
 * 宣言された背景を**規格化する純関数**(値域・有限性・整合の門)。
 * **W₀=0 なら他の成分もすべて 0**(重み 0 の背景に分子や微分は置けない)。
 * @returns {{W0:number,A0:number[],gradW:number[],gradA:number[],dWdt:number,dAdt:number[]}|null}
 */
export function normalizeBackground(bg) {
  if (!bg || typeof bg !== 'object' || Array.isArray(bg)) return null;
  const num = (v) => (typeof v === 'number' && Number.isFinite(v)) ? v : null;
  const vec = (k, n) => {
    const z = bg[k];
    if (!Array.isArray(z) || z.length !== n) return null;
    const o = [];
    for (let i = 0; i < n; i++) { const v = num(z[i]); if (v === null) return null; o.push(v); }
    return o;
  };
  const W0 = num(bg.W0);
  if (W0 === null || !(W0 >= 0)) return null;               // **W₀ は宣言必須・0 以上**
  const A0 = vec('A0', 2), gradW = vec('gradW', 2), gradA = vec('gradA', 4), dAdt = vec('dAdt', 2);
  const dWdt = num(bg.dWdt);
  if (!A0 || !gradW || !gradA || !dAdt || dWdt === null) return null;   // **欠けたら null**(0 で埋めない)
  const rest = A0.concat(gradW, gradA, dAdt, [dWdt]);
  if (W0 === 0 && rest.some((z) => z !== 0)) return null;   // W₀=0 の背景に分子・微分は置けない
  return { W0, A0, gradW, gradA, dWdt, dAdt };
}

/**
 * D₀ を 1 度も読まないメッシュ場。
 * 形は `dfmLocalMeshField`(第258便a〜第259便a)と同じ 4 つ(u・∇u・∂ₜu・χ)を返す。
 * **支持関数は持たない**(複素場は need:"mesh" の大域平均の側で、支持は `lawVersion:"local"` の話)。
 *
 * @param {Array} sources `{m,x,y,vx,vy,ax,ay,omega,omegaDot}` の配列
 * @param {number} px,py 評価点
 * @param {object} opts `{p=2, eps=0, norm:"self"|"configScale"|"background", Rref, bg}`
 *   `norm:"background"`(第276便a)は `bg={W0,A0,gradW,gradA,dWdt,dAdt}` を**宣言必須**で読む
 *   (欠けたら null —— **未入力の背景を静止ゼロで埋めない**)。
 * @returns {{u:number[],gradU:number[],dUdt:number[],chi:number,W:number,W0:number,
 *            norm:string,lawVersion:string,nIn:number}|null}
 */
export function meshFieldNoD0(sources, px, py, opts) {
  const o = opts || {};
  const p = (o.p === undefined) ? 2 : Number(o.p);
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const norm = (o.norm === undefined) ? NOD0_NORMS[0] : String(o.norm);
  if (NOD0_NORMS.indexOf(norm) < 0) return null;
  if (!Array.isArray(sources)) return null;
  if (!(Number.isFinite(p) && p >= 0 && Number.isFinite(eps) && eps >= 0)) return null;
  px = Number(px); py = Number(py);
  if (!(Number.isFinite(px) && Number.isFinite(py))) return null;
  const e2 = eps * eps, pHalfNeg = -p / 2, pZero = (p === 0);
  // 第276便a(N3): **宣言された背景**。`norm:"background"` のときだけ読み、欠けていれば null。
  // (N1)(N2) では BG は null で、累算の初期値は 0 のまま = **既存の値は 1 bit 変わらない**。
  let BG = null;
  if (norm === 'background') { BG = normalizeBackground(o.bg); if (!BG) return null; }
  let W = 0, gWx = 0, gWy = 0, Wd = 0, Mtot = 0, nIn = 0;
  let Nx = 0, Ny = 0, g0 = 0, g1 = 0, g2 = 0, g3 = 0, Tx = 0, Ty = 0;
  if (BG) {
    // 背景は**分子 A₀・その微分**を先に置く(重み W₀ は下の den へ入れる —— W は「源の分」のまま)
    Nx = BG.A0[0]; Ny = BG.A0[1];
    gWx = BG.gradW[0]; gWy = BG.gradW[1];
    g0 = BG.gradA[0]; g1 = BG.gradA[1]; g2 = BG.gradA[2]; g3 = BG.gradA[3];
    Wd = BG.dWdt; Tx = BG.dAdt[0]; Ty = BG.dAdt[1];
  }
  for (const b of sources) {
    if (!b) return null;
    const mi = Number(b.m), bx = Number(b.x), by = Number(b.y);
    const vix = (b.vx === undefined) ? 0 : Number(b.vx), viy = (b.vy === undefined) ? 0 : Number(b.vy);
    const aix = (b.ax === undefined) ? 0 : Number(b.ax), aiy = (b.ay === undefined) ? 0 : Number(b.ay);
    const om = (b.omega === undefined) ? 0 : Number(b.omega);
    const omd = (b.omegaDot === undefined) ? 0 : Number(b.omegaDot);
    if (!(Number.isFinite(mi) && Number.isFinite(bx) && Number.isFinite(by) && Number.isFinite(vix)
      && Number.isFinite(viy) && Number.isFinite(aix) && Number.isFinite(aiy)
      && Number.isFinite(om) && Number.isFinite(omd))) return null;
    if (!(mi > 0)) return null;                    // **負質量・0 質量の源は拒否**(第259便a と同じ門)
    const dx = px - bx, dy = py - by, s = dx * dx + dy * dy + e2;
    if (!(s > 0) || !Number.isFinite(s)) return null;
    nIn++; Mtot += mi;
    const A = pZero ? 1 : Math.pow(s, pHalfNeg);
    const w = mi * A;
    // ∇w = kk·(x−x_i)。**丸めの並びまで `dfmLocalMeshField` と揃える**
    // (engine: `mi*((-pw*A/sq*C) - 0)`・C≡1 —— 器がビット一致を機械照合するので括り方を変えない)
    const kk = mi * (pZero ? 0 : -p * A / s);
    const wgx = kk * dx, wgy = kk * dy;
    const uix = vix - om * dy, uiy = viy + om * dx;
    const wdi = -(wgx * vix + wgy * viy);          // ∂ₜw|_x = −∇w·v_i
    const tix = aix - omd * dy + om * viy, tiy = aiy + omd * dx - om * vix;
    W += w; gWx += wgx; gWy += wgy; Wd += wdi;
    Nx += w * uix; Ny += w * uiy;
    g0 += uix * wgx; g1 += uix * wgy - w * om;
    g2 += uiy * wgx + w * om; g3 += uiy * wgy;
    Tx += wdi * uix + w * tix; Ty += wdi * uiy + w * tiy;
  }
  // **規格化** —— ここが 2 案の分かれ目で、**どちらも D₀ を読まない**
  let W0 = 0;
  if (BG) W0 = BG.W0;                                  // 第276便a(N3): **宣言された背景の重み**
  if (norm === 'configScale') {
    const R = Number(o.Rref);
    if (!(Number.isFinite(R) && R > 0)) return null;   // R_ref は**宣言必須**(既定を黙って置かない)
    W0 = pZero ? Mtot : Mtot * Math.pow(R * R + e2, pHalfNeg);
  }
  const den = W0 + W;
  if (!(den > 0) || !Number.isFinite(den)) return null;  // 源が無い/W=0 は **null**(0 で埋めない)
  const ux = Nx / den, uy = Ny / den;
  const gradU = [(g0 - ux * gWx) / den, (g1 - ux * gWy) / den,
    (g2 - uy * gWx) / den, (g3 - uy * gWy) / den];
  const dUdt = [(Tx - ux * Wd) / den, (Ty - uy * Wd) / den];
  if (!(Number.isFinite(ux) && Number.isFinite(uy) && gradU.every(Number.isFinite)
    && dUdt.every(Number.isFinite))) return null;
  return { u: [ux, uy], gradU, dUdt, chi: W / den, W, W0, gradW: [gWx, gWy], dWdt: Wd,
    gradA: [g0, g1, g2, g3], A: [Nx, Ny], dAdt: [Tx, Ty],
    norm, lawVersion: NOD0_LAW_NAME, nIn, p, eps, Rref: (o.Rref === undefined) ? null : Number(o.Rref),
    bg: BG, uQuantity: 'velocity' };
}

/**
 * **単位系に対する共変性**の試験。長さの単位を λ 倍に取り替えた同じ物理配置で χ を比べる。
 * `legacy` は χ=W/(D₀+W) に**宣言値 D₀ を数として据え置いた**ときの値(= 現行経路の読み方)。
 * @returns {{lambda:number, legacy:{chi:number,chiScaled:number,relChange:number},
 *            self:object, configScale:object}|null}
 */
export function scaleCovariance(sources, px, py, opts) {
  const o = opts || {};
  const lam = (o.lambda === undefined) ? 10 : Number(o.lambda);
  const p = (o.p === undefined) ? 2 : Number(o.p);
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const D0 = (o.D0 === undefined) ? 0 : Number(o.D0);
  const Rref = o.Rref;
  if (!(Number.isFinite(lam) && lam > 0)) return null;
  const scaled = sources.map((b) => ({ ...b, x: Number(b.x) / lam, y: Number(b.y) / lam,
    vx: (b.vx === undefined ? 0 : Number(b.vx)) / lam, vy: (b.vy === undefined ? 0 : Number(b.vy)) / lam,
    ax: (b.ax === undefined ? 0 : Number(b.ax)) / lam, ay: (b.ay === undefined ? 0 : Number(b.ay)) / lam }));
  const wOf = (src, qx, qy, ep) => {
    const r = meshFieldNoD0(src, qx, qy, { p, eps: ep, norm: 'self' });
    return r ? r.W : null;
  };
  const W = wOf(sources, px, py, eps), Ws = wOf(scaled, px / lam, py / lam, eps / lam);
  if (W === null || Ws === null) return null;
  const legacy = { chi: W / (D0 + W), chiScaled: Ws / (D0 + Ws) };
  legacy.relChange = legacy.chi !== 0 ? (legacy.chiScaled - legacy.chi) / legacy.chi : null;
  legacy.WRatio = Ws / W; legacy.WRatioExpected = Math.pow(lam, p);
  const a1 = meshFieldNoD0(sources, px, py, { p, eps, norm: 'self' });
  const b1 = meshFieldNoD0(scaled, px / lam, py / lam, { p, eps: eps / lam, norm: 'self' });
  const self = { chi: a1 ? a1.chi : null, chiScaled: b1 ? b1.chi : null };
  self.relChange = (self.chi && self.chi !== 0) ? (self.chiScaled - self.chi) / self.chi : 0;
  let cs = null;
  if (Rref !== undefined && Rref !== null) {
    const a2 = meshFieldNoD0(sources, px, py, { p, eps, norm: 'configScale', Rref });
    const b2 = meshFieldNoD0(scaled, px / lam, py / lam,
      { p, eps: eps / lam, norm: 'configScale', Rref: Number(Rref) / lam });
    cs = { chi: a2 ? a2.chi : null, chiScaled: b2 ? b2.chi : null };
    cs.relChange = (cs.chi && cs.chi !== 0) ? (cs.chiScaled - cs.chi) / cs.chi : null;
  }
  return { lambda: lam, p, eps, D0, legacy, self, configScale: cs };
}

export default { MESHFIELD_VERSION, NOD0_NORMS, NOD0_LAW_NAME, BG_COMPONENTS,
  normalizeBackground, meshFieldNoD0, scaleCovariance };
