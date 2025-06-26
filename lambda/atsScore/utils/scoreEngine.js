/**
 * Score Engine for ATS Resume-Job Description Matching
 * Extracts keywords and calculates compatibility scores
 */

/**
 * Extracts relevant keywords from text
 * @param {string} text - Input text to extract keywords from
 * @returns {string[]} - Array of lowercase keywords (4+ characters)
 */
function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words and filter
  const words = cleanText.split(' ');
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'can', 'shall', 'from', 'up', 'out', 'down', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'now', 'also', 'well', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'among', 'within', 'without', 'along'
  ]);

  // Extract keywords: 4+ characters, not stop words, not purely numeric
  const keywords = words.filter(word => {
    return word.length >= 4 && 
           !stopWords.has(word) && 
           !/^\d+$/.test(word) && // exclude pure numbers
           /^[a-z]/.test(word); // must start with letter
  });

  // Remove duplicates and return
  return [...new Set(keywords)];
}

/**
 * Calculates ATS score between resume and job description
 * @param {string} resumeText - Resume content as plain text
 * @param {string} jdText - Job description as plain text
 * @returns {Object} - Score object with percentage, matched and missing keywords
 */
function calculateATSScore(resumeText, jdText) {
  try {
    // Extract keywords from both texts
    const resumeKeywords = extractKeywords(resumeText);
    const jdKeywords = extractKeywords(jdText);

    if (jdKeywords.length === 0) {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        totalJdKeywords: 0,
        totalResumeKeywords: resumeKeywords.length
      };
    }

    // Find matched and missing keywords
    const resumeKeywordSet = new Set(resumeKeywords);
    const matchedKeywords = jdKeywords.filter(keyword => resumeKeywordSet.has(keyword));
    const missingKeywords = jdKeywords.filter(keyword => !resumeKeywordSet.has(keyword));

    // Calculate score as percentage of JD keywords found in resume
    const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

    return {
      score: score,
      matchedKeywords: matchedKeywords.sort(),
      missingKeywords: missingKeywords.sort(),
      totalJdKeywords: jdKeywords.length,
      totalResumeKeywords: resumeKeywords.length
    };

  } catch (error) {
    console.error('Error calculating ATS score:', error);
    throw new Error('Failed to calculate ATS score');
  }
}

/**
 * Enhanced keyword extraction with technology and skill focus
 * @param {string} text - Input text
 * @returns {string[]} - Enhanced keywords with tech terms prioritized
 */
function extractEnhancedKeywords(text) {
  const basicKeywords = extractKeywords(text);
  
  // Technology and skill patterns to prioritize
  const techPatterns = [
    // Programming languages
    /\b(javascript|typescript|python|java|csharp|golang|rust|kotlin|swift)\b/gi,
    // Frameworks
    /\b(react|angular|vue|node|express|django|flask|spring|laravel)\b/gi,
    // Databases
    /\b(mysql|postgresql|mongodb|redis|elasticsearch|dynamodb)\b/gi,
    // Cloud platforms
    /\b(aws|azure|gcp|docker|kubernetes|terraform)\b/gi,
    // Methodologies
    /\b(agile|scrum|devops|cicd|microservices|restful|graphql)\b/gi
  ];

  const enhancedKeywords = [...basicKeywords];
  
  // Extract technology-specific terms
  techPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const keyword = match.toLowerCase();
        if (!enhancedKeywords.includes(keyword)) {
          enhancedKeywords.push(keyword);
        }
      });
    }
  });

  return [...new Set(enhancedKeywords)];
}

module.exports = {
  extractKeywords,
  calculateATSScore,
  extractEnhancedKeywords
}; 