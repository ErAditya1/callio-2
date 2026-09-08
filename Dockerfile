# syntax=docker/dockerfile:1
# Multi-stage build for Callio AI Production Frontend

# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Clean install with proper handling of native modules
RUN --mount=type=cache,target=/root/.npm npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install libc6-compat for native modules in builder stage too
RUN apk add --no-cache libc6-compat

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all files needed for build
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY components.json ./
COPY sentry.edge.config.ts ./
COPY sentry.server.config.ts ./
COPY postcss.config.mjs ./
COPY public ./public
COPY src ./src

# Set build-time environment variables (needed for Next.js build)
ENV NEXT_PUBLIC_NODE_ENV="oss"
ENV NEXT_TELEMETRY_DISABLED="1"
ARG NEXT_PUBLIC_BACKEND_URL="https://calling.cheetahagi.com"
ARG BACKEND_URL="http://dograh-api:8000"
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Build the application with standalone mode
# Increase Node.js heap size to prevent out-of-memory errors during build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build && \
    rm -rf /tmp/* /root/.npm /root/.next/cache

# Stage 3: Runner (production image)
FROM node:22-alpine AS runner
WORKDIR /app

# Environment variables will be provided by docker-compose
ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3010

# Start the production server using the standalone Node.js server
CMD ["node", "server.js"]
