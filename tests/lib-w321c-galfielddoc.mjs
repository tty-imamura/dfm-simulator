// 第321便c(原仮定者の予定(第123報)・原仮定者の回答(2026-10-31 —— AN489)・決断事項 AN486・AN487・AN488・AN496・統括の検証項目 R268):
// **PHYSICS〔第321便c〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.galField321c が PHYSICS〔第321便c〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(2 経路の差・和と全場の差・回転の差は fmtFloor の床・
// 拮抗の差が源の和の 1e-12 の内なら「0(丸めの内)」)。壁時計の所要は表に書かない(正本の揮発の欄)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w321c-galfielddoc-1';

const yn = (b) => (b ? '真' : '偽');
const e2 = (x) => ex(x, 2), e3 = (x) => ex(x, 3), e4 = (x) => ex(x, 4);
const sh = (h) => (h ? h.slice(0, 12) : '—');
const pos = (p) => '(' + p.map((q) => fx(q, 3)).join(', ') + ')';
const dDiff = (d, s) => (Math.abs(d) <= 1e-12 * Math.abs(s) ? '0(丸めの内)' : e3(d));
const SET_JA = Object.freeze({ sun: '太陽だけ', galaxy: '銀河の場だけ(中心 + 残余 —— 2 源)', galaxyOne: '銀河の場を 1 源(全場)', sunGalaxy: '太陽 + 銀河の場(2 源)', solar: '太陽系の全天体(銀河なし)',
  solarNoSat: '太陽系の全天体から自分の衛星を除く', all: '全源(太陽系の全天体 + 銀河の場の 2 源 —— 同じ τ)', allDecl: '全源(太陽系の全天体 + 宣言の尺度 +Ω_ref ĝ —— 同じ τ)' });
export const SET_ORDER = Object.freeze(['sun', 'galaxy', 'galaxyOne', 'sunGalaxy', 'solar', 'solarNoSat', 'all', 'allDecl']);

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersGalField(J) {
  const t0 = J.T.rows.find((r) => r.RKpc === 8.2 && r.zKpc === 0), t5 = J.T.rows.find((r) => r.RKpc === 8.2 && r.zKpc === 0.5), v82 = J.V.rows.find((r) => r.RKpc === 8.2), v4 = J.V.rows.find((r) => r.RKpc === 4);
  const ngc = J.G0.rest.find((r) => r.id === 'ngc3198DFM'), ju = J.H.rows.find((r) => r.i === 6), ve = J.H.rows.find((r) => r.i === 2), n82 = J.T.rows.find((r) => r.RKpc === 8.2 && r.zKpc === 0);
  return [e4(t0.uPhi), e4(t0.wZ), e3(t5.wR), e3(t5.wZ), fx(t5.tiltDeg, 1), fx(J.G0.std.ratio, 4), fx(J.G0.db.sigRatio, 3), fx(ngc.vt, 3), fx(v82.rigidOverDirect, 4), fx(v4.rigidOverDirect, 4),
    e3(ju.sets.sunGalaxy.diff), e3(ve.sets.sunGalaxy.diff), e3(n82.corrShare)];
}

export function physicsTablesGalField(J) {
  const out = [], G0 = J.G0, B = J.baseRecord;
  // G0 比較の基準の凍結
  out.push('| 本 | 宣言の署名(presetSig の sha256 の先頭) | 次元・geoPN・実行の法則 | 窓(QA と同じ測り方) | 器の値 | 基点の QA の記録(表示の桁) | 今の判定(基点の SAMPLE_STATUS) | 窓の終わりの状態の指紋(sha256 の先頭) |', '|---|---|---|---|---|---|---|---|');
  { const r = G0.std; out.push(`| 🎡 galaxyStd(n ${r.n}) | ${sh(r.decl.sig)} | 二次元・${r.decl.geoPN}・${r.law} | ${r.window.steps} 步 × ${r.window.dt}・外縁帯 ${r.window.band.join('〜')}・kFrame 1/0 の A/B | 外縁の vφ ${fx(r.gA, 4)}/${fx(r.gB, 4)}・比 ${fx(r.ratio, 4)}・引きずりの純度 ${fx(100 * r.pi[5], 1)}% | 比 ${B.galaxyStd.ratio}(${B.galaxyStd.gA}/${B.galaxyStd.gB}) | ${B.galaxyStd.verdict} | ${sh(r.digestA.sha256)} |`); }
  { const r = G0.db; out.push(`| 🍳 galaxyDB(n ${r.n}) | ${sh(r.decl.sig)} | 二次元・${r.decl.geoPN}・${r.law} | ${r.window.steps} 步 × ${r.window.dt}・円盤 ${r.window.disk}・バルジ ${r.window.bulge}・A/B | σ_T の比 ${fx(r.sigRatio, 3)}(${fx(r.bulge.sigT, 3)}/${fx(r.disk.sigT, 3)})・abs(spin) の比 ${fx(r.spinRatio, 3)}・クランプ ${r.clampV}/${r.clampR} | σ_T の比 ${B.galaxyDB.sigRatio}・spin の比 ${B.galaxyDB.spinRatio} | ${B.galaxyDB.verdict} | ${sh(r.digest.sha256)} |`); }
  for (const r of G0.rest) {
    if (r.id === 'ngc3198DFM') out.push(`| 🛞 ngc3198DFM(n ${r.n}) | ${sh(r.decl.sig)} | 二次元・${r.decl.geoPN}・${r.law} | ${r.window.steps} 步 × ${r.window.dt}・${r.window.frame}の外縁帯 ${r.window.band.join('〜')} | 外縁の vt ${fx(r.vt, 3)}・最遠 ${fx(r.rmax, 1)}・中心核の変位 ${fx(r.cDisp, 1)}・gas ${r.gasN} | vt ${B.ngc3198DFM.vt}・最遠 ${B.ngc3198DFM.rmax}・変位 ${B.ngc3198DFM.cDisp} | ${B.ngc3198DFM.verdict} | ${sh(r.digest.sha256)} |`);
    else if (r.id === 'galaxyGeo2') out.push(`| 💫 galaxyGeo2 | ${sh(r.decl.sig)} | 二次元・${r.decl.geoPN}・— | —(${r.note}) | — | — | ${B.galaxyGeo2.verdict} | — |`);
    else out.push(`| ${r.id === 'chainDiskToy3d' ? '🔩' : '🍥'} ${r.id}(n ${r.n}) | ${sh(r.decl.sig)} | 三次元・${r.decl.geoPN}・${r.law}(${r.decl.law}・${r.decl.solver}) | ${r.window.steps} 步 × ${r.window.dt} | 解法 ${r.solver.method}・反復の最大 ${r.solver.itersMax}・残差の最大 ${fmtFloor(r.solver.resMax, 1e-13, 1)}・失敗 ${r.solver.fail}・面外の最大 ${e2(r.zMax)} | — | ${B[r.id].verdict} | ${sh(r.digest.sha256)} |`);
  }
  // T 場の表
  out.push('', '| R [kpc] | z [kpc] | u_φ [m/s] | ω½_R [1/s] | ω½_z [1/s] | ω½ の ĝ からの傾き [°] | 2 経路の差 / abs(ω½) | 求積の誤差の見積り(u_φ の相対) | 外縁の面の項の割合 | Rω½_z / u_φ |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.T.rows) out.push(`| ${fx(r.RKpc, 1)} | ${fx(r.zKpc, 1)} | ${e4(r.uPhi)} | ${r.wR === 0 ? '0(鏡の対称)' : e3(r.wR)} | ${e3(r.wZ)} | ${fx(r.tiltDeg, 1)} | ${fmtFloor(Math.max(r.routeZ, r.routeR) / r.wAbs, 1e-7, 1)} | ${fmtFloor(r.quadU / Math.abs(r.uPhi), 1e-10, 1)} | ${fx(r.edgeShare, 4)} | ${fx(r.rigidRead, 4)} |`);
  out.push('', '| 照合 | 値 |', '|---|---|',
    `| 面への退化(z = 0 の行と第320便c の面上の環の積分 —— u_φ と ω½_z の相対の差の最大) | ${fmtFloor(J.T.planeRelMax, 1e-9, 1)} |`,
    `| 鏡の対称(z と −z —— u_φ・ω½_z は偶・ω½_R は奇の相対の差の最大) | ${fmtFloor(J.T.mirrorRelMax, 1e-9, 1)} |`,
    `| 2 経路(部分積分の形と u_φ の 4 次の中心差分)の差 / abs(ω½) の最大 | ${fmtFloor(J.T.routeRelMax, 1e-7, 1)} |`,
    `| 発散 tr ∇u / max abs(∇u) の最大 | ${fmtFloor(J.T.divRelMax, 1e-12, 1)} |`);
  out.push('', '| R [kpc] | z [kpc] | β(バルジを含む) | ∂_R β [1/m] | Z = 1 + β の正規化の第 2 項 abs((∇Z × A)/(2Z²)) / abs((½∇ × A)/Z) |', '|---|---|---|---|---|');
  for (const r of J.T.rows) if (r.beta !== undefined) out.push(`| ${fx(r.RKpc, 1)} | ${fx(r.zKpc, 1)} | ${e3(r.beta)} | ${e3(r.gradBetaR)} | ${e3(r.corrShare)} |`);
  // P 分割
  out.push('', '| 位置 (x, y, z) [kpc] | R_cut [kpc] | 中心の u_φ [m/s] | 残余の u_φ [m/s] | 中心の ω½_z [1/s] | 残余の ω½_z [1/s] | 全場の ω½_z [1/s] | 和と全場の差(u・ω½ の相対の最大) | 中心の J [kg m²/s] | J 双極子の近似の誤差(ω½ の相対) | 中心が優勢(ω½_z) |',
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.P.rows) out.push(`| ${pos(r.pos)} | ${fx(r.rCutKpc, 1)} | ${e3(r.centerUphi)} | ${e3(r.residualUphi)} | ${e3(r.centerWz)} | ${e3(r.residualWz)} | ${e3(r.fullWz)} | ${fmtFloor(Math.max(r.uRel, r.wRel), 1e-10, 1)} | ${e3(r.Jc)} | ${fx(r.dipoleErrW, 3)} | ${yn(r.centerDominant)} |`);
  out.push('', '| 源の宣言(checkState —— 第320便c の combineDisjoint) | 受理 | 期待 |', '|---|---|---|');
  for (const c of J.P.cases) out.push(`| ${c.ja} | ${yn(c.accepted)} | ${yn(c.expect)} |`);
  out.push('', '| 回転の共変(R = 8.2 kpc・z = 0.5 kpc で方位 φ を替える) | 円筒の成分が同じビット | デカルトの u と ∇u の回転との差(相対) |', '|---|---|---|');
  for (const r of J.P.rot) out.push(`| φ = ${fx(r.phi, 2)} rad | ${yn(r.cylSame)} | ${fmtFloor(Math.max(r.uRel, r.gRel), 1e-13, 1)} |`);
  out.push('', '| 有効域の外・定常でない宣言 | 結果 |', '|---|---|');
  for (const o of J.P.outside) out.push(`| 位置 ${pos(o.pos)} | ${o.ok ? '計算した' : '拒否(' + o.reason + ')'} |`);
  out.push(`| sourceState.stationary = 偽 | dUdt = ${J.P.nonStationary.dUdt === null ? 'null(0 で埋めない)' : JSON.stringify(J.P.nonStationary.dUdt)}・timeDerivativeComplete = ${yn(J.P.nonStationary.complete)} |`);
  // N 点のセルの和
  const gh = J.N.rows[0].cells.map((c) => String(c.nr)).join('・');
  out.push('', `| 位置 [kpc] | 軟化の幅 ε [kpc] | 環の積分の u_φ [m/s] | 環の積分の ω½_z [1/s] | 点のセルの和の u の相対の差(格子 ${gh}) | 点のセルの和の ω½_z の相対の差 | 点の和の ω½_z の符号 | 細かい 2 段が 5% の内(u・ω½_z) |`, '|---|---|---|---|---|---|---|---|');
  for (const r of J.N.rows) out.push(`| ${pos(r.pos)} | ${fx(r.epsKpc, 1)} | ${e4(r.ringUphi)} | ${e3(r.ringWz)} | ${r.cells.map((c) => fx(c.uRel, 4)).join('・')} | ${r.cells.map((c) => fx(c.wZRel, 3)).join('・')} | ${r.signs.map((q) => (q > 0 ? '+' : q < 0 ? '−' : '0')).join('')} | ${yn(r.resolvedU)}・${yn(r.resolvedWz)} |`);
  // V 半渦度 ↔ u_φ
  const nn = J.V.rows[0].origin.map((o) => 'n = ' + o.n).join('・'), pm = (J.V.rows.find((r) => r.annulus.length) || { annulus: [] }).annulus.filter((a) => a.mul !== 1).map((a) => '×' + a.mul).join('・');
  out.push('', `| R [kpc] | 直接の u_φ [m/s] | ω½_z [1/s] | Rω½_z / u_φ(剛体の読み) | 正則な原点から復元した u_φ の相対の差(${nn}) | 環状の境界 R_in = ${fx(J.V.RinKpc, 1)} kpc(真の境界の値)の相対の差 | 境界の値 ${pm} の相対の差 | 境界の値の差と C/R の式の差 |`, '|---|---|---|---|---|---|---|---|');
  for (const r of J.V.rows) {
    const a1 = r.annulus.find((a) => a.mul === 1), ps = r.annulus.filter((a) => a.mul !== 1);
    out.push(`| ${fx(r.RKpc, 1)} | ${e4(r.direct)} | ${e3(r.wZ)} | ${fx(r.rigidOverDirect, 4)} | ${r.origin.map((o) => fmtFloor(Math.abs(o.rel), 1e-9, 1)).join('・')} | ${a1 ? fmtFloor(Math.abs(a1.rel), 1e-9, 1) : '—(境界そのもの)'} | ${ps.length ? ps.map((a) => fx(a.rel, 4)).join('・') : '—'} | ${ps.length ? fmtFloor(Math.max(...ps.map((a) => a.crRel)), 1e-9, 1) : '—'} |`);
  }
  out.push('', '| 解析の場面(境界つきの復元の lib) | 結果 |', '|---|---|');
  for (const s of J.V.scenes) out.push(`| ${s.ja} | ${s.key === 'reject' ? (s.rejected ? '拒否した' : '拒否しない') : '相対の差 ' + fmtFloor(s.rel, 1e-12, 1) + (s.key === 'cr' ? '・2 つの場が違う ' + yn(s.distinct) : '')} |`);
  // H 天体ごとの位置
  out.push('', '| 天体 | 太陽からの距離 [au] | 銀河の面の座標の差 (Δx, Δy, Δz) [au] | abs(u − u_☉)/abs(u_☉) | 半渦度の差(相対) | 線形の予測 u_☉ + ∇u·Δx との差(Δu の相対) |', '|---|---|---|---|---|---|');
  for (const b of J.H.bodies) out.push(`| ${b.name} | ${fx(b.dAu, 3)} | ${b.i === 0 ? '—' : '(' + b.dGalAu.map((q) => fx(q, 3)).join(', ') + ')'} | ${b.i === 0 ? '0' : e2(b.duRel)} | ${b.i === 0 ? '0' : e2(b.dwRel)} | ${b.i === 0 ? '—' : fmtFloor(b.linRel, 1e-6, 1)} |`);
  // H 拮抗
  out.push('', `| 天体 | Ω̂·ĝ | 太陽の項 abs(ω) [rad/s] | 銀河の場の中心・残余の ω·ĝ [1/s](R_cut ${fx(J.H.rCutMain, 0)} kpc) | 太陽の (b) の熱 [J] | 自分の衛星 | 他の天体 | 銀河の中心 | 銀河の残余 | 宣言の尺度 +Ω_ref ĝ |`, '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.H.rows) out.push(`| ${r.name} | ${fx(r.OmDotG, 3)} | ${e3(r.wSunAbs)} | ${e3(r.galCenterZ)}・${e3(r.galResidualZ)} | ${e3(r.cols.sun)} | ${r.sats.length ? e3(r.cols.sats) + '(' + r.sats.join('・') + ')' : '—'} | ${e3(r.cols.others)} | ${e3(r.cols.galCenter)} | ${e3(r.cols.galResidual)} | ${e3(r.cols.galDecl)} |`);
  out.push('', `| 源の組(1 回の量 [J] —— 源ごとの和 heat.source / 合成 heat.composite / 差 heat.source − heat.composite〔符号つき〕) | ${J.H.rows.map((r) => r.name).join(' | ')} |`, '|---|' + J.H.rows.map(() => '---|').join(''));
  for (const k of SET_ORDER) out.push(`| ${SET_JA[k]} | ${J.H.rows.map((r) => { const s = r.sets[k]; return e3(s.source) + ' / ' + e3(s.composite) + ' / ' + dDiff(s.diff, s.source); }).join(' | ')} |`);
  const rcs = [...new Set(J.H.rcRows.map((q) => q.rCutKpc))];
  out.push('', `| R_cut [kpc](銀河の場だけ —— 中心と残余の 2 源の差 heat.source − heat.composite [J]) | ${J.H.rows.map((r) => r.name).join(' | ')} |`, '|---|' + J.H.rows.map(() => '---|').join(''));
  for (const rc of rcs) out.push(`| ${fx(rc, 1)} | ${J.H.rows.map((r) => { const q = J.H.rcRows.find((z) => z.rCutKpc === rc && z.i === r.i); return q ? dDiff(q.diff, q.source) : '—'; }).join(' | ')} |`);
  return out.join('\n');
}
