(function($){
  $(function(){
    // Masonry Grid
    var $container = $('#masonry-grid');

    // initialize
    $container.masonry({
      columnWidth: '.col:not([style*="display: none"])',
      itemSelector: '.card-wrapper',
      horizontalOrder: true
    });

    // Show/reveal cards
    $(".tag-name").click(function(el){
      el.preventDefault();
      const tag = $(this).data("tag");
      var $chips = $("[data-tag="+tag+"] > .chip");
      var $cards = {};
      console.log('chip status:');
      console.log($chips.hasClass("active-chips"));
      if ($chips.hasClass("active-chips")){
        $chips.toggleClass("active");
        $chips.toggleClass("active-chips");
        console.log('total active : ')
        console.log($(".active-chips").length);
        var total_active = $(".active-chips").length;
        if (total_active){
          $cards = $('.card-wrapper[style*="display: none"]').filter(function() {
            console.log('reveal lv2');
            return $(".active-chips", this).length;
            // return total_active;
          });
        }else{
          console.log('reveal');
          $cards = $('.card-wrapper[style*="display: none"]');
        }
      }else{
        console.log('hide');
        $chips.toggleClass("active");
        $chips.toggleClass("active-chips");
        $cards = $('.card-wrapper:not([style*="display: none"])').not(function() {
          return $("[data-tag="+tag+"]", this).length;
        });
      }
      $cards.fadeToggle("800", "jswing", function(){
        $container.masonry('layout').masonry();
      });
    });

    // Scroll Reveal
    window.sr = ScrollReveal();
    sr.reveal('.card');

    // Mobile button colapse
    function adjustIndex() {
      $('body').scrollTop(0);
      $("#sidenav-overlay").addClass("adjust-index");
    }

    $(".button-collapse").sideNav({
      menuWidth: 240, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });

    $('.button-collapse').click(function(){
      adjustIndex();
    });

    $('.slider').slider({interval: 20000});
    $('.carousel.carousel-slider').carousel({fullWidth: true});

    // Change sharing icon when menu is opened
    $(".click-to-toggle").click(function(){
      var icon = $(this).find(".btn-floating > i");
      if ($(this).hasClass('active')) {
          // icon.text("share");
      }else{
          // icon.text("clear");
      }
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space