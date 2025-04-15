# Используем официальный Node.js образ
FROM node:18

# Устанавливаем tput, чтобы Render не ныл
RUN apt-get update && apt-get install -y ncurses-bin

# Создаём рабочую директорию
WORKDIR /app

# Копируем всё в контейнер
COPY . .

# Устанавливаем зависимости фронта и билдим его
WORKDIR /app/client
RUN npm install --force && npm install vite --save-dev && npm run build

# Возвращаемся в корень и ставим серверные зависимости
WORKDIR /app
RUN npm install --omit=dev

# Указываем команду запуска сервера
CMD ["node", "server.js"]
