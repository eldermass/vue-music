FROM node:10.16.0-alpine

WORKDIR /app

COPY . /app/

RUN npm install && echo 'install finish'

EXPOSE 8020