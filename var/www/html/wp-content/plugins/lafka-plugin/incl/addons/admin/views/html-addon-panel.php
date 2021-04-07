<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div id="product_addons_data" class="panel woocommerce_options_panel wc-metaboxes-wrapper">
	<?php do_action( 'lafka-product-addons_panel_start' ); ?>

	<p class="lafka-product-add-ons-toolbar lafka-product-add-ons-toolbar--open-close toolbar">
		<a href="#" class="close_all"><?php esc_html_e( 'Close all', 'lafka-plugin' ); ?></a> / <a href="#" class="expand_all"><?php esc_html_e( 'Expand all', 'lafka-plugin' ); ?></a>
	</p>

	<div class="lafka_product_addons wc-metaboxes">

		<?php
			$loop = 0;

			foreach ( $product_addons as $addon ) {
				include( dirname( __FILE__ ) . '/html-addon.php' );

				$loop++;
			}
		?>

	</div>

	<div class="lafka-product-add-ons-toolbar lafka-product-add-ons-toolbar--add-import-export toolbar">
		<button type="button" class="button add_new_addon"><?php esc_html_e( 'New add-on', 'lafka-plugin' ); ?></button>
	</div>
	<?php if ( $exists ) : ?>
		<div class="options_group">
			<p class="form-field">
			<label for="_product_addons_exclude_global"><?php esc_html_e( 'Global Addon Exclusion', 'lafka-plugin' ); ?></label>
			<input id="_product_addons_exclude_global" name="_product_addons_exclude_global" class="checkbox" type="checkbox" value="1" <?php checked( $exclude_global, 1 ); ?>/><span class="description"><?php esc_html_e( 'Check this to exclude this product from all Global Addons', 'lafka-plugin' ); ?></span>
			</p>
		</div>
	<?php endif; ?>
</div>
<?php
$empty_name_message = esc_html__( 'All addon fields require a name.', 'lafka-plugin' );
?>
<script type="text/javascript">
	jQuery(function( $ ){
		$( '.product_page_global_addons' ).on( 'click', 'input[type="submit"]', function( e ) {
			// Loop through all addons to validate them.
			$( '.lafka_product_addons' ).find( '.lafka_product_addon' ).each( function() {
				if ( 0 === $( this ).find( '.addon_name input' ).val().length ) {
					e.preventDefault();

					alert( '<?php echo $empty_name_message; ?>' );

					return false;
				}
			});
		});

		jQuery('#product_addons_data')
		.on( 'change', '.addon_name input', function() {
			if ( jQuery(this).val() )
				jQuery(this).closest('.lafka_product_addon').find('span.group_name').text( '"' + jQuery(this).val() + '"' );
			else
				jQuery(this).closest('.lafka_product_addon').find('span.group_name').text('');
		})
        .on( 'change', 'select.product_addon_type', function() {

            var value = jQuery(this).val();

            if ( value == 'textarea') {
                jQuery(this).closest('.lafka_product_addon').find('td.minmax_column, th.minmax_column').show();
            } else {
                jQuery(this).closest('.lafka_product_addon').find('td.minmax_column, th.minmax_column').hide();
            }

            if ( value == 'custom_price' ) {
                jQuery(this).closest('.lafka_product_addon').find('td.price_column, th.price_column').hide();
            } else {
                jQuery(this).closest('.lafka_product_addon').find('td.price_column, th.price_column').show();
            }

            // Switch up the column title, based on the field type selected
            switch ( value ) {
                case 'textarea':
                    column_title = '<?php echo esc_js( __( 'Min / max characters', 'lafka-plugin' ) ); ?>';
                    break;

                default:
                    column_title = '<?php echo esc_js( __( 'Min / max', 'lafka-plugin' ) ); ?>';
                    break;
            }

            jQuery(this).closest('.lafka_product_addon').find('th.minmax_column .column-title').replaceWith( '<span class="column-title">' + column_title + '</span>' );

            // Count the number of options.  If one (or less), disable the remove option buttons
            var removeAddOnOptionButtons = jQuery(this).closest('.lafka_product_addon').find('button.remove_addon_option');
            if ( 2 > removeAddOnOptionButtons.length ) {
                removeAddOnOptionButtons.attr('disabled', 'disabled');
            } else {
                removeAddOnOptionButtons.removeAttr('disabled');
            }
        })
		.on( 'click', 'button.add_addon_option', function() {

			var loop = jQuery(this).closest('.lafka_product_addon').index('.lafka_product_addon');

			var html = '<?php
				ob_start();

				$option = Lafka_Product_Addon_Admin::get_new_addon_option();
				$loop = "{loop}";

				include( dirname( __FILE__ ) . '/html-addon-option.php' );

				$html = ob_get_clean();
				echo str_replace( array( "\n", "\r" ), '', str_replace( "'", '"', $html ) );
			?>';

			html = html.replace( /{loop}/g, loop );

			var addon_type = $(this).closest('.lafka_product_addon.wc-metabox').find('select.product_addon_type').val();
			if(addon_type === 'checkbox') {
                html = html.replace( 'type="radio"', 'type="checkbox"' );
            } else if(addon_type === 'radiobutton') {
                html = html.replace( 'type="checkbox"', 'type="radio"' );
            }

			jQuery(this).closest('.lafka_product_addon .data').find('tbody').append( html );

            jQuery('select.product_addon_type').change();

			return false;
		})
		.on( 'click', '.add_new_addon', function() {

			var loop = jQuery('.lafka_product_addons .lafka_product_addon').size();
			var total_add_ons = jQuery( '.lafka_product_addons .lafka_product_addon' ).length;

			if ( total_add_ons >= 1 ) {
				jQuery( '.lafka-product-add-ons-toolbar--open-close' ).show();
			}

			var html = '<?php
				ob_start();

				$addon['name']          = '';
				$addon['limit']          = '';
				$addon['description']   = '';
				$addon['required']      = '';
				$addon['type']          = 'checkbox';
				$addon['options']       = array(
					Lafka_Product_Addon_Admin::get_new_addon_option()
				);
				$loop = "{loop}";

				include( dirname( __FILE__ ) . '/html-addon.php' );

				$html = ob_get_clean();
				echo str_replace( array( "\n", "\r" ), '', str_replace( "'", '"', $html ) );
			?>';

			html = html.replace( /{loop}/g, loop );

			jQuery('.lafka_product_addons').append( html );

            jQuery('select.product_addon_type').change();

			return false;
		})
		.on( 'click', '.remove_addon', function() {

			var answer = confirm('<?php esc_html_e('Are you sure you want remove this add-on?', 'lafka-plugin'); ?>');

			if (answer) {
				var addon = jQuery(this).closest('.lafka_product_addon');
				jQuery(addon).find('input').val('');
				jQuery(addon).remove();
			}
			
			jQuery( '.lafka_product_addons .lafka_product_addon' ).each( function( index, el ) {
				var this_index = index;

				jQuery( this ).find( '.product_addon_position' ).val( this_index );
				jQuery( this ).find( 'select, input, textarea' ).prop( 'name', function( i, val ) {
					var field_name = val.replace( /\[[0-9]+\]/g, '[' + this_index + ']' );

					return field_name;
				} );
			} );

			return false;
		});

        // Initial state of min/max fields
        var $selectedType = $('select.product_addon_type');
        $selectedType.each(function() {
            if ($(this).val() === 'textarea') {
                $(this).closest('.lafka_product_addon').find('td.minmax_column, th.minmax_column').show();
            } else {
                $(this).closest('.lafka_product_addon').find('td.minmax_column, th.minmax_column').hide();
            }
        });

		// Sortable
		jQuery('.lafka_product_addons').sortable({
			items:'.lafka_product_addon',
			cursor:'move',
			axis:'y',
			handle:'h3',
			scrollSensitivity:40,
			helper:function(e,ui){
				return ui;
			},
			start:function(event,ui){
				ui.item.css('border-style','dashed');
			},
			stop:function(event,ui){
				ui.item.removeAttr('style');
				addon_row_indexes();
			}
		});

		function addon_row_indexes() {
			jQuery('.lafka_product_addons .lafka_product_addon').each(function(index, el){ jQuery('.product_addon_position', el).val( parseInt( jQuery(el).index('.lafka_product_addons .lafka_product_addon') ) ); });
		};

		// Sortable options
		jQuery('.lafka_product_addon .data table tbody').sortable({
			items:'tr',
			cursor:'move',
			axis:'y',
			scrollSensitivity:40,
			helper:function(e,ui){
				ui.children().each(function(){
					jQuery(this).width(jQuery(this).width());
				});
				return ui;
			},
			start:function(event,ui){
				ui.item.css('background-color','#f6f6f6');
			},
			stop:function(event,ui){
				ui.item.removeAttr('style');
			}
		});

		// Remove option
        $('.lafka_product_addons.wc-metaboxes').on('click', 'button.remove_addon_option', function (e) {
			var answer = confirm('<?php esc_html_e('Are you sure you want delete this option?', 'lafka-plugin'); ?>');

			if (answer) {
				var addOn = jQuery(this).closest('.lafka_product_addon');
				jQuery(this).closest('tr').remove();
                addOn.find('select.product_addon_type').change();
			}

			return false;

		});

		// Show / hide expand/close
		var total_add_ons = jQuery( '.lafka_product_addons .lafka_product_addon' ).length;
		if ( total_add_ons > 1 ) {
			jQuery( '.lafka-product-add-ons-toolbar--open-close' ).show();
		}

        // Manage population of hidden inputs for checkboxes and radios
        $('.lafka_product_addons.wc-metaboxes').on('change', '.lafka-is-default-switch', function (e) {
            var $all_radio_option_values = $(this).closest('.lafka_product_addon.wc-metabox').find('input.lafka-is-default-value');

            if ($all_radio_option_values.length) {
                $all_radio_option_values.each(function (index) {
                    var $switch_input = $(this).siblings('input.lafka-is-default-switch');
                    if ($switch_input.length) {
                        $(this).val($switch_input.is(':checked') ? 1 : 0);
                    }
                });
            }
        });

		// Switch input types depending on the selected type
        $('.lafka_product_addons.wc-metaboxes').on('change', 'select.product_addon_type', function (e) {
            var $selected_type = $(this).val();
            $(this).closest('.lafka_product_addon.wc-metabox').find('input.lafka-is-default-switch').each(function (index) {
                if ($selected_type === 'checkbox') {
                    $(this).attr('type', 'checkbox');
                } else if ($selected_type === 'radiobutton') {
                    $(this).attr('type', 'radio');
                }

                $(this).trigger('change');
            });
        });

	});
</script>
