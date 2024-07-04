import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', { username, fullName, email, password });
      alert(t('registerSuccess'));
      navigate('/login');
    } catch (error) {
      alert(t('registerError'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">{t('register')}</Typography>
      <TextField
        label={t('username')}
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <TextField
        label={t('fullName')}
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        required
      />
      <TextField
        type="email"
        label={t('email')}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <TextField
        type="password"
        label={t('password')}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit">{t('register')}</Button>
    </form>
  );
}

export default Register;