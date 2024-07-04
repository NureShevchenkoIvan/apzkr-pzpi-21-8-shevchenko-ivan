const Crop = require('../models/Crop');

exports.createCrop = async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};