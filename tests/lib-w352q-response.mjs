// 第352便q(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R454):
//   **応答の係数と天体の構造 —— 背景を 1 つ(全部の天体に同じ)と置いたとき、比べる数(仮の値〔第352便b〕とリポジトリに在る文献の値)に届くのに要る「応答の係数」を天体ごとに出し、
//   天体の構造の量(自転の率・公転の率・半径・平均の密度・慣性モーメントの係数・扁平 J2・規則の半径 ÷ 観測半径)の式の候補 (ア)〜(エ) と、べきの組の走査で並べる純関数 ——
//   並びの診断だけ(当てはめではない・ノブの値を決めない)**
//   (器 tests/exp-w352q-response.mjs と QA behavior.response352q・docs.response352q が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib と第 1・第 2 ラウンドの lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot・srcRadius・recvRadius —— (S) と源の半径・受け手の半径)・第352便j(cellOf・provCompare・provRefs —— 照合の相手)・第352便d(bgVec・uVenus・poleRates・precDs)・
//   第352便c(refAxis)・第352便b(prov・toRH・tagProv・ratioOf —— 仮の値は「仮・未照合」の印つきの表だけ)・第351便k(partRotQ・singularValues・rankOf)・第351便d(r3Coeffs)・
//   第351便c(pairInput)・第350便f(precObs・ruleRatio —— リポジトリの文献の値と規則の半径の比)・第348便c(massOf・radiusOf)・第347便e(t1Table・geometry)・第330便a(DECL.lit —— 慣性モーメントの係数・J2)。
//
// ■ 語: 単位の応答の率 = 背景 + 局所(太陽由来の (S)・k 1・(C2))の合成の大きさ abs(Ω)(応答の係数 1・比 ω_T ÷ ω_L 1・k₂ 1 で、歳差の率がこの大きさになる)。
//   要る応答の係数 C = 比べる数の率 ÷ 単位の応答の率(″/年 ÷ ″/年)。地球(仮の値の ψ_A の率)を 1 にした比 C ÷ C_地球 で天体を並べる。(g2±) は回る向きの符号だけ(大きさは同じ)。
//   式の候補(天体の構造から作る「応答の物差し」X —— 比 C ÷ X が天体どうしでそろうかを見る):
//   (ア) 第350便c の (S1) の比 ω_T ÷ ω_L(ω_T = ω_I + ŝ·Ω・ω_L = ω_I + ω_D —— 同じ式で 1)と (S2) の閉じた形 √(ω² + abs(Ω⊥)²) ÷ ω(1 からの外れを直接に数える)
//   (イ) 自転の率の逆数 1 ÷ ω(遅い自転ほど軸が動きやすい)/(ウ) 公転の率の 2 乗 ÷ 自転の率 n² ÷ ω(潮汐の型の物差し —— 比べる列)/
//   (エ) 構造の係数 c_R の入り方 2 つ(第350便f・第351便k の語): (ii) 受け手の半径(自分の重みの球と平均の球)を観測半径に/(i) 平均の球の半径だけを観測半径に ——
//   局所の (S) が規則の半径のときの何倍になるか(背景には掛からない —— 局所の応答の倍)
// ■ 言わないこと: 応答の係数・構造の式・べきの値を選ばない(並びの診断)。仮の値との並べは「仮・未照合」の印つきで合否にしない。リポジトリの文献の値も合わせない(固定の比べる列)。
import * as K from './lib-w352k-spinform.mjs';
import * as J from './lib-w352j-maintable.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as KR from './lib-w351k-knobrank.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as SF from './lib-w350f-structfit.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w352q-response-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
export const ASYR = D.ASYR;
const D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 比べる数の天体(仮の値 —— 地球・火星・金星)とリポジトリの文献の値だけの天体(水星 —— 役割「桁」・月 —— 軌道の交点の率で外す列が主) */
  provBodies: Object.freeze(['Earth', 'Mars', 'Venus']),
  repoBodies: Object.freeze(['Mercury', 'Moon']),
  /** 仮の値の鍵(この lib が読む物だけ) */
  provKeys: Object.freeze({ Earth: 'earth.psiA.rate', Mars: 'mars.prec.rate', Venus: 'venus.prec.rate' }),
  /** 単位の応答の率の列: 背景の向き × 基準軸 × 源の半径(0 規則・1 観測)× 背景の大きさ(u1 倍率 1・uV 金星で (S) と大きさが同じ —— 源の半径ごと) */
  bgs: Object.freeze(['Np', 'Gm']), axes: Object.freeze(['L', 'eq']), tSrcs: Object.freeze([0, 1]), uCols: Object.freeze(['u1', 'uV']),
  bgLabels: Object.freeze({ Np: '(N+)', Gm: '(G−)' }), tLabels: Object.freeze({ 0: '規則の半径', 1: '観測の半径' }), uLabels: Object.freeze({ u1: '倍率 1', uV: '(uV)' }),
  /** 共通の背景の大きさを変えても比が変わらないことを見る倍率 */
  uInv: Object.freeze([1, 10, 1000]),
  /** 構造の量(公開の lib に在る数だけ —— 無い量は null)。走査に使う量(c_R は M ÷ R の関数・M は ρ R³ —— 走査の量から外す) */
  quantities: Object.freeze(['omega', 'n', 'R', 'rho', 'M', 'moi', 'J2', 'cR']),
  scanQ: Object.freeze(['omega', 'n', 'R', 'rho', 'moi', 'J2']),
  /** べきの格子(整数と半整数だけ・0 を除く)・量は 3 つまで */
  scanPows: Object.freeze([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]), scanMaxQ: 3,
  /** そろう度合いの物差し(最大 ÷ 最小)—— 表の数え上げの閾 */
  spreadMarks: Object.freeze([1.05, 1.2, 2]),
  /** 式の候補 */
  cands: Object.freeze(['a1', 'a2', 'i', 'u', 'eii', 'ei']),
  candLabels: Object.freeze({ a1: '(ア) (S1) ω_T ÷ ω_L', a2: '(ア) (S2) √(ω² + abs(Ω⊥)²) ÷ ω', i: '(イ) 1 ÷ ω', u: '(ウ) n² ÷ ω', eii: '(エ) c_R の入り方 (ii)', ei: '(エ) c_R の入り方 (i)' }),
  /** 金星の (N+)・(uV) の行(合成が背景の 1% の桁まで打ち消す —— 要る係数が桁で大きくなる)の印の閾: abs(Ω) ÷ abs(背景) */
  cancelMark: 0.05,
  /** 階数の表: 経路の比率の置き方・f の点・対数の刻み */
  rankNorm: 'N1', rankF: 0.5, lnStep: 1e-3, rankTol: Object.freeze([1e-3, 1e-6]),
  /** 統括の数え直し(第352便j —— 背景が主の大きさで、仮の値の率に届く要る倍の比)と、金星で大きさが同じになる倍率 */
  anchor: Object.freeze({ marsOverEarth: 0.1509, venusOverEarth: 0.8848, spread: 6.625, uV: 1.19282e-12, npLVenusUV: 41.6951, gmVenusUV: 0.7368 }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const LITKEY = Object.freeze({ Sun: 'sun', Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Moon: 'moon', Mars: 'mars', Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune' });
const SRCOF = Object.freeze({ Moon: 'EarthHi' });
const keyOf = (id) => id + '|' + (SRCOF[id] || 'Sun');

/* ───────── 比べる数 ───────── */
/** 天体の比べる数(大きさ ″/年)と出どころ。仮の値の天体はリポジトリの値も並べる(repo)。印つきは仮の値の行だけ */
export function refRate(id) {
  const repo = SF.precObs(id);
  if (DECL.provBodies.includes(id)) {
    const key = DECL.provKeys[id], v = id === 'Venus' ? Math.abs(B.prov(key).value) : Math.abs(B.toRH(key));
    return { id, rate: v, kind: 'prov', provKey: key, repo: repo ? repo.asYr : null, repoRole: repo ? repo.role : null };
  }
  if (DECL.repoBodies.includes(id)) { if (!repo) throw new RangeError('refRate: 比べる数が無い ' + id); return { id, rate: repo.asYr, kind: 'repo', provKey: null, repo: repo.asYr, repoRole: repo.role }; }
  throw new RangeError('refRate: 比べる数の天体は ' + DECL.provBodies.concat(DECL.repoBodies).join('・'));
}

/* ───────── 単位の応答の率 ───────── */
/** 背景の大きさの倍率(u1 = 1・uV = 金星で (S)〔源の半径 tSrc〕と背景の大きさが同じ) */
export function uOfCol(T1, GEO, uCol, tSrc, cache = null) {
  if (uCol === 'u1') return 1;
  if (uCol !== 'uV') throw new RangeError('uOfCol: u1・uV');
  const ck = 'uV|' + tSrc;
  if (cache && cache[ck] !== undefined) return cache[ck];
  const v = nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc }).Om) / nrm(D.bgVec('Gm', { u: 1 }));
  if (cache) cache[ck] = v;
  return v;
}
/** 局所の (S)(太陽由来 —— 月は太陽由来 + 地球由来〔第352便j の localRow〕—— 月の観測の半径の列は持たない → null) */
export function localS(T1, GEO, id, tSrc, cache = null) {
  const ck = 'locS|' + id + '|' + tSrc;
  if (cache && cache[ck] !== undefined) return cache[ck];
  let v;
  if (id === 'Moon') v = tSrc === 0 ? J.localSum(J.localRow(T1, GEO, keyOf(id), {}, cache), 'S') : null;
  else v = K.spinRot(T1, GEO, id, 'Sun', { part: 'S', tSrc }).Om;
  if (cache) cache[ck] = v;
  return v;
}
/**
 * 単位の応答の率: Ω = 背景(bg・axis・u)+ 局所の (S)(源の半径 tSrc)。返す: omAsYr・bgAsYr・locAsYr・合成 ÷ 背景・ŝ・n̂・経路 ② の方位の率(公転の北極・黄道の極 —— (g2+)・k₂ 1・rad/s)。
 * 局所が無い列(月の観測の半径)は null。
 */
export function unitRate(T1, GEO, id, { bg, axis, tSrc, u }, cache = null) {
  if (!DECL.bgs.includes(bg) || !DECL.axes.includes(axis) || !DECL.tSrcs.includes(tSrc) || !(fin(u) && u >= 0)) throw new RangeError('unitRate: 背景の向き Np・Gm・基準軸 L・eq・源の半径 0・1・u ≥ 0');
  const loc = localS(T1, GEO, id, tSrc, cache);
  if (loc === null) return null;
  const P = SP.pairInput(T1, GEO, id, SRCOF[id] || 'Sun'), s = unit(P.sHat), n = unit(P.nHat);
  const b = D.bgVec(bg, { u, axis: CR.refAxis(axis, T1, GEO) }), Om = add(b, loc), om = nrm(Om);
  const ds = D.precDs(s, Om, { sense: 'g2p' }), az = {};
  for (const [p, v] of [['orb', n], ['ecl', [0, 0, 1]]]) { const r = D.poleRates(v, s, ds); az[p] = r === null ? null : r.az; }
  return { id, bg, axis, tSrc, u, Om, omAsYr: om * ASYR, bgAsYr: nrm(b) * ASYR, locAsYr: nrm(loc) * ASYR, overBg: nrm(b) > 0 ? om / nrm(b) : null, sHat: s, nHat: n, az,
    perpAsYr: nrm(sub(Om, scl(s, dot(Om, s)))) * ASYR };
}
/** 要る応答の係数(1 天体・1 列): C = 比べる数 ÷ 単位の応答の率。極の方位の率で測る列(地球 = 黄道の極・火星 = 公転の北極)も。印は仮の値の行だけ */
export function needOf(T1, GEO, id, col, cache = null) {
  const R = refRate(id), U = unitRate(T1, GEO, id, col, cache);
  const pole = id === 'Earth' ? 'ecl' : id === 'Mars' ? 'orb' : null;
  const azAs = U && pole && U.az[pole] !== null ? U.az[pole] * ASYR : null;
  const row = { id, ...col, rate: R.rate, kind: R.kind, repo: R.repo, repoRole: R.repoRole, omAsYr: U ? U.omAsYr : null, overBg: U ? U.overBg : null,
    need: U && U.omAsYr > 0 ? R.rate / U.omAsYr : null, needPole: azAs ? R.rate / Math.abs(azAs) : null, cancel: U ? U.overBg < DECL.cancelMark : null };
  return R.kind === 'prov' ? B.tagProv(row, [R.provKey]) : row;
}

/* ───────── 構造の量 ───────── */
/** 構造の量(公開の lib に在る数だけ): ω(T1 の m2 の行 —— 太陽は源の自転)・n(公転の率 —— 太陽は銀河の公転の角速度)・R・M・ρ・慣性モーメントの係数・J2・c_R = 規則の半径 ÷ 観測半径 */
export function structOf(T1, GEO, id) {
  const lk = LITKEY[id], lit = W330.DECL.lit, M = C.massOf(id), R = C.radiusOf(id);
  let omega, n;
  if (id === 'Sun') { const P = SP.pairInput(T1, GEO, 'Earth', 'Sun'); omega = P.ws; n = B.repoRef('repo.galaxy.omega'); }
  else { const P = SP.pairInput(T1, GEO, id, SRCOF[id] || 'Sun'), r2 = T1.find((r) => r.id === id && r.src === (SRCOF[id] || 'Sun') && r.mag === 'm2'); omega = Math.abs(r2.omega); n = P.vOrb / P.a; }
  const pick = (o) => (o && lk in o && fin(o[lk]) ? o[lk] : null);
  return { id, omega, n, R, M, rho: M / (4 / 3 * Math.PI * R * R * R), moi: pick(lit.moi), J2: pick(lit.J2), cR: SF.ruleRatio(id) };
}
/** (エ) c_R の入り方 2 つ: 局所の (S) の大きさが、規則の半径のときの何倍か((ii) 受け手の半径 = 観測半径〔第352便k の spinRot の cR 1〕・(i) 平均の球の半径だけ観測半径〔第351便k の partRotQ〕)。月・太陽は null */
export function cREntry(T1, GEO, id, cache = null) {
  const ck = 'cRE|' + id;
  if (cache && cache[ck] !== undefined) return cache[ck];
  let v = { ii: null, i: null };
  if (id !== 'Moon' && id !== 'Sun') {
    const s0 = nrm(K.spinRot(T1, GEO, id, 'Sun', { part: 'S' }).Om), Rr = K.recvRadius(id), Ro = C.radiusOf(id);
    v = { ii: nrm(K.spinRot(T1, GEO, id, 'Sun', { part: 'S', cR: 1 }).Om) / s0, i: nrm(KR.partRotQ(T1, GEO, id, 'Sun', { part: 'S', Rd: Rr, a: Ro })) / s0 };
  }
  if (cache) cache[ck] = v;
  return v;
}
/** (ア) の 1 からの外れ: (S1) は同じ式で 0・(S2) は √(1 + x²) − 1 = x² ÷ (√(1 + x²) + 1)(x = abs(Ω⊥) ÷ ω —— 差で作らず直接に) */
export function s2Excess(perpRadS, omega) { const x = perpRadS / omega; return (x * x) / (Math.sqrt(1 + x * x) + 1); }
/** 式の候補の物差し X(天体 1 つ・列 1 つ —— 無い量は null) */
export function candOf(T1, GEO, id, col, cache = null) {
  const S = structOf(T1, GEO, id), U = id === 'Sun' ? null : unitRate(T1, GEO, id, col, cache), e = cREntry(T1, GEO, id, cache);
  const perp = U ? U.perpAsYr / ASYR : null;
  return { a1: 1, a2: perp === null ? null : 1 + s2Excess(perp, S.omega), a2Excess: perp === null ? null : s2Excess(perp, S.omega), i: 1 / S.omega, u: S.n * S.n / S.omega, eii: e.ii, ei: e.i };
}

/* ───────── 並べ ───────── */
/** そろう度合い(最大 ÷ 最小 —— 正の有限の値が 2 つ以上のときだけ) */
export function spreadOf(xs) { const v = xs.filter((x) => fin(x) && x > 0); return v.length < 2 ? null : Math.max(...v) / Math.min(...v); }
/** 比 C ÷ X を地球で 1 にした列と、そろう度合い */
export function alignRow(needs, xs, ids) {
  const e = ids.indexOf('Earth'), r = ids.map((_, k) => (fin(needs[k]) && fin(xs[k]) && xs[k] > 0 ? needs[k] / xs[k] : null));
  const r0 = e >= 0 ? r[e] : null;
  return { ratio: r.map((x) => (x === null || !r0 ? null : x / r0)), spread: spreadOf(r) };
}
/** べきの組の走査: 量の組 qs(1〜3)× べき(整数と半整数)で、C ÷ Π X^p のそろう度合い。最良の上位 top と、閾ごとの組の数 */
export function powerScan(needs, structs, { qs = DECL.scanQ, pows = DECL.scanPows, maxQ = DECL.scanMaxQ, top = 8 } = {}) {
  const n = needs.length, L = needs.map((x) => Math.log(x)), lq = Object.fromEntries(qs.map((q) => [q, structs.map((s) => (fin(s[q]) && s[q] > 0 ? Math.log(s[q]) : null))]));
  const usable = qs.filter((q) => lq[q].every((v) => v !== null));
  const res = [], counts = { total: 0 }, marks = DECL.spreadMarks;
  for (const m of marks) counts['le' + m] = 0;
  const combos = [];
  const rec = (start, pick) => { if (pick.length) combos.push(pick.slice()); if (pick.length === maxQ) return; for (let i = start; i < usable.length; i++) { pick.push(usable[i]); rec(i + 1, pick); pick.pop(); } };
  rec(0, []);
  for (const cq of combos) {
    const idx = new Array(cq.length).fill(0);
    for (;;) {
      const p = idx.map((i) => pows[i]);
      let lo = Infinity, hi = -Infinity;
      for (let k = 0; k < n; k++) { let v = L[k]; for (let j = 0; j < cq.length; j++) v -= p[j] * lq[cq[j]][k]; if (v < lo) lo = v; if (v > hi) hi = v; }
      const sp = Math.exp(hi - lo); counts.total++;
      for (const mk of marks) if (sp <= mk) counts['le' + mk]++;
      res.push({ qs: cq.slice(), pows: p, spread: sp });
      let j = idx.length - 1; while (j >= 0 && ++idx[j] === pows.length) { idx[j] = 0; j--; } if (j < 0) break;
    }
  }
  res.sort((a, b) => a.spread - b.spread || a.qs.length - b.qs.length || a.qs.join().localeCompare(b.qs.join()) || a.pows.join().localeCompare(b.pows.join()));
  const best1 = {};
  for (const r of res) { const k = r.qs.length; if (!best1[k]) best1[k] = r; }
  return { n, usable, counts, top: res.slice(0, top), bestBySize: best1 };
}

/* ───────── 階数(背景を共通に置いたとき)───────── */
/**
 * 観測量(天体ごとに 歳差の率・傾きの率〔起こす率〕)をノブ(背景の倍率 u〔共通〕・天体ごとの応答の係数 C_b・経路の比率 f〔共通/天体ごと〕)で微分した対数の感度の行列の階数。
 * 歳差の率 = C k₂ abs(Ω)・傾きの率 = C × 起こす率(経路 ① の dŝ/dt = k₁ Ω⊥ —— 第351便c の raiseRate)。金星は歳差の率だけ(傾きの率の比べる数が無い)。
 */
export function rankCase(T1, GEO, { bodies, fMode, col }, cache = null) {
  const h = DECL.lnStep, eh = Math.exp(h), withTilt = (id) => id !== 'Venus';
  const knobs = ['u', ...bodies.map((b) => 'C:' + b), ...(fMode === 'shared' ? ['f'] : bodies.map((b) => 'f:' + b))];
  const obsAt = (vals) => {
    const out = [];
    for (const id of bodies) {
      const U = unitRate(T1, GEO, id, { ...col, u: vals.u }, cache), f = fMode === 'shared' ? vals.f : vals['f:' + id], c = R3.r3Coeffs(f, DECL.rankNorm), Cb = vals['C:' + id];
      out.push(Math.log(Cb * c.kPrec * U.omAsYr));
      if (withTilt(id)) { const s = U.sHat, perp = sub(U.Om, scl(s, dot(U.Om, s))), ra = SP.raiseRate(s, U.nHat, scl(perp, c.kTilt)); out.push(Math.log(Math.abs(Cb * ra * ASYR))); }
    }
    return out;
  };
  const base = { u: col.u }; for (const b of bodies) { base['C:' + b] = 1; base['f:' + b] = DECL.rankF; } base.f = DECL.rankF;
  const cols = knobs.map((kn) => { const up = { ...base, [kn]: base[kn] * eh }, dn = { ...base, [kn]: base[kn] / eh }, a = obsAt(up), b = obsAt(dn); return a.map((x, i) => { const v = (x - b[i]) / (2 * h); return Math.abs(v) < 1e-9 ? 0 : v; }); });
  const M = cols[0].map((_, i) => cols.map((c) => c[i]));
  const sv0 = KR.singularValues(M), sv = sv0.map((x) => (x < 1e-7 * sv0[0] ? 0 : x));
  return { bodies, fMode, col: { bg: col.bg, axis: col.axis, tSrc: col.tSrc, uCol: col.uCol }, nObs: M.length, nKnobs: knobs.length, knobs, rank: DECL.rankTol.map((t) => KR.rankOf(sv, t)), undetermined: DECL.rankTol.map((t) => knobs.length - KR.rankOf(sv, t)), svRel: sv.map((s) => s / sv[0]) };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = DECL.anchor;
  // ① 規則の半径の局所の (S) と背景は第352便j の cellOf と同じ Ω(8 惑星 + 月 × 背景 2 × 基準軸 2 × 倍率 2)
  let vsJ = 0;
  for (const id of ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Moon']) for (const bg of DECL.bgs) for (const axis of DECL.axes) for (const u of [1, D.uVenus(T1, GEO, { part: 'S' }, cache)]) {
    const a = unitRate(T1, GEO, id, { bg, axis, tSrc: 0, u }, cache), c = J.cellOf(T1, GEO, keyOf(id), { bg, axis, sense: 'g2p', u, part: 'S' }, cache);
    vsJ = Math.max(vsJ, nrm(sub(a.Om, c.Om)) / nrm(c.Om));
  }
  // ② 第352便j の要る倍の比(倍率 1・(N+) L —— 火星 0.1509・金星 0.8848・散らばり 6.625)と、(uV) の比(金星 (N+) L 41.6951・(G−) 0.7368)—— 同じ数
  const refs = J.provRefs(), jr = {};
  for (const [bg, uv] of [['Np', 1], ['Np', D.uVenus(T1, GEO, { part: 'S' }, cache)], ['Gm', D.uVenus(T1, GEO, { part: 'S' }, cache)]]) {
    const nd = DECL.provBodies.map((id) => J.provCompare(J.cellOf(T1, GEO, keyOf(id), { bg, axis: 'L', sense: 'g2m', u: uv, part: 'S' }, cache), id, refs).needOm);
    const mine = DECL.provBodies.map((id) => needOf(T1, GEO, id, { bg, axis: 'L', tSrc: 0, u: uv }, cache).need);
    jr[bg + (uv === 1 ? '1' : 'V')] = { m: nd[1] / nd[0], v: nd[2] / nd[0], spread: J.spreadOf(nd), diff: Math.max(...mine.map((x, k) => Math.abs(x / nd[k] - 1))) };
  }
  // ③ 共通の背景の大きさを変えても比は変わらない(規則の半径・背景が主 —— 倍率 1・10・1000)
  let inv = 0;
  for (const bg of DECL.bgs) {
    const r = DECL.uInv.map((u) => { const nd = DECL.provBodies.map((id) => needOf(T1, GEO, id, { bg, axis: 'L', tSrc: 0, u }, cache).need); return [nd[1] / nd[0], nd[2] / nd[0]]; });
    for (const x of r) inv = Math.max(inv, Math.abs(x[0] / r[0][0] - 1), Math.abs(x[1] / r[0][1] - 1));
  }
  // ④ 金星で大きさが同じになる倍率(規則の半径)は第352便d の uVenus と同じ・観測の半径の倍率は (S) の大きさ ÷ 背景の大きさ
  const uVr = uOfCol(T1, GEO, 'uV', 0, cache), uVo = uOfCol(T1, GEO, 'uV', 1, cache);
  const uvErr = Math.abs(uVr / D.uVenus(T1, GEO, { part: 'S' }, cache) - 1);
  const uvObsErr = Math.abs(uVo * nrm(D.bgVec('Gm', { u: 1 })) / nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc: 1 }).Om) - 1);
  // ⑤ (ア) (S1) は 1・(S2) の外れは x² ÷ 2 の桁(地球・(N+) L・倍率 1)
  const eU = unitRate(T1, GEO, 'Earth', { bg: 'Np', axis: 'L', tSrc: 0, u: 1 }, cache), sE = structOf(T1, GEO, 'Earth'), x = eU.perpAsYr / ASYR / sE.omega;
  const a2 = s2Excess(eU.perpAsYr / ASYR, sE.omega), a2Ok = Math.abs(a2 / (x * x / 2) - 1) < 1e-9 && a2 > 0;
  // ⑥ 構造の量: 公開の lib の数(質量・半径・慣性モーメントの係数・J2)と同じ・無い量は null(月の J2・太陽の J2)
  const sM = structOf(T1, GEO, 'Moon'), sS = structOf(T1, GEO, 'Sun');
  const structOk = sE.M === C.massOf('Earth') && sE.R === C.radiusOf('Earth') && sE.moi === W330.DECL.lit.moi.earth && sE.J2 === W330.DECL.lit.J2.earth && sM.J2 === null && sS.J2 === null && sS.moi === W330.DECL.lit.moi.sun
    && Math.abs(sE.cR / (G3.YK * C.massOf('Earth') / C.radiusOf('Earth')) - 1) < 1e-15 && sS.n === B.repoRef('repo.galaxy.omega');
  // ⑦ (エ) の入り方: (ii) は spinRot の cR 1 と同じ・(i) は partRotQ の規則の半径(a = Rd)で 1
  const eE = cREntry(T1, GEO, 'Earth', cache), iOne = nrm(KR.partRotQ(T1, GEO, 'Earth', 'Sun', { part: 'S', Rd: K.recvRadius('Earth') })) / nrm(K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S' }).Om);
  const entryOk = fin(eE.ii) && eE.ii > 0 && fin(eE.i) && eE.i > 0 && Math.abs(iOne - 1) < 1e-12;
  // ⑧ 走査の自己試験: 作った needs = Π X^p なら、その組で散らばり 1(床)
  const sts = DECL.provBodies.map((id) => structOf(T1, GEO, id)), synth = sts.map((s) => 3 * Math.pow(s.omega, -1) * Math.pow(s.n, 2));
  const ps = powerScan(synth, sts, { top: 1 }), scanOk = ps.top[0].spread < 1 + 1e-12 && ps.top[0].qs.join() === 'omega,n' && ps.top[0].pows.join() === '-1,2';
  // ⑨ 仮の値の印: 仮の値の行は印つき・判定の側へ渡すと例外・リポジトリだけの行(水星)は印なし
  const rE = needOf(T1, GEO, 'Earth', { bg: 'Np', axis: 'L', tSrc: 0, u: 1 }, cache), rMe = needOf(T1, GEO, 'Mercury', { bg: 'Np', axis: 'L', tSrc: 0, u: 1 }, cache);
  let blocked = false; try { B.assertNoVerdict(rE); } catch (e) { blocked = true; }
  const markOk = rE.provisional === true && rE.provMark === B.MARK && blocked && rMe.provisional === undefined && rMe.kind === 'repo';
  // ⑩ 入力の拒否
  const rej = [() => unitRate(T1, GEO, 'Earth', { bg: 'Gp', axis: 'L', tSrc: 0, u: 1 }), () => unitRate(T1, GEO, 'Earth', { bg: 'Np', axis: 'ecl', tSrc: 0, u: 1 }),
    () => unitRate(T1, GEO, 'Earth', { bg: 'Np', axis: 'L', tSrc: 0.5, u: 1 }), () => unitRate(T1, GEO, 'Earth', { bg: 'Np', axis: 'L', tSrc: 0, u: -1 }),
    () => refRate('Jupiter'), () => uOfCol(T1, GEO, 'uX', 0)].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsJ, jr, inv, uVr, uVo, uvErr, uvObsErr, a2, a2Ok, structOk, eE, iOne, entryOk, scanTop: ps.top[0], scanOk, markOk, rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchor, p4 = (x, w) => Math.abs(x - w) < 5e-5 * Math.max(1, Math.abs(w));
  return {
    sameAsJ: S.vsJ < 1e-12,
    anchorJ: p4(S.jr.Np1.m, A.marsOverEarth) && p4(S.jr.Np1.v, A.venusOverEarth) && Math.abs(S.jr.Np1.spread - A.spread) < 5e-4 && p4(S.jr.NpV.v, A.npLVenusUV) && p4(S.jr.GmV.v, A.gmVenusUV)
      && Object.values(S.jr).every((r) => r.diff < 1e-12),
    bgInvariant: S.inv < 1e-9,
    uV: S.uvErr < 1e-12 && Math.abs(S.uVr / A.uV - 1) < 5e-6 && S.uvObsErr < 1e-12 && S.uVo > S.uVr,
    s1s2: S.a2Ok,
    structs: S.structOk,
    entries: S.entryOk,
    scan: S.scanOk,
    provMark: S.markOk,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
