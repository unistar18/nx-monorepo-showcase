# React admin — multi-stage build, served as a static SPA behind nginx.
# Build context is the repo ROOT.
#
#   docker build -f apps/admin/Dockerfile -t nx-showcase-admin .

# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec nx build admin

# ---- runtime stage ----
FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
