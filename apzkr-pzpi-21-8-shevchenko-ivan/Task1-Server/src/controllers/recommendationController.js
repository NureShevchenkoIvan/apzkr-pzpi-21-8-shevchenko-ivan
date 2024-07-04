const User = require('../models/User');
const analysisService = require('../services/analysisService');

exports.addSelectedSensor = async (req, res) => {
  try {
    const { userId } = req.user;
    const { sensorId, cropName } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.selectedSensors.push({ sensorId, cropName });
    await user.save();
    res.status(200).json({ message: 'Sensor added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSelectedSensor = async (req, res) => {
  try {
    const { userId } = req.user;
    const { sensorId, cropName } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.selectedSensors = user.selectedSensors.filter(
      sensor => !(sensor.sensorId === sensorId && sensor.cropName === cropName)
    );
    await user.save();
    res.status(200).json({ message: 'Sensor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSelectedSensors = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('selectedSensors');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.selectedSensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
    try {
      const { userId } = req.user;
      const recommendations = await analysisService.analyzeSoilConditions(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };