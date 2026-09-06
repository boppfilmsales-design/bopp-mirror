/* XgxCms 静态版后台数据层 v5
 * 架构：基础内容 = XGXCMS_SEED（JS 常量，浏览器缓存，无存储限制）
 *      用户修改 = localStorage 差异存储（_xgxcms_overrides_，极小）
 *      所有读取 = 基础 + 覆盖
 */
var CMS = (function(){
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
	var SUBS = {34:[66,71,72,73,74,75,177],48:[80,81,82,83,84,85,86,87,88,153,163,195],57:[89,90,91,92,93,94,154],58:[95,96,150,151,170],59:[97,98,99,100],60:[101,102,175,197,198],70:[103],61:[104,105,106,107],62:[108,109,110,111,176],64:[117,118,119,120,121,125,166],67:[126,127,128,129,130,131,132,133,194],68:[134,135,136,137,138,139,140],69:[160,161],178:[179,180,181,182,183],184:[185],65:[123,124,193],200:[201]};
	var SUBSNAME = {"66": "BOPET Thermal Transfer Film 4.5Microns Clear", "71": "BOPET Plain Film Printing & Laminating", "72": "BOPET Capacitor Film Clear & Metallized", "73": "Vacuum Aluminum Metallized BOPET Polyester Film", "74": "BOPET Insulating Thicker Film (50-500 Microns)", "75": "BOPET Milky/White Film", "177": "B Grade BOPET Film", "80": "BOPP Printing & Laminating Film", "81": "BOPP Heat Sealable Film", "82": "BOPP Pearlized Film", "83": "BOPP Tobacco Cigarette Wrapping Film", "84": "BOPP Flower Wrapping Film", "85": "BOPP Capacitor Film", "86": "BOPP ZN/AL Metallized Capacitor Film Silver", "87": "BOPP Office Use Bags", "88": "BOPP Anti-Fog Film", "153": "BOPP Matte Film (15,18,20 Microns) Matt Polypropylene Film", "163": "BOPP Color Printed Film", "195": "BOPP Metallized film aluminium silver", "89": "BOPP Crystal Clear Tape Jumbo Rolls", "90": "BOPP Tape Jumbo Rolls", "91": "BOPP Carton Packing Tape", "92": "Masking Tape Jumbo Rolls", "93": "Double Sides Adhesive Tape Jumbo Rolls", "94": "BOPP Finished Smaller Roll Tape", "154": "Adhesive Glue (Acrylic Water Based) For Packing Tape", "95": "BOPP/BOPET/BOPA Thermal Lamination Film (Glossy & Matte Lamination)", "96": "Soft-Touch Velvet BOPP Thermal Laminating film with EVA Adhesive Coating &Soft Touch Oil", "150": "PVDC Coating Film -K Film (BOPP/BOPA/BOPET Film Coated PVDC)", "151": "Acrylic Acid Coating Film", "170": "Polyester based Thermal Lamination Film", "97": "POF Thermal Shrinkable Cling Film (Polyolefin Shrink Film - Center Folded)", "98": "POF cling film (Polyolefin Shrink Film - Tubular form", "99": "POF macro perforated cling film", "100": "Color POF Thermal Shrinkable Cling Film", "101": "BOPS window envelope film (Biaxially oriented polystyrene film) Glossy", "102": "BOPS window envelope film ( polystyrene film) Matt", "175": "High Shrinkage BOPS Polystyrene Film", "197": "BOPS Food Container Sheet", "198": "BOPS Food Container Rolls", "103": "BOPS Sheets (polystyrene sheets) for food container", "104": "plain/general cast PP film (CPP)", "105": "Retort cast polypropylene film (CPP)", "106": "VMCPP film-Silver metallized CPP film", "107": "White CPP Film", "108": "PE cling film- food packing", "109": "PE pallet wrapping film-  hand use and machine use", "110": "PVC cling food wrapping film", "111": "PE bags", "176": "PVC Shrinkage Film", "117": "70 GSM Copy paper", "118": "75 GSM Copy paper", "119": "80 GSM Copy paper", "120": "LWC paper", "121": "Coated paper", "125": "Photo paper", "166": "Roll Paper", "126": "Adhesive labels in roll or sheets", "127": "Standard Wax Ribbon", "128": "Plus-Wax Ribbon (enhance)", "129": "Flat Head Wax&Resin ribbon (normal)", "130": "Near-Edge Wax&resin-ribbon", "131": "Resin Ribbon", "132": "Wash Care Ribbon", "133": "Color Ribbon Color Ribbon (Wax/resin)", "194": "thermal transfer ribbons&  thermal transfer labels", "134": "Self Adhesive Tear Tape-Clear", "135": "Self Adhesive Tear Tape - Red", "136": "Self Adhesive Tear Tape - Yellow", "137": "Self Adhesive Tear Tape -Golden", "138": "Self Adhesive Tear Tape -Silver", "139": "Self Adhesive Tear Tape -Laser", "140": "SELF-ADHESIVE PET LASER AND LACE TEAR TAPE", "160": "Tear Clips", "161": "PE/PP Belt", "179": "Slitting Machines,Rewind Machines (Import Substitution)", "180": "ALU-Metallized Machines (Import Substitution)", "181": "Coating Machines (Import Substitution)", "182": "BOPP/BOPET Equipment Machine Lines (Import Substitution)", "183": "Printing Machines (Import Substitution)", "185": "Engineers for Installation, commissioning, maintenance, guidance, equipment and film", "123": "Aluminium Foil in food wrapping", "124": "Aluminium Foil", "193": "Stainless Steel", "201": "500A/5A T36 2m wire split core current transformer"};
	var OV = '_xgxcms_overrides_';  // 用户修改（差异）
	var MSG = '_xgxcms_msgs_';
	var CFG = '_xgxcms_cfg_';
	var ADM = '_xgxcms_adms_';
	var ROL = '_xgxcms_roles_';
	var SESS = 'xgxcms_admin';

	function load(k, def){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return def; } }
	function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
	function baseInfos(cid){
		return (typeof XGXCMS_SEED!=='undefined' && XGXCMS_SEED[cid]) ? XGXCMS_SEED[cid].slice() : [];
	}
	function subName(cid){
		if(SUBSNAME && SUBSNAME[cid]) return SUBSNAME[cid];
		for(var i=0;i<GROUPS.length;i++){ for(var j=0;j<GROUPS[i].subs.length;j++){ if(GROUPS[i].subs[j].c_id==cid) return GROUPS[i].subs[j].name; } }
		return '子栏目'+cid;
	}
	function ovGet(){ return load(OV, {}); }
	function ovSet(v){ save(OV, v); }

	return {
		GROUPS: GROUPS, SUBS: SUBS, subName: subName,
		groupByPid: function(pid){ for(var i=0;i<GROUPS.length;i++){ if(GROUPS[i].pid==pid) return GROUPS[i]; } return null; },
		colName: function(cid){ for(var i=0;i<GROUPS.length;i++){ for(var j=0;j<GROUPS[i].subs.length;j++){ if(GROUPS[i].subs[j].c_id==cid) return GROUPS[i].subs[j].name; } } return '栏目'+cid; },
		getInfos: function(cid){
			var list=baseInfos(cid);
			var ov=ovGet()[cid]||{};
			var keys=Object.keys(ov);
			for(var i=0;i<keys.length;i++){
				var iid=keys[i];
				if(ov[iid]===null){ list=list.filter(function(x){ return String(x.i_id)!==iid; }); continue; }
				var found=false;
				for(var j=0;j<list.length;j++){ if(String(list[j].i_id)===iid){ list[j]=ov[iid]; found=true; break; } }
				if(!found){ var it=ov[iid]; it.i_id=parseInt(iid,10); list.unshift(it); }
			}
			return list;
		},
		setInfos: function(cid, list){
			var ov=ovGet();
			var ovc={};
			var seed=baseInfos(cid);
			var seedMap={};
			for(var i=0;i<seed.length;i++){ seedMap[String(seed[i].i_id)]=seed[i]; }
			for(var j=0;j<list.length;j++){
				var it=list[j];
				var s=seedMap[String(it.i_id)];
				if(!s || JSON.stringify(s)!==JSON.stringify(it)){
					var copy={};
					for(var k in it){ copy[k]=it[k]; }
					ovc[String(it.i_id)]=copy;
				}
			}
			for(var iid in seedMap){
				var exists=false;
				for(var j=0;j<list.length;j++){ if(String(list[j].i_id)===iid){ exists=true; break; } }
				if(!exists){ ovc[iid]=null; }
			}
			ov[cid]=ovc;
			ovSet(ov);
			return true;
		},
		addInfo: function(cid, item){
			var list=this.getInfos(cid);
			item.i_id=list.length? Math.max.apply(null, list.map(function(x){return x.i_id;}))+1 : 1;
			list.unshift(item);
			this.setInfos(cid, list);
			return item;
		},
		delInfo: function(cid, iid){ this.setInfos(cid, this.getInfos(cid).filter(function(x){ return x.i_id!=iid; })); },
		getInfo: function(cid, iid){
			var l=this.getInfos(cid);
			for(var i=0;i<l.length;i++){ if(l[i].i_id==iid) return l[i]; }
			return null;
		},
		updInfo: function(cid, iid, item){ item.i_id=iid; this.setInfos(cid, this.getInfos(cid).map(function(x){ return x.i_id==iid?item:x; })); },
		getMsgs: function(){ return load(MSG, []); },
		addMsg: function(m){ var l=this.getMsgs(); m.m_id=l.length? Math.max.apply(null, l.map(function(x){return x.m_id;}))+1 : 1; l.unshift(m); save(MSG, l); return m; },
		delMsg: function(mid){ save(MSG, this.getMsgs().filter(function(x){ return x.m_id!=mid; })); },
		getMsg: function(mid){ var l=this.getMsgs(); for(var i=0;i<l.length;i++){ if(l[i].m_id==mid) return l[i]; } return null; },
		getCfg: function(){ return load(CFG, {}); },
		setCfg: function(v){ save(CFG, v); },
		getAdms: function(){ return load(ADM, [{id:1, title:'超级管理员', name:'xgxadmin', level:1, role:'超级管理员'}]); },
		setAdms: function(v){ save(ADM, v); },
		getRoles: function(){ return load(ROL, [{id:1, name:'超级管理员'}]); },
		setRoles: function(v){ save(ROL, v); },
		isLogin: function(){ try{ return !!localStorage.getItem(SESS); }catch(e){ return false; } },
		login: function(){ try{ localStorage.setItem(SESS, 'xgxadmin'); }catch(e){} },
		logout: function(){ try{ localStorage.removeItem(SESS); }catch(e){} },
		esc: function(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },
		now: function(){ var d=new Date(); function p(n){ return (n<10?'0':'')+n; } return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds()); }
	};
})();
function cms_guard(){ if(!CMS.isLogin()){ location.href='login.html'; } }
