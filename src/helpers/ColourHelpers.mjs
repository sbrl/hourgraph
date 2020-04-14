"use strict";

import chroma from 'chroma-js';

function colour_normalise(str) {
	// none is an svg special as far as I can tell
	if(str == "none")
		return str;
	let rgba = chroma(str).rgba();
	return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
}

export { colour_normalise };
