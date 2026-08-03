<?php
/**
 * Plugin Name:       StillOpen Front Desk
 * Plugin URI:        https://stillopen.ai/
 * Description:       Puts your StillOpen AI front desk on your site. Paste the front desk ID from your welcome email, save, and the chat bubble is live. No code, no theme edits.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Cole Cummings
 * Author URI:        https://stillopen.ai/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       stillopen-front-desk
 *
 * @package StillOpenFrontDesk
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'STILLOPEN_FD_VERSION', '1.0.0' );
define( 'STILLOPEN_FD_OPTION', 'stillopen_front_desk_id' );
define( 'STILLOPEN_FD_SCRIPT', 'https://app.stillopen.ai/chatbot.js' );

/**
 * Sanitize a front desk ID.
 *
 * The ID is a Clerk user id from the welcome email. It's always letters,
 * numbers, underscores and hyphens, so anything else gets stripped rather than
 * saved and quietly broken.
 *
 * @param string $value Raw value from the settings form.
 * @return string Cleaned ID.
 */
function stillopen_fd_sanitize_id( $value ) {
	$clean = preg_replace( '/[^A-Za-z0-9_\-]/', '', (string) $value );
	return substr( $clean, 0, 128 );
}

/**
 * Register the setting.
 */
function stillopen_fd_register_settings() {
	register_setting(
		'stillopen_fd_settings',
		STILLOPEN_FD_OPTION,
		array(
			'type'              => 'string',
			'sanitize_callback' => 'stillopen_fd_sanitize_id',
			'default'           => '',
		)
	);
}
add_action( 'admin_init', 'stillopen_fd_register_settings' );

/**
 * Add the settings page under Settings.
 */
function stillopen_fd_add_settings_page() {
	add_options_page(
		__( 'StillOpen Front Desk', 'stillopen-front-desk' ),
		__( 'StillOpen Front Desk', 'stillopen-front-desk' ),
		'manage_options',
		'stillopen-front-desk',
		'stillopen_fd_render_settings_page'
	);
}
add_action( 'admin_menu', 'stillopen_fd_add_settings_page' );

/**
 * Settings link on the Plugins screen.
 *
 * @param array $links Existing action links.
 * @return array
 */
function stillopen_fd_action_links( $links ) {
	$url = admin_url( 'options-general.php?page=stillopen-front-desk' );
	array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'stillopen-front-desk' ) . '</a>' );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'stillopen_fd_action_links' );

/**
 * Render the settings page.
 */
function stillopen_fd_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$id     = get_option( STILLOPEN_FD_OPTION, '' );
	$is_set = '' !== $id;
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'StillOpen Front Desk', 'stillopen-front-desk' ); ?></h1>

		<p style="max-width:640px;font-size:15px;line-height:1.6">
			<?php esc_html_e( 'Your front desk answers your customers when you can\'t. Paste the front desk ID from your welcome email below, save, and the chat bubble shows up on your site.', 'stillopen-front-desk' ); ?>
		</p>

		<?php if ( $is_set ) : ?>
			<div class="notice notice-success inline" style="border-left-color:#f97316">
				<p>
					<strong><?php esc_html_e( 'Your front desk is switched on.', 'stillopen-front-desk' ); ?></strong>
					<?php esc_html_e( 'Open your site in a new tab and look for the bubble in the bottom corner. Ask it something a real customer would ask.', 'stillopen-front-desk' ); ?>
				</p>
			</div>
		<?php else : ?>
			<div class="notice notice-warning inline">
				<p>
					<strong><?php esc_html_e( 'Not switched on yet.', 'stillopen-front-desk' ); ?></strong>
					<?php esc_html_e( 'Nothing shows on your site until you save a front desk ID.', 'stillopen-front-desk' ); ?>
				</p>
			</div>
		<?php endif; ?>

		<form action="options.php" method="post">
			<?php settings_fields( 'stillopen_fd_settings' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="stillopen_fd_id"><?php esc_html_e( 'Front desk ID', 'stillopen-front-desk' ); ?></label>
					</th>
					<td>
						<input
							type="text"
							id="stillopen_fd_id"
							name="<?php echo esc_attr( STILLOPEN_FD_OPTION ); ?>"
							value="<?php echo esc_attr( $id ); ?>"
							class="regular-text code"
							placeholder="user_xxxxxxxxxxxxxxxxxxxxxxxx"
							autocomplete="off"
						/>
						<p class="description">
							<?php esc_html_e( 'It starts with user_ and it\'s in the welcome email StillOpen sent you, on the line with the code. Copy just the ID, not the whole line.', 'stillopen-front-desk' ); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button( __( 'Save', 'stillopen-front-desk' ) ); ?>
		</form>

		<hr />
		<h2><?php esc_html_e( 'Don\'t have a front desk yet?', 'stillopen-front-desk' ); ?></h2>
		<p style="max-width:640px">
			<?php
			printf(
				/* translators: %s: link to stillopen.ai */
				esc_html__( 'Start a free 14 day trial at %s. You give your website address, it reads your site, and your front desk knows your business before you finish signing up.', 'stillopen-front-desk' ),
				'<a href="https://stillopen.ai/" target="_blank" rel="noopener">stillopen.ai</a>'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Print the widget tag in the footer.
 *
 * One script tag, exactly the same one a hand install would paste. Nothing is
 * printed at all when no ID is saved, so an unconfigured plugin is inert.
 */
function stillopen_fd_print_widget() {
	$id = stillopen_fd_sanitize_id( get_option( STILLOPEN_FD_OPTION, '' ) );
	if ( '' === $id ) {
		return;
	}
	printf(
		'<script src="%1$s" data-plumber-id="%2$s"></script>' . "\n",
		esc_url( STILLOPEN_FD_SCRIPT ),
		esc_attr( $id )
	);
}
add_action( 'wp_footer', 'stillopen_fd_print_widget', 100 );

/**
 * Clean up the option on uninstall.
 */
function stillopen_fd_uninstall() {
	delete_option( STILLOPEN_FD_OPTION );
}
register_uninstall_hook( __FILE__, 'stillopen_fd_uninstall' );
