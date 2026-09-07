#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动合并 overrides 到 seed_data.js
用法: python merge_overrides.py
"""
import json
import re
import sys
from pathlib import Path

# overrides 数据 (从浏览器导出，替换这里的内容)
OVERRIDES = {}

def merge_overrides():
    """合并 overrides 到 seed_data.js"""
    seed_file = Path('admin/js/seed_data.js')

    if not seed_file.exists():
        print("❌ 找不到 seed_data.js，请确认在项目根目录运行")
        sys.exit(1)

    # 读取 seed_data.js
    content = seed_file.read_text(encoding='utf-8')
    print(f"✅ 读取 seed_data.js ({len(content)} 字节)")

    # 解析 JSON
    match = re.search(r'var XGXCMS_SEED\s*=\s*(\{.*?\})\s*;', content, re.DOTALL)
    if not match:
        print("❌ 无法解析 seed_data.js")
        sys.exit(1)

    print("✅ 解析 seed_data.js 成功")

    # 解析 JSON 数据
    try:
        seed_data = json.loads(match.group(1))
        print(f"✅ 找到 {len(seed_data)} 个栏目")
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失败: {e}")
        sys.exit(1)

    # 合并 overrides
    if not OVERRIDES:
        print("⚠️  OVERRIDES 为空，请从浏览器导出数据并替换脚本中的 OVERRIDES 变量")
        print("\n导出步骤:")
        print("1. 打开后台数据导出工具")
        print("2. 点击'检查数据'")
        print("3. 点击'生成合并脚本'")
        print("4. 下载生成的 Python 脚本并替换本文件的 OVERRIDES 内容")
        sys.exit(0)

    merged_count = 0
    for cid, items in OVERRIDES.items():
        if cid not in seed_data:
            seed_data[cid] = []
            print(f"  + 新增栏目 c_id={cid}")
        for iid, item in items.items():
            if item is None:
                seed_data[cid] = [x for x in seed_data[cid] if str(x.get('i_id')) != iid]
                print(f"  - 删除 c_id={cid}, i_id={iid}")
            else:
                found = False
                for i, existing in enumerate(seed_data[cid]):
                    if str(existing.get('i_id')) == iid:
                        seed_data[cid][i] = item
                        found = True
                        merged_count += 1
                        print(f"  ✓ 更新 c_id={cid}, i_id={iid}, title={item.get('title', '')[:30]}")
                        break
                if not found:
                    seed_data[cid].append(item)
                    merged_count += 1
                    print(f"  + 新增 c_id={cid}, i_id={iid}, title={item.get('title', '')[:30]}")

    # 写回文件
    new_content = content[:match.start(1)] + 'var XGXCMS_SEED = ' + json.dumps(seed_data, ensure_ascii=False, indent=2) + ';' + content[match.end(1):]
    seed_file.write_text(new_content, encoding='utf-8')

    print(f"\n✅ 完成！更新了 {merged_count} 条数据")
    print(f"✅ seed_data.js 已保存到: {seed_file}")
    print("\n下一步: 推送到 GitHub")
    print("  git add -A")
    print('  git commit -m "sync overrides from admin"')
    print("  git push")

if __name__ == '__main__':
    merge_overrides()
