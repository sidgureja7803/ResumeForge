# 🚀 ResumeForge Phase 4 - API Gateway Deployment

## 📋 Overview

Phase 4 connects your Lambda functions via **AWS API Gateway** to create publicly accessible REST APIs for your React frontend.

## 🏗️ Architecture

```
React Frontend ↔️ API Gateway ↔️ Lambda Functions ↔️ S3 Bucket
```

**API Endpoints:**
- `POST /api/ats-score` → ATS Score Lambda Function
- `POST /api/generate-pdf` → PDF Generation Lambda Function

## 🛠️ Prerequisites

### 1. AWS Account Setup

```bash
# Install AWS CLI (if not already installed)
curl "https://awscli.amazonaws.com/awscli-exe-macos.dmg" -o "AWSCLIV2.pkg"
# or: brew install awscli

# Configure AWS credentials
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify configuration
aws sts get-caller-identity
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm run install-all

# OR install manually:
npm install                                    # Root dependencies
cd client && npm install && cd ..             # React dependencies
cd lambda/atsScore && npm install && cd ../.. # ATS Lambda
cd lambda/generatePdf && npm install && cd .. # PDF Lambda
```

## 🚀 Deployment Methods

### Method 1: Automated Deployment (Recommended)

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to development environment
./deploy.sh dev us-east-1

# Deploy to production environment  
./deploy.sh prod us-east-1
```

The script will:
- ✅ Install all dependencies
- 🧪 Run tests
- 🚀 Deploy via Serverless Framework
- 📋 Display API Gateway URLs
- 💾 Save API config to React app

### Method 2: Manual Deployment

```bash
# Install Serverless Framework globally
npm install -g serverless

# Deploy specific stage
serverless deploy --stage dev --region us-east-1

# Get deployment info
serverless info --stage dev
```

### Method 3: AWS Console Setup (Manual)

<details>
<summary>Click to expand AWS Console instructions</summary>

#### Step 1: Create Lambda Functions

1. Go to **AWS Lambda Console**
2. Create function: `resumeforge-ats-score-dev`
   - Runtime: Node.js 18.x
   - Upload ZIP: `lambda/atsScore/` directory
   - Handler: `atsScore.handler`
   - Memory: 256 MB, Timeout: 30s

3. Create function: `resumeforge-pdf-generator-dev`
   - Runtime: Node.js 18.x
   - Upload ZIP: `lambda/generatePdf/` directory  
   - Handler: `generatePdf.handler`
   - Memory: 1024 MB, Timeout: 60s

#### Step 2: Create API Gateway

1. Go to **API Gateway Console**
2. Create **HTTP API** (not REST API)
3. Add routes:
   - `POST /api/ats-score` → `resumeforge-ats-score-dev`
   - `POST /api/generate-pdf` → `resumeforge-pdf-generator-dev`

#### Step 3: Configure CORS

```json
{
  "allowOrigins": ["*"],
  "allowHeaders": ["Content-Type", "Authorization"],
  "allowMethods": ["GET", "POST", "OPTIONS"],
  "allowCredentials": false
}
```

#### Step 4: Create S3 Bucket

1. Go to **S3 Console**
2. Create bucket: `resumeforge-pdfs-dev`
3. Enable public read access for generated PDFs

</details>

## 🔧 Configuration

### Environment Variables

The deployment creates these environment variables automatically:

```bash
# Lambda Environment Variables
NODE_ENV=dev
AWS_REGION=us-east-1
S3_BUCKET_NAME=resumeforge-pdfs-dev
```

### React API Configuration

After deployment, the API URL is automatically saved to:

```typescript
// client/src/config/api.ts
export const API_CONFIG = {
  baseUrl: 'https://your-api-id.execute-api.us-east-1.amazonaws.com',
  endpoints: {
    atsScore: '/api/ats-score',
    generatePdf: '/api/generate-pdf'
  }
};
```

## 🧪 Testing the APIs

### 1. Test via React Component

```bash
# Start React dev server
cd client && npm run dev
```

Add the demo component to test APIs:

```tsx
// In your React app
import ExampleAPIUsage from './components/ExampleAPIUsage';

function App() {
  return <ExampleAPIUsage />;
}
```

### 2. Test via cURL

```bash
# ATS Score API
curl -X POST https://your-api-url/api/ats-score \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Software Engineer with React experience",
    "jobDescription": "Seeking React developer with JavaScript skills"
  }'

# PDF Generation API  
curl -X POST https://your-api-url/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<h1>Test Resume</h1><p>Content here</p>",
    "fileName": "test-resume"
  }'
```

### 3. Test via React Hook

```tsx
import { useATS, usePDF } from './hooks';

function TestComponent() {
  const ats = useATS();
  const pdf = usePDF();
  
  const testATS = async () => {
    await ats.calculateScore({
      resumeText: "Developer with React skills",
      jobDescription: "React developer position"
    });
    console.log(ats.data); // Score results
  };

  const testPDF = async () => {
    const url = await pdf.generateAndDownload(
      "<h1>My Resume</h1>", 
      "my-resume"
    );
    console.log("PDF URL:", url);
  };

  return (
    <div>
      <button onClick={testATS}>Test ATS</button>
      <button onClick={testPDF}>Test PDF</button>
    </div>
  );
}
```

## 📊 Monitoring & Debugging

### View Logs

```bash
# ATS Lambda logs
npm run logs:ats

# PDF Lambda logs  
npm run logs:pdf

# All deployment info
npm run info
```

### CloudWatch Logs

- Go to **CloudWatch Console**
- Navigate to **Log Groups**
- Find: `/aws/lambda/resumeforge-ats-score-dev`
- Find: `/aws/lambda/resumeforge-pdf-generator-dev`

### Health Check

```bash
# Test API health
curl https://your-api-url/api/ats-score -X POST \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"test","jobDescription":"test"}'
```

## 🛡️ Security & Permissions

### IAM Permissions (Auto-created)

```yaml
# Lambda Execution Role includes:
- s3:PutObject      # Upload PDFs
- s3:PutObjectAcl   # Set PDF permissions  
- s3:GetObject      # Read PDFs
- logs:*            # CloudWatch logging
```

### API Security

- **CORS**: Configured for browser access
- **Rate Limiting**: Use AWS API Gateway throttling
- **Authentication**: Add API keys if needed

## 💰 Cost Estimation

### AWS Lambda
- **ATS Score**: ~$0.0001 per request
- **PDF Generation**: ~$0.0005 per request

### API Gateway  
- **HTTP API**: $1.00 per million requests

### S3 Storage
- **PDF Storage**: ~$0.023 per GB/month
- **Data Transfer**: First 100GB free

**Hackathon Usage**: Expect ~$1-5 total cost

## 🚨 Troubleshooting

### Common Issues

#### 1. "AWS credentials not configured"
```bash
aws configure
# Enter your AWS credentials
```

#### 2. "Serverless command not found"
```bash
npm install -g serverless
```

#### 3. "CORS error in browser"
- Check API Gateway CORS configuration
- Ensure `OPTIONS` method is enabled

#### 4. "Lambda timeout error"
- Increase timeout in `serverless.yml`
- Check CloudWatch logs for actual error

#### 5. "S3 permission denied"
- Verify IAM role has S3 permissions
- Check bucket policy allows public read

### Debug Steps

1. **Check deployment status:**
   ```bash
   serverless info --stage dev
   ```

2. **Test Lambda directly:**
   ```bash
   serverless invoke -f atsScore --data '{"resumeText":"test","jobDescription":"test"}'
   ```

3. **Check API Gateway:**
   - Go to AWS Console → API Gateway
   - Test routes manually

4. **Verify React config:**
   ```bash
   cat client/src/config/api.ts
   ```

## 🎉 Success Checklist

- ✅ AWS CLI configured
- ✅ Dependencies installed
- ✅ Tests passing
- ✅ Serverless deployment successful
- ✅ API Gateway URLs working
- ✅ React app can call APIs
- ✅ S3 bucket created for PDFs
- ✅ CORS configured correctly

## 📞 Support

If you encounter issues:

1. Check the logs: `npm run logs:ats` or `npm run logs:pdf`
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Test APIs manually with cURL
4. Check CloudWatch logs in AWS Console

---

**🎯 You're now ready to use ResumeForge with full API integration!** 