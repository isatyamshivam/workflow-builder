// Node Types for the Workflow Builder
export const NODE_TYPES = {
  START: 'start',
  ACTION: 'action',
  BRANCH: 'branch',
  END: 'end',
};

// Default labels for each node type
export const DEFAULT_LABELS = {
  [NODE_TYPES.START]: 'Start',
  [NODE_TYPES.ACTION]: 'Action',
  [NODE_TYPES.BRANCH]: 'Condition',
  [NODE_TYPES.END]: 'End',
};

// Node type configurations
export const NODE_CONFIG = {
  [NODE_TYPES.START]: {
    maxChildren: 1,
    canDelete: false,
    canAddChildren: true,
    color: '#10b981',
    icon: '▶',
  },
  [NODE_TYPES.ACTION]: {
    maxChildren: 1,
    canDelete: true,
    canAddChildren: true,
    color: '#3b82f6',
    icon: '⚡',
  },
  [NODE_TYPES.BRANCH]: {
    maxChildren: Infinity,
    canDelete: true,
    canAddChildren: true,
    branches: ['True', 'False'],
    color: '#f59e0b',
    icon: '◇',
  },
  [NODE_TYPES.END]: {
    maxChildren: 0,
    canDelete: true,
    canAddChildren: false,
    color: '#ef4444',
    icon: '■',
  },
};

// Generate unique ID
export const generateId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new node
export const createNode = (type, label = null, parentId = null, branchLabel = null) => {
  return {
    id: generateId(),
    type,
    label: label || DEFAULT_LABELS[type],
    parentId,
    branchLabel, // For branch children: 'True', 'False', etc.
    children: [],
    position: { x: 0, y: 0 }, // Will be calculated during render
  };
};

// Create initial workflow with just a Start node
export const createInitialWorkflow = () => {
  const startNode = createNode(NODE_TYPES.START, 'Start', null);
  return {
    nodes: { [startNode.id]: startNode },
    rootId: startNode.id,
  };
};
