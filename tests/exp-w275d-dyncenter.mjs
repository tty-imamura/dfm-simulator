// 第275便d: **動的中心の診断**の器(node だけ・ブラウザ不要・**エンジンには接続していない**)。
//
// 問い: 形状トイの中心天体版は `center:"pinned"`(**位置固定の参照点**)で置いた。
//       **中心を自由にしたら**(反作用を受けて動く中心にしたら)何が起きるか。
// 答え方: `tests/lib-w275d-dyncenter.mjs` の独立した最小模型を回し、**4 列**で記録する —
//   ① 重心ドリフトと全運動量 |P|(内部項だけの宣言なら丸めの範囲で 0 —— **積分器の検算**)
//   ② ビリアル比 2K/|W|(軟化ポテンシャルなので厳密な 2 ではない —— 宣言)
//   ③ RMS 半径(中心天体からの距離)の時間列
//   ④ **中心天体自身の最大変位**(= 「位置固定」という近似がどれだけ効いているか)
// 走らせる格子は **中心質量 M**(10 / 100 / 1000 / 10000)× **中心の扱い**(自由 / 位置固定)で、
// 「位置固定の参照点」がどこから正当化できるかを**数で**置く。
//
// **合否は宣言しない**。観測された星団・銀河の量は 1 つも入力していない(**較正ではない**)。
//
// 使い方: node tests/exp-w275d-dyncenter.mjs
// 環境変数: W275D_DC_OUT(既定 tests/out/dyncenter-w275d.json)/ W275D_SMOKE=1(短い走行)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSystem, stepVerlet, diagnose, vCirc, accCore, phiCore }
  from './lib-w275d-dyncenter.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.W275D_DC_OUT || path.join(ROOT, 'tests', 'out', 'dyncenter-w275d.json');
const SMOKE = process.env.W275D_SMOKE === '1';

// **宣言値**(導出ではない。🔮 shapeToyClusterCore の見た目に合わせてある)
const DECL = { n: 240, sigma: 36, m: 0.6, G: 1, rc: 5, kh: 0, seed: 20260920,
  dt: SMOKE ? 0.02 : 0.01, T: SMOKE ? 20 : 200, nSample: SMOKE ? 5 : 20 };

function run(o) {
  const S = makeSystem(Object.assign({}, DECL, o));
  const buf = { ax: new Float64Array(S.n), ay: new Float64Array(S.n), init: false };
  const d0 = diagnose(S);
  const rows = [d0];
  const per = Math.max(1, Math.round(DECL.T / DECL.nSample / DECL.dt));
  for (let k = 0; k < DECL.nSample; k++) {
    for (let j = 0; j < per; j++) stepVerlet(S, DECL.dt, buf);
    rows.push(diagnose(S));
  }
  const dN = rows[rows.length - 1];
  const comDrift = Math.hypot(dN.com[0] - d0.com[0], dN.com[1] - d0.com[1]);
  const centreMax = Math.max(...rows.map((r) => Math.hypot(r.centre[0], r.centre[1])));
  const rmsRel = rows.map((r) => r.rms / d0.rms - 1);
  return {
    label: o.label, M: S.M, frozen: S.frozen, harmonicFrame: S.harmonicFrame,
    kh: S.kh, massRatio: S.M / (S.n * S.m),
    // ① 重心と運動量
    comDrift, comDriftOverSigma: comDrift / DECL.sigma, P0: d0.P, PN: dN.P,
    // ② ビリアル
    virial0: d0.virial, virialN: dN.virial,
    virialMean: rows.reduce((p, q) => p + q.virial, 0) / rows.length,
    // ③ RMS 半径
    rms0: d0.rms, rmsN: dN.rms, rmsRelEnd: rmsRel[rmsRel.length - 1],
    rmsRelMax: Math.max(...rmsRel.map(Math.abs)),
    // ④ 中心天体の変位
    centreMax, centreMaxOverSigma: centreMax / DECL.sigma, centreSpeedN: dN.centreSpeed,
    // 積分器の質(物理の結論ではない)
    E0: d0.E, EN: dN.E, energyRel: Math.abs(dN.E / d0.E - 1),
    series: rows.map((r) => ({ t: +r.t.toFixed(2), rms: +r.rms.toFixed(4),
      virial: +r.virial.toFixed(5), centre: +Math.hypot(r.centre[0], r.centre[1]).toFixed(5),
      E: +r.E.toFixed(6) })),
  };
}

const rows = [];
for (const M of (SMOKE ? [10, 1000] : [10, 100, 1000, 10000])) {
  for (const frozen of [false, true]) {
    rows.push(run({ M, frozen, balance: true,
      label: `M=${M}(${frozen ? '**位置固定**(pinned と同じ扱い)' : '自由(反作用あり)'})` }));
  }
}
// 負の対照: 保持項を**外力**にすると全運動量は保存しない(そう書いてあるのでそう出るはず)
const negative = [
  run({ M: 100, frozen: false, balance: true, kh: 0.0025, harmonicFrame: 'centre',
    label: '保持項 κ_h=0.0025 を**内部項**に(運動量は保存する)' }),
  run({ M: 100, frozen: false, balance: true, kh: 0.0025, harmonicFrame: 'origin',
    label: '保持項 κ_h=0.0025 を**外力**に(**運動量は保存しない** —— 負の対照)' }),
];

// 置いた場そのものの確認(円速度・加速度・ポテンシャルの数値 —— 転写した観測量は 1 つも無い)
const field = [];
for (const s of [1, 5, 10, 20, 36, 72, 144]) {
  field.push({ s, phi: phiCore(s, DECL.G, 100, DECL.rc, 0), a: accCore(s, DECL.G, 100, DECL.rc, 0),
    vc: vCirc(s, DECL.G, 100, DECL.rc, 0) });
}

const summary = {
  centreWander: rows.filter((r) => !r.frozen)
    .map((r) => ({ M: r.M, massRatio: r.massRatio, centreMaxOverSigma: r.centreMaxOverSigma })),
  frozenVsFree: rows.filter((r) => r.frozen)
    .map((r) => ({ M: r.M, rmsRelEnd: r.rmsRelEnd,
      free: (rows.find((q) => q.M === r.M && !q.frozen) || {}).rmsRelEnd })),
  momentumConserved: negative.map((r) => ({ label: r.label, PN: r.PN, comDrift: r.comDrift })),
  energyRelMax: Math.max(...rows.concat(negative).map((r) => r.energyRel)),
};
const out = {
  meta: provenanceMeta({
    wave: '第275便d(第65報・動的中心の診断)', root: ROOT, target: 'tests/lib-w275d-dyncenter.mjs',
    // **html を読まない器**なので、target も inputs も「この器が読む正本」= 純関数の lib である
    // (第274便b の sync-w274b.json と同じ形)。
    inputs: ['tests/lib-w275d-dyncenter.mjs'],
    code: ['tests/exp-w275d-dyncenter.mjs', 'tests/lib-w275d-dyncenter.mjs',
      'tests/lib-w272e-provenance.mjs'],
  }),
  section: '動的中心の診断(**エンジン未接続** —— 宣言鍵 center:"dynamic" は設計のみ)',
  notCalibration: '**較正ではない**。観測された星団・銀河・中心天体の量を 1 つも入力していない。'
    + 'ここで言う「安定」は**この模型の中で測った量**であって、観測との一致ではない。',
  notConnected: '**beta/index.html には 1 行も入っていない**。内蔵の中心天体版 3 本は '
    + '`center:"pinned"`(位置固定の参照点)のままである。',
  decl: DECL, grid: rows, negativeControls: negative, field, summary,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT);
console.log(JSON.stringify(summary, null, 1));
