import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Edit, Delete, ManageAccounts, Badge } from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { userService } from '../services/userService';
import { format } from 'date-fns';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'SALES',
    isActive: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      const list = res.data?.users || res.users || res.data || (Array.isArray(res) ? res : []);
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch system users list.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (u) => {
    setSelectedUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'SALES',
      isActive: u.isActive !== undefined ? u.isActive : true,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser._id, formData);
        setSuccessMessage('User profile updated!');
        setModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete._id);
      setSuccessMessage('User deleted from system.');
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'secondary';
      case 'SALES':
        return 'primary';
      case 'WAREHOUSE':
        return 'warning';
      case 'ACCOUNTS':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'User Profile',
      flex: 1.2,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'System Role',
      flex: 0.9,
      renderCell: (row) => (
        <Chip
          label={row.role}
          color={getRoleColor(row.role)}
          size="small"
          sx={{ fontWeight: 800, fontSize: '0.75rem' }}
        />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (row) => (
        <Chip
          label={row.isActive ? 'ACTIVE' : 'DISABLED'}
          color={row.isActive ? 'success' : 'default'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined Date',
      flex: 1,
      renderCell: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.createdAt ? format(new Date(row.createdAt), 'dd MMM yyyy') : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      align: 'right',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setUserToDelete(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Layout title="User Administration">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            User Accounts & Roles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system users, assign role access levels, and toggle account activation.
          </Typography>
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={users} loading={loading} />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ borderRadius: 4 }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ManageAccounts color="primary" /> Edit User Role & Privileges
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth
              disabled
              label="Full Name"
              value={formData.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              disabled
              label="Email Address"
              value={formData.email}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Assigned Role</InputLabel>
              <Select
                value={formData.role}
                label="Assigned Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="SALES">SALES Representative</MenuItem>
                <MenuItem value="WAREHOUSE">WAREHOUSE Manager</MenuItem>
                <MenuItem value="ACCOUNTS">ACCOUNTS Manager</MenuItem>
                <MenuItem value="ADMIN">SYSTEM ADMIN</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="success"
                />
              }
              label="Account Active Status"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save User Profile
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User Account"
        message={`Are you sure you want to delete user account "${userToDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Layout>
  );
};

export default UsersPage;
