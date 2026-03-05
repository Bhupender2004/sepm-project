export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    description: string;
    postingUrl: string;
    salary?: string;
    companyLogo?: string;
    source: 'Remotive' | 'RemoteOK' | 'LinkedIn' | 'Naukri';
    tags: string[];
    matchScore: number;
}

const BASE_URL = '/api/jobs';

/**
 * Search jobs by keywords and location
 */
export const searchJobs = async (
    keywords: string,
    location: string,
    limit: number = 20
): Promise<Job[]> => {
    const params = new URLSearchParams();
    if (keywords) params.set('keywords', keywords);
    if (location) params.set('location', location);
    params.set('limit', String(limit));

    const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch jobs');
    }
    const data = await response.json();
    return data.data || [];
};

/**
 * Find jobs matching a list of resume skills
 */
export const searchJobsFromResume = async (
    skills: string[],
    location?: string,
    limit: number = 20
): Promise<Job[]> => {
    const response = await fetch(`${BASE_URL}/search-from-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, location, limit }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch jobs from resume');
    }
    const data = await response.json();
    return data.data || [];
};
