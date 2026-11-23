// 第350便g の文書の表(PHYSICS〔第350便g〕に逐語で載せる表と数の文 —— 正本 tests/out/diskcheck-350g.json から作る純関数)。
//   QA docs.diskcheck350g が読む。ファイルを読まない・import しない。
export const DOC_VERSION = 'w350g-diskcheckdoc-1';

/** 原文(原仮定者の整理(2026-11-23 —— 第146報)—— 言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '引きずりの形が円盤状に現れる']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '円盤引きずりの検証結果は、saturnRotVertExplore3d']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから、球体に換算して計算する']),
]);
export const READINGS = Object.freeze([
  '円盤引きずりの側の物差しは、輪(円盤状に並んだ受け手)の量で読む —— 本節は通過の輪の傾き・寄せる向き・厚みを分けて数える',
  '🛟 saturnRotVertExplore3d(第339便a —— 円盤引きずりの鉛直の型の探索用の本)の傾きの比を、軸引きずりの候補の回転と同じ表に並べる(読むだけ —— 本と鍵は変えない)',
  '場の形と回転の読みを 1 つに決め打ちせず、在位の形の列と比べる列を並べる',
  '球体に換算する読み 3 つ((C1) 2 点の差分・(C2) 球全体の剛体回転への平均・(C3) 係数 k ×(C1))を、輪の傾きに対する比で並べる(輪の直径の傾きと球全体の自転は別の量)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable(readings = READINGS) {
  const head = '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|';
  return head + '\n' + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(readings[k])} |`).join('\n');
}

/* ───────── 数の書式 ───────── */
const e2 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(3));
const f5 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(5));
const DIR = { toward: '寄せる', away: '離す', mixed: '混ざる', none: '0' };
const dj = (d) => DIR[d] || d;
const COL1 = { inPos: '在位の形(受け手の球 m 1・R 1 —— 中心の値 1.5)', k1const: '〔第348便i〕(Rk1)・W_ii 定数' };
const range = (xs) => { const v = xs.filter((x) => x !== null && x !== undefined && Number.isFinite(x)); return v.length ? [Math.min(...v), Math.max(...v)] : null; };
const rng = (xs, f = f3) => { const r = range(xs); return r ? (f(r[0]) === f(r[1]) ? f(r[0]) : f(r[0]) + '〜' + f(r[1])) : '—'; };

export function tablesOf(J) {
  const T = {};
  // 表 4 零試験
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 共通の点検の数(x の直径の 2 点の差分・6 点の平均・中心の渦度の半分 の z 成分)', `${S.cx.toFixed(8)}・${S.c6.toFixed(8)}・${S.cw.toFixed(8)}`, G.common],
      ['① 通過の向きを反転・中心線の向きの通過と相対静止・自分の重みも背景も無い・両方に同じ速度を足す(差の和)', `${e2(Math.abs(S.cFlip))}・${e2(S.cLine)}・${e2(S.cNoSelf)}・${e2(S.cGal)}`, G.common],
      ['② 剛体回転 (1,2,3) × r の 6 点の平均と x の直径(期待 (1,2,3)・(0,2,3) との差)・純粋なずれ (y,x,0) の x の直径と 6 点の平均', '< 1e-12・< 1e-12・1・0', G.rigidShear],
      ['③ 対称のずれ u = (z, 0, x) と輪 L̂ = ẑ: 輪の傾き・(C1)(x の直径)の言う傾き・(C2)(6 点の平均)', `${f3(S.shRingTilt)}・${f3(S.shRingC1)}・${e2(S.shRingC2)}`, G.ringVsSphere],
      ['④ 在位の形の回転の場と〔第348便i〕の (Rk1) の場(自分の重みの K1 の球・受け手の速度を引く)の相対の差 (C1)・(C2)', `< 1e-12・${S.vs348iC2 < 1e-4 ? '< 1e-4' : e2(S.vs348iC2)}`, G.vs348i],
      ['⑤ 通過の輪(在位の形・R_r 0.1・i 30°): (C1)・(C2)・(C2 6 点)÷ 輪の傾き/自分の重みも背景も無いときの輪の量', `${f3(S.flyC1)}・${f3(S.flyC2)}・${f3(S.flySix)}/${e2(S.flyZero)}`, G.fly],
      ['⑥ 寄せる力の受け手の速度の倍 λ についての線形(λ = −1 の直の値と 2 p(0) − p(1) の相対の差)', '< 1e-8', G.linear],
      ['⑦ 粒子の輪: 引きずり無しの 3 公転の L の向きの変化/源の回転の符号を反転した回転だけの列の引きずりの速度(和 ÷ 大きさ)', '< 1e-9°・< 1e-12', G.ring],
      ['⑧ 入力の拒否(読みの名・W_ii < 0・R_b 0・🛟 の正本の形・makeField3 の受け手)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  // 表 5 通過の輪の傾きと 3 つの読み
  T.t1 = '| 場 | W₀ | W_ii | 輪の半径 R_r | 輪の傾き i [deg] | 輪の傾き(∫ の角) | (C1) ÷ 輪 | (C2)(中心の ½∇×u)÷ 輪 | (C2)(6 点の平均)÷ 輪 | (C3 k 2/5)÷ 輪 |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.T1.map((r) => `| ${COL1[r.col]} | ${r.Wbg} | ${r.Wself === null ? '球' : r.Wself} | ${r.Rr} | ${r.inc} | ${e2(r.tilt)} | ${f3(r.vsRing.C1)} | ${f3(r.vsRing.C2)} | ${r.col === 'inPos' ? f3(r.vsRing.C2six) : '—'} | ${f3(r.vsRing.C3)} |`).join('\n');
  // 表 6 🛟 の正本の要点(読むだけ)
  { const R = J.T2.rotvert;
    T.t2a = '| 步 | 時刻(本の単位) | 目安の比 | 🛟 の比(3 群) | 鍵 OFF の写しの比(3 群) | 目安からの差の最大 | 1 からの差の最大(OFF) | 判定 |\n|---|---|---|---|---|---|---|---|\n'
      + R.rows.map((r) => `| ${r.steps} | ${f3(r.t)} | ${f3(r.guide)} | ${r.ratioOn.map(f3).join('・')} | ${r.ratioOff.map(f3).join('・')} | ${f3(Math.max(...r.onGap))} | ${f3(Math.max(...r.offGap))} | ${r.judgeOk === null ? '—' : r.judgeOk ? '目安の 5% 内' : '外'} |`).join('\n'); }
  // 表 7 🛟 の率と候補の回転の大きさ
  T.t2b = '| 区分 | r [R_sat] | 🛟 の率(目安の強さ)[1/s] | (C1) abs(Ω) [1/s] | (C1) ÷ 🛟 の率 | (C2) abs(Ω) [1/s] | (C2) ÷ 🛟 の率 | (C1) の z の奇の成分 ÷ abs(Ω)(z/r 1e-2) | (C1) の z の偶の成分(源の軸の向き)÷ abs(Ω)(z/r 1e-2) |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.T2.rows.map((r) => { const z = r.C1.z[r.C1.z.length - 1]; return `| ${r.key} | ${f3(r.r)} | ${e2(r.rateNeed)} | ${e2(r.C1.magPerS)} | ${f3(r.C1.vsRateNeed)} | ${e2(r.C2.magPerS)} | ${f3(r.C2.vsRateNeed)} | ${e2(Math.abs(z.perpOdd) / r.C1.mag0)} | ${f3(z.par / r.C1.mag0)} |`; }).join('\n');
  // 表 9 向きが入れ替わる行
  T.t3 = '| 場 | W₀ | W_ii | 候補 | 距離 d | 作用 | 向き(λ 0)| 向き(λ 1 —— 受け手の速度を引く)| 向き(λ −1 —— 逆向きの公転)| 0 < λ* ≤ 1 の高さの数 | λ* の範囲 | s/n | (s/n)* の範囲(正の側) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.T3.rows.map((r) => `| ${r.col === 'inPos' ? '在位の形' : '(Rk1)'} | ${r.Wbg} | ${r.Wself} | ${r.cand === 'P2' ? '(C1)' : '(C2)'} | ${r.d} | ${r.action} | ${dj(r.dirOff)} | ${dj(r.dirOn)}${r.swap ? '(入れ替わる)' : ''} | ${dj(r.dirRetro)} | ${r.nFlipUnit}/${r.nHeights} | ${r.lamStarMin === null ? '—' : (e2(r.lamStarMin) === e2(r.lamStarMax) ? e2(r.lamStarMin) : e2(r.lamStarMin) + '〜' + e2(r.lamStarMax))} | ${f3(r.sOverN)} | ${r.critMinPos === null ? '—' : e2(r.critMinPos) + '〜' + e2(r.critMaxPos)} |`).join('\n');
  { const S = J.T3.summary, lab = (k) => { const [c, a, b] = k.split('|'); return (c === 'inPos' ? '在位の形' : '(Rk1)') + (b === undefined ? ' ' + a : ' (' + a + ', ' + b + ')'); };
    T.t3b = '| 条件 | 行 | 入れ替わる行(λ 1) | 入れ替わる行(λ −1) |\n|---|---|---|---|\n'
      + [...S.byDen.map((x) => ['(W₀, W_ii) ' + lab(x.key), x]), ...S.byD.map((x) => ['距離 d —— ' + lab(x.key), x]), ...S.byCand.map((x) => ['候補 —— ' + lab(x.key).replace(' P2', ' (C1)').replace(' W', ' (C2)'), x]), ...S.byAction.map((x) => ['作用 —— ' + lab(x.key), x])]
        .map(([k, x]) => `| ${k} | ${x.n} | ${x.swap} | ${x.retro} |`).join('\n'); }
  // 表 10 粒子の輪
  { const NAME = { both: '両方(源の回転 + 並進)', spin: '源の回転だけ(受け手の速度を引かない)', trans: '並進だけ(源の自転 0)', off: '両方 OFF', halfStep: '両方・刻み半分', altN: '両方・粒子数 36', altPhase: '両方・初期位相 0.7' };
    T.t4 = '| 列 | 粒子数 | 1 公転の步 | ① 輪の角運動量の傾きの変化(3 公転)[deg] | ② 上下で符号が反転する復元の成分の平均 | ③ 厚み(1 公転の RMS の平均)3 公転目 ÷ 1 公転目 | ③′ 厚み(同じ位相の点)3 公転 ÷ 初め |\n|---|---|---|---|---|---|---|\n'
      + J.T4.map((r) => `| ${NAME[r.cfg]} | ${r.N} | ${r.per} | ${e2(r.dTilt)} | ${e2(r.restoreMean)} | ${f5(r.rmsMeanRatio)} | ${f5(r.rmsRatio)} |`).join('\n'); }
  // 表 11 帳簿への口
  { const CN = { rule: '在位の形(規則の半径 —— 中心の値 3/(2 Y_k))', w01: 'W_ii 0.1', noSelf: '自分の重み無し' };
    T.t5 = '| 自分の重み | 読み | 区分 | 点・corV の向き | K = 寄せる力 ÷ (z n²)(z/r 1e-6) | 点・corV の向きが変わる高さ | 帳簿の高さ ÷ 10 m(ν_z² = n²(1 + K)) | 輪・corS の向き・括り | 輪・drag90 の向き・括り |\n|---|---|---|---|---|---|---|---|---|\n'
      + J.T5.rows.map((r) => `| ${CN[r.col]} | (${r.read}) | ${r.key} | ${dj(r.dir)} | ${e2(r.K)} | ${r.HstarM === null ? '無し' : e2(r.HstarM) + ' m'} | ${r.ledgerOver10m === null ? '—' : f5(r.ledgerOver10m)} | ${r.ring.map((x) => dj(x.dir) + '・' + (x.zStarPos ? x.zStarPos.join('〜') : '括り無し')).join(' | ')} |`).join('\n'); }
  return T;
}

export function factsOf(J) {
  const F = {}, S = J.pure.scenes;
  F.common = `共通の点検の数(本節の lib で作り直した値): x の向きの直径の 2 点の差分の z 成分 ${S.cx.toFixed(8)}・直交 3 直径の 6 点の平均 ${S.c6.toFixed(8)}・中心の渦度の半分 ${S.cw.toFixed(8)}。`;
  const t1 = J.T1.filter((r) => r.col === 'inPos' && r.inc > 0), t1k = J.T1.filter((r) => r.col === 'k1const' && r.inc > 0);
  F.t1 = `通過の輪(輪の傾き > 0 の行): 在位の形の (C1) ÷ 輪 ${rng(t1.map((r) => r.vsRing.C1))}・(C2)(中心の ½∇×u)÷ 輪 ${rng(t1.map((r) => r.vsRing.C2))}・(C2)(6 点の平均)÷ 輪 ${rng(t1.map((r) => r.vsRing.C2six))}・(C3 k 2/5)÷ 輪 ${rng(t1.map((r) => r.vsRing.C3))}/〔第348便i〕(Rk1)・W_ii 定数の (C1) ÷ 輪 ${rng(t1k.map((r) => r.vsRing.C1))}・(C2) ÷ 輪 ${rng(t1k.map((r) => r.vsRing.C2))}。`;
  const R = J.T2.rotvert, last = R.rows[R.rows.length - 1], c1 = J.T2.rows.map((r) => r.C1.vsRateNeed), c2 = J.T2.rows.map((r) => r.C2.vsRateNeed);
  F.t2 = `🛟 の正本(第339便a・読むだけ): ${last.steps} 步の目安の比 ${f3(last.guide)}・🛟 の比 ${last.ratioOn.map(f3).join('・')}・鍵 OFF の写し ${last.ratioOff.map(f3).join('・')}(判定 ${last.judgeOk ? '目安の 5% 内' : '外'})・強さの倍 ${R.lambdaScale}・帯の倍 ${R.rdScale}・鍵の既定 ${R.inDefault ? 'ON' : 'OFF'}。在位の形の候補の回転の大きさ ÷ 🛟 の率(目安の強さ —— 倍で割った値)は (C1) ${rng(c1, e2)}・(C2) ${rng(c2, e2)}(区分 5)。`;
  const s3 = J.T3.summary, inPos = J.T3.rows.filter((r) => r.col === 'inPos');
  F.t3 = `向きが入れ替わる行: (Rk1) の行で受け手の速度を引くと向きが入れ替わる行 ${s3.k1Swap}/${s3.k1N}(〔第348便i〕の正本の 25/48 と同じ数え方 —— 本節で作り直した値)・W₀ + W_ii = 0 の行 ${s3.byDen.find((x) => x.key === 'k1|0|0').swap}/${s3.byDen.find((x) => x.key === 'k1|0|0').n}・在位の形の行 ${inPos.filter((r) => r.swap).length}/${inPos.length}・逆向きの公転(λ −1)で入れ替わる行 ${J.T3.rows.filter((r) => r.swapRetro).length}/${J.T3.rows.length}・寄せる力の λ の一次式からの外れの最大(相対)${s3.linMax < 1e-8 ? '< 1e-8' : e2(s3.linMax)}。`;
  const g = (c) => J.T4.find((r) => r.cfg === c);
  F.t4 = `粒子の輪(3 公転): 輪の角運動量の傾きの変化 両方 ${e2(g('both').dTilt)}°・源の回転だけ ${e2(g('spin').dTilt)}°・並進だけ ${e2(g('trans').dTilt)}°・両方 OFF ${e2(g('off').dTilt)}°/厚み(1 公転の RMS の平均)の比 両方 ${f5(g('both').rmsMeanRatio)}・源の回転だけ ${f5(g('spin').rmsMeanRatio)}・並進だけ ${f5(g('trans').rmsMeanRatio)}・両方 OFF ${f5(g('off').rmsMeanRatio)}/刻み半分の傾きの変化 ${e2(g('halfStep').dTilt)}°。`;
  const t5 = J.T5.rows, nz = t5.filter((r) => r.HstarM !== null).length, nr = t5.reduce((s, r) => s + r.ring.filter((x) => x.zStarPos).length, 0);
  F.t5 = `帳簿への口: 点・corV の向きが変わる高さが出た行 ${nz}/${t5.length}・輪の受け手の括り ${nr}/${t5.length * 2}・帳簿の高さ ÷ 10 m は在位の形 ${rng(t5.filter((r) => r.col === 'rule').map((r) => r.ledgerOver10m), f5)}・W_ii 0.1 ${rng(t5.filter((r) => r.col === 'w01').map((r) => r.ledgerOver10m), f5)}・自分の重み無し ${rng(t5.filter((r) => r.col === 'noSelf').map((r) => r.ledgerOver10m), f5)}(在位の形の自分の重みの中心の値 ${e2(J.T5.Wrule)} —— 土星の単位)。`;
  return F;
}

/** 🛟 の型と軸引きずりの候補の回転の関係(事実の表 —— 当たる所・当たらない所) */
export const CONTRAST = Object.freeze([
  Object.freeze(['何に働くか', '粒子の位置(高さ)の速度 —— 帯の内で d = −λ r (s z/ρ) k̂(第339便a のアプリの鉛直の型)', '受け手の向き(自転軸・輪の面の向き)の回転 —— 位置は動かさない', '当たらない']),
  Object.freeze(['z の偶奇', 'z の奇(帯の内で z に比例 —— 上下で符号が反転)', '源の軸の向きの成分は z の偶・直交の成分は z の奇(z/r に比例 —— 表 6)', '直交の成分だけ当たる']),
  Object.freeze(['形への効き', '高さが減る(傾きの比が目安の率で減る —— 表 5)', '回転は輪の形を変えない(剛体の回転 —— 輪を傾けるか、面の向きを回す)。厚みの変化は表 10 の別の結果', '当たらない']),
  Object.freeze(['赤道面へ寄せる向き', '寄せる(帯の内)', '(C2) の点・corV は区分 5 とも寄せる・(C1) の点・corV は 0(表 11)', '(C2) の点・corV だけ当たる']),
  Object.freeze(['強さ', '見えるように強さ 1e5 倍・帯の半幅 2e6 倍(本の宣言)', '在位の形の値(表 6 —— 🛟 の率を倍で割った値との比)', '比べる列(合わせない)']),
  Object.freeze(['🛟 の達の意味', '3000 步の傾きの比が目安の 5% 内(第339便a の判定)', '軸引きずり・ジャイロトルクの型を採ることを意味しない', '—']),
]);
export function contrastTable() {
  return '| 項 | 🛟 saturnRotVertExplore3d(円盤引きずりの鉛直の型) | 軸引きずりの候補の回転(在位の形の場) | 当たる所 |\n|---|---|---|---|\n' + CONTRAST.map((r) => '| ' + r.join(' | ') + ' |').join('\n');
}
/** 場と読みの表(本節の式) */
export const FIELD_ROWS = Object.freeze([
  Object.freeze(['場', 'u(x) = [Σ_j W_j(x)(V_j − v_i) + Σ_j T_j(x)] ÷ (W₀ + W_ii(x) + Σ_j W_j(x))(枝 h の lib の makeField3 —— 既定の引数が在位の形)', '〔第348便h〕']),
  Object.freeze(['在位の形', 'K1 の核・源の回転は球のモーメント(M1 = R²/(5r²))・背景 0・自分の重みを分母に・受け手の速度を引く', '〔第348便h〕〔第348便i〕(Rk1)']),
  Object.freeze(['(C1)', '2 点の差分 ê × (u(x + R_b ê) − u(x − R_b ê)) ÷ (2R_b)(ê = 源の向き —— 原文の「源に近い点と遠い点」)', '〔第347便h〕(P2)']),
  Object.freeze(['(C2)', '球全体の剛体回転への平均 —— 一次の値として中心の ½∇×u(枝 h の rot3 の (W))と、直交 3 直径の 6 点の平均を並べる', '〔第347便h〕(W)・(P6)']),
  Object.freeze(['(C3)', '係数 k ×(C1)(k = 2/5)', '本節']),
  Object.freeze(['輪の傾き', '輪の点の法線の向きの運ばれる量 δ_k の方位の一次の成分(〔第348便i〕の flyRing3 と同じ道と分け方)', '〔第348便d〕〔第348便i〕']),
]);
export function fieldTable() {
  return '| 項 | 本節の式・読み | 出どころの節 |\n|---|---|---|\n' + FIELD_ROWS.map((r) => '| ' + r.join(' | ') + ' |').join('\n');
}
