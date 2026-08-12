import React from 'react';
import { Box, Typography } from '@mui/material';

// Building + Stock Bar Chart SVG icon matching the logo image
export const BuildingChartIcon = ({ size = 26, color = '#ffffff' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Base line */}
    <line x1="3" y1="20" x2="21" y2="20" />
    {/* Left Building/Bar */}
    <path d="M5 20V12H9V20" />
    {/* Center Building/Bar (Tallest) */}
    <path d="M9 20V4H15V20" />
    {/* Right Building/Bar */}
    <path d="M15 20V8H19V20" />
    {/* Windows in Center Building */}
    <line x1="12" y1="7" x2="12" y2="7.01" strokeWidth="3" />
    <line x1="12" y1="11" x2="12" y2="11.01" strokeWidth="3" />
    <line x1="12" y1="15" x2="12" y2="15.01" strokeWidth="3" />
    {/* Window in Left Building */}
    <line x1="7" y1="15" x2="7" y2="15.01" strokeWidth="3" />
  </svg>
);

const BrandLogo = ({
  size = 'medium',
  subtitle = 'PORTFOLIO & OPERATIONS PORTAL',
  forceLightText = false,
  sx = {},
}) => {
  // Size metrics
  const dimensions = {
    small: { iconBox: 36, iconSize: 20, titleSize: '1.1rem', subSize: '0.58rem', gap: 1.2 },
    medium: { iconBox: 46, iconSize: 26, titleSize: '1.35rem', subSize: '0.65rem', gap: 1.6 },
    large: { iconBox: 54, iconSize: 30, titleSize: '1.65rem', subSize: '0.72rem', gap: 2 },
  }[size] || { iconBox: 46, iconSize: 26, titleSize: '1.35rem', subSize: '0.65rem', gap: 1.6 };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: dimensions.gap, ...sx }}>
      {/* Purple Glowing Circular Logo Icon */}
      <Box
        sx={{
          width: dimensions.iconBox,
          height: dimensions.iconBox,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 0 20px rgba(124, 58, 237, 0.55), 0 4px 12px rgba(99, 102, 241, 0.4)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <BuildingChartIcon size={dimensions.iconSize} color="#ffffff" />
      </Box>

      {/* Brand Text Header */}
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            lineHeight: 1.05,
            color: forceLightText ? '#ffffff' : 'text.primary',
            letterSpacing: '-0.5px',
          }}
        >
          <Box component="span" sx={{ fontWeight: 800, fontSize: dimensions.titleSize }}>
            Inventra{' '}
          </Box>
          <Box
            component="span"
            sx={{
              fontWeight: 400,
              fontSize: dimensions.titleSize,
              opacity: forceLightText ? 0.9 : 0.85,
            }}
          >
            stocks
          </Box>
        </Typography>
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: forceLightText ? '#c084fc' : '#8b5cf6',
            fontWeight: 800,
            fontSize: dimensions.subSize,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            mt: 0.3,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default BrandLogo;
