/* 前台留言表单增强：提交写入 localStorage（后台留言板可查看） */
(function(){
	function onReady(){
		// 所有含 name=m_email 的表单（contact页 + 各页弹窗）
		var forms=document.querySelectorAll('form');
		for(var i=0;i<forms.length;i++){
			var f=forms[i];
			if(f.querySelector('[name=m_email]')){
				f.addEventListener('submit', function(e){
					e.preventDefault();
					var email=this.querySelector('[name=m_email]').value;
					var name=(this.querySelector('[name=m_name]')||{}).value||'';
					var phone=(this.querySelector('[name=m_phone]')||{}).value||'';
					var content=(this.querySelector('[name=m_content]')||{}).value||'';
					if(!email){ alert('请填写邮箱'); return; }
					try{
						var all=JSON.parse(localStorage.getItem('_xgxcms_msgs_')||'[]');
						var d=new Date();
						function p(n){return (n<10?'0':'')+n;}
						all.unshift({m_id:(all.length?Math.max.apply(null,all.map(function(x){return x.m_id;}))+1:1), email:email, name:name, phone:phone, content:content, addtime:d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())});
						localStorage.setItem('_xgxcms_msgs_', JSON.stringify(all));
					}catch(err){}
					alert('留言已提交，感谢您的咨询！');
					// 重置表单
					this.reset();
				});
			}
		}
	}
	if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); }
	else{ onReady(); }
})();
