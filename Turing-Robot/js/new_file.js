window.onload = function(){
	var input_text = document.querySelector(".chatPage input");
    var send_btn = document.querySelector(".send_btn");
    var msg_robot = document.querySelector(".msg_robot");
    var msg_user = document.querySelector(".msg_user");
    var chatContent = document.querySelector(".chatContent");
    var apikey = ["fb37773dc73b479982c8be1e5d9a547b","6b9cc8ad877b4ccf840d9d48e4c7e216","6af4483a3a32426bbc514e54a3691626"];
 
    /*机器人聊天函数 */
    function chat() {
    	var index = Math.round(Math.random()*2);
        var sayContent = input_text.value;
        if(!sayContent){
        	return;
        }
        ajax({
	        	url : "http://www.tuling123.com/openapi/api",
	        	type : "post",
	        	data : {
	        		"key" : apikey[index],
	        		"userid" : "123456",
	        		"info" : sayContent
	        	},
	        	timeout : 3000,
	        	success : function(xhr){
					var res = xhr.responseText;
					//将res从JSON文本解析为对象
					var obj = JSON.parse(res);	
					//克隆user节点
		            var newNodeUser = msg_user.cloneNode(true);
		            newNodeUser.firstElementChild.innerHTML = sayContent;
		            newNodeUser.style.display = "block";
		            chatContent.appendChild(newNodeUser);
		            
		            //查看响应回复的信息的类型
		            var msgRobot_text = obj.text;
		            //如果响应内容包含图片或网页链接（适用于：链接类、列车类、航班类）
		            if(obj.url){
		                msgRobot_text += "<a href='"+obj.url+"' target='_blank'>查看图片</a>";
		            }	 		
		 			//判断菜谱信息
		            if(obj.list && obj.code== 308000){
		                msgRobot_text += " 菜式名称："+obj.list[0].name+" 菜谱原料："+obj.list[0].info+" 菜谱原址："+"<a href='"+obj.list[0].detailurl+"' target='_blank'>查看菜谱详情.</a>";
		            }
		            //判断新闻信息
		            if(obj.list && obj.code== 302000){
		                msgRobot_text += " 文章标题："+obj.list[0].article+" 文章来源："+obj.list[0].source+" 新闻原址："+"<a href='"+obj.list[0].detailurl+"' target='_blank'>查看新闻详情.</a>";
		            }
		            //克隆robot节点
		            var newNodeRobot = msg_robot.cloneNode(true);
		            newNodeRobot.lastElementChild.innerHTML = msgRobot_text;
		            newNodeRobot.style.display = "block";
		            chatContent.appendChild(newNodeRobot);
		            
					//设置自动滚动文本聊天信息
		            autoScroll(chatContent);
		            //请求成功，清空input栏的值
		            input_text.value = "";
				},
				error : function(xhr){
					alert(xhr.status);
				}
        });
 	}
    /*自动滚动函数*/
    function autoScroll(parentEle) {
        setTimeout(function step() {
            var scroll_top = parentEle.scrollTop;
            parentEle.scrollTop += scroll_top + 4;
            //设置定时器关闭的条件
            if(scroll_top == parentEle.scrollTop) return;
            setTimeout(step,20);
        },0);
    }
   /*给send按钮设置点击响应函数 */
    send_btn.onclick = chat;
 
    /*设置键盘响应函数*/
    document.onkeydown=function (ev) {
    	ev = window.event || ev;
        if(ev.keyCode == 13){
            chat();
        }
    }
};