// 第355便e(統括の検証項目 R508): **正本 tests/out/kqopen-355e.json から PHYSICS〔第355便e〕の表 2〜表 7 と数の文を作る文書の lib**
// (QA docs.kqopen355e が節の表と逐語で照合する —— 表の数は有効数字 3 桁〔比の端は 5 桁〕)。import しない・ファイルを読まない。
export const DOC_VERSION = 'w355e-kqopendoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fp = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? Number(x).toExponential(2) : Number(x).toPrecision(3));
const f5 = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? Number(x).toExponential(4) : Number(x).toPrecision(5));
export const BN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
export const MN = Object.freeze({ obs: '観測の自転', sync: '同期の自転', syncAbs: '同期の自転・abs(Ω)' });
export const KMN = Object.freeze({ common: 'k₂/Q 共通', c337: 'k₂/Q 固体・気体' });
export const SN = Object.freeze({ c: '共通 k_c', s: '固体 k_s', g: '気体 k_g' });
const STN = Object.freeze({ lock: 'ロック', part: 'ある程度ロック', not: 'ロックしない' });
const KN = Object.freeze({ s: '固体', g: '気体' });
const pr = (f) => (f ? `${MN[f.mode]}・${KMN[f.kMode]}・${BN[f.body]}` : '—');
const fromTxt = (F) => (F ? `下: ${pr(F.lo)} ⇔ 上: ${pr(F.hi)}` : '—');

/** 表 2: k₂/Q 1 あたりの X(u 1)—— 天体 × 置き方 3 */
export function unitTable(J) {
  const ids = J.t1[0].rows.map((r) => r.id);
  const L = ['| 天体 | 状態 | 種類(第337便c の置き方) | ' + J.t1.map((m) => MN[m.mode]).join(' | ') + ' |', '|---|---|---|' + J.t1.map(() => '---:|').join('')];
  for (const id of ids) { const r0 = J.t1[0].rows.find((r) => r.id === id);
    L.push(`| ${BN[id]} | ${STN[r0.state]} | ${KN[r0.kind]} | ` + J.t1.map((m) => fp(m.rows.find((r) => r.id === id).a)).join(' | ') + ' |'); }
  return L.join('\n');
}
/** 表 3: 3 つの比の下限と上限(閉じた形)とそれを決める組 */
export function ratioTable(J) {
  const L = ['| 比 | 下限 | 下限を決める組(ロックしない側 ⇔ ロックの側) | 上限 | 上限を決める組 | いまの値 | 内か |', '|---|---:|---|---:|---|---:|---|'];
  for (const r of J.t2.ratios) L.push(`| ${SN[r.x]} ÷ ${SN[r.y]} | ${r.lo === null ? '下限なし' : f5(r.lo)} | ${fromTxt(r.loFrom)} | ${r.hi === null ? '上限なし' : f5(r.hi)} | ${fromTxt(r.hiFrom)} | ${fp(r.now)} | ${r.inside ? '内' : '外'} |`);
  return L.join('\n');
}
/** 表 4: 1 つの値だけを動かして開く区間(ほかの 2 つはいまの値) */
export function oneTable(J) {
  const L = ['| 動かす値 | いまの値 | 開く区間(下端〜上端) | いまの値に対する倍 | 下端を決める組 | 上端を決める組 | いまは内か |', '|---|---:|---|---|---|---|---|'];
  for (const r of J.t3) L.push(`| ${SN[r.sym]} | ${fp(r.now)} | ${r.lo > 0 ? f5(r.lo) : '0'}〜${r.hi === null ? '上限なし' : f5(r.hi)} | ${r.lo > 0 ? f5(r.fLo) : '0'}〜${r.fHi === null ? '上限なし' : f5(r.fHi)} | ${fromTxt(r.loFrom)} | ${fromTxt(r.hiFrom)} | ${r.inside ? '内' : '外'} |`);
  return L.join('\n');
}
/** 表 5: 開いた所の共通部分 */
export function openTable(J) {
  const L = ['| 動かす値 | 開く端の倍 | k₂/Q | 共通部分(u) | 幅 | 下端を決める組 | 上端を決める組 | 0.98 |', '|---|---:|---:|---|---:|---|---|---|'];
  for (const r of J.t4) L.push(`| ${SN[r.sym]} | ${r.sym === 'c' ? '上端 ÷ ' + r.f : '下端 × ' + r.f} | ${f5(r.k)} | ${fp(r.lo)}〜${fp(r.hi)} | ${fp(r.width)} | ${pr(r.loFrom)} | ${pr(r.hiFrom)} | ${r.in098 ? '内' : '外'} |`);
  return L.join('\n');
}
/** 表 6: 全体の係数で読む 3 つの題 */
export function coefTable(J) {
  const L = ['| 題 | u | 全体の係数(= u ÷ 金星の条件の値) |', '|---|---|---|'];
  for (const r of J.t5.rows) L.push(`| ${r.name} | ${r.uLo === r.uHi ? fp(r.uLo) : (r.uLo > 0 ? fp(r.uLo) + '〜' : '≤ ') + fp(r.uHi)} | ${r.coefLo === r.coefHi ? fp(r.coefLo) : (r.coefLo > 0 ? fp(r.coefLo) + '〜' : '≤ ') + fp(r.coefHi)} |`);
  const nm = (id) => J.t5.rows.find((r) => r.id === id).name;
  L.push('', '| 重なり | u | 全体の係数 |', '|---|---|---|');
  for (const p of J.t5.pairs) L.push(`| ${nm(p.x)} ∩ ${nm(p.y)} | ${p.ov ? (p.ov.lo === p.ov.hi ? fp(p.ov.lo) : fp(p.ov.lo) + '〜' + fp(p.ov.hi)) : '重ならない'} | ${p.ov ? (p.ov.coefLo === p.ov.coefHi ? fp(p.ov.coefLo) : fp(p.ov.coefLo) + '〜' + fp(p.ov.coefHi)) : '—'} |`);
  return L.join('\n');
}
/** 表 7: 枝 c の端と枝 b の正本の主の行の端 */
export function seamTable(J) {
  return ['| 端 | 枝 b の正本の主の行 | 3 桁 | 枝 c の端(ノブ) | 同じか |', '|---|---:|---:|---:|---|',
    ...J.t6.rows.map((r) => `| ${r.end === 'lo' ? '下端' : '上端'} | ${f5(r.b)} | ${r.b3} | ${r.c} | ${r.same ? '同じ' : '違う'} |`)].join('\n');
}
export function tablesOf(J) { return { unit: unitTable(J), ratio: ratioTable(J), one: oneTable(J), open: openTable(J), coef: coefTable(J), seam: seamTable(J) }; }
/** 数の文(節に逐語) */
export function factsOf(J) {
  const sc = J.t2.ratios.find((r) => r.x === 's' && r.y === 'c'), gc = J.t2.ratios.find((r) => r.x === 'g' && r.y === 'c'), sg = J.t2.ratios.find((r) => r.x === 's' && r.y === 'g');
  const os = J.t3.find((r) => r.sym === 's'), oc = J.t3.find((r) => r.sym === 'c'), og = J.t3.find((r) => r.sym === 'g');
  return {
    shut: `いまの k₂/Q(共通 ${fp(J.decl.k0.c)}・固体 ${fp(J.decl.k0.s)}・気体 ${fp(J.decl.k0.g)})では、6 組の共通部分は空(下端 ${fp(J.pure.cur.lo)} > 上端 ${fp(J.pure.cur.hi)} —— 差は ${fp(J.pure.cur.gap)} 倍)。`,
    open: `共通部分が開くのは、固体 ÷ 共通 が ${f5(sc.lo)}〜${f5(sc.hi)}・気体 ÷ 共通 が ${f5(gc.hi)} より下・固体 ÷ 気体 が ${f5(sg.lo)} より上のとき(いまの固体 ÷ 共通 は ${fp(sc.now)} —— 下限の ${f5(sc.now / sc.lo)} 倍)。`,
    closed: `固体 ÷ 共通 の下限は、k₂/Q 1 あたりの X(u 1)の比 a(${MN[sc.loFrom.lo.mode]}・${BN[sc.loFrom.lo.body]})÷ a(${MN[sc.loFrom.hi.mode]}・${BN[sc.loFrom.hi.body]})= ${f5(sc.lo)}・上限はその逆の組の比 ${f5(sc.hi)}(地球と水星はどちらも固体 —— 2 つの端は同じ 2 つの a の比と、その逆数)。`,
    at098: `開いた共通部分の上端は、上端を決める組(${pr(J.pure.cur.hiFrom)})の k₂/Q に比例する —— 0.98 倍が 6 組の共通部分の内に入るのは、固体を ${f5(J.decl.k0.s * 0.98 / J.pure.cur.hi)} より上(いまの ${f5(0.98 / J.pure.cur.hi)} 倍)に置いたとき(共通と気体はいまの値)。`,
    one: `1 つの値だけを動かすと: 固体を ${f5(os.lo)} より上(いまの ${f5(os.fLo)} 倍)・または共通を ${f5(oc.hi)} より下(いまの ${f5(oc.fHi)} 倍)で開く。気体だけを動かしても開かない(気体の区間 0〜${og.hi === null ? '上限なし' : f5(og.hi)} はいまの値を含むが、固体 ÷ 共通 の条件は気体に依らない)。`,
  };
}
