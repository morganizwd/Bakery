import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button } from '@mui/material';

function BakeryAdmin() {
    console.log('BakeryAdmin rendered');
    return (
        <Container sx={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Панель управления пекарни
            </Typography>
            <List>
                <ListItem>
                    <Button component={Link} to="/bakery-admin/edit" variant="outlined" color="primary" fullWidth>
                        Редактировать информацию о пекарне
                    </Button>
                </ListItem>
                <ListItem>
                    <Button component={Link} to="/bakery-admin/products" variant="outlined" color="primary" fullWidth>
                        Управление товарами
                    </Button>
                </ListItem>
                <ListItem>
                    <Button component={Link} to="/bakery-admin/orders" variant="outlined" color="primary" fullWidth>
                        Управление заказами
                    </Button>
                </ListItem>
            </List>
        </Container>
    );
}

export default BakeryAdmin;