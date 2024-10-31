FROM node:20.9.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci --only=production
USER node

# Prepend dumb-init to properly forward signals to PID ~2
# Alternatively, use docker run --init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Use execform notation to avoid spawning a shell
CMD ["npm", "start"]