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
FROM node:20-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec nx build shop

# ---- runtime stage ----
FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/shop/browser /usr/share/nginx/html
EXPOSE 80
