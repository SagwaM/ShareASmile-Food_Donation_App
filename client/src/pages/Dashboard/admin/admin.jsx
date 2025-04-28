import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { StatsGrid, StatCard, DashboardSection } from "@/components/DashboardStats";
import { ActivityFeed } from "@/components/DashboardActivity";
import { useAuth } from "@/context/AuthContext";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  TableHead,
  TableRow,
  TableBody,
  Grid, 
  Chip, 
  alpha, 
  useTheme, 
  TableCell,
  Table
} from "@mui/material";
import { 
  InventoryOutlined, 
  PeopleAltOutlined, 
  EmojiEventsOutlined, 
  TrendingUpOutlined,
  SearchOutlined,
  ShoppingBagOutlined,
  PersonAddOutlined
} from "@mui/icons-material";

// Helper function for conditional classnames
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [selectedView, setSelectedView] = useState('week');
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        console.log("Fetching statistics...");
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/admin`,{
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Stats Response:", response.data);
          setStats(response.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };

    const fetchAdminActivities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/activities/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Activity Response:", response.data);
        setActivityItems(response.data.activities);
      } catch (error) {
          console.error("Error fetching admin activities:", error);
        }
      };
      
    const fetchRecentFoodDonations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/food/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Donations Response:", response.data);
        setRecentDonations(response.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/recent`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        console.log("Users Response:", response.data);
        setRecentUsers(response.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
    fetchAdminActivities();
    fetchRecentFoodDonations();
    fetchRecentUsers();
  }, []);



  // Status badge component - FIXED
  const StatusBadge = ({ status }) => {
    let colorMain;
    
    switch (status) {
      case 'Available':
        colorMain = theme.palette.success.main;
        break;
      case 'Claimed':
        colorMain = theme.palette.info.main;
        break;
      case 'Expired':
        colorMain = theme.palette.grey[500];
        break;
      default:
        colorMain = theme.palette.primary.main;
    }

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: alpha(colorMain, 0.1),
          color: colorMain,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24
        }}
      />
    );
  };
  
  // Type badge component - FIXED
  const TypeBadge = ({ type }) => {
    let colorMain;
    
    switch (type) {
      case 'Donor':
        colorMain = theme.palette.primary.main;
        break;
      case 'Recipient':
        colorMain = theme.palette.secondary.main;
        break;
      case 'NGO':
        colorMain = theme.palette.info.main;
        break;
      default:
        colorMain = theme.palette.primary.main;
    }

    return (
      <Chip
        label={type}
        size="small"
        sx={{
          bgcolor: alpha(colorMain, 0.1),
          color: colorMain,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24
        }}
      />
    );
  };

  return (
    <DashboardLayout title="Admin Dashboard" userType="admin">
      <Box sx={{ pb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome, {user?.name || "User"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with the FoodShare platform today
        </Typography>
      </Box>
      {loading ? (
        <Typography>Loading statistics...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
      
      <DashboardSection title="Overview">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Box sx={{ display: 'flex', bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
            {['day', 'week', 'month', 'year'].map((view) => (
              <Button
                key={view}
                size="small"
                onClick={() => setSelectedView(view)}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  textTransform: 'capitalize',
                  bgcolor: selectedView === view ? 'primary.main' : 'transparent',
                  color: selectedView === view ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: selectedView === view ? 'primary.dark' : alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {view}
              </Button>
            ))}
          </Box>
        </Box>
        
        <StatsGrid>
          <StatCard 
            title="Total Users" 
            value={typeof stats?.totalUsers === "object"
              ? Object.values(stats.totalUsers).reduce((a, b) => a + b, 0) // Sum all values 
              : stats?.totalUsers ?? 0
            } 
            icon={<PeopleAltOutlined fontSize="medium" />} 
            trend={{ value: "+12% this month", direction: "up" }}
          />
          <StatCard 
            title="Total Donations" 
            value={stats ? stats.totalDonations : "Loading..."}  
            icon={<InventoryOutlined fontSize="medium" />} 
            trend={{ value: "+24% this month", direction: "up" }}
          />
          <StatCard 
            title="Total Claims" 
            value={stats?.totalClaims ?? 0}
            icon={<EmojiEventsOutlined fontSize="medium" />} 
            trend={{ value: "+3 this month", direction: "up" }}
          />
          <StatCard 
            title="Availble Donations (lbs)" 
            value={stats?.availableDonations ?? 0}
            icon={<TrendingUpOutlined fontSize="medium" />} 
            trend={{ value: "+8% this month", direction: "up" }}
          />
          <StatCard 
            title="Food Saved (lbs)" 
            value={stats?.foodSaved ?? 0}
            icon={<TrendingUpOutlined fontSize="medium" />} 
            trend={{ value: "+8% this month", direction: "up" }}
          />
        </StatsGrid>
      </DashboardSection>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          
            <div className="tables-container">
            {/* Recent Donations Table */}
            <div className="table-section">
              <Typography variant="h5">Recent Donations</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Food Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Donor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDonations.map((donation, index) => (
                    <TableRow key={index}>
                      <TableCell>{donation.food_name}</TableCell>
                      <TableCell><StatusBadge status={donation.status}/></TableCell>
                      <TableCell>{donation.quantity}</TableCell>
                      <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{donation.donor.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="small"
                    component={Link}
                    to="/dashboard/admin/donations"
                  >
                    View All Donations
                  </Button>
                </Box>
            </div>

            {/* Recent Users Table */}
            <div className="table-section">
              <Typography variant="h5">Recent Users</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Date Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="small"
                    component={Link}
                    to="/dashboard/admin/manage-users"
                  >
                    View All Users
                  </Button>
                </Box>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardSection title="Recent Activity">
            <ActivityFeed items={activityItems || []} />
          </DashboardSection>
          
          <DashboardSection title="Quick Insights">
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Platform Stats
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most Active Areas
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip 
                    label="Downtown" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                  <Chip 
                    label="Suburb" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                  <Chip 
                    label="University" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Popular Food Categories
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip 
                    label="Fresh Produce" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}
                  />
                  <Chip 
                    label="Packaged Meals" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                  />
                  <Chip 
                    label="Bakery" 
                    size="small"
                    sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                  />
                </Box>
              </Box>
            </Card>
          </DashboardSection>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AdminDashboard;
