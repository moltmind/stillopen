jQuery(document).ready(function ($) {

	$('.sp-testimonial-pro-wrapper.sp-tpro-thumbnail-slider').each(function () {
		var tpro_custom_thumbnail_id = $(this).attr('id'),
			tpro_thumbnail_data = $('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section').data('thumb_swiper'),
			tpro_navigation_icon = $('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section').data('arrowicon');
		var contentCarousel = $('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-content');
		var item = contentCarousel.find(".swiper-wrapper .swiper-slide").length,
			countTotalImg = $('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-thumb .swiper-slide .tpro-client-image').length;

		var $paginationType = tpro_thumbnail_data.pagination_type;
		// Carousel Pagination styles.
		var numberPagination = 'numbers' == $paginationType,
			paginationFraction = 'fraction' == $paginationType,
			dynamicBullets = 'dynamic' == $paginationType ? true : false,
			type = {};
		if (paginationFraction) {
			type = {
				type: 'fraction',
			}
		}

		var carousel_items = $('#' + tpro_custom_thumbnail_id).find('.sp-testimonial-pro-section-content  .swiper-slide:not(.swiper-slide-duplicate)').length;
		var dragScrollSize = (($('.sp-testimonial-pro-wrapper').width()) / carousel_items);

		if (tpro_custom_thumbnail_id != '' && !$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section').hasClass('swiper-initialized')) {
			var galleryThumbs = new Swiper('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-thumb', {
				speed: tpro_thumbnail_data.speed,
				slidesPerGroup: 1,
				centeredSlides: true,
				direction: tpro_thumbnail_data.thumbOrientation,
				centeredSlidesBounds: true,
				watchOverflow: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
				spaceBetween: 0,
				slideToClickedSlide: true,
				slidesPerView: tpro_thumbnail_data.slidesPerView.lg_desktop,
				loop: true,
				observer: true,
				loopedSlides: item,
				navigation: false,
				pagination: false,
				simulateTouch: tpro_thumbnail_data.draggable,
				allowTouchMove: tpro_thumbnail_data.swipe,
				mousewheel: tpro_thumbnail_data.swipeToSlide,
				breakpoints: {
					320: {
						slidesPerView: tpro_thumbnail_data.slidesPerView.mobile,

					},
					576: {
						slidesPerView: tpro_thumbnail_data.slidesPerView.tablet,

					},
					736: {
						slidesPerView: tpro_thumbnail_data.slidesPerView.laptop,

					},
					980: {
						slidesPerView: tpro_thumbnail_data.slidesPerView.desktop,

					},
					1200: {
						slidesPerView: tpro_thumbnail_data.slidesPerView.lg_desktop,
					},
				},
			});
			var galleryContent = new Swiper('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-content', {
				speed: tpro_thumbnail_data.speed,
				slidesPerView: 1,
				slidesPerGroup: 1,
				loop: true,
				loopedSlides: item,
				spaceBetween: 10,
				grabCursor: true,
				autoHeight: tpro_thumbnail_data.adaptiveHeight,
				effect: tpro_thumbnail_data.effect == true ? 'fade' : 'slide',
				pagination: {
					el: '#' + tpro_custom_thumbnail_id + ' .swiper-pagination',
					clickable: true,
					dynamicBullets: dynamicBullets,
					renderBullet: numberPagination ? function (index, className) {
						return '<span class="sp_testimonial-number-pagination ' + className + '">' + (index + 1) + "</span>";
					} : '',
					...type,
					renderFraction: paginationFraction ? function (currentClass, totalClass) {
						return '<div class="sp_testimonial-swiper-pagination-fraction"><span class="' + currentClass + '"></span>' +
							' / ' +
							'<span class="' + totalClass + '"></span></div>';
					} : '',
				},
				scrollbar: {
					el: '#' + tpro_custom_thumbnail_id + ' .sp_testimonial-pagination-scrollbar',
					draggable: true,
					dragSize: dragScrollSize
				},
				navigation:
					tpro_thumbnail_data.arrows == true
						? {
							nextEl: ".tpro-button-next",
							prevEl: ".tpro-button-prev",
						}
						: false,
				autoplay: {
					delay: tpro_thumbnail_data.autoplaySpeed
				},
				simulateTouch: tpro_thumbnail_data.draggable,
				allowTouchMove: tpro_thumbnail_data.swipe,
				mousewheel: tpro_thumbnail_data.swipeToSlide,
				fadeEffect: {
					crossFade: true,
				},
			});
			galleryContent.controller.control = galleryThumbs;
			galleryThumbs.controller.control = galleryContent;
			if (tpro_thumbnail_data.autoplay === false) {
				galleryThumbs.autoplay.stop()
				galleryContent.autoplay.stop()
			}
			if (tpro_thumbnail_data.pauseOnHover && tpro_thumbnail_data.autoplay) {
				$(contentCarousel).on({
					mouseenter: function () {
						galleryContent.autoplay.stop()
						galleryThumbs.autoplay.stop()
					},
					mouseleave: function () {
						galleryContent.autoplay.start()
						galleryThumbs.autoplay.start()
					}
				});
			}

			if ('vertical' === tpro_thumbnail_data.thumbOrientation) {
				var maxHeight = 0;
				$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-content').each(function () {
					if ($(this).height() > maxHeight) {
						maxHeight = $(this).innerHeight();
					}
				});
				// Set maximum height & width on thumbnail slider content area.
				$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-thumb').css('maxHeight', maxHeight);
				$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-content').css('maxHeight', maxHeight);

				var setTimeInterval = setInterval(setThumbnailHeight, 2);
				function setThumbnailHeight() {
					var imgsMaxHeight = 0;
					$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section-thumb .sp-testimonial-pro-item').each(function () {
						if ($(this).height() > imgsMaxHeight) {
							imgsMaxHeight = $(this).innerHeight();
						}
					});
		
					if ($('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-section').hasClass('swiper-initialized')) {
						$('#' + tpro_custom_thumbnail_id + ' .sp-testimonial-pro-item img, .sp-testimonial-text-avatar').css({
							'height': imgsMaxHeight - 10,
							'width': imgsMaxHeight - 10,
							'font-size': imgsMaxHeight - 10 + 'px',
						});
						clearInterval(setTimeInterval);
					}
				}
			}
		}
	});
});
