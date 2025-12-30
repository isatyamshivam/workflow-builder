import { useEffect, useCallback } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import WorkflowCanvas from './components/WorkflowCanvas';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const {
    nodes,
    rootId,
    addNode,
    deleteNode,
    updateNodeLabel,
    saveWorkflow,
    resetWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflow();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (
      ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
    ) {
      e.preventDefault();
      redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveWorkflow();
    }
  }, [undo, redo, saveWorkflow]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSave = () => {
    const data = saveWorkflow();
    alert('Workflow saved to console! Check the browser developer tools (F12) to see the data structure.');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workflow? This will clear all nodes except the Start node.')) {
      resetWorkflow();
    }
  };

  return (
    <div className="app">
      <Toolbar
        onSave={handleSave}
        onReset={handleReset}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <WorkflowCanvas
        nodes={nodes}
        rootId={rootId}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onUpdateLabel={updateNodeLabel}
      />
    </div>
  );
}

export default App;
