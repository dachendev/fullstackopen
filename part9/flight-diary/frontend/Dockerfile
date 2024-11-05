FROM node:20-bullseye-slim AS build
ENV VITE_BACKEND_URL=http://localhost:8080/api
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.27.2-alpine-slim AS prod
COPY --from=build /usr/src/app/dist /usr/share/nginx/html