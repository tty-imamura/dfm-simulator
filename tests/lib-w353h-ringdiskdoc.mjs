// 第353便h(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R472):
// **正本 tests/out/ringdisk-353h.json から PHYSICS〔第353便h〕の表を作る文書の lib**
// (QA docs.ringdisk353h が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353h-ringdiskdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const KEYN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const mk = (r, c) => fe(r.yard[c]);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1059: 推奨']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['源の半径の主の列 = 規則の半径。土星の環は円盤引きずりの題(軸引きずりの (S) の半径の採否に使わない)。環の題を、これまでの節に在る円盤引きずりの側の候補で数え直し、軸引きずりの (S) の 2 列と並べる', '表 2・表 3・表 4']),
  Object.freeze(['イ = 歳差の率は重力の側の潮汐のトルクの列を基準に置き、軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項', '表 5']),
  Object.freeze(['推奨 = 物差しから遠い題も表のまま持つ(省かない)', '表 2・表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, at = (key, t) => J.t1.find((r) => r.key === key && r.tiltDeg === t);
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 傾き 1° の (i)(ii) = 第352便s の saturnRing の起こす率と物差しの比(相対差の最大・区分 5 × 源の半径 2) | ${fl9(Math.max(...S.vs352s))} | ${tf(G.vs352s)} |`,
    `| ② 第352便s の比べる数: (i) の桁・(ii) の最小と最大 | 1e${S.ruleExp[0]}・${fe(S.obsLo)}・${fe(S.obsHi)} | ${tf(G.anchor352s)} |`,
    `| ③ (iii-a) 傾き 1°・順行 = 第351便j の saturnRows の (MS) の起こす率(相対差の最大・区分 5 × 読み 2) | ${fl9(Math.max(...S.vs351j))} | ${tf(G.vs351j)} |`,
    `| ④ (iii-a) の直交成分は (MS) と (S) で同じ(相対差の最大 —— (M) は輪の法線に平行) | ${fl9(Math.max(...S.msEqS))} | ${tf(G.msEqS)} |`,
    `| ⑤ 小さい傾き: 0.1° と 1° の率 ÷ 物差し(相対差の最大) | ${fe(Math.max(...S.smallTilt))} | ${tf(G.smallTilt)} |`,
    `| ⑥ 共通の点検の数: 基準軸 L の z 成分・(uV) | ${S.L[2].toFixed(6)}・${S.uV.toPrecision(6)} | ${tf(G.common)} |`,
    `| ⑦ 物差しの換算(1 ÷ 物差しの年数の率で 1) | ${fe(S.unitYard)} | ${tf(G.unitYard)} |`,
    `| ⑧ 表 5 の切り分けが第352便za の題 9 を覆う | ${S.splitKeys.length}/${S.splitIds.length} | ${tf(G.splitCover)} |`,
    `| ⑨ 拒否(源の半径の置き方・傾き 0・読みの名・傾き 95°) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 2: 区分 × 列(傾き 1°)
  T.yard = ['| 区分 | 半径 ÷ 土星の観測の半径 | (i) 軸引きずりの (S)・規則の半径 | (ii) 軸引きずりの (S)・観測の半径(比べる列) | (iii-a) 円盤引きずりの側 (C1) | (iii-a) 円盤引きずりの側 (C2) | (iii-b) 🛟 目安の強さ | (iii-b) 🛟 本の強さ |', '|---|---|---|---|---|---|---|---|',
    ...D.centers.map((k) => { const r = at(k, 1); return `| ${KEYN[k]} | ${r.rOverRobs.toFixed(3)} | ${mk(r, 'axRule')} | ${mk(r, 'axObs')} | ${mk(r, 'diskC1')} | ${mk(r, 'diskC2')} | ${mk(r, 'bookNeed')} | ${mk(r, 'bookRaw')} |`; })].join('\n');
  // 表 3: 傾きの格子(B 環)
  T.tilt = ['| 傾き(度) | (i) 規則の半径 | (ii) 観測の半径 | (iii-a) (C1) | (iii-a) (C2) |', '|---|---|---|---|---|',
    ...D.tilts.map((t) => { const r = at('ringB', t); return `| ${t} | ${fe(r.yard.axRule)} | ${fe(r.yard.axObs)} | ${fe(r.yard.diskC1)} | ${fe(r.yard.diskC2)} |`; })].join('\n');
  // 表 4: 物差しに届くのに要る倍(傾き 1°)
  const nd = (r, c) => (r.need[c] === null ? '向きが逆' : fe(r.need[c]));
  T.need = ['| 区分 | (i) 規則の半径 | (ii) 観測の半径 | (iii-a) (C1) | (iii-a) (C2) | (iii-b) 🛟 目安の強さ | (iii-a) (C2) ÷ (ii) |', '|---|---|---|---|---|---|---|',
    ...D.centers.map((k) => { const r = at(k, 1); return `| ${KEYN[k]} | ${nd(r, 'axRule')} | ${nd(r, 'axObs')} | ${nd(r, 'diskC1')} | ${nd(r, 'diskC2')} | ${nd(r, 'bookNeed')} | ${(r.yard.diskC2 / r.yard.axObs).toFixed(3)} |`; })].join('\n');
  // 表 5: 切り分け
  T.split = ['| 題(第352便za) | 物差し | (S) 規則の半径 ÷ 物差し | (S) 観測の半径 ÷ 物差し | 読む側(統括の読み) |', '|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${r.label} | ${r.ruler} | ${fe(r.vRule)}${r.bandRule ? ' ★' : ''} | ${fe(r.vObs)}${r.bandObs ? ' ★' : ''} | ${D.sideNames[r.side]} |`)].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, r1 = J.t1.filter((r) => r.tiltDeg === 1), mm = (c) => [Math.min(...r1.map((r) => r.yard[c])), Math.max(...r1.map((r) => r.yard[c]))];
  const q = r1.map((r) => r.yard.diskC2 / r.yard.axObs), [a0, a1] = mm('axRule'), [b0, b1] = mm('axObs'), [c0, c1] = mm('diskC2'), [d0, d1] = mm('diskC1');
  F.cols = `傾き 1° の率 ÷ 物差しは、(i) 軸引きずりの (S)・規則の半径 ${fe(a0)}〜${fe(a1)}・(ii) 観測の半径 ${fe(b0)}〜${fe(b1)}・(iii-a) 円盤引きずりの側 (C2) ${fe(c0)}〜${fe(c1)}・(C1) ${fe(d1)}〜${fe(d0)}(向きが逆 —— 傾きが増える)`;
  F.ratio = `(iii-a) (C2) ÷ (ii) は区分 5 で ${Math.min(...q).toFixed(4)}〜${Math.max(...q).toFixed(4)}`;
  F.book = `🛟 の率 ÷ 物差しは、目安の強さ ${fe(J.book.yardNeed)}・本の強さ ${fe(J.book.yardBook)}(見える倍率 ${fe(J.book.lambdaScale)} —— 傾きと区分に依らない)`;
  return F;
}
