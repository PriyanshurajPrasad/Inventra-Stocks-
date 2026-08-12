import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import { Print, Close, Description } from '@mui/icons-material';
import StatusChip from './StatusChip';
import { format } from 'date-fns';

const ChallanViewModal = ({ open, onClose, challan }) => {
  if (!challan) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateSubtotal = () => {
    if (!challan.items) return 0;
    return challan.items.reduce((acc, item) => {
      const price = item.unitPriceSnapshot || item.product?.unitPrice || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const formattedDate = challan.createdAt
    ? format(new Date(challan.createdAt), 'dd MMMM yyyy, hh:mm a')
    : 'N/A';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ borderRadius: 4 }}>
      <DialogTitle
        className="no-print"
        sx={{
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" /> Challan Details - {challan.challanNumber}
        </Box>
        <StatusChip status={challan.status} />
      </DialogTitle>

      <DialogContent dividers>
        {/* Printable Section Wrapper */}
        <Box id="printable-challan" sx={{ p: 2 }}>
          {/* Invoice Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                INVENTRA ERP
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Official Delivery & Sales Challan
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {challan.challanNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {formattedDate}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Customer & Creator Details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', mb: 1 }}>
                Billed To / Customer:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {challan.customer?.customerName || 'N/A'}
              </Typography>
              {challan.customer?.businessName && (
                <Typography variant="body2">{challan.customer.businessName}</Typography>
              )}
              <Typography variant="body2">Mobile: {challan.customer?.mobileNumber || 'N/A'}</Typography>
              {challan.customer?.address && (
                <Typography variant="body2" color="text.secondary">
                  Address: {challan.customer.address}
                </Typography>
              )}
              {challan.customer?.gstNumber && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                  GSTIN: {challan.customer.gstNumber}
                </Typography>
              )}
            </Grid>

            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', mb: 1 }}>
                Challan Info:
              </Typography>
              <Typography variant="body2">Status: <strong>{challan.status}</strong></Typography>
              <Typography variant="body2">Created By: {challan.createdBy?.name || 'System'}</Typography>
              <Typography variant="body2">Total Items Qty: {challan.totalQuantity || 0}</Typography>
            </Grid>
          </Grid>

          {/* Items Table */}
          <Paper variant="outlined" sx={{ overflow: 'hidden', mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Item / Description</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {challan.items?.map((item, idx) => {
                  const prodName = item.productNameSnapshot || item.product?.productName || 'Product';
                  const sku = item.skuSnapshot || item.product?.sku || 'N/A';
                  const unitPrice = item.unitPriceSnapshot || item.product?.unitPrice || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{prodName}</TableCell>
                      <TableCell>{sku}</TableCell>
                      <TableCell align="right">₹{unitPrice.toLocaleString()}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        ₹{itemTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>

          {/* Footer Total */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <Box sx={{ minWidth: 240, textAlign: 'right' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Quantity:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{challan.totalQuantity}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Amount:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₹{calculateSubtotal().toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Signatures */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 6 }}>
            <Box sx={{ textAlign: 'center', width: 200 }}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">Customer Signature</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', width: 200 }}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">Authorized Signatory</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="no-print" sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit" startIcon={<Close />}>
          Close
        </Button>
        <Button onClick={handlePrint} variant="contained" color="primary" startIcon={<Print />}>
          Print Challan Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallanViewModal;
