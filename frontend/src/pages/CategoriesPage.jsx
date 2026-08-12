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
} from '@mui/material';
import { Add, Edit, Delete, Category } from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';

const CategoriesPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canEdit = ['ADMIN', 'WAREHOUSE'].includes(user?.role);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      const list = res.data?.categories || res.categories || res.data || (Array.isArray(res) ? res : []);
      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch categories list.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setFormData({ name: '', description: '' });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat);
    setFormData({ name: cat.name || '', description: cat.description || '' });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory._id, formData);
        setSuccessMessage('Category updated successfully!');
      } else {
        await categoryService.createCategory(formData);
        setSuccessMessage('New category created!');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.deleteCategory(categoryToDelete._id);
      setSuccessMessage('Category deleted.');
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Category color="primary" fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      renderCell: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.description || 'No description provided'}
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
          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setCategoryToDelete(row);
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
    <Layout title="Category Management">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Product Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize products by clear category structures for catalog navigation.
          </Typography>
        </Box>

        {canEdit && (
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenCreate}>
            Add Category
          </Button>
        )}
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={categories} loading={loading} />
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ borderRadius: 4 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedCategory ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth
              required
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Category
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Layout>
  );
};

export default CategoriesPage;
