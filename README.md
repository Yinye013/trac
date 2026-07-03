# job-tracker

A personal full-stack job application tracker, built as a pnpm monorepo.

## Structure

```
job-tracker/
├── apps/
│   ├── api/       # NestJS backend (@job-tracker/api) — runs on port 3001
│   └── web/       # Next.js frontend (@job-tracker/web) — runs on port 3000
├── packages/
│   └── shared/    # Shared TypeScript types (@job-tracker/shared),
│                  # consumed by both apps via workspace linking
├── package.json          # workspace root — no runtime deps of its own
├── pnpm-workspace.yaml   # declares apps/* and packages/* as workspace members
└── pnpm-lock.yaml        # single lockfile for the whole monorepo
```

This is a pnpm **workspace**: a single repo containing multiple installable
packages that can depend on each other locally without being published to npm.
`packages/shared` is built to plain JS/type declarations and linked into
`apps/api` and `apps/web` via the `workspace:*` protocol, so both apps can
import shared types (e.g. request/response DTOs) from one source of truth.

## Getting started

Install everything once from the root (pnpm resolves and links all three
packages together):

```bash
pnpm install
```

Build the shared package (needed once, and again any time its source changes,
since the apps import its compiled output):

```bash
pnpm build:shared
```

Run the apps (in separate terminals):

```bash
pnpm dev:api   # NestJS on http://localhost:3001
pnpm dev:web   # Next.js on http://localhost:3000
```

## Why a monorepo?

Keeping the API, the web frontend, and shared types in one repo means:

- Shared TypeScript types (e.g. a `JobApplication` shape) are defined once in
  `packages/shared` and used by both the backend and frontend — no copy-pasting
  types or drift between them.
- One `pnpm install` at the root sets up all three packages together, and pnpm
  symlinks the local `@job-tracker/shared` package into the other two instead
  of needing it published anywhere.
- One lockfile (`pnpm-lock.yaml`) for consistent dependency versions across
  the whole project.
