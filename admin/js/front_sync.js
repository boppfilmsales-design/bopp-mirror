/* 前端同步：读取后台 localStorage 数据覆盖当前 product/N.html 内容 */
(function(){
	function onReady(){
		var path=location.pathname;
		var m=path.match(/\/(\d+)\.html$/);
		if(!m) return;
		var iid=parseInt(m[1],10);
		var item=null;
		try{
			var all=JSON.parse(localStorage.getItem('_xgxcms_infos_')||'{}');
			for(var k in all){
				var list=all[k];
				for(var i=0;i<list.length;i++){
					if(parseInt(list[i].i_id,10)===iid){ item=list[i]; }
				}
			}
		}catch(e){}
		if(!item) return;
		var doc=document;
		// 标题：商品页 prd_box h2 / 产线页 article h1 / 新闻页
		if(item.title){
			var t1=doc.querySelector('.prd_box h2');
			if(t1) t1.textContent=item.title;
			var t2=doc.querySelector('.prd_box p');
			if(t2 && item.title) t2.textContent=item.title;
			var t3=doc.querySelector('article.n_article h1');
			if(t3) t3.innerHTML=item.title;
			// related 卡片标题
			doc.querySelectorAll('.f2_box1 h2, .f2_box2 h2').forEach(function(e){ e.textContent=item.title; });
		}
		// 主图
		if(item.pic){
			doc.querySelectorAll('.images-cover img').forEach(function(e){ e.src=item.pic; });
		}
		// 正文
		if(item.content){
			// 商品页 OFFER DETAILS (item3)
			var offer=null;
			doc.querySelectorAll('.menu_drop li').forEach(function(li){
				if(li.className.indexOf('item3')!==-1){ offer=li.querySelector('.menu_drop_nr'); }
			});
			if(offer){ offer.innerHTML=item.content; }
			// 产线/新闻 article 正文
			var art=doc.querySelector('article.n_article div[style*="min-height"]');
			if(art){ art.innerHTML=item.content; }
		}
	}
	if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); }
	else{ onReady(); }
})();
