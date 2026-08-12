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
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Search,
  People,
  Edit,
  Delete,
  Phone,
  Email,
  Business,
  TrendingUp,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import ConfirmDialog from '../components/ConfirmDialog';
import { customerService } from '../services/customerService';
import { format } from 'date-fns';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'RETAIL',
    address: '',
    status: 'LEAD',
    followUpDate: '',
    notes: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter, typeFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.customerType = typeFilter;

      const res = await customerService.getCustomers(params);
      const list = res.data?.customers || res.customers || res.data || (Array.isArray(res) ? res : []);
      setCustomers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch customer directory');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCustomer(null);
    setFormData({
      customerName: '',
      mobileNumber: '',
      email: '',
      businessName: '',
      gstNumber: '',
      customerType: 'RETAIL',
      address: '',
      status: 'LEAD',
      followUpDate: '',
      notes: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerName: customer.customerName || '',
      mobileNumber: customer.mobileNumber || '',
      email: customer.email || '',
      businessName: customer.businessName || '',
      gstNumber: customer.gstNumber || '',
      customerType: customer.customerType || 'RETAIL',
      address: customer.address || '',
      status: customer.status || 'LEAD',
      followUpDate: customer.followUpDate ? customer.followUpDate.split('T')[0] : '',
      notes: customer.notes || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await customerService.updateCustomer(selectedCustomer._id, formData);
        setSuccessMessage('Customer details updated successfully!');
      } else {
        await customerService.createCustomer(formData);
        setSuccessMessage('New customer added to CRM!');
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please check inputs.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await customerService.deleteCustomer(customerToDelete._id);
      setSuccessMessage('Customer record deleted.');
      setDeleteDialogOpen(false);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer.');
    }
  };

  const columns = [
    {
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 1.2,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.customerName}
          </Typography>
          {row.businessName && (
            <Typography variant="caption" color="text.secondary">
              {row.businessName}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'mobileNumber',
      headerName: 'Contact',
      flex: 1,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Phone fontSize="inherit" color="action" /> {row.mobileNumber}
          </Typography>
          {row.email && (
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'customerType',
      headerName: 'Type',
      flex: 0.8,
      renderCell: (row) => <StatusChip status={row.customerType} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'followUpDate',
      headerName: 'Next Follow-up',
      flex: 1,
      renderCell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.followUpDate ? format(new Date(row.followUpDate), 'dd MMM yyyy') : '-'}
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
          <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setCustomerToDelete(row);
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
    <Layout title="Customer CRM Management">
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Customer Pipeline Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage customer profiles, lead statuses, follow-up dates, and contact history.
          </Typography>
        </Box>

        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenCreateModal}>
          Add Customer
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, business or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="LEAD">LEAD</MenuItem>
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Customer Type</InputLabel>
              <Select value={typeFilter} label="Customer Type" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="RETAIL">RETAIL</MenuItem>
                <MenuItem value="WHOLESALE">WHOLESALE</MenuItem>
                <MenuItem value="DISTRIBUTOR">DISTRIBUTOR</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={2} sx={{ textAlign: 'right' }}>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setTypeFilter('');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={customers} loading={loading} />
      </Paper>

      {/* Customer Create/Edit Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ borderRadius: 4 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedCustomer ? 'Edit Customer Details' : 'Add New Customer'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GSTIN Number"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    value={formData.customerType}
                    label="Customer Type"
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                  >
                    <MenuItem value="RETAIL">RETAIL</MenuItem>
                    <MenuItem value="WHOLESALE">WHOLESALE</MenuItem>
                    <MenuItem value="DISTRIBUTOR">DISTRIBUTOR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Pipeline Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Pipeline Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="LEAD">LEAD</MenuItem>
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Follow-up Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notes / Comments"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Customer
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Customer Record"
        message={`Are you sure you want to remove customer "${customerToDelete?.customerName}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Layout>
  );
};

export default CustomersPage;
