// 第320便a(原仮定者の回答(2026-10-30 —— AN475)・原仮定者の裁定(第122報)AN471・決断事項 AN471・AN474・AN475・統括の検証項目 R262):
// **PHYSICS〔第320便a〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.srcHeat320 が PHYSICS〔第320便a〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(閉じ・残差・比の差は fmtFloor の床)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w320a-srcheatdoc-1';
const yn = (b) => (b ? '真' : '偽');
const dec = (b) => (b ? '減' : '増');
const fl = (x, f = 1e-12) => fmtFloor(x, f, 2);
const KJA = { now: '今', Jsun: 'J(太陽だけ)', J: 'J(8 天体)', J16: 'J(8 天体 + 名の無い 8 天体 0.4)', obs: 'obs', capObs: 'capObs' };
const SG = (s) => (s > 0 ? '+ĝ' : '−ĝ');

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersSrcHeat(J) {
  const F = J.F, f16 = (kind, g, rf = 'engine') => F.rows.find((r) => r.book === 'solarSystem16Inertial3d' && r.i === 6 && r.kind === kind && r.galaxy === g && r.recvF === rf);
  const R = J.R, jr = R.rows.find((r) => r.i === 6), vr = R.rows.find((r) => r.i === 2), mr = R.rows.find((r) => r.i === 1);
  const jn = f16('Jsun', 'none'), jns = f16('Jsun', 'none', 'src'), jp = f16('J', 'declPlus'), j16 = f16('J16', 'none'), on = f16('obs', 'none'), cn = f16('capObs', 'none'), nn = f16('now', 'none');
  const vB = J.books['solar16|J|1'].rows.find((r) => r.i === 2), vM = J.books['solar16|J|-1'].rows.find((r) => r.i === 2);
  return [ex(F.Preq, 5), ex(F.PreqAlt, 5), ex(jn.tauReqB, 3), ex(jn.tauReqBAlt, 3), ex(jn.ratioBAtH0, 3), ex(jns.tauReqB, 3), ex(jns.ratioBAtH0, 3), ex(jp.tauReqB, 3), ex(jp.eventB, 3),
    ex(j16.ratioBAtH0, 3), ex(on.ratioBAtH0, 3), ex(cn.ratioBAtH0, 3), ex(nn.ratioBAtH0, 3), ex(jr.kinds.J.ratio, 3), ex(vr.kinds.J.ratio, 3), ex(mr.kinds.J.ratio, 3),
    ex(vB.eventB, 3), ex(vM.eventB, 3), ex(vB.event319, 3), ex(vM.event319, 3), ex(R.compareMaxRot, 1), ex(R.compareMaxRatio, 1), ex(R.compareMaxAxial, 1), fx(L10(mr.kinds.J.ratio / vr.kinds.J.ratio), 2),
    ex(J.books['solar16|J16|1'].rows.find((r) => r.i === 6).topB.find((q) => q.src === 7).heatB, 3), ex(jr.kinds.J.heatSun319, 3)];
}
const L10 = (x) => Math.log10(x);

/** 表の行(節の名ごと —— PHYSICS〔第320便a〕の ④〜⑩ の表) */
export function physicsSectionsSrcHeat(J) {
  const SEC = {}, P = J.P, Q = J.Q, A = J.A;
  let out = SEC.P = [];
  // P
  out.push('| 純関数の場面(読み (b)・I = 1・Ω_I = ẑ) | 値 |', '|---|---|',
    `| 反対で同じ大きさの 2 源(±0.1 x̂): (b) の合成の 1 回の熱・源ごとの熱・1 源の熱 | ${ex(P.opposed.compositeHeatB, 4)}・${ex(P.opposed.sourceHeatB, 4)}・${ex(P.opposed.oneSourceB, 4)} |`,
    `| 逆平行(−0.1 ẑ —— 減速): (b) の熱・第319便a の契約の熱・供給 | ${ex(P.antiParallel.heatB, 4)}・${ex(P.antiParallel.heat319, 3)}・${ex(P.antiParallel.supply, 4)} |`,
    `| 平行(+0.1 ẑ —— 加速): (b) の熱 = 第319便a の契約の熱 | ${yn(Object.is(P.parallel.heatB, P.parallel.heat319))}(${ex(P.parallel.heatB, 4)}) |`,
    `| 口座(0.1 x̂ と −0.05 ẑ の 2 源): (b) の場 + 受け皿 + 熱・熱 − (軸のコスト + 正の分 + 供給)・第319便a の契約の残差 | ${fl(Math.abs(P.ledger.residual), 1e-15)}・${fl(Math.abs(P.ledger.heat - P.ledger.heatFromParts), 1e-15)}・${fl(Math.abs(P.ledger.residual319), 1e-15)} |`,
    `| (b) の印の有無: 熱の外の和が同じビット・第319便a の契約の熱の和 SM[26] = 印なしの熱 | ${yn(P.flag.otherSame)}・${yn(P.flag.old26Same)} |`,
    `| 受け手の慣性係数の比例(I を 0.508 倍): (b) の熱の比 | ${fx(P.inertia.ratio, 6)} |`,
    `| M1Src: 外部(r > R)は M1 とビット同一・r = R の値と微分の連続(相対)・内部と動径の求積の差の最大(相対) | ${yn(P.m1src.exteriorSame)}・${fl(P.m1src.contValue, 1e-11)}・${fl(P.m1src.contDeriv, 1e-11)}・${fl(P.m1src.interiorRelMax, 1e-14)} |`,
    `| R_src(R_obs = 0.695・f = 0.07・上限 0.03): J・(2/5)R_src² = f R_obs² の相対の差・obs・capObs | ${fx(P.rsrc.J, 6)}・${fl(P.rsrc.Jcheck, 1e-15)}・${P.rsrc.obs}・${P.rsrc.capObs} |`);
  // A
  out = SEC.A = [];
  out.push('| 受理の例(invSq.sourceMoment) | 受理 | 期待 | 正準形 |', '|---|---|---|---|');
  for (const r of A.rows) out.push(`| ${r.key} | ${yn(r.ok)} | ${yn(r.expect)} | ${r.ok ? (r.canon ? 'kind:' + r.canon.kind + (r.canon.f ? '・f の天体 ' + Object.keys(r.canon.f).length : '') : '(鍵を出さない)') : '—'} |`);
  out.push('', `balance:"background" の受理の正準形は第319便a のまま(${yn(A.balance.ok)})・版 ${A.balance.version}(第319便a の契約の欄 ${A.balance.version319})。`);
  // Q
  const sm = Q.sourceMoment;
  out = SEC.Q = [];
  out.push('| 同一(🏀 の写し) | 値 |', '|---|---|',
    `| (b) の本の contract319 = balance を宣言しない写し: 熱・受け手ごと・率・源の場の符号つきの分・状態 | ${yn(Q.legacy.heatSame)}・${yn(Q.legacy.perBodySame)}・${yn(Q.legacy.rateSame)}・${yn(Q.legacy.fromFieldSame)}・${yn(Q.legacy.stateSame)} |`,
    `| (b) の熱 = contract319 の熱 + 供給(相対の差)・contract319 の閉じ | ${fl(Q.legacy.plusSupplyRel)}・${fl(Q.legacy.residual319Rel)} |`,
    `| 明示潮汐の受け手(木星): E_i へ = 潮汐の maintainInput・contract319 の E_i へ = balance の無い写し・放射 + E_i へ = 熱・閉じ | ${yn(Q.tide.inputSame)}・${yn(Q.tide.legacySame)}・${fl(Q.tide.splitRel, 1e-15)}・${fl(Q.tide.closeRel)} |`,
    `| (b) の合成の 1 回の熱 = (b) の compose:"sum" の熱(総和・受け手ごと)・源が 1 つは源ごと = 合成(受け手ごと・総和) | ${yn(Q.composite.totalSame)}・${yn(Q.composite.perBodySame)}・${yn(Q.composite.oneSourceSame)}・${yn(Q.composite.oneTotalSame)} |`,
    `| 口座: field.E = −Σ max(E_speed, 0)・背景の流入 = 正の分・残差 E / 熱・閉じ・源ごとの和 = 受け手の熱・熱 = 軸のコスト + 正の分 + 供給 | ${yn(Q.ledger.fieldSame)}・${yn(Q.ledger.inflowSame)}・${fl(Q.ledger.residualERel)}・${fl(Q.ledger.closeRel)}・${fl(Q.ledger.perSourceSumRel)}・${fl(Q.ledger.partsRel)} |`);
  for (const k of ['Jsun', 'obs', 'capObs']) { const z = sm[k]; if (!z || !z.ok) continue;
    out.push(`| 源のモーメント ${k}: β と R_d が同じビット・(R_src/R_d)²・回転の係数の比の差・軸の ω の比の差(丸めの床) | ${yn(z.betaSame)}・${yn(z.rdSame)}・${ex(z.momentFactor, 4)}・${fl(z.rotRatioRel)}・${ex(z.omegaRatioRel, 1)} |`); }
  out.push(`| 宣言の無い写し・balance の無い本: 新しい状態の鍵・読み口の欄(sourceMoment・balance)・既定の読み口の omegaSrc | ${Q.absent.keys.length}・${yn(Q.absent.isqField)}・${yn(Q.absent.balanceField)}・${yn(Q.absent.readOmegaSrc)} |`);
  // 釣り合いの口座(読み (b))
  out = SEC.BAL = [];
  out.push('| 釣り合いの口座(読み (b)・写し・累計 [J]) | 駆動 D(軸のコスト + 供給) | 場の正の分 F₊ | 背景への熱放射 | E_i へ | 閉じ / 大きい方 | contract319 の熱 | contract319 の閉じ |', '|---|---|---|---|---|---|---|---|');
  for (const key of ['venus', 'jupiter', 'solar16']) for (const kind of ['now', 'J']) for (const s of [1, -1]) {
    const b = J.books[key + '|' + kind + '|' + s]; if (!b || !b.ok) continue;
    out.push(`| ${b.id}・${KJA[kind]}・${SG(s)}(${b.steps + 1} 步) | ${ex(b.balance.drive, 4)} | ${ex(b.balance.fieldPos, 4)} | ${ex(b.balance.radiation, 4)} | ${ex(b.balance.toInternal, 3)} | ${fl(b.balance.closeRel)} | ${ex(b.balance.c319.heat, 4)} | ${fl(b.balance.c319.closeRel)} |`);
  }
  // R 6 天体
  const R = J.R;
  out = SEC.R = [];
  if (R.rows.length) {
    out.push(`| 受け手(🗺️・初期の状態) | 役割(第121報) | 要る大きさの型 | ${R.kinds.map((k) => KJA[k]).join(' | ')} |`, '|---|---|---|' + R.kinds.map(() => '---|').join(''));
    const RT = { plane: '公転面 3°/太陽系の年齢', venus: '軸 π / 1 Gyr', jupiter: '内部熱の主列(τ_hold = h₀)', none: '—(abs(ω_☉) [rad/s])' };
    for (const r of R.rows) out.push(`| ${r.name} | ${r.role} | ${RT[r.req]} | ${R.kinds.map((k) => { const z = r.kinds[k]; return r.req === 'none' ? ex(z.omSun, 3) : ex(z.ratio, 3); }).join(' | ')} |`);
    out.push('', '| 太陽の項(🗺️・初期の状態・J) | abs(ω_☉) [rad/s] | ∠(Ω_I, ω_☉) [°] | 太陽の項 | 公転面の角速度 [rad/s] | (b) の 1 回の熱 [J] | 第319便a の契約の 1 回の熱 [J] |', '|---|---|---|---|---|---|---|');
    for (const r of R.rows) { const z = r.kinds.J; out.push(`| ${r.name} | ${ex(z.omSun, 3)} | ${fx(z.angOmSun, 2)} | ${dec(z.decel)} | ${ex(z.wRot, 3)} | ${ex(z.heatSunB, 3)} | ${ex(z.heatSun319, 3)} |`); }
    out.push('', '| 第319便b の写しの外の式との照合(同じ初期の状態) | 公転面の角速度(回転の項)の相対の差の最大 | 木星の (b) の比の相対の差 | abs(ω_☉)(軸の項)の相対の差の最大 |', '|---|---|---|---|');
    for (const k of R.kinds) { const cs = R.compare.filter((c) => c.kind === k); if (!cs.length) continue; const jc = cs.find((c) => c.i === 6);
      out.push(`| ${KJA[k]}(第319便b の ${cs[0].plan319b}) | ${ex(Math.max(...cs.map((c) => c.wRotRel)), 1)} | ${jc && jc.ratioRel !== undefined ? ex(jc.ratioRel, 1) : '—'} | ${ex(Math.max(...cs.map((c) => c.omSunRel)), 1)} |`); }
  }
  // F 木星(🗺️)
  out = SEC.F = [];
  out.push('| 木星(🗺️ の写し)の 1 回の量(読み (b)) | 銀河の項 | 受け手の慣性係数 | abs(ω_☉) [rad/s] | 太陽の項の (b) [J] | 源ごとの (b) [J] | 第319便a の契約 [J] | 主列に要る τ_hold [s] | 代替の列に要る τ_hold [s] | τ_hold = h₀ の電力 / 主列 |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.F.rows.filter((q) => q.book === 'solarSystem16Inertial3d' && q.i === 6)) {
    out.push(`| ${r.kindJa} | ${r.galaxyJa} | ${r.recvFJa} | ${ex(r.sunMag, 3)} | ${ex(r.sunHeatB, 3)} | ${ex(r.eventB, 3)} | ${r.event319 === null ? '—' : ex(r.event319, 3)} | ${ex(r.tauReqB, 3)} | ${ex(r.tauReqBAlt, 3)} | ${ex(r.ratioBAtH0, 3)} |`);
  }
  // F 木星(🏀)—— 受け手 I = ½ m R² の列だけ
  out.push('', '| 木星(🏀 の写し・受け手 I = ½ m R²)の 1 回の量(読み (b)) | 銀河の項 | abs(ω_☉) [rad/s] | 源ごとの (b) [J] | 主列に要る τ_hold [s] | 代替の列に要る τ_hold [s] |', '|---|---|---|---|---|---|');
  for (const r of J.F.rows.filter((q) => q.book === 'jupiterSunInertial3d' && q.recvF === 'engine')) out.push(`| ${r.kindJa} | ${r.galaxyJa} | ${ex(r.sunMag, 3)} | ${ex(r.eventB, 3)} | ${ex(r.tauReqB, 3)} | ${ex(r.tauReqBAlt, 3)} |`);
  // F 金星(🗺️)
  out.push('', '| 金星(🗺️ の写し・受け手 I = ½ m R²)の 1 回の量 | 銀河の項 | abs(ω_☉) [rad/s] | 太陽の項 | 太陽の項の (b) [J] | 源ごとの (b) [J] | 第319便a の契約 [J] |', '|---|---|---|---|---|---|---|');
  for (const r of J.F.rows.filter((q) => q.book === 'solarSystem16Inertial3d' && q.i === 2 && q.recvF === 'engine')) out.push(`| ${r.kindJa} | ${r.galaxyJa} | ${ex(r.sunMag, 3)} | ${dec(r.sunDecel)} | ${ex(r.sunHeatB, 3)} | ${ex(r.eventB, 3)} | ${r.event319 === null ? '—' : ex(r.event319, 3)} |`);
  // TS
  out = SEC.TS = [];
  out.push('| 刻みの感度(🏀 の J + (b) の写し・同じ時間) | 値 |', '|---|---|',
    `| {tauHold}: h と h/2 の熱の相対の差 | ${fl(J.TS.tauHold.rel, 1e-9)} |`, `| "step": h/2 の熱 / h の熱 | ${fx(J.TS.step.ratio, 4)} |`);
  return SEC;
}
export const SECTION_KEYS = Object.freeze(['Q', 'P', 'A', 'BAL', 'R', 'F', 'TS']);
/** 全部の表の行(QA の逐語照合) */
export function physicsTablesSrcHeat(J) { const S = physicsSectionsSrcHeat(J); return SECTION_KEYS.flatMap((k) => S[k]); }
