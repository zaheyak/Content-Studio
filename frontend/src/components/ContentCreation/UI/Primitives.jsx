import React from 'react';
import { theme } from '../../theme';

// ----------------------------- //
// Primitive UI Components
// ----------------------------- //

export const Divider = ({ className = "", style = {} }) => (
  <div 
    style={{
      height: '1px',
      width: '100%',
      backgroundColor: theme.colors.border,
      ...style
    }}
    className={className}
  />
);

export const Badge = ({ children, tone = "gray", style = {} }) => {
  const toneStyles = {
    gray: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`
    },
    green: {
      backgroundColor: `${theme.colors.success}20`,
      color: theme.colors.success,
      border: `1px solid ${theme.colors.success}40`
    },
    blue: {
      backgroundColor: `${theme.colors.primary}20`,
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}40`
    },
    amber: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24'
    },
    red: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #f87171'
    }
  };

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '9999px',
        padding: '0.25rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        ...toneStyles[tone],
        ...style
      }}
    >
      {children}
    </span>
  );
};

export const Button = ({ 
  children, 
  onClick, 
  variant = "solid", 
  disabled = false, 
  style = {},
  className = ""
}) => {
  const baseStyles = {
    borderRadius: '0.75rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    outline: 'none',
    ...style
  };

  const variantStyles = {
    solid: {
      backgroundColor: theme.colors.primary,
      color: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`
    }
  };

  const hoverStyles = {
    solid: {
      backgroundColor: theme.colors.primaryHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    ghost: {
      backgroundColor: theme.colors.surface,
      transform: 'translateY(-1px)'
    },
    outline: {
      backgroundColor: theme.colors.surface,
      transform: 'translateY(-1px)'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...variantStyles[variant]
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, variantStyles[variant]);
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export const Card = ({ 
  children, 
  title, 
  toolbar, 
  style = {},
  className = ""
}) => {
  const cardStyles = {
    borderRadius: '1rem',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    ...style
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface
  };

  const contentStyles = {
    padding: '1rem'
  };

  return (
    <div style={cardStyles} className={className}>
      {(title || toolbar) && (
        <div style={headerStyles}>
          {title && (
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: theme.colors.text,
              margin: 0
            }}>
              {title}
            </h3>
          )}
          {toolbar && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {toolbar}
            </div>
          )}
        </div>
      )}
      <div style={contentStyles}>
        {children}
      </div>
    </div>
  );
};

export const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  style = {},
  className = ""
}) => {
  const inputStyles = {
    width: '100%',
    borderRadius: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    padding: '0.625rem 0.75rem',
    fontSize: '0.875rem',
    color: theme.colors.text,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    ...style
  };

  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyles}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border;
      }}
      className={className}
    />
  );
};

export const TextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 8, 
  style = {},
  className = ""
}) => {
  const textareaStyles = {
    width: '100%',
    borderRadius: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    padding: '0.75rem',
    fontSize: '0.875rem',
    color: theme.colors.text,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
    minHeight: `${rows * 1.5}rem`,
    ...style
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      style={textareaStyles}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border;
      }}
      className={className}
    />
  );
};

export const LoadingSpinner = ({ size = 24, style = {} }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2px solid ${theme.colors.border}`,
      borderTop: `2px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      ...style
    }}
  />
);

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  style = {} 
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    ...style
  }}>
    {icon && (
      <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
        {icon}
      </div>
    )}
    {title && (
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: theme.colors.text,
        margin: '0 0 0.5rem 0'
      }}>
        {title}
      </h3>
    )}
    {description && (
      <p style={{
        fontSize: '0.875rem',
        margin: '0 0 1.5rem 0',
        maxWidth: '400px'
      }}>
        {description}
      </p>
    )}
    {action}
  </div>
);
