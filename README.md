# TripFix

Prose word count: 160

## Status

Interactive simulation of a traveller repairing a cancelled flight across changing requirements and fares. The interface, revision checks, local plan updates and undo work. The planner uses fixed rules and sample fares. Live models, bookings, payment and refunds are planned.

## Run

Python 3, standard library only.

```text
python -B app.py
```

Open http://127.0.0.1:8772. Open /report for the report draft.

```text
python -B test_tripfix.py
```

## Inspect

Try a normal repair, change the budget while a preview is open, then use the scenario controls to change the fare or reject the next request.

## Development record

14 November: carried the A1 chained-disruption question into a visible requirement panel, a dependent-change preview and explicit confirmation. Added state revisions to invalidate old previews, a failure result and local undo. All nine state checks pass. Browser checks also passed for confirmation, undo, budget conflicts, expired fares and failed execution. No browser errors were reported.

## Material

report_draft.html contains the first report draft and three interaction sequences. architecture.svg identifies local, simulated and planned components. The public repository and final submission version are pending.
