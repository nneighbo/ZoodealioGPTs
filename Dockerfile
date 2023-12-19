# Use the official Node.js 16 image.
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the React app
RUN cd client && npm install && npm run build

EXPOSE 3000
CMD [ "node", "index.js" ]
