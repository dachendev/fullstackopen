FROM node:20.9.0-bullseye-slim AS node
USER node
WORKDIR /usr/src/app

FROM node AS test
COPY . .
RUN npm ci --include=dev
RUN npm test

FROM node AS build
ENV VITE_BACKEND_URL=http://localhost:8080/api
COPY --from=test /usr/src/app .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html