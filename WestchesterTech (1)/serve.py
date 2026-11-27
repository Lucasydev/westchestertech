"""Run the WestchesterTech website on this computer with Python 3."""
from contextlib import closing
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import json
import re
import sqlite3
import sys

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "interests.sqlite3"
ROLES = {"student", "club", "mentor", "sponsor", "hackathon"}
SCHEMA = """CREATE TABLE IF NOT EXISTS interests (
  email TEXT NOT NULL COLLATE NOCASE, role TEXT NOT NULL, name TEXT NOT NULL,
  organization TEXT NOT NULL, message TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (email, role))"""
WRITE = """INSERT INTO interests (email,role,name,organization,message) VALUES(?,?,?,?,?)
  ON CONFLICT(email,role) DO UPDATE SET name=excluded.name, organization=excluded.organization,
  message=excluded.message, updated_at=CURRENT_TIMESTAMP"""


class Site(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "public"), **kwargs)

    def list_directory(self, path):
        self.send_error(404)

    def reply(self, code, data):
        raw = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self):
        if urlsplit(self.path).path != "/api/interests":
            return self.reply(404, {"error": "Page not found."})
        port = self.server.server_port
        hosts = {f"127.0.0.1:{port}", f"localhost:{port}"}
        host = self.headers.get("Host", "")
        if host not in hosts or self.headers.get("Origin") != "http://" + host:
            return self.reply(403, {"error": "Open the form on the WestchesterTech site."})
        if self.headers.get_content_type() != "application/json":
            return self.reply(415, {"error": "Use the interest form to submit."})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 12000:
                return self.reply(413, {"error": "The message is too long."})
            details = json.loads(self.rfile.read(length))
            if not isinstance(details, dict):
                raise ValueError
            fields = [details.get(k, "") for k in ("email", "role", "name", "organization", "message")]
            if any(not isinstance(v, str) for v in fields):
                raise ValueError
            email, role, name, organization, message = [v.strip() for v in fields]
            if role not in ROLES or not name or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
                raise ValueError
            if any(len(v) > n for v, n in zip((name, email, organization, message), (80, 254, 120, 1200))):
                raise ValueError
        except (ValueError, UnicodeError):
            return self.reply(400, {"error": "Check your name, email, and selected role."})
        try:
            with closing(sqlite3.connect(DATA, timeout=8)) as db, db:
                db.execute(WRITE, (email.lower(), role, name, organization, message))
        except sqlite3.Error:
            return self.reply(503, {"error": "Saving is temporarily unavailable. Please retry."})
        self.reply(201, {"ok": True})


if __name__ == "__main__":
    DATA.parent.mkdir(exist_ok=True)
    with closing(sqlite3.connect(DATA)) as db, db:
        db.execute(SCHEMA)
    if len(sys.argv) > 1 and sys.argv[1] == "interests":
        with closing(sqlite3.connect(DATA)) as db:
            db.row_factory = sqlite3.Row
            print(json.dumps([dict(row) for row in db.execute("SELECT * FROM interests ORDER BY updated_at DESC")], indent=2))
    else:
        with ThreadingHTTPServer(("127.0.0.1", 4177), Site) as server:
            print("WestchesterTech is running at http://127.0.0.1:4177", flush=True)
            server.serve_forever()
