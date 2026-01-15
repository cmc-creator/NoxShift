FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
# We use 'npm install' because it creates the lockfile for you
RUN npm install

# 2. Copy the rest of the code
COPY . .

# 3. Build the app
RUN npm run build

# 4. Open Port
EXPOSE 8080

# 5. Start the Real App
CMD ["npm", "start"]
