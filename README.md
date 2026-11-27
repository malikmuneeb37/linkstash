# LinkStash

A private, browser-only bookmark manager for people who save a lot of links and then never find them again. All data stays in your browser's `localStorage`; there is no account and no backend.

## Features

- Add, edit, and delete bookmarks with tags and notes
- Favorites and read-later flags
- Search and sort your collection
- Automatic tagging from domain rules (AI, video, dev, news, jobs, and more)
- Detect and remove duplicate links
- Import from JSON, CSV, or a browser HTML bookmarks export
- Export to JSON, CSV, or HTML
- Favicon tiles with a colored-initial fallback when offline
- Installable PWA with a service worker
- Privacy and terms pages

## Privacy

Bookmarks, tags, and notes never leave your device. The one external request is to Google's public favicon service for icon tiles. Export a backup regularly — clearing browser data removes your saved links.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Storage | Browser `localStorage` |
| Tooling | ESLint 9 |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The static site is written to `out/`.

## Project structure

```
src/
├── app/page.tsx                    Landing page
├── components/BookmarkDashboard.tsx  Main dashboard UI
├── lib/bookmarks.ts                Storage, tagging, import/export logic
├── app/privacy/page.tsx            Privacy policy
└── app/terms/page.tsx              Terms of use
```
