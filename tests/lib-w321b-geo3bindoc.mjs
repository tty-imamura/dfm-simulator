// 第321便b(原仮定者の予定(第123報)・統括の検証項目 R267):
// **PHYSICS〔第321便b〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.geo3Bin321b が PHYSICS〔第321便b〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(床 fmtFloor —— 床より小さい値は「< 床」)。
import { fmtFloor, COLS, TOYS, DIFFS } from './lib-w321b-geo3bin.mjs';
export const DOC_LIB_VERSION = 'w321b-geo3bindoc-1';

const yn = (b) => (b === null || b === undefined) ? '—' : (b ? '真' : '偽');
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
const e3 = (x) => fmtFloor(x, 1e-15, 3), e2 = (x) => fmtFloor(x, 1e-15, 2);
const SYS_JA = Object.freeze(Object.assign(Object.fromEntries(TOYS.map((t) => [t.key, '玩具 ' + t.ja])), { sirius: 'シリウス AB', acen: 'α Cen AB' }));
const COL_SHORT = Object.freeze({ g1_2d: 'geo1(二次元・在位)', g1_2dx: 'geo1(二次元・鍵を外す)', g1_3d: 'geo1(三次元)', off: 'geo3 OFF', gl: 'geo3 G_loc だけ', tr: 'geo3 並進だけ', on: 'geo3 回転 ON', J: 'geo3 J' });
export const sysJa = (k) => SYS_JA[k] || k;
const tick = (s) => '`' + s + '`';
const fin = (J) => J.plan.divs[J.plan.divs.length - 1];

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersGeo3Bin(J) {
  const I = J.I, d = (sys, k, q = 'rate') => J.T.diffs.find((z) => z.sys === sys && z.diff === k && z.qty === q) || {};
  const out = [String(I.n), String(I.nRetired), String(I.nInPop), String(I.nPrinciple), String(J.E.n)];
  for (const sys of ['eq-e', 'r3-e', 'sirius', 'acen']) out.push(fx(d(sys, 'pn').ratio, 4), fx(d(sys, 'geo3').ratio, 4), fx(d(sys, 'geo31').ratio, 3));
  out.push(e2(d('acen', 'geo31').byDiv ? d('acen', 'geo31').byDiv[d('acen', 'geo31').byDiv.length - 1] : null), e2(J.ana.acen.q1PN));
  const jd = J.T.jDiff[J.T.jDiff.length - 1]; out.push(e2(jd ? jd.rate : null));
  return out;
}

export function physicsTablesGeo3Bin(J) {
  const out = [], I = J.I, A = J.A, T = J.T, X = J.X, N = J.N;
  // 表 1 在位の連星の一覧
  out.push('| 本 | 族 | 役割 | 座標 | 宣言の geoPN・kFrame・λ_PN | 宣言から解決する法則 = build した S の法則(実効番号) | S.spin(状態) | 観測の自転のチャネル | 三次元で拒否される天体の鍵 | 較正母集団 |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of I.rows) {
    const obs = r.obsSpin.map((z, i) => z ? 'b' + i + ' ' + (z.pulse !== null ? 'pulse Ω ' + fx(z.pulse, 1) : 'spinDipole Ω ' + fx(z.spinDipole, 3)) + '(' + z.source + ')' : null).filter(Boolean).join('・') || '—';
    out.push(`| ${r.emoji} ${tick(r.id)} | ${r.principle ? '原理' : r.target} | ${r.familyRole} | ${r.coord} | ${r.geoPN}・${r.kFrame === null ? '—' : r.kFrame}・${r.lambdaPN === null ? '—' : r.lambdaPN} | ${r.lawDecl} ${r.consistent ? '=' : '≠'} ${r.lawSim}(${r.ge}) | ${(r.spinState || []).map((s) => fx(s, 4)).join('・')} | ${obs} | ${r.deny3d.join('・') || '—'} | ${r.inPopulation ? '内(' + r.calibration + ')' : '外'} |`);
  }
  // 表 2 兄弟の写しの量(最も細かい刻み)
  out.push('', `| 系 | 列 | 公転周期 P(同方向の周回) | 近点から近点の周期 | 離心率 e | 近点の率 [rad/公転](h/${fin(J)}) | 近点の率の刻みの帯 | 走行の秒(h・h/2・h/4 の和) |`, '|---|---|---|---|---|---|---|---|');
  for (const q of T.qty.filter((z) => z.col !== 'g1_2dx' && z.col !== 'J')) out.push(`| ${sysJa(q.sys)} | ${COL_SHORT[q.col]} | ${fx(q.P, 6)} | ${q.Pa === null ? '—' : fx(q.Pa, 6)} | ${fx(q.e, 8)} | ${e3(q.rate)} | ${e2(q.bandRate)} | ${fx(q.wallSec, 1)} |`);
  // 表 3 量ごとの差(近点の率)
  out.push('', `| 系 | 差 | 近点の率の差 [rad/公転] h・h/2・h/4 | 刻みの帯 | 解析の目安 | 比(h/${fin(J)}) | 周期 P の差(h/${fin(J)}) | 近点から近点の周期の差 | 離心率の差 |`, '|---|---|---|---|---|---|---|---|---|');
  for (const sys of J.plan.toys.concat(['sirius', 'acen'])) for (const dd of DIFFS) {
    const r = T.diffs.find((z) => z.sys === sys && z.diff === dd.key && z.qty === 'rate'); if (!r) continue;
    const g = (q) => { const z = T.diffs.find((w) => w.sys === sys && w.diff === dd.key && w.qty === q); return z ? z.byDiv[z.byDiv.length - 1] : null; };
    out.push(`| ${sysJa(sys)} | ${dd.ja} | ${r.byDiv.map(e3).join('・')} | ${e2(r.band)} | ${r.ana === null ? '—' : e3(r.ana)} | ${r.ratio === null ? '—' : fx(r.ratio, 4)} | ${e2(g('P'))} | ${e2(g('Pa'))} | ${e2(g('e'))} |`);
  }
  // 表 4 口座(最も細かい刻み)
  out.push('', `| 系 | 列 | ΔE_N/abs(E_0)(窓の終わり) | エンジンの口座の残り R_E/abs(E_0) | 相対の軌道の Δh/h | ΔL_z/L_0 | 移送の帳簿 ΔL/L_0 | ΔP − G_loc の力積(相対) |`, '|---|---|---|---|---|---|---|---|');
  for (const a of T.acct.filter((z) => z.col !== 'g1_2dx')) out.push(`| ${sysJa(a.sys)} | ${COL_SHORT[a.col]} | ${e2(a.dE)} | ${a.RE === null ? '—' : e2(a.RE)} | ${e2(a.dh)} | ${e2(a.dLz)} | ${e2(a.lDrag)} | ${a.pClose === null ? '—' : e2(a.pClose)} |`);
  // 表 5 ビットの比較と回転の共変
  out.push('', '| 系 | 面への退化(g1_3d と g1_2d の状態のビット) | 二次元の経路の鍵を外す(g1_2dx = g1_2d のビット) | 回転 ON = 並進だけ(ビット) |', '|---|---|---|---|');
  for (const b of T.bits) out.push(`| ${sysJa(b.sys)} | ${yn(b.plane)} | ${yn(b.keys2d)} | ${yn(b.onEqTr)} |`);
  out.push('', `| 系 | 回した列(z-x-z ${J.plan.rotDeg.join('°・')}°) | 近点の率の差 / (列 − OFF) | 周期の相対の差 | 離心率の差 | 実行の法則 |`, '|---|---|---|---|---|---|');
  for (const z of T.rot) out.push(`| ${sysJa(z.sys)} | ${COL_SHORT[z.col]} | ${e2(z.dRate)} | ${e2(z.dP)} | ${e2(z.de)} | ${z.law} |`);
  // 表 6 J の列
  out.push('', '| J の列の宣言(α Cen の回転 ON の写しから —— 群を前置しない二体) | 期待 | 受理 | 理由の文の頭 |', '|---|---|---|---|');
  for (const r of A.jDecl) out.push(`| ${r.ja} | ${r.expect ? '受理' : '拒否'} | ${r.ok ? '受理' : '拒否'} | ${r.ok ? '—' : String(r.errors[0] || '').slice(0, 48).replace(/\|/g, '/')} |`);
  out.push('', '| α Cen の J − 回転 ON | 近点の率の差 [rad/公転] | 周期の差 | 状態のビット同一 |', '|---|---|---|---|');
  for (const z of T.jDiff) out.push(`| h/${z.div} | ${e2(z.rate)} | ${e2(z.P)} | ${yn(z.same)} |`);
  // 表 7 NS の観測の自転の経路の材料
  out.push('', `| 本 | 観測の Ω(pulse・spinDipole —— 本の単位) | S.spin の値域の上限 ${A.spinRange[1]} に対する倍率 | S.spin へ写した値(受理の後) | R_d/R(規則 Y_k m) | 素の三次元の写しで拒否される鍵 | 二次元の表示の軸 | 質量の推定 |`, '|---|---|---|---|---|---|---|---|');
  for (const z of N.rows) out.push(`| ${tick(z.id)} | ${z.omegaObs.map((w) => w === null ? '—' : fx(w, 1)).join('・')} | ${z.overRange.map((w) => w === null ? '—' : fx(w, 1)).join('・')} | ${(z.spinAfterCopy || []).map((s) => fx(s, 1)).join('・')}${z.spinClamped ? '(値域に修正)' : ''} | ${z.rdOverR.map((w) => fx(w, 3)).join('・')} | ${z.deny3d.join('・') || '—'} | ${z.spinAxis2d.map((w) => w === null ? '—' : fx(w, 1) + '°').join('・')} | ${z.massBasis || '—'} |`);
  // 表 8 既存の器の除外
  out.push('', '| 器・QA | 除外の型 | 外している本 | 新しい連星の geo3 の本(写しの述語・静的な読み) |', '|---|---|---|---|');
  for (const s of X.laterSets) { const pr = J.X.hypo.map((h) => (h.preds.find((p) => p.stage === stageOf(s.file)) || {}).hit); out.push(`| ${tick(s.file)} | ${tick(s.name)}(名指し・使う所 ${s.uses}) | ${s.ids.map(tick).join('・')} | ${pr.some(Boolean) ? '数え上げに入る(名指しの外 —— 器を触る便)' : '入らない'} |`); }
  for (const q of X.qaNamed) out.push(`| ${tick(q.qa)} | QA の名指し(${tick(q.gen)}) | ${tick(q.book)} | 同じ型の除外か宣言の条件が要る |`);
  out.push(`| ${tick('tests/lib-w320d-rulebooks.mjs')} | 宣言の条件 isRuleBookNoCopy | K1 の短い形で生まれた本 | ${J.X.hypo.every((h) => h.ruleBook) ? '当たる(ruleBooks に数えられる —— 値が変わる)' : '当たらない'} |`);
  // 表 9 第一陣の順の材料
  out.push('', '| 段 | 本の数 | 走行の秒(本便の器 —— 並走の秒) | 門 | 要る宣言 |', '|---|---|---|---|---|');
  for (const f of J.F) out.push(`| ${f.ja} | ${f.books} | ${f.wallSec === null ? '—' : fx(f.wallSec, 1)} | ${f.gate} | ${f.needs} |`);
  return out.join('\n');
}
const STAGE_OF = Object.freeze({ 'tests/exp-w301g-wbglaw.mjs': 'wbglaw-301g', 'tests/exp-w302c-wbgest.mjs': 'wbgest-302c', 'tests/exp-w302d-semic.mjs': 'semic-302d', 'tests/exp-w303a-refit.mjs': 'refit-303a' });
function stageOf(f) { return STAGE_OF[f] || null; }
