// 第350便f(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R423):
//   **構造別の参考値と、個別の当てはめの診断 —— 引きずられ半径 ÷ 観測半径の係数 c_R が geoPN=3 の場(在位の形)のどこに入るか(2 つの入り方)・
//   リポジトリに在る比べる数の一覧・同じ量(歳差の率)と同じ誤差の置き方での 3 段(全体で 1 つ → 構造の組ごと → 天体ごと)・構造の組の参考値・
//   当てはめに使っていない量(自転の変化の率・熱)の予測の列 —— の純関数。診断だけ**
//   (器 tests/exp-w350f-structfit.mjs と QA behavior.structfit350f・docs.structfit350f が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・pairRot3・srcRot3 の形・galMass・YK・DECL.combos)・第348便c(composeAll・precess・massOf・radiusOf・galDistM・
//   DECL.groups・DECL.parentRows・LIT)・第347便h(rotOf —— 6 点の平均の点検だけ)・第347便e(t1Table・geometry・DECL.pairs・observedRates)・第341便f(LIT.heat)・第312便a(Kball)・
//   第342便e(galUnit)・第337c(GALAXY・定数)。
//
// ■ 原文(原仮定者の整理(2026-11-23 —— 第146報)): 「天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補。構造別の参考値を用意しつつ、
//   天体の構造を分析する為に、個別にフィットする」。統括の読み: 構造の組の参考値と天体ごとの当てはめの両方を出す。個別の当てはめは構造を見るための診断(較正の合格ではない)。
// ■ 係数の入り方(表 1): (i) 腕だけ —— (P2) の 2 点の差分の腕を c_R R_obs に伸ばす(有限の腕)・自分の重みは規則の半径 R_d = Y_k m の球の表面の値のまま((W) には腕が無い —— c_R に依らない)/
//   (ii) 自分の重みの球の半径も —— 受け手の球の半径 R_i = c_R R_obs(〔第348便h〕の (g3-3) の入り方 —— 自分の重みと (P2) の極限の腕の点の値がともに動く)。
//   規則の半径 R_d = Y_k m(〔第348便h〕の (g3-1) —— 無調整の対照の列)。
// ■ 背景軸引きずりは 2 列だけ(置き方は本便の枝 e): 「背景なし」= 銀河由来の回転を合成に足さない(分母の銀河の重みは場の一部として残す)/(B1)= 第348便h の galRot3 の値をそのまま足す
//   (= 第348便h の表の合成 W1)。衛星は母天体由来の項を足す(W1 + 母天体)。
// ■ 当てはめの量と誤差の置き方: 歳差の率 [″/年](第348便c の precess —— abs(Ω_釣)・δ ≠ 0)。残差 = ln(模型 ÷ 比べる数)・どの天体も同じ重み(相対の誤差を同じに置く)。
//   比べる数は第330便a の lib の値(文献の値・未照合 —— 固定の比べる列・合わせない)。役割が「桁」(水星)の行は当てはめに使わない(表に出すだけ)。
// ■ 言わないこと: 係数の値・天体の構造・較正の答えとは書かない(この場・この候補・このノブでは、の表)。解が無い・桁違い・平ら・範囲の端は、その事実を出す(最適化で任意の 1 点を選ばない)。
import * as L from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w350f-structfit-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  modes: Object.freeze(['arm', 'self']),
  bgs: Object.freeze(['none', 'B1']),
  cands: Object.freeze(['W', 'P2']),
  /** 天体ごとの代表の行(衛星は母天体の行 —— 第348便c の repKey と同じ) */
  reps: Object.freeze([['Mercury', 'Sun'], ['Venus', 'Sun'], ['Earth', 'Sun'], ['Mars', 'Sun'], ['Jupiter', 'Sun'], ['Saturn', 'Sun'], ['Uranus', 'Sun'], ['Neptune', 'Sun'],
    ['Moon', 'EarthHi'], ['Io', 'Jupiter'], ['Pluto', 'Charon']].map((x) => Object.freeze(x))),
  groups: C.DECL.groups,
  /** c_R の格子: (ii) は log10 c = −12〜3(0.25 刻み)・(i) は 0.1・1・10(腕が距離を超えない範囲) */
  gridSelf: Object.freeze({ lo: -12, hi: 3, step: 0.25 }), gridArm: Object.freeze([0.1, 1, 10]),
  /** 事実を出す物差し: 桁違い(c ≥ 1e3 か c ≤ 1e-3)・平ら(c を 10 倍しても量が 1% も動かない) */
  big: 1e3, small: 1e-3, flatRel: 0.01,
  /** 当てはめに使う比べる数の役割 */
  fitRole: 'lit',
  /** 誤差の置き方: 残差 ln(模型 ÷ 比べる数)・重み 1(どの天体も同じ) */
  resid: 'ln',
  nBisect: 64, nGolden: 80,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });
/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料に当たっていない)',
  precArcsecPerYr: C.LIT.precArcsecPerYr, precRole: C.LIT.precRole, precSrc: C.LIT.precSrc, heat: F.LIT.heat,
});
/** 比べる数の所在(表 2 —— 新しい数は足さない) */
export const WHERE = Object.freeze({
  prec: 'tests/lib-w330a-spinclass.mjs の DECL.lit.precessionArcsecPerYear(第348便c の LIT.precArcsecPerYr が引く)',
  spin: 'tests/lib-w347e-spintorque.mjs の observedRates()(地球は一日の長さの変化・火星は自転の角加速度から)',
  heat: 'tests/lib-w341f-gyroheat.mjs の LIT.heat(第330便a の lib の熱流)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const COMBO = Object.freeze({ rule: L.DECL.combos.find((c) => c.id === 'K1rM'), cR: L.DECL.combos.find((c) => c.id === 'K1cM') });
export const groupOf = (id) => { const g = Object.entries(DECL.groups).find(([, v]) => v.includes(id)); return g ? g[0] : null; };
export const precObs = (id) => { const k = NAME[id]; return k && LIT.precArcsecPerYr[k] !== undefined ? { asYr: LIT.precArcsecPerYr[k], role: LIT.precRole[k] } : null; };
/** 規則の半径 ÷ 観測半径 */
export const ruleRatio = (id) => L.YK * C.massOf(id) / C.radiusOf(id);
export function cGrid() { const g = DECL.gridSelf, out = []; for (let k = 0; g.lo + k * g.step <= g.hi + 1e-12; k++) out.push(Math.pow(10, g.lo + k * g.step)); return out; }

/* ───────── (i) 腕だけ: 有限の腕の (P2)(自分の重みは規則の半径の表面の値のまま —— 分母の定数)───────── */
function armSrc(T1, GEO, id, src, armR, extraW) {
  const r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), g = GEO[id + '|' + src];
  const ws = r2.OmegaT, beta = r2.Om1 / ws, sid = srcId(src), Ms = C.massOf(sid), a = G * Ms / (beta * C0 * C0), vOrb = Math.sqrt(beta) * C0, Rs = L.YK * Ms, nP = L.DECL.nPhase;
  const s = unit(g.s), n = unit(g.n), x0 = crs(s, n), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(n)[0], y = crs(n, x);
  let m = [0, 0, 0];
  for (let k = 0; k < nP; k++) {
    const ph = 2 * Math.PI * (k + 0.5) / nP, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(n, rh);
    const f = L.makeField3({ sources: [{ m: Ms, R: Rs, p: scl(rh, -a), v: scl(vh, -vOrb), spin: scl(s, ws) }], recv: { p: [0, 0, 0], v: [0, 0, 0] }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: false });
    m = add(m, scl(L.rot3('P2', f, [0, 0, 0], { e: rh, Rb: armR, lim: false }), 1 / nP));
  }
  return m;
}
function armGal(armR, extraW) {
  const gU = P.galUnit(), d = C.galDistM(), Mg = L.galMass(), v = Math.sqrt(TL.GALAXY.beta) * C0, Rg = L.YK * Mg, [e1, e2] = perpPair(gU), nG = L.DECL.nGal;
  let m = [0, 0, 0];
  for (let k = 0; k < nG; k++) {
    const ph = 2 * Math.PI * k / nG, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), vh = crs(gU, rh);
    const f = L.makeField3({ sources: [{ m: Mg, R: Rg, p: scl(rh, -d), v: scl(vh, -v), spin: scl(gU, TL.GALAXY.omega) }], recv: { p: [0, 0, 0], v: [0, 0, 0] }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: false });
    m = add(m, scl(L.rot3('P2', f, [0, 0, 0], { e: rh, Rb: armR, lim: false }), 1 / nG));
  }
  return m;
}

/* ───────── 由来ごとの回転(入り方 × c)───────── */
/**
 * 由来ごとの回転のベクトル {W:{G,S,P}, P2:{G,S,P}} と、自分の重み・他の重み。mode 'rule'(規則の半径 —— c は読まない)・'self'((ii) R_i = c R_obs)・'arm'((i) 腕 c R_obs)。
 */
export function vecsOf(T1, GEO, id, src, mode, c) {
  if (!['rule', 'self', 'arm'].includes(mode)) throw new RangeError('vecsOf: 入り方は rule・self・arm');
  if (mode !== 'rule' && !(fin(c) && c > 0)) throw new RangeError('vecsOf: c_R > 0');
  const R = mode === 'self' ? L.pairRot3(T1, GEO, id, src, COMBO.cR, { cRv: c }) : L.pairRot3(T1, GEO, id, src, COMBO.rule);
  const out = { W: { G: R.G.W, S: R.S.W, P: R.P ? R.P.W : null }, P2: { G: R.G.P2, S: R.S.P2, P: R.P ? R.P.P2 : null }, wSun: R.wSun, wPar: R.wPar, wGal: R.wGal, Ri: R.S.Ri };
  if (mode === 'arm') {
    const m = C.massOf(id), Rd = L.YK * m, selfW = m * D.Kball(1, Rd, Rd), armR = c * C.radiusOf(id);
    const sunKey = src === 'Sun' ? id + '|' + src : C.DECL.parentRows[id + '|' + src], [sid, ssrc] = sunKey.split('|');
    out.P2 = { G: armGal(armR, selfW + R.wSun + R.wPar), S: armSrc(T1, GEO, sid, ssrc, armR, selfW + R.wGal + R.wPar), P: src === 'Sun' ? null : armSrc(T1, GEO, id, src, armR, selfW + R.wGal + R.wSun) };
  }
  return out;
}
/** 合成(背景なし: 銀河由来を足さない・(B1): galRot3 の値をそのまま足す)と歳差の率 */
export function rateOf(T1, GEO, id, src, V, cand, bg) {
  if (!DECL.cands.includes(cand) || !DECL.bgs.includes(bg)) throw new RangeError('rateOf: 候補・背景');
  const v = V[cand], key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w);
  const CC = C.composeAll(bg === 'B1' ? v.G : [0, 0, 0], v.S, v.P), cc = v.P ? CC.W1P : CC.W1, p = C.precess(cc.e, cc.mag, wAx, r2.I, r2.omega);
  const perp = nrm(sub(cc.vec, scl(wAx, dot(cc.vec, wAx))));
  return { precAsYr: p.precAsYr, deltaDeg: p.deltaDeg, magYr: cc.mag * YR, perp, I: r2.I, omega: r2.omega,
    /** 当てはめに使っていない量(第348便h の式): 慣性回転へ (S1)(E1) の自転の増え方 Ω⊥² ÷ ω [1/年]・引きずり回転へ (S1)(E3) の熱 I ω Ω⊥² [W] */
    spinRateYr: perp * perp / Math.abs(r2.omega) * YR, heatW: r2.I * Math.abs(r2.omega) * perp * perp };
}

/* ───────── 曲線と当てはめ(事実を出す)───────── */
/** 作り直しの道具: 代表の行 × 入り方 × c の値の写し(同じ走りの中だけ —— 状態は返り値に持つ) */
export function makeCtx(T1 = E.t1Table(), GEO = E.geometry()) {
  const memo = new Map();
  const at = (id, src, mode, c) => { const k = id + '|' + src + '|' + mode + '|' + (mode === 'rule' ? '' : c); let v = memo.get(k); if (!v) { v = vecsOf(T1, GEO, id, src, mode, c); memo.set(k, v); } return v; };
  const rate = (id, src, mode, c, cand, bg) => rateOf(T1, GEO, id, src, at(id, src, mode, c), cand, bg);
  return { T1, GEO, at, rate };
}
/**
 * 1 つの量 f(c)(c > 0)と比べる数 obs の解: 格子 cs の上で ln(f ÷ obs) の符号が変わる区間を数え、1 つなら ln c で二分法。
 * 返り値 { status: 'one'|'none'|'many', c, crossings, above(比べる数が格子の最大より上)・below, flatAt(解で 10 倍の c の動き < 1%)・flatAll(格子の上の最大 ÷ 最小 − 1 < 1%)・big・small }
 */
export function solveOne(f, obs, cs, { nB = DECL.nBisect, flatRel = DECL.flatRel } = {}) {
  if (!(fin(obs) && obs > 0 && Array.isArray(cs) && cs.length >= 2)) throw new RangeError('solveOne: 比べる数 > 0・格子 2 点以上');
  const ys = cs.map((c) => Math.log(f(c) / obs)), vals = cs.map((c, k) => obs * Math.exp(ys[k])), mx = Math.max(...vals), mn = Math.min(...vals);
  const cr = []; for (let k = 0; k + 1 < cs.length; k++) if (ys[k] === 0 || ys[k] * ys[k + 1] < 0) cr.push(k);
  const flatAll = mx / mn - 1 < flatRel, base = { crossings: cr.length, fMin: mn, fMax: mx, above: obs > mx, below: obs < mn, flatAll };
  if (flatAll) return { status: 'flat', c: null, ...base, flatAt: null, big: null, small: null, slope: null };   // 平ら(格子の上で 1% も動かない)—— 解の有無を言わない・1 点を選ばない
  if (cr.length !== 1) return { status: cr.length === 0 ? 'none' : 'many', c: null, ...base, flatAt: null, big: null, small: null, slope: null };
  let lo = Math.log(cs[cr[0]]), hi = Math.log(cs[cr[0] + 1]), ylo = ys[cr[0]];
  if (ylo === 0) hi = lo; else for (let i = 0; i < nB; i++) { const mid = 0.5 * (lo + hi), ym = Math.log(f(Math.exp(mid)) / obs); if (ym === 0) { lo = hi = mid; break; } if (ym * ylo < 0) hi = mid; else { lo = mid; ylo = ym; } }
  const c = Math.exp(0.5 * (lo + hi)), f1 = f(c), f10 = f(10 * c);
  return { status: 'one', c, ...base, flatAt: Math.abs(f10 / f1 - 1) < flatRel, big: c >= DECL.big, small: c <= DECL.small, slope: Math.log(f10 / f1) / Math.log(10) };
}
/**
 * 共通の c で n 個の量を同時に(残差 ln(f_i ÷ obs_i)・重み 1): 格子の最小 → 隣の 2 区間で黄金分割。最小が格子の端なら status 'edge'(内に解なし)。
 */
export function solveJoint(fs, obs, cs, { nG = DECL.nGolden, flatRel = DECL.flatRel } = {}) {
  if (!(fs.length === obs.length && fs.length >= 1)) throw new RangeError('solveJoint: 量と比べる数の数');
  const S = (c) => fs.reduce((t, f, i) => { const r = Math.log(f(c) / obs[i]); return t + r * r; }, 0), ss = cs.map(S);
  let k0 = 0; for (let k = 1; k < cs.length; k++) if (ss[k] < ss[k0]) k0 = k;
  const flatAll = fs.every((f) => { const v = cs.map(f); return Math.max(...v) / Math.min(...v) - 1 < flatRel; });   // どの量も格子の上で 1% も動かない
  if (flatAll) return { status: 'flat', c: null, edge: null, sse: null, flatAll, resid: null, flatAt: null, big: null, small: null };   // 平ら —— 1 点を選ばない
  if (k0 === 0 || k0 === cs.length - 1) return { status: 'edge', c: cs[k0], edge: k0 === 0 ? 'lo' : 'hi', sse: ss[k0], flatAll, resid: fs.map((f, i) => Math.log(f(cs[k0]) / obs[i])), flatAt: null, big: null, small: null };
  let a = Math.log(cs[k0 - 1]), b = Math.log(cs[k0 + 1]); const gr = (Math.sqrt(5) - 1) / 2;
  let x1 = b - gr * (b - a), x2 = a + gr * (b - a), s1 = S(Math.exp(x1)), s2 = S(Math.exp(x2));
  for (let i = 0; i < nG; i++) { if (s1 < s2) { b = x2; x2 = x1; s2 = s1; x1 = b - gr * (b - a); s1 = S(Math.exp(x1)); } else { a = x1; x1 = x2; s1 = s2; x2 = a + gr * (b - a); s2 = S(Math.exp(x2)); } }
  const c = Math.exp(0.5 * (a + b)), resid = fs.map((f, i) => Math.log(f(c) / obs[i])), flatAt = fs.every((f) => Math.abs(f(10 * c) / f(c) - 1) < flatRel);
  return { status: 'one', c, sse: resid.reduce((t, r) => t + r * r, 0), resid, flatAll, flatAt, big: c >= DECL.big, small: c <= DECL.small };
}

/* ───────── 表 1 係数の入り方 ───────── */
export function entryRows(X = makeCtx()) {
  const out = [], cs = cGrid();
  for (const [id, src] of DECL.reps) for (const cand of DECL.cands) {
    const rr = ruleRatio(id), f = (mode, c, bg = 'none') => X.rate(id, src, mode, c, cand, bg).precAsYr;
    const rule = f('rule', null), armCurve = DECL.gridArm.map((c) => f('arm', c)), self1 = f('self', 1), self1B = f('self', 1, 'B1');
    const selfMax = Math.max(...cs.map((c) => f('self', c))), V = X.at(id, src, 'rule', null), wOth = V.wSun + V.wPar + V.wGal;
    out.push({ id, src, cand, group: groupOf(id), ruleRatio: rr, rule, ruleB1: f('rule', null, 'B1'), arm1: f('arm', 1), armSpread: Math.max(...armCurve) / Math.min(...armCurve) - 1, armVsRule: Math.abs(f('arm', 1) / rule - 1),
      self1, self1B, selfMax, slopeRule: Math.log(f('self', 2 * rr) / f('self', rr)) / Math.log(2), slopeTo05: Math.log(f('self', 0.5) / rule) / Math.log(0.5 / rr), slope1: Math.log(f('self', 2) / f('self', 0.5)) / Math.log(4),
      /** 自分の重み(中心 3m/(2R_i)・腕の点 m/R_i)と他の源の重みが等しくなる c_R */
      cStar: (cand === 'W' ? 1.5 : 1) * C.massOf(id) / (C.radiusOf(id) * wOth) });
  }
  return out;
}

/* ───────── 表 2 比べる数の一覧 ───────── */
export function obsRows() {
  const spin = E.observedRates();
  return DECL.reps.map(([id, src]) => {
    const p = precObs(id), s = spin.find((x) => x.id === id), h = LIT.heat[id];
    return { id, src, group: groupOf(id), prec: p ? { asYr: p.asYr, role: p.role } : null, spin: s ? { rateYr: s.rateYr, relUnc: s.relUnc } : null, heat: fin(h) ? h : null };
  });
}

/* ───────── 表 3 当てはめの診断 3 段 ───────── */
/** 当てはめに使う天体(比べる数の役割が lit)と、スケールの組の入り方の格子 */
export const fitIds = () => DECL.reps.filter(([id]) => { const p = precObs(id); return p && p.role === DECL.fitRole; });
export function fitRows(X = makeCtx(), { obsScale = null } = {}) {
  const out = [], ids = fitIds();
  const obsOf = (id) => precObs(id).asYr * (obsScale && obsScale[id] ? obsScale[id] : 1);
  for (const mode of DECL.modes) for (const cand of DECL.cands) for (const bg of DECL.bgs) {
    const cs = mode === 'arm' ? DECL.gridArm.slice() : cGrid(), fOf = ([id, src]) => (c) => X.rate(id, src, mode, c, cand, bg).precAsYr;
    const sc = { mode, cand, bg };
    // (全) 全体で 1 つ
    const all = solveJoint(ids.map(fOf), ids.map(([id]) => obsOf(id)), cs);
    out.push({ ...sc, level: 'all', set: 'all', ids: ids.map(([id]) => id), n: ids.length, dof: ids.length - 1, ...all });
    // (組) 構造の組ごと
    for (const g of Object.keys(DECL.groups)) {
      const gi = ids.filter(([id]) => groupOf(id) === g);
      if (!gi.length) { out.push({ ...sc, level: 'group', set: g, ids: [], n: 0, dof: null, status: 'nodata', c: null }); continue; }
      const r = solveJoint(gi.map(fOf), gi.map(([id]) => obsOf(id)), cs);
      out.push({ ...sc, level: 'group', set: g, ids: gi.map(([id]) => id), n: gi.length, dof: gi.length - 1, ...r });
    }
    // (個) 天体ごと(比べる数の無い天体は値を作らない)
    for (const [id, src] of DECL.reps) {
      const p = precObs(id);
      if (!p || p.role !== DECL.fitRole) { out.push({ ...sc, level: 'body', set: id, ids: [id], n: 0, dof: null, status: p ? 'role' : 'nodata', role: p ? p.role : null, c: null }); continue; }
      const r = solveOne(fOf([id, src]), obsOf(id), cs);
      out.push({ ...sc, level: 'body', set: id, ids: [id], n: 1, dof: 0, ...r, resid: r.status === 'one' ? [Math.log(fOf([id, src])(r.c) / obsOf(id))] : null });
    }
  }
  return out;
}

/* ───────── 表 4 構造の組の参考値(天体ごとの c の中央値と幅)───────── */
const median = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
export function refRows(FR) {
  const out = [];
  for (const mode of DECL.modes) for (const cand of DECL.cands) for (const bg of DECL.bgs) for (const g of Object.keys(DECL.groups)) {
    const bs = FR.filter((r) => r.mode === mode && r.cand === cand && r.bg === bg && r.level === 'body' && DECL.groups[g].includes(r.set)), cs = bs.filter((r) => r.status === 'one').map((r) => r.c);
    out.push({ mode, cand, bg, group: g, members: DECL.groups[g].length, nData: bs.filter((r) => r.n === 1).length, nSol: cs.length, median: cs.length ? median(cs) : null, min: cs.length ? Math.min(...cs) : null, max: cs.length ? Math.max(...cs) : null,
      spread: cs.length >= 2 ? Math.max(...cs) / Math.min(...cs) : null, log10From1: cs.length ? Math.log10(median(cs)) : null });
  }
  return out;
}

/* ───────── 表 5 当てはめに使っていない量(予測の列 —— 合わせない)───────── */
export function predRows(X, FR) {
  const out = [], obs = obsRows();
  for (const cand of DECL.cands) for (const bg of DECL.bgs) {
    const sel = (lv, set) => FR.find((r) => r.mode === 'self' && r.cand === cand && r.bg === bg && r.level === lv && r.set === set);
    for (const [id, src] of DECL.reps) {
      const b = sel('body', id), g = sel('group', groupOf(id)), a = sel('all', 'all');
      const pick = b && b.status === 'one' ? ['body', b.c] : g && g.status === 'one' ? ['group', g.c] : a && a.status === 'one' ? ['all', a.c] : [null, null];
      const o = obs.find((x) => x.id === id), r = pick[1] === null ? null : X.rate(id, src, 'self', pick[1], cand, bg), r0 = X.rate(id, src, 'rule', null, cand, bg);
      out.push({ cand, bg, id, src, from: pick[0], c: pick[1], spinRateYr: r ? r.spinRateYr : null, heatW: r ? r.heatW : null, ruleSpinRateYr: r0.spinRateYr, ruleHeatW: r0.heatW,
        obsSpinRateYr: o.spin ? o.spin.rateYr : null, obsHeatW: o.heat, spinOverObs: r && o.spin ? r.spinRateYr / Math.abs(o.spin.rateYr) : null, heatOverObs: r && o.heat ? r.heatW / o.heat : null });
    }
  }
  return out;
}

/* ───────── 零試験・変異・共通の点検の数 ───────── */
export const COMMON = Object.freeze({ p2x: -0.03061311, p6: -0.01530656, w: -0.01530612, tol: 5e-9 });
export function pureScenes(X = makeCtx()) {
  const fld = (sv, rv = [0, 0, 0], o = {}) => L.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: sv, spin: [0, 0, 0] }], recv: { m: 1, R: 1, p: [4, 0, 0], v: rv }, W0: 0, ...o });
  const rc = [4, 0, 0], h = 0.01, p2 = (f) => L.rot3('P2', f, rc, { e: [1, 0, 0], Rb: h, lim: false }), f0 = fld([0, 1, 0]);
  // ① 共通の点検の数(統括の数え直し): x の直径の 2 点の差分・直交 3 直径の 6 点の平均・中心の渦度の半分
  const cm = { p2x: p2(f0)[2], p6: H.rotOf('P6', f0, rc, { e: [1, 0, 0], Rb: h }).Om[2], w: L.rot3('W', f0, rc, { Rb: h })[2] };
  // ② 反転・中心線の通過・相対静止・自分の重みと背景が 0・同じ速度を足しても不変
  const inv = { flip: p2(fld([0, -1, 0]))[2], center: nrm(p2(fld([1, 0, 0]))), rest: nrm(p2(fld([0, 1, 0], [0, 1, 0]))),
    noSelf: nrm(p2(L.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 1, 0], spin: [0, 0, 0] }], recv: { p: [4, 0, 0], v: [0, 0, 0] }, W0: 0, self: false }))), boost: rel(p2(fld([3, -1, 1], [3, -2, 1])), p2(f0)) };
  // ③ 剛体回転 (1,2,3) × r と純粋なずれ (y, x, 0)
  const rig = { u: (x) => crs([1, 2, 3], x) }, sh = { u: (x) => [x[1], x[0], 0] }, x0 = [0.3, 0.2, 0.1];
  const rs = { rig6: H.rotOf('P6', rig, x0, { e: [1, 0, 0], Rb: h }).Om, rigX: H.rotOf('P2', rig, x0, { e: [1, 0, 0], Rb: h }).Om, shX: H.rotOf('P2', sh, [0, 0, 0], { e: [1, 0, 0], Rb: h }).Om, sh6: H.rotOf('P6', sh, [0, 0, 0], { e: [1, 0, 0], Rb: h }).Om };
  // ④ 第348便h の表との一致: (ii) で c = 規則の比 → (g3-1)・(ii) で c = 1 の (B1) → (g3-3)・(i) で c = 1 の (W) → (g3-1)・(P2) は有限の腕の差だけ
  const R3 = (id, src, combo, cand, o = {}) => { const R = L.pairRot3(X.T1, X.GEO, id, src, L.DECL.combos.find((c) => c.id === combo), o), cc = C.composeAll(R.G[cand], R.S[cand], R.P ? R.P[cand] : null), w = cc.W1P || cc.W1, key = id + '|' + src;
    const r2 = X.T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'); return C.precess(w.e, w.mag, unit(X.GEO[key].w), r2.I, r2.omega).precAsYr; };
  let h4 = 0, a4 = 0;
  for (const [id, src] of [['Earth', 'Sun'], ['Moon', 'EarthHi'], ['Jupiter', 'Sun']]) for (const cand of DECL.cands) {
    h4 = Math.max(h4, Math.abs(X.rate(id, src, 'self', ruleRatio(id), cand, 'B1').precAsYr / R3(id, src, 'K1rM', cand) - 1), Math.abs(X.rate(id, src, 'self', 1, cand, 'B1').precAsYr / R3(id, src, 'K1cM', cand) - 1),
      Math.abs(X.rate(id, src, 'rule', null, cand, 'B1').precAsYr / R3(id, src, 'K1rM', cand) - 1));
    if (cand === 'W') h4 = Math.max(h4, Math.abs(X.rate(id, src, 'arm', 1, 'W', 'B1').precAsYr / R3(id, src, 'K1rM', 'W') - 1));
    else a4 = Math.max(a4, Math.abs(X.rate(id, src, 'arm', 1, 'P2', 'B1').precAsYr / R3(id, src, 'K1rM', 'P2') - 1));
  }
  const earth = { W: X.rate('Earth', 'Sun', 'rule', null, 'W', 'none').precAsYr, P2: X.rate('Earth', 'Sun', 'rule', null, 'P2', 'none').precAsYr, armW1: X.rate('Earth', 'Sun', 'arm', 1, 'W', 'none').precAsYr,
    armP21: X.rate('Earth', 'Sun', 'arm', 1, 'P2', 'none').precAsYr, selfW1: X.rate('Earth', 'Sun', 'self', 1, 'W', 'none').precAsYr };
  // ⑤ 当てはめの道具の自己試験(合成の曲線): 平ら → 解なし・平ら/2 つの交わり → 複数/範囲の外 → 解なし(上)/冪 2 → 解析の解/共通の c の最小が端 → edge
  const cs = [1e-3, 1e-2, 1e-1, 1, 10, 100];
  const t5 = { flat: solveOne(() => 1, 2, cs), many: solveOne((c) => 1 + Math.pow(Math.log10(c), 2), 2, cs), above: solveOne((c) => c, 1e9, cs), pow: solveOne((c) => c * c, 4, cs), edge: solveJoint([(c) => c], [1e9], cs) };
  // ⑥ 変異: 比べる数を 2 倍にすると地球の c が動く(局所の冪から見込む向き)/比べる数の無い天体に値を作らない
  const cs2 = cGrid(), fE = (c) => X.rate('Earth', 'Sun', 'self', c, 'W', 'none').precAsYr, s1 = solveOne(fE, precObs('Earth').asYr, cs2), s2 = solveOne(fE, 2 * precObs('Earth').asYr, cs2);
  const mut = { moved: s1.status === 'one' && s2.status === 'one' && s2.c > s1.c * 1.01, noData: ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Io', 'Pluto'].every((id) => precObs(id) === null), mercuryRole: precObs('Mercury').role };
  // ⑦ 拒否
  const rej = [() => vecsOf(X.T1, X.GEO, 'Earth', 'Sun', 'x', 1), () => vecsOf(X.T1, X.GEO, 'Earth', 'Sun', 'self', 0), () => vecsOf(X.T1, X.GEO, 'Earth', 'Sun', 'arm', -1),
    () => rateOf(X.T1, X.GEO, 'Earth', 'Sun', X.at('Earth', 'Sun', 'rule', null), 'G', 'none'), () => rateOf(X.T1, X.GEO, 'Earth', 'Sun', X.at('Earth', 'Sun', 'rule', null), 'W', 'B9'), () => solveOne(() => 1, -1, cs)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { common: cm, inv, rs, h4, a4, earth, t5, mut, rejects: rej };
}
export function pureGates(S) {
  const t = COMMON.tol, near = (a, b, e = 1e-12) => nrm(sub(a, b)) <= e;
  return {
    common: Math.abs(S.common.p2x - COMMON.p2x) < t && Math.abs(S.common.p6 - COMMON.p6) < t && Math.abs(S.common.w - COMMON.w) < t,
    invariances: Math.abs(S.inv.flip + S.common.p2x) < 1e-12 && S.inv.center < 1e-12 && S.inv.rest < 1e-12 && S.inv.noSelf < 1e-12 && S.inv.boost < 1e-12,
    rigidShear: near(S.rs.rig6, [1, 2, 3]) && near(S.rs.rigX, [0, 2, 3]) && near(S.rs.shX, [0, 0, 1]) && near(S.rs.sh6, [0, 0, 0]),
    vs348h: S.h4 < 1e-12 && S.a4 < 1e-6,
    earth348h: Math.abs(S.earth.W / 5.06e-2 - 1) < 1e-3 && Math.abs(S.earth.armW1 / S.earth.W - 1) < 1e-12 && Math.abs(S.earth.armP21 / S.earth.P2 - 1) < 1e-6 && S.earth.selfW1 > 1e3 * S.earth.W,
    solver: S.t5.flat.status === 'flat' && S.t5.flat.flatAll && S.t5.flat.c === null && S.t5.many.status === 'many' && S.t5.above.status === 'none' && S.t5.above.above && S.t5.pow.status === 'one' && Math.abs(S.t5.pow.c - 2) < 1e-9 && S.t5.edge.status === 'edge' && S.t5.edge.edge === 'hi',
    mutants: S.mut.moved && S.mut.noData && S.mut.mercuryRole === 'order',
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
