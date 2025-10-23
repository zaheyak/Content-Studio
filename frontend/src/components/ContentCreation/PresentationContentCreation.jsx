import { useState } from 'react';
import { 
  PresentationChartBarIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function PresentationContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI slide generation
    setTimeout(() => {
      const slides = [
        { id: 1, title: 'Introduction', content: 'Welcome to this lesson', notes: 'Start with enthusiasm' },
        { id: 2, title: 'Key Concepts', content: 'Main learning points', notes: 'Focus on understanding' },
        { id: 3, title: 'Examples', content: 'Practical examples', notes: 'Show real applications' },
        { id: 4, title: 'Summary', content: 'Key takeaways', notes: 'Reinforce learning' }
      ];
      setGeneratedSlides(slides);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handleComplete = () => {
    const content = {
      type: 'presentation',
      method: activeTab,
      data: {
        prompt: aiPrompt,
        slides: generatedSlides,
        slideCount: generatedSlides.length
      },
      completed: true
    };
    
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Presentation Slides Creation</h3>
        <p className="text-sm text-gray-600">
          Create presentation slides for your lesson. AI can generate slides automatically based on your content.
        </p>
      </div>

      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
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
        <div>
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe the presentation content you want to generate
          </label>
          <textarea
            id="ai-prompt"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Example: Create slides explaining JavaScript fundamentals, including variables, functions, and data types..."
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
              Generating Slides...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate AI Slides
            </>
          )}
        </button>
        
        {generatedSlides.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-3">
              <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                AI Slides Generated Successfully! ({generatedSlides.length})
              </span>
            </div>
            <div className="bg-white p-4 rounded border">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Generated Slides</h4>
              <div className="space-y-4">
                {generatedSlides.map((slide) => (
                  <div key={slide.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{slide.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{slide.content}</p>
                        <p className="text-xs text-gray-500 mt-2">Notes: {slide.notes}</p>
                      </div>
                      <span className="text-xs text-gray-400">Slide {slide.id}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-xs text-blue-700">
                  💡 In a real deployment, these would be actual AI-generated presentation slides created by Gemini AI.
                </p>
              </div>
            </div>
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

