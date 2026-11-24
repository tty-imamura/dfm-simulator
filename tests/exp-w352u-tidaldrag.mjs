// 第352便u(原仮定者の整理(2026-11-11)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R458):
//   **「潮汐力の引きずり版」の項を数える器 —— 表 1 歪みの率(受け手 8 惑星と月 × 源 × 成分 (M)(S)(MS) —— 1 公転の平均と位相ごと・主軸・回転の分との比・距離のべき)/
//   表 2 歳差の率(式の候補 (T-a)(T-b)(T-g) × 向き × 受け手 5 —— 公転の北極・黄道の極のまわり)と要る係数のそろい方((ウ′) を源に月を足して)/
//   表 3 大きさ(単位の係数の率 ÷ 比べる数・重力の側の列 ÷ 比べる数)/表 4 一様な背景の歪み 0 と金星**(段 tidaldrag-352u —— 正本 tests/out/tidaldrag-352u.json・lib tests/lib-w352u-tidaldrag.mjs)。
//   **候補の式・単位の係数の表だけ** —— 式・係数の値を決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352u-tidaldrag.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値は第352便b の lib の prov() に在る数だけ(比べる列)—— 正本の最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた列と物差しの記録。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as DP from './lib-w352d-precsense.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352u-tidaldrag.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352u-tidaldrag-1';
export const OUT_MAIN = 'tests/out/tidaldrag-352u.json';
export const TARGET = 'tests/lib-w352u-tidaldrag.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '式の候補 (T-a)(T-b) と単位の係数(λ̃ 1・η_d 1 s⁻¹)は決めていない —— 候補の式・単位の係数の表',
  '重力の側の潮汐のトルクの列 (T-g) は比べる列 —— DFM の結果ではない',
  '仮の値(第352便b)を使う列は「仮・未照合」—— 較正の合否・サンプルの状況・ノブの採否に入れない',
  'リポジトリの文献の値(水星 —— 役割「桁」・月 —— 軌道の交点の率)は固定の比べる列(合わせない)',
  '月の扁平(J2)は公開の lib に無い —— 月を受け手にした歳差の率の列は null(足さない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PLAN = Object.freeze({ pure: '零試験 10', strain: '表 1: 組 11(8 惑星 ← 太陽・地球 ← 月・月 ← 地球・月 ← 太陽)× 成分 3 —— 1 公転の平均と位相ごとの大きさ・主軸・回転の分との比・源の自転軸の傾きの sin・距離のべき・源の自転軸を公転の北極にそろえた試し',
  rate: '表 2: 受け手と源の組 6 × 候補 3 × 向き(2・2・1)× 成分 (S)((M) の 1 公転の平均の歪みは床なので (MS) の率は (S) と同じ —— 表に持たない)—— 方位の率と傾きの率(公転の北極・黄道の極)・要る係数', align: '表 2′: 要る係数のそろい方(地球〔太陽/太陽 + 月〕・火星・金星 —— + 水星)・(ウ′) を源に月を足して(第352便q の要る係数 × 列 3)',
  size: '表 3: 単位の係数の率 ÷ 比べる数・重力の側の列 ÷ 比べる数', bg: '表 4: 一様な背景の歪み(背景の向き 2 × 大きさ 2)と金星の行',
  prov: '比べる列: 地球 ψ_A の率・火星の歳差の率・金星の歳差の率(仮・未照合)・水星と月(リポジトリの文献の値)' });
const PL = L.DECL.planets;

export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, A = L.ASYR;
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  // 表 1 歪みの率
  const strain = [];
  for (const key of L.DECL.pairs) {
    const [id, src] = key.split('|'), xw = L.extraWOf(T1, GEO, id, src), sinT = L.srcTiltSin(T1, GEO, id, src), byP = {};
    for (const part of L.DECL.parts) {
      const S = L.strainOf(T1, GEO, id, src, { part, extraW: xw }); byP[part] = S;
      strain.push({ pair: key, id, src, part, a: S.a, sinTilt: sinT, eAvgAsYr: S.eAvg * A, ePhaseRmsAsYr: S.ePhaseRms * A, wAvgAsYr: L.vec.nrm(S.Wavg) * A, wPhaseRmsAsYr: S.wPhaseRms * A,
        eig: S.eig.map((e) => ({ valAsYr: e.val * A, vec: e.vec })), trace: L.traceOf(S.Eavg) * A, avgOverRms: S.ePhaseRms > 0 ? S.eAvg / S.ePhaseRms : null,
        eOverW: L.vec.nrm(S.Wavg) > 0 ? S.eAvg / L.vec.nrm(S.Wavg) : null, rmsEOverRmsW: S.wPhaseRms > 0 ? S.ePhaseRms / S.wPhaseRms : null });
    }
    const r = strain.slice(-3);
    for (const row of r) { row.eOverWM = L.vec.nrm(byP.M.Wavg) > 0 ? byP[row.part].eAvg / L.vec.nrm(byP.M.Wavg) : null; row.eSOverSin = row.part === 'S' && sinT > 0 ? row.eOverW / sinT : null; }
  }
  // 源の自転軸を公転の北極にそろえた試し((S) の平均の歪み —— 地球・火星・水星)
  const aligned = ['Earth', 'Mars', 'Mercury'].map((id) => { const P = L.pairSpec(T1, GEO, id, 'Sun'), S0 = L.strainOf(T1, GEO, id, 'Sun', { part: 'S' }), S1 = L.strainOf(T1, GEO, id, 'Sun', { part: 'S', sAx: P.nHat });
    return { id, eAvgAsYr: S0.eAvg * A, eAlignedAsYr: S1.eAvg * A, ratio: S1.eAvg / S0.eAvg, rmsAligned: S1.ePhaseRms * A }; });
  // 距離のべき(8 惑星 —— 対数の最小二乗)
  const pick = (part, f) => PL.map((id) => f(strain.find((r) => r.pair === id + '|Sun' && r.part === part)));
  const as = pick('M', (r) => r.a), powers = {
    eRmsM: L.logSlope(as, pick('M', (r) => r.ePhaseRmsAsYr)), wM: L.logSlope(as, pick('M', (r) => r.wAvgAsYr)),
    eAvgS: L.logSlope(as, pick('S', (r) => r.eAvgAsYr)), eAvgSOverSin: L.logSlope(as, pick('S', (r) => r.eAvgAsYr / r.sinTilt)), wS: L.logSlope(as, pick('S', (r) => r.wAvgAsYr)),
    tideN2: L.logSlope(as, PL.map((id) => { const g = L.gravSrcs(T1, GEO, id, 'sun')[0]; return g.GM / g.a ** 3; })) };
  mark('strain');
  // 表 2 歳差の率
  const rate = [];
  for (const [id, set] of L.DECL.rateRows) for (const cand of L.DECL.cands) for (const sense of L.DECL.senses[cand]) for (const part of (cand === 'Tg' ? ['—'] : ['S'])) {
    const o = part === '—' ? {} : { part }, r = L.rateOf(T1, GEO, id, set, cand, sense, o, cache), n = L.needRow(T1, GEO, id, set, cand, sense, o, cache);
    rate.push({ id, set, cand, sense, part, H: r.H, omega: r.omega, magAsYr: r.mag, az: r.az, inc: r.inc, ref: n.ref, kind: n.kind, pole: n.pole, need: n.need, overRef: n.overRef, retro: n.retro,
      ...(n.provisional ? { provisional: true, provMark: n.provMark, provKeys: n.provKeys } : {}) });
  }
  mark('rate');
  // 表 2′ 要る係数のそろい方
  const align = [];
  for (const cand of L.DECL.cands) for (const sense of L.DECL.senses[cand]) for (const eSet of ['sun', 'sunMoon']) {
    const part = cand === 'Tg' ? '—' : 'S', get = (id, set) => rate.find((r) => r.id === id && r.set === set && r.cand === cand && r.sense === sense && r.part === part);
    const rows = [get('Earth', eSet), get('Mars', 'sun'), get('Venus', 'sun'), get('Mercury', 'sun')], nd = rows.map((r) => r.need), e = nd[0];
    align.push({ cand, sense, earthSet: eSet, need: nd, rel: nd.map((x) => (x === null || !e ? null : x / e)), spread3: L.spreadOf(nd.slice(0, 3)), spread4: L.spreadOf(nd), retro: rows.map((r) => r.retro) });
  }
  // (ウ′) の物差しを源に月を足して(第352便q の要る係数 —— 列 3)
  const uJ = [];
  for (const [bg, uCol] of [['Np', 'u1'], ['Np', 'uV'], ['Gm', 'uV']]) {
    const u = Q.uOfCol(T1, GEO, uCol, 0, cache), nd = ['Earth', 'Mars', 'Venus'].map((id) => Q.needOf(T1, GEO, id, { bg, axis: 'L', tSrc: 0, u }, cache).need);
    for (const eSet of ['sun', 'sunMoon']) {
      const X = [L.uJSet(T1, GEO, 'Earth', eSet), L.uJSet(T1, GEO, 'Mars', 'sun'), L.uJSet(T1, GEO, 'Venus', 'sun')], ratio = nd.map((v, k) => v / X[k]);
      uJ.push({ bg, axis: 'L', tSrc: 0, uCol, earthSet: eSet, need: nd, X, rel: ratio.map((x) => x / ratio[0]), spread3: L.spreadOf(ratio) });
    }
  }
  const moonOverSun = (() => { const g = L.gravSrcs(T1, GEO, 'Earth', 'sunMoon'); return (g[1].GM / g[1].a ** 3) / (g[0].GM / g[0].a ** 3); })();
  mark('align');
  // 表 3 大きさ
  const size = ['Earth', 'Mars', 'Venus', 'Mercury'].flatMap((id) => (id === 'Earth' ? ['sun', 'sunMoon'] : ['sun']).map((set) => {
    const f = (cand, sense, part) => rate.find((r) => r.id === id && r.set === set && r.cand === cand && r.sense === sense && r.part === part);
    const ta = f('Ta', 'g2m', 'S'), tb = f('Tb', 'nat', 'S'), tg = f('Tg', 'nat', '—');
    const row = { id, set, ref: tg.ref, kind: tg.kind, taOverRef: ta.overRef, tbOverRef: tb.overRef, tgOverRef: tg.overRef, needLam: ta.need, needKappa: tb.need, tgAz: tg.az[tg.pole] };
    return tg.provisional ? { ...row, provisional: true, provMark: tg.provMark, provKeys: tg.provKeys } : row;
  }));
  mark('size');
  // 表 4 一様な背景と金星
  const bg = [];
  for (const dir of ['Np', 'Gm']) for (const uCol of ['u1', 'uV']) {
    const u = Q.uOfCol(T1, GEO, uCol, 0, cache), Om = DP.bgVec(dir, { u, axis: CR.refAxis('L', T1, GEO) }), J = L.uniformJ(Om);
    bg.push({ dir, uCol, u, omAsYr: L.vec.nrm(Om) * A, eAsYr: L.fro(L.symOf(J)) * A, wAsYr: L.vec.nrm(L.axialOf(J)) * A });
  }
  const vS = strain.find((r) => r.pair === 'Venus|Sun' && r.part === 'S'), vM = strain.find((r) => r.pair === 'Venus|Sun' && r.part === 'M'), vsh = L.shapeOf(T1, GEO, 'Venus');
  const venus = { eAvgSAsYr: vS.eAvgAsYr, eRmsMAsYr: vM.ePhaseRmsAsYr, wSAsYr: vS.wAvgAsYr, J2: vsh.J2, moi: vsh.moi, H: vsh.H, omega: vsh.omega,
    rates: rate.filter((r) => r.id === 'Venus' && (r.part === 'S' || r.part === '—')).map((r) => ({ cand: r.cand, sense: r.sense, az: r.az.orb, need: r.need, overRef: r.overRef })), ref: Q.refRate('Venus').rate };
  mark('bg');
  const provKeys = [...new Set(rate.filter((r) => r.provKeys).flatMap((r) => r.provKeys).concat(Q.refRate('Venus').provKey))].sort();
  const J = PV.tagProv({ pure, strain, aligned, powers, rate, align, uJ, moonOverSun, size, bg, venus, timing: tm }, provKeys);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nRate = L.DECL.rateRows.length * (2 + 2 + 1);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    strain: J.strain.length === L.DECL.pairs.length * 3 && J.strain.filter((r) => r.part === 'M').every((r) => r.avgOverRms < 1e-12) && J.strain.every((r) => Math.abs(r.trace) <= 1e-9 * Math.max(r.ePhaseRmsAsYr, 1e-300)),
    aligned: J.aligned.every((r) => r.ratio < 1e-9),
    rate: J.rate.length === nRate && J.rate.filter((r) => r.id === 'Moon').every((r) => r.need === null),
    align: J.align.length === 5 * 2 && J.uJ.length === 6,
    size: J.size.length === 5,
    bg: J.bg.length === 4 && J.bg.every((r) => r.eAsYr === 0 && Math.abs(r.wAsYr / r.omAsYr - 1) < 1e-12),
    prov: J.provisional === true && Array.isArray(J.provKeys) && J.provKeys.length >= 3 && PV.outMarkProblems(J).length === 0,
  };
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352u-tidaldrag.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352U_OUT ? (path.isAbsolute(process.env.W352U_OUT) ? process.env.W352U_OUT : path.join(ROOT, process.env.W352U_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便u tidaldrag(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352u-tidaldrag.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-11)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R458',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便u', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'tidaldrag', engine: 'Node(html を読まない —— 純関数の lib: 〔第348便h〕の場・〔第351便c〕の組の入力・〔第352便q〕の構造の量と比べる数・〔第352便d〕の方位の率と背景・〔第352便b〕の仮の値・〔第330便a〕の古典の歳差の定数)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
