// src/components/Cart.js

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import OrderForm from './OrderForm'; // Импортируем OrderForm

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useContext(CartContext);
    const [showOrderForm, setShowOrderForm] = useState(false);

    const handleQuantityChange = (productId, value) => {
        const qty = parseInt(value, 10);
        if (qty >= 1) {
            updateQuantity(productId, qty);
        }
    };

    const toggleOrderForm = () => {
        setShowOrderForm(!showOrderForm);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Корзина</h1>
            {cartItems.length === 0 ? (
                <p>Ваша корзина пуста. <Link to="/">Перейти к покупкам</Link></p>
            ) : (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cartItems.map(item => (
                            <li key={item.id} style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                {item.photo && (
                                    <img
                                        src={`http://localhost:5000${item.photo}`}
                                        alt={item.name}
                                        style={{ width: '150px', height: 'auto', marginRight: '20px' }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p>Цена за единицу: {item.price} ₽</p>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>
                                            Количество:
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                style={{ width: '60px', marginLeft: '10px' }}
                                            />
                                        </label>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ marginLeft: '10px', padding: '5px 10px' }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                    <p>Итого: {item.price * item.quantity} ₽</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h2>Общая сумма: {totalAmount} ₽</h2>
                    <button onClick={toggleOrderForm} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
                        {showOrderForm ? 'Отмена' : 'Сформировать заказ'}
                    </button>
                    {showOrderForm && <OrderForm />}
                </div>
            )}
        </div>
    );
}

export default Cart;
