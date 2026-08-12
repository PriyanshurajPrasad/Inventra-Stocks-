import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { Add, Edit, Delete, Warehouse, LocationOn, Shield, Verified, Store } from '@mui/icons-material';
import Layout from '../components/Layout';
import ConfirmDialog from '../components/ConfirmDialog';
import { warehouseService } from '../services/warehouseService';
import { useAuth } from '../context/AuthContext';

const WarehousesPage = () => {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    isActive: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canEdit = ['ADMIN', 'WAREHOUSE'].includes(user?.role);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await warehouseService.getWarehouses();
      const list = res.data?.warehouses || res.warehouses || res.data || (Array.isArray(res) ? res : []);
      setWarehouses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch warehouses list.');
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedWarehouse(null);
    setFormData({ name: '', location: '', description: '', isActive: true });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (wh) => {
    setSelectedWarehouse(wh);
    setFormData({
      name: wh.name || '',
      location: wh.location || '',
      description: wh.description || '',
      isActive: wh.isActive !== undefined ? wh.isActive : true,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWarehouse) {
        await warehouseService.updateWarehouse(selectedWarehouse._id, formData);
        setSuccessMessage('Warehouse details updated!');
      } else {
        await warehouseService.createWarehouse(formData);
        setSuccessMessage('New warehouse created!');
      }
      setModalOpen(false);
      fetchWarehouses();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!warehouseToDelete) return;
    try {
      await warehouseService.deleteWarehouse(warehouseToDelete._id);
      setSuccessMessage('Warehouse record deleted.');
      setDeleteDialogOpen(false);
      fetchWarehouses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete warehouse.');
    }
  };

  return (
    <Layout title="Warehouse Locations">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Warehouse Hubs Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage physical stock distribution facilities, location addresses, and operational statuses.
          </Typography>
        </Box>

        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreateModal}
            sx={{ fontWeight: 800, borderRadius: 3, px: 2.5 }}
          >
            Add Warehouse
          </Button>
        )}
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {warehouses.map((wh) => (
          <Grid item xs={12} sm={6} md={4} key={wh._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 4,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                transition: 'all 0.25s ease-in-out',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 16px 30px rgba(0,0,0,0.5)'
                      : '0 16px 30px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header Row: Icon & Status Chip */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)',
                    }}
                  >
                    <Warehouse fontSize="medium" />
                  </Box>

                  <Chip
                    label={wh.isActive ? 'OPERATIONAL' : 'INACTIVE'}
                    color={wh.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      letterSpacing: '0.5px',
                      height: 24,
                      px: 1,
                    }}
                  />
                </Box>

                {/* Warehouse Name & Location */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.3,
                      letterSpacing: '-0.3px',
                      mb: 0.5,
                      color: 'text.primary',
                    }}
                  >
                    {wh.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontWeight: 600,
                      fontSize: '0.82rem',
                    }}
                  >
                    <LocationOn fontSize="small" sx={{ color: 'primary.main', fontSize: '1rem' }} />
                    {wh.location}
                  </Typography>
                </Box>

                {/* Facility Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.5,
                    fontSize: '0.85rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2.5,
                    flexGrow: 1,
                  }}
                >
                  {wh.description || 'Primary physical stock storage facility & fulfillment center.'}
                </Typography>

                {/* Facility Badge Bar */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    FACILITY STATUS
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Verified sx={{ fontSize: 14, color: wh.isActive ? 'success.main' : 'text.disabled' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: wh.isActive ? 'success.main' : 'text.disabled',
                      }}
                    >
                      {wh.isActive ? 'ACTIVE HUB' : 'OFFLINE'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Action Buttons */}
              {canEdit && (
                <Box
                  sx={{
                    px: 3,
                    py: 1.8,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1.5,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(248, 250, 252, 0.5)',
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit fontSize="small" />}
                    onClick={() => handleOpenEditModal(wh)}
                    sx={{ fontWeight: 700, borderRadius: 2, px: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete fontSize="small" />}
                    onClick={() => {
                      setWarehouseToDelete(wh);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ fontWeight: 700, borderRadius: 2, px: 2 }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create / Edit Form Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedWarehouse ? 'Edit Warehouse Facility' : 'Add New Warehouse'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth
              required
              label="Warehouse Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2.5 }}
            />
            <TextField
              fullWidth
              required
              label="Location / Address"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ mb: 2.5 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2.5 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="success"
                />
              }
              label="Is Facility Operational & Active?"
              slotProps={{ typography: { fontWeight: 700, fontSize: '0.9rem' } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 800 }}>
              Save Warehouse
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Warehouse Facility"
        message={`Are you sure you want to delete warehouse "${warehouseToDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Layout>
  );
};

export default WarehousesPage;
