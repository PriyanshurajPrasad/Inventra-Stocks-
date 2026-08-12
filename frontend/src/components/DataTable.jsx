import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Skeleton,
  Typography,
  TablePagination,
} from '@mui/material';
import { Inbox } from '@mui/icons-material';

const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No matching records found.',
  rowsPerPageOptions = [5, 10, 25],
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Safely ensure tableData is an array
  const tableData = Array.isArray(data)
    ? data
    : Array.isArray(data?.customers)
    ? data.customers
    : Array.isArray(data?.products)
    ? data.products
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.customers)
    ? data.data.customers
    : Array.isArray(data?.data?.products)
    ? data.data.products
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                  sx={{
                    py: 1.8,
                    px: 2,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((col, cIdx) => (
                    <TableCell key={cIdx} align={col.align || 'left'} sx={{ py: 2 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Inbox sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row._id || index}
                  hover
                  sx={{
                    transition: 'background-color 0.15s',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((column) => {
                    const renderFunc = column.renderCell || column.render;
                    return (
                      <TableCell key={column.field} align={column.align || 'left'} sx={{ py: 1.5, px: 2 }}>
                        {renderFunc ? renderFunc(row) : row[column.field] ?? '-'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && tableData.length > 0 && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default DataTable;
