import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ResumeData } from '../types';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onResumeChange: (data: ResumeData) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData, onResumeChange }) => {
  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: generateResumeHTML(resumeData),
    onUpdate: ({ editor }) => {
      // This is a simplified version - in a real app, you'd parse the HTML back to data
      console.log('Editor updated:', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4 text-gray-100 prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-li:text-gray-300 prose-invert',
      },
    },
  });

  // Handle form field updates
  const handleFieldChange = (field: string, value: any, section?: string, index?: number) => {
    const newData = { ...resumeData };
    
    if (section && index !== undefined) {
      // Handle array items (experience, education, etc.)
      (newData[section as keyof ResumeData] as any)[index] = {
        ...(newData[section as keyof ResumeData] as any)[index],
        [field]: value
      };
    } else if (section) {
      // Handle nested objects (personalInfo)
      (newData[section as keyof ResumeData] as any)[field] = value;
    } else {
      // Handle top-level fields
      (newData as any)[field] = value;
    }
    
    onResumeChange(newData);
    
    // Update editor content
    if (editor) {
      editor.commands.setContent(generateResumeHTML(newData));
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Form */}
      <div className="border-b border-gray-600 pb-6">
        <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value, 'personalInfo')}
            className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleFieldChange('email', e.target.value, 'personalInfo')}
            className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value, 'personalInfo')}
            className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Address"
            value={resumeData.personalInfo.address}
            onChange={(e) => handleFieldChange('address', e.target.value, 'personalInfo')}
            className="px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="border-b border-gray-600 pb-6">
        <h3 className="text-lg font-medium text-white mb-4">Professional Summary</h3>
        <textarea
          placeholder="Write a brief professional summary..."
          value={resumeData.summary}
          onChange={(e) => handleFieldChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
        />
      </div>

      {/* Skills */}
      <div className="border-b border-gray-600 pb-6">
        <h3 className="text-lg font-medium text-white mb-4">Skills</h3>
        <input
          type="text"
          placeholder="Enter skills separated by commas"
          value={resumeData.skills.join(', ')}
          onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()))}
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
        />
      </div>

      {/* Rich Text Editor Preview */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Resume Preview</h3>
        <div className="border border-gray-600 rounded-md bg-gray-900/30">
          <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-600">
            <div className="flex space-x-2">
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  editor?.isActive('bold') ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  editor?.isActive('italic') ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  editor?.isActive('bulletList') ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                • List
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  editor?.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                H2
              </button>
            </div>
          </div>
          <div className="bg-white rounded-b-md">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate HTML from resume data
function generateResumeHTML(data: ResumeData): string {
  return `
    <div class="max-w-4xl mx-auto bg-white p-8">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${data.personalInfo.fullName}</h1>
        <div class="text-gray-600">
          <p>${data.personalInfo.email} • ${data.personalInfo.phone}</p>
          <p>${data.personalInfo.address}</p>
        </div>
      </header>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">Professional Summary</h2>
        <p class="text-gray-700">${data.summary}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">Skills</h2>
        <p class="text-gray-700">${data.skills.join(' • ')}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">Experience</h2>
        ${data.experience.map(exp => `
          <div class="mb-6">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-lg font-medium text-gray-900">${exp.position}</h3>
                <p class="text-gray-600">${exp.company}</p>
              </div>
              <p class="text-gray-500">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
            </div>
            <p class="text-gray-700">${exp.description}</p>
          </div>
        `).join('')}
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">Education</h2>
        ${data.education.map(edu => `
          <div class="mb-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">${edu.degree} in ${edu.fieldOfStudy}</h3>
                <p class="text-gray-600">${edu.institution}</p>
              </div>
              <p class="text-gray-500">${edu.startDate} - ${edu.endDate}</p>
            </div>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}

export default ResumeEditor; 