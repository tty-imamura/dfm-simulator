// 第347便i(原仮定者の回答(2026-11-22 —— 第145報の回答 8)・原仮定者の回答(2026-11-22 —— 第145報の回答 9)・統括の検証項目 R408):
// **正本 tests/out/axisenergy-347i.json から PHYSICS〔第347便i〕の表を作る文書の lib**
// (QA docs.axisenergy347i が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの残りは指数)。原文(言葉を変えずに引く —— 全角の数字もそのまま)もここに持つ。
export const DOC_VERSION = 'w347i-axisenergydoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const tq = (r) => (r.torqueRatio !== null && r.torqueRatio < 1e-3 ? '0 へ' : r.torqueFlat ? '頭打ち' : '増え続ける');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x ? '成り立つ' : '成り立たない');
const WJ = Object.freeze({ flat: '頭打ち', grow: '増え続ける', none: '増えない' });
const NM = Object.freeze({ Earth: '地球', Venus: '金星', Io: 'イオ', Pluto: '冥王星', Sun: '太陽', Jupiter: '木星', Charon: 'カロン' });
const BAL = Object.freeze({ none: '(なし)', Ta: '(Ta)', Tbm: '(Tb−)', Tbp: '(Tb+)', Tbc: '(Tbc)', Tc: '(Tc)', TaTc: '(Ta)+(Tc)' });
const RET = Object.freeze({ field: '場へ返す', heat: '熱' });
const ORD = Object.freeze({ yes: '成り立つ', no: '成り立たない', knob: 'ノブ次第(上限 ω_c のノブで釣り合う —— 傾きにくくはならない)' });

/** 原文(訂正の鎖 —— 当時の文を消さずに並べる。言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '引きずられる側の自転軸と平行な回転成分は、自転の「引きずり回転」に計上する']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', 'エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、慣性モーメントが増して、トルクが増す']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 8)', 'AN969: R1で進める。「自転速度が増すと、角運動量が増して、トルクが増す」に修正']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 9)', 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えたこと] */
export const READINGS = Object.freeze([
  Object.freeze(['自転 = 慣性回転 + 引きずり回転の帳簿(〔第347便h〕表 11・表 12)。軸引きずりの回転の平行な成分 Ω∥ が引きずり回転の側', '(D3) の戻る先の値 Ω∥'] ),
  Object.freeze(['当時の文(〔第347便h〕表 1 の 9 行目 —— 消さずに残す)。行き先 2 列・最後の文の読み (R1)・(R2)', '〔第347便h〕表 15']),
  Object.freeze(['最後の文の訂正。読みは (R1)(I は固定・角運動量 I ω が増える)が主(〔第347便h〕の ⑩ の 2 つ目の段落)', '表 3 の照合(行き先を慣性回転だけにすると (R1) の数に戻る)']),
  Object.freeze(['1 つ目: 補足 1 の行き先(内部熱・慣性回転)に 3 つ目の行き先「引きずり回転」を足す。2 つ目: 回答 8 の文の続き —— 「傾きにくくなる」ことで釣り合う(〔第347便h〕表 15 には頭打ちの形が無かった)', '表 2〜表 9']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① Ω⊥ = 0(θ = 0)で何も増えない(型 3 × 釣り合いの型 5 の ω の変化の最大) | ${fe(S.z1)} | ${tf(G.perpZero)} |`,
    `| ② トルクの式の自転速度 0(D2・慣性回転 0)でトルク 0・何も増えない | ${fe(S.r2w)}・${fe(S.r2tq)} | ${tf(G.zeroTorque)} |`,
    `| ③ (D2) で慣性回転が増えない組(a_in 0)はトルクが一定・自転は ω² = ω₀² + 2 a_dr (1 − f) ω_慣性 Ω⊥² t(相対の差)/変異(全自転を使う)との差 | ${fe(S.r3tq)}・${fe(S.r3w)}/${fe(S.m3w)} | ${tf(G.d2flat)} |`,
    `| ④ (D1) で行き先を慣性回転から引きずり回転へ替えても全自転は同じ(名札だけ) | ${fe(S.r4)} | ${tf(G.d1label)} |`,
    `| ⑤ (D3) の閉じた形 ω_引きずり(t) = Ω∥ + rτ + (ω_引きずり(0) − Ω∥ − rτ) e^(−t/τ)・r = a_dr (1 − f) Ω⊥² | ${fe(S.d5)} | ${tf(G.d3closed)} |`,
    `| ⑥ 閉じた形 (Tc)・(Ta)+(Tc)・(Tbc)・(Tb+)(相対の差)/変異((Ta) の ω₀/ω を落とす)との差 | ${fe(S.dTc)}・${fe(S.dTaTc)}・${fe(S.dTbc)}・${fe(S.dTbp)}/${fe(S.mTaTc)} | ${tf(G.closed)} |`,
    `| ⑦ 帳簿(熱 + 戻した分 + 回転のエネルギーの増し分 − 仕事)÷ 仕事/変異(戻した分を落とす) | ${fe(S.led7)}/${fe(S.mled7)} | ${tf(G.ledger)} |`,
    `| ⑧ 行き先を慣性回転だけにすると〔第347便h〕表 15 の (R1) に戻る(9 組 × 型 3 の相対の差の最大) | ${fe(S.hMax)} | ${tf(G.vsH)} |`,
    `| ⑨ (Td) の釣り合いの向き(合成のベクトルとの角の最大 [deg]・銀河との角 [deg])・近づく速さの比(自転 10 倍 ÷ 1 倍: 角運動量に比例・(Ta)) | ${fe(S.tdEqDiff)}・${f3(S.tdEqGal)}・${f3(S.tdL)}・${f3(S.tdTa)} | ${tf(G.td)} |`,
    `| ⑩ 入力の拒否(割合の和 ≠ 1・負の割合・型の名・f・戻る先) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.case1 = ['| 型 | 熱 h | 慣性 a_in | 引きずり a_dr | 動いた割合 f | τ | 戻る先 | ω(T) ÷ ω₀ | ω_慣性(T) ÷ ω_慣性(0) | ω_引きずり(T) | トルク(T) ÷ トルク(0) | 自転 | トルク | 熱 ÷ 仕事 | 戻した分 ÷ 仕事 | 帳簿の残り |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.case1.map((r) => `| (${r.dest}) | ${r.h} | ${r.aIn} | ${r.aDr} | ${r.f} | ${r.tau === null ? '—' : r.tau} | ${r.ret === null ? '—' : RET[r.ret]} | ${f3(r.wRatio)} | ${f3(r.wiRatio)} | ${f3(r.wdEnd)} | ${f3(r.torqueRatio)} | ${WJ[r.wJudge]} | ${tq(r)} | ${f3(r.heatOverWork)} | ${f3(r.givenOverWork)} | ${fe(r.ledgerResid)} |`)].join('\n');
  T.vsH = ['| f | h | 〔第347便h〕表 15 の (R1) の ω(T) ÷ ω₀ | (D1) との相対の差 | (D2) | (D3) |', '|---|---|---|---|---|---|',
    ...J.vsH.map((r) => `| ${r.f} | ${r.h} | ${f3(r.hRatio)} | ${fe(r.diffs[0])} | ${fe(r.diffs[1])} | ${fe(r.diffs[2])} |`)].join('\n');
  T.case2 = ['| 釣り合いの型 | k_d | 熱 h | ω(T) ÷ ω₀ | ω(2T) ÷ ω₀ | 閉じた形との相対の差 | θ(T) [deg] | トルクの最大 ÷ 初め | トルク(T) ÷ 初め | 軸の動きの率(自転 2 倍 ÷ 1 倍) | f(ω₀)・f(2ω₀) | 自転 | 99% に届く時刻 | 帳簿の残り |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.case2.map((r) => `| ${BAL[r.bal]} | ${r.bal === 'Tc' || r.bal === 'TaTc' ? r.kd : '—'} | ${r.h} | ${f3(r.wRatio)} | ${f3(r.wRatio2T)} | ${fe(r.closedDiff)} | ${f2(r.thEndDeg)} | ${f3(r.torqueMaxRatio)} | ${f3(r.torqueRatio)} | ${f3(r.rateRatio)} | ${f3(r.fAt1)}・${f3(r.fAt2)} | ${WJ[r.wJudge]} | ${r.reach === null ? '—' : f2(r.reach)} | ${fe(r.ledgerResid)} |`)].join('\n');
  T.order = ['| 釣り合いの型 | k_d | 「自転速度が増す」 | 「角運動量が増して」 | 「トルクが増し」 | 「傾きにくくなり」 | 「釣り合う」 | 句の順(5 つ全部) |', '|---|---|---|---|---|---|---|---|',
    ...J.case2.filter((r) => r.h === 0).map((r) => `| ${BAL[r.bal]} | ${r.bal === 'Tc' || r.bal === 'TaTc' ? r.kd : '—'} | ${yn(r.phr.spin)} | ${yn(r.phr.L)} | ${yn(r.phr.torque)} | ${yn(r.phr.harder)} | ${yn(r.phr.balance)} | ${ORD[r.order]} |`)].join('\n');
  T.td = ['| k_g | 尺度の型 | 自転の倍 ω₀ | 熱と自転へ入る率の読み | 釣り合いとの初めの角 [deg] | 終わりの角 [deg] | 銀河との角(終わり)[deg] | 1% に届く時刻 | ω(T) ÷ ω₀ | 帳簿の残り |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.td.rows.map((r) => `| ${r.kg} | ${r.scale === 'L' ? '角運動量に比例' : '(Ta) 固定'} | ${r.w0} | ${r.read === 'each' ? '源ごとの和 Σ abs(Ω⊥k)²' : '合成 abs(ΣΩ⊥k)²'} | ${f3(r.ang0Deg)} | ${fe(r.angEndDeg)} | ${f3(r.galDegEnd)} | ${f2(r.reach)} | ${f3(r.wRatio)} | ${fe(r.ledgerResid)} |`)].join('\n');
  T.combo = ['| 行き先の型 | 釣り合いの型 | ω(T) ÷ ω₀ | ω_慣性(T) ÷ ω_慣性(0) | ω_引きずり(T) | トルク(T) ÷ 初め | 自転 | トルク | 帳簿の残り |', '|---|---|---|---|---|---|---|---|---|',
    ...J.combo.map((r) => `| (${r.dest}) | ${BAL[r.bal]} | ${f3(r.wRatio)} | ${f3(r.wiRatio)} | ${f3(r.wdEnd)} | ${f3(r.torqueRatio)} | ${WJ[r.wJudge]} | ${tq(r)} | ${fe(r.ledgerResid)} |`)].join('\n');
  T.body = ['| 天体 | 源 | q | Ω∥ [rad/s] | Ω⊥ [rad/s] | 自転の軸と Ω の角 [deg] | (D1) の増え方 dω/dt ÷ ω [1/年] | (D3) の上の値 (ω_引きずり − Ω∥) ÷ ω(τ 1・1e3・1e6 年) | (Tc)・(Ta)+(Tc) の増えの総量 ÷ ω(k_d 1) | 観測の自転の変化の率 [1/年](固定の比べる列) | abs(Ω) [rad/年] | 地球の一般歳差 [rad/年](文献の値・未照合) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${r.q} | ${fe(r.Wpar)} | ${fe(r.Wperp)} | ${f2(r.thetaDeg)} | ${fe(r.d1RateYr)} | ${r.d3.map((x) => fe(x.dwOverW)).join('・')} | ${r.tcTotal === null ? '—(Ω⊥ ≈ 0)' : fe(r.tcTotal)} | ${fe(r.obsRateYr)} | ${fe(r.precRadYr)} | ${fe(r.earthPrecRadYr)} |`)].join('\n');
  const HK = [['h1', '熱 h 1'], ['drD1', '引きずり 1・(D1)'], ['drD3field', '引きずり 1・(D3) 場へ返す'], ['drD3heat', '引きずり 1・(D3) 熱'], ['halfD3heat', '熱 0.5 + 引きずり 0.5・(D3) 熱']];
  T.heat = ['| 天体 | q | 熱の上の限り [W](〔第347便h〕表 16) | ' + HK.map(([, n]) => n + '(熱 ÷ 仕事・比)').join(' | ') + ' |', '|---|---|---|' + HK.map(() => '---|').join(''),
    ...J.heat.rows.map((r) => `| ${NM[r.id]} | ${r.q} | ${fe(r.upper)} | ` + HK.map(([k]) => `${f3(r.cols[k].frac)}・${fe(r.cols[k].ratio)}`).join(' | ') + ' |')].join('\n');
  return T;
}

/** 節の文に載せる数の文(QA が節に逐語で在ることを照合する) */
export function factsOf(J) {
  const F = {}, c1 = J.case1, cnt = (f) => c1.filter(f).length;
  const fl = c1.filter((r) => r.wJudge === 'flat'), allD3 = fl.length > 0 && fl.every((r) => r.dest === 'D3' && r.aIn === 0);
  F.case1 = `行き先の表 ${c1.length} 行: 自転が頭打ちの行 ${fl.length}(${allD3 ? 'どれも (D3) で a_in 0' : '(D3) で a_in 0 でない行を含む'})・トルクが頭打ちの行 ${cnt((r) => r.torqueFlat)}((D2) で a_in 0 の ${cnt((r) => r.torqueFlat && r.dest === 'D2')} 行と (D3) で a_in 0 の ${cnt((r) => r.torqueFlat && r.dest === 'D3')} 行)・帳簿の残りの最大 ${fe(Math.max(...c1.map((r) => Math.abs(r.ledgerResid))))}`;
  const c2 = J.case2.filter((r) => r.h === 0);
  F.case2 = `釣り合う(頭打ち)型: ${c2.filter((r) => r.wJudge === 'flat').map((r) => BAL[r.bal] + (r.bal === 'Tc' || r.bal === 'TaTc' ? ' k_d ' + r.kd : '')).join('・')}/句の順が 5 つ全部成り立つ型: ${c2.filter((r) => r.order === 'yes').map((r) => BAL[r.bal] + ' k_d ' + r.kd).join('・')}`;
  const tc = J.case2.filter((r) => (r.bal === 'Tc' || r.bal === 'TaTc') && r.h === 0);
  F.closed = `閉じた形との相対の差の最大((Tc)・(Ta)+(Tc)・h 0): ${fe(Math.max(...tc.map((r) => r.closedDiff)))}`;
  const td = J.td.rows, tdL = td.filter((r) => r.scale === 'L'), tdA = td.filter((r) => r.scale === 'Ta');
  const rr = (rows) => { const a = rows.find((r) => r.w0 === 10 && r.kg === 0 && r.read === 'sum'), b = rows.find((r) => r.w0 === 1 && r.kg === 0 && r.read === 'sum'); return a.reach / b.reach; };
  F.td = `(Td) 釣り合いの向きは合成のベクトル(銀河と ${f3(J.td.eqGalDeg)}°・黄道の極と ${f3(J.td.eqEclDeg)}°・比 ρ ${f3(J.td.rho)})—— 1% に届く時刻の比(自転 10 倍 ÷ 1 倍): 角運動量に比例 ${f3(rr(tdL))}・(Ta) ${f3(rr(tdA))}/終わりの ω ÷ ω₀ の最大: 源ごとの和 ${f3(Math.max(...td.filter((r) => r.read === 'each').map((r) => r.wRatio)))}・合成 ${f3(Math.max(...td.filter((r) => r.read === 'sum').map((r) => r.wRatio)))}`;
  F.heat = `熱の窓の両方を満たす行: ${J.heat.both.map((b) => b.k + ' ' + b.n).join('・')}`;
  const io = J.body.filter((r) => r.id === 'Io' && r.q === 2)[0];
  F.body = `イオ・木星(q 2)の (D3) の上の値 ÷ ω: ${io.d3.map((x) => fe(x.dwOverW)).join('・')}(τ 1・1e3・1e6 年)`;
  return F;
}
