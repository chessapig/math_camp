// Renders every page listed in _site/pdf-manifest.json to PDF with headless Chrome.
// Run after `eleventy` (use `npm run build:all`). PDFs are written into _site next
// to the pages they come from, so they deploy with the site.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const SITE_DIR = path.resolve("_site");
const PREFIX = (process.env.PATH_PREFIX || "/").replace(/\/?$/, "/");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

// Minimal static server that mimics GitHub Pages, including the path prefix.
function serve() {
  const server = createServer(async (req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!urlPath.startsWith(PREFIX)) return res.writeHead(404).end();
    let file = path.join(SITE_DIR, urlPath.slice(PREFIX.length));
    if (!file.startsWith(SITE_DIR)) return res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const manifest = JSON.parse(await readFile(path.join(SITE_DIR, "pdf-manifest.json"), "utf8"));
const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

try {
  for (const { url, pdf } of manifest) {
    const page = await browser.newPage();
    await page.goto(origin + PREFIX + url.replace(/^\//, ""), { waitUntil: "networkidle0" });
    // Wait for MathJax to finish typesetting.
    await page.evaluate(() => window.MathJax?.startup?.promise);
    // Expand every facilitation-notes dropdown so it appears in the PDF.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const out = path.join(SITE_DIR, pdf);
    await page.pdf({
      path: out,
      format: "Letter",
      printBackground: true,
      margin: { top: "0.6in", bottom: "0.6in", left: "0.6in", right: "0.6in" },
    });
    await page.close();
    console.log(`PDF  ${path.relative(process.cwd(), out)}`);
  }
} finally {
  await browser.close();
  server.close();
}
