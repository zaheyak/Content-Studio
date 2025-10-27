import React from 'react';
import { theme } from '../../theme';

// ----------------------------- //
// Layout Components
// ----------------------------- //

export const TopNav = ({ onNewLesson, onPublish, style = {} }) => {
  const navStyles = {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    width: '100%',
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottom: `1px solid ${theme.colors.border}`,
    ...style
  };

  const containerStyles = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const logoIconStyles = {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.75rem',
    backgroundColor: theme.colors.primary
  };

  const titleStyles = {
    fontSize: '0.875rem',
    fontWeight: '600',
    letterSpacing: '0.025em',
    color: theme.colors.text
  };

  const actionsStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={navStyles}>
      <div style={containerStyles}>
        <div style={logoStyles}>
          <div style={logoIconStyles} />
          <span style={titleStyles}>Content Studio</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: `${theme.colors.primary}20`,
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}40`
          }}>
            MVP
          </span>
        </div>
        <div style={actionsStyles}>
          <button
            onClick={onNewLesson}
            style={{
              borderRadius: '0.75rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.surface;
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'none';
            }}
          >
            New Lesson
          </button>
          <button
            onClick={onPublish}
            style={{
              borderRadius: '0.75rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.primaryHover;
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors.primary;
              e.target.style.transform = 'none';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export const Layout = ({ sidebar, children, style = {} }) => {
  const containerStyles = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1rem',
    ...style
  };

  const sidebarStyles = {
    gridColumn: 'span 3',
    display: 'none'
  };

  const mainStyles = {
    gridColumn: 'span 12'
  };

  const mainStylesWithSidebar = {
    gridColumn: 'span 9'
  };

  return (
    <div style={containerStyles}>
      {sidebar && (
        <aside style={sidebarStyles} className="hidden md:block">
          {sidebar}
        </aside>
      )}
      <main style={sidebar ? mainStylesWithSidebar : mainStyles}>
        {children}
      </main>
    </div>
  );
};

export const Shell = ({ children, style = {} }) => {
  const shellStyles = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    ...style
  };

  return (
    <div style={shellStyles}>
      {children}
    </div>
  );
};

export const Grid = ({ 
  children, 
  cols = 1, 
  gap = '1rem', 
  style = {} 
}) => {
  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap,
    ...style
  };

  return (
    <div style={gridStyles}>
      {children}
    </div>
  );
};

export const Flex = ({ 
  children, 
  direction = 'row', 
  align = 'stretch', 
  justify = 'flex-start', 
  gap = '0.5rem',
  wrap = false,
  style = {} 
}) => {
  const flexStyles = {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...style
  };

  return (
    <div style={flexStyles}>
      {children}
    </div>
  );
};

export const Container = ({ 
  children, 
  maxWidth = '80rem', 
  padding = '1rem',
  style = {} 
}) => {
  const containerStyles = {
    maxWidth,
    margin: '0 auto',
    padding,
    ...style
  };

  return (
    <div style={containerStyles}>
      {children}
    </div>
  );
};
