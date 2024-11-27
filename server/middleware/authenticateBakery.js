const jwt = require('jsonwebtoken');

const authenticateBakery = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Нет токена, доступ запрещён' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded.bakeryId) {
            return res.status(403).json({ message: 'Токен недействителен или отсутствует bakeryId' });
        }

        req.user = { bakeryId: decoded.bakeryId };
        next();
    });
};

module.exports = authenticateBakery;
