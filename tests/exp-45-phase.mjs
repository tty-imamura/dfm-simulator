// 第45便 45B(3): 「融合と分裂・結合と解離・凝縮と気化」— 3対の相転移の再現検証。
//
// 3つの対はそれぞれ違う階層の可逆過程である:
//   ① 融合⇄分裂   … 粒子そのものが 1 個になったり 2 個に割れたりする(第44便+第45便の新機構)
//   ② 結合⇄解離   … 2粒子が接触振動する束縛対を作ったり、熱の斥力(E5′)でほどけたりする(既存物理)
//   ③ 凝縮⇄気化   … N粒子雲が 1 クラスタに固まったり、箱に充満したりする(既存物理)
// いずれも「順方向・逆方向の両方が同じ物理で起きる」ことを機械判定し、保存則の閉性を実測する。
//
// 実行: node tests/exp-45-phase.mjs   出力: tests/out/exp-45-phase.json
import fs from 'node:fs';
import path from 'node:path';
import { openPage, ROOT, num, fmt } from './lib-45.mjs';

const { browser, page } = await openPage();
const R = {};

// ============================================================================
// ① 融合⇄分裂: 一様重力場の箱に2粒子を落とす。床で衝突 → 融合(ΔKE+U_spring+U_rep が
//    T_int へ)→ T_int > Tcrit で分裂(ΔE_split を T_int が払って冷える)→ 破片は再び
//    落ちて融合… 加熱源は**重力落下**だけ(壁 heat も etaRad 逆符号も使わない)。
// ============================================================================
R.fusfis = await page.evaluate(() => {
  const F = window.__F, s = HP.sim;
  const mkP = (fis) => F.mk([
    { type: 'single', m: 1.5, x: -5, y: -10, vx: 0, vy: 0, spin: 0.3, tInt: 1 },
    { type: 'single', m: 1.5, x: 5, y: -11, vx: 0, vy: 0, spin: -0.3, tInt: 1 }],
    { dFrac: 0.35, fission: fis },
    { G: 8, kRep: 1, cHeat: 0.2, gammaN: 0, muF: 0, kappaS: 0, etaRad: 0,
      softening: 1, radiusScale: 1, gravityY: 1 },
    { boundary: 'box', size: 14 });
  const STEPS = 20000;
  s.build(mkP({ Tcrit: 25, frac: 0.5 }));
  const nSeq = [s.n], tSeq = [];
  let eEv = 0, eStep = 0, nMax = s.n, E0 = F.energy(s), Emin = E0, Emax = E0;
  for (let k = 0; k < STEPS; k++) {
    const nb = s.n, Eb = F.energy(s);
    s.step(0.016);
    const E = F.energy(s), dE = Math.abs(E - Eb);
    if (s.n !== nb) { eEv = Math.max(eEv, dE); nSeq.push(s.n); tSeq.push(s.t); } else eStep = Math.max(eStep, dE);
    if (s.n > nMax) nMax = s.n;
    if (E < Emin) Emin = E; if (E > Emax) Emax = E;
  }
  const fu = s.fusLog, fi = s.fisLog;
  const mx = (a, f) => a.reduce((r, e) => Math.max(r, f(e)), 0);
  // 融合と分裂は**同じサブステップ**で連続して起きうる(_fuse の直後に _fission が走り、
  // 融合体の T_int がその場で Tcrit を超えるため)。したがって「粒子数 n の履歴」では
  // サイクルを数えられない — イベントログを時刻順に並べた記号列で数える。
  const evSeq = fu.map(e => ({ t: e.t, k: 'F' })).concat(fi.map(e => ({ t: e.t, k: 'S' })))
    .sort((a, b) => a.t - b.t || (a.k === 'F' ? -1 : 1)).map(e => e.k).join('');
  const out = {
    steps: STEPS, fusN: s.fusN, fisN: s.fisN, nSeq, tSeq, nMax, evSeq,
    E0, E1: F.energy(s), Emin, Emax, eEv, eStep, fusU: s.fusU,
    mass0: 3, mass1: (() => { let m = 0; for (let i = 0; i < s.n; i++) m += s.m[i]; return m; })(),
    rP: Math.max(mx(fu, e => e.rP), mx(fi, e => e.rP)),
    rL: Math.max(mx(fu, e => e.rL), mx(fi, e => e.rL)),
    rE: Math.max(mx(fu, e => e.rE), mx(fi, e => e.rE)),
    carry: Math.max(
      Math.abs(s.fusPx + fu.reduce((a, e) => a + e.ePx, 0) + fi.reduce((a, e) => a + e.ePx, 0)),
      Math.abs(s.fusPy + fu.reduce((a, e) => a + e.ePy, 0) + fi.reduce((a, e) => a + e.ePy, 0)),
      Math.abs(s.fusL + fu.reduce((a, e) => a + e.eL, 0) + fi.reduce((a, e) => a + e.eL, 0))),
    fus: fu.map(e => ({ t: e.t, dKE: e.dKE, uSpr: e.uSpr, uRep: e.uRep, Tn: e.Tn })),
    fis: fi.map(e => ({ t: e.t, T0: e.T0, T1: e.T1, dEsplit: e.dEsplit, dKE: e.dKE, uSpr: e.uSpr,
      uRep: e.uRep, uGrav: e.uGrav, w: e.w, dFrac: e.dFrac }))
  };
  // 対照: fission を外すと 1 回融合したきり戻らない(サイクルが分裂機構に由来することの要因分離)。
  // ※ F.run は s.build を呼ぶので、上の計測値は**全てここより前**に確定させてある
  const ctl = F.run(mkP(undefined), STEPS);
  out.ctlFusN = ctl.fusN; out.ctlFisN = ctl.fisN; out.ctlN1 = ctl.n1;
  return out;
});

// ============================================================================
// ② 結合⇄解離: E9 法線ばね(接触の反発)と E4 重力の釣り合いで束縛対(接触振動)ができ、
//    T_int を上げると E5′ の熱の斥力 U_rep が重力を振り切って解離する。fusion は使わない。
//    束縛判定 = 相対距離の有界性 / 解離判定 = 単調離反。
// ============================================================================
R.bind = await page.evaluate(() => {
  const F = window.__F, s = HP.sim;
  const mkB = (T) => F.mk([
    { type: 'single', m: 1, x: -0.9, y: 0, vx: 0, vy: 0, spin: 0, tInt: T },
    { type: 'single', m: 1, x: 0.9, y: 0, vx: 0, vy: 0, spin: 0, tInt: T }],
    null, { G: 4, kRep: 2, q: 2, cHeat: 5, gammaN: 0, muF: 0, kappaS: 0, etaRad: 0,
      softening: 1, radiusScale: 1 });
  const trace = (T, steps) => {
    s.build(mkB(T));
    const ds = [], E0 = F.energy(s); let dE = 0;
    for (let k = 0; k < steps; k++) {
      s.step(0.016);
      if (k % 25 === 0) ds.push(Math.hypot(s.x[0] - s.x[1], s.y[0] - s.y[1]));
      dE = Math.max(dE, Math.abs(F.energy(s) - E0));
    }
    const last = ds.slice(-Math.floor(ds.length / 4));
    let up = 0; for (let i = 1; i < last.length; i++) if (last[i] > last[i - 1]) up++;
    const T0 = s.totals();
    return { T, d0: ds[0], dMin: Math.min(...ds), dMax: Math.max(...ds), dEnd: ds[ds.length - 1],
      monoFrac: up / (last.length - 1), nOsc: (() => { let c = 0;
        for (let i = 1; i < ds.length - 1; i++) if ((ds[i] - ds[i - 1]) * (ds[i + 1] - ds[i]) < 0) c++; return c; })(),
      dErel: dE / Math.max(1e-9, Math.abs(E0)), px: T0.px, py: T0.py, L: T0.L, ds: ds.filter((_, i) => i % 8 === 0) };
  };
  const cold = trace(1, 8000);      // 低温 → 束縛対(接触振動)
  const hot = trace(25, 8000);      // 高温 → 解離(単調離反)
  // 1本のランの中で「冷たい束縛対を途中で加熱して解離させる」— 順方向と逆方向を同じ軌跡で見る
  s.build(mkB(1));
  const seq = []; let injected = 0;
  const E0s = F.energy(s);
  for (let k = 0; k < 12000; k++) {
    if (k === 4000) {               // 外部から熱を注入(注入量は帳簿へ)
      const before = 5 * (s.m[0] * s.Tint[0] + s.m[1] * s.Tint[1]);
      s.Tint[0] = 25; s.Tint[1] = 25;
      injected = 5 * (s.m[0] * s.Tint[0] + s.m[1] * s.Tint[1]) - before;
    }
    s.step(0.016);
    if (k % 100 === 0) seq.push({ k, d: Math.hypot(s.x[0] - s.x[1], s.y[0] - s.y[1]), T: s.Tint[0] });
  }
  const pre = seq.filter(v => v.k < 4000).map(v => v.d), post = seq.filter(v => v.k > 5000).map(v => v.d);
  let up2 = 0; for (let i = 1; i < post.length; i++) if (post[i] > post[i - 1]) up2++;
  return { cold, hot, injected,
    step: { preMax: Math.max(...pre), preMin: Math.min(...pre), postEnd: post[post.length - 1],
      monoFrac: up2 / (post.length - 1),
      ledger: Math.abs(F.energy(s) - (E0s + injected)) / Math.max(1e-9, Math.abs(E0s + injected)) } };
});

// ============================================================================
// ③ 凝縮⇄気化: 🧊phase と同系の物理(自己重力+一様重力場+E5′ 熱の斥力+E9 接触)の N=60 雲。
//    冷却は自発放射 E11(etaRad>0 → 帳簿 radE)、加熱は伝熱する箱の床(thermalWalls heat →
//    帳簿 wallEin)。どちらも既存機構で、系のエネルギー収支は帳簿込みで閉じる。fusion は使わない。
// ============================================================================
R.cond = await page.evaluate(() => {
  const s = HP.sim;
  const pre = {
    id: 'exp45cond', name: 'cond', description: '凝縮⇄気化', camera: { scale: 200 }, thermal: 'tint',
    world: { boundary: 'box', size: 40, thermalWalls: { bottom: { mode: 'heat', T: 600, rate: 1 } } },
    physics: { G: 0.7, D0: 30, kFrame: 0, q: 2, kRep: 0.8, muF: 0.6, gammaN: 0.85, kappaS: 0.05,
      Kt: 60, cLight: 60, bM: 1, etaRad: 0, pRad: 4, cHeat: 1, gravityX: 0, gravityY: 0.04,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 2 },
    bodies: [{ type: 'disk', rMul: 1.6, n: 60, cx: 0, cy: -10, radius: 26, mMin: 0.6, mMax: 0.6,
      spinMin: 0, spinMax: 0, tInt: 60, vMode: 'none', aroundMass: 0, vScale: 0, direction: 1 }],
    overlays: {}
  };
  s.build(pre);
  const twall0 = s.twall;
  // 形態の指標: 平均対距離 ⟨d⟩(小さいほど凝縮)/ 接触クラスタ数(1 なら完全凝縮・N なら完全気化)
  // / 平均高さ ȳ(+y が下向きなので大きいほど底に溜まっている)/ 平均 T_int
  const metric = () => {
    let sum = 0, c = 0, Tm = 0, ry = 0;
    const par = new Int32Array(s.n); for (let i = 0; i < s.n; i++) par[i] = i;
    const find = (a) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
    for (let i = 0; i < s.n; i++) {
      Tm += s.Tint[i]; ry += s.y[i];
      for (let j = i + 1; j < s.n; j++) {
        const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]);
        sum += d; c++;
        if (d < 1.05 * (s.R[i] + s.R[j])) { const a = find(i), b = find(j); if (a !== b) par[a] = b; }
      }
    }
    const roots = new Set(); for (let i = 0; i < s.n; i++) roots.add(find(i));
    return { d: sum / c, T: Tm / s.n, clusters: roots.size, yMean: ry / s.n };
  };
  // 帳簿込みの系エネルギー: KE+熱+外部場ポテンシャル−重力+ばね+U_rep に
  //   +radE(放射で出た分) +wallEout −wallEin(壁とやり取りした分) +wallKE(壁が吸ったKE)
  const sysE = () => {
    const G = s.params.G, eps2 = s.params.softening ** 2, C = s.params.cHeat, gY = s.params.gravityY || 0;
    let E = 0;
    for (let i = 0; i < s.n; i++) {
      E += 0.5 * s.m[i] * (s.vx[i] ** 2 + s.vy[i] ** 2) + 0.25 * s.m[i] * s.R[i] ** 2 * s.spin[i] ** 2;
      E += C * s.m[i] * s.Tint[i] - s.m[i] * gY * s.y[i];
    }
    for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
      const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j], d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
      E -= G * s.m[i] * s.m[j] / Math.sqrt(d2 + eps2);
      const sumR = s.R[i] + s.R[j];
      if (d < sumR) { const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]), maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
        const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
        E += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC); }
    }
    return E + HP.urepEnergy(s) + s.radE + s.wallKE + s.wallEout - s.wallEin;
  };
  const run = (n, cfg) => {
    s.params.etaRad = cfg.etaRad; s.twall = cfg.heat ? twall0 : null;
    for (let k = 0; k < n; k++) s.step(0.032);
    return Object.assign(metric(), { E: sysE(), radE: s.radE, wallEin: s.wallEin, wallEout: s.wallEout });
  };
  const E0 = sysE();
  const gas0 = run(3000, { etaRad: 0, heat: false });      // 初期(高温 = 気体)
  const cond1 = run(9000, { etaRad: 0.05, heat: false });   // 放射冷却 → 凝縮
  const vap1 = run(9000, { etaRad: 0, heat: true });        // 床加熱 → 気化
  const cond2 = run(9000, { etaRad: 0.05, heat: false });   // 再び放射冷却 → 再凝縮(可逆性)
  // 帳簿残差の帰属(要因分離): gammaN(E9 の非保存な減衰インパルス)を 0 にした対照。
  // 残差が一桁落ちるなら、残差の主因は本便の機構ではなく既存の E9 減衰の実装である
  const ctlPre = JSON.parse(JSON.stringify(pre)); ctlPre.physics.gammaN = 0;
  s.build(ctlPre);
  const tw2 = s.twall; s.twall = null;
  const cE0 = sysE();
  s.params.etaRad = 0.05; for (let k = 0; k < 9000; k++) s.step(0.032);
  s.params.etaRad = 0; s.twall = tw2; for (let k = 0; k < 9000; k++) s.step(0.032);
  const cScale = Math.abs(cE0) + s.radE + s.wallEin + s.wallEout;
  const ctlLedger = Math.abs(sysE() - cE0) / cScale;
  // 相対化の分母は「系の初期エネルギー」ではなく「壁と放射がやり取りした熱量のスケール」に取る
  // (QA thermalwalls.ledger と同じ流儀 — 3万步で系の内部エネルギーの数百倍の熱が出入りする)
  const scale = Math.abs(E0) + s.radE + s.wallEin + s.wallEout;
  return { E0, gas0, cond1, vap1, cond2, n: 60, scale, ctlLedger,
    ledger: Math.abs(cond2.E - E0) / scale };
});

await browser.close();

// ============================================================================
// 判定と出力
// ============================================================================
const P = [];
const say = (...a) => console.log(...a);
say('=== 第45便 45B(3) 相転移3対の再現検証 ===\n');

// ---- ① 融合⇄分裂 ----
const f = R.fusfis;
// サイクル = 記号列に "FS"(融合してから分裂した)が現れた回数。2 回以上で「2 サイクル以上回った」
const cyc = (f.evSeq.match(/FS/g) || []).length;
const okFF = cyc >= 2 && f.fusN >= 2 && f.fisN >= 2 && f.nMax === 2
  && /^(FS)+$/.test(f.evSeq)                        // 融合と分裂が厳密に交互(取りこぼしなし)
  && f.fis.every(e => e.T1 < e.T0 && e.dEsplit > 0 && e.w > 0 && e.dFrac > 0.35)
  && f.fus.every(e => e.dKE > 0)
  && f.rP <= 1e-7 && f.rL <= 1e-7 && f.rE <= 1e-6 && f.carry <= 1e-12 && f.eEv <= f.eStep;
P.push(['① 融合⇄分裂', okFF]);
say('--- ① 融合⇄分裂(加熱源=重力落下のみ・一様重力場 gravityY=1 の箱 size=14・G=8)---');
say(`  ${f.steps} 步: 融合 ${f.fusN} 回 / 分裂 ${f.fisN} 回 / イベント記号列(F=融合 S=分裂・時刻順)= ${f.evSeq} / 最大 n = ${f.nMax}`);
say(`  イベント時刻: 融合 t=${f.fus.map(e => num(e.t, 3)).join(', ')} / 分裂 t=${f.fis.map(e => num(e.t, 3)).join(', ')}`);
say(`  ※ 融合体はその場で Tcrit を超えるので、融合と分裂は同一サブステップで連続して起きる`
  + `(_fuse → _fission の順。粒子数 n はサブステップ境界では 2 のまま = n 履歴ではサイクルを数えられない)`);
say(`  順方向(融合・発熱): ΔKE = ${f.fus.map(e => num(e.dKE, 2)).join(', ')} (>0) + U_spring ${f.fus.map(e => num(e.uSpr, 2)).join(', ')}`
  + ` → T_int = ${f.fus.map(e => num(e.Tn, 1)).join(', ')}(閾値 Tcrit=25 を超える)`);
say(`  逆方向(分裂・吸熱): ΔE_split = ${f.fis.map(e => num(e.dEsplit, 2)).join(', ')} を T_int が支払い`
  + ` ${f.fis.map(e => `${num(e.T0, 1)}→${num(e.T1, 1)}`).join(', ')}(冷却)`);
say(`  分裂の配置: d/ΣR = ${f.fis.map(e => num(e.dFrac, 4)).join(', ')}(融合の発火面 0.35 の外側)・離反初速 w = ${f.fis.map(e => num(e.w, 2)).join(', ')} (>0)`);
say(`  サイクル数(記号列中の "FS" の出現回数) = ${cyc}(閾値 ≥2)・厳密交互 = ${/^(FS)+$/.test(f.evSeq)}`);
say(`  対照(fission サブキーを外すだけ): 融合 ${f.ctlFusN} 回 / 分裂 ${f.ctlFisN} 回 / 終端 n=${f.ctlN1} — 融合したきり戻らない`);
say(`  保存: 質量 ${num(f.mass0, 6)}→${num(f.mass1, 6)} / イベント相対残差 P=${fmt(f.rP, 2)} L_z=${fmt(f.rL, 2)} E=${fmt(f.rE, 2)}`);
say(`        回収帳簿 carry=${fmt(f.carry, 1)}(≤1e-12) / 系の帳簿の跳び: イベントstep=${fmt(f.eEv, 2)} ≤ 非イベントstep=${fmt(f.eStep, 2)}`);
say(`        系エネルギー E: ${num(f.E0, 4)} → ${num(f.E1, 4)}(振れ幅 ${num(f.Emax - f.Emin, 4)} = 剛い E9 接触の積分誤差。リザーバ fusU=${num(f.fusU, 3)})`);
say(`  判定 = ${okFF ? 'PASS' : 'FAIL'}\n`);

// ---- ② 結合⇄解離 ----
const b = R.bind;
const okB = b.cold.dMax < 3 * b.cold.d0 && b.cold.nOsc >= 4          // 束縛: 有界 + 振動している
  && b.hot.dEnd > 20 * b.hot.d0 && b.hot.monoFrac === 1              // 解離: 単調離反
  && b.step.postEnd > 10 * b.step.preMax && b.step.monoFrac === 1     // 同一ランでの加熱→解離
  && b.cold.dErel < 1e-2 && b.hot.dErel < 1e-2 && b.step.ledger < 1e-2;
P.push(['② 結合⇄解離', okB]);
say('--- ② 結合⇄解離(E9 法線ばね×E4 重力の釣り合い vs E5′ 熱の斥力・G=4 kRep=2・fusion 不使用)---');
say(`  低温 T_int=1 : 相対距離 d ∈ [${num(b.cold.dMin, 3)}, ${num(b.cold.dMax, 3)}](初期 ${num(b.cold.d0, 3)})`
  + ` — 有界(dMax/d0=${num(b.cold.dMax / b.cold.d0, 2)} < 3)で反転 ${b.cold.nOsc} 回 = **接触振動する束縛対**`);
say(`  高温 T_int=25: d 終端 ${num(b.hot.dEnd, 1)}(初期 ${num(b.hot.d0, 3)}・比 ${num(b.hot.dEnd / b.hot.d0, 1)} > 20)`
  + ` 単調増加率 ${num(b.hot.monoFrac, 2)}(=1.00) = **解離**`);
say(`  同一ラン(k=4000 で T_int 1→25 に加熱): 加熱前 d≤${num(b.step.preMax, 3)} → 加熱後 終端 ${num(b.step.postEnd, 1)}`
  + `(比 ${num(b.step.postEnd / b.step.preMax, 1)} > 10)単調増加率 ${num(b.step.monoFrac, 2)}`);
say(`  保存: 冷 |ΔE|/E=${fmt(b.cold.dErel, 2)} / 熱 |ΔE|/E=${fmt(b.hot.dErel, 2)}(<1e-2 = 剛い E9 接触ばねを`
  + ` dt=0.016 で積分したときの誤差水準。分裂機構は不使用なので機構由来の残差ではない)`
  + ` / 加熱ランは注入熱 ΔH=${num(b.injected, 3)} を帳簿に入れて |ΔE|/E=${fmt(b.step.ledger, 2)}`);
say(`  判定 = ${okB ? 'PASS' : 'FAIL'}\n`);

// ---- ③ 凝縮⇄気化 ----
const c = R.cond;
const okC = c.cond1.clusters === 1 && c.cond1.d < 0.4 * c.gas0.d
  && c.vap1.clusters >= 0.8 * c.n && c.vap1.d > 3 * c.cond1.d
  && c.cond2.clusters === 1 && c.cond2.d < 1.2 * c.cond1.d
  && c.ledger < 1e-2 && c.ctlLedger < c.ledger;
P.push(['③ 凝縮⇄気化', okC]);
say('--- ③ 凝縮⇄気化(🧊phase 同系の既存物理・N=60・冷却=自発放射 E11 / 加熱=伝熱する箱の床・fusion 不使用)---');
const row = (nm, m) => `  ${nm.padEnd(22)} ⟨d⟩=${num(m.d, 2).padStart(6)}  クラスタ数=${String(m.clusters).padStart(3)}/${c.n}  ⟨T_int⟩=${num(m.T, 2).padStart(8)}  ȳ=${num(m.yMean, 2).padStart(7)}`;
say(row('初期(高温=気体)', c.gas0));
say(row('放射冷却 9000步 →', c.cond1));
say(row('床加熱 9000步 →', c.vap1));
say(row('再び放射冷却 9000步 →', c.cond2));
say(`  順方向(凝縮): ⟨d⟩ ${num(c.gas0.d, 2)}→${num(c.cond1.d, 2)}(比 ${num(c.cond1.d / c.gas0.d, 3)} < 0.4)・クラスタ ${c.gas0.clusters}→${c.cond1.clusters}(=1)`);
say(`  逆方向(気化): ⟨d⟩ ${num(c.cond1.d, 2)}→${num(c.vap1.d, 2)}(比 ${num(c.vap1.d / c.cond1.d, 2)} > 3)・クラスタ ${c.cond1.clusters}→${c.vap1.clusters}(≥${Math.ceil(0.8 * c.n)})`);
say(`  可逆性: 2 巡目の凝縮 ⟨d⟩=${num(c.cond2.d, 2)}(1 巡目 ${num(c.cond1.d, 2)} の ${num(c.cond2.d / c.cond1.d, 3)} 倍)・クラスタ ${c.cond2.clusters}`);
say(`  保存: 帳簿込み |ΔE_系 −(壁注入−壁回収−壁吸収KE−放射)|/E_scale = ${fmt(c.ledger, 2)}(<1e-2)`
  + `  放射 radE=${num(c.cond2.radE, 1)} 壁注入 ${num(c.cond2.wallEin, 1)} 壁回収 ${num(c.cond2.wallEout, 1)} E_scale=${num(c.scale, 1)}`);
say(`        要因分離: gammaN=0(E9 の減衰インパルスを切る)の対照では ${fmt(c.ctlLedger, 2)} まで落ちる`
  + ` — 残差の主因は既存の E9 減衰の実装であって、本便の機構でも壁/放射の帳簿でもない`);
say(`  判定 = ${okC ? 'PASS' : 'FAIL'}\n`);

say('=== まとめ ===');
for (const [nm, ok] of P) say(`  ${ok ? 'PASS' : 'FAIL'}  ${nm}`);
const allOk = P.every(x => x[1]);
say(`  ${allOk ? 'ALL PASS' : 'FAIL あり'}(3対 ${P.filter(x => x[1]).length}/3)`);

const outDir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'exp-45-phase.json'),
  JSON.stringify({ pairs: P.map(([nm, ok]) => ({ name: nm, pass: ok })), cycles: cyc, raw: R }, null, 1));
say('\n→ tests/out/exp-45-phase.json');
process.exit(allOk ? 0 : 1);
