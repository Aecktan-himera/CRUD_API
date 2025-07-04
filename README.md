CRUD API для управления продуктами
Это простое RESTful API для управления продуктами, построенное на стеке Node.js + Express. Приложение предоставляет полный набор CRUD операций (Create, Read, Update, Delete) для продуктов с валидацией данных и логированием запросов.

Особенности
🛠️ Полный CRUD функционал для продуктов
✅ Валидация входных данных
📝 Логирование всех запросов
📂 Хранение данных в JSON-файле
🧪 Полное покрытие тестами

Технологический стек
Node.js (v14+)
Express - веб-фреймворк
Winston - логирование
Express-validator - валидация данных
UUID - генерация уникальных ID
Jest + Supertest - тестирование

Установка и запуск
Клонируйте репозиторий:

bash
git clone https://github.com/your-username/product-crud-api.git
cd product-crud-api
Установите зависимости:

bash
npm install
Создайте необходимые директории:

bash
mkdir db logs
Запустите сервер:

bash
npm start
Сервер будет доступен по адресу: http://localhost:3000

Использование API
Базовый URL
http://localhost:3000/items

Endpoints
1. Получить все продукты
GET /items

Параметры:

limit - количество продуктов на странице
offset - смещение (для пагинации)
category - фильтр по категории

Пример:

bash
curl http://localhost:3000/items?limit=5&offset=0&category=electronics
2. Создать новый продукт
POST /items

Тело запроса (JSON):

json
{
  "name": "Новый продукт",
  "price": 99.99,
  "quantity": 10,
  "category": "electronics"
}
Пример:

bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Ноутбук", "price":1500, "quantity":5, "category":"electronics"}'
3. Получить продукт по ID
GET /items/:id

Пример:

bash
curl http://localhost:3000/items/e1d7d44f-c5c2-4fd2-80bd-af7a3465d5fa
4. Обновить продукт
PUT /items/:id

Тело запроса (JSON - можно обновлять отдельные поля):

json
{
  "name": "Обновленное название",
  "price": 199.99
}
Пример:

bash
curl -X PUT http://localhost:3000/items/e1d7d44f-c5c2-4fd2-80bd-af7a3465d5fa \
  -H "Content-Type: application/json" \
  -d '{"price":1299}'
5. Удалить продукт
DELETE /items/:id

Пример:

bash
curl -X DELETE http://localhost:3000/items/e1d7d44f-c5c2-4fd2-80bd-af7a3465d5fa
Структура проекта
text
├── app.js              # Основной файл приложения
├── logger.js           # Конфигурация логгера
├── db/
│   └── products.json   # База данных (JSON-файл)
├── logs/               # Директория логов
├── models/
│   └── Product.js      # Модель продукта
├── routes/
│   └── products.js     # Роуты для продуктов
├── tests/
│   └── product.test.js # Тесты API
├── validators/
│   └── productValidator.js # Валидаторы данных
└── package.json        # Зависимости и скрипты
Запуск тестов
bash
npm test
Тесты покрывают:
Создание продукта (включая валидацию)
Получение списка продуктов (с пагинацией и фильтрацией)
Получение одного продукта
Обновление продукта
Удаление продукта

Логирование
Все запросы логируются в:
Консоль сервера
Файл logs/requests.log

Формат логов:

json
{
  "method": "POST",
  "url": "/items",
  "body": {
    "name": "Новый продукт",
    "price": 99.99,
    "quantity": 10,
    "category": "electronics"
  },
  "params": {},
  "query": {},
  "timestamp": "2025-07-04T14:15:06.020Z"
}

Лицензия
Этот проект распространяется под лицензией MIT.
