// 第275便b(原仮定者の裁定〔第65報〕(2)の後段)— **複素決定力場の D₀ 非依存版を 🪁 の初期配置で測る**。
//
// ■ 裁定の字義
//   「**D₀ は距離に反比例する決定力の総和なので、距離の二乗に反比例する空間メッシュ=
//     複素決定力場では使わない。**」
//
// ■ 何をするか / しないか
//   ・**エンジンの既定経路には 1 バイトも接続しない**(`dfmGeoToyStep` の旧 D0p 経路は legacy として残す)。
//   ・🪁 galaxyMeshSpiralGeoToy の t=0 配置(351 体)を読み、
//     (a) **旧経路**(`HP.dfmLocalMeshField` に D₀=宣言値を渡す)
//     (b) **新 lawVersion `complex-nod0`・norm="self"**(χ≡1)
//     (c) **同・norm="configScale"**(χ=W/(W₀+W)・W₀=M_tot/(R_ref²+ε²))
//     を**同じ評価点**で比べる。**p=1(現行 share)と p=2(裁定の言う複素場)の両方**で測る。
//   ・**同値の機械照合**: (b) は「旧経路に D₀=0 を渡した値」と**ビット一致**するはずである
//     (自己規格化は D₀→0 の極限)。(c) は「旧経路に D₀=W₀ を渡した値」とビット一致するはずである。
//     一致しなければ本 lib の実装が旧経路と違うということなので、そのまま記録する。
//   ・**単位系に対する共変性**: 長さの単位を λ 倍に取り替えて χ を比べる。
//     宣言値 D₀ を数として据え置く旧経路は χ が変わり、(b)(c) は変わらない。
//
// ■ 書かないこと
//   「複素決定力場を実装した」「D₀ を外して解決した」「新しい法則を見つけた」。
//   置いたのは**規格化の 2 案と、その診断**である(どちらを採るかは決断事項)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w275b-meshnod0.mjs
// 出力: tests/out/meshnod0-w275b.json(CANON)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { MESHFIELD_VERSION, NOD0_LAW_NAME, NOD0_NORMS, meshFieldNoD0, scaleCovariance }
  from './lib-w275b-meshfield.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'meshnod0-w275b.json');
const HARNESS_VERSION = 'w275b-meshnod0-1';
const PRESET = 'galaxyMeshSpiralGeoToy';
const POWERS = [1, 2];                 // 1 = 現行 share の重み / 2 = 裁定の言う「距離の二乗に反比例」
const LAMBDA = 10;                     // 単位系を 10 倍に取り替える

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

// ---------------------------------------------------------------- t=0 の配置と旧経路の値
const cfg = await page.evaluate((id) => {
  const src = HP.allPresets().find((q) => q.id === id);
  const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
  if (!v.ok) return { error: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim, bodies = [];
  for (let i = 0; i < S.n; i++) bodies.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i],
    vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0, omega: 0, omegaDot: 0, R: null, Rdot: null });
  return { n: S.n, bodies, D0: S.params.D0, D0pull: S.params.D0pull === undefined ? null : S.params.D0pull,
    softening: S.params.softening, frameWeight: S.params.frameWeight,
    framePow: HP.frameWeightPow(S.params), G: S.params.G, geoPN: S.params.geoPN,
    lawVersion: (S.params.spaceMesh || {}).lawVersion || null };
}, PRESET);
if (cfg.error) { console.error(cfg.error); process.exit(2); }

// 評価点: 中心・円盤の内側/外側・盤外の 4 点(**宣言した点だけを測る**)
const rAll = cfg.bodies.map((b) => Math.hypot(b.x, b.y));
const rMax = Math.max(...rAll);
const POINTS = [
  { id: 'center', x: 0, y: 0 }, { id: 'inner', x: 0.25 * rMax, y: 0 },
  { id: 'outer', x: 0.75 * rMax, y: 0 }, { id: 'beyond', x: 1.5 * rMax, y: 0 },
];
// R_ref(norm:"configScale" の宣言必須の長さ)—— **配置そのものの大きさ**を使う(fit ノブではない)
const Mtot = cfg.bodies.reduce((s, b) => s + b.m, 0);
const Rrms = Math.sqrt(cfg.bodies.reduce((s, b) => s + b.m * (b.x * b.x + b.y * b.y), 0) / Mtot);
const RREF = Rrms;

// ---------------------------------------------------------------- 比較
const rows = [];
for (const p of POWERS) {
  for (const pt of POINTS) {
    const legacyOf = (D0) => page.evaluate((z) =>
      HP.dfmLocalMeshField(z.b, z.x, z.y, { D0: z.D0, eps: z.eps, p: z.p, support: false }),
    { b: cfg.bodies, x: pt.x, y: pt.y, D0, eps: cfg.softening, p });
    const legacy = await legacyOf(cfg.D0);
    const legacyZero = await legacyOf(0);
    const self = meshFieldNoD0(cfg.bodies, pt.x, pt.y, { p, eps: cfg.softening, norm: 'self' });
    const W0 = Mtot * Math.pow(RREF * RREF + cfg.softening * cfg.softening, -p / 2);
    const legacyW0 = await legacyOf(W0);
    const conf = meshFieldNoD0(cfg.bodies, pt.x, pt.y,
      { p, eps: cfg.softening, norm: 'configScale', Rref: RREF });
    // **同値の照合**。`same` はビット一致・`maxRel` は相対差。
    // p=1 では `Math.pow(s,−0.5)` の実装差(ページの V8 と node の V8 で最終 1 ULP が違う)が
    // 入るのでビット一致しない —— その差そのものを `powParity` で別に測る。**隠さない**。
    const cmp = (a, b) => {
      if (!a || !b) return { same: null, maxAbs: null, maxRel: null };
      const pairs = [[a.u[0], b.u[0]], [a.u[1], b.u[1]],
        [a.chi === null ? 0 : a.chi, b.chi === null ? 0 : b.chi],
        ...a.gradU.map((z, i) => [z, b.gradU[i]]), ...a.dUdt.map((z, i) => [z, b.dUdt[i]])];
      let maxAbs = 0, maxRel = 0;
      for (const [x, y] of pairs) {
        const d = Math.abs(x - y); if (d > maxAbs) maxAbs = d;
        const sc = Math.max(Math.abs(x), Math.abs(y));
        const r = sc > 0 ? d / sc : 0; if (r > maxRel) maxRel = r;
      }
      return { same: pairs.every(([x, y]) => x === y), maxAbs, maxRel };
    };
    rows.push({ p, point: pt.id, px: pt.x, py: pt.y,
      D0Declared: cfg.D0, W: legacy ? legacy.W : null, W0,
      chiLegacy: legacy ? legacy.chi : null,
      chiSelf: self ? self.chi : null, chiConfig: conf ? conf.chi : null,
      uLegacy: legacy ? legacy.u : null, uSelf: self ? self.u : null, uConfig: conf ? conf.u : null,
      uRelSelfVsLegacy: (legacy && self) ? relDiff(legacy.u, self.u) : null,
      uRelConfigVsLegacy: (legacy && conf) ? relDiff(legacy.u, conf.u) : null,
      identitySelfVsLegacyD0Zero: cmp(self, legacyZero),
      identityConfigVsLegacyD0W0: cmp(conf, legacyW0) });
  }
}
function relDiff(a, b) {
  const na = Math.hypot(a[0], a[1]), d = Math.hypot(a[0] - b[0], a[1] - b[1]);
  return na > 0 ? d / na : (d === 0 ? 0 : Infinity);
}

// ---------------------------------------------------------------- Math.pow の実装差(否定結果)
// node とページ(Chromium)の V8 は `Math.pow(s,−0.5)` の最終 1 ULP が一致しない。
// **p=2(指数 −1 = 除算)は一致する**。node 側の純関数と html の関数を「ビット一致」で
// 突き合わせるときの床がここにあることを、**数で残す**。
const powParity = await (async () => {
  const sList = cfg.bodies.slice(0, 64).map((b) => {
    const dx = POINTS[2].x - b.x, dy = POINTS[2].y - b.y;
    return dx * dx + dy * dy + cfg.softening * cfg.softening;
  });
  const inPage = await page.evaluate((z) => z.s.map((v) => [Math.pow(v, -0.5), Math.pow(v, -1)]),
    { s: sList });
  let n05 = 0, n1 = 0, maxRel05 = 0;
  sList.forEach((v, i) => {
    const a = Math.pow(v, -0.5), b = Math.pow(v, -1);
    if (a !== inPage[i][0]) { n05++; const r = Math.abs(a - inPage[i][0]) / Math.abs(a); if (r > maxRel05) maxRel05 = r; }
    if (b !== inPage[i][1]) n1++;
  });
  return { samples: sList.length, mismatchPowMinusHalf: n05, mismatchPowMinusOne: n1,
    maxRelMinusHalf: maxRel05,
    note: 'ページ(Chromium の V8)と node の V8 で Math.pow(s,−0.5) の最終 1 ULP が違う。'
      + '**p=2(指数 −1)は一致する** —— 「ビット一致」を要求できるのは p=2 の列だけである' };
})();

// ---------------------------------------------------------------- 単位系共変性
const cov = [];
for (const p of POWERS) {
  for (const pt of POINTS) {
    const r = scaleCovariance(cfg.bodies, pt.x, pt.y,
      { lambda: LAMBDA, p, eps: cfg.softening, D0: cfg.D0, Rref: RREF });
    cov.push({ p, point: pt.id, ...r });
  }
}

// ---------------------------------------------------------------- 門(**否定対照も出す**)
const gates = {
  selfNullWhenNoSource: meshFieldNoD0([], 0, 0, { p: 2, eps: 1, norm: 'self' }) === null,
  configNeedsRref: meshFieldNoD0(cfg.bodies, 0, 0, { p: 2, eps: 1, norm: 'configScale' }) === null,
  negativeMassRejected: meshFieldNoD0([{ m: -1, x: 1, y: 0 }], 0, 0, { p: 2, eps: 1, norm: 'self' }) === null,
  unknownNormRejected: meshFieldNoD0(cfg.bodies, 0, 0, { p: 2, eps: 1, norm: 'complex' }) === null,
  d0NeverRead: !/\bD0\b/.test(String(meshFieldNoD0)),   // 表示用(実体は下の note)
};

const CODE = ['tests/exp-w275b-meshnod0.mjs', 'tests/lib-w275b-meshfield.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第275便b', target: TARGET,
    code: CODE, inputs: [TARGET] }), {
    harness: 'tests/exp-w275b-meshnod0.mjs', harnessVersion: HARNESS_VERSION,
    meshfieldVersion: MESHFIELD_VERSION, lawVersionProposed: NOD0_LAW_NAME, norms: NOD0_NORMS,
    preset: PRESET, engineAttached: false,
    legacyPath: 'dfmGeoToyStep → dfmField(D0:D0p) → dfmLocalMeshField(χ=W/(D₀+W)) —— **legacy として残す**',
    declaredConfig: { D0: cfg.D0, D0pull: cfg.D0pull, softening: cfg.softening,
      frameWeight: cfg.frameWeight, framePow: cfg.framePow, geoPN: cfg.geoPN,
      spaceMeshLawVersion: cfg.lawVersion, n: cfg.n, Mtot, Rrms, Rref: RREF, lambda: LAMBDA },
    notClaim: ['複素決定力場を実装した', 'D₀ を外して解決した', 'エンジンへ接続した',
      '新しい法則を見つけた', '規格化の案を採用した'] }),
  points: POINTS, powers: POWERS, rows, scaleCovariance: cov, powParity, gates,
  gatesNote: 'd0NeverRead は関数本体の綴りを見るだけの表示用の印である'
    + '(実体は「本 lib の引数に D₀ が無い」こと —— `meshFieldNoD0` の opts に D0 の欄は無い)',
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const r of rows) {
  console.log(['p=' + r.p, r.point.padEnd(7),
    'χ_legacy=' + (r.chiLegacy === null ? '—' : r.chiLegacy.toExponential(6)),
    'χ_self=' + (r.chiSelf === null ? '—' : r.chiSelf.toFixed(6)),
    'χ_conf=' + (r.chiConfig === null ? '—' : r.chiConfig.toExponential(6)),
    'self≡D0:0 ' + r.identitySelfVsLegacyD0Zero.same,
    'conf≡D0:W0 ' + r.identityConfigVsLegacyD0W0.same].join(' '));
}
console.log('wrote ' + OUT);
await browser.close();
