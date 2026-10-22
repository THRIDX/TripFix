# TripFix Design Concept (v0.1)

Status: design stage. Nothing in this document is implemented yet. Each mechanism is marked **Planned (MVP)**, **Planned (later)** or **Out of scope**.

## 1. Problem (from A1)

Travel disruptions are often **chained**: a cancelled flight leads to a missed connection, which then affects the hotel and later activities. The traveller's own requirements also change along the way (for example, a lower budget). The A1 review found two separate lines of work:

- Agent research improves how AI revises plans, but evaluates single-step revision with simulated users (Karmakar et al., 2026; Cheng et al., 2026; Zou et al., 2026; Tack et al., 2026).
- Human–AI interaction research gives users control and confirmation points, but in tasks whose goal stays fixed (Horvitz, 1999; Amershi et al., 2019; He et al., 2025; Zhou et al., 2026).

TripFix joins the two: **the AI keeps revising the plan, and the user can always follow and confirm what matters.**

## 2. Design principle: "AI revises, user follows"

| Commitment | What it means for the user |
|---|---|
| Visible state | I can always see my current requirements, the current plan, and what has actually been done. |
| Traceable change | Every AI change arrives as a proposal that shows what changes downstream and why. |
| Gated commitment | Nothing irreversible happens without my explicit confirmation; reversible steps can be undone. |

## 3. Interaction mechanisms

### M1. Requirements Ledger — Planned (MVP)
A panel listing the traveller's **active requirements** (budget, must-keep bookings, preferences, deadlines). Each entry shows where it came from (stated by the user / inferred by the AI), when it was set, and what it replaced. Users can edit or delete entries directly instead of re-explaining in chat.

- Why: models lose track when users revise intent mid-conversation (Tack et al., 2026; Zou et al., 2026); explicit tracking of intents and constraints helps (Tao et al., 2026).
- Guidelines: remember recent interactions (Amershi G12); support efficient correction (G9).

### M2. Dependency Chain View — Planned (MVP)
The itinerary is shown as a chain of linked segments (flight → train → hotel → activity). When a disruption hits one segment, every downstream segment that depends on it is highlighted as **affected**.

- Why: TripTide found that local fixes are not always carried through to dependent activities (Karmakar et al., 2026). Making dependencies visible lets the user check that a repair reached every affected item.

### M3. Repair Proposal as a Diff — Planned (MVP)
The AI never silently edits the plan. It proposes a **repair package**: before/after for each affected segment, cost difference, which requirements are satisfied or violated, and a one-line reason. The user can accept all, accept part, or ask for an alternative.

- Why: plausible-looking plans can mislead users (He et al., 2025), so the proposal shows the checks, not just the plan.
- Guidelines: convey consequences before acting (Amershi G16); support efficient correction (G9).

### M4. Reversibility-Tiered Confirmation — Planned (MVP)
Every action is classified before it runs:

| Tier | Examples | Behaviour |
|---|---|---|
| 0 Read-only | search fares, compare options | AI acts automatically |
| 1 Reversible | hold a seat, draft a refund request | AI acts, user can undo |
| 2 Irreversible / costly | cancel a ticket, pay, submit a refund claim | explicit user confirmation with a summary |

- Why: act automatically only when acting is clearly worthwhile (Horvitz, 1999); intermediate confirmation is preferred to end-only confirmation (Zhou et al., 2026).

### M5. Re-validation on Requirement Change — Planned (MVP, core contribution)
When the ledger changes, TripFix re-checks **already executed and pending** actions against the new requirements and flags conflicts, for example:

> "Your rebooked flight (£180) is above your new budget (£150). Keep it, change it, or accept being over budget?"

- Why: this is the gap identified in A1. Existing confirmation studies assume a fixed goal; TripFix asks what happens to earlier, already-confirmed repairs when the goal moves.

### M6. Action Log with Honest Status — Planned (MVP)
Every action carries a status: Proposed → Confirmed → Executed (simulated) / Failed / Undone. The interface only says "done" after the (mock) booking service confirms it.

- Why: users must be able to tell what has actually happened, not what the AI says has happened. It also keeps the prototype honest about what is simulated.

### M7. Pause and Take Over — Planned (later)
A global control that stops the AI and lets the user edit the plan by hand.

- Guideline: provide global controls (Amershi G17).

## 4. Architecture (initial)

```
[Web UI] ── chain view · ledger · proposal diff · confirm dialog · action log
    │  user actions / edits                     ▲ state + proposals
    ▼                                           │
[Orchestrator] ── keeps the Trip State (itinerary + dependencies, bookings, ledger, action log)
    │            │                 │                   │
    ▼            ▼                 ▼                   ▼
[Scenario    [AI Planner]     [Constraint Checker]  [Action Gate]
 Engine]      LLM → structured  deterministic:        tiers 0/1/2
 scripted     repair proposal   budget, time,         (M4)
 disruptions                    must-keep, deps (M5)
 (simulated)                                           │
                                                       ▼
                                              [Mock Booking Service]
                                               fixed fares and policies
                                               (simulated)
```

- **Implemented with a real model (planned):** AI Planner.
- **Deterministic code (planned):** Constraint Checker, Action Gate. The LLM proposes; code verifies. This responds to the finding that plausible plans can be wrong (He et al., 2025) and that explicit state tracking helps (Tao et al., 2026).
- **Simulated:** disruptions (scripted), bookings, fares and refund rules.
- **Out of scope:** real airline/rail APIs, real payments, live flight status.

## 5. Scenarios (storyboard candidates)

All scenarios use a fixed, fictional 4-day UK trip (Birmingham → Edinburgh → Inverness) with fictional operators.

1. **Cancelled flight.** The Birmingham–Edinburgh flight is cancelled. The chain view marks the airport train, hotel check-in and evening tour as affected. The AI proposes a later flight and a moved tour (M2, M3). Rebooking is Tier 1; claiming the refund is Tier 2 and needs confirmation (M4).
2. **Budget change mid-repair.** After the rebooking has been executed, the user lowers the budget. TripFix flags the rebooked flight and a hotel upgrade as conflicts and asks which to revisit (M1, M5).
3. **"Keep this one."** An attraction closes. The AI's first proposal moves a dinner reservation the user marked as must-keep; the Constraint Checker rejects it, and the AI revises. The user sees why the first option was dropped (M1, M3).

## 6. How the prototype will be checked

Scenario replays (scripted, repeatable) with three checks at each step:

- **Requirement persistence:** does any executed action violate an active ledger entry?
- **State–feedback consistency:** does the status shown in the UI match the mock booking service?
- **User effort:** how many confirmations and re-explanations does the scenario need?

An informal walkthrough with 2–3 people is **Planned (later)**, if time allows.

## 7. Open decisions

- Tech stack and model choice (see README).
- Mapping each mechanism to the Week 1–4 lecture concepts and guidelines (needs the lecture list).
- Whether to run the informal walkthrough.
