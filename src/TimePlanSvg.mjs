"use strict";

import TOML from '@iarna/toml';

import SvgWriter from './helpers/SvgWriter.mjs';
import Vector2 from './helpers/Vector2.mjs';
import Rectangle from './helpers/Rectangle.mjs';

class TimePlanSvg {
	constructor() {
		
	}
	
	render(source_str) {
		let source = TOML.parse(source_str);
		if(typeof source.style == "undefined")
			source.style = {};
		
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
