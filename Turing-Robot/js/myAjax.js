function obj2str(data){
	var res = [];
	data.t = new Date().getTime();
	for(var key in data){
		//encodeURIComponent 将传入的参数中的中文转换成编码
		res.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
	}
	return res.join("&");
}
//自定义ajax函数，接受一个对象作为参数传递
function ajax(option){
	//1..将对象转换为要传递给服务器的字符串
	var str = obj2str(option.data);
	//2.创建异步对象
	var xmlhttp,timer;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(option.type.toLowerCase() === "get"){
		//3.设置请求方式和请求地址(GET方式)
		xmlhttp.open(option.type,option.url+"?"+str,true);
		//4.发送请求(GET方式)
		xmlhttp.send();
	}else{
		//3.设置请求方式和请求地址(POST方式)	
		xmlhttp.open(option.type,option.url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		//4.发送请求(POST方式)
		xmlhttp.send(str);
	}	
	//5.监听状态的变化
	xmlhttp.onreadystatechange = function(){
		/*
		 0:请求未初始化
		 1：服务器连接已建立
		 2：请求已接收
		 3：请求处理中
		 4：请求已完成，且响应已就绪
		 */
		if(xmlhttp.readyState == 4){
			clearInterval(timer);
			if(xmlhttp.status >=200 && xmlhttp.status < 300 || xmlhttp.status == 304){
				option.success(xmlhttp);
			}else{
				option.error(xmlhttp);
			}
		}
	}
	//判断外界是否传入了超时时间
	if(option.timeout){
		timer = setInterval(function(){
			//console.log("中止请求");
			xmlhttp.abort();  //中断请求
			clearInterval(timer);
		},option.timeout);
	}
}