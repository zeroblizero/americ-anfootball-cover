# americ anfootball cover

A fully static, client-side web app that lets you recreate the aesthetic of the **American Football** self-titled album cover. Upload a photo, crop it to a square, drag the "americ an football" text overlay into position, and download the result as a PNG — all in the browser, no server required.

---

## Features

- 📷 **Upload** any photo via drag-and-drop or file picker
- ✂️ **Crop** to a square with a live pan/zoom crop tool
- ✍️ **Text overlay** — "americ an" / "football" in the album cover style (white, light weight, wide letter-spacing)
- 🖱️ **Draggable text** — reposition the overlay with mouse or touch; reset with one click
- 💾 **Download** the final image as `americ-anfootball.png`
- 🎵 **Random lyric banner** — a different American Football quote on every visit

---

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/zeroblizero/americ-anfootball-cover.git
cd americ-anfootball-cover

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build
# Output is in dist/
```

---

## Font

The overlay text currently uses **Lato Light** (weight 300) loaded from Google Fonts — a free placeholder that approximates the album cover aesthetic.

The original album uses **Imago Regular** by URW Type Foundry, a commercial font. If you purchase a webfont license:

1. Place the `.woff2` file in `public/fonts/`
2. Uncomment the `@font-face` block in `src/index.css`
3. Change `--font-overlay` to `'Imago', sans-serif`

That's the only change needed. A clear `TODO` comment in `src/index.css` marks the exact location.

> **Licensing note:** Imago Regular is not bundled in this repository. `public/fonts/` is an empty placeholder directory. Do not add a font file without a valid webfont license from the foundry.

---

## Tech stack

| Tool | Purpose |
|---|---|
| [Vite](https://vite.dev/) | Build tool / dev server |
| [React](https://react.dev/) | UI framework |
| [react-easy-crop](https://github.com/ValentinH/react-easy-crop) | Crop UI component |
| Canvas API | Image compositing and text rendering |

No UI framework — plain CSS only. No backend, no API calls.

---

## Deploying

The `dist/` output is fully static and can be hosted anywhere:

- **Vercel**: connect the repo, zero config needed
- **Netlify**: drag-and-drop `dist/` or connect via Git
- **GitHub Pages**: push `dist/` to the `gh-pages` branch
