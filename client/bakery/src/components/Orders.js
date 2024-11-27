import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

function Orders() {
    const { authData } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        short_review: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const allowedStatuses = ['на рассмотрении', 'выполняется', 'выполнен', 'отменён'];

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchDate, searchStatus, orders]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });
            setOrders(response.data);
            setFilteredOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        if (searchDate) {
            filtered = filtered.filter((order) =>
                new Date(order.date_of_ordering).toISOString().startsWith(searchDate)
            );
        }

        if (searchStatus) {
            filtered = filtered.filter((order) => order.status === searchStatus);
        }

        setFilteredOrders(filtered);
    };

    const handleCancelOrder = async () => {
        if (!orderToCancel) return;

        try {
            await axios.put(
                `/api/orders/${orderToCancel}/status`,
                { status: 'отменён' },
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderToCancel ? { ...order, status: 'отменён' } : order
                )
            );
            alert('Заказ успешно отменён.');
        } catch (error) {
            console.error('Ошибка при отмене заказа:', error);
            alert('Не удалось отменить заказ.');
        } finally {
            setOrderToCancel(null);
            setOpenDialog(false);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
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
            await axios.post(
                '/api/reviews',
                {
                    ...reviewData,
                    orderId: selectedOrder.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
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

            {/* Фильтры */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px' }}>
                <TextField
                    label="Поиск по дате (ГГГГ-ММ-ДД)"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                />
                <Select
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">Все статусы</MenuItem>
                    {allowedStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        setSearchDate('');
                        setSearchStatus('');
                    }}
                >
                    Сбросить фильтры
                </Button>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : filteredOrders.length === 0 ? (
                <Typography>У вас ещё нет заказов.</Typography>
            ) : (
                <List>
                    {filteredOrders.map((order) => (
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
                                        {order.OrderItems.map((item) => (
                                            <ListItem key={item.id} sx={{ display: 'list-item' }}>
                                                {item.Product.name} x {item.quantity} = {item.Product.price * item.quantity} ₽
                                            </ListItem>
                                        ))}
                                    </List>
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
                                    {order.status === 'на рассмотрении' && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setOrderToCancel(order.id);
                                                setOpenDialog(true);
                                            }}
                                            sx={{ marginTop: '10px' }}
                                        >
                                            Отменить заказ
                                        </Button>
                                    )}
                                </Box>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Диалог отмены заказа */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Подтверждение отмены</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCancelOrder} color="error" variant="contained">
                        Отменить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Orders;
