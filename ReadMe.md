# Careflow

Careflow is a React-based frontend application scaffolded for the Base44 platform. It provides a clinical workflow UI (patients, timelines, actions, panels for doctor/nursing/pharmacy/diagnostics, etc.) using modern tooling: Vite, React 18, React Router, React Query and Tailwind CSS.

This README explains how to get the project running locally, the main features, and where to find the important code modules.

## Highlights

- React 18 app bootstrapped for Base44
- Routing via `react-router-dom` and dynamic pages configured in `src/pages.config.js`
- State and server caching via `@tanstack/react-query`
- UI primitives and components under `src/components/ui` (Radix UI + custom wrappers)
- Tailwind CSS for styling
- Integrations with Base44 SDK (Vite plugin enabled in `vite.config.js`)

## Tech stack

- React 18
- Vite
- Tailwind CSS
- React Router
- @tanstack/react-query
- Radix UI primitives
- Base44 platform plugin (`@base44/vite-plugin`)

## Prerequisites

1. Node.js 18+ and npm (or pnpm/yarn)
2. Git

## Quick start

1. Clone the repository

	git clone <repo-url>
	cd careflow

2. Install dependencies

	npm install

3. Create an environment file

	Create a file named `.env.local` in the project root and add the required environment variables. Typical values used by the Base44 integration:

	VITE_BASE44_APP_ID=your_app_id
	VITE_BASE44_APP_BASE_URL=https://your-backend.example

	Replace `your_app_id` and `your-backend.example` with your Base44 app id and backend URL.

4. Start dev server

	npm run dev

5. Open the app

	The Vite dev server will show the local URL (usually `http://localhost:5173`). Open it in your browser.

## Useful scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint issues
- `npm run typecheck` — run TypeScript typecheck using `jsconfig.json`

These scripts are defined in `package.json`.

## Project structure (important parts)

- `src/`
  - `main.jsx` — app entry and mounting
  - `App.jsx` — root application: routing, auth provider, query client, layout
  - `pages.config.js` — maps page keys to page components and layout; used to render pages dynamically
  - `components/` — UI components and domain components
	 - `ui/` — design-system primitives (buttons, dialog, toast, etc.)
	 - `shared/` — patient card, timeline, search, workflow tracker, etc.
	 - `doctor/`, `department/` — domain-specific dialogs and panels
  - `lib/` — helpers, AuthContext, query client, navigation tracker, PageNotFound
  - `hooks/` — custom hooks (e.g. `use-mobile.jsx`)

- `entities/` — domain entities (ClinicalAction, Patient, TimelineEvent) used by the app
- `api/` — API wrapper(s) and Base44 client code under `api/base44Client.js`

## Base44 integration notes

- `vite.config.js` includes the `@base44/vite-plugin` which wires hot reloading and platform-specific features.
- The app expects Base44-related env variables (see Quick start). When running within the Base44 builder/publisher the platform provides these automatically.

## Authentication & routing

- The app wraps routes with an `AuthProvider` (see `src/lib/AuthContext.jsx`). The `App.jsx` file checks `isLoadingAuth`/`isLoadingPublicSettings` and shows an intermediate loading spinner.
- If a user is not registered the app renders `UserNotRegisteredError.jsx`.

## Development tips

- Pages and their layout mapping live in `src/pages.config.js` — update that file to add new pages.
- Use the `QueryClient` (React Query) instance from `src/lib/query-client.js` for server data fetching and caching.
- UI primitives are in `src/components/ui` and are safe to reuse across pages.

## Tests & quality

- This repository includes ESLint and basic typechecking scripts. Run `npm run lint` and `npm run typecheck` locally.
- There are no automated unit tests included in the repo by default. Consider adding a small test harness (Jest + React Testing Library) for critical components.

## Troubleshooting

- If you see SDK import errors, check `vite.config.js` for `legacySDKImports` and the environment variable `BASE44_LEGACY_SDK_IMPORTS`.
- For styling issues, ensure Tailwind is installed and `index.css` includes the Tailwind directives.

## Where to look next (important files)

- `src/pages.config.js` — page mapping
- `src/App.jsx` and `src/main.jsx` — app bootstrapping and routing
- `src/lib/AuthContext.jsx` — authentication flow
- `api/base44Client.js` — Base44 client helpers

## License

This repository does not include a license file. Add a `LICENSE` if you plan to publish or open source the code.

---

If you want, I can also:

- Add a small CONTRIBUTING.md with development conventions.
- Add a minimal `Makefile` or npm script wrapper for common dev tasks.
- Add a short README section with how to run the project inside the Base44 builder specifically.

Tell me which of those you'd like and I'll add it.