import { Heading, Text, VStack, useToast, Container, HStack, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomCard from '../../components/common/CustomCard';
import FormInput from '../../components/common/FormInput';
import CustomButton from '../../components/common/CustomButton';

const MotionContainer = motion(Container);

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (data: any) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                toast({
                    title: 'Welcome Back',
                    description: "You have signed in successfully.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                    variant: 'subtle',
                });
                navigate('/dashboard');
                resolve(data);
            }, 1000);
        });
    };

    return (
        <Box
            py={{ base: 12, md: 24 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <MotionContainer
                maxW="lg"
                py={{ base: 12, md: 24 }}
                px={{ base: 0, md: 8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <VStack spacing={8} align="stretch">
                    <VStack spacing={3} textAlign="center">
                        <Heading
                            size="xl"
                            fontWeight="800"
                            letterSpacing="tight"
                            color="brand.600"
                            _dark={{ color: "brand.300" }}
                        >
                            Welcome Back
                        </Heading>
                        <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="lg">
                            Sign in to continue your progress
                        </Text>
                    </VStack>

                    <CustomCard w="full" variant="glass" p={{ base: 8, md: 10 }}>
                        <VStack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
                            <VStack spacing={5} w="full">
                                <FormInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errors.email?.message as string}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />

                                <FormInput
                                    id="password"
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    error={errors.password?.message as string}
                                    {...register('password', { required: 'Password is required' })}
                                />
                            </VStack>

                            <CustomButton
                                type="submit"
                                w="full"
                                size="lg"
                                isLoading={isSubmitting}
                                loadingText="Signing in..."
                                fontSize="md"
                            >
                                Sign In
                            </CustomButton>
                        </VStack>
                    </CustomCard>

                    <HStack fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} spacing={1}>
                        <Text>Don't have an account?</Text>
                        <RouterLink to="/register">
                            <Text
                                as="span"
                                color="brand.600"
                                _dark={{ color: "brand.400" }}
                                fontWeight="600"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Sign Up
                            </Text>
                        </RouterLink>
                    </HStack>
                </VStack>
            </MotionContainer>
        </Box>
    );
};

export default Login;
