const request = require('supertest');
const app = require('../app');
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db', 'products.json');

describe('Product API', () => {
  beforeEach(async () => {
    await fs.writeFile(DB_PATH, JSON.stringify([]));
  });

  describe('GET /items', () => {
    it('should return empty array when no products', async () => {
      const res = await request(app).get('/items');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all products', async () => {
      const testProducts = [
        { id: '1', name: 'Product 1', price: 10, quantity: 5, category: 'cat1' },
        { id: '2', name: 'Product 2', price: 20, quantity: 3, category: 'cat2' }
      ];
      await fs.writeFile('./db/products.json', JSON.stringify(testProducts));

      const res = await request(app).get('/items');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });

    it('should support pagination', async () => {
      const testProducts = Array(10).fill(0).map((_, i) => ({
        id: `${i}`, name: `Product ${i}`, price: i * 10, quantity: i, category: `cat${i % 3}`
      }));
      await fs.writeFile('./db/products.json', JSON.stringify(testProducts));

      const res = await request(app).get('/items?limit=3&offset=5');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(3);
      expect(res.body[0].id).toEqual('5');
    });

    it('should support filtering by category', async () => {
      const testProducts = Array(10).fill(0).map((_, i) => ({
        id: `${i}`,
        name: `Product ${i}`,
        price: i * 10,
        quantity: i,
        // Исправляем категории: 0,1,2 вместо 0,1,2,0,1,2...
        category: `cat${i % 3}`
      }));
      await fs.writeFile(DB_PATH, JSON.stringify(testProducts));

      const res = await request(app).get('/items?category=cat1');
      expect(res.statusCode).toEqual(200);
      // Ожидаем 4 элемента: индексы 1,4,7,10 (но 10 нет в массиве из 10 элементов)
      // Правильно: индексы 1,4,7 -> 3 элемента
      expect(res.body.length).toEqual(3);
    });
  });

  describe('POST /items', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 99.99,
        quantity: 10,
        category: 'electronics'
      };

      const res = await request(app)
        .post('/items')
        .send(newProduct);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(newProduct.name);
    });

    it('should validate required fields', async () => {
      const invalidProduct = {
        price: 99.99,
        quantity: 10
      };

      const res = await request(app)
        .post('/items')
        .send(invalidProduct);

      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Name is required' }),
          expect.objectContaining({ category: 'Category is required' })
        ])
      );
    });

    it('should validate price > 0', async () => {
      const invalidProduct = {
        name: 'Invalid Price',
        price: -5,
        quantity: 10,
        category: 'electronics'
      };

      const res = await request(app)
        .post('/items')
        .send(invalidProduct);

      expect(res.statusCode).toEqual(422);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ price: 'Price must be greater than 0' })
        ])
      );
    });
  });

  describe('GET /items/:id', () => {
    it('should return a product by id', async () => {
      const testProducts = [
        { id: 'test1', name: 'Product 1', price: 10, quantity: 5, category: 'cat1' },
        { id: 'test2', name: 'Product 2', price: 20, quantity: 3, category: 'cat2' }
      ];
      await fs.writeFile('./db/products.json', JSON.stringify(testProducts));

      const res = await request(app).get('/items/test1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(testProducts[0]);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/items/non_existent');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('PUT /items/:id', () => {
  it('should update an existing product', async () => {
    const testProducts = [
      { 
        id: 'test1', 
        name: 'Old Product', 
        price: 10, 
        quantity: 5, 
        category: 'old' 
      }
    ];
    await fs.writeFile(DB_PATH, JSON.stringify(testProducts));
    
    const updates = { name: 'Updated Product' }; // Обновляем только имя
    const res = await request(app)
      .put('/items/test1')
      .send(updates);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Product');
    expect(res.body.id).toBe('test1');
  });

  it('should validate input during update', async () => {
    const testProducts = [
      { id: 'test1', name: 'Product', price: 10, quantity: 5, category: 'cat' }
    ];
    await fs.writeFile(DB_PATH, JSON.stringify(testProducts));
    
    const invalidUpdate = { price: -5 }; // Невалидная цена
    const res = await request(app)
      .put('/items/test1')
      .send(invalidUpdate);
    
    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ price: 'Price must be greater than 0' })
      ])
    );
  });

  it('should return 404 when updating non-existent product', async () => {
    const validUpdate = { 
      name: 'New Name',
      price: 10,
      quantity: 5,
      category: 'valid'
    };
    
    const res = await request(app)
      .put('/items/invalid_id')
      .send(validUpdate); // Отправляем валидные данные
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: 'Product not found' });
  });
});

  describe('DELETE /items/:id', () => {
    it('should delete an existing product', async () => {
      const testProducts = [
        { id: 'test1', name: 'To Delete', price: 10, quantity: 1, category: 'cat' }
      ];
      await fs.writeFile('./db/products.json', JSON.stringify(testProducts));

      const res = await request(app).delete('/items/test1');
      expect(res.statusCode).toEqual(204);

      // Проверяем фактическое удаление
      const products = JSON.parse(await fs.readFile(DB_PATH));
      expect(products.length).toBe(0);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).delete('/items/invalid_id');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });
});