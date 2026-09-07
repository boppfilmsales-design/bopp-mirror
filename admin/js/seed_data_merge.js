
/* seed_data_merge.js - 合并 localStorage overrides 到 seed_data.js */
// 使用方法：
// 1. 在浏览器控制台运行：var overrides = JSON.parse(localStorage.getItem('_xgxcms_overrides_') || '{}');
// 2. 然后运行：mergeOverrides(overrides);
// 3. 复制输出的代码到 seed_data.js 末尾

function mergeOverrides(overrides) {
    // 这里会生成合并后的代码
    console.log('// 将以下代码添加到 seed_data.js 末尾：');
    console.log('');
    console.log('var XGXCMS_OVERRIDES = ' + JSON.stringify(overrides, null, 2) + ';');
    console.log('');
    console.log('// 然后修改 front_sync.js 和 page_sync.js，读取 XGXCMS_OVERRIDES');
}
