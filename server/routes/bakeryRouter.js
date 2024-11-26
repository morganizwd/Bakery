const express = require('express');
const BakeryController = require('../controllers/bakeryController');
const authenticateToken = require('../middleware/authenticateToken');
const OrderController = require('../controllers/orderController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/bakeries');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/orders', authenticateToken, OrderController.getBakeryOrders);
router.post('/registration', upload.single('photo'), BakeryController.registration);
router.post('/login', BakeryController.login);
router.get('/auth', authenticateToken, BakeryController.auth);
router.get('/', BakeryController.findAll);
router.get('/:id', BakeryController.findOne);
router.put('/:id', authenticateToken, upload.single('photo'), BakeryController.update);
router.delete('/:id', authenticateToken, BakeryController.delete);


module.exports = router;