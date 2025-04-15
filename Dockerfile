# Используем официальный Node.js образ
FROM node:18

# Устанавливаем необходимые пакеты, включая tput
RUN apt-get update && apt-get install -y ncurses-bin

# Создаем рабочую директорию
WORKDIR /app

# Копируем всё в контейнер
COPY . .

# Переходим в клиентскую часть и собираем фронт
RUN cd client && npm install --force && npm install vite --save-dev && npm run build

# Устанавливаем зависимости сервера (если есть server/package.json — укажи его отдельно)
RUN npm install --omit=dev

# Запускаем сервер
CMD ["node", "server.js"]
