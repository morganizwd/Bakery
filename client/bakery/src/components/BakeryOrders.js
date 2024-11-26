// src/components/BakeryOrders.js

import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

function BakeryOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Статусы, доступные для обновления
    const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/bakeries/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Ошибка при получении заказов:', err);
            setError('Не удалось загрузить заказы.');
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
            // Обновляем локальное состояние
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: response.data.status } : order
                )
            );
            alert('Статус заказа успешно обновлён.');
        } catch (err) {
            console.error('Ошибка при обновлении статуса заказа:', err);
            alert('Не удалось обновить статус заказа.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;

        try {
            await axios.delete(`/api/orders/${orderId}`);
            // Удаляем заказ из локального состояния
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            alert('Заказ успешно удалён.');
        } catch (err) {
            console.error('Ошибка при удалении заказа:', err);
            alert('Не удалось удалить заказ.');
        }
    };

    if (loading) return <p>Загрузка заказов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bakery-orders-container">
            <h1>Управление Заказами</h1>
            {orders.length === 0 ? (
                <p>Нет доступных заказов.</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID Заказа</th>
                            <th>Имя Клиента</th>
                            <th>Адрес Доставки</th>
                            <th>Товары</th>
                            <th>Общая Стоимость</th>
                            <th>Статус</th>
                            <th>Дата Заказа</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.User.name} {order.User.surname}</td>
                                <td>{order.delivery_address}</td>
                                <td>
                                    <ul>
                                        {order.OrderItems.map(item => (
                                            <li key={item.id}>
                                                {item.Product.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{order.total_cost} ₽</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        {allowedStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>{new Date(order.date_of_ordering).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleDeleteOrder(order.id)} style={{ color: 'red' }}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BakeryOrders;
