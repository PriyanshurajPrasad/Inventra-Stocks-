import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useTheme,
  Chip,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Logout,
  Person,
  Settings,
  Shield,
  Circle,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ handleDrawerToggle, title }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        px: { xs: 1, sm: 2 },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, minHeight: '68px !important' }}>
        {/* Left Side Title & Mobile Menu Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: 'none' },
              borderRadius: 2.5,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 8,
                height: 28,
                borderRadius: 4,
                background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
                display: { xs: 'none', sm: 'block' },
              }}
            />
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.4px',
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                }}
              >
                {title || 'Dashboard'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side Tools & User Account */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Live System Online Pulse */}
          <Chip
            icon={<Circle sx={{ fontSize: '10px !important', color: '#10b981 !important' }} />}
            label="SYSTEM ONLINE"
            size="small"
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
              color: '#10b981',
              fontWeight: 800,
              fontSize: '0.68rem',
              letterSpacing: '0.5px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: { xs: 'none', md: 'inline-flex' },
            }}
          />

          {/* User Role Badge */}
          {user?.role && (
            <Chip
              label={`${user.role} ACCESS`}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.72rem',
                letterSpacing: '0.5px',
                px: 0.5,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                color: 'primary.main',
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            />
          )}

          {/* Light/Dark Toggle Button */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                p: 1,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7 sx={{ color: '#fbbf24', fontSize: 20 }} /> : <Brightness4 sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>

          {/* User Profile Avatar Button */}
          {user && (
            <>
              <Tooltip title="Account settings">
                <IconButton onClick={handleAvatarClick} size="small" sx={{ p: 0.5 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#10b981',
                        color: '#10b981',
                        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                  </Badge>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
                      minWidth: 230,
                      borderRadius: 3.5,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      boxShadow:
                        theme.palette.mode === 'dark'
                          ? '0 16px 36px rgba(0, 0, 0, 0.6)'
                          : '0 16px 36px rgba(0, 0, 0, 0.12)',
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    {user.email}
                  </Typography>
                  <Chip
                    icon={<Shield sx={{ fontSize: '14px !important' }} />}
                    label={user.role}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 800, fontSize: '0.7rem', height: 22 }}
                  />
                </Box>

                <Divider />

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    color: 'error.main',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 242, 242, 0.7)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
