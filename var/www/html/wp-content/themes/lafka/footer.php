<!-- FOOTER -->
<?php
global $lafka_is_blank;
?>
<?php if (!$lafka_is_blank): ?>
	<div id="footer">
		<?php
		$lafka_show_footer_logo = false;
		$lafka_show_footer_menu = false;

		if ( has_nav_menu( 'tertiary' ) ) {
			$lafka_show_footer_menu = true;
		}
		if ( lafka_get_option( 'show_logo_in_footer' ) && ( lafka_get_option( 'theme_logo' ) || lafka_get_option( 'footer_logo' ) ) ) {
			$lafka_show_footer_logo = true;
		}
		?>
		<?php if ( $lafka_show_footer_logo || $lafka_show_footer_menu ): ?>
            <div class="inner">
				<?php if ( $lafka_show_footer_menu ): ?>
					<?php
					/* Tertiary menu */
					$lafka_footer_nav_args = array(
						'theme_location' => 'tertiary',
						'container'      => 'div',
						'container_id'   => 'lafka_footer_menu_container',
						'menu_class'     => '',
						'menu_id'        => 'lafka_footer_menu',
						'depth'          => 1,
						'fallback_cb'    => '',
					);
					wp_nav_menu( $lafka_footer_nav_args );
					?>
				<?php endif; ?>
				<?php if ( $lafka_show_footer_logo ): ?>
                    <div id="lafka_footer_logo">
                        <a href="<?php echo esc_url( lafka_wpml_get_home_url() ); ?>"
                           title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
							<?php
							$lafka_theme_logo_img  = lafka_get_option( 'theme_logo' );
							$lafka_footer_logo_img = lafka_get_option( 'footer_logo' );

							// If footer logo, show footer logo, else main logo
							if ( $lafka_footer_logo_img ) {
								echo wp_get_attachment_image( $lafka_footer_logo_img, 'full', false );
							} elseif ( $lafka_theme_logo_img ) {
								echo wp_get_attachment_image( $lafka_theme_logo_img, 'full', false );
							}
							?>
                        </a>
                    </div>
				<?php endif; ?>
            </div>
		<?php endif; ?>
		<?php
		$lafka_meta_options = array();
		if (is_single() || is_page()) {
			$lafka_meta_options = get_post_custom(get_queried_object_id());
		}

		$lafka_show_sidebar = 'yes';
		if (isset($lafka_meta_options['lafka_show_footer_sidebar']) && trim($lafka_meta_options['lafka_show_footer_sidebar'][0]) != '') {
			$lafka_show_sidebar = $lafka_meta_options['lafka_show_footer_sidebar'][0];
		}

		$lafka_footer_sidebar_choice = lafka_get_option('footer_sidebar');
		if (isset($lafka_meta_options['lafka_custom_footer_sidebar']) && $lafka_meta_options['lafka_custom_footer_sidebar'][0] !== 'default') {
			$lafka_footer_sidebar_choice = $lafka_meta_options['lafka_custom_footer_sidebar'][0];
		}

		if ( $lafka_show_sidebar === 'no' ) {
			$lafka_footer_sidebar_choice = 'none';
		}
		?>
		<?php if (function_exists('dynamic_sidebar') && $lafka_footer_sidebar_choice != 'none' && is_active_sidebar($lafka_footer_sidebar_choice)) : ?>
			<div class="inner<?php if($lafka_footer_sidebar_choice !== 'bottom_footer_sidebar') echo ' lafka-is-custom-footer-sidebar' ?>">
				<?php dynamic_sidebar($lafka_footer_sidebar_choice) ?>
				<div class="clear"></div>
			</div>
		<?php endif; ?>
		<div id="powered">
			<div class="inner">
				<?php if (lafka_get_option('social_in_footer')): ?>
					<?php get_template_part('partials/social-profiles'); ?>
				<?php endif; ?>

				<div class="author_credits"><?php echo wp_kses_post(lafka_get_option('copyright_text')) ?></div>
			</div>
		</div>
	</div>
	<!-- END OF FOOTER -->
<?php endif; ?>
</div>
<!-- END OF MAIN WRAPPER -->
<?php
$lafka_is_compare = false;
if (isset($_GET['action']) && $_GET['action'] === 'yith-woocompare-view-table') {
	$lafka_is_compare = true;
}

$lafka_to_include_backgr_video = lafka_has_to_include_backgr_video($lafka_is_compare);
?>
<?php if ($lafka_to_include_backgr_video): ?>
	<?php
	$lafka_video_bckgr_url = $lafka_video_bckgr_start = $lafka_video_bckgr_end = $lafka_video_bckgr_loop = $lafka_video_bckgr_mute = '';

	switch ($lafka_to_include_backgr_video) {
		case 'postmeta':
			$lafka_custom = lafka_has_post_video_bckgr();
			$lafka_video_bckgr_url = isset($lafka_custom['lafka_video_bckgr_url'][0]) ? $lafka_custom['lafka_video_bckgr_url'][0] : '';
			$lafka_video_bckgr_start = isset($lafka_custom['lafka_video_bckgr_start'][0]) ? $lafka_custom['lafka_video_bckgr_start'][0] : '';
			$lafka_video_bckgr_end = isset($lafka_custom['lafka_video_bckgr_end'][0]) ? $lafka_custom['lafka_video_bckgr_end'][0] : '';
			$lafka_video_bckgr_loop = isset($lafka_custom['lafka_video_bckgr_loop'][0]) ? $lafka_custom['lafka_video_bckgr_loop'][0] : '';
			$lafka_video_bckgr_mute = isset($lafka_custom['lafka_video_bckgr_mute'][0]) ? $lafka_custom['lafka_video_bckgr_mute'][0] : '';
			break;
		case 'blog':
			$lafka_video_bckgr_url = lafka_get_option('blog_video_bckgr_url');
			$lafka_video_bckgr_start = lafka_get_option('blog_video_bckgr_start');
			$lafka_video_bckgr_end = lafka_get_option('blog_video_bckgr_end');
			$lafka_video_bckgr_loop = lafka_get_option('blog_video_bckgr_loop');
			$lafka_video_bckgr_mute = lafka_get_option('blog_video_bckgr_mute');
			break;
		case 'shop':
		case 'shopwide':
			$lafka_video_bckgr_url = lafka_get_option('shop_video_bckgr_url');
			$lafka_video_bckgr_start = lafka_get_option('shop_video_bckgr_start');
			$lafka_video_bckgr_end = lafka_get_option('shop_video_bckgr_end');
			$lafka_video_bckgr_loop = lafka_get_option('shop_video_bckgr_loop');
			$lafka_video_bckgr_mute = lafka_get_option('shop_video_bckgr_mute');
			break;
		case 'global':
			$lafka_video_bckgr_url = lafka_get_option('video_bckgr_url');
			$lafka_video_bckgr_start = lafka_get_option('video_bckgr_start');
			$lafka_video_bckgr_end = lafka_get_option('video_bckgr_end');
			$lafka_video_bckgr_loop = lafka_get_option('video_bckgr_loop');
			$lafka_video_bckgr_mute = lafka_get_option('video_bckgr_mute');
			break;
		default:
			break;
	}
	?>
    <div id="bgndVideo" class="lafka_bckgr_player"
         data-property="{videoURL:'<?php echo esc_url($lafka_video_bckgr_url) ?>',containment:'body',autoPlay:true, loop:<?php echo esc_js($lafka_video_bckgr_loop) ? 'true' : 'false'; ?>, mute:<?php echo esc_js($lafka_video_bckgr_mute) ? 'true' : 'false'; ?>, startAt:<?php echo esc_js($lafka_video_bckgr_start) ? esc_js($lafka_video_bckgr_start) : 0; ?>, opacity:.9, showControls:false, addRaster:true, quality:'default'<?php if ($lafka_video_bckgr_end): ?>, stopAt:<?php echo esc_js($lafka_video_bckgr_end) ?><?php endif; ?>}">
    </div>
	<?php if (!$lafka_video_bckgr_mute): ?>
        <div class="video_controlls">
            <a id="video-volume" href="#" onclick="<?php echo esc_js('jQuery("#bgndVideo").YTPToggleVolume()') ?>"><i class="fa fa-volume-up"></i></a>
            <a id="video-play" href="#" onclick="<?php echo esc_js('jQuery("#bgndVideo").YTPPlay()') ?>"><i class="fa fa-play"></i></a>
            <a id="video-pause" href="#" onclick="<?php echo esc_js('jQuery("#bgndVideo").YTPPause()') ?>"><i class="fa fa-pause"></i></a>
        </div>
	<?php endif; ?>
<?php endif; ?>
<?php wp_footer(); ?>
</body>
</html>