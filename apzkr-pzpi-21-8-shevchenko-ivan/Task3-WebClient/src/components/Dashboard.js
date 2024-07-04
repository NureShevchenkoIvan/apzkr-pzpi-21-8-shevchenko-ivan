import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Paper, Typography, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/sensors/data');
        setSensorData(result.data);
        
        if (result.data.length > 0) {
          const dates = [...new Set(result.data.map(data => new Date(data.timestamp).toLocaleDateString()))];
          const latestDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];
          setSelectedDate(latestDate);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const sensorIds = [...new Set(sensorData.map(data => data.sensorId))];
  const dates = [...new Set(sensorData.map(data => new Date(data.timestamp).toLocaleDateString()))];

  const filteredData = sensorData
    .filter(data => !selectedSensor || data.sensorId === selectedSensor)
    .filter(data => new Date(data.timestamp).toLocaleDateString() === selectedDate);

    const prepareChartData = (type, property) => {
      return filteredData
        .filter(d => d.type === type)
        .map(d => ({
          timestamp: new Date(d.timestamp).toLocaleTimeString(),
          value: typeof d.value === 'object' ? d.value[property] : d.value
        }));
    };

  const moistureData = prepareChartData('soil_moisture');
  const temperatureData = prepareChartData('soil_temperature');
  const nitrogenData = prepareChartData('nutrients', 'nitrogen');
  const phosphorusData = prepareChartData('nutrients', 'phosphorus');
  const potassiumData = prepareChartData('nutrients', 'potassium');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">{t('dashboard')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Select
          value={selectedSensor}
          onChange={e => setSelectedSensor(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">{t('allSensors')}</MenuItem>
          {sensorIds.map(id => (
            <MenuItem key={id} value={id}>{id}</MenuItem>
          ))}
        </Select>
        <Select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        >
          {dates.map(date => (
            <MenuItem key={date} value={date}>{date}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6">{t('soilMoisture')}</Typography>
          <LineChart width={500} height={300} data={moistureData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h6">{t('soilTemperature')}</Typography>
          <LineChart width={500} height={300} data={temperatureData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper>
          <Typography variant="h6">{t('nitrogen')}</Typography>
          <LineChart width={500} height={300} data={nitrogenData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper>
          <Typography variant="h6">{t('phosphorus')}</Typography>
          <LineChart width={500} height={300} data={phosphorusData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper>
          <Typography variant="h6">{t('potassium')}</Typography>
          <LineChart width={500} height={300} data={potassiumData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ffc658" />
          </LineChart>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;