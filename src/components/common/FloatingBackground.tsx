import { Box } from '@chakra-ui/react';

const FloatingBackground = () => {
    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            overflow="hidden"
            pointerEvents="none"
            zIndex={0}
        >
            {/* Large slow-floating orb — top left */}
            <Box
                position="absolute"
                top="-8%"
                left="-6%"
                w="420px"
                h="420px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(122,170,206,0.35) 0%, transparent 70%)"
                filter="blur(60px)"
                animation="floatA 18s ease-in-out infinite"
            />

            {/* Medium orb — top right */}
            <Box
                position="absolute"
                top="10%"
                right="-4%"
                w="320px"
                h="320px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(156,213,255,0.30) 0%, transparent 70%)"
                filter="blur(50px)"
                animation="floatB 22s ease-in-out infinite"
            />

            {/* Small accent orb — mid left */}
            <Box
                position="absolute"
                top="45%"
                left="5%"
                w="200px"
                h="200px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(122,170,206,0.25) 0%, transparent 70%)"
                filter="blur(45px)"
                animation="floatC 16s ease-in-out infinite"
            />

            {/* Larger orb — bottom right */}
            <Box
                position="absolute"
                bottom="-5%"
                right="10%"
                w="380px"
                h="380px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(156,213,255,0.28) 0%, transparent 70%)"
                filter="blur(55px)"
                animation="floatD 20s ease-in-out infinite"
            />

            {/* Tiny sparkle orb — center */}
            <Box
                position="absolute"
                top="30%"
                left="50%"
                w="150px"
                h="150px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(180,215,240,0.22) 0%, transparent 70%)"
                filter="blur(40px)"
                animation="floatE 14s ease-in-out infinite"
            />

            {/* Bottom-left accent */}
            <Box
                position="absolute"
                bottom="15%"
                left="-3%"
                w="280px"
                h="280px"
                borderRadius="50%"
                bg="radial-gradient(circle, rgba(122,170,206,0.20) 0%, transparent 70%)"
                filter="blur(50px)"
                animation="floatF 24s ease-in-out infinite"
            />
        </Box>
    );
};

export default FloatingBackground;
