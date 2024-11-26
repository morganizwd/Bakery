// src/components/ReviewForm.js

import React, { useState } from 'react';

function ReviewForm({ bakeryId, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [shortReview, setShortReview] = useState('');
    const [description, setDescription] = useState('');
    const [orderId, setOrderId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!orderId) {
            alert('Пожалуйста, введите ID заказа');
            return;
        }

        if (rating < 1 || rating > 5) {
            alert('Рейтинг должен быть от 1 до 5');
            return;
        }

        onSubmit({
            rating,
            short_review: shortReview,
            description,
            orderId,
            bakeryId,
        });

        // Сброс формы после отправки
        setRating(5);
        setShortReview('');
        setDescription('');
        setOrderId('');
    };

    return (
        <div>
            <h3>Написать отзыв</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Рейтинг (1-5):
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value, 10))}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Краткий отзыв:
                        <input
                            type="text"
                            value={shortReview}
                            onChange={(e) => setShortReview(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Описание:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label>
                        ID Заказа:
                        <input
                            type="number"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Отправить отзыв</button>
            </form>
        </div>
    );
}

export default ReviewForm;
