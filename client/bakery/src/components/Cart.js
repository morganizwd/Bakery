// src/components/Cart.js

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import OrderForm from './OrderForm'; // Import OrderForm
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, Box, Divider } from '@mui/material';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useContext(CartContext);
    const [showOrderForm, setShowOrderForm] = useState(false);

    const handleQuantityChange = (productId, value) => {
        const qty = parseInt(value, 10);
        if (qty >= 1) {
            updateQuantity(productId, qty);
        }
    };

    const toggleOrderForm = () => {
        setShowOrderForm(!showOrderForm);
    };

    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Корзина
            </Typography>
            {cartItems.length === 0 ? (
                <Typography variant="body1">
                    Ваша корзина пуста. <Link to="/">Перейти к покупкам</Link>
                </Typography>
            ) : (
                <Box>
                    <Grid container spacing={4}>
                        {cartItems.map(item => (
                            <Grid item xs={12} key={item.id}>
                                <Card sx={{ display: 'flex', marginBottom: '20px' }}>
                                    {item.photo && (
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000${item.photo}`}
                                            alt={item.name}
                                            sx={{ width: 150, height: 'auto' }}
                                        />
                                    )}
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="h5" component="h3">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Цена за единицу: {item.price} ₽
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                            <TextField
                                                label="Количество"
                                                type="number"
                                                inputProps={{ min: 1 }}
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                sx={{ width: '80px', marginRight: '10px' }}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Удалить
                                            </Button>
                                        </Box>
                                        <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                            Итого: {item.price * item.quantity} ₽
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Divider sx={{ marginY: '20px' }} />
                    <Typography variant="h4" component="h2">
                        Общая сумма: {totalAmount} ₽
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={toggleOrderForm}
                        sx={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
                    >
                        {showOrderForm ? 'Отмена' : 'Сформировать заказ'}
                    </Button>
                    {showOrderForm && (
                        <Box sx={{ marginTop: '20px' }}>
                            <OrderForm />
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
}

export default Cart;
