// 第281便e(原仮定者の裁定(第71報)「UI のスキン(トンマナ・スタイル)を複数用意し、共通設定で選択可能に。
// 現状を既定の『ダーク』にし『ライト』を追加」): **スキンごとのコントラスト表を静的に解く純関数**。
// 第279便d の tests/lib-w279d-contrast.mjs(contrastTable・nonTextTable)をそのまま使い、html の CSS に
// 書かれたスキンの上書き規則(`html[data-skin="light"] …`)を「そのスキンで見えている規則の列」へ平らにして渡す。
// 表示だけ(物理・presetSig・保存 JSON に触れない)。ブラウザは使わない。
//
// ■ 平らにする規則(html の CSS の書き方に合わせた — 書き方を変えたらここを直す)
//   ・先頭が `html[data-…]`(属性条件の並び・`:not([data-…])`)の規則だけをスキンの規則とみなす。
//     条件は属性表 {skin, canvas} で評価する(skin: "dark"|"light"・canvas: "fixed"|"follow")。
//   ・条件の後ろが空(= html 要素そのもの)の規則のカスタムプロパティは :root の変数表を上書きする。
//   ・条件の後ろにセレクタがあり、宣言が**カスタムプロパティだけ**の規則は「部分木の変数表」として扱う
//     (例: ライトの固定キャンバスで #canvasWrap の中だけダークの値へ戻す)。部分木の中にある規則かどうかは
//     SCOPE_CTX(DOM の置き場所 — 第279便d の文脈表の ctx 名)で決める。
//   ・それ以外の宣言は、同じセレクタ・同じ @media の既定の規則へ上書きで合わせる(無ければ新しい規則)。
//   ・文脈表の半透明の層(手前モーダルの箱・幕・キャンバスの上の箱)は、LAYER_SRC のセレクタの背景を
//     平らにした規則から読み直す(ダークでは第279便d の文脈表の直書きと一致すること — selfCheck)。
import {
  extractStyle, parseRules, rootVars, darkRules, SKIN_PREFIX_RE, CONTEXTS, contrastTable, nonTextTable, summarize,
  resolveVars, parseColor, firstColorToken, over, ratio, hex,
} from './lib-w279d-contrast.mjs';

export const SKIN_VERSION = 'w281e-skin-1';
export const SKINS = ['dark', 'light'];
/** 既定のスキン(属性なしと同じ見え方)。 */
export const SKIN_DEFAULT = 'dark';

/** 文脈表の層を、どのセレクタの背景から読むか(手前 → 奥)。'var(--x)' はそのまま。 */
export const LAYER_SRC = {
  avCard: ['#avPanel .avCard', '.fmBox', '.fmModal', 'var(--bg)'],
  panelHead: ['#aboutPanel .beHead', '.fmModal', 'var(--bg)'],
  fmBox: ['.fmBox', '.fmModal', 'var(--bg)'],
  pmPanel: ['#pmPanel', '#canvasWrap'],
  bodyEdit: ['#bodyEdit', '#canvasWrap'],
  notice: ['#notice', '#canvasWrap'],
  canvas: ['#canvasWrap'],
};
/** 部分木の変数表が効く文脈(DOM の置き場所 — #canvasWrap の子: #hud・#notice・#bodyEdit・#pmPanel)。 */
export const SCOPE_CTX = { '#canvasWrap': ['pmPanel', 'bodyEdit', 'notice', 'canvas'] };
/** 操作部(ボタン・入力欄・選択・チップ)の輪郭を --line の差し替えで持つ規則の目印(AN10′)。 */
export const CONTROL_PROBE = '.btn';

const clone = (r) => ({ sel: r.sel, media: r.media, decl: { ...r.decl } });

/** スキン規則の先頭の条件を属性表で評価する。{ok, rest} — 先頭がスキン規則でなければ null。 */
export function evalSkinPrefix(sel, attrs) {
  const m = SKIN_PREFIX_RE.exec(sel);
  if (!m) return null;
  const head = m[0];
  let ok = true;
  for (const q of head.matchAll(/(:not\()?\[data-([\w-]+)(?:="([^"]*)")?\]\)?/g)) {
    const neg = !!q[1], key = q[2], val = q[3];
    const hit = val == null ? attrs[key] != null : attrs[key] === val;
    if (neg ? hit : !hit) { ok = false; break; }
  }
  return { ok, rest: sel.slice(head.length).trim() };
}

/**
 * html → そのスキンで見えている規則の列・変数表・部分木の変数表。
 * @param {string} html
 * @param {{skin?:string, canvas?:string}} attrs
 */
export function skinRules(html, attrs = {}) {
  const a = { skin: attrs.skin || SKIN_DEFAULT, canvas: attrs.canvas || 'fixed' };
  const all = parseRules(extractStyle(html));
  const base = darkRules(all).map(clone);
  const vars = { ...rootVars(base) };
  const scoped = {};
  const skinVarKeys = new Set();
  for (const r of all) {
    const ev = evalSkinPrefix(r.sel, a);
    if (!ev) continue;
    if (!ev.rest && /^html\[data-skin="light"\]$/.test(r.sel)) for (const k of Object.keys(r.decl)) if (k.startsWith('--')) skinVarKeys.add(k);
    if (!ev.ok) continue;
    if (!ev.rest) { for (const [k, v] of Object.entries(r.decl)) if (k.startsWith('--')) vars[k] = v; continue; }
    const keys = Object.keys(r.decl);
    if (keys.length && keys.every((k) => k.startsWith('--'))) {
      // :is(…) の中身は操作部の輪郭(--line)— 文字の表には効かない(controlBorder で別に読む)
      if (!/^:is\(/.test(ev.rest) && !/\s/.test(ev.rest)) scoped[ev.rest] = { ...(scoped[ev.rest] || {}), ...r.decl };
      continue;
    }
    const tgt = base.filter((x) => x.sel === ev.rest && x.media === r.media);
    if (tgt.length) for (const t of tgt) Object.assign(t.decl, r.decl);
    else base.push({ sel: ev.rest, media: r.media, decl: { ...r.decl } });
  }
  return { attrs: a, rules: base, vars, scoped, skinVarKeys: [...skinVarKeys] };
}

/** 規則の背景色(不透明 — 無ければ null)。 */
function ownBg(rules, sel, vars) {
  const r = rules.find((x) => x.sel === sel && !x.media && (x.decl.background || x.decl['background-color']));
  if (!r) return null;
  return firstColorToken(resolveVars(r.decl['background-color'] || r.decl.background, vars));
}

/** 平らにした規則から文脈表を組み直す(LAYER_SRC の行だけ差し替え・他は第279便d のまま)。 */
export function skinContexts(sk) {
  return CONTEXTS.map((c) => {
    const src = LAYER_SRC[c.ctx];
    if (!src) return c;
    const vars = varsOfCtx(sk, c.ctx);
    const layers = src.map((s) => (s.startsWith('var(') ? s : ownBg(sk.rules, s, vars)));
    if (layers.some((x) => !x)) return c;
    return { ...c, layers };
  });
}

function varsOfCtx(sk, ctx) {
  let v = sk.vars;
  for (const [sel, ctxs] of Object.entries(SCOPE_CTX)) if (ctxs.includes(ctx) && sk.scoped[sel]) v = { ...v, ...sk.scoped[sel] };
  return v;
}

/** スキンの文字の表・要約・非文字表・操作部の輪郭の比。 */
export function skinTable(html, attrs = {}) {
  const sk = skinRules(html, attrs);
  const contexts = skinContexts(sk);
  const ctxOf = (rule) => { const c = contexts.find((x) => x.re.test(rule.sel)); return c ? c.ctx : null; };
  const varsFor = (rule) => varsOfCtx(sk, ctxOf(rule));
  const { rows } = contrastTable(html, { rules: sk.rules, vars: sk.vars, varsFor, contexts });
  const sm = summarize(rows);
  const nonText = nonTextTable(html, { vars: sk.vars });
  // 操作部の輪郭(AN10′): .btn の上で効いている --line の値と、置き場所の背景(--panel2・--panel・--bg)との比
  const all = parseRules(extractStyle(html));
  let ctl = null;
  for (const r of all) {
    if (!('--line' in r.decl)) continue;
    const ev = evalSkinPrefix(r.sel, sk.attrs);
    const plain = !ev && r.sel === CONTROL_PROBE;
    const skinHit = ev && ev.ok && ev.rest === CONTROL_PROBE;
    if (plain || skinHit) ctl = r.decl['--line'];
  }
  const ctlC = ctl && parseColor(resolveVars(ctl, sk.vars));
  const controlBorder = ctlC ? ['--panel2', '--panel', '--bg'].map((b) => ({ bg: b, ratio: +ratio(ctlC, parseColor(resolveVars(sk.vars[b], sk.vars))).toFixed(2) })) : [];
  return { attrs: sk.attrs, rows, summary: sm, nonText, controlBorder: { value: ctl, rows: controlBorder },
    vars: sk.vars, skinVarKeys: sk.skinVarKeys, scoped: sk.scoped, contexts };
}

/** 変数集合の比較: :root の全キー・ライトの上書きキー・ライトに無いキー(形のトークン)。 */
export function varSets(html) {
  const all = parseRules(extractStyle(html));
  const root = Object.keys(rootVars(darkRules(all)));
  const light = [];
  for (const r of all) if (/^html\[data-skin="light"\]$/.test(r.sel)) for (const k of Object.keys(r.decl)) if (k.startsWith('--') && !light.includes(k)) light.push(k);
  const extra = light.filter((k) => !root.includes(k));
  const notOverridden = root.filter((k) => !light.includes(k));
  return { root, light, extra, notOverridden };
}

/** ダークで組み直した文脈表が第279便d の直書きと一致するか(平らにする手順の自己検査)。 */
export function selfCheck(html) {
  const sk = skinRules(html, { skin: 'dark' });
  const ctx = skinContexts(sk);
  const norm = (x) => { const c = parseColor(resolveVars(x, sk.vars)); return c ? hex(c) + '/' + (+c.a).toFixed(3) : String(x); };
  const bad = [];
  for (const c of ctx) {
    const o = CONTEXTS.find((x) => x.ctx === c.ctx);
    if (o.layers.map(norm).join('|') !== c.layers.map(norm).join('|')) bad.push(c.ctx);
  }
  return { ok: bad.length === 0, bad };
}

export { over, ratio, hex, parseColor };
