# DFM の主要な計算式 —— 数式版とプログラム版

- **出どころ**: 原仮定者の依頼(2026-11-09)「今の DFM で使われている主要な計算式をリスト化する。解説付きで、数式版とプログラム版を用意する」・統括の検証項目 R313(第331便d)。
- **対象**: beta の本体 `beta/index.html`(版 v1.47-b331 の基点)と、tests の診断の lib。root(v1.46.0)は対象の外(beta の式が先に進んでいる)。
- **位置づけ**: 式の**索引**である。式の正本は `docs/PHYSICS.md`(§5 の E1′〜E12 と、後の便の節)と、プログラムの本体。本書は物理の主張をしない —— 各項の「解説」に、何を主張しないかを書く。
- **原仮定者の整理(2026-11-09)との関係**: 整理の文(宣言)と今のコード(実装)を §2 の対応表で分けて並べる。整理の文を今のコードの式として書かない。

## 0. 読み方(本書の約束)

各項(`### EQ-NN …`)は次の 5 つの欄を持つ。

1. **ラベル** —— 次の 5 つのどれか。
   - `実装〔既定〕` …… 宣言の無い本でも走る式(全部の本の步の中)。
   - `実装〔opt-in〕` …… 宣言した本だけ走る式(在位の本が宣言しているかを解説に書く)。
   - `実装〔読み口〕` …… `beta/index.html` の純関数で、時間を進めない(表示・器・QA が読む)。
   - `診断` …… tests の lib の式。アプリの時間発展に接続していない。
   - `宣言〔未接続〕` …… 原仮定者の整理・決断の作業仮説。エンジンに入っていない(診断の lib に部分があれば抜粋する)。
2. **数式版** —— PHYSICS と同じ Unicode の式。添字 i は受け手(評価する粒子)、j は源。d_ij = |r_i − r_j|。
3. **解説** —— 何を表すか・どこで使うか・何を主張しないか。
4. **プログラム版** —— 実物の抜粋(短く —— 要の行だけ)。見出しの行 `**プログラム版 k**(\`ファイル\` · \`関数の名\`)` の直後の js のブロック。ブロックの中の `// …` の行は省略の印で、その前後は別の断片。
5. **PHYSICS の節** —— 正本の節(§5 の E の名と、後の便の節の名)。

**照合の QA**(第331便d —— `lint.equations331d`・`docs.equations331d`): プログラム版の各断片が、名指しのファイルの、名指しの関数の本体の中に、空白を 1 つにまとめた形でそのまま在ることを照合する。エンジンを変える便で抜粋が古くなると、QA は「EQ-NN の抜粋 k(ファイル · 関数)の断片 m」の名で落ちる —— §7 の手順で直す。定数(C₁・Y_k・R_d/r_s・G_loc と K1 の近点の一次の比)は QA が式から計算し直して本書の値と、在位の水星の正本 `tests/out/inposk1-w315c.json` と照らす。

## 1. 記号と単位

| 記号 | 意味 | コードの名(本の単位) |
|---|---|---|
| G₀・c₀ | 本の基準重力・基準光速 | `physics.G`・`physics.cLight` |
| X_k | 時空係数(物理対応ロックで X_k = G₀/c₀²) | `physics.kappaT`(旧 Kt の逆数) |
| κ_D | 決定力定数 κ_D ≡ 2G/c²(本では 2G₀/c₀² = 2X_k) | 表示 `stDerivedOf` の `kappaD` |
| r_s | 重力半径 r_s = κ_D m = 2G₀m/c₀² | 規則の読み口の `rdOverRs` の分母 |
| Y_k | 引きずり係数 Y_k = 10G₀/(C₁c₀²)(K1 の規則 R_d = Y_k m_d) | `invSqKappa0(G, c)` |
| C₁ | 単位の球の K1 の自己の場の調和平均 C₁ = 6[(√3/2)ln(2+√3) − 1] | `REL_DRAG_INVSQ_C1` |
| D₀ | 背景決定力 | `physics.D0` |
| W | 決定力場(E1′ —— 整理の D_loc) | `S.Wat`・`sumW` |
| ε | Plummer の軟化長 | `physics.softening` |
| k_F | フレームの追従係数 | `physics.kFrame` |
| u | 引きずりの速度(旧フレームは E3 の u・慣性決定力は ẋ = v + u の u) | `uAx/uAy`・`_rdUX/_rdUY/_rdUZ` |
| s・â・Ω | 符号つきの自転の速さ・自転軸・Ω = s â | `S.spin`・`S.sax/say/saz` |
| R・R_d・R_src | 観測の半径・引きずりの半径(受け手)・源のモーメントの半径 | `S.R`・`_rdIsqRd`・`_rdIsqRs` |
| m_d | 引きずりの質量(dragCore の massFrac × m —— 宣言が無ければ m) | `_rdIsqMd` |
| β_ij | 受け手 i が源 j から受ける並進の重み(新則 —— 比の平均) | `_rdIsqBE` |
| n(G_loc) | G_loc の次数(公転の平均運動 n_orb と別) | `physics.gLoc` の `n`(law:"kappaC2" は 2) |
| κ_epi | 周転円の振動数(銀河の円盤 —— κ_D と別の量) | tests の `kappaEpi` |

本の単位は本ごとに違う(物理の単位の宣言 scaleExp がある本だけ SI へ換算できる)。

## 2. 原仮定者の整理(2026-11-09)と今のコードの対応

| 整理の文(宣言) | 今のコード(実装) | 区別 | 項 |
|---|---|---|---|
| 局所の決定力場の強さ D_loc は決定力 D = m/r の総和 —— D_loc = ΣD + D₀ | E1′: W(r) = D₀ + Σ_j m_j/√(d_j² + ε²)(Plummer の分母 —— ε → 0 で m/d)。変数の名は W(D_loc という名は無い) | 実装〔既定〕(ε を除いて同じ型) | EQ-01 |
| 重力は決定力場の勾配に比例する —— 逆二乗重力 | E4: a_i = −G₀ Σ_{j≠i} m_j (r_i − r_j)/(d_ij² + ε²)^{3/2} = G₀∇W(自分の場を除く) | 実装〔既定〕 | EQ-02 |
| 決定力場の時間変化に追従する座標変換が引きずり・慣性力は自分自身の引きずり | 今のコードには引きずりの経路が 3 つ並ぶ: 旧フレーム(E3・E6′ —— 重み m/√(d²+ε²)・自分を分母から除く・Δv = k_F Δu)/慣性決定力の旧則(重み m r/(r²+ε²)²〔遠方 m/r³〕・分母 W_bg + Σw)/新則 invSq(核 K1 の遠方 1/r か K2 の遠方 1/r²・分母に受け手自身の有限の球の場を含む)。「座標変換」としての 1 本の式はエンジンに無い | 実装(経路ごと)と宣言〔未接続〕 | EQ-06・07・10〜13・28 |
| 引きずりは相対的な移動と回転に m/r² の重み | 在位の 7 本(K1)の並進の遠方の重みは m/r。新則の回転の項は源のモーメント(K1 の遠方 1/r²)で、「接線の速度 Ω × r に m/r²」とは別の演算子。m/r² の重み・自己を含む分母・自転の目標の型は tests の lib(第330便b)だけ | 宣言〔未接続〕(AN586 —— 先に検証) | EQ-15・28 |
| 引きずりの重みと重力加速度が比例している | 今のコードの恒等式ではない。重力の対の係数 m/(d²+ε²)^{3/2}(E4)と、引きずりの重み(旧フレーム m/√(d²+ε²)・旧則 m r/(r²+ε²)²・K1 の遠方 m/r)は別の関数 | 宣言〔未接続〕 | EQ-02・28 |
| 軸引きずりは引きずられる側の引きずりの差分 | 新則の軸の項 amp = −n̂·∇(m_d M/W) —— 受け手の体積の近い側と遠い側の回転引きずりの符号つきの差分(同じ型) | 実装〔opt-in〕(在位の 7 本は宣言しない) | EQ-16 |
| 水星の近点移動は G_loc を採用 | 在位の 🌡️ は G_loc(n = 2・受け手)と K1 の引きずりの**組**: G_loc の分 −28.65″/世紀(逆行 —— 一次の比 −2/3)と K1 の引きずりの分 +71.63″/世紀(一次の比 +5/3)の和が 42.98″/世紀(二体の 1PN の式の値 42.98051″/世紀との差 2.6×10⁻⁵″/世紀)—— 規則で置いた R_d の宣言の下で、二つの項の和が一次の値 q_1PN になる | 実装〔opt-in〕(整理の「G_loc を採用」の今の形は G_loc と K1 の引きずりの組・原仮定者の補足(2026-11-09)「活かしたい」) | EQ-18 |

同じ報の追記 1(回転引きずりの大きな影響は遠心力を弱めること)と追記 2(K1 の R_d の計算は「太陽–木星」のスケールで有効か・土星の環の厚みとの関連)は、本書の対象の外(式の候補と表は同じ便の別の枝の診断 —— エンジンの式ではない)。

## 3. 項の一覧

| 項 | 名 | ラベル |
|---|---|---|
| EQ-01 | 決定力場 W(E1′) | 実装〔既定〕 |
| EQ-02 | 重力(E4) | 実装〔既定〕 |
| EQ-03 | 時空の係数 κ_D・X_k・r_s(物理対応ロック) | 実装〔既定〕 |
| EQ-04 | 固有時間(E7R) | 実装〔既定〕 |
| EQ-05 | 光線(E8R) | 実装〔既定〕 |
| EQ-06 | 旧フレームの場(E2・E3) | 実装〔既定〕 |
| EQ-07 | 旧フレームの輸送と反作用(E6′・E6′-R) | 実装〔既定〕 |
| EQ-08 | geoPN=2 の v−u 輸送 | 実装〔opt-in〕 |
| EQ-09 | 測地線 1PN(E12 —— 比べる宣言) | 実装〔opt-in〕 |
| EQ-10 | 慣性決定力の旧則(W_bg) | 実装〔opt-in〕 |
| EQ-11 | 新則 invSq の核 K1・K2・M1・M2 | 実装〔opt-in〕 |
| EQ-12 | 新則の分母(自己の有限球・Wbg2 = 0)と比の平均 β | 実装〔opt-in〕 |
| EQ-13 | 新則の並進の連立(一度だけ解いて一度だけ動かす) | 実装〔opt-in〕 |
| EQ-14 | R_d の規則(C₁・Y_k) | 実装〔opt-in〕 |
| EQ-15 | 回転引きずり(源のモーメント・R_src) | 実装〔opt-in〕 |
| EQ-16 | 軸引きずり(受け手の近と遠の差分) | 実装〔opt-in〕 |
| EQ-17 | 銀河の一様軸引きずり | 実装〔opt-in〕 |
| EQ-18 | 局所重力 G_loc と近点の一次の式 | 実装〔opt-in〕 |
| EQ-19 | 明示潮汐の力・トルク・熱 | 実装〔opt-in〕 |
| EQ-20 | 内部熱の蓄積と放射 | 実装〔opt-in〕 |
| EQ-21 | 軸と速さの保持の帳簿 | 実装〔opt-in〕 |
| EQ-22 | 由来ごとの口と熱(port) | 診断 |
| EQ-23 | ジャイロ | 診断 |
| EQ-24 | 測地の歳差と 1PN の近点(文献の式) | 診断 |
| EQ-25 | 密度波のラベル(κ_epi) | 診断 |
| EQ-26 | 場の API(Φ と A) | 実装〔読み口〕 |
| EQ-27 | 積分と適用の順序 | 実装〔既定〕 |
| EQ-28 | 座標変換の引きずり(並進 + 回転・m/r²・自転の目標) | 宣言〔未接続〕 |

## 4. 各項

### EQ-01 決定力場 W(E1′)

- **ラベル**: 実装〔既定〕
- **数式版**: w_j(r) = m_j/√(d_j² + ε²)、 W(r) = D₀ + Σ_j w_j(r)(ε → 0 で原仮定の m/d)
- **解説**: 決定力場の正本の式。任意の点の W(表示の `S.Wat`)は全部の粒子と D₀(と箱の W_B)を足す(光線は重い源だけ —— EQ-05)。力学の対のループは同じ分母で w を積み、時計(EQ-04)は自分の場を除いた和を使う。原仮定者の整理の D_loc = ΣD + D₀ はこの W と同じ型(違いは ε)。W は力ではない。
- **プログラム版 1**(`beta/index.html` · `S.Wat`)

```js
let w=S.params.D0; const eps=S.params.softening;
// …
w+=S.m[i]/Math.sqrt(dx*dx+dy*dy+eps*eps);
```

- **プログラム版 2**(`beta/index.html` · `S._core`)

```js
const invW=1/Math.sqrt(d2+eps2);
// …
const wj=mj*invW, wi=mi*invW;
sumW[i]+=wj; sumW[j]+=wi;
```

- **PHYSICS の節**: §5 E1′(A3)

### EQ-02 重力(E4)

- **ラベル**: 実装〔既定〕
- **数式版**: a_grav,i = −G₀ Σ_{j≠i} m_j (r_i − r_j)/(d_ij² + ε²)^{3/2}( = G₀∇W —— ∇w_j = −m_j (r − r_j)/(d_j² + ε²)^{3/2})
- **解説**: 決定力場の勾配が逆二乗の重力を作る(A6)。二次元の核 `S._core` と三次元の核 `dfmCore3` が同じ式。対は作用反作用で対称(固定の天体・近似多粒子の対のマスクは別の契約)。G_loc を宣言した本は EQ-18 の補正を足す。原仮定者の整理の「引きずりの重みと重力加速度が比例」は、この係数と引きずりの重みの関係の宣言で、今のコードの恒等式ではない(EQ-28)。
- **プログラム版 1**(`beta/index.html` · `S._core`)

```js
const invd3=invW*invW*invW;
const fg=G*invd3;
ax[i]-=fg*mj*dx; ay[i]-=fg*mj*dy;
ax[j]+=fg*mi*dx; ay[j]+=fg*mi*dy;
```

- **プログラム版 2**(`beta/index.html` · `dfmCore3`)

```js
const fg=G*invd3;
ax[i]-=fg*mj*dx; ay[i]-=fg*mj*dy; az[i]-=fg*mj*dz;
```

- **PHYSICS の節**: §5 E4(A6)

### EQ-03 時空の係数 κ_D・X_k・r_s(物理対応ロック)

- **ラベル**: 実装〔既定〕
- **数式版**: X_k = G₀/c₀²(物理対応ロック —— 値域のクランプつき)、 κ_D = 2G₀/c₀² = 2X_k、 r_s = κ_D m = 2G₀m/c₀²
- **解説**: X_k は時計(EQ-04)と光線(EQ-05)の ψ = X_k W の係数。物理対応ロックは受理・読み込み・編集の全部の経路で X_k を G₀/c₀² に導出する(内蔵の退役の本は ID で判定してロックの外)。κ_D と X_k と Y_k はパラメータの「時空」の欄に計算済みの値として出る(表示だけ —— params・状態・署名に書かない)。r_s は R_d の比(EQ-14)の分母。
- **プログラム版 1**(`beta/index.html` · `xkDerivedOf`)

```js
const tgt=(G>0)? G/(c*c) : 0; return clamp(tgt,cc[0],cc[1]);
```

- **プログラム版 2**(`beta/index.html` · `stDerivedOf`)

```js
const kappaD=(2*G)/(c*c);
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqRdRuleState`)

```js
rdOverRs:(ok && Rd>0)? Rd/(2*G*mj/(c*c)) : null
```

- **PHYSICS の節**: §5 E7R・E8R(係数)・〔第326便a〕(ロックを常に)・〔第326便c〕(計算済みの値の表示)

### EQ-04 固有時間(E7R)

- **ラベル**: 実装〔既定〕
- **数式版**: ψ_i = X_k (D₀ + W_B + Σ_{j≠i} w_j)、 N_i = e^{−ψ_i}、 A_i = e^{+ψ_i}、 τ̇_i = √(N_i² − A_i² |v_i − u_i|²/c₀²)(根号の中 ≤ 0 は τ̇ = 0)
- **解説**: 粒子の時計。自分の決定力は自分の時計に入れない。u_i は E3 と同じ自分を除いたフレーム(分母が 0 なら運動の項なし)。PHYSICS §5 の書き方 ψ = W_ext/K_t は旧い記号で、今のコードは X_k = 1/K_t を掛ける。二次元の核 `S._core` の步が呼ぶ(三次元の核 `dfmCore3` は呼ばない)。
- **プログラム版 1**(`beta/index.html` · `S.tauUpdate`)

```js
const denom=S.params.D0+WB+S.sumW[i];
const psi=denom*S.params.kappaT;
const N=Math.exp(-psi), A=Math.exp(psi);
// …
rvx=S.vx[i]-(S.uAx[i]+ubx)/denU; rvy=S.vy[i]-(S.uAy[i]+uby)/denU;
// …
const rad=N*N - A*A*(rvx*rvx+rvy*rvy)/(c0*c0);
S.tau[i]+= rad>0 ? dt*Math.sqrt(rad) : 0;
```

- **PHYSICS の節**: §5 E7R(A7′)

### EQ-05 光線(E8R)

- **ラベル**: 実装〔既定〕
- **数式版**: n_eff = e^{2ψ}(ψ = X_k (D₀ + W_B + Σ_{重い源} w_j))、 局所の光の速さ c₀/n_eff、 dĉ/dl = 2∇ψ − (2∇ψ·ĉ)ĉ(2∇ψ = −2X_k Σ_j m_j (r − r_j)/(d_j² + ε²)^{3/2})、 dr = ĉ dl + u dt(dl = (c₀/n_eff) dt)
- **解説**: フェルマーの則を、u と共動する局所のフレームで当てる。光線は質点ではないので自分を除く項は無い。曲げる源と n_eff の W に入る源は、偏向の基準を満たす重い天体だけ(`rayHeavy` —— 実装の近似)。随伴の項 u は kFrame を掛ける(kFrame = 0 の本は光も引きずらない)。光子は粒子へ反作用しない(表示の物理)。
- **プログラム版 1**(`beta/index.html` · `traceRay`)

```js
const p=S.params, kU=2*p.kappaT, eps=p.softening, eps2=eps*eps, q=p.q, c0=p.cLight, D0=p.D0, kF=p.kFrame;
```

- **プログラム版 2**(`beta/index.html` · `rayField`)

```js
gx-=kU*S.m[i]*dx*inv3; gy-=kU*S.m[i]*dy*inv3;
```

- **プログラム版 3**(`beta/index.html` · `photonStep`)

```js
const neff=Math.exp(O.kU*Wtot);
// …
const dl=(O.c0/neff)*dt;
// …
const dot=gx*cxv+gy*cyv;
cxv+=(gx-dot*cxv)*dl; cyv+=(gy-dot*cyv)*dl;
const cl=Math.sqrt(cxv*cxv+cyv*cyv); cxv/=cl; cyv/=cl;
// …
ph.x+=cxv*dl+uNx*adv; ph.y+=cyv*dl+uNy*adv;
```

- **PHYSICS の節**: §5 E8R(T5・T8)

### EQ-06 旧フレームの場(E2・E3)

- **ラベル**: 実装〔既定〕
- **数式版**: ω_j(d) = s_j (R_j/(R_j + d))^q(既定 q = 2)、 u(r) = [Σ_j w_j (v_j + ω_j(d_j) ẑ × (r − r_j))]/W(r)
- **解説**: 源の並進と自転が作る局所のフレームの速度。重みは決定力 w = m/√(d²+ε²)(m/r の型 —— 整理の m/r² ではない)。分母は E6′ では自分を除いた D₀ + Σ_{j≠i} w_j。kFrame > 0 の本で物質に効く(EQ-07)。粒子ごとの q・距離の基準(表面)・チャネルの分離・コアの差動は宣言した本だけの分岐。
- **プログラム版 1**(`beta/index.html` · `S._core`)

```js
if(sj!==0){ const tt=Rj/(Rj+hj); omj = (qj===2)? sj*tt*tt : sj*Math.pow(tt,qj); }
// …
uAx[i]+=wj*(vx[j]+omj*(-dy)); uAy[i]+=wj*(vy[j]+omj*(dx));
uAx[j]+=wi*(vx[i]+omi*(dy)); uAy[j]+=wi*(vy[i]+omi*(-dx));
```

- **PHYSICS の節**: §5 E2・E3(A4・A8)

### EQ-07 旧フレームの輸送と反作用(E6′・E6′-R)

- **ラベル**: 実装〔既定〕
- **数式版**: Δv_i = k_F (u_i(今回) − u_i(前回))(|Δu| ≤ 0.8 に飽和)、 反作用 Δv_j −= φ_ij Δp_i/m_j(φ_ij = w_j(r_i)/W(r_i)・背景の分 φ_bg = D₀/W はリザーバへ)。 E6′-R(`frameReaction:"pairReduced"`): J_ij = μ_ij (φ_ij d_i − φ_ji d_j)、 Δv_i = +J_ij/m_i、 Δv_j = −J_ij/m_j(μ_ij = m_i m_j/(m_i + m_j))
- **解説**: フレームの時間変化に質点が運ばれる離散化(経路に沿った Du/Dt の一次)。kFrame > 0 の本で走る(geoPN=1 の本は二重計上を避けて切る)。残余トルクは両方の自転へ等角加速度で移す。D₀ > 0 の系は遠方宇宙と交換する開放系(意図した境界条件)。E6′-R は宣言した本だけで、対の線運動量を構成的に閉じる。原仮定者の整理の「決定力場の時間変化に追従する座標変換」に一番近い今の離散化だが、重みは m/r の型。
- **プログラム版 1**(`beta/index.html` · `S._core`)

```js
const ux=unx/denom, uy=uny/denom;
if(S.hasU[i]){
let dux=ux-S.uPx[i], duy=uy-S.uPy[i];
const dl2=dux*dux+duy*duy;
if(dl2>0.64){ const sc=0.8/Math.sqrt(dl2); dux*=sc; duy*=sc; }
// …
vx[i]+=kFrame*dux; vy[i]+=kFrame*duy;
// …
const phi=(m[j]/Math.sqrt(d*d+eps2))/Wi;
const rpx=phi*dpxi, rpy=phi*dpyi;
// …
Jx=mu*(phiIJ*dix-phiJI*reqX[j]); Jy=mu*(phiIJ*diy-phiJI*reqY[j]); }
```

- **PHYSICS の節**: §5 E6′(A5・A13)・E6′-R

### EQ-08 geoPN=2 の v−u 輸送

- **ラベル**: 実装〔opt-in〕
- **数式版**: Δu = (u − u_prev) + {−J(v − u) + (∇×u) × (v − k_F u)} dt(J = ∇u = (∇P − u ⊗ ∇W)/W)、 |Δu| ≤ 0.8、 Δv = k_F Δu
- **解説**: 測地線の法則が v−u 則に解決する本(geoPN=2 と、kFrame > 0 の geoPN=1 —— 解決の表 `geoCoreDispatchBody`)で E6′ の代わりに走る連続の形の輸送(∂u/∂t + (u·∇)u + 渦度のコリオリ)。粒子を追う u の差分から ((v − u)·∇)u を引き、渦度の偏向を w = v − k_F u に当てる。反作用は E6′ と同じ道。三次元は範囲の門(λ_PN = 0・接触なし ほか)の内で `dfmCore3G2` が同じ式(平面の写しで二次元と同じ演算の列)。新則 invSq の有限の核の平均(EQ-11〜13)とは別の経路。
- **プログラム版 1**(`beta/index.html` · `S._core`)

```js
const rux=vx[i]-ux, ruy=vy[i]-uy;
// …
const wx2=vx[i]-kFrame*ux, wy2=vy[i]-kFrame*uy;
// …
const curl=Jyx-Jxy;
// …
let dux=(ux-S.uPx[i]) + (-(rux*Jxx+ruy*Jxy) + curl*(-wy2))*dt,
duy=(uy-S.uPy[i]) + (-(rux*Jyx+ruy*Jyy) + curl*( wx2))*dt;
```

- **PHYSICS の節**: §5 E12・〔第322便a〕(三次元)・DERIVATIONS §18

### EQ-09 測地線 1PN(E12 —— 比べる宣言)

- **ラベル**: 実装〔opt-in〕
- **数式版**: a_1PN = (λ_PN/c₀²) [((α − ½)v² − (1 + 2α)U) ∇U − (1 + 2α)(∇U·v) v]、 U = G₀ m_j/√(d² + ε²)(∇U は E4 のニュートンの加速度と同じベクトル)
- **解説**: E7R の時計の式の作用化から導いた弱場の 1PN。α = 1.5 が E7R の完全な計量(水星で +42.98″/世紀)・α = 0.5 は時間の率だけ(1/3)。λ_PN は 0 か 1 の比べる宣言で、観測へ寄せる係数ではない。源は偏向の基準を満たす大質量だけ。geoPN=2 では速度を w = v − k_F u に置き換え、反作用を源へ返す。三次元の geoPN=1 は `dfmCore3` の試験粒子の形と有限質量比の EIH の差分。較正の本(sampleClass が calibration)では G_loc(EQ-18)を受理で拒否する(EIH の 1PN と二重計上)。
- **プログラム版 1**(`beta/index.html` · `S._core`)

```js
const cA=1+2*pnA, cB=pnA-0.5;
// …
const Uj=G*mj*invW, gux=-fg*mj*dx, guy=-fg*mj*dy;
// …
const pnx=invC2*((cB*v2i-cA*Uj)*gux - cA*dU*wxi),
pny=invC2*((cB*v2i-cA*Uj)*guy - cA*dU*wyi);
```

- **PHYSICS の節**: §5 E12・〔第314便d〕(三次元)・DERIVATIONS §15

### EQ-10 慣性決定力の旧則(W_bg)

- **ラベル**: 実装〔opt-in〕
- **数式版**: u_i = Σ_j w_ij (V_j − v_i)/(W_bg + Σ_j w_ij)(V_j = v_j + u_j)、 w_ij = m_j r/(r² + ε²)²(遠方 m/r³ —— 構造核の表を宣言した源は表の値)、 解く形 (1 + c Σ_j w_ij) u_i − c Σ_j w_ij u_j = c Σ_j w_ij (v_j − v_i)(c = 1/W_bg)
- **解説**: `relativeDrag.law:"inertial"` の旧い法則(gain は廃止 —— 入口は背景の慣性決定力 W_bg [M/L³])。合成の既定は連鎖を一度だけ解く `compose:"solve"`。新則 invSq(EQ-11〜13)とは分子・分母・単位の全部が違う別の法則の版で、一緒に宣言しない。在位の 7 本は新則へ移った(〔第315便c〕)—— 旧則は地球–月–太陽の三次元の本・土星の環の本などの宣言に残る。W_bg を宣言しない本(null)は u = 0 の走り。
- **プログラム版 1**(`beta/index.html` · `relDragCoefficientOf`)

```js
return 1/rd.Wbg;
```

- **プログラム版 2**(`beta/index.html` · `dfmInertialDrag3Build`)

```js
const a=C*mj*((kv===null)? (r/(s*s)) : kv);
A[row+j]=a;
if(hist){ ux+=a*(WX[j]-WX[i]); uy+=a*(WY[j]-WY[i]); uz+=a*(WZ[j]-WZ[i]); }
deg+=a;
```

- **プログラム版 3**(`beta/index.html` · `dfmInertialDrag3Solve`)

```js
for(let j=0;j<n;j++) M[row+j]=FX[i]? 0 : -A[row+j];
M[row+i]=FX[i]? 1 : 1+DG[i];
```

- **PHYSICS の節**: 〔第298便c〕(三次元の慣性決定力)・〔第302便a〕(W_bg の直接定義)

### EQ-11 新則 invSq の核 K1・K2・M1・M2

- **ラベル**: 実装〔opt-in〕
- **数式版**: 一様な球(半径 R)の体積平均の核 K_p(r; R) = ⟨1/|x − ρ|^p⟩_ball。 K1 = 1/r(r ≥ R)・(3R² − r²)/(2R³)(r < R)、 dK1/dr = −1/r²・−r/R³。 K2 = (3/(2R²))[1 + (1 − x²)L/(2x)](x = r/R・L = ln|(1 + x)/(1 − x)| —— 中心 3/R²・表面 3/(2R²)・遠方 1/r²)。 回転のモーメント M1 = R²/(5r²)(外部)、 M2 の先頭 2R²/(5r³)
- **解説**: 新則の分子の核。K2 は近方(x < 0.3)と遠方(x ≥ 3)を級数で、中間を閉じた式で評価する(表面の近くの動径の微分は対数で大きくなる —— 値が有限なことと評価が安全なことは別)。K1 は一様な球の重力のポテンシャルと同じ形。遠方の次数は K1 で並進 r⁻¹・回転 r⁻²・軸 r⁻³、K2 で r⁻²・r⁻³・r⁻⁴。在位の 7 本は K1(`kernel:"k1"`)。
- **プログラム版 1**(`beta/index.html` · `inertialDragIsqK1`)

```js
if(r>=R){ B[0]=1/r; B[1]=-1/(r*r); return; }
const R3=R*R*R; B[0]=(3*R*R-r*r)/(2*R3); B[1]=-r/R3;
```

- **プログラム版 2**(`beta/index.html` · `inertialDragIsqK2`)

```js
const L=Math.log1p(x)-Math.log(Math.abs(1-x));
B[0]=1.5*(1+(1-x*x)*L/(2*x))/R2; B[1]=(1.5/x-0.75*(1+x*x)*L/(x*x))/(R2*R);
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqM1`)

```js
const q=R*R/(5*r*r); B[2]=q; B[3]=-2*q/r;
```

- **プログラム版 4**(`beta/index.html` · `inertialDragIsqM2`)

```js
B[2]=(-3/(8*x)+9*x/8+3*L*(1+3*x*x)*(1-x*x)/(16*x*x))/R;
```

- **PHYSICS の節**: 〔第309便a〕(K2・M2)・〔第312便a〕(K1 の族)

### EQ-12 新則の分母(自己の有限球・Wbg2 = 0)と比の平均 β

- **ラベル**: 実装〔opt-in〕
- **数式版**: W(x) = W_bg′ + m_d,i K(|x − x_i|; R_d,i) + Σ_{k≠i} m_d,k K(|x − x_k|; R_d,k)(x は受け手 i の球の求積の節点)、 β_ij = ⟨m_d,j K_j(x)/W(x)⟩_i(**比の平均** —— 平均の比 ⟨N⟩/⟨W⟩ ではない)、 受理は W_bg′ = 0 だけ
- **解説**: 分母はトータルの慣性決定力 —— 受け手自身の有限の球の場(自分の dragCore の半径で —— m/0² にしない)と他の全部の源。自己の場は分母にだけ入り、分子へ自分の並進を重ねない。背景 W_bg′(`invSq.Wbg2`)は受理で 0 だけ(背景を分母に入れると二重計上 —— 原仮定者の裁定(第107報))。自己の場は単位の球の表(K1 は SK1・SD1)を 1 回だけ作り、m_d SK1/R_d で使う。第三体は W を通じて β を変える(新則の仕様)。
- **プログラム版 1**(`beta/index.html` · `inertialDragIsqRuleK1`)

```js
for(let a=0;a<n;a++){ inertialDragIsqK1(rule.TA[a],1,B); SK1[a]=B[0]; SD1[a]=B[1]; }
```

- **プログラム版 2**(`beta/index.html` · `inertialDragIsqEvalK1`)

```js
w1=mdi*(SKt[a]/Ri); g1=mdi*(SDt[a]/R2);
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqPointRecvK1`)

```js
let W=Wbg2, gx=0, gy=0, gz=0;
for(let k=0;k<n;k++){
if(k===i){ sc.ok[k]=0; W+=w1; gx+=g1*ux; gy+=g1*uy; gz+=g1*uz; if(has2){ W+=w2; gx+=g2*ux; gy+=g2*uy; gz+=g2*uz; } continue; }
// …
const w=MD[k]*B[0], gr=MD[k]*B[1];
```

- **プログラム版 4**(`beta/index.html` · `inertialDragIsqNodeK1`)

```js
BE[row+j]+=wq*md*sc.K[j]*iW;
```

- **プログラム版 5**(`beta/index.html` · `REL_DRAG_INVSQ_VERSION`)

```js
REL_DRAG_INVSQ_VERSION="w310a-invsq-wbg0-1"
```

- **PHYSICS の節**: 〔第309便a〕(分母と比の平均)・〔第310便a〕(Wbg2 = 0 だけ・自己の場の前計算)

### EQ-13 新則の並進の連立(一度だけ解いて一度だけ動かす)

- **ラベル**: 実装〔opt-in〕
- **数式版**: u_i − Σ_j β_ij u_j = Σ_j β_ij (v_j − v_i) + c_i^rot(⇔ u_i = Σ_j β_ij (V_j − v_i) + c_i^rot・V_j = v_j + u_j)、 x_i ← x_i + u_i h(v は EQ-27 のキックで先に進む)
- **解説**: 各源の全速度が別の源へ伝わる連鎖を同時に解く(行の対角は 1 —— 新則は旧則の 1 + c Σw を使わない: 作りの関数が `DG` を 0 のまま渡す)。行和 Σ_j β_ij < 1 の行だけ解に入れる(非有限・Σβ ≥ 1 の行は 0 にして数える)。固定の天体・質量が正でない受け手は u = 0。解いた u を位置へ 1 回だけ足す(もう一度足さない)。既定の v の意味は慣性の速度(`solveFrom:"velocity"`)。連鎖があることと平坦な回転は別の事柄(連鎖だけから平坦な回転は出ない)。
- **プログラム版 1**(`beta/index.html` · `inertialDragIsqBuild`)

```js
for(let i=0;i<n;i++){ UX[i]=0; UY[i]=0; UZ[i]=0; DG[i]=0; for(let j=0;j<n;j++) A[i*n+j]=0; }
// …
A[row+j]=b; deg+=b;
if(hist){ ux+=b*(VX[j]-VX[i]); uy+=b*(VY[j]-VY[i]); uz+=b*(VZ[j]-VZ[i]); }
```

- **プログラム版 2**(`beta/index.html` · `dfmInertialDrag3Solve`)

```js
M[row+i]=FX[i]? 1 : 1+DG[i];
```

- **プログラム版 3**(`beta/index.html` · `dfmInertialDragStep3`)

```js
NX[i]=(ux!==0)? X[i]+ux*dt : X[i]; NY[i]=(uy!==0)? Y[i]+uy*dt : Y[i]; NZ[i]=(uz!==0)? Z[i]+uz*dt : Z[i];
```

- **PHYSICS の節**: 〔第309便a〕(並進)・〔第311便b〕(行の守り)

### EQ-14 R_d の規則(C₁・Y_k)

- **ラベル**: 実装〔opt-in〕
- **数式版**: C₁ = 6[(√3/2) ln(2 + √3) − 1] = 0.8431139667085…(= ⟨1/K1(t; 1)⟩ —— 単位の球の受け手の調和平均)、 Y_k = 10G₀/(C₁c₀²)、 R_d = Y_k m_d、 R_d/r_s = 5/C₁ = 5.930396…
- **解説**: K1 の本だけの規則の鍵 `invSq.rdRule:"kappaM"`。太陽を含む全天体の引きずりの半径を質量に比例させる(dragCore の半径を宣言しない天体)。Y_k は K1 の並進の近点の一次の式で、引きずりの分が二体の 1PN の式の値 q_1PN の 5/3 になる値(在位の G_loc n = 2 の分 −(2/3) q_1PN と足して q_1PN —— EQ-18)。R_d は重力半径に比例する長さで、天体の大きさではない(観測の半径を超える R_d も受理する)。在位の 7 本(🌡️🌋🔴🏀🟡🔷💙)と、K1 の規則のほかの本(連星・太陽系 16 体の写し)が宣言する。
- **プログラム版 1**(`beta/index.html` · `REL_DRAG_INVSQ_C1`)

```js
REL_DRAG_INVSQ_C1=6*((Math.sqrt(3)/2)*Math.log(2+Math.sqrt(3))-1);
```

- **プログラム版 2**(`beta/index.html` · `invSqKappa0`)

```js
return (10*G)/(REL_DRAG_INVSQ_C1*c*c);
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqCore`)

```js
else if(kap>0 && RA[j]>0){ const md=d? d.massFrac*mj : mj; RD[j]=kap*md; MD[j]=md; }
```

- **プログラム版 4**(`beta/index.html` · `inertialDragIsqRdRuleState`)

```js
rdOverRs:5/REL_DRAG_INVSQ_C1
```

- **PHYSICS の節**: 〔第312便a〕(C₁ と近点の一次の式)・〔第313便a〕(規則の鍵)・〔第315便c〕(在位の 7 本)

### EQ-15 回転引きずり(源のモーメント・R_src)

- **ラベル**: 実装〔opt-in〕
- **数式版**: u_rot,i = Σ_j Ω_j â_j × ⟨(m_d,j M_j(r)/W) n̂_j⟩_i(n̂_j は源から受け手の節点への向き・M は K1 で M1・K2 で M2)、 源のモーメントの半径の案 J: R_src = R_obs √(5f/2)(f は源の慣性係数)
- **解説**: `spinDrag.rot:"surfaceFlip"` を宣言した本だけ。源の球の内部の速度 Ω × ρ の近い側と遠い側の差のモーメントで、並進の u に足す。R_src(`invSq.sourceMoment`)は源のモーメントだけを置き換え、β・W・∇W の R_d は変えない。**在位の 7 本は回転の引きずりを宣言しない**(並進だけ)。原仮定者の整理の「回転は接線の速度 Ω × r に m/r²(遠くで 1/r)」とは別の演算子(K1 の遠方は 1/r²)—— EQ-28。 原仮定者の補足(2026-11-10)の「回転引きずり」(源の赤道面からの距離が R_d 以下の帯で強く働く手前と奥の差分 —— 宣言〔未接続〕・〔第332便a〕)とは形が違う(この項の核は R_d の球)。
- **プログラム版 1**(`beta/index.html` · `inertialDragIsqNodeK1`)

```js
if(RS) inertialDragIsqM1Src(sc.r[j],RS[j],B); else inertialDragIsqM1(sc.r[j],RD[j],B);
// …
const nx=sc.nx[j], ny=sc.ny[j], nz=sc.nz[j], g=md*B[2]*iW;
// …
const b=(row+j)*3; RV[b]+=wq*g*nx; RV[b+1]+=wq*g*ny; RV[b+2]+=wq*g*nz;
```

- **プログラム版 2**(`beta/index.html` · `inertialDragIsqBuild`)

```js
ux+=ay0*RV[c+2]-az0*RV[c+1]; uy+=az0*RV[c]-ax0*RV[c+2]; uz+=ax0*RV[c+1]-ay0*RV[c];
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqSrcRadiusOf`)

```js
if(kind===REL_DRAG_INVSQ_SRC_MOMENT_KINDS[0]) return (f>0)? Robs*Math.sqrt(2.5*f) : null;
```

- **PHYSICS の節**: 〔第309便a〕(回転)・〔第320便a〕(R_src)

### EQ-16 軸引きずり(受け手の近と遠の差分)

- **ラベル**: 実装〔opt-in〕
- **数式版**: ω_i = A Σ_j ⟨amp_ij sinθ_j Ω_j (2n̂(n̂·â_j) − â_j)⟩_i、 amp = −n̂·∇(m_d,j M_j/W)(∇W は自己を含む全項の勾配)、 sinθ_j = |â_j × n̂|、 A = `axialGain`(既定 1)
- **解説**: `spinDrag.axial:"on"` ∧ `axialModel:"bevel"` を宣言した本だけ。受け手の体積の近い側と遠い側の回転引きずりの符号つきの差分 —— 原仮定者の整理「軸引きずりは引きずられる側の引きずりの差分」と同じ型。ω は u に足さず、移送の後で受け手の姿勢(引きずり軸回転)へ当てる。向き(鏡映)は構成則・sinθ は仮定。**在位の 7 本は宣言しない**。
- **プログラム版 1**(`beta/index.html` · `inertialDragIsqNodeK1`)

```js
let amp=-(md*B[3]*iW-g*(sc.gx*nx+sc.gy*ny+sc.gz*nz)*iW);
// …
const f=wq*gain*amp*sn*Om, ox=f*(2*mu*nx-ax0), oy=f*(2*mu*ny-ay0), oz=f*(2*mu*nz-az0), b=(row+j)*4;
```

- **PHYSICS の節**: 〔第309便a〕(軸)・〔第301便c〕(軸回転 = 慣性軸回転 + 引きずり軸回転)

### EQ-17 銀河の一様軸引きずり

- **ラベル**: 実装〔opt-in〕
- **数式版**: ω_G,i = ω_G (R_d,i/R_ref)^q(q = rdPow ∈ {0, 1, 2})、 massPow −1 の宣言は ω_G,i = ω_G (R_d,i/R_ref)(m_ref/m_i)
- **解説**: `relativeDrag.galaxyAxial`(新則の本だけ)。受け手の軸の ω に同じ ω_G を足す 1 つの源 —— 位置に依らない(同じ R_d と質量なら同じ応答)。β・右辺・分母は触らない。R_d = Y_k m の本で massPow −1 と rdPow 1 を組むと因子は天体に依らない。値は宣言のノブで、銀河の場から決めた値ではない。
- **プログラム版 1**(`beta/index.html` · `galaxyAxialRdFactor`)

```js
const x=Rd/Rr; return (q===1)? x : x*x;
```

- **プログラム版 2**(`beta/index.html` · `galaxyAxialRdmFactor`)

```js
const x=Rd/Rr; return x*(Mr/m);
```

- **プログラム版 3**(`beta/index.html` · `inertialDragIsqRowGuard`)

```js
WX[i]+=gx; WY[i]+=gy; WZ[i]+=gz;
```

- **PHYSICS の節**: 〔第311便b〕・〔第312便b〕(rdPow)・〔第313便b〕(massPow)

### EQ-18 局所重力 G_loc と近点の一次の式

- **ラベル**: 実装〔opt-in〕
- **数式版**: ψ_i = X_g Σ_{j≠i} m_j/√(d_ij² + ε²)(X_g = G₀/c₀²〔kappa:"lock"〕か X_k〔"kappaT"〕—— D₀ を含めない)、 受け手の型 G_i = G₀ e^{−2nψ_i}・δa_i = −Σ_j (G_i − G₀) m_j (r_i − r_j)/(d_ij² + ε²)^{3/2}(対称の型は G_ij = G₀ e^{−n(ψ_i+ψ_j)})。 弱場・固定中心・一次の近点: Δϖ_Gloc ≈ −2nπμ/[c₀²a(1 − e²)](1 公転)
- **解説**: `physics.gLoc`(三次元の本だけ・較正の本では拒否)。「G_loc を掛けた力」の宣言で、−G_loc m/r を微分した力ではない(後者は G_loc の勾配の項が増える別の模型)。受け手の型は対の反作用が閉じないので、力積と仕事を帳簿に積む。**n > 0 は近点を逆行させる**(n = 0 で 0)—— 二体の 1PN の式の値 q_1PN = 6πμ/[c₀²a(1 − e²)] との一次の比は −n/3。
  - **宣言(原仮定者の整理と補足(2026-11-09))**: 水星の近点移動は G_loc を採用。在位の水星の本の G_loc と K1 の引きずりの和が 1PN の値になる組を活かす(太陽–水星の G_loc と回転引きずりの組み合わせを調べる)。
  - **実装(今の在位の組 —— 正本 `tests/out/inposk1-w315c.json` の K.systems.mercury・刻み h/2)**: q00(引きずりなし・G_loc なし)・q10(G_loc だけ)・q11(本そのもの —— K1 の引きずり + G_loc n = 2)で、**G_loc の分 q10 − q00 = −28.65″/世紀**(逆行 —— 一次の比 −2/3 = −n/3)・**K1 の引きずりの分 q11 − q10 = +71.63″/世紀**(一次の比 +5/3)・**和 q11 − q00 = 42.98″/世紀**(q_1PN = 42.98051″/世紀との差 2.6×10⁻⁵″/世紀)。
  - **組の読み**: 一次の式では −(2/3) q_1PN + (5/3) q_1PN = q_1PN。Y_k = 10G₀/(C₁c₀²) は K1 の引きずりの分がちょうど 5/3 になる規則の値(EQ-14)で、規則で置いた R_d の宣言の下で二つの項の和が一次の値 q_1PN になる組(走行の値は正本の残差の内 —— この組から 1PN を導いたとは書かない)。K1 の引きずりの分の読み(〔第331便c〕): 太陽の枠に対する相対の並進の引きずり(接線の分と動径の分に分かれる)—— 源の枠を順回転で回す回転引きずりの型はどれも逆行の向きで、今のエンジンの spinDrag は軌道の状態を動かさない。
  - **比べる注記**: G_loc だけで一次の比 −n/3 が 1 になるのは n = −3(G_i = G₀ e^{+6ψ_i})—— 今の組とは別の型で、比べるための値。本便は n も符号も変えない。
- **プログラム版 1**(`beta/index.html` · `gLocKappaOf`)

```js
if(g.kappa==="kappaT") return (p.kappaT>0)? p.kappaT : 0;
return (p.cLight>0)? p.G/(p.cLight*p.cLight) : 0;
```

- **プログラム版 2**(`beta/index.html` · `gLocKick3`)

```js
PS[i]+=m[j]*invW; PS[j]+=m[i]*invW;
// …
const dGi=sym? 0 : G*Math.expm1(-2*nn*PS[i]);
// …
if(sym){ gi=G*Math.expm1(-nn*(PS[i]+PS[j])); gj=gi; const r=Math.abs(gi/G); if(r>dgMax) dgMax=r; }
else { gi=dGi; gj=G*Math.expm1(-2*nn*PS[j]); }
const fi=gi*invd3*m[j], fj=gj*invd3*m[i];
DX[i]-=fi*dx; DY[i]-=fi*dy; DZ[i]-=fi*dz;
```

- **プログラム版 3**(`beta/index.html` · `gLocPeriAdvance`)

```js
return -2*n*Math.PI*muEff/(c0*c0*a*(1-e*e));
```

- **PHYSICS の節**: 〔第302便b〕(G_loc)・〔第315便c〕(在位の 7 本の継ぎ目の表)

### EQ-19 明示潮汐の力・トルク・熱

- **ラベル**: 実装〔opt-in〕
- **数式版**: r = x_j − x_i、 B = G₀ k₂,i m_j² R_i⁵、 F_cons = −3B r/r⁸、 s = V − Ω_i â_i × r、 F_diss = −(3B Δt_lag/r¹⁰){2r(r·V) + r² s}、 τ_i = −r × F_diss、 Q_ij = (3B Δt_lag/r¹⁰){2(r·V)² + r²|s|²} ≥ 0(F は起潮天体 j へ・i へ反作用)
- **解説**: `physics.tide`(定時間遅延のベクトル形)。V は慣性の速度の差か、宣言で ẋ の差(引きずりとの混合の仕事を帳簿に)。Δt_lag は遅延の時間で積分の刻みとは別。k₂・Δt_lag・慣性係数は受け手ごと。慣性由来の引きずりとは別の経路(原仮定者の決断 AN587 —— 二重にならない想定)。長期の共鳴による潮汐ロックを、この瞬時の滑りの式から導いたとは書かない。**在位の本は宣言しない**(器と QA の写しが使う)。
- **プログラム版 1**(`beta/index.html` · `tideEvalRates3`)

```js
const B=G*k2*mj*mj*R5, r4=r2*r2, r6=r4*r2, r8=r4*r4;
const cc=3*B/r8;
let fx=-cc*rx, fy=-cc*ry, fz=-cc*rz;
// …
const d=3*B*lag/(r8*r2), rv=rx*Vx+ry*Vy+rz*Vz;
const sx=Vx-Om*(ay*rz-az*ry), sy=Vy-Om*(az*rx-ax*rz), sz=Vz-Om*(ax*ry-ay*rx);
// …
const dx=-d*(2*rx*rv+r2*sx), dy=-d*(2*ry*rv+r2*sy), dz=-d*(2*rz*rv+r2*sz);
// …
const hq=d*(2*rv*rv+r2*(sx*sx+sy*sy+sz*sz));
```

- **PHYSICS の節**: 〔第307便b〕

### EQ-20 内部熱の蓄積と放射

- **ラベル**: 実装〔opt-in〕
- **数式版**: dE/dt = H − E/τ、 x = h/τ、 E′ = E e^{−x} + Hτ(1 − e^{−x})、 放射 = E(1 − e^{−x}) + Hτ(x − (1 − e^{−x}))(E′ + 放射 = E + H h)
- **解説**: 一定の発熱率 H の区間 h を解析的に積分する純関数(`physics.tide.heat` の本)。x が小さいときは級数で桁落ちを避ける。E は過剰の内部エネルギー(初期値 0 は診断の基準)で、観測の温度 K ではない。収支が閉じることと観測の熱流に合うことは別の欄。
- **プログラム版 1**(`beta/index.html` · `tideHeatCell`)

```js
const x=h/tau, loss=-Math.expm1(-x);
const g=(x<TIDE_HEAT_SERIES_X)? x*x*(0.5-x*(1/6-x/24)) : x-loss;
return [E-E*loss+H*tau*loss, E*loss+H*tau*g];
```

- **PHYSICS の節**: 〔第307便b〕(内部熱)

### EQ-21 軸と速さの保持の帳簿

- **ラベル**: 実装〔opt-in〕
- **数式版**: ω_D を慣性自転の向き â_I に平行な p と垂直な q に分け、w = |Ω_I|・c∥ = w + p・s = |c∥ â_I + q|。 E_axis = ½I{(s − c∥)² + |q|²}、 E_speed = I{wp + ½(p² + |q|²)}、 熱 = E_axis + max(E_speed, 0)(読み (b) の宣言は E_axis + |E_speed|)
- **解説**: `spinDrag.axisHold:{mode:"maintain"}`(軸を遠方宇宙に対して保つ型)の 1 回の保持の量。s − c∥ は有理化で小さい角の桁落ちを避ける。熱の率への換算は宣言(1 步ごと・Δt/τ_hold)。源を合成してから二乗するか源ごとかも宣言(`compose:"source"`)。EQ-22 の受動の口の Γ の則と同じ式ではない。
- **プログラム版 1**(`beta/index.html` · `inertialDrag3MaintCell`)

```js
const cp=w+p, s=Math.sqrt(cp*cp+q2);
// …
const dpar=(cp>0)? q2/(s+cp) : s-cp;
// …
const Eax=0.5*I*(dpar*dpar+q2), d2=p*p+q2, Esp=I*(w*p+0.5*d2);
// …
out[o]=Eax; out[o+1]=Esp; out[o+2]=Eax+((Esp>0)? Esp : 0);
```

- **PHYSICS の節**: 〔第308便b〕・〔第319便a〕(源ごとの維持)・〔第320便a〕(読み (b))

### EQ-22 由来ごとの口と熱(port)

- **ラベル**: 診断
- **数式版**: N_α = Γ_α(ν_α − Ω)、 Q_α = Γ_α |ν_α − Ω|² ≥ 0、 P_src,α = N_α·ν_α = N_α·Ω + Q_α(Γ_α ≥ 0)
- **解説**: 軸引きずり・潮汐などの由来(口)ごとに目標の角速度 ν と応答 Γ を置く受動の模型(tests の lib —— アプリの步に無い)。熱は口ごとに数える —— 逆向きの口でも打ち消さない(合トルクが 0 でも熱は残る)。供給を二度数えない。Γ は宣言の模型のノブで、熱の大きさを観測の熱流へ寄せない。帳簿が閉じること・観測の自転で定常なこと・観測の熱流と比べることは別の欄(第330便a の帳簿)。
- **プログラム版 1**(`tests/lib-w326d-axialheat.mjs` · `port`)

```js
const slip = sub(nu, Omega), torque = scale(slip, Gamma), heat = Gamma * dot(slip, slip), supply = dot(torque, nu), recvWork = dot(torque, Omega);
```

- **PHYSICS の節**: 〔第326便d〕・〔第330便a〕(由来ごとの帳簿)

### EQ-23 ジャイロ

- **ラベル**: 診断
- **数式版**: dL/dt = N、 N⊥ = N − L̂(L̂·N)、 Ω_prec = L × N/|L|²( = L × N⊥/|L|² —— Ω_prec × L = N⊥)
- **解説**: 原仮定者の整理(2026-11-08)「ジャイロ効果も DFM の範囲」の診断の純関数。実トルクはそのまま —— 90° 回した別のトルクを足さない。L = 0 なら歳差は決まらない(null)。保存の歳差は熱に数えない。窓の角は表で、無視してよいかの判定ではない。
- **プログラム版 1**(`tests/lib-w330b-dragweight.mjs` · `gyroResponse`)

```js
const par = I.scale(L, I.dot(L, N) / L2), perp = I.sub(N, par);
return { dL: N.slice(), precession: I.scale(I.cross(L, N), 1 / L2), perpendicularTorque: perp, parallelTorque: par, why: null };
```

- **PHYSICS の節**: 〔第330便b〕(ジャイロ)

### EQ-24 測地の歳差と 1PN の近点(文献の式)

- **ラベル**: 診断
- **数式版**: Ω_geo = (3/2) n_orb GM/[c²a(1 − e²)](自転のベクトルの測地の歳差)、 ϖ̇_1PN = 3 n_orb GM/[c²a(1 − e²)] = 2Ω_geo(軌道の近点)
- **解説**: 比べる基準の文献の式(DFM から導いた則ではない)。自転軸の輸送と軌道の近点は別の量 —— 二重に入れない。水星の 1PN の近点 42.98″/世紀はこの式の値で、G_loc だけの値ではない(EQ-18)。
- **プログラム版 1**(`tests/lib-w330a-spinclass.mjs` · `geodeticRate`)

```js
return 1.5 * Math.abs(n) * GM / (c * c * a * (1 - e * e));
```

- **プログラム版 2**(`tests/lib-w330a-spinclass.mjs` · `periRate1PN`)

```js
return 2 * geodeticRate({ GM, a, e, n, c });
```

- **PHYSICS の節**: 〔第330便a〕(測地の歳差の窓)・§5 E12

### EQ-25 密度波のラベル(κ_epi)

- **ラベル**: 診断
- **数式版**: Ω = v/R、 A_O = (v/R − v′)/2、 B_O = −(v/R + v′)/2、 κ_epi² = −4ΩB_O( = R dΩ²/dR + 4Ω²)、 共回転 Ω = Ω_p、 m(Ω − Ω_p) = ±κ_epi(m = 2 —— 内側と外側のリンドブラッド共鳴)
- **解説**: 既存の銀河力学のラベルを回転の表へ写す診断。κ_epi(周転円の振動数)は κ_D(決定力定数)と別の量。物質の Ω(R)・腕のパターンの Ω_p(一定の宣言 —— 出典つき)・DFM の場の角速度を分ける。Ω_p を全半径で Ω − κ_epi/2 にしない。NGC 3198 の Ω_p は格子の宣言で、文献で決まった値ではない。棒渦巻の棒は未解決。κ_epi² < 0 の点は 0 で埋めず null。
- **プログラム版 1**(`tests/lib-w329b-galrot.mjs` · `labelsOf`)

```js
const Om = v / R, A = 0.5 * (v / R - dv), B = -0.5 * (v / R + dv), k2 = -4 * Om * B, k = k2 >= 0 ? Math.sqrt(k2) : null;
```

- **プログラム版 2**(`tests/lib-w330b-dragweight.mjs` · `densityWaveLabel`)

```js
if (decl.m !== DECL.armM) throw new RangeError('densityWaveLabel: m = 2(2 本腕)だけ');
```

- **PHYSICS の節**: 〔第329便b〕(ラベル)・〔第330便b〕(密度波)

### EQ-26 場の API(Φ と A)

- **ラベル**: 実装〔読み口〕
- **数式版**: Φ = Σ_j m_j/√(d_j² + ε²)、 ∇Φ = −Σ_j m_j (x − x_j)/(d_j² + ε²)^{3/2}、 A_p = Σ_j m_j (d_j² + ε²)^{−p/2} v_j(**規格化しない分子**)、 [Φ] = M/L・[A_p] = M L^{1−p} T^{−1}
- **解説**: スカラーの場 Φ と速度で作るベクトル A を別に返す純関数(状態を読まない・書かない)。A は引きずりの速度 u そのものではない(分母で割る前の分子)。p を変えると A の次元が変わるので、p を並べるときは無次元化する。コーシー–リーマンは課さず残差だけ返す。この API の空間と時間の微分は、場の動力学の方程式が成り立つことを意味しない。
- **プログラム版 1**(`beta/index.html` · `dfmComplexDeterminacy`)

```js
const iv=1/Math.sqrt(s), iv3=iv*iv*iv;
Phi+=mi*iv; gPx-=mi*dx*iv3; gPy-=mi*dy*iv3;
// …
const wA=(pw===0)? 1 : Math.pow(s,-pw/2);
// …
Ax+=mi*wA*vix; Ay+=mi*wA*viy;
```

- **PHYSICS の節**: 〔第259便a〕(複素決定力場・共通場 API)

### EQ-27 積分と適用の順序

- **ラベル**: 実装〔既定〕
- **数式版**: semi: v ← v + a h、 x ← x + v h。 leapfrog(KDK): v ← v + a h/2 → x ← x + v h → v ← v + a h/2。 慣性決定力(既定 `stepOrder:"semic"`): v ← v + h a(x₀) → u を x₀ と新しい v で解く → x ← x₀ + h(v + u)。 安全の上限 |v| ≤ 100・|s| ≤ 40(本の単位)
- **解説**: 二次元の核 `S._core` は mode 0(semi —— キック dt)・mode 1/2(leapfrog の前半と後半 —— キック dt/2)。三次元の 1 步 `dfmStep3` の順: 潮汐の前半(`split:"half"` の本)→ semic の位置の写し → 核(`dfmCore3`〔重力 → G_loc → J₂ → キック → ドリフト〕か geoPN=2 の `dfmCore3G2`)→ 参照の模型 → 慣性決定力の步(EQ-10〜17 —— 移送 x += u h の後で軸の ω を姿勢へ)→ 潮汐 → 規定の歳差。上限を超えた回数は帳簿(clampVN・clampSN)に数える。式が同じでも、刻み h/2・座標平面の写し・仕事と運動量の残差は別に見る。
- **プログラム版 1**(`beta/index.html` · `dfmCore3`)

```js
const kickDt=(mode!==0)? dt*0.5 : dt;
// …
} else { vx[i]+=ax[i]*kickDt; vy[i]+=ay[i]*kickDt; vz[i]+=az[i]*kickDt; }
// …
if(vv2>10000){ const sc=100/Math.sqrt(vv2); vx[i]*=sc; vy[i]*=sc; vz[i]*=sc; S.clampVN++; }
if(spin[i]>40){ spin[i]=40; S.clampSN++; } else if(spin[i]<-40){ spin[i]=-40; S.clampSN++; }
if(doDrift){ x[i]+=vx[i]*dt; y[i]+=vy[i]*dt; z[i]+=vz[i]*dt; }
```

- **プログラム版 2**(`beta/index.html` · `dfmStep3`)

```js
if(S.integrator==="leapfrog"){ if(g3){ dfmCore3G2(S,dt,1); dfmCore3G2(S,dt,2); } else { if(pn1) dfmPN1EIHKick3(S,dt*0.5); dfmCore3(S,dt,1,pn1); if(pn1) dfmPN1EIHKick3(S,dt*0.5); dfmCore3(S,dt,2,pn1); } }
// …
if(S.hasRelativeDrag) dfmInertialDragStep3(S,dt);
// …
if(S.hasTide) dfmTideStep3(S,(S.tide.split==="half")? dt*0.5 : dt);
// …
if(S.hasSpinAx3) coord3dSpinAxisStep(S);
```

- **PHYSICS の節**: §5 数値スキーム・〔第302便d〕の semic(コードの注記 `REL_DRAG_STEP_ORDERS`)

### EQ-28 座標変換の引きずり(並進 + 回転・m/r²・自転の目標)

- **ラベル**: 宣言〔未接続〕
- **数式版**(原仮定者の整理(2026-11-08・2026-11-09)と決断 AN586 の読み): w_ij = m_j/r_ij²(自己 w_ii は有限の半径の宣言)、 W_i = w_ii + Σ_{j≠i} w_ij、 β_ij = w_ij/W_i、 d_i = Σ_j β_ij {(v_j − v_i) + Ω_j â_j × (x_i − x_j)}、 U_i = v_i + d_i、 自転の目標 ν_i = (w_ii Ω_i + Σ_j w_ij Ω_j)/W_i
- **解説**: 原仮定者の決断(2026-11-09 —— AN586)「並進引きずりと回転引きずりは一緒に処理してよい座標変換で m/r² の重み —— 先に検証」の型。**エンジンに入っていない**(在位の本・受理器・エンジンの書き換えは検証の後の決断事項)。今の在位の 7 本(EQ-12・13)は分母・自己・連鎖の構造は同じ型だが、並進の遠方の重みは m/r(K1)で、回転の項は源のモーメント(EQ-15)。回転の座標変換の分子 m(Ω × r)/r² は遠くで 1/r、自転の目標の分子 m Ω/r² は 1/r²。「引きずりの重みと重力加速度が比例」も宣言(EQ-02)。d は速度で、加速度ではない。今の部分の型は tests の lib(第330便b)にある —— 並進(`weightedMotion`)・回転の接線の速度(`frameRotationTerm`)・自転の目標(`spinTarget`)。並進と回転を 1 つにした純関数は同じ便の別の枝の診断(統合の後に本項へ抜粋を足す)。 原仮定者の補足(2026-11-10)で、この座標変換の回転は半径を見ないので「並進引きずり」に統合する(geoPN = 2 との比べと重み m/r の型は〔第332便b〕)。
- **プログラム版 1**(`tests/lib-w330b-dragweight.mjs` · `pointWeight`)

```js
const w = m / Math.pow(r, p);
```

- **プログラム版 2**(`tests/lib-w330b-dragweight.mjs` · `weightedMotion`)

```js
const W = selfW + sources.reduce((a, s) => a + s.weight, 0);
// …
const beta = sources.map((s) => s.weight / W), alpha = selfW / W;
const d = sources.reduce((a, s, j) => vadd(a, vscl(vsub(s.velocity, v), beta[j])), vzero(v.length));
```

- **プログラム版 3**(`tests/lib-w330b-dragweight.mjs` · `frameRotationTerm`)

```js
const a = I.unit(axis), d = I.sub(recv, src), r = I.norm(d), vt = I.scale(I.cross(a, d), Omega), w = pointWeight(m, r, p);
```

- **プログラム版 4**(`tests/lib-w330b-dragweight.mjs` · `spinTarget`)

```js
const q = weightedMotion(Omega, selfW, (sources || []).map((s) => ({ weight: s.weight, velocity: s.omega })));
```

- **PHYSICS の節**: 〔第330便b〕(重みの式と今のエンジンの経路の成分ごとの対応)

## 5. 名前だけの式(拾わない項と理由)

| 式 | 理由 | 正本 |
|---|---|---|
| E5′ スピン斥力(と tint の E5′改) | 自転と引きずりの主列ではない(在位の天体の本は kRep = 0) | PHYSICS §5 E5′・thermal:"tint" |
| E9 接触(法線のばね・減衰・接線の摩擦)と tint の E9′ | 衝突と熱の玩具の式(三次元の核は法線だけ) | PHYSICS §5 E9 |
| E10′ スピン拡散(と tint の E10′改) | 自転の平衡化の式(係数 S_k —— 在位の天体の本は 0) | PHYSICS §5 E10′ |
| E11 放射冷却(と tint の E11改) | 既定の η_rad = 0(オフ) | PHYSICS §5 E11 |
| E13 帯状重力(J₂) | 現実較正のデモの補正(三次元は `j2Kick3`) | PHYSICS §5 E13 |
| E14″ 創発相変化 | 相変化の玩具(結合と凝縮) | PHYSICS §5 E14″ |
| 箱宇宙の背景 W_B・u_B | 宇宙の箱の実験(E1′・E3・E7R の分母に足す) | BOX_UNIVERSE |
| geoPN=3・旧 spaceMesh(mesh-v2) | トイの限定の枝 —— 銀河の完成した則でも、EQ-28 の座標則でもない | PHYSICS〔第259便a〕ほか |
| 旧則の opt-in(I2・殻・対ごとの正規化・構造核の表) | 旧則の本だけの分岐(EQ-10 の分母の変種) | PHYSICS〔第303便b〕〔第304便a〕〔第305便a〕 |
| 光学の輸送・減光(obsT・lightSweep) | 表示と観測の模型(力学に入らない) | PHYSICS §5 の光学の節 |
| 解析のハロー | 公理ではない比べる模型 | PHYSICS §6 の各本 |

## 6. PHYSICS §5 の E の一覧との対応

| E の名 | 本書の項 | 拾わない理由 |
|---|---|---|
| E1′ | EQ-01 | — |
| E2 | EQ-06 | — |
| E3 | EQ-06 | — |
| E4 | EQ-02 | — |
| E5′ | — | §5 の表(自転と引きずりの主列ではない) |
| E6′ | EQ-07 | — |
| E6′-R | EQ-07 | — |
| E7R | EQ-04 | — |
| E8R | EQ-05 | — |
| E9 | — | §5 の表(衝突と熱の玩具の式) |
| E10′ | — | §5 の表(自転の平衡化の式) |
| E11 | — | §5 の表(既定でオフ) |
| E12 | EQ-09 | — |
| E9′ | — | §5 の表(tint の読み替え) |
| E5′改 | — | §5 の表(tint の読み替え) |
| E10′改 | — | §5 の表(tint の読み替え) |
| E11改 | — | §5 の表(tint の読み替え) |
| E14″ | — | §5 の表(相変化の玩具) |
| E13 | — | §5 の表(現実較正のデモの補正) |

PHYSICS §5 の後の便の節で足した式(新則 invSq・R_d の規則・G_loc・潮汐・熱・ジャイロ・密度波)は EQ-10〜EQ-25 が拾う。

## 7. 文書の維持の規則

1. **エンジンや lib の式を変える便**は、`lint.equations331d` を部分 QA に入れる。落ちたら、名を出された項(EQ-NN)・抜粋(k)・断片(m)・ファイル・関数を見て、本書の抜粋と数式版を今のコードに合わせて直す(抜粋は短く —— 要の行だけ)。式の意味が変わったときは解説とラベルも直す。
2. 関数の名を変えた・関数を移したときは、抜粋の見出しの名を直す(QA は名指しの関数の本体の中だけを探す)。
3. 新しい式を本に入れた便は、項を足すか §5 に理由を書く。PHYSICS §5 に E の名を足したら §6 の表に行を足す(`docs.equations331d` が拾い漏れを数える)。
4. 宣言〔未接続〕の項がエンジンに入ったら、ラベルを `実装〔opt-in〕` に変え、エンジンの抜粋に差し替える(宣言と実装を同じ項の中で混ぜない)。
5. G_loc と K1 の近点の数(EQ-18)は正本 `tests/out/inposk1-w315c.json` から QA が読み直す —— 正本を作り直す便で数が動いたら本書の値も直す。
