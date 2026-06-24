FROM node:18-alpine

WORKDIR /app

ENV PORT=3001

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node","index.js"]
