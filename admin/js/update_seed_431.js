// 为产品431添加完整字段示例
var fs = require('fs');
var path = require('path');

var seedFile = path.join(__dirname, 'seed_data.js');
var content = fs.readFileSync(seedFile, 'utf8');

// 找到产品431并更新
var newContent = content.replace(
  /"i_id":\s*431[^}]*"addtime":"[^"]*"/,
  '"i_id": 431, "title": "BOPP color printed film", "sub_title": "彩色印刷BOPP薄膜", "pic": "../upload/image/20211220/20211220211501_55505.jpg", "code": "BOPP-CP-2024", "price": "$1500/ton", "content": "<p>BOPP color printed film</p><p>彩色印刷BOPP薄膜</p>", "tech_params": "<table><tr><td>厚度</td><td>20-40UM</td></tr><tr><td>宽度</td><td>350-1000MM</td></tr></table>", "helpful_links": "<a href=\"../contact.html\">联系我们</a>", "album": ["../upload/image/20211220/20211220211501_55505.jpg"], "seo_title": "BOPP Color Printed Film - Asia Pacific Industry", "seo_keywords": "BOPP, color printed film, printing film", "seo_description": "High quality BOPP color printed film for packaging", "addtime": "2026-09-07 10:00:00"'
);

if (newContent !== content) {
  fs.writeFileSync(seedFile, newContent, 'utf8');
  console.log('Product 431 updated with complete fields');
} else {
  console.log('Product 431 not found or already up to date');
}
