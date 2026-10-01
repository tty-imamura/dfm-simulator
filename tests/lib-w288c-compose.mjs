// 第288便c(原仮定者の裁定(第78報)で閉じた AN84・統括の検証項目 R115)—— **局所源+外部源の共通評価器**(純関数・Node だけ・エンジン未接続)。
//
// ■ 何か
//   背景の台帳(静止背景 W_bg・A_bg とその勾配・時間微分)と局所源(自己を除いた天体)と台帳の源(天体参照 body:k または明示の源)を、
//   **同じ核**(w=m·s^{−p/2}・s=|x−x_j|²+ε²)・**同じ単位**(p を宣言 —— p=1 の W は M/L・p=2 は M/L²。背景の宣言の p と核の p が違えば拒否)・
//   **同じ自己除外規約**(評価点の天体は局所にも台帳にも入れない)で 1 つに合成する:
//     W = W_bg + Σ_j w_j・A = A_bg + Σ_j w_j v_j + A_spin・u = A/W
//   **中心は局所源として 1 回だけ計上**(台帳が body:k で参照した天体は局所の和から外す —— W を二重に足さない)。
//   A_spin は**別に構成する**(静止した点源を足すだけでは A=w_c v_c=0 —— 中心が固定なら自転の流れは出ない):
//     spin "none" … A_spin=0(対照)
//     spin "e6"   … 有限サイズの回転源(E6′ と同じ減衰形 ω(d)=s(R/(R+d))^q)を中心だけに —— A_spin=Σ_c w_c ω(d) ẑ×(x−x_c)
//   order "inline"   … 回転源の寄与を源の添字の位置で w_c(v_c+ω ẑ×r) として足す(エンジンの場の契約 `dfmFieldContract` と同じ和の順)
//   order "separate" … A_spin を別の和で作り、最後に足す(式は同じ・和の順だけが違う —— 差は丸めだけであることを器が測る)
//
// ■ 位置づけ(書くこと・書かないこと)
//   ・**エンジンに接続しない**。share-p1(背景法則版)の規約(centerSpin・spaceMesh.D0・meshVelocity との併用の拒否)は**変えない** ——
//     本評価器は器の中で「背景の物理定義に中心を混ぜない」形を試す物差しである。
//   ・「複素場を接続した」「中心の自転が銀河の回転を作った」とは書かない。
export const COMPOSE_VERSION = 'w288c-compose-1';
/** 核の p ごとの W の単位(同じ数を別の p へ写さない)。 */
export const W_UNITS = Object.freeze({ 1: 'M/L', 2: 'M/L²', 3: 'M/L³', 4: 'M/L⁴' });

const fin = Number.isFinite;
/**
 * 合成の評価。
 * @param {object} o
 *   bodies: [{m,x,y,vx,vy,ax?,ay?,spin?,R?}]・self: 評価点の天体の添字(-1 = 外の点)・px,py: 評価点
 *   p, eps: 核・background: {p, W, A:[ax,ay], gradW?:[2], gradA?:[4], dWdt?, dAdt?:[2]}(p は宣言した核の p)
 *   ledger: [{ref:'body:k'} | {m,x,y,vx,vy,ax,ay}](台帳の源)・spin: {mode:'none'|'e6', q, centers:[k…]}・order:'inline'|'separate'
 *   double: true で**台帳が参照した天体を局所からも外さない**(二重計上の対照 —— 採らない形)
 * @returns {{ok:boolean, why?:string, W, A, gradW, gradA, dWdt, dAdt, u, gradU, dUdt, chi, counts, ASpin}}
 */
export function composeAt(o) {
  const B = o.bodies, n = B.length, p = o.p, eps2 = o.eps * o.eps, ph = -p / 2;
  const bg = o.background || { p, W: 0, A: [0, 0] };
  if (!(p > 0) || !fin(p) || !(o.eps >= 0)) return { ok: false, why: 'kernel' };
  if (bg.p !== p) return { ok: false, why: 'units' };                     // 背景の宣言の p と核の p が違う(M/L と M/L² を写さない)
  if (!(bg.W >= 0) || !fin(bg.W)) return { ok: false, why: 'bgW' };
  const spinMode = (o.spin && o.spin.mode) || 'none', q = o.spin ? o.spin.q : 2, centers = new Set((o.spin && o.spin.centers) || []);
  const order = o.order || 'inline';
  // 台帳の源: 天体参照は添字の集合へ・明示の源は別の並び
  const refIdx = new Set(), extra = [];
  for (const s of o.ledger || []) {
    if (typeof s.ref === 'string') { const k = +s.ref.replace(/^body:/, ''); if (!(k >= 0 && k < n)) return { ok: false, why: 'ref' }; refIdx.add(k); }
    else extra.push(s);
  }
  const counts = { local: 0, ledgerRef: 0, ledgerExtra: 0, perBody: new Array(n).fill(0) };
  let W = 0, gWx = 0, gWy = 0, Wd = 0, Nx = 0, Ny = 0, g0 = 0, g1 = 0, g2 = 0, g3 = 0, Tx = 0, Ty = 0;
  let Sx = 0, Sy = 0, s0 = 0, s1 = 0, s2 = 0, s3 = 0, STx = 0, STy = 0;   // order "separate" の A_spin とその勾配・時間微分
  const add = (b, k) => {
    const mi = b.m, vix = b.vx || 0, viy = b.vy || 0, aix = b.ax || 0, aiy = b.ay || 0;
    const dx = o.px - b.x, dy = o.py - b.y, r2 = dx * dx + dy * dy, sq = r2 + eps2;
    if (!(sq > 0) || !(mi > 0)) return false;
    const A = Math.pow(sq, ph), w = mi * A;
    let om = 0, omd = 0, dOx = 0, dOy = 0, spinOn = false;
    if (spinMode === 'e6' && k >= 0 && centers.has(k)) {
      const s = b.spin || 0, Ri = b.R;
      if (s !== 0) {
        if (!(Ri > 0)) return false;
        const d = Math.sqrt(r2), tt = Ri / (Ri + d), gq = (q === 2) ? tt * tt : Math.pow(tt, q);
        om = s * gq;
        if (d > 0) { const k1 = -q * om / ((Ri + d) * d); dOx = k1 * dx; dOy = k1 * dy; }
        spinOn = true;
      }
    }
    const kk = mi * (-p * A / sq), wgx = kk * dx, wgy = kk * dy, wdi = -(wgx * vix + wgy * viy);
    W += w; gWx += wgx; gWy += wgy; Wd += wdi;
    if (order === 'inline') {
      // `dfmFieldContract`(sources all・velocity v・spin e6・fit mean・static・need uBt)と同じ式・同じ順
      const uix = vix - om * dy, uiy = viy + om * dx;
      Nx += w * uix; Ny += w * uiy;
      g0 += uix * wgx; g1 += uix * wgy - w * om;
      g2 += uiy * wgx + w * om; g3 += uiy * wgy;
      if (spinOn) { g0 += w * (-dy * dOx); g1 += w * (-dy * dOy); g2 += w * (dx * dOx); g3 += w * (dx * dOy); }
      let tix = aix - omd * dy + om * viy, tiy = aiy + omd * dx - om * vix;
      if (spinOn) { const gv = dOx * vix + dOy * viy; tix += gv * dy; tiy -= gv * dx; }
      Tx += wdi * uix + w * tix; Ty += wdi * uiy + w * tiy;
    } else {
      Nx += w * vix; Ny += w * viy;
      g0 += vix * wgx; g1 += vix * wgy; g2 += viy * wgx; g3 += viy * wgy;
      Tx += wdi * vix + w * aix; Ty += wdi * viy + w * aiy;
      if (spinOn) {   // A_spin = w ω ẑ×r・∇A_spin = (ẑ×r)⊗∇(wω) + wω[[0,−1],[1,0]]・∂ₜA_spin|_x = ∂ₜ(wω)(ẑ×r) + wω ẑ×(−v_c)
        const zx = -om * dy, zy = om * dx;
        Sx += w * zx; Sy += w * zy;
        s0 += zx * wgx + w * (-dy * dOx); s1 += zx * wgy - w * om + w * (-dy * dOy);
        s2 += zy * wgx + w * om + w * (dx * dOx); s3 += zy * wgy + w * (dx * dOy);
        const gv = dOx * vix + dOy * viy;
        STx += wdi * zx + w * (om * viy + gv * dy); STy += wdi * zy + w * (-om * vix - gv * dx);
      }
    }
    return true;
  };
  // 添字の順に 1 回だけ回す: 台帳が参照した天体(中心)は台帳の源として数え、局所の和には入れない(W を二重に足さない)。
  // double:true(採らない形の対照)だけは同じ天体を局所としても足す
  for (let j = 0; j < n; j++) {
    if (j === o.self) continue;                                            // 自己除外(局所にも台帳にも入れない)
    if (refIdx.has(j)) {
      if (!add(B[j], j)) return { ok: false, why: 'ledger' };
      counts.ledgerRef++; counts.perBody[j]++;
      if (!o.double) continue;
    }
    if (!add(B[j], j)) return { ok: false, why: 'source' };
    counts.local++; counts.perBody[j]++;
  }
  for (const s of extra) { if (!add(s, -1)) return { ok: false, why: 'extra' }; counts.ledgerExtra++; }
  const Wl = W;
  const bgA = bg.A || [0, 0], bgGW = bg.gradW || [0, 0], bgGA = bg.gradA || [0, 0, 0, 0], bgWd = bg.dWdt || 0, bgAd = bg.dAdt || [0, 0];
  const Wt = bg.W + Wl, Ax = bgA[0] + Nx + Sx, Ay = bgA[1] + Ny + Sy;
  if (!(Wt > 0)) return { ok: false, why: 'W' };
  const gW = [bgGW[0] + gWx, bgGW[1] + gWy], gA = [bgGA[0] + g0 + s0, bgGA[1] + g1 + s1, bgGA[2] + g2 + s2, bgGA[3] + g3 + s3];
  const dW = bgWd + Wd, dA = [bgAd[0] + Tx + STx, bgAd[1] + Ty + STy];
  const ux = Ax / Wt, uy = Ay / Wt;
  const gradU = [(gA[0] - ux * gW[0]) / Wt, (gA[1] - ux * gW[1]) / Wt, (gA[2] - uy * gW[0]) / Wt, (gA[3] - uy * gW[1]) / Wt];
  const dUdt = [(dA[0] - ux * dW) / Wt, (dA[1] - uy * dW) / Wt];
  return { ok: true, version: COMPOSE_VERSION, p, units: W_UNITS[p] || ('M/L^' + p), W: Wt, Wlocal: Wl, A: [Ax, Ay], gradW: gW, gradA: gA, dWdt: dW, dAdt: dA,
    u: [ux, uy], gradU, dUdt, chi: Wl / (Wl + bg.W), counts, ASpin: [Sx, Sy] };
}
