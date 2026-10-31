// 第321便a(原仮定者の予定(第123報)・統括の検証項目 R266): **PHYSICS〔第321便a〕の表の行と本文の数を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.geo2v3321a が PHYSICS〔第321便a〕と逐語で照合する。
// 逐語照合する表に丸めの程度の数を書かない(回転共変の差・口座の閉じ・解析の場の差は fmtFloor の床 —— 退化の照合は違う値の数と差の最大〔0 は 0〕)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w321a-geo2v3doc-1';

const yn = (b) => (b ? '真' : '偽');
const kk = (k) => (k === 2 ? '特別化 pairCorePN' : k === 1 ? '特別化 pairCorePlain' : 'generic');
const pr = (p) => (p.state === 'double' ? '倍精度(状態・フレーム・質量)・自転は単精度' : '単精度(html の既定)');
const rot = (r) => `(${r.k.join(', ')})・${fx(r.a, 4)} rad`;

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersGeo2v3(J) {
  const b = J.parts.base, h = b.rows.h, h2 = b.rows.h2;
  return [fx(h.ratio, 4), fx(h.mid.ratio, 4), fx(h2.ratio, 4), ex(b.h2Diff, 2), String(h.steps), String(h.mid.steps), String(h.n), String(b.input.seed), fx(h.vphiKF1, 4), fx(h.vphiKF0, 4),
    String(J.parts.degen.nVal), String(J.parts.degen.rows.length), String(J.parts.cov.rows.length)];
}

export function physicsTablesGeo2v3(J) {
  const out = [], P = J.parts, b = P.base;
  // 写した 2D の行
  out.push('| 写した部分 | 行(基点 a708bfe の beta/index.html) | 式 |', '|---|---|---|');
  for (const s of J.sourceLines) out.push(`| ${s.part} | ${s.lines} | ${s.what} |`);
  // base
  out.push('', '| 行 | dt | 步 | 時刻 | 外縁の vφ(kFrame=1) | 外縁の vφ(kFrame=0 の写し) | 比 kF1/kF0 | 帯の粒子(kF1・kF0) | クランプ(速度・自転・反作用 —— A・B) | NaN |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const [lab, r] of [['h(途中の記録)', Object.assign({}, b.rows.h, b.rows.h.mid, { clampVN: null })], ['h', b.rows.h], ['h/2', b.rows.h2]].filter((z) => z[1])) {
    const cl = r.clampVN ? `${r.clampVN.join('・')} / ${r.clampSN.join('・')} / ${r.clampRN.join('・')}` : '—';
    out.push(`| ${lab} | ${r.dt} | ${r.steps} | ${fx(r.t, 2)} | ${fx(r.vphiKF1, 4)} | ${fx(r.vphiKF0, 4)} | ${fx(r.ratio, 4)} | ${r.nBandKF1}・${r.nBandKF0} | ${cl} | ${r.clampVN ? yn(r.nan) : '—'} |`);
  }
  out.push('', '| 凍結の照合 | 値 |', '|---|---|',
    `| h の比が基点の正本(refit-297a の段 galaxy の λ_PN=0・dt 0.016)と同じビット | ${yn(b.sameAsFrozen)} |`,
    `| h/2 の比が同じ正本の h/2 の行と同じビット | ${yn(b.sameAsFrozenH2)} |`,
    `| h の比が claim の窓 ${b.frozen.window[0]}〜${b.frozen.window[1]} の内 | ${yn(b.inWindow)} |`,
    `| 6000 步の途中の比が窓の内 | ${yn(b.midInWindow)} |`,
    `| クランプ 0・NaN なし(h と h/2 の A と B) | ${yn(b.clampZero)} |`);
  // degen
  out.push('', '| 退化の場面 | 体 | 步 | 積分器 | html の対ループ | 数の表現 | 照合した値 | 違う値 | 差の最大(相対) | L_z(軌道 + 自転 + リザーバ)の差(相対) | 2 步目に蹴られた受け手 |', '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of P.degen.rows) out.push(`| ${r.key}(${r.note}) | ${r.n} | ${r.steps} | ${r.integrator} | ${kk(r.kKind)} | ${pr(r.prec)}${r.dragWork ? '・仕事の口座' : ''} | ${r.nVal} | ${r.nDiff} | ${r.maxRel === 0 ? '0' : fmtFloor(r.maxRel, 1e-12, 1)} | ${r.LzRel === 0 ? '0' : fmtFloor(r.LzRel, 1e-12, 1)} | ${r.kicksStep2} |`);
  // d3
  out.push('', '| 三次元の html の步(kFrame=0)との照合 | 体 | 步 | 照合した値 | 違う値 | 非平面 | 傾いた軸 |', '|---|---|---|---|---|---|---|');
  for (const r of P.d3.rows) out.push(`| ${r.integrator} | ${r.n} | ${r.steps} | ${r.nVal} | ${r.nDiff} | ${yn(r.nonPlanar)} | ${yn(r.axisTilted)} |`);
  const g = P.d3.gates;
  out.push('', '| 今の門(基点) | 値 |', '|---|---|',
    `| coord3dDenyOf —— galaxyGeo2 を coord:"3d" に | ${g.denyGalaxyGeo2.join('・')} |`,
    `| coord3dDenyOf —— 小さい系の geoPN=2 の本を coord:"3d" に | ${g.denySmallGeo2.join('・')} |`,
    `| coord3dRuntimeWhy —— kFrame を走行中に 1 へ | ${g.runtimeKFrame} |`,
    `| coord3dRuntimeWhy —— geoPN を走行中に 2 へ | ${g.runtimeGeoPN2} |`,
    `| 宣言 → 実行の法則(geoModeOf の law —— 小さい系の本) | ${g.lawSmall} |`);
  // cov
  out.push('', '| 回転(軸・角) | 積分器 | 自転の入れ方 | 位置・速度・u の履歴・自転のベクトル・rotA・口座(P と L の尺度)・仕事(初期の運動エネルギーで割る)の差の最大(相対) | 軸が回った回数 | 蹴りの回数 |', '|---|---|---|---|---|---|');
  for (const r of P.cov.rows) out.push(`| ${rot(r.rot)} | ${r.integrator} | ${r.policy} | ${fmtFloor(r.max, 1e-12, 1)} | ${r.axisTurns} | ${r.kicks} |`);
  out.push(`| 記録だけ: ${rot(P.cov.single.rot)}・単精度 | ${P.cov.single.integrator} | ${P.cov.single.policy} | 位置 ${ex(P.cov.single.pos, 1)}・速度 ${ex(P.cov.single.vel, 1)}(Float32 の格納の丸め —— 回転で共変でない) | ${P.cov.single.axisTurns} | ${P.cov.single.kicks} |`);
  // field
  const F = P.field;
  out.push('', '| 解析の場 | 照合 | 差の最大(相対) | 門 |', '|---|---|---|---|',
    `| 静止(G = 0・源は止まって自転 0) | u・Δu・状態の変化 | u ${F.static.maxU === 0 ? '0' : fmtFloor(F.static.maxU)}・Δu ${F.static.maxDu === 0 ? '0' : fmtFloor(F.static.maxDu)}・動いた値 ${F.static.moved} | ${yn(F.static.pass)} |`,
    `| 一様並進(G = 0・D₀ = 0・全天体が同じ V・自転 0) | u − V・‖J‖ L/‖V‖・‖Δu‖/‖V‖・v − V | ${fmtFloor(Math.max(F.uniform.uRel, F.uniform.JRel, F.uniform.duRel, F.uniform.vRel), 1e-12, 1)} | ${yn(F.uniform.pass)} |`,
    `| 剛体回転の演算子(∇u = [Ω]_× + H I・8 例) | curl = 2Ω・Δu の閉じた式 | ${fmtFloor(Math.max(F.rigid.maxCurlRel, F.rigid.maxDuRel, F.rigid.kF1ClosedRel), 1e-12, 1)} | ${yn(F.rigid.pass)} |`,
    `| 1 つの自転する源の殻(傾いた軸・q = 2 と 1.5・${F.shell.rows} 点) | u = A(d) Ω × r・J・curl の閉じた式 | ${fmtFloor(Math.max(F.shell.maxURel, F.shell.maxJRel, F.shell.maxCurlRel), 1e-12, 1)} | ${yn(F.shell.pass)} |`,
    `| 勾配の有限差分(非平面の 6 体の場・幅 ${F.fd.h}) | 解析の J と中心差分 | ${fmtFloor(F.fd.maxRel, 1e-6, 1)} | ${yn(F.fd.pass)} |`);
  // hist + ledger
  const H = P.hist, L = P.ledger;
  out.push('', '| 初回の履歴と口座 | 値 | 門 |', '|---|---|---|',
    `| 純関数の 1 步目に蹴られた受け手 / 2 步目 | ${H.pure.first.kicks} / ${H.pure.second.kicks}(受け手 ${H.pure.first.receivers}) | ${yn(H.pass)} |`,
    `| html の 1 步目(kFrame=1)と純関数の kFrame=0 の写しの位置・速度・自転 | 違う値 ${H.html.nDiff} / ${H.html.nVal} | ${yn(H.html.same)} |`,
    `| 運動量・角運動量の閉じ(倍精度 semi・leapfrog —— 拘束 conP・conL とリザーバを含む) | ${fmtFloor(Math.max(L.rows['double-semi'].dP, L.rows['double-semi'].dL, L.rows['double-leapfrog'].dP, L.rows['double-leapfrog'].dL), 1e-12, 1)} | ${yn(L.pass)} |`,
    `| 同じ —— 単精度(記録だけ) | P ${ex(L.rows['single-semi'].dP, 1)}・L ${ex(L.rows['single-semi'].dL, 1)} | — |`,
    `| 拘束の口座を外したときの P のずれ(相対) | ${ex(L.rows.withoutCon.dP, 2)} | — |`,
    `| 仕事の口座(G = 0): ΔK と dragWorkKE・ΔK_spin と dragSpinE(vector) | ${fmtFloor(Math.max(L.work.vector.kRel, L.work.vector.ksRel), 1e-10, 1)} | — |`,
    `| 同じ(parallel —— 垂直の分は角運動量の口座 spinPerpL へ・その分の自転のエネルギーは入らない) | ΔK ${fmtFloor(L.work.parallel.kRel, 1e-10, 1)}・ΔK_spin と dragSpinE の差 ${ex(L.work.parallel.ksRel, 1)} | — |`);
  // S2
  out.push('', '| S2 の変更 | 何を | どこ | 門 |', '|---|---|---|---|');
  for (const s of J.s2Plan) out.push(`| ${s.area} | ${s.what} | ${s.where} | ${s.gate} |`);
  return out;
}
