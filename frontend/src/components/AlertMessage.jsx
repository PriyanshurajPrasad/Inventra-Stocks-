import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

const AlertMessage = ({ severity, message, title, onClose, ...props }) => {
  return (
    <Collapse in={!!message}>
      <Alert severity={severity} onClose={onClose} {...props}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
