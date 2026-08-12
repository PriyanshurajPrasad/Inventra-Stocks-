import React from 'react';
import { TextField, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ value, onChange, placeholder = 'Search...', fullWidth = true }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
