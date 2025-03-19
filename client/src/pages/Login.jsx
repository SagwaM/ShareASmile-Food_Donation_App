import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  InputAdornment, 
  IconButton, 
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  useTheme,
  Card,
  CardContent
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext"; // ✅ Import Auth Context

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { dispatch } = useAuth(); // ✅ Use Auth Context for login
  console.log("useAuth Hook:", useAuth()); // Check what it's returning
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulating login process
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('API Response:', response.data); // Debugging log

      const { token, user } = response.data;

      if (!token || !user?.role) {
        throw new Error('Invalid login response: Missing token or role');
      }

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: { user, token } });

      console.log('Redirecting to:', user.role); // Debugging log
      
      // Redirect based on role
    navigate(`/dashboard/${user.role}`);
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center', mb: { xs: 4, md: 0 } }}>
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Sign in to continue to your account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <RouterLink to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Forgot password?
                    </Typography>
                  </RouterLink>
                </Box>

                <Button 
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ py: 1.2 }}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    sx={{ py: 1.2 }}
                  >
                    Facebook
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                    <Typography component="span" variant="body2" color="success" sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                      Sign up
                    </Typography>
                  </RouterLink>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right side content */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                Join Our Food Sharing Community
              </Typography>
              <Typography variant="body1" paragraph>
                By signing in, you're taking a step toward reducing food waste and helping those in need in your community.
              </Typography>

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                alt="Food donation"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  mb: 4,
                  boxShadow: 3,
                  height: { xs: '250px', md: '300px' },
                  objectFit: 'cover'
                }}
              />

              <Card elevation={3} sx={{ mb: 4, borderLeft: 5, borderColor: 'primary.main' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Why Join FoodShare?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our platform connects food donors with people in need, reducing waste and fighting hunger. Together, we can make a difference in our communities.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default LoginPage;
