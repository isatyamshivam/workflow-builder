import { useEffect, useCallback, useRef } from 'react';
import { useWorkflow } from './hooks/useWorkflow';
import WorkflowCanvas from './components/WorkflowCanvas';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const fileInputRef = useRef(null);
  const {
    nodes,
    rootId,
    addNode,
    deleteNode,
    updateNodeLabel,
    saveWorkflow,
    loadWorkflow,
    resetWorkflow,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflow();

  // Save workflow to JSON file
  const handleSave = useCallback(() => {
    const data = saveWorkflow();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [saveWorkflow]);

  // Load workflow from JSON data
  const handleLoad = useCallback((data) => {
    if (data && data.nodes && data.rootId) {
      if (window.confirm('Loading a workflow will replace your current work. Continue?')) {
        loadWorkflow(data);
      }
    } else {
      alert('Invalid workflow file format.');
    }
  }, [loadWorkflow]);

  // Trigger file input for loading
  const triggerFileLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
      handleSave();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      triggerFileLoad();
    }
  }, [undo, redo, handleSave, triggerFileLoad]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workflow? This will clear all nodes except the Start node.')) {
      resetWorkflow();
    }
  };

  return (
    <div className="app">
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
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
