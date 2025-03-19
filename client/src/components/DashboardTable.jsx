import React from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  alpha 
} from "@mui/material";

export function DashboardTable({ columns, data, className }) {
  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
          borderBottom: 0,
        },
        ...className
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ 
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          }}>
            {columns.map((column, index) => (
              <TableCell 
                key={index}
                sx={{ 
                  py: 1.5,
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ 
                  '&:hover': { 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) 
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    sx={{ py: 2 }}
                  >
                    {column.cell
                      ? column.cell(row[column.accessorKey])
                      : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length}
                sx={{ textAlign: 'center', py: 4 }}
              >
                <Typography variant="body2" color="text.secondary">
                  No data to display
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
