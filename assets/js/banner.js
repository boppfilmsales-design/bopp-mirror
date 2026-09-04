      $('#banner .flexslider').flexslider({
          animation: "slide",
          animationLoop: true,
          slideshow: true,
          prevText:"",
          nextText:"",
          controlNav: true,
          directionNav: true,
          pauseOnHover: true,
          slideshowSpeed: 3000, 
          start:function(slider){

        },
      before: function(){
          $('.flexslider').resize();
      },
      after: function(slider) {
        initState();
          move();
      }
      });
      function initState(){
        $('#banner .animated').each(function(){
          var dataAnimate = $(this).data('animate');
          $(this).removeClass(dataAnimate);
        })
      }
      function move(){
        var p = $('#banner .slides li.flex-active-slide').find('p');
        var h5 = $('#banner .slides li.flex-active-slide').find('h5');
        var h2 = $('#banner .slides li.flex-active-slide').find('h2');
        var h3 = $('#banner .slides li.flex-active-slide').find('h3');
          p.addClass( p.data('animate') );
          h5.addClass( h5.data('animate') );
          h2.addClass( h2.data('animate') );
          h3.addClass( h3.data('animate') );
      }
      //第一次的时候执行动画
      $(window).load(function(){
        move();
      })
