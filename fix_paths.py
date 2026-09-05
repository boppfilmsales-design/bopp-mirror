import os
import re

replacements = [
    (r"https://www\.boppfilmsales\.com/", "./"),
    (r"http://www\.boppfilmsales\.com/", "./"),
    (r"https://www\.apigcl\.com/", "./"),
    (r"http://www\.apigcl\.com/", "./"),
    (r"src=\"/", "src=\"./"),
    (r"href=\"/", "href=\"./"),
    (r"action=\"/", "action=\"./"),
    (r"data-src=\"/", "data-src=\"./"),
]

html_files = [f for f in os.listdir(".") if f.endswith(".html")]

for file in html_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_content = content
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    if content != original_content:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✓ 已更新: {file}")
    else:
        print(f"⊘ 无需更新: {file}")

print("\n✅ 所有HTML文件处理完成！")
