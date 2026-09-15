// 第264便a(第56報 W1)「**事前予測式候補の検定**」。
//
// ■ この器が答える 1 つの問い
//   原仮定者(第56報)「『kFrame≈0.7』を、**他の観測値から事前予測する計算式を確立する**」。
//   —— `tests/exp-w264a-kjoint.mjs` が出した **4 系の k\*** に対し、候補式 H1/H2/H3 を当てて
//   **残差を表にする**。**走らせない**(共同根の JSON と CSV だけを読む算術である)。
//
// ■ 候補(統括が設定した検証仮説 (A))
//   H1: k=(f_ind−1)/χ_eff —— **独立な f_ind が無い限り予測式ではない**。較正台帳の f は
//       生成則 f=1+k_F·χ_eff(`dfmBinaryInertiaFactorLinear`)から作られているので、台帳の f を
//       入れると恒等式 k=k_F が返るだけである。本器は「台帳の f を入れると何が返るか」を**数で示す**。
//   H2: k=1−α·η_sym·χ_eff/(χ_eff+δ)。**α・δ を 4 点で最小二乗**(δ は格子探索・α は解析解)。
//       α=1.2・δ=0(事前提案値)固定の列も並べる。
//   H3: k\* と Ξ=Gm/(Rc²)・e・P・q の相関。**4 点なので係数だけを出し、有意性は言わない**。
//
// ■ **判定の書き方**
//   「他の観測値から 0.7 を事前予測する式が成立したか」を、k\* の散らばりと候補式の
//   **説明できる幅**で答える。**説明変数の幅が k\* の幅より小さければ、残差が小さくても予測ではない**
//   (定数を当てているだけである)—— その比 `rangeRatio` を必ず出す。
//
// 実行: node tests/exp-w264a-predfit.mjs
// 出力: tests/out/predfit-w264a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IN = path.join(ROOT, 'tests', 'out', 'kjoint-w264a.json');
const OUT = path.join(ROOT, 'tests', 'out', 'predfit-w264a.json');
if (!fs.existsSync(IN)) { console.error('[w264a-predfit] 先に tests/exp-w264a-kjoint.mjs を走らせる'); process.exit(2); }
const KJ = JSON.parse(fs.readFileSync(IN, 'utf8'));

// ---- 4 点の表(k* と説明変数)
const pts = [];
for (const s of KJ.systems) {
  const c = s.columns && s.columns.adopted;
  const st = s.statics || {};
  if (!c || c.kStar === null) { pts.push({ id: s.id, emoji: s.emoji, label: s.label, kStar: null,
    note: '根が出ていない' }); continue; }
  pts.push({ id: s.id, emoji: s.emoji, label: s.label,
    kStar: c.kStar, fStar: c.fStar,
    // **χ_eff の指数は 2 である**(`frameWeightPow`: frameWeight:"pull" → p=2)。
    // 減衰指数 q(≈3.17)は**引きずり核の距離減衰**であって χ の分母には入らない(アプリのヘルプ本文の宣言)。
    // 器が `p=physics.q` でも出しているのは**探索列**で、エンジンの χ ではない(X15: 証明に使わない)。
    chiEff: st.chiEffP2, chiEffQexp: st.chiEff, etaSym: st.etaSym, qRatio: st.qRatio,
    xi1: st.xiBase ? st.xiBase[0] : null, xi2: st.xiBase ? st.xiBase[1] : null,
    xiMean: st.xiBase ? (st.xiBase[0] + st.xiBase[1]) / 2 : null,
    e: c.e, eObs: s.obs && s.obs.adopted.e ? s.obs.adopted.e.value : null,
    periodSec: s.obs && s.obs.adopted.P ? s.obs.adopted.P.value : null,
    kStarSolution: s.columns.solution ? s.columns.solution.kStar : null,
    kStarHalf: s.columns.adoptedHalf ? s.columns.adoptedHalf.kStar : null });
}
const good = pts.filter((p) => p.kStar !== null && Number.isFinite(p.chiEff) && Number.isFinite(p.etaSym));

const stat = (a) => { const n = a.length; if (!n) return null;
  const mu = a.reduce((x, y) => x + y, 0) / n;
  const sd = Math.sqrt(a.reduce((s, y) => s + (y - mu) ** 2, 0) / Math.max(1, n - 1));
  return { n, mean: mu, sd, min: Math.min(...a), max: Math.max(...a), range: Math.max(...a) - Math.min(...a) }; };
const pearson = (a, b) => { const n = a.length; if (n < 3) return null;
  const ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n;
  let sab = 0, sa = 0, sb = 0;
  for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); sa += (a[i] - ma) ** 2; sb += (b[i] - mb) ** 2; }
  return (sa > 0 && sb > 0) ? sab / Math.sqrt(sa * sb) : null; };
const rankOf = (a) => { const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
  const r = new Array(a.length); idx.forEach(([, i], k) => { r[i] = k + 1; }); return r; };
const spearman = (a, b) => pearson(rankOf(a), rankOf(b));

const out = { meta: { wave: '第264便a', source: path.relative(ROOT, IN),
  claim: '**この表は事前予測式ではない。** 候補式を同じ 4 点へ当てて残差を出しただけである。'
    + '「事前予測式を確立した」とは書かない。',
  rangeRule: '**説明変数の幅が k* の幅より小さければ、残差が小さくても予測ではない**'
    + '(定数を当てているだけになる)。`rangeRatio` = 説明項の幅 / k* の幅 を必ず併記する。' },
  points: pts, n: good.length };

if (good.length >= 2) {
  const kk = good.map((p) => p.kStar);
  out.kStarStats = stat(kk);
  out.kStarStats.spreadPctOfMean = out.kStarStats.range / out.kStarStats.mean * 100;
  out.chiStats = stat(good.map((p) => p.chiEff));
  out.etaStats = stat(good.map((p) => p.etaSym));
  out.etaStats.spreadPctOfMean = out.etaStats.range / out.etaStats.mean * 100;

  // ---- H1: 台帳の f を入れると何が返るか(**恒等式**であることを数で示す)
  out.H1 = { form: 'k = (f_ind − 1) / χ_eff',
    ledger: good.map((p) => {
      // 台帳の f は生成則 f=1+k_F·χ_eff(k_F=1)そのもの。台帳の f−1 は χ_eff に一致するので k=1 が返る
      const fLedger = 1 + p.chiEff;      // **生成則そのもの**(台帳の値の作られ方)
      return { id: p.id, emoji: p.emoji, chiEff: p.chiEff, fLedger,
        kFromLedger: (fLedger - 1) / p.chiEff, kStar: p.kStar,
        note: '台帳の f は f=1+k_F·χ_eff で作られているので (f−1)/χ_eff は **k_F=1 を返すだけ**である' };
    }),
    verdict: '**循環である**。台帳の f を入れると k=1 が恒等に返り、測った k*('
      + good.map((p) => p.kStar.toFixed(4)).join(' / ') + ')とは無関係である。'
      + '**循環でない f_ind(台帳を通らない独立な質量係数)は本便では 1 件も無い。**' };

  // ---- H2: k = 1 − α·η_sym·χ_eff/(χ_eff+δ)
  const fitH2 = (deltas) => {
    let best = null;
    for (const d of deltas) {
      const u = good.map((p) => p.etaSym * p.chiEff / (p.chiEff + d));
      const y = good.map((p) => p.kStar - 1);
      let num = 0, den = 0;
      for (let i = 0; i < u.length; i++) { num += -y[i] * u[i]; den += u[i] * u[i]; }
      if (!(den > 0)) continue;
      const alpha = num / den;
      const res = good.map((p, i) => p.kStar - (1 - alpha * u[i]));
      const rss = res.reduce((s, r) => s + r * r, 0);
      if (!best || rss < best.rss) best = { alpha, delta: d, rss, res, u,
        rmse: Math.sqrt(rss / good.length) };
    }
    return best;
  };
  // δ の格子(0 と対数格子)
  const deltas = [0];
  for (let e = -6; e <= 3; e += 0.05) deltas.push(Math.pow(10, e));
  const fit = fitH2(deltas);
  const uFixed = good.map((p) => p.etaSym * p.chiEff / (p.chiEff + 0));
  const fixedPred = uFixed.map((u) => 1 - 1.2 * u);
  const fixedRes = good.map((p, i) => p.kStar - fixedPred[i]);
  out.H2 = { form: 'k = 1 − α·η_sym·χ_eff/(χ_eff + δ)',
    freeFit: fit ? { alpha: fit.alpha, delta: fit.delta, rmse: fit.rmse,
      rows: good.map((p, i) => ({ id: p.id, emoji: p.emoji, kStar: p.kStar,
        pred: 1 - fit.alpha * fit.u[i], resid: fit.res[i],
        residPct: fit.res[i] / p.kStar * 100 })) } : null,
    fixed: { alpha: 1.2, delta: 0,
      rows: good.map((p, i) => ({ id: p.id, emoji: p.emoji, kStar: p.kStar, pred: fixedPred[i],
        resid: fixedRes[i], residPct: fixedRes[i] / p.kStar * 100 })),
      rmse: Math.sqrt(fixedRes.reduce((s, r) => s + r * r, 0) / good.length) },
    // **説明項の幅**(これが k* の幅より小さければ、式は定数を当てているだけである)
    range: (() => { const u = uFixed.map((z) => 1.2 * z);
      const su = stat(u), sk = stat(kk);
      return { termStats: su, kStarStats: sk, rangeRatio: (sk.range > 0) ? su.range / sk.range : null,
        note: '説明項 α·η_sym·χ_eff/(χ_eff+δ)(α=1.2・δ=0)の幅 ÷ k* の幅。'
          + '**1 より十分小さければ、式は系ごとの差を説明していない**。' }; })(),
    freeRange: fit ? (() => { const u = fit.u.map((z) => Math.abs(fit.alpha) * z);
      const su = stat(u), sk = stat(kk);
      return { termStats: su, rangeRatio: (sk.range > 0) ? su.range / sk.range : null }; })() : null };

  // ---- H3: 相関の候補列(**4 点。係数だけ・有意性は言わない**)
  const cols = { xiMean: good.map((p) => p.xiMean), xi1: good.map((p) => p.xi1),
    xi2: good.map((p) => p.xi2), eObs: good.map((p) => p.eObs),
    periodSec: good.map((p) => p.periodSec), qRatio: good.map((p) => p.qRatio),
    etaSym: good.map((p) => p.etaSym), chiEff: good.map((p) => p.chiEff),
    // **探索列**(エンジンの χ ではない — 減衰指数 q を χ の指数に置いた場合の量)
    chiEffQexp: good.map((p) => p.chiEffQexp) };
  out.H3 = { note: '**4 点である。係数だけを出し、有意性は言わない**(統括の裁定 X15: '
      + '探索列は可・証明に使わない)。', rows: [] };
  for (const [name, v] of Object.entries(cols)) {
    if (!v.every(Number.isFinite)) { out.H3.rows.push({ column: name, pearson: null, spearman: null,
      note: '欠けている値がある' }); continue; }
    out.H3.rows.push({ column: name, values: v, pearson: pearson(kk, v), spearman: spearman(kk, v),
      range: stat(v).range, rangePctOfMean: stat(v).range / stat(v).mean * 100 });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w264a-predfit] wrote ' + OUT);
if (out.kStarStats) {
  console.error('  k*: ' + good.map((p) => p.emoji + ' ' + p.kStar.toFixed(6)).join(' / '));
  console.error('  k* の幅 = ' + out.kStarStats.range.toFixed(6)
    + ' (' + out.kStarStats.spreadPctOfMean.toFixed(2) + '% of mean)');
  console.error('  η_sym の幅 = ' + out.etaStats.range.toExponential(3)
    + ' (' + out.etaStats.spreadPctOfMean.toFixed(4) + '% of mean)');
  console.error('  H2 自由 fit: α=' + out.H2.freeFit.alpha.toFixed(6) + ' δ=' + out.H2.freeFit.delta.toExponential(3)
    + ' rmse=' + out.H2.freeFit.rmse.toExponential(3));
  console.error('  H2 固定(α=1.2・δ=0) rmse=' + out.H2.fixed.rmse.toExponential(3)
    + ' / 説明項の幅比 rangeRatio=' + (out.H2.range.rangeRatio === null ? '—' : out.H2.range.rangeRatio.toExponential(3)));
  for (const r of out.H3.rows) console.error('  H3 ' + r.column + ': pearson='
    + (r.pearson === null ? '—' : r.pearson.toFixed(4)) + ' spearman='
    + (r.spearman === null ? '—' : String(r.spearman)));
}
