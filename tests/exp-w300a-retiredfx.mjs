// 第300便a(原仮定者の裁定(第90報)⑤「mercuryGeoToy3 は慣性系の画面に対して重心が移動して行くので誤り。mercuryMeshMigrate3d は明らかに軌道がおかしい。
// 改善の見込みが立たないので physics.spaceMesh とサンプルは全面廃止」・統括の検証項目 R175):
// **退役 11 本の凍結の写しを 1 度だけ作る器**(第298便b の tests/exp-w298b-retiredfx.mjs と同じ流儀 —— 対象の本・基点・出力の名前と、③④ の欄が違う)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む)
//   ① 退役の本(下の RETIRE)の**内蔵定義そのもの**と presetSigHash・presetSig の sha256 を**この便の html** から凍結する。
//      基点(`--base-rev`・既定 881667c)の署名も並べる(退役は familyRole だけを動かす —— 署名は基点と同じ)。継続先(see の先頭)との**対の差**。
//   ② **宣言を動かした本の前後**(declChanges): 基点と現行の BUILTIN_PRESETS を全本比べ、sampleClass・familyId・familyRole・obsCard の行数が違う本。
//   ③ **廃止の理由の実測**(evidence —— 内蔵の本をそのまま宣言の刻みで走らせる。判定はしない):
//      🔁 mercuryGeoToy3: 刻み physics.stepDt で 360 步 —— 質量の重心と固定した太陽の位置の移動・宣言した一様な移送 u=V(backgroundComplex.A0)の積分 V·t。
//      🔂 mercuryMeshMigrate3d / 🌡️ mercurySunInertial3d / ☄️ mercuryReal: 同じ 360 步 —— 軌道要素(a・e・傾斜・昇交点)・太陽が固定か・重心の最大の移動。
//   ④ **撤去の範囲の一覧**(removalInventory —— 数えるだけ): html の physics.spaceMesh の経路の行・関数・HP の公開口、器(tests/*.mjs)・正本(tests/out/*)・
//      鎖の段(tests/lib-w281a-regentable.mjs の REGEN_STEPS で器が退役の本か spaceMesh を読む段)・QA ブロック(tests/qa.mjs の add の id)。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w300a-retiredfx.mjs [--html beta/index.html] [--base-rev 881667c] [--force]
// 出力: tests/fixtures/retired-w300a.json(W300A_OUT で出力先を変える —— 試走は凍結の写しを書かない)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const HTML = path.resolve(ROOT, arg('--html', 'beta/index.html'));
const BASE_REV = arg('--base-rev', '881667c');
const FORCE = argv.includes('--force');
const OUT_R = process.env.W300A_OUT ? path.resolve(process.env.W300A_OUT) : path.join(ROOT, 'tests', 'fixtures', 'retired-w300a.json');

export const FIXTURE_VERSION = 'w300a-retired-1';
/** 退役 11 本(原仮定者の裁定(第90報)⑤)—— successor は RETIRED_PRESETS の see の先頭(対の差を取る相手) */
export const RETIRE = [
  { id: 'galaxyMeshSpiralGeoToy', successor: 'galaxyMeshSpiral', reason: 'physics.spaceMesh の全面廃止 —— 円盤の原理は 🎠・多粒子の慣性決定力は 🍥' },
  { id: 'galaxyAnalogyBH', successor: 'shapeToySpiralCore', reason: 'physics.spaceMesh の全面廃止 —— 中心天体つきの参照模型 🎢・実在の銀河のアナロジー 🛞' },
  { id: 'galaxyAnalogyBHCompose', successor: 'shapeToySpiralCore', reason: 'physics.spaceMesh の全面廃止(🌚 の写しの合成の診断)' },
  { id: 'galaxyAnalogyBHTilt90', successor: 'coord3dSpinPrecess', reason: 'physics.spaceMesh の全面廃止(中心の軸 90° の写し)' },
  { id: 'galaxyAnalogyBHTilt90Layers', successor: 'layeredCoreDFM', reason: 'physics.spaceMesh の全面廃止(親子コアの層の写し)' },
  { id: 'clusterAnalogyBH', successor: 'tuc47', reason: 'physics.spaceMesh の全面廃止 —— 球状星団の転写 🍇・参照模型 🎱' },
  { id: 'mercuryGeoToy3', successor: 'mercurySunInertial3d', reason: '慣性系の画面に対して重心が移動して行く(一様な移送 u=V の積分)ので誤り —— 水星の三次元は 🌡️・二次元の照合は ☄️' },
  { id: 'mercuryMeshMigrate3d', successor: 'mercurySunInertial3d', reason: '軌道が実在の水星と違う(☄️ の近日点の速度を 30° 回した写し・太陽は固定)—— 水星の三次元は 🌡️' },
  { id: 'charonGeoToy3', successor: 'plutoCharonInertialFit', reason: 'physics.spaceMesh(旧 vMinusU 契約)の全面廃止 —— 🟪・🥶' },
  { id: 'psrDoubleABGeoToy', successor: 'psrDoubleAB', reason: 'physics.spaceMesh(旧 local 法則)の全面廃止 —— 📻' },
  { id: 'spaceMeshBinaryToy', successor: 'binary', reason: 'physics.spaceMesh の全面廃止(メッシュの重力は既にある重力 —— 結論は履歴)' },
];
export const RETIRED_IDS = RETIRE.map((z) => z.id);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
if (fs.existsSync(OUT_R) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない) —— 作り直すときだけ --force');
  process.exit(1);
}
const BODY_KEYS = ['type', 'm', 'radius', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'pinned', 'dragQ', 'n', 'mMin', 'mMax', 'rIn', 'rOut'];
function pairDiff(a, b) {
  const diff = {};
  const keys = [...new Set(Object.keys(a.physics || {}).concat(Object.keys(b.physics || {})))].sort();
  for (const k of keys) { const x = (a.physics || {})[k], y = (b.physics || {})[k];
    if (JSON.stringify(x) !== JSON.stringify(y)) diff['physics.' + k] = [x === undefined ? null : x, y === undefined ? null : y]; }
  const ba = a.bodies || [], bb = b.bodies || [];
  if (ba.length !== bb.length) diff['bodies.length'] = [ba.length, bb.length];
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) {
    for (const k of BODY_KEYS) { const x = ba[i][k], y = bb[i][k];
      if (JSON.stringify(x) !== JSON.stringify(y)) diff[`bodies[${i}].${k}`] = [x === undefined ? null : x, y === undefined ? null : y]; }
  }
  const ks = Object.keys(diff);
  return { n: ks.length, keys: ks.slice(0, 40), spaceMesh: diff['physics.spaceMesh'] ? true : false };
}
// ③ 実測(内蔵の本を宣言の刻みで 360 步 —— 1 公転 ≈360 步の時間の標準)
function evidenceOf(H) {
  const HP = H.HP, B = H.evalExpr('BUILTIN_PRESETS');
  const build = (id) => { const p = B.find((q) => q.id === id); const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if (!v.ok) throw new Error(id + ': ' + JSON.stringify(v.errors).slice(0, 160)); HP.sim.build(v.preset); return { S: HP.sim, p }; };
  const com = (S) => { let M = 0, x = 0, y = 0, z = 0; for (let i = 0; i < S.n; i++) { M += S.m[i]; x += S.m[i] * S.x[i]; y += S.m[i] * S.y[i]; if (S.z) z += S.m[i] * S.z[i]; } return [x / M, y / M, z / M]; };
  const el = (S, c, o) => { const G = S.params.G, c3 = !!S.z;
    const dx = S.x[o] - S.x[c], dy = S.y[o] - S.y[c], dz = c3 ? S.z[o] - S.z[c] : 0, vx = S.vx[o] - S.vx[c], vy = S.vy[o] - S.vy[c], vz = c3 ? S.vz[o] - S.vz[c] : 0;
    const r = Math.hypot(dx, dy, dz), v2 = vx * vx + vy * vy + vz * vz, mu = G * (S.m[c] + S.m[o]), a = 1 / (2 / r - v2 / mu);
    const hx = dy * vz - dz * vy, hy = dz * vx - dx * vz, hz = dx * vy - dy * vx, h = Math.hypot(hx, hy, hz);
    return { r, a, e: Math.sqrt(Math.max(0, 1 - h * h / (mu * a))), inclDeg: Math.acos(hz / h) * 180 / Math.PI, nodeDeg: Math.atan2(hx, -hy) * 180 / Math.PI }; };
  const N = 360, out = {};
  for (const id of ['mercuryGeoToy3', 'mercuryMeshMigrate3d', 'mercurySunInertial3d', 'mercuryReal']) {
    const { S, p } = build(id); const dt = p.physics.stepDt; const c0 = com(S), s0 = [S.x[0], S.y[0], S.z ? S.z[0] : 0], e0 = el(S, 0, 1);
    let maxCom = 0;
    for (let k = 0; k < N; k++) { S.step(dt); const c = com(S); maxCom = Math.max(maxCom, Math.hypot(c[0] - c0[0], c[1] - c0[1], c[2] - c0[2])); }
    const c1 = com(S), e1 = el(S, 0, 1);
    const bg = (p.physics.backgroundComplex || null);
    out[id] = { stepDt: dt, steps: N, t: S.t, coord3d: S.coord3d === true, sunPinned: !!p.bodies[0].pinned,
      barycentre: { t0: c0, end: c1, maxShift: maxCom }, sun: { t0: s0, end: [S.x[0], S.y[0], S.z ? S.z[0] : 0] },
      declaredUniformTransport: bg && Array.isArray(bg.A0) ? { A0: bg.A0, W0: bg.W0, VtimesT: [bg.A0[0] / (bg.W0 || 1) * S.t, bg.A0[1] / (bg.W0 || 1) * S.t] } : null,
      elements: { t0: e0, end: e1 } };
  }
  return out;
}
// ④ 撤去の範囲の一覧(数えるだけ)
async function inventoryOf(html) {
  const L = html.split('\n');
  const reMesh = /spaceMesh|SPACE_MESH|GeoToy|geoToy|meshCoord|_meshCoord|GEO3_|geo3[A-Z]|dfmGeo3|legacy-spaceMesh|toyClosure|lawVersion/;
  const meshLines = L.filter((s) => reMesh.test(s)).length;
  // 関数: 力の経路(退役の本の履歴の走行が使う —— 凍結して残す)と、残す表示・受理の門(撤去の対象でない)に分ける
  const reFn = /SpaceMesh|spaceMesh|GeoToy|geoToy|meshCoord|MeshCoord|Geo3PN|geo3Transport|geo3Init|geo3Hud/;
  const fnNames = [], fnKept = [];
  L.forEach((s) => { const m = s.match(/^(?:async )?function (\w+)\(/) || s.match(/^\s+S\.(\w+)\s*=\s*function/);
    if (m && reFn.test(m[1])) (/Display|Retired|DeclPaths|^draw|^setSpaceMesh|^dfmSpaceMesh/.test(m[1]) ? fnKept : fnNames).push(m[1]); });
  const hpStart = L.findIndex((s) => /^window\.HP\s*=|^const HP\s*=|^\s*window\.HP=/.test(s));
  const ids = RETIRED_IDS.concat(['galaxyMeshSpiralGeoToyLite', 'clusterGrowthCopy', 'fixedCaptureCopy']);
  const reIds = new RegExp('physics\\.spaceMesh|SPACE_MESH_KEY|' + ids.map((z) => '\\b' + z + '\\b').join('|'));
  const lsT = fs.readdirSync(path.join(ROOT, 'tests')).filter((f) => f.endsWith('.mjs') && f !== 'qa.mjs' && f !== path.basename(fileURLToPath(import.meta.url)));
  const harness = lsT.filter((f) => reIds.test(fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8'))).sort();
  const outs = fs.readdirSync(path.join(ROOT, 'tests', 'out')).filter((f) => !f.startsWith('qa-results')).filter((f) => { try { return reIds.test(fs.readFileSync(path.join(ROOT, 'tests', 'out', f), 'utf8')); } catch (e) { return false; } }).sort();
  const RT = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
  const steps = (RT.REGEN_STEPS || []).filter((st) => { const m = String(st.cmd || '').match(/(tests|tools)\/[\w.-]+\.mjs/); if (!m) return false;
    try { return reIds.test(fs.readFileSync(path.join(ROOT, m[0]), 'utf8')); } catch (e) { return false; } }).map((st) => ({ key: st.key, role: st.role || null, sec: st.sec || 0 }));
  const qa = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
  const adds = [...qa.matchAll(/add\('([^']+)'/g)].map((m) => ({ id: m[1], at: m.index }));
  const hitQa = new Set();
  for (const m of qa.matchAll(new RegExp(reIds.source, 'g'))) { const a = adds.find((z) => z.at >= m.index); if (a) hitQa.add(a.id); }
  return { html: { meshLines, functions: fnNames, keptFunctions: fnKept, hpExportLine: hpStart >= 0 ? hpStart + 1 : null, sCoreTouches: 0,
      note: 'S._core の中に spaceMesh 専用の経路は無い(共通フック dragHookKick/dragHookApply は S._hookOn —— 帳簿 dragWork と共用)。経路は S._core の外の関数' },
    harness: { n: harness.length, files: harness }, outs: { n: outs.length, files: outs }, regenSteps: { n: steps.length, steps },
    qaBlocks: { n: hitQa.size, ids: [...hitQa].sort() } };
}
const DECL_KEYS = ['sampleClass', 'familyId', 'familyRole'];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w300a-fx-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hn = loadHtmlHeadless(HTML), Hb = loadHtmlHeadless(basePath);
  const Bn = Hn.evalExpr('BUILTIN_PRESETS'), Bb = Hb.evalExpr('BUILTIN_PRESETS');
  const sigN = Hn.evalExpr('presetSig'), hashN = Hn.evalExpr('presetSigHash');
  const sigB = Hb.evalExpr('presetSig'), hashB = Hb.evalExpr('presetSigHash');
  const RPn = Hn.evalExpr('RETIRED_PRESETS');
  const htmlText = fs.readFileSync(HTML, 'utf8');
  const htmlSha = sha256(htmlText);
  const presets = {};
  for (const row of RETIRE) {
    const id = row.id;
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    if (p.familyRole !== 'retired') throw new Error(id + ' が familyRole:"retired" でない');
    if (!RPn[id]) throw new Error(id + ' の理由が RETIRED_PRESETS に無い');
    const s = row.successor ? Bn.find((q) => q.id === row.successor) : null;
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole,
      familyRoleAtBase: pb.familyRole || null, group: p.group, groupAtBase: pb.group, sampleClass: p.sampleClass || null,
      geoPN: (p.physics || {}).geoPN, coord: (p.physics || {}).coord || '2d', spaceMesh: (p.physics || {}).spaceMesh || null,
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), name: pb.name, sigSame: sigN(p) === sigB(pb) },
      successor: row.successor, reason: row.reason, retiredNotice: { ja: RPn[id].ja, en: RPn[id].en, see: RPn[id].see },
      pairDiff: s ? Object.assign({ successor: s.id, successorEmoji: s.emoji || '' }, pairDiff(p, s)) : null,
      raw: JSON.parse(JSON.stringify(p)) };
  }
  const declChanges = [];
  for (const p of Bn) {
    const pb = Bb.find((q) => q.id === p.id);
    if (!pb) { declChanges.push({ id: p.id, emoji: p.emoji || '', added: true }); continue; }
    const ch = {};
    for (const k of DECL_KEYS) if ((p[k] || null) !== (pb[k] || null)) ch[k] = [pb[k] || null, p[k] || null];
    const ocN = (p.obsCard || []).length, ocB = (pb.obsCard || []).length;
    if (ocN !== ocB) ch.obsCardRows = [ocB, ocN];
    if (Object.keys(ch).length) declChanges.push({ id: p.id, emoji: p.emoji || '', change: ch, presetSigSame: sigN(p) === sigB(pb),
      presetSigHash: hashN(p), physicsSame: JSON.stringify(p.physics || null) === JSON.stringify(pb.physics || null),
      bodiesSame: JSON.stringify(p.bodies || null) === JSON.stringify(pb.bodies || null) });
  }
  const evidence = evidenceOf(Hn);
  const removalInventory = await inventoryOf(htmlText);
  const fx = { fixtureVersion: FIXTURE_VERSION,
    note: '退役 11 本(physics.spaceMesh を宣言した在位 10 本 🪁🌚🧩🛸🪆💮🔁🌒🩻🪟 と移行の写し 🔂 —— 原仮定者の裁定(第90報)⑤)の凍結資産(書き換えない)。'
      + '退役の本は BUILTIN_PRESETS から消していない(旧セーブ・履歴の正本・鎖の器が ID で開く)。presetSig は基点と同じ(宣言の欄は署名の外)。'
      + 'evidence は廃止の理由の実測(判定しない)・removalInventory は物理コードの撤去の範囲を決めるための一覧(数えるだけ —— 撤去はしていない)。',
    ids: RETIRED_IDS, presets, declChanges, evidence, removalInventory,
    wave: '第300便a', ruling: '原仮定者の裁定(第90報)⑤・統括の検証項目 R175', frozen: true,
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第300便a の html(11 本の退役の宣言と受理の拒否を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) } };
  fs.mkdirSync(path.dirname(OUT_R), { recursive: true });
  fs.writeFileSync(OUT_R, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT_R), bytes: fs.statSync(OUT_R).size, htmlSha: htmlSha.slice(0, 12),
    retired: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '' : '(基点 ' + presets[id].base.presetSigHash + ')') + ' 対の差 ' + (presets[id].pairDiff ? presets[id].pairDiff.n : '—')])),
    declChanges: declChanges.map((z) => z.id + ':' + Object.keys(z.change || { added: 1 }).join('・') + (z.presetSigSame === false ? '(署名差)' : '')),
    evidence: Object.fromEntries(Object.entries(evidence).map(([k, v]) => [k, { comMax: v.barycentre.maxShift, sunEnd: v.sun.end[0], incl: v.elements.t0.inclDeg, node: v.elements.t0.nodeDeg, a: v.elements.end.a, e: v.elements.end.e, VT: v.declaredUniformTransport && v.declaredUniformTransport.VtimesT[0] }])),
    inventory: { meshLines: removalInventory.html.meshLines, fns: removalInventory.html.functions.length, harness: removalInventory.harness.n, outs: removalInventory.outs.n, steps: removalInventory.regenSteps.n, qa: removalInventory.qaBlocks.n } }, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
