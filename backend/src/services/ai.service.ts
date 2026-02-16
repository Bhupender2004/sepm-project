import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env';
import logger from '../utils/logger.util';

class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    /**
     * Parse resume text and extract structured information
     */
    async parseResume(resumeText: string): Promise<any> {
        const prompt = `
You are a resume parser. Extract the following information from the resume text and return it as a JSON object:

{
  "contact": {
    "name": "Full name",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, State/Country",
    "linkedin": "LinkedIn URL if present",
    "portfolio": "Portfolio/website URL if present"
  },
  "experience": [
    {
      "company": "Company name",
      "title": "Job title",
      "startDate": "Start date (YYYY-MM format)",
      "endDate": "End date (YYYY-MM format) or 'Present'",
      "description": "Brief description of responsibilities"
    }
  ],
  "education": [
    {
      "institution": "School/University name",
      "degree": "Degree type and major",
      "startDate": "Start date (YYYY-MM format)",
      "endDate": "End date (YYYY-MM format)",
      "gpa": "GPA if mentioned"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["certification1", "certification2"]
}

Resume text:
${resumeText}

Return ONLY the JSON object, no additional text.
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            logger.error('AI Resume Parsing Error:', error);
            throw error;
        }
    }

    /**
     * Parse job description and extract requirements
     */
    async parseJobDescription(jdText: string): Promise<any> {
        const prompt = `
You are a job description analyzer. Extract the following information from the job description and return it as a JSON object:

{
  "requiredSkills": ["skill1", "skill2"],
  "desiredSkills": ["skill1", "skill2"],
  "experienceLevel": "Entry/Mid/Senior",
  "educationRequirements": ["requirement1", "requirement2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "keywords": ["keyword1", "keyword2"]
}

Job Description:
${jdText}

Return ONLY the JSON object, no additional text.
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            logger.error('AI JD Parsing Error:', error);
            throw error;
        }
    }

    /**
     * Analyze resume against job description
     */
    async analyzeMatch(resumeData: any, jdData: any, resumeText: string, jdText: string): Promise<any> {
        const prompt = `
You are an expert resume analyzer. Compare the resume against the job description and provide a detailed analysis.

Resume Skills: ${JSON.stringify(resumeData.skills)}
Resume Experience: ${JSON.stringify(resumeData.experience)}
Resume Education: ${JSON.stringify(resumeData.education)}

Job Required Skills: ${JSON.stringify(jdData.requiredSkills)}
Job Desired Skills: ${JSON.stringify(jdData.desiredSkills)}
Job Experience Level: ${jdData.experienceLevel}
Job Education Requirements: ${JSON.stringify(jdData.educationRequirements)}

Provide analysis in this JSON format:
{
  "overallScore": 75,
  "categoryScores": {
    "technicalSkills": 80,
    "softSkills": 70,
    "experience": 75,
    "education": 85,
    "keywords": 65
  },
  "matchedElements": {
    "skills": ["matched skill1", "matched skill2"],
    "experience": ["relevant experience point"],
    "education": ["matched education requirement"],
    "keywords": ["keyword1", "keyword2"]
  },
  "missingElements": {
    "skills": ["missing skill1", "missing skill2"],
    "experience": ["missing experience aspect"],
    "keywords": ["missing keyword1"]
  },
  "keywordSuggestions": [
    {
      "keyword": "Kubernetes",
      "priority": "high",
      "suggestedSection": "Skills",
      "exampleUsage": "Orchestrated containerized applications using Kubernetes",
      "importanceScore": 95
    }
  ],
  "atsScore": 72,
  "recommendations": [
    "Add Kubernetes to your skills section",
    "Highlight cloud architecture experience"
  ],
  "summary": "Your resume shows strong technical skills and relevant experience..."
}

Return ONLY the JSON object, no additional text.
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw new Error('Failed to parse AI response');
        } catch (error) {
            logger.error('AI Analysis Error:', error);
            throw error;
        }
    }
}

export default new AIService();
