FROM node:18

RUN apt-get update && apt-get install -y ncurses-bin

WORKDIR /app
COPY . .

# Фронтенд
WORKDIR /app/client
RUN npm install --force && npm run build

# Сервер
WORKDIR /app
RUN npm install

CMD ["node", "server.mjs"]
