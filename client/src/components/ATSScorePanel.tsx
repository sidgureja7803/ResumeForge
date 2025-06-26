import React from 'react';
import type { ATSScore } from '../types';

interface ATSScorePanelProps {
  atsScore: ATSScore;
}

const ATSScorePanel: React.FC<ATSScorePanelProps> = ({ atsScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-900/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-500/30';
    return 'bg-red-900/20 border-red-500/30';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">
            ATS Score Analysis
          </h3>
        </div>

        {/* Overall Score */}
        <div className={`p-4 rounded-lg border mb-6 ${getScoreBgColor(atsScore.overallScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Overall ATS Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(atsScore.overallScore)}`}>
              {atsScore.overallScore}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(atsScore.overallScore)}`}
              style={{ width: `${atsScore.overallScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {atsScore.overallScore >= 80 && "Excellent! Your resume is ATS-optimized."}
            {atsScore.overallScore >= 60 && atsScore.overallScore < 80 && "Good score with room for improvement."}
            {atsScore.overallScore < 60 && "Needs improvement to pass ATS filters."}
          </p>
        </div>

        {/* Keyword Matching */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Keyword Matching</h4>
          <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-600">
            <span className="text-sm text-gray-300">Keywords Found</span>
            <span className="font-semibold text-white">
              {atsScore.keywordMatches} / {atsScore.totalKeywords}
            </span>
          </div>
        </div>

        {/* Missing Skills */}
        {atsScore.missingSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Missing Skills</h4>
            <div className="space-y-2">
              {atsScore.missingSkills.map((skill, index) => (
                <div key={index} className="flex items-center p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <svg className="h-4 w-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-red-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Improvement Suggestions</h4>
          <div className="space-y-3">
            {atsScore.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <svg className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-300">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium">
            Optimize Resume
          </button>
          <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATSScorePanel; 