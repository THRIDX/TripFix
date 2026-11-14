import unittest
from tripfix import TripFix

class InteractionChecks(unittest.TestCase):
    def setUp(self):
        self.t = TripFix()

    def test_preview_does_not_change_current_plan(self):
        before = self.t.snapshot()["plan"]
        self.t.propose()
        self.assertEqual(before, self.t.plan)
        self.assertEqual("Riverside Hotel", self.t.pending["plan"]["hotel"])
        self.assertIn("day 2", self.t.pending["plan"]["activity"])

    def test_confirm_updates_and_undo_restores(self):
        before = self.t.snapshot()["plan"]
        p = self.t.propose()["pending"]
        self.t.confirm(p["id"], True)
        self.assertEqual(120, self.t.plan["extra_cost"])
        self.t.undo()
        self.assertEqual(before, self.t.plan)

    def test_changed_budget_invalidates_old_preview(self):
        old = self.t.propose()["pending"]["id"]
        self.t.update_constraints(100, "22:00")
        self.t.confirm(old, True)
        self.assertEqual(0, self.t.plan["extra_cost"])
        self.t.propose()
        self.assertIsNone(self.t.pending)
        self.assertEqual(100, self.t.constraints["budget"])
        self.assertTrue(self.t.constraints["keep_hotel"])

    def test_repeated_changes_preserve_other_requirements(self):
        self.t.update_constraints(130, "22:00")
        self.t.propose()
        self.t.event("fare")
        self.t.propose()
        self.assertIsNone(self.t.pending)
        self.t.update_constraints(160, "22:00")
        p = self.t.propose()["pending"]
        self.assertEqual(145, p["plan"]["extra_cost"])
        self.t.confirm(p["id"], True)
        self.assertEqual("Riverside Hotel", self.t.plan["hotel"])
        self.assertEqual("22:00", self.t.constraints["latest_arrival"])

    def test_fare_change_blocks_stale_confirmation(self):
        old = self.t.propose()["pending"]["id"]
        self.t.event("fare")
        self.t.confirm(old, True)
        self.assertEqual(0, self.t.plan["extra_cost"])
        self.assertEqual(145, self.t.propose()["pending"]["plan"]["extra_cost"])

    def test_provider_failure_does_not_report_success(self):
        p = self.t.propose()["pending"]
        before = self.t.snapshot()["plan"]
        self.t.event("failure")
        result = self.t.confirm(p["id"], True)
        self.assertEqual(before, result["plan"])
        self.assertFalse(result["can_undo"])
        self.assertIn("rejected", result["message"])
        self.assertIn("Failed", result["events"][-1]["outcome"])

    def test_confirmation_is_single_use(self):
        p = self.t.propose()["pending"]
        self.t.confirm(p["id"], True)
        self.t.confirm(p["id"], True)
        self.assertEqual(1, len(self.t.history))

    def test_no_silent_arrival_relaxation(self):
        self.t.update_constraints(180, "18:00")
        self.t.propose()
        self.assertIsNone(self.t.pending)
        self.assertEqual("18:00", self.t.constraints["latest_arrival"])

    def test_cancel_and_invalid_values(self):
        before = self.t.snapshot()["plan"]
        self.t.propose()
        self.t.cancel()
        self.assertEqual(before, self.t.plan)
        for budget in (-1, 1001, True, "100"):
            with self.assertRaises(ValueError):
                self.t.update_constraints(budget, "22:00")
        with self.assertRaises(ValueError):
            self.t.update_constraints(100, "29:00")
        with self.assertRaises(ValueError):
            self.t.confirm("anything", False)

    def test_repair_without_changes_has_no_confirmation(self):
        p = self.t.propose()["pending"]
        self.t.confirm(p["id"], True)
        result = self.t.propose()
        self.assertIsNone(result["pending"])
        self.assertIn("No changes to confirm", result["message"])
        self.assertEqual(1, len(self.t.history))

    def test_repeated_fare_event_preserves_current_preview(self):
        self.t.event("fare")
        pending = self.t.propose()["pending"]
        revision = self.t.revision
        result = self.t.event("fare")
        self.assertEqual(revision, result["revision"])
        self.assertEqual(pending["id"], result["pending"]["id"])
        self.assertIn("No new price change", result["message"])

    def test_repair_after_confirmation_failure_retry_and_undo(self):
        first = self.t.propose()["pending"]
        self.t.confirm(first["id"], True)
        saved = self.t.snapshot()["plan"]
        self.t.update_constraints(180, "19:00")
        second = self.t.propose()["pending"]
        self.assertIn("TF204", second["plan"]["transport"])
        self.assertEqual(170, second["plan"]["extra_cost"])
        self.assertEqual("18:55", second["plan"]["arrival"])
        self.assertEqual(saved["activity"], second["plan"]["activity"])
        self.assertEqual({"transport", "arrival", "extra_cost"},
                         {c["field"] for c in second["changes"]})
        self.t.event("failure")
        failed = self.t.confirm(second["id"], True)
        self.assertEqual(saved, failed["plan"])
        retry = self.t.propose()["pending"]
        success = self.t.confirm(retry["id"], True)
        self.assertNotIn("activity", success["message"])
        self.assertEqual(170, success["plan"]["extra_cost"])
        restored = self.t.undo()
        self.assertEqual(saved, restored["plan"])
        self.assertEqual("19:00", restored["constraints"]["latest_arrival"])
        self.assertIn("Review it against", restored["message"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
