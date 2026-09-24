// 第279便d(原仮定者の裁定(第69報)「UI」— アプリ全体のトンマナ・デザインをクールかつ見易く調整。
// 例: 下地が紺色なのにタイトルが青色で読み辛い): **文字の前景/背景の組を html の CSS から静的に解き、
// WCAG 2.x のコントラスト比を出す純関数**。表示だけ(物理・presetSig・保存 JSON に触れない)。
//
// ■ 何を解くか
//   ・`<style>` の最初のブロック(コメントを除く)の規則を全部読み、`color:` を持つ規則を 1 行 = 1 組にする。
//     `:root` の CSS 変数(var(--x, fallback))を解く。@media の中の規則も読む(@keyframes は読まない)。
//   ・html 本文の要素の `style="…color:…"`(インライン)も 1 組にする(id を持つものだけ)。
//   ・背景は次の順で決める: ① その規則自身の background(-color) ② 同じセレクタから属性/擬似/状態を
//     外した「基の規則」の background ③ セレクタの文脈表 CONTEXTS(最初に当たった行 — 表の各行は
//     実際の DOM の置き場所に合わせて書いた。例: 説明タブ・パラメータの中身は #panel = --panel2)。
//     半透明の背景は下の層へ順に合成する(例: .fmBox = rgba(20,24,48,.96) を手前モーダルの半透明の幕
//     rgba(5,8,18,.78) と下地 --bg の上に重ねた色)。
//   ・規則が `opacity` を持つとき、前景色を背景へ opacity で混ぜた色で測る(子孫の文字が薄くなる分)。
//     color を持たずに opacity だけを持つ規則は、セレクタの最後の複合を外した親規則の色を継ぐ組として数える。
//   ・文字の大きさは font-size の px(calc(Npx*var(--uz,1)) は N)と font-weight で「大きい文字」
//     (≥24px、または ≥18.66px かつ太字 700 以上)を判定する。大きさを宣言していない規則は
//     **普通の文字(4.5:1)として数える**(保守側)。
//   ・非活性(`[disabled]`・`.lockedRow` の淡色 — WCAG 1.4.3 の例外「inactive UI component」)は
//     exempt として表に残すが下限割れには数えない。
// ■ 何をしないか
//   ・ブラウザで描かない(実際の画素・グラデーション・画像の上の文字は測らない)。文脈表の外の置き場所は
//     既定 --panel2 とみなす(表の `ctx` 列に「default」と出す — 監査できるように)。
//   ・枠線・フォーカスリングの非文字コントラスト(WCAG 1.4.11・3:1)は nonText として**参考表示**するだけで、
//     下限割れの件数(QA `ui.contrast` の判定)には入れない。
export const WCAG_NORMAL = 4.5;
export const WCAG_LARGE = 3.0;
export const WCAG_NONTEXT = 3.0;

/** `<style>` の最初のブロックの中身(無ければ '')。 */
export function extractStyle(html) {
  const m = /<style[^>]*>([\s\S]*?)<\/style>/i.exec(html);
  return m ? m[1] : '';
}

/** CSS を規則の列へ。{sel, decl:{prop:value}, media} — @keyframes は捨てる。 */
export function parseRules(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const walk = (s, media) => {
    let i = 0;
    while (i < s.length) {
      const open = s.indexOf('{', i);
      if (open < 0) break;
      const head = s.slice(i, open).trim();
      // 対応する閉じ括弧
      let d = 1, j = open + 1;
      while (j < s.length && d > 0) { if (s[j] === '{') d++; else if (s[j] === '}') d--; j++; }
      const body = s.slice(open + 1, j - 1);
      if (/^@media/i.test(head) || /^@supports/i.test(head)) walk(body, head);
      else if (/^@/.test(head)) { /* @keyframes 等は読まない */ }
      else {
        const decl = {};
        for (const part of body.split(';')) {
          const k = part.indexOf(':');
          if (k < 0) continue;
          const raw = part.slice(0, k).trim();
          const prop = raw.startsWith('--') ? raw : raw.toLowerCase();   // カスタムプロパティは大小文字を区別する
          const val = part.slice(k + 1).trim();
          if (prop) decl[prop] = val;
        }
        for (const sel of head.split(',').map((x) => x.trim()).filter(Boolean)) out.push({ sel, decl, media: media || null });
      }
      i = j;
    }
  };
  walk(src, null);
  return out;
}

/** :root の変数表(最初に現れた値)。 */
export function rootVars(rules) {
  const v = {};
  for (const r of rules) if (r.sel === ':root' && !r.media) for (const [k, x] of Object.entries(r.decl)) if (k.startsWith('--') && !(k in v)) v[k] = x;
  return v;
}

/** var(--x, fb) を解いた文字列(入れ子 3 段まで)。 */
export function resolveVars(val, vars) {
  let s = String(val);
  for (let n = 0; n < 4 && /var\(/.test(s); n++) {
    s = s.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, name, fb) => (name in vars ? vars[name] : (fb != null ? fb.trim() : '')));
  }
  return s.trim();
}

/** 色文字列 → {r,g,b,a}(0..255, a 0..1)。読めなければ null。 */
export function parseColor(s) {
  if (!s) return null;
  const t = String(s).trim().toLowerCase();
  if (t === 'transparent' || t === 'none') return { r: 0, g: 0, b: 0, a: 0 };
  if (t === '#fff' || t === 'white') return { r: 255, g: 255, b: 255, a: 1 };
  if (t === '#000' || t === 'black') return { r: 0, g: 0, b: 0, a: 1 };
  let m = /^#([0-9a-f]{3})$/.exec(t);
  if (m) { const h = m[1]; return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 }; }
  m = /^#([0-9a-f]{6})$/.exec(t);
  if (m) { const h = m[1]; return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }; }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(t);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] };
  return null;
}

/** background 宣言(shorthand 可)から最初の色トークン。 */
export function firstColorToken(s) {
  const t = String(s || '');
  const m = /(#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\)|\btransparent\b|\bnone\b|\bwhite\b|\bblack\b)/.exec(t);
  return m ? m[1] : null;
}

/** 上の色 top を下の不透明色 under に alpha 合成。 */
export function over(top, under) {
  const a = top.a == null ? 1 : top.a;
  return { r: top.r * a + under.r * (1 - a), g: top.g * a + under.g * (1 - a), b: top.b * a + under.b * (1 - a), a: 1 };
}

export function relLum(c) {
  const f = (x) => { const s = x / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
}

export function ratio(fg, bg) {
  const a = relLum(fg), b = relLum(bg);
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

export const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

/**
 * セレクタの文脈表(最初に当たった行)。layers は手前 → 奥の背景層(CSS 値 — var 可)。最奥は不透明であること。
 * 行は html の実際の置き場所に合わせた(置き場所が変わったらこの表を直す)。
 */
export const CONTEXTS = [
  // 画面手前のモーダル(このアプリについて・監査ビュー)— 箱は半透明 → 幕 → 下地
  { re: /#avPanel .*\.avCard|\.avCard/, ctx: 'avCard', layers: ['rgba(0,0,0,.18)', 'rgba(20,24,48,.96)', 'rgba(5,8,18,.78)', 'var(--bg)'] },
  { re: /#aboutPanel .*\.beHead|#avPanel .*\.beHead|#pmPanel .*\.beHead/, ctx: 'panelHead', layers: ['rgba(20,24,48,.98)', 'rgba(5,8,18,.78)', 'var(--bg)'] },
  { re: /#aboutPanel|#avPanel|\.fmBox|\.fmModal/, ctx: 'fmBox', layers: ['rgba(20,24,48,.96)', 'rgba(5,8,18,.78)', 'var(--bg)'] },
  // 相図・粒子の編集・通知・HUD — キャンバスの上
  { re: /#pmPanel|#pmStatus/, ctx: 'pmPanel', layers: ['rgba(20,24,48,.96)', '#05070f'] },
  { re: /#bodyEdit|#beCoreV2|#beCvDep|#beLay|#beLy|#beLcv|#beLin|^#be/, ctx: 'bodyEdit', layers: ['rgba(20,24,48,.94)', '#05070f'] },
  { re: /#notice/, ctx: 'notice', layers: ['rgba(20,24,48,.92)', '#05070f'] },
  { re: /#hud/, ctx: 'canvas', layers: ['#05070f'] },
  // 初見ガイド
  { re: /\.fvCard/, ctx: 'fvCard', layers: ['var(--panel2)'] },
  { re: /#fvOverlay|\.fvBox|#fvLang/, ctx: 'fvBox', layers: ['var(--panel)'] },
  // サンプルを選ぶ(箱は --panel・行のチップは --panel2)
  { re: /#ppModal|\.ppBox|\.ppHead|#ppSearch|#ppClose|\.ppChips|\.ppGroup|\.ppNote|\.ppRow|#ppList|\.roleChip|#roleLegend/, ctx: 'ppBox', layers: ['var(--panel)'] },
  // ヘッダー・操作列・タブ
  { re: /^header|#showAllSamplesWrap|#btnPresetPick|#dirtyBadge/, ctx: 'header', layers: ['var(--panel)'] },
  { re: /#transport/, ctx: 'transport', layers: ['var(--panel2)', 'var(--panel)'] },
  { re: /nav#tabs/, ctx: 'tabs', layers: ['var(--panel)'] },
  { re: /#btnPanelClose|#btnPanelExpand/, ctx: 'panelBtn', layers: ['var(--panel)'] },
  // タブの中身(#panel = --panel2)で自前の箱を持つもの
  { re: /\.pdesc|\.saveItem|\.customItem|input\.valIn|input\[type=text\]|textarea|\.btn\b/, ctx: 'panelInset', layers: ['var(--panel)'] },
  { re: /\.chainCard|\.chainHead|\.descBrief|\.ffBox|\.ffHead|\.ffFold|\.ffRow|\.classChip|\.statusChip|\.sbChip|\.miniBtn|#btnPerturb|\.familyLink/, ctx: 'panel2', layers: ['var(--panel2)'] },
];

/** 規則の背景(不透明色)と、どこから決めたか。 */
export function backgroundOf(rule, rules, vars) {
  const own = rule.decl['background-color'] || rule.decl.background;
  const tok = own ? firstColorToken(resolveVars(own, vars)) : null;
  const under = (layers) => {
    let c = parseColor(resolveVars(layers[layers.length - 1], vars));
    for (let i = layers.length - 2; i >= 0; i--) c = over(parseColor(resolveVars(layers[i], vars)), c);
    return c;
  };
  const ctxRow = CONTEXTS.find((x) => x.re.test(rule.sel));
  const ctxLayers = ctxRow ? ctxRow.layers : ['var(--panel2)'];
  if (tok) {
    const c = parseColor(tok);
    if (c && c.a > 0) return { bg: c.a >= 1 ? c : over(c, under(ctxLayers)), from: 'own' };
  }
  // 基の規則(属性・擬似・状態クラスを外す)
  const base = rule.sel.replace(/(\[[^\]]*\]|:{1,2}[\w-]+(\([^)]*\))?)+$/g, '').replace(/\.(on|open|playing|min|wide)$/, '');
  if (base !== rule.sel) {
    const b = rules.find((r) => r.sel === base && (r.decl.background || r.decl['background-color']));
    if (b) {
      const t2 = firstColorToken(resolveVars(b.decl['background-color'] || b.decl.background, vars));
      const c2 = t2 && parseColor(t2);
      if (c2 && c2.a > 0) return { bg: c2.a >= 1 ? c2 : over(c2, under(ctxLayers)), from: 'base:' + base };
    }
  }
  return { bg: under(ctxLayers), from: ctxRow ? ctxRow.ctx : 'default(panel2)' };
}

const pxOf = (fs) => { if (!fs) return null; const m = /([\d.]+)px/.exec(fs); return m ? +m[1] : null; };
const isBold = (fw) => fw != null && (/bold/.test(fw) || +fw >= 700);

/** 非活性(WCAG 1.4.3 の例外)の規則か。 */
export const isInactive = (sel) => /\[disabled\]|lockedRow/.test(sel);

/**
 * html → 文字の組の表。各行 {sel, media, fgDecl, fg, bg, bgFrom, opacity, px, bold, large, need, ratio, pass, exempt}
 */
export function contrastTable(html) {
  const rules = parseRules(extractStyle(html));
  const vars = rootVars(rules);
  const rows = [];
  const push = (rule, fgDecl, src) => {
    const fgStr = resolveVars(fgDecl, vars);
    let fg = parseColor(fgStr);
    if (!fg || fg.a === 0) return;
    const { bg, from } = backgroundOf(rule, rules, vars);
    const op = rule.decl.opacity != null ? +rule.decl.opacity : 1;
    if (fg.a < 1) fg = over(fg, bg);
    const fgEff = op < 1 ? over({ ...fg, a: op }, bg) : fg;
    const px = pxOf(rule.decl['font-size']);
    const bold = isBold(rule.decl['font-weight']);
    const large = px != null && (px >= 24 || (px >= 18.66 && bold));
    const need = large ? WCAG_LARGE : WCAG_NORMAL;
    const r = ratio(fgEff, bg);
    const exempt = isInactive(rule.sel);
    rows.push({ sel: rule.sel, media: rule.media, src, fgDecl, fg: hex(fgEff), bg: hex(bg), bgFrom: from,
      opacity: op, px, bold, large, need, ratio: +r.toFixed(2), pass: r >= need - 1e-9, exempt });
  };
  for (const r of rules) {
    if (r.sel === ':root' || /^(html|body|\*)/.test(r.sel) && !r.decl.color) continue;
    if (r.decl.color && !/inherit|currentcolor/i.test(r.decl.color)) push(r, r.decl.color, 'css');
    else if (r.decl.opacity != null && +r.decl.opacity < 1) {
      // color を継ぐ(最後の複合を外した親規則の色 — 無ければ --fg)
      const parent = r.sel.replace(/\s*[>+~]?\s*[^\s>+~]+$/, '').trim();
      const pr = parent && rules.find((x) => x.sel === parent && x.decl.color);
      push(r, pr ? pr.decl.color : 'var(--fg)', 'css-inherit:' + (pr ? parent : '--fg'));
    }
  }
  // インラインの style="…color:…"(id を持つ要素)
  const body = html.slice(html.indexOf('</style>'));
  const re = /<(\w+)\s[^>]*?id="([^"]+)"[^>]*?style="([^"]*?\bcolor:[^"]*)"/g;
  let m;
  while ((m = re.exec(body))) {
    const decl = {};
    for (const part of m[3].split(';')) { const k = part.indexOf(':'); if (k > 0) decl[part.slice(0, k).trim().toLowerCase()] = part.slice(k + 1).trim(); }
    if (!decl.color) continue;
    // インラインは CSS の !important が上書きしうる — 上書きがあればその色で数える
    const imp = rules.find((x) => x.sel === '#' + m[2] && /!important/.test(x.decl.color || ''));
    const col = imp ? imp.decl.color.replace(/!important/, '').trim() : decl.color;
    push({ sel: '#' + m[2], decl, media: null }, col, imp ? 'inline(overridden by css !important)' : 'inline');
  }
  return { vars, rows };
}

/** 非文字(枠線)の参考表示: 変数ごとに主要な背景との比。 */
export function nonTextTable(html) {
  const rules = parseRules(extractStyle(html));
  const vars = rootVars(rules);
  const bgs = ['--bg', '--panel', '--panel2'].filter((k) => k in vars);
  const out = [];
  for (const k of ['--line', '--acc', '--dim', '--focus']) {
    if (!(k in vars)) continue;
    const c = parseColor(resolveVars(vars[k], vars));
    if (!c) continue;
    for (const b of bgs) out.push({ fg: k, bg: b, ratio: +ratio(c, parseColor(vars[b])).toFixed(2), need: WCAG_NONTEXT });
  }
  return out;
}

/** 表の要約: 下限割れ(exempt を除く)の件数・その行。 */
export function summarize(rows) {
  const fails = rows.filter((r) => !r.pass && !r.exempt);
  const accRows = rows.filter((r) => /--acc\b/.test(r.fgDecl) || /--accText/.test(r.fgDecl));
  return { n: rows.length, fails: fails.length, failRows: fails, exempt: rows.filter((r) => r.exempt).length,
    minRatio: rows.filter((r) => !r.exempt).reduce((m, r) => Math.min(m, r.ratio), Infinity),
    accText: { n: accRows.length, min: accRows.reduce((m, r) => Math.min(m, r.ratio), Infinity) } };
}
