setTimeout(function(){
	console.log($("#navs li").length)
	$("#navs li").removeClass("active").eq(0).addClass("active");
},1000);
//接口
var _href = "http://api.jjrb.grsx.cc",
	interfacelist = {
		select_indicator: "/data/indicator/k/", //查询indicator
		select_data: "/data", //查询数据   ?country=CN,US&indicator=NY.GDP.MKTP.CD&start=1990
		host_indicator: "/data/indicator/hot", //热门
		select_country: "/data/country/k/",//查询国家/data/country/k/{val}
		wx: "/login/wx",//微信登录
		indicator_list: '/data/group?type=1&with_indicator=1',
		indicator_stat:'/data/stat?indicator=NY.GDP.MKTP.CD'
	},
	countrys=[],    //国家
	indicators=[],  //指标
	_vals=[],       //
	filter_txt=[],  //过滤
	echartType="line",//图表样式
	year = "";
var u = getUrlParams(),
	country = u.country,
    indicator = u.indicator,
    start = u.start,
    end = u.end;
var _url = _href + interfacelist.select_data+"?";

//指标导航列表
dataDesc.navList(filter_txt);
//搜索框事件
dataDesc.dataSearch(filter_txt);
//加载指标列表数据
dataDesc.loadDatas(_href,u.id);
$("#show_indicator_list_name").text(decodeURIComponent(u.name));

$(".form_year").change(function(){
	year = $(this).val();
	console.log(year);
});


if (country) {
	dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
}else{
	$(document).on("change",".form_country",function(){
		var country = $(this).val();
		console.log(country);
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	});
	
}
//可搜索国家，经济指标
$(document).on(function(){
	$(".countrys_list,.zb_list").css("top",$("#countrys").outerHeight()+"px");
});

//国家输入内容键盘弹起事件
$("#countrys,#indicator").on("keyup", function() {
	var country_val = $("#countrys").val();
	var indicator_val = $("#indicator").val();
	var _src = "";//'data.json'; //
//					console.log(_src);
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
//国家，经济指标通用方法
function ci(classname, classname1, src) {
	$(classname).show();
	$(classname).html("");
	$.ajax({
		type: "get",
		url: src,
		success: function(data) {
			var d = data;
//							console.log(d);
			$(d).each(function(i, e) {
//								console.log(e);
				var _name,_id;
				if (classname.indexOf("country")>=0) {
					_id = e.iso2_code;
					_name = e.name;
					$(classname).append('<div class="' + classname1 + ' cou_list_id" data-id="'+_id+'" data-name="'+_name+'" title="'+e.id+'">' + _name + '</div>');
				} else if(classname.indexOf("zb")>=0){
					_id = e.id;
					_name = e.name_cn;
					if(_name==null)_name=_id
					$(classname).append('<div class="' + classname1 + ' zb_list_id" data-id="'+_id+'" data-name="'+_name+'" title="'+_id+'">' + _name + '</div>');
				}
				
			});
		},
		error: function(data) {
			console.log(data.error().status);
		}
	});
}
//点击弹出层国家列表隐藏
$("body").on("click", function(e) {
	
	$(".countrys_list,.zb_list").hide();
});
//阻止输入框点击默认事件
$(".desc_position").on("click", function(e) {
	e.stopPropagation();
});
//鼠标移到列表上样式
$('.countrys_list,.zb_list').on('mouseenter', 'div.countrys_ls,div.zb_ls', function() {
	$(this).addClass("countrys_style").siblings().removeClass("countrys_style");
});
//国家指标列表点击事件
$('.countrys_list,.zb_list').on('click', 'div.countrys_ls,div.zb_ls', function(e) {
	e.stopPropagation();
	$("#echarts_main").show();
	if(countrys.length>0||indicators.length>0){
		countrys=[];
		indicators=[];
		_vals=[];
	}
	var _classname = $(this).attr("class"),_id=$(this).attr("data-id"),_name=$(this).attr("data-name");
	var txt = $(this).html();
//					console.log(_classname)
	if(_classname.indexOf("countrys_ls") >= 0) {
//						console.log("country_ls");
		$("#countrys").val(txt);
		$('.countrys_list').hide();
		var c_html = "<div style='display:inline-block;margin-right:10px'>"+
			"<p data-id='"+_id+"' class='countrys_txt' data-name='"+_name+"' style='margin:0 3px;padding:0 15px;border:1px solid #666;position:relative;'>"+$("#countrys").val()+"<span class='glyphicon glyphicon-remove country_txt_close none' title='删除'></span></p></div>";
		$("#countrys_vals").append(c_html);
		for(var i=0;i<$(".countrys_txt").length;i++){
			countrys.push($(".countrys_txt").eq(i).attr("data-id"));
//							_vals.push($(".indicators_txt").eq(i).attr("data-name"));
		}
		country = countrys.toString();
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
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
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
});

//列表移入移出事件
$(document).on("mouseenter",".countrys_txt,.indicators_txt",function(){
	$(this).find(".country_txt_close").show().css({"position":"absolute","right":0,"top":0});
});
$(document).on("mouseleave",".countrys_txt,.indicators_txt",function(){
	$(".country_txt_close").hide();
});

//删除已选标签
$(document).on("click",".country_txt_close",function(){
	$(this).parent().parent().remove();
	countrys=[];indicators=[],_vals=[];
	console.log($("#countrys_vals").length);
	if ($("#countrys_vals").length>0) {
		console.log("已删除");
		for(var i=0;i<$(".countrys_txt").length;i++){
			countrys.push($(".countrys_txt").eq(i).attr("data-id"));
			_vals.push($(".indicators_txt").eq(i).attr("data-name"));
		}
//						console.log(countrys)
		country = countrys.toString();
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	} else{
		urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
});


var endyear = new Date().getFullYear(),yearhtml;
for(var i=100;i>0;i--){
	yearhtml+="<option value='"+endyear+"'>"+endyear+"年</option>";
	endyear--;
}
$("#start_year,#end_year").append(yearhtml);

//年份触发事件
$(document).on("change","#start_year,#end_year",function(){
	$("#echarts_main").show();
	if ($(this).attr("id")=="start_year") {
		start = $(this).val();
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
	if ($(this).attr("id")=="end_year") {
		end = $(this).val();
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
	
});

//切换图表样式
$(document).on("click",".echarts_style",function(){
	$(this).css("color","#44c66a").siblings().css("color","#000");
	console.log($(this).attr("id"));
	if ($(this).attr("id")=="line") {
		echartType = "line";
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
	if ($(this).attr("id")=="bar") {
		echartType = "bar";
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
	if ($(this).attr("id")=="oneLine") {
		echartType = "oneLine";
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	}
	
});

//判断收藏菜单
var _left = $(".container").offset().left;
if (_left>210) {
	$("#collects").show();
//	$("#collects").css({"width":_left-50+"px","margin":"0 20px"});
} else{
	$("#collects").hide();
	//收藏
	$(document).on("mousemove","#collect",function() {
		$("#collects").show();
		$("#collect").hide();
	})
	$(document).on("mouseleave","#collects",function() {
		$("#collects").hide();
		$("#collect").show();
	})
}

//点击数据指标导航列
$(document).on("click",".data_nav_click",function(){
//					console.log($(this));
	indicator = this.getAttribute("data-id");
	console.log(indicator);
	$("#data_show").show();
	$("#data_table").show();
	$("#data_nav").hide();
	$("#show_indicator_list_name").text(this.innerText);
	$("#data_table").find("tbody").html('');
//					$("#indicator").val($(this).text());
});


//点击指标列表
$(document).on("click","#show_indicator_list",function(){
	$("#data_show").hide();
	$("#data_nav").show();
	$("#data_table").hide();
});
	

			