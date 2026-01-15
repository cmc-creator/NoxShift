FROM node:18-alpine
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy code
COPY . .

# 3. Open Port 8080
EXPOSE 8080

# 4. Start in "Dev Mode" (Safe for small servers)
CMD ["npx", "next", "dev", "-p", "8080"]
