# Workflow Builder UI

 **[Live Demo](https://workflow-builder-isatyamshivam.vercel.app/)**

A visual workflow builder application built with React. Create, edit, and manage complex workflow hierarchies with an intuitive drag-and-drop-style interface.

## Features

### Core Features
- **Visual Workflow Canvas**: Start with a root "Start" node and build your workflow visually
- **Multiple Node Types**:
  - **Start**: The entry point of your workflow (non-deletable)
  - **Action**: Single-step tasks with one outgoing connection
  - **Branch (Condition)**: Decision points with multiple branches (True/False)
  - **End**: Terminal nodes with no outgoing connections
- **Interactive Editing**:
  - Add new nodes via contextual "+" buttons
  - Delete nodes (automatically reconnects parent to children)
  - Edit node labels by clicking on them
- **Visual Connections**: Clear connection lines between nodes

### Bonus Features
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Save Workflow**: Export workflow as a downloadable JSON file (Ctrl+S)
- **Load Workflow**: Import previously saved workflow files (Ctrl+O)
- **Reset Workflow**: Clear all nodes and start fresh
- **Keyboard Shortcuts**: 
  - `Ctrl+S` - Save workflow to file
  - `Ctrl+O` - Load workflow from file
  - `Ctrl+Z` - Undo
  - `Ctrl+Y` / `Ctrl+Shift+Z` - Redo

## Technology Stack

- **React** (functional components with Hooks)
- **JavaScript**
- **Vite** (build tool)
- **Pure CSS** (no UI libraries)
- **No external workflow/diagramming libraries**

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd workflow-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Data Model

The workflow is represented as a JSON structure:

```javascript
{
  nodes: {
    "node_id": {
      id: "node_id",
      type: "start" | "action" | "branch" | "end",
      label: "Node Label",
      parentId: "parent_node_id" | null,
      branchLabel: "True" | "False" | null,  // For branch children
      children: ["child_id_1", "child_id_2"]
    }
  },
  rootId: "start_node_id"
}
```

## Project Structure

```
src/
├── components/
│   ├── Toolbar.jsx/.css      # Top toolbar with actions
│   ├── WorkflowCanvas.jsx/.css   # Main canvas that renders the tree
│   └── WorkflowNode.jsx/.css     # Individual node component
├── hooks/
│   └── useWorkflow.js        # State management hook
├── types/
│   └── nodeTypes.js          # Node type definitions and helpers
├── App.jsx                   # Main application component
├── App.css                   # Application styles
└── main.jsx                  # Entry point
```

## Usage Guide

1. **Start**: The canvas begins with a single "Start" node
2. **Add Nodes**: Click the "+" button below any node to add a new node
3. **Choose Type**: Select Action, Branch (Condition), or End from the menu
4. **Edit Labels**: Click on any node's label to edit it
5. **Delete Nodes**: Click the "×" button on any node (except Start)
6. **Branch Logic**: Branch nodes have True/False branches - add nodes to either branch
7. **Undo/Redo**: Use toolbar buttons or Ctrl+Z/Ctrl+Y
8. **Save**: Click Save button or press Ctrl+S to download workflow as JSON file
9. **Load**: Click Load button or press Ctrl+O to import a saved workflow file

## License

MIT License

Copyright (c) 2025 isatyamshivam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
