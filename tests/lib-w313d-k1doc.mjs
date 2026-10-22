// 第313便d(原仮定者の裁定(第115報)AN399・AN402・決断事項 AN401・AN405・AN396′・統括の検証項目 R237): **PHYSICS〔第313便d〕の表の行を正本から作る純関数**(文書だけ ——
// 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.planet3v3_313・docs.k1confirm313 が PHYSICS〔第313便d〕と逐語で照合する。
//   ・physicsTables(J)・docNumbers(J): K1 の確認の系の正本(tests/out/k1confirm-w313d.json)の表と数
//   ・kappa0TableRows(HP): 全天体の規則 R_d = κ₀m の表(写しの本の G・c —— 本の単位の 10 G m/(C₁ c²) を SI へ・R_d/r_s = 5/C₁)
//   ・capFreeRuleRows(HP, J): cap を外した後の〔第312便d〕④ の規則の表の行(確認の器の正本 J の基礎の表から今の lib で作り直す —— t = 0)
// 逐語照合する表に丸めの程度の数を書かない(帯・小さい差は丸めの床 fmtFloor)。
import * as Q from './lib-w311d-planet3.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as CF from './exp-w312d-confirm.mjs';
import { SYSTEMS, PLANET_KEYS, sysOf } from './exp-w313d-k1confirm.mjs';
export const DOC_LIB_VERSION = 'w313d-k1doc-1';

/** v2(第313便d): cap を外した後の規則の表の行(t = 0 —— 確認の器の正本 J の基礎の表〔planet3 の正本〕から今の lib で作り直す。QA docs.planet3v3_313 が PHYSICS〔第313便d〕と逐語で照合) */
export function capFreeRuleRows(HP, J) {
  const C2 = CF.partC(HP, Object.assign({}, J, { E: null, T: null }), { basis: CF.ruleBasis(HP, CF.planet3Of()) });
  return CF.byTypeRows(C2.byType);
}
/** v2(第313便d): 全天体の規則 R_d = κ₀m の表(写しの本の G・c —— 本の単位の 10 G m/(C₁ c²) を SI へ・R_d/r_s = 5/C₁)。PHYSICS〔第313便d〕の逐語の表 */
export function kappa0TableRows(HP) {
  const em = CF.baseOf(HP, 'earthmoon'), jb = CF.baseOf(HP, 'jupiter'), out = [];
  const row = (ja, p, i) => { const L = Math.pow(10, p.scaleExp.L), M = Math.pow(10, p.scaleExp.M), m = p.bodies[i].m * M, Rd = Q.rdBookKappa0(p, p.bodies[i].m) * L;
    const G = p.physics.G * L ** 3 / (M * Math.pow(10, p.scaleExp.T) ** 2), c = p.physics.cLight * L / Math.pow(10, p.scaleExp.T), rs = 2 * G * m / (c * c);
    return `| ${ja} | ${m.toExponential(4)} | ${Rd.toPrecision(5)} | ${(Rd / rs).toFixed(4)} |`; };
  out.push(row('太陽', em, 0), row('🏀 木星', jb, 1), row('地球', em, 1));
  for (const pl of Q.PLANETS) out.push(row(pl.emoji + ' ' + pl.ja, Q.pinnedBook(HP, PL3.PIN, pl.id), 1));
  out.push(row('月', em, 2));
  return out;
}

const { fx, ex } = Q;
const fl = (x) => Q.fmtFloor(x, 1e-6, 2);   // 帯・小さい差は丸めの床(1e-6 ″/世紀)で
const fk = (x) => (Number.isFinite(x) ? x.toFixed(7) : '—');   // κ/κ₀ の倍率(7 桁 —— ε_fit の分解能より細かい)
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
export function physicsTables(J) {
  const out = [];
  if (J.P) {
    out.push(`| 系(t = 0 の写し —— 全天体の規則・K1) | 天体 | m [kg] | 観測半径 R [m] | 宣言の R_d = κ₀m [m] | エンジンの R_d [m] | 受け手 |`, '|---|---|---|---|---|---|---|');
    for (const s of SYSTEMS) { const p = J.P.systems[s.key]; if (!p || p.err) continue;
      for (const b of p.bodies) out.push(`| ${s.emoji} ${s.id} | ${b.name} | ${ex(b.m, 4)} | ${ex(b.R, 4)} | ${ex(b.RdDecl, 5)} | ${Number.isFinite(b.RdEngine) ? ex(b.RdEngine, 5) : '—'} | ${b.pinned ? '源だけ(pinned —— 動かない)' : (b.receiver ? '受け手と源' : '源だけ')} |`); }
  }
  if (J.K) {
    out.push('', '| 系(κ₀ 固定 —— 規則で置いた残差) | q_1PN [″/世紀] | 刻み | D_G = q11 − q10 | r_1PN = q11 − q00 − q_1PN | r(EPM2011 の A1) | r(INPOP10a の A1) |', '|---|---|---|---|---|---|---|');
    for (const s of SYSTEMS) { const K = J.K.systems[s.key], T = J.T.systems[s.key]; if (!K) continue;
      for (const d of Object.keys(K.byDiv).map(Number).sort((a, b) => a - b)) { const b = K.byDiv[d];
        out.push(`| ${s.emoji} ${s.ja} | ${fx(T.q1pn, 6)} | h/${d} | ${fx(b.DG, 6)} | ${ex(b.r1pn, 3)} | ${ex(b.rA1.EPM2011, 3)} | ${ex(b.rA1.INPOP10a, 3)} |`); } }
    out.push('', '| 系 | A1 EPM2011 [″/世紀](幅の種類) | A1 INPOP10a [″/世紀](幅の種類) | η = Mm/(M+m)² | (4/3)η q_1PN [″/世紀] |', '|---|---|---|---|---|');
    for (const s of SYSTEMS) { const T = J.T.systems[s.key], a = T.a1;
      const cell = (z) => (z && Number.isFinite(z.value) ? z.value + '(' + (z.key === 'INPOP10a' || /interval/.test(z.widthKind) ? '区間の半幅 ' : '幅 ') + z.width + ')' : '—');
      out.push(`| ${s.emoji} ${s.ja} | ${cell(a.EPM2011)} | ${cell(a.INPOP10a)} | ${ex(T.eta, 4)} | ${ex(T.fm, 3)} |`); }
  }
  if (J.R) {
    out.push('', `| 惑星(根 —— h/4 の κ の割線・太陽も規則のまま) | 点 kf = κ/κ₀ と r_1PN(h/4)| 候補の kf | 候補の R_d [m] | r(h)/r(h/2)/r(h/4) | rootBracketed | numericResolved | targetReached | declAdmissible | 採用 |`, '|---|---|---|---|---|---|---|---|---|---|');
    for (const key of PLANET_KEYS) { const o = J.R.planets[key], s = sysOf(key); if (!o || !o.candidate) continue; const a = o.adopt, c = o.candidate;
      out.push(`| ${s.emoji} ${s.ja} | ${o.points.map((z) => fk(z.kf) + ': ' + ex(z.r, 3)).join('・')} | ${fk(c.kf)} | ${ex(c.RdM, 6)} | ${[1, 2, 4].map((d) => ex(c.rByDiv[d], 3)).join(' / ')} | ${yn(a.rootBracketed)} | ${yn(a.numericResolved)} | ${yn(a.targetReached)} | ${yn(a.declAdmissible)} | ${a.adopted ? '採る' : '採らない'} |`); }
    out.push('', '| 根の κ_i/κ₀(3 惑星) | 🌡️ 水星 | 🌋 金星 | 🔴 火星 | 最大/最小 |', '|---|---|---|---|---|');
    const cellK = (f) => PLANET_KEYS.map((k) => fk(J.R.planets[k] && J.R.planets[k].candidate ? f(J.R.planets[k]) : null)).join(' | ');
    out.push(`| 1PN だけ(h/4 の候補の点 —— 走行) | ${cellK((o) => o.candidate.kf)} | ${fk(J.R.spread.pn1)} |`);
    out.push(`| 1PN + A1 EPM2011(実測の傾きで換算) | ${cellK((o) => o.kfA1.EPM2011)} | ${fk(J.R.spread.EPM2011)} |`);
    out.push(`| 1PN + A1 INPOP10a(実測の傾きで換算) | ${cellK((o) => o.kfA1.INPOP10a)} | ${fk(J.R.spread.INPOP10a)} |`);
  }
  if (J.D) {
    out.push('', '| 系(軌道の半直弦の順・最も細かい刻み) | p [au] | r_1PN(κ₀) | − (4/3)η q_1PN | 残り | G の値の効き(感度 —— 引かない) | 数値の帯 | 残り/q_1PN | abs(残り) ≤ ε_fit |', '|---|---|---|---|---|---|---|---|---|');
    for (const z of J.D.rows) { const s = sysOf(z.key);
      out.push(`| ${s.emoji} ${s.ja}(h/${z.fine}) | ${fx(z.p / 1.495978707e11, 4)} | ${ex(z.r1pn, 3)} | ${ex(z.fm, 3)} | ${ex(z.rem, 2)} | ${ex(z.gDr, 2)} | ${fl(z.band)} | ${ex(z.remOverQ, 2)} | ${yn(z.remWithinFit)} |`); }
    out.push('', `| 系(候補の感度の並び —— 水星を 1 に・並べるだけ) | 残り/q_1PN | ${J.D.shapeDefs.map((c) => c.label + '(' + c.kind + ')').join(' | ')} |`, '|---|---|' + J.D.shapeDefs.map(() => '---|').join(''));
    for (const z of J.D.rows) { const s = sysOf(z.key), sh = J.D.shapes.find((y) => y.key === z.key);
      out.push(`| ${s.emoji} ${s.ja} | ${ex(z.remOverQ, 2)} | ${J.D.shapeDefs.map((c) => ex(sh[c.key], 2)).join(' | ')} |`); }
  }
  if (J.M && J.M.moon) {
    const M = J.M.moon.byDiv[1] || Object.values(J.M.moon.byDiv)[0];
    if (M) {
      out.push('', '| 月(🌦️ の三体 —— 118 公転の窓・刻み h・全天体の規則 K1) | 在位の観測 OBS_B1 | q00(在位の写し) | q10 − q00(G_loc) | q11 − q00(G_loc + 引きずり) | q11 − q10(引きずり) |', '|---|---|---|---|---|---|');
      for (const [k, , u, ja] of CF.MOON_Q) { const z = M[k]; out.push(`| ${ja} [${u}] | ${fx(z.obs, 6)} | ${fx(z.q00, 6)} | ${ex(z.dG, 3)} | ${ex(z.dD, 3)} | ${ex(z.dDG, 3)} |`); }
    }
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [];
  if (J.P) out.push(J.P.C1.toFixed(10), ex(J.P.systems.mercury.kappa0, 8));
  if (J.R) for (const k of PLANET_KEYS) { const o = J.R.planets[k]; if (o && o.candidate) out.push(fk(o.candidate.kf)); }
  if (J.K) for (const s of SYSTEMS) { const K = J.K.systems[s.key]; if (K && K.fine !== null) out.push(ex(K.r1pn, 3)); }
  return out;
}
