#!/usr/bin/env python3
"""Extract text from a PDF with zero external deps (zlib only).
Decompresses FlateDecode content streams and pulls text-showing operators."""
import re, zlib, sys

path = sys.argv[1] if len(sys.argv) > 1 else "brand/brandbook.pdf"
data = open(path, "rb").read()

# pull every stream ... endstream blob (handles \r, \n, \r\n)
streams = re.findall(rb"stream\r?\n?(.*?)\r?\n?endstream", data, re.S)
print(f"# streams found: {len(streams)}", file=sys.stderr)

def decode_text(content):
    out = []
    # ( ... ) Tj   and   [ (..) .. (..) ] TJ
    # handle escaped parens
    for m in re.finditer(rb"\((?:\\.|[^\\()])*\)\s*Tj", content):
        out.append(unescape(m.group(0)))
    for m in re.finditer(rb"\[(.*?)\]\s*TJ", content, re.S):
        parts = re.findall(rb"\((?:\\.|[^\\()])*\)", m.group(1))
        out.append(b"".join(parts))
    return out

def unescape(b):
    b = re.sub(rb"^\(|\)\s*Tj$", b"", b)
    return b

texts = []
for s in streams:
    blob = s
    try:
        blob = zlib.decompress(s)
    except Exception:
        pass
    if b"Tj" in blob or b"TJ" in blob:
        for t in decode_text(blob):
            try:
                txt = t.decode("latin-1")
            except Exception:
                continue
            # unescape pdf string escapes
            txt = (txt.replace("\\(", "(").replace("\\)", ")")
                      .replace("\\\\", "\\").replace("\\n", "\n")
                      .replace("\\r", "").replace("\\t", "\t"))
            txt = re.sub(r"\\[0-9]{3}", " ", txt)
            if txt.strip():
                texts.append(txt.strip())

joined = "\n".join(texts)
print(joined)
print(f"\n# total text fragments: {len(texts)}", file=sys.stderr)
