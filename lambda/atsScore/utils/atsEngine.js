/**
 * ATS Engine for ResumeForge Phase 2
 * Standalone resume analysis without job description matching
 * Scores resumes based on ATS-friendly formatting and content structure
 */

/**
 * Extracts and analyzes resume information for ATS compatibility
 * @param {string} resumeText - Raw resume text content
 * @returns {Object} - Extracted resume information and analysis
 */
function extractResumeInfo(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    throw new Error('Invalid resume text provided');
  }

  const text = resumeText.toLowerCase();
  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  return {
    originalText: resumeText,
    cleanText: text,
    lines: lines,
    wordCount: resumeText.split(/\s+/).length,
    lineCount: lines.length
  };
}

/**
 * Checks for presence of key resume sections
 * @param {Object} resumeInfo - Extracted resume information
 * @returns {Object} - Section analysis with scores
 */
function checkResumeSections(resumeInfo) {
  const { cleanText, lines } = resumeInfo;
  const sections = {
    contact: { found: false, score: 0, feedback: [] },
    summary: { found: false, score: 0, feedback: [] },
    experience: { found: false, score: 0, feedback: [] },
    education: { found: false, score: 0, feedback: [] },
    skills: { found: false, score: 0, feedback: [] },
    achievements: { found: false, score: 0, feedback: [] }
  };

  // Check for contact information
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  if (emailPattern.test(resumeInfo.originalText)) {
    sections.contact.found = true;
    sections.contact.score += 10;
    sections.contact.feedback.push("✅ Email address found");
  } else {
    sections.contact.feedback.push("❌ No email address found");
  }

  if (phonePattern.test(resumeInfo.originalText)) {
    sections.contact.score += 10;
    sections.contact.feedback.push("✅ Phone number found");
  } else {
    sections.contact.feedback.push("❌ No phone number found");
  }

  // Check for summary/objective section
  const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
  if (summaryKeywords.some(keyword => cleanText.includes(keyword))) {
    sections.summary.found = true;
    sections.summary.score = 15;
    sections.summary.feedback.push("✅ Professional summary section found");
  } else {
    sections.summary.feedback.push("❌ Missing professional summary/objective section");
  }

  // Check for experience section (more strict detection)
  const experienceKeywords = ['experience', 'employment', 'work history', 'career', 'professional experience'];
  const experienceFound = experienceKeywords.some(keyword => cleanText.includes(keyword));
  const datePattern = /\b(19|20)\d{2}\b|present|current/gi;
  const hasDates = datePattern.test(resumeInfo.originalText);
  
  // Need both keyword AND date pattern for meaningful experience
  if (experienceFound && hasDates) {
    sections.experience.found = true;
    sections.experience.score = 25;
    sections.experience.feedback.push("✅ Work experience section found");
    sections.experience.score += 5;
    sections.experience.feedback.push("✅ Employment dates included");
  } else if (hasDates && resumeInfo.wordCount > 100) {
    // If has dates but no explicit keyword, give partial credit for longer resumes
    sections.experience.found = true;
    sections.experience.score = 15;
    sections.experience.feedback.push("✅ Work experience with dates found");
  } else {
    sections.experience.feedback.push("❌ No clear work experience section found");
  }

  // Check for education section (stricter detection)
  const educationKeywords = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma'];
  const schoolKeywords = ['school', 'institute', 'academy'];
  const hasEducationKeyword = educationKeywords.some(keyword => cleanText.includes(keyword));
  const hasSchoolKeyword = schoolKeywords.some(keyword => cleanText.includes(keyword));
  
  if (hasEducationKeyword || (hasSchoolKeyword && resumeInfo.wordCount > 50)) {
    sections.education.found = true;
    sections.education.score = 15;
    sections.education.feedback.push("✅ Education section found");
  } else {
    sections.education.feedback.push("❌ No education section found");
  }

  // Check for skills section (more precise detection)
  const skillsKeywords = ['skills', 'technical skills', 'core competencies', 'technologies', 'programming languages'];
  const toolsKeywords = ['tools', 'software', 'programming'];
  const hasSkillsKeyword = skillsKeywords.some(keyword => cleanText.includes(keyword));
  const hasToolsKeyword = toolsKeywords.some(keyword => cleanText.includes(keyword));
  
  // Only count if explicitly mentions skills or has tools with good context
  if (hasSkillsKeyword || (hasToolsKeyword && resumeInfo.wordCount > 100)) {
    sections.skills.found = true;
    sections.skills.score = 20;
    sections.skills.feedback.push("✅ Skills section found");
  } else {
    sections.skills.feedback.push("❌ No dedicated skills section found");
  }

  // Check for achievements/accomplishments
  const achievementKeywords = ['achievements', 'accomplishments', 'awards', 'recognition', 'projects'];
  const quantifiers = /\b\d+%|\$\d+|increased|improved|reduced|generated|saved\b/gi;
  
  if (achievementKeywords.some(keyword => cleanText.includes(keyword)) || quantifiers.test(resumeInfo.originalText)) {
    sections.achievements.found = true;
    sections.achievements.score = 10;
    sections.achievements.feedback.push("✅ Achievements or quantifiable results found");
  } else {
    sections.achievements.feedback.push("⚠️ Consider adding quantifiable achievements");
  }

  return sections;
}

/**
 * Checks for ATS-unfriendly formatting issues
 * @param {Object} resumeInfo - Extracted resume information
 * @returns {Object} - Formatting analysis with deductions
 */
function checkFormattingIssues(resumeInfo) {
  const { originalText, lines } = resumeInfo;
  const issues = {
    tablesDetected: false,
    graphicsDetected: false,
    specialCharacters: false,
    inconsistentFormatting: false,
    score: 0,
    feedback: []
  };

  // Simulate table detection (look for multiple tabs or pipe characters)
  const tableIndicators = /\t{2,}|\|.*\||\+[-=+]+\+/;
  if (tableIndicators.test(originalText)) {
    issues.tablesDetected = true;
    issues.score -= 10;
    issues.feedback.push("⚠️ Possible table formatting detected - may not parse well in ATS");
  }

  // Simulate graphics detection (look for common image-related text)
  const graphicsIndicators = /\[(image|photo|logo|graphic)\]|\.jpg|\.png|\.gif/i;
  if (graphicsIndicators.test(originalText)) {
    issues.graphicsDetected = true;
    issues.score -= 15;
    issues.feedback.push("❌ Graphics or images detected - ATS cannot process these");
  }

  // Check for excessive special characters
  const specialCharCount = (originalText.match(/[★☆♦♣♠♥]/g) || []).length;
  if (specialCharCount > 5) {
    issues.specialCharacters = true;
    issues.score -= 5;
    issues.feedback.push("⚠️ Excessive special characters may confuse ATS systems");
  }

  // Check for consistent formatting (line length variance)
  const lineLengths = lines.map(line => line.length);
  const avgLength = lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length;
  const variance = lineLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lineLengths.length;
  
  if (variance > 2000) {
    issues.inconsistentFormatting = true;
    issues.score -= 5;
    issues.feedback.push("⚠️ Inconsistent line formatting detected");
  }

  // Add positive feedback for good formatting
  if (!issues.tablesDetected && !issues.graphicsDetected) {
    issues.score += 10;
    issues.feedback.push("✅ Clean, ATS-friendly formatting detected");
  }

  return issues;
}

/**
 * Checks resume content quality and completeness
 * @param {Object} resumeInfo - Extracted resume information
 * @returns {Object} - Content quality analysis
 */
function checkContentQuality(resumeInfo) {
  const { originalText, wordCount } = resumeInfo;
  const quality = {
    wordCount: wordCount,
    score: 0,
    feedback: []
  };

  // Check word count
  if (wordCount < 200) {
    quality.score -= 10;
    quality.feedback.push("❌ Resume is too short (under 200 words) - add more detail");
  } else if (wordCount > 800) {
    quality.score -= 5;
    quality.feedback.push("⚠️ Resume is quite long (over 800 words) - consider condensing");
  } else {
    quality.score += 10;
    quality.feedback.push("✅ Good resume length");
  }

  // Check for action verbs
  const actionVerbs = [
    'achieved', 'created', 'developed', 'implemented', 'improved', 'increased',
    'led', 'managed', 'designed', 'built', 'optimized', 'streamlined',
    'collaborated', 'coordinated', 'executed', 'delivered', 'established'
  ];
  
  const actionVerbCount = actionVerbs.filter(verb => 
    new RegExp(`\\b${verb}`, 'i').test(originalText)
  ).length;
  
  if (actionVerbCount >= 5) {
    quality.score += 10;
    quality.feedback.push("✅ Good use of action verbs");
  } else {
    quality.score -= 5;
    quality.feedback.push("⚠️ Use more action verbs to describe achievements");
  }

  // Check for industry keywords/buzzwords
  const techKeywords = [
    'javascript', 'python', 'react', 'node', 'aws', 'database', 'api',
    'agile', 'scrum', 'leadership', 'teamwork', 'communication', 'problem-solving'
  ];
  
  const keywordCount = techKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}`, 'i').test(originalText)
  ).length;
  
  if (keywordCount >= 3) {
    quality.score += 5;
    quality.feedback.push("✅ Contains relevant industry keywords");
  } else {
    quality.feedback.push("⚠️ Consider adding more industry-relevant keywords");
  }

  return quality;
}

/**
 * Main function to calculate comprehensive ATS score
 * @param {string} resumeText - Raw resume text
 * @returns {Object} - Complete ATS analysis with score and feedback
 */
function calculateATSScore(resumeText) {
  try {
    // Extract resume information
    const resumeInfo = extractResumeInfo(resumeText);
    
    // Analyze different aspects
    const sections = checkResumeSections(resumeInfo);
    const formatting = checkFormattingIssues(resumeInfo);
    const content = checkContentQuality(resumeInfo);
    
    // Calculate total score
    let totalScore = 0;
    const feedback = [];
    
    // Add section scores
    Object.values(sections).forEach(section => {
      totalScore += section.score;
      feedback.push(...section.feedback);
    });
    
    // Add formatting score
    totalScore += formatting.score;
    feedback.push(...formatting.feedback);
    
    // Add content quality score
    totalScore += content.score;
    feedback.push(...content.feedback);
    
    // Normalize to 0-100 scale (base score can theoretically be 120, so adjust)
    const maxPossibleScore = 120;
    const normalizedScore = Math.max(0, Math.min(100, Math.round((totalScore / maxPossibleScore) * 100)));
    
    // Add overall assessment
    if (normalizedScore >= 85) {
      feedback.unshift("🎉 Excellent! Your resume is highly ATS-optimized");
    } else if (normalizedScore >= 70) {
      feedback.unshift("👍 Good ATS compatibility with room for improvement");
    } else if (normalizedScore >= 50) {
      feedback.unshift("⚠️ Moderate ATS compatibility - several improvements needed");
    } else {
      feedback.unshift("❌ Poor ATS compatibility - significant improvements required");
    }
    
    return {
      score: normalizedScore,
      feedback: feedback,
      breakdown: {
        sections: sections,
        formatting: formatting,
        content: content,
        rawScore: totalScore,
        maxPossible: maxPossibleScore
      }
    };
    
  } catch (error) {
    console.error('Error in ATS score calculation:', error);
    throw new Error(`ATS score calculation failed: ${error.message}`);
  }
}

module.exports = {
  extractResumeInfo,
  checkResumeSections,
  checkFormattingIssues,
  checkContentQuality,
  calculateATSScore
}; 