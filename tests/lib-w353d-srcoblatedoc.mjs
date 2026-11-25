// 第353便d(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R468):
// **正本 tests/out/srcoblate-353d.json から PHYSICS〔第353便d〕の表と数の文を作る文書の lib**
// (QA docs.srcoblate353d が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの床の量は「< 1e-9」の印)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353d-srcoblatedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(n));
const fl = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-9 ? '< 1e-9' : fe(x));
const PN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽' });
const NN = Object.freeze({ 'Io|Jupiter': 'イオ ← 木星(実在の組)', 'Moon|EarthHi': '月 ← 地球(実在の組・傾き最大の位相)', io: 'イオ ← 木星(赤道の円の道)', europa: 'エウロパ ← 木星(赤道の円の道)',
  ganymede: 'ガニメデ ← 木星(赤道の円の道)', callisto: 'カリスト ← 木星(赤道の円の道)', titan: 'タイタン ← 土星(赤道の円の道)', ringD: '土星 D 環', ringC: '土星 C 環', ringB: '土星 B 環', ringA: '土星 A 環', ringF: '土星 F 環' });
const AU = 1.495978707e11;

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
]);
export const READINGS = Object.freeze([
  '源(引きずる側)の主の列 = 規則の半径(`tSrc: 0`)+ 扁平率。今の (S) は球の源(`spinRot` に扁平率を渡す口が無い)—— 扁平率を入れる式の候補を並べ、球の極限で今の数に戻ることを見て、どの受け手で効くかを数える。土星の環は円盤引きずりの題(本節は (S) の扁平の項の大きさだけ —— 円盤引きずりの採否に使わない)。受け手の側(観測半径 × 構造の係数のノブ)は本節では変えない(規則の半径のまま)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** 「規則の半径と、扁平率」を同時に置くとき、扁平率が効く所の候補(数は正本から) */
export function placeTable(J) {
  const io = J.radius.find((r) => r.at === 'Io|Jupiter'), rB = J.radius.find((r) => r.at === 'ringB'), ve = J.radius.find((r) => r.at === 'Venus'), R = J.range;
  const c2b = J.cancel.find((c) => c.id === 'O2bLitRule');
  return '| 候補 | 扁平率が入る所 | 規則の半径との関係 | 数(この場・この候補では) |\n|---|---|---|---|\n' + [
    ['(i) 四重極の項の半径 = 規則の半径', '(O1)(O2a) の Q = 1 − ε (R_q/a)² P2(μ) の R_q', `R_q = Y_k M(太陽 ${fe(J.src.find((x) => x.src === 'Sun').Rrule)} m・木星 ${fe(J.src.find((x) => x.src === 'Jupiter').Rrule)} m)`, `項 ÷ 球の項: 金星 ${fe(ve.termRule)}・イオ ${fe(io.termRule)}・土星 B 環 ${fe(rB.termRule)}(倍精度の丸めの下 —— 差では 0)`],
    ['(ii) 四重極の項の半径 = 観測の赤道半径(モーメントの半径は規則の半径のまま)', '同じ Q の R_q だけを観測の赤道半径に', '規則の半径はモーメント(球の項)に・扁平率は観測の形の四重極に', `金星 ${fe(ve.termObs)}・イオ ${fe(io.termObs)}・土星 B 環 ${fe(rB.termObs)}`],
    ['(iii) 規則の半径を扁平に(体積を保つ —— (O2b))', '回転の分子の倍 σ = (1 − f)^(−2/3)(距離に依らない)+ 幾何の J2 の四重極', '規則の半径を球の体積の半径と読み、赤道の半径 = 規則の半径 × (1 − f)^(−1/3)', `σ − 1: 太陽 ${fe(J.far[0].sigma.lit)}・木星 ${fe(R.jupSigma - 1)}(イオの x ${ff(J.cancel[0].io.x, 3)} → ${ff(c2b.io.x, 3)})`],
    ['(iv) 源の自転の分を赤道に寄せる((O3))', '回転の分子だけ —— σ = 1 + 1.5 η と輪の四重極 ε_s = η/2', '重みと規則の半径は変えない', `全部の源に同じ η では金星とイオの比が変わらない(x ${ff(J.cancel.find((c) => c.id === 'O3e1Both').io.x, 3)})—— 換算の係数 k と同じ形`],
  ].map((r) => '| ' + r.join(' | ') + ' |').join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 扁平率 0((O0)・(O1)(O2a)(O2b) の f 0・(O3) の η 0・R_q 2 つ)で〔第352便k〕の `spinRot` と同じ(8 惑星 + 衛星 2 組・(C2)(W)・成分 3 つ・観測の半径・c_R 1 —— 相対の差)', S.vsSpin === 0 && S.zeroOb === 0 && S.vsT === 0 ? '0' : '< 1e-12', G.vsSpinRot],
      ['② 円の道の口 `circRot` が〔第352便s〕の `ringRot` と・衛星の口が `satParts`・打ち消しが `cancelRow` と同じ', S.vsRing === 0 && S.vsSat === 0 && S.vsCancel === 0 ? '0' : '< 1e-12', G.vsRingSat],
      ['③ 統括の数え直し 3: 金星の φ と等大の残り(規則の半径・c_R 1)・(uV)・イオの x と残り', `${ff(S.venus.phiRule, 4)}°・${ff(S.venus.resRule, 6)}・${ff(S.venus.phiCR1, 2)}°・${ff(S.venus.resCR1, 5)}・${ff(S.venus.ioEq, 3)}・${ff(S.venus.ioRes, 3)}`, G.anchor3],
      ['④ 四重極の因子の勾配(解析)と、場の中心差分の回転(ε 0.1・R_q ÷ r 0.5)', '< 1e-6', G.gradFD],
      ['⑤ 一次の比例: 扁平の項は ε に比例・R_q の 2 乗に比例(地球 ← 太陽・観測の半径)', '< 1e-4', G.linear],
      ['⑥ 候補の恒等: (O2a)(f)=(O1)(J2 = (2f − f²)/5)・(O2b) の σ = (1 − f)^(−2/3)・(O3)(η 1)の ε_s ½・σ 5/2', '真', G.identities],
      ['⑦ リポジトリの数(扁平率 f・J2 —— 文献の値・未照合)と同じ・太陽の J2 は無い', '真', G.litValues],
      ['⑧ 一次の係数 c_lin: イオの実在の組と赤道の円の道で同じ・赤道の円の道で 1.5・一次の予測と直接に数えた値(イオ・木星の J2・観測の赤道半径)', '< 1e-2', G.linCoeff],
      ['⑨ 入力の拒否(候補の名・f 1・η 2・負の J2・J2 の無い源・R_q の名・成分・核 K2 の扁平)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.far = '| 受け手 ← 太陽 | a(AU) | c_lin | (R_観測/a)² | (R_規則/a)² | 項 ÷ 球: 幾何の J2(f 9e-6)・観測 | ノブ J2 0.1・観測 | ノブ J2 0.1・規則 | 向きの変化 °(ノブ 0.1・観測) | (O2b) σ − 1(f 9e-6) |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.far.map((r) => `| ${PN[r.id]} | ${ff(r.a / AU, 3)} | ${ff(r.cLin, 3)} | ${fe(r.x2obs)} | ${fe(r.x2rule)} | ${fe(r.quad.geoObs)} | ${fe(r.quad.k01obs)} | ${fe(r.quad.k01rule)} | ${fl(r.dirDeg.k01obs)} | ${fe(r.sigma.lit)} |`).join('\n');
  T.near = '| 受け手 ← 源 | r ÷ R_観測 | c_lin | (R_観測/a)² | 項 ÷ 球: J2(リポジトリ)・観測 | 幾何の J2(f)・観測 | J2(リポジトリ)・規則 | 向きの変化 °(J2・観測) | (O2b) σ − 1(f) |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.near.map((r) => `| ${NN[r.id]} | ${ff(Math.sqrt(1 / r.x2obs), 3)} | ${ff(r.cLin, 3)} | ${fe(r.x2obs)} | ${fe(r.quad.J2obs)} | ${fe(r.quad.geoObs)} | ${fe(r.quad.J2rule)} | ${fl(r.dirDeg.J2obs)} | ${fe(r.sigma.lit)} |`).join('\n');
  T.cancel = '| 候補の列 | 金星 φ ° | 金星 等大の残り | 金星 (uV) での残り | イオ φ ° | イオ x | イオ 等大の残り | イオ 金星の条件での残り |\n|---|---|---|---|---|---|---|---|\n'
    + J.cancel.map((c) => `| ${esc(c.label)} | ${ff(c.venus.phiDeg, 4)} | ${ff(c.venus.resEq, 5)} | ${ff(c.venus.resAtUV, 5)} | ${ff(c.io.phiDeg, 3)} | ${ff(c.io.x, 4)} | ${ff(c.io.resEq, 4)} | ${ff(c.io.resAtVenus, 4)} |`).join('\n');
  { const R = J.range;
    T.range = '| 量 | 値 |\n|---|---|\n' + [
      ['球(対照)のイオの金星の条件での残り', ff(R.res0, 4)],
      [`残りが球の値以下に留まる母天体由来 (S) の倍 m(走査 0.5〜2・刻み ${ff(R.step, 3)})`, `${ff(R.mLo, 3)}〜${ff(R.mHi, 3)}`],
      ['残りが最小の m(走査)・閉じた見込み 1 ÷ x', `${ff(R.mBest, 3)}(残り ${ff(R.resBest, 4)})・${ff(R.mPred, 4)}`],
      ['(O2b) の f に読み替えた範囲・最小の所', `${ff(R.f.lo, 3)}〜${ff(R.f.hi, 3)}・${ff(R.f.best, 3)}`],
      ['(O3) の η に読み替えた範囲・最小の所(四重極の分を除く)', `${ff(R.eta.lo, 3)}〜${ff(R.eta.hi, 3)}・${ff(R.eta.best, 3)}`],
      ['木星の扁平率 f(リポジトリ —— 文献の値・未照合)と (O2b) の σ', `${R.jupF}・${ff(R.jupSigma, 4)}`],
    ].map(([a, b]) => `| ${a} | ${b} |`).join('\n'); }
  T.radius = '| 源 | 受け手 | 規則の半径 m | 観測の赤道半径 m | 規則 ÷ 観測 | ε(種類) | (R_規則/a)² | (R_観測/a)² | 項 ÷ 球(規則) | 項 ÷ 球(観測) |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.radius.map((r) => `| ${PN[r.src]} | ${NN[r.at] || PN[r.at]} | ${fe(r.Rrule)} | ${fe(r.Req)} | ${fe(r.ruleOverObs)} | ${fe(r.eps)}(${r.epsKind === 'J2' ? 'J2' : '幾何の J2'}) | ${fe(r.x2rule)} | ${fe(r.x2obs)} | ${fe(r.termRule)} | ${fe(r.termObs)} |`).join('\n');
  T.place = placeTable(J);
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const ve = J.cancel.find((c) => c.id === 'O1k01Obs'), mer = J.far.find((r) => r.id === 'Mercury'), io = J.near.find((r) => r.id === 'Io|Jupiter'), rD = J.near.find((r) => r.id === 'ringD'), mo = J.near.find((r) => r.id === 'Moon|EarthHi');
  const c2b = J.cancel.find((c) => c.id === 'O2bLitRule'), c1 = J.cancel.find((c) => c.id === 'O1litObs'), R = J.range;
  return {
    far: `遠い場(太陽 → 8 惑星)では、四重極の項 ÷ 球の項 = c_lin × ε × (R_q/a)²(c_lin ${ff(Math.min(...J.far.map((r) => r.cLin)), 3)}〜${ff(Math.max(...J.far.map((r) => r.cLin)), 3)})。ノブ J2 0.1・観測の赤道半径でも最大は水星の ${fe(mer.quad.k01obs)}・規則の半径では ${fe(mer.quad.k01rule)}。`,
    venus: `金星の打ち消しは、ノブ J2 0.1(太陽)・観測の赤道半径でも φ の動き ${fe(ve.venus.phiDeg - J.cancel[0].venus.phiDeg)}°(球 ${ff(J.cancel[0].venus.phiDeg, 4)}°)・等大の残りの動き ${fe(ve.venus.resEq - J.cancel[0].venus.resEq)}(球 ${ff(J.cancel[0].venus.resEq, 5)})。`,
    near: `近い場では、J2(リポジトリ)・観測の赤道半径で、イオ ${fe(io.quad.J2obs)}・月 ${fe(mo.quad.J2obs)}・土星 D 環 ${fe(rD.quad.J2obs)}(赤道の円の道の c_lin は ${ff(io.cLin, 3)} —— 向きは赤道の円の道では変わらない)。規則の半径では最大 ${fe(Math.max(...J.near.map((r) => r.quad.J2rule)))}(土星の環)。`,
    io: `イオの x(等大の倍率 ÷ 金星の条件の倍率)は、球 ${ff(J.cancel[0].io.x, 4)}・(O1) J2(リポジトリ)・観測 ${ff(c1.io.x, 4)}・(O2b) f(リポジトリ)・規則の半径 ${ff(c2b.io.x, 4)}。金星の条件での残りが球の値 ${ff(R.res0, 4)} 以下に留まるのは、母天体由来 (S) の倍 m が ${ff(R.mLo, 3)}〜${ff(R.mHi, 3)} の内((O2b) の f で ${ff(R.f.lo, 3)}〜${ff(R.f.hi, 3)}・(O3) の η で ${ff(R.eta.lo, 3)}〜${ff(R.eta.hi, 3)})。`,
  };
}
