// src/context/CartContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (product, quantity) => {
        setCartItems(prevItems => {
            if (prevItems.length > 0) {
                const existingBakeryId = prevItems[0].bakeryId;
                if (existingBakeryId !== product.bakeryId) {
                    alert('Вы можете добавлять товары только из одной пекарни.');
                    return prevItems;
                }
            }

            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity, bakeryId: product.bakeryId }];
            }
        });

        try {
            await axios.post('/api/baskets/add', { productId: product.id, quantity });
            console.log(`Товар ${product.name} добавлен в корзину на сервере`);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину на сервере:', error);
        }
    };

    const removeFromCart = async (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

        try {
            await axios.delete(`/api/baskets/remove/${productId}`);
            console.log(`Товар ID: ${productId} удалён из корзины на сервере`);
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины на сервере:', error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );

        try {
            await axios.put(`/api/baskets/update/${productId}`, { quantity });
            console.log(`Количество товара ID: ${productId} обновлено на сервере`);
        } catch (error) {
            console.error('Ошибка при обновлении количества товара на сервере:', error);
        }
    };

    const clearCart = async () => {
        setCartItems([]);

        try {
            await axios.delete('/api/baskets/clear');
            console.log('Корзина очищена на сервере');
        } catch (error) {
            console.error('Ошибка при очистке корзины на сервере:', error);
        }
    };

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