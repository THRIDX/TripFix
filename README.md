# TripFix

An AI travel assistant that repairs trips hit by chained disruptions, while keeping the traveller able to follow and confirm every important change.

> README narrative word count: 424 (code blocks and commands excluded)

## Project status

| Part | Status |
|---|---|
| Literature review (A1) | Done. Sources in [`docs/references.md`](docs/references.md) |
| Design concept | Draft v0.1 in [`docs/design-concept.md`](docs/design-concept.md) |
| Prototype | Not started |
| Scenario data | Not started |

Nothing is runnable yet. Bookings, fares and disruptions will all be simulated; the prototype will make no real transactions.

## Tech stack (proposed, not final)

| Part | Proposed | Role | Decided? |
|---|---|---|---|
| Backend | Python 3.12 + FastAPI | Orchestrator, trip state, mock booking service | No |
| AI planner | Anthropic Claude API | Turns trip state and requirements into structured repair proposals | No (model not chosen) |
| Constraint checker | Plain Python | Verifies every proposal deterministically | Yes |
| Frontend | React + Vite, or plain HTML/JS | Chain view, requirements ledger, proposal diff, confirmation | No |
| Tests | pytest scenario replays | Repeatable checks of each scenario | No |

## Run or inspect

The prototype cannot be run yet. To inspect the current work, read:

- [`docs/design-concept.md`](docs/design-concept.md): problem, interaction mechanisms, architecture, scenarios and checks
- [`docs/references.md`](docs/references.md): verified sources from the A1 review

API keys are never committed. When the prototype needs one, it will read it from a local `.env` file (ignored by git), and `.env.example` will show the variable name only.

## Repository structure

```
docs/
  design-concept.md
  references.md
.gitignore
README.md
```

## Development log

### 2026-10-22: Problem framing and repository setup

- Framed the problem in A1 as **chained disruptions**: the AI must keep revising the plan, and users must be able to follow and confirm key changes.
- Removed three sources from an early draft that could not be found online and replaced them with verified ones.
- Wrote design concept v0.1: seven interaction mechanisms, an initial architecture, three scenarios and three evaluation checks.
- Decision: the language model proposes repairs and deterministic code verifies them, because plausible-looking plans can still be wrong (He et al., 2025).

## AI assistance

- **Tool:** Claude Code (Anthropic, Claude Opus 5.5).
- **Used for:** finding and opening candidate papers, drafting and translating text, counting words, and setting up this repository.
- **How outputs were checked:** at my request, every cited paper was looked up online and its claims were compared with the paper itself; three sources from an earlier draft could not be found and were removed. Word counts were measured with a script rather than estimated.
- **What I decided:** the problem framing, the title, the structure of the review and the final wording, through several rounds of revision. For example, I rejected an early draft that opened directly with travel and asked for a general-to-specific structure instead.

## Supporting files

None yet.
