const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'db', 'products.json');

class Product {
    constructor(id, name, price, quantity, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    static async getAll(limit, offset, category) {
        try {
            const data = await fs.readFile(DB_PATH, 'utf8');
            let products = JSON.parse(data);

            if (category) {
                products = products.filter(p => String(p.category) === String(category));
            }

            if (limit) {
                const start = offset ? parseInt(offset) : 0;
                return products.slice(start, start + parseInt(limit));
            }

            return products;
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(DB_PATH, JSON.stringify([]));
                return [];
            }
            throw error;
        }
    }

    static async getById(id) {
        const products = await this.getAll();
        return products.find(p => p.id === id);
    }

    static async create(productData) {
        const products = await this.getAll();
        const newProduct = new Product(
            uuidv4(),
            productData.name,
            productData.price,
            productData.quantity,
            productData.category
        );
        products.push(newProduct);
        await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));
        return newProduct;
    }

    static async update(id, productData) {
        const products = await this.getAll();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        const updatedProduct = {
            ...products[index],
            ...productData,
            id // Ensure ID doesn't change
        };

        products[index] = updatedProduct;
        await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

    static async delete(id) {
        const products = await this.getAll();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return false;

        products.splice(index, 1);
        await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2));
        return true;
    }
}

module.exports = Product;