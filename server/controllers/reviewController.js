const { Review, User, Bakery, Order } = require('../models/models');

class ReviewController {

    async createReview(req, res) {
        try {
            const userId = req.user.userId;
            const { rating, short_review, description, orderId, bakeryId } = req.body;

            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const existingReview = await Review.findOne({ where: { orderId } });
            if (existingReview) {
                return res.status(400).json({ message: 'Отзыв для данного заказа уже существует' });
            }

            const review = await Review.create({
                rating,
                short_review,
                description,
                orderId,
                bakeryId,
            });

            res.status(201).json(review);
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getReviewById(req, res) {
        try {
            const { id } = req.params;

            const review = await Review.findByPk(id, {
                include: [
                    { model: Order },
                    { model: Bakery },
                ],
            });

            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            res.json(review);
        } catch (error) {
            console.error('Ошибка при получении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await Review.findAll({
                include: [
                    { model: Order },
                    { model: Bakery },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const { rating, short_review, description } = req.body;

            const review = await Review.findByPk(id);

            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== req.user.userId) {
              return res.status(403).json({ message: 'Нет доступа для редактирования этого отзыва' });
            }

            await review.update({
                rating,
                short_review,
                description,
            });

            res.json(review);
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;

            const review = await Review.findByPk(id);

            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== req.user.userId) {
              return res.status(403).json({ message: 'Нет доступа для удаления этого отзыва' });
            }

            await review.destroy();

            res.status(200).json({ message: 'Отзыв успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getReviewsByBakery(req, res) {
        try {
            const { bakeryId } = req.params;

            const reviews = await Review.findAll({
                where: { bakeryId },
                include: [
                    { model: Order },
                    { model: Bakery },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ReviewController();