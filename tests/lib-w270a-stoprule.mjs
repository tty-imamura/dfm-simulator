// 第270便a(第60報 W1・AE9): **走行の停止条件を「步数上限と必要近点数の宣言」にする純関数**。
//
// ■ 何を直すか(第257便d 以来の穴)
//   `tests/exp-w249b-calaudit.mjs` は 1 段あたりの走行長を
//       budgetSteps = **実測した步/秒** × 時間予算(既定 80 s)
//   から決めていた。つまり **走行長が計算機の速さで変わる**。重いサンプルの上限
//   (`hardCap = budgetSteps × 2`)も同じ量から作られていたので、
//   **同じコード・同じ入力でも機種が違えば近点の本数が変わり、判定が 転↔否 で動く**
//   (🌘 earthMoonRealKF1 の 26 近点は 40,000,000 步まで走れたときの数である)。
//   時間予算は**資源の話**であって精度条件ではない。数値の性質(刻み・近点数)と混ぜてはならない。
//
// ■ 新しい停止条件(**宣言**であって自動判定ではない)
//   ① **步数上限** `maxSteps` …… 系の大きさ(実行時 n)の階級ごとに宣言する。階級で足りない系は
//      **preset ごとに宣言表へ書く**(推測で埋めない —— 宣言の無い重い系は器を止める)。
//   ② **必要近点数** `needPeriastra` …… その段の測定が成立するために要る近点の本数。既定は
//      第252便b の近点窓 20。換算判定(第270便a の AD8)を持つ系は fit 窓の本数を宣言する。
//   ③ 走行長は **min(宣言した步数上限, 60 公転ぶんの步数)** で決まる。60 公転ぶんは
//      **t=0 の接触要素**(刻みと質量だけで決まる量)から作るので、**機種に依存しない**。
//   ④ 壁時計は **資源上限**にだけ残す。超えた段は `resource-limit` で **unmeasured** にし、
//      **途中までの軌道を最終判定へ流さない**(打ち切った軌道から作った値を判定に使わない)。
//
// ■ 既定値をどう決めたか(**実測して決めた**)
//   基点 f6c19b4 の走行(`tests/data-w270a-stoprule-base.json` = 当時の JSON からの機械抽出)を
//   読み、**同じ步数・同じ近点数が埋まる**ように逆算した。階級の上限 40,000,000 / 20,000,000 は
//   第249便b の `hardCap` がもともと持っていた宣言値そのもので、重い 4 系の値は基点の走行が
//   到達した步数である(`PRESET_MAX_STEPS` の各行にその由来を書いた)。
//   **これは「この步数で収束する」という主張ではない** —— 走行長の宣言であって精度条件ではない。
//
// ■ このモジュールが言わないこと
//   「停止条件を入れたので判定が確定した」「步数を宣言したので収束した」。
//   停止条件は**どこで止めるか**を機種に依らず決めるだけである。

// ---------------------------------------------------------------- 第271便a(第61報・AF3)
// ■ **停止条件を「版つきの既定規約」として恒久化する**
//   第270便a では停止条件は「この便で入れた規則」だった。本便でそれを**版つきの規約**にする ——
//   規約の中身(步数上限の階級表・preset 宣言・必要近点数・資源上限・未完走の語彙)は
//   `STOP_RULE_SPEC` に 1 か所へまとめ、**版を上げずに中身を変えられないように QA で機械固定する**
//   (`docs.stopRuleVersion`)。**全系一律の步数(668,676 步)にはしない** —— 系ごとに 60 公転ぶんの
//   步数は違うので、一律の步数は「同じ窓を見ている」ことを意味しない。
//   版の履歴:
//     ・`w270a-1`(第270便a)…… 初版。階級 40e6/20e6・preset 宣言 4 本・必要近点 20(📡 58)。
//     ・`w271a-1`(第271便a)…… **preset 宣言を 5 本へ**(❄️ plutoCharonReal を足した ——
//       AF2 の 3 段登録で dt/2・dt/4 が階級上限 40e6 に切られ、**3 段で近点の本数が揃わない**
//       ことを先に計算で確かめたうえで、60 公転ぶんの步数を宣言表に書いた)。
//   **これは「この步数で収束する」という主張ではない**(走行長の宣言であって精度条件ではない)。
export const STOP_RULE_VERSION = 'w271a-1';
export const DT_BASE = 0.016;            // アプリ既定の刻み(beta/index.html の const DT)
export const ORB_MAX_DEFAULT = 60;       // 直接法で数える上限公転数(第249便b の宣言)
export const PERI_WINDOW_DEFAULT = 20;   // 第252便b の近点窓(19 区間)

// ---------------------------------------------------------------- ① 步数上限の宣言
// 実行時 n の階級ごとの上限。**第249便b の `hardCap` の宣言値をそのまま引き継いだ**
// (n≤3 → 40,000,000 步 / n≤12 → 20,000,000 步)。刻みを細かくしても**この上限は動かない**
// (基点と同じ挙動 —— 上限は「1 段に許す步数」であって物理時間ではない)。
export const CLASS_MAX_STEPS = [
  { maxN: 3, maxSteps: 40000000, why: '第249便b の hardCap(n≤3)の宣言値' },
  { maxN: 12, maxSteps: 20000000, why: '第249便b の hardCap(n≤12)の宣言値' },
];
// 階級で決められない系(実行時 n>12 の多体・環)は **preset ごとに宣言する**。
// 値は基点 f6c19b4 の走行が実際に走った步数である(= 同じ近点数が埋まる)。
// **刻みに反比例して倍にする**(同じ物理時間を覆うため —— これらの系は基点では dt 段しか
// 走っていないので、dt/2・dt/4 を走らせるときに同じ窓を覆えるようにする宣言である)。
export const PRESET_MAX_STEPS = {
  solarInner: { maxSteps: 866426, scalesWithDt: true,
    why: '基点 f6c19b4 の 🌞 dt 段が走った步数(近点 9/5/3/2・20 近点窓は未充足のまま)' },
  uranusReal: { maxSteps: 1075028, scalesWithDt: true,
    why: '基点 f6c19b4 の 💠 dt 段が走った步数(近点 14/7/4/2/1)' },
  saturnRingReal: { maxSteps: 2042988, scalesWithDt: true,
    why: '基点 f6c19b4 の 💍 dt 段が走った步数(近点 63/36/3)' },
  saturnRingRealKF1: { maxSteps: 254730, scalesWithDt: true,
    why: '基点 f6c19b4 の 💿 dt 段が走った步数(近点 13/2/1)' },
  // 第271便a(AF2): ❄️ **カロンを 3 段登録する前に步数を計算した**。dt 段は 1 公転 344,908 步で、
  // 60 公転 = 20,694,498 步(階級上限 40e6 の内側)。ところが **dt/2 は 41,388,996 步・
  // dt/4 は 82,777,992 步**で、どちらも階級上限 40e6 を**超える** —— そのまま 3 段を走らせると
  // h/h2/h4 で近点の本数が 59/57/28 本になり、**3 段の fit 窓が揃わない**(AD4 の窓充足を満たさない)。
  // したがって **60 公転ぶんの步数を preset 宣言として書く**(階級上限を全系で上げるのではない)。
  // **上限を上げたのではなく、この 1 系の走行長を宣言した**という意味である。
  plutoCharonReal: { maxSteps: 20694498, scalesWithDt: true,
    why: '第271便a(AF2): ❄️ の 60 公転ぶんの步数(dt 段 1 公転 344,908 步 × 60)。'
      + 'dt/2・dt/4 は刻みに反比例して 41,388,996 / 82,777,992 步 —— '
      + '**3 段で同じ 60 公転の窓を覆うための宣言**である(階級上限 40e6 では h/4 が 29 公転で切れる)' },
};

// ---------------------------------------------------------------- ② 必要近点数の宣言
// 既定は第252便b の近点窓(20)。**judged window が違う系はここに書く**(自動判定はしない)。
export const PRESET_NEED_PERIASTRA = {
  // 第270便a(AD8): 📡 の換算判定は**傾き fit と同じ近点集合**(58 近点・57 区間)の近点間周期で
  // 割る。したがって 58 近点が埋まらない段は**換算不能**であり、判定へ流さない。
  saturnZonalD68: { needPeriastra: 58, why: '第270便a(AD8)の換算判定の fit 窓(58 近点・57 区間)' },
};

// ---------------------------------------------------------------- ④ 壁時計(資源上限)
// **判定条件ではない**。超えた段は `resource-limit` で unmeasured にする(途中軌道を流さない)。
// 既定 900 s は基点の最長段(🌞 487.0 s)の約 1.8 倍で、**現行の走行では 1 段も超えない**
// (超えないことを器が数で記録する —— 「効いていない上限」であることを隠さない)。
export const WALL_CEILING_SEC_DEFAULT = 900;

// ---------------------------------------------------------------- 第271便a(第61報・AF3)
// **既定規約の版つき宣言**(1 か所)。QA `docs.stopRuleVersion` がこの表と実際の定数の一致、
// および文書(docs/CALIBRATION_VERDICT_v1.44.md)に同じ版が書かれていることを機械固定する。
// **中身を変えるときは版を上げる**(版を上げずに宣言を変えたら QA が落ちる)。
export const STOP_RULE_SPEC = {
  version: STOP_RULE_VERSION,
  rule: '1 段の步数 = min(**宣言した步数上限**, 60 公転ぶんの步数)。60 公転ぶんは t=0 の接触要素'
    + '(刻みと質量だけで決まる量)から作る —— **步/秒も壁時計も入らない**。',
  classMaxSteps: CLASS_MAX_STEPS,
  presetMaxSteps: PRESET_MAX_STEPS,
  presetNeedPeriastra: PRESET_NEED_PERIASTRA,
  needPeriastraDefault: PERI_WINDOW_DEFAULT,
  orbMaxDefault: ORB_MAX_DEFAULT,
  wallCeilingSec: WALL_CEILING_SEC_DEFAULT,
  wallClock: '壁時計は**資源上限だけ**である(判定条件ではない)。超えた段は `resource-limit` で '
    + '**unmeasured** にし、途中までの軌道を最終判定へ流さない。',
  unmeasuredVocabulary: ['max-steps', 'window', 'resource-limit'],
  notUniform: '**全系一律の步数(例 668,676 步)にはしない** —— 系ごとに 60 公転ぶんの步数は違うので、'
    + '一律の步数は「同じ窓を見ている」ことを意味しない。',
  history: [
    { version: 'w270a-1', wave: '第270便a(AE9)', presetMaxSteps: 4,
      note: '初版。階級 40e6(n≤3)/20e6(n≤12)・preset 宣言 4 本(🌞💠💍💿)・必要近点 20(📡 58)。' },
    { version: 'w271a-1', wave: '第271便a(AF3・AF2)', presetMaxSteps: 5,
      note: '❄️ plutoCharonReal を preset 宣言へ(3 段で同じ 60 公転の窓を覆うため)。'
        + '階級上限・必要近点の既定・資源上限は**変えていない**。' },
  ],
  says: '停止条件は**どこで止めるか**を機種に依らず決めるだけである —— '
    + '「停止条件を入れたので判定が確定した」「步数を宣言したので収束した」とは言わない。',
};

// ---------------------------------------------------------------- 第271便a(第61報・AF2)
// **基点 f6c19b4 との照合で「違ってよい段」の宣言**(自動判定ではない)。
// 宣言を足した段は基点より長く走るので、`tests/exp-w270a-stoprule.mjs` の replay は差を出す。
// **黙って許さない** —— どの段がなぜ違うかをここに列挙し、それ以外の差は QA で落とす。
export const BASE_REPLAY_EXCEPTIONS = [
  // 第270便c(AD9)で 🩺🪀🩹 PSR J1946+2052 の採用レコードを一組へ揃えたとき、導出した長半径 a が
  // 731.4902889635589 → 731.4903855163476 単位へ動いた。**1 公転の步数が変わる**ので 60 公転ぶんの
  // 步数も変わる(1,040,661 → 1,040,650 步 = 11 步)。基点の抽出 `data-w270a-stoprule-base.json` は
  // **f6c19b4(AD9 の前)**なので、この 8 段は基点と一致しない。**本便で見つけた**:
  // ef2cd45 に commit されている `tests/out/stoprule-w270a.json` は replay.differing=0 と書いてあるが、
  // それは **AD9 より前の走行から作った産物**で、同じ commit の calaudit(1,040,650 步)とは整合しない。
  // **数が悪くなったのではない** —— 初期条件が変わったので走行長も変わった、という記録である。
  ...['psrJ1946DFM|dt', 'psrJ1946DFM|dt/2', 'psrJ1946DFM|dt/4',
    'psrJ1946PN|dt', 'psrJ1946PN|dt/2',
    'psrJ1946CF|dt', 'psrJ1946CF|dt/2', 'psrJ1946CF|dt/4'].map((k) => ({
    id: k.split('|')[0], tag: k.split('|')[1], since: '第270便c(AD9)— 記録は第271便a',
    why: 'AD9 で採用レコードを一組へ揃えたときに導出 a が動き、1 公転の步数が変わった'
      + '(60 公転ぶんの步数 1,040,661 → 1,040,650 步)。基点の抽出は AD9 より前(f6c19b4)なので'
      + '一致しない。**近点の本数は 25 本のまま**で、判定量は動いていない。',
  })),
  { id: 'plutoCharonReal', tag: 'dt/2', since: '第271便a(AF2)',
    why: '步数上限を階級(40,000,000)から preset 宣言(41,388,996 = 60 公転)へ移したので、'
      + '基点より 1,388,996 步長く走る。**判定量(最初の 20 近点の近点間平均)は同じ窓から作るので'
      + '値は動かない** —— 動くのは走行長と検出できた近点の本数だけである。' },
];

export function declaredMaxSteps({ id, n, dt = DT_BASE, dtBase = DT_BASE }) {
  const p = PRESET_MAX_STEPS[id] || null;
  if (p) {
    const scale = p.scalesWithDt ? (dtBase / dt) : 1;
    return { maxSteps: Math.round(p.maxSteps * scale), source: 'preset', why: p.why, scale };
  }
  for (const c of CLASS_MAX_STEPS) {
    if (Number.isFinite(n) && n <= c.maxN)
      return { maxSteps: c.maxSteps, source: 'class(n<=' + c.maxN + ')', why: c.why, scale: 1 };
  }
  // **推測で埋めない**: 階級にも宣言表にも無い系は、宣言を書くまで走らせない。
  throw new Error('[w270a] 步数上限が宣言されていない(id=' + id + ' / n=' + n + ')'
    + ' —— 実行時 n>' + CLASS_MAX_STEPS[CLASS_MAX_STEPS.length - 1].maxN
    + ' の系は tests/lib-w270a-stoprule.mjs の PRESET_MAX_STEPS に宣言すること(推測で埋めない)');
}

export function declaredNeedPeriastra(id) {
  const p = PRESET_NEED_PERIASTRA[id] || null;
  return p ? { needPeriastra: p.needPeriastra, why: p.why, source: 'preset' }
    : { needPeriastra: PERI_WINDOW_DEFAULT, source: 'default',
      why: '第252便b の近点窓(最初の ' + PERI_WINDOW_DEFAULT + ' 近点 = '
        + (PERI_WINDOW_DEFAULT - 1) + ' 区間)' };
}

// 1 段の停止条件を作る。**入力に「步/秒」も「秒」も入らない**(= 機種に依存しない)。
//   stepsPerOrbit … t=0 の接触要素から作った「1 公転の步数」の配列(対象ごと)
export function stopRuleFor({ id, n, dt = DT_BASE, dtBase = DT_BASE,
  stepsPerOrbit = [], orbMax = ORB_MAX_DEFAULT }) {
  const cap = declaredMaxSteps({ id, n, dt, dtBase });
  const need = declaredNeedPeriastra(id);
  const finite = (stepsPerOrbit || []).filter((s) => Number.isFinite(s) && s > 0);
  const wantSteps = finite.length ? Math.max(...finite.map((s) => s * orbMax)) : 1;
  const floorSteps = finite.length ? 5 * Math.max(...finite.filter((s) => s <= cap.maxSteps), 0) : 0;
  const maxSteps = Math.max(2000, Math.round(Math.min(cap.maxSteps, wantSteps)));
  return {
    version: STOP_RULE_VERSION,
    id, n, dt, orbMax,
    declaredMaxSteps: cap.maxSteps, maxStepsSource: cap.source, maxStepsWhy: cap.why,
    needPeriastra: need.needPeriastra, needPeriastraSource: need.source, needPeriastraWhy: need.why,
    wantSteps: Math.round(wantSteps), floorSteps: Math.round(floorSteps),
    maxSteps,
    boundBy: (maxSteps >= cap.maxSteps) ? 'declared-max-steps' : 'orbit-window',
    floorSatisfied: (floorSteps === 0) ? null : (maxSteps >= floorSteps),
    rule: '步数 = min(**宣言した步数上限**, ' + orbMax + ' 公転ぶんの步数)。'
      + '**步/秒も壁時計も入らない**(第270便a・AE9 —— 機種で走行長が変わらない)。'
      + '近点は **' + need.needPeriastra + ' 本**要る(不足は未測定であって「否」ではない)。',
  };
}

// 段が終わったあとの判定。**壁時計はここでだけ効く**(資源上限)。
//   periFound … その段で検出できた近点の本数(対象ごと配列 or 数)
export function stopDecision({ stepsRun, maxSteps, periFound = [], needPeriastra = PERI_WINDOW_DEFAULT,
  wallSec = null, wallCeilingSec = WALL_CEILING_SEC_DEFAULT, boundBy = null }) {
  const arr = Array.isArray(periFound) ? periFound : [periFound];
  const nums = arr.filter((z) => Number.isFinite(z));
  const minPeri = nums.length ? Math.min(...nums) : null;
  const periastraOk = (minPeri === null) ? false : (minPeri >= needPeriastra);
  const stepsHit = Number.isFinite(stepsRun) && Number.isFinite(maxSteps) && stepsRun >= maxSteps;
  const resourceExceeded = Number.isFinite(wallSec) && Number.isFinite(wallCeilingSec)
    && wallSec > wallCeilingSec;
  // **どこで止まったか**は 2 つを分ける必要がある:
  //   ・`declared-max-steps` …… **宣言した步数上限**が走行長を切った(上限を上げれば伸びる)
  //   ・`orbit-window` …… 60 公転ぶんの窓を走り切った(上限は効いていない = 軌道そのものの性質)
  // 近点が足りない理由もこれで分かれる(前者 `max-steps` / 後者 `window`)。
  const cappedByDeclaration = stepsHit && boundBy === 'declared-max-steps';
  let unmeasuredReason = null;
  if (resourceExceeded) unmeasuredReason = 'resource-limit';
  else if (!periastraOk) unmeasuredReason = cappedByDeclaration ? 'max-steps' : 'window';
  return {
    stepsRun, maxSteps, stepsHit, minPeriastra: minPeri, needPeriastra, periastraOk,
    wallSec, wallCeilingSec, resourceExceeded, cappedByDeclaration,
    complete: !resourceExceeded && periastraOk,
    unmeasuredReason,
    stoppedBy: resourceExceeded ? 'resource-limit'
      : (cappedByDeclaration ? 'declared-max-steps'
        : (stepsHit ? 'orbit-window(走り切った)' : 'orbit-count(全対象が ' + 'orbMax 公転に達した)')),
    note: resourceExceeded
      ? '**資源上限を超えた段である**: 壁時計 ' + wallSec + ' s > ' + wallCeilingSec + ' s。'
        + '途中までの軌道を最終判定へ流さない(unmeasured/resource-limit)'
      : (periastraOk ? '近点 ' + minPeri + ' 本 ≥ 宣言 ' + needPeriastra + ' 本(測定が成立する)'
        : '近点が ' + minPeri + ' 本で宣言 ' + needPeriastra + ' 本に足りない —— '
          + (cappedByDeclaration ? '**宣言した步数上限で切れた**(max-steps: 上限を上げれば伸びる)'
            : '**步数の窓は走り切った**(window: 軌道そのものの性質であって上限のせいではない)')),
  };
}

// 機種非依存の機械確認:**同じ入力なら步/秒が何であっても同じ步数になる**。
// (第257便d までの規則 `min(max(rate×budget, floor), want, hardCap)` は rate で変わった。)
export function machineIndependenceProbe({ id, n, dt = DT_BASE, stepsPerOrbit = [],
  orbMax = ORB_MAX_DEFAULT, rates = [1e3, 1e5, 1e7] }) {
  const now = stopRuleFor({ id, n, dt, stepsPerOrbit, orbMax }).maxSteps;
  // 旧規則(第257便d)の再現 —— **比較のためだけに置く**(器はもう使わない)
  const legacy = rates.map((rate) => {
    const budget = (n > 12) ? 240 : 80;
    const budgetSteps = rate * budget;
    const finite = (stepsPerOrbit || []).filter((s) => Number.isFinite(s) && s > 0);
    const wantSteps = finite.length ? Math.max(...finite.map((s) => s * orbMax)) : 1;
    const feasible = finite.filter((s) => s <= budgetSteps);
    const floorSteps = feasible.length ? 5 * Math.max(...feasible) : 0;
    const hardCap = (n <= 3) ? 40e6 : (n <= 12) ? 20e6 : budgetSteps * 2;
    return { rate, maxSteps: Math.max(2000, Math.round(Math.min(Math.max(budgetSteps, floorSteps),
      wantSteps, hardCap))) };
  });
  return { id, declared: now, rates: legacy,
    declaredStable: true,
    legacyStable: new Set(legacy.map((z) => z.maxSteps)).size === 1,
    note: '`declared` は步/秒を入力に取らないので**定義上一定**である。`rates` は旧規則を'
      + '3 つの速さで再現したもので、**値がばらつくなら走行長が機種で変わっていた**ことを意味する。' };
}
