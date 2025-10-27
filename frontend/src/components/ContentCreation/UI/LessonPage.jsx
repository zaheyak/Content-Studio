import React, { useState } from 'react';
import { Card, Input, Button } from './Primitives';
import { Layout, Shell, TopNav } from './Layout';
import { Sidebar } from './Sidebar';
import { ContentBlocks, MindMapPanel } from './ContentBlocks';
import { Grid } from './Layout';
import { theme } from '../../theme';

// ----------------------------- //
// Main Lesson Page Component
// ----------------------------- //

export const LessonPage = ({ 
  initialOutline = [
    "Introduction",
    "Core Concepts", 
    "Examples",
    "Scenarios",
    "Summary"
  ],
  initialVersions = [
    { id: 1, label: "v1 • Draft", author: "You", date: "2025-10-23" }
  ],
  onNewLesson,
  onPublish,
  style = {}
}) => {
  const [outline, setOutline] = useState(initialOutline);
  const [versions, setVersions] = useState(initialVersions);
  const [graph, setGraph] = useState(null);
  const [lessonMeta, setLessonMeta] = useState({
    title: "JavaScript Basics",
    level: "Beginner", 
    language: "English"
  });

  const handleGenerateMindMap = (text) => {
    // Simple keyword extraction → graph
    const topics = Array.from(new Set(
      text
        .split(/\W+/)
        .filter((word) => word.length > 3)
        .slice(0, 8)
    ));
    
    const nodes = [
      { id: "root", label: "Lesson" }, 
      ...topics.map((topic, index) => ({ id: `n${index}`, label: topic }))
    ];
    
    const edges = nodes.slice(1).map((node) => ({ from: "root", to: node.id }));
    
    setGraph({ nodes, edges });
  };

  const handleSaveVersion = (blocks) => {
    const nextId = versions.length + 1;
    const newVersion = {
      id: nextId,
      label: `v${nextId} • Draft`,
      author: "You", 
      date: new Date().toISOString().slice(0, 10)
    };
    
    setVersions([newVersion, ...versions]);
    
    // Here you would POST to `/lessons/:id/versions` with the blocks and graph
    alert(`Saved Version ${nextId}! (mock)`);
  };

  const handleSelectVersion = (id) => {
    alert(`Open Version ${id} (mock)`);
  };

  const handleExportSvg = () => {
    // Just demo – real app would serialize the SVG element
    alert("SVG exported (mock)");
  };

  const handleNewLesson = () => {
    onNewLesson?.() || alert("Start new lesson (mock)");
  };

  const handlePublish = () => {
    onPublish?.() || alert("Publish lesson (mock)");
  };

  const pageStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    ...style
  };

  return (
    <Shell>
      <TopNav onNewLesson={handleNewLesson} onPublish={handlePublish} />
      <Layout
        sidebar={
          <Sidebar
            outline={outline}
            versions={versions}
            onSelectVersion={handleSelectVersion}
          />
        }
      >
        <div style={pageStyles}>
          <LessonMetaCard 
            meta={lessonMeta}
            onChange={setLessonMeta}
          />
          <ContentBlocks 
            onSave={handleSaveVersion}
            onGenerateMindMap={handleGenerateMindMap}
          />
          <MindMapPanel 
            graph={graph}
            onExportSvg={handleExportSvg}
          />
        </div>
      </Layout>
    </Shell>
  );
};

export const LessonMetaCard = ({ 
  meta, 
  onChange,
  style = {} 
}) => {
  const metaStyles = {
    ...style
  };

  const handleChange = (field, value) => {
    onChange?.({ ...meta, [field]: value });
  };

  return (
    <Card title="Lesson Meta" style={metaStyles}>
      <Grid cols={3} gap="0.75rem">
        <Input
          value={meta.title}
          onChange={(value) => handleChange('title', value)}
          placeholder="Lesson title"
        />
        <Input
          value={meta.level}
          onChange={(value) => handleChange('level', value)}
          placeholder="Level"
        />
        <Input
          value={meta.language}
          onChange={(value) => handleChange('language', value)}
          placeholder="Language"
        />
      </Grid>
    </Card>
  );
};

// ----------------------------- //
// Demo Container
// ----------------------------- //
export const ContentStudioPreview = ({ 
  onNewLesson,
  onPublish,
  style = {}
}) => {
  const previewStyles = {
    ...style
  };

  return (
    <div style={previewStyles}>
      <LessonPage 
        onNewLesson={onNewLesson}
        onPublish={onPublish}
      />
    </div>
  );
};

export default ContentStudioPreview;
