# TripFix: Who decides what survives a disrupted trip?

**Word count: 1,319** (239 abstract and 1,080 main text).

[Project repository](https://github.com/THRIDX/TripFix) · [Prototype README and development record](https://github.com/THRIDX/TripFix/blob/7d8f3e24da12094ac9135af6860665f4e8e14e2b/TripFix/README.md) · [Reviewed implementation, e0e7804](https://github.com/THRIDX/TripFix/tree/e0e78042d7ef5fb997cf738df9df9d84f86e4075/TripFix)

| Counted material | English words | Limit |
|---|---:|---:|
| Abstract | 239 | 300 |
| 1. Design rationale and project scope | 758 | |
| 2. Architecture and technical rationale | 218 | |
| 3. Storyboards and illustrated interaction | 104 | |
| **Main text** | **1,080** | **1,100** |
| **Abstract and main text** | **1,319** | **1,400** |

Section 1 includes 345 words in the design rationale table. The main-text count includes section headings and written explanations. Figures, short captions, references and project links are excluded.

## Abstract

A traveller is waiting for a train to London. They have tickets for an afternoon opera, dinner plans with a friend and a sunset walk by the river. Then the train is cancelled. The next service arrives after the curtain goes up. Keeping the three activities in their original order would mean joining the opera halfway through. The traveller would happily give up the walk and meet their friend earlier if they could hear the performance from the beginning. That preference changes which rebooking makes sense.

TripFix helps the traveller decide what to keep when the original day is no longer possible. In **Priority Block**, they rank activities alongside cost and lock anything they must keep. **Preference Memory** shows which earlier preferences are still guiding the plan. The traveller can put the opera ahead of a remembered preference for sunset while retaining their spending limit. The planner compares trains and activity times against those choices, then shows the revised day before the traveller confirms it.

We built and tested this interaction in a browser using a simulated cancellation, fares and bookings. In the London walkthrough, putting the full opera first and cost second produces a proposal the traveller can judge: take the 13:30 train, meet their friend at 16:45, pay £12 to change to the evening performance and skip the walk. The walkthrough demonstrates how a preference changes the repair. Its effect on travellers’ satisfaction remains to be evaluated.

## 1. Design rationale and project scope

### What makes a repaired trip worth taking?

When the 11:50 train is cancelled, the next service reaches London at 14:52. The 14:30 opera has already begun. A planner that keeps the original sequence can fit in the opera from the interval, dinner with Lina at 17:00 and the riverside walk at 18:10. On a calendar, all three activities survive. For someone who came to hear the opening, the most important part of the day has already been lost.

The traveller is willing to drop the walk to hear the whole opera. Once they can express that preference, the planner can consider having dinner before the evening performance and compare the cost with other train and ticket options. Our design question is how the traveller can make that trade-off deliberately and see whether the proposed repair honours it before anything is changed.

Assignment 1 identified two parts of this problem. TripTide found that language models often preserved the intent and sequence of an itinerary, although their ability to repair it deteriorated on longer trips [1]. Its measures tell us how closely a revision follows an existing plan. After a cancellation, departing from that plan may be exactly what a traveller wants. Zhou and colleagues investigated when users should inspect an agent’s work. In their multistep tasks, 39 of 48 participants preferred intermediate checks to confirmation at the end [2]. TripFix brings these findings together: travellers set priorities before replanning and can revise them after seeing the consequences.

### Two core designs: Priority Block and Preference Memory

**Priority Block** lets the traveller say which experience to protect first and which requirements are firm. Putting Opera above Spend less tells the planner to preserve a full performance first, then minimise the extra cost among the options that achieve it. **Preference Memory** makes the assumptions behind that search visible. In this trip, manually moving Opera to the top switches off the earlier inferred preference for sunset. Their £20 spending limit stays visible. One change expresses what is different today without making them enter every preference again.

| Design choice | Why it suits the problem | Evidence behind the choice | Status |
|---|---|---|---|
| **Priority Block**: rank and lock | Dragging a block expresses which activity to protect first. Locking it makes full preservation a condition of any acceptable plan. Someone who prefers the opera but could accept missing the first act can express exactly that distinction. | Week 2 showed the same flight choices presented aloud and on screen. Visible alternatives support recognition and comparison [4]. We removed percentage labels and variable lengths from an earlier version because neither had a defined meaning for the traveller’s choice. | Implemented |
| **Preference Memory**: inspect and correct | A past preference for sunset may be a poor guide to today’s trip. The panel separates current priorities from earlier information, identifies an inferred preference or the traveller’s own note, and lets them turn it off. A manual reorder takes precedence over the inferred order. | The Week 2 thermostat example shows why a manual override must last. Week 4 calls for memory people can inspect and correct [4, 6]. These principles also connect to efficient correction in Amershi and colleagues’ guidelines [3]. | Implemented. Example histories are seeded. |
| Replanning and conflict feedback | Working out which train and performance fit is a scheduling task. Choosing whether to spend money or miss part of a performance is a personal decision. A conflict stops confirmation and invites the traveller to release a lock. | Week 1’s mixed-initiative example assigns the next move according to the cost of a wrong guess [4]. Week 3’s exercise on checkable criteria informed a concrete rule: whenever locked requirements conflict, confirmation must be unavailable [5]. | Implemented |
| Preview individual consequences before commitment | Approving a different train can also mean abandoning the walk or asking Lina to move dinner. The Pending actions card names each change, shows the extra cost and marks actions that become final on confirmation. Eligible changes can be withdrawn individually. | Week 4 distinguishes visible, reversible actions from consequential actions that need confirmation [6]. During development we replaced a passive reversibility label with a working withdrawal control, so a traveller can act on that information. | Local controls implemented. External effects simulated. |

An earlier prototype offered a preview and undo. When it moved dinner, the preview showed the new time but left a question unanswered: was that the only time the train allowed, or had TripFix used an old note that dinner could move? This led us to put Preference Memory between ranking and confirmation. The traveller can turn off the dinner note before deciding whether the revised evening works.

## 2. Architecture and technical rationale

![Figure 1. From train cancellation through Priority Block and Preference Memory to a confirmed itinerary.](../evidence/tripfix-system-architecture.png)

Priority Block supplies the traveller’s ranking and locks. Preference Memory shows the budget and flexibility settings in effect. The local planner combines these inputs with the available trains and activity slots. Arrival times, transfer gaps, budget and locks determine feasibility. Among feasible schedules it compares outcomes in the traveller’s stated order. When activities compete, moving one block up can change which plan wins. A reviewer can repeat the decision with the same inputs or change one requirement to see its effect.

The browser saves order, locks and enabled memories for each trip. A proposed repair remains separate from the confirmed itinerary. Withdrawing an eligible suggestion excludes that option before recalculation, so the next proposal respects the correction. Confirmation updates the itinerary held in the current session and supplies the reference plan for subsequent changes.

We narrowed A1’s broader question about successive disruptions to repeated decisions after one cancellation. Keeping the event and inventory fixed lets the walkthrough isolate the effect of the traveller’s intervention. The screens record actual interface states. The cancellation, fares, past-trip examples and external booking or messaging effects are simulated. The next evaluation would ask travellers to predict the cost and identify the lost activity before confirming. That would test whether people understand the trade-off the planner has computed.

## 3. Storyboards and illustrated interaction

**Keeping the whole opera.** After the 11:50 cancellation, the traveller puts Opera first in Priority Block. Preference Memory shows that the old sunset preference is off and the £20 budget still applies. The 18:00 performance costs £12 extra and means missing the walk. The traveller sees both consequences before committing.

![Figure 2a. The full London itinerary and the proposed evening performance.](../evidence/tripfix-storyboard-01-opera.jpg)

![Figure 2b. Priority Block and Preference Memory after the traveller puts Opera first.](../evidence/tripfix-storyboard-01-controls.jpg)

**Changing the terms.** The traveller locks the full opera and zero extra spending. TripFix reports a conflict and disables confirmation. The traveller then unlocks Opera while keeping the spending lock. Interval admission at 15:45 becomes feasible for £0, and confirmation becomes available again. Only one requirement had to change.

| Both requirements locked | Opera unlocked, £0 limit retained |
|---|---|
| ![Figure 3a. Conflicting locks disable confirmation.](../evidence/tripfix-storyboard-02-conflict.jpg) | ![Figure 3b. Interval entry is available and confirmation is enabled.](../evidence/tripfix-storyboard-03-recovery.jpg) |

## References and project evidence

1. Karmakar, P., Chaudhuri, S., Mallick, S., Gupta, M., Jana, A. and Ghosh, S. (2026). [TripTide: A Benchmark for Adaptive Travel Planning under Disruptions](https://aclanthology.org/2026.findings-acl.2002/). Findings of ACL.
2. Zhou, J., Roy, A., Gupta, S., Weitekamp, D. and MacLellan, C. J. (2026). [When Should Users Check? Modeling Confirmation Frequency in Multi-Step Agentic AI Tasks](https://doi.org/10.1145/3772318.3790655). CHI.
3. Amershi, S. et al. (2019). [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/). CHI.
4. University of Birmingham, Intelligent Interactive Systems (2026). [Lecture 3, slides 9–10](https://canvas.bham.ac.uk/courses/90253/files/22437894), [Lecture 5, slides 8 and 11](https://canvas.bham.ac.uk/courses/90253/files/22460079), [Lecture 6, slide 13](https://canvas.bham.ac.uk/courses/90253/files/22460081).
5. University of Birmingham, Intelligent Interactive Systems (2026). [Lecture 9, slides 12–14](https://canvas.bham.ac.uk/courses/90253/files/22503236).
6. University of Birmingham, Intelligent Interactive Systems (2026). [Lecture 10, slide 12](https://canvas.bham.ac.uk/courses/90253/files/22507964), [Lecture 12, slides 12 and 16](https://canvas.bham.ac.uk/courses/90253/files/22507966).

[Reviewed implementation, e0e7804](https://github.com/THRIDX/TripFix/tree/e0e78042d7ef5fb997cf738df9df9d84f86e4075/TripFix) · [Prototype README and development record](https://github.com/THRIDX/TripFix/blob/7d8f3e24da12094ac9135af6860665f4e8e14e2b/TripFix/README.md) · [Repository](https://github.com/THRIDX/TripFix)