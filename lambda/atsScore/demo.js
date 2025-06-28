/**
 * ATS Score Lambda Function Demo - Phase 2
 * Demonstrates standalone resume analysis capabilities
 */

const { handler } = require('./atsScore');
const { calculateATSScore } = require('./utils/atsEngine');

// Sample resumes for demonstration
const sampleResumes = {
  excellent: `
John Doe
Senior Software Engineer
john.doe@example.com | (555) 123-4567
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 7+ years developing scalable web applications
and leading cross-functional teams. Proven track record of increasing system 
performance and delivering high-quality solutions.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2020 - Present
• Developed microservices architecture using Node.js and React, serving 1M+ users
• Increased application performance by 45% through database optimization
• Led team of 6 developers on critical product launches
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | StartupXYZ | 2018 - 2020
• Built responsive web applications using JavaScript, HTML5, and CSS3
• Designed and implemented RESTful APIs handling 10K+ requests per minute
• Collaborated with UX team to improve user engagement by 30%

Junior Developer | WebSolutions | 2017 - 2018
• Maintained legacy PHP applications and migrated to modern frameworks
• Optimized database queries reducing page load time by 25%

EDUCATION
Bachelor of Science in Computer Science | State University | 2017
• Graduated Magna Cum Laude, GPA: 3.8/4.0
• Relevant coursework: Data Structures, Algorithms, Software Engineering

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, PHP
Frontend: React, Vue.js, Angular, HTML5, CSS3, SASS
Backend: Node.js, Express, Django, Spring Boot
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Terraform
Tools: Git, Jira, Agile/Scrum methodologies

ACHIEVEMENTS
• AWS Certified Solutions Architect - Professional (2022)
• Led development of award-winning mobile app with 500K+ downloads
• Speaker at TechConf 2021: "Microservices Best Practices"
• Mentored 15+ junior developers through company program
  `,
  
  moderate: `
Sarah Johnson
Web Developer
sarah.j@email.com

SUMMARY
Web developer with some experience in building websites and applications.

EXPERIENCE
Frontend Developer | Local Agency | 2021 - 2023
- Worked on various client websites using HTML, CSS, and JavaScript
- Fixed bugs and added new features to existing sites
- Worked with team members on projects

Intern | Tech Company | 2020
- Helped with testing and documentation
- Learned about web development tools

EDUCATION
Computer Science Degree | Community College | 2020

SKILLS
HTML, CSS, JavaScript, some React
Basic knowledge of databases
  `,
  
  poor: `
Mike Worker
Looking for programming job

I have done some coding and know computers.
Worked at places doing computer stuff.
Want to get better job in tech.

Experience:
- Did programming things 2019-2022
- Made websites sometimes
- Fixed computer problems

School:
Went to college for computer stuff

Skills:
Know how to use computers and type fast
  `
};

/**
 * Demonstrates direct ATS scoring
 */
async function demonstrateDirectScoring() {
  console.log('🎯 ATS Scoring Engine Demo - Phase 2');
  console.log('=====================================\n');
  
  const testCases = [
    { name: 'Excellent Resume (Expected: 85-95)', resume: sampleResumes.excellent },
    { name: 'Moderate Resume (Expected: 50-70)', resume: sampleResumes.moderate },
    { name: 'Poor Resume (Expected: 10-30)', resume: sampleResumes.poor }
  ];
  
  for (const testCase of testCases) {
    console.log(`📄 ${testCase.name}`);
    console.log('='.repeat(50));
    
    try {
      const result = calculateATSScore(testCase.resume);
      
      console.log(`📊 ATS Score: ${result.score}/100`);
      console.log(`📈 Raw Score: ${result.breakdown.rawScore}/${result.breakdown.maxPossible}`);
      console.log(`📝 Word Count: ${result.breakdown.content.wordCount}`);
      
      // Show section breakdown
      console.log('\n📋 Section Analysis:');
      Object.entries(result.breakdown.sections).forEach(([section, data]) => {
        const status = data.found ? '✅' : '❌';
        console.log(`   ${status} ${section.toUpperCase()}: ${data.score} points`);
      });
      
      // Show top feedback
      console.log('\n💡 Key Feedback:');
      result.feedback.slice(0, 5).forEach(feedback => {
        console.log(`   ${feedback}`);
      });
      
      console.log('\n' + '-'.repeat(60) + '\n');
      
    } catch (error) {
      console.error('❌ Error scoring resume:', error.message);
    }
  }
}

/**
 * Demonstrates Lambda handler functionality
 */
async function demonstrateLambdaHandler() {
  console.log('🚀 Lambda Handler Demo');
  console.log('======================\n');
  
  const mockContext = {
    awsRequestId: 'demo-request-' + Date.now(),
    getRemainingTimeInMillis: () => 30000
  };
  
  // Test successful request
  console.log('✅ Testing successful ATS analysis...');
  const successEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ 
      resumeText: sampleResumes.moderate 
    })
  };
  
  try {
    const response = await handler(successEvent, mockContext);
    const data = JSON.parse(response.body);
    
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Score: ${data.score}/100`);
    console.log(`   Feedback Items: ${data.feedback?.length || 0}`);
    console.log(`   Request ID: ${data.metadata?.requestId}\n`);
    
  } catch (error) {
    console.error('❌ Success test failed:', error.message);
  }
  
  // Test validation errors
  console.log('⚠️ Testing validation errors...');
  const errorTests = [
    {
      name: 'Missing resumeText',
      event: { httpMethod: 'POST', body: JSON.stringify({}) }
    },
    {
      name: 'Invalid JSON',
      event: { httpMethod: 'POST', body: 'invalid json' }
    },
    {
      name: 'Wrong HTTP method',
      event: { httpMethod: 'GET', body: JSON.stringify({ resumeText: 'test' }) }
    },
    {
      name: 'Resume too short',
      event: { httpMethod: 'POST', body: JSON.stringify({ resumeText: 'Short' }) }
    }
  ];
  
  for (const test of errorTests) {
    try {
      const response = await handler(test.event, mockContext);
      const data = JSON.parse(response.body);
      console.log(`   ${test.name}: Status ${response.statusCode} - ${data.message}`);
    } catch (error) {
      console.log(`   ${test.name}: Error - ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Performance comparison demo
 */
async function demonstratePerformance() {
  console.log('⚡ Performance Analysis');
  console.log('=======================\n');
  
  const iterations = 100;
  const testResume = sampleResumes.moderate;
  
  // Time the scoring engine
  console.log(`🔄 Running ${iterations} scoring iterations...`);
  const start = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    calculateATSScore(testResume);
  }
  
  const end = process.hrtime.bigint();
  const totalTime = Number(end - start) / 1000000; // Convert to milliseconds
  const avgTime = totalTime / iterations;
  
  console.log(`✅ Performance Results:`);
  console.log(`   Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`   Average time: ${avgTime.toFixed(2)}ms per analysis`);
  console.log(`   Throughput: ${(1000 / avgTime).toFixed(0)} analyses per second`);
  
  if (avgTime < 10) {
    console.log('🎉 Excellent performance - suitable for real-time use');
  } else if (avgTime < 50) {
    console.log('👍 Good performance - acceptable for most use cases');
  } else {
    console.log('⚠️ Consider optimization for high-volume usage');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * API Response Format Demo
 */
function demonstrateAPIResponse() {
  console.log('📡 API Response Format Demo');
  console.log('===========================\n');
  
  const result = calculateATSScore(sampleResumes.excellent);
  
  // Show the exact format returned by the Lambda
  const apiResponse = {
    score: result.score,
    feedback: result.feedback,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: 'demo-request-123',
      analysis: {
        wordCount: result.breakdown.content.wordCount,
        sectionsFound: Object.keys(result.breakdown.sections).filter(
          key => result.breakdown.sections[key].found
        ).length,
        totalSections: Object.keys(result.breakdown.sections).length,
        rawScore: result.breakdown.rawScore,
        maxPossible: result.breakdown.maxPossible
      }
    }
  };
  
  console.log('📋 Complete API Response Structure:');
  console.log(JSON.stringify(apiResponse, null, 2));
  
  console.log('\n📝 Integration Example:');
  console.log(`
// POST /api/ats-score
{
  "resumeText": "John Doe\\nSoftware Engineer\\n..."
}

// Response (200 OK)
{
  "score": ${apiResponse.score},
  "feedback": [
    "${apiResponse.feedback[0]}",
    "${apiResponse.feedback[1]}",
    "... more feedback items"
  ],
  "metadata": {
    "timestamp": "${apiResponse.metadata.timestamp}",
    "analysis": {
      "wordCount": ${apiResponse.metadata.analysis.wordCount},
      "sectionsFound": ${apiResponse.metadata.analysis.sectionsFound},
      "totalSections": ${apiResponse.metadata.analysis.totalSections}
    }
  }
}
  `);
}

/**
 * Main demo runner
 */
async function runDemo() {
  try {
    await demonstrateDirectScoring();
    await demonstrateLambdaHandler();
    await demonstratePerformance();
    demonstrateAPIResponse();
    
    console.log('🎉 Demo completed successfully!');
    console.log('\n🚀 Ready for deployment to AWS Lambda');
    console.log('📖 See README.md for deployment instructions');
    
  } catch (error) {
    console.error('💥 Demo failed:', error);
    process.exit(1);
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = {
  demonstrateDirectScoring,
  demonstrateLambdaHandler,
  demonstratePerformance,
  demonstrateAPIResponse,
  sampleResumes
}; 