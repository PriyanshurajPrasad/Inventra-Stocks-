import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Alert,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Description,
  CheckCircle,
  Cancel,
  Visibility,
  Delete,
  Print,
  Edit,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import ConfirmDialog from '../components/ConfirmDialog';
import ChallanFormModal from '../components/ChallanFormModal';
import ChallanViewModal from '../components/ChallanViewModal';
import { challanService } from '../services/challanService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const ChallansPage = () => {
  const { user } = useAuth();
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [editingChallan, setEditingChallan] = useState(null);

  // Confirmation dialogs
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: null, // 'confirm' | 'cancel' | 'delete'
    challan: null,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canCreateOrEdit = ['ADMIN', 'SALES'].includes(user?.role);

  useEffect(() => {
    fetchChallans();
  }, [statusTab, search]);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusTab !== 'ALL') params.status = statusTab;
      if (search) params.search = search;

      const res = await challanService.getChallans(params);
      const list = res.data?.challans || res.challans || res.data || (Array.isArray(res) ? res : []);
      setChallans(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch sales challans list.');
      setChallans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallan = async (challanData) => {
    try {
      if (editingChallan) {
        await challanService.updateChallan(editingChallan._id, challanData);
        setSuccessMessage('Challan updated successfully!');
      } else {
        await challanService.createChallan(challanData);
        setSuccessMessage('Sales Challan created as DRAFT!');
      }
      setFormModalOpen(false);
      setEditingChallan(null);
      fetchChallans();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sales challan.');
    }
  };

  const handleExecuteAction = async () => {
    const { type, challan } = actionDialog;
    if (!challan) return;

    try {
      if (type === 'confirm') {
        await challanService.confirmChallan(challan._id);
        setSuccessMessage(`Challan ${challan.challanNumber} CONFIRMED! Stock deducted.`);
      } else if (type === 'cancel') {
        await challanService.cancelChallan(challan._id);
        setSuccessMessage(`Challan ${challan.challanNumber} CANCELLED. Stock restored if applicable.`);
      } else if (type === 'delete') {
        await challanService.deleteChallan(challan._id);
        setSuccessMessage(`Challan ${challan.challanNumber} deleted.`);
      }
      setActionDialog({ open: false, type: null, challan: null });
      fetchChallans();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
      setActionDialog({ open: false, type: null, challan: null });
    }
  };

  const columns = [
    {
      field: 'challanNumber',
      headerName: 'Challan No',
      flex: 1,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" fontSize="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {row.challanNumber}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1.2,
      renderCell: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {row.customer?.customerName || 'N/A'}
          </Typography>
          {row.customer?.businessName && (
            <Typography variant="caption" color="text.secondary">
              {row.customer.businessName}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'totalQuantity',
      headerName: 'Total Qty',
      flex: 0.8,
      renderCell: (row) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {row.totalQuantity} items
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.9,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      renderCell: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.createdAt ? format(new Date(row.createdAt), 'dd MMM yyyy, hh:mm a') : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      align: 'right',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          {/* View Details */}
          <Tooltip title="View & Print Invoice">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setSelectedChallan(row);
                setViewModalOpen(true);
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Edit Draft */}
          {canCreateOrEdit && row.status === 'DRAFT' && (
            <Tooltip title="Edit Draft Items">
              <IconButton
                size="small"
                color="info"
                onClick={() => {
                  setEditingChallan(row);
                  setFormModalOpen(true);
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Confirm Challan */}
          {canCreateOrEdit && row.status === 'DRAFT' && (
            <Tooltip title="Confirm & Deduct Stock">
              <IconButton
                size="small"
                color="success"
                onClick={() => setActionDialog({ open: true, type: 'confirm', challan: row })}
              >
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Cancel Challan */}
          {canCreateOrEdit && (row.status === 'DRAFT' || row.status === 'CONFIRMED') && (
            <Tooltip title="Cancel Challan">
              <IconButton
                size="small"
                color="warning"
                onClick={() => setActionDialog({ open: true, type: 'cancel', challan: row })}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Delete Draft */}
          {canCreateOrEdit && row.status !== 'CONFIRMED' && (
            <Tooltip title="Delete Record">
              <IconButton
                size="small"
                color="error"
                onClick={() => setActionDialog({ open: true, type: 'delete', challan: row })}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Layout title="Sales Challans System">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Sales Challan Operations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage draft challans, confirm stock deductions, print delivery notes, and handle order cancellations.
          </Typography>
        </Box>

        {canCreateOrEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setEditingChallan(null);
              setFormModalOpen(true);
            }}
          >
            Create Sales Challan
          </Button>
        )}
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

      {/* Tabs & Search Header */}
      <Paper sx={{ px: 2, pt: 1, pb: 2, mb: 3, borderRadius: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Tabs
              value={statusTab}
              onChange={(e, val) => setStatusTab(val)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ minHeight: 44 }}
            >
              <Tab label="All Challans" value="ALL" sx={{ fontWeight: 700 }} />
              <Tab label="Drafts" value="DRAFT" sx={{ fontWeight: 700 }} />
              <Tab label="Confirmed" value="CONFIRMED" sx={{ fontWeight: 700 }} />
              <Tab label="Cancelled" value="CANCELLED" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by challan number..."
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
        </Grid>
      </Paper>

      {/* Challans Table */}
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <DataTable columns={columns} data={challans} loading={loading} />
      </Paper>

      {/* Create / Edit Form Modal */}
      <ChallanFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingChallan(null);
        }}
        onSubmit={handleCreateChallan}
        initialValues={editingChallan}
        title={editingChallan ? 'Edit Sales Challan Draft' : 'Create Sales Challan'}
      />

      {/* View & Print Invoice Modal */}
      <ChallanViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        challan={selectedChallan}
      />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={actionDialog.open}
        title={
          actionDialog.type === 'confirm'
            ? 'Confirm Challan & Deduct Stock'
            : actionDialog.type === 'cancel'
            ? 'Cancel Sales Challan'
            : 'Delete Challan Record'
        }
        message={
          actionDialog.type === 'confirm'
            ? `Are you sure you want to CONFIRM challan ${actionDialog.challan?.challanNumber}? Stock will be deducted automatically.`
            : actionDialog.type === 'cancel'
            ? `Are you sure you want to CANCEL challan ${actionDialog.challan?.challanNumber}? If confirmed previously, stock will be restored.`
            : `Are you sure you want to permanently DELETE challan ${actionDialog.challan?.challanNumber}?`
        }
        onConfirm={handleExecuteAction}
        onClose={() => setActionDialog({ open: false, type: null, challan: null })}
      />
    </Layout>
  );
};

export default ChallansPage;
