# ATS Score Calculator Lambda Function - Phase 2

Standalone resume analysis for ATS (Applicant Tracking System) compatibility scoring without job description matching.

## 🎯 Purpose

This Lambda function evaluates resumes based on ATS-friendly formatting and content structure, providing:
- Comprehensive scoring (0-100 scale)
- Detailed feedback for improvements
- Section-by-section analysis
- Formatting compatibility checks
- Content quality assessment

## 📁 Project Structure

```
lambda/atsScore/
├── atsScore.js          # Main Lambda handler
├── utils/
│   └── atsEngine.js     # Core ATS scoring logic
├── test.js              # Comprehensive test suite
├── demo.js              # Interactive demonstration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🔧 Core Features

### 1. **Resume Section Analysis**
- ✅ **Contact Information**: Email, phone number detection
- ✅ **Professional Summary**: Objective/summary section identification
- ✅ **Work Experience**: Experience section with date validation
- ✅ **Education**: Academic background detection
- ✅ **Skills**: Technical skills section identification
- ✅ **Achievements**: Quantifiable accomplishments recognition

### 2. **Formatting Compatibility**
- ❌ **Table Detection**: Identifies ATS-unfriendly tables
- ❌ **Graphics Detection**: Flags images and graphics
- ⚠️ **Special Characters**: Excessive symbol usage warnings
- ✅ **Clean Formatting**: Consistent structure validation

### 3. **Content Quality Assessment**
- 📝 **Word Count**: Optimal length validation (200-800 words)
- 🎯 **Action Verbs**: Achievement-focused language detection
- 🔍 **Industry Keywords**: Relevant technical terms identification

## 🚀 API Interface

### Request Format
```json
POST /api/ats-score
Content-Type: application/json

{
  "resumeText": "John Doe\nSoftware Engineer\njohn@email.com\n..."
}
```

### Response Format
```json
{
  "score": 85,
  "feedback": [
    "🎉 Excellent! Your resume is highly ATS-optimized",
    "✅ Email address found",
    "✅ Phone number found",
    "✅ Professional summary section found",
    "⚠️ Consider adding more quantifiable achievements"
  ],
  "metadata": {
    "timestamp": "2025-06-26T18:40:58.061Z",
    "requestId": "aws-request-id",
    "analysis": {
      "wordCount": 245,
      "sectionsFound": 5,
      "totalSections": 6,
      "rawScore": 102,
      "maxPossible": 120
    }
  }
}
```

### Error Responses
```json
// 400 - Bad Request
{
  "error": "Bad Request",
  "message": "Missing or invalid resumeText field",
  "required": "resumeText must be a non-empty string"
}

// 405 - Method Not Allowed
{
  "error": "Method Not Allowed",
  "message": "Only POST requests are supported"
}
```

## 📊 Scoring Algorithm

### Scoring Breakdown (Max 120 points, normalized to 100)

| Section | Max Points | Criteria |
|---------|------------|----------|
| **Contact** | 20 | Email (10) + Phone (10) |
| **Summary** | 15 | Professional summary/objective present |
| **Experience** | 30 | Work history (25) + Dates (5) |
| **Education** | 15 | Educational background |
| **Skills** | 20 | Technical skills section |
| **Achievements** | 10 | Quantifiable accomplishments |
| **Formatting** | 10 | ATS-friendly formatting bonus |
| **Content Quality** | Variable | Word count, action verbs, keywords |

### Score Interpretation

| Score Range | Assessment | Recommendation |
|-------------|------------|----------------|
| **85-100** | 🎉 Excellent | Highly ATS-optimized |
| **70-84** | 👍 Good | Minor improvements needed |
| **50-69** | ⚠️ Moderate | Several improvements required |
| **0-49** | ❌ Poor | Significant restructuring needed |

## 🧪 Testing

### Run All Tests
```bash
cd lambda/atsScore
node test.js
```

### Test Categories
- ✅ **Utility Functions**: Core logic validation
- ✅ **ATS Scoring**: Algorithm accuracy tests
- ✅ **Lambda Handler**: HTTP request/response validation
- ✅ **Error Handling**: Edge cases and validation
- ✅ **Performance**: Speed and throughput analysis

### Sample Test Results
```
Excellent Resume: ✅ Score: 88/100 (Expected: 80-100)
Poor Resume: ✅ Score: 8/100 (Expected: 0-40)
Performance: ✅ 0.02ms average per analysis
```

## 🎮 Interactive Demo

```bash
node demo.js
```

Features:
- 📄 **Resume Analysis**: Live scoring demonstration
- 🚀 **Lambda Testing**: Handler functionality validation
- ⚡ **Performance Metrics**: Speed benchmarking
- 📡 **API Examples**: Request/response formats

## 🔧 Local Development

### Setup
```bash
cd lambda/atsScore
npm install
```

### Testing Individual Components
```javascript
const { calculateATSScore } = require('./utils/atsEngine');

const result = calculateATSScore(`
John Doe
Software Engineer
john@email.com
(555) 123-4567

EXPERIENCE
Senior Developer | TechCorp | 2020-Present
• Developed scalable applications
• Increased performance by 40%
`);

console.log(`Score: ${result.score}/100`);
console.log('Feedback:', result.feedback);
```

### Manual Testing
```javascript
const { handler } = require('./atsScore');

const testEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({
    resumeText: 'Your resume content here...'
  })
};

const mockContext = {
  awsRequestId: 'test-123',
  getRemainingTimeInMillis: () => 30000
};

handler(testEvent, mockContext)
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

## 🚀 Deployment

### AWS Lambda Configuration
- **Runtime**: Node.js 18.x or later
- **Memory**: 256 MB (recommended)
- **Timeout**: 30 seconds
- **Handler**: `atsScore.handler`

### Environment Variables
```
NODE_ENV=production  # Optional: disables debug output
```

### Dependencies
```json
{
  "name": "ats-score-lambda",
  "version": "2.0.0",
  "dependencies": {
    // No external dependencies required
  }
}
```

## 📈 Performance Characteristics

- **Average Processing Time**: ~0.02ms per resume
- **Throughput**: ~46,000 analyses per second
- **Memory Usage**: <50MB typical
- **Cold Start**: <500ms

## 🔍 Algorithm Details

### Section Detection Logic
```javascript
// Contact Information
const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

// Experience Validation
const experienceKeywords = ['experience', 'employment', 'work history'];
const datePattern = /\b(19|20)\d{2}\b|present|current/gi;
```

### Content Quality Metrics
- **Action Verbs**: achieved, created, developed, implemented, improved...
- **Industry Keywords**: javascript, python, react, aws, agile, scrum...
- **Quantifiers**: percentages, dollar amounts, time savings, team sizes

## 🐛 Troubleshooting

### Common Issues

1. **Low Scores for Good Resumes**
   - Ensure section headers are clear (EXPERIENCE, EDUCATION, SKILLS)
   - Include contact information (email + phone)
   - Add quantifiable achievements

2. **High Scores for Poor Resumes**
   - Check if resume has proper section structure
   - Verify date patterns for experience validation

3. **Performance Issues**
   - Optimize resume text preprocessing
   - Consider caching for repeated analyses

### Debug Mode
```javascript
// Enable detailed logging
process.env.NODE_ENV = 'development';
```

## 🔄 Version History

- **v2.0.0**: Phase 2 - Standalone ATS scoring (current)
- **v1.0.0**: Phase 1 - Job description matching (deprecated)

## 📞 Support

For issues or improvements:
1. Check test results: `node test.js`
2. Run demo: `node demo.js`
3. Review scoring breakdown in response metadata
4. Validate input format and content structure

---

**Ready for Production** ✅  
This implementation is thoroughly tested and optimized for AWS Lambda deployment. 