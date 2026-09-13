// 第261便c(第53報 W3)「Richardson 4 系 + 門 5 つの機械判定」。
//
// ■ 何をするか
//   `tests/out/precision-w261c.json`(同じ抽出器で測った ⚡🧮🩺🧶 の段)から、
//   **段をずらした Richardson**(h,h/2,h/4 → h/2,h/4,h/8 → h/4,h/8,h/16)を作り、
//   次数 p・y∞・観測との差・σ 倍を 1 枚の表にする。さらに `HP.dfmForecastGate` を**そのまま**
//   呼んで、**NS 4 系が門 5 つを通らないことを機械で示す**(0 件であることの証拠を器に残す)。
//
// ■ 自前で再現するもの(統括が設定した検証仮説 (B))
//   🧮 の **P∞ = 2×P(h/8) − P(h/4)**(参照 15855.411 s・観測との差 −2.258 s)。
//   **一致しても不一致でも、印字するのは自前の実測である。**
//
// ■ 触らないもの
//   走行はしない(この器はブラウザを 1 枚だけ開いて純関数 `HP.dfmForecastGate` を呼ぶ)。
//   プリセット JSON は読みもしない。
//
// 実行: node tests/exp-w261c-richardson.mjs
// 出力: tests/out/richardson-w261c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const SRC = path.join(ROOT, 'tests', 'out', 'precision-w261c.json');
const OUT = path.join(ROOT, 'tests', 'out', 'richardson-w261c.json');
const P = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// 統括が設定した検証仮説 (B) の参照値(**仮説** —— 並べるためだけに置く)
const HYP_B = {
  psrJ1757DFM: { pInfTwoTerm: 15855.411, residualTwoTerm: -2.258, residualOrderFit: -1.85 },
  psrDoubleABDFM: { residualOrderFit: -0.219 },
  psrB1534DFM: { residualOrderFit: -15.86 },
  psrJ1946DFM: { residualOrderFitOld: 0.149,
    note: '🩺 の旧値は**抽出器の欠陥で無効**(統括の読み (C))。本器は新しい抽出器で測り直した段から作る。' },
};

const pObs = (q1, q2, q4) => {
  const a = q1 - q2, b = q2 - q4;
  if (![a, b].every(Number.isFinite) || b === 0) return null;
  const r = a / b;
  return (r > 0) ? Math.log2(r) : null;
};
const rich = (qC, qF, order, ratio = 2) => {
  if (![qC, qF].every(Number.isFinite) || !Number.isFinite(order) || !(order > 0)) return null;
  return qF + (qF - qC) / (Math.pow(ratio, order) - 1);
};

const QUANTS = [
  { key: 'P', name: '近点間 P [s]', get: (s) => s.dets['phase1.5'].perMeanSec, obs: 'period' },
  { key: 'e', name: '離心率 proxy', get: (s) => s.eProxy, obs: 'ecc' },
  { key: 'degYear', name: '近点移動 [deg/yr]', get: (s) => s.dets['phase1.5'].degPerYear, obs: 'omegaDot' },
];

const cases = [];
for (const c of P.cases) {
  const st = c.stages.map((s) => ({ div: s.div, h: s.dt }));
  const rows = [];
  for (const Q of QUANTS) {
    const y = c.stages.map(Q.get);
    const tri = [];
    for (let i = 0; i + 2 < y.length; i++) {
      const p = pObs(y[i], y[i + 1], y[i + 2]);
      tri.push({ triple: [st[i].div, st[i + 1].div, st[i + 2].div].map((z) => 'h/' + z).join(','),
        pObs: p, yInf: rich(y[i + 1], y[i + 2], p) });
    }
    const ext = tri.map((z) => z.yInf).filter(Number.isFinite);
    const spread = (ext.length >= 2) ? Math.abs(ext[ext.length - 1] - ext[ext.length - 2]) : null;
    // 観測(版 v1 が正本・🩺 だけ版 v2 も併記する)
    const mk = (o) => {
      if (!o || !Number.isFinite(o.value)) return null;
      // 単位合わせ: 周期は s 以外(d)なら採らない(黙って換算しない)
      const yInf = ext.length ? ext[ext.length - 1] : null;
      const last = y[y.length - 1];
      const f = (v) => (Number.isFinite(v) && Number.isFinite(o.value)) ? v - o.value : null;
      const ns = (v) => (Number.isFinite(v) && o.sigma > 0) ? Math.abs(v - o.value) / o.sigma : null;
      return { value: o.value, unit: o.unit, sigma: o.sigma, source: o.source.slice(0, 80),
        finestResidual: f(last), finestNSigma: ns(last), finestResidualPct: (o.value ? 100 * f(last) / o.value : null),
        yInfResidual: f(yInf), yInfNSigma: ns(yInf), yInfResidualPct: (o.value ? 100 * f(yInf) / o.value : null) };
    };
    const o1 = c.obs.v1[Q.obs], o2 = c.obs.v2[Q.obs];
    rows.push({ key: Q.key, name: Q.name, stages: st.map((z) => 'h/' + z.div), values: y,
      shiftedRichardson: tri, pShifts: tri.map((z) => z.pObs),
      yInf: ext.length ? ext[ext.length - 1] : null, extrapolations: ext, extrapolationSpread: spread,
      asymptotic: (tri.length >= 2 && tri.every((z) => Number.isFinite(z.pObs)))
        ? Math.abs(tri[tri.length - 1].pObs - tri[0].pObs) < 0.1 : null,
      obsV1: (o1 && (Q.key !== 'P' || o1.unit === 's')) ? mk(o1) : null,
      obsV2: (o2 && (Q.key !== 'P' || o2.unit === 's')) ? mk(o2) : null });
  }
  // 2 項 Richardson(次数を 1 と仮定した P∞=2P(h/8)−P(h/4))—— 統括が設定した検証仮説 (B) の形
  const yP = c.stages.map((s) => s.dets['phase1.5'].perMeanSec);
  const i8 = c.stages.findIndex((s) => s.div === 8), i4 = c.stages.findIndex((s) => s.div === 4);
  const twoTerm = (i8 >= 0 && i4 >= 0) ? 2 * yP[i8] - yP[i4] : null;
  const o1P = c.obs.v1.period;
  const twoTermResid = (twoTerm !== null && o1P && o1P.unit === 's') ? twoTerm - o1P.value : null;
  cases.push({ id: c.id, emoji: c.emoji, toSec: c.toSec, quantities: rows,
    twoTermRichardson: { formula: 'P∞ = 2×P(h/8) − P(h/4)(次数 1 を仮定した 2 項 Richardson)',
      value: twoTerm, residualSec: twoTermResid,
      nSigma: (twoTermResid !== null && o1P && o1P.sigma > 0) ? Math.abs(twoTermResid) / o1P.sigma : null,
      hypothesis: HYP_B[c.id] || null,
      hypDelta: (HYP_B[c.id] && Number.isFinite(HYP_B[c.id].pInfTwoTerm) && twoTerm !== null)
        ? twoTerm - HYP_B[c.id].pInfTwoTerm : null,
      note: '**外挿は走行ではない**(推定値である)。「dt を細かくすれば合う」とは書けない。' },
    eventAudit: c.stages.map((s) => ({ div: s.div,
      candidates: s.dets['phase1.5'].candidates, rejected: s.dets['phase1.5'].rejectedCount,
      legacyNPeri: s.dets.legacy.nPeri, legacyMeasured: s.dets.legacy.measured,
      legacyUnwrapFailed: s.dets.legacy.unwrapFailed,
      legacyPeriodSec: s.dets.legacy.perMeanSec, legacyPeriodSecRaw: s.dets.legacy.perMeanSecRaw,
      legacyDegPerYear: s.dets.legacy.degPerYear,
      nan: s.nan, clamp: s.clamp, stopped: s.stopped })) });
}

// ---- 門 5 つの機械判定(`HP.dfmForecastGate` を**そのまま**呼ぶ)----
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.dfmForecastGate);

const gates = [];
for (const c of P.cases) {
  const o1 = c.obs.v1.period, o2 = c.obs.v2.period;
  const obs = (o2 && o2.unit === 's') ? o2 : o1;          // 🩺 は版 v2(DDFWHE)で判定する
  if (!obs || obs.unit !== 's') continue;
  const series = {
    fixed: { quantity: '近点間 P', observationVersion: (obs === o2) ? 'DDFWHE (Meng et al. 2025 Table 1)' : obs.source.slice(0, 60),
      unit: 's', timeSystem: (obs === o2) ? 'TDB/DE440' : '宣言なし(版 v1)',
      window: '最初の 20 近点(19 区間)', extractor: 'radial-crossing/orbit-phase-1.5pi-v1',
      f: '宣言値(段ごとに再 fit しない)', refitPerStage: false },
    stages: c.stages.map((s) => ({ h: s.dt, y: s.dets['phase1.5'].perMeanSec })),
    // 位相制限で**採らなかった**候補は「除外済みの重複」であって未処理の混入ではない ——
    // だから excluded.duplicateEvents は 0 である(棄却された数は下の duplicateCandidates に残す)。
    excluded: { duplicateEvents: 0,
      nan: c.stages.filter((s) => s.nan).length,
      incomplete: c.stages.filter((s) => s.stopped !== 'window').length,
      unwrapFailed: c.stages.filter((s) => s.dets['phase1.5'].unwrapFailed).length,
      roundingFloor: 0 },
    yObs: obs.value, sigma: obs.sigma, systematic: 0,
    // **独立推定は無い**(別積分法・別抽出法での y∞ を誰も作っていない)—— 門(4)はここで落ちる
    independent: null,
  };
  const g = await pg.evaluate((s) => HP.dfmForecastGate(s), series);
  gates.push({ id: c.id, emoji: c.emoji, observationVersion: series.fixed.observationVersion,
    duplicateCandidatesRejected: c.stages.map((s) => s.dets['phase1.5'].rejectedCount),
    ok: g.ok, verdict: g.verdict, failed: g.failed, p: g.p, pShifts: g.pShifts,
    yInf: g.yInf, uInf: g.uInf, residual: g.residual, distanceSigma: g.distanceSigma,
    gates: g.gates });
}
await browser.close();

const out = { meta: { wave: '第261便c', source: 'tests/out/precision-w261c.json', target: TARGET,
  window: P.meta.window, extractor: P.meta.extractor,
  gateNote: '**門 5 つを通ったサンプルは 0 件である。** 通らない理由を `failed` に機械で残す。'
    + '**「漸近域だから精度が足りる」とは書かない** —— 漸近域(門 3)と 3σ(門 5)は別の門である。',
  hypothesis: '統括が設定した検証仮説 (B)(🧮 P∞=15855.411 s・−2.258 s 等)は**仮説**であって、'
    + '本器が印字するのは自前の実測である(差は hypDelta 欄)。' },
  cases, forecastGates: gates };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w261c-rich] wrote ' + OUT);
for (const c of cases) {
  const p = c.quantities.find((q) => q.key === 'P');
  console.error(`  ${c.emoji} ${c.id}: p_shift ${p.pShifts.map((z) => z === null ? '—' : z.toFixed(4)).join(' → ')}`
    + ` / y∞ ${p.yInf === null ? '—' : p.yInf.toFixed(4)} s`
    + ` / 外挿の残差 ${p.obsV1 && p.obsV1.yInfResidual !== null ? p.obsV1.yInfResidual.toFixed(4) + ' s (' + p.obsV1.yInfNSigma.toExponential(3) + 'σ)' : '—'}`
    + (p.obsV2 ? ` / [版 v2] ${p.obsV2.yInfResidual.toFixed(4)} s (${p.obsV2.yInfNSigma.toExponential(3)}σ)` : '')
    + ` / 2 項 ${c.twoTermRichardson.value === null ? '—' : c.twoTermRichardson.value.toFixed(3) + ' s'}`
    + (c.twoTermRichardson.residualSec !== null ? ` (${c.twoTermRichardson.residualSec.toFixed(3)} s)` : ''));
}
for (const g of gates) console.error(`  [門] ${g.emoji} ${g.id}: ok=${g.ok} 落ちた門 ${g.failed.join(',')}`
  + ` / p ${g.p === null ? '—' : g.p.toFixed(4)} / 距離 ${g.distanceSigma === null ? '—' : g.distanceSigma.toExponential(3)}σ`);
