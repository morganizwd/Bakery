import React, { useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [role, setRole] = useState('user'); // 'user' или 'bakery'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = role === 'user' ? '/api/users/login' : '/api/bakeries/login';
            const response = await axios.post(url, formData);
            const token = response.data.token;

            // Получаем данные пользователя из ответа
            const user = response.data.user;

            // Сохраняем токен, данные пользователя и роль в контексте и localStorage
            login({ user, token, role });

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);

            alert('Вход выполнен успешно!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка при входе');
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Я вхожу как:
                        <select value={role} onChange={handleRoleChange}>
                            <option value="user">Покупатель</option>
                            <option value="bakery">Пекарня</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Email:
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Пароль:
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} />
                    </label>
                </div>

                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default Login;
