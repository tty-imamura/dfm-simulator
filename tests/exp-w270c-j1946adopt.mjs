// 第270便c(第60報「次便(AD9)の前提: 揃えてよい」・統括の読み (A)(D)): **AD9 署名便**の器。
//
// ■ 何をするか
//   PSR J1946+2052 の**採用レコードを一組へ揃える**(旧: Pb/e は Stovall 2018 発見解・ω̇ だけ
//   Meng 2025 DDFWHE = 混在 X4 / 新: Pb・e・ω̇・自転を **Meng 2025 A&A 704 A153 Table 1 DDFWHE 列**の
//   一組)。その初期条件を**転写手続きのまま**組み直し、🩺 psrJ1946DFM / 🪀 psrJ1946PN /
//   🩹 psrJ1946CF の宣言リテラルを機械算出する。
//
//   --build … 旧(v1)と新(DDFWHE 一組)の転写を両方組み、**旧がプリセットの現在値を桁一致で
//             再現すること**を自己点検してから、新しいリテラルを出す(手で数値を打たない)。
//   --run3  … 🩺🪀🩹 を **3 段**(既定は 4 段 h=0.016/d, d=1,2,4,8。3 段の三つ組は最後の
//             (h/2, h/4, h/8)である)で走らせ、
//             近点間 P・離心率 proxy・近点移動(deg/yr)を 20 近点窓で測り、**採用レコードの σ**
//             に対する距離(σ 倍)を出す。**共同根(k*, f*)は別器**(--root)。
//   --root  … 🩺🪀🩹 の**共同根の再計算**(初期条件が変わったので旧共同根は無効)。
//             k* = 近点移動を観測へ合わせる compactForce の κ、f* = λ_PN=1/f の f を
//             それぞれ 1 次元の割線法で求める(**旧値と並べるためであって「再検証」ではない**)。
//   --sig   … 3 本の presetSig を出す(署名便で動く署名の記録)。
//
// ■ 書かないこと
//   「J1946 の共同根を再検証した」「観測と合った」「較正した」「判定が増えた」。
//   本器は**採用解を一組へ揃えた結果を測る**だけで、合否を宣言しない。
//
// 実行: node tests/exp-w270c-j1946adopt.mjs [--build] [--run3] [--root] [--sig] [--divs 2,4,8]
// 出力: tests/out/j1946adopt-w270c.json
// 注意: playwright は `PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright` を前置する。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import { shiftedRichardson } from './lib-w262c-refint.mjs';
// 第272便e(AG11): 来歴(inputs・code・codeSha256)は共通の 1 本で作る。
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["psrJ1946CF","psrJ1946DFM","psrJ1946PN"],"roots":["$","HP.allPresets","HP.dfmBinaryMassFactor","HP.dfmBinaryMassFactorLinear","HP.sim","HP.validatePreset","T","applyQLock","ch","ctx","fmt","isNum","presetSig","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const OUT = path.join(ROOT, 'tests', 'out', process.env.W270C_OUT || 'j1946adopt-w270c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const only = argv.filter((a) => a.startsWith('--') && a !== '--divs').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const DIVS = arg('--divs', '1,2,4,8').split(',').map(Number).filter((z) => z > 0);
const DT0 = 0.016, PERI_WINDOW = 20, YEAR_SEC = 3.15576e7;
const BODY = 'PSR J1946+2052';

// ---------------------------------------------------------------- CSV(**正本**。数値は 1 つも手打ちしない)
function loadCsv() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = [];
  const lines = txt.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = []; let cur = '', q = false;
    for (let j = 0; j < line.length; j++) { const ch = line[j];
      if (q) { if (ch === '"') { if (line[j + 1] === '"') { cur += '"'; j++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { c.push(cur); cur = ''; } else cur += ch; }
    c.push(cur);
    const sg = (c[8] !== undefined && String(c[8]).trim() !== '') ? Number(c[8]) : null;
    rows.push({ line: i + 1, body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3],
      source: String(c[4]), note: String(c[7] || ''),
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return rows;
}
const CSV = loadCsv();
const pick = (body, quantity, unit, srcRe) => {
  const z = CSV.filter((r) => r.body === body && r.quantity === quantity
    && (!unit || r.unit === unit) && (!srcRe || srcRe.test(r.source)));
  if (z.length !== 1) throw new Error(`[w270c] CSV の行が 1 件に決まらない: ${body}|${quantity} → ${z.length} 件`);
  return z[0];
};
const first = (body, quantity, unit) => {
  const z = CSV.filter((r) => r.body === body && r.quantity === quantity && (!unit || r.unit === unit));
  if (!z.length) throw new Error(`[w270c] CSV に行が無い: ${body}|${quantity}`);
  return z[0];
};
// 採用解(DDFWHE 一組)の行は **`Meng et al. 2025, A&A 704, A153, Table 1 DDFWHE column`**(2026-09-14 intake)
const DDFWHE = /^Meng et al\. 2025, A&A 704, A153, Table 1 DDFWHE column$/;
const REC = {
  P: pick(BODY, 'orbital_period', 's', DDFWHE),          // 行 285
  e: pick(BODY, 'eccentricity', '1', DDFWHE),            // 行 289
  w: pick(BODY, 'periastron_advance', 'deg/yr', DDFWHE), // 行 290
  spin: pick(BODY, 'rotation_period', 's', DDFWHE),      // 行 298
  Mtot: pick(BODY, 'total_mass', 'kg', DDFWHE),          // 行 297
};
// 旧レコード(previous): Pb/e は Stovall 2018 の発見解・ω̇ は Meng 2025(= 混在 X4)
const PREV = {
  P: first(BODY, 'orbital_period', 's'),                 // 行 145(Stovall 2018)
  e: first(BODY, 'eccentricity', '1'),                   // 行 146(Stovall 2018)
  w: first(BODY, 'periastron_advance', 'deg/yr'),        // 行 148(Meng 2025・混在の相手)
  spin: first(BODY, 'rotation_period', 's'),             // 行 144
  a: first(BODY, 'semi_major_axis', 'm'),                // 行 147(旧 Pb から導いた a)
};
// 質量(**採用解の切替で動かない**): Table 1 の DDFWHE 列でも要旨でも M☉ 表示は同じ
// (1.2838 / 1.2480・総質量 2.531858)。kg 換算の規約だけが行ごとに違う(行 142/143 は
// 1.9885e30 kg/M☉・行 295/296 は GM☉/G)。**本便は単位換算の規約を変えない**(族規約に触れないため)。
const MASS = { A: first(BODY, 'mass', 'kg'), B: first(BODY + ' companion', 'mass', 'kg') };
// 総質量(M☉)は**レコードの note に印字された原記載**から読む(手打ちしない)
const mtotMsun = (() => { const m = /orig\s+([0-9.]+)\(/.exec(REC.Mtot.note);
  if (!m) throw new Error('[w270c] total_mass の note から原記載 M☉ が読めない'); return Number(m[1]); })();

// ---------------------------------------------------------------- 転写手続き(⚡🧮🩺🧶 共通・第248便a)
const SCALE = { L: 1e6, T: 1e1, M: 1e27 };
const G_UNIT = 6.674, C_UNIT = 3000, EPS = 0.05, D0P = 3.24204e-7;
const GMSUN = 1.3271244e20;                 // IAU 2015 B3(単位換算の規約)
// 質量は **builder(tests/exp-w248a.mjs `__w248build`)と同じ算術**で作る ——
// M☉ 表示 × 規約の太陽質量 1.9885e30 kg。CSV の kg 欄を割るのと最下位ビットで違うことがあり、
// 台帳 `massCalibration.baseMass` は builder 側の値なので、**builder に合わせる**(裏取りが成立する)。
const msunOf = (row) => { const m = /([0-9.]+)\(\d+\) M_sun/.exec(row.note);
  if (!m) throw new Error('[w270c] mass の note から M☉ 表示が読めない'); return Number(m[1]); };
const MSUN_KG = (() => { const m = /x ([0-9.e+]+) kg/.exec(MASS.A.note);
  if (!m) throw new Error('[w270c] mass の note から kg 換算の規約が読めない'); return Number(m[1]); })();
function transcribe(Psec, ecc) {
  const aSI = Math.cbrt(mtotMsun * GMSUN * Psec * Psec / (4 * Math.PI * Math.PI));
  const a = aSI / SCALE.L;
  const mA = msunOf(MASS.A) * MSUN_KG / SCALE.M, mB = msunOf(MASS.B) * MSUN_KG / SCALE.M;
  const sep = a * (1 + ecc);
  const vrel = Math.sqrt(G_UNIT * (mA + mB) / a * (1 - ecc) / (1 + ecc));
  return { aSI, a, mA, mB, sep, vrel, ecc, Psec };
}
const R_UNIT = 0.01175;                      // 宣言つき EOS proxy 11.75 km(行 150/354・**観測半径ではない**)
const qExact = (Ms, a) => { const X = 1.25 * C_UNIT * C_UNIT * R_UNIT / (G_UNIT * Ms);
  const Ln = Math.log((R_UNIT + a) / R_UNIT);
  return 3 + Math.log(X) / Ln + 3 * Math.log(a / (R_UNIT + a)) / Ln; };

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// 第271便e(統括の検証項目 R8): 本 JSON を公開物にするため、**どの html を走らせた結果か**を
// ファイル自身に持たせる(QA `docs.j1946adoptPublished` が現行 html の sha256 と突き合わせる)。
const TARGET_SHA256 = crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(ROOT, TARGET))).digest('hex');
// 第272便e(AG11): 来歴を 6 本の正本で**同じ形**にした(`inputs`・`code`・`codeSha256` を追加。
//   `wave`・`target`・`targetSha256`・`generatedAt` は第271便e の綴りのまま)。
const PROV = provenanceMeta({ root: ROOT, wave: '第270便c(来歴は第272便e で共通化)', target: TARGET,
  code: ['tests/exp-w270c-j1946adopt.mjs', 'tests/lib-w270b-obscsv.mjs', 'tests/lib-w272e-provenance.mjs'],
  inputs: [TARGET, 'paper/data/solar-observations.csv'] });
const out = { meta: { provenanceVersion: PROV.provenanceVersion,
  inputs: PROV.inputs, code: PROV.code, codeSha256: PROV.codeSha256,
  wave: '第270便c', target: TARGET, targetSha256: TARGET_SHA256,
  generatedAt: new Date().toISOString(), dt0: DT0, periWindow: PERI_WINDOW, divs: DIVS,
  sections: only.length ? only.slice() : ['build', 'run3', 'root', 'sig'],
  what: 'AD9: PSR J1946+2052 の採用レコードを Meng 2025 A&A 704 A153 Table 1 DDFWHE の一組へ',
  doNotWrite: ['共同根を再検証した', '観測と合った', '較正した', '判定が増えた'] } };

// ---------------------------------------------------------------- --build
async function buildSection() {
  const linear = async (mA, mB, a) => pg.evaluate(({ mA, mB, a, D0P, EPS }) =>
    ({ lin: HP.dfmBinaryMassFactorLinear(mA, mB, a, D0P, EPS, 1, 2),
      quad: HP.dfmBinaryMassFactor(mA, mB, a, D0P, EPS, 1, 2) }), { mA, mB, a, D0P, EPS });
  const declared = await pg.evaluate(() => {
    const ids = ['psrJ1946DFM', 'psrJ1946PN', 'psrJ1946CF'];
    const r = {};
    for (const id of ids) { const p = HP.allPresets().find((q) => q.id === id);
      r[id] = { bodies: JSON.parse(JSON.stringify(p.bodies)), physicsQ: p.physics.q,
        lambdaPN: p.physics.lambdaPN, massCalibration: JSON.parse(JSON.stringify(p.massCalibration)) }; }
    return r;
  });
  const mk = async (Psec, ecc, spinSec) => {
    const t = transcribe(Psec, ecc);
    const fx = await linear(t.mA, t.mB, t.a);
    const f = fx.lin.f, mAc = t.mA * f, mBc = t.mB * f, Mc = mAc + mBc;
    return { Psec, ecc, spinSec, aSI: t.aSI, a: t.a, sep: t.sep, vrel: t.vrel,
      mA: t.mA, mB: t.mB, f, chi: [fx.lin.chiA, fx.lin.chiB],
      fQuad: fx.quad ? fx.quad.f : null, chiQuad: fx.quad ? [fx.quad.chiA, fx.quad.chiB] : null,
      mAc, mBc, massFrac: (f - 1) / f,
      qA: qExact(t.mA, t.a), qB: qExact(t.mB, t.a),
      x0: -t.sep * mBc / Mc, x1: t.sep * mAc / Mc,
      vy0: -t.vrel * mBc / Mc, vy1: t.vrel * mAc / Mc,
      spinOmega: 2 * Math.PI / (spinSec / SCALE.T), lambdaPN: 1 / f };
  };
  const prev = await mk(PREV.P.value, PREV.e.value, PREV.spin.value);
  const now = await mk(REC.P.value, REC.e.value, REC.spin.value);
  const d0 = declared.psrJ1946DFM.bodies[0], d1 = declared.psrJ1946DFM.bodies[1];
  const rel = (a, b) => (b === 0 ? (a === 0 ? 0 : null) : (a - b) / b);
  const selfCheck = {
    note: '**旧レコードからプリセットの現在値が戻るか**(戻らなければ転写手続きの読み違い)',
    x0: rel(prev.x0, d0.x), x1: rel(prev.x1, d1.x), vy0: rel(prev.vy0, d0.vy), vy1: rel(prev.vy1, d1.vy),
    m0: rel(prev.mAc, d0.m), m1: rel(prev.mBc, d1.m),
    dragQ0: rel(prev.qA, d0.dragQ), dragQ1: rel(prev.qB, d1.dragQ),
    massFrac: rel(prev.massFrac, d0.core.massFrac),
    factor: rel(prev.f, declared.psrJ1946DFM.massCalibration.factor),
    spinOmega: rel(prev.spinOmega, d0.spinDipole.omega),
    lambdaPN: rel(prev.lambdaPN, declared.psrJ1946PN.lambdaPN),
    aFromCsvRow: rel(prev.aSI, PREV.a.value),
  };
  // 第271便e(統括の検証項目 R8): **採用後の tree で回すと `selfCheck` は 0 にならない**
  //   —— 旧レコードの転写と現行プリセット(= 既に採用リテラルへ更新済み)を比べているためである。
  //   採用後に 0 になるべきなのはこちら(採用レコードの転写 ↔ 宣言リテラル)なので、
  //   公開する JSON には**両方**を載せる(どちらが 0 かで、その JSON が採用前後どちらの tree で
  //   生成されたかが読み取れる)。
  const adoptedCheck = {
    note: '**採用レコードの転写からプリセットの宣言リテラルが戻るか**(採用後の tree では ~0 になる)',
    x0: rel(now.x0, d0.x), x1: rel(now.x1, d1.x), vy0: rel(now.vy0, d0.vy), vy1: rel(now.vy1, d1.vy),
    m0: rel(now.mAc, d0.m), m1: rel(now.mBc, d1.m),
    dragQ0: rel(now.qA, d0.dragQ), dragQ1: rel(now.qB, d1.dragQ),
    massFrac: rel(now.massFrac, d0.core.massFrac),
    factor: rel(now.f, declared.psrJ1946DFM.massCalibration.factor),
    spinOmega: rel(now.spinOmega, d0.spinDipole.omega),
    lambdaPN: rel(now.lambdaPN, declared.psrJ1946PN.lambdaPN),
  };
  out.build = { records: {
    previous: { P: PREV.P.value, Psigma: PREV.P.sigma, Psrc: PREV.P.source.slice(0, 70), Pline: PREV.P.line,
      e: PREV.e.value, eSigma: PREV.e.sigma, eSrc: PREV.e.source.slice(0, 70), eLine: PREV.e.line,
      w: PREV.w.value, wSigma: PREV.w.sigma, wSrc: PREV.w.source.slice(0, 70), wLine: PREV.w.line,
      spin: PREV.spin.value, spinLine: PREV.spin.line },
    adopted: { P: REC.P.value, Psigma: REC.P.sigma, Psrc: REC.P.source, Pline: REC.P.line,
      e: REC.e.value, eSigma: REC.e.sigma, eSrc: REC.e.source, eLine: REC.e.line,
      w: REC.w.value, wSigma: REC.w.sigma, wSrc: REC.w.source, wLine: REC.w.line,
      spin: REC.spin.value, spinLine: REC.spin.line,
      totalMassMsun: mtotMsun, totalMassLine: REC.Mtot.line },
    massUnchanged: { A: MASS.A.value, ALine: MASS.A.line, B: MASS.B.value, BLine: MASS.B.line,
      why: 'Table 1 の DDFWHE 列の M☉ 表示(1.2838 / 1.2480・総質量 2.531858)は要旨の組と同じ値で、'
        + '**採用解の切替で質量は動かない**。kg 換算の規約だけが行 142/143(1.9885e30)と'
        + '行 295/296(GM☉/G)で 4.5×10⁻⁵ 相対に違うが、**本便は換算規約を変えない**。'
        + '質量は 1PN の ω̇ と γ から **GR を仮定して**導いた model-derived 値である(GR 依存の条件つき参照値)。' },
    delta: { P: REC.P.value - PREV.P.value, Prel: (REC.P.value - PREV.P.value) / PREV.P.value,
      e: REC.e.value - PREV.e.value, eRel: (REC.e.value - PREV.e.value) / PREV.e.value,
      w: REC.w.value - PREV.w.value,
      sigmaRatioP: (PREV.P.sigma && REC.P.sigma) ? PREV.P.sigma / REC.P.sigma : null,
      sigmaRatioE: (PREV.e.sigma && REC.e.sigma) ? PREV.e.sigma / REC.e.sigma : null } },
    previous: prev, adopted: now, selfCheck, adoptedCheck, declared,
    deltaLiterals: { a: now.a - prev.a, aRel: (now.a - prev.a) / prev.a,
      sep: now.sep - prev.sep, sepRel: (now.sep - prev.sep) / prev.sep,
      vrel: now.vrel - prev.vrel, vrelRel: (now.vrel - prev.vrel) / prev.vrel,
      f: now.f - prev.f, qA: now.qA - prev.qA, qB: now.qB - prev.qB } };
  const fmt = (o) => Object.entries(o).filter(([k]) => k !== 'note')
    .map(([k, v]) => k + ' ' + (v === null ? '—' : v.toExponential(2))).join(' / ');
  console.error('[w270c-build] 自己点検(旧→現プリセット)相対差: ' + fmt(selfCheck));
  console.error('[w270c-build] 採用点検(採用→現プリセット)相対差: ' + fmt(adoptedCheck));
  console.error('[w270c-build] 新リテラル: a=' + now.a + ' sep=' + now.sep + ' vrel=' + now.vrel);
  console.error('  m0=' + now.mAc + ' m1=' + now.mBc + ' f=' + now.f + ' 1/f=' + now.lambdaPN);
  console.error('  x0=' + now.x0 + ' x1=' + now.x1 + ' vy0=' + now.vy0 + ' vy1=' + now.vy1);
  console.error('  dragQ=' + now.qA + ' / ' + now.qB + '  massFrac=' + now.massFrac
    + '  spinOmega=' + now.spinOmega);
}

// ---------------------------------------------------------------- 走行(近点検出は第261便c の位相ゲート)
const LIB_SRC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
async function installRunner() {
  await pg.addScriptTag({ content: LIB_SRC });
  await pg.evaluate((PW) => {
    window.__w270c = (id, dt, maxSteps, budgetMs, patch) => {
      const p = HP.allPresets().find((q) => q.id === id);
      const c = JSON.parse(JSON.stringify(p));
      if (patch) patch(c);
      const v = HP.validatePreset(c);
      HP.sim.build(v.preset);
      const S = HP.sim, ci = 0, oi = 1;
      const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
      const t0 = performance.now();
      let k = 0, stopped = 'window', accepted = 0, inWindow = false, rMin = Infinity, rMax = -Infinity;
      for (; k < maxSteps; k++) {
        S.step(dt);
        const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
        const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        if (inWindow) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
        const a = det.push(k, rr, rd, th);
        if (a.accepted) { accepted++; inWindow = true; }
        if (accepted >= PW) { stopped = 'window'; break; }
        if (S.hasNaN()) { stopped = 'nan'; break; }
        if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'time-budget'; break; }
      }
      if (k >= maxSteps) stopped = 'max-steps';
      const res = det.result(PW);
      const n = Math.min(res.nPeri, PW);
      const full = (res.nPeri >= PW) && !res.unwrapFailed;
      const peri = res.peri.slice(0, n), ang = res.ang.slice(0, n);
      const perMean = full ? (peri[PW - 1].k - peri[0].k) * dt / (PW - 1) : null;
      let slope = null;
      if (ang.length >= 3) {
        const tim = ang.map((_, i) => peri[i].k * dt);
        const mt = tim.reduce((s, z) => s + z, 0) / tim.length;
        const ma = ang.reduce((s, z) => s + z, 0) / ang.length;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < ang.length; i++) { sxy += (tim[i] - mt) * (ang[i] - ma); sxx += (tim[i] - mt) ** 2; }
        if (sxx > 0) slope = sxy / sxx;
      }
      return { steps: k, stopped, measured: full && res.measured, nPeri: res.nPeri,
        unwrapFailed: res.unwrapFailed, nan: S.hasNaN(), clampVN: S.clampVN, clampSN: S.clampSN,
        perMeanSim: perMean, slopeRadPerSimTime: slope,
        eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null };
    };
  }, PERI_WINDOW);
}
// 1 段の走行を「秒・deg/yr・deg/周」へ換算する
async function runOne(id, dt, patchSrc) {
  const r = await pg.evaluate(({ id, dt, patchSrc }) =>
    window.__w270c(id, dt, 8e8, 1500000, patchSrc ? eval('(' + patchSrc + ')') : null),
  { id, dt, patchSrc: patchSrc || null });
  const P = (r.perMeanSim !== null) ? r.perMeanSim * SCALE.T : null;
  const wYr = (r.slopeRadPerSimTime !== null) ? r.slopeRadPerSimTime * 180 / Math.PI / SCALE.T * YEAR_SEC : null;
  const wOrb = (wYr !== null && P !== null) ? wYr * P / YEAR_SEC : null;
  return Object.assign(r, { dt, perMeanSec: P, degPerYear: wYr, degPerOrbit: wOrb });
}

// ---------------------------------------------------------------- --run3
async function run3Section() {
  const ids = ['psrJ1946DFM', 'psrJ1946PN', 'psrJ1946CF'];
  const res = {};
  for (const id of ids) {
    const stages = [];
    for (const d of DIVS) {
      const t0 = Date.now();
      const r = await runOne(id, DT0 / d);
      r.wallSec = +((Date.now() - t0) / 1000).toFixed(1);
      r.div = d;
      stages.push(r);
      console.error(`  ${id} h/${d} 步 ${r.steps} ${r.wallSec}s P=${r.perMeanSec === null ? '—' : r.perMeanSec.toFixed(6)}`
        + ` ω̇=${r.degPerYear === null ? '—' : r.degPerYear.toFixed(6)} e=${r.eProxy === null ? '—' : r.eProxy.toFixed(7)} (${r.stopped})`);
    }
    const rP = shiftedRichardson(stages.map((z) => z.perMeanSec));
    const rW = shiftedRichardson(stages.map((z) => z.degPerYear));
    const rE = shiftedRichardson(stages.map((z) => z.eProxy));
    const nsig = (v, val, sg) => (Number.isFinite(v) && sg > 0) ? (v - val) / sg : null;
    res[id] = { stages, richardsonP: rP, richardsonW: rW, richardsonE: rE,
      // **宣言後の初判定**(採用レコード = Meng 2025 DDFWHE 一組。旧レコードの σ は併記する)
      declaredFirst: {
        mode: 'declared-first-verdict(AD9)',
        P: { yInf: rP.yInf, obs: REC.P.value, sigma: REC.P.sigma, nSigma: nsig(rP.yInf, REC.P.value, REC.P.sigma),
          residualPct: Number.isFinite(rP.yInf) ? 100 * (rP.yInf - REC.P.value) / REC.P.value : null },
        e: { yInf: rE.yInf, obs: REC.e.value, sigma: REC.e.sigma, nSigma: nsig(rE.yInf, REC.e.value, REC.e.sigma),
          residualPct: Number.isFinite(rE.yInf) ? 100 * (rE.yInf - REC.e.value) / REC.e.value : null },
        w: { yInf: rW.yInf, obs: REC.w.value, sigma: REC.w.sigma, nSigma: nsig(rW.yInf, REC.w.value, REC.w.sigma),
          residualPct: Number.isFinite(rW.yInf) ? 100 * (rW.yInf - REC.w.value) / REC.w.value : null } },
      againstPrevious: {
        P: { obs: PREV.P.value, sigma: PREV.P.sigma, nSigma: nsig(rP.yInf, PREV.P.value, PREV.P.sigma) },
        e: { obs: PREV.e.value, sigma: PREV.e.sigma, nSigma: nsig(rE.yInf, PREV.e.value, PREV.e.sigma) },
        w: { obs: PREV.w.value, sigma: PREV.w.sigma, nSigma: nsig(rW.yInf, PREV.w.value, PREV.w.sigma) },
        note: '**旧レコードは previous** —— 採用解から外れた行に対する距離は履歴として並べるだけである' },
      note: '**合否は宣言しない**。σ 倍は「採用レコードに対する距離」であって、'
        + '門の必須ガード(定義宣言・観測量対応・数値収束)は本器では見ていない' };
  }
  out.run3 = res;
}

// ---------------------------------------------------------------- --root(共同根の再計算)
// k*: 🩹 の compactForce.kappa を動かして近点移動を採用レコードの ω̇ に一致させる値。
// f*: 🪀 の lambdaPN を動かして同じことをする値(f* = 1/λ*)。
// **割線法**(2 点から出発・最大 6 回)。刻みは h/4 固定(3 段の最細ではなく、根の**位置**を出す用)。
async function rootSection() {
  const targets = [
    { id: 'psrJ1946CF', key: 'kappa', label: 'k*(compactForce.kappa)',
      patch: (v) => `(c)=>{c.physics.compactForce.kappa=${v};}`, x0: 12.015360249506628, x1: 12.003020 },
    { id: 'psrJ1946PN', key: 'lambdaPN', label: 'f*(λ_PN=1/f の f)',
      patch: (v) => `(c)=>{c.physics.lambdaPN=${1 / v};}`, x0: 1.999965529570855, x1: 2.0006 },
  ];
  const DIV = 4;
  const res = {};
  for (const t of targets) {
    const hist = [];
    const F = async (v) => {
      const r = await runOne(t.id, DT0 / DIV, t.patch(v));
      const val = r.degPerYear;
      hist.push({ v, degPerYear: val, steps: r.steps, stopped: r.stopped, nPeri: r.nPeri });
      console.error(`  root ${t.id} ${t.key}=${v} → ω̇=${val === null ? '—' : val.toFixed(6)} (目標 ${REC.w.value})`);
      return (val === null) ? null : (val - REC.w.value);
    };
    let a = t.x0, b = t.x1, fa = await F(a), fb = await F(b), root = null;
    for (let i = 0; i < 6 && fa !== null && fb !== null; i++) {
      if (fb === fa) break;
      const c = b - fb * (b - a) / (fb - fa);
      if (!Number.isFinite(c)) break;
      const fc = await F(c);
      if (fc === null) break;
      a = b; fa = fb; b = c; fb = fc; root = c;
      if (Math.abs(fc) < Math.abs(REC.w.sigma || 1e-4) * 0.05) break;
    }
    res[t.id] = { label: t.label, key: t.key, dt: DT0 / DIV, history: hist, root,
      residualAtRoot: fb, targetOmegaDot: REC.w.value,
      note: '**旧共同根は初期条件が変わったので無効**である(旧値は履歴として並べるだけで、'
        + '「再検証済み」とは書かない)。本欄は**採用レコード一組に対する根の位置**である' };
  }
  out.roots = res;
}

// ---------------------------------------------------------------- --sig
async function sigSection() {
  out.presetSig = await pg.evaluate(() => {
    const r = {};
    for (const id of ['psrJ1946DFM', 'psrJ1946PN', 'psrJ1946CF']) {
      const p = HP.allPresets().find((q) => q.id === id);
      const s = presetSig(p);
      let h = 0x811c9dc5;
      for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
      r[id] = { length: s.length, fnv1a: h.toString(16) };
    }
    return r;
  });
  console.error('[w270c-sig] ' + JSON.stringify(out.presetSig));
}

if (want('build')) await buildSection();
if (want('run3') || want('root')) await installRunner();
if (want('run3')) await run3Section();
if (want('root')) await rootSection();
if (want('sig')) await sigSection();
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
// 既存の節を消さない(--build と --run3 を別走行で足せるように merge する)
let prevOut = {};
try { prevOut = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { prevOut = {}; }
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(Object.assign(prevOut, out), null, 1));
console.error('[w270c] wrote ' + OUT);
