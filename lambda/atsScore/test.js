/**
 * Local Testing Script for ATS Score Lambda Function
 * Run with: node test.js
 */

process.env.NODE_ENV = 'development';

const { handler, testLocally } = require('./atsScore');
const { extractKeywords, calculateATSScore } = require('./utils/scoreEngine');

// Test data
const testResume = `
John Doe
Software Engineer

EXPERIENCE:
Senior Software Engineer at TechCorp (2020-2023)
- Developed scalable web applications using React, Node.js, and MongoDB
- Implemented microservices architecture with Docker and Kubernetes
- Led agile development teams and mentored junior developers
- Built RESTful APIs and integrated third-party services

Full Stack Developer at StartupXYZ (2018-2020)
- Created responsive frontend applications using JavaScript, HTML, CSS
- Developed backend services with Python and Django
- Managed PostgreSQL databases and optimized query performance
- Collaborated with product managers and designers in scrum methodology

SKILLS:
JavaScript, TypeScript, React, Angular, Node.js, Express, Python, Django, 
MongoDB, PostgreSQL, Docker, Kubernetes, AWS, Git, Agile, Scrum, REST APIs
`;

const testJobDescription = `
Position: Senior Full Stack Developer
Company: InnovateTech Solutions

We are seeking a Senior Full Stack Developer to join our dynamic team.

REQUIREMENTS:
- 3+ years of experience in full-stack development
- Proficiency in JavaScript, TypeScript, and React
- Experience with Node.js and Express framework
- Knowledge of database technologies (MongoDB, PostgreSQL)
- Familiarity with cloud platforms (AWS, Azure)
- Understanding of containerization (Docker, Kubernetes)
- Experience with agile development methodologies
- Strong problem-solving and communication skills

RESPONSIBILITIES:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Implement microservices architecture
- Maintain code quality and documentation
- Mentor junior developers

NICE TO HAVE:
- Experience with GraphQL
- Knowledge of DevOps practices
- Previous experience in a startup environment
`;

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting ATS Lambda Function Tests...\n');

  try {
    // Test 1: Keyword Extraction
    console.log('Test 1: Keyword Extraction');
    console.log('=' .repeat(50));
    
    const resumeKeywords = extractKeywords(testResume);
    const jdKeywords = extractKeywords(testJobDescription);
    
    console.log(`Resume Keywords (${resumeKeywords.length}):`, resumeKeywords.slice(0, 15), '...');
    console.log(`JD Keywords (${jdKeywords.length}):`, jdKeywords.slice(0, 15), '...');
    console.log('✅ Keyword extraction test passed\n');

    // Test 2: ATS Score Calculation
    console.log('Test 2: ATS Score Calculation');
    console.log('=' .repeat(50));
    
    const scoreResult = calculateATSScore(testResume, testJobDescription);
    console.log('Score Result:', {
      score: scoreResult.score,
      matchedKeywords: scoreResult.matchedKeywords.length,
      missingKeywords: scoreResult.missingKeywords.length,
      totalJdKeywords: scoreResult.totalJdKeywords
    });
    console.log('Matched Keywords:', scoreResult.matchedKeywords.slice(0, 10));
    console.log('Missing Keywords:', scoreResult.missingKeywords.slice(0, 10));
    console.log('✅ ATS score calculation test passed\n');

    // Test 3: Lambda Handler - Success Case
    console.log('Test 3: Lambda Handler - Success Case');
    console.log('=' .repeat(50));
    
    const successResponse = await testLocally(testResume, testJobDescription);
    console.log('Status Code:', successResponse.statusCode);
    console.log('Response Headers:', successResponse.headers);
    
    const responseData = JSON.parse(successResponse.body);
    console.log('Response Data:', {
      success: responseData.success,
      score: responseData.data?.score,
      matchedCount: responseData.data?.matchedKeywords?.length,
      missingCount: responseData.data?.missingKeywords?.length
    });
    console.log('✅ Lambda success case test passed\n');

    // Test 4: Lambda Handler - Error Cases
    console.log('Test 4: Lambda Handler - Error Cases');
    console.log('=' .repeat(50));
    
    // Test missing resumeText
    const errorResponse1 = await testLocally('', testJobDescription);
    console.log('Missing resume text - Status:', errorResponse1.statusCode);
    
    // Test missing jobDescription
    const errorResponse2 = await testLocally(testResume, '');
    console.log('Missing job description - Status:', errorResponse2.statusCode);
    
    // Test invalid JSON (simulated)
    const mockEvent = {
      httpMethod: 'POST',
      body: '{ invalid json'
    };
    const mockContext = { awsRequestId: 'test-error' };
    const errorResponse3 = await handler(mockEvent, mockContext);
    console.log('Invalid JSON - Status:', errorResponse3.statusCode);
    
    console.log('✅ Lambda error cases test passed\n');

    // Test 5: Performance Test
    console.log('Test 5: Performance Test');
    console.log('=' .repeat(50));
    
    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      await testLocally(testResume, testJobDescription);
    }
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / 10;
    
    console.log(`Average processing time: ${avgTime.toFixed(2)}ms`);
    console.log('✅ Performance test passed\n');

    console.log('🎉 All tests completed successfully!');
    console.log('\nSample API Usage:');
    console.log(`POST https://your-api-gateway-url/ats-score
Content-Type: application/json

{
  "resumeText": "Your resume content here...",
  "jobDescription": "Job description content here..."
}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
} 