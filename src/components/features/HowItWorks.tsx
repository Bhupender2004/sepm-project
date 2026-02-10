import { Box, SimpleGrid, Text, Stack, Flex, Circle, Heading, Icon } from '@chakra-ui/react';
import { FaFileUpload, FaRobot, FaCheckCircle } from 'react-icons/fa';
import Section from '../layout/Section';

interface StepProps {
    title: string;
    text: string;
    icon: React.ElementType;
    stepNumber: number;
}

const Step = ({ title, text, icon, stepNumber }: StepProps) => {
    return (
        <Stack align={'center'} textAlign={'center'} spacing={4}>
            <Flex position="relative" align="center" justify="center">
                <Circle size="20" bg="brand.50" color="brand.500">
                    <Icon as={icon} w={8} h={8} />
                </Circle>
                <Circle
                    position="absolute"
                    top={-2}
                    right={-2}
                    size={8}
                    bg="brand.500"
                    color="white"
                    fontWeight="bold"
                    fontSize="sm">
                    {stepNumber}
                </Circle>
            </Flex>
            <Heading size="md" fontWeight="semibold">{title}</Heading>
            <Text color="gray.600">{text}</Text>
        </Stack>
    );
};

export default function HowItWorks() {
    return (
        <Box bg="gray.50">
            <Section>
                <Stack spacing={4} as={Box} textAlign={'center'} mb={16}>
                    <Heading fontSize={'3xl'}>How It Works</Heading>
                    <Text color={'gray.600'} fontSize={'xl'}>
                        Three simple steps to optimize your job search
                    </Text>
                </Stack>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                    <Step
                        stepNumber={1}
                        icon={FaFileUpload}
                        title="Upload Resume"
                        text="Upload your existing resume in PDF or DOCX format. We'll securely parse your information."
                    />
                    <Step
                        stepNumber={2}
                        icon={FaRobot}
                        title="AI Analysis"
                        text="Our AI compares your resume against job descriptions to find gaps and keywords."
                    />
                    <Step
                        stepNumber={3}
                        icon={FaCheckCircle}
                        title="Get Hired"
                        text="Apply with an optimized resume and find jobs that match your true potential."
                    />
                </SimpleGrid>
            </Section>
        </Box>
    );
}
