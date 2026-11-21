// 第345便c(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」・統括の検証項目 R394): **検査を実行系(ブラウザと Node)に依らない形へ**(純関数だけ)。
//
// ■ 原則(統括の設計 —— PHYSICS〔第345便c〕)
//   ・**同じ実行系の中ではビットで同じ**を要求する(同じページで 2 回・Node で 2 回・同じ器で 2 回)。
//   ・**実行系の間**(ページと Node・古い版で測った記録と今のブラウザ)は、**その検査の量に限って宣言した許容**で比べる。
//     許容は量ごとに別(球の核の求積の許容を、長い走りの軌道や観測の σ の門へ広げない)。
//   ・「同じ数値の実行系か」は版の名前でなく**数学関数の指紋**(tests/lib-w345-engine.mjs —— 枝 b)で見る。
//     記録を測った実行系は、段の刻印の台帳(tests/data-w345e-enginestamp.json —— 枝 e)がその段を今の宣言で刻み、かつ鎖が走った箱の記録
//     (tests/out/engine-345b.json)の指紋が宣言と同じときだけ「分かる」(= 宣言の指紋)。それ以外(html に書いた記録・過去の便に固定した値・
//     台帳の無い段)は「記録に実行系が無い」(null)。
//   ・**退役した本・過去の便に固定した記録は書き換えない** —— 版が違うときは ulp の差を「比べる列」に残して続ける(上限を超えたら止める)。
//
// ■ しないこと
//   ・html を読まない・ブラウザを起こさない(ページの指紋は呼ぶ側が page.evaluate(probeExpression()) で測って渡す)。
//   ・regentable を import しない(器の閉包に入れない —— 台帳と宣言の hash は呼ぶ側が渡す)。
import { compareValues, ulpDiff, relDiff } from './lib-w345-engine.mjs';

export const CROSSENGINE_LIB_VERSION_345C = 'w345c-crossengine-1';

// ---- 許容(量ごと —— 根拠は PHYSICS〔第345便c〕の表。ここで決めた値を器と鍵が同じに読む) ----
/**
 * 球の表裏核の求積の値の欄(W・dW・G・dG と、和の核の場の値と導関数)の、ページと Node の間の相対の許容 = 128ε(2.84e−14)。
 * 根拠: 同じ式・同じ和の順なので、差は超越関数(atanh・log・pow・cos)の最下位ビットからだけ生じる。1 ulp の差が値の欄に届く大きさは
 * Σ|項 × (at/t)| ÷ |Σ 項|(K = at/t − 1 の打ち消し)で、⑦ の 12 点の最大は 78(star・r=3.7 の G)—— これに密度(pow)と正規化
 * (8192 項の正の和 —— 1ε 程度)と節点の数 ε を足しても 128 に収まる。測った最大は 11.1ε(17 ulp・157 と 153 の両方)。
 */
export const KERNEL_REL_TOL_345C = 128 * Number.EPSILON;
/**
 * ui.liveMeasure297 ① の 🟫 の h/2 の差(|v(h) − v(h/2)| ≈ 1.97e−4)を、記録に実行系が無い(か違う)ときに比べる相対の許容 = 1e−6。
 * 根拠: 157 と 141 の記録の差は相対 3.4e−9(絶対 6.6e−13 —— 38 万步の走りで ulp の差が育った分)。1e−6 はそれの約 300 倍で、
 * 量そのもの(刻みの差 2e−4)の 100 万分の 1(絶対 2e−10)—— 刻みの差の意味のある変化(h/2 の走りの物理が変わる)は隠さない。
 */
export const H2_REL_TOL_345C = 1e-6;
/**
 * 水星の段の退役の kF1(🪨 の近点の傾き —— 記録は第287便に固定・実行系の記録なし)の ulp の差の上限 = 4。
 * 根拠: 157・153 と 141 の記録の差は −2 ulp(自分で測った)。歴史の中で最も小さい物理の変化(第291便b の 1PN の源の集合 —— kF0 で −9.129e−13)は
 * 約 2.7e8 ulp なので、4 ulp は物理の変化を隠さない。超えたら止める。
 */
export const KF1_MAX_ULP_345C = 4;
/**
 * ❄️(第290便b で退役)の kF0 の周期の「正式の値」(過去の便に固定した記録 —— 第291便の鎖 2 の正本の値・実行系の記録が無い)の ulp の差の上限 = 1024。
 * 第345便(統括 —— 鎖の後の転記照合)で tests/qa.mjs の先頭に CHARON_KF0_RECORD_MAX_ULP_345 として置いた値を、第346便a でここへ移した(値は同じ ——
 * 器 tests/exp-w280c-geo3.mjs・tests/exp-w280d-charonInput.mjs が自分で fixedRecordGate を呼び、鍵 docs.geo3-sync・docs.charonInput が同じ定数で照合する)。
 * 根拠(当時の注を写す): chromium 157 で測った差は +316 ulp(h)・−475 ulp(h/2)—— 相対 1e−13・絶対 3.7e−8 s と 5.5e−8 s。この門が見るのは抽出器・窓・刻みの定義の違いで、
 * 一番小さい例(刻み h と h/2 の値の差 9.7e−5 s)が約 8.4e5 ulp —— 1024 ulp(1.2e−7 s)はそれより 3 桁小さい。超えたら止める。
 * 現役の calaudit の行から来た正式の値は、今までどおりビットで同じを要求する。
 */
export const CHARON_KF0_MAX_ULP_345 = 1024;

// ---- 記録を測った実行系 ----
/**
 * 段の記録を測った実行系の指紋(分かれば 16 桁の指紋・分からなければ null)。
 * @param {{stageKey:string, ledger:object|null, declSha:string|null, decl:{mathFingerprint:string}|null, box:{mathFingerprint:string}|null}} o
 *   ledger = tests/data-w345e-enginestamp.json・declSha = 宣言の意味的 hash(regentable の engineDeclSha345e)・decl = 宣言・box = tests/out/engine-345b.json
 * @returns {{fingerprint:string|null, why:string}}
 */
export function recordEngineOf(o) {
  const x = o || {};
  if (!x.stageKey) return { fingerprint: null, why: '段の名が無い(html の記録か過去の便に固定した値 —— 記録に実行系が無い)' };
  if (!x.declSha || !x.decl || typeof x.decl.mathFingerprint !== 'string') return { fingerprint: null, why: '実行系の宣言が無い' };
  const st = x.ledger && x.ledger.stages ? x.ledger.stages[x.stageKey] : null;
  if (!st) return { fingerprint: null, why: '段 ' + x.stageKey + ' が刻印の台帳に無い(鎖の前の記録)' };
  if (st.decl !== x.declSha) return { fingerprint: null, why: '段 ' + x.stageKey + ' の刻印の宣言が今と違う' };
  if (!x.box || x.box.mathFingerprint !== x.decl.mathFingerprint) return { fingerprint: null, why: '鎖が走った箱の記録(engine-345b)の指紋が宣言と違うか無い' };
  return { fingerprint: x.decl.mathFingerprint, why: '段 ' + x.stageKey + ' は宣言の実行系で作った(刻印の台帳・箱の記録)' };
}
/** 今の実行系と記録の実行系が同じか(記録が null なら false —— 「記録に実行系が無い」)。 */
export function sameAsRecord(nowFp, recFp) { return typeof nowFp === 'string' && typeof recFp === 'string' && nowFp === recFp; }
/** 結果の文に出す印 */
export function engineMark(same, recFp) { return same ? '実行系が同じ(ビットで同じを要求)' : (recFp ? '実行系が違う(許容つき)' : '記録に実行系が無い —— 実行系が違うものとして許容つき'); }

// ---- T1: 求積の値の組(ページと Node)を比べる ----
const STRUCT_KEYS_345C = ['ok', 'err', 'nNodes', 'nPanels', 'n', 'kernel'];
/** object / 配列の葉を [path, 値] で並べる(キーは整列) */
export function leavesOf(v, p, out) {
  const o = out || [], pre = p || '';
  if (Array.isArray(v)) { v.forEach((z, i) => leavesOf(z, pre + '[' + i + ']', o)); return o; }
  if (v && typeof v === 'object') { for (const k of Object.keys(v).sort()) leavesOf(v[k], pre ? pre + '.' + k : k, o); return o; }
  o.push([pre, v]); return o;
}
/**
 * 求積の出力の並び(dfmSphereKernelRadial・dfmSphereKernelMomentsOf の object の配列)を比べる。
 * 構造の欄(ok・err・nNodes・nPanels・n・kernel)・キーの集合・葉の数・符号・零は厳密。値の欄は compareValues(sameEngine ならビット・違えば relTol)。
 * @returns {{ok:boolean, mode:string, n:number, nLeaves:number, nDiffBits:number, maxRel:number, maxUlp:number, bad:string[]}}
 */
export function compareKernelOutputs(A, B, opts) {
  const o = opts || {};
  if (typeof o.sameEngine !== 'boolean') throw new TypeError('compareKernelOutputs: sameEngine を宣言する');
  const relTol = o.sameEngine ? undefined : (o.relTol === undefined ? KERNEL_REL_TOL_345C : o.relTol);
  const bad = [];
  if (!Array.isArray(A) || !Array.isArray(B)) throw new TypeError('compareKernelOutputs: 配列が要る');
  if (A.length !== B.length) return { ok: false, mode: o.sameEngine ? 'bit' : 'tol', n: Math.max(A.length, B.length), nLeaves: 0, nDiffBits: 0, maxRel: Infinity, maxUlp: Infinity, bad: ['組の数が違う ' + A.length + '・' + B.length] };
  let nLeaves = 0, nDiffBits = 0, maxRel = 0, maxUlp = 0;
  for (let i = 0; i < A.length; i++) {
    const la = leavesOf(A[i]), lb = leavesOf(B[i]);
    if (la.map((z) => z[0]).join('|') !== lb.map((z) => z[0]).join('|')) { bad.push('#' + i + ' キーの集合か葉の数が違う'); continue; }
    for (let k = 0; k < la.length; k++) {
      const [pth, a] = la[k], b = lb[k][1], leaf = pth.split('.').pop().replace(/\[\d+\]$/, '');
      nLeaves++;
      if (STRUCT_KEYS_345C.includes(leaf) || typeof a !== 'number' || typeof b !== 'number') { if (!Object.is(a, b)) bad.push('#' + i + ' ' + pth + ' の構造の欄が違う(' + a + '・' + b + ')'); continue; }
      if (Number.isNaN(a) || Number.isNaN(b)) { bad.push('#' + i + ' ' + pth + ' が NaN'); continue; }
      if ((a === 0) !== (b === 0)) { bad.push('#' + i + ' ' + pth + ' の零が片方だけ(' + a + '・' + b + ')'); continue; }
      if (Math.sign(a) !== Math.sign(b)) { bad.push('#' + i + ' ' + pth + ' の符号が違う'); continue; }
      const r = compareValues(a, b, o.sameEngine ? { sameEngine: true } : { sameEngine: false, relTol });
      if (!r.sameBits) nDiffBits++;
      if (r.rel !== null && r.rel > maxRel) maxRel = r.rel;
      if (r.ulp !== null && r.ulp > maxUlp) maxUlp = r.ulp;
      if (!r.ok) bad.push('#' + i + ' ' + pth + (o.sameEngine ? ' がビットで同じでない(同じ実行系)' : ' の相対差 ' + r.rel.toExponential(2) + ' が許容 ' + relTol.toExponential(2) + ' を超えた'));
    }
  }
  return { ok: bad.length === 0, mode: o.sameEngine ? 'bit' : 'tol', n: A.length, nLeaves, nDiffBits, maxRel, maxUlp, relTol: relTol === undefined ? null : relTol, bad };
}

// ---- T2: 今の値と記録の値(記録の実行系で分ける) ----
/**
 * @param {number} now 今の値 @param {number} rec 記録の値
 * @param {{nowFp:string, recFp:string|null, relTol:number}} o
 * @returns {{ok, mode, same, rel, ulp, mark}}
 */
export function recordGate(now, rec, o) {
  const x = o || {};
  if (typeof now !== 'number' || typeof rec !== 'number' || !Number.isFinite(now) || !Number.isFinite(rec)) return { ok: false, mode: null, same: null, rel: null, ulp: null, mark: '数でない' };
  const same = sameAsRecord(x.nowFp, x.recFp);
  const r = compareValues(now, rec, same ? { sameEngine: true } : { sameEngine: false, relTol: x.relTol });
  return { ok: r.ok, mode: r.mode, same, rel: r.rel, ulp: r.ulp, mark: engineMark(same, x.recFp) };
}

// ---- T3: 過去の便に固定した記録(書き換えない)と今の値 ----
/** 符号つきの ulp の差(here − formal の向き。符号の違い・非有限は null) */
export function signedUlp(here, formal) { const u = ulpDiff(here, formal); return u === null ? null : (here < formal ? -u : u); }
/**
 * @param {number} here 今の走りの値 @param {number} formal 固定した記録
 * @param {{nowFp:string, recFp:string|null, maxUlp:number, repeat?:number}} o repeat = 同じ実行系で 2 回目に走らせた値(在れば here とビットで同じを要求)
 * @returns {{ok, stop, bitIdentical, ulp, signedUlp, rel, mode, engineOfRecord, repeatSame, why}}
 */
export function fixedRecordGate(here, formal, o) {
  const x = o || {};
  if (!(Number.isInteger(x.maxUlp) && x.maxUlp >= 0)) throw new RangeError('fixedRecordGate: maxUlp(0 以上の整数)を宣言する');
  const fin = typeof here === 'number' && typeof formal === 'number' && Number.isFinite(here) && Number.isFinite(formal);
  const bit = fin && Object.is(here, formal);
  const u = fin ? ulpDiff(here, formal) : null, su = fin ? signedUlp(here, formal) : null;
  const same = sameAsRecord(x.nowFp, x.recFp);
  const repeatSame = x.repeat === undefined ? null : Object.is(x.repeat, here);
  let ok, why;
  if (!fin) { ok = false; why = '数でない'; }
  else if (repeatSame === false) { ok = false; why = '同じ実行系の 2 回の走りがビットで同じでない'; }
  else if (bit) { ok = true; why = '記録とビットで同じ'; }
  else if (same) { ok = false; why = '記録と同じ実行系なのにビットで同じでない(' + su + ' ulp)'; }
  else if (u === null) { ok = false; why = '符号が違う'; }
  else if (u <= x.maxUlp) { ok = true; why = engineMark(false, x.recFp) + ' —— ' + su + ' ulp(上限 ±' + x.maxUlp + ')を比べる列に残す'; }
  else { ok = false; why = su + ' ulp が上限 ±' + x.maxUlp + ' を超えた'; }
  return { ok, stop: !ok, bitIdentical: bit, ulp: u, signedUlp: su, rel: fin ? relDiff(here, formal) : null, mode: bit || same ? 'bit' : 'tol',
    engineOfRecord: x.recFp || null, repeatSame, maxUlp: x.maxUlp, why };
}

// ---- 自己試験(behavior.crossEngine345c が場面と変異を見る) ----
const nudge = (x, k) => { const f = new Float64Array([x]), u = new BigInt64Array(f.buffer); u[0] += BigInt(k); return f[0]; };
export function pureScenes() {
  const R0 = { ok: true, W: 0.27, dW: -0.073, G: 0.0123456789, dG: -0.0067, nNodes: 16, nPanels: 1 };
  const R1 = Object.assign({}, R0, { G: nudge(R0.G, 17) });      // 17 ulp(⑦ の star・r=3.7 の大きさ)
  const fp = 'b8a976bf83f0fd7d', fpN = '6664670d90921598';
  const S = {};
  // T1
  S.kSame = compareKernelOutputs([R0], [Object.assign({}, R0)], { sameEngine: true });
  S.kBitDiff = compareKernelOutputs([R0], [R1], { sameEngine: true });
  S.kTol = compareKernelOutputs([R0], [R1], { sameEngine: false });
  S.kNaN = compareKernelOutputs([R0], [Object.assign({}, R0, { dW: NaN })], { sameEngine: false });
  S.kZero = compareKernelOutputs([Object.assign({}, R0, { G: 0 })], [Object.assign({}, R0, { G: 1e-300 })], { sameEngine: false });
  S.kNodes = compareKernelOutputs([R0], [Object.assign({}, R0, { nNodes: 17 })], { sameEngine: false });
  S.kShift = compareKernelOutputs([R0], [Object.assign({}, R0, { W: R0.W * (1 + 1e-8) })], { sameEngine: false });
  S.kSign = compareKernelOutputs([R0], [Object.assign({}, R0, { dG: -R0.dG })], { sameEngine: false });
  S.kKeys = compareKernelOutputs([R0], [Object.assign({ extra: 1 }, R0)], { sameEngine: false });
  S.kLen = compareKernelOutputs([R0, R0], [R0], { sameEngine: false });
  // T2(ui.liveMeasure297 ① の 🟫 の h/2 の差 —— 157 と 141 の記録の値)
  const h2now = 0.00019651487033911508, h2rec = 0.00019651487099991982;
  S.rSameEqual = recordGate(h2rec, h2rec, { nowFp: fp, recFp: fp, relTol: H2_REL_TOL_345C });
  S.rSameDiff = recordGate(h2now, h2rec, { nowFp: fp, recFp: fp, relTol: H2_REL_TOL_345C });
  S.rNoRec = recordGate(h2now, h2rec, { nowFp: fp, recFp: null, relTol: H2_REL_TOL_345C });
  S.rOther = recordGate(h2now, h2rec, { nowFp: fp, recFp: fpN, relTol: H2_REL_TOL_345C });
  S.rTooFar = recordGate(h2rec * (1 + 2e-6), h2rec, { nowFp: fp, recFp: null, relTol: H2_REL_TOL_345C });
  // T3(水星の kF1 —— 157 で測った値と第287便の記録)
  const kf1rec = 0.00002252587001128979, kf1now = 0.000022525870011289782;
  S.fBit = fixedRecordGate(kf1rec, kf1rec, { nowFp: fp, recFp: null, maxUlp: KF1_MAX_ULP_345C, repeat: kf1rec });
  S.fTol = fixedRecordGate(kf1now, kf1rec, { nowFp: fp, recFp: null, maxUlp: KF1_MAX_ULP_345C, repeat: kf1now });
  S.fSameEngine = fixedRecordGate(kf1now, kf1rec, { nowFp: fp, recFp: fp, maxUlp: KF1_MAX_ULP_345C });
  S.fOver = fixedRecordGate(nudge(kf1rec, -5), kf1rec, { nowFp: fp, recFp: null, maxUlp: KF1_MAX_ULP_345C });
  S.fRepeat = fixedRecordGate(kf1now, kf1rec, { nowFp: fp, recFp: null, maxUlp: KF1_MAX_ULP_345C, repeat: nudge(kf1now, 1) });
  S.fSign = fixedRecordGate(-kf1rec, kf1rec, { nowFp: fp, recFp: null, maxUlp: KF1_MAX_ULP_345C });
  // 記録の実行系
  const decl = { mathFingerprint: fp }, box = { mathFingerprint: fp }, led = { stages: { stageA: { decl: 'D1' } } };
  S.eKnown = recordEngineOf({ stageKey: 'stageA', ledger: led, declSha: 'D1', decl, box });
  S.eNoLedger = recordEngineOf({ stageKey: 'stageA', ledger: null, declSha: 'D1', decl, box });
  S.eStale = recordEngineOf({ stageKey: 'stageA', ledger: led, declSha: 'D2', decl, box });
  S.eBox = recordEngineOf({ stageKey: 'stageA', ledger: led, declSha: 'D1', decl, box: { mathFingerprint: fpN } });
  S.eHtml = recordEngineOf({ stageKey: null, ledger: led, declSha: 'D1', decl, box });
  S.kf1 = { now: kf1now, rec: kf1rec, signedUlp: signedUlp(kf1now, kf1rec) };
  return S;
}
/** 場面の門(名 → 真偽) */
export function pureGates(S) {
  const s = S || pureScenes();
  return {
    kernelBit: s.kSame.ok && s.kSame.mode === 'bit' && !s.kBitDiff.ok && s.kBitDiff.nDiffBits === 1,
    kernelTol: s.kTol.ok && s.kTol.mode === 'tol' && s.kTol.maxUlp === 17 && s.kTol.maxRel < KERNEL_REL_TOL_345C,
    kernelMutants: [s.kNaN, s.kZero, s.kNodes, s.kShift, s.kSign, s.kKeys, s.kLen].every((r) => r.ok === false),
    record: s.rSameEqual.ok && s.rSameEqual.mode === 'bit' && !s.rSameDiff.ok && s.rNoRec.ok && s.rNoRec.mode === 'tol' && /記録に実行系が無い/.test(s.rNoRec.mark)
      && s.rOther.ok && /実行系が違う/.test(s.rOther.mark) && !s.rTooFar.ok,
    fixed: s.fBit.ok && s.fBit.bitIdentical && s.fTol.ok && !s.fTol.bitIdentical && s.fTol.signedUlp === -2 && s.fTol.engineOfRecord === null
      && !s.fSameEngine.ok && !s.fOver.ok && !s.fRepeat.ok && !s.fSign.ok,
    recordEngine: s.eKnown.fingerprint === 'b8a976bf83f0fd7d' && [s.eNoLedger, s.eStale, s.eBox, s.eHtml].every((r) => r.fingerprint === null),
  };
}
