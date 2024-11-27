import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';

function HomePage() {
    const [bakeries, setBakeries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBakeries();
    }, []);

    const fetchBakeries = async () => {
        try {
            const response = await axios.get('/api/bakeries');
            setBakeries(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка при получении списка пекарен:', error);
            setLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h3" component="h1" gutterBottom>
                Список пекарен
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <div>
                    {bakeries.length > 0 ? (
                        <Grid container spacing={4}>
                            {bakeries.map((bakery) => (
                                <Grid item xs={12} sm={6} md={4} key={bakery.id}>
                                    <Card>
                                        {bakery.photo && (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={`http://localhost:5000${bakery.photo}`}
                                                alt={bakery.name}
                                            />
                                        )}
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                {bakery.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {bakery.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Адрес: {bakery.address}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component={Link}
                                                to={`/bakeries/${bakery.id}`}
                                            >
                                                Подробнее
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1">Пекарни не найдены.</Typography>
                    )}
                </div>
            )}
        </Container>
    );
}

export default HomePage;