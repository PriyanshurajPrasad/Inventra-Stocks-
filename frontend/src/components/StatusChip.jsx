import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status, type = 'default' }) => {
  const getChipProps = () => {
    const s = String(status).toUpperCase();

    // Customer Status
    if (s === 'LEAD') return { label: 'Lead', color: 'info', variant: 'outlined' };
    if (s === 'ACTIVE') return { label: 'Active', color: 'success', variant: 'filled' };
    if (s === 'INACTIVE') return { label: 'Inactive', color: 'error', variant: 'outlined' };

    // Customer Type
    if (s === 'RETAIL') return { label: 'Retail', color: 'secondary', variant: 'outlined' };
    if (s === 'WHOLESALE') return { label: 'Wholesale', color: 'primary', variant: 'outlined' };
    if (s === 'DISTRIBUTOR') return { label: 'Distributor', color: 'warning', variant: 'outlined' };

    // Challan Status
    if (s === 'DRAFT') return { label: 'Draft', color: 'warning', variant: 'outlined' };
    if (s === 'CONFIRMED') return { label: 'Confirmed', color: 'success', variant: 'filled' };
    if (s === 'CANCELLED') return { label: 'Cancelled', color: 'error', variant: 'outlined' };

    // Movement Type
    if (s === 'IN') return { label: 'Stock IN', color: 'success', variant: 'filled' };
    if (s === 'OUT') return { label: 'Stock OUT', color: 'warning', variant: 'filled' };

    // Stock Alerts
    if (s === 'LOW_STOCK') return { label: 'Low Stock', color: 'warning', variant: 'filled' };
    if (s === 'IN_STOCK') return { label: 'In Stock', color: 'success', variant: 'outlined' };
    if (s === 'OUT_OF_STOCK') return { label: 'Out of Stock', color: 'error', variant: 'filled' };

    return { label: status, color: 'default', variant: 'outlined' };
  };

  const props = getChipProps();

  return (
    <Chip
      label={props.label}
      color={props.color}
      variant={props.variant}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: '0.75rem',
        borderRadius: '6px',
        px: 0.5,
      }}
    />
  );
};

export default StatusChip;
