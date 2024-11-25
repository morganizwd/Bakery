const Router = require('express').Router;
const BasketController = require('../controllers/basketController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router();

// Получение корзины пользователя
router.get('/', authenticateToken, BasketController.getBasket);

// Добавление товара в корзину
router.post('/add', authenticateToken, BasketController.addItem);

// Удаление товара из корзины
router.delete('/remove/:productId', authenticateToken, BasketController.removeItem);

// Обновление количества товара в корзине
router.put('/update/:productId', authenticateToken, BasketController.updateItemQuantity);

// Очистка корзины
router.delete('/clear', authenticateToken, BasketController.clearBasket);

module.exports = router;