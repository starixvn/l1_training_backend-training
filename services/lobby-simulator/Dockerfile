# Base image
FROM hub.lumigame.com/base/node:20.9.0-alpine

USER root

ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app
ENV NODE_OPTIONS="--openssl-legacy-provider"
COPY ./L1.GameLobbySimulator .
RUN yarn install
RUN yarn build

EXPOSE 8009

HEALTHCHECK --interval=10s CMD node src/healthcheck.js

CMD [ "node", "src/app.js" ]
