# Andrea Buran’s site

Personal site, migrated from Jekyll to Eleventy. Live: https://www.andreaburan.com (CNAME `andreaburan.com`).


Not yet deployed (media still to be pushed; one-time Pages setup pending).

---

## Current state

**Workspace**
- `site-jekyll/`: the original Jekyll site, **frozen read-only reference**. Its committed `docs/` is the golden output changes were diffed against during the migration.
- `site-eleventy/`: the working site (its own git repo, `ranbureand/site-eleventy`). Everything below is relative to here.
- Content: 10 posts, 21 published projects (+21 `published:false` drafts), 12 project categories, ~367 jots.

**Build & develop**: all built files are **generated; edit the source, never the output**.
- `npm run build` = `build:css` + `build:js` + `eleventy` → `_site/` (this is what GitHub Actions runs).
- `npm run start`: dev server + `sass --watch` (does **not** watch JS or images: re-run those manually).
- `npm run build:css` (Dart Sass → `src/styles/css/main.css` + the colors mini-page), `npm run build:js` (terser concatenates the 8 scripts + `main.js` → `src/scripts/js/main.min.js`), `npm run build:images` (sharp; **on demand only**), `npm run clean`.
- Stack: **Eleventy 3**, LiquidJS (`jekyllInclude: true`), markdown-it + anchor/footnote/deflist/toc, **Shiki** (code highlighting), sass, terser, sharp.

**Where things live**
- `eleventy.config.js`: input `src`; passthroughs; custom filters/tags (`markdownify`, `date_to_xmlschema`, `date_to_long_string`, `slugify`/latin, `post_url` tag, `where_includes`, `no_blank_lines`); the markdown-it setup; **glob-based collections**; the `buildTime` global; and `process.env.TZ = "Europe/Rome"` pinned at the very top.
- `lib/markdown-it-kramdown-ial.js`: the content-pipeline core (IAL plugin + Shiki fence renderer + footnote overrides; see below).
- `lib/build-images.js`: the sharp image pipeline.
- `src/_data/{site.json,slides.json}`; directory data `src/{posts,projects,categories,jots-data}/*.11tydata.js` set permalink + the `published:false` exclusion (layout comes from each file's own front matter).

**Mental model / gotchas** (differences from Jekyll that will trip you up)
- Front matter is accessed **bare** in templates: `title` (not `page.title`), `layout`, `page.fileSlug` (not `page.slug`).
- **Collections are defined by glob** in the config, so a content file’s front-matter `tags` stays plain metadata. **Item includes read front matter via `.data.`** — for example `post.data.title`, `project.data.categories`, `jot.data.number`.
- Parameterised includes work verbatim via `jekyllInclude: true` (`{% include image.html size="m" %}`, `include.*` inside the partial).
- Titles/descriptions use **`escape_once`** (not `escape`) after `markdownify`, to avoid double-escaping `&`.
- **`src/media/` is gitignored** (temporarily: 1.1 GB, to be pushed separately). The optimized images are committed *with* media and passed through as-is; `build:images` only regenerates them locally, on demand.

**Deploy** (`.github/workflows/deploy.yml`)
- **Manual only** (`workflow_dispatch`): pushing `main` never publishes; run the workflow (Actions tab or `gh workflow run deploy.yml`). One-time: repo public + Settings → Pages → Source = "GitHub Actions". **Push media before the real go-live**, cut over DNS/custom domain last. The `/site-eleventy/` preview URL breaks root-absolute paths: verify locally.

**Verification**: diff `_site/` against `site-jekyll/docs/`. Deliberate improvements *over* `docs/` (so a diff is expected): og:description uses the project `description`; `escape_once` fixes the double-escaped `&`; Shiki highlighting changed `main.css` (rouge classes → `.token.*`).

---

## Content & rendering details (know these before editing content or the pipeline)

The Markdown pipeline reproduces kramdown behaviour with markdown-it + the custom plugin `lib/markdown-it-kramdown-ial.js`.

- **Heading IDs** use a **custom kramdown-replica slugify** (in `eleventy.config.js`), because content hand-links to kramdown-form anchors: for example `Space = time` → `#space--time` (double dash). markdown-it-anchor is set `tabIndex: false`.
- The **IAL plugin** handles kramdown following-line attribute lists: `{: .code-m/l/xl }` after a fenced code block, `{: .table }` after a table, `{: .toc }` after the 2 hand-written TOC lists.
- The **Shiki fence renderer** reproduces the `<div class="language-X code-Y highlighter-rouge"><div class="highlight"><pre>` wrapper and maps Shiki scopes (`scopeToClass`) to Prism-style `.token.*` classes, which `_codes_colors.scss` colours (dark/light aware). Shiki highlights `liquid` + `yaml`, created async on the `eleventy.before` event (`initHighlighter`). It has no shared grammar state: **do not re-run a highlighter to “fix” output** (that corrupted things with the old Prism).
- **Footnote renderers are overridden** to emit kramdown-shaped markup (`.footnotes`, `.reversefootnote`) so the committed `footnotes.js` + SCSS work unchanged.
- Auto-TOCs use `[[toc]]` (markdown-it-table-of-contents, `containerClass: "toc"`, same slugify); deflists via markdown-it-deflist; `typographer: true` (smart quotes/dashes/ellipsis).
- **Figure includes** (`image.html`, `video-embed.html`, `video-link.html`) are wrapped in `{% capture %} … | no_blank_lines` so markdown-it keeps their multi-line HTML as one raw block: otherwise blank lines split the block and typographer curls the attribute quotes.
- **`| floor`** is applied to the `sizes`-attribute `divided_by` math (LiquidJS does float division where Jekyll floored). The aspect-ratio `divided_by: w_float` stays float.
- **jots-tags** are a jump-index: each jot links to `/jots/<page>/index.html#jot-N`, the page computed at build time from the number-descending pagination (`collections.jotTagIndex` in the config), listed in Jekyll's date-then-filename order.
- **CSS class collisions:** Shiki emits `.token.tag` (and `.string`, `.keyword`, etc.) in code. The jots-tags list's `.tag` is scoped to `.tags .tag` so its counter-bubble `:before` doesn't leak into code blocks. Any new *bare* class name that matches a `.token.*` name will collide the same way.

---

## Decisions still in force

- **Media**: `src/media/` copied verbatim, including ~785 MB of unreferenced source originals under `media/{posts,projects,slides}/`: `build:images` regenerates the `-optimized` sets from them (`resize(w, null, { withoutEnlargement: true })` = the old gulp `upscale:false`; 6 widths for images, 1440 for thumbnails; incremental, `--force` to redo all, optional positional path filter to scope a run).
- **Unpublished content**: the 21 `published:false` projects are carried as excluded drafts (`permalink:false` + `eleventyExcludeFromCollections`, via the directory data files). The two `layout:null` projects (skippet, kolay-ik) stay blank stubs.
- **URLs**: the `.html`-suffixed permalinks are preserved exactly.
- **Build tooling**: CodeKit → `build:css` + `build:js`; gulp → `build:images`. `build:js` **must** stay a plain concatenated global script (not an ES module): `toggleModeDisplay` is called from an inline `onclick` in `header.html`; terser's default `mangle.toplevel:false` keeps it global. The colors mini-page is compiled from its own SCSS.
- **Deploy**: manual `workflow_dispatch` only.
- **Fonts**: stay on the Google Fonts CDN for now (self-hosting is in the backlog).
- Figure includes stay as Jekyll-syntax `{% include %}` via `jekyllInclude: true` (no shortcode conversion).

---

## Open backlog (not yet done)

- Self-host fonts (currently the render-blocking Google Fonts CDN; the local fonts were dropped in the migration).
- Sass `@import` → `@use`/`@forward` (and the ~47 legacy-math expressions) to clear the build deprecation warnings.
- Delete orphan `src/scripts/js/time.js` (not bundled, not referenced).
- Scope the colors passthrough (`addPassthroughCopy("src/colors")` still publishes the SCSS source).
- Pre-existing `media/media` double-path bug in `image.html` `size="l"` (reproduced from Jekyll as-is).
- Optionally gitignore the build artifacts (`main.css`, `main.min.js`, colors css): the build regenerates them.
