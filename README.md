# TripFix

Prose word count: 345

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

- Initial implementation: `fecee96`; state, preview, revision checks, undo and nine tests. These were delivered together.
- Audit revision: `578956d`; unapplied input now blocks review and confirmation, identical repairs produce no preview, and repeated fare events preserve state. Outcome messages describe actual changed fields. These corrections address mismatches between displayed information and effective state.
- Verification: twelve executable tests pass, including empty repair, repeated fare and a second repair after confirmation with failure, retry and undo. Chrome checks confirmed disabled confirmation after an unapplied budget edit and the continuous sequence. No browser errors were reported.

## Contributions, reused material and AI assistance

The scenario and interaction priorities follow the TripFix proposal in A1. Course concepts and research are credited in the report. OpenAI Codex assisted with implementation, tests, report wording and the system diagram. Review of its initial output exposed the three interaction inconsistencies above; the corrected behaviour was checked through executable tests and Chrome walkthroughs. The six screenshots were captured from the running application.

## Files and review version

- `report_draft.html`: report, architecture and three illustrated episodes.
- `architecture.svg`: logical components and implementation boundaries.
- `evidence/01-preview.jpg` through `06-recovered.jpg`: successive screens.
- `evidence/test-results.txt`: executable test results.
- Local review tag: `a2-review-2`. Public repository publication and Canvas submission remain pending.

No separate ZIP, API key or video is needed to inspect this version.
