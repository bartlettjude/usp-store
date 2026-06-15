#!/usr/bin/env python3
"""Full-site crawler for unionstagepresents.com — saves HTML + extracts structured data."""
import os, re, json, subprocess, html as htmlmod
from urllib.parse import urljoin, urlparse

BASE = "https://www.unionstagepresents.com"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
ROOT = "/Users/judebartlett/usp-store"
PAGES = f"{ROOT}/raw/pages"
os.makedirs(PAGES, exist_ok=True)

def fetch(url):
    try:
        r = subprocess.run(["curl","-sL","--max-time","30","-A",UA,url],
                           capture_output=True, text=True)
        return r.stdout
    except Exception as e:
        return ""

def safe_name(path):
    p = path.strip("/").replace("/","__") or "index"
    p = re.sub(r'[^a-zA-Z0-9_.-]', "-", p)
    return p[:150] + ".html"

def internal_links(html, base_url):
    links = set()
    for m in re.finditer(r'href="([^"#?]+)', html):
        href = m.group(1)
        if href.startswith(("mailto:","tel:","javascript:")): continue
        full = urljoin(base_url, href)
        u = urlparse(full)
        if u.netloc not in ("www.unionstagepresents.com","unionstagepresents.com"): continue
        if re.search(r'\.(css|js|png|jpe?g|svg|webp|gif|ico|woff2?|pdf|xml|json)$', u.path, re.I): continue
        links.add(u.path.rstrip("/") or "/")
    return links

def extract_meta(html):
    meta = {}
    # title
    t = re.search(r'<title>([^<]*)</title>', html)
    if t: meta["title"] = htmlmod.unescape(t.group(1).strip())
    # OG / twitter tags
    og = {}
    for m in re.finditer(r'<meta[^>]+(?:property|name)="((?:og|twitter):[^"]+)"[^>]+content="([^"]*)"', html):
        og[m.group(1)] = htmlmod.unescape(m.group(2))
    if og: meta["og"] = og
    desc = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', html)
    if desc: meta["description"] = htmlmod.unescape(desc.group(1))
    # JSON-LD
    lds = []
    for m in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try: lds.append(json.loads(m.group(1).strip()))
        except Exception: lds.append({"_raw_parse_failed": m.group(1)[:500]})
    if lds: meta["jsonld"] = lds
    return meta

# ---- seed frontier ----
seeds = ["/", "/about","/contact","/private-events","/careers","/faqs",
         "/accessibility","/privacy","/terms"]
venues = ["union-stage","the-howard","pearl-street","jammin-java",
          "miracle-theatre","capital-turnaround","nationals-park"]
for v in venues:
    for sub in ["shows","private-events","getting-here","food-drink","our-story"]:
        seeds.append(f"/{v}/{sub}")

frontier = list(dict.fromkeys(seeds))
visited = set()
manifest = {}
MAX = 400

while frontier and len(visited) < MAX:
    path = frontier.pop(0)
    if path in visited: continue
    visited.add(path)
    url = BASE + path
    html = fetch(url)
    status = "ok" if html and "<html" in html.lower() else "empty"
    if not html:
        manifest[path] = {"status":"fetch_failed"}; continue
    # save
    fn = safe_name(path)
    with open(f"{PAGES}/{fn}","w") as f: f.write(html)
    meta = extract_meta(html)
    meta["status"] = status
    meta["bytes"] = len(html)
    meta["file"] = f"raw/pages/{fn}"
    manifest[path] = meta
    # discover new links
    for l in internal_links(html, url):
        if l not in visited and l not in frontier:
            frontier.append(l)
    print(f"[{len(visited):3d}] {status:6s} {len(html):>7d}b  {path}")

with open(f"{ROOT}/raw/crawl-manifest.json","w") as f:
    json.dump(manifest, f, indent=2)

print(f"\nCrawled {len(visited)} pages. Manifest -> raw/crawl-manifest.json")
print(f"Pages with JSON-LD: {sum(1 for m in manifest.values() if 'jsonld' in m)}")
print(f"Pages with OG tags: {sum(1 for m in manifest.values() if 'og' in m)}")
