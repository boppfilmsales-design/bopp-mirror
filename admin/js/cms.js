/* XgxCms 静态版后台数据层：localStorage 存储 + 登录校验 + 栏目定义 */
var CMS = (function(){
	// 栏目定义（与源站一致：pid 分组 + 子栏目 c_id）
	var GROUPS = [
		{pid:1, title:'关于我们', subs:[{c_id:13,name:'About Us'},{c_id:55,name:'Main Products'},{c_id:16,name:'Honor'},{c_id:56,name:'Culture'},{c_id:169,name:'Branch Companies'},{c_id:171,name:'Factory & Warehouse'},{c_id:172,name:'Course'}]},
		{pid:2, title:'新闻中心', subs:[{c_id:41,name:'Industry News'},{c_id:49,name:'Company News'},{c_id:52,name:'Employees Literary '}]},
		{pid:33,title:'产品展示', subs:[{c_id:34,name:'BOPET Film (Polyester Film)'},{c_id:48,name:'BOPP Film (Polypropylene film)'},{c_id:57,name:'BOPP Packing Tape Jumbo Rolls'},{c_id:58,name:'BOPP/BOPET Thermal Laminating Film coated EVA'},{c_id:59,name:'POF Shrink Film (Polyolefin)'},{c_id:60,name:'BOPS Window Envelope Film'},{c_id:70,name:'BOPS Sheets'},{c_id:61,name:'CPP Film'},{c_id:62,name:' PE，PVC Film'},{c_id:64,name:'Copy Paper,Photo paper'},{c_id:67,name:'Adhesive Labels & Barcode Ribbons'},{c_id:68,name:'Self Adhesive Tear Tape'},{c_id:69,name:'Tear Clips & Band'},{c_id:152,name:'BOPA Film'},{c_id:178,name:'Film Machine Lines '},{c_id:184,name:'Engineers for Installation, commissioning, maintenance, guidance, equipment and film'},{c_id:65,name:'Aluminium Foil & Steel'},{c_id:200,name:'Current Transformer'}]},
		{pid:20,title:'其他', subs:[{c_id:21,name:'banner-首页'},{c_id:31,name:'友情链接'},{c_id:47,name:'公司介绍-首页'}]},
		{pid:29,title:'联系我们', subs:[{c_id:32,name:'General Information'},{c_id:155,name:'Get Contacts'},{c_id:156,name:'Send Inquiry'},{c_id:162,name:'Give Advice To Seller'}]},
		{pid:42,title:'下载中心', subs:[{c_id:43,name:"Company's Notice"},{c_id:76,name:'Technology Data Download '},{c_id:157,name:'Certificate Download'},{c_id:158,name:'MSDS  Download'}]},
		{pid:44,title:'产品生产线', subs:[{c_id:45,name:'Packing Film Production Lines'},{c_id:142,name:'BOPP Film Production Lines'},{c_id:143,name:'BOPET Film Production Lines'},{c_id:144,name:'Tape Production Lines'},{c_id:149,name:'Thermal Lamination Film Production Lines'},{c_id:164,name:'Bruckner Production Lines (Germany)'},{c_id:165,name:'Mitsubishi Production Lines (Japan)'},{c_id:167,name:'Copy Paper Production Lines'},{c_id:173,name:'Silver Metallized Film Production Lines'},{c_id:174,name:'POF Film Production Lines'}]},
		{pid:53,title:'案例', subs:[{c_id:54,name:'Development Cases'},{c_id:145,name:'To Buyers '},{c_id:146,name:'To Markets'},{c_id:147,name:'To Ourselves'}]},
		{pid:78,title:'服务', subs:[{c_id:79,name:'Useful Links Service'},{c_id:141,name:'Company Announcement '},{c_id:148,name:'Useful Knowledge'},{c_id:199,name:'Vessel Shipping Lines'}]}
	];
	
	// 子分类映射（大类 c_id -> [子分类 c_id]）, 与源站一致
	var SUBS = {34:[66,71,72,73,74,75,177],48:[80,81,82,83,84,85,86,87,88,153,163,195],57:[89,90,91,92,93,94,154],58:[95,96,150,151,170],59:[97,98,99,100],60:[101,102,175,197,198],70:[103],61:[104,105,106,107],62:[108,109,110,111,176],64:[117,118,119,120,121,125,166],67:[126,127,128,129,130,131,132,133,194],68:[134,135,136,137,138,139,140],69:[160,161],178:[179,180,181,182,183],184:[185],65:[123,124,193],200:[201]};
	function subName(cid){
		// 从已有 GROUPS subs 查名, 否则用 SUBS 顺序生成
		for(var i=0;i<GROUPS.length;i++){ for(var j=0;j<GROUPS[i].subs.length;j++){ if(GROUPS[i].subs[j].c_id==cid) return GROUPS[i].subs[j].name; } }
		return '子栏目'+cid;
	}
	var COL = '_xgxcms_cols_';   // 栏目配置 localStorage key
	var INF = '_xgxcms_infos_';  // 内容
	var MSG = '_xgxcms_msgs_';   // 留言
	var CFG = '_xgxcms_cfg_';    // 站点配置
	var ADM = '_xgxcms_adms_';   // 管理员
	var ROL = '_xgxcms_roles_';  // 角色
	var SESS = 'xgxcms_admin';

	function load(k, def){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return def; } }
	function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }


	// 种子版本（更新种子时 +1 强制重填）
	var SEED_VER = 'v4';
	// 首次使用：从静态页抽取的种子数据填充 localStorage
	function initSeed(){
		if(typeof XGXCMS_SEED!=='undefined' && XGXCMS_SEED){
			var lastVer='';
			try{ lastVer=localStorage.getItem('_xgxcms_seedver_')||''; }catch(e){}
			if(lastVer!==SEED_VER){
				save(INF, XGXCMS_SEED);
				try{ localStorage.setItem('_xgxcms_seedver_', SEED_VER); }catch(e){}
				return;
			}
			var all=load(INF, {});
			var changed=false;
			for(var k in XGXCMS_SEED){
				if(!all[k]){ all[k]=XGXCMS_SEED[k]; changed=true; }
			}
			if(changed) save(INF, all);
		}
	}
	initSeed();
	return {
		GROUPS: GROUPS,
		SUBS: SUBS,
		subName: subName,
		groupByPid: function(pid){ for(var i=0;i<GROUPS.length;i++){ if(GROUPS[i].pid==pid) return GROUPS[i]; } return null; },
		colName: function(cid){ for(var i=0;i<GROUPS.length;i++){ for(var j=0;j<GROUPS[i].subs.length;j++){ if(GROUPS[i].subs[j].c_id==cid) return GROUPS[i].subs[j].name; } } return '栏目'+cid; },
		// 栏目（pid 与 c_id 的父子关系）
		getCols: function(){ return load(COL, {}); },
		setCols: function(v){ save(COL, v); },
		// 内容
		getInfos: function(cid){ return load(INF, {})[cid] || []; },
		setInfos: function(cid, list){ var all=load(INF, {}); all[cid]=list; save(INF, all); },
		addInfo: function(cid, item){ var list=this.getInfos(cid); item.i_id=list.length? Math.max.apply(null, list.map(function(x){return x.i_id;}))+1 : 1; list.unshift(item); this.setInfos(cid, list); return item; },
		delInfo: function(cid, iid){ this.setInfos(cid, this.getInfos(cid).filter(function(x){ return x.i_id!=iid; })); },
		getInfo: function(cid, iid){ var l=this.getInfos(cid); for(var i=0;i<l.length;i++){ if(l[i].i_id==iid) return l[i]; } return null; },
		updInfo: function(cid, iid, item){ var l=this.getInfos(cid); for(var i=0;i<l.length;i++){ if(l[i].i_id==iid){ l[i]=item; } } this.setInfos(cid, l); },
		// 留言
		getMsgs: function(){ return load(MSG, []); },
		addMsg: function(m){ var l=this.getMsgs(); m.m_id=l.length? Math.max.apply(null, l.map(function(x){return x.m_id;}))+1 : 1; l.unshift(m); save(MSG, l); return m; },
		delMsg: function(mid){ save(MSG, this.getMsgs().filter(function(x){ return x.m_id!=mid; })); },
		getMsg: function(mid){ var l=this.getMsgs(); for(var i=0;i<l.length;i++){ if(l[i].m_id==mid) return l[i]; } return null; },
		// 配置
		getCfg: function(){ return load(CFG, {}); },
		setCfg: function(v){ save(CFG, v); },
		// 管理员
		getAdms: function(){ return load(ADM, [{id:1, title:'超级管理员', name:'xgxadmin', level:1, role:'超级管理员'}]); },
		setAdms: function(v){ save(ADM, v); },
		// 角色
		getRoles: function(){ return load(ROL, [{id:1, name:'超级管理员'}]); },
		setRoles: function(v){ save(ROL, v); },
		// 会话（直接读写 localStorage，不用 JSON.parse —— 登录存的是原始字符串）
		isLogin: function(){ try{ return !!localStorage.getItem(SESS); }catch(e){ return false; } },
		login: function(){ try{ localStorage.setItem(SESS, 'xgxadmin'); }catch(e){} },
		logout: function(){ try{ localStorage.removeItem(SESS); }catch(e){} },
		// 工具
		esc: function(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },
		now: function(){ var d=new Date(); function p(n){ return (n<10?'0':'')+n; } return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds()); }
	};
})();
function cms_guard(){ if(!CMS.isLogin()){ location.href='login.html'; } }
