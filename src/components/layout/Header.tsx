import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    useColorModeValue,
    useDisclosure,
    Container,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomButton from '../common/CustomButton';

export default function Header() {
    const { isOpen, onToggle } = useDisclosure();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box
            position="sticky"
            top={0}
            zIndex="sticky"
            as="header"
            css={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
            _dark={{
                css: {
                    backgroundColor: 'rgba(26, 32, 44, 0.4)',
                }
            }}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')}>
            <Flex
                minH={'70px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}>
                <Container maxW="container.xl" display="flex" alignItems="center">
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} alignItems="center">
                        <Text
                            textAlign={useDisclosure().isOpen ? 'center' : 'left'}
                            fontFamily={'heading'}
                            fontWeight="800"
                            fontSize="2xl"
                            bgGradient="linear(to-r, brand.500, brand.300)"
                            bgClip="text"
                            as={RouterLink}
                            to={isAuthenticated ? "/dashboard" : "/"}
                            _hover={{ textDecoration: 'none' }}>
                            ResumeAI
                        </Text>

                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <DesktopNav isAuthenticated={isAuthenticated} />
                        </Flex>
                    </Flex>

                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={4}>
                        {isAuthenticated ? (
                            <Button
                                as={'a'}
                                fontSize={'sm'}
                                fontWeight={600}
                                variant={'ghost'}
                                onClick={handleLogout}>
                                Sign Out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    as={RouterLink}
                                    fontSize={'sm'}
                                    fontWeight={600}
                                    variant={'ghost'}
                                    to={'/login'}>
                                    Sign In
                                </Button>
                                <CustomButton
                                    as={RouterLink}
                                    to={'/register'}
                                    size="sm"
                                    px={6}>
                                    Sign Up
                                </CustomButton>
                            </>
                        )}
                    </Stack>
                </Container>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav isAuthenticated={isAuthenticated} />
            </Collapse>
        </Box>
    );
}

const DesktopNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('brand.500', 'white');

    const navItems = isAuthenticated ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analyze', href: '/analyze' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Saved', href: '/saved-jobs' },
    ] : [
        { label: 'Features', href: '/' },
        { label: 'How it Works', href: '/' },
    ];

    return (
        <Stack direction={'row'} spacing={4}>
            {navItems.map((navItem) => (
                <Box key={navItem.label}>
                    <Text
                        as={RouterLink}
                        p={2}
                        to={navItem.href}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                        }}>
                        {navItem.label}
                    </Text>
                </Box>
            ))}
        </Stack>
    );
};

const MobileNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const navItems = isAuthenticated ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analyze', href: '/analyze' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Saved', href: '/saved-jobs' },
    ] : [
        { label: 'Features', href: '/' },
        { label: 'How it Works', href: '/' },
    ];

    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {navItems.map((navItem) => (
                <Stack spacing={4} key={navItem.label}>
                    <Box
                        py={2}
                        as={RouterLink}
                        to={navItem.href}
                        justifyContent="space-between"
                        alignItems="center"
                        _hover={{
                            textDecoration: 'none',
                        }}>
                        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                            {navItem.label}
                        </Text>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );
};
