# TripFix

The current browser prototype centres on two controls, Priority Block and Preference Memory. [Run the prototype and replay the examples](TripFix/README.md) or [read the illustrated project report](TripFix/REPORT.md).

## Earlier prototype

Prose word count: 436

## Status and scope

Interactive simulation of continuous travel repair. Visible requirements, previews, confirmation, failure handling and local undo work. Fixed rules and sample fares simulate planning and provider outcomes. Language input is an optional extension. Live bookings, payments and refunds are outside this version.

The scenario preserves Riverside Hotel. Budget and latest hotel arrival are editable. Extra cost is the selected repair's total additional cost, not accumulated charges. State is held in memory for one local user and resets when the server restarts.

## Run and inspect

Python 3.9 or newer; standard library only. HTML, CSS and JavaScript implement the browser interface.

```text
python -B app.py
python -B test_tripfix.py
```

Open http://127.0.0.1:8772 and /report.

Replay: review and confirm the £120 repair; change arrival to 19:00; apply requirements; review £170; choose “Next request fails” under Scenario controls; confirm; request a fresh repair and confirm again.

## Development record

- A1 foundation: [5cc5c54](https://github.com/THRIDX/TripFix/commit/5cc5c54); the October concept and reference list are retained in [docs/design-concept.md](docs/design-concept.md) and [docs/references.md](docs/references.md).
- Scope decision: the original multi-service, model-backed concept was narrowed to two simulated flights, editable limits and local confirmation/recovery. Python standard-library code and plain HTML/JavaScript make these interactions repeatable without accounts or external dependencies.
- Initial implementation: [fecee96](https://github.com/THRIDX/TripFix/commit/fecee96); state, preview, revision checks, undo and nine tests. These were delivered together.
- Audit revision: [578956d](https://github.com/THRIDX/TripFix/commit/578956d); unapplied input now blocks review and confirmation, identical repairs produce no preview, and repeated fare events preserve state. Outcome messages describe actual changed fields. These corrections address mismatches between displayed information and effective state.
- Report and screenshots: [4050dee](https://github.com/THRIDX/TripFix/commit/4050dee); updated the rationale, architecture and six-screen sequence after the audit.
- Verification: twelve executable tests pass, including empty repair, repeated fare and a second repair after confirmation with failure, retry and undo. Chrome checks confirmed disabled confirmation after an unapplied budget edit and the continuous sequence. No browser errors were reported.

## Contributions, reused material and AI assistance

The scenario and interaction priorities follow the TripFix proposal in A1. Earlier A1 work and repository preparation used Claude Code, as recorded in the [original README](https://github.com/THRIDX/TripFix/blob/5cc5c54/README.md). Course concepts and research are credited in the report. OpenAI Codex assisted with implementation, tests, report wording and the system diagram. Review of its initial output exposed the three interaction inconsistencies above; the corrected behaviour was checked through executable tests and Chrome walkthroughs. The six screenshots were captured from the running application.

## Files and review version

- `report_draft.html`: report, architecture and three illustrated episodes.
- `architecture.svg`: logical components and implementation boundaries.
- `evidence/01-preview.jpg` through `06-recovered.jpg`: successive screens.
- `evidence/test-results.txt`: executable test results.
- Public repository: [THRIDX/TripFix](https://github.com/THRIDX/TripFix). GitHub review version: [a2-github-review-1](https://github.com/THRIDX/TripFix/tree/a2-github-review-1). The earlier local review tag `a2-review-2` is retained. Canvas submission remains pending.

No separate ZIP, API key or video is needed to inspect this version.
