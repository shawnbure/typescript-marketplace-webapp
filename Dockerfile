FROM node:14 as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 8080 

RUN apt update
RUN apt install git
RUN apt install build-essential

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
RUN npm install -g serve
# copy application
COPY . .
RUN yarn build

ENTRYPOINT [ "serve","-l","5050", "-s", "build" ]