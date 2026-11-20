# TripFix · Priority Block and Preference Memory

Prose word count: 258

## Run

From the repository root, serve the standalone prototype and open the English view.

```sh
python -m http.server 8788 --bind 127.0.0.1 --directory TripFix
```

Open http://127.0.0.1:8788/#en and choose **Start demo**. The interface also supports Chinese. The browser runs HTML, CSS and JavaScript. The planner searches local train and activity options. This version runs without credentials or external services.

## Replay

In the London trip, move **Opera** first and **Spend less** second. Finish ranking, check Preference Memory and open the proposal. Check the evening performance, £12 extra and the skipped walk. Lock both Opera and Spend less to see the conflict. Unlock Opera to see interval entry for £0. Replay returns the trip to its starting itinerary.

## Development record

- Priority Block replaced percentage labels and changing bar lengths. Ranking expresses preferences and locks express requirements. Both affect the schedule.
- Preference Memory distinguishes a previous inference from an explicit note. Manual ranking takes precedence, and preferences persist for each trip in browser storage.
- Pending actions separates a preview from a confirmed change. Withdrawal excludes eligible options from replanning. The conflict and recovery walkthrough checks that confirmation becomes available again after one lock is released.
- The English storyboards were captured from the running interface. Events, fares, historical examples and external actions are simulated. The architecture diagram describes the standalone implementation.

## Project evidence and assistance

[Report draft](REPORT.md) · [System diagram](../evidence/tripfix-system-architecture.svg) · [Core implementation](https://github.com/THRIDX/TripFix/commit/e0e78042d7ef5fb997cf738df9df9d84f86e40753af5b080f1bdea3720f7100df071f49ca)

OpenAI Codex assisted with implementation, report drafting, diagram preparation and browser walkthroughs. Design revisions included removing percentage labels and making eligible actions withdrawable. The planner outputs, confirmation states and figure captions were checked against the London walkthrough.