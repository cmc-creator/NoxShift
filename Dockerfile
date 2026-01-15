FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all code
COPY . .

# --- THIS WAS MISSING ---
# Build the Next.js app
RUN npm run build
# ------------------------

EXPOSE 8080
CMD ["npm", "start"]
