// 第351便g(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R433):
// **正本 tests/out/r3energy-351g.json から PHYSICS〔第351便g〕の表を作る文書の lib**
// (QA docs.r3energy351g が節の表と逐語で照合する —— 表の数は有効数字 3 桁・倍率は小数 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、固定の表もここに持つ。
export const DOC_VERSION = 'w351g-r3energydoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-12 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const NORM = Object.freeze({ N1: '(N1)', N2: '(N2)' });
const MMAP = Object.freeze({ m1: '(m1)', m2: '(m2)', m3: '(m3)' });
const BAL = Object.freeze({ R3: '步の率のまま(ratio 1)', K1: '(K1)', K2: '(K2)' });
const DEST = Object.freeze({ heat: '内部熱', inertial: '慣性回転', dragE1: '引きずり回転 (E1)', dragE2: '引きずり回転 (E2)', dragE3: '引きずり回転 (E3)' });
const JUDGE = Object.freeze({ none: '増えない', flat: '頭打ち', grow: '増え続ける' });
const BODY = Object.freeze({ Io: 'イオ', Moon: '月' });
const ORIGIN = Object.freeze({ sun: '太陽由来', parent: '母天体由来', local: '局所の和(太陽 + 母天体)', localBg: '局所の和 + 背景軸引きずり(向き −1・倍率 1)' });
const PART = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)' });

/** 原文(言葉を変えずに引く) */
export const SRC146 = '原仮定者の整理(2026-11-23 —— 第146報)';
export const SRC145 = '原仮定者の回答(2026-11-22 —— 第145報の回答 9)';
export const SRC147 = '原仮定者の回答(2026-11-24 —— 第147報)';
export const ORIGINALS = Object.freeze([
  Object.freeze([SRC146, '軸が動かなかった分のエネルギーは消えない。エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、軸を起こす為のトルクが増して釣り合う。行き先を「引きずり回転」とする比較も行う']),
  Object.freeze([SRC146, '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
  Object.freeze([SRC145, '自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う']),
  Object.freeze([SRC147, 'つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
  Object.freeze([SRC147, 'AN1001: Aで進める。主要衛星は潮汐ロックしている']),
]);
export function originalTable() {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) |', '|---|---|---|', ...ORIGINALS.map((o, k) => `| ${k + 1} | ${o[0]} | 「${o[1]}」 |`)].join('\n');
}
/** 1 ステップの帳簿の欄(固定) */
export const LEDGER_TABLE = ['| 欄 | 式(1 ステップ・I = 1) | 読み |', '|---|---|---|',
  '| 総量 G | トルクの大きさ × abs(Ω⊥) × dt = I abs(ω_T) Ω⊥² dt | 供給の則 (P1) の m の前の量(仮定の式 —— 出どころは決まっていない) |',
  '| 供給の仕事(= 動かなかった分) | (1 − m) G((P1))・0((P0) 対照) | 〔第350便d〕の supplyRate そのもの |',
  '| 軸の運動 | (A0) 0・(A1) m G | 経路 ① で軸が動いた分。自転のエネルギーは変わらない(角運動量の向きだけが変わる)—— 表 4 |',
  '| 内部熱 | h × 供給 + ((E3) のとき)リセットした分 | 行き先の割合 h |',
  '| 慣性回転の増し分 | a_in × 供給 + ((E2) のとき)リセットした分 | ロックの拘束では使えない(表 3) |',
  '| 引きずり回転(比べる列) | a_dr × 供給 → リセットの後 (E1) 場へ返る・(E2) 慣性回転へ移る・(E3) 熱 | 〔第348便b〕の 3 つの読み |',
  '| 場との交換 | ½ I ((ω_I + Ω∥(新))² − (ω_I + Ω∥(旧))²) | 軸が動くと引きずり回転 Ω∥ が変わる分(帳簿では供給と別の欄) |'].join('\n');
/** m と f の関係の置き方(固定) */
export const MMAP_TABLE = ['| 置き方 | m の式 | f 0 | f 0.5 | f 1 |', '|---|---|---|---|---|',
  '| (m1) | m は f と独立のノブ(〔第350便d〕のまま —— 0・0.5) | m | m | m |',
  '| (m2) | 寄る成分の割合((N1) k₁²・(N2) f) | 0 | (N1) 0.5・(N2) 0.5 | 1 |',
  '| (m3) | 軸が実際に動いた角 ÷ 拘束が無いとき(k₁ 1)に動く角(閉じた形・窓 1 ÷ abs(Ω)) | 0 | (N1) 0.794・(N2) 0.610 | 1 |'].join('\n');

export function tablesOf(J) {
  const T = {};
  T['1'] = ['| 置き方 | f | m の置き方 | m | k₁ | k₂ | θ(T) [deg] | 内部熱の行き先: 熱(T) | 内部熱の行き先: ω(T) ÷ ω_慣性(0) | 慣性回転の行き先: 供給の仕事 | 慣性回転の行き先: ω_I(T) ÷ ω_I(0) | 慣性回転の行き先: ω(T) ÷ ω_慣性(0) | (P0) 対照: 熱・ω_I の変わり | 帳簿の残差 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.mf.map((r) => `| ${NORM[r.norm]} | ${r.f} | ${MMAP[r.mMap]}${r.mSet === null ? '' : ' ' + r.mSet} | ${f4(r.m)} | ${f4(r.kTilt)} | ${f4(r.kPrec)} | ${f3(r.thEndDeg)} | ${fe(r.heatH)} | ${f3(r.wRatioH)} | ${fe(r.workA)} | ${f3(r.wiRatioA)} | ${f3(r.wRatioA)} | ${fz(r.p0Heat)}・${fz(r.p0Wi)} | ${fz(r.ledger)} |`)].join('\n');
  T['2'] = ['| 釣り合い方 | f | 行き先 | m((m2)) | ω(T) ÷ ω_慣性(0) | ω(2T) ÷ ω_慣性(0) | θ(T) [deg] | 熱(T) | 熱(2T) | 供給の仕事(T) | abs(Ω⊥) の終わり ÷ 初め | 供給の率の終わり ÷ 初め | 自転 | 時定数 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.bal.map((r) => `| ${BAL[r.bal]} | ${r.f} | ${DEST[r.dest]} | ${f4(r.m)} | ${f3(r.wRatio)} | ${f3(r.wRatio2T)} | ${f3(r.thEndDeg)} | ${fe(r.heat)} | ${fe(r.heat2T)} | ${fe(r.work)} | ${fz(r.perpRatio)} | ${r.supplyRatio === null ? '—(供給 0)' : fz(r.supplyRatio)} | ${JUDGE[r.judge]} | ${r.tau === null ? '—' : f3(r.tau)} |`)].join('\n');
  T['3'] = ['| 天体 | 由来 | 成分 | abs(Ω) [rad/s] | ŝ と Ω の cos | abs(Ω⊥) [rad/s] | (P1) の供給の率 [W] | ロック → 内部熱 [W] | ロック → 場へ返る: 熱 [W] | (P0) 対照 [W] | 慣性回転へ入れる読み | 熱の物差し(文献の値・未照合)[W] | 内部熱 ÷ 物差し |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.lock.map((r) => `| ${BODY[r.id]} | ${ORIGIN[r.origin]} | ${PART[r.part]} | ${fe(r.om)} | ${f3(r.cos)} | ${fe(r.perp)} | ${fe(r.supplyW)} | ${fe(r.lockHeatW)} | ${fe(r.lockFieldW)} | ${fe(r.p0W)} | 使えない(ロックの拘束) | ${fe(r.heatRuler)} | ${fe(r.overLit)} |`)].join('\n');
  T['4'] = ['| f | 則 | m((m2)) | 総量 G | 供給の仕事 = 動かなかった分 | 軸の運動 (A0) | 軸の運動 (A1) | 供給 + (A1) | 経路 ① で動いた角 [deg] | θ(T) [deg] | ½ I ω_I² の変わり | abs(L_I) の変わり | 場との交換 | 回転エネルギーの変わり | 帳簿の残差 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.axis.map((r) => `| ${r.f} | ${r.rule} | ${f4(r.m)} | ${fe(r.gross)} | ${fe(r.work)} | 0 | ${fe(r.axisA1)} | ${fe(r.sumA1)} | ${f3(r.axisAngDeg)} | ${f3(r.thEndDeg)} | ${fe(r.dEi)} | ${fe(r.dLi)} | ${fe(r.fieldX)} | ${fe(r.dE)} | ${fz(r.ledger)} |`)].join('\n');
  return T;
}
export function factsOf(J) {
  const ps = J.pure.scenes, cc = ps.cc, B = J.bal, pick = (bal, f, dest) => B.find((r) => r.bal === bal && r.f === f && r.dest === dest);
  const io = J.lock.filter((r) => r.id === 'Io'), mo = J.lock.filter((r) => r.id === 'Moon'), mx = (L) => L.reduce((a, r) => (r.lockHeatW > a.lockHeatW ? r : a), L[0]);
  const ioM = mx(io), moM = mx(mo);
  return {
    common: `共通の点検の数(本節の lib で出た値 —— 〔第350便d〕の commonChecks を呼ぶ): x の直径の 2 点の差分の z 成分 ${cc.dxZ.toFixed(8)}・6 点の平均の z 成分 ${cc.sixZ.toFixed(8)}・中心の渦度の半分の z 成分 ${cc.wZ.toFixed(8)}。`,
    power: `経路 ①・② のトルク(角運動量の向きを変える I ω_L dŝ/dt)と自転の角速度 ω_T ŝ の内積は、30 の組(ŝ 5 × Ω 3 × 経路 2)の最大で ${fz(ps.pw.worst)}(÷ abs(τ) abs(ω))—— どちらのトルクも自転への仕事率は 0。`,
    f0: `f 0 の走りと〔第350便d〕の歳差だけの列(heatRun)の差は、行き先 6 × m 2 × 則 2 の最大で ${fz(ps.f0)}・例 fixed の慣性回転だけ ${f3(ps.r22.inertial)} 倍・引きずり回転 + (E1) ${f3(ps.r22.dragE1)} 倍(〔第350便d〕の 22.422・1.766 と同じ数)。`,
    stop: `f 1・(N1)・(m1) 0(例 fixed)では、abs(Ω⊥) の終わり ÷ 初め ${fz(ps.stop.perp)}・供給の率の終わり ÷ 初め ${fz(ps.stop.supply)} で、ω(T) ÷ ω_慣性(0) は ${f3(ps.stop.wRatio)} で止まる(軸が Ω にそろうと供給も止まる)。`,
    plateau: `表 2 の頭打ちの値(f 0.5・(m2)・慣性回転): 步の率のまま ${f3(pick('R3', 0.5, 'inertial').wRatio)}・(K1) ${f3(pick('K1', 0.5, 'inertial').wRatio)}・(K2) ${f3(pick('K2', 0.5, 'inertial').wRatio)}。f 0 は 3 つとも増え続ける(2T で ${f3(pick('R3', 0, 'inertial').wRatio2T)})。〔第350便d〕の比べる列: 慣性回転だけ 22.4 倍(T 50)・引きずり回転 1.77 倍・(K1) 2.0〜2.6・(K2) 2.0〜2.9。`,
    lock: `ロックの拘束の下で (P1) の供給を全部熱に入れた読みの最大: イオ ${fe(ioM.lockHeatW)} W(${ORIGIN[ioM.origin]}・${PART[ioM.part]} —— 熱の物差しの ${fe(ioM.overLit)} 倍)・月 ${fe(moM.lockHeatW)} W(${ORIGIN[moM.origin]}・${PART[moM.part]} —— ${fe(moM.overLit)} 倍)。場へ返る読みでは熱 0・(P0) では 0。`,
  };
}
