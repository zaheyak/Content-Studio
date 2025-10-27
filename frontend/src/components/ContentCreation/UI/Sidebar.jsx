import React from 'react';
import { Card, Button, Badge } from './Primitives';
import { theme } from '../../theme';

// ----------------------------- //
// Sidebar Components
// ----------------------------- //

export const Sidebar = ({ 
  outline = [], 
  versions = [], 
  templates = [],
  onSelectVersion,
  onSelectTemplate,
  style = {}
}) => {
  const sidebarStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    ...style
  };

  return (
    <div style={sidebarStyles}>
      <OutlineCard outline={outline} />
      <VersionsCard versions={versions} onSelectVersion={onSelectVersion} />
      <TemplatesCard templates={templates} onSelectTemplate={onSelectTemplate} />
    </div>
  );
};

export const OutlineCard = ({ outline = [], style = {} }) => {
  const outlineStyles = {
    ...style
  };

  return (
    <Card title="Outline" style={outlineStyles}>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {outline.map((item, index) => (
          <li key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span style={{
              marginTop: '0.25rem',
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '50%',
              backgroundColor: theme.colors.textSecondary,
              flexShrink: 0
            }} />
            <span style={{
              fontSize: '0.875rem',
              color: theme.colors.textSecondary,
              lineHeight: '1.5'
            }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export const VersionsCard = ({ 
  versions = [], 
  onSelectVersion,
  style = {} 
}) => {
  const versionsStyles = {
    ...style
  };

  return (
    <Card title="Versions" style={versionsStyles}>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {versions.map((version) => (
          <li key={version.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '0.75rem',
            border: `1px solid ${theme.colors.border}`,
            padding: '0.75rem',
            backgroundColor: theme.colors.surface
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.text,
                margin: '0 0 0.25rem 0'
              }}>
                {version.label}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                {version.author} • {version.date}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onSelectVersion?.(version.id)}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem'
              }}
            >
              Open
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export const TemplatesCard = ({ 
  templates = [], 
  onSelectTemplate,
  onLibrary,
  style = {} 
}) => {
  const templatesStyles = {
    ...style
  };

  const defaultTemplates = [
    { id: 'lecture', name: 'Lecture', description: 'Traditional presentation format' },
    { id: 'workshop', name: 'Workshop', description: 'Hands-on learning session' },
    { id: 'lab', name: 'Lab', description: 'Practical exercises' },
    { id: 'quiz', name: 'Quiz', description: 'Assessment format' }
  ];

  const templateList = templates.length > 0 ? templates : defaultTemplates;

  return (
    <Card 
      title="Templates" 
      toolbar={
        <Button variant="ghost" onClick={onLibrary} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
          Library
        </Button>
      }
      style={templatesStyles}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem'
      }}>
        {templateList.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate?.(template)}
            style={{
              borderRadius: '0.75rem',
              border: `2px dashed ${theme.colors.border}`,
              padding: '0.75rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: theme.colors.surface
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.colors.primary;
              e.target.style.backgroundColor = `${theme.colors.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.colors.border;
              e.target.style.backgroundColor = theme.colors.surface;
            }}
          >
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: theme.colors.text,
              marginBottom: '0.25rem'
            }}>
              {template.name}
            </div>
            <div style={{
              fontSize: '0.625rem',
              color: theme.colors.textSecondary
            }}>
              {template.description}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const ContentBlocksCard = ({ 
  title = "Content Blocks",
  children,
  onGenerate,
  onMindMap,
  onSave,
  isGenerating = false,
  hasContent = false,
  style = {}
}) => {
  const cardStyles = {
    minHeight: '420px',
    ...style
  };

  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Button
        variant="outline"
        onClick={onGenerate}
        disabled={isGenerating}
        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
      >
        {isGenerating ? 'Generating...' : 'Generate (AI)'}
      </Button>
      <Button
        variant="ghost"
        onClick={onMindMap}
        disabled={!hasContent}
        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
      >
        Mind Map
      </Button>
      <Button
        onClick={onSave}
        disabled={!hasContent}
        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
      >
        Save Version
      </Button>
    </div>
  );

  return (
    <Card title={title} toolbar={toolbar} style={cardStyles}>
      {children}
    </Card>
  );
};
