import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function EditProduct() {
    const { id } = useParams();
    const { authData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setFormData({
                name: response.data.name,
                description: response.data.description,
                price: response.data.price,
            });
        } catch (error) {
            console.error('Ошибка при получении информации о товаре:', error);
        }
    };

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
            await axios.put(`/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Товар успешно обновлен!');
            navigate('/bakery-admin/products');
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
            alert('Ошибка при обновлении товара');
        }
    };

    return (
        <div>
            <h2>Редактировать товар</h2>
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

                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
}

export default EditProduct;
