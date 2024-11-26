// routes/orderRouter.js

const express = require('express');
const OrderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Маршрут для создания заказа
router.post('/', authenticateToken, OrderController.createOrder);

// Маршрут для получения всех заказов пользователя
router.get('/', authenticateToken, OrderController.getUserOrders);

// Маршрут для получения конкретного заказа по ID
router.get('/:id', authenticateToken, OrderController.getOrderById);

// Маршрут для обновления статуса заказа
router.put('/:id/status', authenticateToken, OrderController.updateOrderStatus);

// Маршрут для удаления заказа
router.delete('/:id', authenticateToken, OrderController.deleteOrder);

module.exports = router;
