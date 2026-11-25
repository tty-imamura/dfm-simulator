// 第352便f(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R443):
// **正本 tests/out/galdisk-352f.json から PHYSICS〔第352便f〕の表と数の文を作る文書の lib**
// (QA docs.galdisk352f が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、固定の表もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352f-galdiskdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const P = (p) => (p === -0.5 ? '−½' : String(p));
const SIG = Object.freeze({ exp: '指数', mestel: '1/R' });
const sgn = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河の並進引きずりの計算が未確定なので、銀河の回転から軸引きずりの計算は出来ない。太陽系に及ぼす影響から逆算する段階']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系は、回転する銀河の円盤に含まれていてる。銀河の円盤は、中心からの距離に関わらず、ほぼ同じ速度で回転しているので、並進引きずりの差分も少ないと予想する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足 3)', '太陽系に対する銀河の軸引きずりが、『背景軸引きずり』である。『背景慣性決定力』に含まれる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1009: B2で進める。「背景並進引きずり」は、慣性系では織り込み済みなので、「背景慣性決定力」は、ほぼ「背景軸引きずりとなる」']),
]);
export const READINGS = Object.freeze([
  '「(S)だけを数えると弱い」は予想の文 —— 銀河の側の (S) を 2 つの読み((S 型-点) 星の自転/(S 型-体) 円盤全体の回転)で数えて並べる(どちらが「銀河由来の (S)」かは決めない)',
  '段階の指示 —— 本節は銀河の回転から背景軸引きずりを作らない。作るのは予想の文を数えられる形に直すための小さな対照の模型だけ(背景の大きさを本節の数で置かない)',
  '「ほぼ同じ速度で回転」= 速度の場の冪 p ≈ 0(平坦)と読む。「並進引きずりの差分」を (i) 速さの差分 dv/dR と (ii) 向きの変化の分 v/R に分けて並べる(どちらと読むかは決めない)',
  '予想の文(形成の文)—— 今の積分に入れない。表 4 は「傾きを作るのに何が要るか」の式の整理だけ(一様な上下の加速度のトルクの零試験)',
  '背景軸引きずりの定義(恒久)—— 本節の模型の数は、この背景の大きさの候補として置かない(比べる数だけ)',
  '「背景並進引きずり」は織り込み済み —— 一様な並進は回転を作らない(表 1 の零試験)。差分(勾配)の分は一様な並進ではないので、本節の表 1・表 2 で数える',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** 予想の文 → 数えられる形(固定 —— 統括の読み) */
export const FORM_TABLE = ['| 予想の文(原文の句) | 数えられる形 | 本節の表 |', '|---|---|---|',
  '| 「ほぼ同じ速度で回転している」 | 速度の場 v_φ(R) = v₀ (R ÷ R₀)^p の p ≈ 0(比べる列 p 1 剛体・p −½ 点の源のまわり) | 表 1・表 2 |',
  '| 「並進引きずりの差分も少ない」 | (i) 速さの差分 dv/dR = p Ω₀/(ii) 向きの変化の分 v/R = Ω₀/局所の回転 = 両方の和の半分 | 表 1(運動学)・表 2(在位の形の場に写した模型) |',
  '| 「(S)だけを数えると弱い」 | (S 型-点) 星の点の自転だけ/(S 型-体) 円盤全体を 1 つの回転する源/比べる列 (M 型)・(源の運動だけ) —— Ω₀ の倍 | 表 2・表 3 |',
  '| 「太陽系に及ぼす影響から逆算する段階」 | 模型の数を背景の大きさに置かない —— 一様な背景(倍率 1 = ω_G)と (uV) との桁の差を数だけ | 表 3 |',
  '| 「波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる」 | 重心のまわりのトルク Σ m r × a(r) —— 一様・高さの 1 次の上下の加速度では 0。傾きの経路の候補 (a)(b)(c) | 表 4・表 5 |'].join('\n');
/** 読みの定義(固定) */
export const READ_TABLE = ['| 読み | 場(〔第348便h〕の makeField3) | 源 | 受け手 |', '|---|---|---|---|',
  '| (M 型) | 在位の形(受け手の速度を引く) | 輪の点の源(速さ v_φ(R_i)・自転 0) | (R₀, 0, 0)・速度 v₀ ŷ |',
  '| (源の運動だけ) | 受け手の速度を引かない(第350便の比べる列) | 同じ | 同じ |',
  '| (S 型-点) | 在位の形・相対の速度 0 | 同じ点の源の自転だけ(自転 0 —— 星の自転を別に入れなければ 0) | 速度 0 |',
  '| (S 型-体) | 在位の形・源の回転の形 q 0(源の枠の剛体の回転 —— 受け手が球の内側なので球のモーメント M は使えない) | 1 つの球(質量 = 円盤・半径 = 外縁・原点)の自転 Ω_s ẑ(Ω_s = Ω₀ か模型の角運動量 ÷ 慣性モーメント) | (M 型) と同じ |',
  '| 回転の読み (W)・(C2) | (W) 中心の渦度の半分/(C2) 受け手の球の半径の平均(〔第350便b〕の `c2Ball` —— 自分の重みを半径 ρ の値に置く一次の展開) | — | 自分の重み off(分母に入れない)/rule(太陽: K1 は規則の半径 Y_k m・K2 は既定の半径 min(R_obs, 6.5e6 m)) |'].join('\n');
/** 傾きの経路の候補と〔第351便j〕の口(固定 —— 本節では (b)(c) を数えない) */
export const PORT_TABLE = ['| 経路 | 要るもの | 〔第351便j〕の lib の口で書けるか | 後のラウンドへの提案 |', '|---|---|---|---|',
  '| (a) 受け手の大きさにわたる場の差 | 球でない受け手(扁平)と勾配の場(潮汐の型)・または勾配でない場 —— 表 4 | 当たらない(輪の口ではなく受け手の形の量) | 太陽の扁平の比と、銀河の場の勾配の大きさを並べる列 |',
  '| (b) 輪(公転面)と自転軸が別々に応える | 外からの Ω を 1 つ置き、輪の法線 L̂ と自転軸 ŝ のそれぞれの率を出す | 書ける —— `ringRate(L, Om, { kTilt, kPrec, ref })` は Ω を引数で受ける(ŝ には〔第351便d〕の `r3Rate`)。一定の Ω の步は `r3Step` | 背景の向き (N+)・(G−) の Ω で、太陽系の基準軸の候補の L̂ と太陽の ŝ の率を並べる(本便の枝 c・d の口と同じ Ω) |',
  '| (c) 円盤引きずりの式を太陽系の輪に当てる | 任意の場の Ω を輪の粒子で平均する口 | 書けない —— `ringOmega` は場を引数で受けず、〔第350便g〕の `omegaField`(原点の源 1 つ・自転 s)を中で作る。`ringStep` も同じ | 新しい lib に「場を引数で受ける輪の平均」の口を置き、`ringOmega` と同じ入力で数値を照らす零試験を置く(既存の lib は変えない) |',
  '| 「(M) は輪の法線と平行・輪の傾きを動かすのは (S) だけ」 | 〔第351便j〕の在位の形の場(源 1 つ)での結果 | その場の中では書ける(表 2 の (M) の abs(Ω⊥) ÷ abs(Ω) < 1e-12) | 銀河の円盤の模型の (M 型)・(S 型-体) で同じ比を数える列((c) の口の後) |'].join('\n');

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 閉じた形: 局所の回転(〔第350便b〕の c2Quad・半径 0.02)p 1・0・−½(Ω₀ の倍)', `${f3(S.p1)}・${f3(S.p0)}・${f3(S.pm)}`, G.closed],
      ['② 平坦(p 0)の速さの差分 dv/dR・向きの変化の分 v/R(Ω₀ の倍)', `${fz(Math.abs(S.flatDv) < 1e-10 ? 0 : S.flatDv)}・${f3(S.flatVR)}`, G.flat],
      ['③ 一様な並進の場の (C2)・平坦の場に一様な並進を足した (C2) と足さない (C2) の差', `${fz(S.uniform)}・< 1e-12`, G.uniform],
      ['④ 第350便までの共通の点検の数(x の直径の 2 点の差分・6 点の平均・中心の渦度の半分 の z 成分)', `${S.common.diaXz.toFixed(8)}・${S.common.sixZ.toFixed(8)}・${S.common.rotWz.toFixed(8)}`, G.common],
      ['⑤ 自分の重み off の (M 型) と (源の運動だけ) の相対の差/(S 型-点)/(S 型-体) q 0・自分の重み off の (M 型)・(源の運動だけ)(Ω_s 0.7)', `< 1e-12/${fz(S.disk.sPoint)}/${f3(S.disk.bodyOff)}・${f3(S.disk.bodyOffSrc)}`, G.diskOff],
      ['⑥ 速度を全部反転した (M 型) の回転 + 元の回転(相対)/源と受け手に同じ速度を足した (M 型) の相対の差', `${fz(S.disk.reverse)}・${fz(S.disk.galilei)}`, G.diskSym],
      ['⑦ 変異: 向きの変化の分を落とした回転(½ dv/dR だけ)の平坦の値', fz(Math.abs(S.mutFlat) < 1e-10 ? 0 : S.mutFlat), G.mutant],
      ['⑧ 入力の拒否(p・外縁・輪の密さ・面密度の名・自分の重みの名・読みの名・閉じた形の p)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
      ['⑨ トルク: 一様・高さの 1 次・球の潮汐の型/扁平(0.9)の潮汐の型の y 成分と閉じた形 h (M_zz − M_xx)', `${fz(0)}・${fz(0)}・${fz(0)}/${fe(S.torque.tideOblate[1])}・${fe(S.torque.tideClosed)}`, G.torque],
    ].map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.kin = '| p | 速さの差分 dv/dR | 向きの変化の分 v/R | 局所の回転 ½ (dv/dR + v/R) | ずれ ½ (v/R − dv/dR) | 数値: 有限の差の回転 | 数値: (C2) の求積(半径 0.02) |\n|---|---|---|---|---|---|---|\n'
    + J.kin.map((r) => `| ${P(r.p)} | ${f3(r.dvdR)} | ${f3(r.vOverR)} | ${f3(r.omega)} | ${f3(r.shearA)} | ${f3(r.omegaFD)} | ${f3(r.omegaC2)} |`).join('\n');
  { const B = J.decl.disk.base, base = (p, al) => J.disk.find((r) => r.p === p && r.sigma === B.sigma && r.edge === B.edge && r.perUnit === B.perUnit && r.al === al);
    const rows = [];
    for (const al of J.decl.disk.als) {
      const R = J.decl.ps.map((p) => base(p, al)), b = (r, k) => r.body.find((x) => x.kind === k);
      rows.push([`K${al}`, '(M 型)・自分の重み off・(W)', R.map((r) => fe(r.off.M.W))]);
      rows.push([`K${al}`, '(M 型)・自分の重み rule・(W)', R.map((r) => fe(r.rule.M.W))]);
      rows.push([`K${al}`, '(M 型)・自分の重み rule・(C2)', R.map((r) => fe(r.rule.M.C2))]);
      rows.push([`K${al}`, '(源の運動だけ)・自分の重み rule・(C2)', R.map((r) => fe(r.rule.src.C2))]);
      rows.push([`K${al}`, '(S 型-点)・自分の重み rule', R.map((r) => fz(r.sPoint))]);
      rows.push([`K${al}`, '(S 型-体) Ω_s = Ω₀・(M 型)・rule・(C2)', R.map((r) => fe(b(r, 'atR0').rule.M.C2))]);
      rows.push([`K${al}`, '(S 型-体) Ω_s = Ω₀・(源の運動だけ)・rule・(C2)', R.map((r) => fe(b(r, 'atR0').rule.src.C2))]);
      rows.push([`K${al}`, '(S 型-体) Ω_s = L ÷ I・(M 型)・rule・(C2)', R.map((r) => fe(b(r, 'LoverI').rule.M.C2))]);
      rows.push([`K${al}`, '自分の重み ÷ 円盤の重み(受け手の位置)β', R.map((r) => fe(r.wr.beta))]);
    }
    T.disk = '| 核 | 読み(受け手の回転の z 成分 —— Ω₀ の倍) | p 1 | p 0 | p −½ |\n|---|---|---|---|---|\n' + rows.map(([k, a, v]) => `| ${k} | ${a} | ${v.join(' | ')} |`).join('\n'); }
  T.grid = '| p | 面密度 | 外縁 [R₀] | 輪/R₀ | 核 | β | L ÷ I | (M 型) off (W) | (M 型) rule (C2) | (源の運動だけ) rule (C2) | (S 型-体) Ω₀ rule (C2) | (S 型-体) L ÷ I rule (C2) |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.disk.map((r) => { const b = (k) => r.body.find((x) => x.kind === k); return `| ${P(r.p)} | ${SIG[r.sigma]} | ${r.edge} | ${r.perUnit} | K${r.al} | ${fe(r.wr.beta)} | ${f3(r.LoverI)} | ${fe(r.off.M.W)} | ${fe(r.rule.M.C2)} | ${fe(r.rule.src.C2)} | ${fe(b('atR0').rule.M.C2)} | ${fe(b('LoverI').rule.M.C2)} |`; }).join('\n');
  T.conv = '| N_φ | (M 型) rule (W) | (M 型) off (W) |\n|---|---|---|\n' + J.conv.map((r) => `| ${r.nPhi} | ${fe(r.W)} | ${fe(r.Woff)} |`).join('\n')
    + '\n\n| p | c2Quad(半径 0.02・自分の重み off) | 中心の (W) | 相対の差 |\n|---|---|---|---|\n' + J.c2check.map((r) => `| ${P(r.p)} | ${fe(r.c2Quad)} | ${fe(r.W)} | ${fe(r.rel)} |`).join('\n');
  { const NAME = { vOverR: '表 1 向きの変化の分 v/R', omega: '表 1 局所の回転', dvdR: '表 1 速さの差分 dv/dR', Moff: '表 2 (M 型) off (W)', MruleC2: '表 2 (M 型) rule (C2)', srcRuleC2: '表 2 (源の運動だけ) rule (C2)', bodyRuleC2: '表 2 (S 型-体) Ω₀ (M 型) rule (C2)' };
    T.bg = '| 量 | p | 核 | 一様な背景(倍率 1 = ω_G)に対する比 | rad/s | log10(abs ÷ (uV) の倍率 1.19282e-12) |\n|---|---|---|---|---|---|\n'
      + J.bg.rows.map((r) => `| ${NAME[r.what]} | ${P(r.p)} | ${r.al ? 'K' + r.al : '—'} | ${fe(r.overU1)} | ${fe(r.radS)} | ${r.log10OverUV === null ? '—(0)' : f2(r.log10OverUV)} |`).join('\n'); }
  T.torque = '| 場 | 球: トルク (x, y, z) | 扁平 0.9: トルク (x, y, z) | 閉じた形の y 成分(球・扁平) |\n|---|---|---|---|\n'
    + J.torque.map((r) => `| ${r.name} | ${r.sphere.map(fz).join(', ')} | ${r.oblate.map(fz).join(', ')} | ${r.closedY.map(fz).join('・')} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, D = J.disk, by = (p, al) => D.filter((r) => r.p === p && r.al === al), k0 = J.kin.find((r) => r.p === 0);
  F.kin = `平坦(p 0)では速さの差分 dv/dR は 0、向きの変化の分 v/R は Ω₀ で、局所の回転(渦度の半分)は ${f3(k0.omega)} Ω₀(有限の差 ${f3(k0.omegaFD)}・(C2) の求積 ${f3(k0.omegaC2)})。速さの差分だけを数えると p 0 で 0・向きの変化の分を含めると Ω₀ の ½。`;
  F.off = `自分の重みを分母に入れない模型(重みつきの平均の速度の場)の (W) は、K1 で p 1 ${rng(by(1, 1).map((r) => r.off.M.W), fe)}・p 0 ${rng(by(0, 1).map((r) => r.off.M.W), fe)}・p −½ ${rng(by(-0.5, 1).map((r) => r.off.M.W), fe)}、K2 で p 0 ${rng(by(0, 2).map((r) => r.off.M.W), fe)}(Ω₀ の倍 —— 表 1 の運動学の局所の回転 1・0.5・0.25 とは別の数)。(M 型) と (源の運動だけ) の差は < 1e-12(一定の速度を引いても重みつきの平均の回転は変わらない)。`;
  F.rule = `受け手 = 太陽の自分の重みを分母に入れると(β = 自分の重み ÷ 円盤の重み: K1 ${rng(D.filter((r) => r.al === 1).map((r) => r.wr.beta), fe)}・K2 ${rng(D.filter((r) => r.al === 2).map((r) => r.wr.beta), fe)})、(M 型) の (C2) は K1 ${rng(D.filter((r) => r.al === 1).map((r) => r.rule.M.C2), fe)}・K2 ${rng(D.filter((r) => r.al === 2).map((r) => r.rule.M.C2), fe)} Ω₀。(源の運動だけ) の (C2) の符号は組で入れ替わる(K1 の正 ${D.filter((r) => r.al === 1 && r.rule.src.C2 > 0).length}/${D.filter((r) => r.al === 1).length}・K2 の正 ${D.filter((r) => r.al === 2 && r.rule.src.C2 > 0).length}/${D.filter((r) => r.al === 2).length})。(S 型-点) は 0(星の自転を入れていない)。`;
  F.body = `(S 型-体)(円盤全体を 1 つの回転する源・q 0)は、自分の重み off で剛体の回転 Ω_s そのもの(零試験 ⑤)・rule の (M 型) の (C2) は Ω_s = Ω₀ で K1 ${rng(D.filter((r) => r.al === 1).map((r) => r.body.find((b) => b.kind === 'atR0').rule.M.C2), fe)}・K2 ${rng(D.filter((r) => r.al === 2).map((r) => r.body.find((b) => b.kind === 'atR0').rule.M.C2), fe)} Ω₀(外縁 2・3 で違い、p・面密度に依らない)。同じ組の点の源の (源の運動だけ) の (C2) との比は ${rng(D.map((r) => r.body.find((b) => b.kind === 'atR0').rule.src.C2 / r.rule.src.C2), fe)} —— 同じ数にはならない。`;
  { const g = J.bg.rows, pick = (w, al) => g.filter((r) => r.what === w && r.al === al).map((r) => r.log10OverUV);
    F.bg = `一様な背景の倍率 1(= ω_G = ${fe(J.decl.gal.omegaG)} rad/s)に対して、(uV) の倍率は ${fe(J.bg.uv.uS)}(〔第351便e〕の lib で数え直し —— 宣言の値との相対の差 ${fe(J.bg.uv.relDecl)})。log10(abs ÷ (uV)): 表 1 の局所の回転 ${rng(g.filter((r) => r.what === 'omega').map((r) => r.log10OverUV), f2)}・表 2 の (M 型) rule (C2) K1 ${rng(pick('MruleC2', 1), f2)}・K2 ${rng(pick('MruleC2', 2), f2)}・(S 型-体) K1 ${rng(pick('bodyRuleC2', 1), f2)}・K2 ${rng(pick('bodyRuleC2', 2), f2)}(負は (uV) より小さい)。`; }
  { const t = J.torque; F.torque = `一様な上下の加速度・高さの 1 次の上下の加速度では、球でも扁平(0.9)でも重心のまわりのトルクは < 1e-12。潮汐の型(対称の勾配 H_xz = ${J.decl.tq.h})は球で < 1e-12・扁平で y 成分 ${fe(t[2].oblate[1])}(閉じた形 h (M_zz − M_xx) ${fe(t[2].closedY[1])})。勾配でない差(a_z = g x)は球でも ${fe(t[3].sphere[1])}。`; }
  return F;
}
