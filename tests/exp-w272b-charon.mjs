// 第272便b(第62報「カロン」「引きずり」)— **❄️ 冥王星–カロンの対照系列 C0〜C7/S(診断のみ)**。
//
// ■ 何をするか / しないか
//   ・内蔵プリセット ❄️ `plutoCharonReal` の**診断コピー**(JSON の複製)だけを走らせる。
//     **内蔵 124 本は 1 bit も変えない**(kFrame<1・geoPN=3・f≠1 はこの器の中だけ)。
//   ・`beta/index.html` を 1 文字も変えない(本器はページを読むだけ)。
//   ・判定はしない。「合/否」「新発見」は書かない —— 次数が立ち・残差が観測 σ の 3 倍に入り・
//     独立な観測量を予測できたときにだけ結論の語を使う(本便の出力はその手前である)。
//
// ■ **走行前に固定した契約**(この節を先に書いてから 1 本目を回した)
//   ・基準刻み h = 0.016(アプリ既定 DT)。步数 N_h = 20,700,000 = 第271便a の ❄️ 3 段登録の h 段。
//     h/2 = (dt 0.008, 41,400,000 步)・h/4 = (dt 0.004, 82,800,000 步)—— **物理時間は 3 段とも同じ**
//     331,200 時間単位(= 33,120,000 s)。
//   ・抽出窓: 近点間は**最初の 20 近点(19 区間)**(PERI_WINDOW=20 —— calaudit と同一)。
//     同方向 1 周は **ORB_MAX=60** 本まで記録し、**判定に使うのは revSec[1](2 周目)**(obsCard の数え方)。
//   ・終了条件: ① 步数上限 ② 同方向 1 周が ORB_MAX 本 ③ NaN 検出 —— のいずれか。停止理由を記録する。
//   ・保存量(列ごとに必ず出す): 同方向 P(1〜6 周目)・近点間 P(検出器 A/B)・接触要素 P・
//     e proxy(全窓/1 周目)・近点移動(°/周・A/B・fit 残差)・
//     帳簿 3 本(総 L の相対ドリフト・粒子線運動量 |ΔP|/Σm|v|・ニュートン二体エネルギーの相対ドリフト)・
//     重心変位(最大)・実効 k(build 後の params.kFrame)・clamp 6 本・NaN・geoToy の停止理由。
//   ・**帳簿は「保存を主張する量」ではない**(E6′/1PN は保存力ではなく、softening も入っている)。
//     列どうしを同じ定義で比べるための診断値である。
//
// ■ 系列(--only で絞れる)
//   C0 現行入力・kF1・f1・geoPN2          … 公開測定(553210.634 s・+0.246%)の再現
//   C1 kF0・f1                            … 同期仮説の最小対照(既知 +0.002%)
//   C2 kF={0,0.1,0.3,0.5,0.7,1}・f1       … 分数係数への感度(**最良点は fit であって予測ではない**)
//   C3 同 kF 系列・f=一次則の自己無撞着解  … 慣性補正で P と径方向挙動が同時に説明できるか
//   C4 同 kF 系列・f=1+kF                  … χ≈1 近似の外挿対照(❄️ の χ は 0.0013/0.011 —— 反例用)
//   C5 3 候補(lib-w272b-pairlock)を係数に(α=1)・f1 と f=一次則
//      **候補は t=0 で 1 度だけ評価した定数**として kFrame に入れる(時間依存の法則を核へ接続してはいない)
//   C6 geoPN=3・kF0・f1・lawVersion scalar/local/complex(principle クラスの診断コピー)
//   C7 geoPN=3 + toyAllowDrag・kF={0.3,0.7,1}(mesh と E6′ の重畳 —— 二重計上の有無。較正扱いしない)
//   S  softening ε={0.05,0.025,0.0125} × {kF0,kF1}(刻み収束と softening 依存を混ぜない)
//
//   f の定義: **質量だけを f 倍する**(初期位置・初速は転写のまま)。転写初速は観測された相対速度
//   そのもの(2πa/P_obs と 0.003% で一致)なので、「同じ観測軌道を支える質量が f 倍」の診断に対応する。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w272b-charon.mjs [--stage h|h2|h4]
//       [--only C0,C1,C2_k0.3,…] [--pilot] [--steps N]
//   --pilot … 步数を 2,100,000(約 6 周)に落として検出器の同値だけ確かめる(正本に書かない)
// 出力: tests/out/charon-w272b.json(列 × 段で**併合**する)
//   第273便b(統括の検証項目 R20): 併合の可否は **6 成分の併合鍵**(対象 html・測定コード
//   `tests/lib-w273b-charonpage.mjs`・候補式 lib・観測入力 calaudit の hash と採用行・窓〔近点 20 /
//   ORB_MAX 60 / 判定する周回 index 1〕・段の (dt, 步数))で決める。**鍵が違えば旧段は混ぜない**。
//   `--pilot` / 規定步数に満たない `--steps` の短い走行は**正本へ書かず** charon-w272b-probe.json へ落とす。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { pairLockCandidates, pairLockInvariance, pairLockReferenceCases, PAIRLOCK_VERSION }
  from './lib-w272b-pairlock.mjs';
// 第273便b(統括の検証項目 R20 / 裁定 AH20)
import { installCharonPage, CHARON_PAGE_VERSION } from './lib-w273b-charonpage.mjs';
import { charonMergeKey, charonMergeDecision, isCanonicalRun, MERGEKEY_VERSION }
  from './lib-w273b-mergekey.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charon-w272b.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HARNESS_VERSION = 'w272b-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const STAGE = getArg('--stage', 'h');
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);

// ---- 固定契約(走行前に決めた値) ------------------------------------------------
const STEP_H = 20700000, ORB_MAX = 60, PERI_WINDOW = 20;
const STAGES = { h: { dt: 0.016, steps: STEP_H }, h2: { dt: 0.008, steps: STEP_H * 2 }, h4: { dt: 0.004, steps: STEP_H * 4 } };
if (!STAGES[STAGE]) { console.error('--stage は h / h2 / h4'); process.exit(2); }
const STEPS = PILOT ? 2100000 : Number(getArg('--steps', STAGES[STAGE].steps));
const DT = STAGES[STAGE].dt;
const KF_SERIES = [0, 0.1, 0.3, 0.5, 0.7, 1];
const EPS_SERIES = [0.05, 0.025, 0.0125];

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const targetSha256 = sha(fs.readFileSync(path.join(ROOT, TARGET)));
const libSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w272b-pairlock.mjs')));
// 第273便b(R20): 測定コードそのものの hash(併合鍵の成分)
const measureSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w273b-charonpage.mjs')));
// 短い走行(--pilot / 規定步数に満たない --steps)の落とし先。**正本には書かない**
const PROBE_OUT = path.join(ROOT, 'tests', 'out', 'charon-w272b-probe.json');

// ---- 観測値・σ は **calaudit の正本から読む**(手で打ち直さない) ----------------
let OBS = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pc = ca.presets.find((p) => p.id === 'plutoCharonReal');
  const row = pc.quantities.find((q) => q.kind === 'period' && q.adopted && q.adopted.value > 0);
  OBS = { value: row.adopted.value, sigma: row.adopted.sigma, unit: row.adopted.unit,
    key: row.adopted.key, recordId: row.adopted.recordId, source: row.adopted.source,
    from: 'tests/out/calaudit-w249.json', calauditSha256: sha(fs.readFileSync(CALAUDIT)) };
} catch (e) { OBS = { error: String(e) }; }

// ================================================================ ブラウザ
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ
// 第273便b(R20): 測定コードは `tests/lib-w273b-charonpage.mjs` に**1 文字も変えずに**移した
// (併合鍵にその SHA-256 を入れるため・k 走査器と同一の測定を構造的に保証するため)。
await page.evaluate(installCharonPage, { ORB_MAX, PERI_WINDOW });

// ---------------------------------------------------------------- 宣言済みの系の t=0 状態
const DECLARED_IDS = ['plutoCharonReal', 'psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM',
  'psrB1534DFM', 'alphaCenAB', 'siriusAB', 'neptuneReal', 'venusReal'];
const declared = [];
for (const id of DECLARED_IDS) {
  const st = await page.evaluate((i) => window.__w272.declaredState(i), id);
  if (!st || st.error) { declared.push({ id, error: st ? st.error : 'missing' }); continue; }
  const a = Math.hypot(st.xB - st.xA, st.yB - st.yA);
  const pw = (st.frameWeight === 'pull') ? 2 : 1;
  const D0use = (pw === 2 && st.D0pull > 0) ? st.D0pull : st.D0;
  const chi = await page.evaluate((z) => window.__w272.chi(z.mA, z.mB, z.a, z.D0, z.eps, z.p),
    { mA: st.mA, mB: st.mB, a, D0: D0use, eps: st.softening, p: pw });
  // **3 候補とも k₀=k_Frame=1 で正規化した値**を表にする(系ごとの宣言 kFrame は別欄 —— そうしないと
  // kFrame=0 を宣言した系〔📻 型〕では候補(ii)が構造的に 0 になり、系どうしを比べられない)
  const cand = pairLockCandidates({ ...st, k0: 1, kFrame: 1, alpha: 1, chiA: chi.chiA, chiB: chi.chiB });
  const inv = pairLockInvariance({ ...st, k0: 1, kFrame: 1, alpha: 1, chiA: chi.chiA, chiB: chi.chiB });
  declared.push({ id, emoji: st.emoji, kFrameDeclared: st.kFrame, frameWeight: st.frameWeight,
    normalization: 'k0=kFrame=1, alpha=1',
    a, chiA: chi.chiA, chiB: chi.chiB, omegaA: st.omegaA, omegaB: st.omegaB,
    kin: cand.kin, candI: cand.candI.k, candII: cand.candII.k, candIII: cand.candIII.k,
    X2: cand.candI.X2, sLock: cand.candII.sLock, tLock: cand.candIII.tLock, rQuiet: cand.candIII.rQuiet,
    invarianceOk: inv.ok, invariance: inv.checks.map((c) => ({ name: c.name, resid: c.resid })) });
}

// ---------------------------------------------------------------- 列の定義
const pc = declared.find((d) => d.id === 'plutoCharonReal');
const A0 = pc.a, D00 = 0.006, EPS0 = 0.05;
const base = await page.evaluate((i) => window.__w272.declaredState(i), 'plutoCharonReal');
const fLinAt = {};
for (const kf of KF_SERIES) {
  const r = await page.evaluate((z) => window.__w272.fLin(z.mA, z.mB, z.a, z.D0, z.eps, z.kF, 1),
    { mA: base.mA, mB: base.mB, a: A0, D0: D00, eps: EPS0, kF: kf });
  fLinAt[kf] = r ? r.f : null;
}
const candK = { i: pc.candI, ii: pc.candII, iii: pc.candIII };
const fLinCand = {};
for (const key of ['i', 'ii', 'iii']) {
  const r = await page.evaluate((z) => window.__w272.fLin(z.mA, z.mB, z.a, z.D0, z.eps, z.kF, 1),
    { mA: base.mA, mB: base.mB, a: A0, D0: D00, eps: EPS0, kF: candK[key] });
  fLinCand[key] = r ? r.f : null;
}

const COLUMNS = [];
const add = (id, series, cfg, note) => COLUMNS.push({ id, series, cfg, note });
add('C0', 'C0', { kFrame: 1, f: 1, geoPN: 2, softening: EPS0 }, '現行入力(公開測定の再現)');
add('C1', 'C1', { kFrame: 0, f: 1, geoPN: 2, softening: EPS0 }, '同期仮説の最小対照');
for (const kf of KF_SERIES) add('C2_k' + kf, 'C2', { kFrame: kf, f: 1, geoPN: 2, softening: EPS0 }, 'kF 感度・f=1');
for (const kf of KF_SERIES) add('C3_k' + kf, 'C3', { kFrame: kf, f: fLinAt[kf], geoPN: 2, softening: EPS0 }, 'f=一次則の自己無撞着解 ' + fLinAt[kf]);
for (const kf of KF_SERIES) add('C4_k' + kf, 'C4', { kFrame: kf, f: 1 + kf, geoPN: 2, softening: EPS0 }, 'f=1+kF(χ≈1 近似の外挿対照)');
for (const key of ['i', 'ii', 'iii']) {
  add('C5_' + key + '_f1', 'C5', { kFrame: candK[key], f: 1, geoPN: 2, softening: EPS0 }, '候補(' + key + ')の t=0 定数 k=' + candK[key]);
  add('C5_' + key + '_flin', 'C5', { kFrame: candK[key], f: fLinCand[key], geoPN: 2, softening: EPS0 }, '候補(' + key + ')+一次則 f=' + fLinCand[key]);
}
for (const lv of ['scalar', 'local', 'complex']) add('C6_' + lv, 'C6', { kFrame: 0, f: 1, geoPN: 3, lawVersion: lv, softening: EPS0 }, 'geoPN=3・kF0・lawVersion=' + lv);
for (const kf of [0.3, 0.7, 1]) add('C7_k' + kf, 'C7', { kFrame: kf, f: 1, geoPN: 3, lawVersion: 'scalar', toyAllowDrag: true, softening: EPS0 }, 'geoPN=3 + toyAllowDrag(重畳・較正扱いしない)');
for (const ep of EPS_SERIES) for (const kf of [0, 1]) add('S_e' + ep + '_k' + kf, 'S', { kFrame: kf, f: 1, geoPN: 2, softening: ep }, 'softening 依存');

const run = COLUMNS.filter((c) => !ONLY.length || ONLY.includes(c.id) || ONLY.includes(c.series));

// ---------------------------------------------------------------- 走行
const SEC = Math.pow(10, base.scaleExpT);   // 1 時間単位 = 10^T 秒
const results = {};
for (const col of run) {
  const t0 = Date.now();
  const r = await page.evaluate((z) => window.__w272.run(z.cfg, z.dt, z.steps),
    { cfg: col.cfg, dt: DT, steps: STEPS });
  const wall = (Date.now() - t0) / 1000;
  if (r.error) { results[col.id] = { ...col, stage: STAGE, error: r.error, errors: r.errors }; continue; }
  const revSec = r.rev.map((x) => x * SEC);
  const rev2 = (revSec.length > 1) ? revSec[1] : null;
  const periASec = (r.A.perMean !== null) ? r.A.perMean * SEC : null;
  const periBSec = (r.B.perMean !== null) ? r.B.perMean * SEC : null;
  const pct = (m) => (m === null || !OBS.value) ? null : (m - OBS.value) / OBS.value * 100;
  const sig = (m) => (m === null || !OBS.sigma) ? null : (m - OBS.value) / OBS.sigma;
  results[col.id] = { ...col, stage: STAGE, dt: DT, stepsRequested: STEPS, wallSec: wall,
    revSec, revN: r.revN, rev2Sec: rev2, periASec, periBSec, oscSec: r.oscP ? r.oscP * SEC : null,
    residPctRev: pct(rev2), sigmaRev: sig(rev2), residPctPeriA: pct(periASec), sigmaPeriA: sig(periASec),
    precessDegPerRevA: r.A.slopeDeg, precessResidDegA: r.A.residDeg,
    precessDegPerRevB: r.B.slopeDeg, precessResidDegB: r.B.residDeg,
    eProxy: r.eProxy, eProxy1: r.eProxy1, rMin: r.rMin, rMax: r.rMax,
    ledger: r.ledger, clamp: r.clamp, nan: r.nan, stop: r.stop, steps: r.steps,
    cfgApplied: r.cfgApplied, warnings: r.warnings, oscA: r.oscA, oscE: r.oscE };
  const R = results[col.id];
  console.log([col.id.padEnd(14), 'kF=' + String(r.cfgApplied.kFrame).padEnd(8),
    'P2=' + (rev2 === null ? '—' : rev2.toFixed(3)).padStart(14),
    'res%=' + (R.residPctRev === null ? '—' : R.residPctRev.toFixed(5)).padStart(11),
    'σ=' + (R.sigmaRev === null ? '—' : R.sigmaRev.toExponential(3)).padStart(11),
    'e=' + (r.eProxy === null ? '—' : r.eProxy.toExponential(3)),
    'stop=' + r.stop, 'nan=' + r.nan, 'wall=' + wall.toFixed(1) + 's'].join(' '));
}

// ---------------------------------------------------------------- 純関数の基準ケース
const refCases = pairLockReferenceCases().map((c) => {
  const v = pairLockCandidates(c.s), inv = pairLockInvariance(c.s);
  return { id: c.id, k: [v.candI.k, v.candII.k, v.candIII.k], expect: c.expect,
    invarianceOk: inv.ok, checks: inv.checks.map((z) => ({ name: z.name, resid: z.resid })) };
});

// ---------------------------------------------------------------- 併合して書く
// 第273便b(統括の検証項目 R20): **併合鍵**。従来は `meta.targetSha256` だけを見ていたので、
// 測定コード・観測入力・窓・段の步数が変わった走行でも同じ列へ混ざり得た。6 成分の鍵で判定する。
const MK = charonMergeKey({
  target: TARGET, targetSha256, measureSha256, libSha256,
  obsSha256: (OBS && OBS.calauditSha256) || '',
  obsRow: { key: (OBS || {}).key, recordId: (OBS || {}).recordId,
    value: (OBS || {}).value, sigma: (OBS || {}).sigma },
  window: { periWindow: PERI_WINDOW, orbMax: ORB_MAX, judgedRevIndex: 1 },
  stageSteps: STAGES,
});
// 第273便b(R20): **短い走行は正本へ書かない**(別ファイル)。段の規定步数と違えば probe 扱い。
const CANON = isCanonicalRun({ pilot: PILOT, steps: STEPS, stageSteps: STAGES[STAGE].steps });
let prev = null;
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { prev = null; }
const MD = charonMergeDecision(prev && prev.meta, MK);
if (prev && !MD.accept) {
  console.error('併合鍵が違う走行は混ぜない(既存を捨てる): ' + MD.reasons.join(' / '));
  prev = null;
} else if (MD.accept === 'legacy') {
  console.log('併合: ' + MD.reasons[0]);
}
const merged = (prev && prev.columns) ? prev.columns : {};
for (const [id, r] of Object.entries(results)) {
  merged[id] = merged[id] || {};
  merged[id][STAGE] = { ...r, mergeKey: MK.key, canonicalRun: CANON.canonical };
}

// ---------------------------------------------------------------- 3 段そろった列の次数と ε̂
// 規約は第271便a と同じ: p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})|・**ε̂=|Q_{h/2}−Q_{h/4}|/(2^p−1)**・
// 次数は**連続 2 段差が同符号のときだけ**立てる。**判定はしない**(門は統括の器が持つ)。
const stageOrders = {};
for (const [id, byStage] of Object.entries(merged)) {
  if (!byStage.h || !byStage.h2 || !byStage.h4) continue;
  const q = [byStage.h.rev2Sec, byStage.h2.rev2Sec, byStage.h4.rev2Sec];
  if (!q.every((z) => Number.isFinite(z))) continue;
  const d1 = q[1] - q[0], d2 = q[2] - q[1];
  const sameSign = Math.sign(d1) === Math.sign(d2) && d2 !== 0;
  const p = sameSign ? Math.log2(Math.abs(d1 / d2)) : null;
  const eps = (p !== null && Math.pow(2, p) !== 1) ? Math.abs(d2) / (Math.pow(2, p) - 1) : null;
  const sg = OBS && OBS.sigma > 0 ? OBS.sigma : null;
  stageOrders[id] = { stages: q, d1, d2, sameSign, pObs: p,
    epsHat: eps, epsHatSigma: (eps !== null && sg) ? eps / sg : null,
    assessedValue: q[2], assessedStage: 'h4',
    residPct: (OBS && OBS.value) ? (q[2] - OBS.value) / OBS.value * 100 : null,
    sigma: sg ? (q[2] - OBS.value) / sg : null,
    orderEstimable: sameSign,
    note: '次数は連続 2 段差が同符号のときだけ立てる(第271便a と同じ規約)。**判定はしていない**' };
}

const out = {
  meta: { wave: '第272便b', harness: 'tests/exp-w272b-charon.mjs', harnessVersion: HARNESS_VERSION,
    pairlockVersion: PAIRLOCK_VERSION, libSha256, target: TARGET, targetSha256,
    // 第273便b(R20): 測定コードの版と hash・併合鍵(と、その材料をそのまま)
    measureLib: 'tests/lib-w273b-charonpage.mjs', measureVersion: CHARON_PAGE_VERSION, measureSha256,
    mergeKeyVersion: MERGEKEY_VERSION, mergeKey: MK.key, mergeKeyParts: MK.parts,
    mergeDecision: { accept: MD.accept, reasons: MD.reasons },
    canonicalRun: CANON.canonical, canonicalRunWhy: CANON.why,
    generatedAt: new Date().toISOString(), pilot: PILOT, stage: STAGE, dt: DT, stepsRequested: STEPS,
    contract: { stepH: STEP_H, orbMax: ORB_MAX, periWindow: PERI_WINDOW,
      stages: STAGES, judgedRevIndex: 1,
      note: '窓・終了条件・保存量は走行前に固定した(器の冒頭コメントが正本)。判定はしない —— 診断である' },
    // 第273便b(裁定 AH20): **softening を宣言量にする**。従来は列の `cfgApplied.softening` に
    // 数が入っているだけで、**どんなポテンシャル形の何に対する比なのかがどこにも書いていなかった**
    // (問題一覧の生成器が「未測定」と書いてしまった原因)。ここで宣言する。
    softeningDeclaration: {
      form: 'Plummer', formula: 'Φ_ij = −G m_i m_j / sqrt(d_ij² + ε²)',
      engineNote: '核(S._core)は 1/sqrt(d²+eps2)(eps2=ε²)で重み・力・ψ を作る —— 本器は読むだけ',
      key: 'physics.softening', unit: '長さ単位(この系では 10^scaleExp.L m)',
      epsilonDefault: EPS0, epsilonSeries: EPS_SERIES,
      separationAtT0: A0, epsilonOverSeparation: EPS0 / A0,
      epsilonOverSeparationSeries: EPS_SERIES.map((e) => ({ epsilon: e, ratio: e / A0 })),
      perColumnKey: 'columns.<id>.<stage>.cfgApplied.softening',
      initialState: '内蔵 ❄️ plutoCharonReal の JSON を複製し、bodies の位置・初速は転写のまま(質量だけ f 倍)。'
        + 'validatePreset → HP.sim.build で組み、t=0 の重心・重心速度はサンプル宣言 balanceFrame に従う',
      note: 'ε は**数値設定であって物理法則ではない**。S 系列は ε を振った対照で、'
        + '刻み収束(h/h2/h4)とは**同時に動かしていない**' },
    stagesPresent: [...new Set(Object.values(merged).flatMap((z) => Object.keys(z)))].sort(),
    observation: OBS, secondsPerUnit: SEC,
    notClaim: ['カロンの合否', '新発見', 'kFrame≈0 の法則化', '潮汐ロックの証明', '引きずり式の確定'] },
  declaredSystems: declared, referenceCases: refCases, stageOrders,
  fLinearAtKF: fLinAt, fLinearAtCandidate: fLinCand, candidateK: candK,
  columns: merged, pageErrors };
if (CANON.canonical) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('wrote ' + OUT + ' (' + Object.keys(merged).length + ' columns)');
} else {
  // 第273便b(R20): 短い走行は**正本を 1 バイトも触らず**別ファイルへ落とす
  fs.mkdirSync(path.dirname(PROBE_OUT), { recursive: true });
  fs.writeFileSync(PROBE_OUT, JSON.stringify({ meta: out.meta, results }, null, 1));
  console.log('短い走行なので正本へは書かない(' + CANON.why + ') → ' + PROBE_OUT);
}
await browser.close();
