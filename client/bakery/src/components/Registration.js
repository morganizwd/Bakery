import React, { useState } from 'react';
import axios from '../api/axiosConfig';

function Registration() {
    const [role, setRole] = useState('user'); // 'user' или 'bakery'
    const [formData, setFormData] = useState({
        // Общие поля
        email: '',
        password: '',
        confirmPassword: '',
        // Поля для пользователя
        name: '',
        surname: '',
        phone: '',
        birth_date: '',
        description: '',
        // Поля для пекарни
        bakeryName: '',
        contactPersonName: '',
        registrationNumber: '',
        bakeryPhone: '',
        bakeryDescription: '',
        address: '',
    });
    const [photo, setPhoto] = useState(null); // Для загрузки фото

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация пароля
        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        // Создание объекта FormData для отправки данных, включая файл
        const data = new FormData();

        if (role === 'user') {
            data.append('name', formData.name);
            data.append('surname', formData.surname);
            data.append('phone', formData.phone);
            data.append('birth_date', formData.birth_date);
            data.append('description', formData.description);
        } else {
            data.append('name', formData.bakeryName);
            data.append('contact_person_name', formData.contactPersonName);
            data.append('registration_number', formData.registrationNumber);
            data.append('phone', formData.bakeryPhone);
            data.append('description', formData.bakeryDescription);
            data.append('address', formData.address);
        }

        data.append('email', formData.email);
        data.append('password', formData.password);

        if (photo) {
            data.append('photo', photo);
        }

        try {
            const url = role === 'user' ? '/api/users/registration' : '/api/bakeries/registration';
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Регистрация прошла успешно!');
            // Перенаправление на страницу входа или другую страницу
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert('Ошибка при регистрации');
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Я хочу зарегистрироваться как:
                        <select value={role} onChange={handleRoleChange}>
                            <option value="user">Покупатель</option>
                            <option value="bakery">Пекарня</option>
                        </select>
                    </label>
                </div>

                {/* Общие поля */}
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

                <div>
                    <label>
                        Подтвердите пароль:
                        <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
                    </label>
                </div>

                {/* Поля для покупателя */}
                {role === 'user' && (
                    <>
                        <div>
                            <label>
                                Имя:
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Фамилия:
                                <input type="text" name="surname" required value={formData.surname} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Телефон:
                                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Дата рождения:
                                <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Описание:
                                <textarea name="description" value={formData.description} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Фото:
                                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </>
                )}

                {/* Поля для пекарни */}
                {role === 'bakery' && (
                    <>
                        <div>
                            <label>
                                Название пекарни:
                                <input type="text" name="bakeryName" required value={formData.bakeryName} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Контактное лицо:
                                <input type="text" name="contactPersonName" required value={formData.contactPersonName} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Регистрационный номер:
                                <input type="text" name="registrationNumber" required value={formData.registrationNumber} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Телефон:
                                <input type="text" name="bakeryPhone" required value={formData.bakeryPhone} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Адрес:
                                <input type="text" name="address" required value={formData.address} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Описание:
                                <textarea name="bakeryDescription" value={formData.bakeryDescription} onChange={handleChange} />
                            </label>
                        </div>

                        <div>
                            <label>
                                Фото:
                                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </>
                )}

                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Registration;
