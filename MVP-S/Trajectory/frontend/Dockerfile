FROM node:16-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Устанавливаем serve для раздачи статических файлов
RUN npm install -g serve

EXPOSE 3000

# Запускаем приложение в development режиме
CMD ["npm", "start"]