// 第165便 exp-isog.mjs — iso-g 対照(ループ利得 g が経路によらない組織化変数かの直接検証)
// ============================================================================================
// 位置づけ: 第116便 exp-obscal.mjs §F は、kFrame=1 自由二体の崩壊の制御変数が**双方向結合の
//   ループ利得** g = χ_sat·χ_M(χ = w/(D₀+w)・w = m/a)であることを、2経路の用量反応で示した。
//   ただしそこで測ったのは「各経路で g を下げると amp が下がる」ことだけで、境界の値は経路で
//   食い違っていた — 安定側の最大 g=4.1×10⁻³(D₀ 経路)に対し、不安定側の最小は 8.9×10⁻³
//   (k_sat 経路)。**同じ g を別経路で作ったとき amp が一致するか**は一度も直接測っていない。
//   本便はそれを初めて直接測る。IW2 が PASS なら g は当該点で組織化変数として成立し、FAIL なら
//   論文3 の route-dependent 記述の定量的裏付けになる — **どちらも価値がある**。
//
// 測定の規律:
//   ・地球月構成・amp 定義((r_max−r_min)/r̄)・走行窓・数値床は exp-obscal.mjs §F から**そのまま
//     転記**する(再定義しない)。転記の正しさは §F の既存グリッド点を再走行して
//     tests/out/obscal-results.json とビット一致することで機械証明する(transcription)。
//   ・§F は**早期打ち切りを持たない**(steps = ceil(2.1·T_K/dt) の固定步数・崩壊しても走り切る)。
//     GM 合計は kSat 経路でも厳密保存されるので T_K は全点で同一 = 步数も全点で同一である。
//     本便もこの打ち切り規約をそのまま踏襲する(不安定側でも走行時間は伸びない)。
//   ・g の合わせ込みは走行前に 1 步だけ進めた構成から χ_sat・χ_M を読んで評価する関数を作り、
//     ノブについて**対数空間の二分法**で |Δg|/g ≤ 1e-6 まで収束させる。
//
// 対象 HTML の既定を index.html にしてある理由: 既存 JSON(obscal-results.json)を出した対象は
//   「beta/index.html @ fbaef3a4」で、その実体は現 HEAD の root index.html とバイト同一
//   (SHA-256 efda285a…)である。転記照合のビット一致が機能するよう既定対象をその実体に合わせる。
//   QA_TARGET=beta/index.html でも回せる(対象 SHA の異同は out.targetConsistency に機械記録)。
//
// 実行: node tests/exp-isog.mjs(playwright 必須)→ tests/out/isog-results.json
//   ISOG_OUT=/path/x.json node tests/exp-isog.mjs         … 出力先の変更(決定性の2回実行に使う)
//   ISOG_DET_REF=/path/run1.json node tests/exp-isog.mjs  … 2回目実行で1回目の JSON と SHA 照合
// ============================================================================================
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.ISOG_OUT ? path.resolve(process.env.ISOG_OUT)
  : path.join(OUT_DIR, 'isog-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// 正準化(決定性ハッシュ — exp-coreshell5.mjs と同一方式)
const canonize = (o) => {
  if (Array.isArray(o)) return o.map(canonize);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
    return r;
  }
  return o;
};

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ==================== 事前登録(統括が実測前に固定 — 実測後に動かさない)====================
const PRE_REGISTERED = {
  fixedBy: '統括(ハンドオフ 2026-08-22a §3b)', fixedBefore: '実測',
  targetsG: {
    verbatim: '目標 g 3点: {4.1×10⁻³, 8.9×10⁻³, 5.0×10⁻²}。各 g を (i) k_sat 経路' +
      '(D₀=0.006 基準値固定・k_sat 可変) (ii) D₀ 経路(k_sat=1 固定・D₀ 可変) (iii) 混合経路' +
      '(k_sat=0.5 固定・D₀ 可変)の3経路で構成。',
    values: [4.1e-3, 8.9e-3, 5.0e-2],
    provenance: '4.1e-3 = obscal §F の安定側最大 g(D₀ 経路 D₀=2)・8.9e-3 = 不安定側最小 g' +
      '(k_sat 経路 kSat=0.05・D₀=0.1)・5.0e-2 = §F の D₀=0.3 点の g(境界より上の対照)',
    routes: {
      kSat: { knob: 'kSat', fixed: { D0: 0.006 }, note: '事前登録どおり D₀=0.006 を固定値として用いる' },
      D0: { knob: 'D0', fixed: { kSat: 1 } },
      mixed: { knob: 'D0', fixed: { kSat: 0.5 } },
    },
  },
  IW1: {
    role: '窓(構成可能性)',
    verbatim: 'IW1(構成可能性): 全 3g × 3経路で g 合わせが二分法収束(|Δg|/g ≤ 1e-6)。',
    tolerance: 1e-6,
    failRule: '万一収束しない点があれば IW1 のその点を FAIL のまま収載する(窓・目標値の変更禁止)',
  },
  IW2: {
    role: '主窓',
    verbatim: 'IW2(主窓): 同一 g の経路間 amp 相対差 (max−min)/max ≤ 10% なら「g は当該点で' +
      '組織化変数として成立」、超えれば経路依存の定量記録(FAIL は論文3 route-dependent 記述の' +
      '定量的裏付けとしてそのまま収載 — どちらも価値がある)。g 3点それぞれで判定。',
    tolerance: 0.10,
    statistic: '(max(amp) − min(amp)) / max(amp)(同一 g の3経路にわたって)',
  },
  IW3: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'IW3(記述 — 窓なし): 各 iso-g 点の dt/2 収束差・初期位相 90° ずらし対照を記録' +
      '(数値床宣言付き)。',
    window: 'なし(記述のみ)',
    floorDeclaration: '初期位相 90° ずらしは構成の厳密な回転対称操作((x,y)→(−y,x)・(vx,vy)→(−vy,vx) — ' +
      '倍精度で誤差ゼロの四半回転)であり、外力場も境界も等方(gravityX=gravityY=0・boundary:"none")' +
      'なので、解析的には amp が 1 bit も変わらないはずの対照である。したがってそこで出た |Δamp| が' +
      '**この測定の数値床**(和の順序・平方根・カオス的増幅による下限)である。dt/2 の差は' +
      '数値床と離散化誤差の合計であって、床を下回る差には意味がない',
  },
  IW4: {
    role: '窓(決定性)',
    verbatim: 'IW4(決定性): 2回実行 SHA 一致。',
    canonicalization: '対象は out.transcription / out.isog / out.supplementary(実測部)のみ。' +
      '揮発値(日時・経過時間・環境)は meta / manifest 側にしか置かない',
  },
  invariants: {
    verbatim: '既存ファイル(exp-obscal.mjs・obscal-results.json 等)は一切変更しない。' +
      'amp 定義・走行窓・地球月構成・数値床は §F から転記のまま(再定義禁止)。',
    transcriptionCheck: '§F の既存グリッド点(k_sat=1/0.5/0.25/0.1/0.05 @ D₀=0.1 と ' +
      'D₀=0.1/0.3/1/2/5 @ k_sat=1)を再走行し、obscal-results.json の χ_sat/χ_M/g/amp と' +
      'ビット一致することを確認してから本測定に入る',
  },
  knownInconsistencyInBrief: {
    what: '事前登録の注記は「k_sat 経路は χ_M≈0.94 がほぼ固定のため、g=4.1e-3 には χ_sat≈4.4e-3 が要る」' +
      'と述べているが、χ_M≈0.94 は **D₀=0.1**(§F の基準背景値)での値である。事前登録が固定した ' +
      'D₀=0.006 では χ_M=0.9962 で、g=4.1e-3 に必要な χ_sat は ≈4.12e-3 になる。',
    handling: '**窓は動かさない** — 事前登録の文言どおり k_sat 経路は D₀=0.006 固定で構成し、それを' +
      'IW1/IW2 の判定対象とする。注記の前提だった D₀=0.1 での k_sat 経路は、判定に使わない' +
      '**補助経路**(out.supplementary)として同じ手順で併走させ、統括がどちらの解釈でも読めるようにする。',
    feasibility: 'D₀=0.006 でも 3 目標とも χ_sat≤1 の範囲で構成可能である(必要 kSat は ' +
      '1.3×10⁻³ / 2.8×10⁻³ / 1.7×10⁻² 程度 — 実測値は out.isog に入る)',
  },
};

// ==================== 入力(既存 JSON — 読み取り専用)====================
const INPUT_SPECS = [
  { key: 'obscal', file: 'obscal-results.json',
    role: '第111〜116便の実測正本(§F の地球月構成・amp 定義・走行窓・用量反応グリッドの出典。' +
      '転記の正しさは本便のグリッド再走行との bit 照合で機械証明する)' },
];
const inputs = {};
const provenanceInputs = [];
for (const spec of INPUT_SPECS) {
  const p = path.join(OUT_DIR, spec.file);
  const bytes = fs.readFileSync(p);
  const j = JSON.parse(bytes.toString('utf8'));
  inputs[spec.key] = j;
  provenanceInputs.push({
    path: `tests/out/${spec.file}`, sha256: sha256(bytes), bytes: bytes.length,
    targetPath: j.manifest ? j.manifest.provenance.target.path : null,
    targetSha256: j.manifest ? j.manifest.provenance.target.sha256 : null,
    appVersion: j.manifest ? j.manifest.provenance.target.appVersion : null,
    gitCommit: j.manifest ? j.manifest.provenance.git.commit : null,
    role: spec.role, mutated: false,
  });
}
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map((e) => ({ path: e.path, targetPath: e.targetPath,
    targetSha256: e.targetSha256, sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every((e) => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML と本便の対象が同一実体かの照合。一致していれば' +
    '転記照合のビット一致が「転記が正しいこと」の証拠として機能する',
};

// ==================== §F からの逐語転記(再定義しない)====================
// 転記元: tests/exp-obscal.mjs §F の basePhys(第116便・EM 実単位構成・kFrame=1・自由二体)
const basePhys = { G: 6.674e-3, cLight: 3e4, Kt: 1e9, q: 3, D0: 0.1, kFrame: 1, geoPN: 2,
  lambdaPN: 1, pnAlpha: 1.5, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, bM: 1, etaRad: 0, pRad: 4,
  gravityX: 0, gravityY: 0, radiusScale: 0.2, softening: 0.1, timeScale: 1, stateCarry: 'double' };
// 転記元: 同 §F の定数(🪐 planetary アンカー 1単位=1e8 m/1e4 s/1e24 kg の実値)
const EM_CONST = { M0: 5.9724, m20: 0.07346, a: 3.844, e: 0.0549,
  note: 'M0=地球・m20=月・a=3.844(実 3.844e8 m)・e=0.0549。kSat 経路は m2←kSat·m20 と ' +
    'M←M0+(1−kSat)·m20 で GM 合計を厳密保存する(= 周期 T_K と步数が全点で同一)' };
const AMP_DEFINITION = 'amp = (r_max − r_min) / ((r_max + r_min)/2)(相対距離の走行窓内 min/max)';
const WINDOW_DEFINITION = 'dt=0.016・steps = ceil(2.1·T_K/dt)(固定步数・早期打ち切りなし)';
const CHI_DEFINITION = 'χ_sat = (m2/a)/(D₀+m2/a)・χ_M = (M/a)/(D₀+M/a)・g = χ_sat·χ_M' +
  '(a は長半径。§F の宣言式そのまま — エンジン内部の w は瞬時距離 r で決まるので一致しない。' +
  '両者の差は engineChi に記録する)';

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const T_START = Date.now();

// ---- 走行器(§F stabRun の逐語転記 + IW3 用の任意パラメータ)--------------------------------
// dtIn 省略時 = 0.016・rot90=false のとき、§F の stabRun と**厳密に同じ数値**を返す
// (四半回転は (x,y)→(−y,x) の符号入れ替えだけなので倍精度で誤差ゼロ。rot90=false ではそもそも
//  回転を通さない)。同一性は transcription のビット照合で機械確認する。
const stabRun = (kSat, D0, opt) => page.evaluate(async ({ phys, kSat, D0, dtIn, rot90 }) => {
  const M0 = 5.9724, m20 = 0.07346, a = 3.844, e = 0.0549;
  const m2 = kSat * m20, M = M0 + (1 - kSat) * m20;   // GM 合計を厳密保存
  const P = Object.assign({}, phys, { D0 });
  const mu = M + m2, GM = P.G * mu, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp);
  // 初期位相 90° ずらし対照(IW3)— 厳密な四半回転 (x,y)→(−y,x)・(vx,vy)→(−vy,vx)
  const b = [
    { m: M, x: -rp * m2 / mu, y: 0, vx: 0, vy: -vp * m2 / mu },
    { m: m2, x: rp * M / mu, y: 0, vx: 0, vy: vp * M / mu },
  ].map((o) => rot90
    ? { m: o.m, x: -o.y, y: o.x, vx: -o.vy, vy: o.vx }
    : o);
  const S = HP.sim;
  S.build({ id: 'obscalStab', name: 'obscal-stab', emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: b[0].m, x: b[0].x, y: b[0].y, vx: b[0].vx, vy: b[0].vy, spin: 0, pinned: false },
      { type: 'single', m: b[1].m, x: b[1].x, y: b[1].y, vx: b[1].vx, vy: b[1].vy, spin: 0, pinned: false },
    ] });
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = dtIn || 0.016, steps = Math.ceil(2.1 * TK / dt);
  let rmin = Infinity, rmax = 0;
  for (let k = 0; k < steps; k++) { S.step(dt);
    const rr = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
    if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr; }
  const chi = (m2 / a) / (D0 + m2 / a);                 // 衛星のフレーム重み(主星位置)
  const chiM = (M / a) / (D0 + M / a);                  // 主星のフレーム重み(衛星位置)
  return { chi, chiM, gain: chi * chiM,                 // 双方向結合のループ利得
    amp: (rmax - rmin) / ((rmax + rmin) / 2), nan: S.hasNaN(),
    rmin, rmax, TK, dt, steps, m2, M };
}, { phys: basePhys, kSat, D0, dtIn: (opt && opt.dt) || 0, rot90: !!(opt && opt.rot90) });

// ---- g 評価器 + 対数空間二分法(1 走行あたり 1 回の page.evaluate)---------------------------
// 走行前に **1步だけ**進めた構成から χ_sat・χ_M(§F の宣言式)を読んで g を評価する。
// エンジン内部の重み S.sumW も併せて読み、宣言式との差を engineChi に残す(記述のみ)。
const bisectG = (spec) => page.evaluate(async (c) => {
  const M0 = 5.9724, m20 = 0.07346, a = 3.844, e = 0.0549;
  const probe = (kSat, D0) => {
    const m2 = kSat * m20, M = M0 + (1 - kSat) * m20;
    const P = Object.assign({}, c.phys, { D0 });
    const mu = M + m2, GM = P.G * mu, rp = a * (1 - e);
    const vp = Math.sqrt(GM * (1 + e) / rp);
    const S = HP.sim;
    S.build({ id: 'obscalStab', name: 'obscal-stab', emoji: '🧪', seed: 1,
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
      bodies: [
        { type: 'single', m: M, x: -rp * m2 / mu, y: 0, vx: 0, vy: -vp * m2 / mu, spin: 0, pinned: false },
        { type: 'single', m: m2, x: rp * M / mu, y: 0, vx: 0, vy: vp * M / mu, spin: 0, pinned: false },
      ] });
    S.step(0.016);   // 1步(場を確定させてから読む)
    const chi = (m2 / a) / (D0 + m2 / a);
    const chiM = (M / a) / (D0 + M / a);
    const wSat = (S.sumW && S.sumW.length > 0) ? S.sumW[0] : null;   // 主星位置での重み(=衛星の寄与)
    const wM = (S.sumW && S.sumW.length > 1) ? S.sumW[1] : null;     // 衛星位置での重み(=主星の寄与)
    return { kSat, D0, m2, M, chi, chiM, gain: chi * chiM,
      engineChi: { wSat, wM,
        chiSat: wSat === null ? null : wSat / (D0 + wSat),
        chiM: wM === null ? null : wM / (D0 + wM),
        gain: (wSat === null || wM === null) ? null : (wSat / (D0 + wSat)) * (wM / (D0 + wM)),
        note: 'エンジンの重み S.sumW は瞬時距離 r(=近点 rp)で決まるため、§F の宣言式(a=長半径)' +
          'とは一致しない。判定に使うのは宣言式のほう(記述のみの併記)' },
      nan: S.hasNaN() };
  };
  const at = (v) => (c.knob === 'kSat' ? probe(v, c.fixedD0) : probe(c.fixedKSat, v));
  // 対数空間の二分法(ノブはいずれも正のスケール量)
  let lo = Math.log(c.lo), hi = Math.log(c.hi);
  const gLo = at(Math.exp(lo)).gain, gHi = at(Math.exp(hi)).gain;
  const increasing = gHi > gLo;
  const bracketed = (c.target - Math.min(gLo, gHi)) * (Math.max(gLo, gHi) - c.target) >= 0;
  let iter = 0, converged = false, best = null;
  if (bracketed) {
    for (iter = 1; iter <= c.maxIter; iter++) {
      const mid = 0.5 * (lo + hi), v = Math.exp(mid), r = at(v);
      best = r;
      const relErr = Math.abs(r.gain - c.target) / c.target;
      if (relErr <= c.tol) { converged = true; break; }
      if ((r.gain < c.target) === increasing) lo = mid; else hi = mid;
    }
  }
  return { bracketed, increasing, gAtLo: gLo, gAtHi: gHi, iterations: iter, converged,
    probe: best, intervalWidthLog: hi - lo };
}, spec);

// ==================== ① 転記照合(§F の既存グリッド点の再走行 → bit 一致)====================
console.log('== 第165便 iso-g 対照(ループ利得 g の経路依存性)==');
console.log(`対象: ${TARGET}(SHA ${TARGET_SHA_NOW.slice(0, 12)}…)/ 入力 JSON の対象一致=${targetConsistency.allSame}`);
console.log('-- ① 転記照合(exp-obscal.mjs §F のグリッドを再走行して bit 一致を見る)--');
const GRID = [                                    // 転記元: exp-obscal.mjs §F の掃引点(順序も同一)
  ...[1, 0.5, 0.25, 0.1, 0.05].map((kSat) => ({ route: 'kSat', kSat, D0: 0.1 })),
  ...[0.1, 0.3, 1, 2, 5].map((D0) => ({ route: 'D0', kSat: 1, D0 })),
];
const refDose = inputs.obscal.tests.kframeStability.dose;
const gridRows = [];
for (let i = 0; i < GRID.length; i++) {
  const c = GRID[i];
  const r = await stabRun(c.kSat, c.D0);
  const ref = refDose[i];
  const same = Object.is(r.chi, ref.chi) && Object.is(r.chiM, ref.chiM)
    && Object.is(r.gain, ref.gain) && Object.is(r.amp, ref.amp) && r.nan === ref.nan;
  gridRows.push({ route: c.route, kSat: c.kSat, D0: c.D0,
    chi: r.chi, chiM: r.chiM, gain: r.gain, amp: r.amp, nan: r.nan,
    reference: { chi: ref.chi, chiM: ref.chiM, gain: ref.gain, amp: ref.amp, nan: ref.nan },
    bitIdentical: same,
    ampRelDiff: ref.amp ? r.amp / ref.amp - 1 : null });
  console.log(`   ${c.route === 'kSat' ? `kSat=${c.kSat}` : `D0=${c.D0}`}`.padEnd(16) +
    ` g=${r.gain.toExponential(4)} amp=${(r.amp * 100).toFixed(4)}% bit一致=${same}`);
}
const transcription = {
  source: 'tests/exp-obscal.mjs §F(第116便)+ tests/out/obscal-results.json tests.kframeStability.dose',
  amplitudeDefinition: AMP_DEFINITION, windowDefinition: WINDOW_DEFINITION, chiDefinition: CHI_DEFINITION,
  constants: EM_CONST, physics: basePhys,
  rows: gridRows,
  allBitIdentical: gridRows.every((r) => r.bitIdentical),
  gStarReference: inputs.obscal.tests.kframeStability.gStar,
};
console.log(`   → グリッド全点ビット一致 = ${transcription.allBitIdentical}` +
  `(§F の境界: 安定側最大 g=${transcription.gStarReference.maxStable.toExponential(4)} / ` +
  `不安定側最小 g=${transcription.gStarReference.minUnstable.toExponential(4)})`);

// ==================== ② iso-g 点の合わせ込みと走行 ====================
// 探索区間(ノブの物理的に意味のある範囲 — 宣言して JSON に収載する)
const SEARCH = {
  kSat: { lo: 1e-9, hi: 1,
    rationale: '質量補正係数 kSat は 0<kSat≤1(月の質量を増やさない範囲)。下限 1e-9 は ' +
      'g→0 側を確実に挟むための実用下限' },
  D0: { lo: 1e-6, hi: 1e6,
    rationale: '背景決定力 D₀>0。1e-6 では χ→1(g→1)・1e6 では g→0 で、目標 3 点を確実に挟む' },
};
const MAX_ITER = 200;
const ROUTES = [
  { id: 'kSat', label: 'k_sat 経路(D₀=0.006 固定・k_sat 可変)', knob: 'kSat', fixedD0: 0.006, fixedKSat: null },
  { id: 'D0', label: 'D₀ 経路(k_sat=1 固定・D₀ 可変)', knob: 'D0', fixedD0: null, fixedKSat: 1 },
  { id: 'mixed', label: '混合経路(k_sat=0.5 固定・D₀ 可変)', knob: 'D0', fixedD0: null, fixedKSat: 0.5 },
];
const G_TARGETS = PRE_REGISTERED.targetsG.values;

const measurePoint = async (route, gTarget, tag) => {
  const sp = { phys: basePhys, target: gTarget, knob: route.knob,
    fixedD0: route.fixedD0, fixedKSat: route.fixedKSat,
    lo: SEARCH[route.knob].lo, hi: SEARCH[route.knob].hi, tol: PRE_REGISTERED.IW1.tolerance,
    maxIter: MAX_ITER };
  const bs = await bisectG(sp);
  const rec = { gTarget, route: route.id, routeLabel: route.label, knob: route.knob,
    searchInterval: { lo: sp.lo, hi: sp.hi, rationale: SEARCH[route.knob].rationale },
    bracketed: bs.bracketed, increasing: bs.increasing, gAtLo: bs.gAtLo, gAtHi: bs.gAtHi,
    iterations: bs.iterations, converged: bs.converged, maxIter: MAX_ITER };
  if (!bs.probe) {
    rec.iw1 = { pass: false, note: '二分法が目標 g を挟めなかった(区間内に解なし)' };
    return rec;
  }
  const p = bs.probe;
  const kSat = route.knob === 'kSat' ? p.kSat : route.fixedKSat;
  const D0 = route.knob === 'D0' ? p.D0 : route.fixedD0;
  rec.knobValue = route.knob === 'kSat' ? kSat : D0;
  rec.kSat = kSat; rec.D0 = D0; rec.m2 = p.m2; rec.M = p.M;
  rec.chiSat = p.chi; rec.chiM = p.chiM; rec.gAchieved = p.gain;
  rec.gRelErr = Math.abs(p.gain - gTarget) / gTarget;
  rec.engineChi = p.engineChi;
  rec.iw1 = { pass: bs.converged && rec.gRelErr <= PRE_REGISTERED.IW1.tolerance,
    tolerance: PRE_REGISTERED.IW1.tolerance, relErr: rec.gRelErr };
  // 主走行(§F と同一の窓・打ち切り規約)
  const main = await stabRun(kSat, D0);
  rec.run = { amp: main.amp, nan: main.nan, rmin: main.rmin, rmax: main.rmax,
    TK: main.TK, dt: main.dt, steps: main.steps };
  // 走行時の χ/g が合わせ込み時と一致すること(構成同一性の内部照合)
  rec.consistency = { chiSame: Object.is(main.chi, p.chi), chiMSame: Object.is(main.chiM, p.chiM),
    gainSame: Object.is(main.gain, p.gain) };
  // IW3: dt/2 収束差・初期位相 90° ずらし対照
  const half = await stabRun(kSat, D0, { dt: 0.008 });
  const rot = await stabRun(kSat, D0, { rot90: true });
  rec.iw3 = {
    dtHalf: { dt: half.dt, steps: half.steps, amp: half.amp, nan: half.nan,
      ampDiff: half.amp - main.amp, ampRelDiff: main.amp ? half.amp / main.amp - 1 : null },
    phase90: { amp: rot.amp, nan: rot.nan,
      ampDiff: rot.amp - main.amp, ampRelDiff: main.amp ? rot.amp / main.amp - 1 : null },
  };
  console.log(`   [${tag}] ${route.id.padEnd(5)} ${route.knob}=${rec.knobValue.toExponential(6)}` +
    ` g=${p.gain.toExponential(6)}(|Δg|/g=${rec.gRelErr.toExponential(1)}・${bs.iterations}回・収束=${bs.converged})` +
    ` amp=${(main.amp * 100).toFixed(4)}% dt/2 差=${(rec.iw3.dtHalf.ampRelDiff * 100).toFixed(4)}%` +
    ` 90°差=${(rec.iw3.phase90.ampRelDiff * 100).toFixed(4)}% NaN=${main.nan}`);
  return rec;
};

console.log('-- ② iso-g 点の合わせ込みと走行(3g × 3経路)--');
const points = [];
for (const g of G_TARGETS) {
  console.log(`  目標 g=${g.toExponential(2)}`);
  for (const route of ROUTES) points.push(await measurePoint(route, g, g.toExponential(2)));
}

// ==================== ③ 補助経路(判定に使わない — 事前登録注記の前提だった D₀=0.1)==========
console.log('-- ③ 補助: k_sat 経路 @ D₀=0.1(§F の基準背景値 — 判定に使わない記述)--');
const suppRoute = { id: 'kSat@D0=0.1', label: 'k_sat 経路(D₀=0.1 固定・k_sat 可変)— 補助',
  knob: 'kSat', fixedD0: 0.1, fixedKSat: null };
const suppPoints = [];
for (const g of G_TARGETS) suppPoints.push(await measurePoint(suppRoute, g, 'supp'));

// ==================== IW1 / IW2 の判定 ====================
const iw1 = { rule: PRE_REGISTERED.IW1,
  rows: points.map((p) => ({ gTarget: p.gTarget, route: p.route, knobValue: p.knobValue === undefined ? null : p.knobValue,
    gAchieved: p.gAchieved === undefined ? null : p.gAchieved, relErr: p.gRelErr === undefined ? null : p.gRelErr,
    iterations: p.iterations, converged: p.converged, pass: p.iw1.pass })),
  pass: points.every((p) => p.iw1.pass === true),
  nPoints: points.length };

const iw2 = { rule: PRE_REGISTERED.IW2, byG: [] };
for (const g of G_TARGETS) {
  const rows = points.filter((p) => p.gTarget === g && p.run);
  const amps = rows.map((r) => r.run.amp);
  const mx = Math.max(...amps), mn = Math.min(...amps);
  const rel = mx !== 0 ? (mx - mn) / mx : null;
  const floor = Math.max(...rows.map((r) => Math.abs(r.iw3.phase90.ampRelDiff || 0)));
  iw2.byG.push({ gTarget: g,
    rows: rows.map((r) => ({ route: r.route, knob: r.knob, knobValue: r.knobValue,
      kSat: r.kSat, D0: r.D0, gAchieved: r.gAchieved, amp: r.run.amp, nan: r.run.nan })),
    ampMax: mx, ampMin: mn, relSpread: rel, tolerance: PRE_REGISTERED.IW2.tolerance,
    pass: rel !== null && rel <= PRE_REGISTERED.IW2.tolerance,
    numericalFloorRelSpread: floor,
    aboveFloor: rel !== null && rel > floor,
    verdict: rel === null ? 'INCONCLUSIVE'
      : (rel <= PRE_REGISTERED.IW2.tolerance
        ? 'g は当該点で組織化変数として成立(経路間 amp 相対差 ≤10%)'
        : '経路依存(経路間 amp 相対差 >10%)— 論文3 route-dependent 記述の定量的裏付け'),
    // 補助経路(D₀=0.1 の k_sat 経路)を k_sat 経路の代わりに入れた場合の参考値
    variantWithSupplementaryKSat: (() => {
      const sp = suppPoints.find((s) => s.gTarget === g && s.run);
      if (!sp) return null;
      const alt = rows.filter((r) => r.route !== 'kSat').map((r) => r.run.amp).concat([sp.run.amp]);
      const amx = Math.max(...alt), amn = Math.min(...alt);
      return { role: '参考(判定に使わない)', amps: alt, ampMax: amx, ampMin: amn,
        relSpread: amx !== 0 ? (amx - amn) / amx : null,
        pass: amx !== 0 ? ((amx - amn) / amx) <= PRE_REGISTERED.IW2.tolerance : null };
    })(),
  });
}
iw2.allPass = iw2.byG.every((r) => r.pass === true);

const iw3 = { rule: PRE_REGISTERED.IW3,
  rows: points.map((p) => ({ gTarget: p.gTarget, route: p.route, amp: p.run ? p.run.amp : null,
    dtHalfRelDiff: p.iw3 ? p.iw3.dtHalf.ampRelDiff : null,
    phase90RelDiff: p.iw3 ? p.iw3.phase90.ampRelDiff : null,
    dtHalfSteps: p.iw3 ? p.iw3.dtHalf.steps : null })),
  numericalFloor: { declaration: PRE_REGISTERED.IW3.floorDeclaration,
    maxAbsPhase90RelDiff: Math.max(...points.filter((p) => p.iw3).map((p) => Math.abs(p.iw3.phase90.ampRelDiff || 0))),
    maxAbsDtHalfRelDiff: Math.max(...points.filter((p) => p.iw3).map((p) => Math.abs(p.iw3.dtHalf.ampRelDiff || 0))) },
};

console.log('-- IW1/IW2 判定 --');
console.log(`  IW1(全 ${iw1.nPoints} 点で |Δg|/g ≤ 1e-6 収束)= ${iw1.pass ? 'PASS' : 'FAIL'}`);
for (const r of iw2.byG) {
  console.log(`  IW2 g=${r.gTarget.toExponential(2)}: amp ${r.rows.map((x) => `${x.route}=${(x.amp * 100).toFixed(3)}%`).join(' / ')}` +
    ` → (max−min)/max=${(r.relSpread * 100).toFixed(2)}%(窓 ≤10%)= ${r.pass ? 'PASS' : 'FAIL'}` +
    `(数値床 ${(r.numericalFloorRelSpread * 100).toExponential(2)}%)`);
}
console.log(`  IW3 数値床(90° 対照の最大 |Δamp|/amp)= ${iw3.numericalFloor.maxAbsPhase90RelDiff.toExponential(3)}` +
  ` / dt/2 の最大 |Δamp|/amp = ${iw3.numericalFloor.maxAbsDtHalfRelDiff.toExponential(3)}`);

// ==================== 出力の組み立て ====================
const out = { target: TARGET, wave: 165,
  title: 'iso-g 対照(同一ループ利得 g を別経路で構成したときの amp 一致性)',
  preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs,
  transcription,
  isog: { targetsG: G_TARGETS, routes: ROUTES, searchIntervals: SEARCH, maxIter: MAX_ITER,
    points, iw1, iw2, iw3 },
  supplementary: { role: '判定に使わない記述(事前登録注記の前提だった D₀=0.1 の k_sat 経路)',
    note: PRE_REGISTERED.knownInconsistencyInBrief.handling, points: suppPoints },
  meta: {} };

// ==================== IW4: 決定性(2回実行 SHA 一致)====================
{
  const target = { transcription: out.transcription, isog: out.isog, supplementary: out.supplementary };
  const mine = JSON.stringify(canonize(target));
  const rec = { rule: PRE_REGISTERED.IW4,
    canonicalization: 'transcription / isog / supplementary(実測部)を対象に、キーを再帰整列した ' +
      'JSON の SHA-256。日時・経過時間・環境は meta / manifest 側にしか置いていないので、' +
      '対象内に除外すべき揮発値は存在しない',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.ISOG_DET_REF;
  if (refPath && fs.existsSync(refPath)) {
    try {
      const other = JSON.parse(fs.readFileSync(refPath, 'utf8'));
      const otherJ = JSON.stringify(canonize({ transcription: other.transcription,
        isog: other.isog, supplementary: other.supplementary }));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一 seed・同一窓)';
    } catch (e) { rec.error = String(e && e.message || e); }
  } else if (refPath) {
    rec.reference = path.basename(refPath); rec.note = '参照 JSON を読めなかった';
  }
  out.determinism = rec;
  out.iw4 = { rule: PRE_REGISTERED.IW4, sha256: rec.sha256, reference: rec.reference,
    identical: rec.identical,
    result: rec.identical === null ? 'PENDING(参照なし)' : (rec.identical ? 'PASS' : 'FAIL') };
}

out.meta.stage = 'complete';
out.meta.elapsedSec = (Date.now() - T_START) / 1000;
out.meta.generatedAt = new Date().toISOString();

// ---- 第145便: 実験マニフェスト -------------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'isog', wave: 165,
    title: 'iso-g 対照(ループ利得 g の経路依存性 — 同一 g を3経路で構成して amp を比べる)',
    command: 'node tests/exp-isog.mjs(ISOG_OUT / ISOG_DET_REF で決定性の2回実行)' },
  presets: { mode: 'dynamic',
    declaredIn: 'basePhys + EM_CONST(いずれも tests/exp-obscal.mjs §F からの逐語転記)',
    declaration: '動的構成(内蔵プリセットを読まず、§F の宣言値から HP.sim.build する)。' +
      '本便が §F から変えたのは **ノブ(kSat / D₀)の値だけ**で、構成・amp 定義・窓・dt・seed は同一',
    configs: { basePhys, emConstants: EM_CONST, amplitudeDefinition: AMP_DEFINITION,
      windowDefinition: WINDOW_DEFINITION, chiDefinition: CHI_DEFINITION,
      routes: ROUTES, searchIntervals: SEARCH, targetsG: G_TARGETS },
    note: '§F は physLock を要求しない構成である(Kt=1e9 は c₀²/G ではない — 🪐実c+実G では ' +
      'Kt が値域外になるためロック外運用。転記元 exp-obscal.mjs §E の宣言に従う)' },
  numerics: {
    seed: 1, dt: 0.016, timeScale: 1, substeps: NOT_APPLICABLE,
    steps: 'steps = ceil(2.1·T_K/dt)(§F と同一。GM 合計が全点で保存されるので T_K・步数は全点同一)',
    window: { orbits: 2.1, terminationRule: '早期打ち切りなし(§F の規約をそのまま踏襲 — ' +
      '崩壊しても固定步数を走り切る。不安定側でも走行時間は伸びない)' },
    warmup: NOT_APPLICABLE,
    convergence: 'IW3 として dt/2(=0.008・步数2倍)を全 iso-g 点で併走させ、amp の相対差を記録',
    precision: 'stateCarry:"double"(§F と同一)',
    solver: '目標 g への合わせ込みは**対数空間の二分法**(区間・反復上限は isog.searchIntervals / ' +
      'isog.maxIter に宣言・収束判定は |Δg|/g ≤ 1e-6)。乱数・初期値依存を持たない決定的手続きである',
  },
  classification: {
    input: ['§F の地球月構成(M=5.9724・m2=0.07346・a=3.844・e=0.0549・実G/実c の 🪐 アンカー)',
      '§F の物理キー宣言(kFrame=1・q=3・geoPN=2・λPN=1・α=1.5・ε=0.1・radiusScale=0.2)',
      'dt=0.016・seed=1・2.1 公転窓(いずれも §F から不変)',
      '目標 g 3点 {4.1e-3, 8.9e-3, 5.0e-2}(§F の実測 gStar と D₀=0.3 点から統括が事前登録)'],
    fit: [],
    derived: ['χ_sat・χ_M・g=χ_sat·χ_M(§F の宣言式)',
      '各経路で目標 g を実現するノブ値(対数二分法の解 — 当てはめではなく方程式の求解)',
      'amp=(r_max−r_min)/r̄', '経路間 amp 相対差 (max−min)/max(IW2)',
      'dt/2 収束差・90° 位相ずらし対照の |Δamp|(IW3 — 数値床の宣言つき)'],
    holdOut: [],
    note: '**本便は較正を一切行わない**(fit=[])。二分法は「宣言済みの g 定義式を目標値に等しく' +
      'するノブ値」を解く決定的な求解であって、観測量への当てはめではない',
  },
  judgement: {
    pointers: ['preRegistered.IW1', 'preRegistered.IW2', 'preRegistered.IW3', 'preRegistered.IW4',
      'transcription.allBitIdentical', 'isog.iw1', 'isog.iw2', 'isog.iw3', 'iw4',
      'supplementary', 'targetConsistency', 'preRegistered.knownInconsistencyInBrief'],
    note: '窓は実測前に固定してあり実測後に動かしていない(preRegistered)。IW2 の FAIL は' +
      '「g が組織化変数として成立しない」ことの実測であって、窓や目標値を動かして回避していない。' +
      '数値床(90° 位相ずらし対照)は isog.iw3.numericalFloor にあり、IW2 の相対差が床の上に' +
      'あるかも aboveFloor に機械記録してある',
    externalReferences: ['第116便 exp-obscal.mjs §F の安定境界(安定側最大 g=4.138e-3・' +
      '不安定側最小 g=8.899e-3 — tests/out/obscal-results.json tests.kframeStability.gStar)',
      '🌘 の実離心率 0.0549(目標楕円 2e≈11% が「安定」側の amp 目安)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(記録しているのは相対距離の min/max と NaN フラグ)。' +
        '§F も同様であり、転記元から計装を増やしていない' },
  },
  regenerationNote: 'meta(日時・経過時間)は非測定メタなので照合対象外',
  excludeKeys: ['meta'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`\n転記照合 bit 一致=${transcription.allBitIdentical} / IW1=${iw1.pass ? 'PASS' : 'FAIL'} / ` +
  `IW2=${iw2.byG.map((r) => `${r.gTarget.toExponential(2)}:${r.pass ? 'PASS' : 'FAIL'}`).join(' ')} / ` +
  `IW4=${out.iw4.result}`);
console.log(`所要 ${out.meta.elapsedSec.toFixed(1)} 秒 / saved: ${path.relative(ROOT, OUT_PATH)}`);
await browser.close();
