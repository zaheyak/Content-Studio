import React, { useState } from 'react';
import { 
  ContentStudioPreview,
  LessonPage,
  Card,
  Button,
  Badge,
  Input,
  TextArea,
  Divider,
  LoadingSpinner,
  EmptyState,
  Grid,
  Flex
} from './index';

// ----------------------------- //
// Demo Page Component
// ----------------------------- //

export const UIDemo = () => {
  const [activeDemo, setActiveDemo] = useState('full');

  const demos = [
    { id: 'full', name: 'Full Lesson Page', component: ContentStudioPreview },
    { id: 'primitives', name: 'Primitive Components', component: PrimitivesDemo },
    { id: 'layout', name: 'Layout Components', component: LayoutDemo },
    { id: 'content', name: 'Content Components', component: ContentDemo }
  ];

  const ActiveComponent = demos.find(d => d.id === activeDemo)?.component || ContentStudioPreview;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
            Content Studio UI Components
          </h1>
          <Flex gap="0.5rem">
            {demos.map(demo => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? 'solid' : 'outline'}
                onClick={() => setActiveDemo(demo.id)}
                style={{ fontSize: '0.875rem' }}
              >
                {demo.name}
              </Button>
            ))}
          </Flex>
        </div>
      </div>
      
      <div style={{ padding: '2rem 1rem' }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

// ----------------------------- //
// Demo Components
// ----------------------------- //

const PrimitivesDemo = () => (
  <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
    <Grid cols={1} gap="2rem">
      <Card title="Primitive Components Demo">
        <Grid cols={1} gap="1.5rem">
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Buttons
            </h3>
            <Flex gap="0.5rem" wrap>
              <Button variant="solid">Solid Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button disabled>Disabled Button</Button>
            </Flex>
          </div>

          <Divider />

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Badges
            </h3>
            <Flex gap="0.5rem" wrap>
              <Badge tone="gray">Gray</Badge>
              <Badge tone="blue">Blue</Badge>
              <Badge tone="green">Green</Badge>
              <Badge tone="amber">Amber</Badge>
              <Badge tone="red">Red</Badge>
            </Flex>
          </div>

          <Divider />

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Form Elements
            </h3>
            <Grid cols={2} gap="1rem">
              <Input placeholder="Enter text..." />
              <Input placeholder="Another input..." />
            </Grid>
            <div style={{ marginTop: '1rem' }}>
              <TextArea 
                placeholder="Enter longer text here..."
                rows={4}
              />
            </div>
          </div>

          <Divider />

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Loading & Empty States
            </h3>
            <Grid cols={2} gap="1rem">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <LoadingSpinner size={32} />
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Loading...
                </p>
              </div>
              <EmptyState
                title="No content yet"
                description="This is an empty state component."
                action={<Button variant="outline">Add Content</Button>}
              />
            </Grid>
          </div>
        </Grid>
      </Card>
    </Grid>
  </div>
);

const LayoutDemo = () => (
  <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
    <Grid cols={1} gap="2rem">
      <Card title="Layout Components Demo">
        <Grid cols={1} gap="1.5rem">
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Grid Layout
            </h3>
            <Grid cols={3} gap="1rem">
              <Card style={{ padding: '1rem', textAlign: 'center' }}>Grid Item 1</Card>
              <Card style={{ padding: '1rem', textAlign: 'center' }}>Grid Item 2</Card>
              <Card style={{ padding: '1rem', textAlign: 'center' }}>Grid Item 3</Card>
            </Grid>
          </div>

          <Divider />

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Flex Layout
            </h3>
            <Flex justify="space-between" align="center" style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem' }}>
              <span>Left Content</span>
              <span>Center Content</span>
              <span>Right Content</span>
            </Flex>
          </div>
        </Grid>
      </Card>
    </Grid>
  </div>
);

const ContentDemo = () => (
  <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
    <Grid cols={1} gap="2rem">
      <Card title="Content Components Demo">
        <Grid cols={1} gap="1.5rem">
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Content Blocks
            </h3>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
              This would show the ContentBlocks component in action.
            </p>
          </div>

          <Divider />

          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Mind Map
            </h3>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
              This would show the MindMapPanel component in action.
            </p>
          </div>
        </Grid>
      </Card>
    </Grid>
  </div>
);

export default UIDemo;
