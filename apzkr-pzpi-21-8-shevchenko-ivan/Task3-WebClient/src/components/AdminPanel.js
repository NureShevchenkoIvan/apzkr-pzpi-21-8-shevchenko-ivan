import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Paper, Typography } from '@mui/material';
import UserManagement from './UserManagement';
import DataManagement from './DataManagement';

function AdminPanel() {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">{t('adminPanel')}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <UserManagement />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <DataManagement />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminPanel;