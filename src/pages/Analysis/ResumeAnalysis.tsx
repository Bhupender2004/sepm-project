import {
    Box,
    SimpleGrid,
    Text,
    Textarea,
    Heading,
    VStack,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription,
    HStack,
    Icon,
    Button,
    Container,
    Flex,
    Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiPlay, FiFileText, FiList } from 'react-icons/fi';
import FileUpload from '../../components/features/FileUpload';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { analyzeResume, type AnalysisResult } from '../../services/AnalysisService';

const MAX_JD_CHARS = 10000;

const words = ['Analyze', 'Improve', 'Optimize', 'Enhance'];

const useTypewriter = (words: string[], typingSpeed = 120, deletingSpeed = 80, pauseDuration = 1800) => {
    const [displayText, setDisplayText] = useState(words[0]);
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        if (isDeleting) {
            if (displayText.length === 0) {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
                return;
            }
            const deleteTimer = setTimeout(() => {
                setDisplayText((prev) => prev.slice(0, -1));
            }, deletingSpeed);
            return () => clearTimeout(deleteTimer);
        }

        // Typing
        if (displayText.length < currentWord.length) {
            const typeTimer = setTimeout(() => {
                setDisplayText(currentWord.slice(0, displayText.length + 1));
            }, typingSpeed);
            return () => clearTimeout(typeTimer);
        }

        // Word complete, pause
        setIsPaused(true);
    }, [displayText, wordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseDuration]);

    return displayText;
};

const ResumeAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const navigate = useNavigate();
    const typewriterText = useTypewriter(words);

    const handleAnalyze = async () => {
        setError(null);

        if (!file) {
            toast({ title: 'Please upload a resume', status: 'warning', duration: 3000 });
            return;
        }
        if (!jobDescription.trim() || jobDescription.trim().length < 50) {
            toast({ title: 'Please enter a job description (at least 50 characters)', status: 'warning', duration: 3000 });
            return;
        }

        setIsAnalyzing(true);
        try {
            const result: AnalysisResult = await analyzeResume(file, jobDescription);

            // Store result in sessionStorage so AnalysisResults page can access it
            sessionStorage.setItem('analysisResult', JSON.stringify(result));
            sessionStorage.setItem('analysisFileName', file.name);

            navigate('/results');
        } catch (err: any) {
            setError(err.message || 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleViewExample = () => {
        setIsAnalyzing(true);
        // Simulate a slight delay for realism
        setTimeout(() => {
            const mockResult: AnalysisResult = {
                overallScore: 88,
                atsScore: 92,
                summary: "This is a strong candidate for a Senior Frontend Developer role. The resume demonstrates extensive experience with modern web technologies, though it could benefit from more emphasis on cloud infrastructure and CI/CD pipelines.",
                categoryScores: {
                    technicalSkills: 90,
                    softSkills: 85,
                    experience: 95,
                    education: 80,
                    keywords: 88
                },
                matchedElements: {
                    skills: ["React", "TypeScript", "Node.js", "Redux", "GraphQL"],
                    experience: ["5+ years frontend development", "Led a team of 3 developers", "Performance optimization"],
                    education: ["Bachelor's in Computer Science"],
                    keywords: ["Agile", "REST APIs", "WebSockets"]
                },
                missingElements: {
                    skills: ["AWS", "Docker", "Kubernetes"],
                    experience: ["Mentoring junior developers"],
                    keywords: ["CI/CD", "Microservices"]
                },
                keywordSuggestions: [
                    {
                        keyword: "AWS",
                        priority: "high",
                        suggestedSection: "Skills",
                        exampleUsage: "Deployed frontend applications using AWS S3 and CloudFront.",
                        importanceScore: 9
                    },
                    {
                        keyword: "Docker",
                        priority: "medium",
                        suggestedSection: "Skills",
                        exampleUsage: "Containerized applications using Docker for consistent local development.",
                        importanceScore: 7
                    },
                    {
                        keyword: "CI/CD",
                        priority: "high",
                        suggestedSection: "Experience",
                        exampleUsage: "Implemented CI/CD pipelines using GitHub Actions to automate deployments.",
                        importanceScore: 8
                    }
                ],
                recommendations: [
                    "Include more details about your experience with cloud platforms like AWS.",
                    "Highlight mentoring or leadership experience to align better with Senior role requirements.",
                    "Add specific metrics (e.g., 'improved performance by 20%') to quantify your impact."
                ],
                resumeSkills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Git", "Node.js", "Redux", "GraphQL", "Jest", "Cypress"]
            };

            sessionStorage.setItem('analysisResult', JSON.stringify(mockResult));
            sessionStorage.setItem('analysisFileName', 'example_john_doe_resume.pdf');
            setIsAnalyzing(false);
            navigate('/results');
        }, 1500);
    };

    if (isAnalyzing) {
        return (
            <Loading
                fullScreen
                text="AI is analyzing your resume... This may take up to 30 seconds."
            />
        );
    }
    return (
        <Box bg="transparent" minH="calc(100vh - 64px)">
            <Container maxW="container.xl">
                {error && (
                    <Alert status="error" mt={6} borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Hero Section */}
                <Box pt={16} pb={24} textAlign={{ base: "center", md: "left" }}>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        align="center"
                        justify="space-between"
                        gap={12}
                    >
                        <VStack align={{ base: "center", md: "flex-start" }} spacing={8} maxW="xl">
                            <Box
                                bg="#E6F0FF"
                                color="#7AAACE"
                                px={4}
                                py={1.5}
                                borderRadius="full"
                                fontSize="sm"
                                fontWeight="bold"
                                display="inline-flex"
                                alignItems="center"
                            >
                                <Box w={2} h={2} bg="#7AAACE" borderRadius="full" mr={2} />
                                AI-Powered Resume Analysis
                            </Box>

                            <Heading
                                fontSize={{ base: "5xl", md: "6xl", lg: "7xl" }}
                                fontWeight="800"
                                lineHeight="1.1"
                                letterSpacing="tight"
                                color="gray.900"
                            >
                                <Text as="span" color="#7AAACE" display="inline">
                                    {typewriterText}
                                    <Text
                                        as="span"
                                        display="inline-block"
                                        w="3px"
                                        h="0.9em"
                                        bg="#7AAACE"
                                        ml="2px"
                                        verticalAlign="text-bottom"
                                        sx={{
                                            animation: 'blink 1s step-end infinite',
                                            '@keyframes blink': {
                                                '0%, 100%': { opacity: 1 },
                                                '50%': { opacity: 0 }
                                            }
                                        }}
                                    />
                                </Text>{' '}
                                Your <br />
                                Resume <Text as="span" color="#2DD4BF">with AI</Text>
                            </Heading>

                            <Text color="gray.500" fontSize={{ base: "xl", md: "2xl" }} lineHeight="tall" maxW="lg">
                                Upload your resume and compare it with job descriptions to get an AI-powered match score and improvement suggestions.
                            </Text>

                            <HStack spacing={4} pt={4} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                                <Button
                                    size="lg"
                                    bg="#7AAACE"
                                    color="white"
                                    _hover={{ bg: "#9CD5FF" }}
                                    borderRadius="full"
                                    px={8}
                                    py={7}
                                    rightIcon={<Icon as={FiArrowRight} />}
                                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    boxShadow="md"
                                >
                                    Analyze Resume
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    bg="white"
                                    borderColor="gray.200"
                                    color="gray.800"
                                    _hover={{ bg: "gray.50" }}
                                    borderRadius="full"
                                    px={8}
                                    py={7}
                                    leftIcon={<Icon as={FiPlay} />}
                                    onClick={handleViewExample}
                                    isLoading={isAnalyzing}
                                    loadingText=""
                                >
                                    View Example
                                </Button>
                            </HStack>
                        </VStack>

                        <Box display={{ base: "none", md: "block" }} flex={1}>
                            <Box
                                borderRadius="3xl"
                                overflow="hidden"
                                bg="white"
                                p={2}
                                boxShadow="0 24px 50px rgba(86, 129, 163, 0.28)"
                                animation="floating 3s ease-in-out infinite"
                                sx={{
                                    '@keyframes floating': {
                                        '0%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-15px)' },
                                        '100%': { transform: 'translateY(0px)' }
                                    }
                                }}
                            >
                                <Image
                                    src="/ai_resume_illustration.png"
                                    alt="AI Resume Analysis Illustration"
                                    w="100%"
                                    h="400px"
                                    objectFit="cover"
                                    objectPosition="center"
                                    borderRadius="2xl"
                                    display="block"
                                />
                            </Box>
                        </Box>
                    </Flex>
                </Box>

                {/* Upload Section */}
                <Box id="upload-section" py={16}>
                    <VStack spacing={4} mb={12} textAlign="center">
                        <Heading size="2xl" fontWeight="800" color="gray.900">Get Started in Seconds</Heading>
                        <Text color="gray.500" fontSize="lg">
                            Upload your resume and paste the job description to receive instant AI feedback.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={12}>
                        {/* Resume Upload Column */}
                        <Box bg="white" borderRadius="2xl" p={8} boxShadow="sm" border="1px solid" borderColor="gray.100">
                            <VStack align="stretch" spacing={6}>
                                <HStack spacing={4}>
                                    <Flex w={10} h={10} bg="#F0F7FF" borderRadius="full" align="center" justify="center" color="#7AAACE">
                                        <Icon as={FiFileText} />
                                    </Flex>
                                    <Heading size="md" fontWeight="600" color="gray.800">1. Upload Resume</Heading>
                                </HStack>

                                <Box pt={2}>
                                    <FileUpload onFileSelect={(f) => setFile(f)} />
                                </Box>

                                {file && (
                                    <Alert status="success" borderRadius="md" py={2}>
                                        <AlertIcon />
                                        <AlertDescription fontSize="sm">
                                            <strong>{file.name}</strong> ready ({(file.size / 1024).toFixed(0)} KB)
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </VStack>
                        </Box>

                        {/* Job Description Column */}
                        <Box bg="white" borderRadius="2xl" p={8} boxShadow="sm" border="1px solid" borderColor="gray.100">
                            <VStack align="stretch" spacing={6} h="full">
                                <HStack spacing={4}>
                                    <Flex w={10} h={10} bg="#F0F7FF" borderRadius="full" align="center" justify="center" color="#7AAACE">
                                        <Icon as={FiList} />
                                    </Flex>
                                    <Heading size="md" fontWeight="600" color="gray.800">2. Job Description</Heading>
                                </HStack>

                                <Box flex={1} position="relative" pt={2}>
                                    <Textarea
                                        placeholder="Paste the job description here..."
                                        h="full"
                                        minH="240px"
                                        resize="none"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD_CHARS))}
                                        borderColor="gray.100"
                                        bg="#F8FAFC"
                                        _focus={{
                                            borderColor: '#7AAACE',
                                            boxShadow: '0 0 0 1px #7AAACE',
                                            bg: 'white'
                                        }}
                                        fontSize="md"
                                        borderRadius="xl"
                                        p={5}
                                    />
                                    <Text position="absolute" bottom={4} right={4} fontSize="xs" color="gray.400">
                                        {jobDescription.length}/{MAX_JD_CHARS}
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    </SimpleGrid>

                    <Box mt={4} mb={20} textAlign="center">
                        <Button
                            size="lg"
                            bg="#7AAACE"
                            color="white"
                            _hover={{ bg: "#9CD5FF", transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            px={16}
                            py={8}
                            borderRadius="full"
                            fontSize="xl"
                            fontWeight="bold"
                            onClick={handleAnalyze}
                            isDisabled={!file || !jobDescription.trim()}
                            isLoading={isAnalyzing}
                            transition="all 0.2s"
                        >
                            Analyze Now
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default ResumeAnalysis;
