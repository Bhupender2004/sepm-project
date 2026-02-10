import { Box, SimpleGrid, Heading, VStack, Input, InputGroup, InputLeftElement, Checkbox, Stack, Text, Select, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import JobCard from '../../components/features/JobCard';
import { getJobs, type Job } from '../../services/MockAnalysisService';
import Loading from '../../components/common/Loading';

const JobFilters = () => (
    <CustomCard h="fit-content">
        <VStack align="stretch" spacing={6}>
            <Box>
                <Heading size="sm" mb={3}>Job Type</Heading>
                <Stack spacing={2}>
                    <Checkbox defaultChecked>Full-time</Checkbox>
                    <Checkbox>Contract</Checkbox>
                    <Checkbox>Part-time</Checkbox>
                    <Checkbox>Internship</Checkbox>
                </Stack>
            </Box>

            <Box>
                <Heading size="sm" mb={3}>Experience Level</Heading>
                <Stack spacing={2}>
                    <Checkbox>Entry Level</Checkbox>
                    <Checkbox defaultChecked>Mid Level</Checkbox>
                    <Checkbox>Senior Level</Checkbox>
                    <Checkbox>Director</Checkbox>
                </Stack>
            </Box>

            <Box>
                <Heading size="sm" mb={3}>Salary Range</Heading>
                <RangeSlider aria-label={['min', 'max']} defaultValue={[30, 80]}>
                    <RangeSliderTrack>
                        <RangeSliderFilledTrack bg="brand.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text fontSize="sm" color="gray.500" mt={2}>$50k - $150k</Text>
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
        </VStack>
    </CustomCard>
);

const JobSearch = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs().then(data => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading mb={6}>Find Matching Jobs</Heading>

                {/* Search Bar */}
                <CustomCard mb={8} py={4}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                            <Input placeholder="Job title, keywords, or company" />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FaMapMarkerAlt color="gray.300" />} />
                            <Input placeholder="City, state, or remote" />
                        </InputGroup>
                        <CustomButton>Search Jobs</CustomButton>
                    </SimpleGrid>
                </CustomCard>

                <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={8}>
                    {/* Filters */}
                    <Box gridColumn={{ lg: "span 1" }} display={{ base: 'none', lg: 'block' }}>
                        <JobFilters />
                    </Box>

                    {/* Results */}
                    <Box gridColumn={{ lg: "span 3" }}>
                        <VStack spacing={4} align="stretch">
                            <Box display={{ base: 'block', lg: 'none' }} mb={4}>
                                <CustomButton variant="outline" w="full">Filters</CustomButton>
                            </Box>

                            {loading ? (
                                <Loading text="Finding the best matches for you..." />
                            ) : (
                                jobs.map(job => (
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
