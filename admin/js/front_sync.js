/* 前端同步：读取后台数据（基础+覆盖）覆盖当前 product/N.html 内容 */
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
		var path=location.pathname;
		var m=path.match(/\/(\d+)\.html$/);
		if(!m) return;
		var iid=parseInt(m[1],10);
		var item=getItemByIid(iid);
		if(!item) return;
		var doc=document;
		if(item.title){
			var t1=doc.querySelector('.prd_box h2');
			if(t1) t1.textContent=item.title;
			var t2=doc.querySelector('.prd_box p');
			if(t2) t2.textContent=item.title;
			var t3=doc.querySelector('article.n_article h1');
			if(t3) t3.innerHTML=item.title;
		}
		if(item.pic){
			doc.querySelectorAll('.images-cover img').forEach(function(e){ e.src=item.pic; });
		}
		if(item.content){
			var offer=null;
			doc.querySelectorAll('.menu_drop li').forEach(function(li){
				if(li.className.indexOf('item3')!==-1){ offer=li.querySelector('.menu_drop_nr'); }
			});
			if(offer){ offer.innerHTML=item.content; }
			var art=doc.querySelector('article.n_article div[style*="min-height"]');
			if(art){ art.innerHTML=item.content; }
		}
	}
	if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); }
	else{ onReady(); }
})();
