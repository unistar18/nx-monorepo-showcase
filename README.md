# nx-monorepo-showcase

A small Nx monorepo I put together to play with running more than one frontend
framework in the same workspace. One product-catalog domain, served by an Angular
storefront and a React admin, both talking to an Express API — and all three share
the same libraries.

## Stack

- **Nx** workspace, **pnpm**
- **shop** — Angular (signals + HttpClient)
- **admin** — React + Vite
- **api** — Express
- Shared libs: `@org/models` (types) and `@org/util-format` (formatters), used by
  both frontends and the API

## Running it

```bash
pnpm install

# dev (separate terminals)
npx nx serve api      # http://localhost:3333
npx nx serve shop     # http://localhost:4200  (also starts the api)
npx nx serve admin    # http://localhost:4201

# or the whole thing in docker
docker compose up --build
```

shop → 4200, admin → 4201, api → 3333. Both frontends call a relative `/api`,
proxied to the API in dev and through nginx in the docker build.

## Common commands

```bash
npx nx graph                       # dependency graph
npx nx run-many -t lint test build # everything
npx nx affected -t lint test build # only what changed
```

## Layout

```
apps/
  shop      Angular storefront   (scope:shop)
  admin     React admin          (scope:admin)
  api       Express API          (scope:api)
libs/
  shared/models        @org/models        types shared by everything
  shared/util-format   @org/util-format   pure formatters
  shop/*               feature / data / shared-ui  (Angular)
  admin/*              feature / data / ui          (React)
  api/products         product service for the API
tools/
  workspace-plugin     custom generator (below)
```

Every lib is tagged with a `scope:` (domain) and a `type:` (layer), and those tags
are enforced in `eslint.config.mjs` via `@nx/enforce-module-boundaries` — so a
shop lib can't import an admin lib, a util can't import a feature, etc. Try it:
add a cross-domain import and run `npx nx lint`.

## Adding a library

There's a small generator that scaffolds a lib already tagged correctly, so the
boundary rules don't get broken by a forgotten tag:

```bash
npx nx g @org/workspace-plugin:domain-lib admin data-orders --type=data --framework=react
```

## Notes

- API data is in-memory — there's no database, it's not the point here.
- CI (`.github/workflows/ci.yml`) runs `nx affected` and is wired for Nx Cloud
  remote caching / task distribution (needs an `NX_CLOUD_ACCESS_TOKEN` to go live).
