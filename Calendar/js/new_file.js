$(function(){
	var cunrrentYear = new Date().getFullYear();
	var currentMonth = new Date().getMonth();
	var currentDay = new Date().getDate();
	var selectMonth = currentMonth;
	var selectYear = cunrrentYear;
	var selectDay = currentDay;
	var jumpYear = 0;
	var jumpMonth = 0;
	var startX = 0;
	var startY = 0;
	var endX = 0;
	var endY = 0;
	var distanceX = 0;
	var distanceY = 0;
	var box_index = 0;
	
	// 打印当月日期
	printCalendar(cunrrentYear,currentMonth);
	
	// 查看下月日历
	$(".fn_next").on('click',function(){
		nextMonsthShow(selectMonth);
	});
	// 查看上月日历
	$(".fn_prev").on('click',function(){
		prevMonsthShow(selectMonth);
	});
	// 跳转到当前月份日历
	$('.fn_jump').on('click',function(){
		printCalendar(cunrrentYear,currentMonth);
		selectMonth = currentMonth;
		selectYear = cunrrentYear;
		judeJumpStyle();
	});
	// 跳转到任意月份
	$(".select_text").keypress(function(event){
		event = event || window.event;
		if(event.keyCode === 13){
			var strDate = $(this).val();
			var dateArray = [31,28,31,30,31,30,31,31,30,31,30,31];
			if(strDate.match(/^\d{4}-\d{1,2}$/)){
				var dateArr = strDate.split('-');
				jumpYear = parseInt(dateArr[0]);
				jumpMonth = parseInt(dateArr[1])-1;
				if(jumpYear >= 1970 && jumpMonth <= 11 && jumpMonth >= 0){
					printCalendar(jumpYear,jumpMonth);
					selectYear = jumpYear;
					selectMonth = jumpMonth;
					judeJumpStyle();
					//console.log(selectYear,selectMonth);
				}
			}
			return ;
		}
	});
	
	/*判断上下滑动：*/
	$('.cal-content').bind('touchstart',function(event){
		var e = event || window.event;
	    startX = e.originalEvent.changedTouches[0].pageX;
	    startY = e.originalEvent.changedTouches[0].pageY;
	});
	
    $(".cal-content").bind("touchend",function(event){
    	var e = event || window.event;
        //获取滑动屏幕时的X,Y
        endX = e.originalEvent.changedTouches[0].pageX;
        endY = e.originalEvent.changedTouches[0].pageY;
        //获取滑动距离
        distanceX = endX-startX;
        distanceY = endY-startY;
        //判断滑动方向
        if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>0){
        	//右滑  打印上月日历
            prevMonsthShow(selectMonth);
        }else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<0){
            //左滑 打印下月日历
            nextMonsthShow(selectMonth);
        }
    });
	
	// 修改“跳转当前日历”按钮的样式
	function judeJumpStyle(){
		if(selectYear != cunrrentYear || selectMonth != currentMonth){
			$('.fn_jump').css({
				'backgroundColor': '#fff',
				'color': '#000'
			})
		}else{
			$('.fn_jump').css({
				'backgroundColor': '#F3F3F3',
				'color': '#999'
			})
		}
	}
	
	// 跳转下月日历的函数
	function nextMonsthShow(sMonth){
		selectMonth = sMonth + 1;
		if(selectMonth >= 12){
			selectYear += 1;
			selectMonth = 0;
		}else if(selectMonth < 0){
			selectYear -= 1;
			selectMonth = 11;
		}
		judeJumpStyle();
		printCalendar(selectYear,selectMonth);
		//console.log(selectYear,selectMonth);
	}
	
	// 跳转上月日历的函数
	function prevMonsthShow(sMonth){
		selectMonth = sMonth - 1;
		if(selectMonth >= 12){
			selectYear += 1;
			selectMonth = 0;
		}else if(selectMonth < 0){
			selectYear -= 1;
			selectMonth = 11;
		}
		judeJumpStyle();
		printCalendar(selectYear,selectMonth);
		//console.log(selectYear,selectMonth);
	}
	
	// 打印日历函数
	function printCalendar(year,month){
		$.each($('.date-box'), function(index,ele) {
			$(this).text('');
		});
		$('.date-box').css({
			'backgroundColor': '#fff'
		});
		var dateArray = [31,28,31,30,31,30,31,31,30,31,30,31];
		var monthName = ['January','February','March','April','May',' June','July','August','September','October','November','December'];
		if((year % 4 == 0 && year%100 != 0) || year % 400 == 0){
			dateArray[1] += 1;
		}
		var prevMonth = month<=0 ? 11 : month-1;
		var prevMonthDay = dateArray[prevMonth];
		var firstDayOfMonth = new Date(year,month,1);
		var dayOfMonth = dateArray[month];
		firstDayOfMonth = firstDayOfMonth.getDay();
		for(var i=1; i<=dayOfMonth; i++){
			var dateNumber = $('<span class="date-number date-current"></span>');
			dateNumber.text(i);
			$('.date-box').eq(i+firstDayOfMonth-1).append(dateNumber);
			if(year == cunrrentYear && month == currentMonth && i == currentDay){
				$('.date-box').eq(i+firstDayOfMonth-1).css({
					'backgroundColor': '#ffc'
				});
			}
			var new_op = $.parseJSON(window.localStorage.getItem(year + '-' + month + '-' + i));
			if(new_op){
				var dateTips = $('<span class="date-tip"></span>');
				dateTips.text('查看本日行程');
				$('.date-box').eq(i+firstDayOfMonth-1).append(dateTips);
			}
		}
		for(var i=firstDayOfMonth-1; i>=0; i--){
			var dateNumber = $('<span class="date-number"></span>');
			dateNumber.text(prevMonthDay);
			dateNumber.css({
				'color': '#ccc'
			});
			$('.date-box').eq(i).append(dateNumber);
			prevMonthDay--;
		}
		for(var i=firstDayOfMonth+dayOfMonth, j=1; i<=$('.date-box').length; i++,j++){
			var dateNumber = $('<span class="date-number"></span>');
			dateNumber.text(j);
			dateNumber.css({
				'color': '#ccc'
			});
			$('.date-box').eq(i).append(dateNumber);
		}
		var new_title = monthName[month] + ' ' + year;
		$('.head-title').text(new_title);
	}
	
	//.date-box的鼠标移入事件
	$(".date-box").hover(function(){
		if(!$(this).find(".date-tip").length && $(this).find(".date-current").length){
			var noteSpan = $('<span class="date-note glyphicon glyphicon-pencil"></span>');
			$(this).append(noteSpan);
		}
	},function(){
		$(this).find($('.date-note')).remove();
	});
	
	// .date-box的点击事件
	$(".date-box").on('click',function(){
		var tempDay = $(this).find('.date-current').text();
		if(tempDay){
			selectDay = tempDay;
			box_index = $(".date-box").index($(this));
			console.log(box_index);
			$('.list-content').show();
			var new_op = $.parseJSON(window.localStorage.getItem(selectYear + '-' + selectMonth + '-' + selectDay));
			if(new_op){
				for(var i=0; i<new_op.length; i++){
					var newList = $('<button type="button" class="list-group-item list-text"></button>');
					var span = $("<span class='btn-span'>"+ new_op[i] +"</span>");
					newList.append(span);
					$('.list-content .list-show').append(newList);
				}
			}
		}
	});
	
	// 备忘录的返回按钮
	$('.cancel').click(function(){
		if($(this).parent().find($('.list-text')).length){
			if(!$('.date-box').eq(box_index).find('.date-tip').length){
				var dateTips = $('<span class="date-tip"></span>');
				dateTips.text('查看本日行程');
				$('.date-box').eq(box_index).append(dateTips);
			}	
		}else{
			if($('.date-box').eq(box_index).find('.date-tip').length){
				$('.date-box').eq(box_index).find('.date-tip').remove();
			}	
		}
		$(this).parent().find($('.list-text')).remove();
		$('.list-content').hide();
	});
	
	// 备忘录的新建按钮
	$('.add').click(function(){
		var newList = $('<button type="button" class="list-group-item list-text"></button>');
		var in_text = $("<input type='text' class='btn-text'>");
		newList.append(in_text);
		$('.list-content .list-show').append(newList);
		
		in_text.focus();
		in_text.blur(function(){
			if(in_text.val()){
				var text = in_text.val();
				var span = $("<span class='btn-span'>"+ text +"</span>");
				newList.html(span);
				saveText(text);
			}else{
				newList.remove();
			}		
		});
		in_text.keypress(function(ev){
			var ev = event || window.event;
			if (ev.keyCode == 13){
				if(in_text.val()){
					var text = in_text.val();
					var span = $("<span class='btn-span'>"+ text +"</span>");
					newList.html(span);
					saveText(text);
				}else{
					newList.remove();
				}	
			}
		});		
	});
	
	// 备忘录修改
	$(".list-show").delegate(".list-text", "click", function () {
		var _this = $(this);
		var oriText = $(this).find('.btn-span').text();
		var in_text = $("<input type='text' class='btn-text'>");
		$(this).html(in_text);
		
		in_text.focus();
		in_text.blur(function(){
			if(in_text.val()){
				var text = in_text.val();
				oriText = text;
				var index = _this.index();
				updateText(index,text);
			}				
			_this.html('');
			var span = $("<span class='btn-span'>"+ oriText +"</span>");
			_this.html(span);
		});
		in_text.keypress(function(ev){
			var ev = event || window.event;
			if (ev.keyCode == 13){
				if(in_text.val()){
					var text = in_text.val();
					oriText = text;
					var index = _this.index();
					updateText(index,text);
				}	
				_this.html('');
				var span = $("<span class='btn-span'>"+ oriText +"</span>");
				_this.html(span);
			}
		});		
	});
	
	// 备忘录删除
	$(".list-show").delegate(".list-text", "mouseenter", function () {
		if(!$(this).find('.btn-text').length){
			var deleteSpan = $('<span class="date-delete badge">删除</span>');
			$(this).append(deleteSpan);
		}
	});
	$(".list-show").delegate(".list-text", "mouseleave", function () {
		$(this).find('.date-delete').remove();
	});
	$(".list-show").delegate(".date-delete", "click", function () {
		var index = $(this).parent().index();
		$(this).parent().remove();
		deleteText(index);
		var e = e || window.event;
		e.stopPropagation();
	});
	
	// LocalStorage 增
	function saveText(text){
		var new_op = $.parseJSON(window.localStorage.getItem(selectYear + '-' + selectMonth + '-' + selectDay)) || [];
		new_op.push(text);
		window.localStorage.setItem(selectYear + '-' + selectMonth + '-' + selectDay,JSON.stringify(new_op));
	}
	// LocalStorage 更新
	function updateText(index,text){
		var new_op = $.parseJSON(window.localStorage.getItem(selectYear + '-' + selectMonth + '-' + selectDay));
		if(new_op){
			new_op[index] = text;
			window.localStorage.setItem(selectYear + '-' + selectMonth + '-' + selectDay,JSON.stringify(new_op));
		}
	}
	// LocalStorage 删
	function deleteText(index){
		var new_op = $.parseJSON(window.localStorage.getItem(selectYear + '-' + selectMonth + '-' + selectDay));
		if(new_op){
			new_op.splice(index,1);	
			if(new_op.length == 0){
				window.localStorage.removeItem(selectYear + '-' + selectMonth + '-' + selectDay);
				return;
			}
			window.localStorage.setItem(selectYear + '-' + selectMonth + '-' + selectDay,JSON.stringify(new_op));
		}
	}
	
	function fontSize(){
		var deviceWidth = $(window).width();
		console.log(deviceWidth);
		if(deviceWidth > 640){
			deviceWidth = 640;
		}
		 
		var fontSize = deviceWidth / 64;
		$("html").css("fontSize",fontSize);
		$("body").css("fontSize",fontSize);
	}
		 
	fontSize();
		 
	$(window).resize(function(){
		fontSize();
	});
});
