FROM node:18-alpine

# Create a fake server file (No install, No secrets needed)
RUN echo "const http = require('http'); http.createServer((_, r) => r.end('Unlocked!')).listen(8080);" > server.js

# Open the port
EXPOSE 8080

# Start the fake server
CMD ["node", "server.js"]
