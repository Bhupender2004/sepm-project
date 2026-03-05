import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    VStack,
    HStack,
    Badge,
    Progress,
    Tab,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Flex,
    Icon,
    Checkbox,
    Tooltip,
    Alert,
    AlertIcon,
    AlertDescription,
    Divider,
    Tag,
    TagLabel,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaInfoCircle, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { type AnalysisResult, type KeywordSuggestion } from '../../services/AnalysisService';

// ── Score ring chart ──────────────────────────────────────────────────────────
const getScoreColor = (score: number) => {
    if (score >= 75) return '#00A86B';
    if (score >= 50) return '#ECC94B';
    return '#FC8181';
};

const ScoreChart = ({ score }: { score: number }) => {
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];
    const color = getScoreColor(score);
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
                        paddingAngle={2}
                        dataKey="value"
                    >
                        <Cell fill={color} />
                        <Cell fill="#E2E8F0" />
                    </Pie>
                    <RechartsTooltip />
                </PieChart>
            </ResponsiveContainer>
            <VStack position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" spacing={0}>
                <Text fontSize="4xl" fontWeight="bold" color={color}>{score}%</Text>
                <Text fontSize="sm" color="gray.500">Match</Text>
            </VStack>
        </Box>
    );
};

// ── Category bar ──────────────────────────────────────────────────────────────
const CategoryBar = ({ label, value, colorScheme }: { label: string; value: number; colorScheme: string }) => (
    <Box>
        <Flex justify="space-between" mb={1}>
            <Text fontWeight="medium" fontSize="sm">{label}</Text>
            <Text fontWeight="bold" fontSize="sm" color={`${colorScheme}.600`}>{value}%</Text>
        </Flex>
        <Progress value={value} colorScheme={colorScheme} borderRadius="full" size="sm" />
    </Box>
);

// ── Priority badge ─────────────────────────────────────────────────────────────
const priorityColor = (p: string) => {
    if (p === 'high') return 'red';
    if (p === 'medium') return 'orange';
    return 'gray';
};

// ── Main Component ─────────────────────────────────────────────────────────────
const AnalysisResults = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [keywords, setKeywords] = useState<(KeywordSuggestion & { status: 'pending' | 'added' | 'rejected' })[]>([]);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        const raw = sessionStorage.getItem('analysisResult');
        const name = sessionStorage.getItem('analysisFileName') ?? '';
        if (!raw) {
            setLoading(false);
            return;
        }
        try {
            const parsed: AnalysisResult = JSON.parse(raw);
            setResult(parsed);
            setKeywords(parsed.keywordSuggestions.map(kw => ({ ...kw, status: 'pending' })));
            setFileName(name);
        } catch {
            /* ignore */
        }
        setLoading(false);
    }, []);

    if (loading) return <Loading fullScreen text="Loading analysis results..." />;

    if (!result) {
        return (
            <Box bg="gray.50" minH="calc(100vh - 64px)">
                <Section>
                    <CustomCard textAlign="center" py={16}>
                        <Heading size="md" mb={3}>No Analysis Found</Heading>
                        <Text color="gray.500" mb={6}>
                            Please upload a resume and job description to get started.
                        </Text>
                        <CustomButton onClick={() => navigate('/')}>Start New Analysis</CustomButton>
                    </CustomCard>
                </Section>
            </Box>
        );
    }

    const toggleKeyword = (idx: number, newStatus: 'added' | 'pending' | 'rejected') => {
        setKeywords(prev => prev.map((kw, i) => i === idx ? { ...kw, status: newStatus } : kw));
    };

    const addedCount = keywords.filter(k => k.status === 'added').length;
    const estimatedImprovement = Math.min(10, addedCount * 2);
    const estimatedScore = Math.min(100, result.overallScore + estimatedImprovement);

    const { categoryScores, matchedElements, missingElements, recommendations } = result;

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                {/* Header */}
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading size="lg">Analysis Results</Heading>
                        {fileName && <Text color="gray.500" fontSize="sm" mt={1}>📄 {fileName}</Text>}
                    </Box>
                    <HStack spacing={3}>
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => { sessionStorage.clear(); navigate('/'); }}
                        >
                            New Analysis
                        </CustomButton>
                        <CustomButton size="sm" onClick={() => navigate('/jobs')}>
                            <Icon as={FaSearch} mr={2} />
                            Find Matching Jobs
                        </CustomButton>
                    </HStack>
                </Flex>

                {/* Top row: Score ring + Category scores */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mb={8}>
                    {/* Score ring */}
                    <CustomCard textAlign="center">
                        <Heading size="md" mb={4}>Overall Match</Heading>
                        <ScoreChart score={result.overallScore} />
                        <HStack justify="center" mt={4} spacing={4}>
                            <Box textAlign="center">
                                <Text fontSize="2xl" fontWeight="bold" color="blue.500">{result.atsScore}%</Text>
                                <Text fontSize="xs" color="gray.500">ATS Score</Text>
                            </Box>
                        </HStack>
                        <Text color="gray.600" mt={4} fontSize="sm">{result.summary}</Text>
                    </CustomCard>

                    {/* Category breakdown */}
                    <Box gridColumn={{ lg: 'span 2' }}>
                        <CustomCard h="full">
                            <Heading size="md" mb={6}>Category Breakdown</Heading>
                            <VStack spacing={5} align="stretch">
                                <CategoryBar label="Technical Skills" value={categoryScores.technicalSkills} colorScheme="green" />
                                <CategoryBar label="Soft Skills" value={categoryScores.softSkills} colorScheme="teal" />
                                <CategoryBar label="Experience" value={categoryScores.experience} colorScheme="blue" />
                                <CategoryBar label="Education" value={categoryScores.education} colorScheme="purple" />
                                <CategoryBar label="Keywords" value={categoryScores.keywords} colorScheme="orange" />
                            </VStack>
                        </CustomCard>
                    </Box>
                </SimpleGrid>

                {/* Tabs: Matched / Missing / Keyword Suggestions / Recommendations */}
                <CustomCard>
                    <Tabs variant="enclosed" colorScheme="green">
                        <TabList>
                            <Tab fontWeight="semibold">✅ Matched</Tab>
                            <Tab fontWeight="semibold">❌ Missing</Tab>
                            <Tab fontWeight="semibold">
                                💡 Keyword Suggestions
                                {addedCount > 0 && (
                                    <Badge ml={2} colorScheme="green">{addedCount} added</Badge>
                                )}
                            </Tab>
                            <Tab fontWeight="semibold">📋 Recommendations</Tab>
                        </TabList>

                        <TabPanels>
                            {/* ── Matched Elements ────────────────────────────── */}
                            <TabPanel>
                                <VStack align="stretch" spacing={6}>
                                    {matchedElements.skills.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3} color="green.700">Skills</Text>
                                            <Wrap spacing={2}>
                                                {matchedElements.skills.map(skill => (
                                                    <WrapItem key={skill}>
                                                        <Tag colorScheme="green" size="md">
                                                            <Icon as={FaCheckCircle} mr={2} />
                                                            <TagLabel>{skill}</TagLabel>
                                                        </Tag>
                                                    </WrapItem>
                                                ))}
                                            </Wrap>
                                        </Box>
                                    )}
                                    {matchedElements.experience.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3} color="blue.700">Experience</Text>
                                            <VStack align="stretch" spacing={2}>
                                                {matchedElements.experience.map((item, i) => (
                                                    <HStack key={i} p={3} bg="blue.50" rounded="md">
                                                        <Icon as={FaCheckCircle} color="blue.500" />
                                                        <Text fontSize="sm">{item}</Text>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    )}
                                    {matchedElements.keywords.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3} color="teal.700">Keywords</Text>
                                            <Wrap spacing={2}>
                                                {matchedElements.keywords.map(kw => (
                                                    <WrapItem key={kw}>
                                                        <Tag colorScheme="teal" size="sm">
                                                            <TagLabel>{kw}</TagLabel>
                                                        </Tag>
                                                    </WrapItem>
                                                ))}
                                            </Wrap>
                                        </Box>
                                    )}
                                    {matchedElements.skills.length === 0 && matchedElements.experience.length === 0 && (
                                        <Alert status="info" borderRadius="md">
                                            <AlertIcon />
                                            <AlertDescription>No strong matches found. Consider improving your resume alignment with the job description.</AlertDescription>
                                        </Alert>
                                    )}
                                </VStack>
                            </TabPanel>

                            {/* ── Missing Elements ─────────────────────────────── */}
                            <TabPanel>
                                <VStack align="stretch" spacing={6}>
                                    {missingElements.skills.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3} color="red.700">Missing Skills</Text>
                                            <Wrap spacing={2}>
                                                {missingElements.skills.map(skill => (
                                                    <WrapItem key={skill}>
                                                        <Tag colorScheme="red" size="md">
                                                            <Icon as={FaTimesCircle} mr={2} />
                                                            <TagLabel>{skill}</TagLabel>
                                                        </Tag>
                                                    </WrapItem>
                                                ))}
                                            </Wrap>
                                        </Box>
                                    )}
                                    {missingElements.keywords.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3} color="orange.700">Missing Keywords</Text>
                                            <Wrap spacing={2}>
                                                {missingElements.keywords.map(kw => (
                                                    <WrapItem key={kw}>
                                                        <Tag colorScheme="orange" size="sm">
                                                            <Icon as={FaExclamationCircle} mr={2} />
                                                            <TagLabel>{kw}</TagLabel>
                                                        </Tag>
                                                    </WrapItem>
                                                ))}
                                            </Wrap>
                                        </Box>
                                    )}
                                    {missingElements.experience.length > 0 && (
                                        <Box>
                                            <Text fontWeight="bold" mb={3}>Experience Gaps</Text>
                                            <VStack align="stretch" spacing={2}>
                                                {missingElements.experience.map((item, i) => (
                                                    <HStack key={i} p={3} bg="red.50" rounded="md">
                                                        <Icon as={FaExclamationCircle} color="red.400" />
                                                        <Text fontSize="sm">{item}</Text>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </Box>
                                    )}
                                    {missingElements.skills.length === 0 && missingElements.keywords.length === 0 && (
                                        <Alert status="success" borderRadius="md">
                                            <AlertIcon />
                                            <AlertDescription>Great news — no critical gaps found!</AlertDescription>
                                        </Alert>
                                    )}
                                </VStack>
                            </TabPanel>

                            {/* ── Keyword Suggestions ──────────────────────────── */}
                            <TabPanel>
                                {keywords.length > 0 && (
                                    <Box mb={4} p={4} bg="blue.50" borderRadius="md">
                                        <HStack spacing={4}>
                                            <Icon as={FaInfoCircle} color="blue.500" />
                                            <Box>
                                                <Text fontWeight="bold" fontSize="sm">
                                                    Add keywords to improve your score
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    Estimated score with all keywords added: <strong>{estimatedScore}%</strong> (+{estimatedImprovement}%)
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                )}

                                <VStack align="stretch" spacing={4}>
                                    {keywords.map((kw, idx) => (
                                        <Box
                                            key={idx}
                                            p={4}
                                            borderRadius="md"
                                            borderWidth={1}
                                            borderColor={kw.status === 'added' ? 'green.200' : kw.status === 'rejected' ? 'gray.200' : 'orange.100'}
                                            bg={kw.status === 'added' ? 'green.50' : kw.status === 'rejected' ? 'gray.50' : 'orange.50'}
                                            opacity={kw.status === 'rejected' ? 0.6 : 1}
                                        >
                                            <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
                                                <Box flex={1}>
                                                    <HStack mb={1} flexWrap="wrap">
                                                        <Text fontWeight="bold">{kw.keyword}</Text>
                                                        <Badge colorScheme={priorityColor(kw.priority)} fontSize="xs">
                                                            {kw.priority.toUpperCase()}
                                                        </Badge>
                                                        <Badge colorScheme="gray" fontSize="xs" variant="outline">
                                                            {kw.suggestedSection}
                                                        </Badge>
                                                    </HStack>
                                                    {kw.exampleUsage && (
                                                        <Text fontSize="xs" color="gray.600" mt={1} fontStyle="italic">
                                                            e.g. "{kw.exampleUsage}"
                                                        </Text>
                                                    )}
                                                </Box>
                                                <HStack spacing={2}>
                                                    <Tooltip label="Mark as added to my resume">
                                                        <Checkbox
                                                            isChecked={kw.status === 'added'}
                                                            colorScheme="green"
                                                            onChange={() => toggleKeyword(idx, kw.status === 'added' ? 'pending' : 'added')}
                                                        >
                                                            <Text fontSize="sm">Added</Text>
                                                        </Checkbox>
                                                    </Tooltip>
                                                </HStack>
                                            </Flex>
                                        </Box>
                                    ))}
                                    {keywords.length === 0 && (
                                        <Alert status="success" borderRadius="md">
                                            <AlertIcon />
                                            <AlertDescription>No additional keyword suggestions — your resume is well-aligned!</AlertDescription>
                                        </Alert>
                                    )}
                                </VStack>
                            </TabPanel>

                            {/* ── Recommendations ──────────────────────────────── */}
                            <TabPanel>
                                <VStack align="stretch" spacing={3}>
                                    {recommendations.map((rec, idx) => (
                                        <HStack key={idx} p={4} bg="blue.50" rounded="md" align="flex-start">
                                            <Icon as={FaInfoCircle} color="blue.500" mt={0.5} flexShrink={0} />
                                            <Text fontSize="sm">{rec}</Text>
                                        </HStack>
                                    ))}
                                    {recommendations.length === 0 && (
                                        <Alert status="info" borderRadius="md">
                                            <AlertIcon />
                                            <AlertDescription>No specific recommendations at this time.</AlertDescription>
                                        </Alert>
                                    )}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CustomCard>

                {/* Bottom action bar */}
                <Divider my={8} />
                <Flex justify="center" gap={4} flexWrap="wrap">
                    <CustomButton variant="outline" onClick={() => { sessionStorage.clear(); navigate('/'); }}>
                        🔄 Analyze Another Resume
                    </CustomButton>
                    <CustomButton onClick={() => navigate('/jobs')}>
                        <Icon as={FaSearch} mr={2} />
                        Find Matching Jobs
                    </CustomButton>
                </Flex>
            </Section>
        </Box>
    );
};

export default AnalysisResults;
