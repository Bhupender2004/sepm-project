import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Box
            bg="transparent"
            borderTop={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
            position="relative"
            zIndex={1}
            css={{
                backdropFilter: 'blur(10px)',
            }}
        >
            <Container
                as={Stack}
                maxW={'container.xl'}
                py={8}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}>
                <Text fontSize="sm" color="gray.500">
                    © {new Date().getFullYear()} ResumeAI. All rights reserved
                </Text>
                <Stack direction={'row'} spacing={6}>
                    {['Home', 'About', 'Contact', 'Privacy'].map((item) => (
                        <Link
                            key={item}
                            href={'#'}
                            fontSize="sm"
                            color="gray.500"
                            _hover={{ color: 'brand.500', textDecoration: 'none' }}
                        >
                            {item}
                        </Link>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
