// 全局方法
var pop_fashion_global = {
	fn: {

		/*-------------------window.location-------------------*/
		getLocationParameter: function () {              // 获取浏览器参数
			var url = location.search; //获取url中"?"符后的字串 
			var theRequest = {};
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			return theRequest;
		},
		textSize: function (cssList, text) {               // 通过元素获取文字宽高
			var a = pop_fashion_global.fn;
			var span = document.createElement("span");
			var result = {};
			result.width = span.offsetWidth;
			result.height = span.offsetWidth;
			span.style.visibility = "hidden";
			span.style.cssText = "font-size:14px;line-height:1em;display:inline;padding:0;margin:0;border:none;letter-spacing:0px";
			span.style.fontSize = cssList["fontsize"] !== undefined ? cssList["fontsize"] + "px" : "14px";
			span.style.lineHeight = cssList["lineheight"] !== undefined ? cssList["lineheight"] : "1em";
			document.body.appendChild(span);
			if (typeof span.textContent != "undefined") { span.textContent = text; } else { span.innerText = text; }
			result.width = span.offsetWidth - result.width;
			result.height = span.offsetHeight - result.height;
			span.parentNode.removeChild(span);
			return result.width;
		},
		cutByWidth: function (str, wid, fontSize) {               //通过宽度截取字符串
			var a = pop_fashion_global.fn, nstr = "";
			if (typeof str === "string" && wid > 0) {
				var nfs = fontSize !== undefined ? fontSize : 14;
				nstr = str, limit_val = wid, is_length = false;
				recursionFunc(nstr);
				function recursionFunc(keys) {
					var nw = a.textSize({
						"fontSize": nfs
					}, keys);
					if (nw > limit_val) {
						is_length = true;
						var nkey = keys.substr(0, keys.length - 1);
						arguments.callee(nkey);
					} else {
						if (is_length === true) {
							nstr = keys + "...";
						} else {
							nstr = keys;
						}
						return keys;
					}
				}
			}
			return nstr;
		},
		/*----------------浏览器存储-----------------*/
		getSto: function (key_name) {                  //获取本地存储
			var a = pop_fashion_global.fn;
			if (window.localStorage) {
				// 支持localStorage
				var val = localStorage.getItem(key_name);
				if (val === "undefined") {
					return "undefined";
				} else if (typeof val === "number") {
					return val;
				} else if (val) {
					return JSON.parse(val) ? JSON.parse(val) : "";
				}
			} else {
				// 用cookie
				return JSON.parse(a.getCookie(key_name)) ? JSON.parse(a.getCookie(key_name)) : "";
			}
		},
		setSto: function (key_name, data) {                 // 存储本地
			var a = pop_fashion_global.fn;
			if (window.localStorage) {
				localStorage.setItem(key_name, JSON.stringify(data));
			} else {
				a.setCookie(key_name, JSON.stringify(data), 10000);
			}
		},
		delSto: function (key_name) {                  // 删除本地存储
			var a = pop_fashion_global.fn;
			if (window.localStorage) {
				if (localStorage.getItem(key_name)) {
					localStorage.removeItem(key_name);
				}
			} else {
				if (a.getCookie(key_name)) {
					a.setCookie(key_name, "", -1);
				}
			}
		},
		setCookie: function (name, value, Days) {        // 设置cookie
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);    //设置过期时间
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
		},
		getCookie: function (name) {  //获取cookie
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		},
		/*----------------------------事件相关-----------------------------*/
		stopBubble: function (ev) {            // 阻止事件冒泡
			var e = ev || window.event;
			if (e && e.stopPropagation) {
				e.stopPropagation();
			} else {
				window.event.cancelBubble = true;
			}
			return false;
		},
		subAjax: function (options) {                  //jquery  ajax封装
			var opt = {
				"url": "",
				"ctp": "",
				"data": {},
				"successFunc": null,
				"errorFunc": null,
				"isError": true,
				"header": null,
				"code": "code",          //状态字段名称  默认为code
				"code_value": 0,         //请求成功码  默认为0
				"message": "message"     //请求失败话术字段名  默认为message
			};
			opt["url"] = options["url"] ? options["url"] : "";
			opt["data"] = options["data"] ? options["data"] : {};
			opt["ctp"] = options["ctp"] ? options["ctp"] : "application/json";
			opt["successFunc"] = options["successFunc"] ? options["successFunc"] : null;
			opt["errorFunc"] = options["errorFunc"] ? options["errorFunc"] : null;
			opt["isError"] = options["isError"] !== undefined ? options["isError"] : false;
			opt["code"] = options["code"] ? options["code"] : "code";
			opt["code_value"] = options["code_value"] !== undefined ? options["code_value"] : 0;
			opt["message"] = options["message"] !== undefined ? options["message"] : "message";
			if (typeof options["header"] != "undefined") {
				opt["header"] = options["header"];
			} else {
	            /*这里设置默认头部
	            opt["header"]={
	                
	            };*/
			}
			$.ajax({
				headers: opt["header"],
				type: "POST",
				url: opt["url"],
				data: opt["data"],
				timeout: 20000,
				dataType: "json",
				contentType: opt["ctp"],
				success: function (data) {
					if (data[opt["code"]] === opt["code_value"]) {
						if (opt.successFunc && opt.successFunc instanceof Function) {
							opt.successFunc(data);
						}
					} else {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							opt.errorFunc(data);
						}
						if (opt["isError"] === true) {
							oCommon.noPower('', data[opt["message"]]);
						}
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {

					if (opt["isError"] === true) {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							oCommon.noPower('', "网络似乎出现了错误，请稍后重试。");
						} else {
							oCommon.noPower('', "网络似乎出现了错误，请稍后重试。");
						}
					} else {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							opt.errorFunc();
						}
					}
				}
			});
		},
		subAjaxGet: function (options) {                  //jquery  ajax封装
			var opt = {
				"url": "",
				"ctp": "",
				"successFunc": null,
				"errorFunc": null,
				"isError": true,
				"header": null,
				"code": "code",          //状态字段名称  默认为code
				"code_value": 0,         //请求成功码  默认为0
				"message": "message"     //请求失败话术字段名  默认为message
			};
			opt["url"] = options["url"] ? options["url"] : "";
			opt["ctp"] = options["ctp"] ? options["ctp"] : "application/json";
			opt["successFunc"] = options["successFunc"] ? options["successFunc"] : null;
			opt["errorFunc"] = options["errorFunc"] ? options["errorFunc"] : null;
			opt["isError"] = options["isError"] !== undefined ? options["isError"] : false;
			opt["code"] = options["code"] ? options["code"] : "code";
			opt["code_value"] = options["code_value"] !== undefined ? options["code_value"] : 0;
			opt["message"] = options["message"] !== undefined ? options["message"] : "message";
			if (typeof options["header"] != "undefined") {
				opt["header"] = options["header"];
			} else {
	            /*这里设置默认头部
	            opt["header"]={
	                
	            };*/
			}
			$.ajax({
				headers: opt["header"],
				type: "GET",
				url: opt["url"],
				timeout: 20000,
				dataType: "json",
				contentType: opt["ctp"],
				success: function (data) {
					if (data[opt["code"]] === opt["code_value"]) {
						if (opt.successFunc && opt.successFunc instanceof Function) {
							opt.successFunc(data);
						}
					} else {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							opt.errorFunc(data);
						}
						if (opt["isError"] === true) {
							oCommon.noPower('', data[opt["message"]]);
						}
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					if (opt["isError"] === true) {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							oCommon.noPower('', "网络似乎出现了错误，请稍后重试。");
						} else {
							oCommon.noPower('', "网络似乎出现了错误，请稍后重试。");
						}
					} else {
						if (opt.errorFunc && opt.errorFunc instanceof Function) {
							opt.errorFunc();
						}
					}
				}
			});
		}
	}
};





/*--------------------------2018/8/23 新增指纹识别技术------------------------------*/
!function(){
	var fingerprint_hash=pop_fashion_global.fn.getCookie('userport_hash_print') || '';
	if(fingerprint_hash==''){
		new Fingerprint2().get(function(result,componts){
			console.log(result)
			fingerprint_hash=result;
			pop_fashion_global.fn.setCookie('userport_hash_print',fingerprint_hash,365);
		});
	};
}();








var brandAll;



oCommon = {
	// 顶部所有站显示与隐藏
	'handleAllWeb': function () {
		var $left = $('.leftT li.webIco');
		var $conleft = $('.conleft');
		var $allweb = $('.allWeb');
		$left.on('mouseenter', function () {
			$allweb.css('display', 'block');
		});
		$left.on('mouseleave', function () {
			$allweb.css('display', 'none');
		});
	},
	// 导航栏行业筛选
	'industrySelect': function () {
		var $navsx = $(".js-switch-area");
		var $navlist = $('.navshaixuan-list');
		$navsx.on('mouseover mouseleave', function (e) {
			if (e.type == 'mouseover') {
				$navlist.css('display', 'block');
			} else if (e.type == 'mouseleave') {
				$navlist.css('display', 'none');
			}
		});
	},

	// 客户服务下拉
	'specialList': function () {
		var timer;
		var $sdown = $(".special_down");
		var $slist = $(".special_list");
		$sdown.on('mouseover', function () {
			clearTimeout(timer);
			$slist.css('display', 'block');
		});

		$sdown.on('mouseleave', function () {
			timer = setTimeout(function () {
				$slist.css('display', 'none');
			}, 200);
		});

	},

	// 窗口滚动时搜索框改变且出现回到顶端按钮
	'windowScroll': function () {
		var obj = this;
		$(window).scroll(function () {
			var scrollTop = $(this).scrollTop();
			var $searchLi = $('.searchLi');
			var $searchIn = $('.searchIn');
			var $backTop = $('#backTop');
			if (scrollTop > 40) {
				// $searchLi.off('mouseenter');
				// $searchIn.off('mouseleave');
				// $searchLi.hide();
				// $searchIn.fadeIn(200);
				$backTop.fadeIn(100);
			} else {
				// $searchIn.stop(true,true).fadeOut(200);
				// $searchLi.show();
				$('#backTop').fadeOut(100);
				// obj.headSearch();
			}
		});
	},
	/*底部广告*/
	'bottomAds': function () {
		var par = $("#footwrap");
		var $self = $('#footwrap .closebtn');
		var is_close = false;
		$self.on('click', function () {
			par.hide();
			is_close = true;
		});
		function adsScroll() {
			if (is_close == true) { return; }
			var scrollTop = $(window).scrollTop();
			if (scrollTop == 0) {
				par.hide();
			} else if (scrollTop > 0) {
				par.show();
			}
		};
		adsScroll();
		$(window).scroll(function () {
			adsScroll()
		});
	},
	/*回到顶部*/
	'backTop': function () {
		$('#backTop').on('click', function () {
			$("html,body").animate({ scrollTop: 0 }, 1000);
		});
	},
	/*右侧小导航*/
	'rightNav': function () {
		var lis = $(".nav_fixed li");
		lis.on('mouseenter mouseleave', function (e) {
			if (e.type == 'mouseenter') {
				$(this).find("i").stop(true, true).show(200).end().find(".show_left").stop(true, true).show(200);
			} else {
				$(this).find("i").stop(true, true).hide(100).end().find(".show_left").stop(true, true).hide(200);
			}
		});
		// pop地图
		$(".js-pop-map").on("mouseenter mouseleave", function (e) {
			if (e.type == "mouseenter") {
				$(this).find(".js-map-show").stop(true, true).show(200);
				$(this).find(".js-arrow-map").show();
				$(this).find(".js-map-img>iframe").attr("src", "http://www.pop-fashion.com/service/address/");
			} else {
				$(this).find(".js-map-show").stop(true, true).hide(100);
				$(this).find(".js-arrow-map").hide();
				$(this).find(".js-map-img>iframe").attr("src", "");
			}
		});
		// pop地图定位
		if ($(".js-pop-map").length) {
			var mapTop = $(".js-pop-map")[0].getBoundingClientRect().top;
			var windowHei = $(window).height();
			var boxHei = parseInt(windowHei - mapTop);
			if (boxHei < 370) {
				$(".js-map-show").addClass("ab-fixed").removeClass("ab-absolute");
			} else {
				$(".js-map-show").addClass("ab-absolute").removeClass("ab-fixed");

			}
		}

	},
	'noPower': function (no_type, content) {
		var no_type = parseInt(no_type);
		var L = '';
		if (!content) {
			switch (no_type) {
				case -1: L = '对不起，只有VIP用户才能使用此功能！'; break;
				case -2: L = '对不起，只有设计师专属账号才能使用此功能，<br/>请您<a href="/member/associate/" target="_blank">添加</a>或登录设计师专属账号！'; break;
				case -3: L = '对不起，只有VIP用户才能访问该栏目！'; break;
				case -4: L = '对不起，操作失败，请重试！'; break;
				case -5: L = '对不起，只有VIP用户才能使用此功能，<br/>请<a target="_blank" href="/service/joinmember/" style="color: #d8b056;">立即升级为本站VIP会员</a>获取最新流行资讯！'; break;
				case -6: L = '对不起，您正在浏览的是会员内容...<br/>由于您尚未<a target="_blank" href="/member/register/" rel="nofollow" style="color: #d8b056;">注册</a>或<a href="javascript:void(0);" class="loginLayer" style="color: #d8b056;">登录</a>，暂无权限查看详情，如需帮助请联系我们。'; break;
				case -7: L = '对不起，您正在浏览的是会员内容...<br/>由于您尚未<a target="_blank" href="/service/joinmember/" rel="nofollow" style="color: #d8b056;">成为VIP</a>会员，暂无权限查看详情，如需帮助请联系我们。'; break;
				case 1: L = '操作成功！'; break;
			}
		}
		else {
			L = content;
		}
		var shtml = '<div class="qx_close"></div><p>' + L + '</p>';
		//页面层-自定义
		var oNoPowerLayer = layer.open({
			type: 1,
			title: false,
			// scrollbar:false,
			closeBtn: 0,
			skin: 'quanxian_cont',
			area: ['550px', '115px'],
			maxWidth: '660px',
			content: shtml
		});
		$('.quanxian_cont .qx_close').click(function () {
			layer.close(oNoPowerLayer);
		});
	},
	// 信息回馈
	'feedback': function () {
		var $box = $('#txtArea');
		var txtVal = $box.text();
		$box.inputText({
			txt: txtVal,
			lightColor: "#ccc",
			color: "#ccc",
			fontSize: "14px"
		});
		$('#feedback').on('click', function () {
			var feedBackVal = $('#txtArea').val();
			if (feedBackVal == '' || feedBackVal == '请输入您的反馈信息......') {
				oCommon.noPower('', '请输入您的反馈信息!!');
				return false;
			}
			else {
				$.ajax({
					type: 'POST',
					dataType: 'json',
					data: { feedBackVal: feedBackVal },
					url: '/Ajax/userFeedBack/',
					success: function (data) {
						oCommon.noPower('', data.msg);
						$('#txtArea').val('请输入您的反馈信息......');
					}
				});
			};
		});
	},

	'collect': function (_this, iColumnId, sTableName, iPriId, iType, callback, status, para) {
		var that = this;
		if (status == 0) {
			var text = '您是否确认取消收藏？';
			var url = '/collect/setcollect/' + iColumnId + '-' + sTableName + '-' + iPriId + '-' + iType + '-' + para + '/cancel/?' + Math.random();
		} else {
			var text = '您是否确认收藏？';
			var url = '/collect/setcollect/' + iColumnId + '-' + sTableName + '-' + iPriId + '-' + iType + '-' + para + '/?' + Math.random();
		}
		//确认框
		$.ajax({
			type: 'get',
			url: url,
			anyc: true,
			success: function (e) {
				e = parseInt(e);
				if (e < 0) {
					that.noPower(e); return;
				} else {
					if (typeof callback == 'function') {
						callback();
					} else {
						window.location.href = location.href; return;
					}
				}
			}
		});
	},
	'loginLayer': function () {
		//登录弹框
		var loginLayer = layer.open({
			type: 2,
			title: false,
			closeBtn: 0,
			shade: [0.8, '#000'],
			area: ['840px', '540px'],
			content: ['/member/login/', 'no'] // iframe的url
		});
	},
	'download': function (path) {
		window.location.href = '/download/dlsingle/?dl_link=' + encodeURIComponent(path) + '&' + Math.random();
	},
	//提示信息闪烁
	'flicker': function () {
		var o = $(".wran"), i = 0, c = "tour_cus", times = 6;
		var t = setInterval(function () {
			i++;
			if (i % 2) {
				o.addClass(c);
			} else {
				o.removeClass(c);
			}
			if (i == times) {
				clearInterval(t);
			}
		}, 300);
	},
	'clickBeforeFlicker': function (obj) {
		return true;
		// 游客或者普通用户
		var power = parseInt($('#link').data('pow'));
		if (power == 1 || power == 2) {
			if (typeof obj != 'undefined') {
				$(obj).parents('.showbox,.showdiv').css({ visibility: 'hidden' });
			}
			this.flicker();
			return false;
		}
		return true;
	},
	// 行业性别筛选
	'giClick': function () {
		var obj = this;
		// 性别行业点击处理
		$('a[id^=gi_]').on('click', function () {
			var $box = $(this);
			var info = $box.prop('id').replace(/gi_/gi, '');
			var infoa = info.split('_');
			var type = parseInt(infoa[0]);
			var val = parseInt(infoa[1]);
			obj.replaceGI(val, type);
		});
	},
	'replaceGI': function (val, type) {
		var name, pattern, pattern1, pattern2, alias, gcen;
		var rtrimSep = /\/+$/;
		var _anchor = '#anchor';
		switch (type) {
			case 142:
				name = 'gender';
				alias = 'gen_';
				gcen = /\-?gcen_\d+/gi;
				pattern = /gen_\d+/gi;
				pattern1 = /\/\-?gen_\d+\-?/gi;
				pattern2 = /\-?gen_\d+/gi;
				break;
			case 158:
				name = 'industry';
				alias = 'ind_';
				gcen = '';
				pattern = /ind_\d+/gi;
				pattern1 = /\/\-?ind_\d+\-?/gi;
				pattern2 = /\-?ind_\d+/gi;
				break;
		}
		if (val) {
			$.cookie(name, val, { domain: '.pop-fashion.com', path: '/' });
		}
		// 删除
		else {
			$.cookie(name, "", { domain: '.pop-fashion.com', path: '/', expires: -1 });	// 清除COOKIE
		}
		var url = window.location.href;
		url = url.replace(_anchor, '').replace(/[?&]m=[\.\d]+/gi, '');
		// 页码如果存在则将页码去掉
		if (url.indexOf('-page_') !== -1) {
			var reg = RegExp('-page_([^-]*)', 'gi');
			url = url.replace(reg, '');
		}
		else if (url.indexOf('page_') !== -1) {
			var reg = RegExp('page_([^-]*)', 'gi');
			url = url.replace(reg, '');
		}
		// 为了照顾款式在选择童装时可以筛选男童或女童而做的特殊处理
		// 有则改之
		if (pattern.test(url)) {
			// 全部时清除性别或行业
			if (val == 0) {
				if (/\?key=/gi.test(url)) {
					var key = url.replace(/(.*)(\/\?key=.*)/gi, '$1|||$2');
					var info = key.split('|||');
					var _url = info[0];
					var _key = info[1];
					if (/\_/.test(_url)) {
						_url = _url.replace(pattern1, '/').replace(pattern2, '');
					}
					_url = _url.replace(gcen, '').replace(rtrimSep, '');
					url = _url + _key;
				} else {
					url = url.replace(pattern1, '/').replace(pattern2, '').replace(gcen, '').replace(rtrimSep, '') + '/';
				}
			} else {
				if (/\?key=/gi.test(url)) {
					url = url.replace(pattern, alias + val).replace(gcen, '');
				} else {
					url = url.replace(pattern, alias + val).replace(gcen, '').replace(rtrimSep, '') + '/';
				}
			}
		}
		// 无则加勉
		else {
			if (val) {
				// 带关键字
				if (/\?key=/gi.test(url)) {
					var key = url.replace(/(.*)(\/\?key=.*)/gi, '$1|||$2');
					var info = key.split('|||');
					var _url = info[0].replace(gcen, '').replace(rtrimSep, '');
					var _key = info[1];
					if (/\_/.test(_url)) {
						_url = _url.replace(rtrimSep, '') + '-' + alias + val;
					} else {
						_url += '/' + alias + val;
					}
					url = _url + _key;
				} else {
					url = url.replace(gcen, '').replace(rtrimSep, '') + '/';
					if (/\_/.test(url)) {
						url = url.replace(rtrimSep, '') + '-' + alias + val;
					} else {
						url += alias + val;
					}
					url = url.replace(rtrimSep, '') + '/';
				}
			} else {
				// 带关键字
				if (/\?key=/gi.test(url)) {
					// 不带随机数
					if (!/m=/gi.test(url)) {
						url += '&m=' + Math.random();
					}
					else {
						url = url.replace(/&m=[\.\d]+/gi, '&m=' + Math.random());
					}
				} else {
					// 带随机数
					if (!/m=/gi.test(url)) {
						url += '?m=' + Math.random();
					}
					else {
						url = url.replace(/\?m=[\.\d]+/gi, '?m=' + Math.random());
					}
				}
			}
		}
		window.location.href = url + _anchor;
	},
	'delGIClick': function () {
		//点击x,删除本身的条件
		$(".del_self").on('click', function () {
			var _url = $(this).data('url');
			if (_url == '#') {
				var url = window.location.href;	// 改URL
				// 为了照顾款式在选择童装时可以筛选男童或女童而做的特殊处理
				// 有则删之
				if (/gen_\d+/.test(url)) {
					url = url.replace(/\-?gen_\d+/, '').replace(/\/+$/, '') + '/';
				}
				$.cookie('gender', "", { domain: '.pop-fashion.com', path: '/', expires: -1 });	// 清除COOKIE
				window.location.href = url;
			}
			// 行业
			else if (_url == '##') {
				var url = window.location.href;	// 改URL
				// 为了照顾款式在选择童装时可以筛选男童或女童而做的特殊处理
				// 有则删之
				if (/ind_\d+/.test(url)) {
					url = url.replace(/\-?ind_\d+/, '').replace(/\/+$/, '') + '/';
				}
				$.cookie('industry', "", { domain: '.pop-fashion.com', path: '/', expires: -1 });
				window.location.href = url;
			} else {
				window.location.href = _url;
			}
		});
		//点击性别或行业条件,删除本身的cookie值
		$(".del").on('click', function () {
			var val = $(this).attr('href');
			// 点击不做处理
			if (val == '#' || val == '##') {
				return false;
			}
			// 性别
			if (val == '#') {
				var url = window.location.href;	// 改URL
				// 为了照顾款式在选择童装时可以筛选男童或女童而做的特殊处理
				// 有则删之
				if (/gen_\d+/.test(url)) {
					url = url.replace(/\-?gen_\d+/, '').replace(/\/+$/, '') + '/';
				}
				$.cookie('gender', "", { domain: '.pop-fashion.com', path: '/', expires: -1 });
				window.location.href = url;
			}
			// 行业
			else if (val == '##') {
				var url = window.location.href;	// 改URL
				// 为了照顾款式在选择童装时可以筛选男童或女童而做的特殊处理
				// 有则删之
				if (/ind_\d+/.test(url)) {
					url = url.replace(/\-?ind_\d+/, '').replace(/\/+$/, '') + '/';
				}
				$.cookie('industry', "", { domain: '.pop-fashion.com', path: '/', expires: -1 });
				window.location.href = url;
			}
		});
	},
	// 隐藏微信分享
	hiddenWXshare: function () {
		$('#bdshare_weixin_qrcode_dialog_bg,#bdshare_weixin_qrcode_dialog').remove();
	},
	// 共 757743 个相关款式=>共 75... 个相关款式
	// ellipsis:function(){
	// 	var $result = $('#s_result');
	// 	var w920 = parseInt($('.w920').width());
	// 	if (w920 == 1220) {
	// 		$result.find('.findstyle a').css('max-width','auto');
	// 		$result.find('.btn_page span.totalN').css({maxWidth: 'auto'});
	// 	} else if(w920 == 920){
	// 		$result.find('.findstyle a').css('max-width','40px');
	// 		$result.find('.btn_page span.totalN').css({maxWidth:'28px'});
	// 	}
	// },

	// 大图缩放拖拽
	SetImg: function (obj, maxW, maxH) {
		//初始化大图图片
		var temp_img = new Image();
		temp_img.onload = function () {
			var imgH = temp_img.height;
			var imgW = temp_img.width;
			//计算图片最大宽度
			if ((imgW > maxW) && (imgW > imgH)) {
				obj.width = maxW;
				obj.height = imgH * (maxW / imgW);
				imgW = obj.width;
				imgH = obj.height;
				if (imgH > maxH) {
					obj.height = maxH;
					obj.width = imgW * (maxH / imgH);
				}
			}
			//计算图片最大高度
			if ((imgH > maxH) && (imgH > imgW)) {
				obj.height = maxH;
				obj.width = imgW * (maxH / imgH);
				imgW = obj.width;
				imgH = obj.height;
				if (imgW > maxW) {
					obj.width = maxW;
					obj.height = imgH * (maxW / imgW);
				}
			}
			if ((imgW > maxW) && (imgW == imgH)) {
				obj.width = maxW;
				obj.height = imgH * (maxW / imgW);
				imgW = obj.width;
				imgH = obj.height;
				if (imgH > maxH) {
					obj.height = maxH;
					obj.width = imgW * (maxH / imgH);
				}
			}
			if ((imgW < maxW || imgW == maxW) && (imgH < maxH || imgH == maxH)) {
				obj.width = imgW;
				obj.height = imgH;
			}
			obj.width = imgW;
			obj.height = imgH;
		};
		temp_img.src = obj.src;
	},
	//栏目引导页 参数为引导页显示的位置 款式库 style 品牌库 brand 灵感源 inspiration 其他 other 报告 report 弹层 layer 交叉 mutual 工作台 workbench
	guidelayer: function (position) {
		var guide = $.cookie('guide') ? $.cookie('guide') : '';
		guide = guide.split('-');

		switch (position) {
			// case 'style'://款式库 1
			// 	var $style = $('.shadow_index, .style_guide');
			// 	if ($.inArray('1', guide) != -1) {
			// 		$style.hide();
			// 	} else {
			// 		$style.show();
			// 		guide.push('1');
			// 	}
			// 	$('body').on('click', '.shadow_index, .style_guide, .styleKnow', function () {
			// 		$style.hide();
			// 	})
			// 	break;
			// case 'brand'://品牌库 2
			// 	var $brand = $(".shadow_index1, .brand_guide");
			// 	if ($.inArray('2', guide) != -1) {
			// 		$brand.hide();
			// 	} else {					
			// 		$brand.show();
			// 		var step3=$(".brand_guide .brandStep3")
			// 		if(step3.length){
			// 			var scrollN = step3.position().top;
			// 			$('html,body').animate({scrollTop:(scrollN -150) +'px'}, 500);
			// 		}
			// 		guide.push('2');
			// 	}
			// 	$('body').on('click', '.shadow_index1, .brand_guide, .brandKnow', function () {
			// 		$brand.hide();
			// 	})
			// 	break;
			// case 'inspiration'://灵感源 3
			// 	var $inspiration = $(".shadow_index2, .insp_guide");
			// 	if($.inArray('3', guide) != -1){
			// 		$inspiration.hide();
			// 	}else {
			// 		$inspiration.show();
			// 		guide.push('3');
			// 	}
			// 	$('body').on('click', '.shadow_index2, .insp_guide, .inspKnow', function () {
			// 		$inspiration.hide();
			// 	})
			// 	break;
			// case 'other'://其他 4
			// 	var $other = $(".shadow_index3, .a_guide");
			// 	if($.inArray('4', guide) != -1){
			// 		$other.hide();
			// 	}else {
			// 		$other.show();
			// 		guide.push('4');
			// 	}
			// 	$('body').on('click', '.shadow_index3, .a_guide, .allKnow', function () {
			// 		$other.hide();
			// 	})
			// 	break;
			// case 'report'://报告弹层 5
			// 	var $report = $(".report_guide, .shadow_index7");
			// 	if($.inArray('5', guide) != -1){
			// 		$report.hide();
			// 	}else {
			// 		$report.show();
			// 		guide.push('5');
			// 	}
			// 	$('body').on('click', '.report_guide, .shadow_index7, .reportKnow', function () {
			// 		$report.hide();
			// 	})
			// 	break;
			// case 'layer'://款式弹层 6
			// 	var $layer = $('.shadow_index6, .dlayer_guide');
			// 	if($.inArray('6', guide) != -1){
			// 		$layer.hide();
			// 	}else {
			// 		$layer.show();
			// 		guide.push('6');
			// 	}
			// 	$('body').on('click', '.shadow_index6, .dlayer_guide, .dlayerKnow', function () {
			// 		$layer.hide();
			// 	})
			// 	break;
			// case 'mutual'://交叉 7
			// 	var $mutual = $(".shadow_index5, .mu_guide");
			// 	if($.inArray('7', guide) != -1){
			// 		$mutual.hide();
			// 	}else {
			// 		$mutual.show();
			// 		guide.push('7');
			// 	}
			// 	$('body').on('click', '.shadow_index5, .mu_guide, .muKnow', function () {
			// 		$mutual.hide();
			// 	})
			// 	break;
			// case 'workbench'://工作台 8
			// 	var $workbench = $(".shadow_index4, .wookbench_guide");
			// 	if($.inArray('8', guide) != -1){
			// 		$workbench.hide();
			// 	}else {
			// 		$workbench.show();
			// 		guide.push('8');
			// 	}
			// 	$('body').on('click', '.shadow_index4, .wookbench_guide, .wbKnow', function () {
			// 		$workbench.hide();
			// 	})
			// 	break;
			case 'ispc'://是否是pc端 9
				var $ispc = $(".m_layer");
				if ($.inArray('9', guide) != -1) {
					$ispc.hide();
				} else {
					$ispc.show();
					guide.push('9');
				}
			case 'movelayer'://快反应页面动画
				var $movetop = $(".moveLogo");
				if ($.inArray('10', guide) != -1) {
					$movetop.addClass('nomove');
					$movetop.removeClass('movelayer');
				} else {
					$movetop.removeClass('nomove');
					$movetop.addClass('movelayer');
					guide.push('10');
				}
		}
		var guideVal = guide.join('-').replace(/^-/, '').replace(/-$/, '');
		$.cookie('guide', guideVal, { expires: 365, path: '/', domain: '.pop-fashion.com' });//一年
	},
	// 全站搜索时，将性别或行业追加到URL里面
	// 返回值 gen_x||ind_x||空  x=数字
	getGenIndInfo: function () {
		var gen, ind;
		var url = location.href;
		var genPattern = /.*gen_(\d+)?.*/;
		var indPattern = /.*ind_(\d+)?.*/;
		// URL优先
		// 有性别
		if (genPattern.test(url)) {
			gen = parseInt(url.replace(genPattern, '$1'));
		} else {
			gen = parseInt($.cookie('gender'));
		}
		if (indPattern.test(url)) {
			ind = parseInt(url.replace(indPattern, '$1'));
		} else {
			ind = parseInt($.cookie('industry'));
		}
		// cookie
		if (gen && ind) {
			return 'gen_' + gen + '-' + 'ind_' + ind + '/';
		} else if (gen) {
			return 'gen_' + gen + '/';
		} else if (ind) {
			return 'ind_' + ind + '/';
		} else {
			return '';
		}
	},
	getDelGenIndInfo: function () {
		var url = location.href;
		var genPattern = /-?gen_\d+-?/;
		var indPattern = /-?ind_\d+-?/;
		if (genPattern.test(url)) {
			url = url.replace(genPattern, '');
		}
		if (indPattern.test(url)) {
			url = url.replace(indPattern, '');
		}
		url = url.replace(/\/\/\?/, '/?');	// 有隐患
		return url;
	},
	//游客/普通用户/试用会员 各类下载功能屏蔽
	downloadPrivilege: function () {
		if ($.inArray(P_UserType.toString(), ['3', '4', '5']) > -1) {
			oCommon.noPower(-5);//提示文案
			return false;
		}
		// console.log(P_UserType);

		return true;
	},
	//特殊字符替换
	popReplace: function (str) {
		str = str.replace(/</g, 'pop389').replace(/>/g, 'pop390').replace(/-/g, 'pop380').replace(/_/g, 'pop381').replace(/~/g, 'pop382').replace(/!/g, 'pop383').replace(/\./g, 'pop384').replace(/\*/g, 'pop385').replace(/\(/g, 'pop386').replace(/\)/g, 'pop387').replace(/&/g, 'pop388').replace(/\'/g, 'pop391').replace(/\+/g, 'pop392').replace(/\#/g, 'pop35');
		return str;
	},

	// 显示自定义提示层
	showTips: function (content, time) {
		time = time || 2000;
		layer.open({
			type: 0,
			area: ['240px'],
			title: false,
			closeBtn: false,
			btn: [],
			shade: 0.4,
			time: time,
			shade: 0,
			skin: 'demo-class',
			content: '<div style="text-align:center;margin-top:12px;">' + content + '</div>',
		});
	},

	// 运行
	run: function () {
		var obj = this;
		obj.handleAllWeb();
		obj.industrySelect();
		// obj.headNav();
		obj.specialList();
		obj.windowScroll();
		obj.bottomAds();
		obj.backTop();
		obj.rightNav();
		obj.feedback();
		obj.giClick();
		obj.delGIClick();
		obj.clickBeforeFlicker();
	}
};
$(function () {

    // 初始化 brandAll
    brandAllInit();
    function brandAllInit(){
        var thisBrandAllTime = pop_fashion_global.fn.getSto( 'brandAllTime' );
        if( $("#brandAllInfo").data('time') == thisBrandAllTime ){
            brandAll = pop_fashion_global.fn.getSto('brandAll') || undefined;
        }
    }


	oCommon.run();
	$(window).resize(function () {
		oCommon.rightNav();
	});

	// 信息列表
	$(".information_li a").on('click', function (e) {
		$(".scrollHolder").perfectScrollbar('destroy');
		$(".scrollHolder").perfectScrollbar();
		$(".infor_box, .in_aro").css('visibility', 'visible');
		e.stopPropagation();
	});
	$("body").on('click', function (e) {
		$(".infor_box, .in_aro").css('visibility', 'hidden');
	});

	if (typeof ($().perfectScrollbar) == 'function') {
		$(".scrollHolder").perfectScrollbar();
	}



	// 首页合作伙伴轮播
	var $left = $(".switch_left");
	var $right = $(".switch_right");
	var $lis = $(".index_partner .p_ul1 li")
	var liswid = $lis.width();
	var $lilen = $lis.length;
	var $ul = $(".index_partner ul.p_ul1");
	var num = 0;
	$lis.eq(0).css('left', '0');
	$("body").on("mouseenter mouseleave", '.index_partner', function (e) {
		if (e.type == 'mouseenter') {
			$left.stop(true, true).animate({ 'left': '10px' }, 300);
			$right.stop(true, true).animate({ 'right': '10px' }, 300);
		} else {
			$left.stop(true, true).animate({ 'left': '-13px' }, 200);
			$right.stop(true, true).animate({ 'right': '-13px' }, 200);
		}
	});
	$right.on('click', function () {
		num++;
		if (num < $lilen) {
			$lis.eq(num - 1).stop(true, true).css({ 'z-index': '3' }).animate({ 'left': -liswid }, 300);
			$lis.eq(num).stop(true, true).css({ 'left': liswid, 'z-index': '4' }).animate({ 'left': 0 }, 300);
		} else if (num = $lilen - 1) {
			$lis.eq($lilen - 1).stop(true, true).css({ 'z-index': '3' }).animate({ 'left': -liswid }, 300);
			$lis.eq(0).stop(true, true).css({ 'left': liswid, 'z-index': '4' }).animate({ 'left': 0 }, 300);
			num = 0;
		}
	});
	$left.on('click', function () {
		num--;
		var now = -$lilen;
		if (num < $lilen) {
			$lis.eq(num + 1).stop(true, true).css({ 'z-index': '3' }).animate({ 'left': liswid }, 300);
			$lis.eq(num).stop(true, true).css({ 'left': -liswid, 'z-index': '4' }).animate({ 'left': 0 }, 300);
		}
		if (num <= now) {
			$lis.eq(now).stop(true, true).css({ 'left': -liswid, 'z-index': '4' }).animate({ 'left': 0 }, 300);
			num = 0;
		}
	});
});
//控制专题页底部弹层是否显示
$(function () {
	var ft_fixed = $(".footerFixed");
	var btn_close = $(".toClose");
	var docHeight = $(document).height();
	var winHeight = $(window).height();
	var flag = -1;
	$(window).scroll(function () {
		var scollTop = $(window).scrollTop();
		if (flag != 1) {
			if (scollTop >= docHeight - winHeight) {
				ft_fixed.hide();
			} else {
				ft_fixed.show();
			}
		}
	});

	btn_close.click(function () {
		flag = 1;
		ft_fixed.hide();
	});

});

//输入页码--跳转
$(function () {
	
	var goto = function (event) {
        var is_click = false;
        if(event.data){
            is_click = (event.data.e == 'click' );
        }
		if (event.which == 13 || is_click) {
			//获取需要跳转到的页码
			var page = $('#J_GoPage').val();
			page = parseInt(page);
			//获取总页数pageCount
			var pageCount = parseInt($("#_pageCount").val());
			if (page >= pageCount) {
				page = pageCount;
			}
			//获取需要跳转到的URL
			var url = $('#goBtn').attr('data');
			var search = $('#goBtn').attr('search');
			if (isNaN(page)) {
				return false;
			}
			window.location.href = url + 'page_' + page + '/' + (search ? search : '');
		}
	};

	$("#goBtn").on("click", { 'e': 'click' }, goto);

	$('#J_GoPage').on('keypress', goto)
		.focus(function () {
			$(this).val('');
		}).blur(function () {
			var $self = $(this);
			if (!$.trim($self.val())) {
				$self.val(this.defaultValue);
			}
		});

	// 登录弹窗
	$('body').on('click', '.loginLayer', function () {
		oCommon.loginLayer();
	});

	//检测是否同意了电子证书
	var show_electronicpage = function () {
		var viptype = $.cookie('viptype');
		var status = $.cookie('_MemberName');
		var isElectronicContract = $.cookie('_ELECTRONIC_CONTRACT_NEW');
		//if (status == null || parseInt(viptype) != 3 || isElectronicContract == null) {
		if (status == null || isElectronicContract == null) {
			return false;
		}
		else {
			//页面中打开电子证书 
			var elec_index = parent.layer.open({
				type: 2,
				title: '',
				shade: [0.8, '#FFFFFF'],
				shadeClose: false,
				closeBtn: 0,
				area: ['900px', '560px'],
				content: ['/member/econtract/', 'no']
			});
		}
	}

	show_electronicpage();

	//30天内免登陆 
	var Autologon = function () {
		var encryption = '';
		if ($.cookie('_KeepPassword') != null && $.cookie('userinfo_id') == null) {
			encryption = $.trim($.cookie('_KeepPassword'));
			$.ajax({
				type: 'post',
				url: '/member/doLogin/?' + Math.random(),
				async: false,
				data: { isajax: false, 'encryption': encryption },
				dataType: 'json',
				success: function (e) {
					if (e.status == 1) {
						window.location.href = location.href;
						return true;
					}
					else {
						return false;
					}
				}
			});
		}
		else {
			return false;
		}
	};
	Autologon();


	// 尾部

	$(window).resize(function () {
		scrollLeft($('#footwrap'));
		scrollLeft($('.js-head-top'));
		scrollLeft($('.js-dropdown-nav'));
	});
	$(window).scroll(function () {
		scrollLeft($('#footwrap'));
		scrollLeft($('.js-head-top'));
		scrollLeft($('.js-dropdown-nav'));
	});
	function scrollLeft($footwrap) {
		var scrollLeft = $(window).scrollLeft();
		// $headTop.css({left: -scrollLeft+'px'});
		$footwrap.css({ left: -$(window).scrollLeft() + 'px' });
		if (scrollLeft) {
			// $headTop.css({width: 'auto'});
			$footwrap.css({ width: 'auto' });
		} else {
			// $headTop.css({width: '100%'});
			$footwrap.css({ width: '100%' });
		}
	}

	function scrolldoc() {
		$('.js-Itext').each(function (i) {
			var _class;
			var $self = $(this);
			// head_topx42	滚动
			if (i) {
				_class = '.menu:last';

			}
			// head_topx40	刚进去
			else {
				_class = '.menu:first';
			}
			var $box = $self;
			var key = $(this).val();
			$box.autocomplete({
				source: getBrandsData,
				appendTo: _class,
				minLength: 0,
				delay: 300,
				position: { my: "left-10 top+30", at: "left top" },
				_renderItem: function (ul, item) {
					return $("<li>")
						.data("id", item.value)
						.append(item.label)
						.appendTo(ul);
				},

				_renderMenu: function (ul, items) {
					$(this).val(ui.item.label).data("id", ui.item.value);
				},
				select: function (event, ui) {
					$(this).val(ui.item.label);
					$(this).val(ui.item.label).data("id", ui.item.value);
					$(".js-Itext").blur();
					if (ui.item.label && ui.item.value) {
						window.open("/brands/detail/id_" + ui.item.value + "/");
					}
					return false;
					event.stopPropagation();
				},
				focus: function (event, ui) {
					$(this).val(ui.item.label).data("id", ui.item.value);
					$(this).val(ui.item.label);
					$(this).parents('.js-search-box').find('.look-brand-box').show();
					return false;
					event.stopPropagation();
				},
				open: function (event, ui) {
					var hotWordsHTML = $("#hotKey").html();
					if (!$(".log_searchIn .search_listDown .lately_hot").length) {
						$(this).parents('.log_searchIn').find('.search_listDown ul')
							.after(hotWordsHTML);
					}
					$(this).parents('.js-search-box').find('.look-brand-box').show();
					$('.search_listDown').eq(i).find('.list_arrow').show();
					var $scroll = $('#ui-id-' + parseInt(i + 1));
					var mainW = $(".new_first_screen .tool_lists").width();
					$(".n_log_searchIn .search_listDown .ui-autocomplete").css({ width: mainW - 190 });
					$scroll.perfectScrollbar('destroy');
					$scroll.perfectScrollbar();
				},
				close: function (event, ui) {
					if ($.trim(key) == '' || $.trim(key) == '时尚资讯一网打尽') {
						$(this).attr('placeholder', '搜索');
					}
					$(".js-search-box").animate({ 'width': '80px' }, 500);
					$(".js-Itext").animate({ 'width': '55px' }, 500);
					$(this).parents('.js-search-box').find('.look-brand-box').hide();
					$('.search_listDown').eq(i).find('.list_arrow').hide();
				}
			});
		});
	}
	scrolldoc();
	$(".look-brand-box").on('click', function (e) {
		window.open('/brands/')
		return false;
		e.stopPropagation();
	});
	$(document).scroll(function () {
		$(".js-Itext").autocomplete("close");
		scrolldoc();
	});
	// 全站搜索样式
	$(".js-Itext").on('focus', function (e) {
		e.stopPropagation();
		$(this).parent('.js-search-box').addClass('cur');
		var placeholder_key = '时尚资讯一网打尽';
		$(".js-search-box").animate({ 'width': '300px' }, 500);
		$(".js-Itext").animate({ 'width': '275px' }, 500);
		$(this).attr('placeholder', placeholder_key);
	});
	$("body").on('click', function (e) {
		var itext = $(".js-Itext");
		var key = itext.val();
		if ($.trim(key) == '' || $.trim(key) == '时尚资讯一网打尽') {
			itext.attr('placeholder', '搜索');
		}
		$('.js-search-box').removeClass('cur');
		$(".js-search-box").animate({ 'width': '80px' }, 500);
		$(".js-Itext").animate({ 'width': '55px' }, 500);
    });

    // 获取brandAll
    function getBrandAll() {
        if (typeof brandAll === 'undefined') {
            var $obj = $("#brandAllInfo");
            var brandAllTime = $obj.data('time');
            var domain = $obj.data('domain');
            $.ajax({
                url: domain + "/global/js/fashion/brandAll.js?" + brandAllTime,
                dataType: "script",
                cache: true,
                success: function(){
                    if(typeof brandAll !== 'undefined'){
                        pop_fashion_global.fn.setSto( 'brandAllTime', brandAllTime );
                        pop_fashion_global.fn.setSto( 'brandAll', brandAll );
                    }
                }
            });
        }
    }
    
	$(".js-Itext").on('click', function (e) {
        getBrandAll();
		e.stopPropagation();
    });
    
	$(".js-search-btn").on('click', function (e) {
		$(".js-Itext").focus();
		e.stopPropagation();
	});


	function getBrandsData(request, resposeCallback) {
		var text = $.trim(request.term);
		var data = [];
		if (text && typeof brandAll != 'unde' ) {
			text = text.toUpperCase();
			// 引入brandAll.js
			if (/^[A-Z]+/.test(text)) {
				var alias = text.substr(0, 1);
				data = rebuildBrandsArr(text, brandAll[alias]);
			} else if (/^[0-9]+/.test(text)) {
				data = rebuildBrandsArr(text, brandAll["["]);
			} else {
				data = rebuildBrandsArr(text, brandAll["]"]);
			}
			if (data.length > 200) {
				data = data.slice(0, 200);
			}
		}
		resposeCallback(data);
	}

	// always invoke
	function resposeCallback(data) {
		// console.log(data);
	}

	function rebuildBrandsArr(text, tempBrands) {
		var brands = [];
		for (var i in tempBrands) {
			var brand = tempBrands[i];
			var objBrands = {};
			// 中英文查找
			var en = brand.e.toUpperCase();
			if (en) {
				if (en.substr(0, text.length) == text) {
					objBrands.label = brand.e;
					objBrands.value = brand.i;
					brands.push(objBrands);
					continue;
				}
			}
			var cn = brand.c.toUpperCase();
			if (cn) {
				if (cn.substr(0, text.length) == text) {
					objBrands.label = brand.e;
					objBrands.value = brand.i;
					brands.push(objBrands);
					continue;
				}
			}
		}
		return brands;
	}
});

//注册pidtt
$(function () {
	function setcookie_pidtt() {
		var pid = location.href;
		var pidVal = null;
		var pidName = pid.substr(pid.indexOf('?') + 1, 3);
		if (pidName == "pid") {
			pidVal = pid.substring(pid.indexOf('=') + 1, pid.indexOf('&') == -1 ? pid.length : pid.indexOf('&'));
		}
		else {
			return;
		}
		if (/^\+?[0-9]*$/.test(pidVal)) {
			$.cookie('pidtt', pidVal, { path: '/', domain: 'pop-fashion.com' })
		}
		else {
			return;
		}
	};

	setcookie_pidtt();

	// 关于我们
	var lis = $('.aboutUs .content_left li.on');
	lis.on('mouseenter mouseleave', function (e) {
		if (e.type == 'mouseenter') {
			$(this).addClass('cur');
		} else {
			$(this).removeClass('cur');
		}
	});
	// 判断手机端,是就显示弹窗
	if (IsPC() == false) {
		oCommon.guidelayer('ispc');
	}

	// 首页导航下拉菜单
	$('.nav-lamu li.lmhover').on('mouseenter mouseleave', function (e) {
		$self = $(this);
		if (e.type == 'mouseenter') {
			$self.find('.lanmu_box').stop(true, true).slideDown(200);
		} else {
			$self.find('.lanmu_box').stop(true, true).slideUp(200);
		}
	});

	// 图片识别过度效果
	var defaultTop = -4;
	var $statusList = $(".statusList");
	var timer;
	function statusMove() {
		if (defaultTop < -180) {
			defaultTop = -4;
		}
		defaultTop -= 10;
		$statusList.css('top', defaultTop + 'px');
	}
	timer = setInterval(statusMove, 100);

});

//图片上传
function ajaxFabricUpload(o) {
	var options = {
		beforeSubmit: function () {
			return true;
		},
		type: 'post',
		url: '/picmatch/uploadpic/?time=' + Math.random(),
		dataType: 'json',
		success: function (obj) {
			if (obj.success == 1) {
				window.location.href = obj.path;
				return true;
			} else {
				oCommon.noPower('', '上传失败');
				return false;
			}
		},
		error: function (error) {
			oCommon.noPower('', error.responseText);
			return false;
		}
	};
	$(o).closest('form.uploadFileForm').ajaxSubmit(options);
}

//是否是PC端
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = [
		"Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPod"
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

// 手机端显示
(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


// 首次手机端进入弹出页面
window.onload = function () {
	var mlayer = document.getElementById("m_layer");
	var know = document.getElementById("i_know");
	if (know) {
		if (know.addEventListener) {                    //所有主流浏览器，除了 IE 8 及更早 IE版本
			know.addEventListener("touchend", fn, true);
		} else if (know.attachEvent) {                  // IE 8 及更早 IE 版本
			know.attachEvent("touchend", fn, true);
		}
	} else {

		return;
	}

	function fn() {
		m_layer.style.display = 'none';
	}
};
//pop快印
function popky() {
	var json = JSON.parse($("#popky_json").val());
	var $nowImg = $("#draggable").find("img").data('bp');//当前被选中大图
	for (var i in json['data']) {
		var str1 = json['data'][i]['bigPic'].replace(/http:\/\/(.*?)\.com/, '');
		var str2 = $nowImg.replace(/http:\/\/(.*?)\.com/, '');
		if (str1 == str2) {
			json['data'][i]['isSelected'] = 1;
		} else {
			json['data'][i]['isSelected'] = 0;
		}
	}
	$("#popky_json").val(JSON.stringify(json));
	document.getElementById("popky_form").submit();
}
//pop快印提示
var popky_info = $(".popky_info");
var guide = $.cookie('guide') ? $.cookie('guide') : '';
guide = guide.split('-');
if ($.inArray('12', guide) == -1) {
	popky_info.show();
}
popky_info.on('click', function () {
	popky_hide();
});
function popky_hide() {
	guide.push('12');
	var guideVal = guide.join('-').replace(/^-/, '').replace(/-$/, '');
	$.cookie('guide', guideVal, { expires: 365, path: '/', domain: '.pop-fashion.com' });//一年
	$(".popky_info").hide();
}

//新导航
$(function () {


	var def = {
		input_ele1: $(".js-form-list1 .js-input-area"),
		input_ele2: $(".js-form-list2 .js-input-area"),
		re: {
			mobile: /^1[1-9][0-9]{9}$/,
		},
		is_sub: false,
		return_data: {}
	};

	// 申请试用
	$(".js-apply-item").on("click", function () {
		$(".js-feedback-section-box").fadeIn(200);
		$(".js-bg-div").fadeIn(400);
	});
	$(".js-feedback-section-box>button").on("click", function () {
		$(this).parent().fadeOut(200);
		$(".js-bg-div").fadeOut(400);
	});

	//在线qq
	$("body .js-contact-qq-btn").each(function (i) {
		var id_txt = "js-contact-qq-btn" + (i + 1);
		var type = $(this).attr("data-type") || "";
		var qq_number = 0;
		if (type != "" && type == 1) {
			qq_number = 800020016;            //售后
		} else {
			qq_number = 800030036;            //售前
		}
		$(this).attr("id", id_txt);
		BizQQWPA.addCustom({
			aty: 0,
			nameAccount: qq_number,
			selector: id_txt
		});
	});


	// input判断
	def.input_ele1.on("focus", function () {
		var error_ele = $(this).siblings("p");
		error_ele.hide();
	}).on("blur", function () {
		checkFunc($(this), def.input_ele1);
	});

	//限制只能输入数字
	def.input_ele1.eq(1).on("input propertychange", function () {
		var re = /\D/g;
		var txt = $(this).val();
		if (re.test(txt)) {
			txt = txt.replace(re, "");
			$(this).val(txt);
		}
	});
	def.input_ele2.on("focus", function () {
		var error_ele = $(this).siblings("p");
		error_ele.hide();
	}).on("blur", function () {
		checkFunc($(this), def.input_ele2);
	});

	//限制只能输入数字
	def.input_ele2.eq(1).on("input propertychange", function () {
		var re = /\D/g;
		var txt = $(this).val();
		if (re.test(txt)) {
			txt = txt.replace(re, "");
			$(this).val(txt);
		}
	});

	// 提交数据
	$(".js-sub-btn").on("click", function () {
		subFunc($(this));
	});
	// 回车事件
	$(".js-form-div").on("keydown", function (e) {
		var keycode = e.keyCode;
		if (keycode == 13) {
			$(this).children(".js-sub-btn").click();
		}
	});
	// 申请试用
	function checkFunc(obj, par) {
		var index = par.index(obj);
		var key_name = obj.attr("name");
		var is_ok = true, txt = obj.val();
		var error_ele = obj.siblings("p");
		txt = txt.replace(/\s/g, "");
		var msg_txt = "";

		switch (index) {
			case 0:
				if (txt == "") {
					is_ok = false;
					msg_txt = "请填写姓名";
				} else if (general.fn.getCharacterLen(txt) < 4 || general.fn.getCharacterLen(txt) > 20) {
					is_ok = false;
					msg_txt = "4-20位字符，一个汉字是两个字符";
				}
				break;
			case 1:
				if (txt == "") {
					is_ok = false;
					msg_txt = "手机号码为空，请正确填写";
				}
				// else if(txt.length<11 || def.re.mobile.test(txt)==false){
				//     is_ok=false;
				//     msg_txt="请输入11位正确手机号码";
				// }
				break;
			default:
				break;
		}
		error_ele.text(msg_txt);
		if (is_ok == true) {
			error_ele.hide();
		} else {
			error_ele.show();
		}
		obj.val(txt);
		def.return_data[key_name] = txt;
		return is_ok;
	};


	function subFunc(obj) {
		var par = obj.siblings(".js-form-list").find(".js-input-area");
		if (def.is_sub == true) { return false };
		var is_next = true;

		par.each(function (i) {
			is_next = checkFunc($(this), par);
			if (i == 2) { is_next = true };
			return is_next;
		});
		if (is_next == false) {
			return false;
		} else {
			var select_ele = obj.siblings(".js-form-list").find(".js-select-div");
			var select_val = select_ele.children("span").attr("value") || "";
			if (select_val == "") {
				select_ele.siblings("p").show();
				return false;
			}
			obj.text("提交中...");
			def.is_sub = true;
			def.return_data["type"] = select_val;
			general.fn.subAjax({
				url: "/ajax/fmfeedback/",
				data: def.return_data,
				ctp: "application/x-www-form-urlencoded",
				success: function (data) {
					obj.text("马上联系我们");
					def.is_sub = false;
					msg.msg({ "txt": "pop小秘书已经收到您的信息，会在两个工作日内跟您联系，请保持电话畅通哦" }, 2000);
					$(".js-input-area").val("");
					$(".js-select-div").each(function (i) {
						var type = $(this).attr("data-type");
						if (type == 1) {
							$(this).children("span").removeClass("now-choice");
							$(this).children("span").attr("value", "");
							$(this).children("span")[0].is_show = false;
							$(this).children("span").text("请选择");
						} else {
							$(".js-feedback-section-box").fadeOut(200);
							$(".js-bg-div").fadeOut(400);
						}
					});
				},
				error: function (data) {
					var ndata = data || {};
					obj.text("马上联系我们");
					def.is_sub = false;
				}
			})
		}
	};





	// 首页导航下拉
	var $down = $(".downlist_box");
	var timer;
	$(".new_lanmu li.has_down").on('mouseenter', function () {
		var self = $(this);
		timer = setTimeout(function () {
			self.find('.downlist_box').stop(true, true).show();
		}, 100)
	});
	$(".new_lanmu li.has_down").on('mouseleave', function () {
		clearTimeout(timer);
		$(this).find('.downlist_box').stop(true, true).hide();
		$(this).find(".d_dr").hide();
	});

	// 语言下拉
	$(".js-leftT").on('mouseenter mouseleave', function (e) {
		if (e.type == "mouseenter") {
			$(".js-lang-list").show();
		} else {
			$(".js-lang-list").hide();
		}
	})

	// 联系方式下拉
	$(".js-tel-and-qq").on('mouseenter mouseleave', function (e) {
		if (e.type == "mouseenter") {
			$(".js-tel-downlist").show();
		} else {
			$(".js-tel-downlist").hide();
		}
	})

	// 下拉导航
	// 
	// var otime;
	// $(".js-all-nav-li").on('mouseenter', function () {
	// 	clearTimeout(otime);
	// 	$(this).addClass('fs');

	// 	$(".js-dropdown-nav").stop(true, true).slideDown(100, function () {
	// 		$(".js-head-top").addClass('is-down');
	// 	});
	// });
	// $(".js-dropdown-nav").on('mouseenter', function (ev) {
	// 	clearTimeout(otime);
	// 	$(".js-all-nav-li").addClass('fs');
	// 	$(".js-dropdown-nav").stop(true, true).slideDown(100, function () {
	// 		$(".js-head-top").addClass('is-down');
	// 	});
	// });
	// $(".js-all-nav-li").on('mouseleave', function () {
	// 	clearTimeout(otime);
	// 	otime = setTimeout(function () {
	// 		$(".js-dropdown-nav").stop(true, true).slideUp(100, function () {
	// 			$(".js-head-top").removeClass('is-down');
	// 		});
	// 		$(".js-all-nav-li").removeClass('fs');
	// 	}, 500)
	// });
	// $(".js-dropdown-nav").on('mouseleave', function () {
	// 	clearTimeout(otime);
	// 	otime = setTimeout(function () {
	// 		$(".js-dropdown-nav").stop(true, true).slideUp(100);
	// 		$(".js-all-nav-li").removeClass('fs');
	// 	}, 500)
	// });
	$(".js-all-nav-li").on('click', function () {
		$(this).toggleClass('fs');
		$(".js-dropdown-nav").stop(true, true).slideToggle(100, function () {
			$(".js-head-top").toggleClass('is-down');
		});
	});


	// 提示VIP账号创建子账号弹层
	setTimeout(function () {
		var pop_fashion_vip_cookie = pop_fashion_global.fn.getCookie('_VIP_CREATE_CHILD_ACCOUNT');
		if (pop_fashion_vip_cookie == null) {
			pop_fashion_global.fn.subAjaxGet({
				url: 'http://www.pop-fashion.com/Ajax/showVipCreateChildAccountPopup',
				successFunc: function (data) {
					var vip_add_layer = $(".js-vip-add-layer");
					vip_add_layer.show();
					$(".js-vip-close").click(function () {
						vip_add_layer.hide();
					})

				},
				errorFunc: null
			})
		}
	}, 2000);


	// 最新推荐
	var is_new_trends_fix = false;
	var pop_new_trend = pop_fashion_global.fn.getSto('pop_new_trend') || 0;	//上次推荐时间
	var pop_new_trend_time = new Date().getTime();
	
	if ($('.js-get-new-trend').length > 0 && pop_new_trend_time - pop_new_trend >= 0) {
		getNewTrend();  // 获取最新推荐
	}

    // 关闭弹框
	$('.js-new-trends-bg, .js-new-trends-fix .trends-msg-close').on('click', function () {
		$('.js-new-trends-fix').addClass('trends-fix-start');
		$('.js-new-trends-fix').fadeOut(280, function () {
			$('html, body').removeClass('overflow-hid');
		});
		var trend_time=(new Date(getNowDate())).getTime()+24*3600*1000;
		pop_fashion_global.fn.setSto('pop_new_trend', trend_time);	//存储
    });
    
    $('.js-new-trends, .js-trends-pics, .js-trends-navs').on('click', 'a', function(){
        if( $(this).attr('target') == '_blank' ){
            var trend_time=(new Date(getNowDate())).getTime()+24*3600*1000;
		    pop_fashion_global.fn.setSto('pop_new_trend', trend_time);	//存储
        }
    })


	$('.js-get-new-trend').on('click', function () {
		getNewTrend();  // 获取最新推荐
	});

	// 获取最新推荐
	function getNewTrend() {

		if (is_new_trends_fix) {
			return;
		}
		is_new_trends_fix = true;
		$('html, body').addClass('overflow-hid');
        $('.js-new-trends-fix').show();
        

        newtrendStart();
		setTimeout(function () {
			$('.js-new-trends-fix').removeClass('trends-fix-start');
		}, 50);
        
        $.ajax({
            url: '/ajax/getRecommendFrame/?r=' + Math.random(),
            type: 'get',
            dataType: "json",
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                var code = data.code, _data = data.data;
                if (code == 0) {
                    setNewtrend(_data);	//写入数据
                }
                is_new_trends_fix = false;
            },
            error: function () {
                is_new_trends_fix = false;
            }
        });

    }
    

    // 初始化弹框
    function newtrendStart(){
        $('.js-new-trends-fix').addClass('trends-fix-start');

        $('.js-new-trends-fix .new-trends-list').addClass('load-start');
		$('.js-new-trends-fix .js-new-trends').html('');
		$('.js-new-trends-fix .js-trends-pics>ul').html('');
        $('.js-new-trends-fix .report-new').html('');
        $('.js-new-trends-fix .js-trends-navs').html('');
        $('.js-new-trends-fix .trends-nav').hide();
        $('.js-new-trends-fix .new-trends-bott').hide();
        $('.js-new-trends-fix .is-user').removeClass('user-type4').removeClass('user-type5');
        $('.js-new-trends-fix .is-user>p').text('');
        
    }

	// 最新推荐dom
	function setNewtrend(data) {
		var data = data || {};
        var report_list = data.report_list || [], guide_bar = data.guide_bar[0] || {}, recommend_ads = data.recommend_ads || [], user_type = data.user_type || 0, style = data.style || {}, pattern=data.pattern||{}, runways=data.runways||{}, brands=data.brands||{};
        
        var nav_html = '<li class="sec-nav"><a href="javascript:void(0);">趋势分析</a><i></i></li>'
        var style_html = '<li><a href="'+(style.link||'')+'" target="_blank" title="款式集结"><div>款式集合</div><p>近日更新</p><span>'+(style.count||0)+'<span>款</span></span></a></li>'

        var pattern_html = '<li><a href="'+(pattern.link||'')+'" target="_blank" title="图案素材"><div>图案素材</div><p>近日更新</p><span>'+(pattern.count||0)+'<span>款</span></span></a><div class="bord-top"></div></li>'

        var runways_html = '<li><a href="'+(runways.link||'')+'" target="_blank" title="T台秀场"><div>T台秀场</div><p>近日更新</p><span>'+(runways.count||0)+'<span>场</span></span></a><div class="bord-top"></div></li>'

        var brands_html = '<li><a href="'+(brands.link||'')+'" target="_blank" title="发现品牌"><div>发现品牌</div><p>品牌趋势</p><span>'+(brands.count||0)+'</span></a><div class="bord-top"></div></li>'

        nav_html = nav_html + style_html + pattern_html + runways_html + brands_html;

		var report_list_html = '', guide_bar_html = '', recommend_ads_html = '';
		for (var i = 0; i < report_list.length; i++) {
			var columnId = report_list[i].columnId || '';
			var id = report_list[i].list.id || '';
			var tableName = report_list[i].tableName || '';
			var cover = report_list[i].list.cover || '';
			var title = report_list[i].list.title || '';

			report_list_html += '<li><a href="/details/report/t_' + tableName + '-id_' + id + '-col_' + columnId + '/" target="_blank" title="' + title + '"><img src="' + cover + '" alt="">';
			report_list_html += '<div class="new-item">' + title + '</div></a></li>';
		}

		// 最新免费资源
		if (guide_bar.sLink) {
			guide_bar_html += '<a href="' + guide_bar.sLink + '" target="_blank"><img src="' + guide_bar.sImagePath + '" alt=""></a>';
		}

		// banner 广告位
		if (recommend_ads.length) {
            for (var j = 0; j < recommend_ads.length; j++) {
                var sTitle = recommend_ads[j].sTitle || '';
                var sImagePath = recommend_ads[j].sImagePath || '';
                var sLink = recommend_ads[j].sLink || '';
                recommend_ads_html += '<li><a href="'+sLink+'" target="_blank" title="'+sTitle+'"><img src="'+sImagePath+'" alt="'+sTitle+'"></a></li>'
            }
        }
        
        $('.js-new-trends-fix .new-trends-list').removeClass('load-start');
		$('.js-new-trends-fix .js-new-trends').html(report_list_html);
		$('.js-new-trends-fix .js-trends-pics>ul').html(recommend_ads_html);
        $('.js-new-trends-fix .report-new').html(guide_bar_html);
        $('.js-new-trends-fix .js-trends-navs').html(nav_html);
        $('.js-new-trends-fix .trends-nav').show();

		$('.js-new-trends-fix .new-trends-bott').show();
		if (user_type == 5) {		//游客
			$('.js-new-trends-fix .is-user').removeClass('user-type4').addClass('user-type5');
			$('.js-new-trends-fix .is-user>p').text('以上为付费报告，登录后可查看部分免费内容。');

		} else if (user_type == 4) {		//普通用户
			$('.js-new-trends-fix .is-user').removeClass('user-type5').addClass('user-type4');
			$('.js-new-trends-fix .is-user>p').text('想体验完整网站？联系客服开通完整免费试用。');
		} else {
			$('.js-new-trends-fix .new-trends-bott').hide();
			$('.js-new-trends-fix .is-user').removeClass('user-type4').removeClass('user-type5');
		}

	}





	// 会员是否过期
	pop_fashion_global.fn.subAjaxGet({
		url: '/ajax/getVipExpireInfo',
		successFunc: function (data) {
			var message = data["message"] ? data["message"] : "";
			var _html = "";
			var expire_time = $(".js-expire-time");
			if (message != "") {
				_html += '<button><span></span>' + message + '</button>';
				$(".js-expire-right").append(_html);
				var wid = expire_time.width();
				var auto_wid = expire_time.css('width', 'auto').width();
				expire_time.width(wid).animate({ width: auto_wid - 1 }, 500);
				expire_time.show();
			}
		},
		errorFunc: null
	});





	function getNowDate(){
		var date=new Date();
		var y=date.getFullYear();
		var m=date.getMonth()+1;
		var d=date.getDate();
		return y+"/"+m+"/"+d;
	};
});


