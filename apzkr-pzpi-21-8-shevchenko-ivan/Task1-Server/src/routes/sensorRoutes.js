const express = require('express');
const sensorController = require('../controllers/sensorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/data', sensorController.receiveSensorData);
router.get('/data', sensorController.getSensorData);
router.post('/data/import', authMiddleware, sensorController.importSensorData);
router.get('/data/export', authMiddleware, sensorController.exportSensorData);
router.get('/recommendations', authMiddleware, sensorController.getRecommendations);

module.exports = router;
