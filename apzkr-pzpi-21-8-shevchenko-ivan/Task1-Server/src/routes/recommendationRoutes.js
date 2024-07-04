const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, recommendationController.getRecommendations);
router.post('/selected', authMiddleware, recommendationController.addSelectedSensor);
router.delete('/selected', authMiddleware, recommendationController.removeSelectedSensor);
router.get('/selected', authMiddleware, recommendationController.getSelectedSensors);

module.exports = router;