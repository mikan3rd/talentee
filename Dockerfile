FROM node:14-alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./packages/backend/package.json ./packages/backend/package.json
COPY ./packages/app/package.json ./packages/app/package.json

RUN yarn install
