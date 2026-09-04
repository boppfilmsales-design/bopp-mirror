

/*====================================页面配置====================================*/

$(function(){

	

	var sWidth=document.documentElement.scrollWidth;

	var sHieght=document.documentElement.scrollHeight;

	var in_height=document.body.offsetHeight;

	$("#banner").width(sWidth) ;

	$("#banner").slide({titCell:".hd li",mainCell:".bd ul",effect:"fold",autoPlay:true,delayTime:800,interTime:6000,mouseOverStop:false});

	//TouchSlide({ slideCell:"#banner",mainCell:".bd ul ",effect:"leftLoop",autoPlay:true,delayTime:800,interTime:6000});

	$("#nav").slide({titCell:".title",targetCell:".list",type:"menu",effect:"slideDown",delayTime:200,triggerTime:210,returnDefault:false,titOnClassName:"on_on"});

	$("#nav li:first").addClass("no_bg");

	$("#nav .list").hover(function(){$(this).prev(".a").addClass("hover")},function(){$(this).prev(".a").removeClass("hover")})

	$("#nav li.title,.list_box").hover(function(){

    $(".list_box").css("height","50px");
	$("#nav li:nth-child(2) .list,#nav li:nth-child(3) .list,#nav li:nth-child(4) .list").addClass("text_left");
	$("#nav .list").css("z-index","999");

	},function(){

		$(".list_box").css("height","0px");

	});

	

	//友情链接



	$("#bnt_link").click(function(){



			$(this).toggleClass("icon_un");



			$("#content_link").slideToggle(0);



		});

		

	 

	$("#s_news").slide({titCell:".hd .a",mainCell:".bd",autoPage:false , effect:"fold",scroll:1,vis:1});

	$(".ar_article p:last").addClass("no_padding");

    $("#n_notice  li:odd").addClass("odd");

	

	//大事记

	$("#n_dsj dd:even").addClass("left_box");

	$("#n_dsj dd:odd").addClass("right_box");

 

	

	//人力资源

	$("#list_slide dt").click(function(){

			if ($(this).hasClass('on')) {

			$(this).next("dd").slideUp(); //展开

			$(this).removeClass("on"); 

		}else{

			$("#list_slide dl dt").removeClass("on");

			$("#list_slide dl dd").slideUp();

		 	$(this).next("dd").slideDown();

			$(this).toggleClass("on"); 

		}

			});

	 

	

});







		 

window.onscroll=function(){

 if($(window).scrollTop()>440){

	 $("#n_left").addClass("fix");

	 

	 }

	  else if($(window).scrollTop()<440){

	 $("#n_left").removeClass("fix");

	 }

 };

 



 $(document).mouseup(function(e){



	  var _con = $('.top_link');   // 设置目标区域



	  if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1



		$("#content_link").slideUp();



	  }



	});

