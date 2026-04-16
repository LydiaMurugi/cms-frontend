# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first so this layer is cached unless deps change
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

# Copy source and build
COPY . .

# VITE_ env vars are inlined at build time — pass real values as build args
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

RUN npm run build

# ── Stage 2: serve ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# -s: SPA mode (fallback to index.html for client-side routing)
CMD ["serve", "-s", "dist", "-l", "3000"]
