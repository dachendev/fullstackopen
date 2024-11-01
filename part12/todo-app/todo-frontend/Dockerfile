FROM node:20.9.0-bullseye-slim AS build-stage

ENV VITE_BACKEND_URL=http://localhost:3000

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci
RUN npm run build

# new build stage
FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html