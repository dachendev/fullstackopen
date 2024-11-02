FROM node:lts
WORKDIR /usr/src/app
COPY . .
RUN npm install --include=dev
CMD ["npm", "run", "dev", "--", "--host"]