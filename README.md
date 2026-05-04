# americ anfootball cover generator

A fully static, client-side web app that lets you recreate the aesthetic of the **American Football** self-titled album cover.
Upload a photo, crop it to a square, drag the "americ anfootball" text overlay into position, and download the result as a PNG — all in your browser, no server required.

---

## Features

- 📷 **Upload** any photo via drag-and-drop or file picker
- ✂️ **Crop** to a square with a live pan/zoom crop tool
- ✍️ **Text overlay** — "americ an" / "football" in the album cover style
- 🖱️ **Draggable text** — move the overlay to desired position, reset with one click
- 💾 **Download** the final image as `americ-anfootball.png`

**Bonus Features:**

- 🎵 **Random lyric banner** — a different American Football quote on every visit
- 🏠 **Random background** chosen from one of American Football album covers
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

## Tech stack

| Tool | Purpose |
|---|---|
| [Vite](https://vite.dev/) | Build tool / dev server |
| [React](https://react.dev/) | UI framework |
| [react-easy-crop](https://github.com/ValentinH/react-easy-crop) | Crop UI component |
| Canvas API | Image compositing and text rendering |

No UI framework — plain CSS only. No backend, no API calls. Quick and lightweight.