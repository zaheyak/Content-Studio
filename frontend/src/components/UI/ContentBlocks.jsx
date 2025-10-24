import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, TextArea, Button, Divider, EmptyState, LoadingSpinner } from './Primitives';
import { Grid, Flex } from './Layout';
import { theme } from '../../theme';

// ----------------------------- //
// Content Blocks Components
// ----------------------------- //

// Mock streaming utility
export const useStreamer = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [chunks, setChunks] = useState([]);

  const stream = async (texts, delay = 200) => {
    setIsStreaming(true);
    setChunks([]);
    for (const text of texts) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setChunks((prev) => [...prev, text]);
    }
    setIsStreaming(false);
  };

  return { isStreaming, chunks, stream };
};

export const ContentBlocks = ({ 
  onSave, 
  onGenerateMindMap,
  style = {} 
}) => {
  const [goal, setGoal] = useState("Explain JavaScript basics to beginners");
  const [tone, setTone] = useState("friendly, concise, practical");
  const [level, setLevel] = useState("Beginner");
  
  const { isStreaming, chunks, stream } = useStreamer();
  const [blocks, setBlocks] = useState([]);

  const startAI = async () => {
    const sample = [
      "# Overview\nJavaScript is a programming language used in the browser and on servers.",
      "# Key Concepts\nVariables, functions, objects, arrays, events.",
      "# Examples\nlet x = 1; function add(a,b){return a+b}",
      "# Scenarios\nBuild a button that shows an alert when clicked.",
      "# Summary\nYou learned the purpose of JS and the basic types of constructs.",
    ];
    await stream(sample, 260);
  };

  useEffect(() => {
    if (!isStreaming && chunks.length) {
      const parsed = chunks.map((chunk) => {
        const [firstLine, ...rest] = chunk.split("\n");
        const heading = firstLine.replace(/^#\s?/, "");
        return { heading, body: rest.join("\n") };
      });
      setBlocks(parsed);
    }
  }, [isStreaming, chunks]);

  const composedText = useMemo(() => 
    blocks.map(block => `# ${block.heading}\n${block.body}`).join("\n\n"), 
    [blocks]
  );

  const handleSave = () => {
    onSave?.(blocks);
  };

  const handleMindMap = () => {
    onGenerateMindMap?.(composedText);
  };

  const contentBlocksStyles = {
    minHeight: '420px',
    ...style
  };

  return (
    <Card
      title="Content Blocks"
      toolbar={
        <Flex gap="0.5rem">
          <Button
            variant="outline"
            onClick={startAI}
            disabled={isStreaming}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            {isStreaming ? 'Generating...' : 'Generate (AI)'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleMindMap}
            disabled={!blocks.length}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            Mind Map
          </Button>
          <Button
            onClick={handleSave}
            disabled={!blocks.length}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            Save Version
          </Button>
        </Flex>
      }
      style={contentBlocksStyles}
    >
      <Grid cols={1} gap="1rem">
        <Grid cols={3} gap="0.75rem">
          <Input 
            value={goal} 
            onChange={setGoal} 
            placeholder="Learning goal" 
          />
          <Input 
            value={tone} 
            onChange={setTone} 
            placeholder="Style / tone" 
          />
          <Input 
            value={level} 
            onChange={setLevel} 
            placeholder="Level" 
          />
        </Grid>
        
        <Divider />

        {(!blocks.length && !isStreaming) && (
          <EmptyState
            title="No content generated yet"
            description="Click 'Generate (AI)' to stream draft sections here."
            style={{ padding: '2rem 0' }}
          />
        )}

        {isStreaming && (
          <Flex align="center" justify="center" style={{ padding: '2rem 0' }}>
            <LoadingSpinner size={32} />
            <span style={{ marginLeft: '0.75rem', fontSize: '0.875rem', color: theme.colors.textSecondary }}>
              Streaming AI output…
            </span>
          </Flex>
        )}

        {blocks.map((block, index) => (
          <ContentBlock
            key={index}
            heading={block.heading}
            body={block.body}
            onChange={(newBody) => {
              setBlocks((prev) => 
                prev.map((item, idx) => 
                  idx === index ? { ...item, body: newBody } : item
                )
              );
            }}
          />
        ))}
      </Grid>
    </Card>
  );
};

export const ContentBlock = ({ 
  heading, 
  body, 
  onChange,
  style = {} 
}) => {
  const blockStyles = {
    ...style
  };

  return (
    <Card title={heading} style={blockStyles}>
      <TextArea
        value={body}
        onChange={onChange}
        rows={6}
        placeholder="Content will be generated here..."
      />
    </Card>
  );
};

export const MindMapPanel = ({ 
  graph, 
  onExportSvg,
  style = {} 
}) => {
  const panelStyles = {
    ...style
  };

  return (
    <Card 
      title="Mind Map" 
      toolbar={
        <Button
          variant="ghost"
          onClick={onExportSvg}
          disabled={!graph}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
        >
          Download SVG
        </Button>
      }
      style={panelStyles}
    >
      {!graph && (
        <EmptyState
          title="No mind map yet"
          description="Generate from content to create a visual mind map."
          style={{ padding: '2rem 0' }}
        />
      )}
      {graph && (
        <MindMapCanvas graph={graph} />
      )}
    </Card>
  );
};

export const MindMapCanvas = ({ graph, style = {} }) => {
  const canvasStyles = {
    width: '100%',
    borderRadius: '0.75rem',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    ...style
  };

  // Simple radial layout
  const center = { x: 220, y: 160 };
  const placed = useMemo(() => {
    const nodes = [...graph.nodes];
    const others = nodes.slice(1);
    const radius = 120;
    const step = (Math.PI * 2) / Math.max(1, others.length);
    
    return nodes.map((node, index) => {
      if (index === 0) return { ...node, x: center.x, y: center.y };
      const angle = step * (index - 1);
      return { 
        ...node, 
        x: center.x + Math.cos(angle) * radius, 
        y: center.y + Math.sin(angle) * radius 
      };
    });
  }, [graph]);

  const getNode = (id) => placed.find((node) => node.id === id);

  return (
    <svg viewBox="0 0 480 320" style={canvasStyles}>
      {/* Edges */}
      {graph.edges.map((edge, index) => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        return (
          <line
            key={index}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            style={{ color: theme.colors.border }}
            strokeWidth="1.5"
          />
        );
      })}
      
      {/* Nodes */}
      {placed.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r="18"
            fill={theme.colors.surface}
            stroke={theme.colors.border}
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '10px',
              fill: theme.colors.text,
              fontWeight: '500'
            }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
