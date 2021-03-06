"use strict";

/**
 * Recursively overwrites 1 settings object with another.
 * Ported from PHP: https://gist.github.com/00f1b9b1fd6ca0610b780587f11ede4e#file-applysettings-php
 * @param  {object} def    The default settings object to overwrite.
 * @param  {object} custom The settings to use when overwriting.
 */
function apply_settings(def, custom) {
	// If the default doesn't exist, then return the custom
	if(typeof def == "undefined")
		return custom;
	
    // Loop over each of the custom settings
    for(let key in custom) {
		// If the property isn't an object, then it's probably a setting
        // We should overwrite the existing default setting with the custom one.
        if(typeof custom[key] != "object" || typeof def[key] == "undefined")
            def[key] = custom[key];
		else // It's an object! We should recurse over it - but only if then default equivalent also exists.
            apply_settings(def[key], custom[key]);
    }
}

export default apply_settings;
