import { useState, useRef } from 'react';
import { 
  PhotoIcon,
  ArrowUpTrayIcon as UploadIcon,
  ArrowDownTrayIcon as DownloadIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function ImageContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      setIsCompleted(true);
    }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI image generation
    setTimeout(() => {
      const newImages = [
        {
          id: `img_${Date.now()}`,
          url: `https://via.placeholder.com/600x400?text=${encodeURIComponent(aiPrompt)}`,
          prompt: aiPrompt,
          generated: true
        }
      ];
      setGeneratedImages(prev => [...prev, ...newImages]);
      setIsGenerating(false);
      setIsCompleted(true);
    }, 2000);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveGenerated = (id) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleComplete = () => {
    const content = {
      type: 'images',
      method: activeTab,
      data: activeTab === 'upload' ? {
        files: uploadedFiles,
        count: uploadedFiles.length
      } : {
        prompt: aiPrompt,
        generated: generatedImages,
        count: generatedImages.length
      },
      completed: true
    };
    
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Images & Visuals Creation</h3>
        <p className="text-sm text-gray-600">
          Add illustrative images and diagrams to your lesson. Choose between manual upload or AI generation.
        </p>
      </div>

      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              activeTab === 'upload'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Manual Upload
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
        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload images
                  </span>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Images ({uploadedFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the images you want to generate
              </label>
              <textarea
                id="ai-prompt"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Example: Create diagrams showing JavaScript variable types, data flow charts, and code structure illustrations..."
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
                  Generating Images...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate AI Images
                </>
              )}
            </button>
            
            {generatedImages.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    AI Images Generated Successfully! ({generatedImages.length})
                  </span>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Generated Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveGenerated(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{image.prompt}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-xs text-blue-700">
                      💡 In a real deployment, these would be actual AI-generated images created by Gemini AI.
                    </p>
                  </div>
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

