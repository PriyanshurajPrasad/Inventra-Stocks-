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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Add, SwapVert } from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { format } from 'date-fns';

const InventoryPage = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [productFilter, setProductFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantityChanged: 1,
    movementType: 'IN',
    reason: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [productFilter, typeFilter]);

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts({ limit: 100 });
      const list = res.data?.products || res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch products for inventory form', err);
      setProducts([]);
    }
  };

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const params = {};
      if (productFilter) params.product = productFilter;
      if (typeFilter) params.movementType = typeFilter;

      const res = await inventoryService.getStockMovements(params);
      const list = res.data?.movements || res.movements || res.data || (Array.isArray(res) ? res : []);
      setMovements(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to load stock movements history.');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      product: products[0]?._id || '',
      quantityChanged: 1,
      movementType: 'IN',
      reason: '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.product) {
        setError('Please select a product');
        return;
      }
      if (Number(formData.quantityChanged) <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }
      if (!formData.reason.trim()) {
        setError('Please enter a valid reason for stock movement');
        return;
      }

      await inventoryService.createStockMovement({
        product: formData.product,
        quantityChanged: Number(formData.quantityChanged),
        movementType: formData.movementType,
        reason: formData.reason,
      });

      setSuccessMessage('Stock movement logged successfully!');
      setModalOpen(false);
      fetchMovements();
      fetchProducts(); // update stock info
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record movement.');
    }
  };

  const selectedProdObj = products.find((p) => p._id === formData.product);
  const currentStock = selectedProdObj ? selectedProdObj.currentStock : 0;
  const predictedStock =
    formData.movementType === 'IN'
      ? currentStock + (Number(formData.quantityChanged) || 0)
      : currentStock - (Number(formData.quantityChanged) || 0);

  const columns = [
    {
      field: 'product',
      headerName: 'Product Item',
      flex: 1.2,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.product?.productName || 'Unknown Product'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {row.product?.sku || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'movementType',
      headerName: 'Movement',
      flex: 0.8,
      renderCell: (row) => <StatusChip status={row.movementType} />,
    },
    {
      field: 'quantityChanged',
      headerName: 'Quantity',
      flex: 0.8,
      renderCell: (row) => (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: row.movementType === 'IN' ? 'success.main' : 'warning.main',
          }}
        >
          {row.movementType === 'IN' ? `+${row.quantityChanged}` : `-${row.quantityChanged}`}
        </Typography>
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason / Description',
      flex: 1.5,
      renderCell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.reason}
        </Typography>
      ),
    },
    {
      field: 'createdBy',
      headerName: 'Logged By',
      flex: 0.8,
      renderCell: (row) => (
        <Typography variant="body2">{row.createdBy?.name || 'System'}</Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      flex: 1,
      renderCell: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.createdAt ? format(new Date(row.createdAt), 'dd MMM yyyy, hh:mm a') : '-'}
        </Typography>
      ),
    },
  ];

  return (
    <Layout title="Stock Movement Tracker">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Inventory Stock Movements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track real-time stock insertions (IN) and deductions (OUT) with audit logs.
          </Typography>
        </Box>

        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenModal}>
          Record Stock Movement
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Filters Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Filter by Product</InputLabel>
              <Select value={productFilter} label="Filter by Product" onChange={(e) => setProductFilter(e.target.value)}>
                <MenuItem value="">All Products</MenuItem>
                {products.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.productName} ({p.sku})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Movement Type</InputLabel>
              <Select value={typeFilter} label="Movement Type" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="">All Movements</MenuItem>
                <MenuItem value="IN">Stock IN (+)</MenuItem>
                <MenuItem value="OUT">Stock OUT (-)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={2} md={3} sx={{ textAlign: 'right' }}>
            <Button
              variant="text"
              color="inherit"
              size="small"
              onClick={() => {
                setProductFilter('');
                setTypeFilter('');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Movements Table */}
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={movements} loading={loading} />
      </Paper>

      {/* Log Stock Movement Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ borderRadius: 4 }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SwapVert color="primary" /> Record Stock Movement
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Target Product</InputLabel>
                  <Select
                    value={formData.product}
                    label="Target Product"
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  >
                    {products.map((p) => (
                      <MenuItem key={p._id} value={p._id}>
                        {p.productName} ({p.sku}) - [Stock: {p.currentStock}]
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Movement Direction</InputLabel>
                  <Select
                    value={formData.movementType}
                    label="Movement Direction"
                    onChange={(e) => setFormData({ ...formData, movementType: e.target.value })}
                  >
                    <MenuItem value="IN">Stock IN (Receive +)</MenuItem>
                    <MenuItem value="OUT">Stock OUT (Dispatch -)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Quantity"
                  inputProps={{ min: 1 }}
                  value={formData.quantityChanged}
                  onChange={(e) => setFormData({ ...formData, quantityChanged: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  label="Reason / Description"
                  placeholder="e.g. Purchase order receipt, damage disposal, physical audit adjustment..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Grid>
            </Grid>

            {/* Live Prediction Preview */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 3,
                borderRadius: 3,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                border: '1px dashed rgba(99, 102, 241, 0.4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Current Stock: <strong>{currentStock}</strong>
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: predictedStock < 0 ? 'error.main' : 'primary.main',
                }}
              >
                New Stock Preview: {predictedStock} units
              </Typography>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Log Movement
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default InventoryPage;
