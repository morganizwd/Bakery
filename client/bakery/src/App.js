// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Container } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
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
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
