import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from tripfix import TripFix

ROOT = Path(__file__).resolve().parent
PORT = 8772
trip = TripFix()

class Handler(BaseHTTPRequestHandler):
    def reply(self, data, code=200, kind="application/json; charset=utf-8"):
        payload = data if isinstance(data, bytes) else json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == "/state":
            return self.reply(trip.snapshot())
        pages = {"/": ("index.html", "text/html"), "/report": ("report_draft.html", "text/html"),
                 "/architecture.svg": ("architecture.svg", "image/svg+xml")}
        if self.path in pages:
            name, kind = pages[self.path]
            return self.reply((ROOT / name).read_bytes(), kind=kind+"; charset=utf-8")
        self.reply({"error": "Not found"}, 404)

    def do_POST(self):
        if self.headers.get("Origin") not in (None, f"http://127.0.0.1:{PORT}", f"http://localhost:{PORT}"):
            return self.reply({"error": "Unsupported origin"}, 403)
        try:
            size = int(self.headers.get("Content-Length", 0))
            if not 0 < size <= 4096:
                raise ValueError("Invalid request size.")
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError("Expected an object.")
            if self.path == "/propose":
                result = trip.propose()
            elif self.path == "/constraints":
                result = trip.update_constraints(data.get("budget"), data.get("latest_arrival"))
            elif self.path == "/confirm":
                result = trip.confirm(data.get("id"), data.get("confirmed"))
            elif self.path == "/cancel":
                result = trip.cancel()
            elif self.path == "/undo":
                result = trip.undo()
            elif self.path == "/event":
                result = trip.event(data.get("name"))
            elif self.path == "/reset":
                result = trip.reset()
            else:
                return self.reply({"error": "Not found"}, 404)
            self.reply(result)
        except (ValueError, TypeError) as e:
            self.reply({"error": str(e)}, 400)

    def log_message(self, *args):
        pass

if __name__ == "__main__":
    print(f"TripFix: http://127.0.0.1:{PORT}", flush=True)
    HTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
