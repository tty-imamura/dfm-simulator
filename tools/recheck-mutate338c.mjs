#!/usr/bin/env node
// 第338便c(統括の検証項目 R351): **作り直しの照合(tests/lib-w338c-recheck.mjs)の変異の試し** —— 器 tests/exp-w337i/j/k を作り直して尺度 σ′ を測り、
//   正本(tests/out/rotring-337i.json・spinorbit-337j.json・gyrodrag-337k.json)の写しに 1 か所ずつ変異を入れて、照合が拾うかを数える(正本は書き換えない)。
//   変異: ① 第337便の 19 件(統括の変異の試し)② 統括の検証項目の 1 件(環の行の交点の率 /ring/sets/17/rows/0/dnode → 1e-5)
//   ③ 数の葉の種類(道の添字を # にした形 = 行の型 × 欄)ごとに、最初の 0 でない葉を相対 1e-5 変える総当たり ④ 真偽・文字列の葉の種類ごとに 1 つ反転/書き換え・配列の種類ごとに 1 つ要素を除く。
//   拾えない種類は、その種類の葉の σ′/|値|(打ち消しで桁を失った量)とともに出す —— 許容を広げて通さない。
//   第340便(統括): 器に judge340h(3 値の判定を尺度から書く口 —— 第340便h)が在れば、尺度を測った後に呼んでから正本と比べる。
// 使い方: node tools/recheck-mutate338c.mjs [i j k] [--json <出力>]   (i は 30 s 前後 —— 番号札の対象)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R338 = await import('file://' + path.join(ROOT, 'tests', 'lib-w338c-recheck.mjs'));
const CFG = {
  i: { harness: 'exp-w337i-rotring.mjs', out: 'rotring-337i.json', parts: ['pure', 'inventory', 'ring', 'planets', 'reps', 'rdScan', 'integ', 'oblate', 'uniform', 'an719'] },
  j: { harness: 'exp-w337j-spinorbit.mjs', out: 'spinorbit-337j.json', parts: ['inputs', 'pure', 't1', 't2', 'integ', 't3'] },
  k: { harness: 'exp-w337k-gyrodrag.mjs', out: 'gyrodrag-337k.json', parts: ['pure', 't1', 't2', 't3', 't4'] },
};
const argv = process.argv.slice(2), ji = argv.indexOf('--json'), jsonOut = ji >= 0 ? argv[ji + 1] : null;
const which = argv.filter((a, k) => !a.startsWith('--') && (ji < 0 || k !== ji + 1));
const plain = (x) => JSON.parse(JSON.stringify(x));
const kindOf = (p) => p.replace(/\/\d+(?=\/|$)/g, '/#');
const getAt = (o, segs) => segs.reduce((a, k) => (a == null ? a : a[k]), o);
const report = { node: process.version, decl: R338.DECL, sets: {} };
for (const w of (which.length ? which : ['i', 'j', 'k'])) {
  const c = CFG[w], X = await import('file://' + path.join(ROOT, 'tests', c.harness)), J = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', c.out), 'utf8'));
  const { base, sigma } = R338.sigmaOf(() => { const R = X.runAll(); delete R.timing; return R; });
  if (typeof X.judge340h === 'function') X.judge340h(base, sigma);   // 第340便(統括 —— 第340便h の引き継ぎ): 器 i・j は 3 値の判定(正・負・未解決)を尺度から書く —— 正本と同じ形にしてから変異を数える
  const caughtBy = (Jm, parts = c.parts) => parts.reduce((s, k) => s + R338.recheckTree(base[k], sigma[k], Jm[k]).n, 0);
  const base0 = caughtBy(J);
  const res = { base: base0, named: [], kinds: { num: 0, numCaught: 0, missed: [] }, nonNum: { n: 0, caught: 0, missed: [] }, arrays: { n: 0, caught: 0, missed: [] }, leaves: { nonzero: 0, catchable: 0, zero: 0 } };
  const tryMut = (label, fn, parts) => { const Jm = plain(J); let ok = true; try { fn(Jm); } catch (e) { ok = false; } const n = ok ? caughtBy(Jm, parts) : -1; return { label, caught: n > base0, n }; };
  // ① 第337便の 19 件 + ② 統括の検証項目の 1 件
  const named = {
    i: [['ring: 最大の dnode × (1 + 1e-5)', (Jm) => { let b = null; for (const s of Jm.ring.sets) for (const r of s.rows) if (!b || Math.abs(r.dnode) > Math.abs(b.dnode)) b = r; b.dnode *= 1 + 1e-5; }],
      ['ring: 判定の真偽を反転', (Jm) => { Jm.ring.sets[0].judge.thin = !Jm.ring.sets[0].judge.thin; }],
      ['ring.pass から 1 組を除く', (Jm) => { Jm.ring.pass.pop(); }],
      ['planets.trans[0] の apsW × 1.001', (Jm) => { Jm.planets.trans[0].row.apsW *= 1.001; }],
      ['planets.bandB.dlnAcy を 1e-6 に(丸めの残りが実の量に)', (Jm) => { Jm.planets.bandB.dlnAcy = 1e-6; }],
      ['ring: 全部の dlnI × 1.01', (Jm) => { for (const s of Jm.ring.sets) for (const r of s.rows) r.dlnI *= 1.01; }],
      ['ring.controls k1 の行 0 の apsW × 2(桁の小さい行)', (Jm) => { Jm.ring.controls[1].rows[0].apsW *= 2; }],
      ['ring.sets[1].rows[11] の dlnE × 1.0001(行の最大の 1e-3 の量)', (Jm) => { Jm.ring.sets[1].rows[11].dlnE *= 1.0001; }],
      ['ring.sets[1].rows[11] の apsW × 1.00001', (Jm) => { Jm.ring.sets[1].rows[11].apsW *= 1.00001; }],
      ['planets.sets[16] 地球の unit.apsW × 1.0001', (Jm) => { Jm.planets.sets[16].per.earth.unit.apsW *= 1.0001; }],
      ['planets.sets[16] 地球の atNeed.row.apsW × 1.01(必要な λ での小さい量)', (Jm) => { Jm.planets.sets[16].per.earth.atNeed.row.apsW *= 1.01; }],
      ['rdScan の最初の数 × 1.00001', (Jm) => { const f = (o) => { for (const k of Object.keys(o)) { if (typeof o[k] === 'number' && !Number.isInteger(o[k]) && o[k] !== 0) { o[k] *= 1.00001; return true; } if (o[k] && typeof o[k] === 'object' && f(o[k])) return true; } return false; }; f(Jm.rdScan); }],
      ['統括の検証項目: /ring/sets/17/rows/0/dnode を 1e-5 に', (Jm) => { Jm.ring.sets[17].rows[0].dnode = 1e-5; }]],
    j: [['t2.simul に 1 組足す', (Jm) => { Jm.t2.simul.push('x'); }],
      ['t2.sets[1].rows[0].dlnA × 1.0001', (Jm) => { Jm.t2.sets[1].rows[0].dlnA *= 1.0001; }],
      ['t1 の最初の数 × 1.00001', (Jm) => { const f = (o) => { for (const k of Object.keys(o)) { if (typeof o[k] === 'number' && !Number.isInteger(o[k]) && o[k] !== 0) { o[k] *= 1.00001; return true; } if (o[k] && typeof o[k] === 'object' && f(o[k])) return true; } return false; }; f(Jm.t1); }]],
    k: [['t2: steadyRatio を 1e-3 に', (Jm) => { Jm.t2.sets[0].rows[0].steadyRatio = 1e-3; }],
      ['t2: 行 0 の ratio × 1.00001', (Jm) => { Jm.t2.sets[0].rows[0].ratio *= 1.00001; }],
      ['t2: 行 0 の dlnA × 1.001(行の最大の 1e-20 の量)', (Jm) => { Jm.t2.sets[0].rows[0].dlnA *= 1.001; }],
      ['t3: 行の鍵を変える', (Jm) => { Jm.t3.types[0].rows[0].key = 'zz'; }]],
  }[w];
  for (const [label, fn] of named) res.named.push(tryMut(label, fn));
  // ③ ④ 種類ごとの総当たり
  const firstNum = new Map(), firstNon = new Map(), firstArr = new Map(), kindStat = new Map();
  const walk = (y, x, s, segs) => {
    const p = '/' + segs.join('/');
    if (typeof y === 'number') {
      const kd = kindOf(p), st = kindStat.get(kd) || { n: 0, zero: 0, catchable: 0, worstRel: 0 }; st.n++;
      if (y === 0) { st.zero++; res.leaves.zero++; } else {
        res.leaves.nonzero++;
        const sg = typeof s === 'number' ? s : 0, lim = Math.max(R338.DECL.REL * Math.abs(y), R338.DECL.TOL_FACTOR * sg);
        if (1e-5 * Math.abs(y) > lim) { st.catchable++; res.leaves.catchable++; } else st.worstRel = Math.max(st.worstRel, sg / Math.abs(y));
        if (!firstNum.has(kd)) firstNum.set(kd, segs.slice());
      }
      kindStat.set(kd, st); return;
    }
    if (Array.isArray(y)) { const kd = kindOf(p); if (y.length && !firstArr.has(kd)) firstArr.set(kd, segs.slice()); }
    if (y && typeof y === 'object') { for (const k of Object.keys(y)) walk(y[k], x && typeof x === 'object' ? x[k] : undefined, s && typeof s === 'object' ? s[k] : null, segs.concat(k)); return; }
    const kd = kindOf(p); if (!firstNon.has(kd) && (typeof y === 'boolean' || typeof y === 'string')) firstNon.set(kd, segs.slice());
  };
  for (const k of c.parts) walk(J[k], base[k], sigma[k], [k]);
  const setAt = (Jm, segs, f) => { const o = getAt(Jm, segs.slice(0, -1)); o[segs[segs.length - 1]] = f(o[segs[segs.length - 1]]); };
  for (const [kd, segs] of firstNum) { res.kinds.num++; const r = tryMut(kd, (Jm) => setAt(Jm, segs, (v) => v * (1 + 1e-5)), [segs[0]]);
    if (r.caught) res.kinds.numCaught++; else { const st = kindStat.get(kd), v = getAt(J, segs), sg = getAt(sigma, segs); res.kinds.missed.push({ kind: kd, leaf: '/' + segs.join('/'), value: v, sigmaOverValue: sg / Math.abs(v), kindLeaves: st.n, kindZero: st.zero, kindCatchable: st.catchable }); } }
  for (const [kd, segs] of firstNon) { res.nonNum.n++; const r = tryMut(kd, (Jm) => setAt(Jm, segs, (v) => (typeof v === 'boolean' ? !v : v + '·')), [segs[0]]); if (r.caught) res.nonNum.caught++; else res.nonNum.missed.push(kd); }
  for (const [kd, segs] of firstArr) { res.arrays.n++; const r = tryMut(kd, (Jm) => getAt(Jm, segs).pop(), [segs[0]]); if (r.caught) res.arrays.caught++; else res.arrays.missed.push(kd); }
  res.kindStats = Object.fromEntries([...kindStat].filter(([, st]) => st.n - st.zero > st.catchable).map(([kd, st]) => [kd, st]));
  report.sets[w] = res;
  console.log(`${process.version} ${w}: 正本と同じ(変異なし)の外れ ${base0} / ① ② 名指しの変異 ${res.named.filter((q) => q.caught).length}/${res.named.length} 拾う`
    + ` / ③ 数の葉の種類 ${res.kinds.numCaught}/${res.kinds.num}(拾えない ${res.kinds.missed.length})/ ④ 真偽・文字列 ${res.nonNum.caught}/${res.nonNum.n}・配列 ${res.arrays.caught}/${res.arrays.n}`
    + ` / 葉ごと: 0 でない ${res.leaves.nonzero} のうち相対 1e-5 を拾える ${res.leaves.catchable}・0 と書いた ${res.leaves.zero}`);
  for (const q of res.named.filter((x) => !x.caught)) console.log('   MISSED(名指し)', q.label);
  for (const q of res.kinds.missed) console.log('   拾えない種類', q.kind, 'σ′/|値| ' + q.sigmaOverValue.toExponential(1), `(この種類の葉 ${q.kindLeaves}・0 ${q.kindZero}・拾える ${q.kindCatchable})`);
  for (const q of res.nonNum.missed.concat(res.arrays.missed)) console.log('   MISSED(数でない)', q);
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1) + '\n');
