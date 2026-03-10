import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import FloatingBackground from '../common/FloatingBackground';
import type { ReactNode } from 'react';

interface LayoutProps {
    children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Flex direction="column" minH="100vh" position="relative">
            <FloatingBackground />
            <Header />
            <Box flex="1" as="main" position="relative" zIndex={1}>
                {children}
            </Box>
            <Footer />
        </Flex>
    );
};

export default Layout;
