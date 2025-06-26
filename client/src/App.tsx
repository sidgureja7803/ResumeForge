import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResumeBuilder from './pages/ResumeBuilder';
import TemplateSelector from './pages/TemplateSelector';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/templates" element={<TemplateSelector />} />
          <Route path="/builder/:templateId?" element={<ResumeBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
