// 第352便l(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R449):
// **正本 tests/out/suntilt-352l.json から PHYSICS〔第352便l〕の表を作る文書の lib**
// (QA docs.suntilt352l が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352l-suntiltdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const f1 = (x) => (!fin(x) ? '—' : Number(x).toFixed(1));
const sg = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const DN = Object.freeze({ Np: '(N+)', Gm: '(G−)' });
const MG = (m) => (m === 'uV' ? '(uV)' : '倍率 ' + m);
const AXN = Object.freeze({ L: 'L(角運動量の重み)', eq: 'eq(等重み)', ecl: '黄道の極(比べる列)' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' });
const KN = Object.freeze({ 1: 'K1', 2: 'K2' });
const RN = Object.freeze({ Sun: '太陽', Jupiter: '木星', Earth: '地球' });
const yrs = (x) => (x === null ? '開かない(Ω と平行)' : fe(x));

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['予想の文。公転面(輪の法線 n̂)も円盤引きずりに応える軸として、太陽の自転軸 ŝ と同じ Ω に別々に応える形を候補 (b) に置く(公転面の由来は数えない)', '表 2・表 3・表 4']),
  Object.freeze(['予想の文。「その際に生じる」を 3 つの候補の式に直す: (b) 輪と自転軸の応答の係数の差・(c) 円盤引きずりの源に銀河の円盤の模型・(d) 面の上と下で符号が替わる分の揺れ。どれが正しいとは書かない', '表 3〜表 8']),
  Object.freeze(['基準軸(L・eq —— 黄道の極は比べる列)に対する太陽の自転軸の角 5.968°・5.230°・7.252° を、候補ごとに作れる桁かを数える目当ての角に置く', '表 3・表 7・表 8']),
  Object.freeze(['歳差の向き (g2+)・(g2−) を同じ重さで並べる(どちらにも寄せない)。候補 (b) で 2 つの向きの差が出る所を表 4 に', '表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 式の形だけを置く行(数えない —— 表 9) */
export const FORMS = Object.freeze([
  Object.freeze(['面へ引き寄せる作用で上下の振動が減るか', 'z̈ = −ω_z² z − γ_z ż(γ_z = 円盤引きずりの減りの率の候補)', '振幅 ∝ e^(−γ_z t / 2)', '数えない(γ_z の式が無い —— 円盤引きずりの側の lib で後に)']),
  Object.freeze(['揺れと歳差が同時に在るときの軸の円', 'dŝ/dt = (Ω_p p̂ + A sin(ω_z t) ê) × ŝ', '半径 (A/2)(1/abs(Ω_p − ω_z) + 1/abs(Ω_p + ω_z))(小角)', '表 6 で数えた(零試験 ⑨ で步と照らした)']),
  Object.freeze(['輪と自転軸の応答の係数の差', 'dn̂/dt = ρ_n (…)・dŝ/dt = ρ_s (…)', '開き始めの率 sin θ abs(ρ_n − ρ_s) abs(Ω)', '表 3 で数えた(ρ の値は置かない)']),
]);
export function formsTable() {
  return ['| 量 | 式の形 | 出る形 | 本節での扱い |', '|---|---|---|---|', ...FORMS.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 同じ係数・経路 ② だけ: 一定の Ω で 2 つの軸の角の変わり [°]((g2+)・(g2−)) | ${S.same2.map(fl9).join('・')} | ${tf(G.samePrecKeepsGamma)} |`,
    `| ② 同じ係数・同じ初めの向き(f 0.5)で 2 つの軸の角の最大 [°] | ${fl9(S.same1)} | ${tf(G.sameStartStays)} |`,
    `| ③ 係数が違う(経路 ② だけ・比 1 と 0.4)—— sin(γ/2) = sin θ abs(sin(Δφ/2)) との差 [°] | ${fl9(S.diffPrec)} | ${tf(G.diffPrecClosed)} |`,
    `| ④ 係数が違う(経路 ① だけ・比 1 と 0.25)—— γ = abs(θ_n − θ_s)(第351便d の closedR3)との差 [°] | ${fl9(S.diffTilt)} | ${tf(G.diffTiltClosed)} |`,
    `| ⑤ Ω = 0 で 2 つの軸が不変 | ${fl9(S.zero)} | ${tf(G.omZero)} |`,
    `| ⑥ 閉じた形と第352便d の r3Ds の RK4(f 0.5・(g2±)・比 0.7)の相対の差 | ${fl9(S.vsRk)} | ${tf(G.closedVsRk)} |`,
    `| ⑦ 輪の平均の口 \`ringAvg\` と第351便j の \`ringOmega\`(成分 3 × 読み 2 × 傾き 2)の相対の差 | ${fl9(S.vsRing)} | ${tf(G.ringAvgVsRingOmega)} |`,
    `| ⑧ 一様な背景の輪の平均 = 背景・第351便j の \`ringRate\` と経路 ① の大きさ | ${fl9(S.uni)}・${fl9(S.rrVs)} | ${tf(G.uniformRing)} |`,
    `| ⑨ 揺れと歳差の閉じた形と步(無次元 Ω_p 1・ω 2.5・A 0.01): 最大・最小の半径の相対の差 | ${S.wob.maxRel < 1e-4 ? '< 1e-4' : fe(S.wob.maxRel)}・${S.wob.minRel < 1e-4 ? '< 1e-4' : fe(S.wob.minRel)} | ${tf(G.wobbleClosed)} |`,
    `| ⑩ 開く時間の往復(経路 ② だけ・θ 60°・γ 5.230°)と経路 ① の無次元の時間 | ${fl9(S.round)}・${fl9(S.tilt1)} | ${tf(G.openRound)} |`,
    `| ⑪ 起点の数: 太陽と基準軸(eq・L・黄道の極)の角・半頂角 5.230° を保つ A((uV)・倍率 1)[″/年]・一様と高さの 1 次の上下の加速度のトルク | ${S.sunDeg.eq}°・${S.sunDeg.L}°・${S.sunDeg.ecl}°/${fe(S.needA.uV)}・${fe(S.needA.one)}/${S.tqZero.map(fl9).join('・')} | ${tf(G.anchors)} |`,
    `| ⑫ 模型の枠(右手の正規直交・ẑ = (G+))・K1 の自分の重みが質量に依らない・受け手の太陽が第352便f と同じ | ${fl9(S.frame)}・${fl9(S.k1Mass)}・${fl9(S.sunVsF)} | ${tf(G.frameRecv)} |`,
    `| ⑬ 入力の拒否(向きの名・負の係数・長さ 0・負の時間・場の型・輪の口 2・揺れの式・読みの名・探す上限) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.ringBg = ['| 場 | 向き・成分 | 輪の平均と背景の相対の差 | 輪の平均と輪の法線の角 [°] |', '|---|---|---|---|',
    ...J.ringBg.map((r) => (r.kind === 'bg' ? `| 一様な背景(倍率 1・輪の法線 = L) | ${DN[r.dir]} | ${fl9(r.relToBg)} | ${f3(r.angLDeg)} |` : `| 第351便j の源の場(輪の傾き 10°・(C1)) | (${r.part}) | — | ${f3(r.angLDeg)} |`))].join('\n');
  T.b = ['| 背景の向き | 大きさ | 基準軸 | f | 背景と基準軸の角 θ [°] | 開き始めの率 [″/年](係数の差 1 あたり) | 開く時間 [年]: 太陽の比 0・2 | 年齢の間に開くのに要る係数の差 | 届く角の上限 [°] |', '|---|---|---|---|---|---|---|---|---|',
    ...J.b.map((r) => `| ${DN[r.dir]} | ${MG(r.mag)} | ${AXN[r.axis]} | ${r.f} | ${f3(r.thDeg)} | ${fe(r.initPerDeltaAsYr)} | ${yrs(r.openYr0)}・${yrs(r.openYr2)} | ${r.deltaReq === null ? '—' : fe(r.deltaReq)} | ${r.maxGammaDeg === null ? '2 経路の和' : f3(r.maxGammaDeg)} |`)].join('\n');
  T.now = ['| 背景の向き | 大きさ | 基準軸 | f | 今の角 γ [°] | γ の率 [″/年]: 同じ係数 (g2+)・(g2−) | γ の率 [″/年]: 太陽の比 0 (g2+)・(g2−) |', '|---|---|---|---|---|---|---|',
    ...J.now.map((r) => `| ${DN[r.dir]} | ${MG(r.mag)} | ${AXN[r.axis]} | ${r.f} | ${f3(r.gammaDeg)} | ${sg(r.same_g2p)}・${sg(r.same_g2m)} | ${sg(r.sun0_g2p)}・${sg(r.sun0_g2m)} |`)].join('\n');
  T.c = ['| 核 | 輪の粒子の自分の重み | 自分の重み ÷ 太陽の | 輪の Ω [Ω₀](W) | 輪の平均と中心の差 | 太陽の Ω [Ω₀]: (C2)・(W) | 差 [″/年]: 輪 W − 太陽 W・輪 W − 太陽 C2 | 年齢の間に開く角 [°](係数 1): 同じ読み・読みの差 |', '|---|---|---|---|---|---|---|---|',
    ...J.c.rows.map((r) => `| ${KN[r.al]} | ${RN[r.recv]} | ${fe(r.Arel)} | ${fe(r.ringZ)} | ${fl9(r.ringVsCenter)} | ${fe(r.sunC2)}・${fe(r.sunW)} | ${fe(r.dWAsYr)}・${fe(r.dC2AsYr)} | ${fe(r.ageDegW)}・${fe(r.ageDegC2)} |`)].join('\n');
  T.d = ['| 核 | 振幅 [pc](仮・未照合) | 周期 [年](仮・未照合) | 背景の大きさ | 替わる分 ÷ 替わらない分 | 揺れの作用 A [″/年] | ω_z [″/年] | Ω_p [″/年] | 軸の円の半径 [°] | 5.968° に要る倍 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.d.rows.map((r) => `| ${KN[r.al]} | ${r.Zpc} | ${fe(r.TzYr)} | ${MG(r.mag)} | ${fe(r.antiOverSym)} | ${fe(r.AAsYr)} | ${fe(r.wAsYr)} | ${fe(r.OpAsYr)} | ${fe(r.radDeg)} | ${fe(r.need)} |`)].join('\n');
  T.dir = ['| 基準軸 | 太陽の自転軸の角 [°] | 太陽の傾きの方位 − (G+) の方位 [°] | 経路 ① の向き(Ω の射影の線) | 経路 ② の向き | 銀河中心の方位 − (G+) [°] | (d) の揺れの向き − (G+) [°](± の往復) |', '|---|---|---|---|---|---|---|',
    ...J.dir.map((r) => `| ${AXN[r.axis]} | ${f3(r.sunOffDeg)} | ${f1(r.sunDAz)} | 0 か 180(係数の差の符号) | ±90(向きの読みと差の符号 —— 開いた後は回る) | ${f1(r.gcDAz)} | ${f1(r.dWobbleDAz)} |`)].join('\n');
  T.sum = ['| 候補 | 組 | 年齢の間に届く角・要る量 | 届くか |', '|---|---|---|---|',
    ...J.sum.map((r) => (r.cand === 'b' ? `| (b) 経路 ${r.path} | ${DN[r.dir]}・${MG(r.mag)}・L | ${r.deltaReq === null ? '開かない(Ω が基準軸と平行)' : '要る係数の差 ' + fe(r.deltaReq)} | ${r.deltaReq === null ? '開かない' : r.reach ? '差 1 の内で届く' : '届かない(差 1 では)'} |`
      : r.cand === 'c' ? `| (c) | ${KN[r.al]}・輪の重み ${RN[r.recv]} | 読みの差の列 ${fe(r.ageDegC2)}°(要る倍 ${fe(r.need)})・同じ読み ${fe(r.ageDegW)}° | 届かない(係数 1 では) |`
        : `| (d)(仮・未照合) | ${KN[r.al]}・${MG(r.mag)}・振幅の上端・周期の下端 | 円の半径 ${fe(r.radDeg)}°(要る倍 ${fe(r.need)}) | 届かない(係数 1 では) |`))].join('\n');
  T.forms = formsTable();
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, b = (dir, m, a, f) => J.b.find((r) => r.dir === dir && r.mag === m && r.axis === a && r.f === f), n = (dir, m, a, f) => J.now.find((r) => r.dir === dir && r.mag === m && r.axis === a && r.f === f);
  const c = (al, id) => J.c.rows.find((r) => r.al === al && r.recv === id), dd = J.d.rows;
  F.uniform = `一様な背景の回転では、輪の平均は背景と同じ(相対の差 ${fl9(J.ringBg[0].relToBg)})で、輪の法線との角は背景と基準軸の角そのもの((N+) ${f3(J.ringBg[0].angLDeg)}°・(G−) ${f3(J.ringBg[1].angLDeg)}°)。第351便j の源の場では (M) の輪の平均は法線と ${f3(J.ringBg[2].angLDeg)}°・(S) は ${f3(J.ringBg[3].angLDeg)}°`;
  F.b = `候補 (b)(G−)・倍率 1・L: 背景と基準軸の角 ${f3(b('Gm', 1, 'L', 0).thDeg)}°・開き始めの率は係数の差 1 あたり ${fe(b('Gm', 1, 'L', 0).initPerDeltaAsYr)}″/年・5.968° 開くのに要る係数の差は経路 ② だけ ${fe(b('Gm', 1, 'L', 0).deltaReq)}・経路 ① だけ ${fe(b('Gm', 1, 'L', 1).deltaReq)}/(uV) では ${fe(b('Gm', 'uV', 'L', 0).deltaReq)}・${fe(b('Gm', 'uV', 'L', 1).deltaReq)}/(N+) では背景が基準軸と平行で、初めにそろった 2 つの軸は開かない`;
  F.now = `今の角(n̂ = 基準軸 L・ŝ = 太陽の自転軸・倍率 1): 同じ係数・経路 ① だけ(f 1)で (N+) ${sg(n('Np', 1, 'L', 1).same_g2p)}″/年・(G−) ${sg(n('Gm', 1, 'L', 1).same_g2p)}″/年(どちらも縮む向き)/経路 ② だけ(f 0)で 0/太陽の比 0・f 0 では (G−) で (g2+) ${sg(n('Gm', 1, 'L', 0).sun0_g2p)}・(g2−) ${sg(n('Gm', 1, 'L', 0).sun0_g2m)}″/年(向きの読みで符号が替わる)・f 0.5 で ${sg(n('Gm', 1, 'L', 0.5).sun0_g2p)}・${sg(n('Gm', 1, 'L', 0.5).sun0_g2m)}″/年`;
  F.c = `候補 (c)(模型の Ω は (G+) の向き —— 基準軸 L との角 ${f3(J.c.thLDeg)}°・太陽の自転軸との角 ${f3(J.c.thSunDeg)}°): K1 では自分の重みが質量に依らず、輪の平均(W)と太陽(W)の差は ${fl9(c(1, 'Sun').dW)}・読みの差(輪 W・太陽 C2)だけが残り、年齢の間に ${fe(c(1, 'Sun').ageDegC2)}°/K2 では木星の重みの輪で ${fe(c(2, 'Jupiter').ageDegC2)}°・地球の重みの輪で ${fe(c(2, 'Earth').ageDegC2)}°`;
  const dk = (al, m) => dd.find((r) => r.al === al && r.mag === m && r.zKey === 'hi' && r.tzKey === 'lo');
  F.d = `候補 (d)(仮・未照合 —— 振幅の上端・周期の下端): 面の上と下で符号が替わる分 ÷ 替わらない分は K1 ${fe(dk(1, 'uV').antiOverSym)}・K2 ${fe(dk(2, 'uV').antiOverSym)}。軸の円の半径は K1 ${fe(dk(1, 'uV').radDeg)}°((uV))・${fe(dk(1, 1).radDeg)}°(倍率 1)・K2 ${fe(dk(2, 'uV').radDeg)}° —— 5.968° には K1 で ${fe(dk(1, 'uV').need)} 倍が要る`;
  const dl = J.dir.find((r) => r.axis === 'L'), de = J.dir.find((r) => r.axis === 'eq');
  F.dir = `向きの材料: 太陽の傾きの方位は (G+) の方位から L で ${f1(dl.sunDAz)}°・eq で ${f1(de.sunDAz)}°。(d) の揺れの向きは (G+) の方位から ${f1(dl.dWobbleDAz)}°(L)・${f1(de.dWobbleDAz)}°(eq)の線の上を往復する`;
  return F;
}
