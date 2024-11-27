// src/components/Profile.js

import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const { authData } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        birth_date: '',
        description: '',
        photo: null,
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/users/auth', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                surname: response.data.surname || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                birth_date: response.data.birth_date ? response.data.birth_date.substring(0, 10) : '',
                description: response.data.description || '',
                photo: null,
                password: '',
            });
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            toast.error('Не удалось загрузить данные профиля');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData(prev => ({ ...prev, photo: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error('Пожалуйста, заполните обязательные поля (Имя, Email)');
            return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('surname', formData.surname);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('birth_date', formData.birth_date);
            data.append('description', formData.description);
            if (formData.password) {
                data.append('password', formData.password);
            }
            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            const response = await axios.put(`/api/users/${user.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authData.token}`,
                },
            });

            setUser(response.data);
            toast.success('Профиль успешно обновлён');
            setSubmitting(false);
            setFormData(prev => ({ ...prev, password: '', photo: null }));
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            toast.error(error.response?.data?.message || 'Не удалось обновить профиль');
            setSubmitting(false);
        }
    };

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

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Профиль пользователя</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Фото профиля:
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleChange}
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </label>
                    {user.photo && !formData.photo && (
                        <img
                            src={`http://localhost:5000${user.photo}`}
                            alt="Фото профиля"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }}
                        />
                    )}
                    {formData.photo && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Выбрано: {formData.photo.name}</p>
                            <img
                                src={URL.createObjectURL(formData.photo)}
                                alt="Предварительный просмотр"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Имя*:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Фамилия:
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Электронная почта*:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Телефон:
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Дата рождения:
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Описание:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        ></textarea>
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Новый пароль:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Оставьте пустым, если не хотите менять пароль"
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {submitting ? 'Обновление...' : 'Обновить профиль'}
                </button>
            </form>
        </div>
    );
}
export default Profile;