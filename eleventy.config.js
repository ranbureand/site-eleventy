// Jekyll built with timezone Europe/Rome; the CI runners are UTC. Pin the
// process timezone so rendered dates (feed, sitemap, article dates) carry the
// same Rome offsets (+01:00 winter, +02:00 summer) as the current site.
process.env.TZ = "Europe/Rome";

import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import markdownItDeflist from "markdown-it-deflist";
import markdownItToc from "markdown-it-table-of-contents";
import kramdownIal, { initHighlighter } from "./lib/markdown-it-kramdown-ial.js";

// Replicates kramdown's heading-id algorithm so that hand-written anchor links
// (for example `](#space--time)`) keep resolving after the migration.
// kramdown: strip leading non-letters, delete anything other than
// [a-zA-Z0-9 -], turn spaces into hyphens, lowercase. Duplicates get -1/-2
// suffixes, which markdown-it-anchor appends on its own.
function kramdownSlug(str) {
  return String(str)
    .replace(/^[^a-zA-Z]+/, "")
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/ /g, "-")
    .toLowerCase();
}

// Approximates Jekyll's `slugify: 'latin'`: lowercase, non-alphanumerics to
// hyphens, collapse and trim. Used in open-graph.html to build media paths, so
// it must match the on-disk project slugs (verify in the diff crawl).
function latinSlug(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function (eleventyConfig) {
  // Initialise the Shiki highlighter (async) before the build renders anything,
  // so the synchronous fence renderer can use it.
  eleventyConfig.on("eleventy.before", initHighlighter);

  // --- Markdown (kramdown replacement) -------------------------------------
  const md = markdownIt({
    html: true,
    typographer: true, // kramdown entity_output: as_char (smart quotes, dashes, ellipsis)
  })
    .use(markdownItAnchor, { slugify: kramdownSlug, tabIndex: false })
    .use(markdownItFootnote)
    .use(markdownItDeflist)
    .use(markdownItToc, {
      includeLevel: [2, 3, 4, 5, 6], // kramdown toc_levels: 2..6
      slugify: kramdownSlug,
      containerClass: "toc", // kramdown emits <ul class="toc">; keep the .toc hook
    })
    .use(kramdownIal);

  // Footnotes: markdown-it-footnote's default markup differs from kramdown's
  // (`.footnote-backref`, `[1]` captions, a leading `<hr>`). The existing SCSS
  // and the committed footnotes JS target kramdown's `.footnotes` / `.reverse-
  // footnote`, and decision 6 keeps main.min.js as-is — so emit kramdown-shaped
  // markup rather than rebuilding the JS.
  md.renderer.rules.footnote_block_open = () =>
    '<div class="footnotes" role="doc-endnotes">\n<ol>\n';
  md.renderer.rules.footnote_block_close = () => "</ol>\n</div>\n";
  md.renderer.rules.footnote_caption = (tokens, idx) => {
    let n = Number(tokens[idx].meta.id + 1).toString();
    if (tokens[idx].meta.subId > 0) n += ":" + tokens[idx].meta.subId;
    return n; // kramdown shows "1", not "[1]"
  };
  md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
    let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    if (tokens[idx].meta.subId > 0) id += ":" + tokens[idx].meta.subId;
    // class="reversefootnote" so the committed JS ("Go back ⬏") and SCSS apply.
    return ` <a href="#fnref${id}" class="reversefootnote" role="doc-backlink">↩</a>`;
  };

  eleventyConfig.setLibrary("md", md);

  // --- Liquid --------------------------------------------------------------
  // jekyllInclude accepts Jekyll's include syntax verbatim ({% include x.html
  // key="value" %} with include.* inside the partial), so the ~270 figure
  // includes in post/project bodies port with no rewrites.
  eleventyConfig.setLiquidOptions({ jekyllInclude: true });

  // --- Filters (Jekyll equivalents) ----------------------------------------
  eleventyConfig.addLiquidFilter("markdownify", (s) =>
    s == null ? "" : md.render(String(s)),
  );
  // Collapse blank lines so the figure includes emit one contiguous HTML block.
  // markdown-it ends a raw-HTML block at the first blank line; the image/video
  // includes' conditionals otherwise leave blanks that get parsed as prose
  // (curling the attribute quotes). Keeps newlines, drops empty lines.
  eleventyConfig.addLiquidFilter("no_blank_lines", (s) =>
    String(s)
      .replace(/\n(?:[ \t]*\n)+/g, "\n")
      .trim(),
  );
  eleventyConfig.addLiquidFilter("slugify", (s, mode) =>
    mode === "latin" ? latinSlug(s) : latinSlug(s),
  );
  // date_to_xmlschema: ISO 8601 with the local (Europe/Rome) offset, matching
  // Jekyll. Relies on the pinned process.env.TZ above.
  const pad = (n) => String(n).padStart(2, "0");
  eleventyConfig.addLiquidFilter("date_to_xmlschema", (d) => {
    const date = new Date(d);
    const off = -date.getTimezoneOffset();
    const sign = off >= 0 ? "+" : "-";
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
      `${sign}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`
    );
  });
  // date_to_long_string: Jekyll's "%d %B %Y" (for example "01 February 2015").
  eleventyConfig.addLiquidFilter("date_to_long_string", (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  );

  // site.time equivalent for the sitemap's undated-page lastmod fallback.
  eleventyConfig.addGlobalData("buildTime", () => new Date());

  // --- post_url (Jekyll tag) -----------------------------------------------
  // {% post_url 2021-08-14-multilingual-sites-in-jekyll-3 %} -> the post's URL.
  // The permalink is post/<slug>.html where <slug> is the filename minus its
  // date prefix, so resolve it directly without a collection lookup.
  eleventyConfig.addLiquidTag("post_url", function () {
    return {
      parse(tagToken) {
        this.arg = tagToken.args.trim();
      },
      render() {
        const slug = this.arg.replace(/^\d{4}-\d{2}-\d{2}-/, "");
        return `/post/${slug}.html`;
      },
    };
  });

  // --- Collections ---------------------------------------------------------
  // Defined by glob rather than tags, so each item's `tags` front matter stays
  // pure metadata (Jekyll semantics) instead of being consumed as Eleventy
  // collection membership. Published-gating and ordering are baked in here so
  // the ported includes stay close to the originals.
  const published = (item) => item.data.published !== false;

  eleventyConfig.addCollection("posts", (c) =>
    c
      .getFilteredByGlob("./src/posts/*.md")
      .filter(published)
      .sort((a, b) => a.date - b.date),
  );
  eleventyConfig.addCollection("projects", (c) =>
    c
      .getFilteredByGlob("./src/projects/*.md")
      .filter(published)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection("categories", (c) =>
    c
      .getFilteredByGlob("./src/categories/*.md")
      .filter(published)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0)),
  );
  eleventyConfig.addCollection("jots", (c) =>
    c.getFilteredByGlob("./src/jots-data/*.md").sort((a, b) => a.date - b.date),
  );
  eleventyConfig.addCollection("jotsByNumber", (c) =>
    c
      .getFilteredByGlob("./src/jots-data/*.md")
      .sort((a, b) => b.data.number - a.data.number),
  );

  // Build-time jot->page map for the jots-tags jump index (decision 8). Pages
  // are derived from each jot's position in the real number-descending
  // pagination (26 per page), so no dense-numbering is assumed. The list itself
  // is emitted in filename order, matching Jekyll's site.jots ordering (same
  // date sorts by filename, e.g. 10, 11, 8, 9).
  eleventyConfig.addCollection("jotTagIndex", (c) => {
    const all = c.getFilteredByGlob("./src/jots-data/*.md");
    const byNumberDesc = [...all].sort((a, b) => b.data.number - a.data.number);
    const pageOf = new Map();
    byNumberDesc.forEach((jot, i) => {
      pageOf.set(jot.data.number, Math.floor(i / 26) + 1);
    });
    // Jekyll's site.jots order: front-matter date ascending, ties by filename.
    return [...all]
      .sort((a, b) => a.date - b.date || a.inputPath.localeCompare(b.inputPath))
      .map((jot) => ({
        number: jot.data.number,
        tags: jot.data.tags,
        page: pageOf.get(jot.data.number),
      }));
  });

  // Paginated listing pages, in page order, for the sitemap's "pages" block.
  // Built from tags so every paginated output page is included (a glob returns
  // the template only once).
  const byPageNumber = (a, b) =>
    a.data.pagination.pageNumber - b.data.pagination.pageNumber;
  eleventyConfig.addCollection("postsListing", (c) =>
    c.getFilteredByTag("postsPage").sort(byPageNumber),
  );
  eleventyConfig.addCollection("jotsListing", (c) =>
    c.getFilteredByTag("jotsPage").sort(byPageNumber),
  );

  // Jekyll's `where` matches array membership; LiquidJS's checks equality.
  // This filter restores the array-contains behaviour the category pages need.
  eleventyConfig.addLiquidFilter("where_includes", (arr, key, value) =>
    (arr || []).filter((item) => {
      const v = item && item.data ? item.data[key] : item ? item[key] : undefined;
      return Array.isArray(v) ? v.includes(value) : v === value;
    }),
  );

  // --- Passthrough copy (published statics) --------------------------------
  eleventyConfig.addPassthroughCopy({ "src/scripts/js/main.min.js": "scripts/js/main.min.js" });
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addPassthroughCopy("src/styles/css");
  // src/colors/ is a local-only swatch reference; it is not published
  // (the Jekyll site never shipped it either).
  eleventyConfig.ignores.add("src/colors/**");
  eleventyConfig.addPassthroughCopy({ "src/root": "/" });

  // Sass writes into src/styles/css and src/colors/styles/css; do not let
  // Eleventy watch its own passthrough output churn.
  eleventyConfig.setServerOptions({ domDiff: false });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
