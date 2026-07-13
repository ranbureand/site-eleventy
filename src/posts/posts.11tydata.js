// Directory data for the posts collection (former Jekyll _posts).
// Permalink reproduces Jekyll's `post/:title.html`. Layout and excerpt come
// from each file's own front matter.

// Jekyll writes dates like "2015-02-01 09:00:00 +0300"; the offset without a
// colon is not valid ISO 8601, so JavaScript's Date rejects it. Normalise to
// ISO before Eleventy maps the date.
function jekyllDate(raw, fallback) {
  if (raw instanceof Date) return raw;
  if (typeof raw !== "string") return fallback;
  const iso = raw
    .trim()
    .replace(" ", "T")
    .replace(/\s*([+-]\d{2})(\d{2})$/, "$1:$2");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d;
}

export default {
  eleventyComputed: {
    date: (data) => jekyllDate(data.date, data.page.date),
    permalink: (data) =>
      data.published === false ? false : `/post/${data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => data.published === false,
  },
};
