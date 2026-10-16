from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
import json
import re
import time


ROOT = Path(__file__).resolve().parent
NASA_RANDOM_URL = "https://science.nasa.gov/apod/random-apod/"
NASA_IMAGE_PATH = "/content/dam/science/cds/apod/apod/"


class ApodParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.main_depth = 0
        self.title = ""
        self.date = ""
        self.explanation = ""
        self.image_url = ""
        self.in_title = False
        self.in_row = False
        self.in_cell = False
        self.in_paragraph = False
        self.row_cells = []
        self.cell_text = []
        self.paragraph_text = []
        self.title_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main_depth += 1
        if not self.main_depth:
            return
        if tag == "h2" and not self.title:
            self.in_title = True
            self.title_text = []
        elif tag == "tr":
            self.in_row = True
            self.row_cells = []
        elif tag in ("td", "th") and self.in_row:
            self.in_cell = True
            self.cell_text = []
        elif tag == "p":
            self.in_paragraph = True
            self.paragraph_text = []
        elif tag == "img" and not self.image_url:
            source = attrs.get("src", "")
            if NASA_IMAGE_PATH in source and "nasa-logo" not in source.lower():
                self.image_url = source

    def handle_data(self, data):
        if self.in_title:
            self.title_text.append(data)
        if self.in_cell:
            self.cell_text.append(data)
        if self.in_paragraph:
            self.paragraph_text.append(data)

    def handle_endtag(self, tag):
        if tag == "main" and self.main_depth:
            self.main_depth -= 1
        if not self.main_depth and tag != "main":
            return
        if tag == "h2" and self.in_title:
            self.title = " ".join("".join(self.title_text).split())
            self.in_title = False
        elif tag in ("td", "th") and self.in_cell:
            self.row_cells.append(" ".join("".join(self.cell_text).split()))
            self.in_cell = False
        elif tag == "tr" and self.in_row:
            if len(self.row_cells) > 1 and self.row_cells[0].lower() == "date":
                self.date = self.row_cells[1]
            self.in_row = False
        elif tag == "p" and self.in_paragraph:
            text = " ".join("".join(self.paragraph_text).split())
            if text.startswith("Explanation:"):
                self.explanation = re.sub(r"^Explanation:\s*", "", text)
            self.in_paragraph = False


def fetch_random_apod():
    nonce = str(time.time_ns())
    source_url = f"{NASA_RANDOM_URL}?{urlencode({'v': nonce})}"
    request = Request(
        source_url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; LocalAPODViewer/1.0)",
            "Accept": "text/html",
        },
    )
    with urlopen(request, timeout=25) as response:
        document = response.read().decode("utf-8", errors="replace")

    parser = ApodParser()
    parser.feed(document)
    if not all((parser.title, parser.date, parser.explanation, parser.image_url)):
        raise ValueError("NASA returned an APOD page with missing fields")

    return {
        "title": parser.title,
        "date": parser.date,
        "explanation": parser.explanation,
        "imageUrl": parser.image_url,
        "sourceUrl": source_url,
    }


class ApodHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlsplit(self.path).path != "/api/apod":
            return super().do_GET()

        try:
            payload = fetch_random_apod()
            self.send_json(200, payload)
        except (HTTPError, URLError, TimeoutError, ValueError) as error:
            self.send_json(502, {"error": str(error) or "NASA APOD request failed"})

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        origin = self.headers.get("Origin")
        if origin in {"http://127.0.0.1:5500", "http://localhost:5500"}:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), ApodHandler)
    print("APOD viewer running at http://127.0.0.1:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping APOD viewer")
        server.server_close()