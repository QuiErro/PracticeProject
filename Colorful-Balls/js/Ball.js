// 小球类
class Ball{
    // 构造器
    constructor(x, y, radius, color){				
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = radius;
    }
    
    // 绘制小球
    render(){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// 移动小球类
class MoveBall extends Ball{
    constructor(x, y, radius, color){
        super(x, y, radius, color);
        
        // 随机生成参数变化量
        this.dX = _.random(-5,5);   // Underscore-min.js
        this.dY = _.random(-5,5);
        this.dR = _.random(1,3);
    }
    
    // 更新参数值
    upDate(){
        this.x += this.dX;
        this.y += this.dY;
        this.r -= this.dR;
        if(this.r <= 0){
            this.r = 0;
            // 移除小球
            ballArr = _.without(ballArr, this);
        }
    }
}