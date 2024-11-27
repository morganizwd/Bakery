import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Avatar,
    IconButton,
} from '@mui/material';
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
            setFormData((prev) => ({ ...prev, photo: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
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
            setFormData((prev) => ({ ...prev, password: '', photo: null }));
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            toast.error(error.response?.data?.message || 'Не удалось обновить профиль');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', padding: '20px' }}>
                <CircularProgress />
                <Typography sx={{ marginTop: '20px' }}>Загрузка...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Профиль пользователя
            </Typography>
            <ToastContainer />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={
                            formData.photo
                                ? URL.createObjectURL(formData.photo)
                                : user.photo
                                    ? `http://localhost:5000${user.photo}`
                                    : null
                        }
                        sx={{ width: 300, height: 300 }}
                    />
                    <IconButton component="label">
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            hidden
                            onChange={handleChange}
                        />
                        <Button variant="outlined">Изменить фото</Button>
                    </IconButton>
                </Box>

                <TextField
                    label="Имя*"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Фамилия"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Электронная почта*"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                    fullWidth
                />
                <TextField
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Дата рождения"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />
                <TextField
                    label="Новый пароль"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Оставьте пустым, если не хотите менять пароль"
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                >
                    {submitting ? 'Обновление...' : 'Обновить профиль'}
                </Button>
            </Box>
        </Container>
    );
}

export default Profile;
