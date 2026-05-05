# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Souq Capital Website (artifacts/souq-capital)

A pixel-perfect React + Vite replication of souq.capital (a Framer site for Souq Capital, an Islamic-aligned working capital firm).

### Tech Stack
- React + Vite + Tailwind v4
- Framer Motion (scroll reveal animations)
- Wouter (routing)
- Inter font (Google Fonts, weights 300–900)

### Key Design Values (extracted from Framer source)
- **Hero title** (h1): 160px / weight 600 / letter-spacing -9.5px / line-height 1em
- **Body h3**: 28px / weight 500 / letter-spacing -1.2px / color #14181A
- **Section h2**: 56px / weight 600 / letter-spacing -1.7px
- **About heading**: 36px / weight 700 / letter-spacing -1.2px
- **Step h4**: 24px / weight 600 / letter-spacing -1.1px
- **Body paragraph**: 18px / weight 400 / letter-spacing -1.1px / color #666
- **Section label**: 15px / weight 500 / color #787777
- **Font features**: "blwf" on, "cv09" on, "cv03" on, "cv04" on, "cv11" on (all headings)
- **Brand color**: #14181A (near-black)

### Layout Values (from Framer CSS)
- **Hero section**: height 100vh; padding 120px 50px 24px; content at flex-end
- **Hero content**: max-width 1320px; flex row space-between
- **Souq title column**: fixed 372px width; flex: none
- **Tagline column**: max-width 49%
- **All other sections**: padding 50px sides; max-width 1320px
- **About section**: padding 49px 50px 30px; gap 80px
- **How it works**: padding 50px 50px 100px
- **Compare/Reviews/Team/FAQ/CTA**: padding 100px 50px
- **Navbar link gap**: 84px
- **Hero grid lines**: 5 dividers at 0%, 25%, 50%, 75%, 100% within 1320px container; 2 horizontal lines at 33%/66%

### Sections
1. Navbar (fixed, border-bottom, 84px gap between nav links)
2. Hero (100vh, large "Souq" title + tagline grid layout, ticker strip)
3. About (two-column: "What we do" / "Why we do it")
4. How it Works (4-column step cards + dark "Repay Souq" card)
5. Compare (Souq vs Traditional Funding)
6. Portfolio Logos (grayscale logos)
7. Client Reviews (2×2 grid desktop, carousel mobile)
8. Team (4-column photo grid)
9. FAQs (accordion)
10. CTA (dark section with Apply Now)
11. Footer

### Routes
- `/` — main landing page
- `/apply` — application form page
