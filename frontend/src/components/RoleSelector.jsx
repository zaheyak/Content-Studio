import React from 'react';
import { UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const RoleSelector = ({ onRoleSelect }) => {
  const handleRoleSelect = (role) => {
    // Mock user data based on role
    const mockUsers = {
      TRAINER: {
        id: 'trainer_1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@contentstudio.com',
        role: 'TRAINER',
        profile: {
          avatar: '/api/placeholder/100/100',
          bio: 'Educational Technology Specialist with 10+ years of experience in content creation and curriculum design.',
          expertise: ['Educational Technology', 'Content Creation', 'Curriculum Design'],
          stats: {
            coursesCreated: 15,
            studentsTaught: 1200,
            contentItems: 450
          }
        }
      },
      LEARNER: {
        id: 'learner_1',
        name: 'Alex Chen',
        email: 'alex.chen@student.com',
        role: 'LEARNER',
        profile: {
          avatar: '/api/placeholder/100/100',
          bio: 'Computer Science student passionate about learning new technologies and programming languages.',
          interests: ['Programming', 'Web Development', 'Data Science'],
          stats: {
            coursesEnrolled: 8,
            lessonsCompleted: 45,
            certificatesEarned: 3
          }
        }
      }
    };

    onRoleSelect(mockUsers[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Content Studio
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered educational content creation platform
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trainer Card */}
          <div 
            onClick={() => handleRoleSelect('TRAINER')}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6">
                <UserIcon className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Trainer Dashboard
              </h2>
              
              <p className="text-gray-600 mb-6">
                Create courses, design lessons, and generate AI-powered educational content. 
                Build comprehensive learning experiences with multiple content formats.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Create and manage courses
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Generate AI content (text, slides, mind maps)
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Interactive lesson creation
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Content format management
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Enter as Trainer
                </button>
              </div>
            </div>
          </div>

          {/* Learner Card */}
          <div 
            onClick={() => handleRoleSelect('LEARNER')}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-6">
                <AcademicCapIcon className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Learner Dashboard
              </h2>
              
              <p className="text-gray-600 mb-6">
                Browse courses, access lessons, and interact with educational content. 
                Learn from AI-generated materials and track your progress.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Browse available courses
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Access interactive lessons
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  View multiple content formats
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Track learning progress
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Enter as Learner
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Select your role to access the appropriate dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
