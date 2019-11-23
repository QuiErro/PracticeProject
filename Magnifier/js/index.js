window.onload = function () {
    // 1. 获取需要的标签
    let box = document.getElementById("box");
    let small_box = box.children[0];
    let big_box = box.children[1];
    let mask = small_box.children[1];
    let big_img = big_box.children[0];
    let list_ul = document.getElementsByClassName("list-items")[0].children[0];
    let list_img = list_ul.children;
    let a_back = document.getElementById("list").children[0];
    let a_forward = document.getElementById("list").children[2];
    
    // 2. 监听鼠标进入小盒子
    small_box.onmouseover = function () {
        // 2.1 把隐藏的内容显示
        mask.style.display = 'block';
        big_box.style.display = 'block';
        
        // 2.2 监听鼠标的移动
        small_box.onmousemove = function (e) {
            let event = e || window.event;

            // 2.3 求出鼠标的坐标 event.clientX - small_box.offsetParent.offsetLeft 是鼠标距离box左侧的距离
            let pointX = event.clientX - small_box.offsetParent.offsetLeft - mask.offsetWidth * 0.5;
            let pointY = event.clientY - small_box.offsetParent.offsetTop - mask.offsetHeight * 0.5;

            // 2.4 边界检测
            if(pointX < 0){
                pointX = 0;
            }else if(pointX >= small_box.offsetWidth - mask.offsetWidth){
                pointX = small_box.offsetWidth - mask.offsetWidth;
            }

            if(pointY < 0){
                pointY = 0;
            }else if(pointY >= small_box.offsetHeight - mask.offsetHeight){
                pointY = small_box.offsetHeight - mask.offsetHeight;
            }

            // 2.5 让放大镜移动起来  style.top 是针对有定位属性的元素才能设置的,表示相对父元素的距离
            mask.style.left = pointX + 'px';
            mask.style.top = pointY + 'px';

            // 2.6 让大图移动起来
            /*
               smallX / bigX = smallBox.width / 大图的宽度
               bigX = smallX / ( smallBox.width / 大图的宽度 )
            */
            big_img.style.left = - pointX / (small_box.offsetWidth / big_box.offsetWidth) + 'px';
            big_img.style.top = - pointY / (small_box.offsetHeight / big_box.offsetHeight) + 'px';
        }
    };

    // 3. 监听鼠标离开小盒子
    small_box.onmouseout = function () {
        // 2.1 把隐藏的内容显示
        mask.style.display = 'none';
        big_box.style.display = 'none';
    };
    
    // 4. 遍历列表图片
    for(let i=0; i<list_img.length; i++){
        let img = list_img[i];
        img.onmouseover = function () {
            small_box.children[0].src = "images/pic00"+ (i + 1) +".jpg";
            big_img.src = "images/pic0"+ (i + 1) +".jpg"
        }
    }

    // 5. 监听点击a标签,移动列表图片
    a_forward.onclick = function(){
        let parentWidth = Number(getStyle(list_ul.parentElement, "width").slice(0, -2));
        let ulWidth = Number(getStyle(list_ul, "width").slice(0, -2));
        move(list_ul, "left" , (parentWidth - ulWidth), 20);
    }
    a_back.onclick = function(){
        move(list_ul, "left" , 0, 20);
    }
}