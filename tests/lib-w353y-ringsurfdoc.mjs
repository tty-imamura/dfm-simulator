// 第353便y(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R489):
// **正本 tests/out/ringsurf-353y.json から PHYSICS〔第353便y〕の表を作る文書の lib**
// (QA docs.ringsurf353y が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353y-ringsurfdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : x === 0 ? '< 1e-9' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const dec = (y) => (fin(y) && y !== 0 ? Math.log10(1 / Math.abs(y)).toFixed(2) : '—');
const KEYN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const PLN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });
const GRN = Object.freeze({ inner: '内側の惑星', giant: '巨大な惑星' });
const AXN = Object.freeze({ L: '主: L(角運動量の重み)', eq: '比べる列: eq(等重み)' });
const sgN = (q) => (q.lit ? `${q.sigma}(比べる列: LIT.regions —— 文献の値・未照合)` : `${q.sigma}`);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['引きずられる側(受け手)を「環の粒子 1 つ」〔第353便k〕のほかに、「輪の周りの粒子の集まり」(周りの粒子の重みの和を場の分母に足す)・「輪全体を 1 つの剛体の輪」(質量 = 面密度 × 面積・半径 = 輪の半径 × 構造の係数)と読む列を並べる。面密度はノブ。「計算が合う方式」は表で選ぶ(本節は選ばない)', '表 2・表 3・表 4・表 5']),
  Object.freeze(['読みは (C2) を主に・(C1) は比べる列(〔第353便k〕の作り (F2) には両方・(F1) には (C2) だけ)。係数(面密度・構造の係数・粒子の大きさ)はノブ(値は未照合)の格子', '表 3・表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 面密度 0 の (F2) = 〔第353便k〕の diskStd(区分 5 × 読み 2 × 扁平 (O0)(O2b) —— 相対差の最大) | ${fl9(Math.max(...S.vsDiskStd))} | ${tf(G.vsDiskStd)} |`,
    `| ② 〔第353便k〕の正本の主 (O0)(F2) の最小と最大 | ${S.kLo.toPrecision(3)}〜${S.kHi.toPrecision(3)} | ${tf(G.anchor353k)} |`,
    `| ③ 面密度 0 の (F1) = 〔第353便k〕の axStd(区分 5 —— 相対差の最大) | ${fl9(Math.max(...S.vsAxStd))} | ${tf(G.vsAxStd)} |`,
    `| ④ 輪の中心での周りの粒子の重みの和 = 2π Σ dr(相対差) | ${fl9(S.surfOrigin)} | ${tf(G.surfOrigin)} |`,
    `| ⑤ 区切りの細かさ(径の向き 48 と 96 の相対差の最大)・Σ に比例(相対差) | ${fe(Math.max(...S.surfConv))}・${fl9(S.surfLinear)} | ${tf(G.surfConv)} |`,
    `| ⑥ extraW の口: 重みを直に渡すのと面密度から作るのが同じ((F2)・(F1) —— 相対差の最大) | ${fl9(Math.max(...S.extraSame))} | ${tf(G.extraSame)} |`,
    `| ⑦ 閉じた形 v(W) = α (W + w_S) ÷ W²: 3 点目・β = −α w_S・Σ★ での比・比 − 1 の直接の式・公転面の v ÷ v★(相対差の最大) | ${fl9(Math.max(...S.abCheck, ...S.abBeta, S.ratioClosed, S.dDirect, ...S.planeClosed))} | ${tf(G.abCheck)} |`,
    `| ⑧ 公転面: 基準軸 L = 〔第353便k〕の planeStd(地球・木星 × 受け手 2 —— 相対差の最大) | ${fl9(Math.max(...S.vsPlane))} | ${tf(G.vsPlane)} |`,
    `| ⑨ 剛体の輪の質量 = Σ π(r1² − r0²)・剛体の口に粒子の質量と半径を渡すと粒子の口と同じ数 | ${fl9(S.rigidMass)}・${fl9(S.rigidSame)} | ${tf(G.rigid)} |`,
    `| ⑩ 拒否(負の面密度・幅・核 α 2・読みの名・源の半径の名・作りの名・面密度 0 の剛体・基準軸の名・区分の名) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.den = ['| 区分 | 内縁〜外縁(km) | 周りの粒子の重み ÷ Σ(kg/m ÷ kg/m²) | 源の重み(kg/m) | 粒子 1 つの重み(kg/m) | 太陽の重み(F1 —— kg/m) | Σ★ 粒子 1 つ(kg/m²) | Σ★ 源 (F2)(kg/m²) | Σ★ 源 + 太陽 (F1)(kg/m²) | Σ★ での率の比 (F2) | Σ★ での率の比 (F1) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${KEYN[r.key]} | ${Math.round(r.r0 / 1e3)}〜${Math.round(r.r1 / 1e3)} | ${fe(r.perSigma)} | ${fe(r.den.srcF2)} | ${fe(r.den.oneF2)} | ${fe(r.den.sunF1)} | ${fe(r.star.F2.sigmaOne)} | ${fe(r.star.F2.sigmaSrc)} | ${fe(r.star.F1.sigmaSrc)} | ${r.star.F2.ratio.toFixed(3)} | ${r.star.F1.ratio.toFixed(3)} |`)].join('\n');
  const scanRows = (rows) => rows.map((x) => [x.r, x.q]).map(([r, q]) => `| ${KEYN[r.key]} | ${sgN(q)} | ${fe(q.surfOverSrc)} | ${fe(q.F2C2.yard)} | ${fe(q.F2C2.d)} | ${fe(q.F2C1.yard)} | ${fd(q.F2C1.d)} | ${fe(q.F1C2.yard)} | ${fe(q.F1C2.d)} |`);
  const H = '| 区分 | 面密度 Σ(kg/m²) | 周りの粒子の重み ÷ 源の重み | 主: (F2)(C2) 率 ÷ 物差し | (F2)(C2) Σ 0 からの変化 | 比べる列: (F2)(C1) 率 ÷ 物差し | (F2)(C1) Σ 0 からの変化 | (F1)(C2) 率 ÷ 物差し | (F1)(C2) Σ 0 からの変化 |';
  T.scan = [H, '|---|---|---|---|---|---|---|---|---|', ...scanRows(J.t1.flatMap((r) => r.rows.map((q) => ({ r, q }))))].join('\n');
  T.wide = [H.replace('面密度 Σ(kg/m²)', '面密度 Σ(kg/m² —— 格子の外)'), '|---|---|---|---|---|---|---|---|---|', ...scanRows(J.t1.flatMap((r) => r.wide.map((q) => ({ r, q }))))].join('\n');
  const rec = [];
  for (const r of J.t2) {
    rec.push(`| ${KEYN[r.key]} | 粒子 1 つ(〔第353便k〕—— 1 m・c_R 1) | ${fe(r.particle.A0OverWS)} | ${fe(r.particle.yardF2)} | ${fe(r.particle.yardF1)} | ${dec(r.particle.yardF2)} |`);
    for (const c of r.collective) { const q = J.t1.find((x) => x.key === r.key).rows.find((x) => x.sigma === c.sigma);
      rec.push(`| ${KEYN[r.key]} | 周りの粒子の集まり(Σ ${sgN(q)}) | ${fe(q.surfOverSrc)} | ${fe(c.yardF2)} | ${fe(c.yardF1)} | ${dec(c.yardF2)} |`); }
    for (const g of r.rigid) rec.push(`| ${KEYN[r.key]} | 輪全体を剛体の輪(Σ ${g.sigma}・c_R ${g.cR}) | ${fe(g.A0OverWS)} | ${fe(g.yardF2)} | ${fe(g.yardF1)} | ${dec(g.yardF2)} |`);
  }
  T.recv = ['| 区分 | 受け手の読み | 受け手の側の重み ÷ 源の重み | (F2)(C2) 率 ÷ 物差し | (F1)(C2) 率 ÷ 物差し | 物差しまでの桁(F2) |', '|---|---|---|---|---|---|', ...rec].join('\n');
  T.rigidStar = ['| 区分 | 輪の質量(Σ = LIT.regions —— kg) | c_R 0.01 の Σ★(kg/m²) | c_R 0.1 の Σ★ | c_R 1 の Σ★ |', '|---|---|---|---|---|',
    ...J.t2.map((r) => { const lit = r.rigid.filter((g) => g.sigma === r.rigid[0].sigma); return `| ${KEYN[r.key]} | ${fe(lit[0].m)} | ${lit.map((g) => fe(g.sigmaStar)).join(' | ')} |`; })].join('\n');
  T.plane = ['| 基準軸 | 群 | 惑星 | 質量 ÷ 太陽の質量 | 自分の重み ÷ 源の重み q(c_R 1) | 値(C2・c_R 1) | 値(c_R 0.1) | 点の読みの値 ÷ v★ | 閉じた形 (2 + q) ÷ (2(1 + q)²) | 公転面の法線と基準軸の角(°) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${AXN[r.axis]} | ${GRN[r.group]} | ${PLN[r.id]} | ${fe(r.mOverMsun)} | ${fe(r.q)} | ${fe(r.v)} | ${fe(r.v01)} | ${r.vOverStar.toFixed(4)} | ${r.closed.toFixed(4)} | ${r.scatterDeg.toFixed(3)} |`)].join('\n');
  const grp = [];
  for (const ax of ['L', 'eq']) for (const g of ['inner', 'giant']) {
    const rs = J.t3.filter((r) => r.axis === ax && r.group === g), mm = (f) => [Math.min(...rs.map(f)), Math.max(...rs.map(f))];
    const [v0, v1] = mm((r) => r.v), [s0, s1] = mm((r) => r.vStar), [q0, q1] = mm((r) => r.q), [a0, a1] = mm((r) => r.scatterDeg);
    grp.push(`| ${AXN[ax]} | ${GRN[g]} | ${fe(v0)}〜${fe(v1)} | ${fe(s0)}〜${fe(s1)} | ${fe(q0)}〜${fe(q1)} | ${a0.toFixed(3)}〜${a1.toFixed(3)} |`);
  }
  T.group = ['| 基準軸 | 群 | 値(C2・c_R 1) | v★(自分の重み 0・点の読み) | q | 公転面の法線と基準軸の角(°) |', '|---|---|---|---|---|---|', ...grp].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, all = J.t1.flatMap((r) => r.rows), wide = J.t1.flatMap((r) => r.wide);
  const mx = (f, rs) => Math.max(...rs.map(f));
  F.scan = `面密度 Σ 1〜1e4 kg/m²(格子)と LIT.regions の Σ では、周りの粒子の重み ÷ 源の重みは ${fe(Math.min(...all.map((q) => q.surfOverSrc)))}〜${fe(mx((q) => q.surfOverSrc, all))} で、率の Σ 0 からの変化は (F2)(C2) ${fe(Math.min(...all.map((q) => q.F2C2.d)))}・(F1)(C2) ${fe(Math.min(...all.map((q) => q.F1C2.d)))}・(F2)(C1) の大きさ ${all.every((q) => q.F2C1.d === 0) ? '1e-9 より小さい' : fe(Math.min(...all.map((q) => q.F2C1.d)))}(どれも下がる向き —— 上がる欄は ${all.concat(wide).filter((q) => q.F2C2.d > 0 || q.F1C2.d > 0 || q.F2C1.d > 0).length})`;
  F.star = `周りの粒子の重みが粒子 1 つの重みを越える面密度は ${fe(Math.min(...J.t1.map((r) => r.star.F2.sigmaOne)))}〜${fe(Math.max(...J.t1.map((r) => r.star.F2.sigmaOne)))} kg/m²・源の重みと同じになる面密度 Σ★ は (F2) ${fe(Math.min(...J.t1.map((r) => r.star.F2.sigmaSrc)))}〜${fe(Math.max(...J.t1.map((r) => r.star.F2.sigmaSrc)))}・(F1) ${fe(Math.min(...J.t1.map((r) => r.star.F1.sigmaSrc)))}〜${fe(Math.max(...J.t1.map((r) => r.star.F1.sigmaSrc)))} kg/m² —— そのときの率の比は (F2) ${J.t1[0].star.F2.ratio.toFixed(3)}・(F1) ${Math.min(...J.t1.map((r) => r.star.F1.ratio)).toFixed(3)}〜${Math.max(...J.t1.map((r) => r.star.F1.ratio)).toFixed(3)}`;
  const dp = J.t2.map((r) => dec(r.particle.yardF2)), dr = J.t2.flatMap((r) => r.rigid.map((g) => Math.abs(g.yardF2 / r.particle.yardF2 - 1)));
  F.recv = `受け手の読み 3 つ(粒子 1 つ・周りの粒子の集まり・輪全体を剛体の輪 —— Σ ≤ 1e4・c_R 0.01〜1)の物差しまでの桁は、区分ごとに 3 つとも同じ(${dp.slice().sort()[0]}〜${dp.slice().sort()[dp.length - 1]} 桁 —— 剛体の輪と粒子 1 つの率の差は最大 ${fe(Math.max(...dr))})`;
  const pick = (ax, g, f) => J.t3.filter((r) => r.axis === ax && r.group === g).map(f);
  const qi = pick('L', 'inner', (r) => r.q), qg = pick('L', 'giant', (r) => r.q), ci = pick('L', 'inner', (r) => r.closed), cg = pick('L', 'giant', (r) => r.closed);
  F.plane = `公転面の集まり(基準軸 L・c_R 1): 内側の惑星は q ${fe(Math.min(...qi))}〜${fe(Math.max(...qi))}・閉じた形の倍 ${Math.min(...ci).toFixed(3)}〜${Math.max(...ci).toFixed(3)}/巨大な惑星は q ${fe(Math.min(...qg))}〜${fe(Math.max(...qg))}・閉じた形の倍 ${Math.min(...cg).toFixed(4)}〜${Math.max(...cg).toFixed(4)}`;
  return F;
}
