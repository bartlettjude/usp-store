#!/usr/bin/env python3
"""Classify + download site assets. Theme assets in full; show photos sampled."""
import os, re, subprocess
ROOT="/Users/judebartlett/usp-store"; A=f"{ROOT}/raw/assets"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
for d in ["ui","fonts","js","brand","headers","venues","samples"]:
    os.makedirs(f"{A}/{d}", exist_ok=True)

urls=[u.strip() for u in open("/tmp/all_assets.txt") if u.strip()]
# add typekit font files (woff2 = the 'd' variant) from typekit.css
tk=open(f"{ROOT}/raw/typekit.css").read()
font_urls=sorted(set(re.findall(r'https://use\.typekit\.net/af/[a-z0-9]+/[0-9a-f]+/\d+/d\?[^"\')]+', tk)))

def base(u): return re.sub(r'\?.*$','',u).split("/")[-1]
def dl(u, folder, name=None):
    name=name or base(u) or "file"
    name=re.sub(r'[^a-zA-Z0-9_.-]','-',name)[:120]
    out=f"{A}/{folder}/{name}"
    if os.path.exists(out): return None
    r=subprocess.run(["curl","-sL","--max-time","30","-A",UA,u,"-o",out],capture_output=True)
    return out if os.path.exists(out) and os.path.getsize(out)>0 else None

def is_show_photo(u):
    fn=base(u)
    # webflow id_descriptiveslug ; show photos = hash_hash or *_mv2 jpgs
    if u.endswith((".jpg",".jpeg")): return True
    slug=re.sub(r'^[0-9a-f]{20,}_','',fn)            # strip leading webflow id
    slug=re.sub(r'\.(webp|png)$','',slug)
    slug=re.sub(r'-p-\d+$','',slug)                  # strip resize suffix
    # structural keywords
    kw=("logo","header","bg","ad","cursor","icon","check","sold","last","app","google",
        "play","store","pizza","faq","contact","about","map","pe-","-pe","us-","jj-","ps","th-",
        "mt-","ct-","np-","stage","howard","pearl","jammin","miracle","capital","nationals","plaza")
    s=slug.lower()
    if any(k in s for k in kw): return False
    # purely hashy slug -> show art
    if re.fullmatch(r'[0-9a-f_]+(mv2)?', s): return True
    return False  # default: treat descriptive names as structural

counts={"fonts":0,"js":0,"ui":0,"brand":0,"headers":0,"venues":0,"samples":0,"skipped_show":0}

# fonts
for u in font_urls:
    fid=re.search(r'/af/([a-z0-9]+)/',u).group(1)
    fvd=re.search(r'fvd=([a-z0-9]+)',u); fvd=fvd.group(1) if fvd else "x"
    if dl(u,"fonts",f"lft-etica-mono_{fvd}_{fid}.woff2"): counts["fonts"]+=1

show_photos=[]
for u in urls:
    if u in font_urls: continue
    if u.endswith(".js"):
        if dl(u,"js"): counts["js"]+=1
        continue
    if u.endswith(".svg"):
        if dl(u,"ui"): counts["ui"]+=1
        continue
    if not u.endswith((".webp",".png",".jpg",".jpeg")): continue
    if is_show_photo(u):
        show_photos.append(u); continue
    # structural -> sort by keyword
    fn=base(u).lower()
    folder=("headers" if "header" in fn else
            "venues"  if re.search(r'(us|jj|ps|psw|th|mt|ct|np)[-_]|stage|howard|pearl|jammin|miracle|capital|nationals',fn) else
            "brand")
    if dl(u,folder,base(u)): counts[folder]+=1

# sample 15 show photos (prefer non-resized originals)
seen=set(); sample=[]
for u in show_photos:
    k=re.sub(r'-p-\d+','',base(u))
    if k in seen: continue
    seen.add(k); sample.append(u)
    if len(sample)>=15: break
for u in sample:
    if dl(u,"samples",base(u)): counts["samples"]+=1
counts["skipped_show"]=len(show_photos)-counts["samples"]

# write complete asset manifest
with open(f"{ROOT}/raw/assets-manifest.txt","w") as f:
    f.write("# ALL referenced assets (download any with curl). Theme assets already saved under raw/assets/.\n")
    f.write(f"# Total unique: {len(urls)+len(font_urls)}\n\n")
    f.write("## FONTS (woff2)\n"+"\n".join(font_urls)+"\n\n")
    f.write("## ALL OTHER ASSETS\n"+"\n".join(urls)+"\n")

print("Downloaded:")
for k,v in counts.items(): print(f"  {k:14s} {v}")
