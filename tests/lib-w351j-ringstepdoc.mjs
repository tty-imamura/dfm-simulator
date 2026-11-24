// 第351便j(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R436):
// **正本 tests/out/ringstep-351j.json から PHYSICS〔第351便j〕の表と数の文を作る文書の lib**
// (QA docs.ringstep351j が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、固定の表もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w351j-ringstepdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const PART = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)' });
const SENSE = Object.freeze({ pro: '順行', retro: '逆行' });
const DIR = Object.freeze({ toward: '寄せる', away: '離す', mixed: '混ざる', none: '0' });
const COL = Object.freeze({ k1: '〔第348便i〕(Rk1)・W_ii 定数', inPos: '在位の形(受け手の球 m 1・R 1 —— 中心の値 1.5)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '円盤引きずりの検証結果は、saturnRotVertExplore3d']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '引きずりの形が円盤状に現れる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'ただし、自転軸が起きるのは、自転と軸引きずり回転が順方向、つまり源の回転が逆方向の場合である。源の回転が順方向では、自転軸を倒す向きになる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
]);
export const READINGS = Object.freeze([
  '軸引きずりの (R3) の步を、円盤状に並んだ受け手(粒子の輪)の法線に当てて並べる —— 輪の法線 L̂ を自転軸 ŝ の役・輪の公転の角運動量を「自転」の役に置く',
  '🛟 の正本の傾きの減りの率を、(R3) の経路 ① の寄る速さに換算した値を並べる(読むだけ —— 🛟 は探索用・未較正。本と鍵は変えない)',
  '輪には 2 点の差分 (C1)(通過の輪の傾きに対する比 1.000〜1.006 —— 〔第350便g〕)・剛体の球には (C2) —— 両方を列に置く',
  '主の列 (C2) は剛体の球の読み。輪の列は (C1) と (C2) を並べる(換算の係数 k は 1 —— 経路 ① の率と経路 ② の率を同じ倍率で動かす)',
  '輪では「自転」= 輪の公転の向き。源の自転と同じ向きに回る輪(順行)と逆向きの輪(逆行)で、寄る/離れるが入れ替わるかを数える',
  '比率のノブ f を (N1) の 0・0.5・1 で並べる(既定は決めない)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** 対応の表(固定 —— 統括の読み) */
export const MAP_TABLE = ['| (R3) の語 | 輪での役 | 本節の量 |', '|---|---|---|',
  '| 自転軸 ŝ | 輪の法線 L̂(輪の公転の角運動量の向き —— 逆行の輪は下向き) | 傾き ε = 源の赤道面の法線(順行 +ẑ・逆行 −ẑ)と L̂ のなす角・交点の経度 |',
  '| 自転の角運動量 | 輪の公転の角運動量 | ω_T ÷ ω_L は 1(輪の公転の速さはトルクの式と角運動量の式で同じ —— 置いた値) |',
  '| Ω | 輪の回転 Ω_ring = 粒子 24 点の位置の Ω の平均(粒子ごとに受け手の速度 = その粒子の公転の速度) | 読み (C1)(C2)・成分 (M)(S)(MS) |',
  '| 経路 ①(寄る) | 輪の法線が符号つきの Ω の向きへ寄る | 回転軸の線に対する傾きの率 dθ_line/dt・源の赤道面に対する起こす率 −dε/dt |',
  '| 経路 ②(歳差) | 輪の法線が Ω のまわりを回る(交点が動く) | 交点の経度の率 —— k₂ 1 は輪を Ω で剛体として回す式 dL̂/dt = Ω × L̂ と同じ |'].join('\n');
/** 🛟 と (R3) の当たる所・当たらない所(固定 —— 〔第350便g〕の表 7 の続き) */
export const FIT_TABLE = ['| 項 | 🛟 saturnRotVertExplore3d(円盤引きずりの鉛直の型) | (R3) の步(輪の法線) | 当たる所 |', '|---|---|---|---|',
  '| 働く所 | 粒子の高さ(帯の内の鉛直の速度) | 輪の法線の向き(輪を剛体として回す) | 当たらない(働く量が違う) |',
  '| 厚み | 帯の内で傾きの比が目安へ減る(厚みの型そのものは扱わない) | 厚み(面からの高さの RMS)は変えない(構造) | 当たらない |',
  '| 傾きの減り方 | 3000 步で目安の比 0.389(−ln g ÷ t の率) | 小さい傾きで θ ∝ e^(−k₁ abs(Ω) t)(経路 ①・Ω 一定) | 形(指数の減り)だけ当たる —— 率は表 7 の換算(較正ではない) |',
  '| 減る向き | 源の赤道面へ寄る | (C2) は源の赤道面へ寄る・(C1) は離れる(表 7 の符号 —— 傾き 1° の輪) | (C2) の列だけ向きが当たる |',
  '| 強さ | 見えるように強さ 1e5 倍・帯の半幅 2e6 倍(本の宣言) | k₁ 1・換算の係数 k 1 | 比べる列(合わせない) |'].join('\n');
/** 3 つの結果と 2 経路(固定 —— 統括の読み)。数は tablesOf の表 3 */
export const OUTCOME_TABLE = ['| 結果(〔第350便g〕の分け方) | 経路 ①(寄る) | 経路 ②(歳差) | 本節の数 |', '|---|---|---|---|',
  '| 輪が傾く(強制の傾き —— 通過の源など) | 大きさ abs(Ω⊥)(k₁ 1) | 大きさ abs(Ω × L̂) = abs(Ω⊥)(k₂ 1 —— 剛体の回転と同じ式) | 〔第350便g〕の「(C1) ÷ 輪 1.000〜1.006」は大きさの比 —— 2 つの経路を分けない(零試験 ⑥) |',
  '| 傾きが減る/増える(寄る) | 効く(Ω⊥ の向きへ —— 傾きと Ω∥ の符号で寄る/離れる) | 効かない(Ω とのなす角を保つ —— 交点だけ動く) | 表 1・表 2 |',
  '| 厚みを保つ(鉛直の復元) | 効かない(輪を剛体として回す) | 効かない(同上) | 〔第350便g〕の粒子の輪の厚みの比(表 3)は (R3) の步の外の量 |'].join('\n');

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 第350便までの共通の点検の数(x の直径の 2 点の差分・6 点の平均・中心の渦度の半分 の z 成分)', `${S.common.diaXz.toFixed(8)}・${S.common.sixZ.toFixed(8)}・${S.common.rotWz.toFixed(8)}`, G.common],
      ['② Ω を止めた輪の步と〔第351便d〕の r3Step(f 0・0.5・1 の終わりの L̂ の角の差)', S.frozen.every((x) => x < 1e-12) ? '< 1e-12°' : S.frozen.map(fe).join('・'), G.frozenR3],
      ['③ f 0(Ω を毎步作り直す・10 步): 傾きの変化 ÷ 交点の変化・刻み 1/4 で傾きの変化の比/f 1: 交点の変化/Ω の ẑ・L̂ の面の外の成分', `${fe(S.f0.dEps / S.f0.dNode)}・${f3(S.f0.dEps40 / S.f0.dEps)}/${fz(Math.abs(S.f1.dNode))}/${fz(S.inPlane < 1e-12 ? 0 : S.inPlane)}`, G.f0f1],
      ['④ (S) の dθ_line/dt の符号: 順行 (C1)・(C2)/逆行 (C1)・(C2)', S.sense.map((r) => (r.pro > 0 ? '+' : '−')).join('・') + '/' + S.sense.map((r) => (r.retro > 0 ? '+' : '−')).join('・'), G.proRetro],
      ['⑤ (M) の abs(Ω⊥) ÷ abs(Ω)(C1・C2)/(MS) と (S) の Ω⊥ の相対の差', `${S.mPar.map(fz).join('・')}/${S.msPerp.every((x) => x < 1e-9) ? '< 1e-9' : S.msPerp.map(fe).join('・')}`, G.mParallel],
      ['⑥ abs(Ω × L̂) と abs(Ω⊥) の相対の差・経路 ① と経路 ② の向きの内積 ÷ abs(Ω⊥)²', '< 1e-12・< 1e-12', G.rigid],
      ['⑦ 傾き 0 の輪の平均と〔第350便g〕の点の値の相対の差/(C2) の点と〔第351便c〕の closedM・closedSEq の相対の差・(M) +ẑ と (S) −ẑ', `${S.point.vs350g < 1e-9 ? '< 1e-9' : fe(S.point.vs350g)}/< 1e-12・< 1e-12・${S.point.signs ? '真' : '偽'}`, G.point],
      ['⑧ 寄せる力の (S) + (M) と (MS) の相対の差(在位の形・(C2)・距離 3・corS・z/r 0.01)', S.linear < 1e-8 ? '< 1e-8' : fe(S.linear), G.linear],
      ['⑨ 変異: 足し算の步の長さの崩れ/粒子の速度を L̂ と逆にした (M) と L̂ の cos', `${fe(S.mutUnit)}/${f3(S.mutVel)}`, G.mutants],
      ['⑩ 入力の拒否(L̂ 0・読みの名・成分の名・粒子 2・步 0・時間 < 0)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.rates = '| 読み | 成分 | 輪 | L̂ と Ω の cos | abs(Ω) | abs(Ω⊥) | dθ_line/dt(経路 ① k₁ 1) | 起こす率 −dε/dt(経路 ① k₁ 1) | 交点の率(経路 ② k₂ 1)[rad/単位時間] | 3 公転の ε の変化(1 点の率から)[deg] |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.rates.map((r) => `| ${r.read} | ${PART[r.part]} | ${SENSE[r.sense]} | ${f4(r.cos)} | ${fe(r.om)} | ${fz(r.perp)} | ${fz(r.dLine)} | ${fz(r.raise)} | ${fz(r.nodeRate)} | ${r.dTilt3Deg === 0 ? '0' : f3(r.dTilt3Deg)} |`).join('\n');
  T.runs = '| 読み | 成分 | f((N1)) | 輪 | (k₁, k₂) | 3 公転の ε の変化 [deg] | 3 公転の交点の変化 [deg] |\n|---|---|---|---|---|---|---|\n'
    + J.runs.rows.map((r) => `| ${r.read} | ${PART[r.part]} | ${r.f} | ${SENSE[r.sense]} | (${f3(r.kTilt)}, ${f3(r.kPrec)}) | ${f3(r.dEpsDeg)} | ${r.dNodeDeg === 0 ? '0' : f3(r.dNodeDeg)} |`).join('\n');
  { const O = J.outcome, P = Object.fromEntries(O.particle.map((p) => [p.cfg, p])), R = Object.fromEntries(O.r3.map((r) => [r.read, r]));
    T.outcome = '| 列 | 3 公転の輪の傾きの変化 [deg] | 厚みの比(1 公転の RMS の平均 —— 最後 ÷ 最初) |\n|---|---|---|\n' + [
      ['〔第350便g〕の粒子の輪・両方(源の回転 + 受け手の速度を引く)', fe(P.both.dTiltDeg), f4(P.both.rmsMeanRatio)],
      ['〔第350便g〕の粒子の輪・源の回転だけ(受け手の速度を引かない)', fe(P.spin.dTiltDeg), f4(P.spin.rmsMeanRatio)],
      ['〔第350便g〕の粒子の輪・並進だけ(源の自転 0)', fe(P.trans.dTiltDeg), f4(P.trans.rmsMeanRatio)],
      ['(R3) の步・(C1)・f 1:(S)・(MS)・(M)', `${f3(R.C1.tiltS)}・${f3(R.C1.tiltMS)}・0`, '1(構造)'],
      ['(R3) の步・(C2)・f 1:(S)・(MS)・(M)', `${f3(R.C2.tiltS)}・${f3(R.C2.tiltMS)}・0`, '1(構造)'],
      ['(R3) の步・f 0((S)):(C1) の傾き・交点/(C2) の傾き・交点', `${fe(R.C1.tiltF0)}・${f3(R.C1.nodeF0)}/${fe(R.C2.tiltF0)}・${f3(R.C2.nodeF0)}`, '1(構造)'],
    ].map(([a, b, c]) => `| ${a} | ${b} | ${c} |`).join('\n'); }
  { const by = new Map(); for (const r of J.swap.rows) { const k = r.col + '|' + r.W0 + '|' + r.Wii; const v = by.get(k) || { col: r.col, W0: r.W0, Wii: r.Wii, n: 0, swap: 0, oppOver: 0, nonSwapNoOver: 0 }; v.n++; if (r.swap) { v.swap++; if (r.nOver >= r.nOpp && r.nOpp >= r.nHeights - 2) v.oppOver++; } else if (r.nOver === 0) v.nonSwapNoOver++; by.set(k, v); }
    T.swap = '| 場 | W₀ | W_ii | 行 | 向きが入れ替わる行((S) と (MS) の向きが違う) | そのうち、(M) が (S) と逆の符号で大きさが上回る行(高さの全部 —— 混ざる行は符号のある高さ) | 入れ替わらない行のうち、(M) が (S) を上回る高さが 0 の行 |\n|---|---|---|---|---|---|---|\n'
      + [...by.values()].map((v) => `| ${COL[v.col]} | ${v.W0} | ${v.Wii} | ${v.n} | ${v.swap} | ${v.oppOver} | ${v.nonSwapNoOver}/${v.n - v.swap} |`).join('\n'); }
  T.closed = '| 距離 d | (C2) の (M) の z 成分(場) | 〔第351便c〕closedM | (C2) の (S) の z 成分(場) | 〔第351便c〕closedSEq × s | 赤道面の直交の成分 |\n|---|---|---|---|---|---|\n'
    + J.swap.closed.map((c) => `| ${c.d} | ${fe(c.Mz)} | ${fe(c.closedM)} | ${fe(c.Sz)} | ${fe(c.closedS)} | ${fz(c.perpMS)} |`).join('\n');
  { const R = J.rotvert;
    T.rvBook = '| 步 | 時刻(本の単位) | 目安の比 g | 🛟 の率 −ln g ÷ t(見える倍率のまま)[1/s] | 強さの倍(' + R.lambdaScale + ')で割った率 [1/s] |\n|---|---|---|---|---|\n'
      + R.book.map((b) => `| ${b.steps} | ${f3(b.t)} | ${f3(b.guide)} | ${fe(b.rateBook)} | ${fe(b.rateNeed)} |`).join('\n');
    T.rv = '| 区分 | r [R_sat] | 同期軌道の | (C1) abs(Ω) [1/s] | (C1) k₁ の等価(見える倍率)| (C1) k₁ の等価(倍で割った率) | (C1) 源の赤道面に対する率(傾き 1°・k₁ 1)[1/s] | (C1) その率での k₁ の等価(倍で割った率) | (C2) abs(Ω) [1/s] | (C2) k₁ の等価(見える倍率) | (C2) k₁ の等価(倍で割った率) | (C2) 源の赤道面に対する率 [1/s] | (C2) その率での k₁ の等価 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n'
      + R.rows.map((r) => `| ${r.key} | ${f3(r.r)} | ${r.inside ? '内' : '外'} | ${fe(r.C1.magPerS)} | ${fe(r.C1.k1Book)} | ${f3(r.C1.k1Need)} | ${fe(r.C1.gammaPerS)} | ${fe(r.C1.k1NeedEps)} | ${fe(r.C2.magPerS)} | ${fe(r.C2.k1Book)} | ${f3(r.C2.k1Need)} | ${fe(r.C2.gammaPerS)} | ${fe(r.C2.k1NeedEps)} |`).join('\n'); }
  T.saturn = '| 区分 | r [R_sat] | 公転 ÷ 自転 | 読み | 輪 | (S) の cos | (S) abs(Ω) [1/s] | (M) の cos | (M) abs(Ω) [1/s] | (MS) の cos | (S) ÷ (M) | (MS) の abs(Ω⊥)[1/s] | (MS) の起こす率 [1/s] |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.saturn.rows.map((r) => `| ${r.key} | ${f3(r.r)} | ${f3(r.nOverW)} | ${r.read} | ${SENSE[r.sense]} | ${f4(r.S.cos)} | ${fe(r.S.magPerS)} | ${f4(r.M.cos)} | ${fe(r.M.magPerS)} | ${f4(r.MS.cos)} | ${fe(r.SoverM)} | ${fe(r.MS.perpPerS)} | ${fe(r.MS.raisePerS)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, R = J.rotvert.rows, S = J.saturn.rows, O = Object.fromEntries(J.outcome.r3.map((r) => [r.read, r])), P = Object.fromEntries(J.outcome.particle.map((p) => [p.cfg, p]));
  F.swap = `向きが入れ替わる行は〔第348便i〕(Rk1) の ${J.swap.nSwapK1}/${J.swap.nK1}・在位の形の ${J.swap.nSwapIn}/${J.swap.nIn}(〔第350便g〕の表 8 の旗と行ごとに同じ —— 違う行 ${J.swap.vs350g})。受け手の速度 0 の場(λ 0)は (S) そのもの・λ の一次の分は (M) そのもの(寄せる力の (S) + (M) と (MS) の相対の差 < 1e-8)。`;
  F.ring = `粒子の輪(源の自転 0.4・半径 3・傾き 10°)では、(M) の回転は輪の法線と平行(abs(Ω⊥) ÷ abs(Ω) < 1e-12)で、(MS) の直交の成分は (S) と同じ。経路 ① の 3 公転(f 1・k₁ 1)の傾きの変化は (C1) ${f3(O.C1.tiltS)}°・(C2) ${f3(O.C2.tiltS)}°(順行)、〔第350便g〕の粒子の輪(両方)は ${fe(P.both.dTiltDeg)}°。`;
  F.rv = `🛟 の率(3000 步)は見える倍率のまま ${fe(J.rotvert.main.rateBook)} /s・強さの倍で割って ${fe(J.rotvert.main.rateNeed)} /s。経路 ① の寄る速さ k₁ abs(Ω) に置いた k₁ の等価(倍で割った率)は (C1) ${rng(R.map((r) => r.C1.k1Need), f3)}・(C2) ${rng(R.map((r) => r.C2.k1Need), f3)}(見える倍率のままの数はその 1e5 倍)。源の赤道面に対する率の符号は (C2) が 🛟 と同じ・(C1) が逆(傾き 1° の順行の輪)。`;
  F.sat = `土星の環の区分の中心 5(同期軌道 ${f3(J.saturn.rSync)} R_sat の内 3・外 2)で、(S) は順行の輪の法線と逆向き(cos ${rng(S.filter((r) => r.sense === 'pro').map((r) => r.S.cos), f4)})・(M) と (MS) は同じ向き。(S) ÷ (M) は (C1) ${rng(S.filter((r) => r.read === 'C1' && r.sense === 'pro').map((r) => r.SoverM), fe)}・(C2) ${rng(S.filter((r) => r.read === 'C2' && r.sense === 'pro').map((r) => r.SoverM), fe)} —— 同期軌道の内と外で向きは入れ替わらない。`;
  return F;
}
