# ResumeForge 🔨

A serverless, AWS Lambda-based resume builder for creating ATS-optimized resumes with real-time feedback.

## 🎯 Project Overview

ResumeForge is a modern web application that helps users create professional resumes optimized for Applicant Tracking Systems (ATS). The app features real-time editing, job description matching, and AI-powered scoring to maximize your chances of landing interviews.

## ✨ Features

### Phase 1 (Current) - Frontend Implementation ✅
- **Modern Landing Page** with compelling call-to-action
- **Template Selection** with 3 professional resume templates
- **Live Resume Editor** powered by TipTap rich text editor
- **Job Description Input** with intelligent parsing
- **ATS Score Analysis** with detailed recommendations
- **Responsive Design** built with Tailwind CSS
- **TypeScript** for type safety and better developer experience

### Phase 2 (Planned) - Backend & AWS Integration
- **AWS Lambda Functions** for serverless processing
- **PDF Generation** using Puppeteer in Lambda
- **S3 Storage** for resume PDFs
- **DynamoDB** for user data persistence
- **API Gateway** for REST endpoints
- **Authentication** with AWS Cognito
- **AI Integration** with AWS Bedrock for smart matching

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TipTap Editor** for rich text editing
- **Vite** for build tooling

### Backend (Phase 2)
- **AWS Lambda** (Node.js + TypeScript)
- **API Gateway** for REST endpoints
- **Amazon S3** for file storage
- **DynamoDB** for data persistence
- **AWS Cognito** for authentication
- **AWS Bedrock** for AI features

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd resumeforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
resumeforge/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ResumeEditor.tsx      # TipTap-based resume editor
│   │   ├── JobDescriptionPanel.tsx  # Job description input
│   │   └── ATSScorePanel.tsx     # ATS scoring display
│   ├── pages/            # Page components
│   │   ├── LandingPage.tsx       # Homepage
│   │   ├── TemplateSelector.tsx  # Template selection
│   │   └── ResumeBuilder.tsx     # Main editor interface
│   ├── types/            # TypeScript definitions
│   │   └── index.ts             # All type definitions
│   ├── hooks/            # Custom React hooks (future)
│   ├── utils/            # Utility functions (future)
│   ├── App.tsx           # Main app component with routing
│   └── index.tsx         # App entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Dependencies and scripts
```

## 🎨 UI Components

### Landing Page
- Hero section with value proposition
- Feature highlights with icons
- Call-to-action buttons for sign up/login
- Professional gradient background

### Template Selector
- Grid of 3 resume templates:
  - **Modern Professional** - Clean design for tech/business
  - **Classic Traditional** - Conservative format
  - **Creative Portfolio** - Eye-catching for creative roles
- Template previews with descriptions
- "Use Template" and "Preview" actions

### Resume Builder
- **Left Panel (2/3 width)**: Live resume editor
  - Personal information form
  - Professional summary textarea
  - Skills input (comma-separated)
  - Rich text editor with formatting toolbar
  - Real-time resume preview
- **Right Panel (1/3 width)**:
  - Job description input panel
  - ATS score analysis panel (appears after scoring)

## 🔧 Key Features Implementation

### Resume Editor (TipTap Integration)
- Rich text editing with formatting options
- Real-time preview generation
- Form inputs for structured data
- HTML content generation from resume data

### Job Description Analysis
- Text parsing for requirements extraction
- Intelligent keyword identification
- Automatic skills gap analysis

### ATS Scoring System
- Overall compatibility score (0-100%)
- Keyword matching analysis
- Missing skills identification
- Actionable improvement suggestions
- Color-coded scoring (red/yellow/green)

## 🎯 Placeholder Functions

The following functions are currently mocked and will be replaced with AWS Lambda integrations in Phase 2:

- `handleCalculateATS()` - Simulates ATS analysis
- `handleGeneratePDF()` - Simulates PDF generation
- `handleSaveResume()` - Simulates data persistence

## 🚀 Next Steps (Phase 2)

1. **AWS Infrastructure Setup**
   - Set up AWS account and IAM roles
   - Create Lambda functions for backend logic
   - Configure API Gateway endpoints

2. **Backend Services**
   - Implement ATS scoring algorithm
   - Build PDF generation service
   - Set up S3 for file storage
   - Configure DynamoDB for data

3. **Authentication**
   - Integrate AWS Cognito
   - Add user registration/login flows
   - Implement protected routes

4. **Deployment**
   - Deploy frontend to AWS Amplify or Vercel
   - Configure CI/CD pipelines
   - Set up environment variables

## 🤝 Contributing

This is a hackathon project built for learning and demonstration purposes. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use this code for your own projects.

---

**Built with ❤️ for the hackathon community**
