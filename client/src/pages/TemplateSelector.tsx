import React from 'react';
import { Link } from 'react-router-dom';
import type { ResumeTemplate } from '../types';

// Mock template data
const mockTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for tech and business roles',
    thumbnail: 'https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Modern',
    htmlStructure: '<div>Modern template structure</div>'
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Traditional format ideal for conservative industries',
    thumbnail: 'https://via.placeholder.com/300x400/10B981/FFFFFF?text=Classic',
    htmlStructure: '<div>Classic template structure</div>'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals',
    thumbnail: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Creative',
    htmlStructure: '<div>Creative template structure</div>'
  }
];

const TemplateSelector: React.FC = () => {
  const handleGithubAuth = () => {
    alert('GitHub OAuth integration coming soon!');
  };

  const handleGoogleAuth = () => {
    alert('Google OAuth integration coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">ResumeForge</h1>
              </Link>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleGithubAuth}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={handleGoogleAuth}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-medium">Professional Templates</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Choose Your Resume Template
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select a professional template that matches your style and industry. 
            All templates are ATS-optimized and fully customizable.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:bg-gray-800/70 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-300 mb-6">
                  {template.description}
                </p>
                <div className="flex space-x-3">
                  <Link
                    to={`/builder/${template.id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Use Template
                  </Link>
                  <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-gray-800 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TemplateSelector; 