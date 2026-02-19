<?php
/**
 * WordPress Abilities API integration for GreenShift.
 * Requires WordPress 6.9+.
 *
 * @package greenshift-animation-and-page-builder-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Backward compatibility: skip if Abilities API is not available.
if ( ! class_exists( 'WP_Ability' ) ) {
	return;
}

/**
 * Register the GreenShift ability category.
 */
add_action( 'wp_abilities_api_categories_init', 'gspb_register_ability_category' );
function gspb_register_ability_category( $registry ) {
	wp_register_ability_category( 'greenshift', array(
		'label'       => __( 'GreenShift', 'greenshift-animation-and-page-builder-blocks' ),
		'description' => __( 'Design abilities provided by GreenShift – preset colors, element styles, custom colors, classes, and CSS variables.', 'greenshift-animation-and-page-builder-blocks' ),
	) );
}

/**
 * Register all GreenShift abilities.
 */
add_action( 'wp_abilities_api_init', 'gspb_register_abilities' );
function gspb_register_abilities( $registry ) {

	// ── 1. Preset Colors ────────────────────────────────────────────────

	wp_register_ability( 'greenshift/get-preset-colors', array(
		'label'               => __( 'Get Preset Colors', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Retrieves the GreenShift global preset color palette.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Key-value map of color names to color values (hex/rgb).',
		),
		'execute_callback'    => 'gspb_ability_get_preset_colors',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'readonly'   => true,
				'idempotent' => true,
			),
		),
	) );

	wp_register_ability( 'greenshift/update-preset-colors', array(
		'label'               => __( 'Update Preset Colors', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Merges new colors into the GreenShift global preset color palette.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'input_schema'        => array(
			'type'       => 'object',
			'properties' => array(
				'colors' => array(
					'type'        => 'object',
					'description' => 'Key-value map of color name to color value to set or merge.',
				),
			),
			'required'   => array( 'colors' ),
		),
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Operation result with success flag and updated colors.',
		),
		'execute_callback'    => 'gspb_ability_update_preset_colors',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'idempotent' => true,
			),
		),
	) );

	// ── 2. Element Styles ───────────────────────────────────────────────

	wp_register_ability( 'greenshift/get-element-styles', array(
		'label'               => __( 'Get Element Styles', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Retrieves the GreenShift global element style definitions.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'output_schema'       => array(
			'type'        => 'array',
			'description' => 'Array of element style definitions.',
		),
		'execute_callback'    => 'gspb_ability_get_element_styles',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'readonly'   => true,
				'idempotent' => true,
			),
		),
	) );

	wp_register_ability( 'greenshift/update-element-styles', array(
		'label'               => __( 'Update Element Styles', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Replaces the GreenShift global element style definitions.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'input_schema'        => array(
			'type'       => 'object',
			'properties' => array(
				'elements' => array(
					'type'        => 'array',
					'description' => 'Array of element style definitions to save.',
				),
			),
			'required'   => array( 'elements' ),
		),
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Operation result with success flag.',
		),
		'execute_callback'    => 'gspb_ability_update_element_styles',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'idempotent' => true,
			),
		),
	) );

	// ── 3. Custom Colors (WP Global Theme Palette) ──────────────────────

	wp_register_ability( 'greenshift/get-custom-colors', array(
		'label'               => __( 'Get Custom Colors', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Retrieves the WordPress global theme color palette.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'output_schema'       => array(
			'type'        => 'array',
			'description' => 'Array of theme color palette entries with name, slug, and color.',
		),
		'execute_callback'    => 'gspb_ability_get_custom_colors',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'readonly'   => true,
				'idempotent' => true,
			),
		),
	) );

	wp_register_ability( 'greenshift/add-custom-colors', array(
		'label'               => __( 'Add Custom Colors', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Adds or updates colors in the WordPress global theme color palette.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'input_schema'        => array(
			'type'       => 'object',
			'properties' => array(
				'colors' => array(
					'type'        => 'array',
					'description' => 'Array of color entries to add.',
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'name'  => array(
								'type'        => 'string',
								'description' => 'Human-readable color name.',
							),
							'slug'  => array(
								'type'        => 'string',
								'description' => 'URL-safe slug for the color.',
							),
							'color' => array(
								'type'        => 'string',
								'description' => 'CSS color value.',
							),
						),
						'required'   => array( 'name', 'slug', 'color' ),
					),
				),
			),
			'required'   => array( 'colors' ),
		),
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Operation result with success flag.',
		),
		'execute_callback'    => 'gspb_ability_add_custom_colors',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'idempotent' => true,
			),
		),
	) );

	// ── 4. Custom Classes ───────────────────────────────────────────────

	wp_register_ability( 'greenshift/get-custom-classes', array(
		'label'               => __( 'Get Custom Classes', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Retrieves the GreenShift global custom CSS classes.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'output_schema'       => array(
			'type'        => 'array',
			'description' => 'Array of custom class definitions.',
		),
		'execute_callback'    => 'gspb_ability_get_custom_classes',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'readonly'   => true,
				'idempotent' => true,
			),
		),
	) );

	wp_register_ability( 'greenshift/add-custom-classes', array(
		'label'               => __( 'Add Custom Classes', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Adds or updates GreenShift global custom CSS classes.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'input_schema'        => array(
			'type'       => 'object',
			'properties' => array(
				'classes' => array(
					'type'        => 'array',
					'description' => 'Array of class objects. "value" (class name) and "type" are required. Provide "css" with raw CSS rules for the class, "selectors" for sub-selector styles (e.g. hover, child elements), and "attributes" for stored block attributes.',
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'value' => array(
								'type'        => 'string',
								'description' => 'CSS class name (e.g. "my-custom-class").',
							),
							'type' => array(
								'type'        => 'string',
								'description' => 'Class origin type: "global" (synced across site), "local" (page-scoped), "component" (reusable component), "classic" (plain className), or "custom" (framework class).',
							),
							'label' => array(
								'type'        => 'string',
								'description' => 'Human-readable label for the class (defaults to value).',
							),
							'css' => array(
								'type'        => 'string',
								'description' => 'Raw CSS rules for the class selector (e.g. "color: red; font-size: 16px;").',
							),
							'attributes' => array(
								'type'        => 'object',
								'description' => 'Stored block style attributes object for the class.',
							),
							'selectors' => array(
								'type'        => 'array',
								'description' => 'Array of sub-selector objects, each with "value" (CSS selector suffix like ":hover", " a", " .child"), "css" (rules for that selector), and optional "attributes".',
							),
						),
						'required'   => array( 'value' ),
					),
				),
			),
			'required'   => array( 'classes' ),
		),
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Operation result with success flag.',
		),
		'execute_callback'    => 'gspb_ability_add_custom_classes',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'idempotent' => true,
			),
		),
	) );

	// ── 5. Custom CSS Variables ─────────────────────────────────────────

	wp_register_ability( 'greenshift/get-custom-variables', array(
		'label'               => __( 'Get Custom CSS Variables', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Retrieves the GreenShift global custom CSS code (may contain CSS variables).', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Object containing the custom_css string.',
		),
		'execute_callback'    => 'gspb_ability_get_custom_variables',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'readonly'   => true,
				'idempotent' => true,
			),
		),
	) );

	wp_register_ability( 'greenshift/update-custom-variables', array(
		'label'               => __( 'Update Custom CSS Variables', 'greenshift-animation-and-page-builder-blocks' ),
		'description'         => __( 'Updates the GreenShift global custom CSS code.', 'greenshift-animation-and-page-builder-blocks' ),
		'category'            => 'greenshift',
		'input_schema'        => array(
			'type'       => 'object',
			'properties' => array(
				'custom_css' => array(
					'type'        => 'string',
					'description' => 'Full custom CSS string to save.',
				),
			),
			'required'   => array( 'custom_css' ),
		),
		'output_schema'       => array(
			'type'        => 'object',
			'description' => 'Operation result with success flag.',
		),
		'execute_callback'    => 'gspb_ability_update_custom_variables',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'meta'                => array(
			'show_in_rest' => true,
			'annotations'  => array(
				'idempotent' => true,
			),
		),
	) );
}


// =====================================================================
// Execute Callbacks
// =====================================================================

/**
 * Get preset colors from gspb_global_settings.
 */
function gspb_ability_get_preset_colors() {
	$settings = get_option( 'gspb_global_settings' );
	$colours  = ! empty( $settings['colours'] ) ? $settings['colours'] : '{}';

	if ( is_string( $colours ) ) {
		$colours = json_decode( $colours, true );
	}

	return is_array( $colours ) ? $colours : array();
}

/**
 * Update preset colors – merges into existing palette.
 */
function gspb_ability_update_preset_colors( $input ) {
	$settings = get_option( 'gspb_global_settings' );
	if ( ! is_array( $settings ) ) {
		$settings = array();
	}

	$existing = ! empty( $settings['colours'] ) ? $settings['colours'] : '{}';
	if ( is_string( $existing ) ) {
		$existing = json_decode( $existing, true );
	}
	if ( ! is_array( $existing ) ) {
		$existing = array();
	}

	foreach ( $input['colors'] as $name => $value ) {
		$existing[ sanitize_text_field( $name ) ] = sanitize_text_field( $value );
	}

	$settings['colours'] = wp_json_encode( $existing );
	update_option( 'gspb_global_settings', $settings );

	return array(
		'success' => true,
		'colors'  => $existing,
	);
}

/**
 * Get element styles from gspb_global_settings.
 */
function gspb_ability_get_element_styles() {
	$settings = get_option( 'gspb_global_settings' );
	$elements = ! empty( $settings['elements'] ) ? $settings['elements'] : '[]';

	if ( is_string( $elements ) ) {
		$elements = json_decode( $elements, true );
	}

	return is_array( $elements ) ? $elements : array();
}

/**
 * Update element styles – replaces the full list.
 */
function gspb_ability_update_element_styles( $input ) {
	$settings = get_option( 'gspb_global_settings' );
	if ( ! is_array( $settings ) ) {
		$settings = array();
	}

	$settings['elements'] = wp_json_encode( $input['elements'] );
	update_option( 'gspb_global_settings', $settings );

	return array( 'success' => true );
}

/**
 * Get custom colors from the WP global theme palette.
 */
function gspb_ability_get_custom_colors() {
	$global   = wp_get_global_settings();
	$palette  = ! empty( $global['color']['palette']['theme'] ) ? $global['color']['palette']['theme'] : array();

	return $palette;
}

/**
 * Add custom colors to the WP global theme palette.
 * Reuses the same wp_global_styles storage logic as gspb_update_global_wp_settings().
 */
function gspb_ability_add_custom_colors( $input ) {
	$global  = wp_get_global_settings();
	$palette = ! empty( $global['color']['palette']['theme'] ) ? $global['color']['palette']['theme'] : array();

	// Build slug index for dedup.
	$slug_map = array();
	foreach ( $palette as $idx => $entry ) {
		if ( ! empty( $entry['slug'] ) ) {
			$slug_map[ $entry['slug'] ] = $idx;
		}
	}

	foreach ( $input['colors'] as $color ) {
		$slug  = sanitize_title( $color['slug'] );
		$entry = array(
			'name'  => sanitize_text_field( $color['name'] ),
			'slug'  => $slug,
			'color' => sanitize_text_field( $color['color'] ),
		);

		if ( isset( $slug_map[ $slug ] ) ) {
			$palette[ $slug_map[ $slug ] ] = $entry;
		} else {
			$palette[]          = $entry;
			$slug_map[ $slug ]  = count( $palette ) - 1;
		}
	}

	// Persist to wp_global_styles post (same approach as init.php).
	$theme = wp_get_theme();
	if ( $theme->parent_theme ) {
		$template_dir = basename( get_template_directory() );
		$theme        = wp_get_theme( $template_dir );
	}
	$themename = $theme->get( 'TextDomain' );

	$post_type    = 'wp_global_styles';
	$post_name    = 'wp-global-styles-' . $themename;
	$styles_obj   = get_page_by_path( $post_name, OBJECT, $post_type );
	$styles_id    = is_object( $styles_obj ) ? $styles_obj->ID : 0;

	if ( $styles_id ) {
		$content = json_decode( $styles_obj->post_content, true );
		if ( empty( $content ) ) {
			$content = array();
		}
		$content['settings']['color']['palette']['theme'] = $palette;
		$content['isGlobalStylesUserThemeJSON']            = true;
		$content['version']                                = 3;

		wp_update_post( array(
			'ID'           => $styles_id,
			'post_name'    => $post_name,
			'post_status'  => 'publish',
			'post_title'   => $styles_obj->post_title,
			'post_content' => wp_slash( wp_json_encode( $content ) ),
		) );
	} else {
		$content = array(
			'settings' => array(
				'color' => array(
					'palette' => array(
						'theme' => $palette,
					),
				),
			),
			'isGlobalStylesUserThemeJSON' => true,
			'version'                     => 3,
		);

		wp_insert_post( array(
			'post_content' => wp_slash( wp_json_encode( $content ) ),
			'post_status'  => 'publish',
			'post_type'    => $post_type,
			'post_name'    => $post_name,
			'post_title'   => 'Custom Styles',
		) );
	}

	return array(
		'success' => true,
		'palette' => $palette,
	);
}

/**
 * Get custom classes.
 */
function gspb_ability_get_custom_classes() {
	$classes = get_option( 'greenshift_global_classes' );

	return is_array( $classes ) ? $classes : array();
}

/**
 * Add / update custom classes – merges by "value" key.
 */
function gspb_ability_add_custom_classes( $input ) {
	$existing = get_option( 'greenshift_global_classes' );
	if ( ! is_array( $existing ) ) {
		$existing = array();
	}

	$value_map = array();
	foreach ( $existing as $idx => $cls ) {
		if ( ! empty( $cls['value'] ) ) {
			$value_map[ $cls['value'] ] = $idx;
		}
	}

	foreach ( $input['classes'] as $cls ) {
		if ( empty( $cls['value'] ) ) {
			continue;
		}
		$cls['value'] = sanitize_text_field( $cls['value'] );

		if ( isset( $value_map[ $cls['value'] ] ) ) {
			$existing[ $value_map[ $cls['value'] ] ] = $cls;
		} else {
			$existing[]                        = $cls;
			$value_map[ $cls['value'] ]        = count( $existing ) - 1;
		}
	}

	update_option( 'greenshift_global_classes', $existing );

	return array(
		'success' => true,
		'classes' => $existing,
	);
}

/**
 * Get custom CSS variables / code.
 */
function gspb_ability_get_custom_variables() {
	$settings   = get_option( 'gspb_global_settings' );
	$custom_css = ! empty( $settings['custom_css'] ) ? $settings['custom_css'] : '';

	return array( 'custom_css' => $custom_css );
}

/**
 * Update custom CSS variables / code.
 */
function gspb_ability_update_custom_variables( $input ) {
	$settings = get_option( 'gspb_global_settings' );
	if ( ! is_array( $settings ) ) {
		$settings = array();
	}

	$settings['custom_css'] = $input['custom_css'];
	update_option( 'gspb_global_settings', $settings );

	return array( 'success' => true );
}
