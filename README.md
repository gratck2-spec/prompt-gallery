# Prompt Gallery

A static gallery for browsing and copying AI image generation prompts. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

## Features

- Dark Studio theme with teal accent
- Masonry grid layout (responsive: 1/2/3 columns)
- Category filtering and search
- Prompt detail modal with copy-to-clipboard
- Light/dark mode toggle (persisted in localStorage)
- Mobile-first responsive design

## Run Locally

```bash
cd prompt-gallery
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deploy to Vercel

```bash
npx vercel
```

Or connect the repository to Vercel for automatic deployments.

## File Structure

```
prompt-gallery/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── gallery.js
│   ├── modal.js
│   └── data.js
├── data/prompts.json
├── robots.txt
├── sitemap.xml
└── README.md
```

## Adding Prompts

Edit `data/prompts.json` and add new entries following the existing schema. Each prompt needs: `id`, `title`, `image`, `thumbnail`, `prompt`, `negative_prompt`, `model`, `aspect_ratio`, `category`, `tags`, `description`, and `created_at`.
