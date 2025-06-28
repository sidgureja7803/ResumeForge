/**
 * AWS Lambda Function: ATS Score Calculator - Phase 2
 * Standalone resume analysis for ATS compatibility scoring
 */

const { calculateATSScore } = require('./utils/atsEngine');

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
    console.log('ATS Score Lambda invoked (Phase 2):', {
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

    // Validate required field
    const { resumeText } = requestBody;
    
    if (!resumeText || typeof resumeText !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Missing or invalid resumeText field',
          required: 'resumeText must be a non-empty string',
          example: {
            resumeText: "John Doe\\nSoftware Engineer\\nemail@example.com\\n..."
          }
        })
      };
    }

    // Validate text length (prevent abuse)
    const MAX_TEXT_LENGTH = 50000; // 50KB limit
    if (resumeText.length > MAX_TEXT_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Resume text content too large',
          maxLength: MAX_TEXT_LENGTH,
          currentLength: resumeText.length
        })
      };
    }

    // Validate minimum content
    if (resumeText.trim().length < 50) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Resume text too short',
          minLength: 50,
          currentLength: resumeText.trim().length
        })
      };
    }

    // Calculate ATS score
    console.log('Calculating ATS score for resume...', {
      resumeLength: resumeText.length,
      wordCount: resumeText.split(/\s+/).length
    });

    const scoreResult = calculateATSScore(resumeText);

    // Structure response according to Phase 2 requirements
    const response = {
      score: scoreResult.score,
      feedback: scoreResult.feedback,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId,
        analysis: {
          wordCount: scoreResult.breakdown.content.wordCount,
          sectionsFound: Object.keys(scoreResult.breakdown.sections).filter(
            key => scoreResult.breakdown.sections[key].found
          ).length,
          totalSections: Object.keys(scoreResult.breakdown.sections).length,
          rawScore: scoreResult.breakdown.rawScore,
          maxPossible: scoreResult.breakdown.maxPossible
        }
      }
    };

    console.log('ATS score calculated successfully:', {
      score: scoreResult.score,
      feedbackCount: scoreResult.feedback.length,
      sectionsAnalyzed: Object.keys(scoreResult.breakdown.sections).length
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

    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    
    if (error.message.includes('Invalid resume text') || 
        error.message.includes('ATS score calculation failed')) {
      statusCode = 400;
      errorMessage = 'Bad Request';
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
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
 * @returns {Object} - Mock Lambda response
 */
async function testLocally(resumeText) {
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ resumeText })
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