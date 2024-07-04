import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

function DataManagement() {
  const { t } = useTranslation();

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/sensors/data/export', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.json');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

const handleImport = async (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    const jsonData = JSON.parse(e.target.result);

    try {
      await axios.post('http://localhost:3000/api/sensors/data/import', jsonData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert(t('importSuccess'));
    } catch (error) {
      console.error('Error importing data:', error);
      alert(t('importError'));
    }
  };

  reader.readAsText(file);
};

  return (
    <>
      <Typography variant="h6">{t('dataManagement')}</Typography>
      <Button onClick={handleExport}>{t('exportData')}</Button>
      <Button component="label">
        {t('importData')}
        <input type="file" hidden onChange={handleImport} />
      </Button>
    </>
  );
}

export default DataManagement;