import { useState, useRef, useEffect } from 'react';
import { NODE_TYPES, NODE_CONFIG } from '../types/nodeTypes';
import './WorkflowNode.css';

const WorkflowNode = ({
  node,
  onAddNode,
  onDeleteNode,
  onUpdateLabel,
  isRoot = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeBranch, setActiveBranch] = useState(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  const config = NODE_CONFIG[node.type];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false);
        setActiveBranch(null);
      }
    };

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  const handleLabelClick = () => {
    setIsEditing(true);
    setEditValue(node.label);
  };

  const handleLabelChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== node.label) {
      onUpdateLabel(node.id, editValue.trim());
    } else {
      setEditValue(node.label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(node.label);
    }
  };

  const handleAddClick = (branchLabel = null) => {
    setActiveBranch(branchLabel);
    setShowAddMenu(true);
  };

  const handleNodeTypeSelect = (type) => {
    onAddNode(node.id, type, activeBranch);
    setShowAddMenu(false);
    setActiveBranch(null);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (config.canDelete) {
      onDeleteNode(node.id);
    }
  };

  const canAddChildren = config.canAddChildren;
  const isBranch = node.type === NODE_TYPES.BRANCH;

  return (
    <div className={`workflow-node node-type-${node.type}`}>
      <div
        className="node-card"
        style={{ '--node-color': config.color }}
      >
        <div className="node-header">
          <span className="node-icon">{config.icon}</span>
          <span className="node-type-label">{node.type.toUpperCase()}</span>
          {config.canDelete && (
            <button
              className="node-delete-btn"
              onClick={handleDelete}
              title="Delete node"
            >
              ×
            </button>
          )}
        </div>

        <div className="node-body">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="node-label-input"
              value={editValue}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <div
              className="node-label"
              onClick={handleLabelClick}
              title="Click to edit"
            >
              {node.label}
            </div>
          )}
        </div>

        {node.branchLabel && (
          <div className="branch-label-badge">
            {node.branchLabel}
          </div>
        )}
      </div>

      {/* Connection point and add button for non-branch nodes */}
      {canAddChildren && !isBranch && (
        <div className="node-connection-container">
          <div className="connection-line"></div>
          <button
            className="add-node-btn"
            onClick={() => handleAddClick(null)}
            title="Add node"
          >
            +
          </button>
        </div>
      )}

      {/* Branch connections */}
      {isBranch && (
        <div className="branch-connections">
          {config.branches.map((branchLabel, index) => (
            <div key={branchLabel} className="branch-connection">
              <div className="branch-line-container">
                <div className="branch-line"></div>
                <span className="branch-line-label">{branchLabel}</span>
              </div>
              <button
                className="add-node-btn branch-add-btn"
                onClick={() => handleAddClick(branchLabel)}
                title={`Add to ${branchLabel} branch`}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add node menu */}
      {showAddMenu && (
        <div className="add-node-menu" ref={menuRef}>
          <div className="menu-header">Add Node</div>
          <button
            className="menu-item action-item"
            onClick={() => handleNodeTypeSelect(NODE_TYPES.ACTION)}
          >
            <span className="menu-icon">⚡</span>
            <span>Action</span>
          </button>
          <button
            className="menu-item branch-item"
            onClick={() => handleNodeTypeSelect(NODE_TYPES.BRANCH)}
          >
            <span className="menu-icon">◇</span>
            <span>Branch (Condition)</span>
          </button>
          <button
            className="menu-item end-item"
            onClick={() => handleNodeTypeSelect(NODE_TYPES.END)}
          >
            <span className="menu-icon">■</span>
            <span>End</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;
