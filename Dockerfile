FROM node:7.2.0-alpine

WORKDIR /app
COPY . .
RUN npm install yarn -g
RUN yarn install
RUN cd api && yarn install --production
RUN cd app-react && npm install && npm run build

# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node app.js