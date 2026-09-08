// d1-cms.js - D1 数据库 CMS 数据层（替代 localStorage）
// 直接读写 Cloudflare D1 数据库

var D1CMS = (function(){
    var API_BASE = 'https://bopp-cms-api.boppfilmsales.workers.dev';
    var cache = {};
    var loading = {};

    // 初始化：加载所有栏目数据
    function init() {
        return fetch(API_BASE + '/api/categories')
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success && res.data) {
                    var promises = res.data.map(function(cat) {
                        return loadCategory(cat.c_id);
                    });
                    return Promise.all(promises);
                }
                return Promise.resolve();
            })
            .catch(function(e) {
                console.error('D1CMS init failed:', e);
                return Promise.resolve();
            });
    }

    // 加载单个栏目数据
    function loadCategory(cid) {
        if (loading[cid]) return loading[cid];
        if (cache[cid]) return Promise.resolve();

        loading[cid] = fetch(API_BASE + '/api/items?c_id=' + cid + '&size=1000')
            .then(function(r) { return r.json(); })
            .then(function(res) {
                if (res.success && res.data) {
                    cache[cid] = res.data;
                }
                delete loading[cid];
            })
            .catch(function(e) {
                console.error('Failed to load category', cid, e);
                delete loading[cid];
            });

        return loading[cid];
    }

    // 获取栏目所有条目（兼容 CMS.getInfos）
    function getInfos(cid) {
        // 先尝试返回缓存数据
        if (cache[cid]) {
            return cache[cid].slice();
        }
        // 如果没有缓存，尝试加载（异步）
        loadCategory(cid).then(function() {
            if (cache[cid]) {
                // 数据已加载，可以重新渲染（如果页面有渲染函数）
                if (typeof render === 'function') render();
            }
        });
        return [];
    }

    // 获取单个条目
    function getInfo(cid, iid) {
        var list = getInfos(cid);
        for (var i = 0; i < list.length; i++) {
            if (list[i].i_id == iid) {
                return list[i];
            }
        }
        return null;
    }

    // 保存栏目所有条目（使用批量接口）
    function setInfos(cid, list) {
        return fetch(API_BASE + '/api/items/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                c_id: parseInt(cid),
                items: list
            })
        }).then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.success) {
                cache[cid] = list.slice();
                console.log('Saved', res.count, 'items to D1 for category', cid);
                return true;
            }
            throw new Error(res.error || 'Save failed');
        });
    }

    // 添加新条目
    function addInfo(cid, item) {
        return fetch(API_BASE + '/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                c_id: parseInt(cid),
                i_id: item.i_id,
                title: item.title,
                pic: item.pic,
                content: item.content,
                addtime: item.addtime || new Date().toISOString()
            })
        }).then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.success) {
                if (!cache[cid]) cache[cid] = [];
                cache[cid].unshift(res.data);
                return res.data;
            }
            throw new Error(res.error || 'Add failed');
        });
    }

    // 删除条目
    function delInfo(cid, iid) {
        return fetch(API_BASE + '/api/items/' + iid, {
            method: 'DELETE'
        }).then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.success && cache[cid]) {
                cache[cid] = cache[cid].filter(function(x) { return x.i_id != iid; });
            }
            return true;
        });
    }

    // 更新条目
    function updInfo(cid, iid, item) {
        return fetch(API_BASE + '/api/items/' + iid, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                i_id: iid,
                title: item.title,
                pic: item.pic,
                content: item.content,
                addtime: item.addtime || new Date().toISOString()
            })
        }).then(function(r) { return r.json(); })
        .then(function(res) {
            if (res.success && cache[cid]) {
                for (var i = 0; i < cache[cid].length; i++) {
                    if (cache[cid][i].i_id == iid) {
                        cache[cid][i] = Object.assign(cache[cid][i], item);
                        break;
                    }
                }
            }
            return res;
        });
    }

    return {
        init: init,
        getInfos: getInfos,
        getInfo: getInfo,
        setInfos: setInfos,
        addInfo: addInfo,
        delInfo: delInfo,
        updInfo: updInfo,
        cache: cache
    };
})();
