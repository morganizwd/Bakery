import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';

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
        <div>
            <h1>Список пекарен</h1>
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
                    {bakeries.length > 0 ? (
                        <ul>
                            {bakeries.map((bakery) => (
                                <li key={bakery.id}>
                                    <h2>{bakery.name}</h2>
                                    {bakery.photo && (
                                        <img
                                            src={`http://localhost:5000${bakery.photo}`}
                                            alt={bakery.name}
                                            style={{ width: '200px', height: 'auto' }}
                                        />
                                    )}
                                    <p>{bakery.description}</p>
                                    <p>Адрес: {bakery.address}</p>
                                    <Link to={`/bakeries/${bakery.id}`}>Подробнее</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Пекарни не найдены.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;
