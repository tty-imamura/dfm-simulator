// 第334便d(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN637・AN634・AN624)・統括の検証項目 R325): **正本 tests/out/binarylaw-w334d.json から PHYSICS〔第334便d〕の表を作る文書の lib**
// (QA docs.binaryLaw334d が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔零の配置の d・漂いの数値の残り〕は「< 1e-13」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w334d-binarylawdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const KIND = Object.freeze({ ecc: '離心率 e', tilt: '源の自転軸の傾き〔°〕', async: '非同期(自転 ÷ 公転)', conflate: '源の角速度の混同(× n —— 宣言した反例)' });
const GL = Object.freeze({ recv2: '受け手 n = 2', sym2: '対称 n = 2', sym4: '対称 n = 4', recvM3: '受け手 n = −3', symM6: '対称 n = −6' });
const combo = (g, k1) => GL[g] + (k1 ? ' + K1' : '(K1 なし)');
const PAIR = Object.freeze({ both: '両方を同じ向き', first: '主だけ', second: '伴だけ', anti: '両方を反対の方位' });
export function tablesOf(J) {
  const T = {}, S = J.sync, B = J.grid, D = J.decl;
  // 表 1 同期の零試験と反例
  T.sync = ['| 操作 | 量 | ‖d‖ の最大(÷ n a) | 自転の滑りの最大(÷ n) | 並進の分 ‖d_並進‖ の最大 | 回転の分 ‖d_回転‖ の最大 | 代表の配置の ‖d‖(q = 0.122・位相 0.7・受け手 = 伴) |', '|---|---|---|---|---|---|---|',
    `| なし(円・軸一致・相互同期) | — | ${lt(S.null.maxD, D.sync.nullTol)} | ${lt(S.null.maxSlip, D.sync.nullTol)} | — | — | ${S.null.n} 配置(質量比 ${D.sync.massRatios.length} × 位相 ${D.sync.phases.length} × 受け手 2 × 自己の重み ${D.sync.selfRatios.length}) |`]
    .concat(S.ops.map((q) => `| ${KIND[q.kind]} | ${q.value} | ${fx(q.maxD)} | ${lt(q.maxSlip, D.sync.nullTol)} | ${fx(q.maxTrans)} | ${fx(q.maxRot)} | ${fx(q.repD)} |`)).join('\n');
  // 表 2 次数(宣言した探り)と共変性
  T.order = ['| 操作 | 探りの量 | d の傾き(log) | d の次数 | 滑りの次数 |', '|---|---|---|---|---|']
    .concat(['ecc', 'tilt', 'async'].map((k) => { const o = S.order[k]; return `| ${KIND[k]} | ${o.amounts.map((x) => fx(x)).join('・')} | ${f4(o.dSlope)} | ${o.dOrder} | ${o.slipOrder} |`; }))
    .concat([`| 全体を一緒に回す(軸 [1, 2, 3]・${D.sync.covAngleDeg}°)/枠の回転(ω_f = [0.3, −0.2, 0.5]) | — | 相対の差 ${lt(S.cov.rotRel, 1e-12)}/${lt(S.cov.frameRel, 1e-12)} | 共変(d は一緒に回る・枠の回転で不変) | — |`]).join('\n');
  // 表 3 同時発展の格子(e = 0.3・ε = 1e-6 —— η の 3 点)
  const pick = (g, k1, eta, e, eps) => B.rows.find((q) => q.g === g && q.k1 === k1 && q.eta === eta && q.e === e && q.eps === eps);
  T.grid = ['| 型 | η | ρ(同時発展) | ρ₁(入れた式) | (ρ − ρ₁)/ε | ΔP/P ÷ ε(e = 0) | ΔP/P ÷ ε(e = 0.3) | e の漂い〔/公転〕 | 面の漂い〔/公転〕 |', '|---|---|---|---|---|---|---|---|---|'];
  for (const t of D.grid.gTypes) for (const k1 of D.grid.k1) for (const eta of [1e-6, 0.0974, 0.25]) {
    const q = pick(t.key, k1, eta, 0.3, 1e-6), z = pick(t.key, k1, eta, 0, 1e-6);
    T.grid.push(`| ${combo(t.key, k1)} | ${eta} | ${f4(q.rho)} | ${f4(q.rho1)} | ${f4(q.dRho / 1e-6)} | ${f4(z.dPoverP / 1e-6)} | ${f4(q.dPoverP / 1e-6)} | ${lt(q.de, 1e-12)} | ${lt(q.tiltRate, 1e-12)} |`);
  }
  T.grid = T.grid.join('\n');
  // 表 4 帳簿(E・L・重心 —— η = 0.0974・e = 0.3・ε = 1e-6)
  T.ledger = ['| 型 | E_N の永年の率(相対/公転) | E_N の振れ(相対) | ‖L‖ の永年の率 | 重心の位置(16 公転後) | 重心の速さ(16 公転後) | 一次の式の重心の速さ | 比 |', '|---|---|---|---|---|---|---|---|']
    .concat(D.grid.gTypes.flatMap((t) => D.grid.k1.map((k1) => { const q = pick(t.key, k1, 0.0974, 0.3, 1e-6);
      return `| ${combo(t.key, k1)} | ${lt(q.eSlopeRel, 1e-12)} | ${fe(q.eSpanRel)} | ${lt(q.lSlopeRel, 1e-12)} | ${lt(q.cm, 1e-12)} | ${lt(q.vcm, 1e-12)} | ${q.vcmFirst === 0 ? '0(作用反作用を保つ)' : fe(q.vcmFirst)} | ${q.vcmFirst === 0 ? '—' : f4(q.vcm / q.vcmFirst)} |`; }))).join('\n');
  // 表 5 刻みの感度(h/h/2/h/4 —— 宣言の部分集合の最大)
  T.band = ['| 型 | ρ の h と h/2 の差の最大 | h/2 と h/4 の差の最大 | ΔP/P の h と h/2 の差の最大 |', '|---|---|---|---|']
    .concat(D.grid.gTypes.flatMap((t) => D.grid.k1.map((k1) => { const r = B.band.filter((q) => q.g === t.key && q.k1 === k1);
      return `| ${combo(t.key, k1)} | ${fe(Math.max(...r.map((q) => q.d12)))} | ${fe(Math.max(...r.map((q) => q.d24)))} | ${lt(Math.max(...r.map((q) => q.p12)), 1e-12)} |`; }))).join('\n');
  // 表 6 還元の和との差と交差の項(η = 0.0974・e = 0.3)
  T.reduced = ['| 型 | ε | 分担(同時発展) | 還元の和(第333便c の binaryNumeric) | 差 | 一次の式との差 | 交差の項 ÷ ε(同時発展の G_loc + K1 − G_loc だけ − K1 だけ) |', '|---|---|---|---|---|---|---|']
    .concat(D.grid.gTypes.flatMap((t) => D.grid.k1.flatMap((k1) => D.grid.reducedSubset.eps.map((eps) => { const q = B.reduced.find((x) => x.g === t.key && x.k1 === k1 && x.eta === 0.0974 && x.e === 0.3 && x.eps === eps);
      return `| ${combo(t.key, k1)} | ${eps} | ${f4(q.share)} | ${f4(q.reduced)} | ${fe(q.diff)} | ${fe(q.diffFirst)} | ${q.cross === null ? '—' : f4(q.cross / eps)} |`; })))).join('\n');
  // 表 7 走行の後の読み(判定に使わない)—— (ρ − ρ₁)/ε の e と η の依存・ε の傾き
  T.shape = ['| 型 | η | (ρ − ρ₁)/ε: e = 0.1 | e = 0.3 | e = 0.6 | ε の傾き(1e-6 → 1e-4): e = 0.1 | e = 0.3 | e = 0.6 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.shape.rows.map((r) => `| ${combo(r.g, r.k1)} | ${r.eta} | ${r.perE.map((x) => f4(x.dRhoOverEps)).join(' | ')} | ${r.perE.map((x) => f4(x.epsSlope)).join(' | ')} |`)).join('\n');
  // 表 8 残差の法則(族 × 型 —— 検証の系 4 本の ‖予測 − 同時発展‖ ÷ 幅の最大)
  T.law = ['| 型 | 入れた式 ρ₁ = c₀ + c₁η | F1 の係数(c₀・c₁) | 検証の ‖差‖ ÷ 幅の最大: F1 | F2 | F3 | F4 | 法則と呼ぶ族 | 新しい項(有る) |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.law.combos.map((c) => { const m = (f) => Math.max(...f.verify.map((r) => Math.abs(r.diff) / r.tol)), F = c.fams;
      return `| ${combo(c.g, c.k1)} | ${f4(c.first.c0)} + ${f4(c.first.c1)}η | ${f4(F[0].coef[0])}・${f4(F[0].coef[1])} | ${F.map((f) => f4(m(f))).join(' | ')} | ${c.lawKey || '無し(残差のまま)'} | ${c.newTermsPresent === null ? '—' : c.newTermsPresent.length ? c.newTermsPresent.join('・') : '無し'} |`; })).join('\n');
  // 表 9 系の表(本の η・e・ε・自転)
  const ROLE = { design: '設計', verify: '検証', reading: '読み', spin: '自転の宣言' };
  T.systems = ['| 本 | 役割 | η | e | ε = GM/(a c₀²) | 自転 ÷ 公転(主・伴) | 自転の出どころ | ‖d_回転‖/v の目安(主が受け手・伴が受け手) | 線形の範囲 | (4/3)η |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.systems.map((s) => `| ${s.ja} | ${ROLE[s.role]} | ${f4(s.eta)} | ${lt(s.e, 1e-6)} | ${fe(s.eps)} | ${s.spins.map((x) => fx(x.overN)).join('・')} | ${s.spins.map((x) => x.src).join('・')} | ${s.rotRatio.map((x) => fe(x)).join('・')} | ${tf(s.linear)} | ${f4(s.rho1Now)} |`)).join('\n');
  // 表 10 傾いた自転軸(1 つの軸の宣言で複数の量 —— 受け手 n = 2 + K1 + 回転の分・η = 0.0974・e = 0.1・ε = 1e-6)
  T.tilt = ['| 自転 | 軸の組 | 傾き〔°〕 | ρ | Δρ(回転の分) | 面の漂いの率 ÷ q_1PN | ΔP/P の差 ÷ ε | e の漂い〔/公転〕 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.tilt.rows.map((q) => `| ${q.spin === 'sync' ? '同期 s = n' : '速い s = 100 n'} | ${PAIR[q.pair]} | ${q.tiltDeg} | ${f4(q.rho)} | ${fe(q.dRho)} | ${lt(q.tiltRateOverQ1, 1e-9)} | ${f4(q.dPdiff / D.tilt.eps)} | ${lt(q.de, 1e-7)} |`)).join('\n');
  // 表 11 冥王星–カロンの読み
  const P = J.pluto;
  T.pluto = ['| 量 | 値 | 読み |', '|---|---|---|',
    `| η・質量比 q(🟪 の本) | ${f4(P.eta)}・${f4(P.q)} | 🥶 の本と同じ η ${f4(P.diagEta)} |`,
    `| e(本の初期の状態) | ${lt(P.e, 1e-6)} | 円(近点は定まらない —— 近点の率の残差は観測の精度とは別に読めない) |`,
    `| ε = GM/(a c₀²) | ${fe(P.eps)} | 格子の最小 1e-8 の外(二次の項は 1e-12 の桁) |`,
    `| 自転 ÷ 公転(主・伴) | ${P.spinOverN.map((x) => f4(x)).join('・')} | 相互同期 |`,
    `| 座標変換の d・自転の滑り(同期・円) | ${lt(P.syncD, 1e-13)}・${lt(P.syncSlip, 1e-13)} | 零試験の配置(条件付きの恒等式) |`,
    `| 同じ配置に e = 2e-4 | ${fe(P.eccD)} | 一次(離心率の操作) |`,
    `| G_loc の型の残差 ρ₁(一次・近点の率) | 今 ${f4(P.rho1.now)}・対称 n = 2 ${f4(P.rho1.sym2)}・対称 n = 4 0・受け手 n = −3 ${f4(P.rho1.recvM3)}・対称 n = −6 0 | (4/3)η ≈ 0.13 の桁(入れた式) |`]
    .concat(P.period.map((r) => `| 周期への効き ${combo(r.combo.replace('+K1', ''), /\+K1/.test(r.combo))} | ΔP/P ÷ ε = ${f4(r.dPoverPperEps)}(格子の η = ${r.etaGrid}・e = 0・ε = 1e-8)→ ΔP = ${fe(r.dPs)} s | 本の周期の 1σ ${P.fitRecord.sigma} s の内 |`))
    .concat([`| 🟪 の記録(説明文の欄 —— 器は値として読まない) | 引用 | ${P.quote.fit} |`, `| 🥶 の記録(説明文の欄) | 引用 | ${P.quote.diag} |`]).join('\n');
  // 表 12 純関数の場面
  T.pure = ['| 場面 | 門 |', '|---|---|'].concat(Object.entries(J.pure.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)).join('\n');
  return T;
}
