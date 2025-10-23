import { useState } from 'react';
import { 
  MapIcon, 
  SparklesIcon, 
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function MindMapContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [newNode, setNewNode] = useState({ id: '', label: '', x: 0, y: 0, level: 0 });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMindMap, setGeneratedMindMap] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI mind map generation
    setTimeout(() => {
      const generated = {
        prompt: aiPrompt,
        nodes: [
          { id: '1', label: lesson.title, x: 400, y: 200, level: 0, color: '#3B82F6' },
          { id: '2', label: 'Introduction', x: 200, y: 100, level: 1, color: '#10B981' },
          { id: '3', label: 'Key Concepts', x: 400, y: 100, level: 1, color: '#10B981' },
          { id: '4', label: 'Examples', x: 600, y: 100, level: 1, color: '#10B981' },
          { id: '5', label: 'Summary', x: 400, y: 300, level: 1, color: '#10B981' },
          { id: '6', label: 'Concept A', x: 150, y: 50, level: 2, color: '#F59E0B' },
          { id: '7', label: 'Concept B', x: 250, y: 50, level: 2, color: '#F59E0B' },
          { id: '8', label: 'Example 1', x: 550, y: 50, level: 2, color: '#F59E0B' },
          { id: '9', label: 'Example 2', x: 650, y: 50, level: 2, color: '#F59E0B' }
        ],
        connections: [
          { from: '1', to: '2' },
          { from: '1', to: '3' },
          { from: '1', to: '4' },
          { from: '1', to: '5' },
          { from: '2', to: '6' },
          { from: '2', to: '7' },
          { from: '4', to: '8' },
          { from: '4', to: '9' }
        ],
        timestamp: new Date().toISOString()
      };
      setGeneratedMindMap(generated);
      setIsGenerating(false);
    }, 3000);
  };

  const addNode = () => {
    if (newNode.label.trim()) {
      const node = {
        ...newNode,
        id: Date.now().toString(),
        color: getNodeColor(newNode.level)
      };
      setNodes([...nodes, node]);
      setNewNode({ id: '', label: '', x: 0, y: 0, level: 0 });
    }
  };

  const removeNode = (id) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
  };

  const addConnection = (fromId, toId) => {
    if (fromId !== toId && !connections.find(conn => conn.from === fromId && conn.to === toId)) {
      setConnections([...connections, { from: fromId, to: toId }]);
    }
  };

  const handleNodeDrag = (nodeId, newX, newY) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x: newX, y: newY } : node
    ));
  };

  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e, nodeId) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    handleNodeDrag(nodeId, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (level) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[level % colors.length];
  };

  const handleComplete = () => {
    const content = {
      type: 'mindmap',
      method: activeTab,
      data: {
        nodes: nodes,
        connections: connections,
        generatedMindMap: generatedMindMap,
        nodeCount: nodes.length
      },
      completed: true
    };
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Mind Map</h3>
        <p className="text-sm text-gray-500">
          Generate a visual mind map representing lesson structure, either manually or with AI assistance.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manual'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manual Creation
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ai'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI Generation
          </button>
        </nav>
      </div>

      {/* Manual Creation Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Mind Map Canvas */}
          <div className="border border-gray-200 rounded-lg h-96 bg-gray-50 relative overflow-auto">
            <div className="relative min-w-full min-h-full p-4" style={{ minWidth: '800px', minHeight: '400px' }}>
              {/* Connections (SVG) */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                {connections.map((conn, index) => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={fromNode.x + 50}
                      y1={fromNode.y + 20}
                      x2={toNode.x + 50}
                      y2={toNode.y + 20}
                      stroke="#6B7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                {/* Arrow marker definition */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                  </marker>
                </defs>
              </svg>
              
              {/* Draggable Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute p-3 rounded-lg text-white text-sm font-medium cursor-move hover:shadow-lg transition-all duration-200 border-2 ${
                    selectedNode?.id === node.id ? 'border-yellow-400 shadow-xl' : 'border-transparent'
                  }`}
                  style={{
                    left: node.x,
                    top: node.y,
                    backgroundColor: node.color,
                    minWidth: '120px',
                    textAlign: 'center'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onMouseMove={(e) => handleMouseMove(e, node.id)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{node.label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNode(node.id);
                      }}
                      className="ml-2 text-red-200 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Node</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Node Label
                  </label>
                  <input
                    type="text"
                    value={newNode.label}
                    onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter node label"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X Position
                    </label>
                    <input
                      type="number"
                      value={newNode.x}
                      onChange={(e) => setNewNode({ ...newNode, x: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y Position
                    </label>
                    <input
                      type="number"
                      value={newNode.y}
                      onChange={(e) => setNewNode({ ...newNode, y: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={newNode.level}
                    onChange={(e) => setNewNode({ ...newNode, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={0}>Root (0)</option>
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                </div>
                
                <button
                  onClick={addNode}
                  className="btn-primary flex items-center w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Node
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Nodes ({nodes.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                      <span className="text-sm text-gray-900">{node.label}</span>
                    </div>
                    <button
                      onClick={() => removeNode(node.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Prompt for Mind Map
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the lesson structure you want the AI to create a mind map for..."
            />
          </div>

          <button
            onClick={handleAIGeneration}
            disabled={!aiPrompt.trim() || isGenerating}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Mind Map'}
          </button>

          {isGenerating && (
            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Generating mind map with AI...</span>
            </div>
          )}

          {generatedMindMap && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  AI Mind Map Generated Successfully!
                </span>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Generated Mind Map:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {generatedMindMap.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="p-2 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: node.color }}
                      >
                        {node.label}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      setNodes(generatedMindMap.nodes);
                      setConnections(generatedMindMap.connections);
                      setActiveTab('manual');
                    }}
                    className="btn-primary text-sm"
                  >
                    Use Generated Mind Map
                  </button>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-xs text-blue-700">
                      💡 In a real deployment, this would be an actual AI-generated mind map created by Gemini AI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div>
          {!isFirstStep && (
            <button
              onClick={onPrev}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
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
                Complete Step
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
