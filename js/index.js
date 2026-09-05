$(function() {
    "use strict";

    var swiper = new Swiper('.swiper-container', {
        effect: 'fade',
        /*fadeEffect: {
            crossFade: 'false',
        },*/
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        on: {
            init: function() {
                swiperAnimateCache(this);
                swiperAnimate(this);
            },
            slideChangeTransitionEnd: function() {
                swiperAnimate(this);
            }
        }
    });
    $(".swiper-container").on("mouseenter", function() {
        $(".index-banner .swiper-button-next, .index-banner .swiper-button-prev").fadeIn("fast");
    }).on("mouseleave", function() {
        $(".index-banner .swiper-button-next, .index-banner .swiper-button-prev").fadeOut("fast");
    });
    setTimeout(function() {
        var numRun = $(".numberRun").numberAnimate({
            num: '1999',
            speed: 1500,
        });
        var numRun2 = $(".numberRun2").numberAnimate({
            num: '120',
            speed: 1500,
        });
        var numRun3 = $(".numberRun3").numberAnimate({
            num: '80',
            speed: 1500
        });
        var numRun4 = $(".numberRun4").numberAnimate({
            num: '24',
            speed: 1500
        });
        var numRun4_1 = $(".numberRun4-1").numberAnimate({
            num: '365',
            speed: 1500
        });
        var numRun5 = $(".numberRun5").numberAnimate({
            num: '2000',
            speed: 1500
        });
    }, 1500);

    $(".items-steps .item").on("mouseenter", function() {
        $(this).addClass("cur").siblings(".item").removeClass("cur");
        $(".items-steps .step").eq($(this).index()).addClass("cur").siblings(".step").removeClass("cur");
    });
    $(".items-steps .item").on("mouseleave", function() {
        $(".items-steps .item").removeClass("cur");
        $(".items-steps .step").removeClass("cur");
    });

	
});

