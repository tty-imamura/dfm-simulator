// 第333便b(原仮定者の整理(2026-11-10)・統括の検証項目 R318): **正本 tests/out/axialfield-w333b.json から PHYSICS〔第333便b〕の表を作る文書の lib**
// (QA docs.axialField333b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差・解析と差分の差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w333b-axialfielddoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const g3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (x === 0 ? '0' : Math.abs(x) >= 1e-3 && Math.abs(x) < 1e5 ? f3(x) : fe(x)));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const VJ = Object.freeze({ decrease: '減る', increase: '増す', equal: '同じ' });
/** 天体の表示名(鍵 → 和名) */
export const BODY_JA = Object.freeze({ sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト',
  saturn: '土星', titan: 'タイタン', uranus: '天王星', neptune: '海王星', triton: 'トリトン' });
const nm = (k) => BODY_JA[k] || k;
const rowOf = (rows, k) => rows.find((r) => r.key === k);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, P = J.plan, F = J.field.epoch;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 一様な場(全部の源が同じ並進・自転 0 —— α 4)の \\|ω\\| と \\|J\\| の最大 | ${lt(S.uniform.max, 1e-10)} | ${tf(G.uniform)} |`,
    `| ② 剛体回転の場(1 つの源の自転 Ω だけで正規化)で \\|ω − Ω\\| とひずみの最大(α 4) | ${lt(S.rigid.max, 1e-10)} | ${tf(G.rigid)} |`,
    `| ③ せん断 U = (γy, 0, 0)・γ = 0.6: ω_z・ひずみ xy・差分の ω_z | ${f3(S.shear.omegaZ)}・${f3(S.shear.strainXY)}・${f3(S.shear.fdOmegaZ)} | ${tf(G.shear)} |`,
    `| ④ 解析の J と中心差分(α 4 × 自己と W₀ 3)の相対の差の最大 | ${fe(S.gradient.maxRel)}(${S.gradient.rows.length} 組) | ${tf(G.gradient)} |`,
    `| ⑤ 自転 0 の源の横の通過(原点・速度 (0, 3, 0)・自己の重み 1・m/r²・p = (2, 0, 0)): ω_z・U_y・通過の向きの反転の ω_z・h ÷ h/2 の誤差の比・並進の項の ω_z・自転の項 | ${f3(S.passing.omegaZ)}・${f3(S.passing.Uy)}・${f3(S.passing.reversed)}・${f3(S.passing.h2ratio)}・${f3(S.passing.passPart)}・${S.passing.spinParts} | ${tf(G.passing)} |`,
    `| ⑥ 源だけの正規化(自己・W₀ なし・1 つの源・自転 0)の \\|ω\\| / W₀ = 1 を足した ω_z / 静止の源をもう 1 つ足した \\|ω\\| | ${S.sourceOnly.omega}・${f3(S.sourceOnly.withW0)}・${f3(S.sourceOnly.twoSources)} | ${tf(G.sourceOnly)} |`,
    `| ⑦ 共通の回転座標の引き算: 全部の項(自己と背景も)を回した ω の動き − Ω_c / 源だけを回した ω の動き ÷ \\|Ω_c\\|(源の分の割合 ${f3(S.commonFrame.shareSrc)}) | ${lt(S.commonFrame.allShift, 1e-10)}・${f3(S.commonFrame.srcOnlyShiftOverOc)} | ${tf(G.commonFrame)} |`,
    `| ⑧ 源ごとの分け方(自転の直接・自転のモーメントの勾配・並進)の和と J の相対の差・源 0 の並進だけを残した場と並進の項の差・共通の回転座標の場面の和 | ${lt(S.partsSum.rel, 1e-10)}・${lt(S.partsSum.linear, 1e-10)}・${lt(S.partsSum.frameRel, 1e-10)} | ${tf(G.partsSum)} |`,
    `| ⑨ 源の自転だけの閉じた式 ω = (W/W_t)[s − (α/2)(K/W_t)s_⊥](α 4 × 位置 3)の相対の差 / K ≫ W の赤道面の ω ÷ 源の分(α = 1・2・3)/ 軸の上 | ${lt(S.spinClosed.maxRel, 1e-10)} / ${f3(S.spinClosed.alpha1Eq)}・${lt(S.spinClosed.equatorOverShare, 1e-10)}・${f3(S.spinClosed.alpha3Eq)} / ${f3(S.spinClosed.axisOverShare)} | ${tf(G.spinClosed)} |`,
    `| ⑩ 有限の受け手: 線形の場で pair・ballL・ballCurl と局所の相対の差 / 非線形の場(R = 0.2 と 0.1)の差の比(pair・ballL・ballCurl) | ${S.finite.linear.map((x) => lt(x, 1e-10)).join('・')} / ${S.finite.ratios.map(f3).join('・')} | ${tf(G.finite)} |`,
    `| ⑪ 次数と単位: W₀ = 0 で r_ref を 1 → 37 にした ω の相対の差の最大(α 4)/ W₀ = 0.5 の相対の差(α = 1・1.5・2・3) | ${lt(Math.max(...S.units.rows.map((r) => r.w0zero)), 1e-10)} / ${S.units.rows.map((r) => (r.alpha === 2 ? lt(r.w0pos, 1e-10) : f3(r.w0pos))).join('・')} | ${tf(G.units)} |`,
    `| ⑫ 第332便b の平面の場(呼ぶだけ —— m/r²・座標変換の回転)と同じ値: u の相対の差・渦度の半分と ω_z の差 | ${lt(S.w332bLink.u, 1e-10)}・${lt(S.w332bLink.vortHalf, 1e-10)} | ${tf(G.w332bLink)} |`,
    `| ⑬ 遠心の順行と逆行(第331便b の式を呼ぶ): x = 0.5 の順行・逆行 / x = 2.5 の順行・逆行 / x = 2 / x = 10⁻²⁰ の順行・逆行(剛体と半渦度の軸) | ${S.centrifugal.v.map((v) => VJ[v]).join('・')} | ${tf(G.centrifugal)} |`,
    `| ⑭ 近日点の状態(二体): エネルギーと角運動量の相対の差・動径の速度の割合 | ${lt(S.periapsis.energy, 1e-10)}・${lt(S.periapsis.h, 1e-10)}・${lt(S.periapsis.radial, 1e-10)} | ${tf(G.periapsis)} |`,
    `| ⑮ 入力の拒否(r = 0・α = 0・r_ref = 0・評価点と源の一致・源なしの分母 0・負の自己・2 成分の位置・知らない規則・半径なし・R = 0・知らない受け手の型・Ω < 0・NaN・h = 0・双曲線) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 場の枠と受け手の枠の ω_field(本の時刻・α = 2・W₀ = 0・r_ref = 1 au —— 観測自転の向きへ射影・+ は同じ向き)
  { const A = F.cols['2|none'], Rb = F.cols['2|robs'], Kd = F.cols['2|kappaM'];
    T.fieldA2 = ['| 天体 | 観測自転 s [rad/s] | 場の枠 ω∥ | ω∥ ÷ s | 内 源の自転(直接 + 勾配) | 内 源の並進 | 受け手の枠(観測半径)ω∥ | ÷ s | 受け手の枠(R_d = Y_k m)ω∥ | ÷ s |', '|---|---|---|---|---|---|---|---|---|---|',
      ...P.docBodies.map((k) => { const a = rowOf(A, k), r = rowOf(Rb, k), d = rowOf(Kd, k), b = F.bodies.find((q) => q.key === k);
        return `| ${nm(k)} | ${fe(b.sObs)} | ${fe(a.par)} | ${g3(a.parOverS)} | ${fe(a.parts.spinDirect + a.parts.spinGrad)} | ${fe(a.parts.trans)} | ${fe(r.par)} | ${g3(r.parOverS)} | ${fe(d.par)} | ${g3(d.parOverS)} |`; })].join('\n'); }
  // 表 3 次数 α の比べ(ω∥ ÷ s —— 場の枠と受け手の枠〔観測半径〕)
  T.alpha = ['| 天体 | 場の枠 α = 1 | 1.5 | 2 | 3 | 受け手の枠(観測半径)α = 1 | 1.5 | 2 | 3 |', '|---|---|---|---|---|---|---|---|---|',
    ...P.docBodies.map((k) => `| ${nm(k)} | ${P.alphas.map((a) => g3(rowOf(F.cols[a + '|none'], k).parOverS)).join(' | ')} | ${P.alphas.map((a) => g3(rowOf(F.cols[a + '|robs'], k).parOverS)).join(' | ')} |`)].join('\n');
  // 表 4 今のエンジンの軸の口と新しい定義の部(本の時刻・受け手ごとの和 —— 足さずに並べる)
  { const K1 = J.compare.epoch.k1Rule, K2 = J.compare.epoch.k2Radius;
    T.engine = ['| 受け手 | 今の口 K1・R_d = Y_k m(A = 1)| 新 α = 1・R_d の自転の部 | 新 α = 1・R_d の並進の部 | 符号の一致(源) | 今の口 K2・観測半径(A = 1)| 新 α = 2・観測半径の自転の部 | 新 α = 2・観測半径の並進の部 | 符号の一致(源) |', '|---|---|---|---|---|---|---|---|---|',
      ...P.docBodies.map((k) => { const a = rowOf(K1, k), b = rowOf(K2, k);
        return `| ${nm(k)} | ${fe(a.engineTot)} | ${fe(a.newSpinTot)} | ${fe(a.newTransTot)} | ${a.nSameSign}/${a.nSigned} | ${fe(b.engineTot)} | ${fe(b.newSpinTot)} | ${fe(b.newTransTot)} | ${b.nSameSign}/${b.nSigned} |`; })].join('\n'); }
  // 表 5 全天体の自転 0 の配置(本の時刻の位置と速度): 今の口は 0・新しい定義は並進の部だけが残る
  { const K1 = J.compare.spin0.k1Rule, K2 = J.compare.spin0.k2Radius;
    T.spin0 = ['| 受け手 | 今の口 K1 | 新 α = 1・R_d の並進の部 | 今の口 K2 | 新 α = 2・観測半径の並進の部 | 新 α = 2・観測半径で並進の部が 0 でない源 |', '|---|---|---|---|---|---|',
      ...P.docBodies.map((k) => { const a = rowOf(K1, k), b = rowOf(K2, k); return `| ${nm(k)} | ${a.engineTot} | ${fe(a.newTransTot)} | ${b.engineTot} | ${fe(b.newTransTot)} | ${b.nEngineZeroTransNonzero}/${b.nEngineZero} |`; })].join('\n'); }
  // 表 6 作った配置: 地球 ← 金星(内合)・水星 ← 太陽(近日点)
  { const cell = (g, recv, src) => { const r = rowOf(J.compare[g].k2Radius, recv).srcs.find((q) => q.key === src), r1 = rowOf(J.compare[g].k1Rule, recv).srcs.find((q) => q.key === src);
      const ps = J.field[g].perSource['2|none'][P.keys.indexOf(recv)].find((q) => q.key === src); return { r, r1, ps }; };
    const rows = [];
    for (const [recv, src] of [['earth', 'venus'], [P.keys[1], 'sun']]) for (const g of ['epoch', recv === 'earth' ? 'venusConj' : 'mercuryPeri']) {
      const c = cell(g, recv, src);
      rows.push(`| ${nm(recv)} ← ${nm(src)} | ${{ epoch: '本の時刻', venusConj: '金星の内合(作った配置)', mercuryPeri: '水星の近日点(作った配置)' }[g]} | ${fe(c.ps.spinDirect + c.ps.spinGrad)} | ${fe(c.ps.trans)} | ${fe(c.r.newSpin)} | ${fe(c.r.newTrans)} | ${fe(c.r.engine)} | ${fe(c.r1.engine)} |`);
    }
    T.geom = ['| 受け手 ← 源 | 配置 | 場の枠 α = 2 の自転の部 | 場の枠 α = 2 の並進の部 | 受け手の枠(観測半径)α = 2 の自転の部 | 同 並進の部 | 今の口 K2 | 今の口 K1 |', '|---|---|---|---|---|---|---|---|', ...rows].join('\n'); }
  // 表 7 有限の受け手(本の時刻・α = 2 —— 局所近似との相対の差の最大〔pair・ballL・ballCurl〕と二次の目安)
  T.finite = ['| 天体 | 場の枠・観測半径: 差の最大 | 目安 | 受け手の枠(観測半径): 差の最大 | 目安 | R_d の自己・R_d の受け手 |', '|---|---|---|---|---|---|',
    ...J.finite.filter((r) => P.docBodies.includes(r.key) || r.key === 'sun').map((r) => { const m = (c) => Math.max(...Object.values(c.modes).map((x) => x.rel)), a = r['none@Robs'], b = r['robs@Robs'], d = r['kappaM@Rd'];
      return `| ${nm(r.key)} | ${fe(m(a))} | ${fe(a.bound)} | ${fe(m(b))} | ${fe(b.bound)} | ${d.resolvable ? fe(m(d)) : '分解能の外(R_d ÷ r_min = ' + fe(d.R / d.rMin) + ' —— 局所近似)'} |`; })].join('\n');
  // 表 8 遠心の順行と逆行(x = Ω_f/Ω —— 剛体の枠の判定〔観測の公転 / 逆の公転〕)
  { const C = J.centrifugal, cols = ['2|none', '2|robs', '2|kappaM', '1|robs', '3|robs'];
    T.centrifugal = ['| 公転する天体(主星) | Ω [rad/s] | ' + cols.map((c) => { const [a, s] = c.split('|'); return (s === 'none' ? '場の枠' : s === 'robs' ? '受け手の枠(観測半径)' : '受け手の枠(R_d)') + ' α = ' + a; }).join(' | ') + ' | 場の枠 α = 2 の要る速さの差(剛体)[m/s] |',
      '|---|---|' + cols.map(() => '---|').join('') + '---|',
      ...C.orbiters.map((o) => `| ${nm(o.key)}(${nm(o.primary)})${o.retrogradeToPrimarySpin ? ' —— 逆行' : ''} | ${fe(o.Omega)} | ${cols.map((c) => { const q = o.cols[c]; return g3(q.x) + ' ' + VJ[q.verdictPro] + '/' + VJ[q.verdictRetro]; }).join(' | ')} | ${g3(o.cols['2|none'].dvRigid)} |`)].join('\n');
    T.rings = ['| 土星の環の帯の半径 [km](💍 の宣言) | Ω [rad/s] | 場の枠 α = 1 | 1.5 | 2 | 3 | 半渦度の軸 α = 2 |', '|---|---|---|---|---|---|---|',
      ...C.rings.map((o) => `| ${f3(o.R / 1e3)} | ${fe(o.Omega)} | ${P.alphas.map((a) => { const q = o.cols[a + '|none']; return g3(q.x) + ' ' + VJ[q.verdictPro] + '/' + VJ[q.verdictRetro]; }).join(' | ')} | ${VJ[o.cols['2|none'].verdictAxisPro]}/${VJ[o.cols['2|none'].verdictAxisRetro]} |`)].join('\n');
    const byCol = {}; for (const q of C.overTwo) byCol[q.col] = (byCol[q.col] || 0) + 1;
    T.overTwo = ['| 列(α \\| 自己の重み) | x > 2 の天体の数(順行で要求がまた増す) |', '|---|---|', ...Object.keys(byCol).sort().map((k) => `| ${k.replace('|', ' \\| ')} | ${byCol[k]} |`), `| 全部(公転 ${C.orbiters.length} × 列 ${P.alphas.length * P.selfRules.length} + 環 ${C.rings.length} × 列 ${P.alphas.length}) | ${C.overTwo.length} |`].join('\n'); }
  // 表 9 次数と単位(ω の相対の変わり方 —— 基準は r_ref = 1 au・W₀ = 0)
  T.units = ['| 受け手 | 自己 | α | 基準の ω∥ [rad/s] | 1 au・W₀ = 3H₀c/(2G) | 1 kpc・W₀ = 0 | 1 kpc・W₀ = 3H₀c/(2G)(背景の分) |', '|---|---|---|---|---|---|---|',
    ...J.units.rows.map((r) => `| ${nm(r.key)} | ${r.self === 'none' ? '場の枠' : '観測半径'} | ${r.alpha} | ${fe(r.base)} | ${lt(r.auW0.rel, 1e-10) === '< 1e-10' ? '< 1e-10' : fe(r.auW0.rel)} | ${lt(r.kpc0.rel, 1e-10)} | ${lt(r.kpcW0.rel, 1e-10) === '< 1e-10' ? '< 1e-10' : fe(r.kpcW0.rel) + '(' + fe(r.kpcW0.shareBg) + ')'} |`)].join('\n');
  // 表 10 門
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}
