/**
 * Test Suite for ATS Score Lambda Function - Phase 2
 * Tests standalone resume analysis without job description matching
 */

// Import the Lambda handler and utility functions
const { handler } = require('./atsScore');
const { 
  extractResumeInfo, 
  checkResumeSections, 
  checkFormattingIssues, 
  checkContentQuality,
  calculateATSScore 
} = require('./utils/atsEngine');

// Sample resume data for testing
const sampleResumes = {
  excellent: `
    John Doe
    Software Engineer
    john.doe@email.com
    (555) 123-4567
    
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5+ years developing scalable applications
    
    EXPERIENCE
    Senior Software Engineer | Tech Corp | 2020 - Present
    • Developed and implemented microservices architecture using Node.js and React
    • Increased application performance by 40% through optimization techniques
    • Led a team of 5 developers on critical project deliveries
    • Collaborated with cross-functional teams to design user-friendly interfaces
    
    Software Engineer | StartupXYZ | 2018 - 2020
    • Built responsive web applications using JavaScript, HTML, and CSS
    • Implemented RESTful APIs and integrated with third-party services
    • Reduced server response time by 25% through database optimization
    
    EDUCATION
    Bachelor of Science in Computer Science | University of Technology | 2018
    
    SKILLS
    Programming Languages: JavaScript, Python, Java, TypeScript
    Technologies: React, Node.js, Express, MongoDB, AWS, Docker
    Tools: Git, Jenkins, Jira, Agile methodologies
    
    ACHIEVEMENTS
    • Awarded "Developer of the Year" in 2021
    • Successfully delivered 15+ projects on time and under budget
    • Mentored 10+ junior developers
  `,
  
  poor: `
    Jane Smith
    Looking for job
    
    I worked at some companies and did programming stuff.
    I know computers and can type fast.
    
    Worked somewhere 2019-2022
    Did things with code
    
    Went to school
    Got degree
  `,
  
  withTables: `
    John Developer
    john@email.com | (555) 123-4567
    
    EXPERIENCE
    Company | Role | Years | Skills
    --------|------|-------|--------
    TechCorp | Senior Dev | 3 | JavaScript
    StartupABC | Junior Dev | 2 | Python
    
    EDUCATION
    University of Tech | Computer Science | 2018
  `,
  
  withGraphics: `
    Sarah Designer
    sarah@email.com
    
    [PHOTO HERE]
    
    EXPERIENCE
    UI/UX Designer with expertise in creating beautiful interfaces
    See my portfolio at: portfolio.jpg
    
    SKILLS
    • Adobe Creative Suite
    • Figma design.png
    • User research [graphic]
  `
};

/**
 * Test utility functions
 */
async function testUtilityFunctions() {
  console.log('\n=== Testing Utility Functions ===');
  
  try {
    // Test extractResumeInfo
    console.log('\n1. Testing extractResumeInfo...');
    const resumeInfo = extractResumeInfo(sampleResumes.excellent);
    console.log('✅ Resume info extracted:', {
      wordCount: resumeInfo.wordCount,
      lineCount: resumeInfo.lineCount,
      hasContent: resumeInfo.cleanText.length > 0
    });
    
    // Test checkResumeSections
    console.log('\n2. Testing checkResumeSections...');
    const sections = checkResumeSections(resumeInfo);
    console.log('✅ Sections analyzed:', {
      contactFound: sections.contact.found,
      experienceFound: sections.experience.found,
      educationFound: sections.education.found,
      skillsFound: sections.skills.found
    });
    
    // Test checkFormattingIssues
    console.log('\n3. Testing checkFormattingIssues...');
    const formatting = checkFormattingIssues(resumeInfo);
    console.log('✅ Formatting analyzed:', {
      score: formatting.score,
      issuesFound: formatting.feedback.filter(f => f.includes('❌')).length
    });
    
    // Test checkContentQuality
    console.log('\n4. Testing checkContentQuality...');
    const content = checkContentQuality(resumeInfo);
    console.log('✅ Content quality analyzed:', {
      score: content.score,
      wordCount: content.wordCount
    });
    
    return true;
  } catch (error) {
    console.error('❌ Utility function test failed:', error.message);
    return false;
  }
}

/**
 * Test complete ATS scoring
 */
async function testATSScoring() {
  console.log('\n=== Testing ATS Scoring ===');
  
  const testCases = [
    { name: 'Excellent Resume', resume: sampleResumes.excellent, expectedRange: [80, 100] },
    { name: 'Poor Resume', resume: sampleResumes.poor, expectedRange: [0, 40] },
    { name: 'Resume with Tables', resume: sampleResumes.withTables, expectedRange: [50, 80] },
    { name: 'Resume with Graphics', resume: sampleResumes.withGraphics, expectedRange: [30, 70] }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}:`);
      const result = calculateATSScore(testCase.resume);
      
      const inExpectedRange = result.score >= testCase.expectedRange[0] && 
                             result.score <= testCase.expectedRange[1];
      
      console.log(inExpectedRange ? '✅' : '❌', `Score: ${result.score}/100`);
      console.log(`   Expected range: ${testCase.expectedRange[0]}-${testCase.expectedRange[1]}`);
      console.log(`   Feedback items: ${result.feedback.length}`);
      console.log(`   Top feedback: ${result.feedback[0]}`);
      
      if (!inExpectedRange) {
        console.log('   ⚠️ Score outside expected range!');
      }
      
    } catch (error) {
      console.error('❌ ATS scoring failed:', error.message);
    }
  }
}

/**
 * Test Lambda handler with various scenarios
 */
async function testLambdaHandler() {
  console.log('\n=== Testing Lambda Handler ===');
  
  const testCases = [
    {
      name: 'Valid Resume',
      event: {
        httpMethod: 'POST',
        body: JSON.stringify({ resumeText: sampleResumes.excellent })
      },
      expectedStatus: 200
    },
    {
      name: 'Missing resumeText',
      event: {
        httpMethod: 'POST',
        body: JSON.stringify({})
      },
      expectedStatus: 400
    },
    {
      name: 'Invalid JSON',
      event: {
        httpMethod: 'POST',
        body: 'invalid json'
      },
      expectedStatus: 400
    },
    {
      name: 'GET Method (should fail)',
      event: {
        httpMethod: 'GET',
        body: JSON.stringify({ resumeText: sampleResumes.excellent })
      },
      expectedStatus: 405
    },
    {
      name: 'OPTIONS Method (CORS)',
      event: {
        httpMethod: 'OPTIONS',
        body: ''
      },
      expectedStatus: 200
    },
    {
      name: 'Too Short Resume',
      event: {
        httpMethod: 'POST',
        body: JSON.stringify({ resumeText: 'Short' })
      },
      expectedStatus: 400
    },
    {
      name: 'Too Long Resume',
      event: {
        httpMethod: 'POST',
        body: JSON.stringify({ resumeText: 'x'.repeat(60000) })
      },
      expectedStatus: 400
    }
  ];
  
  const mockContext = {
    awsRequestId: 'test-request-123',
    getRemainingTimeInMillis: () => 30000
  };
  
  for (const testCase of testCases) {
    try {
      console.log(`\n${testCase.name}:`);
      const result = await handler(testCase.event, mockContext);
      
      const statusMatch = result.statusCode === testCase.expectedStatus;
      console.log(statusMatch ? '✅' : '❌', `Status: ${result.statusCode} (expected: ${testCase.expectedStatus})`);
      
      if (result.statusCode === 200) {
        const body = JSON.parse(result.body);
        console.log(`   Score: ${body.score}/100`);
        console.log(`   Feedback items: ${body.feedback?.length || 0}`);
        console.log(`   Has metadata: ${!!body.metadata}`);
      } else if (result.statusCode >= 400) {
        const body = JSON.parse(result.body);
        console.log(`   Error: ${body.error}`);
        console.log(`   Message: ${body.message}`);
      }
      
      // Verify CORS headers are present
      const hasCORS = result.headers && result.headers['Access-Control-Allow-Origin'];
      console.log(hasCORS ? '✅' : '❌', 'CORS headers present');
      
    } catch (error) {
      console.error('❌ Lambda handler test failed:', error.message);
    }
  }
}

/**
 * Test error handling and edge cases
 */
async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  const mockContext = {
    awsRequestId: 'test-error-123',
    getRemainingTimeInMillis: () => 30000
  };
  
  // Test with null/undefined inputs
  try {
    console.log('\nTesting null resumeText...');
    const result = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ resumeText: null })
    }, mockContext);
    
    console.log(result.statusCode === 400 ? '✅' : '❌', `Status: ${result.statusCode}`);
  } catch (error) {
    console.error('❌ Null test failed:', error.message);
  }
  
  // Test with non-string resumeText
  try {
    console.log('\nTesting numeric resumeText...');
    const result = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ resumeText: 12345 })
    }, mockContext);
    
    console.log(result.statusCode === 400 ? '✅' : '❌', `Status: ${result.statusCode}`);
  } catch (error) {
    console.error('❌ Numeric test failed:', error.message);
  }
}

/**
 * Performance test
 */
async function testPerformance() {
  console.log('\n=== Testing Performance ===');
  
  const startTime = Date.now();
  const iterations = 10;
  
  for (let i = 0; i < iterations; i++) {
    try {
      await calculateATSScore(sampleResumes.excellent);
    } catch (error) {
      console.error(`❌ Performance test iteration ${i+1} failed:`, error.message);
      return;
    }
  }
  
  const totalTime = Date.now() - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`✅ Performance test completed:`);
  console.log(`   Total time: ${totalTime}ms`);
  console.log(`   Average time: ${avgTime.toFixed(2)}ms per calculation`);
  console.log(`   Iterations: ${iterations}`);
  
  if (avgTime < 100) {
    console.log('✅ Performance: Excellent (< 100ms)');
  } else if (avgTime < 500) {
    console.log('⚠️ Performance: Good (< 500ms)');
  } else {
    console.log('❌ Performance: Needs improvement (> 500ms)');
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🧪 ATS Score Lambda Function - Phase 2 Test Suite');
  console.log('==================================================');
  
  try {
    await testUtilityFunctions();
    await testATSScoring();
    await testLambdaHandler();
    await testErrorHandling();
    await testPerformance();
    
    console.log('\n🎉 All tests completed! Check the results above.');
    console.log('\n📋 Test Summary:');
    console.log('✅ = Test passed');
    console.log('❌ = Test failed');
    console.log('⚠️ = Warning/attention needed');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log('\n✅ Test suite execution completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test suite execution failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllTests,
  testUtilityFunctions,
  testATSScoring,
  testLambdaHandler,
  testErrorHandling,
  testPerformance,
  sampleResumes
}; 