FROM node:18-alpine
EXPOSE 3000
WORKDIR /app
RUN npm i npm@latest -g
COPY package.json package-lock.json ./
CMD ["node", "server.js"]
COPY . .