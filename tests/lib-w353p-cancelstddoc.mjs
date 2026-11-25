// 第353便p(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R480):
// **正本 tests/out/cancelstd-353p.json から PHYSICS〔第353便p〕の表と数の文を作る文書の lib**
// (QA docs.cancelstd353p が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353p-cancelstddoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const NM = Object.freeze({ 'Mercury|Sun': '水星 ← 太陽', 'Venus|Sun': '金星 ← 太陽', 'Earth|Sun': '地球 ← 太陽', 'Mars|Sun': '火星 ← 太陽', 'Jupiter|Sun': '木星 ← 太陽', 'Saturn|Sun': '土星 ← 太陽',
  'Uranus|Sun': '天王星 ← 太陽', 'Neptune|Sun': '海王星 ← 太陽', 'Moon|Sun': '月 ← 太陽', 'Io|Sun': 'イオ ← 太陽', 'Pluto|Sun': '冥王星 ← 太陽', 'Moon|EarthHi': '月 ← 地球(傾き最大の位相)',
  'Moon|EarthLo': '月 ← 地球(傾き最小の位相)', 'Io|Jupiter': 'イオ ← 木星', 'Pluto|Charon': '冥王星 ← カロン', 'Charon|Pluto': 'カロン ← 冥王星', 'Sun|Planets': '太陽 ← 惑星の和' });
const CN = Object.freeze({ i: '(i) これまで', ii: '(ii) σ', 'iii-1e-3': '(iii) c_R 1e-3', 'iii-0.0128': '(iii) c_R 0.0128', 'iv-1e-3': '(iv) σ + c_R 1e-3', 'iv-0.0128': '(iv) σ + c_R 0.0128', v: '(v) (P-応)' });
const cRn = (c) => (c === null ? '規則の半径' : String(c));
const esc = (s) => String(s).replace(/\|/g, '/');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
]);
export const READINGS = Object.freeze([
  '引きずる側の「扁平率」は〔第353便d〕の候補のうち、数に出る (O2b) の σ(距離に依らない倍)で置き、引きずられる側の「観測半径と、構造の係数のノブ」は〔第353便c〕の (P-場) の c_R で置く。2 つを同時に置いて、〔第352便v〕の打ち消しの点の一覧(17 組)を数え直す。「計算が合う方式」の材料として、x(打ち消しの倍率 ÷ 金星の条件の値)が 1 の近くに入る組の数を置き方ごとに並べる(どの置き方を採るかは決めない)',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, cols = J.t1.cols.map((c) => c.id);
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① (i) が〔第352便v〕の `cancelPoint` と同じ(17 組 —— x・等大の残り・金星の条件での残り・cos)と、x の 17 個(5 桁)', `${S.vs17.length} 組`, G.rule17],
      ['② (ii) のイオと金星が〔第353便d〕の `cancelRows` の (O2b)・リポジトリの f・規則の半径の列と同じ(x・金星の条件での残り)', `${ff(S.vsD.x, 4)}・${ff(S.vsD.res, 4)}`, G.ob353d],
      ['③ 局所(扁平なし・規則の半径)が〔第353便d〕の `obCancel` と同じ(イオ・月・地球)', S.vsObCancel === 0 ? '0' : '< 1e-9', G.obCancel353d],
      ['④ (iii) の金星の φ が〔第353便c〕の `cancelOf` と同じ・イオの母天体由来だけ(他の源の重みなし)の比が〔第353便c〕の `ioRows`(c_R 1)と同じ', `${ff(S.vsC.phi, 4)}°・${ff(S.vsC.xPar1, 3)}`, G.field353c],
      ['⑤ 太陽を受け手にした場が〔第352便e〕の `rotOf` と同じ(規則の半径・扁平なし)', S.vsRotOf === 0 ? '0' : '< 1e-9', G.rotOf352e],
      ['⑥ (v) (P-応) の x と残りが (i) と同じ(17 組)', S.vsResp === 0 ? '0' : '< 1e-12', G.resp],
      ['⑦ 金星の x が 5 つの置き方で 1・木星の f 0 の上書きが球と同じ', '真', G.identity],
      ['⑧ c_R★: イオの実在の組(〔第353便c〕の `cRStar`)と赤道の円の道(`moonWeights`)が同じ桁', `${f3(S.csIo.cR)}・${f3(S.csIo.mw)}`, G.cRStar],
      ['⑨ 入力の拒否(置き方の名・c_R の無い (P-場)・扁平の名・f 1.2・組の名・負の c_R・衛星の名・半径 0)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.t1x = '| 組(受け手 ← 源) | ' + cols.map((c) => CN[c]).join(' | ') + ' |\n|---|' + cols.map(() => '---').join('|') + '|\n'
    + J.t1.rows.map((r) => `| ${NM[r.key]} | ` + cols.map((c) => f3(r.cells[c].x)).join(' | ') + ' |').join('\n');
  T.t1r = '| 組 | 等大の残り (i) | 等大の残り (iv) c_R 0.0128 | 金星の条件での残り (i) | (ii) | (iii) c_R 1e-3 | (iv) c_R 0.0128 | (G−) の等大の残り (i)〔比べる列〕 | ノブの源((ii)) |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t1.rows.map((r) => { const c = r.cells; return `| ${NM[r.key]} | ${f3(c.i.resEq)} | ${f3(c['iv-0.0128'].resEq)} | ${f3(c.i.resAtUV)} | ${f3(c.ii.resAtUV)} | ${f3(c['iii-1e-3'].resAtUV)} | ${f3(c['iv-0.0128'].resAtUV)} | ${f3(c.i.resEqGm)} | ${c.ii.knob.length ? c.ii.knob.join('・') + '(f 0.1)' : '—'} |`; }).join('\n');
  T.counts = '| 置き方 | x が 0.9〜1.1 の組(金星を除く) | x が 0.5〜2 の組(金星を除く) |\n|---|---|---|\n'
    + J.t1.counts.map((c) => `| ${CN[c.col]} | ${c.bands[0].n}(${c.bands[0].keys.map((k) => NM[k]).join('・') || '—'}) | ${c.bands[1].n}(${c.bands[1].keys.map((k) => NM[k]).join('・') || '—'}) |`).join('\n');
  { const fs = [...new Set(J.t2.cells.map((c) => c.fJ))], cs = [...new Set(J.t2.cells.map((c) => c.cR))], at = (f, c) => J.t2.cells.find((x) => x.fJ === f && x.cR === c);
    const head = '| 木星の f(σ) \\ c_R | ' + cs.map(cRn).join(' | ') + ' |\n|---|' + cs.map(() => '---').join('|') + '|\n';
    T.t2x = head.replace('\\', '/') + fs.map((f) => `| ${f}(${ff(at(f, null).sigmaJ, 4)}) | ` + cs.map((c) => f3(at(f, c).x)).join(' | ') + ' |').join('\n')
      + '\n| 金星の等大の残り | ' + cs.map((c) => f3(at(0, c).venusResEq)).join(' | ') + ' |';
    T.t2bare = head.replace('\\', '/') + fs.map((f) => `| ${f}(${ff(at(f, null).sigmaJ, 4)}) | ` + cs.map((c) => f3(at(f, c).xParBare)).join(' | ') + ' |').join('\n'); }
  { const B = J.t2.best, K = J.t2.bestKeep;
    T.t2best = '| 量 | 値 |\n|---|---|\n' + [
      ['x(全部の作り)が 1 に一番近い格子点(70 点)', `f ${B.fJ}・c_R ${cRn(B.cR)}・x ${ff(B.x, 4)}・金星の等大の残り ${ff(B.venusResEq, 5)}`],
      ['金星の等大の残り 2% 以下の格子点の数・その内で一番近い点', `${J.t2.nKeep}・f ${K.fJ}・c_R ${cRn(K.cR)}・x ${ff(K.x, 4)}`],
      ['リポジトリの f(0.06487)・規則の半径の x と、イオの金星の条件での残り', `${ff(J.t2.cells.find((c) => c.fJ === 0.06487 && c.cR === null).x, 4)}・${ff(J.t2.cells.find((c) => c.fJ === 0.06487 && c.cR === null).ioResAtUV, 4)}`],
      ['x(全部の作り)の、c_R を置いた格子点(規則の半径を除く 63 点)の最小・最大', `${f3(Math.min(...J.t2.cells.filter((c) => c.cR !== null).map((c) => c.x)))}・${f3(Math.max(...J.t2.cells.filter((c) => c.cR !== null).map((c) => c.x)))}`],
      ['x(母天体由来だけ・他の源の重みなし —— 〔第353便c〕の作り)が 1 に一番近い c_R を置いた点と、そのときの金星の等大の残り', (() => { const a = J.t2.cells.filter((c) => c.cR !== null).reduce((b, c) => (Math.abs(Math.log(c.xParBare)) < Math.abs(Math.log(b.xParBare)) ? c : b)); return `f ${a.fJ}・c_R ${cRn(a.cR)}・${ff(a.xParBare, 4)}・${ff(a.venusResEq, 4)}`; })()],
    ].map(([a, b]) => `| ${a} | ${b} |`).join('\n'); }
  T.t3 = '| 受け手 ← 源 | 質量 kg | 観測半径 m | 軌道の半径 m | c_R★ | 母天体の重み ÷ 自分の重み(規則の半径) | 同(c_R 1) | 太陽の重み ÷ 母天体の重み |\n|---|---|---|---|---|---|---|---|\n'
    + J.t3.moons.map((m) => `| ${m.name} ← ${m.src === 'Jupiter' ? '木星' : '土星'}(赤道の円の道) | ${fe(m.m)} | ${fe(m.R)} | ${fe(m.a)} | ${f3(m.cRStar)} | ${fe(m.wSoverA0rule)} | ${f3(m.wSoverA0cR1)} | ${f3(m.wSun / m.wS)} |`).join('\n')
    + '\n' + J.t3.pairs.map((p) => `| ${({ Io: 'イオ ← 木星', Moon: '月 ← 地球', Venus: '金星 ← 太陽' })[p.id]}(実在の組) | — | — | — | ${f3(p.cRStar)} | ${fe(p.wSoverA0rule)} | ${f3(p.wSoverA0cR1)} | — |`).join('\n');
  T.t3scan = '| 組 | c_R | x | 等大の残り | φ ° | 太陽由来 ÷ 母天体由来 |\n|---|---|---|---|---|---|\n'
    + J.t3.scan.flatMap((s) => s.cells.map((c) => `| ${NM[s.key]} | ${cRn(c.cR)} | ${f3(c.x)} | ${f3(c.resEq)} | ${ff(c.phiDeg, 2)} | ${fe(c.sunOverPar)} |`)).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const row = (k) => J.t1.rows.find((r) => r.key === k).cells, io = row('Io|Jupiter'), mo = row('Moon|EarthHi'), cnt = (c, b) => J.t1.counts.find((x) => x.col === c).bands[b].n;
  const B = J.t2.best, sIo = J.t3.scan.find((s) => s.key === 'Io|Jupiter').cells, sMo = J.t3.scan.find((s) => s.key === 'Moon|EarthHi').cells, m = (k) => J.t3.moons.find((x) => x.key === k);
  return {
    t1: `x が 0.9〜1.1 に入る組(金星を除く)は、(i) ${cnt('i', 0)}・(ii) ${cnt('ii', 0)}(イオ ← 木星 ${ff(io.ii.x, 3)})・(iii) ${cnt('iii-1e-3', 0)}・${cnt('iii-0.0128', 0)}・(iv) ${cnt('iv-1e-3', 0)}・${cnt('iv-0.0128', 0)}・(v) ${cnt('v', 0)}。0.5〜2 では (i) ${cnt('i', 1)}・(ii) ${cnt('ii', 1)}・(iii) c_R 0.0128 ${cnt('iii-0.0128', 1)}(月の 3 行)・(iv) c_R 0.0128 ${cnt('iv-0.0128', 1)}。`,
    io: `イオ ← 木星の x は、c_R を置くと (iii) c_R 1e-3 で ${ff(io['iii-1e-3'].x, 3)}・0.0128 で ${ff(io['iii-0.0128'].x, 3)} に上がる(金星の (S) もイオの (S) も c_R とともに大きくなり、他の源の重みを分母に入れる作りではイオの伸びが大きい)。等大の残りは ${ff(io.i.resEq, 4)} → ${ff(io['iv-0.0128'].resEq, 4)} でほとんど動かない。`,
    t2: `表 2 の 70 点で x が 1 に一番近いのは f ${B.fJ}(σ ${ff(B.sigmaJ, 4)} —— リポジトリの f 0.06487 より大きいノブ)・c_R ${cRn(B.cR)} の ${ff(B.x, 4)}(金星の等大の残り ${ff(B.venusResEq, 5)})。c_R を置いた 63 点の x は ${f3(Math.min(...J.t2.cells.filter((c) => c.cR !== null).map((c) => c.x)))}〜${f3(Math.max(...J.t2.cells.filter((c) => c.cR !== null).map((c) => c.x)))}。`,
    t3: `c_R★(自分の重み = 母天体の重み)は、イオ ${f3(m('io').cRStar)}・エウロパ ${f3(m('europa').cRStar)}・ガニメデ ${f3(m('ganymede').cRStar)}・カリスト ${f3(m('callisto').cRStar)}・タイタン ${f3(m('titan').cRStar)}・月 ${f3(J.t3.pairs.find((p) => p.id === 'Moon').cRStar)}(1 より大きい)。イオの局所は母天体由来が太陽由来の ${fe(1 / sIo[sIo.length - 1].sunOverPar)} 倍(c_R 1)で、φ は ${ff(sIo[0].phiDeg, 2)}° → ${ff(sIo[sIo.length - 1].phiDeg, 2)}°。月は太陽由来が母天体由来の ${fe(sMo[sMo.length - 1].sunOverPar)} 倍(c_R 1)で、φ は ${ff(sMo[0].phiDeg, 2)}° → ${ff(sMo[sMo.length - 1].phiDeg, 2)}°・等大の残りは ${f3(mo.i.resEq)} → ${f3(sMo[sMo.length - 1].resEq)}。`,
  };
}
