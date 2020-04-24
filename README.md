# svg-time-plan
> Creates an SVG from a TOML definition of a time plan / gantt chart

Originally written for my PhD panel 1 topic project analysis report, as I realised that not only have I manually creates a number of these, but I'm going to have to create a bunch more in the future....

 - **Current version:** ![current npm version - see the GitHub releases](https://img.shields.io/npm/v/terrain50-cli)
 - **Changelog:** https://github.com/sbrl/svg-time-plan/blob/master/Changelog.md


## Installation
Install with `npm`:

```bash
sudo npm install --global
```

Or locally:

```bash
npm install svg-time-plan
```

## Usage
_If you've installed `svg-time-plan` locally, substitute all instances of `svg-time-plan` for `path/to/node_modules/.bin/svg-time-plan` (basically the path to the `scg-time-plan` entry point)._

svg-time-plan takes a [TOML file](https://github.com/toml-lang/toml) as input. Examples files can be found in the [examples directory](https://github.com/sbrl/svg-time-plan/tree/master/examples). In short, the format of a valid time plan file is as follows:

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
# Link: https://github.com/sbrl/svg-time-plan/blob/master/src/default.toml

```

Detailed explanation of the properties on a `[[task]]`:

Property	| Type		| Required	| Meaning
------------|-----------|-----------|--------------
name		| string	| yes		| The name of the task (multiline strings are not currently handled correctly)
start		| number	| yes		| The point at which the task starts
duration	| number	| yes		| The number of units which the task lasts for.
colour		| string	| no		| The colour of the bar on the graph for this task. Overrides the global value specified in the `[style]` section.
ghost_colour| string	| no		| Specifies the colour of the ghost bar from the left-hand side up to the actual bar itself. Overrides the global value specified in the `[style]` section.


## Read-world use
 - I'm using it in reports for my PhD in Computer Science!
 - _(Are you using this project? Get in touch by [opening an issue](https://github.com/sbrl/svg-time-plan/issues/new))_


## Contributing
Contributions are welcome as PRs! Don't forget to say that you donate your contribution under the _Mozilla Public License 2.0_ in your PR comment.


## Licence
This project is licensed under the _Mozilla Public License 2.0_. See the `LICENSE` file in this repository for the full text.
