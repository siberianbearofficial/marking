FROM node:21-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY ./config /etc/nginx/conf.d

COPY --from=build /usr/src/app/dist/marking-frontend /usr/share/nginx/html
