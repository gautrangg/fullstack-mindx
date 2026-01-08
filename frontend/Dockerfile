# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments for environment variables (passed during docker build)
ARG VITE_API_BASE_URL
ARG VITE_APPLICATIONINSIGHTS_CONNECTION_STRING
ARG VITE_GA_MEASUREMENT_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APPLICATIONINSIGHTS_CONNECTION_STRING=$VITE_APPLICATIONINSIGHTS_CONNECTION_STRING
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

RUN npm run build

# Production stage - serve static files
FROM node:20-alpine

WORKDIR /app

# Install simple HTTP server
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]