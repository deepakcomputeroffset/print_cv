# # Dockerfile

# # Use official Node.js image (same as Railway's default)
# FROM node:20-alpine

# # Install Nixpacks
# RUN apk add --no-cache curl bash git && \
#     curl -sSL https://github.com/railwayapp/nixpacks/releases/download/v0.8.0/nixpacks-linux-amd64.tar.gz | tar -xz -C /usr/local/bin


# # Set working directory
# WORKDIR /app

# # Install dependencies
# # COPY package.json package-lock.json* ./
# # COPY prisma ./prisma/
# # RUN npm ci

# # Copy rest of the code
# COPY . .

# # Build the Next.js app
# # RUN npm run build

# RUN nixpacks build .

# # Expose port (if running locally)
# EXPOSE 3000

# # Start the app (production mode)
# CMD ["npm", "start"]

# Start with the official Node.js image (or use your preferred base image)
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Install Nixpacks
RUN curl -sSL https://github.com/railwayapp/nixpacks/releases/download/v0.10.0/nixpacks-linux-x86_64.tar.gz | tar -xzC /usr/local/bin

# Install dependencies (using Nixpacks to install dependencies in the correct environment)
COPY . .

# Build project
RUN nixpacks build

# Install the production dependencies
RUN npm ci --only=production

# Expose the app port (default Next.js port)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
