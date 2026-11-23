// 第347便c(原仮定者の回答(2026-11-21 —— 第145報)AN904・統括の検証項目 R402): **正本 tests/out/selfclock-347c.json から PHYSICS〔第347便c〕の表を作る文書の lib**
// (QA docs.selfclock347c が節の表と逐語で照合する —— 値は有効数字 4 桁(0.001〜1e4 は小数 4 桁)・丸めで 0 と書いた値は「0」・放出が止まる所は「止まる」・届かない値は「—」)。
export const DOC_VERSION = 'w347c-selfclockdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const f4 = (x) => (x === null || x === undefined || !fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-3 || Math.abs(x) >= 1e4 ? Number(x).toExponential(3) : x.toFixed(4));
const fx = (x) => (x === null || x === undefined || !fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
export const typeName = (t) => ({ S0p: 'S0p 今の点の時計(対照)', S0s: 'S0s 今の表面の時計(対照)', S1: 'S1 自己が速度の基準に寄与', S2: 'S2 滑らかな床(n = 4)', S3L: 'S3L 線形の床(a₁ = 1)', S3Q: 'S3Q 2 乗の床(a₂ = 1)' })[t];
const shapeName = (s) => ({ S0p: 'S0p(止まる時計)', S1: 'S1 の形', S2: 'S2 の形(n = 4)', S3: 'S3 の形' })[s];
const thName = (t) => (t === 'eHalf' ? 'e^(−½) = 0.6065' : t === 0.5 ? '½' : String(t));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl;
  const bName = (id) => D.bodies.find((b) => b.id === id).name, eName = (id) => D.exts.find((e) => e.id === id).name;
  T.pure = ['| 零試験 | 値 | 門 |', '|---|---|---|',
    `| ① 自己 0 の極限(w = 0・φ = 0・ψ_self = 0 で今の点の時計と同じ —— x の 2001 点) | 差の最大 ${fx(S.self0)} | ${tf(G.self0)} |`,
    `| ② 遅い極限(x = 0 で 1・差 g ÷ G − 1 が x² で 0 へ —— x = 0.01 と 0.1 の差の比) | ${f4(S.qMin)}〜${f4(S.qMax)} | ${tf(G.slow)} |`,
    `| ③ 時計の進みが 0〜1 の内(x の 2001 点 × 床 6 × 形 6 と S0s の自己 4) | ${S.inRange ? 'はい' : 'いいえ'} | ${tf(G.range)} |`,
    `| ④ 単調(速いほど進みが小さいか同じ) | ${S.mono ? 'はい' : 'いいえ'} | ${tf(G.mono)} |`,
    `| ⑤ 局所光速の閉じた形(S1 √(w(2 − w))・S2 φ ÷(1 + φ^n)^(1/n)・S3 φ) | 相対の差の最大 ${fx(S.closed)} | ${tf(G.closed)} |`,
    `| ⑥ S0s は自己が正なら局所光速の手前 e^(−2ψ_self) で止まる | ${S.s0sStop ? 'はい' : 'いいえ'} | ${tf(G.s0sStop)} |`,
    `| ⑦ 丸め(重み 1e-35 でも局所光速の S1 は √(2w) —— 0 に落ちない) | 相対の差 ${fx(S.tiny)} | ${tf(G.tiny)} |`,
    `| ⑧ 入力の拒否(x > 1・x < 0・型が無い・床 > 1・n ≤ 0・ψ < 0) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1a = ['| 物 | 質量(kg)| 半径(m)| 半径 ÷ r_s | 自己の決定力 ψ_self(表面)| 重み w(' + D.exts.map((e) => e.name).join('・') + ')| S0s の止まる速さ e^(−2ψ_self) |', '|---|---|---|---|---|---|---|']
    .concat(J.t1.bodies.map((b, i) => `| ${bName(b.id)} | ${fx(b.m)} | ${fx(b.R)} | ${fx(b.ROverRs)} | ${fx(b.psiSelf)} | ${b.w.map(f4).join('・')} | ${f4(J.t1.stopS0s[i].xStop)} |`)).join('\n')
    + `\n\n(外の決定力: ${D.exts.map((e) => e.name + ' ψ_ext = ' + fx(e.psi)).join('・')}(太陽の近くは G₀M_☉ ÷(1 au × c₀²)・ほかは桁の型 —— 一様な背景 D₀ は入れない)。質量と半径は宣言の入力(標準の桁の値 —— この器では照合していない)。重みは物の半径で測る既定の宣言)`;

  T.t1b = ['| 物 | 外 | 重み w | ' + D.types.map(typeName).join(' | ') + ' |', '|---|---|---|' + D.types.map(() => '---|').join('')]
    .concat(J.t1.atC.map((r) => `| ${bName(r.body)} | ${eName(r.ext)} | ${f4(r.w)} | ${r.g.map(fx).join(' | ')} |`)).join('\n')
    + '\n\n(局所光速 x = 1 での時計の進み ÷ 静止の点の時計 N = e^(−ψ_ext)。S0p・S0s は 0(止まる)。S3L・S3Q は外の決定力に依らない。S2 は重み 1 の物で 2^(−1/4) = 0.8409)';

  T.t1c = ['| 物(外は銀河の中)| 型 | ' + D.xGrid.map((x) => 'x = ' + x).join(' | ') + ' |', '|---|---|' + D.xGrid.map(() => '---|').join('')]
    .concat(J.t1.speeds.map((r) => `| ${bName(r.body)} | ${typeName(r.type)} | ${r.g.map(f4).join(' | ')} |`)).join('\n')
    + '\n\n(時計の進み ÷ 静止の点の時計。S0s の x = 0 の値は表面の静止の時計 e^(−ψ_self)(静止の点の時計に対する比))';

  const I = J.ion, i1 = I.rows[0], i2 = I.rows[1];
  T.ion = ['| 型 | ノブ | 報告の値 + 1σ の内(ε ≤ ' + fx(i1.up) + ')| 報告の値 + 2σ の内(ε ≤ ' + fx(i2.up) + ')|', '|---|---|---|---|',
    `| S1 | 重み w の上の限り | ${fx(i1.S1.wMax)} | ${fx(i2.S1.wMax)} |`,
    `| S1 | 局所光速の時計 √(w(2 − w)) の上の限り | ${fx(i1.S1.phiMax)} | ${fx(i2.S1.phiMax)} |`]
    .concat(i1.S2.map((q, j) => `| S2(n = ${q.n}) | 床 φ の上の限り(重み w に直すと) | ${fx(q.phiMax)}(${fx(q.wMax)}) | ${fx(i2.S2[j].phiMax)}(${fx(i2.S2[j].wMax)}) |`))
    .concat([`| S3L・S3Q | 局所光速の時計 φ の上の限り | ${fx(i1.S3.phiMax)} | ${fx(i2.S3.phiMax)} |`,
      `| S0s(対照) | 自己 ψ_self の上の限り(ε ≥ 報告の値 − kσ —— 止まりが早まる側) | ${fx(i1.S0s.psiMax)} | ${fx(i2.S0s.psiMax)} |`]).join('\n')
    + `\n\n(x = ${I.x}。ε の見込みは〔第344便c〕の作り方 g ÷ √(1 − x²) − 1(比べる仮定もそのまま —— 静止の時計の因子は比で消える)。報告の値 (${fx(I.epsRep)} ± ${fx(I.epsSig)})は文献の値・未照合 —— 採用・棄却に使わない。床の型は ε ≥ 0 なので上の限りだけが効く)`;

  const C = I.conv;
  T.ionLi = ['| 置き直し(リチウムのイオン)| 値 |', '|---|---|',
    `| 自己の決定力(核の半径の桁 2.4e-15 m で)| ${fx(C.psiNuc)} |`,
    `| 自己の決定力(イオン半径の桁 ${fx(D.liIonicR)} m で)| ${fx(C.psiIon)} |`]
    .concat(C.wNow.map((q) => `| S1 の今の宣言の重み(${eName(q.ext)})と ε の見込み | ${fx(q.w)}・${fx(q.eps)} |`))
    .concat(C.rwMin.map((q) => `| S1 の測る半径 r_w の下の限り(${eName(q.ext)}・1σ)| ${fx(q.rwMin)} m |`))
    .concat([`| S3L の係数 a₁ の上の限り(核の半径・イオン半径)| ${fx(C.a1Max)}・${fx(C.a1MaxIonic)} |`, `| S3Q の係数 a₂ の上の限り(核の半径・イオン半径)| ${fx(C.a2Max)}・${fx(C.a2MaxIonic)} |`]).join('\n')
    + `\n\n(核の半径の桁で測ったイオンの自己の決定力は、外の決定力の 3 点の最も小さい値より ${Math.floor(Math.log10(Math.min(...D.exts.map((e) => e.psi)) / C.psiNuc))} 桁以上小さい —— S1・S2 は既定のノブでは ε の見込みが丸めで 0 になる。ノブの上の限りは、この測定(未照合)が型の形をほとんど縛らないことの数)`;

  const ext2 = (e) => (e === null ? '(依らない)' : eName(e));
  const formula = (r) => ({ R1: 'r ÷ r_s = 1 ÷(2ψ_ext)', S1: 'r ÷ r_s = (1 − w*) ÷(2ψ_ext w*)・w* = 1 − √(1 − θ²)', S2: 'S1 と同じ式・w* = 1 − √(1 − φ*²)・φ* = θ ÷(1 − θ⁴)^(1/4)', S3L: 'r ÷ r_s = a₁ ÷(2θ)', S3Q: 'r ÷ r_s = √(a₂ ÷ θ) ÷ 2' })[r.def === 'R1' ? 'R1' : r.type];
  T.t2 = ['| 定義 | 型 | 外 | しきい値 θ | r ÷ r_s | 解析の式 | どちらが外側か |', '|---|---|---|---|---|---|---|']
    .concat(J.t2.rows.map((r) => `| ${r.def} | ${r.type} | ${ext2(r.ext)} | ${r.theta === null ? '—(w = ½)' : thName(r.theta)} | ${f4(r.ratio)} | ${formula(r)} | ${r.ratio === null ? '—' : r.ratio > 1 + 1e-12 ? 'r_s の外' : r.ratio < 1 - 1e-12 ? 'r_s の内' : 'r_s と同じ(宣言の帰結)'} |`)).join('\n')
    + '\n\n(R1 = 自己の決定力が外の決定力を上回る半径/R2 = 局所光速での時計の進みがしきい値 θ に届く半径。ψ_self(r) = (r_s ÷ r) ÷ 2 なので、どの定義も比 r ÷ r_s は質量に依らない(重みを物の半径で測る既定の宣言で)。S1・S2 は外の決定力に反比例・S3 は外に依らない。S3L の θ = ½ で r = r_s になるのは a₁ = 1 と ψ(r_s) = ½ の置き方の帰結 —— 物理から出てきた長さとは書かない)';

  T.t2r3 = ['| 型 | 自然に出る長さ | r ÷ r_s | 解析の式 |', '|---|---|---|---|']
    .concat(J.t2.r3.map((r) => `| ${r.type} | ${r.what}${r.note ? '(' + r.note + ')' : ''} | ${f4(r.ratio)} | ${r.type === 'S0s' ? 'ψ_self = ½ → r = r_s' : r.type === 'S3L' ? 'r ÷ r_s = a₁ ÷ 2' : 'r ÷ r_s = √a₂ ÷ 2'} |`))
    .concat(['| S1・S2 | 重み ½ の半径(= R1) | 表の R1 の行 | r ÷ r_s = 1 ÷(2ψ_ext) |']).join('\n')
    + `\n\n(DFM の静止の時計は r_s で e^(−ψ_self) = ${f4(J.t2.rsLine.clockAtRs)}(ψ_self = ½ —— X_k = G₀/c₀² の置き方)。参考の値 0.6065 は、この静止の時計の値)`;

  T.t2phys = ['| 質量(太陽質量の倍)| r_s(m)| R1 の半径(m —— ' + D.exts.map((e) => e.name).join('・') + ') |', '|---|---|---|']
    .concat(J.t2.phys.map((r) => `| ${fx(r.mMsun)} | ${fx(r.rs)} | ${r.r1.map(fx).join('・')} |`)).join('\n')
    + `\n\n(半径は質量に比例。重みを物の半径でなく決めた長さ r_w で測る宣言にすると質量に依る —— r_w = 1 m で重み ½ に届く質量: ${J.t2.fixedRw.map((q) => eName(q.ext) + ' ' + fx(q.mHalf) + ' kg').join('・')})`;

  const pts = J.t3.pts, jl = (r) => (r.shape === 'S0p' ? shapeName('S0p') : shapeName(r.shape) + '・φ = ' + fx(r.phi));
  const keyRows = (f) => { const keys = []; for (const r of J.t3.jet) { const k = r.shape + '|' + r.phi; if (!keys.includes(k)) keys.push(k); } return keys.map((k) => J.t3.jet.filter((r) => r.shape + '|' + r.phi === k)).map(f); };
  const ptH = pts.map((p) => (p.label.startsWith('Γ') ? '標準の読みの Γ = ' + p.label.slice(1) + '(x = ' + (p.x < 0.9999 ? p.x.toFixed(6) : '1 − ' + fx(p.omx)) + ')' : 'x = ' + p.label)).join(' | ');
  T.t3arrive = ['| 床の形・床 φ | ' + ptH + ' |', '|---|' + pts.map(() => '---|').join('')]
    .concat(keyRows((rs) => `| ${jl(rs[0])} | ${rs.map((r) => (r.halt ? '止まる' : f4(r.arrive))).join(' | ')} |`)).join('\n')
    + '\n\n(噴き出す塊が観測者へ向かう場面: 到着の時刻の幅 ÷ 固有の時間幅 = (1 − x)÷ g。外の決定力は放出と観測で同じ(N は比で消える)。光の伝わりは今のまま。「止まる」= 局所光速で時計が止まり、固有の時間が進まない(放出が止まる —— 絶対時間の幅は無限・詰まりは 0 で、比は定義されない)。床のある型の x = 1 は 0(続けて出た光が同時に着く))';
  T.t3stretch = ['| 床の形・床 φ | ' + ptH + ' |', '|---|' + pts.map(() => '---|').join('')]
    .concat(keyRows((rs) => `| ${jl(rs[0])} | ${rs.map((r) => (r.halt ? '∞(止まる)' : f4(r.stretch))).join(' | ')} |`)).join('\n')
    + '\n\n(放出の絶対時間の幅 ÷ 固有の時間幅 = 1 ÷ g。S0p は局所光速で発散 —— 床のある型は 1 ÷ φ の桁で有限)';
  const pi = pts.findIndex((p) => p.label === 'Γ100');
  T.t3width = ['| 床の形・床 φ | 到着の幅(固有の幅 1 s)| 到着の幅(固有の幅 1 ms)|', '|---|---|---|']
    .concat(keyRows((rs) => { const r = rs[pi]; return `| ${jl(r)} | ${fx(r.arrive * J.t3.dtauS[0])} s | ${fx(r.arrive * J.t3.dtauS[1])} s |`; })).join('\n')
    + '\n\n(標準の読みの Γ = 100 の点。ほかの速さの幅は到着の比 × 固有の幅)';

  const fk = []; for (const r of J.t3.fall) { const k = r.shape + '|' + (r.phi !== undefined ? r.phi : 's' + r.psiSelf); if (!fk.includes(k)) fk.push(k); }
  const fName = (k) => { const [s, v] = k.split('|'); return s === 'S0p' ? 'S0p(止まる時計)' : s === 'S0s' ? 'S0s(塊の自己 ψ_self = ' + v.slice(1) + ')' : shapeName(s) + '・φ = ' + fx(Number(v)); };
  const fRows = (key) => { const out = []; for (const psiC of D.psiC) for (const x of D.xFall) out.push({ psiC, x, cells: fk.map((k) => J.t3.fall.find((r) => r.psiC === psiC && r.x === x && (r.shape + '|' + (r.phi !== undefined ? r.phi : 's' + r.psiSelf)) === k)) }); return out.map((q) => `| ${f4(q.psiC)}(r = ${f4(0.5 / q.psiC)} r_s) | ${q.x} | ${q.cells.map((c) => (c.halt ? (key === 'away' ? '∞(止まる)' : '止まる') : f4(c[key]))).join(' | ')} |`); };
  const fH = ['| 中心の天体の決定力 ψ_c | 落ち込む速さ x | ' + fk.map(fName).join(' | ') + ' |', '|---|---|' + fk.map(() => '---|').join('')];
  T.t3fallAway = fH.concat(fRows('away')).join('\n')
    + '\n\n(落ち込む物質が観測者から遠ざかる向き: 到着の幅 ÷ 固有の幅 = (1 + x)÷(e^(−ψ_c) g)・遠くの静止の観測者 N_obs = 1。x は放出する場所の局所光速に対する速さ。S0p は x = 1 で発散・S0s は止まる速さ e^(−2ψ_self) から先で止まる・床のある型は有限)';
  T.t3fallToward = fH.concat(fRows('toward')).join('\n')
    + '\n\n(観測者へ向かう向き: (1 − x)÷(e^(−ψ_c) g)。床のある型の x = 1 は 0)';

  T.src = ['| 比べる列(採用・棄却に使わない)|', '|---|'].concat(J.t3.src.map((s) => `| ${s} |`)).join('\n');
  return T;
}
