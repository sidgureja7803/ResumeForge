# ResumeForge PDF Generator Lambda 📄🚀

A serverless AWS Lambda function that converts HTML resume content to high-quality PDFs and uploads them to S3 for public access.

## 📁 Project Structure

```
lambda/generatePdf/
├── generatePdf.js           # Main Lambda handler
├── utils/
│   └── pdfUtils.js          # PDF generation and S3 upload utilities
├── package.json             # Dependencies and scripts
├── test.js                  # Comprehensive testing suite
└── README.md               # This documentation
```

## 🎯 Features

- **HTML to PDF Conversion**: Uses Puppeteer with Chrome for high-quality PDF generation
- **S3 Integration**: Automatic upload to S3 with public URLs
- **UUID Filenames**: Unique file naming to prevent conflicts
- **CORS Support**: Ready for frontend integration
- **Comprehensive Error Handling**: Proper validation and error responses
- **Production Optimized**: Configured for AWS Lambda environment

## 📋 API Specification

### Endpoint
```
POST /generate-pdf
```

### Request Body
```json
{
  "html": "<div><h1>My Resume</h1><p>Content...</p></div>",
  "fileName": "resume-siddhant"
}
```

### Response Format

#### Success (200)
```json
{
  "success": true,
  "url": "https://resumeforge-pdfs.s3.amazonaws.com/resume-siddhant-uuid.pdf",
  "data": {
    "fileName": "resume-siddhant",
    "pdfUrl": "https://resumeforge-pdfs.s3.amazonaws.com/resume-siddhant-uuid.pdf",
    "s3Key": "resume-siddhant-abc123.pdf",
    "s3Bucket": "resumeforge-pdfs",
    "fileSize": 125840,
    "uploadedAt": "2024-01-15T10:30:00Z"
  },
  "metadata": {
    "requestId": "abc123",
    "processingTime": {
      "total": 2340,
      "pdfGeneration": 1840,
      "s3Upload": 500
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Missing or invalid html field",
  "required": "html must be a non-empty string containing HTML content"
}
```

#### 422 PDF Generation Error
```json
{
  "error": "PDF Generation Error",
  "message": "Failed to generate PDF",
  "details": "PDF generation failed: Navigation timeout",
  "requestId": "abc123"
}
```

#### 502 Upload Error
```json
{
  "error": "Upload Error",
  "message": "Failed to generate PDF",
  "details": "S3 upload failed: Access denied",
  "requestId": "abc123"
}
```

## 🧪 Local Testing

### Prerequisites
```bash
# Install dependencies (for local testing only)
npm install
```

### Run Tests
```bash
cd lambda/generatePdf
node test.js
```

### Expected Test Output
```
🚀 Starting PDF Generator Lambda Function Tests...

Test 1: Utility Functions
============================================================
HTML Validation:
  Valid HTML: true
  Invalid HTML: false
  Empty HTML: false
Filename Sanitization:
  Normal: resume-siddhant
  Special chars: resume-2024-pdf
  Spaces: my-resume-file
  Empty: resume
  HTML wrapped length: 1547
✅ Utility functions test passed

Test 2: PDF Generation (Local)
============================================================
  ⚠️ PDF generation skipped (dependencies not available)
  Error: Could not find Chrome (ver. 119.0.6045.105)

Test 3: Lambda Handler - Success Case (Mocked)
============================================================
  Status Code: 200
  Response Headers: [ 'Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods' ]
  Response Data: {
    success: true,
    url: 'https://resumeforge-pdfs-test.s3.amazonaws.com/test-resume-mock-uuid.pdf',
    fileName: 'test-resume',
    fileSize: 1234
  }
✅ Lambda success case test passed

🎉 All tests completed successfully!
```

## 🚀 Deployment

### 1. Install Dependencies for Lambda
```bash
cd lambda/generatePdf
npm install --production
```

### 2. Create S3 Bucket
```bash
aws s3 mb s3://resumeforge-pdfs
aws s3api put-bucket-policy --bucket resumeforge-pdfs --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::resumeforge-pdfs/*"
  }]
}'
```

### 3. Package Lambda Function
```bash
npm run package
```

### 4. Create Lambda Function
```bash
aws lambda create-function \
  --function-name resumeforge-pdf-generator \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler generatePdf.handler \
  --zip-file fileb://pdf-lambda.zip \
  --timeout 60 \
  --memory-size 1024 \
  --environment Variables='{
    "S3_BUCKET_NAME":"resumeforge-pdfs",
    "AWS_REGION":"us-east-1"
  }'
```

### 5. Deploy Updates
```bash
npm run deploy
```

## ⚙️ Configuration

### Environment Variables
- `S3_BUCKET_NAME`: S3 bucket name for PDF storage (default: `resumeforge-pdfs`)
- `AWS_REGION`: AWS region (default: `us-east-1`)
- `NODE_ENV`: Set to `development` for detailed error messages

### Lambda Settings
- **Runtime**: Node.js 18.x
- **Memory**: 1024 MB (recommended for Puppeteer)
- **Timeout**: 60 seconds
- **Handler**: `generatePdf.handler`

### Required IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::resumeforge-pdfs/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

## 🔧 Technical Details

### PDF Generation Process
1. **Input Validation**: Validates HTML content and filename
2. **HTML Enhancement**: Wraps content with optimized CSS for PDF
3. **Puppeteer Launch**: Starts headless Chrome in Lambda environment
4. **PDF Generation**: Converts HTML to PDF with A4 format and proper margins
5. **S3 Upload**: Uploads PDF with unique UUID filename
6. **Public URL**: Returns publicly accessible S3 URL

### Dependencies
- **`puppeteer-core`**: Headless Chrome automation
- **`@sparticuz/chromium`**: Chrome binary optimized for Lambda
- **`aws-sdk`**: AWS S3 integration
- **`uuid`**: Unique filename generation

### Performance Optimization
- Chrome binary optimized for Lambda environment
- Minimal PDF generation options for speed
- S3 upload with proper caching headers
- Efficient memory usage patterns

## 🔄 Frontend Integration

### React/JavaScript Example
```javascript
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
      
      // Or trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return data.url;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

// Usage in React component
const handleGeneratePDF = async () => {
  try {
    setLoading(true);
    const resumeHTML = document.getElementById('resume-preview').innerHTML;
    const pdfUrl = await generateResumePDF(resumeHTML, 'my-resume');
    setSuccessMessage(`PDF generated: ${pdfUrl}`);
  } catch (error) {
    setErrorMessage(`Failed to generate PDF: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### Node.js/Express Backend Example
```javascript
const axios = require('axios');

app.post('/api/generate-resume-pdf', async (req, res) => {
  try {
    const { html, fileName } = req.body;
    
    const response = await axios.post('https://your-lambda-url/generate-pdf', {
      html,
      fileName
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'PDF generation failed',
      details: error.response?.data || error.message
    });
  }
});
```

## 📊 Performance Metrics

- **Cold Start**: ~3-5 seconds (includes Chrome initialization)
- **Warm Start**: ~2-3 seconds
- **PDF Generation**: ~1-2 seconds (varies by content complexity)
- **S3 Upload**: ~0.5-1 second
- **Memory Usage**: ~300-500 MB
- **Max PDF Size**: ~10 MB (typical resume: 100-200 KB)

## 🔒 Security Considerations

- HTML content validation to prevent XSS
- File size limits to prevent abuse
- Unique UUID filenames prevent conflicts
- Public S3 URLs with cache headers
- No sensitive data logging
- Request ID tracking for debugging

## 🐛 Troubleshooting

### Common Issues

1. **Chrome Binary Not Found**
   ```
   Error: Could not find Chrome
   ```
   - Ensure `@sparticuz/chromium` is installed
   - Check Lambda memory allocation (1024 MB minimum)

2. **S3 Upload Permission Denied**
   ```
   Error: S3 upload failed: Access denied
   ```
   - Verify IAM role has S3 permissions
   - Check bucket policy allows public read

3. **Lambda Timeout**
   ```
   Error: Task timed out after 30.00 seconds
   ```
   - Increase Lambda timeout to 60 seconds
   - Optimize HTML content size

4. **PDF Generation Failed**
   ```
   Error: Navigation timeout
   ```
   - Check HTML validity
   - Ensure proper CSS formatting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test locally with `npm test`
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**ResumeForge Team** | Hackathon Project Phase 3 🏆 