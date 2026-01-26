# Copilot Instructions for Portfolio Project

## Tech Stack & Architecture

- **Framework**: Svelte 5 (Runes) is mandatory. Use `$state`, `$derived`, `$props`, and `$effect`.
- **CSS**: Tailwind CSS 4 via Vite plugin. Use utility classes for all styling.
- **Visuals**:
  - `Three.js` and `three-globe` for the 3D globe.
  - `MapLibre GL` for 2D maps.
  - Canvas 2D for interactive backgrounds.
- **Data Flow**: Core content (projects, travel, archive) is stored in `src/lib/data/*.json`. Components should import these JSON files directly.
- **Constants**: Shared info (Email, Socials) must be imported from `src/lib/constants.ts`.

## Project Conventions

- **Hydration & SSR**: Components involving browser-only APIs (`window`, `document`, `three`, `maplibre-gl`) must:
  - Check for `browser` from `$app/environment`.
  - Or be dynamically imported within `onMount` (see `src/lib/components/travel/Travel.svelte`).
- **Design Pattern**:
  - Sections follow a specific visual hierarchy:
    ```svelte
    <div class="flex items-center gap-3">
    	<div class="h-px w-8 bg-emerald-500/50"></div>
    	<span class="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">TITLE</span>
    </div>
    ```
  - Primary accent color: `emerald-400/50`.
  - Secondary text: `gray-400` or `gray-500`.
  - Background: `black` or `white/[0.03]` for cards.

## Critical Workflows

- **Development**: `bun run dev`
- **Type Checking**: `bun run check` (crucial for Svelte 5 rune types)
- **Formatting**: `bun run format` (uses Prettier with Tailwind plugin)
- **AI Coding**: Refer to `AGENTS.md` for instructions on using the Svelte MCP server for documentation and code fixing.

## Key Files

- `src/routes/+page.svelte`: Main entry point for the single-page layout.
- `src/lib/data/`: Source of truth for all portfolio content.
- `src/lib/components/travel/`: Most complex logic involving dynamic imports and heavy libraries.
