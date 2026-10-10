import { HtmlBasePlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import callouts from "./lib/callouts.js";
import math from "./lib/math.js";
import { aggregateMaterials, lineCost, materialsCost, money } from "./lib/materials.js";

export default function (eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { tabIndex: false })
    .use(callouts)
    .use(math);
  eleventyConfig.setLibrary("md", md);

  // Rewrites root-relative URLs ("/activities/...") to include the GitHub Pages path prefix.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/bootstrap/dist/css/bootstrap.min.css": "assets/vendor/bootstrap.min.css",
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "assets/vendor/bootstrap.bundle.min.js",
  });

  // Self-contained HTML/p5.js sketches: copied as-is, never processed as templates.
  eleventyConfig.addPassthroughCopy("src/sketches");
  eleventyConfig.ignores.add("src/sketches/**");

  // Obsidian vault files that aren't pages.
  eleventyConfig.ignores.add("src/.obsidian/**");
  eleventyConfig.ignores.add("src/_templates/**");

  eleventyConfig.addCollection("activity", (api) =>
    api.getFilteredByGlob("src/activities/*.md").sort((a, b) => a.data.title.localeCompare(b.data.title))
  );
  eleventyConfig.addCollection("week", (api) => api.getFilteredByGlob("src/weeks/*.md"));

  eleventyConfig.addFilter("money", money);
  eleventyConfig.addFilter("lineCost", lineCost);
  eleventyConfig.addFilter("materialsCost", materialsCost);
  eleventyConfig.addFilter("aggregateMaterials", aggregateMaterials);

  // Look up an activity by its file name (without .md), as used in week pages.
  const findActivity = (slug, activities) => {
    const found = activities.find((a) => a.fileSlug === slug);
    if (!found) throw new Error(`Unknown activity "${slug}" (no file src/activities/${slug}.md)`);
    return found;
  };
  eleventyConfig.addFilter("findActivity", findActivity);
  eleventyConfig.addFilter("weekActivities", (days = [], activities) =>
    days.flatMap((d) => (d.activities ?? []).map((slug) => findActivity(slug, activities)))
  );
  // Weeks that include a given activity.
  eleventyConfig.addFilter("weeksUsing", (weeks, slug) =>
    weeks.filter((w) => (w.data.days ?? []).some((d) => (d.activities ?? []).includes(slug)))
  );
}

export const config = {
  dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
  // Set by the GitHub Pages workflow to "/<repo-name>/"; "/" for local development.
  pathPrefix: process.env.PATH_PREFIX || "/",
  // Don't run markdown through Nunjucks: keeps activity files plain markdown.
  markdownTemplateEngine: false,
};
