# Paper 6 (outline, v0.1 — wave 248): *Calibration, Numerical Controls, and Limits of a Dragging-Field Toy Model*

Status: **outline only** (no manuscript yet). Language of the manuscript: EN + JA, same build pipeline as papers 1–5 once a `.tex` exists.
Scope: the negative results and numerical controls accumulated in waves 220–248 on the DFM simulator. This paper makes **no positive
claim** about real gravitomagnetism; it records what a 2D dragging-field toy model can and cannot reproduce, and how each verdict was fixed.

## 0. Abstract (draft sentence)
A 2D dragging-field toy model (DFM) with one frame field u, a pull-weighted transport law (E6′) and an inertia law
f = 1 + k_F(αχ_A + βχ_B) is assessed with an explicit parameter-and-data ledger. Earth–Moon and Saturn calibrations,
the J0737 calibration example, and conditional compact-binary hold-outs are distinguished. We report ten negative results within the tested model family, with numerical controls (step-size convergence,
Float32/Float64 drag-field precision, detector method), and state the limits of the model as verdicts fixed to one line each.

## 1. Model summary (what is actually integrated)
- Frame field u, pull weight (m/d²) with D0pull, E6′ transport (first-order in time), pairReduced.
- Inertia law f = 1 + k_F(αχ_A + βχ_B); f ≈ 2 at χ saturation.
- Spin–spin toy `physics.spinSpin` (U = λ (G/c²) Q₁Q₂/ρ³); observed-Q transcription `body.spinDipole`.
- Core v2 (Mc/J primary variables, contraction with budget gate, shed, bare-core terminal state).
- Numerical controls: `framePrecision:"double"`, half-kick split, dt ladders, two precession detectors.

## 2. Calibration set and hold-outs (declared, not inferred)
- Fit: 🌘 Earth–Moon (D0pull, 8.85-yr apsidal cycle), 🪨 Mercury, 💿 Saturn ring (frameSource), ⚡ J0737 (f only).
- Conditional hold-outs: PSR J1757−1854 / J1946+2052 (GR-derived input masses and unknown companion spins must be declared; after a law is chosen on these three systems they become a development set and a fresh frozen hold-out is required). GW150914's +1.0% eccentricity offset is relative to an adopted central value, not a rejection at observational confidence; retain it as a historical morphology case.
- Rule: a knob fitted on a two-body system means something else in a three-body one (🔆 audit C).

## 3. Numerical controls (methods section)
1. Step-size ladder dt, dt/2, dt/4 with the same detector; "converged" only if the change is below the detector floor.
2. Drag-field precision: Float32 arrays give a non-converging precession floor on ⚡; Float64 (`framePrecision:"double"`) converges to 0.00945°/orbit.
3. Two apsidal detectors (osculating ϖ vs multi-periastron fit) must agree before a value is called physical.
4. Period shortening −0.111%/orbit is discretization work (linear in dt) — reported as a numerical, not physical, effect.
5. Same-value re-confirmation contract for run-state edits (bit-invariance) so that UI round-trips never inject drift.

## 4. Ten negative results (one line each; details per wave in docs/PHYSICS.md)
1. Static 1/r⁴ term is absent from E6′ (a moving probe erases spin dragging outside the reference orbit).
2. A common λ that fixes ⚡ destroys the solar system (🪨 −1.51″/century).
3. ⚡ precession floor was Float32 numerics; after removal the value (0.00945°/orbit) is still 2× the observed 0.00473 — not a reproduction.
4. u is instantaneous (no retardation) — no GW-like propagation; petersGW is an external overlay with a fitted dose.
5. Self-force is zero by construction — a lone spinning body never precesses or radiates.
6. Saturn's Q < Jupiter's Q under the DFM ledger — the "Saturn stronger" thought experiment is not supported.
7. Observed-Q transcription for ⚡ gives η = 1.09×10⁻¹⁶ — gravitomagnetism is invisible at the pulsar separation.
8. E6′ spin transport scales as q and contributes 1e-10 — it is not a spin–orbit term.
9. The tested common-dose and monotone-compactness candidates (f, common λ, compactness Ξ, inertia β) did not meet the joint NS/BH/solar constraints — a Ξ-monotone law breaks the BH first (Ξ_BH = 0.5 > Ξ_NS = 0.16). This is a conditional negative for the tested family, not a no-go theorem for new laws; BH rebuilding is a separate task.
10. Period P and apsidal advance ω̇ cannot be satisfied by the same mass factor f under the current uncorrected E12 (wave 248b): Δϖ_DFM = f × Δϖ_GR to 5 digits on three DNS (1.998/1.998/1.997). Candidate fix under test: λ_PN = 1/f (existing key) with the exact speed of light (wave 249a).

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
- Map each reported number to its exact measurement window, detector, source record and code hash. Wave-248/249 harnesses are `tests/exp-w248a.mjs`, `tests/exp-w248b-audit.mjs`, `tests/exp-w248b-so.mjs`, `tests/exp-w248c.mjs` and `tests/exp-w249*.mjs`; their output JSON is archived under `tests/out/`. Saved QA results are regression evidence, not an independent rerun.
- Commit/tag to be fixed at manuscript v0.1.
- Review-v8 qualification (wave 250c): the wave-249 inventory contains **285 quantities**; 58 of its 62 "agreement" labels rest on a provisional 1% guide rather than an observational uncertainty test, and the machine gate |y_sim - y_obs| <= 3*sigma_obs + eps_num (eps_num <= 0.3*sigma_obs, taken from the two-step-size difference) currently returns "unassessed" for all 285. Keep provenance and statistical agreement in separate columns.
- A rate derived from advance per periastron interval must be converted with the **radial (periastron-to-periastron) period**; fitting the periastron angle directly against time is clearer still. Recomputing the saved D68 record this way gives **38.126 deg/day** (+0.047% against the declared 38.108, -0.306% against the observed 38.243) instead of 38.892 from the sidereal-period conversion. This is an audit correction, not a new integration.
- The fixed-axis force's earlier shell-spin reaction changed rotational energy with no matching axis work. The declared axis is now treated as an external angular-momentum reservoir, coupled axis dynamics remain unimplemented, and the long-window morphology of the three principle samples must be remeasured after this correction.

## 8. Not in this paper
3D axis dynamics (closed), dark matter or spiral-arm theory claims, black-hole interior structure (rebuild pending), Michelson–Morley "null prediction" (the toy gives a staircase, not a prediction).
