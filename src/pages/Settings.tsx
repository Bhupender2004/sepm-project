import { Box, Heading, Text, VStack, Avatar, Flex, Divider, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import CustomCard from '../components/common/CustomCard';
import Section from '../components/layout/Section';
import FormInput from '../components/common/FormInput';

const Settings = () => {
    const { user } = useAuth();
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 64px)" py={8}>
            <Section>
                <VStack spacing={8} align="stretch" maxW="4xl" mx="auto">
                    <Box>
                        <Heading size="lg" mb={2}>Account Settings</Heading>
                        <Text color="gray.500">Manage your profile and account preferences</Text>
                    </Box>

                    <CustomCard>
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <Heading size="md" mb={4}>Profile Information</Heading>
                                <Divider borderColor={borderColor} mb={6} />

                                <Flex direction={{ base: 'column', md: 'row' }} gap={8} align="start">
                                    <VStack spacing={3}>
                                        <Avatar
                                            size="2xl"
                                            name={user?.name}
                                            src="https://bit.ly/broken-link"
                                            bg="brand.500"
                                        />
                                        <Text fontSize="sm" color="gray.500">Profile Picture</Text>
                                    </VStack>

                                    <VStack spacing={4} flex={1} w="full">
                                        <FormInput
                                            id="name"
                                            label="Full Name"
                                            value={user?.name || ''}
                                            isReadOnly
                                        />
                                        <FormInput
                                            id="email"
                                            label="Email Address"
                                            type="email"
                                            value={user?.email || ''}
                                            isReadOnly
                                        />
                                    </VStack>
                                </Flex>
                            </Box>
                        </VStack>
                    </CustomCard>

                    <CustomCard>
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <Heading size="md" mb={4}>Preferences</Heading>
                                <Divider borderColor={borderColor} mb={6} />
                                <Text color="gray.500">
                                    Application preferences and notification settings will appear here.
                                </Text>
                            </Box>
                        </VStack>
                    </CustomCard>
                </VStack>
            </Section>
        </Box>
    );
};

export default Settings;
