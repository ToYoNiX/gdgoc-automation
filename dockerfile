FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD [ "node", "dist/server.js" ]