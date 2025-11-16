# WineLog

> A web application that guides beginner and intermediate winemakers (and mead enthusiasts) through the entire production process — step-by-step, fully documented, and available on any device.

## Table of Contents
1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started Locally](#getting-started-locally)
4. [Available Scripts](#available-scripts)
5. [Deployment to CloudFlare Pages](#deployment-to-cloudflare-pages)
6. [Project Scope (MVP)](#project-scope-mvp)
7. [Project Status](#project-status)
8. [License](#license)

## Project Description
WineLog simplifies home wine and mead making by providing:
- A template-driven workflow with predefined production stages and durations.
- Detailed, beginner-friendly instructions for every step.
- The ability to run multiple batches in parallel, each with its own timeline and notes.
- A chronological note system to document actions and observations.
- An archive to review and rate finished batches.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Astro 5, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Shadcn/ui, Radix UI |
| Backend-as-a-Service | Supabase (PostgreSQL, Auth, Storage) |
| Deployment | CloudFlare Pages (with @astrojs/cloudflare adapter) |
| Tooling | Node 22.14, Vite, ESLint, Prettier |

## Getting Started Locally
```bash
# 1. Clone the repository
$ git clone https://github.com/your-org/winelog.git
$ cd winelog

# 2. Install dependencies (requires Node >= 22.14)
$ npm install

# 3. Start the development server
$ npm run dev
# The app is now available at http://localhost:4321

# 4. Build for production
$ npm run build
```

> **Tip**
> WineLog uses Supabase. During local development you can either:
> 1. Point the `.env` variables at a hosted Supabase project, **or**
> 2. Run Supabase locally with `supabase start`.

## Available Scripts
Command | Purpose
--- | ---
`npm run dev` | Start Astro in dev mode with hot-reload
`npm run build` | Build a static production bundle
`npm run preview` | Preview the production build locally
`npm run astro <cmd>` | Run arbitrary Astro CLI commands
`npm run lint` | Lint all files with ESLint
`npm run lint:fix` | Lint and auto-fix issues
`npm run format` | Format code with Prettier
`npm test` | Run unit tests with Vitest
`npm run test:ui` | Run unit tests in interactive UI mode
`npm run test:e2e` | Run E2E tests with Playwright (see [e2e/README.md](e2e/README.md))
`npm run test:e2e:ui` | Run E2E tests in interactive UI mode

## Deployment to CloudFlare Pages

This project is configured to deploy on CloudFlare Pages using the `@astrojs/cloudflare` adapter.

### Environment Variables Setup

**Important:** CloudFlare Pages environment variables are **runtime variables**, not build-time variables. They must be configured in the CloudFlare Pages dashboard.

1. Go to your CloudFlare Pages project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **both Production and Preview** environments:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_KEY` - Your Supabase anon/public key

### Deployment Process

#### Option 1: Manual Deployment with Wrangler
```bash
# Build the project
npm run build

# Deploy to CloudFlare Pages
npx wrangler pages deploy dist --project-name=winelog
```

#### Option 2: Automatic Deployment
Connect your GitHub repository to CloudFlare Pages for automatic deployments on push.

**Build Configuration:**
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty)
- **Environment variables:** Set `SUPABASE_URL` and `SUPABASE_KEY` in dashboard

### Branch Configuration

The CloudFlare Pages dashboard allows you to configure different branches for different environments:

- **Production branch:** `main` - deploys to production environment
- **Preview branches:** All other branches (e.g., `develop`) - deploy to preview environment

Make sure both environments have the correct `SUPABASE_URL` and `SUPABASE_KEY` variables configured.

### Troubleshooting

If you see errors about missing `SUPABASE_URL` or `SUPABASE_KEY`:

1. ✅ Verify the environment variables are set in CloudFlare Pages dashboard
2. ✅ Check that variables are set for the correct environment (Production vs Preview)
3. ✅ Ensure the branch is correctly associated with the environment
4. ✅ Redeploy after adding/updating variables

### Local Development with Wrangler

For local development with CloudFlare Workers emulation:

1. Create a `.dev.vars` file (not committed to git):
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

2. Run with wrangler:
```bash
npx wrangler pages dev dist
```

## Project Scope (MVP)
- **User Accounts** – Email/password registration, soft email verification, 30-day sessions, account deletion.
- **Batch Templates** – Red, white, rosé, fruit wine, and traditional mead with predefined stages.
- **Production Stages** – Sequential progression (prepare → ferment → clarify → mature → bottle) with guidance and safeguards.
- **Notes** – CRUD for dated notes tied to stages.
- **Archive & Rating** – Move finished batches to archive and rate 1-5 stars.
- **Dashboard** – Mobile-first overview of all active batches plus archive access.

_Out of scope for MVP_: native mobile apps, advanced calculators, social features, notifications, custom templates, offline mode, exports.

## Project Status
[![GitHub CI](https://img.shields.io/github/actions/workflow/status/your-org/winelog/ci.yml?branch=main&label=CI)](../../actions)
[![Version](https://img.shields.io/static/v1?label=version&message=0.0.1&color=blue)](./package.json)

The project is in active **MVP development**. Core features are being implemented; expect breaking changes until v1.0.0.

## License
This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.
