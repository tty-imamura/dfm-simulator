// 第337便g(原仮定者の指示(2026-11-14 —— 第138報)「計算式を探索するのに、探索前に決め打ちは出来ない」「１つのノブで同時に満たせないのであれば、ノブが増えるのは必然」
//   「不用になったノブは廃止する」・原仮定者の回答(2026-11-14 —— AN691〜AN695)・統括の推奨(AN713 = A)・統括の検証項目 R343):
//   **第335便・第336便の式の項(docs/EQUATIONS.md の EQ-44 以降)・探索の方針の節とノブの台帳(PHYSICS〔第337便g〕)・第138報の用語(§2a)・
//   現象の状況一覧の欄「第335〜336便の調べ」の照合の純関数**(QA docs.equations337g・docs.policy337g と、世代の注記つきの lint.terms335g・docs.terms335g・docs.phenomena331e が読む ——
//   html・エンジンは読まない・状態を持たない・第334便f・第335便g・第331便e の lib は呼ぶだけ〔本文は変えない〕)。
//   照合: (i) EQ-44 以降の項(番号の連番・ラベル 診断・4 つの部分と「出どころ」・出どころの経路の実在・第335便/第336便の節の見出しの実在・必須の語・抜粋が tests の lib の名指しの定義の範囲に在る・
//         正本の数の転記 TRANSCRIPTS_EQ_337G・実装の印を付けない)(ii) §3/§5/§6/§7・冒頭の 1 行・§2a の追記(第138報の用語)(iii) 書かない語
//         (iv) 探索の方針の節とノブの台帳(列・行・状態の語彙・出どころの節・末尾の印・当時の規則の文が当時の節に残る)(v) 現象の状況一覧の欄(行の集合・位置・段階の不変・未実行の行)。
//   **第335便g の照合の世代の写し**(view335gOf337g): lint.terms335g は EQ-34 以降の項を EQ-34〜EQ-43 に固定している(lib-w335g-terms.mjs の本文は変えない)ので、
//   EQ-44 以降の項を除き、§2a の EQ-44 以降の参照の字を外した写しを渡す —— EQ-44 以降と参照の実在は本 lib が持つ。
import { eqItems334f, defSpan334f, termSection334f, DECIDE_WORDS_334F, NOT_WORDS_334F, wordAudit334f } from './lib-w334f-terms.mjs';
import { NOT_WORDS_335G } from './lib-w335g-terms.mjs';
import { parsePhenoDoc331e, physSection331e, NOT_WORDS_331E } from './lib-w331e-phenostatus.mjs';

export const EQPOLICY_VERSION_337G = 'w337g-eqpolicy-1';
export const NEW_EQ_FROM_337G = 44;
export const NEW_EQ_IDS_337G = Object.freeze(['EQ-44', 'EQ-45', 'EQ-46', 'EQ-47', 'EQ-48', 'EQ-49', 'EQ-50', 'EQ-51', 'EQ-52']);
/** ラベル(全部 診断 —— tests の lib の式。候補の式に実装の印を付けない) */
export const EQ_LABEL_337G = '診断';
/** 各項が指す便の節(第335便 b〜f —— 1 つ以上)と出どころ(器・lib・正本) */
export const EQ_SRC_337G = Object.freeze({
  'EQ-44': Object.freeze({ sec: '〔第335便b〕', exp: 'tests/exp-w335b-carryledger.mjs', lib: 'tests/lib-w335b-carryledger.mjs', canon: 'tests/out/carryledger-w335b.json' }),
  'EQ-45': Object.freeze({ sec: '〔第335便b〕', exp: 'tests/exp-w335b-carryledger.mjs', lib: 'tests/lib-w335b-carryledger.mjs', canon: 'tests/out/carryledger-w335b.json' }),
  'EQ-46': Object.freeze({ sec: '〔第335便b〕', exp: 'tests/exp-w335b-carryledger.mjs', lib: 'tests/lib-w335b-carryledger.mjs', canon: 'tests/out/carryledger-w335b.json' }),
  'EQ-47': Object.freeze({ sec: '〔第335便b〕', exp: 'tests/exp-w335b-carryledger.mjs', lib: 'tests/lib-w335b-carryledger.mjs', canon: 'tests/out/carryledger-w335b.json' }),
  'EQ-48': Object.freeze({ sec: '〔第335便c〕', exp: 'tests/exp-w335c-mercurycombo.mjs', lib: 'tests/lib-w335c-mercurycombo.mjs', canon: 'tests/out/mercurycombo-w335c.json' }),
  'EQ-49': Object.freeze({ sec: '〔第335便d〕', exp: 'tests/exp-w335d-binarytilt.mjs', lib: 'tests/lib-w335d-binarytilt.mjs', canon: 'tests/out/binarytilt-w335d.json' }),
  'EQ-50': Object.freeze({ sec: '〔第335便d〕', exp: 'tests/exp-w335d-binarytilt.mjs', lib: 'tests/lib-w335d-binarytilt.mjs', canon: 'tests/out/binarytilt-w335d.json' }),
  'EQ-51': Object.freeze({ sec: '〔第335便e〕', exp: 'tests/exp-w335e-moonapsis.mjs', lib: 'tests/lib-w335e-moonapsis.mjs', canon: 'tests/out/moonapsis-w335e.json' }),
  'EQ-52': Object.freeze({ sec: '〔第335便f〕', exp: 'tests/exp-w335f-elliptical.mjs', lib: 'tests/lib-w335f-elliptical.mjs', canon: 'tests/out/elliptical-w335f.json' }),
});
/** 各項の必須の語(回答の番号・主の候補の語・否定対照の語) */
export const EQ_MUST_337G = Object.freeze({
  'EQ-44': Object.freeze(['AN654', '分子に自己を入れた平均', 'U_i = v_i + d_i', '相対の差から直に', 'AN650', 'EQ-39']),
  'EQ-45': Object.freeze(['AN653', '源ごと', '分解ごと', '相殺', '主の候補', '合トルクは 3 列で同じ', 'Γ は同定していない']),
  'EQ-46': Object.freeze(['受動の型', 'N = Γ(T − s)', 'P_in − N·s − Q = 0', '減衰の時間 τ = J/|N_loss|', '能動の駆動の型は置いていない', 'このノブの組では']),
  'EQ-47': Object.freeze(['AN646', 'Ω∥ × b⊥', '受け手の中心 b = 0 で u = 0', '参照の腕', '比べる列']),
  'EQ-48': Object.freeze(['距離の変化による並進引きずり', '−1 : +2 : +1', '今の K1 の並進の分に含まれる', '二重', 'このノブの組では']),
  'EQ-49': Object.freeze(['瞬間の同期', '平均の同期', '−5/3', '+10/3', '+5/3', '条件付きの恒等式', 'ṙ = 0']),
  'EQ-50': Object.freeze(['AN663', '近点の通過の角', '窓の平均', '6.6〜138 倍', 'このノブの組では']),
  'EQ-51': Object.freeze(['−πb/p', '+2πb/p', '拡大した対照', 'このノブの組では', '4.673e+12 年', '次に足すノブの候補']),
  'EQ-52': Object.freeze(['AN665', '押し', '速度の場', '幅を超える', 'C_{j→i} = v_j', '観測の楕円銀河との照合ではない']),
});
/** 項の中の正本の数(表示の桁 —— text は項の本文に在る字。数は指数の表記も読む) */
export const TRANSCRIPTS_EQ_337G = Object.freeze([
  { eq: 'EQ-45', text: '1.626e+6', ref: 'tests/out/carryledger-w335b.json', val: (J) => { const t = J.heat.rows.find((r) => r.key === 'io').readings['carry|kappaM'].rest.tau['1000']; return t.byPart / t.bySource; } },
  { eq: 'EQ-46', text: '6.109e+8 年', ref: 'tests/out/carryledger-w335b.json', val: (J) => J.supply.rows.find((r) => r.key === 'sunJup').readings.rotation.noSupplyYr },
  { eq: 'EQ-47', text: '3.962e-1 m/s', ref: 'tests/out/carryledger-w335b.json', val: (J) => J.t1.rows.find((r) => r.recv === 'mercury').surfaceMax },
  { eq: 'EQ-48', text: '動径 −71.63', ref: 'tests/out/mercurycombo-w335c.json', val: (J) => J.mercury.decomp.main.transRadial.apsW },
  { eq: 'EQ-48', text: '接線 +143.27', ref: 'tests/out/mercurycombo-w335c.json', val: (J) => J.mercury.decomp.main.transTangent.apsW },
  { eq: 'EQ-48', text: '全体 +71.63″/世紀', ref: 'tests/out/mercurycombo-w335c.json', val: (J) => J.mercury.decomp.main.trans.apsW },
  { eq: 'EQ-49', text: '−1.66667・+3.33333・和 +1.66667', ref: 'tests/out/binarytilt-w335d.json', vals: (J) => { const r = J.secular.rows.find((x) => x.e === 0.2); return [r.radial.share, r.tangF.share, r.k1.share]; } },
  { eq: 'EQ-51', text: '−4.879e-9 rad/年', ref: 'tests/out/moonapsis-w335e.json', val: (J) => J.split.rows.find((x) => x.S === 0 && x.lam === 1).rad.dvarpi },
  { eq: 'EQ-52', text: '−58.14%(正本', ref: 'tests/out/elliptical-w335f.json', val: (J) => 100 * J.analysis.cells.find((c) => c.label === 'push γ 0.1/t_cr・α 2・自己なし').eff.r50 },
].map((o) => Object.freeze(o)));
/** §2a の追記の必須の語(第138報の用語 7 語・未検証の候補・第337便で探索中・第335〜336便の式の 1 行) */
export const TERMS_138_337G = Object.freeze(['**供給と減衰**', '**傾きのノブ**', '**赤道面を横切る**', '**潮汐ロック(2 つの座標系の読み)**', '**慣性移動**', '**加減速の差**', '**流体の要素**']);
export const SEC2A_MUST_337G = Object.freeze(['**第335〜336便の式**(第337便g', '**第337便で探索中**', '**探索の方針**(原仮定者の指示(2026-11-14 —— 第138報))', '**第138報の用語**', '**未検証の候補**',
  'ピタリとは止まらない', '実在の星 1 個と区別する', 'ノブの台帳', 'EQ-44〜EQ-52',
  '原仮定者の補足(2026-11-14 —— 第138報の補足)', '**軸引きずりの向き(赤道面)**', '近い面と遠い面の差分', '源の回転と逆回転', '1 − α/2', '1 − α(α = 2 で −1', '**銀河と太陽系の角**', '**120°**', '**180°**']);
/** 書かない語(「」の中の引用は除く): 第337便の禁句(共通の守ること —— 候補の表・ノブの範囲・残差で書く)と実装の印 */
export const NOT_WORDS_337G = Object.freeze([/供給で自転が維持されることが分かった/, /水星の近点移動の原因は赤道帯の回転/, /潮汐ロックの条件が決まった/, /慣性移動は減衰する/, /銀河が流体で解けた/,
  /原始太陽系の起源/, /現実の宇宙である/, /法則を確かめた/, /否定された/]);
export const IMPL_MARK_337G = /実装済み|実装〔(?:既定|opt-in|読み口)〕/;

// ── 探索の方針とノブの台帳(PHYSICS〔第337便g〕)──
export const KNOB_COLS_337G = Object.freeze(['ノブの名', '足した便', '何を満たすために足したか', '既定と振った範囲', '効いた量', '効かなかった量', '状態', '出どころ(節・器)']);
export const KNOB_STATES_337G = Object.freeze(['候補', '対照', '不用の見込み', '廃止']);
export const KNOB_MARK_337G = '<!-- knob-ledger:337 -->';
/** 種として載せたノブ(第333〜336便)の名 —— 行の数の下限と名の照合 */
export const KNOB_SEED_337G = Object.freeze(['引きずり自転 s_d の J 案の係数 λ_J', '回転引きずりの帯と尾の宣言の型(切り口・対向 2 点)', '統合した並進の重みの距離の次数 α', '高さ則の読み T1・T2・T3', '扁平の則の次数 q と軸比',
  '押しの強さ γ', 'T1 の作用の向き 4 × 結合 3', 'G_loc の次数 n と対(受け手・対称)', '熱の口のまとめ方', '自己の重みの読み', '軟化の長さ ε', '近点の定義', '自転軸の傾きの組(連星)', '同期の型', '銀河の源の読み',
  '供給の口の型(受動)', '引きずりの強さ λ(月の 4 列)', '引きずりの成分 P(両方・動径・接線)', '🌘 の D0pull と初速の係数']);
/** 探索の方針の節の必須の語 */
export const POLICY_MUST_337G = Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', 'R343', '**式の形を探索の前に決め打ちしない**', '**1 つのノブで同時に満たせないなら、ノブを足す**', '**不用になったノブは廃止する**',
  '**「偶然」が多いのはノブが不足している読み**', '**仮定でノブを増やすことは、それが現実の宇宙だと主張することではない**', '**測った数と対照は消さない**', '「第138報で置き換えた」', '当時の規則として残し',
  '**表 1 ', '**表 2 ノブの台帳**', '**表 3 ', '**表 4 ', 'knob-ledger:337', 'AN713', 'AN692', 'AN693', 'AN694', 'view335gOf337g', 'TRANSCRIPTS_EQ_337G', 'TRANSCRIPTS_337G', 'docs.equations337g', 'docs.policy337g',
  'lint.terms335g', 'docs.phenomena331e', '変えていない所', '段階は変えていない', '未実行']);
/** 当時の規則の文(過去の節の本文に残っていること —— 書き換えていない)*/
export const OLD_RULES_337G = Object.freeze([
  { head: '〔第334便d — ', text: '同時に多数のノブを観測に当てない' },
  { head: '〔第335便c — ', text: '向きと結合を結果を見て選ばない・同時のフィットはしない' },
  { head: '〔第335便d — ', text: '走行の前の宣言(lib の `DECL`・器の `PLAN` —— 結果を見て変えない)' },
]);

// ── 現象の状況一覧の欄「第335〜336便の調べ」──
export const PHENO_FIELD_337G = '第335〜336便の調べ';
export const PHENO_ROWS_337G = Object.freeze(['P01', 'P05', 'P06', 'P08', 'P10', 'P12', 'P14', 'P18', 'P19', 'P23']);
export const PHENO_STAGES_337G = Object.freeze({ P01: '門の内', P05: '残差', P06: '残差', P08: '門の内', P10: '残差', P12: '一部', P14: '一部', P18: '一部', P19: '残差', P23: '一部' });
/** 調べは次の便の行(「未実行」と書く —— 達成の件数に入れない) */
export const PHENO_PENDING_337G = Object.freeze(['P06', 'P14']);
/** 欄の前に在ってよい欄(固定の 9 欄の外 —— この後ろに置く) */
const PRE_FIELDS_337G = ['第331便の調べ', '第333便の調べ', '第334便の調べ', '第336便の記録'];
export const TRANSCRIPTS_337G = Object.freeze([
  { row: 'P01', text: '÷ q_1PN が 1.000 → −0.667', src: 'phys', ref: '〔第335便c — ' },
  { row: 'P01', text: '区間ごとの寄与は ±63.5″/世紀', src: 'phys', ref: '〔第335便c — ' },
  { row: 'P01', text: '打ち消しの度合いは 4.4e-8', src: 'phys', ref: '〔第335便c — ' },
  { row: 'P05', text: 'K1 を含む型は 6.6〜138 倍', src: 'phys', ref: '〔第335便d — ' },
  { row: 'P05', text: 'log の傾き 0.995〜1.004', src: 'phys', ref: '〔第335便d — ' },
  { row: 'P05', text: 'ρ ≤ 0 の行は無い', src: 'phys', ref: '〔第335便d — ' },
  { row: 'P08', text: '2.596e+5 年の桁', src: 'phys', ref: '〔第335便e — ' },
  { row: 'P08', text: '4.673e+12 年', src: 'phys', ref: '〔第335便e — ' },
  { row: 'P10', text: '瞬間の同期の動径は 1.1e-15 n a', src: 'phys', ref: '〔第335便d — ' },
  { row: 'P12', text: '1e-11 m/s の桁', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P12', text: '1.6e-3 m/s', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P12', text: '2〜8 桁違う', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P18', text: 'Ω_gal = 9.09e-16 rad/s', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P18', text: 'ω_gal·ŝ/s = 1e-16〜1e-5 の桁', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P18', text: 'J/|N_loss| は太陽 6.1e8 年', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P19', text: '1.002〜1.6e6', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P19', text: '月は自己なし 7.6e5', src: 'phys', ref: '〔第335便b — ' },
  { row: 'P23', text: 'r50 −58.14%', src: 'phys', ref: '〔第335便f — ' },
].map((o) => Object.freeze(o)));

const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const stripQ = (t) => String(t || '').replace(/「[^」]*」/g, '');
const stripCode = (t) => String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
const isNew = (id) => /^EQ-\d\d$/.test(id) && Number(id.slice(3)) >= NEW_EQ_FROM_337G;
/** 字の中の最初の数(指数の表記と U+2212 を読む)と表示の桁(仮数の小数の桁 × 指数) */
export function numOf337g(text) {
  const m = /[+\-−]?\d+(?:\.\d+)?(?:e[+\-−]?\d+)?/.exec(String(text).replace(/,/g, ''));
  if (!m) return null;
  const t = m[0].replace(/−/g, '-'), [mant, ex] = t.split('e'), dec = (mant.split('.')[1] || '').length;
  return { x: Number(t), tol: 0.5 * Math.pow(10, -dec) * Math.pow(10, ex ? Number(ex) : 0) };
}
const nums337g = (text) => String(text).split('・').map(numOf337g).filter(Boolean);

// ── 第335便g の照合の世代の写し ──
/** EQ-44 以降の項の節を除き、§2a(見出し「## 2a. 」から次の「## 」まで)の EQ-44 以降の参照の字を外した写し(lint.terms335g と selfTest335g に渡す) */
export function view335gOf337g(eq) {
  let s = String(eq || '');
  s = s.replace(/\n### EQ-(\d\d) [^\n]*[\s\S]*?(?=\n### |\n## )/g, (m, n) => (Number(n) >= NEW_EQ_FROM_337G ? '' : m));
  const i = s.indexOf('\n## 2a. '), j = i >= 0 ? s.indexOf('\n## ', i + 1) : -1;
  if (i < 0 || j < 0) return s;
  return s.slice(0, i) + s.slice(i, j).replace(/EQ-(\d\d)/g, (m, n) => (Number(n) >= NEW_EQ_FROM_337G ? '' : m)) + s.slice(j);
}

/** 現象の状況一覧から欄「第335〜336便の調べ」の行を外した写し(第335便g の selfTest335g の変異〔欄「第334便の調べ」と食い違いの理由が隣り合う型〕と checkPhenoRows335g に渡す) */
export function viewMd335gOf337g(md) {
  return String(md || '').split('\n').filter((l) => !l.startsWith('- **' + PHENO_FIELD_337G + '**: ')).join('\n');
}

// ── 照合: 式の一覧(EQ-44 以降・§2a の追記・§3/§5/§6/§7・冒頭)──
// inp = { eq, ph, readText(rel) → string|null, readJson(rel) → obj|null, exists(rel) → bool }
export function checkEquations337g(inp) {
  const bad = [], cases = [], eq = String(inp.eq || ''), ph = String(inp.ph || '');
  const all = eqItems334f(eq), ids = new Set(all.map((z) => z.id));
  const nw = all.filter((z) => z.num >= NEW_EQ_FROM_337G), nwIds = nw.map((z) => z.id);
  if (JSON.stringify(nwIds) !== JSON.stringify(NEW_EQ_IDS_337G)) bad.push('① EQ-44 以降の項の番号: ' + nwIds.join('・') + '(宣言 ' + NEW_EQ_IDS_337G.join('・') + ')');
  const fileCache = new Map(), rd = (f) => { if (!fileCache.has(f)) fileCache.set(f, inp.readText ? inp.readText(f) : null); return fileCache.get(f); };
  const ex = (p) => (inp.exists ? inp.exists(p) : rd(p) !== null);
  let nB = 0, nF = 0, nH = 0, nM = 0, nP = 0;
  for (const it of nw) {
    if (it.label !== EQ_LABEL_337G) bad.push('① ' + it.id + ' のラベル「' + it.label + '」が「' + EQ_LABEL_337G + '」でない');
    for (const part of ['\n- **数式版**: ', '\n- **解説**: ', '\n- **出どころ**: ', '\n- **プログラム版 1**', '\n- **PHYSICS の節**: ']) if (it.text.indexOf(part) < 0) bad.push('① ' + it.id + ' に「' + part.replace(/[\n*:-]/g, '').trim() + '」が無い');
    const S = EQ_SRC_337G[it.id];
    if (S) {
      const srcLine = (/\n- \*\*出どころ\*\*: ([^\n]+)/.exec(it.text) || [])[1] || '';
      for (const p of [S.exp, S.lib, S.canon]) { nP++; if (srcLine.indexOf('`' + p + '`') < 0) bad.push('① ' + it.id + ' の出どころに ' + p + ' が無い'); else if (!ex(p)) bad.push('① ' + it.id + ' の出どころの経路 ' + p + ' が実在しない'); }
      if (!it.physRefs.some((r) => r.ref === S.sec)) bad.push('① ' + it.id + ' が ' + S.sec + ' を指さない');
    }
    if (!it.physRefs.some((r) => r.wave === 335 || r.wave === 336)) bad.push('① ' + it.id + ' が第335便・第336便の節を指さない');
    for (const r of it.physRefs) { nH++; if (ph.indexOf('\n' + r.head) < 0) bad.push('① ' + it.id + ' の節 ' + r.ref + ' の見出しが PHYSICS に無い'); }
    for (const w of (EQ_MUST_337G[it.id] || [])) { nM++; if (it.text.indexOf(w) < 0) bad.push('① ' + it.id + ' に「' + w + '」が無い'); }
    if (IMPL_MARK_337G.test(stripCode(it.text).replace(/\n- \*\*ラベル\*\*: [^\n]*/, ''))) bad.push('① ' + it.id + ' に実装の印(候補の式に付けない)');
    if (!it.blocks.length) bad.push('① ' + it.id + ' にプログラム版が無い');
    for (const b of it.blocks) {
      nB++;
      const where = it.id + ' の抜粋 ' + b.k + '(' + b.file + ' · ' + b.name + ')';
      if (!/^tests\/lib-[^/]+\.mjs$/.test(b.file)) { bad.push('① ' + where + ' が tests の lib でない'); continue; }
      if (S && b.file !== S.lib) bad.push('① ' + where + ' が出どころの lib(' + S.lib + ')でない');
      const src = rd(b.file);
      if (!src) { bad.push('① ' + where + ': ファイルが無い'); continue; }
      const span = defSpan334f(src, b.name);
      if (!span) { bad.push('① ' + where + ': 名の定義が無い'); continue; }
      const ns = norm(span);
      b.frags.forEach((f, mi) => { nF++; const nf = norm(f); if (!nf || ns.indexOf(nf) < 0) bad.push('① ' + where + ' の断片 ' + (mi + 1) + ' が定義の範囲に無い: «' + nf.slice(0, 60) + '»'); });
    }
  }
  cases.push(`① EQ-44 以降の項 ${nw.length}(${nw.map((z) => z.id).join('・')} —— ラベル ${EQ_LABEL_337G})—— 5 つの部分(出どころを含む)・出どころの経路 ${nP}(実在)・節の参照 ${nH}(見出しの行・第335〜336便の節)・必須の語 ${nM}・抜粋 ${nB}・断片 ${nF}(出どころの lib の名指しの定義の範囲)・実装の印 0`);
  // ② 正本の数の転記
  const jc = new Map(), rj = (p) => { if (!jc.has(p)) { let J = null; try { J = inp.readJson ? inp.readJson(p) : JSON.parse(rd(p)); } catch (e) { J = null; } jc.set(p, J); } return jc.get(p); };
  let nT = 0;
  for (const t of TRANSCRIPTS_EQ_337G) {
    nT++;
    const it = nw.find((z) => z.id === t.eq);
    if (!it) { bad.push('② 転記の項 ' + t.eq + ' が無い'); continue; }
    if (stripCode(it.text).indexOf(t.text) < 0) { bad.push('② ' + t.eq + ' に「' + t.text + '」が無い'); continue; }
    const J = rj(t.ref);
    let v = null; try { v = J ? (t.vals ? t.vals(J) : [t.val(J)]) : null; } catch (e) { v = null; }
    const xs = t.vals ? nums337g(t.text) : [numOf337g(t.text)];
    if (!v || v.length !== xs.length || xs.some((q, k) => !q || !Number.isFinite(v[k]) || Math.abs(q.x - v[k]) > q.tol + 1e-15)) bad.push('② ' + t.eq + ' の「' + t.text + '」が正本 ' + t.ref + ' の値 ' + JSON.stringify(v) + ' と違う');
  }
  cases.push(`② 正本の数の転記 ${nT} 項(${[...new Set(TRANSCRIPTS_EQ_337G.map((t) => t.eq))].join('・')} —— 表示の桁で正本と同じ)`);
  // ③ §3・§5・§6・§7・冒頭
  const s3i = eq.indexOf('\n## 3. '), s3 = s3i >= 0 ? eq.slice(s3i, eq.indexOf('\n## ', s3i + 1)) : '';
  for (const id of NEW_EQ_IDS_337G) if (!s3.split('\n').some((l) => l.startsWith('| ' + id + ' |') && l.trim().endsWith('| ' + EQ_LABEL_337G + ' |'))) bad.push('③ §3 の一覧に ' + id + '(' + EQ_LABEL_337G + ')の行が無い');
  const s5i = eq.indexOf('\n## 5. '), s5 = s5i >= 0 ? eq.slice(s5i, eq.indexOf('\n## ', s5i + 1)) : '';
  const r5 = s5.split('\n').find((l) => l.startsWith('| 🌘 の窓の表'));
  if (!r5 || r5.indexOf('式ではなく記録') < 0 || r5.indexOf('PHYSICS〔第336便a〕') < 0 || r5.indexOf('`tests/out/emrecord-w336a.json`') < 0 || r5.indexOf('恒久ではない') < 0) bad.push('③ §5 の表に 🌘 の窓の表の行(式ではなく記録・恒久ではない・〔第336便a〕・正本)が無い');
  if (r5 && !ex('tests/out/emrecord-w336a.json')) bad.push('③ §5 の 🌘 の行の正本が実在しない');
  const s6i = eq.indexOf('\n## 6. '), s6 = s6i >= 0 ? eq.slice(s6i, eq.indexOf('\n## ', s6i + 1)) : '';
  if (s6.indexOf('EQ-44〜EQ-52 が拾う(第337便g —— 項は ' + all.length + ')') < 0) bad.push('③ §6 の件数の文(EQ-44〜EQ-52・項は ' + all.length + ')');
  const s7i = eq.indexOf('\n## 7. '), s7 = s7i >= 0 ? eq.slice(s7i) : '';
  if (!/\n9\. \*\*探索の方針・ノブの台帳と第335〜336便の式\*\*\(第337便g —— `docs\.equations337g`・`docs\.policy337g`\)/.test(s7) || s7.indexOf('view335gOf337g') < 0 || s7.indexOf('TRANSCRIPTS_EQ_337G') < 0) bad.push('③ §7 の規則 9(探索の方針・世代の写し・転記の表)');
  if (eq.indexOf('- **第335〜336便の式・探索の方針・ノブの台帳(第337便g)**: ') < 0) bad.push('③ 冒頭の第337便g の 1 行');
  cases.push(`③ §3 の一覧に ${NEW_EQ_IDS_337G.length} 行・§5 の 🌘 の記録の行・§6 の件数の文(項 ${all.length})・§7 の規則 9・冒頭の 1 行`);
  // ④ §2a の追記
  const sec = termSection334f(eq);
  for (const w of SEC2A_MUST_337G.concat(TERMS_138_337G)) if (sec.indexOf(w) < 0) bad.push('④ §2a に「' + w + '」が無い');
  const refs = [...new Set([...sec.matchAll(/EQ-\d\d/g)].map((m) => m[0]))];
  for (const id of refs) if (!ids.has(id)) bad.push('④ §2a が無い項 ' + id + ' を指す');
  for (const id of NEW_EQ_IDS_337G) if (refs.indexOf(id) < 0) bad.push('④ §2a が ' + id + ' を指さない');
  cases.push(`④ §2a の追記: 必須の語 ${SEC2A_MUST_337G.length}・第138報の用語 ${TERMS_138_337G.length} 語(未検証の候補)・項の参照 ${refs.length}(本書に在る・EQ-44〜EQ-52 を全部指す)`);
  // ⑤ 書かない語
  const targets = [['§2a', sec]].concat(nw.map((z) => [z.id, z.text]));
  for (const [nm, tx] of targets) {
    const s = stripCode(stripQ(tx));
    for (const w of DECIDE_WORDS_334F) if (s.indexOf(w) >= 0) bad.push('⑤ ' + nm + ' に主の型を決めた語(' + w.length + ' 字)');
    for (const re of NOT_WORDS_337G.concat(NOT_WORDS_335G, NOT_WORDS_334F, NOT_WORDS_331E)) if (re.test(s)) bad.push('⑤ ' + nm + ' に書かない語 ' + re.source);
  }
  cases.push(`⑤ 書かない語(主の型を決めた語・第337便の禁句 ${NOT_WORDS_337G.length}・第335便・第334便の禁句・第331便e の語)—— §2a と EQ-44 以降の項 ${nw.length}`);
  return { ok: bad.length === 0, bad, cases, items: nw };
}

// ── 照合: 探索の方針の節とノブの台帳 ──
/** PHYSICS の〔第337便g〕の節の本文 */
export function policySection337g(ph) { return physSection331e(String(ph || ''), '〔第337便g — '); }
/** 節の中のノブの台帳(見出し「**表 2 ノブの台帳**」の後の最初の表)と、表の直後の行 */
export function parseKnobLedger337g(sec) {
  const L = String(sec || '').split('\n'), i0 = L.findIndex((l) => l.startsWith('**表 2 ノブの台帳**'));
  const tb = { head: null, rows: [], after: null };
  if (i0 < 0) return tb;
  let i = i0 + 1;
  while (i < L.length && !/^\|/.test(L[i])) i++;
  for (; i < L.length && /^\|/.test(L[i]); i++) {
    if (!tb.head) { tb.head = cells(L[i]); continue; }
    if (/^\|[-| ]+\|$/.test(L[i])) continue;
    tb.rows.push(cells(L[i]));
  }
  tb.after = i < L.length ? L[i] : null;
  return tb;
}
// inp = { ph }
export function checkPolicy337g(inp) {
  const bad = [], cases = [], ph = String(inp.ph || ''), sec = policySection337g(ph);
  if (!sec) { bad.push('⑥ PHYSICS〔第337便g〕が無い'); return { ok: false, bad, cases }; }
  for (const w of POLICY_MUST_337G) if (sec.indexOf(w) < 0) bad.push('⑥ PHYSICS〔第337便g〕に「' + w + '」が無い');
  // 当時の規則の文が当時の節に残っている(過去の節を書き換えていない)
  let nOld = 0;
  for (const o of OLD_RULES_337G) { nOld++; const s = physSection331e(ph, o.head), r0 = o.head.replace(' — ', '〕'); if (!s || s.indexOf(o.text) < 0) bad.push('⑥ 当時の規則の文「' + o.text.slice(0, 20) + '」が ' + r0 + ' に無い(過去の節の本文は書き換えない)'); const ref = o.head.replace(' — ', '〕'); if (sec.indexOf(ref) < 0) bad.push('⑥ 表 1 が ' + ref + ' を指さない'); }
  cases.push(`⑥ 探索の方針の節: 必須の語 ${POLICY_MUST_337G.length}・当時の規則の文 ${nOld} が当時の節に残る(本文は書き換えていない)`);
  // ノブの台帳
  const tb = parseKnobLedger337g(sec);
  if (!tb.head || JSON.stringify(tb.head) !== JSON.stringify(KNOB_COLS_337G)) bad.push('⑦ ノブの台帳の表の頭が 8 欄の宣言と違う: ' + JSON.stringify(tb.head));
  if (tb.after !== KNOB_MARK_337G) bad.push('⑦ ノブの台帳の表の末尾の次の行が印 ' + KNOB_MARK_337G + ' でない(«' + String(tb.after).slice(0, 30) + '»)');
  const names = tb.rows.map((r) => r[0]);
  for (const n of KNOB_SEED_337G) if (names.indexOf(n) < 0) bad.push('⑦ ノブの台帳に種の行「' + n + '」が無い');
  const st = Object.fromEntries(KNOB_STATES_337G.map((x) => [x, 0]));
  let nRef = 0;
  for (const r of tb.rows) {
    if (r.length !== KNOB_COLS_337G.length || r.some((c) => !c)) { bad.push('⑦ ノブ「' + r[0] + '」の欄が 8 つでないか空の欄'); continue; }
    if (!KNOB_STATES_337G.includes(r[6])) bad.push('⑦ ノブ「' + r[0] + '」の状態「' + r[6] + '」が語彙の外'); else st[r[6]]++;
    const refs = [...r[7].matchAll(/〔第(\d+)便([a-z]*)〕/g)];
    if (!refs.length) bad.push('⑦ ノブ「' + r[0] + '」の出どころに節が無い');
    for (const m of refs) { nRef++; if (ph.indexOf('\n〔第' + m[1] + '便' + m[2] + ' — ') < 0) bad.push('⑦ ノブ「' + r[0] + '」の出どころの節 ' + m[0] + ' の見出しが PHYSICS に無い'); }
    if (!/第3\d\d便/.test(r[1])) bad.push('⑦ ノブ「' + r[0] + '」の足した便の欄に便の名が無い');
  }
  // 節の文の数は種の行(第333〜336便)だけで照らす —— 統合で第337便の枝の行が印の位置に足されても文は変えなくてよい
  const seedRows = tb.rows.filter((r) => KNOB_SEED_337G.includes(r[0])), sst = Object.fromEntries(KNOB_STATES_337G.map((x) => [x, seedRows.filter((r) => r[6] === x).length]));
  if (sec.indexOf('ノブ ' + KNOB_SEED_337G.length + ' 行') < 0) bad.push('⑦ 節の文の種のノブの行の数(' + KNOB_SEED_337G.length + ')');
  const stTxt = KNOB_STATES_337G.filter((x) => sst[x]).map((x) => x + ' ' + sst[x]).join('・');
  if (sec.indexOf('(' + seedRows.length + ' 行は' + stTxt + ')') < 0) bad.push('⑦ 節の文の種の行の状態の件数(' + seedRows.length + ' 行は ' + stTxt + ')');
  cases.push(`⑦ ノブの台帳: 8 欄・行 ${tb.rows.length}(種 ${KNOB_SEED_337G.length} を全部 —— ${stTxt})・出どころの節 ${nRef}(見出しの行)・表の末尾の印 ${KNOB_MARK_337G}`);
  // 書かない語(節)
  const s = stripCode(stripQ(sec));
  for (const re of NOT_WORDS_337G) if (re.test(s)) bad.push('⑧ PHYSICS〔第337便g〕に書かない語 ' + re.source);
  return { ok: bad.length === 0, bad, cases, ledger: tb, states: st };
}

// ── 照合: 現象の状況一覧の欄「第335〜336便の調べ」──
export function checkPhenoRows337g(inp) {
  const bad = [], cases = [], md = String(inp.md || '');
  const P = parsePhenoDoc331e(md);
  const have = P.rows.filter((r) => PHENO_FIELD_337G in r.fields).map((r) => r.id);
  if (JSON.stringify(have) !== JSON.stringify(PHENO_ROWS_337G)) bad.push('⑨ 欄「' + PHENO_FIELD_337G + '」を持つ行 ' + have.join('・') + ' ≠ 宣言 ' + PHENO_ROWS_337G.join('・'));
  for (const r of P.rows) {
    if (!(PHENO_FIELD_337G in r.fields)) continue;
    const v = String(r.fields[PHENO_FIELD_337G] || '').trim();
    if (!v || v === '—') bad.push('⑨ ' + r.id + ' の「' + PHENO_FIELD_337G + '」が空');
    const iB = r.order.indexOf(PHENO_FIELD_337G), iC = r.order.indexOf('食い違いの理由'), iPrev = Math.max(...PRE_FIELDS_337G.map((f) => r.order.indexOf(f)));
    if (!(iPrev >= 0 && iPrev < iB && iB === iC - 1)) bad.push('⑨ ' + r.id + ' の「' + PHENO_FIELD_337G + '」の位置(前の便の欄の後・食い違いの理由の直前)');
    const want = PHENO_STAGES_337G[r.id];
    if (want && r.stage !== want) bad.push('⑨ ' + r.id + ' の段階「' + r.stage + '」が第337便g の時点の「' + want + '」と違う(段階は変えない)');
    if (PHENO_PENDING_337G.includes(r.id)) { if (v.indexOf('未実行') < 0 || v.indexOf('達成の件数に入れない') < 0) bad.push('⑨ ' + r.id + ' に「未実行」「達成の件数に入れない」が無い'); }
    else if (!/〔第33[56]便[a-f]〕/.test(v)) bad.push('⑨ ' + r.id + ' の「' + PHENO_FIELD_337G + '」が第335便・第336便の節を挙げない');
    const s = stripCode(stripQ(v));
    for (const w of DECIDE_WORDS_334F) if (s.indexOf(w) >= 0) bad.push('⑨ ' + r.id + ' に主の型を決めた語(' + w.length + ' 字)');
    for (const re of NOT_WORDS_337G.concat(NOT_WORDS_335G)) if (re.test(s)) bad.push('⑨ ' + r.id + ' に書かない語 ' + re.source);
  }
  if (md.indexOf('**第337便g の更新**') < 0 || md.indexOf('欄「第335〜336便の調べ」**(第337便g') < 0) bad.push('⑨ 冒頭の第337便g の更新の注記と照合の規則の 1 項');
  const per = PHENO_ROWS_337G.map((id) => id + ' ' + TRANSCRIPTS_337G.filter((t) => t.row === id).length);
  cases.push(`⑨ 欄「${PHENO_FIELD_337G}」の行 ${have.length}(${have.join('・')})・段階は不変・未実行の行 ${PHENO_PENDING_337G.join('・')}・転記 ${TRANSCRIPTS_337G.length} 項(${per.join('・')})`);
  return { ok: bad.length === 0, bad, cases };
}

// ── 変異の自己試験(実物の写しを壊す —— 良い形は通り、壊した形は期待の違反で落ちる)──
// src = { eq, ph, md, readText, readJson, exists }
export function selfTest337g(src) {
  const cases = [], bad = [];
  const run = (o) => { const s = Object.assign({}, src, o), a = checkEquations337g(s), b = checkPolicy337g(s), c = checkPhenoRows337g(s); return { ok: a.ok && b.ok && c.ok, bad: a.bad.concat(b.bad, c.bad) }; };
  const g = run({});
  if (!g.ok) bad.push('良い形が落ちた: ' + g.bad.slice(0, 3).join(' / '));
  cases.push('良い形 ' + (g.ok ? '通る' : '落ちる'));
  const eq = String(src.eq || ''), ph = String(src.ph || ''), md = String(src.md || '');
  const it = (id) => eqItems334f(eq).find((z) => z.id === id) || { title: '', text: '' };
  const lab = (id) => '### ' + id + ' ' + it(id).title + '\n\n- **ラベル**: ' + EQ_LABEL_337G;
  const sx = (id) => (/\n(- \*\*解説\*\*: [^\n]+)/.exec(it(id).text) || [])[1] || '';
  const sec = policySection337g(ph), tb = parseKnobLedger337g(sec);
  const knobLine = (name) => sec.split('\n').find((l) => l.startsWith('| ' + name + ' |')) || '';
  const MUT = [
    ['EQ-48 のラベルを実装〔opt-in〕に', { eq: eq.replace(lab('EQ-48'), lab('EQ-48').replace('診断', '実装〔opt-in〕')) }, /^① EQ-48 のラベル「実装〔opt-in〕」/],
    ['EQ-50 の項を消す', { eq: eq.replace(/\n### EQ-50 [\s\S]*?(?=\n### EQ-51 )/, '') }, /^① EQ-44 以降の項の番号/],
    ['EQ-46 の出どころの正本を無い経路に', { eq: eq.replace('正本 `tests/out/carryledger-w335b.json`\n- **プログラム版 1**(`tests/lib-w335b-carryledger.mjs` · `supplyRow`)', '正本 `tests/out/carryledger-w399z.json`\n- **プログラム版 1**(`tests/lib-w335b-carryledger.mjs` · `supplyRow`)') }, /^① EQ-46 の出どころに tests\/out\/carryledger-w335b\.json が無い/],
    ['EQ-49 の抜粋の断片の 1 字違い', { eq: eq.replace('const drC = -beta * rdot', 'const drC = -beta * rdoT') }, /^① EQ-49 の抜粋 1\(tests\/lib-w335d-binarytilt\.mjs · syncTypeCase\) の断片 2 が定義の範囲に無い/],
    ['EQ-51 の抜粋の名の 1 字違い', { eq: eq.replace('(`tests/lib-w335e-moonapsis.mjs` · `dragInto`)', '(`tests/lib-w335e-moonapsis.mjs` · `dragIntoX`)') }, /^① EQ-51 の抜粋 2\(tests\/lib-w335e-moonapsis\.mjs · dragIntoX\): 名の定義が無い/],
    ['EQ-48 の正本の数を 1 桁違いに', { eq: eq.replace('接線 +143.27', '接線 +143.37') }, /^② EQ-48 に「接線 \+143\.27」が無い/],
    ['EQ-47 の解説に実装の印', { eq: sx('EQ-47') ? eq.replace(sx('EQ-47'), sx('EQ-47') + ' 実装済み。') : eq + '\n種が無い' }, /^① EQ-47 に実装の印/],
    ['§3 の一覧の EQ-52 の行を消す', { eq: eq.replace(/\n\| EQ-52 \|[^\n]*/, '') }, /^③ §3 の一覧に EQ-52/],
    ['§2a の流体の要素の語を消す', { eq: eq.replace('**流体の要素**', '流体') }, /^④ §2a に「\*\*流体の要素\*\*」が無い/],
    ['EQ-52 の解説に第337便の禁句', { eq: sx('EQ-52') ? eq.replace(sx('EQ-52'), sx('EQ-52') + ' 銀河が流体で解けた。') : eq + '\n種が無い' }, /^⑤ EQ-52 に書かない語 銀河が流体で解けた/],
    ['EQ-52 の解説の「」の中の禁句(数えない)', { eq: sx('EQ-52') ? eq.replace(sx('EQ-52'), sx('EQ-52') + ' 「銀河が流体で解けた」とは書かない。') : eq }, null],
    ['ノブの台帳の末尾の印を消す', { ph: ph.replace('\n' + KNOB_MARK_337G + '\n', '\n\n') }, /^⑦ ノブの台帳の表の末尾の次の行が印/],
    ['ノブの台帳の状態を語彙の外に', { ph: knobLine('近点の定義') ? ph.replace(knobLine('近点の定義'), knobLine('近点の定義').replace('| 候補 |', '| 本命 |')) : ph + '\n種が無い' }, /^⑦ ノブ「近点の定義」の状態「本命」が語彙の外/],
    ['当時の規則の文(第335便c)を書き換える', { ph: ph.replace('向きと結合を結果を見て選ばない・同時のフィットはしない', '向きと結合を選ぶ') }, /^⑥ 当時の規則の文「向きと結合を結果を見て選ばない・同時のフ」が 〔第335便c〕 に無い/],
    ['現象の一覧の P14 の未実行を消す', { md: md.replace(/(\n- \*\*第335〜336便の調べ\*\*: 調べは次の便\(\*\*)未実行(\*\*\)—— 第335〜336便の枝には本行)/, '$1済み$2') }, /^⑨ P14 に「未実行」/],
    ['現象の一覧の P19 の段階を門の内に', { md: md.replace('### P19 内部熱(金星・木星・イオ・地球・土星)\n- **段階**: 残差', '### P19 内部熱(金星・木星・イオ・地球・土星)\n- **段階**: 門の内') }, /^⑨ P19 の段階「門の内」/],
  ];
  for (const [nm, o, re] of MUT) {
    const r = run(o);
    if (re === null) { if (!r.ok) bad.push('変異「' + nm + '」が落ちた: ' + r.bad[0]); cases.push(nm + ' → ' + (r.ok ? '通る' : '落ちる')); continue; }
    const hit = r.bad.some((b) => re.test(b));
    if (r.ok || !hit) bad.push('変異「' + nm + '」が期待の違反で落ちない: ' + (r.bad[0] || '通った'));
    cases.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
  }
  return { ok: bad.length === 0, cases, bad, n: MUT.length };
}

/** 書かない語・禁句(PHYSICS の本枝の節・AI_SPEC・CHANGELOG の行・README の行 —— 第334便f の wordAudit334f に第335便・第337便の禁句を足す) */
export function wordAudit337g(name, text, opts = {}) {
  const bad = wordAudit334f(name, text, opts);
  if (!opts.noNot) { const s = stripQ(text); for (const re of NOT_WORDS_335G.concat(NOT_WORDS_337G)) if (re.test(s)) bad.push(name + ' に書かない語 ' + re.source); }
  return bad;
}
