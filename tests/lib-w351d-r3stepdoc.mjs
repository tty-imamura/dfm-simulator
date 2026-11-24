// 第351便d(原仮定者の回答(2026-11-24 —— 第147報)「AN1008: R3で進める」・統括の検証項目 R430):
// **正本 tests/out/r3step-351d.json から PHYSICS〔第351便d〕の表を作る文書の lib**
// (QA docs.r3step351d が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、固定の表もここに持つ。
export const DOC_VERSION = 'w351d-r3stepdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const READ = Object.freeze({ alpha: '(α)', beta: '(β)', gamma: '(γ)(比べる列)' });
const DEST = Object.freeze({ Om: 'Ω へそろう', negOm: '−Ω へそろう', ninety: '90° に留まる', between: '途中' });
const NORM = Object.freeze({ N1: '(N1)', N2: '(N2)', N3: '(N3)' });
const GREAD = Object.freeze({ g2p: '(g2+)(= f 0)', g3a: '(g3) k_g 0・k_d 1(= f 1)' });
const WREAD = Object.freeze({ S1: '(S1)', S2: '(S2)' });

/** 原文(言葉を変えずに引く —— 原仮定者の回答(2026-11-24 —— 第147報)) */
export const SRC = '原仮定者の回答(2026-11-24 —— 第147報)';
export const ORIGINAL = 'AN1008: R3で進める。軸引きずり回転の、自転軸に直交する成分が、自転方向に90度ずれると、軸引きずり回転軸に近付く向きになる。ただし、自転軸が起きるのは、自転と軸引きずり回転が順方向、つまり源の回転が逆方向の場合である。源の回転が順方向では、自転軸を倒す向きになる。よって、大半の惑星は、銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向きになり、釣り合う。また、軸引きずりには、自転軸を「自転に軸引きずり回転を合成した後の回転軸」に向ける作用も有り、自転軸を向ける回転が自転方向に90度ずれて歳差運動になる。つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする';
/** 原文の句(原文の部分 —— 言葉を変えずに)と、式の当たり方(統括の読み —— 原文と分ける) */
export const PHRASES = Object.freeze([
  Object.freeze(['軸引きずり回転の、自転軸に直交する成分が、自転方向に90度ずれると、軸引きずり回転軸に近付く向きになる', '経路 ①: dŝ/dt = (ω_T/ω_L) k₁ Ω⊥', 'Ω⊥ を回転とみたときの ŝ の動き Ω⊥ × ŝ を、ŝ のまわりに自転の向きへ 90° 回すと ŝ × (Ω⊥ × ŝ) = Ω⊥(表 1 の句 1)']),
  Object.freeze(['自転軸が起きるのは、自転と軸引きずり回転が順方向、つまり源の回転が逆方向の場合である', '経路 ① の瞬時の率 dθ_line/dt = −σ k₁ abs(Ω⊥)・σ = sign(ŝ·Ω)', 'ŝ·Ω > 0(順方向)で回転軸の線に対する傾きが減る(表 1 の句 2・3)']),
  Object.freeze(['源の回転が順方向では、自転軸を倒す向きになる', '同上(ŝ·Ω < 0)', 'ŝ·Ω < 0 で回転軸の線に対する傾きが増える —— 90° を越えた後の読みは表 2']),
  Object.freeze(['自転軸を「自転に軸引きずり回転を合成した後の回転軸」に向ける作用も有り、自転軸を向ける回転が自転方向に90度ずれて歳差運動になる', '経路 ②: dŝ/dt = (ω_T/ω_L) k₂ (Ω × ŝ)', '合成の回転軸 ω ŝ + Ω へ向ける向き(接平面の成分)は Ω⊥ と同じ向き。自転の向きへ 90° 回すと ŝ × Ω⊥ = −(Ω × ŝ)(表 1 の句 4 —— 経路 ② の式の向きとは逆。決断事項の候補 (B))']),
]);
export function phraseTable() {
  return ['| # | 原文の句(言葉を変えずに引く) | 式(統括の読み) | 当たり方(統括の読み —— 原文と分ける) |', '|---|---|---|---|',
    ...PHRASES.map((p, k) => `| ${k + 1} | 「${p[0]}」 | ${p[1]} | ${p[2]} |`)].join('\n');
}
/** 90° を越えた後の読み(固定) */
export const READ_TABLE = ['| 読み | 式 | 90° を越える前(瞬時) | 90° を越えた後 | 行き先(Ω 一定) |', '|---|---|---|---|---|',
  '| (α) | dŝ/dt = k₁ Ω⊥(符号つきの Ω へ寄り続ける) | ŝ·Ω < 0 で回転軸の線に対する傾きが増える(倒す) | θ_line は 90° の後に減る | Ω(どの θ₀ でも) |',
  '| (β) | dθ_line/dt = −σ k₁ abs(Ω⊥)(回転軸の線に対する傾きだけを見る) | (α) と同じ | θ_line は 90° を越えない —— 着いた点で σ = 0・率 0 | θ₀ < 90° は Ω・θ₀ > 90° は 90° に留まる |',
  '| (γ)(比べる列) | dŝ/dt = σ k₁ Ω⊥(符号を掛けたベクトルの形) | ŝ·Ω < 0 で傾きが減る(原文の「倒す」に当たらない) | 90° を越えない | 近い方の向き(Ω か −Ω) |'].join('\n');
/** 比率のノブの置き方(固定) */
export const NORM_TABLE = ['| 置き方 | (k₂, k₁) | 合成の強さ abs(dŝ/dt) ÷ abs(Ω⊥) | f 0 | f 1 |', '|---|---|---|---|---|',
  '| (N1) | (1 − f, f) ÷ hypot(1 − f, f) | 1(f に依らない) | 歳差だけ(= 〔第350便c〕の (g2+)) | 寄るだけ(= 〔第350便c〕の (g3) k_g 0・k_d 1) |',
  '| (N2) | (1 − f, f) | hypot(1 − f, f)(f 0.5 で 0.707) | 同上 | 同上 |',
  '| (N3) | k₁・k₂ を独立に | hypot(k₁, k₂) | — | — |'].join('\n');

export function tablesOf(J) {
  const T = {};
  T['1'] = ['| ω_I(0) | 自転の速さ ω = ω_I + Ω∥ | 句 1: 90° 回した動きと Ω⊥ の cos | 句 2: 順方向の dθ_line/dt の符号 | 句 3: 逆方向の dθ_line/dt の符号 | 句 4: 合成の軸へ向ける向きと Ω⊥ の cos | 句 4: それを 90° 回した向きと Ω × ŝ の cos | 向ける回転の大きさ abs(Ω⊥) | 合成の軸とのなす角 [rad] | 合成の軸と Ω の角 [deg](初め・終わり) | 合成の軸と ŝ の角 [deg](初め・終わり) | f 0 の Ω のまわりの率 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.phrase.map((r) => `| ${r.w} | ${f4(r.wS)} | ${f3(r.p1.cosToPerp)} | ${sg(r.p23.fwd)} | ${sg(r.p23.back)} | ${f3(r.p4.cosTanToPerp)} | ${f3(r.p4.cosRotToPrec)} | ${f4(r.magA)} | ${f4(r.magB)} | ${f3(r.aOmDeg0)}・${f3(r.aOmDegE)} | ${f3(r.aSDeg0)}・${f3(r.aSDegE)} | ${f4(r.precRate)} |`)].join('\n');
  T['2'] = ['| θ₀ [deg] | 読み | 初めの dθ_line/dt | 初めの dθ/dt | θ_line の最大 [deg] | 終わりの θ [deg](t 20) | 閉じた形の θ [deg] | 差 [deg] | 90° を越えた時刻(数値) | 90° に着く時刻(閉じた形) | 行き先 |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.over.map((r) => `| ${r.th0} | ${READ[r.read]} | ${f4(r.dLine0)} | ${f4(r.dTheta0)} | ${f3(r.thLineMaxDeg)} | ${f3(r.thEndDeg)} | ${f3(r.cfThDeg)} | ${fz(r.err)} | ${r.crossT === null ? '—' : f3(r.crossT)} | ${r.tStar === null ? '—' : f3(r.tStar)} | ${DEST[r.dest]} |`)].join('\n');
  T['3'] = ['| 置き方 | f | 換算の係数 k | k₁ | k₂ | 寄る速さ k₁ abs(Ω) | 歳差の率 k₂ abs(Ω) | k₁ ÷ k₂ | abs(dŝ/dt) ÷ abs(Ω⊥) | 初めの dθ/dt(θ₀ 40) | 歳差の 1 周 [時間] | 1 周の間に寄る角 [deg] | 終わりの θ [deg](t 10) | 数値の歳差の率 | 閉じた形との差 [deg] |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.knob.map((r) => `| ${NORM[r.norm]} | ${r.f === null ? '—' : r.f} | ${r.kConv} | ${f4(r.kTilt)} | ${f4(r.kPrec)} | ${f4(r.tiltSpeed)} | ${f4(r.precRate)} | ${r.ratioTP === null ? '—' : f4(r.ratioTP)} | ${f4(r.dsOverPerp)} | ${f4(r.dTh0)} | ${r.periodT === null ? '—' : f3(r.periodT)} | ${r.dThPerTurn === null ? '—' : f3(r.dThPerTurn)} | ${f3(r.thEnd)} | ${f4(r.rateNum)} | ${fz(r.err)} |`)].join('\n');
  T['4'] = ['| A と B のなす角 [deg] | abs(B) ÷ abs(A) | abs(A + B) | 合成の向きと A の角 [deg] | 合成の向きと B の角 [deg] | ŝ₀ と A の cos | ŝ₀ と B の cos | ŝ₀ と合成の向きの角 [deg] | f 1 の終わりの角 [deg] | f 0.5 の終わりの角 [deg] | f 0.5 の回った周 | 合成の向きから ±1° の dθ/dt | 反対の向きから ±1° の離れる率 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.pair.map((r) => r.undetermined
      ? `| ${r.phi} | ${r.b} | ${fz(r.totMag)} | 向きは決まらない | 向きは決まらない | ${f3(r.cosA)} | ${f3(r.cosB)} | — | — | — | — | — | — |`
      : `| ${r.phi} | ${r.b} | ${f4(r.totMag)} | ${f3(r.eToA)} | ${f3(r.eToB)} | ${f3(r.cosA)} | ${f3(r.cosB)} | ${f3(r.s0ToE)} | ${fe(r.endF1)} | ${fe(r.endF05)} | ${f3(r.turnsF05)} | ${r.stab.map(fe).join('・')} | ${r.unstab.map(fe).join('・')} |`)].join('\n');
  T['5'] = ['| 向きの読み(〔第350便c〕) | ω_I(0) | 自転速度の読み | ω_T ÷ ω_L の平均(t 10) | 初めの点の目安 √(ω² + abs(Θ)²) ÷ ω | 終わりの角 [deg] |', '|---|---|---|---|---|---|',
    ...J.ratio.map((r) => `| ${GREAD[r.read]} | ${r.wI0} | ${WREAD[r.wRead]} | ${f4(r.ratio)} | ${f4(r.est)} | ${f3(r.thEndDeg)} |`)].join('\n');
  return T;
}
export function factsOf(J) {
  const c = J.common, b = J.balance, e = J.earth, ps = J.pure.scenes;
  return {
    common: `共通の点検の数(本節の lib で出た値 —— 〔第350便c〕の commonCheck を呼ぶ): x の直径の 2 点の差分の z 成分 ${c.diamXz.toFixed(8)}・6 点の平均の z 成分 ${c.sixZ.toFixed(8)}・中心の渦度の半分の z 成分 ${c.curlWz.toFixed(8)}。`,
    same: `f 0 と〔第350便c〕の (g2+) の軌跡の終わりの ŝ の角の差は 4 本(Ω 一定・Ω の向きが回る × 回転 1 回・中点)とも ${fz(Math.max(...ps.f0))} 度・f 1 と (g3) k_g 0・k_d 1 は ${fz(ps.f1.vsG3a)} 度・(N3)(k₁ 0.1・k₂ 1)と (g3) k_g 1・k_d 0.1 は ${fz(ps.n3.vsG3b)} 度(零試験)。`,
    balance: `起こす率の和が 0 の瞬間の例(公転の北極 n・傾き ${b.eps}°・A = n・B は倒す側で大きさ ${f3(b.b)}): 起こす率 A ${f4(b.raiseA)}・B ${f4(b.raiseB)}・和 ${fz(b.raiseSum)}。それでも abs(dŝ/dt) = ${f4(b.dsMag)}(k₁ 1)で ŝ は動き、t 0.05 の後に ${f3(b.movedDeg)}° 動いて傾き ${f3(b.epsEnd)}°・起こす率 ${f4(b.raiseEnd)}。経路 ① の行き先は合成の向き(n から ${f3(b.eqToN)}°)。`,
    earth: `地球の型の ω_T ÷ ω_L − 1((S2) の目安・自転の角速度 ${fe(e.w)} rad/s・軸の動き ${fe(e.th)} rad/s〔本便の統括の数え直しの (MS) の大きさ 5.0576e-2″/年〕—— 打ち消しなしで直接に数えた値): ${fe(e.ratioMinus1)}。`,
  };
}
