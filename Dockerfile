# dameunapatabot-web Dockerfile
FROM node:22-alpine

WORKDIR /app

# Build arguments from Coolify
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_URL_APP

# Environment variables for runtime
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_URL_APP=${NEXTAUTH_URL_APP}

# Copy package files
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install dependencies fresh (no cache)
RUN npm ci --prefer-offline

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
