import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface CustomButtonProps extends ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | string;
    as?: any;
    to?: string;
}

const CustomButton = ({ children, variant = 'solid', ...props }: CustomButtonProps) => {
    return (
        <Button
            variant={variant}
            colorScheme="brand"
            {...props}
        >
            {children}
        </Button>
    );
};


export default CustomButton;
