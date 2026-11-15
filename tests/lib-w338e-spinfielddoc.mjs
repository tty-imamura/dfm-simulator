// 第338便e(原仮定者の回答(2026-11-15 —— 第138報の回答 4)・統括の検証項目 R353): **正本 tests/out/spinfield-338e.json から PHYSICS〔第338便e〕の表を作る文書の lib**
// (QA docs.spinfield338e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの床で 0 と書いた値は「0」・恒等式の残差は「< 1e-x」の形で、数そのものは載せない)。
export const DOC_VERSION = 'w338e-spinfielddoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? '**超える**' : '超えない');
const KIND = Object.freeze({ planet: '惑星', moon: '衛星', starBinary: '恒星の連星', wdBinary: '白色矮星を含む連星', nsWd: '中性子星と白色矮星', nsNs: '二重中性子星' });
const FLD = Object.freeze({ none: '⑩ なし', rigid: '⑩(剛体)', pow1: 'R_d の外 (R_d/r)¹', pow2: 'R_d の外 (R_d/r)²', sphere: 'K1 の球の核の回転の項' });
const BN = Object.freeze({ mercury: '水星', earth: '地球', moon: '月', b1913: 'PSR B1913+16', j0737: 'PSR J0737−3039' });
const MODE = Object.freeze({ recv: '受け手だけ', both: '両方' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① rigid・k = 0 の 1 点の力と熱が第337便d の pairForces と同じ・none が自転 0 と同じ(傾けた自転・両方・列 7・3 点) | ${lt(S.rigidSame, 1e-12)} | ${tf(G.rigidSame)} |`,
    `| ② rigid・k = 0 の求積が第337便d の secularRates と同じ(傾けた自転・両方・L1・S0 —— ȧ・ė・ϖ̇・熱・場の口・ḣ) | ${lt(S.secularSame, 1e-12)} | ${tf(G.secularSame)} |`,
    `| ③ 場の型の時間の変化 dU と中心差分(rigid・pow1・pow2・sphere —— 差の桁の 10 の指数) | 1e${S.dUfd} | ${tf(G.dUfd)} |`,
    `| ④ sphere が第332便a の sphereRot と同じ・pow の型が R_d の内で剛体 | ${lt(S.sphere, 1e-12)} | ${tf(G.sphere)} |`,
    `| ⑤ L1 の ȧ が軸の角 θ の cos に線形(θ = 0・180 から 90・60 を引く —— v·u が s について線形) | ${lt(S.cosLinear, 1e-9)} | ${tf(G.cosLinear)} |`,
    `| ⑥ 公転面の内の場の速さの最大 = \\|s\\| cos θ r_遠点・面に垂直な分の最大 = \\|s\\| sin θ b(rigid) | ${lt(S.inPlane, 1e-9)} | ${tf(G.inPlane)} |`,
    `| ⑦ 詰まり具合のノブ: 円の軌道で率が (Ξ/Ξ_ref)^k 倍(k = 2) | ${lt(S.comp, 1e-12)} | ${tf(G.comp)} |`,
    `| ⑦′ 速い形 adotOfK が secularF の ȧ と同じ(両方・傾けた自転・pow2・k = 0・2.5) | ${lt(S.fastK, 1e-12)} | ${tf(G.fastK)} |`,
    `| ⑧ 帳簿(点ごとの F·v + Q̇ − F·U・傾けた自転・両方・場の型 4・列 7) | ${lt(S.ledger, 1e-12)} | ${tf(G.ledger)} |`,
    `| ⑨ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const R1 = J.t1.rows;
  T.sys = ['| 系 | 種類 | 読み | a [m] | e | Ξ/Ξ_ref | 源の自転 ÷ n | 赤道の速さ s R ÷ c | 場の速さ \\|U_s\\| の最大 ÷ c(⑩ 剛体) | \\|u\\| の最大 ÷ c(⑩ なし・⑩) | 場の速さの最大 ÷ c(R_d の外で落ちる型 3 つの最大) | 光速を超えるか(場の速度・剛体) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => `| ${r.name} | ${KIND[r.kind]} | ${MODE[r.mode]}${r.theta ? '・軸 ' + r.theta + '°' : ''} | ${fe(r.a)} | ${fe(r.e)} | ${fe(r.xiOverRef)} | ${fe(r.spinOverN)} | ${fe(r.equatorOverC)} | ${fe(r.fields.rigid.L1.usMaxOverC)} | ${fe(r.fields.none.L1.uMaxOverC)}・${fe(r.fields.rigid.L1.uMaxOverC)} | ${fe(r.flags.falloffMaxOverC)} | ${yn(r.flags.fieldSuperluminal)} |`)).join('\n');

  const jt = J.t1.joint;
  T.eff = [`| 系 | L1 の ȧ/a [1/年](⑩ なし・⑩) | L1 の比 ⑩ ÷ なし | S0 の ȧ/a [1/年](⑩ なし・⑩・K1 の球の核) | S0 の比 ⑩ ÷ なし | S0a の ϖ̇ [″/年](⑩ なし・⑩) | 観測の目安との比 S0(⑩ なし・⑩) |`, '|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => { const f = r.fields;
      return `| ${r.name} | ${fe(f.none.L1.atJoint.adotRelPerYr)}・${fe(f.rigid.L1.atJoint.adotRelPerYr)} | ${fe(r.flags.ratioL1)}${r.flags.l1SignFlip ? '(符号が反る)' : r.flags.l1ZeroRigid ? '(u = 0 —— 同期)' : ''} | ${fe(f.none.S0.atJoint.adotRelPerYr)}・${fe(f.rigid.S0.atJoint.adotRelPerYr)}・${fe(f.sphere.S0.atJoint.adotRelPerYr)} | ${fe(r.flags.ratioS0)} | ${fe(f.none.S0a.atJoint.wdotArcsecPerYr)}・${fe(f.rigid.S0a.atJoint.wdotArcsecPerYr)} | ${r.bound ? fe(f.none.S0.fracOfBound) + '・' + fe(f.rigid.S0.fracOfBound) : '—(目安なし)'} |`; })).join('\n')
    + `\n\n(ノブは T3 の k = 0・⑩ なしの合わせた上限: L1 の η = ${fe(jt.L1)} /s・S0 の ε = ${fe(jt.S0)}・S0a の ε = ${fe(jt.S0a)} —— 第337便d の合わせた上限と同じ値)`;

  const kinds = ['planet', 'moon', 'starBinary', 'wdBinary', 'nsWd', 'nsNs'];
  T.breaks = ['| 種類 | 系の数 | 場の速さ \\|U_s\\| の最大 ÷ c(⑩ 剛体 —— 最小〜最大) | 光速を超える系 | \\|u\\| > c の系 | ⑩ で L1 の ȧ の符号が反る系 | S0 の比 ⑩ ÷ なし(最小〜最大の大きさ) |', '|---|---|---|---|---|---|---|']
    .concat(kinds.map((k) => { const rr = R1.filter((r) => r.kind === k), us = rr.map((r) => r.fields.rigid.L1.usMaxOverC), s0 = rr.map((r) => r.flags.ratioS0).filter((x) => Number.isFinite(x)).map(Math.abs);
      const nm = (f) => rr.filter(f).map((r) => r.name).join('・') || 'なし';
      return `| ${KIND[k]} | ${rr.length} | ${fe(Math.min(...us))}〜${fe(Math.max(...us))} | ${nm((r) => r.flags.fieldSuperluminal)} | ${nm((r) => r.flags.relSuperluminal)} | ${rr.filter((r) => r.flags.l1SignFlip).length}/${rr.length} | ${s0.length ? fe(Math.min(...s0)) + '〜' + fe(Math.max(...s0)) : '—(円で 0)'} |`; })).join('\n');

  const sm = J.t2.summary, j37 = sm.find((s) => s.key === 'j0737');
  T.tilt = ['| 軸の角 θ | \\|U_s\\| の最大 ÷ c | 公転面の内の分の最大 ÷ c | 面に垂直な分の最大 ÷ c | \\|u\\| の最大 ÷ c | L1 の ȧ ÷ θ 0 | S0 の ȧ ÷ θ 0 | 面の傾きの率 \\|ḣ_⊥\\|/h(単位のノブ —— L1 [1/s ÷ (1/s)]・S0 [1/s]) |', '|---|---|---|---|---|---|---|---|']
    .concat(j37.byTheta.map((b) => `| ${b.theta}° | ${fe(b.usMaxOverC)} | ${fe(b.usInMaxOverC)} | ${fe(b.usPerpMaxOverC)} | ${fe(b.uMaxOverC)} | ${fe(b.L1ratio)} | ${fe(b.S0ratio)} | ${fe(b.L1tilt)}・${fe(b.S0tilt)} |`)).join('\n')
    + `\n\n(PSR J0737−3039・両方の天体の軸を同じ θ・射影の向き φ = 0°・⑩ 剛体。赤道の速さ s R ÷ c = ${fe(j37.equatorOverC)} は θ に依らない)`;

  const rows2 = J.t2.rows, z2 = (key, fld, th, ph) => rows2.find((r) => r.key === key && r.field === fld && r.theta === th && r.phi === ph);
  T.tiltAll = ['| 系 | 赤道の速さ ÷ c | \\|U_s\\| の最大 ÷ c(θ 0・90・180) | L1 の ȧ ÷ θ 0(θ 45・90・135) | S0 の ȧ ÷ θ 0(θ 45・90・135 —— φ 0°) | S0 の ȧ ÷ θ 0(θ 45・90・135 —— φ 90°) |', '|---|---|---|---|---|---|']
    .concat(sm.map((s) => { const b = (th) => s.byTheta.find((x) => x.theta === th), r0 = z2(s.key, 'rigid', 0, 90), q = (th) => (r0.cols.S0.adot !== 0 ? z2(s.key, 'rigid', th, 90).cols.S0.adot / r0.cols.S0.adot : null);
      return `| ${J.systems[s.key].name} | ${fe(s.equatorOverC)} | ${fe(b(0).usMaxOverC)}・${fe(b(90).usMaxOverC)}・${fe(b(180).usMaxOverC)} | ${fe(b(45).L1ratio)}・${fe(b(90).L1ratio)}・${fe(b(135).L1ratio)} | ${fe(b(45).S0ratio)}・${fe(b(90).S0ratio)}・${fe(b(135).S0ratio)} | ${fe(q(45))}・${fe(q(90))}・${fe(q(135))} |`; })).join('\n');

  T.falloff = ['| 系 | ⑩ 剛体の \\|U_s\\| の最大 ÷ c | (R_d/r)¹: \\|U_s\\|/c・L1 ÷ なし・S0 ÷ なし | (R_d/r)²: 同 | K1 の球の核の回転の項: 同 |', '|---|---|---|---|---|']
    .concat(sm.map((s) => { const f = (k) => s.falloff.find((x) => x.field === k), w = (k) => `${fe(f(k).usMaxOverC)}・${fe(f(k).L1overNone)}・${fe(f(k).S0overNone)}`;
      return `| ${J.systems[s.key].name} | ${fe(s.byTheta[0].usMaxOverC)} | ${w('pow1')} | ${w('pow2')} | ${w('sphere')} |`; })).join('\n')
    + '\n\n(θ = 0°・R_d = Y_k m は両方の天体の K1 の規則の引きずりの半径 —— 中性子星で 2.5e4 m の桁)';

  T.lit = ['| 系 | 参考の角(文献の値・未照合) | ⑩ 剛体: \\|U_s\\| の最大 ÷ c・L1 の ȧ ÷ θ 0・S0 の ȧ ÷ θ 0 | K1 の球の核の回転の項: \\|U_s\\| の最大 ÷ c |', '|---|---|---|---|']
    .concat(Object.entries(J.tiltLit).map(([key, v]) => { const r = z2(key, 'rigid', v.deg, 0), r0 = z2(key, 'rigid', 0, 0), sp = z2(key, 'sphere', v.deg, 0);
      return `| ${J.systems[key].name} | ${v.deg}°(${v.note} —— 未照合) | ${fe(r.cols.L1.usMaxOverC)}・${fe(r.cols.L1.adot / r0.cols.L1.adot)}・${fe(r.cols.S0.adot / r0.cols.S0.adot)} | ${fe(sp.cols.L1.usMaxOverC)} |`; })).join('\n');

  const g3 = J.t3.grid;
  T.k3 = ['| 列 | k | 合わせた上限 | 決める系 | 一番緩い系 | 広がり(5 系) | 水星 ÷ J0737 の上限の比 | 比が 0.1〜10 | 広がり ≤ 10 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(g3.map((r) => `| ${r.col} | ${r.k} | ${fe(r.joint)} | ${BN[r.binding]} | ${BN[r.loosest]} | ${fe(r.spread)} | ${fe(r.ratioMJ)} | ${tf(r.sameOrderMJ)} | ${tf(r.sameOrderAll)} |`)).join('\n');

  const starRow = (s) => { const a = s.atStar;
    return `| ${FLD[s.field]} | ${s.col} | ${s.roots.length ? s.roots.map((x) => x.toFixed(3)).join('・') : 'なし(k −8〜8)'} | ${s.bands.length ? s.bands.map((b) => b[0].toFixed(3) + '〜' + b[1].toFixed(3)).join('・') : 'なし'} | ${a ? fe(a.joint) + '・' + BN[a.binding] + '・' + BN[a.loosest] + '・' + fe(a.spread) : '—'} | ${a ? a.perSystem.map((p) => BN[p.key] + ' ' + fe(p.kMax)).join('・') : '—'} |`; };
  T.kstar = ['| 場の型 | 列 | k*(水星と J0737 の上限が等しい) | 比が 0.1〜10 の k の帯 | k* での合わせた上限・決める系・一番緩い系・広がり | k* での系ごとの上限 |', '|---|---|---|---|---|---|']
    .concat(J.t3.stars.map(starRow)).concat(J.t4.stars.map(starRow)).join('\n');

  T.k4 = ['| 場の型 | 列 | k | 合わせた上限 | 決める系 | 広がり(5 系) | 水星 ÷ J0737 の上限の比 |', '|---|---|---|---|---|---|---|']
    .concat(J.t4.grid.filter((r) => [0, 1, 2].includes(r.k)).map((r) => `| ${FLD[r.field]} | ${r.col} | ${r.k} | ${fe(r.joint)} | ${BN[r.binding]} | ${fe(r.spread)} | ${fe(r.ratioMJ)} |`)).join('\n');
  return T;
}
