import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn, setIsAdmin }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setIsAdmin(response.data.role === 'admin');
      navigate('/');
    } catch (error) {
      alert(t('loginError'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">{t('login')}</Typography>
      <TextField
        label={t('username')}
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <TextField
        type="password"
        label={t('password')}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit">{t('login')}</Button>
      <Typography>
        {t('dontHaveAccount')} <Link href="/register">{t('register')}</Link>
      </Typography>
    </form>
  );
}

export default Login;