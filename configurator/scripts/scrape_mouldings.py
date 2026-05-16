import requests
from bs4 import BeautifulSoup
import os
import time

SAVE_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'mouldings')
os.makedirs(SAVE_DIR, exist_ok=True)

# All 161 moulding codes from FRAME_CATALOGUE
product_codes = [
    # ── Everyday ECON (103) ──
    # Black
    "ECON/0008", "ECON/0007", "ECON/0003", "ECON/0006", "ECON/0002",
    "ECON/0005", "ECON/0001", "ECON/0004",
    "ECON/0029", "ECON/0022", "ECON/0017", "ECON/0034", "ECON/0047", "ECON/0049",
    "ECON/0076", "ECON/0073", "ECON/0070", "ECON/0067", "ECON/0086",
    "ECON/0065",
    "0075", "0080", "0080/B", "0354", "0354/B", "0081", "000J/304",
    "000J/2035", "000J/241", "000J/242", "000W/846", "000K/0406",
    "0075/B", "0076", "0349/17", "000S/447/3", "M0093/B",
    # White
    "ECON/0016", "ECON/0015", "ECON/0011", "ECON/0014", "ECON/0010",
    "ECON/0013", "ECON/0009", "ECON/0012",
    "ECON/0033", "ECON/0024", "ECON/0019", "ECON/0035",
    "ECON/0077", "ECON/0074", "ECON/0071", "ECON/0068",
    "ECON/0048", "ECON/0050", "ECON/0064", "ECON/0087",
    # Grey
    "ECON/0046", "ECON/0045", "ECON/0044", "ECON/0043",
    "ECON/0058", "ECON/0057", "ECON/0056", "ECON/0055",
    "ECON/0062", "ECON/0061", "ECON/0060", "ECON/0059",
    "ECON/0080", "ECON/0081",
    # Dark Wood
    "ECON/0032", "ECON/0023", "ECON/0018", "ECON/0038",
    "ECON/0054", "ECON/0053", "ECON/0052", "ECON/0051",
    "ECON/0082", "ECON/0075", "ECON/0072", "ECON/0069",
    # Natural Wood
    "ECON/0031", "ECON/0030", "ECON/0025", "ECON/0026",
    "ECON/0020", "ECON/0021", "ECON/0037", "ECON/0036",
    "ECON/0066", "ECON/0078", "ECON/0079",
    # Cream
    "ECON/0042", "ECON/0041", "ECON/0040", "ECON/0039",
    # Colour
    "ECON/0063", "ECON/0083", "ECON/0084", "ECON/0085",
    # Other
    "M0093",

    # ── Premium (58) ──
    "000J/0082", "000J/0095", "000J/0097", "0001/T", "000K/0890",
    "444343000", "000J/13", "DAN/21",
    "000J/0086", "COSM/0027", "LUNA/0002", "LUNA/0006", "WRAP/20",
    "000J/1064", "000J/10",
    "DECO/0003", "DECO/0001", "DECO/0004", "000K/0678", "ROYAL/0001",
    "ROYAL/0002", "LOUI/0001",
    "5404/6008", "5401/7018", "5403/6018", "000K/0843", "000K/0844",
    "DAB/4", "0135/0001", "0135/0002",
    "0321/1265", "0321/1268", "DAVINCI/0005", "SALZ/0001", "SALZ/0003",
    "PALE/0002", "YORK/0005",
    "DISP/0003", "DISP/0002", "2935/3303", "2935/3301", "COSM/0024",
    "COSM/0025", "COSM/0026",
    "528568000", "000K/0342", "000K/0558", "000K/0758", "YORK/0001",
    "000K/0477", "DISP/0001", "LUNA/0001", "LUNA/0004", "LUNA/0008",
    "REMB/0009", "REMB/0011", "REMB/0013", "REMB/0014",
]

def code_to_filename(code):
    return code.replace('/', '_')

def already_exists(code):
    base = code_to_filename(code)
    for ext in ('.jpg', '.jpeg', '.png', '.webp'):
        if os.path.exists(os.path.join(SAVE_DIR, base + ext)):
            return True
    return False

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

downloaded = 0
skipped = 0
failed = []

for i, code in enumerate(product_codes):
    if already_exists(code):
        print(f"[{i+1}/{len(product_codes)}] SKIP {code} (already exists)")
        skipped += 1
        continue

    search_url = f"https://djsimons.co.uk/?s={code.replace('/', '%2F')}&post_type=product"

    try:
        resp = requests.get(search_url, headers=headers, timeout=15)
        if resp.status_code != 200:
            print(f"[{i+1}/{len(product_codes)}] FAIL {code} (HTTP {resp.status_code})")
            failed.append(code)
            time.sleep(1)
            continue

        soup = BeautifulSoup(resp.text, 'html.parser')

        img_tag = soup.find('img', class_='attachment-woocommerce_thumbnail')
        if not img_tag or 'src' not in img_tag.attrs:
            img_tag = soup.select_one('.products .product img')

        if not img_tag or 'src' not in img_tag.attrs:
            print(f"[{i+1}/{len(product_codes)}] FAIL {code} (no image found)")
            failed.append(code)
            time.sleep(1)
            continue

        img_url = img_tag['src']
        if img_url.startswith('//'):
            img_url = 'https:' + img_url

        # Try to get the full-size image instead of thumbnail
        full_url = img_url.replace('-100x100', '').replace('-300x300', '').replace('-150x150', '').replace('-600x600', '')

        ext = '.jpg'
        for e in ('.png', '.webp', '.jpeg'):
            if e in full_url.lower():
                ext = e
                break

        filename = code_to_filename(code) + ext
        filepath = os.path.join(SAVE_DIR, filename)

        img_resp = requests.get(full_url, headers=headers, timeout=15)
        if img_resp.status_code == 200 and len(img_resp.content) > 500:
            with open(filepath, 'wb') as f:
                f.write(img_resp.content)
            print(f"[{i+1}/{len(product_codes)}] OK   {code} -> {filename} ({len(img_resp.content)} bytes)")
            downloaded += 1
        else:
            # Fall back to thumbnail URL
            img_resp = requests.get(img_url, headers=headers, timeout=15)
            if img_resp.status_code == 200 and len(img_resp.content) > 500:
                with open(filepath, 'wb') as f:
                    f.write(img_resp.content)
                print(f"[{i+1}/{len(product_codes)}] OK   {code} -> {filename} (thumb, {len(img_resp.content)} bytes)")
                downloaded += 1
            else:
                print(f"[{i+1}/{len(product_codes)}] FAIL {code} (download failed)")
                failed.append(code)

    except Exception as e:
        print(f"[{i+1}/{len(product_codes)}] ERR  {code} ({e})")
        failed.append(code)

    time.sleep(1)

print(f"\n{'='*60}")
print(f"Done! Downloaded: {downloaded}, Skipped: {skipped}, Failed: {len(failed)}")
if failed:
    print(f"Failed codes: {', '.join(failed)}")
