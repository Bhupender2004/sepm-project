import {
    Box, SimpleGrid, Text, Heading, Icon, Flex, VStack, HStack,
    Badge, Spinner
} from '@chakra-ui/react';
import { FaFileUpload, FaSearch, FaBookmark, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomCard from '../components/common/CustomCard';
import Section from '../components/layout/Section';
import CustomButton from '../components/common/CustomButton';
import { getSavedJobs } from '../services/SavedJobService';
import type { AnalysisResult } from '../services/AnalysisService';

const StatCard = ({ label, value, icon, helpText, color = 'brand.500' }: any) => (
    <CustomCard>
        <Flex justify="space-between" align="center" mb={2}>
            <Text color="gray.500" fontSize="sm" fontWeight="medium">{label}</Text>
            <Icon as={icon} color={color} w={5} h={5} />
        </Flex>
        <Heading size="lg" mb={1}>{value}</Heading>
        <Text fontSize="xs" color="gray.400">{helpText}</Text>
    </CustomCard>
);

const Dashboard = () => {
    const navigate = useNavigate();

    const [savedCount, setSavedCount] = useState<number | null>(null);
    const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        // Load last analysis from sessionStorage
        const raw = sessionStorage.getItem('analysisResult');
        const name = sessionStorage.getItem('analysisFileName') ?? '';
        if (raw) {
            try { setLastResult(JSON.parse(raw)); } catch { /* ignore */ }
            setFileName(name);
        }

        // Load saved jobs count from backend
        getSavedJobs()
            .then(jobs => setSavedCount(jobs.length))
            .catch(() => setSavedCount(0));
    }, []);

    const scoreColor = lastResult
        ? lastResult.overallScore >= 75 ? 'green.500' : lastResult.overallScore >= 50 ? 'orange.500' : 'red.500'
        : 'gray.300';

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                {/* Header */}
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading size="lg">Dashboard</Heading>
                        <Text color="gray.600" mt={1}>Your resume analysis hub</Text>
                    </Box>
                    <CustomButton leftIcon={<Icon as={FaFileUpload} />} as={RouterLink} to="/">
                        New Analysis
                    </CustomButton>
                </Flex>

                {/* Stats */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                    <StatCard
                        label="Last Match Score"
                        value={lastResult ? `${lastResult.overallScore}%` : '—'}
                        icon={FaChartLine}
                        color={scoreColor}
                        helpText={lastResult ? `ATS: ${lastResult.atsScore}%` : 'No analysis yet'}
                    />
                    <StatCard
                        label="Keywords Identified"
                        value={lastResult ? lastResult.keywordSuggestions.length : '—'}
                        icon={FaCheckCircle}
                        helpText={lastResult ? 'From last analysis' : 'Run an analysis to see'}
                    />
                    <StatCard
                        label="Saved Jobs"
                        value={savedCount === null ? <Spinner size="sm" /> : savedCount}
                        icon={FaBookmark}
                        helpText="In your saved list"
                    />
                    <StatCard
                        label="Job Search"
                        value="Live"
                        icon={FaSearch}
                        color="green.500"
                        helpText="Remotive + RemoteOK"
                    />
                </SimpleGrid>

                {/* Main content */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Last Analysis card */}
                    <CustomCard>
                        <Heading size="md" mb={4}>Last Analysis</Heading>
                        {lastResult ? (
                            <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between" p={3} bg="gray.50" rounded="md">
                                    <Box>
                                        <Text fontWeight="semibold" noOfLines={1}>{fileName || 'Resume'}</Text>
                                        <Text fontSize="xs" color="gray.500">Most recent analysis</Text>
                                    </Box>
                                    <Badge
                                        colorScheme={lastResult.overallScore >= 75 ? 'green' : lastResult.overallScore >= 50 ? 'orange' : 'red'}
                                        fontSize="md" px={3} py={1} borderRadius="full"
                                    >
                                        {lastResult.overallScore}%
                                    </Badge>
                                </HStack>

                                {/* Quick category bars */}
                                {Object.entries(lastResult.categoryScores).map(([key, val]) => (
                                    <Flex key={key} justify="space-between" align="center" fontSize="sm">
                                        <Text color="gray.600" textTransform="capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Text>
                                        <Badge colorScheme={val >= 70 ? 'green' : val >= 45 ? 'yellow' : 'red'}>
                                            {val}%
                                        </Badge>
                                    </Flex>
                                ))}

                                <CustomButton size="sm" onClick={() => navigate('/results')}>
                                    View Full Results
                                </CustomButton>
                            </VStack>
                        ) : (
                            <VStack py={8} spacing={4} align="center">
                                <Text color="gray.400" textAlign="center">
                                    No analysis yet. Upload a resume and job description to get started.
                                </Text>
                                <CustomButton size="sm" as={RouterLink} to="/">
                                    Start Analysis
                                </CustomButton>
                            </VStack>
                        )}
                    </CustomCard>

                    {/* Quick Actions */}
                    <CustomCard>
                        <Heading size="md" mb={4}>Quick Actions</Heading>
                        <VStack spacing={3} align="stretch">
                            <CustomButton
                                leftIcon={<Icon as={FaFileUpload} />}
                                as={RouterLink}
                                to="/"
                                justifyContent="flex-start"
                            >
                                Analyze New Resume
                            </CustomButton>
                            <CustomButton
                                leftIcon={<Icon as={FaSearch} />}
                                as={RouterLink}
                                to="/jobs"
                                variant="outline"
                                justifyContent="flex-start"
                            >
                                Find Matching Jobs
                            </CustomButton>
                            <CustomButton
                                leftIcon={<Icon as={FaBookmark} />}
                                as={RouterLink}
                                to="/saved-jobs"
                                variant="outline"
                                justifyContent="flex-start"
                            >
                                View Saved Jobs ({savedCount ?? '...'})
                            </CustomButton>
                            {lastResult && (
                                <CustomButton
                                    leftIcon={<Icon as={FaChartLine} />}
                                    onClick={() => navigate('/results')}
                                    variant="outline"
                                    justifyContent="flex-start"
                                >
                                    View Last Analysis Results
                                </CustomButton>
                            )}
                        </VStack>

                        <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                            <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={1}>💡 Tip</Text>
                            <Text fontSize="sm" color="blue.600">
                                A score above 75% significantly increases your callback rate. Use keyword suggestions to improve your match!
                            </Text>
                        </Box>
                    </CustomCard>
                </SimpleGrid>
            </Section>
        </Box>
    );
};

export default Dashboard;
