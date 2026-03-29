# dameunapatabot-web Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json prisma/ ./

# Install dependencies and generate Prisma client
RUN npm install && npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
