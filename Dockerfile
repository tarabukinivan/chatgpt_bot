FROM node:v20.0.0

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=7777

EXPOSE $PORT

CMD ["npm","start"]
