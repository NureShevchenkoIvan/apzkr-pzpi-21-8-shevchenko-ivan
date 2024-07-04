const express = require('express');
const cropController = require('../controllers/cropController');

const router = express.Router();

router.post('/', cropController.createCrop);
router.get('/', cropController.getAllCrops);

module.exports = router;