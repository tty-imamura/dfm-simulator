# Paper 6 (outline, v0.1 — wave 248): *Calibration, Numerical Controls, and Limits of a Dragging-Field Toy Model*

Status: **outline only** (no manuscript yet). Language of the manuscript: EN + JA, same build pipeline as papers 1–5 once a `.tex` exists.
Scope: the negative results and numerical controls accumulated in waves 220–248 on the DFM simulator. This paper makes **no positive
claim** about real gravitomagnetism; it records what a 2D dragging-field toy model can and cannot reproduce, and how each verdict was fixed.

## 0. Abstract (draft sentence)
A 2D dragging-field toy model (DFM) with one frame field u, a pull-weighted transport law (E6′) and an inertia law
f = 1 + k_F(αχ_A + βχ_B) is calibrated on the Earth–Moon and Saturn-ring systems and then tested, without re-fitting, on compact
binaries (PSR J0737−3039A/B, GW150914). We report nine negative results with their numerical controls (step-size convergence,
Float32/Float64 drag-field precision, detector method), and state the limits of the model as verdicts fixed to one line each.

## 1. Model summary (what is actually integrated)
- Frame field u, pull weight (m/d²) with D0pull, E6′ transport (first-order in time), pairReduced.
- Inertia law f = 1 + k_F(αχ_A + βχ_B); f ≈ 2 at χ saturation.
- Spin–spin toy `physics.spinSpin` (U = λ (G/c²) Q₁Q₂/ρ³); observed-Q transcription `body.spinDipole`.
- Core v2 (Mc/J primary variables, contraction with budget gate, shed, bare-core terminal state).
- Numerical controls: `framePrecision:"double"`, half-kick split, dt ladders, two precession detectors.

## 2. Calibration set and hold-outs (declared, not inferred)
- Fit: 🌘 Earth–Moon (D0pull, 8.85-yr apsidal cycle), 🪨 Mercury, 💿 Saturn ring (frameSource), ⚡ J0737 (f only).
- Hold-out: 🎻 GW150914 eccentricity (fails: +1.0%), PSR J1757−1854 / J1946+2052 (wave 248 — companion spin unknown → sensitivity band).
- Rule: a knob fitted on a two-body system means something else in a three-body one (🔆 audit C).

## 3. Numerical controls (methods section)
1. Step-size ladder dt, dt/2, dt/4 with the same detector; "converged" only if the change is below the detector floor.
2. Drag-field precision: Float32 arrays give a non-converging precession floor on ⚡; Float64 (`framePrecision:"double"`) converges to 0.00945°/orbit.
3. Two apsidal detectors (osculating ϖ vs multi-periastron fit) must agree before a value is called physical.
4. Period shortening −0.111%/orbit is discretization work (linear in dt) — reported as a numerical, not physical, effect.
5. Same-value re-confirmation contract for run-state edits (bit-invariance) so that UI round-trips never inject drift.

## 4. Nine negative results (one line each; details per wave in docs/PHYSICS.md)
1. Static 1/r⁴ term is absent from E6′ (a moving probe erases spin dragging outside the reference orbit).
2. A common λ that fixes ⚡ destroys the solar system (🪨 −1.51″/century).
3. ⚡ precession floor was Float32 numerics; after removal the value (0.00945°/orbit) is still 2× the observed 0.00473 — not a reproduction.
4. u is instantaneous (no retardation) — no GW-like propagation; petersGW is an external overlay with a fitted dose.
5. Self-force is zero by construction — a lone spinning body never precesses or radiates.
6. Saturn's Q < Jupiter's Q under the DFM ledger — the "Saturn stronger" thought experiment is not supported.
7. Observed-Q transcription for ⚡ gives η = 1.09×10⁻¹⁶ — gravitomagnetism is invisible at the pulsar separation.
8. E6′ spin transport scales as q and contributes 1e-10 — it is not a spin–orbit term.
9. No single dimensionless law (f, common λ, compactness Ξ, inertia β) satisfies ⚡, GW150914 and the solar system at once — a Ξ-monotone law breaks the BH first (Ξ_BH = 0.5 > Ξ_NS = 0.16).

## 5. What the model can show (positive, bounded)
- Calibrated apsidal precession from motion dragging (window-declared; not steady over 118 orbits — audit).
- Trailing m=2 spiral response to rotor dragging in a closed 383-body system (E2 emergence level, not E3).
- Conservation bookkeeping of core events (shed, merge, spin-burst) to 1e-11 relative.

## 6. Limits (verdict table, fixed one line each — mirrors PHYSICS〔第247便 — 統括〕)
| Sample | Quantity | Current verdict |
|---|---|---|
| ⚡ | apsidal advance | numerical floor removed; 0.00945°/orbit ≠ observed; SO reference (λ=1) is 1/2.4e4 of the gap |
| ⚡ | η (spinSpin) | 1.09×10⁻¹⁶ with EOS-proxy radius 11.75 km |
| 🎻 | merger time | 4.116 s is the conventional-direction record; 3.963 s with tangential Peters dose is a fit |
| ✴️💫 | apsidal windows | regression windows, not observation windows |
| 🧿 | f = 1.999914, λ = 1e11 | phenomenological calibration example, not a law |

## 7. Reproducibility
- Every number above is a QA gate (`tests/qa.mjs`) or an `experiments/*.mjs` harness with a JSON output; figures regenerate from `tests/out/*.json`.
- Commit/tag to be fixed at manuscript v0.1.

## 8. Not in this paper
3D axis dynamics (closed), dark matter or spiral-arm theory claims, black-hole interior structure (rebuild pending), Michelson–Morley "null prediction" (the toy gives a staircase, not a prediction).
