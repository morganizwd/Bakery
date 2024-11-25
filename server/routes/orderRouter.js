const Router = require('express').Router;
const OrderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router();

router.post('/', authenticateToken, OrderController.createOrder);

router.get('/', authenticateToken, OrderController.getAllOrders);

router.get('/:id', authenticateToken, OrderController.getOrderById);

router.put('/:id/status', authenticateToken, OrderController.updateOrderStatus);

router.delete('/:id', authenticateToken, OrderController.deleteOrder);

module.exports = router;