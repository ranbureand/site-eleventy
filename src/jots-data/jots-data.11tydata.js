// Directory data for the jots collection (former Jekyll _jots, output: false).
// Jots have no individual pages; they feed the paginated /jots/ listing only.

// Normalise Jekyll date strings (for example "2016-03-12 12:00:00") to ISO so
// JavaScript's Date accepts them.
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
  },
  permalink: false,
};
