import './Toolbar.css';

const Toolbar = ({
  onSave,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
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
        <button
          className="toolbar-btn save-btn"
          onClick={onSave}
          title="Save to console"
        >
          <span className="btn-icon">📁</span>
          <span className="btn-label">Save</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
