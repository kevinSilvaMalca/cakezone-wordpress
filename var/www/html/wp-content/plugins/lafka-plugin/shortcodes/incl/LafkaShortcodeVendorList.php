<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('LafkaShortcodeVendorList')) {

    class LafkaShortcodeVendorList {
        /**
         * Filter vendor list
         * @global object $WCMp
         * @param string $orderby
         * @param string $order
         * @param string $product_category
         * @return array
         */
        public static function get_vendor($orderby = 'registered', $order = 'ASC', $product_category = '', $limit = '') {
            global $WCMp;
            $vendor_info = array();
            $block_vendors = wp_list_pluck(wcmp_get_all_blocked_vendors(), 'id');
            if ($product_category) {
                $args = array(
                    'posts_per_page' => -1,
                    'post_type' => 'product',
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'product_cat',
                            'field' => 'term_id',
                            'terms' => absint($product_category)
                        )
                    )
                );

                if($limit && is_numeric($limit)) {
                	$args['posts_per_page'] = $limit;
                }

                $products = get_posts($args);
                $product_ids = wp_list_pluck($products, 'ID');
                foreach ($product_ids as $product_id) {
                    $vendor = get_wcmp_product_vendors($product_id);
                    if ($vendor && !in_array($vendor->id, $block_vendors)) {
                        $vendor_info[$vendor->id] = array(
                            'vendor_permalink' => $vendor->permalink,
                            'vendor_name' => $vendor->user_data->display_name,
                            'vendor_image' => $vendor->get_image() ? $vendor->get_image('image', array(125, 125)) : $WCMp->plugin_url . 'assets/images/WP-stdavatar.png',
                            'ID' => $vendor->id,
                            'term_id' => $vendor->term_id
                        );
                    }
                }
            } else {
                $vendors = get_wcmp_vendors(array('orderby' => $orderby, 'order' => $order));

	            if(!$limit || !is_numeric($limit)) {
		            $limit = sizeof($vendors);
	            }

	            $vendors_counter = 0;
                foreach ($vendors as $vendor){
	                $vendors_counter ++;
                    if(!in_array($vendor->id, $block_vendors) && $vendors_counter<= $limit){
                        $vendor_info[$vendor->id] = array(
                            'vendor_permalink' => $vendor->permalink,
                            'vendor_name' => $vendor->user_data->display_name,
                            'vendor_image' => $vendor->get_image() ? $vendor->get_image('image', array(125, 125)) : $WCMp->plugin_url . 'assets/images/WP-stdavatar.png',
                            'ID' => $vendor->id,
                            'term_id' => $vendor->term_id
                        );
                    }
                }
            }
            return $vendor_info;
        }

	    /**
	     * Output vendor list shortcode
	     * @global object $WCMp
	     *
	     * @param array $atts
	     *
	     * @return string
	     */
        public static function output($atts) {
            global $WCMp;
            extract(shortcode_atts(array('orderby' => 'registered', 'order' => 'ASC', 'limit' => '', 'hide_order_by' => ''), $atts, 'lafka_wcmp_vendorslist'));
	        $selected_category = '';
	        $sort_type = $orderby;

            if (isset($_REQUEST['vendor_sort_type'])) {
                $sort_type = $_REQUEST['vendor_sort_type'];
                if ($sort_type == 'category' && isset($_REQUEST['vendor_sort_category'])) {
	                $selected_category = $_REQUEST['vendor_sort_category'];
                } else {
                    $orderby = $_REQUEST['vendor_sort_type'];
                }
            }

            $vendor_info = apply_filters('wcmp_vendor_lits_vendor_info_fields', self::get_vendor($orderby, $order, $selected_category, $limit));

	        ob_start();
	            require(plugin_dir_path( __FILE__ ) . '../partials/vendors_list.php');
	        return ob_get_clean();

        }

    }

}