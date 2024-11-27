// src/components/Navbar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const { authData, setAuthData } = useContext(AuthContext);

    const isUser = authData.user !== null;
    const isBakery = authData.bakery !== null;

    const handleLogout = () => {
        setAuthData({ token: null, user: null, bakery: null });
        localStorage.removeItem('token');
    };

    return (
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Link to="/" style={{ marginRight: '10px' }}>Главная</Link>
            <Link to="/cart" style={{ marginRight: '10px' }}>Корзина</Link>

            {isUser && (
                <>
                    <Link to="/orders" style={{ marginRight: '10px' }}>Мои заказы</Link>
                    <Link to="/profile" style={{ marginRight: '10px' }}>Профиль</Link>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Выйти</button>
                </>
            )}

            {isBakery && (
                <>
                    <Link to="/bakery-admin" style={{ marginRight: '10px' }}>Админка пекарни</Link>
                    <Link to="/bakery-admin/orders" style={{ marginRight: '10px' }}>Заказы пекарни</Link>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Выйти</button>
                </>
            )}

            {!isUser && !isBakery && (
                <>
                    <Link to="/register" style={{ marginRight: '10px' }}>Регистрация</Link>
                    <Link to="/login" style={{ marginRight: '10px' }}>Вход</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
