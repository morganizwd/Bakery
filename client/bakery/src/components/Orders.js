import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import Modal from 'react-modal';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Divider, CircularProgress, TextField, Select, MenuItem, InputLabel } from '@mui/material';

Modal.setAppElement('#root');

function Orders() {
    const { authData } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        short_review: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            console.log('Полученные заказы:', response.data); 
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            setLoading(false);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (reviewData.rating < 1 || reviewData.rating > 5) {
            alert('Рейтинг должен быть от 1 до 5');
            return;
        }
        if (!reviewData.short_review.trim() || !reviewData.description.trim()) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/api/reviews', {
                ...reviewData,
                orderId: selectedOrder.id,
            }, {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            alert('Отзыв успешно создан!');
            setSubmitting(false);
            setSelectedOrder(null);
            setReviewData({ rating: 5, short_review: '', description: '' });
            fetchOrders(); 
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            alert(error.response?.data?.message || 'Не удалось создать отзыв');
            setSubmitting(false);
        }
    };

    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Мои заказы
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : orders.length === 0 ? (
                <Typography>У вас ещё нет заказов.</Typography>
            ) : (
                <List>
                    {orders.map(order => (
                        <React.Fragment key={order.id}>
                            <ListItem alignItems="flex-start" sx={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', padding: '10px' }}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h6">Заказ №{order.id}</Typography>
                                    <ListItemText primary={`Адрес доставки: ${order.delivery_address}`} />
                                    <ListItemText primary={`Дата заказа: ${new Date(order.date_of_ordering).toLocaleString()}`} />
                                    <ListItemText primary={`Статус: ${order.status}`} />
                                    <ListItemText primary={`Итоговая сумма: ${order.total_cost} ₽`} />
                                    <ListItemText primary={`Пожелания: ${order.description || 'Отсутствуют'}`} />
                                    <Typography variant="subtitle1" gutterBottom>Товары:</Typography>
                                    <List sx={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                        {order.OrderItems.map(item => (
                                            <ListItem key={item.id} sx={{ display: 'list-item' }}>
                                                {item.Product.name} x {item.quantity} = {item.Product.price * item.quantity} ₽
                                            </ListItem>
                                        ))}
                                    </List>
                                    {order.Review && (
                                        <Box sx={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                                            <Typography variant="subtitle1">Ваш отзыв:</Typography>
                                            <Typography>Рейтинг: {order.Review.rating} звезд</Typography>
                                            <Typography><em>{order.Review.short_review}</em></Typography>
                                            <Typography>{order.Review.description}</Typography>
                                            <Typography variant="caption">Дата: {new Date(order.Review.createdAt).toLocaleString()}</Typography>
                                        </Box>
                                    )}
                                    {order.status === 'выполнен' && !order.Review && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedOrder(order)}
                                            sx={{ marginTop: '10px' }}
                                        >
                                            Написать отзыв
                                        </Button>
                                    )}
                                </Box>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}
            <Modal
                isOpen={selectedOrder !== null}
                onRequestClose={() => setSelectedOrder(null)}
                contentLabel="Написать Отзыв"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '20px',
                    },
                }}
            >
                {selectedOrder && (
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Написать Отзыв для Заказа №{selectedOrder.id}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmitReview} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <InputLabel id="rating-label">Рейтинг</InputLabel>
                            <Select
                                labelId="rating-label"
                                name="rating"
                                value={reviewData.rating}
                                onChange={handleReviewChange}
                                required
                            >
                                {[5, 4, 3, 2, 1].map(r => (
                                    <MenuItem key={r} value={r}>{r} {r === 1 ? 'звезда' : 'звезды'}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="Короткий Отзыв"
                                name="short_review"
                                value={reviewData.short_review}
                                onChange={handleReviewChange}
                                required
                            />
                            <TextField
                                label="Полный Отзыв"
                                name="description"
                                multiline
                                rows={4}
                                value={reviewData.description}
                                onChange={handleReviewChange}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Отправка...' : 'Отправить Отзыв'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Modal>
        </Container>
    );
}

export default Orders;
