const { Product, Bakery } = require('../models/models');
const fs = require('fs');
const path = require('path');

class ProductController {
    async create(req, res) {
        try {
            const { name, description, price } = req.body;
            const bakeryId = req.user.bakeryId;

            if (!bakeryId) {
                return res.status(403).json({ message: 'Нет прав для создания товара' });
            }

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const product = await Product.create({
                name,
                description,
                price,
                bakeryId,
                photo: req.file ? `/uploads/products/${req.file.filename}` : null,
            });

            res.status(201).json(product);
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findOne(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{ model: Bakery }],
            });
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }
            res.json(product);
        } catch (error) {
            console.error('Ошибка при получении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findAll(req, res) {
        try {
            const products = await Product.findAll({
                include: [{ model: Bakery }],
            });
            res.json(products);
        } catch (error) {
            console.error('Ошибка при получении списка продуктов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async update(req, res) {
        try {
            const { name, description, price } = req.body;
            const productId = req.params.id;

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }

            let updatedData = { name, description, price };

            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/products');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const photoPath = `/uploads/products/${productId}_${req.file.originalname}`;
                fs.writeFileSync(path.join(uploadDir, `${productId}_${req.file.originalname}`), req.file.buffer);
                updatedData.photo = photoPath;
            }

            await product.update(updatedData);

            res.json(product);
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async delete(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }

            await product.destroy();

            res.status(200).json({ message: 'Продукт успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findByBakery(req, res) {
        try {
            const { bakeryId } = req.params;

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const products = await Product.findAll({ where: { bakeryId } });

            res.json(products);
        } catch (error) {
            console.error('Ошибка при получении продуктов пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ProductController();