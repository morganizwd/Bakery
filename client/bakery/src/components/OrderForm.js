// src/components/OrderForm.js

import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Импортируем AuthContext

function OrderForm() {
    const { clearCart } = useContext(CartContext);
    const { authData } = useContext(AuthContext); // Получаем данные пользователя
    const [formData, setFormData] = useState({
        delivery_address: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post('/api/orders', formData, {
                headers: {
                    'Authorization': `Bearer ${authData.token}`,
                },
            });
            alert('Заказ успешно оформлен!');
            clearCart();
            navigate('/orders'); // Перенаправление на страницу с заказами
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Оформление заказа</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Адрес доставки:
                        <input
                            type="text"
                            name="delivery_address"
                            required
                            value={formData.delivery_address}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Пожелания:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Оформление...' : 'Сформировать заказ'}
                </button>
            </form>
        </div>
    );
}

export default OrderForm;
