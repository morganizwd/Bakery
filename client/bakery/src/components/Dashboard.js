import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
    const { authData, logout } = useContext(AuthContext);

    return (
        <div>
            <h2>Панель управления</h2>
            <p>Добро пожаловать, {authData.user ? authData.user.name || authData.user.email : 'Пользователь'}!</p>
            <button onClick={logout}>Выйти</button>
        </div>
    );
}

export default Dashboard;
