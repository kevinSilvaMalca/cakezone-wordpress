<?php foreach ( $addon['options'] as $i => $option ) :

	$price = apply_filters( 'lafka_product_addons_option_price',
		$option['price'] > 0 ? '(' . wc_price( lafka_get_product_addon_price_for_display( $option['price'] ) ) . ')' : '',
		$option,
		$i,
		'checkbox'
	);

	$selected = array();
	if ( isset( $_POST[ 'addon-' . sanitize_title( $addon['field-name'] ) ] ) ) {
		$selected = $_POST[ 'addon-' . sanitize_title( $addon['field-name'] ) ];
	} elseif ( ! empty( $option['default'] ) ) {
		$selected = array( sanitize_title( $option['label'] ) );
	}

	if ( ! is_array( $selected ) ) {
		$selected = array( $selected );
	}

	$current_value = ( in_array( sanitize_title( $option['label'] ), $selected ) ) ? 1 : 0;
	?>

	<p class="form-row form-row-wide addon-wrap-<?php echo sanitize_title( $addon['field-name'] ) . '-' . $i; ?>">
		<label><input type="checkbox" class="addon addon-checkbox" name="addon-<?php echo sanitize_title( $addon['field-name'] ); ?>[]" data-raw-price="<?php echo esc_attr( $option['price'] ); ?>" data-price="<?php echo lafka_get_product_addon_price_for_display( $option['price'] ); ?>" value="<?php echo sanitize_title( $option['label'] ); ?>" <?php checked( $current_value, 1 ); ?> /> <?php echo wptexturize( $option['label'] . ' ' . $price ); ?></label>
	</p>

<?php endforeach; ?>
