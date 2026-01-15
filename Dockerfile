# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your app's source code
COPY . .

# 5. Open port 8080 (Spaceship needs this!)
EXPOSE 8080

# 6. Start the app
CMD ["npm", "start"]
