// 第350便d(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R421):
// **正本 tests/out/axisheat-350d.json から PHYSICS〔第350便d〕の表を作る文書の lib**
// (QA docs.axisheat350d が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 2 桁・共通の点検の数は小数 8 桁)。原文(言葉を変えずに引く —— 訂正の鎖は当時の文を消さずに並べる)もここに持つ。
export const DOC_VERSION = 'w350d-axisheatdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f8 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(8));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Earth: '地球', Venus: '金星', Io: 'イオ', Pluto: '冥王星', Sun: '太陽', Jupiter: '木星', Charon: 'カロン' });
const CAND = Object.freeze({ W: '(W)', P2: '(P2)' });
const JUDGE = Object.freeze({ grow: '増え続ける', flat: '頭打ち', none: '増えない' });
const BAL = Object.freeze({ none: '対照(歳差だけ —— θ 不変)', K1: '(K1)', K2: '(K2)' });
const RULE = Object.freeze({ P1: '(P1)', P0: '(P0)' });
const destName = (r) => (r.group === 'drag' ? `引きずり回転 ${'(' + r.col + ')'}` : r.h === 0 ? '慣性回転(h 0)' : r.h === 1 ? '内部熱(h 1)' : `間(h ${r.h})`);

/** 原文(言葉を変えずに引く —— 訂正の鎖: 補足 1 → 回答 8 → 回答 9 → 第146報) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸が動かなかった分のエネルギーは消えない。エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、軸を起こす為のトルクが増して釣り合う。行き先を「引きずり回転」とする比較も行う']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '引きずられる側の自転軸に直交する回転成分を、ジャイロトルクの計算に使用する。「トルク=慣性モーメント*自転速度*直交する回転成分」が、自転方向に90度ズレた力で現れる。結果的に自転軸を軸引きずりの回転軸に向けて起こす力になる。継続した自転軸を起こす力が歳差運動になる']),
  Object.freeze(['原仮定者の指示(2026-11-23 —— 第145報の補足 2)', '軸引きずりのエネルギーの行き先は、「慣性回転」と「引きずり回転」それぞれの比較を行う']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 9)', 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 8)', 'AN969: R1で進める。「自転速度が増すと、角運動量が増して、トルクが増す」に修正']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', 'エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、慣性モーメントが増して、トルクが増す']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['行き先の主の 2 列 = 内部熱(h)・慣性回転(a_in)、その間は h の格子。比べる列 = 引きずり回転 × (E1)(E2)(E3)。「釣り合う」の読みは (K1)(自転が増す → トルクが増す → 軸が起きる → Ω⊥ が減る → 供給が減る)', '表 3・表 4']),
  Object.freeze(['熱の出どころは引きずり(座標変換)そのものではなく、潮汐とジャイロトルクの経路に置く。直交のトルクは理想の形では自転に仕事をしない(歳差させるだけ)ので、「軸が動かなかった」だけでは熱の量は決まらない(統括の検証項目 R421)—— 供給の則を列 (P1)(P0) にして仮定を表に出す', '表 2・表 3 の (P0)']),
  Object.freeze(['トルクの大きさ = I × abs(ω_T) × abs(Ω⊥)(純関数 torqueMag)。既存の診断の供給の率 (P1) はトルクの大きさ × abs(Ω⊥)(仮定)', '表 2']),
  Object.freeze(['当時の文(〔第348便h〕の 2 列 —— 当時の表として残る)。本節では主の 2 列が内部熱・慣性回転、引きずり回転は比べる列', '表 3']),
  Object.freeze(['当時の文(〔第347便i〕のケース 1・ケース 2)。2 つ目の「傾きにくくなり釣り合う」の読みを (K2)(〔第347便i〕の (Ta)+(Tc) の型)とする', '表 4 の (K2)']),
  Object.freeze(['当時の文(訂正の鎖の 2 つ目 —— 消さずに並べる)', '—']),
  Object.freeze(['当時の文(訂正の鎖の 1 つ目 —— 消さずに並べる)', '—']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 帳簿の欄(各ステップ) */
export const LEDGER_TABLE = ['| 欄 | 中身 | 符号 |', '|---|---|---|',
  '| 供給 | 則 (P1) なら (1 − m) × トルクの大きさ × abs(Ω⊥) × Δt・(P0) なら 0(熱・自転の増し分とは別の欄に記録) | + |',
  '| 場との交換 | 軸が動いて引きずり回転 Ω∥ を新しい軸で作り直したときの、合成の自転の ½ I ω² の変わり | ± |',
  '| 場への返し | 引きずり回転に入った分を (E1) で場へ返した量 | − |',
  '| 回転エネルギーの増し分 | 合成の自転 ω = ω_I + ω_D の ½ I ω² の前後の差(平行成分の交差項を落とさない) | − |',
  '| 熱 | h × 供給(主の列)+ (E3) で熱にした量 | − |',
  '| 残差 | 上の 5 つの和(丸めの床 —— 二重に数える変異では残る) | = 0 |'].join('\n');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, C = S.cc;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① Ω⊥ = 0(θ 0)で熱 0・自転の増し 0(行き先 6 × 釣り合い方 3 の最大) | ${S.z1 < 1e-12 ? '< 1e-12' : fe(S.z1)} | ${tf(G.perpZero)} |`,
    `| ② 供給 0 の則 (P0) で熱 0・自転不変(行き先 6 の最大) | ${S.z2 < 1e-12 ? '< 1e-12' : fe(S.z2)} | ${tf(G.p0Zero)} |`,
    `| ③ 〔第348便h〕表 13 の例 fixed: 慣性回転だけ ・引きずり回転 + (E1)・(E3)・(E2) の ω(T) ÷ ω_慣性(0) | ${f3(S.r3.inertial)}・${f3(S.r3.dragE1)}・${f3(S.r3.dragE3)}・${f3(S.r3.dragE2)} | ${tf(G.ref348h)} |`,
    `| ④ 〔第348便b〕の stepRun((S1))と同じ式の同じ数(行き先 6) | ${S.b4 < 1e-12 ? '< 1e-12' : fe(S.b4)} | ${tf(G.vs348b)} |`,
    `| ⑤ 帳簿の残差(行き先 6 × 釣り合い方 3)/変異: リセットした分を熱と慣性回転の両方へ・熱の割合の分を慣性回転にも・場との交換を落とす | ${S.led < 1e-12 ? '< 1e-12' : fe(S.led)}/${fe(S.mledD)}・${fe(S.mledM)}・${fe(S.mledF)} | ${tf(G.ledger)} |`,
    `| ⑥ 逆自転の鏡映(ω_慣性(0) −1・θ₀ 140°)で自転が反転・熱が同じ | ${S.mir < 1e-12 ? '< 1e-12' : fe(S.mir)} | ${tf(G.mirror)} |`,
    `| ⑦ θ 固定の閉じた形との相対の差(10 万步) | ${fe(S.cf)} | ${tf(G.closedFixed)} |`,
    `| ⑧ (K1) の届く先と別の積み方(θ について RK4)の相対の差(m 0.5・h 0) | ${fe(S.k8)} | ${tf(G.closedK1)} |`,
    `| ⑨ torqueMag(I 1・ω_T 1・abs(Ω⊥) 1)・(I 2・ω_T −3・abs(Ω⊥) 0.5)・(P1)(ω_T 2・abs(Ω⊥) 0.5・m 0.25) | ${S.t9.join('・')} | ${tf(G.torque)} |`,
    `| ⑩ 共通の点検の数(統括の数え直し —— 下の文) | ${f8(C.dxZ)}・${f8(C.sixZ)}・${f8(C.wZ)} | ${tf(G.common)} |`,
    `| ⑪ 入力の拒否(割合の和・則・行き先・釣り合い方・m・ω 0・変異の名・負の I・NaN) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.supply = ['| 則 | 出どころ | 式 | 率(θ₀ 40°・ω = 1 + cos 40°) | (P1) の式との比 |', '|---|---|---|---|---|',
    ...J.supply.rows.map((r) => `| ${RULE[r.rule]} | ${r.where} | ${r.formula} | ${fe(r.rate)} | ${r.ratio === null ? '—' : f3(r.ratio)} |`)].join('\n');
  T.dest = ['| 則 | 行き先 | ω(T) ÷ ω_慣性(0) | ω_慣性(T) ÷ ω_慣性(0) | ω_引きずり(T) | 供給の仕事 | 熱 | 場へ返した分 | 回転エネルギーの増し分 | 熱 ÷ 供給 | 自転 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.dest.map((r) => `| ${RULE[r.rule]} | ${destName(r)} | ${f3(r.wRatio)} | ${f3(r.wiRatio)} | ${f3(r.wdEnd)} | ${fe(r.work)} | ${fe(r.heat)} | ${fe(r.given)} | ${fe(r.dE)} | ${f3(r.heatOverWork)} | ${JUDGE[r.judge]} |`)].join('\n');
  T.bal = ['| 釣り合い方 | 軸の応答 m | 熱の割合 h | ω(T) ÷ ω_慣性(0) | ω(2T) ÷ ω_慣性(0) | θ(T) [deg] | 熱(T) | 熱(2T) | トルクの比 | 自転 | 時定数 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.bal.map((r) => `| ${BAL[r.bal]} | ${r.m} | ${r.h} | ${f3(r.wRatio)} | ${f3(r.wRatio2T)} | ${f2(r.thEndDeg)} | ${fe(r.heat)} | ${fe(r.heat2T)} | ${fe(r.torqueRatio)} | ${JUDGE[r.judge]} | ${r.tau === null ? '—' : f2(r.tau)} |`)].join('\n');
  T.body = ['| 天体 | 源 | 候補 | Ω∥ [rad/s] | Ω⊥ [rad/s] | 角 θ | 引きずり回転 ÷ ω | トルクの大きさ [N m] | 内部熱(h 1)[W] | 慣性回転(h 0): 自転の大きさの増え方 [1/年] | 間(h 0.5): 熱 [W]・増え方 [1/年] | 引きずり回転 (E1): 場へ返す [W] | (E2): 増え方 [1/年] | (E3): 熱 [W] | (P0) | 物差しの熱 [W](文献の値・未照合) | 観測の自転の変化の率 [1/年](文献の値・未照合) |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.map((r) => { const c = r.cols;
      return `| ${NM[r.id]} | ${NM[r.src]} | ${CAND[r.cand]} | ${fe(r.Wpar)} | ${fe(r.Wperp)} | ${f2(r.thetaDeg)} | ${fe(r.dragOverW)} | ${fe(r.torque)} | ${fe(c.heat.heatW)} | ${fe(c.inertial.rateYr)} | ${fe(c.half.heatW)}・${fe(c.half.rateYr)} | ${fe(c.dragE1.givenW)} | ${fe(c.dragE2.rateYr)} | ${fe(c.dragE3.heatW)} | 0 | ${fe(r.heatRuler)} | ${fe(r.obsRateYr)} |`; })].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, S = J.pure.scenes, C = S.cc, d = (rule, group, h, col) => J.dest.find((r) => r.rule === rule && r.group === group && r.h === h && r.col === col);
  F.ref = `例 fixed(θ₀ 40°・m 0・T 50・1 万步)で、行き先を慣性回転だけにすると ω(T) ÷ ω_慣性(0) = ${f3(S.r3.inertial)}・引きずり回転 + (E1)・(E3) で ${f3(S.r3.dragE1)}(〔第348便h〕表 13 の ${f3(J.decl.ref348h.inertial)} 倍・${f3(J.decl.ref348h.drag)} 倍と同じ数)`;
  F.heat = `同じ例で内部熱(h 1)は自転を変えず(${f3(d('P1', 'main', 1, 'E1').wRatio)} 倍 —— 引きずり回転の分 cos 40° だけ)、熱の総量は ${fe(d('P1', 'main', 1, 'E1').heat)}(慣性回転 h 0 の供給の仕事 ${fe(d('P1', 'main', 0, 'E1').work)} より小さい —— 供給 (P1) が自転に比例するため)。供給 0 の則 (P0) ではどの行き先でも熱 0・自転不変`;
  const k = (bal, m, h) => J.bal.find((r) => r.bal === bal && r.m === m && r.h === h), K1 = J.bal.filter((r) => r.bal === 'K1' && r.m > 0), K2 = J.bal.filter((r) => r.bal === 'K2' && r.m > 0);
  F.bal = `軸の応答 m > 0 では (K1)・(K2) とも軸が起きて頭打ち(ω(T) ÷ ω_慣性(0) は (K1) ${f3(Math.min(...K1.map((r) => r.wRatio)))}〜${f3(Math.max(...K1.map((r) => r.wRatio)))}・(K2) ${f3(Math.min(...K2.map((r) => r.wRatio)))}〜${f3(Math.max(...K2.map((r) => r.wRatio)))}・時定数 (K1) ${f2(Math.min(...K1.map((r) => r.tau)))}〜${f2(Math.max(...K1.map((r) => r.tau)))}・(K2) ${f2(Math.min(...K2.map((r) => r.tau)))}〜${f2(Math.max(...K2.map((r) => r.tau)))})。対照(歳差だけ)の m 0.5・h 0.5 は ${f3(k('none', 0.5, 0.5).wRatio)} 倍で増え続ける`;
  F.field = `m 1(供給 0)でも軸が起きると ω(T) ÷ ω_慣性(0) = ${f3(k('K1', 1, 0).wRatio)}(引きずり回転 Ω∥ が cos 40° から 1 へ —— 帳簿の「場との交換」の欄)`;
  const e = J.body.find((r) => r.id === 'Earth' && r.cand === 'W');
  F.earth = `地球(在位の形の場の (W)・(P1)・h 1)の熱の率 ${fe(e.cols.heat.heatW)} W(物差しの熱 ${fe(e.heatRuler)} W の ${fe(e.cols.heat.heatW / e.heatRuler)} 倍)・慣性回転(h 0)の自転の大きさの増え方 ${fe(e.cols.inertial.rateYr)}/年(観測の自転の変化の率 ${fe(e.obsRateYr)}/年 —— 符号も逆)`;
  F.common = `共通の点検の数(本節の lib で出た値): x の向きの直径の 2 点の差分の z 成分 ${f8(C.dxZ)}・直交 3 直径の 6 点の平均の z 成分 ${f8(C.sixZ)}・中心の渦度の半分 \`rot3('W')\` の z 成分 ${f8(C.wZ)}。通過の向きの反転で符号が反転・中心線の向きの通過と相対静止と自分の重みも背景も 0 は 0・同じ速度 (3,−2,1) を足しても不変・剛体回転 (1,2,3) × r は 6 点の平均で (1,2,3)・x の直径で (0,2,3)・純粋なずれ (y,x,0) は x の直径で +1・6 点の平均で 0`;
  F.torque = `torqueMag の点検: 軸が固定・I 1・ω_T 1・abs(Ω⊥) 1 のトルクの大きさ ${S.t9[0]}`;
  return F;
}
