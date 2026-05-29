# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Serve with Nginx
FROM nginx:stable-alpine AS deploy

# Set up non-root user permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
USER nginx

# Copy built assets
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# Expose port (matches port 3000 in nginx.conf)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
