/* 数据导出工具 - 从 localStorage 导出数据到 seed_data.js 片段
 * 使用方法：在后台页面打开浏览器控制台，粘贴运行
 */

(function(){
    // 获取所有 overrides
    var overrides = {};
    try {
        overrides = JSON.parse(localStorage.getItem('_xgxcms_overrides_') || '{}');
    } catch(e) {}

    if (!Object.keys(overrides).length) {
        alert('当前浏览器没有保存任何数据，请先在后台编辑并保存内容');
        return;
    }

    // 生成 JSON 片段
    var output = 'var XGXCMS_OVERRIDES = ' + JSON.stringify(overrides, null, 2) + ';';

    // 创建下载链接
    var blob = new Blob([output], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'seed_data_overrides.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 同时复制到剪贴板
    var ta = document.createElement('textarea');
    ta.value = output;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);

    alert('✅ 数据已导出并复制到剪贴板！\n\n下一步：\n1. 打开项目文件夹 admin/js/\n2. 备份当前 seed_data.js\n3. 用导出的数据覆盖 seed_data.js 中的 XGXCMS_SEED 对象\n4. git commit && git push');
})();
