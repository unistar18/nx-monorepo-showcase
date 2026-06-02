# Express API — multi-stage build. Build context is the repo ROOT.
#
#   docker build -f apps/api/Dockerfile -t nx-showcase-api .

# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
# Copy the workspace manifests first for better layer caching.
# pnpm-workspace.yaml is required: it holds the workspace globs + allowBuilds.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec nx build api

# ---- runtime stage ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

# nx/webpack emits a self-contained build incl. a package.json with prod deps.
COPY --from=build /workspace/apps/api/dist ./
RUN npm install --omit=dev

EXPOSE 3333
CMD ["node", "main.js"]
