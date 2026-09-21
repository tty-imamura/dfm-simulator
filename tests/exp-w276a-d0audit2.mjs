// 第276便a(原仮定者の裁定〔第66報〕(1)「**影響箇所を精査する**」)— **D₀ の読み口の機械監査**。
//
// ■ 何をするか
//   `beta/index.html` の inline script から**コメント・文字列・正規表現リテラルを潰した写し**を作り、
//   識別子 `D0` / `D0pull` / `D0p` / `frameWeightPow` の**出現位置を 1 つ残らず機械抽出**して、
//   ① 囲っている最上位関数(波括弧の深さで判定)・② その中の最も近い定義名・③ 証拠行・
//   ④ `D0pull!==undefined` の fallback を持つか —— を並べる。
//   **用途と「W₀ へ置き換えてよいか」は宣言表**(下の `SITE_CLASS`)で、**抽出は機械**である:
//   宣言表に無い読み口が 1 つでも出たら `unclassified` に残る(**黙って落とさない**)。
//
// ■ 自己検査(抽出が壊れていないことの機械確認)
//   潰した写しの **波括弧・丸括弧・角括弧の収支がすべて 0** であること(`selfCheck`)。
//   収支が合わないときは潰し方が壊れている(文字列・正規表現の取り違え)ので、表を信用しない。
//
// ■ ページで測ること
//   ・**R39(統括の検証項目)**: `qLockCalc` は R・M・G・cLight・基準距離 a から q を出し、
//     **D₀/D0pull を読まない**。❄️ plutoCharonReal の診断コピーで D₀ を振って q を実測する。
//     **内蔵の値は 1 つも変えない**(診断コピーの physics を器の側で上書きするだけ)。
//   ・**新しい宣言鍵 `physics.backgroundComplex` の参照箇所**が、検証器・検証器の分岐・
//     定数・HP の書き出しだけであること(**エンジンのどの経路も読まない**の機械確認)。
//
// ■ しないこと
//   ・D₀ の値を変えない・判定をしない・「置換してよい」と決めない(**表に並べるだけ**)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w276a-d0audit2.mjs
// 出力: tests/out/d0sites-w276a.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'd0sites-w276a.json');
const HARNESS_VERSION = 'w276a-d0sites-1';
const TOKENS = ['D0pull', 'D0p', 'D0eff', 'D0Source', 'D0', 'frameWeightPow'];

// ---------------------------------------------------------------- 潰し(コメント・文字列・正規表現)
function stripJs(code) {
  const n = code.length;
  let out = '', i = 0, st = 0, lastSig = '', inClass = false;
  const push = (c) => { out += c; };
  const blank = (c) => { push(c === '\n' ? '\n' : ' '); };
  while (i < n) {
    const c = code[i], d = code[i + 1];
    if (st === 0) {
      if (c === '/' && d === '/') { st = 1; push(' '); push(' '); i += 2; continue; }
      if (c === '/' && d === '*') { st = 2; push(' '); push(' '); i += 2; continue; }
      if (c === '/') {
        // 正規表現リテラルの始まりか(直前の有意文字が値の終わりでなければ正規表現)
        if (lastSig === '' || /[^\w$)\]]/.test(lastSig)) { st = 6; inClass = false; push(' '); i++; continue; }
        push(c); lastSig = c; i++; continue;
      }
      if (c === "'") { st = 3; push('"'); i++; continue; }
      if (c === '"') { st = 4; push('"'); i++; continue; }
      if (c === '`') { st = 5; push('`'); i++; continue; }
      push(c); if (!/\s/.test(c)) lastSig = c; i++; continue;
    }
    if (st === 1) { if (c === '\n') { st = 0; push('\n'); i++; continue; } blank(c); i++; continue; }
    if (st === 2) { if (c === '*' && d === '/') { st = 0; push(' '); push(' '); i += 2; continue; } blank(c); i++; continue; }
    if (st === 3 || st === 4 || st === 5) {
      const q = st === 3 ? "'" : (st === 4 ? '"' : '`');
      if (c === '\\') { push(' '); push(' '); i += 2; continue; }
      if (c === q) { const was = st; st = 0; push(was === 5 ? '`' : '"'); lastSig = '"'; i++; continue; }
      blank(c); i++; continue;
    }
    if (st === 6) {
      if (c === '\\') { push(' '); push(' '); i += 2; continue; }
      if (c === '[') { inClass = true; blank(c); i++; continue; }
      if (c === ']') { inClass = false; blank(c); i++; continue; }
      if (c === '/' && !inClass) { st = 0; push(' '); lastSig = ')'; i++; continue; }
      if (c === '\n') { st = 0; push('\n'); i++; continue; }
      blank(c); i++; continue;
    }
  }
  return out;
}

// ---------------------------------------------------------------- 用途の宣言表(**これだけが宣言**)
// 鍵は「最上位関数 :: その中の最も近い定義名」。
//   use          … 用途(重力/時計/光/E6′/局所場/複素場/メッシュキャッシュ/署名/表示/宣言/単位換算/保存)
//   replaceable  … スカラー D₀ を背景複素決定力 W₀ へ置き換えてよいか
//                  "forbidden"(重力・時計・光 —— スカラー D が読む量なので置換禁止)/
//                  "candidate"(複素場・局所場の χ の分母 —— W₀ 置換の検討対象)/
//                  "n/a"(値を読まない・宣言・署名・表示・単位換算)
const SITE_CLASS = {
  '(top-level) :: -': { use: '宣言(内蔵の physics・既定値・値域・patch)', replaceable: 'n/a',
    why: '読み口ではなく**値そのものの宣言**である(内蔵 131 本・DEFAULT_PHYSICS・CLAMPS)' },
  'validateSpaceMesh :: validateSpaceMesh': { use: '受理契約(physics.spaceMesh.D0 の検証)', replaceable: 'n/a',
    why: '検証器であって力学の読み口ではない' },
  'frameWeightPow :: frameWeightPow': { use: '単位換算(重みの指数 p を返す)', replaceable: 'n/a',
    why: 'D₀ を 1 度も読まない —— **単位を決める側**である(p=1 で M/L・p=2 で M/L²)' },
  'obsMakeSys :: csSpin': { use: '宣言の生成(観測雛形が physics を作る)', replaceable: 'n/a',
    why: '生成する宣言の中に D₀・D0pull を書いている(読み口ではない)' },
  'loadSave :: loadSave': { use: '保存/読込(D0pull 未宣言の警告)', replaceable: 'n/a',
    why: '値を力学へ渡さない(宣言の有無を見るだけ)' },
  'updateBodyEdit :: updateBodyEdit': { use: '表示(編集画面の背景決定力)', replaceable: 'n/a',
    why: '画面に出すだけ' },
  'fieldKeyOf :: fieldKeyOf': { use: 'メッシュキャッシュの鍵(場の再描画判定)', replaceable: 'n/a',
    why: '鍵の文字列に混ぜるだけ(値として使わない)' },
  'rayKeyOf :: rayKeyOf': { use: 'メッシュキャッシュの鍵(光線の再計算判定)', replaceable: 'n/a',
    why: '同上' },
  '_slParamSig :: _slParamSig': { use: '署名(空間線のパラメータ署名)', replaceable: 'n/a',
    why: '同上(キャッシュ鍵)' },
  'drawField :: drawField': { use: '表示(場の描画の色スケール)', replaceable: 'n/a', why: '描画のみ' },
  'drawFieldInto :: drawFieldInto': { use: '表示(場の描画とキャッシュ鍵)', replaceable: 'n/a', why: '描画のみ' },
  'traceRay :: traceRay': { use: '**光**(光線追跡が読む u の分母)', replaceable: 'forbidden',
    why: '光はスカラーの決定力 D を読む —— **W₀ で置換しない**(裁定の「複素場では D₀ を使わない」の裏返し)' },
  'dfmFrameAt :: dfmFrameAt': { use: '**光**(1 点の u の評価)', replaceable: 'forbidden', why: '同上' },
  'photonPass :: photonPass': { use: '**光**(光子の 1 パス)', replaceable: 'forbidden', why: '同上' },
  'photonStep :: photonStep': { use: '**光**(光子の 1 步・随伴の分母 W′)', replaceable: 'forbidden', why: '同上' },
  'rayField :: rayField': { use: '**光**(光線が読む場の指数)', replaceable: 'forbidden', why: '同上' },
  'makeSim :: S.tauUpdate': { use: '**時計**(固有時 τ の χ の分母)', replaceable: 'forbidden',
    why: '時計はスカラーの決定力 D を読む —— **W₀ で置換しない**' },
  'makeSim :: F6': { use: 'E6′(引きずりの力・背景持ち分 bgW=D₀+箱)', replaceable: 'candidate',
    why: 'χ の分母 —— 複素場へ移すなら W₀ 側の量になる(**本便では接続しない**)' },
  'makeSim :: S._compactForce': { use: 'E6′ pull(近接力の χ)', replaceable: 'candidate', why: 'χ の分母' },
  'makeSim :: mk': { use: 'E6′ pull(近接力の χ・内部ヘルパ)', replaceable: 'candidate', why: 'χ の分母' },
  'makeSim :: S._pairWeaveForce': { use: 'E6′(対の引きずり)', replaceable: 'candidate', why: 'χ の分母' },
  'makeSim :: S._weavePN': { use: 'E6′(対の引きずり・PN)', replaceable: 'candidate', why: 'χ の分母' },
  'makeSim :: S._weaveSpread': { use: 'E6′(引きずりの広がり)', replaceable: 'candidate', why: 'χ の分母' },
  'makeSim :: S._spaceMeshForce': { use: '空間メッシュの力(複素場 → 力)', replaceable: 'candidate',
    why: '**複素場の側** —— 裁定が「D₀ を使わない」と名指しした経路' },
  'makeSim :: S._meshCoordForce': { use: 'メッシュ座標の慣性力', replaceable: 'candidate', why: '同上' },
  'makeSim :: S.Wat': { use: '診断(点 x の W の読み出し)', replaceable: 'candidate', why: '同じ分母を作る' },
  'chanSetup :: chanSetup': { use: 'チャネル設定(share/pull の分離・D0p の取り出し)', replaceable: 'candidate',
    why: '下流の χ の分母へ配る' },
  'dfmSpaceMeshState :: dfmSpaceMeshState': { use: '複素場(空間メッシュの状態 χ・F・B)', replaceable: 'candidate',
    why: '**複素場の側**' },
  'dfmLocalMeshField :: dfmLocalMeshField': { use: '局所場(χ=W/(D₀+W) の門と分母)', replaceable: 'candidate',
    why: '**(N3) で W₀ へ置き換える本命**(第276便a の純関数が同値を示した)' },
  'dfmLocalMeshField :: rd4': { use: '局所場(背景 u_bg を D₀ 倍して分子へ)', replaceable: 'candidate',
    why: '**A₀=D₀·u_bg** と置いた特別な場合 —— (N3) では A₀ を独立に宣言する' },
  'dfmField :: dfmField': { use: '場の純関数(D₀ を引数で受ける)', replaceable: 'candidate', why: '引数の受け口' },
  'dfmFieldSnapshot :: stop': { use: '場のスナップショット(診断)', replaceable: 'candidate', why: '同じ分母' },
  'dfmMeshBlend :: dfmMeshBlend': { use: '複素場と背景の混合', replaceable: 'candidate', why: '背景の重み' },
  'dfmMeshBlend :: rd4': { use: '複素場と背景の混合(内部)', replaceable: 'candidate', why: '背景の重み' },
  'dfmGalaxyMeshField :: dfmGalaxyMeshField': { use: '複素場(銀河メッシュ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmGalaxyMeshField :: g': { use: '複素場(銀河メッシュの節点 χ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmChainMeshBuild :: dfmChainMeshBuild': { use: '複素場(鎖メッシュの構築)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmChainMeshBuild :: gvy': { use: '複素場(鎖メッシュの節点 χ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmChainMesh2DBuild :: dfmChainMesh2DBuild': { use: '複素場(2D 鎖メッシュの構築)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmChainMesh2DBuild :: mk': { use: '複素場(2D 鎖メッシュの宣言)', replaceable: 'candidate', why: 'χ の分母' },
  '_c2dForces :: _c2dForces': { use: '複素場(2D 鎖メッシュの力)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmMeshV2Step :: dfmMeshV2Step': { use: '複素場 v2(1 步)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmMeshV2Solve :: dfmMeshV2Solve': { use: '複素場 v2(解法)', replaceable: 'candidate', why: 'χ の分母' },
  'meshV2Weights :: meshV2Weights': { use: '複素場 v2(重み)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmMeshTransportBind :: dfmMeshTransportBind': { use: '複素場(輸送の束縛・診断)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmMeshTransportObserve :: dfmMeshTransportObserve': { use: '複素場(輸送の観測・診断)', replaceable: 'candidate', why: 'χ の分母' },
  '_smGridFieldOf :: at': { use: '表示(空間メッシュ格子の場)', replaceable: 'candidate', why: '同じ分母を表示で作る' },
  'dfmGeoToyStep :: dfmGeoToyStep': { use: 'geoPN=3 トイ(1 步)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmGeoToyStep :: onePass': { use: 'geoPN=3 トイ(1 巡)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmGeoToyBandStep :: dfmGeoToyBandStep': { use: 'geoPN=3 トイ(帯平均 variant)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmGeoScalarPrepared :: dfmGeoScalarPrepared': { use: 'geoPN=3 トイ(準備済み経路)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmDominance :: dfmDominance': { use: '診断(支配度 —— χ の偏り)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmDominance :: stat': { use: '診断(支配度の統計)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmBinaryChi :: dfmBinaryChi': { use: '二体の χ(質量補正 f の材料)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmBinaryMassFactor :: dfmBinaryMassFactor': { use: '質量補正 f の反復(χ 経由)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmBinaryMassFactorLinear :: dfmBinaryMassFactorLinear': { use: '質量補正 f の反復(線形版)', replaceable: 'candidate', why: 'χ の分母' },
  'chiMassFactors :: chiMassFactors': { use: '質量補正(χ から)', replaceable: 'candidate', why: 'χ の分母' },
  'chiMassFactors :: chi': { use: '質量補正(χ の式)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmInternalEntrainment :: dfmInternalEntrainment': { use: '随伴(内部・χ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmContactEntrainment :: dfmContactEntrainment': { use: '随伴(接触・χ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmPullEntrainment :: dfmPullEntrainment': { use: '随伴(pull・χ)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmPullEntrainment :: wf': { use: '随伴(pull・χ の重み)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmMMAltitudeLimit :: dfmMMAltitudeLimit': { use: '診断(MM の高度限界・χ から)', replaceable: 'candidate', why: 'χ の分母' },
  'dfmSlipRadius :: dfmSlipRadius': { use: '診断(すべり半径・χ から)', replaceable: 'candidate', why: 'χ の分母' },
};

// ================================================================ ① 機械抽出
const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const sIdx = html.indexOf('<script');
const bIdx = html.indexOf('>', sIdx) + 1;
const eIdx = html.lastIndexOf('</script>');
const OFFSET = html.slice(0, bIdx).split('\n').length - 1;      // 写しの 1 行目 = html の OFFSET+1 行目
const code = html.slice(bIdx, eIdx);
const stripped = stripJs(code);
let bal = 0, par = 0, brk = 0, minBal = 0;
for (const ch of stripped) {
  if (ch === '{') bal++; else if (ch === '}') { bal--; if (bal < minBal) minBal = bal; }
  else if (ch === '(') par++; else if (ch === ')') par--;
  else if (ch === '[') brk++; else if (ch === ']') brk--;
}
const selfCheck = { sameLength: stripped.length === code.length, braces: bal, minBraceDepth: minBal,
  parens: par, brackets: brk,
  ok: stripped.length === code.length && bal === 0 && minBal === 0 && par === 0 && brk === 0 };

const lines = stripped.split('\n');
const rawLines = html.split('\n');
const DEF = [/^(\s*)function\s+([\w$]+)\s*\(/,
  /^(\s*)(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:function\b|\([^()]*\)\s*=>|[\w$]+\s*=>)/,
  /^(\s*)([\w$.]+)\s*=\s*(?:async\s*)?(?:function\b|\([^()]*\)\s*=>)/,
  /^(\s*)([\w$]+)\s*:\s*(?:async\s*)?(?:function\b|\([^()]*\)\s*=>)/];
const nearestDef = (i) => {
  for (let j = i; j >= 0; j--) for (const re of DEF) { const m = lines[j].match(re); if (m) return m[2]; }
  return null;
};
const TOKEN_RE = new RegExp('\\b(' + TOKENS.join('|') + ')\\b', 'g');
const groups = {};
let depth = 0, cur = null, nSites = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (depth === 0) { const m = l.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/); cur = m ? m[1] : null; }
  let mm; TOKEN_RE.lastIndex = 0;
  while ((mm = TOKEN_RE.exec(l))) {
    const key = (cur || '(top-level)') + ' :: ' + (cur ? nearestDef(i) : '-');
    const g = groups[key] || (groups[key] = { key, topFn: cur || '(top-level)',
      innerDef: cur ? nearestDef(i) : null, n: 0, tokens: {}, lines: [], evidence: [],
      hasPullFallback: false, readsD0Member: false, objectKeyOnly: true });
    g.n++; nSites++;
    g.tokens[mm[1]] = (g.tokens[mm[1]] || 0) + 1;
    if (g.lines.indexOf(i + 1 + OFFSET) < 0) g.lines.push(i + 1 + OFFSET);
    if (g.evidence.length < 3 && g.evidence.indexOf(rawLines[i + OFFSET].trim()) < 0)
      g.evidence.push(rawLines[i + OFFSET].trim().slice(0, 200));
    if (/D0pull\s*!==\s*undefined/.test(l)) g.hasPullFallback = true;
    if (/[.\w]\.(D0pull|D0)\b/.test(l)) g.readsD0Member = true;
    const after = l.slice(mm.index + mm[1].length);
    if (!/^\s*:/.test(after)) g.objectKeyOnly = false;
  }
  for (const ch of l) { if (ch === '{') depth++; else if (ch === '}') depth--; }
  if (depth === 0) cur = null;
}
const rows = Object.values(groups).sort((a, b) => b.n - a.n).map((g) => {
  const c = SITE_CLASS[g.key] || null;
  return Object.assign(g, { use: c ? c.use : null, replaceable: c ? c.replaceable : null,
    why: c ? c.why : null, classified: !!c });
});
const unclassified = rows.filter((r) => !r.classified).map((r) => r.key);
const byReplaceable = rows.reduce((o, r) => {
  const k = r.replaceable || 'unclassified'; o[k] = (o[k] || 0) + 1; return o;
}, {});
const forbidden = rows.filter((r) => r.replaceable === 'forbidden').map((r) => r.key);

// ---- 新しい宣言鍵 `physics.backgroundComplex` の参照箇所(**エンジンが読まない**の機械確認) ----
const BGC_RE = /\b(BG_COMPLEX_KEY|BG_COMPLEX_BACKGROUNDS|BG_COMPLEX_NOTE_MAX|BG_COMPLEX_UNITS|validateBackgroundComplex|backgroundComplex)\b/g;
const bgcSites = [];
depth = 0; cur = null;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (depth === 0) { const m = l.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/); cur = m ? m[1] : null; }
  let mm; BGC_RE.lastIndex = 0;
  while ((mm = BGC_RE.exec(l))) bgcSites.push({ line: i + 1 + OFFSET, fn: cur || '(top-level)', token: mm[1] });
  for (const ch of l) { if (ch === '{') depth++; else if (ch === '}') depth--; }
  if (depth === 0) cur = null;
}
const bgcFns = [...new Set(bgcSites.map((z) => z.fn))].sort();
const BGC_ALLOWED = ['(top-level)', 'validateBackgroundComplex', 'validatePreset'];
const bgcOutside = bgcFns.filter((f) => BGC_ALLOWED.indexOf(f) < 0);

// ================================================================ ② ページ(R39: q は D₀ を読まない)
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.qLockCalc);

// ❄️ plutoCharonReal の**診断コピー**で D₀・D0pull を振る(**内蔵は 1 bit も触らない**)
const Q_PRESETS = ['plutoCharonReal', 'earthMoonRealKF1', 'mercuryRealKF1'];
const Q_D0 = [0.006, 0, 1, 78.8003132];
const qProbe = await page.evaluate((z) => {
  const out = [];
  for (const id of z.ids) {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) { out.push({ id, error: 'missing' }); continue; }
    for (const d0 of z.d0s) {
      for (const which of ['D0', 'D0pull']) {
        const p = JSON.parse(JSON.stringify(src));
        const had = p.physics[which];
        if (which === 'D0pull' && had === undefined) continue;   // 宣言していない鍵は作らない
        p.physics[which] = d0;
        const v = HP.validatePreset(p);
        if (!v.ok) { out.push({ id, which, d0, error: v.errors }); continue; }
        HP.sim.build(v.preset);
        const r = HP.qLockCalc(HP.sim);
        out.push({ id, which, d0, declaredWas: had,
          q: r ? r.q : null, qStar: r ? r.qStar : null, aRef: r ? r.aRef : null,
          X: r ? r.X : null, clamped: r ? r.clamped : null,
          paramsD0: HP.sim.params.D0,
          paramsD0pull: HP.sim.params.D0pull === undefined ? null : HP.sim.params.D0pull });
      }
    }
  }
  return out;
}, { ids: Q_PRESETS, d0s: Q_D0 });
// q が D₀ を跨いで同一か(プリセットごと)
const qSame = {};
for (const id of Q_PRESETS) {
  const rs = qProbe.filter((z) => z.id === id && z.q !== null && z.q !== undefined);
  const qs = [...new Set(rs.map((z) => z.q))];
  qSame[id] = { n: rs.length, distinctQ: qs.length, q: qs, d0sTried: [...new Set(rs.map((z) => z.d0))],
    paramsD0Seen: [...new Set(rs.map((z) => z.paramsD0))] };
}
await browser.close();

// ---------------------------------------------------------------- 書き出し
const CODE = ['tests/exp-w276a-d0audit2.mjs', 'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第276便a', target: TARGET,
    code: CODE, inputs: [TARGET] }), {
    harness: 'tests/exp-w276a-d0audit2.mjs', harnessVersion: HARNESS_VERSION,
    tokens: TOKENS, scriptLineOffset: OFFSET,
    ruling: '第66報 (1): 「背景決定力 D₀」と別途「背景複素決定力」を用意する。'
      + '引きずり減衰 q の算出や計算など**影響箇所を精査する**',
    method: 'inline script からコメント・文字列・正規表現リテラルを潰した写しを作り、識別子の出現を'
      + '機械抽出して最上位関数(波括弧の深さ)で束ねる。**用途と置換可否だけが宣言表**である',
    notClaim: ['D₀ を W₀ へ置き換えた', 'D₀ を較正した', '影響箇所をすべて直した',
      '複素決定力場を実装した', 'q を導出した'] }),
  selfCheck,
  sites: { total: nSites, groups: rows.length, byReplaceable, unclassified, forbidden,
    rows },
  backgroundComplexKey: { sites: bgcSites.length, functions: bgcFns, allowed: BGC_ALLOWED,
    outsideAllowed: bgcOutside,
    note: '**エンジンのどの経路も読まない**: 参照は検証器・検証器の分岐・定数・HP の書き出しだけである' },
  qLock: { presets: Q_PRESETS, d0Values: Q_D0, rows: qProbe, sameAcrossD0: qSame,
    reads: 'R(支配源の半径)・M(質量)・G・cLight・基準距離 a(自由天体の距離の中央値)',
    note: 'q_exact は**有限参照点での LT 振幅の正規化規約**であって、環境から引きずり指数を'
      + '予言する式ではない(**背景を変えても q は自動では動かない**)' },
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote ' + OUT);
console.log('sites=' + nSites + ' groups=' + rows.length
  + ' unclassified=' + unclassified.length + ' selfCheck=' + selfCheck.ok);
console.log('byReplaceable=' + JSON.stringify(byReplaceable));
for (const [id, z] of Object.entries(qSame)) console.log('q ' + id + ' distinct=' + z.distinctQ + ' ' + JSON.stringify(z.q));
