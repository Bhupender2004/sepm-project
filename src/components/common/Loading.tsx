import { Flex, Spinner, Text } from '@chakra-ui/react';

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

const Loading = ({ text = 'Loading...', fullScreen = false }: LoadingProps) => {
    return (
        <Flex
            justify="center"
            align="center"
            direction="column"
            h={fullScreen ? '100vh' : '100%'}
            w="100%"
            gap={4}
        >
            <Spinner size="xl" color="brand.500" thickness="4px" />
            {text && <Text color="gray.500">{text}</Text>}
        </Flex>
    );
};

export default Loading;
