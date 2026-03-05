// Types for the analysis result returned from the public endpoint
export interface CategoryScores {
    technicalSkills: number;
    softSkills: number;
    experience: number;
    education: number;
    keywords: number;
}

export interface KeywordSuggestion {
    keyword: string;
    priority: 'high' | 'medium' | 'low';
    suggestedSection: string;
    exampleUsage: string;
    importanceScore: number;
    // client-side tracking
    status?: 'pending' | 'added' | 'rejected';
}

export interface AnalysisResult {
    overallScore: number;
    atsScore: number;
    summary: string;
    categoryScores: CategoryScores;
    matchedElements: {
        skills: string[];
        experience: string[];
        education: string[];
        keywords: string[];
    };
    missingElements: {
        skills: string[];
        experience: string[];
        keywords: string[];
    };
    keywordSuggestions: KeywordSuggestion[];
    recommendations: string[];
    resumeSkills: string[];
}

const BASE_URL = '/api/public';

/**
 * Run a full resume-vs-JD analysis without authentication.
 * Accepts the raw File object and job description string.
 */
export const analyzeResume = async (
    resumeFile: File,
    jobDescription: string
): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription.trim());

    const response = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type — browser sets it with the correct boundary
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).message || 'Analysis failed. Please try again.');
    }

    const data = await response.json();
    return data.data as AnalysisResult;
};
