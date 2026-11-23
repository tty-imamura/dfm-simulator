// 第348便i(原仮定者の指示(2026-11-23 —— 第145報の補足 2)・原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R417):
//   **正本 tests/out/diskgeo3-348i.json から PHYSICS〔第348便i〕の表を作る文書の lib**
//   (QA docs.diskgeo3_348i が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの残りは書かない)。原文(言葉を変えずに引く)・場の式の対応・棚卸しの表もここに持つ。
export const DOC_VERSION = 'w348i-diskgeo3doc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
/** 比の書き方(0.01〜1000 は小数 3 桁・ほかは指数 —— −0.000 を書かない) */
const fr = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1000 ? Number(x).toFixed(3) : Number(x).toExponential(2));
const DIR = Object.freeze({ toward: '寄せる', away: '離す', mixed: '混ざる', none: '0' });
const ROT = Object.freeze({ cv: '(Rcv)', m2: '(Rm2)', k1: '(Rk1)' });
const denOfJ = (J, rot) => (rot === 'k1' ? J.decl.k1.den : J.decl.den);
const VR = Object.freeze({ off: '引かない', on: '引く' });
const br = (b) => (b ? `${b[0]}〜${b[1]}` : '無し');
const RING = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const ACT = Object.freeze(['corV', 'corS', 'drag90']);

/** 原文(言葉を変えずに引く)—— [出どころ, 原文] */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-23 —— 第145報の補足 2)', '引きずり近似のkFrameとqは、geoPN=2が対象。検証を進めている軸引きずりや円盤引きずりは、geoPN=3が対象']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '並進引きずりは移動と回転を含み、並進引きずりの引きずられる側の部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する']),
]);
/** 統括の読み(原文ごと —— [読み, 本節で数えた所]) */
export const READINGS = Object.freeze([
  Object.freeze(['〔第348便d〕の表は、候補の回転を kFrame と q の形の枠の速度の場(引きずり近似 = geoPN=2 の形)で作っていた。円盤引きずりの検証は、geoPN=3(慣性決定力の引きずり)の形の場で数える', '表 2〜表 10']),
  Object.freeze(['場の形を 1 つに決め打ちせず、源の回転の分の読み 2 つ・背景と自分の重み・受け手の慣性速度を振って、〔第348便d〕の列のどこに来るかを並べる', '表 4〜表 6']),
  Object.freeze(['後半の「源が無回転で横を通り過ぎても」の円盤の側を、geoPN=3 の形の場の通過で輪が傾く量として数え直す(背景と自分の重みの有無)', '表 9']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

/** 表 2 geoPN=3 の形の場の式と、アプリの行の読み(アプリの html の関数を読んだ —— 変えていない)と公開の節 */
export const FIELD_ROWS = Object.freeze([
  ['場', 'u(x) = [Σ_j W_j(x)(v_j − v_r) + Σ_j N_j(x)] ÷ (W₀ + W_ii + Σ_j W_j(x))', '受け手 i の行 (1 + deg_i) u_i − Σ_j a_ij u_j = s_i(c = 1/W₀ を掛けた行 —— `inertialDragComposeBuild`・`inertialDragComposeSolve`)を、受け手 1 つ・源の u_j を 0(源は与えた動きのまま)に置いた点の式', '〔第301便a〕〔第302便d〕〔第330便b〕'],
  ['重み', '(Rcv) W_j = m_j ÷ d²(重み = 質量 ÷ 距離²)/(Rm2) W_j = m_j K2(d; R_j)(遠方 m_j/d²)/(Rk1) W_j = m_j K1(d; R_j)(外部 1/d・内部 (3R² − d²)/(2R³) —— 在位の本が宣言している形)', '旧則 a_ij = c m_j r/(r² + ε²)²(遠方 m/r³ —— `inertialDragComposeBuild`)/新則 invSq は引きずりの質量 × K2(源の一様球の逆二乗の体積平均)・kernel:"k1" は K1(`inertialDragIsqK1`)', '〔第309便a〕〔第330便b〕'],
  ['分母', 'W₀ + W_ii + Σ_j W_j(背景・自分を含む)', '旧則: 行の対角 1 + x_i(x_i = Σw/W₀ —— `inertialDragNormX`)に源の慣性決定力 x_I(`inertialDragI2Apply`)と殻の自己の項 x_sh(`inertialDragShellApply`)を足す/対ごとの正規化は結合を R_ij 倍(`inertialDragPairApply`)/新則: W = 背景 + 自己 + 全部の源', '〔第301便a〕〔第303便b〕〔第304便a〕〔第305便a〕〔第309便a〕'],
  ['自分の重み W_ii', '分母にだけ(分子に自分の項を作らない)—— (Rk1) は中心の値 W_ii の K1 の球(半径 R_b —— 輪の粒子の置き方の宣言・通過は定数)', '旧則 `inertialR2.self`(radius の q_i/R_i²・shell の S2)と殻の S3 —— 分母にだけ・自己の基準速度は慣性速度 v_i(`inertialDragPairApply` の注記)/新則: 受け手の体積の各点の自己の場(kernel:"k1" は m_i K1・rdRule:"kappaM" の規則の半径 R_i = Y_k m_i)', '〔第304便a〕〔第305便a〕〔第309便a〕'],
  ['背景 W₀', '速度 0 の背景の重み(コードの名 `W_bg`)', '旧則 `physics.relativeDrag.Wbg`(次元 [M/L³])/新則 `invSq.Wbg2`(受理は 0 だけ)', '〔第302便a〕'],
  ['相対速度', 'v_j − v_r(受け手の慣性速度 v_r を引く/引かない —— ノブ)', '右辺 s_i = Σ_j a_ij (V_j − v_i)(源は全速度・受け手は慣性速度 —— `inertialDragComposeBuild` の hist の項)', '〔第302便d〕〔第330便b〕'],
  ['源の回転の分 N_j', '(Rcv) W_j (Ω_j × (x − r_j))(座標変換の型)/(Rm2) m_j M2(d; R_j)(Ω_j × n̂)/(Rk1) m_j M1(d; R_j)(Ω_j × n̂)・M1 = R_j²/(5d²)(外部)', '旧則 s_i に c m_j Ω_j M1(r)/r (â_j × d)(`inertialDrag3RotTerm` —— 円盤引きずり spinDrag.rot:"surfaceFlip")/新則 Ω_j â_j × ⟨(m_j M2/W) n̂⟩(m_j は引きずりの質量)', '〔第302便d〕〔第309便a〕〔第330便b〕'],
  ['本節で持たない所', '源の側の連立(源の u_j)・受け手の体積の比の平均・ε・inertialR2 の λ・対ごとの正規化・軸引きずりの ν', '—', '—'],
].map((r) => Object.freeze(r)));
export function fieldTable() {
  return ['| 項 | 本節の式(geoPN=3 の形 —— lib `tests/lib-w348i-diskgeo3.mjs`) | アプリの行の読み(アプリの html —— 読むだけ) | 公開の節 |', '|---|---|---|---|',
    ...FIELD_ROWS.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`)].join('\n');
}

/** 表 3 円盤引きずりの既存の器の棚卸し(場の形が geoPN=2 の形か geoPN=3 の形か —— 事実の表。各 lib の冒頭の宣言と関数から) */
export const INVENTORY = Object.freeze([
  ['〔第337便i〕', 'tests/lib-w337i-rotring.mjs', '方位の速度の場の高さの型(切り口・帯 + 尾・球の遠方・源のモーメント)× 作用の型 × R_d の読み', 'どちらでもない(場の型 U_φ と強さ λ を直に置く —— Σ重みで割らない)', '場の型の宣言'],
  ['〔第339便a〕(physics.rotDragVert)', 'tests/lib-w339a-rotvert.mjs', 'アプリの鉛直の型(帯の内で d = −λ r (s z/ρ) k̂)', 'どちらでもない(定数 λ と帯の型)', 'アプリの宣言の型'],
  ['〔第338便d〕', 'tests/lib-w338d-ringbook.mjs', '土星の環の帳簿', 'どちらでもない(第337便i の場と 4 天体の強さの組)', '—'],
  ['〔第340便d〕T1', 'tests/lib-w340d-gyropath.mjs', '経路「軸引きずり + 公転 + ジャイロ」の部位の力', 'どちらでもない(軸の場 A abs(x)^(−p) h_q を直に置く —— 速度の場ではない)', '2 倍角の則の型'],
  ['〔第340便d〕T4・〔第342便d〕', 'tests/lib-w340d-gyropath.mjs・tests/lib-w342d-gyropathfix.mjs', '扁平 ÷ 球の経路の比', 'どちらでもない(h₁・h₀ と rotU = ½∇×Σ m_j abs(x − y_j)^(−p)(s ŝ × y_j) —— 重みの和で割らない)', '2 倍角の則の型・重みつき和'],
  ['〔第341便d〕〔第342便c〕〔第343便d〕', 'tests/lib-w341d-oblatering.mjs・tests/lib-w342c-oblateapprox.mjs・tests/lib-w343d-surfquad.mjs', '扁平の源の区切り・近似・表面の求積', 'どちらでもない(核 h₁ が固定)', '2 倍角の則の型'],
  ['〔第347便h〕', 'tests/lib-w347h-axisdiff.mjs', '並進引きずりの枠の速度の場から受け手の回転の候補', 'geoPN=2 の形(u = Σ w_j c_j ÷ (D₀ + Σ w_j)・c_j = v_j + s_j (R_j/(R_j + d))^q â_j × (x − r_j)・w_j = m_j/d^(p_w))', 'kFrame と q の形'],
  ['〔第348便d〕', 'tests/lib-w348d-diskaxis.mjs', '候補の回転を円盤引きずりの器に入れた (A)〜(D)', 'geoPN=2 の形(〔第347便h〕の場・p_w 1・q 0・2・3 × D₀ 0・0.1)', 'kFrame と q の形'],
  ['〔第309便a〕・〔第330便b〕(参照の lib)', 'tests/lib-w309a-invsq.mjs・tests/lib-w330b-dragweight.mjs', '新則 invSq の K2・M2 の閉じた式と受け手の規則/第132報の重みの式の会計', 'geoPN=3 の形(Σ重みで割る・自分と背景を分母に)—— 円盤引きずりの側の量(寄せる向き・経路・環)は数えていない', '本節が呼ぶ(K2・M2)'],
  ['〔第348便i〕(本節)', 'tests/lib-w348i-diskgeo3.mjs', '円盤引きずりの側の量 (A)〜(D) の数え直し', 'geoPN=3 の形(表 2)', '本節'],
].map((r) => Object.freeze(r)));
export function inventoryTable() {
  return ['| 節 | lib | 何を数える器か | 場の形(geoPN=2 の形か geoPN=3 の形か) | 入れ方 |', '|---|---|---|---|---|',
    ...INVENTORY.map((r) => `| ${r[0]} | \`${r[1].split('・').join('`・`')}\` | ${r[2]} | ${r[3]} | ${r[4]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 源の回転 0 かつ W₀ = W_ii = 0 で候補の回転(受け手の速度を引いても)/対照: W₀ 0.1 で受け手の速度を引く | ${fe(S.zeroRot)}/${fe(S.zeroRotCtl)} | ${tf(G.zeroRot)} |`,
    `| ② (Rcv)・W₀ = W_ii = 0 は剛体の回転: (W) と ẑ の差・(P2) と ẑ − ê(ê·ẑ) の差・輪の corS・drag90 の寄せる力 ÷ 部位の力の和 | ${fe(S.rigidW)}・${fe(S.rigidP2)}・${fe(S.rigidPull)} | ${tf(G.rigid)} |`,
    `| ③ W₀ と W_ii は和だけが効く((0.1, 0) と (0, 0.1) の相対の差)/変異(W_ii を分母から落とす) | ${fe(S.sumOnly)}/${fe(S.sumOnlyMut)} | ${tf(G.sumOnly)} |`,
    `| ④ 〔第348便d〕の場への極限((Rcv)・p 1・W₀ = D₀ = 〔第348便d〕の q 0): (P2)・(W) の相対の差 | ${fe(S.lim348dP2)}・${fe(S.lim348dW)} | ${tf(G.lim348d)} |`,
    `| ⑤ 通過: p 1・W₀ = D₀ 0.1 の輪の傾きと〔第348便d〕の通過の相対の差・(W) の比の差/W₀ = W_ii = 0 の輪の相対の量 ÷ 尺度/自分の重みだけ(W_ii 0.01)の傾き | ${fe(S.flyLim)}・${fe(S.flyLimW)}/${fe(S.flyZero)}/${fe(S.flySelf)} | ${tf(G.fly)} |`,
    `| ⑥ (Rm2) の点の式(第309便a の M2・K2)の相対の差/遠方の (M2 ÷ K2) d ÷ R² と 2/5 の差 | ${fe(S.m2Point)}/${fe(S.m2Far)} | ${tf(G.m2)} |`,
    `| ⑦ 変異: 受け手の速度の符号を変えた相対の差/(W) の符号で corV の寄せる力の和 ÷ 元 | ${fe(S.vRecMut)}/${fe(S.wsign.flipDiff)} | ${tf(G.mutants)} |`,
    `| ⑧ 差分の勾配と第347便h の解析の勾配の差 ÷ 尺度 | ${fe(S.jDiff)} | ${tf(G.jacobian)} |`,
    `| ⑨ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // (A) geoPN=3 の形の場の行(d ごと)
  const aHead = '| 源の回転の分 | W₀ | W_ii | 受け手の速度 | 候補 | corV の向き・比 | corS の向き・比 | drag90 の向き・比 | 向きが変わる高さの括り(z/r・正の側) | 〔第348便d〕の列で一番近い列(corV・corS・drag90 —— q・D₀) |';
  const nearTxt = (r) => (r.near348d ? `q ${r.near348d.q}・${r.near348d.D0}` : '無し');
  const aRows = (d) => { const out = [];
    for (const rot of J.decl.rots) for (const dn of denOfJ(J, rot)) for (const vr of J.decl.vRec) for (const cand of J.decl.cands) {
      const R = J.A.rows.filter((r) => r.rot === rot && r.Wbg === dn[0] && r.Wself === dn[1] && r.vRec === vr && r.cand === cand && r.d === d), by = Object.fromEntries(R.map((r) => [r.action, r]));
      out.push(`| ${ROT[rot]} | ${dn[0]} | ${dn[1]} | ${VR[vr]} | (${cand}) | ` + ACT.map((a) => `${DIR[by[a].dir]}・${fr(by[a].vsH1)}`).join(' | ')
        + ` | ${R.filter((r) => r.zStarPos).map((r) => r.action + ' ' + br(r.zStarPos)).join('・') || '無し'} | ${ACT.map((a) => nearTxt(by[a])).join('/')} |`); }
    return out; };
  T.A10 = [aHead, '|---|---|---|---|---|---|---|---|---|---|', ...aRows(10)].join('\n');
  T.A3 = [aHead, '|---|---|---|---|---|---|---|---|---|---|', ...aRows(3)].join('\n');
  // (A) 比べる列: 〔第348便d〕の場(geoPN=2 の形)
  T.Aref = ['| 距離 | 候補 | q | D₀ | corV の向き・比 | corS の向き・比 | drag90 の向き・比 |', '|---|---|---|---|---|---|---|',
    ...J.decl.A.d.flatMap((d) => J.decl.cands.flatMap((cand) => [0, 2, 3].flatMap((q) => [0, 0.1].map((D0) => { const R = J.A.ref348d.filter((r) => r.d === d && r.cand === cand && r.q === q && r.D0 === D0), by = Object.fromEntries(R.map((r) => [r.action, r]));
      return `| ${d} | (${cand}) | ${q} | ${D0} | ` + ACT.map((a) => `${DIR[by[a].dir]}・${fr(by[a].vsH1)}`).join(' | ') + ' |'; }))))].join('\n');
  // (B) 経路の比(r/R_eq 2・z/r 0.1)
  const bp = J.B.filter((r) => r.rOverReq === 2 && r.zOverR === 0.1);
  T.B = ['| W₀ | W_ii | 候補 | 軸の傾きの比(扁平 0.098) | 軸の傾きの比(扁平 0.3) | 寄せる力の比 corV・corS・drag90(扁平 0.098) |', '|---|---|---|---|---|---|',
    ...J.decl.B.den.flatMap((dn) => J.decl.cands.map((cand) => { const m = (f) => bp.find((r) => r.Wbg === dn[0] && r.Wself === dn[1] && r.cand === cand && r.f === f), a = m(0.098), b = m(0.3);
      return `| ${dn[0]} | ${dn[1]} | (${cand}) | ${fr(a && a.axisTiltRatio)} | ${fr(b && b.axisTiltRatio)} | ${a && a.path ? ACT.map((k) => fr(a.path[k].ratio)).join('・') : '—'} |`; }))].join('\n');
  // (C) 土星の環
  T.C = ['| 源の回転の分 | W₀ | W_ii | 受け手の速度 | 候補 | 点・corV の向き(区分 5) | K = 寄せる力 ÷ (z n²)(z/r 1e-6・D〜F 環) | 点・corV の向きが変わる高さ | 輪・corS の向き・括り(z/r) | 輪・drag90 の向き・括り(z/r) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.rots.flatMap((rot) => denOfJ(J, rot).flatMap((dn) => J.decl.vRec.flatMap((vr) => J.decl.cands.map((cand) => {
      const sel = (r) => r.rot === rot && r.Wbg === dn[0] && r.Wself === dn[1] && r.vRec === vr && r.cand === cand, R = J.C.rows.filter(sel), dirs = [...new Set(R.map((r) => DIR[r.dir]))].join('/'), Ks = R.map((r) => r.K).filter((x) => x !== null && x !== 0);
      const nz = R.filter((r) => r.zStar !== null).length, rg = J.C.ring.filter(sel);
      const ring = (a) => { const X = rg.filter((r) => r.action === a), bs = X.filter((r) => r.zStarPos); return [...new Set(X.map((r) => DIR[r.dir]))].join('/') + '・' + (bs.length ? bs.length + '/' + X.length + ' 区分 ' + [...new Set(bs.map((r) => br(r.zStarPos)))].join('・') : '括り無し'); };
      return `| ${ROT[rot]} | ${dn[0]} | ${dn[1]} | ${VR[vr]} | (${cand}) | ${dirs} | ${Ks.length ? (fe(Math.min(...Ks)) === fe(Math.max(...Ks)) ? fe(Ks[0]) : fe(Math.min(...Ks)) + '〜' + fe(Math.max(...Ks))) : '0'} | ${nz ? nz + '/' + R.length : '無し'} | ${ring('corS')} | ${ring('drag90')} |`; }))))].join('\n');
  const U = J.C.units;
  T.obs = ['| 固定の比べる列(合わせない —— リポジトリに既に在る数だけ) | 値 | 出どころ |', '|---|---|---|',
    `| 環の典型の厚み | ${J.lit.thick10m} m(同じ桁 = ${f3(J.lit.sameOrder[0])}〜${J.lit.sameOrder[1]} 倍) | ${J.lit.thickSrc} |`,
    `| 帯の幅(R_eq の読み) | ${f3(U.hBandM)} m | 第338便d の hBand(器の中の値 —— 第337便i の帯の型) |`,
    `| 一様の物差し | 局所のべき ≤ ${J.lit.uniformPow} | ${J.lit.uniformSrc} |`,
    `| 区分の中心 [km] | ${J.C.rows.filter((r) => r.rot === 'cv' && r.Wbg === 0 && r.Wself === 0 && r.vRec === 'off' && r.cand === 'W').map((r) => RING[r.key] + ' ' + r.rKm).join('・')} | ${J.lit.regionsSrc} |`].join('\n');
  // (D) 通過
  T.D = ['| 場 | W₀ | W_ii | 輪の半径 R_r | 輪の傾き i [deg] | 輪の傾き(∫ の角) | 面の内の回り | 残り ÷ R_r | 候補の傾き ÷ 輪の傾き (P2)・(W) | 〔第348便d〕の通過(D₀ = W₀ + W_ii)の輪の傾き | geoPN=3 ÷ 〔第348便d〕 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.D.rows.map((r) => `| ${ROT[r.rot]} | ${r.Wbg} | ${r.Wself} | ${r.Rr} | ${r.inc} | ${fe(r.tilt)} | ${fe(r.inPlane)} | ${fe(r.restOverRr)} | ${fr(r.cand.P2.vsRing)}・${fr(r.cand.W.vsRing)} | ${r.ref348d ? fe(r.ref348d.tilt) : '—'} | ${r.ref348d ? fr(r.ref348d.ratio) : '—'} |`)].join('\n');
  return T;
}

/** 節の文に載せる数の文(QA が節に逐語で在ることを照合する) */
export function factsOf(J) {
  const F = {}, A = J.A.rows;
  const grp = (f) => `${A.filter(f).length}/${A.length}`;
  F.Anear = '〔第348便d〕の列で一番近い列(向きが同じ列のうち比の対数の差が一番小さい列 —— 行の数): ' + ['0|0', '0|0.1', '2|0', '2|0.1', '3|0', '3|0.1'].map((k) => { const [q, D0] = k.split('|').map(Number); return `q ${q}・D₀ ${D0} ${A.filter((r) => r.near348d && r.near348d.q === q && r.near348d.D0 === D0).length}`; }).join('・') + `・向きが同じ列が無い ${A.filter((r) => !r.near348d).length}`;
  const pair = (r, key, val) => A.find((x) => x.rot === r.rot && x.Wbg === (key === 'Wbg' ? val : r.Wbg) && x.Wself === (key === 'Wself' ? val : r.Wself) && x.vRec === (key === 'vRec' ? val : r.vRec) && x.cand === r.cand && x.d === r.d && x.action === r.action);
  const onRows = A.filter((r) => r.vRec === 'on'), flip = onRows.filter((r) => pair(r, 'vRec', 'off').dir !== r.dir);
  F.AvRec = `受け手の速度を引く行で、引かない行と向きが違う行: ${flip.length}/${onRows.length}(W₀ + W_ii = 0 の行では ${flip.filter((r) => r.Wbg + r.Wself === 0).length}・違う行の作用 ` + ACT.map((a) => `${a} ${flip.filter((r) => r.action === a).length}`).join('・') + ')';
  const so = A.filter((r) => r.rot !== 'k1' && r.Wbg === 0 && r.Wself === 0.1), soSame = so.filter((r) => { const b = A.find((x) => x.rot === r.rot && x.Wbg === 0.1 && x.Wself === 0 && x.vRec === r.vRec && x.cand === r.cand && x.d === r.d && x.action === r.action); return b.dir === r.dir && fr(b.vsH1) === fr(r.vsH1); });
  F.Asum = `(W₀, W_ii) = (0, 0.1) と (0.1, 0) の行((Rcv)・(Rm2))で向きと比が同じ: ${soSame.length}/${so.length}`;
  const k1 = A.filter((r) => r.rot === 'k1'), k1d = (f) => `${k1.filter(f).length}/${k1.length}`;
  F.Ak1 = `(Rk1)(在位の本が宣言している形)の行: 一番近い〔第348便d〕の列 ` + ['0|0', '0|0.1', '2|0', '2|0.1', '3|0', '3|0.1'].map((k) => { const [q, D0] = k.split('|').map(Number); return `q ${q}・D₀ ${D0} ${k1.filter((r) => r.near348d && r.near348d.q === q && r.near348d.D0 === D0).length}`; }).join('・') + `・無し ${k1.filter((r) => !r.near348d).length}(全 ${k1.length} 行)・受け手の速度で向きが変わる行 ${k1.filter((r) => r.vRec === 'on' && pair(r, 'vRec', 'off').dir !== r.dir).length}/${k1.filter((r) => r.vRec === 'on').length}・向きが変わる高さの括り ${k1d((r) => r.zStarPos !== null)}`;
  F.Aband = '向きが変わる高さの括りが在る行: ' + J.decl.rots.map((rot) => J.decl.cands.map((c) => `${ROT[rot]}(${c}) ${grp((r) => r.rot === rot && r.cand === c && r.zStarPos !== null).split('/')[0]}/${A.filter((r) => r.rot === rot && r.cand === c).length}`).join('・')).join('・') + `・〔第348便d〕の列 ${J.A.ref348d.filter((r) => r.zStarPos !== null).length}/${J.A.ref348d.length}`;
  const tr = (dn, c) => { const X = J.B.filter((r) => r.Wbg === dn[0] && r.Wself === dn[1] && r.cand === c).map((r) => r.axisTiltRatio).filter((x) => x !== null); return X.length ? `${f3(Math.min(...X))}〜${f3(Math.max(...X))}` : '—(傾き 0)'; };
  F.Btilt = '軸の傾きの比の範囲(扁平 2 × 距離 3 × 高さ 2): ' + J.decl.B.den.map((dn) => `(W₀, W_ii) = (${dn[0]}, ${dn[1]}) の (P2) ${tr(dn, 'P2')}・(W) ${tr(dn, 'W')}`).join('/');
  const Cw = J.C.rows.filter((r) => r.cand === 'W'), Kr = (rot) => { const X = Cw.filter((r) => r.rot === rot).map((r) => r.K); return `${fe(Math.min(...X))}〜${fe(Math.max(...X))}`; };
  const cb = J.C.ring.filter((r) => r.HstarM), hs = cb.map((r) => r.HstarM[0]);
  F.C = `土星の環: 点・corV の (W) は区分 5 とも寄せる行 ${Cw.filter((r) => r.dir === 'toward').length}/${Cw.length}・K の範囲 (Rcv) ${Kr('cv')}・(Rm2) ${Kr('m2')}・(Rk1) ${Kr('k1')}・(P2) の点・corV は 0 の行 ${J.C.rows.filter((r) => r.cand === 'P2' && r.dir === 'none').length}/${J.C.rows.filter((r) => r.cand === 'P2').length}・点の向きが変わる高さ ${J.C.rows.filter((r) => r.zStar !== null).length}/${J.C.rows.length}・輪の受け手の括り ${cb.length}/${J.C.ring.length}` + (hs.length ? `(厚み 2 z* の括りの下の端 ${fe(Math.min(...hs))}〜${fe(Math.max(...hs))} m —— 典型の厚み 10 m の ${fe(Math.min(...hs) / J.lit.thick10m)} 倍以上)` : '');
  { let m = 0; for (const r of J.C.rows.filter((x) => x.vRec === 'on')) { const o = J.C.rows.find((x) => x.rot === r.rot && x.Wbg === r.Wbg && x.Wself === r.Wself && x.vRec === 'off' && x.cand === r.cand && x.key === r.key); if (r.K !== null && o.K) m = Math.max(m, Math.abs(r.K / o.K - 1)); }
    F.CvRec = `受け手の速度を引く/引かないの点・corV の K の相対の差の最大 ${fe(m)}`; }
  const dp = J.D.rows.filter((r) => r.rot === 'cv' && r.Wbg + r.Wself > 0 && r.inc > 0), rr = (c) => { const X = dp.map((r) => r.cand[c].vsRing); return `${f3(Math.min(...X))}〜${f3(Math.max(...X))}`; };
  const rat = (S) => { const X = dp.filter((r) => r.Wbg + r.Wself === S).map((r) => r.ref348d.ratio); return `${f3(Math.min(...X))}〜${f3(Math.max(...X))}`; };
  F.D = `(Rcv) の通過(W₀ + W_ii > 0・輪の傾き > 0 の ${dp.length} 行): 候補の傾き ÷ 輪の傾き (P2) ${rr('P2')}・(W) ${rr('W')}・geoPN=3 ÷ 〔第348便d〕の輪の傾き(和 0.01) ${rat(0.01)}・(和 0.1) ${rat(0.1)}・(和 0.2) ${rat(0.2)}・W₀ = W_ii = 0 の行の傾きと残り 0 の数 ${J.D.rows.filter((r) => r.Wbg + r.Wself === 0 && r.tilt === 0 && r.rest === 0).length}/${J.D.rows.filter((r) => r.Wbg + r.Wself === 0).length}・自分の重みだけ(W₀ 0)で傾きが 0 でない行 ${J.D.rows.filter((r) => r.Wbg === 0 && r.Wself > 0 && r.inc > 0 && r.tilt > 0).length}/${J.D.rows.filter((r) => r.Wbg === 0 && r.Wself > 0 && r.inc > 0).length}`;
  { const kd = J.D.rows.filter((r) => r.rot === 'k1' && r.Wbg + r.Wself > 0 && r.inc > 0).map((r) => r.ref348d.ratio);
    F.Dk1 = `(Rk1) の通過(W₀ + W_ii > 0・輪の傾き > 0 の ${kd.length} 行): 〔第348便d〕の通過(D₀ = W₀ + W_ii)の輪の傾きとの比 ${f3(Math.min(...kd))}〜${f3(Math.max(...kd))}`; }
  return F;
}
