import React, {useEffect, useState} from "react";
import { 
  Box, 
  Grid, 
  Container, 
  useTheme ,
  CircularProgress, 
  Typography ,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { StatsGrid, StatCard, DashboardSection } from "@/components/DashboardStats";
import { ActivityFeed } from "@/components/DashboardActivity";
import { Package, Heart, Clock, TrendingUp, PlusCircle } from "lucide-react";

// Import our components
import { DonationTips } from "./DonationsTips";
import { QuickActions } from "./QuickActions";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; //
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DonorDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth(); // ✅ Get user data
  const userId = user?._id; // ✅ Ensure user ID exists
  const [stats, setStats] = useState({
    totalDonations: 0,
    claimedDonations: 0,
    activeDonations: 0,
    foodSaved: 0,
    totalFoodByCategory: []
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [donations, setDonations] = useState([]);
  const [totalFoodByCategory, setTotalFoodByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    food_name: "",
    category: "",
    custom_category: "",
    quantity: "",
    description: "",
    expiry_date: "",
    pickup_location: "",
    status: "Available",
    image: null,
  });
  const categoryColors = {
    Vegetarian: "#4CAF50",
    "Non-Vegetarian": "#FF5722",
    Dairy: "#2196F3",
    Grains: "#FFC107",
    "Canned Goods": "#9C27B0",
    "Fresh Produce": "#009688",
    Others: "#795548",
  };
  

  useEffect(() => {
    if (!token) return; // ❌ Exit if no token
    // Fetch statistics
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/donor`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => console.error("Error fetching stats:", error));
    // Fetch recent activity
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats/activities/donor`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        console.log("Recent Activity Response:", response.data);  // Debugging
        setRecentActivity(response.data.activities);
      })
      .catch((error) => console.error("Error fetching activity:", error));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };
  // ✅ Close modal function (previously missing)
  const handleClose = () => {
    setOpenModal(false);
  };

  // ✅ Open modal function
  const handleOpen = () => {
    setOpenModal(true);
  };
  // ✅ Fetch donations (if not already implemented)
  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/food/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
    }
    });
    console.log("FormData:", [...formDataToSend.entries()]); // Debugging

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/food/`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Donation created:", response.data);
      fetchDonations(); // Refresh the donation list
      handleClose();
    } catch (error) {
      console.error("Error creating donation:" , error.response?.data || error);
    }
  };


  return (
    <UserDashboardLayout title="Donor Dashboard" userType="donor">
      <Container maxWidth="xl">
        <DashboardSection title="Your Impact">
          <StatsGrid>
            <StatCard 
              title="Total Donations" 
              value={stats.totalDonations} 
              icon={<Package size={24} />} 
              trend={{ value: "+3 this month", direction: "up" }}
            />
            <StatCard 
              title="Donations Claimed" 
              value={stats.claimedDonations} 
              icon={<Heart size={24} />} 
              trend={{ value: `${stats.claimedDonations / stats.totalDonations * 100}% success rate`, direction: "up" }}
            />
            <StatCard 
              title="Active Donations" 
              value={stats.activeDonations} 
              icon={<Clock size={24} />} 
            />
            <StatCard 
              title="Food Saved (lbs)" 
              value={stats.foodSaved} 
              icon={<TrendingUp size={24} />} 
              trend={{ value: "Great job!", direction: "up" }}
            />
          </StatsGrid>
        </DashboardSection>
        

        <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Create Food Donation</DialogTitle>
          <DialogContent>
            <TextField
              label="Food Name"
              name="food_name"
              value={formData.food_name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Grains">Grains</MenuItem>
              <MenuItem value="Canned Goods">Canned Goods</MenuItem>
              <MenuItem value="Fresh Produce">Fresh Produce</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </TextField>
            {formData.category === "Others" && (
              <TextField
                label="Custom Category"
                name="custom_category"
                value={formData.custom_category}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            )}
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
              multiline
              rows={3}
            />
            <TextField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Pickup Location"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid item xs={12} lg={4}>
              <DashboardSection title="Donations by Category">
                {stats.totalFoodByCategory.length > 0 ? (
                  <ResponsiveContainer width={400} height={400}>
                    <BarChart data={stats.totalFoodByCategory}  barCategoryGap="30%"  margin={{ left: 20, bottom: 50 }}>
                      <XAxis 
                      dataKey="_id"
                      tick={{ fontSize: 12, fill: theme.palette.text.primary }}
                      angle={-45} 
                      textAnchor="end"
                     
                      dy={10}
                       />
                      <YAxis />
                      <Tooltip />
                      <Bar
                      dataKey="total" 
                      barSize={30} 
                      fill= "#8884d8"
                      >
                      {
                        stats.totalFoodByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[entry._id] || "#8884d8"} />
                        ))
                      }
                      </Bar>
                    
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No data available yet.
                  </Typography>
                )}
              </DashboardSection>
            </Grid>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Button variant="contained" color="success" startIcon={<PlusCircle />} onClick={handleOpen}>
                Create Donation
              </Button>
            </Box>

            <DashboardSection title="Donation Tips">
              <DonationTips />
            </DashboardSection>
          </Grid>

          <Grid item xs={12} lg={4}>
            <DashboardSection title="Recent Activity">
              <ActivityFeed items={recentActivity || []} />
            </DashboardSection>

            <DashboardSection title="Quick Actions">
              <QuickActions />
            </DashboardSection>
          </Grid>
        </Grid>
      </Container>
    </UserDashboardLayout>
  );
};

export default DonorDashboard;
