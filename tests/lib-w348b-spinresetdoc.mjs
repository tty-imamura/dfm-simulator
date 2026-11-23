// 第348便b(原仮定者の回答(2026-11-23 —— 第145報の回答 10)「AN975」・統括の検証項目 R410):
// **正本 tests/out/spinreset-348b.json から PHYSICS〔第348便b〕の表を作る文書の lib**
// (QA docs.spinreset348b が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁)。原文(言葉を変えずに引く —— 全角の記号もそのまま)と、アプリの行の引用(読むだけ)もここに持つ。
export const DOC_VERSION = 'w348b-spinresetdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x ? '成り立つ' : '成り立たない');
const WJ = Object.freeze({ flat: '頭打ち', grow: '増え続ける', none: '増えない' });
const NM = Object.freeze({ Earth: '地球', Venus: '金星', Io: 'イオ', Pluto: '冥王星', Sun: '太陽', Jupiter: '木星', Charon: 'カロン' });
const BAL = Object.freeze({ none: '(なし)', Ta: '(Ta)', Tbm: '(Tb−)', Tbp: '(Tb+)', Tbc: '(Tbc)', Tc: '(Tc)', TaTc: '(Ta)+(Tc)' });
const TY = Object.freeze({ S1: '(S1)', S2: '(S2)', S2p: '(S2′)', S2pp: '(S2″)' });
const KIND = (t, c) => (t === 'S2p' || t === 'S2pp' ? TY[t] : TY[t] + ' ' + c);
const ORD = Object.freeze({ yes: '成り立つ', no: '成り立たない', knob: 'ノブ次第(上限 ω_c のノブで釣り合う —— 傾きにくくはならない)' });
const tqJ = (r) => (r.torqueRatio !== null && r.torqueRatio < 1e-3 ? '0 へ' : r.torqueFlat ? '一定' : '変わる');

/** 原文(言葉を変えずに引く —— 当時の文を消さずに並べる) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN975: トルクの式の自転速度は、前回ステップの慣性回転と引きずり回転の合成。ただし、引きずり回転は、毎回リセットする。これは、並進引きずりの式での、「前回ステップの慣性と引きずりの合成として、その前のステップとの差分を使用し、引きずりは毎回リセットする」と同様']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '自転速度は、「慣性回転」と「引きずり回転」の合成である']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '引きずられる側の自転軸と平行な回転成分は、自転の「引きずり回転」に計上する']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 9)', 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』']),
  Object.freeze(['原仮定者の裁定(2026-10-01 —— 第79報)', 'ここでの「移動ベクトル」は、前回フレームの「慣性速度ベクトル」＋「引きずりベクトル」である']),
  Object.freeze(['原仮定者の裁定(2026-10-01 —— 第79報)', '「引きずりベクトル」は毎フレームリセットする']),
  Object.freeze(['原仮定者の裁定(2026-10-02 —— 第80報)', 'ここでの「移動ベクトル」は、前回ステップの「慣性移動ベクトル」+「引きずりベクトル」である。単純に、前回座標と今回座標の差分が相当する']),
  Object.freeze(['原仮定者の裁定(2026-10-02 —— 第80報)', '「引きずりベクトル」は毎ステップリセットする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['トルク = 慣性モーメント × ω_T × 直交する回転成分 の ω_T は、前の步の「慣性回転 + 引きずり回転」。引きずり回転は状態として積まず、毎步、場の値(受け手の軸に平行な回転成分 Ω∥)に作り直す。「差分」の読みを 3 列((S1)・(S2)・(S2′))—— 〔第347便i〕の (D1)(D2)(D3) のどれとも違う新しい型', '表 3〜表 10']),
  Object.freeze(['自転(合成)= ω_慣性 + ω_引きずり の帳簿(〔第347便h〕の帳簿・〔第347便i〕の量)。本節では ω_引きずり = Ω∥(リセットの後)', '表 3・表 6']),
  Object.freeze(['リセットで作り直す先の値 Ω∥(〔第347便h〕の計上の型 (L1) —— その時々の値をそのまま持つ)', '表 3・表 10']),
  Object.freeze(['1 つ目のケース(行き先「引きずり回転」)は、リセットで次の步に残らない —— 帳簿の上の行き先を 3 列(E1 場へ返る・E2 慣性回転へ移る・E3 熱)。2 つ目のケースは表 7 の句の順の表', '表 5〜表 8']),
  Object.freeze(['過去の文(第79報 —— 「フレーム」は物理ステップと読む〔第289便a〕の対応表 14 行)。移動ベクトル = 前の步の慣性 + 引きずり', '表 2']),
  Object.freeze(['過去の文(第79報)。引きずりベクトルを積まない', '表 2']),
  Object.freeze(['過去の文(第80報 —— 〔第290便c〕で慣性引きずりの経路に入れた)。「単純に、前回座標と今回座標の差分が相当する」—— 並進では「前の步の慣性 + 引きずり」と「座標の差分」が同じ量。自転の側で (S1) と (S2) が同じになる組(θ 固定・E2)がこれに当たる', '表 2・表 6・表 9']),
  Object.freeze(['過去の文(第80報)。回答 10 の「引きずりは毎回リセットする」の元の文', '表 2']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

/** T1 アプリの並進引きずりの步(beta の html を読むだけ —— 行の番号は基点 c997d6a4 の木)。[句, 慣性引きずりの経路, 引きずり近似の経路, 読み]・引用の字列は QA が html に在ることを照合する */
export const APP_QUOTES = Object.freeze([
  'for(let i=0;i<n;i++){ PX[i]=X[i]; PY[i]=Y[i]; PT[i]=t; }', 'S.uPx[i]=ux; S.uPy[i]=uy; S.hasU[i]=1;',
  '標本は移送の**前**の座標(この hook の入口の相)—— 次の步の V は核の位置更新と本步の移送の両方を含む', 'vx[i]+=kFrame*dux; vy[i]+=kFrame*duy;',
  'VX[i]=(X[i]-PX[i])/dt; VY[i]=(Y[i]-PY[i])/dt;', 'if(hist){ ux+=a*(VX[j]-VX[i]); uy+=a*(VY[j]-VY[i]); }', 'let dux=ux-S.uPx[i], duy=uy-S.uPy[i];',
  '**位置の更新 x += u·dt(座標移送)**。u を v へ足さない。u は毎物理ステップ作り直す(累積しない)。', 'NX[i]=(ux!==0)? X[i]+ux*dt : X[i];', 'const ux=unx/denom, uy=uny/denom;',
]);
const Q = (k) => '`' + APP_QUOTES[k] + '`';
export const APP_ROWS = Object.freeze([
  Object.freeze(['「前回ステップの」', `前の步の標本(移送の前の座標)を残す ${Q(0)}(L60008)`, `前の步の u を残す ${Q(1)}(L35797)`, '当たる(どちらも 1 步前の値を 1 組だけ持つ)']),
  Object.freeze(['「慣性と引きずりの合成として」', `標本の間の座標の差 = 核の位置更新(慣性 v Δt)+ 前の步の移送 u Δt —— 注記 ${Q(2)}(L60007)`, `速度に u の変化を足す ${Q(3)}(L35791)—— 合成は v 1 本の中(慣性と引きずりを分けて持たない)`, '慣性引きずりの経路で当たる。引きずり近似は合成を v 1 本で持つ形']),
  Object.freeze(['「その前のステップとの差分を使用し」', `座標の差分 ÷ 刻みを移動ベクトルにする ${Q(4)}(L59917)・相手との差に使う ${Q(5)}(L59944)`, `差分は u の差 ${Q(6)}(L35784)—— 座標の差分ではない`, '慣性引きずりの経路で当たる(座標の差分 = 前の步の慣性 + 引きずり)。引きずり近似の差分は別の量']),
  Object.freeze(['「引きずりは毎回リセットする」', `契約 (iii) ${Q(7)}(L59334)・移送 ${Q(8)}(L59988)`, `u は毎步、源から作り直す ${Q(9)}(L35782)。ただし v に足した u の変化の分は v に残る`, '慣性引きずりの経路で当たる。引きずり近似は u を作り直すが、v に移った分は次の步へ残る(〔第289便a〕の対応表 14 行の判定は「一致(読み: 物理ステップ)」)']),
  Object.freeze(['「トルクの式の自転速度」(自転の側)', '当たらない(アプリの自転の步にこの式は無い)', '当たらない', '〔第347便h〕〔第347便i〕と本節の器の中だけ']),
]);
export function appTable() {
  return ['| 原文の句 | 慣性引きずりの経路(`dfmInertialDragStep` —— 第80報を〔第290便c〕で入れた経路) | 引きずり近似の経路(E6′ の kFrame —— 回答 10 の AN977 の呼び名) | 読み(統括の読み) |', '|---|---|---|---|',
    ...APP_ROWS.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`)].join('\n');
}
/** 型の候補(器の宣言 —— 型は決めない) */
export const TYPE_ROWS = Object.freeze([
  Object.freeze(['(S1)', 'ω_T(n) = ω_慣性(n−1) + ω_引きずり(n−1)(前の步の終わりの 2 つの値の合成 —— 引きずり回転はリセットの後の Ω∥)', 'ω_T = ω_慣性 + Ω∥(その時の値)。〔第347便i〕の (D3) の τ → 0 と同じ(E1 は場へ返す列・E3 は熱の列)・E2 は (D1) の行き先を慣性回転へ寄せた形', 'E1・E2・E3 の 3 列。軸が動くと合成の自転は Ω∥ の変化だけ動く(場との交換)']),
  Object.freeze(['(S2)', 'ω_T(n) = 前の步で回った角 ÷ Δt = ω_慣性 + Ω∥ + δ(リセットの前に引きずり回転へ入った分 δ を含む・最初の步は (S1) と同じ)', '(S1) と同じ(δ は刻みに比例して 0 へ)', '(S1) と同じ 3 列。差は刻みに比例する分だけ']),
  Object.freeze(['(S2′)', 'ω_T は (S2) と同じ。回った角の差分を次の步の慣性回転にも使う: ω_慣性(n) = 回った角 ÷ Δt − Ω∥(新しい軸)', '合成の自転は回った角のまま続く(引きずりで回った分が慣性へ移る)。θ 固定では (S1) の E2 と同じ', 'E2 に当たる 1 列。場との交換は 0(軸が動いても合成の自転は跳ばない)']),
  Object.freeze(['(S2″)(対照)', '回った角の差分をそのまま次の步の慣性回転にする', '極限が無い(Ω∥ が毎步慣性へ積まれ、自転は刻みに反比例して増える)', '場との交換が毎步 Ω∥ の分 —— 候補から外して対照に置く']),
]);
export function typeTable() {
  return ['| 型 | 步の式(統括の読み) | 連続の極限(刻み → 0) | 帳簿の行き先 |', '|---|---|---|---|', ...TYPE_ROWS.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① Ω⊥ = 0(θ = 0)で何も変わらない(種 7 × 釣り合いの型 5 の ω の変化の最大 —— (S2″) は除く) | ${fe(S.z1)} | ${tf(G.perpZero)} |`,
    `| ② 引きずり回転を積む形(リセットしない・ω_引きずり(0) = 0)に戻すと〔第347便i〕の (D1) に一致(相対の差: 2000 步・2 万步 —— 1 次で縮む) | ${fe(S.acc1)}・${fe(S.acc2)} | ${tf(G.accumulate)} |`,
    `| ③ θ 固定の連続の閉じた形 ω(t) = ω_慣性(0) + cos θ₀ + a_eff (1 − f) sin² θ₀ t(種 7 の相対の差の最大・10 万步) | ${fe(S.cfMax)} | ${tf(G.closedFixed)} |`,
    `| ④ 〔第347便i〕の (D3) の τ → 0 は (S1) の E1・E3 の極限へ(閉じた形との相対の差: 場へ返す τ 0.02・0.01/熱 τ 0.02・0.01) | ${fe(S.d3a)}・${fe(S.d3b)}/${fe(S.d3c)}・${fe(S.d3d)} | ${tf(G.d3limit)} |`,
    `| ⑤ 帳簿(熱 + 返した分 − 場との交換 + 回転のエネルギーの増し分 − 仕事)/変異(場との交換を落とす・E2 で δ を移さない) | ${fe(S.led5)}/${fe(S.mled5)}・${fe(S.mled5b)} | ${tf(G.ledger)} |`,
    `| ⑥ (S2′) で引きずり回転 0(a_dr 0・θ 90°)のとき (S1)・(S2) と同じ/θ 固定では (S1) E2・(S2) E2・(S2′) が同じ | ${fe(S.s6)}/${fe(S.s6fix)} | ${tf(G.s2pSame)} |`,
    `| ⑦ 軸が起きる型の連続の閉じた形((S1) E2・(S2′) × (Tc)・(Ta)+(Tc) の相対の差の最大・刻み 1e-4) | ${fe(S.alMax)} | ${tf(G.closedAlign)} |`,
    `| ⑧ (S2″)(対照)は Ω⊥ = 0 でも ω(T) = ω(0) + N abs(Ω)(N 100・1000 の差) | ${fe(S.p8a)}・${fe(S.p8b)} | ${tf(G.s2ppStep)} |`,
    `| ⑨ (Td) の釣り合いの向き(合成のベクトルとの角の最大 [deg]・銀河との角 [deg]) | ${fe(S.tdEq)}・${f3(S.tdGal)} | ${tf(G.td)} |`,
    `| ⑩ 入力の拒否(割合の和・型の名・行き先の名・(S2′) の行き先・釣り合いの型・f・積む形の型) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const KS = ['S1E1', 'S1E2', 'S1E3', 'S2E1', 'S2E2', 'S2E3', 'S2pE2'];
  T.vsI = ['| 熱 h | 慣性 a_in | 引きずり a_dr | f | (D1) | (D2) | (D3) τ 0.3 場へ返す | (D3) τ 0.3 熱 | (S1) E1 | (S1) E2 | (S1) E3 | (S2) E1 | (S2) E2 | (S2) E3 | (S2′) |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.vsI.map((r) => `| ${r.h} | ${r.aIn} | ${r.aDr} | ${r.f} | ${f3(r.D1)} | ${f3(r.D2)} | ${f3(r.D3field)} | ${f3(r.D3heat)} | ${KS.map((k) => f3(r.mine[k])).join(' | ')} |`)].join('\n');
  T.case1 = ['| 種 | 熱 h | 慣性 a_in | 引きずり a_dr | f | ω(T) ÷ ω_慣性(0) | ω_慣性(T) ÷ ω_慣性(0) | ω_引きずり(T) | トルク(T) ÷ トルク(0) | 自転 | トルク | 熱 ÷ 仕事 | 返した分 ÷ 仕事 | 連続の閉じた形との相対の差 | 帳簿の残り |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.case1.map((r) => `| ${KIND(r.type, r.col)} | ${r.h} | ${r.aIn} | ${r.aDr} | ${r.f} | ${f3(r.wRatio)} | ${f3(r.wiRatio)} | ${f3(r.wdEnd)} | ${f3(r.torqueRatio)} | ${WJ[r.wJudge]} | ${tqJ(r)} | ${f3(r.heatOverWork)} | ${f3(r.givenOverWork)} | ${fe(r.closedDiff)} | ${fe(r.ledgerResid)} |`)].join('\n');
  T.case2 = ['| 種 | 行き先 | 釣り合いの型 | k_d | ω(T) ÷ ω(0) | ω(2T) ÷ ω(0) | 閉じた形との相対の差 | θ(T) [deg] | トルクの最大 ÷ 初め | 場との交換 ÷ 仕事 | 自転 | 99% に届く時刻 | 「自転速度が増す」 | 「トルクが増し」 | 「傾きにくくなり」 | 「釣り合う」 | 句の順(5 つ全部) | 帳簿の残り |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.case2.map((r) => `| ${KIND(r.type, r.col)} | ${r.aDr === 1 ? '引きずり回転' : '慣性回転'} | ${BAL[r.bal]} | ${r.bal === 'Tc' || r.bal === 'TaTc' ? r.kd : '—'} | ${f3(r.wRatio)} | ${f3(r.wRatio2T)} | ${fe(r.closedDiff)} | ${f2(r.thEndDeg)} | ${f3(r.torqueMaxRatio)} | ${f3(r.fieldXOverWork)} | ${WJ[r.wJudge]} | ${r.reach === null ? '—' : f2(r.reach)} | ${yn(r.phr.spin)} | ${yn(r.phr.torque)} | ${yn(r.phr.harder)} | ${yn(r.phr.balance)} | ${ORD[r.order]} | ${fe(r.ledgerResid)} |`)].join('\n');
  const iOf = (r) => J.td.iRows.find((x) => x.kg === r.kg && x.scale === r.scale && x.w0 === r.w0 && x.read === r.read);
  T.td = ['| 型 | k_g | 尺度の型 | 慣性回転 ω_慣性(0) | 熱と自転へ入る率の読み | 釣り合いとの初めの角 [deg] | 終わりの角 [deg] | 銀河との角(終わり)[deg] | 1% に届く時刻 | 〔第347便i〕表 7 の時刻 | ω(T) ÷ ω(0) | 〔第347便i〕表 7 の ω(T) ÷ ω₀ | 場との交換 ÷ 仕事 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.td.rows.map((r) => `| ${TY[r.type]} | ${r.kg} | ${r.scale === 'L' ? '角運動量に比例' : '(Ta) 固定'} | ${r.w0} | ${r.read === 'each' ? '源ごとの和' : '合成'} | ${f3(r.ang0Deg)} | ${fe(r.angEndDeg)} | ${f3(r.galDegEnd)} | ${f2(r.reach)} | ${f2(iOf(r).reach)} | ${f4(r.wRatio)} | ${f4(iOf(r).wRatio)} | ${fe(r.fieldXOverWork)} |`)].join('\n');
  T.dt = ['| 例 | 種 | 連続の極限(閉じた形) | ω(T)(Δt 大・中・小) | (ω(T) − 極限) ÷ Δt(大・中・小) | 差の比(1 次なら 10) | (S2″) の (ω(T) − ω(0)) Δt ÷ (Ω∥ T) |', '|---|---|---|---|---|---|---|',
    ...J.dt.map((r) => `| ${r.kind === 'fixed' ? 'θ 固定・h 0・a_in 0.5・a_dr 0.5・f 0・T 50' : '(Tc) k_d 0.1・行き先は引きずり回転・f 0.5・T 200'} | ${KIND(r.type, r.col)} | ${r.want === null ? '—(極限なし)' : f4(r.want)} | ${r.runs.map((x) => f4(x.wEnd)).join('・')} | ${r.runs.map((x) => (x.coef === null ? '—' : f4(x.coef))).join('・')} | ${r.lin === null ? '—' : f2(r.lin)} | ${r.inv === null ? '—' : r.inv.map(f4).join('・')} |`)].join('\n');
  T.body = ['| 天体 | 源 | q | Ω∥ ÷ ω(リセットで作り直す引きずり回転) | (S1)・(S2′) の dω/dt ÷ ω [1/年](θ 固定・行き先は慣性回転・f 0) | (S2) − (S1) の相対の差の桁 Ω⊥² Δt ÷ ω(Δt 160 s) | (Tc) で (S1) にだけ入る場との交換 ÷ ω | (Tc) のトルクの分の増えの総量 ÷ ω(k_d 1) | 観測の自転の変化の率 [1/年](固定の比べる列) |',
    '|---|---|---|---|---|---|---|---|---|', ...J.body.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${r.q} | ${fe(r.dragOverW)} | ${fe(r.s1RateYr)} | ${fe(r.s2dt)} | ${r.tcField === null ? '—(Ω⊥ ≈ 0)' : fe(r.tcField)} | ${r.tcTotal === null ? '—(Ω⊥ ≈ 0)' : fe(r.tcTotal)} | ${fe(r.obsRateYr)} |`)].join('\n');
  return T;
}

/** 節の文に載せる数の文(QA が節に逐語で在ることを照合する) */
export function factsOf(J) {
  const F = {}, c1 = J.case1, mx = (a) => Math.max(...a);
  const none = c1.filter((r) => r.wJudge === 'none'), grow = c1.filter((r) => r.wJudge === 'grow');
  F.case1 = `種の表 ${c1.length} 行: 自転が増えない行 ${none.length}(${none.every((r) => r.aIn === 0 && r.col !== 'E2') ? 'どれも a_in 0 で行き先 E1・E3' : 'a_in 0 で E1・E3 でない行を含む'})・増え続ける行 ${grow.length}・頭打ちの行 ${c1.filter((r) => r.wJudge === 'flat').length}・連続の閉じた形との相対の差の最大 ${fe(mx(c1.map((r) => r.closedDiff)))}・帳簿の残りの最大 ${fe(mx(c1.map((r) => Math.abs(r.ledgerResid))))}`;
  const s2 = c1.filter((r) => r.type === 'S2'), dS = mx(s2.map((r) => Math.abs(r.wRatio - c1.find((x) => x.type === 'S1' && x.col === r.col && x.h === r.h && x.aIn === r.aIn && x.aDr === r.aDr && x.f === r.f).wRatio)));
  const sp = c1.filter((r) => r.type === 'S2p'), dP = mx(sp.map((r) => Math.abs(r.wRatio - c1.find((x) => x.type === 'S1' && x.col === 'E2' && x.h === r.h && x.aIn === r.aIn && x.aDr === r.aDr && x.f === r.f).wRatio)));
  F.s1s2 = `θ 固定(ケース 1)での差: (S2) − (S1)(同じ行き先)の ω(T) ÷ ω_慣性(0) の差の最大 ${fe(dS)}(Δt 0.005)・(S2′) − (S1) E2 の差の最大 ${fe(dP)}`;
  const c2 = J.case2, yes = c2.filter((r) => r.order === 'yes');
  F.case2 = `句の順が 5 つ全部成り立つ行: ${[...new Set(yes.map((r) => KIND(r.type, r.col) + '・' + (r.aDr === 1 ? '引きずり回転' : '慣性回転') + '・' + BAL[r.bal] + ' k_d ' + r.kd))].join('/')}`;
  const tc = (type, col, aDr, kd) => c2.find((r) => r.type === type && r.col === col && r.aDr === aDr && r.bal === 'Tc' && r.kd === kd);
  F.align = `(Tc) k_d 0.1・行き先は慣性回転の ω(T) ÷ ω(0): (S1) ${f3(tc('S1', 'E2', 0, 0.1).wRatio)}・(S2′) ${f3(tc('S2p', 'E2', 0, 0.1).wRatio)}/行き先は引きずり回転: (S1) E1 ${f3(tc('S1', 'E1', 1, 0.1).wRatio)}・(S1) E2 ${f3(tc('S1', 'E2', 1, 0.1).wRatio)}・(S2′) ${f3(tc('S2p', 'E2', 1, 0.1).wRatio)}`;
  const dd = J.dt.filter((r) => r.lin !== null);
  F.dt = `刻みの比 10 での差の比: ${dd.map((r) => f2(r.lin)).join('・')}(1 次)・(S2″) の (ω(T) − ω(0)) Δt ÷ (Ω∥ T): ${J.dt.find((r) => r.type === 'S2pp').inv.map(f4).join('・')}`;
  const io = J.body.find((r) => r.id === 'Io' && r.q === 2), ea = J.body.find((r) => r.id === 'Earth' && r.q === 2);
  F.body = `イオ・木星(q 2): Ω∥ ÷ ω ${fe(io.dragOverW)}・(S1) の増え方 ${fe(io.s1RateYr)}/年・(S2) − (S1) の桁 ${fe(io.s2dt)}/地球・太陽(q 2): Ω∥ ÷ ω ${fe(ea.dragOverW)}・増え方 ${fe(ea.s1RateYr)}/年・観測の率 ${fe(ea.obsRateYr)}/年(固定の比べる列)`;
  return F;
}
