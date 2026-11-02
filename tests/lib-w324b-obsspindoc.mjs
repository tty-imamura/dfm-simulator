// 第324便b(決断事項 AN514・AN515・統括の検証項目 R280): **本の文の数と PHYSICS〔第324便b〕の表を正本から作る純関数**
//   (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA behavior.obsSpin324b・docs.obsSpin324b が本の文と PHYSICS〔第324便b〕を逐語で照合する。逐語照合する表に丸めの程度の数を書かない(床 fmtFloor —— 床より小さい値は「< 床」)。
import { fmtFloor } from './lib-w321b-geo3bin.mjs';
import { CASES, COLS, BOOKS } from './lib-w324b-obsspin.mjs';
export const DOC_LIB_VERSION = 'w324b-obsspindoc-1';

const yn = (b) => (b === null || b === undefined) ? '—' : (b ? '真' : '偽');
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
const e3 = (x) => fmtFloor(x, 1e-15, 3), e2 = (x) => fmtFloor(x, 1e-15, 2);
// 列の差の表の床(丸めの程度の数を逐語の表に書かない): 近点の率 1e-14 rad/公転・周期 1e-11(本の単位 —— 周期は約 1e3)・離心率 1e-13
const eR = (x) => fmtFloor(x, 1e-14, 3), eP = (x) => fmtFloor(x, 1e-11, 2), eE = (x) => fmtFloor(x, 1e-13, 2);
const tick = (s) => '`' + s + '`';
const fin = (a) => a[a.length - 1];
const EXPECT_JA = Object.freeze({ accept: '受理', reject: '拒否', missing: '受理(軸は欠測 —— J の源に使わない)' });
const DIV_JA = (d) => d === 1 ? 'h' : 'h/' + d;
const rowT = (J, sys, a, b) => J.T.rows.find((z) => z.sys === sys && z.a === a && z.b === b) || null;

/** 本の文に書く数(器の正本から —— QA が本の obsCard・descStruct と照合する) */
export function bookTextsOf(J) {
  const ac = rowT(J, 'acen', 'self', 'tr'), ja = rowT(J, 'j0737', 'JA', 'self');
  return {
    acenJtr: ac ? ac.byQty.rate.map(e3).join('・') : null,
    acenJtrEn: ac ? ac.byQty.rate.map(e3).join(', ') : null,
    acenJtrApprox: ac ? Number(fin(ac.byQty.rate)).toExponential(1) : null,
    j0737JA: ja ? e3(fin(ja.byQty.rate)) : null };
}

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersObsSpin(J) {
  const t = bookTextsOf(J), out = [String(J.A.n), String(J.E.n), t.j0737JA, t.acenJtrApprox];
  if (J.T.eta) out.push(fx(J.T.eta.ratioOverF, 4));
  const jb = rowT(J, 'j0737', 'JAB', 'JA'); if (jb) out.push(e3(jb.byQty.rate[0]));
  return out.filter(Boolean);
}

export function physicsTablesObsSpin(J) {
  const out = [], A = J.A, B = J.B, T = J.T, Lg = J.L;
  // 表 1 受理・拒否の表
  out.push('| 場合 | 宣言(J0737 の本 📟 の A の欄から組んだ写し) | 期待 | 結果 | 理由の文の頭(拒否のとき) |', '|---|---|---|---|---|');
  for (const r of A.rows) {
    const cs = CASES.find((c) => c.key === r.key) || {};
    out.push(`| ${tick(r.key)} | ${cs.ja || r.ja} | ${EXPECT_JA[r.expect]} | ${EXPECT_JA[r.got]}${r.ok ? '' : '(期待と違う)'} | ${r.expect === 'reject' ? (cs.why || '—') : '—'} |`);
  }
  // 表 2 本の宣言
  const j = B.j0737, a = B.acen;
  out.push('', '| 本 | 照合の相手 | 受理(警告の数) | 相手との差が宣言の鍵だけ(physics の外・天体・時間の基準・単位) | 源の経路 | 源の天体の行 | 状態の自転 |', '|---|---|---|---|---|---|---|');
  out.push(`| ${j.emoji} ${tick(j.id)} | 📻 の第321便b の兄弟の写し(列 tr) | ${j.accepted ? '受理' : '拒否'}(${j.warnings} —— R_d > R の行だけ ${yn(j.warnRdOnly)}) | ${yn(j.physSame && j.rdSame && j.bodiesSame && j.restSame)}(差は spinDrag・sourceMoment・obsSpin) | sourceMoment ${j.srcKind}・spinDrag rot | ${j.obsState.map((z) => `${z.i === 0 ? 'A' : 'B'}: J = ${e3(z.JSI)} kg m²/s・欠測 ${yn(z.missing)}・源 ${yn(z.used)}`).join(' / ')} | ${j.spins.map((s) => fx(s, 4)).join('・')} |`);
  out.push(`| ${a.emoji} ${tick(a.id)} | 🔶 ${tick('alphaCenABInertial3d')}(並進だけ —— 🔶 は spinDrag・sourceMoment なしのまま ${yn(a.trNoJ)}) | ${a.accepted ? '受理' : '拒否'}(${a.warnings}) | ${yn(a.physSame && a.rdSame && a.bodiesSame && a.restSame)}(差は spinDrag・sourceMoment) | sourceMoment ${a.srcKind}・f ${Object.values(a.f).join('・')} | ${a.srcMoment.map((z) => `${z.i === 0 ? 'A' : 'B'}: R_src = ${e3(z.Rsrc)}(本の単位)・J = ${e3(a.JSI[z.i])} kg m²/s`).join(' / ')} | 4.5737・2.0072(✨ の転写) |`);
  // 表 3 列の差
  out.push('', '| 系 | 差(列 a − 列 b) | 刻み | 近点の率 [rad/公転](回帰) | 同(検出器 B) | 公転周期の差(本の単位) | 離心率の差 | 状態のビット同一 |', '|---|---|---|---|---|---|---|---|');
  for (const r of T.rows) {
    const sysJa = r.sys === 'j0737' ? '📟 J0737' : '🔸 α Cen';
    out.push(`| ${sysJa} | ${r.a} − ${r.b} | ${r.divs.map(DIV_JA).join('・')} | ${r.byQty.rate.map(eR).join('・')} | ${r.byQty.rateB.map(eR).join('・')} | ${r.byQty.P.map(eP).join('・')} | ${r.byQty.e.map(eE).join('・')} | ${r.bits.map(yn).join('・')} |`);
  }
  // 表 4 J の口座
  out.push('', '| 系・列 | 步(1 公転) | 源の J の行(読み口)が步で不変 | 源の Ω_src の最大の変化 | 状態の自転・軸が不変 | 源に使った天体 | 源の一定のベクトルの印 |', '|---|---|---|---|---|---|---|');
  for (const r of Lg.rows) {
    out.push(`| ${r.sys === 'j0737' ? '📟' : '🔸'} ${r.col} | ${r.steps} | ${yn(r.reservoirFixed)} | ${r.srcOmega ? e2(r.srcOmegaMaxDrift) : '—(状態の自転の経路)'} | ${yn(r.spinUnchanged && r.axisUnchanged)} | ${r.usedAsSource.length ? r.usedAsSource.map((i) => i === 0 ? 'A' : 'B').join('・') : (r.sys === 'acen' ? '両星(状態の自転 —— kind J)' : 'なし')} | ${r.coreSpinModel || '—'} |`);
  }
  return out.join('\n');
}
export { COLS, BOOKS };
