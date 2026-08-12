import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#8b5cf6',
        light: '#a78bfa',
        dark: '#7c3aed',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#06b6d4',
        light: '#38bdf8',
        dark: '#0284c7',
      },
      background: {
        default: mode === 'dark' ? '#090d16' : '#f8fafc',
        paper: mode === 'dark' ? '#111827' : '#ffffff',
        subtle: mode === 'dark' ? '#1f2937' : '#f1f5f9',
      },
      text: {
        primary: mode === 'dark' ? '#f3f4f6' : '#0f172a',
        secondary: mode === 'dark' ? '#9ca3af' : '#64748b',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? '#090d16' : '#f8fafc',
            color: mode === 'dark' ? '#f3f4f6' : '#0f172a',
          },
          'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus': {
            WebkitBoxShadow: mode === 'dark' ? '0 0 0 1000px #1e293b inset !important' : '0 0 0 1000px #ffffff inset !important',
            WebkitTextFillColor: mode === 'dark' ? '#f3f4f6 !important' : '#0f172a !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
          'input[type="date"]': {
            colorScheme: mode === 'dark' ? 'dark' : 'light',
          },
          'input[type="date"]::-webkit-calendar-picker-indicator': {
            cursor: 'pointer',
            filter: mode === 'dark' ? 'invert(0.8)' : 'none',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            '&.MuiInputLabel-shrink': {
              background: mode === 'dark' ? '#111827' : '#ffffff',
              padding: '0 6px',
              borderRadius: '4px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.25)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: '16px',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow:
              mode === 'dark'
                ? '0 10px 30px -10px rgba(0,0,0,0.5)'
                : '0 10px 30px -10px rgba(0,0,0,0.04)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow:
              mode === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(0, 0, 0, 0.03)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: '8px',
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            minWidth: '120px',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            paddingRight: '32px !important',
            minWidth: '85px',
            boxSizing: 'border-box',
          },
          icon: {
            right: '6px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            minWidth: '120px',
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          selectLabel: {
            fontSize: '0.82rem',
          },
          selectRoot: {
            minWidth: '65px !important',
          },
          select: {
            paddingRight: '24px !important',
            minWidth: '40px !important',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? '#1f2937' : '#f8fafc',
            color: mode === 'dark' ? '#9ca3af' : '#475569',
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          },
          body: {
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
          },
        },
      },
    },
  });
