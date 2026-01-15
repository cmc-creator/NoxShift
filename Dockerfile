FROM node:18-alpine

WORKDIR /app

# 1. Copy the code (Fast!)
COPY . .

# 2. Open the port
EXPOSE 8080

# 3. TRICK: Install dependencies when the app STARTS, not when it builds.
#    This skips the "Snapshot" crash entirely.
CMD ["/bin/sh", "-c", "npm install && npx next dev -p 8080"]
