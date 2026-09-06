function openlayurl(url,title,w,h){
	try{
		var id = layer.open({
		  type: 2,
		  title: title,
		  shadeClose: false,
		  area: [w + 'px',h + 'px'],
		  content: url //iframe的url
		});
		return id;
	}catch(e){}
}
function popenlayurl(url,title,w,h){
	try{
		var id = parent.layer.open({
		  type: 2,
		  title: title,
		  shadeClose: false,
		  area: [w + 'px',h + 'px'],
		  content: url //iframe的url
		});
		return id;
	}catch(e){}
}
function refreshvcode(t){
	$.get('../inc/vcode.php',function(data,status){$(t).text(data);});	
}
function uploadpic(id,tab,colid,colpic){
	try{
		var id = layer.open({
		  type: 2,
		  maxmin: true,
		  title: '上传图片',
		  shadeClose: false,
		  area: ['450px','350px'],
		  content: 'upload_pic.php?id='+id+'&tab='+tab+'&colid='+colid+'&colpic='+colpic //iframe的url
		});
		return id;
	}catch(e){}
}
function getfilename(filepath){
	return filepath.substr(filepath.lastIndexOf('/')+1);;  
}
function colorpicker(val,view){
	try{
		var id = layer.open({
		  type: 2,
		  title: '',
		  resize: false,
		  shadeClose: true,
		  area: ['232px','170px'],
		  content: 'js/colorpicker.html?val=' + val + '&view=' + view
		});
		return id;
	}catch(e){}
}