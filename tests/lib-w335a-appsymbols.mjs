// 第335便a(原仮定者の決断(2026-11-12)「AN641: A を進めて良い。以前は、説明文の変更で再生成の段が走っていた」・原仮定者の回答(2026-11-12 —— AN641)・
//   統括の検証項目 R328): **アプリの説明文の記号**(beta の html の文字列の中だけ —— 画面の文言・受理の理由・本の説明)の照合の lib。
//
// ■ 何をするか
//   html の inline script の**文字列の中**(注釈と識別子は数えない)に残る旧い記号 —— 背景慣性決定力 `W_bg`・背景決定力 `D_bg`・カッパに添字 0 の記号 ——
//   を 1 件ずつ領域(画面の文言の登録簿 I18N・受理の理由 ACCEPT_REASONS・AI の指示 SYSTEM_PROMPT・式の表 LAWS・退役の表 RETIRED_PRESETS・内蔵の本・
//   関数の中の文字列・生成領域 sample-status)と持ち主(本の id・関数の名・サンプルの id)に分け、**許可の一覧**(理由つき・件数つき)の外が 0 件かを見る。
//   置き換えの規則(第333便からの記号の規則): `W_bg` → `W₀`・`D_bg` → `D₀`・引きずり係数(10G₀/(C₁c₀²) —— 長さ/質量)の旧い記号 → `Y_k`。
//   **カッパに添字 0 の記号は 2 つの量に使われている** —— 引きずり係数と、形状の本(law:"coreField")の**中心重力の係数**(G·M_c/r_c³ —— 時間⁻²)。
//   後者は置き換えない(置き換えると式の意味が変わる)—— 許可の一覧は量で分ける(形状の本の 4 本だけ)・注記は 🎱 の概要の 1 か所(日英)。
//
// ■ 置き換えない件(許可の一覧 ALLOW_335A —— 件数が変われば落ちる)
//   ・関数の中の単独の文字列(エラーの文・凡例・状態の注記 —— 表示だけでも html の物理の部分の hash〔code〕に入る。物理の部分を動かしてまで置き換えない)
//   ・内蔵の本の fitRecord(フィットの記録 —— 本の物理の写し〔presets〕に入る欄)
//   ・形状の本の中心重力の係数(別の量)
//   ・静止背景の本(spaceMesh の lawVersion "scalar" —— 旧い決定力場の背景 = 新しい記号では D₀ の量。背景慣性決定力とは別の量 —— 置き換え先は決断待ち)
//   ・生成領域 sample-status(原稿 tests/data-w279a-samplestatus-src.json を直した —— 鎖の samplestatus の段が原稿から書き直すまでの遅れだけを許す)
//
// ■ しないこと
//   ・html・正本・原稿を書き換えない(読むだけ)。コードの名前(`Wbg`・`physics.relativeDrag.Wbg` のような保存の鍵)は数えない(別の綴り)。
import { scanJs, parseTopLevel } from './lib-w281a-scope.mjs';

export const APPSYM_VERSION_335A = 'w335a-appsym-1';
/** 旧い記号 → 新しい記号(説明文の規則)。 */
export const SYMBOLS_335A = Object.freeze([
  Object.freeze({ id: 'W_bg', re: /W_bg|W_\{bg\}/g, to: 'W₀', what: '背景慣性決定力' }),
  Object.freeze({ id: 'D_bg', re: /D_bg/g, to: 'D₀', what: '背景決定力' }),
  Object.freeze({ id: 'kappa0', re: /κ₀|κ_0|\\u03ba\\u2080/g, to: 'Y_k', what: '引きずり係数(旧い記号)—— 形状の本では中心重力の係数(別の量 —— 置き換えない)' }),
]);
/** 文の登録簿(最上位の宣言の名)と生成領域。 */
export const REGISTRIES_335A = Object.freeze(['I18N', 'ACCEPT_REASONS', 'LAWS', 'SYSTEM_PROMPT', 'RETIRED_PRESETS']);
export const GEN_REGIONS_335A = Object.freeze(['i18n', 'sample-status']);
/** 中心重力の係数を使う形状の本(law:"coreField")。 */
/** 静止背景の本(spaceMesh の lawVersion "scalar" で D0 を背景に読む本 —— `W_bg` は背景慣性決定力ではない)。 */
export const STATIC_BG_IDS_335A = Object.freeze(['galaxyAnalogyBHCompose', 'clusterAnalogyBH', 'clusterGrowthCopy', 'fixedCaptureCopy']);
export const CORE_FIELD_IDS_335A = Object.freeze(['shapeToyClusterCore', 'shapeToyDiskCore', 'shapeToyArmCore', 'shapeToySpiralCore']);
/** 注記(🎱 の概要 —— 日英 1 か所ずつ)。 */
export const CORE_NOTE_335A = Object.freeze({
  ja: '〔κ₀ は形状の本の中心重力の係数 [時間⁻²] —— 引きずり係数 Y_k とは別の量〕',
  en: '[k0 is the central-gravity coefficient of the shape books, in time^-2 - a different quantity from the drag coefficient Y_k]',
});
/**
 * 許可の一覧(置き換えない件 —— 記号・領域・持ち主・本の欄・件数・理由)。件数は**ちょうど**(増えても減っても落ちる —— 減ったら一覧を直す)。
 * region: 'code' = 関数の中の文字列(持ち主は最上位の関数・宣言の名)/ 'BUILTIN_PRESETS'(持ち主は本の id・key は本の最上位の欄)。
 */
const WHY_CODE = '関数の中の単独の文字列 —— 表示だけでも html の物理の部分の hash(code)に入る(置き換えると code の hash が動く)';
const WHY_FIT = '内蔵の本の fitRecord —— 本の物理の写し(presets の hash)に入る欄(置き換えると presets の hash が動く)';
const WHY_STATIC = '静止背景(spaceMesh の lawVersion "scalar" の D0 —— 旧い決定力場 W = W_bg + Σw_j の背景で、新しい記号では D₀ の量。背景慣性決定力 W₀ とは別の量 —— 置き換えると意味が変わる・置き換え先は決断待ち)';
const WHY_CORE = '形状の本の中心重力の係数 G·M_c/r_c³(時間⁻²)—— 引きずり係数とは別の量(置き換えると式の意味が変わる)';
export const ALLOW_335A = Object.freeze([
  { sym: 'W_bg', region: 'code', owner: 'geoInertialSetWbg', n: 3, why: WHY_CODE + '(引きずりの調整の拒否の文)' },
  { sym: 'W_bg', region: 'code', owner: 'bgLawCrossCheck', n: 1, why: WHY_CODE + '(宣言の照合の拒否の文)' },
  { sym: 'W_bg', region: 'code', owner: 'relDragLegacyGainWarn', n: 1, why: WHY_CODE + '(旧宣言の読み替えの警告)' },
  { sym: 'W_bg', region: 'code', owner: 'validateWbgEnv', n: 1, why: WHY_CODE + '(推定の環境の受理の文)' },
  { sym: 'W_bg', region: 'code', owner: 'wbgEstimateOf', n: 4, why: WHY_CODE + '(推定の注記)' },
  { sym: 'W_bg', region: 'code', owner: 'inertialDragShellState', n: 1, why: WHY_CODE + '(状態の注記)' },
  { sym: 'W_bg', region: 'code', owner: 'inertialDragPairState', n: 2, why: WHY_CODE + '(状態の注記)' },
  { sym: 'W_bg', region: 'code', owner: 'dragShellSelfCheck', n: 2, why: WHY_CODE + '(自己照合の拒否の文)' },
  { sym: 'W_bg', region: 'code', owner: 'drawDragFieldOn', n: 1, why: WHY_CODE + '(場の図の凡例)' },
  { sym: 'W_bg', region: 'code', owner: 'drawProbeFieldOn', n: 1, why: WHY_CODE + '(場の図の凡例)' },
  { sym: 'kappa0', region: 'code', owner: 'SIM_STATE_DERIVED', n: 1, why: WHY_CODE + '(状態の鍵の表の注記 —— 引きずり係数の読み口)' },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'earthMoonSunInertial3d', key: 'fitRecord', n: 1, why: WHY_FIT },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'mercurySunInertialFit', key: 'fitRecord', n: 6, why: WHY_FIT },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'plutoCharonInertialFit', key: 'fitRecord', n: 1, why: WHY_FIT },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'galaxyAnalogyBHCompose', key: '*', n: 14, why: WHY_STATIC },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'clusterAnalogyBH', key: '*', n: 1, why: WHY_STATIC },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'clusterGrowthCopy', key: '*', n: 5, why: WHY_STATIC },
  { sym: 'W_bg', region: 'BUILTIN_PRESETS', owner: 'fixedCaptureCopy', key: '*', n: 3, why: WHY_STATIC },
  { sym: 'kappa0', region: 'BUILTIN_PRESETS', owner: 'shapeToyClusterCore', key: '*', n: 12, why: WHY_CORE + ' —— 注記 1 か所を含む' },
  { sym: 'kappa0', region: 'BUILTIN_PRESETS', owner: 'shapeToyDiskCore', key: '*', n: 5, why: WHY_CORE },
  { sym: 'kappa0', region: 'BUILTIN_PRESETS', owner: 'shapeToyArmCore', key: '*', n: 5, why: WHY_CORE },
  { sym: 'kappa0', region: 'BUILTIN_PRESETS', owner: 'shapeToySpiralCore', key: '*', n: 8, why: WHY_CORE },
].map((x) => Object.freeze(x)));

const scriptOf = (html) => {
  const s = html.indexOf('<script>'), e = html.lastIndexOf('</script>');
  return s >= 0 && e > s ? { base: s + '<script>'.length, src: html.slice(s + '<script>'.length, e) } : { base: 0, src: '' };
};

/**
 * html の文字列の中の旧い記号を 1 件ずつ分類する(純関数)。
 * @param {string} html
 * @returns {{rows:Array<{sym,region,owner,key,line,text}>, outsideScript:number, why:string[]}}
 */
export function scanAppSymbols335a(html) {
  const why = [];
  const { base, src } = scriptOf(html);
  if (!src) why.push('inline script が無い');
  const sc = scanJs(src);
  const P = parseTopLevel(src);
  const genR = Object.fromEntries(GEN_REGIONS_335A.map((r) => {
    const a = src.indexOf('// >>> w275a-generated: ' + r), b = src.indexOf('// <<< w275a-generated: ' + r);
    if (!(a >= 0 && b > a)) why.push('生成領域が無い: ' + r);
    return [r, a >= 0 && b > a ? [a, b] : null];
  }));
  const segs = P.segments;
  let si = 0;
  const segAt = (p) => { while (si < segs.length && segs[si].end <= p) si++; return si < segs.length && segs[si].start <= p ? segs[si] : null; };
  const ls = [0]; for (let i = 0; i < html.length; i++) if (html.charCodeAt(i) === 10) ls.push(i + 1);
  const lineAt = (abs) => { let lo = 0, hi = ls.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ls[m] <= abs) lo = m; else hi = m - 1; } return lo + 1; };
  const hits = [];
  for (const S of SYMBOLS_335A) for (const m of src.matchAll(S.re)) hits.push({ p: m.index, len: m[0].length, sym: S.id });
  hits.sort((a, b) => a.p - b.p);
  const rows = [];
  for (const h of hits) {
    let inStr = true;
    for (let k = 0; k < h.len; k++) { const o = src[h.p + k]; if (!(sc.code[h.p + k] !== o && sc.nocom[h.p + k] === o)) inStr = false; }
    if (!inStr) continue;   // 注釈・識別子は数えない
    const seg = segAt(h.p);
    const names = seg ? seg.names : [];
    let region, owner = names.join(',') || '(stmt)', key = '';
    const g = Object.entries(genR).find(([, r]) => r && h.p >= r[0] && h.p < r[1]);
    if (g) {
      region = 'gen:' + g[0];
      if (g[0] === 'sample-status') {
        const ln = src.lastIndexOf('\n', h.p);
        const mm = /^"([^"]+)":\{/.exec(src.slice(ln + 1, ln + 200));
        owner = mm ? mm[1] : '?';
      } else owner = 'I18N';
    } else if (names.some((n) => REGISTRIES_335A.includes(n))) { region = names.find((n) => REGISTRIES_335A.includes(n)); owner = region; }
    else if (names.includes('BUILTIN_PRESETS')) {
      region = 'BUILTIN_PRESETS';
      const before = src.slice(seg.start, h.p);
      const ids = before.lastIndexOf('\n{ id:"');
      const mm = ids >= 0 ? /^\n\{ id:"([^"]+)"/.exec(before.slice(ids, ids + 200)) : null;
      owner = mm ? mm[1] : '?';
      const tail = ids >= 0 ? before.slice(ids) : before;
      const ks = [...tail.matchAll(/\n {2}([A-Za-z_$][\w$]*)\s*:/g)];
      key = ks.length ? ks[ks.length - 1][1] : '';
    } else region = 'code';
    const abs = base + h.p;
    rows.push({ sym: h.sym, region, owner, key, line: lineAt(abs), text: src.slice(Math.max(0, h.p - 40), h.p + 40).replace(/\n/g, ' ') });
  }
  // script の外(マークアップ)の出現(数えるだけ —— 0 を期待)
  const outside = (base > 0 ? html.slice(0, base) + html.slice(base + src.length) : html);
  let outsideScript = 0; for (const S of SYMBOLS_335A) outsideScript += (outside.match(S.re) || []).length;
  return { rows, outsideScript, why };
}

/** 原稿(サンプル状況)の表示の欄に旧い記号が残っているか(rows の id → 件数)。 */
export function srcOldSymbols335a(srcJsonText) {
  const out = {};
  let J; try { J = JSON.parse(srcJsonText); } catch (e) { return { error: '原稿を読めない' }; }
  for (const [id, r] of Object.entries(J.rows || {})) {
    const fields = [r.purpose, r.state, r.en && r.en.purpose, r.en && r.en.state].filter((x) => typeof x === 'string');
    let n = 0; for (const f of fields) for (const S of SYMBOLS_335A) n += (f.match(S.re) || []).length;
    if (n) out[id] = n;
  }
  return out;
}

/**
 * 照合: 許可の一覧の外が 0 件・許可の件数がちょうど・注記が 1 か所ずつ・生成領域は原稿の遅れだけ・script の外は 0。
 * @param {{html:string, srcJson:string}} o
 */
export function checkAppSymbols335a(o) {
  const bad = [], cases = [];
  const R = scanAppSymbols335a(o.html);
  for (const w of R.why) bad.push('走査: ' + w);
  const srcOld = srcOldSymbols335a(o.srcJson);
  if (srcOld.error) bad.push('原稿: ' + srcOld.error);
  else if (Object.keys(srcOld).length) bad.push('原稿のサンプル状況の表示の欄に旧い記号: ' + Object.entries(srcOld).map(([k, v]) => k + ' ' + v).join(', '));
  // 生成領域の行が原稿の遅れか: 行の表示の欄(目的・状況の日英)を新しい記号に置き換えると原稿と同じ・置き換える前は違う
  let SRCJ = null; try { SRCJ = JSON.parse(o.srcJson); } catch (e) { SRCJ = null; }
  const ssMemo = new Map();
  const ssLag = (id) => {
    if (ssMemo.has(id)) return ssMemo.get(id);
    let ok = false;
    try {
      const at = o.html.indexOf('\n"' + id + '":{"purpose":');
      const ln = at >= 0 ? o.html.slice(at + 1, o.html.indexOf('\n', at + 1)) : '';
      const row = ln ? JSON.parse('{' + ln.replace(/,\s*$/, '') + '}')[id] : null;
      const sr = SRCJ && SRCJ.rows && SRCJ.rows[id];
      const f = (x) => [x.purpose, x.state, x.en && x.en.purpose, x.en && x.en.state].map((v) => (typeof v === 'string' ? v : ''));
      const mapNew = (v) => SYMBOLS_335A.reduce((t, S) => t.replace(S.re, S.id === 'kappa0' ? '\u0000' : S.to), v);
      if (row && sr) { const a = f(row), b = f(sr); ok = a.some((v, i) => v !== b[i]) && a.every((v, i) => mapNew(v) === b[i]); }
    } catch (e) { ok = false; }
    ssMemo.set(id, ok);
    return ok;
  };
  const used = new Map();
  const outside = [];
  let lagging = 0;
  const byRegion = {};
  for (const r of R.rows) {
    const k0 = r.sym + ' ' + r.region; byRegion[k0] = (byRegion[k0] || 0) + 1;
    if (r.region === 'gen:sample-status') { if (!srcOld.error && ssLag(r.owner)) { lagging++; continue; } outside.push(r); continue; }
    const a = ALLOW_335A.find((x) => x.sym === r.sym && x.region === r.region && x.owner === r.owner && (x.region !== 'BUILTIN_PRESETS' || x.key === '*' || x.key === r.key));
    if (!a) { outside.push(r); continue; }
    used.set(a, (used.get(a) || 0) + 1);
  }
  for (const r of outside.slice(0, 8)) bad.push(`許可の外: ${r.sym} ${r.region} ${r.owner}${r.key ? '.' + r.key : ''} 行 ${r.line}「${r.text}」`);
  if (outside.length > 8) bad.push('許可の外 ほか ' + (outside.length - 8) + ' 件');
  for (const a of ALLOW_335A) { const n = used.get(a) || 0; if (n !== a.n) bad.push(`許可の件数: ${a.sym} ${a.region} ${a.owner}${a.key ? '.' + a.key : ''} が ${n}(宣言 ${a.n})`); }
  for (const id of new Set(ALLOW_335A.filter((a) => a.sym === 'kappa0' && a.region === 'BUILTIN_PRESETS').map((a) => a.owner))) if (!CORE_FIELD_IDS_335A.includes(id)) bad.push('中心重力の係数の許可が形状の本の外: ' + id);
  for (const a of ALLOW_335A.filter((x) => x.why === WHY_STATIC)) if (!STATIC_BG_IDS_335A.includes(a.owner)) bad.push('静止背景の許可が静止背景の本の外: ' + a.owner);
  for (const [lang, t] of Object.entries(CORE_NOTE_335A)) { const n = o.html.split(t).length - 1; if (n !== 1) bad.push(`注記(${lang})が ${n} か所(1 か所を期待)`); }
  if (R.outsideScript) bad.push('script の外(マークアップ)に旧い記号 ' + R.outsideScript + ' 件');
  const nAllow = ALLOW_335A.reduce((s, a) => s + a.n, 0);
  cases.push(`文字列の中の旧い記号 ${R.rows.length} 件(${Object.entries(byRegion).map(([k, v]) => k + ' ' + v).join('・')})= 許可 ${[...used.values()].reduce((s, v) => s + v, 0)}/${nAllow}(${ALLOW_335A.length} 項)+ 生成領域の原稿の遅れ ${lagging} + 許可の外 ${outside.length}`);
  cases.push(`注記 日英 各 1 か所・原稿の表示の欄 ${srcOld.error ? '読めない' : Object.keys(srcOld).length + ' 本'}・script の外 ${R.outsideScript}`);
  return { bad, cases, rows: R.rows, lagging, outside: outside.length };
}

/**
 * 変異の自己試験(実物の写しを壊して期待どおりに落ちる/通る —— 注釈と識別子は数えない)。
 * @param {{html:string, srcJson:string}} o
 */
export function selfTest335a(o) {
  const bad = [], cases = [];
  const H = o.html;
  const once = (s, a, b) => { const i = s.indexOf(a); return i < 0 ? null : s.slice(0, i) + b + s.slice(i + a.length); };
  const i18nAt = H.indexOf('// >>> w275a-generated: i18n');
  const firstStrAfter = (from) => { const i = H.indexOf(':"', from); return i < 0 ? null : i + 2; };
  const ins = (s, pos, t) => (pos == null ? null : s.slice(0, pos) + t + s.slice(pos));
  const accAt = H.indexOf('const ACCEPT_REASONS');
  const projAt = H.indexOf('\n{ id:"gclock"');
  const descAt = projAt >= 0 ? H.indexOf('summary:"', projAt) : -1;
  const fitAt = H.indexOf('\n  fitRecord:{"version":"w297b-1","parent":"mercurySunInertial"');
  const fnAt = H.indexOf("err:'W_bg が未推定(null)");
  const ssAt = H.indexOf('"mercurySunInertialFit":{"purpose":"');
  const M = [
    ['I18N の文に W_bg', ins(H, firstStrAfter(i18nAt), 'W_bg '), o.srcJson, true],
    ['受理の理由に D_bg', ins(H, accAt >= 0 ? H.indexOf("'", H.indexOf('"validate', accAt) + 10) + 1 : null, 'D_bg '), o.srcJson, true],
    ['形状の本でない本の説明にカッパに添字 0', ins(H, descAt >= 0 ? descAt + 'summary:"'.length : null, 'κ₀ '), o.srcJson, true],
    ['許可した関数の文字列の件数 +1', ins(H, fnAt >= 0 ? fnAt + "err:'".length : null, 'W_bg '), o.srcJson, true],
    ['fitRecord の件数 +1', ins(H, fitAt >= 0 ? fitAt + '\n  fitRecord:{"version":"'.length : null, 'W_bg'), o.srcJson, true],
    ['注記(日)を消す', once(H, CORE_NOTE_335A.ja, ''), o.srcJson, true],
    ['注記(英)を 2 か所に', once(H, CORE_NOTE_335A.en, CORE_NOTE_335A.en + ' ' + CORE_NOTE_335A.en), o.srcJson, true],
    ['原稿の表示の欄に W_bg', H, once(o.srcJson, '"係数移送版の写しで W₀', '"係数移送版の写しで W_bg'), true],
    ['生成領域に原稿と合わない W_bg', ins(H, ssAt >= 0 ? ssAt + '"mercurySunInertialFit":{"purpose":"'.length : null, 'W_bg '), o.srcJson, true],
    ['マークアップに W_bg', once(H, '</body>', '<p>W_bg</p></body>'), o.srcJson, true],
    ['code の表示の対({ja,en})に W_bg', once(H, 'function ckDeep(v){', 'const W335A_PAIR={ja:"W_bg",en:"x"};\nfunction ckDeep(v){'), o.srcJson, true],
    ['注釈の中の W_bg は数えない', once(H, 'function ckDeep(v){', '// W_bg D_bg κ₀ (注釈)\nfunction ckDeep(v){'), o.srcJson, false],
    ['識別子の W_bg は数えない', once(H, 'function ckDeep(v){', 'var W_bg335a=0;\nfunction ckDeep(v){'), o.srcJson, false],
    ['コードの名前 Wbg は数えない', ins(H, firstStrAfter(i18nAt), 'physics.relativeDrag.Wbg '), o.srcJson, false],
    ['無変更は通る', H, o.srcJson, false],
  ];
  let n = 0;
  for (const [nm, h, s, expectFail] of M) {
    if (h == null || s == null) { bad.push('変異を作れない: ' + nm); continue; }
    n++;
    const r = checkAppSymbols335a({ html: h, srcJson: s });
    const failed = r.bad.length > 0;
    if (failed !== expectFail) bad.push(`変異が期待と違う: ${nm}(${failed ? '落ちた' : '通った'})`);
    cases.push(nm + (expectFail ? ' → 落ちる' : ' → 通る'));
  }
  return { ok: bad.length === 0, n, bad, cases };
}

export default { APPSYM_VERSION_335A, SYMBOLS_335A, ALLOW_335A, CORE_FIELD_IDS_335A, STATIC_BG_IDS_335A, CORE_NOTE_335A, scanAppSymbols335a, srcOldSymbols335a, checkAppSymbols335a, selfTest335a };
