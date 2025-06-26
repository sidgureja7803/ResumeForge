/**
 * AWS Lambda Function: ATS Score Calculator
 * Handles resume-job description matching and scoring
 */

const { calculateATSScore } = require('./utils/scoreEngine');

/**
 * Main Lambda handler function
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @returns {Object} - HTTP response with ATS score results
 */
exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  try {
    console.log('ATS Score Lambda invoked:', {
      httpMethod: event.httpMethod,
      requestId: context.awsRequestId
    });

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight successful' })
      };
    }

    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          error: 'Method Not Allowed',
          message: 'Only POST requests are supported',
          allowedMethods: ['POST']
        })
      };
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid JSON in request body',
          details: parseError.message
        })
      };
    }

    // Validate required fields
    const { resumeText, jobDescription } = requestBody;
    
    if (!resumeText || typeof resumeText !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Missing or invalid resumeText field',
          required: 'resumeText must be a non-empty string'
        })
      };
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Missing or invalid jobDescription field',
          required: 'jobDescription must be a non-empty string'
        })
      };
    }

    // Validate text length (prevent abuse)
    const MAX_TEXT_LENGTH = 50000; // 50KB limit
    if (resumeText.length > MAX_TEXT_LENGTH || jobDescription.length > MAX_TEXT_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Text content too large',
          maxLength: MAX_TEXT_LENGTH,
          currentLengths: {
            resumeText: resumeText.length,
            jobDescription: jobDescription.length
          }
        })
      };
    }

    // Calculate ATS score
    console.log('Calculating ATS score...', {
      resumeLength: resumeText.length,
      jobDescriptionLength: jobDescription.length
    });

    const scoreResult = calculateATSScore(resumeText, jobDescription);

    // Add metadata to response
    const response = {
      success: true,
      data: {
        score: scoreResult.score,
        matchedKeywords: scoreResult.matchedKeywords,
        missingKeywords: scoreResult.missingKeywords,
        analysis: {
          totalJdKeywords: scoreResult.totalJdKeywords,
          totalResumeKeywords: scoreResult.totalResumeKeywords,
          matchPercentage: scoreResult.score,
          keywordCoverage: `${scoreResult.matchedKeywords.length}/${scoreResult.totalJdKeywords}`
        }
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId,
        processingTimeMs: context.getRemainingTimeInMillis ? 
          (context.getRemainingTimeInMillis() - context.getRemainingTimeInMillis()) : null
      }
    };

    console.log('ATS score calculated successfully:', {
      score: scoreResult.score,
      matchedCount: scoreResult.matchedKeywords.length,
      missingCount: scoreResult.missingKeywords.length
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Lambda execution error:', {
      error: error.message,
      stack: error.stack,
      requestId: context.awsRequestId
    });

    // Return appropriate error response
    const statusCode = error.message.includes('calculate ATS score') ? 500 : 400;
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to process ATS score request',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString()
      })
    };
  }
};

/**
 * Local testing helper function
 * @param {string} resumeText - Resume content
 * @param {string} jobDescription - Job description content
 * @returns {Object} - Mock Lambda response
 */
async function testLocally(resumeText, jobDescription) {
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ resumeText, jobDescription })
  };
  
  const mockContext = {
    awsRequestId: 'test-request-' + Date.now(),
    getRemainingTimeInMillis: () => 30000
  };

  return await exports.handler(mockEvent, mockContext);
}

// Export for local testing
if (process.env.NODE_ENV === 'development') {
  module.exports.testLocally = testLocally;
} 