// 第352便d(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R441):
// **正本 tests/out/precsense-352d.json から PHYSICS〔第352便d〕の表を作る文書の lib**
// (QA docs.precsense352d が節の表と逐語で照合する —— 率は有効数字 3 桁・cos は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352d-precsensedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const sm = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-12 ? '< 1e-12' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const pm = (x) => (x === 1 ? '+1' : x === -1 ? '−1' : x === 0 ? '0' : '—');
const sgn = (x) => (x === 1 ? '+' : x === -1 ? '−' : x === 0 ? '0' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽' });
const BN = Object.freeze({ Gm: '(G−)', Gp: '(G+)', Np: '(N+)', Nm: '(N−)' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' });
const PL = Object.freeze(['om', 'orb', 'ref', 'ecl']);
const PN = Object.freeze({ om: '合成の軸', orb: '公転の北極', ref: '基準軸', ecl: '黄道の極' });
const AXN = Object.freeze({ ref: '基準軸(等重み)', ecl: '黄道の極' });
const FC = Object.freeze(['f 0(N1)', 'f 0.5(N1)', 'f 1(N1)', '経路 ① だけ(k₁ 1・k₂ 0)']);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', '軸引きずりには、自転軸を「自転に軸引きずり回転を合成した後の回転軸」に向ける作用も有り、自転軸を向ける回転が自転方向に90度ずれて歳差運動になる']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「これまでの向き」= 記号 (g2+) dŝ/dt = +Ω × ŝ(〔第350便c〕の正の歳差・〔第351便d〕の経路 ②)。添えられた文「順回転なら逆回転」に、合成の軸のまわりで当たるのは (g2−) dŝ/dt = −Ω × ŝ(統括の数え直し)。どちらを主にするかは伺っている —— 2 列を同じ重さで並べる', '表 4・表 5・表 7']),
  Object.freeze(['「向ける回転を自転方向に 90 度ずらす」の 2 つの読みの式の出どころ(表 2)。どちらが正しいとは書かない', '表 2・表 4']),
  Object.freeze(['「逆回転」を測る基準の極を列で分ける(合成の軸・自分の公転の北極・基準軸の候補・黄道の極)。基準軸の候補は 8 惑星の公転の法線の等しい重みの平均(統括の数え直し 1)—— (N+) の背景の向き', '表 5・表 6・表 7']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 2 つの読みの式の出どころ(固定 —— どちらが正しいとは書かない) */
export const SENSE_SOURCES = Object.freeze([
  Object.freeze(['(g2+)', 'dŝ/dt = +k₂ (Ω × ŝ)', '〔第350便c〕の正の歳差: トルク τ = Ω⊥ × L(L = I ω ŝ)を dL/dt = τ に入れた形 —— 枠ごと Ω で運ばれる動き (g1) と同じ向き。〔第351便d〕の経路 ② の式。記号「これまでの向き」', 'ŝ·Ω > 0 で、合成の軸のまわりを自転と同じ回り(relSense +1)']),
  Object.freeze(['(g2−)', 'dŝ/dt = −k₂ (Ω × ŝ)', 'こまの式の読み: 「自転軸を合成の回転軸へ向ける回転」= ŝ を Ω⊥ の側へ回す回転のベクトル ŝ × Ω⊥ を、トルク(角運動量の向きを変える率)と読む → dŝ/dt ∝ ŝ × Ω⊥ = −(Ω × ŝ)(〔第350便c〕の τ = L × Ω⊥)。〔第351便d〕の表の句 4 の読み(向ける向き Ω⊥ を自転の向きへ 90° 回すと ŝ × Ω⊥)も同じ向き', 'ŝ·Ω > 0 で、合成の軸のまわりを自転と逆回り(relSense −1)']),
]);
export function sourceTable() {
  return ['| 向きの読み | 式 | 式の出どころ(並べるだけ —— どちらが正しいとは書かない) | 合成の軸のまわりの回り |', '|---|---|---|---|',
    ...SENSE_SOURCES.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.decl.anchor, a = S.anc;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① (g2+) と〔第351便d〕の \`r3Rate\` の経路 ② の prec(f 0・(N1)・傾けた 6 場面 × Ω 2 種)の差の最大 | ${sm(S.vsR3)} | ${tf(G.g2pIsR3)} |`,
    `| ② 閉じた形: 合成の軸のまわりの方位の率 = ±k₂ × 比 × abs(Ω)(12 場面の相対の差の最大)・傾きの率 0・なす角を保つ | ${sm(Math.max(...S.sc.map((r) => r.azErr)))}・${sm(Math.max(...S.sc.map((r) => r.inc)))}・${sm(Math.max(...S.sc.map((r) => r.keep)))} | ${tf(G.closedAz)} |`,
    `| ③ relSense: (g2+) は ŝ·Ω > 0 で +1・(g2−) は −1(逆行では符号が逆) | ${S.sc.map((r) => pm(r.rel)).join(' ')} | ${tf(G.relSense)} |`,
    `| ④ 経路 ① の傾きの率 = −k₁ abs(Ω) sin θ・経路 ① は合成の軸のまわりの方位の率を変えない(相対の差) | ${sm(S.incErr)}・${sm(S.azKeep)} | ${tf(G.path1)} |`,
    `| ⑤ ŝ が極と平行(順・逆)で null | ${tf(S.nul)} | ${tf(G.parallelNull)} |`,
    `| ⑥ 極を反転すると方位の率と傾きの率の符号が逆 | ${sm(S.poleFlip)} | ${tf(G.poleFlip)} |`,
    `| ⑦ 自転の反転(ŝ → −ŝ)で順回転の符号と (g2+) の relSense が逆・(g2−) = −(g2+) | ${tf(S.flipS)}・${sm(S.anti)} | ${tf(G.spinFlip)} |`,
    `| ⑧ 背景の向き: (G−) は〔第351便e〕の \`bgTerm\` の主・(G+) = −(G−)・(N±) = ± 軸・大きさは \`bgTerm\` と同じ | ${tf(S.bgOk)} | ${tf(G.bgDir)} |`,
    `| ⑨ 統括の数え直し 1 の数(3 桁): 金星の倍率 (S) ${A.uV}・(MS) ${A.uVms}/基準軸の定数と 8 惑星の法線の平均の差/基準軸と太陽の自転軸 ${A.angRefSun}°・(G−) ${A.angRefBg}° | ${a.uV.toPrecision(6)}・${a.uVms.toFixed(4)}/${sm(a.refErr)}/${a.angRefSun.toFixed(3)}°・${a.angRefBg.toFixed(3)}° | ${tf(G.anchor352)} |`,
    `| ⑨ の続き: (g2+) の方位の率 [″/年] 地球 (G−) 基準軸 ${A.earthGmRef}・公転の北極 ${A.earthGmOrb}・(N+) 基準軸 ${A.earthNpRef}・火星 (G−) 基準軸 ${A.marsGmRef}・金星 (G−) 基準軸 ${A.venusGmRef}・金星 (N+) 合成の軸 ${A.venusNpOm} | ${fe(a.earthGmRef)}・${fe(a.earthGmOrb)}・${fe(a.earthNpRef)}・${fe(a.marsGmRef)}・${fe(a.venusGmRef)}・${fe(a.venusNpOm)} | ${tf(G.anchor352)} |`,
    `| ⑩ (g2−) は 4 つの極のまわりで (g2+) と符号が逆(地球 (G−))・relSense +1 と −1 | ${tf(S.allFlip)} | ${tf(G.g2mFlip)} |`,
    `| ⑪ 変異 3 つ(方位の率の符号を逆・abs(p × ŝ) で 1 回だけ割る・外積の順を逆)で落ちる | ${tf(S.muts.flipAz)}・${tf(S.muts.noSquare)}・${tf(S.muts.swapCross)} | ${tf(G.mutants)} |`,
    `| ⑫ 入力の拒否(極 0・ŝ の長さ 2・向きの読みの名 2・背景の向きの名・軸 0・倍率 −1・Ω の型) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.ex = ['| ŝ と Ω のなす角 θ [°] | 向きの読み | 合成の軸のまわりの方位の率(÷ abs(Ω)) | 傾きの率 | ŝ·Ω の符号 | relSense | 文の範囲 | 「逆回転」に当たる |', '|---|---|---|---|---|---|---|---|',
    ...J.ex.map((r) => `| ${r.deg} | ${SN[r.sense]} | ${fe(r.az)} | ${r.inc === 0 ? '0' : sm(r.inc)} | ${pm(r.spin)} | ${pm(r.rel)} | ${r.scope === 'in' ? '順回転(文の中)' : '逆行(文の外)'} | ${r.scope === 'in' ? (r.hit ? '当たる' : '当たらない') : '—'} |`)].join('\n');
  const azs = (r) => PL.map((p) => fe(r.az[p])).join('・'), incs = (r) => PL.map((p) => fe(r.inc[p])).join('・');
  T.main = ['| 受け手 | 背景の向き | 向きの読み | cos(ŝ, 背景) | cos(ŝ, 合成) | relSense | 方位の率 [″/年]: 合成の軸・公転の北極・基準軸・黄道の極 | 傾きの率 [″/年]: 同じ 4 つの極 | 極に対する回り(+ 同じ・− 逆) | 極で替わる |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.main.map((r) => `| ${NM[r.id]} | ${BN[r.bg]} | ${SN[r.sense]} | ${f3(r.cosBg)} | ${f3(r.cosOm)} | ${pm(r.rel)} | ${azs(r)} | ${incs(r)} | ${PL.map((p) => sgn(r.relP[p])).join(' ')} | ${r.poleFlip ? '※' : ''} |`)].join('\n');
  const cnt = (rows, part, sense, bg, ax) => PL.map((p) => { const c = rows.find((x) => x.part === part && x.sense === sense && x.bg === bg && x.axis === ax && x.pole === p); return `${c.hit}/${c.scope}・${c.hitOm}/${c.scopeOm}`; });
  T.count = ['| 成分・背景の大きさ | 向きの読み | 背景の向き | (N±) の軸 | 合成の軸 | 公転の北極 | 基準軸 | 黄道の極 | 極で替わる受け手 |', '|---|---|---|---|---|---|---|---|---|',
    ...['S', 'MS'].flatMap((part) => ['g2p', 'g2m'].flatMap((sense) => J.decl && [['Gm', 'ref'], ['Gp', 'ref'], ['Np', 'ref'], ['Nm', 'ref'], ['Np', 'ecl'], ['Nm', 'ecl']].map(([bg, ax]) => {
      const c0 = J.count.find((x) => x.part === part && x.sense === sense && x.bg === bg && x.axis === ax);
      return `| ${part === 'S' ? '(S)・(uV)' : '(MS)・25.4221'} | ${SN[sense]} | ${BN[bg]} | ${bg[0] === 'N' ? AXN[ax] : '—'} | ${cnt(J.count, part, sense, bg, ax).join(' | ')} | ${c0.flip.map((id) => NM[id]).join('・') || 'なし'} |`; })))].join('\n');
  T.ms = ['| 受け手 | 背景の向き | 向きの読み | cos(ŝ, 合成) | relSense | 方位の率 [″/年]: 合成の軸・基準軸 | 極に対する回り(+ 同じ・− 逆) | 表 2 から回りが替わった極 |', '|---|---|---|---|---|---|---|---|',
    ...J.ms.map((r) => `| ${NM[r.id]} | ${BN[r.bg]} | ${SN[r.sense]} | ${f3(r.cosOm)} | ${pm(r.rel)} | ${fe(r.az.om)}・${fe(r.az.ref)} | ${PL.map((p) => sgn(r.relP[p])).join(' ')} | ${r.flipVsS.map((p) => PN[p]).join('・') || 'なし'} |`)].join('\n');
  T.f = ['| 受け手 | 背景の向き | 向きの読み | 経路の比 | 方位の率 [″/年]: 合成の軸・公転の北極・基準軸・黄道の極 | 傾きの率 [″/年]: 同じ 4 つの極 |', '|---|---|---|---|---|---|',
    ...J.f.map((r) => `| ${NM[r.id]} | ${BN[r.bg]} | ${SN[r.sense]} | ${FC[r.fcase]} | ${azs(r)} | ${incs(r)} |`)].join('\n');
  return T;
}

/** 数の文(表の要点 —— 本文に逐語) */
export function factsOf(J) {
  const F = {}, row = (id, bg, s, rows = J.main) => rows.find((r) => r.id === id && r.bg === bg && r.sense === s);
  const c = (part, sense, bg, ax, p) => J.count.find((x) => x.part === part && x.sense === sense && x.bg === bg && x.axis === ax && x.pole === p);
  const flipsMain = (bg) => [...new Set(J.main.filter((r) => r.bg === bg && r.poleFlip).map((r) => NM[r.id]))].join('・') || 'なし';
  F.scale = `背景の大きさ (uV) = 金星で太陽由来 (S) と大きさが同じになる倍率 ${J.uV.toPrecision(6)}(銀河の公転の角速度の倍・k 1)・比べる列の (MS) の倍率 ${J.uMS.toFixed(4)}。`;
  F.closed = `合成の軸のまわりでは、表 2・表 3 の全部の行で、方位の率の大きさ = 合成の大きさ(k₂ 1)・傾きの率 0。(g2+) は ŝ·Ω > 0 の行で relSense +1・(g2−) は −1(逆行の行では逆)。`;
  const e = row('Earth', 'Gm', 'g2p');
  F.earth = `地球・(G−)・(g2+): 方位の率 [″/年] 合成の軸 ${fe(e.az.om)}・公転の北極 ${fe(e.az.orb)}・基準軸 ${fe(e.az.ref)}・黄道の極 ${fe(e.az.ecl)} —— 基準軸のまわりだけ回りが逆(極の選び方で符号が替わる)。(N+) では ${fe(row('Earth', 'Np', 'g2p').az.ref)}(基準軸)で、4 つの極で回りが同じ。`;
  F.flips = `極で回りが替わる受け手(表 2・(S)・(uV)): (G−) ${flipsMain('Gm')}/(G+) ${flipsMain('Gp')}/(N+) ${flipsMain('Np')}/(N−) ${flipsMain('Nm')}。`;
  const sc = (bg) => J.main.filter((r) => r.bg === bg && r.sense === 'g2p' && Math.sign(r.cosBg) !== Math.sign(r.cosOm)).map((r) => NM[r.id]).join('・') || 'なし';
  F.scope = `「背景と順回転」(ŝ·背景 > 0)と「合成と順回転」(ŝ·Ω > 0)が食い違う受け手(表 2): (G−) ${sc('Gm')}/(N+) ${sc('Np')} —— 太陽由来 (S) が背景と同じ桁の受け手。`;
  const h = (sense, bg) => `${c('S', sense, bg, 'ref', 'om').hit}/${c('S', sense, bg, 'ref', 'om').scope}`;
  F.count = `「文に当たる」行(背景と順回転で、合成の軸のまわりで逆回り)の数 —— (S)・(uV): (g2+) は (G−) ${h('g2p', 'Gm')}・(N+) ${h('g2p', 'Np')}/(g2−) は (G−) ${h('g2m', 'Gm')}・(N+) ${h('g2m', 'Np')}(受け手 9 のうち、背景と順回転の数が分母)。`;
  const nFlipMs = J.ms.filter((r) => r.flipVsS.length > 0).length;
  F.ms = `表 3((MS)・25.4221)で、表 2 から極に対する回りが替わった行 ${nFlipMs}/${J.ms.length}。`;
  const fe1 = J.f.find((r) => r.id === 'Earth' && r.bg === 'Gm' && r.sense === 'g2p' && r.fcase === 3);
  F.path1 = `経路 ① だけ(k₁ 1)の地球・(G−): 合成の軸のまわりの方位の率 ${fe(fe1.az.om)}・公転の北極 ${fe(fe1.az.orb)}・基準軸 ${fe(fe1.az.ref)}・黄道の極 ${fe(fe1.az.ecl)} [″/年] —— 経路 ① は合成の軸のまわりの方位の率を変えず、ほかの極のまわりでは変える。`;
  return F;
}
