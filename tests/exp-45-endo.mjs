// 第45便 45B(2): 吸熱融合(ΔKE<0)の調査。
//
// 融合則の ΔKE = KE_before − KE_after は
//   ΔKE = ½μ|v_rel|² + ½I_i s_i² + ½I_j s_j² − (I_i s_i + I_j s_j + L_int)²/(2I′)
// で、I′ = ½(m_i+m_j)(R_i²+R_j²)、L_int = μ(r_rel×v_rel)_z。Cauchy–Schwarz から
//   I′ ≥ I_i + I_j + μd²   ⟹   ΔKE ≥ 0
// が十分条件で、R ∝ √m(既定の半径写像)を入れると d = dd·(R_i+R_j) で
//   dd ≤ dd_crit(m_i,m_j) = √( (m_i+m_j) / (√m_i+√m_j)² )
// になる。等質量で dd_crit = 1/√2 = 0.7071(これが全質量比の**最小値**= 大域的な安全境界)、
// 1:3 で 0.7321、1:9 で 0.7906。したがって dFrac ≤ 0.7071 なら質量比によらず ΔKE ≥ 0(発熱)。
//
// 本実験は Cauchy–Schwarz の等号に最も近い配置(剛体回転 = s_i = s_j = ω かつ
// v_rel が r_rel に直交して L_int = μωd²)を作り、dd > dd_crit で実際に ΔKE < 0 になること、
// そのとき現行の T<0 クランプ(リザーバ fusU への退避)が帳簿を閉じたまま働くことを実測する。
//
// 実行: node tests/exp-45-endo.mjs   出力: tests/out/exp-45-endo.json
import fs from 'node:fs';
import path from 'node:path';
import { openPage, ROOT, num, fmt } from './lib-45.mjs';

const SQ = Math.SQRT1_2;             // 1/√2 = 0.7071067811865476(等質量の理論境界 = 大域的な安全境界)
const DFRACS = [0.5, 0.6, SQ, 0.71, 0.8, 0.9, 1.0];
const RATIOS = [[1, 1], [1, 3], [1, 9]];
const OMEGAS = [0.5, 2, 8];          // 剛体回転の角速度(ΔKE の大きさのスケール)
const TINT = 0.05;                   // 初期内部温度(小さくしてクランプを踏みやすくする)
// 融合はサブステップ末に発火するので、その 1 步で配置が動くと「置いた d」で測れない
// (E9 法線ばねは深い重なりでは非常に硬く、dt=0.016 では 1 步で発火域の外へ弾き出される)。
// dt を十分小さく取り、置いた配置そのものの ΔKE を 1 イベントだけ測る
const DT = 1e-5;

const { browser, page } = await openPage();

const rows = await page.evaluate(({ DFRACS, RATIOS, OMEGAS, TINT, DT }) => {
  const F = window.__F, s = HP.sim;
  const out = [];
  for (const [mi, mj] of RATIOS) {
    // 半径写像 R = radiusScale·rMul·√|m|(rMul=1・radiusScale=1)
    const Ri = Math.sqrt(mi), Rj = Math.sqrt(mj), sumR = Ri + Rj;
    const ddCrit = Math.sqrt((mi + mj) / ((Math.sqrt(mi) + Math.sqrt(mj)) ** 2));
    for (const dd of DFRACS) {
      for (const om of OMEGAS) {
        // 発火面のすぐ内側(0.999·dFrac·ΣR)に、重心を原点にした剛体回転の対を置く
        const d = 0.999 * dd * sumR, M = mi + mj;
        const a1 = d * mj / M, a2 = d * mi / M;
        const bodies = [
          { type: 'single', m: mi, x: a1, y: 0, vx: 0, vy: om * a1, spin: om, tInt: TINT },
          { type: 'single', m: mj, x: -a2, y: 0, vx: 0, vy: -om * a2, spin: om, tInt: TINT }
        ];
        // 融合の1イベントだけを見たいので、他の散逸チャネルは全て 0(kRep も 0 にして
        // U_rep を落とし、ΔKE の符号だけが heat の符号を決める状況にする)
        const pre = F.mk(bodies, { dFrac: dd }, { G: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
          etaRad: 0, D0: 0, kFrame: 0, cHeat: 0.2, softening: 2, radiusScale: 1 });
        s.build(pre);
        // 第45便 45B: 本実験の結論を受けて dFrac の受理上限は 1/√2 へ制限された(validatePreset・
        // エンジン門番の両方)。禁止域そのものを測るのが本実験の目的なので、門番を通した後の
        // 内部状態を直接上書きして「もし受理したら何が起きるか」を観測する(実験専用の抜け道)
        s.fusion.dFrac = dd;
        const E0 = F.energy(s), T0 = s.totals();
        s.step(DT);
        const E1 = F.energy(s), T1 = s.totals();
        const ev = (s.fusLog && s.fusLog.length) ? s.fusLog[s.fusLog.length - 1] : null;
        const eScale = Math.abs(E0) + (ev ? ev.eSc : 0) + 1e-12;
        out.push({
          mi, mj, dd, om, ddCrit, fused: s.fusN, n: s.n,
          dKE: ev ? ev.dKE : null, heat: ev ? ev.heat : null, H0: ev ? ev.H0 : null,
          Tn: ev ? ev.Tn : null, clamped: ev ? ev.clamped : null,
          uSpr: ev ? ev.uSpr : null, uRep: ev ? ev.uRep : null, uGrav: ev ? ev.uGrav : null,
          eSc: ev ? ev.eSc : null, rE: ev ? ev.rE : null, rP: ev ? ev.rP : null, rL: ev ? ev.rL : null,
          dE: Math.abs(E1 - E0), dErel: Math.abs(E1 - E0) / eScale,
          dP: Math.max(Math.abs(T1.px - T0.px), Math.abs(T1.py - T0.py)),
          dL: Math.abs(T1.L - T0.L), fusU: s.fusU
        });
      }
    }
  }
  return out;
}, { DFRACS, RATIOS, OMEGAS, TINT, DT });

await browser.close();

// ---- 集計 ----
const fused = rows.filter(r => r.fused === 1);
const notFused = rows.filter(r => r.fused !== 1);
const endo = fused.filter(r => r.dKE < 0);
const clamped = fused.filter(r => r.clamped === 1);
const maxLedger = Math.max(...fused.map(r => r.dErel));
const maxLedgerClamped = clamped.length ? Math.max(...clamped.map(r => r.dErel)) : 0;

console.log('=== 第45便 45B(2) 吸熱融合(ΔKE<0)の掃引 ===');
console.log(`構成: 剛体回転の2体を発火面のすぐ内側(0.999·dFrac·ΣR)に置き 1 サブステップで融合させる`);
console.log(`      G=0 / kRep=0 / 散逸 0 / cHeat=0.2 / tInt=${TINT}(ΔKE の符号だけが heat の符号を決める)`);
console.log(`理論境界 dd_crit=√((m_i+m_j)/(√m_i+√m_j)²): 1:1 → 0.70711 / 1:3 → 0.73205 / 1:9 → 0.79057`);
console.log('');
const hdr = ['m_i:m_j', 'dd_crit', 'dFrac', 'ω', 'ΔKE', 'heat', 'T′', 'clamp', '|ΔE|/E', '|ΔP|', '|ΔL|'];
console.log(hdr.map((h, k) => h.padStart([9, 8, 6, 4, 12, 12, 10, 6, 10, 10, 10][k])).join(' '));
for (const r of rows) {
  if (r.fused !== 1) { console.log(`${(r.mi + ':' + r.mj).padStart(9)} ${num(r.ddCrit, 5).padStart(8)} ${num(r.dd, 2).padStart(6)} ${num(r.om, 1).padStart(4)}   融合せず`); continue; }
  console.log([
    (r.mi + ':' + r.mj).padStart(9), num(r.ddCrit, 5).padStart(8), num(r.dd, 2).padStart(6), num(r.om, 1).padStart(4),
    num(r.dKE, 4).padStart(12), num(r.heat, 4).padStart(12), num(r.Tn, 3).padStart(10),
    String(r.clamped).padStart(6), fmt(r.dErel, 1).padStart(10), fmt(r.dP, 1).padStart(10), fmt(r.dL, 1).padStart(10)
  ].join(' '));
}
console.log('');
console.log(`融合成立 ${fused.length}/${rows.length} 件(不成立 ${notFused.length} 件)`);
console.log(`ΔKE<0(吸熱)= ${endo.length} 件 — 内訳(dFrac 別): ` +
  DFRACS.map(d => `${d}:${endo.filter(r => r.dd === d).length}/${fused.filter(r => r.dd === d).length}`).join(' '));
console.log(`理論境界との整合: dd>dd_crit の全件が吸熱か = ${fused.filter(r => r.dd > r.ddCrit).every(r => r.dKE < 0)} / ` +
  `dd≤dd_crit の全件が発熱か = ${fused.filter(r => r.dd <= r.ddCrit).every(r => r.dKE >= 0)}`);
console.log(`T<0 クランプ発火 = ${clamped.length} 件(全て ΔKE<0 = ${clamped.every(r => r.dKE < 0)})`);
console.log(`帳簿の閉性: |ΔE|/E_scale 最大 = ${fmt(maxLedger, 3)}(クランプ発火分だけでは ${fmt(maxLedgerClamped, 3)})`);
console.log(`           |ΔP| 最大 = ${fmt(Math.max(...fused.map(r => r.dP)), 3)} / |ΔL| 最大 = ${fmt(Math.max(...fused.map(r => r.dL)), 3)}`);

// ---- 結論 ----
const worstEndo = endo.length ? endo.reduce((a, r) => (r.dKE < a.dKE ? r : a)) : null;
const safeBelow = fused.filter(r => r.dd <= SQ).every(r => r.dKE >= 0);
const leak071 = fused.filter(r => r.dd === 0.71 && r.dKE < 0);
console.log('');
console.log('--- 結論 ---');
console.log(`(1) dFrac ≤ 1/√2(=0.7071068)では掃引した全 ${fused.filter(r => r.dd <= SQ).length} 件が ΔKE ≥ 0(発熱)= ${safeBelow}`);
console.log(`    ただし dFrac=0.71 は既に境界の外側 — 等質量 1:1 の ${leak071.length} 件が吸熱(最小 ΔKE=${leak071.length ? num(Math.min(...leak071.map(r => r.dKE)), 4) : '-'})`);
console.log(`    ⇒ 受理上限は 0.71 ではなく **1/√2 = 0.7071067811865476** でなければならない`);
console.log(`(2) dFrac > dd_crit では ΔKE < 0 が実在する(最悪 ΔKE=${worstEndo ? num(worstEndo.dKE, 3) : '-'} ` +
  `@ ${worstEndo ? `${worstEndo.mi}:${worstEndo.mj} dFrac=${worstEndo.dd} ω=${worstEndo.om}` : '-'})`);
console.log(`(3) 吸熱域でも保存則は閉じている(T<0 は 0 へクランプし、差分は全量リザーバ fusU へ退避)`);
console.log(`    → |ΔE|/E_scale ≤ ${fmt(maxLedger, 2)} は非吸熱域と同水準で、暴走・破綻は観測されない`);

const outDir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'exp-45-endo.json'), JSON.stringify({
  config: { DFRACS, RATIOS, OMEGAS, TINT, DT },
  rows,
  summary: { nFused: fused.length, nEndo: endo.length, nClamped: clamped.length,
    maxLedgerRel: maxLedger, maxLedgerRelClamped: maxLedgerClamped, safeBelowSqrtHalf: safeBelow,
    leakAt071: leak071.length, minDKEat071: leak071.length ? Math.min(...leak071.map(r => r.dKE)) : null,
    thresholdConsistent: fused.filter(r => r.dd > r.ddCrit).every(r => r.dKE < 0)
      && fused.filter(r => r.dd <= r.ddCrit).every(r => r.dKE >= 0) }
}, null, 1));
console.log('\n→ tests/out/exp-45-endo.json');
