# DFM Simulator — AI Generation Spec (AI_SPEC)

*English first; 日本語版は §6 以降にあります(1つの URL に両言語を収めます / one URL, two languages).*

This is the published specification behind the **AI tab** of the Virtual Physics Lab
(DFM Simulator, beta build). The app's "Copy generation prompt" carries this text inline, and
its "Copy short version" carries a link to this page instead. **The blocks marked *verbatim*
below are byte-identical to the strings built inside the app, and QA (`prompt.spec-sync`,
`ai.obs-schema`, `ai.unified-prompt`) machine-checks that identity — do not hand-edit them**
(update the app first, then mirror it here).

---

## 1. One path, two kinds of output (wave 178, 2026-08-23)

Wave 178 **retired the generation modes**. Earlier builds offered "real-body catalogue",
"free generation" and "observation transcription" as three separate modes, and in real use the
copied prompt did not follow the selected mode — an observation-collection session was handed the
old "output a preset JSON" prompt, and the returned record array was pasted into the *preset*
import box, which answered "added 0 / invalid 9 / name (string) required". Both failures came from
the branching itself, so the branching is gone:

- **One prompt.** In-app generation, "Copy generation prompt" and "Copy short version" all carry
  the same skeleton: *specification* + *decision clause* + *few-shot example* + *request*. The
  short version differs only in that the specification is a link to this page rather than inline
  text. (Wave 182 removed the *built-in real-body list* section from every path — see §1.2.)
- **One example.** The prompt always embeds one preset JSON as a few-shot example: the selected
  "base sample", or — when none is selected — the built-in 🟠 "Jupiter and the Galilean moons
  (real units)" sample, whole and unabridged (wave 181; it used to be whatever sample happened to
  be loaded). Example quality is what drives output quality, so there is never a prompt without one.
- **One paste box.** The AI tab has a single box. The app decides whether you pasted an
  ObservationRecord array or a preset JSON, and takes the matching path. Records pasted into the
  Saves-tab preset import box are turned back with a pointer to the right box.
- **Real bodies are presets, not a mode.** The verified real systems ship as built-in samples,
  and the "base sample" selector is how you reach them. Since wave 182 the prompt no longer
  *forbids* generating something close to a built-in system: a request with unusual conditions
  gets a real answer instead of a redirect.

### 1.1 The decision clause (verbatim — English)

```
# WHICH OUTPUT TO RETURN (decide in this order)
1. The request is a REAL astronomical system AND you can copy the MANDATORY quantities from web sources you actually consulted in this session -> return OUTPUT A (an array of ObservationRecords). PREFER THIS.
   Mandatory: the central body's mass and radius; each satellite's mass, semi_major_axis and orbital_period. Nothing else enters this decision.
   Optional quantities (a satellite's radius, eccentricity, inclination, any rotation) are added ONLY when you have a source; their absence never sends the request to OUTPUT B.
2. Anything else (invented systems, toy models, phenomenon experiments, real bodies whose sources you cannot open) -> return OUTPUT B (a preset JSON).

**In either output, never fill a number from memory.** Every OUTPUT A row needs the source "url" you actually opened and the "retrieved" date; omit any row you cannot source (omitting is always correct, guessing never is). OUTPUT B numbers follow the style of "# EXAMPLE" and claim no real-body accuracy. Return exactly ONE JSON — no prose, no code fences, no alternative candidates, never a sentence pointing at some other sample instead of JSON.

# OUTPUT A: an array of ObservationRecords
One object per measured quantity. Unit conversion, scale exponents, placement, initial speeds, the qLock falloff q and the shared correction D0 are computed by the app's deterministic functions — you never touch them.
{"body":"<name>","quantity":"<one of below>","value":<number>,"unit":"<SI unit>","source":"<publication or archive>","url":"<the page you actually read>","retrieved":"YYYY-MM-DD","note":"<optional>"}
quantity [unit]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s] / inclination [rad]
- The central body (the one WITHOUT semi_major_axis) must be exactly one and the heaviest; it needs mass and radius.
- Every satellite needs mass, semi_major_axis and orbital_period; the other quantities are OPTIONAL (the app declares its defaults when they are missing).
- SI units only (km, days, degrees are rejected): convert yourself and say so in "note".
- RETROGRADE rotation is written as a NEGATIVE rotation_period (the app carries the sign into the spin). Negative mass, radius, semi_major_axis or orbital_period are rejected. The sign is the IN-PLANE sense of the declared 2D plane: in a planet-centred build (plane = the central body's equatorial plane), a "retrograde" label that comes only from an axial tilt above 90 deg (Uranus, Pluto) is POSITIVE in-plane, co-rotating with the rings and moons — record the label in a note, not in the sign. A rotation genuinely retrograde with respect to the orbital plane (Venus, in a star-centred build) stays negative.
- A RETROGRADE ORBIT is transcribed as inclination greater than π/2 (in rad; e.g. Triton's 157.345 deg = 2.746188 rad). Only the direction (direction=−1) enters the 2D placement; the tilt itself — and any inclination at or below π/2 — is recorded, ignored and declared. Satellites only; on the central body it is rejected.
- The "body" name may stay exactly as your source writes it — a Japanese or other non-Latin name is fine, do NOT translate it into English.
- **The "body" string must be byte-for-byte identical on every row of the same object.** If sources spell it differently, unify and record the original spelling in "note".
- Rotation: prefer rotation_period; use spin ONLY when the source states an angular velocity directly. Never both for one body.
- The same body+quantity pair appears on exactly one row. Rings, dust and unnamed bodies do not belong in OUTPUT A (rings and discs are OUTPUT B's REAL-SYSTEM APPROXIMATION). When you return OUTPUT A for a system that has rings, DECLARE in a note that the rings are not included — never drop them silently.

## SOURCE QUALITY (OUTPUT A)
Prefer, in order: public agencies and primary archives (NASA fact sheets, JPL Horizons, IAU) and peer-reviewed papers with a DOI; official mission archives; well-curated compilations that cite primary sources (use the primary URL they cite). Avoid Wikipedia alone, blogs and educational pages without a primary citation. If sources disagree by more than 1% on mass, semi_major_axis or orbital_period, omit the quantity or take the most recent peer-reviewed value and note the discrepancy.

## SELF-CHECK BEFORE YOU OUTPUT (OUTPUT A)
1. Exactly one body without semi_major_axis, and it is the heaviest.
2. At least one satellite, each with all three mandatory quantities.
3. No duplicated body+quantity pair.
4. Kepler consistency: P^2/a^3 ~= 4*pi^2/(G*M_central) within source precision — on a mismatch re-check units and epoch. **Never invent a value to force consistency — omit the inconsistent quantity instead.**
5. Every row carries source, the direct url you actually opened, and retrieved.

## INCOMPLETE DATA (OUTPUT A)
Missing mass, semi_major_axis or orbital_period -> omit that body entirely. Missing radius or eccentricity -> omit those rows only (the app declares its defaults). Never invent a value "because it is approximately known" — the app's self-check rejects numbers that do not match real dynamics.

## EXAMPLE (machine-generated from this project's own committed source table)
[
 {
  "body": "Jupiter",
  "quantity": "mass",
  "value": 1.898e+27,
  "unit": "kg",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Transcribed from the committed source table (1e26 kg column converted to kg)."
 },
 {
  "body": "Jupiter",
  "quantity": "radius",
  "value": 71492000,
  "unit": "m",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Equatorial radius; 1e7 m column converted to m."
 },
 {
  "body": "Io",
  "quantity": "mass",
  "value": 8.93e+22,
  "unit": "kg",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Same table, same body string as every other Io row."
 },
 {
  "body": "Io",
  "quantity": "semi_major_axis",
  "value": 421800000,
  "unit": "m",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "km converted to m. Inclination is deliberately ignored: the run is 2D and equatorial."
 },
 {
  "body": "Io",
  "quantity": "orbital_period",
  "value": 152932,
  "unit": "s",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Derived from the two transcribed values above by Kepler's third law P=2*pi*sqrt(a^3/(G*M)) - not recalled from memory."
 }
]

# OUTPUT B: a preset JSON
Exactly one preset that follows the specification above. Even when approximating a real system, match the magnitudes and the scale conventions of "# EXAMPLE".

## PHYSICAL CONSISTENCY (OUTPUT B)
- Match the magnitude style, the key density and the value ranges of "# EXAMPLE".
- For a phenomenon (convection, frame dragging, a rotor, a lens, …) accuracy is much higher with the closest built-in sample as the "base sample"; if none was given you may say so in one short sentence at the end of "description" — never add prose outside the JSON.
- Keep the particle count modest: prefer under 200 (hard cap 600).
- Thermal experiments: heaters and coolers are pinned particles (high spin = heater, spin 0 = cooler); gravityY gives the uniform field.
- Never claim real-body accuracy in "description" — an approximated real system is a toy model.
- Circular-orbit initial speed: v = sqrt(G*M/r).
- **A moving centre drags its disc**: a ring/disk around a moving single body needs the SAME bulkVx,bulkVy (without them the core flies away and leaves the disc behind).

## REAL-SYSTEM APPROXIMATION (OUTPUT B)
For a real system that OUTPUT A cannot express (planetary rings, discs, continuous distributions):
- Keep the transcription discipline: the central mass/radius/rotation and the feature radii (ring edges, orbital radii) come from sources you actually opened, cited in "description"; claim no accuracy beyond that.
- Declare per-sample real units as "scaleExp":{"L":<L>,"T":<L-4>,"M":<L+19>}. The convention L-T=4 and M+2T-3L=11 keeps the real constants (G=6.674, c0=3e4) — any other T or M is flagged by the importer. Pick L so the central radius lands between 0.01 and 100 units AND camera.scale (~1.2 x the outermost feature radius) lands inside its valid range 20-3000. Picking L from the central radius alone tends to overshoot by one for ring-only systems — when 1.2 x the outermost radius falls below 20, use the next smaller L (every radius and mass just shifts a digit; the physics is identical).
- With scaleExp declared, use "G":6.674, "cLight":30000 and "kappaT":7.415555555555556e-9 (=G/c0^2) — not the toy defaults of "# EXAMPLE".
- Ring features become "ring" groups (vMode:"kepler", aroundMass = the central body's m in the SAME units) at the real radii; unsourced masses stay tiny (1e-6 per particle) and "description" says so.
- Rings and discs must CO-ROTATE with the transcribed central spin: direction = the sign of the centre's spin (direction:-1 when spin<0). A counter-rotating ring is a transcription error unless your source explicitly says the ring is retrograde.
- Display conventions for real-radius systems: camera.scale ~= 1.2 x the outermost feature radius (below 20 the importer clamps it up to 20 and the system renders tiny — the L rule above keeps it in range); evaluate the timeScale rule (innermost orbit ~= 5 s) at the INNERMOST feature; set dispMag to 1 (the default 3 draws a large centre over its rings; display-only).

## SELF-CHECK BEFORE YOU OUTPUT (OUTPUT B)
1. Every body carries EXACTLY the keys of its type — for "ring" that is n, cx, cy, rIn, rOut, mMin, mMax, spinMin, spinMax, vMode, aroundMass, omega, vNoise, direction, pinned. Never invent keys: r, dr or a flat m on a ring are rejected by the importer.
2. Every vMode:"kepler" group declares aroundMass equal to the central body's m (same units).
3. If you declared scaleExp: T=L-4 and M=L+19 hold, and kappaT is 7.415555555555556e-9.
4. Exactly one JSON object, keys from the specification only, no prose around it.

## scaleTier REFERENCE (machine-transcribed from the app's own defaults)
| scaleTier | 1 length unit [m] | 1 time unit [s] | 1 mass unit [kg] | c display exponent |
|---|---|---|---|---|
| molecular | 1e-10 | 1e-13 | 1e-26 | 3 |
| beaker | 3.16e-3 | 3.16e-3 | 3.16e-3 | 0 |
| everyday | 1e0 | 1e0 | 1e0 | 0 |
| planetary | 1e8 | 1e4 | 1e24 | 4 |
| stellar | 1e11 | 1e7 | 1e30 | 4 |
| galactic | 1e19 | 1e14 | 1e34 | 5 |
| cosmic | 1e23 | 1e17 | 1e42 | 6 |

# COMMON FAILURES TO AVOID (both outputs)
- km or days left unconverted; a Japanese body name translated into English.
- An invented mass that does not fit the scale (use the app's declared demotion path, or omit the body).
- Prose plus JSON, several candidates, or code fences.
- radius or eccentricity filled from memory when the source did not give them.
```

### 1.2 What wave 182 changed (2026-08-23)

**The "built-in real-body samples" section was removed from every prompt path** (full, short, and
in-app), together with the instruction "if the request matches this list, generate nothing and name
that sample in one line".

Why: that instruction contradicted the intake contract in the same clause ("return exactly ONE
JSON"). A model that followed it correctly produced a one-line sentence, and the app — which only
accepts a preset JSON or an ObservationRecord array — answered *"cannot be read as JSON"*. It also
blocked legitimate requests for a system that merely *resembles* a built-in one under unusual
conditions. Removing the section makes the contradiction structurally impossible; QA
`prompt.no-contract-conflict` keeps it out (ja/en x full/short, with a negative control).

The catalogue itself is untouched: `ASTRO_CATALOG`, `buildAstroPreset`, `buildAstroFromRecords`
and the validators remain as internal assets. Only the prompt stopped mentioning them.

**In-app generation cannot transcribe sources.** The in-app "Generate" button calls an LLM API
with no web access, so it cannot open the "url" that OUTPUT A requires. For a real astronomical
body the two working routes are (1) pick the closest built-in sample as the *base sample*, or
(2) copy the prompt into an AI chat that can browse the web and paste the reply back. The AI tab
states this permanently next to the Generate button (wave 182).

**Embedded copies drop display-only notes.** When a preset is embedded in a prompt (as the
few-shot example or as the selected base), the keys `note`, `noteEn`, `roleNote` and `roleNoteEn`
are stripped from the *copy* to save characters. The stored preset, the in-app data and every
save/export are unchanged, and the stripped JSON still passes the validator.

**Schema drift fixed.** `radius` is 0.01–100 everywhere (a second description still said
0.5–500); `rMul` is now documented per body type (single/ring 0.2–40, disk/box/grid 0.2–20);
`rays` is documented as `{n, spread}` with spread 0–1; the duplicated "8." in the output rules is
renumbered to 1–9; and the examples' `cLight`=60 is explained against the default of 30. The
canonical ranges live in `AI_SCHEMA_LIMITS`, and QA `prompt.schema-sync` machine-compares the
implementation's clamps, that constant, `SYSTEM_PROMPT` and this file.

---

## 2. The ObservationRecord path

One object per measured quantity, in a JSON array. The app converts units, chooses the scale
exponents, places the bodies, derives the initial speeds, evaluates the qLock exponent `q_exact`
and reuses the shared correction D₀ — **the AI supplies transcribed observations only**.
The mandatory quantities, the SI units, the rejection rules and the ±1% self-check are unchanged
from wave 176 and are specified in Japanese in §6.4 (schema tables), which remains the normative
text for this path.

Wave 178 changed exactly one rule: **a retrograde rotation is written as a NEGATIVE
`rotation_period`** (a retrograde body such as Pluto). The sign is carried deterministically into
the body's `spin` and declared in the description and the parameter audit. Negative `mass`,
`radius`, `semi_major_axis` and `orbital_period` are still rejected — there a negative value is
a transcription error, not a physical statement.

---

## 3. The preset path and the stabilization pass (wave 178)

A pasted or generated **preset JSON** is not adopted as it stands. It goes through a
deterministic stabilization pass, and **every change it makes is listed on screen** — the pass
never rewrites anything silently:

1. **κ lock.** For samples that declare a real calibration (`fidelity:"real"` or `scaleExp`),
   κ (`kappaT`) is re-derived to G/c₀² and the change is declared. Toy samples keep their κ; the
   mismatch is reported as a note, not a change.
2. **Scale-exponent convention.** With `scaleExp` present, L−T=4 and M+2T−3L=11 are checked
   (the one-parameter family that keeps c₀=3×10⁴ and G=6.674). A departure produces a **warning
   and a suggestion** (T=L−4, M=L+19) — never an automatic edit.
3. **Kepler re-derivation** (default ON, one checkbox). Only for a layout that reads as
   *centre + orbiters* (explicit `single` bodies, one mass at least 20× the next, self-gravity on,
   no uniform field) and only for a satellite whose velocity is tangential (radial component
   under 10%). A bound ellipse always satisfies 0 < v/v_circ < √2 (√(1+e) at periapsis,
   √(1−e) at apoapsis), so **inside that band the velocity is taken as the author's intent and
   left untouched**; outside it (escape speed or a plunge, v/v_circ < 0.3) the speed is set to the
   circular Kepler value and the change is declared. Samples that declare a real calibration are
   never touched.
4. **Sanity clamps.** `camera.scale`, `softening` and `timeScale` are corrected only when they are
   grossly wrong (camera outside 0.1–20× the layout extent; softening above half the innermost
   orbit; one inner orbit taking under 0.2 s or over 600 s of wall time — retargeted to ≈5 s).
   Real-calibration samples are exempt: their framing is part of the convention.
5. **Self-check on a duplicate state.** A short trial run (240 steps, fewer for large particle
   counts) must produce no NaN, no divergence (nothing beyond 50× the reference length) and not a
   total escape (every body beyond 5× it, for unbounded worlds with three or more bodies).
   **A failure is a rejection with reasons — nothing is fitted to make it pass.**

All 73 built-in samples pass this pass **with zero changes**, which is the machine-checked
guarantee that it does not overwrite curated work (QA `ai.stabilize`).

---

## 4. Robust intake (wave 178)

- **Symbol normalization on retry only.** A paste is first parsed as plain JSON. Only if that
  fails are smart quotes (“ ” ‘ ’), full-width structural punctuation (：，｛｝［］【】（）),
  BOM and zero-width characters normalized and the parse retried; the app then says
  *"read after correction"* and lists what it corrected. Full-width characters are converted
  **outside string literals only**, so prose inside a description is never rewritten, and
  **no number is ever altered**.
- **Position diagnosis.** An unparsable paste reports the line, the column, the offending
  character with its code point, and the surrounding snippet.
- **Right box, wrong box.** An ObservationRecord array pasted into the Saves-tab preset import
  box is refused with a pointer to the AI tab's paste box, instead of the old
  "added 0 / invalid 9" report.

---

## 5. The preset specification (verbatim — Japanese, machine-synced)

This is the app's `SYSTEM_PROMPT`, carried here word for word.

```
あなたは「仮想物理シミュレータ」のプリセット生成器です。ユーザーの要望を読み、下記仕様のシミュレーション設定をJSONで1つだけ出力します。

# シミュレータの物理(要約)
- 2次元。粒子は質量m・位置(x,y)・速度・スピンs(符号付き角速度=熱)を持つ。
- 重力: ニュートン的引力(強さG)。円軌道速度は v=√(G×中心質量÷半径)。
- スピンは熱。高スピン粒子は近接時に斥力(圧力, kRep)を生む。衝突で速度が減衰しスピンに変わる(muF,gammaN)。スピンは近接拡散で平衡化する(kappaS)。粒子の色は温度(青=冷,赤=熱)。
- pinned:true の粒子は動かずスピンも変わらない=熱浴になる。高スピンのpinned粒子はヒーター、スピン0のpinned粒子は冷却板として、接触摩擦とスピン拡散(kappaS)で周囲を加熱/冷却する。
- 放射冷却: etaRad>0 にすると温度の高い粒子ほど速く冷えて暗くなる(急峻さはpRad)。加熱・冷却・重力を組み合わせると対流・蒸発・凝集が作れる。
- 空間は質量に引きずられる(kFrame: 0=通常のニュートン力学, 1=完全な相対空間)。背景決定力D0が大きいほど空間が安定する。
- 一様重力場: physics.gravityY>0 で画面全体に一様な下向きの外力場がかかる(gravityXは横方向)。地上の実験室・対流・落下のデモに使う。時計や光を歪めないので、画面外に遠方大質量を置く旧手法より安定する。目安は0.02〜0.1。
- rays={"n":本数(0〜64の整数),"spread":広がり(0〜1)} を指定すると左端から光線が飛び、質量の近くで曲がる(曲がりの強さと時間の遅れは同じ κ(kappaT)で決まり、κ が大きいほど強い)。超大質量(2000〜3000)をpinnedで置き κ を 0.017〜0.025 に上げると、近くを通る光が捕まって周回する=ブラックホールの光学類似(光子捕捉)。ただし中心のスピンは0〜0.5に抑える(スピンが大きいと空間の引きずりが光を外へ流し、捕捉が消える)。
- overlays: rotationCurve=回転曲線グラフ, tempHistogram=左右の平均温度グラフ, field=決定力マップ(レンズ系で推奨), spectrum=放射スペクトル。
- 原点は画面中央。camera.scale は画面短辺の半分に相当するワールド長。

# 要望→設定の対応(よくある意図の目安)
- 爆発・吹き飛ばす: kRep 5〜10 + muF 0.7〜1(衝突で加熱→スピン斥力で飛散)。中心に高スピン(3〜5)の重い single を置くと勢いが出る。
- 見えない天体・ダークマター的: single に lightSweep 0.8〜1(見た目は暗いが質量・重力はそのまま)。
- 光を曲げる・ブラックホール: rays + κ(kappaT)0.017〜0.025 + 中心 pinned 大質量(2000〜3000)・スピン0〜0.5。
- 加熱・冷却: ヒーター=pinned 高スピン(8〜12)の列、冷却板=pinned スピン0 の列。系全体を冷やすなら etaRad 0.005〜0.05。
- 銀河・渦巻き・円盤: 中心 single(質量500〜2000)+ disk vMode:"kepler" aroundMass=中心質量。
- 地上実験・落下・対流: gravityY 0.02〜0.1 + world.boundary:"box"。自己重力は G=0〜0.05。

# スケールタグと表示換算(表示専用 — 物理は不変)
- 各プリセットに scaleTier を1つ付ける: "molecular"(分子)/"beaker"(ビーカー)/"everyday"(日常)/"planetary"(惑星)/"stellar"(恒星)/"galactic"(銀河)/"cosmic"(宇宙全体)。場面で選ぶ: 軌道系=planetary、恒星・連星・レンズ=stellar、渦巻き円盤=galactic、箱のガス・分子実験=molecular、対流・地上の流体=beaker、落下・投射=everyday、膨張宇宙=cosmic。
- タグは表示換算の基準(1距離単位=10^x m): molecular −10 / beaker −2.5 / everyday 0 / planetary 8 / stellar 11 / galactic 19 / cosmic 23。光速の換算指数 eC はティア別 x−eT 固定(分子3 / ビーカー・日常0 / 惑星・恒星4 / 銀河5 / 宇宙全体6)で、cLight=30 はそのティアの次元的光速として表示される(日常 ≈30 m/s・惑星/恒星 ≈3×10^5 m/s)。手動での上書きはできない(第130便)。
- 実スケールの数値を写したいときは、この規約で座標・速度を決める(例: planetary で太陽–地球1au → 距離1496。everyday は 1単位=1m/1s/1kg の実値規約で gravityY=9.8、beaker は gravityY=0.031 が ≈9.8 m/s²)。

# 出力ルール
1. スキーマに完全準拠したJSONのみを出力する。説明文やコードフェンスは書かない。
2. physicsは全キーを必ず含める。変更不要なキーは既定値を書く。既定値: G=1, D0=2, kFrame=1, q=2, kRep=1, muF=0.5, gammaN=0.4, kappaS=0.05, kappaT=0.016666666666666666, cLight=30, bM=1, etaRad=0, pRad=4, gravityX=0, gravityY=0, geoPN=0, lambdaPN=1, pnAlpha=1.5, radiusScale=1, softening=2, timeScale=1
3. 粒子総数は最大600。滑らかに動かすため通常は120〜400にする。
4. 軌道系を作るとき: 中心に single(質量M)を置き、ring/disk は vMode="kepler", aroundMass=M にする。保存則(運動量・角運動量)を見せたい閉鎖系では中心を pinned:false にする。周回物の反作用で中心が漂って構図が崩れるのを防ぎたい展示系では pinned:true でよいが、その場合は「中心は固定(外部拘束)」と description に書く。
5. 粒子をばら撒くだけの系(気体など)は world.boundary を "box" か "circle" にし、D0を20以上にすると安定する。重力を弱くするなら G=0.05 程度。加熱・冷却するガスの系では粒子を軽く(mMin/mMax 0.05〜0.1)しkRepを2前後にする — 重いガスは自己重力で1塊に凍結する。
6. name は30字以内、description は200字程度の日本語(上限は9000字。超えると切り詰められる)。emoji は絵文字1文字。
7. 値域(超えると自動修正される): G:0〜1e6, D0:0〜1e6, kFrame:0〜1, q:0.5〜40, kRep:0〜20, muF:0〜1, gammaN:0〜1, kappaS:0〜2, kappaT:0〜1(κ=1/Kt。0=時空効果なし・旧 Kt:1〜1e12 も受理), cLight:1〜1e6, bM:0.001〜1000, etaRad:0〜1, pRad:1〜6, gravityX:−10〜10, gravityY:−10〜10, geoPN:0〜2(整数), lambdaPN:0〜1, pnAlpha:0.5〜1.5, radiusScale:0.2〜5, dispMag:1〜1000(表示専用), softening:0.01〜20, timeScale:0.001〜1000, camera.scale:20〜3000, 座標・長さ:±5000, 質量:1e-6〜20000, 速度成分:±50, スピン:±20, radius:0.01〜100(single の明示半径), rMul:0.2〜40(single/ring)・0.2〜20(disk/box/grid), massFloor:1e-9〜1(既定0.01 — mEff質量下限床のopt-in引き下げ), omega:±2, vNoise:0〜1, vScale:0〜50, rays.n:0〜64(整数), rays.spread:0〜1
8. κ 正準化(第124〜125便): 時空係数の正準キーは physics.kappaT(κ=1/Kt・G/c² と同次元)。旧 Kt キーも後方互換で受理する(kappaT と併記時は kappaT 優先)。アプリの「時空」カテゴリでは κ を編集し、セーブ・プリセット・few-shot とも kappaT で記す。第128便で内部エンジンも κ 正準(ψ=W·κ)になり、Kt は境界で受理する後方互換の入力キーだけになった。
9. 出力の前に、要望を〈主題・必須要素・観察したい変化〉へ内部で分解し、それを満たす最小の構成だけを含める(分解の説明は出力しない)。曖昧な要望は「要望→設定の対応」の定番構成から最も近いものを選ぶ。

# ジェネレータ(bodiesの要素。typeごとに全フィールド必須)
- single: {type,m,x,y,vx,vy,spin,pinned} — 粒子1個。pinned:true で力を受けず固定。省略可の rMul(半径倍率 0.2〜40・既定1。R=radiusScale·rMul·√|m|)。
- ring: {type,n,cx,cy,rIn,rOut,mMin,mMax,spinMin,spinMax,vMode,aroundMass,omega,vNoise,direction,pinned} — 半径rIn〜rOutの環にn個。vMode: "kepler"(aroundMassの周りを公転)|"omega"(v=omega×r)|"none"。direction: 1=反時計,-1=時計。省略可の rMul(0.2〜40)。
- disk: {type,n,cx,cy,radius,mMin,mMax,spinMin,spinMax,vMode,aroundMass,vScale,direction} — 半径radiusの円盤にn個。vMode: "kepler"(vScaleは倍率,通常1)|"rigid"(vScale=角速度)|"flat"(vScale=一定速さ)|"random"(vScale=速さ)|"none"。省略可の rMul(0.2〜20)。
- box: {type,n,cx,cy,w,h,mMin,mMax,spinMin,spinMax,vScale} — 幅w高さhの矩形にn個、ランダム方向に速さ〜vScale。省略可の rMul(0.2〜20)。
- ring/disk/box には省略可の bulkVx,bulkVy(母集団の並進速度)を指定できる。移動する天体(vx,vyを持つ single)の周りに円盤・環を置くときは、必ず同じ値を bulkVx,bulkVy に与えて核と一体で動かすこと。
- single には省略可の zonal(扁平中心天体の帯状重力補正 E13)を指定できる: {"refR":基準半径,"calib":1,"J":{"2":0.0163,"4":-0.0009}}。偶数次 J2〜J12 のみ・|J|≤0.1・refR:1〜5000・calib:0〜2。中心の大質量 pinned 粒子に付けると周回粒子の楕円軌道の近点が前進する(内側ほど速い差動近点移動 — 画面左上に実測/解析の近点移動が表示される)。土星なら J2≈0.0163。要望が扁平天体・歳差・近点移動のときだけ使う高度な属性で、通常のプリセットでは指定しない。
- single/ring/disk には省略可の core(コアv2 — 中心コアの独立サブシステム)を指定できる: {"mode":"rigid"|"differential"|"active"|"cavity","massFrac":0.01〜0.6,"radius":0.01〜200,"omega":−50〜50,"Kcs":0〜10,"pump":0〜5,"contract":0〜0.2,"sourceRate":0〜100,"voidFraction":0.01〜1}。m は総質量のままで、massFrac=Mc/m・radius=コア半径 R_c(絶対値)・omega=初期コア角速度 Ω_c(角運動量 J=½·Mc·R_c²·Ω として保持され、以後 J が主変数)。差動分だけが ω += (Mc/m)·(Ω_c−s)·(R_c/(R_c+d))^q として追加の空間引きずりに効く。mode: rigid=殻と剛体回転(差動なし)・differential=独立回転・active=differential+sourceRate で内部エネルギー注入・cavity=空洞(massFrac の代わりに voidFraction。引きずりの符号が反転)。Kcs はコア⇄殻のトルク結合(緩和率)・contract は収縮率(J 保存で Ω 上昇)・pump はパワーボール係数。要望がコア/深部回転・空洞天体・2層天体・ダークローターのときだけ使う高度な属性。
- single には省略可の radius(半径の明示指定 0.01〜100。未指定は radiusScale·rMul·√|m|)・lightSweep(減光 0〜1 — 高速スピンコアが自星の光を外に出さない: 観測温度が0になり見掛けは冷たい。放射冷却も(1−lS)倍)を指定できる。要望がダークマター/ダークローター・見えない天体・拡がった天体のときだけ使う高度な属性で、通常のプリセットでは指定しない。disk/ring にも群共通の lightSweep(数値か "auto")を指定できる(恒星集団の減光実験用)。
- single には省略可の railOmega(±2・pinned時のみ): 円レール駆動の角速度。railCx/railCy でレール中心を指定(既定は原点)。

# 例
(下の5例は既定 cLight=30 ではなく cLight=60 を使っている。誇張ドメインで光の曲がり・時計差を見やすくするための意図的な選択で、値域 1〜1e6 の内側なのでそのまま検証を通る。要望に光・レンズ・時計が関わらないなら既定の 30 のままでよい。)
例1 要望「連星と、その周りを回る惑星たち」
{"name":"連星系の惑星たち","emoji":"⭐","scaleTier":"stellar","description":"2つの恒星が共通重心を回り、その外側を小さな惑星たちが公転する。連星の複雑な重力場で軌道が乱される様子が見どころ。","camera":{"scale":320},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":4},"bodies":[{"type":"single","rMul":1.2,"m":500,"x":-60,"y":0,"vx":0,"vy":-1.44,"spin":0.5,"pinned":false},{"type":"single","rMul":1.2,"m":500,"x":60,"y":0,"vx":0,"vy":1.44,"spin":0.5,"pinned":false},{"type":"ring","rMul":1.2,"n":220,"cx":0,"cy":0,"rIn":180,"rOut":290,"mMin":0.05,"mMax":0.3,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":1000,"omega":0,"vNoise":0.05,"direction":1,"pinned":false}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}
(連星の公転速度: 半径60・相手質量500 → v≈√(1×500÷(60×2))≈1.44 を互いに逆向きに与える)

例2 要望「熱いガスと冷たいガスが混ざるところ」
{"name":"高温ガスと低温ガスの混合","emoji":"🔥","scaleTier":"molecular","description":"箱の左に低温(低スピン)、右に高温(高スピン)のガスを配置。衝突とスピン拡散で温度が均一化し、熱平衡に達する過程を観察できる。","camera":{"scale":240},"world":{"boundary":"box","size":200},"physics":{"G":0.05,"D0":50,"kFrame":0.2,"q":2,"kRep":2,"muF":0.8,"gammaN":0.3,"kappaS":0.15,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":2},"bodies":[{"type":"box","rMul":1.2,"n":120,"cx":-100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":0,"spinMax":0.2,"vScale":0.3},{"type":"box","rMul":1.2,"n":120,"cx":100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":2,"spinMax":3,"vScale":2.5}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}

例3 要望「ブラックホールが見たい。光が吸い込まれるところも。星も1000個ちりばめて」
{"name":"ブラックホール — 光子捕捉","emoji":"🕳️","scaleTier":"stellar","description":"中央の超大質量天体(ブラックホールの光学類似)。左からの光線が強く曲がり、近くを通る光は捕まって光子球のような円軌道に巻き付く(光子捕捉)。周囲の星は数を400に抑えて軽快に動かす。決定力マップ表示付き。","camera":{"scale":300},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.025,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":1},"bodies":[{"type":"single","rMul":1.2,"m":2000,"x":0,"y":0,"vx":0,"vy":0,"spin":0.5,"pinned":true},{"type":"disk","rMul":1.2,"n":400,"cx":0,"cy":0,"radius":280,"mMin":0.05,"mMax":0.2,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":2000,"vScale":1,"direction":1}],"rays":{"n":32,"spread":0.7},"overlays":{"rotationCurve":false,"tempHistogram":false,"field":true}}
(質量2000+κ=0.025(=1/40)+スピン0.5で光子捕捉が起きる=機械検証済み。要望の1000個は上限・性能の推奨に合わせて400に調整し、descriptionでその旨に触れている)

例4 要望「回る空間に引きずられるのを見たい」
{"name":"回転リングの空間引きずり","emoji":"🌀","scaleTier":"stellar","description":"重いリングが回転すると内側の空間ごと引きずられ、静止していた粒子が回り始める(マッハの原理)。D0を上げると引きずりが弱まるのも試せる。","camera":{"scale":220},"world":{"boundary":"none","size":0},"physics":{"G":0.02,"D0":0.5,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":2},"bodies":[{"type":"ring","rMul":1.2,"n":14,"cx":0,"cy":0,"rIn":150,"rOut":150,"mMin":80,"mMax":80,"spinMin":0.5,"spinMax":0.5,"vMode":"omega","aroundMass":0,"omega":0.012,"vNoise":0,"direction":1,"pinned":true},{"type":"disk","rMul":1.2,"n":40,"cx":0,"cy":0,"radius":80,"mMin":0.5,"mMax":0.5,"spinMin":0,"spinMax":0,"vMode":"none","aroundMass":0,"vScale":0,"direction":1}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}

例5 要望「床で温めて天井で冷やす対流実験」
{"name":"対流セル — 床加熱・天井冷却","emoji":"♨️","scaleTier":"beaker","description":"床の左〜中央がヒーター(固定・高スピン)、天井の右側が疎な冷却板(固定・スピン0)。温められたガスはスピン斥力で膨らんで浮かび、天井で熱を渡して右から沈む一方向の対流セル。下向きの場は一様重力場gravityYで作る。ガスは軽い粒子にして自己重力の凍結を防ぐ。左右の平均温度グラフ付き。","camera":{"scale":240},"world":{"boundary":"box","size":190},"physics":{"G":0,"D0":2,"kFrame":0,"q":2,"kRep":2,"muF":0.2,"gammaN":0.1,"kappaS":1.2,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":2,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"gravityX":0,"gravityY":0.03,"radiusScale":1,"softening":4,"timeScale":2},"bodies":[{"type":"single","rMul":4,"m":1,"x":-170,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-150,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-130,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-110,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-90,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-70,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-50,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-30,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-10,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":10,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":30,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":10,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":50,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":90,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":130,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":170,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"box","rMul":4,"n":260,"cx":0,"cy":-10,"w":340,"h":320,"mMin":0.05,"mMax":0.05,"spinMin":1,"spinMax":2,"vScale":0.4}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}
(pinned+spin=熱浴の型: 高スピン列=ヒーター、スピン0列=冷却板。床の一部だけを温め、冷却板を天井に疎に置くと一方向の対流セルになり、粒子が冷所に貼り付かない=機械検証済み。下向きの場は gravityY=0.03 — v1.17で導入した一様重力場。時計・光・引きずりを歪めないため、画面外に遠方大質量を置く旧手法より安定する。自己重力・引きずり・放射は0にして「重力+熱膨張」だけで循環を作ると要因が明確になる)
```

---

# 6. 日本語版

## 6.1 このファイルについて

このファイルは、仮想物理ラボ(DFM Simulator)の **AIタブ**が使う仕様の公開版である。
アプリの「生成用プロンプトをコピー」は仕様を全文同梱し、「短縮版をコピー」はこの URL への
リンク参照にする — **中身の骨格は同じ**(第178便で一本化)。**「逐語」と書いた節はアプリ内の
文字列とバイト一致で、QA(`prompt.spec-sync` / `ai.obs-schema` / `ai.unified-prompt`)が
機械的に同期検査している。手で編集しないこと**(更新はアプリ側 → 本ファイルへの反映、の順)。

## 6.2 第178便の一本化(2026-08-23)

- **生成モードの分岐は廃止**した。第170便のカタログモード・第176便の観測採取モードは、
  実機で「コピーしたプロンプトがモードに連動しない」「貼付先が分からずレコードがプリセット
  インポート欄へ入る」という失敗を生んだ。原因は分岐そのものなので、分岐を無くした。
- 配るプロンプトは**1系統**。アプリ内生成・生成用プロンプト・短縮版とも
  「仕様+出力の使い分け+**少数ショット例**+要望」の同じ骨格を運ぶ
  (内蔵実天体一覧の節は**第182便で全経路から撤去** — §6.2b)。
- 少数ショット例は**必ず1つ入る**(選択中のベースのサンプル、未選択なら 🟠「木星とガリレオ衛星
  (実単位)」を**丸ごと** — 第181便で固定。間引き・改変・字数上限は無い)。
- 貼付欄は AIタブの**1つだけ**。レコード配列かプリセットJSONかは**アプリが自動判別**する。
- 実在天体は「モード」ではなく**プリセットとして存在する**。到達手段は「ベースのサンプル」選択で、
  第182便以降は**内蔵に近い系の生成を禁じない**(特殊な条件の要望に答えが返る)。

## 6.2b 第182便の変更(2026-08-23)

- **内蔵の実天体サンプル一覧の節を、全経路(フル・短縮・アプリ内)から撤去した。**
  「一覧に合致したら何も生成せず、サンプル名を1行で案内する」という指示は、同じ節の
  「JSON を1つだけ返す」という取込契約と正面から矛盾していた。指示に忠実なモデルほど
  1行の案内文を返し、アプリは「JSON として読めません」と拒否する — 実機で確認された
  Release blocker である。加えて「内蔵に似ているが条件が特殊な系」という正当な要望まで
  塞いでいた。節ごと撤去したので矛盾は**構造的に消滅**する。
  再混入は QA `prompt.no-contract-conflict`(ja/en × フル/短縮・否定対照つき)が止める。
  カタログ本体(`ASTRO_CATALOG` / `buildAstroPreset` / `buildAstroFromRecords` / 検証器)は
  **内部資産として温存**する — プロンプトから外しただけで、削除はしていない。
- **アプリ内生成は出典を転写できない。** アプリ内の「生成する」はウェブ閲覧を持たない
  LLM API を呼ぶので、出力A が必須とする「実際に開いた url」を持てない。実在天体を作る
  手段は ①近い内蔵サンプルを**ベースのサンプル**に選ぶ ②ウェブ閲覧できるAIチャットへ
  プロンプトを貼って生成し、返答を貼付欄へ — の2つである。AIタブは「生成する」の直下に
  この導線を**常設**で表示する。
- **埋込用の複製から表示専用の注記を落とす。** プロンプトへ埋め込むプリセット
  (少数ショット例・選択したベース)からは `note` / `noteEn` / `roleNote` / `roleNoteEn` を
  機械的に除去する(文字数削減)。**プリセット本体・アプリ内データ・保存は不変**で、
  除去後の JSON もそのまま validator を通る。
- **出力A・出力Bの節を強化した**(外部レビュー第6巡の採用分): ルート判定は必須項目だけ・
  同一天体の body 文字列の完全一致・自転は `rotation_period` 優先・出典品質の階層・
  出力前のケプラー自己チェック・不完全データの扱い・出力A の少数ショット例(コミット済みの
  出典表由来の定数から**実行時に機械生成**)・出力B の物理一貫性ガイド・bulkVx/bulkVy 連動の
  失敗例・円軌道初速 v=√(G·M/r)・scaleTier 代表値表(アプリの既定値定数から機械転記)・
  よくある失敗のネガティブ例。
- **スキーマのドリフトを修正した**: `radius` の値域を正本 0.01〜100 へ統一(別記述の
  0.5〜500 を修正)/ `rMul` を body 型別に明記(single・ring 0.2〜40 / disk・box・grid
  0.2〜20)/ `rays` を `{n, spread}`(spread 0〜1)で明記 / 「出力ルール」の採番の重複
  (8番が2つ)を一意化 / 例の `cLight`=60 が既定 30 と違う意図を明示。
  値域の四者一致(実装の clamp ⇄ 正本定数 `AI_SCHEMA_LIMITS` ⇄ SYSTEM_PROMPT ⇄ 本ファイル)は
  新設 QA `prompt.schema-sync` が機械照合する。

## 6.3 出力の使い分け(逐語 — アプリと同一)

```
# 出力の使い分け(この順で判断する)
1. 要望が**実在の天体・実在の系**で、**必須量**を**このセッションで実際に参照したウェブ出典から写せる** → **出力A(観測レコード配列)を優先する**。
   必須量 = 中心天体の mass・radius / 各衛星の mass・semi_major_axis・orbital_period。判定に入るのはこれだけです。
   任意量(衛星の radius・離心率・軌道傾斜 inclination・自転)は**出典がある場合だけ**足します。無くても出力Bへ落とさないでください。
2. それ以外(架空の系・トイモデル・現象の実験系・出典を開けない実在天体) → **出力B(プリセットJSON)**。

**どちらの出力でも、数値を記憶で埋めてはいけません。** 出力Aは行ごとに、実際に開いた出典の url と取得日 retrieved が必須です — 出典を持てない行は書かずに省略してください(省略は常に正解・推測は常に不正解)。出力Bの数値は「# 例」の流儀(桁・キー構成)に合わせて構成し、実在天体の精度は主張しないでください。出力は JSON を1つだけ(説明文・コードフェンス・複数案を付けない。JSON の代わりに「別のサンプルを使ってください」等の案内文を返さない)。

# 出力A: 観測レコード(ObservationRecord)配列
観測量1つにつき1オブジェクトの JSON 配列。単位換算・スケール指数・配置・初速・qLock の q・共有補正 D₀ は**アプリの決定的関数**が計算します(あなたは触りません)。
{"body":"<天体名>","quantity":"<下記のいずれか>","value":<数値>,"unit":"<SI単位>","source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
quantity [単位]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s] / inclination [rad]
- 中心天体(semi_major_axis を**持たない**天体)はちょうど1つ・かつ最重量。中心には mass と radius が必須。
- 各衛星には mass・semi_major_axis・orbital_period が必須。radius・eccentricity・inclination・自転は**任意** — 出典があるときだけ書きます(無ければアプリが宣言つきで既定化します)。
- 単位は SI のみ(km・日・度は拒否されます)。換算はあなたが行い、その旨を note に書いてください。
- **逆行自転は rotation_period を負の値**で書きます(符号はアプリが spin へ反映します)。質量・半径・軌道長半径・公転周期の負値は拒否されます。**符号は宣言する2D平面での面内の向き**です — 惑星中心系(2D平面=中心天体の赤道面)では、軸傾斜が 90° を超えるだけの「逆行」ラベル(天王星・冥王星など)は面内では**正**で、環・衛星と同じ回り: ラベルは符号にせず note に記します。恒星中心系(2D平面=公転面)で公転面に対して本当に逆行する自転(金星など)は負のままです。
- **逆行公転は inclination を π/2 超(rad)**で書きます(度は rad へ換算し note に明記 — 例: トリトンの 157.345° = 2.746188 rad)。アプリは**向きだけ**を 2D 配置へ転写し(direction=−1)、傾斜そのものは無視して宣言します。π/2 以下の傾斜は記録されますが無視されます(宣言)。inclination は衛星専用で、中心天体に書くと拒否されます。
- **body(天体名)は出典の表記のままでよい**(和名可・英名へ翻訳しない — アプリは Unicode の名前をそのまま識別子にします)。
- **同一天体の body 文字列は全行で完全一致**させてください。出典間で表記が割れていて統一した場合は、元の表記を note に記録します(黙って翻訳・別名解決をしない)。
- **自転は rotation_period を優先**します。spin は出典が角速度を直接示す場合だけ使い、**同一天体に両方を出さない**でください。
- 同じ body+quantity の組は1行だけです。
- 環・塵・名前の無い天体は出力Aに含めません(環・円盤は出力Bの「実在系の近似」の担当です)。**環を持つ系を出力Aで返すときは、環は含めていない旨を note に1行で宣言**してください — 黙って落とさない。

## 出典の品質(出力A)
1. 公的機関・一次アーカイブ(NASA ファクトシート・JPL Horizons・IAU)・DOI つき査読論文。
2. 探査計画の公式アーカイブ(Cassini・Galileo・New Horizons など)。
3. 一次出典を引用している信頼できる二次資料 — 引用されている一次側の URL を優先します。
Wikipedia 単独・ブログ・一次引用の無い教育サイトは避けてください。
mass・semi_major_axis・orbital_period について複数出典が 1% を超えて食い違うときは、その量を省略するか、最新の査読値を採って相違を note に記録します。

## 出力前の自己チェック(出力A)
1. semi_major_axis を持たない天体がちょうど1つで、かつ最重量。
2. 衛星が1つ以上あり、必須3量が揃っている。
3. body+quantity の重複が無い。
4. ケプラー整合: P²/a³ ≈ 4π²/(G·M中心)(出典の精度の範囲で)。転写値がこれを数%を超えて破るときは、単位と出典の元期を確認してください。**辻褄合わせに値を発明しない — 不整合な量は省略します。**
5. 全行に source・実際に開いた url・retrieved がある。

## 不完全なデータ(出力A)
- 開いた出典から衛星の mass・semi_major_axis・orbital_period のいずれかを得られない場合、**その天体ごと省略**します(発明しない)。
- radius・eccentricity だけが無い場合は、その行だけ省略します(アプリが既定を宣言します)。
- 「およそ既知だから」で値を発明しないでください — アプリの自己診断が、実際の力学に合わない発明値を弾きます。

## 例(本プロジェクトにコミット済みの出典表から機械生成)
[
 {
  "body": "Jupiter",
  "quantity": "mass",
  "value": 1.898e+27,
  "unit": "kg",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Transcribed from the committed source table (1e26 kg column converted to kg)."
 },
 {
  "body": "Jupiter",
  "quantity": "radius",
  "value": 71492000,
  "unit": "m",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Equatorial radius; 1e7 m column converted to m."
 },
 {
  "body": "Io",
  "quantity": "mass",
  "value": 8.93e+22,
  "unit": "kg",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Same table, same body string as every other Io row."
 },
 {
  "body": "Io",
  "quantity": "semi_major_axis",
  "value": 421800000,
  "unit": "m",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "km converted to m. Inclination is deliberately ignored: the run is 2D and equatorial."
 },
 {
  "body": "Io",
  "quantity": "orbital_period",
  "value": 152932,
  "unit": "s",
  "source": "dfm-simulator committed source table (paper/data/jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Derived from the two transcribed values above by Kepler's third law P=2*pi*sqrt(a^3/(G*M)) - not recalled from memory."
 }
]

# 出力B: プリセット JSON
上の仕様どおりのプリセットを1つだけ出力します。実在の系を近似する場合も、桁とスケール規約は「# 例」に合わせてください。

## 物理の一貫性(出力B)
- 「# 例」の桁感・キー密度・値域に合わせてください。
- 現象系(対流・空間引きずり・ローター・レンズなど)は、利用者が近い内蔵サンプルを「ベースのサンプル」に選ぶと精度が大きく上がります。ベース未指定のときは、その旨を description の末尾に短く1文だけ書いてかまいません — **JSON の外に文章を足さないでください**。
- 粒子総数は控えめに。現象が要求しない限り 200 未満を推奨します(上限は600)。
- 熱の実験では、ヒーター(pinned・高スピン)と冷却板(pinned・スピン0)を明示的に置き、一様場は gravityY で作ります。
- description で実在天体の精度を主張しないでください(近似した実在系はトイモデルであって定量再現ではありません)。
- 円軌道の初速: v = √(G·M/r)(M=中心質量・r=軌道半径)。
- **移動する中心の従属体**: vx,vy を持つ single の周りに ring/disk を置くときは、必ず**同じ値**を bulkVx,bulkVy に与えてください。
  失敗例: {"type":"single","m":800,"x":0,"y":0,"vx":2,"vy":0,…} + {"type":"disk",…,"vMode":"kepler","aroundMass":800}(bulkVx なし)→ 核だけが飛んで円盤が取り残される。
  正しい例: 同じ disk に "bulkVx":2,"bulkVy":0 を足す。

## 実在系の近似(出力B)
出力Aで表せない実在系(惑星の環・円盤・連続分布)を出力Bで近似するときの規約です:
- 転写の規律は出力Aと同じに保ちます: 中心天体の質量・半径・自転と、特徴半径(環の内外縁・軌道半径)は**実際に開いた出典**から写し、description に出典を記し、それ以上の精度は主張しません。
- サンプル別の実単位を "scaleExp":{"L":<L>,"T":<L−4>,"M":<L+19>} で宣言します。規約 T=L−4・M=L+19(L−T=4・M+2T−3L=11)が実定数(G=6.674・c₀=3×10⁴)を保つ唯一の組で、他の T・M はインポート時に警告されます。L は、中心天体の半径が 0.01〜100 単位に入り、**かつ camera.scale(≈最外の特徴半径×1.2)が有効範囲 20〜3000 に入る**桁を選びます。環だけの系を中心半径だけで選ぶと L が 1 大きくなりがちです — ×1.2 が 20 を割るなら L を 1 下げます(全半径・全質量の数値が桁送りされるだけで物理は同じです)。
- scaleExp を宣言したら "G":6.674・"cLight":30000・"kappaT":7.415555555555556e-9(=G/c₀²)を使います(「# 例」のトイ既定値ではありません)。
- 環は実半径の "ring" 群(vMode:"kepler"・aroundMass=**同じ単位系での**中心質量)にします。出典の無い環の質量は微小値(1粒 1e-6)に置き、その旨を description に書きます。
- **環・円盤は転写した中心の spin と同じ向きに回します**: direction = spin の符号(spin<0 なら direction:-1)。出典が明示的に逆行環と言わない限り、逆向きの環は転写ミスです。
- 実半径系の表示規約: **camera.scale ≈ 最外の特徴半径×1.2**(20 未満はインポート時に 20 へ切り上げられ、系が極小に表示されます — 上の L 選択で範囲内に収めます)・timeScale は規約(最内公転≈5秒)を**最内の特徴**で評価・**dispMag は 1**(既定の 3 は大きな中心の描画が環を覆います — 表示専用)。

## 出力前の自己チェック(出力B)
1. 各 body のキーが仕様の型どおり**過不足なく**揃っている — ring は n, cx, cy, rIn, rOut, mMin, mMax, spinMin, spinMax, vMode, aroundMass, omega, vNoise, direction, pinned。キーを発明しない(ring に r・dr・単独の m を書くとインポートで拒否されます)。
2. vMode:"kepler" の群はすべて aroundMass に中心天体の m(同じ単位系)を宣言している。
3. scaleExp を宣言した場合、T=L−4・M=L+19 が成立し、kappaT が 7.415555555555556e-9 になっている。
4. 出力は JSON オブジェクト1つだけ・キーは仕様にあるものだけ・前後に散文を付けない。

## scaleTier の代表値(アプリの既定値定数から機械転記)
| scaleTier | 1距離単位 [m] | 1時間単位 [s] | 1質量単位 [kg] | 光速表示指数 |
|---|---|---|---|---|
| molecular | 1e-10 | 1e-13 | 1e-26 | 3 |
| beaker | 3.16e-3 | 3.16e-3 | 3.16e-3 | 0 |
| everyday | 1e0 | 1e0 | 1e0 | 0 |
| planetary | 1e8 | 1e4 | 1e24 | 4 |
| stellar | 1e11 | 1e7 | 1e30 | 4 |
| galactic | 1e19 | 1e14 | 1e34 | 5 |
| cosmic | 1e23 | 1e17 | 1e42 | 6 |

# よくある失敗(どちらの出力でも)
- km・日のまま出す(m・s へ自分で換算し、その旨を note に書く)。
- 和名を英名へ翻訳する(出典の表記のまま書く)。
- スケールに収まらない質量を発明する(アプリの宣言つき降格経路に任せるか、その天体を省略する)。
- 散文+JSON・複数案・コードフェンス。
- 出典に無い radius・eccentricity を記憶から補う。
```

## 6.4 ObservationRecord 経路(第176便・第178便で負の自転周期を追加)

### 6.4.1 ObservationRecord スキーマ

観測量1つにつき1オブジェクトの**配列**を渡す。

```json
{"body":"<天体名>","quantity":"<下表のいずれか>","value":<数値>,"unit":"<SI単位>",
 "source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
```

| quantity | 単位(SI 固定) | 役割 |
|---|---|---|
| `mass` | `kg` | **必須**(全天体) |
| `radius` | `m` | 中心は必須(qLock の R)/ 衛星は任意 |
| `rotation_period` | `s` | 自転周期(`spin` があれば省略可)。**逆行は負値**(第178便)— 0 は不可 |
| `spin` | `rad/s` | 自転角速度(`rotation_period` の代わり) |
| `semi_major_axis` | `m` | 衛星は**必須**(これを持たない天体=中心) |
| `eccentricity` | `1`(無次元) | 任意(欠けたら e=0 の円軌道化を宣言) |
| `orbital_period` | `s` | 衛星は**必須**。**自己診断の照合先のみで、配置には使わない** |

- 中心天体は「`semi_major_axis` を持たない天体」で、**ちょうど1つ**・かつ最重量でなければならない。
- 衛星は `semi_major_axis` の昇順に並べ替えられる(位相は 90°(4天体以下)/60°(5天体以上)刻み)。
- `body` は**出典の表記のままでよい**(第181便)。同一天体の同定に使う識別子は
  「小文字化 → Unicode の文字・数字(`\p{L}\p{N}`)以外を除去 → 24字切詰」で作るので、
  和名(例:「冥王星」)・キリル文字・ギリシャ文字の表記でも空にならない。英名へ翻訳する必要はない。

### 6.4.2 拒否条件(**作らない** — 黙って埋めない)

構築を**拒否**する: ルートが配列でない/空配列/`url` が空・非 http(s)/`retrieved` が欠落または
`YYYY-MM(-DD)` 形式でない/`source` が空/`value` が数値でない(数値なし文字列・`null`・NaN)/
`unit` が上表の SI 単位でない(`km`・`d`・`deg` 等)/`invented`・`estimated`・`guessed` 等の
発明・推測フラグが真/上表以外のキー/同じ `body`+`quantity` の重複行/`eccentricity` が 0≤e<1 の外/
質量または軌道長半径が欠ける天体がある/中心の半径が無い/衛星の `orbital_period` が無い/
中心が0個または2個以上/中心より重い衛星がある/天体が1つしかない/`rotation_period` が 0。
**`mass`・`radius`・`semi_major_axis`・`orbital_period` の負値も拒否する**(そこでの負値は物理では
なく写し間違い)。**`rotation_period` と `spin` の負値だけは受理し、逆行として宣言する**(第178便)。

**許容するが宣言する(黙って行わない)**: 中心の自転の出典が無い → `spin=0` と宣言 /
衛星の離心率の出典が無い → `e=0`(円軌道化)と宣言 / 衛星の半径の出典が無い →
描画半径 `radiusScale·√m` への降格を宣言 / 2次元赤道面理想化・中心 `pinned` は常に宣言。
宣言は description と `parameterAudit` の両方に載る。

**超軽量衛星のテスト粒子降格(第181便)**: 規約 `L−T=4`・`M+2T−3L=11` は**1径数族**なので、
中心と衛星の質量比が ~1e7 を超える系(火星と Phobos/Deimos 型)は**どの `L` でも**衛星が
`m` の下限を割る — `L` を上げれば衛星が沈み、下げれば中心の半径が上限を突き抜ける。
この構造的な穴に限り、障害が**衛星(非中心)の `m<1e-6`・`radius<0.01` という下限側だけ**の
ときに、その衛星を値域下限へ引き上げて採用し、実質量(SI)と中心比を添えて宣言する。
**緩めない境界**: 中心天体の逸脱・上限側(`m>20000`・`radius>100`)・座標 ±5000・速度 ±50・
`spin` ±20・`camera.scale` 20〜3000 は従来どおり差し戻す。衛星が1体だけの二体重心系
(`barycentric-peri`)は衛星質量が配置に直接効くので**対象外**。スケール探索の順序・範囲
(`dL=[0,1,-1,2,-2,3,-3]`)は不変で、**降格なしで通る `L` があれば必ずそちらを優先**する。
降格後の構築物にも自己診断 ±1% がそのまま掛かるので、力学が壊れる降格は採用されない。

### 6.4.3 アプリが決める量(**AI は触れない**)

| 量 | 決め方(宣言的規約) |
|---|---|
| スケール指数 L/T/M | `L=floor(log10 R_中心[m])`、**`T=L−4`・`M=L+19`**(規約 `L−T=4` で c₀=3×10⁴、`M+2T−3L=11` で G=6.674 が保たれる唯一の1径数族)。値域に収まらないときだけ L を ±1、±2…とずらす |
| 単位換算 | SI 値 ÷ 10^L(長さ)・÷ 10^M(質量)・× 10^T(角速度)。換算後は**有効9桁へ正規化**(出典桁より十分深い — 2進変換の桁ノイズだけを落とす) |
| 配置・初速 | カタログ経路と**同一の関数**(実ケプラー接線速度。二体は重心系 — 惑星ティアは近点整列 `barycentric-peri`・**恒星ティアは遠点整列 `barycentric-apo`**〔第211便: DFM 版と初期位相を統一。自己診断は感度最大の近点位相の複製で実施〕、多衛星は近点整列 `kepler-peri`)。初速較正 f=1.000 |
| `q` | qLock の**厳密一致式** `q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)`(第172便の運用規約)を**最内衛星の a で1回だけ**評価した直値(小数4桁)。多天体系では実行時 qLock を掛けない(a_ref が一意に決まらない — 🟠🌞 と同じ既存裁定) |
| `D₀` | **0.006**(🌘 で決まった共有値の流用。**本系でのフィットはゼロ**) |
| `camera.scale` | 最外衛星の遠点距離 × 1.2 を**有効2桁へ切り捨て** |
| `dispMag` | 中心天体の描画半径が `camera.scale` の 3〜15% 帯の幾何中央へ最も近くなる刻み(1/3×10^k) |
| `timeScale` | 最内衛星の1公転が実時間で約5秒(60fps)になる刻み(1/3×10^k) |
| メタ | `fidelity:"real"` / `sampleClass:"calibration"` / `notClaim:["solar_cal"]` / `abBody`(kFrame=0 対照)/ `parameterAudit` / 出典表つき provenance を機械付与 |

### 6.4.4 自己診断(生成直後・自動)

構築直後に**複製状態で 400 步の試走**を行い、NaN が出ないこと、および各衛星の推定周期
(接触要素=比エネルギーから求めた長半径のケプラー周期)が**転写した観測周期の ±1%** に
**t=0 と試走終端の両方で**入ることを確認する。**どちらかが外れたら採用しない** —
合わせ込みのフィットは一切しない。2点を測るのは**差し戻しの理由を取り違えないため**である:

- **t=0 が外れる** = 転写そのもののずれ。単位の写し間違い(km と m・日と秒)か、軌道長半径と
  周期が別の出典・別の元期で混ざっている。→ レコードごと差し戻す。
- **t=0 は合うが終端が外れる** = 転写は正しいが、**この配置が試走中に軌道を保てていない**。
  (自由な〔pinned でない〕中心天体+希釈されない引きずり χ≈1 の組み合わせで起きうる。)
  → やはり採用しないが、直すべきはレコードではなく系の構成である。

QA `ai.obs-build` は、🟠 jupiterGalilean を `paper/data/jovian-satellites.csv` から機械生成した
レコード経由で再構築し、カタログ経路の生成物と `physics`/`bodies`/`camera`/`world`/`overlays`/
`scaleExp`/`scaleTier` が**ビット一致**(最大相対差 0)することを機械固定している。

**第178便の追加**: 逆行自転は `rotation_period` を**負の値**で書く(冥王星のような逆行天体)。
符号はそのまま `spin` に反映され、description と `parameterAudit` に宣言される。
`mass`・`radius`・`semi_major_axis`・`orbital_period` の負値は従来どおり拒否する
(そこでの負値は物理ではなく写し間違いである)。

## 6.5 整形・安定化パス(第178便)

貼り付け・生成されたプリセットJSONは、**決定的な整形・安定化パス**を通してから採用する。
**変更した点は必ず全部画面に列挙する**(黙って書き換えない)。順序も固定:

| # | 内容 | 直すか |
|---|---|---|
| ① | κ=G/c₀²(物理対応ロック)の整合 | 実較正の宣言(`fidelity:"real"`・`scaleExp`)があるときだけ**再導出して宣言**。トイ設定は尊重して**変えない**(不一致は注記のみ) |
| ② | `scaleExp` の規約 L−T=4・M+2T−3L=11 | **警告と提案のみ**(T=L−4・M=L+19)。自動では変えない |
| ③ | 円軌道のケプラー再導出(既定ON・チェックボックス) | 中心+周回体と判る配置の、接線速度の天体だけ。**束縛楕円の帯 0<v/v_circ<√2 の中は作者の意図として触らない**。帯の外(脱出速度以上・v/v_circ<0.3 の落ち込み)だけ円へ落として宣言 |
| ④ | `camera.scale`・`softening`・`timeScale` | **明らかに壊れている場合だけ**(カメラが配置の 0.1〜20倍の外・ソフトニングが最内軌道の半分超・1公転が実時間 0.2秒未満/600秒超)。実較正宣言のサンプルは対象外 |
| ⑤ | 自己診断(複製状態で短い試走) | NaN・発散(基準長の50倍超)・全粒子脱出(境界なしで全天体が基準長の5倍外)は**理由付きで差し戻す**。合わせ込みのフィットはしない |

内蔵サンプル73本は、このパスを通しても**変更0件・自己診断 全PASS** である
(QA `ai.stabilize` が機械固定 — 手入れ済みのサンプルを書き換えないことの担保)。

## 6.6 取込の堅牢化(第178便)

- **正規化はリトライ時だけ**。素の `JSON.parse` に失敗したときに限り、スマート引用符(“ ” ‘ ’)・
  全角の構造記号(：，｛｝［］【】（）)・BOM・ゼロ幅文字を正規化して読み直し、成功したら
  「補正して読み込みました(何を補正したか)」と告げる。全角→ASCII は**文字列リテラルの外だけ**に
  適用するので、description の全角文字は1文字も変わらない。**数値は一切書き換えない。**
- **解析エラーは行・列・不正文字(コードポイント)と前後の抜粋**を出す。
- **貼付先の取り違えを案内する**。プリセットのインポート欄に ObservationRecord 配列が来たら、
  「これは観測レコードです — AI追加タブの貼付欄へ」と案内して差し戻す。

## 6.7 採取用プロンプト(正本・逐語)

アプリ内蔵の `HP.buildObsCollectPrompt()` と逐語一致(QA `ai.obs-schema`)。観測レコードだけを
返させたいときに使う、転写器としての役割固定プロンプトである。

```
あなたは、ブラウザで動く『仮想物理ラボ』のための**観測値の転写器**です。数値を発明・推定・記憶で補完してはいけません。出力する値はすべて、あなたが実際に参照した出典から写したものでなければならず、その URL を必ず付けます。

# 絶対ルール
1. **記憶で値を埋めない。** このセッションで出典を読んでいない量は、その行ごと省略してください。省略は常に正解で、推測は常に不正解です。
2. **開いていない URL を書かない。** 仮の URL・「よくあるアーカイブのリンク」も禁止です。
3. **単位は SI のみ** — kg / m / s / rad/s / 1(無次元)。km→m、日・時間→秒 の換算はあなたが行い、その旨を note に書いてください。下表と違う単位の行はアプリが拒否します。
4. 出力は **ObservationRecord オブジェクトの JSON 配列のみ**。説明文・コードフェンス・後書きを付けないでください。
5. 理想化(2次元赤道面・円軌道化・傾斜の無視)は note に**文章として**書きます。**理想化を成立させるために値を捏造してはいけません。**

# スキーマ(観測量1つにつき1オブジェクト)
{"body":"<天体名>","quantity":"<下記のいずれか>","value":<数値>,"unit":"<SI単位>","source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
quantity [単位]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s] / inclination [rad]

# アプリが必要とする量
- 中心天体: mass・radius・rotation_period(または spin)。自転の出典が無ければその行を省略してください — アプリ側が spin=0 と宣言します。自転の符号は**宣言する2D平面での面内の向き**です(惑星中心系では中心天体の赤道面 — 軸傾斜が90°を超えるだけの「逆行」ラベルは符号にせず note に記します)。
- 各衛星: mass・radius・semi_major_axis・eccentricity・orbital_period・inclination。
  * mass と semi_major_axis は**必須**。どれか1天体でも欠けるとアプリは構築を拒否します。
  * radius が無い場合は許容(アプリが表示半径へ降格し、その旨を宣言します)。
  * eccentricity が無い場合は許容(アプリが e=0 の円軌道化を宣言します)。
  * inclination(rad)は任意: π/2 超はアプリが**逆行公転**として構築します(向きのみ — 傾斜そのものは無視して宣言)。
  * orbital_period はアプリの**自己診断の照合先**で、配置には使いません。必須です。
- 環・塵・名前の無い天体は含めないでください(環・円盤は生成プロンプト側の「実在系の近似〔出力B〕」が扱います)。対象の系に環がある場合は、環を含めていない旨を note に宣言してください — 黙って落とさない。

# 例(本プロジェクトにコミット済みの出典表から機械生成した2行)
[
 {
  "body": "Io",
  "quantity": "mass",
  "value": 8.93e+22,
  "unit": "kg",
  "source": "dfm-simulator source table (jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Transcribed from the committed source table; the primary catalogue reference is still to be pinned."
 },
 {
  "body": "Io",
  "quantity": "semi_major_axis",
  "value": 421800000,
  "unit": "m",
  "source": "dfm-simulator source table (jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "= 421800 km. Inclination 0.04 deg is deliberately ignored: the run is two-dimensional and equatorial."
 }
]

# あなたの仕事
利用者が指定した系のレコードを転写してください。出力は JSON 配列のみです。
```

## 7. 天体再現ゲート表テンプレ(第197便 M0)

天体再現計画(連星〜棒渦巻 — 論文4)の各段階サンプルは、**測る前に**次のゲート一式を宣言して
従う。観測再現版(宣言的解析ハロー `physics.halo` つき — uniform/nfw/burkert)と DFM 版
(ハローなし・ダークローター)は同じ表で対で評価する:

| ゲート | 合格条件(宣言してから測る) |
|---|---|
| 健全性 | NaN 0・クランプ 0 |
| 保存則 | 帳簿(P/L+リザーバ)が閉じる |
| 収束 | dt 半減・軟化長半減で秩序変数が窓内 |
| 多seed | 宣言 seed 集合で全数再現(範囲を報告 — 最良値だけを出さない) |
| 摂動回復 | 正式 injector の摂動から秩序変数が復帰 |
| 時間窓 | 窓を宣言し、窓外の挙動も報告 |
| ノックアウト | ハロー / ローター / kFrame の3系統(観測版はハロー抜きが対照) |
| 用量反応 | 駆動を主張する係数は単調応答を要求 |
| 保留データ | parameterAudit.heldOut に宣言し、凍結後にのみ判定 |
| 主張ラベル | 公表値に4値ラベル(fixed / derived / fit / held_out) |

- `parameterAudit.heldOut`(第197便で許容キー化)は「構築後に照合する保留観測量」の宣言枠。
  fit にも derived にも入れない値はここに置き、凍結前に見ない。
- `physics.halo` は観測再現版専用の外部項(公理ではない — docs/PHYSICS.md の該当節参照)。
  生成 AI はこのキーを使わない。
- **観測安定則(第199便 M1 — 2026-08-25 裁定)**: 観測値再現版は、観測値で安定する計算式を
  採用する(観測値自体が計算式で算出されている為)。kFrame=1 雛形が自己診断で永年不安定と
  差し戻される系に限り kFrame=0 で採用し、引きずりは A/B の**測定側**として保持する
  (適用第1号: ✨ αケンタウリAB。転写ミスは従来どおり差し戻し — docs/PHYSICS.md の該当節参照)。

