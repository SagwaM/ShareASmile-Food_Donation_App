import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { StatsGrid, StatCard, DashboardSection } from "@/components/DashboardStats";
import { ActivityFeed } from "@/components/DashboardActivity";
import { Package, ShoppingBag, Clock, MapPin, User } from "lucide-react";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import axios from 'axios';


const RecipientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipientStats = async () => {
      try {
        console.log("Fetching statistics...");

        // Fetch recipient stats
        const response = await axios.get(`http://localhost:5000/api/stats/recipient`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        console.log("Stats Response:", response.data);
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      } finally {
        setLoadingStats(false);
      }
      };
      
      const fetchRecipientRequests = async () => {
        try {
          console.log("Fetching requests...");

          // Fetch recipient requests
          const response = await axios.get("http://localhost:5000/api/food/requests", { 
            headers: { Authorization: `Bearer ${token}` } 
          });
          console.log("Requests Response:", response.data);
          
          setRequests(response.data);
        } catch (err) {
          console.error("Error fetching requests:", err);
        } finally {
          setLoadingRequests(false);
        }
      };

      const fetchRecipientActivities = async () => {
        try {
          console.log("Fetching activities...");  

      // Fetch recent activities
      const response = await axios.get("http://localhost:5000/api/stats/activities/recipient", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      console.log("Activity Response:", response.data);
      setActivities(response.data.activities);
    } catch (error) {
        console.error("Error fetching admin activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  fetchRecipientStats();
  fetchRecipientRequests();
  fetchRecipientActivities();

}, []);

  if (loadingStats && loadingRequests && loadingActivities) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
   
  return (
    <UserDashboardLayout title="Recipient Dashboard" userType="recipient">
      <DashboardSection title="Your Overview">
        <StatsGrid>
          <StatCard 
            title="Available Donations" 
            value={stats?.availableDonations ?? 0}
            icon={<Package size={24} />} 
            trend={{ value: "Near your location", direction: "up" }}
          />
          <StatCard 
            title="Your Requests" 
            value={stats?.totalClaims ?? 0}
            icon={<ShoppingBag size={24} />} 
          />
          <StatCard 
            title="Pending Pickup" 
            value={stats?.activeClaims ?? 0} 
            icon={<Clock size={24} />} 
          />
          <StatCard 
            title="Food Received (lbs)" 
            value={stats?.foodReceived ?? 0} 
            icon={<MapPin size={24} />} 
            trend={{ value: "This month", direction: "up" }}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Requests and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardSection title="Your Requests">
          {loadingRequests ? (
              <div className="text-center py-5">Loading requests...</div>
            ) : (
              <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Food Item</th>
                  <th className="p-3 text-left">Donor</th>
                  <th className="p-3 text-left">Approval Status</th>
                  
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request._id} className="border-b">
                      <td className="p-3">{request._id}</td>
                      <td className="p-3">{request.food_name}</td>
                      <td className="p-3">{request.donor?.name || "Unknown"}</td>
                      
                      <td className="p-3">
                        <span 
                          className={`py-1 px-3 rounded-full text-xs font-medium ${
                            request.approval_status === "Pending"
                              ? "bg-yellow-500"
                              : request.approval_status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}>
                          {request.approval_status || "N/A"}
                        </span>
                      </td>
                    </tr>
                   ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      No requests found.
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            )}
            <div className="mt-4">
              <Link to="/dashboard/recipient/my-requests">
                <Button 
                variant="outlined" 
                size="sm"

                >View All Requests</Button>
              </Link>
            </div>
            
          </DashboardSection>

        </div>

        <div>
          <DashboardSection title="Recent Activity">
            <ActivityFeed items={activities || []} />
          </DashboardSection>

          <DashboardSection title="Quick Actions">
            <div className="space-y-3">
            <Stack spacing={1.5}>
            <Button 
              component={Link}
              to="/profile"
              variant="contained" 
              fullWidth 
              startIcon={<User size={18} />}
              sx={{ 
                justifyContent: 'flex-start',
                py: 1.5,
                fontWeight: 500
              }}
            >
               Update Profile
            </Button>
            <Button 
              component={Link}
              to="/dashboard/recipient/available-food"
              variant="outlined"
              fullWidth 
              startIcon={<Package size={18} />}
              sx={{ 
                justifyContent: 'flex-start',
                py: 1.5,
                fontWeight: 500
              }}
            >
              Browse Available Food
            </Button>
            <Button
              component={Link}
              to="/dashboard/recipient/my-requests"
              variant="outlined"
              fullWidth
              startIcon={<ShoppingBag size={18} />}
              sx={{ 
                justifyContent: 'flex-start',
                py: 1.5,
                fontWeight: 500
             }} 
           >
              View My Requests
            </Button>
            </Stack>
            </div>
          </DashboardSection>
        </div>
      </div>
      
    </UserDashboardLayout>
  );
};

export default RecipientDashboard;

// Helper function for conditional classnames
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
