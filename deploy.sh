#!/bin/bash

# ResumeForge Deployment Script
# Deploys Lambda functions via Serverless Framework

set -e

echo "🚀 Starting ResumeForge deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default stage
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo -e "  Stage: ${YELLOW}$STAGE${NC}"
echo -e "  Region: ${YELLOW}$REGION${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    print_error "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "AWS CLI configured"

# Check if Serverless is installed
if ! command -v serverless &> /dev/null; then
    print_warning "Serverless Framework not found. Installing..."
    npm install -g serverless
fi

print_status "Serverless Framework available"

# Install root dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Install Lambda dependencies
echo -e "${BLUE}📦 Installing Lambda dependencies...${NC}"

# ATS Score Lambda
echo "  Installing atsScore dependencies..."
cd lambda/atsScore
npm install --production
cd ../..

# PDF Generation Lambda
echo "  Installing generatePdf dependencies..."
cd lambda/generatePdf
npm install --production
cd ../..

print_status "All dependencies installed"

# Run tests before deployment
echo -e "${BLUE}🧪 Running tests...${NC}"
if ! npm run test:lambda; then
    print_error "Tests failed. Deployment aborted."
    exit 1
fi

print_status "All tests passed"

# Deploy via Serverless
echo -e "${BLUE}🚀 Deploying to AWS...${NC}"
serverless deploy --stage $STAGE --region $REGION --verbose

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
    
    # Get API Gateway URL
    echo -e "${BLUE}📡 Getting API Gateway URL...${NC}"
    API_URL=$(serverless info --stage $STAGE --region $REGION | grep "endpoint:" | awk '{print $2}' | head -1)
    
    if [ ! -z "$API_URL" ]; then
        echo -e "${GREEN}🌐 API Gateway URL: ${YELLOW}$API_URL${NC}"
        echo ""
        echo -e "${BLUE}📋 Available Endpoints:${NC}"
        echo -e "  🔍 ATS Score:    ${YELLOW}$API_URL/api/ats-score${NC}"
        echo -e "  📄 PDF Generate: ${YELLOW}$API_URL/api/generate-pdf${NC}"
        echo ""
        
        # Save API URL to client config
        echo -e "${BLUE}💾 Saving API URL to client config...${NC}"
        mkdir -p client/src/config
        cat > client/src/config/api.ts << EOF
// Auto-generated API configuration
export const API_CONFIG = {
  baseUrl: '$API_URL',
  endpoints: {
    atsScore: '/api/ats-score',
    generatePdf: '/api/generate-pdf'
  }
};

export const API_BASE_URL = '$API_URL';
EOF
        print_status "API configuration saved to client/src/config/api.ts"
        
    else
        print_warning "Could not retrieve API Gateway URL"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 ResumeForge backend deployed successfully!${NC}"
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo "  1. Update your React app to use the API URL above"
    echo "  2. Test the endpoints with your frontend"
    echo "  3. Monitor logs with: npm run logs:ats or npm run logs:pdf"
    
else
    print_error "Deployment failed"
    exit 1
fi 