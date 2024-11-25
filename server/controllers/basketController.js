const { Basket, BasketItem, Product, User } = require('../models/models');

class BasketController {
    // Получение корзины пользователя
    async getBasket(req, res) {
        try {
            const userId = req.user.userId;

            const basket = await Basket.findOne({
                where: { userId },
                include: [
                    {
                        model: BasketItem,
                        include: [Product],
                    },
                ],
            });

            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            res.json(basket);
        } catch (error) {
            console.error('Ошибка при получении корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Добавление товара в корзину
    async addItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;

            // Проверка наличия корзины
            let basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                basket = await Basket.create({ userId });
            }

            // Проверка наличия товара
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            // Проверка наличия товара в корзине
            let basketItem = await BasketItem.findOne({
                where: { basketId: basket.id, productId },
            });

            if (basketItem) {
                // Обновление количества
                basketItem.quantity += quantity;
                await basketItem.save();
            } else {
                // Добавление нового товара в корзину
                basketItem = await BasketItem.create({
                    basketId: basket.id,
                    productId,
                    quantity,
                });
            }

            res.status(201).json(basketItem);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление товара из корзины
    async removeItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const basketItem = await BasketItem.findOne({
                where: { basketId: basket.id, productId },
            });

            if (!basketItem) {
                return res.status(404).json({ message: 'Товар в корзине не найден' });
            }

            await basketItem.destroy();

            res.status(200).json({ message: 'Товар успешно удален из корзины' });
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление количества товара в корзине
    async updateItemQuantity(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;
            const { quantity } = req.body;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const basketItem = await BasketItem.findOne({
                where: { basketId: basket.id, productId },
            });

            if (!basketItem) {
                return res.status(404).json({ message: 'Товар в корзине не найден' });
            }

            basketItem.quantity = quantity;
            await basketItem.save();

            res.status(200).json(basketItem);
        } catch (error) {
            console.error('Ошибка при обновлении количества товара в корзине:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Очистка корзины
    async clearBasket(req, res) {
        try {
            const userId = req.user.userId;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            await BasketItem.destroy({ where: { basketId: basket.id } });

            res.status(200).json({ message: 'Корзина успешно очищена' });
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new BasketController();