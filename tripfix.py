from copy import deepcopy
from datetime import datetime
from uuid import uuid4

class TripFix:
    def __init__(self):
        self.reset()

    def reset(self):
        self.constraints = {"budget": 180, "latest_arrival": "22:00", "keep_hotel": True}
        self.plan = {"transport": "TF100 — cancelled", "arrival": "Not confirmed", "hotel": "Riverside Hotel", "activity": "River walk · day 1, 16:00", "extra_cost": 0}
        self.quotes = [
            {"id": "TF218", "departure": "17:30", "arrival": "20:55", "price": 120},
            {"id": "TF204", "departure": "15:30", "arrival": "18:55", "price": 170}
        ]
        self.revision = 1
        self.pending = None
        self.history = []
        self.events = []
        self.fail_next = False
        self.message = "Your flight was cancelled. Review a repair that keeps your hotel."
        return self.snapshot()

    def snapshot(self):
        return deepcopy({"constraints": self.constraints, "plan": self.plan, "pending": self.pending,
                         "revision": self.revision, "events": self.events, "can_undo": bool(self.history),
                         "message": self.message, "fail_next": self.fail_next})

    def log(self, action, outcome):
        self.events.append({"time": datetime.now().strftime("%H:%M:%S"), "action": action,
                            "outcome": outcome, "revision": self.revision})

    def update_constraints(self, budget, latest_arrival):
        if type(budget) is not int or not 0 <= budget <= 1000:
            raise ValueError("Enter an extra budget from £0 to £1,000.")
        if not isinstance(latest_arrival, str):
            raise ValueError("Enter an arrival time.")
        try:
            datetime.strptime(latest_arrival, "%H:%M")
        except ValueError:
            raise ValueError("Use a valid arrival time, such as 22:00.")
        if len(latest_arrival) != 5:
            raise ValueError("Use HH:MM for the arrival time.")
        if (budget, latest_arrival) == (self.constraints["budget"], self.constraints["latest_arrival"]):
            return self.snapshot()
        self.constraints.update(budget=budget, latest_arrival=latest_arrival)
        self.revision += 1
        self.pending = None
        self.message = "Requirements updated. Review a new repair using these values."
        self.log("Change requirements", f"£{budget}; arrive by {latest_arrival}; keep hotel")
        return self.snapshot()

    def propose(self):
        feasible = [q for q in self.quotes if q["price"] <= self.constraints["budget"]
                    and q["arrival"] <= self.constraints["latest_arrival"]]
        if not feasible:
            self.pending = None
            self.message = f"No available repair meets both £{self.constraints['budget']} and arrival by {self.constraints['latest_arrival']}. You can change either limit; your hotel stays protected."
            self.log("Review repair", "No feasible option")
            return self.snapshot()
        chosen = min(feasible, key=lambda q: (q["price"], q["arrival"]))
        plan = {"transport": f"{chosen['id']} · London → Lisbon · {chosen['departure']}",
                "arrival": chosen["arrival"], "hotel": self.plan["hotel"],
                "activity": "River walk · day 2, 16:00", "extra_cost": chosen["price"]}
        changes = [{"field": k, "before": self.plan[k], "after": v}
                   for k, v in plan.items() if self.plan[k] != v]
        if not changes:
            self.pending = None
            self.message = "Your current plan already matches this repair. No changes to confirm."
            self.log("Review repair", "No changes needed")
            return self.snapshot()
        reason = (f"This option reaches your hotel at {chosen['arrival']} "
                  f"within your {self.constraints['latest_arrival']} limit.")
        if plan["activity"] != self.plan["activity"]:
            reason += " The later arrival misses the first-day walk; move it to day 2."
        else:
            reason += " Your hotel and day-2 walk stay unchanged."
        self.pending = {"id": uuid4().hex, "revision": self.revision, "plan": plan,
                        "source": f"Scenario fare list · revision {self.revision}",
                        "reason": reason, "changes": changes}
        self.message = "Review the affected parts. Your current plan stays in place until you confirm."
        self.log("Review repair", f"{chosen['id']} proposed; hotel preserved")
        return self.snapshot()

    def confirm(self, proposal_id, confirmed):
        p = self.pending
        if confirmed is not True:
            raise ValueError("Confirm the displayed repair before saving it.")
        if not p or proposal_id != p["id"] or p["revision"] != self.revision:
            self.message = "This preview is no longer current. Review the latest repair."
            self.log("Confirm repair", "Refused: outdated or already used preview")
            return self.snapshot()
        if self.fail_next:
            self.fail_next = False
            self.pending = None
            self.message = "The simulated provider rejected the request. Your current plan is unchanged. Review a new repair to try again."
            self.log("Confirm repair", "Failed; current plan unchanged")
            return self.snapshot()
        self.history.append(deepcopy(self.plan))
        self.plan = deepcopy(p["plan"])
        self.pending = None
        self.revision += 1
        labels = {"transport": "flight", "arrival": "hotel arrival",
                  "hotel": "hotel", "activity": "activity", "extra_cost": "extra cost"}
        changed = ", ".join(labels[item["field"]] for item in p["changes"])
        self.message = f"Local plan updated: {changed}. Riverside Hotel kept."
        self.log("Confirm repair", "Local plan updated")
        return self.snapshot()

    def cancel(self):
        self.pending = None
        self.message = "Preview discarded. Your current plan is unchanged."
        self.log("Discard preview", "No plan change")
        return self.snapshot()

    def undo(self):
        if self.history:
            self.plan = self.history.pop()
            self.revision += 1
            self.pending = None
            self.message = "Previous local plan restored. Review it against your current requirements and latest fares."
            self.log("Undo", "Previous local plan restored")
        return self.snapshot()

    def event(self, name):
        if name == "fare":
            old_price = self.quotes[0]["price"]
            if old_price == 145:
                self.message = "The TF218 fare is still £145. No new price change; the current state is unchanged."
                return self.snapshot()
            self.quotes[0]["price"] = 145
            self.revision += 1
            self.pending = None
            self.message = f"The TF218 fare changed from £{old_price} to £145. Review a fresh repair before confirming."
            self.log("Fare update", "TF218 now £145; earlier preview expired")
        elif name == "failure":
            self.fail_next = True
            self.message = "Scenario set: the next confirmed request will receive a provider rejection."
        else:
            raise ValueError("Unknown scenario event.")
        return self.snapshot()
