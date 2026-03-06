# Church Management System (CMS) — Frontend

A Vue 3 frontend for a Church Management System (CMS) using Vite, Pinia and Vuetify.

This repository contains the UI for admin and member functionality: dashboards, member directory, contributions, events, projects, and resource management.

---

## Key Features

- Admin and Member sections with role-based routing and navigation guards
- Vuetify-based UI with a custom theme
- State management with Pinia
- Axios configured for API requests (token attached from localStorage)
- Lazy-loaded route components for improved performance

---

## Tech Stack

- Vue 3
- Vite
- Vuetify 3
- Pinia
- Vue Router 4
- Axios

---

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

---

## Useful Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — locally preview production build

These scripts are defined in `package.json` and use Vite.

---

## Project Structure (high level)

- `src/main.js` — App bootstrap: registers Pinia, router, Vuetify and runs initial `authStore.checkAuth()`
- `src/App.vue` — top-level app shell with `<router-view/>`
- `src/router/index.js` — route definitions, public/admin/member layouts, and navigation guards
- `src/plugins/axios.js` — axios instance with `baseURL` and Authorization header interceptor
- `src/plugins/vuetify.js` — Vuetify setup and custom theme
- `src/stores/` — Pinia stores (e.g. `authStore.js`, `memberStore.js`, `financeStore.js`, etc.)
- `src/views/` — page views (split into `admin/` and `member/` folders)
- `src/components/` — reusable UI components (e.g. `members/MemberForm.vue`, `members/MemberTable.vue`)
- `src/composables/` — custom composition utilities (e.g. `useContributionForm.js`, `useDashboardData.js`)
- `src/layouts/` — top-level layouts for `AdminLayout.vue` and `MemberLayout.vue`
- `src/assets/styles/` — global styling

---

## Routing & Authentication Notes

- Routes are declared in `src/router/index.js`. There are public routes (e.g. `/login`) and protected routes under `/admin` and `/member`.
- The router uses navigation guards to:
  - restore auth from `authStore` (which checks `localStorage`) if needed
  - redirect unauthenticated users to `/login`
  - enforce admin-only routes via `meta.requiresAdmin`
  - set `document.title` from `route.meta.title`

Auth is initialized in `src/main.js` where `authStore.checkAuth()` runs before the app proceeds.

---

## API Configuration

- The Axios instance is in `src/plugins/axios.js` with `baseURL` set to `http://localhost:4000/api`.
- The request interceptor attaches a `Bearer` token from `localStorage` (key: `churchAuth`).
- Recommendation: replace the hardcoded base URL with an environment variable, for example `import.meta.env.VITE_API_BASE_URL`.

---

## Development Tips

- If you see errors about CORS or network requests failing, ensure the backend at `http://localhost:4000` is running and allows requests from the frontend origin.
- To change the API endpoint for different environments, add `VITE_API_BASE_URL` to a `.env` / `.env.local` and update `src/plugins/axios.js`.
- If a store fails to initialize, confirm `app.use(pinia)` is called before any `useXStore()` calls (this project calls stores after registering Pinia).

---

## Next Steps / Suggestions

- Add `.env.example` with `VITE_API_BASE_URL` and other runtime config values.
- Convert axios `baseURL` to use `import.meta.env.VITE_API_BASE_URL` for easier environment switching.
- Add a short CONTRIBUTING.md and code style/formatting configuration if multiple contributors will work on the project.

---

## License

Specify license information here (e.g. MIT) or remove this section if not applicable.

---

If you'd like, I can:
- run `npm run dev` and troubleshoot the `Exit Code: 130` you observed,
- replace the hardcoded API URL with `VITE_API_BASE_URL` and show how to use `.env` files,
- or generate a `.env.example` and a simple CONTRIBUTING guide.

---

Created from project scan on 2026-03-04.
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
