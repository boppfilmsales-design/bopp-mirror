# -*- coding: utf-8 -*-
"""一次性转换脚本：把 Product Lines 详情页/分类页从源站文章布局搬入本地静态站外壳。
EN 详情 10 + CH 详情 12 + CH 分类 10。用后删除。"""
import re, os, sys

LOCAL = r"C:\Users\DELL\Desktop\bopp-mirror"
SRC_DIR = r"C:\Users\DELL\AppData\Local\Temp"   # /tmp -> Windows TEMP

def localize_upload(url, rel_prefix):
    m = re.search(r'(?:ch/)?upload/image/(\d{8})/([^"\'?#]+\.(?:jpg|jpeg|png|gif))', url, re.I)
    if not m:
        return url
    date, basename = m.group(1), m.group(2)
    flat = os.path.join(LOCAL, "upload", "image", basename)
    sub = os.path.join(LOCAL, "upload", "image", date, basename)
    if os.path.exists(flat):
        return f"{rel_prefix}/image/{basename}"
    if os.path.exists(sub):
        return f"{rel_prefix}/image/{date}/{basename}"
    print(f"  !! MISSING 图: {url}")
    return f"{rel_prefix}/image/{date}/{basename}"

def localize_href(url, rel_prefix):
    if url.startswith(("http://", "https://", "javascript:", "skype:", "mailto:", "#", "data:")):
        return url
    if "index.php" in url:
        return rel_prefix + "/../index.html"
    print(f"  !! 未处理站内链接: {url}")
    return url

def extract_article(src_text, rel_prefix):
    """从源站详情抓取件提取 article（h1+Time+body div），只本地化 block 内的 img/a。"""
    a = src_text.index('<article class="n_article">')
    h1s = src_text.index('<h1', a)
    h1e = src_text.index('</h1>', h1s) + len('</h1>')
    # Time div
    ts = src_text.index('Time', h1e)
    td_start = src_text.rindex('<div', 0, ts)
    td_end = src_text.index('</div>', td_start) + len('</div>')
    # body div: min-height 行所在 <div 起 → 首个 </div>（正文不嵌套 div，已核实）
    bm = src_text.index('style="min-height:500px', td_end)
    bd_start = src_text.rindex('<div', 0, bm)
    bd_close = src_text.index('</div>', bd_start)
    inner = src_text[bd_start:bd_close]                  # 不含闭合 </div>
    # 断言仅针对"去掉边界开标签"的正文：开标签本身含 <div（rel 0），故检查 rel>0 部分
    inner_body = inner[len('<div'):]
    if '<div' in inner_body or '</div>' in inner_body:   # 只有真嵌套才截断报错
        print(f"  !! 正文含嵌套 div，需人工检查"); sys.exit(1)
    body = src_text[bd_start:bd_close + len('</div>')]
    # 只替换 block 内 img/a
    body = re.sub(r'(<img[^>]*\bsrc=")([^"]*)(")', lambda mm: mm.group(1)+localize_upload(mm.group(2), rel_prefix)+mm.group(3), body)
    body = re.sub(r'(<a[^>]*\bhref=")([^"]*)(")', lambda mm: mm.group(1)+localize_href(mm.group(2), rel_prefix)+mm.group(3), body)
    return src_text[h1s:h1e] + "\n" + src_text[td_start:td_end] + "\n" + body

def rebuild(product_file, src_file, rel_prefix, url_new_value=None):
    print(f"[rebuild] {product_file}  <- {os.path.basename(src_file)}")
    txt = open(product_file, encoding='utf-8').read()
    src = open(src_file, encoding='utf-8').read()
    art = extract_article(src, rel_prefix)
    a = txt.index('<section id="n_un_box">')
    b = txt.index('</section>', a) + len('</section>')
    new = '<section id="n_un_box">\n<div class="n_content w1200">\n<article class="n_article">\n' + art + '\n</article>\n</div>\n</section>'
    txt = txt[:a] + new + txt[b:]
    if url_new_value:
        txt = re.sub(r'(<input id="url"[^>]*value=")[^"]*(")', r'\g<1>'+url_new_value+r'\2', txt)
    open(product_file, 'w', encoding='utf-8', newline='').write(txt)

def rebuild_category(ch_cat_file, src_pl_file, rel_prefix, c_id):
    print(f"[rebuild_category] {ch_cat_file}  <- {os.path.basename(src_pl_file)}")
    txt = open(ch_cat_file, encoding='utf-8').read()
    src = open(src_pl_file, encoding='utf-8').read()
    # 提取 n_article>h1
    h1s = src.index('<h1')
    h1e = src.index('</h1>', h1s) + len('</h1>')
    h1 = src[h1s:h1e]
    # 提取 ar_article（含 tab + pr_lines 卡片块）
    aa = src.index('<article class="ar_article">')
    aa_end = src.index('</article>', aa) + len('</article>')
    art = src[aa:aa_end]
    # tab href 本地化: product_lines.php?c_id=N -> ../../category/N.html
    art = re.sub(r'(href=")product_lines\.php\?c_id=(\d+)([^"]*")', lambda mm: f'{mm.group(1)}../../category/{mm.group(2)}.html{mm.group(3)}', art)
    # 卡片链接: product_lines_show.php?c_id=N&i_id=M -> ../../product/M.html
    art = re.sub(r'(href=")product_lines_show\.php\?c_id=\d+&i_id=(\d+)([^"]*")', lambda mm: f'{mm.group(1)}../../product/{mm.group(2)}.html{mm.group(3)}', art)
    # 卡片图与 images/xx.png localize（xx/zy.png 本地相对 ch/category: ../../images/）
    art = re.sub(r'src="images/(xx|zy)\.png"', r'src="../../images/\1.png"', art)
    art = re.sub(r'(<img[^>]*\bsrc=")([^"]*)(")', lambda mm: mm.group(1)+localize_upload(mm.group(2), rel_prefix)+mm.group(3), art)
    art = re.sub(r'(<a[^>]*\bhref=")([^"]*)(")', lambda mm: mm.group(1)+localize_href(mm.group(2), rel_prefix)+mm.group(3), art)
    new = ('<section id="n_un_box">\n<div class="n_content w1200">\n'
           '<article class="n_article">\n' + h1 + '\n</article>\n'
           + art + '\n</div>\n</section>')
    a = txt.index('<section id="n_un_box">')
    b = txt.index('</section>', a) + len('</section>')
    txt = txt[:a] + new + txt[b:]
    # 面包屑 position：首页/生产线
    txt = re.sub(r'<div id="position">.*?</div>', '<div id="position"> <a href="../../index.html" title="">首页</a> <i>/</i> <a href="../../product_lines.html">生产线</a></div>', txt, count=1, flags=re.S)
    open(ch_cat_file, 'w', encoding='utf-8', newline='').write(txt)

if __name__ == '__main__':
    EN = [90,158,161,173,174,250,251,275,337,338]
    CH = [90,158,161,173,174,250,251,275,337,338,343,344]
    CH_CATS = [45,142,143,144,149,164,165,167,176,177]
    url_new = {158:'product/158.html', 337:'product/173.html', 338:'product/174.html'}

    for i in EN:
        rebuild(f"{LOCAL}/product/{i}.html", f"{SRC_DIR}/src_show_{i}.html", "../upload", url_new.get(i))
    for i in CH:
        rebuild(f"{LOCAL}/ch/product/{i}.html", f"{SRC_DIR}/ch_src_{i}.html", "../../upload", url_new.get(i))
    for c in CH_CATS:
        rebuild_category(f"{LOCAL}/ch/category/{c}.html", f"{SRC_DIR}/ch_pl_{c}.html", "../../upload", c)
    print("DONE")
