$(function() {
	$(".active a").css("color","#3b5998;");
	$(".nav>li").mouseover();
//	$(document).on("load",".nav>li:eq[0]",function(){
//		$(this).addClass("active")
//		console.log($(this))
//	});
	//初始化弹出框
	$('[data-toggle="popover"]').popover();
	//接口
	var _href = "http://api.jjrb.grsx.cc",//"http://test.api.wantscart.com",
		interfacelist = {
			phone_code: "/login",//"/api/login", //手机验证码get?phone=
			phone_login: "/login",//"/api/login", //手机登录post  phone=&code=
			wx: "/login/wx"//"/api/login/wx" //微信登录post expire_in=&open_id=&	token=&refresh_token=	
		},
		n = 0;
	//头部导航鼠标移入
	$(document).on("mouseover", ".nav>li",function() {
		$(this).addClass("active").siblings().removeClass("active").css("color", "#999");
		$(this).find("a").css("color", "#000000");
	});
	//头部导航鼠标移出
	$(document).on("mouseout", ".nav>li",function() {
		$(this).find("a").css("color", "#999");
		$(this).removeClass("active")
	});
	$("body").click(function() {
		$("#phone").hide();
		$("#WeChat").hide();
		//		$(".dropdown").addClass("open");
		$(document.body).css({
			"overflow": "auto"
		});
	});

	//点击登录区域阻止冒泡
	$("#phone div,#WeChat div").on("click", function(e) {
		e.stopPropagation();
	});
	//切换手机微信登陆界面 - 方法1
	function toggle_login(clas, a, b) {
		$(document).on("click", clas,function(e) {
//			e.stopPropagation();
//			alert(a+"==="+b);
			$(document.body).css({
				"overflow": "hidden"
			});
			
			$(a).show();
			$(b).hide();
			if (clas==".login_wechat"||a=="#WeChat") {
				var obj = new WxLogin({
	                id:"wx", 
	                appid: "wxbdc5610cc59c1631", 
	                scope: "snsapi_login", 
	                redirect_uri: "https://passport.yhd.com/wechat/callback.do",
	                state: "",
	                style: "",
	                href: ""
                });
				$.ajax({
					type:"post",
					url:_href+interfacelist.wx,
					data:{
						expire_in:1,
						open_id:2,
						token:localStorage.token,
						refresh_token:"343"
					},
					async:true,
					success: function(e){
						console.log(e);
					}
				});
//				$("#wx").find("img").attr("src","");
			}
			$("#input_Phone").focus();
		});
	};
	toggle_login(".login_wechat", "#WeChat", "#phone");
	toggle_login(".login_phone", "#phone", "#WeChat");

//手机微信登陆切换-方法2
//	$(document).on("click",".login_wechat",function(){
//		$("#WeChat").show();
//		$("#phone").hide();
//	});
//	$(document).on("click",".login_phone",function(){
//		$("#phone").show();
//		$("#WeChat").hide();
//	});
	$('[data-target="#WeChat"]').click(function(){
		$("#WeChat").show();
		$("#phone").hide();
//		toggle_login(".login_wechat", "#WeChat", "#phone");
	})
	$('[data-target="#Phone"]').click(function(){
		$("#WeChat").hide();
		$("#phone").show();
//		toggle_login(".login_phone", "#phone", "#WeChat");
	})
	//点击验证码登录
	$(".phone_code").on("click", function() {
		$("#input_password,.phone_code").hide();
		$(".fg_hide").show();
		$(".btn_login").addClass("phone_code_login");
		$(".btn_login").removeClass("phone_login");
		$("#input_Phone").focus();
	});
	//获取手机号验证码
	$("#code_btn").stop(true,true).click(function(e) {
		var _phone = $("#input_Phone").val();
		if(_phone.length<11||_phone==""||_phone.length>11){
			alert("请输入正确的手机号");
			return ;
		}
		$("#code_btn1").show();
		$("#code_btn").hide();
		code_time();
		$.ajax({
			type: "get",
			url: _href + interfacelist.phone_code,
			data: {
				phone: _phone
			},
			success: function(e) {
				alert("发送成功");
			}
		});
	});
	//点击手机号号登录
	$(".phone_no").on("click", function() {
		$("#input_password,.phone_code").show();
		$(".fg_hide").hide();
		$(".btn_login").addClass("phone_login");
		$(".btn_login").removeClass("phone_code_login");
		$("#input_Phone").focus();
	});
	//登录
	$(".btn_login").on("click",function(){
		
		var _classname = $(this).attr("class"),_phone = $("#input_Phone").val(),_code;
		console.log(_classname);
		if (_classname.indexOf("phone_login")>=0) {
			console.log("手机号密码登录");
			if (forms(true,false)) {
				forms(true,false);
			}else{
				return false;
			}
			_code = $("#input_password").val();
			$.ajax({
				type: "post",
				url: _href + interfacelist.phone_login,
				data: {
					phone: _phone,
					code: _code
				},
				success: function(e) {
					alert("登录成功");
					console.log(e);
					if(data!='success'){
                		//location.href= data;//"http://wap.wantscart.com/admin/login?from="+location.href;
                	}
				},
				error: function(e){
					alert("登陆失败");
				}
			});
		} else if (_classname.indexOf("phone_code_login")>=0){
			console.log("手机号验证码登录");
			console.log(!forms(false,true));
			if (forms(false,true)) {
				$("#input_Phone_code").focus();
				return ;
			}
			_code = $("#input_Phone_code").val();
			localStorage.phone = _phone;
			console.log(_code);
			$.ajax({
				type: "post",
				url: _href + interfacelist.phone_login,
				data: {
					phone: _phone,
					code: _code
				},
				success: function(e) {
					console.log(e);
					if(e.msg=="无效的短信验证码"){
						alert("无效的短信验证码");
						console.log(e.detail+"===");
						return false;
					}
					console.log("登录成功！");
					localStorage.token = e.token;
					localStorage.userId = e.user.id;
					localStorage.userName = e.user.name;
					$("#phone").hide();
					location.reload();
				},
				error: function(){
					console.log("登陆失败！")
				}
			});
		}
	});
	
	//检查手机端和pc
	var system = {
        win: false,
        mac: false,
        xll: false,
        ipad:false
   };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;

    if (system.win || system.mac || system.xll ||system.ipad) {
    	console.log("电脑");
    }else{
    	console.log("手持设备");
    	$(document).on("load","#logo_img",function(){
    		$(this).css({"width":"35px","height":"35px","margin-top":"-8px"});
    	});
    	$("#logo_img").css({"width":"35px","height":"35px","margin-top":"-8px"});
    	$(".data_img_i").css("height","75px");
    }	
	
	//返回顶部
	var client = document.documentElement.clientHeight;
	var timer = null;
	var isTop = true;
	$(document).on("click","#back_top",function(){
		timer = setInterval(function(){
			var osTop = document.documentElement.scrollTop||document.body.scrollTop;
			var ispeed = Math.floor(-osTop / 6);
			document.documentElement.scrollTop = document.body.scrollTop = osTop +ispeed;					
			isTop = true;
			if (osTop == 0){
				clearInterval(timer);
			}
		},30);
		
	});
	window.onscroll=function(){
		if (!isTop){
			clearInterval(timer);
		}
		isTop = false;
	}
});


//验证表单信息
function forms(p,c){
	var _phone = $("#input_Phone").val(),_password = $("#input_password").val(),_code = $("#input_Phone_code").val(); 
	/*if (p) {
		if (_phone.length=0||_phone=="") {
			alert("请输入手机号，不能为空！");
			$("#input_Phone").focus();
			return false;
		}
		if (_phone.length>11||_phone.length<11) {
			alert("请输入正确的11位手机号！");
			$("#input_Phone").focus();
			return false;
		}
		if (_password.length=0||_password=="") {
			alert("请输入密码，密码不能为空！");
			$("#input_password").focus();
			return false;
		}
	} else */if(c){
		if (_phone.length=0||_phone=="") {
			alert("请输入手机号，不能为空！");
			$("#input_Phone").focus();
			return false;
		}
		if (_phone.length>11||_phone.length<11) {
			alert("请输入正确的11位手机号！");
			$("#input_Phone").focus();
			return false;
		}
		if (_code.length=0||_code=="") {
			alert("请输入验证码，不能为空！");
			$("#input_Phone_code").focus();
			return false;
		}
	}
	
	
}
//验证码倒计时
function code_time() {
	var code_num = 60;
	var time = setInterval(function() {
		code_num--;
//		console.log(code_num);
		$("#code_num i").html(code_num);
		if(code_num <= 0) {
			code_num = 60;
			$("#code_num i").html(code_num);
			clearInterval(time);
			$("#code_btn1").hide();
			$("#code_btn").show();
		}
	}, 1000);
}
//根据毫秒数格式化时间
function timeF(time,mm) {
	var t = new Date(time);
	var y = t.getFullYear();
	var m = t.getMonth();
	var d = t.getDate();
	if(mm){
		return y + "-" + (m + 1);
	}else{
		return y + "年" + (m + 1) + "月" + d + "日";
	}
	
}
//获取cookie
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)) {
		var aa = unescape(arr[2]);
		if(aa.length > 2) {
			aa = aa.substring(1, aa.length - 1)
		}
		return unescape(aa);
	} else
		return null;
}
//获取url中字段
function getUrlParams() {
	var params = {};
	var url = window.location.href;
	var idx = url.indexOf("?");
	if(idx > 0) {
		var queryStr = url.substring(idx + 1);
		var args = queryStr.split("&");
		for(var i = 0, a, nv; a = args[i]; i++) {
			nv = args[i] = a.split("=");
			params[nv[0]] = nv.length > 1 ? nv[1] : true;
		}
	}
	return params;
};
//数组去重方法
Array.prototype.unique3 = function(){
	 var res = [];
	 var json = {};
	 for(var i = 0; i < this.length; i++){
	  if(!json[this[i]]){
	   res.push(this[i]);
	   json[this[i]] = 1;
	  }
	 }
	 return res;
}


var dataDesc = {
	//图表数据获取
	urlLoad: function(id,url,country,indicator,start,end,echartType){
		if (country) {
			url += "&country="+country;
		}
		if (indicator) {
			url += "&indicator="+indicator;
		}
		if (start) {
			url += "&start="+start;
		}
		if (end) {
			url += "&end="+end;
		}
		console.log(url);
		// 基于准备好的dom，初始化echarts图表
		var myChart = echarts.init(document.getElementById(id));
		if (location.href.indexOf("add_viewpoint")) {
			$("#"+id).append("<span class='glyphicon glyphicon-remove new_close none'></span>");
		}
		
		var fla = true,s={};
		
		myChart.showLoading();
		//异步加载方法
		$.get(url).done(function(data) {
			myChart.hideLoading();
			var d;
	//		console.log(data);
			if(typeof(data) == "object" && 
	            Object.prototype.toString.call(data).toLowerCase() == "[object object]" && !data.length){
	            d=data;
	        }else{
	        	d = JSON.parse(data);
				console.log(d);
	        }
			
			var time = [],_series=[],country=[],_name="";
	//		if (!_val) {
	//			_val=[];
	//		}else{
	//			_val=_val.unique3
	//			console.log(_val)
	//		}
			$.each(d,function(key,val){
				var value = [];
				_name += key+"  ";					
				country.push(key);
	    		$.each(val,function(i,e){
	    			time.push(e.date);
	    			value.push(e.value);
	    		});
	//  		console.log(key);
	//  		console.log(val);
				//切换图表样式
	    		if(!echartType || echartType=='' || echartType==undefined){
	    			echartType = 'line';
					fla = false;
	    		}
	    		if (echartType==='line' && echartType) {
					fla=false;
					s = {
						name: key,
			            type: echartType,
			            smooth:true,
			            itemStyle: {normal: {areaStyle: {type: 'default'}}},
			            data: value
					}
				} else if(echartType==='bar' && echartType){
					fla=true;
					s = {
						name: key,
			            type: echartType,
			            itemStyle: {normal: {areaStyle: {type: 'default'}}},
			            data: value
					}
				} else if(echartType==='oneLine' && echartType){
					s = {
						name: key,
			            type: 'line',
			            itemStyle: {normal: {areaStyle: {type: 'default'}}},
			            data: value,
			            markPoint : {
			                data : [
			                    {type : 'max', name: '最大值'},
			                    {type : 'min', name: '最小值'}
			                ]
			            },
			            markLine : {
			                data : [
			                    {type : 'average', name: '平均值'}
			                ]
			            }
					}
						
				}
	    		_series.push(s);
			});
			
			myChart.setOption({
				title: {
					text: country+" "+ indicator
				},
				tooltip: {
	//				trigger: 'axis'
				},
				legend: {
					data: country//["邮件营销","联盟广告","视频广告","直接访问","搜索引擎"]
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
	//			grid: {
	//				left: '3%',
	//				right: '4%',
	//				bottom: '3%',
	//				containLabel: true
	//			},
				xAxis: [{
					type: 'category',
					boundaryGap: fla,
					data: time.unique3()//["周一","周二","周三","周四","周五","周六","周日1312"]
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
	                    formatter: function (value, index) {
	                        var v = 0;
	//                      console.log(value);
	                        if (value >= 100000000) {
	                            v = value / 100000000;
	                            v += '亿';
	                        }else{
	                        	v = value;
	                        }
	                        return v;
	                    }
	                }
				}],
				series: _series
			});
		});
		
	},
	//数据导航列
	navList: function(filter_txt){
		//页面加载缓冲的过滤
		if(localStorage.filterTxt){
			var filter_html='',
				len=0,minlen,
				localStorage_filterTxt = localStorage.filterTxt;
			if(localStorage_filterTxt.indexOf(',')){
				var lf = localStorage_filterTxt.split(',');
				len = lf.length;
				minlen = len<10?0:len-10;
				for (var i=len-1;i>minlen-1;i--) {
					filter_html += '<span><a href="javascript:void(0);" class="data_nav_filter_txt">'+lf[i]+'</a></span>';
					filter_txt.push(lf[i]);
					
				}
			}else{
				filter_html += '<span><a href="javascript:void(0);" class="data_nav_filter_txt">'+localStorage_filterTxt+'</a></span>';
				filter_txt.push(localStorage_filterTxt);
				console.log(filter_html);
			}
			$(".nav_txt").append(filter_html);
		}
		
		$.ajax({
			type:"get",
			url: 'http://api.jjrb.grsx.cc/data/group?type=1&with_indicator=1',
			data:{
				token:'w1N3dahtnIny9Vaty4WZskJiOcsICdazhzMrvdWadpNGbwu9FdaioTYny1WZt0gTOs3QWMc2czNa1QzdrhlTOdsIiZwi4WNay9Wbn9BAdt=oDM'
			},
			async:true,
			success: function(data){
				var html = '';
				console.time("列循环");
				/*$.each(data, function(i,e) {
					console.log(e);
					if (e.name!=='null' && e.name!=='' && e.name) {
						html = '<dl class=""><dt>'+data.name+'</dt>';
					}else{
						return false;
					}
					
					$.each(e.indicators,function(i,ev){
						console.log(ev);
						if (ev.name!=='null' && ev.name!=='' && ev.name) {
							html += '<dd><a href="#" data-id="'+ev.id+'" class="data_nav_click">'+ev.name_cn+'</a></dd>';
						}else{
							return false;
						}
						
					});
					html += '</dl>'
					console.log(html);
				});*/
				
				//原生态for循环
				var html = '';
				for (var i=0;i<10;i++) {
					var a= data[i];
					html += '<dl class=""><dt>'+data[i].name+'</dt>';
					for (var j=0;j<8;j++) {
//									console.log(a.indicators[j]);
						html += '<dd><a href="javascriptcn:void(0);" data-id="'+a.indicators[j].id+'" class="data_nav_click" data-abc = "123">'+a.indicators[j].name_cn+'</a></dd>';
					}
					html +='</dl>';
				}
				$("#data_nav_lists").append(html);
				
				//瀑布流引用
				var $waterfall = $('#data_nav_lists');
				pbl_width = $("#data_nav_lists").width();
				$waterfall.masonry({
					columnWidth: pbl_width/3
				});
				$("#inputSearch").removeProp("readonly");
				console.timeEnd("列循环");
				//点击最近过滤文字
				$(document).on("click",".data_nav_filter_txt",function(){
					var val = $(this).text();
					$("#inputSearch").val(val).keyup();
				});
			}
		});
	},
	//表格加载数据
	loadDatas: function(_href,indicator){
		console.log(_href)
		$.ajax({
			type:"get",
			url: _href + "/data/stat?indicator=" + indicator,
			async:true,
			success: function(data){
//							console.log(data);
				console.time("表格数据：");
				$.each(data,function(i,e){
//								console.log(e);
					var table_icon_style='',html = '<tr>';
					if((e.previous-e.val)>0){
						table_icon_style = 'glyphicon-arrow-up green';
					}else{
						table_icon_style = 'glyphicon-arrow-down red';
					}
					html += '<td>'+e.country+'</td>'+
			  				'<td>'+e.val+'</td>'+
			  				'<td><span class="table_data">'+timeF(e.created,'mm')+'</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon '+table_icon_style+'"></span></td>'+
			  				'<td>'+e.previous+'</td>'+
			  				'<td>'+e.max+'</td>'+
			  				'<td>'+e.min+'</td>';
			  		html += '</tr>';
			  		$("#data_table").find("tbody").append(html);
				});
				console.timeEnd("表格数据：");
			}
		});
	},
	//搜索框事件
	dataSearch: function(filter_txt){
		$(document).on("keyup","#inputSearch",function(e){
			$dd = $("#data_nav_lists dd");
			var val = $(this).val();
			console.log(val);
			var dTxt;
			$dd.not(":contains('"+val+"')").hide();
			$dd.filter(":contains('"+val+"')").each(function(i,e){
				$(e).show();
			});
			if (val.length==0) {
				$dd.show().css("color","#3b5998");
				$dd.find("a").css("color","#3b5998");
			}
			var $waterfall = $('#data_nav_lists');
			pbl_width = $("#data_nav_lists").width();
			$waterfall.masonry({
				columnWidth: pbl_width/3
			});
			
		});
		
		//搜索框失去焦点加到过滤
		$(document).on("blur","#inputSearch",function(e){
			var val = $(this).val().trim();
			if (val !== '' && val.length > 0) {
				var html = '<span><a href="javascript:void(0);" class="data_nav_filter_txt">'+val+'</a></span>';
				$(".nav_txt").append(html);
				filter_txt.push(val);
				filter_txt.unique3();
				console.log(filter_txt);
				localStorage.setItem("filterTxt",filter_txt);
			}
		});
	}
}

