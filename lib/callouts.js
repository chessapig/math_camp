import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// markdown-it plugin: turns Obsidian-style callouts into Bootstrap components.
//
//   > [!facilitation] Optional title      -> collapsible "Facilitation notes" dropdown
//   > [!rules]                            -> highlighted rules card
//   > [!figure] Caption                   -> Bootstrap card with image, caption, source
//   > ![alt text](image.png)
//   > Source: Where it came from
//   > [!tip] / [!note] / [!warning] ...   -> Bootstrap alerts
//
// Because these are plain Obsidian callouts, they also render (and fold) inside Obsidian.

const CALLOUT_RE = /^\[!([\w-]+)\]([+-]?)[ \t]*(.*)$/;
const IMAGE_RE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"([^"]*)")?\s*\)/;
const SOURCE_RE = /^(?:source|credit)\s*:\s*(.+)$/i;
const ALT_RE = /^alt\s*:\s*(.+)$/i;

const ALERTS = {
  note: "info",
  info: "info",
  tip: "success",
  success: "success",
  question: "secondary",
  warning: "warning",
  caution: "warning",
  danger: "danger",
  safety: "danger",
};

// Images live in src/assets/images (Obsidian's attachment folder), possibly in subfolders.
// Obsidian links are matched by path suffix ("fences.jpg", "isoperimetric/fences.jpg" or
// "assets/images/isoperimetric/fences.jpg" all find the same file), so resolve them the same way.
const IMAGE_DIR = fileURLToPath(new URL("../src/assets/images/", import.meta.url));
let imageFiles;
function listImages() {
  imageFiles ??= fs.readdirSync(IMAGE_DIR, { recursive: true })
    .map((f) => f.split(path.sep).join("/"))
    .filter((f) => !f.split("/").pop().startsWith("."));
  return imageFiles;
}

export function resolveImageSrc(src) {
  if (/^([a-z]+:|\/)/i.test(src)) return src;
  let link = src;
  try { link = decodeURI(src); } catch {}
  link = link.replace(/^(\.\.?\/)+/, "").replace(/^(src\/)?assets\/images\//, "");
  const files = listImages();
  const found = files.find((f) => f === link) ?? files.find((f) => f.endsWith("/" + link));
  return "/assets/images/" + encodeURI(found ?? link);
}

function findClose(tokens, start) {
  let depth = 0;
  for (let j = start; j < tokens.length; j++) {
    if (tokens[j].type === "blockquote_open") depth++;
    if (tokens[j].type === "blockquote_close" && --depth === 0) return j;
  }
  return tokens.length - 1;
}

function renderFigure(md, caption, lines, env) {
  let img = null;
  let source = "";
  let alt = null;
  const extra = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    let m;
    if (!img && (m = t.match(IMAGE_RE))) {
      img = { alt: m[1], src: m[2], title: m[3] };
    } else if ((m = t.match(SOURCE_RE))) {
      source = m[1];
    } else if ((m = t.match(ALT_RE))) {
      alt = m[1];
    } else {
      extra.push(t);
    }
  }
  const esc = md.utils.escapeHtml;
  const captionText = [caption, ...extra].filter(Boolean).join(" ");
  const altText = alt ?? img?.alt ?? "";
  let html = `<figure class="card camp-figure my-4">\n`;
  if (img) {
    html += `  <img class="card-img-top" src="${esc(resolveImageSrc(img.src))}" alt="${esc(altText)}" loading="lazy">\n`;
  }
  if (captionText || source) {
    html += `  <figcaption class="card-body">\n`;
    if (captionText) html += `    <p class="card-text mb-1">${md.renderInline(captionText, env)}</p>\n`;
    if (source) html += `    <p class="card-text small text-body-secondary mb-0">Source: ${md.renderInline(source, env)}</p>\n`;
    html += `  </figcaption>\n`;
  }
  return html + `</figure>\n`;
}

export default function callouts(md) {
  // Runs after block parsing but before inline parsing, so we can edit raw text.
  md.core.ruler.after("block", "camp_callouts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "blockquote_open") continue;
      const inline = tokens[i + 2];
      if (tokens[i + 1]?.type !== "paragraph_open" || inline?.type !== "inline") continue;

      const [firstLine, ...rest] = inline.content.split("\n");
      const m = firstLine.match(CALLOUT_RE);
      if (!m) continue;

      let close = findClose(tokens, i);
      const type = m[1].toLowerCase();
      const fold = m[2];
      const title = m[3].trim();

      if (type === "figure" || type === "image") {
        const lines = [...rest];
        for (let j = i + 3; j < close; j++) {
          if (tokens[j].type === "inline") lines.push(...tokens[j].content.split("\n"));
        }
        const tok = new state.Token("html_block", "", 0);
        tok.block = true;
        tok.content = renderFigure(md, title, lines, state.env);
        tokens.splice(i, close - i + 1, tok);
        continue;
      }

      inline.content = rest.join("\n");
      if (!inline.content.trim()) {
        tokens.splice(i + 1, 3);
        close -= 3;
      }
      const meta = { callout: { type, fold, title } };
      tokens[i].meta = meta;
      tokens[close].meta = meta;
    }
  });

  const defaultOpen = md.renderer.rules.blockquote_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  const defaultClose = md.renderer.rules.blockquote_close ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const c = tokens[idx].meta?.callout;
    if (!c) {
      // A plain "> text" block is an ordinary quote.
      tokens[idx].attrJoin("class", "camp-quote");
      return defaultOpen(tokens, idx, options, env, self);
    }
    const title = c.title ? md.renderInline(c.title, env) : null;

    if (c.type === "facilitation" || c.type === "facilitator") {
      return `<details class="facilitation card my-3"${c.fold === "+" ? " open" : ""}>\n` +
        `<summary class="card-header">${title ?? "Facilitation notes"}</summary>\n` +
        `<div class="card-body">\n`;
    }
    if (c.type === "rules") {
      return `<section class="camp-rules card border-primary my-4">\n` +
        `<div class="card-header text-bg-primary fw-semibold">${title ?? "Rules"}</div>\n` +
        `<div class="card-body">\n`;
    }
    // Like Obsidian, an untitled callout is headed by its type ("Safety", "Tip", ...).
    const variant = ALERTS[c.type] ?? "secondary";
    const heading = title ?? c.type.charAt(0).toUpperCase() + c.type.slice(1);
    return `<div class="alert alert-${variant} camp-callout my-3" role="note">\n` +
      `<p class="alert-heading fw-semibold mb-1">${heading}</p>\n`;
  };

  md.renderer.rules.blockquote_close = (tokens, idx, options, env, self) => {
    const c = tokens[idx].meta?.callout;
    if (!c) return defaultClose(tokens, idx, options, env, self);
    if (c.type === "facilitation" || c.type === "facilitator") return `</div>\n</details>\n`;
    if (c.type === "rules") return `</div>\n</section>\n`;
    return `</div>\n`;
  };

  // Plain markdown images get the same path normalization and responsive styling.
  const defaultImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const tok = tokens[idx];
    tok.attrSet("src", resolveImageSrc(tok.attrGet("src")));
    tok.attrJoin("class", "img-fluid");
    return defaultImage(tokens, idx, options, env, self);
  };
}
