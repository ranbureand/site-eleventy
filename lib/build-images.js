/* Copyright (c) 2017 Andrea Buran [www.andreaburan.com]. All rights reserved */

/*
** Image pipeline
**
** Regenerates the responsive image sets under src/media/*-optimized/ from the
** high-resolution sources under src/media/{posts,projects,slides}/. This is the
** Node/sharp replacement for the old gulp image workflow — run on demand
** (`npm run build:images`) after adding source images; the optimized output is
** committed alongside the sources.
**
** Mapping (matches the existing on-disk structure):
**   posts/<slug>/images/<file>      -> posts-optimized/<slug>/images/<w>/<name>.jpg      (6 widths)
**   posts/<slug>/thumbnails/<file>  -> posts-optimized/<slug>/thumbnails/1440/<name>.jpg (1 width)
**   projects/<slug>/…               -> projects-optimized/<slug>/…                       (same)
**   slides/<file>                   -> slides-optimized/<w>/<name>.jpg                   (flat, 6 widths)
**
** Like gulp's `upscale: false`, a source narrower than a target width is not
** enlarged — it is written at its native size (a full-size copy in that folder),
** so every width folder always has a file for the templates' srcset. Videos and
** non-image files are ignored. Output is always progressive JPEG.
**
** Usage:
**   npm run build:images                             new/changed images everywhere
**   npm run build:images -- posts/medlay-research     scope to sources matching a path
**   npm run build:images -- projects                  scope to one root
**   npm run build:images -- --force                   regenerate all (ignore timestamps)
*/

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const MEDIA = "src/media";
const IS_IMAGE = /\.(jpe?g|png)$/i;

// CLI args: an optional positional path filter (a substring of the source path,
// e.g. "posts/medlay-research" or "projects") scopes the run; --force ignores the
// up-to-date check and regenerates the matched outputs.
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const FILTER = args.find((a) => !a.startsWith("--")) || "";
const matchesFilter = (srcPath) => !FILTER || srcPath.includes(FILTER);

// Target widths with descending JPEG quality, matching the old gulp workflow
const IMAGE_SIZES = [
  { w: 360, q: 88 },
  { w: 720, q: 84 },
  { w: 1080, q: 80 },
  { w: 1440, q: 76 },
  { w: 2160, q: 72 },
  { w: 2880, q: 72 },
];
const THUMB_SIZES = [{ w: 1440, q: 76 }];

let generated = 0;
let upToDate = 0;

// Resize one source image into every target width under `outDir/<w>/`.
async function resizeInto(srcPath, outDir, sizes) {
  const outName = path.basename(srcPath).replace(IS_IMAGE, "") + ".jpg";
  const srcMtime = (await stat(srcPath)).mtimeMs;

  for (const { w, q } of sizes) {
    const dir = path.join(outDir, String(w));
    const out = path.join(dir, outName);

    // Skip when the output already exists and is newer than the source
    if (!FORCE && existsSync(out) && (await stat(out)).mtimeMs >= srcMtime) {
      upToDate++;
      continue;
    }

    await mkdir(dir, { recursive: true });
    await sharp(srcPath)
      // width-only resize, aspect preserved; never enlarge (gulp `upscale: false`)
      .resize(w, null, { withoutEnlargement: true })
      // PNG transparency (the slides are PNG) flattened to white for JPEG
      .flatten({ background: "#ffffff" })
      .sharpen({ sigma: 0.5 })
      .jpeg({ quality: q, progressive: true, mozjpeg: true })
      .toFile(out);
    generated++;
  }
}

// Nested sources: <root>/<slug>/{images,thumbnails}/<file>
async function processNested(root) {
  const srcRoot = path.join(MEDIA, root);
  const outRoot = path.join(MEDIA, `${root}-optimized`);
  if (!existsSync(srcRoot)) return;

  for (const slug of await readdir(srcRoot)) {
    const slugDir = path.join(srcRoot, slug);
    if (!(await stat(slugDir)).isDirectory()) continue;

    for (const [sub, sizes] of [
      ["images", IMAGE_SIZES],
      ["thumbnails", THUMB_SIZES],
    ]) {
      const subDir = path.join(slugDir, sub);
      if (!existsSync(subDir)) continue; // e.g. posts have no thumbnails

      for (const file of await readdir(subDir)) {
        if (!IS_IMAGE.test(file)) continue; // skip videos and other files
        const src = path.join(subDir, file);
        if (!matchesFilter(src)) continue;
        await resizeInto(src, path.join(outRoot, slug, sub), sizes);
      }
    }
  }
}

// Flat sources: slides/<file> -> slides-optimized/<w>/<name>.jpg
async function processFlat(root) {
  const srcRoot = path.join(MEDIA, root);
  const outRoot = path.join(MEDIA, `${root}-optimized`);
  if (!existsSync(srcRoot)) return;

  for (const file of await readdir(srcRoot)) {
    if (!IS_IMAGE.test(file)) continue;
    const src = path.join(srcRoot, file);
    if (!matchesFilter(src)) continue;
    await resizeInto(src, outRoot, IMAGE_SIZES);
  }
}

await processNested("posts");
await processNested("projects");
await processFlat("slides");

if (FILTER && generated + upToDate === 0) {
  console.log(`Images: no sources matched "${FILTER}".`);
} else {
  const scope = FILTER ? ` matching "${FILTER}"` : "";
  console.log(
    `Images${scope}: ${generated} generated, ${upToDate} already up to date${FORCE ? " (forced)" : ""}.`,
  );
}
