// Theme configuration for Content Studio
export const theme = {
  colors: {
    primary: '#667eea',
    primaryHover: '#5a67d8',
    secondary: '#764ba2',
    success: '#4CAF50',
    successHover: '#45a049',
    warning: '#FF9800',
    error: '#f44336',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    borderLight: '#f0f0f0'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    warning: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.1)',
    large: '0 8px 24px rgba(0,0,0,0.15)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
};

// CSS-in-JS helper functions
export const createStyles = (styles) => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'function' ? value(theme) : value;
    return acc;
  }, {});
};
