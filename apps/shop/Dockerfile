# Angular shop — multi-stage build, served as a static SPA behind nginx.
# Build context is the repo ROOT.
#
#   docker build -f apps/shop/Dockerfile -t nx-showcase-shop .
#
# Note: the shop is configured for SSR, but for the container we serve the
# prerendered browser bundle as a SPA and let nginx proxy /api. That keeps the
# deployment simple and stateless; swapping to the SSR Node server would mean
# running dist/apps/shop/server instead.

# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
# pnpm-workspace.yaml is required (workspace globs + allowBuilds).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec nx build shop

# ---- runtime stage ----
FROM nginx:1.27-alpine AS runtime
# Drop nginx's default welcome page so it can't shadow our SPA index.
RUN rm -rf /usr/share/nginx/html/*
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/shop/browser /usr/share/nginx/html
# The Angular SSR build emits the client entry as index.csr.html (there is no
# plain index.html at the browser root). We serve it as a static SPA, so make
# that file the nginx index.
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html
EXPOSE 80
