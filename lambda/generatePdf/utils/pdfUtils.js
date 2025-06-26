/**
 * PDF Utilities for ResumeForge
 * Handles PDF generation from HTML and S3 upload functionality
 */

const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'resumeforge-pdfs';

/**
 * Renders HTML content to PDF buffer using Puppeteer
 * @param {string} html - HTML content to convert to PDF
 * @param {Object} options - PDF generation options
 * @returns {Promise<Buffer>} - PDF as buffer
 */
async function renderPdfToBuffer(html, options = {}) {
  let browser = null;
  
  try {
    console.log('Starting PDF generation with Puppeteer...');
    
    // Launch browser with optimized settings for Lambda
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Set content with proper encoding
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Default PDF options optimized for resumes
    const defaultOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    };

    // Merge with custom options
    const pdfOptions = { ...defaultOptions, ...options };
    
    console.log('Generating PDF with options:', pdfOptions);
    
    // Generate PDF buffer
    const pdfBuffer = await page.pdf(pdfOptions);
    
    console.log(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Uploads PDF buffer to S3 bucket
 * @param {Buffer} pdfBuffer - PDF content as buffer
 * @param {string} fileName - Base filename (without extension)
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
async function uploadToS3(pdfBuffer, fileName, options = {}) {
  try {
    // Generate unique filename with UUID
    const uniqueId = uuidv4();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_]/g, '-');
    const key = `${sanitizedFileName}-${uniqueId}.pdf`;
    
    console.log(`Uploading PDF to S3: ${BUCKET_NAME}/${key}`);
    
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename="${sanitizedFileName}.pdf"`,
      CacheControl: 'max-age=31536000', // 1 year cache
      ...options
    };

    // Make public if specified
    if (options.makePublic !== false) {
      uploadParams.ACL = 'public-read';
    }

    const result = await s3.upload(uploadParams).promise();
    
    const response = {
      url: result.Location,
      bucket: result.Bucket,
      key: result.Key,
      etag: result.ETag,
      size: pdfBuffer.length,
      uploadedAt: new Date().toISOString()
    };
    
    console.log('S3 upload successful:', {
      url: response.url,
      size: response.size,
      key: response.key
    });
    
    return response;
    
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Generates a pre-signed URL for private S3 objects
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - Pre-signed URL
 */
async function generatePresignedUrl(key, expiresIn = 3600) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn
    };
    
    const url = await s3.getSignedUrlPromise('getObject', params);
    
    console.log(`Generated pre-signed URL for ${key}, expires in ${expiresIn}s`);
    
    return url;
    
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error(`Pre-signed URL generation failed: ${error.message}`);
  }
}

/**
 * Validates HTML content for PDF generation
 * @param {string} html - HTML content to validate
 * @returns {boolean} - True if valid
 */
function validateHtml(html) {
  if (!html || typeof html !== 'string') {
    return false;
  }
  
  // Basic HTML validation
  const hasHtmlTags = html.includes('<html') || html.includes('<body') || html.includes('<div');
  const isNotEmpty = html.trim().length > 0;
  
  return hasHtmlTags && isNotEmpty;
}

/**
 * Sanitizes filename for safe S3 storage
 * @param {string} fileName - Original filename
 * @returns {string} - Sanitized filename
 */
function sanitizeFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return 'resume';
  }
  
  return fileName
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .substring(0, 50) || 'resume';
}

/**
 * Enhanced HTML wrapper for better PDF generation
 * @param {string} content - HTML content
 * @returns {string} - Wrapped HTML with proper styles
 */
function wrapHtmlForPdf(content) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        .page-break {
            page-break-before: always;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .no-print {
                display: none !important;
            }
        }
        /* Resume specific styles */
        h1, h2, h3 {
            color: #2c3e50;
            margin-bottom: 0.5em;
        }
        h1 {
            font-size: 24px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.3em;
        }
        h2 {
            font-size: 18px;
            margin-top: 1em;
        }
        h3 {
            font-size: 14px;
        }
        p {
            margin-bottom: 0.5em;
        }
        ul {
            margin-left: 1.5em;
            margin-bottom: 0.5em;
        }
        .contact-info {
            text-align: center;
            margin-bottom: 1em;
            padding: 0.5em;
            background-color: #f8f9fa;
        }
        .section {
            margin-bottom: 1.5em;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
}

module.exports = {
  renderPdfToBuffer,
  uploadToS3,
  generatePresignedUrl,
  validateHtml,
  sanitizeFileName,
  wrapHtmlForPdf
}; 