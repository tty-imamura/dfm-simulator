// 第91便 実験 4-93: 🔥gas **平衡温度の予測値照合** — ミクロ章「熱の台帳」節の素材
//
// 主題: 熱伝導(E10′)は熱エネルギー Q=Σ C·m·T_int を保存して運ぶ(C·m 重み — 旧A9のL9解消)。
//   ならば平衡温度は初期条件から**予測**できる: T_eq = Σ C·m·T₀ / Σ C·m。
//   これを2構成で照合する(伝導のみ: muF=0・γn=0・**kRep=0** — 散逸チャネルと熱圧仕事を切って
//   Q を保存則にする):
//   (A) 等質量(m=1/1): T_eq_pred = (0.01+6.25)/2 = 3.13(単純平均)
//   (B) 非等質量(左=低温側 m=2): T_eq_pred = (2·0.01+1·6.25)/3 = 2.09(**質量重み** —
//       単純平均 3.13 とは異なる値へ収束することが、C·m 重み伝導の非自明な予測になる)
//   判定: ①Q のドリフト |ΔQ|/Q₀ < 1e-3(伝導のみで保存)②C·m 重み平均温度 T̄_w(t) が全時刻で
//   予測値と 1% 以内 ③両群の温度が予測値を挟んで単調接近(Th↓・Tc↑・順序保存)
//   (C) 既定(散逸あり muF=0.8・γn=0.3)は**参考記録**: E_kin+E_rot+E_int の総和経過を測り、
//   どこまで閉じるかを正直に報告する(熱セクターは analogy — 閉じない項があればそれも記録)。
//
// 【第1走の正直な記録 — 「伝導のみ」に kRep=0 を追加した理由】
//   初版は kRep=2(既定)のまま muF=γn=0 を「伝導のみ」とし、Q ドリフト 0.2〜1.8% で FAIL した。
//   切り分け実測(kRep×κs の4通り)で、ドリフトは **kRep>0 かつ κs>0 のときだけ**現れ、
//   kRep=0 なら 6000步で 1e-6 台(f32 丸め)であることを確認。原因は E5′×tint の設計仕様:
//   斥力ポテンシャル U_rep は温度を源とし、熱圧が力学的仕事をすると T_int から差し引かれる
//   (エンジン内コメント「U_rep が無ければ②の厳密解が T+Q/(C·m) に退化」)。つまり Q 単独は
//   kRep>0 で保存されない(断熱膨張の冷却に相当 — 意図された物理)。よって「Q を保存則にする」
//   照合には kRep=0 が正しい統制であり、kRep の熱⇄仕事チャネル自体はミクロ章の別節の題材になる。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-93.mjs(playwright 必須・約5分)
// 出力: tests/out/exp-4-93.json(QA ではない計測スクリプト — 末尾に自動判定を出す)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const has = await page.evaluate(() =>
  HP.allPresets().some((p) => p.id === 'gas') && !!HP.obsTemp && !!(HP.sim && HP.sim.energies));
if (!has) { console.log('SKIP: 🔥gas / HP.obsTemp / energies() のいずれかが無い(第91便未適用)'); await browser.close(); process.exit(0); }

// ---- 共通ランナー ------------------------------------------------------------------------
// mod: {seed, mLeft(左群の質量・既定1), conductionOnly(muF=0,γn=0), steps(既定6000), every(既定200)}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'gas')));
  if (o.seed !== undefined) p.seed = o.seed;
  if (o.mLeft !== undefined) { p.bodies[0].mMin = o.mLeft; p.bodies[0].mMax = o.mLeft; }
  if (o.conductionOnly) { p.physics.muF = 0; p.physics.gammaN = 0; p.physics.kRep = 0; }
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const n1 = p.bodies[0].n;
  const C = S.params.cHeat;
  const groupT = (lo, hi) => { let s = 0; for (let i = lo; i < hi; i++) s += HP.obsTemp(S, i);
    return s / Math.max(1, hi - lo); };
  const Q = () => { let q = 0; for (let i = 0; i < S.n; i++) q += C * Math.abs(S.m[i]) * S.Tint[i]; return q; };
  const CM = (() => { let s = 0; for (let i = 0; i < S.n; i++) s += C * Math.abs(S.m[i]); return s; })();
  const meas = () => {
    const en = S.energies();
    return { step: Math.round(S.t / 0.016), Tc: groupT(0, n1), Th: groupT(n1, S.n),
      Tw: Q() / CM, Q: Q(), kin: en.kin, rot: en.rot };
  };
  const every = o.every || 200, steps = o.steps || 6000;
  const curve = [meas()];
  for (let done = 0; done < steps; done += every) {
    const chunk = Math.min(every, steps - done);
    for (let k = 0; k < chunk; k++) S.step(0.016);
    curve.push(meas());
  }
  return { n: S.n, CM, curve, nan: S.hasNaN() };
}, mod);

const out = { meta: { exp: '4-93', wave: 91, target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🔥gas 平衡温度の予測値照合 — T_eq = Σ C·m·T₀/Σ C·m(伝導のみ構成)。' +
    '(C)既定構成のエネルギー総和は参考記録(QA ではない計測)' } };
const SEED3 = [20260806, 20260807, 20260808];
const judgeRun = (r, pred) => {
  const c0 = r.curve[0], cN = r.curve[r.curve.length - 1];
  const qDrift = Math.abs(cN.Q - c0.Q) / Math.max(c0.Q, 1e-12);
  const twErr = Math.max(...r.curve.map((c) => Math.abs(c.Tw - pred) / pred));
  // 単調接近: Th は減少・Tc は増加(200步刻みの粗い単調 — 微小揺らぎは 1e-3 まで許す)
  let mono = true;
  for (let i = 1; i < r.curve.length; i++) {
    if (r.curve[i].Th > r.curve[i - 1].Th + 1e-3 * pred) mono = false;
    if (r.curve[i].Tc < r.curve[i - 1].Tc - 1e-3 * pred) mono = false;
  }
  const bracket = c0.Tc < pred && pred < c0.Th && cN.Tc < cN.Th;
  return { qDrift, twErr, mono, bracket,
    Th0: +c0.Th.toFixed(3), Tc0: +c0.Tc.toFixed(4), ThN: +cN.Th.toFixed(3), TcN: +cN.Tc.toFixed(3),
    TwN: +cN.Tw.toFixed(4), pass: qDrift < 1e-3 && twErr < 0.01 && mono && bracket && !r.nan };
};

// ==== (A) 等質量・伝導のみ — T_eq_pred = 3.13 =================================================
console.log('=== (A) 等質量・伝導のみ(muF=0, γn=0, kRep=0・6000步)— 予測 T_eq = (0.01+6.25)/2 = 3.13 ===');
const A = { pred: (0.01 + 6.25) / 2, runs: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, conductionOnly: true });
  A.runs['s' + sd] = judgeRun(r, A.pred);
  const j = A.runs['s' + sd];
  console.log(`seed${sd}: Q drift=${j.qDrift.toExponential(1)} T̄_w 最大誤差=${(j.twErr * 100).toFixed(3)}%`,
    `Th ${j.Th0}→${j.ThN} Tc ${j.Tc0}→${j.TcN}(予測 ${A.pred.toFixed(2)} を挟んで単調接近=${j.mono && j.bracket})`,
    j.pass ? 'PASS' : 'FAIL');
}
out.equalMass = A;

// ==== (B) 非等質量(左 m=2)・伝導のみ — T_eq_pred = 2.09(質量重みの非自明予測)==============
console.log('=== (B) 非等質量(左=低温側 m=2)・伝導のみ — 予測 T_eq = (2·0.01+6.25)/3 = 2.09 ===');
const B = { pred: (2 * 0.01 + 1 * 6.25) / 3, naive: (0.01 + 6.25) / 2, runs: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, conductionOnly: true, mLeft: 2 });
  B.runs['s' + sd] = judgeRun(r, B.pred);
  const j = B.runs['s' + sd];
  console.log(`seed${sd}: Q drift=${j.qDrift.toExponential(1)} T̄_w 最大誤差=${(j.twErr * 100).toFixed(3)}%`,
    `Th ${j.Th0}→${j.ThN} Tc ${j.Tc0}→${j.TcN}(質量重み予測 ${B.pred.toFixed(3)} — 単純平均 ${B.naive.toFixed(2)} ではない)`,
    j.pass ? 'PASS' : 'FAIL');
}
out.unequalMass = B;

// ==== (C) 既定構成(散逸あり)— エネルギー総和の参考記録 ======================================
console.log('=== (C) 既定構成(muF=0.8, γn=0.3)— E_kin+E_rot+E_int の総和経過(参考記録)===');
const Csec = { runs: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd });
  const c0 = r.curve[0], cN = r.curve[r.curve.length - 1];
  const tot = (c) => c.kin + c.rot + c.Q;
  const drift = (tot(cN) - tot(c0)) / Math.max(tot(c0), 1e-12);
  Csec.runs['s' + sd] = { E0: +tot(c0).toFixed(2), EN: +tot(cN).toFixed(2),
    drift: +drift.toFixed(4), kin0: +c0.kin.toFixed(2), kinN: +cN.kin.toFixed(2),
    Q0: +c0.Q.toFixed(2), QN: +cN.Q.toFixed(2), TwN: +cN.Tw.toFixed(3) };
  const x = Csec.runs['s' + sd];
  console.log(`seed${sd}: E_kin ${x.kin0}→${x.kinN} Q ${x.Q0}→${x.QN} 総和 ${x.E0}→${x.EN}(ドリフト ${(drift * 100).toFixed(2)}%)`);
}
Csec.note = '既定構成では KE の散逸が Q へ熱化する一方、スピン斥力 kRep(E5′)は温度を源にした力で' +
  'あり仕事の相手方エネルギーを持たない(熱セクターは analogy — Negative claim)。総和ドリフトは' +
  'その設計の帰結として記録する(保存主張はしない)。壁反発・境界も KE に介入し得る。';
out.dissipative = Csec;

// ==== 総合 ====================================================================================
out.summary = {
  equalMassPass: SEED3.every((sd) => A.runs['s' + sd].pass),
  unequalMassPass: SEED3.every((sd) => B.runs['s' + sd].pass),
  predictionConfirmed: SEED3.every((sd) => A.runs['s' + sd].pass) && SEED3.every((sd) => B.runs['s' + sd].pass),
  note: '照合 =(伝導のみ構成 muF=γn=kRep=0 で)①Q 保存 ②C·m 重み平均が予測値と全時刻 1% 以内 ' +
    '③両群が予測値を挟んで単調接近。(B)は質量重み(2.09)へ収束し単純平均(3.13)ではない — ' +
    'C·m 重み伝導の非自明な予測が立つ。副産物: kRep>0 では熱圧の仕事が T_int を差し引く' +
    '(E5′×tint の設計 — Q 単独は保存されない)ことを切り分けで確認 — ミクロ章の別節素材。',
};
console.log('=== 総合 ===');
console.log(JSON.stringify(out.summary, null, 1));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-93.json'), JSON.stringify(out, null, 1));
console.log('→ tests/out/exp-4-93.json');
await browser.close();
