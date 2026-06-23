FROM node:18

WORKDIR /app

# install dependencies
RUN npm install

COPY . .

CMD ["node","index.js"]
