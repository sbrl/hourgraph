"use strict";

import chroma from 'chroma-js';

function colour_normalise(str) {
	// none is an svg special as far as I can tell
	if(str == "none")
		return str;
	// let rgba = chroma(str).rgba();
	// return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
	return chroma(str).hex();
}

/**
 * Converts a colour to a set of style rules.
 * @param	{string}	str				The colour spec to convert.
 * @param	{String}	[mode="fill"]	The mode to run in - e.g. fill or stroke
 * @return	{string}	The set of style rules.
 */
function colour2style(str, mode="fill") {
	if(str == "none")
		return `${mode}: none; ${mode}-opacity: 0;`;
	
	let rgba = chroma(str).rgba();
	return `${mode}: rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]}); ${mode}-opacity: ${rgba[3].toFixed(3)};`;
}

export { colour_normalise, colour2style };
