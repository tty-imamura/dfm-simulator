// 第37便 探索実験: 「要因分離スプリント」の計測バッテリー(台帳4-53)
// - 本スクリプトは QA ではない(合否判定なし)。tests/out/factors-results.json に計測値を保存する。
// - 目的: galaxy/darkrotor/convection/freebox の4サンプルについて、各サンプルの「主張の主指標」を
//   物理チャネルを1つずつノックアウト(0固定)しながら計測し、どの物理項が現象を支えているかの
//   一次データ(要因分離)を作る。判定・合否は行わない — 実測値と NaN/発散の記録が成果物。
// - ノックアウト・チャネル(1変更ずつ・baseline を含め7本): kFrame=0 / kRep=0 / muF=0 / kappaS=0 /
//   etaRad=0 / D0=0。プリセットは実行時に HP.loadPreset(id,false) で読み(= 未改変の既定物理で
//   build() する — qa.mjs の各ユニットと同じ手順)、そのあとチャネルの該当パラメータだけを
//   sim.params へ直接代入して上書きする(beta/index.html:4277 の ab.simB.params[key]=… や UI の
//   パラメータスライダーと同じ「build 後に params を書き換える」正規の経路)。初期配置(座標・
//   速度・seed 由来の乱数)はどのチャネルも build() 時点では同一の既定物理から作られるため、
//   全チャネルで厳密に同一になる — 純粋に物理項の有無だけを分離できる。
//   ※重要: sim.build(customPreset) を直接呼ぶ経路は使わない — HP.abStart()/cloneSimState() が
//   ページ内のグローバル currentPreset(loadPreset() でのみ更新される)を参照して B 側を再構築
//   するため、build() を直接呼ぶと currentPreset が同期されず、galaxy の A/B 比較が壊れる
//   (初回実装でこの不具合を実測で検出・修正した — 詳細は 37f-report.md)。
// - 各サンプルの指標式は tests/qa.mjs の該当ユニットから一字も変えず転記している(出典は各 SAMPLES
//   エントリの sourceRef と、実装コード直上のコメントに行番号で記載)。
// 実行: node tests/exp-factors.mjs(playwright 必須。全4サンプル×7チャネル。約30〜40分の見積り —
//   下記 FACTORS_PRESETS で絞った短縮実行の実測から按分。詳細は scratchpad の報告書を参照)
//   QA_TARGET=beta/index.html node tests/exp-factors.mjs   … 既定は index.html(ルート)。
//     beta/index.html は他便の編集対象になりうるため、既定はルート固定版を対象にしている。
//   FACTORS_PRESETS=galaxy node tests/exp-factors.mjs      … サンプル列を絞る(カンマ区切り・
//     新サンプル追加時にも使う。例: FACTORS_PRESETS=galaxy,freebox)
//
// 転記元(確定版は `git show HEAD:beta/index.html` / 該当コミットの tests/qa.mjs を参照 —
//   実装ファイル・qa.mjs は一切変更していない):
//   galaxy 外縁増強比 ... tests/qa.mjs:215-230(W5C_UNITS.galaxyAB。claim.galaxy-outerboost は :2292-2293)
//   darkrotor 腕A2 ...... tests/qa.mjs:197(帯定義)+ 388-433(W5C_UNITS.darkrotorLong。behavior.darkrotorLong は :3097-3114)
//   convection 循環 ..... tests/qa.mjs:241-253(W5C_UNITS.convection8000。behavior.convection は :2303-2304)
//   freebox a_eff ....... tests/qa.mjs:1143-1191(freebox base()/run()。out.B = run(base(),1200) が既定条件)
//   loadPreset/cloneSimState  beta/index.html:4203-4221(loadPreset。currentPreset 更新はここのみ)+
//                              4240-4270(cloneSimState。simB.params=Object.assign({},sim.params) は :4265)+
//                              4272-4281(abStart。ab.simB.params[key]=clamp(valB,…) は :4277)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const DT = 0.016; // tests/qa.mjs / exp-darkrotor.mjs と同じ 1 step

// ---- 起動(tests/exp-darkrotor.mjs:18-23 と同じフォールバック)----
async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
}

// ---- ノックアウト・チャネル(1変更ずつ。baseline = プリセット既定のまま無改変)----
const CHANNELS = [
  { id: 'baseline', override: null },
  { id: 'kFrame=0', override: { kFrame: 0 } },
  { id: 'kRep=0', override: { kRep: 0 } },
  { id: 'muF=0', override: { muF: 0 } },
  { id: 'kappaS=0', override: { kappaS: 0 } },
  { id: 'etaRad=0', override: { etaRad: 0 } },
  { id: 'D0=0', override: { D0: 0 } },
];

// ---- サンプル定義 ----
// 各 run() は page.evaluate 内で、HP.loadPreset(id,false) でプリセットを既定物理のまま読み込み、
// そのあと sim.params にチャネルの上書きを直接代入 → 既定の步数だけ sim.step(0.016) → qa.mjs
// から転記した指標式、という共通の形(qa.mjs の各ユニットの手順そのまま+上書き代入を1行挿入)。
const SAMPLES = {
  galaxy: {
    presetId: 'galaxy',
    metricNote: '外縁増強比 galA/galB(claim.galaxy-outerboost と同式。tests/qa.mjs:215-230 galaxyAB ユニット' +
      'を転記 — kFrame を0にする内部A/B比較〔HP.abStart〕自体はそのまま残し、その外側でチャネルの' +
      '物理上書きを両側〔A・簡クローンB〕に効かせる。beta/index.html:4265 simB.params=Object.assign({},' +
      'sim.params) により、A の上書き〔loadPreset 直後の s.params 代入〕は cloneSimState() で B にも' +
      '複製されたあと abStart が B の kFrame だけを上書きする — よってチャネル=kFrame=0 では A/B の' +
      '物理が完全一致し、比は1に潰れるのが期待値(cloneSimState() はページ内グローバル currentPreset' +
      'を参照して B を再構築するため、A 側は必ず HP.loadPreset() 経由で構築する必要がある — ' +
      'sim.build(customPreset) を直接呼ぶと currentPreset が同期されず A/B比較が壊れる)',
    steps: 6000,
    async checkApplicable(page) {
      const ok = await page.evaluate(() => HP.allPresets().some(p => p.id === 'galaxy'));
      return { ok, reason: ok ? '' : '対象に galaxy プリセットなし' };
    },
    run: (page, override) => page.evaluate((ov) => {
      const s = HP.sim;
      HP.loadPreset('galaxy', false);
      if (ov) Object.assign(s.params, ov);
      HP.abStart('kFrame', 0);
      const abG = HP.ab();
      // ---- qa.mjs:221-223(galaxyAB.outer)を一字も変えず転記 ----
      const outer = (sm) => { let sum = 0, c = 0;
        for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
          if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; } }
        return c ? sum / c : 0; };
      for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
      const galA = outer(s), galB = outer(abG.simB);
      const nan = s.hasNaN() || abG.simB.hasNaN();
      HP.abStop();
      const finite = Number.isFinite(galA) && Number.isFinite(galB);
      const value = (!nan && finite && galB !== 0) ? galA / galB : null;
      return { value, nan, divergent: nan || !finite, raw: { galA, galB } };
    }, override),
  },

  // 第39便 39A(台帳4-72): 🕶️ が v6(中心BH+対向2ローター)へ改訂された。本計測の前提
  // (loadPreset で既定物理のまま読み → sim.params にチャネル上書き → 6000步 → 後半平均の4帯平均)は
  // ローター体数に依存しない(NH はプリセット定義から動的に数えている)ので、そのまま成立する。
  // baseline 実測値の更新(beta・seed 20260726・6000步):
  //   v6: baseline 0.5602(帯 0.583/0.680/0.546/0.431)/ kFrame=0 0.3849(比 0.687)/
  //       kRep=0 0.1837(0.328)/ muF=0 0.5674(1.013)/ kappaS=0 0.6015(1.074)/
  //       etaRad=0 0.5654(1.009)/ D0=0 0.4748(0.848)。NaN・発散はいずれも無し
  //   v5(旧10体・第37便): baseline 比で kFrame=0 が 0.89・kRep=0 が 0.54 だった
  //   (🕶️ の説明文の「複合経路」の数値はこの baseline 比を出典にしている)
  darkrotor: {
    presetId: 'darkrotor',
    metricNote: '腕A2の4帯平均(behavior.darkrotorLong と同式の on.A2 を平均。tests/qa.mjs:388-433 の ' +
      'W5C_UNITS.darkrotorLong から run(false)〔スピンあり本体側〕だけを転記 — 対照 run(true) は本計測' +
      'では省略〔要因分離の対象は物理チャネルであり、スピン有無の対照はここでの主指標ではない〕)。' +
      '第39便 39A: 🕶️ v6(対向2ローター)で再測定 — baseline 0.5602 / kFrame=0 比 0.687 / kRep=0 比 0.328',
    steps: 6000,
    async checkApplicable(page) {
      const hasPreset = await page.evaluate(() => HP.allPresets().some(p => p.id === 'darkrotor'));
      if (!hasPreset) return { ok: false, reason: '対象に darkrotor プリセットなし' };
      const hasObs = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.obsT));
      if (!hasObs) return { ok: false, reason: '対象に観測温度系(obsT)なし(旧v3以前)' };
      // qa.mjs:188-193 w5cHasObs/w5cDrFree と同じ判定式
      const drFree = await page.evaluate(() =>
        HP.allPresets().find(q => q.id === 'darkrotor').bodies.every(b => !b.pinned && !b.railOmega && !b.railH));
      return { ok: drFree, reason: drFree ? '' : '対象の darkrotor はレール駆動の旧v3構成(qa.mjs SKIP と同条件)' };
    },
    run: (page, override) => page.evaluate(({ ov, BANDS }) => {
      const s = HP.sim;
      HP.loadPreset('darkrotor', false);
      if (ov) Object.assign(s.params, ov);
      const P = HP.allPresets().find(q => q.id === 'darkrotor');
      const NH = P.bodies.filter(b => b.type === 'single').length - 1;
      const OFF = NH + 1;
      // ---- qa.mjs:395-402(a2)を一字も変えず転記 ----
      const a2 = (sm) => BANDS.map(([lo, hi]) => {
        const bx = sm.x[0], by = sm.y[0];
        let cr = 0, ci = 0, N = 0;
        for (let i = OFF; i < sm.n; i++) {
          const dx = sm.x[i] - bx, dy = sm.y[i] - by, r = Math.hypot(dx, dy);
          if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
            cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
        }
        return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
      });
      // ---- qa.mjs:405-420(run、ctrl=false の枝のみ)を転記 ----
      const late = [];
      let maxSpin = 0;
      for (let blk = 0; blk < 12; blk++) {
        for (let k = 0; k < 500; k++) s.step(0.016);
        for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
        const t = (blk + 1) * 500;
        if (t >= 3000) late.push(a2(s).map(v => v.A2));
      }
      const A2 = BANDS.map((_, b) => late.reduce((a, v) => a + v[b], 0) / late.length);
      const nan = s.hasNaN();
      const finite = A2.every(Number.isFinite);
      const value = (!nan && finite) ? A2.reduce((a, v) => a + v, 0) / A2.length : null;
      return { value, nan, divergent: nan || !finite, raw: { A2, maxSpin, nLate: late.length } };
    }, { ov: override, BANDS: [[80, 120], [120, 160], [160, 200], [200, 240]] /* qa.mjs:197 の帯定義を転記 */ }),
  },

  convection: {
    presetId: 'convection',
    metricNote: '循環指標 convCirc(behavior.convection の現行指標。tests/qa.mjs:241-253 convection8000 ' +
      'ユニットから転記 — 第36便Dで24000步→8000步へ再較正された現行版〔qa.mjs:238-240 参照〕)',
    steps: 8000,
    async checkApplicable(page) {
      const ok = await page.evaluate(() => HP.allPresets().some(p => p.id === 'convection'));
      return { ok, reason: ok ? '' : '対象に convection プリセットなし' };
    },
    run: (page, override) => page.evaluate((ov) => {
      const s = HP.sim;
      HP.loadPreset('convection', false);
      if (ov) Object.assign(s.params, ov);
      for (let k = 0; k < 8000; k++) s.step(0.016);
      // ---- qa.mjs:244-251 を一字も変えず転記 ----
      let circ = 0, sumV = 0, freeC = 0;
      for (let i = 0; i < s.n; i++) {
        if (s.pinned[i]) continue;
        circ += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
        sumV += Math.hypot(s.vx[i], s.vy[i]); freeC++;
      }
      const convCirc = freeC ? circ / freeC : 0, convV = freeC ? sumV / freeC : 0;
      const nan = s.hasNaN();
      const finite = Number.isFinite(convCirc);
      return { value: (!nan && finite) ? convCirc : null, nan, divergent: nan || !finite,
        raw: { convCirc, convV } };
    }, override),
  },

  freebox: {
    presetId: 'freebox',
    metricNote: 'a_eff(1200步。tests/qa.mjs:1143-1191 の freebox base()/run() を転記 — out.B = run(base(),1200) ' +
      '〔既定 kRep=0.5〕に相当する条件をチャネルごとに物理上書きして測る。freebox プリセットの無い対象' +
      '〔ルート v1.32 は元来なし — qa.mjs:1139 hasFreebox と同条件〕ではスキップ)',
    steps: 1200,
    async checkApplicable(page) {
      const ok = await page.evaluate(() => HP.allPresets().some(p => p.id === 'freebox'));
      return { ok, reason: ok ? '' : '対象に freebox プリセットなし(qa.mjs:1139 hasFreebox と同条件)' };
    },
    run: (page, override) => page.evaluate((ov) => {
      const s = HP.sim;
      HP.loadPreset('freebox', false);
      if (ov) Object.assign(s.params, ov);
      for (let k = 0; k < 1200; k++) s.step(0.016);
      const aEff = s.boxAEff();
      const nan = s.hasNaN();
      const finite = Number.isFinite(aEff);
      return { value: (!nan && finite) ? aEff : null, nan, divergent: nan || !finite,
        raw: { aEff, measureBox: s.measureBox, t: s.t } };
    }, override),
  },
};

// FACTORS_PRESETS でサンプル列を上書き(将来の新サンプル追加用・カンマ区切り)。
// 既定は SAMPLES の定義順(galaxy, darkrotor, convection, freebox)。
const DEFAULT_ORDER = ['galaxy', 'darkrotor', 'convection', 'freebox'];
const requested = (process.env.FACTORS_PRESETS
  ? process.env.FACTORS_PRESETS.split(',').map(s => s.trim()).filter(Boolean)
  : DEFAULT_ORDER);
const unknown = requested.filter(id => !SAMPLES[id]);
if (unknown.length) {
  console.error(`FACTORS_PRESETS に未知のサンプル: ${unknown.join(', ')}(既知: ${Object.keys(SAMPLES).join(', ')})`);
  process.exit(1);
}

// ---- 実行 ----
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第37便 要因分離スプリント(台帳4-53)対象: ${TARGET}  commit=${commit.slice(0, 7)}  サンプル=[${requested.join(', ')}]`);

const browser = await launch();
const page = await newPage(browser);

const samplesOut = {};
for (const sid of requested) {
  const sample = SAMPLES[sid];
  const applic = await sample.checkApplicable(page);
  if (!applic.ok) {
    console.log(`SKIP ${sid}: ${applic.reason}`);
    samplesOut[sid] = { applicable: false, reason: applic.reason, metricNote: sample.metricNote, steps: sample.steps, results: {} };
    continue;
  }
  console.log(`${sid}(${sample.steps}步×${CHANNELS.length}チャネル): 計測開始...`);
  const results = {};
  let baselineValue = null;
  for (const ch of CHANNELS) {
    const t1 = Date.now();
    let r;
    try {
      r = await sample.run(page, ch.override);
    } catch (e) {
      r = { value: null, nan: null, divergent: true, raw: null, error: String((e && e.message) || e) };
    }
    const elapsedMs = Date.now() - t1;
    if (ch.id === 'baseline') baselineValue = r.value;
    const ratioToBaseline = (r.value !== null && baselineValue !== null && baselineValue !== 0)
      ? r.value / baselineValue : null;
    results[ch.id] = { ...r, ratioToBaseline, elapsedMs };
    console.log(`  ${ch.id.padEnd(9)}: 値=${r.value === null ? '—' : r.value.toFixed(4)}` +
      `${ratioToBaseline !== null ? `(baseline比 ${ratioToBaseline.toFixed(3)})` : ''}` +
      ` NaN=${r.nan} 発散=${r.divergent}${r.error ? ` エラー=${r.error}` : ''} [${(elapsedMs / 1000).toFixed(1)}s]`);
  }
  samplesOut[sid] = { applicable: true, reason: '', metricNote: sample.metricNote, steps: sample.steps, results };
}

await browser.close();

// ---- console 表形式要約 ----
console.log('');
console.log('==== 要約(サンプル×チャネル: 値/baseline比) ====');
const chIds = CHANNELS.map(c => c.id);
const col1 = Math.max(10, ...requested.map(s => s.length));
const colW = 16;
console.log(''.padEnd(col1) + chIds.map(c => c.padStart(colW)).join(''));
for (const sid of requested) {
  const s = samplesOut[sid];
  if (!s.applicable) { console.log(sid.padEnd(col1) + `  (skip: ${s.reason})`); continue; }
  const cells = chIds.map(cid => {
    const r = s.results[cid];
    if (!r) return '—'.padStart(colW);
    const v = r.value === null ? 'NaN/発散' : r.value.toFixed(4);
    const rr = r.ratioToBaseline !== null ? `(×${r.ratioToBaseline.toFixed(2)})` : '';
    return (v + rr).padStart(colW);
  });
  console.log(sid.padEnd(col1) + cells.join(''));
}
console.log('');

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET,
  note: '第37便 探索実験(台帳4-53「要因分離スプリント」)。QA ではない(合否判定なし)。' +
    '4サンプル(galaxy/darkrotor/convection/freebox)の主指標を、物理チャネルを1つずつ0にノックアウト' +
    'しながら計測する。系が発散・NaN の場合も value=null で記録し、それ自体を要因情報として扱う。',
  meta: {
    dt: DT,
    channels: CHANNELS.map(c => ({ id: c.id, override: c.override })),
    presetsRequested: requested,
    elapsedSec: +((Date.now() - t0) / 1000).toFixed(1),
    sources: {
      galaxyOuterboost: 'tests/qa.mjs:215-230(galaxyAB ユニット)/ claim.galaxy-outerboost は :2292-2293',
      darkrotorLong: 'tests/qa.mjs:197(帯定義)+ 388-433(darkrotorLong ユニット)/ behavior.darkrotorLong は :3097-3114',
      convection: 'tests/qa.mjs:241-253(convection8000 ユニット)/ behavior.convection は :2303-2304',
      freeboxAEff: 'tests/qa.mjs:1143-1191(freebox base()/run()。out.B=run(base(),1200) が既定条件)',
      simBuild: 'beta/index.html:2176-2188(S.build。初期配置は phys.G/phys.radiusScale のみ参照)',
    },
  },
  samples: samplesOut,
};
fs.writeFileSync(path.join(OUT_DIR, 'factors-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/factors-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
