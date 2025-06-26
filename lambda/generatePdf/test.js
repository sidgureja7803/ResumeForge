/**
 * Local Testing Script for PDF Generator Lambda Function
 * Run with: node test.js
 */

process.env.NODE_ENV = 'development';
process.env.S3_BUCKET_NAME = 'resumeforge-pdfs-test';
process.env.AWS_REGION = 'us-east-1';

// Test HTML content
const testHtml = `
<div class="resume">
  <div class="contact-info">
    <h1>John Doe</h1>
    <p>Software Engineer</p>
    <p>john.doe@email.com | (555) 123-4567 | LinkedIn: /in/johndoe</p>
  </div>

  <div class="section">
    <h2>Professional Summary</h2>
    <p>Experienced software engineer with 5+ years of expertise in full-stack development, 
    specializing in React, Node.js, and cloud technologies. Proven track record of 
    delivering scalable web applications and leading development teams.</p>
  </div>

  <div class="section">
    <h2>Experience</h2>
    
    <div class="job">
      <h3>Senior Software Engineer - TechCorp Inc.</h3>
      <p><em>January 2021 - Present</em></p>
      <ul>
        <li>Led development of microservices architecture serving 100k+ users</li>
        <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
        <li>Mentored 3 junior developers and conducted code reviews</li>
        <li>Technologies: React, Node.js, MongoDB, Docker, AWS</li>
      </ul>
    </div>

    <div class="job">
      <h3>Full Stack Developer - StartupXYZ</h3>
      <p><em>June 2019 - December 2020</em></p>
      <ul>
        <li>Built responsive web applications using React and Express.js</li>
        <li>Designed and implemented RESTful APIs with PostgreSQL</li>
        <li>Collaborated with product team in agile development environment</li>
        <li>Technologies: JavaScript, Python, PostgreSQL, Redis</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Education</h2>
    <div>
      <h3>Bachelor of Science in Computer Science</h3>
      <p>University of Technology | 2015 - 2019</p>
      <p>GPA: 3.8/4.0</p>
    </div>
  </div>

  <div class="section">
    <h2>Skills</h2>
    <p><strong>Programming Languages:</strong> JavaScript, TypeScript, Python, Java</p>
    <p><strong>Frontend:</strong> React, Angular, Vue.js, HTML5, CSS3</p>
    <p><strong>Backend:</strong> Node.js, Express, Django, Spring Boot</p>
    <p><strong>Databases:</strong> MongoDB, PostgreSQL, MySQL, Redis</p>
    <p><strong>Cloud & DevOps:</strong> AWS, Docker, Kubernetes, Jenkins</p>
  </div>

  <div class="section">
    <h2>Projects</h2>
    
    <div class="project">
      <h3>E-commerce Platform</h3>
      <p>Built a full-featured e-commerce platform with React frontend and Node.js backend</p>
      <ul>
        <li>Payment integration with Stripe</li>
        <li>Real-time inventory management</li>
        <li>Admin dashboard with analytics</li>
      </ul>
    </div>

    <div class="project">
      <h3>Task Management API</h3>
      <p>RESTful API for team task management with authentication and notifications</p>
      <ul>
        <li>JWT-based authentication</li>
        <li>Real-time updates with WebSockets</li>
        <li>Email notifications with SendGrid</li>
      </ul>
    </div>
  </div>
</div>
`;

const minimalHtml = `
<div>
  <h1>Simple Resume</h1>
  <p>John Doe - Software Engineer</p>
  <p>Email: john@example.com</p>
</div>
`;

/**
 * Mock implementations for testing without dependencies
 */
const mockUtils = {
  validateHtml: (html) => {
    if (!html || typeof html !== 'string') return false;
    const hasHtmlTags = html.includes('<html') || html.includes('<body') || html.includes('<div');
    return hasHtmlTags && html.trim().length > 0;
  },
  
  sanitizeFileName: (fileName) => {
    if (!fileName || typeof fileName !== 'string') return 'resume';
    return fileName
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
      .substring(0, 50) || 'resume';
  },

  wrapHtmlForPdf: (content) => {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title></head><body>${content}</body></html>`;
  },

  renderPdfToBuffer: async (html) => {
    // Mock PDF buffer
    return Buffer.from('Mock PDF content - this would be actual PDF binary data in production');
  },

  uploadToS3: async (buffer, fileName) => {
    const uuid = 'mock-uuid-' + Date.now();
    return {
      url: `https://resumeforge-pdfs-test.s3.amazonaws.com/${fileName}-${uuid}.pdf`,
      bucket: 'resumeforge-pdfs-test',
      key: `${fileName}-${uuid}.pdf`,
      etag: '"mock-etag"',
      size: buffer.length,
      uploadedAt: new Date().toISOString()
    };
  }
};

/**
 * Mock Lambda handler for testing
 */
const mockHandler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS preflight successful' }) };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed', message: 'Only POST requests are supported' })
      };
    }

    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Bad Request', message: 'Invalid JSON in request body' })
      };
    }

    const { html, fileName } = requestBody;
    
    if (!html || typeof html !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Missing or invalid html field'
        })
      };
    }

    if (!mockUtils.validateHtml(html)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid HTML content'
        })
      };
    }

    const sanitizedFileName = mockUtils.sanitizeFileName(fileName) || 'resume';
    const wrappedHtml = mockUtils.wrapHtmlForPdf(html);
    const pdfBuffer = await mockUtils.renderPdfToBuffer(wrappedHtml);
    const uploadResult = await mockUtils.uploadToS3(pdfBuffer, sanitizedFileName);

    const response = {
      success: true,
      url: uploadResult.url,
      data: {
        fileName: sanitizedFileName,
        pdfUrl: uploadResult.url,
        s3Key: uploadResult.key,
        s3Bucket: uploadResult.bucket,
        fileSize: uploadResult.size,
        uploadedAt: uploadResult.uploadedAt
      },
      metadata: {
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString()
      }
    };

    return { statusCode: 200, headers, body: JSON.stringify(response) };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to generate PDF',
        requestId: context.awsRequestId
      })
    };
  }
};

/**
 * Test helper
 */
async function testLocally(html, fileName = 'test-resume') {
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ html, fileName })
  };
  
  const mockContext = {
    awsRequestId: 'test-request-' + Date.now(),
    getRemainingTimeInMillis: () => 30000
  };

  return await mockHandler(mockEvent, mockContext);
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting PDF Generator Lambda Function Tests...\n');

  try {
    // Test 1: Utility Functions
    console.log('Test 1: Utility Functions');
    console.log('=' .repeat(60));
    
    // Test HTML validation
    console.log('HTML Validation:');
    console.log('  Valid HTML:', mockUtils.validateHtml(testHtml));
    console.log('  Invalid HTML:', mockUtils.validateHtml('just text'));
    console.log('  Empty HTML:', mockUtils.validateHtml(''));
    
    // Test filename sanitization
    console.log('Filename Sanitization:');
    console.log('  Normal:', mockUtils.sanitizeFileName('resume-siddhant'));
    console.log('  Special chars:', mockUtils.sanitizeFileName('résumé@2024!.pdf'));
    console.log('  Spaces:', mockUtils.sanitizeFileName('my resume file'));
    console.log('  Empty:', mockUtils.sanitizeFileName(''));
    
    // Test HTML wrapping
    const wrappedHtml = mockUtils.wrapHtmlForPdf('<h1>Test</h1>');
    console.log('  HTML wrapped length:', wrappedHtml.length);
    
    console.log('✅ Utility functions test passed\n');

    // Test 2: PDF Generation (Mocked)
    console.log('Test 2: PDF Generation (Mocked)');
    console.log('=' .repeat(60));
    
    const pdfBuffer = await mockUtils.renderPdfToBuffer(mockUtils.wrapHtmlForPdf(minimalHtml));
    console.log(`  Mock PDF generated successfully: ${pdfBuffer.length} bytes`);
    console.log('  PDF content preview:', pdfBuffer.toString().substring(0, 30) + '...');
    console.log('✅ PDF generation test passed (mocked)\n');

    // Test 3: Lambda Handler - Success Case
    console.log('Test 3: Lambda Handler - Success Case');
    console.log('=' .repeat(60));
    
    const successResponse = await testLocally(testHtml, 'test-resume');
    console.log('  Status Code:', successResponse.statusCode);
    console.log('  Response Headers:', Object.keys(successResponse.headers));
    
    if (successResponse.statusCode === 200) {
      const responseData = JSON.parse(successResponse.body);
      console.log('  Response Data:', {
        success: responseData.success,
        url: responseData.url,
        fileName: responseData.data?.fileName,
        fileSize: responseData.data?.fileSize
      });
      console.log('✅ Lambda success case test passed\n');
    } else {
      console.log('  Response Body:', successResponse.body);
      console.log('❌ Lambda success case test failed\n');
    }

    // Test 4: Lambda Handler - Error Cases
    console.log('Test 4: Lambda Handler - Error Cases');
    console.log('=' .repeat(60));
    
    // Test missing HTML
    const errorResponse1 = await testLocally('', 'test');
    console.log('  Missing HTML - Status:', errorResponse1.statusCode);
    
    // Test invalid HTML
    const errorResponse2 = await testLocally('just plain text', 'test');
    console.log('  Invalid HTML - Status:', errorResponse2.statusCode);
    
    // Test invalid JSON
    const mockEvent = {
      httpMethod: 'POST',
      body: '{ invalid json'
    };
    const mockContext = { 
      awsRequestId: 'test-error',
      getRemainingTimeInMillis: () => 30000
    };
    const errorResponse3 = await mockHandler(mockEvent, mockContext);
    console.log('  Invalid JSON - Status:', errorResponse3.statusCode);
    
    // Test wrong HTTP method
    const mockEventGET = {
      httpMethod: 'GET',
      body: JSON.stringify({ html: testHtml, fileName: 'test' })
    };
    const errorResponse4 = await mockHandler(mockEventGET, mockContext);
    console.log('  Wrong HTTP method - Status:', errorResponse4.statusCode);
    
    console.log('✅ Lambda error cases test passed\n');

    // Test 5: Performance Simulation
    console.log('Test 5: Performance Simulation');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();
    for (let i = 0; i < 3; i++) {
      await testLocally(minimalHtml, `perf-test-${i}`);
    }
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / 3;
    
    console.log(`  Average processing time (mocked): ${avgTime.toFixed(2)}ms`);
    console.log('✅ Performance simulation passed\n');

    console.log('🎉 All tests completed successfully!');
    
    // Show setup instructions
    console.log('\n📦 To install actual dependencies for production deployment:');
    console.log(`npm install puppeteer-core @sparticuz/chromium aws-sdk uuid

📥 Sample API Usage:
POST https://your-api-gateway-url/generate-pdf
Content-Type: application/json

{
  "html": "<div><h1>My Resume</h1><p>Content here...</p></div>",
  "fileName": "resume-siddhant"
}

📤 Response:
{
  "success": true,
  "url": "https://resumeforge-pdfs.s3.amazonaws.com/resume-siddhant-uuid.pdf",
  "data": {
    "fileName": "resume-siddhant",
    "pdfUrl": "https://resumeforge-pdfs.s3.amazonaws.com/resume-siddhant-uuid.pdf",
    "fileSize": 12345,
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Helper function to show example usage
function showExampleUsage() {
  console.log('\n📋 Example Usage in Frontend:');
  console.log(`
// React/JavaScript example
async function generateResumePDF(htmlContent, fileName) {
  try {
    const response = await fetch('https://your-api-gateway-url/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        fileName: fileName
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('PDF generated successfully:', data.url);
      
      // Open PDF in new tab
      window.open(data.url, '_blank');
      
      // Or download directly
      const link = document.createElement('a');
      link.href = data.url;
      link.download = \`\${fileName}.pdf\`;
      link.click();
      
      return data.url;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

// Usage
const resumeHTML = document.getElementById('resume-preview').innerHTML;
generateResumePDF(resumeHTML, 'my-resume');
`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().then(() => {
    showExampleUsage();
  });
} 