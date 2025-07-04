const express = require('express');
const logger = require('./logger');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Middleware
app.use(express.json());
app.use(logger);

//Обработчик для корневого пути
app.get('/', (req, res) => {
  res.json({
    message: 'Добро пожаловать в API управления продуктами!',
    endpoints: {
      getAll: 'GET /items',
      create: 'POST /items',
      getById: 'GET /items/:id',
      update: 'PUT /items/:id',
      delete: 'DELETE /items/:id'
    },
    instructions: 'Используйте Postman или curl для взаимодействия с API'
  });
});

// Error handling
app.use((err, req, res, next) => {
  // ... без изменений ...
});


// Routes
app.use('/items', productsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Экспортируем app для тестов
module.exports = app;

// Запускаем сервер только при прямом вызове
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
