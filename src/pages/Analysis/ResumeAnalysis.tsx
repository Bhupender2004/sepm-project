import { Box, SimpleGrid, Text, Textarea, Heading, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import FileUpload from '../../components/features/FileUpload';
import CustomButton from '../../components/common/CustomButton';
import { useNavigate } from 'react-router-dom';

const ResumeAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!file) {
            toast({ title: 'Please upload a resume', status: 'warning' });
            return;
        }
        if (!jobDescription.trim()) {
            toast({ title: 'Please enter a job description', status: 'warning' });
            return;
        }

        setIsAnalyzing(true);
        // Mock API call
        setTimeout(() => {
            setIsAnalyzing(false);
            navigate('/results'); // Navigate to results page
        }, 2500);
    };

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading mb={8} size="lg">New Analysis</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {/* Resume Upload Column */}
                    <Box>
                        <CustomCard h="full">
                            <VStack align="stretch" spacing={4}>
                                <Heading size="md">1. Upload Resume</Heading>
                                <Text color="gray.500" fontSize="sm">Upload your latest resume to check against the job description.</Text>
                                <Box py={4}>
                                    <FileUpload onFileSelect={(f) => setFile(f)} />
                                </Box>
                            </VStack>
                        </CustomCard>
                    </Box>

                    {/* Job Description Column */}
                    <Box>
                        <CustomCard h="full">
                            <VStack align="stretch" spacing={4} h="full">
                                <Heading size="md">2. Job Description</Heading>
                                <Text color="gray.500" fontSize="sm">Paste the job description you want to apply for.</Text>
                                <Textarea
                                    placeholder="Paste job description here..."
                                    h="300px"
                                    resize="none"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    borderColor="gray.300"
                                    _focus={{ borderColor: 'brand.500' }}
                                />
                            </VStack>
                        </CustomCard>
                    </Box>
                </SimpleGrid>

                <Box mt={8} textAlign="center">
                    <CustomButton
                        size="lg"
                        w={{ base: "full", md: "300px" }}
                        onClick={handleAnalyze}
                        isLoading={isAnalyzing}
                        loadingText="Analyzing..."
                    >
                        Analyze Resume
                    </CustomButton>
                </Box>
            </Section>
        </Box>
    );
};

export default ResumeAnalysis;
