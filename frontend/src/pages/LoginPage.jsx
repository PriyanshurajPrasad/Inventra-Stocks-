import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  Grid,
  Divider,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Store,
  ArrowForward,
  Security,
  Inventory,
  Receipt,
  People,
} from '@mui/icons-material';
import BrandLogo from '../components/BrandLogo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const fieldError = err.response?.data?.errors?.[0]?.message;
      const apiMessage = err.response?.data?.message;
      setError(fieldError || apiMessage || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fill
  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Grid container sx={{ minHeight: '100vh', width: '100%' }}>
        {/* Left Side: Desktop Branding & Hero Section */}
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
          {/* Top Logo Header */}
          <Box>
            <BrandLogo size="medium" forceLightText subtitle="PORTFOLIO & OPERATIONS PORTAL" />
          </Box>

          {/* Hero Main Content */}
          <Box sx={{ my: 'auto', py: 4 }}>
            <Chip
              icon={<Security style={{ fontSize: 16, color: '#fff' }} />}
              label="Role-Based Access Control System"
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
              Smart ERP Operations <br />
              <Box component="span" sx={{ color: '#a5b4fc' }}>
                & Real-Time CRM
              </Box>
            </Typography>

            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 540, mb: 5, lineHeight: 1.6 }}>
              Centralized platform for managing customer relationships, warehouse inventory movements, product catalogs, and sales challans with atomic stock deduction.
            </Typography>

            {/* Feature Cards Grid */}
            <Grid container spacing={2} sx={{ maxWidth: 580 }}>
              {[
                { title: 'Customer CRM', desc: 'Leads, wholesale & retail management', icon: <People fontSize="small" /> },
                { title: 'Inventory Movements', desc: 'Real-time Stock IN & Stock OUT audit', icon: <Inventory fontSize="small" /> },
                { title: 'Sales Challans', desc: 'Atomic stock deduction & print invoices', icon: <Receipt fontSize="small" /> },
              ].map((feat, idx) => (
                <Grid xs={12} sm={4} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      height: '100%',
                    }}
                  >
                    <Box sx={{ color: '#a5b4fc', mb: 1 }}>{feat.icon}</Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1.3 }}>
                      {feat.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Footer Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7 }}>
            <Typography variant="caption">© 2026 Inventra Operations Portal</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              v2.4.0 • Enterprise Release
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Sign In Form Column */}
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
          <Box sx={{ width: '100%', maxWidth: 440 }}>
            {/* Mobile Header Logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 4, justifyContent: 'center' }}>
              <BrandLogo size="medium" subtitle="PORTFOLIO & OPERATIONS PORTAL" />
            </Box>

            <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your registered credentials to access your workspace.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
                  EMAIL ADDRESS
                </Typography>
                <TextField
                  fullWidth
                  placeholder="admin@erp.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
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
              </Box>

              <Box sx={{ mb: 3 }}>
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
                  variant="outlined"
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
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<ArrowForward />}
                sx={{
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
                {loading ? 'Authenticating User...' : 'Sign In to Workspace'}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                OR QUICK DEMO LOGIN
              </Typography>
            </Divider>

            {/* Quick Demo Login Chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
              <Chip
                label="Admin Role"
                size="small"
                onClick={() => handleQuickFill('admin@erp.com', 'admin123')}
                sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label="Sales Role"
                size="small"
                onClick={() => handleQuickFill('sales@erp.com', 'sales123')}
                sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="Warehouse Role"
                size="small"
                onClick={() => handleQuickFill('warehouse@erp.com', 'warehouse123')}
                sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
                color="warning"
                variant="outlined"
              />
              <Chip
                label="Accounts Role"
                size="small"
                onClick={() => handleQuickFill('accounts@erp.com', 'accounts123')}
                sx={{ fontWeight: 700, cursor: 'pointer', borderRadius: '8px' }}
                color="info"
                variant="outlined"
              />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <RouterLink
                  to="/signup"
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Create Account
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
