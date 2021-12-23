FROM node:14.18

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

CMD yarn start:dev
