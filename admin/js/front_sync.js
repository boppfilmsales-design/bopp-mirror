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

		// 1. 标题同步
		if(item.title){
			var t1=doc.querySelector('.prd_box h2');
			if(t1) t1.textContent=item.title;
			var t2=doc.querySelector('.prd_box p');
			if(t2) t2.textContent=item.title;
			var t3=doc.querySelector('article.n_article h1');
			if(t3) t3.innerHTML=item.title;
			// SEO title
			if(item.seo_title){
				var st=doc.querySelector('title');
				if(st) st.textContent=item.seo_title;
			}
		}

		// 2. 副标题
		if(item.sub_title){
			var subEl=doc.querySelector('.prd_sub_title');
			if(!subEl){
				subEl=doc.createElement('p');
				subEl.className='prd_sub_title';
				subEl.style.cssText='color:#666;font-size:14px;margin:5px 0;';
				var h2=doc.querySelector('.prd_box h2');
				if(h2) h2.parentNode.insertBefore(subEl, h2.nextSibling);
			}
			subEl.textContent=item.sub_title;
		}

		// 3. 封面图片
		if(item.pic){
			doc.querySelectorAll('.images-cover img').forEach(function(e){ e.src=item.pic; });
			// 更新主图
			var mainImg=doc.querySelector('.prd_box img, .product-main img, .main-image img');
			if(mainImg) mainImg.src=item.pic;
		}

		// 4. 产品编号
		if(item.code){
			var codeSpan=doc.querySelector('.prd_box_inf dd span');
			if(codeSpan) codeSpan.textContent=item.code;
		}

		// 5. 价格
		if(item.price){
			var priceDd=doc.querySelector('.prd_box_inf dd:nth-of-type(2)');
			if(priceDd) priceDd.innerHTML='Wholesale price: <strong>'+item.price+'</strong>';
		}

		// 6. 详细内容
		if(item.content){
			var offer=null;
			doc.querySelectorAll('.menu_drop li').forEach(function(li){
				if(li.className.indexOf('item1')!==-1 || li.className.indexOf('item3')!==-1){
					offer=li.querySelector('.menu_drop_nr');
				}
			});
			if(offer){ offer.innerHTML=item.content; }
			var art=doc.querySelector('article.n_article div[style*="min-height"]');
			if(art){ art.innerHTML=item.content; }
			// 如果内容在 main content 区域
			var mainContent=doc.querySelector('.product-content, .main-content, #content');
			if(mainContent && mainContent.innerHTML.trim()==='') mainContent.innerHTML=item.content;
		}

		// 7. 技术参数
		if(item.tech_params){
			var techSection=doc.querySelector('.tech-params, #tech_params, .product-specs');
			if(techSection){
				techSection.innerHTML=item.tech_params;
				techSection.style.display='block';
			}else{
				// 动态创建技术参数区域
				var techDiv=doc.createElement('div');
				techDiv.className='tech-params';
				techDiv.style.cssText='margin:20px 0;padding:15px;background:#f9f9f9;border-left:4px solid #009688;';
				techDiv.innerHTML='<h3 style="margin:0 0 10px 0;color:#333;">TECHNICAL PARAMETERS</h3>'+item.tech_params;
				var contentArea=doc.querySelector('.prdcenter, .main-content, article');
				if(contentArea) contentArea.appendChild(techDiv);
			}
		}

		// 8. 帮助链接
		if(item.helpful_links){
			var linkSection=doc.querySelector('.helpful-links, #helpful_links, .prd_box_lk');
			if(linkSection){
				if(linkSection.tagName==='DL'){
					// 如果是 dl，追加新的 dd
					var newDd=doc.createElement('dd');
					newDd.innerHTML=item.helpful_links;
					linkSection.appendChild(newDd);
				}else{
					linkSection.innerHTML=item.helpful_links;
				}
			}
		}

		// 9. 相册
		if(item.album && item.album.length>0){
			var albumSection=doc.querySelector('.album, #album, .product-gallery');
			if(albumSection){
				albumSection.innerHTML='';
				item.album.forEach(function(imgSrc){
					var img=doc.createElement('img');
					img.src=imgSrc;
					img.style.cssText='max-width:200px;margin:5px;border:1px solid #ddd;';
					albumSection.appendChild(img);
				});
			}
		}

		// 10. SEO 元数据
		if(item.seo_keywords || item.seo_description){
			if(item.seo_keywords){
				var kwMeta=doc.querySelector('meta[name="keywords"]');
				if(kwMeta) kwMeta.setAttribute('content',item.seo_keywords);
			}
			if(item.seo_description){
				var descMeta=doc.querySelector('meta[name="description"]');
				if(descMeta) descMeta.setAttribute('content',item.seo_description);
			}
		}
	}
	if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); }
	else{ onReady(); }
})();
