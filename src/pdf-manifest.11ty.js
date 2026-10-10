// Lists every page that scripts/pdf.js should render to PDF, and where to save it.
export const data = {
  permalink: "/pdf-manifest.json",
  eleventyExcludeFromCollections: true,
};

export function render({ collections, site }) {
  const pages = [...collections.week, ...collections.activity].map((p) => ({
    url: p.url,
    pdf: `${p.url}${p.fileSlug}.pdf`,
  }));
  pages.push({ url: "/print/", pdf: site.handbookPdf });
  return JSON.stringify(pages, null, 2);
}
