const SensorData = require('../models/SensorData');
const analysisService = require('../services/analysisService');

exports.receiveSensorData = async (req, res) => {
  try {
    const { sensorId, type, value } = req.body;
    const newSensorData = new SensorData({ sensorId, type, value });
    await newSensorData.save();
    res.status(201).json({ message: 'Sensor data saved successfully' });
  } catch (error) {
    console.error("Error in receiveSensorData:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const { sensorId, type, startDate, endDate } = req.query;
    const query = { sensorId, type };
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const data = await SensorData.find(query).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.importSensorData = async (req, res) => {
  try {
    const sensorData = req.body;

    await SensorData.insertMany(sensorData);

    res.status(200).json({ message: 'Sensor data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.find();
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { sensorId, cropName } = req.query;
    const recommendations = await analysisService.analyzeSoilConditions(req.user.userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};