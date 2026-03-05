const BASE_URL = '/api/saved-jobs';

export interface SavedJobEntry {
    id: string;
    jobId: string;
    applicationStatus: 'saved' | 'applied' | 'interested' | 'not_interested';
    notes: string | null;
    savedAt: string;
    job: {
        id: string;
        externalJobId: string;
        sourcePlatform: string;
        jobTitle: string;
        company: string;
        location: string;
        jobType: string;
        description: string;
        postingUrl: string;
        salary?: string;
        tags?: string[];
        postedDate?: string;
    };
}

/**
 * Save a job to the user's saved list.
 */
export const saveJob = async (jobData: {
    externalJobId: string;
    sourcePlatform: string;
    jobTitle: string;
    company: string;
    location: string;
    jobType?: string;
    description?: string;
    postingUrl: string;
    salary?: string;
    tags?: string[];
}): Promise<{ savedJobId: string; jobId: string }> => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to save job');
    return data.data;
};

/**
 * Get all saved jobs.
 */
export const getSavedJobs = async (): Promise<SavedJobEntry[]> => {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load saved jobs');
    return data.data;
};

/**
 * Update status or notes for a saved job.
 */
export const updateSavedJob = async (
    savedJobId: string,
    updates: { applicationStatus?: string; notes?: string }
): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${savedJobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update saved job');
};

/**
 * Remove a saved job.
 */
export const unsaveJob = async (savedJobId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${savedJobId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to remove saved job');
};

/**
 * Check if a job is already saved. Returns savedJobId or null.
 */
export const checkSaved = async (
    externalJobId: string,
    sourcePlatform: string
): Promise<string | null> => {
    const response = await fetch(
        `${BASE_URL}/check?externalJobId=${encodeURIComponent(externalJobId)}&sourcePlatform=${encodeURIComponent(sourcePlatform)}`
    );
    const data = await response.json();
    return data.savedJobId ?? null;
};
