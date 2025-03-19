import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Stack,
  alpha
} from '@mui/material';
import { DashboardTable } from '@/components/DashboardTable';
import { Package, List } from 'lucide-react';

// Helper function for conditional classnames
const getStatusChipProps = (status) => {
  switch (status) {
    case "available":
      return {
        color: 'success',
        sx: { fontWeight: 500 }
      };
    case "claimed":
      return {
        color: 'primary',
        sx: { fontWeight: 500 }
      };
    case "expired":
      return {
        color: 'default',
        sx: { fontWeight: 500 }
      };
    default:
      return {
        color: 'default',
        sx: { fontWeight: 500 }
      };
  }
};

export function DonationsList({ data }) {
  const columns = [
    { header: "ID", accessorKey: "_id" },
    { header: "Items", accessorKey: "food_name" },
    { 
      header: "Status", 
      accessorKey: "status", 
      cell: (info) => {
        console.log("Donation Status Debug:", info?.row?.original);
        const value = info?.row?.original.status || "Unknown";
        return (
          <Chip
            size="small"
            label={value}
            {...getStatusChipProps(value)}
          />
        );
      }
    },

    { header: "Claimed By", accessorKey: "claimed_by?.name",
       cell: (info) => {
        console.log("Donation Claimed By Debug:", info?.row?.original);
        info?.row?.original?.claimed_by?.name || "Not Claimed";
      }
     },
    { header: "Posted", accessorKey: "created_at" },
  ];

  return (
    <>
      <DashboardTable
        columns={columns}
        data={data}
      />
      {data.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 3, color: 'gray' }}>
            <Package size={64} />
            <Box sx={{ mt: 2 }}>
              You haven't made any donations yet. Click below to get started!
            </Box>
          </Box>
      )}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          component={Link} 
          to="/dashboard/donor/all-donations"
          variant="outlined" 
          size="small"
          startIcon={<List size={16} />}
        >
          View All Donations
        </Button>
        <Button 
          component={Link} 
          to="/dashboard/donor/create-donation"
          variant="contained" 
          size="small"
          startIcon={<Package size={16} />}
        >
          Create New Donation
        </Button>
      </Box>
    </>
  );
}
