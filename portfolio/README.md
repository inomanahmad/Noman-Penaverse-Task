# Noman Ahmad | Business Development Manager portfolio

A one-page animated portfolio built with plain HTML, CSS and JavaScript. It has no frameworks, no build step and no dependencies beyond two Google Fonts.

## View it

Open `index.html` in a browser, or serve the folder locally:

```bash
cd portfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

## What moves

| Section | Animation |
|---|---|
| Intro | Name reveal with a 0–100% counter, then a curtain wipe into the page |
| Hero | Live "network" canvas where signals travel between connected nodes and react to the mouse, a rotating headline word, floating dashboard cards with mouse parallax, a self-drawing chart and cycling "deal closed" notifications |
| Marquee | Two tilted tapes that loop endlessly, speed up with scroll speed and follow scroll direction |
| About | Paragraph lights up word by word as you scroll, plus a rotating gradient border on the portrait |
| Impact | Count-up numbers and a line chart that draws itself, with a hover/keyboard tooltip |
| Expertise | 3D tilt cards with a pointer-following spotlight and self-drawing icons |
| Process | Pinned horizontal "pipeline": scrolling moves a `$` deal through five stages (stacks vertically on phones) |
| Experience | Timeline that fills as you scroll and lights up each role |
| Selected wins | Case-study cards that stack on top of each other |
| Contact / footer | Magnetic buttons, floating-label form, giant name whose letters lift toward the pointer |

There is also a custom cursor, a scroll progress bar, a hide-on-scroll navigation with a sliding active-link pill, and a full-screen mobile menu.

## Make it yours

Everything to change is marked with `EDIT:` comments in `index.html`.

| What | Where |
|---|---|
| Email and LinkedIn | Replace `hello@example.com` and `https://www.linkedin.com/` (mobile menu, contact section, form `data-email`, footer) |
| Photo | In the About section, add `<img class="portrait__img" src="images/portrait.jpg" alt="...">` and delete the placeholder `div` |
| Headline numbers | The four `.kpi` cards: change both the visible text and the `data-count` / `data-prefix` / `data-suffix` values |
| Chart | Edit the rows of the table under the chart. The chart is drawn from that table. |
| Roles, case studies, skills | Plain text in the Experience, Selected wins and About sections |
| Hero dashboard | The decorative cards in `.hero__visual` (pipeline, win rate, revenue) |
| Notification messages | The `TOASTS` list in `js/main.js` |
| Colours and fonts | The tokens at the top of `css/style.css` (`--accent`, `--bg`, ...) |

All roles, companies and figures in the template are sample content. Replace them with your own before you publish.

## Publish on GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**, choose **Deploy from a branch**, select your branch and the `/ (root)` folder.
3. The site will be at `https://<username>.github.io/<repository>/portfolio/`.

## Accessibility and performance

- Respects **reduced motion**: the intro, cursor, parallax, tilt and looping animations switch off and content appears immediately.
- Works **without JavaScript**: all content stays visible and the chart falls back to its data table.
- Keyboard friendly: skip link, visible focus rings, an Escape-to-close mobile menu, and a chart you can step through with the arrow keys.
- Animations use `transform` and `opacity`, run in a single `requestAnimationFrame` scroll loop, and pause when off screen or in a background tab.

## Files

```
portfolio/
├── index.html      page content
├── css/style.css   design tokens, layout and animation states
├── js/main.js      all interactions (vanilla JS)
└── favicon.svg
```
