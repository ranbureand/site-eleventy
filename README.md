# Andrea Buran’s site. Sixth edition.

The code for my personal site, [andreaburan.com](https://www.andreaburan.com "Andrea Buran’s Site"), is based on this repository.

This site is:

+ designed and developed in the browser
+ written in Markdown
+ generated using [Eleventy](https://www.11ty.dev/ "Eleventy")
+ syntax-highlighted with [Shiki](https://shiki.style/ "Shiki")
+ scripted in JavaScript
+ styled from scratch using SCSS
+ typeset with [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono "IBM Plex Mono in Google Fonts"), [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans "IBM Plex Sans in Google Fonts"), and [IBM Plex Serif](https://fonts.google.com/specimen/IBM+Plex+Serif "IBM Plex Serif in Google Fonts")

It is a playground in constant evolution where I experiment, learn, and try new things.

The favicon is:

+ designed in Figma
+ generated using [RealFaviconGenerator](https://realfavicongenerator.net/ "RealFaviconGenerator")

## Install

Run the following commands in the Terminal:

    npm install

## Serve

Run the following commands in the Terminal:

    npm run start

## Build

Run the following commands in the Terminal:

    npm run build

## Scripts

The JavaScript lives as separate source files in `src/scripts/js/`. The build concatenates them in the order defined by the `build:js` script in `package.json`, and minifies them into a single `main.min.js` with [terser](https://terser.org/): the only script the site loads.

To rebuild only the scripts, run `npm run build:js` on its own. To change the scripts, edit the source files, or add a new one to the `build:js` list, and then rebuild.

## Images

The responsive image sets under `src/media/*-optimized/` are generated from the high-resolution sources in `src/media/{posts,projects,slides}/`. Running `npm run build:images` resizes each source into the widths the templates use: 360, 720, 1080, 1440, 2160, and 2880 pixels for images, and 1440 pixels for thumbnails, using [sharp](https://sharp.pixelplumbing.com/ "sharp"). A source that is already smaller than a target width is never enlarged: it is copied at its native size instead.

Only new or changed sources are processed, so re-runs are quick. To scope a run to part of the tree, pass a path: for example, `npm run build:images -- posts/medlay-research` for one folder, or `npm run build:images -- projects` for one root. Pass `--force` to ignore the up-to-date check and regenerate everything, or everything matching the path. This is run on demand: it is not part of `npm run build`.


## Eleventy variables

```
<ul>
  <li>title = {{ title }}</li>
  <li>layout = {{ layout }}</li>
  <li>page.url = {{ page.url }}</li>
  <li>page.fileSlug = {{ page.fileSlug }}</li>
  <li>page.filePathStem = {{ page.filePathStem }}</li>
  <li>page.inputPath = {{ page.inputPath }}</li>
  <li>page.outputPath = {{ page.outputPath }}</li>
  <li>page.outputFileExtension = {{ page.outputFileExtension }}</li>
  <li>page.templateSyntax = {{ page.templateSyntax }}</li>
  <li>page.date = {{ page.date }}</li>
</ul>
```