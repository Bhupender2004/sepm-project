export interface AnalysisResult {
    score: number;
    summary: string;
    skills: {
        matched: string[];
        missing: string[];
    };
    keywords: {
        keyword: string;
        importance: 'High' | 'Medium' | 'Low';
        context: string;
    }[];
    education: {
        score: number;
        status: 'Match' | 'Partial' | 'Mismatch';
    };
    experience: {
        score: number;
        status: 'Match' | 'Partial' | 'Mismatch';
    };
}

export const mockAnalysisResult: AnalysisResult = {
    score: 78,
    summary: "Your resume is a strong match for this position, but lacks some specific technical keywords mentioned in the job description.",
    skills: {
        matched: ['React', 'TypeScript', 'JavaScript', 'Git', 'Agile'],
        missing: ['AWS', 'Docker', 'GraphQL', 'CI/CD'],
    },
    keywords: [
        { keyword: 'GraphQL', importance: 'High', context: 'Required for API layer' },
        { keyword: 'Docker', importance: 'Medium', context: 'Containerization experience' },
        { keyword: 'Mentoring', importance: 'Low', context: 'Soft skill for senior role' },
    ],
    education: {
        score: 100,
        status: 'Match',
    },
    experience: {
        score: 85,
        status: 'Match',
    },
};

export const getAnalysisResult = (): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAnalysisResult);
        }, 1500);
    });
};

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    matchScore: number;
    logo: string;
}

export const mockJobs: Job[] = [
    {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'TechCorp',
        location: 'Remote',
        type: 'Full-time',
        posted: '2 days ago',
        matchScore: 95,
        logo: 'https://via.placeholder.com/50',
    },
    {
        id: '2',
        title: 'React Developer',
        company: 'StartupX',
        location: 'New York, NY',
        type: 'Contract',
        posted: '1 week ago',
        matchScore: 88,
        logo: 'https://via.placeholder.com/50',
    },
    {
        id: '3',
        title: 'UI/UX Developer',
        company: 'DesignStudio',
        location: 'San Francisco, CA',
        type: 'Full-time',
        posted: '3 days ago',
        matchScore: 75,
        logo: 'https://via.placeholder.com/50',
    },
];

export const getJobs = (): Promise<Job[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockJobs);
        }, 1000);
    });
};
