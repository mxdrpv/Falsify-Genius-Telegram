FROM node:18

RUN apt-get update && apt-get install -y ncurses-bin

WORKDIR /app
COPY . .

WORKDIR /app/client
RUN npm install --force && npm run build

WORKDIR /app
RUN npm install

CMD ["node", "server.mjs"]
