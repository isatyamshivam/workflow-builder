import WorkflowNode from './WorkflowNode';
import { NODE_TYPES, NODE_CONFIG } from '../types/nodeTypes';
import './WorkflowCanvas.css';

// Helper function to group children by branch label
const groupChildrenByBranch = (node, nodes, config) => {
  if (node.type !== NODE_TYPES.BRANCH) return null;
  
  const groups = {};
  config.branches.forEach((branch) => {
    groups[branch] = [];
  });

  node.children.forEach((childId) => {
    const child = nodes[childId];
    if (child && child.branchLabel && groups[child.branchLabel]) {
      groups[child.branchLabel].push(childId);
    }
  });

  return groups;
};

const WorkflowCanvas = ({
  nodes,
  rootId,
  onAddNode,
  onDeleteNode,
  onUpdateLabel,
}) => {
  // Recursively render the node tree
  const renderNodeTree = (nodeId, depth = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isBranch = node.type === NODE_TYPES.BRANCH;
    const config = NODE_CONFIG[node.type];

    // Group children by branch label for branch nodes
    const groupedChildren = groupChildrenByBranch(node, nodes, config);

    return (
      <div className="node-tree-item" key={nodeId}>
        <WorkflowNode
          node={node}
          onAddNode={onAddNode}
          onDeleteNode={onDeleteNode}
          onUpdateLabel={onUpdateLabel}
          isRoot={node.id === rootId}
        />

        {/* Render children */}
        {!isBranch && node.children.length > 0 && (
          <div className="children-container">
            {node.children.map((childId) => renderNodeTree(childId, depth + 1))}
          </div>
        )}

        {/* Render branch children */}
        {isBranch && groupedChildren && (
          <div className="branch-children-container">
            {config.branches.map((branchLabel) => (
              <div key={branchLabel} className="branch-group">
                {groupedChildren[branchLabel].map((childId) => 
                  renderNodeTree(childId, depth + 1)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="workflow-canvas">
      <div className="canvas-content">
        {rootId && renderNodeTree(rootId)}
      </div>
    </div>
  );
};

export default WorkflowCanvas;
