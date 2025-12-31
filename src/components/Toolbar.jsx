import { useRef } from 'react';
import './Toolbar.css';

const Toolbar = ({
  onSave,
  onLoad,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const fileInputRef = useRef(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          onLoad(data);
        } catch (error) {
          alert('Invalid workflow file. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
      // Reset input so same file can be loaded again
      e.target.value = '';
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="toolbar-title">
          Workflow Builder
        </h1>
      </div>
      
      <div className="toolbar-center">
        <div className="toolbar-group">
          <button
            className="toolbar-btn undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <span className="btn-icon">↩</span>
            <span className="btn-label">Undo</span>
          </button>
          <button
            className="toolbar-btn redo-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <span className="btn-icon">↪</span>
            <span className="btn-label">Redo</span>
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        <button
          className="toolbar-btn reset-btn"
          onClick={onReset}
          title="Reset workflow"
        >
          <span className="btn-icon">🔄</span>
          <span className="btn-label">Reset</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />
        <button
          className="toolbar-btn load-btn"
          onClick={handleLoadClick}
          title="Load workflow (Ctrl+O)"
        >
          <span className="btn-icon">📂</span>
          <span className="btn-label">Load</span>
        </button>
        <button
          className="toolbar-btn save-btn"
          onClick={onSave}
          title="Save workflow (Ctrl+S)"
        >
          <span className="btn-icon">💾</span>
          <span className="btn-label">Save</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
