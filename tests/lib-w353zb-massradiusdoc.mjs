// 第353便zb(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R492):
// **正本 tests/out/massradius-353zb.json から PHYSICS〔第353便zb〕の表と数の文を作る文書の lib**
// (QA docs.massradius353zb が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353zb-massradiusdoc-1';
const ok = (x) => x !== null && x !== undefined && Number.isFinite(x);
const fe = (x) => (!ok(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (!ok(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (!ok(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const NM = Object.freeze({ 'Mercury|Sun': '水星 ← 太陽', 'Venus|Sun': '金星 ← 太陽', 'Earth|Sun': '地球 ← 太陽', 'Mars|Sun': '火星 ← 太陽', 'Jupiter|Sun': '木星 ← 太陽', 'Saturn|Sun': '土星 ← 太陽',
  'Uranus|Sun': '天王星 ← 太陽', 'Neptune|Sun': '海王星 ← 太陽', 'Moon|Sun': '月 ← 太陽', 'Io|Sun': 'イオ ← 太陽', 'Pluto|Sun': '冥王星 ← 太陽', 'Moon|EarthHi': '月 ← 地球(傾き最大の位相)',
  'Moon|EarthLo': '月 ← 地球(傾き最小の位相)', 'Io|Jupiter': 'イオ ← 木星', 'Pluto|Charon': '冥王星 ← カロン', 'Charon|Pluto': 'カロン ← 冥王星', 'Sun|Planets': '太陽 ← 惑星の和' });
const BN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ',
  Callisto: 'カリスト', Pluto: '冥王星', Charon: 'カロン', Sun: '太陽', europa: 'エウロパ ← 木星', ganymede: 'ガニメデ ← 木星', callisto: 'カリスト ← 木星', titan: 'タイタン ← 土星', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環' });
const TN = Object.freeze({ ringAx: '土星の環(F1)', ringDisk: '土星の環(F2)', plane: '公転面の集まり', io: 'イオの局所 ÷ 背景', moon: '月の局所 ÷ 背景', mercury: '水星の局所 ÷ 背景', precEarth: '地球の歳差の率の残り(仮)',
  precMars: '火星の歳差の率の残り(仮)', tilt: '地球の傾き', ioHeat: 'イオの内部熱', ioLock: '潮汐ロック(イオ)' });
const gn = (g, r) => (g === 'io1' ? `イオの x = 1(${f3(r)})` : g === 'v2' ? `金星 2% の端(${f3(r)})` : f3(r));
const esc = (s) => String(s).replace(/\|/g, '/');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
]);
export const READINGS = Object.freeze([
  '引きずられる側の「観測半径と、構造の係数のノブ」を、受け手ごとに c_R = C0 × (質量 ÷ 観測半径) と置く読みを数える(C0 は全部の受け手に同じ 1 つの数 —— 引きずられる側の半径 = C0 × 質量)。C0 = Y_k なら規則の半径の列そのもの —— 回答の基準と規則の半径の列(イオと金星が並ぶ列)を両立させる読みの候補(決めない)',
  '基準軸は角運動量の重み L(主の列)。「計算が合う方式」の材料として、金星の残りとイオ・月の x を同じ C0 で並べる(方式を選ばない)',
  '採用の幾何(局所 (S)・背景 (N+)・基準軸 L)のまま、C0 を振って金星の残りが 1〜2% の桁に留まる範囲と、そのときの他の題を数える',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${esc(o)}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = S.a5, c0 = J.t1.cols.filter((c) => c.ob === null);
  T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
    ['① C0 = Y_k は規則の半径の列: 〔第353便p〕の `stdCancel`(rule・ob)と同じ(17 組 × σ 2 —— x・等大の残り・金星の条件での残り)・局所の倍 1', S.vsRule < 1e-12 ? '< 1e-12' : '< 1e-9', G.rule353p],
    ['② 金星の側は〔第353便p〕の `stdCancel`(field・c_R = 金星の C0 × 質量 ÷ 観測半径)と同じ(C0 ÷ Y_k 1e6)', S.vsField === 0 ? '0' : '< 1e-9', G.field353p],
    ['③ 便の始めの数え直し 5 の数(イオの x = 1 の C0 ÷ Y_k・そのときの金星の残り・金星の c_R・残りの換算の係数/金星 2% の端・そのときの金星の c_R とイオの x/1e7 での金星の局所の倍・詰めた最大/規則の半径の列の金星の残りとイオの x・金星の c_R)',
      `${fe(A.io1)}・${f3(A.io1VenusRes)}・${fe(A.v2)}・${f3(A.v2IoX)}・${fe(A.gain1e7V)}・${fe(A.gainMaxV)}`, G.anchor5],
    ['④ 自分の重み m K1(0, C0 m) = 3 ÷ (2 C0) は受け手の質量に依らない(金星・イオ・月・太陽・質量 1 kg の粒子)', '0', G.selfWeight],
    ['⑤ 金星の頭打ちの C0((3/2) ÷ 源の重み)で〔第352便k〕の `spinRot` の自分の重みと源の重みが等しい', '< 1e-9', G.satClosed],
    ['⑥ 小さい C0 では局所の倍が C0 ÷ Y_k に比例(1e2 で 1e-3 の内 —— 金星・イオ・地球)', S.lin.map((g) => ff(g, 5)).join('・'), G.linear],
    ['⑦ 入力の拒否(C0 0・負の C0・質量の無い受け手・C0 の型・負の C0 の局所・格子の名・空の名・組の名)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
  ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n');
  T.t1s = '| σ | C0 ÷ Y_k | 金星の c_R | イオの c_R | 金星の局所の倍 | 金星の等大の残り | イオの x | イオの金星の条件での残り | 月 ← 地球の x | x が 0.9〜1.1 の組(金星を除く) | x が 0.5〜2 の組(金星を除く) |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.t1.cols.map((c) => `| ${c.ob === null ? 'なし' : '(O2b)'} | ${gn(c.g, c.ratio)} | ${fe(c.cRV)} | ${fe(c.cRIo)} | ${fe(c.gainV)} | ${f3(c.venusRes)} | ${f3(c.io.x)} | ${f3(c.io.resAtUV)} | ${f3(c.moonX)} | ${c.bands[0].n}(${c.bands[0].keys.map((k) => NM[k]).join('・') || '—'}) | ${c.bands[1].n}(${c.bands[1].keys.map((k) => NM[k]).join('・') || '—'}) |`).join('\n');
  T.t1x = '| 組(受け手 ← 源) | ' + c0.map((c) => gn(c.g, c.ratio)).join(' | ') + ' |\n|---|' + c0.map(() => '---').join('|') + '|\n'
    + Object.keys(c0[0].x).map((k) => `| ${NM[k]} | ` + c0.map((c) => f3(c.x[k])).join(' | ') + ' |').join('\n');
  T.cmp = '| C0 ÷ Y_k | 金星の c_R | 〔第353便v〕の r | イオの x: 本枝・全部同じ c_R・c_R★ の倍 | 月 ← 地球の x: 本枝・全部同じ c_R・c_R★ の倍 | 金星の等大の残り(3 つで同じ) |\n|---|---|---|---|---|---|\n'
    + J.cmp.map((r) => `| ${gn(r.g, r.ratio)} | ${fe(r.cRV)} | ${fe(r.r)} | ${f3(r.zb.io)}・${f3(r.p.io)}・${f3(r.v.io)} | ${f3(r.zb.moon)}・${f3(r.p.moon)}・${f3(r.v.moon)} | ${f3(r.zb.venus)} |`).join('\n');
  T.t2 = '| 組 | 質量 ÷ 観測半径(kg/m) | 源の重み(1/m) | 頭打ちの C0 ÷ Y_k(閉じた形 (3/2) ÷ 源の重み) | 倍が線形の半分の点 ÷ Y_k | 半分の点 ÷ 閉じた形 | 最大の倍 | その C0 ÷ Y_k | 最大の倍 ÷ 閉じた形 | イオの x = 1 の点での倍 |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.t2.rows.map((r) => `| ${NM[r.key]} | ${fe(r.mOverR)} | ${fe(r.wSrc)} | ${fe(r.ratioSat)} | ${fe(r.half)} | ${ff(r.halfOverSat, 3)} | ${fe(r.gainMax)} | ${fe(r.gainMaxAt)} | ${ff(r.gainMaxOverSat, 3)} | ${fe(r.gIo1)} |`).join('\n');
  T.t2m = '| 衛星(〔第334便a〕の表 —— 文献の値・未照合) | 質量 ÷ 観測半径(kg/m) | 源の重み(母天体 + 太陽) | 頭打ちの C0 ÷ Y_k(閉じた形) |\n|---|---|---|---|\n'
    + J.t2.moons.map((m) => `| ${BN[m.key]} | ${fe(m.mOverR)} | ${fe(m.wSrc)} | ${fe(m.ratioSat)} |`).join('\n');
  T.t2r = '| 区分 | 頭打ちの C0 ÷ Y_k(閉じた形) | 粒子の自分の重み ÷ 源の重み: 本枝 C0 = Y_k(大きさ 1 cm〜10 m で同じ) | 本枝 イオの x = 1 の C0 | 〔第353便k〕の受け手(c_R 1): 1 cm・1 m・10 m | 環の率 ÷ 物差し(k 1): 本枝 C0 = Y_k・〔第353便k〕の受け手 1 m | 環の率の倍(本枝): C0 ÷ Y_k 1e2・イオの x = 1・金星 2% の端・1e7 |\n|---|---|---|---|---|---|---|\n'
    + J.t2.rings.map((r) => { const c = (a) => r.cells.find((x) => x.a === a); return `| ${BN[r.key]} | ${fe(r.ratioSat)} | ${fe(c(1).A0overW)} | ${fe(c(1).A0overWio1)} | ${fe(c(0.01).kA0overW)}・${fe(c(1).kA0overW)}・${fe(c(10).kA0overW)} | ${fe(r.yardRule)}・${fe(r.yardK)} | ${c(1).g.map(fe).join('・')} |`; }).join('\n');
  T.t3 = '| C0 ÷ Y_k | 残りの換算の係数 k | 金星の残り | ' + Object.keys(J.t3.cols[0].cells).map((t) => TN[t]).join(' | ') + ' |\n|---|---|---|' + Object.keys(J.t3.cols[0].cells).map(() => '---').join('|') + '|\n'
    + J.t3.cols.map((c) => `| ${gn(c.g, c.ratio)} | ${fe(c.k)} | ${f3(c.venusRes)} | ` + Object.values(c.cells).map((x) => `${f3(x.v)}${x.inBand ? ' ○' : ''}`).join(' | ') + ' |').join('\n')
    + '\n| C0 の走査での動き(桁) | — | — | ' + J.t3.moves.map((m) => ff(m.spanDec, 2)).join(' | ') + ' |';
  T.t4 = '| 受け手 | 質量 ÷ 観測半径(kg/m) | c_R(C0 = Y_k) | c_R(イオの x = 1 の C0) | 慣性モーメントの係数 C/MR²(文献の値・未照合) | 順位 質量 ÷ 観測半径 | 順位 C/MR² |\n|---|---|---|---|---|---|---|\n'
    + J.t4.rows.map((x) => `| ${BN[x.id]} | ${fe(x.mOverR)} | ${fe(x.cRrule)} | ${fe(x.cRio1)} | ${x.moi === null || x.moi === undefined ? '—' : x.moi} | ${x.rankMR ?? '—'} | ${x.rankMoi ?? '—'} |`).join('\n')
    + '\n' + J.t4.parts.map((p) => `| 環の粒子 ${p.a} m(密度 900 —— ノブ(値は未照合)) | — | ${fe(p.cRrule)} | ${fe(p.cRio1)} | — | — | — |`).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const c0 = (g) => J.t1.cols.find((c) => c.ob === null && c.g === g), c1 = (g) => J.t1.cols.find((c) => c.ob === 'lit' && c.g === g), A = J.pure.scenes.a5;
  const cm = (g) => J.cmp.find((r) => r.g === g), R2 = J.t2.rows, V2 = R2.find((r) => r.key === 'Venus|Sun'), I2 = R2.find((r) => r.key === 'Io|Jupiter'), planets = R2.filter((r) => r.key.endsWith('|Sun'));
  const hs = planets.map((r) => r.halfOverSat), gs = planets.map((r) => r.gainMaxOverSat), rb = J.t2.rings.find((r) => r.key === 'ringB'), cb = rb.cells.find((x) => x.a === 1);
  const t3 = (g) => J.t3.cols.find((c) => c.g === g), mv = Object.fromEntries(J.t3.moves.map((m) => [m.topic, m.spanDec])), t4 = J.t4;
  const io1v = t4.rows.find((x) => x.id === 'Venus'), tm = (lo, hi) => J.t3.moves.filter((m) => m.spanDec >= lo && m.spanDec < hi).map((m) => TN[m.topic]).join('・');
  return {
    t1: `C0 ÷ Y_k が 1〜1e5 では、金星の等大の残りは ${f3(c0(1).venusRes)}〜${f3(c0(1e5).venusRes)}・イオ ← 木星の x は ${f3(c0(1).io.x)}〜${f3(c0(1e5).io.x)}(規則の半径の列の数のまま —— 局所の倍だけが C0 ÷ Y_k の倍)。イオの x = 1 は C0 ÷ Y_k ${fe(A.io1)}(金星の c_R ${fe(A.io1CRV)}・金星の残り ${f3(A.io1VenusRes)})・金星の残り 2% の端は ${fe(A.v2)}(イオの x ${f3(A.v2IoX)})。源の扁平の倍 σ((O2b))を置くと、イオの x = 1 は ${fe(c1('io1').ratio)}(金星の残り ${f3(c1('io1').venusRes)})。x が 0.9〜1.1 に入る組は、どの C0 でもイオ ← 木星だけか 0。`,
    cmp: `金星の c_R をそろえて比べると、イオの x は 本枝 ${f3(cm(1).zb.io)}〜${f3(cm('v2').zb.io)}・全部同じ c_R ${f3(cm(1).p.io)}〜${f3(cm('v2').p.io)}・c_R★ の倍 ${f3(cm(1).v.io)}〜${f3(cm('v2').v.io)}(C0 ÷ Y_k 1〜金星 2% の端)。月 ← 地球の x は 本枝 ${f3(cm(1).zb.moon)}〜${f3(cm('v2').zb.moon)}・全部同じ c_R ${f3(cm(1).p.moon)}〜${f3(cm('v2').p.moon)}・c_R★ の倍 ${f3(cm(1).v.moon)}〜${f3(cm('v2').v.moon)}。金星の残りは 3 つの置き方で同じ(金星の c_R が同じ)。`,
    t2: `自分の重みは 3 ÷ (2 C0) で受け手の質量に依らないので、頭打ちの C0 ÷ Y_k の閉じた形は (3/2) ÷ (源の重み × Y_k)(金星 ${fe(V2.ratioSat)}・イオ ${fe(I2.ratioSat)})。8 惑星で、倍が線形の半分になる点は閉じた形の ${ff(Math.min(...hs), 3)}〜${ff(Math.max(...hs), 3)} 倍・最大の倍は閉じた形の ${ff(Math.min(...gs), 3)}〜${ff(Math.max(...gs), 3)} 倍(イオ ${ff(I2.halfOverSat, 3)}・${ff(I2.gainMaxOverSat, 3)})—— 金星の最大の倍は ${fe(V2.gainMax)}(C0 ÷ Y_k ${fe(V2.gainMaxAt)})。環の粒子の自分の重み ÷ 土星の重み(B 環)は、本枝の C0 = Y_k で ${fe(cb.A0overW)}(大きさに依らない)・〔第353便k〕の受け手(1 m・c_R 1)で ${fe(cb.kA0overW)} —— 逆の側。本枝の環の率は局所の倍とほぼ同じ倍で動く(イオの x = 1 の点で ${fe(cb.g[1])})。`,
    t3: `0.98 で金星を等大にする残りの換算の係数 k は、C0 ÷ Y_k 1 で ${fe(t3(1).k)}・イオの x = 1 で ${fe(t3('io1').k)}・金星 2% の端で ${fe(t3('v2').k)}。C0 ÷ Y_k 1〜1e8 の走査での題の値 ÷ 物差しの動きは、0.5 桁より小さい題 ${tm(0, 0.5)}・0.5〜1.5 桁 ${tm(0.5, 1.5)}・1.5 桁以上 ${tm(1.5, 99)}。イオの x = 1 の点で、土星の環(F1)${f3(t3('io1').cells.ringAx.v)}・公転面の集まり ${f3(t3('io1').cells.plane.v)}・水星 ${f3(t3('io1').cells.mercury.v)}・地球の傾き ${f3(t3('io1').cells.tilt.v)}。`,
    t4: `受け手ごとの c_R は、C0 = Y_k で金星 ${fe(io1v.cRrule)}・イオの x = 1 の C0 で金星 ${fe(io1v.cRio1)}(引きずられる側の半径 ÷ 観測半径)。質量 ÷ 観測半径は受け手 16 で ${ff(t4.spanDec, 2)} 桁に広がる。慣性モーメントの係数の在る ${t4.n} 受け手で、質量 ÷ 観測半径と C/MR² の順位の相関は ${ff(t4.rho, 3)}(〔第353便v〕の c_R★ と C/MR² の相関 −0.66 と同じく、別の量の並び)。`,
  };
}
