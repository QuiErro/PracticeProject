$(function(){
	var lastId = parseInt(window.localStorage.getItem("lastId")) || 0; // 记录id最大数
	var to_count = 0;   // 记录#todoList有几条数据
	var done_count = 0; // 记录#doneList有几条数据
	var text_title = ''; // 记录新建数据时的文本
	var ori_text = '';   // 记录修改时，原先的文本
	
	//初始化todoList和doneList
	initList();
	
	//自定义滚动条初始化
	$("#todoList").mCustomScrollbar();
	$("#doneList").mCustomScrollbar();
	
	$("#todoList").mCustomScrollbar("scrollTo","bottom"); // 自动滚动到滚动条的最底部
	$("#doneList").mCustomScrollbar("scrollTo","bottom");
	/**
	//自定义弹窗口
	$("#mb_ico").click(function(){
		$("#mb_con").hide();
	});
	$("#mb_btn_ok").click(function(){
		$("#mb_con").hide();
	});
	$("#mb_btn_no").click(function(){
		$("#mb_con").hide();
	});
	*/
	// 自定义弹窗模板 
	var MyBox = Swal.mixin({
		toast: true,
		showCancelButton: false,
		showConfirmButton: false,
		animation: false,
		timer: 2000
	});

	// 添加按钮的点击事件
	$("#add").click(function(){
		$("#mb_con").removeClass('animated shake');
		text_title = $("#title").val();
		if(text_title === ''){
			/**
			$("#mb_con").addClass('animated shake');
			$("#mb_msg").text('内容不得为空！');
			$("#mb_con").show();	
			*/
			MyBox.fire({
				type: 'error',
				title: '添加的内容不得为空！',
				customClass: 'animated shake'
			});
			return ;
		}	
		createToDo({
			id: lastId,
			msg: text_title,
			state: 1  //表示未完成
		});
		$("#title").val('');
		MyBox.fire({
			type: 'success',
			title: '添加成功',
			customClass: 'animated tada'
		});
		$("#todoList").mCustomScrollbar("update");
		$("#todoList").mCustomScrollbar("scrollTo","bottom");  
	});
	
	// 头部文本框的键盘事件
	$("#title").keypress(function(event){
		event = event || window.event;
		if(event.keyCode === 13){
			$("#mb_con").removeClass('animated shake');
			text_title = $("#title").val();
			if(text_title === ''){
				/**
				$("#mb_con").addClass('animated shake');
				$("#mb_msg").text('内容不得为空！');
				$("#mb_con").show();
				*/
				MyBox.fire({
					type: 'error',
					title: '添加的内容不得为空！',
					customClass: 'animated shake'
				});
				return ;
			}
			createToDo({
				id: lastId,
				msg: text_title,
				state: 1  //表示未完成
			});
			$("#title").val('');
				MyBox.fire({
					type: 'success',
					title: '添加成功',
					customClass: 'animated tada'
				});
			$("#todoList").mCustomScrollbar("update");
			$("#todoList").mCustomScrollbar("scrollTo","bottom");  
		}
	});
	
	// 清空按钮的点击事件
	$("#clear").click(function(){
		to_count = 0;
		done_count = 0;
		$("#todoCount").text(to_count);
		$("#doneCount").text(done_count);
		$("#todoList").html('');
		$("#doneList").html('');
		window.localStorage.clear();
	});
	
	// 事件委托--checkbox
	$("#todoList").delegate(".li_checkbox", "click", function () {
		if($(this).get(0).checked){
			$(this).get(0).checked = false;
			
			var _this = $(this);
			findAndUpdate({
				id: parseInt(_this.parent().attr("id")),
				msg: _this.parent().children(".li_span").eq(0).text(),
				state: 0
			});
			to_count--;
			done_count++;
			$("#todoCount").text(to_count);
			$("#doneCount").text(done_count);
			$(this).parent().remove().appendTo("#doneList .mCSB_container");
			$("#todoList").mCustomScrollbar("update");
			$("#doneList").mCustomScrollbar("update");
			$("#todoList").mCustomScrollbar("scrollTo","bottom");  // 自动滚动到滚动条的最底部
			$("#doneList").mCustomScrollbar("scrollTo","bottom");
		}
    });
    $("#doneList").delegate(".li_checkbox", "click", function () {
    	if($(this).get(0).checked){
    		$(this).get(0).checked = false;
    		
    		var _this = $(this);
			findAndUpdate({
				id: parseInt(_this.parent().attr("id")),
				msg: _this.parent().children(".li_span").eq(0).text(),
				state: 1
			});
			to_count++;
			done_count--;
			$("#todoCount").text(to_count);
			$("#doneCount").text(done_count);
			$(this).parent().remove().appendTo("#todoList .mCSB_container");
			$("#todoList").mCustomScrollbar("update");
			$("#doneList").mCustomScrollbar("update");
			$("#todoList").mCustomScrollbar("scrollTo","bottom");
			$("#doneList").mCustomScrollbar("scrollTo","bottom");
	    }
    });
	
	// 事件委托 -- a标签
	$("#todoList").delegate(".li_a", "click", function () {
		window.localStorage.removeItem($(this).parent().attr("id"));
		to_count--;
		$("#todoCount").text(to_count);
		$(this).parent().remove();
		$("#todoList").mCustomScrollbar("update");
		$("#doneList").mCustomScrollbar("update");
		$("#todoList").mCustomScrollbar("scrollTo","bottom");
		$("#doneList").mCustomScrollbar("scrollTo","bottom");
    });
    $("#doneList").delegate(".li_a", "click", function () {
		window.localStorage.removeItem($(this).parent().attr("id"));
		done_count--;
		$("#doneCount").text(done_count);
		$(this).parent().remove();
		$("#todoList").mCustomScrollbar("update");
		$("#doneList").mCustomScrollbar("update");
		$("#todoList").mCustomScrollbar("scrollTo","bottom");
		$("#doneList").mCustomScrollbar("scrollTo","bottom");
    });
    
    // 事件委托--span
	$("#todoList").delegate(".li_span", "click", function () {
		var _this = $(this);
		if($(this).find('.text').length == 0){
			ori_text = $(this).text();
			var in_text = $("<input type='text' class='text'>");
			in_text.val(ori_text);
			$(this).html(in_text);
		}
		
		in_text.focus();
		in_text.blur(function(){
			confirm();
		});
		in_text.keypress(function(ev){
			ev = event || window.event;
			if (ev.keyCode == 13){
			    confirm();
			}
		});
		
		function confirm() {
			if (!in_text.val()) {
			   	_this.html('');
			   	_this.text(ori_text);
			}
			else {
				ori_text = in_text.val();
			   	findAndUpdate({
			   		id: parseInt(_this.parent().attr("id")),
			   		msg: ori_text,
			   		state: parseInt(_this.parent().attr("state"))
			   	});   
			    _this.html('');
			   	_this.text(ori_text);
			}
		}
    });
	
	// 新建一条记录并处理相关信息的变化
	function createToDo(op){
		to_count++;
		window.localStorage.setItem(""+op.id,JSON.stringify(op));
		lastId++;
		window.localStorage.setItem("lastId",JSON.stringify(lastId));
		var new_li = $("<li><input type='checkbox' class='li_checkbox'/><span class='li_span'>" + op.msg + "</span><a class='li_a'>删除</a></li>");
		new_li.attr("id", ""+op.id);
		new_li.attr("state", ""+op.state);		
		$("#todoList .mCSB_container").append(new_li);
		$("#todoCount").text(to_count);
	}
	
	//初始化List 
	function initList(){	
		$("#todoList").html('');
		$("#doneList").html('');
		to_count = 0;
		done_count = 0;
		
		for(var i=0; i<lastId; i++){
			var new_op = $.parseJSON(window.localStorage.getItem(""+i));
			if(new_op){
				var new_li = $("<li><input type='checkbox' class='li_checkbox'/><span class='li_span'>" + new_op.msg + "</span><a class='li_a'>删除</a></li>");
				new_li.attr("id", ""+new_op.id);
				new_li.attr("state", ""+new_op.state);
				if(new_op.state === 1){
					to_count++;
					$("#todoList").append(new_li);
				}else{
					done_count++;
					$("#doneList").append(new_li);
				}
			}			
		}	
		$("#todoCount").text(to_count);
		$("#doneCount").text(done_count);
	}
	
	//查找并更新某条数据
	function findAndUpdate(op){
		for(var i=0; i<lastId; i++){
			var new_op = $.parseJSON(window.localStorage.getItem(""+i));
			if(new_op){
				if(new_op.id === op.id){
					new_op.msg = op.msg;
					new_op.state = op.state;
					window.localStorage.setItem(""+i,JSON.stringify(new_op));
					return;
				}
			}			
		}
	}
});
