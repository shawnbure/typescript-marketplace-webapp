FROM node:14 as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 5000 
ENV NODE_ENV development
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

ENTRYPOINT [ "serve","-l","5000", "-s", "build" ]