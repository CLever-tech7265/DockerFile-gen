FROM node:18-alpine

WORKDIR /app

ENV PORT=3000

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","index.js"]
