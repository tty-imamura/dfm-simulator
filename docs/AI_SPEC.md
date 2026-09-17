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
- single: {type,m,x,y,vx,vy,spin,pinned} — 粒子1個。pinned:true で力を受けず固定。省略可の rMul(半径倍率 0.2〜40・既定1。R=radiusScale·rMul·√|m|)。省略可の dragQ(粒子別の引きずり減衰指数 0.5〜40・既定は physics.q)。
- ring: {type,n,cx,cy,rIn,rOut,mMin,mMax,spinMin,spinMax,vMode,aroundMass,omega,vNoise,direction,pinned} — 半径rIn〜rOutの環にn個。vMode: "kepler"(aroundMassの周りを公転)|"omega"(v=omega×r)|"none"。direction: 1=反時計,-1=時計。省略可の rMul(0.2〜40)。
- disk: {type,n,cx,cy,radius,mMin,mMax,spinMin,spinMax,vMode,aroundMass,vScale,direction} — 半径radiusの円盤にn個。vMode: "kepler"(vScaleは倍率,通常1)|"rigid"(vScale=角速度)|"flat"(vScale=一定速さ)|"random"(vScale=速さ)|"enclosed"(配置後の実ポテンシャルの円運動解・vScaleは倍率)|"virial"(群のビリアル平衡 ⟨v²⟩=−W/M・vScaleは倍率)|"none"。省略可の rMul(0.2〜20)。
- box: {type,n,cx,cy,w,h,mMin,mMax,spinMin,spinMax,vScale} — 幅w高さhの矩形にn個、ランダム方向に速さ〜vScale。省略可の rMul(0.2〜20)。
- ring/disk/box には省略可の bulkVx,bulkVy(母集団の並進速度)を指定できる。移動する天体(vx,vyを持つ single)の周りに円盤・環を置くときは、必ず同じ値を bulkVx,bulkVy に与えて核と一体で動かすこと。
- single には省略可の zonal(扁平中心天体の帯状重力補正 E13)を指定できる: {"refR":基準半径,"calib":1,"J":{"2":0.0163,"4":-0.0009}}。偶数次 J2〜J12 のみ・|J|≤0.1・refR:1〜5000・calib:0〜2。中心の大質量 pinned 粒子に付けると周回粒子の楕円軌道の近点が前進する(内側ほど速い差動近点移動 — 画面左上に実測/解析の近点移動が表示される)。土星なら J2≈0.0163。要望が扁平天体・歳差・近点移動のときだけ使う高度な属性で、通常のプリセットでは指定しない。
- single/ring/disk には省略可の core(コアv2 — 中心コアの独立サブシステム)を指定できる: {"mode":"rigid"|"differential"|"active"|"cavity","massFrac":0.01〜0.95,"radius":0.01〜200,"omega":−50〜50,"Kcs":0〜10,"pump":0〜5,"contract":0〜0.2,"sourceRate":0〜100,"voidFraction":0.01〜1}。m は総質量のままで、massFrac=Mc/m・radius=コア半径 R_c(絶対値)・omega=初期コア角速度 Ω_c(角運動量 J=½·Mc·R_c²·Ω として保持され、以後 J が主変数)。差動分だけが ω += (Mc/m)·(Ω_c−s)·(R_c/(R_c+d))^q として追加の空間引きずりに効く。mode: rigid=殻と剛体回転(差動なし)・differential=独立回転・active=differential+sourceRate で内部エネルギー注入・cavity=空洞(massFrac の代わりに voidFraction。引きずりの符号が反転)。Kcs はコア⇄殻のトルク結合(緩和率)・contract は収縮率(J 保存で Ω 上昇)・pump はパワーボール係数。要望がコア/深部回転・空洞天体・2層天体・ダークローターのときだけ使う高度な属性。
- core.shed(省略可・第244便/第246便): コアの回転が限界を超えたら**殻の一部をガス粒へ割って放出する**保存的な質量放出。{"omegaCrit":発火する|Ω_c|,"frac":放出する殻質量の比(0〜0.6],"n":粒数(4〜128・偶数),"rLaunch":放出半径(親半径R単位),"jFrac":コアJの移送比0〜1,"once":true/false,"rInner":最内層の半径(親半径R単位・既定=rLaunch),"layers":層数1〜8(既定1・n は layers×偶数へ正規化),"cooldown":再発火までの最短時間(once:false のときだけ効く)}。layers≧2 なら粒は rInner·R〜rLaunch·R の等間隔の層に置かれる(元の半径の円周だけでなくコアとの間にも配置される)。once:false は「Ω が再び omegaCrit を超えたら再発火」= 外殻が徐々に剥がれる。質量・運動量・角運動量・エネルギーは帳簿込みで閉じ、収支が負なら発火しない。core.burst(省略可・第234便): {"rate":放出率,"frac":放出する|J|の総比率} でコアの回転エネルギーを気体殻へ保存的に注入する(爆発)。要望が質量放出・恒星風・超新星・白色矮星/中性子星のときだけ使う高度な属性。
- core.rTarget / core.bindLedger / core.shed.bare(省略可・第247便c — コア収縮の終端と裸コア終端): "rTarget":収縮の終端半径(0〜200・既定0=無制限 — contract は到達で止まる)。"bindLedger":"pairU" は「点粒子に自己重力エネルギーは無い」ことの宣言で、結合Eの状態関数 U_bind=−a·G·Mc²/R_c("bindA"=a・0〜10・既定0.6)を記録専用で持ち、各ステップの収縮に avail=ΔU_bind−ΔE_rot<0 ならその収縮を行わない予算門が掛かる。core.shed の "bare":true と "bareBelow":しきい値(≤1 はコア質量比・>1 は絶対質量・既定0.01)は、殻質量がしきい値を下回ったら次の発火で残りの殻を全部出して Mc=M(massFrac=1)の終端状態にする(保存契約「残骸>コア」の唯一の例外・1粒子1回だけ)。いずれも opt-in で未宣言なら従来と1bit不変。要望が「コアの収縮がどこで止まるか」「回転が速すぎて縮めない核」「白色矮星/中性子星が最後に裸のコアになる」のときだけ使う高度な属性。
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
(`barycentric-peri`/`barycentric-apo`)は衛星質量が配置(重心配分)に直接効くので**質量降格は
対象外**のまま — ただし**半径だけ**が下限を割る場合(白色矮星 Sirius B 等)は、半径が二体の
配置・初速の式に一切入らない(表示半径と引きずり場の下限のみ)ため、半径のみの引き上げに限り
宣言つきで認める(第214便)。スケール探索の順序・範囲
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
- **観測 Q の転写(第246便 — `body.spinDipole`)**: single に `{"omega":自転角速度, "radius":半径, "source":"observed"|"declared"}` を宣言すると `physics.spinSpin`(玩具のスピン双極子間力)の Q_i **だけ**を Q=½m·radius²·omega へ上書きする読み取り専用の源になる(力学の殻 spin ±20・コア Ω ±50 には一切書かない・未宣言は 1 bit 不変)。**生成 AI はこのキーを使わない** — コンパクト天体連星の観測転写(docs/PHYSICS.md 第246便b の節)専用である。
  第247便a: 宣言フラグ `ssDeclared` を内部に持つようになり、**`omega:0` の明示宣言は Q=0 のまま**(従来式へは戻らない)= ゼロスピンの否定対照が作れる。
- **コンパクト連星の追加対力(第251便a — `physics.compactForce`)**: `{"model":"current"|"manev"|"lj", …係数}` を宣言すると、`S._core` の外の O(n²) パスで対ごとの追加力が入る**玩具の opt-in**(`spinSpin`・`axisForce` と同じ外部オーバーレイの枠 — DFM の公理からの帰結ではない)。
  `current`(案K)は `kappa`・`chiGate`(既定 0.5)・`rc`、`manev` は `alphaK`(既定 3)・`cGate`(既定 0.01)・`rc`・`fMass`、`lj` は `C6`・`C8`・`rc`・`xiTh`(既定 0.05)・`sFloor`(既定 1e-12)を取る。
  **用量 0(current の κ=0・manev の alphaK=0・lj の C₆=C₈=0)は未宣言へ正規化**され、プリセット署名・エクスポート JSON が 1 文字も変わらない(未宣言は `S.hasCompactForce=false` で素通り = 既定経路 1 bit 不変)。
  ゲート(`current` は実行時 χ・`manev` は C=G(m/f)/(Rc²)・`lj` は Ξ=Gm/(Rc²) の合成 σ)を下回る対は **U も力もビットで 0** になる。
  **第252便a: `current` に `velocityFrame` が増えた**(`"absolute"`=既定=第251便a のまま v₁·v₂ の絶対速度積 /
  `"pair"`=相対速度だけ v₁·v₂ → −ν|v₂−v₁|²、ν=m₁m₂/M²)。**既定 `"absolute"` はプリセット署名へ入らない**(宣言と未宣言で
  エクスポート JSON が 1 文字も変わらない・既定経路の演算順も不変)。重心が静止した孤立連星では両枠は解析的に一致し、
  **重心が背景決定力場に対して走っている系でだけ差が出る**(実測は docs/PHYSICS.md 第252便a の節)。未知の値は受理せず検証器が却下する。
  **生成 AI はこのキーを使わない** — コンパクト連星の候補力の検証(docs/PHYSICS.md 第251便a・第252便a の節)専用である。
- **`physics.D0` の 0(第257便c — 第49報「『背景決定力 D₀』のスライダーの下限を『0』にする」)**: `D0` の値域は
  第118便から `[0, 1e6]` で、**0 は前から受理していた値**である(内蔵 14 本 ⏱️🛰️🕰️🌟⏲️📦🌀📈🫧🪢🫁🔦🧭🕸️ が
  D₀=0 を宣言している)。第257便c で**「法則の実験室」のスライダーの左端も 0 になった**(`zeroLeft` —— 重力 G・
  時空係数 κ と同じ機構。対数域の下端 0.005 はそのまま)。**意味**: D₀=0 は「遠方の錨が無い」状態で、
  源が 1 つでもある点では χ=W/(W+D₀) が **1** になり、近くの質量だけが基準になる。**源が 1 つも無い点**
  (W=0)は 0/0 になるので、**χ=0 に落とす門**が全経路に入っている(第257便c で `dfmBinaryChi` に足したのが
  最後の 1 か所。**D₀>0 の既定経路は同じ式を評価するので数値は 1 bit も変わらない**)。
  実測(代表 10 本 × 600 步): **NaN 0・速度/スピンクランプ 0・帳簿有限**、D₀=0 と 0.005 の差は連続
  (docs/PHYSICS.md〔第257便c〕6.)。**生成 AI が D₀=0 を選ぶ理由は普通は無い** —— ばら撒き系の安定には
  D₀ を 20 以上にする(上の 5.)。
- **`physics.D0pull` の意味(第252便a で統一・第254便a で宣言解禁)**: pull 重みの分母に入る背景項 D₀ᵖ は、
  **未宣言なら `physics.D0` へフォールバックし、宣言された値はその値をそのまま使う**(場コード 4 か所と
  `compactForce` の χ 算出で同じ規約。第251便a までは場コード側が `D0pull>0` で判定していたため
  「明示的な 0」の扱いが 2 通りあった)。**第254便a で `D0pull:0` のプリセット宣言を解禁した**:
  検証器 `validatePreset` は **宣言された D0pull を値に関わらず保持する**ようになり、
  **明示 0 は真の 0**(χ=W/(W+0)=1 厳密)・**未宣言は `undefined`**(D₀ へフォールバック)になる。
  旧セーブには `"D0pull":0` が存在しない(旧検証器が落としていたので書き出されない)ので、**旧セーブの意味は 1 つも変わらない**。
  署名が変わるのは**新しく `D0pull:0` を宣言したプリセットだけ**で、**全内蔵プリセットは 600 步ビット同一**である。
  **注意**: χ→1 の極は安全クランプが出る帯である(🪟 D0pull=0・dt=0.004・100 万步で 199 万回)。
- **空間メッシュの力への接続(第254便a — `physics.spaceMesh`)**: `{"mode":"vertex", "gravity":true|false,
  "inertia":"material"|"action"|false, "light":"background"|"mesh", "D0":数値(任意)}` を宣言すると、
  `S._core` の**外**の 1 パスで **メッシュの重力チャネルと慣性チャネル**が入る **opt-in(既定 OFF)**。
  `mode` 欠落・`gravity` と `inertia` が両方 false・`null` は**未宣言へ正規化**され、署名が 1 文字も変わらない。
  - `gravity:true` … メッシュ側の **g=G∇D_grav**(D_grav=Σm/√(d²+ε²))で当該対の E4 重力を置き換える。
    **核が E4=G∇W と同じなので、置き換え差は丸めの水準に留まる**(🪟 で 1 步 |Δa_g|=0〜2.8×10⁻¹⁸)——
    「メッシュの重力」は既にある重力の別名であって、二重に数えるものではない。
  - `inertia` … **3 候補**(`material`: a=g+∂ₜu+(∇u)v / `action`: a=g+∂ₜu+(∇u)v−(∇u)ᵀ(v−u) /
    **`coordinate`(第257便a)**)。**どれも「まだ採用しない」候補**である: material/action は頂点で
    |a_I|/|g_N| が χ に 5 桁一致する(= 重力加速度の再導出)ため、足すと二重計上になって連星が壊れる
    (docs/PHYSICS.md 第254便a ③④)。**生成 AI はこの値を使わない。**
  - `light` … **宣言と検証器の門だけ**で、photon/traceRay には 1 バイトも接続していない(既定 `background` は署名へ入れない)。
  - `D0` … χ の分母。省略時はプリセットの `D0pull`(未宣言なら `D0`)。
  帳簿は **`S.spaceMeshWorkE`**(外部仕事)で、慣性項が入れた運動量・角運動量は resPx/resPy/resL のリザーバへ記帳する
  (**反作用は未定義** = 閉じた系ではないことの宣言)。**生成 AI はこのキーを使わない** —
  空間メッシュの検証(docs/PHYSICS.md 第254便a の節)専用である。
  - **〔第255便a 追補〕** `S.spaceMeshWorkE` は **離散キックの厳密仕事** Σm(|v′|²−|v|²)/2 へ変わった
    (旧式 F·v·dt はキック**前**の速度で測るので m|Δv|²/2 が抜けていた)。**pinned の未適用分は
    別欄 `S.spaceMeshWorkPinned`**。T2 メッシュの**原点は重心**になり(`M.origin`=重心・
    `M.barycentre`/`M.midpoint` を両方返す)、`_spaceMeshForce` の C̈ も (m₀g₀+m₁g₁)/M である
    —— **等質量では中点式と厳密に同じ値**なので既存プリセットは 1 bit も動かない。
- **対ごとの織り込み(第255便a — `physics.spaceMesh.weave`)**: `"off"`(既定)/`"pair"`/`"pairFull"`。
  **引きずり(A8/E6′)が読むフレームだけ**を対の瞬間メッシュ u_pair=χ·u_node+(1−χ)·u_bg へ織り込む
  **opt-in**(**E4 には触らない**)。頂点契約 u_node(xᵢ)=vᵢ から **vᵢ−u_pair=(1−χ)(vᵢ−u_bg)**。
  - `"pair"` … **相対速度の読み替え**(Δv=kF(1−χ)Δu_frame)。χ→1 で対の自己引きずりが消える。
  - `"pairFull"` … フレームそのものの代入(Δv=kF·Δu_pair)。**頂点では χΔvᵢ の自己項が残るので
    連星が壊れる**(🪟 40 万步で r が 15.2〜2999.5・クランプ 795510 = 第254便a の慣性退化と同じ姿)。
    **否定対照として残しているだけで、採用していない。**
  - **legacy E6′(geoPN=0)の帯にしか織らない**(geoPN≥1 は `S.spaceMeshWeaveStop="geoPN"` で素通り)。
    **多体(n≥3)は |m| 上位 2 体の対だけ**に織る。`kFrame=0` ではビット不変。
  - 帳簿は `S.spaceMeshWeavePx/Py/L/E`(E は離散キックの厳密仕事)+ リザーバ(resPx/resPy/resL)。
  **生成 AI はこのキーを使わない。** QA `behavior.pairWeave`。
- **geoPN=2 への織り込み(第256便a — `physics.spaceMesh.weave:"pairPN"|"pairPNFull"`)**: 統一測地線則
  (geoPN=2・E12v2)の帯だけに効く**診断専用の 2 値**。`"pair"`/`"pairFull"` は geoPN≥1 で停止したままである
  (`S.spaceMeshWeaveStop="geoPN"`)。逆に **`"pairPN"`/`"pairPNFull"` は geoPN<2 で停止する**(帯の鏡)。
  織り込むのは**輸送 3 項が読むフレーム**と**1PN の速度依存項の引数 w=v−k_F·u だけ**で、
  **1PN の係数(c_A=1+2α・c_B=α−½・λ_PN/c²)には触らない**。E4 にも触らない。
  - `"pairPN"` … **相対速度の読み替え**(要求差分 = −k_F·χᵢ·T(u,∇u) —— 頂点に残る輸送は背景ぶんの (1−χ) だけ)。
  - `"pairPNFull"` … **フレームそのものの代入**(要求差分 = k_F·[T(u_pair,∇u_pair) − T(u,∇u)])。
    頂点では u_pair=χvᵢ なので ∂ₜu_pair≈χaᵢ の自己項が残り、**連星を壊す**(否定対照 —— 採用していない)。
  - **∇u と ∂ₜu は χ 混合込みで同一時刻に一括評価する**(u だけ差し替えない):
    ∇u=χ∇u_n+(1−χ)∇u_bg+(u_n−u_bg)⊗∇χ / ∂ₜu=χ∂ₜu_n+(1−χ)∂ₜu_bg+χ̇(u_n−u_bg)。
    正本は純関数 **`HP.dfmMeshWeaveBlend({chi,chiDot,gradChi,un,gradUn,ubg,gradUbg,dtUn,dtUbg})`**
    → `{u,gradU,dtU,curl,div,jump}`(行列は行優先。**u_n=u_bg では ∇χ 項も χ̇ 項も厳密に 0**)。
  - `frameReaction:"pairReduced"` の宇宙では、**要求差分も ③′ の同じ線形写像(換算質量対称インパルス+
    背景持ち分)を通す**。1PN の差分は _core と同じく**加速度として直接**当て、対反作用 Δa_j=−Δa_i·m_i/m_j を返す。
  - `kFrame=0` ではビット不変。χ→0 では OFF へ戻る。**多体(n≥3)は |m| 上位 2 体の対だけ**。
  - 帳簿は `weave` と同じ(`S.spaceMeshWeavePx/Py/L/E` + リザーバ)。診断は
    `S.spaceMeshWeaveMode`・`S.spaceMeshWeaveTrDv`(輸送側の 1 步 |Δv|)・`S.spaceMeshWeavePNDv`(1PN 側)。
  **どの内蔵プリセットも宣言していない。生成 AI はこのキーを使わない。** QA `behavior.pairWeavePN`。
  - **〔第257便a 訂正・追補〕** ① **1PN の w は両側とも「前步の場」で読む**(輸送ループが今步の値へ更新する**前**に
    u_frame,prev と u_pair,prev の両方を退避する)。第256便a は u_pair 側だけを退避していた。
    実測の変化は 1PN チャネルの 1 步 |Δv| の相対 1.7×10⁻⁴ で、**20 近点窓の P・Δϖ は印字桁で同一**である。
    ② `"pairPN"` は **T_pair も ∇u_pair も ∇χ も計算しない**(要求差分が −k_F·χ·T(u,∇u) だけで決まるため)。
    それらを作るのは `"pairPNFull"`(と診断)のときだけである。
    ③ **`"pair"`/`"pairFull"` の要求差分も `"pairPN"` と同じ ③′ の共有ヘルパを通す**(規約統一)。
    🪟 は `frameReaction:"pairReduced"` なので `"pair"` の数値は動く(近点間 P が +0.0003〜+0.05%)。
    **`"off"`・未宣言はビット同一のままである。**
- **座標変換慣性(第257便a — `physics.spaceMesh.inertia:"coordinate"` と 3 つのノブ)**: 第49報
  「空間メッシュに対する相対的な移動が慣性である」を**作用で宣言した** opt-in の慣性則(**診断専用**)。
  宣言する作用は 1 本だけである:

      **L = ½m|v − η·χ·u_mesh(x,t)|² − mΦ**   (η=`inertiaGain`・χ=W/(D₀ᵖ+W_B+W) は既存の追従比)

  Euler–Lagrange(**∂u/∂x 項を落とさない**)から ū=η·χ·u_mesh と置いて
  **a = g + ∂ₜū + (∇ū)v − (∇ū)ᵀ(v−ū)**。**η=1・置換なしなら式は `inertia:"action"` と同型**である。
  - **`inertiaGain`**(η∈[0,1]・既定 1)… 相対慣性の強度。**表示側の gain とは別物である**(名前も別)。
  - **`inertiaVertices`**(既定 `false`)… 頂点(メッシュを定義する側)自身へ当てるか。
    **2 体系では非頂点が存在しないので、既定では何も起きない**(`S.meshCoordN=0`・OFF とビット同一)。
  - **`inertiaReaction`**(`"pair"` 既定 / `"reservoir"`)… 反作用の返し先。`"pair"` は非頂点粒子が受けた
    運動量の負を**頂点対へ等量**返し、残った角運動量を**接線偶力**(P 中立)で返す。`"reservoir"` は
    無限慣性リザーバの帳簿へ。**頂点自身へ当てた分と箱の場は常に reservoir 側**である。
  - **加算ではなく置換**: この則が立つ粒子には **E6′(geoPN=0)/ E12v2 の輸送 3 項(geoPN=2)の追従キックを
    当てない**(エンジンが当てた式を打ち消す要求を書く演算子分割)。geoPN=1 は物質への E6′ が無いので除去 0。
    `frameReaction:"pairReduced"` では除去要求も ③′ の同じ線形写像を通す。
  - **メッシュの源は 2 通り**(`S.meshCoordSrc`): UniverseBox を宣言した宇宙では**箱の規定場**
    (u_B=V+Ωẑ×(r−c)+H(r−c)。`mode:"exp"`/`"lin"` だけ。他は `S.meshCoordStop="boxMode"` で停止)、
    それ以外は **|m| 上位 2 体の T2 メッシュ**。
  - **既定値は署名に出ない**(η=1・vertices=false・reaction="pair" は 1 文字も出さない = 未宣言と同じ正準形)。
    **`inertia` が立っていないときは 3 つとも出さない。**
  - 帳簿: `S.meshCoordPx/Py/L`(粒子系へ入れた運動量・角運動量)・`S.meshCoordE`(離散キックの厳密仕事)・
    **`S.meshCoordEmesh=−E`**・`S.meshCoordChi`/`N`/`Stop`/`Src`/`Clamp`・
    `S.meshCoordDvI`(慣性チャネルの 1 步 |Δv|)・`S.meshCoordDvE6`(除去チャネル)。リザーバへも同時記帳する。
  - **どの内蔵プリセットも宣言していない。生成 AI はこのキーを使わない。** QA `behavior.meshCoordInertia`。
  - **限界**: T2 頂点メッシュは**局所的でない**(|a_I|/|g_N| が r=300→4800 で 1.97→1370 まで伸びる)ので、
    **遠方粒子・銀河・星団へこのまま当ててはならない**(docs/PHYSICS.md 第257便a ⑤3)。
- **〔第258便a 追補〕支持関数つき局所場と η_eff(第50報・3 審査 v16 Q1c/ChatGPT §3.3・§3.6)**:
  - **`inertiaSupport`**(`"none"` 既定 /`"support"`/`"chiCut"`/`"expGate"`)… 非局所性の門の**3 案**。
    `"support"` は場そのものを純関数 `HP.dfmLocalMeshField` の**台がコンパクトな局所場**へ差し替える
    (u・∇u・∂ₜu の 3 つとも)。`"chiCut"` は χ<`inertiaChiCut` で**当てない**(加速度の突然カット)、
    `"expGate"` は ū へ exp(−(r/R)⁴) を掛ける(∇・∂ₜ は積の微分で入れる)。**どちらも対照**である。
  - **`inertiaSupportR`**(正の数値・任意)… 支持半径 R。**無宣言なら頂点対の分離 r_sep の
    `SPACE_MESH_SUPPORT_RSEP`=3 倍**(毎步)。**R は宣言値であって重力の切断半径ではない**
    —— 重力(E4)へは 1 バイトも接続していない。
  - **`inertiaChiCut`**(0〜1・既定 0.05)… `"chiCut"` の閾値。
  - **箱の源では支持関数を掛けない**(空間一様な W_B に掛ける相手がいない)。宣言すると
    `S.meshCoordStop="supportBox"` で停止する(黙って無視しない)。
  - **`S.meshCoordStop` の値が 2 つ増えた**: `"noTargets"`(候補が全部頂点 = **2 体系の既定はこれ**)と
    `"noU"`(u の履歴が無い/kFrame=0 で E6′ が走っていない)。`S.meshCoordOut` は支持外で当てなかった数。
  - **η_eff = kFrame × `inertiaGain`**(契約変更): kFrame は E6′/E12 の追従の結合定数で、本則はその追従を
    **置換**するので、置換後の強さも同じ結合で読む。**kFrame=0 では何も起こらない**。
    実測(剛体箱・χ=W_B/(D₀+W_B)): 残差/(Ω²r)=**(1−kFrame·η·χ)²**。同じ箱で **E6′ は (1−kFrame·χ) の 1 乗**。
    **q は χ に入らない**(q=1/3/6 で χ も残差も 8 桁一致)。
  - **除去は「実際に当てた Δv」を引く**(第257便a は步末に式を再計算していた)。`_core` が ③/③′ を
    通って速度へ入れた量そのものを控えて引く。**限界**: 本パスは `S._core` の後なので、步の途中の
    Δv による**位置のずれは取り消せない**(多体で O(dt) の分割誤差)。また**引くのは対象粒子が受けた分だけ**で、
    その粒子が相手へ配った反作用は戻さない(その非対称ぶんはリザーバ帳簿へ)。
- **純関数(第258便a)**: **`HP.dfmLocalMeshField(sources, x, y, {D0,eps,p,R,bg})`** →
  `{u,gradU,dUdt,chi,W,gradW,dWdt,nIn,D0,R}`。w_i=m_i(r_i²+ε²)^(−p/2)·C(r_i/R_i)・**C(z)=(1−z)⁴(1+4z)**(0≤z<1)・
  0(z≥1)、u_i=v_i+ω_i ẑ×(x−x_i)、u=(Σw_iu_i+D₀u_bg)/(D₀+Σw_i)、**∇u=(∇N−u⊗∇D)/D**・
  **∂ₜu=(∂ₜN−u·∂ₜD)/D**(商の微分)。源ごとに `{m,x,y,vx,vy,ax,ay,omega,omegaDot,R}` を読む。
  **D₀=0 かつ支持内に源が無い点・R 無宣言・非有限は null**(0 で埋めない)。**力へは接続しない純関数**である。
  - **〔第259便a 追補〕Ṙ 補正と負質量拒否**: 既定の支持半径は「頂点対の分離 r_sep の 3 倍」= **時間変化する量**なので、
    ∂ₜw に **+20·m·(r²+ε²)^(−p/2)·z²(1−z)³·Ṙ/R**(C′(z)=−20z(1−z)³ 由来)が要る。源ごとの `Rdot`(または
    `opts.Rdot`)を宣言したときだけ入り、**宣言しなければ第258便a と 1 bit 同一**である。返り値に
    **`RdotUsed`**(この呼び出しで Ṙ 項が入ったか)と **`support`**(支持関数を掛けたか)が増えた。
    `opts.support:false` を渡すと **C≡1**(支持関数なし = 大域の正規化平均 = 第254便の法則)になり、R は要らない。
    **`m≤0` の源は拒否**(null —— 支持つきの正規化平均は Σw が 0 を跨ぐと χ も u も意味を失う)。
- **共通場 API(第259便a)**: **`HP.dfmField(state, x, y, {excludeBodyId, background, lawVersion, p, R, Rdot, D0, eps, G, bg, energyContract})`**
  → `{D, gradD, gravity, u, gradU, dUdt, chi, sourceIds, supportPolicy, timeDerivativeComplete, energyContract, W, gradW, dWdt, nIn}`。
  `state` は `[{id?,m,x,y,vx,vy,ax,ay,omega,omegaDot,R?,Rdot?}, …]` か `{bodies:[…]}`(**S は読まない純関数**)。
  - **D=Σmᵢ/√(rᵢ²+ε²) と ∇D を同じ源集合から**返し、**重力は g=G∇D**(E4 の pair 和と実測で差 0 —— 同じ核なので
    置き換えても二重にも半分にもならない)。
  - `lawVersion`: `"scalar"`(既定・大域の正規化平均 = 第254便)/ `"local"`(支持関数つき = 第258便a・**R の宣言が要る**)/
    `"complex"`(**重ね合わせ A** = 第259便a・**u は速度ではない**・χ は null)。
  - `background`: `"static"`(既定・u_bg=0)/ `"frame"`(**呼び出し側が `bg:{u,gradU?,dUdt?}` を渡す**。渡さないと null
    —— 純関数は S を読めないので**ゼロ埋めしない**)。
  - **`timeDerivativeComplete`**(**第260便a で正直化**): 「∂ₜu にこの法則で必要な項が全部入っているか」を、
    **源の `ax`/`ay` と背景の ∂ₜu_bg が揃ったときだけ** true にする(第259便a は `"scalar"`/`"complex"` を
    無条件 true にしていたが、∂ₜu には Σw·a_i が入る)。`"local"` はさらに `Rdot` の宣言が要る。
    `background:"static"` は u_bg≡0 なので ∂ₜu_bg≡0 が厳密に既知(揃っている扱い)、`"frame"` は
    `bg.dUdt` を渡したときだけ揃う。**`"complex"` に `"frame"` を宣言しても false**(A は背景項を持たない)。
    読み口として **`accComplete`**(源の a が全部宣言されたか)・**`bgDtComplete`**・
    **`uQuantity`**(`"velocity"` / **`"unnormalizedA"`** = complex の A は速度ではない)が増えた。
  - **`excludeBodyId` は宣言された数値 ID だけを外す(第260便a)**。**添字は ID を宣言していない body の代替**で
    ある(第259便a は `id===exId || i===exId` と両方見ていたので、id:9 の body が添字 1 にいると
    `excludeBodyId:1` で消えていた)。
  - **要求別 `need:"all"|"gravity"`(第260便a)**: `"gravity"` は **D・∇D・g だけ**を返し u/∇u/∂ₜu/χ は
    **null**(ゼロ埋めしない)。**重力は源が空でも定義される**(空和 = 0)が、**u は D₀=0 かつ源なしでは
    定義されない**(分母が 0)—— この 1 点だけが違う。`HP.DFM_FIELD_NEED` が受理値。
  - `energyContract` は `"none"`(既定)/`"meshLedger"`/`"toy"` の文字列で、**この関数は帳簿を持たない**ことの宣言。
  - **門**(null): 未知の lawVersion/energyContract/need・`"frame"` で bg 未指定・D₀<0・state が配列でない・
    R 無しの `"local"`・**源が 1 つも無い `"complex"`**(第260便a —— A=[0,0] を「静止した場」として返さない)。
- **状態アダプタ(第260便a — 入場条件 (v))**: **`HP.dfmFieldSnapshot(S)`** →
  `{stop, bodies, options, n, fieldRole:"diagnostic-all-static", timeDerivativeComplete:false, note}`。
  **S の型付き配列から bodies 配列と options を 1 格子更新に 1 回だけ作る**(`S._core` の外・力へは接続しない)。
  `options` は `{lawVersion, G, eps:softening, p:frameWeightPow, D0(pull なら D0pull), background:"static",
  energyContract:"none"}`(`"local"` なら **R と Ṙ** —— 宣言 `inertiaSupportR` があればそれ、無ければ
  表示が選ぶ上位 2 体の分離の 3 倍とその時間微分)。
  - **`ax`/`ay` は捏造しない**ので `timeDerivativeComplete` は **false** である(その bodies を渡した
    `dfmField` も false を返す)。
  - **拒否は理由つき**(`bodies:null` + `stop` —— 黙って落とさない): `"complexNotVelocity"`(A は速度ではない)/
    `"bodyLayers"`(親子コアは根 1 粒子の点源とは別の場)/ `"massiveBox"`(箱は規定場で bodies に書けない)/
    `"nonPositiveMass"` / `"supportR"` / `"degenerate"` / `"n"` / `"lawVersion"`。
  - **蓄積格子の両分岐(銀河・連星)とトイ積分器の重力**が、これを通して**同じ `dfmField`** を読む。
  - **`p:frameWeightPow` の読み方(第261便で文書に固定 → **第262便d で番兵を廃した**)**:
    `frameWeight` **未宣言と `"pull"` は p=2**・`"pull3"` は 3・`"pull4"` は 4・
    **`"share"` と未知名は p=1**(核 w=m/(d²+ε²)^{1/2})を **`frameWeightPow` がそのまま返す**。
    **第261便までは `"share"` で 0 を返す番兵**で、読む側がすべて `(pw>0)? pw : 1` と読み替えていた ——
    **第262便d でその番兵を廃し、「pull 族かどうか」は `HP.frameWeightIsPull(physics)` だけが答える**
    (`pw>0` を真偽に使う経路は 0 になった)。**値は 1 bit も変わっていない**
    (全内蔵 121 本 × 600 步の状態が基点とビット同一 —— 番兵の整理であって規則の変更ではない)。
    したがって **API へ渡る p は 1・2・3・4 のいずれか**であり、**p=0(距離に依らない重み)は渡らない**。
    D₀ の読み先も宣言で変わる(share は `D0`・pull 系は `D0pull`)。
    **`dfmMeshScalarField` に直接 `power:0` を渡した場合だけ W=Σm(距離に依らない)になる** ——
    これはアプリのどの経路も使っていない値である。
    格子には注記 **`API diagnostic: <law> / all / static (not disk-affine)`** が付く(読めなければ
    `API diagnostic: unavailable (<理由>)`)。**「表示と力が同じ場になった」という意味ではない** ——
    銀河の既存表示(disk/affine の u_n)と**全源 scalar 場は別の場**であり、差は docs/PHYSICS.md
    〔第260便a〕④ の表に数で置いてある。QA `behavior.fieldApiIdentity`。
  - 読み口: `HP.spaceGridNow(S)` に **`fieldApi`/`apiNote`/`apiLaw`**、診断用に
    **`HP.spaceGridFieldProbe(S, pts)`**(同じ点で現行の表示場と API の場を両方読む —— 一致の主張ではない)。
- **複素決定力場(第259便a)**: **`HP.dfmComplexDeterminacy(sources, x, y, {p, eps, units:{M,L,T}})`** →
  `{Phi, gradPhi, A, gradA, dAdt, p, eps, sourceIds, dimless, cauchyRiemann, holomorphic:false}`。
  **Φ=Σmᵢ/(rᵢ²+ε²)^(1/2)**(スカラー)・**A=Σmᵢvᵢ/(rᵢ²+ε²)^(p/2)**(**重ね合わせ** —— 現行の正規化平均とは別物で
  分母が無い)。**m/r と m/r² は単位が違う**(Φ は M/L・A は M·L^{1−p}·T^{−1})ので、p を掃く比較は
  `units` を宣言した **`dimless`** 欄でしか意味を持たない(未宣言なら `dimless` は null)。
  `cauchyRiemann` は **検算だけ**の残差 2 本(r1=∂ₓu_x−∂ᵧu_y・r2=∂ₓu_y+∂ᵧu_x)で、**正則性は要求しない**
  (`holomorphic` は常に false)。`m≤0` は拒否(null)。**力へは 1 バイトも接続しない。**
- **geoPN=3(トイの測地線モード・第259便a)**: `CLAMPS.geoPN` の上限が 3 になったが、**3 は宣言だけでは通らない**。
  - **受理条件**: (a) `sampleClass:"calibration"` では**拒否**、(b) `physics.spaceMesh.lawVersion` の宣言が無ければ
    **従来どおり 2 へ丸めて警告**、(c) `kFrame>0` は拒否、(d) `spaceMesh.inertia`・`weave` との併用は拒否(**重複適用禁止**)。
  - **第263便a — 明示キー `physics.spaceMesh.toyAllowDrag`(true/false・既定 false)**: 受理条件 **(c) だけ**を開ける
    診断用の鍵である(第55報の仮説「コンパクト連星では geoPN=3 の適用となり引きずりが弱まって kFrame≈0.7」を**測る**ため)。
    - **(a) は開かない**: `sampleClass:"calibration"` では **geoPN の値に依らず**この鍵そのものを拒否する。
    - 受理すると**警告 1 行**が必ず出る —— **E6′ の追従キックとトイが同じ步で重なる**(`_core` から見た geoPN は 0 なので
      legacy E6′ が走る)。**二重計上の可能性がある診断構成**であって、法則の宣言ではない。
    - 実行時の読み口は **`S.geoToyOverlay==="drag"`**(重畳中)/ `null`(重畳なし)で、**ステップ会計(HUD)に `overlay:drag` が出る**。
      `S.geoToyDeny` は重畳中は `null` になる(= 入場した)。
    - **既定(未宣言)は 1 bit 不変**: 内蔵プリセットで宣言する本は 0 本・正準形(physics 署名)にも出ない。
      **`toyGain:0` との組み合わせは legacy E6′ だけの走行と状態ビット同一**であり、これが重畳の対照である。
    - **較正候補ではない**(Negative Claim 27/39 を維持する)。QA `behavior.geoToyOverlay` が門と対照と読み口を機械固定する。
  - **保存の非対称(第263便b — 契約は変えていない・読み口を足しただけ)**: **UI で 3 にした値は実行中は 3 のまま**
    走る(第262便a)が、**保存 JSON に `physics.spaceMesh.lawVersion` の宣言が無ければ、読み込み時に 2 へ丸められる**
    (上の受理条件 (b))。この非対称を、パラメータタブの geoPN 行の直下に**表示専用の 1 行**(`geoToySaveNote`・
    ja/en)として常設した。**プリセット署名(presetSig)にも `S.params` にも 1 bit も効かない**
    (QA `ui.geoToySaveNote` が「geoPN 行の直後にある・ja/en で別の文言・署名不変・『較正』を名乗らない」を機械固定する)。
  - **dispatch**: 受理された 3 は **`S._core` から見ると 0**(`geoCoreDispatch` が `_core` の呼び出しの間だけ
    `S.params.geoPN` を 0 にして戻す)。よって `geo`・`geo2`・特別化②(pairCorePN)のどれも立たず、**`S._g2` も確保されない**。
    **`S.params.geoPN` は `_core` の外では 3 のまま**なので、保存・エクスポート・UI は宣言値をそのまま読む。
  - **積分器** `HP.dfmGeoToyStep(S,dt)`(`S._core` の外・`_meshCoordForce` と同じ位置):
    **a = ∂ₜū + (∇ū)v − (∇ū)ᵀ(v−ū)**、ū=η·χ·u_mesh(η=`spaceMesh.toyGain`・0〜1・既定 1)。
    v=ū を入れると ∂ₜu+(u·∇)u を含む形になる(`x+=meshShift` の後処理は使わない)。
    **粒子とメッシュの運動量を同時更新する契約**で、ΔP・ΔL・離散仕事の厳密な負を同じ步にメッシュ帳簿
    (`S.geoToyMeshPx/Py/L`・`S.geoToyEmesh`)とリザーバへ記帳する。読み口は `S.geoToyStop`/`N`/`Chi`/`Dv`/`E`。
    **`lawVersion:"complex"` は接続しない**(`S.geoToyStop="complexNotVelocity"` —— A は速度ではない)。
  - **第264便b — 固定(pinned)源の ∂ₜu(不具合の修正・新しい鍵は 0 個)**: トイは ∂ₜu の中の Σw·a_i に
    **全粒子の重力加速度**を渡していたが、**pinned 粒子は規定運動**であって力を受けても速度が動かない。
    渡すべきなのは**規定運動の加速度**で、`dfmGeoToyStep` はこれを
    **静止/等速の pinned は 0**・**レール駆動(`railOmega`/`railH`)は P̈=(h²−ω²)(P−C)+2hω·(−(P−C)_y,(P−C)_x)**
    として作る(**重力 E4 は 1 バイトも変えていない**)。内蔵で geoPN≥3 を宣言する本(🩻)に pinned 粒子は
    **0 個**なので、この修正が内蔵に届く経路は無かった。**第265便b で pinned 中心核を持つ geoPN=3 の
    原理コピー 🪁 `galaxyMeshSpiralGeoToy` が内蔵へ入った**ので、QA `behavior.geoToyPinned` ④ は
    「pinned 数 0」ではなく**「geoPN≥3 の内蔵の顔ぶれと各本の pinned 数(🪁:1・🩻:0)+ pinned を持つ本で
    トイが実際に走ること」**を固定する形へ書き換えた。**基点 3042e17 の内蔵 122 本は 1 bit も動かない**。
  - **第264便b — 源の閉包 `physics.spaceMesh.toyClosure`("gravity" 既定 /"iterate")+`toyClosureIters`(1〜64・既定 8)**:
    `"gravity"` は上の a_i=g_i(**現状とビット同一**)。`"iterate"` は「源も同じトイ則で加速している」として
    **a_i = g_i + t_i(a)** の固定点を Jacobi 反復で解く**診断モード**である(**採用則ではない**)。
    - 二体・単一源支配では t₀=η·χ₀·a₁・t₁=η·χ₁·a₀ なので係数行列は [1,−ηχ₀;−ηχ₁,1]、
      **det=1−η²χ₀χ₁**(解の増幅)・**収縮率 ρ=√(η²χ₀χ₁)=ηχ**(反復の速さ)である。
      **η=χ=1 で det=0** —— 反復は止まらない(残差が下がらないことが結果である)。
    - 読み口は `S.geoToyClosure`/`S.geoToyIters`/`S.geoToyResid`(絶対)/`S.geoToyResidRel`(**源の重力加速度の
      最大値で割った相対**)/`S.geoToyConverged`。HUD(ステップ会計)に `closure:iterate it=… res=…`
      (未収束なら「**未収束**」)が出る。停止条件は相対残差 ≤ `GEO_TOY_CLOSURE_TOL`(10⁻¹²・**宣言値**)。
    - **既定は 1 bit 不変**(正準形に 1 文字も出ない)。宣言すると**警告 1 行**・`sampleClass:"calibration"` では**拒否**。
    - **質量のある箱(`universeBox`)の宇宙では閉包は効かない**(箱は規定場で、∂ₜu に源の加速度が入らない)——
      "gravity" と "iterate" がビット同一で、反復は 2 回目に残差 0 で止まる。
    - QA `behavior.geoToyClosure` が門・既定不変・反復数と残差・特異点・箱の不変を機械固定する。
    - **第265便b — 未収束ガード**: **打ち切った最後の 1 巡を力として当ててはならない**(反復上限の偶奇で
      符号も大きさも変わる)。`"iterate"` で対象が 1 つ以上あり、かつ収束していない步は、**メッシュキックを
      当てず・帳簿にも記帳せず** `S.geoToyStop="closureUnconverged"`・`S.geoToyN=0`・`S.geoToyDv=0` を返す。
      **残差・反復数・収束判定・χ は残る**(診断)。**重力側の步と時刻は進む**(**原子的停止ではない**)。
      QA `behavior.geoToyClosureGuard`。
  - **第265便b — 法則版 `physics.spaceMesh.law`("toy" 既定 /"mesh-v2")+ `meshGauge`("inertia" 既定 /"constraint")**:
    引きずりの「完全置換」の**候補**である(**確立した法則ではない**)。場を粒子から代数的に求め、
    u_i=Σ_j W_ij(q)v_j + u_bg(W_ij=η·w_ij/(D₀+Σ_k w_ik)・自己除外)から
    **L=½vᵀH(q)v−U(q)・H=(I−W)ᵀM(I−W)** を変分する: **H·a = F + ½(vᵀ∂_k H v)_k − (Σ_l v_l ∂_l H)v**
    (F は重力・∂_k H は**中心差分**〔`MESH_V2_FD_REL`=10⁻⁶×代表長・`opts.fdRel` で振れる〕)。
    - **`meshGauge`** は **D₀=0 かつ η=1 で共通並進が零固有値になる**(行和が厳密に 1)ことへの 2 案である:
      **"inertia"** = 失われた重心の慣性だけを戻す(K=δ·mmᵀ/M²・δ=M−1ᵀH1)/
      **"constraint"** = 零方向を射影して擬似逆で解く(ゲージ条件 Σ_i a_i = 0)。
      **両案で加速度が変わる**ので、`law:"mesh-v2"` のときは `meshGauge` を**既定でも正準形に出す**。
    - **門**: `physics.geoPN=3` 専用・`sampleClass:"calibration"` では**拒否**・`toyClosure` と排他・
      `toyAllowDrag` と排他・未知の値と未知のゲージは拒否。宣言すると**警告 1 行**。
      **既定 "toy" は正準形に 1 文字も出ない**(内蔵で `law` を宣言する本は 0 本)。
    - **対象は 2 体・回転源なし・正の慣性・衝突なしだけ**である。それ以外は力を当てずに停止理由を返す:
      `S.geoToyStop` = `"meshV2:notTwoBody"` / `"meshV2:pinned"` / `"meshV2:box"` /
      `"meshV2:illConditioned"`(cond > `MESH_V2_COND_MAX`=10¹²・**宣言値**)/ `"meshV2:notPositive"` /
      `"meshV2:rhsNotInRange"` / `"meshV2:nonfinite"` / `"meshV2:massNotPositive"`。
      毎步の診断は **`S.meshV2`**(`{gauge, eta, D0, p, chi, minEig, maxEig, cond, condRed, symRel,
      structural, delta, rowDev, fdStep, rhsNull, stop}`)で、HUD に `meshV2:<gauge> λmin=… cond=…` が出る。
    - **純関数** `HP.dfmMeshV2Solve(bodies, {G, eps, p, D0, eta, gauge, condMax, fdRel})` が正本である
      (`bodies=[{m,x,y,vx,vy}]`・**S を 1 バイトも読み書きしない**)。返り値は `H`/`Hg`/`eig`/`minEig`/
      `maxEig`/`cond`/`symRel`/`structural`/`rowSum`/`delta`/`rhs`/`accel`/`gravAccel`/`stop`。
      **停止したら `accel` は null** である。定数は `HP.MESH_V2_LAWS`/`MESH_V2_GAUGES`/`MESH_V2_COND_MAX`/
      `MESH_V2_NULL_TOL`/`MESH_V2_FD_REL`。
    - **η=0 は geoPN=0 の Newton と 600 步ビット同一**(両ゲージとも)。
    - **書かないこと**: 「引きずりを完全置換した」「mesh-v2 を銀河へ当てた」(3 体以上は止まる)。
      QA `behavior.meshV2`。
- **支配度の器(第263便a — `HP.dfmDominance(bodies, opts)`)**: 「支配天体が 1 つかどうか」を**測れる形**にした純関数。
  `bodies=[{m,x,y,vx,vy}]`・`opts={p, eps, D0}`(既定 p=2・eps=0・D₀=0)。**3 つの軸を別々に返す**(1 つの数に畳まない):
  **①`massRatio`=m₁/(m₁+m₂)**(質量上位 2 体)・**②`chiBias`=χ₂/(χ₁+χ₂)**(χ_i=Σ_{j≠i}w_j/(D₀+Σ_{j≠i}w_j)・
  w_j=m_j/(d_ij²+ε²)^{p/2} は**エンジンの pull 重みと同じ式**)・**③`uAlign`=(u₂·v₁)/|v₁|²**(u₂ は自己除外の正規化平均)。
  併せて `chiTop`/`chiSecond`/`massFracTotal`/`uMagRatio`/`chi[]` を返す。`dominance` は **① の別名**であって合成指標ではない。
  **二体では ③ は χ₂ と恒等に一致し、D₀=0 では厳密に 1 になる**(u₂=v₁ —— 〔第262便a ②〕)。
  **m≤0 の源と n<2 は null**(0 で埋めない)。**力へは 1 バイトも接続せず、この数で法則を分岐する経路は実装していない。**
- **kFrame の候補式の評価器(第264便a — `HP.dfmFrameKCandidates(inp)`)**: 第56報「`kFrame≈0.7` を他の観測値から
  **事前予測する計算式を確立する**」に対して、**候補式を同じ入力で並べて評価するだけの純関数**である。
  **予測式ではない**し、力へは 1 バイトも接続しない(kFrame をこの数で決める経路はどこにも無く、内蔵プリセットの
  kFrame は QA `preset.kframe-binary01` が要求する **0 か 1** のままである)。
  入力 `inp={ chiEff, etaSym | (m1,m2), alpha, delta, fIndependent, fIndSource, xi1, xi2, e, periodSec, qRatio }`。
  - **H1** `k=(f_ind−1)/χ_eff`: `fIndSource` に **f_ind の出どころの宣言を要求**する。宣言が無い、または
    台帳由来(`ledger`/`massCalibration`/`dfmBinaryInertiaFactorLinear`/`fLedger`)なら `h1.circular:true` で
    **`h1.value` を返さない**(null)。較正台帳の f は生成則 f=1+k_F·χ_eff そのものなので、入れれば
    **恒等式 k=k_F が返るだけ**であり、それを予測と呼ばないための門である。
  - **H2** `k=1−α·η_sym·χ_eff/(χ_eff+δ)`: η_sym=m₁m₂/M²。α・δ は**自由パラメータ**で、既定 α=1.2・δ=0 は
    **事前提案値**であって測って決めた値ではない。`m1,m2` を渡すと η_sym と q=m₂/m₁ を内部で作る。
  - **H3**: Ξ=Gm/(Rc²)・e・P・q・η_sym・χ_eff を**そのまま並べて返すだけ**の候補列である(係数も有意性も出さない)。
  `chiEff≤0`・`etaSym≤0`・`delta<0`・入力なしは **null**(0 で埋めない)。QA `behavior.kJointRoot` が代数と循環判定、
  内蔵の二値契約、診断コピーが `sampleClass:"principle"` であることを機械固定する。
  **第264便a の結論は「事前予測式は未確立」である**(4 系の k\* は 0.6555〜0.9370 に散る〔幅は平均の 37.0%〕のに、
  H2 の説明項の幅はその 1.25×10⁻³ 倍しかない —— docs/PHYSICS.md〔第264便a〕)。
- **共同補正プロトコルの記帳器(第265便a — `HP.dfmJointCalProtocol(inp)`)**: 第57報「『geoPN=2』と『kFrame=1』で
  成立しない場合は、観測質量に対する補正が必要な状況と判断し、**質量補正 f と kFrame を同時に補正する**」に対して、
  **手順の記帳だけを行う純関数**である。**力へは 1 バイトも接続しない**(kFrame や質量をこの返り値で決める経路は
  どこにも無く、内蔵プリセットの kFrame は QA `preset.kframe-binary01` が要求する **0 か 1** のままである)。
  入力 `inp={ residualP, sigmaP, residualW, sigmaW, omegaDotObs, nSigma, pTolSec, wTolRel, measurementResolved }`。
  - **`baseline.verdict`**(手順の第 2 段・**判定は σ で行う**): 2 量とも nσ(既定 3σ)以内なら
    `"correction-not-required"`・どちらかが外れたら `"correction-required"`・
    **σ が無い/量が測れていないなら `"undecidable"`**(0 で埋めない)。
  - **`rootCheck`**(手順の第 3 段): `{converged, status, residualP, residualW, observationalPass, isPrediction, tolerance}`。
    `status` は `"fit-search-tolerance-met"` / `"fit-search-unresolved"` / `"measurement-unresolved"` の 3 値。
    **`observationalPass` は常に null**(この関数は 3σ の合否を出さない)・**`isPrediction` は常に false**
    (**共同 fit は事前予測ではない** —— 裁定 Z15・docs/CALIBRATION_VERDICT_v1.44.md §6′.1)。
    **停止条件(`pTolSec`・`wTolRel`)は探索許容であって σ ではない。**
  - `nSigma≤0`・`pTolSec≤0`・`wTolRel≤0`・非有限は **null**。**空入力は null ではなく**
    `undecidable` / `measurement-unresolved`(「測れていない」という記録である)。
  - **生成 AI はこの関数を使わない**(プリセット JSON からは呼べない)。QA `behavior.jointCalProtocol` が
    代数・二値契約・`kFrame` の値域 [0,1]・基準走行の判定を機械固定する。
  **第265便a の結論は「4 系とも補正が要る」である**(f=1 でも現行台帳 f≈2 でも 3σ に入らない)。
  **`f≠1` から観測質量の誤りや未観測質量の存在が確定するわけではない**(初期条件・力則・数値誤差も同じ不一致に寄与しうる)。
- **除去の段階(第259便a — `physics.spaceMesh.inertiaRemoval`)**: `"post"`(既定 = 第258便a・`S._core` の後で引く)/
  `"inStep"`(**当てた段階で引く** —— `dragHookKick` は `_core` が速度へ書く直前、`dragHookApply` は ③/③′ が
  書く直前に呼ばれるので、そこで先に引く/取り分を 0 にする)。実測では **η=0(除去だけ)が kFrame=0(支えなし)と
  状態で厳密一致**する(post は O(dt) の分割誤差が残る)。**限界**: 残余トルク(スピンへ渡る分)は除去契約の外なので、
  ΔL の帳簿残差が 1 次で残る。
  - **第260便a(残余トルクの同段階除去)**: `dragHookApply` の同じ段階で**対象粒子の `accS` も 0 にし**、
    取り消したスピン角運動量 I·Δs と離散回転仕事を控えへ入れる(**`coupleSink` 宣言時は受け先が
    別経路なので触らない**)。あわせて**角運動量の帳簿を「引いた瞬間の腕」で測る**(步末の x[i] で
    作り直すと 1 次の残差が残る)。実測で **spin まで含めて kFrame=0 と厳密一致**し、
    (ΔL+リザーバ)/|L₀| は **2.06×10⁻⁶ → 2.1649×10⁻¹⁶**(支えなしの参照 2.1650×10⁻¹⁶)まで落ちた。
    **既定は `"post"` のままである**(昇格しない)。
- **`inertiaSupport` の値域が変わった(第259便a)**: `"none"`/`"support"`/`"expGate"` の 3 値。
  **旧 `"chiCut"` は受理して `"none"` へ正規化し警告を 1 行出す**(〔第258便a ③2〕—— この帯では一度も発動しない)。
  `inertiaChiCut` は受理・値域検査だけ残し、**正準形には出さない**(読む経路が無い)。
- **純関数 6 本(第259便b — 親子コア・3D スピン参照場・歳差/緩和。**力へ接続しているのは重力の球殻差分だけ**)**:
  - **`HP.dfmLayerGravity(layers, d, {G,eps})`** → `{mTot,mEnc,mOut,rOut,aPoint,aLayered,da}`。球殻定理
    **a_layered = G·M_enc(d)·d/(d²+ε²)^{3/2}**(M_enc=Σ_{r_k ≤ d} m_k)。**内側は厳密 0・d ≥ r_最外 は点源と一致**。
    層が昇順でない/質量が非正/非有限は門(null)。`body.layers` を宣言した宇宙では本体もこの差分を当てる
    (`S._core` の**外**の 1 パス。実装差の床は `S.ax` が Float32 であることから来る相対 10⁻⁸ 級)。
  - **`HP.dfmLayerKernel(layer, d, {p,eps,shape,nodes})`** → `{point,value,ratio,method,…}`。慣性核
    **w=m(r²+ε²)^(−p/2)** の有限半径積分(`shape`="point"/"shell"/"uniform")。薄殻は μ 積分の解析形。
    **重力の球殻積分とは別物**で、**力へは 1 バイトも接続していない**(測るだけ)。
    **第260便b: 可積分な内部で解析極限を返す**(`method:"analytic"`・一様球・ε=0):
    d=0 は 3m/((3−p)R^p)、p=1 は d≥R ? m/d : m(3R²−d²)/(2R³)、
    p=2 は d=R ? 3m/(2R²) : (3m/(2R³))·(R+(R²−d²)/(2d)·ln((R+d)/|R−d|))。
    **p=3 の対数発散は null のまま**(有限に丸めない)。薄殻の ε=0・d=R も **q=1−p/2>0(p<2)なら有限**
    ((A+B)^q/(2Bq))で、p≥2 は null。`method` は "point"/"closed"(薄殻)/"analytic"/"uniform"(Simpson)。
  - **`HP.dfmLayerMerge(layersA, layersB, "role"|"add")`** → 合成後の層配列。既定は `HP.LAYER_MERGE_RULE`="role"
    (同 role を m の和・**r=√(r_i²+r_j²)** で合算 —— 殻とコア v2 の既存則と同型)。
    **"add" は質量を守るが構造を守らない**(同じ半径を積み直すと畳み込みが発火し、8 回で 4 層へ縮退する ——
    〔第260便b §4〕。**既定の "role" は 2 層を保つ**)。
    **第261便b: 「同じ半径」の判定を相対にした** —— |r_i−r_j| ≤ `HP.LAYER_MERGE_RTOL`(=10⁻⁹)×max(r_i,r_j)
    なら 1 層に畳み、**半径はずらさない**(第260便b の (1+10⁻¹²) のずらしを廃止)。
    これで "add" の層数が **8 回とも 4 層**で安定する(基点は 4→6→4→6→6→8→4 と非単調だった)。
    宣言 `J` も層と一緒に和で運ぶ。**既定の "role" の結果は変わらない。**
  - **`HP.dfmLayerPairForce(layersA, layersB, d, {G,eps})`**(第260便b)→
    `{U,F,Upoint,Fpoint,dU,dF,mA,mB,nPair,rOutA,rOutB,overlap}`。**薄殻 × 薄殻の対ポテンシャルの解析積分**で、
    `F` は距離 d が増える向きの**符号つき半径方向成分**(負 = 引力)。`r:0` の層は点として畳む。
    **ε=0・R₁=R₂=R では 0<d<2R で F=−Gm₁m₂/(4R²)(距離に依らない)**・d≥2R で点源と値も傾きも連続・
    **d ≥ r_out,A + r_out,B では ΔF=0(遠方は点源)**。d≤0・非有限・非正質量は門(null)。
    **`body.layers` を宣言した拡張体どうしが重なる組では、本体もこの ΔF を対ごとに 1 回だけ当てる**
    (第259便b の「点源取消+層重力」は**相手が点である**ことを前提にしていたので、両方が拡張体だと
    取消が 2 度入って引力が斥力に化けた —— 〔第260便b §1〕)。読み口は
    **`S.layerN`**(層差分を当てた作用対象)/ **`S.layerPairN`**(ΔF を当てた拡張体の対)/
    **`S.layerStopN`**(ΔF が定義されず停止した対)/ **`S.layerStop`**(`null` か `"overlap"`)で、
    HUD のステップ診断にも `layer:<stop|on> N=… pair=…/…` として出る。
    **`S.layerStop="overlap"` の間、その対には層差分が当たらない**(点源の単極子だけで進む)。
    **第261便b で 3 つ変わった。**
    ① **近接域の桁落ちを式で直した**(実装は 3 分岐・返り値に `dFmethod`/`dFerr` が増えた)。
       第260便b の実装は d が小さいほど d·I′ と I が消し合うので、R₁=R₂=10・m=1・G=1・ε=0.5 で
       d=10⁻⁶ に **+2.43×10⁻⁴(斥力)**、ε=0・同半径の厳密値 −0.0025 に対して d=10⁻⁸ に **−0.83** を返していた。
       いまは **ε=0 は閉じた形**(d ≥ R₁+R₂ で点源・d ≤ |R₁−R₂| で 0・その間は F=K((R₁−R₂)²−d²)/d²)、
       **ε>0 は Φ(w,d)=(ε²/2)(X−asinh X)** の閉じた形(N=Φ(R₁+R₂,d)−Φ(R₂−R₁,d))、
       **遠方は単極子+多重極 3 項**(Δ^k g の閉形式)を、**推定誤差の小さいほうで**使い分ける。
       `dFmethod` は `"eps0-far"`/`"eps0-inside"`/`"eps0-overlap"`/`"stable"`/`"multipole"`/
       `"shell-point"`/`"point"`/`"concentric"`、`dFerr` は **ΔF の相対誤差の見積り**である。
       **交替点の ΔF は 10⁻⁶ 級が精度の上限**であり、そこから先を「厳密」とは書かない。
    ② **重ならない対も ΔF を受ける**。**ε>0 では軟化核が調和でないので d ≥ r_out,A+r_out,B でも ΔF≠0**
       (大きさは ε²R²/d⁵ 級)。カットを外し、**ΔF が厳密に 0 の対だけキックしない**
       (ε=0 の遠方はこれに当たるので、従来どおり 1 命令も走らない)。
    ③ **d=0 は門ではなくなった**(`d ≥ 0` を受ける)。**同心の薄殻は対称性で互いに純力を及ぼさない**ので
       F=0・ΔF=0 を返し、U は −2K(h(R₁+R₂)−h(R₂−R₁)) の極限値を返す。これにより
       `layerStop="overlap"` が立つ状況は**正しい宣言からは生じない**。
       **`S.layerStopMode`**(既定 `"define"`/opt-in `"halt"`)が停止の作法を選ぶ。`"halt"` では
       step の**前**に全対象対を検査し、ΔF が有限でない対があれば **時刻を進めずに** `S.layerHalt`
       (`{i,j,d,reason:"layerPairUndefined"}`)と `S.layerStop="halt"` を立てて戻る。
       **既定は `"define"`**(層の配列を実行時に壊さないかぎり検査は素通りする)。
  - **`body.layers[].J`(省略可・第261便b)**: 層のスピン角運動量の **z 成分**。表示・保存・編集・
    融合の合算の対象で、未宣言の層は **正準形に 1 文字も出ない**(既定経路の署名は不変)。値域は ±10¹²。
    **第264便c から、この J は「回転場の源」として読まれる**(下の `spinDipoleMoment` の所有者規約)。
    重力・引きずり・歳差・熱へは依然として 1 バイトも接続していない。
  - **明示ゼロ `J:0` は「未宣言」ではない(第265便c)**: 値と宣言は別に持つ。
    `layers:[{role:"core",m:10,r:1,J:0}]` と**明示的に 0 を書いた層は「Q=0 を宣言した層」**であり、
    回転場の源は **0**(従来殻式 ½mR²s へは戻らない)。何も書かない層だけが「未宣言」で従来式へ落ちる。
    **`Jx:0`・`Jy:0` も同じ契約**である(面内だけの明示ゼロでも「宣言あり」と読む)。
    宣言は **build / 編集(`applyLayerEdit`)/ 保存・復元(チェックポイント)/ 複製(A/B)/ 融合 /
    粒子詰め替え**の 6 経路すべてを往復する。読み口は
    **`HP.dfmLayerJDeclared(i,k,S?)`** → 宣言ビット(1=J・2=Jx・4=Jy・0=未宣言)。
    **正準形には「宣言された 0」だけが出る**ので、宣言していない宇宙の署名は 1 bit も動かない。
  - **`body.layers[].inertiaScale`(ζ・省略可・第265便c)**: 層の**有効慣性倍率**。既定 1・値域 [10⁻³,10⁶]
    (コア V2 の `core.inertiaScale` と同じ値域)。**I = ζ·½·m_k·r_k² と回転場の源 J_k/ζ_k の双方に効く**
    —— コア V2 の第 2 項が `J_c/ζ` である以上、層に J の値を足すだけでは V2 と一致しない。
    ζ=1 は正準形に出ない(署名不変)。宣言されて正の有限数でなければ
    **`layerInertiaScaleNotPositive`** で拒否し、1 bit も書かない(0 に読み替えない)。
    読み口は **`HP.dfmLayerInertiaScale(i,k,S?)`**。
    **融合では「源 Σ J/ζ を保つ」合成則**を使う(ζ′=(J_a+J_b)/(J_a/ζ_a+J_b/ζ_b)。等しい ζ どうしは
    その ζ が残る。J の和か源の和が 0 で定義できないときだけ ζ′=1 へ落ちる ——
    **融合は宣言の合成であって保存則ではない**)。
  - **`body.layers[].Jx` / `body.layers[].Jy`(省略可・第264便c)**: 層の角運動量の**面内成分**。
    **数値として持つ(宣言・表示・保存・復元・融合の合算・正準形)だけ**で、**力へは 1 バイトも
    接続していない**。0 は正準形に出ない(既定経路の署名は不変)。値域は ±10¹²。
    **「層 J をベクトル化した」とは書かない** —— 数値として保持し、回転場は z 射影で読む、の 2 点である。
  - **回転場の源の所有者規約(第264便c — `spinDipoleMoment` / `HP.dfmLayerDipoleMoment(i,S)`)**:
    スピン双極子モーメント Q_i(`physics.spinSpin` の源・対ポテンシャル `U_SS` の源)は
    **コア V2 があれば V2・無ければ層**から取る(**二重計上を構造的に防ぐ**)。
    - コア V2 を持つ粒子: 従来式 **Q = ½·M_shell·R²·spin + J_c/ζ**(differential/active のみ第 2 項)。
      **M_shell は既定で body 質量 m**(第77便以来)で、`core.shellSpinMass:"shell"` を宣言した粒子だけ
      **殻質量 M_s = m − M_c** になる(第265便c・下の項)。
    - コア V2 を持たない層つき粒子: **Q = Σ_k J_k/ζ_k**(層の宣言 J の z 成分を層の ζ で割った和 ——
      第265便c から ζ が効く。ζ=1 の層では `J/1===J` なので基点とビット同一)。
    - **層が J・Jx・Jy を 1 つも宣言していなければ「未宣言」**として従来式へ落ちる
      (🧅 layeredCoreDFM はこれに当たるので 1 bit も変わらない)。**明示ゼロは宣言である**(第265便c)。
    - **射影はコア V2 と同じ z 成分だけ**。層の Jx/Jy を動かしても Q は動かない。
    - `HP.dfmLayerDipoleMoment(i,S)` は層側の値(宣言が無ければ `null`)をそのまま返す読み口。
    **等価性(第265便c の実測)**: ζ は層へ運ばれるようになったので **ζ≠1 だけの差は 0**
    (基点の +J_z(1−1/ζ) は消えた)。残るのは**殻項の質量差 −½·M_c·R²·spin** だけで、
    これも `core.shellSpinMass:"shell"` を宣言すれば 0 になる(600 步ビット同一を実測)。
    **それでも「層が V2 を置き換えた」とは書かない** —— 一致するのは**回転場の源**だけで、
    K_cs・熱・能動系(pump/contract/burst/shed)・整列トルク・歳差は層に無い。
  - **`body.core.shellSpinMass`(省略可・第265便c)**: `"total"`(既定)/`"shell"` の 2 値。
    コア V2 の Q の**第 1 項をどの質量で組むか**を宣言する。`"total"` は ½·m·R²·spin(第77便以来の式 ——
    **既定を変えていない**ので内蔵 122 本の Q は 1 つも動いていない)、`"shell"` は ½·M_s·R²·spin で、
    層へ移した殻層の J と**同じ式**になる。`"total"` を明示宣言しても正準形に鍵は作らない
    (未宣言と 1 bit 同一)。cavity では無効。読み口は **`HP.dfmShellSpinMassOf(i,S?)`**・
    受理値の集合は **`HP.SHELL_SPIN_MASS_MODES`**。**この宣言は Q の定義を変えるので、
    較正済みの本へ後から足してはならない**(足すと Q が変わる —— 変化率は〔第265便c〕の表)。
  - **`S.applyLayerEdit(i, k, cfg)`(第261便b — 同心層を実行時に編集する唯一の入口)**:
    `cfg={role?,m?,r?,J?}` で層 k を編集(k = 現在の層数なら**追加**)、`cfg=null` で層 k を削除
    (`k<0` なら層宣言ごと外す)。**正準形(r 昇順・非重複・1〜8 層・m>0・role は 5 種)を検証し、
    通らなければ 1 bit も書かずに `{ok:false, reason}` を返す**(理由は `radiusNotAscending` /
    `layerNotPositive` / `tooManyLayers` / `unknownRole` / `noSuchLayer` / `badIndex`)。
    **Σm 契約**: 層があるあいだ **根の m は派生量**(= Σ層 m)で、層を編集すると根の m が追随する
    (宣言側の検証器 `vLayers` は逆向きに「Σ層 m ≠ body.m なら layers を落とす」—— どちらも
    「Σ層 m = 根の m」を保つ点で同じ不変量)。`S.bodyLayersOf(i)` が正準形の層配列を返すので、
    **編集 → 保存 → 読込がビット同一**になる(QA `behavior.bodyLayers` ⑯)。
  - **`HP.coreV2ToLayers(core, body)`(第261便b — コア V2 → 同心層の変換器)**:
    `core={mode,massFrac,radius,J?}`・`body={m,R,spin?}` から
    `{ok:true, layers:[{role:"core",m:Mc,r:Rc,J},{role:"shell",m:m−Mc,r:R,J}], mode,Mc,Ms,Rc,R,sumM}` を返す。
    **Σ層 m = |body.m| なので遠方の重力は厳密に 0 差**で、**近傍(コア半径の内側)だけが変わる**。
    拒否は `{ok:false, reason}`(`cavityHasNoMass` —— cavity の massFrac は質量ではない /
    `coreOutsideShell` —— Rc ≥ R / `massFracOutOfRange` / `unknownCoreMode` / …)。
    `massFrac=1`(裸コア終端)は **1 層**になる(観測半径は層に載らず `observedRadius` に残る)。
    **第262便b から本関数は `HP.coreV2MigrationPlan` の薄い包み**である(返り値の鍵は従来どおり・
    `plan` に計画全体が入る)。
  - **`HP.coreV2MigrationPlan(body)`(第262便b — 移行計画)**: `body={m, radius|R, spin?, core:{…}}` から
    **根 = コア・層1 = 外殻**の層配列に加えて、**慣性と角運動量の分解**を返す純関数(`S` も内蔵プリセットも
    1 バイトも書かない)。ζ=`inertiaScale`・θ=`tilt`(度)として
    **I_c=½·M_c·Rc²·ζ / J_z=I_c·ω·cos θ / J_x=I_c·ω·sin θ / E_rot=|J|²/(2I_c) / E_z=J_z²/(2I_c)**。
    入口は 2 形受ける: **JSON 形**(`core.omega`/`core.tilt`/`core.inertiaScale`)と
    **実行状態形**(`core.Jz`=`S.coreJ`・`core.Jmag`=`S.coreJm` —— 主変数をそのまま使い、
    ω=|J|/I_c・θ=acos(J_z/|J|) を読み戻す)。
    返り値: `{ok, layers, mode, Mc, Ms, Rc, R, sumM, inertiaScale, Ic, omega, tiltDeg, Jz, Jx, Jmag,
    Jshell, Erot, ErotZ, observedRadius?, source, canReplaceV2:false, warnings[]}`。
    **層に載るのは J_z だけ**なので θ≠0 では E_z<E_rot になり、警告 `tiltNotCarried` が付く
    (🪩 bhCoreTilt は θ=90° で E_z/E_rot=3.75×10⁻³³)。`Kcs`/`pump`/`contract`/`mode:"active"` は
    `KcsNotCarried`/`coreDynamicsNotCarried` を立てるだけで**層は再現しない**。
    **`source` に元の core JSON をそのまま持ち、`canReplaceV2:false`**(コア V2 は消さない)。
    拒否の理由に **`bodyMassNegative`**(第262便b で塞いだ穴 —— 旧実装は |m| を使っていたので
    負質量の粒子を変換すると Σ層 m>0 になり重力の符号が黙って反転した)と
    `bodyMassNotDeclared`/`bodyRadiusNotDeclared`(build が導く量なので宣言の段では移行できない)を追加。
  - **`HP.coreV2MigrateReport(preset)`(第262便b — 移行レポート)**: プリセット 1 本の**可否の表だけ**を返す
    (**変換しない・1 バイトも書かない**)。`{id, nBodies, nCore, counts:{convertible,naked,cavity,
    needsResolve,rejected}, byReason, rows:[{index,mode,cls,reason,nLayers}], canReplaceV2:false}`。
    内蔵 121 本の実測(第262便b): コア宣言 **75 件**(33 本)= 移行可 61・裸コア 0・cavity 0・
    m/R 未宣言 13・拒否 1(🦀 crabRemnant の `coreOutsideShell`)。build 後の 305 粒子では 304/1。
  - **`coreV2MigrationPlan` の入力拒否(第264便c — 「0 に読み替えない」)**: 宣言された値が
    **Infinity・NaN・null** なら、**黙って 0 に読み替えずに拒否する**。
    `coreOmegaNotFinite`(`core.omega`)/ `coreTiltNotFinite`(`core.tilt`)/
    `coreJNotFinite`(`core.Jz`・`core.J`・`core.Jmag`)/ `bodySpinNotFinite`(`body.spin`)/
    `inertiaScaleNotPositive`(`core.inertiaScale` が正の有限数でない —— **`null` は `Number(null)=0` で
    「有限」と読まれ ζ=0 → I_c=0 の計画が返っていた**)。**未宣言(`undefined`)だけが 0 である。**
    さらに、**入力が有限でも積が溢れる**場合を拒否する: `valuesNotFinite`(M_c・M_s・I_c・J_z・J_x・
    |J|・J_shell のいずれかが非有限)/ `rotationEnergyNotFinite`(E_rot・E_z が非有限)。
  - **`coreOutsideShell` は `massFrac=1`(裸コア)にも適用される(第264便c — 契約を緩めない)**:
    基点は `Rc ≥ R かつ massFrac<1` だけを拒否していたので、`massFrac=1` にすれば
    **Rc ≥ R(等号を含む)が通り**、層の r が観測半径を越える宣言を作れた。第264便c から
    **massFrac に依らず `Rc ≥ R` は移行不可**である(内蔵の集計は不変 —— 裸コアは 0 件)。
  - **`HP.coreV2ReplaceReport(preset)` / `HP.coreV2ReplaceAxes(body)`(第264便c — 置換可否レポート)**:
    第56報「**親子コアが、コア V2 を完全に置き換え可能な状態かを確認する**」に対する**測り口**。
    **変換も書き込みもしない純関数**で、コア V2 を宣言した body ごとに**置換の条件を 6 項**に割る:
    `rotationSource`(回転場の源が層だけで厳密に再現できるか —— 理由 `shellSpinTermDiffers` /
    `inertiaScaleNotUnity`)・`tilt`(面内成分は**数値としては**層に載る。**整列トルク**
    `core.Kalign>0` は載らない —— `tiltDynamicsNotCarried`)・`KcsThermal`(`KcsNotCarried`)・
    `activePumpContract`(`active`/`pump`/`contract`/`burst`/`shed`/`rTarget`/`sourceRate`/
    `internalEnergy` —— `coreDynamicsNotCarried`)・`saveRestore`(層の値が編集経路の値域に入るか ——
    `layerValueOutOfEditRange`)・`migration`(`coreV2MigrationPlan` が ok か)。
    返り値: `{id, nBodies, nCore, counts:{canReplace,cannot}, byAxis, byReason,
    rows:[{index,mode,canReplaceV2,axes,why,deltaQ}]}`。
    **内蔵 124 本の実測(第265便b で 🪁・第265便d で 🐮 lfbotTrap が加わり、第265便c で ζ を層へ運んだ後)**:
    コア宣言 **76 件**(🐮 の 1 件増)= 置換可 **31**・不可 **45**
    (項別の不可: rotationSource 44・KcsThermal 17・activePumpContract 17・tilt 15・
    saveRestore 15・migration 15)。第264便c の 27/48 から動いたのは **`inertiaScaleNotUnity` の 5 件が
    消えた**ぶん(−4)と、🐮 の `body.radius` 非宣言による `migrationRejected`(+1)だけで、
    **既存の内蔵プリセットの JSON は 1 バイトも変わっていない**。
    残る `rotationSource` 44 は `shellSpinTermDiffers` 29 + `migrationRejected` 15 で、
    前者は `core.shellSpinMass:"shell"` を宣言すれば 0 になる(複製の上で強制した実測 —— 置換可 57・
    不可 18 は第265便c 時点の 122 本に対する値。**既定の変更ではない**)。`rotationSource` の理由は**差の出どころ**で割り当てる
    (殻項の差があれば `shellSpinTermDiffers`・無くて ζ≠1 なら `inertiaScaleNotUnity`)。
    **`canReplaceV2` が全項 true の本があっても「コア V2 を廃止できる」とは書かない** ——
    この表が測るのは 6 項だけで、描画・保存 JSON・AI 生成・既存セーブの互換はこの表の外である。
  - **`core.lightTrap`(第265便d・opt-in・既定 off — **SYSTEM_PROMPT には載せていない**)**:
    減光 `lightSweep` が外へ出さなかった自光を蓄積し、コアの崩壊で放つ**トイ仮説**の宣言である
    (第57報「『Luminous Fast Blue Optical Transient』について、『減光』で青方偏移した光が蓄積し、
    天体の崩壊で一気に放出した、という仮説を立てる」)。受理形は
    `{enable:true, tEsc>0, tEscCollapse?, shiftRate?, supply?, absRate?, collapseR?, refill?}` で、
    `enable!==true` か `tEsc` が無ければ**警告つきで lightTrap だけを落とす**(`core.shed` と同じ流儀)。
    `cavity` では無効。状態は粒子ごとに E_γ・N_γ・E_s・E_esc・Q・E_in の 6 列で、恒等式は
    **E_s + E_γ + E_esc + Q − E_in = E_s(0)**(`E_in` = 減光で**熱から引き取った**自光。
    **落として書くと二重計上になる**)。供給源 E_s は `core.internalEnergy` から build 時に
    **切り出す**ので、宣言でエネルギーは増えない。読みは純関数 **`HP.dfmLightTrapLedger(S)`**
    (宣言しない宇宙では **null**)。`HP.dfmToyLedger` には `Elight`(=E_s+E_γ)と `Elesc`(=E_esc)が
    **宣言した宇宙でだけ**足される(`radE` には積まない)。**`S._core` には 1 命令も足していない**
    (実体は `S.step` 末尾の 1 パス)。**内蔵で宣言しているのは 🐮 `lfbotTrap` の 1 本だけ**である。
    **実行時 LLM 向けの SYSTEM_PROMPT には載せていない** —— 既定 off の opt-in であり、
    生成物に出す前に段を分ける(次便の判断)。
  - **`notClaim:"lfbot"`(第265便d)**: 表示文 `nc_lfbot`(ja/en)は「実在の高速青色トランジェント
    (LFBOT・AT2018cow 等)の説明・再現・予測ではない」である。**実イベントへ σ を出さない**。
  - **`S._setBodyLayers(i, arr)` の有限性(第262便b)**: `m`・`r`・`J`・Σm を `Number.isFinite` と
    **`Math.fround` 後**(Σm は Float32 の `S.m` に入る)で検査し、通らなければ
    `layerNotFinite`/`sumNotFinite` で拒否する。**検査は書き込みの前**なので、拒否時は元の状態が
    1 bit も動かない(旧実装は Infinity を受理して根の m を Infinity にしていた)。
  - **負質量の粒子は層に写せない(規約 —— 第263便b で恒久規約に上げた)**: `coreV2MigrationPlan` は
    `m<0` を **`bodyMassNegative`** で拒否する(第262便b の実装)。理由は層の側の契約である ——
    `applyLayerEdit` は `layerNotPositive`/`sumNotPositive` で正の m しか受けず、
    **Σ層 m = 根の m**(Σm 契約)は符号ごと成り立たなければならない(旧実装は |m| を使ったので
    負質量の粒子を移行すると Σ層 m>0 になり、**重力の符号が黙って反転**した)。
    **負 m の粒子そのものは従来どおり受理する** —— 変わったのは「層へ写せない」ことだけである
    (`m<0` は JSON でも `#beM` 欄でも書ける)。将来これを緩めるなら**明示キーの opt-in**
    (例 `body.layersAllowNegativeMass:true`)を立てて、Σm 契約と重力符号の扱いを宣言の側に
    引き受けさせる形にする —— **本便では実装していない**(そのキーは未定義で、書いても検証器は無視する)。
  - **`coreOutsideShell` は「観測半径 = コア半径」の別名である(規約 —— 第263便b で明文化)**:
    `Rc ≥ R` のときの拒否理由コードで、**等号(Rc=R)を含む**。「コアが殻の外に出ている」場合だけを
    指す名前ではない。層の正準形は r 昇順・非重複なので、Rc=R では 2 層に分けられない
    (1 層に潰すと外殻の m が 0 になり、観測半径 R が層に載らない)。内蔵でこれに当たるのは
    **🦀 crabRemnant(Rc=R=0.01)の 1 本だけ**である(第262便b の移行レポートの「拒否 1」)。
    **第264便c から `massFrac=1`(裸コア)も例外にしない**(上の「契約を緩めない」)。
  - **`HP.dfmBinaryChi` の第 6 引数 0 は非推奨である(第263便b)**: 0(旧 share の番兵)は
    **1 と同じ核**(w=1/√(a²+ε²))で計算し、**返り値は 1 bit も変わらない**
    (QA `behavior.framePull` が p=0 と p=1 の `Object.is` を見る)。第263便b からは、0 が来たときに
    **セッションに 1 度だけ `console.warn` を 1 行**出す(値も経路も変えない・`console.error` ではない)。
    新しい呼び出しは **share なら 1・pull なら 2/3/4** を渡す。
  - **`body.core`(コア V2)は廃止予定である。新しい宇宙では `body.layers`(親子コア)が正である。**
    **ただしコア V2 を消してはいない** —— 内蔵プリセットの `core:{…}`(**121 本のうち 33 本・75 の body 宣言**)は
    1 文字も変わっておらず、検証器も従来どおり受理する。移行は**編集パネルの明示操作と上の純関数でだけ**起きる。
- **接触ばね `physics.contactK`/`physics.contactCap` の値域**(第260便b): **[0,2000] / [0,400]**
  (第259便b までは [0.1,2000] / [0.01,400])。**既定 40/8 は不変で正準形にも出ない**・既存の 0.1/0.01 セーブも受理・
  負値は 0 へ丸めて警告を出す。**0 にすると E9 の法線ばねが完全に消える**ので、
  「包含質量 0 → 重力 0」を床なしで確認できる(〔第260便b §5〕)。**較正 37 本には 0 を書かない。**
  - **`HP.dfmSpinField3D(omegaVec, r, {a?,R,q})`** → `[ux,uy,uz]`。**u=a(d)(ω×r)**・a(d)=(R/(R+d))^q。
    **q は角速度の減衰指数で速度は r^(1−q)**(速度 r^−2 なら q=3)。**並進の p と同一パラメータにしない。**
    面外流 RMS は環上で **sinθ/√2**(θ=30/60/90 で 0.354/0.612/0.707)で、θ=90° では面内(2D 射影)が
    厳密に 0 でも面外流は最大になる。**幾何試験であって潮汐ロックの創発ではない。**
  - **`HP.dfmSpinPrecess({Js,Jc,k,dt|angle,Is,Ic,axis?})`** / **`HP.dfmTiltWork({Js,Jc,Is,Ic,alpha,axis?})`**。
    前者は τ_c=k(J_s×J_c) の**厳密回転**。**第260便b で軸を J_total にした**(`axis`: `"total"`=既定 /
    `"shell"`=旧の固定 J_s 軸を opt-in で保存)。J_s×J_c=J_total×J_c なので閉じた対の厳密解は
    「**一定の J_total 軸のまわりに J_c を角 k|J_total|dt 回し J_s=J_total−J_c とする**」で、
    **|J_c|・|J_s|・回転 E・総 J がすべて厳密に保たれる**(返り値に `axis`/`absJs0`/`absJs1` を追加)。
    旧の固定 J_s 軸は |J_s| が動くので **E が増える**(Jc=(1,0,2)・Js=(0,0,4)・Ic=2・Is=8・k=0.2・T=1 で
    ΔE 3.79×10⁻² / 分割 1・4.00×10⁻⁵ / 分割 1000。新軸は同条件で ≤3.2×10⁻¹⁴)。
    `angle` を明示したときも軸はこの選択に従う。後者は J_c を倒して
    総 J を保つときに**殻の側に現れる仕事**(J_s∥J_c なら ΔE=(1−cosα)(|J_s||J_c|+|J_c|²)/I_s・本便で未変更)。
  - **`HP.dfmSpinRelax({Ic,Is,Kcs,dt,omegaC,omegaS})`** → `{mu,f,dJ,omegaC,omegaS,E0,E1,dE,Qexact,Qold,ratio,gamma,…}`。
    本体(第78便)と同じ指数解 ΔJ=μΔω·f・f=1−e^{−K_cs·dt}。**正確な散逸は Q_exact=μΔω²(f−f²/2)** で、
    本体の既定記帳 Q_old=|ΔJΔω|/2 は**その 1/(2−f) 倍**(K_cs·dt→0 で **1/2**)。**既定の記帳は変えていない** ——
    読み口 `S.QcsOld`/`S.QcsExact`/`S.QcsN` は**診断列**で、`S.radE` は 1 bit も動かない。
- **純関数 2 本(第257便a・力へは接続しない物差し)**:
  - **`HP.affineComovingStep({C,V,H,Omega,dt}, [x,y])`** → `{x,v,u,C,F,a,theta,fixedPoint,gradU,dUdt}`。
    x(t+h)=C+V·h+a·R(θ)(x−C)(a=e^{Hh}・θ=Ωh・**C も V·h 動く**)。**群**なので 100 分割と一括が
    丸めまで一致する。**エンジンの箱は中心 c を動かさず一様 V を足す別の流れ**で、その厳密解は
    `{C:fixedPoint, V:[0,0]}` の形で書ける(`fixedPoint = C − (H·I+Ω·J)⁻¹V`)。
  - **`HP.relativeOrbitReference({chi,s,omega,r?,GM?})`** → `{f,kappa2,kappa,dvarpi,dvarpiDeg,Omegam,
    relOmega,GMreq,M0,ratio,stable}`。参照モデル **f=(1−χ)²+sχ(1−χ)**・
    **κ²=(ω−Ω_m)²+s(s−1)(ω−Ω_m)Ω_m**・**Δϖ=2π(ω/κ−1)**(Ω_m=χω)。χ∈[0,1] の外・非有限は門(null)。
    **κ²≤0(不安定)では Δϖ は null。** **この式で観測に合わせたとは書かない。**
- **有限の回転子交換(第255便a — `physics.spaceMesh.reservoir`)**: `{"Imesh":正の数値, "gamma":0 以上の数値}`。
  メッシュに**有限の慣性 I_m と独立な角運動量 J** を与え、軌道 L と γ で交換する opt-in(既定なし)。
  純関数は **`HP.dfmMeshRotorExchange({L,J,Iorb,Imesh,gamma,dt})`** で、
  ω=L/I_o・Ω_m=J/I_m・L̇=−γ(ω−Ω_m)・J̇=+γ(ω−Ω_m)・Q̇=γ(ω−Ω_m)²≥0 を**指数の厳密解**で 1 步進める。
  **L+J 保存・L²/2I_o+J²/2I_m+Q 保存・Q≥0・同期で停止・逆回転で L が軌道へ戻る**(QA `behavior.meshRotorExchange`)。
  源接続は相対ベクトル r への**等大反対の接線インパルス**で、`S.meshJ`/`S.meshQ`/`S.meshRotorL`/`S.meshRotorE` に記帳する。
  **Q は「熱」であって重力波放出ではない**(外向き流束・伝播・波形の写像が無い)。**D₀ を慣性密度と同一視しない。**
  **〔第256便a 追補〕** **`dt<0` は `null`(前進専用)**である —— h<0 では Q<0 を返してしまうため、
  黙って負の熱を作らずに門で止める(`dt=0` は dL=0・dQ=0 で通る)。
  設計量からの**宣言の読み替え**は純関数 **`HP.dfmMeshRotorDesign({beta,tauSync,mu,rRef|Iref,omegaRatio,omegaOrb})`**
  → `{Imesh,gamma,Iref,Ired,beta,tauSync,J0,OmegaMesh,reservoir}`。β=I_m/I_ref(I_ref=μ·r_ref²)・
  γ=I_red,ref/τ_sync(I_red,ref=I_ref·β/(1+β))・J₀=(Ω_m/Ω_orb)·Ω_orb·I_m。
  `{Imesh,gamma,Iref}` を渡すと**逆向き**(β・τ_sync)を返し、**往復は恒等**である。
  **I_m は固定**(可変慣性は別の帳簿を定義してからでないと足さない —— 第256便a では実装していない)。
  既存の `{Imesh,gamma}` 直接宣言は 1 bit も変わっていない。
  **生成 AI はこのキーを使わない。**
- **空間メッシュの純関数 API(第254便a)**: `HP.dfmMeshScalarField(bodies,x,y,{G,eps,power,exclude})` が
  **1/r の `Dgrav`** と **1/r^p の `Wpull`** を**別名で**返し(`gradD`・`gradW`・`gravity`・`potential` つき)、
  `HP.dfmMeshBlend(node,background,W,gradW,D0,Wdot)` が χ 混合を **∇χ・∂ₜχ 込み**で返し、
  `HP.dfmMeshParticleRHS(field,v,law)` が慣性 2 候補の加速度を返す(u=0 でニュートンにビット一致)。
  物質線の輸送は `HP.dfmMeshTransportCreate/Step/Bind/Observe`(RK4・上限 4096 点・det F>10⁻¹² の門・**原子的停止**)。
  **〔第255便a 追補〕** `Bind` は `{entrainment:"vertex"(既定)|"blended"}` を受ける(`blended` は区間 χ を
  u と ∇u に掛ける —— D₀=10⁶ でマーカー移動が 7.8×10⁻⁸ まで落ちて**輸送が止まる**)。
  作業配列は**二重バッファで再利用**するので、**返る `tr.x`/`tr.F` は借用ビュー**である
  (步をまたいで保持するなら複製すること。原子的停止は保持 —— 失敗した步では入れ替えない)。
  描画側は **`tr.error` の輸送を作り直さない**(停止は停止のまま)。
  力(本節)と波(第253便c の `HP.dfmMeshWaveRHS`)は**同じ `{u,gradU,dUdt}` を読む**。
- **オーバーレイ `overlays.spaceMesh`(第254便a → 第255便c → 第256便c で 1 形化 → 第257便c で `"mesh"` 追加)**: 正準形は
  **`{"mode":"mesh"|"lines"|"guide"|"transport"|"tracer"}` だけ**(未宣言は鍵なし)。**5 つは排他**で、同時には描かれない。
  - `"mesh"`(**既定**・第257便c — 重心原点の**蓄積格子**。**全粒子の質量重心 C** を原点にした正方格子を、
    C 中心の標本格子〔17×17〕へ**一度だけ**評価して凍結した速度場が作る**一意の写像 Φ** で写し、
    各辺の **Φ(次)−Φ(前)** を**中心に近い交点から順に累積**して描く。Φ は dX/ds=g·[u(X)−u(C)]
    (0≤s≤τ_ref)を RK4 で解いたもので、**τ_ref は系のサイズ / 内部速度から一度決まり gain では再正規化しない**。
    Φ が一意なので**共有する交点は同じ値**になる〔閉路残差は丸めだけ = 相対 10⁻¹⁷ 級〕。
    **セルの符号付き面積が負になったら折返しとして破線+凡例に替える**〔空間の反転ではなく表示の限界〕。
    場は、連星が u=χ(x)[V+B(x−C_mesh)]+(1−χ(x))u_bg(x)〔**χ は交点ごと**〕、銀河〔`overlays.galaxyField` を
    宣言したサンプル〕が `dfmGalaxyMeshField` で、**unValid=false の点は描かない**〔連星場へ落とさない〕。
    **凍結場の診断図であって、過去から運ばれてきた物質のメッシュではない**)
  - `"lines"`(空間線 = 凍結した時刻の場を表示用パラメータ τ で追う線。dx/dτ=u+c_line ê・
    dê/dτ=(I−êêᵀ)Bê を中点法で積分。**光子でも物質線でもなく、c_line は描画規約であって光速ではない**。
    **線の長さは系の長さで決まる**〔連星は 2 頂点の分離の 0.75 倍・銀河は中心から外縁〔半径の 95 パーセンタイル〕
    までの 2.40 倍〕ので**ズームしても世界座標では伸び縮みしない**。色は琥珀 rgba(232,168,72,·))
  - `"guide"`(参照ガイド = 瞬時の F 写像を **χ の不透明度**で描く)/ `"transport"`(輸送された物質線)
  - `"tracer"`(銀河の物質線。**表示していない間は 1 步も運ばれず**、再表示では現在時刻で張り直す)
  **凡例(第258便c)**: 蓄積格子は左上に最大 3 行の凡例を出す —— 折返しが出ているときの
  「折返し(表示の限界)— 赤いセル=折返し」(**符号付き面積 ≤0 のセルだけ赤で縁取り**+格子全体を破線)・
  `τ_ref` と `v_ref` と自動/固定・**場が上位 2 体からの近似であるとき**の
  「場は上位 2 体(系全体のメッシュではない)」(`overlays.galaxyField` の宣言が無い 3 体以上の系)。
  **表示専用の `gain`**(第257便c): 実行時の `overlays.spaceMesh.gain`(0〜2・既定 1.0・刻み 0.05)が
  蓄積格子の写像の度合 g である。**`validatePreset` は `{mode}` しか出さない**ので、**プリセット署名・
  エクスポート JSON・`S.params` には 1 文字も入らない**(UI のスライダーと**直値入力**〔第258便c で
  「空間メッシュ」トグルと同じ 1 行になった〕・localStorage `hp_sm_gain` に残るセッション設定で、
  A/B の両側で同じ値を使う)。**生成 AI はこの鍵を書かない**。
  **表示専用の `tau`**(第258便c): 実行時の `overlays.spaceMesh.tau`(**正の有限数**・**欠落=自動**・
  上限 `SPACE_MESH_TAU_MAX`=1e6)が蓄積格子の**表示の時間幅**である。自動は τ_ref=R/v_ref を系ごとに
  決め直すので、**形が同じで強さだけ違う 2 つの系が同じ絵になる**(剛体回転 Ω=0.1 と Ω=0.2 で格子が
  bit 同一)。固定するとその τ をそのまま使うので強度の差が絵に出る(τ=1 では R=10 で最大 1.41・
  R=100 で 14.1 ずれる)。凡例に `τ_ref` / `v_ref` / 自動か固定かを出す。`gain` と同じく
  **`validatePreset` は `{mode}` しか出さない**ので署名・エクスポート JSON・`S.params` には入らない
  (localStorage `hp_sm_tau`・A/B 共通)。**非有限・非正の宣言は自動へ落とす**(黙って使わない)。
  純関数 `HP.dfmSpaceGridBuild(spec)` の側は**もっと厳しく、宣言された `tau`・`steps` が読めなければ
  `null` を返す**(第258便c: 場が `[NaN,0]` を返す・場が作業配列を書き忘れて true を返す場合も同じ)。
  **生成 AI はこの鍵を書かない**。
  **旧形は入力としてだけ読む**(移行表・**捨てるものは無い**。旧セーブに `"mesh"` は 1 件も無い):
  `spaceMesh:true` → `{mode:"lines"}` /
  `spaceMesh:true` + `spaceMeshMode:"guide"|"transport"|"lines"`(第254便a・第255便c の鍵)→ `{mode:…}` /
  `spaceMeshMode` 単独 → `{mode:…}` / `spaceMesh:false` → 鍵なし。**`spaceMeshMode` は正規化後の
  overlays には出ない**(値域が 1 形になったため — 第256便c は**署名便**で、🫂🪟🎠 の 3 本の宣言表記が変わった)。
  **座標の線形混合は撤回した**(det[(1−χ)I+χR_θ] が χ=½・θ=π で 0 = 格子が潰れる)。
  **表示のみ**で力学・帳簿へは 1 バイトも触らない。
- **近点近傍の刻み細分(第252便b — `physics.periSubsteps`)**: `{"n":細分数, "rMul":近点近傍の倍率, "pair":[i,j](任意), "rPeri":近点半径の宣言値(任意)}` を宣言すると、**2 体の相対距離が r < rMul·r_peri の間だけ** 1 步 dt を n 等分して n 回進める(`S.step` を呼ぶ側の薄い包み — `S._core` には 1 命令も足していない)。**これは物理ではなく数値設定**である(role=numerics)。
  ステップ末の**離散イベント(エコー・融合・分裂・放出)は最後のサブステップの後に 1 度だけ**発火する(dt 比例の外部オーバーレイ `petersGW` は各サブステップに掛かる)。
  `pair` 省略時は |m| 最大の 2 粒子。**`rPeri` の明示宣言が正式形**である(第253便b L5(c) — 走行のどこから測っても同じ門になるので再現性がある)。`rPeri` 省略時(auto)は**走行中の相対距離の最小値**を基準にする **診断用の形**で、最初の近点通過までは内向きの区間を丸ごと細分するため門の広さが走行に依存する —— 数値を報告する走行では auto を使わない。**ケプラー接触要素 a(1−e) は較正質量の系では使ってはいけない**: 実際の近点と大きく食い違う(第252便b の実測 — ⚡ psrDoubleABDFM は較正質量 f≈2 のニュートン接触要素が a(1−e)=**282** を返すが、kFrame=1 の実際の軌道は **r∈[800, 956]** で 3 倍近く外れる)。auto がケプラー接触要素ではなく走行中の最小相対距離を採るのはこのためである。
  **`n` を省略・1 以下にすると未宣言へ正規化**され、プリセット署名・エクスポート JSON が 1 文字も変わらない(未宣言は `S.hasPeriSub=false` で素通り = 既定経路 1 bit 不変)。値域は n:1〜256・rMul:1〜10⁴。
  ゲートを全域に開けた `{"n":4}` の dt は、**dt/4 の一様細分とビット一致する**(QA `behavior.periSubsteps`)。**生成 AI はこのキーを使わない** — 既定 dt の残差が離散化か処方かを切り分けるための数値実験用である(docs/PHYSICS.md 第252便b の節)。
- **放射オーバーレイの用量と方向(第247便b — `physics.petersScale` / `physics.petersDirection`)**: `petersGW` を宣言した二体でだけ効く外部物理の付帯キー。`petersScale` は放射束の倍率(0〜100・既定 1・0 で完全に素通り・1 は署名に入れない)、`petersDirection:"tangential"` は放射キックを相対接線速度 v_t=(r×v)/|r| だけに与える(半径方向の落下速度は変えない。未宣言=従来方向)。値域は入力契約であって物理法則ではなく、**用量は合わせ込みのノブ**である。**生成 AI はこのキーを使わない** — コンパクト天体連星の較正 variant(docs/PHYSICS.md 第247便b の節)専用である。
- **引きずり場の倍精度化(第247便a — `physics.framePrecision`)**: `"double"` を宣言すると引きずり場の実行状態配列
  (uPx/uPy/uAx/uAy/sumW/sumWu/dpx/dpy/pairD)だけが Float64 になる(`stateCarry:"double"` が倍精度にするのは x/y/v/a だけ)。
  省略・`"single"` は Float32 のままで**プリセット署名も挙動も 1 bit 不変**。**生成 AI はこのキーを使わない** — E6′ の差分経路の
  数値床を切り分けるための実験機能である(docs/PHYSICS.md 第247便a の節)。
- **MM 2 腕干渉計の位相玩具(第247便d・裁定 A5′(2))**: 内蔵の原理サンプル **🪞 `mmPhaseToy`** が 1 本増えた。位相は新しい物理キーではなく**読み取り専用の純関数** `HP.dfmMMPhase(cfg)`(装置の往復到着時刻 → 到着時間差 Δt と干渉位相差 Δφ=2πcΔt/λ を**別々に**返す)と `HP.dfmFrameAt(x,y)`(光が感じる決定フレーム u と局所光速の 1 点評価)が出すもので、**プリセットの物理キーは 1 つも増えていない**(装置は既存の `pinned`+`railOmega` のレール規定運動と `frameSource:false` だけで作ってある)。**生成 AI はこの 2 関数を使わない**(プリセット JSON からは呼べない — docs/PHYSICS.md 第247便d の節)。**第250便b(第42報 W2)で 3 本目 `HP.dfmMMWavelength(cfg)` が増えた**(MM の**波長チャネル** — 戻り波長・共通出力方向の波長・検出器の読み ν_D・ドップラー係数 D を Δt/Δφ とは別欄で返す読み取り専用の純関数。回転境界は扱わず null を返す)。**これも生成 AI は使わない**(物理キーは 1 つも増えていない — docs/PHYSICS.md 第250便b の節)。**第251便c(第43報)で 4 本目 `HP.dfmMMPhaseCount(cfg)` が増えた**(MM の**位相計数チャネル** — 3 規約 `stretch`/`galilean`/`comoving` の N・T・直交腕・ΔN・ΔT を同じ表で返す読み取り専用の純関数。β≥1・非有限・未知 rule は null)。**第252便c(第44報)でさらに 2 本増えた**: `HP.dfmMMCoherent(cfg)`(**連続波チャネル** — 固定波長の位相 Δφ=−2πν₀Δτ+ψ と、線形チャープ ν(t)=ν₀+ν̇t で動く縞の計数 ΔN=−Δν·Δτ を**別欄**で返す。`{c, lambda0|nu0, tau1,tau2|L1,L2, psi|nullPhase, nudot, t, dTau}` を取り、非有限・c≤0・λ₀≤0・負の τ は null)と `HP.dfmMMLambdaSweep(cfg)`(**波長掃引チャネル** — 3 規約の固定 λ₀ の ΔN・掃引の ΔN_sweep=−Δν·ΔT・受動鏡境界 ρ=(ω−V·k)/2πν₀ の検算を返す。`{L, lambda0, beta, c, nudot, t|dNu, rules, uFrac}`。β≥1・非有限・未知/空 rules・非有限 uFrac は null)。**これら 3 本も生成 AI は使わない**(プリセット JSON からは呼べない・物理キーは 1 つも増えていない — docs/PHYSICS.md 第251便c・第252便c の節)。**第253便c(第45報)で返値に明示名が増え、6 本目 `HP.dfmMeshWaveRHS(mesh, ray, c, gradC)` が増えた**。明示名(**旧返値は値そのまま保持**)は `dfmMMCoherent` の **`detectorFringeShift`**(検出器の縞移動 δN_detector=δΔφ/2π=−ν₀·δ(Δτ) —— **固定波長でも遅延差が変われば動く**。旧 `fringesRot`)・**`sweepFringeShift`**(掃引寄与 N_sweep=−Δν·Δτ —— **Δν=0 で消えるのはこれだけ**。旧 `dN`)・**`sweepFringeShiftChange`**(旧 `dNRot`)と、`dfmMMLambdaSweep` の **`pathCountNull`**(旧 `fixedNull` = **光路の波数計数**の null)・**`detectorNull`**(**常に null** —— この計算から検出器の null は判定していない)。`HP.dfmMeshWaveRHS` は**メッシュ上の波動法則候補**の右辺を 1 点で返す純関数で、ω=u_mesh·k+c|k| の Hamilton 方程式 ẋ=u_mesh+c·k̂ / k̇=−(∇u_mesh)ᵀk−|k|∇c を計算する(mesh は `{origin:[x,y], velocity:[ux,uy], gradU:[B00,B01,B10,B11]}`・ray は `{x,y,kx,ky}`・返値 `{dx,dy,dkx,dky,omega,u,kmag}`・**非有限・c≤0・|k|=0・長さ不足の gradU は null**)。**幾何から一意には出ない候補の 1 本**であって、エンジン・photon・traceRay へは接続しない。**これも生成 AI は使わない**(docs/PHYSICS.md 第253便c の節)。
- **空間メッシュの診断器(第253便a・第45報)**: **粒子を頂点とする動くメッシュ**の幾何原型を、**読み取り専用の純関数 3 本**として足した。**新しい物理キーは 1 つも増えていない**(力・光・背景・帳簿へは接続していない)。
  - `HP.dfmSpaceMeshCapture(S, ids)` — 参照配置を捕捉して anchor を返す(`ids` は 1〜3 個の粒子番号)。**reset/融合/分裂/並べ替えで粒子数や状態配列が変わったら、以後 `dfmSpaceMeshState` が `null` を返して止まる**(黙って固定枠へ戻さない)。重複 id・範囲外 id・4 個以上・m≤0・非有限は `null`。
  - `HP.dfmSpaceMeshState(anchor, S, opts)` — メッシュの状態を返す。`opts` は `{angle, angle0, omega}`(n=1 の姿勢 — **殻の積分角を外から渡す**。ω×経過時間で代用しない)と `{D0}`(省略時は `S.params` から pull 重みの D₀ᵖ を読む。`Infinity` は「背景が全て」の極として受理)。返値は `{kind:"rigid"|"similarity"|"affine", origin:[x,y], velocity:[ux,uy], refOrigin, F:[4], inverse:[4], gradU:[4], metric:[4], detF, divU, chi, mode:"T1"|"T2"|"blend"|"background", unique, equalMassDegree, mid, nHat, r, rLen, W, D0}`。**契約は u(x)=velocity+B·(x−origin)**(B=`gradU`)で、外部実装はこの 3 フィールドだけを読めばよい。退化(r=0・det≤0・反転・共線・非有限・負 D₀)は `null`。
  - `HP.dfmSpaceMeshAt(mesh, x, y, S?)` — 1 点の `{ux, uy, qx, qy}`(q はメッシュ座標)。`S` を渡すと **χ 混合** u=χ·u_mesh+(1−χ)·`dfmFrameAt` を返し、**χ=0 では `dfmFrameAt` とビット一致する**(現行への回帰)。
  - 付随して**表示専用の overlay 鍵 `overlays.spaceMesh`(既定 false)**が 1 つ増えた。宣言したプリセットだけ鍵が付くので、未宣言のプリセットは overlays オブジェクト・署名・エクスポート JSON が 1 bit 不変である。**表示のみで力学には一切影響しない**。
  - **生成 AI はこの 3 関数を使わない**(プリセット JSON からは呼べない)。`overlays.spaceMesh` も SYSTEM_PROMPT の overlay 一覧には入れていない — 診断器の可視化であり、生成対象ではない(docs/PHYSICS.md 第253便a の節)。QA `behavior.spaceMesh` が 9 項目の契約を機械固定する。
- **銀河の空間メッシュ(第254便b・第46報)**: 銀河は**差動回転する**ので 1 つの大域相似メッシュには乗らない。そこで**局所の場**と**物質線**を、やはり**読み取り専用の純関数**として足した。**新しい物理キーは 1 つも増えていない**(力・光・背景・帳簿へは接続していない —— 第253便a ⑦「銀河はメッシュ接続の後」を守る)。
  - `HP.dfmGalaxyMeshField(S_or_bodies, x, y, opts)` — 1 点の局所場。`opts` は `{D0, eps, p, cellSize, bg:"frame"|"static", bgGrad:"fd"|"zero", h}`。**W は加算形** W(x)=Σ mᵢ(|x−xᵢ|²+ε²)^(−p/2)(同じ位置の質量 4 を 1+3 に分けても**ビット不変**)・**χ=W/(W+D₀)**・**u=χ·u_n+(1−χ)·u_bg**(u_n は**エンジンの粒子速度を pull 重みで局所平均**したもの —— **観測回転曲線も解析形 Ω_n も入力にしない**)。返値は `{u:[ux,uy], gradU:[B₀₀,B₀₁,B₁₀,B₁₁], dUdt:[2], W, D0, chi, gradW, gradChi, un, ubg, gradUn, gradUbg, mode, cell, sources}`。**∇u は (u_n−u_bg)⊗∇χ の項を含む**。`cellSize>0` は固定格子セルへのビニング(評価点をセル中心へ量子化 = セル内一定)。非有限・負/NaN の D₀・p≤0・負 ε・負 cellSize・源なし・未知 bg は `null`。
  - `HP.dfmGalaxyTracerCreate(S, spec)` / `dfmGalaxyTracerStep(tr, dt, S)` / `dfmGalaxyTracerObserve(tr, opts)` — **物質線**(放射状の線)の RK4 輸送。節点ごとに位置と変形勾配 F(dF/dt=(∇u)F)を運ぶ。`spec` は `{lines, perLine, rMin, rMax, cx, cy, field}`(`field` は上の `opts` か `(x,y,S)=>{u,gradU}` の**指定場**)。**原子的停止**: どれか 1 節点でも非有限になったら**1 節点も書き戻さず** `stopped` を立てる(部分的に進んだ状態を残さない)。**座標の線形混合はしない**(χ=½ の混合座標は半回転で潰れる)。
  - `HP.dfmGalaxyMeshRecord(S, opts)` — r ビンごとに **v_φ・u_mesh,φ・v_φ−u_mesh,φ・v_obs・Ω_pattern−Ω_mesh** の 5 量(第253便a ⑦ の宣言)を返す。**`v_obs` は常に `null`** である —— このアプリには粒子と独立な**光学回転曲線の層が無い**(`overlays.rotationCurve` は粒子速度そのものなので観測層ではない)。`Ω_pattern` は `opts.prev` に前時刻の記録を渡した**2 時刻差分**でだけ有限になる。
  - 表示は既存の overlay 鍵の**物質線モード** `overlays.spaceMesh:{mode:"tracer"}` で、宣言したプリセットだけに `{mode:"tracer"}` の正準形が付く(未宣言は 1 bit 不変)。**A/B 分割ビューでも描く**(第253便a ⑧ の限界 (a) は銀河側だけ解消した —— 頂点メッシュの格子は従来どおり単一ビューのみ)。
  - **生成 AI はこの 5 関数を使わない**(プリセット JSON からは呼べない)。`overlays.spaceMesh` は SYSTEM_PROMPT の overlay 一覧に入れていない。QA `behavior.galaxyMesh` が 8 項目の契約を機械固定する(docs/PHYSICS.md 第254便b の節)。
- **銀河の空間メッシュ — u_n の 2 案と要求別の場(第255便b・第47報)**: `dfmGalaxyMeshField` の `opts` に **3 つの診断用 opt** が増えた。**既定値は第254便b と同じ経路で、全内蔵 120 本 × 600 步がビット同一**である(プリセットの physics/overlays は 1 文字も動いていない — **新しい物理キーは 0 個**)。
  - `unSource:"all"`(既定=現行)/ `"disk"` — `"disk"` は **pinned な天体と最大質量の 1 体を u_n の重み平均の標本から外す**。**W(したがって χ)には残す**(質量を消すのではなく「速度の標本」から外すだけ)。返値に `unSources`(fit に使った体数)・`unExcluded`(外した体数)が付く。
  - `unFit:"mean"`(既定=現行)/ `"affine"` — `"affine"` は**局所アフィン最小二乗**(重み w=mᵢ(d²+ε²)^(−p/2)・基底 [1,(xᵢ−x)/h,(yᵢ−y)/h] の 3×3)。**零次の重み平均は定数速度しか再現できない**が、剛体回転は位置の 1 次なので fit なら静止中心も正しい標本になる(機構試験: 中心 m=2500 を入れたまま (−0.4,1.0) を 12 桁再現 — docs/PHYSICS.md 第255便b ②)。`∇u_n` は**重みの空間微分込み**の完全な導関数で、fit の 1 次係数そのものは `unLinear` に別欄で返す。**ランク不足(det/(M₀₀M₁₁M₂₂)≤10⁻¹⁰)は `null`** を返して止まる(正則化もクリップもしない)。**affine では `dUdt:null`・`timeDerivativeComplete:false`**(fit の時間微分は未導出 — **欠落を 0 で埋めない**)。
  - `need:"u"|"uB"|"uBt"`(既定 `"uBt"`=現行) — **要求しない量は計算せず `null`** を返す(`"u"` では `gradU`・`dUdt`・`gradW`・`gradChi` が null、`"uB"` では `dUdt`・`dWdt` が null)。**u と ∇u の値は need を変えてもビット同一**である。実測: 381 体 1 点評価が uBt 34.4 μs → u 16.2 μs(2.1 倍)。`fitH` はアフィン基底の数値スケール h(既定 = ε または 1)で、**平滑化長 ε とは別物**(u_n・∇u_n は h に依らない)。
  - **空間線(W3)が銀河で読む契約は 1 つに固定する**: `HP.dfmGalaxyMeshField(S, x, y, {need:"uB", unSource, unFit})` の返値のうち **`{u:[ux,uy], gradU:[B₀₀,B₀₁,B₁₀,B₁₁]}` だけ**を読む(`dUdt` は読まない — `need:"uB"` では null である)。`dfmGalaxyTracerCreate` は `field` に `need` が無ければ **`"uB"` を補う**(物質線の状態はビット同一)。`dfmGalaxyMeshRecord` は `field` に `need` が無ければ **`"u"` を補う**(返値はビット同一・192 点で 6.7 ms → 3.2 ms)。
  - `dfmGalaxyTracerStep` は**指定場のコールバックに RK4 の段階時刻を渡す**(`field(x,y,S,stageTime)`・t₀ / t₀+h/2 / t₀+h/2 / t₀+h)。**エンジン場の源配列は段階補間していない**(粒子は步末の 1 配置しか持たない — 未解決)。
  - `HP.dfmMeshHaloReference({alpha, alphaPrime?, Phi?, dPhi?, r, h?})` — **有効慣性 α(r) の帳簿の読み**(純関数・力へは接続しない)。`v_c² = r·Φ′/(α + r·α′/2)`(α≡1 でニュートン)を r ごとに返す(`{r, alpha, alphaPrime, dPhi, denom, vc2, vc, stable, slope, vcSqrtR}`)。**α+rα′/2≤0 なら `vc:null`・`stable:false`**(クリップしない)。α が無い・Φ も Φ′ も無い・r≤0/NaN・α≤0・h≤0 は `null`。**ハロー質量の較正でも平坦回転曲線の予測でもない** — α=1−χ の例(α=r²/(r²+9))では **外側で α→1 となりケプラー型へ戻る**(r=100 で d ln v_c/d ln r=−0.5)。QA `behavior.meshHaloReference`。
  - **生成 AI はこれらを使わない**(プリセット JSON からは呼べない)。QA `behavior.galaxyMesh` が 12 項目へ増えた(docs/PHYSICS.md 第255便b の節)。
- **銀河の場の宣言 `overlays.galaxyField` と有効範囲(第256便b・第48報)**: 第255便b が opt として置いた u_n の 2 案を、**プリセットの表示宣言**として持てるようにした。**`overlays.spaceMesh`/`spaceMeshMode` とは別鍵**で、そちらの値域には 1 文字も触っていない。**力へは接続しない**(表示と記録の層のまま)。
  - `overlays.galaxyField:{unSource:"all"|"disk", unFit:"mean"|"affine"}` — **宣言したときだけ**正準形 `{unSource,unFit}`(この鍵順)が付く。省略した欄は既定(`"all"`/`"mean"`)で埋める。未知の値・オブジェクト以外は**落とす**(警告)。**未宣言のプリセットは overlays・presetSig・エクスポート JSON が 1 bit 不変**。
  - 宣言があると `dfmGalaxyMeshField(S,…)` の **`unSource`/`unFit` の既定がその宣言になる**(tracer・空間線・記録器はこの経路で読む)。**呼び出し側が `opts` で明示した値は常に優先**する。第255便b の 4 組合せの対照は器と QA にそのまま残っている。
  - **🎠 galaxyMeshSpiral の既定が `{unSource:"disk", unFit:"affine"}` になった(署名便)**。挙動を決める鍵はこの 1 つだけで(カード文言も新しい既定に合わせて書き直した — 表示テキスト)、**他 119 本の JSON は 1 文字も動かない**・**全 120 本の 600 步の状態はビット同一**(メッシュは力へ接続していないため)。
  - **有効範囲の欄**(返値に追加・**値は 1 bit も変えない**): `nEff=(Σw)²/Σw²`(u_n を実際に決めている標本の有効数)・`wSum=Σw`・`supportR`(標本雲の質量重心 c からの最大半径)・`supportC=[cx,cy]`・`supportN`・`rSupport=|x−c|`・`unValid`。**`unValid=false` は「支持の外で外挿している」印**であって、`null` にはしない(χ 混合はそのまま続く)。判定は `wSum>wMin` かつ `rSupport ≤ 1.05×supportR`(`HP.GALMESH_SUPPORT_PAD`)。`wMin` は opt(既定 0 = 幾何条件だけが効く)、負・NaN は `null`。
  - `HP.dfmArmBudget({r, vc, sigma, width, m?, pitch?, f?})` — **腕を保つのに要る力の見積り**(純関数・**粒子の力には未接続**)。`|∇ψ|²=(m/r)²+(m·cot i/r)²`(`pitch` は**度**・90° = 棒で cot=0 が厳密)から `epsilon = σ⊥²/(w² v_c² f |∇ψ|²)`・`QT = m·ε·f`・`aWidth=σ⊥²/w`・`aAxis=ε v_c²|∇ψ|`・`forceRatio=ε|∇ψ|r` を返す。r≤0・v_c≤0・w≤0・m≤0・pitch∉(0,90]・f≤0・NaN は `null`。**「腕が自律生成する」主張ではない。**
  - `HP.dfmArmPotential(x, y, t, {epsilon, vc, Rb, Rout?, omega?, m?, pitch?})` — 外部指定の**回転ポテンシャル**(解析勾配つき純関数)。`Φ = ε v_c² A(r) cos ψ`・`A(r)=r²/(r²+R_b²)·exp(−(r/R_out)²)`・`ψ = m[θ−Ω_p t−ln(r/R_b)·cot i]`。返値 `{Phi, ax, ay, dPhidt, torque, r, psi, A}`。**ax/ay は解析式**(中心差分と 10⁻⁸ で一致)、**恒等式 ∂ₜΦ = Ω_p·τ**(τ = x a_y − y a_x = −∂Φ/∂θ)が丸めで成り立つ。**r=0 で力 0**(窓 A∝r²)・**ε=0 で Φ も力も 0**。QA `behavior.armBudget`。
  - **生成 AI はこの 2 本も使わない**(プリセット JSON からは呼べない)。`overlays.galaxyField` も SYSTEM_PROMPT の overlay 一覧には入れていない(診断器の宣言であり生成対象ではない)。QA `behavior.galaxyMesh` は 14 項目・`behavior.armBudget` が新設(docs/PHYSICS.md 第256便b の節)。
- **s の宣言と R_slip・磁石連鎖のトイ・BH 以降のトイ帳簿(第257便b・第49報)**: いずれも**表示と記録の層**であり、
  **粒子の力へは 1 バイトも接続していない**。**新しい physics キーは 0 個**(`physics` は 1 文字も動いていない)。
  - `overlays.galaxyField` に**第 3 の鍵 `slipThreshold`**(= s = w*/V の**宣言値**・既定 `HP.GALMESH_SLIP_DEFAULT`=0.9)。
    **宣言したときだけ**正準形が `{unSource,unFit,slipThreshold}` の 3 鍵になる(**未宣言は 2 鍵のまま = 🎠 の署名も
    エクスポート JSON も 1 bit 不変**)。値域は 0 ≤ s < 1(外は落として警告)。**表示と記録のみ**で、
    `u`・`χ`・`∇u` は 1 bit も動かない。
  - `HP.dfmSlipRadius({A, D0, p, s})` — **引きずり限界半径の式**(純関数)。`R = [(A/D₀)·s/(1−s)]^(1/p)` と
    `{R, A, D0, p, s, chiFar}` を返す。**s≥1・s<0・A≤0・D₀≤0・p≤0・NaN は `null`**(D₀=0 は「どこまでも引きずる」なので
    Infinity ではなく `null`)。**閾値 s に依存する設計式であって、束縛円盤の外縁の証明ではない。**
  - `dfmGalaxyMeshField` の返値に **`sUsed`・`slipA`・`R_slip`・`chiSlip`** の 4 欄が増えた(**値は 1 bit も変えない**)。
    `slipA` は加算形 W の遠方振幅 = **源として数えた質量の総和 Σmᵢ**(第256便b で A/M=0.99998 と実測した量の厳密形)。
    `s` は opts の `slipThreshold` → プリセット宣言 → 既定 0.9 の順で決まる。
  - `HP.dfmChainMeshBuild(S_or_bodies, opts)` / `Step(chain, dt, opts)` / `Static(chain, b?)` / `Field(chain, x, y, opts?)` /
    `Energy(chain)` — **磁石連鎖の有限応答連鎖メッシュ**(**新しいトイ仮説**であって、現行 D₀ の単位・意味から
    自動導出されるものではない)。粒子を**半径リング 1〜8 層**(`HP.CHAIN_RINGS_MAX`)に縮約し、節点ごとに
    変位 ξ と速度 U を持たせる。`opts` は `{rings, kNeighbors, mu, tau, zeta, tauDrag, Kbg, gammaBg,
    bond:"linear"|"central", kScale, gammaScale, D0, p, eps, center, capacity, edges}`。
    宣言量は 3 つだけである(**μ・K・γ を全部 fit にしない**): **慣性比** `mu`(μ_b=mu·M_b)・**応答時間** `tau`
    (K_ij=μ_red/τ²・γ_ij=2ζμ_red/τ)・**支持長は既存の幾何核をそのまま使う**(駆動係数 a_b=χ_b·μ_b/τ_drag、
    χ_b は `dfmGalaxyMeshField` と同じ加算形 W から作る = 新しい長さスケールを 1 つも足していない)。
    `kNeighbors:0` は**鎖を切った対照**(「磁石だけ」)。`bond:"linear"` は ChatGPT §10 の式そのもの
    (**回転不変ではないので L が保存しない** —— 隠さずに測る)、`bond:"central"` は中心力で P も L も保存する。
    `Step` は RK4(**dt<0 は `null`** —— 前進専用)で、返値は `{Em, Ekin, Epot, Q, Qdrive, Wext, P, L, dQ, dW,
    residual, driveOn, capLeft, capState}`。**ΔE_m+ΔQ−ΔW_ext=0 が閉じた帳簿の意味**で、`Q̇≥0` は各段の被積分量が
    非負・RK4 の重みが正であることから 1 步ごとに保証される。`capacity` は「観測した事実が無いエネルギー」の
    **初期容量**で、使い切ると駆動が止まり `capState:"floor"` になる。
    `Static` は**即時応答極限** U=b+K·U を、**ρ(K)<1 を確かめてからだけ**解く(ρ≥1 は `{rho, U:null, singular:true,
    reason:"spectral-radius"}` —— 二重加算・自己源の無限増幅を防ぐ)。**この関係式は粘性(γ)だけの中継を記述する**
    ので、弾性 K を入れた時間発展とは一致しない(`kScale:0` のときだけ一致する)。
    `Field` は `dfmGalaxyMeshField` と**同じ返り値契約**(`u`・`nEff`・`supportR`・`unValid`)を持つ**別関数**である。
    **粒子側には力を返さない**(反作用は `Pext`/`Wext` の帳簿に置くだけ)。QA `behavior.chainMesh`。
  - `HP.dfmToyLedger(S, {caps?, ref?, maxPairs?})` — **BH 以降のトイの帳簿テンプレート**(既存の帳簿量を
    **読むだけ**・S を 1 バイトも書かない)。`{K, U, Eshell, Ecore, Emesh, Q, Eescaped, Etot, Wext, residual,
    dEtot, dWext, capState, capFloorCount, undefinedTerms, notes, obs, parts, closed}` を返す。
    **未実装の項は 0 で埋めず `null`** にして `undefinedTerms` に名前を挙げる(`U` は対の数が `maxPairs` を
    超えても**打ち切らずに未定義**にする)。**残差は基準 `ref`(前回の返値)を渡したときだけ定義される**
    (基準の無い差を作らない)。`caps` は項ごとの `{min,max}` で、下限に達した項に印が立つ。
    **減光(lightSweep)は `obs` 欄の観測写像**であって帳簿の項ではない(E_tot に入らない・質量推定を自動相殺しない)。
    **Q を重力波と読まない。** QA `behavior.toyLedger`。
  - **生成 AI はこれらを使わない**(プリセット JSON からは呼べない)。`overlays.galaxyField.slipThreshold` も
    SYSTEM_PROMPT の overlay 一覧には入れていない(診断器の宣言であり生成対象ではない)。
    QA `behavior.galaxyMesh` は 17 項目へ・`behavior.chainMesh`・`behavior.toyLedger` が新設
    (docs/PHYSICS.md 第257便b の節)。
- **引きずりの仕事・最小の閉鎖系・銀河の場の宣言 3 本(第258便b・第50報)**: いずれも**表示と記録の層**であり、
  **粒子の力へは 1 バイトも接続していない**。**全内蔵 120 本 × 600 步の状態はビット同一**で、
  **署名が変わったのは 🌌🎡🎠 の 3 本の `overlays` だけ**である。
  - **新しい physics キー `ledger`(opt-in・既定 OFF)**: `physics.ledger:{dragWork:true}` を宣言した宇宙だけが
    **引きずりの仕事**を記録する。正準形は `{dragWork:true}` の 1 鍵だけで、`false`・未宣言は「なし」へ正規化する
    (**宣言と未宣言で presetSig・エクスポート JSON が 1 文字も変わらない**)。`true`/`false` 以外は検証エラー・
    未知の鍵は落とす。**記録するだけで速度・スピンは 1 bit も変わらない**(QA が 200 步のビット同一で固定する)。
    読み口は `S.dragWorkE`(= Σ m v·Δv)・`S.dragWorkKE`(= Σ m(v·Δv+½|Δv|²) —— そのキックが動かした**厳密な**
    運動エネルギー)・`S.dragSpinE`(反作用の残余トルクが回転エネルギーを動かした量)・`S.dragWorkN`(キック回数)・
    `S.dragWorkStop`(`"coupleSink"` = 残余トルクの受け先が殻スピンでないので回転ぶんが未定義)。
    記録点は **E6′ の離散キック・E12(geoPN=2)の輸送 3 項・③/③′ の反作用の一括適用**の 3 か所である。
  - `HP.dfmToyLedger` の返値に **`Wdrag`・`WdragKE`・`WdragSpin`・`dWdrag`・`dWdragKE`・`residualDrag`・`dragWorkN`**
    が増えた。**未宣言なら `Wdrag` は 0 ではなく `null`** で `undefinedTerms` に名前が挙がる。
    既存の `residual`(= ΔE_tot−ΔW_ext)は**意味も値も 1 bit も変えていない** —— 引きずりぶんを差し引いた残差は
    **別欄 `residualDrag`**(= ΔE_tot−ΔW_ext−ΔK_drag)に返す。
  - `HP.dfmChainMeshClosed(chain, opts)` / `ClosedStep(cs, dt)` / `ClosedEnergy(cs)` — 連鎖トイに**有限の E_mesh** を
    結んだ**最小の閉鎖系**(純関数群・粒子の力へは未接続)。`opts` は `{Emesh0, G, centralMass, eps, ext}`。
    **4 項** `E_tot = K(節点の運動) + U(重力) + E_mesh(残容量 E_res + 鎖の弾性) + Q(熱)`、**ΔE_tot = W_ext**。
    **駆動は E_mesh から出る**(供給 = 節点へ渡った仕事 + 結合で散逸した熱)。1 步の供給が残容量を超える步は
    **駆動 OFF でやり直す**ので **E_res は 0 を割らない**(近似で埋めない・`capState:"floor"`)。
    `Q` は**粘性(bond γ・背景抵抗)と粒子–節点結合の散逸の和**である。
    `ClosedEnergy` は `Wpin`(**pinned 中心の維持仕事 = 厳密に 0**。中心が動かないので拘束力が仕事をしない)と
    `Fpin`(その拘束力そのもの —— 0 ではないので省略しない)を併記する。`dt<0`・不正な `ext`・負の `Emesh0`/`G` は `null`。
    QA `behavior.chainMesh`(第258便b で ⑨ を追加)。
  - **`overlays.galaxyField` の宣言が 3 本になった(署名便)**: 🌌 galaxy・🎡 galaxyStd に
    `{unSource:"disk",unFit:"affine"}`、🎠 galaxyMeshSpiral に `{unSource:"disk",unFit:"affine",slipThreshold:0.9}`。
    宣言すると**空間メッシュ表示の場が上位 2 体の連星場から銀河の局所場へ**変わる(表示を出したときだけ効く)。
    **他の未宣言 117 本には一括追加していない。**
  - **m=2 の呼び方の規約(第257便b ⑤ の読み替え)**: 引きずりシアの m=2 を ε に換算する 2 通り
    (棒 i=90° の |∇ψ|=m/r と、渦巻 i=20° の |∇ψ|=(m/r)/sin i)は、**「形状仮定別の見積り(棒仮定 / 渦巻仮定)」**
    と呼ぶ。**「上限」「下限」とは呼ばない**(どちらを採るかは宣言であって導出ではなく、片方が他方を
    挟むことも示していない)。`HP.dfmArmBudget` の `pitch` も同じ規約で読む。
  - **生成 AI はこれらを使わない**(`physics.ledger` は SYSTEM_PROMPT の physics キー一覧に入れていない ——
    帳簿の診断宣言であり生成対象ではない)。
- **銀河の背景の宣言・E_escaped の定義・E₀ の正名・2D 連鎖(第259便c・第51報)**: いずれも**表示と記録の層**であり、
  **粒子の力へは 1 バイトも接続していない**。**全内蔵 120 本 × 600 步の状態はビット同一**で、
  **署名が変わったのは 🌌🎡🎠(overlays)と 🎻🎠(physics.ledger)の 4 本だけ**である。
  - **`overlays.galaxyField` に第 4 の鍵 `bg`**(`"static"|"frame"`)。**宣言したときだけ**正準形が
    `{unSource,unFit,slipThreshold?,bg}` になる(未宣言は 1 bit 不変)。値域外は**落とす**(警告)。
    宣言があると `dfmGalaxyMeshField` の `bg` の既定がその宣言になる(**明示 `opts.bg` が常に優先**)。
    **🌌 galaxy・🎡 galaxyStd・🎠 galaxyMeshSpiral の 3 本が `bg:"static"` を宣言した(署名便)** ——
    `"static"` は u_bg=0(u=χ·u_n)なので **q・kFrame にビット不変**で、**外へ単調に落ちる**。
    **これは表示と記録が読む場の選択であって、力学の改善ではない**(600 步の状態は 1 bit も動かない)。
  - **新しい physics キー `spaceMesh.meshEnergyCapacity`(宣言専用・力へは未接続)**: **初期メッシュ貯蔵
    エネルギー E₀** の正名。0 以上の数値だけを受け、**宣言したときだけ正準形に入る**(負・非数値は検証エラー)。
    これを宣言した宇宙は `physics.spaceMesh` の 4 チャネル(gravity/inertia/weave/reservoir)がすべて OFF でも
    宣言が残る(= **`S.hasSpaceMesh` は false のままで、力の経路には 1 度も入らない**)。
    `HP.dfmToyLedger` の **E_mesh = E₀ − ΔK_drag** の基準になる(ΔK_drag は `physics.ledger.dragWork` が
    記録した量 —— **未宣言なら E_mesh は 0 で埋めず未定義**)。E_mesh が負になったら**値は連続のまま返し
    `meshCapState:"floor"`** を立てる(近似で 0 に丸めない = 宣言が供給に足りていない、という測定結果)。
  - `HP.dfmToyLedger` の返値に **`Emesh0`・`meshSupplied`・`meshCapState`・`EtotCore`・`EescapedBodies`・`escape`** が増えた。
    `EtotCore` は**宣言した定数 E₀ を除いた E_tot** で、相対残差は宣言値で薄めずにこちらで割る。
    **`meshEnergyCapacity` を宣言した宇宙では `residualDrag` は `residual` と同値になる**
    (ΔK_drag が E_mesh の減少として既に E_tot に入っているので**二重に引かない**)。
  - **`physics.ledger:{dragWork:true}` を 🎻 gw150914DFM と 🎠 galaxyMeshSpiral が内蔵で宣言した(署名便)**。
    **記録は力学を 1 bit も変えない**(600 步の状態はビット同一)。🎻 は `coupleSink:"reservoir"` なので
    **回転ぶん ΔK_spin は未定義**(`S.dragWorkStop="coupleSink"`)。
  - `HP.dfmEscapeLedger(S, {R, center?, maxPairs?})` / `HP.dfmEscapeUpdate(rec, S)` — **境界通過流束の記録器**
    (**S を 1 バイトも書かない**外部状態)。**このエンジンは粒子を 1 個も消さない**ので
    **`E_escaped,bodies` は 0 と定義される**(未定義ではない —— `dfmToyLedger` に `opts.escape` で記録器を渡すと
    `undefinedTerms` から "Eescaped.bodies" が消え、`escape` 欄に診断が入る)。
    外向き通過の瞬間に `K_i + U_i^int`(そのとき内側にいる粒子との対和)を積み、内向き通過では引く。
    `Uint`(= 出た粒子と残存系の重力相互作用 —— **出た粒子の重力は残る**)も毎回読む。
    **これは帳簿の項ではなく診断であり、E_tot には入れない**(入れると K・U と二重に数える)。
    **粒子数が変わった宇宙(融合・放出)では `stop:"n-changed"` で積算を止める**(索引の対応が取れないため)。
    `R≤0`・NaN 中心・null の S は `null`。QA `behavior.toyLedger`。
  - `HP.dfmChainMesh2DBuild(opts)` / `2DStep(ch, dt, opts?)` / `2DEnergy(ch)` / `2DModes(ch, m)` —
    **2D 連鎖メッシュ**(半径環 × 方位節点・純関数群・粒子の力へは未接続)。第258便b ⑦-4 の
    「リング縮約に**軌道の支持**(= 方位方向の節点)を入れるか」への実装で、**m=2 は方位自由度なしには測れない**。
    `opts` は `{rings(1〜8), sectors(4〜64), rIn, rOut, mu, tau, zeta, kScale, gammaScale,
    bond:"linear"|"central", gammaBg, Kbg, tauDrag, D0, p, eps, center, drive:{mass,r,omega,phase}}`。
    節点 (b,k) は基準配置 X=C+r_b(cosθ_k,sinθ_k) からの変位 ξ と速度 U を持ち、結合は**半径方向**と
    **方位方向**(輪)の 2 系統。駆動は**回転する 2 体**(m=2 の駆動)で、節点の基準配置の pull 重み平均速度 V と
    χ=W/(W+D₀) から a=χ·μ/τ_drag として F=a(V−U) を当てる(**新しい長さスケールを 1 つも足していない**)。
    駆動は時間に依るので **RK4 の各段は段階時刻 t+c_s·h で評価する**。
    `2DStep` の返値は `{t, dt, Em, Ekin, Epot, Q, Qdrive, Wext, P, L, dQ, dW, chiMean, residual, rel}` で、
    **ΔE_m+ΔQ−ΔW_ext=0 が閉じた帳簿の意味**(観測次数 4.11/4.05)。**dt<0 は `null`**。
    `2DModes(ch,m)` は環ごとの `c_m=(1/K)Σ ξ_r(θ_k)e^{−imθ_k}` と、パターン位相 φ=−arg(c_m)/m・
    **駆動のパターン位相との差(位相遅れ)**を返す。**2m≥K(ナイキスト)は `null`**。
    **|c₂|/|c₀| は単独指標にしない**(c₀ が剛性で潰れるぶんが混ざる)・**「上限」「下限」とは呼ばない**
    (第258便b ⑥ の規約)。QA `behavior.chainMesh`。
  - **蓄積格子の診断フラグ `overlays.spaceMesh.fieldApi`(実行時鍵・既定 false)**: **正準形にも presetSig にも
    S.params にも入らない**(検証器は `overlays.spaceMesh` を `{mode}` の 1 形へ潰すので、プリセットに書いても
    正準形には出ない —— `gain`・`tau` と同じ流儀)。**true かつ共通場 API `HP.dfmField` が在るときだけ**
    そちらを読み、**無いときは現行経路で格子の交点が 1 bit も変わらない**。
    読みは `HP.meshFieldApi(S)`(フラグ)/`HP.meshFieldApiLive(S)`(実際に読むか)。
    API の返り値契約は最低限 `{u:[ux,uy], chi, unValid}` として扱い、**満たさない返り値は読めない点にする**
    (黙ってゼロ埋めしない)。QA `behavior.galaxyMesh`。
  - **生成 AI はこれらを使わない**(`physics.spaceMesh.meshEnergyCapacity`・`overlays.galaxyField.bg`・
    `overlays.spaceMesh.fieldApi` はいずれも SYSTEM_PROMPT の一覧に入れていない —— 診断器の宣言であり
    生成対象ではない)。QA `behavior.galaxyMesh` は 19 項目へ・`behavior.toyLedger` は 11 項目へ・
    `behavior.chainMesh` は 12 項目へ(docs/PHYSICS.md 第259便c の節)。
- **第260便c(2026-09-13・第52報「早期に…銀河サンプルを完成させる」 — 帳簿の切り分けと有限容量の器)**:
  - `HP.dfmMeshCapacityStep(spec)` — **有限容量のメッシュの器**(純関数・**S を 1 バイトも読み書きしない**・
    **粒子の力へは 1 バイトも接続していない**)。有限のメッシュ状態 **Pmesh / Lmesh / Emesh** と粒子キックを
    **同段階で**更新する: `ΔPmesh=−ΔP`・`ΔLmesh=−ΔL`・`ΔEmesh=−ΔK`。
    `spec` は `{bodies:[{m,x,y,vx,vy}], P:[Px,Py], L, E, cap:{Emax}|{density,area}, tau, dt,
    kick:{mode:"drag", u:[ux,uy], chi}|{mode:"explicit", dv:[[dvx,dvy],…]}, drift}`。
    **容量の帯は `Emesh−ΔK ∈ [0,E_max]`**(= `ΔK ∈ [E−E_max, E]`)で、帯を出る步は
    **後から E を clamp せず、キックの倍率 s∈[0,1] を二分で解いて再計算する**
    (ΔK(s)=A·s+B·s² の最初の帯外れ点)。`capState` は `"floor"`(供給できない)/`"ceil"`(受け取れない)/`"ok"`。
    返値は `{bodies, dv, scale, capState, P, L, E, Emax, dP, dL, dK, dKfull, A, B, constrained,
    decl:{tau,chi,u,dt,capacityDensity,capacityArea,mode}, conserve:{P,L,E}, K0, K1}`。
    **τ・χ・u・容量(密度 × 面積)はすべて宣言値**であり、`decl` にそのまま持ち回る ——
    **観測から導出したとは呼ばない**。**メッシュの有効慣性は宣言していない**(Pmesh は運動量の受け皿で、
    別立ての運動エネルギーを持たない —— 宣言していないものを 0 で埋めない)。
    門(すべて `null`): spec が null / 粒子 0 / 非有限・負質量 / `E<0` / **`E>E_max`**(宣言と矛盾した初期値を
    黙って丸めない)/ cap 未宣言 / `tau≤0` / `chi∉[0,1]` / 未知 `mode` / `dv` の長さ不一致 / `dt<0`。
    実測(QA `behavior.chainMesh` ⑪): 小さな閉じた箱(粒子 3 + メッシュ・2000 步)で P 2.22×10⁻¹⁴・
    J 4.05×10⁻¹⁴(Σm|x||v| で規格化)・E 1.51×10⁻¹⁵。容量 3 段(E_max=10⁶/2/0.2)で到達平均速さが
    **1.9951 / 0.8165 / 0.2582 と単調に弱まる**。**力へは接続していない**(次便の署名便候補)。
  - `HP.dfmToyLedger` の返値に **`residualDragState`** と **`EshellState`** が増えた
    (**既存の値は 1 bit も変わらない** —— null の**理由**に名前を付けただけである)。
    `residualDragState` は `"no-ref"`(基準未指定)/`"no-dragWork"`(**`physics.ledger.dragWork` 未宣言 =
    記録していない。0 ではない**)/`"ok"`/`"same-as-residual"`(`meshEnergyCapacity` 宣言済み)。
    **`residualDrag` の null を 0 として集計・QA・表示してはならない**
    (「引きずりの仕事が 0 回だった」ことと「記録していない」ことは別である)。
    `EshellState` は `"tint"`(`thermal:"tint"` を宣言した宇宙 = `Σ C·|m|·T_int`)/
    `"spin-in-K"`(無印 = **スピン=熱**の規約。殻の回転 E ¼mR²ω² は**既に K に入っている**ので、
    ここに殻の回転 E を足すと**二重計上**になる —— **足さない**。0 で埋めるのでもない)。
    QA `behavior.toyLedger` ⑩ が `=== 0` で機械固定する。
  - **第261便d(第53報)で正式 API になった帳簿の欄**(**既存の値は 1 bit も変わらない**):
    `residualDragState` と `EshellState` は**正式な読み口**である(上の 2 つ —— 値の列挙と意味はそのまま)。
    さらに `HP.dfmToyLedger` の返値に **`denom`** が増えた:
    `{legacy, active, pinnedSpinE, pinnedN, activeShare, activeState, floorRel, parts}`。
    **`legacy` = \|K\|+\|U\|+\|E_core\|**(**未定義の項は 0 を足したのではなく項そのものが無い**)/
    **`active` = legacy − \|Σ_{pinned} ¼mR²ω²\|**(= **固定天体の一定スピン E** を除いた**活動部分**)/
    `activeState` は `"ok"` / `"active-degenerate"`(\|active\| ≤ `floorRel`×legacy)/ `"no-denom"`(legacy≤0)。
    **`floorRel` は宣言値**(`HP.LEDGER_ACTIVE_FLOOR_REL` = 1e−6)。
  - `HP.dfmLedgerRelative(value, denom)` — **相対残差を 1 つに決めない**純関数(S を 1 バイトも読まない)。
    返値 `{abs, relLegacy, relActive, denomState, floorRel}`。**活動部分が退化している宇宙では `relActive` は
    `null`** になり(0 で割った大きな数を出さない)、**絶対残差 `abs` を読む**。`value` が null/非有限なら **null**。
    **どちらか一方を正本にしない** —— 🎠 galaxyMeshSpiral は分母の **97.083%** が固定バルジ核のスピン E なので、
    同じ残差が**従来分母 3.18×10⁻⁴ / 活動部分 1.09×10⁻²(34.28 倍)**になる。
    **相対残差を引用するときは必ずどちらの分母かを書く。**
    **門の宣言**(QA `behavior.ledgerNorm` の `LEDGER_GATE_W261D`): 窓 **T=96・h=0.016(6000 步)**・
    分母 **[legacy | active] の両方**・しきい値 **1e−3**・seed は**プリセットの宣言値**・
    読む欄は **residualDrag(無ければ residual)**・**判定は informational**。
    **窓を宣言しない門は意味を持たない**(残差は窓で単調に増える —— 〔第260便c〕②)。
  - `HP.dfmLedgerGateState(rel, undefinedTerms, threshold?)`(**第262便d**)— **正本を宣言した**状態名の純関数。
    返値 `{primary:"active", threshold, relActive, relLegacy, abs, undefinedTerms, ledgerClosed, state, judged, note}`。
    **正本は活動部分**(`relActive`)で、従来分母は**併記**する(`HP.LEDGER_GATE_THRESHOLD` = 1e−3)。
    `state` は 5 つ: **`"within"`**(活動分母で門以下)/ **`"over"`**(**帳簿が閉じた**宇宙で門を超えた ——
    **「否」を名乗れる唯一の状態**・`judged:true`)/ **`"undefined-terms"`**(未定義項が残る宇宙で門を超えた ——
    **門外**。超過が未定義項の中にあるのかを切り分けられないので**「否」と呼ばない**・`judged:false`)/
    `"active-degenerate"` / `"no-denom"`。**FAIL を出す関数ではない**(判定は呼ぶ側が宣言する)。
    実測(窓 T=96・h=0.016): **🎻 gw150914DFM 8.462×10⁻⁴ = `within`**・
    **🎠 galaxyMeshSpiral 活動 1.0905×10⁻² = `undefined-terms`**(従来分母では 3.181×10⁻⁴)・
    **🫐 tuc47DFM 3.098×10⁻¹ = `undefined-terms`**。**門は廃していない。**
    **「両方の分母を通ったから合格」とは書かない**(未定義項がある限り帳簿は閉じていない)。
    HUD(保存量モニタ ON)は **`HP.ledgerHudLines(S)`** の 2 行で**どちらの分母か**を必ず出す
    (`HP.LEDGER_HUD_MS`=500 ms ごとに数え直す表示専用の節流 —— 力学は 1 bit も動かない)。
  - **`HP.frameWeightIsPull(physics)`(第262便d)** — **pull 族かどうかを答える唯一の関数**
    (未宣言 / `"pull"` / `"pull3"` / `"pull4"` が true・`"share"` と未知名が false)。
    `HP.frameWeightPow` は **share と未知名で p=1 を返す**ようになった(**番兵 0 は廃止**)。
    **生成 AI は JSON に書かない**(読み口である)。
  - **`S.meshCoordSink` / `S.meshCoordSinkL` / `S.meshCoordSinkGive` / `S.meshCoordSinkN`**(第261便d・診断の読み口)—
    `physics.spaceMesh.inertiaRemoval:"inStep"` を宣言し、かつ `physics.coupleSink` を宣言した宇宙で、
    **残余トルクを同段階で受け先(J_core / 容量つき J_z / リザーバ帳簿)へ送った量**の記帳である。
    **送り先も規則も `applyCoupleSinkAlt` と同一なので、状態は 1 bit も変わらない**(記帳が増えるだけ)。
    **`inertiaRemoval` の既定は `"post"` のままで、内蔵プリセットは 1 本も `"inStep"` を宣言していない。**
    **生成 AI はこれらを JSON に書かない**(読み口であって宣言鍵ではない)。
  - **生成 AI はこれらを使わない**(`dfmMeshCapacityStep` は器の純関数で、プリセット JSON の欄ではない)。
    QA は `behavior.toyLedger` に ⑩(固定 T × dt の 1 点・null の扱い・E_shell の欠落条件)を、
    `behavior.chainMesh` に ⑪(有限容量の器)を足した(docs/PHYSICS.md 第260便c の節)。
- **第261便c(2026-09-13・第53報「現実較正サンプルは、数値精度が上がれば合格する事が予測出来る段階に達したら、
  その事をチップなどで明示して完了とする」 — 較正の現在地チップの器)**:
  - **プリセットの任意鍵 `calibrationForecast`(宣言専用メタ・`presetSig` の外・生成 AI は書かない)**:
    `{status, scope, basis, gate, declaredSig, note}`。`status` は **5 つの列挙だけ**で、
    **それ以外は落とす**(未知の状態をチップにしない):
    `"measured-pass"`(実測合格)/ `"pass-expected-with-precision"`(精度向上で合格見込み)/
    `"convergence-incomplete"`(収束確認・未完)/ `"measurement-recheck"`(測定再検証)/
    `"calibration-recheck"`(較正要再確認)。`scope` は**範囲**(「公転周期のみ」等)、
    `basis` は根拠へのポインタ、`declaredSig` は**宣言時の `presetSig` の FNV ハッシュ**である。
    en 側は `p.en.calibrationForecast:{scope,note}` に文言だけを置く(`status` は共通)。
    **この鍵は `presetSig` に入らない**ので、署名・保存 JSON・力学・600 步の状態は 1 bit も変わらない。
  - **派生(表示専用・宣言には書かない)**: `HP.calibrationForecastOf(p)`(未知の状態を落とす読み)/
    `HP.presetSigHash(p)` / `HP.calibrationReviewBadge(p)`(**`declaredSig` と現在の署名が違えば
    自動的に `"calibration-recheck"` へ倒す**・`declaredSig` 未宣言なら倒さない)/
    `HP.calibrationCompletion(p)`(**開発上の完了として数えるのは `measured-pass` と
    `pass-expected-with-precision` だけ**)。定数は `HP.CALIBRATION_FORECAST_STATES` と
    `HP.CALIBRATION_FORECAST_COUNTED`。
  - **`HP.dfmForecastGate(series)` — 門 5 つの機械判定(純関数・力にも表示の物理にも接続していない)**:
    入力は `{fixed:{quantity,observationVersion,unit,timeSystem,window,extractor,f,refitPerStage?},
    stages:[{h,y},…], excluded:{duplicateEvents,nan,incomplete,unwrapFailed,roundingFloor},
    yObs, sigma, systematic, independent:{value,method}|null}`。
    返値は `{ok, verdict, gates:{g1..g5}, p, pShifts, yInf, uInf, residual, distanceSigma, failed[]}`。
    門は (1) 固定の宣言(段ごとに再 fit しない)/ (2) **4 段以上**・刻み比 2・除外印が 1 つも立っていない /
    (3) 隣接 3 段の次数が **0.5≤p≤4.5** かつ段ずらしの差 **≤0.25** / (4) 段ずらし Richardson が
    **2 本以上**あり **独立推定**と照合されている / (5) **|y∞−y_obs| + U∞ ≤ 3σ**
    (**U∞ = 隣接外挿差 + 独立推定との差 + 宣言系統幅**)。
    **`U∞` は数学的上限ではない**(3 項を足すという宣言である)。`ok` が真のときだけ
    `verdict:"pass-expected-with-precision"` が立ち、それ以外は **`null`** である
    (**「たぶん通る」を返さない**)。**門を通ることは「観測と合った」ことではない。**
  - **第262便c: 必須入力(欠落を「合格」と読まない)**。第261便c の判定は、`excluded` 欄が**無い**系列・
    独立推定の `method` が**無い**系列・`systematic` を**宣言していない**系列を**黙って 0 と見なして
    通していた**。本便から次の 3 つを必須にする(**門は厳しくなる方向にしか動かない** —— 通る件数は増えない):
    (a) `excluded` の **5 鍵すべて**(`duplicateEvents` / `nan` / `incomplete` / `unwrapFailed` /
    `roundingFloor`)を **明示の `false` または 0 以上の有限数**で宣言する(欄が無い・`undefined`・
    負・非有限は「除外した」と読まない。落ちるのは門(2)・読み口は `gates.g2.missingExclusions`)。
    (b) `independent.method` は**空でない文字列**が必須で、**`fixed.extractor` と同じ名前は独立と認めない**
    (門(4)・読み口は `gates.g4.methodMissing` / `gates.g4.methodSameAsExtractor`)。
    (c) `systematic` は**非負の有限数として明示宣言**する(省略は 0 ではない。門(5)・読み口は
    `gates.g5.systematicDeclared`)。
  - **第263便d: 上の必須入力 3 つを恒久契約にする(2026-09-14・第55報)**。第262便c は
    「本便から必須にする」と書いたが、**これを版をまたいで守る規約として固定する**:
    **① 門は厳しくなる方向にしか動かない。** 欠落した欄を 0 や `false` と読み替える緩和は
    **今後も入れない**(「宣言していない」と「0 であると宣言した」は別である)。
    **② 3 つの必須入力は撤回しない** —— `excluded` の **5 鍵すべて**の明示・
    `independent.method` が**空でなく `fixed.extractor` と別名**であること・
    `systematic` の**非負有限数としての明示**。鍵を増やすことはあっても、減らさない。
    **③ 緩めるときは「門を緩めた」と明記して別の関数名にする**(同じ `dfmForecastGate` の名前で
    判定が甘くなることを禁じる)。**④ 通る件数は増えない**: 第262便c の実測で **NS 4 系は
    独立推定を入れても 1 件も通らない**(`tests/out/independent-w262c.json`)。
    **この契約は「門を通れば観測と合った」を意味しない**(門(5) を通ることは
    「精度向上で合格見込み」の宣言資格であって、3σ の合格そのものではない)。
  - **生成 AI はこれらを使わない**(`calibrationForecast` は台帳の宣言で、生成対象の物理キーではない。
    `dfmForecastGate` は器の純関数である)。QA `behavior.calibrationForecast` が
    合成データの合格例・**否定対照 13 本**(第262便c で 6 本追加 —— 除外欄なし / 除外欄が 4 鍵だけ /
    独立推定に method なし / method が抽出法と同名 / 系統幅の宣言なし / 系統幅が負)・
    `presetSig` 不変・未知状態の除去・署名変化での自動倒し・
    チップの出方・**NS 4 系が 1 件も通らないこと**・**独立推定を入れても通る件数が 0 のまま**であること
    (`tests/out/independent-w262c.json`)を機械固定する
    (docs/CALIBRATION_VERDICT_v1.44.md §4′ と docs/PHYSICS.md 第261便c の節)。
  - **近点抽出器の位相制限(`tests/lib-precision-diagnostics.mjs` の純関数・アプリの外)**:
    `createPeriastronDetector({mode,phaseGate,maxCount,unwrapJump})` / `extractPeriastra(samples, opts)`。
    既定は **前の採用近点からの累積公転位相が 1.5π を超えるまで次の候補を採らない**
    (`measurementMethod:"radial-crossing/orbit-phase-1.5pi-v1"`)。**観測周期は閾値に入れない。**
    unwrap 失敗は **`measured:false`**(0 とは書かない)。旧法は `mode:"legacy"` で残っている。
    QA `lint.periPhaseGate`(純 Node)が合成データで機械固定する。
- **台帳の用語 — 等質量度の正名は `equalMassDegree`(第253便b L4・文書のみ)**: 2 体の質量がどれだけ揃っているかを表す量の**正名を `equalMassDegree = |m₁−m₂|/M`(M=m₁+m₂)** に固定する。**0 で等質量**・正質量(m₁,m₂>0)・M>0 のときにだけ定義され、値域は [0,1)。対応欄として **`4ν = 4m₁m₂/M² = 1−δ²`(δ=equalMassDegree)** を併記する(4ν は 1 で等質量 —— 向きが逆なので混ぜない)。ν=m₁m₂/M² は第249便a の ν 則でそのまま使う。**これはプリセットの物理キーではない**(生成 AI が JSON に書く欄ではなく、台帳・文書・ハーネス出力の呼び名の規約である)。
- **観測安定則(第199便 M1 — 2026-08-25 裁定)**: 観測値再現版は、観測値で安定する計算式を
  採用する(観測値自体が計算式で算出されている為)。kFrame=1 雛形が自己診断で永年不安定と
  差し戻される系に限り kFrame=0 で採用し、引きずりは A/B の**測定側**として保持する
  (適用第1号: ✨ αケンタウリAB。転写ミスは従来どおり差し戻し — docs/PHYSICS.md の該当節参照)。

- **コミット済み出典表(`paper/data/*.csv`)のスキーマ — `sigma` 列を持つのは 3 本になった(第266便a)**:
  列は `body,quantity,value,unit,source,url,retrieved,note,sigma` の **9 列**で、
  `sigma` に入れるのは**一次資料に印字された対称 1σ だけ**(単位換算は可・**値と同じ単位**)。
  **空欄は「誤差が記録されていない」であって「誤差 0」ではない。**
  非対称区間・信用区間・丸め幅・伝播値は σ ではないので note へ置く
  (`sigma_kind=asymmetric|ci90|covariance|digits|none`・`sigma_plus`/`sigma_minus`/`level`・
  `ci90_lo`/`ci90_hi`・`digits`)。上限・下限は **value を空にして** `upper_limit=` / `lower_limit=` に置く。
  印は `sigma_primary=verified|unverified` で、**`verified` にできるのは原仮定者が一次資料の表・列・桁を
  確認したときだけ**である(X7: `verified_by=<確認者> <日付>; verified_at=<表/列>; verified_value=<原記載>`)。
  外部の転写照合は `value_checked_by=` に置き、**印は 1 bit も上げない**(Z11)。
  - `paper/data/solar-observations.csv` …… 判定(門)が σ を読む正本。
  - `paper/data/cluster-galaxy-observations.csv` …… **第266便a で `sigma` 列を足した**(既存 108 行は空欄のまま)。
    量名は `sigma_los(r=… pc)`(視線分光)と `sigma_pm(r=… pc)`(固有運動・一次単位 mas/yr)を**分ける**。
  - `paper/data/transient-observations.csv` …… **第266便a 新設**。LFBOT(AT2018cow / AT2022tsd)の**記録**で、
    全行に `gate=not-connected` が入っている(**門には 1 行も繋がっていない**)。
  - `paper/data/supernova-observations.csv` と `paper/data/jovian-satellites.csv` は **sigma 列を持たない**(従来どおり)。
  - **生成 AI はこれらの CSV を書かない**(取込経路は `ObservationRecord` であって CSV ではない)。
- **判定に使う採用観測解の宣言(第268便a — `paper/data/judgement-sources.json`)**: 門(`tests/exp-w249b-calaudit.mjs`)と
  σ 接続器(`tests/exp-w262d-solarsigma.mjs`)が**どの CSV 行を判定に採るか**の宣言表である。
  **宣言の無い `body|quantity` は、従来どおり CSV のファイル順で最初の行**を採る(後方互換)。
  スキーマ:
  ```json
  { "schemaVersion": 1, "wave": "<便>", "what": "<何の表か>", "rule": ["<規約>"], "doNotWrite": ["<禁止の言い方>"],
    "declarations": [ { "body": "Charon", "quantity": "orbital_period",
      "csvQuantity": "orbital_period_candidate", "source": "<CSV の source 列そのまま>",
      "solution": "<解の説明(表・列・fit の種類)>", "value": 551856.43872, "unit": "s",
      "sigma": 0.02592, "declared": "YYYY-MM-DD", "reason": "<なぜこの行を採るか>" } ],
    "notDeclared": [ { "body": "Phobos", "quantity": "orbital_period", "why": "<宣言しない理由>" } ] }
  ```
  - `quantity` は**門が読む量**(`orbital_period` / `eccentricity` / `periastron_advance`)、
    `csvQuantity` は **CSV 上の鍵**(候補行は `<quantity>_candidate` という**別の鍵**である)。
  - `value`・`sigma`・`source` は **CSV の行から 1 文字も変えずに写す**。器は「body・鍵・value・sigma が
    完全一致する行が**ちょうど 1 件**」であることを毎回確かめ、決まらなければ**従来の行を使って理由を残す**
    (黙って差し替えない・推測で当てない)。`sigma` が `null` の宣言は**行選択だけ**を決める(門へは入らない)。
  - **宣言は行選択であって、単位の一致・観測量対応・数値収束の宣言ではない。** 宣言で動いた数は
    「**宣言後の初判定**」として 4 値の**横の欄**(`declaredFirst`)に置き、**据え置きの 4 値は上書きしない**。
  - **生成 AI はこのファイルを書かない**(採用解の宣言は原仮定者と統括の裁定である)。
