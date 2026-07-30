// 第50便(台帳4-66): E8R 指数形 vs 厳密反比例(光速∝1/W)のプローブ依存H判別実験。
// 設計正本: docs/dev/EXP_4-66_PROBE_H_DESIGN.md(第43便 43D — 設計確定済み)。
// - 本スクリプトは QA ではない(合否 exit code なし — exp-4-67/4-68c と同じ独立スクリプト方式)。
//   設計書 §2-4 の判定4基準は JSON に ok フラグとして記録し、コンソールにも表示する。
//   V29(HP.verify.v29)は現行のまま回帰ゲートとして残す — 本実験は V29 の測定系を
//   D/Kt スキャン+反比例対照に拡張した「台帳 4-66 の判別実験」の実測記録である。
// - 対象実装ファイル(beta/index.html)は一切変更しない。測定構成は V29 と同一
//   (beta/index.html HP.verify.v29 / tools/gen-figures2.mjs p2fig6 と同じ規定 exp 膨張・
//   単独自由粒子・friction:"dfm")を validatePreset→HP.sim.build の正規経路で注入する。
// - 反比例対照はコード変更なしの後処理(設計書 §2-3): 同じ w 実測に対し c_loc∝1/W_B
//   (W_B=D·a^{−dP} → c_loc∝a^{dP}。規格化 c_loc(a=1)=c0·e^{−2D/Kt})で R を再計算する。
//   比 H_w=−Δln R/Δt には規格化定数が効かないため R_inv=w·a^{−dP} で計算する
//   (tools/gen-figures2.mjs p2fig6 と同一式)。
//
// 実行: node tests/exp-4-66.mjs(playwright 必須。1ワーカー・数十秒)
//   QA_TARGET=beta/index.html node tests/exp-4-66.mjs   … 既定(V29 は beta のみ)
// 出力: tests/out/exp-4-66-results.json(a×D/Kt×2形(指数/反比例)の比のグリッド —
//   論文2 fig6 の元データを兼ねる。fig6 自体は tools/gen-figures2.mjs が生成)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 対象HTMLのスナップショット(並行編集からの隔離+ハッシュ記録 — exp-4-67 と同じ)
const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = crypto.createHash('sha256').update(TARGET_SRC).digest('hex');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp466-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

// ---- 実験定数(設計書 §2 — V29 と同一の測定系)----
const H0 = 0.01, KT = 300, C0 = 60, DT = 0.016, DP = 1, A_END = 3;
// D/Kt スキャン: 設計書 §2-2 の {0.3, 0.92, 1.5} に、論文2 v0.6 の実較正点
// (2/3)ln4≈0.9242(tools/gen-figures2.mjs p2fig6・fig6 と同一)を加えた4点。
// 設計書の 0.92 は執筆時の丸め値 — 両方を測って差も記録する。
const DKT_SCAN = [0.3, 0.92, (2 / 3) * Math.log(4), 1.5];
const CAL_DKT = (2 / 3) * Math.log(4);          // 論文2 fig6 の較正点(a=2 で点値 = D/Kt)
const V29_WINDOWS = [1, 1.5, 2, 3];             // V29 の3窓(設計書 §2-1)
const POINT_WIN = [1.95, 2.05];                 // a=2 の点値測定用の細窓(設計書 §2-4 の分離実証)
const NW_FINE = 24;                             // fig6 と同じ対数等間隔の細分窓(曲線データ用)
const TOL_RATIO = 1e-2;                         // 判定精度(V29 と同一 — 設計書 §2-4)
const TOL_W = 1e-3;                             // w 保存ずれ(V29 と同一)

// ---- 起動(exp-4-67 と同じフォールバック)----
async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ---- ページ内測定(V29 / p2fig6 と同一の系・式)----
function pageRun(cfg) {
  const { H0, KT, C0, DT, DP, A_END, DKT_SCAN, V29_WINDOWS, POINT_WIN, NW_FINE } = cfg;
  // 測定ターゲット a の集合(細分窓 ∪ V29窓 ∪ 点値細窓)— 昇順・重複除去
  const targets = [];
  for (let i = 1; i <= NW_FINE; i++) targets.push(Math.pow(A_END, i / NW_FINE));
  for (const a of V29_WINDOWS) if (a > 1) targets.push(a);
  for (const a of POINT_WIN) targets.push(a);
  const T = Array.from(new Set(targets.map(a => +a.toFixed(12)))).sort((x, y) => x - y);

  const one = (dkt) => {
    const D = dkt * KT;
    // 正規経路: validatePreset → HP.sim.build(qa.mjs/seeds.mjs/exp-4-67 と同じ)
    const v = HP.validatePreset({
      id: 'exp_4_66', name: 'exp-4-66', description: 'exp-4-66 measurement (V29 config, D/Kt scan)',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
      universeBox: { mode: 'exp', H0: H0, D: D, dPower: DP, L: 260, cx: 0, cy: 0, vx: 0, vy: 0,
        omega: 0, amp: 0, freq: 0, phase: 0, friction: 'dfm' },
      physics: { G: 0, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
        Kt: KT, cLight: C0, softening: 4, timeScale: 1 },
      bodies: [{ type: 'single', m: 0.05, x: 100, y: 0, vx: H0 * 100, vy: 1, spin: 0, pinned: false }],
      overlays: {}, seed: 1 });
    if (!v.ok) throw new Error('validatePreset NG: ' + v.errors.join(' / '));
    HP.sim.build(v.preset);
    const s = HP.sim;
    const cLocExp = (a) => C0 * Math.exp(-2 * (D / Math.pow(a, DP)) / KT);   // E8R 指数形(V28/V29)
    const rInv = (a, w) => w * Math.pow(a, -DP);   // 反比例対照(規格化定数は比に効かない)
    const w0 = 1;
    const samp = [{ t: 0, a: 1, w: w0 }];
    let ti = 0;
    const steps = Math.ceil(Math.log(A_END) / H0 / DT) + 1;
    for (let k = 0; k < steps && ti < T.length; k++) {
      s.step(DT);
      const a = Math.exp(H0 * s.t);
      if (a >= T[ti]) {
        samp.push({ t: s.t, a, w: Math.hypot(s.vx[0] - H0 * s.x[0], s.vy[0] - H0 * s.y[0]) });
        ti++;
      }
    }
    // 窓 [a1,a2] の比(指数実測 meas・解析 ana・反比例対照 inv)— p2fig6 と同一式
    const ratioOf = (p, n) => {
      const R1 = p.w / cLocExp(p.a), R2 = n.w / cLocExp(n.a);
      const V1 = rInv(p.a, p.w), V2 = rInv(n.a, n.w);
      const Hgeo = Math.log(n.a / p.a) / (n.t - p.t);
      return {
        a1: p.a, a2: n.a,
        aEff: Math.log(n.a / p.a) / (1 / p.a - 1 / n.a),   // 点値=窓平均になる a(fig6 横軸)
        meas: (-Math.log(R2 / R1) / (n.t - p.t)) / Hgeo,
        ana: 2 * dkt * (1 / p.a - 1 / n.a) / Math.log(n.a / p.a),
        inv: (-Math.log(V2 / V1) / (n.t - p.t)) / Hgeo,
      };
    };
    const near = (a) => samp.reduce((b, v) => Math.abs(v.a - a) < Math.abs(b.a - a) ? v : b, samp[0]);
    let wDrift = 0;
    for (const v of samp) wDrift = Math.max(wDrift, Math.abs(v.w / w0 - 1));
    const fine = [];
    for (let i = 1; i < samp.length; i++) fine.push(ratioOf(samp[i - 1], samp[i]));
    const v29Rows = [];
    for (let i = 1; i < V29_WINDOWS.length; i++)
      v29Rows.push(ratioOf(near(V29_WINDOWS[i - 1]), near(V29_WINDOWS[i])));
    const point2 = ratioOf(near(POINT_WIN[0]), near(POINT_WIN[1]));
    return { dkt, D, wDrift, nSamp: samp.length, fine, v29Rows, point2 };
  };
  const series = DKT_SCAN.map(one);
  const v29 = HP.verify.v29();   // 回帰ゲート(現行のまま — 本実験と独立に PASS していること)
  return { series, v29Gate: { pass: v29.pass, value: v29.value, detail: v29.detail } };
}

// ================================ 実行 ================================
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第50便(台帳4-66)対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}  commit=${commit.slice(0, 7)}`);

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// 適用可否: V29(検証系)と universeBox.friction を持つ版であること
const ap = await page.evaluate(() => {
  if (!(HP.verify && HP.verify.v29)) return { ok: false, reason: '対象に V29(HP.verify.v29)なし — beta v1.34 系が必要' };
  const v = HP.validatePreset({ id: 't', name: 't', description: 'probe', camera: { scale: 1 }, world: { boundary: 'none', size: 0 },
    universeBox: { mode: 'exp', H0: 0.01, D: 1, dPower: 1, L: 10, cx: 0, cy: 0, vx: 0, vy: 0, omega: 0, amp: 0, freq: 0, phase: 0, friction: 'dfm' },
    physics: {}, bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }], overlays: {} });
  if (!v.ok) return { ok: false, reason: 'universeBox プリセットが validatePreset を通らない: ' + v.errors.join(' / ') };
  if (v.preset.universeBox.friction !== 'dfm') return { ok: false, reason: 'universeBox.friction("dfm")非対応の旧版' };
  return { ok: true, reason: '' };
});
if (!ap.ok) { console.error(`中止: ${ap.reason}`); await browser.close(); process.exit(1); }

const CFG = { H0, KT, C0, DT, DP, A_END, DKT_SCAN, V29_WINDOWS, POINT_WIN, NW_FINE };
const d = await page.evaluate(pageRun, CFG);
await browser.close();

// ---- 判定(設計書 §2-4 の4基準 — 記録のみ・exit code にはしない)----
const maxAbsErr = (rows) => Math.max(...rows.map(r => Math.abs(r.meas - r.ana)));
const maxRelErr = (rows) => Math.max(...rows.map(r => Math.abs(r.meas / r.ana - 1)));
const maxInvErr = (rows) => Math.max(...rows.map(r => Math.abs(r.inv - 1)));

// 基準1: 指数形系列 — |比実測/解析−1| < 1e-2(V29 と同一)かつ D/Kt 間で曲線が分離(>10σ)
const relErrAll = Math.max(...d.series.map(s => maxRelErr(s.fine.concat(s.v29Rows))));
const wDriftAll = Math.max(...d.series.map(s => s.wDrift));
const sigma = Math.max(...d.series.map(s => maxAbsErr(s.fine.concat(s.v29Rows))));   // 実測ノイズ(解析からの絶対ずれ)
// 曲線分離は設計書 §2-2 の3点 {0.3, 中央(較正点), 1.5} で評価する。0.92 と 0.9242 は
// 意図的な近接重複(設計時丸め値と論文実較正点)なので、その間の分離は判定対象にしない
const DESIGN_PTS = [0.3, CAL_DKT, 1.5];
const sorted = d.series.filter(s => DESIGN_PTS.some(p => Math.abs(s.dkt - p) < 1e-9))
  .sort((a, b) => a.dkt - b.dkt);
const curveSeps = [];
for (let i = 1; i < sorted.length; i++) {
  const A = sorted[i - 1], B = sorted[i];
  // 同一窓(V29 3窓)での実測比の最小差
  const minSep = Math.min(...A.v29Rows.map((r, k) => Math.abs(B.v29Rows[k].meas - r.meas)));
  curveSeps.push({ pair: `${A.dkt.toFixed(4)}↔${B.dkt.toFixed(4)}`, minSep, over10sigma: minSep > 10 * sigma });
}
const c1 = relErrAll < TOL_RATIO && wDriftAll < TOL_W && curveSeps.every(c => c.over10sigma);

// 基準2: 反比例対照系列 — |比−1| < 1e-2(恒等値の機械確認)
const invErrAll = Math.max(...d.series.map(s => maxInvErr(s.fine.concat(s.v29Rows, [s.point2]))));
const c2 = invErrAll < TOL_RATIO;

// 基準3: 分離の実証 — a=2 の点値で指数形(=D/Kt)と反比例(=1)の差が達成精度の10倍以上
const cal = d.series.find(s => Math.abs(s.dkt - CAL_DKT) < 1e-9);
const sepForms = d.series.map(s => {
  const diff = Math.abs(s.point2.meas - s.point2.inv);
  return { dkt: s.dkt, pointMeas: s.point2.meas, pointInv: s.point2.inv, diff,
    over10prec: diff > 10 * Math.max(invErrAll, sigma) };
});
const c3 = sepForms.every(v => v.over10prec);

const nf = (v, d2 = 4) => Number.isFinite(v) ? v.toFixed(d2) : '—';
console.log(`測定(3窓 a:1→1.5→2→3+細分${NW_FINE}窓+点値窓[${POINT_WIN}]):`);
for (const s of d.series) {
  console.log(`  D/Kt=${nf(s.dkt)}: 3窓 H_w/H_geo=${s.v29Rows.map(r => nf(r.meas)).join('/')}`
    + `(解析 ${s.v29Rows.map(r => nf(r.ana)).join('/')})`
    + ` 点値(a=2)=${nf(s.point2.meas)}(解析 ${nf(2 * s.dkt / 2)})`
    + ` 反比例対照=${s.v29Rows.map(r => nf(r.inv)).join('/')} w保存ずれ=${s.wDrift.toExponential(1)}`);
}
console.log(`判定(設計書 §2-4):`);
console.log(`  ①指数形: 相対誤差最大=${relErrAll.toExponential(2)}(<1e-2)・w保存=${wDriftAll.toExponential(2)}(<1e-3)・`
  + `曲線分離 ${curveSeps.map(c => `${c.pair}:${c.minSep.toExponential(1)}`).join(' ')}(各>10σ=${(10 * sigma).toExponential(1)}) → ${c1 ? 'OK' : 'NG'}`);
console.log(`  ②反比例対照: |比−1|最大=${invErrAll.toExponential(2)}(<1e-2) → ${c2 ? 'OK' : 'NG'}`);
console.log(`  ③分離実証: a=2 の指数↔反比例差 ${sepForms.map(v => `D/Kt=${nf(v.dkt, 2)}:${nf(v.diff, 3)}`).join(' ')}(各>10×達成精度) → ${c3 ? 'OK' : 'NG'}`);
console.log(`  ④V29回帰ゲート: ${d.v29Gate.pass ? 'PASS' : 'FAIL'}(現行のまま独立に維持)`);

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET, targetSha256: TARGET_SHA,
  note: '第50便(台帳4-66)E8R 指数形 vs 厳密反比例のプローブ依存H判別実験。QA ではない(合否 exit code なし)。'
    + '設計正本 docs/dev/EXP_4-66_PROBE_H_DESIGN.md §2。対象実装ファイルは一切変更していない — '
    + '測定構成は V29 と同一で validatePreset→HP.sim.build の正規経路で注入。反比例対照は同じ w 実測からの後処理'
    + '(コード変更なし — E8R 本体の改変はしない)。本 JSON は論文2 fig6 の元データを兼ねる(fig6 生成は tools/gen-figures2.mjs)。',
  meta: {
    dt: DT, H0, Kt: KT, cLight: C0, dPower: DP, aEnd: A_END,
    dktScan: DKT_SCAN, calibrationDkt: CAL_DKT, v29Windows: V29_WINDOWS, pointWindow: POINT_WIN,
    fineWindows: NW_FINE, tolRatio: TOL_RATIO, tolW: TOL_W,
    node: process.version, platform: `${os.platform()} ${os.release()}`, cpus: os.cpus().length,
    sources: {
      measurement: 'beta/index.html HP.verify.v29(第42便 42B)/ tools/gen-figures2.mjs p2fig6 と同一の系・式',
      design: 'docs/dev/EXP_4-66_PROBE_H_DESIGN.md §2(第43便 43D)',
      presetInjection: 'tests/qa.mjs / tests/seeds.mjs / tests/exp-4-67.mjs(validatePreset→HP.sim.build)',
    },
    designNotes: [
      'D/Kt スキャンは設計書の {0.3, 0.92, 1.5} に論文2 v0.6 の実較正点 (2/3)ln4≈0.9242 を加えた4点(0.92 は設計時の丸め値)。',
      '反比例対照の規格化 c_loc(a=1)=c0·e^{−2D/Kt} は比 H_w=−Δln R/Δt に効かないため R_inv=w·a^{−dP} で計算(p2fig6 と同一)。',
      '曲線分離のσは「実測比の解析値からの最大絶対ずれ」を採った(設計書の「実測ノイズは V29 実績で 1e-3 台」に対応)。',
    ],
  },
  verdict: {
    c1_exponential: { ok: c1, maxRelErr: relErrAll, maxWDrift: wDriftAll, sigma, curveSeps },
    c2_inverseControl: { ok: c2, maxAbsErr: invErrAll },
    c3_separation: { ok: c3, perDkt: sepForms },
    c4_v29Gate: d.v29Gate,
    all: c1 && c2 && c3 && d.v29Gate.pass,
  },
  series: d.series,
};
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-66-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/exp-4-66-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) {}
