import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';
import Section from '../layout/Section';
import CustomCard from '../common/CustomCard';

interface FeatureProps {
    title: string;
    text: string;
    icon: React.ElementType;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
    return (
        <CustomCard>
            <Stack>
                <Flex
                    w={16}
                    h={16}
                    align={'center'}
                    justify={'center'}
                    color={'white'}
                    rounded={'full'}
                    bg={'gray.100'}
                    mb={1}>
                    <Icon as={icon} w={10} h={10} />
                </Flex>
                <Text fontWeight={600}>{title}</Text>
                <Text color={'gray.600'}>{text}</Text>
            </Stack>
        </CustomCard>
    );
};

export default function FeaturesSection() {
    return (
        <Box p={4} bg="white">
            <Section>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                    <Feature
                        icon={FcAssistant}
                        title={'AI Resume Analysis'}
                        text={
                            'Get instant feedback on your resume with our advanced AI algorithms. Identify gaps and improve your score.'
                        }
                    />
                    <Feature
                        icon={FcDonate}
                        title={'Job Matching'}
                        text={
                            'Find jobs that perfectly match your skills and experience from top job boards tailored to you.'
                        }
                    />
                    <Feature
                        icon={FcInTransit}
                        title={'Optimization Tools'}
                        text={
                            'Use our keyword suggestions and optimization tools to tailor your resume for every application.'
                        }
                    />
                </SimpleGrid>
            </Section>
        </Box>
    );
}
