# MalDet Commercial Website

Astro 7 + React 19 islands + Tailwind CSS v4 marketing site (three static pages).

## Development Server

A dev server may already be running on `$PORT` (default 4321 locally). Start it with `pnpm run dev` if not. Changes to source files hot reload.

## Project Structure

- `src/pages/*.astro` - One file per route (`/`, `/documentation`, `/contact`); each mounts `SiteShell` with `client:load`
- `src/layouts/BaseLayout.astro` - Document head, SEO meta, fonts and the pre-paint boot script (theme, preloader flag, legacy hash redirect)
- `src/components/SiteShell.tsx` - React island: preloader, header, footer, smooth scroll and the active page view
- `src/views/` - Page bodies; `src/components/{ui,layout,home,docs,contact}` - building blocks
- `src/data/` - Navigation and all page content/data
- `src/styles/main.css` - Tailwind v4 import plus `global.css` (all site styling and theme tokens)
- `astro.config.mjs`, `tsconfig.json`, `package.json`, `.mise.toml` - Tooling (Node 22, pnpm)

## Commands

- `pnpm run dev` - dev server
- `pnpm run typecheck` - `astro sync` + `tsc --noEmit`
- `pnpm run build` - static output to `dist/`

## Code quality

- Components render on the server first: never touch `window`/`document`/storage during render, only inside effects or handlers, and keep first client render identical to server render.
- Use double quotes for strings containing apostrophes, keep JSX tags closed and braces balanced.
- Export components as default exports.
- Tailwind utilities vs project tokens: `--color-white` is redefined in `global.css` (it is dark inside `.stage` bands), so `text-white`, `bg-white` and `border-white/…` do not give white. Use explicit values such as `text-[#ffffff]` or `border-[#ffffff1a]`. Unlayered rules in `global.css` also beat Tailwind utilities, so remove the old rule instead of fighting it.
- Navigation uses real links (`<a href>`); add new pages under `src/pages/` and `src/data/navigation.ts`.
