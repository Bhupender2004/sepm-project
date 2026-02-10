import { Container, type ContainerProps } from '@chakra-ui/react';

const Section = ({ children, ...props }: ContainerProps) => {
    return (
        <Container maxW="container.xl" py={{ base: 8, md: 12 }} {...props}>
            {children}
        </Container>
    );
};

export default Section;
