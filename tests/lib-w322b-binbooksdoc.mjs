// 第322便b(原仮定者の回答(2026-11-01 —— AN499)・決断事項 AN505・AN508・統括の検証項目 R271):
// **PHYSICS〔第322便b〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.binBooks322b が PHYSICS〔第322便b〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(床 fmtFloor —— 床より小さい値は「< 床」)。
import { fmtFloor } from './lib-w321b-geo3bin.mjs';
import { BOOKS, NS_OBS_SPIN_KEYS, NS_OBS_SPIN_CASES, NS_SPIN_INVARIANT_TESTS } from './lib-w322b-binbooks.mjs';
export const DOC_LIB_VERSION = 'w322b-binbooksdoc-1';

const yn = (b) => (b === null || b === undefined) ? '—' : (b ? '真' : '偽');
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
const e3 = (x) => fmtFloor(x, 1e-15, 3), e2 = (x) => fmtFloor(x, 1e-15, 2);
const tick = (s) => '`' + s + '`';
const fin = (a) => a[a.length - 1];
const SRC_JA = Object.freeze({ binaryCheckEqualInertial3d: '🧪 玩具 eq-e(第321便b の toyBook —— 雛形は ✨ の physics)', binaryCheckRatio3Inertial3d: '🧪 玩具 r3-e(同)',
  siriusABInertial3d: '🌟 `siriusAB`', alphaCenABInertial3d: '✨ `alphaCenAB`' });
const EXPECT_JA = Object.freeze({ accept: '受理', reject: '拒否', missing: '受理(欄を欠測のまま)' });

/** 本の文と表に書く比の文字列(h/4 の回帰・検出器 B —— 4 桁) */
export function ratioTextsOf(J, id) {
  const r = J.T.rows.find((z) => z.id === id); if (!r) return null;
  return { rate: fx(fin(r.byQty.rate.ratio), 4), rateB: fx(fin(r.byQty.rateB.ratio), 4), overF: fx(r.byQty.rate.ratioOverF, 4) };
}

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersBinBooks(J) {
  const out = [String(J.A.n), String(J.E.n)];
  for (const r of J.T.rows) { const t = ratioTextsOf(J, r.id); out.push(fx(r.eta, 5), fx(r.f, 5), t.rate, t.rateB); }
  return out;
}

export function physicsTablesBinBooks(J) {
  const out = [], A = J.A, T = J.T, P = J.plan, dv = P.divs.map((d) => d === 1 ? 'h' : 'h/' + d).join('・');
  // 表 A 受理と兄弟の写しの同一
  out.push('| 本 | 元の本 | 受理(警告の数) | presetSig = 写し(列 tr) | 受理後の宣言 = 写し | 宣言の期待(coord・geoPN・kFrame・λ_PN・K1 の規則・並進だけ・G_loc・分類) | 宣言から解決する法則 = build した S の法則(実効番号) | OFF の対照 = 写し(列 off) | 走行の状態 = 写し(h・ビット) | S.spin(初期・走行で不変) |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of A.rows) {
    const sb = T.sib.find((z) => z.id === r.id) || {}, sp = T.spin.filter((z) => z.key.indexOf(r.id + '|') === 0);
    out.push(`| ${r.emoji} ${tick(r.id)} | ${SRC_JA[r.id] || '—'} | ${r.accepted ? '受理' : '拒否'}(${r.warnings}) | ${yn(r.sigSame)} | ${yn(r.declSame)} | ${yn(r.declOk)} | ${r.lawDecl} ${r.lawDecl === r.lawSim ? '=' : '≠'} ${r.lawSim}(${r.ge}) | ${yn(r.offPatchSame && r.offSigSame)} | ${yn(sb.sameState)} | ${(r.spin0 || []).map((s) => fx(s, 4)).join('・')}(${sp.length && sp.every((z) => z.spinDmax === 0) ? '不変' : '変わる'}) |`);
  }
  // 表 T (1 + (4/3)η) と OFF を差し引いた近点の移動の比
  out.push('', `| 本 | η | 1 + (4/3)η | q_1PN [rad/公転](二体の 1PN の式) | geo1 − OFF(h/${fin(P.divs)}・回帰) | この本 − OFF [rad/公転] ${dv}(回帰) | 同(検出器 B) | 比 (この本 − OFF)/(geo1 − OFF) ${dv}(回帰) | 同(検出器 B) | 比 / (1 + (4/3)η)(h/${fin(P.divs)}・回帰・B) | 刻みの帯(回帰) | 公転周期の差 この本 − geo1(h/${fin(P.divs)}・相対) |`,
    '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of T.rows) {
    const b = BOOKS.find((z) => z.id === r.id) || {}, q = r.byQty.rate, qb = r.byQty.rateB;
    out.push(`| ${b.emoji || ''} ${tick(r.id)} | ${fx(r.eta, 5)} | ${fx(r.f, 5)}(+${fx((r.f - 1) * 100, 2)}%) | ${e3(r.q1PN)} | ${e3(fin(q.g1shift))} | ${q.shift.map(e3).join('・')} | ${qb.shift.map(e3).join('・')} | ${q.ratio.map((x) => fx(x, 4)).join('・')} | ${qb.ratio.map((x) => fx(x, 4)).join('・')} | ${fx(q.ratioOverF, 4)}・${fx(qb.ratioOverF, 4)} | ${e2(q.band)} | ${e2(fin(r.dPrel))} |`);
  }
  return out.join('\n');
}

/** NS の観測の自転の欄の設計の表(lib の宣言の表から —— 実装しない) */
export function nsDesignTables() {
  const out = ['| 鍵(案) | 中身と規則 |', '|---|---|'];
  for (const k of NS_OBS_SPIN_KEYS) out.push(`| ${tick(k.key)} | ${k.ja} |`);
  out.push('', '| 受理・拒否の表(案) | 宣言 | 期待 |', '|---|---|---|');
  for (const c of NS_OBS_SPIN_CASES) out.push(`| ${tick(c.key)} | ${c.ja} | ${EXPECT_JA[c.expect]} |`);
  out.push('', '| S.spin 不変の試験の案(実装の便の QA) |', '|---|');
  for (const t of NS_SPIN_INVARIANT_TESTS) out.push(`| ${t} |`);
  return out.join('\n');
}
