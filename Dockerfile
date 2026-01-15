FROM node:18-alpine

# 1. Create a fake server file (NO npm install allowed!)
RUN echo "const http = require('http'); http.createServer((_, r) => r.end('I am Unstuck!')).listen(8080);" > server.js

# 2. Open the port
EXPOSE 8080

# 3. Start the fake server
CMD ["node", "server.js"]
