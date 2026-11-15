// 第339便a(原仮定者の回答(2026-11-14 —— AN712)「2 つ以上の量を同じノブで満たした候補だけを、既定 OFF の設定と『探索用・未較正』の本として入れる」・統括の検証項目 R355):
//   **回転引きずりの鉛直の型(beta の html の physics.rotDragVert —— 既定 OFF・探索用・未較正)を第337便i の lib と点ごとに照らす純関数**
//   (器 tests/exp-w339a-rotvert.mjs と QA behavior.rotvert339a・docs.rotvert339a が読む —— html を読まない・状態を持たない・第337便i の lib は呼ぶだけ)。
//
// ■ 候補(走行の前に宣言 —— 結果を見て変えない): 第337便i の代表 reps[0] = `slice|focus|Req|obs`(帯の型 × 鉛直へ寄せる作用 × 扁平の則の R_eq × 観測自転)。
//   2 つの量を同じノブで満たした組 = (i) 土星の環の物差し(1e7 年の内に全部の点の傾きが e 分の 1・ケプラーからのずれと漂い ≤ 1e-5 —— lib の ringJudge)と
//   (ii) 同じ λ での水星・金星・地球・火星の尺度の比 ≤ 1(lib の planetScaleRatios)・水星の近点の率 ≤ 1PN の 1e-10 倍。ここでは lib を呼んで要る λ と 2 つの判定を測り直す。
// ■ エンジンの式(beta の html の rotDragVertFieldAt —— 本の単位): |z| < R_eq の帯の内で d = −λ r (s z/ρ) k̂・R_eq = rdScale·Y_k·m/(1 − f)^q。lib の effectOfSpec の d(SI)を
//   本の単位へ換算して点ごとに比べる(相対 1e-12 + z = p·k̂ の打ち消しの丸めの分 —— compareField の注記・両方 0 の点は 0 —— 帯の外と赤道面の上)。
// ■ 言わないこと: 土星の環を回転引きずりで薄くした・環の厚みを決めた・法則である、とは書かない(探索用・未較正・このノブの組では)。見えるようにした倍率(強さ 1e5 倍・
//   帯の厚み 2e6 倍)は表示のための宣言で、候補の値ではない。
import * as RR from './lib-w337i-rotring.mjs';

export const LIB_VERSION = 'w339a-rotvert-lib-1';
const isFin = Number.isFinite;

/* ───────── 宣言(走行の前 —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  candidate: Object.freeze({ key: 'slice|focus|Req|obs', spec: Object.freeze({ prof: 'slice', action: 'focus', reading: 'Req', speed: 'obs' }), from: 'tests/out/rotring-337i.json の reps[0](第337便i)' }),
  /** 本の宣言(🛟 saturnRotVertExplore3d)の見えるようにした倍率 —— 候補の要る λ に掛けた倍・R_d に掛けた倍 */
  visibility: Object.freeze({ lambdaScale: 1e5, rdScale: 2e6, why: '正本の λ(1e7 年で薄くなる強さ)と帯の厚み R_eq(土星で 5.18 m)のままでは画面で見えない —— 帯の内の率 λ s r/ρ は R_d に依らない(一様厚みの区間)ので、帯を広げても帯の内の傾きの減り方は候補の率 × 強さの倍' }),
  /** 本の単位(🛟 の scaleExp —— 1 単位 = 10^6 m・10^2 s・10^25 kg) */
  units: Object.freeze({ L: 1e6, T: 1e2, M: 1e25 }),
  /** 点の照合の物差し */
  matchTol: 1e-12,
  /** 帯の端の近く(|z|/R_eq が 1 から edgeGap の内)の点は置かない(割り算の丸めで帯の内外が入れ替わる) */
  edgeGap: 1e-9,
  /** 本の走行(步の数 —— 600 は 600 步の照合の窓・3000 は傾きの e 分の 1 の時間の桁) */
  steps: Object.freeze([600, 3000]),
  /** 走行の判定: ON の傾きの比が解析の目安 exp(−λ s t/2)(帯の内・小さい傾きの閉じた式 di/dt = −(a/2) sin i cos i)の相対 rateTol の内・OFF の比は 1 から offTol の内・群の比の広がり ≤ spreadTol */
  runJudge: Object.freeze({ rateTol: 0.05, offTol: 0.05, spreadTol: 0.05 }),
  /** 候補の判定の物差し(第337便i と同じ) */
  mercQ1Max: 1e-10,
});

/* ───────── 候補の測り直し(第337便i の lib を呼ぶ)───────── */
/** 要る λ と 2 つの判定(環・4 惑星)を lib で測り直す。値の丸めの残りになりうる比は「床より小さいか」だけを返す */
export function candidateCheck() {
  const sat = RR.sourceOf('saturn'), sun = RR.sourceOf('sun'), spec = DECL.candidate.spec;
  const eS = RR.effectOfSpec(sat, { ...spec, lambda: 1 }), RdS = RR.rdOf(sat, spec.reading);
  const rows = [];
  for (const rk of RR.DECL.ring.keys) {
    const R = RR.LIT.rings.find((x) => x.key === rk);
    for (const zMax of RR.DECL.ring.zMax) { const sys = RR.ringSys(sat, { r: R.r, zMax }); rows.push(RR.ringRow(sys, eS, RR.pointsOf(sys, RdS))); }
  }
  const J = RR.ringJudge(rows);
  const eU = RR.effectOfSpec(sun, { ...spec, lambda: 1 }), RdU = RR.rdOf(sun, spec.reading), planets = {};
  for (const pk of RR.DECL.planets) {
    const sys = RR.planetSys(pk), u = RR.planetRow(sys, eU, RR.pointsOf(sys, RdU), RdU), r = J.thin ? RR.scalePlanetRow(u, J.lambdaNeed) : null;
    const sr = r ? RR.planetScaleRatios(sys, r) : null, q1 = r ? Math.abs(r.apsW / RR.q1cyOf(sys)) : null;
    planets[pk] = { insideScale: !!sr && Object.values(sr).every((x) => x <= 1), scaleMaxBelow1e9: !!sr && Object.values(sr).every((x) => x < 1e-9), q1Below: q1 === null ? null : q1 <= DECL.mercQ1Max };
  }
  return { key: DECL.candidate.key, ringPoints: rows.length, ringThin: J.thin, ringPass: J.pass, lambdaNeed: J.lambdaNeed,
    ringKeplerTol: RR.DECL.ringJudge.keplerTol, ringDriftTol: RR.DECL.ringJudge.driftTol, tThinYr: RR.DECL.ringJudge.tThinYr,
    RdSatYk: RR.rdOf(sat, 'Yk'), ReqSat: RdS, ReqOverYk: RdS / RR.rdOf(sat, 'Yk'), satSpin: sat.s,
    planets, bothMet: J.thin && J.pass && Object.values(planets).every((p) => p.insideScale) && planets.merc.q1Below === true };
}

/* ───────── lib の場(SI)を本の単位で ───────── */
/** 本の宣言の値(本の単位)から lib の源を作る(SI) */
export function libSourceOf({ mApp, sApp, fFlat, axis }, U = DECL.units) {
  if (!(mApp > 0) || !isFin(sApp) || !(fFlat >= 0 && fFlat < 1) || !Array.isArray(axis) || axis.length !== 3) throw new RangeError('libSourceOf: m > 0・s 有限・0 ≤ f < 1・軸 3 成分');
  return { key: 'book', m: mApp * U.M, Robs: 1, s: sApp / U.T, fFlat, fObs: 0.4, axis: axis.slice() };
}
/** lib の d(本の単位)—— p は源からの位置(本の単位) */
export function libFieldApp(src, { lambda, rdScale = 1, oblateQ = 1 / 3 }, p, U = DECL.units) {
  const e = RR.effectOfSpec(src, { ...DECL.candidate.spec, lambda, kScale: rdScale, oblateQ });
  const toSI = U.L, d = e.d([p[0] * toSI, p[1] * toSI, p[2] * toSI]), back = U.T / U.L;
  return { d: [d[0] * back, d[1] * back, d[2] * back], ReqApp: e.meta.Rd / U.L };
}
/** 照合の点(源の自転軸 k̂ と、それに直交する 2 つの向き —— 帯の内・外・赤道面の上・帯の端から離した点)。Req は本の単位 */
export function matchPoints(axis, Req) {
  const k = axis, a = Math.abs(k[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2], sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]], scl = (u, s) => [u[0] * s, u[1] * s, u[2] * s];
  const nrm = (u) => Math.sqrt(dot(u, u)), e1 = scl(sub(a, scl(k, dot(a, k))), 1 / nrm(sub(a, scl(k, dot(a, k))))), e2 = [k[1] * e1[2] - k[2] * e1[1], k[2] * e1[0] - k[0] * e1[2], k[0] * e1[1] - k[1] * e1[0]];
  const out = [];
  for (const rho of [74.658, 104.79, 136.775]) for (const phi of [0.3, 2.1, 4.4]) for (const t of [0, 0.05, -0.31, 0.62, -0.97, 0.999, 1.03, -1.6]) {
    if (Math.abs(Math.abs(t) - 1) < DECL.edgeGap) continue;
    const z = t * Req, c = Math.cos(phi), s = Math.sin(phi);
    const p = [rho * (c * e1[0] + s * e2[0]) + z * k[0], rho * (c * e1[1] + s * e2[1]) + z * k[1], rho * (c * e1[2] + s * e2[2]) + z * k[2]];
    out.push({ t, p, rho, zOverP: Math.abs(z) / Math.hypot(p[0], p[1], p[2]) });
  }
  return out;
}
/**
 * 点ごとの比べ(engine = (p) → d の関数・lib = libFieldApp の関数)。z = p·k̂ は |p| の大きさの成分の打ち消しなので、その丸め δz ≈ ε|p| が d に
 * λ|s| r δz/ρ の絶対の差を生む(条件数 |p|/|z| —— 2 つの式の演算の順の違いで出る差で、式の違いではない)。許す差 = tol·|d_lib| + 16 ε λ|s| r |p|/ρ。
 * 帯の外と赤道面の上は両方 0 か、片方が丸めの残り(同じ許す差の内)。式の差の検出力の物差しとして、z の丸めが小さい点(|z|/|p| ≥ 1e-3)の自分の大きさに対する相対差の最大も返す。
 */
export function compareField(engine, lib, pts, { lambda, s }, tol = DECL.matchTol) {
  const EPS = Math.pow(2, -52);
  let worst = 0, zeroBoth = 0, inBand = 0, condRows = 0, maxRelWell = 0; const bad = [];
  for (const q of pts) {
    const a = engine(q.p), b = lib(q.p), nb = Math.hypot(b[0], b[1], b[2]), na = Math.hypot(a[0], a[1], a[2]);
    const pm = Math.hypot(q.p[0], q.p[1], q.p[2]), rho = q.rho, allow = tol * nb + 16 * EPS * Math.abs(lambda * s) * pm * pm / rho;
    const diff = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    if (nb === 0 && na === 0) { zeroBoth++; continue; }
    if (Math.abs(q.t) >= 0.05 && Math.abs(q.t) < 1) inBand++;
    const w = diff / allow; if (w > worst) worst = w;
    if (!(diff <= allow)) bad.push({ t: q.t, diff, allow });
    if (Math.abs(q.t) >= 0.05 && Math.abs(q.t) < 1 && q.zOverP >= 1e-3) { condRows++; const rel = diff / nb; if (rel > maxRelWell) maxRelWell = rel; }
  }
  const wellOk = condRows === 0 || maxRelWell <= tol;
  return { n: pts.length, inBand, zeroBoth, worstOverAllow: worst <= 1 ? '≤ 1' : worst, wellConditionedRows: condRows, wellConditionedMaxRelBelowTol: wellOk, tol, bad: bad.slice(0, 5),
    ok: bad.length === 0 && inBand > 0 && wellOk };
}
/** 傾きの比の解析の目安(帯の内・小さい傾き —— sin i が exp(−(λ s r/ρ) t/2) で減る。r/ρ ≈ 1 の近似の目安で、判定は rateTol の幅) */
export const tiltRatioGuide = (lambda, s, t) => Math.exp(-lambda * s * t / 2);
/** 走行の判定(rows = 群ごとの {r0, rN}・on/off) */
export function runJudge(on, off, guide, jd = DECL.runJudge) {
  const rOn = on.map((g) => g.rN / g.r0), rOff = off.map((g) => g.rN / g.r0);
  const spread = (Math.max(...rOn) - Math.min(...rOn)) / Math.max(...rOn);
  return { ratioOn: rOn, ratioOff: rOff, guide, onNearGuide: rOn.every((x) => Math.abs(x / guide - 1) <= jd.rateTol), offNearOne: rOff.every((x) => Math.abs(x - 1) <= jd.offTol),
    spreadOk: spread <= jd.spreadTol, spread, ok: rOn.every((x) => Math.abs(x / guide - 1) <= jd.rateTol) && rOff.every((x) => Math.abs(x - 1) <= jd.offTol) && spread <= jd.spreadTol };
}

/* ───────── 自己試験(純関数)───────── */
export function selfTest() {
  const bad = [];
  const src = libSourceOf({ mApp: 56.834, sApp: 0.016528, fFlat: 0.09796, axis: [0, 1, 0] });
  const a = libFieldApp(src, { lambda: 0.0656, rdScale: 2e6 }, [100, 0, 3]), b = libFieldApp(src, { lambda: 0.0656, rdScale: 2e6 }, [100, 3, 0]);
  if (!(a.d[0] === 0 && a.d[1] === 0 && a.d[2] === 0)) bad.push('軸 +y で y = 0 の点(赤道面の上)の d が 0 でない');
  if (!(b.d[1] < 0)) bad.push('軸 +y・y > 0 の点で赤道面へ向かない(d_y ≥ 0)');
  const c = libFieldApp(src, { lambda: 0.0656, rdScale: 2e6 }, [100, 11, 0]);
  if (!(c.d[1] === 0)) bad.push('帯の外(|z| > R_eq ≈ 10.36)で 0 でない');
  if (!(Math.abs(b.ReqApp / (2e6 * 56.834 * 10 * 6.674 / (6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1) * 29979.2458 ** 2)) / Math.pow(1 - 0.09796, -1 / 3) - 1) < 1e-12)) bad.push('R_eq が Y_k m の扁平の則と違う');
  const lin = libFieldApp(src, { lambda: 0.1312, rdScale: 2e6 }, [100, 3, 0]);
  if (!(Math.abs(lin.d[1] / b.d[1] - 2) < 1e-12)) bad.push('λ に比例しない');
  const rj = runJudge([{ r0: 1, rN: 0.4 }, { r0: 2, rN: 0.8 }], [{ r0: 1, rN: 1.01 }, { r0: 2, rN: 1.98 }], 0.4);
  if (!rj.ok) bad.push('走行の判定の正例が通らない');
  if (runJudge([{ r0: 1, rN: 0.6 }], [{ r0: 1, rN: 1 }], 0.4).ok) bad.push('走行の判定の負例が通る');
  const rejects = [() => libSourceOf({ mApp: 0, sApp: 1, fFlat: 0, axis: [0, 0, 1] }), () => libSourceOf({ mApp: 1, sApp: 1, fFlat: 1, axis: [0, 0, 1] })];
  for (const f of rejects) { try { f(); bad.push('拒否しない入力'); } catch (e) { if (!(e instanceof RangeError)) bad.push('RangeError でない'); } }
  // 照合の検出力(変異): lib の d を 1e-9 だけずらした「エンジン」・帯の厚みを 1% 狭めた「エンジン」は照合を通らない
  { const ReqV = libFieldApp(src, { lambda: 0.0656, rdScale: 2e6 }, [100, 0, 0]).ReqApp, pts = matchPoints([0, 1, 0], ReqV), libF = (p) => libFieldApp(src, { lambda: 0.0656, rdScale: 2e6 }, p).d;
    if (!compareField(libF, libF, pts, { lambda: 0.0656, s: 0.016528 }).ok) bad.push('同じ式どうしの照合が通らない');
    if (compareField((p) => libF(p).map((x) => x * (1 + 1e-9)), libF, pts, { lambda: 0.0656, s: 0.016528 }).ok) bad.push('1e-9 のずれを見逃す');
    const src2 = libSourceOf({ mApp: 56.834 * 0.99, sApp: 0.016528, fFlat: 0.09796, axis: [0, 1, 0] });
    if (compareField((p) => libFieldApp(src2, { lambda: 0.0656, rdScale: 2e6 }, p).d, libF, pts, { lambda: 0.0656, s: 0.016528 }).ok) bad.push('帯の厚みの 1% の違いを見逃す'); }
  return { ok: bad.length === 0, bad, cases: 10 };
}
