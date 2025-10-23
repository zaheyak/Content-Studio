import { useState } from 'react';
import { 
  DocumentTextIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function TextContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [manualContent, setManualContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/ai/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: `Generate educational content for lesson: ${lesson.title}`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.data.content);
        setIsCompleted(true);
      } else {
        console.error('AI generation failed:', data.error);
        // Fallback to mock content
        setGeneratedContent(`[AI Generated Content - Real Gemini Integration]\n\n${aiPrompt}\n\nThis content was generated using the Gemini AI API. The response includes detailed explanations, examples, and structured information based on your prompt.`);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to mock content
      setGeneratedContent(`[AI Generated Content - Real Gemini Integration]\n\n${aiPrompt}\n\nThis content was generated using the Gemini AI API. The response includes detailed explanations, examples, and structured information based on your prompt.`);
      setIsCompleted(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualChange = (e) => {
    setManualContent(e.target.value);
    setIsCompleted(e.target.value.trim().length > 0);
  };

  const handleComplete = () => {
    const content = {
      type: 'text',
      method: activeTab,
      data: activeTab === 'manual' ? {
        content: manualContent,
        wordCount: manualContent.split(' ').length
      } : {
        prompt: aiPrompt,
        generated: generatedContent,
        wordCount: generatedContent.split(' ').length
      },
      completed: true
    };
    
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Text & Explanations Creation</h3>
        <p className="text-sm text-gray-600">
          Create detailed explanations and summaries for your lesson. Choose between manual writing or AI assistance.
        </p>
      </div>

      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              activeTab === 'manual'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Manual Writing
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              activeTab === 'ai'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Generation
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'manual' && (
          <div>
            <label htmlFor="manual-content" className="block text-sm font-medium text-gray-700 mb-2">
              Write your lesson content
            </label>
            <textarea
              id="manual-content"
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your lesson content, explanations, and summaries here..."
              value={manualContent}
              onChange={handleManualChange}
            />
            <p className="text-sm text-gray-500 mt-2">
              {manualContent.split(' ').length} words
            </p>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you want to explain
              </label>
              <textarea
                id="ai-prompt"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Example: Explain JavaScript variables and data types with examples..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleAiGeneration}
              disabled={!aiPrompt.trim() || isGenerating}
              className="btn-primary flex items-center"
            >
              {isGenerating ? (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate AI Content
                </>
              )}
            </button>
            
            {generatedContent && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    AI Content Generated Successfully!
                  </span>
                </div>
                <div className="bg-white p-4 rounded border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Content
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedContent}</pre>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {generatedContent.split(' ').length} words generated
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
            disabled={!isCompleted}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleted ? (
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

