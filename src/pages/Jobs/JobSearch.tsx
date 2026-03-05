import {
    Box, SimpleGrid, Heading, VStack, Input, InputGroup, InputLeftElement,
    Checkbox, Stack, Text, Select, Flex, Alert, AlertIcon, AlertTitle,
    AlertDescription, Badge, Tag, TagCloseButton, TagLabel, HStack,
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import JobCard from '../../components/features/JobCard';
import { searchJobs, type Job } from '../../services/JobService';
import Loading from '../../components/common/Loading';

// Default skills used when no resume is uploaded
const DEFAULT_SKILLS = ['software engineer', 'developer', 'react', 'typescript'];

const JobFilters = ({
    selectedTypes,
    onTypeChange,
}: {
    selectedTypes: string[];
    onTypeChange: (types: string[]) => void;
}) => {
    const types = ['Full-time', 'Contract', 'Part-time', 'Internship'];
    const toggle = (t: string) => {
        onTypeChange(
            selectedTypes.includes(t) ? selectedTypes.filter(x => x !== t) : [...selectedTypes, t]
        );
    };

    return (
        <CustomCard h="fit-content">
            <VStack align="stretch" spacing={6}>
                <Box>
                    <Heading size="sm" mb={3}>Job Type</Heading>
                    <Stack spacing={2}>
                        {types.map(t => (
                            <Checkbox
                                key={t}
                                isChecked={selectedTypes.includes(t)}
                                onChange={() => toggle(t)}
                            >
                                {t}
                            </Checkbox>
                        ))}
                    </Stack>
                </Box>

                <Box>
                    <Heading size="sm" mb={3}>Date Posted</Heading>
                    <Select size="sm">
                        <option>Any time</option>
                        <option>Past 24 hours</option>
                        <option>Past week</option>
                        <option>Past month</option>
                    </Select>
                </Box>

                <Box>
                    <Heading size="sm" mb={3}>Source</Heading>
                    <Stack spacing={2}>
                        <HStack flexWrap="wrap" gap={1}>
                            <Badge colorScheme="purple" px={2} py={0.5} borderRadius="full">Remotive</Badge>
                            <Badge colorScheme="cyan" px={2} py={0.5} borderRadius="full">RemoteOK</Badge>
                            <Badge colorScheme="linkedin" px={2} py={0.5} borderRadius="full">LinkedIn</Badge>
                            <Badge colorScheme="blue" px={2} py={0.5} borderRadius="full">Naukri</Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">Real jobs from public boards</Text>
                    </Stack>
                </Box>
            </VStack>
        </CustomCard>
    );
};

const JobSearch = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [keywordsInput, setKeywordsInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['Full-time']);
    const [activeKeywords, setActiveKeywords] = useState<string[]>(DEFAULT_SKILLS);
    const [totalFetched, setTotalFetched] = useState(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchJobs = async (keywords: string[], location: string) => {
        if (keywords.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const keywordStr = keywords.join(',');
            const results = await searchJobs(keywordStr, location, 30);
            setJobs(results);
            setTotalFetched(results.length);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch jobs. Please check that the backend is running.');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchJobs(DEFAULT_SKILLS, '');
    }, []);

    // Filter by selected job types (client-side)
    const visibleJobs = jobs.filter(job => {
        if (selectedTypes.length === 0) return true;
        const jobTypeLower = (job.type || '').toLowerCase().replace(/[_-]/g, ' ');
        return selectedTypes.some(t => jobTypeLower.includes(t.toLowerCase()));
    });

    const handleSearch = () => {
        const kw = keywordsInput.trim()
            ? keywordsInput.split(/[,\s]+/).map(k => k.trim()).filter(Boolean)
            : DEFAULT_SKILLS;
        setActiveKeywords(kw);
        fetchJobs(kw, locationInput.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const removeKeyword = (kw: string) => {
        const next = activeKeywords.filter(k => k !== kw);
        if (next.length === 0) return;
        setActiveKeywords(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchJobs(next, locationInput.trim()), 300);
    };

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading mb={2}>Find Matching Jobs</Heading>
                <Text color="gray.500" mb={6}>
                    Live jobs from LinkedIn, Naukri, Remotive &amp; RemoteOK, matched to your skills
                </Text>

                {/* Search Bar */}
                <CustomCard mb={6} py={4}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FaSearch color="gray" />} />
                            <Input
                                placeholder="Skills: react, python, node.js..."
                                value={keywordsInput}
                                onChange={e => setKeywordsInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FaMapMarkerAlt color="gray" />} />
                            <Input
                                placeholder="Location or 'remote'"
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </InputGroup>
                        <CustomButton onClick={handleSearch} isLoading={loading} leftIcon={<FaSearch />}>
                            Search Jobs
                        </CustomButton>
                    </SimpleGrid>

                    {/* Active keyword tags */}
                    {activeKeywords.length > 0 && (
                        <Flex mt={3} gap={2} flexWrap="wrap" align="center">
                            <Text fontSize="sm" color="gray.500">Searching:</Text>
                            {activeKeywords.map(kw => (
                                <Tag key={kw} size="sm" colorScheme="brand" borderRadius="full" variant="subtle">
                                    <TagLabel>{kw}</TagLabel>
                                    <TagCloseButton onClick={() => removeKeyword(kw)} />
                                </Tag>
                            ))}
                        </Flex>
                    )}
                </CustomCard>

                {/* Error Banner */}
                {error && (
                    <Alert status="error" borderRadius="lg" mb={6}>
                        <AlertIcon />
                        <AlertTitle>Error fetching jobs</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={8}>
                    {/* Filters */}
                    <Box gridColumn={{ lg: 'span 1' }} display={{ base: 'none', lg: 'block' }}>
                        <JobFilters selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
                    </Box>

                    {/* Results */}
                    <Box gridColumn={{ lg: 'span 3' }}>
                        <VStack spacing={4} align="stretch">
                            {/* Mobile filters button */}
                            <Box display={{ base: 'block', lg: 'none' }} mb={2}>
                                <CustomButton variant="outline" w="full" leftIcon={<FaBriefcase />}>
                                    Filters
                                </CustomButton>
                            </Box>

                            {/* Results count bar */}
                            {!loading && !error && (
                                <Flex justify="space-between" align="center" px={1}>
                                    <Text color="gray.600" fontSize="sm">
                                        Showing <strong>{visibleJobs.length}</strong> of {totalFetched} jobs
                                    </Text>
                                    <HStack spacing={2} flexWrap="wrap">
                                        <Badge colorScheme="purple" variant="subtle">Remotive</Badge>
                                        <Badge colorScheme="cyan" variant="subtle">RemoteOK</Badge>
                                        <Badge colorScheme="linkedin" variant="subtle">LinkedIn</Badge>
                                        <Badge colorScheme="blue" variant="subtle">Naukri</Badge>
                                    </HStack>
                                </Flex>
                            )}

                            {loading ? (
                                <Loading text="Scraping live jobs for you..." />
                            ) : visibleJobs.length === 0 ? (
                                <CustomCard p={8}>
                                    <VStack spacing={3} color="gray.400">
                                        <Text fontSize="3xl">🔍</Text>
                                        <Text fontSize="lg" fontWeight="medium">No jobs found</Text>
                                        <Text fontSize="sm" textAlign="center">
                                            Try different keywords (e.g., "python", "data engineer", "react") or broaden filters.
                                        </Text>
                                        <CustomButton size="sm" onClick={() => {
                                            setKeywordsInput('');
                                            setActiveKeywords(DEFAULT_SKILLS);
                                            fetchJobs(DEFAULT_SKILLS, '');
                                        }}>
                                            Reset Search
                                        </CustomButton>
                                    </VStack>
                                </CustomCard>
                            ) : (
                                visibleJobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))
                            )}
                        </VStack>
                    </Box>
                </SimpleGrid>
            </Section>
        </Box>
    );
};

export default JobSearch;
