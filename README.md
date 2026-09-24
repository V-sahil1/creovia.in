# Kai Vance — Editorial Portfolio

Responsive build of the Stitch design `kai_vance_luxury_editorial_portfolio` using the
"Obsidian Atelier" design system (`../obsidian_atelier/DESIGN.md`).

Stack: Vite + Tailwind CSS 3 + vanilla JS (no framework).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

## Structure

- `index.html` — the full single-page site (markup from the Stitch export)
- `src/main.js` — interactions: preloader, custom cursor, project filters, case-study drawer,
  services accordion, brief form chips, clipboard copy, mobile menu, active-nav highlighting
- `src/style.css` — Tailwind entry + base styles
- `tailwind.config.js` — design tokens (colors, type scale, spacing) from DESIGN.md
- `public/images/` — mockup/portrait/logo assets copied from the design folders

## Lead emails

The project brief form posts to `api/lead.js` (a Vercel serverless function), which emails each
submission to the studio inbox via Gmail SMTP. Set these env vars (see `.env.example`) in a local
`.env` for `npm run dev`, and in Vercel → Project → Settings → Environment Variables for production:

- `GMAIL_USER` — the Gmail account that sends the email
- `GMAIL_APP_PASSWORD` — a Google App Password (requires 2-Step Verification)
- `LEAD_TO` — optional recipient, defaults to `GMAIL_USER`
