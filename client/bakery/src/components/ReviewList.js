// src/components/ReviewList.js

import React from 'react';

function ReviewList({ reviews }) {
    if (reviews.length === 0) {
        return <p>Отзывов пока нет.</p>;
    }

    return (
        <div>
            {reviews.map(review => (
                <div key={review.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <p><strong>Рейтинг:</strong> {review.rating} / 5</p>
                    <p><strong>Краткий отзыв:</strong> {review.short_review}</p>
                    <p><strong>Описание:</strong> {review.description}</p>
                    <p><strong>Пользователь:</strong> {review.User?.name} {review.User?.surname}</p>
                    <p><strong>Дата:</strong> {new Date(review.createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
