// 第351便c(原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R429):
// **正本 tests/out/srcparts-351c.json から PHYSICS〔第351便c〕の表を作る文書の lib**
// (QA docs.srcparts351c が節の表と逐語で照合する —— 大きさと率は有効数字 3 桁・cos は小数 3 桁・角は小数 1 桁)。原文(言葉を変えずに引く)と統括の読みもここに持つ。
export const DOC_VERSION = 'w351c-srcpartsdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => { if (x === null || x === undefined || !Number.isFinite(x)) return '—'; const s = Number(x).toFixed(3); return s === '-0.000' ? '0.000' : s; };
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(1));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const ORIG = Object.freeze({ sun: '太陽', parent: '母天体' });
const SIGN = Object.freeze({ '-1': '向き −1(銀河の回転と逆向き)', '1': '向き +1' });
const READ = Object.freeze({ C2: '(C2)', W: '(W)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1008: R3で進める。軸引きずり回転の、自転軸に直交する成分が、自転方向に90度ずれると、軸引きずり回転軸に近付く向きになる。ただし、自転軸が起きるのは、自転と軸引きずり回転が順方向、つまり源の回転が逆方向の場合である。源の回転が順方向では、自転軸を倒す向きになる。よって、大半の惑星は、銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向きになり、釣り合う。また、軸引きずりには、自転軸を「自転に軸引きずり回転を合成した後の回転軸」に向ける作用も有り、自転軸を向ける回転が自転方向に90度ずれて歳差運動になる。つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足)', '軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる']),
  Object.freeze(['原仮定者の指示(2026-11-17 —— 第140報)', '赤道面での引きずりは、並進引きずりは順回転だが、軸引きずりでは逆回転となる']),
  Object.freeze(['原仮定者の指示(2026-11-17 —— 第140報)', '回転成分は並進引きずりに含まれるので、二重計上を避けると、軸方向では軸引きずりがゼロになる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「源の回転」は源の自転と読む(第138報の補足の「赤道面では源の回転と逆回転」と同じ向き)。「大半の惑星は…釣り合う」は予想の文として表に置き、数えた符号と大きさは別の列に置く。在位の geoPN=3 の場の太陽由来の項は、分子が源の相対の速度の分と源の自転の分の和なので、(M)(S)(MS) に分けて符号を見る(統括の数え直し)', '表 2・表 3・表 4']),
  Object.freeze(['「源が無回転で横を通り過ぎても…発生する」は (M) 相対の公転の分(源の自転 0・相対の速度だけ)に当たる、という読み。「並進引きずりと共に発生する」の「共に」を、同じ式の中の別の分子と読むか、並進引きずりの回転成分と読むかは決めない', '表 1・表 5']),
  Object.freeze(['源の自転の分 (S) の向き。(S) は在位の形の場で、源の赤道面で源の自転と逆向き(表 1 の (イ))。この文の「逆回転」と (S) の向きは同じ向きに見える —— 同じ量だと決めない(読みとして並べる)', '表 1']),
  Object.freeze(['「並進引きずりは順回転」と (M)(源のまわりを順方向に回るとき、(M) は公転と同じ向き —— 表 1 の (ア))、「軸引きずりでは逆回転」と (S) を並べて読む所。並べるだけで、同じだと決めない', '表 1']),
  Object.freeze(['二重計上の文。(M) を軸引きずりに数えるか、並進引きずりの回転成分の側に数えるかで、この文との関係が変わる —— 本節は決めない(決断事項の候補)', '表 5']),
  Object.freeze(['主の読みは (C2) 球全体の剛体回転への平均(天体の表は球の半径の平均 —— 第350便b の equivR と同じ求積)。換算の係数 k は局所の項にだけ掛かる(本節の表は k 1)。(W) 中心の渦度の半分は比べる列', '全部の表']),
]);
export function originalTable(readings = READINGS) {
  const rows = ['| # | 出どころ | 原文 | 統括の読み | 数えた所 |', '|---|---|---|---|---|'];
  ORIGINAL.forEach(([src, o], k) => rows.push(`| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`));
  return rows.join('\n');
}
/** 成分の定義の表 */
export const PART_TABLE = ['| 成分 | 源の入力 | 同じにした所 | 数え方 |', '|---|---|---|---|',
  '| (M) 相対の公転の分 | 源の自転 0・相対の速度 V_s − v_i だけ | 道・位相 72・分母・半径・核 | 受け手の速度を引く(在位の形)—— 受け手の速度を引かない変異では 0 |',
  '| (S) 源の自転の分 | 相対の速度 0・源の自転(源の軸 × 自転の率)だけ | 同上 | **直接に数える**((MS) − (M) の差で作らない —— (S) は (M) の 1e-13 の桁) |',
  '| (MS) 両方 | 両方(第348便h の `srcRot3` と同じ入力) | 同上 | `srcRot3(...).W` と相対差 < 1e-12 |'].join('\n');

const pn = (id, src) => `${NM[id]} | ${NM[src]}`;
export function tablesOf(J) {
  const T = {};
  // 表 1: 無次元の例
  { const rows = ['| 自分の重み A | 距離 d | (M) の z(公転 +z) | 閉じた形との差 | (S) の z(源の自転 +z) | 閉じた形との差 | abs(S ÷ M) | ÷ (1/5)(R/d)²(ω/n) |', '|---|---|---|---|---|---|---|---|'];
    for (const r of J.dim.rows) rows.push(`| ${r.A} | ${r.d} | ${fe(r.Mz)} | ${r.Mrel < 1e-9 ? '< 1e-9' : fe(r.Mrel)} | ${fe(r.Sz)} | ${r.Srel < 1e-9 ? '< 1e-9' : fe(r.Srel)} | ${fe(r.ratio)} | ${f3(r.ratioOverLead)} |`);
    T.t1 = rows.join('\n'); }
  { const VN = { d: '距離 d(A 100)', A: '自分の重み A(d 30)', R: '源の半径 R(A 100・d 30)' }, rows = ['| 振った量 | 区間 | (M) のべき | (S) のべき |', '|---|---|---|---|'];
    for (const p of J.dim.pow) rows.push(`| ${VN[p.var]} | ${p.range.join('→')} | ${f3(p.M)} | ${f3(p.S)} |`);
    T.t1pow = rows.join('\n'); }
  { const rows = ['| 天体 | R_s ÷ a(規則の半径) | ω_s ÷ n_orb | 頭の項 (1/5)(R_s/a)²(ω_s/n_orb) | (S) ÷ (M)((W)) | ÷ 頭の項 | 太陽の自転軸と公転の法線の角(°) |', '|---|---|---|---|---|---|---|'];
    for (const r of J.planetRatio) rows.push(`| ${NM[r.id]} | ${fe(r.RsOverA)} | ${fe(r.wsOverN)} | ${fe(r.lead)} | ${fe(r.ratio)} | ${f3(r.ratioOverLead)} | ${f1(r.incSrcDeg)} |`);
    T.t1planet = rows.join('\n'); }
  // 表 2: 符号と大きさ((C2)・分母 out)+ (W) の cos
  { const rows = ['| 天体 | 源 | 由来 | 傾き ε(°) | (M) ″/年・cos | (S) ″/年・cos | (MS) ″/年・cos | (S) ÷ (M) | (W) の cos: (M)・(S)・(MS) |', '|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.body.rows.filter((x) => x.read === 'C2')) {
      const w = J.body.rows.find((x) => x.read === 'W' && x.id === r.id && x.src === r.src && x.origin === r.origin), c = (p) => `${fe(r.parts[p].magAsYr)}・${f3(r.parts[p].cos)}`;
      rows.push(`| ${pn(r.id, r.src)} | ${ORIG[r.origin]} | ${f1(r.epsDeg)} | ${c('M')} | ${c('S')} | ${c('MS')} | ${fe(r.ratioSM)} | ${f3(w.parts.M.cos)}・${f3(w.parts.S.cos)}・${f3(w.parts.MS.cos)} |`);
    }
    T.t2 = rows.join('\n'); }
  { const rows = ['| 天体 | 源 | 背景 ″/年 | 向き −1: cos・起こす率 ″/年 | 向き +1: cos・起こす率 ″/年 |', '|---|---|---|---|---|'];
    for (const [id, src] of J.pairs16) { const a = J.body.bg.find((x) => x.id === id && x.src === src && x.sign === -1), b = J.body.bg.find((x) => x.id === id && x.src === src && x.sign === 1);
      rows.push(`| ${pn(id, src)} | ${fe(a.magAsYr)} | ${f3(a.cos)}・${fe(a.raiseAsYr)} | ${f3(b.cos)}・${fe(b.raiseAsYr)} |`); }
    T.t2bg = rows.join('\n'); }
  // 表 3: 起こす率と回転軸の線へ寄る率((C2))—— 符号が違う欄に ※
  { const rows = ['| 天体 | 源 | 由来 | (M) 起こす率・線へ寄る率 | (S) 起こす率・線へ寄る率 | (MS) 起こす率・線へ寄る率 | (MS) の −dθ/dt = abs(Ω⊥) |', '|---|---|---|---|---|---|---|'];
    for (const r of J.body.rows.filter((x) => x.read === 'C2')) {
      const c = (p) => { const q = r.parts[p]; return `${fe(q.raiseAsYr)}・${fe(q.toLineAsYr)}${q.signDiff ? ' ※' : ''}`; };
      rows.push(`| ${pn(r.id, r.src)} | ${ORIG[r.origin]} | ${c('M')} | ${c('S')} | ${c('MS')} | ${fe(r.parts.MS.toOmAsYr)} |`);
    }
    T.t3 = rows.join('\n'); }
  { const SC = { planets: '8 惑星', all: '16 組(太陽由来)' }, rows = ['| 読み | 背景の向き | 成分 | 範囲 | 当たる(背景が起こす ∧ 太陽由来が倒す) | 当たらない | 傾きが定まらない |', '|---|---|---|---|---|---|---|'];
    for (const c of J.counts) rows.push(`| ${READ[c.read]} | ${SIGN[String(c.sign)]} | (${c.part}) | ${SC[c.scope]} | ${c.hit} | ${c.miss} | ${c.undef} |`);
    T.t3count = rows.join('\n'); }
  // 表 4: 起こす率の比
  { const rows = ['| 天体 | 源 | 背景(向き −1・倍率 1)の起こす率 ″/年 | (S) ÷ 背景 | 大きさが同じになる倍率 (S) | (MS) ÷ 背景 | 大きさが同じになる倍率 (MS) | 向き +1: (S)・(MS) の倍率 |', '|---|---|---|---|---|---|---|---|'];
    const mt = (o) => (o.cancel === null ? '—' : o.cancel ? fe(o.multEq) : '打ち消さない');
    for (const r of J.bal.filter((x) => x.sign === -1)) { const p = J.bal.find((x) => x.id === r.id && x.src === r.src && x.sign === 1);
      rows.push(`| ${pn(r.id, r.src)} | ${fe(r.bgRaiseAsYr)} | ${fe(r.S.ratio)} | ${mt(r.S)} | ${fe(r.MS.ratio)} | ${mt(r.MS)} | ${mt(p.S)}・${mt(p.MS)} |`); }
    T.t4 = rows.join('\n'); }
  // 表 5: (M) の正体
  { const rows = ['| 天体 | β = W_j ÷ A | n_orb rad/年 | (M) ″/年((W)) | ÷ 閉じた形 ½ A W_j n ÷ (A + W_j)² − 1 | ÷ ½ β n_orb − 1 | 公転の北極との cos | 受け手の速度を引かない変異の (M) | (C2) ÷ (W) |', '|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.mRows) rows.push(`| ${NM[r.id]} | ${fe(r.beta)} | ${fe(r.nOrbRadYr)} | ${fe(r.MAsYr)} | ${r.closedRel < 1e-9 ? '< 1e-9' : fe(r.closedRel)} | ${fe(r.halfBetaRel)} | ${f3(r.toNorthCos)} | ${r.absVelAsYr === 0 ? '0' : fe(r.absVelAsYr)} | ${f4(r.c2OverW)} |`);
    T.t5 = rows.join('\n'); }
  // 表 6: 零試験
  { const S = J.pure.scenes, G = J.pure.gates, ok = (k) => (G[k] ? '真' : '偽'), lt = (v, t) => (v < t ? '< ' + t.toExponential(0) : fe(v));
    const a = S.anchor, c = S.common;
    const rows = ['| # | 試験 | 数 | 門 |', '|---|---|---|---|',
      `| ① | (MS) = 第348便h の \`srcRot3(...).W\`(15 組・相対差) | ${S.vsSrc === 0 ? '0' : lt(S.vsSrc, 1e-12)} | ${ok('vsSrcRot3')} |`,
      `| ② | (M) + (S) と (MS) の差 ÷ abs(M)(分子が線形) | ${lt(S.lin, 1e-12)} | ${ok('linear')} |`,
      `| ③ | (S) を直接に数える(相対の速度の倍率 0)・(S) ÷ (M): 地球・水星・海王星 | ${S.sDirect.velScaleOfS}・${a.Earth.ratio.toExponential(3)}・${a.Mercury.ratio.toExponential(3)}・${a.Neptune.ratio.toExponential(3)} | ${ok('sDirect')} |`,
      `| ④ | 共通の点検の数(cos: (S)・(MS)・背景): 地球・火星・金星/(MS) の大きさ(地球) | ${['Earth', 'Mars', 'Venus'].map((id) => a[id].cos.map(f3).join('・')).join('/')}/${a.Earth.msAsYr.toExponential(4)}″/年 | ${ok('anchorCos')} |`,
      `| ⑤ | 起こす率(″/年 —— (S)・(MS)・背景): 地球・火星 | ${['Earth', 'Mars'].map((id) => `${a[id].raise[0].toExponential(3)}・${a[id].raise[1].toExponential(4)}・${a[id].raise[2].toExponential(4)}`).join('/')} | ${ok('anchorRaise')} |`,
      `| ⑥ | 通過の向きの反転で (M) が反転・源の自転の反転で (S) が反転・互いに静止で自転 0 は 0 | ${Math.max(S.flip.m, S.flip.s, S.flip.io) < 1e-12 ? '< 1e-12' : fe(Math.max(S.flip.m, S.flip.s))}・${S.flip.rest === 0 ? '0' : fe(S.flip.rest)} | ${ok('flips')} |`,
      `| ⑦ | 分母の列: in = \`pairRot3\`・out = 第350便e の \`termsOf('out')\`・地球の in ÷ out − 1 | ${Math.max(S.den.in, S.den.out) < 1e-12 ? '< 1e-12' : fe(Math.max(S.den.in, S.den.out))}・${fe(S.den.diffE)} | ${ok('denCols')} |`,
      `| ⑧ | 受け手の速度を引かない変異: (M) は 0・(S) は変わらない | ${S.absVel.m === 0 ? '0' : fe(S.absVel.m)}・${S.absVel.s < 1e-12 ? '< 1e-12' : fe(S.absVel.s)} | ${ok('absVelM')} |`,
      `| ⑨ | (M) の閉じた形 ½ A W_j n_orb ÷ (A + W_j)²(8 惑星)・向きは公転の北極 | ${S.closed < 1e-9 ? '< 1e-9' : fe(S.closed)} | ${ok('closedM')} |`,
      `| ⑩ | 換算の係数 k: 局所の項だけ k 倍・k 0 は 0 | ${S.kk.two < 1e-12 ? '< 1e-12' : fe(S.kk.two)}・${S.kk.zero === 0 ? '0' : fe(S.kk.zero)} | ${ok('kLocal')} |`,
      `| ⑪ | (C2) 球の半径の平均 ÷ (W)(地球・太陽由来・(MS)・分母 in) | ${S.ballOverW.toFixed(5)} | ${ok('ballOverW')} |`,
      `| ⑫ | カロン–冥王星の組の作り(距離・質量の入れ替え・同期の軸)・組の数 | ${S.charon.pairs} | ${ok('charonPair')} |`,
      `| ⑬ | 第350便までの共通の点検の数(自転しない源の通過) | ${c.diaXz.toFixed(8)}・${c.sixZ.toFixed(8)}・${c.rotWz.toFixed(8)} | ${ok('common350')} |`,
      `| ⑭ | 入力の拒否(成分・読み・k < 0・分母の列・組・ベクトルの長さ)と null(軸 = 法線・Ω 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${ok('rejects')} |`];
    T.t6 = rows.join('\n'); }
  return T;
}
export function factsOf(J) {
  const F = {}, a = J.pure.scenes.anchor, row = (id, src, origin = 'sun', read = 'C2') => J.body.rows.find((x) => x.id === id && x.src === src && x.origin === origin && x.read === read);
  F.anchor = `共通の点検の数(本節の lib で出た値 —— (W)・分母は自分と太陽だけ・位相 72・係数 1): 自転軸 ŝ と Ω の cos は 地球 (S) ${f3(a.Earth.cos[0])}・(MS) ${f3(a.Earth.cos[1])}・一様な背景(向き −1)${f3(a.Earth.cos[2])}/火星 ${a.Mars.cos.map(f3).join('・')}/金星 ${a.Venus.cos.map(f3).join('・')}。(S) ÷ (M) は地球 ${a.Earth.ratio.toExponential(3)}(水星 ${a.Mercury.ratio.toExponential(3)}〜海王星 ${a.Neptune.ratio.toExponential(3)})・(MS) の大きさは地球 ${a.Earth.msAsYr.toExponential(4)}″/年。`;
  F.raise = `起こす率(経路 ① だけ・係数 1): 地球 (S) ${a.Earth.raise[0].toExponential(3)}・(MS) ${a.Earth.raise[1].toExponential(4)}・背景(銀河の公転の角速度 × 1)${a.Earth.raise[2].toExponential(4)}″/年/火星 ${a.Mars.raise[0].toExponential(3)}・${a.Mars.raise[1].toExponential(4)}・${a.Mars.raise[2].toExponential(4)}″/年。`;
  const e = row('Earth', 'Sun');
  F.earthC2 = `主の読み (C2) では地球の太陽由来は (M) ${fe(e.parts.M.magAsYr)}・(S) ${fe(e.parts.S.magAsYr)}・(MS) ${fe(e.parts.MS.magAsYr)}″/年(cos ${f3(e.parts.M.cos)}・${f3(e.parts.S.cos)}・${f3(e.parts.MS.cos)})—— (C2) ÷ (W) は ${J.pure.scenes.ballOverW.toFixed(5)}(分母 in)。`;
  const cnt = (read, sign, part, scope) => J.counts.find((c) => c.read === read && c.sign === sign && c.part === part && c.scope === scope);
  F.count = `第147報の文「銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向き」に当たる行の数((C2)・背景の向き −1・8 惑星): (M) ${cnt('C2', -1, 'M', 'planets').hit}・(S) ${cnt('C2', -1, 'S', 'planets').hit}・(MS) ${cnt('C2', -1, 'MS', 'planets').hit}(16 組では (S) ${cnt('C2', -1, 'S', 'all').hit}・(MS) ${cnt('C2', -1, 'MS', 'all').hit}・傾きが定まらない組 ${cnt('C2', -1, 'S', 'all').undef})。背景の向き +1 では (S) ${cnt('C2', 1, 'S', 'planets').hit}・(MS) ${cnt('C2', 1, 'MS', 'planets').hit}(8 惑星)。`;
  const sMiss = J.body.rows.filter((x) => x.read === 'C2' && x.origin === 'sun' && x.src === 'Sun' && ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(x.id))
    .map((x) => ({ x, b: J.body.bg.find((q) => q.id === x.id && q.src === x.src && q.sign === -1) })).filter(({ x, b }) => !(b.raiseAsYr > 0 && x.parts.S.raiseAsYr < 0))
    .map(({ x, b }) => NM[x.id] + '(' + [b.raiseAsYr > 0 ? '' : '背景の起こす率が負', x.parts.S.raiseAsYr < 0 ? '' : '(S) の起こす率が正'].filter(Boolean).join('・') + ')');
  F.sMiss = `(S) で当たらない惑星((C2)・向き −1): ${sMiss.join('・')}。`;
  const v = row('Venus', 'Sun'), u = row('Uranus', 'Sun');
  F.venusUranus = `金星(ε ${f1(v.epsDeg)}°)の (S) の cos は ${f3(v.parts.S.cos)}・起こす率 ${fe(v.parts.S.raiseAsYr)}″/年、天王星(ε ${f1(u.epsDeg)}°)の (S) の cos は ${f3(u.parts.S.cos)}・起こす率 ${fe(u.parts.S.raiseAsYr)}″/年(どちらも (C2))。`;
  const mn = Math.min(...J.mRows.map((r) => r.halfBetaRel)), mx = Math.max(...J.mRows.map((r) => r.halfBetaRel));
  F.mIdentity = `(M) は 8 惑星で閉じた形 ½ A W_j n_orb ÷ (A + W_j)² と相対差 < 1e-9・自分の重みが支配の近似 ½ β n_orb とは ${fe(mn)}〜${fe(mx)} の差・向きは公転の北極・受け手の速度を引かない変異では 0。`;
  const pw = (k) => J.dim.pow.find((p) => p.var === k);
  F.pow = `べき(無次元の例): 距離で (M) ${f3(pw('d').M)}・(S) ${f3(pw('d').S)}、自分の重みで ${f3(pw('A').M)}・${f3(pw('A').S)}、源の半径で ${f3(pw('R').M)}・${f3(pw('R').S)}。(S) ÷ (M) の頭の項は (1/5)(R_s/d)²(ω_s/n_orb) —— 8 惑星で (S) ÷ (M) ÷ 頭の項は ${f3(Math.min(...J.planetRatio.map((r) => r.ratioOverLead)))}〜${f3(Math.max(...J.planetRatio.map((r) => r.ratioOverLead)))}。`;
  const be = J.bal.find((x) => x.id === 'Earth' && x.src === 'Sun' && x.sign === -1);
  F.bal = `地球の太陽由来 (S) の起こす率は背景(倍率 1)の ${fe(be.S.ratio)} 倍・(MS) は ${fe(be.MS.ratio)} 倍(${be.MS.cancel ? '大きさが同じになる倍率 ' + fe(be.MS.multEq) : '(MS) と背景は同じ符号 —— 打ち消さない'})。`;
  const io = row('Io', 'Jupiter', 'parent'), cp = row('Charon', 'Pluto', 'parent'), mo = row('Moon', 'EarthHi', 'parent');
  F.parent = `母天体由来((C2)): 月(源 地球・傾きの最大の位相)の (M) ${fe(mo.parts.M.magAsYr)}・(S) ${fe(mo.parts.S.magAsYr)}″/年(cos ${f3(mo.parts.M.cos)}・${f3(mo.parts.S.cos)})、イオ(源 木星)の (M) ${fe(io.parts.M.magAsYr)}・(S) ${fe(io.parts.S.magAsYr)}″/年、カロン(源 冥王星)の (M) ${fe(cp.parts.M.magAsYr)}・(S) ${fe(cp.parts.S.magAsYr)}″/年 —— 同期の宣言の組(イオ・冥王星–カロン)は自転軸 = 公転の法線で、起こす率は書かない。`;
  return F;
}
