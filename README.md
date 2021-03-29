# hourgraph
> Creates an SVG from a TOML definition of a time plan / gantt chart

Originally written for my PhD panel 1 topic project analysis report, as I realised that not only have I manually creates a number of these, but I'm going to have to create a bunch more in the future....

 - **Current version:** ![current npm version - see the GitHub releases](https://img.shields.io/npm/v/terrain50-cli)
 - **Changelog:** https://github.com/sbrl/hourgraph/blob/master/Changelog.md


## Installation
Install with `npm`:

```bash
sudo npm install --global hourgraph
```

Or locally:

```bash
npm install hourgraph
```


## Usage
There are 2 parts to using _hourgraph_. First, you need a configuration / definition file for your time plan / gantt chart. Then, you need to call the CLI to render it to SVG (PNG is currently _not_ supported, but Inkscape can be used to convert - see below).

### Definition file
_hourgraph_ takes a [TOML file](https://github.com/toml-lang/toml) as input. Examples files can be found in the [examples directory](https://github.com/sbrl/hourgraph/tree/master/examples). In short, the format of a valid time plan file is as follows:

```toml
# Specify global options here
width = 1920
height = 1080

# Tasks are defined next. Each should be headed with "[[task]]" like so:
[[task]]
name = "Make apple juice"
start = 2
duration = 2

# The above are the minimum required properties.
# Detailed explanations can be found below.


# Optional section, allows customisation of the visual style of the resulting svg
[style]
# Styling options go in here. See default.toml in the src/ directory for more information as to supported properties here.
# Link: https://github.com/sbrl/hourgraph/blob/master/src/default.toml
```

Detailed explanation of the properties on a `[[task]]`:

Property	| Type		| Required	| Meaning
------------|-----------|-----------|--------------
name		| string	| yes		| The name of the task (multiline strings are not currently handled correctly)
start		| number	| yes		| The point at which the task starts
duration	| number	| yes		| The number of units which the task lasts for.
colour		| string	| no		| The colour of the bar on the graph for this task. Overrides the global value specified in the `[style]` section.
ghost_colour| string	| no		| Specifies the colour of the ghost bar from the left-hand side up to the actual bar itself. Overrides the global value specified in the `[style]` section.

### CLI
_If you've installed `hourgraph` locally, substitute all instances of `hourgraph` for `path/to/node_modules/.bin/hourgraph` (basically the path to the `hourgraph` entry point)._

Once you've got your definition file written, you can now call _hourgraph_ to render it. By default, _hourgrah_ reads and writes from and to the standard input and output:

```bash
hourgraph <path/to/file.toml >path/to/file.svg
```

However, the `--input` and `--output` flags can be used to specify filenames to read from and/or write to instead:

```bash
hourgraph --input path/to/file.toml --output path/to/file.svg
```

Help text can be displayed using the `--help` argument:

```bash
hourgraph --help
```

Once you've got your SVG, you're done! If you'd prefer a PNG though, you can use the [Inkscape](https://inkscape.org/) CLI to convert it:

```bash
inkscape -e path/to/output.png path/to/file.svg
```

You can also specify a custom width or height to render to (maintaining aspect ratio):

```bash
# Specify the width:
inkscape -w 3840 -e path/to/output.png path/to/file.svg
# Specify the height:
inkscape -h 2160 -e path/to/output.png path/to/file.svg
```


## Read-world use
 - I'm using it in reports for my PhD in Computer Science!
 - _(Are you using this project? Get in touch by [opening an issue](https://github.com/sbrl/hourgraph/issues/new))_


## Contributing
Contributions are welcome as PRs! Don't forget to say that you donate your contribution under the _Mozilla Public License 2.0_ in your PR comment.


## Licence
This project is licensed under the _Mozilla Public License 2.0_. See the `LICENSE` file in this repository for the full text.
