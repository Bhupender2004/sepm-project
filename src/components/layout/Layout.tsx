import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';

interface LayoutProps {
    children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Flex direction="column" minH="100vh">
            <Header />
            <Box flex="1" as="main">
                {children}
            </Box>
            <Footer />
        </Flex>
    );
};

export default Layout;
