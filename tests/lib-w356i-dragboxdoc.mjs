// 第356便i(統括の検証項目 R521): 引きずりの診断の第 2 ラウンドの文書の lib —— 原文・箱の作りの表・表 6 本・数の文・表 6e を正本から作る(import しない・ファイルを読まない)。
export const DOC_VERSION = 'w356i-dragboxdoc-1';

/** 原文(言葉を変えずに引く —— 〔第356便d〕の節と同じ字) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-26)', 'AN1145: 次点。「斥力に見えたのは引きずり」と言う流れ']),
  Object.freeze(['原仮定者の回答(2026-11-22)', 'もしも気体の圧力が粒子間の斥力なら']),
  Object.freeze(['原仮定者の整理(2026-11-23)', '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
]);
export const READINGS = Object.freeze([
  '「引きずり」をどの項で読むかは決めていない —— 〔第356便d〕の候補の列 (D)(S1)(S2) を、壁の作りに依らない測り方で数え直す(列は選ばない)',
  '入口の思考実験(文は変えない)。本節の器も斥力の項は 0',
  '引きずりは座標変換として入れる(〔第356便d〕と同じ口)。周期の箱には壁(外の場)が無いので、座標の変化が慣性の運動エネルギーへ回る経路が無い —— 熱を生まないことを丁度 0 の門で数える',
]);
export function originalTable() {
  return ['| 出どころ | 原文 | 読み |', '|---|---|---|'].concat(ORIGINAL.map(([s, o], k) => `| ${s} | 「${o}」 | ${READINGS[k]} |`)).join('\n');
}

/** 箱の作りと圧力の測り方 */
export const BOXES = Object.freeze([
  ['壁(〔第356便d〕)', '柔らかい壁(ばね)・温度の掛け直し 10 步ごと', '壁に渡る力積', '〔第356便d〕の正本から読む(走らせ直さない)'],
  ['周期', '壁なし・力なし・引きずりの重みは最近の像の約束・慣性の速さは走行の間ずっと変わらない(温度の掛け直しは使わない)', '(ア) 面を横切る運動量の流れ(向きごとに 8 枚の面・横切りは実際の位置の進みで数え、運ぶ量は慣性の運動量の法線の成分の大きさ)/(イ) 並進の運動の圧力 N m ⟨v²⟩ ÷ 3 ÷ 体積', '(T) では (ア) = (イ)(零試験)・(ア′) 符号つきの流れは比べる欄'],
  ['壁を源に', '〔第356便d〕の壁と温度の掛け直しのまま、6 枚の壁を質量 M_w の静止した源(粒から一番近い壁の面の点)として (D)・(S1) の重みと分母に入れる: w = M_w ÷ (d² + ε_w²)・ε_w 0.5', '壁に渡る力積', '定義の延長(候補)・M_w 10(100)'],
]);
export function boxesTable() {
  return ['| 箱の作り | 作り | 圧力の測り方 | 備考 |', '|---|---|---|---|'].concat(BOXES.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}

const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : x.toFixed(3));
const pm = (o) => `${f3(o.mean)} ± ${f3(o.half)}`;
const yn = (b) => b ? '内' : '外';
const ID_NAME = Object.freeze({ T: '(T)', TD: '(T+D)', 'TS-S1': '(T+S1)', 'TS-S1r': '(T+S1) スピン逆', 'TS-S2': '(T+S2)', 'TDS-S1': '(T+D+S1)', 'TDS-S1r': '(T+D+S1) スピン逆', 'TDS-S2': '(T+D+S2)', 'TD/cD0.25': '(T+D) c_D 0.25', 'TD/cD0.5': '(T+D) c_D 0.5', 'TD/Mw100': '(T+D) M_w 100', 'TS-S1/Mw100': '(T+S1) M_w 100' });
const nm = (id) => ID_NAME[id] || id;
const stepOf = (r) => { const s = ['aBox', 'aN', 'aT'].filter((k) => r[k].step === '刻みに依る').map((k) => ({ aBox: '箱', aN: '粒の数', aT: '温度' })[k]); if (r.pRatioT && r.pRatioT.step === '刻みに依る') s.unshift('比'); return s.length ? '刻みに依る(' + s.join('・') + ')' : (['aBox', 'aN', 'aT'].every((k) => r[k].step === '—') ? '—(刻み h だけ)' : '依らない(幅の内を含む)'); };
const winOf = (r) => ['aBox', 'aN', 'aT'].every((k) => r[k].win === '内') ? '内' : (['aBox', 'aN', 'aT'].some((k) => r[k].win === '外') ? '外' : '幅の内で窓の端');

function sumTable(rows, head) {
  return [`| ${head} | (T) との圧力の比 | (ア) ÷ (イ) | 密度への冪(箱を振る) | 密度への冪(粒の数を振る) | 温度への冪 | 窓 0.9〜1.1 | 刻み h と h/2 |`, '|---|---|---|---|---|---|---|---|']
    .concat(rows.map((r) => `| ${nm(r.id)} | ${r.pRatioT ? pm(r.pRatioT) + '(' + r.pRatioT.inWidth + ')' : '—'} | ${pm(r.fluxOverKin)} | ${pm(r.aBox)} | ${pm(r.aN)} | ${pm(r.aT)} | ${winOf(r)} | ${stepOf(r)} |`)).join('\n');
}
/** 表(正本から) */
export function tablesOf(J) {
  const T = {};
  T.pbc = sumTable(J.sum.pbc, '条件(周期の箱・粒 64・斥力 0)');
  T.diag = ['| 条件(周期の箱・粒 64・ρ 0.08・種 3 の平均) | 座標の速さ ÷ 慣性の速さ | 芯に居る粒の割合(終わり —— d★ × 1.05 の内に相手) | 符号つきの流れ (ア′) ÷ (イ) |', '|---|---|---|---|']
    .concat(J.sum.pbc.map((r) => `| ${nm(r.id)} | ${f3(r.vCoord)} | ${r.coreFrac === null ? '散る(0 と書いた種が在る)' : f3(r.coreFrac)} | ${f3(r.signedOverKin)} |`)).join('\n');
  T.cd = sumTable(J.sum.cd.concat(J.sum.pbc.filter((r) => r.id === 'TD')), '並進引きずりの係数(周期の箱・粒 64)');
  T.big = sumTable(J.sum.big, '条件(周期の箱・粒 216)');
  T.wallsrc = sumTable(J.sum.wallsrc, '条件(壁を源に・粒 64・M_w 10)') + '\n' + J.sum.wsKnob.map((r) => `| ${nm(r.id)}(ρ 0.08 の点) | ${f3(r.pRatioT)} ± ${f3(r.half)} | — | — | — | — | — | — |`).join('\n');
  T.gate = ['| 箱 | 走行 | 刻み | 慣性の運動エネルギーの増減 | 内部の温度の和の増減 | スピンのエネルギーの増減 | 初めの値が (T) と同じ | 並進と壁の位置のエネルギーの和の増減 | 門 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.gate.map((r) => `| ${r.box === 'pbc' ? '周期' : '壁を源に'} | ${nm(r.id)} | ${r.hf === 1 ? 'h' : 'h/2'} | ${r.dKE === 0 ? (r.box === 'pbc' || r.id === 'T' ? '0' : '散る(0 と書いた)') : r.dKE.toFixed(2)} | ${r.dTint === 0 ? '0' : f3(r.dTint)} | ${r.dEs === 0 ? '0' : f3(r.dEs)} | ${r.box === 'pbc' ? '同じ' : '—'} | ${r.dE === undefined ? '—(壁なし)' : (r.dE === 0 && r.id !== 'T' ? '散る(0 と書いた)' : r.dE.toFixed(2))} | ${r.noHeat ? '真' : '偽'} |`)).join('\n');
  return T;
}
const S = (J, b, id) => J.sum[b].find((r) => r.id === id);
const W = (J, id) => J.wall.box.find((r) => r.id === id);
/** 数の文(正本から) */
export function factsOf(J) {
  const F = {}, t = S(J, 'pbc', 'T');
  F.zero = `周期の箱の (T) では、面を横切る運動量の流れ (ア) ÷ 並進の運動の圧力 (イ) = ${pm(t.fluxOverKin)}(種 3 本の平均 ± 幅 —— 幅は最大と最小の差の半分)・3 つの冪 ${f3(t.aBox.mean)}・${f3(t.aN.mean)}・${f3(t.aT.mean)}。`;
  const ids = ['TD', 'TS-S1', 'TS-S1r', 'TS-S2', 'TDS-S1'];
  F.pbc = `周期の箱(粒 64・刻み h 0.02・係数はすべて 1)の (T) との圧力の比 (ア) は ${ids.map((id) => nm(id) + ' ' + pm(S(J, 'pbc', id).pRatioT)).join('・')}。3 つの冪が窓 0.9〜1.1 に入る条件は ${J.summary.pbcInWin.map(nm).join('・')}(斥力の項は 0 のまま)。並進の運動の圧力 (イ) は、どの条件でも (T) と同じ(慣性の速さが変わらない)。`;
  const d = S(J, 'pbc', 'TD');
  F.core = `(T+D) は周期の箱で、座標の速さが慣性の速さの ${f3(d.vCoord)} 倍に下がり、終わりに芯(d★ × 1.05 の内に相手が居る)に居る粒が ${f3(d.coreFrac)}((T) は ${f3(t.coreFrac)})。符号つきの流れ (ア′) は (イ) の ${f3(d.signedOverKin)} 倍 —— 2 粒が芯の距離で止まる形(〔第356便d〕の近づく 2 粒)が、箱では面を横切る数を減らす側に出る。`;
  F.scale = '(D) の重み(質量 ÷ 距離の 2 乗)と自分の重み(B —— 密度の 2/3 乗)は長さの物差しを持たず、(D) と (S1) の引きずりの速さは慣性の速さと同じく温度の 1/2 乗で振れる。このため周期の箱では、(T+D) の箱を振る冪と、(T+D)・(T+S1) の温度への冪は、作りの上で 1 の近く(箱と温度を振ると、同じ道を違う速さで辿る —— 1 からのずれは、測る間に芯の集まりが進む度合いの違いだけ)。粒の数を振る冪と (T) との比は、この作りに縛られない。';
  const cd = J.sum.cd;
  F.cd = `並進引きずりの係数で (T+D) の (T) との比は ${cd.map((r) => 'c_D ' + r.id.split('cD')[1] + ' → ' + pm(r.pRatioT)).join('・')}・c_D 1 → ${pm(d.pRatioT)}(周期の箱)。壁の箱(〔第356便d〕)では c_D 0.25 → 0.825・0.5 → 0.626・1 → ${f3(W(J, 'TD').pRatioT)}。`;
  const bS = S(J, 'big', 'TS-S1'), bD = S(J, 'big', 'TD'), bT = S(J, 'big', 'T');
  F.big = `粒 216 の周期の箱: (T) の 3 つの冪 ${f3(bT.aBox.mean)}・${f3(bT.aN.mean)}・${f3(bT.aT.mean)}・(T+S1) ${f3(bS.aBox.mean)}・${f3(bS.aN.mean)}・${f3(bS.aT.mean)}(比 ${f3(bS.pRatioT.mean)})・(T+D) ${f3(bD.aBox.mean)}・${f3(bD.aN.mean)}・${f3(bD.aT.mean)}(比 ${f3(bD.pRatioT.mean)})—— (T+S1) と (T+D) は種 0・刻み h だけ。`;
  const wD = S(J, 'wallsrc', 'TD'), wS = S(J, 'wallsrc', 'TS-S1');
  const gw = J.gate.filter((r) => r.box === 'wallsrc');
  F.wallsrc = `壁を源にする箱(M_w 10): (T) との比 (T+D) ${pm(wD.pRatioT)}・(T+S1) ${pm(wS.pRatioT)}・M_w 100 で ${J.sum.wsKnob.map((r) => nm(r.id).split(' ')[0] + ' ' + f3(r.pRatioT)).join('・')}。温度の掛け直しをしない走行で内部の温度とスピンの増減は 0 だが、並進と壁の位置のエネルギーの和は ${gw.map((r) => nm(r.id) + ' ' + (r.dE === 0 && r.id !== 'T' ? '散る(走り直しで大きく動く —— 0 と書いた)' : r.dE.toFixed(1))).join('・')} 動く(壁に引きずられて位置の進みが止まっても、壁の中で引きずりが位置を運ぶ分は残る)。`;
  F.gate = `熱を生まないことの検査: 周期の箱の ${J.gate.filter((r) => r.box === 'pbc').length} 走行(条件 6 × 刻み h・h/2)で、慣性の運動エネルギー・内部の温度の和・スピンのエネルギーの増減は全部丁度 0、初めの値は (T) と同じ(門 ${J.summary.noHeatPBC ? '真' : '偽'})。`;
  F.step = `刻み h と h/2 の相対の差が 0.05 を越え、種の幅の 2 倍も越える量: ${J.summary.stepDep.length ? J.summary.stepDep.map((s) => { const [b, id, k] = s.split(':'); return ({ pbc: '周期', cd: '周期', wallsrc: '壁を源に', big: '粒 216' })[b] + 'の' + nm(id) + '(' + ({ aBox: '箱を振る冪', aN: '粒の数を振る冪', aT: '温度への冪', pRatioT: '(T) との比' })[k] + ')'; }).join('・') : '無し'} —— 「刻みに依る」の印。`;
  return F;
}
/** PAPER_PLAN の論文 5 の節の表 6e(条件 × 箱の作り) */
export function table6e(J) {
  const head = ['| 条件(斥力 0・粒 64・刻み 0.02) | 箱の作り | (T) との圧力の比 | 3 つの冪(箱・粒の数・温度) | 窓 0.9〜1.1 | 刻み h と h/2 |', '|---|---|---|---|---|---|'];
  const rows = [];
  for (const id of ['TD', 'TS-S1', 'TS-S1r', 'TS-S2', 'TDS-S1']) {
    const w = W(J, id); rows.push(`| ${nm(id)} | 壁(〔第356便d〕) | ${f3(w.pRatioT)} | ${f3(w.aBox)}・${f3(w.aN)}・${f3(w.aT)} | ${yn(w.inWin)} | 〔第356便d〕の表 |`);
    const p = S(J, 'pbc', id); rows.push(`| ${nm(id)} | 周期 | ${pm(p.pRatioT)} | ${f3(p.aBox.mean)}・${f3(p.aN.mean)}・${f3(p.aT.mean)} | ${winOf(p)} | ${stepOf(p)} |`);
    const s = J.sum.wallsrc.find((r) => r.id === id); if (s) rows.push(`| ${nm(id)} | 壁を源に(M_w 10) | ${pm(s.pRatioT)} | ${f3(s.aBox.mean)}・${f3(s.aN.mean)}・${f3(s.aT.mean)} | ${winOf(s)} | ${stepOf(s)} |`);
  }
  return head.concat(rows).join('\n');
}
