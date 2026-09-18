# Brightpath Academy

A local-first K–5 learning adventure. Students choose a grade and subject, learn each concept through a short guided explanation, complete a ten-part practice level, earn stars, and explore locally packaged games.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Notes

- Student progress is stored locally in the browser.
- The included arcade games run from local files under `public/arcade`.
- The `work/` folder is intentionally excluded from Git because it contains large local vendor/reference workspaces, not production runtime files.
