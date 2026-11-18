// 第342便e(原仮定者の回答(2026-11-18 —— 第141報の回答 AN803)・統括の検証項目 R376): **正本 tests/out/powerball-342e.json から PHYSICS〔第342便e〕の表を作る文書の lib**
// (QA docs.powerball342e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの残りは書かない)。
export const DOC_VERSION = 'w342e-powerballdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const NM = Object.freeze({ Io: 'イオ', Charon: 'カロン', Pluto: '冥王星', Venus: '金星', Earth: '地球', Jupiter: '木星', Mars: '火星', Sun: '太陽', galaxy: '銀河' });
const SP = Object.freeze({ const: '(s1) 一定の割合 η', ratio: '(s2) 周期の比 g', lag: '(s3) 位相の遅れ δ' });
const LW = Object.freeze({ sin: 'sin の型', sin2: '2 倍角の形', oneMinusCos: '角の差の型' });
const CB = Object.freeze({ one: '1', bal: '釣り合いの読み', spd: '速さの一致の読み' });
const KP = Object.freeze({ one: '1', kLo: '下限', kHi: '上限' });
const SG = Object.freeze({ rev: 'rev(逆回転の軸)', fwd: 'fwd(源の自転の軸)' });
const kn = (sp, k) => (sp === 'lag' ? fe(k) + ' rad' : sp === 'ratio' ? fe(k) : String(k));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 駆動 0(向ける力 0): 天体 7 の熱・増し分・動いた分・要る角運動量の率・保つ仕事率が全部 0 | ${tf(S.z1.allZero)} | ${tf(G.driveZero)} |`,
    `| ② 理想のジャイロ(μ = 1 —— 全部動いた分): 熱 0・増し分 0 の組の数・トルク・角速度 ÷ 尺度(歳差の軸のまわり) | ${S.z2.n}・${lt(S.z2.powerRel, 1e-12)} | ${tf(G.idealGyro)} |`,
    `| ③ η = 0 で第341便f と同じ(μ 3 点と結びつきの係数の試しの熱 —— 天体 6): 組の数・相対の差の最大 | ${S.z3.n}・${lt(S.z3.worst, 1e-12)} | ${tf(G.sameAs341f)} |`,
    `| ④ 帳簿の恒等式(保つ仕事率 = 動いた分 + 熱 + 増し分 + 残り)の残り ÷ 保つ仕事率の最大 | ${lt(S.z4.worstResidRel, 1e-12)} | ${tf(G.energyIdentity)} |`,
    `| ⑤ sin の型の 2 つの軸の合成(Σ a_j ŝ × t̂_j = ŝ × A)の差 ÷ 尺度 | ${lt(S.z5.combRel, 1e-12)} | ${tf(G.sinCombine)} |`,
    `| ⑥ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`,
    `| ⑦ 分け方の端(η = 1 で熱・η = 0 で増し分・g = 0 の η・δ = π/2 の η) | ${S.ends.e1}・${S.ends.e0}・${S.ends.r0}・${f3(S.ends.lagHalfPi)} | ${tf(G.ends)} |`].join('\n');
  T.t1 = ['| 天体 | 分け方 | ノブ | η | 熱 [W](潮汐 + 熱の出口) | ÷ 物差し | 自転の速さの増加の率 [1/年] | × 太陽系の年齢 |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.filter((r) => ['Jupiter', 'Venus', 'Io'].includes(r.id)).map((r) => `| ${NM[r.id]} | ${SP[r.split]} | ${kn(r.split, r.knob)} | ${fe(r.eta)} | ${fe(r.heat)} | ${fe(r.heatOverRuler)} | ${fe(r.spinRateYr)} | ${fe(r.overAge)} |`)].join('\n');
  T.t2 = ['| 則 | C_b の読み | k_tilt | 木星の熱 ÷ 物差し | 金星の熱 ÷ 上限の目安 | イオの熱 ÷ 観測 | 木星の歳差の周期 [年] |', '|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => { const p = (id) => (r.per[id] ? fe(r.per[id].overRuler) : '値が無い'); return `| ${LW[r.law]} | ${CB[r.cb]} | ${KP[r.k]} | ${p('Jupiter')} | ${p('Venus')} | ${p('Io')} | ${r.per.Jupiter ? fe(r.per.Jupiter.precPeriodYr) : '—'} |`; })].join('\n');
  T.t3 = ['| 天体 | 主星 | 潮汐の熱 [W] | 動かなかった分 [W] | 熱の上限(η = 0)÷ 物差し | 歳差の周期 [年] | (s2) の η(g 1・1e3・1e6) | 増加の率の上限(η = 1)[1/年] | × 年齢 | 要る τ∥ [N·m](= 向ける力だけの残り) | τ∥ ÷ 平行の分 | 使い切る時間 [年](源の自転・軌道・自分の自転) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${NM[r.id]} | ${NM[r.host] || r.host} | ${fe(r.tide)} | ${fe(r.Pun)} | ${fe(r.heatMaxOverRuler)} | ${fe(r.precPeriodYr)} | ${r.etaRatio.map(fe).join('・')} | ${fe(r.spinRateYrMax)} | ${fe(r.overAgeMax)} | ${fe(r.residLMax)} | ${fe(r.tauOverNpar)} | ${fe(r.tSrcYr)}・${fe(r.tOrbYr)}・${fe(r.tSelfYr)} |`)].join('\n');
  const W = J.win.filter((w) => !w.outside), Wo = J.win.filter((w) => w.outside);
  T.win = ['| 則 | C_b の読み | 分け方 | ノブ | イオの上限 X | 木星に要る下限 X | 下限 ÷ 上限 | 下限 ÷ 帯の上端² | イオと木星(k_tilt 自由)| 3 つ(k_tilt 1) | 金星(下限で)÷ 上限の目安 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...W.map((w) => `| ${LW[w.law]} | ${CB[w.cb]} | ${SP[w.split]} | ${kn(w.split, w.knob)} | ${fe(w.cap)} | ${fe(w.need)} | ${fe(w.needOverCap)} | ${fe(w.needOverBand)} | ${tf(w.openKfree)} | ${tf(w.openK1)} | ${fe(w.venusAtNeedOverRuler)} |`),
    `| 窓の外の行 | — | — | — | — | — | — | — | — | — | ${Wo.length}(η = 1 —— 熱 0: ${Wo.filter((w) => w.outside.indexOf('η = 1') === 0).length}・係数の値が無い: ${Wo.filter((w) => w.outside === '係数の値が無い').length}) |`].join('\n');
  T.t4 = ['| 天体 | 向ける先の軸の符号 | 則 | 軸のなす角(太陽・銀河)[deg] | 太陽と銀河の軸のなす角 [deg] | 大きさの比 a_銀河/a_太陽 | 熱の上限 ÷ 物差し(太陽だけ・銀河だけ・両方) | 歳差の周期 [年](太陽だけ・両方) | 両方 ÷ 太陽だけ − 1(交差の項 + 銀河の取り分) | 銀河の取り分 | 太陽の軸へ向け切った所で残るトルク ÷ 今の太陽のトルク | 実効の軸のずれ [deg](sin の型) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t4.map((r) => { const s = (k) => r.sets.find((q) => q.set === k);
      return `| ${NM[r.id]} | ${SG[r.sign]} | ${LW[r.law]} | ${f3(r.thetaSunDeg)}・${f3(r.thetaGalDeg)} | ${f3(r.sunGalDeg)} | ${fe(r.aRatio)} | ${fe(s('sun').overRuler)}・${fe(s('galaxy').overRuler)}・${fe(s('both').overRuler)} | ${fe(s('sun').precPeriodYr)}・${fe(s('both').precPeriodYr)} | ${fe(r.bothOverSunMinus1)} | ${fe(r.galShare)} | ${fe(r.leftOverSun)} | ${fe(r.aeffShiftDeg)} |`; })].join('\n');
  return T;
}
