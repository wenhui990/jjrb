setTimeout(function(){
	console.log($("#navs li").length)
	$("#navs li").removeClass("active").eq(0).addClass("active");
},1000);
// 接口
var _href = "http://api.jjrb.grsx.cc",
	countrys=[],    //国家
	indicators=[],  //指标
	_vals=[],       //
	filter_txt=[],  //过滤
	echartType="line",//图表样式
	year = "";
// 设置初始值
var u = getUrlParams(),
	country = 'CN',
    indicator = u.id,
    start = u.start,
    end = u.end;
var _url = _href + interfacelist.select_data+"?";

// 指标导航列表
dataDesc.navList(filter_txt,loadCollec,'http://api.jjrb.grsx.cc/data/group?type=1&with_indicator=1');
// 搜索框事件
dataDesc.dataSearch(filter_txt);
// 加载表格指标列表数据
dataDesc.loadDatas(_href,u.id);
$("#show_indicator_list_name").text(decodeURIComponent(u.name));


if(localStorage.token){
	
}

// 鼠标移到导航列表上显示收藏按钮
$(document).on("mouseenter",".data_nav_lists",function(){
	$(this).find(".btn_collect").show();
});
// 鼠标移出导航列表上隐藏收藏按钮
$(document).on("mouseleave",".data_nav_lists",function(){
	var classname = $(this).find('span').attr('class');
//	console.log(classname.indexOf("star")>=0)
	if(classname.indexOf("collstar")>=0){
		$(this).find('span').show();
	}else if(classname.indexOf("empty")>=0){
		$(this).find('span').hide();
	}
});
// 加载收藏事件
dataDesc.collec(loadCollec);
// 加载缓冲中的收藏
function loadCollec(){
	if (localStorage.collec) {
		var $ddList = $(".data_nav_lists");
//		console.log($ddList)
		for (var i=0,colles=JSON.parse(localStorage.collec);i<colles.length;i++) {
			var html = '<p><a href="data.html?id='+colles[i].id+'&name='+colles[i].name+'" data-id="'+colles[i].id+'" class="data_nav_collect_click">'+colles[i].name+'</a><span class="glyphicon glyphicon-remove del_collect none" title="取消收藏"></span></p>';
			$(".collects_content").append(html);
			$.each($ddList, function(ind,e) {
//				console.log($(e).find("a").attr("data-id"))
//				console.log(colles[i].id)
				if (colles[i].id===$(e).find("a").attr("data-id")) {
					$(e).find(".btn_collect").removeClass("glyphicon-star-empty").addClass("glyphicon-star collstar").show().attr("title","取消收藏");
				}
			});
		}
	}
};

$(".form_year").change(function(){
	year = $(this).val();
	console.log(year);
});

// 如果国家和指标有数据加载图表
var indicator_cn = decodeURIComponent(u.name);
if (country && indicator) {
	dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType,indicator_cn);
	$("#indicator").val(indicator_cn);
	$("#countrys").val('中国');
	var initHtml = "<div style='display:inline-block;margin-right:10px'>"+
			"<p data-id='"+country+"' class='countrys_txt' style='margin:0 3px;padding:0 15px;border:1px solid #666;position:relative;'>"+$("#countrys").val()+"<span class='glyphicon glyphicon-remove country_txt_close none' title='删除'></span></p></div>";
	$("#countrys_vals").append(initHtml);
}else{
	$(document).on("change",".form_country",function(){
		var country = $(this).val();
		console.log(country);
		dataDesc.urlLoad("echarts_main",_url,country,indicator,start,end,echartType,indicator_cn);
	});
	
}
// 可搜索国家，经济指标
$(document).on(function(){
	$(".countrys_list,.zb_list").css("top",$("#countrys").outerHeight()+"px");
});


// 点击弹出层国家列表隐藏
$("body").on("click", function(e) {
	$(".countrys_list,.zb_list").hide();
});
// 阻止输入框点击默认事件
$(".desc_position").on("click", function(e) {
	e.stopPropagation();
});
// 鼠标移到列表上样式
$('.countrys_list,.zb_list').on('mouseenter', 'div.countrys_ls,div.zb_ls', function() {
	$(this).addClass("countrys_style").siblings().removeClass("countrys_style");
});

// 列表移入移出事件
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


// 设置收藏框的高度
var collectstop = $('#collects').offset().top;
var winHeight = $(window).height();
$('#collects').css("maxHeight",(winHeight-collectstop-80)+'px');

// 点击数据指标导航列
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


// 点击指标列表
$(document).on("click","#show_indicator_list",function(){
	$("#data_show").hide();
	$("#data_nav").show();
	$("#data_table").hide();
});
// 国家列表点击事件
dataDesc.countryListClick();
// 删除已选标签
dataDesc.delTxtLable();
// 年份触发事件
dataDesc.yearChange();
// 图表样式
dataDesc.echartStyle();
// 国家经济指标键盘弹起事件
dataDesc.ciKeyup();

			