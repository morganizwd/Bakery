const Router = require('express').Router;
const BakeryController = require('../controllers/bakeryController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/registration', upload.single('photo'), BakeryController.registration);

router.post('/login', BakeryController.login);

router.get('/auth', authenticateToken, BakeryController.auth);

router.get('/', authenticateToken, BakeryController.findAll);

router.get('/:id', authenticateToken, BakeryController.findOne);

router.put('/:id', authenticateToken, upload.single('photo'), BakeryController.update);

router.delete('/:id', authenticateToken, BakeryController.delete);

module.exports = router;