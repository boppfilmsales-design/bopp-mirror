#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动合并 overrides 到 seed_data.js
运行: python merge_overrides.py
"""
import json
import re
import sys
from pathlib import Path

# 设置 UTF-8 输出（解决 Windows GBK 编码问题）
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# overrides 数据 (从浏览器导出)
OVERRIDES = {
  "130": {
    "205": {
      "title": "Near-Edge Wax&resin-ribbon jumbo rolls",
      "sub_title": "",
      "pic": "",
      "code": "",
      "price": "",
      "content": "Near-Edge Wax&resin-ribbon jumbo rolls\nFeature:\nSuperior abrasion resistance\nExtensive label adaptability\nStable quality of product\nLow print energy can extend the life of protect print head.\nAnti-static back coating can protectprint head effectively.\nTechnical parameters:\nTest Item:\tUnit\tTest equipment\tStandard\nTotal thickness:\tum\tThickness tester\t6.8+_0.3\nInk thickness\tum\tThickness tester\t1.0+_0.3\nElectrostatic\tKv\tSiatic Tester\t<=0.15\nOptical density\tD\tTransmission Type Density Spectrometer\t>=1.2\nColor density\nDB Reflex density spectrometer >=2.4\nApplication Field:\nLogistical Label,Medical label,retail tag,shelf and bin label,automotive label,\nBiochemical label,blood label,hang tag.packing label,train tickets.\nShipping& Receiving label.\nIntroduction:\nThe advanced coating technology of new generation wax/resin makes the products have the superior heat resistance,abrasion resistance,anti-static function,high stability and low noise in the printing process, have the good print quality and the better label adaptability by using the high property printer and the simplified tabletop printer,it is suitable for many different types of label stocks. the color density can be up to 2.7DB.\nPrint material:\nRecommended substrates;\nArt paper, coated paper, uncoated paper, glossy& semi glossy paper, hangtag, synthetic paper, film(PET,PP,PVC)\n",
      "tech_params": "",
      "helpful_links": "",
      "seo_title": "Near-Edge Wax&resin-ribbon jumbo rolls",
      "seo_keywords": "Near-Edge Wax&resin-ribbon jumbo rolls",
      "seo_description": "Near-Edge Wax&resin-ribbon jumbo rolls",
      "addtime": "2026-09-07 13:43:47"
    }
  }
}

def merge_overrides():
    """合并 overrides 到 seed_data.js"""
    seed_file = Path('admin/js/seed_data.js')

    if not seed_file.exists():
        print("ERROR: Cannot find seed_data.js")
        sys.exit(1)

    content = seed_file.read_text(encoding='utf-8')
    print(f"[OK] Read seed_data.js ({len(content)} bytes)")

    match = re.search(r'var XGXCMS_SEED\s*=\s*(\{[\s\S]*?\})\s*;', content)
    if not match:
        print("ERROR: Cannot parse seed_data.js")
        sys.exit(1)

    print("[OK] Parsed seed_data.js")

    try:
        seed_data = json.loads(match.group(1))
        print(f"[OK] Found {len(seed_data)} columns")
    except json.JSONDecodeError as e:
        print(f"ERROR: JSON parse failed: {e}")
        sys.exit(1)

    if not OVERRIDES:
        print("WARNING: OVERRIDES is empty")
        sys.exit(0)

    merged_count = 0
    for cid, items in OVERRIDES.items():
        if cid not in seed_data:
            seed_data[cid] = []
            print(f"  + Added column c_id={cid}")
        for iid, item in items.items():
            if item is None:
                seed_data[cid] = [x for x in seed_data[cid] if str(x.get('i_id')) != iid]
                print(f"  - Deleted c_id={cid}, i_id={iid}")
            else:
                found = False
                for i, existing in enumerate(seed_data[cid]):
                    if str(existing.get('i_id')) == iid:
                        seed_data[cid][i] = item
                        found = True
                        merged_count += 1
                        print(f"  [OK] Updated c_id={cid}, i_id={iid}")
                        break
                if not found:
                    seed_data[cid].append(item)
                    merged_count += 1
                    print(f"  + Added c_id={cid}, i_id={iid}")

    new_content = content[:match.start(1)] + 'var XGXCMS_SEED = ' + json.dumps(seed_data, ensure_ascii=False, indent=2) + ';' + content[match.end(1):]
    seed_file.write_text(new_content, encoding='utf-8')

    print(f"\n[OK] Done! Updated {merged_count} items")
    print("Next step: git push")

if __name__ == '__main__':
    merge_overrides()
