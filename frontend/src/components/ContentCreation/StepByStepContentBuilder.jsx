import { useState } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ArrowRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  MapIcon,
  CodeBracketIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import VideoContentCreation from './VideoContentCreation';
import TextContentCreation from './TextContentCreation';
import PresentationContentCreation from './PresentationContentCreation';
import MindMapContentCreation from './MindMapContentCreation';
import InteractiveMindMap from './InteractiveMindMap';
import CodeContentCreation from './CodeContentCreation';
import ImageContentCreation from './ImageContentCreation';
import ContentFormatsView from './ContentFormatsView';

export default function StepByStepContentBuilder({ isOpen, onClose, onSuccess, lesson, course }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [contentData, setContentData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormatsView, setShowFormatsView] = useState(false);

  const steps = [
    {
      id: 'video',
      name: 'Video Content',
      icon: VideoCameraIcon,
      description: 'Add video content with AI assistance or manual upload',
      required: true
    },
    {
      id: 'text',
      name: 'Text & Explanations',
      icon: DocumentTextIcon,
      description: 'Create detailed explanations and summaries',
      required: true
    },
    {
      id: 'presentation',
      name: 'Presentation Slides',
      icon: PresentationChartBarIcon,
      description: 'Build slides with AI or manual creation',
      required: true
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: MapIcon,
      description: 'Create visual mind maps of lesson concepts',
      required: true
    },
    {
      id: 'code',
      name: 'Code Snippets',
      icon: CodeBracketIcon,
      description: 'Add code examples and explanations',
      required: true
    },
    {
      id: 'images',
      name: 'Images & Visuals',
      icon: PhotoIcon,
      description: 'Include illustrative images and diagrams',
      required: true
    }
  ];

  const handleStepComplete = (stepId, content) => {
    setContentData(prev => ({
      ...prev,
      [stepId]: content
    }));
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleEditFormat = (formatKey) => {
    const stepIndex = steps.findIndex(step => step.id === formatKey);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setShowFormatsView(false);
    }
  };

  const handleBackToFormats = () => {
    setShowFormatsView(true);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (completedSteps.size < steps.length) {
      alert(`Please complete all required content formats. Missing: ${steps.length - completedSteps.size} formats.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate saving all content
      const updatedLesson = {
        ...lesson,
        content_data: {
          ...lesson.content_data,
          contentFormats: {
            video: { completed: true, required: true, data: contentData.video },
            text: { completed: true, required: true, data: contentData.text },
            presentation: { completed: true, required: true, data: contentData.presentation },
            mindmap: { completed: true, required: true, data: contentData.mindmap },
            code: { completed: true, required: true, data: contentData.code },
            images: { completed: true, required: true, data: contentData.images }
          },
          completionStatus: 'COMPLETED',
          allFormatsCompleted: true
        },
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      };

      setTimeout(() => {
        onSuccess(updatedLesson);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving content:', error);
      setIsSubmitting(false);
    }
  };

  const getCurrentStepComponent = () => {
    const step = steps[currentStep];
    const commonProps = {
      lesson,
      course,
      onComplete: (content) => handleStepComplete(step.id, content),
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === steps.length - 1
    };

        switch (step.id) {
          case 'video':
            return <VideoContentCreation {...commonProps} />;
          case 'text':
            return <TextContentCreation {...commonProps} />;
          case 'presentation':
            return <PresentationContentCreation {...commonProps} />;
          case 'mindmap':
            return <InteractiveMindMap {...commonProps} />;
          case 'code':
            return <CodeContentCreation {...commonProps} />;
          case 'images':
            return <ImageContentCreation {...commonProps} />;
          default:
            return null;
        }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
            <span className="text-sm text-gray-500">
              {completedSteps.size} of {steps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = index === currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent 
                        ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{step.name}</span>
                    {isCompleted && <CheckCircleIcon className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="h-full">
            {showFormatsView ? (
              <ContentFormatsView
                lesson={lesson}
                onEditFormat={handleEditFormat}
                onComplete={handleBackToFormats}
              />
            ) : (
              getCurrentStepComponent()
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => setShowFormatsView(!showFormatsView)}
                className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100"
              >
                {showFormatsView ? 'Back to Step' : 'View All Formats'}
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!completedSteps.has(steps[currentStep].id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next Step
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={completedSteps.size < steps.length || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? 'Finishing...' : 'Complete Lesson'}
                  <CheckCircleIcon className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


