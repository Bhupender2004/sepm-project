import { Box, Text, Stack, Avatar, Heading } from '@chakra-ui/react';
import Section from '../layout/Section';
import CustomCard from '../common/CustomCard';

interface TestimonialProps {
    content: string;
    avatar: string;
    name: string;
    title: string;
}

const Testimonial = ({ content, avatar, name, title }: TestimonialProps) => {
    return (
        <CustomCard h="full">
            <Stack spacing={6} h="full" justify="space-between">
                <Text color="gray.600" fontSize="lg">
                    "{content}"
                </Text>
                <Stack direction="row" align="center" spacing={4}>
                    <Avatar src={avatar} name={name} />
                    <Box>
                        <Text fontWeight="bold">{name}</Text>
                        <Text fontSize="sm" color="gray.500">{title}</Text>
                    </Box>
                </Stack>
            </Stack>
        </CustomCard>
    );
};

export default function Testimonials() {
    return (
        <Box>
            <Section>
                <Stack spacing={4} as={Box} textAlign={'center'} mb={16}>
                    <Heading fontSize={'3xl'}>Trusted by Job Seekers</Heading>
                    <Text color={'gray.600'} fontSize={'xl'}>
                        See what our users say about their success stories
                    </Text>
                </Stack>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    spacing={{ base: 10, md: 4, lg: 10 }}>
                    <Testimonial
                        content="I used to apply to 50 jobs and get 1 interview. After using ResumeAI, I got 3 interviews from 10 applications!"
                        avatar="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        name="Sarah J."
                        title="Software Engineer"
                    />
                    <Testimonial
                        content="The keyword suggestions are a game changer. It explicitly told me what the ATS was looking for."
                        avatar="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        name="Michael C."
                        title="Product Manager"
                    />
                    <Testimonial
                        content="Simple, fast, and effective. The job matching feature saved me hours of scrolling through irrelevant listings."
                        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        name="Emily R."
                        title="Digital Marketer"
                    />
                </Stack>
            </Section>
        </Box>
    );
}
