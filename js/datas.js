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
//设置初始值
var u = getUrlParams(),
	country = 'CN',
    indicator = u.id,
    start = u.start,
    end = u.end;
var _url = _href + interfacelist.select_data+"?";

//dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
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


if (country && indicator) {
	dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType);
	$("#indicator").val(decodeURIComponent(u.name));
	$("#countrys").val('中国');
	var initHtml = "<div style='display:inline-block;margin-right:10px'>"+
			"<p data-id='"+country+"' class='countrys_txt' style='margin:0 3px;padding:0 15px;border:1px solid #666;position:relative;'>"+$("#countrys").val()+"<span class='glyphicon glyphicon-remove country_txt_close none' title='删除'></span></p></div>";
	$("#countrys_vals").append(initHtml);
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

//列表移入移出事件
$(document).on("mouseenter",".countrys_txt,.indicators_txt",function(){
	$(this).find(".country_txt_close").show().css({"position":"absolute","right":0,"top":0});
});
$(document).on("mouseleave",".countrys_txt,.indicators_txt",function(){
	$(".country_txt_close").hide();
});




var endyear = new Date().getFullYear(),yearhtml;
for(var i=100;i>0;i--){
	yearhtml+="<option value='"+endyear+"'>"+endyear+"年</option>";
	endyear--;
}
$("#start_year,#end_year").append(yearhtml);





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

dataDesc.countryListClick();
dataDesc.delTxtLable();
dataDesc.yearChange();
dataDesc.echartStyle();
dataDesc.ciKeyup();

			