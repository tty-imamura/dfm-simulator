// 第343便e(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN843・AN844・統括の検証項目 R382): **正本 tests/out/spintransfer-343e.json から PHYSICS〔第343便e〕の表を作る文書の lib**
// (QA docs.spintransfer343e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの残りは書かない)。
export const DOC_VERSION = 'w343e-spintransferdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const NM = Object.freeze({ Io: 'イオ', Charon: 'カロン', Pluto: '冥王星', Venus: '金星', Earth: '地球', Jupiter: '木星', Mars: '火星', Sun: '太陽', galaxy: '銀河' });
const MG = Object.freeze({ m1: '(m1) 軸引きずりの率', m2: '(m2) 源の自転の速さ' });
const PT = Object.freeze({ P1: '(P1) 内部の軸 h', P2: '(P2) 向ける力', P3: '(P3) 散逸のトルク' });
const HD = Object.freeze({ spin: '自転の軸', inPlane: '目標の面の内', normal: '目標の面に垂直' });
const LW = Object.freeze({ k1: '単純な角の差', k2: '符号つきの 2 倍角', abs2: '第342便e の型(2 倍角の絶対値 × 外積の向き)' });
const DR = Object.freeze({ slower: '遅い側', faster: '速い側', same: '同じ' });
const PL = Object.freeze({ ecl: '黄道の極', inv: '不変面の極' });
const ts = (x) => (x === true ? '遅い側' : x === false ? '速い側' : '同じ');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 例(Ω_s = (1, 0, 0)・Ω_r = (0, 0, 1)・h = (0, −1, 0)・k = 1): トルク・受け手の仕事率・源の仕事率・総トルク・総仕事率 | (${S.example.T.join(', ')})・${S.example.recv}・${S.example.src}・${S.example.totT}・${S.example.totP} | ${tf(G.example)} |`,
    `| ② (P1) 総トルク 0・総仕事率 0・帳簿の残り(3 組)÷ 尺度の最大 | ${lt(S.p1.totRel, 1e-12)}・${lt(S.p1.residRel, 1e-12)} | ${tf(G.p1Conserve)} |`,
    `| ③ (P1) h が自転の軸と同じなら自転の仕事率 0(÷ 尺度) | ${lt(S.p1.hSpinRel, 1e-12)} | ${tf(G.hAlongSpin)} |`,
    `| ④ (P2) 向ける力の自転の仕事率 0(÷ 尺度) | ${lt(S.p2.powerRel, 1e-12)} | ${tf(G.p2NoPower)} |`,
    `| ⑤ (P3) 熱 ≥ 0 の組・供給 = 自転の仕事 + 熱 と 熱 = c abs(Δ)² の差 ÷ 尺度 | 負の熱 ${S.p3.negHeat}・${lt(S.p3.balRel, 1e-12)} | ${tf(G.p3Heat)} |`,
    `| ⑥ 駆動 0(k = 0)で 3 型とも全部 0 | ${tf(S.driveZero)} | ${tf(G.driveZero)} |`,
    `| ⑦ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 天体 | 源 | 目標の回転の大きさの読み | 目標の軸と今の自転の軸の角 [deg](rev) | 目標の回転 ÷ 今の自転 | 自転の向きの差 Δ∥ ÷ 今の自転 | 目標は | (P3) の緩和の時間 [年](基準の尺度) |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.filter((r) => r.sign === 'rev').map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${MG[r.mag]} | ${f3(r.thetaTargetDeg)} | ${fe(r.OtOverOmega)} | ${fe(r.dParOverOmega)} | ${ts(r.towardSlower)} | ${fe(r.relaxYrP3)} |`)].join('\n');
  T.path = ['| 天体 | 目標の回転の大きさの読み | 経路の型 | h の向き | 自転の速さの変化の率 [1/年] | 軸の倒れの率 [rad/年] | 供給 [W] | 自転の仕事 [W] | 軌道の仕事 [W] | 熱 [W] | 残り [W] | 総トルク [N·m] |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.path.map((r) => `| ${NM[r.id]}(${NM[r.src]}) | ${MG[r.mag]} | ${PT[r.path]} | ${r.h ? HD[r.h] : '—'} | ${fe(r.spinRateYr)} | ${fe(r.tiltRateYr)} | ${fe(r.supply)} | ${fe(r.spinW)} | ${fe(r.orbitW)} | ${fe(r.heat)} | ${fe(r.resid)} | ${fe(r.totT)} |`)].join('\n');
  T.t2 = ['| 天体 | 源 | 目標の回転の大きさの読み | 第342便e の残り τ∥ の上限 [N·m] | 変化の率 [1/年](÷ 今の自転) | 目標の自転の向きの成分 ÷ 今の自転 | 目標は | 届くまでの時間 [年] | ÷ 太陽系の年齢 | (P3) の緩和の時間 ÷ 年齢 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${NM[r.id]}${r.retro ? '(逆行)' : ''} | ${NM[r.src]} | ${MG[r.mag]} | ${fe(r.tauPar)} | ${fe(r.rateYr)} | ${fe(r.targetParOverOmega)} | ${DR[r.direction]} | ${fe(r.reachYr)} | ${fe(r.reachOverAge)} | ${fe(r.relaxOverAge)} |`)].join('\n');
  T.win = ['| 目標の回転の大きさの読み | 向ける先の符号 | 木星の熱 ÷ 物差し(基準の尺度) | イオの熱 ÷ 観測 | 金星の熱 ÷ 上限の目安 | イオの上限 X | 木星に要る下限 X | 下限 ÷ 上限 | 帯の上端の X | 帯の下端の X | イオと木星(尺度自由) | 帯の上端まで | 帯の両端 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.win.map((w) => `| ${MG[w.mag]} | ${w.sign} | ${fe(w.juOverRuler)} | ${fe(w.ioOverObs)} | ${fe(w.venusOverRuler)} | ${fe(w.capX)} | ${fe(w.needX)} | ${fe(w.needOverCap)} | ${fe(w.bandX)} | ${fe(w.bandLoX)} | ${tf(w.openKfree)} | ${tf(w.openK1)} | ${tf(w.openBandBoth)} |`)].join('\n');
  const grid = J.decl.thetaGrid;
  T.t3 = [`| 則の型 | 銀河の向ける先 | ${grid.map((t) => 'θ = ' + t + '°').join(' | ')} | 120° の傾き dR/dθ | 120° で正の重み | 120° の緩和の型の安定 |`, '|---|---|' + grid.map(() => '---|').join('') + '---|---|---|',
    ...J.decl.laws.flatMap((law) => J.decl.galPlace.map((g) => { const rs = grid.map((t) => J.t3.find((r) => r.law === law && r.gal === g && r.thetaDeg === t)), r0 = rs[grid.indexOf(J.decl.balDeg)];
      return `| ${LW[law]} | ${g}° | ${rs.map((r) => fe(r.ratio)).join(' | ')} | ${fe(r0.slope)} | ${tf(r0.positive)} | ${tf(r0.stableRelax)} |`; }))].join('\n');
  T.side = ['| 並べる量(合わせない) | 値 |', '|---|---|',
    `| 金星で釣り合う比 ρ_V(第340便f —— 銀河の項 ÷ 主星の項の係数・読み ${J.t3side.rhoVreading}) | ${fe(J.t3side.rhoV)} |`,
    `| 第342便e の大きさの比 a_銀河/a_太陽(木星・金星) | ${fe(J.t3side.aRatioJupiter)}・${fe(J.t3side.aRatioVenus)} |`,
    `| 2 分で戻した角と置いた角の差の最大 [deg] | ${J.t3.every((r) => r.backErrDeg === null || r.backErrDeg === 0) ? '0' : '—'} |`].join('\n');
  const A = J.t4.angles;
  T.t4a = ['| 2 つの向き | 角 [deg] |', '|---|---|', `| 銀河の回転のベクトルと太陽の自転の軸 | ${f3(A.GS)} |`, `| 銀河の回転のベクトルと黄道の極 | ${f3(A.GE)} |`, `| 太陽の自転の軸と黄道の極 | ${f3(A.SE)} |`,
    `| 銀河の回転のベクトルと不変面の極 | ${f3(A.GInv)} |`, `| 太陽の自転の軸と不変面の極 | ${f3(A.SInv)} |`, `| 黄道の極と不変面の極 | ${f3(A.EInv)} |`].join('\n');
  T.t4 = ['| 極 | 銀河の向ける先 | 則の型 | 接平面の 2 つの寄せる向きのずれ [deg] | 極と銀河の向ける先の角 [deg] | 極と太陽の軸の角 [deg] | 比(T3 の 120°) | 残る成分 ÷ 太陽の項 | 比を自由にしたときの最小 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => `| ${PL[r.pole]} | ${r.gal}° | ${LW[r.law]} | ${f3(r.sepDeg)} | ${f3(r.thetaGDeg)} | ${f3(r.thetaSDeg)} | ${fe(r.rho)} | ${fe(r.residOverSun)} | ${fe(r.minResidOverSun)} |`)].join('\n');
  T.t5 = ['| 第342便e の表 | 天体 | 数えた角 [deg] | 入れ替えた角 [deg] | 入れ替えの効き |', '|---|---|---|---|---|',
    ...J.t5.map((r) => r.table === '342e-T3'
      ? `| T3(銀河の向ける先の角 —— 第341便f と同じ) | ${NM[r.id]} | ${f3(r.angleUsedDeg)} | ${f3(r.altDeg)} | 銀河のトルク × ${f3(r.galTorqueRatio)}・銀河の取り分 ${fe(r.galShareUsed)} → 変化 ${fe(r.relChange)}(保つ仕事率に対して) |`
      : `| T4(太陽の向ける先 = 太陽の自転の軸) | ${NM[r.id]} | ${f3(r.angleUsedDeg)} | ${f3(r.altDeg)}(黄道の極) | 両方 ÷ 太陽だけ − 1: ${fe(r.usedBothMinus1)} → ${fe(r.altBothMinus1)} |`)].join('\n');
  return T;
}
