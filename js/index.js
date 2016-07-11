$(function(){
	var $mainPalette=$(".main-palette .canv");// 画布盒子
	var $add=$(".palette-box .tool .add");// 添加
	var $create=$(".main-palette .create");// 创建画布
	var $determine=$(".main-palette .create .btn .determine");// 确定创建
	var $cancle=$(".main-palette .create .btn .cancle");// 取消创建
	var $tools=$(".palette-box .tool i");// 工具

	var flag=true;
	$add.click(function(){
		flag=true;
		$create.css({display:"block"});
		$determine.click(function(){
			createPalette();
		})
		document.onkeydown=function(e){
			if(flag){
				flag=false;
				if(e.keyCode==13){
					createPalette();
				}
			}
		}
		$cancle.click(function(){
			$create.css({display:"none"});
		})
	})
	

	function createPalette(){
		var pw=$(".main-palette .create .p-width input").val();
		var ph=$(".main-palette .create .p-height input").val();
		$mainPalette.css({width:pw,height:ph,position:"absolute",margin:"auto",left:0,right:0,top:0,bottom:0})
		if(pw.length==0){
			alert("请输入画布宽度");
			return;
		}
		if(ph.length==0){
			alert("请输入画布高度");
			return;
		}
		var canvas=$("<canvas>").attr({width:pw,height:ph}).css({background:"#fff",position:"absolute",margin:"auto",left:0,right:0,top:0,bottom:0});
		var copy=$("<div>").css({width:pw,height:ph,position:"absolute",margin:"auto",left:0,right:0,top:0,bottom:0,zIndex:99});
		$mainPalette.append(canvas);
		$mainPalette.append(copy);
		$create.css({display:"none"});
		var p=new palette(canvas[0].getContext("2d"),canvas[0],copy[0]);
		var $fillStyle=$(".fillStyle").find("input");
		var $strokeStyle=$(".strokeStyle").find("input");
		// 设置填充颜色
		p.fillStyle=$fillStyle.val();
		// 设置描边颜色
		p.strokeStyle=$strokeStyle.val();
		var $mixMin=$(".mixMin").find("input");
		p.lineWidth=$mixMin.val();
		p.draw();
		$tools.click(function(){
			var attr=$(this).attr("role");
			// 填充颜色
			$fillStyle.change(function(){
				var colVal=$(this).val();
				p.fillStyle=colVal;
			})
			// 描边颜色
			$strokeStyle.change(function(){
				var colVal=$(this).val();
				p.strokeStyle=colVal;
			})
			// 描边宽度||橡皮大小
			$mixMin.change(function(){
				var colVal=$(this).val();
				p.lineWidth=colVal;
			})
			// 各项判断
			if(attr=="save"){
				var a=canvas[0].toDataURL();
				location.href=a.replace("image/png","image/octet-stream");
			}
			if(attr=="eraser"){
				p.eraser();
			}else{
				if(attr=="pencil"){
					p.pencil();
				}else{
					if(attr=="line"||attr=="rect"||attr=="tirangle"||attr=="circle"){
						p.type=attr;
						p.draw();
					}else if(attr=="poly"||attr=="polystar"){
						var num=prompt("请输入边数",5);
						p.type=attr;
						p.num=num;
						p.draw();
					}else if(attr=="fillStyle"){
						p.style="fill";
					}else if(attr="strokeStyle"){
						p.style="stroke";
					}
				}
			}
		})

		var deletes=[];
		$(".back").click(function(){
			if(p.status.length>1){
				var dd=p.status.pop();
				deletes.push(dd);
				p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);

			}else if(p.status.length==1){
				p.status.pop();
				p.o.clearRect(0,0,p.width,p.height)
			}else{
				alert("没有上一步了");
			}
			console.log(deletes)
		})
		$(".go").click(function(){
			if(deletes.length==0){
				alert("没有下一步了");
			}else if(deletes.length==1){
				p.status.push(deletes[0]);
				p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);
				deletes=[];
			}else{
				p.status.push(deletes[deletes.length-1]);
				p.o.putImageData(p.status[p.status.length-1],0,0,0,0,p.width,p.height);
				deletes.pop();
			}
		})
	}
})