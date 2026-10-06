# MQL Dashboard

A responsive SaaS sales dashboard recreated from the visual direction of [BetaCRM UI Kit by WhiteUI.Store](https://whiteui.store/preview/betacrm), with MQL branding and original HTML, CSS, and JavaScript.

## Run locally

Requires Node.js 20 or newer. No dependencies or installation step are needed.

```sh
npm start
```

Open **http://localhost:4173**. Set `PORT` to use a different port. Run `npm run check` to check JavaScript syntax.

You can also open `index.html` directly, or serve `index.html`, `styles.css`, and `app.js` using any static web host. The included preview server listens on localhost only.

## Included

- Responsive desktop sidebar and mobile navigation
- Overview, contacts, sales pipeline, tasks, and performance views
- Month, quarter, and year sample analytics
- Revenue chart, target progress, and KPI cards
- Searchable deals and contacts, with stage filtering
- Add-deal dialog with browser-local persistence
- Task completion with browser-local persistence
- CSV exports for deals, tasks, and performance
- Accessible native controls, keyboard focus indicators, and dialogs

## Demo boundaries

All displayed companies, contacts, revenue, tasks, and trends are illustrative sample data. KPI totals and chart series are independent design fixtures; they are not computed from the small deals table. New deals do not change the sample analytics. Dates intentionally represent an October 2026 demo workspace.

New deals and task completion are saved in this browser's local storage. There is no backend, login, live CRM integration, or cross-device synchronization. Clear this site's browser storage to reset the demo. Avoid entering real customer data until a secure backend is connected.

The DM Sans font loads from Google Fonts, with local system font fallbacks. Everything else is served locally. No analytics or tracking scripts are included.

## Files

- `index.html`: semantic dashboard structure and dialogs
- `styles.css`: visual system and responsive layouts
- `app.js`: demo data, charts, navigation, filtering, exports, and local state
- `server.mjs`: dependency-free local preview server

## Design reference

Reference: BetaCRM UI Kit by WhiteUI.Store. This is an independently authored visual recreation, not the official commercial kit, its source files, or an affiliated product. No paid kit assets are bundled.
