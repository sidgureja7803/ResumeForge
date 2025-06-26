import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ResumeEditor from '../components/ResumeEditor';
import JobDescriptionPanel from '../components/JobDescriptionPanel';
import ATSScorePanel from '../components/ATSScorePanel';
import type { ResumeData, JobDescription, ATSScore } from '../types';

// Mock initial resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    address: 'New York, NY',
    linkedIn: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  },
  summary: 'Experienced software engineer with 5+ years of experience in full-stack development...',
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '2024-01',
      current: false,
      description: 'Led development of microservices architecture...'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Python'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform using React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB'],
      githubLink: 'github.com/johndoe/ecommerce',
      liveLink: 'example.com'
    }
  ]
};

const ResumeBuilder: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [atsScore, setATSScore] = useState<ATSScore | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCalculatingATS, setIsCalculatingATS] = useState(false);

  // Placeholder functions for backend interactions
  const handleCalculateATS = async () => {
    if (!jobDescription) {
      alert('Please enter a job description first');
      return;
    }

    setIsCalculatingATS(true);
    // Simulate API call
    setTimeout(() => {
      const mockScore: ATSScore = {
        overallScore: 78,
        keywordMatches: 12,
        totalKeywords: 18,
        suggestions: [
          'Add more technical keywords from the job description',
          'Include specific achievements with numbers',
          'Mention relevant certifications'
        ],
        missingSkills: ['Docker', 'Kubernetes', 'GraphQL']
      };
      setATSScore(mockScore);
      setIsCalculatingATS(false);
    }, 2000);
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    // Simulate PDF generation
    setTimeout(() => {
      // This would normally trigger a download
      alert('PDF generated successfully! (Download would start here)');
      setIsGeneratingPDF(false);
    }, 3000);
  };

  const handleSaveResume = async () => {
    // Simulate saving to DynamoDB
    alert('Resume saved successfully!');
  };

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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">ResumeForge</h1>
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">
                Template: <span className="text-purple-400 font-medium">{templateId || 'Default'}</span>
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveResume}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Generate PDF</span>
                  </>
                )}
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={handleGithubAuth}
                  className="p-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  title="Login with GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button 
                  onClick={handleGoogleAuth}
                  className="p-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  title="Login with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Editor - Main Column */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Resume Editor
                  </h2>
                </div>
                <ResumeEditor
                  resumeData={resumeData}
                  onResumeChange={setResumeData}
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Job Description Panel */}
            <JobDescriptionPanel
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              onCalculateATS={handleCalculateATS}
              isCalculating={isCalculatingATS}
            />

            {/* ATS Score Panel */}
            {atsScore && (
              <ATSScorePanel atsScore={atsScore} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder; 