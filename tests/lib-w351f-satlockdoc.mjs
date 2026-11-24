// 第351便f(原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R432):
// **正本 tests/out/satlock-351f.json から PHYSICS〔第351便f〕の表を作る文書の lib**
// (QA docs.satlock351f が節の表と逐語で照合する —— 大きさと率は有効数字 3 桁・cos は小数 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と統括の読みもここに持つ。
export const DOC_VERSION = 'w351f-satlockdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => { if (x === null || x === undefined || !Number.isFinite(x)) return '—'; const s = Number(x).toFixed(3); return s === '-0.000' ? '0.000' : s; };
const NM = Object.freeze({ Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン', Earth: '地球', Jupiter: '木星', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)' });
const COL = Object.freeze({ a: '(ア)', i: '(イ)', u: '(ウ)' });
const ROT = Object.freeze({ M: '球のモーメント(在位の形)', q0: '落ち方なし(源の枠の剛体の回転)' });
const SPD = Object.freeze({ src: '源の質量だけ', pair: '2 体の和' });
const SPIN = Object.freeze({ decl: '宣言の自転の率', sync: '場の平均運動 v ÷ a に置く', frame: '源に固定して回る座標系(相対の速度 0・源の自転 0)' });
const PART = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)', A: '列 A の合計' });

/** 原文(言葉を変えずに引く —— 公開の節に在る文) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1001: Aで進める。主要衛星は潮汐ロックしている']),
  Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', '潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— 第138報の回答 4)', 'イオは潮汐ロックしているので、内部熱の検証用']),
  Object.freeze(['原仮定者の補足(2026-11-12 —— 第136報)', '互いに潮汐ロックしている連星は、『距離の変化による並進引きずり』以外の、相互の引きずりが消える。ただし、遠方宇宙に対する慣性移動は消えないので、互いに周回する']),
  Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', '互いに潮汐ロックしていると、どちらかを基準にした座標系では、距離以外の引きずりが消え、遠方宇宙が回転している。遠方宇宙基準の通常の慣性系では、互いを自転速度で回す引きずりとなる']),
  Object.freeze(['原仮定者の補足(2026-11-18 —— 第141報)', '冥王星は、太陽から遠く、斜め軌道で赤道面から離れる期間が長く、カロンと互いに潮汐ロックしている。冥王星とカロンは、引きずりの影響が少ない、理想的な連星']),
  Object.freeze(['原仮定者の補足(2026-11-15 —— 第138報の補足 5)', 'AN719 の比べる相手について、フォボスや主要衛星は元々潮汐ロックされているので、軸引きずりでの比較に意味が薄い']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['衛星には母天体由来の項を入れる列 A(サンプルの中の源の全部)が主。銀河と太陽の 2 項だけの列 B は比べる列。潮汐ロックは観測の事実として置く(積分でロックを作らない)—— 比べる自転を道の法線・平均運動に置く (ア) が主', '表 1・表 2']),
  Object.freeze(['恒久の定義(題の条件)。本節は「上回っている」の当否を判じない —— ロックを保つ潮汐のトルクの桁(公開の lib に在る式だけ)と軸引きずりの直交成分のトルクの比の数だけを置く', '表 3']),
  Object.freeze(['イオは熱の側の相手(エネルギー・熱は本便の第 2 段の枝 g)。本節は由来と比だけを数え、熱は持たない', '表 1・表 3']),
  Object.freeze(['「消える」を、受け手の中心での相対の速度の項(源の枠の速度と相対の公転の速度の差)と、自転軸を動かす直交成分 Ω⊥ の 2 つで読む。残る平行成分は「遠方宇宙に対する慣性移動」の側か、を並べて読む所(決めない)', '表 4']),
  Object.freeze(['同じ状態の 2 つの読み(題の条件)。源に固定して回る座標系の読み(相対の速度 0・源の自転 0)と、慣性系の読み(源の枠の剛体の回転の形で残る平行成分)を同じ表に置く', '表 4']),
  Object.freeze(['冥王星–カロンは互いにロックした連星の場面。カロン → 冥王星の逆の組は第351便c の作り(相対の速さは源の質量だけ —— 2 体の和は比べる列)', '表 1・表 4']),
  Object.freeze(['衛星の歳差・自転を、主星にロックしていない天体と同じ物差しで比べない(本節の数は成績ではない)。月の比べる数は軌道の交点の率で、自転軸の当てはめから外す列が主', '表 5']),
]);
export function originalTable(readings = READINGS) {
  const rows = ['| # | 出どころ | 原文 | 統括の読み | 数えた所 |', '|---|---|---|---|---|'];
  ORIGINAL.forEach(([src, o], k) => rows.push(`| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`));
  return rows.join('\n');
}
/** 3 列の定義の表 */
export const LOCK_TABLE = ['| 列 | 自転軸 ŝ | トルクの式の自転速度 ω_T ÷ 角運動量の自転速度 ω_L | 平行成分 Ω∥(引きずり回転) | 経度のずれの率(母天体の向きに対する) |', '|---|---|---|---|---|',
  '| (ア) 観測の事実として比べる自転を道の法線・平均運動に置く(主) | 道の法線 n̂ | 1(ω = 宣言の公転の平均運動) | 記録(ロックからのずれ Ω∥ ÷ n_orb) | Ω·n̂ |',
  '| (イ) ロックの拘束つき | 宣言の自転軸 | 1(自転の率を平均運動に保つ) | 記録だけ —— 慣性回転へは積まない | 0(拘束) |',
  '| (ウ) 自由軸(惑星と同じ扱い) | 宣言の自転軸 | 1 + Ω∥ ÷ ω_spin(〔第350便c〕の (S1)) | トルクの式の自転速度に入る | (ω_spin − n_orb) + Ω∥ |'].join('\n');

const pn = (id, src) => `${NM[id]} | ${NM[src]}`;
export function tablesOf(J) {
  const T = {};
  // 表 1: 由来の成分((C2)・分母 out)
  { const rows = ['| 天体 | 母天体 | 傾き ε(°) | 母天体由来 (M)・(S)・(MS) ″/年(cos) | 太陽由来 (M)・(S)・(MS) ″/年(cos) | 母天体 ÷ 太陽: (M)・(S)・(MS) | (W) の (MS) の比 | 〔第350便e〕の比(2 点の差分の読み・分母 in) |', '|---|---|---|---|---|---|---|---|'];
    for (const r of J.origin) { const c = r.C2, g = (o) => ['M', 'S', 'MS'].map((p) => `${fe(o[p].mag)}(${f3(o[p].cos)})`).join('・');
      rows.push(`| ${pn(r.id, r.src)} | ${f3(r.epsDeg)} | ${g(c.parent)} | ${g(c.sun)} | ${['M', 'S', 'MS'].map((p) => fe(c.ratio[p])).join('・')} | ${fe(r.W.ratio.MS)} | ${r.e350 ? fe(r.e350.p2) : '—'} |`); }
    T.t1 = rows.join('\n'); }
  { const rows = ['| 天体 | 母天体 | 背景(倍率 1・向き −1)″/年・cos | 列 A ″/年・cos | 列 B ″/年・cos | 列 B の太陽由来 (MS) ″/年 | 2 体の和の (M) ″/年 | 2 体の和 ÷ 源の質量だけ((M)) |', '|---|---|---|---|---|---|---|---|'];
    for (const r of J.origin) { const c = r.C2; rows.push(`| ${pn(r.id, r.src)} | ${fe(c.bg.mag)}・${f3(c.bg.cos)} | ${fe(c.A.mag)}・${f3(c.A.cos)} | ${fe(c.B.mag)}・${f3(c.B.cos)} | ${fe(c.sunB.mag)} | ${fe(c.pairM.mag)} | ${f3(c.pairM.mag / c.parent.M.mag)} |`); }
    T.t1col = rows.join('\n'); }
  { const rows = ['| 受け手 | 源 | 受け手の質量 kg | 源の質量 kg | 距離 a m | v_orb m/s | n(場 —— 源の質量だけ)rad/s | n(2 体の和)rad/s | n(宣言の公転)rad/s | 場 ÷ 宣言 | 2 体の和 ÷ 宣言 | 自転の率の出どころ |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.make) rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${fe(r.m)} | ${fe(r.Ms)} | ${fe(r.a)} | ${fe(r.vOrb)} | ${fe(r.nField)} | ${fe(r.nPair)} | ${fe(r.nDecl)} | ${f3(r.fieldOverDecl)} | ${f3(r.pairOverDecl)} | ${r.spinFrom} |`);
    T.t1make = rows.join('\n'); }
  // 表 2: 3 列(列 A の Ω)
  { const rows = ['| 天体 | 母天体 | 列 | ŝ と道の法線の角(°) | 経路 ① abs(dŝ/dt) ″/年 | 経路 ② の歳差の率 ″/年 | 起こす率 ″/年 | ω_T ÷ ω_L − 1 | Ω∥ ÷ n_orb | 経度のずれの率 ÷ n_orb | 道の面の中の成分 ÷ n_orb | 列 B の経路 ① ″/年 |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.lock) rows.push(`| ${pn(r.id, r.src)} | ${COL[r.col]} | ${f3(r.epsDeg)} | ${fe(r.path1)} | ${fe(r.precRate)} | ${fe(r.raise)} | ${fe(r.ratioM1)} | ${fe(r.parOverN)} | ${fe(r.lonOverN)} | ${fe(r.inPlaneOverN)} | ${fe(r.path1B)} |`);
    T.t2 = rows.join('\n'); }
  // 表 3: トルクの比
  { const rows = ['| 天体 | 潮汐の相手 | 成分 | abs(Ω⊥) ″/年 | N_ax = I ω_T abs(Ω⊥) N·m | N_tide(係数 1)N·m | 比 N_tide ÷ N_ax | 比(係数 1.5 k₂/Q) | 比が 1 になる (B − A) ÷ C | 比 > 1(係数 1・1.5 k₂/Q) |', '|---|---|---|---|---|---|---|---|---|---|'];
    const yn = (v) => (v === null ? '—(Ω⊥ 0)' : v ? '越える' : '越えない');
    for (const r of J.torque) rows.push(`| ${NM[r.id]} | ${NM[r.partner]} | ${PART[r.part]} | ${fe(r.perpAsYr)} | ${fe(r.Nax)} | ${fe(r.Ntide)} | ${fe(r.rTide)} | ${fe(r.rTideK)} | ${fe(r.baNeed)} | ${yn(r.over1)}・${yn(r.over1K)} |`);
    T.t3 = rows.join('\n'); }
  // 表 4: 互いにロックした連星
  { const rows = ['| 受け手 | 源 | 源の回転の形 | 相対の速さ | 源の自転 | 受け手の中心の速度の残り abs(1 − ω_s a ÷ v) | (M) ″/年 | (S) ″/年 | (MS) ″/年 | (MS) ÷ (M) | (MS) の Ω∥ ″/年 | (MS) の Ω⊥ ″/年 | (W) の (MS) ÷ (w ÷ W) ω_s |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.mutual) rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${ROT[r.rot]} | ${SPD[r.speed]} | ${SPIN[r.spin]} | ${fe(r.resid)} | ${fe(r.M)} | ${fe(r.S)} | ${fe(r.MS)} | ${f3(r.MSoverM)} | ${fe(r.parMS)} | ${fe(r.perpMS)} | ${f3(r.wMSoverRigid)} |`);
    T.t4 = rows.join('\n'); }
  // 表 5: 比べる数の印
  { const rows = ['| 天体 | 母天体 | 比べる数 | 扱い | 作った値 |', '|---|---|---|---|---|'];
    for (const r of J.compare) rows.push(`| ${pn(r.id, r.src)} | ${r.cmp === null ? '—' : r.cmp} | ${r.role} | なし |`);
    T.t5 = rows.join('\n'); }
  // 表 6: 零試験
  { const S = J.pure.scenes, G = J.pure.gates, ok = (k) => (G[k] ? '真' : '偽'), c = S.common, lt = (v, t) => (v === 0 ? '0' : v < t ? '< ' + t.toExponential(0) : fe(v));
    const rows = ['| # | 試験 | 数 | 門 |', '|---|---|---|---|',
      `| ① | 源の回転の形つきの口 \`partRotF\` の球のモーメントは第351便c の \`partRot\` と同じ(衛星 5 組 × 成分 3 × 読み 2・相対差) | ${lt(S.vsC, 1e-12)} | ${ok('sameAsC')} |`,
      `| ② | 落ち方なしの (MS)((W))は第348便h の \`srcRot3\`(K1rQ0)と同じ(冥王星–カロン・イオ) | ${lt(S.q0, 1e-12)} | ${ok('q0AsSrcRot3')} |`,
      `| ③ | 列 A = 背景 + 太陽由来 + 母天体由来・列 B の太陽由来は分母に母天体を入れない(イオ) | ${lt(Math.max(S.sumA, S.bSun), 1e-12)} | ${ok('colSum')} |`,
      `| ④ | 〔第350便e〕の母天体由来 ÷ 太陽由来(イオ・2 点の差分の読み・分母 in) | ${S.io350e.toExponential(2)} | ${ok('io350e')} |`,
      `| ⑤ | 2 体の和の (M) ÷ (M) ÷ √((M_源 + m) ÷ M_源) − 1(カロン–冥王星) | ${lt(S.lin, 1e-12)} | ${ok('pairLinear')} |`,
      `| ⑥ | 2 体の和の平均運動 ÷ 宣言の公転 − 1(冥王星–カロン・カロン–冥王星)/場の平均運動 ÷ 宣言 | ${fe(S.pairVsDecl[0])}・${fe(S.pairVsDecl[1])}/${f3(S.fieldOverDecl[0])}・${f3(S.fieldOverDecl[1])} | ${ok('pairMean')} |`,
      `| ⑦ | 質量の比 M_カロン ÷ M_冥王星(第348便c)と重力定数の比(〔第343便g〕のリポジトリの中の値 —— 文献の値・未照合) | ${S.qMass.toFixed(4)}・${S.qGM.toFixed(4)} | ${ok('massRatio')} |`,
      `| ⑧ | 落ち方なし・源の自転を場の平均運動に置く: 受け手の中心の速度の残り・(W) の (MS) ÷ (w ÷ W) ω_s − 1 | ${lt(S.resid0, 1e-12)}・${lt(S.rigid, 1e-9)} | ${ok('rigidSync')} |`,
      `| ⑨ | 球のモーメントでは同じ置き方でも (MS) ÷ (M) = 1((S) は (M) の 1e-20 の桁) | ${f3(S.noCancelM)} | ${ok('noCancelM')} |`,
      `| ⑩ | 3 列(イオ): (ア) と (イ) の Ω⊥ が同じ・(イ) の経度のずれの率 0・(ウ) の ω_T ÷ ω_L − 1 = Ω∥ ÷ ω_spin・経路 ① と ② の大きさが同じ | ${Object.values(S.cols).filter(Boolean).length}/4 | ${ok('lockCols')} |`,
      `| ⑪ | 月(ŝ と道の法線の角 ${S.moon.eps.toFixed(3)}°): (イ) は起こす率が書ける・(ア) は ŝ = 道の法線で書かない | ${S.moon.raiseI && S.moon.raiseA ? '真・真' : '偽'} | ${ok('moonRaise')} |`,
      `| ⑫ | 潮汐の物差し: 〔第337便c〕の bodyRow の N_tide と G M_p² R⁵ ÷ a⁶(月) | ${lt(S.ntide, 1e-12)} | ${ok('tideRuler')} |`,
      `| ⑬ | 第350便までの共通の点検の数(自転しない源の通過) | ${c.diaXz.toFixed(8)}・${c.sixZ.toFixed(8)}・${c.rotWz.toFixed(8)} | ${ok('common350')} |`,
      `| ⑭ | 入力の拒否(成分・源の回転の形・読み・extraW < 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${ok('rejects')} |`];
    T.t6 = rows.join('\n'); }
  return T;
}
export function factsOf(J) {
  const F = {}, o = (id, src) => J.origin.find((r) => r.id === id && r.src === src), io = o('Io', 'Jupiter'), mo = o('Moon', 'EarthHi'), pc = o('Pluto', 'Charon'), cp = o('Charon', 'Pluto');
  F.ratio = `母天体由来 ÷ 太陽由来(主の読み (C2)・(MS)): 月 ${fe(mo.C2.ratio.MS)}・イオ ${fe(io.C2.ratio.MS)}・冥王星(源 カロン)${fe(pc.C2.ratio.MS)}・カロン(源 冥王星)${fe(cp.C2.ratio.MS)}。イオの成分ごとでは (M) ${fe(io.C2.ratio.M)}・(S) ${fe(io.C2.ratio.S)}、〔第350便e〕の数(2 点の差分の読み・分母 in)は ${fe(io.e350.p2)}。`;
  F.cols = `列 A と列 B の大きさ(″/年): イオ ${fe(io.C2.A.mag)}・${fe(io.C2.B.mag)}(cos ${f3(io.C2.A.cos)}・${f3(io.C2.B.cos)})、月 ${fe(mo.C2.A.mag)}・${fe(mo.C2.B.mag)}、冥王星 ${fe(pc.C2.A.mag)}・${fe(pc.C2.B.mag)}、カロン ${fe(cp.C2.A.mag)}・${fe(cp.C2.B.mag)}。`;
  const mk = J.make, mp = mk.find((r) => r.id === 'Pluto'), mc = mk.find((r) => r.id === 'Charon');
  F.make = `場の平均運動 v ÷ a ÷ 宣言の公転の平均運動は 冥王星–カロン ${f3(mp.fieldOverDecl)}・カロン–冥王星 ${f3(mc.fieldOverDecl)}(相対の速さが源の質量だけ)、2 体の和では ${f3(mp.pairOverDecl)}・${f3(mc.pairOverDecl)}。`;
  const lk = (id, src, col) => J.lock.find((r) => r.id === id && r.src === src && r.col === col), ma = lk('Moon', 'EarthHi', 'a'), mi = lk('Moon', 'EarthHi', 'i'), iu = lk('Io', 'Jupiter', 'u');
  F.lock = `月(傾きの最大の位相): 経路 ① は (ア) ${fe(ma.path1)}・(イ) ${fe(mi.path1)}″/年、起こす率は (イ)(ウ) で ${fe(mi.raise)}″/年、Ω∥ ÷ n_orb は ${fe(mi.parOverN)}。イオの (ウ) の ω_T ÷ ω_L − 1 は ${fe(iu.ratioM1)}。同期の宣言の組(イオ・冥王星・カロン)は (ア) と (イ) が同じ数。`;
  const tq = (id, part) => J.torque.find((r) => r.id === id && r.part === part), tA = ['Moon', 'Io', 'Pluto', 'Charon'].map((id) => tq(id, 'A'));
  F.torque = `列 A の合計の Ω⊥ での比 N_tide ÷ N_ax(係数 1・1.5 k₂/Q): ${tA.map((r) => `${NM[r.id]} ${fe(r.rTide)}・${fe(r.rTideK)}`).join('/')}。比が 1 になる (B − A) ÷ C は ${tA.map((r) => `${NM[r.id]} ${fe(r.baNeed)}`).join('・')}。母天体由来だけの Ω⊥ はイオ・冥王星・カロンで 0(同期の宣言 —— 自転軸 = 道の法線で (M) の向きも道の法線)。`;
  const mu = (id, rot, speed, spin) => J.mutual.find((r) => r.id === id && r.rot === rot && r.speed === speed && r.spin === spin), q = mu('Charon', 'q0', 'src', 'sync'), m = mu('Charon', 'M', 'src', 'sync'), fr = mu('Charon', 'q0', 'src', 'frame');
  F.mutual = `カロン(源 冥王星)・源の自転を場の平均運動に置く: 落ち方なしで (M) ${fe(q.M)}・(S) ${fe(q.S)}・(MS) ${fe(q.MS)}″/年((MS) ÷ (M) = ${f3(q.MSoverM)}・Ω⊥ ${fe(q.perpMS)})、球のモーメントで (MS) ÷ (M) = ${f3(m.MSoverM)}、源に固定して回る座標系の読みで (MS) ${fe(fr.MS)}。`;
  const a = J.pure.scenes.common;
  F.anchor = `共通の点検の数(本節の lib で出た値): 自転しない源の通過 ${a.diaXz.toFixed(8)}・${a.sixZ.toFixed(8)}・${a.rotWz.toFixed(8)}。`;
  return F;
}
