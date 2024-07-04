import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser._id}`, selectedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleBanUser = async (userId, banned) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${userId}/${banned ? 'ban' : 'unban'}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
    } catch (error) {
      console.error(`Error ${banned ? 'banning' : 'unbanning'} user:`, error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemText primary={user.username} secondary={user.email} />
            <Button onClick={() => { setSelectedUser(user); setOpen(true); }}>{t('edit')}</Button>
            <Button onClick={() => handleBanUser(user._id, !user.banned)}>{user.banned ? t('unban') : t('ban')}</Button>
            <Button onClick={() => handleDeleteUser(user._id)}>{t('delete')}</Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('editUser')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('username')}
            fullWidth
            value={selectedUser?.username || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label={t('email')}
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleEditUser}>{t('save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserManagement;