// 第295便b(原仮定者の裁定(第85報)「geoPN=3 と銀河などを分けた方が良い場合は、新たに geoPN=4 の組み合わせを検討する」・統括の検証項目 R154)——
// **geoPN=4(空間メッシュ —— 旧法則版 spaceMesh.lawVersion の置き場)への移住の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。1 プロセス)。4 は新しい物理モードではない。
//
// ■ 何を測るか(門 —— どれも「ビット同一か」の照合で、物理の合否ではない)
//   (a) 在位で旧法則版が走る 9 本(🪁🌚🧩🛸🪆💮🔁🌒🩻)それぞれで、宣言の geoPN を 3 にした写しと 4 にした写しを、アプリの読み込み
//       (HP.loadPreset —— 内蔵の本の physics.geoPN だけを一時的に書き換えて読み、終わったら戻す)で作り、アプリの既定 dt(DT=0.016)で
//       **2000 步**走らせる。步ごとに状態の指紋(x/y/vx/vy/spin/m/mEff/R・PN 旗 pnOv・vMinusU の天体ごとの u〔geo3TransportAt〕・t)と
//       旗(hasGeoToy・hasGeo3・hasGeo3PN・geoToyDeny・geoToyStop)を比べ、最初に違った步(無ければ null)・最終状態の全配列
//       (S の型付き配列のすべて —— 補助の照合)の一致を記録する。
//   (b) 宣言の解決(geoModeOf の law・測地線・core・standard)・走行の解決(geoLawOfSim・geoEffectiveMode が 3 以上 = 旧法則版の dispatch)・
//       セーブ時の警告の code・メッシュのチップ(meshChipState の key)を 3 と 4 で並べる(4 は警告 0 —— 標準の組)。
//   (c) 4 で旧法則版が走らない写し(9 本のうち scalar の 🪁 の宣言から lawVersion を外した写し・kFrame=1 にした写し): 測地線 ON の基底
//       (警告 geo4NoMesh/geo4KFrame)で走る(走行は止めない)。
//   (d) 退役 3 本(🎋🌰🥜)は宣言の geoPN が 3 のまま(番号も本文も変えない —— 凍結)。🌛(慣性の 3)も 3 のまま。
//
// ■ しないこと・言わないこと
//   ・ビット同一でない本は移さない(器は「同一か」を記録するだけ —— 移住は本文の宣言を書き換える別の作業)。
//   ・4 を新しい物理・4PN・回転引きずりや大域場の標準式と書かない。
//
// 実行(Node だけ・Chromium 不要):
//   node tests/exp-w295b-geo4.mjs            → 正本 tests/out/geo4-w295b.json(W295B_OUT で出力先を変える)
//   W295B_STEPS=200 node tests/exp-w295b-geo4.mjs   → 短走(正本の既定は 2000 步 —— 短走の結果を正本にしない)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.MODE_SAVE_WARN_CODES","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.geo3TransportAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.loadPreset","HP.meshChipState","HP.modeSaveWarnings","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w295b-geo4-1';
/** 在位で旧法則版(spaceMesh.lawVersion)が走る 9 本(第294便の geoPN=3 の名簿から 🌛〔慣性〕と退役 3 本を除いたもの) */
export const BOOKS = Object.freeze(['galaxyMeshSpiralGeoToy', 'galaxyAnalogyBH', 'galaxyAnalogyBHCompose', 'galaxyAnalogyBHTilt90',
  'galaxyAnalogyBHTilt90Layers', 'clusterAnalogyBH', 'mercuryGeoToy3', 'charonGeoToy3', 'psrDoubleABGeoToy']);
/** 退役 3 本(凍結 —— 番号も本文も変えない)と慣性の 3(🌛) */
export const FROZEN3 = Object.freeze(['galaxyMeshSpiralGeoToyLite', 'clusterGrowthCopy', 'fixedCaptureCopy']);
export const INERTIAL3 = 'earthMoonInertial';
export const RUN = Object.freeze({ dt: 0.016, steps: Number(process.env.W295B_STEPS || 2000) });
const TARGET = 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/* ── 状態の指紋(FNV-1a —— Float64 のビット列。配列が無ければ鍵ごとに印を入れる)── */
const FIELDS = ['x', 'y', 'vx', 'vy', 'spin', 'm', 'mEff', 'R', 'pnOv'];
function hasher() {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  return { push(v) { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } }, hex() { return a.toString(16); } };
}
function flagsOf(S) {
  return { hasGeoToy: !!S.hasGeoToy, hasGeo3: !!S.hasGeo3, hasGeo3PN: !!S.hasGeo3PN, geoToyDeny: S.geoToyDeny || null, geoToyStop: S.geoToyStop || null,
    geo3Undeclared: S.geo3Undeclared === true };
}
function fingerprint(HP, S) {
  const h = hasher();
  for (const k of FIELDS) { const A = S[k]; if (!A) { h.push(-7777); continue; } for (let i = 0; i < S.n; i++) h.push(A[i]); }
  const u = HP.geo3TransportAt(S);   // vMinusU の天体ごとの u(それ以外は null)
  if (u) for (const v of u) h.push(v === null ? -8888 : v); else h.push(-9999);
  const F = flagsOf(S);
  h.push(F.hasGeoToy ? 1 : 0); h.push(F.hasGeo3 ? 1 : 0); h.push(F.hasGeo3PN ? 1 : 0);
  h.push(S.t); h.push(S.hasNaN() ? 1 : 0);
  return h.hex();
}
/** 最終状態の全配列(S の型付き配列のすべて —— 名前順)の指紋。補助の照合(門は步ごとの指紋)。 */
function wholeArrays(S) {
  const h = hasher(), names = [];
  for (const k of Object.keys(S).sort()) {
    const A = S[k];
    if (!(ArrayBuffer.isView(A) && !(A instanceof DataView))) continue;
    names.push(k);
    for (let i = 0; i < A.length; i++) h.push(Number(A[i]));
  }
  return { n: names.length, hex: h.hex() };
}
function modeRow(HP, S, p) {
  const gm = HP.geoModeOf(S.params);
  const chip = HP.meshChipState(p, S);
  return { geoPN: S.params.geoPN, mode: gm.mode, purpose: gm.purpose, role: gm.role, law: gm.law, geodesic: gm.geodesic, core: gm.core, standard: gm.standard,
    legacyLaw: gm.legacyLaw, legacyOff: gm.legacyOff, inertialDrag: gm.inertialDrag, ge: HP.geoEffectiveMode(S), lawOfSim: HP.geoLawOfSim(S),
    saveWarn: HP.modeSaveWarnings(S.params).map((w) => w.code), chip: chip ? chip.key : null, flags: flagsOf(S) };
}
/** 内蔵の本の physics.geoPN を一時的に g にして HP.loadPreset で読み(アプリの読み込みと同じ経路)、steps 步走らせる。 */
function runAs(HP, id, g, steps, dt, mutate) {
  const p = find(HP, id);
  const keep = clone(p.physics);
  p.physics.geoPN = g;
  if (mutate) mutate(p.physics);
  try {
    const v = HP.validatePreset(clone(p));
    HP.loadPreset(id, false);
    const S = HP.sim;
    const mode0 = modeRow(HP, S, p);
    const prints = [fingerprint(HP, S)];
    const t0 = Date.now();
    for (let k = 0; k < steps; k++) { S.step(dt); prints.push(fingerprint(HP, S)); }
    const wallSec = (Date.now() - t0) / 1000;
    return { prints, mode: mode0, modeEnd: modeRow(HP, S, p), whole: wholeArrays(S), n: S.n, nan: S.hasNaN(), t: S.t,
      accept: { ok: v.ok, warnings: (v.warnings || []).length }, wallSec };
  } finally { p.physics = keep; }
}
function compare(A, B) {
  let first = null;
  for (let k = 0; k < Math.max(A.prints.length, B.prints.length); k++) if (A.prints[k] !== B.prints[k]) { first = k; break; }
  return { firstDiffStep: first, identical: first === null, wholeSame: A.whole.hex === B.whole.hex && A.whole.n === B.whole.n,
    printEnd: [A.prints[A.prints.length - 1], B.prints[B.prints.length - 1]] };
}
const brief = (r) => ({ mode: r.mode, modeEnd: r.modeEnd, n: r.n, nan: r.nan, t: r.t, accept: r.accept, whole: r.whole, wallSec: r.wallSec });

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W295B_OUT || path.join(ROOT, 'tests', 'out', 'geo4-w295b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const { steps, dt } = RUN;
  const rows = [];
  for (const id of BOOKS) {
    const p = find(HP, id);
    const decl = { id, emoji: p.emoji, declaredGeoPN: p.physics.geoPN, lawVersion: (p.physics.spaceMesh || {}).lawVersion || null, kFrame: p.physics.kFrame,
      familyRole: p.familyRole || null };
    const r3 = runAs(HP, id, 3, steps, dt), r4 = runAs(HP, id, 4, steps, dt);
    const cmp = compare(r3, r4);
    const sameResolve = r3.mode.law === r4.mode.law && r3.mode.geodesic === r4.mode.geodesic && r3.mode.lawOfSim === r4.mode.lawOfSim
      && r3.mode.ge >= 3 && r4.mode.ge >= 3 && JSON.stringify(r3.mode.flags) === JSON.stringify(r4.mode.flags) && r3.mode.chip === r4.mode.chip;
    rows.push(Object.assign(decl, { geo3: brief(r3), geo4: brief(r4), cmp, sameResolve,
      identical: cmp.identical && cmp.wholeSame && sameResolve && !r3.nan && !r4.nan,
      geo4Standard: r4.mode.standard === true && r4.mode.saveWarn.length === 0 && /^legacy-spaceMesh:/.test(r4.mode.law) }));
    console.log(`${p.emoji} ${id} (${decl.lawVersion}): 3⇔4 ${steps} 步 identical ${cmp.identical}・全配列 ${cmp.wholeSame}・解決 ${sameResolve}・law ${r4.mode.law}・4 の警告 ${JSON.stringify(r4.mode.saveWarn)}・${(r3.wallSec + r4.wallSec).toFixed(1)} s`);
  }
  // (c) 4 で旧法則版が走らない写し(🪁 の宣言から lawVersion を外す/kFrame=1 —— 測地線 ON の基底で走る・逸脱の警告)
  const noMesh = runAs(HP, 'galaxyMeshSpiralGeoToy', 4, 20, dt, (ph) => { ph.spaceMesh = Object.assign({}, ph.spaceMesh); delete ph.spaceMesh.lawVersion; });
  const kf1 = runAs(HP, 'galaxyMeshSpiralGeoToy', 4, 20, dt, (ph) => { ph.kFrame = 1; });
  const off = { noLawVersion: brief(noMesh), kFrame1: brief(kf1) };
  // (d) 凍結の本と慣性の 3
  const frozen = FROZEN3.map((id) => { const p = find(HP, id); return { id, emoji: p ? p.emoji : null, present: !!p, geoPN: p ? p.physics.geoPN : null, familyRole: p ? (p.familyRole || null) : null }; });
  const inertial = (() => { const p = find(HP, INERTIAL3); return { id: INERTIAL3, geoPN: p.physics.geoPN, law: HP.geoModeOf(p.physics).law }; })();
  // 宣言の名簿(内蔵の全本の geoPN の桶 —— geoModeOf の mode)
  const buckets = [0, 0, 0, 0, 0];
  for (const q of HP.allPresets()) if (!String(q.id).startsWith('custom_')) buckets[HP.geoModeOf(Object.assign({}, q.physics)).mode]++;
  const migrated = rows.filter((r) => r.declaredGeoPN === 4).map((r) => r.id);
  const gates = {
    identity: rows.every((r) => typeof r.identical === 'boolean'),
    migratedIdentical: migrated.every((id) => rows.find((r) => r.id === id).identical),
    geo4Standard: rows.filter((r) => r.identical).every((r) => r.geo4Standard),
    offDeviates: noMesh.mode.geodesic === true && noMesh.mode.saveWarn.indexOf('geo4NoMesh') >= 0 && noMesh.mode.ge === 2 && !noMesh.nan
      && kf1.mode.geodesic === true && kf1.mode.saveWarn.indexOf('geo4NoMesh') >= 0 && kf1.mode.saveWarn.indexOf('geo4KFrame') >= 0 && !kf1.nan,
    frozen3: frozen.every((f) => !f.present || f.geoPN === 3),
    inertial3: inertial.geoPN === 3 && inertial.law === 'inertial-drag',
  };
  const out = {
    meta: null, run: RUN, rows,
    summary: { n: rows.length, identical: rows.filter((r) => r.identical).map((r) => r.id), different: rows.filter((r) => !r.identical).map((r) => r.id),
      migrated, kept3: rows.filter((r) => r.declaredGeoPN === 3).map((r) => r.id), buckets },
    off, frozen, inertial, gates, ok: Object.values(gates).every(Boolean),
  };
  const CODE = ['tests/exp-w295b-geo4.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第295便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, purposes: [0, 1, 2, 3, 4].map((k) => HP.geoModeOf({ geoPN: k }).purpose), saveWarnCodes: HP.MODE_SAVE_WARN_CODES, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第85報)(geoPN=3 と銀河などを分けた方が良い場合は、新たに geoPN=4 の組み合わせを検討する)',
    reading: '統括の検証項目 R154(geoPN=4〔旧空間メッシュ〕の器と在位 9 本の移住 —— 移住はビット同一の本だけ)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・HP.loadPreset で読む)',
    gateBuiltin: '内蔵の本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    notClaim: ['4 は新しい物理モード', '4PN', '回転引きずり・大域場を 4 の標準式にした'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(`同一 ${out.summary.identical.length}/${rows.length}(違う: ${out.summary.different.join(',') || 'なし'})・移住済み ${migrated.length}・桶 ${buckets.join('/')}`);
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}
