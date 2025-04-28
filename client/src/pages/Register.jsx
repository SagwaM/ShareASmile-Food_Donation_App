import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // For navigation after successful registration
import axios from "axios"; // To send requests to the backend
import { Card, CardContent, Typography, Paper } from "@mui/material";
import { Button } from "@mui/material";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, Home, Phone, Upload } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterPage.css"; // Custom CSS for styling
import { useTheme } from "@mui/material/styles";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("recipient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme(); // Get theme mode

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    organization_name: "",
    donor_type: "individual",
    profile_picture: null,
    termsAccepted: false,
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password || !formData.phone || !formData.profile_picture ) {
      setErrors("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setErrors("Passwords do not match.");
      return;
    }
    if (!formData.termsAccepted) {
      setErrors("You must accept the terms.");
      return;
    }

    setLoading(true);
    setErrors("");
    // Prepare FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", selectedType);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("organization_name", formData.organization_name);
    formDataToSend.append("donor_type", formData.donor_type);
    formDataToSend.append("profile_picture", formData.profile_picture); // Append file

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setErrors(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container d-flex align-items-center justify-content-center vh-100" style={{
      maxWidth: "1100px",
      minHeight: "600px",
      backgroundColor: theme.palette.background.default, // Dynamic background
      color: theme.palette.text.primary, // Adjust text color
    }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
      <div
        className="row w-100 shadow-lg rounded p-4"
        style={{
          maxWidth: "1100px",
          minHeight: "600px",
          backgroundColor: theme.palette.background.default, // Dynamic background
          color: theme.palette.text.primary, // Adjust text color
        }}
      >
        {/*  Account Type Selection */}
        <div className="col-md-5 border-end">
          <h4 className="fw-bold" >Choose Account Type</h4>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Select the type of account that best describes your role</Typography>
          {/* Account Type Cards */}
          {[
            { id: "donor", icon: <CheckCircle />, label: "Food Donor", desc: "Restaurants, grocery stores, farms, or individuals with excess food to donate" },
            { id: "recipient", icon: <User />, label: "Food Recipient", desc: "Individuals or families looking to receive food donations" },
            { id: "ngo", icon: <Home />, label: "NGO / Food Bank", desc: "Organizations that collect and distribute food to those in need" },
          ].map((type) => (
            <Card
              key={type.id}
              className={`account-type-card p-3 mb-2 ${selectedType === type.id ? "selected" : ""} `}
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#2C2C2C" : theme.palette.background.paper, // Dark gray in dark mode
                color: selectedType === type.id ? "#ffffff"  : theme.palette.text.primary, // Force white text in dark mode
                padding: 3,
                boxShadow: 3,
                transition: "background-color 0.3s ease", // Smooth transition on mode change
              }}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="d-flex align-items-center">
                <div className="icon me-2" style={{ color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}>{type.icon}</div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: theme.palette.mode === "dark" ? "#ffffff" : "inherit" }}>{type.label}</h6>
                  <Typography 
                  variant="body2" 
                  color={theme.palette.mode === "dark" ? "text.secondary" : "text.primary"}
                >
                  {type.desc}
                </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Side - Registration Form */}
        <div className="col-md-7" >
          <h4 className="fw-bold" >Create Your Account</h4>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join our platform to start making a difference in your community
            </Typography>
          {errors && <p className="text-danger">{errors}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input 
                icon={<User />}
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Input 
                icon={<Mail />}
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Input icon={<Phone />} name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
            </div>
            <div className="mb-3 position-relative">
              <Input 
                icon={<Lock />}
                type={showPassword ? "text" : "password"} // Toggle visibility
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                
               />
               <span 
                  className="position-absolute top-50 end-0 translate-middle-y me-3" 
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
            </div>
            <div className="mb-3 position-relative">
              <Input 
                icon={<Lock />}
                type={showConfirmPassword ? "text" : "password"} // Toggle visibility
                placeholder="Confirm Password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                
              />
              <span 
                className="position-absolute top-50 end-0 translate-middle-y me-3" 
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showPassword ? <EyeOff/> : <Eye />}
              </span>
            </div>
            {/* Show Organization Name field for NGOs */}
            {selectedType === "ngo" && (
              <div className="mb-3">
                <Input icon={<Home />} name="organization_name" value={formData.organization_name} onChange={handleChange} placeholder="Organization Name" required />
              </div>
            )}

            {/* Show Donor Type selection for donors */}
            {selectedType === "donor" && (
              <div className="mb-3">
                <select className="form-control" name="donor_type" value={formData.donor_type} onChange={handleChange}>
                  <option value="individual">Individual</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            )}
            {/* Profile Picture Upload */}
            <div className="mb-3">
              <label className="form-label">Upload Profile Picture</label>
              <div className="input-group">
                <input type="file" className="form-control" name="profile_picture" onChange={handleFileChange} />
                <span className="input-group-text"><Upload /></span>
              </div>
            </div>
            <div className="form-check mb-3 d-flex align-items-center">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="form-check-input me-2"
                style={{ width: "20px", height: "20px", cursor: "pointer" }} // Increases checkbox size
              />
              <label htmlFor="terms" className="form-check-label" >
                I accept the <Link to="/terms">Terms and Conditions</Link>
              </label>
            </div>
            <Button className="w-100 btn-success" color="" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"} </Button>
          </form>

          <p className="text-center mt-3"  >
            Already have an account? <a href="/login" className="text-success">Sign in</a>
          </p>
        </div>
      </div>
      </Paper>
    </div>
  );
}
