FROM node:20-bullseye-slim AS node

FROM node AS build
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npx tsc

FROM node AS prod
ENV NODE_ENV=production
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --only=production
COPY --from=build /usr/src/app/build .
USER node
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/index.js"]
