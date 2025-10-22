# HTML Poster Editor

A professional web application for importing, visually editing, and exporting HTML files within a fixed 720×720 pixel design canvas. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **HTML Import**: Upload `.html` files or paste HTML content directly
- **Visual Canvas**: Fixed 720×720px editing stage with isolated styling
- **Element Selection**: Click to select elements with visual highlighting
- **Drag & Drop**: Reposition elements within the canvas using mouse interactions
- **Text Editing**: Modify content, font size, color, and weight for text elements
- **Image Replacement**: Upload new images or change URLs, dimensions, and alt text
- **Add Elements**: Insert new text blocks and images dynamically
- **Element Deletion**: Remove selected elements with confirmation dialog
- **HTML Export**: Download edited content as `.html` with metadata tag
- **Keyboard Shortcuts**: Delete key for element removal
- tech Stack Verification

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
│   ├── CanvasStage.tsx     # 720×720 editing canvas
│   ├── ImportPanel.tsx     # File upload and paste interface
│   ├── PropertiesPanel.tsx # Element property editor
│   ├── Toolbar.tsx         # Action buttons (add, delete, export)
│   └── ui/                 # shadcn/ui component library
└── lib/
    ├── html-utils.ts       # HTML manipulation utilities
    ├── types.ts            # TypeScript type definitions
    └── utils.ts            # General utility functions
```

### SOLID Design Principles

#### 1. Single Responsibility Principle (SRP)
Each component and module has one clear responsibility:

- **`ImportPanel`**: Handles HTML import (file upload and paste)
- **`CanvasStage`**: Manages the editing canvas, element selection, and drag interactions
- **`PropertiesPanel`**: Displays and edits properties of selected elements
- **`Toolbar`**: Provides action buttons for adding, deleting, and exporting
- **`html-utils.ts`**: Contains pure functions for HTML manipulation (sanitization, export, ID generation)

#### 2. Open/Closed Principle (OCP)
The application is open for extension but closed for modification:

- Element types (text, image) can be extended by adding new handlers in `html-utils.ts`
- New element properties can be added to `PropertiesPanel` without modifying core logic
- The sanitization function can be enhanced with additional rules without changing its interface

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

1. **No Undo/Redo**: Changes are immediate and cannot be reverted
   - Workaround: Re-import the original HTML file

2. **Single Selection Only**: Cannot select and move multiple elements at once
   - Workaround: Move elements individually

3. **Limited Style Controls**: Only font size, color, and weight are editable
   - Other CSS properties require manual HTML editing

4. **No Alignment Guides**: No snapping or alignment assistance
   - Manual positioning requires precision

5. **No Element Layering Control**: Cannot change z-index or layer order
   - Element stacking is determined by DOM order

6. **No Copy/Paste**: Cannot duplicate elements within the editor
   - Workaround: Add new elements and configure them manually

7. **Fixed Canvas Size**: 720×720px cannot be changed
   - Designed specifically for poster-size content

8. **No Zoom/Pan**: Canvas is displayed at 100% scale only
   - May be difficult on smaller screens

9. **Limited Nested Element Support**: Deeply nested elements may not be individually selectable
   - Selection prioritizes top-level children

10. **No Save/Load Sessions**: Cannot save work-in-progress
    - Must export and re-import HTML to continue later

### Browser Compatibility

- **Tested**: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Required**: Modern browser with ES6+ support
- **Known Issues**: Older browsers may have issues with drag interactions

## Potential Improvements

### High Priority

1. **Undo/Redo System**
   - Implement command pattern with history stack
   - Store snapshots of DOM state before each change
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

2. **Multi-Select & Group Operations**
   - Shift+Click for multi-selection
   - Group move, delete, and style changes
   - Bounding box around selected elements

3. **Alignment & Snapping**
   - Guide lines when elements align
   - Snap to grid (configurable size)
   - Snap to other elements

4. **Enhanced Property Editing**
   - Background color and borders
   - Padding and margin controls
   - Box shadow and border radius
   - Text alignment and line height

### Medium Priority

5. **Layering Controls**
   - Bring to front / Send to back
   - Move up / Move down
   - Visual layer panel showing element hierarchy

6. **Copy/Paste & Duplicate**
   - Clipboard operations for elements
   - Duplicate button in toolbar
   - Keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+D)

7. **Canvas Controls**
   - Zoom in/out (25%-200%)
   - Pan with space bar + drag
   - Fit to screen option

8. **Save/Load Sessions**
   - LocalStorage for auto-save
   - Named project saves
   - Export/import project files (JSON)

9. **Element Tree Panel**
   - Hierarchical view of all elements
   - Click to select in tree
   - Rename elements for organization

### Low Priority / Nice-to-Have

10. **Template Library**
    - Pre-built poster templates
    - Categorized by use case
    - One-click import

11. **Advanced Text Editing**
    - Rich text editing (bold, italic, underline)
    - Google Fonts integration
    - Text effects and shadows

12. **Image Filters**
    - Brightness, contrast, saturation
    - CSS filters (blur, grayscale, sepia)
    - Crop and rotate

13. **Export Options**
    - Export as PNG/JPG image
    - Export as PDF
    - Configurable export quality

14. **Responsive Preview**
    - Preview at different viewport sizes
    - Mobile/tablet/desktop views

15. **Collaboration Features**
    - Real-time multi-user editing
    - Comments and annotations
    - Version history

16. **Accessibility Enhancements**
    - Keyboard-only navigation
    - Screen reader support
    - ARIA labels and roles
    - Focus indicators

17. **Performance Optimizations**
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
