// 第353便o(原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R479):
// **正本 tests/out/suntiltmain-353o.json から PHYSICS〔第353便o〕の表と数の文を作る文書の lib**
// (QA docs.suntiltmain353o が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353o-suntiltmaindoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x === true ? '届く' : x === false ? '届かない' : '—');
const rhoN = (r) => (r === 0 ? '0((N+) だけ —— 主の向き)' : r === 'inf' ? '∞((G−) だけ)' : String(r));
const MAGN = Object.freeze({ uVrule: '(uV) 規則の半径', uVobs: '(uV) 観測の半径', lo: '窓の下端 0.0487', top: '窓の上端 0.835', focus: '注目の列 0.98', one: '倍率 1' });
const SN = Object.freeze({ g2m: '(g2−)(主の式)', g2p: '(g2+)(比べる式)' });
const AXN = Object.freeze({ L: 'L(主)', eq: 'eq(比べる)' });
const fr = (lo, hi) => (lo === null || lo === undefined ? '—' : lo === hi ? String(lo) : lo + '〜' + hi);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」。「こまの式」と同じで、自転軸を回転軸に向けようとすると、逆回転で歳差運動する。「これまでの向き」を読み違えていた']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['採用された幾何 = いまの円錐の読み: 太陽の自転軸は基準軸 L のまわりの円錐(半頂角 5.968°)の上に在る。この読みは傾きを「保つ」側の読みで、傾きを「作る」話とは別の題として数える', '表 3・表 7']),
  Object.freeze(['主の歳差の式 = (g2−)(−Ω × ŝ)。(g2+) は比べる式として残す(第352便の届く組の表は (g2+) の列で届いていた)', '表 5・表 7・表 8']),
  Object.freeze(['主の背景の向き = (N+) 太陽系の基準軸の向き。(G−)・2 つの向きの項(比 ρ = b ÷ a)は比べる列', '表 3・表 5・表 6']),
  Object.freeze(['形成の文は予想の文: 「作る」話の候補として、比べる列の届きと、上下の揺れの共鳴の帯を引くだけ(今の積分に入れない)', '表 7・数の文 ④']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L) | (${S.axL.map((x) => x.toFixed(6)).join(', ')})・${S.omegaG} rad/s・${S.sunL}° | ${tf(G.anchor3)} |`,
    `| ② 包み(〔第352便l〕の twoAxisStep を 2 つの式で)= 〔第352便x〕の stateAt(読み A)の角の差 | ${fe(S.vsX)}° | ${tf(G.wrapVsStateAt)} |`,
    `| ③ 経路 ② だけ・読み A: 2 つの式の角の差・方位の差 | ${fe(S.symG)}°・${fd(S.azDiff)}° | ${tf(G.path2SameAngle)} |`,
    `| ④ 主の列((N+) だけ): 初めにそろった 2 つの軸が年齢の間に動く角の最大(大きさ 5 × f 3 × 係数の差 2 × 式 2) | ${fe(S.moved)}° | ${tf(G.mainNoMake)} |`,
    `| ⑤ 主の列・f 0 の終わりの円錐 − 5.968°・f 1e-3 の円錐の閉じた形との差 | ${fe(S.keep0)}°・${fe(S.vsCone)}° | ${tf(G.mainKeepCone)} |`,
    `| ⑥ 〔第352便x〕の読み B の f の窓((g2+)・L・ρ ∞・q −1/eq・ρ 0.075・q −1/(g2−) の窓の数/全体) | ${S.wLinf.join('〜')}/${S.wEq.join('〜')}/${S.wLinfM}/${S.winAll.join('〜')} | ${tf(G.xWindow)} |`,
    `| ⑦ 〔第352便r〕の帯の両端(輪が動かない組 —— 角に届くか ρ 0.0605・0.087/方位に届くか) | ${yn(S.band.lo)}・${yn(S.band.hi)}/${yn(S.band.azLo)}・${yn(S.band.azHi)} | ${tf(G.rBand)} |`,
    `| ⑧ 傾きを保つ f の上限(太陽・u 0.98)= 〔第353便e〕の fMaxAt | ${fe(S.fk)}・${fe(S.fe)} | ${tf(G.keepVsE)} |`,
    `| ⑨ 角と方位を別々に数える走査の「同時」= 〔第352便x〕の reachScan(標本) | ${S.scanSame}/${S.nScan} | ${tf(G.scanVsReach)} |`,
    `| ⑩ 拒否(式の名・基準軸の名・負の大きさ・τ_hit 0) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 背景の大きさ(主の列 (N+)・基準軸 L) | u(ω_G の倍) | 年齢の内の τ | 「作る」: 初めの傾き 0 から動く角の最大 (g2−)・(g2+) ° | 「保つ」: f 0 の終わりの円錐 ° | f 1e-3 の終わりの円錐 ° | 傾きを保つ f の上限 | 歳差の周の数(年齢の内) |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${MAGN[r.mag]} | ${fe(r.u)} | ${fe(r.tauAge)} | ${fd(r.make.g2m)}・${fd(r.make.g2p)} | ${fd(r.cone0.g2m)} | ${fd(r.cone3.g2m)} | ${r.fKeepNoLimit ? '上限なし' : fe(r.fKeep)} | ${fe(r.turnsAge)} |`)].join('\n');
  T.t1off = ['| 初めのずれ δ(2 つの軸がそろって基準軸から)° | 年齢の間の 2 つの軸の角の最大 (g2−)・(g2+) ° | 閉じた形 2δ ° | いまの角 5.968° に届くか |', '|---|---|---|---|',
    ...J.t1.offs.map((r) => `| ${fd(r.offDeg)} | ${fd(r.gMax.g2m)}・${fd(r.gMax.g2p)} | ${fd(r.closed)} | ${yn(r.reachL)} |`)].join('\n');
  const row2 = (axis, rho, read) => { const m = J.t2.rows.find((r) => r.axis === axis && r.rho === rho && r.read === read && r.sense === 'g2m'), p = J.t2.rows.find((r) => r.axis === axis && r.rho === rho && r.read === read && r.sense === 'g2p');
    return `| ${AXN[axis]} | ${rhoN(rho)} | ${read} | ${m.nG}・${m.nA}・**${m.nB}** | ${fr(m.fLo, m.fHi)} | ${m.nearAzDeg === null ? '—' : m.nearAzDeg.toFixed(1)} | ${p.nG}・${p.nA}・${p.nB} | ${fr(p.fLo, p.fHi)} | ${p.nearAzDeg === null ? '—' : p.nearAzDeg.toFixed(1)} |`; };
  const keys2 = []; for (const axis of J.rowDecl.axes) for (const rho of J.t2.rows.filter((r) => r.axis === axis && r.read === 'A' && r.sense === 'g2m').map((r) => r.rho)) for (const read of J.rowDecl.reads) keys2.push([axis, rho, read]);
  T.t2 = ['| 基準軸 | 比 ρ = b ÷ a | 読み | (g2−): 角・方位・**同時**(55 組中) | (g2−): 同時の f | (g2−): 角が届いた標本の方位の差の最小 ° | (g2+): 角・方位・同時 | (g2+): 同時の f | (g2+): 方位の差の最小 ° |', '|---|---|---|---|---|---|---|---|---|',
    ...keys2.map(([a, r, rd]) => row2(a, r, rd))].join('\n');
  T.band = ['| 基準軸 | 比 ρ | 背景と基準軸の角 θ ° | 届く角の上限 2θ ° | 角に届くか | 方位(背景の向きの側)に届くか |', '|---|---|---|---|---|---|',
    ...J.t2.band.map((r) => `| ${AXN[r.axis]} | ${rhoN(r.rho)} | ${fd(r.thDeg)} | ${fd(r.gMaxDeg)} | ${yn(r.gReach)} | ${yn(r.azReach)} |`)].join('\n');
  T.t3 = ['| 式 | 基準軸 | 読み | 「作る」: 同時に届く組 | 背景の比 ρ | f | 係数の差 q | 「保つ」: f の上限(u 0.98)・(倍率 1) | 同じ f で両方を満たす組(f ≤ 上限) | 届いた後にいまの角 ±10% に居る長さ ÷ 届くまでの長さ |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${SN[r.sense]} | ${AXN[r.axis]} | ${r.read} | ${r.nHit} | ${r.rhos.length ? r.rhos.map((x) => (x === 'inf' ? '∞' : x)).join('・') : '—'} | ${fr(r.fLo, r.fHi)} | ${r.qs.length ? r.qs.join('・') : '—'} | ${fe(r.fKeep.focus)}・${fe(r.fKeep.one)} | ${r.nHit ? r.f0Hits + '(f 0 の組)' : '—'} | ${r.nHit ? fp(r.dwellMin) + '〜' + fp(r.dwellMax) + (r.nOpen ? '(帯が開いたまま ' + r.nOpen + ')' : '') : '—'} |`)].join('\n');
  T.win = ['| 基準軸 | 比 ρ | 式 | 読み B の f の窓(q −1・刻み 0.005) | 窓の数 | 窓の中ほどの τ |', '|---|---|---|---|---|---|',
    ...J.t3.win.map((r) => `| ${AXN[r.axis]} | ${rhoN(r.rho)} | ${SN[r.sense]} | ${r.n ? r.fLo + '〜' + r.fHi : '窓なし'} | ${r.n} | ${fe(r.midTau)} |`)].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, r1 = (m) => J.t1.rows.find((r) => r.mag === m), ecl = J.t1.ecl;
  const main = J.t2.rows.filter((r) => r.rho === 0), mB = J.t2.rows.filter((r) => r.sense === 'g2m' && r.read === 'B'), mA = J.t2.rows.filter((r) => r.sense === 'g2m' && r.read === 'A');
  const pB = J.t2.rows.filter((r) => r.sense === 'g2p' && r.read === 'B');
  const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const sA = J.t3.rows.filter((r) => r.sense === 'g2m' && r.read === 'A'), sB = J.t3.rows.filter((r) => r.sense === 'g2p' && r.read === 'B');
  F.main = `**① 主の列((N+)・(g2−)・基準軸 L)での「作る」と「保つ」。** 初めの傾き 0(輪の法線と太陽の自転軸が基準軸にそろう)から年齢の間に動く角は、大きさ 6 列 × f 3 × 係数の差 2 × 式 2 のどれでも ${fd(Math.max(...J.t1.rows.map((r) => Math.max(r.make.g2m, r.make.g2p))))}°(表 3)。主の列の比 ρ 0 の走査も、角に届く組 ${sum(main, 'nG')}・同時 ${sum(main, 'nB')}(表 5)。初めの角 5.968° を置くと、f 0 では年齢の間そのまま(円錐の半頂角は初めの角)・f 1e-3 では注目の列 0.98 で ${fd(r1('focus').cone3.g2m)}°・倍率 1 で ${fd(r1('one').cone3.g2m)}°。傾きを保つ f の上限は 0.98 で ${fe(r1('focus').fKeep)}・(uV) 規則の半径では上限なし。2 つの軸がそろって基準軸から δ ずれて始まると、届く角の上限は 2δ(表 4 —— 5.968° には δ ≥ 2.984°)。`;
  const nzA = (a, k) => a.map((r) => r[k]).filter((x) => x !== null), rngA = (a) => (a.length ? (Math.min(...a) === Math.max(...a) ? String(Math.min(...a)) : Math.min(...a) + '〜' + Math.max(...a)) : '—');
  const nearOf = (ax) => rngA(mB.filter((r) => r.axis === ax && r.rho !== 0).map((r) => r.nearAzDeg).filter((x) => x !== null).map((x) => x.toFixed(1)).map(Number));
  const hitA = mA.filter((r) => r.nB > 0), hitPB = pB.filter((r) => r.nB > 0);
  const rhoFirst = (ax) => { const b = J.t2.band.find((r) => r.axis === ax && r.gReach); return b ? (b.rho === 'inf' ? '∞' : String(b.rho)) : '—'; };
  F.cmp = `**② 比べる列を (g2−) で数え直す。** (g2−) で角と方位に同時に届く組は、読み B で ${sum(mB, 'nB')}(基準軸 2 × 比 7 × 55 組 —— 角に届く組は ${sum(mB, 'nG')}・角が届いた標本の方位の差の最小は L ${nearOf('L')}°・eq ${nearOf('eq')}°)・読み A で ${sum(mA, 'nB')}(比 ${rngA(hitA.map((r) => r.rho).filter((x) => x !== 'inf'))}${hitA.some((r) => r.rho === 'inf') ? '・∞' : ''} —— f ${rngA(nzA(hitA, 'fLo').concat(nzA(hitA, 'fHi')))})。(g2+) は読み B で ${sum(pB, 'nB')}(f ${rngA(nzA(hitPB, 'fLo').concat(nzA(hitPB, 'fHi')))})。輪が動かない組(〔第352便r〕の帯)は、角には比 L ${rhoFirst('L')}・eq ${rhoFirst('eq')} から届き、方位にはどの比でも届かない(背景の向きの側 —— 表 6)。`;
  const wLo = Math.min(...J.t3.win.filter((r) => r.n > 0).map((r) => r.fLo));
  F.sep = `**③ 分ける表。** 「作る」の届きは、(g2−) では読み A の組だけ(f 0 の組 ${sA.reduce((s, r) => s + r.f0Hits, 0)} —— この組は f の上限の内)・(g2+) では読み B の窓 f ${Math.min(...sB.map((r) => r.fLo))}〜${Math.max(...sB.map((r) => r.fHi))}。細かい窓(表 8)の f の下端 ${wLo} は、傾きを保つ上限(0.98 で ${fe(r1('focus').fKeep)})の ${fe(wLo / r1('focus').fKeep)} 倍 —— 同じ f で両方を満たす組は (g2+) の読み B の窓の中に無い。届いた後にいまの角の ±10% に居る長さ ÷ 届くまでの長さは、(g2−) 読み A ${fp(Math.min(...sA.map((r) => r.dwellMin)))}〜${fp(Math.max(...sA.map((r) => r.dwellMax)))}・(g2+) 読み B ${fp(Math.min(...sB.map((r) => r.dwellMin)))}〜${fp(Math.max(...sB.map((r) => r.dwellMax)))}(表 6)。`;
  F.form = `**④ 形成の文(予想の文)の数える範囲。** 「上下の運動の際に生じる」を数えるなら、上下の揺れの共鳴の帯(背景の大きさ ÷ 銀河の公転の角速度 ${J.t3.wobbleBand[0]}〜${J.t3.wobbleBand[1]} —— 〔第352便r〕〔第352便y〕)が範囲になる。主の列の背景の窓(0.0487〜0.835)と注目の列 0.98 は、この帯より下に在る。`;
  F.ecl = `**⑤ 黄道の極の比べる欄(仮の値・未照合)。** 太陽の傾きを黄道の極に対して ${fd(ecl.thDeg)}° に置くと、0.98 で傾きを保つ f の上限は ${fe(ecl.fKeep)}(L の 5.968° の ${fe(r1('focus').fKeep)} と同じ桁)。`;
  return F;
}
