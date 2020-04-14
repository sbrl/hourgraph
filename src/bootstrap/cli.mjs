"use strict";

import path from 'path';
import fs from 'fs';

import CliParser from 'applause-cli';

import a from '../helpers/Ansi.mjs';
import TimePlanSvg from '../TimePlanSvg.mjs';


// HACK: Make sure __dirname is defined when using es6 modules. I forget where I found this - a PR with a source URL would be great :D
const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));
 
// Locate your package.json - this assumes it's sitting in the same directory as this file
const package_json_filepath = path.resolve(__dirname, "../../package.json");

export default async function() {
	// Create a new CLI parser
	// The name description, version number, etc are all populated from there
	const cli = new CliParser(package_json_filepath);
	
	cli.argument("input", "The input file to read from (set to - to read from stdin)", "-", "string")
        .argument("output", "The output file to write to (set to - to write to stdout)", "-", "string");
	
    let args = cli.parse(process.argv.slice(2));
    
    let input = null;
    switch(args.input) {
        case "-":
            input = await fs.promises.readFile(0, "utf-8");
            break;
        default:
            if(!fs.existsSync(args.input))
                break;
            input = await fs.promises.readFile(args.input, "utf-8");
            break;
    }
    if(input == null) {
        console.log(`${a.fred}${a.hicol}Error: Failed to read the input file (does it exist and do we have permission to read it?).${a.reset}`);
        process.exit(1);
    }
    
    let renderer = new TimePlanSvg(
        await fs.promises.readFile(path.resolve(__dirname, "../default.toml"), "utf-8")
    );
    let output = renderer.render(input);
    
    if(typeof output != "string") {
        console.log(`${a.fred}${a.hicol}Error: Oops! Looks like something went wrong when rendering the time plan (there's probably additional output above).${a.reset}`);
        process.exit(2);
    }
    
    switch(args.output) {
        case "-":
            console.log(output);
            break;
        default:
            await fs.promises.writeFile(args.output, output);
            console.error(`${a.fgreen}${a.hicol}Output written to ${args.output}${a.reset}`);
            break;
    }
}
 
