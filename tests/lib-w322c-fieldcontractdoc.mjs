// 第322便c(決断事項 AN501・AN503・AN506・AN511・AN512・統括の検証項目 R272): **PHYSICS〔第322便c〕の表の行と本文の数を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.fieldContract322c が PHYSICS〔第322便c〕と逐語で照合する。
// 逐語照合する表に丸めの程度の数を書かない(RK4 の閉じ・勾配の中心差分・代理の u_R など —— fmtFloor の床)。壁時計の所要は表に書かない(正本の揮発の欄)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w322c-fieldcontractdoc-1';

const yn = (b) => (b ? '真' : '偽');
const e3 = (x) => ex(x, 3), e4 = (x) => ex(x, 4);
const f10 = (x) => fmtFloor(x, 1e-10, 3), f9 = (x) => fmtFloor(x, 1e-9, 1), f8 = (x) => fmtFloor(x, 1e-8, 1), f12 = (x) => fmtFloor(x, 1e-12, 1);
const dDiff = (d, s) => (Math.abs(d) <= 1e-12 * Math.abs(s) ? '0(丸めの内)' : e3(d));   // 拮抗の差が源の和の 1e-12 の内なら丸めの内(第321便c の文書の lib と同じ型)
const pos = (p) => '(' + p.map((q) => fx(q, 1)).join(', ') + ')';
const TYPE_JA = Object.freeze({ K: '今の v−u 輸送(離散)', Kc: 'K の連続の極限', P: '正準の型(p0 = v0 − u(x0))', Pl: '正準の型(p0 = v0 —— 状態の v を p と読む)', A: '位置に u を足すだけ' });
export { TYPE_JA };
const COL_JA = Object.freeze({ A: '(A) 銀河 1 グループ', B: '(B) 成分ごと(バルジ・薄い・厚い・HI・H2)', B2: '(B2) 星・ガス・バルジ', Bdh: '(Bdh) バルジ・円盤・ハロー(模型はバルジ静止・ハローの流れ無し)' });

/** 代理 J の直しの表(第321便c の正本 galfield-w321c.json の P.proxy —— 器 版 2) */
export function physicsTablesProxyFix(G) {
  const P = G.P.proxy, out = [];
  out.push(`| 位置 [kpc](代理だけ —— J = ${e4(P.J)} kg m²/s) | u_φ [m/s] | ω½_R [1/s] | ω½_z [1/s] | 円筒の成分 = 直交の成分の射影(ビット) | 部の欄 = 総和の欄(ビット) | u_R・u_z・ω½_φ の相対 |`, '|---|---|---|---|---|---|---|');
  for (const r of P.rows) out.push(`| ${pos(r.pos)} | ${e4(r.uPhi)} | ${r.wR === 0 ? '0' : e4(r.wR)} | ${e4(r.wZ)} | ${yn(r.projSame)} | ${yn(r.partSame)} | ${f12(Math.max(r.uRRel, r.uZRel, r.wPhiRel))} |`);
  out.push('', '| 宣言 | 受理 | 期待 |', '|---|---|---|');
  for (const c of P.cases) out.push(`| ${c.ja} | ${yn(c.accepted)} | ${yn(c.expect)} |`);
  return out.join('\n');
}

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersFieldContract(J) {
  const R = (k) => J.K.rows.find((r) => r.key === k), st = R('steady'), rg = R('rigid'), kfs = J.K.kRows.find((r) => r.key === 'steady');
  const ju = J.G.kinds.J.rows.find((r) => r.i === 6), sa = J.G.kinds.J.rows.find((r) => r.i === 11);
  return [fx(st.orderK[0], 2), e3(st.errPl), e3(st.errA), e3(st.ledger.P.Wf), e3(rg.ledger.P.tauZ), e3(kfs.loopLine), e3(ju.cols.A.diff), e3(ju.cols.B.diff), e3(ju.cols.B2.diff), e3(sa.cols.A.diff), e3(sa.cols.B.diff)];
}

export function physicsTablesFieldContract(J) {
  const out = [], Kp = J.K, D = Kp.decl;
  // 場面
  out.push(`| 場面(無次元 —— GM = ${D.GM}・ε = ${D.eps}・x0 = (${D.x0.join(', ')})・v0 = (${D.v0.join(', ')})・走行 ${D.tEnd}) | 定常の宣言 | z 軸の軸対称 | abs(u(x0)) | 勾配の解析 ↔ 中心差分(相対) | dUdt の解析 ↔ 中心差分(相対) |`, '|---|---|---|---|---|---|');
  for (const r of Kp.rows) out.push(`| ${r.ja} | ${yn(r.stationary)} | ${yn(r.axisym)} | ${r.u0Abs === 0 ? '0' : fx(r.u0Abs, 4)} | ${f8(r.gradRel)} | ${f8(r.dudtRel)} |`);
  // 軌道
  out.push('', `| 場面 | Kc と P の終わりの位置の差 | K(h = ${D.h}・h/2・h/4)と P の差 | 刻みの次数(h → h/2・h/2 → h/4) | Pl と P の差 | A と P の差 | K のクランプ(abs(Δu) ≤ 0.8) |`, '|---|---|---|---|---|---|---|');
  for (const r of Kp.rows) out.push(`| ${r.key} | ${f9(r.errKc)} | ${r.errK.map(e3).join('・')} | ${r.orderK.map((o) => fx(o, 2)).join('・')} | ${r.errPl === 0 ? '0' : e3(r.errPl)} | ${r.errA === 0 ? '0' : e3(r.errA)} | ${r.clampN.join('・')} |`);
  // 台帳(P)
  out.push('', '| 場面(P の台帳 —— 単位の質量) | ΔE_N | 場の仕事 W_f | Δ(½abs(u)²) | ΔH | ∫p·∂_t u dt | ΔL_z | トルクの供給 ∫(x × a_f)_z dt | Δ(x × u)_z | ΔL_can,z | 力積の供給 ∫a_f,x dt |', '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of Kp.rows) { const l = r.ledger.P; out.push(`| ${r.key} | ${f10(l.dEN)} | ${f10(l.Wf)} | ${f10(l.du2half)} | ${f10(l.dH)} | ${f10(l.pdudt)} | ${f10(l.dLz)} | ${f10(l.tauZ)} | ${f10(l.dxuZ)} | ${f10(l.dLcanZ)} | ${f10(l.impX)} |`); }
  // 台帳(K の刻みの感度と他の型)
  out.push('', '| 場面 | K の ΔH(h・h/2・h/4) | K の W_f(h・h/2・h/4) | P の W_f | K の ΔL_can,z(h・h/2・h/4) | Pl の ΔH | A の ΔH | A の ΔL_can,z |', '|---|---|---|---|---|---|---|---|');
  for (const r of Kp.rows) { const L = r.ledger; out.push(`| ${r.key} | ${L.K.map((q) => f10(q.dH)).join('・')} | ${L.K.map((q) => f10(q.Wf)).join('・')} | ${f10(L.P.Wf)} | ${L.K.map((q) => f10(q.dLcanZ)).join('・')} | ${f10(L.Pl.dH)} | ${f10(L.A.dH)} | ${f10(L.A.dLcanZ)} |`); }
  // k_F ≠ 1
  out.push('', `| 場面(k_F = ${D.kFHalf}) | 余りの力 k_F(1 − k_F)(u·∇)u の子午面の閉じた路の積分(線) | 同じ(回転の面積分 —— ストークス) | K(k_F)と Kc(k_F)の差(h・h/2・h/4) | 刻みの次数 | Kc(k_F)と「u の振幅を k_F 倍した P」の差 | k_F = 1 の ΔH(走行 ${D.longMul} 倍 —— 対照) | k_F の ΔL_can,z |`, '|---|---|---|---|---|---|---|---|');
  for (const r of Kp.kRows) out.push(`| ${r.key} | ${fmtFloor(r.loopLine, 1e-12, 3)} | ${fmtFloor(r.loopArea, 1e-12, 3)} | ${r.errK.map(e3).join('・')} | ${r.orderK.map((o) => fx(o, 2)).join('・')} | ${f9(r.errVsAmpP)} | ${f10(r.dHLongKF1)} | ${f10(r.dLcanZ)} |`);
  // ビット・解析解・拒否
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| 零場の K と素の重力のキック → ドリフトの步(位置・速度のビット) | ${yn(Kp.bits.zeroVsPlain)} |`, `| 一様流の K と零場の K(位置・速度のビット —— u − u_prev = 0・∇u = 0) | ${yn(Kp.bits.uniformVsZero)} |`,
    `| 剛体回転 × 中心の引力の解析解 x(t) = R(Ωt) y(t) と P の差 | ${f9(Kp.rigidAnalyticErr)} |`);
  for (const q of Kp.nullRej) out.push(`| 非定常の場で dUdt = null —— ${q.type} | ${q.result === 'rejected' ? '拒否(RangeError —— 0 で埋めない)' : q.result} |`);
  // グループ(J)
  const GJ = J.G.kinds.J.rows;
  out.push('', '| 天体(源のモーメント J・受け手 I = ½mR²) | (A) 源の和 [J] | (A) 合成 [J] | (A) 差 | (B) 差 | (B2) 差 | (Bdh) 差 | 銀河だけの差 (A)・(B)・(B2) | 太陽の列 | 衛星の列 | 他の天体の列 |', '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of GJ) { const c = r.cols; out.push(`| ${r.name} | ${e4(c.A.source)} | ${e4(c.A.composite)} | ${e3(c.A.diff)} | ${e3(c.B.diff)} | ${e3(c.B2.diff)} | ${e3(c.Bdh.diff)} | ${e3(c.A.galDiff)}・${e3(c.B.galDiff)}・${e3(c.B2.galDiff)} | ${e3(r.sunHeat)} | ${e3(r.satHeat)} | ${e3(r.othersHeat)} |`); }
  out.push('', '| 天体 | (B) の銀河の成分ごとの熱 [J](薄い・厚い・HI・H2・バルジ) | (A) の銀河のグループの熱 [J] |', '|---|---|---|');
  for (const r of GJ) out.push(`| ${r.name} | ${r.cols.B.gal.map((g) => e3(g.heat)).join('・')} | ${e3(r.cols.A.gal[0].heat)} |`);
  out.push('', '| 天体 | R_cut [kpc] | (A) 差(併合の宣言で ω を 1 回) | ω を足してから熱(中心 + 残余の部の和)の差 | 部の和の abs(ω) と併合の abs(ω) の相対の差 | (C) 部ごとの熱の差(第321便c の型) | (C) 銀河だけの差 |', '|---|---|---|---|---|---|---|');
  for (const r of GJ) for (const q of r.rcRows) out.push(`| ${r.name} | ${fx(q.rCutKpc, 0)} | ${e4(q.A.diff)} | ${e4(q.sum.diff)} | ${f12(q.sum.omegaRel)} | ${e4(q.C.diff)} | ${dDiff(q.C.galDiff, q.C.galSource)} |`);
  out.push('', '| R_cut の不変(門) | 値 |', '|---|---|');
  out.push(`| (A) の銀河のグループの宣言が R_cut ${J.G.canon.map((c) => fx(c.rCutKpc, 0)).join('・')} kpc で fullState() と同じ | ${yn(J.G.canon.every((c) => c.sameAsFull))} |`);
  out.push(`| (A) の源の和・合成・差が R_cut に依らず同じビット(${GJ.length} 天体 × ${GJ[0].rcRows.length} —— R_cut ごとに求積をやり直す) | ${yn(GJ.every((r) => r.rcutBitsA))} |`);
  out.push(`| (A) と (Bdh) が同じビット(バルジの流れ 0・ハローの流れが無い宣言の模型) | ${yn(GJ.every((r) => r.aEqualsBdh))} |`);
  if (J.G.kinds.capObs) {
    out.push('', '| 天体(源のモーメント capObs —— 衛星の列の対照) | (A) 源の和 [J] | (A) 差 | (B) 差 | 太陽の列 | 衛星の列 | 衛星の列 / (A) 源の和 |', '|---|---|---|---|---|---|---|');
    for (const r of J.G.kinds.capObs.rows) out.push(`| ${r.name} | ${e4(r.cols.A.source)} | ${e3(r.cols.A.diff)} | ${e3(r.cols.B.diff)} | ${e3(r.sunHeat)} | ${e3(r.satHeat)} | ${fx(r.satHeat / r.cols.A.source, 4)} |`);
  }
  // 鍵の案
  const C = Kp.contractDraft;
  out.push('', `| 接続の鍵の案 \`${C.key}\`(${C.draftVersion} —— 受理済みの鍵ではない) | 意味 |`, '|---|---|');
  for (const f of C.fields) out.push(`| \`${f.k}\` | ${f.v} |`);
  out.push('', '| 受理で拒否する宣言(案) | 台帳の欄(案) |', '|---|---|');
  for (let i = 0; i < Math.max(C.rejects.length, C.ledger.length); i++) out.push(`| ${C.rejects[i] || '—'} | ${C.ledger[i] || '—'} |`);
  // AN503
  out.push('', '| AN503 の診断の写しの器の設計(宣言 —— 走らせるのは次便) | 内容 |', '|---|---|');
  for (const d of J.design503) out.push(`| ${d.k} | ${d.v} |`);
  return out.join('\n');
}
