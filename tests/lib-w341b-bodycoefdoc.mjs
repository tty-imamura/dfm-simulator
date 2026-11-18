// 第341便b(原仮定者の回答(2026-11-18 —— 第141報)AN790・統括の検証項目 R365): **正本 tests/out/bodycoef-341b.json から PHYSICS〔第341便b〕の表を作る文書の lib**
// (QA docs.bodycoef341b が節の表と逐語で照合する —— 数は有効数字 3 桁の指数・角は小数 2 桁・正本で 0 と書いた量〔丸めの残り〕は「0」)。
export const DOC_VERSION = 'w341b-bodycoefdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ mercury: '水星', venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', pluto: '冥王星',
  moon: '月', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン(逆行)', charon: 'カロン', sun: '太陽', earthH: '地球' });
const SRC = Object.freeze({ sun: '太陽', earth: '地球', jupiter: '木星', saturn: '土星', neptune: '海王星', pluto: '冥王星' });
const KIND = Object.freeze({ zeroNode: '零点合わせ', finitePair: '有限の 2 項の拮抗' });
const PROP = Object.freeze({ rho: '密度', R: '半径', flat: '扁平率', gas: '気体か', periodAbs: '自転の周期', f: '源の取り分 f', aAU: '半長軸' });
const need = (x) => (x === null || x === undefined ? '無い(このノブだけでは定常にならない)' : x >= 1e3 ? fe(x) : f3(x));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① C_b 1 と第340便b の置き方 (b)・C_b ½ と置き方 (a) の差(÷ f・仰角 7 × f 6) | ${fe(S.same340.dB)}・${fe(S.same340.dA)} | ${tf(G.same340)} |`,
    `| ② 零試験: 天体が 1 つ・軸の方向の部位差分(C_b 6 点の最大) | ${fe(S.nul.single)}・${fe(S.nul.axis)} | ${tf(G.nul)} |`,
    `| ③ 境目の閉じた形: C_b 1 の f → 0 の 90° の仰角・C_b 1 の赤道の境 f₀・C_b 2 の f ½ の 90° の仰角・C_b ½ の赤道の境 | ${f2(S.bounds.el45)}°・${f3(S.bounds.f0c1)}・${f2(S.bounds.el45c2)}°・${S.bounds.f0half === null ? '無い' : f3(S.bounds.f0half)} | ${tf(G.bounds)} |`,
    `| ④ 金星の振幅の係数(C_b 1・P⊥ 1): 和の型・差分だけ | ${S.coef.sum.join(', ')}・${S.coef.diff.join(', ')} | ${tf(G.coef)} |`,
    `| ⑤ 仰角 30° の有限の受け手(R/r 1e-3)のずれの率と最小二乗の回転の閉じた形との相対の差 | ${fe(S.shear.rel)}・${fe(S.shear.relRot)} | ${tf(G.shear)} |`,
    `| ⑥ 順位相関の自己試験(単調に増える・減る) | ${f3(S.spear.up)}・${f3(S.spear.down)} | ${tf(G.spear)} |`,
    `| ⑦ 入力の拒否(係数が負・非有限・f が範囲の外) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t1Bounds = ['| C_b | 赤道面の和が 0 になる取り分 f₀ = 1 − 1/(C_b α) | 45° で 90° になる取り分(C_b α (1 − f) = 2) | 90° 傾く仰角(f → 0) | 90° 傾く仰角(f ½) |', '|---|---|---|---|---|',
    ...t1.bounds.map((b) => `| ${b.C} | ${b.fZeroEq === null ? '無い(全域で順)' : f3(b.fZeroEq)} | ${b.f45 === null ? '無い' : f3(b.f45)} | ${b.el90Small === null ? '無い' : f2(b.el90Small) + '°'} | ${b.el90Half === null ? '無い' : f2(b.el90Half) + '°'} |`)].join('\n');
  T.t1Sum = ['| C_b | f | ' + D.elevDeg.map((e) => `${e}°`).join(' | ') + ' | 45° の強さ ÷ f | 90° 傾く仰角 |', '|---|---|' + D.elevDeg.map(() => '---|').join('') + '---|---|',
    ...t1.rows.map((r) => `| ${r.C} | ${r.f} | ` + r.cells.map((c) => (c.ang === null ? '強さ 0' : f2(c.ang) + '°')).join(' | ') + ` | ${f4(r.cells.find((c) => c.elDeg === 45).magOverF)} | ${r.el90 === null ? '無い' : f2(r.el90) + '°'} |`)].join('\n');
  T.t1Null = ['| C_b | 天体が 1 つ(f ≡ 1)の部位差分の最大(÷ s) | 軸の方向の部位差分の最大(f 6 点) | 係数の因子 C_b × (−α f(1 − f))(f 1) |', '|---|---|---|---|',
    ...t1.same340.nul.map((x) => `| ${x.C} | ${fe(x.single)} | ${fe(x.axis)} | ${fe(x.singleFactor)} |`)].join('\n');
  T.t2Venus = ['| C_b | 列 | 根の数 | 根 f(種類)・W₀ | 根の 3 成分: 軸に平行・垂直(和の大きさに対する比) | 自転の軸に沿う釣り合いの根 f・垂直の残り |', '|---|---|---|---|---|---|',
    ...t2.rows.map((r) => `| ${r.C} | ${r.col === 'sum' ? '和の型' : '差分だけ'} | ${r.nRoots} | ${r.roots.length ? r.roots.map((x) => `${fe(x.f)}(${KIND[x.kind]})・${fe(x.W0)}`).join(' / ') : '—'} | ${r.roots.length ? r.roots.map((x) => `${f4(Math.abs(x.alongRel))}・${f4(x.perpRel)}`).join(' / ') : '—'} | ${r.alongRoots.length ? r.alongRoots.map((x) => `${fe(x.f)}・${f4(x.perpRel)}`).join(' / ') : '—'} |`),
    `| 閉じた形 | 比 a/b だけで決まる 3 成分(C_b に依らない) | — | — | ${f4(t2.invariant.alongRel)}・${f4(t2.invariant.perpRel)} | P⊥ ${f4(t2.Pp)}(太陽の赤道面に対する傾き ${t2.iSunDeg}°) |`].join('\n');
  T.t3Bodies = ['| 受け手 | 源 | 取り分 f | cos θ | P⊥ | 要る C_b(釣り合い) | 要る C_b(速さの一致) | 密度 [g/cm³] | 半径 [km] | 扁平率 | 気体か | 自転の周期 [日] |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...t3.bodies.map((b) => `| ${NM[b.key]}${b.locked ? (b.mutual ? '(相互にロック)' : '(潮汐ロック —— 参考)') : ''} | ${SRC[b.src]} | ${fe(b.f)} | ${f3(b.cosT)} | ${f4(b.Pp)} | ${need(b.bal)} | ${need(b.spd)} | ${f3(b.rho)} | ${b.R} | ${b.flat === null ? '—' : b.flat} | ${b.gas ? '気体' : '固体'} | ${f3(b.periodAbs)} |`)].join('\n');
  T.t3Corr = ['| 天体の性質 | 釣り合いの要る C_b との順位相関(点の数) | 速さの一致の要る C_b との順位相関(点の数) |', '|---|---|---|',
    ...D.props.map((k) => `| ${PROP[k]} | ${f3(t3.law.corr.bal[k].rho)}(${t3.law.corr.bal[k].n}) | ${f3(t3.law.corr.spd[k].rho)}(${t3.law.corr.spd[k].n}) |`)].join('\n');
  const F = t3.law.forms;
  T.t3Forms = ['| 候補の関数の形 | 当てた要る C_b | 点の数 | 対数の残差の標準偏差 [dex] | 対数の残差の平均 [dex] |', '|---|---|---|---|---|',
    `| C_b = 1/(α P⊥ (1 − f))(釣り合いの閉じた形 —— 背景の項を外した形) | 釣り合い | ${F.balClosed.n} | ${fe(F.balClosed.sd)} | ${fe(F.balClosed.mean)} |`,
    `| C_b ∝ s_obs/(s☉ α f cos θ の大きさ)(速さの比) | 速さの一致 | ${F.spdRatio.n} | ${f3(F.spdRatio.sd)} | ${f3(F.spdRatio.mean)} |`,
    `| C_b ∝ 密度 | 速さの一致 | ${F.spdRho.n} | ${f3(F.spdRho.sd)} | ${f3(F.spdRho.mean)} |`].join('\n');
  T.t3Locked = ['| W₀ の割合 φ(受け手の残りの重みのうち背景) | 相互ロック(受け手の並進 = Ω × p₀・自転 = Ω)の部位差分の強さ | 受け手が静止のときの強さ | 比 |', '|---|---|---|---|',
    ...t3.locked.map((x) => `| ${x.phi} | ${fe(x.mag)} | ${fe(x.magStatic)} | ${x.ratio === null ? '—' : f3(x.ratio)} |`)].join('\n');
  T.t4Rows = ['| 仰角 [°] | (b) ずれの率: R/r ' + D.kT4.join('・') + ' | (b) の傾き | (a) 最小二乗の回転: R/r ' + D.kT4.join('・') + ' | (a) の傾き |', '|---|---|---|---|---|',
    ...t4.rows.map((r) => `| ${r.elDeg} | ${D.kT4.map((k) => fe(r.b[k])).join('・')} | ${f3(r.slopeB)} | ${D.kT4.map((k) => fe(r.a[k])).join('・')} | ${f3(r.slopeA)} |`)].join('\n');
  T.t4Layers = ['| 核の密度 ÷ 外層の密度(核の半径 ½) | (a) の閉じた形との相対の差(仰角 45°): R/r ' + D.kT4.join('・') + ' |', '|---|---|',
    ...t4.layers.map((l) => `| ${l.ratio} | ${D.kT4.map((k) => fe(l[k])).join('・')} |`)].join('\n');
  T.t5 = ['| C_b | 赤道面の境 f₀ | 順の側 | 逆の側 |', '|---|---|---|---|',
    ...J.t5.map((r) => `| ${r.C} | ${r.f0 === null ? '無い' : f3(r.f0)} | ${r.pro.map((k) => NM[k]).join('・') || '—'} | ${r.retro.map((k) => NM[k]).join('・') || '—'} |`)].join('\n');
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}
