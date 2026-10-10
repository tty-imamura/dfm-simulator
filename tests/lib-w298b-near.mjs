// 第298便b(原仮定者の裁定(第88報)・統括の検証項目 R166): **「正本 ≠ 作り直し」の比較器の共通化**。
//
// ■ 何のため
//   tests/qa.mjs には、正本 JSON と同じ実行の中で作り直した値を葉ごとに照合する比較器が、ブロックごとに少しずつ違う形で
//   複数あった(deepNear・near288・near289・near290・near292・near293 …)。許容は「数は相対 1e-12・残差の鍵は絶対 1e-12」の
//   一律の規約で、**1e-23 級の量(meshVel の仕事 work)にも絶対 1e-12 を与えていた**(値より 11 桁大きい誤りも通る)。
//   ここに 1 つの比較器を置き、**量ごとの相対許容と絶対許容を鍵の規約(下の rules)で宣言**する。許容は尺度に合わせる ——
//   残差(本来 0 の量の丸め)は絶対の床、尺度の決まった小さな量はその尺度に合わせた絶対許容(work は 1e-20)。
//
// ■ 規約(tests/README §1 の表の機械版)
//   rules = [{ re, rel, abs, zero?, note }] —— where(「/」区切りの葉の道)に最初に当たった規則の許容で比べる(当たらなければ既定 def)。
//     判定: a === b、または |a − b| ≤ max(abs, rel · max(|a|, |b|))。abs は数か where を受ける関数(器の宣言した床など)。
//     zero:true は「本来 0 の残差」の規則(値の大きさは丸めの揺れ —— 尺度の監査 nearVacuous から外す)。
//   opts = { def:{rel,abs}, max(差の記録の上限・既定 5), keys:'strict'|'union', fmt:'json'|'short', nanEqual }
//     keys 'strict' … 両方の鍵の集合が同じでなければ「鍵」の差(旧 deepNear・near288 の流儀)
//     keys 'union'  … 鍵の和集合を走り、片方に無い鍵は値の差として出す・配列は長さも比べる(旧 near289〜near293 の流儀)
//     nanEqual      … NaN と NaN を同じと見る(旧 near292〔第292便d〕の Object.is の流儀)
// ■ 尺度の監査 nearVacuous(J, rules, opts): 正本の数の葉のうち、zero でない規則で **abs が |値| の ratio 倍(既定 1e3)を超える**ものを返す
//   (許容が値より何桁も大きく、照合が空になっている葉)。QA lint.near298 が使う。
export const NEAR_LIB_VERSION = 'w298b-near-1';

/** 葉の道 where に当たる規則(最初の 1 つ)と、その相対・絶対許容。 */
export function nearRuleOf(rules, where, def = { rel: 1e-12, abs: 0 }) {
  for (const r of rules || []) if (r.re.test(where)) {
    const abs = typeof r.abs === 'function' ? r.abs(where) : (r.abs || 0);
    return { rel: r.rel === undefined ? def.rel : r.rel, abs, rule: r };
  }
  return { rel: def.rel, abs: typeof def.abs === 'function' ? def.abs(where) : (def.abs || 0), rule: null };
}

/** 比較器を作る。戻り値 near(a, b, where, out) —— 差を out(文字列の配列)へ積む。 */
export function makeNear(rules = [], opts = {}) {
  const def = opts.def || { rel: 1e-12, abs: 0 };
  const max = opts.max === undefined ? 5 : opts.max;
  const union = opts.keys === 'union';
  const show = (v) => (opts.fmt === 'short' ? String(v).slice(0, 30) : JSON.stringify(v));
  const near = (a, b, where, out) => {
    if (out.length >= max) return;
    if (typeof a === 'number' && typeof b === 'number') {
      if (a === b || (opts.nanEqual && Number.isNaN(a) && Number.isNaN(b))) return;
      const t = nearRuleOf(rules, where, def);
      if (!(Math.abs(a - b) <= Math.max(t.abs, t.rel * Math.max(Math.abs(a), Math.abs(b))))) out.push(where + ' ' + a + '≠' + b);
      return;
    }
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') { if (a !== b) out.push(where + ' ' + show(a) + '≠' + show(b)); return; }
    if (Array.isArray(a) !== Array.isArray(b) || (union && Array.isArray(a) && a.length !== b.length)) { out.push(where + (union ? ' 形が違う' : ' 型')); return; }
    if (union) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) near(a[k], b[k], where + '/' + k, out); return; }
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (JSON.stringify(ka) !== JSON.stringify(kb)) { out.push(where + ' 鍵 ' + ka.join(',') + '≠' + kb.join(',')); return; }
    for (const k of ka) near(a[k], b[k], where + '/' + k, out);
  };
  return near;
}

/** 尺度の監査: zero でない規則(と既定)で、abs が |値| の ratio 倍を超える非零の数の葉(照合が空になっている葉)。 */
export function nearVacuous(J, rules = [], opts = {}) {
  const def = opts.def || { rel: 1e-12, abs: 0 };
  const ratio = opts.ratio === undefined ? 1e3 : opts.ratio;
  const hits = [];
  const walk = (v, where) => {
    if (typeof v === 'number') {
      if (!Number.isFinite(v) || v === 0) return;
      const t = nearRuleOf(rules, where, def);
      if (t.rule && t.rule.zero) return;
      if (t.abs > ratio * Math.abs(v)) hits.push({ where, value: v, abs: t.abs });
      return;
    }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], where + '/' + k);
  };
  walk(J, opts.root || '');
  return hits;
}

// ---- 鍵の規約の表(QA のブロックが名前で引く —— ブロックの中に同じ規則を書き写さない)----
/** 解析量だけの正本(第285便c の bgderiv など): 数は相対 1e-12・それ以外は一致(鍵の集合は厳密)。 */
export const RULES_ANALYTIC = [];
/** 第286便c の bgdiff: 残差(rel…・maxRel)は絶対 1e-12 の床(本来 0)・**meshVel の仕事 work は尺度に合わせて絶対 1e-20+相対 1e-6**
 *  (正本の値 1.17e-23 —— 1e-23 級の打ち消しの最下位の揺れを吸収し、旧規約の絶対 1e-12 が通していた 1e-20 より大きい誤りは通さない)。 */
export const RULES_BGDIFF = [
  { re: /\/work$/, rel: 1e-6, abs: 1e-20, note: 'meshVel の仕事(1e-23 級の打ち消し)—— 尺度に合わせた絶対 1e-20・相対 1e-6' },
  { re: /\/(rel[A-Za-z0-9]*|maxRel)$/, rel: 1e-12, abs: 1e-12, zero: true, note: '残差(本来 0)—— 絶対 1e-12 の床' },
];
/** 第288便c の照合: 差分の誤差(err・Err・relMax・BalanceRel)は相対 1e-4 か絶対 1e-10・次数は絶対 1e-3・他は相対 1e-12。 */
export const RULES_288C = [
  { re: /^(?=.*\/order(\/|$))(?=.*(err|Err|relMax|RelMax|BalanceRel)$)/, rel: 1e-4, abs: 1e-3, zero: true, note: '次数の下の差分の誤差 —— 相対 1e-4 か絶対 1e-3' },
  { re: /\/order(\/|$)/, rel: 1e-12, abs: 1e-3, zero: true, note: '次数(差分の比)—— 絶対 1e-3' },
  { re: /(err|Err|relMax|RelMax|BalanceRel)$/, rel: 1e-4, abs: 1e-10, zero: true, note: '差分の誤差 —— 相対 1e-4 か絶対 1e-10' },
];
/** 第289便c: 残差の鍵(…rel / rel… / sum / lastChange / Spread)は絶対 1e-12 だけ・他は相対 1e-12。 */
export const RULES_289C = [
  { re: /(rel|Rel|relMax|RelMax|sum|lastChange|Spread)(\/\d+)?$|\/rel[A-Z]\w*$/, rel: 0, abs: 1e-12, zero: true, note: '残差 —— 絶対 1e-12' },
];
/** 第290便c: 第289便c の残差に閉包・運動量の和(closure…・dP・sumMu・sumMxU・dL・dLbooked・closureAtPeri)を足す。 */
export const RULES_290C = [
  { re: /(rel|Rel|relMax|RelMax|sum|Spread)(\/\d+)?$|\/rel[A-Z]\w*$|\/(closure\w*|dP|sumMu|sumMxU|dL|dLbooked|closureAtPeri)(\/\d+)?$/, rel: 0, abs: 1e-12, zero: true, note: '残差・閉包 —— 絶対 1e-12' },
];
/** 第292便c: 残差の鍵(…rel / rel… / Rel… / jump… / interpRelMax… / bandRelMax / firstOrder)は絶対 1e-12。 */
export const RULES_292C = [
  { re: /(rel|Rel|RelMax|Spread)(\/\d+)?$|\/rel[A-Z\d]\w*$|\/(jumpAtRMax|interpRelMax\w*|bandRelMax|firstOrder)$/, rel: 0, abs: 1e-12, zero: true, note: '残差 —— 絶対 1e-12' },
];
/** 第293便e: 残差の鍵(res… / …Rel / rel… / diff…)は絶対 1e-12。 */
export const RULES_293E = [
  { re: /\/(res\w*|\w*Rel|rel\w*|diff\w*)$/, rel: 0, abs: 1e-12, zero: true, note: '残差 —— 絶対 1e-12' },
];
/** 第292便d: 残差の鍵(rel・relDJ・residual…・sumF・omegaEndRel・dJrel・rel…)は絶対 1e-12(NaN は NaN と同じ —— Object.is の流儀)。 */
export const RULES_292D = [
  { re: /\/(rel|relDJ|residual\w*|sumF|omegaEndRel|dJrel|rel[A-Z]\w*)(\/\d+)?$/, rel: 0, abs: 1e-12, zero: true, note: '残差 —— 絶対 1e-12' },
];
/** 規約の表の一覧(lint.near298 が鍵の規約の重複と尺度の監査に使う)。 */
export const NEAR_RULESETS = { RULES_ANALYTIC, RULES_BGDIFF, RULES_288C, RULES_289C, RULES_290C, RULES_292C, RULES_293E, RULES_292D };
