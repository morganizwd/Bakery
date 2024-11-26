// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import BakeryDetails from './components/BakeryDetails';
import BakeryAdmin from './components/BakeryAdmin';
import BakeryOrders from './components/BakeryOrders'; // Импортируем новый компонент
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import BakeryRoute from './components/BakeryRoute';
import EditBakeryInfo from './components/EditBakeryInfo';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Cart from './components/Cart';
import Orders from './components/Orders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Главная</Link>
          <Link to="/cart" style={{ marginRight: '10px' }}>Корзина</Link>
          <Link to="/orders" style={{ marginRight: '10px' }}>Мои заказы</Link>
          <Link to="/bakery-admin" style={{ marginRight: '10px' }}>Админка пекарни</Link>
          {/* Добавьте другие ссылки, например, вход/регистрация */}
        </nav>
        <Routes>
          <Route path="/orders" element={<Orders />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/bakeries/:id" element={<BakeryDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bakeries/:id" element={<BakeryDetails />} />
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
          {/* Другие маршруты */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
