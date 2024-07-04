const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SensorData = require('./models/SensorData');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

app.get('/api/sensors/data', async (req, res) => {
  try {
    let query = {};
    
    // Додаємо фільтри, якщо вони є в запиті
    if (req.query.sensorId) {
      query.sensorId = req.query.sensorId;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Додаємо фільтр за датою, якщо вказані параметри
    if (req.query.startDate && req.query.endDate) {
      query.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const data = await SensorData.find(query).sort({ timestamp: -1 }).limit(100);
    
    console.log('Sending sensor data:', data);  // Для відлагодження
    res.json(data);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});