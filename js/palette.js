function palette(cobj,canvas,copy){
	this.o=cobj;// 绘图环境
	this.canvas=canvas;// 标签
	this.copy=copy;// 画布复制版
	this.width=canvas.width;// 画布宽度
	this.height=canvas.height;// 画布高度
	this.type="line";// 绘画类型 "line" "rect" "tirangle" "circle" "pencil" "ellipse" "poly" "polystar"
	this.style="fill";// 绘画样式 "stroke" "fill"
	this.fillStyle="#e5004f";// 填充颜色
	this.strokeStyle="#e5004f";// 描边颜色
	this.lineWidth=1;// 描边宽度
	this.status=[];// 用来保存每次绘画的结果
	this.num=5;//多边形边数||多角形边数
	this.flag=true;
}
// 设置样式
palette.prototype.init=function(){
	this.o.strokeStyle=this.strokeStyle;
	this.o.fillStyle=this.fillStyle;
	this.o.lineWidth=this.lineWidth;
}
// 铅笔书写
palette.prototype.pencil=function(x1,y1,x2,y2){
	var that=this;
	this.copy.onmousedown=function(){
		that.o.beginPath();
		that.init();
		document.onmousemove=function(e){
			var dx=e.offsetX;
			var dy=e.offsetY;
			that.o.lineTo(dx,dy);
			that.o.stroke();
		}
		document.onmouseup=function(){
			that.o.closePath();
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}
// 画其他的
palette.prototype.draw=function(){
	var that=this;
	this.copy.onmousedown=function(e){
		var sx=e.offsetX;
		var sy=e.offsetY;
		that.init();
		document.onmousemove=function(e){
			var ex=e.offsetX;
			var ey=e.offsetY;
			that.o.clearRect(0,0,that.width,that.height);
			if(that.status.length>0){
				that.o.putImageData(that.status[that.status.length-1],0,0,0,0,that.width,that.height)
			}
			that[that.type](sx,sy,ex,ey);
		}
		document.onmouseup=function(){
			that.status.push(that.o.getImageData(0,0,that.width,that.height));
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}
// 线
palette.prototype.line=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.moveTo(x1,y1);
	this.o.lineTo(x2,y2);
	this.o.closePath();
	this.o.stroke();
}
// 矩形
palette.prototype.rect=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	this.o.beginPath();
	this.o.rect(x1,y1,w,h)
	this.o.closePath();
	this.o[this.style]();
}
// 三角形
palette.prototype.tirangle=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.moveTo(x1,y1);
	this.o.lineTo(x1,y2);
	this.o.lineTo(x2,y2);
	this.o.closePath();
	this.o[this.style]();
}
// 圆
palette.prototype.circle=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	this.o.beginPath();
	this.o.arc(x1,y1,r,0,Math.PI*2)
	this.o.closePath();
	this.o[this.style]();
}
// 椭圆
palette.prototype.ellipse=function(x1,y1,x2,y2){}
// 多边形
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var n=this.num;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
	}
	this.o.closePath();
	this.o[this.style]();
}
// 多角形
palette.prototype.polystar=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var r1=r*0.45;
	var n=this.num*2;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		if(i%2==0){
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
		}else{
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r1,y1+Math.sin(Math.PI/180*ang*i)*r1)
		}
		
	}
	this.o.closePath();
	this.o[this.style]();
}
// 圆的半径
palette.prototype._r=function(x1,y1,x2,y2){
	var a=x2-x1;
	var b=y2-y1;
	return Math.sqrt(a*a+b*b);
}
// 橡皮擦
palette.prototype.eraser=function(){
	var that=this;
	this.copy.onmousedown=function(e){
		var er=that.lineWidth;
		var dx=e.offsetX;
		var dy=e.offsetY;
		var a=document.createElement("div");
		a.style.cssText="width:"+er+"px;height:"+er+"px;border:2px dotted #666;position:absolute";
		a.style.left=dx-er/2+"px";
		a.style.top=dy-er/2+"px";
		that.copy.parentNode.appendChild(a);
		document.onmousemove=function(e){
			var mx=e.offsetX;
			var my=e.offsetY;
			that.o.clearRect(mx-er/2,my-er/2,er,er);
			a.style.left=mx-er/2+"px";
			a.style.top=my-er/2+"px";
		}
		document.onmouseup=function(){
			that.copy.parentNode.removeChild(a);
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}