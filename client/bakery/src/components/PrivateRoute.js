import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const { authData } = useContext(AuthContext);

    return authData.isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
