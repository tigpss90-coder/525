# HTML Poster Editor

A professional web application for importing, visually editing, and exporting HTML files within a fixed 720×720 pixel design canvas. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Editing
- **HTML Import**: Upload `.html` files or paste HTML content directly with beautiful dialog interface
- **Visual Canvas**: Fixed 720×720px editing stage with gradient background and shadow effects
- **Element Selection**: Click to select elements with blue outline and visual highlighting
- **Drag & Drop**: Reposition elements within the canvas using smooth mouse interactions
- **Text Editing**: Modify content, font size, color, and weight for text elements
- **Image Editing**: Upload new images or change URLs, dimensions, and alt text
- **Image Resize**: Drag corner and edge handles to resize images dynamically
- **Snapping & Alignment**: Smart snapping to canvas edges, center, and other elements with visual guide lines
- **Add Elements**: Insert new text blocks and images dynamically
- **Element Deletion**: Remove selected elements with confirmation dialog
- **HTML Export**: Download edited content as `.html` with metadata tag
- **Undo/Redo**: Full history management with undo and redo capabilities

### Visual Enhancements
- **Modern UI Design**: Gradient backgrounds, smooth animations, and polished interfaces
- **Animated Landing Page**: Professional welcome screen with feature highlights
- **Enhanced Properties Panel**: Beautiful card-based design with visual feedback
- **Interactive Resize Handles**: Corner and edge handles for intuitive image resizing
- **Status Indicators**: Live status and version display
- **Color-Coded Actions**: Different hover colors for different action types
- **Smooth Transitions**: Hover effects, scale transforms, and fade animations

### Tech Stack Verification

#FOLLOWING TECH STACKS CONFIRMED 

Next.js with App Router: CONFIRMED

Next.js version 13.5.1 is installed
Uses the App Router architecture (app directory structure with layout.tsx and page.tsx)
Modern Next.js configuration with proper routing setup

TypeScript: CONFIRMED

TypeScript 5.2.2 is installed and configured
tsconfig.json is properly set up with strict mode
All main files use .ts and .tsx extensions
Type definitions are used throughout (interfaces, type annotations)

Tailwind CSS: CONFIRMED

Tailwind CSS 3.3.3 is installed
tailwind.config.ts is properly configured
PostCSS configuration is present
Tailwind utilities are used in components
shadcn/ui component library is integrated (which is built on Tailwind)

SOLID Architecture Principles: CONFIRMED

The README explicitly documents how SOLID principles are applied
Code structure demonstrates SOLID principles in practice:
Single Responsibility: Each component has one clear purpose (ImportPanel, CanvasStage, PropertiesPanel, Toolbar)
Open/Closed: Element types can be extended, utility functions are modular
Liskov Substitution: Standard React prop interfaces are used
Interface Segregation: Components receive only necessary props
Dependency Inversion: Components depend on TypeScript interfaces, not concrete implementations
However, the implementation is more functional/component-based rather than class-based OOP (which is common in modern React)
Utility functions are pure and separated in lib directory
Type definitions are properly abstracted
Summary: All four technologies from your tech stack are present and properly implemented. The project is a well-structured Next.js application following modern React and TypeScript best practices with SOLID principles applied at the component and module level.

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone or download the project:
```bash
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

### Testing with Sample HTML

You can test the editor with this sample HTML (paste it using the "Paste HTML" button):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sample Poster</title>
<style>
body { margin: 0; padding: 0; }
.poster {
width: 720px; height: 720px; position: relative;
background: #f3f4f6; overflow: hidden; font-family: sans-serif;
}
.title {
position: absolute; top: 80px; left: 40px;
font-size: 48px; font-weight: bold; color: #111827;
}
.subtitle {
position: absolute; top: 160px; left: 40px;
font-size: 20px; color: #374151;
}
.hero {
position: absolute; bottom: 0; right: 0; width: 380px; height: 380px;
object-fit: cover; border-top-left-radius: 16px;
}
</style>
</head>
<body>
<div class="poster">
<h1 class="title">Summer Sale</h1>
<p class="subtitle">Up to <strong>50% off</strong> on select items!</p>
<img class="hero" src="https://images.unsplash.com/photo-1520975922284-7bcd4290b0e1?q=80&w=1200&auto=format&fit=crop" alt="Model" />
</div>
</body>
</html>
```

## Architecture & Design

### Technology Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Hooks (useState, useRef, useEffect)

### Project Structure

```
project/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application component
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── AlignmentGuides.tsx # Visual alignment guides during drag
│   ├── CanvasStage.tsx     # 720×720 editing canvas
│   ├── ImageUploadDialog.tsx # Image upload modal interface
│   ├── ImportPanel.tsx     # File upload and paste interface
│   ├── PropertiesPanel.tsx # Element property editor
│   ├── ResizeHandles.tsx   # Image resize handles
│   ├── Toolbar.tsx         # Action buttons (add, delete, export)
│   └── ui/                 # shadcn/ui component library
├── hooks/
│   ├── use-history.ts      # Undo/redo history management
│   └── use-toast.ts        # Toast notification hook
└── lib/
    ├── html-utils.ts       # HTML manipulation utilities
    ├── snapping.ts         # Snapping and alignment calculations
    ├── types.ts            # TypeScript type definitions
    ├── utils.ts            # General utility functions
    └── validation.ts       # Input validation utilities
```

### SOLID Design Principles

#### 1. Single Responsibility Principle (SRP)
Each component and module has one clear responsibility:

- **`ImportPanel`**: Handles HTML import (file upload and paste)
- **`CanvasStage`**: Manages the editing canvas, element selection, and drag interactions with snapping
- **`PropertiesPanel`**: Displays and edits properties of selected elements
- **`Toolbar`**: Provides action buttons for adding, deleting, and exporting
- **`ResizeHandles`**: Manages image resize interactions with 8 directional handles
- **`AlignmentGuides`**: Renders visual guide lines during drag operations
- **`html-utils.ts`**: Contains pure functions for HTML manipulation (sanitization, export, ID generation)
- **`snapping.ts`**: Pure functions for calculating snap positions and detecting alignment
- **`use-history.ts`**: Custom hook implementing command pattern for undo/redo

#### 2. Open/Closed Principle (OCP)
The application is open for extension but closed for modification:

- Element types (text, image) can be extended by adding new handlers in `html-utils.ts`
- New element properties can be added to `PropertiesPanel` without modifying core logic
- The sanitization function can be enhanced with additional rules without changing its interface
- Snapping behavior can be extended with new snap points without modifying the core algorithm
- New resize handle types can be added without changing the existing resize logic

#### 3. Liskov Substitution Principle (LSP)
Components accept standard React prop interfaces:

- All components using `SelectedElement` type can work with any element implementing that interface
- Event handlers follow standard React patterns and can be swapped or extended

#### 4. Interface Segregation Principle (ISP)
Components receive only the props they need:

- `CanvasStage` receives only selection and content change handlers
- `PropertiesPanel` receives only the selected element and change callback
- `Toolbar` receives only action handlers, not the entire application state

#### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

- Components depend on TypeScript interfaces (`SelectedElement`, `Position`, `Size`)
- Utility functions are pure and independent of React
- State management is abstracted through props and callbacks

### Key Design Decisions

#### State Management
- **`useState`**: For reactive UI state (selected element, dialog visibility)
- **`useRef`**: For mutable values that don't trigger re-renders (stage content tracking)
- **Props drilling**: Intentionally used for clear data flow in a small application

#### Element Tracking
- Unique IDs are assigned to all elements using `generateUniqueId()`
- IDs enable reliable selection, modification, and deletion
- DOM manipulation is performed directly for performance (React is not re-rendering the entire canvas on every change)

#### Security
- **HTML Sanitization**: Removes `<script>` tags and event handler attributes
- **DOMParser API**: Safely parses HTML without executing code
- Input validation on file uploads (HTML files only)

#### Performance Optimizations
- Direct DOM manipulation for drag operations (no re-renders during drag)
- `useCallback` hooks to prevent unnecessary function recreations
- Event listener cleanup in `useEffect` return functions
- Snap calculations only run during active drag operations
- Guide rendering is conditional and only active when snapping occurs
- History snapshots use efficient string comparison for change detection

### Component Interaction Flow

```
┌─────────────────────────────────────────────────┐
│              Main App (page.tsx)                │
│  - Manages global state                         │
│  - Coordinates component communication          │
└─────────────────────────────────────────────────┘
           │           │           │
    ┌──────┘           │           └──────┐
    │                  │                  │
┌───▼────┐      ┌──────▼──────┐     ┌────▼─────┐
│ Import │      │   Toolbar   │     │Properties│
│ Panel  │      │             │     │  Panel   │
└────────┘      └─────────────┘     └──────────┘
                      │
                ┌─────▼─────┐
                │  Canvas   │
                │  Stage    │
                └───────────┘
```

## Known Limitations

### Current Limitations

2. **Single Selection Only**: Cannot select and move multiple elements at once
   - Workaround: Move elements individually

3. **Limited Style Controls**: Only font size, color, and weight are editable
   - Other CSS properties require manual HTML editing

4. **No Element Layering Control**: Cannot change z-index or layer order
   - Element stacking is determined by DOM order

5. **No Copy/Paste**: Cannot duplicate elements within the editor
   - Workaround: Add new elements and configure them manually

6. **Fixed Canvas Size**: 720×720px cannot be changed
   - Designed specifically for poster-size content

7. **No Zoom/Pan**: Canvas is displayed at 100% scale only
   - May be difficult on smaller screens

8. **Limited Nested Element Support**: Deeply nested elements may not be individually selectable
   - Selection prioritizes top-level children

9. **No Save/Load Sessions**: Cannot save work-in-progress
   - Must export and re-import HTML to continue later

10. **Snapping on Single Axis**: Only one snap point per axis is detected
    - Cannot simultaneously align to multiple references

### Browser Compatibility

- **Tested**: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Required**: Modern browser with ES6+ support
- **Known Issues**: Older browsers may have issues with drag interactions

## Potential Improvements

### High Priority

1. **Multi-Select & Group Operations**
   - Shift+Click for multi-selection
   - Group move, delete, and style changes
   - Bounding box around selected elements

2. **Enhanced Snapping System**
   - Snap to grid (configurable size)
   - Multiple simultaneous snap points
   - Distance indicators between elements
   - Configurable snap threshold

3. **Enhanced Property Editing**
   - Background color and borders
   - Padding and margin controls
   - Box shadow and border radius
   - Text alignment and line height

### Medium Priority

4. **Layering Controls**
   - Bring to front / Send to back
   - Move up / Move down
   - Visual layer panel showing element hierarchy

5. **Copy/Paste & Duplicate**
   - Clipboard operations for elements
   - Duplicate button in toolbar
   - Keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+D)

6. **Canvas Controls**
   - Zoom in/out (25%-200%)
   - Pan with space bar + drag
   - Fit to screen option
   - Snap guides should scale with zoom level

7. **Save/Load Sessions**
   - LocalStorage for auto-save
   - Named project saves
   - Export/import project files (JSON)

8. **Element Tree Panel**
   - Hierarchical view of all elements
   - Click to select in tree
   - Rename elements for organization

### Low Priority / Nice-to-Have

9. **Template Library**
    - Pre-built poster templates
    - Categorized by use case
    - One-click import

10. **Advanced Text Editing**
    - Rich text editing (bold, italic, underline)
    - Google Fonts integration
    - Text effects and shadows

11. **Image Filters**
    - Brightness, contrast, saturation
    - CSS filters (blur, grayscale, sepia)
    - Crop and rotate

12. **Export Options**
    - Export as PNG/JPG image
    - Export as PDF
    - Configurable export quality

13. **Responsive Preview**
    - Preview at different viewport sizes
    - Mobile/tablet/desktop views

14. **Collaboration Features**
    - Real-time multi-user editing
    - Comments and annotations
    - Version history

15. **Accessibility Enhancements**
    - Keyboard-only navigation
    - Screen reader support
    - ARIA labels and roles
    - Focus indicators

16. **Performance Optimizations**
    - Virtual DOM for large documents
    - Canvas rendering for smoother interactions
    - Web Workers for heavy operations

## Testing Guidelines

### Manual Testing Checklist

- [ ] Import HTML file via upload
- [ ] Import HTML via paste
- [ ] Select text elements and edit content
- [ ] Select text elements and change font size, color, weight
- [ ] Select image elements and change URL
- [ ] Select image elements and upload new image
- [ ] Select image elements and change dimensions
- [ ] Drag elements to new positions
- [ ] Verify snapping works when dragging near canvas edges
- [ ] Verify snapping works when dragging near canvas center
- [ ] Verify snapping works when dragging near other elements
- [ ] Verify alignment guides appear and disappear correctly
- [ ] Resize images using corner handles
- [ ] Resize images using edge handles
- [ ] Add new text block and verify it's editable
- [ ] Add new image and verify it's editable
- [ ] Delete element using toolbar button
- [ ] Delete element using Delete key
- [ ] Export HTML and verify downloaded file
- [ ] Re-import exported HTML and verify fidelity
- [ ] Verify security: paste HTML with `<script>` tags (should be removed)

### Test with Complex HTML

Import HTML with:
- Multiple nested elements
- Various positioning styles (absolute, relative, static)
- Different element types (divs, spans, headings, paragraphs)
- Multiple images
- Inline styles and CSS classes

## License

This project is created for educational and internship evaluation purposes.

## Support

For issues or questions, please refer to the project requirements document or contact the development team.

---

**Built with Next.js, TypeScript, and Tailwind CSS**
