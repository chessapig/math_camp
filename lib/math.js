// markdown-it plugin: passes TeX math through untouched so MathJax can render it in
// the browser. Uses the same syntax as Obsidian:
//
//   $x+1$              inline math
//   $$ ... $$          display math (on its own lines, or inline)
//
// Like Obsidian and Pandoc, "$" only opens math when followed by a non-space and only
// closes it when preceded by a non-space and not followed by a digit, so prices such as
// "$2 and $3" stay plain text. Write \$ for a literal dollar sign.

function mathBlock(state, startLine, endLine, silent) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (state.src.slice(start, start + 2) !== "$$") return false;

  const firstLine = state.src.slice(start + 2, max).trimEnd();
  let content;
  let lastLine = startLine;

  if (firstLine.endsWith("$$")) {
    // $$ ... $$ on a single line
    content = firstLine.slice(0, -2);
    if (content.includes("$$")) return false; // e.g. "$$a$$ and $$b$$": leave to inline rule
  } else {
    const lines = [firstLine];
    let found = false;
    for (lastLine = startLine + 1; lastLine < endLine; lastLine++) {
      const line = state.src
        .slice(state.bMarks[lastLine] + state.tShift[lastLine], state.eMarks[lastLine])
        .trimEnd();
      if (line.endsWith("$$")) {
        lines.push(line.slice(0, -2));
        found = true;
        break;
      }
      lines.push(line);
    }
    if (!found) return false;
    content = lines.join("\n");
  }

  if (silent) return true;
  state.line = lastLine + 1;
  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.content = content.trim();
  token.markup = "$$";
  token.map = [startLine, state.line];
  return true;
}

function mathInline(state, silent) {
  const src = state.src;
  if (src[state.pos] !== "$") return false;

  const display = src[state.pos + 1] === "$";
  const delim = display ? "$$" : "$";
  const start = state.pos + delim.length;
  if (start >= state.posMax || (!display && /\s/.test(src[start]))) return false;

  let end = start;
  while (true) {
    end = src.indexOf(delim, end);
    if (end === -1 || end >= state.posMax) return false;
    const escaped = src[end - 1] === "\\";
    const badClose = !display && (/\s/.test(src[end - 1]) || /\d/.test(src[end + 1] ?? ""));
    if (!escaped && !badClose) break;
    end++;
  }
  if (end === start) return false;

  if (!silent) {
    const token = state.push(display ? "math_inline_display" : "math_inline", "math", 0);
    token.content = src.slice(start, end);
    token.markup = delim;
  }
  state.pos = end + delim.length;
  return true;
}

export default function math(md) {
  const esc = md.utils.escapeHtml;
  md.block.ruler.before("fence", "math_block", mathBlock, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });
  // Before "escape" so backslashes inside math (\frac, \alpha) are left alone.
  md.inline.ruler.before("escape", "math_inline", mathInline);

  md.renderer.rules.math_inline = (tokens, idx) =>
    `<span class="math math-inline">\\(${esc(tokens[idx].content)}\\)</span>`;
  md.renderer.rules.math_inline_display = (tokens, idx) =>
    `<span class="math math-display">\\[${esc(tokens[idx].content)}\\]</span>`;
  md.renderer.rules.math_block = (tokens, idx) =>
    `<div class="math math-display">\\[${esc(tokens[idx].content)}\\]</div>\n`;
}
