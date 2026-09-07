/* 前端同步：静态内容页(about 类) —— 读取后台"基础+覆盖"数据覆盖当前页标题/正文
 * 用法：页面 <html data-cms="i_id">，并引入 seed_data.js 后再引入本脚本。
 * 选择器针对 about 类页：article.n_article h1（标题）、article.ar_article > div[style*="min-height"]（正文）
 */
(function(){
	function getItemByIid(iid){
		var ov=null;
		try{ ov=JSON.parse(localStorage.getItem('_xgxcms_overrides_')||'{}'); }catch(e){}
		if(ov){
			for(var cid in ov){
				var ovc=ov[cid];
				for(var ii in ovc){
					if(ovc[ii]!==null && parseInt(ii,10)===iid){ return ovc[ii]; }
				}
			}
		}
		// 基础数据
		if(typeof XGXCMS_SEED!=='undefined'){
			for(var k in XGXCMS_SEED){
				var list=XGXCMS_SEED[k];
				for(var i=0;i<list.length;i++){
					if(parseInt(list[i].i_id,10)===iid){ return list[i]; }
				}
			}
		}
		return null;
	}
	function onReady(){
		var root=document.documentElement;
		var iid=parseInt(root.getAttribute('data-cms')||'',10);
		if(!iid) return;
		var item=getItemByIid(iid);
		if(!item) return;
		if(item.title){
			var h=document.querySelector('article.n_article h1');
			if(h) h.innerHTML=item.title;
		}
		if(item.content){
			var b=document.querySelector('article.ar_article > div[style*="min-height"]');
			if(b) b.innerHTML=item.content;
		}
	}
	if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); }
	else{ onReady(); }
})();
