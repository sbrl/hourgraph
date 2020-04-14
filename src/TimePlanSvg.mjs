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
		this.font_size_header = 16;
		this.font_size_normal = 14;
		
		this.css = `
.title { font: bolder ${this.font_size_title}px sans-serif; }
.normal { font: normal ${this.font_size_normal}px sans-serif; }
.header { font: bold ${this.font_size_header}px sans-serif; }
`;
		
		this.renderer = null;
	}
	
	apply_defaults(source) {
		let defaults = TOML.parse(this.default_toml);
		apply_settings(defaults, source);
		return defaults;
	}
	
	render(source_str) {
		let source = this.apply_defaults(TOML.parse(source_str));
		console.error(`Rendering for`, source);
		
		this.renderer = new SvgWriter(
			`${source.width}px`, `${source.height}px`,
			new Rectangle(0, 0, source.width, source.height),
			true // pretty print - true for debugging
		);
		
		
		this.chart_pos = new Vector2(
			source.style.margin_main + source.style.padding_main,
			source.style.margin_main + source.style.padding_main + this.font_size_title + source.style.margin_title_bottom,
		);
		this.chart_size = new Vector2(
			source.width - (source.style.margin_main*2 + source.style.padding_main*2),
			source.height - (source.style.margin_main*2 + source.style.padding_main*2 + this.font_size_title + source.style.margin_title_bottom)
		);
		
		this.task_height = this.font_size_normal + source.style.padding_task*2;
		this.chart_header_height = this.font_size_header + source.style.padding_header*2;
		this.width_sidebar = this.chart_size.x * source.style.width_sidebar;
		
		this.chart_cell_count = source.task.reduce((prev, next) => Math.max(prev, next.start + next.duration), 0);
		this.chart_graph_size = this.chart_size.clone().subtract(new Vector2(
			this.width_sidebar,
			this.chart_header_height
		));
		this.chart_cell_size = new Vector2(
			this.chart_graph_size.x / this.chart_cell_count,
			this.task_height
		);
		
		this.render_skeleton(source);
		this.render_chart_header(source);
		
		let i = 0;
		for(let task of source.task) {
			this.render_task(source, task, i);
			i++;
		}
		
		this.renderer.addRectangle(this.chart_pos, this.chart_size, "#ffcc00");
		
		// this.draw_debug(this.chart_pos);
		
		this.renderer.complete();
		return this.renderer.toString();
	}
	
	render_skeleton(source) {
		this.renderer.addCSS(this.css);
		
		this.renderer.addRectangle(
			new Vector2(source.style.margin_main, source.style.margin_main),
			new Vector2(
				source.width - source.style.margin_main*2,
				source.height - source.style.margin_main*2
			),
			source.style.border_main_colour,
			source.style.border_main_width
		);
		let text_offset = source.style.margin_main + source.style.padding_main;
		this.renderer.addText(
			// The origin of text is the bottom left, apparently
			new Vector2(text_offset, text_offset + this.font_size_title),
			source.title,
			"title"
		);
		
		// this.draw_debug(new Vector2(text_offset, text_offset));
	}
	
	render_chart_header(source) {
		this.renderer.addRectangle(
			this.chart_pos,
			new Vector2(this.width_sidebar / 2, this.chart_header_height),
			"none", 0,
			source.style.bg_sidebar_colour
		);
		
		let header_inner_pos = this.chart_pos.clone().add(new Vector2(
			source.style.padding_header,
			source.style.padding_header
		));
		
		this.renderer.addText(
			header_inner_pos.clone().add(new Vector2(0, this.font_size_header)),
			"Task",
			"header"
		);
		
		// Time interval bg
		let sidebar_right_start = this.chart_pos.clone().add(new Vector2(this.width_sidebar / 2, 0));
		this.renderer.addRectangle(
			sidebar_right_start,
			new Vector2(this.width_sidebar / 2, this.chart_header_height),
			"none", 0,
			source.style.bg_sidebar_right_colour
		);
		
		// Time interval text
		this.renderer.addText(
			sidebar_right_start.clone().add(new Vector2(source.style.padding_header, source.style.padding_header + this.font_size_header)),
			source.time_interval,
			"header"
		)
		
		// Cell text background
		this.renderer.addRectangle(
			this.chart_pos.clone().add(new Vector2(this.width_sidebar, 0)),
			new Vector2(this.chart_size.x - this.width_sidebar, this.chart_header_height),
			"none", 0,
			source.style.bg_header_cells_colour
		);
		
		let divider_start = this.chart_pos.clone().add(new Vector2(this.width_sidebar, 0));
		this.renderer.addLine(
			divider_start,
			divider_start.clone().add(new Vector2(0, this.chart_size.y)),
			source.style.divider_sidebar_colour,
			source.style.divider_sidebar_width
		);
		
		let next_pos = header_inner_pos.clone().add(new Vector2(
			source.style.padding_cell_x + this.width_sidebar,
			this.font_size_header
		));
		for(let i = 0; i < this.chart_cell_count; i++) {
			if(i > 0) {
				let line_start = new Vector2(
					this.chart_pos.x + this.width_sidebar + this.chart_cell_size.x*i,
					this.chart_pos.y
				);
				let is_minor = i % source.style.divider_major_interval == 0;
				this.renderer.addLine(
					line_start,
					line_start.clone().add(new Vector2(0, this.chart_size.y)),
					is_minor ? source.style.divider_major_colour : source.style.divider_minor_colour,
					is_minor ? source.style.divider_major_width : source.style.divider_minor_width
				);
			}
			
			this.renderer.addText(
				next_pos,
				`${i + source.time_label_offset}`,
				"header"
			);
			
			next_pos.x += this.chart_cell_size.x;
		}
	}
	
	render_task(source, task, index) {
		// Relative to this.chart_pos.y
		let offset_y = this.task_height * index + this.chart_header_height;
		
		// Background
		this.renderer.addRectangle(
			this.chart_pos.clone().add(new Vector2(0, offset_y)),
			new Vector2(this.width_sidebar, this.task_height),
			"none", 0,
			index % 2 == 0 ? source.style.bg_task_colour : source.style.bg_task_colour_alternate
		);
		
		// Task name
		this.renderer.addText(
			this.chart_pos.clone().add(new Vector2(
				source.style.padding_task,
				source.style.padding_task + this.font_size_normal + offset_y
			)),
			task.name,
			"normal"
		);
		
		let bar_start = this.chart_pos.clone().add(new Vector2(
			this.width_sidebar + task.start * this.chart_cell_size.x,
			offset_y
		));
		let bar_offset = (this.task_height - this.task_height * source.style.task_bar_height) / 2;
		bar_start.y += bar_offset;
		
		// Bar
		this.renderer.addRectangle(
			bar_start,
			new Vector2(
				task.duration * this.chart_cell_size.x,
				this.task_height * source.style.task_bar_height
			),
			source.style.task_bar_border_colour,
			source.style.task_bar_border_width,
			task.colour || source.style.task_bar_colour
		);
		
		// Ghost bar
		let ghost_start = this.chart_pos.clone().add(new Vector2(
			this.width_sidebar,
			offset_y
		));
		ghost_start.y += bar_offset;
		
		this.renderer.addRectangle(
			ghost_start,
			new Vector2(
				task.start * this.chart_cell_size.x,
				this.task_height * source.style.task_bar_ghost_height
			),
			source.style.task_bar_ghost_border_colour,
			source.style.task_bar_ghost_border_width,
			task.ghost_colour || source.style.task_bar_ghost_colour
		);
	}
	
	draw_debug(pos) {
		this.renderer.addRectangle(
			pos,
			new Vector2(5, 5),
			"none", 0, "blue"
		);
	}
}

export default TimePlanSvg;
