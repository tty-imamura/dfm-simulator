// 第285便a(原仮定者の裁定(第75報)④「環・星団・銀河などの多粒子サンプルでは粒子数を減らして近似している。粒子の偏りで中心天体が
// 想定外に動くため、中心天体は固定する。粒子同士の接触も現実より多くなるため、接触判定は無しとする。単体ではなく銀河同士の衝突などを
// 再現する場合は固定を外す。粒子同士の衝突や合体などを再現する場合は衝突判定を行う」・統括の検証項目 R95)—— **多粒子の契約**の器。
//
// ■ 契約(html)
//   ・`physics.contactMode`: "normal"(= 未指定と同じ既存挙動)/"none"(E9 の**全経路**を止める —— 特別化 2 経路 pairCorePlain・pairCorePN・
//     generic の対ループ・試験粒子の側 dfmTestParticleStep)。contactK=0 は法線ばねだけを消し、generic 経路の γn 減衰・μF 摩擦は残る。
//     接触ばねエネルギー(springUOf)は 0。fusion・phaseChange との併用は受理器で拒否。**既定 CONTACT_DEFAULT は変えない**。
//   ・中心固定は `pinned:true`(拘束が受け取った反作用は**別に記帳**する —— 粒子系単独の運動量保存を要求しない)。
//   ・群の `particleRadius`(個々の代表粒子の半径 —— 群の分布半径 radius とは別の欄。正の有限値・長さの値域)。
//
// ■ 何を測るか(Node だけ —— 💍💿 の量ごとの前後だけは、正本 calaudit がいまの html の世代でなければ判定器を --only で一時ファイルへ走らせる)
//   (A) 単体試験: 重なった二体(4 経路それぞれ)の vx が normal では変わり none では不変・スピン不変・ばねエネルギー 0・
//       未指定 ≡ "normal"(ビット一致)・contactK=0 だけでは γn/μF が残る・fusion/phaseChange 併用と不正値の拒否・particleRadius の受理と拒否。
//   (B) 既存の内蔵 142 本の 1 步: 基点 html と今の html で状態の指紋を比べ、違う本が宣言した本の部分集合であること。
//   (C) 拘束の反作用の記帳: pinned 中心 + 自由粒子(重力だけ)で、粒子系の運動量の変化 ΔP を拘束の反作用 J=−ΔP として別欄に記帳
//       (粒子系単独では保存しない)・中心を自由にした写しでは全運動量が丸めの範囲で保存。
//   (D) 適用表(R95): 宣言した本・中心固定・力学が変わるか(normal の写しとの N 步の指紋)と前後の量(半質量半径・外側の回転・分散・重なり対)。
//       衝突・合体が目的の本は normal のまま別条件として並べる(名前に「環」があるだけの本は変えない)。
//   (E) 💍💿: 量ごとの前後(第284便e の tpsign と同じ行の形 —— 前 = 基点の正本 calaudit、後 = いまの html の判定)。
//
// ■ しないこと・言わないこと
//   ・CONTACT_DEFAULT を変えない。宣言していない本の力学に触らない。「接触を外したので観測一致を達成した」「較正を完了した」と書かない。
//
// 実行: node tests/exp-w285a-contact.mjs(W285A_BASE_REV で基点を差し替え —— 既定 b92ffa1。💍💿 の後の判定を走らせるときだけ
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright が要る)
// 読む正本: tests/out/calaudit-w249.json(いまの html の世代なら —— 再生成表の after: calaudit・dt3・kf0)。正本: tests/out/contact-w285a.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { quantityRows, runOf } from './exp-w284e-tpsign.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","CONTACT_DEFAULT","CONTACT_MODES","CONTACT_MODE_KEY","DT","HP.allPresets","HP.coreState","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","LAWS","T","applyQLock","ch","chanSetup","clamp","contactCapOf","contactKOf","contactNoneOf","dfmTestParticleCore","dfmTestParticleStep","geoCoreDispatch","geoCoreDispatchBody","isNum","makeSim","pairChannelGrad","pairChannelOm","pairCorePN","pairCorePlain","presetSig","scaleExpT","springUOf","testParticlePrepare","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w285a-contact-1';
export const BASE_REV_DEFAULT = 'b92ffa1';
export const DT = 0.016;
export const APPLY_STEPS = 1500;

/**
 * **適用表(R95 —— 宣言は html、ここは照合の正本)**。role: cluster / shapeToy / galaxy / ring。
 * center: 'pinned'(中心 1 個を固定)/ 'none'(中心なしの版 —— 固定天体を足さない)/ 'saturn'(土星だけ固定・衛星は自由)。
 */
export const APPLIED = [
  { id: 'clusterAnalogyBH', emoji: '💮', role: 'cluster', center: 'pinned', note: '接触 0 済み(contactK:0)→ 明示の contactMode:"none" へ・群の particleRadius' },
  { id: 'shapeToyCluster', emoji: '🔮', role: 'shapeToy', center: 'none', note: '中心なしの版(固定天体を足さない)' },
  { id: 'shapeToyDisk', emoji: '🥏', role: 'shapeToy', center: 'none', note: '中心なしの版(固定天体を足さない)' },
  { id: 'shapeToyArm', emoji: '🧵', role: 'shapeToy', center: 'none', note: '中心なしの版(固定天体を足さない)' },
  { id: 'shapeToyClusterCore', emoji: '🎱', role: 'shapeToy', center: 'pinned', note: 'contactK/Cap 0/0 済み → 明示' },
  { id: 'shapeToyDiskCore', emoji: '📀', role: 'shapeToy', center: 'pinned', note: 'contactK/Cap 0/0 済み → 明示' },
  { id: 'shapeToyArmCore', emoji: '🧹', role: 'shapeToy', center: 'pinned', note: 'contactK/Cap 0/0 済み → 明示' },
  { id: 'galaxy', emoji: '🌌', role: 'galaxy', center: 'pinned', note: 'ばね 10/2・γn 0.4・μF 0.5 → 接触なし(力学が変わる)' },
  { id: 'galaxyGeo2', emoji: '💫', role: 'galaxy', center: 'pinned', note: 'ばね 10/2 → 接触なし(力学が変わる)' },
  { id: 'galaxyStd', emoji: '🎡', role: 'galaxy', center: 'pinned', note: '既定のばね 40/8 → 接触なし(E6′ だけの基準実験の趣旨どおり)' },
  { id: 'galaxyDB', emoji: '🍳', role: 'galaxy', center: 'pinned', declare: 'normal', trialNone: true,
    note: '契約は "normal" を明示(保留)—— none を宣言した版では bulge/disk 対比の claim(claim.galaxydb-contrast)の窓を外れた(枝の QA: 速度分散比 3.13〔窓 2.2〜3.0〕・|spin| 比 1.01〔窓 1.5〜2.4〕)' },
  { id: 'galaxyMeshSpiral', emoji: '🎠', role: 'galaxy', center: 'pinned', note: '既定のばね 40/8 → 接触なし' },
  { id: 'galaxyMeshSpiralGeoToy', emoji: '🪁', role: 'galaxy', center: 'pinned', note: '既定のばね 40/8 → 接触なし' },
  { id: 'galaxyAnalogyBH', emoji: '🌚', role: 'galaxy', center: 'pinned', note: '既定のばね 40/8 → 接触なし' },
  { id: 'saturnRingReal', emoji: '💍', role: 'ring', center: 'saturn', note: '土星だけ固定(既に)・衛星は自由・環は試験粒子 —— 接触を使わない較正条件の明示' },
  { id: 'saturnRingRealKF1', emoji: '💿', role: 'ring', center: 'saturn', note: '土星だけ固定(既に)・衛星は自由・環は試験粒子 —— 接触を使わない較正条件の明示' },
];
/** 衝突・合体・散逸そのものが目的の本 —— **normal のまま**(別の条件として記録するだけ・宣言しない)。 */
export const NORMAL_KEPT = [
  { id: 'selfRotor', emoji: '🥚', why: '融合(fusion)で中心が育つ —— 衝突判定が本題' },
  { id: 'gw150914Merge4s', emoji: '⏰', why: '融合(fusion)で合体する —— 衝突判定が本題' },
  { id: 'emergent', emoji: '🧬', why: '創発相変化(E14″ の芯は E9 の法線ばね)' },
  { id: 'emergent2', emoji: '🧊', why: '創発相変化(E14″)' },
  { id: 'chain2', emoji: '⛓️', why: '創発相変化(E14″)' },
  { id: 'chaincycle', emoji: '♻️', why: '創発相変化(E14″)' },
  { id: 'counterring', emoji: '💥', why: '順行・逆行リングの衝突そのものが本題(名前に「環」があるだけでは変えない)' },
  { id: 'saturn', emoji: '🪐', why: '環の衝突・散逸の実験(名前に「環」があるだけでは変えない)' },
  { id: 'saturnLayered', emoji: '🎯', why: '環の衝突・散逸の実験(主星 2 層)' },
  { id: 'collapse', emoji: '🌫️', why: '雲の崩壊と原始星形成(接触の散逸が本題)' },
];
export const RING_IDS = ['saturnRingReal', 'saturnRingRealKF1'];
/** 行の宣言(既定 "none")。 */
export const declOf = (A) => A.declare || 'none';

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 状態の指紋(FNV-1a 32bit —— x,y,vx,vy,spin,R,m と t)。keys を渡すとその配列だけ(力学の指紋 = x,y,vx,vy,spin)。 */
export function stateHash(S, keys) {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
  for (const k of (keys || ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm'])) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) push(A[i]); }
  push(S.t);
  return a.toString(16).padStart(8, '0');
}

// ---------- (A) 単体試験 ----------
const PH0 = { G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0.5, gammaN: 0.4, kappaS: 0, kappaT: 0, cLight: 30, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1, timeScale: 1, frameWeight: 'share' };
/** 4 経路の単体の宇宙(重力 0 —— 接触だけが速度を変える)。 */
export function unitPreset(pathKey, mode, extraPhys) {
  const ph = Object.assign({}, PH0, extraPhys || {});
  if (pathKey === 'plain' || pathKey === 'pn' || pathKey === 'tp') { ph.muF = 0; ph.gammaN = 0; }
  if (pathKey === 'pn') ph.geoPN = 1;
  if (mode) ph.contactMode = mode;
  const p = { id: 'u285a-' + pathKey, name: 'u', emoji: '·', description: '第285便a の単体試験', camera: { scale: 10 }, world: { boundary: 'none', size: 0 }, seed: 1, physics: ph };
  if (pathKey === 'tp') {
    // 源 1 個(自由)+ 試験粒子の環 1 本(源に重なる位置 —— 入場条件「末尾に連続」)
    p.bodies = [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false, radius: 1 },
      { type: 'ring', n: 1, cx: 0, cy: 0, rIn: 0.6, rOut: 0.6, mMin: 0.01, mMax: 0.01, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0,
        direction: 1, pinned: false, particleRadius: 0.5, testParticle: true }];
  } else {
    p.bodies = [{ type: 'single', m: 1, x: -0.5, y: 0, vx: 1, vy: 0.3, spin: 0, pinned: false, radius: 1 },
      { type: 'single', m: 1, x: 0.5, y: 0, vx: -1, vy: 0, spin: 0, pinned: false, radius: 1 }];
  }
  return p;
}
function stepOnce(HP, p, steps = 1) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const t = S.n - 1;
  const b = { vx: S.vx[t], vy: S.vy[t], spin: S.spin[t] };
  for (let k = 0; k < steps; k++) S.step(DT);
  const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
  return { before: b, after: { vx: S.vx[t], vy: S.vy[t], spin: S.spin[t] }, kKind: S._kKind === undefined ? null : S._kKind, tp: !!S.hasTestParticle,
    contactNone: S.contactNone === true, st, contactModeAccepted: v.preset.physics.contactMode === undefined ? null : v.preset.physics.contactMode };
}
/** springU: html の springUOf(Node の主コンテキストなら globalThis.springUOf・vm の headless なら evalExpr('springUOf'))。 */
export function unitTests(HP, springU = globalThis.springUOf) {
  const paths = [
    { key: 'generic', label: 'generic の対ループ(γn 0.4・μF 0.5 —— kKind 0)', wantKind: 0, wantTp: false },
    { key: 'plain', label: '特別化 pairCorePlain(γn=μF=0・geoPN 0 —— kKind 1)', wantKind: 1, wantTp: false },
    { key: 'pn', label: '特別化 pairCorePN(γn=μF=0・geoPN 1 —— kKind 2)', wantKind: 2, wantTp: false },
    { key: 'tp', label: '試験粒子の側 dfmTestParticleStep(源 1 + 試験粒子 1)', wantKind: null, wantTp: true },
  ];
  const rows = [];
  for (const P of paths) {
    const u = stepOnce(HP, unitPreset(P.key, null)), n = stepOnce(HP, unitPreset(P.key, 'normal')), z = stepOnce(HP, unitPreset(P.key, 'none'));
    const same = (a, b) => a.st.length === b.st.length && a.st.every((x, i) => Object.is(x, b.st[i]));
    rows.push({ path: P.key, label: P.label,
      kKindNormal: n.kKind, kKindNone: z.kKind, tpNormal: n.tp, tpNone: z.tp,
      pathOk: (P.wantKind === null || n.kKind === P.wantKind) && n.tp === P.wantTp,
      normal: { dvx: n.after.vx - n.before.vx, dvy: n.after.vy - n.before.vy, dspin: n.after.spin - n.before.spin },
      none: { dvx: z.after.vx - z.before.vx, dvy: z.after.vy - z.before.vy, dspin: z.after.spin - z.before.spin },
      normalChanges: n.after.vx !== n.before.vx, noneUnchanged: z.after.vx === z.before.vx && z.after.vy === z.before.vy && z.after.spin === z.before.spin,
      unspecifiedEqualsNormal: same(u, n), noneFlag: z.contactNone, accepted: z.contactModeAccepted });
  }
  // contactK=0 だけ(normal)では γn/μF が残る(generic)
  const k0 = stepOnce(HP, unitPreset('generic', null, { contactK: 0 }));
  const k0none = stepOnce(HP, unitPreset('generic', 'none', { contactK: 0 }));
  const contactKZero = { dvx: k0.after.vx - k0.before.vx, dspin: k0.after.spin - k0.before.spin, stillChanges: k0.after.vx !== k0.before.vx,
    noneUnchanged: k0none.after.vx === k0none.before.vx };
  // ばねエネルギー(springUOf —— 同じ重なり 0.3・換算質量 0.5・maxInv 1)
  const sU = (ph) => springU(ph, 0.5, 1, 0.3);
  const spring = { normal: sU({}), none: sU({ contactMode: 'none' }), zeroK: sU({ contactK: 0, contactCap: 8 }) };
  // 受理器: 併用の拒否・不正値・particleRadius
  const rej = (p) => { const v = HP.validatePreset(p); return { ok: v.ok, errors: (v.errors || []).filter((e) => /contactMode|particleRadius/.test(e)), warnings: (v.warnings || []).filter((e) => /particleRadius/.test(e)) }; };
  const fus = unitPreset('generic', 'none'); fus.thermal = 'tint'; fus.fusion = { dFrac: 0.5 };
  const fusN = unitPreset('generic', 'normal'); fusN.thermal = 'tint'; fusN.fusion = { dFrac: 0.5 };
  const pc = unitPreset('generic', 'none'); pc.thermal = 'tint'; pc.phaseChange = { bondN: 3 };
  const bogus = unitPreset('generic', 'maybe');
  const acceptance = { fusionNone: rej(fus), fusionNormal: rej(fusN), phaseChangeNone: rej(pc), bogus: rej(bogus) };
  const prRows = [];
  for (const [label, val, rMul] of [['正の値', 0.02, undefined], ['rMul と併記(rMul は半径に使わない)', 0.02, 2], ['0', 0, undefined], ['負', -1, undefined], ['NaN', NaN, undefined], ['文字列', 'x', undefined]]) {
    for (const type of ['disk', 'ring', 'box', 'grid']) {
      const p = unitPreset('generic', null);
      const row = type === 'disk' ? { type, n: 3, cx: 10, cy: 0, radius: 3, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vMode: 'none', vScale: 0, direction: 1 }
        : type === 'ring' ? { type, n: 3, cx: 10, cy: 0, rIn: 2, rOut: 3, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: false }
        : type === 'box' ? { type, n: 3, cx: 10, cy: 0, w: 3, h: 3, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vScale: 0 }
        : { type, n: 3, cols: 3, cx: 10, cy: 0, pitch: 2, mMin: 1, mMax: 1 };
      row.particleRadius = val; if (rMul !== undefined) row.rMul = rMul;
      p.bodies.push(row);
      const v = HP.validatePreset(clone(p));
      let R = null;
      if (v.ok) { HP.sim.build(v.preset); R = HP.sim.R[HP.sim.n - 1]; }
      prRows.push({ label, type, ok: v.ok, R, want: (typeof val === 'number' && val > 0) ? Math.fround(val) : null,
        warnRMul: (v.warnings || []).some((w) => /particleRadius があるので rMul/.test(w)) });
    }
  }
  return { paths: rows, contactKZero, spring, acceptance, particleRadius: prRows };
}

// ---------- (B) 既存 142 本の 1 步(基点 html と今の html —— 子プロセス) ----------
function hashesOf(htmlAbs, steps) {
  const sp = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--hashes', htmlAbs, String(steps)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 << 20 });
  if (sp.status !== 0) throw new Error('指紋の子プロセスが失敗: ' + sp.stderr.slice(-800));
  return JSON.parse(sp.stdout);
}

// ---------- (C) 拘束の反作用の記帳 ----------
export function constraintLedger(HP) {
  const mk = (pinned) => ({ id: 'u285a-pin', name: 'u', emoji: '·', description: '第285便a の拘束の記帳', camera: { scale: 30 }, world: { boundary: 'none', size: 0 }, seed: 285,
    physics: Object.assign({}, PH0, { G: 1, muF: 0, gammaN: 0, softening: 0.5, contactMode: 'none' }),
    bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned, radius: 1 },
      { type: 'disk', n: 24, cx: 0, cy: 0, radius: 12, mMin: 1, mMax: 3, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 100, vScale: 1, direction: 1, particleRadius: 0.05 }] });
  const P = (S, from) => { let px = 0, py = 0; for (let i = from; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i]; } return [px, py]; };
  const out = {};
  for (const [key, pinned] of [['pinned', true], ['free', false]]) {
    const v = HP.validatePreset(mk(pinned)); HP.sim.build(v.preset); const S = HP.sim;
    const p0f = P(S, 1), p0t = P(S, 0);
    for (let k = 0; k < 1000; k++) S.step(DT);
    const p1f = P(S, 1), p1t = P(S, 0);
    const dPf = [p1f[0] - p0f[0], p1f[1] - p0f[1]], dPt = [p1t[0] - p0t[0], p1t[1] - p0t[1]];
    const scale = Math.max(1e-300, Math.hypot(...p0f), Math.abs(p0f[0]) + Math.abs(p0f[1]) + 1);
    out[key] = { steps: 1000, dPfree: dPf, dPtotal: dPt, reactionJ: [-dPf[0], -dPf[1]], centerMoved: Math.hypot(S.x[0], S.y[0]),
      relDPtotal: Math.hypot(...dPt) / scale, relDPfree: Math.hypot(...dPf) / scale };
  }
  return out;
}

// ---------- (D) 適用表の前後 ----------
export function applyMetrics(S) {
  const piv = []; for (let i = 0; i < S.n; i++) if (S.pinned[i] === 1) piv.push(i);
  const cx = piv.length ? S.x[piv[0]] : 0, cy = piv.length ? S.y[piv[0]] : 0;
  const free = []; for (let i = 0; i < S.n; i++) if (S.pinned[i] !== 1) free.push(i);
  const rr = free.map((i) => ({ i, r: Math.hypot(S.x[i] - cx, S.y[i] - cy), m: Math.abs(S.m[i]) })).sort((a, b) => a.r - b.r);
  let M = 0; for (const z of rr) M += z.m;
  let acc = 0, rh = null; for (const z of rr) { acc += z.m; if (acc >= 0.5 * M) { rh = z.r; break; } }
  const outer = rr.filter((z) => z.r >= (rh || 0));
  let vt = 0, n = 0, s2 = 0;
  for (const z of outer) { const i = z.i, dx = S.x[i] - cx, dy = S.y[i] - cy, r = z.r || 1; vt += (-dy * S.vx[i] + dx * S.vy[i]) / r; n++; }
  vt = n ? vt / n : null;
  let mvx = 0, mvy = 0; for (const i of free) { mvx += S.vx[i]; mvy += S.vy[i]; } mvx /= free.length; mvy /= free.length;
  for (const i of free) s2 += (S.vx[i] - mvx) ** 2 + (S.vy[i] - mvy) ** 2;
  let ov = 0; for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) if (Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j]) < S.R[i] + S.R[j]) ov++;
  return { rHalf: rh, vtOuter: vt, sigma: Math.sqrt(s2 / Math.max(1, free.length)), overlapPairs: ov, radE: S.radE };
}
/** 前 = 基点 html の宣言(いまのエンジンで走らせる)・後 = いまの宣言。力学の指紋は x,y,vx,vy,spin だけ(半径は別に比べる)。 */
export const DYN_KEYS = ['x', 'y', 'vx', 'vy', 'spin'];
export function applyRow(HP, A, baseP) {
  const cur = byId(HP, A.id);
  const run = (p) => { const v = HP.validatePreset(clone(p)); if (!v.ok) throw new Error(A.id + ': ' + v.errors.join('/'));
    HP.sim.build(v.preset); const S = HP.sim; const m0 = applyMetrics(S); const R0 = Array.from(S.R);
    for (let k = 0; k < APPLY_STEPS; k++) S.step(DT);
    return { m0, m1: applyMetrics(S), hash: stateHash(S), dynHash: stateHash(S, DYN_KEYS), R0, n: S.n, pinned: Array.from(S.pinned).reduce((a, b) => a + (b === 1 ? 1 : 0), 0), contactNone: S.contactNone === true }; };
  const a = run(baseP), b = run(cur);
  let trial = null;
  if (A.trialNone) { const tp = clone(cur); tp.physics.contactMode = 'none'; const t = run(tp); trial = { hash: t.hash, dynHash: t.dynHash, end: t.m1, dynamicsChangedVsBase: t.dynHash !== a.dynHash }; }
  let rChanged = 0; for (let i = 0; i < Math.min(a.R0.length, b.R0.length); i++) if (a.R0[i] !== b.R0[i]) rChanged++;
  const pinnedIdx = cur.bodies.map((bd, k) => (bd.pinned ? k : -1)).filter((k) => k >= 0);
  return { id: A.id, emoji: A.emoji, role: A.role, center: A.center, note: A.note,
    declared: cur.physics.contactMode === undefined ? null : cur.physics.contactMode, pinnedRows: pinnedIdx, nPinned: b.pinned, n: b.n,
    steps: APPLY_STEPS, before: { hash: a.hash, dynHash: a.dynHash, t0: a.m0, end: a.m1, contactMode: baseP.physics.contactMode === undefined ? null : baseP.physics.contactMode },
    after: { hash: b.hash, dynHash: b.dynHash, t0: b.m0, end: b.m1, contactNone: b.contactNone },
    dynamicsChanged: a.dynHash !== b.dynHash, radiusChanged: rChanged, want: declOf(A), trialNone: trial };
}

// ---------- (E) 💍💿 の量ごとの前後 ----------
export function ringTable(CA0, CA1) {
  return RING_IDS.map((id) => {
    const pa = (CA0.presets || []).find((z) => z.id === id), pb = (CA1.presets || []).find((z) => z.id === id);
    if (!pa || !pb) return { id, missing: true };
    const rows = quantityRows(pa, pb);
    return { id, emoji: id === 'saturnRingReal' ? '💍' : '💿', rows, nQuantities: rows.length,
      nChanged: rows.filter((z) => z.before !== z.after).length,
      maxAbsDiff: rows.reduce((m, z) => (Number.isFinite(z.absDiff) ? Math.max(m, Math.abs(z.absDiff)) : m), 0),
      verdictMoved: rows.filter((z) => !z.missingAfter && z.verdictBefore !== z.verdictAfter).length,
      gateMoved: rows.filter((z) => !z.missingAfter && z.gateBefore !== z.gateAfter).length,
      run: { before: runOf(pa), after: runOf(pb) } };
  });
}

const e3 = (x) => (Number.isFinite(x) ? Number(x).toExponential(3) : '—');
const f3 = (x) => (Number.isFinite(x) ? Number(x).toFixed(3) : '—');
/** PHYSICS〔第285便a〕の表の行(QA behavior.contactMode が PHYSICS にあるかを照合する —— 壁時計は写さない)。 */
export function docRows(J) {
  const out = { paths: [], apply: [], kept: [], ring: [] };
  for (const r of J.unit.paths) out.paths.push(`| ${r.label} | ${e3(r.normal.dvx)} | ${e3(r.none.dvx)} | ${r.noneUnchanged ? '不変' : '変わる'} | ${r.unspecifiedEqualsNormal ? '一致' : '不一致'} |`);
  for (const a of J.apply) out.apply.push(`| ${a.emoji} \`${a.id}\` | ${a.declared}${a.trialNone ? '(none の試行: 力学 ' + (a.trialNone.dynamicsChangedVsBase ? '変わる' : '不変') + '・r_h ' + f3(a.trialNone.end.rHalf) + ')' : ''} | ${a.center} | ${a.dynamicsChanged ? '変わる' : '不変'}${a.radiusChanged ? '(半径 ' + a.radiusChanged + ' 体)' : ''} | ${f3(a.before.end.rHalf)} → ${f3(a.after.end.rHalf)} | ${f3(a.before.end.vtOuter)} → ${f3(a.after.end.vtOuter)} | ${f3(a.before.end.sigma)} → ${f3(a.after.end.sigma)} | ${a.before.end.overlapPairs} → ${a.after.end.overlapPairs} |`);
  for (const k of J.normalKept) out.kept.push(`| ${k.emoji} \`${k.id}\` | ${k.declared === null ? '未指定(normal)' : k.declared} | ${k.why} |`);
  for (const t of (J.ring.table || [])) if (!t.missing) out.ring.push(`| ${t.emoji} \`${t.id}\` | ${t.nQuantities} | ${t.nChanged} | ${e3(t.maxAbsDiff)} | ${t.verdictMoved} / ${t.gateMoved} | ${t.run.before.steps} → ${t.run.after.steps} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv[2] === '--presets') {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(process.argv[3]);
  const want = process.argv[4].split(','), o = {};
  for (const id of want) { const p = byId(HP, id); o[id] = p ? clone(p) : null; }
  process.stdout.write(JSON.stringify(o));
} else if (IS_MAIN && process.argv[2] === '--hashes') {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(process.argv[3]);
  const steps = Number(process.argv[4]) || 1, o = {};
  for (const p of HP.allPresets()) {
    const v = HP.validatePreset(clone(p));
    if (!v.ok) { o[p.id] = 'invalid'; continue; }
    HP.sim.build(v.preset);
    for (let k = 0; k < steps; k++) HP.sim.step(DT);
    o[p.id] = stateHash(HP.sim) + '|' + HP.sim.n;
  }
  process.stdout.write(JSON.stringify(o));
} else if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const BASE_REV = process.env.W285A_BASE_REV || BASE_REV_DEFAULT;
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  // (A)
  const unit = unitTests(HP);
  for (const r of unit.paths) console.log(`(A) ${r.path}: kKind ${r.kKindNormal}/${r.kKindNone}・tp ${r.tpNormal}・normal Δvx ${e3(r.normal.dvx)}・none Δvx ${e3(r.none.dvx)}(${r.noneUnchanged ? '不変' : '変わる'})・未指定≡normal ${r.unspecifiedEqualsNormal}`);
  console.log('(A) contactK=0 だけ: ' + JSON.stringify(unit.contactKZero) + ' / ばね U ' + JSON.stringify(unit.spring));
  // (B)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w285a-contact-'));
  const baseAbs = path.join(tmp, 'base.html');
  fs.writeFileSync(baseAbs, execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 256 << 20 }));
  const baseSha = crypto.createHash('sha256').update(fs.readFileSync(baseAbs)).digest('hex');
  const hB = hashesOf(baseAbs, 1), hN = hashesOf(path.join(ROOT, TARGET), 1);
  const spP = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--presets', baseAbs, APPLIED.map((a) => a.id).join(',')], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 << 20 });
  if (spP.status !== 0) throw new Error('基点の宣言の子プロセスが失敗: ' + spP.stderr.slice(-800));
  const basePresets = JSON.parse(spP.stdout);
  fs.rmSync(tmp, { recursive: true, force: true });
  const ids = Object.keys(hN);
  const differ = ids.filter((id) => hB[id] !== hN[id]);
  const declared = HP.allPresets().filter((p) => p.physics && p.physics.contactMode !== undefined).map((p) => p.id);
  const oneStep = { baseRev: BASE_REV, baseSha256: baseSha, n: ids.length, nBase: Object.keys(hB).length, identical: ids.length - differ.length, differ,
    differSubsetOfDeclared: differ.every((id) => declared.includes(id)), declared };
  console.log(`(B) 1 步: ${oneStep.identical}/${oneStep.n} 一致・違う本 ${differ.join(' ') || 'なし'}(宣言の部分集合 ${oneStep.differSubsetOfDeclared})`);
  // (C)
  const ledger = constraintLedger(HP);
  console.log('(C) 拘束の記帳: ' + JSON.stringify(ledger));
  // (D)
  const apply = [];
  for (const A of APPLIED) { const r = applyRow(HP, A, basePresets[A.id]); apply.push(r); console.log(`(D) ${A.emoji} ${A.id}: 宣言 ${r.declared}・固定 ${r.nPinned}・力学 ${r.dynamicsChanged ? '変わる' : '不変'}・r_h ${f3(r.before.end.rHalf)}→${f3(r.after.end.rHalf)}・重なり ${r.before.end.overlapPairs}→${r.after.end.overlapPairs}`); }
  const normalKept = NORMAL_KEPT.map((k) => { const p = byId(HP, k.id); return Object.assign({}, k, { present: !!p, declared: p && p.physics.contactMode !== undefined ? p.physics.contactMode : null,
    fusion: !!(p && p.fusion), phaseChange: !!(p && p.phaseChange) }); });
  // (E)
  const CANON_IN = 'tests/out/calaudit-w249.json';
  const baseTxt = execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':' + CANON_IN], { maxBuffer: 256 << 20 });
  const CA0 = JSON.parse(baseTxt);
  const nowSha = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, TARGET))).digest('hex');
  let CA1 = null, after = null;
  try { const c = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_IN), 'utf8'));
    // 第288便b(原仮定者の裁定(第78報)④): 退役した本(💿 saturnRingRealKF1)は calaudit の母集団の外 —— 正本に無くてよい(表では missing:true・履歴の対照は基点の正本 CA0 だけ)
    const retiredIds = new Set(RING_IDS.filter((id) => { const p = byId(HP, id); return !!(p && p.familyRole === 'retired'); }));
    if (c.meta && c.meta.targetSha256 === nowSha && RING_IDS.every((id) => retiredIds.has(id) || (c.presets || []).some((p) => p.id === id))) {
      CA1 = c; after = { source: 'canon', file: CANON_IN, targetSha256: nowSha };
    }
  } catch { /* 読めなければ走らせる */ }
  if (!CA1 && process.env.PLAYWRIGHT_CORE_DIR) {
    const t2 = fs.mkdtempSync(path.join(os.tmpdir(), 'w285a-ring-'));
    const o = path.join(t2, 'calaudit.json'), d = path.join(t2, 'calaudit-diag.json');
    const liveIds = RING_IDS.filter((id) => { const p = byId(HP, id); return !(p && p.familyRole === 'retired'); });   // 第288便b: 退役した本は判定器の CFG にも無い
    const sp = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'exp-w249b-calaudit.mjs'), '--only', liveIds.join(',')],
      { cwd: ROOT, env: Object.assign({}, process.env, { W249_OUT: o, W249_DIAG_OUT: d, QA_TARGET: TARGET }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (sp.status !== 0) { console.error(sp.stderr.slice(-2000)); throw new Error('判定器が失敗した: ' + sp.status); }
    CA1 = JSON.parse(fs.readFileSync(o, 'utf8'));
    fs.rmSync(t2, { recursive: true, force: true });
    after = { source: 'fresh-run', cmd: 'node tests/exp-w249b-calaudit.mjs --only ' + liveIds.join(',') + '(W249_OUT は一時ファイル)',
      targetSha256: CA1.meta ? CA1.meta.targetSha256 : null, why: '正本 calaudit-w249.json がいまの html の世代でない(鎖の再生成の前)' };
  }
  const ring = { base: { rev: BASE_REV, file: CANON_IN, sha256: crypto.createHash('sha256').update(baseTxt).digest('hex'), targetSha256: CA0.meta ? CA0.meta.targetSha256 : null },
    after, table: CA1 ? ringTable(CA0, CA1) : null,
    note: CA1 ? null : '後の判定を得られなかった(正本がいまの html の世代でなく、PLAYWRIGHT_CORE_DIR も無い)' };
  if (ring.table) for (const t of ring.table) console.log(`(E) ${t.emoji} ${t.id}: ${t.nQuantities} 量・値が変わった ${t.nChanged}・最大 |差| ${e3(t.maxAbsDiff)}・区分 ${t.verdictMoved}・門 ${t.gateMoved}・步数 ${t.run.before.steps}→${t.run.after.steps}`);
  const CODE = ['tests/exp-w285a-contact.mjs', 'tests/exp-w284e-tpsign.mjs', 'tests/lib-w283c-calstages.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第285便a', target: TARGET, code: CODE, inputs: [TARGET, CANON_IN] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length, dt: DT, applySteps: APPLY_STEPS,
    ruling: '原仮定者の裁定(第75報)④: 多粒子サンプルでは粒子数を減らして近似している。粒子の偏りで中心天体が想定外に動くため中心天体は固定する。粒子同士の接触も現実より多くなるため接触判定は無しとする。銀河同士の衝突などを再現する場合は固定を外す。粒子同士の衝突や合体などを再現する場合は衝突判定を行う',
    reading: '統括の検証項目 R95(多粒子の契約 —— contactMode:"none" は E9 の 4 経路を止め・ばねエネルギー 0・fusion 併用は拒否・中心固定は pinned:true で反作用は別に記帳)',
    notClaim: ['接触を外したので観測一致を達成した', '較正を完了した', '形状が安定した'] });
  const out = { meta, contract: { key: 'contactMode', values: ['normal', 'none'], defaultUnchanged: { contactK: 40, contactCap: 8 } },
    unit, oneStep, constraint: ledger, apply, normalKept, ring, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.join(ROOT, 'tests', 'out'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'contact-w285a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/contact-w285a.json(' + out.elapsedS.toFixed(1) + ' s)');
}
