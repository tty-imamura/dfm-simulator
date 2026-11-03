// 第324便a(原仮定者の回答(2026-11-01 —— AN500)・決断事項 AN513・AN510・統括の検証項目 R279): **PHYSICS〔第324便a〕の表の行と本文の数を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.geo2thick324a が PHYSICS〔第324便a〕と逐語で照合する。
// 逐語照合する表に丸めの程度の数を書かない(回転共変の差・口座の閉じ・エネルギーの台帳・刻みの感度は fmtFloor の床 —— 照合は違う値の数〔0 は 0〕)。
import { fmtFloor, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w324a-geo2thickdoc-1';

const yn = (b) => (b ? '真' : '偽');
const f1 = (x) => fmtFloor(x, 1e-9, 1), f12 = (x) => fmtFloor(x, 1e-12, 1);
const LAB = { thick: '🥞 有限厚・傾き無し(内蔵の本)', tilt: '🧇 有限厚・傾き有り(内蔵の本)', thin: '厚み 0・傾き無し(🫓 に倍精度の状態 —— 器の build)', thinTilt: '厚み 0・傾き有り(同じ —— 全体で回した写し)',
  'thick-h2': '🥞 の刻み h/2', 'tilt-h2': '🧇 の刻み h/2' };
const MODE = { rise: '零自転からの立ち上がり', flip: '符号反転(状態の自転 ±3e-4 から)', cap: '上限への到達(状態の自転 ±39.9999 から)' };

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersGeo2thick(J) {
  const P = J.parts, by = {}; for (const r of P.pair.rows) by[r.kind] = r;
  return [fx(P.flat.row.ratio, 4), String(J.plan.steps), fx(by.thick.ratio, 4), fx(by.tilt.ratio, 4), fx(by.thin.ratio, 4), fx(by.thinTilt.ratio, 4),
    String(P.accept.nCases), String(P.accept.redraw.max), fx(P.accept.stats.zRms, 3), String(P.accept.redraw.book.draws)];
}

export function physicsTablesGeo2thick(J) {
  const out = [], P = J.parts, f = P.flat.row, A = P.accept, pr = P.pair, by = {}; for (const r of pr.rows) by[r.kind] = r;
  // 平面の写しの門
  out.push(`| 平面の写しの門(🫓 —— 第322便a の器の gateRow) | 步 | 比 kF1/kF0 | 二次元の凍結と同じビット | 途中(${f.mid.steps} 步)の比 | クランプ(速度・自転・反作用 —— A・B) |`, '|---|---|---|---|---|---|');
  out.push(`| galaxyGeo2Flat3d(${f.n} 体・${f.stateType}・${f.integrator}) | ${f.steps} | ${fx(f.ratio, 4)} | ${yn(P.flat.sameAsFrozen)} | ${fx(f.mid.ratio, 4)} | ${f.clampVN.join('・')} / ${f.clampSN.join('・')} / ${f.clampRN.join('・')} |`);
  // 受理の表
  out.push('', '| 宣言(🥞 を変えた写し) | 期待 | 受理 | 門 |', '|---|---|---|---|');
  for (const r of A.rows) out.push(`| ${r.label} | ${r.expect === 'accept' ? '受理' : '拒否'} | ${yn(r.ok)} | ${yn(r.pass)} |`);
  // 系列・h = 0・傾きの初期・再抽選
  const T = A.tiltInit, Rd = A.redraw;
  out.push('', '| 乱数の系列・h = 0・傾きの初期・再抽選 | 値 | 門 |', '|---|---|---|',
    `| 厚みを外した写しと 🥞 の面内の状態(位置・速度・質量・自転・半径)の違う値 / 照合した値 | ${A.rng.nDiff} / ${A.rng.nVal}(z・v_z が 0 でない粒子 ${A.rng.zNonZero}・${A.rng.vzNonZero} / ${A.rng.nDisk}) | ${yn(A.rng.nDiff === 0)} |`,
    `| h = 0 の宣言と鍵の無い本の build の違う値(全欄)/ 署名が同じ | ${A.h0.nDiff} / ${yn(A.h0.sigSame)} | ${yn(A.h0.nDiff === 0 && A.h0.sigSame)} |`,
    `| 🧇 の初期の状態と 🥞 を R で回した像の差(位置・速度 —— 相対)/ 群の粒子の軸と中心の軸の R ẑ からの差 | ${f1(T.posMaxRel)}・${f1(T.velMaxRel)} / ${f1(T.diskAxisDev)}・${f1(T.centerAxisDev)} | ${yn(T.posMaxRel < 1e-12 && T.velMaxRel < 1e-12)} |`,
    `| 再抽選の上限(1 粒子)/ 本の 380 粒子の抽選の回数・1 粒子の最大 / cut 1 の写しの抽選の回数・最大 | ${Rd.max} 回 / ${Rd.book.draws} 回・${Rd.book.maxTries} 回 / ${Rd.cut1.draws} 回・${Rd.cut1.maxTries} 回 | — |`,
    `| 上限を超える列(純関数に cut 10⁻³ を直に)/ 受理器の突き合わせの拒否 | 粒子 ${Rd.lowCutFail} で超える / ${Rd.crossMsg ? '拒否' : '受理'} | ${yn(Rd.lowCutFail === 0 && !!Rd.crossMsg)} |`,
    `| 抽選の後の z の二乗平均(🥞 の初期 —— 記録だけ)/ h | ${fx(A.stats.zRms, 3)} / ${A.stats.h}(比 ${fx(A.stats.zRmsOverH, 3)}) | — |`);
  // 対の本
  out.push('', `| 対の本の走行(A は kFrame=1・B は kFrame=0 の写し) | 步 × 刻み | 比 kF1/kF0(面の座標) | 途中の比 | z の二乗平均(始め → 終わり) | z の最大(終わり) | 2R の外 | 自転軸と面の法線の角の最大(rad) | ΔE − 引きずりの仕事(初期の E の絶対値で割る) | 軸が回った回数 | クランプ(速度・自転・反作用 —— A・B) |`,
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const k of ['thick', 'tilt', 'thin', 'thinTilt', 'thick-h2', 'tilt-h2']) {
    const t = by[k]; if (!t) continue;
    out.push(`| ${LAB[k]} | ${t.steps} × ${t.dt} | ${fx(t.ratio, 4)} | ${t.mid ? fx(t.mid.ratio, 4) : '—'} | ${fx(t.z0.zRms, 3)} → ${fx(t.zA.zRms, 3)} | ${fx(t.zA.zMax, 3)} | ${t.zA.beyond2R} | ${fx(t.zA.axisDevRad, 3)} | ${f1(t.energy.relResidualKF1)} | ${t.axisTurnN} | ${t.clampVN.join('・')} / ${t.clampSN.join('・')} / ${t.clampRN.join('・')} |`);
  }
  // 回転共変の程度
  out.push('', '| 回転共変の程度(傾き有り − 傾き無しを R で回した像 —— A の状態) | 步 | 位置の差の最大(円盤の半径で割る) | 位置の差の中央値 | 速度の差の最大(最大の速さで割る) | 自転のベクトル s â の差の最大(最大の大きさで割る) | 面の外の揺らぎ(厚み 0 —— 面の座標の z の最大) |',
    '|---|---|---|---|---|---|---|');
  for (const key of ['thick', 'thin']) {
    const c = pr.cov[key]; if (!c) continue;
    for (const r of c.at) out.push(`| ${key === 'thick' ? '有限厚の対(🧇 − R·🥞)' : '厚み 0 の対'} | ${r.steps} | ${f1(r.posMaxRel)} | ${f1(r.posMedRel)} | ${f1(r.velMaxRel)} | ${f1(r.spinVecMaxRel)} | ${r.outOfPlane === null ? '—' : f1(r.outOfPlane)} |`);
  }
  // 差の出どころ(器の中だけの配列の差し替え)
  out.push('', '| 回転共変の差の出どころ(🧇 − R·🥞 —— 器の中で配列を差し替えた写し) | 差し替えた配列の数 | 場の型・自転の型 | 步 | 位置の差の最大 | 速度の差の最大 | 自転のベクトルの差の最大 |', '|---|---|---|---|---|---|---|');
  for (const r of P.wide.rows) for (const a of r.at) out.push(`| ${r.label} | ${r.nWidened} | ${r.fieldType}・${r.spinType} | ${a.steps} | ${f12(a.posMaxRel)} | ${f12(a.velMaxRel)} | ${f12(a.spinVecMaxRel)} |`);
  // 刻みの感度と対の比の差
  out.push('', '| 刻みの感度と対の比の差 | 比(h) | 比(h/2) | 差(h − h/2) | 途中の差 | 対の比の差(傾き有り − 傾き無し —— h) |', '|---|---|---|---|---|---|');
  for (const k of ['thick', 'tilt']) { const h = pr.h2[k]; if (!h) continue;
    out.push(`| ${k === 'thick' ? '🥞' : '🧇'} | ${fx(h.ratioH, 4)} | ${fx(h.ratioH2, 4)} | ${f1(h.diff)} | ${f1(h.midDiff)} | ${k === 'thick' ? f1(pr.cov.thick.ratioDiff) : '—'} |`); }
  out.push(`| 厚み 0 の対 | ${fx(by.thin.ratio, 4)} | — | — | — | ${f1(pr.cov.thin.ratioDiff)} |`);
  // AN510
  out.push('', '| AN510 の門(小さい系 —— 有限厚の本の写し) | 場面 | 体 | 步 | html の步と "vector" の違う値 / 照合した値 | 立ち上がり(粒子・最初の步) | 符号反転 | 上限のクランプ(落とした回数) | P の閉じ | L の閉じ(落とした分を戻す前 → 後) | 落とした自転のエネルギー | 軸が回った回数 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of P.an510.rows) out.push(`| ${r.id === 'galaxyGeo2Thick3d' ? '🥞' : '🧇'} | ${MODE[r.mode]} | ${r.n} | ${r.steps} | ${r.nDiff} / ${r.nVal} | ${r.rise}・${r.firstRise === null ? '—' : r.firstRise} | ${r.flips} | ${r.clampSN}(${r.capEvents}) | ${f1(r.dP)} | ${f1(r.dL)} → ${f1(r.dLwithDrop)} | ${r.dropSpinE === 0 ? '0' : f1(r.dropSpinE)} | ${r.axisTurns} |`);
  // ckpt
  out.push('', '| 保存と復帰・A/B の複製(build → ' + J.plan.ckN + ' 步 → 保存 → ' + J.plan.ckM + ' 步) | 復帰の違う値 / 照合した値 | 複製の違う値 | z の最大 | u の履歴の z の最大 | 状態の型 |', '|---|---|---|---|---|---|');
  for (const id of ['galaxyGeo2Thick3d', 'galaxyGeo2ThickTilt3d']) { const c = P.ckpt.rows[id];
    out.push(`| ${id === 'galaxyGeo2Thick3d' ? '🥞' : '🧇'} ${id} | ${c.restore.nDiff} / ${c.restore.nVal} | ${c.clone.nDiff} / ${c.clone.nVal} | ${fx(c.zMax, 3)} | ${f1(c.uPzMax)} | ${c.prec} |`); }
  return out;
}
