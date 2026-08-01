# Physics That Emerges from Simple Assumptions — An Introduction to the Determinant-Field Model (for science-minded high-schoolers)

Audience: anyone who has studied high-school mechanics (circular motion, universal gravitation).
This is **not real physics — it is a thought experiment with hypothetical laws**.
This is the English edition of `docs/EXPLAINER_HIGHSCHOOL.md`; the Japanese text is the original.

The whole document fits in one line:

> **Assume a simple Determinant-Field Model (DFM), and look-alikes of many real physical phenomena *emerge* on their own. Try them yourself in the app.**

We never wrote down the law of gravity, the laws of thermodynamics, phase transitions or
cosmic expansion as formulas. All we put in is a handful of rules that grow out of a single
idea — *coordinates are decided by majority vote*. And yet the screen fills with phenomena
that look strikingly like universal gravitation, time dilation, thermal equilibrium, latent
heat, boiling, molecules, galactic rotation and redshift. Where the resemblance holds and
where it breaks — you can probe that boundary yourself, in a simulator that runs in your
browser.

Simulator: `https://tty-imamura.github.io/dfm-simulator/` (works on iPhone; dev version at `/beta/`)
The axioms, equations and machine-verified results live in two English papers (core laws
and box universe) in the repository's `paper/` folder.

---

## 1. Starting riddle: a universe with a single star

Suppose the universe contains exactly one star. Can you say it is *moving*? To move is to
change position *relative to something*; with nothing to compare against, the question seems
undecidable. Newton's famous **bucket argument** led him to posit an invisible standard —
*absolute space*. The 19th-century physicist **Ernst Mach** pushed back: the water's surface
curves because it rotates *relative to the stars*; in an empty universe, rotation itself
would be meaningless (**Mach's principle**). Our model universe goes all-in on Mach's side.

## 2. The assumptions — all of them

1. **Determinant W**: space does not pre-exist. Each location's "ease of fixing
   coordinates" is the sum of w = mass / distance (m/d). **The determinant is a voting
   right on "which one is at rest" at that location** — more mass and less distance mean
   more votes. The contribution of the entire distant universe is folded into one number,
   the background determinant **D0**.
2. **Climb the slope**: particles accelerate up the determinant's gradient.
3. **Rest by majority (dragging)**: "at rest" at each point is the determinant-weighted
   average motion of nearby masses. Near a massive or spinning body, space itself is dragged.
4. **Clocks and light from one psi**: where W is high, clocks tick slower and light bends
   toward the "harder-to-travel" region — both from a single scalar psi.
5. **Heat is internal**: particles carry an internal temperature exchanged by contact.
   Temperature enters mechanics only as a repulsion — **thermal pressure (E5')**.
6. **Contact and bonds**: overlapping particles push back; under set conditions they carry
   short-range bonding/cohesive intermolecular forces.
7. **The box (optional)**: the distant universe's determinant, bundled into a "box",
   thins over time — cosmic expansion.

That's everything. Every phenomenon in the catalog below is a *consequence* of these rules.

## 3. The emergence catalog — what to verify, in which sample

Each entry states what you CAN confirm (✅) and what you CANNOT (⚠️) — hiding that boundary
is against this model's house rules.

### 3-1. Inverse-square gravity (🪐 Saturn's rings and the astronomy samples)

The slope of w = m/d is proportional to m/d². Having assumed only "gradient = force,"
**the inverse-square law of gravitation appears by itself** — no law of gravity was written.
- ✅ Orbits, ring stability, two/three-body motion (🌍 Earth & Moon uses the real mass
  ratio and synchronous rotation)
- ⚠️ The model is 2-D borrowing the 3-D formula; strong-field GR (black holes) is out of scope

### 3-2. The standard of inertia — Newton vs Mach (🪣 Mach's bucket)

One D0 slider is a miniature of the 300-year dispute.
- ✅ D0=0: space inside a spinning ring co-rotates (pure Mach). Large D0: the distant
  universe's votes win and you get near-absolute space (Newton) — continuously connected
- ⚠️ The real universe's D0 cannot be measured; it is a thought-experiment dial

### 3-3. Frame dragging and galactic rotation curves (🌌 Galaxy / 🌀 rotor solo)

Because the inner stars drag space around, outer stars ride the rotating space and keep
their speed with little gravity — **the rotation curve flattens with no dark matter**.
The suggested A/B runs drag-on vs drag-off side by side.
- ✅ A mechanism demo: *if* dragging were strong, this too would flatten curves. Momentum
  and angular momentum are conserved exactly, reaction included (see the conservation monitor)
- ⚠️ **Not a claim about the real universe.** Real dragging (Lense-Thirring) is tiny, and
  dark matter has many independent lines of evidence

### 3-4. Time dilation, light bending, Shapiro delay (🛰️ weak-field GR calibration, 🔭 lensing, ☿ Mercury)

Set the knob Kt to its real value (c²/G) and:
- ✅ GPS clock gain **+38.5 μs/day**, starlight deflection at the Sun's limb **1.75″**, and
  Shapiro delay **≈281 μs** all match simultaneously, from the single scalar psi
- ⚠️ The base rules do **not** produce Mercury's perihelion precession (43″/century). Only
  the explicit E12 geodesic extension — promoting the clock's psi into the law of motion —
  reproduces it. A model that states plainly where it works and where it fails

### 3-5. The basics of thermodynamics (🔥 equilibrium, 📏 conduction, 🌈 radiative cooling, ♨️ convection, 🧪 buoyancy)

- ✅ Bodies at different temperatures equalize on contact (zeroth-law-like equilibrium);
  heat travels faster between closer particles; hotter bodies cool faster; heating the floor
  makes **convection cells start turning on their own**; hot light particles get pushed up
- ⚠️ "Pressure" here is the assumed thermal-pressure rule, not kinetic theory; real gas
  constants and material properties are out of scope

### 3-6. Latent heat and phase change (🫠 melting, ❄️ freezing, 🔁 the round trip)

Making enthalpy (total heat) the source of truth produces the **temperature plateau at the
melting point** naturally: while temperature stalls, every joule you pour in goes into the
phase change (latent heat).
- ✅ The melt front advances from the heated wall; crystalline order *emerges* on freezing
  (disorder ψ6≈0.8 → 0.97); the round trip shows no hysteresis; the energy ledger closes
  (conservation monitor). The white arc on each particle = molten fraction, a phase channel
  independent of the temperature color
- ⚠️ No supercooling or stochastic nucleation; no numerical reproduction of real melting
  points or latent heats

### 3-7. Boiling — in a universe with no buoyancy (💨 boiling & condensation)

- ✅ A second plateau at the boiling point; evaporation also pays the cohesion energy
  (effective latent heat); two-phase quasi-steady coexistence. **Gas here has the same
  particle mass as liquid — no density buoyancy — so vapor accumulates between the hot
  floor and the pool and lifts the liquid: a film-boiling (Leidenfrost) analogue emerges**
- ⚠️ You will not see ordinary "light bubbles rising" boiling (that needs a density
  difference); the description says so explicitly to prevent misreading

### 3-8. Molecules and material structure (⛓️ chain liquid, 🧬 three states emerging)

The newest highlights.
- **⛓️ Chain liquid**: cap the liquid's bonds at *valence 2* (at most two partners) and a
  structural transition appears — solid = an unlimited-bond lump vs liquid = **chains**
  (molecular spaghetti). Melting pays the cost of rewiring a coordination-6 network into
  coordination-2 chains as latent heat, so it melts visibly slower than the isotropic liquid
- **🧬 Three states emerging**: go further and throw away every phase switch, keeping only a
  **bond budget**: each molecule splits a fixed budget among its current partners; fewer
  bonds mean stronger remaining ones; partners are set by geometry alone, never fixed. Then
  competition with thermal pressure alone makes solid (a coordination-6 lattice) → droplets
  and clusters → a **gas of molecules** (small 2-9 particle clusters flying free) emerge.
  The last bonds are the strongest — that is why the gas is made of molecules, not atoms —
  and the bond lines visibly thicken and darken as the budget concentrates
- ✅ Gradual change of bond count, emergent structures (lump/chain/molecule), closed ledger
- ⚠️ Not a quantitative model of real polymers or chemical bonds. No charges or dipoles —
  a finding of this model is that *limiting the number of bonds* was enough for chains

### 3-9. Cosmic expansion and redshift (📦 box-universe series, 🧭 two H estimators)

- ✅ Galaxies separate; light waves stretch (redshift); bound systems do not expand. In 🧭,
  **measuring the same universe two different ways splits the expansion-rate answer by ~8%**
  — because one estimator assumes a formula that differs from this universe's actual law.
  Calibrated to the same level as the real **Hubble tension** (~9%)
- ⚠️ That match is by calibration, not an explanation of the real tension (the on-screen
  note says so itself)

### 3-10. Igniting a star (⭐ star core)

- ✅ The skeleton of the stellar energy story: gravitational contraction → hot dense core →
  fusion releases heat → the star shines. Against a fusion-off control, radiated energy is
  about 75× larger
- ⚠️ Real nuclear reaction rates and stellar-structure quantities are out of scope

## 4. Summary table — where it's real, where it's assumption

| Topic | Real physics | This model |
|------|-----------|----------|
| Inverse-square gravity | Given as law / derived from GR | Emerges from the determinant's slope ◎ |
| Standard of inertia | Absolute space … partially Machian | Pure majority vote; D0 interpolates the two |
| Frame dragging | Real (Lense-Thirring) but tiny | A free knob (this is the "assumption") |
| Flat rotation curves | Dark matter (much independent evidence) | Strong dragging (model-internal only) |
| Time dilation / light bending | Established GR | Same-shaped formulas from one scalar (weak-field match) |
| Heat and pressure | Translational molecular motion | Internal temperature + thermal pressure (assumed rule) |
| Latent heat / phase change | Intermolecular forces + statistical mechanics | Emerges from enthalpy bookkeeping + intermolecular forces |
| Molecules | Quantum chemical bonds | Look-alike structures from classical bond-budget/valence rules |
| Cosmic expansion | GR + observation (FLRW) | One knob: the box determinant thinning |
| Conservation laws | Exact | Momentum, angular momentum and energy machine-verified with ledgers (QA) |

## 5. Getting around the app

1. Use the category selector to narrow the list (e.g. the Thermal Lab). Open a sample and
   read its description tab — a three-part 📌summary / 🔎observe / 🎛control structure tells
   you what to look for.
2. Samples with a **suggested A/B** run a one-tap control experiment (drag on/off etc.) in
   split screen.
3. The **conservation monitor** (in the Display category) shows the momentum, angular
   momentum and energy ledgers live — the audit that keeps "emergence" honest.
4. Every parameter is editable; reset with ⏮ if things blow up. Phase-change samples have
   their own knobs (melting point, latent heats, bonds, …).
5. Every claim is checked by a machine QA suite (300+ items) on every build (`tests/`).

## 6. To go further

Keywords: Mach's principle / Newton's bucket / Lense-Thirring effect / gravitational time
dilation (GPS) / gravitational lensing / galactic rotation curves and dark matter / latent
heat and phase transitions / Hubble tension. After playing with the model, each of these
should feel like "ah, that knob".

The axioms, formulas and verification records are written up as two English papers (core
laws & box universe) in `paper/`. Reading them is also a worked example of what it means to
*turn a thought experiment into something checkable*.
