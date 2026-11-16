// 第340便c(原仮定者の指示(2026-11-17 —— 第140報)・決断事項 AN770・統括の検証項目 R358 —— 鎖の道具):
//   ① 常時群(calaudit・diag)の転記の来歴の欄を安定 hash の除外へ —— 対照(物理の値の欄を 1 つ変えると門は「走る」・来歴の欄だけを変えると「再利用」)と
//      実物の正本の組(第339便の鎖 1〜3・第337便の鎖 1〜2)の照合。宣言の本体は tests/lib-w281a-regentable.mjs の「第340便c の塊」(V_CALAUDIT_PROV340C)。
//   ② 見積りの秒の取りこぼし(済み印が reuse の段の見積りが、前の鎖の確かめの秒のまま残る)—— calibrate の後段の検査
//   ③ 鎖の所要の見積り(模擬・最長の経路・run の秒の和 ÷ レーン)を 1 行で
//   ファイルを書かない(①の対照は呼び手が渡す一時ディレクトリだけに書く)。tools/regen-chain.mjs と QA lint.provenanceExclude340c が呼ぶ。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as RT from './lib-w281a-regentable.mjs';
import * as SC from './lib-w281a-scope.mjs';

export const CHAINTOOLS_VERSION_340C = 'w340c-chaintools-1';
export const CAL_FILE_340C = 'tests/out/calaudit-w249.json';
export const DIAG_FILE_340C = 'tests/out/calaudit-w249-diag.json';

/* ───────── ① 来歴の欄の除外 ───────── */
/** 前の世代(w324c)の宣言 = 今の宣言から第340便c で足した Pointer を除いたもの。 */
export function previousDecl340c(file) {
  const add = Object.keys(RT.provenancePathsOf340c(file));
  return RT.volatilePathsOf(file).filter((p) => !add.includes(p));
}
const fp16 = (ptrs) => crypto.createHash('sha256').update(ptrs.slice().sort().join('\n')).digest('hex').slice(0, 16);   // volatileDeclFp と同じ作り方
/** Pointer に合う位置の値を fn で置き換える(合った数を返す)。 */
export function setAt340c(J, ptr, fn) {
  const toks = SC.parsePointer(ptr);
  let n = 0;
  const walk = (x, i) => {
    if (!x || typeof x !== 'object') return;
    const ks = toks[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, toks[i]) ? [toks[i]] : []);
    for (const k of ks) { if (i === toks.length - 1) { x[k] = fn(x[k], k); n++; } else walk(x[k], i + 1); }
  };
  walk(J, 0);
  return n;
}
/** 来歴の欄だけを、型を保って別の値へ(転記 ↔ 走らせた の入れ替えを模す)。 */
function flipProvenance(v, kind) {
  switch (kind) {
    case 'idList': return v && v.length ? v.slice(1) : ['w340c-probe'];
    case 'refusedList': return v && v.length ? [] : [{ id: 'w340c-probe', reason: 'contract', diff: ['engineSha'] }];
    case 'bool': return !v;
    case 'reasonOrNull': return v === null ? 'other-flight' : null;
    case 'strList': return v && v.length ? [] : ['targetSha256'];
    case 'refOrNull': return v === null ? { generatedAt: '2099-01-01T00:00:00.000Z', targetSha256: 'e'.repeat(64), contractSha: 'f'.repeat(64), wallSec: 1 } : null;
    case 'skippedBy': return v === 'reuse' ? 'reuse-dt2' : 'reuse';
    case 'count': return (v || 0) + 3;
    default: return v;
  }
}
/** 来歴の欄を足す(転記の無い世代の正本に、転記した世代の欄を作る —— 欄が無い位置は作らない: 親が在る位置だけ)。 */
function addProvenance(J) {
  let n = 0;
  for (const pr of (J.presets || [])) {
    const run = pr && pr.run;
    if (!run || typeof run !== 'object') continue;
    if (run.dtHalf && typeof run.dtHalf === 'object' && run.dtHalf.skippedBy === undefined) { run.dtHalf.skippedBy = 'reuse-dt2'; run.dtHalf.reusedFrom = { generatedAt: '2099-01-01T00:00:00.000Z', targetSha256: 'e'.repeat(64), contractSha: 'f'.repeat(64), wallSec: 1 }; n += 2; }
    for (const s of (Array.isArray(run.timeBudget) ? run.timeBudget : [])) if (s && typeof s === 'object' && s.reused === undefined) { s.reused = true; s.skippedBy = 'reuse-dt2'; s.reusedFrom = { contractSha: 'f'.repeat(64) }; n += 3; }
  }
  return n;
}
/**
 * 対照(a)(b)の自己試験(一時の root に正本の写しを置き、門〔stableInputOk —— planRegen と --gate の判定〕と済み印の契約〔semanticSha〕を引く)。
 * @param {{root:string, tmpDir:string}} o
 */
export function provenanceExcludeProbe340c(o) {
  const res = { version: CHAINTOOLS_VERSION_340C, ok: false, cases: [], bad: [] };
  const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(o.root, f), 'utf8')); } catch { return null; } };
  const J = read(CAL_FILE_340C), D = read(DIAG_FILE_340C);
  if (!J || !D) { res.bad.push('正本が読めない'); return res; }
  const tmp = o.tmpDir;
  fs.mkdirSync(path.join(tmp, 'tests', 'out'), { recursive: true });
  const put = (cal, diag) => { fs.writeFileSync(path.join(tmp, CAL_FILE_340C), JSON.stringify(cal)); fs.writeFileSync(path.join(tmp, DIAG_FILE_340C), JSON.stringify(diag)); };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  put(J, D);
  const stamp = SC.stableInputs(tmp, [CAL_FILE_340C]).inputsStable;   // 読み手の正本が刻む行(随伴の diag の行つき)
  const semOf = () => [RT.semanticSha(path.join(tmp, CAL_FILE_340C), CAL_FILE_340C), RT.semanticSha(path.join(tmp, DIAG_FILE_340C), DIAG_FILE_340C)].join('|');
  const sem0 = semOf();
  const gate = () => (SC.stableInputOk(tmp, stamp, CAL_FILE_340C) ? '再利用' : '走る');
  const row = (name, cal, diag, want) => {
    put(cal, diag);
    const g = gate(), semSame = semOf() === sem0;
    const okRow = g === want && semSame === (want === '再利用');
    if (!okRow) res.bad.push(`${name}: 門 ${g}(期待 ${want})・済み印の契約 ${semSame ? '同じ' : '違う'}`);
    res.cases.push({ name, gate: g, want, semSame });
  };
  // (b) 来歴の欄だけ(今の正本の世代にある欄を型を保って入れ替え + 転記した世代の欄を作る)
  const B = clone(J), BD = clone(D);
  const prov = RT.provenancePathsOf340c(CAL_FILE_340C), provD = RT.provenancePathsOf340c(DIAG_FILE_340C);
  let nB = 0;
  for (const [p, k] of Object.entries(prov)) nB += setAt340c(B, p, (v) => flipProvenance(v, k));
  nB += addProvenance(B);
  for (const [p, k] of Object.entries(provD)) nB += setAt340c(BD, p, (v) => flipProvenance(v, k));
  row('(b) 来歴の欄だけ ' + nB + ' 葉', B, BD, '再利用');
  // (a) 物理の値の欄を 1 つだけ(本の量の実測 meas・h/2 の契約・来歴の外の同じ名の欄・diag の置き場の h の署名)
  const pr = (J.presets || []).find((z) => z && Array.isArray(z.quantities) && z.quantities.some((q) => q && typeof q.meas === 'number'));
  if (!pr) res.bad.push('(a) 量の実測 meas を持つ本が無い');
  else {
    const A = clone(J), Ap = A.presets.find((z) => z.id === pr.id), qi = Ap.quantities.findIndex((q) => q && typeof q.meas === 'number');
    Ap.quantities[qi].meas = Ap.quantities[qi].meas * (1 + 1e-12) + 1e-300;
    row(`(a) 物理の値 1 つ(/presets[id=${pr.id}]/quantities/${qi}/meas × (1 + 1e-12))`, A, D, '走る');
  }
  { // h2Reuse の契約(contractSha —— 来歴の外に残す欄)
    const A = clone(J), Ap = (A.presets || []).find((z) => z && z.run && z.run.h2Reuse && typeof z.run.h2Reuse.contractSha === 'string');
    if (Ap) { Ap.run.h2Reuse.contractSha = 'd'.repeat(64); row(`(a) h/2 の契約 1 つ(/presets[id=${Ap.id}]/run/h2Reuse/contractSha)`, A, D, '走る'); }
    else res.cases.push({ name: '(a) h/2 の契約の欄が無い(転記の判定が無い世代)', gate: '—', want: '—', semSame: null });
  }
  { // 物理の欄の下の同じ名前の欄(reason・diff・reused を名に持つ別の欄は除かない —— 語彙を広げない)
    const A = clone(J), Ap = (A.presets || []).find((z) => z && z.run && z.run.stopRule && typeof z.run.stopRule === 'object');
    if (Ap) { Ap.run.stopRule.reason = 'w340c-probe'; row(`(a) 来歴の外の同じ名の欄(/presets[id=${Ap.id}]/run/stopRule/reason を足す)`, A, D, '走る'); }
  }
  { // diag の置き場の行の中身(h の署名)
    const DD = clone(D), e = Object.values((DD.h2Store || {}).entries || {})[0];
    if (e) { e.hSig = 'x' + String(e.hSig || ''); row('(a) diag の置き場の h の署名 1 つ', J, DD, '走る'); }
  }
  // 前の世代の宣言で (b) を引くと「走る」(今回の直しが効いていることの対照)
  const prev = previousDecl340c(CAL_FILE_340C), prevD = previousDecl340c(DIAG_FILE_340C);
  const oldSame = SC.stableValueSha(J, prev) === SC.stableValueSha(B, prev) && SC.stableValueSha(D, prevD) === SC.stableValueSha(BD, prevD);
  if (oldSame) res.bad.push('前の世代の宣言でも (b) が同じ hash —— 対照にならない');
  res.cases.push({ name: '前の世代の宣言(w324c)で (b)', gate: oldSame ? '再利用' : '走る', want: '走る', semSame: null });
  res.prevFp = { cal: fp16(prev), diag: fp16(prevD) };
  res.ok = res.bad.length === 0;
  return res;
}
/** 実物の正本の組(text の対)を今の宣言と前の世代の宣言で比べる。 */
export function realPairCompare340c(calA, calB, diagA, diagB) {
  const P = (t) => JSON.parse(t);
  const ca = P(calA), cb = P(calB), da = P(diagA), db = P(diagB);
  const cur = RT.volatilePathsOf(CAL_FILE_340C), curD = RT.volatilePathsOf(DIAG_FILE_340C);
  const prev = previousDecl340c(CAL_FILE_340C), prevD = previousDecl340c(DIAG_FILE_340C);
  const h = (x, vp) => SC.stableValueSha(x, vp).slice(0, 16);
  return {
    prev: { cal: [h(ca, prev), h(cb, prev)], diag: [h(da, prevD), h(db, prevD)] },
    cur: { cal: [h(ca, cur), h(cb, cur)], diag: [h(da, curD), h(db, curD)] },
    prevSame: h(ca, prev) === h(cb, prev) && h(da, prevD) === h(db, prevD),
    curSame: h(ca, cur) === h(cb, cur) && h(da, curD) === h(db, curD),
  };
}
/** 鎖の前後の正本の組(git の rev)。第339便の鎖 1(9e1aebc)・鎖 2(b5e5064)・鎖 3(0f1a201)・第337便の鎖 1(c0e0e40)・鎖 2(c416a9c)。 */
export const REAL_PAIRS_340C = Object.freeze([
  { name: '第339便 鎖 1 → 鎖 2', a: '9e1aebc', b: 'b5e5064' },
  { name: '第339便 鎖 2 → 鎖 3', a: 'b5e5064', b: '0f1a201' },
  { name: '第337便 鎖 1 → 鎖 2', a: 'c0e0e40', b: 'c416a9c' },
]);
export const REAL_PAIRS_FILE_340C = 'tests/data-w340c-provpairs.json';

/* ───────── ② 見積りの秒の取りこぼし ───────── */
export const CALIBRATE_FLAGS_VERSION_340C = 'w340c-calflags-1';
/** 確かめの秒の疑い: 見積り ≤ RESUME_CHECK_MAX_SEC(5 s)で、表の本文の秒が 30 s 以上。 */
export const SUSPECT_TABLE_MIN_SEC_340C = 30;
/** 表の本文へ戻すのは、表の本文が見積りの 10 倍以上のときだけ(gate の確かめは 1.5〜3 s —— 本当に速くなった段〔例 tide3d-307b 4 s/表 30 s〕は戻さない)。 */
export const RESTORE_RATIO_340C = 10;
/**
 * calibrateSec の結果の後段(規則 w312c-calibrate-2 は変えない —— 読んだ実測の上に 3 つを足す):
 *   (i)  済み印の無い段(timeline の組から読んだ段)で、実測 ≤ 5 s かつ表の本文の秒 ≥ 30 s → **更新しない**(gate の確かめの疑い —— 第339便 solar16-318c の 2 s の出どころの型)
 *   (ii) 飛ばした段(済み印が reuse・manual・再開の確かめ)で、今の見積り ≤ 5 s かつ表の本文の秒 ≥ 30 s かつ表の本文 ≥ 見積りの 10 倍 → **表の本文の秒へ戻す**(restore —— 再利用が続く間は実測で直らない)
 *   (iii) 見積りと実測・表の本文と実測が 2 倍以上違う段の一覧(ratio2x)
 * @param {{rows:Array, apply:object}} r calibrateSec の戻り値(書き換えて返す)
 * @param {{source?:string}} [o]
 */
export function calibrateFlags340c(r, o) {
  const opt = o || {};
  const max = RT.RESUME_CHECK_MAX_SEC;
  const suspect = [], restore = [], ratio2x = [];
  for (const z of r.rows) {
    const tbl = Number(z.secTable);
    if (z.action === 'update' && !String(z.from || '').startsWith('mark') && Number.isFinite(z.measured) && z.measured <= max && tbl >= SUSPECT_TABLE_MIN_SEC_340C) {
      z.action = 'skip'; z.why = '確かめの秒の疑い(済み印なし・実測 ≤ ' + max + ' s・表の本文 ' + tbl + ' s —— 第340便c)'; delete r.apply[z.key]; suspect.push(z.key);
    }
    if (z.action === 'skip' && Number.isFinite(z.sec) && z.sec <= max && tbl >= SUSPECT_TABLE_MIN_SEC_340C && tbl >= RESTORE_RATIO_340C * Math.max(z.sec, 1) && /reuse|manual|resumed/.test(z.why || '')) {
      z.action = 'restore'; z.why = '見積り ' + z.sec + ' s が確かめの秒の疑い(表の本文 ' + tbl + ' s へ戻す —— 再利用が続く間は実測で直らない・第340便c)';
      r.apply[z.key] = { sec: Math.round(tbl), source: 'table-restore(第340便c)' }; restore.push(z.key);
    }
    if (Number.isFinite(z.measured) && z.measured > 0 && z.action !== 'skip') {
      const rEst = z.sec > 0 ? z.measured / z.sec : Infinity, rTbl = tbl > 0 ? z.measured / tbl : Infinity;
      const off = (x) => x >= 2 || x <= 0.5;
      if (off(rEst) || off(rTbl)) ratio2x.push({ key: z.key, est: z.sec, table: tbl, measured: z.measured, vsEst: Number.isFinite(rEst) ? Math.round(rEst * 100) / 100 : null, vsTable: Number.isFinite(rTbl) ? Math.round(rTbl * 100) / 100 : null });
    }
  }
  ratio2x.sort((a, b) => b.measured - a.measured);
  r.flags340c = { version: CALIBRATE_FLAGS_VERSION_340C, suspect, restore, ratio2x, source: opt.source || null };
  return r;
}
/** 鎖の JSON の段のうち、見積りが確かめの秒の疑いの段(見積り ≤ 5 s・表の本文 ≥ 30 s —— 鎖の模擬と ready queue の EST は同じ rows[].sec を使う)。 */
export function suspectEstimates340c(chain, steps) {
  const by = new Map((steps || RT.REGEN_STEPS).map((z) => [z.key, z]));
  const out = [];
  for (const [k, r] of Object.entries(chain.steps || {})) {
    const st = by.get(k); if (!st) continue;
    const tbl = st.secTable !== undefined ? st.secTable : st.sec;
    if ((r.sec || 0) <= RT.RESUME_CHECK_MAX_SEC && tbl >= SUSPECT_TABLE_MIN_SEC_340C) out.push({ key: k, sec: r.sec || 0, table: tbl, mode: r.mode });
  }
  return out;
}
/** 自己試験(合成の timeline): (i) 済み印なしの 2 s は更新しない・(ii) reuse の段の 2 s の見積りは表へ戻す・(iii) 2 倍の一覧。 */
export function calibrateFlagsSelfTest340c() {
  const steps = [
    { key: 'longA', sec: 2, secTable: 4187, role: 'current' },        // 見積りが確かめの秒(第339便 solar16-318c の型)・済み印 reuse
    { key: 'longB', sec: 600, secTable: 600, role: 'current' },       // 済み印なし・timeline の 2 s(確かめの疑い —— 規則 w312c-calibrate-2 のままなら 2 s へ書き換える)
    { key: 'fast', sec: 3, secTable: 3, role: 'current' },            // 本当に速い段(戻さない)
    { key: 'grow', sec: 100, secTable: 100, role: 'current' },        // 実測 300 s(2 倍の一覧)
  ];
  const tl = ['# ready-queue 2026-11-17T00:00:00Z lanes=4', 'start longA 100.0 1', 'end longA 0 102.0', 'start longB 100.0 1', 'end longB 0 102.0',
    'start fast 100.0 1', 'end fast 0 103.5', 'start grow 100.0 1', 'end grow 0 400.0'].join('\n') + '\n';
  const marks = new Map([['longA', 'reuse 2026-11-17T00:00:02Z fast'], ['fast', 'run 4s 2026-11-17T00:00:04Z'], ['grow', 'run 300s 2026-11-17T00:05:00Z']]);
  const r = calibrateFlags340c(RT.calibrateSec(tl, { steps, marks, tol: 0.1 }));
  const row = (k) => r.rows.find((z) => z.key === k) || {};
  const G = {
    restoreLongA: row('longA').action === 'restore' && r.apply.longA && r.apply.longA.sec === 4187,
    suspectLongB: row('longB').action === 'skip' && !r.apply.longB,
    fastKept: row('fast').action !== 'restore' && (!r.apply.fast || r.apply.fast.sec === 4),
    ratioGrow: r.flags340c.ratio2x.some((z) => z.key === 'grow' && z.vsEst === 3),
  };
  return { version: CALIBRATE_FLAGS_VERSION_340C, ok: Object.values(G).every(Boolean), gates: G };
}

/* ───────── ③ 鎖の所要の見積り ───────── */
export const ESTIMATE_VERSION_340C = 'w340c-estimate-1';
/** gate の段が再利用で終わるときの秒(第339便の鎖 2・3 の gate の再利用は 1.5〜2.9 s)。 */
export const GATE_REUSE_SEC_340C = 2;
/**
 * 鎖の JSON(tools/regen-chain.mjs --json)から 3 つの数: 模擬(ready queue —— 鎖のシェルと同じ規則・同じ rows[].sec)・最長の経路(依存だけ・レーン無限)・
 * run の秒の和 ÷ レーン数。gate を「全部走る」場合と「全部再利用(2 s)」の 2 通り。伝える見積り = max(模擬 × 1.2, 最長の経路)。
 * @param {object} chain
 * @param {{lanes?:number}} [o]
 */
export function chainEstimate340c(chain, o) {
  const lanes = (o && o.lanes) || 4;
  const rows = chain.steps || {};
  const keys = Object.keys(rows);
  const one = (label, secOf) => {
    const sim = RT.simulateReadyQueue(chain, { lanes, secOf, estOf: secOf });
    const memo = new Map();
    const es = (k) => { if (memo.has(k)) return memo.get(k); const v = Math.max(0, ...((rows[k].deps || []).filter((d) => rows[d]).map((d) => es(d) + secOf(d)))); memo.set(k, v); return v; };
    let lp = 0, end = null;
    for (const k of keys) { const v = es(k) + secOf(k); if (v > lp) { lp = v; end = k; } }
    const pathKeys = [];
    for (let k = end; k;) { pathKeys.unshift(k); const d = (rows[k].deps || []).filter((q) => rows[q]).find((q) => Math.abs(es(q) + secOf(q) - es(k)) < 1e-6); k = d || null; }
    const sum = keys.reduce((a, k) => a + secOf(k), 0);
    const simSec = Math.round(sim.makespan), lpSec = Math.round(lp), perLane = Math.round(sum / lanes);
    return { label, simSec, longestPathSec: lpSec, sumPerLaneSec: perLane, sumSec: Math.round(sum), tellSec: Math.round(Math.max(simSec * 1.2, lpSec)), longestPath: pathKeys, ok: sim.check.ok, pending: sim.pending.length };
  };
  const all = one('gate も走る', (k) => rows[k].sec || 0);
  const reuse = one('gate は再利用(' + GATE_REUSE_SEC_340C + ' s)', (k) => (rows[k].mode === 'gate' ? GATE_REUSE_SEC_340C : (rows[k].sec || 0)));
  const runOnly = keys.filter((k) => rows[k].mode === 'run').reduce((a, k) => a + (rows[k].sec || 0), 0);
  return { version: ESTIMATE_VERSION_340C, lanes, steps: keys.length, count: chain.count || null, runSumSec: Math.round(runOnly), runSumPerLaneSec: Math.round(runOnly / lanes), all, reuse, suspect: suspectEstimates340c(chain) };
}
const hm = (s) => { const m = Math.round(s / 60); return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' : m + ' min'; };
/** 1 行の文(見積りは見積り —— 実測は鎖で出る)。 */
export function chainEstimateText340c(e) {
  const l = (x) => `${x.label}: 模擬 ${x.simSec} s(${hm(x.simSec)})・最長の経路 ${x.longestPathSec} s(${hm(x.longestPathSec)})・秒の和 ÷ ${e.lanes} レーン ${x.sumPerLaneSec} s → 伝える見積り max(模擬 × 1.2, 最長の経路) = ${x.tellSec} s(${hm(x.tellSec)})`;
  return [`regen-chain --estimate(${e.version}・段 ${e.steps}・run の秒の和 ${e.runSumSec} s ÷ ${e.lanes} = ${e.runSumPerLaneSec} s)`, '  ' + l(e.all), '  ' + l(e.reuse),
    '  最長の経路(gate も走る): ' + e.all.longestPath.join(' → '),
    '  見積りが確かめの秒の疑いの段(見積り ≤ 5 s・表の本文 ≥ 30 s): ' + (e.suspect.length ? e.suspect.map((z) => z.key + ' ' + z.sec + '/' + z.table + ' s').join('・') : 'なし')].join('\n');
}
