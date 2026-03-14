# honours-programme

## Salamanca 2030 static site

This repository contains a simple static website presenting the **Salamanca 2030** proposal:

- Page 1 – Home: political framing, core message, mayor’s message, three promises and vision.
- Page 2 – The Program: measures 1–9, implementation timeline and funding.
- Page 3 – Interactive Map: Leaflet map of Salamanca with clickable interventions showing street reimagining images.

### Structure

- `index.html` – single-page layout with sections `#home`, `#program`, `#map`.
- `css/style.css` – typography, layout, responsive behaviour and modal styles.
- `js/app.js` – Leaflet map setup, data for locations and modal behaviour.
- `callede*.png` – rendered images of redesigned Salamanca streets.
- `madridlogo.png` – logo used in the header.

### Running locally

You can open `index.html` directly in a browser, or run a small static server for nicer local URLs, for example:

```bash
cd honours-programme
python -m http.server 8000
```

Then visit `http://localhost:8000/` in your browser.

### Deploying on GitHub Pages

1. Commit and push the static site:

   ```bash
   git add index.html css js *.png
   git commit -m "Add Salamanca 2030 static site"
   git push
   ```

2. In the GitHub web UI, go to **Settings → Pages** for this repository.
3. Under **Source**, choose:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Save; after a short delay the site will be available at:

- `https://<your-username>.github.io/honours-programme/`
