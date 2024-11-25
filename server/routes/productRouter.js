const Router = require('express').Router;
const ProductController = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Создание нового продукта
router.post('/', authenticateToken, upload.single('photo'), ProductController.create);

// Получение всех продуктов
router.get('/', ProductController.findAll);

// Получение продукта по ID
router.get('/:id', ProductController.findOne);

// Обновление продукта
router.put('/:id', authenticateToken, upload.single('photo'), ProductController.update);

// Удаление продукта
router.delete('/:id', authenticateToken, ProductController.delete);

// Получение продуктов по ID пекарни
router.get('/bakery/:bakeryId', ProductController.findByBakery);

module.exports = router;