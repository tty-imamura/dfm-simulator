// 第322便a(原仮定者の予定(第123報)・AN504・統括の検証項目 R270): **PHYSICS〔第322便a〕の表の行と本文の数を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.geo2flat322a が PHYSICS〔第322便a〕と逐語で照合する。
// 逐語照合する表に丸めの程度の数を書かない(口座の閉じ・試走の差・エネルギーの台帳は fmtFloor の床 —— 退化と照合は違う値の数〔0 は 0〕)。
import { fmtFloor, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w322a-geo2flatdoc-1';

const yn = (b) => (b ? '真' : '偽');
const f3 = (x) => fmtFloor(x, 1e-9, 1);

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersGeo2flat(J) {
  const g = J.parts.gate.row, tr = J.parts.trial;
  return [fx(g.ratio, 4), String(g.steps), String(g.mid.steps), fx(g.mid.ratio, 4), String(g.n), fx(tr.tilt.ratio, 4), fx(tr.thick.ratio, 4), String(J.parts.degen.nVal), String(J.parts.table.nCases)];
}

export function physicsTablesGeo2flat(J) {
  const out = [], P = J.parts, g = P.gate, r = g.row;
  // gate
  out.push(`| 本 | 步 | 時刻 | 外縁の vφ(kFrame=1) | 外縁の vφ(kFrame=0 の写し) | 比 kF1/kF0 | 二次元の凍結と同じビット | 途中(${r.mid ? r.mid.steps : '—'} 步)の比 | クランプ(速度・自転・反作用 —— A・B) | z・v_z・u の z・軸の向きの差(A) |`, '|---|---|---|---|---|---|---|---|---|---|');
  out.push(`| galaxyGeo2Flat3d(${r.n} 体・${r.stateType}・${r.integrator}) | ${r.steps} | ${fx(r.t, 2)} | ${fx(r.vphiKF1, 4)} | ${fx(r.vphiKF0, 4)} | ${fx(r.ratio, 4)} | ${yn(g.sameAsFrozen)} | ${r.mid ? fx(r.mid.ratio, 4) : '—'} | ${r.clampVN.join('・')} / ${r.clampSN.join('・')} / ${r.clampRN.join('・')} | ${[r.zA.zMax, r.zA.vzMax, r.zA.uPzMax, r.zA.axisDevRad].map((v) => (v === 0 ? '0' : f3(v))).join('・')} |`);
  // degen
  out.push('', '| 面への退化の場面 | 体 | 步 | 積分器 | 状態の型 | 照合した値 | 違う値 | z・v_z・u の z・軸の最大 | 三次元の口座の z の成分が 0 |', '|---|---|---|---|---|---|---|---|---|');
  for (const d of P.degen.rows) out.push(`| ${d.key}(${d.note}) | ${d.n} | ${d.steps} | ${d.integrator} | ${d.prec} | ${d.nVal} | ${d.nDiff} | ${d.zMax === 0 ? '0' : f3(d.zMax)} | ${yn(d.ledger3Zero)} |`);
  // pure
  out.push('', '| 純関数との照合(非平面の 6 体・傾いた軸) | 数の表現 | 步 | 照合した値(状態 15 欄 + 口座 20 欄 + 時刻) | 違う値 | 軸が回った回数 | 蹴りの回数 |', '|---|---|---|---|---|---|---|');
  for (const p of P.pure.rows) out.push(`| ${p.integrator} | ${p.prec} | ${p.steps} | ${p.nVal} | ${p.nDiff} | ${p.axisTurns} | ${p.kicks} |`);
  // hist + ckpt + ledger
  const H = P.hist, C = P.ckpt, L = P.ledger;
  out.push('', '| 履歴・保存と復帰・口座 | 値 | 門 |', '|---|---|---|',
    `| 1 步目(kFrame=1)と kFrame=0 の 1 步目の位置・速度・自転の違う値 / 蹴り / 履歴を置いた受け手 | ${H.rows[0].nDiff} / ${H.rows[0].kicks} / ${H.rows[0].hasU}(自由な粒子 ${H.nFree}) | ${yn(H.pass)} |`,
    `| 2 步目の蹴り | ${H.rows[1].kicks} | — |`,
    `| 保存 → ${J.plan.ckM} 步 → 復帰 → ${J.plan.ckM} 步 と保存しなかった走行の違う値(状態 15 欄 + 口座) | ${C.restore.nDiff} / ${C.restore.nVal} | ${yn(C.pass)} |`,
    `| 否定対照: 復帰の後に u の履歴の z を塗る | 違う値 ${C.paintedUPz.nDiff} | — |`,
    `| A/B の複製(cloneSimState)の ${J.plan.ckM} 步と元の違う値 | ${C.clone.nDiff} / ${C.clone.nVal} | — |`,
    `| 運動量・角運動量の閉じ(倍精度の状態・単精度の場の配列 —— リザーバ resP・resL と拘束 conP・conL を含む) | P ${f3(L.rows.double.dP)}・L ${f3(L.rows.double.dL)} | ${yn(L.pass)} |`,
    `| 同じ(単精度の状態 —— 記録だけ) | P ${f3(L.rows.single.dP)}・L ${f3(L.rows.single.dL)} | — |`,
    `| 口座を外したときの P のずれ(倍精度) | ${f3(L.rows.double.dPwithoutLedger)} | — |`,
    `| 平面の本の P_z・L_x・L_y・リザーバと拘束の z の成分(${L.flat.steps} 步) | ${L.flat.zero ? 'すべて 0' : '0 でない'} | — |`);
  // table
  out.push('', '| 宣言(平面の本を変えた写し) | 期待 | 受理 | 拒否の鍵 | 門 |', '|---|---|---|---|---|');
  for (const t of P.table.rows) out.push(`| ${t.label} | ${t.expect === 'accept' ? '受理' : '拒否'} | ${yn(t.ok)} | ${t.deny.join('・') || '—'} | ${yn(t.pass)} |`);
  out.push('', '| 走行中の編集 | 進んだ | 止めた理由 |', '|---|---|---|');
  for (const t of P.table.runtime) out.push(`| ${t.label} | ${yn(t.advanced)} | ${t.halt || '—'} |`);
  // trial
  const T = P.trial;
  out.push('', `| 試走の対(${T.tilt.steps} 步 × A と B) | 比 kF1/kF0(面の座標) | 途中(${T.tilt.mid ? T.tilt.mid.steps : '—'} 步)の比 | z の二乗平均(始め → 終わり) | z の最大(終わり) | 2R の外 | 自転軸と面の法線の角の最大(rad) | ΔE − 引きずりの仕事(初期の E の絶対値で割る) | 軸が回った回数 | クランプ(速度・反作用 —— A・B) |`, '|---|---|---|---|---|---|---|---|---|---|');
  for (const t of [T.tilt, T.thick]) {
    const lab = t.kind === 'tilt' ? `傾き有り(incl ${t.incl}°・node ${t.node}° —— 正規の宣言)` : `有限厚(h ${t.thickH} —— 器が z・v_z を置く試走)`;
    out.push(`| ${lab} | ${fx(t.ratio, 4)} | ${t.mid ? fx(t.mid.ratio, 4) : '—'} | ${fx(t.z0.zRms, 3)} → ${fx(t.zA.zRms, 3)} | ${fx(t.zA.zMax, 3)} | ${t.zA.beyond2R} | ${t.zA.axisDevRad === 0 ? '0' : fx(t.zA.axisDevRad, 3)} | ${f3(t.energy.relResidualKF1)} | ${t.axisTurnN} | ${t.clampVN.join('・')} / ${t.clampRN.join('・')} |`);
  }
  out.push('', '| AN510 の 2 案(純関数の小さい系) | 体 | 步 | html の步と "vector" が同じビット | 位置の差(相対) | 速度の差(相対) | 自転のベクトルの差(相対) | 軸が回った回数("vector") | 垂直の口座の大きさ("parallel") |', '|---|---|---|---|---|---|---|---|---|');
  for (const a of T.an510.rows) out.push(`| ${a.kind === 'flat' ? '平面' : a.kind === 'tilt' ? '傾き有り' : '有限厚'} | ${a.n} | ${a.steps} | ${yn(a.html.same)} | ${a.posRel === 0 ? '0' : f3(a.posRel)} | ${a.velRel === 0 ? '0' : f3(a.velRel)} | ${a.spinVecRel === 0 ? '0' : f3(a.spinVecRel)} | ${a.axisTurnsVector} | ${a.spinPerpL === 0 ? '0' : f3(a.spinPerpL)} |`);
  // S3
  out.push('', '| 次の段(S3)の変更 | 何を | どこ | 門 |', '|---|---|---|---|');
  for (const s of J.s3Plan) out.push(`| ${s.area} | ${s.what} | ${s.where} | ${s.gate} |`);
  return out;
}
