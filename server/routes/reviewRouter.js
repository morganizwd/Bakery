// routes/reviewRouter.js

const Router = require('express').Router;
const ReviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router();

// Специфичный маршрут для получения отзывов по пекарне должен быть определён первым
router.get('/bakery/:bakeryId', ReviewController.getReviewsByBakery);

// Другие маршруты
router.post('/', authenticateToken, ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.put('/:id', authenticateToken, ReviewController.updateReview);
router.delete('/:id', authenticateToken, ReviewController.deleteReview);

module.exports = router;
