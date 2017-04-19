$(function() {
	setTimeout(function(){
		$(".nav>li").eq(2).addClass("active").css("color", "#3b5998");
		$('.viewpoint_header_img').attr('src','images/tabbar-paper-f.png');
	},500);
	//接口  resource type 11，12，13，14/视频、图片、文本、html片段
	var _href = "http://api.jjrb.grsx.cc",
//		interfacelist = interfacelist(),
		n = 1,fl = true,_url = _href + interfacelist.select_data+"?";
		
	scorllajax(n);
	console.log(localStorage.token);
	//ajax按页获取观点内容
	function scorllajax(n) {
		console.time("专家观点时间：");
		$.ajax({
			type: "get",
			url: _href+interfacelist.feed,
			async: true,
			data:{
				token:localStorage.token,
				page:n,
				limit:10
			},
			success: function(data) {
				if(data.length > 0) {
					$.each(data,function(i, e) {
						var descp='',echarts,type,echarts_data;
						$.each(e.resources,function(ind,e){
//							console.log(ind);
//							console.log(e);
							
							type = parseInt(e.type);
//							console.log(type);
							if (type === 12) {//图片
								descp += '<img src="' + e.uri + '">'
							}else if (type === 13) {//文本
								descp += '<p>'+e.descp+'</p>'
							} else if(type === 15){//数据
//											console.log(e.descp);
								var _id ='';
								if (e.descp) {
									console.log(e.descp.length);
									e.descp.length<0?echarts_data=e.descp:echarts_data=JSON.parse(e.descp);
									_id = echarts_data.id_val;
									console.log(echarts_data)
								}
								descp += '<div id="'+_id+'" style="min-height:500px;"></div>'
							}else{
								descp = e.descp
							}
						})
//						var des = JSON.stringify(descp);
						var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

						descp.replace(SCRIPT_REGEX, '');
						console.log(descp);
						window.ddd = descp;
						
//						return;
						var html = '<div class="col-sm-12 col-md-12 col-xs-12 viewpoint">' +
									'<a href="my_viewpoint.html?id=' + e.owner.id + '" target="_blank"><img class="header_img" src="' + e.owner.head + '" /></a>' +
									'<h2 class="viewpoint_title"><a href="viewpoint_desc.html?id=' + e.id + '" target="_blank">' + e.title + '</a></h2>' +
									'<small>来源： <span class="source"> 经济日报  </span> <span class="source_time">&nbsp;  ' + timeF(e.created) + '</span></small>' +
									'      <div class="viewpoint_txt">'+ descp +
									'</div><a href="viewpoint_desc.html?id=' + e.id + '" target="_blank">查看更多...</a></div>';
//						console.log(html);			
						$("#viewpoint").append(html);
						$.each($('.viewpoint_txt'), function(ind,event) {
							var a = $(event).find('p:lt(3)').text().length;
//							console.log(a);
							if (a>=200) {
								$(event).find('p:gt(1)').hide();
							} else{
								$(event).find('p:gt(2)').hide();
							}
						});
							
						if (echarts_data) {
							dataDesc.urlLoad(echarts_data.id_val,_url,echarts_data.country,echarts_data.indicator,echarts_data.start,echarts_data.end,echarts_data.echartType);
						}
					});
					
					fl = true;
				} else {
					$("#viewpoint").html("没有内容");
				}
			}
		});
		console.timeEnd("专家观点时间：");
		$(document).on("scroll", function() {
			var bodyheight = $(document.body).height();
			var scorlltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			var viewheight = $(window).height();
//			console.log(bodyheight + " ===" + scorlltop + "=========" + viewheight);
			if((scorlltop + viewheight) >= bodyheight) {
				n++;
				if (fl) {
				scorllajax(n);
				}
				fl=false;
			}
		});
	}
});