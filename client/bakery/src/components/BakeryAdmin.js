// src/components/BakeryAdmin.js

import React from 'react';
import { Link } from 'react-router-dom';

function BakeryAdmin() {
    return (
        <div>
            <h1>Панель управления пекарни</h1>
            <ul>
                <li>
                    <Link to="/bakery-admin/edit">Редактировать информацию о пекарне</Link>
                </li>
                <li>
                    <Link to="/bakery-admin/products">Управление товарами</Link>
                </li>
                <li>
                    <Link to="/bakery-admin/orders">Управление заказами</Link>
                </li>
            </ul>
        </div>
    );
}

export default BakeryAdmin;
