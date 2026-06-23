FROM node:18

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node","index.js"]
