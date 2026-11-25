// 第352便b(原仮定者の回答(2026-11-24 —— 第148報)「AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する」・統括の検証項目 R439):
//   **仮の値の器 —— 仮の値の台帳 PROV(凍結)・印(provisional / verified / useForVerdict)・口(prov・provList・tagProv・assertNoVerdict)・
//   仮の値を使ってよい所の門(較正の監査・サンプルの状況・正式判定値の器と lib が import していないことを見る純関数)・初めの数のリポジトリの数との照合の列・
//   経路の比率の感度の仮計算(〔第351便k〕の式 r = abs(dθ/dt) ÷ (sin θ × abs(dφ/dt))・f = r ÷ (1 + r))**
//   (器 tests/exp-w352b-provisional.mjs と QA behavior.provisional352b・docs.provisional352b・lint.provisionalScope352b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない)。
//
// ■ 仮の値(全部「仮・未照合」): 値は統括の手元の知識で、一次の資料に当たっていない(この環境から外の資料を取りに行かない)。grade は統括の付けた確度
//   ('A' 公式の規約のモデルの係数・広く使われる要素/'B' 単独の推定値/'C' 概算)。sigma は原典に在る 1σ だけ(出どころの候補に表か式の語が在る件だけ —— 無ければ null。自分で作らない)。
// ■ 使ってよい所: 本便より後(第352便から)の診断の lib・器だけ。較正の合否・サンプルの状況・ノブの採否・正式判定値に入れない(useForVerdict: false)。
//   仮の値を使った出力は tagProv で印(provisional: true・使った鍵の一覧)を付ける。assertNoVerdict は印の付いた値を判定の側へ渡すと例外にする。
// ■ リポジトリに既に在る「文献の値・未照合」の数(地球の一般歳差 ほか)は写さない —— REPO_REFS の鍵で指すだけ(二重に持たない)。
// ■ 言わないこと: 仮の値から係数・比率・背景の大きさの答えを出したとは書かない。観測との照合の判定を書かない。照合を終えた値とは書かない。
import * as E from './lib-w347e-spintorque.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352b-provisional-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, AS = 180 * 3600 / Math.PI, YR = TL.YR, AS_YR = YR * AS;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const angDeg = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))) / D2R;

/* ───────── 台帳の欄 ───────── */
/** 1 件の欄(この順)。value は数・null・範囲 { lo, hi } のどれか */
export const FIELDS = Object.freeze(['key', 'value', 'unit', 'quantity', 'epoch', 'frame', 'positive', 'sigma', 'grade', 'sourceHint', 'provisional', 'verified', 'useForVerdict']);
export const GRADES = Object.freeze(['A', 'B', 'C']);
export const MARK = '仮・未照合';
/** 出どころの候補の欄に必ず入る語 */
export const HINT_WORD = '未照合';
/** sigma を持ってよい件 = 出どころの候補に表か式の語が在る件 */
export const SIGMA_HINT_RE = /表|式/;

const ent = (o) => Object.freeze(Object.assign({ sigma: null }, o, { sourceHint: o.sourceHint + '(未照合)', provisional: true, verified: false, useForVerdict: false }));
const rng = (lo, hi) => Object.freeze({ lo, hi });

/** 仮の値の台帳(統括が渡した表の数だけ —— ここに無い数を足さない) */
export const PROV = Object.freeze([
  ent({ key: 'earth.precSense', value: -1, unit: '1', quantity: '地球の自転軸の歳差の回る向き —— 公転・自転と逆回り', epoch: '—', frame: '固定の黄道 J2000(黄道の極のまわり)', positive: '黄道の極のまわりを右ねじで正', grade: 'A', sourceHint: '一般の教科書の記述' }),
  ent({ key: 'earth.psiA.rate', value: 50.38481507, unit: '″/年', quantity: '歳差の角 ψ_A の J2000 での率(規約の角)', epoch: 'J2000', frame: '固定の黄道 J2000',
    positive: '伝統の正の向き(極のベクトルの右ねじの方位と逆 —— toRH で変換して使う)', grade: 'A', sourceHint: 'IERS Conventions (2010) の歳差の式の一次の係数 ÷ 100' }),
  ent({ key: 'earth.omegaA.rate', value: -0.00025754, unit: '″/年', quantity: '固定の黄道 J2000 に対する赤道の傾き ω_A の率', epoch: 'J2000', frame: '固定の黄道 J2000', positive: '傾きが増える向きを正', grade: 'A', sourceHint: 'IERS Conventions (2010) の歳差の式の一次の係数 ÷ 100' }),
  ent({ key: 'earth.epsA.rate', value: -0.46836769, unit: '″/年', quantity: 'その日の黄道に対する平均の黄道傾斜の率(ω_A の率とは別の量)', epoch: 'J2000', frame: 'その日の黄道', positive: '傾きが増える向きを正', grade: 'A', sourceHint: 'IAU 2006 の歳差の式の一次の係数 ÷ 100' }),
  ent({ key: 'mars.prec.rate', value: -7.605, unit: '″/年', quantity: '火星の自転軸の歳差の率(負 = 逆回り)', epoch: '1980(解の元期)', frame: '火星の公転面(元期の解)', positive: '公転の北極のまわりを右ねじで正', sigma: 0.003, grade: 'B',
    sourceHint: 'Kahan ほか (2021) の表', alt: Object.freeze({ value: -7.5981, sigma: 0.0022, sourceHint: 'Le Maistre ほか (2023)(別の解・未照合)' }) }),
  ent({ key: 'mars.obliquity', value: 25.19, unit: '°', quantity: '火星の自転軸と公転の法線の角', epoch: '1980(解の元期)', frame: '火星の公転面(元期の解)', positive: '角(向きなし)', grade: 'A', sourceHint: 'Kahan ほか (2021) の表' }),
  ent({ key: 'mars.eps.rate', value: -0.0054, unit: '″/年', quantity: '火星の傾きの率(同じ解の値 —— 統括は確かめていない)', epoch: '1980(解の元期)', frame: '火星の公転面(元期の解)', positive: '傾きが増える向きを正', sigma: 0.001, grade: 'C',
    sourceHint: 'Kahan ほか (2021) の表(確度は低い)' }),
  ent({ key: 'venus.spin.period', value: 243.0226, unit: '日', quantity: '金星の恒星時の自転周期(逆行・2006〜2020 年の平均)', epoch: '2006〜2020 年の平均', frame: '慣性の枠(恒星時)', positive: '周期(正の数 —— 逆行は向きの欄で持つ)', grade: 'B',
    sourceHint: 'Margot ほか (2021)', sigmaGiven: 0.0013 }),
  ent({ key: 'venus.prec.rate', value: 44.58, unit: '″/年', quantity: '金星の自転軸の歳差の率の大きさ(回る向きは未記入 —— sense null)', epoch: '2006〜2020 年の解', frame: '金星の公転面', positive: '大きさだけ(向きは null)', grade: 'B',
    sourceHint: 'Margot ほか (2021)', sigmaGiven: 3.3, sense: null }),
  ent({ key: 'venus.obliquity', value: 2.6392, unit: '°', quantity: '金星の自転軸の傾き(著者の定義 —— 北極で測る角。有向の角運動量のベクトルでは 177.3608°)', epoch: '2006〜2020 年の解', frame: '金星の公転面', positive: '角(北極で測る)', grade: 'B',
    sourceHint: 'Margot ほか (2021)', spinVectorDeg: 177.3608 }),
  ent({ key: 'venusEarth.synodic', value: 583.92, unit: '日', quantity: '金星と地球の会合周期', epoch: '—', frame: '平均の運動', positive: '周期(正の数)', grade: 'A', sourceHint: '軌道の周期から(リポジトリの公転の周期から自分で出して照合する)' }),
  ent({ key: 'venus.resonance.period', value: 243.16, unit: '日', quantity: '内合ごとに同じ面を地球に向ける自転周期の候補(逆行)', epoch: '—', frame: '慣性の枠(恒星時)', positive: '周期(正の数 —— 逆行)', grade: 'B', sourceHint: 'Goldreich と Peale の共鳴の条件' }),
  ent({ key: 'sun.obliquity.ecl', value: 7.25, unit: '°', quantity: '太陽の自転軸と黄道の極の角', epoch: 'J2000', frame: '固定の黄道 J2000', positive: '角(向きなし)', grade: 'A', sourceHint: 'キャリントンの要素(リポジトリの spinUnit(\'Sun\') と照合する)' }),
  ent({ key: 'sun.poleDrift.upper', value: null, unit: '″/年', quantity: '慣性の枠での太陽の自転軸の動きの上限(観測の弧からの値 —— 統括は数を持っていない。照合の依頼に入れる)', epoch: '—', frame: '慣性の枠', positive: '大きさの上限', grade: 'C', sourceHint: '—— 出どころの候補なし' }),
  ent({ key: 'gal.vertical.period', value: rng(6e7, 9e7), unit: '年', quantity: '太陽の、銀河の面に対する上下の振動の周期(範囲)', epoch: '現在', frame: '銀河の面', positive: '周期(正の数)', grade: 'C', sourceHint: '銀河の円盤の密度からの概算' }),
  ent({ key: 'gal.vertical.amplitude', value: rng(70, 100), unit: 'pc', quantity: '同じ振動の振幅(範囲)', epoch: '現在', frame: '銀河の面', positive: '振幅(正の数)', grade: 'C', sourceHint: '銀河の円盤の密度からの概算' }),
  ent({ key: 'gal.oort.A', value: 15.3, unit: 'km/s/kpc', quantity: 'オールトの定数 A(局所の回転の差分のずれの分)', epoch: '現在', frame: '銀河の面(太陽の近傍)', positive: '規約の符号', grade: 'B', sourceHint: 'Gaia の近傍の星からの推定' }),
  ent({ key: 'gal.oort.B', value: -11.9, unit: 'km/s/kpc', quantity: 'オールトの定数 B(局所の渦度の半分の符号つきの値)', epoch: '現在', frame: '銀河の面(太陽の近傍)', positive: '規約の符号', grade: 'B', sourceHint: 'Gaia の近傍の星からの推定' }),
  ent({ key: 'gal.R0', value: 8.2, unit: 'kpc', quantity: '太陽の銀河中心からの距離', epoch: '現在', frame: '銀河の面', positive: '距離(正の数)', grade: 'B', sourceHint: '近年の測定の代表の値' }),
  ent({ key: 'gal.v0', value: 230, unit: 'km/s', quantity: '太陽の銀河中心のまわりの円運動の速さ', epoch: '現在', frame: '銀河の面', positive: '速さ(正の数)', grade: 'B', sourceHint: '近年の測定の代表の値' }),
]);
const BYKEY = new Map(PROV.map((e) => [e.key, e]));

/** リポジトリに既に在る「文献の値・未照合」の数を指す鍵(写さない —— 値は読む時に元の lib から引く) */
export const REPO_REFS = Object.freeze({
  'repo.earth.precGeneral': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.precessionArcsecPerYear.earth', get: () => W330.DECL.lit.precessionArcsecPerYear.earth }),
  'repo.mars.prec': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.precessionArcsecPerYear.mars', get: () => W330.DECL.lit.precessionArcsecPerYear.mars }),
  'repo.venus.prec': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.precessionArcsecPerYear.venus', get: () => W330.DECL.lit.precessionArcsecPerYear.venus }),
  'repo.venus.spinDays': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.spinDays.venus', get: () => W330.DECL.lit.spinDays.venus }),
  'repo.orbitDays.venus': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.orbitDays.venus', get: () => W330.DECL.lit.orbitDays.venus }),
  'repo.orbitDays.earth': Object.freeze({ lib: 'tests/lib-w330a-spinclass.mjs', path: 'DECL.lit.orbitDays.earth', get: () => W330.DECL.lit.orbitDays.earth }),
  'repo.galaxy.omega': Object.freeze({ lib: 'tests/lib-w337c-tidelock.mjs', path: 'GALAXY.omega', get: () => TL.GALAXY.omega }),
  'repo.spinRates': Object.freeze({ lib: 'tests/lib-w347e-spintorque.mjs', path: 'LIT.spinRates・observedRates()', get: () => E.LIT.spinRates }),
});
export const repoRef = (name) => { const r = REPO_REFS[name]; if (!r) throw new RangeError('repoRef: 無い鍵 ' + name); return r.get(); };

/* ───────── 口 ───────── */
/** 仮の値の 1 件(無い鍵は例外) */
export function prov(key) { const e = BYKEY.get(key); if (!e) throw new RangeError('prov: 仮の値の台帳に無い鍵 ' + String(key)); return e; }
/** 台帳の全件(凍結の配列) */
export const provList = () => PROV;
/** 値の数(範囲は lo と hi のどちらか —— which 'lo'・'hi'・'mid') */
export function provValue(key, which = null) {
  const v = prov(key).value;
  if (v && typeof v === 'object') { if (which === 'lo') return v.lo; if (which === 'hi') return v.hi; if (which === 'mid') return (v.lo + v.hi) / 2; throw new RangeError('provValue: 範囲の値は lo・hi・mid を指定 —— ' + key); }
  return v;
}
/**
 * 右ねじの向きの符号つきの率(″/年 —— その件の基準の極のまわりを右ねじで正)。ψ_A は伝統の正の向きが逆なので符号を反転する。向きが無い件(金星の歳差)は null。
 */
export function toRH(key) {
  const e = prov(key);
  if (e.sense === null) return null;
  if (key === 'earth.psiA.rate') return -e.value;
  return e.value;
}
/** 出力に、使った仮の値の鍵の一覧と印を付ける(新しい凍結していない写しを返す —— 無い鍵は例外) */
export function tagProv(obj, keys) {
  if (!Array.isArray(keys) || keys.length === 0) throw new RangeError('tagProv: 使った鍵の一覧(1 つ以上)');
  for (const k of keys) prov(k);
  const prev = obj && Array.isArray(obj.provKeys) ? obj.provKeys : [];
  return Object.assign({}, obj, { provisional: true, provMark: MARK, provKeys: [...new Set(prev.concat(keys))].sort() });
}
/** 印の付いた値が中に在るか(入れ子を辿る) */
export function hasProv(x, depth = 0) {
  if (depth > 32 || x === null || typeof x !== 'object') return false;
  if (x.provisional === true || x.provMark === MARK || (Array.isArray(x.provKeys) && x.provKeys.length > 0)) return true;
  return (Array.isArray(x) ? x : Object.values(x)).some((v) => hasProv(v, depth + 1));
}
/** 判定の側(較正の合否・サンプルの状況・ノブの採否・正式判定値)へ渡す値に、仮の値の印が無いことを要る(在れば例外)。印が無ければそのまま返す */
export function assertNoVerdict(x) {
  if (hasProv(x)) throw new Error('assertNoVerdict: 仮の値(' + MARK + ')を使った値は判定に入れない');
  return x;
}

/* ───────── 台帳の検査(変異の自己試験に使う純関数)───────── */
/** 1 件の欠け・印の欠け・sigma の規則の違反(文の配列 —— 空なら良い) */
export function entryProblems(e) {
  const bad = [];
  if (!e || typeof e !== 'object') return ['件が無い'];
  for (const f of FIELDS) if (!(f in e)) bad.push('欄の欠け ' + f);
  if (e.provisional !== true) bad.push('印 provisional');
  if (e.verified !== false) bad.push('印 verified');
  if (e.useForVerdict !== false) bad.push('印 useForVerdict');
  if (!GRADES.includes(e.grade)) bad.push('grade');
  if (!(typeof e.sourceHint === 'string' && e.sourceHint.indexOf(HINT_WORD) >= 0)) bad.push('出どころの候補に「未照合」が無い');
  for (const f of ['key', 'unit', 'quantity', 'epoch', 'frame', 'positive']) if (!(typeof e[f] === 'string' && e[f].length > 0)) bad.push('欄が空 ' + f);
  const v = e.value;
  if (!(v === null || fin(v) || (v && typeof v === 'object' && fin(v.lo) && fin(v.hi) && v.lo <= v.hi))) bad.push('値の形');
  if (e.sigma !== null && e.sigma !== undefined) {
    if (!(fin(e.sigma) && e.sigma > 0)) bad.push('sigma の形');
    if (!SIGMA_HINT_RE.test(String(e.sourceHint))) bad.push('sigma を持つのに出どころの候補に表か式の語が無い');
  }
  return bad;
}
/** 台帳全体の検査(鍵の重複を含む) */
export function ledgerProblems(list = PROV) {
  const bad = [], seen = new Set();
  for (const e of list) { for (const p of entryProblems(e)) bad.push((e && e.key) + ': ' + p); if (e && seen.has(e.key)) bad.push('鍵の重複 ' + e.key); if (e) seen.add(e.key); }
  return bad;
}

/* ───────── 使ってよい所の門(lint.provisionalScope352b の純関数)───────── */
/** 仮の値の lib の名(import の検出) */
export const PROV_LIB = 'lib-w352b-provisional.mjs';
/** 仮の値を import してはならない器と lib(較正の監査・サンプルの状況・正式判定値 —— 名はリポジトリを調べて固定) */
export const GUARDED = Object.freeze(['tools/samplestatus-postgate.mjs', 'tools/calaudit-split.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/exp-w279a-samplestatus.mjs',
  'tests/lib-w279a-samplestatus.mjs', 'tests/lib-w268a-judgement.mjs']);
/** 名の形で守る器と lib(後から足される同じ種類のファイルも受ける) */
export const GUARDED_RE = /(^|\/)[^/]*(samplestatus|calaudit|calverdict|judgement)[^/]*\.mjs$/;
/** 仮の値の鍵が出てはならない文書と表(サンプルの状況・較正の表) */
export const NO_KEY_DOCS = Object.freeze(['docs/SAMPLE_STATUS.md', 'tests/out/samplestatus-w279a.json', 'tests/data-w279a-samplestatus-src.json', 'tests/data-w323d-calverdict.json']);
/** 相対の import の一覧(テキストから —— 'from' と動的な import の両方) */
export function importsOf(text) {
  const out = new Set();
  for (const m of String(text).matchAll(/(?:from\s*|import\s*\(\s*)['"]([^'"]+\.mjs)['"]/g)) out.add(m[1]);
  return [...out];
}
const resolveRel = (from, rel) => {
  if (!rel.startsWith('.')) return null;
  const parts = from.split('/').slice(0, -1);
  for (const p of rel.split('/')) { if (p === '.' || p === '') continue; if (p === '..') parts.pop(); else parts.push(p); }
  return parts.join('/');
};
/** そのファイルが仮の値の lib を直接に import するか */
export const importsProvDirect = (text) => importsOf(text).some((r) => r.split('/').pop() === PROV_LIB);
/** 本便より後の診断の lib・器か(名の波の番号 ≥ 352 の lib-/exp-・または QA の本体) */
export function allowedImporter(p) {
  if (p === 'tests/qa.mjs') return true;
  const m = /^tests\/(?:lib|exp)-w(\d{3})[a-z]/.exec(p);
  return !!(m && Number(m[1]) >= 352) && !GUARDED_RE.test(p);
}
/**
 * files: { 道: テキスト }(tests/ と tools/ の .mjs)。戻り値 { direct: 直接に import する道, banned: 許されない直接の import, guardedHit: 守る器と lib のうち、import の閉包に仮の値の lib を含むもの(経路つき) }
 */
export function scopeViolations(files) {
  const has = (p) => Object.prototype.hasOwnProperty.call(files, p);
  const direct = Object.keys(files).filter((p) => importsProvDirect(files[p])).sort();
  const banned = direct.filter((p) => !allowedImporter(p));
  const guarded = Object.keys(files).filter((p) => GUARDED.includes(p) || GUARDED_RE.test(p)).sort();
  const guardedHit = [];
  for (const g of guarded) {
    const seen = new Set([g]), stack = [[g, [g]]];
    while (stack.length) {
      const [p, via] = stack.pop();
      if (importsProvDirect(files[p])) { guardedHit.push(via.join(' → ') + ' → ' + PROV_LIB); break; }
      for (const r of importsOf(files[p])) { const q = resolveRel(p, r); if (q && has(q) && !seen.has(q)) { seen.add(q); stack.push([q, via.concat([q])]); } }
    }
  }
  return { direct, banned, guardedHit, guarded };
}
/** 文書・表のテキストに出る仮の値の鍵(出てはならない所の検査) */
export const keyLeaks = (text) => PROV.map((e) => e.key).filter((k) => String(text).indexOf(k) >= 0);
/** 正本(JSON)の最上位の印の検査: 仮の値の lib を来歴に持つなら provisional: true と使った鍵の一覧が要る */
export function outMarkProblems(J) {
  const usesProv = JSON.stringify((J && J.meta && J.meta.code) || []).indexOf(PROV_LIB) >= 0;
  if (!usesProv) return [];
  const bad = [];
  if (J.provisional !== true) bad.push('最上位の provisional: true が無い');
  if (!(Array.isArray(J.provKeys) && J.provKeys.length > 0 && J.provKeys.every((k) => BYKEY.has(k)))) bad.push('最上位の provKeys(使った鍵の一覧)が無いか台帳に無い鍵');
  return bad;
}

/* ───────── 照合の列(仮の値とリポジトリの数 —— 比べるだけ)───────── */
/** 太陽系の基準軸の候補(8 惑星の公転の法線の等しい重み —— 統括の数え直し 1 と同じ作り)。黄道 J2000 の成分 */
export const PL8 = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
export function refAxisEq(GEO = E.geometry()) { return unit(PL8.map((id) => unit(GEO[id + '|Sun'].n)).reduce((s, n) => add(s, n), [0, 0, 0])); }
/** 会合周期 S = 1 ÷ (1/P_V − 1/P_E)・共鳴の周期の候補 P = S ÷ (5 − S/P_V)(内合ごとに同じ面 —— 逆行の自転で地球に対して 5 回) */
export function synodicOf(pV, pE) { return 1 / (1 / pV - 1 / pE); }
export function resonancePeriod(S, pV, m = 5) { return S / (m - S / pV); }
/** 1 pc の長さ(m —— IAU の定義の値 648000/π au・au = 149597870700 m) */
export const PC_M = 648000 / Math.PI * 149597870700;
export function crossRows(GEO = E.geometry()) {
  const pV = repoRef('repo.orbitDays.venus'), pE = repoRef('repo.orbitDays.earth'), S = synodicOf(pV, pE);
  const sunObl = angDeg(GEO['Earth|Sun'].s, [0, 0, 1]);
  const marsObl = angDeg(GEO['Mars|Sun'].w, GEO['Mars|Sun'].n), venusObl = angDeg(GEO['Venus|Sun'].w, GEO['Venus|Sun'].n), earthObl = angDeg(GEO['Earth|Sun'].w, GEO['Earth|Sun'].n);
  const omG = provValue('gal.v0') * 1e3 / (provValue('gal.R0') * 1e3 * PC_M), omRepo = repoRef('repo.galaxy.omega');
  const kmsKpc = (w) => w * 1e3 * PC_M / 1e3;   // rad/s → km/s/kpc
  const A = provValue('gal.oort.A'), B = provValue('gal.oort.B');
  return [
    { key: 'venusEarth.synodic', prov: provValue('venusEarth.synodic'), repo: S, repoFrom: 'repo.orbitDays.venus・repo.orbitDays.earth の 1 ÷ (1/P_V − 1/P_E)', diff: provValue('venusEarth.synodic') - S, unit: '日' },
    { key: 'venus.resonance.period', prov: provValue('venus.resonance.period'), repo: resonancePeriod(S, pV), repoFrom: 'S ÷ (5 − S/P_V)(リポジトリの公転の周期)', diff: provValue('venus.resonance.period') - resonancePeriod(S, pV), unit: '日' },
    { key: 'venus.spin.period', prov: provValue('venus.spin.period'), repo: Math.abs(repoRef('repo.venus.spinDays')), repoFrom: 'repo.venus.spinDays(大きさ —— 符号は逆行)', diff: provValue('venus.spin.period') - Math.abs(repoRef('repo.venus.spinDays')), unit: '日' },
    { key: 'venus.prec.rate', prov: provValue('venus.prec.rate'), repo: repoRef('repo.venus.prec'), repoFrom: 'repo.venus.prec', diff: provValue('venus.prec.rate') - repoRef('repo.venus.prec'), unit: '″/年' },
    { key: 'venus.obliquity', prov: prov('venus.obliquity').spinVectorDeg, repo: venusObl, repoFrom: '〔第347便e〕の geometry() の自転のベクトルと公転の法線の角(有向の角運動量)', diff: prov('venus.obliquity').spinVectorDeg - venusObl, unit: '°' },
    { key: 'mars.prec.rate', prov: Math.abs(provValue('mars.prec.rate')), repo: repoRef('repo.mars.prec'), repoFrom: 'repo.mars.prec(大きさ)', diff: Math.abs(provValue('mars.prec.rate')) - repoRef('repo.mars.prec'), unit: '″/年' },
    { key: 'mars.obliquity', prov: provValue('mars.obliquity'), repo: marsObl, repoFrom: '〔第347便e〕の geometry() の火星の自転のベクトルと公転の法線の角', diff: provValue('mars.obliquity') - marsObl, unit: '°' },
    { key: 'sun.obliquity.ecl', prov: provValue('sun.obliquity.ecl'), repo: sunObl, repoFrom: "第342便e の lib の spinUnit('Sun') と黄道の極の角", diff: provValue('sun.obliquity.ecl') - sunObl, unit: '°' },
    { key: 'gal.R0・gal.v0', prov: omG, repo: omRepo, repoFrom: 'repo.galaxy.omega(第337便c の lib の宣言の銀河の公転の角速度)', diff: omG - omRepo, rel: omG / omRepo - 1, unit: 'rad/s' },
    { key: 'gal.oort.A・gal.oort.B', prov: A - B, repo: kmsKpc(omG), repoFrom: 'A − B(局所の角速度)と v0 ÷ R0(仮の値どうし)', diff: A - B - kmsKpc(omG), rel: (A - B) / kmsKpc(omG) - 1, unit: 'km/s/kpc' },
    { key: 'earth.obliquity(リポジトリの数 —— 仮の値ではない)', prov: null, repo: earthObl, repoFrom: '〔第347便e〕の geometry() の地球の自転のベクトルと黄道の極の角', diff: null, unit: '°' },
  ].map((r) => Object.assign(r, { mark: r.prov === null ? null : MARK }));
}

/* ───────── T4 経路の比率の感度の仮計算 ───────── */
/** 前提(表の頭に書く —— この前提は今の候補では成り立っていない) */
export const T4_PREMISE = Object.freeze(['観測の基準の極 = 合成の軸', '一定の場', 'ほかのトルクなし']);
/** 〔第351便k〕の式: r = abs(dθ/dt) ÷ (sin θ × abs(dφ/dt))・(N1) の置き方で k₁ ÷ k₂ = r・f = r ÷ (1 + r) */
export function ratioOf(dThetaDt, thetaDeg, dPhiDt) {
  if (![dThetaDt, thetaDeg, dPhiDt].every(fin)) throw new RangeError('ratioOf: 数');
  const sp = Math.sin(thetaDeg * D2R) * Math.abs(dPhiDt);
  if (!(sp > 0)) throw new RangeError('ratioOf: sin θ × abs(dφ/dt) > 0');
  const r = Math.abs(dThetaDt) / sp;
  return { r, f: r / (1 + r), poleSpeed: Math.hypot(dThetaDt, sp), toward: dThetaDt < 0 };
}
/** 背景の向きの列(主の列の合成の率): (G−)・(G+)(bgTerm の向き −1/+1)・(N+)・(N−)(基準軸〔等重み〕の向き/逆 —— 大きさは同じ) */
export const BG_DIRS = Object.freeze(['G-', 'G+', 'N+', 'N-']);
/** 金星で (S) と背景の大きさが同じになる倍率(k 1・分母に銀河を入れない —— 第351便e の localOf・uEqMag)*/
export function uVenusS(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const V = BB.localOf(T1, GEO, 'Venus', 'Sun', { k: 1 }, cache);
  return BB.uEqMag(V.sun.S, BB.bgTerm('Venus', { u: 1 }).vec);
}
/** 主の列の合成の率 abs(Ω)(″/年)—— 成分 (S)・(C2)・k 1・倍率 u・背景の向き dir */
export function mainRate(T1, GEO, id, u, dir, cache = {}) {
  if (!BG_DIRS.includes(dir)) throw new RangeError('mainRate: 背景の向きは ' + BG_DIRS.join('・'));
  if (dir === 'G-' || dir === 'G+') return nrm(BB.totalOm(T1, GEO, { id, src: 'Sun', part: 'S', k: 1, u, sign: dir === 'G-' ? -1 : 1 }, cache).Om) * AS_YR;
  const L = BB.localOf(T1, GEO, id, 'Sun', { k: 1 }, cache), mag = nrm(BB.bgTerm(id, { u }).vec), ax = refAxisEq(GEO);
  return nrm(add(scl(ax, dir === 'N+' ? mag : -mag), L.sun.S)) * AS_YR;
}
/** T4 の行(地球 2 列 × 歳差の率 2 列〔ψ_A・リポジトリの一般歳差〕+ 火星 2 列〔解 2 つ〕) */
export function t4Rows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const uS = uVenusS(T1, GEO, cache), earthObl = angDeg(GEO['Earth|Sun'].w, GEO['Earth|Sun'].n);
  const defs = [
    { id: 'Earth', col: '地球・固定の黄道 J2000 に対する傾きの率 ÷ ψ_A の率', dTheta: provValue('earth.omegaA.rate'), theta: earthObl, thetaFrom: 'リポジトリ(geometry の地球の傾き)', dPhi: toRH('earth.psiA.rate'), keys: ['earth.omegaA.rate', 'earth.psiA.rate'] },
    { id: 'Earth', col: '地球・その日の黄道に対する傾きの率 ÷ ψ_A の率', dTheta: provValue('earth.epsA.rate'), theta: earthObl, thetaFrom: 'リポジトリ(geometry の地球の傾き)', dPhi: toRH('earth.psiA.rate'), keys: ['earth.epsA.rate', 'earth.psiA.rate'] },
    { id: 'Earth', col: '地球・その日の黄道に対する傾きの率 ÷ リポジトリの一般歳差', dTheta: provValue('earth.epsA.rate'), theta: earthObl, thetaFrom: 'リポジトリ(geometry の地球の傾き)', dPhi: -repoRef('repo.earth.precGeneral'), keys: ['earth.epsA.rate'], repo: ['repo.earth.precGeneral'] },
    { id: 'Mars', col: '火星・傾きの率 ÷ 歳差の率(Kahan ほか の解)', dTheta: provValue('mars.eps.rate'), theta: provValue('mars.obliquity'), thetaFrom: '仮の値 mars.obliquity', dPhi: toRH('mars.prec.rate'), keys: ['mars.eps.rate', 'mars.obliquity', 'mars.prec.rate'] },
    { id: 'Mars', col: '火星・傾きの率 ÷ 歳差の率(別の解)', dTheta: provValue('mars.eps.rate'), theta: provValue('mars.obliquity'), thetaFrom: '仮の値 mars.obliquity', dPhi: prov('mars.prec.rate').alt.value, keys: ['mars.eps.rate', 'mars.obliquity', 'mars.prec.rate'] },
  ];
  return defs.map((d) => {
    const R = ratioOf(d.dTheta, d.theta, d.dPhi), main = {};
    for (const dir of BG_DIRS) main[dir] = mainRate(T1, GEO, d.id, uS, dir, cache);
    const over = {}; for (const dir of BG_DIRS) over[dir] = R.poleSpeed / main[dir];
    return tagProv({ id: d.id, col: d.col, dThetaDt: d.dTheta, thetaDeg: d.theta, thetaFrom: d.thetaFrom, dPhiDt: d.dPhi, r: R.r, fN1: R.f, kTiltOverKPrec: R.r, toward: R.toward,
      poleSpeedAsYr: R.poleSpeed, uS, mainRateAsYr: main, poleOverMain: over, repoRefs: d.repo || [] }, d.keys);
  });
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 1 の数(自分の lib で同じ数が出ること —— 床で照合) */
export const ANCHOR = Object.freeze({ refEq: Object.freeze([0.0339521, -0.0096634, 0.9993767]), refEqTol: 5e-7, sunToRefEqDeg: 5.230, sunToEclDeg: 7.252, degTol: 5e-4,
  uS: 1.19282e-12, uMS: 25.4221, uRelTol: 5e-6, bgMagAsYr: 7.05776e-15, gDeltaRefDeg: 62.136 });
/** 共通の点検の数(第350便まで —— 自転しない源の通過) */
export const COMMON = Object.freeze({ p2x: -0.03061311, p6: -0.01530656, w: -0.01530612, tol: 5e-9 });
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  // (1) 台帳の欄と印
  const ledger = ledgerProblems();
  // (2) 変異: 欄の欠け・印の欠け・grade・未照合の語・sigma の規則(どれも落ちる)
  const base = prov('mars.prec.rate'), venus = prov('venus.spin.period');
  const drop = (e, f) => { const c = Object.assign({}, e); delete c[f]; return c; };
  const mutants = [drop(base, 'frame'), drop(base, 'sigma'), Object.assign({}, base, { verified: true }), Object.assign({}, base, { useForVerdict: true }), Object.assign({}, base, { provisional: false }),
    Object.assign({}, base, { grade: 'D' }), Object.assign({}, base, { sourceHint: 'Kahan ほか (2021) の表' }), Object.assign({}, venus, { sigma: 0.0013 }), drop(base, 'positive')];
  const mutantCaught = mutants.map((m) => entryProblems(m).length > 0);
  const dupCaught = ledgerProblems(PROV.concat([PROV[0]])).some((s) => s.indexOf('鍵の重複') >= 0);
  // (3) 口
  let unknownThrows = false; try { prov('no.such.key'); } catch (e) { unknownThrows = true; }
  let tagUnknownThrows = false; try { tagProv({}, ['no.such.key']); } catch (e) { tagUnknownThrows = true; }
  const tagged = tagProv({ a: 1 }, ['mars.obliquity', 'earth.precSense', 'mars.obliquity']);
  let avThrows = false, avNestedThrows = false, avClean = false;
  try { assertNoVerdict(tagged); } catch (e) { avThrows = true; }
  try { assertNoVerdict({ rows: [{ x: 1 }, { y: [tagged] }] }); } catch (e) { avNestedThrows = true; }
  try { avClean = assertNoVerdict({ rows: [{ x: 1 }] }).rows[0].x === 1; } catch (e) { avClean = false; }
  let rangeThrows = false; try { provValue('gal.vertical.period'); } catch (e) { rangeThrows = true; }
  // (4) 向きの符号: ψ_A の右ねじの率 と 火星の歳差の率 が地球の歳差の回る向きと同じ符号
  const sense = { psiRH: toRH('earth.psiA.rate'), mars: toRH('mars.prec.rate'), earthSense: provValue('earth.precSense'), venus: toRH('venus.prec.rate') };
  // (5) 照合の列
  const cross = crossRows(GEO);
  // (6) 使ってよい所の門(合成のファイルの組で変異)
  // 合成の import の文は、字句で import を辿る道具(器の来歴の閉包・QA の呼ぶだけの検査)に拾われない形で組む
  const imS = (p) => 'import * as Q ' + 'fr' + "om '" + p + "';", imD = (p) => 'const Q = await ' + 'imp' + "ort('" + p + "');", PV = './' + PROV_LIB;
  const F0 = { 'tests/lib-w279a-samplestatus.mjs': imS('./lib-w268a-judgement.mjs'), 'tests/lib-w268a-judgement.mjs': "const x = 1;", 'tests/lib-w352x-diag.mjs': imS(PV),
    'tests/lib-w352b-provisional.mjs': "export const PROV = [];", 'tools/samplestatus-postgate.mjs': imS('../tests/lib-w279a-samplestatus.mjs') };
  const s0 = scopeViolations(F0);
  const s1 = scopeViolations(Object.assign({}, F0, { 'tests/lib-w268a-judgement.mjs': imS(PV) }));   // 間接(postgate → samplestatus → judgement → 仮の値)
  const s2 = scopeViolations(Object.assign({}, F0, { 'tests/lib-w351z-old.mjs': imD(PV) }));   // 本便より前の名の lib が import
  const s3 = scopeViolations(Object.assign({}, F0, { 'tests/exp-w360a-calaudit.mjs': imS(PV) }));   // 名の形で守る器
  const scope = { clean: s0.banned.length === 0 && s0.guardedHit.length === 0 && s0.direct.length === 1, indirect: s1.guardedHit.length === 3 && s1.guardedHit.some((h) => /^tools\/samplestatus-postgate\.mjs → tests\/lib-w279a-samplestatus\.mjs → tests\/lib-w268a-judgement\.mjs → /.test(h)),
    oldName: s2.banned.includes('tests/lib-w351z-old.mjs'), byName: s3.banned.includes('tests/exp-w360a-calaudit.mjs') && s3.guardedHit.length === 1 };
  const leak = { none: keyLeaks('サンプルの状況の表').length === 0, hit: keyLeaks('| earth.psiA.rate |').includes('earth.psiA.rate') };
  const outMark = { ok: outMarkProblems({ meta: { code: ['tests/' + PROV_LIB] }, provisional: true, provKeys: ['mars.obliquity'] }).length === 0,
    miss: outMarkProblems({ meta: { code: ['tests/' + PROV_LIB] } }).length === 2, free: outMarkProblems({ meta: { code: ['tests/lib-x.mjs'] } }).length === 0 };
  // (7) 統括の数え直し 1 の数
  const ax = refAxisEq(GEO), sun = GEO['Earth|Sun'].s, uS = uVenusS(T1, GEO, cache);
  const V = BB.localOf(T1, GEO, 'Venus', 'Sun', { k: 1 }, cache), uMS = BB.uEqMag(V.sun.MS, BB.bgTerm('Venus', { u: 1 }).vec);
  const anc = { refEq: ax, sunToRefEq: angDeg(sun, ax), sunToEcl: angDeg(sun, [0, 0, 1]), uS, uMS, bgMag: nrm(BB.bgTerm('Venus', { u: uS }).vec) * AS_YR, gDeltaRef: angDeg(ax, BB.bgTerm('Earth', { u: 1 }).vec) };
  // (8) 共通の点検の数
  const cc = BG.commonChecks(), common = { p2x: cc.diaXz, p6: cc.sixZ, w: cc.rotWz };
  // (9) 比の式: r → f の往復・閉じた形の (N1)(k₁ ÷ k₂ = r)
  const rt = ratioOf(-0.5, 30, 2), rtInv = rt.f / (1 - rt.f);
  let ratioThrows = false; try { ratioOf(1, 0, 1); } catch (e) { ratioThrows = true; }
  // (10) mainRate の (G−) が第351便e の totalOm と同じ(地球・(S)・倍率 uS)・向き (N+) の金星の打ち消し(統括の数え直し 1 の 1.0%)
  const gm = mainRate(T1, GEO, 'Earth', uS, 'G-', cache), gmRef = nrm(BB.totalOm(T1, GEO, { id: 'Earth', src: 'Sun', part: 'S', u: uS }, cache).Om) * AS_YR;
  const venusN = mainRate(T1, GEO, 'Venus', uS, 'N+', cache) / anc.bgMag;
  return { ledger, mutantCaught, dupCaught, unknownThrows, tagUnknownThrows, taggedKeys: tagged.provKeys, avThrows, avNestedThrows, avClean, rangeThrows, sense, cross, scope, leak, outMark, anc, common,
    ratio: { r: rt.r, f: rt.f, inv: rtInv, toward: rt.toward, throws: ratioThrows }, main: { gm, gmRef, venusN }, frozen: Object.isFrozen(PROV) && PROV.every((e) => Object.isFrozen(e)) };
}
export function pureGates(S) {
  const A = ANCHOR, rel = (a, b) => Math.abs(a / b - 1);
  const cx = (k) => S.cross.find((r) => r.key === k);
  return {
    ledger: S.ledger.length === 0 && S.frozen && PROV.length === 20,
    mutants: S.mutantCaught.length === 9 && S.mutantCaught.every(Boolean) && S.dupCaught,
    api: S.unknownThrows && S.tagUnknownThrows && JSON.stringify(S.taggedKeys) === JSON.stringify(['earth.precSense', 'mars.obliquity']) && S.avThrows && S.avNestedThrows && S.avClean && S.rangeThrows,
    sense: Math.sign(S.sense.psiRH) === S.sense.earthSense && Math.sign(S.sense.mars) === S.sense.earthSense && S.sense.venus === null,
    cross: Math.abs(cx('venusEarth.synodic').diff) < 0.01 && Math.abs(cx('venus.resonance.period').diff) < 0.01 && Math.abs(cx('sun.obliquity.ecl').diff) < 0.01 && Math.abs(cx('gal.R0・gal.v0').rel) < 0.01
      && S.cross.length === 11,
    scope: Object.values(S.scope).every(Boolean) && S.leak.none && S.leak.hit && Object.values(S.outMark).every(Boolean),
    anchor: A.refEq.every((x, i) => Math.abs(S.anc.refEq[i] - x) < A.refEqTol) && Math.abs(S.anc.sunToRefEq - A.sunToRefEqDeg) < A.degTol && Math.abs(S.anc.sunToEcl - A.sunToEclDeg) < A.degTol
      && rel(S.anc.uS, A.uS) < A.uRelTol && rel(S.anc.uMS, A.uMS) < A.uRelTol && rel(S.anc.bgMag, A.bgMagAsYr) < A.uRelTol && Math.abs(S.anc.gDeltaRef - A.gDeltaRefDeg) < A.degTol,
    common: Math.abs(S.common.p2x - COMMON.p2x) < COMMON.tol && Math.abs(S.common.p6 - COMMON.p6) < COMMON.tol && Math.abs(S.common.w - COMMON.w) < COMMON.tol,
    ratio: Math.abs(S.ratio.r - 0.5) < 1e-12 && Math.abs(S.ratio.inv - S.ratio.r) < 1e-12 && Math.abs(S.ratio.f - 1 / 3) < 1e-12 && S.ratio.toward === true && S.ratio.throws,
    main: rel(S.main.gm, S.main.gmRef) < 1e-12 && Math.abs(S.main.venusN - 0.010) < 0.001,
  };
}

/* ───────── 宣言(器と文書が読む)───────── */
export const DECL = Object.freeze({ nProv: 20, fields: FIELDS, grades: GRADES, mark: MARK, bgDirs: BG_DIRS, guarded: GUARDED, guardedRe: GUARDED_RE.source, noKeyDocs: NO_KEY_DOCS,
  anchor: ANCHOR, common: COMMON, t4Premise: T4_PREMISE, provLib: PROV_LIB });
/** 正本に載せる台帳の写し(JSON に書ける形)と、リポジトリの数を指す鍵の一覧 */
export const provJson = () => PROV.map((e) => JSON.parse(JSON.stringify(e)));
export const repoRefList = () => Object.entries(REPO_REFS).map(([name, r]) => ({ name, lib: r.lib, path: r.path }));
