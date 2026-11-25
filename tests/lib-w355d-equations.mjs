// 第355便d(統括の検証項目 R507): **計算式の一覧(docs/EQUATIONS.md)に〔第353便zk〕の式を EQ-183 から載せた項の照合の純関数 —— 文書だけ**
//   (QA docs.equations355d が読む —— ファイルを読まない・状態を持たない。読むファイルは呼ぶ側が渡す: rd(経路) → 文字列か null・exists(経路) → 真偽)。
//   html・エンジン・内蔵の本・受理器・physics の鍵・既存の lib の本文・既存の項(EQ-01〜EQ-182)の行は変えない。項は第350便h の共通の読み手で読む。
//   世代の写し view353zzOf355d: 第353便zz の照合(docs.equations353zz)は「EQ-150 以降は EQ-150〜EQ-182 だけ」「項は 182」を見るので、EQ-183 以降の項と §2a の EQ-183 以降の参照を外した写し
//   (第350便h の eqFixedView350h(eq, 182) —— 第353便zz が第352便z に渡した写しと同じ型)で読む。照合の中身は変えない。
// ■ 言わないこと: 項は候補の式の索引(現実の宇宙の主張ではない)。潮汐のトルクは「比べる列(DFM の式ではない)」。ロックの状態は観測の事実として置く(積分で作らない)。
import * as ER from './lib-w350h-eqreader.mjs';
import * as T34 from './lib-w334f-terms.mjs';
import * as T37 from './lib-w337g-equations.mjs';

export const LIB_VERSION = 'w355d-equations-lib-1';
export const FIRST = 183, LAST = 189, PREV_LAST = 182;
export const SEC = 'zk', LIBNAME = 'lockdef';
export const PATHS = Object.freeze(['tests/exp-w353zk-lockdef.mjs', 'tests/lib-w353zk-lockdef.mjs', 'tests/out/lockdef-353zk.json']);
export const GRAV = '比べる列(DFM の式ではない)', PROV = '仮・未照合';
/** 列に係る項の印(出どころの節の時点の列の名 —— 主の列の置き直しで式とラベルは変わらない) */
export const MARK = '**出どころの節の時点の列の名(〔第353便zk〕)**: (ウ) 換算の係数 1・背景の大きさ = 金星の条件 (uV)〔当時の主の列〕/(ア) 換算の係数 1・u 0.98〔選択肢〕/(イ) 0.98 で金星を打ち消す換算の係数・u 0.98〔選択肢〕—— 主の列の置き直し(原仮定者の回答 2026-11-25)は、この項の式とラベルを変えない';
const KQ = '潮汐の k₂/Q(潮汐ロックの定義の比 X)(第353便zk)', KM = '自転の率と直交成分の置き方(第353便zk)', KS = '衛星の母天体の扁平の倍 σ(第353便zk)', KC = '主の列の候補 3 本((ア)(イ)(ウ))の並べ方(第353便zf)',
  KB = '(B − A)/C(ノブ —— 値は未照合)(第353便g)', KL = 'ロックの判定の量 (L1) 内合の位相・(L2) 軸の拘束・(L3) 率 ÷ 共鳴の幅(第353便g)';
/** 項ごとの錨: fns = 正本を作る関数(lib の名指しの定義)・eqs = 出どころの節と同じ字の式(数式版にも在る)・knobs = 台帳の行の名と状態・mark = 列の印の欄を持つ・grav = 比べる列の印・prov = 仮の値の印 */
export const ANCHOR = Object.freeze({
  'EQ-183': { name: '比 X(潮汐のトルク ÷ 軸引きずりの直交成分のトルク)と置き方 3 通り', fns: ['pureScenes', 'tideTorque', 'dragTorque', 'xOf', 'omOf'],
    eqs: ['比 X = 潮汐のトルク ÷ 軸引きずりの直交成分のトルク', '1.5 × k₂/Q × G M_相手² R⁵ ÷ a⁶', 'C M R² × 自転の率 × 直交成分', '観測の自転の率 × abs(Ω × ŝ)', '公転の率 × abs(Ω × ŝ)', 'σ = (1 − f)^(−2/3)'],
    knobs: [[KQ, '候補'], [KM, '候補'], [KS, '候補'], [KC, '候補']], mark: true, grav: true, prov: false },
  'EQ-184': { name: 'X = 1 になる自転周期と公転の周期との比', fns: ['pureScenes', 'pCrit', 'tideTorque'], eqs: ['X = 1 になる自転周期', '公転の周期との比'],
    knobs: [[KQ, '候補'], [KM, '候補']], mark: true, grav: true, prov: false },
  'EQ-185': { name: '線 1 と帯で分かれる判定と k₂/Q の範囲', fns: ['pureScenes', 'separateAt', 'xRows', 'k2qBand'], eqs: ['ロックの側の最小とロックしない側の最大', 'X は k₂/Q に比例', '線 1 で分かれる k₂/Q の範囲'],
    knobs: [[KQ, '候補'], [KM, '候補']], mark: true, grav: true, prov: false },
  'EQ-186': { name: '背景の倍率 u の範囲', fns: ['pureScenes', 'uBand', 'colParams', 'inRanges'], eqs: ['線 1 で分かれる u の範囲', 'これまでの窓 0.0487〜0.835'],
    knobs: [[KQ, '候補'], [KC, '候補']], mark: true, grav: true, prov: false },
  'EQ-187': { name: '金星 —— 地球の影響の比と要る量', fns: ['pureScenes', 'venusEarthRow', 'synAvg', 'gRows'], eqs: ['直交成分 ÷ 背景', '地球の潮汐(1 会合の平均)÷ 残り', '(ii) が届くのに要る (B − A)/C'],
    knobs: [[KQ, '候補'], [KB, '候補']], mark: true, grav: true, prov: false },
  'EQ-188': { name: 'ロックへ入る時間 ÷ 年齢と要る k₂/Q(比べる列)', fns: ['pureScenes', 'despinRows', 'despinSep'], eqs: ['ロックへ入る時間 ÷ 年齢', '年齢の内に入るのに要る k₂/Q'],
    knobs: [[KQ, '候補']], mark: false, grav: true, prov: false },
  'EQ-189': { name: '同時にロックの整数の並び N', fns: ['pureScenes', 'solarDaysN', 'nRow'], eqs: ['N(1 会合の間の太陽日の数)', 'N ≤ -3 が逆行・N ≥ -2 が順行'],
    knobs: [[KL, '候補']], mark: false, grav: false, prov: true },
});
export const IDS = Object.freeze(Object.keys(ANCHOR));
export const FIELDS = Object.freeze(['時間の単位', '実装か診断か', '正本を作る関数']);
export const S6_LINE = '第353便zk の候補の型の式(潮汐ロックの定義の不等式を読む比 X・X = 1 になる自転周期・線 1 と帯で分かれる判定と k₂/Q の範囲・背景の倍率 u の範囲・金星に地球の影響が届くかの比・ロックへ入る時間 ÷ 年齢・同時にロックの整数の並び)は EQ-183〜EQ-189 が拾う(第355便d —— 項は 189)。';
export const PH_HEAD = '〔第355便d — ';
export const AS_RE = /\n## 399\. 第355便d/;
export const AS_MUST = Object.freeze(['EQ-183〜EQ-189', '診断', 'docs.equations355d', 'docs.equations353zz', 'view353zzOf355d', 'SYSTEM_PROMPT には載せない', '現実の宇宙の主張ではない', GRAV, 'R507']);
export const PH_MUST = Object.freeze(['R507', '**表 1 足した項(EQ-183〜EQ-189)**', '**表 2 〔第353便zk〕の式の数え上げ', 'view353zzOf355d', 'docs.equations355d', 'docs.equations353zz', GRAV, '**文書だけ**']);
export const PM_LINE = 'DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.equations355d docs.equations353zz"';
// 書かない語(引用「」『』の中は数えない)
export const NOT_WORDS = Object.freeze([/型が決まった/, /式が決まった/, /決まった/, /決めた/, /確かめた/, /示した/, /合った/, /説明できた/, /導けた/, /フィットした/, /釣り合った/, /採用の式/, /ロックした/,
  /直った/, /対応した/, /通るようになった/, /再現/, /収束した/, /較正した/, /完全に一致/, /合わせられない/, /普遍定数/, /審査/, /法則を発見/, /第\d+報/]);
const cp = (a) => String.fromCodePoint(...a);
export const PRIVATE = Object.freeze([cp([0x43, 0x68, 0x61, 0x74, 0x47, 0x50, 0x54]), cp([0x47, 0x65, 0x6d, 0x69, 0x6e, 0x69]), cp([0x47, 0x72, 0x6f, 0x6b]), cp([0x6dfb, 0x4ed8]), cp([0x79c1, 0x4fe1]),
  cp([0x44, 0x45, 0x43, 0x49, 0x53, 0x49, 0x4f, 0x4e, 0x53, 0x5f, 0x4f, 0x50, 0x45, 0x4e]), cp([0x72, 0x6f, 0x61, 0x64, 0x6d, 0x61, 0x70, 0x5f, 0x68, 0x61, 0x6e, 0x64, 0x6f, 0x66, 0x66]), cp([0x53, 0x45, 0x43, 0x54, 0x49, 0x4f, 0x4e, 0x53])]);

export const stripQ = (t) => String(t || '').replace(/「[^「」]*」/g, '').replace(/「[^「」]*」/g, '').replace(/『[^』]*』/g, '');
export const stripCode = (t) => String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
export const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
/** PHYSICS の節(見出しの行から、次の節の見出しか「## 」の前まで) */
export const physSecOf = (ph, head) => { const i = String(ph || '').indexOf('\n' + head); if (i < 0) return ''; const m = /\n〔第\d+便[a-z]* — |\n〔第\d+便 — |\n## /g; m.lastIndex = i + 2; const z = m.exec(ph); return ph.slice(i + 1, z ? z.index : ph.length); };
/** 世代の写し: 第353便zz の照合へ渡す EQ-182 までの写し */
export function view353zzOf355d(eq) { return ER.eqFixedView350h(String(eq || ''), PREV_LAST); }
const field = (text, f) => ((new RegExp('\\n- \\*\\*' + f.replace(/[()]/g, '\\$&') + '\\*\\*: ([^\\n]+)')).exec(text) || [])[1] || '';
const secUntil = (as, re) => { const i = as.search(re); if (i < 0) return ''; const j = as.indexOf('\n## ', i + 1); return as.slice(i, j < 0 ? as.length : j); };

/**
 * 照合: inp = { eq, ph, as, pm, rd(経路) → 文字列|null, exists(経路) → 真偽 }。返す { bad: [違反の文], cases: [数えた所の文] }。
 * ① 番号の連続と重複・EQ-183 以降は EQ-183〜EQ-189 だけ ② 欄・出どころの節と同じ字の式・経路・抜粋の範囲・台帳・列の印・比べる列・仮の値 ③ §3 の行・§6 の件数の文
 * ④ 世代の写し(EQ-182 までが元と同じ・EQ-183 以降と §2a の参照が無い) ⑤ PHYSICS〔第355便d〕(位置・表 1・表 2・必須の語)・AI_SPEC §399・post-merge ⑥ 書かない語
 */
export function check355d(inp) {
  const { eq, ph, as, pm, rd, exists } = inp, bad = [], cases = [];
  const all = ER.eqItems350h(eq), A = ER.eqAudit350h(eq), nw = all.filter((z) => z.num >= FIRST);
  // ①
  if (A.dups.length) bad.push('① 項の番号が重複(' + A.dups.join('・') + ')');
  if (A.firstGap) bad.push('① 項の番号が EQ-01 から連続でない(最初の外れ EQ-' + String(A.firstGap).padStart(2, '0') + '・項 ' + A.n + ')');
  if (nw.map((z) => z.id).join('|') !== IDS.join('|')) bad.push('① EQ-183 以降の項の番号: ' + (nw.map((z) => z.id).join('・') || '無い'));
  if (all.filter((z) => z.num > PREV_LAST - 33 && z.num <= PREV_LAST).length !== 33) bad.push('① EQ-150〜EQ-182 の 33 項がそろわない');
  cases.push(`① 項の番号 EQ-01〜EQ-${A.last} の連続と重複(${A.n} 項 —— 4 桁まで読む)・EQ-183 以降は ${nw.length} 項`);
  // ②
  const st = new Map(T37.parseKnobLedger337g(T37.policySection337g(ph)).rows.map((r) => [r[0], r[6]]));
  const ps = physSecOf(ph, '〔第353便' + SEC + ' — '), libSrc = rd(PATHS[1]) || '', expSrc = rd(PATHS[0]) || '';
  if (!ps) bad.push('② 出どころの節 〔第353便' + SEC + '〕 が PHYSICS に無い');
  let nA = 0, nB = 0, nG = 0, nK = 0, nF = 0, nM = 0;
  for (const id of IDS) {
    const a = ANCHOR[id], it = all.find((z) => z.id === id);
    if (!it) { bad.push('② ' + id + ' が無い'); continue; }
    if (it.label !== '診断') bad.push('② ' + id + ' のラベル「' + it.label + '」が 診断 でない');
    if (T37.IMPL_MARK_337G.test(stripCode(it.text).replace(/\n- \*\*ラベル\*\*: [^\n]*/, ''))) bad.push('② ' + id + ' に実装の印');
    if (!(it.physRefs.length >= 1 && it.physRefs[0].head === '〔第353便' + SEC + ' — ')) bad.push('② ' + id + ' の PHYSICS の節の行の先頭が 〔第353便' + SEC + '〕 でない');
    const fm = field(it.text, '数式版');
    for (const w of a.eqs) { nA++; if (fm.indexOf(w) < 0) bad.push('② ' + id + ' の数式版に式「' + w.slice(0, 24) + '」が無い'); else if (ps.indexOf(w) < 0) bad.push('② ' + id + ' の式「' + w.slice(0, 24) + '」が出どころの節に同じ字で無い'); }
    for (const f of FIELDS) { nF++; if (!field(it.text, f)) bad.push('② ' + id + ' に欄「' + f + '」が無い'); }
    const tu = field(it.text, '時間の単位'); if (tu && !/絶対時間|当事者時間|時間を含まない/.test(tu)) bad.push('② ' + id + ' の時間の単位の欄に単位の語が無い');
    const kd = field(it.text, '実装か診断か'); if (kd && kd.indexOf('診断') !== 0) bad.push('② ' + id + ' の実装か診断かの欄が「診断」で始まらない');
    const mk = field(it.text, '正本を作る関数');
    if (mk.indexOf('器 `' + PATHS[0] + '` の `runAll`') < 0 || !T34.defSpan334f(expSrc, 'runAll')) bad.push('② ' + id + ' の正本を作る関数に器の runAll が無いか、器に runAll の定義が無い');
    for (const fn of a.fns) { if (mk.indexOf('`' + fn + '`') < 0) bad.push('② ' + id + ' の正本を作る関数に ' + fn + ' が無い'); else if (!T34.defSpan334f(libSrc, fn)) bad.push('② ' + id + ' の正本を作る関数 ' + fn + ' が lib に無い'); }
    const srcLine = field(it.text, '出どころ');
    for (const p of PATHS) { if (srcLine.indexOf('`' + p + '`') < 0) bad.push('② ' + id + ' の出どころに ' + p + ' が無い'); else if (!exists(p)) bad.push('② ' + id + ' の出どころの経路 ' + p + ' が実在しない'); }
    if (!it.blocks.length) bad.push('② ' + id + ' にプログラム版が無い');
    for (const b of it.blocks) { nB++;
      const wh = id + ' の抜粋 ' + b.k + '(' + b.file + ' · ' + b.name + ')';
      if (b.file !== PATHS[1]) { bad.push('② ' + wh + ' が出どころの lib でない'); continue; }
      const span = T34.defSpan334f(libSrc, b.name);
      if (!span) { bad.push('② ' + wh + ': 名の定義が無い'); continue; }
      const ns = norm(span);
      b.frags.forEach((f, mi) => { nG++; const nf = norm(f); if (!nf || ns.indexOf(nf) < 0) bad.push('② ' + wh + ' の断片 ' + (mi + 1) + ' が定義の範囲に無い: «' + nf.slice(0, 50) + '»');
        const ln = f.split('\n').length; if (ln > 6 || nf.length > 320) bad.push('② ' + wh + ' の断片 ' + (mi + 1) + ': 長い(' + ln + ' 行・' + nf.length + ' 字 —— 6 行・320 字まで)'); }); }
    const kl = field(it.text, 'ノブの台帳'), pairs = [...kl.matchAll(/「((?:[^「」]|「[^「」]*」)+)」\(([^()]+)\)/g)].map((m) => [m[1], m[2]]);
    if (pairs.map((p) => p.join('|')).join('/') !== a.knobs.map((p) => p.join('|')).join('/')) bad.push('② ' + id + ' のノブの台帳の欄の行が錨と違う');
    for (const [nm, s] of pairs) { nK++; if (!st.has(nm)) bad.push('② ' + id + ' の台帳の行「' + nm.slice(0, 24) + '」が表 2 に無い'); else if (st.get(nm) !== s) bad.push('② ' + id + ' の台帳の行「' + nm.slice(0, 24) + '」の状態「' + s + '」が表 2 の「' + st.get(nm) + '」と違う'); }
    const ex = field(it.text, '解説'); if (!ex) bad.push('② ' + id + ' に解説が無い');
    const nMark = (it.text.match(/\n- \*\*主の列の印\*\*: /g) || []).length, mkl = field(it.text, '主の列の印');
    if (a.mark) { nM++; if (!(nMark === 1 && mkl === MARK)) bad.push('② ' + id + ' の列の印の欄(1 行・出どころの節の時点の列の名)'); }
    else if (nMark) bad.push('② ' + id + ' は列に係らない式なのに印の欄が在る');
    if (a.grav) { if (!(fm.indexOf(GRAV) >= 0 && ex.indexOf(GRAV) >= 0)) bad.push('② ' + id + ' の比べる列の印(数式版と解説に「' + GRAV + '」)'); }
    else if (/潮汐のトルク|重力の側/.test(fm) && fm.indexOf(GRAV) < 0) bad.push('② ' + id + ' の数式版に潮汐のトルクが在るのに「' + GRAV + '」が無い');
    if (a.prov && fm.indexOf(PROV) < 0) bad.push('② ' + id + ' の数式版に仮の値の印「' + PROV + '」が無い');
  }
  cases.push(`② EQ-183〜EQ-189(診断)—— 出どころの節〔第353便zk〕と同じ字の式 ${nA}・欄 ${nF}・出どころの経路・抜粋 ${nB}・断片 ${nG}・台帳の欄 ${nK} 行・列の印 ${nM} 項・比べる列の印・仮の値の印`);
  // ③
  const s3 = ER.eqSection350h(eq, '3');
  for (const id of IDS) { const it = all.find((z) => z.id === id); if (!s3.split('\n').some((l) => it && l === '| ' + id + ' | ' + it.title + ' | ' + it.label + ' |')) bad.push('③ §3 の一覧に ' + id + ' の行が無い'); }
  const s6 = ER.eqSection350h(eq, '6');
  if (s6.indexOf('\n' + S6_LINE) < 0 || all.length !== LAST) bad.push('③ §6 の件数の文(EQ-183〜EQ-189・項は 189)');
  cases.push(`③ §3 の ${IDS.length} 行・§6 の件数の文(項 ${all.length})`);
  // ④ 世代の写し
  const V = view353zzOf355d(eq), vi = ER.eqItems350h(V), keep = all.filter((z) => z.num <= PREV_LAST);
  if (!(vi.length === PREV_LAST && vi.every((z, k) => keep[k] && keep[k].id === z.id && keep[k].text === z.text))) bad.push('④ 世代の写し(view353zzOf355d)の EQ-01〜EQ-182 が元の項と違う');
  if (vi.some((z) => z.num > PREV_LAST) || ER.eqRefs350h(ER.eqSection350h(V, '2a')).some((r) => ER.eqNum350h(r) > PREV_LAST)) bad.push('④ 世代の写しに EQ-183 以降が残る');
  if (V.indexOf('\n' + S6_LINE) < 0) bad.push('④ 世代の写しで §6 の第355便d の文が消える(写しは項と §2a の参照だけを外す)');
  cases.push(`④ 第353便zz の照合の世代の写し(view353zzOf355d —— EQ-183 以降の項と §2a の参照を外す・EQ-01〜EQ-182 の ${vi.length} 項は元と同じ)`);
  // ⑤
  const sec = physSecOf(ph, PH_HEAD), i54 = ph.indexOf('\n〔第354便a — '), iMe = ph.indexOf('\n' + PH_HEAD), i328 = ph.indexOf('\n〔第328便 — 統括');
  if (!(sec && i54 >= 0 && i54 < iMe && iMe < i328)) bad.push('⑤ PHYSICS〔第355便d〕の位置(〔第354便a〕より後・統括の節より前)');
  for (const w of PH_MUST) if (sec.indexOf(w) < 0) bad.push('⑤ PHYSICS〔第355便d〕に「' + w.slice(0, 24) + '」が無い');
  const rows = sec.split('\n');
  for (const id of IDS) if (!rows.includes('| ' + id + ' | 〔第353便' + SEC + '〕 | ' + ANCHOR[id].name + ' | 診断 |')) bad.push('⑤ PHYSICS〔第355便d〕の表 1 に ' + id + ' の行が無い');
  let nE = 0;
  for (const id of IDS) for (const w of ANCHOR[id].eqs) { nE++; if (!rows.some((l) => l.indexOf('| ') === 0 && l.indexOf(w) >= 0 && l.indexOf(id) >= 0)) bad.push('⑤ PHYSICS〔第355便d〕の表 2 に式「' + w.slice(0, 20) + '」(' + id + ')の行が無い'); }
  const ai = secUntil(as, AS_RE), i395 = as.search(/\n## 395\. 第354便a/);
  if (!(ai && i395 >= 0 && i395 < as.search(AS_RE))) bad.push('⑤ AI_SPEC §399 の位置(§395 の後)');
  for (const w of AS_MUST) if (ai.indexOf(w) < 0) bad.push('⑤ AI_SPEC §399 に「' + w.slice(0, 24) + '」が無い');
  const p0 = pm.indexOf('# ==== 第354便a の塊(ここまで)===='), p1 = pm.indexOf('# ==== 第355便d の塊(ここから)===='), p2 = pm.indexOf('# ==== 第355便d の塊(ここまで)====');
  if (!(p0 >= 0 && p0 < p1 && p1 < p2 && pm.slice(p1, p2).indexOf(PM_LINE) >= 0)) bad.push('⑤ post-merge に第355便d の塊(第354便a の塊の後)');
  cases.push(`⑤ PHYSICS〔第355便d〕(位置・表 1 の ${IDS.length} 行・表 2 の式 ${nE})・AI_SPEC §399・post-merge の塊`);
  // ⑥
  let nW = 0;
  const s6z = (s6.split('\n').find((l) => l.indexOf('(第355便d —— 項は') >= 0)) || '';
  for (const [nm, tx] of [['§6 の第355便d の文', s6z], ['AI_SPEC §399', ai], ['PHYSICS〔第355便d〕', sec]].concat(nw.map((z) => [z.id, z.text]))) {
    const s = stripQ(tx);
    for (const re of NOT_WORDS) if (re.test(stripCode(s))) bad.push('⑥ ' + nm + ' に書かない語 ' + re.source);
    for (const w of PRIVATE) if (String(tx).indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に private の文書の名か書かない語(' + w.length + ' 字)');
    for (const b of T37.wordAudit337g(nm, tx)) bad.push('⑥ ' + b);
    for (const w of T34.DECIDE_WORDS_334F) if (stripCode(s).indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に主の型を決めた語(' + w.length + ' 字)');
    if (stripCode(s).indexOf('法則') >= 0) bad.push('⑥ ' + nm + ' に式を指す「法則」の語(候補の式・診断の式と書く)');
    if (stripCode(s).indexOf('回転' + '引きずり') >= 0) bad.push('⑥ ' + nm + ' に旧称(円盤引きずりと書く)');
    nW++;
  }
  cases.push(`⑥ 書かない語(${NOT_WORDS.length} 型・private の文書の名 ${PRIVATE.length}・第337便までの禁句・主の型を決めた語・「法則」・旧称)—— ${nW} 本`);
  return { bad, cases };
}

/** 変異の写し(名・入力・期待の違反の型 —— null は通ること)。inp を元に作る */
export function mutations355d(inp) {
  const { eq, ph, as, pm } = inp;
  const blk = (id) => new RegExp('(### ' + id + ' [\\s\\S]*?)(?=\\n### |\\n## )');
  const inItem = (id, a, b) => eq.replace(blk(id), (m) => m.replace(a, b));
  const inSec = (a, b) => { const s = physSecOf(ph, PH_HEAD); return s ? ph.replace(s, s.replace(a, b)) : ph; };
  const E = (e) => ({ ...inp, eq: e }), P = (p) => ({ ...inp, ph: p }), S = (s) => ({ ...inp, as: s }), M = (m) => ({ ...inp, pm: m });
  return [
    ['EQ-185 の番号を EQ-195 に', E(eq.replace('\n### EQ-185 ', '\n### EQ-195 ')), /^① 項の番号が EQ-01 から連続でない/],
    ['EQ-187 を 2 つにする(番号の重複)', E(eq.replace('\n### EQ-188 ', '\n### EQ-187 ')), /^① 項の番号が重複/],
    ['EQ-183 の式の字を節と違える(数式版)', E(inItem('EQ-183', 'C M R² × 自転の率 × 直交成分', 'C M R² × 自転の速さ × 直交成分')), /^② EQ-183 の数式版に式「C M R² × 自転の率 × 直交成分」が無い/],
    ['EQ-184 のラベルを実装〔opt-in〕に', E(eq.replace(/(### EQ-184 [^\n]*\n\n- \*\*ラベル\*\*: )診断/, '$1実装〔opt-in〕')), /^② EQ-184 のラベル/],
    ['EQ-186 の正本を作る関数の名を 1 字変える', E(inItem('EQ-186', '`uBand`(線 1', '`uBanb`(線 1')), /^② EQ-186 の正本を作る関数に uBand が無い/],
    ['EQ-189 の抜粋の断片の 1 字違い', E(inItem('EQ-189', 'f = 1 / P.orbV + N / S;', 'f = 1 / P.orbV - N / S;')), /^② EQ-189 の抜粋 2\(tests\/lib-w353zk-lockdef\.mjs · nRow\) の断片 1 が定義の範囲に無い/],
    ['EQ-187 の台帳の欄の状態を対照に', E(inItem('EQ-187', '値は未照合)(第353便g)」(候補)', '値は未照合)(第353便g)」(対照)')), /^② EQ-187 の台帳の行「\(B − A\)\/C/],
    ['EQ-185 の列の印を消す', E(inItem('EQ-185', /\n- \*\*主の列の印\*\*: [^\n]*/, '')), /^② EQ-185 の列の印の欄/],
    ['EQ-188(列に係らない式)に列の印を足す', E(inItem('EQ-188', '\n- **プログラム版 1**', '\n- **主の列の印**: ' + MARK + '\n- **プログラム版 1**')), /^② EQ-188 は列に係らない式なのに印の欄が在る/],
    ['EQ-184 の数式版から比べる列の印を消す', E(inItem('EQ-184', '潮汐のトルクは **' + GRAV + '**', '潮汐のトルクは重力の側')), /^② EQ-184 の比べる列の印/],
    ['EQ-189 の数式版から仮の値の印を消す', E(inItem('EQ-189', '(金星の自転周期は ' + PROV + ')', '')), /^② EQ-189 の数式版に仮の値の印/],
    ['EQ-183 の出どころの経路の字を変える', E(inItem('EQ-183', '正本 `tests/out/lockdef-353zk.json`', '正本 `tests/out/lockdef-353zz.json`')), /^② EQ-183 の出どころに tests\/out\/lockdef-353zk\.json が無い/],
    ['§3 の EQ-186 の行を消す', E(eq.replace(/\n\| EQ-186 \| [^\n]*/, '')), /^③ §3 の一覧に EQ-186 の行が無い/],
    ['§6 の件数の文を消す', E(eq.replace('\n\n' + S6_LINE, '')), /^③ §6 の件数の文/],
    ['既存の項 EQ-182 の行を写しの外で変える(世代の写しの照合)', E(inItem('EQ-182', '暦表の値と照らして合否にしない。', '暦表の値と照らして合否にしない(注)。')), null],
    ['PHYSICS〔第355便d〕の表 1 から EQ-189 の行を消す', P(inSec(/\n\| EQ-189 \| 〔第353便zk〕 [^\n]*/, '')), /^⑤ PHYSICS〔第355便d〕の表 1 に EQ-189 の行が無い/],
    ['PHYSICS〔第355便d〕を統括の節の後(末尾)へ', P(ph.replace('\n' + physSecOf(ph, PH_HEAD), '') + '\n' + physSecOf(ph, PH_HEAD)), /^⑤ PHYSICS〔第355便d〕の位置/],
    ['AI_SPEC §399 から鍵の名を消す', S(as.replace('- QA `docs.equations355d`', '- QA')), /^⑤ AI_SPEC §399 に「docs\.equations355d」が無い/],
    ['post-merge の第355便d の塊の鍵の行を消す', M(pm.replace(PM_LINE, '')), /^⑤ post-merge に第355便d の塊/],
    ['項に「法則」の語を書く', E(inItem('EQ-186', '範囲を窓に足すか否かは書かない(候補の表)。', '範囲を窓に足すか否かは書かない法則。')), /^⑥ EQ-186 に式を指す「法則」の語/],
    ['項に「第〜報」の番号を書く', E(inItem('EQ-186', '範囲を窓に足すか否かは書かない(候補の表)。', '範囲を窓に足すか否かは書かない(第154報)。')), /^⑥ EQ-186 に書かない語 第\\d\+報/],
    ['項に private の文書の名', E(inItem('EQ-186', '範囲を窓に足すか否かは書かない(候補の表)。', '範囲を窓に足すか否かは書かない(' + PRIVATE[3] + 'の検討)。')), /^⑥ EQ-186 に private の文書の名か書かない語/],
    ['書かない語を「」の中に置く(数えない)', E(inItem('EQ-186', '範囲を窓に足すか否かは書かない(候補の表)。', '範囲を窓に足すか否かは書かない(「決まった」とは書かない)。')), null],
  ];
}
/** 変異の自己試験: 各変異が期待の違反の型で落ちる(null は通る)か。返す { bad, lines } */
export function selfTest355d(inp) {
  const bad = [], lines = [];
  for (const [nm, mi, re] of mutations355d(inp)) {
    if (mi.eq === inp.eq && mi.ph === inp.ph && mi.as === inp.as && mi.pm === inp.pm) { bad.push('⑦ 変異「' + nm + '」が入力を変えていない(置き換えの字が見つからない)'); continue; }
    const r = check355d(mi);
    if (re === null) { if (r.bad.length) bad.push('⑦ 変異「' + nm + '」が落ちた: ' + r.bad[0]); lines.push(nm + ' → ' + (r.bad.length ? '落ちる' : '通る')); continue; }
    const hit = r.bad.some((b) => re.test(b));
    if (!hit) bad.push('⑦ 変異「' + nm + '」が期待の違反で落ちない: ' + (r.bad[0] || '通った'));
    lines.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
  }
  return { bad, lines };
}
