const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  optimalSoilMoisture: { type: Number, required: true }, // %
  optimalSoilTemperature: { type: Number, required: true }, // °C
  requiredNutrients: {
    nitrogen: { type: Number, required: true }, // ppm
    phosphorus: { type: Number, required: true }, // ppm
    potassium: { type: Number, required: true } // ppm
  }
});

module.exports = mongoose.model('Crop', cropSchema);