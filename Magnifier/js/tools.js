// 可以执行简单动画的函数
/*
 * 参数：
 * 	obj:要执行动画的对象
 * 	attr:要执行动画的样式：left top width height...
 * 	target:执行动画的目标位置
 * 	speed:移动的速度(正数向右移动，负数向左移动)
 *  callback:回调函数，动画执行完毕以后执行
 */
function move(obj, attr, target, speed, callback) {
	// 关闭上一个定时器
	clearInterval(obj.timer);

	// 获取元素目前的位置
	let current = parseInt(getStyle(obj, attr));
	//console.log(current)
	// 判断速度的正负值
	if(current > target) {
		speed = -speed;
	}

	// 开启定时器，执行动画效果
	obj.timer = setInterval(function() {

		let oldValue = parseInt(getStyle(obj, attr));
		let newValue = oldValue + speed;

		if((speed < 0 && newValue < target) || (speed > 0 && newValue > target)) {
			newValue = target;
		}

		obj.style[attr] = newValue + "px";

		//当元素移动到0px时，使其停止执行动画
		if(newValue == target) {
			clearInterval(obj.timer);
			callback && callback();
		}

	}, 30);
}

/*
 * 获取指定元素当前的样式
 * 参数：
 * 		obj 要获取样式的元素
 * 		name 要获取的样式名
 */
function getStyle(obj, name) {
	if(window.getComputedStyle) {
		// 正常浏览器的方式，具有getComputedStyle()方法
		return getComputedStyle(obj, null)[name];
	} else {
		// IE8没有getComputedStyle()方法
		return obj.currentStyle[name];
	}
}