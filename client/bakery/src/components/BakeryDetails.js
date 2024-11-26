// src/components/BakeryDetails.js

import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Импортируем CartContext
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Импорт иконок звезд (если используете react-icons)

function BakeryDetails() {
    const { id } = useParams();
    const [bakery, setBakery] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext); // Получаем функцию addToCart из контекста
    const [quantities, setQuantities] = useState({}); // Состояние для хранения количества каждого товара

    useEffect(() => {
        fetchBakery();
        fetchReviews();
    }, []);

    const fetchBakery = async () => {
        try {
            const response = await axios.get(`/api/bakeries/${id}`);
            setBakery(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении информации о пекарне:', error);
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/bakery/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
        }
    };

    const handleQuantityChange = (productId, value) => {
        const qty = parseInt(value, 10);
        if (qty >= 1) {
            setQuantities(prev => ({ ...prev, [productId]: qty }));
        }
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;
        addToCart(product, quantity);
        alert(`Добавлено ${quantity} x ${product.name} в корзину!`);
    };

    // Функция для вычисления среднего рейтинга
    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1); // Округление до одного знака после запятой
    };

    // Функция для рендеринга звезд (используя react-icons)
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} color="#FFD700" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
            } else {
                stars.push(<FaRegStar key={i} color="#ccc" />);
            }
        }
        return stars;
    };

    return (
        <div style={{ padding: '20px' }}>
            {loading ? (
                <p>Загрузка...</p>
            ) : bakery ? (
                <div>
                    <h1>{bakery.name}</h1>
                    {/* Отображение среднего рейтинга */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ marginRight: '8px', fontSize: '1.2em' }}>Рейтинг:</span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {renderStars(calculateAverageRating())}
                            <span style={{ marginLeft: '8px', fontSize: '1.2em' }}>
                                {calculateAverageRating()} / 5
                            </span>
                        </span>
                        <span style={{ marginLeft: '8px', color: '#555' }}>({reviews.length} отзывов)</span>
                    </div>

                    {bakery.photo && (
                        <img
                            src={`http://localhost:5000${bakery.photo}`}
                            alt={bakery.name}
                            style={{ width: '300px', height: 'auto' }}
                        />
                    )}
                    <p>{bakery.description}</p>
                    <p>Адрес: {bakery.address}</p>
                    <p>Телефон: {bakery.phone}</p>
                    <p>Контактное лицо: {bakery.contact_person_name}</p>

                    <h2>Товары</h2>
                    {bakery.Products && bakery.Products.length > 0 ? (
                        <ul>
                            {bakery.Products.map((product) => (
                                <li key={product.id} style={{ marginBottom: '20px' }}>
                                    <h3>{product.name}</h3>
                                    {product.photo && (
                                        <img
                                            src={`http://localhost:5000${product.photo}`}
                                            alt={product.name}
                                            style={{ width: '200px', height: 'auto' }}
                                        />
                                    )}
                                    <p>{product.description}</p>
                                    <p>Цена: {product.price} ₽</p>
                                    <div>
                                        <label>
                                            Количество:
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantities[product.id] || 1}
                                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                style={{ width: '60px', marginLeft: '10px' }}
                                            />
                                        </label>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Добавить в корзину
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Товары не найдены.</p>
                    )}

                    {/* Секция Отзывов */}
                    <h2>Отзывы</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map(review => (
                                <li key={review.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                    <p><strong>{review.User.name} {review.User.surname}</strong> оценил(а) на {review.rating} звезд</p>
                                    <p><em>{review.short_review}</em></p>
                                    <p>{review.description}</p>
                                    <p><small>{new Date(review.createdAt).toLocaleString()}</small></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет отзывов.</p>
                    )}
                </div>
            ) : (
                <p>Пекарня не найдена.</p>
            )}
        </div>
    );


}

export default BakeryDetails;
