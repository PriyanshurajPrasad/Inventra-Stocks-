import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { Add, Delete, ShoppingBag, Calculate } from '@mui/icons-material';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';

const ChallanFormModal = ({ open, onClose, onSubmit, initialValues = null, title = 'Create Sales Challan' }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchData();
      if (initialValues) {
        setSelectedCustomer(initialValues.customer?._id || initialValues.customer || '');
        if (initialValues.items && Array.isArray(initialValues.items) && initialValues.items.length > 0) {
          setItems(
            initialValues.items.map((item) => ({
              product: item.product?._id || item.product || '',
              quantity: item.quantity || 1,
            }))
          );
        }
      } else {
        setSelectedCustomer('');
        setItems([{ product: '', quantity: 1 }]);
      }
      setError('');
    }
  }, [open, initialValues]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [custRes, prodRes] = await Promise.all([
        customerService.getCustomers({ limit: 100 }),
        productService.getProducts({ limit: 100 }),
      ]);

      const rawCust = custRes.data?.customers || custRes.customers || custRes.data || (Array.isArray(custRes) ? custRes : []);
      const customerList = Array.isArray(rawCust) ? rawCust : [];
      setCustomers(customerList);

      const rawProd = prodRes.data?.products || prodRes.products || prodRes.data || (Array.isArray(prodRes) ? prodRes : []);
      const productList = Array.isArray(rawProd) ? rawProd : [];
      setProducts(productList);
    } catch (err) {
      console.error('Failed to load customers and products list:', err);
      setError('Failed to load customers and products list');
      setCustomers([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotals = () => {
    let totalQty = 0;
    let totalPrice = 0;

    const safeProducts = Array.isArray(products) ? products : [];
    const safeItems = Array.isArray(items) ? items : [];

    safeItems.forEach((item) => {
      const prod = safeProducts.find((p) => p && (p._id === item.product || p.id === item.product));
      const qty = Number(item.quantity) || 0;
      totalQty += qty;
      if (prod && typeof prod.unitPrice === 'number') {
        totalPrice += prod.unitPrice * qty;
      }
    });

    return { totalQty, totalPrice };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    const validItems = items.filter((i) => i.product && i.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one valid product item with quantity > 0');
      return;
    }

    const safeProducts = Array.isArray(products) ? products : [];

    // Check stock for draft validation warning
    let stockError = '';
    validItems.forEach((item) => {
      const prod = safeProducts.find((p) => p && (p._id === item.product || p.id === item.product));
      if (prod && typeof prod.currentStock === 'number' && item.quantity > prod.currentStock) {
        stockError = `Insufficient stock for product "${prod.productName}". Available: ${prod.currentStock}, Requested: ${item.quantity}`;
      }
    });

    if (stockError) {
      setError(stockError);
      return;
    }

    onSubmit({
      customer: selectedCustomer,
      items: validItems.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
      })),
    });
  };

  const { totalQty, totalPrice } = calculateTotals();
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingBag color="primary" /> {title}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="customer-select-label">Select Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  value={selectedCustomer}
                  label="Select Customer"
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {safeCustomers.map((c) => (
                    <MenuItem key={c._id || c.id} value={c._id || c.id}>
                      {c.customerName} {c.businessName ? `(${c.businessName})` : ''} - {c.mobileNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Challan Items ({items.length})
            </Typography>
            <Button
              startIcon={<Add />}
              variant="outlined"
              size="small"
              onClick={handleAddItem}
              sx={{ borderRadius: 2 }}
            >
              Add Item Row
            </Button>
          </Box>

          <Paper variant="outlined" sx={{ overflow: 'hidden', mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '45%' }}>Product</TableCell>
                  <TableCell align="right" style={{ width: '20%' }}>Unit Price</TableCell>
                  <TableCell align="right" style={{ width: '20%' }}>Quantity</TableCell>
                  <TableCell align="right" style={{ width: '15%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => {
                  const selectedProd = safeProducts.find((p) => p && (p._id === item.product || p.id === item.product));
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.product}
                            displayEmpty
                            onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          >
                            <MenuItem value="" disabled>
                              -- Choose Product --
                            </MenuItem>
                            {safeProducts.map((p) => (
                              <MenuItem key={p._id || p.id} value={p._id || p.id}>
                                {p.productName} ({p.sku}) [Stock: {p.currentStock ?? 0}]
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{selectedProd && typeof selectedProd.unitPrice === 'number' ? selectedProd.unitPrice.toLocaleString() : '0'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          slotProps={{
                            htmlInput: {
                              min: 1,
                              max: selectedProd && typeof selectedProd.currentStock === 'number' ? selectedProd.currentStock : 9999,
                            },
                          }}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calculate color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Order Summary:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Items Qty: <strong>{totalQty}</strong>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Estimated Amount: ₹{totalPrice.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Challan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChallanFormModal;
