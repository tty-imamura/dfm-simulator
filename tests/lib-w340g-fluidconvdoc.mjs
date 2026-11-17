// 第340便g(原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-14 —— AN725 = A)・統括の検証項目 R362): **正本 tests/out/fluidconv-340g.json から PHYSICS〔第340便g〕の表を作る文書の lib**
// (QA docs.fluidconv340g が節の表と逐語で照合する —— 表の数は有効数字 3 桁・正本で 0 と書いた値は「0」・丸めの残りの数そのものは載せない)。
export const DOC_VERSION = 'w340g-fluidconvdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const ARR = Object.freeze({ random: '乱数(第337便e のまま)', quasi: '準一様', glass: 'ガラス' });
const FLD = Object.freeze({ diff: '差動回転 diff', rigid: '剛体回転 rigid' });
const JUD = Object.freeze({ all: '並びと種に依らない', most: 'ほぼ揃う', depends: '並びか種に依る' });
const ACT = Object.freeze({ grav: '重力だけ(混沌の床)', velE: '速度の場(陽)', 'inert0.1': '慣性の項 τ 0.1 t_cr', 'inert0.03': '慣性の項 τ 0.03 t_cr' });
const KEYN = Object.freeze({ vphiOuterRatio: '外縁の V_φ の比', LzRatio: 'L_z の比', r50: 'r50 の相対の変化', vir: '2K/\\|W\\|', dE: 'E の相対の変化' });
const DIRN = Object.freeze({ biasNone: '全体の重みの差の符号(none)', bCloser: 'B が連続の場へ寄せる(+)/離す(−)', outerNone: '外縁の速さの比 − 1 の符号(none)', outerB: '外縁の速さの比 − 1 の符号(B)',
  torqueNone: '角運動量の率の符号(none)', torqueB: '角運動量の率の符号(B)' });
const sg = (s) => (s === 1 ? '+' : '−');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, P = J.plan;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① van der Corput の初めの 7 つ・決まった乱数の回転の直交と行列式 | ${S.vdc.v.join('・')}・直交の残り ${S.vdc.orth === 0 ? '0' : fe(S.vdc.orth)}・det = 1 ${tf(S.vdc.det1)} | ${tf(G.vdc)} |`,
    `| ② 動径の写しの往復(単位の球の s → Plummer の r → s)・単調・写し戻しが球の内 | 往復の差 ${S.map.maxD === 0 ? '0' : fe(S.map.maxD)}・単調 ${tf(S.map.mono)}・球の内 ${tf(S.map.inBall)} | ${tf(G.map)} |`,
    `| ③ 並びの質 CV_nn(N 128・種 1)の順(ガラス < 乱数・準一様 < 乱数)・ガラスの緩めで CV が下がる | 乱数 ${f3(S.quality.cv.random)}・準一様 ${f3(S.quality.cv.quasi)}・ガラス ${f3(S.quality.cv.glass)} | ${tf(G.quality)} |`,
    `| ④ 刻みの収束の読み(Q = 1 + 0.3 h^p の p = 1・2 で次数と外挿が戻る・欠けた値は p なし) | p ${f3(S.conv.p1)}・${f3(S.conv.p2)}・外挿 ${f3(S.conv.x1)}・${f3(S.conv.x2)} | ${tf(G.conv)} |`,
    `| ⑤ 一定の速度の場で引きずり 0(並び 3 × none・B)・symCentral の角運動量の率 0(diff) | ${S.ident.zero === 0 ? '0' : fe(S.ident.zero)}・${S.ident.torqueSym === 0 ? '0' : fe(S.ident.torqueSym)} | ${tf(G.ident)} |`,
    `| ⑥ 速度の写し(random の並びへ写すと速さの組が元の標本と同じ) | ${S.rankVel.maxD === 0 ? '0' : fe(S.rankVel.maxD)} | ${tf(G.rankVel)} |`,
    `| ⑦ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const st = J.t1.summary.arrStats, Ns = P.t1.Ns;
  T.quality = ['| 並び | ' + Ns.map((N) => 'CV_nn(N ' + N + ')').join(' | ') + ' |', '|---|' + Ns.map(() => '---|').join('')]
    .concat(P.t1.arrangements.map((a) => `| ${ARR[a]} | ` + Ns.map((N) => f3(st.find((s) => s.field === 'diff' && s.N === N && s.arr === a).cv)).join(' | ') + ' |')).join('\n');

  T.dirs = ['| 場 | N | ' + Object.keys(DIRN).map((k) => DIRN[k]).join(' | ') + ' |', '|---|---|' + Object.keys(DIRN).map(() => '---|').join('')]
    .concat(J.t1.summary.agree.map((a) => `| ${FLD[a.field]} | ${a.N} | ` + Object.keys(DIRN).map((k) => `${sg(a[k].major)} ${Math.max(a[k].plus, a[k].minus)}/${a[k].n === undefined ? a.n : a[k].n}(${JUD[a[k].judge]})`).join(' | ') + ' |')).join('\n');

  T.mags = ['| 場 | N | 並び | RMS\\|d\\|/RMS\\|V\\|(none・B) | 種の間のばらつき(B) | 全体の重みの差(none・B) | 外縁の速さの比(none・B) | 角運動量の率(none・B) | B の自己の分け前 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(st.map((s) => `| ${FLD[s.field]} | ${s.N} | ${ARR[s.arr]} | ${f3(s.none.dOverV)}・${f3(s.B.dOverV)} | ${f3(s.B.dOverVSpread)} | ${f3(s.none.wTotBias)}・${f3(s.B.wTotBias)} | ${f3(s.none.outerRatio)}・${f3(s.B.outerRatio)} | ${f3(s.none.torqueRate)}・${f3(s.B.torqueRate)} | ${f3(s.B.shareMean)} |`)).join('\n');

  T.slopes = ['| 場 | 並び | N の傾き RMS\\|d\\|/RMS\\|V\\|(none・B) | B の依存 | B の自己の分け前の傾き | 連続の引きずりとの差の傾き(B —— rigid だけ) |', '|---|---|---|---|---|---|']
    .concat(J.t1.summary.slopes.map((s) => `| ${FLD[s.field]} | ${ARR[s.arr]} | ${f3(s.dOverVNone)}・${f3(s.dOverVB)} | ${s.dependB} | ${f3(s.shareB)} | ${f3(s.contErrB)} |`)).join('\n')
    + '\n\n並びの間の大きさの比(B の RMS|d|/RMS|V| の最大 ÷ 最小): ' + J.t1.summary.between.map((b) => `${FLD[b.field]} N ${b.N} ${f3(b.maxOverMin)}`).join('・')
    + '\n\nsymCentral(B)の角運動量の率と運動量の率は全部の行で ' + (st.every((s) => s.symB.torqueRate === 0 && s.symB.momRate === 0) ? '0(この計算の精度で 0 と区別できない)' : '0 でない行あり') + '・row の運動量の率の最大 ' + fe(Math.max(...st.map((s) => s.momRateRow)));

  T.conv = ['| 並び | 作用 | 刻みで決まる量の数 | ' + P.t2.keys.map((k) => KEYN[k] + '(h・h/2・h/4 → p・外挿)').join(' | ') + ' |', '|---|---|---|' + P.t2.keys.map(() => '---|').join('')]
    .concat(J.t2.rows.map((r) => `| ${ARR[r.arr]} | ${ACT[r.action]} | ${r.nDecides}/${P.t2.keys.length} | ` + P.t2.keys.map((k) => { const c = r.conv[k]; return `${c.q.map(f3).join('・')} → ${c.p === null ? '—' : f3(c.p)}・${f3(c.extrap)}${c.decides ? '' : '(決まらない)'}`; }).join(' | ') + ' |')).join('\n');
  return T;
}
