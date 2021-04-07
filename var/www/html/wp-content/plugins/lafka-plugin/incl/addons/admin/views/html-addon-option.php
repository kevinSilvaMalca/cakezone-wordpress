<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<tr>
	<td><input type="text" name="product_addon_option_label[<?php echo $loop; ?>][]" value="<?php echo esc_attr( $option['label'] ); ?>" placeholder="<?php esc_html_e( 'Default Label', 'lafka-plugin' ); ?>" /></td>
	<td class="price_column"><input type="text" name="product_addon_option_price[<?php echo $loop; ?>][]" value="<?php echo esc_attr( wc_format_localized_price( $option['price'] ) ); ?>" placeholder="0.00" class="wc_input_price" /></td>

    <td class="minmax_column">
        <input type="number" name="product_addon_option_min[<?php echo $loop; ?>][]" value="<?php echo isset($option['min']) ? esc_attr( $option['min'] ) : '' ?>" placeholder="Min" min="0" step="any" />
        <input type="number" name="product_addon_option_max[<?php echo $loop; ?>][]" value="<?php echo isset($option['max']) ? esc_attr( $option['max'] ) : '' ?>" placeholder="Max" min="0" step="any" />
    </td>

    <td class="lafka-is-default-column" width="10%">
        <input class="lafka-is-default-value" type="hidden" name="product_addon_option_default[<?php echo $loop; ?>][]" value="<?php echo esc_attr( $option['default'] ); ?>" />
	    <?php
	    $inputs_type = 'checkbox';
	    $inputs_name = 'product_addon_option_default_switch[' . $loop . '][]';
	    if ( isset($addon['type']) && $addon['type'] === 'radiobutton' ) {
		    $inputs_type = 'radio';
		    $inputs_name = 'product_addon_option_default_switch[' . $loop . ']';
	    }
        ?>
        <input class="lafka-is-default-switch" type="<?php echo esc_attr($inputs_type); ?>" name="<?php echo esc_attr($inputs_name); ?>" value="1" <?php checked( 1, $option['default'] ) ?> />
    </td>

	<?php do_action( 'lafka_product_addons_panel_option_row', isset( $post ) ? $post : null, $product_addons, $loop, $option ); ?>

	<td class="actions" width="1%"><button type="button" class="remove_addon_option button">x</button></td>
</tr>