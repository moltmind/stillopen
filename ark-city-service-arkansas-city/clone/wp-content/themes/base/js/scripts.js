(function ($, root, undefined) {
		$(function () {
			$('#home-carousel').carousel({
		  interval: 5000
		});
		$('div.carousel-inner div:first-child').addClass('active');
		$('.equal').matchHeight();
	});
})(jQuery, this);
