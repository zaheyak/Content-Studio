# Content Studio UI Components

## 📁 Component Structure

This directory contains a clean, modular UI component system inspired by modern React patterns, organized into logical divisions:

```
UI/
├── Primitives.jsx      # Basic building blocks
├── Layout.jsx          # Layout and navigation components  
├── Sidebar.jsx         # Sidebar-specific components
├── ContentBlocks.jsx  # Content creation components
├── LessonPage.jsx      # Main page components
├── Demo.jsx           # Component demonstrations
├── index.js           # Centralized exports
└── README.md          # This documentation
```

## 🧩 Component Divisions

### **1. Primitives.jsx** - Basic Building Blocks
- `Divider` - Visual separators
- `Badge` - Status indicators with tone variants
- `Button` - Interactive buttons with variants (solid, outline, ghost)
- `Card` - Container components with headers and toolbars
- `Input` - Text input fields
- `TextArea` - Multi-line text inputs
- `LoadingSpinner` - Loading indicators
- `EmptyState` - Empty state displays

### **2. Layout.jsx** - Layout & Navigation
- `TopNav` - Top navigation bar with logo and actions
- `Layout` - Main layout with sidebar support
- `Shell` - Root container with theming
- `Grid` - CSS Grid layout component
- `Flex` - Flexbox layout component
- `Container` - Responsive container wrapper

### **3. Sidebar.jsx** - Sidebar Components
- `Sidebar` - Main sidebar container
- `OutlineCard` - Lesson outline display
- `VersionsCard` - Version history management
- `TemplatesCard` - Template selection
- `ContentBlocksCard` - Content blocks container

### **4. ContentBlocks.jsx** - Content Creation
- `ContentBlocks` - Main content creation interface
- `ContentBlock` - Individual content sections
- `MindMapPanel` - Mind map visualization
- `MindMapCanvas` - SVG-based mind map renderer
- `useStreamer` - Hook for AI content streaming

### **5. LessonPage.jsx** - Page Components
- `LessonPage` - Complete lesson creation page
- `LessonMetaCard` - Lesson metadata form
- `ContentStudioPreview` - Full application preview

## 🎨 Design System

### **Theme Integration**
All components use the centralized `theme.js` for consistent styling:
- Colors (primary, secondary, success, etc.)
- Typography scales
- Spacing system
- Border radius values
- Shadow definitions

### **Component Variants**
- **Buttons**: `solid`, `outline`, `ghost`
- **Badges**: `gray`, `blue`, `green`, `amber`, `red`
- **Cards**: With/without headers, toolbars, custom styling

### **Responsive Design**
- Mobile-first approach
- Grid system with breakpoints
- Flexible layouts that adapt to screen size

## 🚀 Usage Examples

### **Basic Usage**
```jsx
import { Button, Card, Input } from './components/UI';

function MyComponent() {
  return (
    <Card title="My Card" toolbar={<Button>Action</Button>}>
      <Input placeholder="Enter text..." />
    </Card>
  );
}
```

### **Full Lesson Page**
```jsx
import { ContentStudioPreview } from './components/UI';

function App() {
  return (
    <ContentStudioPreview 
      onNewLesson={() => console.log('New lesson')}
      onPublish={() => console.log('Publish')}
    />
  );
}
```

### **Custom Layout**
```jsx
import { Layout, Sidebar, Grid } from './components/UI';

function CustomPage() {
  return (
    <Layout
      sidebar={<Sidebar outline={outline} versions={versions} />}
    >
      <Grid cols={2} gap="1rem">
        <Card>Content 1</Card>
        <Card>Content 2</Card>
      </Grid>
    </Layout>
  );
}
```

## 🎯 Key Features

### **1. Modular Architecture**
- Each component is self-contained
- Clear separation of concerns
- Easy to maintain and extend

### **2. Consistent Styling**
- Centralized theme system
- Consistent spacing and typography
- Hover and focus states

### **3. Accessibility**
- Proper semantic HTML
- Keyboard navigation support
- Screen reader friendly

### **4. Performance**
- Lightweight components
- Minimal re-renders
- Efficient state management

### **5. Developer Experience**
- TypeScript-ready (when needed)
- Clear prop interfaces
- Comprehensive documentation

## 🔧 Customization

### **Theme Override**
```jsx
import { theme } from '../theme';

// Override specific theme values
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#your-color'
  }
};
```

### **Component Styling**
```jsx
<Button 
  style={{ 
    backgroundColor: 'custom-color',
    borderRadius: '0.5rem' 
  }}
>
  Custom Button
</Button>
```

### **Layout Customization**
```jsx
<Grid cols={4} gap="2rem" style={{ margin: '2rem 0' }}>
  {/* Custom grid layout */}
</Grid>
```

## 📱 Responsive Behavior

### **Breakpoints**
- Mobile: Default styles
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)

### **Grid System**
- 12-column grid by default
- Responsive column spans
- Automatic gap management

### **Component Adaptation**
- Sidebar hides on mobile
- Grid columns stack on small screens
- Touch-friendly button sizes

## 🧪 Testing & Demo

### **Demo Page**
Access the demo page to see all components in action:
```jsx
import { UIDemo } from './components/UI/Demo';

// Shows interactive examples of all components
<UIDemo />
```

### **Component Testing**
Each component can be tested independently:
```jsx
import { Button } from './components/UI';

// Test button variants
<Button variant="solid">Test</Button>
<Button variant="outline">Test</Button>
<Button variant="ghost">Test</Button>
```

## 🎉 Benefits

1. **✅ Clean Architecture** - Well-organized, maintainable code
2. **✅ Reusable Components** - Build once, use everywhere
3. **✅ Consistent Design** - Unified look and feel
4. **✅ Easy Customization** - Flexible theming system
5. **✅ Performance** - Lightweight and efficient
6. **✅ Developer Friendly** - Clear APIs and documentation

This component system provides a solid foundation for building the Content Studio application with clean, maintainable, and scalable code! 🚀
