const { Order, OrderItem, Basket, BasketItem, Product, User, Bakery, Review } = require('../models/models');

class OrderController {

    async createOrder(req, res) {
        try {
            const { delivery_address, description } = req.body;

            const userId = req.user.userId;
            console.log('User ID:', userId);
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const basket = await Basket.findOne({
                where: { userId },
                include: [{
                    model: BasketItem,
                    include: [Product],
                }]
            });

            console.log('Basket:', basket);

            if (!basket) {
                return res.status(400).json({ message: 'Корзина не найдена' });
            }

            if (basket.BasketItems.length === 0) {
                return res.status(400).json({ message: 'Ваша корзина пуста' });
            }

            const orderName = basket.BasketItems.map(item => `${item.Product.name} x ${item.quantity}`).join('; ');
            console.log('Order Name:', orderName);

            const totalCost = basket.BasketItems.reduce((acc, item) => acc + item.Product.price * item.quantity, 0);
            console.log('Total Cost:', totalCost);

            const bakeryIds = [...new Set(basket.BasketItems.map(p => p.Product.bakeryId))];
            console.log('Bakery IDs:', bakeryIds);
            if (bakeryIds.length > 1) {
                return res.status(400).json({ message: 'Все товары должны принадлежать одной пекарне' });
            }
            const bakeryId = bakeryIds[0];
            console.log('Bakery ID:', bakeryId);

            const order = await Order.create({
                delivery_address,
                description,
                total_cost: totalCost,
                name: orderName,
                status: 'на рассмотрении', 
                date_of_ordering: new Date(),
                userId,
                bakeryId,
            });

            console.log('Created Order:', order);

            const orderItems = basket.BasketItems.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            }));

            await OrderItem.bulkCreate(orderItems);
            console.log('Order Items:', orderItems);

            await BasketItem.destroy({ where: { basketId: basket.id } });
            console.log('Basket cleared.');

            res.status(201).json({ message: 'Заказ успешно создан', order });
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getUserOrders(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['name', 'surname'] }],
                    },
                ],
                order: [['date_of_ordering', 'DESC']],
            });

            res.json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
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
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['name', 'surname'] }],
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

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Недопустимый статус заказа' });
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

            if (order.userId !== req.user.userId) {
                return res.status(403).json({ message: 'Нет прав для удаления этого заказа' });
            }

            await OrderItem.destroy({ where: { orderId: id } });

            await order.destroy();

            res.status(200).json({ message: 'Заказ успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getBakeryOrders(req, res) {
        try {
            const bakeryId = req.user.bakeryId;
            console.log('Получение заказов для пекарни ID:', bakeryId);
            if (!bakeryId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const orders = await Order.findAll({
                where: { bakeryId: bakery.id },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'surname'],
                    },
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                ],
                order: [['date_of_ordering', 'DESC']],
            });

            res.json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new OrderController();
