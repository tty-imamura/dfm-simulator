// 第288便c(原仮定者の裁定(第78報)⑧・第78報で閉じた AN86・統括の検証項目 R115)—— **時間の契約の範囲外の旗**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 反例 3 件: 🌒 charonGeoToy3 の源の台帳(太陽 1 源)を **taylor の契約**(radiusR・widthT を宣言 —— 範囲の外は台帳から再展開)に写し、
//       `bgTimeMomentsAt` を (1) τ=widthT+1 (2) τ=−widthT−1 (3) 空間と時間の両超過 で呼ぶ。再展開は同じ X+Vτ+½aτ² の近似軌道を
//       幅の外まで延ばしただけなので**時間の有効性は回復しない** → out=true が正しい(基点 940dba52 は out=false・reexp=true —— 0/3)。
//       対照: (4) 空間だけの超過(源から再評価できる → out=false・reexp=true のまま)・(5) 範囲内(out=false・reexp=false)。
//       再展開した値は sources 経路(同じ台帳・同じ τ)とビット一致(値は変えない —— 旗だけ)。
//   (B) 🌒(sources 経路)の前後: 同じ初期状態・dt=0.016 で N_STEPS 步の状態の指紋(sha256)。基点の値は宣言値(BEFORE_940 ——
//       枝の実測。W288C_BASE=<基点 html> を渡すと子プロセスで測り直して照合する —— 基点 html は CI に無い)。
//   (C) AN86 の印: 🌒 を 2 周(同方向)走らせ、有効幅を超えた步の数(`S.meshVelTimeOutSteps` —— 再展開しない・数えるだけ)と器の独立の数え
//       (步の終わりの |t−t₀|>widthT —— 場は S._core が時刻を進めた後に評価される)を照合し、観測比較の旗 contractRange("範囲内"/"契約範囲外")を出す。対照に widthT を 3000 へ縮めた写し
//       (2 周の途中で超える)—— 超えても軌道は元とビット同一(sources は値を作り直すだけ・旗だけが立つ)。**判定は変えない**(旗を正本に出すだけ)。
//   (D) 棚卸し: 内蔵で timeContract を宣言する本(🌒 だけ)と観測結果カードの行の出る本。
//
// ■ しないこと・言わないこと
//   ・有効幅を超えても再展開しない(AN86)。範囲外の走行を観測比較から除外する評価器はまだ接続しない(決断事項候補)。
//   ・「複素場を接続した」「観測と合った」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w288c-bgrange.mjs   [W288C_BASE=beta/_w288_base.html で基点を子プロセスで測り直す]
// 読む正本: なし(html だけ)。正本: tests/out/bgrange-w288c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.BGC_TIME_VERSION","HP.allPresets","HP.bgRangeCardInfo","HP.bgTimeMomentsAt","HP.bgTimePrepare","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","T","bgTimeMomentsAt","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288c-bgrange-1';
export const DT = 0.016;
export const N_STEPS = 20000;
/** 🌒 を縮めた写しの有効幅(2 周 ≈ 11036 単位の途中で超える)。 */
export const SHORT_WIDTH_T = 3000;
/** taylor の写しの空間有効半径(🌒 の二体の重心からの距離 2.1・17.5 単位の外側)。 */
export const TAYLOR_RADIUS_R = 100;
/** 基点 940dba52 の値(枝の実測 —— 同じ器の cases と fingerprint を基点の beta/index.html で走らせた値。基点 html は CI に無いので宣言値で持つ)。 */
export const BEFORE_940 = { rev: '940dba52', how: '枝の実測(W288C_BASE=beta/_w288_base.html で本器の baseProbe を子プロセスで走らせた値)',
  cases: [{ key: 'timePlus', out: false, reexp: true }, { key: 'timeMinus', out: false, reexp: true }, { key: 'timeAndSpace', out: false, reexp: true },
    { key: 'spaceOnly', out: false, reexp: true }, { key: 'inside', out: false, reexp: false }],
  fingerprint: { steps: 20000, dt: 0.016, sha256: '5aee79be4bc0dea29c0763fa8ee720aa8eb1c44841de6ce723cf1992d1476ac5' } };
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, p) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors || v.err)).slice(0, 300) };
  HP.sim.build(v.preset);
  return { ok: true, S: HP.sim };
}
const flat = (m) => [m.W].concat(m.A, m.gradW, m.gradA, [m.dWdt], m.dAdt);
const sameBits = (a, b) => { const x = flat(a), y = flat(b); return x.length === y.length && x.every((v, i) => Object.is(v, y[i])); };

/** 🌒 の源の台帳を taylor の契約に写した背景(受理器を通した正準形)と sources の実行形。 */
export function taylorCopy(HP) {
  const B0 = clone(find(HP, 'charonGeoToy3').physics.backgroundComplex);
  const widthT = B0.timeContract.widthT;
  B0.timeContract = { mode: 'taylor', t0: B0.timeContract.t0, derivFrame: 'frame', radiusR: TAYLOR_RADIUS_R, widthT };
  const v = HP.validateBackgroundComplex(B0);
  if (!v.ok) return { ok: false, err: v.err };
  const B = v.backgroundComplex, T = HP.bgTimePrepare(B), Ts = Object.assign({}, T, { mode: 'sources' });
  return { ok: true, B, T, Ts, widthT };
}
/** (A) 反例 3 件と対照 2 件。 */
export function cases(HP) {
  const c = taylorCopy(HP);
  if (!c.ok) return { ok: false, err: c.err };
  const { B, T, Ts, widthT } = c;
  const inR = [3, -4], outR = [TAYLOR_RADIUS_R + 50, 0];
  const C = [
    { key: 'timePlus', label: 'τ=widthT+1(時間だけ超過)', dx: inR, tau: widthT + 1, want: { out: true, reexp: true }, counter: true },
    { key: 'timeMinus', label: 'τ=−widthT−1(時間だけ超過・過去側)', dx: inR, tau: -widthT - 1, want: { out: true, reexp: true }, counter: true },
    { key: 'timeAndSpace', label: '空間と時間の両超過', dx: outR, tau: widthT + 1, want: { out: true, reexp: true }, counter: true },
    { key: 'spaceOnly', label: '空間だけの超過(対照 —— 源から再評価できる)', dx: outR, tau: 5, want: { out: false, reexp: true }, counter: false },
    { key: 'inside', label: '範囲内(対照 —— 一次のまま)', dx: inR, tau: 5, want: { out: false, reexp: false }, counter: false }];
  const rows = C.map((z) => {
    const r = HP.bgTimeMomentsAt(B, T, z.dx[0], z.dx[1], z.tau);
    const s = HP.bgTimeMomentsAt(B, Ts, z.dx[0], z.dx[1], z.tau);
    const same = (r.ok && s.ok) ? sameBits(r.bg, s.bg) : null;
    return { key: z.key, label: z.label, dx: z.dx, tau: z.tau, counter: z.counter, out: r.out, reexp: r.reexp, want: z.want,
      pass: r.ok && r.out === z.want.out && r.reexp === z.want.reexp, sameAsSources: z.want.reexp ? same : null, W: r.ok ? r.bg.W : null };
  });
  const counter = rows.filter((r) => r.counter);
  return { widthT, radiusR: TAYLOR_RADIUS_R, contract: { mode: T.mode, t0: T.t0, widthT: T.widthT, radiusR: T.radiusR }, rows,
    counterPass: counter.filter((r) => r.pass).length, counterN: counter.length,
    ok: rows.every((r) => r.pass) && rows.filter((r) => r.want.reexp).every((r) => r.sameAsSources === true) };
}
/** (B) 🌒 の状態の指紋(同じ初期状態・N_STEPS 步)。 */
export function fingerprint(HP) {
  const b = build(HP, find(HP, 'charonGeoToy3'));
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S;
  for (let k = 0; k < N_STEPS; k++) S.step(DT);
  const f = new Float64Array(8 + 1); f.set([S.x[0], S.y[0], S.x[1], S.y[1], S.vx[0], S.vy[0], S.vx[1], S.vy[1], S.t]);
  return { ok: true, steps: N_STEPS, dt: DT, sha256: crypto.createHash('sha256').update(Buffer.from(f.buffer)).digest('hex'),
    state: Array.from(f), timeOut: S.meshVelTimeOut || 0, timeReexp: S.meshVelTimeReexp || 0 };
}
/** 基点 html で測る部分(子プロセス用)。 */
export function baseProbe(HP) {
  const c = cases(HP);
  return { cases: c.rows ? c.rows.map((r) => ({ key: r.key, out: r.out, reexp: r.reexp })) : null, fingerprint: fingerprint(HP) };
}
/** (C) 🌒 の 2 周の走行と、範囲外の步の数え・観測比較の旗。 */
export function runFlag(HP, P, widthOverride) {
  const Q = clone(P);
  if (widthOverride !== undefined) { Q.physics.backgroundComplex.timeContract.widthT = widthOverride; Q.id = 'w288cCharonShortWidth'; }
  const b = build(HP, Q);
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S, tc = S.meshVel && S.meshVel.bg ? S.meshVel.bg.time : null;
  if (!tc) return { ok: false, err: 'timeContract なし' };
  const ang = () => Math.atan2(S.y[1] - S.y[0], S.x[1] - S.x[0]);
  let prev = ang(), cum = 0, steps = 0, mine = 0;
  const goal = 4 * Math.PI, maxSteps = Math.ceil(3 * 5600 / DT);
  while (Math.abs(cum) < goal && steps < maxSteps) {
    S.step(DT); steps++;
    if (Math.abs(S.t - tc.t0) > tc.widthT) mine++;          // 器の独立の数え(場は S._core が t を進めた後に評価する —— 步の終わりの |t−t₀|)
    const a = ang(); let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; cum += d; prev = a;
  }
  const n = S.meshVelTimeOutSteps || 0;
  return { ok: Math.abs(cum) >= goal, widthT: tc.widthT, steps, tEnd: S.t, timeOutSteps: n, timeOutEvals: S.meshVelTimeOut || 0, timeReexp: S.meshVelTimeReexp || 0,
    harnessCount: mine, countsAgree: n === mine, contractRange: n > 0 ? '契約範囲外' : '範囲内',
    state: [S.x[0], S.y[0], S.x[1], S.y[1], S.vx[0], S.vy[0], S.vx[1], S.vy[1]] };
}
export function flags(HP) {
  const P = find(HP, 'charonGeoToy3');
  const base = runFlag(HP, P), short = runFlag(HP, P, SHORT_WIDTH_T);
  const bitSame = base.ok && short.ok && base.steps === short.steps && base.state.every((v, i) => Object.is(v, short.state[i]));
  return { base, short, shortBitSameAsBase: bitSame,
    // 観測比較の旗(器が読む —— 判定は変えない): 走行ごとに「範囲内/契約範囲外」
    observationFlags: [{ preset: 'charonGeoToy3', run: '2 周(同方向)・宣言の widthT', contractRange: base.contractRange, timeOutSteps: base.timeOutSteps },
      { preset: 'w288cCharonShortWidth(器の中だけの写し)', run: '2 周(同方向)・widthT=' + SHORT_WIDTH_T, contractRange: short.contractRange, timeOutSteps: short.timeOutSteps }],
    ok: base.ok && short.ok && base.timeOutSteps === 0 && base.countsAgree && short.countsAgree && short.timeOutSteps > 0 && bitSame };
}
/** (D) 棚卸し。 */
export function census(HP) {
  const all = HP.allPresets();
  const declared = all.filter((p) => p.physics && p.physics.backgroundComplex && p.physics.backgroundComplex.timeContract).map((p) => p.id);
  const cardRow = [];
  for (const id of declared) { const b = build(HP, find(HP, id)); if (b.ok && HP.bgRangeCardInfo && HP.bgRangeCardInfo()) cardRow.push(id); }
  return { nPresets: all.length, timeContract: declared, cardRow, version: HP.BGC_TIME_VERSION, ok: declared.length === 1 && declared[0] === 'charonGeoToy3' && cardRow.join() === declared.join() };
}
export function computeAll(HP) {
  return { cases: cases(HP), fingerprint: fingerprint(HP), flags: flags(HP), census: census(HP), htmlVersion: HP.BGC_TIME_VERSION };
}
/** PHYSICS〔第288便c〕の表の行(QA docs が照合する)。 */
export function docRows(J) {
  const yn = (b) => (b ? 'true' : 'false');
  const bef = new Map((J.before.cases || []).map((z) => [z.key, z]));
  return J.cases.rows.map((r) => `| ${r.label} | ${r.tau} | ${bef.has(r.key) ? yn(bef.get(r.key).out) + '/' + yn(bef.get(r.key).reexp) : '—'} | ${yn(r.out)}/${yn(r.reexp)} | ${r.sameAsSources === null ? '—' : (r.sameAsSources ? 'ビット一致' : '不一致')} |`);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv[2] === '--probe') {
  // 子プロセス: 指定の html で baseProbe を走らせて JSON を標準出力へ
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.resolve(ROOT, process.argv[3]));
  process.stdout.write(JSON.stringify(baseProbe(HP)));
} else if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W288C_OUT || path.join(ROOT, 'tests', 'out', 'bgrange-w288c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  for (const r of R.cases.rows) console.log(`(A) ${r.key}: out ${r.out} reexp ${r.reexp}(期待 ${JSON.stringify(r.want)})${r.pass ? '' : ' ✗'} sources とビット一致 ${r.sameAsSources}`);
  console.log(`(A) 反例 ${R.cases.counterPass}/${R.cases.counterN}`);
  console.log(`(B) 🌒 ${R.fingerprint.steps} 步 sha ${R.fingerprint.sha256.slice(0, 16)}… timeOut ${R.fingerprint.timeOut}`);
  console.log(`(C) ${JSON.stringify(R.flags.observationFlags)} 短縮の写しは元とビット同一 ${R.flags.shortBitSameAsBase}・数えの一致 ${R.flags.base.countsAgree}/${R.flags.short.countsAgree}`);
  console.log(`(D) ${JSON.stringify(R.census)}`);
  const before = clone(BEFORE_940);
  let baseLive = null;
  if (process.env.W288C_BASE) {
    const txt = execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--probe', process.env.W288C_BASE], { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
    baseLive = JSON.parse(txt);
    // 測り直した基点が宣言値と同じことだけを印す(正本の中身は基点 html の有無で変えない —— CI では宣言値だけ)
    if (baseLive.fingerprint.sha256 !== BEFORE_940.fingerprint.sha256 || JSON.stringify(baseLive.cases) !== JSON.stringify(BEFORE_940.cases)) {
      console.error('基点の測り直しが宣言値 BEFORE_940 と違う —— 宣言を見直すこと'); process.exit(1);
    }
    console.log(`基点(子プロセス): ${JSON.stringify(baseLive.cases)} 宣言と一致・指紋 ${baseLive.fingerprint.sha256.slice(0, 16)}…`);
  }
  const beforeAfter = { counterBefore: BEFORE_940.cases.filter((z) => ['timePlus', 'timeMinus', 'timeAndSpace'].includes(z.key) && z.out === true).length,
    counterAfter: R.cases.counterPass, controlsSame: ['spaceOnly', 'inside'].every((k) => { const a = BEFORE_940.cases.find((z) => z.key === k), b = R.cases.rows.find((z) => z.key === k); return a.out === b.out && a.reexp === b.reexp; }),
    charonBitSame: before.fingerprint.sha256 === R.fingerprint.sha256 };
  console.log(`前後: 反例 ${beforeAfter.counterBefore}/3 → ${beforeAfter.counterAfter}/3・対照 ${beforeAfter.controlsSame}・🌒 のビット同一 ${beforeAfter.charonBitSame}`);
  const CODE = ['tests/exp-w288c-bgrange.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第78報)⑧と第78報で閉じた AN86(有効幅を超えても再展開しない・超えた歩数を観測結果カードに出す・超えた走行を含む観測比較は「契約範囲外」)・統括の検証項目 R115',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    baseRev: '940dba52', notClaim: ['複素場を接続した', '観測と合った', '新発見'] });
  const out = { meta, ...R, before, beforeAfter, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)');
}
