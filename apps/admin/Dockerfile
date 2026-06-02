# React admin — multi-stage build, served as a static SPA behind nginx.
# Build context is the repo ROOT.
#
#   docker build -f apps/admin/Dockerfile -t nx-showcase-admin .

# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
# pnpm-workspace.yaml is required (workspace globs + allowBuilds).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec nx build admin

# ---- runtime stage ----
FROM nginx:1.27-alpine AS runtime
# Drop nginx's default welcome page so it can't shadow the SPA index.
RUN rm -rf /usr/share/nginx/html/*
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/admin /usr/share/nginx/html
EXPOSE 80
