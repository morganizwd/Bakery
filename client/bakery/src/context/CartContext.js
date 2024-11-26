// src/context/CartContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Убедитесь, что axios настроен правильно

// Создаём контекст
export const CartContext = createContext();

// Создаём провайдер
export const CartProvider = ({ children }) => {
    // Инициализируем состояние корзины из localStorage или пустым массивом
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Сохраняем корзину в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Функция для добавления товара в корзину
    const addToCart = async (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Обновляем количество, если товар уже в корзине
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Добавляем новый товар в корзину, включая bakeryId
                return [...prevItems, { ...product, quantity, bakeryId: product.bakeryId }];
            }
        });

        try {
            // Отправляем запрос на сервер для добавления товара в корзину
            await axios.post('/api/baskets/add', { productId: product.id, quantity });
            console.log(`Товар ${product.name} добавлен в корзину на сервере`);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину на сервере:', error);
            // Опционально: откатить локальное состояние или уведомить пользователя
        }
    };

    // Функция для удаления товара из корзины
    const removeFromCart = async (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

        try {
            // Отправляем запрос на сервер для удаления товара из корзины
            await axios.delete(`/api/baskets/remove/${productId}`);
            console.log(`Товар ID: ${productId} удалён из корзины на сервере`);
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины на сервере:', error);
            // Опционально: откатить локальное состояние или уведомить пользователя
        }
    };

    // Функция для обновления количества товара
    const updateQuantity = async (productId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );

        try {
            // Отправляем запрос на сервер для обновления количества товара в корзине
            await axios.put(`/api/baskets/update/${productId}`, { quantity });
            console.log(`Количество товара ID: ${productId} обновлено на сервере`);
        } catch (error) {
            console.error('Ошибка при обновлении количества товара на сервере:', error);
            // Опционально: откатить локальное состояние или уведомить пользователя
        }
    };

    // Функция для очистки корзины
    const clearCart = async () => {
        setCartItems([]);

        try {
            // Отправляем запрос на сервер для очистки корзины
            await axios.delete('/api/baskets/clear');
            console.log('Корзина очищена на сервере');
        } catch (error) {
            console.error('Ошибка при очистке корзины на сервере:', error);
            // Опционально: уведомить пользователя
        }
    };

    // Вычисляем общую сумму
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
};
