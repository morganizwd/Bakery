const { Bakery, Product, Review, User, sequelize } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

class BakeryController {
    async registration(req, res) {
        try {
            const {
                name,
                contact_person_name,
                registration_number,
                phone,
                description,
                email,
                password,
                address,
            } = req.body;

            const existingBakery = await Bakery.findOne({ where: { email } });
            if (existingBakery) {
                return res.status(400).json({ message: 'Пекарня с таким email уже существует' });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const bakery = await Bakery.create({
                name,
                contact_person_name,
                registration_number,
                phone,
                description,
                email,
                password: passwordHash,
                address,
                photo: req.file ? `/uploads/bakeries/${req.file.filename}` : null,
            });

            res.status(201).json(bakery);
        } catch (error) {
            console.error('Ошибка при регистрации пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const bakery = await Bakery.findOne({ where: { email } });
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            const isMatch = await bcrypt.compare(password, bakery.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { bakeryId: bakery.id },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '24h' }
            );

            res.json({ token, user: bakery });
        } catch (error) {
            console.error('Ошибка при входе пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async auth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            const bakery = await Bakery.findByPk(decoded.bakeryId);

            res.json(bakery);
        } catch (error) {
            console.error('Ошибка при аутентификации пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;

            const bakery = await Bakery.findByPk(id, {
                include: [
                    { model: Product },
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['name', 'surname'] }]
                    },
                ],
            });

            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            res.json(bakery);
        } catch (error) {
            console.error('Ошибка при получении пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findAll(req, res) {
        try {
            const { name, address, averageRating, limit, offset } = req.query;

            const whereConditions = {};
            if (name) {
                whereConditions.name = { [Op.iLike]: `%${name}%` };

            }
            if (address) {
                whereConditions.address = { [Op.iLike]: `%${address}%` };
            }

            let havingConditions = null;
            if (averageRating) {
                havingConditions = sequelize.where(
                    sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 1),
                    {
                        [Op.gte]: parseFloat(averageRating)
                    }
                );
            }

            const { rows, count } = await Bakery.findAndCountAll({
                where: whereConditions,
                include: [
                    {
                        model: Review,
                        attributes: [], 
                    },
                ],
                attributes: {
                    include: [
                        [
                            sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 1),
                            'averageRating'
                        ],
                        [
                            sequelize.fn('COUNT', sequelize.col('Reviews.id')),
                            'reviewCount'
                        ],
                    ],
                },
                group: ['Bakery.id'],
                having: havingConditions,
                order: [['name', 'ASC']],
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                subQuery: false,
            });

            res.json({
                bakeries: rows,
                total: count.length, 
            });
        } catch (error) {
            console.error('Ошибка при получении списка пекарен:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async update(req, res) {
        try {
            const {
                name,
                contact_person_name,
                registration_number,
                phone,
                description,
                email,
                password,
                address,
            } = req.body;
            const bakeryId = req.params.id;

            const bakery = await Bakery.findByPk(bakeryId);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            let updatedData = {
                name,
                contact_person_name,
                registration_number,
                phone,
                description,
                email,
                address,
            };
            if (password) {
                updatedData.password = await bcrypt.hash(password, 12);
            }

            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/bakeries');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const photoPath = `/uploads/bakeries/${bakeryId}_${req.file.originalname}`;
                fs.writeFileSync(path.join(uploadDir, `${bakeryId}_${req.file.originalname}`), req.file.buffer);
                updatedData.photo = photoPath;
            }

            await bakery.update(updatedData);

            res.json(bakery);
        } catch (error) {
            console.error('Ошибка при обновлении пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async delete(req, res) {
        try {
            const bakery = await Bakery.findByPk(req.params.id);
            if (!bakery) {
                return res.status(404).json({ message: 'Пекарня не найдена' });
            }

            await bakery.destroy();

            res.status(200).json({ message: 'Пекарня успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении пекарни:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new BakeryController();