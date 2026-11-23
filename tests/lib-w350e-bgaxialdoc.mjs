// 第350便e(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R422):
// **正本 tests/out/bgaxial-350e.json から PHYSICS〔第350便e〕の表を作る文書の lib**
// (QA docs.bgaxial350e が節の表と逐語で照合する —— 表の数は有効数字 3 桁〔格子の表は 6 桁〕・角は小数 2 桁)。原文(言葉を変えずに引く)と、並進の背景との違いの表もここに持つ。
export const DOC_VERSION = 'w350e-bgaxialdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(6));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const CAND = Object.freeze({ P2: '(C1)', W: '(C2)' });
const DIR = Object.freeze({ gal: '銀河の軸', eclPole: '黄道の極', sunSpin: '太陽の自転軸' });
const REACH = Object.freeze({ reach: '届く', unreached: '届かない', noObs: '比べる数なし' });
const ROLE = Object.freeze({ lit: '文献の値・未照合', order: '桁', otherQty: '別の量(軌道の交点)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '太陽系サンプルでは、銀河由来の軸引きずりは、背景軸引きずりとして扱う']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '安定している天体の運行は、結果として釣り合っている。釣り合う軸の向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、その方向を軸に歳差運動が現れる']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '下記の案も検証する。対象の組は、慣性決定力のgeoPN=3']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['新しい語「背景軸引きずり」Ω_bg: 銀河を粒子として箱に入れず、銀河由来の軸引きずりを背景のベクトルとして与える。並進の背景(背景の決定力・重み W₀ —— 在位の geoPN=3 の本は 0 だけ受理)とは別の量で、W₀ は 0 のまま。置き方は 3 列 (B1)(B2)(B3)', '表 2・表 3・表 6・表 7']),
  Object.freeze(['「釣り合う軸の向き」= Ω_bg とサンプルの中の源の軸引きずりの和の方向((W1) —— 率の大きさを 1 回だけ掛けたベクトルの和)。「その方向を軸に歳差運動が現れる」= 観測の自転軸はその方向のまわりを回る(円錐の半頂角 = 2 つの向きのなす角 δ・率 = 和の大きさ)。衛星の母天体の項は、足す列と足さない列の 2 列(AN1001 —— 伺っている)', '表 4・表 5']),
  Object.freeze(['場は在位の geoPN=3 の本が宣言している形(K1 の核・源の回転は球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)—— 第348便h の makeField3 の既定', '全部の表']),
  Object.freeze(['当時の文(消さずに並べる)。第146報では「ジャイロトルクで釣り合いつつ歳差運動をしている」が「その方向を軸に歳差運動が現れる」になり、「釣り合う向き」が「釣り合う軸の向き」になった。係数 c_R のノブは枝 f', '表 4']),
]);
export function originalTable(readings = READINGS) {
  const rows = ['| # | 出どころ | 原文 | 統括の読み | 数えた所 |', '|---|---|---|---|---|'];
  ORIGINAL.forEach(([src, o], k) => rows.push(`| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`));
  return rows.join('\n');
}
/** 並進の背景と背景軸引きずりの違い(どの量が分母に入るか・回転に入るか) */
export const BG_TABLE = ['| 量 | 並進の背景(背景の決定力・重み W₀) | 背景軸引きずり Ω_bg(本節) |', '|---|---|---|',
  '| 何か | 場の分母に足す一様な重み(geoPN=3 の場 u = [Σ_j W_j (V_j − v_i) + Σ_j T_j] ÷ (W₀ + W_ii + Σ_j W_j)) | 釣り合う軸の向きの和に足す回転のベクトル(rad/s) |',
  '| 分母に入るか | 入る(W₀) | 入らない(W₀ は 0 のまま)。分母の列 in は第348便h の形(太陽由来・母天体由来の項の分母に銀河の重みを含む)・out は銀河を箱に入れない形 |',
  '| 回転に入るか | 入らない(一様なので勾配が無い —— 回転は分母の大きさを通してだけ変わる) | 入る(Ω_釣 = Ω_bg + Ω_S + Ω_P) |',
  '| 在位の geoPN=3 の本 | 0 だけ受理 | 鍵は無い(本節は診断の器だけ —— アプリに足さない) |',
  '| 置き方 | 倍 k × 自分の重みの中心の値(第348便h のノブ) | (B1) 銀河を geoPN=3 の場の源として数えた値・(B2) k_bg × (B1)・(B3) 向きのノブ(大きさは (B1)) |'].join('\n');

const pairName = (r) => `${NM[r.id]} | ${NM[r.src]}`;
export function tablesOf(J) {
  const T = {};
  // 表 2: (B1) の大きさと向き(15 組 × (C1)(C2))
  { const rows = ['| 天体 | 源 | 読み | abs(B1) rad/年 | (B1) と銀河の軸の角 | (B1) と自転軸の角 | (B1) と黄道の極の角 | abs(Ω_S) rad/年 | abs(B1) ÷ abs(Ω_S) | 銀河の重み ÷ 自分の重み | β_G | β_S |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.bg) rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${CAND[r.cand]} | ${fe(r.b1MagYr)} | ${f2(r.b1ToGalDeg)} | ${f2(r.b1ToSpinDeg)} | ${f2(r.b1ToEclDeg)} | ${fe(r.sMagYr)} | ${fe(r.b1OverS)} | ${fe(r.wGalOverSelf)} | ${fe(r.betaG)} | ${fe(r.betaS)} |`);
    T.t2 = rows.join('\n'); }
  // 表 4: 合成の方向と歳差(分母 in・k_bg 1 = (B1)・母天体あり/なし)
  { const f = (id, src, cand, par) => J.bal.find((x) => x.id === id && x.src === src && x.den === 'in' && x.k === 1 && x.cand === cand && x.parent === par);
    const rows = ['| 天体 | 源 | (C1) 母天体あり: 率 ″/年・δ° | (C1) 母天体なし: 率 ″/年・δ° | (C2) 母天体あり: 率 ″/年・δ° | (C2) 母天体なし: 率 ″/年・δ° | 合成の方向と公転の軸の角((C1)・あり) | 合成の方向と銀河の軸の角((C1)・あり) | 母天体の項 ÷ 太陽由来((C1)) | 比べる数 ″/年 | 比((C1)・あり) |', '|---|---|---|---|---|---|---|---|---|---|---|'];
    const seen = new Set();
    for (const r of J.bal) { const k = r.id + '|' + r.src; if (seen.has(k)) continue; seen.add(k);
      const a = f(r.id, r.src, 'P2', 'with'), b = f(r.id, r.src, 'P2', 'without'), c = f(r.id, r.src, 'W', 'with'), d = f(r.id, r.src, 'W', 'without');
      rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${fe(a.precAsYr)}・${f2(a.coneDeg)} | ${fe(b.precAsYr)}・${f2(b.coneDeg)} | ${fe(c.precAsYr)}・${f2(c.coneDeg)} | ${fe(d.precAsYr)}・${f2(d.coneDeg)} | ${f2(a.toOrbNDeg)} | ${f2(a.toGalDeg)} | ${fe(a.pOverS)} | ${a.obsAsYr === null ? '—' : f6(a.obsAsYr) + '(' + ROLE[a.obsRole] + ')'} | ${fe(a.ratio)} |`); }
    T.t4 = rows.join('\n'); }
  // 表 5: k_bg 0 と 1・分母 in と out((C1)・母天体あり)—— 相対の差
  { const f = (id, src, den, k) => J.bal.find((x) => x.id === id && x.src === src && x.den === den && x.k === k && x.cand === 'P2' && x.parent === 'with');
    const rows = ['| 天体 | 源 | 率 k_bg 0(背景軸引きずり無し)″/年 | 率 k_bg 1((B1))″/年 | (k 1 − k 0) ÷ k 0 | 率 分母 out ″/年 | (out − in) ÷ in | δ の差 k 1 − k 0(°) |', '|---|---|---|---|---|---|---|---|'];
    const seen = new Set();
    for (const r of J.bal) { const k = r.id + '|' + r.src; if (seen.has(k)) continue; seen.add(k);
      const a = f(r.id, r.src, 'in', 0), b = f(r.id, r.src, 'in', 1), c = f(r.id, r.src, 'out', 1);
      rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${f6(a.precAsYr)} | ${f6(b.precAsYr)} | ${fe(b.precAsYr / a.precAsYr - 1)} | ${f6(c.precAsYr)} | ${fe(c.precAsYr / b.precAsYr - 1)} | ${fe(b.coneDeg - a.coneDeg)} |`); }
    T.t5 = rows.join('\n'); }
  // 表 6: k_bg × 向きの格子(4 組 × 読み 2 × 向き 3)
  { const rows = ['| 天体 | 源 | 読み | 向き | k_bg 0 | 1 | 10 | 10² | 10³ | 10⁴ | δ k_bg 0(°) | δ k_bg 10⁴(°) |', '|---|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const [id, src] of J.decl.t4) for (const cand of J.decl.cands) for (const dir of J.decl.dirs) {
      const g = J.grid.filter((x) => x.id === id && x.src === src && x.cand === cand && x.dir === dir);
      rows.push(`| ${NM[id]} | ${NM[src]} | ${CAND[cand]} | ${DIR[dir]} | ${J.decl.kbg.map((k) => f6(g.find((x) => x.k === k).precAsYr)).join(' | ')} | ${f2(g.find((x) => x.k === 0).deltaDeg)} | ${f2(g.find((x) => x.k === 10000).deltaDeg)} |`); }
    T.t6 = rows.join('\n'); }
  // 表 7: 比べる数に届く k_bg
  { const rows = ['| 天体 | 源 | 読み | 向き | 向きと自転軸の角(°) | 比べる数 ″/年 | 届く k_bg | その k_bg での δ(°) | 判定 |', '|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.need) rows.push(`| ${NM[r.id]} | ${NM[r.src]} | ${CAND[r.cand]} | ${DIR[r.dir]} | ${f2(r.dirToSpinDeg)} | ${r.obsAsYr === null ? '—' : f6(r.obsAsYr) + '(' + ROLE[r.obsRole] + ')'} | ${fe(r.kNeed)} | ${r.atK ? f2(r.atK.deltaDeg) : '—'} | ${REACH[r.reach]} |`);
    T.t7 = rows.join('\n'); }
  // 表 8: 零試験と共通の点検の数
  { const S = J.pure.scenes, c = S.common, G = J.pure.gates;
    const rows = ['| # | 試験 | 数 | 門 |', '|---|---|---|---|',
      `| ① | 共通の点検の数: x の直径の 2 点の差分の z・6 点の平均の z・rot3('W') の z | ${c.diaXz.toFixed(8)}・${c.sixZ.toFixed(8)}・${c.rotWz.toFixed(8)} | ${G.common ? '真' : '偽'} |`,
      `| ② | 反転で符号が反転・中心線の通過・相対静止・源 1 つ(自分の重みも背景も 0)・同じ速度を足す | 最大 ${fe(Math.max(c.reverse, c.line, c.rest, c.noSelf, c.galilei))} | ${G.commonSym ? '真' : '偽'} |`,
      `| ③ | 剛体回転 (1,2,3) × r の 6 点の平均・x の直径/純粋なずれ (y,x,0) の x の直径・6 点の平均 | (${c.rigidSix.map((v) => v.toFixed(6)).join(', ')})・(${c.rigidX.map((v) => Math.abs(v).toFixed(6)).join(', ')})/${c.shearX[2].toFixed(6)}・${Math.abs(c.shearSix[2]).toFixed(6)} | ${G.commonRigid ? '真' : '偽'} |`,
      `| ④ | (B1) k_bg 1 は第348便c の合成 (W1)・(W1) + 母天体と同じ/k_bg 0 は源の項だけ | ${S.vs348 < 1e-12 ? '< 1e-12' : fe(S.vs348)}・${S.k0 === 0 ? '0' : fe(S.k0)} | ${G.vs348h ? '真' : '偽'} |`,
      `| ⑤ | 背景を 2 倍にすると背景の項だけ 2 倍(源の項は同じビット)・(B3) の大きさは abs(B1) | ${S.dbl === 0 ? '0' : fe(S.dbl)}・${S.sumDiff < 1e-6 ? '< 1e-6' : fe(S.sumDiff)}・${S.dirMag < 1e-12 ? '< 1e-12' : fe(S.dirMag)} | ${G.doubleBg ? '真' : '偽'} |`,
      `| ⑥ | 母天体の列の切り替え: 太陽のまわりの組は同じ・イオと月は変わる | ${S.togSun === 0 ? '0' : fe(S.togSun)}・${fe(S.togIo)}・${fe(S.togMoon)} | ${G.parentToggle ? '真' : '偽'} |`,
      `| ⑦ | 同じ重みを 2 度掛けない(和は各項のベクトルの和)・変異(abs(Ω) × Ω)で向きが動く(°) | ${S.once === 0 ? '0' : fe(S.once)}・${f2(S.twiceMoves)} | ${G.weightOnce ? '真' : '偽'} |`,
      `| ⑧ | ほぼ 0 の合成は「向きは決まらない」(0 で割らない) | ${S.degen.und && S.degen.near ? '決まらない' : '—'} | ${G.degenerate ? '真' : '偽'} |`,
      `| ⑨ | 分母の列 in と out の差(地球の太陽由来)・k_bg の根で率が比べる数に戻る | ${fe(S.denE)}・${S.knBack < 1e-9 ? '< 1e-9' : fe(S.knBack)} | ${G.denCols ? '真' : '偽'} |`,
      `| ⑩ | 入力の拒否(k_bg < 0・向きの名・向きの単位ベクトル無し・空の和・分母の列の名・比べる数 ≤ 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${G.rejects ? '真' : '偽'} |`];
    T.t8 = rows.join('\n'); }
  return T;
}
export function factsOf(J) {
  const F = {}, b = (id, src, cand, par, k = 1, den = 'in') => J.bal.find((x) => x.id === id && x.src === src && x.den === den && x.k === k && x.cand === cand && x.parent === par);
  const e1 = b('Earth', 'Sun', 'P2', 'with'), e2 = b('Earth', 'Sun', 'W', 'with'), e0 = b('Earth', 'Sun', 'W', 'with', 0), e10 = b('Earth', 'Sun', 'P2', 'with', 0);
  F.earth = `地球(在位の形・(B1)・母天体の項なし)の歳差の率は (C1) ${fe(e1.precAsYr)}″/年・(C2) ${fe(e2.precAsYr)}″/年(δ ${f2(e1.coneDeg)}°・比べる数 ${f6(e1.obsAsYr)}″/年〔文献の値・未照合〕との比 (C1) ${fe(e1.ratio)}・(C2) ${fe(e2.ratio)})。`;
  F.earth0 = `背景軸引きずり無し(k_bg 0)の地球は (C1) ${fe(e10.precAsYr)}″/年・(C2) ${fe(e0.precAsYr)}″/年 —— (B1) との相対の差は ${fe(e10.precAsYr / e1.precAsYr - 1)}(有効数字 3 桁では同じ)。`;
  const bE = J.bg.find((r) => r.id === 'Earth' && r.cand === 'P2'), bMin = Math.min(...J.bg.filter((r) => r.cand === 'P2').map((r) => r.b1MagYr)), bMax = Math.max(...J.bg.filter((r) => r.cand === 'P2').map((r) => r.b1MagYr));
  F.b1 = `(B1) の大きさは (C1) で ${fe(bMin) === fe(bMax) ? '15 組とも ' + fe(bMin) : fe(bMin) + '〜' + fe(bMax)} rad/年(規則の半径では自分の重みの中心の値が質量に依らない)・地球の abs(B1) ÷ abs(Ω_S) = ${fe(bE.b1OverS)}。`;
  const n = (cand, dir) => J.need.find((r) => r.id === 'Earth' && r.cand === cand && r.dir === dir);
  F.need = `地球の比べる数に届く k_bg は (C1) で 銀河の軸 ${fe(n('P2', 'gal').kNeed)}(δ ${f2(n('P2', 'gal').atK.deltaDeg)}°)・黄道の極 ${fe(n('P2', 'eclPole').kNeed)}(δ ${f2(n('P2', 'eclPole').atK.deltaDeg)}°)・太陽の自転軸 ${fe(n('P2', 'sunSpin').kNeed)}(δ ${f2(n('P2', 'sunSpin').atK.deltaDeg)}°)、(C2) で 銀河の軸 ${fe(n('W', 'gal').kNeed)} —— 格子の上端 10⁴ より ${Math.floor(Math.log10(n('P2', 'eclPole').kNeed / 1e4))} 桁以上 上。`;
  const g4 = J.grid.find((r) => r.id === 'Earth' && r.cand === 'P2' && r.dir === 'gal' && r.k === 10000), g0 = J.grid.find((r) => r.id === 'Earth' && r.cand === 'P2' && r.dir === 'gal' && r.k === 0);
  F.grid = `格子の上端 k_bg 10⁴(銀河の軸)では地球の (C1) の率は ${f6(g4.precAsYr)}″/年(k_bg 0 の ${f6(g4.precAsYr / g0.precAsYr)} 倍)・δ ${f2(g4.deltaDeg)}°。`;
  const sg = (dir, k) => J.grid.find((r) => r.id === 'Saturn' && r.cand === 'P2' && r.dir === dir && r.k === k);
  F.saturn = `土星(abs(B1) ÷ abs(Ω_S) が 4 組で最大)では k_bg 10⁴ の (C1) の率が k_bg 0 の ${f6(sg('gal', 10000).precAsYr / sg('gal', 0).precAsYr)} 倍(銀河の軸 —— δ ${f2(sg('gal', 0).deltaDeg)}° → ${f2(sg('gal', 10000).deltaDeg)}°)・${f6(sg('eclPole', 10000).precAsYr / sg('eclPole', 0).precAsYr)} 倍(黄道の極 —— δ ${f2(sg('eclPole', 10000).deltaDeg)}°)。`;
  const io = b('Io', 'Jupiter', 'P2', 'with'), ion = b('Io', 'Jupiter', 'P2', 'without'), mo = b('Moon', 'EarthHi', 'P2', 'with'), mon = b('Moon', 'EarthHi', 'P2', 'without');
  F.parent = `母天体の列: イオ(源 木星)の (C1) は あり ${fe(io.precAsYr)}″/年・なし ${fe(ion.precAsYr)}″/年、月(源 地球・傾きの最大の位相)は あり ${fe(mo.precAsYr)}″/年・なし ${fe(mon.precAsYr)}″/年。`;
  const dE = J.den.find((r) => r.id === 'Earth' && r.cand === 'P2');
  F.den = `分母の列: 銀河の重みを分母から外すと、太陽由来の項の大きさは相対で ${fe(dE.sRatio)} 変わる(向きの差 ${f2(dE.sAngDeg)}°)。`;
  const c = J.pure.scenes.common;
  F.common = `共通の点検の数(本節の lib で出た値): x の直径の 2 点の差分の z 成分 ${c.diaXz.toFixed(8)}・6 点の平均の z 成分 ${c.sixZ.toFixed(8)}・rot3('W') の z 成分 ${c.rotWz.toFixed(8)}。`;
  return F;
}
