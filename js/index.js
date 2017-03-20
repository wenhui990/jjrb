$(function() {
	$(".active a").css("color","#3b5998;");
	if (window.location.href.indexOf("index")) {
		setTimeout(function(){
			console.log($("#navs li").length)
			$("#navs li").eq(0).addClass("active");
		},500);
	}
	$(".nav>li").mouseover();
	$(document).on("load",".nav>li:eq[0]",function(){
		$(this).addClass("active")
		console.log($(this))
	});
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
//  	alert("手机");
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
function timeF(time) {
	var t = new Date(time);
	var y = t.getFullYear();
	var m = t.getMonth();
	var d = t.getDate();
	return y + "年" + (m + 1) + "月" + d + "日";
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
//图表数据获取
function urlLoad(id,url,country,indicator,start,end,_val){
	console.log(url);
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
	myChart.showLoading();
	//异步加载方法
	$.get(url).done(function(data) {
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
    		var s = {
    			name: key,//'邮件营销',
				type: 'line',
//				stack: '总量',
				areaStyle: {
					normal: {}
				},
				data: value
			}
    		_series.push(s);
    		
		});
	
		myChart.setOption({
			title: {
				text: country+" "+ indicator
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: country//["邮件营销","联盟广告","视频广告","直接访问","搜索引擎"]
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
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
	myChart.hideLoading();
}