// 第288便c(原仮定者の裁定(第78報)⑧「重力は天体同士の総当たりで成立し精度も高い・場の数値計算は精度が低く重い」・統括の検証項目 R115)——
// **pair 巡回の融合**(`dfmGeoToySpinStep` の源の加速度と u・∇u・∂ₜu の 2 巡回で、非順序対の s・1/√s・s^{−p/2} を 1 回だけ作って再利用)の受入の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 短い走行のビット同一: 🌚 galaxyAnalogyBH・💮 clusterAnalogyBH・🌰 clusterGrowthCopy(centerSpin:"read" の 3 本 —— 融合の経路)と
//       🪁 galaxyMeshSpiralGeoToy(対照 —— 既定のトイ `dfmGeoToyStep` の経路で融合しない)を、同じ初期状態・同じ刻み dt=0.016 で
//       融合 OFF(`S.pairFuseOff=true` —— 従来の 2 巡回)と ON で走らせ、全状態(n・t・x・y・vx・vy・spin・m・R・捕獲の数)をビットで比べる。
//       基点 940dba52 の同じ走行の指紋は宣言値(BEFORE_940 —— W288C_BASE=<基点 html> で子プロセスで測り直して照合)。
//   (B) 🌰 の門の走行(第287便a の器 exp-w287a-growth.mjs の runOne・宣言の順行 × 乱数種 3 —— 正本 growth-w287a.json の speed.growthTotal と同じ N・同じ門)を
//       OFF/ON で走らせ、壁時計以外の結果(標本・捕獲の帳簿・門・摂動の復元)が一致すること。壁時計の和の前後。
//   (C) 💮 の Jeans 初期値の走行(第286便a の器 exp-w286a-cluster.mjs の runOne・宣言の構成 × 乱数種 3 —— growth-w287a.json の speed.jeansTotal と同じ N・同じ門):
//       1 本 ≈10 分 × 6 なので**宣言値**(JEANS_W288C —— 枝の実測。W288C_FULL=1 で子プロセスで測り直す)。壁時計以外の結果の一致と壁時計の前後。
//   「改善率」は**同じ N・同じ門・同じ機械の同じ時間帯**でだけ出す(壁時計は機械の負荷で動く —— 安定 hash の除外語彙 wallSec)。
//
// ■ しないこと・言わないこと
//   ・物理を変えない(ビット同一が受入 —— 違えば丸め床を宣言して理由を書く。本器の実測は全件ビット同一)。
//   ・「格子を撤去して軽くなった」と書かない(場の格子は元から無い —— 軽くなったのは対の係数の再利用と呼び出しごとの組み立ての分)。
//   ・重力(E4 の対ごと)を格子へ移さない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w288c-pairfuse.mjs [W288C_BASE=beta/_w288_base.html] [W288C_FULL=1]
// 読む正本: なし(html だけ)。正本: tests/out/pairfuse-w288c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["clusterAnalogyBH","clusterGrowthCopy","galaxyAnalogyBH","galaxyMeshSpiralGeoToy","gas"],"roots":["$","CENTER_CAPTURE_VERSION","CONTACT_MODE_KEY","DT","HP.PAIR_FUSE_VERSION","HP.allPresets","HP.dfmCenterCaptureStep","HP.dfmField","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.frameWeightIsPull","HP.frameWeightPow","HP.sim","HP.validatePreset","T","centerCaptureCheck","ch","contactNoneOf","ctx","cw","dfmCenterCaptureStep","dfmField","dfmFieldContract","dfmGeoToySpinStep","dfmGeoToyStep","dfmSpinPairField","dfmSpinPairFuse","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile","lensExcludedRows","rayHeavy","rayMassMin","sim","traceRay","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288c-pairfuse-1';
export const DT = 0.016;
/** (A) の走行(本・步数)。 */
export const SHORT = Object.freeze([
  Object.freeze({ id: 'galaxyAnalogyBH', emoji: '🌚', steps: 600, fused: true }),
  Object.freeze({ id: 'clusterAnalogyBH', emoji: '💮', steps: 300, fused: true }),
  Object.freeze({ id: 'clusterGrowthCopy', emoji: '🌰', steps: 600, fused: true }),
  Object.freeze({ id: 'galaxyMeshSpiralGeoToy', emoji: '🪁', steps: 300, fused: false })]);
/** 基点 940dba52 の (A) の指紋(枝の実測 —— W288C_BASE=beta/_w288_base.html で本器の --probe を子プロセスで走らせた値)。 */
export const BEFORE_940 = { rev: '940dba52', how: '枝の実測(W288C_BASE=beta/_w288_base.html で --probe を子プロセスで走らせた値 —— 基点 html は CI に無いので宣言値で持つ)',
  sha: { galaxyAnalogyBH: 'a10d549cc5826d32af0d43f0227c18e8090ffe478d032ade220caa7a0d055e3e', clusterAnalogyBH: '594604fd72b984da10257d4153c1640a171aeca475a7f5278d3d1689cb055423',
    clusterGrowthCopy: '4db1709495d5f078e27bc1655b36cb359950374c29d906002dbedbccce062f29', galaxyMeshSpiralGeoToy: 'bb37d6af6493c869b638014db12d4011241fd3e230f8f4172861064afccd0642' } };
/**
 * (C) 💮 の Jeans 初期値の走行 3 本の OFF/ON(枝の実測 —— W288C_FULL=1 で測り直す)。
 * 同じ乱数種の OFF と ON を**同時に**子プロセスで走らせた(同じ時間帯の負荷を両方が受ける)。resultSha = 壁時計を除いた結果の JSON の sha256。
 */
export const JEANS_W288C = Object.freeze({"how": "同じ乱数種の OFF と ON を同時に子プロセスで走らせた(同じ時間帯)(枝の実測 2026-09-30・他の枝の器と同じ機械を共有した時間帯)", "measuredAt": "2026-09-30", "rows": [{"key": "r20-v0.1-mc1/8.5-s12-seed0", "steps": 7021, "verdict": "未達", "resultSha": "ed132d7b0357eaa113259d0cdab5bda9de7ba4550035b4dac20c25b488e34450", "sameResult": true, "wallSec": {"off": 711.768, "on": 435.823}, "fuseSteps": 7021, "fuseStepsOff": 0}, {"key": "r20-v0.1-mc1/8.5-s12-seed1", "steps": 7081, "verdict": "未達", "resultSha": "ca04dc129ff896c1ee43ac9344b71c6aa98dc148f7231809039437d150056268", "sameResult": true, "wallSec": {"off": 782.01, "on": 496.571}, "fuseSteps": 7081, "fuseStepsOff": 0}, {"key": "r20-v0.1-mc1/8.5-s12-seed2", "steps": 7009, "verdict": "未達", "resultSha": "d02a0df8f18165ef3a7ebd10f3cd99ae276d1ba5c25f8ddb8403b926b5c2410b", "sameResult": true, "wallSec": {"off": 588.202, "on": 301.439}, "fuseSteps": 7009, "fuseStepsOff": 0}], "steps": 21111, "wallSec": {"off": 2081.98, "on": 1233.833}, "ok": true});
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
/** 状態の指紋(n・t と全天体の x・y・vx・vy・spin・m・R —— Float64 のバイト列の sha256)と捕獲の数。 */
export function stateOf(S) {
  const n = S.n, f = new Float64Array(2 + 7 * n);
  f[0] = n; f[1] = S.t;
  for (let i = 0; i < n; i++) { const o = 2 + 7 * i; f[o] = S.x[i]; f[o + 1] = S.y[i]; f[o + 2] = S.vx[i]; f[o + 3] = S.vy[i]; f[o + 4] = S.spin ? S.spin[i] : 0; f[o + 5] = S.m[i]; f[o + 6] = S.R[i]; }
  return { n, t: S.t, sha: crypto.createHash('sha256').update(Buffer.from(f.buffer)).digest('hex'), nCap: S.capture ? S.capture.nCap : null, stop: S.geoToyStop || null };
}
function runShort(HP, spec, off) {
  const v = HP.validatePreset(clone(find(HP, spec.id)));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors)).slice(0, 200) };
  HP.sim.build(v.preset);
  const S = HP.sim; S.pairFuseOff = off;
  const t0 = process.hrtime.bigint();
  for (let k = 0; k < spec.steps; k++) S.step(DT);
  const wallSec = Number(process.hrtime.bigint() - t0) / 1e9;
  const st = stateOf(S);
  S.pairFuseOff = false;
  return Object.assign({ ok: true, steps: spec.steps, wallSec, fuseSteps: S.pairFuseSteps || 0 }, st);
}
/** (A) OFF/ON のビット同一。 */
export function shortRuns(HP) {
  const rows = SHORT.map((spec) => {
    const off = runShort(HP, spec, true), on = runShort(HP, spec, false);
    const bitSame = off.ok && on.ok && off.sha === on.sha && off.nCap === on.nCap && off.stop === on.stop;
    return { id: spec.id, emoji: spec.emoji, steps: spec.steps, n: on.n, fusedPath: spec.fused, fuseSteps: on.fuseSteps, fuseStepsOff: off.fuseSteps,
      sha: on.sha, bitSame, stop: on.stop, nCap: on.nCap, wallSec: { off: off.wallSec, on: on.wallSec } };
  });
  return { dt: DT, rows, ok: rows.every((r) => r.bitSame && (r.fusedPath ? (r.fuseSteps === r.steps && r.fuseStepsOff === 0) : r.fuseSteps === 0)) };
}
/** 基点で測る部分(子プロセス用 —— 基点には融合が無いので OFF/ON の区別なし)。 */
export function baseProbe(HP) {
  return SHORT.map((spec) => { const r = runShort(HP, spec, true); return { id: spec.id, sha: r.sha, nCap: r.nCap, stop: r.stop }; });
}
const stripWall = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'wallSec' || k === 'spentSec') ? undefined : v));
/** (B) 🌰 の門の走行(順行 × 乱数種 3)の OFF/ON。 */
export async function growthRuns(HP) {
  const E287 = await import('./exp-w287a-growth.mjs');
  const specs = E287.RUNS.filter((r) => r.orbit === 'pro');
  const rows = [];
  for (const spec of specs) {
    HP.sim.pairFuseOff = true; const off = E287.runOne(HP, spec);
    HP.sim.pairFuseOff = false; const on = E287.runOne(HP, spec);
    const a = JSON.stringify(stripWall(off)), b = JSON.stringify(stripWall(on));
    rows.push({ key: spec.key, steps: on.steps, verdict: on.gates.verdict, resultSha: sha(b), sameResult: a === b, wallSec: { off: off.wallSec, on: on.wallSec } });
  }
  const tot = (k) => rows.reduce((s, r) => s + r.wallSec[k], 0);
  return { harness: E287.HARNESS_VERSION, rows, steps: rows.reduce((s, r) => s + r.steps, 0), wallSec: { off: tot('off'), on: tot('on') }, ok: rows.every((r) => r.sameResult) };
}
/** (C) の子プロセス: `--jeans <添字> <off|on> <html>` —— 第286便a の runOne を 1 本走らせて {key, steps, verdict, resultSha, wallSec}。 */
async function jeansChild(idx, mode, html) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.resolve(ROOT, html));
  const E286 = await import('./exp-w286a-cluster.mjs');
  const spec = E286.RUNS.filter((r) => r.group === 'declared')[idx];
  HP.sim.pairFuseOff = (mode === 'off');
  const r = E286.runOne(HP, spec);
  return { key: spec.key, mode, steps: r.steps, verdict: r.gates.verdict, resultSha: sha(JSON.stringify(stripWall(r))), wallSec: r.wallSec, fuseSteps: HP.sim.pairFuseSteps || 0 };
}
function child(args) {
  return new Promise((res, rej) => {
    const p = spawn(process.execPath, [fileURLToPath(import.meta.url)].concat(args), { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] });
    let out = ''; p.stdout.on('data', (d) => { out += d; });
    p.on('close', (c) => (c === 0 ? res(JSON.parse(out)) : rej(new Error('child ' + args.join(' ') + ' rc ' + c))));
  });
}
export async function jeansFull(html) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const [off, on] = await Promise.all([child(['--jeans', String(i), 'off', html]), child(['--jeans', String(i), 'on', html])]);
    rows.push({ key: on.key, steps: on.steps, verdict: on.verdict, resultSha: on.resultSha, sameResult: off.resultSha === on.resultSha && off.steps === on.steps,
      wallSec: { off: off.wallSec, on: on.wallSec }, fuseSteps: on.fuseSteps, fuseStepsOff: off.fuseSteps });
    console.error(`(C) ${on.key}: 步 ${on.steps} ${on.verdict} 一致 ${rows[i].sameResult} 壁時計 OFF ${off.wallSec.toFixed(1)} s / ON ${on.wallSec.toFixed(1)} s`);
  }
  const tot = (k) => rows.reduce((s, r) => s + r.wallSec[k], 0);
  return { how: '同じ乱数種の OFF と ON を同時に子プロセスで走らせた(同じ時間帯)', rows, steps: rows.reduce((s, r) => s + r.steps, 0), wallSec: { off: tot('off'), on: tot('on') },
    ok: rows.every((r) => r.sameResult) };
}
/** PHYSICS〔第288便c〕の表の行(QA docs が照合する —— 壁時計は写さない)。 */
export function docRows(J) {
  return J.short.rows.map((r) => `| ${r.emoji} ${r.id} | ${r.n} | ${r.steps} | ${r.fusedPath ? '融合' : '対照(既定のトイ)'} | ${r.bitSame ? 'ビット同一' : '不一致'} | ${J.before && J.before.sha ? (J.before.sha[r.id] === r.sha ? 'ビット同一' : '不一致') : '—'} |`);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv[2] === '--probe') {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.resolve(ROOT, process.argv[3]));
  process.stdout.write(JSON.stringify(baseProbe(HP)));
} else if (IS_MAIN && process.argv[2] === '--jeans') {
  process.stdout.write(JSON.stringify(await jeansChild(+process.argv[3], process.argv[4], process.argv[5])));
} else if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W288C_OUT || path.join(ROOT, 'tests', 'out', 'pairfuse-w288c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const short = shortRuns(HP);
  for (const r of short.rows) console.log(`(A) ${r.emoji} ${r.id} n=${r.n} ${r.steps} 步: ビット同一 ${r.bitSame}・融合 ${r.fuseSteps}/${r.steps}・壁時計 OFF ${r.wallSec.off.toFixed(2)} s / ON ${r.wallSec.on.toFixed(2)} s`);
  const before = clone(BEFORE_940);
  if (process.env.W288C_BASE) {
    const live = JSON.parse(execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--probe', process.env.W288C_BASE], { cwd: ROOT, maxBuffer: 1 << 26 }).toString());
    const liveSha = Object.fromEntries(live.map((z) => [z.id, z.sha]));
    console.log('基点(子プロセス): ' + JSON.stringify(liveSha));
    if (BEFORE_940.sha && JSON.stringify(liveSha) !== JSON.stringify(BEFORE_940.sha)) { console.error('基点の測り直しが宣言値 BEFORE_940 と違う'); process.exit(1); }
  }
  const baseSame = before.sha ? short.rows.every((r) => before.sha[r.id] === r.sha) : null;
  console.log(`(A) 基点との指紋の一致 ${baseSame}`);
  const growth = await growthRuns(HP);
  for (const r of growth.rows) console.log(`(B) ${r.key}: 步 ${r.steps} ${r.verdict} 結果の一致 ${r.sameResult} 壁時計 OFF ${r.wallSec.off.toFixed(1)} / ON ${r.wallSec.on.toFixed(1)} s`);
  let jeans = JEANS_W288C ? clone(JEANS_W288C) : null;
  if (process.env.W288C_FULL) { jeans = await jeansFull(TARGET); console.log('(C) ' + JSON.stringify(jeans.wallSec)); }
  const CODE = ['tests/exp-w288c-pairfuse.mjs', 'tests/exp-w287a-growth.mjs', 'tests/lib-w287a-growth.mjs', 'tests/exp-w286a-cluster.mjs', 'tests/exp-w283f-cluster.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length, fuseVersion: HP.PAIR_FUSE_VERSION,
    ruling: '原仮定者の裁定(第78報)⑧(重力は総当たりで成立し精度も高い・場の数値計算は精度が低く重い)・統括の検証項目 R115(pair の距離・逆距離・重みを再利用・加速度確定後の第 2 巡回は残す・受入はビット同一)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    baseRev: '940dba52', notClaim: ['格子を撤去して軽くなった', '重力を格子へ移した', '新発見'] });
  // 比 OFF/ON は壁時計の欄の中に置く(欄ごと安定 hash の除外 —— volatilePaths)
  const sp = (w) => ({ off: w.off, on: w.on, ratioOffOn: w.off / w.on });
  const speed = { growth: { steps: growth.steps, sameResult: growth.ok, wallSec: sp(growth.wallSec) },
    jeans: jeans ? { steps: jeans.steps, sameResult: jeans.ok, wallSec: sp(jeans.wallSec) } : null,
    note: '壁時計は同じ機械・同じ時間帯の OFF/ON(機械の負荷で動く —— 鍵 wallSec は安定 hash の除外語彙)。改善率は同じ N・同じ門でだけ' };
  const out = { meta, short, before, baseSame, growth, jeans, speed, elapsedS: (Date.now() - t0) / 1000 };
  out.ok = short.ok && growth.ok && (!jeans || jeans.ok) && baseSame !== false;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}
