// src/components/BakeryAdmin.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import BakeryRoute from './BakeryRoute';

function BakeryAdmin() {
    return (
        <BakeryRoute>
            <Container sx={{ padding: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Панель управления пекарни
                </Typography>
                <List>
                    <ListItem>
                        <Button component={Link} to="/bakery-admin/edit" variant="outlined" color="primary" fullWidth>
                            <ListItemText primary="Редактировать информацию о пекарне" />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button component={Link} to="/bakery-admin/products" variant="outlined" color="primary" fullWidth>
                            <ListItemText primary="Управление товарами" />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button component={Link} to="/bakery-admin/orders" variant="outlined" color="primary" fullWidth>
                            <ListItemText primary="Управление заказами" />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button component={Link} to="/dashboard" variant="outlined" color="primary" fullWidth>
                            <ListItemText primary="Панель управления" />
                        </Button>
                    </ListItem>
                </List>
            </Container>
        </BakeryRoute>
    );
}

export default BakeryAdmin;