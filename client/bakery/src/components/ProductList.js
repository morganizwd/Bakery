import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProductList() {
    const { authData } = useContext(AuthContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/products/bakery/${authData.user.id}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка товаров:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                setProducts(products.filter((product) => product.id !== id));
            } catch (error) {
                console.error('Ошибка при удалении товара:', error);
            }
        }
    };

    return (
        <div>
            <h2>Управление товарами</h2>
            <Link to="/bakery-admin/products/add">Добавить новый товар</Link>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        {product.photo && (
                            <img
                                src={`http://localhost:5000${product.photo}`}
                                alt={product.name}
                                style={{ width: '150px', height: 'auto' }}
                            />
                        )}
                        <p>{product.description}</p>
                        <p>Цена: {product.price}</p>
                        <Link to={`/bakery-admin/products/edit/${product.id}`}>Редактировать</Link>
                        <button onClick={() => handleDelete(product.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;
