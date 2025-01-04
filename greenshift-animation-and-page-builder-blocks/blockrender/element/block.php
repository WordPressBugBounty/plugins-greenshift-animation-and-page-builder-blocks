<?php

namespace greenshiftaddon\Blocks;

defined('ABSPATH') or exit;


class Element
{

	public function __construct()
	{
		add_action('init', array($this, 'init_handler'));
	}

	public function init_handler()
	{
		register_block_type(
			__DIR__,
			array(
				'render_callback' => array($this, 'render_block'),
			)
		);
	}


	public function render_block($settings, $inner_content, $block)
	{
		$block = (is_array($block)) ? $block : $block->parsed_block;
		$html = $inner_content;

		if(!empty($block['attrs']['styleAttributes']['hideOnFrontend_Extra'])){
			if(!is_admin()){
				return '';
			}
		}

		if (!empty($block['attrs']['localStyles']['background']['lazy'])) {
			wp_enqueue_script('greenshift-inview-bg');
		}
		if (!empty($block['attrs']['customCursor'])) {
			wp_enqueue_script('cursor-follow');
		}
		if (!empty($block['attrs']['cursorEffect'])) {
			wp_enqueue_script('cursor-shift');
		}
		if(!empty($block['attrs']['styleAttributes']['animationTimeline'])){
			wp_enqueue_script('scroll-view-polyfill');
		}
		if(!empty($block['attrs']['styleAttributes']['anchorName'])){
			wp_enqueue_script('anchor-polyfill');
		}
		if (isset($block['attrs']['tag']) && $block['attrs']['tag'] == 'table' && (!empty($block['attrs']['tableAttributes']['table']['sortable']) || !empty($block['attrs']['tableStyles']['table']['style']))) {
			wp_enqueue_script('gstablesort');
		}

		if (!empty($block['attrs']['type']) && $block['attrs']['type'] == 'repeater') {
			//Generate dynamic repeater
			// Extract content between <repeater> tags
			$pattern = '/<repeater>(.*?)<\/repeater>/s';
			if (preg_match($pattern, $html, $matches)) {
				$repeater = $matches[1];
				
				// Generate dynamic repeater content
				$generated_content = GSPB_generate_dynamic_repeater($repeater, $block);
				
				// Replace the <repeater> tags and their content with the generated content
				$html = preg_replace($pattern, $generated_content, $html);
			}
		}
		if(!empty($block['attrs']['isVariation'])){
			if($block['attrs']['isVariation'] == 'marquee'){
				$pattern = '/<div class="gspb_marquee_content">(.*?)<span class="gspb_marquee_content_end"><\/span><\/div>/s';
				$html = preg_replace_callback($pattern, function ($matches) {
					// Original div
					$originalDiv = '<div class="gspb_marquee_content">'.$matches[1].'</div>';
					
					// Duplicated div with aria-hidden="true"
					$duplicatedDiv = '<div class="gspb_marquee_content" aria-hidden="true">'.$matches[1].'</div>';
				
					// Return original and duplicated div
					return $originalDiv . $duplicatedDiv;
				}, $html);
			}else if($block['attrs']['isVariation'] == 'counter'){
				wp_enqueue_script('gs-lightcounter');
			}else if($block['attrs']['isVariation'] == 'countdown'){
				wp_enqueue_script('gs-lightcountdown');
			}else if($block['attrs']['isVariation'] == 'draggable'){
				wp_enqueue_script('greenshift-drag-init');
				if(!empty($block['attrs']['enableScrollButtons'])){
					wp_enqueue_script('greenShift-scrollable-init');
				}
			}
		}
		if(!empty($block['attrs']['enableTooltip'])){
			wp_enqueue_script('gs-lighttooltip');
		}
		if(!empty($block['attrs']['textAnimated'])){
			wp_enqueue_script('gs-textanimate');
		}
		if (function_exists('GSPB_make_dynamic_text')) {
			if(!empty($block['attrs']['dynamictext']['dynamicEnable']) && !empty($block['attrs']['textContent'])){
				$html = GSPB_make_dynamic_text($html, $block['attrs'], $block, $block['attrs']['dynamictext'], $block['attrs']['textContent']);
				if(!empty($block['attrs']['splitText'])){
					//ensure to split also dynamic text
					$type = !empty($block['attrs']['splitTextType']) ? $block['attrs']['splitTextType'] : 'words';
					$html = greenshift_split_dynamic_text($html, $type);
				}
			}
			if(!empty($block['attrs']['dynamiclink']['dynamicEnable'])){
				if(isset($block['attrs']['tag']) && ($block['attrs']['tag'] == 'img' || $block['attrs']['tag'] == 'video')){
					$src = !empty($block['attrs']['src']) ? $block['attrs']['src'] : '';
					$p = new \WP_HTML_Tag_Processor( $html );
					$p->next_tag();
					$value = GSPB_make_dynamic_text($src, $block['attrs'], $block, $block['attrs']['dynamiclink']);
					if($value){
						if($block['attrs']['tag'] == 'video'){
							$p->next_tag();
						}
						$p->set_attribute( 'src', $value);
						if(!empty($block['attrs']['enableSrcSet'])){
							$id = attachment_url_to_postid($value);
							if($id && $id > 0){
								$size = 'full';
								if(!empty($block['attrs']['dynamiclink']['dynamicPostImageSize'])){
									$size = esc_attr($block['attrs']['dynamiclink']['dynamicPostImageSize']);
								}
								$srcset = wp_get_attachment_image_srcset($id, $size);
								if($srcset){
									$p->set_attribute( 'srcset', $srcset);
								}
							}
						}
						$html = $p->get_updated_html();
					}else{
						return '';
					}
				}else if(isset($block['attrs']['tag']) && $block['attrs']['tag'] == 'a'){
					$p = new \WP_HTML_Tag_Processor( $html );
					$p->next_tag();
					$value = GSPB_make_dynamic_text($block['attrs']['href'], $block['attrs'], $block, $block['attrs']['dynamiclink']);
					if($value){
						$p->set_attribute( 'href', $value);
						$html = $p->get_updated_html();
					}else{
						return '';
					}
				}
			}
			if(!empty($block['attrs']['dynamicextra']['dynamicEnable'])){
				if($block['attrs']['tag'] == 'video'){
					$p = new \WP_HTML_Tag_Processor( $html );
					$p->next_tag();
					$value = GSPB_make_dynamic_text($block['attrs']['poster'], $block['attrs'], $block, $block['attrs']['dynamiclink']);
					if($value){
						$p->set_attribute( 'poster', $value);
						$html = $p->get_updated_html();
					}else{
						return '';
					}
				}
			}
		}
		if(!empty($block['attrs']['dynamicAttributes'])){
			$dynamicAttributes = [];
			foreach($block['attrs']['dynamicAttributes'] as $index=>$value){
				$dynamicAttributes[$index] = $value;
				if(!empty($value['dynamicEnable']) && function_exists('GSPB_make_dynamic_text')){
					$dynamicAttributes[$index]['value'] = GSPB_make_dynamic_text($dynamicAttributes[$index]['value'], $block['attrs'], $block, $value);
				}else{
					$dynamicAttributes[$index]['value'] = sanitize_text_field($value['value']);
					if(strpos($value['name'], 'on') === 0){
						$dynamicAttributes[$index]['value'] = '';
					}
				}
			}
			if(!empty($dynamicAttributes)){
				$p = new \WP_HTML_Tag_Processor( $html );
				foreach($dynamicAttributes as $index=>$value){
					$p->next_tag();
					$p->set_attribute( $value['name'], $value['value']);
				}
				$html = $p->get_updated_html();
			}
		}
		if(!empty($block['attrs']['isVariation']) && ($block['attrs']['isVariation'] == 'accordion' || $block['attrs']['isVariation'] == 'tabs')){

			wp_enqueue_script('gs-greensyncpanels');

			$p = new \WP_HTML_Tag_Processor( $html );
			$itrigger = 0;
			while ( $p->next_tag() ) {
				// Skip an element if it's not supposed to be processed.
				if ( method_exists('WP_HTML_Tag_Processor', 'has_class') && ($p->has_class( 'gs_click_sync' ) || $p->has_class( 'gs_hover_sync' )) ) {
					$p->set_attribute( 'id', 'gs-trigger-'.$block['attrs']['id'].'-'.$itrigger);
					$p->set_attribute( 'aria-controls', 'gs-content-'.$block['attrs']['id'].'-'.$itrigger);
					$itrigger ++;
				}
			}
			$html = $p->get_updated_html();

			$p = new \WP_HTML_Tag_Processor( $html );
			$icontent = 0;
			while ( $p->next_tag() ) {
				// Skip an element if it's not supposed to be processed.
				if ( method_exists('WP_HTML_Tag_Processor', 'has_class') && ($p->has_class( 'gs_content' )) ) {
					$p->set_attribute( 'id', 'gs-content-'.$block['attrs']['id'].'-'.$icontent);
					$p->set_attribute( 'aria-labelledby', 'gs-trigger-'.$block['attrs']['id'].'-'.$icontent);
					$icontent ++;
				}
			}
			$html = $p->get_updated_html();
		}

		if(!empty($block['attrs']['anchor']) && strpos($block['attrs']['anchor'], '{POST_ID}') != false){
			global $post;
			$post_id = $post->ID;
			$anchor = str_replace('{POST_ID}', $post_id, $block['attrs']['anchor']);
			$p = new \WP_HTML_Tag_Processor( $html );
			$p->next_tag();
			$p->set_attribute( 'id', $anchor);
			$html = $p->get_updated_html();
		}

		return $html;
	}
}

new Element;
