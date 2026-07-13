// Directory data for the project-category pages (former Jekyll _categories).
// Permalink reproduces Jekyll's `projects/:title.html`.
export default {
  eleventyComputed: {
    permalink: (data) =>
      data.published === false ? false : `/projects/${data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => data.published === false,
  },
};
