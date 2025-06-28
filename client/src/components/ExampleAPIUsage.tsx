/**
 * Example React Component showing API usage
 * This demonstrates how to integrate with the deployed Lambda functions
 */

import React, { useState } from 'react';
import { useATS } from '../hooks/useATS';
import { usePDF } from '../hooks/usePDF';

const ExampleAPIUsage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [fileName, setFileName] = useState('my-resume');

  const ats = useATS();
  const pdf = usePDF();

  const handleATSScore = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please enter both resume text and job description');
      return;
    }

    await ats.calculateScore({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim()
    });
  };

  const handlePDFGeneration = async () => {
    if (!htmlContent.trim()) {
      alert('Please enter HTML content');
      return;
    }

    await pdf.generatePDF({
      html: htmlContent.trim(),
      fileName: fileName.trim() || 'resume'
    });
  };

  const handlePDFDownload = async () => {
    if (!htmlContent.trim()) {
      alert('Please enter HTML content');
      return;
    }

    await pdf.generateAndDownload(htmlContent.trim(), fileName.trim() || 'resume');
  };

  const sampleResumeText = `John Doe
Software Engineer

EXPERIENCE:
Senior Software Engineer at TechCorp (2020-2023)
- Developed scalable web applications using React, Node.js, and MongoDB
- Implemented microservices architecture with Docker and Kubernetes
- Led agile development teams and mentored junior developers

Full Stack Developer at StartupXYZ (2018-2020)
- Created responsive frontend applications using JavaScript
- Developed backend services with Python and Django
- Managed PostgreSQL databases and optimized performance

SKILLS:
JavaScript, TypeScript, React, Node.js, Python, MongoDB, PostgreSQL, Docker, AWS`;

  const sampleJobDescription = `Position: Senior Full Stack Developer
Company: InnovateTech Solutions

REQUIREMENTS:
- 3+ years of experience in full-stack development
- Proficiency in JavaScript, TypeScript, and React
- Experience with Node.js and backend development
- Knowledge of database technologies (MongoDB, PostgreSQL)
- Familiarity with cloud platforms (AWS, Azure)
- Understanding of containerization (Docker, Kubernetes)
- Experience with agile development methodologies`;

  const sampleHTML = `<div class="resume">
  <header>
    <h1>John Doe</h1>
    <p>Software Engineer</p>
    <p>john.doe@email.com | (555) 123-4567</p>
  </header>
  
  <section>
    <h2>Professional Summary</h2>
    <p>Experienced software engineer with 5+ years in full-stack development.</p>
  </section>
  
  <section>
    <h2>Experience</h2>
    <div>
      <h3>Senior Software Engineer - TechCorp</h3>
      <p>2020 - 2023</p>
      <ul>
        <li>Developed scalable web applications</li>
        <li>Led development teams</li>
      </ul>
    </div>
  </section>
</div>`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">ResumeForge API Demo</h1>
        <p className="text-gray-300">Test the deployed Lambda functions</p>
      </div>

      {/* ATS Score Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">🔍 ATS Score API</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Enter resume content..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            <button
              onClick={() => setResumeText(sampleResumeText)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Use Sample Resume
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            <button
              onClick={() => setJobDescription(sampleJobDescription)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Use Sample Job Description
            </button>
          </div>
        </div>

        <button
          onClick={handleATSScore}
          disabled={ats.loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-md font-medium"
        >
          {ats.loading ? 'Calculating...' : 'Calculate ATS Score'}
        </button>

        {ats.error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-md">
            <p className="text-red-300">Error: {ats.error}</p>
          </div>
        )}

        {ats.data && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-600 rounded-md">
            <h3 className="text-lg font-semibold text-green-300 mb-2">ATS Score Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-300">Score:</p>
                <p className="text-2xl font-bold text-green-400">{ats.data.data.score}%</p>
              </div>
              <div>
                <p className="text-gray-300">Matched Keywords:</p>
                <p className="text-green-400">{ats.data.data.matchedKeywords.length}</p>
              </div>
              <div>
                <p className="text-gray-300">Missing Keywords:</p>
                <p className="text-red-400">{ats.data.data.missingKeywords.length}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-300 text-sm">Matched: {ats.data.data.matchedKeywords.slice(0, 10).join(', ')}</p>
              <p className="text-gray-300 text-sm">Missing: {ats.data.data.missingKeywords.slice(0, 10).join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* PDF Generation Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">📄 PDF Generation API</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              HTML Content
            </label>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Enter HTML content..."
              rows={10}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 font-mono text-sm"
            />
            <button
              onClick={() => setHtmlContent(sampleHTML)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Use Sample HTML
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter filename (without .pdf)"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
            
            <div className="mt-4 space-y-2">
              <button
                onClick={handlePDFGeneration}
                disabled={pdf.loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-md font-medium"
              >
                {pdf.loading ? 'Generating...' : 'Generate PDF (Get URL)'}
              </button>
              
              <button
                onClick={handlePDFDownload}
                disabled={pdf.loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-md font-medium"
              >
                {pdf.loading ? 'Generating...' : 'Generate & Download PDF'}
              </button>
            </div>
          </div>
        </div>

        {pdf.error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-md">
            <p className="text-red-300">Error: {pdf.error}</p>
          </div>
        )}

        {pdf.data && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-600 rounded-md">
            <h3 className="text-lg font-semibold text-green-300 mb-2">PDF Generated Successfully</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-300">URL:</span>{' '}
                <a 
                  href={pdf.data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 break-all"
                >
                  {pdf.data.url}
                </a>
              </p>
              <p className="text-sm">
                <span className="text-gray-300">File Size:</span>{' '}
                <span className="text-green-400">{(pdf.data.data.fileSize / 1024).toFixed(1)} KB</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-300">Generated:</span>{' '}
                <span className="text-green-400">{new Date(pdf.data.data.uploadedAt).toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reset Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={ats.reset}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Reset ATS Data
        </button>
        <button
          onClick={pdf.reset}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Reset PDF Data
        </button>
      </div>
    </div>
  );
};

export default ExampleAPIUsage; 