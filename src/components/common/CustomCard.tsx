import { Box, type BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface CustomCardProps extends BoxProps {
    children: ReactNode;
}

const CustomCard = ({ children, variant = 'glass', ...props }: CustomCardProps & { variant?: string }) => {
    return (
        <Box
            variant={variant}
            p={8}
            {...props}
        >
            {children}
        </Box>
    );
};

export default CustomCard;
