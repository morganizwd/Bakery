import React, { useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const { authData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);

        if (photo) {
            data.append('photo', photo);
        }

        try {
            await axios.post(`/api/products`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Товар успешно добавлен!');
            navigate('/bakery-admin/products');
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
            alert('Ошибка при добавлении товара');
        }
    };

    return (
        <div>
            <h2>Добавить новый товар</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Название:
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Описание:
                        <textarea name="description" required value={formData.description} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Цена:
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Фото:
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                </div>

                <button type="submit">Добавить товар</button>
            </form>
        </div>
    );
}

export default AddProduct;
