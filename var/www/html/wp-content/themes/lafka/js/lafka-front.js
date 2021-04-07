(function ($) {
	"use strict";
    var lafka_ajaxXHR = null;
    var is_mailto_or_tel_link = false;
    var is_rtl = false;
    if (lafka_main_js_params.is_rtl === 'true') {
        is_rtl = true;
    }

    	/* If preloader is enabled */
	if (lafka_main_js_params.show_preloader) {
		$(window).load(function () {
			$("#loader").delay(100).fadeOut();
			$(".mask").delay(300).fadeOut();
		});

	}
	$(window).load(function () {
		checkRevealFooter();
        checkProductGalleryCarousel();
        defineMegaMenuSizing();
	});

	$(document).ready(function () {

		//
		// -------------------------------------------------------------------------------------------------------
		// Dropdown Menu
		// -------------------------------------------------------------------------------------------------------

		$('.box-sort-filter .woocommerce-ordering .limit select, .box-sort-filter .woocommerce-ordering .sort select, .widget_archive select, .widget_categories select').niceSelect();

		/*
		 * Special Characters
		 */

		$('h1,h2,h3,h4,h5,h6').each(function() {
			$(this).html(
				$(this).html()
					.replace(/&nbsp;/gi,'')
			);
        });

        if (lafka_main_js_params.categories_fancy === 'yes') {
            $("div.product-category.product h2").html(function () {
                $(this).addClass('lafka-has-fancy');
            });
        }

        if (lafka_main_js_params.order_hours_cart_update === 'yes') {
            $( document.body ).trigger( 'updated_wc_div' );
        }

        $(document.body).on('added_to_cart updated_checkout', function() {
            lafkaInitSmallCountdowns($( this ).find('div.lafka-closed-store-message'));
        });

        // Order hours counter to the next opening
        lafkaInitSmallCountdowns($( document.body ).find('div.lafka-closed-store-message'));

        $('.woocommerce-review-link').on('click', function (event) {
            $('#tab-reviews').trigger('click');
            $('html, body').animate({
                scrollTop: $(".woocommerce-tabs").offset().top - 105
            }, 1200, 'swing');
        });

        $('div.content_holder.lafka_blog_masonry div.box.box-common:has(.pagination)').parent().addClass('lafka-blog-has-pagination');
        
		/*
		 * Remove resposive images functionality for CloudZoom galleries
		*/
		$('#wrap a.cloud-zoom img, .lafka-product-summary-wrapper.lafka-has-product-cover-image > img').removeAttr('srcset');
		$("div.summary.entry-summary table.variations td:has(div.lafka-wcs-swatches) ").addClass("lafka-has-swatches-option");
		$("ul#topnav li:has(ul), ul#topnav2 li:has(ul), ul.menu li:has(ul) ").addClass("dropdown");
        $("ul.menu li:has(div)").addClass("has-mega");
        $('#main-menu li ul.sub-menu li:has(.lafka-custom-menu-label)').addClass('has-menu-label');


        $("div.vc_row:has(.lafka-fullheight-content-slider) ").addClass("lafka-row-has-full-slider");


		/*
		 * Manipulate the cart
		 */

		$('#header #cart-module div.widget.woocommerce.widget_shopping_cart').prependTo('body');
		$('body > div.widget.woocommerce.widget_shopping_cart').prepend('<span class="close-cart-button"></span>');
		$('body > #search').prepend('<span class="close-search-button"></span>');

		/* REMOVE PARENTHESIS ON WOO CATEGORIES */

			$('.count').text(function(_, text) {
				return text.replace(/\(|\)/g, '');
			});

		/**
		 * Sticky header (if on)
		 */
		if ((lafka_main_js_params.sticky_header) && ($('#container').has('#header').length)) {
            lafkaStickyHeaderInit();
		}

        $("#header #lafka-account-holder > a").on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $("#lafka-account-holder, .lafka-header-account-link-holder").toggleClass("active");
        });

        checkSummaryHeight();
        checkCommentsHeight();
        checkFoodmenuHeight();
        defineCartIconClickBehaviour();

		var customTitleHeight = $('body.lafka_transparent_header #header').height();
		$('body.lafka_transparent_header .lafka_title_holder .inner').css({"padding-top" : customTitleHeight + 280, "padding-bottom" : customTitleHeight + 20});

		$('#header .lafka-search-trigger a, .close-search-button').on('click', function (event) {
			event.stopPropagation();
			$("body > #search").toggleClass("active");
            $("body > #search #s").focus();
		});

		$('#main-menu .lafka-mega-menu').css("display", "");

        $('p.demo_store').prependTo('#header');

        var $accountMenuSliderElement = $('body.woocommerce-account .content_holder #customer_login.col2-set, .content_holder .woocommerce #customer_login.u-columns.col2-set, .lafka-header-account-link-holder .woocommerce #customer_login.u-columns.col2-set, #lafka_mobile_account_tab .woocommerce #customer_login.u-columns.col2-set');
        if($accountMenuSliderElement.length) {
            $accountMenuSliderElement.addClass('owl-carousel');
            $accountMenuSliderElement.owlCarousel({
                rtl: is_rtl,
                items: 1,
                dots: false,
                mouseDrag: false,
                nav: true,
                navText: [
                    lafka_main_js_params.login_label,
                    lafka_main_js_params.register_label
                ]
            });
        }

		//
		// -------------------------------------------------------------------------------------------------------
		// Mobile Menu
		// -------------------------------------------------------------------------------------------------------
		$(".mob-menu-toggle, .mob-close-toggle, ul#mobile-menu.menu li:not(.menu-item-has-children) a").on('click', function (event) {
			event.stopPropagation();
			$("#menu_mobile").toggleClass("active");
		});
        $("ul#mobile-menu.menu .menu-item a").each(function() {
            if( $(this).html() == "–"){
                $(this).remove();
            }
        });

        $("ul#mobile-menu.menu > li.menu-item-has-children:not(.current-menu-item) > a").prepend('<span class="drop-mob">+</span>');
        $("ul#mobile-menu.menu > li.menu-item-has-children.current-menu-item > a").prepend('<span class="drop-mob">-</span>');
        $("ul#mobile-menu.menu > li.menu-item-has-children > a .drop-mob").on('click', function (event) {
            event.preventDefault();
            $(this).closest('li').find('ul.sub-menu').toggleClass("active");

            var $activeSubmenus = $(this).closest('li').find('ul.sub-menu.active');

            if($activeSubmenus.length) {
                $(this).html("-");
            } else if(!$(this).closest('li').hasClass('current-menu-item')) {
                $(this).html("+");
            }
        });
		$(document).on('click', function(e){
			if (!$(e.target).closest('.widget_shopping_cart').hasClass('active_cart')) {
				$("body > div.widget.woocommerce.widget_shopping_cart").removeClass("active_cart");
			}
			if (!$(e.target).closest('#menu_mobile').hasClass('active')) {
				$("#menu_mobile").removeClass("active");
			}
			if (!$(e.target).closest('#search').hasClass('active')) {
				$("#search.active").removeClass("active");
			}
			if (!$(e.target).closest('.off-canvas-sidebar').hasClass('active_sidebar')) {
				$(".sidebar.off-canvas-sidebar").removeClass("active_sidebar");
			}
            if (!$(e.target).closest('.lafka-header-account-link-holder').hasClass('active')) {
                $("body, .lafka-header-account-link-holder").removeClass("active");
            }
		});

		$(".video_controlls a#video-volume").on('click', function () {
			$(".video_controlls a#video-volume").toggleClass("disabled");
		});

		$(document.body).find('a[href="#"], a.cloud-zoom').on('click', function (event) {
			event.preventDefault();
		});

		$('a[href$=".mov"] , a[href$=".swf"], a[href$=".mp4"], a[href*="vimeo.com/"], a[href*="youtube.com/watch"]').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade is-lafka-video',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		});

		$(".prod_hold a.add_to_wishlist").attr("title", "Add to wishlist");

		// -------------------------------------------------------------------------------------------------------
		// SLIDING ELEMENTS
		// -------------------------------------------------------------------------------------------------------

		$('a#toggle_switch').toggle(function () {
			if ($(this).hasClass("swap")) {
				$(this).removeClass("swap");
            } else {
				$(this).addClass("swap");
			}
			$('#togglerone').slideToggle("slow");

			return false;
		}, function () {
			$('#togglerone').slideToggle("slow");

			if ($(this).hasClass("swap")) {
				$(this).removeClass("swap");
			} else {
				$(this).addClass("swap");
			}
			return false;
		});

		if (!document.getElementById("lafka_page_title")) {
			$(document.body).addClass('page-no-title');
		} else {
			$(document.body).addClass('page-has-title');
		}

		$('.sidebar-trigger').prependTo('#header .lafka-search-cart-holder');
		if  ($('div#lafka_page_title .inner').has('div.breadcrumb').length) {
			$('.video_controlls').appendTo('div.breadcrumb');
		} else {
			$('.video_controlls').prependTo('#header .lafka-search-cart-holder');
		}


		$('.sidebar-trigger, .close-off-canvas').on('click', function (event) {
			event.stopPropagation();
			$(".off-canvas-sidebar").toggleClass("active_sidebar");
		});

        $(document.body).on('click', 'a.lafka-filter-widgets-triger', function () {
            $("#lafka-filter-widgets").toggleClass("lafka_active_filter_area");
        });

        $('a.lafka-filter-widgets-triger').toggle(function () {
            $('#lafka-filter-widgets').slideToggle("slow");

            return false;
        }, function () {
            $('#lafka-filter-widgets').slideToggle("slow");
            return false;
        });

		$(".pull-item.left, .pull-item.right").hover(function () {
			$(this).addClass('active');
		}, function () {
			$(this).removeClass('active');
		});

		$('html.no-touch .lafka-from-bottom').each(function () {
			$(this).appear(function () {
				$(this).delay(300).animate({opacity: 1, bottom: "0px"}, 500);
			});
		});

		$('html.no-touch .lafka-from-left').each(function () {
			$(this).appear(function () {
				$(this).delay(300).animate({opacity: 1, left: "0px"}, 500);
			});
		});

		$('html.no-touch .lafka-from-right').each(function () {
			$(this).appear(function () {
				$(this).delay(300).animate({opacity: 1, right: "0px"}, 500);
			});
		});

		$('html.no-touch .lafka-fade').each(function () {
			$(this).appear(function () {
				$(this).delay(300).animate({opacity: 1}, 700);
			});
		});

		$('html.no-touch div.prod_hold, html.no-touch .wpb_lafka_banner:not(.lafka-from-bottom), html.no-touch .wpb_lafka_banner:not(.lafka-from-left), html.no-touch .wpb_lafka_banner:not(.lafka-from-right), html.no-touch .wpb_lafka_banner:not(.lafka-fade)').each(function () {
			$(this).appear(function () {
				$(this).addClass('prod_visible').delay(2000);
			});
		});

		$('.lafka-counter:not(.already_seen)').each(function () {
			$(this).appear(function () {

				$(this).prop('Counter', 0).animate({
					Counter: $(this).text()
				}, {
					duration: 3000,
					decimals: 2,
					easing: 'swing',
					step: function (now) {
						$(this).text(Math.ceil(now).toLocaleString('en'));
					}
				});
				$(this).addClass('already_seen');

			});
		});

		// -------------------------------------------------------------------------------------------------------
		// FADING ELEMENTS
		// -------------------------------------------------------------------------------------------------------

        $.lafka_widget_columns();

		// Number of products to show in category
		// per_page and auto load
		$('select.per_page').change(function () {
			$('.woocommerce-ordering').trigger("submit");
		});

		function addQty() {
			var input = $(this).parent().find('input[type=number]');

			if (isNaN(input.val())) {
				input.val(0);
			}
			input.val(parseInt(input.val()) + 1);
		}

		function subtractQty() {
			var input = $(this).parent().find('input[type=number]');
			if (isNaN(input.val())) {
				input.val(1);
			}
			if (input.val() > 1) {
				input.val(parseInt(input.val()) - 1);
			}
		}

		$(".lafka-qty-plus").on('click', addQty);
		$(".lafka-qty-minus").on('click', subtractQty);

		if ($('#cart-module').length !== 0) {
			track_ajax_add_to_cart();
			$(document.body).bind('added_to_cart', update_cart_dropdown);
		}

		$(".lafka-latest-grid.lafka-latest-blog-col-3 div.post:nth-child(3n)").after("<div class='clear'></div>");
		$(".lafka-latest-grid.lafka-latest-blog-col-2 div.post:nth-child(2n)").after("<div class='clear'></div>");
		$(".lafka-latest-grid.lafka-latest-blog-col-4 div.post:nth-child(4n)").after("<div class='clear'></div>");
		$(".lafka-latest-grid.lafka-latest-blog-col-5 div.post:nth-child(5n)").after("<div class='clear'></div>");
		$(".lafka-latest-grid.lafka-latest-blog-col-6 div.post:nth-child(6n)").after("<div class='clear'></div>");

		// HIDE EMPTY COMMENTS DIV
		$('div#comments').each(function () {
			if ($(this).children().length === 0) {
				$(this).hide();
			}
		});

		// Smooth scroll
		var scrollDuration = 0;
		if (lafka_main_js_params.enable_smooth_scroll) {
			scrollDuration = 1500;
		}

		$("li.menu-item a[href*='#']:not([href='#']), .wpb_text_column a[href*='#']:not([href='#']), a.vc_btn3[href*='#']:not([href='#']), .vc_icon_element a[href*='#']:not([href='#'])").on('click', function () {
			if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top - 75
					}, scrollDuration, 'swing');
				}
				return false;
			}
        });
        
        /**
		 * This part handles the menu highlighting functionality.
		 * When using anchors
		 */
		var aChildren = $("li.menu-item a[href*='#']:not([href='#'])"); // find the a children of the list items
		var aArray = []; // create the empty aArray
		for (var i = 0; i < aChildren.length; i++) {
			var aChild = aChildren[i];
			var ahref = $(aChild).attr('href');
			aArray.push(ahref);
		} // this for loop fills the aArray with attribute href values

		$(window).scroll(function () {
			var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
			var windowHeight = $(window).height(); // get the height of the window
			var docHeight = $(document).height();

			for (var i = 0; i < aArray.length; i++) {
				var theID = aArray[i];
				if ((theID).length && undefined !== $(theID).offset()) {
					var divPos = $(theID).offset().top - 145; // get the offset of the div from the top of page
					var divHeight = $(theID).height(); // get the height of the div in question
					if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
						$("li.current-menu-item").removeClass("current-menu-item");
						$("li.menu-item a[href='" + theID + "']").parent().addClass("current-menu-item");
					}
				}
			}

			if (windowPos + windowHeight == docHeight) {
				if (!$("li.menu-item:last-child").hasClass("current-menu-item")) {
					var navActiveCurrent = $("li.current-menu-item a").attr("href");
					$("a[href='" + navActiveCurrent + "']").parent().removeClass("current-menu-item");
					$("li.menu-item:last-child a").addClass("current-menu-item");
				}
			}
		});

		// Add to cart Ajax if enable_ajax_add_to_cart is set in the WooCommerce settings and product is simple or variable
        if (lafka_main_js_params.enable_ajax_add_to_cart === 'yes') {
            $(document).on('click', '.single_add_to_cart_button', function (e) {

                    var $add_to_cart_form = $(this).closest('form.cart');

                    if ($add_to_cart_form.length) {
                        var is_variable = $add_to_cart_form.hasClass('variations_form');
                        var is_grouped = $add_to_cart_form.hasClass('grouped_form');
                        var is_external = $add_to_cart_form.attr('method') === 'get';
                    } else {
                        return true;
                    }

                    if (!is_grouped && !is_external) {

                        // perform the html5 validation
                        if ($add_to_cart_form[0].checkValidity()) {
                            e.preventDefault();
                        } else {
                            return true;
                        }

                        // If we've chosen unavailable variation don't execute
                        if (!$(this).is('.wc-variation-is-unavailable,.wc-variation-selection-needed')) {
                            var quantity = $add_to_cart_form.find('input[name="quantity"]').val();

                            var product_id;
                            if (is_variable) {
                                product_id = $add_to_cart_form.find('input[name="add-to-cart"]').val();
                            } else {
                                product_id = $add_to_cart_form.find('button[name="add-to-cart"]').val();
                            }

                            var data = {product_id: product_id, quantity: quantity, product_sku: ""};

                            // AJAX add to cart request.
                            var $thisbutton = $(this);

                            // Trigger event.
                            $(document.body).trigger('adding_to_cart', [$thisbutton, data]);

                            //AJAX call
                            $thisbutton.addClass('loading');
                            $thisbutton.prop('disabled', true);

                            var add_to_cart_ajax_data = {};
                            add_to_cart_ajax_data.action = 'lafka_wc_add_cart';

                            if( product_id ) {
                                add_to_cart_ajax_data["add-to-cart"] = product_id;
                            }

                            $.ajax({
                                url: lafka_main_js_params.admin_url,
                                type: 'POST',
                                data: $add_to_cart_form.serialize() + "&" + $.param(add_to_cart_ajax_data),

                                success: function (results) {
                                    // Redirect to cart option
                                    if (lafka_main_js_params.cart_redirect_after_add === 'yes') {
                                        window.location = lafka_main_js_params.cart_url;
                                    } else {
                                        if ("error_message" in results) {
                                            alert(results.error_message);
                                        } else {
                                            // Trigger event so themes can refresh other areas
                                            $(document.body).trigger('added_to_cart', [results.fragments, results.cart_hash, $thisbutton]);
                                        }
                                    }
                                },
                                complete: function (jqXHR, status) {
                                    $thisbutton.removeClass('loading');
                                    $thisbutton.prop('disabled', false);
                                }
                            });
                        }
                    } else {
                        return true;
                    }
                }
            );
        }

        // Initialise the small countdowns on products list
        lafkaInitSmallCountdowns($('div.prod_hold'));

        // if is set infinite load on shop - run it de..
        if(lafka_main_js_params.enable_infinite_on_shop === 'yes') {
        	// hide the pagination
            var $pagination = $('#products-wrapper').find('div.pagination');
            $pagination.hide();

            // If enabled load more button
			if(lafka_main_js_params.use_load_more_on_shop === 'yes') {
                $(document.body).on('click', 'div.lafka-shop-pager.lafka-infinite button.lafka-load-more', function (e) {
                	$(this).hide();
                    $(document.body).find('div.lafka-shop-pager.lafka-infinite a.next_page').trigger( "click" );
                });
			} else {
                // Track scrolling, hunting for infinite ajax load
                $(window).on("scroll", function () {
                    if ($(document.body).find('div.lafka-shop-pager.lafka-infinite').is(':in-viewport')) {
                        $(document.body).find('div.lafka-shop-pager.lafka-infinite a.next_page').trigger( "click" );
                    }
                });
            }

            // Shop Page
            $(document.body).on('click', 'div.lafka-shop-pager.lafka-infinite a.next_page', function (e) {
                e.preventDefault();

                if ($(this).data('requestRunning')) {
                    return;
                }

                $(this).data('requestRunning', true);

                var $products = $('#products-wrapper').find('div.box-products.woocommerce');
                var $pageStatus = $pagination.prevAll('.lafka-page-load-status');

                $pageStatus.children('.infinite-scroll-last').hide();
                $pageStatus.children('.infinite-scroll-request').show();
                $pageStatus.show();

                $.get(
                    $(this).attr('href'),
                    function (response) {

                        $.lafka_refresh_products_after_ajax(response, $products, $pagination, $pageStatus);

                        $(document.body).trigger('lafka_shop_ajax_loading_success');
                    }
                );
            });
        }

        if(typeof lafka_foodmenu_js_params !== 'undefined') {

            var $container = $('div.foodmenus', '#main');

            var $isotopedGrid = $container.isotope({
                itemSelector: 'div.foodmenu-unit',
                layoutMode: 'masonry',
                transitionDuration: '0.5s'
            });

            // layout Isotope after each image loads
            $isotopedGrid.imagesLoaded().progress(function () {
                $isotopedGrid.isotope('layout');
            });

            // bind filter button click
            $('.lafka-foodmenu-categories').on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                // use filterFn if matches value
                $isotopedGrid.isotope({filter: filterValue});
            });

            // change is-checked class on buttons
            $('div.lafka-foodmenu-categories', '#main').each(function (i, buttonGroup) {
                var $buttonGroup = $(buttonGroup);
                $buttonGroup.on('click', 'a', function () {
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });
            });
        }

        // AJAXIFY products listing filters, widgets, etc
        if(lafka_main_js_params.use_product_filter_ajax === 'yes') {
            // products ordering and per page
            var woocommerceOrderingForm = $(document.body).find('form.woocommerce-ordering');
            if (woocommerceOrderingForm.length) {
                woocommerceOrderingForm.on('submit', function (e) {
                    e.preventDefault();
                });

                $(document.body).on('change', 'form.woocommerce-ordering select.orderby, form.woocommerce-ordering select.per_page', function (e) {
                    e.preventDefault();

                    var currentUrlParams = window.location.search;
                    var url = window.location.href.replace(window.location.search, '') + lafkaUpdateUrlParameters(currentUrlParams, woocommerceOrderingForm.serialize());

                    $(document.body).trigger('lafka_products_filter_ajax', [url, woocommerceOrderingForm]);
                });
            }

            // price slider
            $(document.body).find('#lafka-price-filter-form').on('submit', function (e) {
                e.preventDefault();
            });

            $(document.body).on('price_slider_change', function (event, ui) {
                var form = $('.price_slider').closest('form').get(0);
                var $form = $(form);

                var currentUrlParams = window.location.search;
                var url = $form.attr('action') + lafkaUpdateUrlParameters(currentUrlParams, $form.serialize());

                $(document.body).trigger('lafka_products_filter_ajax', [url, $(this)]);
            });

            // lafka_product_filter
            $(document.body).on('click', 'div.lafka_product_filter a', function (e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(document.body).trigger('lafka_products_filter_ajax', [url, $(this)]);
            });

            // reset all filters
            $(document.body).on('click', 'a.lafka-reset-filters', function (e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(document.body).trigger('lafka_products_filter_ajax', [url, $(this)]);
            });
        }

        // Set flag when mailto: and tel: links are clicked
		$(document.body).on('click', 'div.widget_lafka_contacts_widget a, div.lafka-top-bar-message a', function (e){
            is_mailto_or_tel_link = true;
		});

        // Share links
		$(document.body).on('click', 'div.lafka-share-links a', function(e){
            window.open(this.href,'targetWindow','toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=300');
            return false;
		});

        /*
		 * Listen for added_to_wishlist to increase number in header
		 */
        $(document.body).on("added_to_wishlist", function () {
            var wishNumberSpan = $("span.lafka-wish-number");
            if (wishNumberSpan.length) {
                var wishNum = parseInt(wishNumberSpan.html(), 10);
                if (!isNaN(wishNum)) {
                    wishNumberSpan.html(wishNum + 1);
                }
            }
        });

        /*
         * Listen for removed_from_wishlist to decrease number in header
         */
        $(document.body).on("removed_from_wishlist", function () {
            var wishNumberSpan = $("span.lafka-wish-number");
            if (wishNumberSpan.length) {
                var wishNum = parseInt(wishNumberSpan.html(), 10);
                if (!isNaN(wishNum) && wishNum > 0) {
                    wishNumberSpan.html(wishNum - 1);
                }
            }
        });

        // Show reset button if there are active filters
        $.lafka_handle_active_filters_reset_button();

        // Build mobile menu tabs
        $(document.body).find('div#menu_mobile').tabs({
            beforeActivate: function( event, ui ) {
                if(!$.isEmptyObject(ui.newTab)) {
                    var $link = ui.newTab.find('a');
                    // If is wishlist link - do not open tab, instead redirect
                    if($link.length && $link.hasClass('lafka-mobile-wishlist')) {
                        window.location.href = $link.attr('href');
                        return false;
                    }
                }
            }
        });

        // Handle unavailable variations swatches on single product
        $(document.body).find(".variations_form").on("woocommerce_update_variation_values", function () {
            var $swatches = $('.lafka-wcs-swatches');
            $swatches.find('.swatch').removeClass('lafka-not-available');
            $swatches.each(function () {
                var $select = $(this).prev().find('select');
                $(this).find('.swatch').each(function () {
                    if (!($select.find('option[value="' + $(this).attr('data-value') + '"]').length > 0)) {
                        $(this).addClass('lafka-not-available');
                    }
                })
            })
        });

        // Add column classes to mega menu
        defineMegaMenuColumns();

        // Full-width elements
        lafka_fullwidth_elements();

        // End of document.ready()
	});

	// Handle the products filtering
    $(document.body).on('lafka_products_filter_ajax', function (e, url, element) {

        var $products_wrapper = $('#products-wrapper');
        var $products = $products_wrapper.find('div.box-products.woocommerce');
        var $pagination = $products_wrapper.find('div.pagination');
        var $pageStatus = $pagination.prevAll('.lafka-page-load-status');

        $.lafka_show_loader();

        if ('?' === url.slice(-1)) {
            url = url.slice(0, -1);
        }

        url = url.replace(/%2C/g, ',');
        window.history.pushState({page: url}, "", url);

        if (lafka_ajaxXHR) {
            lafka_ajaxXHR.abort();
        }

        lafka_ajaxXHR = $.get(url, function (res) {

        	// Empty the products container
            $products.empty();

            $.lafka_refresh_product_filters_areas(res);
            $.lafka_refresh_products_after_ajax(res, $products, $pagination, $pageStatus);

            $.lafka_hide_loader();
            $(document.body).trigger('lafka_products_filter_ajax_success', [res, url]);
        }, 'html');

    });

    window.onresize = function () {
        checkRevealFooter();
        checkProductGalleryCarousel();
        checkSummaryHeight();
        checkCommentsHeight();
        checkFoodmenuHeight();
        lafka_fullwidth_elements();
        defineMegaMenuSizing();
    };

    /**
     * Initialise the small countdowns on products list
     * @param prodHoldElements
     */
    window.lafkaInitSmallCountdowns = function (prodHoldElements) {
        $(prodHoldElements).each(function () {
                var data = $(this).find('.count_holder_small').data();
                if (typeof data !== 'undefined') {
                    var timeFormat = '{dn} {dl} {hn}:{mnn}:{snn}';
                    if(typeof data.countdownShowDays !== 'undefined' && data.countdownShowDays === 'no') {
                        timeFormat = '{hn}:{mnn}:{snn}';
                    }
                    $(data.countdownId).countdown({
                        until: new Date(data.countdownTo),
                        compact: false,
                        layout: '<span class="countdown_time_tiny">'+timeFormat+'</span>'
                    });
                }
            }
        )
    };

    /**
     * Initialize the sticky header
     */
    window.lafkaStickyHeaderInit = function () {
        var headerHeight = $('body:not(.lafka_transparent_header) #header').height();
        $("body").addClass("lafka-sticky-header").css("padding-top", headerHeight + "px");
        $(window).on("scroll", function () {
            var $header = $("#header");
            $(this).scrollTop() > 0 ? $header.addClass("lafka-sticksy") : $header.removeClass("lafka-sticksy");
        });
    };

    /* Mega Menu */

    function defineMegaMenuColumns(){
        $('#main-menu .lafka-mega-menu').each(function () {
            var menuColumns = $(this).find('li.lafka_colum_title').length;
            $(this).addClass('menu-columns' + menuColumns);
        });
    }

    function defineMegaMenuSizing() {
        var $menuElement = $('#main-menu');

            var $menuHolderElement = $('#header .menu-main-menu-container');
            var menuOffset = $menuHolderElement.offset();

            $menuElement.find('.lafka-mega-menu').each(function () {
                $(this).css('max-width', $menuHolderElement.outerWidth() + 'px');
                var dropdown = $(this).parent().offset();
                var i = (dropdown.left + $(this).outerWidth()) - (menuOffset.left + $menuHolderElement.outerWidth());
                if (i > 0) {
                    $(this).css('margin-left', '-' + (i) + 'px');
                }
            });

        $menuElement.find('li.lafka_colum_title > .sub-menu').each(function () {
            if ($(this).children("li").length == $(this).children("li.lafka_mega_text_block").length) {
                $(this).parent().addClass("lafka_mega_text_block_parent");
            }
        });
    }

    /**
	 * Define behaviour for click on shopping cart icon
     */
    function defineCartIconClickBehaviour() {
        $(document).on("click", "body:not(.woocommerce-checkout) #lafka_quick_cart_link", function(event) {
            event.preventDefault();
            event.stopPropagation();

            var shoppingCart = $(document.body).find("div.widget.woocommerce.widget_shopping_cart");

            // Order hours counter to the next opening
            lafkaInitSmallCountdowns($( document.body ).find('div.lafka-closed-store-message'));

            shoppingCart.addClass("active_cart");
            $(document.body).find('div.widget.woocommerce.widget_shopping_cart .widget_shopping_cart_content ul.cart_list.product_list_widget').niceScroll({horizrailenabled:false});

        });

        $(document).on("click", ".close-cart-button", function(event) {
            var $parent = $(this).parent();
            $parent.removeClass('active_cart');
        });
    }

	function checkRevealFooter() {
		var isReveal = $('#footer').height() - 1;
		if (isReveal < 550 && $(document.body).hasClass("lafka_fullwidth")) {
			$('html.no-touch body.lafka_fullwidth.lafka-reveal-footer #content').css("margin-bottom", isReveal + "px");
			$('body.lafka_fullwidth.lafka-reveal-footer #footer').addClass('lafka_do_reveal');
		} else {
			$('html.no-touch body.lafka_fullwidth.lafka-reveal-footer #content').css("margin-bottom", 0 + "px");
			$('body.lafka_fullwidth.lafka-reveal-footer #footer').removeClass('lafka_do_reveal');

		}
	}

	function checkProductGalleryCarousel() {
        var current_window_width = $(window).width();
        var $singleProductImages = $(document.body).find('div.lafka-single-product .lafka-image-list-product-gallery .woocommerce-product-gallery__wrapper, .lafka_image_list_foodmenu .lafka_image_list');

        if(current_window_width < 769 && $singleProductImages.length) {
                $singleProductImages.addClass('owl-carousel');
                $singleProductImages.owlCarousel({
                    rtl: is_rtl,
                    items: 1,
                    dots: false,
                    loop: false,
                    rewind: true,
                    nav: true,
                    navText: [
                        "<i class='fa fa-angle-left'></i>",
                        "<i class='fa fa-angle-right'></i>"
                    ]
                });
        } else if($singleProductImages.length) {
            $singleProductImages.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
            $singleProductImages.find('.owl-stage-outer').children().unwrap();
        }
    }

    function checkSummaryHeight() {
        var $lafkaSummaryHeight = $('.lafka-product-summary-wrapper div.summary').height();
        var $lafkaVisibleHeight = $(window).height();
        var current_window_width = $(window).width();
        var $body_summary = $("body, .lafka-product-summary-wrapper div.summary");
        if ($lafkaSummaryHeight < $lafkaVisibleHeight - 250 && current_window_width > 768) {
            $body_summary.addClass("lafka-sticky-summary");
        } else {
            $body_summary.removeClass("lafka-sticky-summary");
        }
    }

    function checkCommentsHeight() {
        var $lafkaCommentsHeight = $('body.single-post #comments > #respond.comment-respond').height();
        var $lafkaVisibleHeight = $(window).height();
        var $body_summary = $("body.single-post #comments > #respond.comment-respond");
        if ($lafkaCommentsHeight < $lafkaVisibleHeight - 200) {
            $body_summary.addClass("lafka-sticky-comments");
        } else {
            $body_summary.removeClass("lafka-sticky-comments");
        }
    }

    function checkFoodmenuHeight() {
        var $lafkaFoodmenuHeight = $('.foodmenu_top div.one_third.last.project-data').height();
        var $lafkaPortVisibleHeight = $(window).height();
        var current_window_width = $(window).width();
        var $body_PortSummary = $("body, .foodmenu_top div.one_third.last.project-data");
        if ($lafkaFoodmenuHeight < $lafkaPortVisibleHeight - 250 && current_window_width > 768) {
            $body_PortSummary.addClass("lafka-sticky-summary");
        } else {
            $body_PortSummary.removeClass("lafka-sticky-summary");
        }
    }

    /**
     * Override vc_rowBehaviour for stretch row
     */

    window.vc_rowBehaviour = function () {
        var vcSkrollrOptions, callSkrollInit, $ = window.jQuery;

        function fullWidthRow() {
            var $elements = $('[data-vc-full-width="true"]');
            $.each($elements, function(key, item) {
                var $el = $(this);
                $el.addClass("vc_hidden");
                var $el_full = $el.next(".vc_row-full-width");
                if ($el_full.length || ($el_full = $el.parent().next(".vc_row-full-width")), $el_full.length) {
                    var padding, paddingRight, el_margin_left = parseInt($el.css("margin-left"), 10),
                        el_margin_right = parseInt($el.css("margin-right"), 10),
                        // VC original code
                        // offset = 0 - $el_full.offset().left - el_margin_left,
                        // width = $(window).width();
                        // end VC original code

                        // Althemist edit
                        $content = $('#content'),
                        width = $content.width(),
                        row_padding = 40,
                        offset = -($content.width() - $content.find('.inner').css("width").replace("px", "")) / 2 - row_padding + 15;
                    // End Althemist edit

                    if ("rtl" === $el.css("direction") && (offset -= $el_full.width(), offset += width, offset += el_margin_left, offset += el_margin_right), $el.css({
                        position: "relative",
                        left: offset,
                        "box-sizing": "border-box",
                        width: width
                    }), !$el.data("vcStretchContent")) "rtl" === $el.css("direction") ? ((padding = offset) < 0 && (padding = 0), (paddingRight = offset) < 0 && (paddingRight = 0)) : ((padding = -1 * offset) < 0 && (padding = 0), (paddingRight = width - padding - $el_full.width() + el_margin_left + el_margin_right) < 0 && (paddingRight = 0)), $el.css({
                        "padding-left": padding + "px",
                        "padding-right": paddingRight + "px"
                    });
                    $el.attr("data-vc-full-width-init", "true"), $el.removeClass("vc_hidden"), $(document).trigger("vc-full-width-row-single", {
                        el: $el,
                        offset: offset,
                        marginLeft: el_margin_left,
                        marginRight: el_margin_right,
                        elFull: $el_full,
                        width: width
                    })
                }
            }), $(document).trigger("vc-full-width-row", $elements)
        }

        function fullHeightRow() {
            var windowHeight, offsetTop, fullHeight, $element = $(".vc_row-o-full-height:first");
            $element.length && (windowHeight = $(window).height(), (offsetTop = $element.offset().top) < windowHeight && (fullHeight = 100 - offsetTop / (windowHeight / 100), $element.css("min-height", fullHeight + "vh")));
            $(document).trigger("vc-full-height-row", $element)
        }
        $(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour", fullWidthRow).on("resize.vcRowBehaviour", fullHeightRow), fullWidthRow(), fullHeightRow(), (0 < window.navigator.userAgent.indexOf("MSIE ") || navigator.userAgent.match(/Trident.*rv\:11\./)) && $(".vc_row-o-full-height").each(function() {
            "flex" === $(this).css("display") && $(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')
        }), vc_initVideoBackgrounds(), callSkrollInit = !1, window.vcParallaxSkroll && window.vcParallaxSkroll.destroy(), $(".vc_parallax-inner").remove(), $("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"), $("[data-vc-parallax]").each(function() {
            var skrollrSize, skrollrStart, $parallaxElement, parallaxImage, youtubeId;
            callSkrollInit = !0, "on" === $(this).data("vcParallaxOFade") && $(this).children().attr("data-5p-top-bottom", "opacity:0;").attr("data-30p-top-bottom", "opacity:1;"), skrollrSize = 100 * $(this).data("vcParallax"), ($parallaxElement = $("<div />").addClass("vc_parallax-inner").appendTo($(this))).height(skrollrSize + "%"), (youtubeId = vcExtractYoutubeId(parallaxImage = $(this).data("vcParallaxImage"))) ? insertYoutubeVideoAsBackground($parallaxElement, youtubeId) : void 0 !== parallaxImage && $parallaxElement.css("background-image", "url(" + parallaxImage + ")"), skrollrStart = -(skrollrSize - 100), $parallaxElement.attr("data-bottom-top", "top: " + skrollrStart + "%;").attr("data-top-bottom", "top: 0%;")
        }), callSkrollInit && window.skrollr && (vcSkrollrOptions = {
            forceHeight: !1,
            smoothScrolling: !1,
            mobileCheck: function() {
                return !1
            }
        }, window.vcParallaxSkroll = skrollr.init(vcSkrollrOptions), window.vcParallaxSkroll)
    };

    function lafka_fullwidth_elements() {
        var $elements = $('#content:not(.has-sidebar) #products-wrapper .woocommerce-tabs.wc-tabs-wrapper, #content:not(.has-sidebar) p.woocommerce-thankyou-order-received, body.single-post #content:not(.has-sidebar) #comments, body.page #content:not(.has-sidebar) #comments, #content:not(.has-sidebar) ul.woocommerce-order-overview.woocommerce-thankyou-order-details.order_details');
        var $rtl = $('body.rtl');
        var $contentDiv = $('#content');

        if ($contentDiv.length) {
            $elements.each(function (index) {
                var width = $contentDiv.width();
                var row_padding = 40;
                var offset = -($contentDiv.width() - $('#content > .inner ').css("width").replace("px", "")) / 2 - row_padding + 15;

                $(this).css({
                    'position': 'relative',
                    'box-sizing': 'border-box',
                    'width': width,
                    'padding-left': Math.abs(offset),
                    'padding-right': Math.abs(offset)
                });

                if($rtl.length && !($(this).attr('id') === 'comments')) {
                    $(this).css({'right': offset});
                } else {
                    $(this).css({'left': offset});
                }
            });
        }
    }

    //updates the shopping cart in the sidebar, hooks into the added_to_cart event which is triggered by woocommerce
	function update_cart_dropdown(event) {
		var product = jQuery.extend({name: lafka_main_js_params.product_label, price: "", image: ""}, lafka_added_product);
		var notice = $("<div class='lafka_added_to_cart_notification'>" + product.image + "<div class='added-product-text'><strong>" + product.name + " " + lafka_main_js_params.added_to_cart_label + "</strong></div></div>");

		if (typeof event !== 'undefined')
		{
		    var $cart_add_sound = $('#cart_add_sound');
			if ($cart_add_sound.length) {
                $cart_add_sound[0].play && $cart_add_sound[0].play();
                $(document.body).find("div.widget.woocommerce.widget_shopping_cart").addClass("active_cart");
			}

            defineCartIconClickBehaviour();

			notice.appendTo($("body")).hide().fadeIn('slow');
			setTimeout(function () {
				notice.fadeOut('slow');
			}, 2000);
			setTimeout(function () {
                $(document.body).find("div.widget.woocommerce.widget_shopping_cart").removeClass("active_cart");
			}, 8000);

            $(document.body).find('div.widget.woocommerce.widget_shopping_cart .widget_shopping_cart_content ul.cart_list.product_list_widget').niceScroll({horizrailenabled:false});
		}
	}

	var lafka_added_product = {};
	function track_ajax_add_to_cart()
	{
		jQuery('body').on('click', '.add_to_cart_button', function ()
		{
			var productContainer = jQuery(this).parents('.product').eq(0), product = {};
			product.name = productContainer.find('span.name').text();
			product.image = productContainer.find('div.image img');
			product.price = productContainer.find('.price_hold .amount').last().text();

			/*fallbacks*/
			if (productContainer.length === 0)
			{
				return;
			}

			if (product.image.length)
			{
				product.image = "<img class='added-product-image' src='" + product.image.get(0).src + "' title='' alt='' />";
			}
			else
			{
				product.image = "";
			}

			lafka_added_product = product;
		});
	}

	// Showing loader
	jQuery.lafka_show_loader = function () {

		var overlay;
		var $shopbypricefilter_overlay = $('.shopbypricefilter-overlay');
		if ($shopbypricefilter_overlay.length) {
			overlay = $shopbypricefilter_overlay;
		} else {
			overlay = $('<div class="ui-widget-overlay shopbypricefilter-overlay">&nbsp;</div>').prependTo('body');
		}

		$(overlay).css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%',
			'z-index': 19999,
		});

        $shopbypricefilter_overlay.each(function () {
			var overlay = this;
			var img;

			if ($('img', overlay).length) {
				img = $('img', overlay);
			} else {
				img = $('<img id="price_fltr_loading_gif" src="' + lafka_main_js_params.img_path + 'loading3.gif" />').prependTo(overlay);
			}

			$(img).css({
				'max-height': $(overlay).height() * 0.8,
				'max-width': $(overlay).width() * 0.8
			});

			$(img).css({
				'position': 'fixed',
				'top': $(window).outerHeight() / 2,
				'left': ($(window).outerWidth() - $(img).width()) / 2
			});
		}).show();

	};

    // Hiding loader
    jQuery.lafka_hide_loader = function () {
        $('.shopbypricefilter-overlay').remove();
    };

    // Refresh product filters area
	jQuery.lafka_refresh_product_filters_areas = function(response){
    	// lafka_product_filter widget
		var $lafka_product_filters = $(document.body).find('div.lafka_product_filter');
        var $new_lafka_product_filters = $(response).find('div.lafka_product_filter');

        if($lafka_product_filters.length > $new_lafka_product_filters.length) {
            var existing_titles = [];
            var found_titles = [];

            $lafka_product_filters.each(function () {
                var $curr_elmnt = $(this);
                var title = $curr_elmnt.find('h3:first-of-type').html();
                existing_titles.push(title);

                $new_lafka_product_filters.each(function () {
                    if ($(this).find('h3:first-of-type').html() === title) {
                        $curr_elmnt.html($(this).html());
                        found_titles.push(title);
                    }
                });
            });

            for (var i = 0; i < existing_titles.length; i++) {
                if ($.inArray(existing_titles[i], found_titles) === -1) {
                    $lafka_product_filters.each(function () {
                        $(this).find("h3:contains('" + existing_titles[i] + "')").parent().remove();
                    });
                }
            }
        } else {
            $new_lafka_product_filters.each(function (index) {
                if(typeof $lafka_product_filters.get(index) !== 'undefined') {
                    $($lafka_product_filters.get(index)).html($(this).html());
                } else if($lafka_product_filters.length === 0) {
                    $(document.body).find('div#lafka-filter-widgets').append($(this));
                } else {
                    $lafka_product_filters.first().parent().find('div.widget').last().after($(this));
                }
            });
        }

        $.lafka_widget_columns();

        var $price_slider_form = $(document).find('#lafka-price-filter-form');
        if ($price_slider_form.length === 0) {
            $(document).find('div#main').find('div.product-filter').prepend($(response).find('#lafka-price-filter-form'));
        } else {
            $price_slider_form.replaceWith($(response).find('#lafka-price-filter-form'));
        }

        if (typeof $.lafka_build_price_slider === "function") {
            $.lafka_build_price_slider();
        }

        // Show reset button if there are active filters
        $.lafka_handle_active_filters_reset_button();

    };

    jQuery.lafka_handle_active_filters_reset_button = function() {
        // Show reset button if there are active filters
        var $reset_button = $(document).find('div.lafka-filter-widgets-holder a.lafka-reset-filters');
        if(typeof $reset_button !== 'undefined') {
            var show_reset_button = false;

            var lafka_reset_query = $reset_button.data('lafka_reset_query');
            var right_side_of_the_url = '';

            if(window.location.href.indexOf('?') !== -1) {
                right_side_of_the_url = window.location.href.substr(window.location.href.indexOf('?'));
                if(right_side_of_the_url !== lafka_reset_query) {
                    show_reset_button = true;
                }
            }

            if (show_reset_button) {
                $reset_button.show();
            } else {
                $reset_button.hide();
            }
        }
    };

    jQuery.lafka_widget_columns = function() {
        // Put class .last on each 4th widget in the footer
        $('#slide_footer div.one_fourth').filter(function (index) {
            return index % 4 === 3;
        }).addClass('last').after('<div class="clear"></div>');
        $('#footer > div.inner div.one_fourth').filter(function (index) {
            return index % 4 === 3;
        }).addClass('last').after('<div class="clear"></div>');
        // Put class .last on each 4th widget in pre header
        $('#pre_header > div.inner div.one_fourth').filter(function (index) {
            return index % 4 === 3;
        }).addClass('last').after('<div class="clear"></div>');
        $('#lafka-filter-widgets > div.one_fourth').filter(function (index) {
            return index % 4 === 3;
        }).addClass('last').after('<div class="clear"></div>');

        // Put class .last on each 3th widget in the footer
        $('#slide_footer div.one_third').filter(function (index) {
            return index % 3 === 2;
        }).addClass('last').after('<div class="clear"></div>');
        $('#footer > div.inner div.one_third').filter(function (index) {
            return index % 3 === 2;
        }).addClass('last').after('<div class="clear"></div>');
        // Put class .last on each 3th widget in pre header
        $('#pre_header > div.inner div.one_third').filter(function (index) {
            return index % 3 === 2;
        }).addClass('last').after('<div class="clear"></div>');
        $('#lafka-filter-widgets > div.one_third').filter(function (index) {
            return index % 3 === 2;
        }).addClass('last').after('<div class="clear"></div>');

        // Put class .last on each 2nd widget in the footer
        $('#slide_footer div.one_half').filter(function (index) {
            return index % 2 === 1;
        }).addClass('last').after('<div class="clear"></div>');
        $('#footer > div.inner div.one_half').filter(function (index) {
            return index % 2 === 1;
        }).addClass('last').after('<div class="clear"></div>');
        // Put class .last on each 2nd widget in pre header
        $('#pre_header > div.inner div.one_half').filter(function (index) {
            return index % 2 === 1;
        }).addClass('last').after('<div class="clear"></div>');
        $('#lafka-filter-widgets > div.one_half').filter(function (index) {
            return index % 2 === 1;
        }).addClass('last').after('<div class="clear"></div>');

        // Woocommerce part columns
        $('.woocommerce.columns-2:not(.owl-carousel)').each(function() {
            $(this).find('div.prod_hold, .product-category').filter(function (index) {
                return index % 2 === 1;
            }).addClass('last').after('<div class="clear"></div>');
        });

        $('.woocommerce.columns-3:not(.owl-carousel)').each(function() {
            $(this).find('div.prod_hold, .product-category').filter(function (index) {
                return index % 3 === 2;
            }).addClass('last').after('<div class="clear"></div>');
        });

        $('.woocommerce.columns-4:not(.owl-carousel)').each(function() {
            $(this).find('div.prod_hold, .product-category').filter(function (index) {
                return index % 4 === 3;
            }).addClass('last').after('<div class="clear"></div>');
        });
        $('.woocommerce.columns-5:not(.owl-carousel)').each(function() {
            $(this).find('div.prod_hold, .product-category').filter(function (index) {
                return index % 5 === 4;
            }).addClass('last').after('<div class="clear"></div>');
        });
        $('.woocommerce.columns-6:not(.owl-carousel)').each(function() {
            $(this).find('div.prod_hold, .product-category').filter(function (index) {
                return index % 6 === 5;
            }).addClass('last').after('<div class="clear"></div>');
        });
    };

    // Refresh products list after ajax calls
    jQuery.lafka_refresh_products_after_ajax = function (response, $products, $pagination, $pageStatus) {

        var $newProducts = $(response).find('.content_holder').find('.prod_hold');
        var $pagination_html = $(response).find('.lafka-shop-pager .pagination').html();

        if(typeof $pagination_html === 'undefined') {
            $pagination.html('');
		} else {
            $pagination.html($pagination_html);
		}


        // Do the necessary for the appending products
        $newProducts.imagesLoaded(function () {
            $newProducts.each(function () {
                $(this).addClass('lafka-infinite-loaded');

                if($(document.documentElement).hasClass('no-touch')) {
                    $(this).appear(function () {
                        $(this).addClass('prod_visible').delay(2000);
                    });
                }
            });
        });

        // Now add the new products to the list
        $products.append($newProducts);

        lafkaInitSmallCountdowns($newProducts);

        // Woocommerce part columns
        $('.woocommerce.columns-2:not(.owl-carousel) div.prod_hold').filter(function (index) {
            if ($(this).next().hasClass('clear')) {
                return false;
            } else {
                return index % 2 === 1;
            }
        }).addClass('last').after('<div class="clear"></div>');
        $('.woocommerce.columns-3:not(.owl-carousel) div.prod_hold').filter(function (index) {
            if ($(this).next().hasClass('clear')) {
                return false;
            } else {
                return index % 3 === 2;
            }
        }).addClass('last').after('<div class="clear"></div>');
        $('.woocommerce.columns-4:not(.owl-carousel) div.prod_hold').filter(function (index) {
            if ($(this).next().hasClass('clear')) {
                return false;
            } else {
                return index % 4 === 3;
            }
        }).addClass('last').after('<div class="clear"></div>');
        $('.woocommerce.columns-5:not(.owl-carousel) div.prod_hold').filter(function (index) {
            if ($(this).next().hasClass('clear')) {
                return false;
            } else {
                return index % 5 === 4;
            }
        }).addClass('last').after('<div class="clear"></div>');
        $('.woocommerce.columns-6:not(.owl-carousel) div.prod_hold').filter(function (index) {
            if ($(this).next().hasClass('clear')) {
                return false;
            } else {
                return index % 6 === 5;
            }
        }).addClass('last').after('<div class="clear"></div>');

        $pagination.find('a.next_page').data('requestRunning', false);
        // hide loading
        $pageStatus.children('.infinite-scroll-request').hide();

        if (!$pagination.find('a.next_page').length) {
            $pageStatus.children('.infinite-scroll-last').show();
            $('button.lafka-load-more').hide();
        } else {
            $('button.lafka-load-more').show();
        }
    };
    defineMegaMenuSizing();
})(window.jQuery);

// non jQuery scripts below
"use strict";
// Add or Update a key-value pairs in the URL query parameters (with leading '?')
function lafkaUpdateUrlParameters(currentParams, newParams) {

	if(currentParams.trim() === '') {
		return "?" + newParams;
	}

    var newParamsObj = {};
    newParams.split('&').forEach(function(x){
        var arr = x.split('=');
        arr[1] && (newParamsObj[arr[0]] = arr[1]);
    });

    for (var prop in newParamsObj) {
        // remove the hash part before operating on the uri
        var i = currentParams.indexOf('#');
        var hash = i === -1 ? '' : uri.substr(i);
        currentParams = i === -1 ? currentParams : currentParams.substr(0, i);

        var re = new RegExp("([?&])" + prop + "=.*?(&|$)", "i");
        var separator = "&";
        if (currentParams.match(re)) {
            currentParams = currentParams.replace(re, '$1' + prop + "=" + newParamsObj[prop] + '$2');
        } else {
            currentParams = currentParams + separator + prop + "=" + newParamsObj[prop];
        }
        currentParams + hash;  // finally append the hash as well
    }

    return currentParams;
}