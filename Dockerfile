FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies (This works now!)
COPY package*.json ./
RUN npm install

# 2. Copy the rest of the code
COPY . .

# 3. SKIP the heavy build (This prevents the snapshot crash)
# RUN npm run build

# 4. Open Port
EXPOSE 8080

# 5. Start in Dev Mode (Fast & Reliable)
CMD ["npx", "next", "dev", "-p", "8080"]
