import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  Category,
  Warehouse,
  Description,
  SwapVert,
  ManageAccounts,
  Store,
  ReceiptLong,
  Shield,
  Circle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const DRAWER_WIDTH = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getMenuItems = () => {
    const role = user?.role || 'SALES';

    const allItems = [
      {
        title: 'Dashboard',
        icon: <Dashboard fontSize="small" />,
        path: '/dashboard',
        roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      },
      {
        title: 'Customers CRM',
        icon: <People fontSize="small" />,
        path: '/customers',
        roles: ['ADMIN', 'SALES'],
      },
      {
        title: 'Product Catalog',
        icon: <Inventory fontSize="small" />,
        path: '/products',
        roles: ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'],
      },
      {
        title: 'Categories',
        icon: <Category fontSize="small" />,
        path: '/categories',
        roles: ['ADMIN', 'WAREHOUSE'],
      },
      {
        title: 'Stock Movements',
        icon: <SwapVert fontSize="small" />,
        path: '/inventory',
        roles: ['ADMIN', 'WAREHOUSE'],
      },
      {
        title: 'Sales Challans',
        icon: <ReceiptLong fontSize="small" />,
        path: '/challans',
        roles: ['ADMIN', 'SALES', 'ACCOUNTS'],
      },
      {
        title: 'Warehouses',
        icon: <Warehouse fontSize="small" />,
        path: '/warehouses',
        roles: ['ADMIN', 'WAREHOUSE'],
      },
      {
        title: 'User Administration',
        icon: <ManageAccounts fontSize="small" />,
        path: '/users',
        roles: ['ADMIN'],
      },
    ];

    return allItems.filter((item) => item.roles.includes(role));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'secondary';
      case 'WAREHOUSE':
        return 'warning';
      case 'ACCOUNTS':
        return 'info';
      case 'SALES':
      default:
        return 'primary';
    }
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

  const menuItems = getMenuItems();

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 2.5, pb: 2 }}>
        <BrandLogo subtitle="PORTFOLIO & OPERATIONS PORTAL" />
      </Box>

      {/* Professional User Profile Card */}
      {user && (
        <Box
          sx={{
            mx: 2,
            mb: 2.5,
            p: 2,
            borderRadius: 3.5,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(99, 102, 241, 0.04)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.15)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{ fontWeight: 800, fontSize: '0.86rem', lineHeight: 1.2, color: 'text.primary' }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  fontSize: '0.72rem',
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Shield sx={{ fontSize: 13, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.68rem', color: 'text.secondary' }}>
                ACCESS ROLE
              </Typography>
            </Box>
            <Chip
              label={user.role}
              size="small"
              color={getRoleColor(user.role)}
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900, px: 0.5 }}
            />
          </Box>
        </Box>
      )}

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Navigation Label */}
      <Box sx={{ px: 3, mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: '0.68rem',
            color: 'text.secondary',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          MAIN MENU
        </Typography>
      </Box>

      {/* Navigation Menu List */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 3,
                  py: 1.3,
                  px: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  background: isActive
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'text.primary',
                  fontWeight: isActive ? 800 : 600,
                  boxShadow: isActive ? '0 6px 18px rgba(99, 102, 241, 0.35)' : 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                      : (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(99, 102, 241, 0.06)',
                    transform: isActive ? 'none' : 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#ffffff' : 'text.secondary',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  slotProps={{
                    primary: {
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 800 : 600,
                      letterSpacing: '-0.2px',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer System Status Badge */}
      <Box sx={{ p: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
        <Box
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 2.5,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Circle sx={{ fontSize: 8, color: '#10b981' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem' }}>
            v1.0.0 • ERP System Active
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
