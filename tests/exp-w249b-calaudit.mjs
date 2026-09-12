// 第249便b W2「現実較正サンプルの棚卸し」(第41報「現実較正分類の各サンプルについて、観測版も DFM 版も
//   同様に、合っているのか、合っていないなら何がどの程度合わないのか、合わない度合いに相関する観測値は
//   どれか、を調査する」)。
//
// **エンジンの物理は 1 bit も読み書きしない**。内蔵プリセットをそのまま build して測るだけである。
//
// ■ 何をするか
//   1) `HP.allPresets()` の `sampleClass:"calibration"` 全 31 本を列挙する。
//   2) 各サンプルの**観測参照を機械的に取り出す**: obsCard の `obs` 欄(と `model` 欄)を数値パーサに
//      通し、claims の `expected` 窓を併せて読む。手で数値を打ち直さない。
//   3) 同じ検出器で実測する:
//        ・公転周期 **2 定義** — 近点間(検出器 A=ṙ の −→+ 交差 / B=距離極小の放物線頂点)と
//          **同方向 1 周**(相対角の 2π 交差)。外部レビュー の「周期の定義が残差の符号まで変える」の
//          機械確認。
//        ・離心率 e(半径比 proxy (r_max−r_min)/(r_max+r_min))。
//        ・近点移動 °/周(検出器 A/B の 2 方式・直線 fit の残差も出す)。
//        ・接触要素(osculating)の a と P — 1 公転が予算に収まらない衛星はこちらで出す
//          (💠 の obsCard が「転写診断」で使っているのと同じ規約)。
//        ・自転(殻 spin)とコア Ω の保持、環/衛星の周期。
//   4) 判定を **5 区分**(合/窓/否/従/転)で付ける。観測誤差が読めた量は誤差で機械判定し、
//      無い量は **±1% を「目安」**として使う(一律の百分率を確定基準にはしない — 出力に明記する)。
//   5) 相関量(ν・χ・GM/(ac²)・a/R・e・Ω_spin/n)を t=0 の宣言から算出し、残差との
//      **Spearman 順位相関**を DFM 版だけで取る(少数サンプル — 相関≠原因)。
//
// ■ 走行長(すべて出力 JSON に記録する)
//   dt は**アプリ既定の 0.016**(index.html の const DT)と、その半分 0.008 の 2 段。
//   dt/2 段は軽いサンプル(実行時 n≤12)だけに絞る(重い環・多体は時間予算に収まらないため — 明記)。
//   1 サンプルあたりの步数は「実測した步/秒 × 時間予算」で決め、上限 60 公転。
//   1 公転が予算に収まらない対象は接触要素だけを出し、`method:"osculating"` と記録する。
//
// 実行: node tests/exp-w249b-calaudit.mjs [--fast] [--only id1,id2] [--budget 80] [--dt3] [--merge]
//       --budget … 1 段あたりの**計算時間**の予算(秒・既定 80 — 第257便d で 30 から上げた)。
//                  重いサンプルは ×3。精度条件ではない(窓が埋まらなければ「未測定」のまま)。
//       --fast   … dt/2 段を全部省く
//       --only   … サンプルを絞る(デバッグ用)
//       --dt3    … 第255便d(第47報 N8): **dt/4 段を足して 3 段にする**。3 段が揃うと ε_num の定義が
//                  |Q_h−Q_{h/2}|(感度診断)から **|Q_h−Q_{h/4}|** へ変わり、観測次数
//                  p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| が `numBoundDecl.order` に入る。
//                  第253便b の保留条件(3 段+正の次数)を満たした量だけが「数値未解決」から出る。
//                  時間予算が 3 倍以上になるので、`--only` で系を絞って `--merge` するのが標準。
// 出力: tests/out/calaudit-w249.json(QA `docs.calaudit-sync` が id 集合と verdict 語彙を照合する)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 第258便d(第50報 W4): 条件不一致の隔離・証拠付き予測・ε_num の推定誤差・deg/yr の門は
// **純関数**として tests/lib-w258d-evidence.mjs に置き、QA が同じ 1 本を読む。
import { GATE, VERDICT_CONDITION, VERDICTS6, YEAR_SEC, enforceAllConditions,
  predictionEligible, refinedNumBound, degPerYear, assessDegYearGate } from './lib-w258d-evidence.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const MERGE = argv.includes('--merge');   // --only で一部だけ回して既存 JSON へ差し替える(再判定用)
const ONLY = (() => { const i = argv.indexOf('--only'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();
const DT3 = argv.includes('--dt3');       // 第255便d(N8): dt/4 段を足して 3 段+観測次数を出す
// 第258便d(第50報 W4): **h8 検査点**。--dt8 id1,id2 で指定した系にだけ dt/8=0.002 の 4 段目を足す。
// 目的は 2 つ: (a) 3 段で出した観測次数 p_obs が h をもう 1 段細かくしても同じか(漸近域に居るか)、
// (b) |Q_h−Q_{h/4}|/(1−4^−p) という**推定誤差**が、実際に測った |Q_{h/2}−Q_{h/8}| と整合するか。
// **予算の都合で 1 系だけ走らせる**(⚡)。走らせていない系は「未走行」と書く(推定で埋めない)。
const DT8 = (() => { const i = argv.indexOf('--dt8');
  return (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[i + 1].split(',') : null; })();
// 第257便d(第49報・3 審査 v15 一致): **dt/4 段の時間予算の既定を 30 s → 80 s にする**。
// これは**計算時間の予算**であって精度条件の緩和ではない —— 第256便d は 🧶 の dt/4 を
// `--budget 80` で走らせないと 20 近点窓が埋まらず(予算 30 s では 15 公転で切れて 2 段に落ちた)、
// 「窓が埋まらない」が既定値の副作用として現れていた。予算・dt・近点数は**別の欄**でログし
// (timeBudget)、窓が埋まらずに終わった行は `unmeasuredReason:"time-budget"` を立てる
// (= **機種依存の時間で結果が変わった**ことを、数値の性質と混ぜずに記録する)。
const BUDGET_DEFAULT = 80;
const BUDGET_LIGHT = (() => { const i = argv.indexOf('--budget'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : BUDGET_DEFAULT; })();
const BUDGET_HEAVY = BUDGET_LIGHT * 3;
const ORB_MAX = 60;            // 直接法(近点間・同方向1周)で数える上限公転数
// 第252便b(第44報): **近点間周期の窓は「最初の 20 近点(19 区間)」に固定**する(宣言であって
// 自動判定ではない)。走行長で窓が変わっていたのが第251便 統括の残した窓感度 0.66pt の源である。
// 第253便b(第45報 L6): **窓感度そのものは未計測のままである** —— 窓を 20・30・40 近点と振って
// 値がどう動くかは測っていない。窓は**全系で 20 近点に固定**したので系間の比較は揃うが、
// 「20 が十分な長さか」は本便でも確かめていない(未計測を未計測と書く)。
const PERI_WINDOW = 20;
const DT0 = 0.016;             // アプリ既定(index.html の const DT)

// ---------------------------------------------------------------- サンプル別の対象宣言
// 中心と周回体は**プリセットの宣言 body index**(ring は count 個へ展開されるので、走行前に
// 宣言 index → 実行 index の対応表を機械的に作る)。ラベルは obsCard の q 欄との突き合わせに使う。
const CFG = {
  earthMoonReal:      { c: 0, o: [[1, '月']] },
  earthMoonRealKF1:   { c: 0, o: [[1, '月']] },
  emAuditNewton:      { c: 0, o: [[1, '月']] },
  emAuditDFM:         { c: 0, o: [[1, '月']] },
  emAuditSolar:       { c: 1, o: [[2, '月']] },
  qLockRadialAudit:   { c: 0, o: [[1, '最内'], [8, '参照点']] },
  qLockRadialAuditQ3: { c: 0, o: [[1, '最内'], [8, '参照点']] },
  mercuryReal:        { c: 0, o: [[1, '水星']] },
  mercuryRealKF1:     { c: 0, o: [[1, '水星']] },
  solarInner:         { c: 0, o: [[1, '水星'], [2, '金星'], [3, '地球'], [4, '火星']] },
  jupiterGalilean:    { c: 0, o: [[1, 'イオ'], [2, 'エウロパ'], [3, 'ガニメデ'], [4, 'カリスト']] },
  venusReal:          { c: 0, o: [[1, '金星']] },
  marsMoonsReal:      { c: 0, o: [[1, 'フォボス'], [2, 'ダイモス']] },
  plutoCharonReal:    { c: 0, o: [[1, 'カロン']] },
  uranusReal:         { c: 0, o: [[1, 'ミランダ'], [2, 'アリエル'], [3, 'ウンブリエル'], [4, 'チタニア'], [5, 'オベロン']] },
  neptuneReal:        { c: 0, o: [[1, 'トリトン']] },
  alphaCenAB:         { c: 0, o: [[1, 'B']] },
  alphaCenABDFM:      { c: 0, o: [[1, 'B']] },
  siriusAB:           { c: 0, o: [[1, 'B']] },
  siriusABDFM:        { c: 0, o: [[1, 'B']] },
  psrDoubleAB:        { c: 0, o: [[1, 'B']] },
  psrDoubleABDFM:     { c: 0, o: [[1, 'B']] },
  psrDoubleABSpinCal: { c: 0, o: [[1, 'B']] },
  psrJ1757DFM:        { c: 0, o: [[1, 'B']] },
  psrJ1946DFM:        { c: 0, o: [[1, 'B']] },
  // 第249便a の λ_PN=1/f variant(⚡🧮🩺 と同じ器で測る — 近点移動は候補の応答そのものなので「従」にしない)
  psrDoubleABPN:      { c: 0, o: [[1, 'B']] },
  psrJ1757PN:         { c: 0, o: [[1, 'B']] },
  psrJ1946PN:         { c: 0, o: [[1, 'B']] },
  // 第251便a の compactForce variant(案K)と第 4 の凍結 hold-out PSR B1534+12(観測/DFM/CF の 3 版)
  psrDoubleABCF:      { c: 0, o: [[1, 'B']] },
  psrJ1757CF:         { c: 0, o: [[1, 'B']] },
  psrJ1946CF:         { c: 0, o: [[1, 'B']] },
  psrB1534:           { c: 0, o: [[1, 'B']] },
  psrB1534DFM:        { c: 0, o: [[1, 'B']] },
  psrB1534CF:         { c: 0, o: [[1, 'B']] },
  gw150914:           { c: 0, o: [[1, 'B']] },
  gw150914DFM:        { c: 0, o: [[1, 'B']] },
  gw150914Merge4s:    { c: 0, o: [[1, 'B']], orbMax: 3, note: '合体サンプル(外部放射オーバーレイ)— 3 公転で打ち切る' },
  saturnZonalD68:     { c: 0, o: [[1, 'D68']] },
  saturnRingReal:     { c: 0, o: [[4, 'ミマス'], [9, 'タイタン']], ringInner: 'C環内縁' },
  saturnRingRealKF1:  { c: 0, o: [[4, 'ミマス'], [9, 'タイタン']], ringInner: 'C環内縁' },
};

// 理論対照(観測較正ではない — preset 側の referenceKind 宣言と同じ集合)
const THEORY_CONTROL = ['qLockRadialAudit', 'qLockRadialAuditQ3', 'emAuditNewton'];
// 較正の従属量(第248便b の現行判定): NS 連星 DFM 版の近点移動は較正質量 f≈2 の帰結であって独立予言ではない
const DEPENDENT = { psrDoubleABDFM: ['precession'], psrJ1757DFM: ['precession'], psrJ1946DFM: ['precession'],
  psrB1534DFM: ['precession'] };   // 第251便a: 第 4 の凍結 hold-out の DFM 版も同じ構造(較正質量 f≈2 が 1PN へ入る)

// ---------------------------------------------------------------- 第251便c(第43報 W3・ChatGPT §8.1)
// **周期の定義契約**(裁定 I6 の次段)。パルサータイミングの離心連星では、観測の P_b は
// **近点間の平均周期**として定義されている。棚卸しの検出器はこれまで「同方向1周」を優先し、
// 取れなければ接触要素へ落としていたが、**大きく歳差する軌道では両者が数 % 違う**ので、
// 定義の取り違えがそのまま系統誤差になる(🪐 D68 で 2.0% — 第250便c の近点移動換算で判明済み)。
// そこで、**明示した ID の離心タイミング連星に限り**判定を近点間周期へ固定する:
//   ① 判定量は近点間周期(検出器A)。同方向1周は別欄に残す(residualPctRev)。
//   ② dt/2 段の ε_num も**同じ定義**で作る(rawMeas 側も近点間)。
//   ③ 検出器 A/B は**同じ近点間周期どうし**で比べる(detPairSec)。
//   ④ 近点が測れない対象は**他の周期へ黙って置換しない** — 「未測定」を返す(meas=null → 転)。
// **視覚連星・円軌道・惑星/衛星系は従来どおり**(同方向1周 → 接触要素)。ID は明示列挙であって
// 自動判定ではない(「離心率がいくつ以上」のような閾値は置かない — 定義は宣言である)。
const ECC_TIMING_BINARY = new Set([
  'psrDoubleAB', 'psrDoubleABDFM', 'psrDoubleABSpinCal', 'psrDoubleABPN',   // 📻⚡🧿🪶 J0737−3039A/B
  'psrJ1757DFM', 'psrJ1757PN',                                             // 🧮🪃 J1757−1854
  'psrJ1946DFM', 'psrJ1946PN',                                             // 🩺🪀 J1946+2052
  // PSR B1534+12 系(第251便c 時点では**プリセットが無い** — CSV に観測行だけがある)。
  // 将来サンプルを起こしたときに定義契約が自動で効くよう、ID を先に置いておく。
  'psrB1534', 'psrB1534DFM', 'psrB1534PN',
  // 第252便(統括): 第251便a の案K variant(CF)を追加 — 同じ系の DFM 版が近点間判定なのに CF 版だけ
  // 同方向 1 周で判定していた不整合(第252便b の指摘)を解消する。定義契約は同じ(宣言列挙・自動判定なし)。
  'psrDoubleABCF', 'psrJ1757CF', 'psrJ1946CF', 'psrB1534CF',
]);

// ---------------------------------------------------------------- 第251便c(第43報 W3・ChatGPT §8.1)
// **観測 σ の転写**。paper/data/solar-observations.csv に本便で足した **sigma 列**(末尾列 —
// 既存 8 列の並びは 1 バイトも動かしていないので、cols[0..7] で読む既存の器はそのまま動く)から
// 観測誤差を読み、obsCard の文面に ± が書かれていない量へ充填する。**CSV が正本**で、この検証器
// には観測数値を 1 つも書かない(手打ちの数字を増やさない)。同じ量に複数の版レコードがある系
// (J1757/J1946 の 2026 年版)は**最初の行**だけを採る — プリセットが使っているのがその行だから。
// sigma_primary=verified/unverified は CSV の note に書いてある機械可読な印で、門の sourceVerified
// (一次表の照合が済んでいるか)へそのまま渡す。
function loadSigmaTable() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;                       // **最初の行**を採る(別版レコードは混ぜない)
    const sg = (cols[8] !== undefined && cols[8].trim() !== '') ? Number(cols[8]) : null;
    m.set(key, { body: cols[0], quantity: cols[1], value: Number(cols[2]), unit: cols[3],
      source: cols[4], sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      primaryVerified: /sigma_primary=verified/.test(cols[7] || '') });
  }
  return m;
}
const SIGMA_TABLE = (() => { try { return loadSigmaTable(); }
  catch (e) { console.error('[w249b] sigma 表が読めない: ' + String(e).slice(0, 140)); return new Map(); } })();
// preset id → CSV の body 名(**相対軌道の要素を持つ行** = 伴星側の行)
const SIGMA_BODY = {
  psrDoubleAB: 'PSR J0737-3039 B', psrDoubleABDFM: 'PSR J0737-3039 B',
  psrDoubleABSpinCal: 'PSR J0737-3039 B', psrDoubleABPN: 'PSR J0737-3039 B',
  psrJ1757DFM: 'PSR J1757-1854', psrJ1757PN: 'PSR J1757-1854',
  psrJ1946DFM: 'PSR J1946+2052', psrJ1946PN: 'PSR J1946+2052',
  alphaCenAB: 'Alpha Centauri B', alphaCenABDFM: 'Alpha Centauri B',
  siriusAB: 'Sirius B', siriusABDFM: 'Sirius B',
  // 第256便d(第48報): **🧶 B1534+12 の 3 本を足した**。σ は第251便c で CSV に入っていたのに、
  // この対応表に行が無いせいで門からは「σ 無し」に見えていた(第255便d ⑤ の表の「—」の正体)。
  // 値そのものは 1 つも動かない —— 読める σ を読むようにしただけである。
  psrB1534: 'PSR B1534+12', psrB1534DFM: 'PSR B1534+12', psrB1534CF: 'PSR B1534+12',
  // 第256便d: ⚡ の ω̇ 行(periastron_advance)が CSV へ入ったので、近点移動にも σ が付く
  // (第251便c ⑥′ が保留していた行 —— 保留の理由だった 📻 の経路等価は QA 側で解いた)。
};
const SIGMA_QUANT = { period: 'orbital_period', ecc: 'eccentricity', precession: 'periastron_advance' };

// ---------------------------------------------------------------- 第257便d(第49報・3 審査 v15)
// **観測量対応の宣言表**(自動判定ではない — 宣言である)。
// 門の `mappingResolved` は「**シミュレータが測っている量**と、**CSV/obsCard の観測が指す量**が
// 同じ測定量か」だけを見る。合わないことの弁解ではなく、**定義の違う 2 量の差を棄却 σ として
// 読まないため**の欄である。ここに載らない kind は「対応は確定」として扱う。
//   ・**ecc(全行)**: 判定に使っているのは 1 周目の**距離の極値**から作る比
//     (r_max−r_min)/(r_max+r_min) = `eProxy` である。観測側は
//       - タイミング連星 … DD/DDGR の**時間離心率 e_T**(タイミングモデルのパラメータ)
//       - 視覚連星 … астrometric な軌道 fit の**ケプラー要素 e**
//     いずれも「1 周の距離の極値の比」ではない(歳差・PN・有限窓の下では別物になる)。
//     **どちらが正しいかではなく、対応が未確定である**。棄却 σ を読むにはこの写像が要る。
// 以下は「対応は確定している」と宣言した量(理由も併記する):
//   ・period(離心タイミング連星) … 近点間周期 ⇄ 観測の P_b(近点間の平均周期)。第251便c の定義契約。
//   ・period(視覚連星) … 同方向 1 周 ⇄ 軌道 fit の公転周期。
//   ・precession … 近点方位の直線 fit の傾き [°/周] ⇄ ω̇ [deg/yr] を**同じ近点間周期**で換算した値。
const MAPPING_UNRESOLVED = (kind, id) => {
  if (kind !== 'ecc') return null;
  return ECC_TIMING_BINARY.has(id)
    ? 'タイミング解の e_T(時間離心率)と、距離の極値から作る eProxy は同じ測定量ではない'
    : '軌道 fit のケプラー要素 e と、距離の極値から作る eProxy は同じ測定量ではない';
};

// ---------------------------------------------------------------- 単位(観測欄の数値を秒へ)
const SEC = { '日': 86400, 'd': 86400, '年': 3.15576e7, 'yr': 3.15576e7, '時間': 3600, 'h': 3600,
  '秒': 1, 's': 1, 'ms': 1e-3 };
const UNIT_RE = /^(日|年|時間|ms|s|d|h|yr|秒)/;

// 「数値+誤差+単位」を機械的に取り出す。"a / b / c 単位" の並びは 1 組として返し、
// 単位を持つ最初の組を優先する(「2周目 8819.36 秒」から 8819.36 秒 を取るため)。
function normNum(str) {
  const sup = { '\u2070': '0', '\u00b9': '1', '\u00b2': '2', '\u00b3': '3', '\u2074': '4',
    '\u2075': '5', '\u2076': '6', '\u2077': '7', '\u2078': '8', '\u2079': '9' };
  return String(str).replace(/\uff0c/g, ',').replace(/\u2212/g, '-')
    .replace(/\u00d710\u207b/g, 'e-').replace(/\u00d710/g, 'e')
    .replace(/[\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079]/g, (ch) => sup[ch]);
}
const NUM_RE = /([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*(?:\u00b1\s*(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?))?/g;
function scanNums(str) {
  const t = normNum(str), ms = []; NUM_RE.lastIndex = 0;
  let m;
  while ((m = NUM_RE.exec(t)) !== null && ms.length < 16) {
    const v = Number(m[1]); if (!Number.isFinite(v)) continue;
    const end = m.index + m[0].length;
    const rest = t.slice(end).replace(/^[)\uff09\s]*/, '');
    const um = rest.match(UNIT_RE);
    // 「\u00b0/\u5468」等の率は parseRate の担当なので単位として拾わない
    const isRate = /^\s*[\u00b0\u2033]|^\s*rad\s*\//.test(t.slice(end));
    ms.push({ v, err: m[2] !== undefined ? Number(m[2]) : null,
      unit: (um && !isRate) ? um[1] : null, idx: m.index, end });
  }
  return { t, ms };
}
function parseObs(str) {
  if (typeof str !== 'string') return null;
  const { t, ms } = scanNums(str);
  if (!ms.length) return null;
  const groups = []; let cur = [ms[0]];
  for (let i = 1; i < ms.length; i++) {
    if (/^\s*\/\s*$/.test(t.slice(ms[i - 1].end, ms[i].idx))) cur.push(ms[i]);
    else { groups.push(cur); cur = [ms[i]]; }
  }
  groups.push(cur);
  const g = groups.find((gr) => gr.some((x) => x.unit)) || groups[0];
  const u = (g.find((x) => x.unit) || {}).unit || null;
  return g.map((x) => ({ v: x.v, err: x.err, unit: x.unit || u }));
}
// 単位つきの数値を**全部**返す(自転の照合など、並記された複数の観測値から選ぶ用)
function parseAllUnits(str) {
  if (typeof str !== 'string') return [];
  return scanNums(str).ms.filter((x) => x.unit && SEC[x.unit]).map((x) => ({ v: x.v, unit: x.unit }));
}

// 率(近点移動)の単位を取り出す: °/周・°/公転・rad/公転・°/日・″/世紀
function parseRate(str) {
  if (typeof str !== 'string') return null;
  const sup = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  const t = String(str).replace(/−/g, '-').replace(/×10⁻/g, 'e-').replace(/×10/g, 'e')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => sup[ch]);
  const m = t.match(/([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*(°|″|rad)\s*\/\s*(周|公転|日|世紀|yr|年)/);
  if (!m) {
    const z = t.match(/^\s*[≈約]?\s*0\s*[((]/);   // 「≈0(厳密ケプラー)」
    if (z) return { v: 0, kind: 'deg-per-orbit' };
    return null;
  }
  const v = Number(m[1]), num = m[2], den = m[3];
  if (!Number.isFinite(v)) return null;
  if (den === '周' || den === '公転') {
    if (num === 'rad') return { v: v * 180 / Math.PI, kind: 'deg-per-orbit' };
    if (num === '″') return { v: v / 3600, kind: 'deg-per-orbit' };
    return { v, kind: 'deg-per-orbit' };
  }
  if (den === '日') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-day' };
  if (den === '世紀') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-century' };
  if (den === 'yr' || den === '年') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-year' };
  return null;
}

// 「0.026〜0.077(有界)」型の**範囲で書かれた観測**を取り出す(点推定ではないので % 残差にしない)
function parseRange(str) {
  if (typeof str !== 'string') return null;
  const t = normNum(str);
  const m = t.match(/([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*[〜~ー–—-]\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
  if (!m) return null;
  const lo = Number(m[1]), hi = Number(m[2]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || !(hi > lo)) return null;
  return { lo, hi };
}

const pct = (a, b) => (Number.isFinite(a) && Number.isFinite(b) && b !== 0) ? (a - b) / Math.abs(b) * 100 : null;

// Spearman 順位相関(同順位は平均順位)
function spearman(xs, ys) {
  const n = xs.length; if (n < 4) return null;
  const rank = (a) => {
    const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
    const r = new Array(n); let i = 0;
    while (i < n) { let j = i; while (j + 1 < n && idx[j + 1][0] === idx[i][0]) j++;
      const rr = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = rr; i = j + 1; }
    return r;
  };
  const rx = rank(xs), ry = rank(ys);
  const mx = rx.reduce((a, b) => a + b, 0) / n, my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (rx[i] - mx) * (ry[i] - my); sxx += (rx[i] - mx) ** 2; syy += (ry[i] - my) ** 2; }
  return (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : null;
}

// ================================================================ ブラウザ
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ(本体には入れない)
await pg.evaluate((PERI_WINDOW) => {   // 第252便b: 近点間周期の固定窓をページ側へ渡す
  // 宣言 body index → 実行 index(ring/cluster 等は count 個へ展開される)
  window.__w249map = (p) => {
    const map = []; let si = 0;
    for (const b of (p.bodies || [])) {
      map.push(si);
      const n = (b.n !== undefined) ? b.n : (b.count !== undefined ? b.count : 1);
      si += (b.type && b.type !== 'single') ? Math.max(1, Math.round(n)) : 1;
    }
    return map;
  };
  window.__w249build = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset) };
  };
  // 步/秒の実測(判定には使わない — 走行長の予算にだけ使う)
  window.__w249rate = (id, dt) => {
    window.__w249build(id); const S = HP.sim;
    for (let i = 0; i < 5000; i++) S.step(dt);          // JIT の暖機(計時に入れない)
    const t0 = Date.now(); const N = 20000;
    for (let i = 0; i < N; i++) S.step(dt);
    const ms = Date.now() - t0;
    return (ms > 0) ? N / (ms / 1000) : 1e6;
  };
  // t=0 の接触要素(2 体近似)
  window.__w249osc0 = (ci, oi, G) => {
    const S = HP.sim;
    const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
    const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
    const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy;
    const mu = G * (S.m[ci] + S.m[oi]);
    const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
    const h = dx * dvy - dy * dvx;
    const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
    const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
    return { r, a, e: Math.hypot(ex, ey), h, mu,
      P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
  };
  // 本体: 1 走行で全対象を測る
  //   targets = [{ci, oi, label}]  (実行 index)
  window.__w249run = (id, dt, maxSteps, targets, orbMax, G) => {
    const b = window.__w249build(id); const S = HP.sim;
    const T = targets.map((t) => {
      const o = window.__w249osc0(t.ci, t.oi, G);
      return { ci: t.ci, oi: t.oi, label: t.label,
        r2: 0, r1: 0, th2: 0, th1: 0, rd1: 0, k0: 0,
        rMin: Infinity, rMax: -Infinity, rMin1: Infinity, rMax1: -Infinity,
        A: [], B: [], rev: [], angAcc: 0, angPrev: 0,
        oscA: 0, oscP: 0, oscE: 0, oscN: 0, osc0: o, done: false };
    });
    const spin0 = Array.from(S.spin).slice(0, Math.min(S.n, 8));
    const core0 = [];
    for (const t of T) for (const i of [t.ci, t.oi]) {
      const ci = (HP.coreState ? HP.coreState(i) : null);
      if (ci && Number.isFinite(ci.omega)) core0.push({ i, omega: ci.omega });
    }
    const oscEvery = Math.max(1, Math.round(maxSteps / 2000));
    // 初期角
    for (const t of T) {
      const dx = S.x[t.oi] - S.x[t.ci], dy = S.y[t.oi] - S.y[t.ci];
      t.angPrev = Math.atan2(dy, dx);
    }
    let k = 0, stop = false;
    for (; k < maxSteps && !stop; k++) {
      S.step(dt);
      for (const t of T) {
        const dx = S.x[t.oi] - S.x[t.ci], dy = S.y[t.oi] - S.y[t.ci];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[t.oi] - S.vx[t.ci], dvy = S.vy[t.oi] - S.vy[t.ci];
        const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        if (rr < t.rMin) t.rMin = rr; if (rr > t.rMax) t.rMax = rr;
        if (!t.rev.length) { if (rr < t.rMin1) t.rMin1 = rr; if (rr > t.rMax1) t.rMax1 = rr; }
        // 同方向 1 周: 相対角の連続化と 2π 交差
        let d = th - t.angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const prevAcc = t.angAcc; t.angAcc += d; t.angPrev = th;
        const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(t.angAcc) / (2 * Math.PI));
        if (nNow > nPrev && t.rev.length < orbMax + 2) {
          const target = Math.sign(t.angAcc) * nNow * 2 * Math.PI;
          const fr = (t.angAcc !== prevAcc) ? (target - prevAcc) / (t.angAcc - prevAcc) : 0;
          t.rev.push((k - 1 + fr) * dt);
        }
        // 近点 検出器 A(ṙ の −→+ 交差)
        if (k >= 1 && t.rd1 < 0 && rd >= 0 && t.A.length < orbMax + 3) {
          const fr = (rd !== t.rd1) ? (-t.rd1 / (rd - t.rd1)) : 0;
          let a1 = t.th1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          t.A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
        }
        // 近点 検出器 B(距離極小の放物線頂点)
        if (k >= 2 && t.r1 < t.r2 && t.r1 < rr && t.B.length < orbMax + 3) {
          const dd = (t.r2 - 2 * t.r1 + rr), fr = (dd !== 0) ? 0.5 * (t.r2 - rr) / dd : 0;
          let a1 = t.th2, a2 = t.th1, a3 = th;
          while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
          t.B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: t.r1 });
        }
        t.r2 = t.r1; t.r1 = rr; t.th2 = t.th1; t.th1 = th; t.rd1 = rd;
        // 接触要素の積算
        if (k % oscEvery === 0) {
          const v2 = dvx * dvx + dvy * dvy, mu = t.osc0.mu;
          const inv = 2 / rr - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
          if (Number.isFinite(a) && a > 0) {
            const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / rr;
            const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / rr;
            t.oscA += a; t.oscP += 2 * Math.PI * Math.sqrt(a * a * a / mu); t.oscE += Math.hypot(ex, ey); t.oscN++;
          }
        }
      }
      if (T.every((t) => t.rev.length >= orbMax)) stop = true;
      if (S.hasNaN()) { stop = true; }
    }
    // 近点位相の直線 fit(第246便b→第247便a と同一手続き)
    const fit = (raw, rMin, rMax, pRef) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r <= mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const use = keep, ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z; }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      // 第258便d(第50報 W4): **deg/yr の門**のための、unwrap した近点角の**実時刻**への線形 fit。
      // 上の slope は「近点番号に対する」傾き(°/周)で、deg/yr へ直すには周期を 1 つ選ぶ必要がある
      // (⚡ は P_b と ω̇ が**別解**から来ているので、その換算は 2 つの解をまたぐ)。
      // ここでは横軸を**時刻そのもの**(k·dt = シミュレータ時間)にして傾きを取り、
      // 時系(t の範囲)と**傾きの分散・共分散**も残す。年の長さへの換算は node 側で行う。
      let timeFit = null;
      if (n >= 2) {
        const ts = []; for (let i = 0; i < n; i++) ts.push(use[i].k * dt);
        const mt = ts.reduce((a, b) => a + b, 0) / n, ma = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (ts[i] - mt) * (ang[i] - ma); sxx += (ts[i] - mt) * (ts[i] - mt); }
        const sl = (sxx > 0) ? sxy / sxx : null;
        let ss = 0;
        if (sl !== null) for (let i = 0; i < n; i++) { const rr2 = ang[i] - (ma + sl * (ts[i] - mt)); ss += rr2 * rr2; }
        const s2 = (n > 2) ? ss / (n - 2) : 0;
        timeFit = { nPeri: n, slopeRadPerTime: sl,
          slopeDegPerTime: (sl === null) ? null : sl * 180 / Math.PI,
          t0: ts[0], t1: ts[n - 1], tSpan: ts[n - 1] - ts[0], dt,
          varSlope: (sxx > 0) ? s2 / sxx : null,
          seSlopeDegPerTime: (sxx > 0) ? Math.sqrt(s2 / sxx) * 180 / Math.PI : null,
          varIntercept: (sxx > 0) ? s2 * (1 / n + mt * mt / sxx) : null,
          covSlopeIntercept: (sxx > 0) ? -s2 * mt / sxx : null,
          residRmsDeg: Math.sqrt(ss / n) * 180 / Math.PI,
          note: '横軸は**時刻**(k·dt = シミュレータ時間単位)。近点番号ではない' };
      }
      // 第252便b(第44報): **近点間周期の窓を「最初の 20 近点(19 区間)」へ固定**する。
      // 第251便 統括の未解決「近点間平均の窓感度で ⚡🧿🪶 の周期残差が 0.66pt 割れる」への処置で、
      // 窓の長さがサンプルごとの走行長(時間予算)で決まっていたのをやめ、**宣言した固定窓**にする。
      // 20 近点に満たなければ **perMean=null(未計測)** を返す —— 他の周期定義へは置換しない
      // (第251便c の定義契約 ④ をそのまま延長する)。窓外の全近点平均は perMeanAll に残す(履歴)。
      const perAll = []; for (let i = 1; i < use.length; i++) perAll.push((use[i].k - use[i - 1].k) * dt);
      const win = use.slice(0, PERI_WINDOW), measured = (win.length >= PERI_WINDOW);
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, timeFit,
        perMean: measured ? (win[PERI_WINDOW - 1].k - win[0].k) * dt / (PERI_WINDOW - 1) : null,
        perMeanAll: perAll.length ? perAll.reduce((a, b) => a + b, 0) / perAll.length : null,
        perWindow: PERI_WINDOW, perFound: use.length, perUnmeasured: !measured,
        perFirst: perAll.length ? perAll[0] : null, perN: measured ? PERI_WINDOW - 1 : 0 };
    };
    const out = T.map((t) => {
      const pRef = Number.isFinite(t.osc0.P) ? t.osc0.P : (t.rev.length > 1 ? t.rev[1] - t.rev[0] : 1);
      // revP[0]=1周目(t=0 から最初の 2π)・revP[1]=2周目 …(obsCard の「2周目」と同じ数え方)
      const revP = []; for (let i = 0; i < t.rev.length; i++) revP.push(i ? t.rev[i] - t.rev[i - 1] : t.rev[0]);
      return { label: t.label, ci: t.ci, oi: t.oi,
        rMin: t.rMin, rMax: t.rMax, rMin1: t.rMin1, rMax1: t.rMax1,
        eProxy: (t.rMax + t.rMin > 0) ? (t.rMax - t.rMin) / (t.rMax + t.rMin) : null,
        eProxy1: (t.rMax1 + t.rMin1 > 0 && t.rMax1 > 0) ? (t.rMax1 - t.rMin1) / (t.rMax1 + t.rMin1) : null,
        revFirst: t.rev.length ? t.rev[0] : null,
        revP, revN: revP.length,
        revPMean: revP.length ? revP.reduce((a, b) => a + b, 0) / revP.length : null,
        A: fit(t.A, t.rMin, t.rMax, pRef), B: fit(t.B, t.rMin, t.rMax, pRef),
        osc0: t.osc0,
        oscA: t.oscN ? t.oscA / t.oscN : null, oscP: t.oscN ? t.oscP / t.oscN : null,
        oscE: t.oscN ? t.oscE / t.oscN : null, oscN: t.oscN };
    });
    const spinDrift = spin0.map((s, i) => ({ i, s0: s, s1: S.spin[i],
      driftPct: (s !== 0) ? (S.spin[i] - s) / Math.abs(s) * 100 : (S.spin[i] === 0 ? 0 : null) }));
    const coreDrift = core0.map((c) => { const ci = HP.coreState(c.i);
      return { i: c.i, omega0: c.omega, omega1: ci ? ci.omega : null,
        driftPct: (c.omega !== 0 && ci) ? (ci.omega - c.omega) / Math.abs(c.omega) * 100 : null }; });
    return { steps: k, tEnd: k * dt, targets: out, spinDrift, coreDrift,
      nan: S.hasNaN(), clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      warnings: b.warnings, n: b.n, framePrec: S.framePrec || null };
  };
}, PERI_WINDOW);

// ---------------------------------------------------------------- サンプル一覧と宣言の読み出し
const decls = await pg.evaluate(() => HP.allPresets().filter((p) => p.sampleClass === 'calibration').map((p) => ({
  id: p.id, emoji: p.emoji || null, name: p.name || null,
  obsCard: p.obsCard || [], claims: (p.claims || []).map((c) => ({ id: c.id, role: c.role, metric: c.metric,
    expected: c.expected || null })),
  physics: p.physics || {}, scaleExp: p.scaleExp || null,
  massCalibration: p.massCalibration ? { law: p.massCalibration.law,
    factor: p.massCalibration.factor !== undefined ? p.massCalibration.factor : p.massCalibration.factorUniform } : null,
  referenceKind: p.referenceKind || null,
  bodies: (p.bodies || []).map((b) => ({ type: b.type || 'single', m: b.m, radius: b.radius, spin: b.spin,
    n: (b.n !== undefined) ? b.n : (b.count !== undefined ? b.count : null) })),
})));

const ids = decls.map((d) => d.id).filter((x) => !ONLY || ONLY.includes(x));
console.error(`[w249b] 現実較正サンプル ${decls.length} 本 / 走行対象 ${ids.length} 本`);

// ================================================================ 走行
const out = { meta: {
  wave: '第249便b', target: TARGET, dtBase: DT0,
  budgetSecLight: BUDGET_LIGHT, budgetSecHeavy: BUDGET_HEAVY, orbMax: ORB_MAX,
  budgetNote: '第257便d(第49報): 1 段あたりの計算時間予算の**既定を 30 s → ' + BUDGET_DEFAULT + ' s** にした。'
    + 'これは**計算時間の予算**であって精度条件ではない(第256便d は 🧶 の dt/4 を --budget 80 で'
    + '走らせて初めて 20 近点窓が埋まった)。予算で切れて窓が埋まらなかった行は '
    + '`unmeasuredReason:"time-budget"`、時間が余っているのに埋まらない行は `"window"` と分けて記録する。'
    + '**機種依存の量**なので、dt・近点数とは別の欄(run.timeBudget)に置く。',
  verdicts: VERDICTS6,
  verdictsNote: '第258便d(第50報 W4): 5 区分に **`条`(condition-mismatch)** を足した。'
    + '行が要求している条件(kFrame)と、割り当てられている測定値の走行条件が違う行の隔離である。'
    + '**数値が間違っているのではなく、行の割り当てが間違っている** —— 元の証拠は '
    + 'conditionRejectedEvidence に残す。',
  dt8: DT8 ? { on: true, ids: DT8, dt: DT0 / 8,
    note: '第258便d: h8 検査点。名指しした系だけ 4 段目を走らせる(予算の都合で 1 系)。'
      + '走らせていない系は**未走行**である(推定で埋めない)。' } : { on: false },
  toleranceNote: '観測誤差が obsCard の obs 欄から読めた量は誤差で機械判定する。読めない量は ±1% を'
    + '「目安」として使い(guide:true)、確定基準にはしない。',
  periodNote: '公転周期は 2 定義(近点間 / 同方向 1 周)を両方測り、判定は同方向 1 周で行う'
    + '(obsCard の「2 周目/周回時間」がこの定義)。両定義が許容の内外に分かれた行は note に「定義依存」を書く。'
    + ' **第252便b: 近点間周期の窓を「最初の 20 近点(19 区間)」に固定した。**20 近点に満たない対象は'
    + ' unmeasured を返し、他の周期定義へは置換しない(第251便c の定義契約 ④ の延長)。'
    + ' 窓外の全近点平均は detail.periAllSec に履歴として残す。',
  periWindow: { nPeri: PERI_WINDOW, nIntervals: PERI_WINDOW - 1,
    reason: '第251便 統括の未解決「近点間平均の窓感度で ⚡🧿🪶 の周期残差が 0.66pt 割れる」— '
      + '窓の長さが走行長(時間予算)で決まっていたのをやめ、宣言した固定窓にする(第252便b)',
    unmeasured: '**窓感度は未計測のままである**(第253便b L6): 窓を 20・30・40 近点と振って値が'
      + 'どう動くかは測っていない。窓は全系で 20 近点に固定したので系間の比較は揃うが、'
      + '「20 が十分な長さか」は確かめていない。' },
  dtNote: 'dt はアプリ既定 0.016 と、その半分 0.008 の 2 段。dt/2 段は実行時 n≤12 のサンプルだけ'
    + '(重い環・多体は時間予算に収まらない — 明記)。'
    + (DT3 ? '**第255便d(第47報 N8): 本走行は --dt3 で dt/4=0.004 を足した 3 段**である'
      + '(--only で絞った系だけ。ε_num=|Q_h−Q_{h/4}|・観測次数 p_obs を実測して numBoundDecl へ入れる)。' : ''),
  dt3: DT3 ? { on: true, only: ONLY,
    note: '3 段(dt, dt/2, dt/4)を走らせた系だけ numBoundDecl.steps=3・order=p_obs になる。'
      + '2 段のままの系の値・文言は第253便b から 1 文字も動いていない。' } : { on: false },
}, presets: [] };

for (const id of ids) {
  const d = decls.find((x) => x.id === id);
  const cfg = CFG[id];
  if (!cfg) { console.error(`  SKIP ${id}(CFG 未宣言)`); continue; }
  const G = Number(d.physics.G), c = Number(d.physics.cLight);
  const eT = d.scaleExp ? Number(d.scaleExp.T) : 0;
  const toSec = Math.pow(10, eT);

  // 宣言 index → 実行 index
  const b0 = await pg.evaluate((id) => window.__w249build(id), id);
  const map = b0.map;
  const heavy = b0.n > 12;
  const budget = heavy ? BUDGET_HEAVY : BUDGET_LIGHT;
  const targets = cfg.o.map(([di, label]) => ({ ci: map[cfg.c], oi: map[di], label }));
  if (cfg.ringInner) {
    // 最内リング粒子(実行 index の中で中心を除き r 最小のもの)
    const inner = await pg.evaluate(({ ci }) => { const S = HP.sim; let best = -1, br = Infinity;
      for (let i = 0; i < S.n; i++) { if (i === ci) continue;
        const r = Math.hypot(S.x[i] - S.x[ci], S.y[i] - S.y[ci]); if (r < br) { br = r; best = i; } }
      return { i: best, r: br }; }, { ci: map[cfg.c] });
    targets.unshift({ ci: map[cfg.c], oi: inner.i, label: cfg.ringInner });
  }

  const rows = [];
  const levels = [{ dt: DT0, tag: 'dt' }];
  if (!FAST && !heavy) levels.push({ dt: DT0 / 2, tag: 'dt/2' });
  if (DT3 && !FAST && !heavy) levels.push({ dt: DT0 / 4, tag: 'dt/4' });   // 第255便d(N8)
  // 第258便d(第50報 W4): **h8 検査点**。--dt8 で名指しした系にだけ 4 段目を足す(予算の都合で 1 系)。
  if (DT8 && DT8.includes(id) && !FAST && !heavy) levels.push({ dt: DT0 / 8, tag: 'dt/8' });

  for (const lv of levels) {
    const rate = await pg.evaluate(({ id, dt }) => window.__w249rate(id, dt), { id, dt: lv.dt });
    // t=0 の接触要素から 1 公転の步数を見積もる
    await pg.evaluate((id) => window.__w249build(id), id);
    const osc0 = await pg.evaluate(({ targets, G }) => targets.map((t) => window.__w249osc0(t.ci, t.oi, G)),
      { targets, G });
    const stepsPerOrbit = osc0.map((o) => (Number.isFinite(o.P) && o.P > 0) ? o.P / lv.dt : Infinity);
    const orbMax = cfg.orbMax || ORB_MAX;
    const wantSteps = Math.max(...stepsPerOrbit.filter((s) => Number.isFinite(s)).map((s) => s * orbMax), 1);
    // 「1 公転が時間予算に入る」対象については **最低 5 公転** を保証する(判定に足る窓を確保するため)。
    // 入らない対象(重い環の外側衛星など)は接触要素だけで出す。上限は実行時 n による step 天井。
    const budgetSteps = rate * budget;
    const feasible = stepsPerOrbit.filter((s) => Number.isFinite(s) && s <= budgetSteps);
    const floorSteps = feasible.length ? 5 * Math.max(...feasible) : 0;
    const hardCap = (b0.n <= 3) ? 40e6 : (b0.n <= 12) ? 20e6 : budgetSteps * 2;
    const maxSteps = Math.max(2000, Math.round(Math.min(Math.max(budgetSteps, floorSteps), wantSteps, hardCap)));
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, dt, maxSteps, targets, orbMax, G }) =>
      window.__w249run(id, dt, maxSteps, targets, orbMax, G), { id, dt: lv.dt, maxSteps, targets, orbMax, G });
    r.dt = lv.dt; r.tag = lv.tag; r.rateStepsPerSec = Math.round(rate); r.wallSec = (Date.now() - t0) / 1000;
    r.stepsPerOrbit0 = stepsPerOrbit.map((s) => Number.isFinite(s) ? Math.round(s) : null);
    // 第257便d: **計算時間の予算**を数値の性質と混ぜずに記録する(機種依存の欄)。
    // budgetSec = この段に与えた秒数 / wallSec = 実際に掛かった秒数 / budgetHit = 予算で切れたか /
    // periFound = 検出できた近点の数(窓 20 に届いたか)。**予算は精度条件ではない**。
    r.timeBudget = { budgetSec: budget, heavy, wallSec: r.wallSec,
      budgetHit: r.wallSec >= 0.9 * budget, maxSteps, stepsRun: r.steps,
      rateStepsPerSec: Math.round(rate), dt: lv.dt,
      periFoundA: r.targets.map((t) => t.A.perFound), periWindow: PERI_WINDOW,
      windowFilledA: r.targets.map((t) => !t.A.perUnmeasured),
      note: '機種依存の量である(この行の数値は計算機の速さで変わる)。dt・近点数は別欄。' };
    rows.push(r);
    console.error(`  ${d.emoji} ${id} [${lv.tag}=${lv.dt}] n=${r.n} steps=${r.steps}`
      + ` orbits=${r.targets.map((t) => t.revN).join('/')} ${r.wallSec.toFixed(1)}s`);
  }
  out.presets.push({ decl: d, cfg: { center: cfg.c, orbiters: cfg.o, ringInner: cfg.ringInner || null,
    note: cfg.note || null }, runs: rows, toSec, G, c, heavy });
}

// ---------------------------------------------------------------- 第257便d(第49報・3 審査 v15)
// **Float32 質量の記録**。状態配列 `S.m` は `stateCarry:"double"` を宣言した系でも **Float32Array**
// である(倍精度化したのは軌道状態 x/y/v/a と累積角であって、質量ではない — beta/index.html
// の `S.alloc` を参照)。したがって**宣言した質量は、そのまま保持されているとは限らない**。
// ここで記録するのは 3 つだけで、**どれも実測である**(提案でも予想でもない):
//   ① 保持質量 = 実際に `S.m[i]` に入っている値(Float32 の格子点)
//   ② その桁での Float32 の**最小刻み**(ULP)
//   ③ 宣言質量(preset の bodies[i].m)との差(絶対・相対)
// あわせて **massCalibration の f の分解能**を測る: f を 1e−7 動かしたときに保持質量が動くか、
// 動かないなら**保持質量を 1 目盛り動かすのに要る最小の δf**(= ULP / baseMass)はいくつか。
// **「全 native を double 化せよ」という提案ではない**(エンジンは 1 bit も触っていない)。
const MASS_F32_TARGETS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM', 'gw150914DFM'];
out.massFloat32 = { note: '第257便d: S.m は Float32Array である(stateCarry:"double" は軌道状態の話)。'
  + '① 保持質量 ② その桁の Float32 最小刻み(ULP) ③ 宣言質量との差、と f の分解能を実測で記録する。'
  + '**エンジンは 1 bit も触っていない**(読み出しだけ)。',
  rows: await pg.evaluate((ids) => {
    const buf = new Float32Array(1), u32 = new Uint32Array(buf.buffer);
    const ulp32 = (v) => { const a = Math.fround(v); buf[0] = a;
      if (!Number.isFinite(a)) return null;
      u32[0] = u32[0] + 1; const up = buf[0]; return Math.abs(up - a); };
    const rows = [];
    for (const id of ids) {
      const p = HP.allPresets().find((q) => q.id === id);
      if (!p) { rows.push({ id, missing: true }); continue; }
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      HP.sim.build(v.preset);
      const S = HP.sim, mc = p.massCalibration || null, bodies = [];
      const nB = Math.min(S.n, (p.bodies || []).length);
      for (let i = 0; i < nB; i++) {
        const decl = Number(p.bodies[i].m), held = S.m[i], u = ulp32(held);
        const base = (mc && Array.isArray(mc.baseMass) && Number.isFinite(Number(mc.baseMass[i])))
          ? Number(mc.baseMass[i]) : null;
        const fb = (mc && Array.isArray(mc.factorByBody) && Number.isFinite(Number(mc.factorByBody[i])))
          ? Number(mc.factorByBody[i])
          : ((mc && Number.isFinite(Number(mc.factor))) ? Number(mc.factor) : null);
        let fRes = null;
        if (base !== null && fb !== null) {
          const m0 = Math.fround(base * fb), m1 = Math.fround(base * (fb + 1e-7));
          fRes = { dF: 1e-7, movesHeldMass: (m1 !== m0), dMassDouble: base * 1e-7,
            minDeltaFthatMoves: (u !== null && base !== 0) ? u / base : null };
        }
        bodies.push({ i, declaredMass: decl, heldMass: held, ulp32: u,
          absDiff: held - decl, relDiff: (decl !== 0) ? (held - decl) / Math.abs(decl) : null,
          heldIsFroundOfDeclared: (held === Math.fround(decl)),
          baseMass: base, factor: fb, fResolution: fRes });
      }
      rows.push({ id, emoji: p.emoji || null, n: S.n,
        stateCarry: (p.physics || {}).stateCarry || null,
        massArrayType: S.m.constructor.name,
        massCalLaw: mc ? mc.law : null, bodies });
    }
    return rows;
  }, MASS_F32_TARGETS) };

out.pageErrors = pageErrors;
await browser.close();

// ================================================================ 判定・相関(node 側)
const VER = { OK: '合', WIN: '窓', NG: '否', DEP: '従', TR: '転' };

// ---------------------------------------------------------------- 第250便c(第42報 W3・I2)
// **機械門** assessObservation。既存の 5 区分(合/窓/否/従/転)は**来歴・解釈の欄としてそのまま
// 保持**し、これは別欄である。門:
//     |y_sim − y_obs| ≤ 3σ_obs + ε_num 、 ε_num ≤ 0.3σ_obs
// ε_num は**保守的な決定論的数値誤差幅**(本便では dt 2 段 — 既定 0.016 と 0.008 — の同じ検出器の
// 差)であり、観測残差を見て増やすフィット項ではない。
// **第251便c(ChatGPT §8.1)**: ε_num は「dt 2 段の差」そのものではなく**宣言**である。ここに置くのは
// 「dt/2 と dt/4 の差の上限として記録した値」で、収束次数を添えて `numBoundDecl` に残す
// (本便の走行は dt と dt/2 の 2 段なので **収束次数は未測定**(order:null)— 次数 p が既知なら真の
//  誤差は |y(dt)−y(dt/2)|/(2^p−1) 程度で、記録値はその上限側である)。
//   ・観測誤差が読めない / 定義(検出器・周期の定義)が観測精度で一致しない / 一次表が未確認 → **未判定**
//   ・数値が収束していない(dt 2 段が無い・ε_num が 0.3σ を超える)              → **数値未解決**
// ±1% の目安(guideTolerance)は**観測一致ではない**。この門を通らない「合」は目安合である。
// 第257便d(第49報・3 審査 v15 一致): **門を 4 段で読む**。
//   (i) 数値収束(dt 3 段+正の観測次数)/(ii) 観測量対応(シミュレータの測定量と観測の量が
//   同じものを指しているか)/(iii) 観測適合(3σ)/(iv) 予測(較正の従属量でない合格)。
// **第 4 の状態 `mapping-unresolved` を足す**: σ も定義も一次表もあるが、**測っている量と
// 観測の量の対応が未確定**な行(例: タイミング解の e_T と、距離の極値から作る eProxy)。
// これは「合わない」でも「数値が足りない」でもない —— **定義の違う 2 量の差を棄却 σ として
// 読まないため**の区分である(3σ は 1 mm も緩めない)。
// 第258便d(W4): GATE の語彙は `tests/lib-w258d-evidence.mjs` の 1 本に集約した(QA も同じ 1 本を読む)。
// 第 5 の状態 `condition-mismatch` が足された(**合っていないのではなく、条件が違う**行の隔離)。
// 第253便b(第45報・ChatGPT §7.1): ε_num の**書き方の正本**。dt 2 段の差は**感度診断**であって
// 誤差上限ではない —— 漸近域でも粗い側の真の誤差は 2^p/(2^p−1)·|Q_h−Q_{h/2}| で、この差そのもの
// より大きい(p=1 で 2 倍・p=2 で 1.33 倍)。旧文言「上限としての宣言」は撤回する。
// --merge で持ち越した過去分の行にも同じ文言を張り直すため、関数にして 2 か所から使う。
function numBoundDeclOf(value, steps = 2, order = null) {
  // 第255便d(第47報 N8): 3 段(dt, dt/2, dt/4)が揃った量だけ、ε_num の定義と文言が変わる。
  // 2 段のままの量の文言・値は第253便b から 1 文字も変えていない。
  if (steps >= 3) {
    return { value, steps, order,
      basis: 'dt=0.016・dt/2=0.008・dt/4=0.004 の同じ検出器の **|Q_h − Q_{h/4}|**'
        + '(第252便b ③ と同じ ε_num の定義。3 段が揃ったので感度診断ではなく収束の量として使う)',
      orderNote: (Number.isFinite(order) && order > 0)
        ? `観測次数 p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| = ${order.toFixed(3)} を実測した`
          + '(スキームの次数ではなく**この窓のこの量の観測次数**である — 第252便b ③(b))。'
          + '3 段+正の次数が揃ったので、この量は収束の保留条件を満たす'
        : '**観測次数が負または測れない**(Q が単調でない)= 収束していない。'
          + '3 段は走ったが保留条件は満たさない(第253便b の門はこの量を「数値未解決」に留める)' };
  }
  return { value, steps, order,
    basis: 'dt=0.016 と dt/2=0.008 の同じ検出器の差(**感度診断** — dt/4 は走らせておらず、'
      + '誤差上限は未確認。漸近域でも粗い側の誤差は 2^p/(2^p−1)|Q_h−Q_{h/2}| で、この値より大きい)',
    orderNote: 'dt/4 を走らせていないので**収束次数は未測定**(order:null)。次数 p が実測されるまでは '
      + '|Q_h−Q_{h/2}| を誤差の上限として使えない —— 真の誤差は 2^p/(2^p−1) 倍で、'
      + 'p が小さいほど大きい(p=1 で 2 倍)。3 段+正の次数が揃うまでこの量は診断値である' };
}
function assessObservation({ value, reference, sigma, numBound,
  converged = false, definitionMatches = false, sourceVerified = false,
  mappingResolved = true, mappingNote = '' }) {
  if (![value, reference].every(Number.isFinite) || !Number.isFinite(sigma) || !(sigma > 0))
    return { status: GATE.NA, reason: '観測誤差(σ)または有限の実測が無い' };
  const residual = value - reference, nSigma = Math.abs(residual) / sigma;
  const base = { residual, nSigma, sigma };
  // 第257便d: `definitionMatches` は **A を正本とした「定義が宣言されているか」**である
  // (第256便d ③ の実測: 検出器 A/B の差は定義差ではなく軌道側の雑音だった)。
  // A−B の広がりは `orbitNoiseIndicator` という別欄へ移した —— 門はそれを読まない。
  if (!definitionMatches)
    return Object.assign(base, { status: GATE.NA,
      reason: '判定量の定義・推定器が宣言されていない(検出器 A を正本にできない)' });
  // 第257便d: 定義は宣言されているが、**観測の量との対応**が未確定の行(e_T ⇄ eProxy 等)
  if (!mappingResolved)
    return Object.assign(base, { status: GATE.MAP,
      reason: '観測量対応が未確定' + (mappingNote ? '(' + mappingNote + ')' : '') });
  if (!sourceVerified)
    return Object.assign(base, { status: GATE.NA, reason: '一次表(観測の出所)が未確認' });
  if (!converged || !Number.isFinite(numBound) || numBound > 0.3 * sigma)
    return Object.assign(base, { status: GATE.NUM,
      // 第253便b: 「収束の保留」も同じ区分へ入る(3 段+正の次数が無い = 数値は未解決)
      reason: '数値誤差幅が予算(0.3σ)を超える/収束未確認(dt 3 段+正の実測次数が無い)', numBound });
  const tolerance = 3 * sigma + numBound;
  return Object.assign(base, { status: (Math.abs(residual) <= tolerance) ? GATE.OK : GATE.NG,
    numBound, tolerance });
}
// 一次表(publication の一次表)との照合が**済んだ**量をここへ登録する。鍵は
// `sample|target|quantity`(外部レビューの識別子)。**第250便c 時点では 0 件** — 本便は門の実装で
// あって照合そのものは行っていない(I5 の再初期化と同じ便で埋める)。
const PRIMARY_VERIFIED = new Set([]);

function classify(q) {
  const s = String(q);
  if (/自転|パルス/.test(s) && !/公転/.test(s)) return 'spin';
  if (/離心率/.test(s) || /(^|[(（\s])e=/.test(s)) return 'ecc';
  if (/近点移動|近日点前進|近点回転|歳差|近点前進|アプシ/.test(s)) return 'precession';
  if (/公転周期|恒星月|公転|周期/.test(s)) return 'period';
  return null;
}

const report = [];
for (const P of out.presets) {
  const d = P.decl, cfg = P.cfg;
  const base = P.runs.find((r) => r.tag === 'dt') || P.runs[0];
  const half = P.runs.find((r) => r.tag === 'dt/2') || null;
  const quarter = P.runs.find((r) => r.tag === 'dt/4') || null;   // 第255便d(N8): 3 段目
  const eighth = P.runs.find((r) => r.tag === 'dt/8') || null;    // 第258便d(W4): h8 検査点(4 段目)
  const version = (Number(d.physics.kFrame) > 0) ? 'dfm' : 'obs';
  const theory = THEORY_CONTROL.includes(d.id);
  const dep = DEPENDENT[d.id] || [];

  // ---- 主対象(相関量を測る対): 環サンプルは最内リング粒子・それ以外は最初の宣言周回体
  const main = cfg.ringInner ? base.targets[0]
    : (base.targets.find((t) => t.label === cfg.orbiters[0][1]) || base.targets[0]);

  // ---- 便利関数(測定値の取り出し)
  const revSecOf = (t) => t.revP.map((p) => p * P.toSec);          // [1周目, 2周目, …]
  const pRevSec = (t) => { const r = revSecOf(t); return r.length >= 2 ? r[1] : (r.length ? r[0] : null); };
  const pOscSec = (t) => (t.oscP !== null ? t.oscP * P.toSec : null);
  const eMeas = (t) => (t.eProxy1 !== null && t.revN >= 1 ? t.eProxy1 : t.eProxy);

  // ---- 相関量(**観測側の量**で作る: 較正質量ではなく観測質量 m/f、a は実測の (r_min+r_max)/2)
  const G = P.G, cl = P.c;
  const fCal = (d.massCalibration && Number.isFinite(Number(d.massCalibration.factor)))
    ? Number(d.massCalibration.factor) : 1;
  const mC = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].m) / fCal : NaN;
  const oDecl = cfg.orbiters[0][0];
  const mO = d.bodies[oDecl] ? Number(d.bodies[oDecl].m) / fCal : NaN;
  const Rc = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].radius) : NaN;
  const aMeas = (Number.isFinite(main.rMin1) && Number.isFinite(main.rMax1) && main.rMax1 > 0)
    ? 0.5 * (main.rMin1 + main.rMax1) : (main.osc0 ? main.osc0.a : NaN);
  const sep0 = main.osc0 ? main.osc0.r : NaN;
  const eps = Number(d.physics.softening || 0);
  const fw = (d.physics.frameWeight === undefined) ? 'pull' : d.physics.frameWeight;
  const pow = (fw === 'pull') ? 2 : (fw === 'pull3') ? 3 : (fw === 'pull4') ? 4 : 0;
  const D0e = (d.physics.D0pull !== undefined) ? Number(d.physics.D0pull) : Number(d.physics.D0 || 0);
  // χ_A = 相手(B)の引き重み / (D₀ᵖ + 同) — ✴️ の宣言値 χ_A=1.99e-4 を再現する定義
  const wOf = (m) => (pow === 0) ? m : m / Math.pow(sep0 * sep0 + eps * eps, pow / 2);
  const mCcal = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].m) : NaN;
  const mOcal = d.bodies[oDecl] ? Number(d.bodies[oDecl].m) : NaN;
  const chiA = (Number.isFinite(mOcal) && Number.isFinite(sep0)) ? wOf(mOcal) / (D0e + wOf(mOcal)) : null;
  const chiB = (Number.isFinite(mCcal) && Number.isFinite(sep0)) ? wOf(mCcal) / (D0e + wOf(mCcal)) : null;
  const spinC = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].spin || 0) : 0;
  const pRefSec = pRevSec(main) || pOscSec(main);
  const nMean = (pRefSec && P.toSec) ? 2 * Math.PI / (pRefSec / P.toSec) : null;
  const correlates = {
    nu: (Number.isFinite(mC) && Number.isFinite(mO)) ? mC * mO / Math.pow(mC + mO, 2) : null,
    chiA, chiB, chi: (chiA !== null && chiB !== null) ? 0.5 * (chiA + chiB) : null,
    GMac2: (Number.isFinite(G) && Number.isFinite(mC + mO) && Number.isFinite(aMeas) && Number.isFinite(cl))
      ? G * (mC + mO) / (aMeas * cl * cl) : null,
    aOverR: (Number.isFinite(aMeas) && Number.isFinite(Rc) && Rc > 0) ? aMeas / Rc : null,
    e: eMeas(main),
    spinRatio: (nMean && spinC) ? Math.abs(spinC) / nMean : 0,
    kFrame: Number(d.physics.kFrame), frameWeight: fw, D0eff: D0e, massFactor: fCal,
    mainTarget: main.label,
  };

  // ---- 判定の共通部
  const quantities = [], notes = [];
  if (cfg.note) notes.push(cfg.note);
  if (theory) notes.push('理論対照(`referenceKind:"theory-control"`)— 参照が観測ではなく理論値(LT 則・二体ケプラー)の行を含む');
  if (P.heavy) notes.push(`実行時 n=${base.n} の重いサンプル: dt/2 段は走らせていない(時間予算 — 明記)`);
  if (base.warnings && base.warnings.length) notes.push('validatePreset 警告: ' + base.warnings.join(' / '));
  if (base.nan) notes.push('**NaN が発生した**');
  if (base.clamp) notes.push(`安全クランプ計数 ${base.clamp}`);
  for (const t of base.targets) {
    if (t.revN === 0) notes.push(`${t.label}: 1 公転が時間予算に収まらないため接触要素(osculating)だけで出す`);
  }
  if (cfg.ringInner) notes.push('最内リング粒子は帯 [rIn,rOut] の乱数半径に置かれるので、obsCard の'
    + '「C環内縁(74,658km)」そのものではない — 周期の比較は帯内位置の分だけずれる(接触要素 P を detail に併記)');

  const finish = (q, kind) => {
    const tol = (q.obsErr !== null && q.obsErr !== undefined && q.obsErr > 0 && q.obs)
      ? Math.abs(q.obsErr / q.obs) * 100 : null;
    const useTol = (tol !== null) ? tol : 1.0;
    q.guideTolerance = (tol === null);
    q.toleranceUsedPct = useTol;
    if (dep.includes(kind)) {
      q.verdict = VER.DEP;
      q.note = (q.note ? q.note + ' / ' : '') + '較正の従属量(第248便b の現行判定)— 較正質量 f≈2 が ω̇ の式に入る帰結で、独立な予言ではない';
      return q;
    }
    if (q.meas === null || q.meas === undefined || !Number.isFinite(q.meas)) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '照合できる実測が取れない(窓不足・宣言のみ)';
      return q;
    }
    if (q.obs === null || q.obs === undefined || !Number.isFinite(q.obs)) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '観測欄に照合できる数値が無い(入力の転写・規約・帳簿量・理論値)';
      return q;
    }
    if (q.degenerate) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '縮退・窓不足のため合否の対象にしない';
      return q;
    }
    if (q.obsRange) {   // 範囲で書かれた観測(有界帯)は「帯の中か外か」で判定する
      const { lo, hi } = q.obsRange;
      const inside = q.meas >= lo && q.meas <= hi;
      q.verdict = inside ? VER.OK : VER.NG;
      q.residualPct = inside ? null : pct(q.meas, (q.meas < lo) ? lo : hi);
      q.note = (q.note ? q.note + ' / ' : '')
        + `観測は範囲 [${lo}, ${hi}](点推定ではない)— 実測 ${q.meas.toPrecision(4)} は帯の${inside ? '内' : '外'}`;
      return q;
    }
    if (q.obs === 0) {   // 「≈0(厳密ケプラー)」型の参照
      const floor = (q.detail && q.detail.floorDeg) ? q.detail.floorDeg : 0;
      q.verdict = (Math.abs(q.meas) <= Math.max(floor, 1e-9)) ? VER.OK : VER.NG;
      q.note = (q.note ? q.note + ' / ' : '') + `参照は 0(理論)— 実測 ${q.meas.toExponential(3)}・検出限界 ${floor.toExponential(3)}`;
      return q;
    }
    q.residualPct = pct(q.meas, q.obs);
    if (!Number.isFinite(q.residualPct)) { q.verdict = VER.TR; return q; }
    q.strictOK = Math.abs(q.residualPct) <= 0.1;   // 目安を ±0.1% に締めたときの合否(感度の記録)
    if (Math.abs(q.residualPct) <= useTol) { q.verdict = VER.OK; return q; }
    let inWin = false;
    for (const c of d.claims) {
      if (!c.expected) continue;
      const cand = [q.meas];
      if (q.unit === 's') cand.push(q.meas / 86400, q.meas / 3.15576e7, q.meas / 3600);
      for (const v of cand) if (Number.isFinite(v) && v >= c.expected.min && v <= c.expected.max) inWin = true;
    }
    q.verdict = inWin ? VER.WIN : VER.NG;
    if (inWin) q.note = (q.note ? q.note + ' / ' : '') + '宣言(claims)の較正窓の内側だが観測許容の外';
    return q;
  };

  // 測定値の充填(obs は呼び出し側が入れる)
  // 第251便c: 周期の定義契約(ECC_TIMING_BINARY のコメント参照)
  const periastronFirst = ECC_TIMING_BINARY.has(d.id);
  // 第251便c: CSV の sigma 列を**門(assessObservation)専用の別欄** q.obsSigmaCsv へ載せる。
  // **5 区分(合/窓/否/従/転)の経路には入れない** — 5 区分は来歴・解釈の欄として不変に保つ
  // という第250便c の設計をそのまま守る(σ が効くのは門だけ)。
  const sigBody = SIGMA_BODY[d.id] || null;
  const applySigma = (q, t, kind, toJudgedUnit) => {
    if (!sigBody || t.label !== cfg.orbiters[0][1]) return q;
    const row = SIGMA_TABLE.get(sigBody + '|' + SIGMA_QUANT[kind]);
    if (!row) { q.sigmaNote = `CSV に ${sigBody}|${SIGMA_QUANT[kind]} の行が無い`; return q; }
    q.sigmaSource = { body: row.body, quantity: row.quantity, unit: row.unit, sigma: row.sigma,
      source: String(row.source).slice(0, 90), primaryVerified: row.primaryVerified };
    q.sigmaPrimaryVerified = !!row.primaryVerified;
    if (row.sigma === null) { q.sigmaNote = 'CSV の sigma 列が空欄(**未記録**であって 0 ではない)'; return q; }
    let s = null;
    if (kind === 'period' && row.unit === 's') s = row.sigma;
    else if (kind === 'ecc' && row.unit === '1') s = row.sigma;
    else if (kind === 'precession' && row.unit === 'deg/yr' && typeof toJudgedUnit === 'function')
      s = toJudgedUnit(row.sigma);
    if (Number.isFinite(s) && s > 0) {
      q.obsSigmaCsv = s;
      q.sigmaNote = `σ=${s} を CSV(${row.body}|${row.quantity}・${row.unit})から転写`
        + `(sigma_primary=${row.primaryVerified ? 'verified' : 'unverified'})`;
    } else q.sigmaNote = `CSV の σ の単位(${row.unit})が判定量へ換算できない — 転写しない`;
    return q;
  };
  const fillPeriod = (q, t) => {
    const revs = revSecOf(t);
    const pRev = pRevSec(t), pOsc = pOscSec(t);
    const pPeriA = (t.A.perMean !== null) ? t.A.perMean * P.toSec : null;
    const pPeriB = (t.B.perMean !== null) ? t.B.perMean * P.toSec : null;
    if (periastronFirst) {
      // ①④ 近点間で判定する。近点が測れなければ**未測定**(同方向1周・接触要素へ置換しない)
      q.periodDef = (pPeriA !== null) ? 'periastron' : 'unmeasured';
      q.meas = pPeriA;
      q.method = (pPeriA !== null)
        ? `近点間周期(検出器A・ṙ の −→+ 交差。**窓=最初の ${t.A.perWindow} 近点(${t.A.perWindow - 1} 区間)**`
          + ` — 第251便c の定義契約 + 第252便b の窓固定。検出できた近点は ${t.A.perFound} 個)`
        : `**未測定**: 近点間周期の窓(最初の ${PERI_WINDOW} 近点)が埋まらない`
          + `(検出できた近点 ${t.A.perFound === undefined ? 0 : t.A.perFound} 個)— 他の周期定義へは置換しない`
          + '(第251便c の定義契約 + 第252便b の窓固定)';
      if (pPeriA === null) q.note = (q.note ? q.note + ' / ' : '')
        + '離心タイミング連星の判定量は近点間周期だが**近点が測れない**ため未測定とする'
        + `(同方向1周 ${pRev === null ? '—' : pRev.toPrecision(9) + ' s'}・接触要素 `
        + `${pOsc === null ? '—' : pOsc.toPrecision(9) + ' s'} は detail に残すが判定には使わない)`;
    } else {
      q.periodDef = (pRev !== null) ? 'revolution' : ((pOsc !== null) ? 'osculating' : 'unmeasured');
      q.meas = (pRev !== null) ? pRev : pOsc;
      q.method = (pRev !== null) ? '同方向1周(2周目 — obsCard の数え方)'
        : '接触要素の平均 P(1公転が時間予算に収まらない)';
    }
    q.unit = 's';
    q.detail = { revSec: revs.slice(0, 6), periASec: pPeriA, periBSec: pPeriB, oscSec: pOsc,
      periWindow: t.A.perWindow || null, periFoundA: t.A.perFound, periFoundB: t.B.perFound,
      periUnmeasuredA: t.A.perUnmeasured, periAllSec: (t.A.perMeanAll !== null && t.A.perMeanAll !== undefined) ? t.A.perMeanAll * P.toSec : null,
      revN: t.revN, aOscMean: t.oscA, aOsc0: t.osc0.a,
      periodDef: q.periodDef,
      // ③ 検出器 A/B は**同じ近点間周期どうし**で比べる(定義違いの広がりは crossDef 側へ)
      detPairSec: (pPeriA !== null && pPeriB !== null) ? [pPeriA, pPeriB] : null };
    if (q.obs) {
      if (pPeriA !== null) q.residualPctPeri = pct(pPeriA, q.obs);
      if (pRev !== null) q.residualPctRev = pct(pRev, q.obs);
      if (pPeriA !== null && pRev !== null) q.defDiffPct = pct(pPeriA, pRev);
    }
    return q;
  };
  const fillEcc = (q, t) => {
    q.meas = eMeas(t); q.unit = '-';
    q.method = '1周目の半径比 proxy (r_max−r_min)/(r_max+r_min)';
    q.detail = { rMin1: t.rMin1, rMax1: t.rMax1, eProxyAll: t.eProxy, eOscMean: t.oscE,
      eOsc0: t.osc0.e, revN: t.revN };
    return q;
  };
  const fillPrec = (q, t) => {
    q.meas = t.A.slopeDeg; q.unit = 'deg/orbit';
    q.method = `近点移動 検出器A(ṙ 交差・近点 ${t.A.nPeri} 個の直線 fit)`;
    q.detail = { detectorA: t.A.slopeDeg, residA: t.A.residDeg, nPeriA: t.A.nPeri,
      detectorB: t.B.slopeDeg, residB: t.B.residDeg, nPeriB: t.B.nPeri,
      floorDeg: (t.A.residDeg !== null && t.A.nPeri > 1) ? 3 * t.A.residDeg / Math.sqrt(t.A.nPeri) : null,
      pRevSec: pRevSec(t), revN: t.revN,
      // 第250便c: °/日 ⇄ °/周 の換算に使う周期を明示する(近点間 = slopeDeg と同じ間隔)
      pPeriSec: (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null,
      convPeriod: 'periastron' };
    const ee = eMeas(t);
    q.detail.eMeasured = ee;
    if (q.detail.floorDeg !== null && q.meas !== null && Math.abs(q.meas) < q.detail.floorDeg) {
      q.degenerate = true;
      q.note = (q.note ? q.note + ' / ' : '')
        + `検出限界未満(|実測| < 3σ/√n = ${q.detail.floorDeg.toExponential(2)} °/周)— 窓が足りない`;
    }
    // 円軌道に近い対象は近点方位そのものが縮退する(角度 fit は雑音を測る)。合否の対象にしない
    if (Number.isFinite(ee) && ee < 1e-3) {
      q.degenerate = true;
      q.note = (q.note ? q.note + ' / ' : '')
        + `実測 e=${ee.toExponential(2)} は円軌道に近く**近点方位が縮退**する — 近点移動は測定できない`;
    }
    return q;
  };

  // ---- obsCard の行を 1 行ずつ照合
  const covered = new Set();
  let prevObsVals = null;
  for (const row of d.obsCard) {
    const kind = classify(row.q);
    const inherit = /^\s*同(上|左)/.test(row.obs);
    // obsCard は「観測が無い/照合の対象ではない」を obs 欄の先頭「—」で表す規約なので、
    // その行からは観測値を取り出さない(括弧内の解析値・注記を観測と誤読しないため)
    const noObs = /^\s*[—―–-]/.test(row.obs);
    const obsRate = noObs ? null : parseRate(row.obs);
    const modRate = parseRate(row.model);
    let obsVals = noObs ? null : parseObs(row.obs);
    if (inherit && prevObsVals) obsVals = prevObsVals;
    if (!inherit && obsVals) prevObsVals = obsVals;
    const modVals = parseObs(row.model);

    if (!kind) {
      quantities.push({ name: row.q, kind: 'other', version, target: null,
        model: row.model.slice(0, 110), obs: row.obs.slice(0, 110), obsErr: null, meas: null,
        unit: null, residualPct: null, verdict: VER.TR, method: 'declaration', standard: false,
        note: '合否の対象ではない宣言行(規約・帳簿・単位族・受け皿など)' });
      continue;
    }

    // 対象の割り当て
    const named = []; for (const t of base.targets) if (String(row.q).includes(t.label)) named.push(t);
    const nVals = (kind === 'precession' && obsRate) ? 1 : (obsVals ? obsVals.length : 1);
    let assign;
    if (named.length && named.length === nVals) assign = named;
    else if (named.length === 1) assign = named;
    else if (obsVals && obsVals.length === base.targets.length) assign = base.targets;
    else assign = [named.length ? named[0] : main];

    for (let i = 0; i < assign.length; i++) {
      const t = assign[i];
      const ov = obsVals ? obsVals[Math.min(i, obsVals.length - 1)] : null;
      const mv = modVals ? modVals[Math.min(i, modVals.length - 1)] : null;
      const q = { name: row.q + (assign.length > 1 ? `(${t.label})` : ''), kind, version,
        target: t.label, declaredModel: row.model.slice(0, 110), declaredObs: row.obs.slice(0, 110),
        model: null, obs: null, obsErr: null, meas: null, unit: null,
        residualPct: null, modelResidualPct: null, verdict: null, method: null, note: null,
        standard: false };
      covered.add(t.label + '|' + kind);

      if (kind === 'period') {
        const u = (ov && ov.unit && SEC[ov.unit]) ? SEC[ov.unit] : null;
        if (u) { q.obs = ov.v * u; q.obsErr = (ov.err !== null) ? ov.err * u : null; }
        else if (ov) q.note = '観測欄の単位が読めない(率の宣言など)';
        if (mv && mv.unit && SEC[mv.unit]) q.model = mv.v * SEC[mv.unit];
        fillPeriod(q, t);
        applySigma(q, t, 'period');
      } else if (kind === 'ecc') {
        const rg = noObs ? null : parseRange(row.obs);
        if (rg) { q.obsRange = rg; q.obs = 0.5 * (rg.lo + rg.hi); }
        else if (ov) { q.obs = ov.v; q.obsErr = ov.err; }
        if (mv) q.model = mv.v;
        fillEcc(q, t);
        applySigma(q, t, 'ecc');
      } else if (kind === 'precession') {
        // 第250便c(第42報 W3): slopeDeg は**近点番号に対する**傾きなので、観測の °/日・°/年を
        // °/周へ直す換算にも**同じ近点間隔(近点間周期)**を使う。以前は同方向1周(revP)を使い、
        // 無ければ osculating P へ落としていたが、大きく歳差する軌道では両者が数 % 違うため
        // 系統誤差になる(🪐 D68: 同方向 17865.95 s / 近点間 18224.86 s = 2.0% 差)。
        // フォールバックは置かない — 近点間隔が取れない対象は換算しない(= 判定しない)。
        const pS = (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null;
        const pDays = pS ? pS / 86400 : NaN;
        const conv = (r) => { if (!r) return null;
          if (r.kind === 'deg-per-orbit') return r.v;
          if (r.kind === 'deg-per-day') return r.v * pDays;
          if (r.kind === 'deg-per-century') return r.v * pDays / 36525;
          if (r.kind === 'deg-per-year') return r.v * pDays / 365.25;
          return null; };
        if (obsRate) {
          q.obs = conv(obsRate); q.model = conv(modRate);
          fillPrec(q, t);
          // 第251便c: CSV の σ は deg/yr。判定量は °/周なので**観測値と同じ換算**(近点間周期)を掛ける
          applySigma(q, t, 'precession', (s) => conv({ kind: 'deg-per-year', v: s }));
        } else if (ov && ov.unit && SEC[ov.unit] && /周期/.test(row.q)) {
          // 「近点回転の周期 8.85 年」型 — 実測 Δϖ から 360°/Δϖ×P で周期へ換算して照合する
          q.obs = ov.v * SEC[ov.unit]; q.obsErr = (ov.err !== null) ? ov.err * SEC[ov.unit] : null;
          if (mv && mv.unit && SEC[mv.unit]) q.model = mv.v * SEC[mv.unit];
          fillPrec(q, t);
          const sl = q.meas;
          q.detail.slopeDegPerOrbit = sl;
          q.meas = (sl && pS) ? Math.abs(360 / sl) * pS : null;
          q.unit = 's';
          q.method = `近点回転の周期 = 360°/Δϖ × P(Δϖ は検出器A・近点 ${t.A.nPeri} 個の直線 fit)`;
        } else {
          q.model = conv(modRate);
          fillPrec(q, t);
        }
      } else if (kind === 'spin') {
        const obsList = noObs ? [] : parseAllUnits(row.obs);
        if (!obsList.length) { q.method = 'declaration'; q.note = '観測欄が周期の数値ではない(帳簿・上限・比・宣言)'; }
        else {
          const cand = [];
          for (const idx of [t.ci, t.oi]) {
            const sd = base.spinDrift.find((s) => s.i === idx);
            if (sd && sd.s0) cand.push({ src: `body#${idx} 殻 spin`, per: 2 * Math.PI / Math.abs(sd.s0) * P.toSec, drift: sd.driftPct });
            const cd = base.coreDrift.find((s) => s.i === idx);
            if (cd && cd.omega0) cand.push({ src: `body#${idx} コア Ω`, per: 2 * Math.PI / Math.abs(cd.omega0) * P.toSec, drift: cd.driftPct });
          }
          // どの観測(A/B・殻/コア)がどのチャネルに転写されているかは宣言依存なので、
          // 「候補 × 観測」の全組から比が 1 に最も近い組を採る(採った組は method に書く)
          let best = null;
          for (const c2 of cand) for (const o2 of obsList) {
            const ob = Math.abs(o2.v) * SEC[o2.unit];
            const d2 = Math.abs(Math.log(c2.per / ob));
            if (best === null || d2 < best.d) best = { d: d2, per: c2.per, src: c2.src, drift: c2.drift, obs: ob };
          }
          if (best) { q.obs = best.obs; q.unit = 's'; q.meas = best.per;
            q.method = `${best.src} から 2π/ω(転写の読み戻し・並記された観測から最も近い組を採る)`;
            q.detail = { candidates: cand, obsList, driftPct: best.drift }; }
          else q.note = '自転が転写されていない(spin=0・コア無し)';
        }
      }
      quantities.push(finish(q, kind));
    }
  }

  // ---- 標準検出器の実測(obsCard に無い量も同じ器で必ず出す)
  for (const t of base.targets) {
    for (const kind of ['period', 'ecc', 'precession']) {
      if (covered.has(t.label + '|' + kind)) continue;
      const q = { name: `実測(標準検出器): ${{ period: '公転周期', ecc: '離心率', precession: '近点移動' }[kind]}(${t.label})`,
        kind, version, target: t.label, declaredModel: null, declaredObs: null,
        model: null, obs: null, obsErr: null, meas: null, unit: null,
        residualPct: null, modelResidualPct: null, verdict: null, method: null,
        note: 'obsCard に対応する観測行が無い(**観測台帳の欠け** — 外部レビュー指摘)', standard: true };
      if (kind === 'period') fillPeriod(q, t);
      else if (kind === 'ecc') fillEcc(q, t);
      else fillPrec(q, t);
      quantities.push(finish(q, kind));
    }
  }

  // ---- 第257便d: 未測定の**理由**を分ける(時間予算か・窓そのものか)
  for (const q of quantities) {
    if (q.kind !== 'period' || q.periodDef !== 'unmeasured') continue;
    const bt = base.timeBudget || {};
    q.unmeasuredReason = bt.budgetHit ? 'time-budget' : 'window';
    q.unmeasuredNote = bt.budgetHit
      ? `**unmeasured/time-budget**: 与えた計算時間 ${bt.budgetSec} s を使い切って(実 ${(bt.wallSec || 0).toFixed(1)} s)`
        + `20 近点窓が埋まらなかった(検出できた近点 ${JSON.stringify(bt.periFoundA)})。`
        + '**機種依存の打ち切り**であって、数値が収束しないという意味ではない'
      : `**unmeasured/window**: 計算時間は余っている(${(bt.wallSec || 0).toFixed(1)} / ${bt.budgetSec} s)のに`
        + `20 近点窓が埋まらない(検出できた近点 ${JSON.stringify(bt.periFoundA)})— 軌道そのものの性質`;
  }

  // ---- 宣言値と再実測の差(model 欄が読めた行だけ)
  for (const q of quantities) {
    if (q.model !== null && q.model !== undefined && Number.isFinite(q.model) && Number.isFinite(q.meas)) {
      q.modelResidualPct = pct(q.meas, q.model);
    }
    // 周期の 2 定義が許容の内外に分かれた行に印を付ける(外部レビュー)
    if (q.kind === 'period' && Number.isFinite(q.residualPctRev) && Number.isFinite(q.residualPctPeri)) {
      const tol = q.toleranceUsedPct;
      const inRev = Math.abs(q.residualPctRev) <= tol, inPeri = Math.abs(q.residualPctPeri) <= tol;
      if (inRev !== inPeri || Math.sign(q.residualPctRev) !== Math.sign(q.residualPctPeri)) {
        q.note = (q.note ? q.note + ' / ' : '')
          + `**周期の定義依存**: 同方向1周 ${q.residualPctRev.toFixed(4)}% / 近点間 ${q.residualPctPeri.toFixed(4)}%`
          + `(判定に採ったのは ${q.periodDef === 'periastron' ? '**近点間**' : q.periodDef})`;
      }
    }
  }

  // ---- dt 収束(dt と dt/2 の主対象)
  if (half) {
    const a = base.targets[base.targets.indexOf(main)] || base.targets[0];
    const b = half.targets[base.targets.indexOf(main)] || half.targets[0];
    const pa = a.revP.length >= 2 ? a.revP[1] * P.toSec : null, pb = b.revP.length >= 2 ? b.revP[1] * P.toSec : null;
    if (quarter) {
      const c = quarter.targets[base.targets.indexOf(main)] || quarter.targets[0];
      notes.push('**dt 3 段(第255便d N8)**: dt/4=0.004 まで走らせた。近点移動 '
        + ((main.A.slopeDeg !== null && c && c.A.slopeDeg !== null)
          ? `${main.A.slopeDeg.toExponential(4)} → ${c.A.slopeDeg.toExponential(4)} °/周(h → h/4)` : '窓不足')
        + ' / ε_num=|Q_h−Q_{h/4}| と観測次数 p_obs は各量の numBoundDecl へ入れた');
    }
    notes.push('dt 収束(主対象 ' + main.label + '): 周期 '
      + ((pa && pb) ? `${pa.toPrecision(9)} → ${pb.toPrecision(9)} s(${pct(pb, pa).toFixed(4)}%)` : '窓不足')
      + ' / 近点移動 ' + ((a.A.slopeDeg !== null && b.A.slopeDeg !== null)
        ? `${a.A.slopeDeg.toExponential(4)} → ${b.A.slopeDeg.toExponential(4)} °/周` : '窓不足'));
  }

  // ---- 第250便c: I2 の機械門が使う ε_num(dt 2 段の同じ検出器の差)を各量へ記録する ----------
  // 門そのものは --merge で持ち越した過去分にも掛けるため、**併合の後**に一括で付ける(下記)。
  const halfOf = (t) => (half ? (half.targets[base.targets.indexOf(t)] || null) : null);
  const quarterOf = (t) => (quarter ? (quarter.targets[base.targets.indexOf(t)] || null) : null);
  const eighthOf = (t) => (eighth ? (eighth.targets[base.targets.indexOf(t)] || null) : null);
  const rawMeas = (q, t) => { if (!t) return null;
    // 第251便c: ε_num も**同じ定義**で作る(離心タイミング連星は dt/2 でも近点間)
    if (q.kind === 'period') {
      if (periastronFirst) return (t.A.perMean !== null) ? t.A.perMean * P.toSec : null;
      const a = pRevSec(t); return (a !== null) ? a : pOscSec(t); }
    if (q.kind === 'ecc') return eMeas(t);
    if (q.kind === 'precession') {
      if (q.unit === 's') { const sl = t.A.slopeDeg;
        const pS = (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null;
        return (sl && pS) ? Math.abs(360 / sl) * pS : null; }
      return t.A.slopeDeg; }
    return null; };
  for (const q of quantities) {
    const t = base.targets.find((z) => z.label === q.target) || null;
    const mHalf = rawMeas(q, halfOf(t));
    q.numBoundDt2 = (Number.isFinite(mHalf) && Number.isFinite(q.meas)) ? Math.abs(q.meas - mHalf) : null;
    // 第251便c: ε_num を作った**定義**を記録する(dt 2 段で定義が食い違っていないことの機械確認)
    if (q.kind === 'period') q.numBoundDef = periastronFirst ? 'periastron' : 'revolution-or-osculating';
    // 第251便c: ε_num は「dt 2 段の差」ではなく**宣言**である。dt/2 と dt/4 の差の上限として
    // 記録し、収束次数を添える(本便の走行は dt と dt/2 の 2 段なので、次数は 2 段からの推定
    // であって測定ではない — order:null は「次数未測定」を意味する)。
    // 第253便b(第45報・ChatGPT §7.1): **dt 2 段の差は感度診断であって誤差上限ではない。**
    // 漸近域でも粗い側の真の誤差は 2^p/(2^p−1)·|Q_h−Q_{h/2}| で、|Q_h−Q_{h/2}| そのものは
    // それより**小さい**(p=1 なら 2 倍・p=2 なら 1.33 倍の開きがある)。したがって「上限としての宣言」
    // という旧文言を撤回し、**感度診断・上限未確認**と書く。3 段(dt, dt/2, dt/4)と正の実測次数が
    // 揃うまでは、この値を根拠に「数値は収束した」とは言わない(下の門の保留条件を参照)。
    // 第255便d(第47報 N8): dt/4 段が走っていれば **3 段**にする。ε_num の定義は第252便b ③ と
    // 同じ |Q_h − Q_{h/4}| へ、観測次数は p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| を実測値として
    // 入れる(**負でもそのまま入れる** — 門の側が order>0 を要求して落とす)。2 段のままの量は不変。
    const mQuarter = rawMeas(q, quarterOf(t));
    if (Number.isFinite(mQuarter) && Number.isFinite(mHalf) && Number.isFinite(q.meas)) {
      const d1 = q.meas - mHalf, d2 = mHalf - mQuarter;
      q.numBoundDt3 = Math.abs(q.meas - mQuarter);
      q.pObs = (d1 !== 0 && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
      q.dtStages = { dt: q.meas, dtHalf: mHalf, dtQuarter: mQuarter };
      q.numBoundDt2 = q.numBoundDt3;   // 門が読む ε_num を 3 段の定義へ差し替える
      q.numBoundDecl = numBoundDeclOf(q.numBoundDt3, 3, q.pObs);
    } else {
      q.numBoundDecl = (q.numBoundDt2 === null) ? null : numBoundDeclOf(q.numBoundDt2);
    }
    // 第258便d(W4): **h8 検査点**(--dt8 で名指しした系だけ)。4 段が揃うと 2 つのことが測れる:
    //   (a) 観測次数が h をもう 1 段細かくしても同じか(p_obs(h,h/2,h/4) 対 p_obs(h/2,h/4,h/8))
    //   (b) |Q_h−Q_{h/4}|/(1−4^−p) という**推定誤差**が、実測の |Q_{h/2}−Q_{h/8}| と整合するか
    const mEighth = rawMeas(q, eighthOf(t));
    if (Number.isFinite(mEighth) && Number.isFinite(mQuarter) && Number.isFinite(mHalf) && Number.isFinite(q.meas)) {
      const d2 = mHalf - mQuarter, d3 = mQuarter - mEighth;
      const pHalf = (d2 !== 0 && d3 !== 0) ? Math.log2(Math.abs(d2 / d3)) : null;
      q.h8 = { stages: { dt: q.meas, dtHalf: mHalf, dtQuarter: mQuarter, dtEighth: mEighth },
        pObs3: q.pObs, pObsShifted: pHalf,
        numBoundH4: q.numBoundDt3, numBoundH8: Math.abs(mHalf - mEighth),
        estimateFromH4: refinedNumBound(q.numBoundDt3, q.pObs),
        estimateFromH8: refinedNumBound(Math.abs(mHalf - mEighth), pHalf),
        richardson: (Number.isFinite(pHalf) && pHalf > 0)
          ? mEighth + (mEighth - mQuarter) / (Math.pow(2, pHalf) - 1) : null,
        note: '**h8 検査点**(第258便d): dt/8=0.002 まで走らせた 1 系だけの欄である。'
          + 'pObs3 は (h,h/2,h/4)・pObsShifted は (h/2,h/4,h/8) の観測次数で、'
          + '**2 つが揃っていれば漸近域に居る**と読める(揃わなければ居ない)。'
          + '門が読む ε_num は従来どおり |Q_h−Q_{h/4}| のままで、ここは記録である' };
    }
    // 第258便d(W4): ε_num の**推定誤差欄**(門は緩めない — |Q_h−Q_{h/4}| は上限ではないという記録)
    if (q.numBoundDecl && Number.isFinite(q.numBoundDecl.value))
      q.numBoundDecl.estimate = refinedNumBound(q.numBoundDecl.value,
        Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null,
        (q.numBoundDecl.steps >= 3) ? 4 : 2);
  }

  // ---------------------------------------------------------------- 第258便d(第50報 W4): deg/yr の門
  // 3 審査 v16 の一致点:「⚡ は **deg/yr の門**で判定する(unwrap した近点角を**実時刻**に線形 fit し、
  // 時系・年の長さ・傾きの共分散を記録する)。Hu 解の P_b/e_T と Kramer の ω̇ の**来歴を分ける**。
  // **単位を変えても比 2 は直らない**」。従来の判定量「°/周」は**別欄に残す**(消さない)。
  // ここでやるのは 3 つだけである:
  //   ① 近点角の実時刻 fit の傾き(deg/シミュレータ時間)を、scaleExp の T と**年の長さ**で deg/yr へ。
  //   ② CSV の deg/yr の値と σ を**換算せずにそのまま**使う(°/周 への換算は周期を 1 つ選ぶので、
  //      ⚡ では Kramer の ω̇ と Hu の P_b という**別解をまたぐ**)。
  //   ③ 同じ門(3σ+ε_num・ε_num ≤ 0.3σ・収束条件)を掛け、°/周 の門と**判定が動くか**を記録する。
  const degYearRow = sigBody ? SIGMA_TABLE.get(sigBody + '|periastron_advance') : null;
  const periodRow = sigBody ? SIGMA_TABLE.get(sigBody + '|orbital_period') : null;
  for (const q of quantities) {
    if (q.kind !== 'precession' || q.unit !== 'deg/orbit') continue;
    const t = base.targets.find((z) => z.label === q.target) || null;
    if (!t) continue;
    const tfOf = (x) => (x && x.A && x.A.timeFit && Number.isFinite(x.A.timeFit.slopeDegPerTime))
      ? x.A.timeFit : null;
    const f0 = tfOf(t), fH = tfOf(halfOf(t)), fQ = tfOf(quarterOf(t)), fE = tfOf(eighthOf(t));
    if (!f0) { q.degYear = { measured: false,
      reason: '**未走行/窓不足**: 近点角の実時刻 fit が取れない(検出器 A の近点が 2 個未満)' }; continue; }
    const dy = (f) => (f ? degPerYear({ slopeDegPerSimTime: f.slopeDegPerTime, toSec: P.toSec }) : null);
    const v0 = dy(f0), vH = dy(fH), vQ = dy(fQ), vE = dy(fE);
    let nb = null, pObs = null, stages = 1;
    if (Number.isFinite(vH)) { nb = Math.abs(v0 - vH); stages = 2; }
    if (Number.isFinite(vQ) && Number.isFinite(vH)) {
      nb = Math.abs(v0 - vQ); stages = 3;
      const d1 = v0 - vH, d2 = vH - vQ;
      pObs = (d1 !== 0 && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
    }
    const conv = (stages >= 3) && Number.isFinite(pObs) && pObs > 0;
    const obsV = (degYearRow && Number.isFinite(degYearRow.value)) ? degYearRow.value : null;
    const obsS = (degYearRow && Number.isFinite(degYearRow.sigma) && degYearRow.sigma > 0)
      ? degYearRow.sigma : null;
    q.degYear = { measured: true, unit: 'deg/yr', yearSec: YEAR_SEC,
      yearNote: '年の長さは**単位の約束**(ユリウス年 365.25 d = 3.15576×10⁷ s)であって観測ではない',
      meas: v0, stages: { dt: v0, dtHalf: vH, dtQuarter: vQ, dtEighth: vE }, nStages: stages,
      numBound: nb, pObs, converged: conv,
      numBoundEstimate: refinedNumBound(nb, pObs, (stages >= 3) ? 4 : 2),
      obs: obsV, sigma: obsS,
      timeFit: { nPeri: f0.nPeri, t0: f0.t0, t1: f0.t1, tSpanSim: f0.tSpan,
        tSpanSec: (Number.isFinite(f0.tSpan)) ? f0.tSpan * P.toSec : null,
        tSpanYr: (Number.isFinite(f0.tSpan)) ? f0.tSpan * P.toSec / YEAR_SEC : null,
        slopeDegPerSimTime: f0.slopeDegPerTime, seSlopeDegPerTime: f0.seSlopeDegPerTime,
        seDegPerYr: Number.isFinite(f0.seSlopeDegPerTime)
          ? degPerYear({ slopeDegPerSimTime: f0.seSlopeDegPerTime, toSec: P.toSec }) : null,
        varSlope: f0.varSlope, varIntercept: f0.varIntercept, covSlopeIntercept: f0.covSlopeIntercept,
        residRmsDeg: f0.residRmsDeg,
        note: '**横軸は時刻**(k·dt)であって近点番号ではない。共分散は fit の残差分散から作った '
          + '2×2(傾き・切片)である — 観測の誤差ではなく**この fit の内的な散らばり**である' },
      degPerOrbit: { meas: q.meas, obs: q.obs, unit: 'deg/orbit',
        note: '**別欄として残す**(第250便c 以来の判定量)。°/周 は周期を 1 つ選ばないと作れない' },
      provenance: {
        omegaDot: degYearRow ? String(degYearRow.source).slice(0, 110) : null,
        orbitalPeriod: periodRow ? String(periodRow.source).slice(0, 110) : null,
        separated: !!(degYearRow && periodRow
          && String(degYearRow.source).slice(0, 24) !== String(periodRow.source).slice(0, 24)),
        note: 'ω̇ と P_b の**来歴を分ける**。⚡ では ω̇ が Kramer et al. (2021) PRX 11 041050 Table IV、'
          + 'P_b は Hu et al. (2022) A&A 667 A149 の**別解**である。deg/yr の門は ω̇ の一次表だけを'
          + '使うので、°/周 への換算が持っていた「2 つの解をまたぐ」問題が無い' },
      ratioToObs: (Number.isFinite(v0) && Number.isFinite(obsV) && obsV !== 0) ? v0 / obsV : null };
    q.degYear.gate = assessDegYearGate({ value: v0, reference: obsV, sigma: obsS,
      numBound: nb, converged: conv });
  }

  const tally = {}; for (const v of VERDICTS6) tally[v] = 0;
  for (const q of quantities) tally[q.verdict] = (tally[q.verdict] || 0) + 1;

  report.push({ id: d.id, emoji: d.emoji, name: d.name, version,
    referenceKind: theory ? 'theory-control' : null,
    massCalibration: d.massCalibration, scaleExpT: d.scaleExp ? d.scaleExp.T : null,
    run: { n: base.n, dt: base.dt, steps: base.steps, wallSec: base.wallSec,
      orbits: base.targets.map((t) => ({ label: t.label, rev: t.revN, periA: t.A.nPeri, periB: t.B.nPeri })),
      nan: base.nan, clamp: base.clamp, warnings: base.warnings.length,
      dtHalf: half ? { dt: half.dt, steps: half.steps } : null,
      dtQuarter: quarter ? { dt: quarter.dt, steps: quarter.steps } : null,   // 第255便d(N8)
      dtEighth: eighth ? { dt: eighth.dt, steps: eighth.steps, wallSec: eighth.wallSec } : null,  // 第258便d(W4)
      // 第257便d: 段ごとの**計算時間予算**(機種依存の欄 — dt・近点数とは分けて置く)
      timeBudget: P.runs.map((z) => Object.assign({ tag: z.tag }, z.timeBudget || {})) },
    correlates, quantities, tally, notes });
}

// ---------------------------------------------------------------- 既存 JSON との併合(--merge)
// --only で一部だけ回し直したとき、既存の結果へその preset だけを差し替える(物理の再実行を減らす)。
let merged = report;
if (MERGE && fs.existsSync(OUT)) {
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const byId = new Map((prev.presets || []).map((r) => [r.id, r]));
    for (const r of report) byId.set(r.id, r);
    const order = decls.map((d) => d.id);
    merged = order.map((id) => byId.get(id)).filter(Boolean);
    console.error(`[w249b] --merge: 既存 ${(prev.presets || []).length} 本へ ${report.length} 本を差し替え → ${merged.length} 本`);
  } catch (e) { console.error('[w249b] --merge 失敗(新規として書く): ' + String(e).slice(0, 120)); }
}

// ---------------------------------------------------------------- 相関表(DFM 版のみ)
const dfm = merged.filter((r) => r.version === 'dfm' && !r.referenceKind);
const primaryResid = (r) => {
  // 「主要残差」= その版で最初に出てくる周期の |残差 %|(較正の対象そのもの)
  const q = r.quantities.find((x) => x.kind === 'period' && Number.isFinite(x.residualPct));
  return q ? Math.abs(q.residualPct) : null;
};
const corrKeys = ['nu', 'chi', 'GMac2', 'aOverR', 'e', 'spinRatio'];
const pairs = [];
{
  const rows = dfm.map((r) => ({ id: r.id, emoji: r.emoji, resid: primaryResid(r), c: r.correlates }))
    .filter((r) => r.resid !== null);
  for (const k of corrKeys) {
    const xs = [], ys = [], used = [];
    for (const r of rows) { const v = r.c[k];
      if (Number.isFinite(v)) { xs.push(v); ys.push(r.resid); used.push(r.emoji); } }
    pairs.push({ correlate: k, n: xs.length, rho: spearman(xs, ys), samples: used });
  }
  out.correlation = { method: 'spearman', target: '主要周期残差 |%|(DFM 版・理論対照を除く)',
    n: rows.length, rows: rows.map((r) => ({ id: r.id, emoji: r.emoji, residPct: r.resid, ...r.c })),
    pairs,
    caveat: '少数サンプル(n≈10)の順位相関である。**相関は原因ではない** — 同じ GM・a・e で ν だけを'
      + '掃引する識別試験(外部レビューの識別試験)を通すまでは、どの量も「合わない度合いの説明」ではない。'
      + ' 第250便c: **この行数は独立な天体観測の数ではない** — 同じ物理系の旧則版・PN variant'
      + '(psrDoubleABDFM と psrDoubleABSpinCal 等)が別行として入るので、n 行 ≠ n 天体である。'
      + ' χ の順位相関が小さいことから「引きずりが消えた・χ が要らない」とは結論しない。',
    nextTests: {
      nu: '同じ GM・a・e で質量比だけを振る(ν 0.05→0.25)— 残差が ν に沿って動くか',
      chi: 'D0pull を ×10 して χ だけを動かす(質量・軌道は不変)',
      GMac2: 'c を √2 倍して GM/(ac²) を半分にする(1PN チャネルの寄与を分離)',
      aOverR: '半径 R だけを ×2(軌道に効かないはず — 効けば引きずり則の半径依存)',
      e: '同じ a・M で e を 0.0→0.6 に振る',
      spinRatio: '中心スピンを 0 にする(スピン引きずりの寄与を分離)',
    } };
}

// ---------------------------------------------------------------- 第250便c: I2 の機械門を掛ける
// 5 区分(合/窓/否/従/転)は**不変**。門は別欄 q.gate に入れる。--merge で持ち越した過去分にも
// 同じ門を掛けるため、量そのものに残っている値(meas/obs/obsErr/detail/numBoundDt2)だけで判定する。
// 定義の一致は「同じ量の複数の定義・検出器が観測精度 σ_rel の中で一致しているか」で機械判定する:
//   周期 … 同方向1周 / 近点間 / osculating の広がり、近点移動 … 検出器 A と B、離心率 … 窓と接触要素。
const spreadPct = (vals) => { const v = vals.filter((z) => Number.isFinite(z) && z !== 0);
  if (v.length < 2) return null;
  const lo = Math.min(...v), hi = Math.max(...v);
  return 100 * Math.abs(hi - lo) / Math.abs(hi); };
for (const r of merged) for (const q of (r.quantities || [])) {
  // 第251便c: obsCard の文面に ± が無い量は **CSV の sigma 列**(q.obsSigmaCsv)を使う。
  // 一次表の照合(sourceVerified)は CSV の sigma_primary=verified を通ってきた σ にだけ立つ。
  // **CSV(出典表)を優先する** — obsCard の ± は同じ一次表の表示側の写しなので、出所の印
  // (sigma_primary)を持っている CSV 側を正本に採る。両方あるときの差は sigmaCardVsCsvRel に残す。
  const sigCard = (Number.isFinite(q.obsErr) && q.obsErr > 0) ? q.obsErr : null;
  const sigCsv = (Number.isFinite(q.obsSigmaCsv) && q.obsSigmaCsv > 0) ? q.obsSigmaCsv : null;
  const sig = (sigCsv !== null) ? sigCsv : sigCard;
  const sigFrom = (sigCsv !== null) ? 'csv' : ((sigCard !== null) ? 'obsCard' : null);
  const sigPct = (sig !== null && Number.isFinite(q.obs) && q.obs !== 0) ? 100 * Math.abs(sig / q.obs) : null;
  const d = q.detail || {};
  // 第251便c(ChatGPT §8.1): **定義差は誤差ではない**。門の definitionMatches が見るのは
  // 「**同じ定義**の検出器 A/B が観測精度 σ_rel の中で一致するか」(detSpread)だけである。
  // 定義違いの広がり(同方向1周/近点間/接触要素・窓と接触要素)は crossDef として**別欄に残し、
  // σ とは比較しない**。旧 JSON の行(定義メタデータ periodDef が無い)は昇格させない。
  let detSpread = null, crossDef = null, defMeta = true, defNote = '';
  // 第257便d: **A を正本**にする。定義が宣言されていて検出器 A の測定値を判定に使っている行が
  // `definitionDeclared:true`(= 門の definitionMatches)。A−B の広がりは門から外す。
  let defDeclared = false, defDeclNote = '';
  if (q.kind === 'period') {
    detSpread = spreadPct(Array.isArray(d.detPairSec) ? d.detPairSec : []);
    crossDef = spreadPct([d.revSec ? d.revSec[1] : null, d.periASec, d.oscSec]);
    defMeta = (typeof d.periodDef === 'string');
    defNote = defMeta
      ? `判定した定義=${d.periodDef}・検出器 A/B(同じ定義)の広がり=${detSpread === null ? '—' : detSpread.toExponential(2) + '%'}`
        + `(定義違いの広がり ${crossDef === null ? '—' : crossDef.toExponential(2) + '%'} は σ と比較しない)`
      : '**定義メタデータが無い行**(第251便c 以前の JSON)— 定義が宣言されるまで昇格させない';
    defDeclared = defMeta && d.periodDef !== 'unmeasured' && Number.isFinite(q.meas);
    defDeclNote = defDeclared
      ? `定義=${d.periodDef}・判定に採ったのは**検出器 A**(近点間は ṙ の −→+ 交差・20 近点窓)`
      : '定義が宣言されていない、または未測定';
  } else if (q.kind === 'precession') {
    detSpread = spreadPct([d.detectorA, d.detectorB]);   // 同じ「近点方位の直線 fit」の 2 検出器
    defNote = `検出器 A/B(同じ近点方位 fit)の広がり=${detSpread === null ? '—' : detSpread.toExponential(2) + '%'}`;
    defDeclared = Number.isFinite(d.detectorA) && Number.isFinite(q.meas);
    defDeclNote = defDeclared
      ? '定義=近点方位の直線 fit の傾き・判定に採ったのは**検出器 A**(第256便d ③ で真値復元 ≤2.1×10⁻¹¹ を実測した側)'
      : '検出器 A の傾きが取れない(窓不足・縮退)';
  } else if (q.kind === 'ecc') {
    crossDef = spreadPct([q.meas, d.eProxyAll, d.eOscMean]);
    defMeta = false;   // 同じ定義の 2 検出器が無い(1周目の窓・全窓・接触要素は別定義)
    defNote = '離心率は**同じ定義の 2 検出器が無い**(1周目の半径比・全窓・接触要素は別の量)— '
      + `定義違いの広がり ${crossDef === null ? '—' : crossDef.toExponential(2) + '%'} は σ と比較しない`;
    // 第257便d: 推定器そのものは宣言されている(1 周目の距離の極値の比)。止まるのは**観測量対応**の側。
    defDeclared = Number.isFinite(q.meas);
    defDeclNote = '定義=1 周目の距離の極値の比 eProxy(推定器は宣言されている)— '
      + '観測の量(e_T / ケプラー要素 e)との対応は別問題(mapping)';
  }
  const numBound = Number.isFinite(q.numBoundDt2) ? q.numBoundDt2 : null;
  // 第253便b(第45報・ChatGPT §7.1): **収束の保留条件**。`numBound !== null`(= dt 2 段が走った)
  // だけで「収束済み」としていたのは過剰だった —— dt 2 段の差は感度診断であって誤差上限ではない。
  // **3 段(dt, dt/2, dt/4)と正の実測次数が揃っていない結果は収束済みとしない**。
  // 本便の走行は 2 段・order:null なので、この条件は**全量で偽**になり、門の 3σ 判定は
  // 「数値未解決」へ保留される(判定を甘くする方向の変更ではない — 厳しくする方向である)。
  // --merge で持ち越した過去分の行にも第253便b の文言を張り直す(値・段数・次数は動かさない)
  if (q.numBoundDecl && Number.isFinite(q.numBoundDecl.value)) {
    q.numBoundDecl = numBoundDeclOf(q.numBoundDecl.value,
      Number.isFinite(q.numBoundDecl.steps) ? q.numBoundDecl.steps : 2,
      Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null);
    // 第258便d(W4): **ε_num の推定誤差欄**を、--merge で持ち越した過去分の行にも張る。
    // |Q_h−Q_{h/k}| は上限ではない —— 漸近形なら /(1−k^−p) 倍である(門は緩めも締めもしない)。
    q.numBoundDecl.estimate = refinedNumBound(q.numBoundDecl.value,
      Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null,
      (q.numBoundDecl.steps >= 3) ? 4 : 2);
  }
  const nbd = q.numBoundDecl || null;
  const convOK = numBound !== null && !!nbd
    && Number.isFinite(nbd.steps) && nbd.steps >= 3
    && Number.isFinite(nbd.order) && nbd.order > 0;
  // 第257便d: 観測量対応の宣言(自動判定ではない)
  const mapNote = MAPPING_UNRESOLVED(q.kind, r.id);
  const g = assessObservation({ value: q.meas, reference: q.obs, sigma: sig, numBound,
    converged: convOK,
    definitionMatches: defDeclared,
    mappingResolved: (mapNote === null), mappingNote: mapNote || '',
    sourceVerified: PRIMARY_VERIFIED.has(`${r.id}|${q.target}|${q.kind}`)
      || (sigFrom === 'csv' && q.sigmaPrimaryVerified === true) });
  g.key = `${r.id}|${q.target}|${q.kind}`;
  // 第257便d: **A 正本**の宣言と、A−B を測る別欄 `orbitNoiseIndicator`
  g.detectorCanonical = 'A';
  g.definitionDeclared = defDeclared; g.definitionDeclaredNote = defDeclNote;
  g.mappingResolved = (mapNote === null); g.mappingNote = mapNote;
  g.orbitNoiseIndicator = {
    abRelPct: detSpread, sigmaRelPct: sigPct,
    ratio: (detSpread !== null && sigPct !== null && sigPct > 0) ? detSpread / sigPct : null,
    meaning: '検出器 A(正本)と B(距離極小の放物線頂点)の相対差 [%]。**これは定義の一致度ではない** —— '
      + '第256便d ③ の合成軌道検定で、定義も推定器も 10⁻¹¹ 台で一致し、シミュレータ側の A−B は'
      + '**軌道側の位置雑音 ε≈10⁻¹⁰〜10⁻⁸ に対する検出器 B の感度**だと同定された。'
      + 'したがってこの欄は「**軌道側の相対 1e−10〜1e−8 の雑音に対する検出器差の感度**」であって、'
      + '門(3σ)には入らない。ratio は σ_rel を 1 とした目盛り(>1 = 雑音が観測精度より大きい)',
    gate: 'none(第257便d で門から外した — 第256便d までは definitionMatches の判定根拠だった)' };
  g.sigmaRelPct = sigPct; g.numBound = numBound;
  g.sigma = sig; g.sigmaFrom = sigFrom; g.sigmaSource = q.sigmaSource || null;
  g.sigmaCardVsCsvRel = (sigCard !== null && sigCsv !== null) ? Math.abs(sigCard / sigCsv - 1) : null;
  g.detSpreadPct = detSpread; g.defSpreadCrossDefPct = crossDef;
  // **旧鍵(第257便d で意味が変わった欄 — 読み替え表は out.keyAliases)**
  //   detSpreadPct / defSpreadPct … 値は同じ(A−B の相対差 %)だが、**門には入らない**。
  //   正名は g.orbitNoiseIndicator.abRelPct。旧欄は既存の器・QA が読むので残す。
  g.defSpreadPct = detSpread;   // 後方互換の欄名(= orbitNoiseIndicator.abRelPct・門からは外れた)
  g.defMeta = defMeta; g.definitionNote = defNote;
  g.deprecatedKeys = { defSpreadPct: 'orbitNoiseIndicator.abRelPct',
    detSpreadPct: 'orbitNoiseIndicator.abRelPct', defMeta: 'definitionDeclared(A 正本)' };
  g.numBoundDecl = q.numBoundDecl || null;   // ε_num は「感度診断」である(dt/4 は走らせていない)
  // 第253便b: 保留の理由を機械可読で残す(なぜ「数値未解決」なのかが JSON から辿れるように)
  g.convergence = { ok: convOK, steps: nbd ? nbd.steps : null, order: nbd ? nbd.order : null,
    rule: '3 段(dt, dt/2, dt/4)かつ実測次数 order>0 が揃うまで収束済みとしない(第253便b)',
    hold: convOK ? null : ((!nbd || !(nbd.steps >= 3)) ? 'dt 3 段が走っていない(2 段は感度診断)'
      : '収束次数が未測定または非正') };
  // 参考(判定ではない): 来歴・定義の条件を外し、3σ+ε_num の算術だけを見たときの成否
  g.arithOnly = (sig !== null && numBound !== null && Number.isFinite(q.meas) && Number.isFinite(q.obs))
    ? (Math.abs(q.meas - q.obs) <= 3 * sig + numBound) : null;
  q.gate = g;
}

// ---------------------------------------------------------------- 第258便d(第50報 W4)
// **① 条件不一致の隔離**。obsCard の行が「kFrame=0 対照」と要求しているのに、割り当てられている
// 測定値は kFrame=1 の走行のものである行が 8 行ある(🟠 木星衛星 4・🌇 金星・🥔 火星衛星の対照差・
// ❄️ 冥王星/カロン・🌊 海王星)。プリセットの physics は 1 つなので、**1 回の走行から 2 つの条件の
// 行へ同じ数値が配られていた**。これは「合っている」でも「合っていない」でもなく、**条件が違う**。
// 元の証拠は `conditionRejectedEvidence` に残し(捨てない)、判定を `条` にして tally を再計算する。
// **全 339 量に requiredContext / measurementContext を立てる**(新走行だけでなく、--merge で
// 持ち越した過去分にも。どの条件の走行から来た数値なのかが、行ごとに JSON から辿れるようにする)。
const conditionResult = enforceAllConditions(merged);
// **② 証拠付き予測の資格**。③(3σ)を通っただけでは ④ に数えない —— `usedForFit:false` /
// `validation:"held-out"` / `dataset` / `frozenProtocol` の 4 つが宣言として揃った量だけを数える。
// **現行の宣言は 0 件である**(プリセットにも CSV にもこの 4 つを書いた行が無い)。
for (const r of merged) for (const q of (r.quantities || [])) {
  const pe = predictionEligible(q);
  q.predictionEligible = pe.eligible;
  q.predictionEligibleReasons = pe.reasons;
}

out.presets = merged;   // decl/run の生データは残さず、判定済みの表を正本にする
// ---- 第250便c: 量の総数と、I2 の機械門の集計(5 区分の tally はそのまま残す)----
const allQ = merged.flatMap((r) => r.quantities || []);
const gateStatus = {}; for (const v of Object.values(GATE)) gateStatus[v] = 0;
const gateReason = {};
for (const q of allQ) { const st = (q.gate && q.gate.status) || GATE.NA;
  gateStatus[st] = (gateStatus[st] || 0) + 1;
  const rs = (q.gate && q.gate.reason) || '(判定済み)';
  gateReason[rs] = (gateReason[rs] || 0) + 1; }
const okQ = allQ.filter((q) => q.verdict === VER.OK);
const okSigma3 = okQ.filter((q) => q.gate && q.gate.status === GATE.OK).length;
const okGuide = okQ.filter((q) => q.guideTolerance && !(q.gate && q.gate.status === GATE.OK)).length;

// ---------------------------------------------------------------- 第257便d: **4 段判定の集計**
// 段は**排他ではない**(status は排他だが、こちらは「どこまで来たか」の階段である)。
//   ① 数値収束 … dt 3 段 + 正の観測次数 p_obs(第253便b の保留条件)
//   ② 観測量対応 … σ があり・定義(A 正本)が宣言され・観測量対応が確定し・一次表の印がある
//   ③ 観測適合 … 3σ+ε_num の門を通った(= status 合(3σ))
//   ④ 予測 … ③ のうち**較正の従属量でない**もの(較正質量 f≈2 が式へ入る量は予測ではない)
const hasSig = (q) => !!(q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0);
const stage1 = allQ.filter((q) => q.gate && q.gate.convergence && q.gate.convergence.ok === true);
const stage2 = allQ.filter((q) => hasSig(q) && q.gate.definitionDeclared === true
  && q.gate.mappingResolved === true
  && (PRIMARY_VERIFIED.has(q.gate.key) || (q.gate.sigmaFrom === 'csv' && q.sigmaPrimaryVerified === true)));
const stage3 = allQ.filter((q) => q.gate && q.gate.status === GATE.OK);
const stage4 = stage3.filter((q) => q.verdict !== VER.DEP);
// 第258便d(W4): **④ は「証拠付き予測」**へ。③ を通っただけでは数えない(宣言が 4 つ要る)。
const stage4ev = allQ.filter((q) => q.predictionEligible === true);
const mapUnres = allQ.filter((q) => q.gate && q.gate.status === GATE.MAP);
const condMis = allQ.filter((q) => q.gate && q.gate.status === GATE.COND);
out.summary = { nPresets: merged.length,
  stages: {
    note: '第258便d(第50報・3 審査 v16): 段は**階段ではない**。**①(数値収束)と ②(観測量対応)は'
      + '独立な集合**である —— 数値が収束していなくても観測量対応は宣言できるし、その逆もある'
      + '(①∩② が空でないだけで、①→② という順序は無い)。**④ ⊆ ③ だけが包含である**。'
      + '第258便d で ④ は「③ のうち従属量でないもの」から「**証拠付き予測**」へ狭めた ——'
      + '`usedForFit:false` / `validation:"held-out"` / `dataset` / `frozenProtocol` の 4 つが'
      + '宣言として揃った量だけを数える。**現行は 0 件である**(宣言が無い)。'
      + '**3σ は 1 mm も緩めていない**。',
    '①数値収束': stage1.length, '②観測量対応': stage2.length,
    '③観測適合(3σ)': stage3.length,
    '④予測(従属量でない③)': stage4.length,
    '④予測(証拠付き)': stage4ev.length,
    predictionNote: '「④予測(従属量でない③)」は第257便d までの弱い数え方(' + stage4.length + ' 件)で、'
      + '**証拠付き予測は ' + stage4ev.length + ' 件**である。③ を通ったからといって予測ではない ——'
      + 'fit に使っていないこと・hold-out であること・どのデータか・凍結手順、の 4 つが要る。',
    conditionMismatch: condMis.length,
    conditionMismatchKeys: condMis.map((q) => (q.gate && q.gate.key) || null),
    mappingUnresolved: mapUnres.length,
    mappingUnresolvedKeys: mapUnres.map((q) => (q.gate && q.gate.key) || null),
    stage3Keys: stage3.map((q) => q.gate.key),
    ng3Keys: allQ.filter((q) => q.gate && q.gate.status === GATE.NG).map((q) => q.gate.key),
    numUnresolvedKeys: allQ.filter((q) => q.gate && q.gate.status === GATE.NUM).map((q) => q.gate.key) },
  keyAliases: {
    note: '第257便d で意味の変わった鍵の**読み替え表**(欄そのものは消していない)。',
    'gate.defSpreadPct / gate.detSpreadPct': 'gate.orbitNoiseIndicator.abRelPct'
      + '(値は同じ・**門からは外れた**。第256便d までは definitionMatches の判定根拠だった)',
    'gate.definitionMatches(第256便d までの意味)': '「A/B の広がりが σ_rel の内側か」= 実際には軌道雑音の大小'
      + ' → 第257便d では gate.definitionDeclared(A を正本とした定義の宣言)と'
      + ' gate.orbitNoiseIndicator(A−B の感度)に分割した',
    'gate.defMeta': 'gate.definitionDeclared(旧欄は「同じ定義の 2 検出器が居るか」のまま残す)',
    'gate.status 未判定(理由=量の定義・検出器が観測精度で一致しない)':
      '第257便d では mapping-unresolved(観測量対応が未確定)か、定義未宣言の 未判定 のどちらかへ分かれる' },
  nQuantities: allQ.length,   // 第250便c: 「261(+)量」ではなく**確定表記**の量数
  tally: merged.reduce((a, r) => { for (const [k, v] of Object.entries(r.tally)) a[k] = (a[k] || 0) + v; return a; }, {}),
  byVersion: { obs: merged.filter((r) => r.version === 'obs').length,
    dfm: merged.filter((r) => r.version === 'dfm').length },
  gate: { rule: '|y_sim−y_obs| ≤ 3σ_obs + ε_num(ε_num ≤ 0.3σ_obs)。**ただし収束の保留条件**(第253便b): '
    + 'dt 3 段(dt, dt/2, dt/4)かつ正の実測次数 order>0 が揃うまで「収束済み」としない —— '
    + 'dt 2 段の差は**感度診断**であって誤差上限ではない(漸近域でも粗い側の誤差は 2^p/(2^p−1)|Q_h−Q_{h/2}|)。'
    + '第253便b の走行は 2 段・次数未測定なので、σ を持つ量はすべて「数値未解決」へ保留された。'
    + '**第255便d(第47報 N8)**: NS 4 系(⚡🧮🩺🧶)だけ --dt3 で 3 段を走らせ、観測次数 p_obs を実測した。'
    + '3 段+正の次数が揃った量は保留を抜け、**3σ の合否がその場で出る**(= 収束の門と観測一致の門が分かれた)。'
    + '**収束したことは一致したことではない** —— 次数が正でも残差が 3σ+ε_num を超えれば「否(3σ)」になる。'
    + '**第257便d(第49報)**: (a) `definitionMatches` を **A 正本**へ —— 判定に採るのは検出器 A で、'
    + '門が見るのは「定義が宣言されているか」だけになった。A−B は `orbitNoiseIndicator`(軌道側の'
    + '相対 1e−10〜1e−8 の雑音に対する検出器差の感度)として別欄へ出す。(b) 第 4 の状態 '
    + '`mapping-unresolved` を足した(観測量対応が未確定 — 例: タイミングの e_T と距離極値の eProxy)。'
    + '**3σ そのものは 1 mm も緩めていない**',
    byStatus: gateStatus, byReason: gateReason,
    withSigma: allQ.filter((q) => (q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0)).length,
    withSigmaBySource: {
      obsCard: allQ.filter((q) => q.gate && q.gate.sigmaFrom === 'obsCard').length,
      csv: allQ.filter((q) => q.gate && q.gate.sigmaFrom === 'csv').length },
    sourceVerified: allQ.filter((q) => q.sigmaPrimaryVerified === true
      && q.gate && q.gate.sigmaFrom === 'csv').length,
    arithOnlyPass: allQ.filter((q) => q.gate && q.gate.arithOnly === true).length,
    note: '5 区分(合/窓/否/従/転)は来歴・解釈の欄として不変(**CSV の σ は 5 区分の経路へ入れない** '
      + '— 第251便c: σ が効くのは門だけ)。門は別欄であり、第251便c で観測 σ の転写(paper/data/'
      + 'solar-observations.csv の sigma 列)と一次表の照合印(sigma_primary)が入った。'
      + '定義の一致は**同じ定義の検出器 A/B の広がり**だけで見る(定義違いの広がりは σ と比較しない)。'
      + '**第253便b(第45報)**: ε_num は dt 2 段の差であり、これは**感度診断**であって誤差上限ではない'
      + '(旧文言「上限としての宣言」は撤回)。門は 3 段+正の実測次数が揃うまで「収束済み」としない'
      + '保留条件を持つ。これは判定を甘くする条件ではなく、**「まだ言えない」を言えるようにする条件**である。'
      + ' **第256便d(第48報)**: 恒星 4 系 ✨✴️🌟💫 と 📻 を --dt3 で走らせ、保留を外した'
      + '(3 段が揃った量は 29 件)。**収束したことは合ったことではない** —— 保留が外れた 4 件のうち'
      + '2 件は「合(3σ)」、2 件(DFM 版 ✴️💫)は「否(3σ)」である。' },
  agreementBreakdown: { verdictOK: okQ.length, sigma3: okSigma3, guide: okGuide,
    unassessed: okQ.length - okSigma3 - okGuide,
    note: '「合」の内訳: sigma3 = 機械門を通った 3σ 一致 / guide = 観測誤差が読めないときの ±1% 目安'
      + '(観測一致ではない)/ unassessed = 観測誤差はあるが定義・一次表・数値収束の条件が未達。'
      + ' **第253便b**: 収束の保留条件(3 段+正の次数)を入れたので、2 段しか走っていない量は sigma3 に入らない'
      + '(第252便までの sigma3=2 件は一度「数値未解決」へ移った — 数値が悪くなったのではなく、'
      + '2 段の差を上限として使ってよいという根拠が無かったということである)。'
      + ' **第256便d(第48報)**: 恒星 4 系(✨✴️🌟💫)と 📻 を --dt3 で走らせて 3 段+正の次数を揃えた結果、'
      + '保留が外れて**合否がその場で出た** —— 観測版 ✨🌟 が「合(3σ)」、**DFM 版 ✴️💫 が「否(3σ)」**である'
      + '(sigma3 が 0 でなくなったのは、判定が甘くなったからではなく、保留の条件を満たしたからである)。' } };

// ---------------------------------------------------------------- 第258便d(W4): 3 つの新しい欄
// (a) 条件不一致の一覧(隔離した行と、捨てていない元の証拠)
out.conditionMismatch = { n: conditionResult.n, rows: conditionResult.isolated,
  rule: '行が明記している条件(現行の宣言は kFrame だけ)と、その行に割り当てられている測定値の'
    + '走行条件が違うとき、判定を `条`(condition-mismatch)にして隔離する。**宣言である**'
    + '(閾値による自動判定ではない)。元の測定値・残差は conditionRejectedEvidence に残す —— '
    + '**数値が間違っているのではなく、行の割り当てが間違っている**。',
  fix: '対照条件の走行を**別に**行い、その行へ割り当てる。プリセットの physics は変えない'
    + '(検証器の中で physics を差し替えた診断コピーを走らせる)。',
  note: '**「対照が合っていた」という記録は、この便で 1 件も残っていない** —— '
    + '対照条件の走行そのものが行われていなかったからである。' };
// (b) deg/yr の門(⚡🧮🩺🧶 の近点移動)
{
  const rows = [];
  for (const r of merged) for (const q of (r.quantities || [])) {
    if (!q.degYear || q.degYear.measured !== true) continue;
    rows.push({ id: r.id, emoji: r.emoji, target: q.target,
      measDegPerYr: q.degYear.meas, obsDegPerYr: q.degYear.obs, sigmaDegPerYr: q.degYear.sigma,
      ratio: q.degYear.ratioToObs, nSigma: q.degYear.gate ? q.degYear.gate.nSigma : null,
      statusDegYear: q.degYear.gate ? q.degYear.gate.status : null,
      statusDegPerOrbit: q.gate ? q.gate.status : null,
      moved: !!(q.gate && q.degYear.gate && q.gate.status !== q.degYear.gate.status),
      measDegPerOrbit: q.meas, obsDegPerOrbit: q.obs,
      ratioDegPerOrbit: (Number.isFinite(q.meas) && Number.isFinite(q.obs) && q.obs !== 0) ? q.meas / q.obs : null,
      tSpanYr: q.degYear.timeFit ? q.degYear.timeFit.tSpanYr : null,
      nPeri: q.degYear.timeFit ? q.degYear.timeFit.nPeri : null,
      seDegPerYr: q.degYear.timeFit ? q.degYear.timeFit.seDegPerYr : null,
      provenanceSeparated: q.degYear.provenance ? q.degYear.provenance.separated : null });
  }
  out.degYearGate = { n: rows.length, rows,
    rule: '近点角を unwrap して**実時刻**に線形 fit し、傾きを deg/yr へ直して CSV の deg/yr の'
      + '値・σ と**換算せずに**比べる。°/周 は別欄に残す(degPerOrbit)。',
    unitNote: '**単位を変えても比は直らない** —— ratio(deg/yr)と ratioDegPerOrbit を並べて置いたのは'
      + 'そのためである。比が 2 に近いのは単位の取り違えではない。',
    provenanceNote: '⚡ の ω̇ は Kramer et al. (2021) PRX 11 041050 Table IV、P_b は Hu et al. (2022) '
      + 'A&A 667 A149 の**別解**である。deg/yr の門は ω̇ の一次表だけを使うので、'
      + '°/周 への換算が持っていた「2 つの解をまたぐ」問題が無い。',
    moved: rows.filter((z) => z.moved).length };
}
// (c) h8 検査点(--dt8 で名指しした系だけ。走らせていない系は **未走行** と書く)
{
  const rows = [];
  for (const r of merged) for (const q of (r.quantities || [])) {
    if (!q.h8) continue;
    rows.push({ id: r.id, emoji: r.emoji, kind: q.kind, target: q.target,
      stages: q.h8.stages, pObs3: q.h8.pObs3, pObsShifted: q.h8.pObsShifted,
      numBoundH4: q.h8.numBoundH4, numBoundH8: q.h8.numBoundH8,
      estimateFromH4: q.h8.estimateFromH4 ? q.h8.estimateFromH4.refined : null,
      estimateFactorH4: q.h8.estimateFromH4 ? q.h8.estimateFromH4.factor : null,
      richardson: q.h8.richardson });
  }
  out.h8 = { requested: DT8 || null, n: rows.length, rows,
    notRun: DT8 ? null : '**未走行**(--dt8 を指定していない走行である)',
    rule: 'dt/8=0.002 の 4 段目。pObs3=(h,h/2,h/4)・pObsShifted=(h/2,h/4,h/8) の観測次数を並べる'
      + '(**2 つが揃えば漸近域に居る**と読める)。門が読む ε_num は |Q_h−Q_{h/4}| のままで、'
      + '**|Q_h−Q_{h/4}| は上限ではない** —— 漸近形なら /(1−4^−p) 倍(p≈1 で 4/3)である。' };
}
// (d) 40 本の**再判定台帳**(docs/CALIBRATION_VERDICT_v1.44.md の正本 — QA が突き合わせる)
{
  const V4 = { OK: '合', LIM: '量限定合', NG: '否', HOLD: '保留' };
  const ledger = merged.map((r) => {
    const qs = r.quantities || [];
    const st = (s) => qs.filter((q) => q.gate && q.gate.status === s);
    const ng = st(GATE.NG), ok = st(GATE.OK), num = st(GATE.NUM), map = st(GATE.MAP), cond = st(GATE.COND);
    const withSig = qs.filter((q) => q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0);
    // 4 値: 否 > 量限定合 > 保留。**「合」は「その系のすべての判定量が 3σ を通った」ときだけ** ——
    // 現行は 0 本である(どの系も σ の付いた量がすべて通ってはいない)。
    let v4 = V4.HOLD;
    if (ng.length) v4 = V4.NG;
    else if (ok.length) v4 = (ok.length === withSig.length && withSig.length > 0) ? V4.OK : V4.LIM;
    const missing = [];
    if (cond.length) missing.push('条件不一致');
    if (!withSig.length) missing.push('σ 未接続');
    if (map.length) missing.push('写像未確定');
    if (num.length) missing.push('数値精度');
    if (qs.every((q) => !Number.isFinite(q.meas))) missing.push('未測定');
    if (!missing.length) missing.push('(3σ を通った量がある — 残りは量の不足)');
    const rep = (() => {
      const c = ok[0] || ng[0] || num[0] || withSig[0] || null;
      return c ? { kind: c.kind, nSigma: (c.gate && Number.isFinite(c.gate.nSigma)) ? c.gate.nSigma : null,
        residualPct: Number.isFinite(c.residualPct) ? c.residualPct : null } : null;
    })();
    // **保存済み代表残差**(σ の有無に依らず、観測と突き合わせた量が残している残差)。
    // 条件不一致で隔離した行は**含めない**(その行の残差は conditionRejectedEvidence にある)。
    const cmp = qs.filter((q) => Number.isFinite(q.obs) && Number.isFinite(q.meas)
      && q.verdict !== VERDICT_CONDITION);
    const per = cmp.find((q) => q.kind === 'period' && Number.isFinite(q.residualPct)) || null;
    const worst = cmp.filter((q) => Number.isFinite(q.residualPct))
      .sort((a, b) => Math.abs(b.residualPct) - Math.abs(a.residualPct))[0] || null;
    // **分類変更の提案**(提案だけ — プリセット JSON は 1 bit も変えない)。機械的な条件は 2 つ:
    //   (a) 参照が観測でない(referenceKind:"theory-control")/ (b) 観測と突き合わせた量が 0 件
    // どちらかなら「原理/参照」へ移す提案を立てる。**現実較正に数えない**という提案であって、
    // そのサンプルが要らないという意味ではない。
    const proposeRef = (r.referenceKind === 'theory-control') || cmp.length === 0;
    return { id: r.id, emoji: r.emoji, version: r.version,
      referenceKind: r.referenceKind || null, verdict4: v4,
      gateCounts: { ok: ok.length, ng: ng.length, num: num.length, map: map.length,
        cond: cond.length, withSigma: withSig.length, nQ: qs.length },
      representative: rep, missing,
      comparedCount: cmp.length,
      residualPeriodPct: per ? per.residualPct : null,
      residualWorst: worst ? { kind: worst.kind, pct: worst.residualPct } : null,
      classProposal: proposeRef ? '原理/参照' : null,
      classProposalReason: proposeRef
        ? ((r.referenceKind === 'theory-control') ? '参照が観測ではなく理論値である(referenceKind:"theory-control")'
          : '観測と突き合わせた量が 0 件である(転写・帳簿・宣言だけ)')
        : null,
      predictionEligible: qs.filter((q) => q.predictionEligible === true).length };
  });
  out.verdictLedger = { n: ledger.length, values: Object.values(V4), rows: ledger,
    counts: Object.values(V4).reduce((a, v) => { a[v] = ledger.filter((z) => z.verdict4 === v).length; return a; }, {}),
    rule: '**4 値**(合/量限定合/否/保留)。「合」は**その系の σ を持つ判定量がすべて 3σ を通った**ときだけ。'
      + '「量限定合」は一部の量だけが通った系。「否」は 3σ を外した量がある系。'
      + '「保留」は**判定できない**系(σ 未接続・写像未確定・数値精度・未測定・条件不一致)——'
      + '**保留は否定ではない**(物理仮説が否定されたという意味ではまったくない)。',
    note: 'docs/CALIBRATION_VERDICT_v1.44.md はこの欄の転記である(QA docs.calibration-verdict-sync が照合する)。' };
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`[w249b] wrote ${OUT}`);
console.error('[w249b] 判定集計 ' + JSON.stringify(out.summary.tally));
console.error('[w258d] 条件不一致 ' + out.conditionMismatch.n + ' 行 / 証拠付き予測 '
  + out.summary.stages['④予測(証拠付き)'] + ' 件(従属量でない③ は '
  + out.summary.stages['④予測(従属量でない③)'] + ' 件)/ 門 '
  + JSON.stringify(out.summary.gate.byStatus));
console.error('[w258d] 4 値 ' + JSON.stringify(out.verdictLedger.counts)
  + ' / deg/yr 門 ' + out.degYearGate.n + ' 行(判定が動いた行 ' + out.degYearGate.moved + ')'
  + ' / h8 ' + out.h8.n + ' 欄');
for (const z of out.degYearGate.rows) console.error(`  ${z.emoji} ${z.id} deg/yr ${z.measDegPerYr === null ? '—' : z.measDegPerYr.toPrecision(7)}`
  + ` 対 ${z.obsDegPerYr} (比 ${z.ratio === null ? '—' : z.ratio.toFixed(4)}・°/周の比 ${z.ratioDegPerOrbit === null ? '—' : z.ratioDegPerOrbit.toFixed(4)})`
  + ` ${z.statusDegYear} / °周 ${z.statusDegPerOrbit}`);
for (const p of pairs) console.error(`  ρ(${p.correlate}) = ${p.rho === null ? 'n/a' : p.rho.toFixed(3)} (n=${p.n})`);
