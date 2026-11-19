// 第338便b(原仮定者の回答(2026-11-15 —— 第138報の回答 5)・原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R350): **正本 tests/out/bevelknob-338b.json から PHYSICS〔第338便b〕の表を作る文書の lib**
// (QA docs.bevelknob338b が節の表と逐語で照合する —— 数は有効数字 3 桁の指数・角は小数 2 桁・正本で 0 と書いた量〔尺度 × 1e-12 より小さい丸めの残り〕は「0」)。
export const DOC_VERSION = 'w338b-bevelknobdoc-2';   // 第343便f: 「軸方向で弱くなる」と (iii) の「減速しない」を 3 値の文字で(真偽の正本も読める)
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const j3 = (x) => (typeof x === 'string' ? x : tf(x));   // 第343便f: 3 値の文字(正・負・未解決・解析の 0)はそのまま
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const NM = Object.freeze({ mercury: '水星', venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星',
  moon: '月', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン(逆行)' });
const KN = Object.freeze({ q0: 'q 0(= 2 倍角の則)', 'q0.25': 'q 0.25', 'q0.5': 'q 0.5', 'q0.75': 'q 0.75', q1: 'q 1(= ⑪)', p0: 'p 0(= 2 倍角の則)', p1: 'p 1(全体に cos)', p2: 'p 2(全体に cos²)' });
const COL = Object.freeze({ A: '列 A f(α_e − 1)', B: '列 B f', Bp: '列 B′ α f(1 − f)' });
const KIND = Object.freeze({ zeroNode: '零点合わせ', finitePair: '有限の 2 項の拮抗' });
const cell = (c) => (c.ang === null ? `—(強さ 0 —— 極限 ${f2(c.limit)}°)` : `${f2(c.ang)}°・${f3(c.mag)}`);
const fr = (x) => (x < 1e-6 ? fe(x) : x.toFixed(13));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① q 0 と 2 倍角の則(半回転)の差・どの q も 45° で 90° と強さ 1 からの差・赤道の 180° からの差 | ${fe(S.knob.q0)}・${fe(S.knob.mid)}・${fe(S.knob.eq)} | ${tf(G.knob)} |`,
    `| ② 軸の方向の極限の向き: q 1 の数(仰角 90° − 1e-6°)・閉じた形 arctan(1/√2)・q 0.5 の閉じた形 | ${f2(S.pole.q1num)}°・${f2(S.pole.q1closed)}°・${f2(S.pole.q05)}° | ${tf(G.pole)} |`,
    `| ③ 列 A・列 B と第337便l の振幅(ampOf)の差・列 B′ が全域で逆の側・列 B′ の f ½ の値 | ${fe(S.cols.dA)}・${fe(S.cols.dB)}・${tf(S.cols.bpPos)}・${f3(S.cols.bpMax)} | ${tf(G.cols)} |`,
    `| ④ 120°: 等しい大きさのベクトル和・比 0.1 のベクトル和・比 0.1 の今の規則・境目を比で動かす型の比 1 の境目 | ${f4(S.rule.eq)}・${f4(S.rule.tenth)}・${f4(S.rule.tenthII)}・${f2(S.rule.bnd)}° | ${tf(G.rule)} |`,
    `| ⑤ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t2Q = ['| 仰角 el [°] | ' + D.qGrid.map((q) => `q ${q}(μ ${f3(Math.pow(2, q / 2))}): 角・強さ`).join(' | ') + ' |', '|---|' + D.qGrid.map(() => '---|').join(''),
    ...t2.rows.map((r) => `| ${r.elDeg} | ` + D.qGrid.map((q) => cell(r.q[q])).join(' | ') + ' |')].join('\n');
  T.t2P = ['| 仰角 el [°] | ' + D.pGrid.map((p) => `p ${p}: 角・強さ`).join(' | ') + ' |', '|---|' + D.pGrid.map(() => '---|').join(''),
    ...t2.rows.map((r) => `| ${r.elDeg} | ` + D.pGrid.map((p) => cell(r.p[p])).join(' | ') + ' |')].join('\n');
  T.t2Judge = ['| 候補 | 赤道: 角(種類) | 45°: 角(種類)・強さ | 軸の方向: 角(種類 —— 強さ 0 なら極限) | 軸の方向の強さ ÷ 赤道の強さ | 軸方向で弱くなる |', '|---|---|---|---|---|---|',
    ...Object.entries(t2.judge).map(([k, j]) => `| ${KN[k]} | ${f2(j.eqAng)}°(${j.eqKind}) | ${f2(j.midAng)}°(${j.midKind})・${f3(j.midMag)} | ${f2(j.poleAng)}°(${j.poleKind}) | ${fe(j.weakRatio)} | ${j3(j.weak)} |`)].join('\n');
  T.t2Place = ['| 仰角 el [°] | 差分の読みの逆回転の分 \\|−s⊥\\| ÷ s(= cos el) | 回転引きずりの高さの型 U(el)/U(0): ball・src・lor2(r/R_d 2) | q 0・q 0.5・q 1: 逆回転の分 ÷ s | q 0・q 0.5・q 1: 順回転の分 ÷ (s sin el) | p 1・p 2: 逆回転の分 ÷ s | p 1・p 2: 順回転の分 ÷ (s sin el) |', '|---|---|---|---|---|---|---|',
    ...t2.placement.map((r) => `| ${r.elDeg} | ${f3(r.diffPerp)} | ${D.profiles.map((p) => f3(r.rot[p])).join('・')} | ${[0, 0.5, 1].map((q) => f3(r.q[q].perp)).join('・')} | ${[0, 0.5, 1].map((q) => f3(r.q[q].parFactor)).join('・')} | ${[1, 2].map((p) => f3(r.p[p].perp)).join('・')} | ${[1, 2].map((p) => f3(r.p[p].parFactor)).join('・')} |`)].join('\n');
  T.t2PlaceJudge = ['| 候補 | μ | 逆回転の分と差分の読み(cos el)の最大の差 | 順回転の分の落ち方(÷ 赤道の値)と回転引きずりの高さの型 ball の最大の差(el < 90°) |', '|---|---|---|---|',
    ...Object.entries(t2.placementJudge).map(([k, j]) => `| ${KN[k]} | ${f3(j.mu)} | ${fe(j.perpDev)} | ${fe(j.parDevBall)} |`)].join('\n');
  const KS = ['q0', 'q0.5', 'q1', 'p1', 'p2'];
  T.t2Planets = ['| 惑星 | 太陽の赤道面に対する傾き [°] | 軌道の平均の向きの因子(源の軸の向きの成分): ' + KS.map((k) => KN[k]).join('・') + ' | q 1 − q 0 |', '|---|---|---|---|',
    ...t2.read.planets.map((p) => `| ${NM[p.key]} | ${f2(p.iSunDeg)} | ${KS.map((k) => f4(p.dir[k])).join('・')} | ${fe(p.dir.q1 - p.dir.q0)} |`)].join('\n');
  T.t2Moons = ['| 衛星 | 主星の赤道面に対する傾き [°] | 軌道の平均の向きの因子: ' + KS.map((k) => KN[k]).join('・') + ' | q 1 − q 0 |', '|---|---|---|---|',
    ...t2.read.moons.map((p) => `| ${NM[p.key]} | ${f2(p.iDeg)} | ${KS.map((k) => f4(p.dir[k])).join('・')} | ${fe(p.dir.q1 - p.dir.q0)} |`)].join('\n');
  T.t2Galaxy = ['| q | 銀河 → 太陽系(仰角 ' + fe(t2.read.galaxy.elDeg) + '°)の向きの銀河の軸からの角 [°] | 今の太陽系の 120° に要る源の仰角 [°] |', '|---|---|---|',
    ...t2.read.galaxy.rows.map((r) => `| ${r.q} | ${f2(r.angSun)} | ${f2(r.el120)} |`)].join('\n');
  T.t2Venus = ['| ノブ | 振幅 | 因子 P(金星の軌道の平均) | 根の数 | 根 f(読み) |', '|---|---|---|---|---|',
    ...t2.read.venus.map((v) => `| ${KN[v.knob]} | ${v.amp === 'signed' ? '符号つき f(α_e − 1)' : '取り分 f'} | ${f4(v.P)} | ${v.nRoots} | ${v.roots.map((r) => fr(r.f) + '(' + KIND[r.kind] + ')').join('・')} |`)].join('\n');
  T.t2Tilt = ['| 受け手の仰角 el [°] | 受け手の自転の軸の源の軸からの傾き ε [°] | h_q の受け手の軸の向きの成分 ÷ s: ' + D.qGrid.map((q) => 'q ' + q).join('・') + ' | p 1 | q の振れ幅 |', '|---|---|---|---|---|',
    ...t2.tilt.map((r) => `| ${r.elDeg} | ${r.epsDeg} | ${D.qGrid.map((q) => f3(r.q[q])).join('・')} | ${f3(r.p1)} | ${f3(r.spreadQ)} |`)].join('\n');
  T.t3Planets = ['| 惑星 | 取り分 f | 太陽の項 [rad/s]: 列 A・列 B・列 B′ | 符号(+ = 太陽の自転と同じ向き): 列 A・B・B′ | 列 A・列 B と第337便l の planetRows の差 |', '|---|---|---|---|---|',
    ...t3.bodies.planets.map((p) => `| ${NM[p.key]} | ${f3(p.f)} | ${fe(p.term.A)}・${fe(p.term.B)}・${fe(p.term.Bp)} | ${sg(p.sign.A)}・${sg(p.sign.B)}・${sg(p.sign.Bp)} | ${fe(p.bodyA)}・${fe(p.bodyB)} |`)].join('\n');
  T.t3Moons = ['| 衛星 | 主星 | 取り分 f(主星 ÷ 主星 + 太陽 + W₀) | 主星の項 ÷ 主星の自転: 列 A・列 B・列 B′ | 符号: 列 A・B・B′ |', '|---|---|---|---|---|',
    ...t3.bodies.moons.map((m) => `| ${NM[m.key]} | ${NM[m.host] || m.host} | ${f3(m.f)} | ${fe(m.rel.A)}・${fe(m.rel.B)}・${fe(m.rel.Bp)} | ${sg(m.sign.A)}・${sg(m.sign.B)}・${sg(m.sign.Bp)} |`)].join('\n');
  T.t3Venus = ['| 列 | 根 f | 読み(\\|背景の項\\| ÷ (\\|P s☉ (ŝ☉·n̂)\\| f)) | W₀ | 太陽の項・背景の項 [rad/s] | 黄道の北の成分 | 金星の自転の軸の成分 ÷ (\\|太陽\\| + \\|背景\\|) | 自転の軸に垂直な 2 成分の大きさ ÷ (\\|太陽\\| + \\|背景\\|) | この列で金星の平均の半長軸の f(' + f3(t3.venus[0].fVenus) + ')に固定したら要る背景の倍 | f 0.5 に固定したら要る倍 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...t3.venus.flatMap((v) => v.roots.map((r) => `| ${COL[v.col]} | ${fr(r.f)} | ${KIND[r.kind]}(${fe(r.kindRatio)}) | ${fe(r.W0)} | ${fe(r.sun)}・${fe(r.bg)} | ${fe(r.north)} | ${fe(r.alongSpinRel)} | ${f3(r.perpSpinRel)} | ${fe(v.needAtVenus)} | ${fe(v.needAtHalf)} |`))].join('\n');
  T.t3Fd = ['| 源の取り分 f | 列 A の勾配 dU/dr ÷ s | 誤差 ÷ (s f): R/r ' + D.fdR.map(fe).join('・') + ' | 列 B′ の勾配 r dΩ/dr ÷ s | 誤差 ÷ (s f): R/r ' + D.fdR.map(fe).join('・') + ' |', '|---|---|---|---|---|',
    ...t3.fd.map((x) => `| ${x.f} | ${fe(x.gradA)} | ${D.fdR.map((k) => fe(x.errA[k])).join('・')} | ${fe(x.gradBp)} | ${D.fdR.map((k) => fe(x.errBp[k])).join('・')} |`)].join('\n');
  T.t4 = ['| 比 B/A | 角 θ [°] | (i) ベクトル和 ÷ A | (ii) 今の規則 ÷ A | (ii) の持ち上げ ÷ A | (iii) 境目を比で動かす型 ÷ A | 減速しない側: (ii)・(iii) | (iii) の境目 [°] |', '|---|---|---|---|---|---|---|---|',
    ...t4.rows.map((r) => `| ${r.B} | ${r.thDeg} | ${f4(r.vecSum)} | ${f4(r.ruleII)} | ${f4(r.liftII)} | ${f4(r.ruleIII)} | ${tf(r.noDecelII)}・${j3(r.noDecelIII)} | ${f2(r.boundaryIII)} |`)].join('\n');
  T.t4Bodies = ['| 天体(太陽の項と背景の項) | 小さい側 ÷ 大きい側 | なす角 [°] | (ii) の持ち上げ ÷ 大きい側 | 減速しない側: (ii)・(iii) | (iii) の境目 [°] |', '|---|---|---|---|---|---|',
    ...t4.bodies.map((b) => `| ${NM[b.key]} | ${fe(b.ratio)} | ${f2(b.thDeg)} | ${fe(b.liftII)} | ${tf(b.noDecelII)}・${j3(b.noDecelIII)} | ${f2(b.boundaryIII)} |`)].join('\n');
  return T;
}
