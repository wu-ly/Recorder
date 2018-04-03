/* 存储数据
 * server - 服务器连接地址，端口127.0.0.1:8080
 * username - 用户名
 * password - 密码
 * user - 用户id
 * login - 登录状态，0-失败；1-成功
 */

var img_list = null; // HTML中用于添加图片显示的列表 see @onAddImage

// 拍照
function captureImage() {
	var camera = plus.camera.getCamera();
	var fmt = camera.supportedImageFormats[0];
	camera.captureImage(onCaptureSuccess, onCaptureError, {
		format: fmt
	});
}

function onCaptureSuccess(e) {
	plus.io.resolveLocalFileSystemURL(e, function(entry) {
		_addImage(entry.toLocalURL());
	})	
}

function onCaptureError(e) {
	mui.toast("拍照失败！",{duration : 1500,type : "div"});
}

// 添加图片
// holder：HTML中图片显示的list
function onAddImage(holder){
	img_list = holder;
	// 弹出系统选择按钮框
	plus.nativeUI.actionSheet( {title:"请选择图片",cancel:"取消",buttons:[{title:"拍照"},{title:"相册选取"}]}, function(e){
		if(e.index == 1){
			captureImage();
		}else if(e.index == 2){
			plus.gallery.pick( function(e){ 
		    	for(var i in e.files){
			    	_addImage(e.files[i]);
		    	}
		    }, function (e) {
		    	//
		    },{filter:"image",multiple:true});
		}
	});
}

function _addImage(image){
	var li = document.createElement("li");
	li.classList.add("mui-table-view-cell");
	li.classList.add("mui-media");
	li.classList.add("mui-col-xs-3");
	li.classList.add("mui-col-sm-2");
	
	var img = document.createElement("img");
	img.src = image;
	// 添加长按删除事件
	img.addEventListener('longtap',function(){
		mui.confirm("确定要删除该图片吗？","删除",['取消','确定'],function(e){ // e.index = 0 , 1
			if(e.index == 1){
				_deleteImage(img);
			}
		},"div");
	})
	
	li.appendChild(img);
	img_list.insertBefore(li,img_list.children[img_list.children.length - 1]);
}

function _deleteImage(image){
	var li = image.parentNode;
	img_list.removeChild(li);
}

// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 
