const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.put('/:userId', authMiddleware, adminMiddleware, userController.updateUser);
router.put('/:userId/ban', authMiddleware, adminMiddleware, userController.banUser);
router.put('/:userId/unban', authMiddleware, adminMiddleware, userController.unbanUser);
router.delete('/:userId', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;