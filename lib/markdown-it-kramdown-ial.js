// Kramdown-style "following line" inline attribute lists (IALs) for markdown-it.
//
// A paragraph consisting solely of `{: .class1 .class2 }` attaches those classes
// to the immediately preceding block — a fenced code block, a table, or a list —
// reproducing kramdown's placement. Used by the posts for code-size classes
// (`{: .code-m/l/xl }`), table styling (`{: .table }`), and the two hand-written
// tables of contents (`{: .toc }`).
//
// Fenced code is rendered with kramdown/rouge's wrapper structure so the existing
// SCSS (`[class*="code"] > .highlight`, `.code-m > .highlight`) applies. Syntax
// highlighting uses Shiki (TextMate grammars): unlike Prism it has no shared
// grammar state, so it highlights liquid-in-HTML deterministically. Shiki's
// scopes are mapped to the same `.token.*` class names Prism used, so
// `_codes_colors.scss` (which maps `.token.*` to the site `--code-*` palette,
// including dark/light) keeps working unchanged.

import { createHighlighter } from "shiki";

const THEME = "github-light"; // only used to satisfy Shiki's tokenizer; colours come from SCSS scope classes
const LANGS = ["liquid", "yaml"];

let highlighter = null;

// Called from eleventy.config.js on `eleventy.before` so the (async) highlighter
// is ready before the synchronous fence renderer runs during the build.
export async function initHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({ themes: [THEME], langs: LANGS });
  }
}

// Map a TextMate scope stack (outermost → innermost) to a Prism-compatible
// token class, checking the most specific scope first.
function scopeToClass(scopes) {
  for (let i = scopes.length - 1; i >= 0; i--) {
    const s = scopes[i];
    if (s.startsWith("comment")) return "comment";
    if (s.startsWith("entity.name.tag")) return "tag";
    if (s.startsWith("punctuation.definition.tag")) return "tag";
    if (s.startsWith("entity.other.attribute-name")) return "attr-name";
    if (s.startsWith("string")) return "string";
    if (s.startsWith("constant.numeric")) return "number";
    if (s.startsWith("constant.language")) return "boolean";
    if (s.startsWith("constant")) return "number";
    if (s.startsWith("keyword")) return "keyword";
    if (s.startsWith("storage")) return "keyword";
    if (s.startsWith("variable")) return "variable";
    if (s.startsWith("support.function")) return "function";
    if (s.startsWith("entity.name.function")) return "function";
    if (s.startsWith("punctuation")) return "punctuation";
  }
  return null;
}

// Highlight `code` into `<span class="token …">` markup, or return null when the
// language isn't available (caller then emits plain escaped code).
function highlightCode(code, lang, escape) {
  if (!highlighter || !highlighter.getLoadedLanguages().includes(lang)) {
    return null;
  }
  const { tokens } = highlighter.codeToTokens(code, {
    lang,
    theme: THEME,
    includeExplanation: true,
  });
  let out = "";
  tokens.forEach((line, lineIndex) => {
    for (const token of line) {
      const segments = token.explanation || [
        { content: token.content, scopes: [] },
      ];
      for (const seg of segments) {
        const cls = scopeToClass((seg.scopes || []).map((s) => s.scopeName));
        const text = escape(seg.content);
        out += cls ? `<span class="token ${cls}">${text}</span>` : text;
      }
    }
    if (lineIndex < tokens.length - 1) out += "\n";
  });
  return out;
}

function matchOpen(tokens, closeIdx, openType) {
  const closeType = openType.replace("_open", "_close");
  let depth = 0;
  for (let j = closeIdx; j >= 0; j--) {
    if (tokens[j].type === closeType) depth++;
    else if (tokens[j].type === openType && --depth === 0) return tokens[j];
  }
  return null;
}

export default function kramdownIal(md) {
  md.core.ruler.push("kramdown_ial", (state) => {
    const tokens = state.tokens;
    const remove = new Set();
    for (let i = 2; i < tokens.length; i++) {
      if (tokens[i].type !== "paragraph_close") continue;
      const inline = tokens[i - 1];
      const open = tokens[i - 2];
      if (open.type !== "paragraph_open" || inline.type !== "inline") continue;
      const m = /^\{:\s*(.+?)\s*\}$/.exec(inline.content.trim());
      if (!m) continue;
      const classes = m[1]
        .split(/\s+/)
        .filter((t) => t.startsWith("."))
        .map((t) => t.slice(1));
      if (!classes.length) continue;

      const prev = tokens[i - 3];
      if (!prev) continue;
      let target = null;
      if (prev.type === "fence") target = prev;
      else if (prev.type === "table_close")
        target = matchOpen(tokens, i - 3, "table_open");
      else if (prev.type === "bullet_list_close")
        target = matchOpen(tokens, i - 3, "bullet_list_open");
      else if (prev.type === "ordered_list_close")
        target = matchOpen(tokens, i - 3, "ordered_list_open");
      if (!target) continue;

      target.attrJoin("class", classes.join(" "));
      remove.add(i - 2).add(i - 1).add(i);
    }
    if (remove.size) state.tokens = tokens.filter((_, idx) => !remove.has(idx));
    return true;
  });

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = (token.info || "").trim().split(/\s+/)[0];
    const ial = token.attrGet("class"); // e.g. "code-m", set by the rule above
    const classes = [lang ? `language-${lang}` : null, ial, "highlighter-rouge"]
      .filter(Boolean)
      .join(" ");
    const highlighted =
      lang && highlightCode(token.content, lang, md.utils.escapeHtml);
    const body =
      highlighted != null ? highlighted : md.utils.escapeHtml(token.content);
    return `<div class="${classes}"><div class="highlight"><pre class="highlight"><code>${body}</code></pre></div></div>\n`;
  };
}
