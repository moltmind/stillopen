	// OWL SLIDER CUSTOM JS

	jQuery(document).ready(function() {	
				
         /* ---------------------------------------------- /*
         * Header Sticky
         /* ---------------------------------------------- */
        
        jQuery(window).scroll(function(){
            if (jQuery(window).scrollTop() >= 100) {
                jQuery('.header-sticky').addClass('header-fixed-top');
				jQuery('.header-sticky').removeClass('not-sticky');
				jQuery('.navbar-collapse').removeClass('show');
            }
            else {
                jQuery('.header-sticky').removeClass('header-fixed-top');
				jQuery('.header-sticky').addClass('not-sticky');
            }
        });
		
		
		/* ---------------------------------------------- /*
         * Scroll top
         /* ---------------------------------------------- */

        jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > 100) {
                jQuery('.page-scroll-up').fadeIn();
            } else {
                jQuery('.page-scroll-up').fadeOut();
            }
        });

        jQuery('a[href="#totop"]').click(function() {
            jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
            return false;
        });
		
	
		// Accodian Js
		function toggleIcon(e) {
			jQuery(e.target)
			.prev('.panel-heading')
			.find(".more-less")
			.toggleClass('fa-plus-square-o fa-minus-square-o');
		}
		jQuery('.panel-group').on('hidden.bs.collapse', toggleIcon);
		jQuery('.panel-group').on('shown.bs.collapse', toggleIcon);
		
		
		//Search Popup Box
		
		jQuery(function () {
			jQuery('a[href="#search-popup"]').on('click', function(event) {
				event.preventDefault();
				jQuery('#search-popup').addClass('open');
				jQuery('#search-popup > form > input[type="search-popup"]').focus();
			});
			
			jQuery('#search-popup, #search-popup button.close').on('click keyup', function(event) {
				if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
					jQuery(this).removeClass('open');
				}
			});
		});
		
		
		jQuery("#theme-main-slider").owlCarousel({
			navigation : true, // Show next and prev buttons
			slideSpeed : 300,
			animateIn: custom_data.arilewp_main_slider_aniamte_in,
			animateOut: custom_data.arilewp_main_slider_aniamte_out,
			autoplay : 7000,
			smartSpeed: custom_data.arilewp_main_slider_smart_speed,
			autoplayTimeout: custom_data.arilewp_main_slider_scroll_speed,
			autoplayHoverPause:true,
			singleItem:true,
			mouseDrag: custom_data.arilewp_main_slider_mouse_drag_disabled,
			touchDrag: custom_data.arilewp_main_slider_mouse_drag_disabled,
			loop:true, // loop is true up to 1199px screen.
			nav:true, // is true across all sizes
			margin:0, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			items: 1,
			dots: false,
			navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"]	
        });
		
		
		
		jQuery("#project-slider").owlCarousel({
			navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: custom_data.arilewp_project_scroll_speed,
			autoplayHoverPause: true,
			smartSpeed: custom_data.arilewp_project_smart_speed,
			mouseDrag: custom_data.arilewp_project_mouse_drag_disabled,
		
			loop:true, // loop is true up to 1199px screen.
			nav:true, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 3,
			dots: false,
			navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
			responsive:{ 	
				100:{ items:1 },
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:custom_data.arilewp_project_column_layout }			
			}
		});		
		
		jQuery("#testimonial-slider").owlCarousel({
			//navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: custom_data.arilewp_testimonial_scroll_speed,
			autoplayHoverPause: true,
			smartSpeed: custom_data.arilewp_testimonial_smart_speed,   
			mouseDrag: custom_data.arilewp_testimonial_mouse_drag_disabled,

			loop:true, // loop is true up to 1199px screen.
			nav:false, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 1,
			dots: true,
			navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
			
			responsive:{ 
				100:{ items:1 },	
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:custom_data.arilewp_testimonial_column_layout }				
				
			}
		});
		
		jQuery("#team-slider").owlCarousel({
			navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: custom_data.arilewp_team_scroll_speed,
			autoplayHoverPause: true,
			smartSpeed: custom_data.arilewp_team_smart_speed,
            mouseDrag: custom_data.arilewp_team_mouse_drag_disabled,			
		
			loop:true, // loop is true up to 1199px screen.
			nav:false, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 5,
			dots: true,
			navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
			responsive:{
				100:{ items:1 },
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:custom_data.arilewp_team_column_layout }
			}
		});	
				
		jQuery("#product-slider").owlCarousel({
			navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: custom_data.arilewp_wooshop_scroll_speed,
			autoplayHoverPause: true,
			smartSpeed: custom_data.arilewp_wooshop_smart_speed,
			mouseDrag: custom_data.arilewp_wooshop_mouse_drag_disabled,
		
			loop:true, // loop is true up to 1199px screen.
			nav:false, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 3,
			dots: true,
			navText: ["<i class='fa fa-arrow-left'></i>","<i class='fa fa-arrow-right'></i>"],
			responsive:{ 	
				100:{ items:1 },
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:custom_data.arilewp_wooshop_column_layout }			
			}
		});	
		
		jQuery("#sponsors-slider").owlCarousel({
			navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: custom_data.arilewp_client_scroll_speed,
			autoplayHoverPause: true,
			smartSpeed: custom_data.arilewp_client_smart_speed,
			mouseDrag: custom_data.arilewp_client_mouse_drag_disabled,
		
			loop:true, // loop is true up to 1199px screen.
			nav:true, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 3,
			dots: false,
			navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
			responsive:{ 	
				100:{ items:1 },
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:custom_data.arilewp_client1_column_layout }			
			}
		});
				
				
		jQuery("#related-posts-slider").owlCarousel({
			navigation : true, // Show next and prev buttons		
			autoplay: true,
			autoplayTimeout: 1500,
			autoplayHoverPause: true,
			smartSpeed: 1300,
		
			loop:true, // loop is true up to 1199px screen.
			nav:true, // is true across all sizes
			margin:30, // margin 10px till 960 breakpoint
			autoHeight: true,
			responsiveClass:true, // Optional helper class. Add 'owl-reponsive-' + 'breakpoint' class to main element.
			//items: 3,
			dots: false,
			navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
			responsive:{ 	
				100:{ items:1 },
				480:{ items:1 },
				768:{ items:2 },
				1000:{ items:2 }			
			}
		});
				
		
		 
	});
	