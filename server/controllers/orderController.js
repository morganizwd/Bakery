const { Order, OrderItem, Basket, BasketItem, Product, User } = require('../models/models');
const sequelize = require('sequelize');

class OrderController {

    async createOrder(req, res) {
        try {
            const userId = req.user.userId;
            const { delivery_address, description } = req.body;

            const basket = await Basket.findOne({
                where: { userId },
                include: [
                    {
                        model: BasketItem,
                        include: [Product],
                    },
                ],
            });

            if (!basket || basket.basketItems.length === 0) {
                return res.status(400).json({ message: 'Корзина пуста' });
            }

            let total_cost = 0;
            for (const item of basket.basketItems) {
                total_cost += item.quantity * item.product.price;
            }

            const order = await Order.create({
                userId,
                delivery_address,
                total_cost,
                status: 'Новый',
                date_of_ordering: new Date(),
                description,
            });

            const orderItems = basket.basketItems.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            }));

            await OrderItem.bulkCreate(orderItems);

            await BasketItem.destroy({ where: { basketId: basket.id } });

            res.status(201).json(order);
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getOrderById(req, res) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                ],
            });

            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            res.json(order);
        } catch (error) {
            console.error('Ошибка при получении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getAllOrders(req, res) {
        try {
            const userId = req.user.userId;

            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                ],
                order: [['date_of_ordering', 'DESC']],
            });

            res.json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            order.status = status;
            await order.save();

            res.json(order);
        } catch (error) {
            console.error('Ошибка при обновлении статуса заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            await OrderItem.destroy({ where: { orderId: id } });

            await order.destroy();

            res.status(200).json({ message: 'Заказ успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new OrderController();