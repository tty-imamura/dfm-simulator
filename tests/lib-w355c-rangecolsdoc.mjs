// 第355便c(原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・原仮定者の指示(2026-11-25)「この結果を尊重する」・統括の検証項目 R506):
// **正本 tests/out/rangecols-355c.json から PHYSICS〔第355便c〕の表と数の文を作る文書の lib**
// (QA docs.rangecols355c が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w355c-rangecolsdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x, k = 2) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(k));
const f3 = (x) => (!fin(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const esc = (s) => String(s).replace(/\|/g, '/');
const BAND = Object.freeze({ in: '入る', over: '越える', under: '届かない' });
const KIND = Object.freeze({ flat: 'u に依らない(1% の内)', power: 'u の冪', bend: 'なだらかに曲がる', discrete: '数でない印' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25)', '推奨。ただし、必ず0.98 倍である必要は無い']),
  Object.freeze(['原仮定者の指示(2026-11-25)', 'この結果を尊重する']),
]);
export const READINGS = Object.freeze([
  '推奨 = 換算の係数を、金星で局所の項と背景が同じ大きさになる値に取る作り(〔第353便zf〕の列 (イ) の作り)。「必ず 0.98 倍である必要は無い」= 背景の大きさを 0.98 に固定しない —— 0.98 は範囲の内の 1 点',
  '尊重する結果 = 比 1 の線(潮汐力 ÷ 軸引きずり = 1)で惑星が分かれる背景の大きさには範囲が在る(これまでの窓と重なり、注目の 0.98 倍を含む)。本節は範囲を数えない —— 端は仮に置いたノブ',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** ノブの表(6 列 —— 状態の欄は 1 語) */
export const KNOBS = Object.freeze([
  Object.freeze(['範囲の端 u_lo・u_hi(第355便c)', '範囲の内の代表の値の列の端を置く', '既定 0.0023・40.5(前倒しの数の主の行 —— 観測の自転・共通 k₂/Q 1e-2)・振っていない', '比例する題と曲がる題の端の値', 'u に依らない題(19)', '候補']),
  Object.freeze(['中の代表の値(第355便c)', '範囲の内の点を並べる', '0.41・0.84・0.98・3.2(端の間に在るものだけ)', '切り替わる u の挟み', '題の形の分け方', '対照']),
]);
export function knobTable() {
  return '| ノブの名 | 何を満たすために足したか | 既定と振った範囲 | 効いた量 | 効かなかった量 | 状態 |\n|---|---|---|---|---|---|\n' + KNOBS.map((r) => '| ' + r.map(esc).join(' | ') + ' |').join('\n');
}
function cellOf(r, c) {
  if (r.id === 'venusRank') return `${c.v} 番(${f3(c.res)})`;
  if (/^sense/.test(r.id)) return c.v === 1 ? '同じ(仮)' : '違う(仮)';
  if (r.id === 'fMax' && c.noLimit) return '上限なし';
  if (c.v === null || c.v === undefined) return '—';
  if (c.v === 0) return '0(数の床)';
  const s = f3(c.v);
  return r.ruler !== null && c.band ? `${s}(${BAND[c.band]})` : s;
}
const cmpCell = (r, x) => (r.id === 'fMax' && x.noLimit ? '上限なし' : x.v === 0 ? '0(数の床)' : r.id === 'venusRank' ? (x.v === null ? '—' : x.v + ' 番') : /^sense/.test(r.id) ? (x.v === 1 ? '同じ(仮)' : '違う(仮)') : x.v === null || x.v === undefined ? '—' : f3(x.v) + (r.ruler !== null && x.band ? '(' + BAND[x.band] + ')' : ''));
/** 状態の印の字(lib の stateOf の印 → 表の語) */
export function stLab(x) {
  const [k, v] = String(x).split(':');
  if (k === 'band') return BAND[v] || v;
  if (k === 'sign') return v === '+' ? '正' : v === '0' ? '0' : '負';
  if (k === 'rank') return v + ' 番';
  if (k === 'flag') return v === '1' ? '同じ(仮)' : '違う(仮)';
  return k === 'none' ? '値なし' : k === 'noLimit' ? '上限なし' : x;
}
const swText = (s) => stLab(s.from) + ' → ' + stLab(s.to) + '(u ' + f3(s.uSwitch) + ')';
export function tablesOf(J) {
  const T = {}, t1 = J.t1, t2 = J.t2, S = J.pure.scenes, G = J.pure.gates;
  T.pure = '| 零試験 | 値 | 門 |\n|---|---|---|\n' + [
    ['① u 0.98 の列 = 〔第353便zf〕の列 (イ)(35 行・相対 1e-9)', `${S.nRows} 行・違う葉 ${S.nDiff}`, G.zf098],
    ['② λ(0.98) = 〔第353便zf〕の lamVenus', `${fe(S.lam98, 4)}・相対 ${fe(S.lamRel, 1)}`, G.lam098],
    ['③ 範囲の両端で金星の局所 ÷ 背景 = 1', `${Number(S.equalLo).toFixed(9)}・${Number(S.equalHi).toFixed(9)}`, G.equalEnds],
    ['④ u の列(既定の端)', S.us.map(f3).join('・'), G.uList],
    ['⑤ 拒否(u ≤ 0・区間の外・端の逆・題の名・数でない端)', S.rejects.filter(Boolean).length + '/' + S.rejects.length, G.rejects],
  ].map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`).join('\n');
  T.cols = '| u | λ(規則の係数の倍) | 金星の局所の倍 ÷ λ³ |\n|---|---|---|\n' + t1.cols.map((c) => `| ${f3(c.u)} | ${fe(c.lam, 4)} | ${f3(c.gainVenus / Math.pow(c.lam, 3))} |`).join('\n');
  const ids = Object.fromEntries(J.cmp.U.rows.map((x) => [x.id, x]));
  T.t1 = '| # | 題 | ' + t1.us.map((u) => 'u ' + f3(u)).join(' | ') + ' | 比べる列 (ウ) |\n|---|---|' + t1.us.map(() => '---|').join('') + '---|\n'
    + t1.rows.map((r, k) => `| ${k + 1} | ${esc(r.label)} | ` + r.cells.map((c) => cellOf(r, c)).join(' | ') + ' | ' + cmpCell(r, ids[r.id]) + ' |').join('\n');
  T.t2 = '| # | 題 | 形 | 指数 p | 上端 ÷ 下端 | 状態の印(下端 → 上端) | 替わる u |\n|---|---|---|---|---|---|---|\n'
    + t2.rows.map((r, k) => `| ${k + 1} | ${esc(r.label)} | ${KIND[r.kind]} | ${r.kind === 'power' ? Number(r.p).toFixed(2) : '—'} | ${fin(r.hiLo) ? f3(r.hiLo) : '—'} | ${stLab(r.states[0])} → ${stLab(r.states[r.states.length - 1])} | ${r.switches.length ? r.switches.map(swText).join('・') : 'なし'} |`).join('\n');
  const c = t2.count, L = (a) => a.length;
  T.count = '| 分け方 | 題の数 | 題(id) |\n|---|---|---|\n' + [
    ['範囲の内のどこを取っても変わらない題(u に依らない —— 1% の内か、同じ印)', L(c.indep), c.indep],
    ['u の冪で動く題', L(c.power), c.power], ['—— そのうち u に比例(指数 1)', L(c.prop1), c.prop1], ['—— そのうち u に反比例(指数 −1)', L(c.inv1), c.inv1],
    ['なだらかに曲がる題', L(c.bend), c.bend], ['値の無い列を含む題', L(c.discrete.filter((x) => !c.indep.includes(x))), c.discrete.filter((x) => !c.indep.includes(x))],
    ['範囲の内で状態の印(物差しの帯・符号・順位・値の有無)が切り替わる題', L(c.switched), c.switched],
  ].map(([a, n, xs]) => `| ${a} | ${n} | ${xs.join('・')} |`).join('\n');
  return T;
}
export function factsOf(J) {
  const c = J.t2.count, t1 = J.t1, row = (id) => J.t2.rows.find((r) => r.id === id), cell = (id, k) => t1.rows.find((r) => r.id === id).cells[k];
  const n = t1.us.length, sw = (id) => row(id).switches.map((s) => f3(s.uSwitch)).join('・');
  return {
    split: `35 の題のうち、範囲の内のどこを取っても変わらない題は ${c.indep.length}・u の冪で動く題は ${c.power.length}(u に比例 ${c.prop1.length}・反比例 ${c.inv1.length})・なだらかに曲がる題は ${c.bend.length}・範囲の内で状態の印が切り替わる題は ${c.switched.length}。`,
    flat: `金星の等大の残りは ${f3(cell('venusResid', 0).v)}〜${f3(cell('venusResid', n - 1).v)}・イオの x(扁平率なし)は ${f3(cell('ioX0', 0).v)}〜${f3(cell('ioX0', n - 1).v)}・水星の局所 ÷ 背景は ${f3(cell('mercury', 0).v)}〜${f3(cell('mercury', n - 1).v)} —— 換算の係数を金星の条件に取る作りでは、比の題は背景の大きさに依らない。`,
    prop: `率の題(環 2・公転面の集まり・地球の傾き・歳差の率の残り 2・潮汐ロック)は u に比例し、下端と上端で ${f3(row('ringAx').hiLo)} 倍動く。イオの内部熱は u の 2 乗(${f3(row('ioHeat').hiLo)} 倍)。`,
    switch: `物差しの帯が替わる u: 土星の環 (F1) ${sw('ringAx')}・(F2) ${sw('ringDisk')}・公転面の集まり ${sw('plane')}・地球の傾き ${sw('tilt')}・地球の歳差の率の残り ${sw('precEarth')}・火星 ${sw('precMars')}。`,
    u098: `u 0.98 の列は〔第353便zf〕の列 (イ) と同じ数(35 行・相対 1e-9 の内)。範囲の端は仮に置いたノブ(${f3(J.ends.lo)}〜${f3(J.ends.hi)})—— 範囲を数える枝の正本が載った後に置き直せる。`,
  };
}
