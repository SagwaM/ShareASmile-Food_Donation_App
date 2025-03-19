import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, useTheme, alpha, Avatar } from '@mui/material';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Key, Lock, ShieldCheck, Fingerprint, Eye, EyeOff, UserRound } from 'lucide-react';
import { useAuth } from "@/context/AuthContext"; // Assuming you have AuthContext

const LockScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, unlockDashboard } = useAuth(); // Fetch user & unlock function from context
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (window.location.pathname !== '/lockscreen') {
        navigate('/lockscreen'); // Redirect to lock screen on inactivity
     }
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearTimeout(timeout);
  }, []);
  // Fade out error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(false);
  };

  const validatePassword = async () => {
    setUnlocking(true);
    const isAuthenticated = await unlockDashboard(password); // Check with backend

    if (isAuthenticated) {
      setTimeout(() => {
        navigate(`/${user.role}/dashboard`); // Navigate based on role
      }, 1000);
    } else {
      setError(true);
      setShakeAnimation(true);
      setUnlocking(false);
      setTimeout(() => {
        setShakeAnimation(false);
        setPassword("");
      }, 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validatePassword();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.8)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated circles in background */}
      <Box 
        className="animate-float"
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: alpha(theme.palette.primary.light, 0.1),
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box 
        className="animate-float"
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.light, 0.1),
          filter: 'blur(40px)',
          zIndex: 0,
          animationDelay: '1s',
        }}
      />

      {/* Main content */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{
            backdropFilter: 'blur(16px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
          className={`${shakeAnimation ? 'animate-shake' : ''} ${unlocking ? 'animate-fade-slide-in' : ''}`}
        >
          {/* User Avatar */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={user.profile_picture}
              alt={user.name}
              sx={{ 
                width: 100, 
                height: 100, 
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              className="animate-pulse"
            />
          </Box>

          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              fontFamily: 'Playfair Display, serif',
              color: theme.palette.text.primary,
            }}
          >
            {unlocking ? 'Welcome Back!' : `Hello, ${user?.name || "Guest"}`}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ mb: 4, color: theme.palette.text.secondary }}
          >
            {error ? 'Incorrect password. Please try again.' : unlocking ? 'Unlocking your account...' : 'Enter your password to unlock'}
          </Typography>

          {!unlocking && (
            <form onSubmit={handleSubmit}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={error ? 'border-red-500' : ''}
                  aria-label="Password"
                  autoFocus
                  style={{ 
                    padding: '12px 16px',
                    paddingRight: '48px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePasswordVisibility}
                  style={{ 
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full"
                  disabled={!password}
                >
                  <Lock size={18} className="mr-2" />
                  Unlock
                </Button>
                
                <Button
                  variant="outline"
                  type="button"
                  backgroundColor="black"
                  color={theme.palette.text.secondary}
                  onClick={() => navigate('/login')}
                >
                  <Key size={18} className="mr-2" />
                  Return to Login
                </Button>
              </Box>
            </form>
          )}
          
          {unlocking && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ShieldCheck size={64} className="animate-pulse" color={theme.palette.primary.main} CircularProgress />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LockScreen;
