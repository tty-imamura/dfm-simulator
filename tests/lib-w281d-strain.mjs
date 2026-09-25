// 第281便d(原仮定者の裁定(第71報)「ナビエ・ストークス方程式の渦伸長(Vortex Stretching)が渦巻銀河の腕に
//   似ているので参考にする」・統括の読み R75)—— **ひずみ率の診断の純関数**。
//
// ■ 立場(先に書く)
//   ・本 lib は**任意の場のサンプラ u(x,y) → [u_x,u_y] | null** を引数に取る純関数だけを持つ。
//     場の契約(表示の dfmGalaxyMeshField・共通 API の dfmField・宣言した解析場)には依存しない ——
//     どの場を読むかは器が決める。**エンジンには 1 バイトも接続していない**(beta/index.html はこの lib を読まない)。
//   ・粘性項は足さない。NS ソルバは入れない。渦度方程式を**解かない** —— 使うのは「微分可能な u なら何にでも
//     成り立つ運動学の恒等式」(∇u の対称部分 S・反対称部分 ω・材料線の伸び率 t̂·S·t̂)だけである。
//   ・2D(u=(u_x,u_y,0)・∂_z=0)では渦伸長項 (ω·∇)u = ω_z ∂_z u が**恒等的に 0**。本 lib はそれを
//     3 次元の同じ差分式に 2D の場を埋め込んで**数でも**示す(z 方向の差分は同じ値の差なので厳密に 0)。
//   ・足す診断量は「伸び(strain)」= **材料線の伸び率 t̂·S·t̂**(t̂ は腕の接線)1 つだけ。門にはしない。
//
// ■ 式(∇u の成分の並びは html の dfmGalaxyMeshField / dfmField の gradU と同じ [∂x u_x, ∂y u_x, ∂x u_y, ∂y u_y])
//   S = (∇u+∇uᵀ)/2:  S_xx=∂x u_x・S_yy=∂y u_y・S_xy=(∂y u_x+∂x u_y)/2
//   ω_z = ∂x u_y − ∂y u_x・発散 = ∂x u_x + ∂y u_y
//   材料線 ℓ̇ = (∇u)ℓ → d ln|ℓ|/dt = t̂·(∇u)t̂ = t̂·S·t̂(反対称部分は落ちる)= **伸び**
//   法線方向 n̂=ẑ×t̂ の圧縮率 n̂·S·n̂(非圧縮なら −t̂·S·t̂)
//   条件数 = ∇u の特異値の比 σ_max/σ_min(σ_min=0 は Infinity —— 丸めない)
//   円運動 u=Ω(r) r θ̂ では S_rθ=(r/2)dΩ/dr・S_rr=S_θθ=0・ω_z=2Ω+r dΩ/dr、ピッチ角 i の接線
//   t̂=(sin i)r̂+(±cos i)θ̂ で t̂·S·t̂ = ±(r dΩ/dr)·sin i·cos i(後行腕 × dΩ/dr<0 で正 = 伸びる)。
//
// ■ 差分: 既定は 4 次の中心差分 f′≈[8(f(x+h)−f(x−h))−(f(x+2h)−f(x−2h))]/(12h)。**差を先に取る**形なので、
//   同じ値の標本(∂_z の埋め込み)では厳密に 0 になる(7f−8f+f の丸めを経由しない)。標本が 1 つでも
//   null/非有限なら **null**(0 で埋めない)。
import { armShape, ARM_DEFAULT } from './lib-w276e-galaxyproto.mjs';

/** この lib の版(形を変えたら上げる。QA `behavior.strainPure`・`docs.vortexStretch` が見る)。 */
export const STRAIN_VERSION = 'w281d-strain-1';
/** 解析場の単体試験の許容(伸び率・S・ω・発散の絶対誤差)。**測る前に宣言**。 */
export const STRAIN_UNIT_TOL = 1e-10;

function sample2(u, x, y) {
  const v = u(x, y);
  if (!v) return null;
  const a = Number(v[0]), b = Number(v[1]);
  return (Number.isFinite(a) && Number.isFinite(b)) ? [a, b] : null;
}
function sample3(U, x, y, z) {
  const v = U(x, y, z);
  if (!v) return null;
  const a = Number(v[0]), b = Number(v[1]), c = Number(v[2]);
  return (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) ? [a, b, c] : null;
}
// 1 方向の差分(ベクトル値)。f(s) は s だけずらした標本(null 可)
function diff1(f, h, order, k) {
  if (order === 2) {
    const p = f(h), m = f(-h);
    if (!p || !m) return null;
    const out = new Array(k);
    for (let i = 0; i < k; i++) out[i] = (p[i] - m[i]) / (2 * h);
    return out;
  }
  const p1 = f(h), m1 = f(-h), p2 = f(2 * h), m2 = f(-2 * h);
  if (!p1 || !m1 || !p2 || !m2) return null;
  const out = new Array(k);
  for (let i = 0; i < k; i++) out[i] = (8 * (p1[i] - m1[i]) - (p2[i] - m2[i])) / (12 * h);
  return out;
}
function stepOf(o) {
  const h = Number(o && o.h);
  if (!(h > 0) || !Number.isFinite(h)) return null;
  return h;
}

/**
 * ∇u を中心差分で作る。戻り値 [∂x u_x, ∂y u_x, ∂x u_y, ∂y u_y](html の gradU と同じ並び)| null。
 * opts: { h (必須 >0), order: 4(既定)| 2 }
 */
export function gradAt(u, x, y, opts) {
  const h = stepOf(opts); if (h === null) return null;
  const order = (opts && opts.order === 2) ? 2 : 4;
  const dx = diff1((s) => sample2(u, x + s, y), h, order, 2);
  const dy = diff1((s) => sample2(u, x, y + s), h, order, 2);
  if (!dx || !dy) return null;
  return [dx[0], dy[0], dx[1], dy[1]];
}

/** 単位接線(null なら null)と法線 n̂ = ẑ×t̂。 */
function unit2(t) {
  if (!t) return null;
  const a = Number(t[0]), b = Number(t[1]), n = Math.hypot(a, b);
  return (n > 0 && Number.isFinite(n)) ? [a / n, b / n] : null;
}

/**
 * ∇u から S・ω_z・発散・主ひずみ率・条件数と、接線 t̂ があれば**伸び t̂·S·t̂**・法線圧縮率 n̂·S·n̂・
 * 材料線の伸び率 t̂·(∇u)t̂(= t̂·S·t̂ の別の書き方 —— 単体試験で両者の差を測る)を返す。
 */
export function strainOfGrad(G, tangent) {
  if (!G || G.length < 4 || !G.every(Number.isFinite)) return null;
  const a = G[0], b = G[1], c = G[2], d = G[3];
  const Sxx = a, Syy = d, Sxy = 0.5 * (b + c);
  const omegaZ = c - b, div = a + d;
  const mean = 0.5 * (a + d), rad = Math.hypot(0.5 * (a - d), Sxy);
  // ∇u の特異値: σ² = (T ± √(T² − 4D²))/2、T=‖G‖_F²・D=|det G|
  const T = a * a + b * b + c * c + d * d, D = Math.abs(a * d - b * c);
  const disc = Math.sqrt(Math.max(0, T * T - 4 * D * D));
  const s1 = Math.sqrt(0.5 * (T + disc)), s2 = (s1 > 0) ? D / s1 : 0;   // σ₁σ₂ = D(桁落ちしない形)
  const out = { S: [Sxx, Sxy, Syy], omegaZ, div, lam1: mean + rad, lam2: mean - rad, shearMag: rad,
    sigmaMax: s1, sigmaMin: s2, cond: (s2 > 0) ? s1 / s2 : (s1 > 0 ? Infinity : null) };
  const t = unit2(tangent);
  if (t) {
    const tx = t[0], ty = t[1], nx = -ty, ny = tx;
    out.t = t; out.n = [nx, ny];
    out.stretch = Sxx * tx * tx + 2 * Sxy * tx * ty + Syy * ty * ty;           // 伸び t̂·S·t̂
    out.compress = Sxx * nx * nx + 2 * Sxy * nx * ny + Syy * ny * ny;          // n̂·S·n̂
    out.lineRate = tx * (a * tx + b * ty) + ty * (c * tx + d * ty);            // t̂·(∇u)t̂
  }
  return out;
}

/** 差分で ∇u を作って strainOfGrad に渡す(1 点)。opts: {h, order, tangent} */
export function strainAt(u, x, y, opts) {
  const G = gradAt(u, x, y, opts);
  if (!G) return null;
  const s = strainOfGrad(G, opts && opts.tangent);
  if (s) s.gradU = G;
  return s;
}

/** 中心 (cx,cy) まわりの極座標成分 S_rr・S_rθ・S_θθ。 */
export function polarStrain(S, x, y, cx, cy) {
  const th = Math.atan2(y - (cy || 0), x - (cx || 0)), cs = Math.cos(th), sn = Math.sin(th);
  const [Sxx, Sxy, Syy] = S;
  return {
    Srr: Sxx * cs * cs + 2 * Sxy * cs * sn + Syy * sn * sn,
    Srt: (Syy - Sxx) * cs * sn + Sxy * (cs * cs - sn * sn),
    Stt: Sxx * sn * sn - 2 * Sxy * cs * sn + Syy * cs * cs,
  };
}

/**
 * 3 次元の場 U(x,y,z) → [U_x,U_y,U_z] の ∇U(J[i][j] = ∂_j U_i)を差分で作る。
 */
export function grad3At(U, x, y, z, opts) {
  const h = stepOf(opts); if (h === null) return null;
  const order = (opts && opts.order === 2) ? 2 : 4;
  const dx = diff1((s) => sample3(U, x + s, y, z), h, order, 3);
  const dy = diff1((s) => sample3(U, x, y + s, z), h, order, 3);
  const dz = diff1((s) => sample3(U, x, y, z + s), h, order, 3);
  if (!dx || !dy || !dz) return null;
  return [[dx[0], dy[0], dz[0]], [dx[1], dy[1], dz[1]], [dx[2], dy[2], dz[2]]];
}

/**
 * 渦伸長項 (ω·∇)U(= J ω)と、渦度の向きの伸長率 ω̂·S·ω̂ を 3 次元の差分で作る。
 * ω = ∇×U = (∂y U_z − ∂z U_y, ∂z U_x − ∂x U_z, ∂x U_y − ∂y U_x)。
 */
export function vortexStretch3(U, x, y, z, opts) {
  const J = grad3At(U, x, y, z, opts);
  if (!J) return null;
  const w = [J[2][1] - J[1][2], J[0][2] - J[2][0], J[1][0] - J[0][1]];
  const st = [0, 1, 2].map((i) => J[i][0] * w[0] + J[i][1] * w[1] + J[i][2] * w[2]);
  const wn = Math.hypot(w[0], w[1], w[2]);
  let rate = null;
  if (wn > 0) {
    const e = w.map((q) => q / wn);
    rate = 0;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) rate += e[i] * 0.5 * (J[i][j] + J[j][i]) * e[j];
  }
  return { J, omega: w, stretch: st, omegaStretchRate: rate };
}

/**
 * **2D の場を 3 次元へ埋め込んで**渦伸長項を作る: U(x,y,z) = (u_x(x,y), u_y(x,y), 0)(z に依らない)。
 * z 方向の差分は同じ値どうしの差なので**厳密に 0**、したがって ω_x=ω_y=0 と (ω·∇)U = ω_z ∂_z U = 0。
 * 戻り値に `exactZero`(3 成分とも === 0)を付ける。
 */
export function vortexStretch2D(u, x, y, opts) {
  const U = (X, Y) => { const v = u(X, Y); return v ? [v[0], v[1], 0] : null; };
  const r = vortexStretch3(U, x, y, 0, opts);
  if (!r) return null;
  r.exactZero = (r.stretch[0] === 0 && r.stretch[1] === 0 && r.stretch[2] === 0);
  r.inPlaneOmegaZero = (r.omega[0] === 0 && r.omega[1] === 0);
  return r;
}

/**
 * **腕の接線**(lib-w276e-galaxyproto の腕形): 位相 χ = m(θ−φ_c) − β_s ln(s/r₀)、s=√(r²+r_min²)
 * (armShape の s)の等位線の接線。∇χ = (−β_s r/s²) r̂ + (m/r) θ̂ なので、外向き(t_r>0)の接線は
 * t̂ ∝ (m/r) r̂ + (β_s r/s²) θ̂、ピッチ角 tan i = m s²/(|β_s| r²)。
 * `mirror:true` は β_s → −β_s(同じピッチの逆向きの腕)。中心 (cx,cy)・腕パラメータ p(既定 ARM_DEFAULT)。
 */
export function armTangent(x, y, o) {
  const s0 = o || {}, p = s0.p || ARM_DEFAULT;
  const cx = s0.cx || 0, cy = s0.cy || 0;
  const X = x - cx, Y = y - cy, r = Math.hypot(X, Y);
  if (!(r > 0)) return null;
  const { s } = armShape(r, p);
  const beta = (s0.mirror ? -1 : 1) * p.beta_s;
  const tr = p.m / r, tt = beta * r / (s * s);
  const cs = X / r, sn = Y / r;
  const tx = tr * cs - tt * sn, ty = tr * sn + tt * cs, nn = Math.hypot(tx, ty);
  return { t: [tx / nn, ty / nn], tr: tr / nn, tt: tt / nn,
    pitchDeg: Math.atan(Math.abs(tr / tt)) * 180 / Math.PI, beta };
}

/* ══════════════════════════════════════════════════════════════════════════
 * 単体試験(解析場)。器と QA が同じ関数を呼ぶ。
 * ════════════════════════════════════════════════════════════════════════ */
const polarT = (x, y, pitchDeg, sgn) => {        // ピッチ i・向き sgn(θ̂ 成分の符号)の単位接線
  const th = Math.atan2(y, x), i = pitchDeg * Math.PI / 180;
  const tr = Math.sin(i), tt = sgn * Math.cos(i);
  return [tr * Math.cos(th) - tt * Math.sin(th), tr * Math.sin(th) + tt * Math.cos(th)];
};

/** 解析場 5 種(+ 3D の対照 1 種)の定義。すべて**宣言**(観測でも DFM の導出でもない)。 */
export const UNIT_FIELDS = {
  rigid: { Omega: 0.7, cx: 0.3, cy: -0.2 },
  shear: { gamma: 0.9 },
  extension: { a: 0.4 },
  pointVortex: { Gamma: 2 * Math.PI },
  flatRotation: { vc: 1, rh: 1 },                 // galaxyproto の宣言した剪断場と同じ形
  burgers3: { a: 0.3, Omega: 0.45 },              // 3D の対照: U=(−ax/2−Ωy, −ay/2+Ωx, az)
};

/**
 * 単体試験を回して行を返す。各行 { id, n, err:{S,omega,div,stretch,line}, maxErr, pass, … }。
 * h は差分の刻み(既定 1e-3)。**許容は STRAIN_UNIT_TOL(1e−10)**。
 */
export function runStrainUnitTests(opts) {
  const h = (opts && opts.h) || 1e-3;
  const F = UNIT_FIELDS;
  const pts = [[1.3, 0.4], [-0.8, 1.7], [2.2, -1.1], [-1.5, -2.4], [0.9, 2.9]];
  const pitches = [[18.4349, 1], [18.4349, -1], [45, 1], [70, -1]];
  const rows = [];
  const mk = (id, u, an, note) => {
    const e = { S: 0, omega: 0, div: 0, stretch: 0, line: 0, lineVsStretch: 0 };
    let n = 0, nNull = 0;
    for (const [x, y] of pts) {
      const A = an(x, y);
      for (const [pd, sg] of pitches) {
        const t = polarT(x - (A.cx || 0), y - (A.cy || 0), pd, sg);
        const s = strainAt(u, x, y, { h, tangent: t });
        if (!s) { nNull++; continue; }
        n++;
        e.S = Math.max(e.S, Math.abs(s.S[0] - A.S[0]), Math.abs(s.S[1] - A.S[1]), Math.abs(s.S[2] - A.S[2]));
        e.omega = Math.max(e.omega, Math.abs(s.omegaZ - A.omega));
        e.div = Math.max(e.div, Math.abs(s.div - A.div));
        const st = A.S[0] * t[0] * t[0] + 2 * A.S[1] * t[0] * t[1] + A.S[2] * t[1] * t[1];
        e.stretch = Math.max(e.stretch, Math.abs(s.stretch - st));
        e.line = Math.max(e.line, Math.abs(s.lineRate - st));
        e.lineVsStretch = Math.max(e.lineVsStretch, Math.abs(s.lineRate - s.stretch));
        if (A.stretchPolar) {       // 円運動の閉じた式 ±(r dΩ/dr) sin i cos i とも突き合わせる
          const sp = A.stretchPolar(pd, sg);
          e.stretch = Math.max(e.stretch, Math.abs(s.stretch - sp));
        }
      }
    }
    const maxErr = Math.max(e.S, e.omega, e.div, e.stretch, e.line);
    rows.push({ id, note, n, nNull, err: e, maxErr, pass: nNull === 0 && n > 0 && maxErr < STRAIN_UNIT_TOL });
  };
  // ① 剛体回転 u = Ω ẑ×(x−c): S=0・ω=2Ω・発散 0・どの接線でも伸び 0
  {
    const { Omega, cx, cy } = F.rigid;
    mk('rigid', (x, y) => [-Omega * (y - cy), Omega * (x - cx)],
      () => ({ S: [0, 0, 0], omega: 2 * Omega, div: 0, cx, cy, stretchPolar: () => 0 }),
      '剛体回転: S=0・ω=2Ω・伸び 0(どの接線でも)');
  }
  // ② 純ずり u=(γy,0): S_xy=γ/2・ω=−γ
  {
    const { gamma } = F.shear;
    mk('shear', (x, y) => [gamma * y, 0], () => ({ S: [0, gamma / 2, 0], omega: -gamma, div: 0 }),
      '純ずり: S_xy=γ/2・ω=−γ・伸び=γ t_x t_y');
  }
  // ③ 純伸長 u=(ax,−ay): S=diag(a,−a)・ω=0
  {
    const { a } = F.extension;
    mk('extension', (x, y) => [a * x, -a * y], () => ({ S: [a, 0, -a], omega: 0, div: 0 }),
      '純伸長: S=diag(a,−a)・ω=0・伸び=a cos2α');
  }
  // ④ 点渦 u=(Γ/2π)(−y,x)/r²: ω=0(r>0)・S_rθ=−Ω(r)=−Γ/(2πr²)
  {
    const { Gamma } = F.pointVortex, k = Gamma / (2 * Math.PI);
    mk('pointVortex', (x, y) => { const r2 = x * x + y * y; return [-k * y / r2, k * x / r2]; },
      (x, y) => {
        const r2 = x * x + y * y, th = Math.atan2(y, x), Om = k / r2, Srt = -Om;
        const c = Math.cos(th), s = Math.sin(th);
        // 極座標の S(S_rr=S_θθ=0)を直交座標へ: S_xx=−2S_rθ c s・S_xy=S_rθ(c²−s²)・S_yy=2S_rθ c s
        return { S: [-2 * Srt * c * s, Srt * (c * c - s * s), 2 * Srt * c * s], omega: 0, div: 0,
          stretchPolar: (pd, sg) => { const i = pd * Math.PI / 180; return 2 * Srt * Math.sin(i) * sg * Math.cos(i); } };
      }, '点渦: ω=0・S_rθ=−Ω・伸び=±(r dΩ/dr) sin i cos i');
  }
  // ⑤ 平坦回転曲線 v=v_c r/√(r²+r_h²)(差動回転): S_rθ=(r/2)dΩ/dr・ω=v/r+dv/dr
  {
    const { vc, rh } = F.flatRotation;
    mk('flatRotation', (x, y) => { const r2 = x * x + y * y, Om = vc / Math.sqrt(r2 + rh * rh); return [-Om * y, Om * x]; },
      (x, y) => {
        const r2 = x * x + y * y, r = Math.sqrt(r2), q = r2 + rh * rh, q32 = q * Math.sqrt(q);
        const v = vc * r / Math.sqrt(q), dv = vc * rh * rh / q32, rdOm = -vc * r2 / q32;
        const Srt = 0.5 * rdOm, th = Math.atan2(y, x), c = Math.cos(th), s = Math.sin(th);
        return { S: [-2 * Srt * c * s, Srt * (c * c - s * s), 2 * Srt * c * s], omega: v / r + dv, div: 0,
          stretchPolar: (pd, sg) => { const i = pd * Math.PI / 180; return rdOm * Math.sin(i) * sg * Math.cos(i); } };
      }, '平坦回転曲線(差動回転): S_rθ=(r/2)dΩ/dr・ω=v/r+dv/dr');
  }
  // ⑥ 2D の埋め込み: どの場でも (ω·∇)u が厳密に 0(=== 0)・面内の ω 成分も厳密に 0
  const emb = { id: 'embed2D', note: '2D の場を 3 次元へ埋め込む: (ω·∇)u = ω_z ∂_z u ≡ 0(=== 0)', n: 0, nExactZero: 0, nInPlaneZero: 0 };
  const fields2 = [
    (x, y) => [-F.rigid.Omega * (y - F.rigid.cy), F.rigid.Omega * (x - F.rigid.cx)],
    (x, y) => [F.shear.gamma * y, 0],
    (x, y) => { const r2 = x * x + y * y, Om = F.flatRotation.vc / Math.sqrt(r2 + 1); return [-Om * y, Om * x]; },
    (x, y) => { const r2 = x * x + y * y; return [-y / r2, x / r2]; },
  ];
  for (const u of fields2) for (const [x, y] of pts) {
    const r = vortexStretch2D(u, x, y, { h });
    if (!r) continue;
    emb.n++; if (r.exactZero) emb.nExactZero++; if (r.inPlaneOmegaZero) emb.nInPlaneZero++;
  }
  emb.pass = emb.n === fields2.length * pts.length && emb.nExactZero === emb.n && emb.nInPlaneZero === emb.n;
  rows.push(emb);
  // ⑦ 3D の対照(Burgers 型): ω=(0,0,2Ω)・(ω·∇)U=(0,0,2Ωa)・ω̂·S·ω̂=a —— 差分が「何でも 0 を返す」のではないことの確認
  {
    const { a, Omega } = F.burgers3;
    const U = (x, y, z) => [-a * x / 2 - Omega * y, -a * y / 2 + Omega * x, a * z];
    let e = 0, n = 0;
    for (const [x, y] of pts) {
      const r = vortexStretch3(U, x, y, 0.7, { h });
      if (!r) continue; n++;
      e = Math.max(e, Math.abs(r.omega[0]), Math.abs(r.omega[1]), Math.abs(r.omega[2] - 2 * Omega),
        Math.abs(r.stretch[0]), Math.abs(r.stretch[1]), Math.abs(r.stretch[2] - 2 * Omega * a),
        Math.abs(r.omegaStretchRate - a));
    }
    rows.push({ id: 'burgers3', note: '3D の対照: (ω·∇)U=(0,0,2Ωa)=' + (2 * Omega * a) + '(0 ではない)', n,
      stretchZ: 2 * Omega * a, maxErr: e, pass: n === pts.length && e < STRAIN_UNIT_TOL });
  }
  // ⑧ 材料線の独立検算: 平坦回転曲線の中で、接線方向に ±δ/2 離した 2 点を RK4 で ±τ 運び、
  //    d ln ℓ/dt の時間中心差分を t̂·S·t̂(差分の ∇u)と比べる(∇u を使わない独立な経路)。
  {
    const { vc, rh } = F.flatRotation;
    const u = (x, y) => { const r2 = x * x + y * y, Om = vc / Math.sqrt(r2 + rh * rh); return [-Om * y, Om * x]; };
    const rk4 = (p, dt) => {
      const f = (q) => u(q[0], q[1]);
      const k1 = f(p), k2 = f([p[0] + dt / 2 * k1[0], p[1] + dt / 2 * k1[1]]);
      const k3 = f([p[0] + dt / 2 * k2[0], p[1] + dt / 2 * k2[1]]), k4 = f([p[0] + dt * k3[0], p[1] + dt * k3[1]]);
      return [p[0] + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), p[1] + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
    };
    const delta = 1e-4, tau = 1e-3;
    let e = 0, n = 0, maxRate = 0;
    for (const [x, y] of pts) for (const [pd, sg] of pitches) {
      const t = polarT(x, y, pd, sg);
      const A = [x - delta / 2 * t[0], y - delta / 2 * t[1]], B = [x + delta / 2 * t[0], y + delta / 2 * t[1]];
      const Lp = Math.hypot(...[0, 1].map((k) => rk4(B, tau)[k] - rk4(A, tau)[k]));
      const Lm = Math.hypot(...[0, 1].map((k) => rk4(B, -tau)[k] - rk4(A, -tau)[k]));
      const rate = (Math.log(Lp) - Math.log(Lm)) / (2 * tau);
      const s = strainAt(u, x, y, { h, tangent: t });
      n++; e = Math.max(e, Math.abs(rate - s.stretch)); maxRate = Math.max(maxRate, Math.abs(s.stretch));
    }
    rows.push({ id: 'materialLine', note: '材料線 2 点の RK4 輸送(δ=1e−4・τ=±1e−3)の d ln ℓ/dt と t̂·S·t̂ の差'
      + '(有限の δ・τ・丸めを含む独立検算 —— 許容は 1e−7 を別に宣言)', n, delta, tau, tol: 1e-7,
      maxRate, maxErr: e, pass: n > 0 && e < 1e-7 });
  }
  return { version: STRAIN_VERSION, tol: STRAIN_UNIT_TOL, h, rows, allPass: rows.every((r) => r.pass) };
}
