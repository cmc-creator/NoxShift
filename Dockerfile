FROM node:18-alpine

# Create a tiny fake app file
RUN echo "const http = require('http'); http.createServer((_, r) => r.end('Unlocked!')).listen(8080);" > fake-server.js

# Open the port
EXPOSE 8080

# Run the fake app
CMD ["node", "fake-server.js"]
