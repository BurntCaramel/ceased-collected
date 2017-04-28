FROM node:7.9.0-alpine

ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID

ENV PATH /root/.yarn/bin:$PATH

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh


RUN apk update \
  && apk add curl bash binutils tar gnupg \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils

WORKDIR /app
COPY . .
#RUN npm install yarn -g
RUN yarn install
RUN cd api && yarn install --production
RUN cd app-react && npm install && npm run build

EXPOSE 80

# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node app.js