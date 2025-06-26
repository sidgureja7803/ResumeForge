import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const handleGithubAuth = () => {
    // Placeholder for GitHub OAuth
    alert('GitHub OAuth integration coming soon!');
  };

  const handleGoogleAuth = () => {
    // Placeholder for Google OAuth
    alert('Google OAuth integration coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">ResumeForge</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </nav>
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
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-y border-gray-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xl font-semibold">2,847</span>
              <span className="text-gray-300">GitHub Stars</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-white text-xl font-semibold">15,234</span>
              <span className="text-gray-300">Happy Users</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white text-xl font-semibold">45,612</span>
              <span className="text-gray-300">Resumes Created</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-medium">⭐ Build beautiful resumes in minutes</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Craft a <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">professional resume</span> that lands interviews
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
            Our intuitive resume builder helps you create a perfectly formatted, ATS-friendly resume that showcases your skills and experience.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/templates"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Your Resume →
            </Link>
            <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Star on GitHub</span>
            </button>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-20">
          <p className="text-center text-gray-400 mb-8">Create resumes that help you land jobs at top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-3xl font-bold text-yellow-400">Amazon</div>
            <div className="text-3xl font-bold text-blue-400">META</div>
            <div className="text-3xl font-bold text-red-400">NETFLIX</div>
            <div className="text-3xl font-bold text-blue-300">IBM</div>
            <div className="text-3xl font-bold text-cyan-400">Salesforce</div>
            <div className="text-3xl font-bold text-white">Google</div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
              <span className="text-purple-300 text-sm font-medium">Powerful Features</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-4">
              Everything you need to create the perfect resume
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our resume builder combines beautiful design with powerful features to help you create a resume that stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Easy Customization</h4>
              <p className="text-gray-300">Customize every aspect of your resume with our intuitive, drag-and-drop editor.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Real-time Preview</h4>
              <p className="text-gray-300">See changes to your resume in real-time as you make them.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Multiple Formats</h4>
              <p className="text-gray-300">Export your resume in PDF, DOCX, or TXT formats for different application requirements.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">ATS Optimization</h4>
              <p className="text-gray-300">Our templates are designed to pass Applicant Tracking Systems with ease.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">AI Suggestions</h4>
              <p className="text-gray-300">Get smart content suggestions to improve your resume and stand out.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:bg-gray-800/70 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Professional Templates</h4>
              <p className="text-gray-300">Choose from a variety of ATS-friendly resume templates designed by professionals.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
              <span className="text-purple-300 text-sm font-medium">Simple Process</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-4">
              Three steps to your perfect resume
            </h3>
            <p className="text-xl text-gray-300">
              Creating a professional resume has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 text-center">
              <div className="text-6xl font-bold text-purple-500 mb-4">01</div>
              <h4 className="text-xl font-semibold text-white mb-4">Choose a Template</h4>
              <p className="text-gray-300">Select from our professionally designed templates that are optimized for ATS systems.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 text-center">
              <div className="text-6xl font-bold text-pink-500 mb-4">02</div>
              <h4 className="text-xl font-semibold text-white mb-4">Add Your Content</h4>
              <p className="text-gray-300">Fill in your information using our intuitive editor with helpful suggestions.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 text-center">
              <div className="text-6xl font-bold text-cyan-500 mb-4">03</div>
              <h4 className="text-xl font-semibold text-white mb-4">Download & Apply</h4>
              <p className="text-gray-300">Export your resume in your preferred format and start applying for jobs immediately.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 