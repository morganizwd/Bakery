// src/components/Orders.js

import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Убедитесь, что элемент с id 'root' существует

function Orders() {
    const { authData } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        short_review: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            console.log('Полученные заказы:', response.data); // Логирование
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            setLoading(false);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        // Валидация
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            alert('Рейтинг должен быть от 1 до 5');
            return;
        }
        if (!reviewData.short_review.trim() || !reviewData.description.trim()) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/api/reviews', {
                ...reviewData,
                orderId: selectedOrder.id,
            }, {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            alert('Отзыв успешно создан!');
            setSubmitting(false);
            setSelectedOrder(null);
            setReviewData({ rating: 5, short_review: '', description: '' });
            fetchOrders(); // Обновляем список заказов
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            alert(error.response?.data?.message || 'Не удалось создать отзыв');
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Мои заказы</h1>
            {loading ? (
                <p>Загрузка...</p>
            ) : orders.length === 0 ? (
                <p>У вас ещё нет заказов.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {orders.map(order => (
                        <li key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3>Заказ №{order.id}</h3>
                            <p>Адрес доставки: {order.delivery_address}</p>
                            <p>Дата заказа: {new Date(order.date_of_ordering).toLocaleString()}</p>
                            <p>Статус: {order.status}</p>
                            <p>Итоговая сумма: {order.total_cost} ₽</p>
                            <p>Пожелания: {order.description || 'Отсутствуют'}</p>
                            <h4>Товары:</h4>
                            <ul>
                                {order.OrderItems.map(item => (
                                    <li key={item.id}>
                                        {item.Product.name} x {item.quantity} = {item.Product.price * item.quantity} ₽
                                    </li>
                                ))}
                            </ul>

                            {/* Отображение отзыва, если он уже существует */}
                            {order.Review && (
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                                    <h4>Ваш отзыв:</h4>
                                    <p>Рейтинг: {order.Review.rating} звезд</p>
                                    <p><em>{order.Review.short_review}</em></p>
                                    <p>{order.Review.description}</p>
                                    <p><small>Дата: {new Date(order.Review.createdAt).toLocaleString()}</small></p>
                                </div>
                            )}

                            {/* Кнопка для написания отзыва, если заказ выполнен и отзыв ещё не написан */}
                            {order.status === 'выполнен' && !order.Review && (
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    style={{ marginTop: '10px', padding: '8px 12px' }}
                                >
                                    Написать отзыв
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Форма для написания отзыва в модальном окне */}
            <Modal
                isOpen={selectedOrder !== null}
                onRequestClose={() => setSelectedOrder(null)}
                contentLabel="Написать Отзыв"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '20px',
                    },
                }}
            >
                {selectedOrder && (
                    <div>
                        <h2>Написать Отзыв для Заказа №{selectedOrder.id}</h2>
                        <form onSubmit={handleSubmitReview}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    Рейтинг:
                                    <select
                                        name="rating"
                                        value={reviewData.rating}
                                        onChange={handleReviewChange}
                                        required
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    >
                                        {[5,4,3,2,1].map(r => (
                                            <option key={r} value={r}>{r} {r === 1 ? 'звезда' : 'звезды'}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    Короткий Отзыв:
                                    <input
                                        type="text"
                                        name="short_review"
                                        value={reviewData.short_review}
                                        onChange={handleReviewChange}
                                        required
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </label>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>
                                    Полный Отзыв:
                                    <textarea
                                        name="description"
                                        value={reviewData.description}
                                        onChange={handleReviewChange}
                                        required
                                        rows="4"
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    ></textarea>
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                {submitting ? 'Отправка...' : 'Отправить Отзыв'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                }}
                            >
                                Отмена
                            </button>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Orders;
