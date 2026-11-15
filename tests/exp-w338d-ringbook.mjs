// 第338便d(原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の回答(2026-11-15 —— 第138報の回答 4)AN742・同 回答 3 AN736・AN737・統括の検証項目 R352):
//   **回転引きずり: 土星の環を先に —— T1 一様厚みの絶対値を同じ帳簿で・T2 環の中のやり取りの収支・T3 4 天体から潮汐の分を積んだ残り・T4 5 つ目の天体・
//   T5 ジャイロの直交を高さ則 T1 の捩れの率と第337便i の鉛直の場に・扁平率のべきと環の厚み**
//   (段 ringbook-338d —— 正本 tests/out/ringbook-338d.json・lib tests/lib-w338d-ringbook.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第337便までの lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w338d-ringbook.mjs —— 領域の宣言なし)・入力のファイルは無い(第337便k の 4 天体の強さの組は lib の t1Set を呼んで作り直す)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: D〜F 環の半径 74 点 × 厚みの型 6(帯の幅・釣り合いの高さ・率が半径に依らない型・鉛直の減衰と乱しの釣り合い〔Γ_d の読み 3〕・粒子の大きさの床〔k_d 2〕・自己重力の床)。
//     物差し: 局所のべき |d ln H/d ln r| ≤ 0.1 の区間の幅(D〜F に対する割合)・典型の厚み 10 m に対する比(⅓〜3 を「同じ桁」—— 文献の値・未照合なので採否は言い切らない)。参考の列: 木星の主環・天王星の ε 環。
//   T2: 輪の列 98 本(主の帯 96・F 環 2)× 例 14(粘性だけ・引きずりだけ〔χ ½・1〕・両方〔ν 4 × χ 2〕・集まりの係数で弱めた組〔χ ½・1・ν 0〕)× 1e7 年。
//     物差し: 角運動量とエネルギーの帳簿が閉じる(残り ≤ 1e-9 × 初めの量)・漂い 1e-5・傾きが 1e7 年で e 分の 1。
//   T3: 4 天体 × k₂/Q(潮汐の分 —— 自由)× 強さの倍 f。物差し: 残りの符号と大きさ・計算 ÷ 残り(寄与の同定ではない)。
//   T4: 受け手 13 × χ ½・1。物差し: 20 年の公転の向きの位置のずれ ≥ 1 km を「見分けの候補」(宣言)。
//   T5: 受け手 9 × 型 2(T1 の捩れ・第337便i の鉛直へ寄せる場)× 直交(c 1・plus・replace)/源 4 × 扁平率のべき 3。物差し: 1e7 年で e 分の 1 に要る λ c。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w338d-ringbook.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w338d-ringbook-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/ringbook-338d.json';
export const TARGET = 'tests/lib-w338d-ringbook.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['環の厚みの値を決めたとは書かない(このノブの組で何 m の桁か・要るノブまで)', '環の中のやり取りで外からのトルクが消えるとは書かない(帳簿の行き先まで)',
  '潮汐の残りを回転引きずりの寄与とは書かない(k₂/Q が自由・文献の値が未照合)', '5 つ目の天体は予測だけ(観測の値はこの環境の記録に無い)', '文献の値は未照合(出典と確かさを書く)']);
/** 器の宣言 */
export const PLAN = Object.freeze({ t1Types: Object.freeze(['band', 'zeq', 'rateOnly', 'drag|yard', 'drag|k4half', 'drag|focus337i', 'floor|1', 'floor|2.5', 'grav']), snapNote: '丸めの残り(同じ行の尺度の 1e-12 以下)と O(e²) の残り(1e-9 以下 —— 環の離心率 1e-5 の 2 乗の桁)は 0 と書く' });
const R = L.DECL, S1 = L.snapZero;

/* ───────── T1 ───────── */
export function partT1(sets) {
  const sat = L.srcOf('saturn'), grid = L.gridT1(), rs = grid.map((g) => g.r), regs = grid.map((g) => g.region);
  const gam = Object.fromEntries(R.t1.gammas.map((k) => [k, grid.map((g) => (g.region ? L.gammaAt(sat, g.r, k, sets) : null))]));
  const Href = R.t1.ref10m, cols = {};
  cols.band = grid.map(() => L.hBand(sat));
  cols.zeq = grid.map((g) => L.hZeq(sat, g.r));
  cols.rateOnly = grid.map(() => null);
  // 鉛直の減衰と乱しの釣り合い: B 環の中心で 10 m になる乱しの率 P を一様に置いたときの H(r)(Γ_d の読みごと)
  const iB = grid.reduce((b, g, i) => (Math.abs(g.rKm - L.centerKm('ringB')) < Math.abs(grid[b].rKm - L.centerKm('ringB')) ? i : b), 0);
  const Pref = {};
  for (const k of R.t1.gammas) { Pref[k] = L.pNeed(sat, grid[iB].r, gam[k][iB], Href); cols['drag|' + k] = grid.map((g, i) => (g.region ? L.linearLedger({ P: Pref[k], Gam: gam[k][i], nu: L.nOf(sat, g.r) }).H : null)); }
  for (const kd of R.t1.kd) cols['floor|' + kd] = grid.map((g) => (g.region && g.tau >= 0.01 ? L.hFloor(R.t1.dp, kd) : null));
  cols.grav = grid.map((g) => (g.region ? L.hGrav(sat, g.r, g.sigma) : null));
  const types = PLAN.t1Types.map((t) => { const H = cols[t], u = L.uniformWidth(rs, H, regs);
    const at = Object.fromEntries(R.t1.ringCenters.map((rk) => { const i = grid.reduce((b, g, j) => (Math.abs(g.rKm - L.centerKm(rk)) < Math.abs(grid[b].rKm - L.centerKm(rk)) ? j : b), 0); return [rk, H[i]]; }));
    const ratio = Object.fromEntries(Object.entries(at).map(([k, v]) => [k, v === null ? null : v / Href]));
    return { type: t, at, ratio10: ratio, sameOrder: Object.values(ratio).filter((v) => v !== null).every((v) => v >= R.t1.sameOrder[0] && v <= R.t1.sameOrder[1]), nDefined: H.filter((v) => v !== null).length, ...u }; });
  // 乱しの要る率と衝突の加熱の尺度の比(環の中心 —— Γ_d の読みごと)
  const pTab = R.t1.ringCenters.filter((rk) => rk !== 'ringF' || true).map((rk) => { const r = L.centerKm(rk) * 1e3, g = L.regionAt(L.centerKm(rk)), row = { key: rk, n: L.nOf(sat, r), tau: g.tau, pColl: L.pColl(sat, r, g.tau) };
    for (const k of R.t1.gammas) { const G0 = L.gammaAt(sat, r, k, sets); row['gam|' + k] = G0; row['pNeed|' + k] = L.pNeed(sat, r, G0, Href); row['ratio|' + k] = row['pNeed|' + k] / row.pColl; row['dHrel|' + k] = G0 / (R.t1.kc * row.n * g.tau); }
    return row; });
  // 参考の列(木星の主環・天王星の ε 環 —— 物差しにしない)
  const ref = R.t1.refRings.map((key) => { const Q = L.LIT.refRings[key], src = L.srcOf(Q.host), r = Q.rKm * 1e3;
    return { key, host: Q.host, nOverS: L.nOverS(src, r), band: L.hBand(src), zeq: L.hZeq(src, r), floor: Q.tau >= 0.01 ? L.hFloor(R.t1.dp, R.t1.kd[0]) : null, grav: L.hGrav(src, r, Q.sigma), litH: Q.H, litKind: Q.kind }; });
  return { nGrid: grid.length, rMinKm: R.t1.rMinKm, rMaxKm: R.t1.rMaxKm, rSyncKm: L.rSyncOf(sat) / 1e3, Req: L.hBand(sat) / 2, Pref, types, pTab, ref };
}

/* ───────── T2 ───────── */
export function partT2(sets) {
  const sat = L.srcOf('saturn'), cases = [];
  for (const c of R.t2.cases) { const set = sets[c.set], lam = c.strength === 'zero' ? 0 : c.strength === 'eps' ? set.eps : 1, e = L.evolveRing({ src: sat, set, lamScale: lam, nu: c.nu });
    const tilt = R.t1.ringCenters.map((rk) => { const d = L.ringRates(sat, L.centerKm(rk) * 1e3, set).dlnI * lam; return { key: rk, efoldYr: d < 0 ? -1 / (d * L.YR) : null }; });
    const okT = tilt.filter((x) => x.efoldYr !== null);
    cases.push({ key: c.key, set: c.set, strength: c.strength, lamScale: lam, nu: c.nu, M0: e.M0, L0: e.L0, E0: e.E0, nAnnuli: e.nAnnuli, Tnet0: e.Tnet0, Tabs0: e.Tabs0, cancel: e.cancel, netRate: e.netRate,
      dlnLnet1e7: e.netRate * R.t2.tEndYr * L.YR, tDrift1e5Yr: (() => { const mx = Math.max(...R.t1.ringCenters.map((rk) => Math.abs(L.dlnAFast(sat, L.centerKm(rk) * 1e3, set) * lam))); return mx > 0 ? R.t2.drift / mx / L.YR : null; })(),
      steps: e.steps, crossings: e.crossings, checks: e.checks, tilt, tiltMaxYr: okT.length === tilt.length ? Math.max(...okT.map((x) => x.efoldYr)) : null, tiltOk: okT.length === tilt.length && Math.max(...okT.map((x) => x.efoldYr)) <= R.t5.tThinYr });
  }
  // 粘性だけの対照(同じ ν)を引いた漂い —— 両方が 1e7 年まで全部の輪を残す例だけ
  const ctl = cases.find((c) => c.key === 'nuOnly'), last = (c) => c.checks[c.checks.length - 1];
  for (const c of cases) c.dlnMeanMinusCtl = c.nu === ctl.nu && last(c).nAlive === last(ctl).nAlive && c.key !== 'nuOnly' ? last(c).dlnMean - last(ctl).dlnMean : null;
  // 環の中のやり取りで運ぶのに要る粘性(χ 1 —— 同期の半径の内の輪のトルクの和を同期の半径の粘性の角運動量の流れ 3π ν Σ ℓ で運ぶ)・χ ½ は全部の輪で同じ符号(運び先が無い)
  const ann = L.makeAnnuli(), GM = L.G * sat.m, rS = L.rSyncOf(sat), gS = L.regionAt(rS / 1e3), lS = Math.sqrt(GM * rS);
  const carry = L.SETS.map((k) => { const T = ann.map((a) => 0.5 * a.M * Math.sqrt(GM * a.r) * L.dlnAFast(sat, a.r, sets[k])), Tin = T.filter((x, i) => ann[i].r < rS).reduce((s, x) => s + x, 0), Tout = T.filter((x, i) => ann[i].r >= rS).reduce((s, x) => s + x, 0);
    const opp = Math.sign(Tin) !== Math.sign(Tout) && Tout !== 0; return { set: k, Tin, Tout, opposite: opp, nuNeed: opp ? Math.min(Math.abs(Tin), Math.abs(Tout)) / (3 * Math.PI * gS.sigma * lS) : null }; });
  const ringMass = cases[0].M0;
  return { ringMass, ringMassOverLit: ringMass / L.LIT.ringMass, rSyncKm: rS / 1e3, sigmaSync: gS.sigma, carry, cases };
}

/* ───────── T3 ───────── */
export function partT3(sets) {
  const rows = L.SAT4.map((k) => L.tideRow(k, sets));
  const grid = rows.map((r) => ({ key: r.key, res: R.t3.k2qGrid.map((kq) => { const res = r.obs - kq * r.tideUnit; return { kq, res, sign: Math.sign(res), candOverRes: Object.fromEntries(L.SETS.map((k) => [k, r.cand[k] / res])) }; }) }));
  const combos = L.SETS.map((k) => L.tideCombos(rows, k));
  return { rows, grid, combos };
}

/* ───────── T4 ───────── */
export function partT4(sets) {
  const rows = R.t4.bodies.map((k) => L.fifthRow(k, sets));
  return { rows, nOpposite: rows.filter((r) => r.opposite).length, nVisible: rows.filter((r) => r.visible).length, inRange: rows.filter((r) => r.nOverS > 0.5 && r.nOverS < 1).length };
}

/* ───────── T5 ───────── */
export function partT5() {
  const rows = R.t5.recv.map((k) => { const o = L.orthT5Row(k), sc = Math.abs(o.twist.node), sf = Math.abs(o.focus.own);
    o.twist.own = S1(o.twist.own, sc, R.snap.ecc2); o.twist.dlnA = S1(o.twist.dlnA, sc, R.snap.round);
    o.focus.node = S1(o.focus.node, sf, R.snap.round); o.focus.orth = S1(o.focus.orth, sf, R.snap.round); o.focus.dlnA = S1(o.focus.dlnA, sf, R.snap.round);
    if (o.focus.orth === 0) o.focus.toPlane = 0; if (o.twist.orth === 0) o.twist.toPlane = 0; return o; });
  const rings = rows.filter((r) => L.RINGS.includes(r.key)), T = R.t5.tThinYr * L.YR;
  const slowTw = Math.min(...rings.map((r) => Math.abs(r.twist.orth))), lamNeedTw = 1 / (T * slowTw);
  const lam337i = R.t1.focus337i.lambda, efold337iTw = Math.max(...rings.map((r) => 1 / (Math.abs(r.twist.orth) * lam337i))) / L.YR;
  const flat = R.t5.hosts.map((k) => L.flatT5Row(k)), sat = flat.find((f) => f.key === 'saturn');
  const flatK = R.t5.kPow.map((kp) => ({ k: kp, times: flat.map((f) => ({ key: f.key, tYr: R.t5.tThinYr * (sat.orth / f.orth) * Math.pow(sat.fFlat / f.fFlat, kp) })) }));
  const twPow = (() => { const a = rings[0], b = rings[rings.length - 1], ra = L.centerKm(a.key), rb = L.centerKm(b.key); return Math.log(Math.abs(b.twist.orth / a.twist.orth)) / Math.log(rb / ra); })();
  return { rows, lamNeedTw, efold337iTw, twistRingPow: twPow, flat, flatK };
}

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, t5 = J.t5;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.types.length === PLAN.t1Types.length && t1.pTab.length === R.t1.ringCenters.length && t1.ref.length === R.t1.refRings.length,
    t1Band: (() => { const b = t1.types.find((t) => t.type === 'band'); return b.width === b.covered && b.covered > 0.9 && b.powMax === 0; })() && t1.types.find((t) => t.type === 'rateOnly').nDefined === 0,
    t2Complete: t2.cases.length === R.t2.cases.length && t2.cases.every((c) => c.checks.length === R.t2.checkYr.length),
    t2Closed: t2.cases.every((c) => c.checks.every((k) => k.amClosed && k.enClosed)) && t2.cases.every((c) => c.crossings === 0),
    t2Control: (() => { const c = t2.cases.find((x) => x.key === 'nuOnly'); return c.Tnet0 === 0 && c.checks.every((k) => k.extL === 0 && k.Wext === 0 && k.heat >= 0); })(),
    t3Complete: t3.rows.length === 4 && t3.rows.every((r) => fin(r.obs) && fin(r.tideUnit) && Math.abs(r.tideUnit - r.tideClosed) <= 1e-12 * Math.abs(r.tideClosed)),
    t4Complete: t4.rows.length === R.t4.bodies.length && t4.rows.every((r) => fin(r.pred.half.dlnA) && fin(r.pred.one.dlnA)),
    t4Opposite: t4.rows.filter((r) => r.nOverS > 0.5 && r.nOverS < 1).every((r) => r.opposite),
    t5Complete: t5.rows.length === R.t5.recv.length && t5.flat.length === R.t5.hosts.length && t5.rows.every((r) => r.twist.dlnA === 0),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: L.pureView(PS), gates: L.pureGates(PS) }; mark('pure');
  const sets = L.k4Sets(); mark('sets');
  const t1 = partT1(sets); mark('t1');
  const t2 = partT2(sets); mark('t2');
  const t3 = partT3(sets); mark('t3');
  const t4 = partT4(sets); mark('t4');
  const t5 = partT5(); mark('t5');
  const J = { pure, sets, t1, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w338d-ringbook.mjs', 'tests/lib-w338d-ringbook.mjs', 'tests/lib-w337k-gyrodrag.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w292d-tide.mjs',
  'tests/lib-w337a-supply.mjs', 'tests/lib-w337b-mercuryband.mjs', 'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs',
  'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs',
  'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W338D_OUT ? (path.isAbsolute(process.env.W338D_OUT) ? process.env.W338D_OUT : path.join(ROOT, process.env.W338D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第338便d ringbook(版 ' + HARNESS_VERSION + ')');
  const Rr = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w338d-ringbook.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の回答(2026-11-15 —— 第138報の回答 4)AN742「土星の輪が先。木星と天王星は、土星程にはクッキリしていないので、参考」・同 回答 3 AN736・AN737・統括の検証項目 R352',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...Rr };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第338便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ringbook', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積と輪の列の時間の発展)', notClaim: NOT_CLAIM,
    snap: { round: L.DECL.snap.round, ecc2: L.DECL.snap.ecc2, scale: 'T5 の T1 の捩れは同じ行の交点の率・第337便i の鉛直の場は同じ行の自分の傾きの率・純関数の場面の丸めの差は真偽で書く・帳簿の残りは閉じの真偽だけ(値を書かない)' } });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
