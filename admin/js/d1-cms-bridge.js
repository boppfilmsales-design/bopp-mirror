// d1-cms-bridge.js - 将 CMS 从 XGXCMS_SEED 切换到 D1 API
// 放在 seed_data.js 之后加载，覆盖 baseInfos 函数

(function(){
    var API_BASE = 'https://bopp-cms-api.boppfilmsales.workers.dev';
    var cache = {};

    // 覆盖 baseInfos 函数，从 API 获取数据
    var originalBaseInfos = CMS.baseInfos;
    CMS.baseInfos = function(cid) {
        // 如果缓存中有数据，直接返回
        if (cache[cid]) {
            return cache[cid].slice();
        }

        // 如果没有 API，尝试使用原来的 XGXCMS_SEED
        if (typeof XGXCMS_SEED !== 'undefined' && XGXCMS_SEED[cid]) {
            cache[cid] = XGXCMS_SEED[cid];
            return cache[cid].slice();
        }

        // 从 API 获取数据
        fetch(API_BASE + '/api/items?c_id=' + cid + '&size=1000')
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success && res.data) {
                    cache[cid] = res.data.map(function(item) {
                        return {
                            i_id: item.i_id,
                            title: item.title,
                            pic: item.pic,
                            content: item.content,
                            addtime: item.addtime
                        };
                    });
                }
            })
            .catch(function(e) {
                console.error('Failed to fetch from D1 API:', e);
            });

        return [];
    };

    // 覆盖 getInfos，添加缓存支持
    var originalGetInfos = CMS.getInfos;
    CMS.getInfos = function(cid) {
        var list = originalGetInfos.call(this, cid);
        // 如果从 API 获取过数据，更新缓存
        if (!cache[cid] && list.length === 0) {
            // 触发异步获取（已经在 baseInfos 中处理）
        }
        return list;
    };

    console.log('D1 CMS Bridge loaded');
})();
