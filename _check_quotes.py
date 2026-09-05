# -*- coding: utf-8 -*-
import re, os, glob, sys, collections
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
os.chdir(r'C:/Users/DELL/Desktop/bopp-mirror')

# 统计 img src="..." 双引号问题 (src="X"" 末尾多一个引号)
pat = re.compile(r'<img[^>]*src="[^"]*""')
cnt = 0; files = 0
for f in glob.glob('**/*.html', recursive=True):
    t = open(f, encoding='utf-8', errors='replace').read()
    n = len(pat.findall(t))
    if n:
        files += 1; cnt += n
print(f"img 双引号问题: {cnt} 处, {files} 个文件")

# href="X"" 双引号
pat2 = re.compile(r'href="[^"]*""')
cnt2 = 0; files2 = 0
for f in glob.glob('**/*.html', recursive=True):
    t = open(f, encoding='utf-8', errors='replace').read()
    n = len(pat2.findall(t))
    if n:
        files2 += 1; cnt2 += n
print(f"href 双引号问题: {cnt2} 处, {files2} 个文件")

# 检查 src="..."" 的样例
sample = None
for f in glob.glob('product/*.html'):
    t = open(f, encoding='utf-8', errors='replace').read()
    m = pat.search(t)
    if m:
        sample = (f, m.group(0)[:80])
        break
print("样例:", sample)
