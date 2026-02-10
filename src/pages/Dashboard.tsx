import { Box, SimpleGrid, Text, Heading, Icon, Stack, Flex } from '@chakra-ui/react';
import { FaFileUpload, FaSearch, FaHistory, FaChartLine } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import CustomCard from '../components/common/CustomCard';
import Section from '../components/layout/Section';
import CustomButton from '../components/common/CustomButton';

const StatCard = ({ label, value, icon, helpText }: any) => (
    <CustomCard>
        <Flex justify="space-between" align="center" mb={2}>
            <Text color="gray.500" fontSize="sm" fontWeight="medium">{label}</Text>
            <Icon as={icon} color="brand.500" w={5} h={5} />
        </Flex>
        <Heading size="lg" mb={1}>{value}</Heading>
        <Text fontSize="xs" color="gray.400">{helpText}</Text>
    </CustomCard>
);

const AnalysisHistoryCard = () => (
    <CustomCard h="full">
        <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Recent Analyses</Heading>
            <CustomButton variant="ghost" size="sm" as={RouterLink} to="/history">View All</CustomButton>
        </Flex>
        <Stack spacing={4}>
            {[1, 2, 3].map((i) => (
                <Flex key={i} justify="space-between" align="center" p={3} bg="gray.50" rounded="md">
                    <Box>
                        <Text fontWeight="semibold">Software Engineer - Google</Text>
                        <Text fontSize="xs" color="gray.500">2 days ago</Text>
                    </Box>
                    <Box textAlign="right">
                        <Text fontWeight="bold" color={i === 1 ? 'green.500' : 'orange.500'}>{i === 1 ? '92%' : '78%'}</Text>
                        <Text fontSize="xs" color="gray.500">Match</Text>
                    </Box>
                </Flex>
            ))}
        </Stack>
    </CustomCard>
);

const Dashboard = () => {
    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Flex justify="space-between" align="center" mb={8}>
                    <Box>
                        <Heading size="lg">Hello, Job Seeker!</Heading>
                        <Text color="gray.600">Here's what's happening with your job search.</Text>
                    </Box>
                    <CustomButton leftIcon={<Icon as={FaFileUpload} />} as={RouterLink} to="/analyze">
                        New Analysis
                    </CustomButton>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                    <StatCard label="Total Analyses" value="12" icon={FaHistory} helpText="+2 this week" />
                    <StatCard label="Average Score" value="76%" icon={FaChartLine} helpText="+5% improvement" />
                    <StatCard label="Jobs Found" value="84" icon={FaSearch} helpText="Matches your profile" />
                    <StatCard label="Resumes Optimized" value="5" icon={FaFileUpload} helpText="Ready for application" />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                    <Box gridColumn={{ lg: "span 2" }}>
                        <CustomCard h="full">
                            <Heading size="md" mb={4}>Match Score Trend</Heading>
                            <Flex height="200px" align="center" justify="center" bg="gray.50" rounded="md">
                                <Text color="gray.400">Chart Placeholder (Recharts)</Text>
                            </Flex>
                        </CustomCard>
                    </Box>
                    <AnalysisHistoryCard />
                </SimpleGrid>
            </Section>
        </Box>
    );
};

export default Dashboard;
