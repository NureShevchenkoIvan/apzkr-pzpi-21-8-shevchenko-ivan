import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Register from './components/Register';
import Login from './components/Login';
import Recommendations from './components/Recommendations';

function App() {
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {t('appName')}
          </Typography>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/">
                {t('dashboard')}
              </Button>
              <Button color="inherit" component={Link} to="/recommendations">
                {t('recommendations')}
              </Button>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/admin">
                  {t('adminPanel')}
                </Button>
              )}
              <Button color="inherit" onClick={() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setIsAdmin(false);
              }}>
                {t('logout')}
              </Button>
            </>
          )}
          <Button color="inherit" onClick={() => changeLanguage('en')}>EN</Button>
          <Button color="inherit" onClick={() => changeLanguage('uk')}>UK</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/recommendations" element={isLoggedIn ? <Recommendations /> : <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;