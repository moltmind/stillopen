//mobile menu
jQuery(document).ready(function () {
    jQuery('.woocommerce .page-content ul.products li').addClass('col-md-4 col-sm-4 col-xs-12');
    jQuery('#menu').slicknav({
        label: jQuery("#txt_menu").val()
    });
});


//nivo slider
jQuery(function () {
    var val = jQuery("#txt_tf").val();
    if (val == 'false') {
        var direction = false;
    }
    jQuery('#slider').nivoSlider({
        directionNav: direction,
        effect: "random",
        pauseTime: parseInt(jQuery("#txt_name").val())
    });
});



// prettyphoto
jQuery(document).ready(function () {
    jQuery("area[rel^='prettyPhoto']").prettyPhoto();

    jQuery(".gallery:first a[rel^='prettyPhoto']").prettyPhoto({animation_speed: 'normal', theme: 'light_square', slideshow: 3000, autoplay_slideshow: false});
    jQuery(".gallery:gt(0) a[rel^='prettyPhoto']").prettyPhoto({animation_speed: 'fast', slideshow: 10000, hideflash: true});
});


// ie
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

