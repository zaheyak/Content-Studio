import { useState, useRef } from 'react';
import { 
  PlayIcon, 
  ArrowUpTrayIcon as UploadIcon, 
  MicrophoneIcon,
  VideoCameraIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function VideoContentCreation({ lesson, course, onComplete, onNext, onPrev, isFirstStep, isLastStep }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Simulate transcription
      setIsTranscribing(true);
      setTimeout(() => {
        setTranscription(`Transcription of ${file.name}:\n\n[This is a simulated transcription. In a real application, this would be processed by an AI transcription service.]`);
        setIsTranscribing(false);
        setIsCompleted(true);
      }, 2000);
    }
  };

  const handleAvatarGeneration = async () => {
    if (!avatarPrompt.trim()) return;
    
    setIsGeneratingAvatar(true);
    
    // Simulate AI avatar video generation
    setTimeout(() => {
      setGeneratedContent({
        type: 'avatar',
        prompt: avatarPrompt,
        duration: '2:30',
        status: 'generated',
        url: 'https://example.com/avatar-video.mp4'
      });
      setIsGeneratingAvatar(false);
      setIsCompleted(true);
    }, 3000);
  };

  const handleYouTubeUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setGeneratedContent({
        type: 'youtube',
        url: url,
        status: 'linked'
      });
      setIsCompleted(true);
    }
  };

  const handleComplete = () => {
    const content = {
      type: 'video',
      method: activeTab,
      data: activeTab === 'upload' ? {
        file: uploadedFile,
        transcription: transcription
      } : activeTab === 'avatar' ? {
        prompt: avatarPrompt,
        generated: generatedContent
      } : {
        url: generatedContent?.url,
        type: 'youtube'
      },
      completed: true
    };
    
    onComplete(content);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Video Content Creation</h3>
        <p className="text-sm text-gray-600">
          Add video content to your lesson. Choose between AI-assisted creation or manual upload.
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
            onClick={() => setActiveTab('avatar')}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              activeTab === 'avatar'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Avatar
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              activeTab === 'youtube'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            YouTube Link
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload video file
                  </span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            </div>
            
            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <VideoCameraIcon className="h-8 w-8 text-primary-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {isTranscribing && (
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <MicrophoneIcon className="h-4 w-4 mr-2 animate-pulse" />
                    Transcribing video...
                  </div>
                )}
                
                {transcription && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Transcription:</h4>
                    <div className="bg-white p-3 rounded border text-sm text-gray-700 max-h-32 overflow-y-auto">
                      {transcription}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="avatar-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the video content you want to generate
              </label>
              <textarea
                id="avatar-prompt"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Example: Explain JavaScript variables and data types with examples..."
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleAvatarGeneration}
              disabled={!avatarPrompt.trim() || isGeneratingAvatar}
              className="btn-primary flex items-center"
            >
              {isGeneratingAvatar ? (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2 animate-spin" />
                  Generating Avatar Video...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate AI Avatar Video
                </>
              )}
            </button>
            
            {generatedContent && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    AI Avatar Video Generated Successfully!
                  </span>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>Prompt:</strong> {generatedContent.prompt}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Duration:</strong> {generatedContent.duration}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Status:</strong> {generatedContent.status}
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-xs text-blue-700">
                      💡 In a real deployment, this would be an actual AI-generated avatar video created by Gemini AI.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                id="youtube-url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => handleYouTubeUrl(e.target.value)}
              />
            </div>
            
            {generatedContent && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <PlayIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    YouTube video linked successfully!
                  </span>
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

