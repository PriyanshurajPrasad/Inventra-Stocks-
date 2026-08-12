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
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Inventory,
  Edit,
  Delete,
  ContentCopy,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import ConfirmDialog from '../components/ConfirmDialog';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { warehouseService } from '../services/warehouseService';
import { useAuth } from '../context/AuthContext';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: 0,
    minimumStockAlertQuantity: 10,
    warehouse: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedSku, setCopiedSku] = useState('');

  const canEdit = ['ADMIN', 'WAREHOUSE'].includes(user?.role);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, warehouseFilter]);

  const fetchInitialData = async () => {
    try {
      const [catRes, whRes] = await Promise.all([
        categoryService.getCategories(),
        warehouseService.getWarehouses(),
      ]);
      const catList = catRes.data?.categories || catRes.categories || catRes.data || (Array.isArray(catRes) ? catRes : []);
      const whList = whRes.data?.warehouses || whRes.warehouses || whRes.data || (Array.isArray(whRes) ? whRes : []);
      setCategories(Array.isArray(catList) ? catList : []);
      setWarehouses(Array.isArray(whList) ? whList : []);
    } catch (err) {
      console.error('Failed to load categories/warehouses', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (warehouseFilter) params.warehouse = warehouseFilter;

      const res = await productService.getProducts(params);
      const list = res.data?.products || res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch product catalog');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySku = (sku) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(''), 2000);
  };

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      productName: '',
      sku: '',
      category: categories[0]?._id || '',
      unitPrice: '',
      currentStock: 0,
      minimumStockAlertQuantity: 10,
      warehouse: warehouses[0]?._id || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      productName: prod.productName || '',
      sku: prod.sku || '',
      category: prod.category?._id || prod.category || '',
      unitPrice: prod.unitPrice || 0,
      currentStock: prod.currentStock || 0,
      minimumStockAlertQuantity: prod.minimumStockAlertQuantity || 10,
      warehouse: prod.warehouse?._id || prod.warehouse || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct._id, formData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        setSuccessMessage('New product added to catalog!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Verify input parameters.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete._id);
      setSuccessMessage('Product deleted from inventory.');
      setDeleteDialogOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const columns = [
    {
      field: 'productName',
      headerName: 'Product & SKU',
      flex: 1.3,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.productName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
            <Chip
              label={row.sku}
              size="small"
              variant="outlined"
              onClick={() => handleCopySku(row.sku)}
              icon={<ContentCopy style={{ fontSize: 12 }} />}
              sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer' }}
            />
            {copiedSku === row.sku && (
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                Copied!
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      renderCell: (row) => (
        <Chip
          label={row.category?.name || 'General'}
          size="small"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      ),
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 0.9,
      renderCell: (row) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          ₹{Number(row.unitPrice).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'currentStock',
      headerName: 'Stock Status',
      flex: 1,
      renderCell: (row) => {
        const isLowStock = row.currentStock <= row.minimumStockAlertQuantity;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {row.currentStock} units
            </Typography>
            {isLowStock ? (
              <StatusChip status="LOW_STOCK" />
            ) : (
              <StatusChip status="IN_STOCK" />
            )}
          </Box>
        );
      },
    },
    {
      field: 'warehouse',
      headerName: 'Warehouse',
      flex: 1,
      renderCell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.warehouse?.name || 'Default Warehouse'}
        </Typography>
      ),
    },
    canEdit && {
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
              setProductToDelete(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ].filter(Boolean);

  return (
    <Layout title="Product Catalog & Inventory">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Product Inventory Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage product items, pricing, SKUs, warehouse allocations, and low stock thresholds.
          </Typography>
        </Box>

        {canEdit && (
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenCreateModal}>
            Add Product
          </Button>
        )}
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Filters Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by product name or SKU..."
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
              <InputLabel>Category</InputLabel>
              <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Warehouse</InputLabel>
              <Select value={warehouseFilter} label="Warehouse" onChange={(e) => setWarehouseFilter(e.target.value)}>
                <MenuItem value="">All Warehouses</MenuItem>
                {warehouses.map((w) => (
                  <MenuItem key={w._id} value={w._id}>
                    {w.name}
                  </MenuItem>
                ))}
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
                setCategoryFilter('');
                setWarehouseFilter('');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={products} loading={loading} />
      </Paper>

      {/* Product Create/Edit Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ borderRadius: 4 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedProduct ? 'Edit Product Details' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Product Name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="SKU Code"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Assigned Warehouse</InputLabel>
                  <Select
                    value={formData.warehouse}
                    label="Assigned Warehouse"
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  >
                    {warehouses.map((w) => (
                      <MenuItem key={w._id} value={w._id}>
                        {w.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Unit Price (₹)"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Current Stock"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Alert Qty"
                  value={formData.minimumStockAlertQuantity}
                  onChange={(e) => setFormData({ ...formData, minimumStockAlertQuantity: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Product
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Layout>
  );
};

export default ProductsPage;
