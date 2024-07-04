import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Paper, Typography, Select, MenuItem, Button } from '@mui/material';
import axios from 'axios';

function Recommendations() {
  const { t } = useTranslation();
  const [sensorIds, setSensorIds] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSensorIds();
    fetchCrops();
    fetchSelectedSensors();
  }, []);

  const fetchRecommendations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/recommendations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations, selectedSensors]);

  const fetchSensorIds = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/sensors/data');
    const uniqueSensorIds = [...new Set(response.data.map(data => data.sensorId))];
    setSensorIds(uniqueSensorIds);
  } catch (error) {
    console.error('Error fetching sensor IDs:', error);
  }
};

  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const fetchSelectedSensors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/recommendations/selected', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedSensors(response.data);
    } catch (error) {
      console.error('Error fetching selected sensors:', error);
    }
  };

  const handleAddSensor = async (sensorId, cropName) => {
    try {
      await axios.post('http://localhost:3000/api/recommendations/selected', { sensorId, cropName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSelectedSensors();
      fetchRecommendations();
    } catch (error) {
      console.error('Error adding sensor:', error);
    }
  };

  const handleRemoveSensor = async (sensorId, cropName) => {
    try {
      await axios.delete(`http://localhost:3000/api/recommendations/selected?sensorId=${sensorId}&cropName=${cropName}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSelectedSensors();
      fetchRecommendations();
    } catch (error) {
      console.error('Error removing sensor:', error);
    }
  };

  const groupRecommendations = (recs) => {
    const grouped = {};
    recs.forEach(rec => {
      const key = `${rec.sensorId}|${rec.cropName}`;
      if (!grouped[key]) {
        grouped[key] = {
          sensorId: rec.sensorId,
          cropName: rec.cropName,
          recommendations: []
        };
      }
      grouped[key].recommendations.push(rec.recommendation);
    });
    return Object.values(grouped);
  };
  
  const translateRecommendation = (recommendation) => {
    const translations = {
      'Water needed:': t('waterNeeded'),
      'Warning:': t('warning'),
      'Add nitrogen fertilizer:': t('addNitrogen'),
      'Add phosphorus fertilizer:': t('addPhosphorus'),
      'Add potassium fertilizer:': t('addPotassium'),
      'soil moisture is': t('soilMoistureIs'),
      'soil temperature is': t('soilTemperatureIs'),
      'optimal for': t('optimalFor'),
      'current': t('current'),
      'required': t('required'),
      'is': t('is'),
    };

    let translatedRec = recommendation;
    Object.entries(translations).forEach(([eng, trans]) => {
      translatedRec = translatedRec.replace(eng, trans);
    });

    return translatedRec;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">{t('recommendations')}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6">{t('addSensor')}</Typography>
          <Select
            value=""
            onChange={(e) => {
              const [sensorId, cropName] = e.target.value.split('|');
              handleAddSensor(sensorId, cropName);
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>{t('selectSensor')}</MenuItem>
            {sensorIds.map((sensorId) => (
              crops.map((crop) => (
                <MenuItem key={`${sensorId}|${crop.name}`} value={`${sensorId}|${crop.name}`}>
                  {sensorId} - {crop.name}
                </MenuItem>
              ))
            ))}
          </Select>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6">{t('selectedSensors')}</Typography>
          {selectedSensors.map(({ sensorId, cropName }) => (
            <div key={`${sensorId}|${cropName}`}>
              {sensorId} - {cropName}
              <Button onClick={() => handleRemoveSensor(sensorId, cropName)}>{t('remove')}</Button>
            </div>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6">{t('recommendations')}</Typography>
          {groupRecommendations(recommendations).map(({ sensorId, cropName, recommendations }) => (
            <div key={`${sensorId}|${cropName}`}>
              <Typography variant="subtitle1">{sensorId} - {cropName}</Typography>
              {recommendations.map((recommendation, index) => (
                <Typography key={index}>{translateRecommendation(recommendation)}</Typography>
              ))}
            </div>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Recommendations;
