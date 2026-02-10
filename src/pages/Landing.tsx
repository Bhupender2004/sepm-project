import { Box, Heading, Text, Container, Button, Stack, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import FeaturesSection from '../components/features/FeaturesSection';
import HowItWorks from '../components/features/HowItWorks';
import Testimonials from '../components/features/Testimonials';

const Landing = () => {
    return (
        <>
            <Box position="relative" overflow="hidden">
                {/* Abstract Background Elements */}
                <Box
                    position="absolute"
                    top="-20%"
                    left="-10%"
                    w="40%"
                    h="40%"
                    bgGradient="radial(brand.400, transparent)"
                    filter="blur(100px)"
                    opacity={0.3}
                    zIndex={-1}
                />
                <Box
                    position="absolute"
                    bottom="-10%"
                    right="-5%"
                    w="30%"
                    h="30%"
                    bgGradient="radial(accent.400, transparent)"
                    filter="blur(80px)"
                    opacity={0.2}
                    zIndex={-1}
                />

                <Container maxW={'5xl'}>
                    <Flex
                        as={Box}
                        textAlign={'center'}
                        gap={{ base: 10, md: 14 }}
                        py={{ base: 20, md: 36 }}
                        minH="calc(100vh - 70px)" // Full height minus header
                        direction="column"
                        align="center"
                        justify="center"
                    >
                        <Heading
                            fontWeight={800}
                            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                            lineHeight={'110%'}
                            letterSpacing="tight">
                            Optimize your resume <br />
                            <Text
                                as={'span'}
                                bgGradient="linear(to-r, brand.500, accent.500)"
                                bgClip="text">
                                find your dream job
                            </Text>
                        </Heading>
                        <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl" mx="auto" lineHeight={1.8}>
                            Our AI-powered platform analyzes your resume against job descriptions to help you stand out.
                            Get instant feedback, keyword suggestions, and find matching jobs.
                        </Text>
                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            spacing={6}
                            align={'center'}
                            justify={'center'}
                            alignSelf={'center'}
                            position={'relative'}>
                            <Button
                                as={RouterLink}
                                to="/register"
                                size="lg"
                                rounded={'full'}
                                px={10}
                                py={7}
                                fontSize="lg"
                                colorScheme="brand"
                                boxShadow="xl"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: '2xl',
                                    bgGradient: 'linear(to-r, brand.600, brand.500)',
                                }}>
                                Get Started
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/features"
                                variant={'ghost'}
                                size={'lg'}
                                rounded={'full'}
                                px={8}
                                py={7}
                                fontSize="lg"
                                _hover={{
                                    bg: 'whiteAlpha.300',
                                    color: 'brand.600',
                                }}>
                                Learn more
                            </Button>
                        </Stack>
                    </Flex>
                </Container>
            </Box>

            <FeaturesSection />
            <HowItWorks />
            <Testimonials />
        </>
    );
};

export default Landing;
