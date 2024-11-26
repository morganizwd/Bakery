import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function BakeryRoute({ children }) {
    const { authData } = useContext(AuthContext);

    return authData.isAuthenticated && authData.role === 'bakery' ? (
        children
    ) : (
        <Navigate to="/login" />
    );
}

export default BakeryRoute;
