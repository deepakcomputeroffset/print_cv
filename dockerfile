# Dockerfile

# Use official Node.js image (same as Railway's default)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Copy rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (if running locally)
EXPOSE 3000

# Start the app (production mode)
CMD ["npm", "start"]
