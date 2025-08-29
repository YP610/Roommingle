# ---- Build a minimal Node.js runtime image
FROM node:20-alpine

# Ensure production defaults
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install only the packages needed to run
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of your server code
COPY . .

# Cloud Run injects $PORT; your server must listen on it.
# (You don't need EXPOSE for Cloud Run, but it's harmless.)
EXPOSE 1000

# Start your app
CMD ["node", "server.js"]
