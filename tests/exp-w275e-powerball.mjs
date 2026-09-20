// 第275便e: **パワーボール効果(第65報 (8) の仮説)の閉じた node 模型の値表**(実測器・エンジン未接続)。
//
// 検証順(指示どおり ①→⑤。前の段が通らないまま次へ行かない):
//   ① 無トルク       …… K=Q=0 で E/J 保存・自転一定。**負の対照**(R37): K>0・Q=0 でも τ·ŝ=0 なので
//                        |S| は動かない = **垂直なジャイロトルクは自転を加速しない**。歳差は始まる(H1)。
//   ② 向きの整列     …… Q>0 で軸が r̂ へ寄る時定数を測り、線形理論 τ=|S|/Q と比べる。**K に依らない**ことも測る。
//   ③ 散逸           …… E_rot+U+Heat が一定(丸めの範囲)。Heat は単調増加。
//   ④ 潮汐内部モード …… 自転の増分が **公転 E/J・収縮 −½Ω²İ・内部モード・外部駆動**のどれから来たかを
//                        帳簿で追う。ΔE_rot = ΣW が**厳密**に閉じること。「力を抜くと減速」も対照で測る。
//   ⑤ 閉じた連星     …… 2 体・軌道の反作用込み。軸が互いを向く状態が出るか(H5)・公転 J の行き先(H7)。
//
// 使い方: node tests/exp-w275e-powerball.mjs   → tests/out/powerball-w275e.json
// 書かないこと: 「合体を再現した」「潮汐ロックを証明した」「パワーボール効果を確認した」「法則」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as PB from './lib-w275e-powerball.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deg = (x) => x * 180 / Math.PI;
const rel = (a, b) => Math.abs(a - b) / Math.max(1e-30, Math.abs(b));

/* ── ① 無トルクと負の対照 ─────────────────────────────────────────────────── */
// 軸は r̂=x̂ から 60° 傾けて置く(面外成分を持たせる)。I0=1・|S|=2。
const psi0 = 60 * Math.PI / 180;
const S0 = [2 * Math.cos(psi0), 0, 2 * Math.sin(psi0)];
const baseSolo = { I0: 1, y0: [...S0, 0, 0, 0, 0, 0, 0, 0], dt: 2e-3, steps: 200000, samples: 40 };

const stage1 = [
  { id: 'noTorque', K: 0, Q: 0 },                 // 完全な無トルク
  { id: 'gyroOnly', K: 1.5, Q: 0 },               // **負の対照**: 保存トルクだけ
  { id: 'gyroOnlyStrong', K: 15, Q: 0 },          // 10 倍にしても |S| は動かない
].map((c) => {
  const r = PB.runSolo({ ...baseSolo, ...c });
  const aConst = Math.max(...r.snaps.map((z) => Math.abs(z.inv.a - r.first.a)));
  // 歳差率は**巻き数の曖昧さが出ない短い走行**(半回転未満)で測る。
  // ŝ は r̂=x̂ のまわりを回るので、(y,z) 面の位相の進みがそのまま歳差角である。
  // dŝ/dt = (K a/|S|)(ŝ×r̂) = −(K a/|S|)(r̂×ŝ) なので**符号つき理論値は −K a/|S|** である。
  const rs = PB.runSolo({ ...baseSolo, ...c, dt: 2e-3, steps: 250, samples: 4 });
  const th0 = Math.atan2(S0[2], S0[1]), th1 = Math.atan2(rs.y[2], rs.y[1]);
  let dth = th1 - th0;
  while (dth > Math.PI) dth -= 2 * Math.PI;
  while (dth < -Math.PI) dth += 2 * Math.PI;
  const theory = -PB.precessionRate(c.K, r.first.a, r.first.Smag);
  return { id: c.id, K: c.K, Q: c.Q, t: r.t,
    spinRelDrift: rel(r.last.Smag, r.first.Smag),
    omegaFirst: r.first.omega, omegaLast: r.last.omega,
    aDriftMax: aConst, psiFirstDeg: r.first.psiDeg, psiLastDeg: r.last.psiDeg,
    precWindow: rs.t, precMeasured: dth / rs.t, precTheory: theory,
    precRelDiff: (c.K === 0) ? null : rel(dth / rs.t, theory),
    heat: r.last.heat };
});
// トルクの軸方向成分そのもの(式の上で 0 であることを数で見せる)
const axialProbe = [[0.3, 0.2, 0.9], [1, 0, 0], [0.1, -2, 0.5]].map((S) => {
  const p = PB.axialProjection(S, [1, 0, 0], 1.5, 0.8);
  return { S, ...p,
    relC: p.tauCmag > 0 ? Math.abs(p.tauCdotS) / p.tauCmag : 0,
    relD: p.tauDmag > 0 ? Math.abs(p.tauDdotS) / p.tauDmag : 0 };
});

/* ── ② 向きの整列(時定数) ───────────────────────────────────────────────── */
const alignRows = [];
for (const Q of [0.2, 0.5, 1.0]) for (const K of [1.5, 15]) {
  const psi = 5 * Math.PI / 180, Sm = 2;
  const y0 = [Sm * Math.cos(psi), 0, Sm * Math.sin(psi), 0, 0, 0, 0, 0, 0, 0];
  const r = PB.runSolo({ ...baseSolo, id: `align_K${K}_Q${Q}`, K, Q, y0, dt: 2e-3, steps: 5000, samples: 60 });
  // 線形域の指数減衰を 2 点(t=0 と t=最後)から読む
  const p0 = r.first.psiDeg, p1 = r.last.psiDeg;
  const tauMeas = (p1 > 0 && p1 < p0) ? r.t / Math.log(p0 / p1) : Infinity;
  alignRows.push({ K, Q, t: r.t, psi0Deg: p0, psiEndDeg: p1,
    tauMeasured: tauMeas, tauTheory: PB.alignTimeConstant(2, Q),
    tauRelDiff: rel(tauMeas, PB.alignTimeConstant(2, Q)),
    spinRelDrift: rel(r.last.Smag, r.first.Smag) });
}
// K を変えても τ が変わらないこと(K 非依存の対照)
const tauByK = {};
for (const row of alignRows) { const k = 'Q=' + row.Q; (tauByK[k] = tauByK[k] || []).push(row.tauMeasured); }
const tauKspread = Object.entries(tauByK).map(([k, v]) => ({ q: k, values: v,
  relSpread: (Math.max(...v) - Math.min(...v)) / Math.max(1e-30, Math.min(...v)) }));

/* ── ③ 散逸の帳簿 ─────────────────────────────────────────────────────────── */
const dissRows = [{ K: 1.5, Q: 0.5 }, { K: 4, Q: 2 }, { K: 0.8, Q: 0.05 }].map((c) => {
  const r = PB.runSolo({ ...baseSolo, id: `diss_K${c.K}_Q${c.Q}`, ...c, dt: 1e-3, steps: 60000, samples: 40 });
  let worst = 0, monotone = true, prev = -1;
  for (const z of r.snaps) {
    worst = Math.max(worst, Math.abs(z.inv.closureNoSupply - r.first.closureNoSupply));
    if (z.inv.heat < prev - 1e-15) monotone = false;
    prev = z.inv.heat;
  }
  return { ...c, t: r.t, closureFirst: r.first.closureNoSupply, closureLast: r.last.closureNoSupply,
    worstClosureAbs: worst, worstClosureRel: worst / Math.max(1e-30, Math.abs(r.first.closureNoSupply)),
    heat: r.last.heat, heatMonotone: monotone,
    psiFirstDeg: r.first.psiDeg, psiLastDeg: r.last.psiDeg,
    spinRelDrift: rel(r.last.Smag, r.first.Smag) };
});

/* ── ④ 自転の増分の出どころ(4 つの供給源の帳簿) ─────────────────────────── */
const supplyCases = [
  { id: 'orbitOnly', sup: { Gamma: 0.05, Omega: 6 } },
  { id: 'contractOnly', sup: { contractRate: 0.02 } },
  { id: 'internalOnly', sup: { intPower: 0.3 } },
  { id: 'driveOnly', sup: { drive: 0.08 } },
  { id: 'driveOff(力を抜く)', sup: { drive: -0.08 } },
  { id: 'allFour', sup: { Gamma: 0.05, Omega: 6, contractRate: 0.02, intPower: 0.3, drive: 0.08 } },
  { id: 'noSupply(負の対照)', sup: null },
];
const supplyRows = supplyCases.map((c) => {
  const r = PB.runSolo({ ...baseSolo, id: c.id, K: 1.5, Q: 0.5, spinAxisSupply: c.sup,
    dt: 5e-4, steps: 20000, samples: 40 });
  const dErot = r.last.Erot - r.first.Erot;
  const sumW = r.last.supplySum - r.first.supplySum;
  // 全体の閉じ(r̂ 固定): E_rot + U + Heat − ΣW = 一定
  const c0 = r.first.Erot + r.first.U + r.first.heat - r.first.supplySum;
  const c1 = r.last.Erot + r.last.U + r.last.heat - r.last.supplySum;
  return { id: c.id, t: r.t, declared: c.sup ? Object.keys(c.sup).join('+') : 'なし',
    omegaFirst: r.first.omega, omegaLast: r.last.omega,
    spinMagFirst: r.first.Smag, spinMagLast: r.last.Smag,
    dErot, sumW, ledgerAbs: Math.abs(dErot - sumW),
    ledgerRel: Math.abs(dErot - sumW) / Math.max(1e-30, Math.abs(dErot)),
    Worb: r.last.Worb, Wcon: r.last.Wcon, Wint: r.last.Wint, Wdrv: r.last.Wdrv,
    dLorb: r.last.Lorb - r.first.Lorb, dEint: r.last.Eint - r.first.Eint,
    fullClosureAbs: Math.abs(c1 - c0), heat: r.last.heat,
    psiLastDeg: r.last.psiDeg };
});

/* ── ⑤ 閉じた連星 ─────────────────────────────────────────────────────────── */
function binCase(o) {
  const P = { id: o.id, G: 1, m1: 1, m2: 1, I: [0.4, 0.4], K: o.K, Q: o.Q,
    dt: o.dt || 1e-3, steps: o.steps || 200000, samples: 40 };
  const k0 = PB.keplerFromL(P, o.L0);
  const mk = (psi, ph) => {          // |S|=o.Smag・r̂(t=0)=x̂ から角 psi、面外に ph
    const S = o.Smag;
    return [S * Math.cos(psi), S * Math.sin(psi) * Math.cos(ph), S * Math.sin(psi) * Math.sin(ph)];
  };
  P.y0 = [...mk(o.psi1, o.ph1), ...mk(o.psi2, o.ph2), o.L0, 0, 0];
  const r = PB.runBinary(P);
  return { id: o.id, L0: o.L0, Omega0: k0.Omega, sep0: k0.sep, t: r.t,
    K: o.K, Q: o.Q, Smag: o.Smag,
    psi1FirstDeg: r.first.bodies[0].psiDeg, psi1LastDeg: r.last.bodies[0].psiDeg,
    psi2FirstDeg: r.first.bodies[1].psiDeg, psi2LastDeg: r.last.bodies[1].psiDeg,
    a1Last: r.last.bodies[0].a, a2Last: r.last.bodies[1].a,
    omega1First: r.first.bodies[0].omega, omega1Last: r.last.bodies[0].omega,
    LorbFirst: r.first.Lorb, LorbLast: r.last.Lorb, dLorb: r.last.Lorb - r.first.Lorb,
    SzFirst: r.first.bodies[0].Sz + r.first.bodies[1].Sz,
    SzLast: r.last.bodies[0].Sz + r.last.bodies[1].Sz,
    JzFirst: r.first.Jz, JzLast: r.last.Jz, worstJzRel: r.worstJzRel,
    Efirst: r.first.E, Elast: r.last.E, worstErel: r.worstErel,
    worstSpinRel: r.worstSpinRel, sepLast: r.last.sep, OmegaLast: r.last.Omega,
    heat: r.last.heat, heatDrops: r.heatDrops, heatSteps: r.heatSteps,
    heatWorstDrop: r.heatWorstDrop,
    alignGap1Deg: Math.min(r.last.bodies[0].psiDeg, 180 - r.last.bodies[0].psiDeg),
    alignGap2Deg: Math.min(r.last.bodies[1].psiDeg, 180 - r.last.bodies[1].psiDeg) };
}
const binRows = [
  binCase({ id: 'conservative(Q=0)', K: [0.5, 0.5], Q: [0, 0], Smag: 0.4, L0: 0.5,
    psi1: 1.0, ph1: 0.0, psi2: 2.0, ph2: 1.1 }),
  binCase({ id: 'dissipative(Q>0)', K: [0.5, 0.5], Q: [0.05, 0.05], Smag: 0.4, L0: 0.5,
    psi1: 1.0, ph1: 0.0, psi2: 2.0, ph2: 1.1 }),
  binCase({ id: 'dissipativeStrong', K: [0.5, 0.5], Q: [0.4, 0.4], Smag: 0.4, L0: 0.5,
    psi1: 1.0, ph1: 0.0, psi2: 2.0, ph2: 1.1 }),
  binCase({ id: 'zeroK(負の対照)', K: [0, 0], Q: [0, 0], Smag: 0.4, L0: 0.5,
    psi1: 1.0, ph1: 0.0, psi2: 2.0, ph2: 1.1 }),
];

/* ── 仮説 H1〜H7 の対応づけ(Failure First) ──────────────────────────────── */
const g1 = stage1.find((z) => z.id === 'gyroOnly');
const g1s = stage1.find((z) => z.id === 'gyroOnlyStrong');
const a1 = alignRows[0];
const s4 = supplyRows.find((z) => z.id === 'driveOnly');
const s4off = supplyRows.find((z) => z.id === 'driveOff(力を抜く)');
const s4no = supplyRows.find((z) => z.id === 'noSupply(負の対照)');
const bDis = binRows.find((z) => z.id === 'dissipative(Q>0)');
const bStr = binRows.find((z) => z.id === 'dissipativeStrong');
const bCon = binRows.find((z) => z.id === 'conservative(Q=0)');
const verdict = [
  { id: 'H1', claim: 'ジャイロ速度で歳差が始まる', inModel: '成り立つ',
    evidence: `保存トルクだけで歳差率 実測 ${g1.precMeasured.toExponential(6)} / 理論 Ka/|S| ${g1.precTheory.toExponential(6)}(相対差 ${g1.precRelDiff.toExponential(2)})` },
  { id: 'H2', claim: 'トルクに逆らう力が回転を加速する(力を抜くと減速)', inModel: '**成り立たない(そのままでは)**',
    evidence: `軸に垂直なトルクでは |S| が動かない: K=1.5 で ${g1.spinRelDrift.toExponential(2)}・K=15 でも ${g1s.spinRelDrift.toExponential(2)}(丸め)。`
      + `**供給源を宣言して初めて**加速する: drive=+0.08 で ω ${s4.omegaFirst.toFixed(6)}→${s4.omegaLast.toFixed(6)}・`
      + `drive=−0.08(力を抜く)で ${s4off.omegaFirst.toFixed(6)}→${s4off.omegaLast.toFixed(6)}・供給なしでは ${s4no.omegaLast.toFixed(6)}(不変)` },
  { id: 'H3', claim: '潮汐の引き伸ばしが軸を傾け自転を加速する', inModel: '**半分だけ**',
    evidence: `向きの散逸は軸を動かす(ψ ${a1.psi0Deg.toFixed(4)}°→${a1.psiEndDeg.toFixed(4)}°)が、その間の |S| 変化は ${a1.spinRelDrift.toExponential(2)}。`
      + `**傾きは起きるが、それ自体は自転を加速しない**(加速は第④段の宣言した供給からしか来ない)` },
  { id: 'H4', claim: '歳差がロックするとさらに加速する', inModel: '**未導出**',
    evidence: '本模型に「歳差のロック」に対応する共鳴自由度が無い(軸の方位は連続変数で、ロックする位相が定義されていない)。設計としても未着手' },
  { id: 'H5', claim: '究極は互いに軸を向ける', inModel: '**途中まで**(残差が残って止まる)',
    evidence: `散逸つき連星で両軸は連結線へ寄るが **${bDis.alignGap1Deg.toFixed(3)}° / ${bDis.alignGap2Deg.toFixed(3)}° の残差で止まる**`
      + `(|a|=${Math.abs(bDis.a1Last).toFixed(6)} / ${Math.abs(bDis.a2Last).toFixed(6)})。`
      + `**散逸を強くすると逆に悪くなる**(Q=0.4 で ${bStr.alignGap1Deg.toFixed(3)}° / ${bStr.alignGap2Deg.toFixed(3)}°)—— `
      + `r̂ が公転で回り続けるので、追随の遅れが残差になる。保存だけ(Q=0)では ${bCon.alignGap1Deg.toFixed(3)}° / ${bCon.alignGap2Deg.toFixed(3)}° で寄らない` },
  { id: 'H6', claim: '軸の傾きで潮汐が弱まり NS 連星では途中で安定する', inModel: '**未導出**',
    evidence: '本模型の K・Q は傾きに依らない宣言定数で、「傾きで潮汐が弱まる」帰還路が入っていない。入れるには K(ψ)・Q(ψ) の宣言が要る(未実装)。'
      + `なお「途中で止まる」こと自体は H5 の残差として出ているが、**その原因は潮汐の弱まりではなく公転の追随遅れ**である` },
  { id: 'H7', claim: '互いに軸を向けた状態が DFM 版 BH 連星で、遠心力を失って合体する', inModel: '**出ない**',
    evidence: `公転 J は向きの結合で ΔL_orb=${bDis.dLorb.toExponential(3)}(J_z は ${bDis.worstJzRel.toExponential(2)} の相対精度で保存)。`
      + `分離は ${bDis.sep0.toFixed(6)}→${bDis.sepLast.toFixed(6)} で **縮まずに広がる**。`
      + `**合体に要る J の行き先が本模型に無い**(放射も降着も入っていない)` },
  { id: 'N1', claim: '(否定結果)向きの散逸は、公転が回る系では熱の単調増加を保証しない', inModel: '**保証されない**',
    evidence: `τ_d は**配置の関数**であって相対角速度の関数ではないので、r̂ が回る閉じた系では Ḣeat の符号が変わる: `
      + `Q=0.05 で ${bDis.heatDrops}/${bDis.heatSteps} 步が減少(最大 ${bDis.heatWorstDrop.toExponential(2)})・Q=0.4 で ${bStr.heatDrops}/${bStr.heatSteps} 步。`
      + `r̂ 固定の単体(第③段)では 3 条件とも単調で、**回る系にしたときだけ破れる**。`
      + `真の散逸にするには τ_d を相対角速度 (ω−Ω) の関数として宣言し直す必要がある(未実装)` },
];

/* ── 正本 JSON ────────────────────────────────────────────────────────────── */
const out = {
  meta: withProvenance({
    note: '第275便e — パワーボール効果(第65報 (8))の**閉じた node 模型**。エンジン未接続。',
    hypothesis: PB.POWERBALL_HYPOTHESIS,
    doNotWrite: ['合体を再現した', '潮汐ロックを証明した', 'パワーボール効果を確認した',
      '成長系列は法則である', 'BH 連星を実装した'],
    caveat: 'K・Q・Γ・収縮率・駆動 D は**宣言された自由パラメータ**である。観測から同定した値は 1 つも無い。',
  }, {
    root: ROOT, wave: '第275便e', target: 'tests/lib-w275e-powerball.mjs',
    code: ['tests/exp-w275e-powerball.mjs', 'tests/lib-w275e-powerball.mjs',
      'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w275e-powerball.mjs'],
  }),
  stage1: { rows: stage1, axialProbe,
    note: '**負の対照**: 保存トルクも散逸トルクも τ·ŝ=0 なので |S| を 1 も動かさない(R37)' },
  stage2: { rows: alignRows, tauIndependentOfK: tauKspread,
    note: '整列の時定数は線形域で |S|/Q。**K に依らない**' },
  stage3: { rows: dissRows, note: 'E_rot+U+Heat が一定(r̂ 固定・閉じた系)' },
  stage4: { rows: supplyRows,
    note: '自転が加速してよい唯一の口は**宣言した供給源**。ΔE_rot=ΣW が厳密に閉じる' },
  stage5: { rows: binRows,
    note: 'J_z = L_orb + ΣS_z は構造的に保存(反作用を dL_orb/dt=−Στ_z で閉じた)' },
  verdict,
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'powerball-w275e.json'), JSON.stringify(out, null, 1));

const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
const f = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第275便e — パワーボールの閉じた node 模型(**仮説の試験**・エンジン未接続)');
console.log('① 無トルクと**負の対照**(軸に垂直なトルクは自転を加速しない):');
for (const r of stage1) console.log(`   ${r.id.padEnd(16)} K=${r.K} Q=${r.Q} / |S| の相対漂い ${e(r.spinRelDrift)}`
  + ` / ω ${f(r.omegaFirst)}→${f(r.omegaLast)} / ψ ${f(r.psiFirstDeg, 4)}°→${f(r.psiLastDeg, 4)}°`
  + ` / 歳差 実測 ${e(r.precMeasured)} vs 理論 ${e(r.precTheory)}(相対差 ${e(r.precRelDiff)})`);
console.log('   トルクの軸成分 |τ·ŝ|/|τ|: '
  + axialProbe.map((p) => `保存 ${e(p.relC)}・散逸 ${e(p.relD)}`).join(' / '));
console.log('② 整列の時定数(理論 |S|/Q・**K に依らない**):');
for (const r of alignRows) console.log(`   K=${String(r.K).padStart(4)} Q=${r.Q} / 実測 ${f(r.tauMeasured)}`
  + ` vs 理論 ${f(r.tauTheory)}(相対差 ${e(r.tauRelDiff)}) / ψ ${f(r.psi0Deg, 4)}°→${f(r.psiEndDeg, 4)}°`
  + ` / |S| 漂い ${e(r.spinRelDrift)}`);
console.log('   K を変えたときの τ の散らばり: ' + tauKspread.map((z) => `${z.q} → ${e(z.relSpread)}`).join(' / '));
console.log('③ 散逸の帳簿(E_rot+U+Heat 一定):');
for (const r of dissRows) console.log(`   K=${r.K} Q=${r.Q} / 閉じの最悪 ${e(r.worstClosureAbs)}(相対 ${e(r.worstClosureRel)})`
  + ` / Heat ${f(r.heat)} 単調=${r.heatMonotone} / ψ ${f(r.psiFirstDeg, 3)}°→${f(r.psiLastDeg, 3)}°`);
console.log('④ 自転の増分の出どころ(ΔE_rot = ΣW):');
for (const r of supplyRows) console.log(`   ${r.id.padEnd(22)} 宣言=${r.declared.padEnd(38)}`
  + ` ω ${f(r.omegaFirst)}→${f(r.omegaLast)} / ΔE_rot ${e(r.dErot)} vs ΣW ${e(r.sumW)}`
  + `(差 ${e(r.ledgerAbs)}) / 全体の閉じ ${e(r.fullClosureAbs)} / ΔL_orb ${e(r.dLorb)}`);
console.log('⑤ 閉じた連星(J_z = L_orb + ΣS_z):');
for (const r of binRows) console.log(`   ${r.id.padEnd(20)} ψ₁ ${f(r.psi1FirstDeg, 3)}°→${f(r.psi1LastDeg, 3)}°`
  + ` / ψ₂ ${f(r.psi2FirstDeg, 3)}°→${f(r.psi2LastDeg, 3)}° / a=(${f(r.a1Last, 5)}, ${f(r.a2Last, 5)})`
  + ` / 連結線とのずれ (${f(r.alignGap1Deg, 3)}°, ${f(r.alignGap2Deg, 3)}°)`
  + ` / ΔL_orb ${e(r.dLorb)} / J_z 漂い ${e(r.worstJzRel)} / E 漂い ${e(r.worstErel)}`
  + ` / |S| 漂い ${e(r.worstSpinRel[0])} / 熱の減少步 ${r.heatDrops}/${r.heatSteps}`);
console.log('仮説の対応づけ(Failure First):');
for (const v of verdict) console.log(`   ${v.id} ${v.claim} → ${v.inModel}`);
console.log('→ tests/out/powerball-w275e.json');
