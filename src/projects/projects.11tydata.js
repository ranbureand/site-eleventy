// Directory data for the projects collection (former Jekyll _projects).
// The 21 `published: false` projects are carried as excluded drafts: no output
// and out of collections (decision 3). Layout comes from each file's front
// matter, so the two `layout: null` stubs (skippet, kolay-ik) stay blank.
export default {
  eleventyComputed: {
    permalink: (data) =>
      data.published === false ? false : `/project/${data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => data.published === false,
  },
};
