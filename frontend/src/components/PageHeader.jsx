import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';

const PageHeader = ({ title, onBack, showAdd = false, onAdd, addButtonLabel = 'Add', action }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {onBack && (
          <IconButton onClick={onBack}>
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {showAdd && (
          <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
            {addButtonLabel}
          </Button>
        )}
        {action}
      </Box>
    </Box>
  );
};

export default PageHeader;
