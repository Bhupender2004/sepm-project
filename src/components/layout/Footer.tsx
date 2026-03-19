import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';

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
                direction={{ base: 'column', md: 'column' }}
                spacing={4}
                justify={{ base: 'center', md: 'center' }}
                align={{ base: 'center', md: 'center' }}>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                    © 2026 ResumeAI. All rights reserved
                </Text>
            </Container>
        </Box>
    );
};

export default Footer;
