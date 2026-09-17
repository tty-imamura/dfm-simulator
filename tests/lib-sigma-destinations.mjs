// 第268便a(第58報 W1・統括の読み (C)): **σ の宛先表の共通モジュール**(副作用なし)。
//
// ■ 何をするモジュールか
//   `tests/exp-w249b-calaudit.mjs` の中にあった 3 つの宣言表(`SIGMA_BODY` / `SIGMA_QUANT` /
//   `SIGMA_TARGET_BODY`)を、**内容を 1 文字も変えずに**ここへ移した(コメントもそのまま運ぶ)。
//   移した理由は、**同じ表を「器のソースの文字列検索」で読んでいた場所が 2 つあった**からである:
//     ・`tests/exp-w265a-analogy.mjs` … `CAL_SRC.indexOf("'47 Tuc'")`
//     ・`tests/qa.mjs` の `docs.clusterGalaxySigma` ⑤ … `calSrc.indexOf("'47 Tuc'")`
//   ソース文字列検索は**コメントの中に書かれた body 名でも当たる**し、**値としてではなく鍵として**
//   書かれた名前にも当たる。宣言表そのものを読めばその曖昧さは消える。
//
// ■ このモジュールが**言わないこと**
//   宛先があることは「**接続候補である**」ことであって、**採用解でも・単位の一致でも・観測量対応の
//   確定でも・判定に必要な 2 量が揃っていることでもない**。`gateWiringCensus` が返すのは
//   **接続候補の数**である(門を通ったという意味ではない)。
//
// ■ 副作用は無い(CSV も JSON も読まない・走行しない・出力も書かない)。

// preset id → CSV の body 名(**相対軌道の要素を持つ行** = 伴星側の行)
export const SIGMA_BODY = {
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
  // 第264便a(第56報 W1・統括の裁定 X14): **案K variant 3 本の宛先が抜けていた**。
  // 🪝🪄🩹 は同じ系の DFM 版(⚡🧮🩺)と同じ body を見ているのに、この表に行が無いせいで
  // 門からは「σ 無し」に見えていた(📿🪤 は行があったが**走行が σ 転写より前**だった — §5.8.4)。
  // **値は 1 つも動かない**: 読める σ を読むようにしただけである(CSV は 1 bit も触っていない)。
  psrDoubleABCF: 'PSR J0737-3039 B', psrJ1757CF: 'PSR J1757-1854', psrJ1946CF: 'PSR J1946+2052',
  // 第256便d: ⚡ の ω̇ 行(periastron_advance)が CSV へ入ったので、近点移動にも σ が付く
  // (第251便c ⑥′ が保留していた行 —— 保留の理由だった 📻 の経路等価は QA 側で解いた)。
};
export const SIGMA_QUANT = { period: 'orbital_period', ecc: 'eccentricity', precession: 'periastron_advance' };
// ---------------------------------------------------------------- 第262便d(第54報 W4・統括の読み (A)・検証仮説 (10))
// **太陽系 16 本の σ 接続**。`SIGMA_BODY` は「preset → CSV の body 名」で、しかも
// **最初の周回体にしか当たらない**(applySigma の `t.label !== cfg.orbiters[0][1]`)。太陽系は
// 1 本の preset が複数の周回体を持つので、**target ラベルごとの宣言表**を別に置く。
// **宣言であって自動判定ではない** —— CSV に行が無い天体は、ここに書かない(推測で当てない)。
// **値は 1 つも動かない**: ここで繋がる CSV 行は**全部 sigma 列が空欄**なので、
// `applySigma` は `sigmaSource` と `sigmaNote`(診断の文字列)を書くだけで、
// `obsSigmaCsv` は 1 件も立たない = 門の判定は 1 bit も変わらない。
// **切れているのは対応表ではなく CSV の sigma 列と行そのものである**ことを、
// `tests/exp-w262d-solarsigma.mjs` が数で示す(合 0 / 量限定合 0 / 否 0 / 保留 16)。
// ---------------------------------------------------------------- 第264便d(第56報 W4・統括の読み (E))
// **2026-09-15 intake で CSV に行が入った天体を宣言表へ足した**(月・地球・水星・ガリレオ 4 衛星・
// 土星系 4 対象)。第262便d と同じ理由で **値は 1 つも動かない**: ここで繋がる CSV 行は
// **sigma 列が全部空欄**なので、`applySigma` は `sigmaSource` と `sigmaNote` を書くだけで
// `obsSigmaCsv` は 1 件も立たない = 門の判定は 1 bit も変わらない。
// **宣言であって推測ではない** —— CSV に行が無い対象はここに書かない。
export const SIGMA_TARGET_BODY = {
  'venusReal|金星': 'Venus', 'solarInner|金星': 'Venus', 'solarInner|火星': 'Mars',
  // 第264便d: 2026-09-15 intake で行が入った対象
  'earthMoonReal|月': 'Moon', 'earthMoonRealKF1|月': 'Moon', 'emAuditDFM|月': 'Moon',
  'emAuditSolar|月': 'Moon',
  'mercuryReal|水星': 'Mercury', 'mercuryRealKF1|水星': 'Mercury', 'solarInner|水星': 'Mercury',
  'solarInner|地球': 'Earth',
  'jupiterGalilean|イオ': 'Io', 'jupiterGalilean|エウロパ': 'Europa',
  'jupiterGalilean|ガニメデ': 'Ganymede', 'jupiterGalilean|カリスト': 'Callisto',
  'saturnZonalD68|D68': 'Saturn ring feature D68',
  'saturnRingReal|ミマス': 'Mimas', 'saturnRingRealKF1|ミマス': 'Mimas',
  'saturnRingReal|タイタン': 'Titan', 'saturnRingRealKF1|タイタン': 'Titan',
  'saturnRingReal|C環内縁': 'Saturn ring C inner edge',
  'saturnRingRealKF1|C環内縁': 'Saturn ring C inner edge',
  'marsMoonsReal|フォボス': 'Phobos', 'marsMoonsReal|ダイモス': 'Deimos',
  'plutoCharonReal|カロン': 'Charon',
  'uranusReal|ミランダ': 'Miranda', 'uranusReal|アリエル': 'Ariel',
  'uranusReal|ウンブリエル': 'Umbriel', 'uranusReal|チタニア': 'Titania', 'uranusReal|オベロン': 'Oberon',
  'neptuneReal|トリトン': 'Triton',
};

// ---------------------------------------------------------------- 第268便a(第58報 W1・統括の読み (C))
// **門が読む量**(`SIGMA_QUANT` の値の集合)。`_candidate` の付いた鍵は**別の鍵**であって、
// 門はそれを読まない(第266便a の実測 —— カロン P の verified σ は候補行に居て判定行に入らない)。
export const GATE_QUANTITIES = Object.freeze(Object.values(SIGMA_QUANT));

// 宛先として**値に**現れる body の全集合(**鍵ではなく値**を見る — 鍵は preset id である)。
export function wiredBodies() {
  return Array.from(new Set([...Object.values(SIGMA_BODY), ...Object.values(SIGMA_TARGET_BODY)]));
}
export function isWiredBody(body) { return wiredBodies().indexOf(body) >= 0; }

// **接続候補の判定**(第268便a・統括の読み (C))。
//   「**同じ body・同じ quantity の行**に、**宛先の配線**と **`verified` の σ(σ>0)**が揃っているか」。
//   ・`_candidate` の鍵は門が読まないので数えない(**別の鍵**である)。
//   ・別の body の行・σ が空/0 の行・印が `unverified` の行は数えない。
//   rows = [{ body, quantity, sigma, primaryVerified }](CSV の読み方は呼ぶ側の責任)。
//   **これは接続候補の数であって、採用解・単位・観測量対応・必要 2 量の充足ではない。**
export function gateWiringCensus(rows, bodies) {
  const sel = (rows || []).filter((r) => bodies.indexOf(r.body) >= 0);
  const wired = bodies.filter((b) => isWiredBody(b));
  const hit = sel.filter((r) => wired.indexOf(r.body) >= 0
    && GATE_QUANTITIES.indexOf(r.quantity) >= 0
    && Number.isFinite(r.sigma) && r.sigma > 0 && r.primaryVerified === true);
  return {
    rows: sel.length,
    withSigma: sel.filter((r) => Number.isFinite(r.sigma) && r.sigma > 0).length,
    withVerifiedSigma: sel.filter((r) => Number.isFinite(r.sigma) && r.sigma > 0
      && r.primaryVerified === true).length,
    withWiredVerifiedSigma: hit.length,
    connectedQuantities: Array.from(new Set(hit.map((r) => r.quantity))),
    wiredToGate: wired.length, wiredBodies: wired,
    quantities: Array.from(new Set(sel.map((r) => r.quantity))),
    note: '**接続候補の判定である** —— 採用解・単位の一致・観測量対応・必要 2 量の充足は別に見る',
  };
}
