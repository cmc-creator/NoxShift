FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy code
COPY . .

# 3. SKIP the heavy build (Saves memory!)
# RUN npm run build

# 4. Open Port 8080
EXPOSE 8080

# 5. Start in "Dev Mode" (Lighter for this server)
CMD ["npx", "next", "dev", "-p", "8080"]
