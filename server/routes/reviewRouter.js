const Router = require('express').Router;
const ReviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authenticateToken');

const router = Router();

router.post('/', authenticateToken, ReviewController.createReview);

router.get('/', ReviewController.getAllReviews);

router.get('/:id', ReviewController.getReviewById);

router.put('/:id', authenticateToken, ReviewController.updateReview);

router.delete('/:id', authenticateToken, ReviewController.deleteReview);

router.get('/bakery/:bakeryId', ReviewController.getReviewsByBakery);

module.exports = router;