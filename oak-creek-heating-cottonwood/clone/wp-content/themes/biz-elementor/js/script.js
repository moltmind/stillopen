(function($) {
	/*Waypoint JS*/
	$(document).ready(function () {
		if (typeof jQuery().waypoint == 'function') { 
			var target = $("#head-point");
			var header = $('#header-fixed');
			target.waypoint(function(direction) {
				if (direction === 'down') {
					header.addClass("show");
				}
				else {
					header.removeClass("show");
				}
			});
		}
	});
	//Scroll to Anchors
	$(document).ready(function() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            var target = this.hash;
            var $target = $(target);
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - 100
            }, 900, 'swing');
        })
        $(function() {
            if (window.location.hash.substr(1)) {
                $('html, body').animate({
                    scrollTop: $("#" + window.location.hash.substr(1)).offset().top - 100
                }, 900, 'swing');
                return false;
            }
        });
    });
})( jQuery );