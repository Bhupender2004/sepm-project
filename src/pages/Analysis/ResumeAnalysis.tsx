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
import { useState } from 'react';
import { FiArrowRight, FiPlay, FiFileText, FiList } from 'react-icons/fi';
import FileUpload from '../../components/features/FileUpload';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { analyzeResume, type AnalysisResult } from '../../services/AnalysisService';

const MAX_JD_CHARS = 10000;

const ResumeAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const navigate = useNavigate();

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
                                Analyze Your <br />
                                Resume <Text as="span" color="#7AAACE">with AI</Text>
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
                                >
                                    View Example
                                </Button>
                            </HStack>
                        </VStack>

                        <Box display={{ base: "none", md: "block" }} flex={1}>
                            <Image
                                src="/ai_resume_illustration.png"
                                alt="AI Resume Analysis Illustration"
                                w="100%"
                                maxH="400px"
                                objectFit="contain"
                                borderRadius="2xl"
                                animation="floating 3s ease-in-out infinite"
                                sx={{
                                    '@keyframes floating': {
                                        '0%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-15px)' },
                                        '100%': { transform: 'translateY(0px)' }
                                    }
                                }}
                            />
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
