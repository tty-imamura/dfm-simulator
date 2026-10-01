// 第289便c(原仮定者の裁定(第79報)⑤「高密度表面の手前/反対の逆転で回転引きずり」・第79報で閉じた AN98/AN99・統括の検証項目 R121)——
// **有限サイズ回転源の手前/反対**の核と**門(C=0 で既存の u とビット同一)**の器(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む・**エンジン未接続**)。
//
// ■ 何を測るか
//   (A) 純関数 tests/lib-w289c-nearfar.mjs の単体(d ≤ R の拒否・閉じた式・向き・面内の軸で z だけ・Ω=0)と遠方の冪(10R〜100R の log-log:
//       手前/反対 −4・rotlet 型 −2 —— 床は lib の POWER_FLOOR の宣言)。
//   (B) 同じ点で並べる: 🧩 galaxyAnalogyBHCompose の中心(m・R・Ω=spin・ε=softening)の +x 側 r=20 で、場の契約の自転の寄与 uSpin(第288便c の 3.43)と
//       rotlet 型(J=½mR²Ω ẑ・β=G/c² —— 0.725)を**正本 compose-w288c.json と照合して再現**してから、手前/反対の u_φ(C=1 あたり)を置く。
//       円周 20〜480 と 10R〜100R で 3 つの減衰の形(r=20 で割った比)と冪。**C は宣言しない**(由来は決断事項 —— どれが正しいとも言わない)。
//   (C) 門(AN99): 🧩 の初期状態と 150・300 步の状態で、全自由粒子の既存の u(`HP.dfmFieldContract` の toy の宣言 —— 第288便c の合成評価器の
//       inline 形ともビット一致)に、手前/反対の候補(中心だけ)と相対移動 r⁻³ 核の候補(全粒子・prevMove = その步の v)を `addCandidate` で
//       C=0 として通した値が**ビット同一**(Object.is)。C≠0 では値が動く(門が空でない)。評価の前後でエンジンの状態は 1 bit も変わらない。
//
// ■ しないこと・言わないこと
//   ・既存の q 付き場・u=A/W・E6′ に足さない。エンジンへ接続しない(html に候補の関数が無いことを QA が見る)。C≠0 を星団の門が通るように調整しない。
//   ・「回転引きずりが創発した」「連鎖で円盤ができた」「複素場を接続した」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w289c-nearfar.mjs
// 読む正本: tests/out/compose-w288c.json(r=20 の 2 値の再現の照合 —— 鎖では compose288 の後)。正本: tests/out/nearfar-w289c.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as NF from './lib-w289c-nearfar.mjs';
import * as RD from './lib-w289c-reldrag.mjs';
import * as LR from './lib-w288c-rotlet.mjs';
import * as LC from './lib-w288c-compose.mjs';
const REGEN_SCOPE = {"presets":["galaxyAnalogyBHCompose"],"roots":["$","DT","HP.allPresets","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmMeshVelocityFieldAt","HP.frameWeightPow","HP.sim","HP.validatePreset","cw","dfmFieldContract","sim","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289c-nearfar-1';
export const DT = 0.016;
export const COPY_ID = 'galaxyAnalogyBHCompose';
export const GATE_STEPS = Object.freeze([0, 150, 300]);
export const RING = Object.freeze([20, 40, 80, 120, 240, 480]);
export const C_PROBE = 1e-3;          // 門が空でないことを見るだけの非 0 の利得(宣言値ではない —— 物理の主張に使わない)
export const COMPOSE_JSON = 'tests/out/compose-w288c.json';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, id) {
  const v = HP.validatePreset(clone(find(HP, id)));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors)).slice(0, 300) };
  HP.sim.build(v.preset);
  return { ok: true, S: HP.sim, preset: v.preset };
}
function bodiesOf(S) {
  const B = [];
  for (let i = 0; i < S.n; i++) B.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0, spin: S.spin[i], R: S.R[i], omegaDot: 0, pinned: S.pinned[i] === 1 });
  return B;
}
function stateHash(S) {
  const h = crypto.createHash('sha256'), f = new Float64Array(7);
  for (let i = 0; i < S.n; i++) { f[0] = S.x[i]; f[1] = S.y[i]; f[2] = S.vx[i]; f[3] = S.vy[i]; f[4] = S.spin[i]; f[5] = S.m[i]; f[6] = S.R[i]; h.update(Buffer.from(f.buffer)); }
  h.update(String(S.t)); return h.digest('hex');
}
const centerIdx = (preset) => +preset.bgCompose.center.ref.replace('body:', '');

/** (B) 同じ点で並べる。 */
export function profiles(HP, composeJ) {
  const b = build(HP, COPY_ID), S = b.S, B = bodiesOf(S), k0 = centerIdx(b.preset), c0 = B[k0];
  const ctr = HP.dfmFieldContractOf(S, 'toy').contract, P = S.params;
  const I = 0.5 * c0.m * c0.R * c0.R, Jz = I * c0.spin, betaG = LR.betaOf(P.G, P.cLight), eps = P.softening;
  const at = (rr) => {
    const f = HP.dfmFieldContract(B, c0.x + rr, c0.y, Object.assign({}, ctr, { excludeBodyId: null }));
    const ur = LR.rotletU([0, 0, Jz], [rr, 0, 0], betaG, eps);
    const nf = NF.nearFarAt({ x: [c0.x + rr, c0.y, 0], c: [c0.x, c0.y, 0], R: c0.R, Omega: c0.spin, axis: [0, 0, 1], m: c0.m, gain: 1, eps });
    return { r: rr, uSpinContract: f ? f.uSpin[1] : null, uRotlet: ur[1], uNearFarPerC: nf.ok ? nf.u[1] : null, nearFarOk: nf.ok };
  };
  const ring = RING.map(at);
  const r0 = ring[0];
  for (const z of ring) z.norm = { contract: z.uSpinContract / r0.uSpinContract, rotlet: z.uRotlet / r0.uRotlet, nearFar: z.uNearFarPerC / r0.uNearFarPerC };
  const far = NF.farRadii(c0.R).map(at);
  const sl = (key) => NF.slopeLogLog(far.map((z) => z.r), far.map((z) => z[key]));
  const slopes = { range: [far[0].r, far[far.length - 1].r], contract: sl('uSpinContract'), rotlet: sl('uRotlet'), nearFar: sl('uNearFarPerC') };
  // 再現(第288便c の正本 compose-w288c.json の rotlet.comparator.rows の r=20 —— 解析量なので相対 1e-12)
  const ref = composeJ && composeJ.rotlet && composeJ.rotlet.comparator ? composeJ.rotlet.comparator.rows.find((z) => z.r === 20) : null;
  const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
  const reproduce = ref ? { ref: { uSpinContract: ref.uSpinContract, uRotlet: ref.uRotlet }, now: { uSpinContract: r0.uSpinContract, uRotlet: r0.uRotlet },
    relContract: rel(r0.uSpinContract, ref.uSpinContract), relRotlet: rel(r0.uRotlet, ref.uRotlet) } : null;
  if (reproduce) reproduce.ok = reproduce.relContract <= 1e-12 && reproduce.relRotlet <= 1e-12;
  // 内側の拒否(R 以内の点)
  const inside = NF.nearFarAt({ x: [c0.x + 0.5 * c0.R, c0.y, 0], c: [c0.x, c0.y, 0], R: c0.R, Omega: c0.spin, axis: [0, 0, 1], m: c0.m, gain: 1, eps });
  return { center: { idx: k0, m: c0.m, R: c0.R, Omega: c0.spin, eps, J: Jz, betaG }, ring, far: far.map((z) => ({ r: z.r, uSpinContract: z.uSpinContract, uRotlet: z.uRotlet, uNearFarPerC: z.uNearFarPerC })),
    slopes, reproduce, insideRejected: inside.ok === false && inside.why === 'inside',
    note: '手前/反対の u は利得 C あたり(C [L³/M] は宣言しない —— 減衰の形と冪だけを並べる・どれが正しいとも言わない)' };
}

/** (C) 門: C=0 で既存の u とビット同一。 */
export function gate(HP) {
  const b = build(HP, COPY_ID), S = b.S, k0 = centerIdx(b.preset), P = S.params;
  const ctr = HP.dfmFieldContractOf(S, 'toy').contract, decl = b.preset.bgCompose;
  const bg = { p: decl.background.p, W: decl.background.W, A: decl.background.A.slice() };
  const rows = [];
  let stepped = 0;
  for (const target of GATE_STEPS) {
    while (stepped < target) { S.step(DT); stepped++; }
    const h0 = stateHash(S), B = bodiesOf(S), c0 = B[k0];
    const m = B.map((z) => z.m), x = B.map((z) => z.x), y = B.map((z) => z.y), V = B.map((z) => [z.vx, z.vy]);
    const rd = RD.relDragAt({ m, x, y, prevMove: V, gain: 1, eps: P.softening });
    let nEval = 0, sameNF = 0, sameRD = 0, sameCompose = 0, inside = 0, movedNF = 0, movedRD = 0, contractNull = 0;
    for (let i = 0; i < S.n; i++) {
      if (B[i].pinned) continue;
      const f = HP.dfmFieldContract(B, B[i].x, B[i].y, Object.assign({}, ctr, { excludeBodyId: i }));
      if (!f) { contractNull++; continue; }
      nEval++;
      const cm = LC.composeAt({ bodies: B, p: ctr.p, eps: ctr.eps, background: bg, ledger: [{ ref: decl.center.ref }], spin: { mode: 'e6', q: ctr.q, centers: [k0] },
        self: i, px: B[i].x, py: B[i].y, order: 'inline' });
      if (cm.ok && Object.is(cm.u[0], f.u[0]) && Object.is(cm.u[1], f.u[1])) sameCompose++;
      const nf = NF.nearFarAt({ x: [B[i].x, B[i].y, 0], c: [c0.x, c0.y, 0], R: c0.R, Omega: c0.spin, axis: [0, 0, 1], m: c0.m, gain: 1, eps: P.softening });
      if (!nf.ok) inside++;
      const duNF = nf.ok ? [nf.u[0], nf.u[1]] : [0, 0], duRD = rd.ok ? rd.u[i] : [0, 0];
      const g1 = NF.addCandidate(f.u, duNF, 0), g2 = NF.addCandidate(f.u, duRD, 0);
      if (Object.is(g1[0], f.u[0]) && Object.is(g1[1], f.u[1])) sameNF++;
      if (Object.is(g2[0], f.u[0]) && Object.is(g2[1], f.u[1])) sameRD++;
      const p1 = NF.addCandidate(f.u, duNF, C_PROBE), p2 = NF.addCandidate(f.u, duRD, C_PROBE);
      if (!(p1[0] === f.u[0] && p1[1] === f.u[1])) movedNF++;
      if (!(p2[0] === f.u[0] && p2[1] === f.u[1])) movedRD++;
    }
    const h1 = stateHash(S);
    rows.push({ step: target, t: S.t, nEval, contractNull, sameNearFar: sameNF, sameRelDrag: sameRD, sameCompose, insideRejected: inside,
      movedNearFarAtProbe: movedNF, movedRelDragAtProbe: movedRD, relDragBound: rd.ok ? rd.spectralBound : null, stateUnchanged: h0 === h1 });
  }
  const ok = rows.every((z) => z.nEval > 0 && z.contractNull === 0 && z.sameNearFar === z.nEval && z.sameRelDrag === z.nEval && z.sameCompose === z.nEval
    && z.movedNearFarAtProbe > 0 && z.movedRelDragAtProbe > 0 && z.stateUnchanged);
  return { copy: COPY_ID, dt: DT, steps: GATE_STEPS, probeGain: C_PROBE, rows, ok,
    how: '既存の u = HP.dfmFieldContract(toy の宣言・excludeBodyId=i)。候補は C=1 で評価し addCandidate(u, du, C) に通す —— C=0 は u をそのまま写す' };
}

export function computeAll(HP, composeJ) {
  return { selfTest: NF.selfTest(), power: NF.powerTable(LR.rotletU), profiles: profiles(HP, composeJ), gate: gate(HP) };
}
const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(2);
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
/** PHYSICS〔第289便c〕の表の行(QA が照合する)。 */
export function docRows(J) {
  const out = { power: [], ring: [], gate: [] };
  for (const z of J.power.rows) out.power.push(`| ε=${z.eps} | ${f4(z.nearFar.fit)} | ${f4(z.nearFar.local100)} | ${f4(z.rotlet.fit)} | ${f4(z.rotlet.local100)} |`);
  for (const z of J.profiles.ring) out.ring.push(`| ${z.r} | ${f3(z.uSpinContract)} | ${f3(z.uRotlet)} | ${f3(z.uNearFarPerC)} | ${f3(z.norm.contract)} / ${f3(z.norm.rotlet)} / ${f3(z.norm.nearFar)} |`);
  for (const z of J.gate.rows) out.gate.push(`| ${z.step} | ${z.nEval} | ${z.sameNearFar}/${z.nEval} | ${z.sameRelDrag}/${z.nEval} | ${z.sameCompose}/${z.nEval} | ${z.insideRejected} | ${z.movedNearFarAtProbe} / ${z.movedRelDragAtProbe} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W289C_NEARFAR_OUT || path.join(ROOT, 'tests', 'out', 'nearfar-w289c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const composeJ = JSON.parse(fs.readFileSync(path.join(ROOT, COMPOSE_JSON), 'utf8'));
  const R = computeAll(HP, composeJ);
  console.log(`(A) 単体 ${R.selfTest.ok} ${JSON.stringify(R.selfTest.checks)}`);
  for (const z of R.power.rows) console.log(`(A) ε=${z.eps}: 手前/反対 当てはめ ${f4(z.nearFar.fit)}・100R ${f4(z.nearFar.local100)} / rotlet ${f4(z.rotlet.fit)}・${f4(z.rotlet.local100)}`);
  const Pz = R.profiles;
  console.log(`(B) 再現 r=20: 場の契約 ${Pz.reproduce.now.uSpinContract}(正本 ${Pz.reproduce.ref.uSpinContract})・rotlet ${Pz.reproduce.now.uRotlet}(正本 ${Pz.reproduce.ref.uRotlet})・ok ${Pz.reproduce.ok}`);
  console.log(`(B) 手前/反対(C あたり)r=20: ${Pz.ring[0].uNearFarPerC}・冪(${f2(Pz.slopes.range[0])}〜${f2(Pz.slopes.range[1])}): 契約 ${f4(Pz.slopes.contract)}・rotlet ${f4(Pz.slopes.rotlet)}・手前/反対 ${f4(Pz.slopes.nearFar)}`);
  for (const z of Pz.ring) console.log(`(B) r=${z.r}: ${f3(z.uSpinContract)} / ${f3(z.uRotlet)} / ${f3(z.uNearFarPerC)} 比 ${f3(z.norm.contract)}/${f3(z.norm.rotlet)}/${f3(z.norm.nearFar)}`);
  for (const z of R.gate.rows) console.log(`(C) 步 ${z.step}: 評価 ${z.nEval}・C=0 ビット同一 手前/反対 ${z.sameNearFar}・相対移動 ${z.sameRelDrag}・合成評価器 ${z.sameCompose}・内側 ${z.insideRejected}・C=${C_PROBE} で動く ${z.movedNearFarAtProbe}/${z.movedRelDragAtProbe}・状態不変 ${z.stateUnchanged}・上界(C_d=1) ${f3(z.relDragBound)}`);
  const CODE = ['tests/exp-w289c-nearfar.mjs', 'tests/lib-w289c-nearfar.mjs', 'tests/lib-w289c-reldrag.mjs', 'tests/lib-w288c-rotlet.mjs', 'tests/lib-w288c-compose.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便c', target: TARGET, code: CODE, inputs: [TARGET, COMPOSE_JSON] }), {
    harnessVersion: HARNESS_VERSION, libVersion: NF.NEARFAR_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第79報)⑤ DFM の整理と修正(高密度表面の手前/反対の逆転で回転引きずり・背景複素決定力は微分で消える)・第79報で閉じた AN98(面内の引きずりの主候補は有限サイズ回転源の手前/反対)/AN99(純関数と比較器だけ・門は C=0 で既存 u とビット同一)',
    reading: '統括の検証項目 R121(エンジン未接続・既存の q 付き場・u=A/W・E6′ に足さない・C≠0 を星団の門が通るように調整しない)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['回転引きずりが創発した', '連鎖で円盤ができた', '複素場を接続した', '新しい法則を実装した', '新発見'] });
  const out = { meta, ...R };
  out.ok = R.selfTest.ok && R.power.ok && !!(R.profiles.reproduce && R.profiles.reproduce.ok) && R.profiles.insideRejected && R.gate.ok;
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
