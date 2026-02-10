import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import Section from '../../components/layout/Section';
import JobCard from '../../components/features/JobCard';
import { mockJobs } from '../../services/MockAnalysisService';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import { Link as RouterLink } from 'react-router-dom';

const SavedJobs = () => {
    // Mocking saved jobs by picking the first two
    const savedJobs = mockJobs.slice(0, 2);

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading mb={6}>Saved Jobs</Heading>

                {savedJobs.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                        <Box gridColumn={{ lg: "span 2" }}>
                            <VStack spacing={4} align="stretch">
                                {savedJobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </VStack>
                        </Box>

                        <Box>
                            <CustomCard>
                                <Heading size="md" mb={4}>Job Tracker</Heading>
                                <VStack align="stretch" spacing={3}>
                                    <Box p={3} bg="green.50" rounded="md">
                                        <Text fontWeight="bold" color="green.700">2 Applied</Text>
                                    </Box>
                                    <Box p={3} bg="blue.50" rounded="md">
                                        <Text fontWeight="bold" color="blue.700">2 Saved</Text>
                                    </Box>
                                    <Box p={3} bg="gray.100" rounded="md">
                                        <Text fontWeight="bold" color="gray.700">0 Interviewing</Text>
                                    </Box>
                                </VStack>
                            </CustomCard>
                        </Box>
                    </SimpleGrid>
                ) : (
                    <CustomCard textAlign="center" py={10}>
                        <Heading size="md" mb={2}>No Saved Jobs</Heading>
                        <Text color="gray.500" mb={6}>You haven't saved any jobs yet.</Text>
                        <CustomButton as={RouterLink} to="/jobs">Find Jobs</CustomButton>
                    </CustomCard>
                )}
            </Section>
        </Box>
    );
};

export default SavedJobs;
