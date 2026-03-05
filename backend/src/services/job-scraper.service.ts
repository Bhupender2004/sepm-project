import axios from 'axios';
import logger from '../utils/logger.util';

export interface ScrapedJob {
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
    source: 'Remotive' | 'RemoteOK' | 'LinkedIn' | 'Naukri' | 'Google' | 'Indeed' | 'Glassdoor' | string;
    tags: string[];
    matchScore: number;
}

class JobScraperService {
    /**
     * Calculate skill match score (0–100) between job tags and resume skills
     */
    calculateMatchScore(jobTags: string[], resumeSkills: string[]): number {
        if (!resumeSkills || resumeSkills.length === 0) return 50;
        if (!jobTags || jobTags.length === 0) return 40;

        const normalizedJobTags = jobTags.map(t => t.toLowerCase().trim());
        const normalizedSkills = resumeSkills.map(s => s.toLowerCase().trim());

        let matched = 0;
        for (const skill of normalizedSkills) {
            if (normalizedJobTags.some(tag => tag.includes(skill) || skill.includes(tag))) {
                matched++;
            }
        }

        // Base score 40, up to 60 points from skill overlap
        const overlap = matched / Math.max(normalizedSkills.length, 1);
        return Math.min(100, Math.round(40 + overlap * 60));
    }

    /**
     * Format posted date to human-readable string
     */
    private formatPostedDate(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return '1 day ago';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 14) return '1 week ago';
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            return `${Math.floor(diffDays / 30)} months ago`;
        } catch {
            return 'Recently';
        }
    }

    /**
     * Strip HTML tags from a string
     */
    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Fetch jobs from Remotive public API
     */
    async searchRemotive(keywords: string[], limit: number = 15): Promise<ScrapedJob[]> {
        try {
            // Use only the first keyword for the API search to avoid strict AND matching returning 0 results
            const searchQuery = keywords.length > 0 ? keywords[0] : 'software';
            const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(searchQuery)}&limit=${limit * 2}`;

            logger.info(`Fetching Remotive jobs for: ${searchQuery}`);
            const response = await axios.get(url, { timeout: 10000 });
            const jobs = response.data?.jobs || [];

            return jobs.slice(0, limit).map((job: any) => {
                const tags: string[] = (job.tags || []).map((t: string) => t.toLowerCase());
                return {
                    id: `remotive-${job.id}`,
                    title: job.title || 'Unknown Position',
                    company: job.company_name || 'Unknown Company',
                    location: job.candidate_required_location || 'Remote',
                    type: job.job_type || 'full_time',
                    posted: this.formatPostedDate(job.publication_date || new Date().toISOString()),
                    description: this.stripHtml(job.description || '').substring(0, 300) + '...',
                    postingUrl: job.url || '#',
                    salary: job.salary || undefined,
                    companyLogo: job.company_logo || undefined,
                    source: 'Remotive' as const,
                    tags,
                    matchScore: 0, // will be set after
                };
            });
        } catch (error: any) {
            logger.warn(`Remotive fetch failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Fetch jobs from RemoteOK public API
     */
    async searchRemoteOK(keywords: string[], limit: number = 15): Promise<ScrapedJob[]> {
        try {
            logger.info(`Fetching RemoteOK jobs for: ${keywords.join(', ')}`);
            const response = await axios.get('https://remoteok.com/api', {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ResumeAnalyzerBot/1.0)',
                },
            });

            // First element is metadata, skip it
            const jobs = (response.data || []).filter((j: any) => j.id && j.position);
            const normalizedKeywords = keywords.map(k => k.toLowerCase());

            // Lenient filter: job title or tags must match AT LEAST ONE keyword
            const filtered = jobs.filter((job: any) => {
                const jobTags: string[] = (job.tags || []).map((t: string) => t.toLowerCase());
                const titleLower = (job.position || '').toLowerCase();

                // Always include jobs if no keywords provided
                if (normalizedKeywords.length === 0) return true;

                return normalizedKeywords.some(kw =>
                    titleLower.includes(kw) ||
                    jobTags.some(tag => tag.includes(kw) || kw.includes(tag))
                );
            });

            // If strict filtering returned nothing, just use the latest jobs
            let pool = filtered.length > 0 ? filtered : jobs;

            // If we have a lot of jobs, pick the top ones
            pool = pool.slice(0, limit * 2);

            return pool.map((job: any) => {
                const tags: string[] = (job.tags || []).map((t: string) => t.toLowerCase());

                // Safely parse date — could be timestamp or string
                let parsedDate = new Date();
                if (job.date) {
                    const parsed = typeof job.date === 'number' || !isNaN(Number(job.date))
                        ? new Date(Number(job.date) * 1000)
                        : new Date(job.date);
                    if (!isNaN(parsed.getTime())) parsedDate = parsed;
                }

                return {
                    id: `remoteok-${job.id}`,
                    title: job.position || 'Unknown Position',
                    company: job.company || 'Unknown Company',
                    location: 'Remote',
                    type: 'Full-time',
                    posted: this.formatPostedDate(parsedDate.toISOString()),
                    description: this.stripHtml(job.description || '').substring(0, 300) + '...',
                    postingUrl: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
                    salary: job.salary || undefined,
                    companyLogo: job.company_logo || job.logo || undefined,
                    source: 'RemoteOK' as const,
                    tags,
                    matchScore: 0,
                };
            });
        } catch (error: any) {
            logger.warn(`RemoteOK fetch failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Fetch jobs from JSearch RapidAPI (sources from Google, LinkedIn, Indeed, etc.)
     */
    async searchJSearch(keywords: string[], location: string, limit: number = 20): Promise<ScrapedJob[]> {
        // Fallback or early return if no API key is provided
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey || rapidApiKey.includes('paste-your')) {
            logger.warn('Skipping JSearch: RAPIDAPI_KEY is not configured in .env');
            return [];
        }

        try {
            const query = `${keywords.join(' ')} ${location}`;
            logger.info(`Fetching JSearch (RapidAPI) jobs for: ${query}`);

            const options = {
                method: 'GET',
                url: 'https://jsearch.p.rapidapi.com/search',
                params: {
                    query: query,
                    page: '1',
                    num_pages: '1',
                    date_posted: 'month'
                },
                headers: {
                    'X-RapidAPI-Key': rapidApiKey,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                },
                timeout: 5000
            };

            const response = await axios.request(options);
            const jobs = response.data?.data || [];

            return jobs.slice(0, limit).map((job: any) => {
                // Normalize the source from JSearch publisher
                let normalizedSource = 'Google';
                const publisher = (job.job_publisher || '').toLowerCase();
                if (publisher.includes('linkedin')) normalizedSource = 'LinkedIn';
                else if (publisher.includes('naukri')) normalizedSource = 'Naukri';
                else if (publisher.includes('indeed')) normalizedSource = 'Indeed';
                else if (publisher.includes('glassdoor')) normalizedSource = 'Glassdoor';
                else if (publisher) normalizedSource = job.job_publisher; // Keep original if unknown

                return {
                    id: `jsearch-${job.job_id || Math.random()}`,
                    title: job.job_title || 'Unknown Position',
                    company: job.employer_name || 'Unknown Company',
                    location: job.job_city ? `${job.job_city}, ${job.job_state || ''}` : (location || 'Remote'),
                    type: job.job_employment_type || 'Full-time',
                    posted: job.job_posted_at_datetime_utc || new Date().toISOString(),
                    description: (job.job_description || '').substring(0, 300) + '... (Apply for full details)',
                    postingUrl: job.job_apply_link || job.job_google_link || '#',
                    salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : undefined,
                    companyLogo: job.employer_logo || undefined,
                    source: normalizedSource,
                    tags: keywords,
                    matchScore: 0,
                };
            });
        } catch (error: any) {
            logger.warn(`JSearch fetch failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Fetch jobs from Glassdoor API via RapidAPI
     */
    async searchGlassdoor(keywords: string[], location: string, limit: number = 20): Promise<ScrapedJob[]> {
        const rapidApiKey = process.env.GLASSDOOR_RAPIDAPI_KEY;
        if (!rapidApiKey || rapidApiKey.includes('paste-your')) {
            logger.warn('Skipping Glassdoor API: GLASSDOOR_RAPIDAPI_KEY is not configured in .env');
            return [];
        }

        try {
            // Use only the first keyword to ensure better matches with strict APIs
            const query = keywords.length > 0 ? keywords[0] : 'software engineer';
            logger.info(`Fetching Glassdoor (RapidAPI) jobs for: ${query} in ${location || 'anywhere'}`);

            const options = {
                method: 'GET',
                url: 'https://glassdoor.p.rapidapi.com/jobs/search',
                params: {
                    keyword: query,
                    location_id: '1', // Default location if location not resolved by Glassdoor
                    location_type: 'N'
                },
                headers: {
                    'X-RapidAPI-Key': rapidApiKey,
                    'X-RapidAPI-Host': 'glassdoor.p.rapidapi.com'
                },
                timeout: 5000
            };

            const response = await axios.request(options);
            // Different wrapper APIs structure their Glassdoor data differently. 
            // We use a safe fallback here.
            const jobs = response.data?.response?.jobListings || response.data?.data || [];

            return jobs.slice(0, limit).map((job: any) => ({
                id: `glassdoor-${job.jobListingId || job.job_id || Math.random()}`,
                title: job.jobTitle || job.title || 'Unknown Position',
                company: job.employer?.name || job.company_name || 'Unknown Company',
                location: job.location || location || 'Remote',
                type: 'Full-time', // Glassdoor API doesn't always return this cleanly in the search list
                posted: job.postingDate || new Date().toISOString(),
                description: (job.descriptionSnippet || job.description || '').substring(0, 300) + '...',
                postingUrl: job.jobViewUrl || job.url || '#',
                salary: job.salaryEstimate ? `${job.salaryEstimate.currencySymbol}${job.salaryEstimate.min} - ${job.salaryEstimate.max}` : undefined,
                companyLogo: job.employer?.logoUrl || job.company_logo || undefined,
                source: 'Glassdoor',
                tags: keywords,
                matchScore: 0,
            }));
        } catch (error: any) {
            logger.warn(`Glassdoor API fetch failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Main method: aggregate from all sources, score, deduplicate, and sort
     */
    async scrapeJobs(
        keywords: string[],
        location?: string,
        limit: number = 20
    ): Promise<ScrapedJob[]> {
        if (!keywords || keywords.length === 0) {
            keywords = ['software engineer', 'developer'];
        }

        const loc = location || '';

        // Fire all requests concurrently and wait for all to settle
        const results = await Promise.allSettled([
            this.searchRemotive(keywords, Math.ceil(limit / 2)),
            this.searchRemoteOK(keywords, Math.ceil(limit / 2)),
            this.searchJSearch(keywords, loc, limit),
            this.searchGlassdoor(keywords, loc, limit)
        ]);

        const remotiveJobs = results[0].status === 'fulfilled' ? results[0].value : [];
        const remoteOkJobs = results[1].status === 'fulfilled' ? results[1].value : [];
        const jsearchJobs = results[2].status === 'fulfilled' ? results[2].value : [];
        const glassdoorJobs = results[3].status === 'fulfilled' ? results[3].value : [];

        // Merge and deduplicate by title+company
        const seen = new Set<string>();
        const allJobs: ScrapedJob[] = [];

        for (const job of [...remotiveJobs, ...remoteOkJobs, ...jsearchJobs, ...glassdoorJobs]) {
            const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                // Apply match score
                job.matchScore = this.calculateMatchScore(job.tags, keywords);
                allJobs.push(job);
            }
        }

        // Sort by match score descending
        allJobs.sort((a, b) => b.matchScore - a.matchScore);

        return allJobs.slice(0, limit);
    }
}

export default new JobScraperService();
