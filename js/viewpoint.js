$("header").load("header.html");
$("footer").load("footer.html");
$(function() {
	if (!localStorage.token) {
		alert("请登录后进行操作！");
		$("#phone").show();
		return false;
	}
	setTimeout(function(){
		console.log($("#navs li").length)
		$("#navs li").eq(1).addClass("active").siblings().removeClass("active");
	},500);
	//接口  resource type 11，12，13，14/视频、图片、文本、html片段
	var _href = "http://api.jjrb.grsx.cc",
		interfacelist = {
			feed: "/feed/t/3",
		},
		n = 1,fl = true;
	scorllajax(n);
	console.log(localStorage.token);
	//ajax按页获取观点内容
	function scorllajax(n) {
		var urll;
		if(n <= 0) urll = "viewpoint.json";
		else urll = "viewpoint" + n + ".json"
		$.ajax({
			type: "get",
			url: _href+interfacelist.feed,//urll, //
			async: true,
			data:{token:localStorage.token,page:n},
			success: function(data) {
				if(data.length > 0) {
					data.forEach(function(e, i) {
//						$("#aa").append(e.resources[0].descp);
//						var otitle;
//						if ($("#aa .otitle")) {
//							otitle = $("#aa .otitle").text().substring(6)
//						}else{
//							otitle = e.resources[0].title;
//						}
						
						var a = $("<div></div>");
						e.resources.forEach(function(res,inx){
							console.log(res);
							if (res.type==2) {
								console.log("图片");
								a.append('<p><img src="' + res.uri + '" /></p>');
							} else{
								a.append(res.descp);
							}
						});
						
						var html = '<div class="col-sm-12 col-md-12 col-xs-12 viewpoint">' +
									'<a href="my_viewpoint.html?id=' + e.owner.id + '" target="_blank"><img class="header_img" src="' + e.owner.head + '" /></a>' +
									'<h2 class="viewpoint_title"><a href="viewpoint_desc.html?id=' + e.id + '" target="_blank">' + e.title + '</a></h2>' +
									'<small>来源： <span class="source"> 经济日报  </span> <span class="source_time">&nbsp;  ' + timeF(e.created) + '</span></small>' +
									'      <div class="viewpoint_txt">'+ a[0].outerHTML +
									'</div> </div>';
//						console.log(html);			
						$("#viewpoint").append(html);	
//						$(".otitle").hide();
//						$("#aa").html("");
					});
					
					fl = true;
				} else {
					$("#viewpoint").html("没有内容");
				}
			}
		});
		$(document).on("scroll", function() {
			var bodyheight = $(document.body).height();
			var scorlltop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
			var viewheight = $(window).height();
//						console.log(bodyheight + " ===" + scorlltop + "=========" + viewheight);
			if((scorlltop + viewheight) >= bodyheight) {
				n++;
				if (fl) {
//							setTimeout(,500);
				scorllajax(n);
				}
				fl=false;
			}
		});
	}
});