import { Heading, Text, VStack, useToast, Container, HStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomCard from '../../components/common/CustomCard';
import FormInput from '../../components/common/FormInput';
import CustomButton from '../../components/common/CustomButton';
import { useAuth } from '../../context/AuthContext';

const MotionContainer = motion(Container);

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();

    const onSubmit = async (data: any) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                login({
                    id: '1',
                    name: data.name,
                    email: data.email,
                });

                toast({
                    title: 'Welcome to ResumeAI',
                    description: "Your account has been created successfully.",
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
        <MotionContainer
            maxW="lg"
            py={{ base: 12, md: 24 }}
            px={{ base: 4, md: 8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={8}>
                <VStack spacing={2} textAlign="center">
                    <Heading
                        size="xl"
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.600, brand.400)"
                        bgClip="text"
                    >
                        Create Account
                    </Heading>
                    <Text color="gray.500" fontSize="lg">
                        Join ResumeAI to optimize your career journey
                    </Text>
                </VStack>

                <CustomCard w="full">
                    <VStack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={5} w="full">
                            <FormInput
                                id="name"
                                label="Full Name"
                                placeholder="John Doe"
                                error={errors.name?.message as string}
                                {...register('name', { required: 'Name is required' })}
                            />

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
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                })}
                            />
                        </VStack>

                        <CustomButton
                            type="submit"
                            w="full"
                            size="lg"
                            isLoading={isSubmitting}
                            loadingText="Creating account..."
                        >
                            Sign Up
                        </CustomButton>
                    </VStack>
                </CustomCard>

                <HStack fontSize="sm" color="gray.600" spacing={1}>
                    <Text>Already have an account?</Text>
                    <RouterLink to="/login">
                        <Text
                            as="span"
                            color="brand.600"
                            fontWeight="600"
                            _hover={{ textDecoration: 'underline' }}
                        >
                            Log In
                        </Text>
                    </RouterLink>
                </HStack>
            </VStack>
        </MotionContainer>
    );
};

export default Register;
