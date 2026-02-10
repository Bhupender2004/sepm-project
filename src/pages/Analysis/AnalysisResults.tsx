import { Box, SimpleGrid, Text, Heading, VStack, HStack, Badge, Progress, Tab, Tabs, TabList, TabPanels, TabPanel, Flex, Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import { getAnalysisResult, type AnalysisResult } from '../../services/MockAnalysisService';
import Loading from '../../components/common/Loading';

const COLORS = ['#00A86B', '#E2E8F0'];

const ScoreChart = ({ score }: { score: number }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    return (
        <Box h="200px" position="relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        <Cell key="cell-0" fill={COLORS[0]} />
                        <Cell key="cell-1" fill={COLORS[1]} />
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <VStack position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" spacing={0}>
                <Text fontSize="4xl" fontWeight="bold" color="brand.600">{score}%</Text>
                <Text fontSize="sm" color="gray.500">Match</Text>
            </VStack>
        </Box>
    );
};

const AnalysisResults = () => {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalysisResult().then(data => {
            setResult(data);
            setLoading(false);
        });
    }, []);

    if (loading || !result) return <Loading fullScreen text="Generating detailed analysis..." />;

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading mb={6}>Analysis Results</Heading>

                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mb={8}>
                    {/* Overall Score */}
                    <CustomCard textAlign="center">
                        <Heading size="md" mb={4}>Overall Match Score</Heading>
                        <ScoreChart score={result.score} />
                        <Text color="gray.600" mt={4}>{result.summary}</Text>
                        <CustomButton w="full" mt={6}>Download PDF Report</CustomButton>
                    </CustomCard>

                    {/* Category Breakdown */}
                    <Box gridColumn={{ lg: "span 2" }}>
                        <CustomCard h="full">
                            <Heading size="md" mb={6}>Category Breakdown</Heading>
                            <VStack spacing={6} align="stretch">
                                <Box>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="medium">Hard Skills</Text>
                                        <Text fontWeight="bold">80%</Text>
                                    </Flex>
                                    <Progress value={80} colorScheme="green" borderRadius="full" />
                                </Box>
                                <Box>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="medium">Experience</Text>
                                        <Text fontWeight="bold">{result.experience.score}%</Text>
                                    </Flex>
                                    <Progress value={result.experience.score} colorScheme="blue" borderRadius="full" />
                                </Box>
                                <Box>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="medium">Education</Text>
                                        <Text fontWeight="bold">{result.education.score}%</Text>
                                    </Flex>
                                    <Progress value={result.education.score} colorScheme="purple" borderRadius="full" />
                                </Box>
                                <Box>
                                    <Flex justify="space-between" mb={2}>
                                        <Text fontWeight="medium">Keywords</Text>
                                        <Text fontWeight="bold">65%</Text>
                                    </Flex>
                                    <Progress value={65} colorScheme="orange" borderRadius="full" />
                                </Box>
                            </VStack>
                        </CustomCard>
                    </Box>
                </SimpleGrid>

                <CustomCard>
                    <Tabs variant="enclosed" colorScheme="brand">
                        <TabList>
                            <Tab fontWeight="bold">Matched Skills</Tab>
                            <Tab fontWeight="bold">Missing Keywords</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                                    {result.skills.matched.map(skill => (
                                        <HStack key={skill} p={3} bg="green.50" rounded="md">
                                            <Icon as={FaCheckCircle} color="green.500" />
                                            <Text>{skill}</Text>
                                        </HStack>
                                    ))}
                                </SimpleGrid>
                            </TabPanel>
                            <TabPanel>
                                <VStack align="stretch" spacing={4}>
                                    {result.keywords.map((kw, index) => (
                                        <HStack key={index} p={4} bg="orange.50" rounded="md" justify="space-between">
                                            <HStack>
                                                <Icon as={FaExclamationCircle} color="orange.500" />
                                                <Box>
                                                    <Text fontWeight="bold">{kw.keyword}</Text>
                                                    <Text fontSize="sm" color="gray.600">{kw.context}</Text>
                                                </Box>
                                            </HStack>
                                            <Badge colorScheme={kw.importance === 'High' ? 'red' : 'yellow'}>{kw.importance}</Badge>
                                        </HStack>
                                    ))}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CustomCard>
            </Section>
        </Box>
    );
};

export default AnalysisResults;
