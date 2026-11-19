// 第343便g(原仮定者の補足(2026-11-18 —— 第141報)「冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・原仮定者の指示(2026-11-11 —— 第135報)
//   「冥王星とカロンが、連星のヒントになると想定」・決断事項 AN807・AN822「同一解・同一元期の状態ベクトルをそろえてから残差と比べる」・統括の検証項目 R384):
//   **冥王星–カロンを、同じ解・同じ元期の状態(リポジトリに在る paper/data/pluto-system-states.csv —— PLU060/DE440・冥王星系の重心・ICRF/J2000 赤道・TDB)へ繋ぐ lib**
//   (診断だけ —— エンジン・内蔵の本・受理器・第341便g の lib の本文は変えない。第341便g の表の数は変えず、同じ解の入力に替えた列を並べる)。
//
// T1 csv を読む(第277便a の読取器 loadPlutoStates・stateOf を呼ぶ): 行・天体・元期・量・単位・解の名・record_id の一覧と、同じ元期どうしのカロン − 冥王星の相対の状態。
//    csv に GM の行は無い —— GM は宣言の入力(ノブ「GM の出どころ」): 主 = リポジトリの中の値(第277便a の GM_DECL の PLU060-2024 の和 975.4 km³/s² —— 解の名は同じだが csv の行ではない・丸め 0.1)/
//    比べる列 = csv の要素の行から逆に読んだ値(重心のまわりのカロンの要素の μ = n² a³ に (1 + q)³ を掛ける —— q は同じ元期の |r_冥王星| ÷ |r_カロン|。μ の読みは仮定)。
// T2 接触の軌道の要素(同じ中心〔冥王星〕・同じ重力定数): 相対の状態から a・e・傾き・昇交点・近点の引数・平均近点角・平均の運動・周期(ICRF 赤道)と、元期の間の差。
//    e は元期の値を並べ、桁の幅から来る e の幅を別の列に(桁の幅は 1σ ではない —— σ の判定に流さない)。軌道の法線の向きと元期の間の法線の動き(薄い角)。
//    csv の要素の行(重心のまわりのカロン)を同じ定義で作り直した差・要素から状態へ戻す往復の差。
// T3 自転の軸(この 6 成分からは得られない): 相互ロックなら自転の軸 ≈ 軌道の法線は**仮定**。リポジトリの中の冥王星の極(第337便j の LIT —— 文献の値・未照合)と軌道の法線のなす角。
// T4 第341便g の関数(相互の部位差分・座標変換の d・外の取り分・G_loc の型の残差)に、T2 の a・e・周期(元期ごと・GM ごと)を入れた列を、第341便g の入力の列と並べる。
//    対照の段 (2)(定義の差 —— a の分と GM の分)を同じ解の a と GM で作り直す(吸収しない —— 残る差を数で)。(3)(4) の入力の差と候補の型の項の大きさを同じ単位(÷ n)の 1 表に。
// T5 元期 A の状態を 2 体のケプラーで元期 B まで進めた位置と、表の元期 B の位置の差(小さい衛星・太陽の摂動・歳差を含む差 —— 内訳はこの入力からは分けられない)。
//
// **html を読まない**・ネットへ取りに行かない・乱数を使わない。薄い角は Math.atan2(|外積|, 内積)(第340便h の thinAngle)。3 値の判定は使わない(尺度の無い量を判定に入れない)。
// 言わないこと: 冥王星–カロンで型が確かめられた・残差が合った/合わない・引きずりが少ないと分かった・離心率が決まった。この解・この元期・この入力では、の表。桁の幅を σ と書かない。
// 入力の定義の差(+7.216805 s)を引きずりの係数・ノブに吸収しない(AN807)。
import { loadPlutoStates, stateOf, EPOCHS } from './lib-w277a-plutostates.mjs';
import * as P341 from './lib-w341g-plutocontrol.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';
import { LIT as LIT337J } from './lib-w337j-spinorbit.mjs';

export const LIB_VERSION = 'w343g-plutostate-lib-1';
const D2R = Math.PI / 180, DAY = 86400, YR = 365.25 * DAY, AU = 1.495978707e11, G = 6.6743e-11, MSUN = 1.98847e30;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const wrap = (x) => { const t = x % (2 * Math.PI); return t < 0 ? t + 2 * Math.PI : t; };
const wrapPi = (x) => { const t = wrap(x); return t > Math.PI ? t - 2 * Math.PI : t; };

/* ───────── 宣言(走行の前 —— 走らせたノブの格子と判定の物差しの記録)───────── */
export const DECL = Object.freeze({
  /** 入力(リポジトリの中 —— 新しく取りに行かない) */
  csv: 'paper/data/pluto-system-states.csv',
  /** ノブ「GM の出どころ」(km³/s²): 主 = リポジトリの中の値・比べる列 = csv の要素の行から逆に読んだ値 */
  gmKeys: Object.freeze(['repo', 'csvDerived']),
  gmRepo: 975.4, gmRepoParts: Object.freeze([869.3, 106.1]),
  gmRepoSrc: 'tests/exp-w277a-plutostates.mjs の GM_DECL の PLU060-2024(冥王星 869.3 + カロン 106.1 —— Brozović & Jacobson 2024 AJ 167, 256 Table 8)の和 —— 文献の値・未照合・解の名は csv と同じ PLU060 だが csv の行ではない(丸め 0.1)',
  gmDerivedSrc: 'csv の要素の行(重心のまわりのカロン —— a と平均の運動 n)から μ = n² a³・同じ元期の |r_冥王星| ÷ |r_カロン| = q から GM = μ (1 + q)³(重心のまわりの要素の μ が GM_系 ÷ (1 + q)³ という読みは仮定・小さい衛星の質量は q に入れていない)',
  /** ノブ「元期」 */
  epochs: Object.freeze(EPOCHS.slice()),
  /** 第341便g の比べる物差し(第341便g の DECL の写しを呼ぶ —— Buie の周期・定義の差・σ) */
  buieRef: '第341便g の DECL.pBuieS・DECL.defDiffS・DECL.sigmaS と LIT.plutoCharonGM(Buie 2012 の二体解の a 19573 km・含意の GM)',
  /** T4: 第341便g の関数へ入れるときの自転(相互ロックの仮定 —— 自転 = 公転の n) */
  spinAssume: '冥王星とカロンの自転 = 入れた周期の公転の角速度 n(相互ロックの仮定 —— この表からは自転は得られない)',
  /** 桁の幅: 印字の最後の桁の半分(sigma_kind=digits —— 1σ ではない) */
  digitHalf: 0.5,
  /** 数値の微分の刻み(相対 —— 桁の幅の e の幅を線形で読む) */
  diffStep: 1e-7,
  /** 判定の物差し: 往復の差・作り直しの差の上限(相対) */
  roundTripTol: 1e-12, remakeTol: 1e-9,
});

/* ───────── T1: csv を読む ───────── */
/** 印字の文字列から最後の桁の半分の幅(sigma_kind=digits) */
export function digitHalfWidth(str) {
  const s = String(str).trim().toLowerCase(), m = s.match(/^[-+]?(\d*)\.?(\d*)(?:e([-+]?\d+))?$/);
  if (!m) return null;
  const frac = m[2] || '', ex = m[3] ? Number(m[3]) : 0;
  return DECL.digitHalf * Math.pow(10, ex - frac.length);
}
/** 生の csv の行(印字の文字列を保つ —— 桁の幅のため)。fs を使わず文字列を受ける(器が読む) */
export function rawRows(text) {
  const lines = text.split('\n').filter((l) => l.length > 0), H = lines[0].split(',');
  const iq = H.indexOf('quantity'), ib = H.indexOf('body'), iv = H.indexOf('value'), ie = H.indexOf('epoch');
  return lines.slice(1).map((l) => { const c = l.split(','); return { body: c[ib], quantity: c[iq], valueStr: c[iv], epoch: c[ie] }; });
}
export function inventory(L) {
  const rows = L.rows || [], by = (k) => [...new Set(rows.map((r) => r[k]))];
  const qs = by('quantity'), units = by('unit'), eph = by('ephemeris'), eps = by('epoch');
  const stateRows = rows.filter((r) => /^state_/.test(r.quantity)), elemRows = rows.filter((r) => /_osculating$/.test(r.quantity));
  const gmRows = rows.filter((r) => /gm|mass/i.test(r.quantity));
  const perBody = {}; for (const r of stateRows) { perBody[r.body] = (perBody[r.body] || 0) + 1; }
  const elemBodies = [...new Set(elemRows.map((r) => r.body))];
  return { nRows: rows.length, nState: stateRows.length, nElem: elemRows.length, nOther: rows.length - stateRows.length - elemRows.length, bodies: by('body'), perBody,
    epochs: eps, epochsState: [...new Set(stateRows.map((r) => r.epoch))], quantities: qs, units, ephemeris: eph, elemBodies, elemCenter: [...new Set(elemRows.map((r) => r.center))],
    nRecordIds: new Set(rows.map((r) => r.record_id)).size, sigmaNonEmpty: rows.filter((r) => r.sigma !== null && r.sigma !== undefined && r.sigma !== '').length, gmRows: gmRows.length,
    sigmaKinds: [...new Set(rows.map((r) => ((r.note || '').match(/sigma_kind=(\w+)/) || [])[1] || 'none'))] };
}
/** 要素の行(重心のまわりのカロン)を元期ごとに: 最初の行を採る(第277便a の規則と同じ) */
export function elemRowsOf(L, epoch) {
  const g = (q) => { const h = (L.rows || []).find((r) => r.body === 'Charon' && r.epoch === epoch && r.quantity === q); return h ? h.value : null; };
  return { a: g('semi_major_axis_osculating'), e: g('eccentricity_osculating'), i: g('inclination_osculating'), node: g('longitude_of_ascending_node_osculating'),
    peri: g('argument_of_pericenter_osculating'), M: g('mean_anomaly_osculating'), nDegDay: g('mean_motion_osculating'), P: g('sidereal_period_osculating') };
}
export function relState(L, epoch) {
  const P = stateOf(L, 'Pluto', epoch), C = stateOf(L, 'Charon', epoch);
  return { P, C, r: sub(C.r, P.r), v: sub(C.v, P.v), qPos: nrm(P.r) / nrm(C.r), qVel: nrm(P.v) / nrm(C.v) };
}

/* ───────── T2: 要素(同じ中心・同じ重力定数)───────── */
/** 状態 → 接触の要素(km・km/s・GM km³/s² —— ICRF 赤道。傾きは atan2 で薄い所も桁を失わない) */
export function elementsOf(r, v, GM) {
  const R = nrm(r), V2 = dot(v, v), h = crs(r, v), H = nrm(h), rv = dot(r, v);
  const ev = scl(sub(scl(r, V2 - GM / R), scl(v, rv)), 1 / GM), e = nrm(ev);
  const a = 1 / (2 / R - V2 / GM), n = Math.sqrt(GM / (a * a * a)), P = 2 * Math.PI / n;
  const inc = Math.atan2(Math.hypot(h[0], h[1]), h[2]), node = wrap(Math.atan2(h[0], -h[1]));
  const nv = [Math.cos(node), Math.sin(node), 0], hh = scl(h, 1 / H), mv = crs(hh, nv);   // 昇交点の向き・軌道の面の中で 90° 先
  const peri = wrap(Math.atan2(dot(ev, mv), dot(ev, nv)));
  const nu = wrap(Math.atan2(dot(crs(ev, r), hh) / e, dot(ev, r) / e));
  const E = 2 * Math.atan2(Math.sqrt(1 - e) * Math.sin(nu / 2), Math.sqrt(1 + e) * Math.cos(nu / 2)), M = wrap(E - e * Math.sin(E));
  return { a, e, ev, inc, node, peri, nu, M, n, P, h: hh, lam: wrap(node + peri + M) };
}
/** 要素 → 状態 */
export function stateOfElements({ a, e, inc, node, peri, M }, GM) {
  const E = P341.eccAnom(wrap(M), e), cE = Math.cos(E), sE = Math.sin(E), n = Math.sqrt(GM / (a * a * a));
  const xp = a * (cE - e), yp = a * Math.sqrt(1 - e * e) * sE, vxp = -a * n * sE / (1 - e * cE), vyp = a * n * Math.sqrt(1 - e * e) * cE / (1 - e * cE);
  const cO = Math.cos(node), sO = Math.sin(node), cw = Math.cos(peri), sw = Math.sin(peri), ci = Math.cos(inc), si = Math.sin(inc);
  const P = [cO * cw - sO * sw * ci, sO * cw + cO * sw * ci, sw * si], Q = [-cO * sw - sO * cw * ci, -sO * sw + cO * cw * ci, cw * si];
  return { r: [P[0] * xp + Q[0] * yp, P[1] * xp + Q[1] * yp, P[2] * xp + Q[2] * yp], v: [P[0] * vxp + Q[0] * vyp, P[1] * vxp + Q[1] * vyp, P[2] * vxp + Q[2] * vyp] };
}
/** 桁の幅から来る e の幅(線形 —— Σ |∂e/∂x_k| × 幅_k。冥王星とカロンの 12 成分) */
export function eWidth(raw, epoch, L, GM) {
  const comp = ['state_x', 'state_y', 'state_z', 'state_vx', 'state_vy', 'state_vz'];
  const w = (body, q) => digitHalfWidth((raw.find((r) => r.body === body && r.epoch === epoch && r.quantity === q) || {}).valueStr);
  const base = relState(L, epoch), e0 = elementsOf(base.r, base.v, GM).e;
  let sum = 0, aW = 0, maxW = 0;
  for (const [body, sgn] of [['Charon', 1], ['Pluto', -1]]) comp.forEach((q, k) => {
    const wd = w(body, q); maxW = Math.max(maxW, wd / Math.abs(k < 3 ? base.r[k] : base.v[k - 3]));
    const r = base.r.slice(), v = base.v.slice(), x = k < 3 ? r : v, j = k % 3, hstep = Math.abs(x[j]) * DECL.diffStep;
    x[j] += sgn * hstep; const ep = elementsOf(r, v, GM); x[j] -= 2 * sgn * hstep; const em = elementsOf(r, v, GM);
    sum += Math.abs((ep.e - em.e) / (2 * hstep)) * wd; aW += Math.abs((ep.a - em.a) / (2 * hstep)) * wd;
  });
  return { e: e0, eWidth: sum, aWidthKm: aW, maxRelDigit: maxW };
}
/** GM の 2 つの値(元期ごと) */
export function gmOf(L, epoch) {
  const el = elemRowsOf(L, epoch), n = el.nDegDay * D2R / DAY, mu = n * n * el.a * el.a * el.a, rs = relState(L, epoch);
  return { repo: DECL.gmRepo, csvDerived: mu * Math.pow(1 + rs.qPos, 3), muBary: mu, qPos: rs.qPos, qVel: rs.qVel, csvDerivedVel: mu * Math.pow(1 + rs.qVel, 3), qRepo: DECL.gmRepoParts[1] / DECL.gmRepoParts[0] };
}
export function t2Table(L, raw) {
  const out = { epochs: [] };
  for (const ep of DECL.epochs) {
    const rs = relState(L, ep), gm = gmOf(L, ep), row = { epoch: ep, relR: rs.r, relV: rs.v, relRKm: nrm(rs.r), relVKms: nrm(rs.v), gm, byGM: {} };
    for (const k of DECL.gmKeys) {
      const E = elementsOf(rs.r, rs.v, gm[k]), back = stateOfElements(E, gm[k]), W = eWidth(raw, ep, L, gm[k]);
      row.byGM[k] = { GM: gm[k], aKm: E.a, e: E.e, incDeg: E.inc / D2R, nodeDeg: E.node / D2R, periDeg: E.peri / D2R, MDeg: E.M / D2R, lamDeg: E.lam / D2R, nDegDay: E.n / D2R * DAY, P: E.P, normal: E.h,
        eWidth: W.eWidth, aWidthKm: W.aWidthKm, maxRelDigit: W.maxRelDigit,
        roundTrip: { r: nrm(sub(back.r, rs.r)) / nrm(rs.r), v: nrm(sub(back.v, rs.v)) / nrm(rs.v) } };
    }
    // csv の要素の行(重心のまわりのカロン)を同じ定義で作り直す(μ = n² a³ —— csv の行から)
    const el = elemRowsOf(L, ep), Eb = elementsOf(rs.C.r, rs.C.v, gm.muBary);
    row.csvElem = el;
    row.remakeBary = { aRel: Eb.a / el.a - 1, eRel: Eb.e / el.e - 1, incDeg: Eb.inc / D2R - el.i, nodeDeg: Eb.node / D2R - el.node, periDeg: wrapPi((Eb.peri / D2R - el.peri) * D2R) / D2R,
      MDeg: wrapPi((Eb.M / D2R - el.M) * D2R) / D2R, PRel: Eb.P / el.P - 1 };
    // 相対の要素と重心の要素の関係(GM = csv から逆に読んだ値なら a_相対 = a_重心 × (1 + q)・e・角は同じ)
    const Ed = row.byGM.csvDerived;
    row.relVsBary = { aRatioMinus1PlusQ: Ed.aKm / el.a - (1 + gm.qPos), eRel: Ed.e / el.e - 1, incDeg: Ed.incDeg - el.i, nodeDeg: Ed.nodeDeg - el.node, PRel: Ed.P / el.P - 1 };
    out.epochs.push(row);
  }
  // 元期の間: 要素の差・法線の動き・平均の経度の進みから読む平均の運動(GM に依らない —— 回数は n の osculating から)
  const [A, B] = out.epochs, dt = (2457217.5 - 2452600.5) * DAY;
  out.between = { dtDay: dt / DAY, dtYr: dt / YR, byGM: {} };
  for (const k of DECL.gmKeys) {
    const a = A.byGM[k], b = B.byGM[k], dLam = wrap((b.lamDeg - a.lamDeg) * D2R), nA = a.nDegDay * D2R / DAY, N = Math.round((nA * dt - dLam) / (2 * Math.PI)), nBar = (dLam + 2 * Math.PI * N) / dt;
    out.between.byGM[k] = { dAKm: b.aKm - a.aKm, dE: b.e - a.e, dIncDeg: b.incDeg - a.incDeg, dNodeDeg: b.nodeDeg - a.nodeDeg, dPeriDeg: wrapPi((b.periDeg - a.periDeg) * D2R) / D2R, dP: b.P - a.P,
      normalMoveDeg: thinAngle(a.normal, b.normal) / D2R, nCycles: N, nBarDegDay: nBar / D2R * DAY, PBar: 2 * Math.PI / nBar, PBarMinusPA: 2 * Math.PI / nBar - a.P,
      periRateOverN: (wrapPi((b.periDeg - a.periDeg) * D2R)) / dt / nA, nodeRateOverN: ((b.nodeDeg - a.nodeDeg) * D2R) / dt / nA };
  }
  return out;
}

/* ───────── T3: 自転の軸(この表からは得られない)───────── */
export function t3Table(t2) {
  const pl = LIT337J.pluto, ra = pl.poleRA * D2R, de = pl.poleDec * D2R, pole = [Math.cos(de) * Math.cos(ra), Math.cos(de) * Math.sin(ra), Math.sin(de)];   // ICRF 赤道(csv と同じ枠)
  const rows = t2.epochs.map((r) => { const nv = r.byGM.repo.normal; return { epoch: r.epoch, normalRaDeg: wrap(Math.atan2(nv[1], nv[0])) / D2R, normalDecDeg: Math.asin(nv[2]) / D2R, poleVsNormalDeg: thinAngle(pole, nv) / D2R }; });
  return { inCsv: false, why: 'csv は状態 6 成分と軌道の要素だけ —— 自転の軸・潮汐の係数は入力に無い', poleRaDeg: pl.poleRA, poleDecDeg: pl.poleDec, poleSrc: pl.src,
    assume: '相互ロックなら自転の軸 ≈ 軌道の法線(仮定)', rows };
}

/* ───────── T4: 第341便g の関数へ同じ解の入力を入れる ───────── */
/** 第341便g の冥王星–カロンの系を、a [km]・e・P [s] で置き換える(自転 = 入れた周期の n —— 相互ロックの仮定)。null なら第341便g の入力のまま */
export function sysWith(inp) {
  const S = P341.systemsOf().find((x) => x.key === 'plutoCharon');
  if (inp === null) return S;
  const n = 2 * Math.PI / inp.P, host = Object.freeze(Object.assign({}, S.host, { spin: n })), comp = Object.freeze(Object.assign({}, S.comp, { spin: n }));
  return Object.freeze(Object.assign({}, S, { a: inp.aKm * 1e3, e: inp.e, P: inp.P, n, host, comp }));
}
/** 第341便g の ① の 4 量(相互の部位差分・座標変換の d・外の取り分・G_loc の型の残差)と、太陽の近日点の段の量 */
export function fourOf(S) {
  const mo = P341.mutualRow(S), sy = P341.syncRow(S), ex = P341.externalRow(S), gl = P341.glocRow(S);
  const el = P341.LIT.helio.pluto, Dq = el[0] * AU * (1 - el[1]);
  const S2 = Object.assign({}, S, { ext: Object.assign({}, S.ext, { D: Dq, vOrb: Math.sqrt(G * MSUN * (2 / Dq - 1 / (el[0] * AU))) }) }), exq = P341.externalRow(S2);
  return { aKm: S.a / 1e3, e: S.e, P: S.P, mutAxObs: mo.maxOmOverN, mutRotMismatch: mo.maxRotMismatchOverN, syncCirc: sy.circ, syncEcc: sy.ecc, fExt: ex.fSun + ex.fBg, fSun: ex.fSun, fBg: ex.fBg,
    dExt: ex.dSumOverNa, extAx: ex.extAxialOverN, gloc: gl.rateOverN, dExtPeri: exq.dSumOverNa, extAxPeri: exq.extAxialOverN, tidePeri: 2 * MSUN * Math.pow(S.a / Dq, 3) / (S.host.m + S.comp.m) };
}
export function t4Table(t2) {
  const cols = [{ key: 'w341g', ja: '第341便g の入力(a 19596 km・e 2e-4〔器の桁〕・周期 551854.08 s)', inp: null }];
  for (const r of t2.epochs) for (const k of DECL.gmKeys) { const b = r.byGM[k]; cols.push({ key: r.epoch.replace(/^JD (\d+)\.5 TDB$/, 'ep$1') + '_' + k, ja: r.epoch + '・GM ' + (k === 'repo' ? 'リポジトリの値' : 'csv から逆に読んだ値'), inp: { aKm: b.aKm, e: b.e, P: b.P } }); }
  const rows = cols.map((c) => Object.assign({ key: c.key, ja: c.ja }, fourOf(sysWith(c.inp))));
  // 第341便g の正本の同じ量(器が正本を読んで比べる —— lib は数だけ返す)
  // 対照の段 (2): 定義の差の内訳を同じ解の a と GM で作り直す(吸収しない)
  const G2 = P341.LIT.plutoCharonGM, pB = P341.DECL.pBuieS, per = (aKm, GMkm) => P341.periodOf(aKm * 1e3, GMkm * 1e9);
  const gB = G2.buie / 1e9, aB = G2.aBuie / 1e3;
  const split = [{ key: 'w341g', ja: '第341便g(PLU060 の 400 年平均の a 19595.764 km・GM 975.4)', aKm: G2.aPlu060Mean / 1e3, GM: G2.plu060 / 1e9 }]
    .concat(t2.epochs.flatMap((r) => DECL.gmKeys.map((k) => ({ key: r.epoch.replace(/^JD (\d+)\.5 TDB$/, 'ep$1') + '_' + k, ja: r.epoch + '・GM ' + (k === 'repo' ? 'リポジトリの値' : 'csv から逆に読んだ値'), aKm: r.byGM[k].aKm, GM: r.byGM[k].GM }))))
    .map((s) => ({ key: s.key, ja: s.ja, aKm: s.aKm, GM: s.GM, P: per(s.aKm, s.GM), total: per(s.aKm, s.GM) - pB, aPart: per(s.aKm, gB) - per(aB, gB), gmPart: per(s.aKm, s.GM) - per(s.aKm, gB), aGapKm: s.aKm - aB, gmGap: s.GM - gB }));
  return { rows, split, pBuie: pB, sigmaS: P341.DECL.sigmaS, defDiffS: P341.DECL.defDiffS };
}
/** (3)(4) と「そろえた後に残る差」を同じ単位(÷ n —— 周期の差は相対の差 ΔP/P と同じ大きさ)の 1 表に */
export function residualTable(t2, t4, w341cand) {
  const A = t2.epochs[0].byGM, B = t2.epochs[1].byGM, bw = t2.between.byGM.repo, pB = t4.pBuie, Pmean = P341.periodOf(P341.LIT.plutoCharonGM.aPlu060Mean, P341.LIT.plutoCharonGM.plu060);
  const rA = t4.rows.find((r) => r.key === 'ep2452600_repo');
  const rows = [
    { kind: '入力の差', ja: '定義の差(第341便g —— 400 年平均の a と GM 975.4 の周期 − Buie の周期)÷ P', v: Math.abs(t4.defDiffS) / pB },
    { kind: '入力の差', ja: 'Buie の周期の表の σ ÷ P(文献の 1σ —— 桁の幅ではない)', v: t4.sigmaS / pB },
    { kind: '入力の差', ja: 'GM の出どころの差(リポジトリの値 と csv から逆に読んだ値 —— 元期 A の周期)÷ P', v: Math.abs(A.repo.P - A.csvDerived.P) / A.repo.P },
    { kind: '入力の差', ja: '桁の幅から来る a の幅 × 1.5 ÷ a(元期 A・周期の相対の幅 —— 1σ ではない)', v: 1.5 * A.repo.aWidthKm / A.repo.aKm },
    { kind: 'そろえた後の差', ja: '接触の周期(元期 A・GM リポジトリの値)− Buie の周期 ÷ P', v: Math.abs(A.repo.P - pB) / pB },
    { kind: 'そろえた後の差', ja: '接触の周期(元期 B)− 接触の周期(元期 A)÷ P', v: Math.abs(B.repo.P - A.repo.P) / A.repo.P },
    { kind: 'そろえた後の差', ja: '400 年平均の要素の周期 − 接触の周期(元期 A)÷ P', v: Math.abs(Pmean - A.repo.P) / A.repo.P },
    { kind: 'そろえた後の差', ja: '平均の経度の進みから読む平均の周期(元期 A → B)− Buie の周期 ÷ P', v: Math.abs(bw.PBar - pB) / pB },
    { kind: 'そろえた後の差', ja: '近点の引数の元期の間の動き ÷ (n Δt)(e が 1.6e-4 の桁 —— 近点の向きは短い周期で揺れる)', v: Math.abs(bw.periRateOverN) },
    { kind: 'そろえた後の差', ja: '昇交点の経度の元期の間の動き ÷ (n Δt)', v: Math.abs(bw.nodeRateOverN) },
    { kind: '候補の型の項', ja: '(ii) 相互の部位差分(元期 A の e)÷ n', v: rA.mutAxObs },
    { kind: '候補の型の項', ja: '(i) 太陽の並進引きずりの 2 体の間の差(近日点)÷ n a', v: rA.dExtPeri },
    { kind: '候補の型の項', ja: '(iii) 太陽の部位差分(近日点)÷ n', v: rA.extAxPeri },
    { kind: '候補の型の項', ja: '(v) G_loc の型の残差の近点の率 ÷ n', v: rA.gloc },
    { kind: '候補の型の外(対照の物差し)', ja: '太陽の重力の潮汐 ÷ 相互の重力(近日点)', v: rA.tidePeri },
    { kind: '候補の型の外(対照の物差し)', ja: '太陽の重力の潮汐による交点の回りの率 ÷ n(第341便g の値)', v: (w341cand.find((c) => c.key === 'nodeRate') || {}).v },
    { kind: '候補の型の項', ja: '(4) 背景軸引きずりの取り分の差の分 ÷ n(第341便g の値)', v: (w341cand.find((c) => c.key === 'bgDiff') || {}).v },
  ];
  const ref = rows[0].v, sig = rows[1].v;
  return { rows: rows.map((r) => Object.assign(r, { overDef: r.v > ref, overSigma: r.v > sig })), note: '大きさの桁の比べ —— 周期の予言ではない・桁の幅を σ と読まない' };
}

/* ───────── T5: 2 体のケプラーで元期 A → B ───────── */
export function t5Table(L, t2) {
  const [A, B] = t2.epochs, dt = t2.between.dtDay * DAY, out = {};
  for (const k of DECL.gmKeys) {
    const GM = A.byGM[k].GM, E = elementsOf(A.relR, A.relV, GM), Ep = Object.assign({}, E, { M: wrap(E.M + E.n * dt) }), s = stateOfElements(Ep, GM);
    const d = sub(s.r, B.relR), rB = nrm(B.relR), hB = B.byGM[k].normal, along = crs(hB, scl(B.relR, 1 / rB));
    out[k] = { posDiffKm: nrm(d), radialKm: dot(d, scl(B.relR, 1 / rB)), alongKm: dot(d, along), normalKm: dot(d, hB), angleDeg: Math.atan2(nrm(crs(s.r, B.relR)), dot(s.r, B.relR)) / D2R, nOrbits: E.n * dt / (2 * Math.PI) };
  }
  return { byGM: out, note: '2 体のケプラー(歳差・小さい衛星・太陽の摂動は入れない)—— 差の内訳はこの入力からは分けられない(入力に無い量: 歳差・自転)' };
}

/* ───────── 純関数の場面(門)───────── */
export function pureScenes() {
  // ① 往復: 傾き 96° の楕円(e 1e-3)を要素 → 状態 → 要素で戻す
  const E0 = { a: 19600, e: 1e-3, inc: 96 * D2R, node: 223 * D2R, peri: 150 * D2R, M: 2 }, s0 = stateOfElements(E0, 975.4), E1 = elementsOf(s0.r, s0.v, 975.4);
  const rt = Math.max(Math.abs(E1.a / E0.a - 1), Math.abs(E1.e - E0.e) / E0.e, Math.abs(E1.inc - E0.inc), Math.abs(wrapPi(E1.node - E0.node)), Math.abs(wrapPi(E1.peri - E0.peri)), Math.abs(wrapPi(E1.M - E0.M)));
  // ② 円(e = 0)で e が丸めの桁
  const sc = stateOfElements({ a: 19600, e: 0, inc: 1, node: 2, peri: 0, M: 1 }, 975.4), ec = elementsOf(sc.r, sc.v, 975.4).e;
  // ③ 半周の伝播: M を π 進めると位置が反対(円)
  const E2 = elementsOf(sc.r, sc.v, 975.4), sh = stateOfElements(Object.assign({}, E2, { M: E2.M + Math.PI }), 975.4), opp = nrm([sh.r[0] + sc.r[0], sh.r[1] + sc.r[1], sh.r[2] + sc.r[2]]) / 19600;
  // ④ 桁の幅: 1.370860133507983e+03 → 5e-13・-8.639354888307112e-03 → 5e-19
  const dw = [digitHalfWidth('1.370860133507983e+03'), digitHalfWidth('-8.639354888307112e-03'), digitHalfWidth('17464.1723744826')];
  // ⑤ 第341便g の入力を入れると第341便g の関数の値そのまま(sysWith(null) は systemsOf の冥王星–カロン —— 2 回の呼び出しを相対 1e-9 で比べる)
  const Sx = sysWith(null), Sy = P341.systemsOf().find((x) => x.key === 'plutoCharon'), fx = fourOf(Sx), fy = fourOf(Sy), same = Sx.key === Sy.key && Sx.a === Sy.a && Sx.e === Sy.e && Sx.P === Sy.P && Object.keys(fx).every((k) => fx[k] === fy[k] || Math.abs(fx[k] - fy[k]) <= 1e-9 * Math.abs(fy[k]));
  // ⑥ 入力の拒否(GM ≤ 0 は a が負か非有限)
  let rej = 0; const tries = [() => { const q = elementsOf([1, 0, 0], [0, 1, 0], 0); if (!Number.isFinite(q.a) || !Number.isFinite(q.e)) throw new RangeError('GM'); }, () => { if (digitHalfWidth('abc') === null) throw new RangeError('str'); }];
  for (const t of tries) { try { t(); } catch (e) { rej++; } }
  return { roundTrip: rt, circE: ec, halfOpp: opp, digit: dw, same341g: same, reject: { n: rej, of: tries.length } };
}
export function pureGates(P) {
  return { roundTrip: P.roundTrip <= 1e-10, circE: P.circE <= 1e-13, halfOpp: P.halfOpp <= 1e-12,
    digit: Math.abs(P.digit[0] / 5e-13 - 1) <= 1e-12 && Math.abs(P.digit[1] / 5e-19 - 1) <= 1e-12 && Math.abs(P.digit[2] / 5e-11 - 1) <= 1e-12, same341g: P.same341g === true, reject: P.reject.n === P.reject.of };
}
export { loadPlutoStates };
