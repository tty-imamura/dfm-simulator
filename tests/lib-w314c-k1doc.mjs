// 第314便c(原仮定者の裁定(第116報)の補足・決断事項 AN410〔推奨〕・AN405・AN401・AN396′・統括の検証項目 R240): **PHYSICS〔第314便c〕の表の行を正本から作る純関数**(文書だけ ——
// 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.k1outer314・docs.k1em314 が PHYSICS〔第314便c〕と逐語で照合する。
//   ・physicsTablesOuter(Jo, J313)・docNumbersOuter(Jo): 外惑星の K1 の確認の正本(tests/out/k1outer-w314c.json)の表と数。小さい係数の分解の表と候補の感度の並びは
//     第313便d の正本(tests/out/k1confirm-w313d.json —— 5 系)の行と並べる(段 k1outer-314c は第313便d の正本を読まない —— 文書の表だけで並べる)
//   ・physicsTablesEm(Je, J313)・docNumbersEm(Je, J313): 🌦️ の h/4 と月の 354 公転の正本(tests/out/k1em-w314c.json)の表と数(h・h/2 は第313便d の正本の行)
// 逐語照合する表に丸めの程度の数を書かない(帯・小さい差は丸めの床 fmtFloor —— 1e-12″/世紀)。
// 第315便d(決断事項 AN410 —— 全系に一様の門): 正本の門の欄は一様の門へ作り直した。PHYSICS〔第314便c〕の表は第314便c の型(OUTER_GATE_W314C —— 凍結)の
//   門を同じ走行の行から器の純関数で作り直して書く(表の文は第314便c のまま —— 一様の門の表は PHYSICS〔第315便d〕・tests/lib-w315d-satdoc.mjs)。
import * as Q from './lib-w311d-planet3.mjs';
import * as CF from './exp-w312d-confirm.mjs';
import { OUTER, outerOf, OUTER_GATE, OUTER_GATE_W314C, relAppliesOf, partW, partG } from './exp-w314c-k1outer.mjs';
import { sysOf } from './exp-w313d-k1confirm.mjs';
export const DOC_LIB_VERSION = 'w314c-k1doc-1';
export const K313_OUT = 'tests/out/k1confirm-w313d.json';

const { fx, ex } = Q;
const fl = (x) => Q.fmtFloor(x, 1e-12, 2);   // 帯・小さい差は丸めの床(1e-12 ″/世紀 —— 抽出と刻みの帯より十分小さく、機械の違いの桁より十分大きい)
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const AU = 1.495978707e11;
const labOf = (key) => { const o = outerOf(key); if (o) return o.emoji + ' ' + o.ja; const s = sysOf(key); return s ? s.emoji + ' ' + s.ja : key; };
const a1Cell = (z, kind) => (z && Number.isFinite(z.value) ? z.value + '(' + kind + ' ' + z.width + ')' : '行なし');

/** 第314便c の型の門(凍結の定数)で W・G を作り直した写し(K・T は正本のまま —— 走行の行は同じ) */
export function legacyViewOuter(Jo) {
  if (!(Jo && Jo.K && Jo.T && Jo.E)) return Jo;
  const W = partW(Jo, OUTER_GATE_W314C), G = partG(Object.assign({}, Jo, { W }), OUTER_GATE_W314C);
  return Object.assign({}, Jo, { W, G, legacyGate: OUTER_GATE_W314C });
}
export function physicsTablesOuter(Jo0, J313) {
  const out = [], Jo = legacyViewOuter(Jo0);
  if (Jo.P) {
    out.push('| 系(t = 0 の写し —— 全天体 R_d = κ₀ × エンジンの質量・K1) | 天体 | m [kg] | エンジンの質量 [kg] | 観測半径 R [m] | R_d [m] | R_d/R | R_d/r_s | エンジンの R_d・m_d・β(規則の鍵 rdRule:"kappaM" の写しと) |',
      '|---|---|---|---|---|---|---|---|---|');
    for (const s of OUTER) { const p = Jo.P.systems[s.key]; if (!p || p.err) continue;
      for (const b of p.bodies) out.push(`| ${s.emoji} ${s.id} | ${b.name} | ${ex(b.m, 4)} | ${ex(b.mEngine, 9)} | ${ex(b.R, 4)} | ${ex(b.RdDecl, 6)} | ${ex(b.rdOverR, 3)} | ${fx(b.rdOverRs, 6)} | ${b.ruleKey && b.ruleKey.rdSame && b.ruleKey.mdSame && b.ruleKey.betaSame ? 'ビット同一' : '違う'} |`); }
  }
  if (Jo.T) {
    out.push('', '| 系 | q_1PN [″/世紀] | 器の刻み h | A1 EPM2011 [″/世紀] | A1 INPOP10a [″/世紀] | η = Mm/(M+m)² | (4/3)η q_1PN [″/世紀] | 相対の門(q_1PN < 10 ε_fit) |', '|---|---|---|---|---|---|---|---|');
    for (const s of OUTER) { const T = Jo.T.systems[s.key];
      out.push(`| ${s.emoji} ${s.ja} | ${ex(T.q1pn, 6)} | ${T.h} | ${a1Cell(T.a1.EPM2011, '幅')} | ${a1Cell(T.a1.INPOP10a, '区間の半幅')} | ${ex(T.eta, 4)} | ${ex(T.fm, 3)} | ${relAppliesOf(T.q1pn, OUTER_GATE_W314C) ? '置く' : '置かない(q_1PN ≥ 10 ε_fit)'} |`); }
  }
  if (Jo.K && Jo.W) {
    out.push('', '| 系(主の窓 —— κ₀ 固定・規則で置いた残差) | 刻み | ΔqG = q10 − q00 | D_G = q11 − q10 | r_1PN = q11 − q00 − q_1PN | r_1PN/q_1PN | r(EPM2011 の A1) | r(INPOP10a の A1) |', '|---|---|---|---|---|---|---|---|');
    for (const s of OUTER) { const N = Jo.W.systems[s.key].main, w = Jo.K.systems[s.key].byWin[N];
      for (const d of Object.keys(w.byDiv).map(Number).sort((a, b) => a - b)) { const b = w.byDiv[d];
        out.push(`| ${s.emoji} ${s.ja}(${N} 公転) | h/${d} | ${ex(b.dqG, 6)} | ${ex(b.DG, 6)} | ${ex(b.r1pn, 3)} | ${ex(b.rOverQ, 2)} | ${Number.isFinite(b.rA1.EPM2011) ? ex(b.rA1.EPM2011, 3) : '—'} | ${Number.isFinite(b.rA1.INPOP10a) ? ex(b.rA1.INPOP10a, 3) : '—'} |`); } }
    out.push('', '| 系(窓 × 刻みの感度 —— 16 公転の同じ走行の入れ子の窓) | 窓 N 公転 | r_1PN(h) | r_1PN(h/2) | r_1PN(h/4) | 帯 h–h/2 | 帯 h/2–h/4 | 帯の許容 | 帯の許容の内 | 主の窓 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const s of OUTER) { const W = Jo.W.systems[s.key];
      for (const N of Object.keys(Jo.K.systems[s.key].byWin).map(Number).sort((a, b) => a - b)) { const w = Jo.K.systems[s.key].byWin[N], r = (d) => (w.byDiv[d] ? ex(w.byDiv[d].r1pn, 3) : '—'), row = W.rows.find((z) => z.N === N);
        out.push(`| ${s.emoji} ${s.ja} | ${N} | ${r(1)} | ${r(2)} | ${r(4)} | ${fl(w.bands['1-2'])} | ${fl(w.bands['2-4'])} | ${ex(W.tol, 2)} | ${yn(row ? row.inTol : null)} | ${N === W.main ? '主' : ''} |`); } }
  }
  if (Jo.G) {
    out.push('', `| 系(主の窓・h/4 —— 決断事項 AN410 の推奨の型) | q_1PN | r_1PN | abs(r) ≤ ε_fit(${ex(OUTER_GATE_W314C.fit, 0)}) | 相対の許容 1e-2 q_1PN | abs(r) ≤ 1e-2 q_1PN | 帯(h–h/2・h/2–h/4) | 帯の許容 | 帯の門 | 相対の門 | 判定 |`, '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const s of OUTER) { const g = Jo.G.systems[s.key], ri = g.relInfo;
      const relCell = g.applies ? yn(g.relOk) : yn(ri.relOk) + '(参考)';
      const bandOk = g.applies ? (g.bandAbsOk === true && g.bandRelOk === true) : g.bandAbsOk === true;
      out.push(`| ${s.emoji} ${s.ja}(${g.N} 公転) | ${ex(g.q1pn, 4)} | ${ex(g.r, 3)} | ${yn(g.absOk)} | ${ex(g.relTol, 2)} | ${relCell} | ${g.bands.map(fl).join('・')} | ${ex(g.bandTol, 2)} | ${yn(bandOk)} | ${g.applies ? '置く' : '置かない'} | ${g.verdict} |`); }
  }
  if (Jo.D) {
    const inner = (J313 && J313.D) ? J313.D.rows.map((z) => Object.assign({}, z, { src: '第313便d', remWithinRel: Number.isFinite(z.rem) ? Math.abs(z.rem) <= OUTER_GATE.rel * Math.abs(z.q1pn) : null })) : [];
    const rows = inner.concat(Jo.D.rows.map((z) => Object.assign({}, z, { src: '第314便c(' + z.N + ' 公転)' }))).sort((a, b) => a.p - b.p);
    out.push('', '| 系(軌道の半直弦の順・最も細かい刻み) | p [au] | r_1PN(κ₀) | − (4/3)η q_1PN | 残り | G の値の効き(感度 —— 引かない) | 数値の帯 | 残り/q_1PN | abs(残り) ≤ ε_fit | abs(残り) ≤ 1e-2 q_1PN | 出所 |', '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const z of rows) out.push(`| ${labOf(z.key)}(h/${z.fine}) | ${fx(z.p / AU, 4)} | ${ex(z.r1pn, 3)} | ${ex(z.fm, 3)} | ${ex(z.rem, 2)} | ${ex(z.gDr, 2)} | ${fl(z.band)} | ${ex(z.remOverQ, 2)} | ${yn(z.remWithinFit)} | ${yn(z.remWithinRel)} | ${z.src} |`);
    out.push('', `| 系(候補の感度の並び —— 水星を 1 に・並べるだけ) | 残り/q_1PN | ${Jo.D.shapeDefs.map((c) => c.label + '(' + c.kind + ')').join(' | ')} |`, '|---|---|' + Jo.D.shapeDefs.map(() => '---|').join(''));
    for (const sh of Jo.D.shapes) { const z = rows.find((y) => y.key === sh.key);
      out.push(`| ${labOf(sh.key)} | ${z ? ex(z.remOverQ, 2) : '—'} | ${Jo.D.shapeDefs.map((c) => ex(sh[c.key], 2)).join(' | ')} |`); }
  }
  return out.join('\n');
}
export function docNumbersOuter(Jo) {
  const out = [];
  if (Jo.G) for (const s of OUTER) { const g = Jo.G.systems[s.key]; out.push(ex(g.r, 3), ex(g.rOverQ, 2)); }
  if (Jo.T) for (const s of OUTER) out.push(ex(Jo.T.systems[s.key].q1pn, 6));
  return out;
}

const MOON_LAB = { sidH: '恒星月', T4p: '近地点の周期', node: '交点の周期' };
export function physicsTablesEm(Je, J313) {
  const out = [];
  const K3 = J313 && J313.K ? J313.K.systems.earthmoon : null, Kh4 = Je.K;
  if (Kh4) {
    out.push('| 🌦️ 太陽と地球と月(EMB —— 月 118 公転・地球 8 公転・全天体の規則 K1) | 刻み | q00 [″/世紀] | q10 | q11 | D_G = q11 − q10 | r_1PN = q11 − q00 − q_1PN | 前の刻みとの帯 | 出所 |', '|---|---|---|---|---|---|---|---|---|');
    const rows = [];
    if (K3) for (const d of Object.keys(K3.byDiv).map(Number).sort((a, b) => a - b)) rows.push({ d, b: K3.byDiv[d], src: '第313便d' });
    rows.push({ d: Kh4.div, b: Kh4, src: '第314便c' });
    rows.forEach((z, i) => { const prev = i > 0 ? rows[i - 1].b.r1pn : null;
      out.push(`| 🌦️ EMB | h/${z.d} | ${fx(z.b.q.q00, 9)} | ${fx(z.b.q.q10, 9)} | ${fx(z.b.q.q11, 9)} | ${fx(z.b.DG, 9)} | ${ex(z.b.r1pn, 3)} | ${prev === null ? '—' : fl(Math.abs(z.b.r1pn - prev))} | ${z.src} |`); });
  }
  if (Je.S && !Je.S.quick && Je.S.n) {
    out.push('', '| 統括の 2 段目(第313便の統合の後 —— 正本の外)との照合(同じ器の関数・同じ物理の html) | 量 | ビット同一 |', '|---|---|---|');
    for (const k of ['q00', 'q10', 'q11']) { const r = Je.S.h4[k], v = Object.values(r); out.push(`| 🌦️ h/4 の ${k} | 步・EMB・地球自身・月の 3 量(${v.length} 個) | ${v.filter((z) => z.same).length}/${v.length} |`); }
    out.push(`| 🌦️ h/4 の r_1PN | 1 個 | ${Je.S.r1pnH4.same ? 1 : 0}/1 |`);
    const L = Object.values(Je.S.long354).flatMap((z) => Object.values(z)); out.push(`| 月の 354 公転(刻み h) | q11 − q10・q10 − q00・q00 − 観測 × 3 量(${L.length} 個) | ${L.filter((z) => z.same).length}/${L.length} |`);
  }
  if (Je.M) {
    out.push('', '| 月(🌦️ の三体 —— 全天体の規則 K1) | 窓・刻み | 恒星月 q11 − q10 [d] | 近地点の周期 q11 − q10 [yr] | 交点の周期 q11 − q10 [yr] | 恒星月 q10 − q00 [d] | 恒星月 q00 − 観測 [d] | 近地点の周期 q00 − 観測 [yr] | 交点の周期 q00 − 観測 [yr] | 出所 |', '|---|---|---|---|---|---|---|---|---|---|');
    const rows = [];
    if (J313 && J313.M && J313.M.moon) for (const d of Object.keys(J313.M.moon.byDiv).map(Number).sort((a, b) => a - b)) rows.push({ lab: '118 公転・h/' + d, m: J313.M.moon.byDiv[d], src: '第313便d' });
    rows.push({ lab: Je.M.h4.N + ' 公転・h/' + Je.M.h4.div, m: Je.M.h4, src: '第314便c' }, { lab: Je.M.long.N + ' 公転・h/' + Je.M.long.div, m: Je.M.long, src: '第314便c' });
    for (const z of rows) { const m = z.m; if (!m || !m.sidH) continue;
      out.push(`| 月 | ${z.lab} | ${ex(m.sidH.dDG, 3)} | ${ex(m.T4p.dDG, 3)} | ${ex(m.node.dDG, 3)} | ${ex(m.sidH.dG, 3)} | ${ex(m.sidH.q00MinusObs, 3)} | ${ex(m.T4p.q00MinusObs, 3)} | ${ex(m.node.q00MinusObs, 3)} | ${z.src} |`); }
  }
  return out.join('\n');
}
export function docNumbersEm(Je, J313) {
  const out = [];
  if (Je.K) out.push(ex(Je.K.r1pn, 3));
  const K3 = J313 && J313.K ? J313.K.systems.earthmoon : null;
  if (Je.K && K3 && K3.byDiv[2]) out.push(fl(Math.abs(Je.K.r1pn - K3.byDiv[2].r1pn)));
  if (Je.M && Je.M.long && Je.M.long.sidH) for (const k of Object.keys(MOON_LAB)) out.push(ex(Je.M.long[k].dDG, 3));
  return out;
}
