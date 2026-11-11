// 第334便c(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN633〜AN636)・統括の検証項目 R324): **正本 tests/out/mercurynode-w334c.json から PHYSICS〔第334便c〕の表を作る文書の lib**
// (QA docs.mercuryNode334c が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔中心力の L̂ の数値の残り・窓の和の差・面に垂直な力からの面内の回転〕は「< 1e-9」の形で書き、
//   数そのものは載せない)。
export const DOC_VERSION = 'w334c-mercurynodedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const RULE = Object.freeze({ kappaM: 'Y_k m', radius: '観測の半径' });
const PART = Object.freeze({ trans: '並進の分', rot: '回転の分', both: '両方' });
const PAIR = Object.freeze({ receiver: '受け手', symmetric: '対称' });
const SETS = Object.freeze({ sun5: '太陽の赤道面の交点 ±5°', sun15: '太陽の赤道面の交点 ±15°', sun45: '太陽の赤道面の交点 ±45°', ecl15: '黄道の交点 ±15°(対照)', hRd1: '高さ ≤ 1 R_d', hRd100: '高さ ≤ 100 R_d', hRs1: '高さ ≤ 1 R_☉', hRs3: '高さ ≤ 3 R_☉' });
/** 行の尺度(dL̂/dt の大きさ・|ω_W| の大きい方)—— 数値の残りの上限は尺度 × 1e-9 */
const sc = (q) => Math.max(Math.abs(q.Lmag || 0), Math.abs(q.apsW || 0));
export function tablesOf(J) {
  const T = {}, G = J.geom, M = J.mercury, PS = J.pure.scenes, PG = J.pure.gates;
  // 表 1 幾何と窓の宣言(水星 —— 本の状態の軌道)
  { const H = M.hypo;
    T.geom = ['| 量 | 値 |', '|---|---|',
      `| a [m]・e・周期 [s] | ${fe(G.a)}・${G.e.toPrecision(6)}・${fe(G.period)} |`,
      `| 太陽の赤道面に対する傾き i・近点引数 ω [°] | ${G.iSunDeg.toPrecision(5)}・${G.omegaSunDeg.toPrecision(5)} |`,
      `| 黄道に対する傾き i・近点引数 ω [°] | ${G.iEclDeg.toPrecision(5)}・${G.omegaEclDeg.toPrecision(5)} |`,
      `| r_asc/r_desc = (1 − e cos ω)/(1 + e cos ω)(太陽の赤道面の交点・黄道の交点) | ${f4(H.ratioSun.rAscOverRDesc)}・${f4(H.ratioEcl.rAscOverRDesc)} |`,
      `| 太陽の観測自転 s [rad/s](本)・R_d = Y_k m_☉ [m]・太陽の半径 [m](本) | ${fe(G.sSun)}・${f4(G.Rd)}・${fe(G.Rsun)} |`].join('\n'); }
  // 表 2 回転の分の窓(水星 —— α = 1・ballHarmonic・Y_k m・観測自転)
  { const w = M.windows.find((q) => q.key === 'rot'), t = 1e-9 * sc(w.full);
    T.rotWindows = ['| 窓 | 時間の割合(昇・降・離れた部分) | 読み A: ŝ のまわりの歳差 sin i dΩ_node(昇・降・離れた部分) | 読み A: ŝ へ倒れる −di/dt(昇・降・離れた部分) | 読み A: 面内の回転 ω_W(昇・降・離れた部分) | 読み B: 歳差(昇・降・離れた部分) | 読み B: ω_W(昇・降・離れた部分) | 境界の項 ÷ 窓の値(昇) | 窓の和 − 全周 |', '|---|---|---|---|---|---|---|---|---|']
      .concat(w.sets.map((s) => { const p = s.pieces, b = s.boundary; const tri = (k, src) => ['asc', 'desc', 'away'].map((pc) => lt(src(pc)[k], t)).join('・');
        return `| ${SETS[s.key]} | ${['asc', 'desc', 'away'].map((pc) => f4(s.timeFrac[pc])).join('・')} | ${tri('prec', (pc) => p[pc])} | ${tri('toward', (pc) => p[pc])} | ${tri('apsW', (pc) => p[pc])} | ${tri('prec', (pc) => b[pc].readB)} | ${tri('apsW', (pc) => b[pc].readB)} | ${f4(b.asc.overL)} | ${lt(Math.max(s.sumDev, s.sumDevB), 1e-9)} |`; }))
      .concat([`| 全周(読み A = 読み B) | 1 | ${fx(w.full.prec)} | ${fx(w.full.toward)} | ${fx(w.full.apsW)} | ${fx(w.full.prec)} | ${fx(w.full.apsW)} | — | — |`]).join('\n'); }
  // 表 3 他の効果の窓(太陽の赤道面の交点 ±15° —— 面内の回転と歳差)
  T.otherWindows = ['| 効果 | ω_W: 昇 | 降 | 離れた部分 | 全周 | 歳差: 昇 | 降 | 離れた部分 | 全周 | 窓の和 − 全周 |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(M.windows.map((w) => { const s = w.sets.find((q) => q.key === 'sun15'), p = s.pieces, t = 1e-9 * sc(w.full);
      return `| ${w.label} | ${lt(p.asc.apsW, t)} | ${lt(p.desc.apsW, t)} | ${lt(p.away.apsW, t)} | ${lt(w.full.apsW, t)} | ${lt(p.asc.prec, t)} | ${lt(p.desc.prec, t)} | ${lt(p.away.prec, t)} | ${lt(w.full.prec, t)} | ${lt(Math.max(s.sumDev, s.sumDevB === null ? 0 : s.sumDevB), 1e-9)} |`; })).join('\n');
  // 表 4 全周のベクトルと基準面の量(水星)
  T.full = ['| 効果 | ω_W | dL̂/dt の大きさ | ŝ のまわりの歳差 | ŝ へ倒れる | e の面外 | 面に垂直な力からの ω_W | 黄道: ω | ϖ | Ω_node | i | 太陽の赤道面: ω | ϖ | Ω_node | i |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(M.windows.map((w) => { const q = w.full, t = 1e-9 * sc(q), four = (o) => [o.domega, o.dvarpi, o.dnode, o.di].map((x) => lt(x, t)).join(' | ');
      return `| ${w.label} | ${lt(q.apsW, t)} | ${lt(q.Lmag, t)} | ${lt(q.prec, t)} | ${lt(q.toward, t)} | ${lt(q.eOut, t)} | ${lt(q.apsWfromW, t)} | ${four(q.ecl)} | ${four(q.sun)} |`; })).join('\n');
  // 表 5 交点の非対称の仮説(e × α —— ω の格子の上の全周の ω_W)
  { const H = M.hypo;
    T.hypo = ['| α | e | 全周の ω_W の平均〔″/世紀〕 | ω の振れ ÷ 平均 | ω に依る(> 1e-6) | 面に垂直な力からの ω_W ÷ dL̂/dt の大きさ | ŝ へ倒れる(ω = 45°) | ŝ へ倒れる の範囲(ω の格子) | 歳差(ω = 0°・90°) |', '|---|---|---|---|---|---|---|---|---|']
      .concat(H.rows.map((r) => { const p45 = r.pts.find((q) => q.omegaDeg === 45), p0 = r.pts.find((q) => q.omegaDeg === 0), p90 = r.pts.find((q) => q.omegaDeg === 90), t = 1e-9 * Math.abs(p0.full.Lmag);
        return `| ${r.alpha} | ${r.e} | ${r.apsWmean === null ? '—(e = 0)' : fx(r.apsWmean)} | ${r.apsWspread === null ? '—' : fe(r.apsWspread)} | ${tf(r.omegaDependent)} | ${r.fromWmax === null ? '—' : lt(r.fromWmax, 1e-9)} | ${lt(p45.full.toward, t)} | ${lt(r.towardRange, t)} | ${fx(p0.full.prec)}・${fx(p90.full.prec)} |`; })).join('\n'); }
  // 表 6 仮説の ω の格子(α = 1・e = 0.2056 —— 窓 ±15°)
  { const r = M.hypo.rows.find((q) => q.alpha === 1 && q.e === 0.2056), t = 1e-9 * r.pts[0].full.Lmag;
    T.hypoOmega = ['| ω [°] | r_asc/a | r_desc/a | ω_W: 昇 + 降 | 離れた部分 | 全周 | 歳差: 昇 − 降 | 全周 | ŝ へ倒れる(全周) |', '|---|---|---|---|---|---|---|---|---|']
      .concat(r.pts.map((p) => `| ${p.omegaDeg} | ${f4(p.rAscOverA)} | ${f4(p.rDescOverA)} | ${fe(p.asc.apsW + p.desc.apsW)} | ${fe(p.away.apsW)} | ${fe(p.full.apsW)} | ${lt(p.asc.prec - p.desc.prec, t)} | ${fx(p.full.prec)} | ${lt(p.full.toward, t)} |`)).join('\n'); }
  // 表 7 組み合わせ(G_loc の型 × K1 の有無・K1 の代わりの統合した並進 + G_loc 受け手 n = 2)
  { const C = M.combos;
    T.combos = ['| 組 | K1 | 統合した並進 | ω_W〔″/世紀〕 | ÷ q_1PN | 黄道の Ω_node | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|']
      .concat(C.gl.map((g) => `| G_loc ${PAIR[g.pair]} n = ${g.n}${g.pair === 'receiver' && g.n === 2 && g.k1 ? '(今の組 —— 凍結の基準)' : ''} | ${g.k1 ? '有' : '無'} | 無 | ${fx(g.apsW)} | ${f4(g.overQ)} | 0 | 偽 |`))
      .concat(C.instead.map((q) => (q.defined ? `| G_loc 受け手 n = 2 + 統合した並進の両方(α = ${q.alpha}・${q.shape}・${RULE[q.radius]}) | 無 | 有(K1 の代わり) | ${fx(q.apsW)} | ${fx(q.overQ)} | ${lt(q.eclNode, 1e-9 * Math.abs(q.apsW))} | ${tf(q.breaks)} |`
        : `| G_loc 受け手 n = 2 + 統合した並進の両方(α = ${q.alpha}・${q.shape}・${RULE[q.radius]}) | 無 | 定義できない(α = 3 の ballHarmonic) | — | — | — | — |`))).join('\n'); }
  // 表 8 統合した並進の単独の率(揃えた自己の形 × α × 自己の半径 × 部分)
  T.single = ['| 自己の半径 | 自己の形 | α | 部分 | β(a) | ω_W | dL̂/dt の大きさ | 黄道の Ω_node | 黄道の ϖ | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(M.combos.single.map((q) => (q.defined ? `| ${RULE[q.radius]} | ${q.shape} | ${q.alpha} | ${PART[q.part]} | ${fe(q.betaAtA)} | ${fx(q.apsW)} | ${lt(q.Lmag, 1e-9 * sc(q))} | ${lt(q.ecl.dnode, 1e-9 * sc(q))} | ${fx(q.ecl.dvarpi)} | ${tf(q.breaks)} |`
      : `| ${RULE[q.radius]} | ${q.shape} | ${q.alpha} | ${PART[q.part]} | 定義できない(自己の場が発散) | — | — | — | — | — |`))).join('\n');
  // 表 9 回転の分の源の自転(観測自転 s・J 案 s_d —— λ_J の格子・連動させない)
  T.spin = ['| 自己の形 | α | 源の自転 | 倍率 s_d/s | s_d R_d/c | dL̂/dt の大きさ | 黄道の Ω_node | 今の組に足した黄道の ϖ | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|---|---|']
    .concat(M.combos.spinRows.map((q) => `| ${q.shape} | ${q.alpha} | ${q.label} | ${fe(q.factor)} | ${q.sdRdOverC === null ? '—' : fe(q.sdRdOverC)} | ${fx(q.Lmag)} | ${fx(q.eclNode)} | ${fx(q.totalEclVarpi)} | ${tf(q.breaks)} |`)).join('\n');
  // 表 10 文献の値(未照合)との比と係数の上限・J₂ と Lense–Thirring の物差し
  T.lit = ['| 惑星 | 物差し Δϖ・ΔΩ〔″/世紀 —— 値の絶対値 + 誤差・未照合〕 | 回転の分: ϖ | Ω_node(黄道) | ϖ ÷ 物差し | Ω ÷ 物差し | 係数の上限(倍率) | λ_J の上限 | 自己の半径の上限 ÷ Y_k m | J₂: ϖ・Ω | Lense–Thirring: ϖ・Ω | 回転の分 ÷ Lense–Thirring(dL̂/dt の大きさ) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.litRows.map((q) => { const r = q.rows.rot, j = q.rows.j2, l = q.rows.lt, vp = (x) => (x.ecl ? x.ecl.dvarpi : x.apsW), nd = (x) => (x.ecl ? x.ecl.dnode : null);
      return `| ${q.ja} | ${fx(q.sigma.varpi)}・${fx(q.sigma.node)} | ${fx(vp(r))} | ${fx(nd(r))} | ${fx(q.ratio.rot.varpi)} | ${fx(q.ratio.rot.node)} | ${fe(q.kmax.min)} | ${fe(q.lambdaJmax)} | ${fe(q.RselfMaxOverYkm)} | ${fe(vp(j))}・${fe(nd(j))} | ${fe(vp(l))}・${fe(nd(l))} | ${fe(q.rotOverLt.Lmag)} |`; })).join('\n');
  // 表 11 純粋な積分器(永年の項と周期の項・二次の結合)
  { const N = J.numeric, s2 = N.second;
    T.numeric = ['| 型(単位の軌道・係数を上げた写し) | 一次: 交点〔rad/公転〕 | 傾き | 面内 | 数値(h/2・24 公転): 交点 | 傾き | 面内 | 一次との差 ÷ 尺度 | h・h/2・12・24 公転の差 ÷ 尺度 | 周期の項の振れ ÷ 1 公転の永年の分 |', '|---|---|---|---|---|---|---|---|---|---|']
      .concat(N.rows.map((q) => { const r = q.runs.find((x) => x.steps === 4000 && x.nOrb === 24), s = Math.max(Math.abs(q.analytic.dnode), Math.abs(q.analytic.di), Math.abs(q.analytic.aps)), u = (x) => lt(x, 1e-7 * s);
        return `| ${q.label} | ${u(q.analytic.dnode)} | ${u(q.analytic.di)} | ${u(q.analytic.aps)} | ${u(r.dnode)} | ${u(r.di)} | ${u(r.aps)} | ${fe(q.devOverScale)} | ${fe(q.bandOverScale)} | ${f4(q.periodicOverSecular)} |`; }))
      .concat(['', '| 二次の結合(回転の分 α = 1 —— 一次の面内の回転は 0) | 値 |', '|---|---|',
        `| 面内の回転 ÷ c²(c = ${s2.runs[0].c}・${s2.runs[1].c} の比 —— 4 なら二次) | ${f4(s2.q2)}・${f4(s2.ratio)} |`,
        `| 面外の回転 ÷ 一次の dL̂/dt の大きさ × 周期 | ${f4(s2.tiltOverFirst)} |`,
        `| 本物の係数 c = β(a) s/n・二次の面内の回転〔″/世紀〕 | ${fe(s2.cReal)}・${fe(s2.realArcsecCy)} |`,
        `| e × ω の格子の面内の回転 ÷ c²(e = ${s2.grid.map((g) => g.e).join('・')}) | ${s2.grid.map((g) => f4(g.mean)).join('・')} |`,
        `| ω の振れ ÷ 平均(同)・ω に依る(> 1e-6) | ${s2.grid.map((g) => fe(g.spread) + '・' + tf(g.omegaDependent)).join(' / ')} |`,
        `| 傾き ${s2.inc.map((q) => q.iDeg + '°').join('・')} の面内の回転 ÷ c² | ${s2.inc.map((q) => f4(q.q2)).join('・')} |`]).join('\n'); }
  // 表 12 対照(金星・地球・火星 —— 回転の分の窓 ±15° と全周・K1 の代わりの統合した並進)
  T.controls = ['| 惑星 | 太陽の赤道面に対する i [°] | r_asc/r_desc | q_1PN〔″/世紀〕 | 今の組の ω_W | 回転の分の歳差: 昇・降・離れた部分・全周 | ŝ へ倒れる | dL̂/dt の大きさ | K1 の代わりの統合した並進 + G_loc: ω_W ÷ q_1PN |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.controls.map((q) => `| ${q.ja} | ${q.iSunDeg.toPrecision(4)} | ${f4(q.rAscOverRDesc)} | ${f4(q.q1cy)} | ${f4(q.baseApsW)} | ${f4(q.rot.asc.prec)}・${f4(q.rot.desc.prec)}・${f4(q.rot.away.prec)}・${f4(q.rot.full.prec)} | ${fe(q.rot.full.toward)} | ${f4(q.rot.full.Lmag)} | ${q.instead ? f4(q.instead.overQ) : '—'} |`)).join('\n');
  // 表 13 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| 窓の和 = 全周(交点 ±15°・帯 h = 0.05 —— L̂・交点の率・ω_W の差 ÷ 尺度) | ${lt(Math.max(PS.sum.node, PS.sum.height, PS.sum.nodeRate, PS.sum.apsW), 1e-10)} | ${tf(PG.sum)} |`,
    `| 面を変えても L̂ のベクトルの変化は同じ(J₂ の型 —— 2 つの基準面の (di, dΩ) から作り直す)・ω_W = 軌道面の中の近点 | ${lt(Math.max(PS.frames.ecl, PS.frames.sun, PS.frames.aps), 1e-10)} | ${tf(PG.frames)} |`,
    `| 面に垂直な力は ω_W を動かさない(任意の F_W) | ${lt(Math.max(PS.fw.apsW, PS.fw.fromW), 1e-12)} | ${tf(PG.fw)} |`,
    `| 統合した並進の並進の分 ÷ K1(α = 1・ballHarmonic・Y_k m)・point × C₁ | ${f4(PS.k1.bh)}・${f4(PS.k1.pt * PS.k1.C1)} | ${tf(PG.k1)} |`,
    `| 揃えた自己の形: 一般の p の自己の場と p = 1 の閉じた式・H₁ と H₂ が第330便b と同じ・H₁.₅・H₃ | ${lt(PS.self.k1, 1e-10)}・${lt(PS.self.h1, 1e-8)}・${lt(PS.self.h2, 1e-4)}・${f4(PS.self.h15)}・${PS.self.h3 === null ? '定義できない' : PS.self.h3} | ${tf(PG.self)} |`,
    `| 文献の式の照合(J₂ の交点・近点引数・Lense–Thirring の交点・近点引数 ÷ 閉じた式) | ${[PS.lit.j2node, PS.lit.j2omega, PS.lit.ltNode, PS.lit.ltOmega].map((x) => lt(x - 1, 1e-6)).join('・')}(− 1) | ${tf(PG.lit)} |`,
    `| 回転の型の ω_W は ω に依らない(α = 2・3 —— ω の振れ ÷ 平均) | ${lt(Math.max(PS.omegaFree.a2, PS.omegaFree.a3), 1e-9)} | ${tf(PG.omegaFree)} |`,
    `| 高さの帯 h = R_d の区間が第333便c の bandWindows と同じ | ${lt(Math.max(PS.band.asc, PS.band.desc), 1e-12)} | ${tf(PG.band)} |`,
    `| 入力の拒否(宣言の外の形・α・p = 3 の自己の場・軌道より高い帯・型)と α = 3 の ballHarmonic が null | ${PS.rejects.filter(Boolean).length}/${PS.rejects.length}・${tf(PS.nullBH3)} | ${tf(PG.rejects)} |`].join('\n');
  return T;
}
