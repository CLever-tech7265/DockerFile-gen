FROM node:18

WORKDIR /app

ENV PORT=3000
ENV NODE_ENV=production
ENV ABCD=aaaa

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","index.js"]
