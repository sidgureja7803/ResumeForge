/**
 * AWS Lambda Function: PDF Generator for ResumeForge
 * Converts HTML resume content to PDF and uploads to S3
 */

const { 
  renderPdfToBuffer, 
  uploadToS3, 
  validateHtml, 
  sanitizeFileName, 
  wrapHtmlForPdf 
} = require('./utils/pdfUtils');

/**
 * Main Lambda handler function
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @returns {Object} - HTTP response with PDF URL or error
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
    console.log('PDF Generator Lambda invoked:', {
      httpMethod: event.httpMethod,
      requestId: context.awsRequestId,
      remainingTime: context.getRemainingTimeInMillis()
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
    const { html, fileName } = requestBody;
    
    if (!html || typeof html !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Missing or invalid html field',
          required: 'html must be a non-empty string containing HTML content'
        })
      };
    }

    // Validate HTML content
    if (!validateHtml(html)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid HTML content',
          details: 'HTML must contain valid markup with elements like <html>, <body>, or <div>'
        })
      };
    }

    // Validate and sanitize filename
    const sanitizedFileName = sanitizeFileName(fileName) || 'resume';
    
    // Validate content length (prevent abuse)
    const MAX_HTML_LENGTH = 500000; // 500KB limit
    if (html.length > MAX_HTML_LENGTH) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'HTML content too large',
          maxLength: MAX_HTML_LENGTH,
          currentLength: html.length
        })
      };
    }

    console.log('Starting PDF generation process:', {
      fileName: sanitizedFileName,
      htmlLength: html.length,
      requestId: context.awsRequestId
    });

    // Wrap HTML with proper styling for PDF
    const wrappedHtml = wrapHtmlForPdf(html);

    // Generate PDF from HTML
    const startTime = Date.now();
    const pdfBuffer = await renderPdfToBuffer(wrappedHtml, {
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    const pdfGenerationTime = Date.now() - startTime;

    console.log(`PDF generated in ${pdfGenerationTime}ms, size: ${pdfBuffer.length} bytes`);

    // Upload PDF to S3
    const uploadStartTime = Date.now();
    const uploadResult = await uploadToS3(pdfBuffer, sanitizedFileName, {
      makePublic: true,
      metadata: {
        'generated-by': 'resumeforge-lambda',
        'request-id': context.awsRequestId,
        'generated-at': new Date().toISOString()
      }
    });
    const uploadTime = Date.now() - uploadStartTime;

    console.log(`S3 upload completed in ${uploadTime}ms`);

    // Prepare success response
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
        processingTime: {
          total: Date.now() - startTime,
          pdfGeneration: pdfGenerationTime,
          s3Upload: uploadTime
        },
        timestamp: new Date().toISOString()
      }
    };

    console.log('PDF generation and upload successful:', {
      url: uploadResult.url,
      size: uploadResult.size,
      totalTime: Date.now() - startTime
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

    // Determine appropriate status code based on error type
    let statusCode = 500;
    let errorType = 'Internal Server Error';
    
    if (error.message.includes('PDF generation failed')) {
      statusCode = 422;
      errorType = 'PDF Generation Error';
    } else if (error.message.includes('S3 upload failed')) {
      statusCode = 502;
      errorType = 'Upload Error';
    } else if (error.message.includes('timeout') || error.message.includes('TimeoutError')) {
      statusCode = 504;
      errorType = 'Timeout Error';
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: errorType,
        message: 'Failed to generate PDF',
        details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
        requestId: context.awsRequestId,
        timestamp: new Date().toISOString()
      })
    };
  }
};

/**
 * Local testing helper function
 * @param {string} html - HTML content to convert
 * @param {string} fileName - Desired filename
 * @returns {Object} - Mock Lambda response
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

  return await exports.handler(mockEvent, mockContext);
}

// Export for local testing
if (process.env.NODE_ENV === 'development') {
  module.exports.testLocally = testLocally;
} 