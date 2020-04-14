"use strict";

/**
 * Recursively overwrites 1 settings object with another.
 * Ported from PHP: https://gist.github.com/00f1b9b1fd6ca0610b780587f11ede4e#file-applysettings-php
 * @param  {object} def    The default settings object to overwrite.
 * @param  {object} custom The settings to use when overwriting.
 */
function apply_settings(def, custom) {
    // Loop over each of the custom settings
    for(let key in custom) {
        // If the property isn't an object, then it's probably a setting
        // We should overwrite the existing default setting with the custom one.
        if(typeof custom[key] != "object")
            def[key] = custom[key];
        else // It's an object! We should recurse over it.
            apply_settings(def[key], custom[key]);
    }
}

export default apply_settings;
