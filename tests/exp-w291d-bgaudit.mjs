// 第291便d(原仮定者の裁定(第81報)⑥「『静止背景相当』『背景慣性決定力』は慣性系で織り込み済みかを精査」・統括の検証項目 R135)——
// **背景の精査の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジンの関数そのものを呼ぶ)。
//
// ■ 結論を先に(docs/PHYSICS.md〔第291便d〕の精査表の出所)
//   新しい慣性決定力の核(第290便c・dfmInertialDragStep: u_i=C_d Σ_{j≠i} m_j r_ij/(r_ij²+ε²)² (V_j−V_i)・x+=u·dt)は
//   Wbg・backgroundComplex・spaceMesh.D0・D₀・q・粒子の自転を**読まない**。(a) 全粒子に共通の一様並進は V_j−V_i で消える
//   (相対核では既に消える —— 背景抵抗を再度足さない)。(b) 旧正規化 u=A/W 型の場(E6′・geoPN=3 旧法則版・Jeans の χ)では
//   Wbg が分母に残り、背景の勾配が 0 でも局所応答が変わる —— 「微分すると背景が消える」は一定の**加算**場の話で、旧正規化式には
//   当てはまらない。**したがって「織り込み済み」ではなく、新核では Wbg を使わないという法則・参照系の宣言である(証明ではない)。**
//   (c) 回転・潮汐(位置に比例する速度場)の座標変換項は一様並進と違い一般に残る。一様な加速度は 1 步の中では共通の速度差として消える。
//
// ■ 何を測るか
//   (A) 並進: ① 2 進の固定配置(座標・移動ベクトル・共通の速度が 2 進で正確)でエンジンの 1 步の u がビット同一 ②走行中の実状態
//       (🐌・🌚 と 🌒 の診断コピー〔器の中で law:"inertial" を足した写し〕)で、直近の步の標本の V に共通の c を足して読み手
//       inertialDragFieldAt(粒子の受け手 —— 核とビット同一であることも照合)で u を引き直した差(器が宣言する丸め床以内)。
//   (B) 旧正規化の場: 共通場の読み手 dfmFieldContract(u=N/(W_bg+ΣW))で W_bg を変えると同じ点の u と χ が変わる・
//       dfmField の ∇D は D₀ を変えてもビット同一(一定の加算場の勾配は背景を含まない)。
//   (C) 新核は背景を読まない: 同じ固定配置を D₀・D0pull・q・粒子の自転・backgroundComplex・physics.spaceMesh の D0 を変えた宣言で
//       build し、エンジンの 1 步の u・次数がビット同一。
//   (D) 座標変換項: 固定配置の V に一様並進 / 一様加速度(1 步の中では一様な速度差)/ 剛体回転 Ω ẑ×x / 潮汐(対称・トレース 0 の
//       線形場 T·x)を足したときの u の相対変化(並進・加速度は丸め床以内・回転・潮汐は O(1) で残る)。
//   (E) 静的: 核 dfmInertialDragStep と読み手 inertialDragFieldAt の本文(コメント・文字列を除く)に背景・q・自転の名前が無く、
//       最上位関数の呼び出し閉包に背景の関数が無い。wbgStateOf の呼び出し閉包に新核が無い。
//
// ■ しないこと・言わないこと
//   ・「背景は織り込み済み(証明済み)」「geoPN=3 が GR と同値」「新しい法則が正しい」と書かない。新核に Wbg や backgroundComplex を
//     「適用済み」と表示しない。核・時計・光の式は 1 文字も変えない(読むだけ)。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w291d-bgaudit.mjs
// 読む正本: なし。正本: tests/out/bgaudit-w291d.json(target = beta/index.html —— 領域 REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs, parseTopLevel } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["charonGeoToy3","galaxyAnalogyBH","inertialDragPair"],"roots":["$","HP.REL_DRAG_INERTIAL_VERSION","HP.SPACE_MESH_SAMPLER_VERSION","HP.allPresets","HP.dfmField","HP.dfmFieldContract","HP.dfmInertialDragStep","HP.dfmMeshVelocityFieldAt","HP.inertialDragEpoch","HP.inertialDragFieldAt","HP.inertialDragFieldReady","HP.inertialDragState","HP.sim","HP.validatePreset","T","bgToyOf","bgWbgOf","bgcState","bgcWireState","cw","dfmField","dfmFieldContract","dfmInertialDragStep","dragTransG","frameWeightIsPull","frameWeightPow","inertialDragFieldAt","inertialDragFieldReady","inertialDragInit","inertialDragState","sim","validateBackgroundComplex","validatePreset","wbgStateOf"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w291d-bgaudit-1';
export const LIVE_IDS = Object.freeze(['inertialDragPair', 'galaxyAnalogyBH', 'charonGeoToy3']);
// 🌚・🌒 は慣性決定力を宣言していないので、器の中だけで law:"inertial" を足した**診断コピー**を作る(内蔵は 1 文字も変えない)。
//   gain は上界 2·max deg ≪ 1 を満たす宣言値(器の中の写しだけ —— 正本に上界を記録する)
export const LIVE = Object.freeze({ steps: 240, dt: 0.016, gainCopy: { galaxyAnalogyBH: 1e-4, charonGeoToy3: 1e-3 }, shifts: [[0.375, -2.125], [1e-3, 2e-3], [40, -25]] });
const ULP = 2 ** -52;
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) return { err: JSON.stringify(v.errors || v.err).slice(0, 240) };
  HP.sim.build(v.preset);
  return { S: HP.sim };
}
const toyPhysics = (extra) => Object.assign({ G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0001, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, stateCarry: 'double', massPrecision: 'double' }, extra || {});
const toyPreset = (bodies, phys) => ({ id: 'w291dToy', name: 'w291d toy', description: '器の中の写し(内蔵ではない)', emoji: '·', group: '運動と時空',
  sampleClass: 'principle', fidelity: 'toy', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: toyPhysics(phys), bodies });

/* ── 2 進の固定配置(座標・V・共通の速度がすべて 2 進で正確 —— 差 (V_j+c)−(V_i+c) が丸めなしで V_j−V_i になる) ── */
export const FIX = Object.freeze({ m: [1, 2.5, 0.75, 4, 1.5], x: [0, 3, -2.5, 1.25, 6], y: [0, 1, 2, -4, -1.5],
  V: [[0.5, -0.25], [1.75, 0.5], [-1, 0.75], [0.25, 1.25], [-0.5, -1.5]], gain: 0.75, eps: 0.5, t: 8, dt: 1 / 64 });
function inject(HP, o, physExtra, bodyExtra) {
  const bodies = o.m.map((m, i) => Object.assign({ type: 'single', m, radius: 0.1, x: o.x[i], y: o.y[i], vx: 0.125 * i, vy: -0.0625 * i, spin: 0, pinned: false }, bodyExtra ? bodyExtra(i) : {}));
  const b = build(HP, toyPreset(bodies, Object.assign({ relativeDrag: { law: 'inertial', gain: o.gain, eps: o.eps } }, physExtra || {})));
  if (b.err) return { err: b.err };
  const S = b.S;
  for (let i = 0; i < S.n; i++) { S.x[i] = o.x[i]; S.y[i] = o.y[i]; S.rdPrevX[i] = o.x[i] - o.V[i][0] * o.dt; S.rdPrevY[i] = o.y[i] - o.V[i][1] * o.dt; S.rdPrevT[i] = o.t - o.dt; }
  S.t = o.t; S.rdEpoch = HP.inertialDragEpoch(S);
  const ret = HP.dfmInertialDragStep(S, o.dt);
  const u = [], V = [], deg = [];
  for (let i = 0; i < S.n; i++) { u.push([S._rdUX[i], S._rdUY[i]]); V.push([S._rdVX[i], S._rdVY[i]]); deg.push(S._rdDeg[i]); }
  return { S, ret, u, V, deg };
}
const bitVec = (A, B) => A.length === B.length && A.every((z, i) => Object.is(z[0], B[i][0]) && Object.is(z[1], B[i][1]));
const relVec = (A, B) => { let num = 0, den = 0; for (let i = 0; i < A.length; i++) for (let k = 0; k < 2; k++) { num = Math.max(num, Math.abs(A[i][k] - B[i][k])); den = Math.max(den, Math.abs(B[i][k])); } return num / Math.max(den, 1e-300); };

/* ── (A) 並進 ─────────────────────────────────────────────────────────── */
export function translationDyadic(HP) {
  const base = inject(HP, FIX);
  const rows = [];
  for (const c of [[0.375, -2.125], [-8, 16], [0.0078125, 0.5]]) {
    const tr = inject(HP, Object.assign({}, FIX, { V: FIX.V.map((z) => [z[0] + c[0], z[1] + c[1]]) }));
    rows.push({ c, Vexact: tr.V.every((z, i) => z[0] === FIX.V[i][0] + c[0] && z[1] === FIX.V[i][1] + c[1]), bitSame: bitVec(base.u, tr.u), relMax: relVec(tr.u, base.u) });
  }
  // 読み手(粒子の受け手 —— opt.skip)が核の u とビット同一
  const samplerSame = FIX.m.every((_, i) => { const q = HP.inertialDragFieldAt(base.S, 0, 0, { skip: i }); return q && Object.is(q.u[0], base.u[i][0]) && Object.is(q.u[1], base.u[i][1]); });
  return { decl: FIX, rows, samplerSame, ok: base.ret.hist === true && samplerSame && rows.every((r) => r.Vexact && r.bitSame) };
}
function liveSim(HP, id) {
  const p = clone(find(HP, id));
  const copy = !(p.physics && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial');
  if (copy) p.physics.relativeDrag = { law: 'inertial', gain: LIVE.gainCopy[id], pairs: 'all', history: 'positions' };
  const b = build(HP, p);
  if (b.err) return { id, copy, err: b.err };
  const S = b.S;
  for (let k = 0; k < LIVE.steps; k++) S.step(LIVE.dt);
  return { id, copy, S, gain: p.physics.relativeDrag.gain };
}
export function translationLive(HP) {
  const G = globalThis;
  const rows = [];
  for (const id of LIVE_IDS) {
    const L = liveSim(HP, id);
    if (L.err) { rows.push({ id, copy: L.copy, err: L.err, ok: false }); continue; }
    const S = L.S, n = S.n;
    const ready = HP.inertialDragFieldReady(S);
    const st = HP.inertialDragState(S);
    const wbg = G['wbgStateOf'](S);
    const recv = []; for (let i = 0; i < n; i++) if (S.m[i] > 0 && !(S.pinned && S.pinned[i])) recv.push(i);
    const u0 = recv.map((i) => HP.inertialDragFieldAt(S, 0, 0, { skip: i }).u);
    const VX = Float64Array.from(S._rdVX), VY = Float64Array.from(S._rdVY);
    let vAbs = 0, duMin = Infinity;
    for (let i = 0; i < n; i++) vAbs = Math.max(vAbs, Math.abs(VX[i]), Math.abs(VY[i]));
    const sh = [];
    for (const c of LIVE.shifts) {
      for (let i = 0; i < n; i++) { S._rdVX[i] = VX[i] + c[0]; S._rdVY[i] = VY[i] + c[1]; }
      const u1 = recv.map((i) => HP.inertialDragFieldAt(S, 0, 0, { skip: i }).u);
      let bit = 0, num = 0, den = 0;
      u1.forEach((z, k) => { if (Object.is(z[0], u0[k][0]) && Object.is(z[1], u0[k][1])) bit++;
        for (let a = 0; a < 2; a++) { num = Math.max(num, Math.abs(z[a] - u0[k][a])); den = Math.max(den, Math.abs(u0[k][a])); } });
      // 丸め床(器の宣言): 1 項の差 (V_j+c)−(V_i+c) の誤差は 2 ulp(|V|+|c|) 以下 —— 和の重み Σa を掛けた絶対の床を u の尺度で割る
      let degMax = 0; for (const i of recv) degMax = Math.max(degMax, S._rdDeg[i]);
      const floorAbs = 4 * ULP * (vAbs + Math.hypot(c[0], c[1])) * degMax;
      sh.push({ c, receivers: recv.length, bitSame: bit, absMax: num, uScale: den, relMax: num / Math.max(den, 1e-300), floorAbs, withinFloor: num <= floorAbs });
      for (let i = 0; i < n; i++) { S._rdVX[i] = VX[i]; S._rdVY[i] = VY[i]; }   // 標本を元へ(以後この sim は使わない)
    }
    const restored = Array.from(S._rdVX.slice(0, n)).every((v, i) => Object.is(v, VX[i]));
    rows.push({ id, copy: L.copy, gain: L.gain, n, steps: LIVE.steps, dt: LIVE.dt, ready: ready.ready, readySame: ready.same, readyChecked: ready.checked,
      boundMax: st ? st.boundMax : null, boundOver: st ? st.boundOver : null, Wbg: wbg ? wbg.Wbg : null, WbgFrom: wbg ? wbg.from : null,
      vAbsMax: vAbs, shifts: sh, restored, ok: ready.ready && restored && sh.every((r) => r.withinFloor) && st && st.boundOver === 0 });
  }
  return { decl: LIVE, rows, ok: rows.every((r) => r.ok) };
}

/* ── (B) 旧正規化 u=A/W 型の場: W_bg が分母に残る ───────────────────────── */
export const OLDFIELD = Object.freeze({ bodies: [{ id: 0, m: 10, x: -1.8181818181818181, y: 0, vx: -0.0006741998624632421, vy: -0.06741998624632421, ax: 0, ay: 0 },
  { id: 1, m: 1, x: 18.181818181818183, y: 0, vx: 0.00674199862463242, vy: 0.674199862463242, ax: 0, ay: 0 }],
  points: [[8, 3], [18.181818181818183, 2], [-1.8181818181818181, 6]], Wbgs: [0, 0.006, 0.5, 2, 10], p: 1, eps: 0.05 });
export function oldNormalised(HP) {
  const rows = [];
  for (const pt of OLDFIELD.points) {
    const per = OLDFIELD.Wbgs.map((Wbg) => { const r = HP.dfmFieldContract(OLDFIELD.bodies, pt[0], pt[1], { p: OLDFIELD.p, eps: OLDFIELD.eps, Wbg, WbgFrom: 'external', sources: 'all', velocity: 'v', spin: 'none', fit: 'mean', background: 'static', need: 'u' });
      return { Wbg, u: r ? r.u : null, chi: r ? r.chi : null, W: r ? r.W : null }; });
    const u0 = per[0].u, mag0 = Math.hypot(u0[0], u0[1]);
    for (const q of per) q.relToWbg0 = Math.hypot(q.u[0] - u0[0], q.u[1] - u0[1]) / mag0;
    // 加算場: D=D₀+Σw の勾配は D₀ を変えてもビット同一(dfmField の gradD —— 一定の背景は微分で消える)
    const gd = OLDFIELD.Wbgs.map((D0) => { const r = HP.dfmField(OLDFIELD.bodies, pt[0], pt[1], { lawVersion: 'scalar', background: 'static', D0, eps: OLDFIELD.eps, p: OLDFIELD.p, G: 1, need: 'gravity' }); return r ? r.gradD : null; });
    const gradSame = gd.every((g) => g && Object.is(g[0], gd[0][0]) && Object.is(g[1], gd[0][1]));
    rows.push({ point: pt, rows: per, gradD: gd[0], gradDSameAcrossD0: gradSame,
      uChanges: per.slice(1).every((q) => q.relToWbg0 > 1e-6), chiFalls: per.every((q, k) => k === 0 || q.chi < per[k - 1].chi) });
  }
  return { decl: OLDFIELD, rows, ok: rows.every((r) => r.gradDSameAcrossD0 && r.uChanges && r.chiFalls) };
}

/* ── (C) 新核は背景・q・自転を読まない ───────────────────────────────── */
export function kernelIgnores(HP) {
  const pBgc = find(HP, 'charonGeoToy3').physics.backgroundComplex;
  const pSm = find(HP, 'galaxyAnalogyBH').physics.spaceMesh;
  const variants = [
    { key: 'base', phys: {} },
    { key: 'D0=0', phys: { D0: 0 } },
    { key: 'D0=50', phys: { D0: 50 } },
    { key: 'D0pull=7 (frameWeight:pull)', phys: { frameWeight: 'pull', D0pull: 7 } },
    { key: 'q=11.9386', phys: { q: 11.9386 } },
    { key: 'spin=0.3 (all bodies)', phys: {}, body: () => ({ spin: 0.3 }) },
    { key: 'backgroundComplex (🌒 の宣言)', phys: { backgroundComplex: clone(pBgc) } },
    { key: 'spaceMesh+D0=0.75 (🌚 の宣言・geoPN=3)', phys: { geoPN: 3, spaceMesh: Object.assign(clone(pSm), { D0: 0.75 }) } },
  ];
  const ref = inject(HP, FIX);
  const rows = variants.map((v) => {
    const r = inject(HP, FIX, v.phys, v.body);
    if (r.err) return { variant: v.key, accepted: false, err: r.err };
    const G = globalThis, wb = G['wbgStateOf'](r.S);
    return { variant: v.key, accepted: true, hist: r.ret.hist, uBitSame: bitVec(r.u, ref.u), degBitSame: r.deg.every((d, i) => Object.is(d, ref.deg[i])), Wbg: wb.Wbg, WbgFrom: wb.from };
  });
  const acc = rows.filter((r) => r.accepted);
  return { rows, accepted: acc.length, ok: acc.length >= 6 && acc.every((r) => r.hist === true && r.uBitSame && r.degBitSame) && new Set(acc.map((r) => r.Wbg)).size >= 3 };
}

/* ── (D) 座標変換項: 何が消え、何が残るか ─────────────────────────────── */
export function frameTerms(HP) {
  const base = inject(HP, FIX);
  const add = (f) => inject(HP, Object.assign({}, FIX, { V: FIX.V.map((z, i) => { const d = f(FIX.x[i], FIX.y[i]); return [z[0] + d[0], z[1] + d[1]]; }) }));
  const tau = FIX.t;   // 一様加速度 a の系: 1 步の中では全粒子に同じ速度差 −a·τ(τ = 標本の時刻)が乗る
  const cases = [
    { key: 'uniformTranslation', f: () => [0.375, -2.125] },
    { key: 'uniformAcceleration', f: () => [-0.25 * tau, 0.125 * tau] },
    { key: 'rigidRotation', f: (x, y) => [-0.5 * y, 0.5 * x] },
    { key: 'tidalLinear', f: (x, y) => [0.25 * x + 0.125 * y, 0.125 * x - 0.25 * y] },
  ];
  const rows = cases.map((c) => { const r = add(c.f); return { key: c.key, bitSame: bitVec(r.u, base.u), relChange: relVec(r.u, base.u) }; });
  const by = Object.fromEntries(rows.map((r) => [r.key, r]));
  return { rows, ok: by.uniformTranslation.bitSame && by.uniformAcceleration.bitSame && by.rigidRotation.relChange > 1e-3 && by.tidalLinear.relChange > 1e-3 };
}

/* ── (E) 静的: 核と読み手が背景を読まない・wbgStateOf が新核を読まない ─────── */
const FORBID_TOKENS = /\.D0\b|\.D0pull\b|\bWbg\b|backgroundComplex|BG_COMPLEX_KEY|\.q\b|\.spin\b|\.dragQ\b|spaceMesh|\.sumW\b/;
const FORBID_FUNCS = ['bgWbgOf', 'wbgStateOf', 'bgToyOf', 'validateBackgroundComplex', 'dfmFieldContract', 'dfmField', 'frameWeightPow', 'frameWeightIsPull', 'dragTransG', 'bgcState', 'bgcWireState'];
const INERTIAL_FUNCS = ['dfmInertialDragStep', 'inertialDragFieldAt', 'inertialDragFieldReady', 'inertialDragInit', 'inertialDragState'];
export function staticRefs(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
  const PT = parseTopLevel(src);
  const fnSeg = new Map();
  for (const s of PT.segments) if (s.kind === 'function') fnSeg.set(s.names[0], s);
  const callClosure = (root) => {
    const seen = new Set([root]), q = [root];
    while (q.length) { const s = fnSeg.get(q.shift()); if (!s) continue;
      for (const m of s.codeText.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)) if (fnSeg.has(m[1]) && !seen.has(m[1])) { seen.add(m[1]); q.push(m[1]); } }
    return [...seen].sort();
  };
  const rows = [];
  for (const nm of ['dfmInertialDragStep', 'inertialDragFieldAt']) {
    const s = fnSeg.get(nm);
    const hits = s ? [...new Set((s.codeText.match(new RegExp(FORBID_TOKENS.source, 'g')) || []))] : ['(関数が無い)'];
    const cl = callClosure(nm);
    rows.push({ fn: nm, tokensFound: hits, callClosure: cl, forbiddenInClosure: cl.filter((f) => FORBID_FUNCS.includes(f)) });
  }
  const wcl = callClosure('wbgStateOf');
  const wbg = { fn: 'wbgStateOf', callClosure: wcl, inertialInClosure: wcl.filter((f) => INERTIAL_FUNCS.includes(f)), mentionsRelDrag: /relDrag|relativeDrag/.test((fnSeg.get('wbgStateOf') || {}).codeText || '') };
  return { forbidTokens: FORBID_TOKENS.source, forbidFuncs: FORBID_FUNCS, rows, wbg,
    ok: rows.every((r) => r.tokensFound.length === 0 && r.forbiddenInClosure.length === 0) && wbg.inertialInClosure.length === 0 && !wbg.mentionsRelDrag };
}

export function computeAll(HP, htmlPath) {
  return { translationDyadic: translationDyadic(HP), translationLive: translationLive(HP), oldNormalised: oldNormalised(HP),
    kernelIgnores: kernelIgnores(HP), frameTerms: frameTerms(HP), staticRefs: staticRefs(htmlPath) };
}
const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
/** PHYSICS〔第291便d〕の精査表の行(QA docs.bgAuditTable が照合する —— 数値は正本から作る)。 */
export function bgAuditRows(J) {
  const L = J.translationLive.rows, O = J.oldNormalised.rows[0], ft = Object.fromEntries(J.frameTerms.rows.map((r) => [r.key, r]));
  const kAcc = J.kernelIgnores.rows.filter((r) => r.accepted);
  const kBits = kAcc.filter((r) => r.uBitSame && r.degBitSame).length;
  const wMax = O.rows[O.rows.length - 1];
  const liveN = L.filter((r) => r.ok).length;
  return [
    `| 重力背景 D₀ | 一様な決定力の加算(時計 ψ と光の n に入る・勾配は 0) | **読まない**(核の本文に D₀ が無い)。D₀=0/2/50 で 1 步の u がビット同一(D₀・D0pull・q・自転・backgroundComplex・spaceMesh.D0 を変えた宣言 ${kBits}/${kAcc.length}) |`,
    `| 静止背景相当 Wbg | 旧正規化 u=A/W の分母(E6′・geoPN=3 旧法則版・Jeans の χ) | **読まない**。旧正規化の場では W_bg=0→${wMax.Wbg} で同じ点の u が相対 ${f3(wMax.relToWbg0)} 変わる(∇D はビット同一) —— 「微分で消える」のは加算場だけ |`,
    `| backgroundComplex | 宣言専用の背景(meshVelocity の field:"backgroundComplex" を宣言した本だけが読む) | **読まない**(宣言しても 1 步の u がビット同一)。適用済みとは表示しない |`,
    `| 共通並進 | 全粒子に同じ速度 c を足す | **消える**(V_j−V_i)。2 進の配置でビット同一・走行中の実状態 ${liveN}/${L.length} 本(🐌 と 🌚🌒 の診断コピー)で丸め床 4 ulp·(|V|+|c|)·Σa 以内 |`,
    `| 一様加速度 | 1 步の中では全粒子に同じ速度差 | **消える**(1 步の u がビット同一)。重力側の慣性力は核の外の話 |`,
    `| 回転 | 剛体回転 Ω ẑ×x の座標変換 | **残る**(u の相対変化 ${f3(ft.rigidRotation.relChange)})—— 取り除いていない |`,
    `| 潮汐 | 位置に比例する速度場 T·x(対称・トレース 0) | **残る**(u の相対変化 ${f3(ft.tidalLinear.relChange)})—— 取り除いていない |`,
  ];
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W291D_BGAUDIT_OUT || path.join(ROOT, 'tests', 'out', 'bgaudit-w291d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP, path.join(ROOT, TARGET));
  const D = R.translationDyadic; console.log(`(A1) 2 進の配置: ${D.rows.map((r) => `c=${r.c} ビット同一 ${r.bitSame}`).join('・')}・読み手=核 ${D.samplerSame} → ${D.ok}`);
  for (const r of R.translationLive.rows) console.log(`(A2) ${r.id}${r.copy ? '(診断コピー gain ' + r.gain + ')' : ''}: ${r.err || `ready ${r.ready}(${r.readySame}/${r.readyChecked})・Wbg ${r.Wbg}(${r.WbgFrom})・上界 ${f3(r.boundMax)}・` + r.shifts.map((s) => `c=${s.c} ビット ${s.bitSame}/${s.receivers}・差 ${f3(s.absMax)}(床 ${f3(s.floorAbs)})`).join(' / ')} → ${r.ok}`);
  for (const r of R.oldNormalised.rows) console.log(`(B) 点 ${r.point}: ` + r.rows.map((q) => `Wbg ${q.Wbg}: χ ${q.chi.toFixed(4)}・相対変化 ${f3(q.relToWbg0)}`).join(' / ') + `・∇D 同一 ${r.gradDSameAcrossD0}`);
  for (const r of R.kernelIgnores.rows) console.log(`(C) ${r.variant}: ${r.accepted ? `u ビット同一 ${r.uBitSame}・次数 ${r.degBitSame}・Wbg ${r.Wbg}(${r.WbgFrom})` : '受理されない ' + r.err}`);
  for (const r of R.frameTerms.rows) console.log(`(D) ${r.key}: ビット同一 ${r.bitSame}・相対変化 ${f3(r.relChange)}`);
  const ST = R.staticRefs; console.log(`(E) ` + ST.rows.map((r) => `${r.fn}: 名前 ${r.tokensFound.length}・閉包 ${r.callClosure.length} 関数・背景の関数 ${r.forbiddenInClosure.length}`).join(' / ') + ` / wbgStateOf の閉包に新核 ${ST.wbg.inertialInClosure.length} → ${ST.ok}`);
  const CODE = ['tests/exp-w291d-bgaudit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第291便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, samplerVersion: HP.SPACE_MESH_SAMPLER_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第81報)⑥「静止背景相当」「背景慣性決定力」は慣性系で織り込み済みかを精査',
    reading: '統括の検証項目 R135(物理不変 —— 核・時計・光の式は読むだけ。表示メッシュは表示専用)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    conclusion: '新核では Wbg を使わないという法則・参照系の宣言である(証明ではない)。旧正規化 u=A/W 型の場では Wbg が分母に残る。共通並進・一様加速度は 1 步の中で消え、回転・潮汐は残る',
    notClaim: ['背景は織り込み済み(証明済み)', 'geoPN=3 が GR と同値', '新しい法則が正しい', '新核に Wbg を適用済み'] });
  const out = { meta, ...R };
  out.auditRows = bgAuditRows(out);
  out.ok = R.translationDyadic.ok && R.translationLive.ok && R.oldNormalised.ok && R.kernelIgnores.ok && R.frameTerms.ok && R.staticRefs.ok;
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  for (const r of out.auditRows) console.log(r);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
