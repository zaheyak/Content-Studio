import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function InteractiveMindMap({ 
  lesson, 
  course, 
  onComplete, 
  onNext, 
  onPrev, 
  isFirstStep, 
  isLastStep 
}) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const nodeIdCounter = useRef(1);

  // Initialize with lesson data if available
  useEffect(() => {
    if (lesson?.content_data?.mindmap) {
      setNodes(lesson.content_data.mindmap.nodes || []);
      setConnections(lesson.content_data.mindmap.connections || []);
    }
  }, [lesson]);

  const getNodeColor = (level) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#8B5CF6'];
    return colors[level % colors.length];
  };

  const addNode = useCallback((x, y, level = 0) => {
    const newNode = {
      id: `node_${nodeIdCounter.current++}`,
      label: 'New Node',
      x: (x - pan.x) / zoom,
      y: (y - pan.y) / zoom,
      level,
      color: getNodeColor(level),
      isEditing: true
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    setEditText('New Node');
    setIsEditing(true);
  }, [pan, zoom]);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const addConnection = useCallback((fromId, toId) => {
    if (fromId !== toId && !connections.find(conn => 
      conn.from === fromId && conn.to === toId
    )) {
      setConnections(prev => [...prev, { from: fromId, to: toId }]);
    }
  }, [connections]);

  const removeConnection = useCallback((fromId, toId) => {
    setConnections(prev => prev.filter(conn => 
      !(conn.from === fromId && conn.to === toId)
    ));
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (isEditing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on empty space
    const clickedNode = nodes.find(node => {
      const nodeX = node.x * zoom + pan.x;
      const nodeY = node.y * zoom + pan.y;
      return Math.abs(x - nodeX) < 60 && Math.abs(y - nodeY) < 30;
    });
    
    if (!clickedNode) {
      addNode(x, y);
    }
  }, [isEditing, nodes, zoom, pan, addNode]);

  const handleNodeClick = useCallback((e, node) => {
    e.stopPropagation();
    setSelectedNode(node);
    setEditText(node.label);
    setIsEditing(true);
  }, []);

  const handleNodeDrag = useCallback((e, nodeId) => {
    if (isEditing) return;
    
    e.preventDefault();
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [isEditing]);

  const handleNodeDragMove = useCallback((e, nodeId) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left - pan.x) / zoom;
    const newY = (e.clientY - rect.top - pan.y) / zoom;
    
    updateNode(nodeId, { x: newX, y: newY });
  }, [isDragging, pan, zoom, updateNode]);

  const handleNodeDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasPan = useCallback((e) => {
    if (isDragging || isEditing) return;
    
    if (e.type === 'mousedown') {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (e.type === 'mousemove' && isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (e.type === 'mouseup') {
      setIsPanning(false);
    }
  }, [isDragging, isEditing, isPanning, lastPanPoint]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  }, []);

  const handleEditSubmit = useCallback(() => {
    if (selectedNode && editText.trim()) {
      updateNode(selectedNode.id, { 
        label: editText.trim(),
        isEditing: false 
      });
      setSelectedNode(prev => ({ ...prev, label: editText.trim() }));
    }
    setIsEditing(false);
  }, [selectedNode, editText, updateNode]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditText('');
  }, []);

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/ai/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: `Generate a mind map for lesson: ${lesson.title}`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNodes(data.data.nodes);
        setConnections(data.data.connections);
      } else {
        console.error('AI generation failed:', data.error);
        // Fallback to mock mind map
        const mockMindMap = {
          nodes: [
            { id: '1', label: lesson.title, x: 400, y: 200, level: 0, color: '#3B82F6' },
            { id: '2', label: 'Introduction', x: 200, y: 100, level: 1, color: '#10B981' },
            { id: '3', label: 'Key Concepts', x: 400, y: 100, level: 1, color: '#10B981' },
            { id: '4', label: 'Examples', x: 600, y: 100, level: 1, color: '#10B981' },
            { id: '5', label: 'Summary', x: 400, y: 300, level: 1, color: '#10B981' }
          ],
          connections: [
            { from: '1', to: '2' },
            { from: '1', to: '3' },
            { from: '1', to: '4' },
            { from: '1', to: '5' }
          ]
        };
        setNodes(mockMindMap.nodes);
        setConnections(mockMindMap.connections);
      }
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    const content = {
      type: 'mindmap',
      method: 'interactive',
      data: {
        nodes,
        connections,
        nodeCount: nodes.length,
        connectionCount: connections.length
      },
      completed: nodes.length > 0
    };
    
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Mind Map</h3>
        <p className="text-sm text-gray-600">
          Create a visual mind map by clicking to add nodes, dragging to move them, and connecting related concepts.
        </p>
      </div>

      {/* AI Generation Section */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI-Generated Mind Map
            </label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the mind map structure you want to generate..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAIGeneration}
            disabled={!aiPrompt.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isGenerating ? (
              <>
                <SparklesIcon className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative border border-gray-200 rounded-lg h-96 bg-gray-50 overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasPan}
          onMouseMove={handleCanvasPan}
          onMouseUp={handleCanvasPan}
          onWheel={handleWheel}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
              </marker>
            </defs>
            {connections.map((conn, index) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              
              const fromX = fromNode.x * zoom + pan.x;
              const fromY = fromNode.y * zoom + pan.y;
              const toX = toNode.x * zoom + pan.x;
              const toY = toNode.y * zoom + pan.y;
              
              return (
                <line
                  key={index}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#6B7280"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute p-3 rounded-lg text-white text-sm font-medium cursor-move hover:shadow-lg transition-all duration-200 border-2 ${
                selectedNode?.id === node.id ? 'border-yellow-400 shadow-xl' : 'border-transparent'
              }`}
              style={{
                left: node.x * zoom + pan.x - 60,
                top: node.y * zoom + pan.y - 15,
                backgroundColor: node.color,
                minWidth: '120px',
                textAlign: 'center',
                transform: `scale(${zoom})`
              }}
              onClick={(e) => handleNodeClick(e, node)}
              onMouseDown={(e) => handleNodeDrag(e, node.id)}
              onMouseMove={(e) => handleNodeDragMove(e, node.id)}
              onMouseUp={handleNodeDragEnd}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{node.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="ml-2 text-red-200 hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Zoom and Pan Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            +
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            -
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Node Editing Modal */}
      {isEditing && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Node</h3>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 flex items-center justify-center"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How to use:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click on empty space to add a new node</li>
          <li>• Click on a node to edit its text</li>
          <li>• Drag nodes to move them around</li>
          <li>• Use mouse wheel to zoom in/out</li>
          <li>• Drag empty space to pan the view</li>
          <li>• Use AI generation to create structured mind maps</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div>
          {!isFirstStep && (
            <button
              onClick={onPrev}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleComplete}
            disabled={nodes.length === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nodes.length > 0 ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Complete Step ({nodes.length} nodes)
              </>
            ) : (
              'Complete Step'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


