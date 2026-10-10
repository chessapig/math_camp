# math_camp

Activities for my math summer camp. Each activity and each week is a Markdown file
in `src/`, and [Eleventy](https://www.11ty.dev/) turns them into a Bootstrap website
with automatic shopping lists and PDFs.

## Writing content

Open the `src/` folder as a vault in Obsidian (**Open folder as vault**). The vault is
preconfigured so that pasted images go into `src/assets/images/` and the camp's
templates are available from **Templates: Insert template** in the command palette
(assign it a hotkey under Settings → Hotkeys).

| Template        | What it inserts                                     |
| --------------- | --------------------------------------------------- |
| `new-activity`  | A blank activity with front matter                  |
| `new-week`      | A blank week schedule                               |
| `rules`         | The highlighted rules card                          |
| `facilitation`  | A collapsible "Facilitation notes" dropdown         |
| `image`         | An image card with caption, source, and alt text    |
| `safety`        | A red safety warning                                |

### Activities: `src/activities/<name>.md`

The front matter holds the facts shown in the "At a glance" card and the materials table:

```yaml
---
title: Spaghetti Towers
summary: One sentence shown on cards and at the top of the page.
duration: 40 min
ages: 9–14
group_size: Teams of 3–4
location: Indoors
topics: [geometry, triangles]
materials:
  - item: Uncooked spaghetti (1 lb box)
    qty: 2
    cost: 1.50          # per unit
    consumable: true    # used up; omit or set false for reusable items
    notes: Optional note shown under the item
---
```

The body is ordinary Markdown plus these Obsidian callouts, which also display nicely
inside Obsidian:

```markdown
> [!rules]
> 1. The highlighted card facilitators skim for.

> [!facilitation] Optional custom title
> Hidden behind a dropdown on the website; always expanded in PDFs.

> [!figure] Caption for the image
> ![Alt text describing the image](tower.png)
> Source: Where the image came from

> [!tip] / [!note] / [!warning] / [!safety]
> Colored Bootstrap alerts.
```

### Math

Write math the same way you do in Obsidian: `$x+1$` inline, and `$$ ... $$` for display
math. The website and PDFs render it with MathJax. Prices like "$2 and $3" stay plain text,
following the same rules as Obsidian; write `\$` if you need a literal dollar sign next to math.

### Interactive sketches: `src/sketches/<name>/`

Put self-contained HTML pages (e.g. p5.js sketches) in their own folder under `src/sketches/`.
They are copied to the site exactly as they are. Inside a sketch, refer to its own files with
relative paths (`sketch.js`, not `/sketch.js`). From an activity, link or embed it:

```markdown
[Open the simulation](/sketches/pig-strategy/)

<iframe src="/sketches/pig-strategy/" width="100%" height="420"></iframe>
```

### Weeks: `src/weeks/<name>.md`

List activities per day by file name (without `.md`). The week page builds the shopping
list automatically. Consumables are added up across every scheduled activity; reusable
items count once, at the largest quantity any single activity needs. Items are matched by
name, so spell shared items the same way everywhere (e.g. `Masking tape (roll)`).

```yaml
---
title: "Week 1: Shapes and Chances"
days:
  - day: Monday
    activities: [mobius-strips, pig-dice-game]
  - day: Tuesday
    activities: [spaghetti-towers]
---
```

## PDFs

Every activity and week gets a PDF, and `/print/` puts the whole site on one page
that is saved as `math-camp-handbook.pdf`. The PDFs are generated with headless Chrome
(Puppeteer) when the site is deployed. Any page can also be printed straight from the browser.

## Running locally

```sh
npm install
npm start            # live-reloading preview at http://localhost:8080
npm run build:all    # build the site and generate the PDFs into _site/
```

PDF links only work locally after you run `npm run build:all`.

## Publishing on GitHub Pages

`.github/workflows/deploy.yml` builds the site and the PDFs on every push to `main`. To turn it on
once: in the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
The site will be at `https://chessapig.github.io/math_camp/`.

## Layout of the repository

```
src/                      Obsidian vault and Eleventy input
  activities/*.md         one page per activity
  weeks/*.md              one page per week
  assets/images/          images (Obsidian attachment folder)
  sketches/<name>/        self-contained HTML/p5.js pages, copied as-is
  _templates/             Obsidian templates (not published)
  _includes/              page layouts and shared macros
  print.njk               the all-in-one handbook page
lib/callouts.js           turns callouts into Bootstrap components
lib/materials.js          cost and shopping-list calculations
scripts/pdf.js            renders pages to PDF
eleventy.config.js        Eleventy configuration
```
