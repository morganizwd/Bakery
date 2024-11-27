import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import BakeryDetails from './components/BakeryDetails';
import BakeryAdmin from './components/BakeryAdmin';
import BakeryOrders from './components/BakeryOrders'; 
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import BakeryRoute from './components/BakeryRoute';
import EditBakeryInfo from './components/EditBakeryInfo';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Profile from './components/Profile';
import { AppBar, Toolbar, Button, Container, Box } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppBar position="static">
          <Container maxWidth="lg">
            <Toolbar>
              <Button component={Link} to="/" color="inherit" sx={{ marginRight: 2 }}>
                Главная
              </Button>
              <Button component={Link} to="/cart" color="inherit" sx={{ marginRight: 2 }}>
                Корзина
              </Button>
              <Button component={Link} to="/orders" color="inherit" sx={{ marginRight: 2 }}>
                Мои заказы
              </Button>
              <Button component={Link} to="/bakery-admin" color="inherit" sx={{ marginRight: 2 }}>
                Админка пекарни
              </Button>
              <Button component={Link} to="/profile" color="inherit" sx={{ marginRight: 2 }}>
                Профиль
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/bakeries/:id" element={<BakeryDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/bakery-admin"
              element={
                <BakeryRoute>
                  <BakeryAdmin />
                </BakeryRoute>
              }
            />
            <Route
              path="/bakery-admin/edit"
              element={
                <BakeryRoute>
                  <EditBakeryInfo />
                </BakeryRoute>
              }
            />
            <Route
              path="/bakery-admin/products"
              element={
                <BakeryRoute>
                  <ProductList />
                </BakeryRoute>
              }
            />
            <Route
              path="/bakery-admin/products/add"
              element={
                <BakeryRoute>
                  <AddProduct />
                </BakeryRoute>
              }
            />
            <Route
              path="/bakery-admin/products/edit/:id"
              element={
                <BakeryRoute>
                  <EditProduct />
                </BakeryRoute>
              }
            />
            <Route
              path="/bakery-admin/orders"
              element={
                <BakeryRoute>
                  <BakeryOrders />
                </BakeryRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;