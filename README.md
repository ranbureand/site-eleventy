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