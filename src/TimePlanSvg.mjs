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
		console.error(new Vector2(
			source.width - source.style.border_main*2,
			source.height - source.style.border_main*2
		));
		result.addRectangle(
			new Vector2(source.style.border_main, source.style.border_main),
			new Vector2(
				source.width - source.style.border_main*2,
				source.height - source.style.border_main*2
			)
		)
	}
}

export default TimePlanSvg;
