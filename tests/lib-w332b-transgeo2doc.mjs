// 第332便b(原仮定者の補足(2026-11-10)・統括の検証項目 R316): **正本 tests/out/transgeo2-w332b.json から PHYSICS〔第332便b〕の表を作る文書の lib**
// (QA docs.transGeo2332b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差・解析と差分の差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w332b-transgeo2doc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const kms = (v) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : f3(v / 1e3));   // m/s → km s⁻¹ の数(単位は見出しに)
const g3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-3 && Math.abs(x) < 1e5 ? f3(x) : fe(x)));
/** 組の短い名(表の見出し) */
export const COMBO_LABEL = Object.freeze({
  'geo2|decay|e3': 'G0 = geoPN = 2 の在位の型(m/√(d²+ε²)・E2 の減衰・自己なし + D₀)', 'geo2|decay|field': 'G0bg0(G0 の背景を 0)', 'trans|decay|e3': '核だけ m/r²(G0 から)', 'geo2|coord|e3': '源の回転だけ座標変換(G0 から)',
  'trans|coord|field': 'TF = 並進引きずりの場の読み(m/r²・座標変換の回転・自己なし・背景なし)', 'trans|coord|self:kappaM:ballMean': 'TS = 並進引きずりの主の自己(R_d = Y_k m・ballMean)',
  'trans|coord|self:book:ballMean': '並進引きずり・自己は本の半径(比べる列)',
});
const AXIS = Object.freeze({ kernel: '核(m/r ↔ m/r²)', kernelPullSoft: '核(→ m/(d²+ε²) —— エンジンの pull)', rot: '源の回転(E2 の減衰 ↔ 座標変換)', denomE3: '分母 → E3(自己なし + D₀)', denomField: '分母 → 場の読み(自己なし・背景なし)', denomSelfKappaM: '分母 → 自己 R_d = Y_k m(ballMean)' });
const GAL = Object.freeze({ book: '💫 の写し(u_φ)', bookSpin0: '💫 の写し・中心の自転 0(u_φ)', ngcFixture: 'NGC 3198 fixture(u_φ)', ngcExp: 'NGC 3198 指数円盤(u_φ)', bookDv: '💫 の写し(Δv continuum)', ngcFixtureDv: 'NGC 3198 fixture(Δv continuum)' });
const BASE = Object.freeze({ G0: 'G0', G0bg0: 'G0bg0', TF: 'TF', TS: 'TS' });
const RANGE_LABEL = Object.freeze({ book: '💫 の写し', bookSpin0: '💫 の写し・中心の自転 0', ngcFixture: 'NGC 3198 fixture', ngcExp: 'NGC 3198 指数円盤' });
const RULE_LABEL = Object.freeze({ kappaM: 'R_d = Y_k m', kappaD: 'κ_D m', book: '本の半径(比べる列)' });
const ruleOf = (t) => (t === 'trans|coord|field' ? '場の読み(自己なし)' : '自己 ' + RULE_LABEL[t.split(':')[1]]);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, E = J.engine, Bk = J.book.book, B0 = J.book.centerSpin0, NF = J.ngc.main.fixture;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 正規化: 1 つの源・場の読みで u = 源の座標の速度(差)・分母の分の和 − 1 | ${lt(S.normalize.uErr, 1e-10)}・${lt(S.normalize.shareSum - 1, 1e-10)} | ${tf(G.normalize)} |`,
    `| ② 一様の並進 b: 場の読みの u のずれ − b・J の差・E3 の u のずれ − 源の分 × b | ${lt(S.galilean.uShift, 1e-10)}・${lt(S.galilean.Jsame, 1e-10)}・${lt(S.galilean.e3Shift, 1e-10)} | ${tf(G.galilean)} |`,
    `| ③ 解析の勾配 J と中心差分(核 3 × 源の回転 2 × 自己と背景)の相対の差の最大 | ${fe(S.gradient.maxRel)}(${S.gradient.rows.length} 組) | ${tf(G.gradient)} |`,
    `| ④ E2 の q = 0 と座標変換の回転(半径を見ない)の u・J の差 | ${S.q0IsCoord.du}・${S.q0IsCoord.dJ} | ${tf(G.q0IsCoord)} |`,
    `| ⑤ 第331便a の座標則(呼ぶだけ —— m/r²・座標変換・自己 2.5): Σβ V = U − αv の相対の差・d = dRel の相対の差・α と自己の分の差 | ${lt(S.coordTwistLink.uRel, 1e-10)}・${lt(S.coordTwistLink.dRel, 1e-10)}・${lt(Math.abs(S.coordTwistLink.alpha - S.coordTwistLink.shareSelf), 1e-10)} | ${tf(G.coordTwistLink)} |`,
    `| ⑥ 自己の重み(背景なし)は場の読みの W_src/(W_src + w_self) 倍・dRel = (1 − α)(u_場 − v) | ${lt(S.selfFactor.uRel, 1e-10)}・${lt(S.selfFactor.dRel, 1e-10)} | ${tf(G.selfFactor)} |`,
    `| ⑦ 定常の輸送(u = Ω_f(R) R φ̂ の J を手で置く 4 例): a_R と −Ω_f²R − ω_z(v − Ω_f R)・第331便b の枠の式(ω_f = ω_z − Ω_f)・根の釣り合い・rigid・渦度の相対の差の最大 / 一様の Ω_f で continuum = rigid | ${lt(S.steadyCircular.maxRel, 1e-10)} / ${lt(S.steadyCircular.rigidFieldContinuumEqRigid, 1e-10)} | ${tf(G.steadyCircular)} |`,
    `| ⑧ 鏡の対称の配置(中心 + 方位 12 点の環 2 本)で受け手 (R, 0) の u_R ÷ u_φ・J の対角 ÷ 非対角(核 2 × 回転 2) | ${lt(S.axisymmetric.maxRel, 1e-10)} | ${tf(G.axisymmetric)} |`,
    `| ⑨ k_F = 0 で輸送 0・k_F = 0.5 の式との相対の差 | ${S.kFrame.zero}・${lt(S.kFrame.half, 1e-10)} | ${tf(G.kFrame)} |`,
    `| ⑩ 局所のべき(R^−0.7 の不等間隔)の誤差・符号の変わる列は null・比の要約(符号の反転 ${S.slopes.ratio.signFlips}) | ${lt(S.slopes.maxErr, 1e-10)}・${tf(S.slopes.signNull)} | ${tf(G.slopes)} |`,
    `| ⑪ 自己の規則: R_d ÷ κ_D m(= 5/C₁)・本の半径の ballMean の重みの差・kappaM と第330便b の kappaMRadius の差 | ${f3(S.selfRules.ratioRdOverKd)}・${S.selfRules.wBook}・${S.selfRules.kappaM} | ${tf(G.selfRules)} |`,
    `| ⑫ 入力の拒否(知らない核・負の軟化・受け手と源の一致・源なしの分母 0・p = 3・知らない回転・半径 0 の decay・負の背景・本の半径なし・知らない規則・g < 0・原点の極座標) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 エンジンとの照らし(2 步目の S._core の入口の状態 —— 固定の天体を除く 380 粒子)
  T.engine = ['| 💫 の写し | frameWeight | 核(p・ε) | 背景 | q | u の相対の差(Float32 の配列) | ∇P・∇W の相対の差 | 分母の和の相対の差 |', '|---|---|---|---|---|---|---|---|']
    .concat(E.anchors.map((q) => `| ${q.key} | ${q.frameWeight} | ${q.kernel}(${q.p}・${f3(q.eps)}) | ${f3(q.bg)} | ${f3(q.q)} | ${fe(q.uRel)} | ${lt(q.gradRel, 1e-12)} | ${fe(q.wsumRel)} |`))
    .concat([`| 源の回転を座標変換にする宣言 q = 0 | — | — | — | 受理器が ${f3(E.qRange.accepted)} に直す(${E.qRange.warnings.join('・')}) | — | — | — |`]).join('\n');
  // 表 3 窓(600 步 —— 本の観察の基準)
  {
    const edges = J.plan.binEdges, w0 = E.windows.find((q) => q.key === 'kF0');
    T.window = ['| 写し | k_F | 外縁帯の vφ(始め・終わり) | ÷ k_F = 0 | 箱ごとの vφ ÷ k_F = 0(' + edges.slice(0, -1).map((e, k) => e + '–' + edges[k + 1]).join('・') + ') | 引きずりの分(機構の内訳) | 飽和 |', '|---|---|---|---|---|---|---|']
      .concat(E.windows.map((q) => `| ${q.key} | ${q.kFrame} | ${f3(q.vphiStart)}・${f3(q.vphiEnd)} | ${f3(q.ratioOverKF0)} | ${q.profileRatio.map((x) => f3(x)).join('・')} | ${q.pi ? f3(q.pi[5]) : '—'} | ${q.clampV} |`))
      .concat([`| 在位の claim の窓(12000 步 —— 外縁帯 [156, 286]・本の宣言 ${Bk.decl.claimTestId}) | 1 | — | ${f3(Bk.decl.claimWindow.min)}〜${f3(Bk.decl.claimWindow.max)} | — | — | — |`]).join('\n');
    void w0;
  }
  // 表 4 💫 の同じ入力 —— 場の大きさ・向き・べき(箱の中央値・本の単位)
  {
    const K = ['geo2|decay|e3', 'geo2|decay|field', 'trans|decay|e3', 'geo2|coord|e3', 'trans|coord|field', 'trans|coord|self:kappaM:ballMean', 'trans|coord|self:book:ballMean'], t = (k) => Bk.table[k];
    T.bookField = ['| 箱 [L] | R | v_φ(本の初期) | u_φ G0 | G0bg0 | 核だけ m/r² | 回転だけ座標変換 | TF | TS | 自己 = 本の半径 | G0 ÷ TF | べき G0・TF | 向き [°] G0・TF |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
      .concat(t(K[0]).map((r, k) => `| ${r.lo}–${r.hi} | ${f3(r.R)} | ${f3(r.vPhi)} | ${K.map((q) => g3(t(q)[k].uPhi)).join(' | ')} | ${fe(r.uPhi / t('trans|coord|field')[k].uPhi)} | ${f3(r.slope)}・${f3(t('trans|coord|field')[k].slope)} | ${f3(r.angleDeg)}・${f3(t('trans|coord|field')[k].angleDeg)} |`)).join('\n');
  }
  // 表 5 💫 の同じ入力 —— 定常の輸送と円軌道の読み
  {
    const g0 = Bk.table['geo2|decay|e3'], tf0 = Bk.table['trans|coord|field'], ts = Bk.table['trans|coord|self:kappaM:ballMean'];
    T.bookMotion = ['| R [L] | g | √(gR) | a_R G0 | a_R TF | continuum v G0 | continuum v TF | rigid v TF | continuum v TS | Δv G0 ÷ v_φ | Δv TF ÷ v_φ |', '|---|---|---|---|---|---|---|---|---|---|---|']
      .concat(g0.map((r, k) => `| ${f3(r.R)} | ${f3(r.g)} | ${f3(r.vNewton)} | ${g3(r.aR)} | ${g3(tf0[k].aR)} | ${f3(r.vContinuum)} | ${f3(tf0[k].vContinuum)} | ${f3(tf0[k].vRigid)} | ${f3(ts[k].vContinuum)} | ${g3(r.dvContinuum / r.vPhi)} | ${g3(tf0[k].dvContinuum / r.vPhi)} |`)).join('\n');
  }
  // 表 6 💫 の写し・中心の自転 0(源の回転の軸を消す)
  {
    const g0 = B0.table['geo2|decay|e3'], tf0 = B0.table['trans|coord|field'], tb = B0.table['trans|coord|self:book:ballMean'], tk = B0.table['trans|coord|self:kappaM:ballMean'];
    T.bookSpin0 = ['| R [L] | u_φ G0 | u_φ TF | u_φ 自己 = 本の半径 | u_φ TS | G0 ÷ TF | G0 ÷ 自己 = 本の半径 | G0 ÷ TS |', '|---|---|---|---|---|---|---|---|']
      .concat(g0.map((r, k) => `| ${f3(r.R)} | ${g3(r.uPhi)} | ${g3(tf0[k].uPhi)} | ${g3(tb[k].uPhi)} | ${g3(tk[k].uPhi)} | ${f3(r.uPhi / tf0[k].uPhi)} | ${f3(r.uPhi / tb[k].uPhi)} | ${fe(r.uPhi / tk[k].uPhi)} |`)).join('\n');
  }
  // 表 7 NGC 3198 —— 場の大きさ(km s⁻¹)とべき
  {
    const K = ['geo2|decay|e3', 'geo2|decay|field', 'trans|decay|e3', 'geo2|coord|e3', 'trans|coord|field', 'trans|coord|self:kappaM:ballMean'], t = (k) => NF.table[k];
    const idx = J.plan.ngcPickKpc.map((R) => NF.Rs.indexOf(R)).filter((k) => k >= 0);
    T.ngcField = ['| R [kpc] | v_obs | v_bar | u_φ G0 | G0bg0 | 核だけ m/r² | 回転だけ座標変換 | TF | TS | G0 ÷ TF | べき G0・TF |', '|---|---|---|---|---|---|---|---|---|---|---|']
      .concat(idx.map((k) => { const r = t(K[0])[k], f = t('trans|coord|field')[k];
        return `| ${f3(r.RKpc)} | ${kms(r.vObs)} | ${kms(r.vBar)} | ${K.map((q) => (q.includes('self') ? fe(t(q)[k].uPhi / 1e3) : kms(t(q)[k].uPhi))).join(' | ')} | ${f3(r.uPhi / f.uPhi)} | ${f3(r.slope)}・${f3(f.slope)} |`; })).join('\n');
  }
  // 表 8 NGC 3198 —— 定常の輸送と円軌道の読み(km s⁻¹)
  {
    const g0 = NF.table['geo2|decay|e3'], tf0 = NF.table['trans|coord|field'], idx = J.plan.ngcPickKpc.map((R) => NF.Rs.indexOf(R)).filter((k) => k >= 0);
    T.ngcMotion = ['| R [kpc] | v_obs − v_bar | Δv continuum G0 | Δv continuum TF | Δv rigid TF(= u_φ TF) | Δv G0 ÷ (v_obs − v_bar) | Δv TF ÷ (v_obs − v_bar) | a_R G0 ÷ g | a_R TF ÷ g |', '|---|---|---|---|---|---|---|---|---|']
      .concat(idx.map((k) => { const r = g0[k], f = tf0[k], req = r.vObs - r.vBar, gg = r.vBar * r.vBar / (r.RKpc * J.plan.kpcM);
        return `| ${f3(r.RKpc)} | ${kms(req)} | ${kms(r.dvContinuum)} | ${kms(f.dvContinuum)} | ${kms(f.uPhi)} | ${f3(r.dvContinuum / req)} | ${f3(f.dvContinuum / req)} | ${f3(r.aR / gg)} | ${f3(f.aR / gg)} |`; })).join('\n');
  }
  // 表 9 NGC 3198 の離散化の感度(fixture —— u_φ km s⁻¹)
  {
    const picks = J.plan.ngcPickKpc, main = NF.table, side = J.ngc.side.filter((s) => s.decl.dist === 'fixture');
    const rowOf = (lab, getter) => `| ${lab} | ` + picks.map((R, i) => getter(R, i)).join(' | ') + ' |';
    const mainPick = (key) => (R) => { const k = NF.Rs.indexOf(R); return k >= 0 ? kms(main[key][k].uPhi) : '—'; };
    T.ngcDisc = ['| 組・離散化 | ' + picks.map((R) => R + ' kpc').join(' | ') + ' |', '|---|' + picks.map(() => '---|').join('')]
      .concat(['geo2|decay|e3', 'trans|coord|field'].flatMap((key) => [rowOf((key === 'geo2|decay|e3' ? 'G0' : 'TF') + '・間隔 1 kpc・方位 24(主)', mainPick(key))]
        .concat(side.map((s) => rowOf((key === 'geo2|decay|e3' ? 'G0' : 'TF') + `・間隔 ${s.decl.dR} kpc・方位 ${s.decl.K}`, (R, i) => kms(s.summary[key].uPhiPick[i])))))).join('\n');
  }
  // 表 10 違いの分解(基準から 1 つずつ入れ替えた列の比の |ln| の中央値・最大)
  T.decomp = ['| 系(量)| 基準 | ' + Object.values(AXIS).join(' | ') + ' | 大きい順 |', '|---|---|' + Object.keys(AXIS).map(() => '---|').join('') + '---|']
    .concat(Object.entries(J.decomp).flatMap(([g, D]) => Object.keys(BASE).map((b) => {
      const by = Object.fromEntries(D[b].rows.map((r) => [r.axis, r]));
      return `| ${GAL[g]} | ${BASE[b]} | ` + Object.keys(AXIS).map((ax) => (by[ax] ? `${f3(by[ax].medianAbsLn)}(${f3(by[ax].maxAbsLn)}${by[ax].signFlips ? '・符号 ' + by[ax].signFlips : ''})` : '—')).join(' | ') + ` | ${D[b].ranked.map((a) => AXIS[a].replace(/(.*)/, '$1')).join(' > ')} |`;
    }))).join('\n');
  // 表 11 近似として読める範囲(物差し: 比 10%・べき 0.1・向き 10° / 緩い 2 倍)—— geoPN = 2 の列 4 つ(在位の宣言・背景 0・エンジンの pull と D0pull 0・その q = 0)
  {
    const rows = [], mn = (xs, k) => Math.min(...xs.map((q) => q[k])), mx = (xs, k) => Math.max(...xs.map((q) => q[k])), sum = (xs, k) => xs.reduce((s, q) => s + q[k], 0);
    for (const lab of Object.keys(RANGE_LABEL)) {
      const R0 = J.range.filter((q) => q.label === lab);
      const groups = [['trans|coord|field']].concat(['kappaM', 'kappaD', 'book'].map((rule) => [...new Set(R0.filter((q) => q.target.includes(':' + rule + ':')).map((q) => q.target))])).filter((g) => g.length);
      for (const grp of groups) {
        const cell = (geo, dv) => { const a = R0.filter((q) => q.geo === geo && grp.includes(q.target)); return `${g3(mn(a, 'ratioMin'))}〜${g3(mx(a, 'ratioMax'))}(${sum(a, 'nTight')}・${sum(a, 'nLoose')}${dv ? '・' + sum(a, 'nDvTight') : ''})`; };
        const tp = R0.filter((q) => q.geo === 'Gpull0' && grp.includes(q.target)), tightR = [...new Set(tp.flatMap((q) => q.tightR))].sort((x, y) => x - y);
        rows.push(`| ${RANGE_LABEL[lab]} | ${grp.length === 1 ? ruleOf(grp[0]) : ruleOf(grp[0]) + '(形 ' + grp.length + ')'} | ${tp[0].n} | ${cell('G0', true)} | ${cell('G0bg0', false)} | ${cell('Gpull0', true)} | ${cell('Gpull0coord', true)} | ${tightR.length ? (tightR.length > 8 ? f3(tightR[0]) + '〜' + f3(tightR[tightR.length - 1]) + '(' + tightR.length + ' 点)' : tightR.map((x) => f3(x)).join('・')) : '—'} |`);
      }
    }
    T.range = ['| 系 | 並進引きずりの型 | 半径の点 | G0(在位の宣言)÷ 並進の u_φ(比 10%・緩い 2 倍・Δv 10% の内の点)| G0bg0(背景 0)| Gpull0(frameWeight:"pull"・D0pull 0・q は本の値 —— 受理される)| Gpull0coord(Gpull0 の源の回転を座標変換 —— q = 0 は受理されない)| Gpull0 の物差しの内の半径 |', '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 12 自己の重みの規則の値
  {
    // 1 − α は自己ありの u_φ ÷ 自己なし(場の読み)の u_φ(場面 ⑥ —— 背景なしで厳密)。1 − 自己の分は倍精度で桁が落ちるので使わない
    const d = Bk.decl, ratioRows = (tab, a, b) => tab[a].map((r, k) => r.uPhi / tab[b][k].uPhi);
    const b1 = ratioRows(Bk.table, 'geo2|decay|self:kappaM:ballMean', 'geo2|decay|field'), b2 = ratioRows(Bk.table, 'trans|coord|self:kappaM:ballMean', 'trans|coord|field');
    const n1 = ratioRows(NF.table, 'geo2|decay|self:kappaM:ballMean', 'geo2|decay|field'), n2 = ratioRows(NF.table, 'trans|coord|self:kappaM:ballMean', 'trans|coord|field');
    const span = (xs) => `${fe(Math.min(...xs))}〜${fe(Math.max(...xs))}`;
    T.selfRule = ['| 系 | 本の G・c | R_d = Y_k m(中心・円盤の中央値) | 本の半径(中心・円盤の中央値) | 1 − α: m/r の核(ballMean) | 1 − α: m/r² の核(ballMean) |', '|---|---|---|---|---|---|',
      `| 💫 の写し | ${f3(d.G)}・${f3(d.c)} | ${f3(d.Rd.centerKappaM)}・${fe(d.Rd.diskMedianKappaM)} | ${f3(d.centerR)}・${f3(d.Rd.diskMedianBookR)} | ${span(b1)} | ${span(b2)} |`,
      `| NGC 3198 fixture | SI | —(環の点の質量 m_k/K から) | —(観測の半径を使わない) | ${span(n1)} | ${span(n2)} |`].join('\n');
  }
  return T;
}
