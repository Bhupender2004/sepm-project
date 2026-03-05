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
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaFileAlt, FaRobot } from 'react-icons/fa';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import FileUpload from '../../components/features/FileUpload';
import CustomButton from '../../components/common/CustomButton';
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
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <VStack spacing={2} mb={8} align="flex-start">
                    <Heading size="lg">New Resume Analysis</Heading>
                    <Text color="gray.500">
                        Upload your resume and paste a job description to get an AI-powered match score with detailed feedback.
                    </Text>
                </VStack>

                {error && (
                    <Alert status="error" mb={6} borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {/* Resume Upload Column */}
                    <CustomCard>
                        <VStack align="stretch" spacing={4}>
                            <HStack spacing={3}>
                                <Icon as={FaFileAlt} color="brand.500" boxSize={5} />
                                <Heading size="md">1. Upload Resume</Heading>
                            </HStack>
                            <Text color="gray.500" fontSize="sm">
                                Supported formats: PDF, DOCX (max 5MB)
                            </Text>
                            <Box py={4}>
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
                    </CustomCard>

                    {/* Job Description Column */}
                    <CustomCard>
                        <VStack align="stretch" spacing={4} h="full">
                            <HStack spacing={3}>
                                <Icon as={FaRobot} color="brand.500" boxSize={5} />
                                <Heading size="md">2. Job Description</Heading>
                            </HStack>
                            <Text color="gray.500" fontSize="sm">
                                Paste the full job description you want to apply for.
                            </Text>
                            <Textarea
                                placeholder="Paste the complete job description here...&#10;&#10;Tip: Include the full description for the most accurate analysis."
                                h="300px"
                                resize="vertical"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD_CHARS))}
                                borderColor="gray.300"
                                _focus={{ borderColor: 'brand.500' }}
                                fontSize="sm"
                            />
                            <Text fontSize="xs" color="gray.400" textAlign="right">
                                {jobDescription.length}/{MAX_JD_CHARS} characters
                            </Text>
                        </VStack>
                    </CustomCard>
                </SimpleGrid>

                <Box mt={8} textAlign="center">
                    <CustomButton
                        size="lg"
                        w={{ base: 'full', md: '320px' }}
                        onClick={handleAnalyze}
                        isDisabled={!file || !jobDescription.trim()}
                    >
                        🔍 Analyze Resume
                    </CustomButton>
                    <Text mt={3} fontSize="sm" color="gray.400">
                        Powered by Google Gemini AI · Results in ~20 seconds
                    </Text>
                </Box>
            </Section>
        </Box>
    );
};

export default ResumeAnalysis;
