FROM node:16-alpine

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=7777

EXPOSE $PORT

CMD ["npm","start"]
