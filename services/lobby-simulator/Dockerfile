# Base image
FROM hub.lumigame.com/base/node:20.9.0-alpine

USER root

RUN mkdir /app && chown node:node /app
WORKDIR /app
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Copy all files first
COPY . .

# Install all dependencies (including devDependencies for build)
RUN yarn install

# Build the application
RUN yarn build

# Set production environment after build
ENV NODE_ENV=production

EXPOSE 8009

HEALTHCHECK --interval=10s CMD node src/healthcheck.js

CMD [ "node", "src/app.js" ]
