"use strict";

import TOML from '@iarna/toml';

import SvgWriter from './helpers/SvgWriter.mjs';
import Vector2 from './helpers/Vector2.mjs';
import Rectangle from './helpers/Rectangle.mjs';
import apply_settings from './helpers/ApplySettings.mjs';

/**
 * Renders a time plan as an SVG.
 * @param	default_toml	{string}	The string of default TOML to apply. This should come from default.toml in this directory, but this isn't done automatically in order to keep the generator itself environment-agnostic.
 */
class TimePlanSvg {
	constructor(default_toml = null) {
		if(default_toml == null)
			throw new Error("Error: No default TOML string passed.");
		
		// Note that we store this as a string here 'cause we might need multiple independent copies if we're parsing more than 1 source string
		this.default_toml = default_toml;
		
		this.font_size_title = 22;
		this.font_size_normal = 14;
		
		this.css = `
.title { font: bold ${this.font_size_title}px sans-serif; }
.normal { font: normal ${this.font_size_normal}px sans-serif; }
`;
	}
	
	apply_defaults(source) {
		let defaults = TOML.parse(this.default_toml);
		apply_settings(defaults, source);
		return defaults;
	}
	
	render(source_str) {
		let source = this.apply_defaults(TOML.parse(source_str));
		console.error(`Rendering for`, source);
		
		let result = new SvgWriter(
			`${source.width}px`, `${source.height}px`,
			new Rectangle(0, 0, source.width, source.height),
			true // pretty print - true for debugging
		);
		
		this.render_skeleton(source, result);
		
		result.complete();
		return result.toString();
	}
	
	render_skeleton(source, result) {
		result.addCSS(this.css);
		
		result.addRectangle(
			new Vector2(source.style.margin_main, source.style.margin_main),
			new Vector2(
				source.width - source.style.margin_main*2,
				source.height - source.style.margin_main*2
			)
		);
		let text_offset = source.style.margin_main + source.style.padding_main;
		result.addText(
			// The origin of text is the bottom left, apparently
			new Vector2(text_offset, text_offset + this.font_size_title),
			source.title,
			"title"
		);
		// result.addRectangle(
		// 	new Vector2(text_offset, text_offset),
		// 	new Vector2(5, 5),
		// 	"red", 0, "blue"
		// );
	}
}

export default TimePlanSvg;
