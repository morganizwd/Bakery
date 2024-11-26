import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

function EditBakeryInfo() {
    const { authData } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        contact_person_name: '',
        registration_number: '',
        phone: '',
        description: '',
        address: '',
    });
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null);

    useEffect(() => {
        fetchBakeryInfo();
    }, []);

    const fetchBakeryInfo = async () => {
        try {
            const response = await axios.get(`/api/bakeries/${authData.user.id}`);
            setFormData({
                name: response.data.name,
                contact_person_name: response.data.contact_person_name,
                registration_number: response.data.registration_number,
                phone: response.data.phone,
                description: response.data.description,
                address: response.data.address,
            });
            setCurrentPhoto(response.data.photo);
        } catch (error) {
            console.error('Ошибка при получении информации о пекарне:', error);
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
        data.append('contact_person_name', formData.contact_person_name);
        data.append('registration_number', formData.registration_number);
        data.append('phone', formData.phone);
        data.append('description', formData.description);
        data.append('address', formData.address);

        if (photo) {
            data.append('photo', photo);
        }

        try {
            const response = await axios.put(`/api/bakeries/${authData.user.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Информация успешно обновлена!');
            // Обновляем текущую фотографию
            if (response.data.photo) {
                setCurrentPhoto(response.data.photo);
            }
        } catch (error) {
            console.error('Ошибка при обновлении информации о пекарне:', error);
            alert('Ошибка при обновлении информации');
        }
    };

    return (
        <div>
            <h2>Редактировать информацию о пекарне</h2>
            {currentPhoto && (
                <div>
                    <p>Текущая фотография:</p>
                    <img
                        src={`http://localhost:5000${currentPhoto}`}
                        alt={formData.name}
                        style={{ width: '200px', height: 'auto' }}
                    />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Название пекарни:
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Контактное лицо:
                        <input
                            type="text"
                            name="contact_person_name"
                            required
                            value={formData.contact_person_name}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Регистрационный номер:
                        <input
                            type="text"
                            name="registration_number"
                            required
                            value={formData.registration_number}
                            onChange={handleChange}
                        />
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
                        Адрес:
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} />
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
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
}

export default EditBakeryInfo;
