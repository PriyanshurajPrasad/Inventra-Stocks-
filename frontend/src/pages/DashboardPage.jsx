import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  useTheme,
  Alert,
  LinearProgress,
  IconButton,
  Divider,
} from '@mui/material';
import {
  People,
  Inventory,
  Description,
  Warehouse,
  Warning,
  Category,
  Add,
  ArrowForward,
  SwapVert,
  TrendingUp,
  Notifications,
  CheckCircleOutlined,
  ReceiptLong,
  Speed,
  Shield,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import StatusChip from '../components/StatusChip';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { challanService } from '../services/challanService';
import { warehouseService } from '../services/warehouseService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customersCount: 0,
    productsCount: 0,
    lowStockCount: 0,
    challansCount: 0,
    warehousesCount: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentChallans, setRecentChallans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const canAccessCustomers = ['ADMIN', 'SALES'].includes(user?.role);
      const canAccessProducts = ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'].includes(user?.role);
      const canAccessChallans = ['ADMIN', 'SALES', 'ACCOUNTS'].includes(user?.role);
      const canAccessWarehouses = ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'].includes(user?.role);

      const [custData, prodData, challanData, whData] = await Promise.all([
        canAccessCustomers ? customerService.getCustomers({ limit: 1 }) : Promise.resolve({ total: 0 }),
        canAccessProducts ? productService.getProducts({ limit: 100 }) : Promise.resolve({ total: 0, products: [] }),
        canAccessChallans ? challanService.getChallans({ limit: 5 }) : Promise.resolve({ total: 0, challans: [] }),
        canAccessWarehouses ? warehouseService.getWarehouses() : Promise.resolve([]),
      ]);

      const allProducts = prodData.data?.products || prodData.products || prodData.data || (Array.isArray(prodData) ? prodData : []);
      const productArray = Array.isArray(allProducts) ? allProducts : [];
      const lowStock = productArray.filter((p) => (p.currentStock ?? 0) <= (p.minimumStockAlertQuantity ?? 10));

      const custTotal = custData.pagination?.total || custData.data?.pagination?.total || custData.total || (Array.isArray(custData.data?.customers) ? custData.data.customers.length : 0);
      const prodTotal = prodData.pagination?.total || prodData.data?.pagination?.total || prodData.total || productArray.length;
      const challanList = challanData.data?.challans || challanData.challans || challanData.data || (Array.isArray(challanData) ? challanData : []);
      const challanArray = Array.isArray(challanList) ? challanList : [];
      const challanTotal = challanData.pagination?.total || challanData.data?.pagination?.total || challanData.total || challanArray.length;
      const whList = whData.data?.warehouses || whData.warehouses || whData.data || (Array.isArray(whData) ? whData : []);
      const whArray = Array.isArray(whList) ? whList : [];

      setStats({
        customersCount: custTotal,
        productsCount: prodTotal,
        lowStockCount: lowStock.length,
        challansCount: challanTotal,
        warehousesCount: whArray.length,
      });

      setLowStockItems(lowStock.slice(0, 5));
      setRecentChallans(challanArray.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const metricCards = [
    {
      title: 'Total Customers',
      value: stats.customersCount,
      subtitle: 'CRM Directory',
      icon: <People sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      glow: 'rgba(99, 102, 241, 0.35)',
      path: '/customers',
    },
    {
      title: 'Active Products',
      value: stats.productsCount,
      subtitle: 'Catalog Inventory',
      icon: <Inventory sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: 'rgba(16, 185, 129, 0.35)',
      path: '/products',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      subtitle: stats.lowStockCount > 0 ? 'Requires Restock' : 'Stock Optimal',
      icon: <Warning sx={{ fontSize: 28 }} />,
      gradient: stats.lowStockCount > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: stats.lowStockCount > 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)',
      path: '/products',
    },
    {
      title: 'Sales Challans',
      value: stats.challansCount,
      subtitle: 'Orders Generated',
      icon: <ReceiptLong sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      glow: 'rgba(139, 92, 246, 0.35)',
      path: '/challans',
    },
    {
      title: 'Warehouses',
      value: stats.warehousesCount,
      subtitle: 'Fulfillment Hubs',
      icon: <Warehouse sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glow: 'rgba(245, 158, 11, 0.35)',
      path: '/warehouses',
    },
  ];

  return (
    <Layout title="Operations Command Center">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        {/* Full-Width Hero Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            width: '100%',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #4338ca 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #4338ca 100%)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(79, 70, 229, 0.28)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7} lg={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="OPERATIONS PORTAL"
                  size="small"
                  icon={<Speed sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {formattedDate}
                </Typography>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.8px', mb: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                {getGreeting()}, {user?.name || 'User'}! 👋
              </Typography>

              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 650, lineHeight: 1.6, fontWeight: 400 }}>
                Here is your real-time Inventra operations overview. Track CRM customer pipelines, catalog inventory levels, and sales challans in one command center.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5, flexWrap: 'wrap', mt: { xs: 2, md: 0 } }}>
              {['ADMIN', 'SALES'].includes(user?.role) && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/challans')}
                  startIcon={<Add />}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#4f46e5',
                    fontWeight: 800,
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 3,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s',
                  }}
                >
                  New Sales Challan
                </Button>
              )}

              {['ADMIN', 'SALES'].includes(user?.role) && (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/customers')}
                  startIcon={<People />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: '#ffffff',
                    fontWeight: 700,
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Add Customer
                </Button>
              )}

              {['ADMIN', 'WAREHOUSE'].includes(user?.role) && (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                  startIcon={<SwapVert />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: '#ffffff',
                    fontWeight: 700,
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Stock Movement
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* 100% Full-Width Responsive 5 KPI Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: `repeat(${metricCards.length}, 1fr)`,
            },
            gap: 2.5,
            width: '100%',
          }}
        >
          {loading
            ? Array.from({ length: metricCards.length || 5 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={135} sx={{ borderRadius: 4, width: '100%' }} />
              ))
            : metricCards.map((card) => (
                <Card
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  sx={{
                    borderRadius: 4,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%',
                    transition: 'all 0.25s ease-in-out',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 16px 30px ${card.glow}`,
                      borderColor: 'transparent',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 3,
                          background: card.gradient,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 6px 14px ${card.glow}`,
                        }}
                      >
                        {card.icon}
                      </Box>

                      <IconButton size="small" sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.5px' }}>
                      {card.value}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {card.title}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </Box>

        {/* 100% Full-Width Recent Sales Challans Table Card */}
        {['ADMIN', 'SALES', 'ACCOUNTS'].includes(user?.role) && (
          <Paper sx={{ p: 3, borderRadius: 4, border: (theme) => `1px solid ${theme.palette.divider}`, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ReceiptLong fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    Recent Sales Challans
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Latest order generation & dispatch activities
                  </Typography>
                </Box>
              </Box>

              <Button
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/challans')}
                sx={{ fontWeight: 700 }}
              >
                View All Challans
              </Button>
            </Box>

            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : recentChallans.length === 0 ? (
              <Box sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No recent sales challans recorded yet.
                </Typography>
              </Box>
            ) : (
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.8 } }}>
                    <TableCell>Challan No</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell align="center">Total Quantity</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentChallans.map((c) => (
                    <TableRow
                      key={c._id}
                      hover
                      onClick={() => navigate('/challans')}
                      sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {c.challanNumber}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {c.customer?.customerName || 'N/A'}
                        </Typography>
                        {c.customer?.businessName && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {c.customer.businessName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {c.totalQuantity} units
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <StatusChip status={c.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}

        {/* 100% Full-Width Quick Action Shortcuts Grid (4 Columns across screen) */}
        <Paper sx={{ p: 3, borderRadius: 4, border: (theme) => `1px solid ${theme.palette.divider}`, width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            Quick Action Shortcuts
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
            Instant access to primary application workflows
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 2,
              width: '100%',
            }}
          >
            {[
              {
                title: 'Customer Directory',
                desc: 'Manage CRM leads & profiles',
                icon: <People color="primary" />,
                path: '/customers',
                roles: ['ADMIN', 'SALES'],
              },
              {
                title: 'Product Catalog',
                desc: 'View products & stock pricing',
                icon: <Inventory color="success" />,
                path: '/products',
                roles: ['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS'],
              },
              {
                title: 'Stock Movements',
                desc: 'Record Stock IN & Stock OUT',
                icon: <SwapVert color="warning" />,
                path: '/inventory',
                roles: ['ADMIN', 'WAREHOUSE'],
              },
              {
                title: 'Warehouse Hubs',
                desc: 'Manage storage locations',
                icon: <Warehouse color="info" />,
                path: '/warehouses',
                roles: ['ADMIN', 'WAREHOUSE'],
              },
            ]
              .filter((item) => item.roles.includes(user?.role))
              .map((item) => (
                <Paper
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      display: 'flex',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                  <ArrowForward fontSize="small" color="action" />
                </Paper>
              ))}
          </Box>
        </Paper>

        {/* 100% Full-Width Bottom Row: Inventory Health & Account Details (50% / 50% Split) */}
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {/* Inventory Health (6 / 12 = 50% width) */}
          <Grid item xs={12} md={6} sx={{ pl: '0 !important', pr: { xs: 0, md: 1.5 } }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                width: '100%',
                height: '100%',
                bgcolor: (theme) =>
                  stats.lowStockCount > 0
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(239, 68, 68, 0.05)'
                      : 'rgba(254, 242, 242, 0.7)'
                    : theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 3,
                      bgcolor: stats.lowStockCount > 0 ? 'error.main' : 'success.main',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stats.lowStockCount > 0 ? <Warning fontSize="small" /> : <CheckCircleOutlined fontSize="small" />}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      Inventory Health Status
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Catalog thresholds & alerts
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={`${stats.lowStockCount} Alert${stats.lowStockCount === 1 ? '' : 's'}`}
                  color={stats.lowStockCount > 0 ? 'error' : 'success'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Box>

              {lowStockItems.length === 0 ? (
                <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 600 }}>
                  All products are safely above minimum stock thresholds!
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lowStockItems.map((item) => {
                    const current = item.currentStock ?? 0;
                    const min = item.minimumStockAlertQuantity ?? 10;
                    const percentage = Math.min(Math.round((current / (min * 2 || 1)) * 100), 100);

                    return (
                      <Paper
                        key={item._id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                          bgcolor: (theme) => theme.palette.background.paper,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {item.productName}
                          </Typography>
                          <Chip
                            label={`${current} / ${min} min`}
                            size="small"
                            color="error"
                            sx={{ fontWeight: 800, height: 22, fontSize: '0.7rem' }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color="error"
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 32 }}>
                            {percentage}%
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}

                  {['ADMIN', 'WAREHOUSE'].includes(user?.role) && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => navigate('/products')}
                      sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
                    >
                      Restock Items in Catalog
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* User Profile & Role Privileges Card (6 / 12 = 50% width) */}
          <Grid item xs={12} md={6} sx={{ pr: '0 !important', pl: { xs: 0, md: 1.5 } }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                width: '100%',
                height: '100%',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                    : 'linear-gradient(180deg, rgba(99, 102, 241, 0.04) 0%, rgba(255,255,255,1) 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.3rem',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {user?.name || 'Authenticated User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || 'user@collegestocks.edu'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shield color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Assigned Access Role
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      {user?.role} ROLE PERMISSIONS
                    </Typography>
                  </Box>
                </Box>
                <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 800, height: 22 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
