import {
    Box,
    SimpleGrid,
    Text,
    Heading,
    VStack,
    HStack,
    Badge,
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
    Container,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaInfoCircle, FaSearch, FaLightbulb } from 'react-icons/fa';
import { FiCheckCircle as FiCheck, FiAlertCircle, FiArrowUpRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { type AnalysisResult, type KeywordSuggestion } from '../../services/AnalysisService';

// ── Score ring chart ──────────────────────────────────────────────────────────
const ScoreChart = ({ score }: { score: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <Box position="relative" w="200px" h="200px" mx="auto">
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background arc */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                />
                {/* Foreground arc layer */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#7AAACE"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
                {/* Optional: Add linear gradient to defs and reference it in stroke if needed, utilizing #7AAACE and #9CD5FF for an exact match.
                    The user's layout has a gradient but requested "flat color #7AAACE" in text. Given the conflict, using #7AAACE as required by their text. */}
            </svg>
            <VStack position="absolute" top="0" left="0" w="full" h="full" align="center" justify="center" spacing={0}>
                <Text fontSize="5xl" fontWeight="bold" color="#7AAACE" lineHeight="1">{score}%</Text>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">Match</Text>
            </VStack>
        </Box>
    );
};

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
    useEffect(() => {
        const raw = sessionStorage.getItem('analysisResult');
        if (!raw) {
            setLoading(false);
            return;
        }
        try {
            const parsed: AnalysisResult = JSON.parse(raw);
            setResult(parsed);
            setKeywords(parsed.keywordSuggestions.map(kw => ({ ...kw, status: 'pending' })));
        } catch {
            /* ignore */
        }
        setLoading(false);
    }, []);

    if (loading) return <Loading fullScreen text="Loading analysis results..." />;

    if (!result) {
        return (
            <Box bg="transparent" minH="calc(100vh - 64px)">
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

    const { matchedElements, missingElements, recommendations } = result;

    return (
        <Box bg="transparent" minH="calc(100vh - 64px)">
            <Container maxW="container.xl" pt={12}>
                {/* Header Sequence */}
                <VStack spacing={3} align="center" textAlign="center" mb={16}>
                    <Heading size="2xl" fontWeight="800" color="gray.900">AI Analysis Results</Heading>
                    <Text color="gray.500" fontSize="xl" maxW="2xl">
                        Your personalized resume feedback powered by artificial intelligence.
                    </Text>
                </VStack>

                {/* 3-Card Summary Grid */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10} mb={16}>
                    {/* Card 1: Score */}
                    <Box bg="white" borderRadius="2xl" p={10} boxShadow="sm" border="1px solid" borderColor="gray.100" textAlign="center">
                        <Box mb={8}>
                            <ScoreChart score={result.overallScore} />
                        </Box>
                        <Heading size="lg" fontWeight="800" mb={2} color="gray.900">AI Match Score</Heading>
                        <Text color="gray.500" fontSize="md">{result.overallScore >= 70 ? 'Good match — room to improve' : 'Moderate match — improvements needed'}</Text>
                    </Box>

                    {/* Card 2: Skills Match / Missing */}
                    <Box bg="white" borderRadius="2xl" p={10} boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <VStack align="stretch" spacing={10}>
                            <Box>
                                <HStack spacing={3} mb={5}>
                                    <Icon as={FiCheck} color="#7AAACE" w={6} h={6} />
                                    <Heading size="md" fontWeight="bold" color="gray.900">Skills Matched</Heading>
                                </HStack>
                                <Wrap spacing={3}>
                                    {matchedElements.skills.slice(0, 6).map(skill => (
                                        <WrapItem key={skill}>
                                            <Badge color="#7AAACE" bg="#E6F0FF" px={4} py={2} borderRadius="full" textTransform="none" fontWeight="600" fontSize="sm">
                                                {skill}
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                    {matchedElements.skills.length === 0 && <Text fontSize="sm" color="gray.500">No core skills matched.</Text>}
                                </Wrap>
                            </Box>

                            <Box>
                                <HStack spacing={3} mb={5}>
                                    <Icon as={FiAlertCircle} color="red.500" w={6} h={6} />
                                    <Heading size="md" fontWeight="bold" color="gray.900">Missing Keywords</Heading>
                                </HStack>
                                <Wrap spacing={3}>
                                    {missingElements.keywords.slice(0, 6).map(kw => (
                                        <WrapItem key={kw}>
                                            <Badge color="red.500" bg="red.50" px={4} py={2} borderRadius="full" textTransform="none" fontWeight="600" fontSize="sm">
                                                {kw}
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                    {missingElements.keywords.length === 0 && <Text fontSize="sm" color="gray.500">No missing keywords found.</Text>}
                                </Wrap>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Card 3: Improvement Tips */}
                    <Box bg="white" borderRadius="2xl" p={10} boxShadow="sm" border="1px solid" borderColor="gray.100">
                        <HStack spacing={3} mb={8}>
                            <Icon as={FaLightbulb} color="#7AAACE" w={6} h={6} />
                            <Heading size="md" fontWeight="bold" color="gray.900">Improvement Tips</Heading>
                        </HStack>
                        <VStack align="stretch" spacing={6}>
                            {recommendations.slice(0, 4).map((tip, idx) => (
                                <HStack key={idx} align="flex-start" spacing={4}>
                                    <Icon as={FiArrowUpRight} color="#7AAACE" w={5} h={5} mt={0.5} />
                                    <Text fontSize="md" color="gray.600" lineHeight="tall">{tip}</Text>
                                </HStack>
                            ))}
                            {recommendations.length === 0 && <Text fontSize="sm" color="gray.500">No additional tips available.</Text>}
                        </VStack>
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
            </Container>
        </Box>
    );
};

export default AnalysisResults;
