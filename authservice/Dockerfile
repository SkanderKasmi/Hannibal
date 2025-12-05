# authservice/Dockerfile

# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install

# Copy sources & config
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build NestJS to dist/
RUN npm run build

# -------- Stage 2: Runtime --------
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
