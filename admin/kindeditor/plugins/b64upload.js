/**
 * kindeditor 图片上传补丁：把"本地上传"改为 FileReader 转 base64 直接插入编辑区。
 * 静态站无后端，不能用 iframe/flash 提交；用 FileReader 读取本地图 → dataURL → insertHtml。
 * 用法：在 KindEditor.create 后调用 patchKindEditorUpload(K) 并传入 editor 实例。
 */
function patchKindEditorUpload(editor) {
	// 覆盖 editor 的 uploadJson 行为 —— 拦截 K.uploadbutton 的 iframe 提交
	if (!editor || !editor.imageDialog) return;
	var _orig = editor.imageDialog;
	editor.imageDialog = function(options) {
		// 注入 base64 上传：在弹窗内添加"选择图片"按钮 + 预览
		var clickFn = options.clickFn;
		var _showLocal = options.showLocal;
		// 扩展 options：让弹窗加载后注入本地上传
		options.clickFn = function(url, title, width, height, border, align) {
			clickFn && clickFn.call(this, url, title, width, height, border, align);
		};
		var r = _orig.call(this, options);
		// 弹窗 DOM 生成后注入 base64 上传控件
		setTimeout(function(){
			var dlg = $('.ke-dialog-content').last();
			if (!dlg.length) return;
			var box = $('<div class="ke-dialog-row" style="margin-top:8px;">' +
				'<label style="width:60px;">本地上传:</label>' +
				'<input type="file" id="ke_b64_file" accept="image/*" style="width:auto;" />' +
				'<span style="color:#999;font-size:12px;margin-left:6px;">选择本地图片将自动插入(base64)</span></div>');
			dlg.find('.tabs').after(box);
			$('#ke_b64_file', dlg).on('change', function(){
				var f=this.files && this.files[0];
				if(!f) return;
				if(f.size>2*1024*1024){ alert('图片过大，请压缩到2MB内'); return; }
				var rd=new FileReader();
				rd.onload=function(){
					var data=rd.result;
					// 关闭弹窗并插入
					$('.ke-dialog-mask,.ke-dialog').hide();
					editor.insertHtml('<img src="'+data+'" alt="" />');
				};
				rd.readAsDataURL(f);
			});
		}, 60);
		return r;
	};
	return editor;
}
