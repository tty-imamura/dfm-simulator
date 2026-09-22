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

/* ═══════════════════════════════════════════════════════════════════════════
   第277便d(統括の読み R52): **共動系への変換**(既存の関数は 1 文字も変えていない — 追加のみ)

   R52 の字義: 「一様な背景速度は参照系を変えて除ける・一様加速度は自由落下系で除ける・
   **背景勾配による差動加速度は除けず一様重力パラメータ 1 つで代替できない**」
   「背景と局所源の全速度を**同じ共動系へ移し**(A₀→A₀−W₀V・時間微分も同じ規約)、
   背景 ON/OFF の軌道差・位相差を測ってから『無視できる範囲』を宣言する」。

   ■ **時間微分の規約を 2 つ明示して、どちらも実装する**(ここが曖昧だと ∂ₜu の変換が決まらない)
     背景は 1 点 x* で宣言された値の組である。共動系(速度 V)へ移すとき、
     **どの点で時間微分を取るか**で ∂ₜ の変換が変わる:

     (C1) `convention:"fieldTime"` … **元の座標に固定した点**での時間微分
          (= 場の値だけを速度 V だけずらす。R52 が字義で挙げた形)
            W' = W ・ ∇W' = ∇W ・ ∂ₜW' = ∂ₜW
            A' = A − W V ・ ∇A' = ∇A − V⊗∇W ・ ∂ₜA' = ∂ₜA − V ∂ₜW
          帰結: **u' = u − V ・ ∇u' = ∇u ・ ∂ₜu' = ∂ₜu**(u/∇u/∂ₜu がそのまま比べられる)

     (C2) `convention:"advected"` … **共動系に固定した点**での時間微分(x = x' + Vt)
            ∂ₜ' = ∂ₜ + (V·∇) を全成分へ掛ける:
            W' = W ・ ∇W' = ∇W ・ ∂ₜW' = ∂ₜW + V·∇W
            A' = A − W V ・ ∇A' = ∇A − V⊗∇W ・ ∂ₜA' = ∂ₜA − V ∂ₜW + (V·∇)A − (V·∇W) V
          帰結: **u' = u − V ・ ∇u' = ∇u ・ ∂ₜu' = ∂ₜu + (V·∇)u**

   ■ **どちらが「ガリレイ共変」かは量による**(器が数で出す — 予想ではない)
     粒子が感じる座標変換の加速度 **a = (v·∇)u + ∂ₜu**(v は粒子速度・共動系では v'=v−V)は
       (C1) a' = a − (V·∇)u      … **不変ではない**
       (C2) a' = a               … **不変**
     逆に ∂ₜu 単体は (C1) で不変・(C2) で不変でない。**宣言した規約を書かずに
     「背景を共動系へ移した」と言ってはならない**。

   ■ しないこと
     ・既存の `normalizeBackground` / `meshFieldNoD0` / `scaleCovariance` を変更しない。
     ・「背景を無視してよいことを証明した」とは書かない(言えるのは**誤差予算の中での大小**だけ)。
   ═══════════════════════════════════════════════════════════════════════════ */
export const COMOVING_VERSION = 'w277d-comoving-1';
export const COMOVING_CONVENTIONS = ['fieldTime', 'advected'];

/**
 * 宣言された背景を **速度 V の共動系へ移す**(純関数・新しいオブジェクトを返す)。
 * @param {object} bg `normalizeBackground` が受理する形
 * @param {number[]} V 共動系の速度 [Vx,Vy]
 * @param {object} [opts] `{convention:"fieldTime"|"advected"}`(既定 `"fieldTime"` = R52 の字義)
 * @returns {{W0:number,A0:number[],gradW:number[],gradA:number[],dWdt:number,dAdt:number[],
 *            convention:string,V:number[]}|null}
 */
export function toComovingFrame(bg, V, opts) {
  const B = normalizeBackground(bg);
  if (!B) return null;
  if (!Array.isArray(V) || V.length !== 2) return null;
  const Vx = Number(V[0]), Vy = Number(V[1]);
  if (!(Number.isFinite(Vx) && Number.isFinite(Vy))) return null;
  const o = opts || {};
  const conv = (o.convention === undefined) ? COMOVING_CONVENTIONS[0] : String(o.convention);
  if (COMOVING_CONVENTIONS.indexOf(conv) < 0) return null;
  // 空間成分は規約に依らない
  const A0 = [B.A0[0] - B.W0 * Vx, B.A0[1] - B.W0 * Vy];
  const gradW = [B.gradW[0], B.gradW[1]];
  // ∇A' = ∇A − V⊗∇W(並び [∂ₓAx,∂_yAx,∂ₓAy,∂_yAy])
  const gradA = [B.gradA[0] - Vx * gradW[0], B.gradA[1] - Vx * gradW[1],
    B.gradA[2] - Vy * gradW[0], B.gradA[3] - Vy * gradW[1]];
  let dWdt = B.dWdt;
  let dAdt = [B.dAdt[0] - Vx * B.dWdt, B.dAdt[1] - Vy * B.dWdt];
  if (conv === 'advected') {
    const VgradW = Vx * gradW[0] + Vy * gradW[1];
    const VgradAx = Vx * B.gradA[0] + Vy * B.gradA[1];
    const VgradAy = Vx * B.gradA[2] + Vy * B.gradA[3];
    dAdt = [dAdt[0] + VgradAx - VgradW * Vx, dAdt[1] + VgradAy - VgradW * Vy];
    dWdt = B.dWdt + VgradW;
  }
  return { W0: B.W0, A0, gradW, gradA, dWdt, dAdt, convention: conv, V: [Vx, Vy] };
}

/**
 * 共動系変換の **ガリレイ共変性の試験**(**値を作らず、同じ配置を 2 つの系で測って比べる**)。
 * 源の速度も同じ V だけ引く(**背景と局所源を同じ共動系へ移す** — R52)。
 * @param {Array} sources `meshFieldNoD0` と同じ形
 * @param {number} px,py 評価点(共動系では px−Vx·t を使うべきだが **t=0 の 1 点で比べる**)
 * @param {object} opts `{p,eps,bg,V,convention, vParticle:[vx,vy]}`
 */
export function comovingCheck(sources, px, py, opts) {
  const o = opts || {};
  const V = Array.isArray(o.V) ? [Number(o.V[0]), Number(o.V[1])] : [0, 0];
  const conv = (o.convention === undefined) ? COMOVING_CONVENTIONS[0] : String(o.convention);
  const base = { p: (o.p === undefined) ? 2 : Number(o.p), eps: (o.eps === undefined) ? 0 : Number(o.eps) };
  const f0 = meshFieldNoD0(sources, px, py, Object.assign({}, base, { norm: 'background', bg: o.bg }));
  if (!f0) return null;
  const bg1 = toComovingFrame(o.bg, V, { convention: conv });
  if (!bg1) return null;
  const src1 = sources.map((b) => ({ ...b,
    vx: (b.vx === undefined ? 0 : Number(b.vx)) - V[0],
    vy: (b.vy === undefined ? 0 : Number(b.vy)) - V[1] }));
  const f1 = meshFieldNoD0(src1, px, py, Object.assign({}, base, { norm: 'background', bg: bg1 }));
  if (!f1) return null;
  const absDiff = (a, b) => {
    let n = 0;
    for (let i = 0; i < a.length; i++) n = Math.max(n, Math.abs(a[i] - b[i]));
    return n;
  };
  const rel = (a, b) => {
    let d = 0;
    for (let i = 0; i < a.length; i++) d = Math.max(d, Math.abs(b[i]));
    const n = absDiff(a, b);
    return d > 0 ? n / d : n;
  };
  const uShift = [f1.u[0] - (f0.u[0] - V[0]), f1.u[1] - (f0.u[1] - V[1])];
  const uScale = Math.max(Math.abs(f0.u[0]), Math.abs(f0.u[1]), Math.abs(V[0]), Math.abs(V[1]), 1e-300);
  // 粒子が感じる座標変換の加速度 a=(v·∇)u+∂ₜu(共動系では v'=v−V)
  const vp = Array.isArray(o.vParticle) ? [Number(o.vParticle[0]), Number(o.vParticle[1])] : [0, 0];
  const accOf = (f, v) => [v[0] * f.gradU[0] + v[1] * f.gradU[1] + f.dUdt[0],
    v[0] * f.gradU[2] + v[1] * f.gradU[3] + f.dUdt[1]];
  const a0 = accOf(f0, vp), a1 = accOf(f1, [vp[0] - V[0], vp[1] - V[1]]);
  // ∂ₜu の 2 つの予言(**どちらが成り立つかは規約と配置で決まる** —— 両方の残差を出す)
  const gradUdotV = [f0.gradU[0] * V[0] + f0.gradU[1] * V[1],
    f0.gradU[2] * V[0] + f0.gradU[3] * V[1]];
  const predFieldTime = [f0.dUdt[0], f0.dUdt[1]];
  const predAdvected = [f0.dUdt[0] + gradUdotV[0], f0.dUdt[1] + gradUdotV[1]];
  const dScale = Math.max(Math.abs(f0.dUdt[0]), Math.abs(f0.dUdt[1]),
    Math.abs(gradUdotV[0]), Math.abs(gradUdotV[1]), 1e-300);
  const resid = (pred) => Math.hypot(f1.dUdt[0] - pred[0], f1.dUdt[1] - pred[1]) / dScale;
  return { convention: conv, V, p: base.p, eps: base.eps, nSources: sources.length,
    u0: f0.u, u1: f1.u, uShiftResidual: Math.hypot(uShift[0], uShift[1]),
    uShiftRel: Math.hypot(uShift[0], uShift[1]) / uScale,
    gradURel: rel(f1.gradU, f0.gradU), dUdtRel: rel(f1.dUdt, f0.dUdt),
    gradUAbs: absDiff(f1.gradU, f0.gradU), dUdtAbs: absDiff(f1.dUdt, f0.dUdt),
    gradU0: f0.gradU, gradU1: f1.gradU, dUdt0: f0.dUdt, dUdt1: f1.dUdt,
    gradUdotV, residVsFieldTime: resid(predFieldTime), residVsAdvected: resid(predAdvected),
    accel0: a0, accel1: a1,
    accelRel: rel(a1, a0), accelDiff: absDiff(a1, a0),
    chi0: f0.chi, chi1: f1.chi, W0: f0.W0, W: f0.W };
}

export default { MESHFIELD_VERSION, NOD0_NORMS, NOD0_LAW_NAME, BG_COMPONENTS,
  normalizeBackground, meshFieldNoD0, scaleCovariance,
  COMOVING_VERSION, COMOVING_CONVENTIONS, toComovingFrame, comovingCheck };
