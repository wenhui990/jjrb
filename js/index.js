$("header").load("header.html");
$("footer").load("footer.html");
$("head").append("<link href='http://cdn.webfont.youziku.com/webfonts/nomal/100608/45807/58db5e4cf629da0960bba0dc.css' rel='stylesheet' type='text/css' />");
//接口
var _href = "http://api.jjrb.grsx.cc", //"http://test.api.wantscart.com",
	interfacelist = {
		phone_code: "/login", //"/api/login", //手机验证码get?phone=
		phone_login: "/login", //"/api/login", //手机登录post  phone=&code=
		wx: "/login/wx",
		select_indicator: "/data2/indicator/k/", //查询indicator
		select_data: "/data2", //查询数据   ?country=CN,US&indicator=NY.GDP.MKTP.CD&start=1990
		host_indicator: "/data2/indicator/hot", //热门
		select_country: "/data2/country/k/", //查询国家/data/country/k/{val}
		indicator_list: '/data2/group?type=1&with_indicator=1',
		indicator_stat: '/data2/stat?indicator=NY.GDP.MKTP.CD',
		feed: "/feed/t/3"
	};
//	n = 0;
function interfacelist() {
	var _href = "http://api.jjrb.grsx.cc", //"http://test.api.wantscart.com",
		interfacelist = {
			phone_code: "/login", //"/api/login", //手机验证码get?phone=
			phone_login: "/login", //"/api/login", //手机登录post  phone=&code=
			wx: "/login/wx",
			select_indicator: "/data/indicator/k/", //查询indicator
			select_data: "/data", //查询数据   ?country=CN,US&indicator=NY.GDP.MKTP.CD&start=1990
			host_indicator: "/data/indicator/hot", //热门
			select_country: "/data/country/k/", //查询国家/data/country/k/{val}
			indicator_list: '/data/group?type=1&with_indicator=1',
			indicator_stat: '/data/stat?indicator=NY.GDP.MKTP.CD',
			feed: "/feed/t/3",
			select_data: "/data"
		};
	return interfacelist;
}
$(function() {
	$(".active a").css("color", "#3b5998;");
	//	$(".nav>li").mouseover();

	var n = 0;
	//初始化弹出框
	$('[data-toggle="popover"]').popover();

	//头部导航鼠标移入
	$(document).on("mouseover", ".nav>li", function() {
		$(this).addClass("active").siblings().removeClass("active").css("color", "#999");
		$(this).find("a").css("color", "#000000");
	});
	//头部导航鼠标移出
	$(document).on("mouseout", ".nav>li", function() {
		$(this).find("a").css("color", "#999");
		$(this).removeClass("active")
	});
	$("body").click(function() {
		$("#phone").hide();
		$("#WeChat").hide();
		//		$(".collects_title_right").click();
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
		$(document).on("click", clas, function(e) {
			//			e.stopPropagation();
			//			alert(a+"==="+b);
			$(document.body).css({
				"overflow": "hidden"
			});

			$(a).show();
			$(b).hide();
			if(clas == ".login_wechat" || a == "#WeChat") {
				var obj = new WxLogin({
					id: "wx",
					appid: "wxbdc5610cc59c1631",
					scope: "snsapi_login",
					redirect_uri: "https://passport.yhd.com/wechat/callback.do",
					state: "",
					style: "",
					href: ""
				});
				$.ajax({
					type: "post",
					url: _href + interfacelist.wx,
					data: {
						expire_in: 1,
						open_id: 2,
						token: localStorage.token,
						refresh_token: "343"
					},
					async: true,
					success: function(e) {
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
	$('[data-target="#WeChat"]').click(function() {
		$("#WeChat").show();
		$("#phone").hide();
		//		toggle_login(".login_wechat", "#WeChat", "#phone");
	})
	$('[data-target="#Phone"]').click(function() {
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
	$("#code_btn").stop(true, true).click(function(e) {
		var _phone = $("#input_Phone").val();
		if(_phone.length < 11 || _phone == "" || _phone.length > 11) {
			alert("请输入正确的手机号");
			return;
		}
		console.log(interfacelist)
		//		return;
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
	$(".btn_login").on("click", function() {

		var _classname = $(this).attr("class"),
			_phone = $("#input_Phone").val(),
			_code;
		console.log(_classname);
		if(_classname.indexOf("phone_login") >= 0) {
			console.log("手机号密码登录");
			if(forms(true, false)) {
				forms(true, false);
			} else {
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
					if(data != 'success') {
						//location.href= data;//"http://wap.wantscart.com/admin/login?from="+location.href;
					}
				},
				error: function(e) {
					alert("登陆失败");
				}
			});
		} else if(_classname.indexOf("phone_code_login") >= 0) {
			console.log("手机号验证码登录");
			console.log(!forms(false, true));
			if(forms(false, true)) {
				$("#input_Phone_code").focus();
				return;
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
					if(e.msg == "无效的短信验证码") {
						alert("无效的短信验证码");
						console.log(e.detail + "===");
						return false;
					}
					console.log("登录成功！");
					localStorage.token = e.token;
					localStorage.userId = e.user.id;
					localStorage.userName = e.user.name;
					$("#phone").hide();
					location.reload();
				},
				error: function() {
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
		ipad: false
	};
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;

	if(system.win || system.mac || system.xll || system.ipad) {
		console.log("电脑");
	} else {
		console.log("手持设备");
		$(document).on("load", "#logo_img", function() {
			$(this).css({
				"width": "35px",
				"height": "35px",
				"margin-top": "-8px"
			});
		});
		$("#logo_img").css({
			"width": "35px",
			"height": "35px",
			"margin-top": "-8px"
		});
		$(".data_img_i").css("height", "75px");
	}

	//返回顶部
	var client = document.documentElement.clientHeight;
	var timer = null;
	var isTop = true;
	$(document).on("click", "#back_top", function() {
		timer = setInterval(function() {
			var osTop = document.documentElement.scrollTop || document.body.scrollTop;
			var ispeed = Math.floor(-osTop / 6);
			document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
			isTop = true;
			if(osTop == 0) {
				clearInterval(timer);
			}
		}, 30);

	});
	window.onscroll = function() {
		if(!isTop) {
			clearInterval(timer);
		}
		isTop = false;
	}
});

//验证表单信息
function forms(p, c) {
	var _phone = $("#input_Phone").val(),
		_password = $("#input_password").val(),
		_code = $("#input_Phone_code").val();
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
	} else */
	if(c) {
		if(_phone.length = 0 || _phone == "") {
			alert("请输入手机号，不能为空！");
			$("#input_Phone").focus();
			return false;
		}
		if(_phone.length > 11 || _phone.length < 11) {
			alert("请输入正确的11位手机号！");
			$("#input_Phone").focus();
			return false;
		}
		if(_code.length = 0 || _code == "") {
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
function timeF(time, mm) {
	var t = new Date(time);
	var y = t.getFullYear();
	var m = t.getMonth();
	var d = t.getDate();
	if(m<9){
		m = '0'+m;
	}
	if(d<10){
		d = '0'+d;
	}
	if(mm) {
		return y + "-" + m;
	} else {
		return y + "年" + m + "月" + d + "日";
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
Array.prototype.unique3 = function() {
	var res = [];
	var json = {};
	for(var i = 0; i < this.length; i++) {
		if(!json[this[i]]) {
			res.push(this[i]);
			json[this[i]] = 1;
		}
	}
	return res;
}

//去重排序
var uniqueSort = function(source, compareFn) {
	var result = [];
	if('function' != typeof compareFn) {
		compareFn = function(item1, item2) {
			return item1 - item2;
		};
	}
	$.each(source, function(i, v) {
		if(i == 0) {
			result.push(v);
		} else {
			//从最后开始
			for(var j = result.length - 1; j >= 0; j--) {
				if(compareFn(v, result[j]) > 0) {
					result.splice(j + 1, 0, v);
					break;
				} else if(j == 0) {
					//到0还是小
					result.splice(0, 0, v);
				}
			}
		}
	});
	return result;
}

//国家，经济指标通用方法
function ci(classname, classname1, src) {
	$(classname).show();
	$(classname).html("");
	if(window.location.href.indexOf('inland')>-1){
		src += '?source=100';
	}else{
		src += '?source=101'
	}
	$.ajax({
		type: "get",
		url: src,
		success: function(data) {
			var d = data;
			//							console.log(d);
			$(d).each(function(i, e) {
				//								console.log(e);
				var _name, _id;
				if(classname.indexOf("country") >= 0) {
					_id = e.iso2_code;
					_name = e.name_zh;
					_name_en = e.name_en;
					$(classname).append('<div class="' + classname1 + ' cou_list_id" data-id="' + _id + '" data-name="' + _name + '" title="' + e.id + '">' + _name + '</div>');
				} else if(classname.indexOf("zb") >= 0) {
					_id = e.id;
					_name = e.name_zh;
					_name_en = e.name_en;
					if(_name == null) _name = _id
					$(classname).append('<div class="' + classname1 + ' zb_list_id" data-id="' + _id + '" data-name="' + _name + '" title="' + _name_en + '">' + _name + '</div>');
				}

			});
		},
		error: function(data) {
			console.log(data.error().status);
		}
	});
}

var dataDesc = {
	//图表数据获取
	urlLoad: function(id, url, country, indicator, start, end, echartType, indicator_cn) {
		if(country) {
			url += "&country=" + country;
		}
		if(indicator) {
			url += "&indicator=" + indicator;
		}
		if(start) {
			url += "&start=" + start;
		}
		if(end && end !== 'undefined') {
			url += "&end=" + end;
		}
		console.log(url);
		// 基于准备好的dom，初始化echarts图表
		var myChart = echarts.init(document.getElementById(id), 'walden');
		if(location.href.indexOf("add_viewpoint")) {
			$("#" + id).append("<span class='glyphicon glyphicon-remove new_close none'></span>");
		}

		var fla = true,
			s = {};

		myChart.showLoading();
		//异步加载方法
		$.get(url).done(function(data) {
			myChart.hideLoading();
			//			var d;
			console.log(data);

			// 填入数据
			var ds = []; //merge后时间数组
			var vs = []; //数据二维字典
			var ss = [];
			var cs = [];
			//merge时间，获得x轴分类
			$.each(data, function(key, val) {
				var d = []; //时间数组
				var v = []; //数据字典
				$.each(val.data, function(i, obj) {
					v[obj.date] = obj.value;
					d.push(obj.date);
				});
				$.merge(ds, d);
				vs[key] = v;
				console.log(val)
				indicator_name_cn = val.indicator.name_zh;
			});
			ds = uniqueSort(ds);

			//计算series
			$.each(data, function(key, val) {
				var s = {}; //series
				var v = vs[key];
				var _d = []; //data
				$.each(ds, function(i, d) {
					if(v[d]) {
						_d.push(v[d]);
					} else {
						_d.push('');
					}
				});
				//              s.type = 'line';
				//              s.name = key;
				//              s.areaStyle = {normal: {}};
				//              s.data = _d;
				//              ss.push(s);
				cs.push(key);
				//切换图表样式
				if(!echartType || echartType == '' || echartType == undefined) {
					echartType = 'line';
					fla = false;
				}
				if(echartType === 'line' && echartType) {
					fla = false;
					s = {
						name: key,
						type: echartType,
						smooth: true,
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						},
						data: _d
					}
				} else if(echartType === 'bar' && echartType) {
					fla = true;
					s = {
						name: key,
						type: echartType,
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default'
								}
							}
						},
						data: _d
					}
				}
				ss.push(s);

			});

			myChart.setOption({
				title: {
					text: indicator_name_cn
				},
				tooltip: {
					//				trigger: 'axis'
				},
				legend: {
					data: cs //["邮件营销","联盟广告","视频广告","直接访问","搜索引擎"]
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				dataZoom: [{
					id: 'dataZoomX',
					type: 'slider',
					xAxisIndex: [0],
					filterMode: 'filter'
				}],
				//			grid: {
				//				left: '3%',
				//				right: '4%',
				//				bottom: '3%',
				//				containLabel: true
				//			},
				xAxis: [{
					type: 'category',
					boundaryGap: fla,
					data: ds //["周一","周二","周三","周四","周五","周六","周日1312"]
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
						inside: true,
						formatter: function(value, index) {
							var v = 0;
							//                      console.log(value);
							if(value >= 100000000) {
								v = value / 100000000;
								v += '亿';
							} else {
								v = value;
							}
							return v;
						}
					}
				}],
				series: ss
			});
			if(window.location.href.indexOf('inland_data') >= 0) {
				myChart.on('click', function(params) {
					console.log(params);
//					newWin('map.html?year=' + encodeURIComponent(params.name) + '&indicator=' + encodeURI(encodeURIComponent($('#show_indicator_list_name').text())), 'map_on')
					newWin('map.html?indicator='+indicator+'&country=CN&d=' + encodeURIComponent(params.name), 'map_on');
//					window.open('map.html?year=' + encodeURIComponent(params.name) + '&indicator=' + encodeURI(encodeURIComponent($('#show_indicator_list_name').text())));
				});
			}
		});

	},
	//数据导航列
	navList: function(filter_txt, call, url) {
		//页面加载缓冲的过滤
		if(localStorage.filterTxt) {
			var filter_html = '',
				len = 0,
				minlen,
				localStorage_filterTxt = localStorage.filterTxt;
			if(localStorage_filterTxt.indexOf(',')) {
				var lf = localStorage_filterTxt.split(',');
				len = lf.length;
				minlen = len < 10 ? 0 : len - 10;
				for(var i = len - 1; i > minlen - 1; i--) {
					filter_html += '<span><a href="javascript:void(0);" class="data_nav_filter_txt">' + lf[i] + '</a></span>';
					filter_txt.push(lf[i]);

				}
			} else {
				filter_html += '<span><a href="javascript:void(0);" class="data_nav_filter_txt">' + localStorage_filterTxt + '</a></span>';
				filter_txt.push(localStorage_filterTxt);
				console.log(filter_html);
			}
			$(".nav_txt").append(filter_html);
		}

		$.ajax({
			type: "get",
			url: url,
			data: {
				token: localStorage.token//'w1N3dahtnIny9Vaty4WZskJiOcsICdazhzMrvdWadpNGbwu9FdaioTYny1WZt0gTOs3QWMc2czNa1QzdrhlTOdsIiZwi4WNay9Wbn9BAdt=oDM'
			},
			async: true,
			success: function(data) {
				var html = '';
				console.time("列循环");
				//原生态for循环
				var html = '',
					listHtml = '',
					hrf = window.location.href,
					urlPage;
				window.location.href.indexOf('inland')>-1 ? urlPage = 'inland_data.html' : urlPage = 'data.html';
				console.log(urlPage);
//				return;
				for(var i = 0, len = data.length; i < len; i++) {
					var a = data[i];
					//					console.log($(a));
					html += '<dl class=""><dt>' + data[i].name + '</dt>';
					var listHtml = '<div class="panel panel-default leftMenu"><div class="panel-heading" id="collapseListGroupHeading' + i + '" data-toggle="collapse" data-target="#collapseListGroup' + i + '" role="tab" >' +
						'<h5 class="panel-title" style="font-size:15px;"><svg class="icon sanjiao" aria-hidden="true"><use xlink:href="#icon-xiangyouxiaosanjiao"></use></svg> ' + data[i].name + '</h5></div>' +
						'<div id="collapseListGroup' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="collapseListGroupHeading' + i + '"><ul class="list-group">';
					for(var j = 0, jlen = $(a)[0].indicators.length; j < jlen; j++) {
						//									console.log(a.indicators[j]);
						html += '<dd class="data_nav_lists"><a href="' + urlPage + '?id=' + a.indicators[j].id + '&name=' + a.indicators[j].name_zh + '" data-id="' + a.indicators[j].id + '" class="data_nav_click" title="' + a.indicators[j].name_zh + '" >' + a.indicators[j].name_zh + '</a><span class="glyphicon glyphicon-star-empty btn_collect none" title="收藏" ></span></dd>';
						if(hrf.indexOf("data.html")) {
							listHtml += '<li class="list-group-item"><a class="menu-item-left data_nav_click" href="data.html?id=' + a.indicators[j].id + '&name=' + a.indicators[j].name_zh + '" data-id="' + a.indicators[j].id + '" title="' + a.indicators[j].name_zh + '"><span class="glyphicon glyphicon-triangle-right"></span>' + a.indicators[j].name_zh + '</a></li>'
						}
					}
					html += '</dl>';
					listHtml += '</ul></div></div>';
					if(hrf.indexOf("data.html") >= 0) {
						$("#data_incList").append(listHtml);
					}
				}

				$("#data_nav_lists").append(html);

				//瀑布流引用
				var $waterfall = $('#data_nav_lists');
				pbl_width = $("#data_nav_lists").width();
				$waterfall.masonry({
					columnWidth: pbl_width / 3
				});
				$("#inputSearch").removeProp("readonly");
				console.timeEnd("列循环");
				//点击最近过滤文字
				$(document).on("click", ".data_nav_filter_txt", function() {
					var val = $(this).text();
					$("#inputSearch").val(val).keyup();
				});
				call();
			}
		});
	},
	//表格加载数据
	loadDatas: function(_href, indicator) {
		console.log(_href);
		$("#data_table").find("tbody").html('');

		$.ajax({
			type: "get",
			url: _href + "/data/stat?indicator=" + indicator,
			async: true,
			success: function(data) {
				//							console.log(data);
				console.time("表格数据：");
				$.each(data, function(i, e) {
					//								console.log(e);
					var table_icon_style = '',
						html = '<tr>';
					if((e.previous - e.val) > 0) {
						table_icon_style = 'glyphicon-arrow-up green';
					} else {
						table_icon_style = 'glyphicon-arrow-down red';
					}
					html += '<td>' + e.country_name + '</td>' +
						'<td>' + e.val + '</td>' +
						'<td><span class="table_data">' + timeF(e.time, 'mm') + '</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon ' + table_icon_style + '"></span></td>' +
						'<td>' + e.previous + '</td>' +
						'<td>' + e.max + '</td>' +
						'<td>' + e.min + '</td>';
					html += '</tr>';
					$("#data_table").find("tbody").append(html);
				});
				console.timeEnd("表格数据：");
			}
		});
	},
	//搜索框事件
	dataSearch: function(filter_txt) {
		// 搜索框键盘弹起事件-过滤导航列表
		$(document).on("keyup", "#inputSearch", function(e) {
			$dd = $("#data_nav_lists dd");
			var val = $(this).val();
			console.log(val);
			var dTxt;
			$dd.not(":contains('" + val + "')").hide();
			$dd.filter(":contains('" + val + "')").each(function(i, e) {
				$(e).show();
			});
			if(val.length == 0) {
				$dd.show().css("color", "#3b5998");
				$dd.find("a").css("color", "#3b5998");
			}
			var $waterfall = $('#data_nav_lists');
			pbl_width = $("#data_nav_lists").width();
			$waterfall.masonry({
				columnWidth: pbl_width / 3
			});

		});

		// 搜索框失去焦点把值加到过滤中
		$(document).on("blur", "#inputSearch", function(e) {
			var $filter_txt = $(".nav_txt").find("span").filter(":gt(0)");
			$.each($filter_txt, function(i, e) {
				var filterTxt = $(e).text();
				filter_txt.push(filterTxt);
			});
			var val = $(this).val().trim(),
				fla = true;
			if(val !== '' && val.length > 0) {
				var html = '<span><a href="javascript:void(0);" class="data_nav_filter_txt">' + val + '</a></span>';
				for(var i = 0, len = filter_txt.length; i < len; i++) {
					for(var j = 0; j < len; j++) {
						var filter_val = filter_txt[j];
						filter_val !== val ? fla = true : fla = false;
					}
					if(fla) {
						filter_txt.push(val);
						$(".nav_txt").append(html);
						break;
					}
				}
				//				filter_txt = filter_txt.sort();
				$.unique(filter_txt);
				console.log(filter_txt);
				localStorage.setItem("filterTxt", filter_txt);
			}
		});
	},
	//切换图表样式
	echartStyle: function() {
		$(document).on("click", ".echarts_style", function() {
			$(this).css("color", "#44c66a").siblings().css("color", "#000");
			console.log($(this).attr("id"));
			if($(this).attr("id") == "line") {
				echartType = "line";
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}
			if($(this).attr("id") == "bar") {
				echartType = "bar";
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}
			if($(this).attr("id") == "oneLine") {
				echartType = "oneLine";
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}

		});
	},
	//年份触发事件
	yearChange: function(_url) {
		$(document).on("change", "#start_year,#end_year", function() {
			$("#echarts_main").show();
			if($(this).attr("id") == "start_year") {
				start = $(this).val();
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}
			if($(this).attr("id") == "end_year") {
				end = $(this).val();
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}

		});
	},
	//删除已选标签
	delTxtLable: function() {
		$(document).on("click", ".country_txt_close", function() {
			$(this).parent().parent().remove();
			countrys = [];
			indicators = [], _vals = [];
			console.log($("#countrys_vals").length);
			if($("#countrys_vals").length > 0) {
				console.log("已删除");
				for(var i = 0; i < $(".countrys_txt").length; i++) {
					countrys.push($(".countrys_txt").eq(i).attr("data-id"));
					_vals.push($(".indicators_txt").eq(i).attr("data-name"));
				}
				//						console.log(countrys)
				country = countrys.toString();
				dataDesc.urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			} else {
				urlLoad("echarts_main", _url, country, indicator, start, end, echartType);
			}
		});
	},
	//国家指标列表点击事件
	countryListClick: function(id) {
		var id;
		if(id) {
			id = id;
		} else {
			id = "echarts_main";
		}
		console.log(id);
		$('.countrys_list,.zb_list').on('click', 'div.countrys_ls,div.zb_ls', function(e) {
			e.stopPropagation();
			$("#echarts_main").show();
			if(countrys.length > 0 || indicators.length > 0) {
				countrys = [];
				indicators = [];
				_vals = [];
			}
			var _classname = $(this).attr("class"),
				_id = $(this).attr("data-id"),
				_name = $(this).attr("data-name");
			var txt = $(this).html();
			//					console.log(_classname)
			if(_classname.indexOf("countrys_ls") >= 0) {
				//						console.log("country_ls");
				$("#countrys").val(txt);
				$('.countrys_list').hide();
				var c_html = "<div style='display:inline-block;margin-right:10px'>" +
					"<p data-id='" + _id + "' class='countrys_txt' data-name='" + _name + "' style='margin:0 3px;padding:0 15px;border:1px solid #666;position:relative;'>" + $("#countrys").val() + "<span class='glyphicon glyphicon-remove country_txt_close none' title='删除'></span></p></div>";
				//		$("#countrys_vals").append(c_html);
				var txts = $(".countrys_txt"),
					country_fals = true;

				if(txts.length) {
					for(var i = 0; i < txts.length; i++) {
						if(txts[i].innerText === txt) {
							alert("已有这个国家");
							country_fals = false;
							break;
						}
					}
					if(country_fals) {
						$("#countrys_vals").append(c_html);
					}
				} else {
					$("#countrys_vals").append(c_html);
				}
				for(var i = 0; i < $(".countrys_txt").length; i++) {
					countrys.push($(".countrys_txt").eq(i).attr("data-id"));
				}
				country = countrys.toString();
				dataDesc.urlLoad(id, _url, country, indicator, start, end, echartType);
			} else if(_classname.indexOf("zb_ls") >= 0) {
				//						console.log("zb_ls");
				$("#indicator").val(txt);
				$('.zb_list').hide();
				/*var i_html = "<div style='display:inline-block;'>"+
					"<p data-id='"+_id+"' class='indicators_txt' data-name='"+_name+"' style='margin:0 3px;padding:1px 15px;border:1px solid #666;position:relative;'>"+ $("#indicator").val()+ "<span class='glyphicon glyphicon-remove country_txt_close none'></span></p></div>";
				$("#indicators_vals").append(i_html);*/
				/*for(var i=0;i<$(".indicators_txt").length;i++){
									indicators.push($(".indicators_txt").eq(i).attr("data-id"));
		//							_vals.push($(".indicators_txt").eq(i).attr("data-name"));
								}*/
				indicator = _id;
				console.log(indicator);
				dataDesc.urlLoad(id, _url, country, indicator, start, end, echartType);
				dataDesc.loadDatas(_href, indicator);
				$("#show_indicator_list_name").text(_name);
			}
		});
	},
	//国家，经济指标输入内容键盘弹起事件
	ciKeyup: function() {
		$("#countrys,#indicator").on("keyup", function() {
			var country_val = $("#countrys").val();
			var indicator_val = $("#indicator").val();
			var _src = ''; //'data.json'; //
			var _idname = $(this).attr("id");
			if(_idname.indexOf("country") >= 0) {
				//						console.log("cc");
				_src = _href + interfacelist.select_country + country_val;
				ci(".countrys_list", 'countrys_ls', _src);
			} else if(_idname.indexOf("indicator") >= 0) {
				//						console.log("dd");
				_src = _href + interfacelist.select_indicator + indicator_val;
				ci(".zb_list", 'zb_ls', _src);
			}
		});
	},
	// 收藏，取消收藏事件
	collec: function(loadCollec) {
		var collec = [],
			collect_gl = true;
		// 点击列表收藏按钮
		$(document).on("click", ".btn_collect", function() {
			var coll_class = $(this).prop("class"),
				objCollec = {},
				collfal = true;
			var $colls = $(".data_nav_collect_click");
			if(coll_class.indexOf("glyphicon-star-empty") > 0) {
				if(localStorage.collec) collec = JSON.parse(localStorage.collec);
				$(this).removeClass("glyphicon-star-empty").addClass("glyphicon-star");
				objCollec.id = $(this).prev().attr("data-id");
				objCollec.name = $(this).prev().text();
				var html = '<p><a href="data.html?id=' + objCollec.id + '&name=' + objCollec.name + '" data-id="' + objCollec.id + '" class="data_nav_collect_click">' + objCollec.name + '</a><span class="glyphicon glyphicon-remove del_collect none" title="收藏"></span></p>';
				//				console.log($colls);
				if($colls) {
					for(var i = 0, len = $colls.length; i < len; i++) {
						if($colls[i].getAttribute("data-id") !== objCollec.id) {
							collfal = true;
						} else {
							collfal = false;
							break;
						}
					}
					if(collfal) {
						collec.push(objCollec);
						localStorage.setItem("collec", JSON.stringify(collec));
						$(".collects_content").append(html);
					}
				} else {
					collec.push(objCollec);
					localStorage.setItem("collec", JSON.stringify(collec));
					$(".collects_content").append(html);
				}
				$(".collects_content").append();
				$(this).attr("title", "取消收藏");
			} else if(coll_class.indexOf("glyphicon-star") > 0) {
				//				$(this).bind("mouseleave");
				_this = $(this);
				$(this).attr("title", "收藏");
				$(this).removeClass("glyphicon-star").addClass("glyphicon-star-empty");
				//		collec.shift(objCollec);

				$.each($colls, function(i, e) {
					//					console.log(_this.prev().attr("data-id"));
					//					console.log(e.getAttribute("data-id"));
					if(e.getAttribute("data-id") === _this.prev().attr("data-id")) {
						$(e).parent().empty();
						return false;
					}
				});
				$colls = $(".data_nav_collect_click"), collec = [];
				$.each($colls, function(i, e) {
					objCollec = {};
					objCollec.id = e.getAttribute("data-id");
					objCollec.name = e.innerText;
					collec.push(objCollec);
				});
				localStorage.setItem("collec", JSON.stringify(collec));
			}
		});
		// 删除收藏中的指标
		$(document).on("click", ".del_collect", function(event) {
			event.stopPropagation();
			$(this).parent().empty();
			var $colls = $(".data_nav_collect_click"),
				collec = [];
			if($colls) {
				$colls = $(".data_nav_collect_click");
				//		$.each($colls, function(i,e) {
				for(var i = 0; i < $colls.length; i++) {
					//					console.log($colls[i]);
					var objCollec = {};
					objCollec.id = $colls[i].getAttribute("data-id");
					objCollec.name = $colls[i].innerText;
					collec.push(objCollec);
				}
				//		});
				//				console.log(collec);
				localStorage.setItem("collec", JSON.stringify(collec));
			}
			//			if (!$colls.length) {
			//				localStorage.removeItem("collec");
			//			}
			var $ddList = $(".data_nav_lists");
			$.each($ddList, function(ind, e) {
				$(e).find(".btn_collect").removeClass("glyphicon-star").addClass("glyphicon-star-empty").attr("title", "收藏");
			});

			if(localStorage.collec) {
				var colles = JSON.parse(localStorage.collec);
				$ddList = $(".data_nav_lists");
				for(var i = 0; i < colles.length; i++) {
					$.each($ddList, function(ind, e) {
						//						console.log($(e).find("a").attr("data-id"))
						//						console.log(colles[i].id)
						if(colles[i].id === $(e).find("a").attr("data-id")) {
							$(e).find(".btn_collect").removeClass("glyphicon-star-empty").addClass("glyphicon-star").attr("title", "取消收藏");
						}
					});
				}
			}
		});
		// 点击收藏中管理
		$(document).on('click', ".collects_title_right", function(e) {
			e.stopPropagation();
			//			if (collect_gl) {
			//				$('.del_collect').show();
			//				collect_gl = false;
			//				$(this).text("完成");
			//			} else if(!collect_gl){
			//				$('.del_collect').hide();
			//				collect_gl = true;
			//				$(this).text("管理");
			//			}
			collectManage();
		});
		$(document).on('click', 'body', function() {
			if($(".collects_title_right").text() === "完成") {
				$('.del_collect').hide();
				$(".collects_title_right").text("管理");
			}
		});

		function collectManage() {
			if($(".collects_title_right").text() == "完成") {
				$('.del_collect').hide();
				$(".collects_title_right").text("管理");
			} else if($(".collects_title_right").text() == "管理") {
				$('.del_collect').show();
				$(".collects_title_right").text("完成");
			}
		}
	}
}

function newWin(url, id) {
	var a = document.createElement('a');
	a.setAttribute('href', url);
	a.setAttribute('target', '_blank');
	a.setAttribute('id', id);
	// 防止反复添加
	if(!document.getElementById(id)) {
		document.body.appendChild(a);
	}
	a.click();
}