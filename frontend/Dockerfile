# Stage 1: Build
FROM node:14.18.0-alpine

WORKDIR /frontend

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
