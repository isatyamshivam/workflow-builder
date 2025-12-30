import { useState, useCallback, useRef } from 'react';
import { createNode, createInitialWorkflow, NODE_TYPES, NODE_CONFIG } from '../types/nodeTypes';

// Maximum history size for undo/redo
const MAX_HISTORY_SIZE = 50;

export const useWorkflow = () => {
  const [workflow, setWorkflow] = useState(createInitialWorkflow);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const isUndoRedoAction = useRef(false);

  // Save current state to history before making changes
  const saveToHistory = useCallback((currentWorkflow) => {
    if (!isUndoRedoAction.current) {
      setHistory((prev) => {
        const newHistory = [...prev, JSON.parse(JSON.stringify(currentWorkflow))];
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(-MAX_HISTORY_SIZE);
        }
        return newHistory;
      });
      setFuture([]);
    }
  }, []);

  // Undo last action
  const undo = useCallback(() => {
    if (history.length === 0) return;
    
    isUndoRedoAction.current = true;
    const previousState = history[history.length - 1];
    
    setFuture((prev) => [JSON.parse(JSON.stringify(workflow)), ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setWorkflow(previousState);
    
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 0);
  }, [history, workflow]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    isUndoRedoAction.current = true;
    const nextState = future[0];
    
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(workflow))]);
    setFuture((prev) => prev.slice(1));
    setWorkflow(nextState);
    
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 0);
  }, [future, workflow]);

  // Add a new node after a parent node
  const addNode = useCallback((parentId, nodeType, branchLabel = null) => {
    setWorkflow((prev) => {
      saveToHistory(prev);
      
      const parentNode = prev.nodes[parentId];
      if (!parentNode) return prev;

      const config = NODE_CONFIG[parentNode.type];
      
      // Check if parent can have more children
      if (parentNode.type !== NODE_TYPES.BRANCH && parentNode.children.length >= config.maxChildren) {
        return prev;
      }

      // Create the new node
      const newNode = createNode(nodeType, null, parentId, branchLabel);
      
      // For non-branch nodes, if there's already a child, insert between parent and child
      let updatedNodes = { ...prev.nodes };
      
      if (parentNode.type !== NODE_TYPES.BRANCH && parentNode.children.length === 1) {
        // Insert new node between parent and existing child
        const existingChildId = parentNode.children[0];
        const existingChild = prev.nodes[existingChildId];
        
        // New node takes the child
        newNode.children = [existingChildId];
        
        // Update existing child's parent
        updatedNodes[existingChildId] = {
          ...existingChild,
          parentId: newNode.id,
        };
        
        // Parent now points to new node
        updatedNodes[parentId] = {
          ...parentNode,
          children: [newNode.id],
        };
      } else {
        // Simply add as a new child
        updatedNodes[parentId] = {
          ...parentNode,
          children: [...parentNode.children, newNode.id],
        };
      }

      updatedNodes[newNode.id] = newNode;

      return {
        ...prev,
        nodes: updatedNodes,
      };
    });
  }, [saveToHistory]);

  // Delete a node and reconnect children to parent
  const deleteNode = useCallback((nodeId) => {
    setWorkflow((prev) => {
      const node = prev.nodes[nodeId];
      if (!node || !NODE_CONFIG[node.type].canDelete) return prev;

      saveToHistory(prev);

      const parentNode = prev.nodes[node.parentId];
      let updatedNodes = { ...prev.nodes };

      if (parentNode) {
        // Remove node from parent's children
        const nodeIndex = parentNode.children.indexOf(nodeId);
        let newParentChildren = parentNode.children.filter((id) => id !== nodeId);

        // For non-branch parents, connect deleted node's children to parent
        if (parentNode.type !== NODE_TYPES.BRANCH && node.children.length > 0) {
          // Insert children at the same position
          newParentChildren.splice(nodeIndex, 0, ...node.children);
          
          // Update children's parentId
          node.children.forEach((childId) => {
            updatedNodes[childId] = {
              ...updatedNodes[childId],
              parentId: parentNode.id,
              branchLabel: node.branchLabel,
            };
          });
        } else if (parentNode.type === NODE_TYPES.BRANCH) {
          // For branch parents, reconnect first child if exists
          if (node.children.length > 0) {
            const firstChildId = node.children[0];
            newParentChildren.splice(nodeIndex, 0, firstChildId);
            updatedNodes[firstChildId] = {
              ...updatedNodes[firstChildId],
              parentId: parentNode.id,
              branchLabel: node.branchLabel,
            };
          }
        }

        updatedNodes[parentNode.id] = {
          ...parentNode,
          children: newParentChildren,
        };
      }

      // Remove the node
      delete updatedNodes[nodeId];

      return {
        ...prev,
        nodes: updatedNodes,
      };
    });
  }, [saveToHistory]);

  // Update node label
  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    setWorkflow((prev) => {
      const node = prev.nodes[nodeId];
      if (!node) return prev;

      saveToHistory(prev);

      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [nodeId]: {
            ...node,
            label: newLabel,
          },
        },
      };
    });
  }, [saveToHistory]);

  // Get node by ID
  const getNode = useCallback((nodeId) => {
    return workflow.nodes[nodeId];
  }, [workflow]);

  // Get all nodes as array
  const getAllNodes = useCallback(() => {
    return Object.values(workflow.nodes);
  }, [workflow]);

  // Get root node
  const getRootNode = useCallback(() => {
    return workflow.nodes[workflow.rootId];
  }, [workflow]);

  // Save workflow to console (for debugging/export)
  const saveWorkflow = useCallback(() => {
    console.log('=== Workflow Data Structure ===');
    console.log(JSON.stringify(workflow, null, 2));
    return workflow;
  }, [workflow]);

  // Load workflow from data
  const loadWorkflow = useCallback((data) => {
    if (data && data.nodes && data.rootId) {
      saveToHistory(workflow);
      setWorkflow(data);
    }
  }, [workflow, saveToHistory]);

  // Reset to initial state
  const resetWorkflow = useCallback(() => {
    saveToHistory(workflow);
    setWorkflow(createInitialWorkflow());
  }, [workflow, saveToHistory]);

  return {
    workflow,
    nodes: workflow.nodes,
    rootId: workflow.rootId,
    addNode,
    deleteNode,
    updateNodeLabel,
    getNode,
    getAllNodes,
    getRootNode,
    saveWorkflow,
    loadWorkflow,
    resetWorkflow,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
};
