FROM node:25.9-alpine3.23 
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "./src/server.mjs"]
