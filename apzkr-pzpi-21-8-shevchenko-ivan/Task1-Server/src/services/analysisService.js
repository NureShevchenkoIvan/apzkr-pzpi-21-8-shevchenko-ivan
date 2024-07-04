const SensorData = require('../models/SensorData');
const Crop = require('../models/Crop');
const User = require('../models/User');
const moment = require('moment-timezone');

exports.analyzeSoilConditions = async (userId) => {
  const user = await User.findById(userId);
  const { selectedSensors, timezone } = user;
  const recommendations = [];

  for (const { sensorId, cropName } of selectedSensors) {
    const crop = await Crop.findOne({ name: cropName });
    if (!crop) continue;

    const [moistureData, temperatureData, nutrientsData] = await Promise.all([
      SensorData.findOne({ sensorId, type: 'soil_moisture' }).sort({ timestamp: -1 }),
      SensorData.findOne({ sensorId, type: 'soil_temperature' }).sort({ timestamp: -1 }),
      SensorData.findOne({ sensorId, type: 'nutrients' }).sort({ timestamp: -1 })
    ]);

    if (!moistureData || !temperatureData || !nutrientsData) {
      continue;
    }

    const localTimestamp = moment.tz(moistureData.timestamp, timezone).format();

    // Moisture analysis
    if (moistureData.value < crop.optimalSoilMoisture - 10) {
      recommendations.push({
        sensorId,
        cropName,
        data: { moisture: moistureData.value },
        timestamp: localTimestamp,
        recommendation: `Water needed: soil moisture is ${moistureData.value}%, optimal for ${cropName} is ${crop.optimalSoilMoisture}%`
      });
    }

    // Temperature analysis
    if (Math.abs(temperatureData.value - crop.optimalSoilTemperature) > 5) {
      recommendations.push({
        sensorId,
        cropName,
        data: { temperature: temperatureData.value },
        timestamp: localTimestamp,
        recommendation: `Warning: soil temperature is ${temperatureData.value}°C, optimal for ${cropName} is ${crop.optimalSoilTemperature}°C`
      });
    }

    // Nutrients analysis
    const { nitrogen, phosphorus, potassium } = nutrientsData.value;
    if (nitrogen < crop.requiredNutrients.nitrogen) {
      recommendations.push({
        sensorId,
        cropName,
        data: { nutrients: { nitrogen } },
        timestamp: localTimestamp,
        recommendation: `Add nitrogen fertilizer: current ${nitrogen} ppm, required ${crop.requiredNutrients.nitrogen} ppm`
      });
    }

    if (phosphorus < crop.requiredNutrients.phosphorus) {
      recommendations.push({
        sensorId,
        cropName,
        data: { nutrients: { phosphorus } },
        timestamp: localTimestamp,
        recommendation: `Add phosphorus fertilizer: current ${phosphorus} ppm, required ${crop.requiredNutrients.phosphorus} ppm`
      });
    }

    if (potassium < crop.requiredNutrients.potassium) {
      recommendations.push({
        sensorId,
        cropName,
        data: { nutrients: { potassium } },
        timestamp: localTimestamp,
        recommendation: `Add potassium fertilizer: current ${potassium} ppm, required ${crop.requiredNutrients.potassium} ppm`
      });
    }
  }

  return recommendations;
};