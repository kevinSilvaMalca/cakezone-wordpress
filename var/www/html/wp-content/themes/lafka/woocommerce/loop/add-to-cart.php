<?php

/**
 * Loop Add to Cart
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/loop/add-to-cart.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.3.0
 */

if (!defined('ABSPATH')) {
	exit;
}

global $product;
echo '<div class="links">';
echo apply_filters(
	'woocommerce_loop_add_to_cart_link', // WPCS: XSS ok.
	sprintf(
		'<a href="%s" data-quantity="%s" class="%s" title="%s" %s>%s</a>',
		esc_url($product->add_to_cart_url()),
		esc_attr(isset($args['quantity']) ? $args['quantity'] : 1),
		esc_attr(isset($args['class']) ? $args['class'] : 'button'),
		esc_attr($product->add_to_cart_text()),
		isset($args['attributes']) ? wc_implode_html_attributes($args['attributes']) : '',
		esc_html($product->add_to_cart_text())
	),
	$product,
	$args
);

// Do not show quickview link for composite products as it is too complex for the user
if (lafka_get_option('use_quickview') && $product->get_type() != 'composite') {
	$classes = array('lafka-quick-view-link');

	if (lafka_is_product_eligible_for_variation_in_listings($product)) {
		$lafka_quickview_link_label = __('Mas Opciones', 'lafka');
		$classes[] = 'lafka-more-options';
	} else {
?>
		<form class="lafka-variations-in-catalog cart" action="<?php echo esc_url(apply_filters('woocommerce_add_to_cart_form_action', $product->get_permalink())); ?>" method="post" enctype='multipart/form-data' data-product_id="<?php echo absint($product->get_id()); ?>">

			<span class="lafka-list-variation-label">
				<?php
				$variation_label_array = array();
				if (isset($variation['attributes'])) {
					foreach ($variation['attributes'] as $attribute_name => $attribute_slug) {
						/** @var WP_Term $attribute_term_object */
						$attribute_term_object = get_term_by('slug', $attribute_slug, str_replace('attribute_', '', rawurldecode($attribute_name)));
						if (is_a($attribute_term_object, 'WP_Term')) {
							$variation_label_array[] = $attribute_term_object->name;
						}
					}
				}
				?>
				<?php if (count($variation_label_array)) : ?>
					<?php echo esc_html(implode(' ', $variation_label_array)); ?>
				<?php endif; ?>
			</span>

			<?php if (isset($variation['weight']) && $variation['weight']) : ?>
				<span class="lafka-list-variation-weight"><?php echo esc_html($variation['weight_html']); ?></span>
			<?php endif; ?>

			<span class="lafka-list-variation-price">
				<?php echo wp_kses_post($variation['price_html']); ?>
			</span>
			<!-- <button type="submit" class="single_add_to_cart_button button alt"><?php echo esc_html($product->single_add_to_cart_text()); ?></button> -->

			<?php do_action('woocommerce_after_add_to_cart_button'); ?>

			<?php foreach ($variation['attributes'] as $attribute_name => $attribute_slug) : ?>
				<input type="hidden" name="<?php echo esc_attr($attribute_name); ?>" value="<?php echo esc_attr($attribute_slug); ?>" />
			<?php endforeach; ?>
			<input type="hidden" name="quantity" value="<?php echo esc_attr($variation['min_qty']); ?>" />
			<input type="hidden" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" />
			<input type="hidden" name="product_id" value="<?php echo esc_attr($product->get_id()); ?>" />
			<input type="hidden" name="variation_id" class="variation_id" value="<?php echo esc_attr($variation['variation_id']) ?>" />
			<?php
			if (function_exists('lafka_get_product_addons')) {
				$product_addons = lafka_get_product_addons($product->get_id());

				foreach ($product_addons as $addon) {
					if ($addon['required']) {
						foreach ($addon['options'] as $option) {
							if ($option['default']) {
								echo '<input type="hidden" name="addon-' . esc_attr($addon['field-name']) . '[]" value="' . esc_attr($option['label']) . '"/>';
							}
						}
					}
				}
			}
			?>
		</form>
<?php
		$lafka_quickview_link_label = __('+', 'lafka'); //Ordenalo Ahora More Options
	}

	echo '<a href="#" class="' . esc_attr(implode(' ', $classes)) . '" data-id="' . esc_attr($product->get_id()) . '" title="' . esc_attr($lafka_quickview_link_label) . '">' . esc_html($lafka_quickview_link_label) . '</a>';
}
// show compare link
if (defined('YITH_WOOCOMPARE')) {
	lafka_add_compare_link();
}

echo '</div>';
