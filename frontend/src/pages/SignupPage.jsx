import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Store,
  ArrowForward,
  Security,
} from '@mui/icons-material';
import BrandLogo from '../components/BrandLogo';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pass 3 separate arguments (name, email, password) to match backend signup endpoint
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const fieldError = err.response?.data?.errors?.[0]?.message;
      const apiMessage = err.response?.data?.message;
      setError(fieldError || apiMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: isDark ? '#090d16' : '#f8fafc',
        position: 'relative',
      }}
    >
      {/* Ambient Glows */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Grid container sx={{ minHeight: '100vh', width: '100%' }}>
        {/* Left Side: Desktop Branding Section */}
        <Grid
          xs={12}
          md={6}
          lg={6.5}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { md: 6, lg: 8 },
            background: isDark
              ? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
              : 'linear-gradient(145deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
            color: '#ffffff',
            position: 'relative',
            zIndex: 1,
            boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header Logo */}
          <Box>
            <BrandLogo size="medium" forceLightText subtitle="PORTFOLIO & OPERATIONS PORTAL" />
          </Box>

          {/* Main Hero Content */}
          <Box sx={{ my: 'auto', py: 4 }}>
            <Chip
              icon={<Security style={{ fontSize: 16, color: '#fff' }} />}
              label="Instant User Provisioning"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.78rem',
                backdropFilter: 'blur(10px)',
                mb: 3,
                px: 1,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { md: '2.5rem', lg: '3.2rem' },
                lineHeight: 1.15,
                letterSpacing: '-1px',
                mb: 2.5,
              }}
            >
              Join Inventra <br />
              <Box component="span" sx={{ color: '#a5b4fc' }}>
                Operations Platform
              </Box>
            </Typography>

            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 540, mb: 4, lineHeight: 1.6 }}>
              Create an account to access inventory stock movements, sales challan invoicing, and customer CRM pipelines.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
            <Typography variant="caption">© 2026 Inventra Portal</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Enterprise Edition
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Registration Form Column */}
        <Grid
          xs={12}
          md={6}
          lg={5.5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 3, sm: 6, md: 6, lg: 8 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 460 }}>
            {/* Mobile Logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 4, justifyContent: 'center' }}>
              <BrandLogo size="medium" subtitle="PORTFOLIO & OPERATIONS PORTAL" />
            </Box>

            <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 1 }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up your user account and access your operational portal.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
                    FULL NAME
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
                    EMAIL ADDRESS
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="user@collegestocks.edu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
                    PASSWORD
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="••••••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                      },
                    }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
                    OPERATIONAL ROLE
                  </Typography>
                  <FormControl fullWidth required>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      sx={{
                        borderRadius: '12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                      }}
                    >
                      <MenuItem value="SALES">SALES Representative</MenuItem>
                      <MenuItem value="WAREHOUSE">WAREHOUSE Manager</MenuItem>
                      <MenuItem value="ACCOUNTS">ACCOUNTS Manager</MenuItem>
                      <MenuItem value="ADMIN">SYSTEM ADMIN</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<ArrowForward />}
                sx={{
                  mt: 4,
                  py: 1.6,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    boxShadow: '0 12px 28px rgba(99, 102, 241, 0.45)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Register Workspace Account'}
              </Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already registered?{' '}
                <RouterLink
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Sign In to Workspace
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupPage;
