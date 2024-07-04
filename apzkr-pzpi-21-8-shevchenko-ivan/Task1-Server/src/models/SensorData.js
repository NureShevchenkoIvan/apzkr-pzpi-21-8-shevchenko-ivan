const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  type: { type: String, enum: ['soil_moisture', 'soil_temperature', 'nutrients'], required: true },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v) {
        if (this.type === 'nutrients') {
          return typeof v === 'object' && v !== null && 'nitrogen' in v && 'phosphorus' in v && 'potassium' in v;
        }
        return typeof v === 'number';
      },
      message: props => `${JSON.stringify(props.value)} is not a valid value for sensor type ${props.type}!`
    }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);