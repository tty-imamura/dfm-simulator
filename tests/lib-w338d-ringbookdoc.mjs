// 第338便d(原仮定者の回答(2026-11-15 —— 第138報の回答 4)AN742・統括の検証項目 R352): **正本 tests/out/ringbook-338d.json から PHYSICS〔第338便d〕の表を作る文書の lib**
// (QA docs.ringbook338d が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・0 と書いた欄は「0」・丸めの程度の差は正本に真偽で書いてある)。
export const DOC_VERSION = 'w338d-ringbookdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const NM = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環', phobos: 'フォボス', moon: '月', titan: 'タイタン', triton: 'トリトン(逆行)',
  saturn: '土星', jupiter: '木星', uranus: '天王星', neptune: '海王星', mars: '火星', earth: '地球', jupiterMain: '木星の主環(参考)', uranusEps: '天王星の ε 環(参考)' });
const TY = Object.freeze({ band: '帯の幅 2 R_eq(第337便j)', zeq: '場と重力の鉛直の速さが等しい高さ 2 z*(第337便j)', rateOnly: '率が半径に依らない型(第337便i —— 率だけ)',
  'drag|yard': '鉛直の減衰と乱しの釣り合い(Γ_d = 1/1e7 年)', 'drag|k4half': '鉛直の減衰と乱しの釣り合い(Γ_d = 4 天体の強さの組 χ ½)', 'drag|focus337i': '鉛直の減衰と乱しの釣り合い(Γ_d = 第337便i の鉛直へ寄せる場)',
  'floor|1': '粒子の大きさの床 k_d 1(対照 —— 回転引きずりなし)', 'floor|2.5': '粒子の大きさの床 k_d 2.5(対照 —— 回転引きずりなし)', grav: '自己重力の床 Q_T 2(対照 —— 回転引きずりなし)' });
const NEED = Object.freeze({ band: 'R_d の読み(扁平の則の次数)', zeq: 'β・A・ℓ(第337便j の宣言)', rateOnly: '乱し σ_z(宣言が要る —— 率だけでは厚みは決まらない)', 'drag|yard': '乱しの率 P(B 環の中心で 10 m に置いた)',
  'drag|k4half': '乱しの率 P(同)', 'drag|focus337i': '乱しの率 P(同)', 'floor|1': '粒子の直径 d_p・k_d', 'floor|2.5': '粒子の直径 d_p・k_d', grav: '面密度 Σ・Q_T・σ_z/σ_r' });
const CASE = Object.freeze({ nuOnly: '粘性だけ(対照 —— 引きずり 0・ν 1e-2)', dragOnlyHalf: '引きずりだけ(対照 —— χ ½・ν 0)', dragOnlyOne: '引きずりだけ(対照 —— χ 1・ν 0)', epsHalf: '集まりの係数で弱めた組(χ ½・ν 1e-2)',
  epsOne: '集まりの係数で弱めた組(χ 1・ν 1e-2)', epsHalfNu0: '集まりの係数で弱めた組(χ ½・ν 0)' });
const caseName = (k) => CASE[k] || (k.startsWith('k4Half') ? '4 天体の強さの組(χ ½・ν ' + k.split('nu')[1] + ')' : '4 天体の強さの組(χ 1・ν ' + k.split('nu')[1] + ')');

export function tablesOf(J) {
  const T = {}, P = J.pure, S = P.scenes;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 環の半長軸の率: 本枝の速い式(exp と log)と第337便j の \`t2Closed\` の差 ≤ 1e-12・数の \`ringRow\`(高さの振れ 10 m の受け手)との差 ≤ 1e-3(環の中心 5 × χ 2) | ${tf(S.fast.closedBelow1e12)}・${tf(S.fast.numericBelow1e3)} | ${tf(P.gates.fast)} |`,
    `| ② 輪の列の帳簿: 粘性だけで角運動量とエネルギーが閉じる・熱 > 0・外のトルク 0・外のトルクと粘性で閉じる・輪の順の入れ替わり 0 | ${[S.ledger.amClosedVisc, S.ledger.enClosedVisc, S.ledger.heatPos, S.ledger.extZero, S.ledger.amClosedExt, S.ledger.enClosedExt].map(tf).join('・')}・${S.ledger.cross} | ${tf(P.gates.ledger)} |`,
    `| ③ 線形の帳簿: 乱しの率 P を 4 倍で厚み 2 倍(斉次 —— Γ_d だけでは決まらない)・加熱が σ_z² に比例し P = 0 で 2Γ_d = A なら σ_z が自由・2Γ_d < A なら釣り合い無し | ${tf(S.linear.homogBelow1e12)}・${tf(S.linear.free)}・${tf(S.linear.noBal)} | ${tf(P.gates.linear)} |`,
    `| ④ 潮汐の単位(\`ctlPair\` を呼ぶ)と閉じた式 3 n (m/M)(R/a)⁵ の差 ≤ 1e-12(フォボス・トリトン) | ${tf(S.tide.below1e12)} | ${tf(P.gates.tide)} |`,
    `| ⑤ T1 の捩れの型は F·v = 0(半長軸を動かさない)・λ = 0 で 0 | ${tf(S.twist.powerBelow1e12)}・${S.twist.zero} | ${tf(P.gates.twist)} |`,
    `| ⑥ 入力の拒否 4 例 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(P.gates.rejects)} |`].join('\n');
  T.sets = ['| 組(第337便k の連続の解を作り直した) | χ | q | p | λ | S | 観測 ÷ 計算(フォボス・月・タイタン・トリトン) | 集まりの係数 ε |', '|---|---|---|---|---|---|---|---|',
    ...['half', 'one'].map((k) => { const s = J.sets[k]; return `| ${k === 'half' ? '主(χ ½)' : '主(χ 1)'} | ${s.chi} | ${f3(s.q)} | ${f3(s.p)} | ${fe(s.lambda)} | ${f2(s.S)} | ${['phobos', 'moon', 'titan', 'triton'].map((b) => f3(s.obsOverCalc[b])).join('・')} | ${fe(s.eps)} |`; })].join('\n');
  const t1 = J.t1, rc = ['ringD', 'ringC', 'ringB', 'ringA', 'ringF'];
  T.t1Types = ['| 厚みの型 | 全厚 H [m](D・C・B・A・F 環の中心) | H ÷ 10 m(同) | 局所のべき d ln H/d ln r の最小・最大 | 一様の区間の幅(べきの絶対値 ≤ 0.1・D〜F に対する割合)・定義のある幅 | 要るノブ |', '|---|---|---|---|---|---|',
    ...t1.types.map((t) => `| ${TY[t.type]} | ${rc.map((k) => fe(t.at[k])).join('・')} | ${rc.map((k) => f2(t.ratio10[k])).join('・')} | ${f3(t.powMin)}・${f3(t.powMax)} | ${f3(t.width)}・${f3(t.covered)} | ${NEED[t.type]} |`)].join('\n');
  T.t1P = ['| 環 | n [1/s] | τ | 衝突の加熱の尺度 P_coll [m²/s³] | Γ_d(1/1e7 年・4 天体 χ ½・第337便i)[1/s] | 10 m に要る P ÷ P_coll(同) | 釣り合いに Γ_d を足したときの厚みの相対の変化 Γ_d/(k_c n τ)(同) |', '|---|---|---|---|---|---|---|',
    ...t1.pTab.map((r) => `| ${NM[r.key]} | ${fe(r.n)} | ${fe(r.tau)} | ${fe(r.pColl)} | ${['yard', 'k4half', 'focus337i'].map((k) => fe(r['gam|' + k])).join('・')} | ${['yard', 'k4half', 'focus337i'].map((k) => fe(r['ratio|' + k])).join('・')} | ${['yard', 'k4half', 'focus337i'].map((k) => fe(r['dHrel|' + k])).join('・')} |`)].join('\n');
  T.t1Ref = ['| 環(参考の列 —— 物差しにしない) | 公転 ÷ 源の自転 | 帯の幅 2 R_eq [m] | 等しい高さ 2 z* [m] | 粒子の大きさの床 k_d 1 [m] | 自己重力の床 [m] | 文献の厚み [m](種類) |', '|---|---|---|---|---|---|---|',
    ...t1.ref.map((r) => `| ${NM[r.key]} | ${f3(r.nOverS)} | ${fe(r.band)} | ${fe(r.zeq)} | ${fe(r.floor)} | ${fe(r.grav)} | ${fe(r.litH)}(${r.litKind}) |`)].join('\n');
  const t2 = J.t2;
  T.t2Carry = ['| 組 | 同期の半径の内の輪のトルクの和 [N m] | 外の輪のトルクの和 [N m] | 向きが逆か | 内と外を運ぶのに要る粘性 ν [m²/s](同期の半径の Σ で) |', '|---|---|---|---|---|',
    ...t2.carry.map((c) => `| ${c.set === 'half' ? '主(χ ½)' : '主(χ 1)'} | ${fe(c.Tin)} | ${fe(c.Tout)} | ${tf(c.opposite)} | ${fe(c.nuNeed)} |`)].join('\n');
  const ck = (c, y) => c.checks.find((k) => k.tYr === y);
  T.t2Cases = ['| 例 | 正味のトルク ÷ L₀ [1/s] | 正味 ÷ 大きさの和 | 1e3 年: 残る質量・土星へ・外へ | 1e4 年: 残る質量・土星へ・外へ | 1e7 年: 残る質量・内縁 r/r₀・外縁 r/r₀・漂いの最大(Δ ln r の絶対値) | 1e7 年: 熱 ÷ E₀ の大きさ・外のトルクの仕事 ÷ E₀ の大きさ | 粘性だけの対照を引いた平均の漂い(1e7 年) | 傾きが e 分の 1 の時間の最大 [年]・1e7 年の内か | 帳簿の閉じ(角運動量・エネルギー) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...t2.cases.map((c) => { const a = ck(c, 1e3), b = ck(c, 1e4), z = ck(c, 1e7);
      return `| ${caseName(c.key)} | ${fe(c.netRate)} | ${fe(c.cancel)} | ${f3(a.M)}・${f3(a.Msat)}・${f3(a.Mout)} | ${f3(b.M)}・${f3(b.Msat)}・${f3(b.Mout)} | ${f3(z.M)}・${z.rIn === null ? '—' : f3(z.rIn)}・${z.rOutMain === null ? '—' : f3(z.rOutMain)}・${fe(z.dlnMax)} | ${fe(z.heat)}・${fe(z.Wext)} | ${fe(c.dlnMeanMinusCtl)} | ${fe(c.tiltMaxYr)}・${tf(c.tiltOk)} | ${tf(c.checks.every((k) => k.amClosed))}・${tf(c.checks.every((k) => k.enClosed))} |`; })].join('\n');
  const t3 = J.t3;
  T.t3Rows = ['| 天体 | 公転 ÷ 源の自転 | 観測 ȧ/a [1/s] | 潮汐の単位(k₂/Q = 1)[1/s] | 潮汐だけで観測になる k₂/Q | 記憶の k₂/Q | 残り(観測 − 潮汐) [1/s]・符号 | 候補 χ ½ [1/s] | 候補 ÷ 残り(χ ½・χ 1) | 候補が分を取ったときの潮汐の要る k₂/Q(χ ½・χ 1) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...t3.rows.map((r) => `| ${NM[r.key]} | ${f3(r.nOverS)} | ${fe(r.obs)} | ${fe(r.tideUnit)} | ${fe(r.kqNeed)} | ${fe(r.kqLit)} | ${fe(r.resLit)}・${sg(r.resLitSign)} | ${fe(r.cand.half)} | ${fe(r.candOverRes.half)}・${fe(r.candOverRes.one)} | ${fe(r.kqJoint.half)}・${fe(r.kqJoint.one)} |`)].join('\n');
  T.t3Combos = ['| 組 | 強さの倍 f | 潮汐の要る k₂/Q(フォボス・月・タイタン・トリトン) | 全部が 0 以上か |', '|---|---|---|---|',
    ...t3.combos.flatMap((c) => c.list.map((x, i) => `| ${c.setKey === 'half' ? '主(χ ½)' : '主(χ 1)'} | ${f3(x.f)}${i === c.list.length - 1 ? '(上限 —— ' + NM[c.limiting] + ' で決まる)' : ''} | ${['phobos', 'moon', 'titan', 'triton'].map((k) => fe(x.kq[k])).join('・')} | ${tf(x.allNonNeg)} |`))].join('\n');
  T.t4 = ['| 受け手 | 源 | 公転 ÷ 源の自転 | 候補の ȧ/a(χ ½・χ 1)[1/s] | 20 年の公転の向きの位置のずれ(χ ½・χ 1)[km] | 潮汐(記憶の k₂/Q)[1/s]・20 年のずれ [km] | χ ½ と χ 1 で符号が逆か | 見分けの候補か(≥ 1 km) | 観測 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => `| ${r.name} | ${NM[r.host]} | ${f3(r.nOverS)} | ${fe(r.pred.half.dlnA)}・${fe(r.pred.one.dlnA)} | ${fe(r.pred.half.driftKm)}・${fe(r.pred.one.driftKm)} | ${fe(r.tide)}・${fe(r.tideDriftKm)} | ${tf(r.opposite)} | ${tf(r.visible)} | 観測なし —— 予測だけ |`)].join('\n');
  const t5 = J.t5;
  T.t5Orth = ['| 受け手 | 源の赤道面に対する傾き [deg] | T1 の捩れ: 自分の傾きの率・交点の率・直交の傾きの率(単位の λ・c 1)[1/s]・赤道面へ | 第337便i の鉛直へ寄せる場: 自分の傾きの率・交点の率・直交の傾きの率(単位の λ)[1/s] |', '|---|---|---|---|',
    ...t5.rows.map((r) => `| ${NM[r.key]} | ${fe(r.iDeg)} | ${fe(r.twist.own)}・${fe(r.twist.node)}・${fe(r.twist.orth)}・${r.twist.toPlane > 0 ? '寄る' : r.twist.toPlane < 0 ? '離れる' : '0'} | ${fe(r.focus.own)}・${fe(r.focus.node)}・${fe(r.focus.orth)} |`),
    `| (要約)環 5 で 1e7 年に e 分の 1 に要る λ c | — | ${fe(t5.lamNeedTw)}(λ = 第337便i の 6.56e-7・c 1 なら ${fe(t5.efold337iTw)} 年・環の半径のべき ${f3(t5.twistRingPow)}) | — |`].join('\n');
  T.t5Flat = ['| 源 | 扁平率 f_flat | T1 の捩れの直交の傾きの率(2 R_obs・単位の λ)[1/s] | 土星で 1e7 年に置いた時間 k 0・1・2 [年] | 帯の幅 2 R_eq [m] | 文献の厚み [m](種類) |', '|---|---|---|---|---|---|',
    ...t5.flat.map((f) => `| ${NM[f.key]} | ${f3(f.fFlat)} | ${fe(f.orth)} | ${t5.flatK.map((x) => fe(x.times.find((t) => t.key === f.key).tYr)).join('・')} | ${fe(f.hBand)} | ${f.litH === null ? '—' : fe(f.litH) + '(' + f.litKind + ')'} |`)].join('\n');
  return T;
}
